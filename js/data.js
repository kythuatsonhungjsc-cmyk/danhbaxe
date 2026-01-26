/**
 * Dữ liệu giả lập mặc định cho ứng dụng quản lý đội xe.
 */
export const DEFAULT_DATA = {
    vehicles: [
        { BienSo: "29F-003.41", TaiXe: "Phạm Văn Duy", SDT: "084987333695", LoaiXe: "ISUZU", DoiXe: "Đội 1", TrangThai: "Sẵn Sàng" },
        { BienSo: "29K-040.46", TaiXe: "Hoàng Đức Ngọc", SDT: "084981485863", LoaiXe: "ISUZU", DoiXe: "Đội 2", TrangThai: "Sẵn Sàng" },
        { BienSo: "29K-040.81", TaiXe: "Hà Văn Anh", SDT: "", LoaiXe: "ISUZU", DoiXe: "Đội 1", TrangThai: "Không Sẵn Sàng" },
    ],
    hotline: [
        { HoTen: "Hà Minh Sơn", ChucVu: "Chủ Tịch", SDT: "09471513939", Nhom: "BAN LÃNH ĐẠO" },
        { HoTen: "Phạm Văn Hiếu", ChucVu: "Quản Lý Đội 1", SDT: "084848211112", Nhom: "QUẢN LÝ & KỸ THUẬT" },
        { HoTen: "Nguyễn Thanh Bình", ChucVu: "Kỹ Thuật Đội 2", SDT: "", Nhom: "QUẢN LÝ & KỸ THUẬT" },
        { HoTen: "Hoàng Nam", ChucVu: "Pháp Chế", SDT: "", Nhom: "PHÁP CHẾ" },
        { HoTen: "Phòng Kế Toán", ChucVu: "Kế Toán", SDT: "", Nhom: "KẾ TOÁN" },
        { HoTen: "Phòng Nhân Sự", ChucVu: "Hành Chính", SDT: "", Nhom: "NHÂN SỰ" }
    ]
};

export const STORAGE_KEYS = {
    API_URL: 'fleetApp_apiUrl'
};
