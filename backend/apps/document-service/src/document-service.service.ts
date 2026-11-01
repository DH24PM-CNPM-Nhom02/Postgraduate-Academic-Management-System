import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { createHash, randomUUID } from 'crypto';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { MAX_PDF_SIZE } from '../../../lib/contracts/src/dto/document.dto.js';
import type { DocumentTypeValue, NguoiDungTaiLieu } from '../../../lib/contracts/src/dto/document.dto.js';
import { PrismaService } from './prisma/prisma.service.js';
import { FileStorageService } from '../storage/file-storage.service.js';

@Injectable()
export class DocumentServiceService {

  // Thư mục lưu file PDF trên máy chủ (cấu hình DOCUMENT_STORAGE_DIR trong .env)
  private readonly thuMucLuu: string;
  private readonly bucket: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: FileStorageService,
    config: ConfigService,
  ) {
    this.bucket = config.getOrThrow<string>('SEAWEED_S3_BUCKET');
    this.thuMucLuu = config.get<string>('DOCUMENT_STORAGE_DIR') ?? './storage';
  }

  /**
   * Lưu một file PDF: kiểm tra quyền, kiểm tra file, ghi file xuống đĩa, lưu metadata vào database.
   * - NCS: chỉ được tải lên MINH_CHUNG_MOC, và luôn gắn vào hồ sơ NCS của chính mình
   * - Giáo vụ / Admin: tải lên mọi loại, gửi kèm ncsId của NCS liên quan
   */
  async upload(d: {
    nguoiDung: NguoiDungTaiLieu;
    documentType: DocumentTypeValue;
    ncsId?: string;
    refType?: string;
    refId?: string;
    tenFile: string;
    noiDungBase64: string;
  }) {
    // ===== xác định tài liệu này thuộc NCS nào =====
    let ncsId: string | undefined = undefined;
    if (d.nguoiDung.laNhanVien) {
      ncsId = d.ncsId;
      if (d.documentType === 'MINH_CHUNG_MOC' && !ncsId) {
        throw new RpcException({ statusCode: 400, message: 'Minh chứng phải kèm ncsId của NCS' });
      }
    } else {
      if (d.documentType !== 'MINH_CHUNG_MOC') {
        throw new RpcException({ statusCode: 403, message: 'NCS chỉ được tải lên minh chứng' });
      }
      if (!d.nguoiDung.ncsId) {
        throw new RpcException({ statusCode: 403, message: 'Bạn chưa có hồ sơ NCS' });
      }
      ncsId = d.nguoiDung.ncsId;
    }

    // =====kiểm tra file =====
    const noiDung = Buffer.from(d.noiDungBase64, 'base64');//giải mã base64 thành Buffer 
    if (noiDung.length === 0) {
      throw new RpcException({ statusCode: 400, message: 'File rỗng' });
    }
    if (noiDung.length > MAX_PDF_SIZE) {
      throw new RpcException({ statusCode: 400, message: 'File vượt quá 15MB' });
    }
    if (!d.tenFile.toLowerCase().endsWith('.pdf')) {
      throw new RpcException({ statusCode: 400, message: 'Chỉ nhận file có đuôi .pdf' });
    }
    // File PDF thật luôn bắt đầu bằng "%PDF-" ở 5 byte đầu (chặn trường hợp đổi đuôi file khác thành .pdf)
    if (noiDung.subarray(0, 5).toString('latin1') !== '%PDF-') {
      throw new RpcException({ statusCode: 400, message: 'Nội dung không phải file PDF hợp lệ' });
    }

    // =====ghi file xuống đĩa =====
    // Tên file trên đĩa do hệ thống tự đặt (không dùng tên client gửi) nên không lo đường dẫn lạ
    const id = randomUUID();
    const objectKey = `${id}.pdf`; //tạo tên file
    const checksum = createHash('sha256')
      .update(noiDung)
      .digest('hex'); //tạo hash để kiểm tra tính toàn vẹn của file
    let daUpload = false; //cờ đánh dấu đã upload

    // ===== lưu metadata, nếu lỗi thì xóa file vừa ghi để không bị rác =====
    try {
      //AWS SDK S3Client upload file lên SeaweedFS
      await this.storage.upload(
        objectKey,
        noiDung,
        'application/pdf',
      );
      daUpload = true;

      const taiLieu = await this.prisma.document.create({
        data: {
          id,
          ownerId: d.nguoiDung.id,
          ncsId,
          documentType: d.documentType,
          refType: d.refType,
          refId: d.refId,
          bucket: this.bucket,
          objectKey,
          originalName: d.tenFile,
          mimeType: 'application/pdf',
          size: noiDung.length,
          checksum: checksum,
          status: 'ACTIVE',
        },
      });

      // Không trả objectKey và bucket ra ngoài. size là BigInt nên đổi sang số để gửi được qua TCP
      return {
        id: taiLieu.id,
        documentType: taiLieu.documentType,
        ncsId: taiLieu.ncsId,
        refType: taiLieu.refType,
        refId: taiLieu.refId,
        originalName: taiLieu.originalName,
        mimeType: taiLieu.mimeType,
        size: Number(taiLieu.size),
        checksum: taiLieu.checksum,
        status: taiLieu.status,
        createdAt: taiLieu.createdAt,
      };
    } catch (error) {
      if (daUpload) {
        try {
          await this.storage.delete(objectKey);
        } catch {
          //chỗ này cần phải có cơ chế retry hoặc log để xử lý các file mồ côi, nhưng mà hệ thống hiện tại chưa cần phức tạp toiws vậy 
        }
      }
      throw error;
    }
  }

  /** Xem thông tin (metadata) của một tài liệu. */
  async layThongTin(nguoiDung: NguoiDungTaiLieu, id: string) {
    const taiLieu = await this.prisma.document.findUnique({ where: { id } });
    if (!taiLieu || taiLieu.status !== 'ACTIVE') {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài liệu' });
    }
    // NCS chỉ xem được tài liệu thuộc hồ sơ của mình
    if (!nguoiDung.laNhanVien && (!taiLieu.ncsId || taiLieu.ncsId !== nguoiDung.ncsId)) {
      throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền xem tài liệu này' });
    }

    return {
      id: taiLieu.id,
      documentType: taiLieu.documentType,
      ncsId: taiLieu.ncsId,
      refType: taiLieu.refType,
      refId: taiLieu.refId,
      originalName: taiLieu.originalName,
      mimeType: taiLieu.mimeType,
      size: Number(taiLieu.size),
      checksum: taiLieu.checksum,
      status: taiLieu.status,
      createdAt: taiLieu.createdAt,
    };
  }

  /** Lấy nội dung file để tải về (trả dạng base64 để gửi qua TCP, gateway sẽ đổi lại thành file). */
  async taiVe(nguoiDung: NguoiDungTaiLieu, id: string) {
    const taiLieu = await this.prisma.document.findUnique({ where: { id } });
    if (!taiLieu || taiLieu.status !== 'ACTIVE') {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài liệu' });
    }
    if (!nguoiDung.laNhanVien && (!taiLieu.ncsId || taiLieu.ncsId !== nguoiDung.ncsId)) {
      throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền tải tài liệu này' });
    }

    let noiDung: Buffer;
    try {
      noiDung = await this.storage.download(taiLieu.objectKey); //lấy obj key trong db chứ k lấy từ client 
    } catch {
      throw new RpcException({ statusCode: 404, message: 'File không còn trên máy chủ' });
    }

    return {
      originalName: taiLieu.originalName,
      mimeType: taiLieu.mimeType,
      noiDungBase64: noiDung.toString('base64'), //chuyển buffer thành base64
    };
  }

  /** Xóa mềm: chỉ đổi trạng thái thành DELETED, file vẫn giữ trên đĩa. Chỉ Giáo vụ / Admin. */
  async xoa(nguoiDung: NguoiDungTaiLieu, id: string) {
    if (!nguoiDung.laNhanVien) {
      throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền xóa tài liệu' });
    }

    const taiLieu = await this.prisma.document.findUnique({ where: { id } });
    if (!taiLieu || taiLieu.status !== 'ACTIVE') {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài liệu' });
    }

    await this.prisma.document.update({
      where: { id },
      data: { status: 'DELETED', deletedAt: new Date() },
    });
    return { id, status: 'DELETED' };
  }
}