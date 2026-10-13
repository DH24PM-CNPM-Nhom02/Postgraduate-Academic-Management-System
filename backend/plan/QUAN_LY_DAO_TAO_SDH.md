# QUAN_LY_DAO_TAO_SDH --- Bản Markdown dành cho AI

> Nguồn: `QUAN_LY_DAO_TAO_SDH.xlsx`. Bản chuyển đổi giữ lại nội dung dữ
> liệu có trong workbook; không tự sửa hoặc suy diễn dữ liệu nghiệp vụ.
> Ô trống được biểu diễn là `null`. Ngày tháng dùng định dạng
> `YYYY-MM-DD`. Với ô có công thức, phần DASHBOARD ghi cả công thức và
> giá trị đã lưu trong workbook nếu có.

## Mục lục

1.  [Tổng quan](#tổng-quan)
2.  [DASHBOARD](#dashboard)
3.  [GIANGVIEN](#giangvien)
4.  [HOCVIEN](#hocvien)
5.  [LUAN_VAN](#luan_van)

## Tổng quan

-   Số sheet: 4
-   `DASHBOARD`: sheet tổng hợp/công thức.
-   `GIANGVIEN`: 116 dòng dữ liệu có nội dung; 13 cột.
-   `HOCVIEN`: 432 dòng dữ liệu có nội dung; 29 cột.
-   `LUAN_VAN`: khoảng 284 dòng dữ liệu sau hàng tiêu đề.

## DASHBOARD

Sheet này chứa tiêu đề báo cáo, nhãn thống kê và công thức Excel. Nội
dung được ghi theo tọa độ ô để giữ nguyên cấu trúc.

-   `B2`: BÁO CÁO TỔNG HỢP VÀ PHÂN TÍCH DỮ LIỆU
-   `B3`: Hệ thống theo dõi đào tạo Sau đại học \| Dữ liệu cập nhật toàn
    khóa
-   `B5`: Đội ngũ
-   `B6`: Giáo sư; `C6`: công thức
    `=countif(GIANGVIEN!$M$2:$M$117,"Giáo sư")`; giá trị lưu sẵn: `1`
-   `B7`: Phó giáo sư; `C7`: công thức
    `=countif(GIANGVIEN!$M$2:$M$117,"Phó giáo sư")`; giá trị lưu sẵn:
    `14`
-   `B8`: Tiến sĩ; `C8`: công thức `=counta(GIANGVIEN!$C$2:$C$117)`; giá
    trị lưu sẵn: `116`

## GIANGVIEN

Tổng số cột: 13.

### Bản ghi 1 (hàng Excel 2)

-   **STT**: 1
-   **hoten**: Huỳnh Kỳ Phương Hạ
-   **t_dvi**: Ban Giám hiệu
-   **dvi.ten**: Ban Giám hiệu
-   **gioitinh**: Nam
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Hóa
-   **t_hham**: Giáo sư

### Bản ghi 2 (hàng Excel 3)

-   **STT**: 2
-   **shcc**: D4300276.010803
-   **hoten**: Trần Văn Đạt
-   **t_dvi**: Đảng ủy
-   **dvi.ten**: Đảng ủy
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1978-04-02
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục học
-   **ten_qg**: Úc
-   **t_hham**: Phó Giáo sư

### Bản ghi 3 (hàng Excel 4)

-   **STT**: 3
-   **shcc**: D4300750.030605
-   **hoten**: Nguyễn Hữu Trí
-   **t_dvi**: Ban Giám hiệu
-   **dvi.ten**: Ban Giám hiệu
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1979-01-06
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Môi trường và Nghiên cứu Tài nguyên
-   **ten_qg**: Thái Lan

### Bản ghi 4 (hàng Excel 5)

-   **STT**: 4
-   **shcc**: D4300090.040901
-   **hoten**: Nguyễn Phương Thảo
-   **t_dvi**: Ban Giám hiệu
-   **dvi.ten**: Ban Giám hiệu
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1982-02-15
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học giáo dục
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 5 (hàng Excel 6)

-   **STT**: 5
-   **shcc**: D4300273.050901
-   **hoten**: Nguyễn Văn Mện
-   **t_dvi**: Phòng Đào tạo
-   **dvi.ten**: Phòng Đào tạo
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1983-01-01
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Vật lý lý thuyết và vật lý toán
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 6 (hàng Excel 7)

-   **STT**: 6
-   **shcc**: D4300313.080101
-   **hoten**: Huỳnh Phước Hải
-   **t_dvi**: Phòng Đào tạo
-   **dvi.ten**: Phòng Đào tạo
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1985-12-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Hệ thống thông tin
-   **ten_qg**: Việt Nam

### Bản ghi 7 (hàng Excel 8)

-   **STT**: 7
-   **shcc**: D4300332.040910
-   **hoten**: Lý Ngọc Thanh Xuân
-   **t_dvi**: Phòng Quản trị - Thiết bị
-   **dvi.ten**: Phòng Quản trị - Thiết bị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1980-11-20
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Đất
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 8 (hàng Excel 9)

-   **STT**: 8
-   **shcc**: D4300334.020906
-   **hoten**: Nguyễn Thị Ngọc Giang
-   **t_dvi**: Bộ phận Quản lý khu Thí nghiệm - Thực hành - Phòng QT-TB
-   **dvi.ten**: Phòng Quản trị - Thiết bị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1981-06-26
-   **ma_ngach**: 15113
-   **ten_ngach**: Giáo viên trung học
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ thực phẩm
-   **ten_qg**: Việt Nam

### Bản ghi 9 (hàng Excel 10)

-   **STT**: 9
-   **shcc**: D4300314.070502
-   **hoten**: Nguyễn Trung Thành
-   **t_dvi**: Phòng Khoa học và Công nghệ
-   **dvi.ten**: Phòng Khoa học và Công nghệ
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1980-03-24
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ hoá học
-   **ten_qg**: Đài Loan
-   **t_hham**: Phó Giáo sư

### Bản ghi 10 (hàng Excel 11)

-   **STT**: 10
-   **shcc**: D4300290.050905
-   **hoten**: Trần Lê Đăng Phương
-   **t_dvi**: Lãnh đạo Khoa Luật và Khoa học chính trị
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1977-08-11
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Luật Tư pháp
-   **ten_qg**: Pháp

### Bản ghi 11 (hàng Excel 12)

-   **STT**: 11
-   **shcc**: D4300050.850805
-   **hoten**: Võ Văn Thắng
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1964-04-14
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Triết học
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 12 (hàng Excel 13)

-   **STT**: 12
-   **shcc**: D4300230.080904
-   **hoten**: Nguyễn Chí Hải
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1985-01-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chính trị học
-   **ten_qg**: Việt Nam

### Bản ghi 13 (hàng Excel 14)

-   **STT**: 13
-   **shcc**: D432009.0905134
-   **hoten**: Nguyễn Phan Thị Thùy Dung
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1986-10-25
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Triết học
-   **ten_qg**: Việt Nam

### Bản ghi 14 (hàng Excel 15)

-   **STT**: 14
-   **shcc**: D432009.0912003
-   **hoten**: Tạ Văn Sang
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1985-09-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Hồ Chí Minh học
-   **ten_qg**: Việt Nam

### Bản ghi 15 (hàng Excel 16)

-   **STT**: 15
-   **shcc**: D432009.0905124
-   **hoten**: Nguyễn Thị Minh Hải
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1985-05-18
-   **ma_ngach**: 1002
-   **ten_ngach**: Chuyên viên chính
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chủ nghĩa Duy vật Biện chứng và Chủ nghĩa Duy vật Lịch
    sử
-   **ten_qg**: Việt Nam

### Bản ghi 16 (hàng Excel 17)

-   **STT**: 16
-   **shcc**: D4300210.030603
-   **hoten**: Trần Thị Thu Nguyệt
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1980-10-11
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Xã hội học
-   **ten_qg**: Úc

### Bản ghi 17 (hàng Excel 18)

-   **STT**: 17
-   **shcc**: D4300210.061101
-   **hoten**: Đỗ Thị Thanh Hà
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1984-12-31
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chủ nghĩa Duy vật Biện chứng và Chủ nghĩa Duy vật Lịch
    sử
-   **ten_qg**: Việt Nam

### Bản ghi 18 (hàng Excel 19)

-   **STT**: 18
-   **shcc**: D4300210.030602
-   **hoten**: Trần Đình Phụng
-   **t_dvi**: Bộ môn Khoa học Chính trị - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1978-09-26
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục chính trị tư tưởng
-   **ten_qg**: Trung Quốc

### Bản ghi 19 (hàng Excel 20)

-   **STT**: 19
-   **shcc**: D4300292.080101
-   **hoten**: Phạm Yến Nhi
-   **t_dvi**: Bộ môn Luật - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1984-12-17
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Luật kinh tế
-   **ten_qg**: Việt Nam

### Bản ghi 20 (hàng Excel 21)

-   **STT**: 20
-   **shcc**: D4300210.051001
-   **hoten**: Huỳnh Anh
-   **t_dvi**: Bộ môn Luật - Khoa Luật & KHCT
-   **dvi.ten**: Khoa Luật và Khoa học chính trị
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1979-01-23
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Luật kinh tế
-   **ten_qg**: Việt Nam

### Bản ghi 21 (hàng Excel 22)

-   **STT**: 21
-   **shcc**: D4300230.080902
-   **hoten**: Nguyễn Văn Thạnh
-   **t_dvi**: Bộ môn Giáo dục quốc phòng
-   **dvi.ten**: Bộ môn Giáo dục quốc phòng
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1985-12-30
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Triết học
-   **ten_qg**: Việt Nam

### Bản ghi 22 (hàng Excel 23)

-   **STT**: 22
-   **shcc**: D4300230.080903
-   **hoten**: Nguyễn Hồ Thanh
-   **t_dvi**: Bộ môn Giáo dục quốc phòng
-   **dvi.ten**: Bộ môn Giáo dục quốc phòng
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-01-05
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chính trị học
-   **ten_qg**: Việt Nam

### Bản ghi 23 (hàng Excel 24)

-   **STT**: 23
-   **shcc**: D432009.0908019
-   **hoten**: Đào Chánh Thức
-   **t_dvi**: Bộ môn Giáo dục thể chất
-   **dvi.ten**: Bộ môn Giáo dục thể chất
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-12-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục học
-   **ten_qg**: Việt Nam

### Bản ghi 24 (hàng Excel 25)

-   **STT**: 24
-   **shcc**: D4300250.121101
-   **hoten**: Hàng Quang Thái
-   **t_dvi**: Bộ môn Giáo dục thể chất
-   **dvi.ten**: Bộ môn Giáo dục thể chất
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1980-02-21
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục thể chất
-   **ten_qg**: Trung Quốc

### Bản ghi 25 (hàng Excel 26)

-   **STT**: 25
-   **shcc**: D4300110.061001
-   **hoten**: Phạm Văn Hận
-   **t_dvi**: Bộ môn Giáo dục thể chất
-   **dvi.ten**: Bộ môn Giáo dục thể chất
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1983-11-25
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục thể chất
-   **ten_qg**: Ba Lan

### Bản ghi 26 (hàng Excel 27)

-   **STT**: 26
-   **shcc**: D432009.0907044
-   **hoten**: Lê Ngọc Quỳnh
-   **t_dvi**: Lãnh đạo Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1987-11-15
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Toán học
-   **ten_qg**: Việt Nam

### Bản ghi 27 (hàng Excel 28)

-   **STT**: 27
-   **shcc**: D4300277.060903
-   **hoten**: Trần Thế Định
-   **t_dvi**: Lãnh đạo Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1983-09-23
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Địa lí
-   **ten_qg**: Việt Nam

### Bản ghi 28 (hàng Excel 29)

-   **STT**: 28
-   **shcc**: D4300272.040923
-   **hoten**: Võ Thành Tài
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1982-07-05
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Toán ứng dụng
-   **ten_qg**: Việt Nam

### Bản ghi 29 (hàng Excel 30)

-   **STT**: 29
-   **shcc**: D4300272.001101
-   **hoten**: Vương Vĩnh Phát
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1978-07-30
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: LL&PPGD môn Toán
-   **ten_qg**: Việt Nam

### Bản ghi 30 (hàng Excel 31)

-   **STT**: 30
-   **shcc**: D432009.0907046
-   **hoten**: Phan Văn Long Em
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1987-10-25
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Hệ động lực
-   **ten_qg**: Việt Nam

### Bản ghi 31 (hàng Excel 32)

-   **STT**: 31
-   **shcc**: D4300272.020906
-   **hoten**: Phạm Thị Thu Hường
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1981-06-23
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Lý thuyết xác suất và Thống kê toán học
-   **ten_qg**: Úc

### Bản ghi 32 (hàng Excel 33)

-   **STT**: 32
-   **shcc**: D4300272.020905
-   **hoten**: Phạm Thị Thu Hoa
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1981-06-23
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Lý thuyết xác suất và Thống kê toán học
-   **ten_qg**: Úc

### Bản ghi 33 (hàng Excel 34)

-   **STT**: 33
-   **shcc**: D4300170.040910
-   **hoten**: Phạm Mỹ Hạnh
-   **t_dvi**: Bộ môn Toán học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1982-08-18
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Toán ứng dụng
-   **ten_qg**: Việt Nam

### Bản ghi 34 (hàng Excel 35)

-   **STT**: 34
-   **shcc**: D4300273.061103
-   **hoten**: Trần Quốc Duyệt
-   **t_dvi**: Bộ môn Vật lý - Hóa học - Sinh học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1984-12-15
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Toán học
-   **ten_qg**: Úc

### Bản ghi 35 (hàng Excel 36)

-   **STT**: 35
-   **shcc**: D4300274.020903
-   **hoten**: Trang Quang Vinh
-   **t_dvi**: Bộ môn Vật lý - Hóa học - Sinh học - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1981-12-25
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: LL&PPGD môn Hóa học
-   **ten_qg**: Việt Nam

### Bản ghi 36 (hàng Excel 37)

-   **STT**: 36
-   **shcc**: D4300770.950911
-   **hoten**: Tiêu Minh Đương
-   **t_dvi**: Bộ môn Ngữ văn - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1972-06-12
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Văn nghệ học (Lý luận văn học và nghệ thuật)
-   **ten_qg**: Trung Quốc

### Bản ghi 37 (hàng Excel 38)

-   **STT**: 37
-   **shcc**: D4300350.100804
-   **hoten**: Huỳnh Thị Diễm
-   **t_dvi**: Bộ môn Ngữ văn - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1983-09-19
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Văn học nước ngoài
-   **ten_qg**: Việt Nam

### Bản ghi 38 (hàng Excel 39)

-   **STT**: 38
-   **shcc**: D4300277.080905
-   **hoten**: Dương Thế Hiền
-   **t_dvi**: Bộ môn Lịch sử - Địa lý - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1985-07-16
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Lịch sử Việt Nam
-   **ten_qg**: Việt Nam

### Bản ghi 39 (hàng Excel 40)

-   **STT**: 39
-   **shcc**: D4300277.080901
-   **hoten**: Tô Minh Châu
-   **t_dvi**: Bộ môn Lịch sử - Địa lý - Khoa Sư phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-10-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản lý Tài nguyên và Môi trường
-   **ten_qg**: Việt Nam

### Bản ghi 40 (hàng Excel 41)

-   **STT**: 40
-   **shcc**: D4300275.870911
-   **hoten**: Nguyễn Bách Thắng
-   **t_dvi**: Bộ môn Tâm lý Giáo dục - Mầm non - Tiểu học - Khoa Sư
    phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1966-01-19
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học giáo dục
-   **ten_qg**: Việt Nam

### Bản ghi 41 (hàng Excel 42)

-   **STT**: 41
-   **shcc**: D4300273.050902
-   **hoten**: Nguyễn Phạm Ngọc Thiện
-   **t_dvi**: Bộ môn Tâm lý Giáo dục - Mầm non - Tiểu học - Khoa Sư
    phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1983-04-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học giáo dục
-   **ten_qg**: Đài Loan

### Bản ghi 42 (hàng Excel 43)

-   **STT**: 42
-   **shcc**: D4300050.050902
-   **hoten**: Võ Văn Dễ
-   **t_dvi**: Bộ môn Tâm lý Giáo dục - Mầm non - Tiểu học - Khoa Sư
    phạm
-   **dvi.ten**: Khoa Sư phạm
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1981-01-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học giáo dục
-   **ten_qg**: Hungary

### Bản ghi 43 (hàng Excel 44)

-   **STT**: 43
-   **shcc**: D4300290.050902
-   **hoten**: Đặng Hùng Vũ
-   **t_dvi**: Lãnh đạo Khoa Kinh tế - Quản trị Kinh doanh
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1978-09-10
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kinh doanh quốc tế
-   **ten_qg**: New Zealand

### Bản ghi 44 (hàng Excel 45)

-   **STT**: 44
-   **shcc**: D4300070.891201
-   **hoten**: Tô Thiện Hiền
-   **t_dvi**: Lãnh đạo Khoa Kinh tế - Quản trị Kinh doanh
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1966-02-16
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kinh tế tài chính, ngân hàng
-   **ten_qg**: Việt Nam

### Bản ghi 45 (hàng Excel 46)

-   **STT**: 45
-   **shcc**: D4300292.030613
-   **hoten**: Nguyễn Lan Duyên
-   **t_dvi**: Bộ môn Kinh tế - Tổng hợp - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1980-01-23
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kinh tế nông nghiệp
-   **ten_qg**: Việt Nam

### Bản ghi 46 (hàng Excel 47)

-   **STT**: 46
-   **shcc**: D4300292.010605
-   **hoten**: Phùng Ngọc Triều
-   **t_dvi**: Bộ môn Kinh tế - Tổng hợp - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1974-10-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kinh tế phát triển
-   **ten_qg**: Việt Nam

### Bản ghi 47 (hàng Excel 48)

-   **STT**: 47
-   **shcc**: D4300290.081201
-   **hoten**: Châu Hồng Phương Thảo
-   **t_dvi**: Bộ môn Tài chính - Kế toán - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1985-01-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kế toán
-   **ten_qg**: Việt Nam

### Bản ghi 48 (hàng Excel 49)

-   **STT**: 48
-   **shcc**: D4300293.111002
-   **hoten**: Nguyễn Thị Kim Anh
-   **t_dvi**: Bộ môn Tài chính - Kế toán - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1989-10-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Tài chính ngân hàng
-   **ten_qg**: Việt Nam

### Bản ghi 49 (hàng Excel 50)

-   **STT**: 49
-   **shcc**: D4300070.001203
-   **hoten**: Nguyễn Thị Vạn Hạnh
-   **t_dvi**: Bộ môn Tài chính - Kế toán - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1977-05-14
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Tài chính ngân hàng
-   **ten_qg**: Việt Nam

### Bản ghi 50 (hàng Excel 51)

-   **STT**: 50
-   **shcc**: D4300292.001101
-   **hoten**: Lưu Thị Thái Tâm
-   **t_dvi**: Bộ môn Quản trị Marketing - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1977-07-08
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản trị kinh doanh
-   **ten_qg**: Việt Nam

### Bản ghi 51 (hàng Excel 52)

-   **STT**: 51
-   **shcc**: D4300294.151101
-   **hoten**: Đoàn Vinh Thăng
-   **t_dvi**: Bộ môn Quản trị Marketing - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1988-10-10
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản trị kinh doanh
-   **ten_qg**: Việt Nam

### Bản ghi 52 (hàng Excel 53)

-   **STT**: 52
-   **shcc**: D432009.0905005
-   **hoten**: Trần Thị Mỹ Phương
-   **t_dvi**: Bộ môn Quản trị Marketing - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1987-01-12
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản trị kinh doanh
-   **ten_qg**: Việt Nam

### Bản ghi 53 (hàng Excel 54)

-   **STT**: 53
-   **shcc**: D4300294.081201
-   **hoten**: Trịnh Hoàng Anh
-   **t_dvi**: Bộ môn Quản trị Marketing - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1984-01-06
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản trị kinh doanh
-   **ten_qg**: Việt Nam

### Bản ghi 54 (hàng Excel 55)

-   **STT**: 54
-   **shcc**: D4300292.101101
-   **hoten**: Hồ Bạch Nhật
-   **t_dvi**: Bộ môn Quản trị Marketing - Khoa KT-QTKD
-   **dvi.ten**: Khoa Kinh tế - Quản trị kinh doanh
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1987-11-21
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Quản trị kinh doanh
-   **ten_qg**: Việt Nam

### Bản ghi 55 (hàng Excel 56)

-   **STT**: 55
-   **shcc**: D4300314.040910
-   **hoten**: Nguyễn Thanh Hùng
-   **t_dvi**: Lãnh đạo Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1980-08-11
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật môi trường, khai thác mỏ, năng lượng
-   **ten_qg**: Ba Lan

### Bản ghi 56 (hàng Excel 57)

-   **STT**: 56
-   **shcc**: D4300314.080101
-   **hoten**: Phan Trường Khanh
-   **t_dvi**: Lãnh đạo Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1977-12-30
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học môi trường và bảo vệ môi trường
-   **ten_qg**: Sri Lanka
-   **t_hham**: Phó Giáo sư

### Bản ghi 57 (hàng Excel 58)

-   **STT**: 57
-   **shcc**: D432009.0905088
-   **hoten**: Phan Phước Toàn
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1987-03-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật môi trường
-   **ten_qg**: Việt Nam

### Bản ghi 58 (hàng Excel 59)

-   **STT**: 58
-   **shcc**: D4300314.101102
-   **hoten**: Trần Ngọc Châu
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1985-12-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Hệ thống Công nghiệp và Kỹ thuật Môi trường
-   **ten_qg**: Thái Lan

### Bản ghi 59 (hàng Excel 60)

-   **STT**: 59
-   **shcc**: D4300314.040908
-   **hoten**: Nguyễn Trần Thiện Khánh
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1978-03-17
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học và Kỹ thuật môi trường
-   **ten_qg**: Nhật Bản

### Bản ghi 60 (hàng Excel 61)

-   **STT**: 60
-   **shcc**: D4300314.121101
-   **hoten**: Nguyễn Hồng Nhật
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1987-07-18
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Môi trường nước và vệ sinh môi trường
-   **ten_qg**: Nhật Bản

### Bản ghi 61 (hàng Excel 62)

-   **STT**: 61
-   **shcc**: D432009.0907036
-   **hoten**: Bùi Thị Mai Phụng
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1978-09-29
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Môi trường đất và nước
-   **ten_qg**: Việt Nam

### Bản ghi 62 (hàng Excel 63)

-   **STT**: 62
-   **shcc**: D4300312.210201
-   **hoten**: Trần Lê Ba
-   **t_dvi**: Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1991-05-16
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật môi trường
-   **ten_qg**: Việt Nam

### Bản ghi 63 (hàng Excel 64)

-   **STT**: 63
-   **shcc**: D4300273.080902
-   **hoten**: Trịnh Thị Hồng
-   **t_dvi**: Bộ môn Kỹ thuật Vật liệu và Hóa - Sinh - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1982-07-01
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Vật lý lý thuyết và vật lý toán
-   **ten_qg**: Việt Nam

### Bản ghi 64 (hàng Excel 65)

-   **STT**: 64
-   **shcc**: D4300310.241001
-   **hoten**: Phạm Ngọc Thanh
-   **t_dvi**: Bộ môn Kỹ thuật Vật liệu và Hóa - Sinh - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1993-08-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa Học và Công Nghệ Chính Xác và Vật lý ứng dụng
-   **ten_qg**: Nhật Bản

### Bản ghi 65 (hàng Excel 66)

-   **STT**: 65
-   **shcc**: D4300314.101101
-   **hoten**: Ngô Thúy An
-   **t_dvi**: Bộ môn Kỹ thuật Vật liệu và Hóa - Sinh - Khoa KT-CN-MT
-   **dvi.ten**: Khoa Kỹ thuật - Công nghệ - Môi trường
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1986-06-09
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật đất nông nghiệp
-   **ten_qg**: Nhật Bản

### Bản ghi 66 (hàng Excel 67)

-   **STT**: 66
-   **shcc**: D4300337.010601
-   **hoten**: Phan Phương Loan
-   **t_dvi**: Lãnh đạo Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1977-07-12
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Nuôi trồng thủy sản
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 67 (hàng Excel 68)

-   **STT**: 67
-   **shcc**: D4300334.010604
-   **hoten**: Nguyễn Duy Tân
-   **t_dvi**: Lãnh đạo Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1974-05-04
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ thực phẩm
-   **ten_qg**: Việt Nam

### Bản ghi 68 (hàng Excel 69)

-   **STT**: 68
-   **shcc**: D4300333.010602
-   **hoten**: Phạm Huỳnh Thanh Vân
-   **t_dvi**: Lãnh đạo Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1978-10-04
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Nghiên cứu phát triển (Cục KĐCL)
-   **ten_qg**: Indonesia

### Bản ghi 69 (hàng Excel 70)

-   **STT**: 69
-   **shcc**: D4300332.030608
-   **hoten**: Trần Văn Hiếu
-   **t_dvi**: Bộ môn Phát triển nông thôn & Nông nghiệp bền vững - Khoa
    NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1979-09-02
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Phát triển nông thôn
-   **ten_qg**: Việt Nam

### Bản ghi 70 (hàng Excel 71)

-   **STT**: 70
-   **shcc**: D4300332.011009
-   **hoten**: Phạm Văn Quang
-   **t_dvi**: Bộ môn Phát triển nông thôn & Nông nghiệp bền vững - Khoa
    NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1968-01-11
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật đất đai và nguồn tài nguyên nước
-   **ten_qg**: Thụy Điển
-   **t_hham**: Phó Giáo sư

### Bản ghi 71 (hàng Excel 72)

-   **STT**: 71
-   **shcc**: D4300332.020504
-   **hoten**: Phạm Xuân Phú
-   **t_dvi**: Bộ môn Phát triển nông thôn & Nông nghiệp bền vững - Khoa
    NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1976-11-03
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Phát triển nông thôn
-   **ten_qg**: Việt Nam

### Bản ghi 72 (hàng Excel 73)

-   **STT**: 72
-   **shcc**: D4300333.030609
-   **hoten**: Lê Hữu Phước
-   **t_dvi**: Bộ môn Khoa học Cây trồng - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1980-08-19
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Nông học
-   **ten_qg**: Indonesia

### Bản ghi 73 (hàng Excel 74)

-   **STT**: 73
-   **shcc**: D4300333.020507
-   **hoten**: Trần Văn Khải
-   **t_dvi**: Bộ môn Khoa học Cây trồng - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1974-03-24
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Cây trồng
-   **ten_qg**: Việt Nam

### Bản ghi 74 (hàng Excel 75)

-   **STT**: 74
-   **shcc**: D4300333.001101
-   **hoten**: Nguyễn Phú Dũng
-   **t_dvi**: Bộ môn Khoa học Cây trồng - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1975-10-30
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Nông học
-   **ten_qg**: Việt Nam

### Bản ghi 75 (hàng Excel 76)

-   **STT**: 75
-   **shcc**: D4300330.260201
-   **hoten**: Bùi Phước Tâm
-   **t_dvi**: Bộ môn Khoa học Cây trồng - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1987-08-16
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ sinh học
-   **ten_qg**: Việt Nam

### Bản ghi 76 (hàng Excel 77)

-   **STT**: 76
-   **shcc**: D4300334.040910
-   **hoten**: Nguyễn Văn Chương
-   **t_dvi**: Bộ môn Khoa học Cây trồng - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1965-09-09
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Đất
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 77 (hàng Excel 78)

-   **STT**: 77
-   **shcc**: D4300334.061101
-   **hoten**: Trần Nghĩa Khang
-   **t_dvi**: Bộ môn Công nghệ thực phẩm - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1983-08-18
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học và Công nghệ thực phẩm
-   **ten_qg**: Úc

### Bản ghi 78 (hàng Excel 79)

-   **STT**: 78
-   **shcc**: D4300330.050904
-   **hoten**: Hồ Thị Ngân Hà
-   **t_dvi**: Bộ môn Công nghệ thực phẩm - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1983-04-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ thực phẩm
-   **ten_qg**: Việt Nam

### Bản ghi 79 (hàng Excel 80)

-   **STT**: 79
-   **shcc**: D4300334.001101
-   **hoten**: Trần Phương Lan
-   **t_dvi**: Bộ môn Công nghệ thực phẩm - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1973-06-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Môi trường con người
-   **ten_qg**: Hàn Quốc

### Bản ghi 80 (hàng Excel 81)

-   **STT**: 80
-   **shcc**: D4300334.021007
-   **hoten**: Cao Thị Luyến
-   **t_dvi**: Bộ môn Công nghệ thực phẩm - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1978-12-29
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học và công nghệ thực phẩm
-   **ten_qg**: Hàn Quốc

### Bản ghi 81 (hàng Excel 82)

-   **STT**: 81
-   **shcc**: D4300335.040906
-   **hoten**: Nguyễn Thị Mỹ Duyên
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1974-12-16
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ sinh học
-   **ten_qg**: Việt Nam

### Bản ghi 82 (hàng Excel 83)

-   **STT**: 82
-   **shcc**: D4300335.040907
-   **hoten**: Hồ Thị Thu Ba
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1973-07-16
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ sinh học
-   **ten_qg**: Việt Nam

### Bản ghi 83 (hàng Excel 84)

-   **STT**: 83
-   **shcc**: D4300330.050908
-   **hoten**: Nguyễn Phú Thọ
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1983-12-25
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ sinh học
-   **ten_qg**: Việt Nam

### Bản ghi 84 (hàng Excel 85)

-   **STT**: 84
-   **shcc**: D4300330.050906
-   **hoten**: Lê Hoàng Bảo Ngọc
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1983-12-30
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ sinh học
-   **ten_qg**: Việt Nam

### Bản ghi 85 (hàng Excel 86)

-   **STT**: 85
-   **shcc**: D4300110.020506
-   **hoten**: Đoàn Thị Minh Nguyệt
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1978-10-29
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Nông nghiệp và Kỹ thuật sinh học
-   **ten_qg**: Hoa Kỳ

### Bản ghi 86 (hàng Excel 87)

-   **STT**: 86
-   **shcc**: D4300330.260801
-   **hoten**: Võ Thị Trà My
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1984-07-22
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Di truyền học
-   **ten_qg**: Philippines

### Bản ghi 87 (hàng Excel 88)

-   **STT**: 87
-   **shcc**: D4300335.001101
-   **hoten**: Nguyễn Hữu Thanh
-   **t_dvi**: Bộ môn Công nghệ Sinh học - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1976-10-22
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Nông nghiệp và Kỹ thuật sinh học
-   **ten_qg**: Bỉ

### Bản ghi 88 (hàng Excel 89)

-   **STT**: 88
-   **shcc**: D4300337.030604
-   **hoten**: Lê Văn Lễnh
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1977-10-21
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Công nghệ nuôi trồng thủy sản
-   **ten_qg**: Việt Nam

### Bản ghi 89 (hàng Excel 90)

-   **STT**: 89
-   **shcc**: D4300336.020608
-   **hoten**: Nguyễn Bá Trung
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1972-11-05
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Động vật
-   **ten_qg**: Nhật Bản

### Bản ghi 90 (hàng Excel 91)

-   **STT**: 90
-   **shcc**: D4300750.040711
-   **hoten**: Võ Lâm
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1970-10-05
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chăn nuôi đặc biệt ở lĩnh vực Dinh dưỡng gia súc và
    Quản lý chăn nuôi
-   **ten_qg**: Việt Nam
-   **t_hham**: Phó Giáo sư

### Bản ghi 91 (hàng Excel 92)

-   **STT**: 91
-   **shcc**: D4300337.061101
-   **hoten**: Nguyễn Hữu Yến Nhi
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1984-04-24
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Dinh dưỡng và Quản lý thủy sản
-   **ten_qg**: Thụy Điển

### Bản ghi 92 (hàng Excel 93)

-   **STT**: 92
-   **shcc**: D4300336.011106
-   **hoten**: Nguyễn Thị Hạnh Chi
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1971-02-19
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Vi sinh vật học
-   **ten_qg**: Việt Nam

### Bản ghi 93 (hàng Excel 94)

-   **STT**: 93
-   **shcc**: D4300336.001104
-   **hoten**: Ngô Thụy Bảo Trân
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1976-08-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Thú y
-   **ten_qg**: Nhật Bản

### Bản ghi 94 (hàng Excel 95)

-   **STT**: 94
-   **shcc**: D4300330.080914
-   **hoten**: Nguyễn Phi Bằng
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1981-10-21
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Bệnh lý học và chữa bệnh vật nuôi
-   **ten_qg**: Việt Nam

### Bản ghi 95 (hàng Excel 96)

-   **STT**: 95
-   **shcc**: D4300330.080913
-   **hoten**: Nguyễn Bình Trường
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1982-01-31
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chăn nuôi
-   **ten_qg**: Việt Nam

### Bản ghi 96 (hàng Excel 97)

-   **STT**: 96
-   **shcc**: D4300330.050924
-   **hoten**: Bùi Phan Thu Hằng
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1974-03-24
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chăn nuôi
-   **ten_qg**: Thụy Điển
-   **t_hham**: Phó Giáo sư

### Bản ghi 97 (hàng Excel 98)

-   **STT**: 97
-   **shcc**: D4300330.050910
-   **hoten**: Nguyễn Tuyết Giang
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1981-09-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Dinh dưỡng vật nuôi
-   **ten_qg**: Úc

### Bản ghi 98 (hàng Excel 99)

-   **STT**: 98
-   **shcc**: D4300336.010805
-   **hoten**: Lê Thị Thúy Hằng
-   **t_dvi**: Bộ môn Khoa học động vật - Khoa NN-TNTN
-   **dvi.ten**: Khoa Nông nghiệp - Tài nguyên thiên nhiên
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1975-01-10
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Chăn nuôi
-   **ten_qg**: Việt Nam

### Bản ghi 99 (hàng Excel 100)

-   **STT**: 99
-   **shcc**: D4300350.200701
-   **hoten**: Nguyễn Trung Hiếu
-   **t_dvi**: Bộ môn Du lịch - Khoa DL và VH - NT
-   **dvi.ten**: Khoa Du lịch và Văn hóa - Nghệ thuật
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-07-15
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Văn hóa học
-   **ten_qg**: Việt Nam

### Bản ghi 100 (hàng Excel 101)

-   **STT**: 100
-   **shcc**: D4300278.990931
-   **hoten**: Phan Thị Thanh Huyền
-   **t_dvi**: Lãnh đạo Khoa Ngoại ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1977-11-16
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giáo dục ngôn ngữ
-   **ten_qg**: Úc

### Bản ghi 101 (hàng Excel 102)

-   **STT**: 101
-   **shcc**: D4300278.020506
-   **hoten**: Nguyễn Tiến Ngọ
-   **t_dvi**: Lãnh đạo Khoa Ngoại ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1979-02-20
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: LL&PPGD môn Tiếng Anh
-   **ten_qg**: Úc

### Bản ghi 102 (hàng Excel 103)

-   **STT**: 102
-   **shcc**: D4300278.020912
-   **hoten**: Bùi Lê Diễm Trang
-   **t_dvi**: Bộ môn Phương pháp giảng dạy tiếng Anh - Khoa Ngoại ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1980-03-17
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Ngôn ngữ ứng dụng
-   **ten_qg**: Úc
-   **t_hham**: Phó Giáo sư

### Bản ghi 103 (hàng Excel 104)

-   **STT**: 103
-   **shcc**: D4300030.040904
-   **hoten**: Nguyễn Thị Thùy Dao
-   **t_dvi**: Bộ môn Phương pháp giảng dạy tiếng Anh - Khoa Ngoại ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1982-02-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giảng dạy tiếng Anh
-   **ten_qg**: Thái Lan

### Bản ghi 104 (hàng Excel 105)

-   **STT**: 104
-   **shcc**: D4300278.090901
-   **hoten**: Lý Thị Thanh Trúc
-   **t_dvi**: Bộ môn Phương pháp giảng dạy tiếng Anh - Khoa Ngoại ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1982-07-23
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: LL&PPGD môn Tiếng Anh
-   **ten_qg**: Úc

### Bản ghi 105 (hàng Excel 106)

-   **STT**: 105
-   **shcc**: D432009.0905024
-   **hoten**: Nguyễn Thị Dung
-   **t_dvi**: Bộ môn Ngôn ngữ học và Dịch thuật Tiếng Anh - Khoa Ngoại
    ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1987-01-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giảng dạy tiếng Anh
-   **ten_qg**: Thái Lan

### Bản ghi 106 (hàng Excel 107)

-   **STT**: 106
-   **shcc**: D4300278.031019
-   **hoten**: Nguyễn Đức Hạnh
-   **t_dvi**: Bộ môn Ngôn ngữ học và Dịch thuật Tiếng Anh - Khoa Ngoại
    ngữ
-   **dvi.ten**: Khoa Ngoại ngữ
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1981-02-19
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Giảng dạy Tiếng Anh
-   **ten_qg**: Thái Lan

### Bản ghi 107 (hàng Excel 108)

-   **STT**: 107
-   **shcc**: D4300311.980902
-   **hoten**: Đoàn Thanh Nghị
-   **t_dvi**: Lãnh đạo Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1976-06-04
-   **ma_ngach**: V.07.01.01
-   **ten_ngach**: Giảng viên cao cấp (hạng I)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Tin học
-   **ten_qg**: Pháp
-   **t_hham**: Phó Giáo sư

### Bản ghi 108 (hàng Excel 109)

-   **STT**: 108
-   **shcc**: D4300710.000203
-   **hoten**: Nguyễn Văn Hòa
-   **t_dvi**: Lãnh đạo Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1974-05-28
-   **ma_ngach**: V.07.01.02
-   **ten_ngach**: Giảng viên chính (hạng II)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Tin học
-   **ten_qg**: Pháp

### Bản ghi 109 (hàng Excel 110)

-   **STT**: 109
-   **shcc**: D432009.0905085
-   **hoten**: Lê Hoàng Anh
-   **t_dvi**: Bộ môn Công nghệ thông tin - Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-11-13
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Bảo mật mạng
-   **ten_qg**: Nhật Bản

### Bản ghi 110 (hàng Excel 111)

-   **STT**: 110
-   **shcc**: D4300313.111201
-   **hoten**: Châu Ngân Khánh
-   **t_dvi**: Bộ môn Công nghệ thông tin - Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1988-05-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Xử lý ảnh y tế sử dụng máy học
-   **ten_qg**: Hàn Quốc

### Bản ghi 111 (hàng Excel 112)

-   **STT**: 111
-   **shcc**: D4300030.080701
-   **hoten**: Lê Công Đoàn
-   **t_dvi**: Bộ môn Công nghệ thông tin - Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1984-01-01
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật máy tính
-   **ten_qg**: Thái Lan

### Bản ghi 112 (hàng Excel 113)

-   **STT**: 112
-   **shcc**: D4300313.080902
-   **hoten**: Trần Thị Tuyết Vân
-   **t_dvi**: Bộ môn Kỹ thuật phần mềm - Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1986-02-24
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kỹ thuật điện tử
-   **ten_qg**: Hàn Quốc

### Bản ghi 113 (hàng Excel 114)

-   **STT**: 113
-   **shcc**: D4300313.080901
-   **hoten**: Huỳnh Lý Thanh Nhàn
-   **t_dvi**: Bộ môn Kỹ thuật phần mềm - Khoa CNTT
-   **dvi.ten**: Khoa Công nghệ thông tin
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1986-12-08
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học máy tính
-   **ten_qg**: Việt Nam

### Bản ghi 114 (hàng Excel 115)

-   **STT**: 114
-   **shcc**: D4300314.001101
-   **hoten**: Nguyễn Trần Nhẫn Tánh
-   **t_dvi**: Lãnh đạo Viện - BĐKH
-   **dvi.ten**: Viện Biến đổi khí hậu
-   **gioitinh**: Nam
-   **NgayThangNamSinh**: 1979-02-24
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Khoa học Thủy văn
-   **ten_qg**: Hoa Kỳ

### Bản ghi 115 (hàng Excel 116)

-   **STT**: 115
-   **shcc**: D4300750.030601
-   **hoten**: Trang Thị Mỹ Duyên
-   **t_dvi**: Phòng Nghiên cứu Nông nghiệp và Phát triển nông thôn -
    Viện BĐKH
-   **dvi.ten**: Viện Biến đổi khí hậu
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1979-09-04
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Kinh tế Tài nguyên và Nông nghiệp
-   **ten_qg**: Thái Lan

### Bản ghi 116 (hàng Excel 117)

-   **STT**: 116
-   **shcc**: D4300750.030603
-   **hoten**: Đặng Thị Thanh Quỳnh
-   **t_dvi**: Phòng Nghiên cứu Nông nghiệp và Phát triển nông thôn -
    Viện BĐKH
-   **dvi.ten**: Viện Biến đổi khí hậu
-   **gioitinh**: Nữ
-   **NgayThangNamSinh**: 1978-09-22
-   **ma_ngach**: V.07.01.03
-   **ten_ngach**: Giảng viên (hạng III)
-   **t_tdcmon**: Tiến sĩ
-   **t_cmdtao**: Phát triển nông thôn
-   **ten_qg**: Việt Nam

*Kết thúc sheet GIANGVIEN: 116 bản ghi có dữ liệu.*

## HOCVIEN

Tổng số cột: 29.

### Bản ghi 1 (hàng Excel 2)

-   **STT_HV**: 1
-   **CCCD**: 89079000407
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS259505
-   **HO_TEN**: Lê Minh Tuấn
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-11-12
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-11-11
-   **NGAY_SINH**: 1994-01-21
-   **GIOI_TINH**: Nữ

### Bản ghi 2 (hàng Excel 3)

-   **STT_HV**: 2
-   **CCCD**: 89187001620
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS259504
-   **HO_TEN**: Lý Thị Thanh Thảo
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-11-12
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-11-11
-   **NGAY_SINH**: 1994-12-15
-   **GIOI_TINH**: Nam

### Bản ghi 3 (hàng Excel 4)

-   **STT_HV**: 3
-   **CCCD**: 89184000932
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS259503
-   **HO_TEN**: Cù Ngọc Quí
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-11-12
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-11-11
-   **NGAY_SINH**: 1997-06-25
-   **GIOI_TINH**: Nữ

### Bản ghi 4 (hàng Excel 5)

-   **STT_HV**: 4
-   **CCCD**: 89094012854
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS259502
-   **HO_TEN**: Nguyễn Văn Tỷ Lợi
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-11-12
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-11-11
-   **NGAY_SINH**: 1997-09-28
-   **GIOI_TINH**: Nữ

### Bản ghi 5 (hàng Excel 6)

-   **STT_HV**: 5
-   **CCCD**: 87175000455
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS259501
-   **HO_TEN**: Nguyễn Thị Minh Châu
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-11-12
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-11-11
-   **NGAY_SINH**: 1981-11-28
-   **GIOI_TINH**: Nữ

### Bản ghi 6 (hàng Excel 7)

-   **STT_HV**: 6
-   **CCCD**: 89181000709
-   **LOP**: TSKHCT01
-   **MA_HOC_VIEN**: NCS248026
-   **HO_TEN**: Nguyễn Thị Thúy diễm
-   **MA_NGANH**: 9620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình tiến sĩ
-   **TRINH_DO_DAO_TAO**: Tiến sĩ
-   **NGAY_NHAP_HOC**: 2025-12-19
-   **KHOA_HOC**: NCS01
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-12-18
-   **NGAY_SINH**: 1987-01-06
-   **GIOI_TINH**: Nữ

### Bản ghi 7 (hàng Excel 8)

-   **STT_HV**: 7
-   **CCCD**: 91199002746
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259463
-   **HO_TEN**: Vũ Thị Cẩm Tú
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-06-20
-   **GIOI_TINH**: Nữ

### Bản ghi 8 (hàng Excel 9)

-   **STT_HV**: 8
-   **CCCD**: 89092020509
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259462
-   **HO_TEN**: Trương Hoài Nam
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1989-01-07
-   **GIOI_TINH**: Nữ

### Bản ghi 9 (hàng Excel 10)

-   **STT_HV**: 9
-   **CCCD**: 89203006140
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259461
-   **HO_TEN**: Huỳnh Sang
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-09-26
-   **GIOI_TINH**: Nam

### Bản ghi 10 (hàng Excel 11)

-   **STT_HV**: 10
-   **CCCD**: 89203023115
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259460
-   **HO_TEN**: Dương Phú Khang
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-10-13
-   **GIOI_TINH**: Nam

### Bản ghi 11 (hàng Excel 12)

-   **STT_HV**: 11
-   **CCCD**: 79078000596
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259459
-   **HO_TEN**: Trương Thành Tú
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1978-06-11
-   **GIOI_TINH**: Nam

### Bản ghi 12 (hàng Excel 13)

-   **STT_HV**: 12
-   **CCCD**: 89080000382
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259458
-   **HO_TEN**: Huỳnh Nhật Duy
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1980-06-02
-   **GIOI_TINH**: Nam

### Bản ghi 13 (hàng Excel 14)

-   **STT_HV**: 13
-   **CCCD**: 89086011629
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259457
-   **HO_TEN**: Nguyễn Trung Cang
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1986-10-28
-   **GIOI_TINH**: Nam

### Bản ghi 14 (hàng Excel 15)

-   **STT_HV**: 14
-   **CCCD**: 89099008696
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259456
-   **HO_TEN**: Nguyễn Thái Bình
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-03-27
-   **GIOI_TINH**: Nam

### Bản ghi 15 (hàng Excel 16)

-   **STT_HV**: 15
-   **CCCD**: 89075011230
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259455
-   **HO_TEN**: Huỳnh Văn Nghĩa
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1974-12-31
-   **GIOI_TINH**: Nam

### Bản ghi 16 (hàng Excel 17)

-   **STT_HV**: 16
-   **CCCD**: 87190000910
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259454
-   **HO_TEN**: Nguyễn Thị Ánh Tuyết
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1990-10-28
-   **GIOI_TINH**: Nữ

### Bản ghi 17 (hàng Excel 18)

-   **STT_HV**: 17
-   **CCCD**: 89088016636
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259453
-   **HO_TEN**: Chau Sonh
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1988-05-09
-   **GIOI_TINH**: Nữ

### Bản ghi 18 (hàng Excel 19)

-   **STT_HV**: 18
-   **CCCD**: 89092001608
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259452
-   **HO_TEN**: Võ Trường Giang
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1992-03-14
-   **GIOI_TINH**: Nam

### Bản ghi 19 (hàng Excel 20)

-   **STT_HV**: 19
-   **CCCD**: 91097006784
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259451
-   **HO_TEN**: Trịnh Thanh Hòa
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1997-07-06
-   **GIOI_TINH**: Nam

### Bản ghi 20 (hàng Excel 21)

-   **STT_HV**: 20
-   **CCCD**: 91092015270
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259450
-   **HO_TEN**: Võ Văn Tây
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1992-05-30
-   **GIOI_TINH**: Nam

### Bản ghi 21 (hàng Excel 22)

-   **STT_HV**: 21
-   **CCCD**: 89099015127
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259449
-   **HO_TEN**: Huỳnh Trọng Nghĩa
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-11-17
-   **GIOI_TINH**: Nam

### Bản ghi 22 (hàng Excel 23)

-   **STT_HV**: 22
-   **CCCD**: 89085030256
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259448
-   **HO_TEN**: Lê Hữu Lành
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1985-12-27
-   **GIOI_TINH**: Nam

### Bản ghi 23 (hàng Excel 24)

-   **STT_HV**: 23
-   **CCCD**: 89088007352
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259447
-   **HO_TEN**: Đặng Thanh Phú
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1988-11-01
-   **GIOI_TINH**: Nam

### Bản ghi 24 (hàng Excel 25)

-   **STT_HV**: 24
-   **CCCD**: 89095016600
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259446
-   **HO_TEN**: Nguyễn Thanh Tuyền
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1995-11-17
-   **GIOI_TINH**: Nam

### Bản ghi 25 (hàng Excel 26)

-   **STT_HV**: 25
-   **CCCD**: 89094001081
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259445
-   **HO_TEN**: Lê Văn Bằng
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-11-02
-   **GIOI_TINH**: Nữ

### Bản ghi 26 (hàng Excel 27)

-   **STT_HV**: 26
-   **CCCD**: 89097021320
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259444
-   **HO_TEN**: Nguyễn Duy Khánh
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1979-01-07
-   **GIOI_TINH**: Nam

### Bản ghi 27 (hàng Excel 28)

-   **STT_HV**: 27
-   **CCCD**: 91202003562
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259443
-   **HO_TEN**: Huỳnh Trường Giang
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2002-01-16
-   **GIOI_TINH**: Nam

### Bản ghi 28 (hàng Excel 29)

-   **STT_HV**: 28
-   **CCCD**: 89098015272
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259442
-   **HO_TEN**: Đặng Quang Lãm
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1989-09-19
-   **GIOI_TINH**: Nữ

### Bản ghi 29 (hàng Excel 30)

-   **STT_HV**: 29
-   **CCCD**: 89096005804
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259441
-   **HO_TEN**: Nguyễn Thanh Tâm
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1996-07-09
-   **GIOI_TINH**: Nam

### Bản ghi 30 (hàng Excel 31)

-   **STT_HV**: 30
-   **CCCD**: 89096007185
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259440
-   **HO_TEN**: Thái Việt Trung
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1996-06-21
-   **GIOI_TINH**: Nam

### Bản ghi 31 (hàng Excel 32)

-   **STT_HV**: 31
-   **CCCD**: 89096002080
-   **LOP**: CH12CNTT
-   **MA_HOC_VIEN**: CH259439
-   **HO_TEN**: Phan Văn Đức Bảo
-   **MA_NGANH**: 8480201
-   **TEN_NGANH**: Công nghệ thông tin
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-08-02
-   **GIOI_TINH**: Nữ

### Bản ghi 32 (hàng Excel 33)

-   **STT_HV**: 32
-   **CCCD**: 89303014485
-   **LOP**: CH12CNTP
-   **MA_HOC_VIEN**: CH259423
-   **HO_TEN**: Lê Phan Hoài Ngọc
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1980-06-18
-   **GIOI_TINH**: Nữ

### Bản ghi 33 (hàng Excel 34)

-   **STT_HV**: 33
-   **CCCD**: 80186000976
-   **LOP**: CH12CNTP
-   **MA_HOC_VIEN**: CH259422
-   **HO_TEN**: Nguyễn Thị Phương Dung
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-07-10
-   **GIOI_TINH**: Nữ

### Bản ghi 34 (hàng Excel 35)

-   **STT_HV**: 34
-   **CCCD**: 89203015493
-   **LOP**: CH12CNTP
-   **MA_HOC_VIEN**: CH259421
-   **HO_TEN**: Nguyễn Hoàng Búp
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2002-06-27
-   **GIOI_TINH**: Nữ

### Bản ghi 35 (hàng Excel 36)

-   **STT_HV**: 35
-   **CCCD**: 89303011424
-   **LOP**: CH12CNTP
-   **MA_HOC_VIEN**: CH259420
-   **HO_TEN**: Nguyễn Trịnh Thu Tuyết
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1991-09-03
-   **GIOI_TINH**: Nữ

### Bản ghi 36 (hàng Excel 37)

-   **STT_HV**: 36
-   **CCCD**: 92301009754
-   **LOP**: CH12CNTP
-   **MA_HOC_VIEN**: CH259419
-   **HO_TEN**: Mai Thị Tú Trinh
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1985-09-06
-   **GIOI_TINH**: Nữ

### Bản ghi 37 (hàng Excel 38)

-   **STT_HV**: 37
-   **CCCD**: 89302013409
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259404
-   **HO_TEN**: Hà Nguyễn Như Ý
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1997-10-15
-   **GIOI_TINH**: Nam

### Bản ghi 38 (hàng Excel 39)

-   **STT_HV**: 38
-   **CCCD**: 89185021881
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259403
-   **HO_TEN**: Lê Thị Yến Ly
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-09-08
-   **GIOI_TINH**: Nữ

### Bản ghi 39 (hàng Excel 40)

-   **STT_HV**: 39
-   **CCCD**: 89193009902
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259402
-   **HO_TEN**: Dương Hồng Vân
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1979-11-30
-   **GIOI_TINH**: Nam

### Bản ghi 40 (hàng Excel 41)

-   **STT_HV**: 40
-   **CCCD**: 89095003346
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259401
-   **HO_TEN**: Trần Linh Tâm
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1994-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 41 (hàng Excel 42)

-   **STT_HV**: 41
-   **CCCD**: 89185031976
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259400
-   **HO_TEN**: Nguyễn Thị Diễm Trang
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1993-10-05
-   **GIOI_TINH**: Nữ

### Bản ghi 42 (hàng Excel 43)

-   **STT_HV**: 42
-   **CCCD**: 89073002409
-   **LOP**: CH12CNSH
-   **MA_HOC_VIEN**: CH259399
-   **HO_TEN**: Ninh Nguyễn Phúc Kha
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1984-01-02
-   **GIOI_TINH**: Nam

### Bản ghi 43 (hàng Excel 44)

-   **STT_HV**: 43
-   **CCCD**: 92087006975
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259388
-   **HO_TEN**: Nguyễn Quốc Nam
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1975-06-03
-   **GIOI_TINH**: Nữ

### Bản ghi 44 (hàng Excel 45)

-   **STT_HV**: 44
-   **CCCD**: 92301002403
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259387
-   **HO_TEN**: Nguyễn Thị Ngọc Thanh
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1992-10-07
-   **GIOI_TINH**: Nữ

### Bản ghi 45 (hàng Excel 46)

-   **STT_HV**: 45
-   **CCCD**: 95301002338
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259386
-   **HO_TEN**: Trần Thị Thảo My
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1993-09-29
-   **GIOI_TINH**: Nam

### Bản ghi 46 (hàng Excel 47)

-   **STT_HV**: 46
-   **CCCD**: 89084002447
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259385
-   **HO_TEN**: Trương Viết Bình An
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2000-05-13
-   **GIOI_TINH**: Nữ

### Bản ghi 47 (hàng Excel 48)

-   **STT_HV**: 47
-   **CCCD**: 89082029459
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259384
-   **HO_TEN**: Phạm Trần Quốc Việt
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1994-11-26
-   **GIOI_TINH**: Nam

### Bản ghi 48 (hàng Excel 49)

-   **STT_HV**: 48
-   **CCCD**: 89189019180
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259383
-   **HO_TEN**: Phạm Thị Ngọc An
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1980-09-10
-   **GIOI_TINH**: Nữ

### Bản ghi 49 (hàng Excel 50)

-   **STT_HV**: 49
-   **CCCD**: 89188011970
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259382
-   **HO_TEN**: Huỳnh Kim Tiên
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1993-03-01
-   **GIOI_TINH**: Nam

### Bản ghi 50 (hàng Excel 51)

-   **STT_HV**: 50
-   **CCCD**: 89189015520
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259381
-   **HO_TEN**: Ngô Thị Thanh Tâm
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1989-06-23
-   **GIOI_TINH**: Nam

### Bản ghi 51 (hàng Excel 52)

-   **STT_HV**: 51
-   **CCCD**: 89079012975
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259380
-   **HO_TEN**: Trần Khánh Dư
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1980-09-10
-   **GIOI_TINH**: Nữ

### Bản ghi 52 (hàng Excel 53)

-   **STT_HV**: 52
-   **CCCD**: 89085004411
-   **LOP**: CH12KHCT
-   **MA_HOC_VIEN**: CH259379
-   **HO_TEN**: Huỳnh Chí Thiện
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1984-09-25
-   **GIOI_TINH**: Nữ

### Bản ghi 53 (hàng Excel 54)

-   **STT_HV**: 53
-   **CCCD**: 89094004118
-   **LOP**: CH12CN
-   **MA_HOC_VIEN**: CH259365
-   **HO_TEN**: Nguyễn Tuấn Anh
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1981-07-05
-   **GIOI_TINH**: Nữ

### Bản ghi 54 (hàng Excel 55)

-   **STT_HV**: 54
-   **CCCD**: 89098003893
-   **LOP**: CH12CN
-   **MA_HOC_VIEN**: CH259364
-   **HO_TEN**: Nguyễn An Khang
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1986-07-20
-   **GIOI_TINH**: Nam

### Bản ghi 55 (hàng Excel 56)

-   **STT_HV**: 55
-   **CCCD**: 89303013479
-   **LOP**: CH12QLMT
-   **MA_HOC_VIEN**: CH259347
-   **HO_TEN**: Huỳnh Phan Như Ngọc
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1989-09-10
-   **GIOI_TINH**: Nam

### Bản ghi 56 (hàng Excel 57)

-   **STT_HV**: 56
-   **CCCD**: 89200008904
-   **LOP**: CH12QLMT
-   **MA_HOC_VIEN**: CH259346
-   **HO_TEN**: Trịnh Đăng Nhật Đăng
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1995-04-15
-   **GIOI_TINH**: Nam

### Bản ghi 57 (hàng Excel 58)

-   **STT_HV**: 57
-   **CCCD**: 89194001858
-   **LOP**: CH12QLMT
-   **MA_HOC_VIEN**: CH259345
-   **HO_TEN**: Nguyễn Thị Tiến
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-06-09
-   **GIOI_TINH**: Nam

### Bản ghi 58 (hàng Excel 59)

-   **STT_HV**: 58
-   **CCCD**: 89192010121
-   **LOP**: CH12QLMT
-   **MA_HOC_VIEN**: CH259344
-   **HO_TEN**: Trần Kim Thịnh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1981-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 59 (hàng Excel 60)

-   **STT_HV**: 59
-   **CCCD**: 60190000303
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259332
-   **HO_TEN**: Đồng Thị Trà My
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1986-02-09
-   **GIOI_TINH**: Nữ

### Bản ghi 60 (hàng Excel 61)

-   **STT_HV**: 60
-   **CCCD**: 92181004086
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259331
-   **HO_TEN**: HuỳnhThị Mộng Thường
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1990-10-09
-   **GIOI_TINH**: Nữ

### Bản ghi 61 (hàng Excel 62)

-   **STT_HV**: 61
-   **CCCD**: 89190005256
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259330
-   **HO_TEN**: Đào Thị Thúy Hằng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-06-27
-   **GIOI_TINH**: Nam

### Bản ghi 62 (hàng Excel 63)

-   **STT_HV**: 62
-   **CCCD**: 92300013232
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259329
-   **HO_TEN**: Nguyễn Thị Thanh Trúc
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1985-02-27
-   **GIOI_TINH**: Nữ

### Bản ghi 63 (hàng Excel 64)

-   **STT_HV**: 63
-   **CCCD**: 89302001504
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259328
-   **HO_TEN**: Trần Thị Kim Ngọc
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1982-04-05
-   **GIOI_TINH**: Nam

### Bản ghi 64 (hàng Excel 65)

-   **STT_HV**: 64
-   **CCCD**: 89197013882
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259326
-   **HO_TEN**: Lê Hồ Đại Ngọc
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1980-02-08
-   **GIOI_TINH**: Nữ

### Bản ghi 65 (hàng Excel 66)

-   **STT_HV**: 65
-   **CCCD**: 89191016370
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259325
-   **HO_TEN**: Bùi Thị Kim Liên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1993-09-09
-   **GIOI_TINH**: Nữ

### Bản ghi 66 (hàng Excel 67)

-   **STT_HV**: 66
-   **CCCD**: 96082002494
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259324
-   **HO_TEN**: Lê Văn Dự
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1987-09-01
-   **GIOI_TINH**: Nam

### Bản ghi 67 (hàng Excel 68)

-   **STT_HV**: 67
-   **CCCD**: 89180026970
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259323
-   **HO_TEN**: Bùi Thị Thu Hà
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1995-01-15
-   **GIOI_TINH**: Nam

### Bản ghi 68 (hàng Excel 69)

-   **STT_HV**: 68
-   **CCCD**: 89192015951
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259322
-   **HO_TEN**: Lê Thu Thảo
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-09-12
-   **GIOI_TINH**: Nữ

### Bản ghi 69 (hàng Excel 70)

-   **STT_HV**: 69
-   **CCCD**: 89089027595
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259321
-   **HO_TEN**: NGUYỄN VĂN LÀNH
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2000-10-09
-   **GIOI_TINH**: Nữ

### Bản ghi 70 (hàng Excel 71)

-   **STT_HV**: 70
-   **CCCD**: 89301000608
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259320
-   **HO_TEN**: Văn Thị Vân Anh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1997-07-11
-   **GIOI_TINH**: Nam

### Bản ghi 71 (hàng Excel 72)

-   **STT_HV**: 71
-   **CCCD**: 89088002097
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259319
-   **HO_TEN**: Trần Phước Thạnh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1983-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 72 (hàng Excel 73)

-   **STT_HV**: 72
-   **CCCD**: 89180015200
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259318
-   **HO_TEN**: Võ Thị Rạng Đông
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1994-04-01
-   **GIOI_TINH**: Nữ

### Bản ghi 73 (hàng Excel 74)

-   **STT_HV**: 73
-   **CCCD**: 89093000391
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259317
-   **HO_TEN**: Trần Hoàng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2000-12-08
-   **GIOI_TINH**: Nam

### Bản ghi 74 (hàng Excel 75)

-   **STT_HV**: 74
-   **CCCD**: 89199008047
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259316
-   **HO_TEN**: Trịnh Phương Anh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1985-09-12
-   **GIOI_TINH**: Nam

### Bản ghi 75 (hàng Excel 76)

-   **STT_HV**: 75
-   **CCCD**: 89199007096
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259315
-   **HO_TEN**: Nguyễn Thị Nhu Mì
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-06-20
-   **GIOI_TINH**: Nữ

### Bản ghi 76 (hàng Excel 77)

-   **STT_HV**: 76
-   **CCCD**: 89185006606
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259314
-   **HO_TEN**: Nguyễn Thị Mỹ Nho
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1973-05-02
-   **GIOI_TINH**: Nam

### Bản ghi 77 (hàng Excel 78)

-   **STT_HV**: 77
-   **CCCD**: 89185024816
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259313
-   **HO_TEN**: Nguyễn Thị Bé Hai
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1988-09-23
-   **GIOI_TINH**: Nam

### Bản ghi 78 (hàng Excel 79)

-   **STT_HV**: 78
-   **CCCD**: 89094021796
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259312
-   **HO_TEN**: NGUYỄN CHÍ CƯỜNG
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1977-06-12
-   **GIOI_TINH**: Nữ

### Bản ghi 79 (hàng Excel 80)

-   **STT_HV**: 79
-   **CCCD**: 89093002552
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259311
-   **HO_TEN**: LÊ VĂN TỈNH
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-08-26
-   **GIOI_TINH**: Nữ

### Bản ghi 80 (hàng Excel 81)

-   **STT_HV**: 80
-   **CCCD**: 89301019863
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259310
-   **HO_TEN**: Nguyễn Thị Như Quỳnh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1985-10-08
-   **GIOI_TINH**: Nữ

### Bản ghi 81 (hàng Excel 82)

-   **STT_HV**: 81
-   **CCCD**: 89180000971
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259309
-   **HO_TEN**: Văng Thị Phấn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-01-05
-   **GIOI_TINH**: Nữ

### Bản ghi 82 (hàng Excel 83)

-   **STT_HV**: 82
-   **CCCD**: 89197018891
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259308
-   **HO_TEN**: Trần Ngọc Hồng Ngân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1999-08-09
-   **GIOI_TINH**: Nữ

### Bản ghi 83 (hàng Excel 84)

-   **STT_HV**: 83
-   **CCCD**: 89086024474
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259307
-   **HO_TEN**: Nguyễn Duy Khánh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1994-05-19
-   **GIOI_TINH**: Nam

### Bản ghi 84 (hàng Excel 85)

-   **STT_HV**: 84
-   **CCCD**: 89180014912
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259306
-   **HO_TEN**: Lại Thị Danh Lam
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1990-02-01
-   **GIOI_TINH**: Nữ

### Bản ghi 85 (hàng Excel 86)

-   **STT_HV**: 85
-   **CCCD**: 89199010455
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259305
-   **HO_TEN**: Võ Ngọc Thư
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2001-11-22
-   **GIOI_TINH**: Nữ

### Bản ghi 86 (hàng Excel 87)

-   **STT_HV**: 86
-   **CCCD**: 89194015943
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259304
-   **HO_TEN**: Võ Thị Nhung
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1992-01-27
-   **GIOI_TINH**: Nữ

### Bản ghi 87 (hàng Excel 88)

-   **STT_HV**: 87
-   **CCCD**: 89193023459
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259303
-   **HO_TEN**: Phạm Thị Hồng Loan
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1998-02-10
-   **GIOI_TINH**: Nam

### Bản ghi 88 (hàng Excel 89)

-   **STT_HV**: 88
-   **CCCD**: 89181026322
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259302
-   **HO_TEN**: Lý Thị Ngọc Bích
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1992-09-30
-   **GIOI_TINH**: Nam

### Bản ghi 89 (hàng Excel 90)

-   **STT_HV**: 89
-   **CCCD**: 89300019061
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259301
-   **HO_TEN**: Nguyễn Kim Ngân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 2003-07-17
-   **GIOI_TINH**: Nữ

### Bản ghi 90 (hàng Excel 91)

-   **STT_HV**: 90
-   **CCCD**: 87177027806
-   **LOP**: CH12QLGD
-   **MA_HOC_VIEN**: CH259300
-   **HO_TEN**: Trần Kim Tuyết
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-11-06
-   **KHOA_HOC**: CH12
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-11-06
-   **NGAY_SINH**: 1981-08-20
-   **GIOI_TINH**: Nữ

### Bản ghi 91 (hàng Excel 92)

-   **STT_HV**: 91
-   **CCCD**: 89301003525
-   **MA_HOC_VIEN**: CH248024
-   **HO_TEN**: Hồ Ngọc Kim Anh
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1982-07-01
-   **GIOI_TINH**: Nam

### Bản ghi 92 (hàng Excel 93)

-   **STT_HV**: 92
-   **CCCD**: 89097006302
-   **LOP**: CH11KHCT
-   **MA_HOC_VIEN**: CH248023
-   **HO_TEN**: Phan Điền viên
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1996-06-01
-   **GIOI_TINH**: Nam

### Bản ghi 93 (hàng Excel 94)

-   **STT_HV**: 93
-   **CCCD**: 89082000431
-   **LOP**: CH11KHCT
-   **MA_HOC_VIEN**: CH248022
-   **HO_TEN**: Trần Lê Kim trí
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1998-09-24
-   **GIOI_TINH**: Nam

### Bản ghi 94 (hàng Excel 95)

-   **STT_HV**: 94
-   **CCCD**: 89095016895
-   **LOP**: CH11KHCT
-   **MA_HOC_VIEN**: CH248021
-   **HO_TEN**: Nguyễn Minh Nghĩa
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1988-03-03
-   **GIOI_TINH**: Nam

### Bản ghi 95 (hàng Excel 96)

-   **STT_HV**: 95
-   **CCCD**: 91083024196
-   **LOP**: CH11KHCT
-   **MA_HOC_VIEN**: CH248020
-   **HO_TEN**: Lê Văn đúng
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1985-04-02
-   **GIOI_TINH**: Nữ

### Bản ghi 96 (hàng Excel 97)

-   **STT_HV**: 96
-   **CCCD**: 89189018970
-   **MA_HOC_VIEN**: CH248019
-   **HO_TEN**: Hà Nhật My Trâm
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1991-09-09
-   **GIOI_TINH**: Nữ

### Bản ghi 97 (hàng Excel 98)

-   **STT_HV**: 97
-   **CCCD**: 893020171950
-   **MA_HOC_VIEN**: CH248018
-   **HO_TEN**: Võ Uyên Nhi
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1997-03-20
-   **GIOI_TINH**: Nam

### Bản ghi 98 (hàng Excel 99)

-   **STT_HV**: 98
-   **CCCD**: 89089018186
-   **MA_HOC_VIEN**: CH248017
-   **HO_TEN**: Nguyễn Minh tuấn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 2001-05-23
-   **GIOI_TINH**: Nam

### Bản ghi 99 (hàng Excel 100)

-   **STT_HV**: 99
-   **CCCD**: 89201014793
-   **MA_HOC_VIEN**: CH248016
-   **HO_TEN**: Trần Trọng tính
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1981-11-19
-   **GIOI_TINH**: Nữ

### Bản ghi 100 (hàng Excel 101)

-   **STT_HV**: 100
-   **CCCD**: 89180009567
-   **MA_HOC_VIEN**: CH248015
-   **HO_TEN**: Ông Thị Mỹ Tiên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1982-11-12
-   **GIOI_TINH**: Nam

### Bản ghi 101 (hàng Excel 102)

-   **STT_HV**: 101
-   **CCCD**: 89191002224
-   **MA_HOC_VIEN**: CH248014
-   **HO_TEN**: Trương Ngọc Phương thùy
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1982-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 102 (hàng Excel 103)

-   **STT_HV**: 102
-   **CCCD**: 89181014176
-   **MA_HOC_VIEN**: CH248013
-   **HO_TEN**: Huỳnh Kim thanh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 2002-09-04
-   **GIOI_TINH**: Nữ

### Bản ghi 103 (hàng Excel 104)

-   **STT_HV**: 103
-   **CCCD**: 89099017771
-   **MA_HOC_VIEN**: CH248012
-   **HO_TEN**: Chau Chhay tan
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1980-10-02
-   **GIOI_TINH**: Nữ

### Bản ghi 104 (hàng Excel 105)

-   **STT_HV**: 104
-   **CCCD**: 89195003967
-   **MA_HOC_VIEN**: CH248011
-   **HO_TEN**: Ngô Nguyễn Xuân Quyên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1989-05-01
-   **GIOI_TINH**: Nữ

### Bản ghi 105 (hàng Excel 106)

-   **STT_HV**: 105
-   **CCCD**: 89084001024
-   **MA_HOC_VIEN**: CH248010
-   **HO_TEN**: Ngô Bá phú
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 2002-01-03
-   **GIOI_TINH**: Nữ

### Bản ghi 106 (hàng Excel 107)

-   **STT_HV**: 106
-   **CCCD**: 89095003354
-   **MA_HOC_VIEN**: CH248009
-   **HO_TEN**: Dương Bá Ngượt
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1999-09-09
-   **GIOI_TINH**: Nam

### Bản ghi 107 (hàng Excel 108)

-   **STT_HV**: 107
-   **CCCD**: 89184002426
-   **MA_HOC_VIEN**: CH248008
-   **HO_TEN**: Lư Thị Thanh Ngân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 2002-11-21
-   **GIOI_TINH**: Nữ

### Bản ghi 108 (hàng Excel 109)

-   **STT_HV**: 108
-   **CCCD**: 89201010859
-   **MA_HOC_VIEN**: CH248007
-   **HO_TEN**: Nguyễn Nhật Huy
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1995-09-09
-   **GIOI_TINH**: Nữ

### Bản ghi 109 (hàng Excel 110)

-   **STT_HV**: 109
-   **CCCD**: 91097006553
-   **MA_HOC_VIEN**: CH248006
-   **HO_TEN**: Huỳnh Vũ hảo
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1983-06-18
-   **GIOI_TINH**: Nữ

### Bản ghi 110 (hàng Excel 111)

-   **STT_HV**: 110
-   **CCCD**: 89183012509
-   **MA_HOC_VIEN**: CH248005
-   **HO_TEN**: Nguyễn Thị Ngọc Diễm
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1992-05-20
-   **GIOI_TINH**: Nam

### Bản ghi 111 (hàng Excel 112)

-   **STT_HV**: 111
-   **CCCD**: 91092017227
-   **MA_HOC_VIEN**: CH248004
-   **HO_TEN**: Nguyễn Tấn Đạt
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 2001-03-15
-   **GIOI_TINH**: Nữ

### Bản ghi 112 (hàng Excel 113)

-   **STT_HV**: 112
-   **CCCD**: 89081018788
-   **MA_HOC_VIEN**: CH248003
-   **HO_TEN**: Hồ Quốc cử
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1984-12-20
-   **GIOI_TINH**: Nam

### Bản ghi 113 (hàng Excel 114)

-   **STT_HV**: 113
-   **CCCD**: 87302005060
-   **MA_HOC_VIEN**: CH248002
-   **HO_TEN**: Nguyễn Kim Bình
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1995-11-01
-   **GIOI_TINH**: Nam

### Bản ghi 114 (hàng Excel 115)

-   **STT_HV**: 114
-   **CCCD**: 89082028137
-   **MA_HOC_VIEN**: CH248001
-   **HO_TEN**: Huỳnh Thanh Bình
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2025-01-09
-   **KHOA_HOC**: CH11
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2027-01-09
-   **NGAY_SINH**: 1984-01-17
-   **GIOI_TINH**: Nữ

### Bản ghi 115 (hàng Excel 116)

-   **STT_HV**: 115
-   **CCCD**: 89088002739
-   **MA_HOC_VIEN**: CH232525
-   **HO_TEN**: Bùi Văn thái
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1989-02-14
-   **GIOI_TINH**: Nữ

### Bản ghi 116 (hàng Excel 117)

-   **STT_HV**: 116
-   **CCCD**: 93089007496
-   **MA_HOC_VIEN**: CH232524
-   **HO_TEN**: Phạm Hoàng ân
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1997-03-17
-   **GIOI_TINH**: Nam

### Bản ghi 117 (hàng Excel 118)

-   **STT_HV**: 117
-   **CCCD**: 89084024888
-   **MA_HOC_VIEN**: CH232523
-   **HO_TEN**: Nguyễn Xuân vinh
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1981-10-24
-   **GIOI_TINH**: Nam

### Bản ghi 118 (hàng Excel 119)

-   **STT_HV**: 118
-   **CCCD**: 91189002879
-   **MA_HOC_VIEN**: CH232522
-   **HO_TEN**: Nguyễn Ngọc hương
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1995-02-08
-   **GIOI_TINH**: Nữ

### Bản ghi 119 (hàng Excel 120)

-   **STT_HV**: 119
-   **CCCD**: 89201004780
-   **MA_HOC_VIEN**: CH232521
-   **HO_TEN**: Nguyễn Thanh hải
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1996-06-14
-   **GIOI_TINH**: Nữ

### Bản ghi 120 (hàng Excel 121)

-   **STT_HV**: 120
-   **CCCD**: 89301001890
-   **MA_HOC_VIEN**: CH232520
-   **HO_TEN**: Hồ Phạm Ngọc ngời
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 2001-08-26
-   **GIOI_TINH**: Nữ

### Bản ghi 121 (hàng Excel 122)

-   **STT_HV**: 121
-   **CCCD**: 89195003145
-   **MA_HOC_VIEN**: CH232519
-   **HO_TEN**: Nguyễn Thị Thu Loan
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1979-04-29
-   **GIOI_TINH**: Nam

### Bản ghi 122 (hàng Excel 123)

-   **STT_HV**: 122
-   **CCCD**: 91081016608
-   **MA_HOC_VIEN**: CH232518
-   **HO_TEN**: Lê Minh thiện
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1987-11-30
-   **GIOI_TINH**: Nam

### Bản ghi 123 (hàng Excel 124)

-   **STT_HV**: 123
-   **CCCD**: 89180022696
-   **MA_HOC_VIEN**: CH232517
-   **HO_TEN**: Lê Lâm Mỹ ngọc
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1980-06-15
-   **GIOI_TINH**: Nữ

### Bản ghi 124 (hàng Excel 125)

-   **STT_HV**: 124
-   **CCCD**: 89301016062
-   **MA_HOC_VIEN**: CH232516
-   **HO_TEN**: Trương Thị Mỹ quyên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 2001-04-24
-   **GIOI_TINH**: Nữ

### Bản ghi 125 (hàng Excel 126)

-   **STT_HV**: 125
-   **CCCD**: 89301005034
-   **MA_HOC_VIEN**: CH232515
-   **HO_TEN**: Nguyễn Huỳnh Bảo như
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 2001-12-28
-   **GIOI_TINH**: Nam

### Bản ghi 126 (hàng Excel 127)

-   **STT_HV**: 126
-   **CCCD**: 89191020882
-   **MA_HOC_VIEN**: CH232514
-   **HO_TEN**: Phan Thị Mỹ dung
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1984-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 127 (hàng Excel 128)

-   **STT_HV**: 127
-   **CCCD**: 89081016623
-   **MA_HOC_VIEN**: CH232513
-   **HO_TEN**: Quách Cao thanh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1990-10-08
-   **GIOI_TINH**: Nữ

### Bản ghi 128 (hàng Excel 129)

-   **STT_HV**: 128
-   **CCCD**: 89094003604
-   **MA_HOC_VIEN**: CH232512
-   **HO_TEN**: Lê Thanh long
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 2001-05-04
-   **GIOI_TINH**: Nam

### Bản ghi 129 (hàng Excel 130)

-   **STT_HV**: 129
-   **CCCD**: 89184005104
-   **MA_HOC_VIEN**: CH232511
-   **HO_TEN**: Quách Mỹ huê
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1988-04-21
-   **GIOI_TINH**: Nam

### Bản ghi 130 (hàng Excel 131)

-   **STT_HV**: 130
-   **CCCD**: 87079017546
-   **MA_HOC_VIEN**: CH232509
-   **HO_TEN**: Nguyễn Minh vũ
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 2001-03-18
-   **GIOI_TINH**: Nữ

### Bản ghi 131 (hàng Excel 132)

-   **STT_HV**: 131
-   **CCCD**: 89095004953
-   **MA_HOC_VIEN**: CH232508
-   **HO_TEN**: Trần Thanh liêm
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1994-04-01
-   **GIOI_TINH**: Nam

### Bản ghi 132 (hàng Excel 133)

-   **STT_HV**: 132
-   **CCCD**: 91190021808
-   **MA_HOC_VIEN**: CH232507
-   **HO_TEN**: Trần Thị Thu thủy
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1984-03-27
-   **GIOI_TINH**: Nữ

### Bản ghi 133 (hàng Excel 134)

-   **STT_HV**: 133
-   **CCCD**: 91201006786
-   **MA_HOC_VIEN**: CH232506
-   **HO_TEN**: Phan Trần Hải đăng
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1997-12-10
-   **GIOI_TINH**: Nam

### Bản ghi 134 (hàng Excel 135)

-   **STT_HV**: 134
-   **CCCD**: 89097005925
-   **MA_HOC_VIEN**: CH232505
-   **HO_TEN**: Võ Hoàng nam
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1989-02-01
-   **GIOI_TINH**: Nam

### Bản ghi 135 (hàng Excel 136)

-   **STT_HV**: 135
-   **CCCD**: 91087001707
-   **MA_HOC_VIEN**: CH232504
-   **HO_TEN**: Trịnh Văn Tuấn em
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1995-11-29
-   **GIOI_TINH**: Nam

### Bản ghi 136 (hàng Excel 137)

-   **STT_HV**: 136
-   **CCCD**: 89097000285
-   **MA_HOC_VIEN**: CH232503
-   **HO_TEN**: Nguyễn Quốc huy
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1991-11-05
-   **GIOI_TINH**: Nữ

### Bản ghi 137 (hàng Excel 138)

-   **STT_HV**: 137
-   **CCCD**: 89196003356
-   **MA_HOC_VIEN**: CH232502
-   **HO_TEN**: Nguyễn Ngọc Phương Trang
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1981-05-08
-   **GIOI_TINH**: Nam

### Bản ghi 138 (hàng Excel 139)

-   **STT_HV**: 138
-   **CCCD**: 89198011843
-   **MA_HOC_VIEN**: CH2325010
-   **HO_TEN**: Trần Thị Mỹ anh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2024-03-09
-   **KHOA_HOC**: CH10
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2026-03-09
-   **NGAY_SINH**: 1998-05-14
-   **GIOI_TINH**: Nữ

### Bản ghi 139 (hàng Excel 140)

-   **STT_HV**: 139
-   **CCCD**: 89188010854
-   **MA_HOC_VIEN**: CH222445
-   **HO_TEN**: La Ngọc Tường Vi
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1988-10-27
-   **GIOI_TINH**: Nữ

### Bản ghi 140 (hàng Excel 141)

-   **STT_HV**: 140
-   **CCCD**: 89088002116
-   **MA_HOC_VIEN**: CH222444
-   **HO_TEN**: Nguyễn Văn Thiệt
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1988-01-19
-   **GIOI_TINH**: Nam

### Bản ghi 141 (hàng Excel 142)

-   **STT_HV**: 141
-   **CCCD**: 87099000286
-   **MA_HOC_VIEN**: CH222443
-   **HO_TEN**: Trương Tấn Sang
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1999-11-10
-   **GIOI_TINH**: Nam

### Bản ghi 142 (hàng Excel 143)

-   **STT_HV**: 142
-   **CCCD**: 89300014080
-   **MA_HOC_VIEN**: CH222441
-   **HO_TEN**: Trần Thị Mỹ Ngọc
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 2000-08-12
-   **GIOI_TINH**: Nữ

### Bản ghi 143 (hàng Excel 144)

-   **STT_HV**: 143
-   **CCCD**: 89200011047
-   **MA_HOC_VIEN**: CH222440
-   **HO_TEN**: Nguyễn Hữu Nghị
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 2000-06-12
-   **GIOI_TINH**: Nam

### Bản ghi 144 (hàng Excel 145)

-   **STT_HV**: 144
-   **CCCD**: 89190019484
-   **MA_HOC_VIEN**: CH222439
-   **HO_TEN**: Hồ Thị Kim Ngân
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1990-11-26
-   **GIOI_TINH**: Nữ

### Bản ghi 145 (hàng Excel 146)

-   **STT_HV**: 145
-   **CCCD**: 89190002095
-   **MA_HOC_VIEN**: CH222438
-   **HO_TEN**: Trần Thị Ngọc Ngà
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1990-05-29
-   **GIOI_TINH**: Nữ

### Bản ghi 146 (hàng Excel 147)

-   **STT_HV**: 146
-   **CCCD**: 89185001034
-   **MA_HOC_VIEN**: CH222437
-   **HO_TEN**: Võ Phương Mai
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1985-12-12
-   **GIOI_TINH**: Nữ

### Bản ghi 147 (hàng Excel 148)

-   **STT_HV**: 147
-   **CCCD**: 87199008458
-   **MA_HOC_VIEN**: CH222436
-   **HO_TEN**: Lê Ngọc Linh
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1999-02-09
-   **GIOI_TINH**: Nữ

### Bản ghi 148 (hàng Excel 149)

-   **STT_HV**: 148
-   **CCCD**: 89186000927
-   **MA_HOC_VIEN**: CH222435
-   **HO_TEN**: Trình Thị Thu Hồng
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1986-07-12
-   **GIOI_TINH**: Nữ

### Bản ghi 149 (hàng Excel 150)

-   **STT_HV**: 149
-   **CCCD**: 89190008425
-   **MA_HOC_VIEN**: CH222434
-   **HO_TEN**: Nguyễn Thị Thúy An
-   **MA_NGANH**: 8420201
-   **TEN_NGANH**: Công nghệ sinh học
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1990-04-17
-   **GIOI_TINH**: Nữ

### Bản ghi 150 (hàng Excel 151)

-   **STT_HV**: 150
-   **CCCD**: 89193015705
-   **MA_HOC_VIEN**: CH222433
-   **HO_TEN**: Nguyễn Thị Trinh
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1993-07-03
-   **GIOI_TINH**: Nữ

### Bản ghi 151 (hàng Excel 152)

-   **STT_HV**: 151
-   **CCCD**: 89099000393
-   **MA_HOC_VIEN**: CH222431
-   **HO_TEN**: Nguyễn Văn Thuận
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1999-01-10
-   **GIOI_TINH**: Nam

### Bản ghi 152 (hàng Excel 153)

-   **STT_HV**: 152
-   **CCCD**: 87095007234
-   **MA_HOC_VIEN**: CH222428
-   **HO_TEN**: Hà Thanh Long
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1995-09-04
-   **GIOI_TINH**: Nam

### Bản ghi 153 (hàng Excel 154)

-   **STT_HV**: 153
-   **CCCD**: 92096009474
-   **MA_HOC_VIEN**: CH222426
-   **HO_TEN**: Trịnh Minh Khôi
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1996-11-16
-   **GIOI_TINH**: Nam

### Bản ghi 154 (hàng Excel 155)

-   **STT_HV**: 154
-   **CCCD**: 89300012949
-   **MA_HOC_VIEN**: CH222425
-   **HO_TEN**: Đỗ Thị Kim hảo
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 2000-03-14
-   **GIOI_TINH**: Nữ

### Bản ghi 155 (hàng Excel 156)

-   **STT_HV**: 155
-   **CCCD**: 89200020561
-   **MA_HOC_VIEN**: CH222424
-   **HO_TEN**: Nguyễn Trương Hồng Công
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 2000-11-06
-   **GIOI_TINH**: Nam

### Bản ghi 156 (hàng Excel 157)

-   **STT_HV**: 156
-   **CCCD**: 89090019579
-   **MA_HOC_VIEN**: CH222423
-   **HO_TEN**: Trần Quốc Tuấn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1990-11-02
-   **GIOI_TINH**: Nam

### Bản ghi 157 (hàng Excel 158)

-   **STT_HV**: 157
-   **CCCD**: 82184002050
-   **MA_HOC_VIEN**: CH222422
-   **HO_TEN**: Đỗ Minh Trang
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1984-02-18
-   **GIOI_TINH**: Nữ

### Bản ghi 158 (hàng Excel 159)

-   **STT_HV**: 158
-   **CCCD**: 89076014976
-   **MA_HOC_VIEN**: CH222421
-   **HO_TEN**: Nguyễn Duy Tân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1976-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 159 (hàng Excel 160)

-   **STT_HV**: 159
-   **CCCD**: 89085015649
-   **MA_HOC_VIEN**: CH222420
-   **HO_TEN**: Võ Hùng Sơn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1985-07-06
-   **GIOI_TINH**: Nam

### Bản ghi 160 (hàng Excel 161)

-   **STT_HV**: 160
-   **CCCD**: 89077012725
-   **MA_HOC_VIEN**: CH222419
-   **HO_TEN**: Nguyễn Văn Sang
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1977-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 161 (hàng Excel 162)

-   **STT_HV**: 161
-   **CCCD**: 89182004330
-   **MA_HOC_VIEN**: CH222418
-   **HO_TEN**: Trương Như Phượng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1982-01-24
-   **GIOI_TINH**: Nữ

### Bản ghi 162 (hàng Excel 163)

-   **STT_HV**: 162
-   **CCCD**: 91078011731
-   **MA_HOC_VIEN**: CH222417
-   **HO_TEN**: Phạm Nhựt
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1978-08-18
-   **GIOI_TINH**: Nam

### Bản ghi 163 (hàng Excel 164)

-   **STT_HV**: 163
-   **CCCD**: 352211932
-   **MA_HOC_VIEN**: CH222416
-   **HO_TEN**: Ngô Thị Hồng Nhung
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1993-01-01
-   **GIOI_TINH**: Nữ

### Bản ghi 164 (hàng Excel 165)

-   **STT_HV**: 164
-   **CCCD**: 91197010299
-   **MA_HOC_VIEN**: CH222415
-   **HO_TEN**: Nguyễn Thị Ngọc
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1997-06-29
-   **GIOI_TINH**: Nữ

### Bản ghi 165 (hàng Excel 166)

-   **STT_HV**: 165
-   **CCCD**: 89079022427
-   **MA_HOC_VIEN**: CH222414
-   **HO_TEN**: Phan Hữu Nghĩa
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1979-12-10
-   **GIOI_TINH**: Nam

### Bản ghi 166 (hàng Excel 167)

-   **STT_HV**: 166
-   **CCCD**: 370953453
-   **MA_HOC_VIEN**: CH222413
-   **HO_TEN**: Huỳnh Hồng Nam
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1981-01-02
-   **GIOI_TINH**: Nam

### Bản ghi 167 (hàng Excel 168)

-   **STT_HV**: 167
-   **CCCD**: 89086025719
-   **MA_HOC_VIEN**: CH222412
-   **HO_TEN**: Nguyễn Thành Luân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1986-10-06
-   **GIOI_TINH**: Nam

### Bản ghi 168 (hàng Excel 169)

-   **STT_HV**: 168
-   **CCCD**: 371052167
-   **MA_HOC_VIEN**: CH222411
-   **HO_TEN**: Lê Văn Kiên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1981-04-11
-   **GIOI_TINH**: Nam

### Bản ghi 169 (hàng Excel 170)

-   **STT_HV**: 169
-   **CCCD**: 371759307
-   **MA_HOC_VIEN**: CH222410
-   **HO_TEN**: Lê Đăng Khoa
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1998-10-27
-   **GIOI_TINH**: Nam

### Bản ghi 170 (hàng Excel 171)

-   **STT_HV**: 170
-   **CCCD**: 89076017861
-   **MA_HOC_VIEN**: CH222409
-   **HO_TEN**: Kiều Thanh Huy
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1976-04-08
-   **GIOI_TINH**: Nam

### Bản ghi 171 (hàng Excel 172)

-   **STT_HV**: 171
-   **CCCD**: 351609299
-   **MA_HOC_VIEN**: CH222408
-   **HO_TEN**: Nguyễn Xuân Hương
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1985-07-18
-   **GIOI_TINH**: Nữ

### Bản ghi 172 (hàng Excel 173)

-   **STT_HV**: 172
-   **CCCD**: 91086017932
-   **MA_HOC_VIEN**: CH222407
-   **HO_TEN**: Đoàn Thanh Hưng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1986-07-01
-   **GIOI_TINH**: Nam

### Bản ghi 173 (hàng Excel 174)

-   **STT_HV**: 173
-   **CCCD**: 87076012841
-   **MA_HOC_VIEN**: CH222406
-   **HO_TEN**: Đặng Ngọc Hiếu
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1976-06-20
-   **GIOI_TINH**: Nam

### Bản ghi 174 (hàng Excel 175)

-   **STT_HV**: 174
-   **CCCD**: 89182001745
-   **MA_HOC_VIEN**: CH222405
-   **HO_TEN**: Trần Huy Hà
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1982-02-06
-   **GIOI_TINH**: Nữ

### Bản ghi 175 (hàng Excel 176)

-   **STT_HV**: 175
-   **CCCD**: 42074016469
-   **MA_HOC_VIEN**: CH222404
-   **HO_TEN**: Võ Việt Dũng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1974-10-15
-   **GIOI_TINH**: Nam

### Bản ghi 176 (hàng Excel 177)

-   **STT_HV**: 176
-   **CCCD**: 36081023244
-   **MA_HOC_VIEN**: CH222403
-   **HO_TEN**: Vũ Văn Chinh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1981-08-06
-   **GIOI_TINH**: Nam

### Bản ghi 177 (hàng Excel 178)

-   **STT_HV**: 177
-   **CCCD**: 89084015064
-   **MA_HOC_VIEN**: CH222402
-   **HO_TEN**: Trương Trung Can
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1984-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 178 (hàng Excel 179)

-   **STT_HV**: 178
-   **CCCD**: 89077000600
-   **MA_HOC_VIEN**: CH222401
-   **HO_TEN**: Nguyễn Ngọc Anh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2023-03-01
-   **KHOA_HOC**: CH09
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2025-02-28
-   **NGAY_SINH**: 1977-03-15
-   **GIOI_TINH**: Nam

### Bản ghi 179 (hàng Excel 180)

-   **STT_HV**: 179
-   **CCCD**: 91093003278
-   **MA_HOC_VIEN**: CH219841
-   **HO_TEN**: Nguyễn Anh Tuấn
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1993-09-22
-   **GIOI_TINH**: Nam

### Bản ghi 180 (hàng Excel 181)

-   **STT_HV**: 180
-   **CCCD**: 89097011865
-   **MA_HOC_VIEN**: CH219840
-   **HO_TEN**: Lưu Vĩnh Trí
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1997-04-11
-   **GIOI_TINH**: Nam

### Bản ghi 181 (hàng Excel 182)

-   **STT_HV**: 181
-   **CCCD**: 87089019154
-   **MA_HOC_VIEN**: CH219839
-   **HO_TEN**: Nguyễn Ngọc Tài
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1989-07-01
-   **GIOI_TINH**: Nam

### Bản ghi 182 (hàng Excel 183)

-   **STT_HV**: 182
-   **CCCD**: 352294159
-   **MA_HOC_VIEN**: CH219838
-   **HO_TEN**: Nguyễn Thị Kim Phượng
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1996-10-23
-   **GIOI_TINH**: Nữ

### Bản ghi 183 (hàng Excel 184)

-   **STT_HV**: 183
-   **CCCD**: 89091012613
-   **MA_HOC_VIEN**: CH219837
-   **HO_TEN**: Trần Thanh Phong
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1991-10-27
-   **GIOI_TINH**: Nam

### Bản ghi 184 (hàng Excel 185)

-   **STT_HV**: 184
-   **CCCD**: 371656940
-   **MA_HOC_VIEN**: CH219836
-   **HO_TEN**: Lưu Thái Phi
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1994-06-26
-   **GIOI_TINH**: Nam

### Bản ghi 185 (hàng Excel 186)

-   **STT_HV**: 185
-   **CCCD**: 352398527
-   **MA_HOC_VIEN**: CH219835
-   **HO_TEN**: Nguyễn Bình Nguyên
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1996-02-05
-   **GIOI_TINH**: Nam

### Bản ghi 186 (hàng Excel 187)

-   **STT_HV**: 186
-   **CCCD**: 352144140
-   **MA_HOC_VIEN**: CH219834
-   **HO_TEN**: Hoàng Trọng Nam
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1992-02-02
-   **GIOI_TINH**: Nam

### Bản ghi 187 (hàng Excel 188)

-   **STT_HV**: 187
-   **CCCD**: 89096013325
-   **MA_HOC_VIEN**: CH219833
-   **HO_TEN**: Nguyễn Văn Minh
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1996-04-28
-   **GIOI_TINH**: Nam

### Bản ghi 188 (hàng Excel 189)

-   **STT_HV**: 188
-   **CCCD**: 341146046
-   **MA_HOC_VIEN**: CH219832
-   **HO_TEN**: Trần Phước Lộc
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1983-07-19
-   **GIOI_TINH**: Nam

### Bản ghi 189 (hàng Excel 190)

-   **STT_HV**: 189
-   **CCCD**: 331656369
-   **MA_HOC_VIEN**: CH219831
-   **HO_TEN**: Nguyễn Tấn Đạt
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1991-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 190 (hàng Excel 191)

-   **STT_HV**: 190
-   **CCCD**: 89096007202
-   **MA_HOC_VIEN**: CH219830
-   **HO_TEN**: Nguyễn Hùng Cường
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1996-01-11
-   **GIOI_TINH**: Nam

### Bản ghi 191 (hàng Excel 192)

-   **STT_HV**: 191
-   **CCCD**: 352459716
-   **MA_HOC_VIEN**: CH219829
-   **HO_TEN**: Trần Quốc Bảo
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1998-01-28
-   **GIOI_TINH**: Nam

### Bản ghi 192 (hàng Excel 193)

-   **STT_HV**: 192
-   **CCCD**: 89096021280
-   **MA_HOC_VIEN**: CH219828
-   **HO_TEN**: Đặng Hữu Ân
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1996-06-09
-   **GIOI_TINH**: Nam

### Bản ghi 193 (hàng Excel 194)

-   **STT_HV**: 193
-   **CCCD**: 351363803
-   **MA_HOC_VIEN**: CH219827
-   **HO_TEN**: Chương Trung Thành
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1981-01-09
-   **GIOI_TINH**: Nam

### Bản ghi 194 (hàng Excel 195)

-   **STT_HV**: 194
-   **CCCD**: 352079560
-   **MA_HOC_VIEN**: CH219826
-   **HO_TEN**: Nguyễn Hoàng Thái
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1990-04-03
-   **GIOI_TINH**: Nam

### Bản ghi 195 (hàng Excel 196)

-   **STT_HV**: 195
-   **CCCD**: 89190028813
-   **MA_HOC_VIEN**: CH219825
-   **HO_TEN**: Hồ Xuân Hoa
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1990-12-31
-   **GIOI_TINH**: Nữ

### Bản ghi 196 (hàng Excel 197)

-   **STT_HV**: 196
-   **CCCD**: 351375324
-   **MA_HOC_VIEN**: CH219824
-   **HO_TEN**: Phan Thị Minh Châu
-   **MA_NGANH**: 8540101
-   **TEN_NGANH**: Công nghệ thực phẩm
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1982-01-18
-   **GIOI_TINH**: Nữ

### Bản ghi 197 (hàng Excel 198)

-   **STT_HV**: 197
-   **CCCD**: 89185013074
-   **MA_HOC_VIEN**: CH219823
-   **HO_TEN**: Lưu Thị ánh Xuân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1985-03-20
-   **GIOI_TINH**: Nữ

### Bản ghi 198 (hàng Excel 199)

-   **STT_HV**: 198
-   **CCCD**: 89087023150
-   **MA_HOC_VIEN**: CH219822
-   **HO_TEN**: Đặng Phú Vinh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1987-12-27
-   **GIOI_TINH**: Nam

### Bản ghi 199 (hàng Excel 200)

-   **STT_HV**: 199
-   **CCCD**: 351710805
-   **MA_HOC_VIEN**: CH219821
-   **HO_TEN**: Tạ Thị Thanh Vân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1983-12-01
-   **GIOI_TINH**: Nữ

### Bản ghi 200 (hàng Excel 201)

-   **STT_HV**: 200
-   **CCCD**: 89184014766
-   **MA_HOC_VIEN**: CH219820
-   **HO_TEN**: Lý Thị Mỹ Trinh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1984-11-23
-   **GIOI_TINH**: Nữ

### Bản ghi 201 (hàng Excel 202)

-   **STT_HV**: 201
-   **CCCD**: 89183016839
-   **MA_HOC_VIEN**: CH219819
-   **HO_TEN**: Minh Bảo Trân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1983-03-23
-   **GIOI_TINH**: Nữ

### Bản ghi 202 (hàng Excel 203)

-   **STT_HV**: 202
-   **CCCD**: 351935029
-   **MA_HOC_VIEN**: CH219818
-   **HO_TEN**: Nguyễn Phú Thạnh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1990-06-16
-   **GIOI_TINH**: Nam

### Bản ghi 203 (hàng Excel 204)

-   **STT_HV**: 203
-   **CCCD**: 89184011644
-   **MA_HOC_VIEN**: CH219817
-   **HO_TEN**: Nguyễn Thị Thắm
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1984-04-01
-   **GIOI_TINH**: Nữ

### Bản ghi 204 (hàng Excel 205)

-   **STT_HV**: 204
-   **CCCD**: 89076018325
-   **MA_HOC_VIEN**: CH219816
-   **HO_TEN**: Phan Thanh Sơn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1976-09-30
-   **GIOI_TINH**: Nam

### Bản ghi 205 (hàng Excel 206)

-   **STT_HV**: 205
-   **CCCD**: 89183001654
-   **MA_HOC_VIEN**: CH219815
-   **HO_TEN**: Lại Thị Mộng Quyên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1983-01-01
-   **GIOI_TINH**: Nữ

### Bản ghi 206 (hàng Excel 207)

-   **STT_HV**: 206
-   **CCCD**: 351528990
-   **MA_HOC_VIEN**: CH219813
-   **HO_TEN**: Cao Trúc Phương
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1981-09-12
-   **GIOI_TINH**: Nữ

### Bản ghi 207 (hàng Excel 208)

-   **STT_HV**: 207
-   **CCCD**: 34186019271
-   **MA_HOC_VIEN**: CH219812
-   **HO_TEN**: Nguyễn Thị Ngọc Oanh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1986-08-11
-   **GIOI_TINH**: Nữ

### Bản ghi 208 (hàng Excel 209)

-   **STT_HV**: 208
-   **CCCD**: 352116443
-   **MA_HOC_VIEN**: CH219811
-   **HO_TEN**: Nguyễn Thị Kim Ngân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1990-09-25
-   **GIOI_TINH**: Nữ

### Bản ghi 209 (hàng Excel 210)

-   **STT_HV**: 209
-   **CCCD**: 351297393
-   **MA_HOC_VIEN**: CH219810
-   **HO_TEN**: Lưu Thị Kim Loan
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1979-04-28
-   **GIOI_TINH**: Nữ

### Bản ghi 210 (hàng Excel 211)

-   **STT_HV**: 210
-   **CCCD**: 89089000299
-   **MA_HOC_VIEN**: CH219809
-   **HO_TEN**: Đỗ Lê Quốc Lập
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1989-03-06
-   **GIOI_TINH**: Nam

### Bản ghi 211 (hàng Excel 212)

-   **STT_HV**: 211
-   **CCCD**: 351400488
-   **MA_HOC_VIEN**: CH219808
-   **HO_TEN**: Nguyễn Thị Hồng Đào
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1980-09-28
-   **GIOI_TINH**: Nữ

### Bản ghi 212 (hàng Excel 213)

-   **STT_HV**: 212
-   **CCCD**: 86187006533
-   **MA_HOC_VIEN**: CH219807
-   **HO_TEN**: Nguyễn Thị Kim Xuyến
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1987-05-18
-   **GIOI_TINH**: Nữ

### Bản ghi 213 (hàng Excel 214)

-   **STT_HV**: 213
-   **CCCD**: 352389104
-   **MA_HOC_VIEN**: CH219805
-   **HO_TEN**: Phạm Thị Phương Thảo
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1999-12-23
-   **GIOI_TINH**: Nữ

### Bản ghi 214 (hàng Excel 215)

-   **STT_HV**: 214
-   **CCCD**: 352416520
-   **MA_HOC_VIEN**: CH219804
-   **HO_TEN**: Nguyễn Thị Trúc Thanh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1998-03-31
-   **GIOI_TINH**: Nữ

### Bản ghi 215 (hàng Excel 216)

-   **STT_HV**: 215
-   **CCCD**: 351916694
-   **MA_HOC_VIEN**: CH219803
-   **HO_TEN**: Nguyễn Hồ Phương
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1991-05-10
-   **GIOI_TINH**: Nữ

### Bản ghi 216 (hàng Excel 217)

-   **STT_HV**: 216
-   **CCCD**: 352447226
-   **MA_HOC_VIEN**: CH219802
-   **HO_TEN**: Nguyễn Đỗ Ngọc Hiền
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1998-05-08
-   **GIOI_TINH**: Nữ

### Bản ghi 217 (hàng Excel 218)

-   **STT_HV**: 217
-   **CCCD**: 91080016273
-   **MA_HOC_VIEN**: CH219801
-   **HO_TEN**: Trần Văn Hải
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2022-03-01
-   **KHOA_HOC**: CH08
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2024-02-29
-   **NGAY_SINH**: 1980-09-01
-   **GIOI_TINH**: Nam

### Bản ghi 218 (hàng Excel 219)

-   **STT_HV**: 218
-   **CCCD**: 89193000500
-   **MA_HOC_VIEN**: CH209862
-   **HO_TEN**: Nguyễn Thị Thùy Vân
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1993-05-24
-   **GIOI_TINH**: Nữ

### Bản ghi 219 (hàng Excel 220)

-   **STT_HV**: 219
-   **CCCD**: 351116672
-   **MA_HOC_VIEN**: CH209861
-   **HO_TEN**: Phạm Quốc Tuấn
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1976-07-25
-   **GIOI_TINH**: Nam

### Bản ghi 220 (hàng Excel 221)

-   **STT_HV**: 220
-   **CCCD**: 89189026000
-   **MA_HOC_VIEN**: CH209860
-   **HO_TEN**: Huỳnh Thị Thanh Thủy
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1989-05-12
-   **GIOI_TINH**: Nữ

### Bản ghi 221 (hàng Excel 222)

-   **STT_HV**: 221
-   **CCCD**: 352294064
-   **MA_HOC_VIEN**: CH209859
-   **HO_TEN**: Hồ Phương Thảo
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1995-04-20
-   **GIOI_TINH**: Nữ

### Bản ghi 222 (hàng Excel 223)

-   **STT_HV**: 222
-   **CCCD**: 351926651
-   **MA_HOC_VIEN**: CH209858
-   **HO_TEN**: Lương Hoàng Thái
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1991-06-19
-   **GIOI_TINH**: Nam

### Bản ghi 223 (hàng Excel 224)

-   **STT_HV**: 223
-   **CCCD**: 352031318
-   **MA_HOC_VIEN**: CH209857
-   **HO_TEN**: Phạm Hồng Phúc
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1991-06-27
-   **GIOI_TINH**: Nam

### Bản ghi 224 (hàng Excel 225)

-   **STT_HV**: 224
-   **CCCD**: 352427345
-   **MA_HOC_VIEN**: CH209856
-   **HO_TEN**: Nguyễn Thị Tuyết Nhung
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1998-06-30
-   **GIOI_TINH**: Nữ

### Bản ghi 225 (hàng Excel 226)

-   **STT_HV**: 225
-   **CCCD**: 352481836
-   **MA_HOC_VIEN**: CH209855
-   **HO_TEN**: Hà Hồng Lĩnh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1997-09-20
-   **GIOI_TINH**: Nam

### Bản ghi 226 (hàng Excel 227)

-   **STT_HV**: 226
-   **CCCD**: 89096024302
-   **MA_HOC_VIEN**: CH209854
-   **HO_TEN**: Nguyễn Hữu Linh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-09-09
-   **GIOI_TINH**: Nam

### Bản ghi 227 (hàng Excel 228)

-   **STT_HV**: 227
-   **CCCD**: 352262259
-   **MA_HOC_VIEN**: CH209853
-   **HO_TEN**: Nguyễn Chí Linh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-05-09
-   **GIOI_TINH**: Nam

### Bản ghi 228 (hàng Excel 229)

-   **STT_HV**: 228
-   **CCCD**: 89092001733
-   **MA_HOC_VIEN**: CH209852
-   **HO_TEN**: Đinh Đăng Khoa
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1992-03-12
-   **GIOI_TINH**: Nam

### Bản ghi 229 (hàng Excel 230)

-   **STT_HV**: 229
-   **CCCD**: 352345578
-   **MA_HOC_VIEN**: CH209851
-   **HO_TEN**: Văng Thị Mai Hương
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-01-21
-   **GIOI_TINH**: Nữ

### Bản ghi 230 (hàng Excel 231)

-   **STT_HV**: 230
-   **CCCD**: 352449354
-   **MA_HOC_VIEN**: CH209850
-   **HO_TEN**: Nguyễn Thị Tuyết Hoa
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1998-10-19
-   **GIOI_TINH**: Nữ

### Bản ghi 231 (hàng Excel 232)

-   **STT_HV**: 231
-   **CCCD**: 351606669
-   **MA_HOC_VIEN**: CH209849
-   **HO_TEN**: Trần Văn Kim Danh
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1984-11-25
-   **GIOI_TINH**: Nam

### Bản ghi 232 (hàng Excel 233)

-   **STT_HV**: 232
-   **CCCD**: 80087012188
-   **MA_HOC_VIEN**: CH209848
-   **HO_TEN**: Phạm Văn Cao
-   **MA_NGANH**: 8850101
-   **TEN_NGANH**: Quản lý tài nguyên và môi trường
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1987-02-03
-   **GIOI_TINH**: Nam

### Bản ghi 233 (hàng Excel 234)

-   **STT_HV**: 233
-   **CCCD**: 89197004695
-   **MA_HOC_VIEN**: CH209847
-   **HO_TEN**: Nguyễn Tường Vy
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1997-04-18
-   **GIOI_TINH**: Nữ

### Bản ghi 234 (hàng Excel 235)

-   **STT_HV**: 234
-   **CCCD**: 87181010924
-   **MA_HOC_VIEN**: CH209846
-   **HO_TEN**: Nguyễn Ngọc Bích
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-11-16
-   **GIOI_TINH**: Nữ

### Bản ghi 235 (hàng Excel 236)

-   **STT_HV**: 235
-   **CCCD**: 34073010742
-   **MA_HOC_VIEN**: CH209845
-   **HO_TEN**: Đặng Văn Uyên
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1973-03-02
-   **GIOI_TINH**: Nam

### Bản ghi 236 (hàng Excel 237)

-   **STT_HV**: 236
-   **CCCD**: 89081014640
-   **MA_HOC_VIEN**: CH209844
-   **HO_TEN**: Lê Ngọc Tuấn
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 237 (hàng Excel 238)

-   **STT_HV**: 237
-   **CCCD**: 89093011449
-   **MA_HOC_VIEN**: CH209843
-   **HO_TEN**: Lê Tuấn
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1993-10-22
-   **GIOI_TINH**: Nam

### Bản ghi 238 (hàng Excel 239)

-   **STT_HV**: 238
-   **CCCD**: 352442657
-   **MA_HOC_VIEN**: CH209842
-   **HO_TEN**: Hồ Thanh Tuấn
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-10-13
-   **GIOI_TINH**: Nam

### Bản ghi 239 (hàng Excel 240)

-   **STT_HV**: 239
-   **CCCD**: 92093005821
-   **MA_HOC_VIEN**: CH209841
-   **HO_TEN**: Đoàn Minh Trí
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1993-12-05
-   **GIOI_TINH**: Nam

### Bản ghi 240 (hàng Excel 241)

-   **STT_HV**: 240
-   **CCCD**: 89185031267
-   **MA_HOC_VIEN**: CH209840
-   **HO_TEN**: Nguyễn Ngọc Trâm
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1985-06-06
-   **GIOI_TINH**: Nữ

### Bản ghi 241 (hàng Excel 242)

-   **STT_HV**: 241
-   **CCCD**: 381223697
-   **MA_HOC_VIEN**: CH209839
-   **HO_TEN**: Lê Mộng Trai
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1985-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 242 (hàng Excel 243)

-   **STT_HV**: 242
-   **CCCD**: 89193004014
-   **MA_HOC_VIEN**: CH209838
-   **HO_TEN**: Trần Thị Thủy Tiên
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1993-10-29
-   **GIOI_TINH**: Nữ

### Bản ghi 243 (hàng Excel 244)

-   **STT_HV**: 243
-   **CCCD**: 351853180
-   **MA_HOC_VIEN**: CH209837
-   **HO_TEN**: Phạm Thị Bé Thi
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1988-01-03
-   **GIOI_TINH**: Nữ

### Bản ghi 244 (hàng Excel 245)

-   **STT_HV**: 244
-   **CCCD**: 301490686
-   **MA_HOC_VIEN**: CH209836
-   **HO_TEN**: Nguyễn Thị Xuân Thắm
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1994-12-27
-   **GIOI_TINH**: Nữ

### Bản ghi 245 (hàng Excel 246)

-   **STT_HV**: 245
-   **CCCD**: 352372748
-   **MA_HOC_VIEN**: CH209835
-   **HO_TEN**: Phan Quý Quá
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1998-04-09
-   **GIOI_TINH**: Nam

### Bản ghi 246 (hàng Excel 247)

-   **STT_HV**: 246
-   **CCCD**: 352182980
-   **MA_HOC_VIEN**: CH209834
-   **HO_TEN**: Nguyễn Thị Quỳnh Như
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1991-11-17
-   **GIOI_TINH**: Nữ

### Bản ghi 247 (hàng Excel 248)

-   **STT_HV**: 247
-   **CCCD**: 352319448
-   **MA_HOC_VIEN**: CH209833
-   **HO_TEN**: Trần Chí Nhân
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-06-11
-   **GIOI_TINH**: Nam

### Bản ghi 248 (hàng Excel 249)

-   **STT_HV**: 248
-   **CCCD**: 89180022634
-   **MA_HOC_VIEN**: CH209832
-   **HO_TEN**: Nguyễn Thị Ngọc Nhàn
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1980-07-18
-   **GIOI_TINH**: Nữ

### Bản ghi 249 (hàng Excel 250)

-   **STT_HV**: 249
-   **CCCD**: 89095011584
-   **MA_HOC_VIEN**: CH209830
-   **HO_TEN**: Huỳnh Đắc Huy
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1995-11-20
-   **GIOI_TINH**: Nam

### Bản ghi 250 (hàng Excel 251)

-   **STT_HV**: 250
-   **CCCD**: 351128835
-   **MA_HOC_VIEN**: CH209829
-   **HO_TEN**: Huỳnh Tấn Hưng
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1979-01-06
-   **GIOI_TINH**: Nam

### Bản ghi 251 (hàng Excel 252)

-   **STT_HV**: 251
-   **CCCD**: 352367488
-   **MA_HOC_VIEN**: CH209828
-   **HO_TEN**: Võ Minh Hiền
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-03-02
-   **GIOI_TINH**: Nam

### Bản ghi 252 (hàng Excel 253)

-   **STT_HV**: 252
-   **CCCD**: 352431980
-   **MA_HOC_VIEN**: CH209827
-   **HO_TEN**: Nguyễn Thanh Điền
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1997-09-10
-   **GIOI_TINH**: Nam

### Bản ghi 253 (hàng Excel 254)

-   **STT_HV**: 253
-   **CCCD**: 370884900
-   **MA_HOC_VIEN**: CH209826
-   **HO_TEN**: Trần Văn Cường
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1979-12-20
-   **GIOI_TINH**: Nam

### Bản ghi 254 (hàng Excel 255)

-   **STT_HV**: 254
-   **CCCD**: 371566175
-   **MA_HOC_VIEN**: CH209825
-   **HO_TEN**: Vũ Thị Chung
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1977-05-28
-   **GIOI_TINH**: Nữ

### Bản ghi 255 (hàng Excel 256)

-   **STT_HV**: 255
-   **CCCD**: 352251590
-   **MA_HOC_VIEN**: CH209824
-   **HO_TEN**: Mai Chí Bảo
-   **MA_NGANH**: 8620110
-   **TEN_NGANH**: Khoa học cây trồng
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng ứng dụng
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1996-02-22
-   **GIOI_TINH**: Nam

### Bản ghi 256 (hàng Excel 257)

-   **STT_HV**: 256
-   **CCCD**: 96184000362
-   **MA_HOC_VIEN**: CH209823
-   **HO_TEN**: Nguyễn Thị Hải Yến
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1984-11-14
-   **GIOI_TINH**: Nữ

### Bản ghi 257 (hàng Excel 258)

-   **STT_HV**: 257
-   **CCCD**: 371499278
-   **MA_HOC_VIEN**: CH209822
-   **HO_TEN**: Phan Thanh Vũ
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1968-11-20
-   **GIOI_TINH**: Nam

### Bản ghi 258 (hàng Excel 259)

-   **STT_HV**: 258
-   **CCCD**: 351297290
-   **MA_HOC_VIEN**: CH209821
-   **HO_TEN**: Nguyễn Thị Diễm Tuyết
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1978-06-10
-   **GIOI_TINH**: Nữ

### Bản ghi 259 (hàng Excel 260)

-   **STT_HV**: 259
-   **CCCD**: 351494950
-   **MA_HOC_VIEN**: CH209820
-   **HO_TEN**: Đào Thị Tuất
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1982-09-22
-   **GIOI_TINH**: Nữ

### Bản ghi 260 (hàng Excel 261)

-   **STT_HV**: 260
-   **CCCD**: 89081015546
-   **MA_HOC_VIEN**: CH209819
-   **HO_TEN**: Nguyễn Phước Trung
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-03-23
-   **GIOI_TINH**: Nam

### Bản ghi 261 (hàng Excel 262)

-   **STT_HV**: 261
-   **CCCD**: 351326847
-   **MA_HOC_VIEN**: CH209818
-   **HO_TEN**: Lê Hồ Thảo Trang
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-01-31
-   **GIOI_TINH**: Nữ

### Bản ghi 262 (hàng Excel 263)

-   **STT_HV**: 262
-   **CCCD**: 351485217
-   **MA_HOC_VIEN**: CH209817
-   **HO_TEN**: Trương Kim Hồng Thư
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1983-08-12
-   **GIOI_TINH**: Nữ

### Bản ghi 263 (hàng Excel 264)

-   **STT_HV**: 263
-   **CCCD**: 89081023789
-   **MA_HOC_VIEN**: CH209816
-   **HO_TEN**: Nguyễn Văn Thịnh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-02-22
-   **GIOI_TINH**: Nam

### Bản ghi 264 (hàng Excel 265)

-   **STT_HV**: 264
-   **CCCD**: 89082012840
-   **MA_HOC_VIEN**: CH209815
-   **HO_TEN**: Trần Tấn Phước
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1982-01-05
-   **GIOI_TINH**: Nam

### Bản ghi 265 (hàng Excel 266)

-   **STT_HV**: 265
-   **CCCD**: 89199003048
-   **MA_HOC_VIEN**: CH209814
-   **HO_TEN**: Huỳnh Thị Ngọc Ngân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1999-04-03
-   **GIOI_TINH**: Nữ

### Bản ghi 266 (hàng Excel 267)

-   **STT_HV**: 266
-   **CCCD**: 351500568
-   **MA_HOC_VIEN**: CH209813
-   **HO_TEN**: Đào Thị Loan
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1980-08-01
-   **GIOI_TINH**: Nữ

### Bản ghi 267 (hàng Excel 268)

-   **STT_HV**: 267
-   **CCCD**: 351105971
-   **MA_HOC_VIEN**: CH209812
-   **HO_TEN**: Huỳnh Vinh Huy
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1976-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 268 (hàng Excel 269)

-   **STT_HV**: 268
-   **CCCD**: 351859071
-   **MA_HOC_VIEN**: CH209811
-   **HO_TEN**: Diệp Quốc Huy
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-06-05
-   **GIOI_TINH**: Nam

### Bản ghi 269 (hàng Excel 270)

-   **STT_HV**: 269
-   **CCCD**: 351556530
-   **MA_HOC_VIEN**: CH209810
-   **HO_TEN**: Nguyễn Thị Hồng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1979-07-20
-   **GIOI_TINH**: Nữ

### Bản ghi 270 (hàng Excel 271)

-   **STT_HV**: 270
-   **CCCD**: 89187005063
-   **MA_HOC_VIEN**: CH209809
-   **HO_TEN**: Huỳnh Thị Thu Hồng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1987-08-02
-   **GIOI_TINH**: Nữ

### Bản ghi 271 (hàng Excel 272)

-   **STT_HV**: 271
-   **CCCD**: 351494305
-   **MA_HOC_VIEN**: CH209808
-   **HO_TEN**: Phạm Thị Bích Hạnh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1982-01-01
-   **GIOI_TINH**: Nữ

### Bản ghi 272 (hàng Excel 273)

-   **STT_HV**: 272
-   **CCCD**: 91075008080
-   **MA_HOC_VIEN**: CH209807
-   **HO_TEN**: Thạch Hoàng Hà
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1975-04-09
-   **GIOI_TINH**: Nam

### Bản ghi 273 (hàng Excel 274)

-   **STT_HV**: 273
-   **CCCD**: 89186008164
-   **MA_HOC_VIEN**: CH209806
-   **HO_TEN**: Ôn Thị Hà
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1986-02-05
-   **GIOI_TINH**: Nữ

### Bản ghi 274 (hàng Excel 275)

-   **STT_HV**: 274
-   **CCCD**: 92192001318
-   **MA_HOC_VIEN**: CH209805
-   **HO_TEN**: Phan Thị Thủy Duyên
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1992-09-20
-   **GIOI_TINH**: Nữ

### Bản ghi 275 (hàng Excel 276)

-   **STT_HV**: 275
-   **CCCD**: 89183021770
-   **MA_HOC_VIEN**: CH209804
-   **HO_TEN**: Nguyễn Thị Ngọc Dung
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1983-07-25
-   **GIOI_TINH**: Nữ

### Bản ghi 276 (hàng Excel 277)

-   **STT_HV**: 276
-   **CCCD**: 371130599
-   **MA_HOC_VIEN**: CH209803
-   **HO_TEN**: Phan Ngọc Diệp
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1987-01-30
-   **GIOI_TINH**: Nữ

### Bản ghi 277 (hàng Excel 278)

-   **STT_HV**: 277
-   **CCCD**: 89081001203
-   **MA_HOC_VIEN**: CH209802
-   **HO_TEN**: Trần Kiên Cường
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1981-06-28
-   **GIOI_TINH**: Nam

### Bản ghi 278 (hàng Excel 279)

-   **STT_HV**: 278
-   **CCCD**: 89082000806
-   **MA_HOC_VIEN**: CH209801
-   **HO_TEN**: Huỳnh Trung Cang
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1982-05-08
-   **GIOI_TINH**: Nam

### Bản ghi 279 (hàng Excel 280)

-   **STT_HV**: 279
-   **CCCD**: 89083016873
-   **MA_HOC_VIEN**: CH209800
-   **HO_TEN**: Nguyễn Huy Bình
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2021-03-01
-   **KHOA_HOC**: CH07
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2023-03-01
-   **NGAY_SINH**: 1983-03-08
-   **GIOI_TINH**: Nam

### Bản ghi 280 (hàng Excel 281)

-   **STT_HV**: 280
-   **CCCD**: 89083027669
-   **MA_HOC_VIEN**: CH199031
-   **HO_TEN**: Trần Thanh Tùng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1983-12-11
-   **GIOI_TINH**: Nam

### Bản ghi 281 (hàng Excel 282)

-   **STT_HV**: 281
-   **CCCD**: 351956878
-   **MA_HOC_VIEN**: CH199030
-   **HO_TEN**: Lâm Mộc Tùng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1975-12-25
-   **GIOI_TINH**: Nam

### Bản ghi 282 (hàng Excel 283)

-   **STT_HV**: 282
-   **CCCD**: 89084006942
-   **MA_HOC_VIEN**: CH199029
-   **HO_TEN**: Võ Thanh Tú
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1984-07-03
-   **GIOI_TINH**: Nam

### Bản ghi 283 (hàng Excel 284)

-   **STT_HV**: 283
-   **CCCD**: 351790570
-   **MA_HOC_VIEN**: CH199028
-   **HO_TEN**: Trần Trung Trưởng
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1987-11-06
-   **GIOI_TINH**: Nam

### Bản ghi 284 (hàng Excel 285)

-   **STT_HV**: 284
-   **CCCD**: 89080014090
-   **MA_HOC_VIEN**: CH199027
-   **HO_TEN**: Trần Văn Tấn
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1980-05-30
-   **GIOI_TINH**: Nam

### Bản ghi 285 (hàng Excel 286)

-   **STT_HV**: 285
-   **CCCD**: 89179000906
-   **MA_HOC_VIEN**: CH199026
-   **HO_TEN**: Phạm Thị Quý
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1979-09-19
-   **GIOI_TINH**: Nữ

### Bản ghi 286 (hàng Excel 287)

-   **STT_HV**: 286
-   **CCCD**: 92082001843
-   **MA_HOC_VIEN**: CH199025
-   **HO_TEN**: Huỳnh Thanh Quang
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-03-29
-   **GIOI_TINH**: Nam

### Bản ghi 287 (hàng Excel 288)

-   **STT_HV**: 287
-   **CCCD**: 351660064
-   **MA_HOC_VIEN**: CH199024
-   **HO_TEN**: Trần Văn Phước
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 288 (hàng Excel 289)

-   **STT_HV**: 288
-   **CCCD**: 89088029050
-   **MA_HOC_VIEN**: CH199023
-   **HO_TEN**: Chiêu Hồng Nhân
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1988-01-25
-   **GIOI_TINH**: Nam

### Bản ghi 289 (hàng Excel 290)

-   **STT_HV**: 289
-   **CCCD**: 89079018502
-   **MA_HOC_VIEN**: CH199022
-   **HO_TEN**: Nông Văn Nghe
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1979-06-10
-   **GIOI_TINH**: Nam

### Bản ghi 290 (hàng Excel 291)

-   **STT_HV**: 290
-   **CCCD**: 89182001675
-   **MA_HOC_VIEN**: CH199021
-   **HO_TEN**: Ôn Thị Nga
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-06-25
-   **GIOI_TINH**: Nữ

### Bản ghi 291 (hàng Excel 292)

-   **STT_HV**: 291
-   **CCCD**: 351514118
-   **MA_HOC_VIEN**: CH199020
-   **HO_TEN**: Lý Thị Lệ Huyền
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1983-01-26
-   **GIOI_TINH**: Nữ

### Bản ghi 292 (hàng Excel 293)

-   **STT_HV**: 292
-   **CCCD**: 350854065
-   **MA_HOC_VIEN**: CH199019
-   **HO_TEN**: Tống Văn On Em
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1966-03-02
-   **GIOI_TINH**: Nam

### Bản ghi 293 (hàng Excel 294)

-   **STT_HV**: 293
-   **CCCD**: 89078000858
-   **MA_HOC_VIEN**: CH199018
-   **HO_TEN**: Nguyễn Vĩnh Điền
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1978-04-01
-   **GIOI_TINH**: Nam

### Bản ghi 294 (hàng Excel 295)

-   **STT_HV**: 294
-   **CCCD**: 89079003713
-   **MA_HOC_VIEN**: CH199017
-   **HO_TEN**: Nguyễn Tuấn Anh
-   **MA_NGANH**: 8140114
-   **TEN_NGANH**: Quản lý giáo dục
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1979-10-09
-   **GIOI_TINH**: Nam

### Bản ghi 295 (hàng Excel 296)

-   **STT_HV**: 295
-   **CCCD**: 351879796
-   **MA_HOC_VIEN**: CH199016
-   **HO_TEN**: Tô Dương Thanh Tuyền
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1990-08-05
-   **GIOI_TINH**: Nữ

### Bản ghi 296 (hàng Excel 297)

-   **STT_HV**: 296
-   **CCCD**: 89085006070
-   **MA_HOC_VIEN**: CH199014
-   **HO_TEN**: Bùi Quang Tuấn
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1985-08-10
-   **GIOI_TINH**: Nam

### Bản ghi 297 (hàng Excel 298)

-   **STT_HV**: 297
-   **CCCD**: 351750532
-   **MA_HOC_VIEN**: CH199012
-   **HO_TEN**: Phạm Văn Thao
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1984-07-23
-   **GIOI_TINH**: Nam

### Bản ghi 298 (hàng Excel 299)

-   **STT_HV**: 298
-   **CCCD**: 351625276
-   **MA_HOC_VIEN**: CH199011
-   **HO_TEN**: Võ Thanh Sang
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-01-01
-   **GIOI_TINH**: Nam

### Bản ghi 299 (hàng Excel 300)

-   **STT_HV**: 299
-   **CCCD**: 351660255
-   **MA_HOC_VIEN**: CH199010
-   **HO_TEN**: Lê Rô Pin
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1985-10-25
-   **GIOI_TINH**: Nam

### Bản ghi 300 (hàng Excel 301)

-   **STT_HV**: 300
-   **CCCD**: 351627634
-   **MA_HOC_VIEN**: CH199009
-   **HO_TEN**: Trương Thanh Phong
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1985-02-01
-   **GIOI_TINH**: Nam

### Bản ghi 301 (hàng Excel 302)

-   **STT_HV**: 301
-   **CCCD**: 352546612
-   **MA_HOC_VIEN**: CH199008
-   **HO_TEN**: Nguyễn Huỳnh Kháng
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-01-12
-   **GIOI_TINH**: Nam

### Bản ghi 302 (hàng Excel 303)

-   **STT_HV**: 302
-   **CCCD**: 351533313
-   **MA_HOC_VIEN**: CH199006
-   **HO_TEN**: Lê Trần Minh Hiếu
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-07-01
-   **GIOI_TINH**: Nữ

### Bản ghi 303 (hàng Excel 304)

-   **STT_HV**: 303
-   **CCCD**: 351509741
-   **MA_HOC_VIEN**: CH199005
-   **HO_TEN**: Nguyễn Thị Bích Hạnh
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1983-04-15
-   **GIOI_TINH**: Nữ

### Bản ghi 304 (hàng Excel 305)

-   **STT_HV**: 304
-   **CCCD**: 351373281
-   **MA_HOC_VIEN**: CH199004
-   **HO_TEN**: Nguyễn Thị út Em
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1982-03-12
-   **GIOI_TINH**: Nữ

### Bản ghi 305 (hàng Excel 306)

-   **STT_HV**: 305
-   **CCCD**: 89086010377
-   **MA_HOC_VIEN**: CH199003
-   **HO_TEN**: Ngô Trí Dũng
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1986-08-20
-   **GIOI_TINH**: Nam

### Bản ghi 306 (hàng Excel 307)

-   **STT_HV**: 306
-   **CCCD**: 351934542
-   **MA_HOC_VIEN**: CH199002
-   **HO_TEN**: Nguyễn Văn Cường
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1989-04-05
-   **GIOI_TINH**: Nam

### Bản ghi 307 (hàng Excel 308)

-   **STT_HV**: 307
-   **CCCD**: 351316250
-   **MA_HOC_VIEN**: CH199001
-   **HO_TEN**: Dương Trung Chiến
-   **MA_NGANH**: 8620105
-   **TEN_NGANH**: Chăn nuôi
-   **LOAI_CHUONG_TRINH**: Chương trình thạc sĩ định hướng nghiên cứu
-   **TRINH_DO_DAO_TAO**: Thạc sĩ
-   **NGAY_NHAP_HOC**: 2020-03-01
-   **KHOA_HOC**: CH06
-   **TRANG_THAI**: Đã tốt nghiệp
-   **NGAY_HET_HAN_DT**: 2022-03-01
-   **NGAY_SINH**: 1981-04-04
-   **GIOI_TINH**: Nam

### Bản ghi 308 (hàng Excel 309)

-   **STT_HV**: 1
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 309 (hàng Excel 310)

-   **STT_HV**: 2
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 310 (hàng Excel 311)

-   **STT_HV**: 3
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 311 (hàng Excel 312)

-   **STT_HV**: 4
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 312 (hàng Excel 313)

-   **STT_HV**: 5
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 313 (hàng Excel 314)

-   **STT_HV**: 6
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 314 (hàng Excel 315)

-   **STT_HV**: 7
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 315 (hàng Excel 316)

-   **STT_HV**: 8
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 316 (hàng Excel 317)

-   **STT_HV**: 9
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 317 (hàng Excel 318)

-   **STT_HV**: 10
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 318 (hàng Excel 319)

-   **STT_HV**: 11
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 319 (hàng Excel 320)

-   **STT_HV**: 12
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 320 (hàng Excel 321)

-   **STT_HV**: 13
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 321 (hàng Excel 322)

-   **STT_HV**: 14
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 322 (hàng Excel 323)

-   **STT_HV**: 15
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 323 (hàng Excel 324)

-   **STT_HV**: 16
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 324 (hàng Excel 325)

-   **STT_HV**: 17
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 325 (hàng Excel 326)

-   **STT_HV**: 18
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 326 (hàng Excel 327)

-   **STT_HV**: 19
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 327 (hàng Excel 328)

-   **STT_HV**: 20
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 328 (hàng Excel 329)

-   **STT_HV**: 21
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 329 (hàng Excel 330)

-   **STT_HV**: 22
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 330 (hàng Excel 331)

-   **STT_HV**: 23
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 331 (hàng Excel 332)

-   **STT_HV**: 24
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 332 (hàng Excel 333)

-   **STT_HV**: 25
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 333 (hàng Excel 334)

-   **STT_HV**: 26
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 334 (hàng Excel 335)

-   **STT_HV**: 27
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 335 (hàng Excel 336)

-   **STT_HV**: 28
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 336 (hàng Excel 337)

-   **STT_HV**: 29
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 337 (hàng Excel 338)

-   **STT_HV**: 30
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 338 (hàng Excel 339)

-   **STT_HV**: 31
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 339 (hàng Excel 340)

-   **STT_HV**: 32
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 340 (hàng Excel 341)

-   **STT_HV**: 33
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 341 (hàng Excel 342)

-   **STT_HV**: 34
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 342 (hàng Excel 343)

-   **STT_HV**: 35
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 343 (hàng Excel 344)

-   **STT_HV**: 36
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 344 (hàng Excel 345)

-   **STT_HV**: 37
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 345 (hàng Excel 346)

-   **STT_HV**: 38
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 346 (hàng Excel 347)

-   **STT_HV**: 39
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 347 (hàng Excel 348)

-   **STT_HV**: 40
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 348 (hàng Excel 349)

-   **STT_HV**: 41
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 349 (hàng Excel 350)

-   **STT_HV**: 42
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 350 (hàng Excel 351)

-   **STT_HV**: 43
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 351 (hàng Excel 352)

-   **STT_HV**: 44
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 352 (hàng Excel 353)

-   **STT_HV**: 45
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 353 (hàng Excel 354)

-   **STT_HV**: 46
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 354 (hàng Excel 355)

-   **STT_HV**: 47
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 355 (hàng Excel 356)

-   **STT_HV**: 48
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 356 (hàng Excel 357)

-   **STT_HV**: 49
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 357 (hàng Excel 358)

-   **STT_HV**: 50
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 358 (hàng Excel 359)

-   **STT_HV**: 51
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 359 (hàng Excel 360)

-   **STT_HV**: 52
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 360 (hàng Excel 361)

-   **STT_HV**: 53
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 361 (hàng Excel 362)

-   **STT_HV**: 54
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 362 (hàng Excel 363)

-   **STT_HV**: 55
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 363 (hàng Excel 364)

-   **STT_HV**: 56
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 364 (hàng Excel 365)

-   **STT_HV**: 57
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 365 (hàng Excel 366)

-   **STT_HV**: 58
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 366 (hàng Excel 367)

-   **STT_HV**: 59
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 367 (hàng Excel 368)

-   **STT_HV**: 60
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 368 (hàng Excel 369)

-   **STT_HV**: 61
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 369 (hàng Excel 370)

-   **STT_HV**: 62
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 370 (hàng Excel 371)

-   **STT_HV**: 63
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 371 (hàng Excel 372)

-   **STT_HV**: 64
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 372 (hàng Excel 373)

-   **STT_HV**: 65
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 373 (hàng Excel 374)

-   **STT_HV**: 66
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 374 (hàng Excel 375)

-   **STT_HV**: 67
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 375 (hàng Excel 376)

-   **STT_HV**: 68
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 376 (hàng Excel 377)

-   **STT_HV**: 69
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 377 (hàng Excel 378)

-   **STT_HV**: 70
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 378 (hàng Excel 379)

-   **STT_HV**: 71
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 379 (hàng Excel 380)

-   **STT_HV**: 72
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 380 (hàng Excel 381)

-   **STT_HV**: 73
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 381 (hàng Excel 382)

-   **STT_HV**: 74
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 382 (hàng Excel 383)

-   **STT_HV**: 75
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 383 (hàng Excel 384)

-   **STT_HV**: 76
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 384 (hàng Excel 385)

-   **STT_HV**: 77
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 385 (hàng Excel 386)

-   **STT_HV**: 78
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 386 (hàng Excel 387)

-   **STT_HV**: 79
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 387 (hàng Excel 388)

-   **STT_HV**: 80
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 388 (hàng Excel 389)

-   **STT_HV**: 81
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 389 (hàng Excel 390)

-   **STT_HV**: 82
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 390 (hàng Excel 391)

-   **STT_HV**: 83
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 391 (hàng Excel 392)

-   **STT_HV**: 84
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 392 (hàng Excel 393)

-   **STT_HV**: 85
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 393 (hàng Excel 394)

-   **STT_HV**: 86
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 394 (hàng Excel 395)

-   **STT_HV**: 87
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 395 (hàng Excel 396)

-   **STT_HV**: 88
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 396 (hàng Excel 397)

-   **STT_HV**: 89
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 397 (hàng Excel 398)

-   **STT_HV**: 90
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 398 (hàng Excel 399)

-   **STT_HV**: 91
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 399 (hàng Excel 400)

-   **STT_HV**: 92
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 400 (hàng Excel 401)

-   **STT_HV**: 93
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 401 (hàng Excel 402)

-   **STT_HV**: 94
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 402 (hàng Excel 403)

-   **STT_HV**: 95
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 403 (hàng Excel 404)

-   **STT_HV**: 96
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 404 (hàng Excel 405)

-   **STT_HV**: 97
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 405 (hàng Excel 406)

-   **STT_HV**: 98
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 406 (hàng Excel 407)

-   **STT_HV**: 99
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 407 (hàng Excel 408)

-   **STT_HV**: 100
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 408 (hàng Excel 409)

-   **STT_HV**: 101
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 409 (hàng Excel 410)

-   **STT_HV**: 102
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 410 (hàng Excel 411)

-   **STT_HV**: 103
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 411 (hàng Excel 412)

-   **STT_HV**: 104
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 412 (hàng Excel 413)

-   **STT_HV**: 105
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 413 (hàng Excel 414)

-   **STT_HV**: 106
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 414 (hàng Excel 415)

-   **STT_HV**: 107
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 415 (hàng Excel 416)

-   **STT_HV**: 108
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 416 (hàng Excel 417)

-   **STT_HV**: 109
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 417 (hàng Excel 418)

-   **STT_HV**: 110
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 418 (hàng Excel 419)

-   **STT_HV**: 111
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 419 (hàng Excel 420)

-   **STT_HV**: 112
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 420 (hàng Excel 421)

-   **STT_HV**: 113
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 421 (hàng Excel 422)

-   **STT_HV**: 114
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 422 (hàng Excel 423)

-   **STT_HV**: 115
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 423 (hàng Excel 424)

-   **STT_HV**: 116
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 424 (hàng Excel 425)

-   **STT_HV**: 117
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 425 (hàng Excel 426)

-   **STT_HV**: 118
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 426 (hàng Excel 427)

-   **STT_HV**: 119
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 427 (hàng Excel 428)

-   **STT_HV**: 120
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 428 (hàng Excel 429)

-   **STT_HV**: 121
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 429 (hàng Excel 430)

-   **STT_HV**: 122
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 430 (hàng Excel 431)

-   **STT_HV**: 123
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 431 (hàng Excel 432)

-   **STT_HV**: 124
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

### Bản ghi 432 (hàng Excel 433)

-   **STT_HV**: 125
-   **NGAY_NHAP_HOC**: 2026-09-09
-   **KHOA_HOC**: CH13
-   **TRANG_THAI**: Đang học
-   **NGAY_HET_HAN_DT**: 2028-09-08

*Kết thúc sheet HOCVIEN: 432 bản ghi có dữ liệu.*

## LUAN_VAN

-   Thư viện Trường Đại học An Giang
-   Địa chỉ: Long Xuyên - An Giang
-   Website: http://lib.agu.edu.vn
-   An Giang, ngày 7 tháng 9 năm 2026
-   DANH SÁCH LUẬN VĂN HỌC VIÊN - AGU
-   Bản in: 282
-   Điện tử: 224
-   STT \| Nhan đề \| Tác giả \| Giảng viên hướng dẫn \| Chuyên ngành \|
    Phân loại \| Năm xuất bản \| Số đăng ký cá biệt \| Điện tử

### Bản ghi 1 (hàng Excel 9)

-   **STT**: 1
-   **Nhan đề**: Định danh, xác định độc tính và nhân giống nấm Chaga
    (Inonotus obliquus) thu thập hoang dại tại An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Công nghệ sinh học / Nguyễn Thị Thúy An ; TS.
    Hồ Thị Thu Ba hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Thúy An.
-   **Giảng viên hướng dẫn**: Hồ, Thị Thu Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 635.8 A105 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000275
-   **Điện tử**: 0

### Bản ghi 2 (hàng Excel 10)

-   **STT**: 2
-   **Nhan đề**: Lai tạo giống nấm mối đen (Xerula radicata) bằng đơn
    bào tử : Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh học / Hồ
    Thị Kim Ngân ; TS. Hồ Thị Thu Ba hướng dẫn.
-   **Tác giả**: Hồ, Thị Kim Ngân.
-   **Giảng viên hướng dẫn**: Hồ, Thị Thu Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 635.8 Ng121 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000276
-   **Điện tử**: 0

### Bản ghi 3 (hàng Excel 11)

-   **STT**: 3
-   **Nhan đề**: Lai tạo giống nấm rơm (Volvariella volvacea) bằng đơn
    bào tử cho năng suất cao : Luận văn tốt nghiệp Thạc sĩ ngành Công
    nghệ sinh học / Trần Thị Ngọc Ngà ; TS. Hồ Thị Thu Ba hướng dẫn.
-   **Tác giả**: Trần, Thị Ngọc Ngà.
-   **Giảng viên hướng dẫn**: Hồ, Thị Thu Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 635.8 Ng100 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000277
-   **Điện tử**: 0

### Bản ghi 4 (hàng Excel 12)

-   **STT**: 4
-   **Nhan đề**: Đánh giá khả năng ra hoa đậu trái của xoài Thơm Vĩnh
    Hòa trong điều kiện bổ sung phân vi sinh : Luận văn tốt nghiệp Thạc
    sĩ ngành Công nghệ sinh học / Nguyễn Văn Thiệt ; TS. Nguyễn Thị Mỹ
    Duyên hướng dẫn.
-   **Tác giả**: Nguyễn, Văn Thiệt.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Mỹ Duyên,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 634.44 Th308 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000279
-   **Điện tử**: 0

### Bản ghi 5 (hàng Excel 13)

-   **STT**: 5
-   **Nhan đề**: Phân lập và tuyển chọn nấm mốc có khả năng sinh enzyme
    amylase trong bánh men cơm rượu : Luận văn tốt nghiệp Thạc sĩ ngành
    Công nghệ sinh học / Võ Phương Mai ; TS. Nguyễn Phú Thọ, TS. Nguyễn
    Duy Tân hướng dẫn.
-   **Tác giả**: Võ, Phương Mai.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Thọ,;"Nguyễn, Duy Tân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 660.634 M103 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000280
-   **Điện tử**: 0

### Bản ghi 6 (hàng Excel 14)

-   **STT**: 6
-   **Nhan đề**: Đánh giá sự thay đổi thành phần của hệ vi khuẩn trong
    quá trình lên men tự nhiên nước mắm cá linh : Luận văn tốt nghiệp
    Thạc sĩ ngành Công nghệ sinh học / Trần Thị Mỹ Ngọc ; TS. Nguyễn Phú
    Thọ, TS. Nguyễn Duy Tân hướng dẫn.
-   **Tác giả**: Trần, Thị Mỹ Ngọc.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Thọ,;"Nguyễn, Duy Tân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 664.94 Ng419 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000281
-   **Điện tử**: 0

### Bản ghi 7 (hàng Excel 15)

-   **STT**: 7
-   **Nhan đề**: Khảo sát dấu phân tử SSR của các giống xoài trồng tại
    tỉnh An Giang có liên quan đến tính trạng mùi thơm : Luận văn tốt
    nghiệp Thạc sĩ ngành Công nghệ sinh học / Trình Thị Thu Hồng ; TS.
    Cao Thị Luyến, TS. Nguyễn Thị Mỹ Duyên. hướng dẫn.
-   **Tác giả**: Trình, Thị Thu Hồng.
-   **Giảng viên hướng dẫn**: Cao, Thị Luyến,;"Nguyễn, Thị Mỹ Duyên,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ sinh
    học /
-   **Phân loại**: 634.44 H455 2026
-   **Năm xuất bản**: 2026.
-   **Số đăng ký cá biệt**: 180302000282
-   **Điện tử**: 0

### Bản ghi 8 (hàng Excel 16)

-   **STT**: 8
-   **Nhan đề**: Sử dụng chế phẩm sinh học trong canh tác lúa và ảnh
    hưởng của vi khuẩn không lưu huỳnh màu tía đến năng suất lúa và giảm
    phát thải CH4 trên đất phèn trong điều kiện nhà lưới : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Hùng Cường ; TS.
    Phạm Huỳnh Thanh Vân hướng dẫn.
-   **Tác giả**: Nguyễn, Hùng Cường.
-   **Giảng viên hướng dẫn**: Phạm, Huỳnh Thanh Vân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 C561 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000123
-   **Điện tử**: 1

### Bản ghi 9 (hàng Excel 17)

-   **STT**: 9
-   **Nhan đề**: Tuyển chọn nấm Chaetomium sp. đối kháng vi khuẩn gây
    bệnh xơ đen mít siêu sớm trong điều kiện in vitro và ngoài đồng tại
    huyện Chợ Mới, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Lưu Thái Phi ; TS. Trương Ánh Phương hướng dẫn.
-   **Tác giả**: Lưu, Thái Phi.
-   **Giảng viên hướng dẫn**: Trương, Ánh Phương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 632.9 Ph300 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000228
-   **Điện tử**: 1

### Bản ghi 10 (hàng Excel 18)

-   **STT**: 10
-   **Nhan đề**: Phân lập và tuyển chọn vi khuẩn bacillus sp. đối kháng
    vi khuẩn gây bệnh xơ đen trong điều kiện in vitro và ngoài đồng tại
    huyện Châu Thành, An Giang ở mít siêu sớm (Artocarpus heterophyllus)
    : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Anh
    Tuấn ; TS. Nguyễn Phú Dũng hướng dẫn.
-   **Tác giả**: Nguyễn, Anh Tuấn.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Dũng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 579.3 T502 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000232
-   **Điện tử**: 1

### Bản ghi 11 (hàng Excel 19)

-   **STT**: 11
-   **Nhan đề**: Phân lập, tuyển chọn streptomyces sp. đối kháng vi
    khuẩn gây bệnh xơ đen trong điều kiện in vitro và ngoài đồng tại
    huyện Châu Phú, An Giang ở mít siêu sớm (Artocarpus heterophyllus) :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lưu Vĩnh Trí
    ; TS. Nguyễn Phú Dũng hướng dẫn.
-   **Tác giả**: Lưu, Vĩnh Trí.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Dũng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 579.3 Tr300 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000233
-   **Điện tử**: 1

### Bản ghi 12 (hàng Excel 20)

-   **STT**: 12
-   **Nhan đề**: Phân lập, tuyển chọn vi khuẩn quang dưỡng không lưu
    huỳnh màu tía cung cấp dưỡng chất, giảm độc chất, phát thải CH4 trên
    đất phèn trồng lúa ở An Giang và Đồng Tháp : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Nguyễn Văn Minh ; TS. Lý Ngọc
    Thanh Xuân hướng dẫn.
-   **Tác giả**: Nguyễn, Văn Minh.
-   **Giảng viên hướng dẫn**: Lý, Ngọc Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 M312 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000256
-   **Điện tử**: 1

### Bản ghi 13 (hàng Excel 21)

-   **STT**: 13
-   **Nhan đề**: Phân lập và tuyển chọn vi khuẩn quang dưỡng không lưu
    huỳnh màu tía cung cấp dưỡng chất, giảm phát thải CH4 trên đất phèn
    trồng lúa ở Bạc Liêu, Hậu Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Đặng Hữu Ân ; TS. Lý Ngọc Thanh Xuân hướng dẫn.
-   **Tác giả**: Đặng, Hữu Ân.
-   **Giảng viên hướng dẫn**: Lý, Ngọc Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 Â121 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000257
-   **Điện tử**: 1

### Bản ghi 14 (hàng Excel 22)

-   **STT**: 14
-   **Nhan đề**: Ảnh hưởng của vi khuẩn nội sinh Bacillus aryabhattai
    lên năng suất và chất lượng cây bắp non (Zea mays L.) : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Hoàng Trọng Nam ; PGS.TS.
    Nguyễn Văn Chương hướng dẫn.
-   **Tác giả**: Hoàng, Trọng Nam.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.158 N104 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000258
-   **Điện tử**: 1

### Bản ghi 15 (hàng Excel 23)

-   **STT**: 15
-   **Nhan đề**: Phân lập và tuyển chọn xạ khuẩn có khả năng tiết enzyme
    đối kháng với nấm Phytophthora sp. gây nứt thân xì mủ trên cây mít ở
    điều kiện in vitro : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Trương Hồng Công ; TS. Nguyễn Phú Dũng hướng dẫn.
-   **Tác giả**: Nguyễn, Trương Hồng Công.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Dũng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.2 C455 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000259
-   **Điện tử**: 1

### Bản ghi 16 (hàng Excel 24)

-   **STT**: 16
-   **Nhan đề**: Ảnh hưởng của vi khuẩn nội sinh Bacillus megaterium kết
    hợp giảm phân đạm, kali đến năng suất và chất lượng cây bắp nếp lai
    (Zea mays L.) : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng
    / Nguyễn Văn Thuận ; PGS.TS. Nguyễn Văn Chương hướng dẫn.
-   **Tác giả**: Nguyễn, Văn Thuận.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.158 Th502 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000260
-   **Điện tử**: 1

### Bản ghi 17 (hàng Excel 25)

-   **STT**: 17
-   **Nhan đề**: Ảnh hưởng của phương pháp nhân giống, mật độ trồng, cắt
    tỉa và che lưới đến sinh trưởng và năng suất cây thù lù Nam Mỹ
    (Physalis philadelphica) : Luận văn tốt nghiệp Thạc sĩ ngành Khoa
    học cây trồng / Trịnh Minh Khôi ; TS. Nguyễn Thị Mỹ Duyên, TS. Bùi
    Thị Dương Khuyều hướng dẫn.
-   **Tác giả**: Trịnh, Minh Khôi.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Mỹ Duyên,;"Bùi, Thị Dương
    Khuyều,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.64 Kh452 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000261
-   **Điện tử**: 1

### Bản ghi 18 (hàng Excel 26)

-   **STT**: 18
-   **Nhan đề**: Đánh giá sự đa dạng di truyền bộ giống lúa màu bằng đặc
    tính nông học và nhận diện kiểu gen quy định chất lượng gạo : Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Thị Trinh ;
    TS. Bùi Thị Dương Khuyều hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Trinh.
-   **Giảng viên hướng dẫn**: Bùi, Thị Dương Khuyều,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18233 Tr312 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000262
-   **Điện tử**: 1

### Bản ghi 19 (hàng Excel 27)

-   **STT**: 19
-   **Nhan đề**: Tuyển chọn một số dòng lúa triển vọng năng suất cao
    trên nền đất phèn tại Cờ Đỏ - Cần Thơ : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Hà Thanh Long ; TS. Lê Hữu Phước, TS.
    Trương Ánh Phương hướng dẫn.
-   **Tác giả**: Hà, Thanh Long.
-   **Giảng viên hướng dẫn**: Lê, Hữu Phước,;"Trương, Ánh Phương,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1894 L431 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000263
-   **Điện tử**: 1

### Bản ghi 20 (hàng Excel 28)

-   **STT**: 20
-   **Nhan đề**: Ảnh hưởng dịch trích từ cây cúc mai ((Tridax
    procumbens) và ké đầu ngựa (Xanthium strumarium) đến quản lý cỏ mần
    trầu (Eleusine indica) trên cải ngọt (Brassica integrifolia) : Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Đỗ Thị Kim Hảo ;
    TS. Lê Hữu Phước hướng dẫn.
-   **Tác giả**: Đỗ, Thị Kim Hảo.
-   **Giảng viên hướng dẫn**: Lê, Hữu Phước,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 632.5 H108 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000264
-   **Điện tử**: 0

### Bản ghi 21 (hàng Excel 29)

-   **STT**: 21
-   **Nhan đề**: Nghiên cứu chế biến nước uống lên men từ hạt lúa nếp
    nẩy mầm : Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ thực phẩm / Hồ
    Xuân Hoa ; TS. Nguyễn Duy Tân hướng dẫn.
-   **Tác giả**: Hồ, Xuân Hoa.
-   **Giảng viên hướng dẫn**: Nguyễn, Duy Tân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ thực
    phẩm /
-   **Phân loại**: 663.1 H401 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000265
-   **Điện tử**: 0

### Bản ghi 22 (hàng Excel 30)

-   **STT**: 22
-   **Nhan đề**: Khảo sát các yếu tố ảnh hưởng đến tính chất bột dế giàu
    protein từ dế ta (Gryllus bimaculatus) : Luận văn tốt nghiệp Thạc sĩ
    ngành Công nghệ thực phẩm / Chương Trung Thành ; TS. Nguyễn Duy Tân,
    TS. Trần Nghĩa Khang hướng dẫn.
-   **Tác giả**: Chương, Trung Thành.
-   **Giảng viên hướng dẫn**: Nguyễn, Duy Tân,;"Trần, Nghĩa Khang,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ thực
    phẩm /
-   **Phân loại**: 641.396 Th107 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000266
-   **Điện tử**: 1

### Bản ghi 23 (hàng Excel 31)

-   **STT**: 23
-   **Nhan đề**: Khảo sát ảnh hưởng của điều kiện thu hoạch và phương
    pháp bảo quản đến chất lượng nước thốt nốt : Luận văn tốt nghiệp
    Thạc sĩ ngành Công nghệ thực phẩm / Phan Thị Minh Châu ; TS. Cao Thị
    Luyến hướng dẫn.
-   **Tác giả**: Phan, Thị Minh Châu.
-   **Giảng viên hướng dẫn**: Cao, Thị Luyến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Công nghệ thực
    phẩm /
-   **Phân loại**: 663.13 Ch125 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000267
-   **Điện tử**: 1

### Bản ghi 24 (hàng Excel 32)

-   **STT**: 24
-   **Nhan đề**: Đánh giá tiềm năng xử lý rơm rạ sau thu hoạch tại huyện
    Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    tài nguyên và môi trường / Nguyễn Thị Trúc Thanh ; TS. Trần Ngọc
    Châu hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Trúc Thanh.
-   **Giảng viên hướng dẫn**: Trần, Ngọc Châu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý tài
    nguyên và môi trường /
-   **Phân loại**: 363.738 Th107 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000268
-   **Điện tử**: 1

### Bản ghi 25 (hàng Excel 33)

-   **STT**: 25
-   **Nhan đề**: Đánh giá mô hình sinh kế nuôi và chế biến khô cá lóc
    tại tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý tài
    nguyên và môi trường / Nguyễn Hồ Phương ; TS. Nguyễn Trần Thiện
    Khánh hướng dẫn.
-   **Tác giả**: Nguyễn, Hồ Phương.
-   **Giảng viên hướng dẫn**: Nguyễn, Trần Thiện Khánh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý tài
    nguyên và môi trường /
-   **Phân loại**: 338.3727 Ph561 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000269
-   **Điện tử**: 1

### Bản ghi 26 (hàng Excel 34)

-   **STT**: 26
-   **Nhan đề**: Phát triển đội ngũ giáo viên tiếng Anh tại các trường
    mầm non thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý giáo dục / Nguyễn Thị Thu Loan ; TS. Trần Minh
    Nhựt, TS. Huỳnh Thanh Tiến hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Thu Loan.
-   **Giảng viên hướng dẫn**: Trần, Minh Nhựt,;"Huỳnh, Thanh Tiến,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.6521 L406 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000270
-   **Điện tử**: 1

### Bản ghi 27 (hàng Excel 35)

-   **STT**: 27
-   **Nhan đề**: Quản lý hoạt động ứng dụng công nghệ thông tin trong
    dạy học tại các trường tiểu học thành phố Long Xuyên, tỉnh An Giang
    : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Nguyễn Huỳnh
    Bảo Như ; PGS.TS. Trần Văn Đạt hướng dẫn.
-   **Tác giả**: Nguyễn, Huỳnh Bảo Như.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.133 Nh550 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000271
-   **Điện tử**: 1

### Bản ghi 28 (hàng Excel 36)

-   **STT**: 28
-   **Nhan đề**: Quản lý hoạt động tư vấn học đường cho học sinh ở các
    trường trung học phổ thông thành phố Long Xuyên, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Lê Lâm Mỹ Ngọc
    ; TS. Nguyễn Bách Thắng hướng dẫn.
-   **Tác giả**: Lê, Lâm Mỹ Ngọc.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.1 Ng419 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000272
-   **Điện tử**: 1

### Bản ghi 29 (hàng Excel 37)

-   **STT**: 29
-   **Nhan đề**: Đánh giá hiện trạng khai thác, sử dụng và chất lượng
    nước dưới đất trên địa bàn tỉnh Kiên Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý tài nguyên và môi trường / Phạm Thị Phương
    Thảo ; TS. Nguyễn Hữu Trí, PGS.TS Phan Trường Khanh hướng dẫn.
-   **Tác giả**: Phạm, Thị Phương Thảo.
-   **Giảng viên hướng dẫn**: Nguyễn, Hữu Trí,;"Phan, Trường Khanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý tài
    nguyên và môi trường /
-   **Phân loại**: 363.739 Th108 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000273
-   **Điện tử**: 1

### Bản ghi 30 (hàng Excel 38)

-   **STT**: 30
-   **Nhan đề**: Đánh giá hiện trạng khai thác, sử dụng và chất lượng
    nước dưới đất huyện Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý tài nguyên và môi trường / Nguyễn Thị Kim
    Xuyến ; TS. Nguyễn Hữu Trí, PGS.TS Phan Trường Khanh hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Kim Xuyến.
-   **Giảng viên hướng dẫn**: Nguyễn, Hữu Trí,;"Phan, Trường Khanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý tài
    nguyên và môi trường /
-   **Phân loại**: 363.739 X527 2025
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000274
-   **Điện tử**: 0

### Bản ghi 31 (hàng Excel 39)

-   **STT**: 31
-   **Nhan đề**: Ảnh hưởng của vi khuẩn Bacillus sp. đối kháng nấm gây
    bệnh lỡ cổ rễ trên cây đậu nành rau : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Trần Quốc Bảo ; TS. Nguyễn Hữu Thanh
    hướng dẫn.
-   **Tác giả**: Trần, Quốc Bảo.
-   **Giảng viên hướng dẫn**: Nguyễn, Hữu Thanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.3489 B108 2026
-   **Năm xuất bản**: 2025.
-   **Số đăng ký cá biệt**: 180302000278
-   **Điện tử**: 0

### Bản ghi 32 (hàng Excel 40)

-   **STT**: 32
-   **Nhan đề**: Đánh giá ảnh hưởng của Thiobencarb đến vi khuẩn hiếu
    khí và phân hủy tự nhiên của Thiobencarb trong đất : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Huỳnh Thị
    Thanh Thủy ; PGS.TS. Hà Danh Đức, TS. Nguyễn Thanh Hùng hướng dẫn
    khoa học.
-   **Tác giả**: Huỳnh, Thị Thanh Thủy.
-   **Giảng viên hướng dẫn**: Hà, Danh Đức,;"Nguyễn, Thanh Hùng,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7288 Th523 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000173
-   **Điện tử**: 1

### Bản ghi 33 (hàng Excel 41)

-   **STT**: 33
-   **Nhan đề**: Ảnh hưởng của một số yếu tố môi trường và con người đến
    quần thể Le nâu (Dendrocygna javanica) ở Khu bảo tồn đất ngập nước
    Láng Sen, tỉnh Long An : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Tài nguyên và Môi trường / Lương Hoàng Thái ; NCS.Trần Thị Hồng Ngọc
    hướng dẫn khoa học.
-   **Tác giả**: Lương, Hoàng Thái.
-   **Giảng viên hướng dẫn**: Trần, Thị Hồng Ngọc,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 333.958 Th103 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000174
-   **Điện tử**: 1

### Bản ghi 34 (hàng Excel 42)

-   **STT**: 34
-   **Nhan đề**: Mô phỏng chất lượng nước tại Búng Bình Thiên, tỉnh An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi
    trường / Nguyễn Thị Thùy Vân ; TS. Trần Ngọc Châu hướng dẫn khoa
    học.
-   **Tác giả**: Nguyễn, Thị Thùy Vân.
-   **Giảng viên hướng dẫn**: Trần, Ngọc Châu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7394 V121 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000175
-   **Điện tử**: 1

### Bản ghi 35 (hàng Excel 43)

-   **STT**: 35
-   **Nhan đề**: Đánh giá và đề xuất các giải pháp thích ứng với sự cố
    sạt lở đất bờ sông Hậu huyện Châu Phú, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Phạm Quốc
    Tuấn ; TS.Trần Ngọc Châu hướng dẫn khoa học.
-   **Tác giả**: Phạm, Quốc Tuấn.
-   **Giảng viên hướng dẫn**: Trần, Ngọc Châu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 551.48 T502 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000176
-   **Điện tử**: 1

### Bản ghi 36 (hàng Excel 44)

-   **STT**: 36
-   **Nhan đề**: Đánh giá thực trạng và đề xuất giải pháp quản lý chất
    thải rắn sinh hoạt tại huyện Châu Thành, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Phạm Văn
    Cao ; TS. Nguyễn Trần Thiện Khánh hướng dẫn khoa học.
-   **Tác giả**: Phạm, Văn Cao.
-   **Giảng viên hướng dẫn**: Nguyễn, Trần Thiện Khánh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7385 C108 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000177
-   **Điện tử**: 1

### Bản ghi 37 (hàng Excel 45)

-   **STT**: 37
-   **Nhan đề**: Đánh giá trữ lượng carbon tích lũy trong sinh khối rừng
    phòng hộ ở huyện Tịnh Biên, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Tài nguyên và Môi trường / Trần Văn Kim Danh ; Ts.
    Phan Trường Khanh hướng dẫn khoa học.
-   **Tác giả**: Trần, Văn Kim Danh.
-   **Giảng viên hướng dẫn**: Phan, Trường Khanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 634.92 D107 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000203
-   **Điện tử**: 1

### Bản ghi 38 (hàng Excel 46)

-   **STT**: 38
-   **Nhan đề**: Nghiên cứu hiện trạng và đề xuất các giải pháp quản lý
    rừng phòng hộ bền vững tại Núi Cấm, huyện Tịnh Biên, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường /
    Nguyễn Thị Tuyết Hoa ; Ts. Lê Diễm Kiều, NCS.Ths Trần Thị Hồng Ngọc
    hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Tuyết Hoa.
-   **Giảng viên hướng dẫn**: Lê, Diễm Kiều,;"Trần Thị Hồng Ngọc,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 634.92 H401 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000204
-   **Điện tử**: 1

### Bản ghi 39 (hàng Excel 47)

-   **STT**: 39
-   **Nhan đề**: Đánh giá điều kiện khai thác và chất lượng đất than bùn
    trên địa bàn tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý Tài nguyên và Môi trường / Văng Thị Mai Hương ; Ts. Phan Trường
    Khanh hướng dẫn khoa học.
-   **Tác giả**: Văng, Thị Mai Hương.
-   **Giảng viên hướng dẫn**: Phan, Trường Khanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.739 H561 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000205
-   **Điện tử**: 1

### Bản ghi 40 (hàng Excel 48)

-   **STT**: 40
-   **Nhan đề**: Ước tính phát thải khí nhà kính từ khai thác và sử dụng
    đất than bùn ở huyện Tri Tôn, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Đinh Đăng Khoa ;
    TS. Phan Trường Khanh hướng dẫn khoa học.
-   **Tác giả**: Đinh, Đăng Khoa.
-   **Giảng viên hướng dẫn**: Phan, Trường Khan,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.73874 Kh401 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000206
-   **Điện tử**: 1

### Bản ghi 41 (hàng Excel 49)

-   **STT**: 41
-   **Nhan đề**: Đánh giá hiệu quả kinh tế và môi trường của mô hình lúa
    mùa chịu ngập sâu trong vụ Thu Đông tại tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Nguyễn Chí
    Linh ; TS. Nguyễn Thanh Hùng, TS. Đặng Thị Thanh Quỳnh hướng dẫn
    khoa học.
-   **Tác giả**: Nguyễn, Chí Linh.
-   **Giảng viên hướng dẫn**: Nguyễn, Thanh Hùng,;"Đặng, Thị Thanh
    Quỳnh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 338.45 L312 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000207
-   **Điện tử**: 1

### Bản ghi 42 (hàng Excel 50)

-   **STT**: 42
-   **Nhan đề**: Mô phỏng diễn biến chất lượng nước trong hệ thống tôm
    -- rừng kết hợp tại huyện An Minh, tỉnh Kiên Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Hà Hồng Lĩnh
    ; TS. Nguyễn Trần Nhẫn Tánh hướng dẫn khoa học.
-   **Tác giả**: Hà, Hồng Lĩnh.
-   **Giảng viên hướng dẫn**: Nguyễn, Trần Nhẫn Tánh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7394 L312 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000208
-   **Điện tử**: 1

### Bản ghi 43 (hàng Excel 51)

-   **STT**: 43
-   **Nhan đề**: Mô phỏng luân chuyển carbon trong mô hình tôm -- đước
    kết hợp tại tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý Tài nguyên và Môi trường / Nguyễn Hữu Linh ; TS. Nguyễn Trần Nhẫn
    Tánh hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Hữu Linh.
-   **Giảng viên hướng dẫn**: Nguyễn, Trần Nhẫn Tánh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7394 L312 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000209
-   **Điện tử**: 1

### Bản ghi 44 (hàng Excel 52)

-   **STT**: 44
-   **Nhan đề**: Tính toán lượng khí nhà kính từ hoạt động sản xuất lúa
    gạo ở các vùng sinh thái đặc trưng của tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường / Nguyễn Thị
    Tuyết Nhung ; TS. Bùi Thị Mai Phụng hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Tuyết Nhung.
-   **Giảng viên hướng dẫn**: Bùi, Thị Mai Phụng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.73874 Nh513 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000210
-   **Điện tử**: 1

### Bản ghi 45 (hàng Excel 53)

-   **STT**: 45
-   **Nhan đề**: Đánh giá chất lượng môi trường đất và đa dạng sinh học
    trong mô hình lúa mùa chịu ngập sâu vụ Thu Đông ở tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài nguyên và Môi trường /
    Phạm Hồng Phúc ; TS. Nguyễn Thanh Hùng hướng dẫn khoa học.
-   **Tác giả**: Phạm, Hồng Phúc.
-   **Giảng viên hướng dẫn**: Nguyễn, Thanh Hùng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 363.7396 Ph506 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000211
-   **Điện tử**: 1

### Bản ghi 46 (hàng Excel 54)

-   **STT**: 46
-   **Nhan đề**: Đánh giá sự hiện diện của thực vật thủy sinh
    (Macrophytes) trong khu vực nuôi trồng thủy sản tại huyện Phú Tân,
    tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài nguyên
    và Môi trường / Hồ Phương Thảo ; TS. Nguyễn Trần Thiện Khánh hướng
    dẫn khoa học.
-   **Tác giả**: Hồ, Phương Thảo.
-   **Giảng viên hướng dẫn**: Nguyễn, Trần Thiện Khánh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Tài
    nguyên và Môi trường /
-   **Phân loại**: 577.6 Th108 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000212
-   **Điện tử**: 1

### Bản ghi 47 (hàng Excel 55)

-   **STT**: 47
-   **Nhan đề**: Đánh giá khả năng phòng trừ nấm Colletotrichum sp. gây
    bệnh thán thư trên xoài của chế phẩm Bacte Cinsan : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Huỳnh Đắc Huy ; TS. Nguyễn
    Thị Phong Lan, TS. Nguyễn Hữu Thanh hướng dẫn khoa học.
-   **Tác giả**: Huỳnh, Đắc Huy.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Phong Lan,;"Nguyễn, Hữu
    Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.44 H523 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000220
-   **Điện tử**: 1

### Bản ghi 48 (hàng Excel 56)

-   **STT**: 48
-   **Nhan đề**: Tuyển chọn xạ khuẩn đối kháng nấm Phytophthora gây bệnh
    nứt thân, xì mủ trên mít siêu sớm ở điều kiện In vitro và nhà lưới :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Phan Quý Quá
    ; TS. Nguyễn Phú Dũng, PGS.TS. Lê Minh Tường hướng dẫn khoa học.
-   **Tác giả**: Phan, Quý Quá.
-   **Giảng viên hướng dẫn**: Nguyễn, Phú Dũng,;"Lê, Minh Tường,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.2 Qu100 2023
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000221
-   **Điện tử**: 1

### Bản ghi 49 (hàng Excel 57)

-   **STT**: 49
-   **Nhan đề**: Tuyển chọn chủng xạ khuẩn đối kháng bệnh loét thân xì
    mủ do vi khuẩn gây hại mít siêu sớm ở An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Phạm Thị Bé Thi ; PGS.TS. Lê Minh
    Tường hướng dẫn khoa học.
-   **Tác giả**: Phạm, Thị Bé Thi.
-   **Giảng viên hướng dẫn**: Lê, Minh Tường,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.2 Th300 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000222
-   **Điện tử**: 1

### Bản ghi 50 (hàng Excel 58)

-   **STT**: 50
-   **Nhan đề**: Khảo sát cơ chế sinh lý đáp ứng mặn giai đoạn mạ của bộ
    lúa Nar-Salmerit trong điều kiện nhà lưới : Luận văn tốt nghiệp Thạc
    sĩ ngành Khoa học cây trồng / Trần Thị Thùy Tiên ; TS. Bùi Thị Dương
    Khuyều hướng dẫn khoa học.
-   **Tác giả**: Trần, Thị Thùy Tiên.
-   **Giảng viên hướng dẫn**: Bùi, Thị Dương Khuyều,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 T305 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000223
-   **Điện tử**: 1

### Bản ghi 51 (hàng Excel 59)

-   **STT**: 51
-   **Nhan đề**: Ảnh hưởng của các mức carbohydrate không xơ (NFC) đối
    với xơ trung tính (NDF) đến khả năng sinh khí metan và tỷ lệ tiêu
    hóa của dê thịt : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
    Nguyễn Ngọc Bích ; TS. Nguyễn Phi Bằng, TS Nguyễn Bình Trường hướng
    dẫn khoa học.
-   **Tác giả**: Nguyễn, Ngọc Bích.
-   **Giảng viên hướng dẫn**: Nguyễn, Phi Bằng,;"Nguyễn, Bình Trường,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.3 B302 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000224
-   **Điện tử**: 1

### Bản ghi 52 (hàng Excel 60)

-   **STT**: 52
-   **Nhan đề**: Ảnh hưởng của các mức bổ sung cỏ Linh lăng (Medicago
    sativa L.) lên năng suất sinh trưởng và hàm lượng béo thô trong thịt
    của vịt Grimaud : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
    Nguyễn Tường Vy ; TS. Lê Thị Thúy Hằng hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Tường Vy.
-   **Giảng viên hướng dẫn**: Lê, Thị Thúy Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.6 V600 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000225
-   **Điện tử**: 1

### Bản ghi 53 (hàng Excel 61)

-   **STT**: 53
-   **Nhan đề**: Ảnh hưởng propiconazole, hexaconazole phòng trừ bệnh
    lem lép hạt lúa và dư lượng trong gạo Nàng hoa 9 Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Nguyễn Tấn Đạt ; TS. Bùi Thị
    Dương Khuyều hướng dẫn.
-   **Tác giả**: Nguyễn, Tấn Đạt
-   **Giảng viên hướng dẫn**: Bùi, Thị Dương Khuyều
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Đ110 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000226
-   **Điện tử**: 1

### Bản ghi 54 (hàng Excel 62)

-   **STT**: 54
-   **Nhan đề**: Hiện trạng canh tác và ảnh hưởng của Rhodopseudomonas
    palustris đến năng suất, chất lượng của dưa lê trong điều kiện nhà
    lưới Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần
    Phước Lộc ; Ts. Phạm Huỳnh Thanh Vân hướng dẫn.
-   **Tác giả**: Trần, Phước Lộc.
-   **Giảng viên hướng dẫn**: Phạm, Huỳnh Thanh Vân
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.6389 L451 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000227
-   **Điện tử**: 1

### Bản ghi 55 (hàng Excel 63)

-   **STT**: 55
-   **Nhan đề**: Ảnh hưởng của lưới che nắng và phân bón lá đến màu sắc
    và độ bền của hoa huệ hồng Polianthes tuberosa Pink sapphie" Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần Thanh Phong ;
    Ts. Nguyễn Thị Mỹ Duyên hướng dẫn."
-   **Tác giả**: Trần, Thanh Phong.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Mỹ Duyên
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.98 Ph431 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000229
-   **Điện tử**: 1

### Bản ghi 56 (hàng Excel 64)

-   **STT**: 56
-   **Nhan đề**: Ảnh hưởng của vi khuẩn Klebsilla quasipneumoniae, lượng
    phân đạm, lân lên sinh trưởng và năng suất bắp sinh khối Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Thị Kim Phượng
    ; PGs.Ts. Nguyễn Văn Chương hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Kim Phượng.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1589 Ph561 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000230
-   **Điện tử**: 1

### Bản ghi 57 (hàng Excel 65)

-   **STT**: 57
-   **Nhan đề**: Ảnh hưởng phân hữu cơ đệm lót sinh học đến sinh trưởng,
    năng suất và chất lượng lúa OM18 Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Nguyễn Ngọc Tài ; TS. Bùi Thị Dương Khuyều
    hướng dẫn.
-   **Tác giả**: Nguyễn, Ngọc Tài.
-   **Giảng viên hướng dẫn**: Bùi, Thị Dương Khuyều
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 T103 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000231
-   **Điện tử**: 1

### Bản ghi 58 (hàng Excel 66)

-   **STT**: 58
-   **Nhan đề**: Quản lý hoạt động bồi dưỡng giáo viên các trường trung
    học cơ sở ở thành phố Châu Đốc, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Ngọc Anh ; TS. Nguyễn Bách
    Thắng hướng dẫn.
-   **Tác giả**: Nguyễn, Ngọc Anh.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.112 A107 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000234
-   **Điện tử**: 1

### Bản ghi 59 (hàng Excel 67)

-   **STT**: 59
-   **Nhan đề**: Phát triển đội ngũ giáo viên dạy môn Khoa học tự nhiên
    các trường trung học cơ sở thị xã Tịnh Biên, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Võ Hùng Sơn ; TS.
    Huỳnh Thanh Tiến hướng dẫn.
-   **Tác giả**: Võ, Hùng Sơn.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 371.12 S464 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000235
-   **Điện tử**: 1

### Bản ghi 60 (hàng Excel 68)

-   **STT**: 60
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường mầm non ở thành
    phố Rạch Giá, tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Trương Như Phượng ; PGS.TS. Trần Văn Đạt hướng
    dẫn.
-   **Tác giả**: Trương, Như Phượng.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.218 Ph561 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000236
-   **Điện tử**: 1

### Bản ghi 61 (hàng Excel 69)

-   **STT**: 61
-   **Nhan đề**: Phát triển đội ngũ giáo viên ở các trường tiểu học
    thành phố Rạch Giá, tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Phạm Nhựt ; TS. Nguyễn Thị Hảo hướng dẫn.
-   **Tác giả**: Phạm, Nhựt.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hảo,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.11 Nh565 2025
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000237
-   **Điện tử**: 1

### Bản ghi 62 (hàng Excel 70)

-   **STT**: 62
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường tiểu học ở
    thành phố Châu Đốc, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Trần Huy Hà ; TS. Nguyễn Bách Thắng hướng
    dẫn.
-   **Tác giả**: Trần, Huy Hà.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 H100 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000238
-   **Điện tử**: 1

### Bản ghi 63 (hàng Excel 71)

-   **STT**: 63
-   **Nhan đề**: Quản lý chuyển đổi số ở các trường trung học phổ thông
    huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Võ Việt Dũng ; TS. Võ Văn Dễ hướng dẫn.
-   **Tác giả**: Võ, Việt Dũng.
-   **Giảng viên hướng dẫn**: Võ, Văn Dễ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 370.285 D513 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000239
-   **Điện tử**: 1

### Bản ghi 64 (hàng Excel 72)

-   **STT**: 64
-   **Nhan đề**: Quản lý hoạt động phát triển kỹ năng lãnh đạo chuyển
    đổi cho cán bộ quản lý ở các trường trung học phổ thông tỉnh An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn
    Duy Tân ; PGS.TS. Trần Văn Đạt hướng dẫn.
-   **Tác giả**: Nguyễn, Duy Tân.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 T121 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000240
-   **Điện tử**: 1

### Bản ghi 65 (hàng Excel 73)

-   **STT**: 65
-   **Nhan đề**: Quản lý hoạt động dạy học ở trường Trung học cơ sở
    huyện Châu Thành, tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Huỳnh Hồng Nam ; TS. Nguyễn Thị Hảo hướng
    dẫn.
-   **Tác giả**: Huỳnh, Hồng Nam.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hảo,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.23 N104 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000241
-   **Điện tử**: 1

### Bản ghi 66 (hàng Excel 74)

-   **STT**: 66
-   **Nhan đề**: Quản lý hoạt động dạy học môn Tiếng Anh theo tiếp cận
    năng lực ở các trường trung học phổ thông thị xã Tịnh Biên, tỉnh An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Đặng
    Ngọc Hiếu ; TS. Nguyễn Bách Thắng, TS. Nguyễn Tiến Ngọ hướng dẫn.
-   **Tác giả**: Đặng, Ngọc Hiếu.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,;"Nguyễn, Tiến Ngọ,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 H309 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000242
-   **Điện tử**: 1

### Bản ghi 67 (hàng Excel 75)

-   **STT**: 67
-   **Nhan đề**: Quản lý ứng dụng công nghệ thông tin trong dạy học ở
    các trường trung học cơ sở huyện Châu Thành, tỉnh Kiên Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Vũ Văn Chinh ; TS.
    Trần Thanh Hương hướng dẫn.
-   **Tác giả**: Vũ, Văn Chinh.
-   **Giảng viên hướng dẫn**: Trần, Thanh Hương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 371.33 Ch312 2025
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000243
-   **Điện tử**: 1

### Bản ghi 68 (hàng Excel 76)

-   **STT**: 68
-   **Nhan đề**: Quản lý hoạt động dạy học ở các trường trung học phổ
    thông thành phố Châu Đốc, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Giáo dục / Trương Trung Can ; TS. Nguyễn Bách Thắng
    hướng dẫn.
-   **Tác giả**: Trương, Trung Can.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 C105 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000244
-   **Điện tử**: 1

### Bản ghi 69 (hàng Excel 77)

-   **STT**: 69
-   **Nhan đề**: Quản lý hoạt động dạy học ở các trường trung học phổ
    thông huyện An Phú, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Nguyễn Văn Sang ; PGS.TS Trần Văn Đạt hướng
    dẫn.
-   **Tác giả**: Nguyễn, Văn Sang.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 S106 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000245
-   **Điện tử**: 1

### Bản ghi 70 (hàng Excel 78)

-   **STT**: 70
-   **Nhan đề**: Phát triển đội ngũ giáo viên dạy môn Nghệ thuật theo
    chương trình giáo dục phổ thông 2018 ở các trường tiểu học thị xã
    Tân Châu, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Giáo dục / Phan Hữu Nghĩa ; TS. Huỳnh Thanh Tiến hướng dẫn.
-   **Tác giả**: Phan, Hữu Nghĩa.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.11 Ngh301 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000246
-   **Điện tử**: 1

### Bản ghi 71 (hàng Excel 79)

-   **STT**: 71
-   **Nhan đề**: Quản lí hoạt động giáo dục kĩ năng sống cho học sinh
    các trường trung học cơ sở thị xã Tịnh Biên, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Thành Luân ;
    TS. Trần Minh Nhựt hướng dẫn.
-   **Tác giả**: Nguyễn, Thành Luân.
-   **Giảng viên hướng dẫn**: Trần, Minh Nhựt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.18 L502 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000247
-   **Điện tử**: 1

### Bản ghi 72 (hàng Excel 80)

-   **STT**: 72
-   **Nhan đề**: Phát triển đội ngũ giáo viên giảng dạy môn khoa học tự
    nhiên ở các trường trung học cơ sở trên địa bàn huyện Châu Thành,
    tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    / Lê Văn Kiên ; TS. Trần Thanh Hương hướng dẫn.
-   **Tác giả**: Lê, Văn Kiên.
-   **Giảng viên hướng dẫn**: Trần, Thanh Hương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.11 K305 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000248
-   **Điện tử**: 1

### Bản ghi 73 (hàng Excel 81)

-   **STT**: 73
-   **Nhan đề**: Quản lý hoạt động sinh hoạt tổ chuyên môn theo hướng
    nghiên cứu bài học ở trường tiểu học trên địa bàn thị xã Tân Châu,
    tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục /
    Kiều Thanh Huy ; TS. Trần Minh Nhựt hướng dẫn.
-   **Tác giả**: Kiều, Thanh Huy.
-   **Giảng viên hướng dẫn**: Trần, Minh Nhựt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 H523 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000249
-   **Điện tử**: 1

### Bản ghi 74 (hàng Excel 82)

-   **STT**: 74
-   **Nhan đề**: Quản lí hoạt động tổ chuyên môn các trường Tiểu học ở
    thị xã Tân Châu, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Nguyễn Xuân Hương ; PGS.TS. Trần Văn Đạt hướng
    dẫn.
-   **Tác giả**: Nguyễn, Xuân Hương.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 H561 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000250
-   **Điện tử**: 1

### Bản ghi 75 (hàng Excel 83)

-   **STT**: 75
-   **Nhan đề**: Quản lý hoạt động hoạt động dạy học môn Toán theo tiếp
    cận phát triển năng lực học sinh ở các trường trung học cơ sở huyện
    Châu Thành, tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý Giáo dục / Đoàn Thanh Hưng ; TS. Võ Văn Dễ hướng dẫn.
-   **Tác giả**: Đoàn, Thanh Hưng.
-   **Giảng viên hướng dẫn**: Võ, Văn Dễ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.11 H556 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000251
-   **Điện tử**: 1

### Bản ghi 76 (hàng Excel 84)

-   **STT**: 76
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh ở
    trường trung học cơ sở thành phố Long Xuyên, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Trần Quốc Tuấn ; TS.
    Nguyễn Thị Hảo hướng dẫn.
-   **Tác giả**: Trần, Quốc Tuấn.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hảo,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1 T502 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000252
-   **Điện tử**: 1

### Bản ghi 77 (hàng Excel 85)

-   **STT**: 77
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường trung học phổ thông ở thành phố Châu Đốc, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Đỗ Minh Trang ;
    TS. Nguyễn Bách Thắng hướng dẫn.
-   **Tác giả**: Đỗ, Minh Trang.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.0114 Tr106 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000253
-   **Điện tử**: 1

### Bản ghi 78 (hàng Excel 86)

-   **STT**: 78
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống cho trẻ mẫu
    giáo ở các trường mầm non huyện Tri Tôn, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Ngô Thị Hồng Nhung ; TS.
    Trần Minh Nhựt hướng dẫn.
-   **Tác giả**: Ngô, Thị Hồng Nhung.
-   **Giảng viên hướng dẫn**: Trần, Minh Nhựt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.21 Nh513 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000254
-   **Điện tử**: 1

### Bản ghi 79 (hàng Excel 87)

-   **STT**: 79
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng xã hội cho trẻ mầm
    non thành phố Rạch Giá, tỉnh Kiên Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Giáo dục / Nguyễn Thị Ngọc ; PGS.TS. Trần Văn Đạt
    hướng dẫn.
-   **Tác giả**: Nguyễn, Thị Ngọc.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.21 Ng419 2024
-   **Năm xuất bản**: 2024.
-   **Số đăng ký cá biệt**: 180302000255
-   **Điện tử**: 1

### Bản ghi 80 (hàng Excel 88)

-   **STT**: 80
-   **Nhan đề**: Ảnh hưởng của việc bổ sung tỏi tươi và Bacillus
    subtilis lên khả năng sinh trưởng, năng suất và chất lượng thịt của
    gà Nòi Minh Dư : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Bùi
    Quang Tuấn ; TS. Nguyễn Thị Thu Hồng hướng dẫn khoa học.
-   **Tác giả**: Bùi, Quang Tuấn.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Hồng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5 T502 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000153
-   **Điện tử**: 0

### Bản ghi 81 (hàng Excel 89)

-   **STT**: 81
-   **Nhan đề**: Ảnh hưởng của bổ sung bột tấm lên men vào khẩu phần cỏ
    Lông tây lên khả năng ăn vào và ni tơ tích lũy của dê Bách Thảo giai
    đoạn sinh trưởng : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Lê
    Trần Minh Hiếu ; TS. Nguyễn Thị Thu Hồng hướng dẫn khoa học.
-   **Tác giả**: Lê, Trần Minh Hiếu.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Hồng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.3 H309 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000154
-   **Điện tử**: 0

### Bản ghi 82 (hàng Excel 90)

-   **STT**: 82
-   **Nhan đề**: Ảnh hưởng của mật độ nuôi và mức độ đạm trong khẩu phần
    thức ăn hỗn hợp đến năng suất sinh trưởng và chất lượng thịt của dế
    ta (Gryllus bimaculatus De Geer, 1773) : Luận văn tốt nghiệp Thạc sĩ
    ngành Chăn nuôi / Nguyễn Thị Út Em ; TS. Bùi Phan Thu Hằng hướng dẫn
    khoa học.
-   **Tác giả**: Nguyễn, Thị Út Em.
-   **Giảng viên hướng dẫn**: Bùi, Phan Thu Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 638.57 E202 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000155
-   **Điện tử**: 0

### Bản ghi 83 (hàng Excel 91)

-   **STT**: 83
-   **Nhan đề**: Sinh khối và năng suất sinh sản của hai loài dế Acheta
    domestica và Gryllus bimaculatus nuôi ở nông trại : Luận văn tốt
    nghiệp Thạc sĩ ngành Chăn nuôi / Dương Trung Chiến ; PGS.TS. Võ Lâm
    hướng dẫn khoa học.
-   **Tác giả**: Dương, Trung Chiến.
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 638.57 Ch305 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000156
-   **Điện tử**: 0

### Bản ghi 84 (hàng Excel 92)

-   **STT**: 84
-   **Nhan đề**: Xác định giá trị dinh dưỡng và tỷ lệ bổ sung bột lá
    Chùm ngây (Moringa oleifera L.) thích hợp vào khẩu phần cho gà Isa
    Brown : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Ngô Trí Dũng ;
    TS. Nguyễn Tuyết Giang hướng dẫn khoa học.
-   **Tác giả**: Ngô, Trí Dũng.
-   **Giảng viên hướng dẫn**: Nguyễn, Tuyết Giang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5 D513 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000157
-   **Điện tử**: 0

### Bản ghi 85 (hàng Excel 93)

-   **STT**: 85
-   **Nhan đề**: Ảnh hưởng của các mức thay thế đạm bột cá bằng đạm bột
    dế nhà (Acheta domestica L.) trong khẩu phần đến tỷ lệ tiêu hóa và
    sinh trưởng của thỏ thịt : Luận văn tốt nghiệp Thạc sĩ ngành Chăn
    nuôi / Lê Rô Pin ; PGS.TS. Võ Lâm hướng dẫn khoa học.
-   **Tác giả**: Lê, Rô Pin.
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.9322 P311 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000158
-   **Điện tử**: 1

### Bản ghi 86 (hàng Excel 94)

-   **STT**: 86
-   **Nhan đề**: Thay thế đạm bột đậu nànhbằng đạm bột ngọn lá khoai mì
    (Manihot esculenta Crantz, 1976) trong khẩu phần của thỏ thịt : Luận
    văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Nguyễn Văn Cường ; PGS.TS.
    Võ Lâm hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Văn Cường.
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.9322 C561 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000159
-   **Điện tử**: 1

### Bản ghi 87 (hàng Excel 95)

-   **STT**: 87
-   **Nhan đề**: Tình hình chăn nuôi bò và nghiên cứu ảnh hưởng của
    nhiệt độ, ẩm độ môi trường nuôi đến năng suất sinh trưởng, các chỉ
    tiêu sinh lý của 2 nhóm bò lai Charolais/Red Brahman với bò lai
    Sindhi tại tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Chăn
    nuôi / Tô Dương Thanh Tuyền ; TS. Nguyễn Bá Trung hướng dẫn khoa
    học.
-   **Tác giả**: Tô, Dương Thanh Tuyền.
-   **Giảng viên hướng dẫn**: Nguyễn, Bá Trung,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.2 T527 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000160
-   **Điện tử**: 1

### Bản ghi 88 (hàng Excel 96)

-   **STT**: 88
-   **Nhan đề**: Ảnh hưởng các mức bổ sung bột Đinh lăng (Polyscias
    filicifolia L.) đến khả năng sinh trưởng và chất lượng thịt của gà
    lông màu : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Nguyễn
    Huỳnh Kháng ; TS. Nguyễn Bá Trung hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Huỳnh Kháng.
-   **Giảng viên hướng dẫn**: Nguyễn, Bá Trung,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5 Kh106 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000161
-   **Điện tử**: 1

### Bản ghi 89 (hàng Excel 97)

-   **STT**: 89
-   **Nhan đề**: Nghiên cứu đa dạng di truyền vùng D-Loop ty thể và các
    gen DGAT1, NCAPG và RNF212 ở bò Vàng, bò lai Ongole : Luận văn tốt
    nghiệp Thạc sĩ ngành Chăn nuôi / Võ Thanh Sang ; TS. Nguyễn Bá Trung
    hướng dẫn khoa học.
-   **Tác giả**: Võ, Thanh Sang.
-   **Giảng viên hướng dẫn**: Nguyễn, Bá Trung,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.2 S106 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000162
-   **Điện tử**: 1

### Bản ghi 90 (hàng Excel 98)

-   **STT**: 90
-   **Nhan đề**: Điều tra việc sử dụng và thành phần hóa học của một số
    loại thức ăn dùng cho gia súc nhai lại tại An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Chăn nuôi / Trương Thanh Phong ; TS. Bùi Phan
    Thu Hằng hướng dẫn khoa học.
-   **Tác giả**: Trương, Thanh Phong.
-   **Giảng viên hướng dẫn**: Bùi, Phan Thu Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.2 Ph431 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000163
-   **Điện tử**: 1

### Bản ghi 91 (hàng Excel 99)

-   **STT**: 91
-   **Nhan đề**: Ảnh hưởng vôi, phân trùn quế, Rhizobium sp. lên năng
    suất và sự tích lũy asen trên cây đậu nành rau \[Glycine max (L)
    Merr.\] : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Trần Văn Cường ; PGS.TS. Nguyễn Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Trần, Văn Cường.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.34 C561 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000164
-   **Điện tử**: 1

### Bản ghi 92 (hàng Excel 100)

-   **STT**: 92
-   **Nhan đề**: Cải thiện chất lượng đất và năng suất cây đậu trắng
    (Phaseolus vulgaris L.) trên vùng đất nhiễm Asen, Cadimi bằng biện
    pháp bón kết hợp vôi, phân bò và Rhizobium sp. : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Huỳnh Tấn Hưng ; PGS.TS. Nguyễn
    Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Huỳnh, Tấn Hưng.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.33 H556 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000165
-   **Điện tử**: 1

### Bản ghi 93 (hàng Excel 101)

-   **STT**: 93
-   **Nhan đề**: Ảnh hưởng màng phủ nông nghiệp, vôi, phân trùn quế và
    vi khuẩn Rhizobium sp. lên sự tích lũy asen, chất lượng và năng suất
    cây đậu phộng : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng
    / Hồ Thanh Tuấn ; PGS.TS. Nguyễn Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Hồ, Thanh Tuấn.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.368 T502 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000166
-   **Điện tử**: 1

### Bản ghi 94 (hàng Excel 102)

-   **STT**: 94
-   **Nhan đề**: Tuyển chọn vi khuẩn quang dưỡng không lưu huỳnh màu tía
    từ đất lúa nhiễm mặn có khả năng cố định đạm, hòa tan lân, tiết IAA,
    ALA và phân giải độc chất : Luận văn tốt nghiệp Thạc sĩ ngành Khoa
    học cây trồng / Mai Chí Bảo ; TS. Lý Ngọc Thanh Xuân hướng dẫn khoa
    học.
-   **Tác giả**: Mai, Chí Bảo.
-   **Giảng viên hướng dẫn**: Lý, Ngọc Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 660.6 B108 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000167
-   **Điện tử**: 1

### Bản ghi 95 (hàng Excel 103)

-   **STT**: 95
-   **Nhan đề**: Khảo sát di truyền tính trạng mùi thơm và nông học trên
    quần thể F2 của tổ hợp lai OM1490 với giống lúa thơm : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Thị Quỳnh Như ; TS.
    Bùi Thị Dương Khuyều hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Quỳnh Như.
-   **Giảng viên hướng dẫn**: Bùi, Thị Dương Khuyều,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 Nh550 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000168
-   **Điện tử**: 1

### Bản ghi 96 (hàng Excel 104)

-   **STT**: 96
-   **Nhan đề**: Ảnh hưởng vôi, phân gà và Rhizobium sp. lên năng suất
    và sự tích lũy asen trên cây đậu xanh (Vigna radiata L.) : Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Ngọc Tuấn ; PGS.TS.
    Nguyễn Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Lê, Ngọc Tuấn.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.37 T502 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000169
-   **Điện tử**: 1

### Bản ghi 97 (hàng Excel 105)

-   **STT**: 97
-   **Nhan đề**: Ảnh hưởng liều lượng vôi đến sự hấp thu Asen, năng suất
    bắp, đậu nành trong vụ Đông Xuân và Hè Thu năm 2022-2023 : Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Mộng Trai ; PGS.TS.
    Nguyễn Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Lê, Mộng Trai.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.34 Tr103 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000170
-   **Điện tử**: 1

### Bản ghi 98 (hàng Excel 106)

-   **STT**: 98
-   **Nhan đề**: So sánh hai phương pháp chế biến ngọn lá khoai mì và
    ảnh hưởng việc thay thế đạm khẩu phần bằng đạm ngọn lá khoai mì
    (Manihot esculenta Crantz, 1976) đến sinh trưởng và chất lượng thịt
    của dế ta (Gryllus bimaculatus De Geer, 1773) : Luận văn tốt nghiệp
    Thạc sĩ ngành Chăn nuôi / Nguyễn Thị Bích Hạnh ; TS. Bùi Phan Thu
    Hằng hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Bích Hạnh.
-   **Giảng viên hướng dẫn**: Bùi, Phan Thu Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 638.57 H107 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000171
-   **Điện tử**: 1

### Bản ghi 99 (hàng Excel 107)

-   **STT**: 99
-   **Nhan đề**: Ảnh hưởng của bột thảo dược lên khả năng tăng trưởng,
    năng suất và chất lượng thịt của gà Nòi : Luận văn tốt nghiệp Thạc
    sĩ ngành Chăn nuôi / Phạm Văn Thao ; TS. Nguyễn Tuyết Giang hướng
    dẫn khoa học.
-   **Tác giả**: Phạm, Văn Thao.
-   **Giảng viên hướng dẫn**: Nguyễn, Tuyết Giang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5 Th108 2022
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000172
-   **Điện tử**: 1

### Bản ghi 100 (hàng Excel 108)

-   **STT**: 100
-   **Nhan đề**: Ảnh hưởng của các dòng vi khuẩn Bacillus aryabhattai,
    Bacillus megaterium và Enterobacter asburiae lên sự phát triển và
    năng suất của cây bắp non : Luận văn tốt nghiệp Thạc sĩ ngành Khoa
    học cây trồng / Nguyễn Thị Ngọc Nhàn; TS. Đoàn Thị Minh Nguyệt,
    PGS.TS. Nguyễn Văn Chương hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Ngọc Nhàn.
-   **Giảng viên hướng dẫn**: Đoàn, Thị Minh Nguyệt,;"Nguyễn, Văn
    Chương,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.15 Nh105 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000178
-   **Điện tử**: 1

### Bản ghi 101 (hàng Excel 109)

-   **STT**: 101
-   **Nhan đề**: Ảnh hưởng của phân đạm, phân hữu cơ kết hợp chủng vi
    khuẩn Priestia aryabhattai lên sự phát triển và năng suất cây bắp
    non (Zea mays L.) : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Lê Tuấn; TS. Đoàn Thị Minh Nguyệt, PGS.TS. Nguyễn Văn Chương
    hướng dẫn khoa học.
-   **Tác giả**: Lê, Tuấn.
-   **Giảng viên hướng dẫn**: Đoàn, Thị Minh Nguyệt,;"Nguyễn, Văn
    Chương,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1589 T502 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000179
-   **Điện tử**: 1

### Bản ghi 102 (hàng Excel 110)

-   **STT**: 102
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường trung học cơ sở huyện Châu Thành, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Thị Hồng Đào ;
    TS. Nguyễn Bách Thắng (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Thị Hồng Đào.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.0114 Đ108 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000190
-   **Điện tử**: 1

### Bản ghi 103 (hàng Excel 111)

-   **STT**: 103
-   **Nhan đề**: Quản lý hoạt động ứng dụng công nghệ thông tin vào dạy
    học ở các trường trung học phổ thông huyện Phú Tân, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Đỗ Lê Quốc Lập
    ; PGS.TS. Phạm Phương Tâm (hướng dẫn khoa học).
-   **Tác giả**: Đỗ, Lê Quốc Lập.
-   **Giảng viên hướng dẫn**: Phạm, Phương Tâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.0285 L123 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000191
-   **Điện tử**: 1

### Bản ghi 104 (hàng Excel 112)

-   **STT**: 104
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường mầm non huyện
    Tri Tôn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Giáo dục / Lưu Thị Kim Loan ; TS. Nguyễn Bách Thắng (hướng dẫn khoa
    học)
-   **Tác giả**: Lưu, Thị Kim Loan.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.218 L406 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000192
-   **Điện tử**: 1

### Bản ghi 105 (hàng Excel 113)

-   **STT**: 105
-   **Nhan đề**: Quản lý hoạt động công tác xã hội hóa giáo dục ở các
    trường tiểu học thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Thị Kim Ngân ; TS. Lê
    Hùng Cường hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Kim Ngân.
-   **Giảng viên hướng dẫn**: Lê, Hùng Cường,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1 Ng121 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000193
-   **Điện tử**: 1

### Bản ghi 106 (hàng Excel 114)

-   **STT**: 106
-   **Nhan đề**: Quản lý hoạt động giáo dục địa phương cho học sinh các
    trường trung học cơ sở ở thành phố Châu Đốc, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Cao Trúc Phương ;
    PGS.TS. Nguyễn Văn Đệ hướng dẫn khoa học.
-   **Tác giả**: Cao, Trúc Phương.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.01 Ph561 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000194
-   **Điện tử**: 1

### Bản ghi 107 (hàng Excel 115)

-   **STT**: 107
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    phổ thông huyện Châu Phú, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Giáo dục / Lại Thị Mộng Quyên ; TS. Hồ Văn Thống
    (hướng dẫn khoa học).
-   **Tác giả**: Lại, Thị Mộng Quyên.
-   **Giảng viên hướng dẫn**: Hồ, Văn Thống,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.21 Qu603 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000195
-   **Điện tử**: 1

### Bản ghi 108 (hàng Excel 116)

-   **STT**: 108
-   **Nhan đề**: Quản lý thiết bị dạy học các trường trung học cơ sở ở
    huyện Chợ Mới, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Phan Thanh Sơn ; TS. Nguyễn Bách Thắng (hướng dẫn
    khoa học).
-   **Tác giả**: Phan, Thanh Sơn.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 371.6 S464 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000196
-   **Điện tử**: 1

### Bản ghi 109 (hàng Excel 117)

-   **STT**: 109
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    cơ sở thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Giáo dục / Minh Bảo Trân ; PGS.TS. Trần Văn Đạt
    (hướng dẫn khoa học).
-   **Tác giả**: Minh, Bảo Trân.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.21 Tr121 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000197
-   **Điện tử**: 1

### Bản ghi 110 (hàng Excel 118)

-   **STT**: 110
-   **Nhan đề**: Quản lý hoạt động tổ chuyên môn ở các trường trung học
    cơ sở thị xã Tân Châu, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Lý Thị Mỹ Trinh ; TS. Mai Thị Yến Lan
    (hướng dẫn khoa học).
-   **Tác giả**: Lý, Thị Mỹ Trinh.
-   **Giảng viên hướng dẫn**: Mai, Thị Yến Lan,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.2 Tr312 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000198
-   **Điện tử**: 1

### Bản ghi 111 (hàng Excel 119)

-   **STT**: 111
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường mầm non
    huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Nguyễn Thị Thắm ; TS. Huỳnh Thanh Tiến (hướng dẫn
    khoa học).
-   **Tác giả**: Nguyễn, Thị Thắm.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 Th114 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000199
-   **Điện tử**: 1

### Bản ghi 112 (hàng Excel 120)

-   **STT**: 112
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường mầm non huyện
    Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Giáo dục / Tạ Thị Thanh Vân ; TS. Huỳnh Thanh Tiến (hướng dẫn khoa
    học).
-   **Tác giả**: Tạ, Thị Thanh Vân.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.218 V121 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000200
-   **Điện tử**: 1

### Bản ghi 113 (hàng Excel 121)

-   **STT**: 113
-   **Nhan đề**: Quản lý hoạt động dạy học tiếng Anh ở các trường trung
    học phổ thông huyện Tri Tôn, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý giáo dục / Đặng Phú Vinh ; TS. Nguyễn Tuấn
    Khanh hướng dẫn.
-   **Tác giả**: Đặng, Phú Vinh.
-   **Giảng viên hướng dẫn**: Nguyễn, Tuấn Khanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.19 V312 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000201
-   **Điện tử**: 1

### Bản ghi 114 (hàng Excel 122)

-   **STT**: 114
-   **Nhan đề**: Quản lý hoạt động giáo dục ngoài giờ lên lớp ở các
    trường tiểu học thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý giáo dục / Lưu Thị Ánh Xuân ; PGS.TS.
    Trần Văn Đạt hướng dẫn.
-   **Tác giả**: Lưu, Thị Ánh Xuân.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.11 X502 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000202
-   **Điện tử**: 1

### Bản ghi 115 (hàng Excel 123)

-   **STT**: 115
-   **Nhan đề**: Ảnh hưởng thời gian chiếu sáng bổ sung từ đèn Led và
    môi trường trồng đến năng suất, chất lượng cải xanh (Brassica juncea
    L.) trong điều kiện nhà lưới : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Vũ Thị Chung ; TS.Phạm Văn Quang hướng dẫn khoa
    học.
-   **Tác giả**: Vũ, Thị Chung.
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.4 Ch513 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000213
-   **Điện tử**: 1

### Bản ghi 116 (hàng Excel 124)

-   **STT**: 116
-   **Nhan đề**: Ảnh hưởng của phân bón và kích thước củ đến sinh trưởng
    giống hoa huệ hồng Polianthes tuberrosa "Pink Sapphire" trồng tại An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Nguyễn Thanh Điền ; TS. Nguyễn Thị Mỹ Duyên, PGS,TS. Nguyễn Thị
    Thanh Xuân hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thanh Điền.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Mỹ Duyên,;"Nguyễn Thị Thanh
    Xuân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.9 Đ305 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000214
-   **Điện tử**: 1

### Bản ghi 117 (hàng Excel 125)

-   **STT**: 117
-   **Nhan đề**: Tuyển chọn gốc ghép kháng bệnh héo rũ do nấm Fusarium
    sp. kết hợp chế phẩm vi sinh đến năng suất của dưa leo trong nhà
    lưới : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần
    Chí Nhân ; TS. Lý Ngọc Thanh Xuân hướng dẫn.
-   **Tác giả**: Trần, Chí Nhân.
-   **Giảng viên hướng dẫn**: Lý, Ngọc Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.63 Nh121 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000215
-   **Điện tử**: 1

### Bản ghi 118 (hàng Excel 126)

-   **STT**: 118
-   **Nhan đề**: Khảo sát năng suất và phẩm chất của các giống xoài
    trồng tại An Giang: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Ngọc Trâm ; TS. Nguyễn Thị Mỹ Duyên, TS. Nguyễn Thi
    Thanh Xuân hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Ngọc Trâm.
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Mỹ Duyên,;"Nguyễn, Thi Thanh
    Xuân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.44 Tr120 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000216
-   **Điện tử**: 1

### Bản ghi 119 (hàng Excel 127)

-   **STT**: 119
-   **Nhan đề**: Đánh giá khả năng cố định đạm và hòa tan lân của vi
    khuẩn không lưu huỳnh màu tía (PNSB) trong canh tác cây bạc hà chanh
    sả : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn
    Thị Xuân Thắm ; TS. Phạm Văn Quang hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Thị Xuân Thắm.
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.83 Th114 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000217
-   **Điện tử**: 1

### Bản ghi 120 (hàng Excel 128)

-   **STT**: 120
-   **Nhan đề**: Ảnh hưởng của nấm Trichoderma Spp. đến kiểm soát bệnh
    vàng lá, thối rễ cam sành tại huyện Vũng Liêm, tỉnh Vĩnh Long : Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Đoàn Minh Trí ;
    TS. Phạm Văn Quang hướng dẫn.
-   **Tác giả**: Đoàn, Minh Trí.
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.3 Tr300 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000218
-   **Điện tử**: 1

### Bản ghi 121 (hàng Excel 129)

-   **STT**: 121
-   **Nhan đề**: Ảnh hưởng thời gian chiếu sáng bổ sung từ đèn Led và
    môi trường đến năng suất, chất lượng xà lách (Latuca satival) trong
    điều kiện nhà lưới : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Đặng Văn Uyên ; TS. Dương Văn Nhã hướng dẫn khoa học.
-   **Tác giả**: Đặng, Văn Uyên.
-   **Giảng viên hướng dẫn**: Dương, Văn Nhã,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.5 U527 2023
-   **Năm xuất bản**: 2023.
-   **Số đăng ký cá biệt**: 180302000219
-   **Điện tử**: 1

### Bản ghi 122 (hàng Excel 130)

-   **STT**: 122
-   **Nhan đề**: Xác định liều lượng phân bón N, P và K thích hợp cho
    cây bưởi năm roi ở Châu Thành, Hậu Giang Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Đào Hoài Ân ; GS.TS. Ngô Ngọc Hưng (hướng
    dẫn khoa học).
-   **Tác giả**: Đào, Hoài Ân
-   **Giảng viên hướng dẫn**: Ngô, Ngọc Hưng
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.3289 Â121 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000116
-   **Điện tử**: 1

### Bản ghi 123 (hàng Excel 131)

-   **STT**: 123
-   **Nhan đề**: Ảnh hưởng của phân bón lá lên năng suất và chất lượng
    bưởi năm roi ở Châu Thành, Hậu Giang Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Nguyễn Minh Hoàng ; GS.TS. Ngô Ngọc Hưng
    (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Minh Hoàng
-   **Giảng viên hướng dẫn**: Ngô, Ngọc Hưng
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 334.3289 H407 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000117
-   **Điện tử**: 1

### Bản ghi 124 (hàng Excel 132)

-   **STT**: 124
-   **Nhan đề**: Đánh giá khả năng cố định đạm của vi khuẩn vùng rễ đến
    sinh trưởng, năng suất và hấp thu đạm của cây bắp (Zea mays L.) Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Huỳnh An
    Tịnh ; TS. Phạm Văn Quang, TS. Lý Ngọc Thanh Xuân (hướng dẫn khoa
    học).
-   **Tác giả**: Nguyễn, Huỳnh An Tịnh
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,;"Lý, Ngọc Thanh Xuân"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.158 T312 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000121
-   **Điện tử**: 1

### Bản ghi 125 (hàng Excel 133)

-   **STT**: 125
-   **Nhan đề**: Ảnh hưởng của hai loại phân đạm kết hợp quản lý nước
    đến đạm hữu dụng trong đất và năng suất lúa OM 18 tại huyện Thoại
    Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Trần Huỳnh Thanh Nghĩa ; TS. Dương Văn Nhã (hướng dẫn khoa
    học)
-   **Tác giả**: Trần, Huỳnh Thanh Nghĩa
-   **Giảng viên hướng dẫn**: Dương, Văn Nhã,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Ngh301 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000125
-   **Điện tử**: 1

### Bản ghi 126 (hàng Excel 134)

-   **STT**: 126
-   **Nhan đề**: Quản lý hoạt động giáo dục truyền thống cách mạng địa
    phương cho học sinh các trường trung học phổ thông huyện Tịnh Biên,
    tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục /
    Phạm Thị Bích Hạnh ; TS. Phan Ngọc Thạch hướng dẫn khoa học.
-   **Tác giả**: Phạm, Thị Bích Hạnh.
-   **Giảng viên hướng dẫn**: Phan, Ngọc Thạch,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.0114 H107 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000130
-   **Điện tử**: 1

### Bản ghi 127 (hàng Excel 135)

-   **STT**: 127
-   **Nhan đề**: Quản lý đội ngũ tổ trưởng chuyên môn các trường trung
    học phổ thông thị xã Tân Châu, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Văn Thịnh ; TS. Hồ Văn Thống
    (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Văn Thịnh.
-   **Giảng viên hướng dẫn**: Hồ, Văn Thống,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.11 Th312
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000131
-   **Điện tử**: 1

### Bản ghi 128 (hàng Excel 136)

-   **STT**: 128
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường tiểu học
    huyện An Phú, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý Giáo dục / Nguyễn Thị Hồng ; TS. Huỳnh Thanh Tiến (hướng dẫn khoa
    học).
-   **Tác giả**: Nguyễn, Thị Hồng.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 H455 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000132
-   **Điện tử**: 1

### Bản ghi 129 (hàng Excel 137)

-   **STT**: 129
-   **Nhan đề**: Quản lý hoạt động giáo dục địa phương cho học sinh các
    trường tiểu học ở huyện Thoại Sơn, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Phước Trung ; PGS.TS.
    Nguyễn Văn Đệ hướng dẫn khoa học.
-   **Tác giả**: Nguyễn, Phước Trung.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.89 Tr513 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000133
-   **Điện tử**: 1

### Bản ghi 130 (hàng Excel 138)

-   **STT**: 130
-   **Nhan đề**: Quản lý hoạt động bồi dưỡng đội ngũ cán bộ quản lý các
    trường tiểu học quận Thốt Nốt, thành phố Cần Thơ : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Phan Thị Thủy Duyên ;
    PGS.TS. Phạm Phương Tâm hướng dẫn khoa học.
-   **Tác giả**: Phan, Thị Thủy Duyên.
-   **Giảng viên hướng dẫn**: Phạm, Phương Tâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 D527 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000134
-   **Điện tử**: 1

### Bản ghi 131 (hàng Excel 139)

-   **STT**: 131
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường tiểu học ở
    huyện Tịnh Biên, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Huỳnh Thị Ngọc Ngân ; TS. Nguyễn Bách Thắng
    (hướng dẫn khoa học).
-   **Tác giả**: Huỳnh, Thị Ngọc Ngân.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.11 Ng121 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000135
-   **Điện tử**: 1

### Bản ghi 132 (hàng Excel 140)

-   **STT**: 132
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường trung học phổ thông huyện Châu Thành, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Huỳnh Vinh Huy ;
    PGS.TS. Phạm Minh Giản (hướng dẫn khoa học).
-   **Tác giả**: Huỳnh, Vinh Huy.
-   **Giảng viên hướng dẫn**: Phạm, Minh Giản,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1 H523 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000136
-   **Điện tử**: 1

### Bản ghi 133 (hàng Excel 141)

-   **STT**: 133
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh trường
    THPT Nguyễn Công Trứ, thành phố Long Xuyên, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Đào Thị Loan ; PGS.TS.
    Trần Văn Đạt (hướng dẫn khoa học).
-   **Tác giả**: Đào, Thị Loan.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1 L406 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000137
-   **Điện tử**: 1

### Bản ghi 134 (hàng Excel 142)

-   **STT**: 134
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    cơ sở huyện Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Trần Tấn Phước ; PGS.TS. Trần Văn Đạt
    (hướng dẫn khoa học).
-   **Tác giả**: Trần, Tấn Phước.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1201 Ph557 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000138
-   **Điện tử**: 1

### Bản ghi 135 (hàng Excel 143)

-   **STT**: 135
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống cho học sinh
    các trường trung học cơ sở tại thành phố Long Xuyên, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Đào Thị Tuất ;
    PGS.TS. Trần Văn Đạt (hướng dẫn khoa học).
-   **Tác giả**: Đào, Thị Tuất.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.18 T504 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000139
-   **Điện tử**: 0

### Bản ghi 136 (hàng Excel 144)

-   **STT**: 136
-   **Nhan đề**: Quản lý hoạt động kiểm định chất lượng giáo dục các
    trường trung học phổ thông huyện Chợ Mới, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Trương Kim Hồng Thư ;
    PGS.TS. Trần Văn Đạt hướng dẫn khoa học.
-   **Tác giả**: Trương, Kim Hồng Thư.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.11 Th550 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000140
-   **Điện tử**: 1

### Bản ghi 137 (hàng Excel 145)

-   **STT**: 137
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    cơ sở huyện Tịnh Biên, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý Giáo dục / Huỳnh Trung Cang ; TS. Nguyễn Bách Thắng
    (hướng dẫn khoa học).
-   **Tác giả**: Huỳnh, Trung Cang.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 C106 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000141
-   **Điện tử**: 1

### Bản ghi 138 (hàng Excel 146)

-   **STT**: 138
-   **Nhan đề**: Quản lý ứng dụng công nghệ thông tin ở các trường trung
    học cơ sở huyện Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý Giáo dục / Huỳnh Thị Thu Hồng ; TS. Lê Hùng Cường
    hướng dẫn khoa học.
-   **Tác giả**: Huỳnh, Thị Thu Hồng.
-   **Giảng viên hướng dẫn**: Lê, Hùng Cường,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.1 H455 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000142
-   **Điện tử**: 1

### Bản ghi 139 (hàng Excel 147)

-   **STT**: 139
-   **Nhan đề**: Quản lý hoạt động giáo dục bản sắc văn hóa dân tộc cho
    học sinh các trường phổ thông dân tộc nội trú trung học cơ sở ở tỉnh
    An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Lê
    Hồ Thảo Trang ; TS. Nguyễn Bách Thắng hướng dẫn khoa học.
-   **Tác giả**: Lê, Hồ Thảo Trang.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.2 Tr106 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000143
-   **Điện tử**: 1

### Bản ghi 140 (hàng Excel 148)

-   **STT**: 140
-   **Nhan đề**: Quản lý hoạt động học tập của học sinh ở các trường
    tiểu học thành phố Rạch Giá, tỉnh Kiên Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý Giáo dục / Thạch Hoàng Hà ; TS. Phạm Xuân Bình
    hướng dẫn khoa học.
-   **Tác giả**: Thạch, Hoàng Hà.
-   **Giảng viên hướng dẫn**: Phạm, Xuân Bình,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.1 H100 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000144
-   **Điện tử**: 1

### Bản ghi 141 (hàng Excel 149)

-   **STT**: 141
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường tiểu học huyện Giồng Riềng, tỉnh Kiên Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Phan Ngọc Diệp ; TS. Nguyễn
    Tuấn Khanh (hướng dẫn khoa học).
-   **Tác giả**: Phan, Ngọc Diệp.
-   **Giảng viên hướng dẫn**: Nguyễn, Tuấn Khanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.1 D307 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000145
-   **Điện tử**: 1

### Bản ghi 142 (hàng Excel 150)

-   **STT**: 142
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường mẫu giáo huyện
    Tịnh Biên, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Giáo dục / Ôn Thị Hà ; TS. Hồ Văn Thống (hướng dẫn khoa học).
-   **Tác giả**: Ôn, Thị Hà.
-   **Giảng viên hướng dẫn**: Hồ, Văn Thống,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.218 H100 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000146
-   **Điện tử**: 1

### Bản ghi 143 (hàng Excel 151)

-   **STT**: 143
-   **Nhan đề**: Quản lí hoạt động đổi mới phương pháp dạy học ở các
    trường trung học cơ sở huyện Thoại Sơn, tỉnh an giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Huy Bình ; PGS.TS.
    Phạm Minh Giản (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Huy Bình.
-   **Giảng viên hướng dẫn**: Phạm, Minh Giản,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.11 B312 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000147
-   **Điện tử**: 1

### Bản ghi 144 (hàng Excel 152)

-   **STT**: 144
-   **Nhan đề**: Quản lý đội ngũ giáo viên chủ nhiệm lớp ở các trường
    trung học phổ thông huyện Phú Tân, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý Giáo dục / Trần Kiên Cường ; TS. Trương
    Tấn Đạt (hướng dẫn khoa học).
-   **Tác giả**: Trần, Kiên Cường.
-   **Giảng viên hướng dẫn**: Trương, Tấn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 373.12 C561 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000148
-   **Điện tử**: 1

### Bản ghi 145 (hàng Excel 153)

-   **STT**: 145
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường mầm non ở
    huyện Tịnh Biên, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Quản lý Giáo dục / Nguyễn Thị Ngọc Dung ; PGS.TS. Nguyễn Văn Đệ
    (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn Thị Ngọc Dung.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 D513 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000149
-   **Điện tử**: 1

### Bản ghi 146 (hàng Excel 154)

-   **STT**: 146
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý trường đại học Kiên
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục / Phan
    Thanh Vũ ; TS. Nguyễn Tuấn Khanh (hướng dẫn khoa học).
-   **Tác giả**: Phan, Thanh Vũ.
-   **Giảng viên hướng dẫn**: Nguyễn, Tuấn Khanh,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 378.11 V500 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000150
-   **Điện tử**: 1

### Bản ghi 147 (hàng Excel 155)

-   **STT**: 147
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường tiểu học huyện An Phú, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý Giáo dục / Nguyễn Thị Diễm Tuyết ; TS. Phạm
    Hữu Ngãi (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Thị Diễm Tuyết.
-   **Giảng viên hướng dẫn**: Phạm, Hữu Ngãi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.1 T528 2023
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000151
-   **Điện tử**: 1

### Bản ghi 148 (hàng Excel 156)

-   **STT**: 148
-   **Nhan đề**: Quản lí hoạt động dạy học ở các trường tiểu học huyện
    Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    Giáo dục / Diệp Quốc Huy ; TS. Mai Thị Yến Lan hướng dẫn khoa học.
-   **Tác giả**: Diệp, Quốc Huy.
-   **Giảng viên hướng dẫn**: Mai, Thị Yến Lan,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý Giáo dục
    /
-   **Phân loại**: 372.12 H523 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000152
-   **Điện tử**: 1

### Bản ghi 149 (hàng Excel 157)

-   **STT**: 149
-   **Nhan đề**: Quản lý hoạt động dạy học môn tiếng Anh tại các trường
    trung học phổ thông huyện Phú Tân, tỉnh An Giang: Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý giáo dục / Huỳnh Anh Kiệt; TS.Phạm Hữu
    Ngãi hướng dẫn.
-   **Tác giả**: Huỳnh, Anh Kiệt.
-   **Giảng viên hướng dẫn**: Phạm, Hữu Ngãi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 370.7 K308 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000180
-   **Điện tử**: 1

### Bản ghi 150 (hàng Excel 158)

-   **STT**: 150
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    cơ sở huyện Chợ Mới, tỉnh An Giang: Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý giáo dục / Nguyễn Vĩnh Điền ; TS.Hồ Văn Thống hướng
    dẫn.
-   **Tác giả**: Nguyễn, Vĩnh Điền.
-   **Giảng viên hướng dẫn**: Hồ, Văn Thống,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.1201 Đ305 2022
-   **Năm xuất bản**: 2022.
-   **Số đăng ký cá biệt**: 180302000188
-   **Điện tử**: 1

### Bản ghi 151 (hàng Excel 159)

-   **STT**: 151
-   **Nhan đề**: Đánh giá khả năng phòng trị bệnh đạo ôn (Pyricularia
    oryzae) trên lúa bằng nấm nội sinh : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Lê Diệu Giác ; TS. Nguyễn Thị Thanh Xuân
    (hướng dẫn khoa học)
-   **Tác giả**: Lê, Diệu Giác
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1894 Gi101 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000118
-   **Điện tử**: 1

### Bản ghi 152 (hàng Excel 160)

-   **STT**: 152
-   **Nhan đề**: Ảnh hưởng của bón phân hữu cơ và phân bón lá Hi-Boron
    7-14 đến độ phì của đất, năng suất và chất lượng lúa OM18 trồng tại
    TP.Long Xuyên Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Lê Tấn Trung ; TS. Nguyễn Văn Chương (hướng dẫn khoa học).
-   **Tác giả**: Lê, Tấn Trung
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Tr513 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000119
-   **Điện tử**: 1

### Bản ghi 153 (hàng Excel 161)

-   **STT**: 153
-   **Nhan đề**: Ảnh hưởng của một số biện pháp kỷ thuật canh tác đến số
    hoa và chất lượng hoa cát tường \[Eustoma grandiflorum (Raf.)
    Shim.\] trồng trong chậu Luận văn tốt nghiệp Thạc sĩ ngành Khoa học
    cây trồng / Ngô Trà Cu Ba ; TS. Lê Bảo Long (hướng dẫn khoa học).
-   **Tác giả**: Ngô, Trà Cu Ba
-   **Giảng viên hướng dẫn**: Lê, Bảo Long
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.98 B100 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000120
-   **Điện tử**: 1

### Bản ghi 154 (hàng Excel 162)

-   **STT**: 154
-   **Nhan đề**: Ảnh hưởng của một số biện pháp kỷ thuật canh tác đến số
    hoa và chất lượng hoa cát tường \[Eustoma grandiflorum (Raf.)
    Shim.\] trồng trong chậu Luận văn tốt nghiệp Thạc sĩ ngành Khoa học
    cây trồng / Nguyễn Hữu An Khương ; PGS.TS. Nguyễn Duy Cần, TS. Cao
    Quốc Nam (hướng dẫn khoa học).
-   **Tác giả**: Nguyễn, Hữu An Khương
-   **Giảng viên hướng dẫn**: Lê, Bảo Long
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 Kh561 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000122
-   **Điện tử**: 1

### Bản ghi 155 (hàng Excel 163)

-   **STT**: 155
-   **Nhan đề**: Ảnh hưởng của giống lúa và một số biện pháp canh tác
    đến sự sinh trưởng phát triển của sâu năn (Orseolia oryzae) trong
    điều kiện nhà lưới Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Trần Anh Thơ ; TS. Võ Thị Bích Chi (hướng dẫn khoa học).
-   **Tác giả**: Trần, Anh Thơ
-   **Giảng viên hướng dẫn**: Võ, Thị Bích Chi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1897 Th460 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000124
-   **Điện tử**: 1

### Bản ghi 156 (hàng Excel 164)

-   **STT**: 156
-   **Nhan đề**: Phân lập, tuyển chọn và khảo sát ảnh hưởng của vi khuẩn
    nội sinh lên sự phát triển của lan ngọc điểm \[Rhynchostylis
    gigantea (Lindley) Ridley\] Luận văn tốt nghiệp Thạc sĩ ngành Khoa
    học cây trồng / Trần Quốc Tiến ; TS. Nguyễn Thị Phong Lan, TS.
    Nguyễn Hữu Thanh (hướng dẫn khoa học).
-   **Tác giả**: Trần, Quốc Tiến
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Phong Lan;"Nguyễn, Hữu Thanh"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.98 T305 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000126
-   **Điện tử**: 1

### Bản ghi 157 (hàng Excel 165)

-   **STT**: 157
-   **Nhan đề**: Đánh giá mức độ gây hại của sâu năn (Orseolia oryzae)
    trên lúa OM5451 trong điều kiện nhà lưới Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Trần Văn Hiểu ; TS. Võ Thị Bích Chi
    (hướng dẫn khoa học).
-   **Tác giả**: Trần, Văn Hiểu
-   **Giảng viên hướng dẫn**: Võ, Thị Bích Chi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1897 H309 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000127
-   **Điện tử**: 1

### Bản ghi 158 (hàng Excel 166)

-   **STT**: 158
-   **Nhan đề**: Đánh giá khả năng phòng trị của xạ khuẩn đối với bệnh
    héo dây, thối củ khoai lang do nấm Fusarium solani gây ra : Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Vũ Thanh Tuấn ; PGS.
    TS. Lê Minh Tường (hướng dẫn khoa học).
-   **Tác giả**: Vũ, Thanh Tuấn
-   **Giảng viên hướng dẫn**: Lê, Minh Tường,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.22 T502 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000128
-   **Điện tử**: 1

### Bản ghi 159 (hàng Excel 167)

-   **STT**: 159
-   **Nhan đề**: Ảnh hưởng của hoạt chất Benzalkonium Chloride đến bệnh
    sương mai (Pseudoperonospora cubensis sp.) gây bệnh trên cây dưa leo
    (Cucumis tativus) : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Đặng Thị Vân ; TS. Nguyễn Thị Phong Lan, TS. Nguyễn Hữu
    Thanh (hướng dẫn khoa học).
-   **Tác giả**: Đặng, Thị Vân
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Phong Lan,;"Nguyễn, Hữu
    Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.63 V121 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000129
-   **Điện tử**: 1

### Bản ghi 160 (hàng Excel 168)

-   **STT**: 160
-   **Nhan đề**: Phát triển đội ngũ giảng viên trường Cao đẳng Y tế An
    Giang: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Trần
    Trung Trưởng; TS.Phạm Xuân Bình hướng dẫn.
-   **Tác giả**: Trần, Trung Trưởng.
-   **Giảng viên hướng dẫn**: Phạm, Xuân Bình,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 378.12071 Tr561 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000181
-   **Điện tử**: 1

### Bản ghi 161 (hàng Excel 169)

-   **STT**: 161
-   **Nhan đề**: Quản lí hoạt động giáo dục kỹ năng sống cho học sinh ở
    các trường trung học cơ sở huyện Thoại Sơn, tỉnh An Giang: Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Lý Thị Lệ Huyền; TS.Hồ
    Văn Thống Thắng hướng dẫn.
-   **Tác giả**: Lý, Thị Lệ Huyền.
-   **Giảng viên hướng dẫn**: Hồ, Văn Thống,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.18 H527 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000182
-   **Điện tử**: 1

### Bản ghi 162 (hàng Excel 170)

-   **STT**: 162
-   **Nhan đề**: Quản lý hoạt động tư vấn tâm lí học đường cho học sinh
    các trường trung học phổ thông huyện Tri Tôn, tỉnh An Giang: Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Phạm Thị Quý;
    TS.Nguyễn Bách Thắng hướng dẫn.
-   **Tác giả**: Phạm, Thị Quý.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 370.15 Qu600 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000183
-   **Điện tử**: 1

### Bản ghi 163 (hàng Excel 171)

-   **STT**: 163
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    phổ thông ở huyện Tri Tôn, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý giáo dục / Trần Thanh Tùng; TS.Huỳnh Thanh Tiến
    hướng dẫn.
-   **Tác giả**: Trần, Thanh Tùng.
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.21 T513 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000184
-   **Điện tử**: 1

### Bản ghi 164 (hàng Excel 172)

-   **STT**: 164
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống cho học sinh
    các trường trung học phổ thông huyện Châu Thành, tỉnh An Giang: Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Lâm Mộc Tùng;
    TS.Phạm Xuân Bình hướng dẫn.
-   **Tác giả**: Lâm, Mộc Tùng.
-   **Giảng viên hướng dẫn**: Phạm, Xuân Bình,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.18 T513 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000185
-   **Điện tử**: 1

### Bản ghi 165 (hàng Excel 173)

-   **STT**: 165
-   **Nhan đề**: Quản lí hoạt động giáo dục địa phương cho học sinh các
    trường tiểu học ở thành phố Châu Đốc, tỉnh An Giang: Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý giáo dục / Chiêu Hồng Nhân ; PGS.TS.
    Nguyễn Văn Đệ hướng dẫn.
-   **Tác giả**: Chiêu, Hồng Nhân.
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.39 Nh121 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000186
-   **Điện tử**: 1

### Bản ghi 166 (hàng Excel 174)

-   **STT**: 166
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường trung học cơ sở
    huyện Chợ Mới, tỉnh An Giang: Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý giáo dục / Nông Văn Nghe ; PGS.TS. Trần Văn Đạt hướng dẫn.
-   **Tác giả**: Nông, Văn Nghe.
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.18 Ngh200 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000187
-   **Điện tử**: 1

### Bản ghi 167 (hàng Excel 175)

-   **STT**: 167
-   **Nhan đề**: Quản lí hoạt động giáo dục kĩ năng sống cho học sinh
    các trường trung học cơ sở huyện An Phú, tỉnh An Giang: Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý giáo dục / Nguyễn Tuấn Anh ; TS. Nguyễn
    Bách Thắng hướng dẫn.
-   **Tác giả**: Nguyễn, Tuấn Anh.
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.18 107 2021
-   **Năm xuất bản**: 2021.
-   **Số đăng ký cá biệt**: 180302000189
-   **Điện tử**: 1

### Bản ghi 168 (hàng Excel 176)

-   **STT**: 168
-   **Nhan đề**: Ảnh hưởng của các nguồn thức ăn bổ sung protein thô đến
    sự tiêu thụ thức ăn, tỉ lệ tiêu hóa, tích lũy đạm và tăng trưởng của
    dê thịt : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Đặng Văn
    Phúc ; GS. TS. Nguyễn Văn Thu (hướng dẫn khoa học)
-   **Tác giả**: Đặng, Văn Phúc
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Thu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.39085 Ph500
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000085
-   **Điện tử**: 1

### Bản ghi 169 (hàng Excel 177)

-   **STT**: 169
-   **Nhan đề**: Tình hình chăn nuôi bò và ảnh hưởng của thân lá cây đậu
    nành rau (Glycine max (L.) Merr.) ủ chua đến tỷ lệ tiêu hóa dưỡng
    chất của bò Brahman tại huyện Châu Phú, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Chăn nuôi / Nguyễn Tấn Trung ; TS. Nguyễn Thị
    Thu Hồng (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Tấn Trung
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Hồng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.21 Tr513
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000095
-   **Điện tử**: 1

### Bản ghi 170 (hàng Excel 178)

-   **STT**: 170
-   **Nhan đề**: Ảnh hưởng của loại đất và tỷ lệ phối trộn tro trấu đến
    sinh trưởng của cây giọt băng (Mesembryanthemum crystallium L.) :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Phan Hoàng
    Minh ; TS. Phạm Văn Quang, ThS. Võ Thị Xuân Tuyền (hướng dẫn khoa
    học)
-   **Tác giả**: Phan, Hoàng Minh
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,;"Võ, Thị Xuân Tuyền,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.88 M312
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000100
-   **Điện tử**: 1

### Bản ghi 171 (hàng Excel 179)

-   **STT**: 171
-   **Nhan đề**: Hiệu quả phân trùn quế, phân gà đến sự tăng trưởng,
    năng suất và chất lượng đậu bắp đỏ (Abelmoschus esculentus L.
    Moench) trồng trên đất phù sa : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Phạm Thị Diễm Thúy ; PGS. TS. Tất Anh Thư
    (hướng dẫn khoa học)
-   **Tác giả**: Phạm, Thị Diễm Thúy
-   **Giảng viên hướng dẫn**: Tất, Anh Thư,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.64889 Th523
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000101
-   **Điện tử**: 1

### Bản ghi 172 (hàng Excel 180)

-   **STT**: 172
-   **Nhan đề**: Ảnh hưởng của biện pháp tưới nước kết hợp bón vôi, phân
    bò, vian lên đặc tính hóa đất, năng suất và chất lượng lúa Jasmine85
    trồng tại huyện Châu Thành An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Nguyễn Anh Tú ; PGS. TS. Hồ Thanh Bình,
    TS. Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Anh Tú
-   **Giảng viên hướng dẫn**: Hồ, Thanh Bình,;"Nguyễn, Văn Chương,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 T500
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000102
-   **Điện tử**: 1

### Bản ghi 173 (hàng Excel 181)

-   **STT**: 173
-   **Nhan đề**: Ảnh hưởng của biện pháp canh tác đến năng suất cây
    khoai môn và môi trường đất, nước ở huyện Lấp Vò, tỉnh Đồng Tháp :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Phan Tấn
    Phước Lộc ; TS. Dương Minh Viễn (hướng dẫn khoa học)
-   **Tác giả**: Phan, Tấn Phước Lộc
-   **Giảng viên hướng dẫn**: Dương, Minh Viễn,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.68 L451
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000108
-   **Điện tử**: 1

### Bản ghi 174 (hàng Excel 182)

-   **STT**: 174
-   **Nhan đề**: Tuyển chọn vi khuẩn không lưu huỳnh màu tía có khả năng
    làm giảm hấp thụ arsen trong cây lúa : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Trương Thoại Mỹ ; TS. Nguyễn Thị Thanh
    Xuân, TS. Lý Ngọc Thanh Xuân (hướng dẫn khoa học)
-   **Tác giả**: Trương, Thoại Mỹ
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,;"Lý, Ngọc Thanh
    Xuân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 M600
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000109
-   **Điện tử**: 1

### Bản ghi 175 (hàng Excel 183)

-   **STT**: 175
-   **Nhan đề**: Ảnh hưởng của silic đến khả năng kháng một số bệnh và
    chất lượng hạt trên giống nếp AG tại huyện Phú Tân, tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Thị Huyền
    Linh ; PGS. TS. Hồ Thanh Bình, TS. Lê Thanh Toàn (hướng dẫn khoa
    học)
-   **Tác giả**: Lê, Thị Huyền Linh
-   **Giảng viên hướng dẫn**: Hồ, Thanh Bình,;"Lê, Thanh Toàn,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1894 L312
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000110
-   **Điện tử**: 1

### Bản ghi 176 (hàng Excel 184)

-   **STT**: 176
-   **Nhan đề**: Khảo sát hiện trạng canh tác, năng suất và chất lượng
    các giống lúa mùa tại Kiên Giang vụ mùa 2018-2019 : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Văn Đá ; PGS. TS. Lê
    Thanh Phong (hướng dẫn khoa học)
-   **Tác giả**: Lê, Văn Đá
-   **Giảng viên hướng dẫn**: Lê, Thanh Phong,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 Đ100
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000111
-   **Điện tử**: 1

### Bản ghi 177 (hàng Excel 185)

-   **STT**: 177
-   **Nhan đề**: Đánh giá hiệu quả của thực khuẩn thể trong phòng trị
    bệnh cháy bìa lá lúa do vi khuẩn Xanthomonas oryzae pv. oryzae ở
    điều kiện ngoài đồng : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học
    cây trồng / Trần Anh Khoa ; PGS. TS. Nguyễn Thị Thu Nga (hướng dẫn
    khoa học)
-   **Tác giả**: Trần, Anh Khoa
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Nga,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1894 Kh401
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000112
-   **Điện tử**: 1

### Bản ghi 178 (hàng Excel 186)

-   **STT**: 178
-   **Nhan đề**: Đánh giá hiện trạng canh tác khoai môn (Colocasia
    esculent L. Schott) tại huyện Lấp Vò, tỉnh Đồng Tháp : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Văn Chí ; TS.
    Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Văn Chí
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.68 Ch300
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000113
-   **Điện tử**: 1

### Bản ghi 179 (hàng Excel 187)

-   **STT**: 179
-   **Nhan đề**: Ảnh hưởng của tuổi liếp đến độ phì và khả năng hấp thu
    chất dinh dưỡng của cam sành (citrus nobilis L.) ở huyện Vũng Liêm,
    Vĩnh Long : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Quách Tỉnh Em ; GS. TS. Ngô Ngọc Hưng (hướng dẫn khoa học)
-   **Tác giả**: Quách, Tỉnh Em
-   **Giảng viên hướng dẫn**: Ngô, Ngọc Hưng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.31 E202
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000114
-   **Điện tử**: 1

### Bản ghi 180 (hàng Excel 188)

-   **STT**: 180
-   **Nhan đề**: Ảnh hưởng của phân bò và vôi lên năng suất và chất
    lượng của cây đậu phộng trồng trên đất xám bạc màu tại huyện Tri
    Tôn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Phạm Văn Liêm ; TS. Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Phạm, Văn Liêm
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.36889 L304
-   **Năm xuất bản**: 2021
-   **Số đăng ký cá biệt**: LVHV000115
-   **Điện tử**: 0

### Bản ghi 181 (hàng Excel 189)

-   **STT**: 181
-   **Nhan đề**: Quản lý hoạt động dạy học của tổ trưởng chuyên môn ở
    các trường trung học phổ thông tại thành phố Châu Đốc, tỉnh An Giang
    : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Nguyễn Minh
    Khang ; TS. Trần Thị Thanh Huế (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Minh Khang
-   **Giảng viên hướng dẫn**: Trần, Thị Thanh Huế,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.1202 Kh106
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000004
-   **Điện tử**: 0

### Bản ghi 182 (hàng Excel 190)

-   **STT**: 182
-   **Nhan đề**: Phát triển đội ngũ giáo viên theo chuẩn nghề nghiệp ở
    các trường phổ thông dân tộc nội trú tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Quản lý giáo dục / Thái Phước Hiệp ; TS. Phạm
    Hữu Ngãi (hướng dẫn khoa học)
-   **Tác giả**: Thái, Phước Hiệp
-   **Giảng viên hướng dẫn**: Phạm, Hữu Ngãi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.112 H307
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000005
-   **Điện tử**: 0

### Bản ghi 183 (hàng Excel 191)

-   **STT**: 183
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường trung học phổ
    thông huyện Vĩnh Thạnh, thành phố Cần Thơ : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý giáo dục / Phạm Thị Kim Ngọc ; TS. Phạm Phương Tâm
    (hướng dẫn khoa học).
-   **Tác giả**: Phạm, Thị Kim Ngọc.
-   **Giảng viên hướng dẫn**: Phạm, Phương Tâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.11 Ng419 2020
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000041
-   **Điện tử**: 0

### Bản ghi 184 (hàng Excel 192)

-   **STT**: 184
-   **Nhan đề**: Ảnh hưởng của chế phẩm KC1510-12 đến sinh trưởng và
    phát triển của giống lúa OM 6976 (Oryza sativa) : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Quốc Toàn ; PGS.TS.
    Trần Văn Dũng (hướng dẫn khoa học)
-   **Tác giả**: Lê, Quốc Toàn
-   **Giảng viên hướng dẫn**: Trần, Văn Dũng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 T406
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000065
-   **Điện tử**: 1

### Bản ghi 185 (hàng Excel 193)

-   **STT**: 185
-   **Nhan đề**: Xác đinh mô hình trồng huyền tinh đạt năng suất cao và
    đánh giá biện pháp sơ chế bảo quản ảnh hưởng đến chất lượng củ huyền
    tinh (Tacca leontopetaloides (L.) Kuntze) tại huyện Tịnh Biên, An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Nguyễn Chí Lưu ; TS. Hồ Thanh Bình, TS. Bùi Thị Dương Khuyều (hướng
    dẫn khoa học)
-   **Tác giả**: Nguyễn, Chí Lưu
-   **Giảng viên hướng dẫn**: Hồ, Thanh Bình,;"Bùi, Thị Dương Khuyều,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.68 L566
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000066
-   **Điện tử**: 1

### Bản ghi 186 (hàng Excel 194)

-   **STT**: 186
-   **Nhan đề**: Đánh giá biện pháp canh tác và sử dụng thuốc bảo vệ
    thực vật đến bệnh thán thư và năng suất khoai môn trồng tại huyện
    Lấp Vò, tỉnh Đồng Tháp : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học
    cây trồng / Trần Trọng Hữu ; TS. Nguyễn Văn Chương (hướng dẫn khoa
    học)
-   **Tác giả**: Trần, Trọng Hữu
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.68 H566
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000067
-   **Điện tử**: 1

### Bản ghi 187 (hàng Excel 195)

-   **STT**: 187
-   **Nhan đề**: Ảnh hưởng của mật độ sạ và flutriafol, tricyclazole đến
    bệnh đạo ôn, năng suất và phẩm chất gạo của giống OM 5451 vụ Hè Thu
    2018 tại huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Khoa học cây trồng / Lê Thanh Hà ; TS. Nguyễn Thị Thanh
    Xuân (hướng dẫn khoa học)
-   **Tác giả**: Lê, Thanh Hà
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.189 H100
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000068
-   **Điện tử**: 1

### Bản ghi 188 (hàng Excel 196)

-   **STT**: 188
-   **Nhan đề**: Hiệu quả của bón phân hữu cơ trong hệ thống luân canh
    lúa màu lên đặc tính đất và năng suất lúa tại Trà Ôn - Vĩnh Long :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Văn Chắn ;
    TS. Nguyễn Minh Phượng (hướng dẫn khoa học)
-   **Tác giả**: Lê, Văn Chắn
-   **Giảng viên hướng dẫn**: Nguyễn, Minh Phượng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Ch115
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000069
-   **Điện tử**: 1

### Bản ghi 189 (hàng Excel 197)

-   **STT**: 189
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống cho học sinh
    các trường tiểu học thành phố Long Xuyên, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Nguyễn Thị Minh Hiền ;
    PGS. TS. Trần Văn Đạt (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Minh Hiền
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.18 H305
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000070
-   **Điện tử**: 1

### Bản ghi 190 (hàng Excel 198)

-   **STT**: 190
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống tại các trường
    mầm non quận Ninh Kiều, thành phố Cần Thơ : Luận văn tốt nghiệp Thạc
    sĩ ngành Quản lý giáo dục / Hồ Như Ngọc ; TS. Phạm Phương Tâm (hướng
    dẫn khoa học)
-   **Tác giả**: Hồ, Như Ngọc
-   **Giảng viên hướng dẫn**: Phạm, Phương Tâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.21 Ng419
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000071
-   **Điện tử**: 1

### Bản ghi 191 (hàng Excel 199)

-   **STT**: 191
-   **Nhan đề**: Biện pháp quản lý hoạt động đảm bảo chất lượng giáo dục
    tại trường Đại học An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý giáo dục / Nguyễn Thị Thùy Liên ; PGS. TS. Trần Văn Đạt (hướng
    dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Thùy Liên
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 378 L305
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000072
-   **Điện tử**: 1

### Bản ghi 192 (hàng Excel 200)

-   **STT**: 192
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường tiểu học ở
    thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Quản lý giáo dục / Nguyễn Hữu Trí ; TS. Nguyễn Bách Thắng
    (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hữu Trí
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.11 Tr300
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000073
-   **Điện tử**: 1

### Bản ghi 193 (hàng Excel 201)

-   **STT**: 193
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường trung học cơ sở ở thành phố Châu Đốc, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Trần Bá Thể ; PGS.
    TS. Nguyễn Văn Đệ (hướng dẫn khoa học)
-   **Tác giả**: Trần, Bá Thể
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.0114 Th250
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000074
-   **Điện tử**: 1

### Bản ghi 194 (hàng Excel 202)

-   **STT**: 194
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    phổ thông thành phố Long Xuyên, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Quản lý giáo dục / Nguyễn Thanh Tân ; PGS. TS. Trần
    Văn Đạt (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thanh Tân
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.1202 T121
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000075
-   **Điện tử**: 1

### Bản ghi 195 (hàng Excel 203)

-   **STT**: 195
-   **Nhan đề**: Quản lý hoạt động dạy học ở các trường tiểu học huyện
    Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý giáo dục / Huỳnh Quốc Bảo ; TS. Nguyễn Bách Thắng (hướng dẫn khoa
    học)
-   **Tác giả**: Huỳnh, Quốc Bảo
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.13 B108
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000076
-   **Điện tử**: 1

### Bản ghi 196 (hàng Excel 204)

-   **STT**: 196
-   **Nhan đề**: Quản lí hoạt động giáo dục kỹ năng sống cho học sinh ở
    các trường trung học phổ thông huyện Tri Tôn, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Ôn Quốc Chiến ; TS.
    Nguyễn Bách Thắng (hướng dẫn khoa học)
-   **Tác giả**: Ôn, Quốc Chiến
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.18 Ch305
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000077
-   **Điện tử**: 1

### Bản ghi 197 (hàng Excel 205)

-   **STT**: 197
-   **Nhan đề**: Quản lý hoạt động chuyên môn ở các trường mầm non huyện
    Phú Tân, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý
    giáo dục / Huỳnh Thị Kiều Diễm ; PGS. TS. Huỳnh Thanh Tiến (hướng
    dẫn khoa học)
-   **Tác giả**: Huỳnh, Thị Kiều Diễm
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.112 D304
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000078
-   **Điện tử**: 1

### Bản ghi 198 (hàng Excel 206)

-   **STT**: 198
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường mầm non tư thục
    của Hội Dòng Đaminh Gò Vấp : Luận văn tốt nghiệp Thạc sĩ ngành Quản
    lý giáo dục / Nguyễn Thị Hà ; TS. Trần Thị Thanh Huế (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Thị Hà
-   **Giảng viên hướng dẫn**: Trần, Thị Thanh Huế,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 372.21 H100
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000079
-   **Điện tử**: 1

### Bản ghi 199 (hàng Excel 207)

-   **STT**: 199
-   **Nhan đề**: Quản lý hoạt động đổi mới phương pháp dạy học môn tiếng
    Anh ở các trường trung học cơ sở thành phố Long Xuyên, tỉnh An Giang
    : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Lê Đoàn Mỹ
    Giang ; TS. Huỳnh Thanh Tiến (hướng dẫn khoa học)
-   **Tác giả**: Lê, Đoàn Mỹ Giang
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.13 Gi106
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000080
-   **Điện tử**: 1

### Bản ghi 200 (hàng Excel 208)

-   **STT**: 200
-   **Nhan đề**: Quản lí công tác sinh viên tại trường Đại học An Giang
    : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục / Thái Thị Thùy
    Dương ; PGS. TS. Trần Văn Đạt (hướng dẫn khoa học)
-   **Tác giả**: Thái, Thị Thùy Dương
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 378.194 D561
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000081
-   **Điện tử**: 1

### Bản ghi 201 (hàng Excel 209)

-   **STT**: 201
-   **Nhan đề**: Quản lý hoạt động giáo dục truyền thống cách mạng địa
    phương cho học sinh các trường trung học phổ thông thành phố Châu
    Đốc, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo
    dục / Nguyễn Thị Quốc Khánh ; PGS. TS. Nguyễn Văn Đệ (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Thị Quốc Khánh
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Quản lý giáo dục
    /
-   **Phân loại**: 373.0114 Kh107
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000082
-   **Điện tử**: 1

### Bản ghi 202 (hàng Excel 210)

-   **STT**: 202
-   **Nhan đề**: Ảnh hưởng của Bacillus sp. tự sản xuất lên khả năng
    sinh trưởng của heo con sau cai sữa : Luận văn tốt nghiệp Thạc sĩ
    ngành Chăn nuôi / Hồ Thị Thùy Linh ; TS. Nguyễn Tuyết Giang, TS.
    Nguyễn Hữu Thanh (hướng dẫn khoa học)
-   **Tác giả**: Hồ, Thị Thùy Linh
-   **Giảng viên hướng dẫn**: Nguyễn, Tuyết Giang,;"Nguyễn, Hữu Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.4 L312
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000083
-   **Điện tử**: 1

### Bản ghi 203 (hàng Excel 211)

-   **STT**: 203
-   **Nhan đề**: Ảnh hưởng các mức độ bổ sung thân cây đậu nành rau tươi
    trong khẩu phần đến tăng trưởng của dê thịt : Luận văn tốt nghiệp
    Thạc sĩ ngành Chăn nuôi / Nguyễn Văn Khanh ; TS. Nguyễn Thị Thu Hồng
    (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Văn Khanh
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Hồng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.39085 Kh107
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000084
-   **Điện tử**: 1

### Bản ghi 204 (hàng Excel 212)

-   **STT**: 204
-   **Nhan đề**: Ảnh hưởng của sử dụng thân lá cây đậu nành rau
    \[Glycine max (L.) Merr.\] (Edamame) ủ chua đến tỷ lệ tiêu hóa của
    dê Bách Thảo : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Dương
    Hồng Duyên ; TS. Danh Mô, TS. Nguyễn Thị Thu Hồng (hướng dẫn khoa
    học)
-   **Tác giả**: Dương, Hồng Duyên
-   **Giảng viên hướng dẫn**: Danh Mô,;"Nguyễn, Thị Thu Hồng,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.39085 D527
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000086
-   **Điện tử**: 1

### Bản ghi 205 (hàng Excel 213)

-   **STT**: 205
-   **Nhan đề**: Ảnh hưởng của bột tỏi bổ sung trong khẩu phần lên các
    chỉ tiêu sinh lý - hóa máu, năng suất và chất lượng thân thịt của
    vịt Grimaud : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Võ Minh
    Trí ; TS. Nguyễn Thế Thao (hướng dẫn khoa học)
-   **Tác giả**: Võ, Minh Trí
-   **Giảng viên hướng dẫn**: Nguyễn, Thế Thao,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.597 Tr300
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000087
-   **Điện tử**: 0

### Bản ghi 206 (hàng Excel 214)

-   **STT**: 206
-   **Nhan đề**: Điều tra tình hình chăn nuôi dê ở huyện Tịnh Biên và
    xác định tỷ lệ tiêu hóa cành lá xoan (Melia azedarach) kết hợp mai
    dương (Mimosa pigra) trên dê lai Bách Thảo x địa phương : Luận văn
    tốt nghiệp Thạc sĩ ngành Chăn nuôi / Nguyễn Hữu Hòa ; PGS. TS. Võ
    Lâm (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hữu Hòa
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.39085 H401
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000088
-   **Điện tử**: 0

### Bản ghi 207 (hàng Excel 215)

-   **STT**: 207
-   **Nhan đề**: Ảnh hưởng của bắp hạt nghiền trong khẩu phần đến sự
    thải khí gây hiệu ứng nhà kính, tỷ lệ tiêu hóa và tích lũy đạm của
    thịt bò lai Sind : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Lại
    Quốc Khánh ; TS. Nguyễn Văn Thu (hướng dẫn khoa học)
-   **Tác giả**: Lại, Quốc Khánh
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Thu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.21 Kh107
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000089
-   **Điện tử**: 0

### Bản ghi 208 (hàng Excel 216)

-   **STT**: 208
-   **Nhan đề**: Phân lập và tuyển chọn vi khuẩn Bacillus spp. để xử lý
    phân bò tại huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Chăn nuôi / Đặng Nguyễn Hoàng Minh; TS. Nguyễn Thị
    Hạnh Chi (hướng dẫn khoa học)
-   **Tác giả**: Đặng, Nguyễn Hoàng Minh
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hạnh Chi,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 631.86 T507
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000090
-   **Điện tử**: 1

### Bản ghi 209 (hàng Excel 217)

-   **STT**: 209
-   **Nhan đề**: Ảnh hưởng các mức thay thế bột cá bằng bột dế nhà
    (Acheta domestica L.) lên năng suất và chất lượng thịt chim cút giai
    đoạn từ 11 đến 39 ngày tuổi : Luận văn tốt nghiệp Thạc sĩ ngành Chăn
    nuôi / Trần Minh Huy ; TS. Bùi Phan Thu Hằng (hướng dẫn khoa học)
-   **Tác giả**: Trần, Minh Huy
-   **Giảng viên hướng dẫn**: Bùi, Phan Thu Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5085 H523
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000091
-   **Điện tử**: 1

### Bản ghi 210 (hàng Excel 218)

-   **STT**: 210
-   **Nhan đề**: Ảnh hưởng của bột nghệ bổ sung trong khẩu phần lên các
    chỉ tiêu sinh lý hóa máu, năng suất và chất lượng thân thịt của gà
    tre : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Lê Tinh Sinh Tuệ
    ; TS. Nguyễn Thế Thao (hướng dẫn khoa học)
-   **Tác giả**: Lê, Tinh Sinh Tuệ
-   **Giảng viên hướng dẫn**: Nguyễn, Thế Thao,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5085 T507
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000092
-   **Điện tử**: 1

### Bản ghi 211 (hàng Excel 219)

-   **STT**: 211
-   **Nhan đề**: Phân lập và tuyển chọn vi khuẩn Lactobacillus sp. từ
    phân heo có một số đặc tính probiotic và thử nghiệm hiệu quả trên
    heo thịt : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Lê Thị Ngọc
    Hân ; TS. Nguyễn Tuyết Giang, TS. Nguyễn Hữu Thanh (hướng dẫn khoa
    học)
-   **Tác giả**: Lê, Thị Ngọc Hân
-   **Giảng viên hướng dẫn**: Nguyễn, Tuyết Giang,;"Nguyễn, Hữu Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.4085 H121
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000093
-   **Điện tử**: 1

### Bản ghi 212 (hàng Excel 220)

-   **STT**: 212
-   **Nhan đề**: Ảnh hưởng của khẩu phần thức ăn cơ sở có bổ sung thức
    ăn xanh lên khả năng sinh trưởng và giá trị dinh dưỡng của dế ta
    (Gryllus bimaculatus De Geer, 1773) : Luận văn tốt nghiệp Thạc sĩ
    ngành Chăn nuôi / Nguyễn Văn Cọp ; TS. Bùi Phan Thu Hằng (hướng dẫn
    khoa học)
-   **Tác giả**: Nguyễn, Văn Cọp
-   **Giảng viên hướng dẫn**: Bùi, Phan Thu Hằng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 638.5726 C434
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000094
-   **Điện tử**: 1

### Bản ghi 213 (hàng Excel 221)

-   **STT**: 213
-   **Nhan đề**: Ảnh hưởng của sự nâng cao năng lượng trong khẩu phần
    bằng bắp hạt nghiền đên sự tiêu thụ thức ăn, tiêu hóa dưỡng chất,
    môi trường dạ cỏ và tăng trưởng của dê cái : Luận văn tốt nghiệp
    Thạc sĩ ngành Chăn nuôi / Nguyễn Phương Nam ; GS. TS. Nguyễn Văn Thu
    (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Phương Nam
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Thu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.39085 N104
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000096
-   **Điện tử**: 1

### Bản ghi 214 (hàng Excel 222)

-   **STT**: 214
-   **Nhan đề**: Ảnh hưởng các mức thay thế bột cá bằng bột dế nhà lên
    khả năng sinh trưởng của gà Tam Hoàng và gà nòi giai đoạn 14 đến 77
    ngày tuổi : Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Lâm Việt
    Chiều ; PGS. TS. Võ Lâm (hướng dẫn khoa học)
-   **Tác giả**: Lâm, Việt Chiều
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.5085 Ch309
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000097
-   **Điện tử**: 1

### Bản ghi 215 (hàng Excel 223)

-   **STT**: 215
-   **Nhan đề**: Ảnh hưởng của chế phẩm Bacillus sp. và Lactobacillus
    sp. đến năng suất sinh trưởng của heo sau cai sữa : Luận văn tốt
    nghiệp Thạc sĩ ngành Chăn nuôi / Đặng Văn Nghiên ; TS. Nguyễn Thị
    Thu Hồng (hướng dẫn khoa học)
-   **Tác giả**: Đặng, Văn Nghiên
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thu Hồng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.4 Ngh305
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000098
-   **Điện tử**: 1

### Bản ghi 216 (hàng Excel 224)

-   **STT**: 216
-   **Nhan đề**: Khảo sát phương thức chăn nuôi vịt tại tỉnh Đồng Tháp :
    Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi / Huỳnh Hòa Bình ; PGS.
    TS. Võ Lâm (hướng dẫn khoa học)
-   **Tác giả**: Huỳnh, Hòa Bình
-   **Giảng viên hướng dẫn**: Võ, Lâm,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Chăn nuôi /
-   **Phân loại**: 636.597 B312
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000099
-   **Điện tử**: 1

### Bản ghi 217 (hàng Excel 225)

-   **STT**: 217
-   **Nhan đề**: Ảnh hưởng của biện pháp tưới, phân bò và canxi đến năng
    suất nếp CK92 tại huyện Phú Tân, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Hồ Lê Vân Nhi ; TS. Nguyễn Văn
    Chương (hướng dẫn khoa học)
-   **Tác giả**: Hồ, Lê Vân Nhi
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Nh300
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000103
-   **Điện tử**: 1

### Bản ghi 218 (hàng Excel 226)

-   **STT**: 218
-   **Nhan đề**: Đánh giá hiệu quả của Agrotain và Entec khi phối trộn
    với phân Urea và SA trong việc nâng cao hiệu quả sử dụng phân đạm
    cho lúa OM 5451 tại huyện Thới Lai, TP. Cần Thơ : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Hữu Tài ; TS. Chu
    Văn Hách (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hữu Tài
-   **Giảng viên hướng dẫn**: Chu, Văn Hách,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 T103
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000104
-   **Điện tử**: 1

### Bản ghi 219 (hàng Excel 227)

-   **STT**: 219
-   **Nhan đề**: Ảnh hưởng của nồng độ và thời điểm tưới mặn trên thay
    đổi hóa học đất và năng suất lúa trong điều kiện nhà lưới : Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần Thị Thu Sương ;
    TS. Nguyễn Kim Quyên (hướng dẫn khoa học)
-   **Tác giả**: Trần, Thị Thu Sương
-   **Giảng viên hướng dẫn**: Nguyễn, Kim Quyên,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 S561
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000105
-   **Điện tử**: 1

### Bản ghi 220 (hàng Excel 228)

-   **STT**: 220
-   **Nhan đề**: Khảo sát giống, mật độ và liều lượng phân đạm đến sinh
    trưởng, năng suất và phẩm chất của giống đậu nành nhật (Glycine
    max L. Merrill) : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Trần Thị Cẩm Ngân ; TS. Phạm Văn Quang, ThS. Võ Thị Xuân
    Tuyền (hướng dẫn khoa học)
-   **Tác giả**: Trần, Thị Cẩm Ngân
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,;"Võ, Thị Xuân Tuyền,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.3489 Ng121
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000106
-   **Điện tử**: 1

### Bản ghi 221 (hàng Excel 229)

-   **STT**: 221
-   **Nhan đề**: Ảnh hưởng của liều lượng Boron lên sinh trưởng và năng
    suất cây mè đen vụ Hè Thu tại huyện Châu Phú, tỉnh An Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Thị Bích
    Thắm ; PGS. TS. Lê Vĩnh Thúc (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Bích Thắm
-   **Giảng viên hướng dẫn**: Lê, Vĩnh Thúc,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.85 Th114
-   **Năm xuất bản**: 2020
-   **Số đăng ký cá biệt**: LVHV000107
-   **Điện tử**: 1

### Bản ghi 222 (hàng Excel 230)

-   **STT**: 222
-   **Nhan đề**: Giảm thiểu Asen bằng biện pháp bón vôi và vật liệu hữu
    cơ trên cây đậu nành và cây bắp trồng tại An Phú - Tỉnh An Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Trung
    Chính ; TS. Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Trung Chính
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.8 Ch312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000007
-   **Điện tử**: 0

### Bản ghi 223 (hàng Excel 231)

-   **STT**: 223
-   **Nhan đề**: Đánh giá khả năng phòng trị của xạ khuẩn đối với bệnh
    cháy lá khoai môn do nấm Phytophthora sp. gây ra : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần Phương Dinh ; PGS.TS.
    Lê Minh Tường (hướng dẫn khoa học)
-   **Tác giả**: Trần, Phương Dinh
-   **Giảng viên hướng dẫn**: Lê, Minh Tường,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.23 D312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000008
-   **Điện tử**: 0

### Bản ghi 224 (hàng Excel 232)

-   **STT**: 224
-   **Nhan đề**: Ảnh hưởng của mô hình luân canh lúa sen đến pH, chất
    hữu cơ, đạm tổng số trong đất và năng suất lúa tại huyện Thoại Sơn,
    An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê
    Thị Bạch Kim ; TS. Dương Văn Nhã, Châu Thi Đa (hướng dẫn khoa học)
-   **Tác giả**: Lê, Thị Bạch Kim
-   **Giảng viên hướng dẫn**: Dương, Văn Nhã,;"Châu, Thi Đa,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.582 K310
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000009
-   **Điện tử**: 0

### Bản ghi 225 (hàng Excel 233)

-   **STT**: 225
-   **Nhan đề**: Đánh giá thực trạng và biện pháp xử lý bã thải nấm bào
    ngư làm phân hữu cơ tại huyện Châu Thành, tỉnh An Giang : Luận văn
    tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Trương Khương ;
    TS. Dương Văn Nhã (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Trương Khương
-   **Giảng viên hướng dẫn**: Dương, Văn Nhã,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.87 Kh561
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000010
-   **Điện tử**: 0

### Bản ghi 226 (hàng Excel 234)

-   **STT**: 226
-   **Nhan đề**: Đánh giá khả năng tích lũy Asen sử dụng một số biện
    pháp canh tác để giảm thiểu Asen trong đất và trên một số loại cây
    trồng tại huyện An Phú, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Đoàn Hữu Mạnh ; TS. Nguyễn Văn Chương
    (hướng dẫn khoa học)
-   **Tác giả**: Đoàn, Hữu Mạnh
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.8 M107
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000011
-   **Điện tử**: 0

### Bản ghi 227 (hàng Excel 235)

-   **STT**: 227
-   **Nhan đề**: Tuyển chọn giống lúa chất lượng cao và xác định mật độ
    sạ phù hợp tại huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Lê Đức Nghị ; TS. Vũ Anh Pháp
    (hướng dẫn khoa học)
-   **Tác giả**: Lê, Đức Nghị
-   **Giảng viên hướng dẫn**: Vũ, Anh Pháp,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.187 Ngh300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000012
-   **Điện tử**: 0

### Bản ghi 228 (hàng Excel 236)

-   **STT**: 228
-   **Nhan đề**: Ảnh hưởng của phân hữu cơ từ bã thải nấm bào ngư đến
    sinh trưởng và năng suất của cây cúc đồng tiền (Gerbera jamesonii)
    và cây rau xà lách (Lactuca sativa) : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Nguyễn Thị Lan Vi ; TS. Dương Văn Nhã
    (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Lan Vi
-   **Giảng viên hướng dẫn**: Dương, Văn Nhã,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.87 V300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000013
-   **Điện tử**: 0

### Bản ghi 229 (hàng Excel 237)

-   **STT**: 229
-   **Nhan đề**: Ảnh hưởng của nồng độ Brassinolide trong sản phẩm Nyro
    đến bệnh vàng lá gân xanh, năng suất và phẩm chất trái quýt đường
    (Citrus reticulata Blanco) tại thị xã Long Mỹ, tỉnh Hậu Giang : Luận
    văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trang Kiên Bush ;
    TS. Trần Sỹ Hiếu, GS.TS. Trần Văn Hâu (hướng dẫn khoa học)
-   **Tác giả**: Trang, Kiên Bush
-   **Giảng viên hướng dẫn**: Trần, Sỹ Hiếu,;"Trần, Văn Hâu,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.304 B978
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000014
-   **Điện tử**: 1

### Bản ghi 230 (hàng Excel 238)

-   **STT**: 230
-   **Nhan đề**: Khảo sát hiệu quả canh tác lúa SRP (Sustainable Rice
    Platform) và mật độ sạ lên năng suất lúa, vụ Đông Xuân 2018-2019,
    tại huyện Châu Thành, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Phan Văn Chí Em ; TS. Vũ Anh Pháp (hướng
    dẫn khoa học)
-   **Tác giả**: Phan, Văn Chí Em
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 E202
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000015
-   **Điện tử**: 1

### Bản ghi 231 (hàng Excel 239)

-   **STT**: 231
-   **Nhan đề**: Ảnh hưởng của nồng độ Brassinolide trong sản phẩm Nyro
    đến bệnh vàng lá gân xanh, năng suất và phẩm chất trái cam soàn
    (Citrus sinensis L. Osbeck) tại huyện Phụng Hiệp, tỉnh Hậu Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Đức
    Long ; TS. Trần Sỹ Hiếu, GS.TS. Trần Văn Hâu (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Đức Long
-   **Giảng viên hướng dẫn**: Trần, Sỹ Hiếu,;"Trần, Văn Hâu,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.31 L431
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000017
-   **Điện tử**: 1

### Bản ghi 232 (hàng Excel 240)

-   **STT**: 232
-   **Nhan đề**: Ảnh hưởng của ứng dụng IPM lên thành phần dịch hại,
    thiên địch và hiệu quả kinh tế lúa tại huyện Châu Thành, tỉnh An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Nguyễn Hữu Phước ; TS. Nguyễn Thị Thanh Xuân (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hữu Phước
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.189 Ph557
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000019
-   **Điện tử**: 1

### Bản ghi 233 (hàng Excel 241)

-   **STT**: 233
-   **Nhan đề**: Ảnh hưởng của phân hữu cơ và vôi đối với năng suất cây
    ớt và sự thay đổi một số tính chất hóa học trên đất phù sa bồi ở Mỹ
    Hòa Hưng, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học
    cây trồng / Lương Bảo Toàn ; TS. Nguyễn Văn Chương (hướng dẫn khoa
    học)
-   **Tác giả**: Lương, Bảo Toàn
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.84 T406
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000020
-   **Điện tử**: 1

### Bản ghi 234 (hàng Excel 242)

-   **STT**: 234
-   **Nhan đề**: Hiện trạng sản xuất lúa và ảnh hưởng của bón phân hữu
    cơ trên năng suất lúa OM6976 và một số tính chất đất tại huyện Chợ
    Mới, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Ngô Thành Tòng ; TS. Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Ngô, Thanh Tòng
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 T431
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000021
-   **Điện tử**: 1

### Bản ghi 235 (hàng Excel 243)

-   **STT**: 235
-   **Nhan đề**: Ảnh hưởng của gốc ghép mướp lên sự sinh trưởng và năng
    suất của giống khổ qua TS 247 tại huyện Châu Thành tỉnh Sóc Trăng :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần Văn Toàn
    ; PGS.TS. Trần Thị Ba (hướng dẫn khoa học)
-   **Tác giả**: Trần, Văn Toàn
-   **Giảng viên hướng dẫn**: Trần, Thị Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 636.64 T406
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000022
-   **Điện tử**: 1

### Bản ghi 236 (hàng Excel 244)

-   **STT**: 236
-   **Nhan đề**: Nghiên cứu bổ sung ánh sáng đèn LED trồng rau mầm và
    rau non trên kệ trong nhà lưới : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Bùi Phạm Trần Minh ; PGS.TS. Trần Thị Ba (hướng
    dẫn khoa học)
-   **Tác giả**: Bùi, Phạm Trần Minh
-   **Giảng viên hướng dẫn**: Trần, Thị Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635 M312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000023
-   **Điện tử**: 1

### Bản ghi 237 (hàng Excel 245)

-   **STT**: 237
-   **Nhan đề**: Đánh giá khả năng phòng trừ một số bệnh hại lúa của vi
    khuẩn Bacillus spp. tại huyện Châu Phú tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Đổ Văn Chúng ; PGS.TS.
    Trần Vũ Phến (hướng dẫn khoa học)
-   **Tác giả**: Đổ, Văn Chúng
-   **Giảng viên hướng dẫn**: Trần, Vũ Phến,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1893 Ch513
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000024
-   **Điện tử**: 1

### Bản ghi 238 (hàng Excel 246)

-   **STT**: 238
-   **Nhan đề**: Đánh giá ảnh hưởng của bón N,P,K và tác động của
    Bortrac đến sinh trưởng và năng suất lúa tại Châu Thành - Sóc Trăng
    : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Cao Thành
    Tỷ ; PGS.TS. Trần Văn Dũng (hướng dẫn khoa học)
-   **Tác giả**: Cao, Thành Tỷ
-   **Giảng viên hướng dẫn**: Trần, Văn Dũng,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.188 T600
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000025
-   **Điện tử**: 0

### Bản ghi 239 (hàng Excel 247)

-   **STT**: 239
-   **Nhan đề**: Ảnh hưởng sử dụng phân bò đến năng suất và thành phần
    dinh dưỡng của Sorghum (Sorghum bicolor (L.) Conrad Moench.) dùng
    làm thức ăn cho động vật nhai lại trồng ở vùng đất xám bạc màu huyện
    Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa
    học cây trồng / Nguyễn Quốc Tình ; PGS. TS. Võ Lâm, Bùi Thị Dương
    Khuyều (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Quốc Tình
-   **Giảng viên hướng dẫn**: Võ, Lâm,;"Bùi, Thị Dương Khuyều,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.25 T312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000026
-   **Điện tử**: 0

### Bản ghi 240 (hàng Excel 248)

-   **STT**: 240
-   **Nhan đề**: Điều tra và đánh giá ảnh hưởng liều lượng xử lý
    Paclobutrazol đến tồn lưu trong đất, trên cây lúa tại huyện Châu
    Thành tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Thành Lập ; TS. Nguyễn Văn Chương (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Thành Lập
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.188 L123
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000027
-   **Điện tử**: 0

### Bản ghi 241 (hàng Excel 249)

-   **STT**: 241
-   **Nhan đề**: Ảnh hưởng của kỹ thuật canh tác hạn chế sử dụng thuốc
    bảo vệ thực vật lên thành phần dịch hại và thiên địch tại huyện Châu
    Thành và huyện Thoại Sơn - Tỉnh An Giang : Luận văn tốt nghiệp Thạc
    sĩ ngành Khoa học cây trồng / Lê Trần Phúc Nguyên ; Phạm Văn Quang
    (hướng dẫn khoa học)
-   **Tác giả**: Lê, Trần Phúc Nguyên
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1899 Ng527
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000028
-   **Điện tử**: 0

### Bản ghi 242 (hàng Excel 250)

-   **STT**: 242
-   **Nhan đề**: Đánh giá mô hình sản xuất lúa theo hướng an toàn tại
    huyện An Phú - Tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Dương Chí Tôn ; TS. Nguyễn Thị Thanh Xuân
    (hướng dẫn khoa học)
-   **Tác giả**: Dương, Chí Tôn
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 338.1 T454
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000029
-   **Điện tử**: 1

### Bản ghi 243 (hàng Excel 251)

-   **STT**: 243
-   **Nhan đề**: Ảnh hưởng của việc hạn chế sử dụng thuốc bảo vệ thực
    vật lên dịch hại và thiên địch trên lúa tại huyện An Phú, tỉnh An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Trần
    Văn Săng ; Phạm Văn Quang (hướng dẫn khoa học)
-   **Tác giả**: Trần, Văn Săng
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1899 S116
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000030
-   **Điện tử**: 1

### Bản ghi 244 (hàng Excel 252)

-   **STT**: 244
-   **Nhan đề**: Quản lý hoạt động giáo dục hòa nhập cho học sinh khuyết
    tật tại các trường tiểu học ở Thành phố Long Xuyên, tỉnh An Giang :
    Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã
    số: 8140114 / Nguyễn Văn Cần ; TS. Huỳnh Thanh Tiến (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Văn Cần
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 372.91 C121
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000031
-   **Điện tử**: 1

### Bản ghi 245 (hàng Excel 253)

-   **STT**: 245
-   **Nhan đề**: Quản lý hoạt động học tập của học sinh ở các trường
    trung học phổ thông huyện Vĩnh Thạnh, Thành phố Cần Thơ : Luận văn
    Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số:
    8140114 / Huỳnh Thị Kim Chi ; PGS.TS. Nguyễn văn Đệ (hướng dẫn khoa
    học)
-   **Tác giả**: Huỳnh, Thị Kim Chi
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.13 Ch300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000032
-   **Điện tử**: 1

### Bản ghi 246 (hàng Excel 254)

-   **STT**: 246
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường tiểu học
    huyện Thoại Sơn, tỉnh An Giang : Luận văn Thạc sĩ Khoa học Giáo dục
    chuyên ngành Quản lý giáo dục. Mã số: 8140114 / Hồ Tấn Duy; TS.
    Nguyễn Bách Thắng (hướng dẫn khoa học)
-   **Tác giả**: Hồ, Tấn Duy
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 372.1201 D523
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000033
-   **Điện tử**: 1

### Bản ghi 247 (hàng Excel 255)

-   **STT**: 247
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức cho học sinh các
    trường trung học cơ sở huyện Tri Tôn, tỉnh An Giang : Luận văn Thạc
    sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 /
    Trần Minh Đàng ; TS. Trần Thị Thanh Huế (hướng dẫn khoa học)
-   **Tác giả**: Trần, Minh Đàng
-   **Giảng viên hướng dẫn**: Trần, Thị Thanh Huế,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.0114 Đ106
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000034
-   **Điện tử**: 0

### Bản ghi 248 (hàng Excel 256)

-   **STT**: 248
-   **Nhan đề**: Quản lý hoạt động bồi dưỡng cán bộ quản lý các trường
    mầm non quận Thốt Nốt, Thành phố Cần Thơ : Luận văn Thạc sĩ Khoa học
    Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 / Huỳnh Thị
    Mai Gi ; TS. Phạm Phương Tâm (hướng dẫn khoa học)
-   **Tác giả**: Huỳnh, Thị Mai Gi
-   **Giảng viên hướng dẫn**: Phạm, Phương Tâm,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 372.1201 G300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000035
-   **Điện tử**: 0

### Bản ghi 249 (hàng Excel 257)

-   **STT**: 249
-   **Nhan đề**: Quản lý hoạt động đào tạo nghề lái xe ở Trường Kỹ thuật
    nghiệp vụ giao thông vận tải An Giang, tỉnh An Giang : Luận văn Thạc
    sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 /
    Đặng Phương Hà ; TS. Phạm Hữu Ngãi (hướng dẫn khoa học)
-   **Tác giả**: Đặng, Phương Hà
-   **Giảng viên hướng dẫn**: Phạm, Hữu Ngãi,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.246 H100
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000036
-   **Điện tử**: 0

### Bản ghi 250 (hàng Excel 258)

-   **STT**: 250
-   **Nhan đề**: Phát triển đội ngũ giảng viên Trường Cao đẳng nghề An
    Giang trong bối cảnh đổi mới giáo dục nghề nghiệp : Luận văn Thạc sĩ
    Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 /
    Đinh Thu Hà ; PGS.TS. Nguyễn Sỹ Thư (hướng dẫn khoa học)
-   **Tác giả**: Đinh, Thu Hà
-   **Giảng viên hướng dẫn**: Nguyễn, Sỹ Thư,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.246 H100
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000037
-   **Điện tử**: 0

### Bản ghi 251 (hàng Excel 259)

-   **STT**: 251
-   **Nhan đề**: Quản lý hoạt động giáo dục kỹ năng sống cho học sinh
    các trường trung học phổ thông huyện Châu Phú, tỉnh An Giang : Luận
    văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số:
    8140114 / Dương Văn Hai ; PGS.TS. Nguyễn Sỹ Thư (hướng dẫn khoa học)
-   **Tác giả**: Dương, Văn Hai
-   **Giảng viên hướng dẫn**: Nguyễn, Sỹ Thư,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.18 H103
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000038
-   **Điện tử**: 0

### Bản ghi 252 (hàng Excel 260)

-   **STT**: 252
-   **Nhan đề**: Quản lý hoạt động đổi mới phương pháp dạy học ở các
    trường trung học cơ sở huyện Châu Thành, tỉnh An Giang : Luận văn
    Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số:
    8140114 / Huỳnh Thanh Hải ; PGS.TS. Nguyễn Văn Lộc (hướng dẫn khoa
    học)
-   **Tác giả**: Huỳnh, Thanh Hải
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Lộc,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.13 H103
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000039
-   **Điện tử**: 0

### Bản ghi 253 (hàng Excel 261)

-   **STT**: 253
-   **Nhan đề**: Quản lý cơ sở vật chất và thiết bị dạy học ở Trường Kỹ
    thuật nghiệp vụ giao thông vận tải An Giang, tỉnh An Giang : Luận
    văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số:
    8140114 / Ngô Trung Hưng ; PGS.TS. Nguyễn Sỹ Thư (hướng dẫn khoa
    học)
-   **Tác giả**: Ngô, Trung Hưng
-   **Giảng viên hướng dẫn**: Nguyễn, Sỹ Thư,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.246 H556
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000040
-   **Điện tử**: 0

### Bản ghi 254 (hàng Excel 262)

-   **STT**: 254
-   **Nhan đề**: Phát triển đội ngũ tổ trưởng chuyên môn ở các trường
    tiểu học huyện Thoại Sơn, tỉnh An Giang đáp ứng yêu cầu đổi mới giáo
    dục phổ thông : Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản
    lý giáo dục. Mã số: 8140114 / Đỗ Thị Kim Loan; TS. Phạm Hữu Ngãi
    (hướng dẫn khoa học)
-   **Tác giả**: Đỗ, Thị Kim Loan
-   **Giảng viên hướng dẫn**: Phạm, Hữu Ngãi,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 372.1202 L406
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000042
-   **Điện tử**: 0

### Bản ghi 255 (hàng Excel 263)

-   **STT**: 255
-   **Nhan đề**: Quản lý hoạt động giáo dục đạo đức học sinh các trường
    trung học phổ thông huyện Tri Tôn, tỉnh An Giang : Luận văn Thạc sĩ
    Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 /
    Huỳnh Trung Nam ; PGS.TS. Trần Văn Đạt (hướng dẫn khoa học)
-   **Tác giả**: Huỳnh, Trung Nam
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.0114 N104
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000043
-   **Điện tử**: 0

### Bản ghi 256 (hàng Excel 264)

-   **STT**: 256
-   **Nhan đề**: Quản lý hoạt động dạy học ở các trường tiểu học huyện
    Thoại Sơn, tỉnh An Giang : Luận văn Thạc sĩ chuyên ngành Quản lý
    giáo dục. Mã số: 81.40.11.04 / Nguyễn Hùng Phong ; TS. Nguyễn Thị
    Hảo (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hùng Phong
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hảo,
-   **Chuyên ngành**: Luận văn Thạc sĩ chuyên ngành Quản lý giáo dục. Mã
    số: 81.40.11.04 /
-   **Phân loại**: 372.13 Ph431
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000044
-   **Điện tử**: 0

### Bản ghi 257 (hàng Excel 265)

-   **STT**: 257
-   **Nhan đề**: Phát triển đội ngũ giáo viên các trường trung học phổ
    thông huyện Tri Tôn, tỉnh An Giang : Luận văn Thạc sĩ Khoa học Giáo
    dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 / Lưu Văn Phước ;
    PGS.TS. Võ Văn Lộc (hướng dẫn khoa học)
-   **Tác giả**: Lưu, Văn Phước
-   **Giảng viên hướng dẫn**: Võ, Văn Lộc,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.11 Ph557
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000045
-   **Điện tử**: 0

### Bản ghi 258 (hàng Excel 266)

-   **STT**: 258
-   **Nhan đề**: Quản lý hoạt động bồi dưỡng chuyên môn cho giáo viên
    các trường mầm non huyện Tri Tôn, tỉnh An Giang theo chuẩn nghề
    nghiệp : Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý
    giáo dục. Mã số: 8140114 / Huỳnh Thị Mỹ Quí ; TS. Nguyễn Thị Hảo
    (hướng dẫn khoa học)
-   **Tác giả**: Huỳnh, Thị Mỹ Quí
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Hảo,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 372.11 Qu300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000046
-   **Điện tử**: 0

### Bản ghi 259 (hàng Excel 267)

-   **STT**: 259
-   **Nhan đề**: Hoạt động tự đánh giá trong kiểm định chất lượng giáo
    dục các trường trung học phổ thông huyện Phú Tân, tỉnh An Giang :
    Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã
    số: 8140114 / Trần Thanh Tâm ; TS. Huỳnh Thanh Tiến (hướng dẫn khoa
    học)
-   **Tác giả**: Trần, Thanh Tâm
-   **Giảng viên hướng dẫn**: Huỳnh, Thanh Tiến,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.126 T120
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000047
-   **Điện tử**: 0

### Bản ghi 260 (hàng Excel 268)

-   **STT**: 260
-   **Nhan đề**: Xây dựng văn hóa nhà trường ở các trường trung học phổ
    thông huyện Vĩnh Thạnh, Thành phố Cần Thơ : Luận văn Thạc sĩ Khoa
    học Giáo dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 / Đỗ
    Thành Thiện ; PGS.TS. Nguyễn Văn Đệ (hướng dẫn khoa học)
-   **Tác giả**: Đỗ, Thành Thiện
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Đệ,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.1 Th305
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000048
-   **Điện tử**: 0

### Bản ghi 261 (hàng Excel 269)

-   **STT**: 261
-   **Nhan đề**: Quản lý hoạt động phòng chống bạo lực học đường tại các
    trường trung học phổ thông huyện Chợ Mới, tỉnh An Giang : Luận văn
    Thạc sĩ Khoa học Giáo dục chuyên ngành Quản lý giáo dục. Mã số:
    8140114 / Nguyễn Trung Trực ; PGS.TS. Trần Văn Đạt (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Trung Trực
-   **Giảng viên hướng dẫn**: Trần, Văn Đạt,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.178 Tr552
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000049
-   **Điện tử**: 0

### Bản ghi 262 (hàng Excel 270)

-   **STT**: 262
-   **Nhan đề**: Phát triển đội ngũ cán bộ quản lý các trường trung học
    cơ sở huyện Tri Tôn, tỉnh An Giang : Luận văn Thạc sĩ Khoa học Giáo
    dục chuyên ngành Quản lý giáo dục. Mã số: 8140114 / Nguyễn Thanh
    Tùng ; TS. Nguyễn Bách Thắng (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thanh Tùng
-   **Giảng viên hướng dẫn**: Nguyễn, Bách Thắng,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.1201 T513
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000050
-   **Điện tử**: 0

### Bản ghi 263 (hàng Excel 271)

-   **STT**: 263
-   **Nhan đề**: Phát triển đội ngũ tổ trưởng chuyên môn các trường
    trung học phổ thông huyện Thoại Sơn, tỉnh An Giang trong bối cảnh
    đổi mới giáo dục : Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 / Đinh Ngọc Tuyên ; TS. Trần Thị
    Thanh Huế (hướng dẫn khoa học)
-   **Tác giả**: Đinh, Ngọc Tuyên
-   **Giảng viên hướng dẫn**: Trần, Thị Thanh Huế,
-   **Chuyên ngành**: Luận văn Thạc sĩ Khoa học Giáo dục chuyên ngành
    Quản lý giáo dục. Mã số: 8140114 /
-   **Phân loại**: 373.1202 T527
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000051
-   **Điện tử**: 0

### Bản ghi 264 (hàng Excel 272)

-   **STT**: 264
-   **Nhan đề**: Ảnh hưởng của phân bón và độ cao đến năng suất, hàm
    lượng tinh dầu của gừng gió (Zingiber zerumbet) tại núi Cấm huyện
    Tịnh Biên, An Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Thị Mỹ Bình ; TS. Nguyễn Thị Phong Lan, TS. Nguyễn
    Hữu Thanh (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Mỹ Bình
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Phong Lan,;"Nguyễn, Hữu
    Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.83 B312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000052
-   **Điện tử**: 0

### Bản ghi 265 (hàng Excel 273)

-   **STT**: 265
-   **Nhan đề**: Đánh giá đặc tính nông học, năng suất và chất lượng 17
    giống dưa leo (Cucumis sativus L.) nhập nội : Luận văn tốt nghiệp
    Thạc sĩ ngành Khoa học cây trồng / Phan Thị Kim Yến ; PGS.TS. Trần
    Thị Ba (hướng dẫn khoa học)
-   **Tác giả**: Phan, Thị Kim Yến
-   **Giảng viên hướng dẫn**: Trần, Thị Ba,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.63 Y254
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000053
-   **Điện tử**: 0

### Bản ghi 266 (hàng Excel 274)

-   **STT**: 266
-   **Nhan đề**: Đánh giá hiệu quả chế phẩm hữu cơ vi sinh đến sinh
    trưởng, năng suất lúa và hấp thu đạm, lân trên đất phèn ở Phụng
    Hiệp - Hậu Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Đoàn Thị Hoa Nhi ; TS. Nguyễn Thị Thanh Xuân (hướng dẫn khoa
    học)
-   **Tác giả**: Đoàn, Thị Hoa Nhi
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.1889 Nh300
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000054
-   **Điện tử**: 0

### Bản ghi 267 (hàng Excel 275)

-   **STT**: 267
-   **Nhan đề**: Đánh giá khả năng phòng trừ tuyến trùng Meloidogyne sp.
    gây hại trên tiêu của nấm Trichoderma sp. và Paecilomyces sp. trong
    điều kiện phòng thí nghiệm và nhà lưới : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Trương Thị Ngọc Hân ; TS. Nguyễn Thị
    Thanh Xuân (hướng dẫn khoa học)
-   **Tác giả**: Trương, Thị Ngọc Hân
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Thanh Xuân,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.84 H121
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000055
-   **Điện tử**: 1

### Bản ghi 268 (hàng Excel 276)

-   **STT**: 268
-   **Nhan đề**: Ảnh hưởng sử dụng phân bò ở vụ hai và khả năng cung cấp
    đạm, lân trên đất xám bạc màu đến năng suất của Sorghum (Sorghum
    bicolor (L.) Conrad Moench.) dùng làm thức ăn cho gia súc nhai lại ở
    huyện Thoại Sơn, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ ngành
    Khoa học cây trồng / Nguyễn Quốc Trinh ; PGS. TS. Võ Lâm, TS. Bùi
    Thị Dương Khuyều (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Quốc Trinh
-   **Giảng viên hướng dẫn**: Võ, Lâm,;"Bùi, Thị Dương Khuyều,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.25 Tr312
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000056
-   **Điện tử**: 1

### Bản ghi 269 (hàng Excel 277)

-   **STT**: 269
-   **Nhan đề**: Ảnh hưởng của việc bổ sung silic lên khả năng hấp thụ
    silic và chống chịu bệnh đạo ôn của lúa IR 50404 trong vụ Thu Đông
    2018 : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê Anh
    Triết ; TS. Nguyễn Thị Phong Lan, TS. Nguyễn Hữu Thanh (hướng dẫn
    khoa học)
-   **Tác giả**: Lê, Anh Triết
-   **Giảng viên hướng dẫn**: Nguyễn, Thị Phong Lan,;"Nguyễn, Hữu
    Thanh,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.189 Tr308
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000057
-   **Điện tử**: 1

### Bản ghi 270 (hàng Excel 278)

-   **STT**: 270
-   **Nhan đề**: Khảo sát quá trình phát triển và biện pháp thụ phấn bổ
    sung đến sự đậu trái của giống mãng cầu xiêm và mãng cầu xiêm Thái
    tại huyện Cờ Đỏ, thành phố Cần Thơ : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Phạm Duy Tân ; GS. Trần Văn Hâu (hướng
    dẫn khoa học)
-   **Tác giả**: Phạm, Duy Tân
-   **Giảng viên hướng dẫn**: Trần, Văn Hâu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.41 T121
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000058
-   **Điện tử**: 1

### Bản ghi 271 (hàng Excel 279)

-   **STT**: 271
-   **Nhan đề**: Đặc điểm di truyền của 6 giống dưa leo (Cucumis sativus
    L.) F1 có triển vọng dựa trên đặc tính hình thái, nông học và dấu
    phân tử SSR : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Lâm Trường Phúc ; PGS.TS. Trương Trọng Ngôn (hướng dẫn khoa học)
-   **Tác giả**: Lâm, Trường Phúc
-   **Giảng viên hướng dẫn**: Trương, Trọng Ngôn,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.63 Ph500
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000059
-   **Điện tử**: 1

### Bản ghi 272 (hàng Excel 280)

-   **STT**: 272
-   **Nhan đề**: Ảnh hưởng của phân Trichomix - DT và vôi đến tính chất
    hóa học đất, năng suất cây ớt trồng tại xã Hội An, Chợ Mới - An
    Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lê
    Hồng Phúc ; TS. Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Lê, Hồng Phúc
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.84 Ph500
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000060
-   **Điện tử**: 1

### Bản ghi 273 (hàng Excel 281)

-   **STT**: 273
-   **Nhan đề**: Ảnh hưởng của nồng độ Brassinolide trong sản phẩm Nyro
    đến bệnh vàng lá gân xanh, năng suất và phẩm chất trái của cây bưởi
    Da xanh (Citrus maxima (Burm.) Merr.) tại huyện Kế Sách, tỉnh Sóc
    Trăng : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Lăng
    Hoài Phong ; TS. Trần Sỹ Hiếu, GS. TS. Trần Văn Hâu (hướng dẫn khoa
    học)
-   **Tác giả**: Lăng, Hoài Phong
-   **Giảng viên hướng dẫn**: Trần, Văn Hâu,;"Trần, Sỹ Hiếu,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.32 Ph431
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000061
-   **Điện tử**: 1

### Bản ghi 274 (hàng Excel 282)

-   **STT**: 274
-   **Nhan đề**: Ảnh hưởng thời điểm xử lý và nồng độ uniconazole đến sự
    ra hoa, năng suất của xoài ba màu (Mangifera indica L.) tại cù lao
    Giêng, huyện Chợ Mới, tỉnh An Giang : Luận văn tốt nghiệp Thạc sĩ
    ngành Khoa học cây trồng / Nguyễn Tiến Đạt ; PGS. TS. Trần Văn Hâu
    (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Tiến Đạt
-   **Giảng viên hướng dẫn**: Trần, Văn Hâu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.44 Đ110
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000062
-   **Điện tử**: 1

### Bản ghi 275 (hàng Excel 283)

-   **STT**: 275
-   **Nhan đề**: Thành lập bản đồ nhu cầu và trữ lượng tài nguyên nước
    cho sản xuất nông nghiệp tại tiểu vùng Tây sông Hậu - Kiên Giang :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Thị
    Thu Lễ ; TS. Nguyễn Thế Cường, TS. Dương Văn Nhã (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Thị Thu Lễ
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 631.7 L250
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000063
-   **Điện tử**: 1

### Bản ghi 276 (hàng Excel 284)

-   **STT**: 276
-   **Nhan đề**: Tiềm năng chịu mặn và khả năng cải thiện hóa học đất
    nhiễm mặn của một số cây hoang dại thu thập ở các tỉnh ven biển đồng
    bằng sông Cửu Long : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Trung Chánh ; TS. Nguyễn Minh Đông (hướng dẫn khoa
    học)
-   **Tác giả**: Nguyễn, Trung Chánh
-   **Giảng viên hướng dẫn**: Nguyễn, Minh Đông,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.93353 Ch107
-   **Năm xuất bản**: 2019
-   **Số đăng ký cá biệt**: LVHV000064
-   **Điện tử**: 1

### Bản ghi 277 (hàng Excel 285)

-   **STT**: 277
-   **Nhan đề**: Quản lý dinh dưỡng lúa theo vùng đặc thù (SSNM) ở vụ
    Thu Đông tại thị xã Bình Minh, tĩnh Vĩnh Long và huyện Phụng Hiệp,
    tỉnh Hậu Giang : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Trịnh Văn Cường ; TS. Phạm Văn Quang, ThS. Lý Ngọc Thanh
    Xuân (hướng dẫn khoa học)
-   **Tác giả**: Trịnh, Văn Cường
-   **Giảng viên hướng dẫn**: Phạm, Văn Quang,;"Lý, Ngọc Thanh Xuân,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 C561
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000001
-   **Điện tử**: 1

### Bản ghi 278 (hàng Excel 286)

-   **STT**: 278
-   **Nhan đề**: Nghiên cứu ảnh hưởng của axit gibberellic đến tỉ lệ nảy
    mầm và hàm lượng chất GABA trong hạt trên một số giống lúa phổ biến
    tại ĐBSCL : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng /
    Lê Thị Ngọc Lam ; TS. Hồ Thanh Bình, Nguyễn Văn Chương (hướng dẫn
    khoa học)
-   **Tác giả**: Lê, Thị Ngọc Lam
-   **Giảng viên hướng dẫn**: Hồ, Thanh Bình,;"Nguyễn, Văn Chương,"
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 L104
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000002
-   **Điện tử**: 0

### Bản ghi 279 (hàng Excel 287)

-   **STT**: 279
-   **Nhan đề**: Ảnh hưởng của nồng độ BO và NAA lên sự đậu trái và năng
    suất xoài Ba Màu ở huyện Chợ Mới, tỉnh An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Nguyễn Hoàng Phúc ; GS.TS.
    Trần Văn Hâu (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Hoàng Phúc
-   **Giảng viên hướng dẫn**: Trần, Văn Hâu,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 634.44 Ph506
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000003
-   **Điện tử**: 0

### Bản ghi 280 (hàng Excel 288)

-   **STT**: 280
-   **Nhan đề**: Ảnh hưởng Amino Acid và NAA đến sinh trưởng của giống
    lan Dendrobium : Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng / Nguyễn Thị Kim Tuyền ; TS. Phạm Ngọc Tú (hướng dẫn khoa học)
-   **Tác giả**: Nguyễn, Thị Kim Tuyền
-   **Giảng viên hướng dẫn**: Phạm, Ngọc Tú,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 635.9344 T527
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000006
-   **Điện tử**: 0

### Bản ghi 281 (hàng Excel 289)

-   **STT**: 281
-   **Nhan đề**: Ảnh hưởng của mật độ sạ, lượng phân đạm đến sinh trưởng
    và năng suất trên giống lúa MTL372 tại ba vùng đất vụ hè thu 2017 :
    Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây trồng / Ngô Thanh
    Liêm ; TS. Vũ Anh Pháp (hướng dẫn khoa học)
-   **Tác giả**: Ngô, Thanh Liêm
-   **Giảng viên hướng dẫn**: Vũ, Anh Pháp,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.18 L304
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000016
-   **Điện tử**: 1

### Bản ghi 282 (hàng Excel 290)

-   **STT**: 282
-   **Nhan đề**: Đánh giá khả năng giảm hấp thụ Asen và Cadimi trên cây
    đậu phộng (Arachis hypogaea L.) bằng biện pháp bón vôi và mụn dừa
    trồng trên đất phù sa không bồi tại An Phú, An Giang : Luận văn tốt
    nghiệp Thạc sĩ ngành Khoa học cây trồng / Đỗ Trần Vĩnh Lộc ; TS.
    Nguyễn Văn Chương (hướng dẫn khoa học)
-   **Tác giả**: Đỗ, Trần Vĩnh Lộc
-   **Giảng viên hướng dẫn**: Nguyễn, Văn Chương,
-   **Chuyên ngành**: Luận văn tốt nghiệp Thạc sĩ ngành Khoa học cây
    trồng /
-   **Phân loại**: 633.368 L451
-   **Năm xuất bản**: 2018
-   **Số đăng ký cá biệt**: LVHV000018
-   **Điện tử**: 1

### Bản ghi 283 (hàng Excel 291)

-   **Điện tử**: 224

### Bản ghi 284 (hàng Excel 292)

-   **Nhan đề**: Ghi chú: Dữ liệu được sắp xếp theo tiêu chí năm xuất
    bản

*Kết thúc sheet LUAN_VAN: 284 bản ghi có dữ liệu sau hàng tiêu đề.*
