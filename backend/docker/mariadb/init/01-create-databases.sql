-- =============================================================
-- Tạo 4 databases riêng biệt cho mỗi microservice
-- Script này chỉ chạy 1 lần khi MariaDB container khởi tạo lần đầu
-- =============================================================

CREATE DATABASE IF NOT EXISTS `auth_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `phd_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `document_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `notification_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Cấp quyền cho user trên tất cả databases
GRANT ALL PRIVILEGES ON `auth_db`.* TO 'pams_user'@'%';
GRANT ALL PRIVILEGES ON `phd_db`.* TO 'pams_user'@'%';
GRANT ALL PRIVILEGES ON `document_db`.* TO 'pams_user'@'%';
GRANT ALL PRIVILEGES ON `notification_db`.* TO 'pams_user'@'%';

FLUSH PRIVILEGES;
