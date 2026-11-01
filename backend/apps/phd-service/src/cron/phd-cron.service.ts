import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { DeadlineService } from '../progress/deadline.service.js';
import { NotificationClient } from '../notification/notification.client.js';
import { goiService } from '../helpers/call-service.util.js';

@Injectable()
export class PhdCronService {
  private readonly logger = new Logger(PhdCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly deadline: DeadlineService,
    private readonly thongBao: NotificationClient,
    @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
  ) { }

  /**
   * Helper: Lấy danh sách userId của tài khoản Giáo vụ từ auth-service
   */
  private async layUserIdsGiaoVu(): Promise<string[]> {
    try {
      const giaoVus = await goiService<{ id: string }[]>(this.auth, 'auth.get-users-by-role', { role: 'GIAO_VU' });
      return Array.isArray(giaoVus) ? giaoVus.map((u) => u.id).filter(Boolean) : [];
    } catch (e) {
      this.logger.warn(`Không lấy được danh sách Giáo vụ từ auth-service: ${(e as Error).message}`);
      return [];
    }
  }

  /**
   * Helper: Lấy danh sách userId của các GVHD đang hướng dẫn hiệu lực cho 1 NCS
   */
  private async layUserIdsGvhd(ncsId: string): Promise<string[]> {
    const phanCongs = await this.prisma.phanCongHuongDan.findMany({
      where: { ncsId, trangThai: 'DANG_HIEU_LUC' },
      include: { gvhd: { select: { userId: true } } },
    });
    return phanCongs.map((p) => p.gvhd?.userId).filter((u): u is string => !!u);
  }

  /**
   * Cron 14: DeadlineReminderCron
   * Chạy hàng ngày vào lúc 06:00 sáng.
   * Quét các mốc sắp đến hạn (còn đúng 30 ngày, 15 ngày, hoặc 7 ngày) của các NCS đang học.
   * Gửi thông báo NHAC_HAN_HOC_TAP tới NCS và GVHD.
   */
  @Cron('0 6 * * *')
  async deadlineReminderCron() {
    this.logger.log('Bắt đầu chạy DeadlineReminderCron (quét hạn mốc 30/15/7 ngày)...');
    try {
      const dsNcs = await this.prisma.nghienCuuSinh.findMany({
        where: { trangThai: { in: ['DANG_HOC', 'GIA_HAN'] } },
        select: { id: true, userId: true, hoTen: true, mshv: true },
      });

      const mocNhacNho = [30, 15, 7];
      const homNayStr = new Date().toISOString().slice(0, 10);
      let soThongBaoDaGui = 0;

      for (const ncs of dsNcs) {
        try {
          const { hanHieuLucCuaMoc } = await this.deadline.tinhHanCacMoc(ncs.id);
          const gvhdUserIds = await this.layUserIdsGvhd(ncs.id);
          const recipientUserIds = [...new Set([...(ncs.userId ? [ncs.userId] : []), ...gvhdUserIds])];

          if (recipientUserIds.length === 0) continue;
          //Hàm này chuyển object thành một mảng các cặp [key, value] => [thuTuStr, infoAny]
          /*
            hanHieuLucCuaMoc
            {
              "1": {
                hanHieuLuc: '2027-05-01',
                hanCung: '2027-05-01',
                tinhTrang: 'CON_HAN'
              }
            }
          */
          for (const [thuTuStr, infoAny] of Object.entries(hanHieuLucCuaMoc)) {
            const info = infoAny as {
              hanHieuLuc: string | null;
              tinhTrang: string;
              soNgayConLai: number | null;
            };

            if (info.tinhTrang === 'DA_DAT' || !info.hanHieuLuc || info.soNgayConLai === null) {
              continue;
            }

            if (mocNhacNho.includes(info.soNgayConLai)) {
              this.thongBao.gui({
                userIds: recipientUserIds,
                loai: 'NHAC_HAN_HOC_TAP',
                duLieu: {
                  tenHan: `Mốc ${thuTuStr}`,
                  ngayHan: info.hanHieuLuc,
                  soNgayConLai: info.soNgayConLai,
                },
                khoaTrung: `NHAC_MOC:${ncs.id}:${thuTuStr}:${info.soNgayConLai}:${homNayStr}`,
              });
              soThongBaoDaGui++;
            }
          }
        } catch (err) {
          this.logger.warn(`Lỗi khi tính hạn mốc cho NCS ${ncs.mshv}: ${(err as Error).message}`);
        }
      }
      this.logger.log(`Hoàn thành DeadlineReminderCron: đã phát sinh ${soThongBaoDaGui} thông báo nhắc hạn.`);
    } catch (e) {
      this.logger.error(`Lỗi trong tiến trình DeadlineReminderCron: ${(e as Error).message}`);
    }
  }

