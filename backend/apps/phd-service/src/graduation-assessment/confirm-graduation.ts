import { ngayChuoi } from '../helpers/validateData.util.js';

// NCS đang ở các trạng thái này thì mới được xét tốt nghiệp
export const TRANG_THAI_DUOC_XET = ['DANG_HOC', 'GIA_HAN'];

// Dữ liệu cần để xét tốt nghiệp của 1 NCS
export type NcsDeXet = {
    id: string;
    mshv: string;
    hoTen: string;
    trangThai: string;
    hanBuocThoiHoc: Date;
    tienTrinhs: { trangThai: string; passedAt: Date | null; moc: { thuTu: number } }[];
    xetTotNghiep: {
        trangThai: string;
        datNgoaiNgu: boolean;
        chuanDauRaNgoaiNgu: string | null;
        ngayCongNhanNgoaiNgu: Date | null;
        ngoaiNguNgayXacNhan: Date | null;
        ngoaiNguDocumentId: string | null;
        khongConCongNo: boolean;
        congNoNgayXacNhan: Date | null;
        congNoGhiChu: string | null;
        congNoDocumentId: string | null;
    } | null;
};

export type DieuKien = {
    ma: string;
    ten: string;
    dat: boolean;
    ghiChu: string;
    fileId?: string | null;
};

// Tính kết quả xét tốt nghiệp của 1 NCS. Không đọc DB, không sửa dữ liệu.
// tongMoc: tổng số mốc của chương trình; soDeNghiCho: số đề nghị điều chỉnh đang chờ duyệt
export function tinhKetQuaTotNghiep(ncs: NcsDeXet, tongMoc: number, soDeNghiCho: number, homNay = new Date()) {
    const xet = ncs.xetTotNghiep;

    // 1. Đủ các mốc (việc mở mốc theo thứ tự đã do hệ thống khóa mốc đảm bảo)
    const soMocDat = ncs.tienTrinhs.filter((t) => t.trangThai === 'PASSED').length;
    const daXongMoc = tongMoc > 0 && soMocDat === tongMoc;

    // 2. Hạn 72 tháng: so ngày đạt mốc cuối với hạn buộc thôi học (chưa xong mốc thì so với hôm nay)
    const mocCuoi = [...ncs.tienTrinhs].sort((a, b) => b.moc.thuTu - a.moc.thuTu)[0];
    const ngayXet = daXongMoc && mocCuoi?.passedAt ? mocCuoi.passedAt : homNay;
    const ngayXetChuoi = ngayChuoi(ngayXet)!;
    const hanChuoi = ngayChuoi(ncs.hanBuocThoiHoc)!;

    const dieuKien: DieuKien[] = [
        {
            ma: 'HOAN_THANH_MOC',
            ten: 'Hoàn thành tất cả các mốc',
            dat: daXongMoc,
            ghiChu: `Đã đạt ${soMocDat}/${tongMoc} mốc`,
        },
        {
            ma: 'TRANG_THAI_HOC_TAP',
            ten: 'Đang học (không bảo lưu, ngừng học, buộc thôi học)',
            dat: TRANG_THAI_DUOC_XET.includes(ncs.trangThai),
            ghiChu: `Trạng thái hiện tại: ${ncs.trangThai}`,
        },
        {
            ma: 'THOI_HAN',
            ten: 'Chưa quá thời gian đào tạo tối đa (72 tháng)',
            dat: ngayXetChuoi <= hanChuoi,
            ghiChu: `${daXongMoc ? 'Ngày đạt mốc cuối' : 'Hôm nay'}: ${ngayXetChuoi}, hạn tối đa: ${hanChuoi}`,
        },
        {
            ma: 'NGOAI_NGU',
            ten: 'Đạt chuẩn đầu ra ngoại ngữ',
            dat: xet?.datNgoaiNgu ?? false,
            ghiChu: xet?.datNgoaiNgu
                ? `${xet.chuanDauRaNgoaiNgu}, công nhận ngày ${ngayChuoi(xet.ngayCongNhanNgoaiNgu)}`
                : xet?.ngoaiNguNgayXacNhan
                    ? 'Giáo vụ đã xác nhận: chưa đạt'
                    : 'Giáo vụ chưa xác nhận',
            fileId: xet?.ngoaiNguDocumentId ?? null,
        },
        {
            ma: 'CONG_NO',
            ten: 'Hoàn thành nghĩa vụ tài chính (không còn công nợ)',
            dat: xet?.khongConCongNo ?? false,
            ghiChu: xet?.khongConCongNo
                ? 'Không còn công nợ'
                : xet?.congNoNgayXacNhan
                    ? `Giáo vụ đã xác nhận: còn công nợ${xet.congNoGhiChu ? ` (${xet.congNoGhiChu})` : ''}`
                    : 'Giáo vụ chưa xác nhận',
            fileId: xet?.congNoDocumentId ?? null,
        },
        {
            ma: 'DE_NGHI_CHO_DUYET',
            ten: 'Không còn đề nghị điều chỉnh đang chờ duyệt',
            dat: soDeNghiCho === 0,
            ghiChu: soDeNghiCho === 0 ? 'Không có đề nghị nào đang chờ' : `${soDeNghiCho} đề nghị đang chờ duyệt`,
        },
    ];

    return {
        ncsId: ncs.id,
        mshv: ncs.mshv,
        hoTen: ncs.hoTen,
        trangThaiHocTap: ncs.trangThai,
        daDuyetTotNghiep: xet?.trangThai === 'DA_DUYET',
        duDieuKien: dieuKien.every((k) => k.dat),
        dieuKien,
    };
}