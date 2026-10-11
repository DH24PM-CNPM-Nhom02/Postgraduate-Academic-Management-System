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

## Chạy FE và BE bằng Compose riêng khi phát triển

Mở hai terminal tại thư mục gốc repository. Chạy backend trước:

```bash
docker compose -f compose.dev-be.yml up --build
```

Sau đó chạy frontend:

```bash
docker compose -f compose.dev-fe.yml up --build
```

Frontend chạy tại `http://localhost:3000`, gọi API qua gateway tại `http://localhost:3001/api/v1`. MariaDB được publish ở `localhost:3306`; các microservice backend chỉ giao tiếp nội bộ trong Compose network, không publish port riêng ra host. Các mật khẩu mặc định trong Compose chỉ dành cho máy phát triển cá nhân; có thể đặt `MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `MARIADB_PORT`, `API_GATEWAY_HOST_PORT` và `FRONTEND_PORT` trong file `.env` để ghi đè cấu hình local.

## Chạy riêng MariaDB

Nếu chỉ cần database để chạy ứng dụng trực tiếp trên máy:

```bash
docker compose -f backend/docker-compose.yml up -d
```

Compose này chỉ khởi động MariaDB, không khởi động frontend hoặc backend. Các database được tạo tự động trong lần khởi tạo volume đầu tiên.

Workflow GitHub Actions chạy test, build và kiểm tra kết nối/schema với MariaDB. Khi push lên `main` hoặc đẩy tag `v*`, workflow build và push image frontend cùng các backend service lên GitHub Container Registry (`ghcr.io`). Pull request chỉ chạy CI, không publish image. Repository cần bật quyền GitHub Actions ghi package để publish thành công.
