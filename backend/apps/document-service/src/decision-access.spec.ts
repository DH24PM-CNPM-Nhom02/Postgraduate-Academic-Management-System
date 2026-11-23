import { ConfigService } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { DocumentServiceService } from './document-service.service.js';
import type { PrismaService } from './prisma/prisma.service.js';
import type { FileStorageService } from '../storage/file-storage.service.js';

vi.mock('../storage/file-storage.service.js', () => ({ FileStorageService: class {} }));
vi.mock('./prisma/prisma.service.js', () => ({ PrismaService: class {} }));

const student = { id: 'student-user', ncsId: 'student-profile', laNhanVien: false };
const decision = {
  id: 'decision-pdf',
  objectKey: 'decision-pdf.pdf',
  originalName: 'quyet-dinh.pdf',
  mimeType: 'application/pdf',
  size: 5n,
  status: 'ACTIVE',
  documentType: 'QUYET_DINH',
  ncsId: null,
  ownerId: 'staff-user',
};

function setup(allowed: boolean) {
  const findUnique = vi.fn().mockResolvedValue(decision);
  const download = vi.fn().mockResolvedValue(Buffer.from('%PDF-'));
  const send = vi.fn().mockReturnValue(of(allowed));
  const service = new DocumentServiceService(
    { document: { findUnique } } as unknown as PrismaService,
    { download } as unknown as FileStorageService,
    { send } as unknown as ClientProxy,
    new ConfigService({ SEAWEED_S3_BUCKET: 'fixture' }),
  );
  return { service, findUnique, download, send };
}

describe('NCS decision PDF access', () => {
  it('allows metadata and contents for a linked decision without an NCS in file metadata', async () => {
    const { service, send, download } = setup(true);
    await expect(service.layThongTin(student, decision.id)).resolves.toMatchObject({ id: decision.id });
    await expect(service.taiVe(student, decision.id)).resolves.toMatchObject({
      noiDungBase64: Buffer.from('%PDF-').toString('base64'),
    });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      { cmd: 'phd.document.is-ncs-decision' },
      { documentId: decision.id, ncsId: student.ncsId },
    );
    expect(download).toHaveBeenCalledWith(decision.objectKey);
  });

  it('denies metadata and download when the PHD service finds no link for this NCS', async () => {
    const { service, download } = setup(false);
    await expect(service.layThongTin(student, decision.id)).rejects.toHaveProperty('error.statusCode', 403);
    await expect(service.taiVe(student, decision.id)).rejects.toHaveProperty('error.statusCode', 403);
    expect(download).not.toHaveBeenCalled();
  });

  it('leaves non-decision files and files already scoped to the NCS under their existing rules', async () => {
    const { service, send, findUnique } = setup(true);
    findUnique.mockResolvedValue({ ...decision, documentType: 'DON_TU' });
    await expect(service.layThongTin(student, decision.id)).rejects.toHaveProperty('error.statusCode', 403);
    findUnique.mockResolvedValue({ ...decision, ncsId: student.ncsId });
    await expect(service.layThongTin(student, decision.id)).resolves.toMatchObject({ id: decision.id });
    expect(send).not.toHaveBeenCalled();
  });

  it('returns an error without reading the file when the PHD service is unavailable', async () => {
    const { service, send, download } = setup(false);
    send.mockReturnValue(throwError(() => new Error('Service unavailable')));
    await expect(service.taiVe(student, decision.id)).rejects.toHaveProperty('error.statusCode', 503);
    expect(download).not.toHaveBeenCalled();
  });
});

describe('GVHD access to milestone review PDFs', () => {
  const supervisor = { id: 'gvhd-user', isGvhd: true, laNhanVien: false, dsNcsGvhd: ['assigned-ncs'] };
  const review = { ...decision, id: 'review-pdf', documentType: 'PHIEU_NHAN_XET' };

  it('serves the PDF and metadata when the review belongs to a supervised student', async () => {
    const { findUnique, send, service, download } = setup(true);
    findUnique.mockResolvedValue(review);

    await expect(service.layThongTin(supervisor, review.id)).resolves.toMatchObject({ id: review.id });
    await expect(service.taiVe(supervisor, review.id)).resolves.toHaveProperty('noiDungBase64');
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      { cmd: 'phd.document.is-supervised-review' },
      { documentId: review.id, userId: supervisor.id },
    );
    expect(download).toHaveBeenCalledWith(review.objectKey);
  });

  it('denies the download when the review has no matching link in the current roster', async () => {
    const { findUnique, service, download } = setup(false);
    findUnique.mockResolvedValue({ ...review, ncsId: 'assigned-ncs' });

    await expect(service.taiVe(supervisor, review.id)).rejects.toHaveProperty('error.statusCode', 403);
    expect(download).not.toHaveBeenCalled();
  });

  it('rejects unrelated roles and fails closed if link checking is unavailable', async () => {
    const { findUnique, service, send, download } = setup(true);
    findUnique.mockResolvedValue(review);

    await expect(service.layThongTin({ ...supervisor, isGvhd: false }, review.id))
      .rejects.toHaveProperty('error.statusCode', 403);
    expect(send).not.toHaveBeenCalled();
    send.mockReturnValue(throwError(() => new Error('Service unavailable')));
    await expect(service.taiVe(supervisor, review.id)).rejects.toHaveProperty('error.statusCode', 503);
    expect(download).not.toHaveBeenCalled();
  });
});
