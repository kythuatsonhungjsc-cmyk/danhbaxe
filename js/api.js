import { DEFAULT_DATA, STORAGE_KEYS } from './data.js';

/**
 * Xử lý tất cả việc tìm nạp dữ liệu và đồng bộ hóa trạng thái.
 */
export async function fetchData() {
    // URL mới cập nhật (2025)
    const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbxIg3lZ8JSXEJDXVmSMPN8OMf2u6zrYxS_Ur6E-aTpbwJRFlZiJLb1RuhcJdCqKEw/exec';

    // Ưu tiên lấy trong LocalStorage (nếu người dùng tự cấu hình), nếu không thì dùng Default
    const apiUrl = localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_API_URL;

    const icon = document.getElementById('refresh-icon');
    if (icon) icon.classList.add('animate-spin');

    try {
        if (!apiUrl) {
            console.log("Không tìm thấy URL API, đang sử dụng dữ liệu mặc định.");
            return { ...DEFAULT_DATA };
        }

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Lỗi HTTP! mã trạng thái: ${res.status}`);

        const json = await res.json();

        // Cải thiện việc tìm kiếm dữ liệu (Tìm kiếm linh hoạt theo từ khóa)
        let vehicles = null;
        let hotline = null;

        if (Array.isArray(json)) {
            vehicles = json;
        } else if (typeof json === 'object') {
            // Danh sách các key tiềm năng cho vehicles
            const vehicleKeys = ['vehicles', 'DanhSachXe', 'xe', 'data'];
            for (const key of vehicleKeys) {
                if (json[key] && Array.isArray(json[key])) {
                    vehicles = json[key];
                    break;
                }
            }

            // Danh sách các key tiềm năng cho hotline
            const hotlineKeys = ['hotline', 'Hotline', 'lienHe', 'contacts'];
            for (const key of hotlineKeys) {
                if (json[key] && Array.isArray(json[key])) {
                    hotline = json[key];
                    break;
                }
            }

            // Nếu không tìm thấy bằng key cụ thể, lấy mảng lớn nhất làm vehicles
            if (!vehicles) {
                const arrays = Object.entries(json).filter(([_, v]) => Array.isArray(v));
                if (arrays.length > 0) {
                    // Sắp xếp theo độ dài mảng giảm dần
                    arrays.sort((a, b) => b[1].length - a[1].length);
                    vehicles = arrays[0][1];
                    // Nếu có mảng thứ 2, có thể là hotline
                    if (!hotline && arrays.length > 1) hotline = arrays[1][1];
                }
            }
        }

        // Logic tìm gara (nếu API trả về có key gara)
        let gara = null;
        if (json.gara && Array.isArray(json.gara)) {
            gara = json.gara;
        } else if (json.Gara && Array.isArray(json.Gara)) {
            gara = json.Gara;
        }

        return {
            vehicles: vehicles || DEFAULT_DATA.vehicles,
            hotline: hotline || DEFAULT_DATA.hotline,
            gara: gara || DEFAULT_DATA.gara
        };
    } catch (err) {
        console.error("Lỗi tìm nạp dữ liệu:", err);
        // Dự phòng (fallback) sang dữ liệu mặc định
        return { ...DEFAULT_DATA };
    } finally {
        if (icon) icon.classList.remove('animate-spin');
    }
}

export function saveApiUrl(url) {
    if (!url) return false;
    localStorage.setItem(STORAGE_KEYS.API_URL, url.trim());
    return true;
}

export function getStoredApiUrl() {
    return localStorage.getItem(STORAGE_KEYS.API_URL) || '';
}
