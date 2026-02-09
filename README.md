# Đội xe Sơn Hùng - Danh bạ & Quản lý Đội xe

Ứng dụng web hiện đại, gọn nhẹ giúp quản lý danh sách đội xe và danh bạ hotline điều hành, tích hợp trực tiếp với dữ liệu từ Google Sheets.

## ✨ Tính năng nổi bật
- **Bảng điều khiển thông minh**: Theo dõi tổng số lượng xe, số xe sẵn sàng và không sẵn sàng ngay lập tức.
- **Danh sách đội xe**: Xem chi tiết tài xế, loại xe, và trạng thái từng xe. Hỗ trợ tìm kiếm nhanh.
- **Danh bạ Hotline**: Nhóm danh bạ theo phòng ban (Ban lãnh đạo, Kế toán, Nhân sự, Pháp chế,...).
- **Liên kết thông minh**: Gọi điện và nhắn tin Zalo chỉ với một lần nhấn.
- **Đồng bộ Google Sheets**: Dữ liệu luôn cập nhật thông qua Google Apps Script API.
- **Giao diện di động**: Tối ưu hóa hoàn toàn cho trải nghiệm trên điện thoại.

## 🚀 Hướng dẫn cài đặt

### 1. Chuẩn bị Google Sheets
- Tạo một file Google Spreadsheet với 2 trang tính (tabs): `DanhSachXe` và `Hotline`.
- Thiết lập các cột tương ứng theo mẫu.

### 2. Google Apps Script
- Triển khai script `doGet` để xuất dữ liệu dưới dạng JSON.
- Đảm bảo quyền truy cập là "Anyone" (Bất kỳ ai).

### 3. Cấu hình Ứng dụng
- Mở ứng dụng, nhấn đúp vào Logo hoặc tiêu đề trang để mở bảng cấu hình.
- Dán URL Google Apps Script của bạn vào và nhấn "Lưu cấu hình".

## 🛠 Công nghệ sử dụng
- **HTML5 & Vanilla JS** (ES6 Modules)
- **Tailwind CSS** (Styling)
- **Phosphor Icons** (Icon pack)
- **Google Apps Script** (Backend/Database)

## 📄 Giấy phép
Bản quyền thuộc về Sơn Hùng Logistics..