  /**
   * Cron 15: PeriodicReportCron
   * Chạy vào 06:00 sáng ngày đầu tiên của tháng 6 và tháng 12 hàng năm (0 6 1 6,12 *).
   * Đến kỳ báo cáo tiến độ 6 tháng (Mốc 6), nhắc tất cả NCS đang học và GVHD.
   * Hạn nộp là 30/06 hoặc 31/12 của kỳ hiện tại.
   */
  @Cron('0 6 1 6,12 *')
  async periodicReportCron() {
    this.logger.log('Bắt đầu chạy PeriodicReportCron (nhắc báo cáo định kỳ tháng 6/tháng 12)...');
    try {
      const now = new Date();
      const namHienTai = now.getFullYear();
      const thangHienTai = now.getMonth() + 1; // 6 hoặc 12

      // Tính hạn nộp mốc 6: 30/06 hoặc 31/12
      const ngayHan = thangHienTai === 6 ? `${namHienTai}-06-30` : `${namHienTai}-12-31`;
      const hanDate = new Date(`${ngayHan}T23:59:59.999Z`);
      const soNgayConLai = Math.max(0, Math.ceil((hanDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

      // Lấy danh sách NCS đang học và chưa đạt mốc 6
      const dsNcs = await this.prisma.nghienCuuSinh.findMany({
        where: {
          trangThai: { in: ['DANG_HOC', 'GIA_HAN'] },
          tienTrinhs: {
            some: {
              moc: { thuTu: 6 },
              trangThai: { not: 'PASSED' },
            },
          },
        },
        select: { id: true, userId: true, hoTen: true, mshv: true },
      });

      let soThongBaoDaGui = 0;
      for (const ncs of dsNcs) {
        try {
          const gvhdUserIds = await this.layUserIdsGvhd(ncs.id);
          const recipientUserIds = [...new Set([...(ncs.userId ? [ncs.userId] : []), ...gvhdUserIds])];
          if (recipientUserIds.length === 0) continue;

          this.thongBao.gui({
            userIds: recipientUserIds,
            loai: 'NHAC_HAN_HOC_TAP',
            duLieu: {
              tenHan: 'Báo cáo tiến độ 6 tháng (Mốc 6)',
              ngayHan,
              soNgayConLai,
            },
            khoaTrung: `BC_DINH_KY:${ncs.id}:${namHienTai}:${thangHienTai}`,
          });
          soThongBaoDaGui++;
        } catch (err) {
          this.logger.warn(`Lỗi gửi thông báo báo cáo định kỳ cho NCS ${ncs.mshv}: ${(err as Error).message}`);
        }
      }
      this.logger.log(`Hoàn thành PeriodicReportCron: đã phát sinh ${soThongBaoDaGui} thông báo nhắc báo cáo.`);
    } catch (e) {
      this.logger.error(`Lỗi trong tiến trình PeriodicReportCron: ${(e as Error).message}`);
    }
  }

  /**
   * Cron 16: TrainingLimitCron
   * Chạy hàng tuần vào 06:00 sáng thứ Hai (0 6 * * 1).
   * Quét các NCS đang học còn dưới 6 tháng (<= 180 ngày) là hết thời gian đào tạo tối đa 72 tháng (hanBuocThoiHoc).
   * Gửi cảnh báo CANH_BAO_HET_HAN_DAO_TAO tới NCS và GVHD.
   */
  @Cron('0 6 * * 1')
  async trainingLimitCron() {
    this.logger.log('Bắt đầu chạy TrainingLimitCron (cảnh báo nguy cơ hết hạn đào tạo 72 tháng)...');
    try {
      const now = new Date();
      // Quét các NCS đang học
      const dsNcs = await this.prisma.nghienCuuSinh.findMany({
        where: {
          trangThai: { in: ['DANG_HOC', 'GIA_HAN'] },
        },
        select: {
          id: true,
          userId: true,
          hoTen: true,
          mshv: true,
          hanBuocThoiHoc: true,
        },
      });

      let soThongBaoDaGui = 0;
      const giaoVuUserIds = await this.layUserIdsGiaoVu();

      for (const ncs of dsNcs) {
        if (!ncs.hanBuocThoiHoc) continue;

        const soNgayConLai = Math.floor((ncs.hanBuocThoiHoc.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        // Chỉ cảnh báo nếu còn hạn và số ngày còn lại <= 180 ngày (~6 tháng)
        if (soNgayConLai <= 180 && soNgayConLai > 0) {
          const soThangConLai = Math.max(1, Math.ceil(soNgayConLai / 30));
          const gvhdUserIds = await this.layUserIdsGvhd(ncs.id);
          const recipientUserIds = [...new Set([...(ncs.userId ? [ncs.userId] : []), ...gvhdUserIds, ...giaoVuUserIds])];

          if (recipientUserIds.length === 0) continue;

          this.thongBao.gui({
            userIds: recipientUserIds,
            loai: 'CANH_BAO_HET_HAN_DAO_TAO',
            duLieu: {
              tenNcs: ncs.hoTen,
              mshv: ncs.mshv,
              hanBuocThoiHoc: ncs.hanBuocThoiHoc.toISOString().slice(0, 10),
              soThangConLai,
              soNgayConLai,
            },
            // Chỉ gửi lại cảnh báo khi chuyển sang tháng kế tiếp gần hơn
            khoaTrung: `CANH_BAO_72T:${ncs.id}:${soThangConLai}`,
          });
          soThongBaoDaGui++;
        }
      }
      this.logger.log(`Hoàn thành TrainingLimitCron: đã phát sinh ${soThongBaoDaGui} cảnh báo hạn đào tạo.`);
    } catch (e) {
      this.logger.error(`Lỗi trong tiến trình TrainingLimitCron: ${(e as Error).message}`);
    }
  }
}
