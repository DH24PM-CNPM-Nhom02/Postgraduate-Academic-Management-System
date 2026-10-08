# Hệ thống quản lý học vụ của học viên sau đại học

## Giới thiệu hệ thống

Hệ thống quản lý học vụ của học viên Sau đại học" là một nền tảng trực tuyến (Web-based) được xây dựng nhằm số hóa và liên kết toàn diện các quy trình quản lý đào tạo dành cho quy mô khoảng 300 học viên trình độ Thạc sĩ và Tiến sĩ. Hệ thống cung cấp một giải pháp đồng bộ, bao quát toàn bộ vòng đời học vụ từ khâu tuyển sinh, quản lý chương trình đào tạo, xếp thời khóa biểu, đăng ký môn học, thanh toán học phí trực tuyến, cho đến việc theo dõi sát sao tiến trình nghiên cứu (đối với Nghiên cứu sinh) và xét duyệt tốt nghiệp. Được phát triển dựa trên định hướng kiến trúc Microservices hiện đại bao gồm Backend NestJS, Frontend NextJS và hệ quản trị cơ sở dữ liệu PostgreSQL triển khai trên hạ tầng Docker, nền tảng này không chỉ giúp giảm tải đáng kể khối lượng công việc hành chính mà còn mang lại trải nghiệm tương tác trực quan, tiện lợi cho tất cả các bên tham gia bao gồm Ban đào tạo, Giảng viên và Học viên.



## Giảng viên hướng dẫn

- **Họ và tên:** Huỳnh Phước Hải

## Thành viên và phân công vai trò

| MSSV | Họ và tên | Nhóm | Vai trò |
|---|---|---|---|
| DPM235403 | Bùi Lê Tuấn Anh | Nhóm 02 | Frontend |
| DPM235407 | Nguyễn Tuấn Anh | Nhóm 02 | PO |
| DPM235408 | Trần Tuấn Anh | Nhóm 02 | Backend |
| DPM235431 | Trần Lê Quốc Khánh | Nhóm 02 | Frontend |
| DPM235436 | Huỳnh Hùng Kiên | Nhóm 02 | QA |
| DPM235449 | Huỳnh Lư Anh Minh | Nhóm 02 | QA |
| DPM235490 | Nguyễn Bảo Trọng | Nhóm 02 | Backend |
| DPM235495 | Lâm Nguyễn Nhựt Tường | Nhóm 02 | DevOps |

## Repository

- [Repository GitHub chính của Hệ thống](https://github.com/DH24PM-CNPM-Nhom02/Postgraduate-Academic-Management-System.git)

## Chạy bằng Docker Compose

Yêu cầu Docker Compose v2:

```bash
docker compose up --build
```

Frontend chạy tại `http://localhost:3000`, API gateway tại `http://localhost:3001`; các service backend lần lượt dùng cổng `3002`-`3005`. MariaDB chạy tại `localhost:3306` và được đánh dấu healthy trước khi các backend service khởi động. Compose dùng thông tin đăng nhập mặc định chỉ cho môi trường phát triển; hãy đặt `MARIADB_ROOT_PASSWORD`, `MARIADB_USER` và `MARIADB_PASSWORD` trong `.env` trước khi dùng ở môi trường chia sẻ hoặc production. Các database được tạo tự động trong lần khởi tạo volume đầu tiên.

Workflow GitHub Actions chạy test, build và kiểm tra kết nối/schema với MariaDB. Khi push lên `main` hoặc đẩy tag `v*`, workflow build và push image frontend cùng các backend service lên GitHub Container Registry (`ghcr.io`). Pull request chỉ chạy CI, không publish image. Repository cần bật quyền GitHub Actions ghi package để publish thành công.

Để chạy các image đã publish thay vì build tại chỗ, đặt `IMAGE_PREFIX=ghcr.io/dh24pm-cnpm-nhom02/postgraduate-academic-management-system` và `IMAGE_TAG=main` (hoặc tag phát hành) trong `.env`, đăng nhập GHCR rồi chạy `docker compose pull && docker compose up -d`.
