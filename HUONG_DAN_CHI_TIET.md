# HƯỚNG DẪN CHI TIẾT SỬ DỤNG VÀ TRIỂN KHAI (DEPLOY)

Tài liệu này hướng dẫn bạn từng bước từ khâu thiết lập ban đầu, cách sử dụng các tính năng của ứng dụng cho đến khi đưa ứng dụng lên mạng (GitHub Pages).

---

## 1. Yêu cầu chuẩn bị
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Git**: Để quản lý mã nguồn và đẩy lên GitHub.
- **Node.js (phiên bản 18 trở lên)**: Để chạy máy chủ kiểm thử tại máy cục bộ.
- **Một trình duyệt web hiện đại** (Chrome, Edge, Firefox).

---

## 2. Cách chạy ứng dụng trên máy của bạn (Cục bộ)

**Bước 1: Tải mã nguồn về máy**
Nếu bạn chưa có mã nguồn, hãy mở Terminal (hoặc PowerShell) và chạy:
```bash
git clone https://github.com/TÊN_TÀI_KHOẢN_CỦA_BẠN/danhbaxe.git
cd danhbaxe
```

**Bước 2: Cài đặt công cụ hỗ trợ**
Dự án sử dụng một thư viện cực nhẹ để chạy web. Hãy chạy lệnh sau:
```bash
npm install
```

**Bước 3: Khởi chạy máy chủ**
Chạy lệnh sau để bật ứng dụng:
```bash
npm run dev
```
Sau đó, hãy mở trình duyệt và truy cập: `http://localhost:3000` (hoặc địa chỉ hiển thị trên màn hình).

---

## 3. Hướng dẫn sử dụng các tính năng

### Xem danh sách đội xe
- **Trang chủ**: Hiển thị tổng quan số lượng xe. Bấm vào "Đội xe số 1" hoặc "Đội xe số 2" để xem danh sách chi tiết của từng đội.
- **Tìm kiếm**: Nhập biển số, tên tài xế hoặc loại xe vào thanh tìm kiếm trên cùng để lọc nhanh.

### Liên hệ nhanh
- **Gọi điện**: Bấm vào nút "Gọi" màu xanh lá cây để thực hiện cuộc gọi trực tiếp (trên điện thoại).
- **Nhắn tin Zalo**: Bấm vào nút "Zalo" màu xanh dương để tự động mở trang Zalo của tài xế/nhân viên đó.

### Cấu hình nguồn dữ liệu (Dành cho Quản trị viên)
Ứng dụng này có một tính năng ẩn để thay đổi nguồn dữ liệu từ Google Sheets:
1. Nhấp đúp (Double click) vào phần tiêu đề (Header - chỗ có tên "Sơn Hùng").
2. Một bảng cấu hình sẽ hiện ra.
3. Dán đường dẫn **Google Apps Script URL** mới vào và nhấn "Lưu cấu hình".

---

## 4. Hướng dẫn Deploy lên GitHub Pages (Từng bước một)

Chúng tôi đã thiết lập sẵn **GitHub Actions** để tự động hóa việc này. Bạn chỉ cần làm theo các bước sau:

**Bước 1: Tạo một kho lưu trữ (Repository) trên GitHub**
- Truy cập [github.com](https://github.com) và tạo một repo mới tên là `danhbaxe`.

**Bước 2: Đẩy mã nguồn từ máy bạn lên GitHub**
Mở Terminal tại thư mục dự án và chạy các lệnh:
```bash
git add .
git commit -m "Thiết lập dự án ban đầu"
git branch -M main
git remote add origin https://github.com/TÊN_TÀI_KHOẢN_CỦA_BẠN/danhbaxe.git
git push -u origin main
```

**Bước 3: Bật tính năng GitHub Pages**
1. Trên trình duyệt, vào trang repo của bạn trên GitHub.
2. Chọn **Settings** (Cài đặt) -> **Pages**.
3. Tại mục **Build and deployment** -> **Source**, hãy chọn **GitHub Actions**.

**Bước 4: Chờ đợi và kiểm tra**
- Khi bạn `git push`, một luồng công việc sẽ tự động chạy (xem ở tab **Actions** trên GitHub).
- Sau khi chạy xong, link trang web của bạn sẽ có dạng: `https://TÊN_TÀI_KHOẢN.github.io/danhbaxe/`

---

## 5. Lưu ý về Bảo mật
- **Tệp `.gitignore`**: Đảm bảo tệp này luôn tồn tại. Nó giúp bạn không bao giờ lỡ tay đẩy các tệp mật (như tệp sao lưu `backup_*.txt` hoặc file cấu hình cá nhân) lên Internet.
- **Cập nhật dữ liệu công khai**: Nếu bạn dùng Google Sheets, hãy đảm bảo chỉ chia sẻ quyền đọc cho script để tránh bị thay đổi dữ liệu trái phép.

---
*Chúc bạn quản lý đội xe hiệu quả! Nếu có vấn đề gì hãy kiểm tra tệp `SECURITY.md`.*
