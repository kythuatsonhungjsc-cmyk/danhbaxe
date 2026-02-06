import { fetchData, saveApiUrl, getStoredApiUrl } from './api.js';

// Trạng thái toàn cục (Global state)
/**
 * Dữ liệu mặc định cho trạng thái ứng dụng.
 * (Default data for application state.)
 */
const DEFAULT_DATA = { vehicles: [], hotline: [], gara: [] };

/**
 * Trạng thái trung tâm của ứng dụng (Central application state)
 */
let appData = { ...DEFAULT_DATA };
let currentFilterTeam = null;

/**
 * Trình xử lý điều hướng (Navigation handler)
 */
export function navigateTo(pageId, teamFilter = null) {
    // Ẩn tất cả các chế độ xem
    document.querySelectorAll('[id^="view-"]').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    });

    // Đặt lại các nút điều hướng
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-700', 'active-nav');
        btn.classList.add('text-slate-400');
    });

    // Kích hoạt nút điều hướng cụ thể (Active specific nav button)
    let targetKey = pageId;
    if (teamFilter === 'Đội 1') targetKey = 'team1';
    if (teamFilter === 'Đội 2') targetKey = 'team2';

    const activeBtn = document.querySelector(`[data-target="${targetKey}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('text-blue-700', 'active-nav');
    }

    // Hiển thị chế độ xem (Show view)
    const view = document.getElementById(`view-${pageId}`);
    if (view) {
        view.classList.remove('hidden');
        if (pageId === 'fleet') view.classList.add('flex');
    }

    // Logic cụ thể cho từng trang (Page specific logic)
    if (pageId === 'home') updateStats();
    else if (pageId === 'fleet') {
        currentFilterTeam = teamFilter;
        document.getElementById('fleet-title').innerText = teamFilter ? `Danh sách ${teamFilter}` : "Toàn bộ xe";
        document.getElementById('searchInput').value = '';
        renderFleet();
    } else if (pageId === 'hotline') {
        renderHotline();
    } else if (pageId === 'gara') {
        renderGara();
    }
}

/**
 * Bộ định dạng (Formatters)
 */
function cleanPhone(phone) {
    if (!phone) return "";
    return phone.toString().replace(/\D/g, '');
}

/**
 * Chuẩn hóa số điện thoại về định dạng +84
 */
function normalizeTo84(phone) {
    let p = cleanPhone(phone);
    if (!p) return "";
    if (p.startsWith('0')) p = '84' + p.slice(1);
    if (!p.startsWith('84')) p = '84' + p;
    return p;
}

function getTelLink(phone) {
    const p = normalizeTo84(phone);
    return p ? '+' + p : "";
}

function formatPhone(phone) {
    const p = normalizeTo84(phone);
    if (!p) return "";
    // Định dạng +84 XXX XXX XXX
    return p.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
}

function formatZalo(phone) {
    return normalizeTo84(phone);
}

function normalizeStatus(status) {
    if (!status) return "";
    return status.toString().trim().toLowerCase();
}

/**
 * Các hàm hiển thị (Render Functions)
 */
function renderHotline() {
    const mainContainer = document.getElementById('hotline-dynamic-container');
    if (!mainContainer) return;
    mainContainer.innerHTML = '';

    if (!appData.hotline || appData.hotline.length === 0) {
        mainContainer.innerHTML = `<div class="text-center py-20 text-slate-400 font-bold">
            <i class="ph-bold ph-users-three text-4xl mb-2 opacity-20"></i>
            <p>Không có dữ liệu danh bạ</p>
        </div>`;
        return;
    }

    // Nhóm theo Nhom (Cột phân loại trong Sheet)
    const groups = {};
    appData.hotline.forEach(person => {
        const groupName = (person.Nhom || 'KHÁC').toString().toUpperCase().trim();
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(person);
    });

    // Màu sắc và Icon cho từng nhóm (Tự động gán theo tên nhóm)
    const groupStyles = {
        'BAN LÃNH ĐẠO': { text: 'text-amber-600', bg: 'bg-amber-500' },
        'QUẢN LÝ & KỸ THUẬT': { text: 'text-blue-600', bg: 'bg-blue-500' },
        'PHÁP CHẾ': { text: 'text-purple-600', bg: 'bg-purple-500' },
        'KẾ TOÁN': { text: 'text-emerald-600', bg: 'bg-emerald-500' },
        'NHÂN SỰ': { text: 'text-slate-600', bg: 'bg-slate-400' },
        'HÀNH CHÍNH': { text: 'text-slate-600', bg: 'bg-slate-400' }
    };

    Object.keys(groups).forEach(groupName => {
        try {
            const style = groupStyles[groupName] || { text: 'text-slate-500', bg: 'bg-slate-300' };
            let sectionHtml = `
                <div class="fade-in">
                    <h3 class="flex items-center gap-2 text-xs font-black ${style.text} uppercase mb-4 tracking-tighter">
                        <span class="w-8 h-1 ${style.bg} rounded-full"></span> ${groupName}
                    </h3>
                    <div class="grid grid-cols-1 gap-4">
            `;

            groups[groupName].forEach(person => {
                const isVip = groupName === 'BAN LÃNH ĐẠO';
                const zalo = formatZalo(person.SDT);
                sectionHtml += `
                    <div class="bg-white rounded-xl p-4 border-2 border-slate-300 shadow-sm flex items-center justify-between card-hover ${isVip ? 'vip-card' : ''}">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-lg ${isVip ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-slate-200 text-slate-600 border-2 border-slate-300'} flex items-center justify-center shrink-0 font-black text-sm">
                                ${(person.HoTen || '?').toString().charAt(0)}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-base leading-tight">${person.HoTen || 'Chưa rõ tên'}</h4>
                                <p class="text-[10px] text-slate-500 font-black uppercase tracking-wider mt-0.5">${person.ChucVu || 'Nhân viên'}</p>
                                <p class="text-xs text-slate-600 font-mono font-bold mt-0.5">${formatPhone(person.SDT)}</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a href="tel:${getTelLink(person.SDT)}" class="w-10 h-10 rounded-lg bg-green-600 border-2 border-green-700 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
                                <i class="ph-fill ph-phone text-lg"></i>
                            </a>
                            <a href="https://zalo.me/${zalo}" target="_blank" class="w-10 h-10 rounded-lg bg-blue-600 border-2 border-blue-700 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
                                <span class="font-black text-[10px]">Zalo</span>
                            </a>
                        </div>
                    </div>
                `;
            });

            sectionHtml += `</div></div>`;
            mainContainer.insertAdjacentHTML('beforeend', sectionHtml);
        } catch (e) {
            console.error("Lỗi khi render nhóm hotline:", groupName, e);
        }
    });
}

function renderFleet() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('fleetGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = (appData.vehicles || []).filter(v => {
        if (currentFilterTeam && normalizeStatus(v.DoiXe) !== normalizeStatus(currentFilterTeam)) return false;
        const searchStr = `${v.BienSo} ${v.TaiXe} ${v.LoaiXe} ${v.SDT}`.toLowerCase();
        return searchStr.includes(term);
    });

    document.getElementById('fleet-count').innerText = `${filtered.length} xe`;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-slate-400 font-bold">
            <i class="ph-bold ph-magnifying-glass text-4xl mb-2 opacity-20"></i>
            <p>Không tìm thấy xe nào</p>
        </div>`;
        return;
    }

    filtered.forEach(v => {
        const zalo = formatZalo(v.SDT);
        const status = normalizeStatus(v.TrangThai);

        let statusClass = status === 'sẵn sàng' ? 'badge-ready'
            : status === 'không sẵn sàng' ? 'badge-running'
                : 'badge-maintenance';

        const html = `
            <div class="bg-white rounded-xl shadow-md border-2 border-slate-300 p-4 flex flex-col gap-3 card-hover group fade-in">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-black text-xl text-slate-800 font-mono tracking-tight">${v.BienSo}</h3>
                        <p class="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-wider">${v.LoaiXe} • ${v.DoiXe}</p>
                    </div>
                    <span class="text-[10px] font-black px-2 py-1 rounded border uppercase ${statusClass}">${v.TrangThai}</span>
                </div>
                
                <div class="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 p-3 rounded-lg">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                         <i class="ph-fill ph-steering-wheel"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">Tài xế</p>
                        <span class="text-sm font-bold text-slate-700">${v.TaiXe}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-1">
                    <a href="tel:${getTelLink(v.SDT)}" class="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 border-b-4 border-green-800 text-white font-black text-xs uppercase tracking-wider shadow-sm active:border-b-0 active:mt-1 active:mb-[-4px] transition-all">
                        <i class="ph-fill ph-phone-call text-base"></i> Gọi
                    </a>
                    <a href="https://zalo.me/${zalo}" target="_blank" class="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 border-b-4 border-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-sm active:border-b-0 active:mt-1 active:mb-[-4px] transition-all">
                        <span class="bg-white text-blue-600 px-1 rounded-sm text-[9px] font-black">Z</span> Zalo
                    </a>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });
}

function updateStats() {
    const v = appData.vehicles || [];
    /**
     * Các thành phần giao diện (UI elements)
     */
    const elements = {
        total: document.getElementById('stat-total'),
        active: document.getElementById('stat-active'),
        running: document.getElementById('stat-running'),
        team1: document.getElementById('count-team1'),
        team2: document.getElementById('count-team2'),
        labelActive: document.getElementById('label-stat-active'), // Lưu ý: cần thêm ID này vào HTML nếu chưa có, nhưng hiện tại tập trung vào logic
        labelRunning: document.getElementById('label-stat-running')
    };

    if (elements.total) elements.total.innerText = v.length;

    // Tự động tìm các trạng thái phổ biến nhất (Find most common statuses)
    const statusCounts = {};
    v.forEach(i => {
        const s = normalizeStatus(i.TrangThai);
        if (s) statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const sortedStatuses = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

    // Cập nhật trạng thái số 1 (thường là "Sẵn sàng")
    if (sortedStatuses[0]) {
        if (elements.active) elements.active.innerText = sortedStatuses[0][1];
        if (elements.labelActive) elements.labelActive.innerText = sortedStatuses[0][0];
    }

    // Cập nhật trạng thái số 2 (thường là "Không sẵn sàng")
    const plateContainer = document.getElementById('not-ready-plates');
    if (plateContainer) plateContainer.innerHTML = '';

    if (sortedStatuses[1]) {
        if (elements.running) elements.running.innerText = sortedStatuses[1][1];
        if (elements.labelRunning) elements.labelRunning.innerText = sortedStatuses[1][0];

        // Liệt kê biển số xe
        if (plateContainer) {
            const notReadyVehicles = v.filter(i => normalizeStatus(i.TrangThai) === sortedStatuses[1][0]);
            notReadyVehicles.forEach(veh => {
                const plateTag = `<span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded text-[8px] font-bold font-mono">${veh.BienSo}</span>`;
                plateContainer.insertAdjacentHTML('beforeend', plateTag);
            });
        }
    } else {
        if (elements.running) elements.running.innerText = "0";
    }

    if (elements.team1) elements.team1.innerText = `${v.filter(i => normalizeStatus(i.DoiXe) === 'đội 1').length} xe`;
    if (elements.team2) elements.team2.innerText = `${v.filter(i => normalizeStatus(i.DoiXe) === 'đội 2').length} xe`;
}

/**
 * Tải lần đầu & Trình lắng nghe sự kiện (Initial Load & Event Listeners)
 */
/**
 * Làm mới dữ liệu từ API và cập nhật giao diện
 */
function renderGara() {
    const mainContainer = document.getElementById('gara-dynamic-container');
    if (!mainContainer) return;
    mainContainer.innerHTML = '';

    if (!appData.gara || appData.gara.length === 0) {
        mainContainer.innerHTML = `<div class="text-center py-20 text-slate-400 font-bold">
            <i class="ph-bold ph-wrench text-4xl mb-2 opacity-20"></i>
            <p>Không có dữ liệu gara</p>
        </div>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    appData.gara.forEach(item => {
        const phone = normalizeTo84(item.SoDienThoai);
        const mapLink = item.DiaChi || '#';

        const html = `
            <div class="bg-white rounded-xl p-4 border-2 border-slate-300 shadow-sm flex flex-col gap-3 card-hover fade-in">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-black text-lg text-slate-800 leading-tight">${item.GaRa || 'Gara ???'}</h3>
                        <p class="text-xs text-slate-500 font-bold mt-1">${item.NghiepVu || 'Dịch vụ kĩ thuật'}</p>
                    </div>
                    <div class="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center border-2 border-orange-200">
                         <i class="ph-fill ph-wrench text-xl"></i>
                    </div>
                </div>

                <div class="flex items-center gap-2 mt-1">
                     <i class="ph-bold ph-phone text-slate-400"></i>
                     <span class="text-sm font-mono font-bold text-slate-700">${formatPhone(item.SoDienThoai)}</span>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-auto pt-2">
                    <a href="tel:${getTelLink(item.SoDienThoai)}" class="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all">
                        <i class="ph-bold ph-phone"></i> Gọi
                    </a>
                    <a href="${mapLink}" target="_blank" class="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all">
                        <i class="ph-bold ph-map-pin"></i> Chỉ đường
                    </a>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });

    mainContainer.appendChild(grid);
}

async function refreshData() {
    appData = await fetchData();
    updateStats();

    // Làm mới chế độ xem hiện tại nếu cần
    const visibleFleet = !document.getElementById('view-fleet').classList.contains('hidden');
    const visibleHotline = !document.getElementById('view-hotline').classList.contains('hidden');
    const visibleGara = !document.getElementById('view-gara').classList.contains('hidden');

    if (visibleFleet) renderFleet();
    if (visibleHotline) renderHotline();
    if (visibleGara) renderGara();
}

window.addEventListener('DOMContentLoaded', () => {
    // Thiết lập điều hướng
    window.navigateTo = navigateTo;

    // Tìm kiếm với debounce
    let searchTimer;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(renderFleet, 250);
        });
    }

    // Logic cho cửa sổ cấu hình (Modal logic)
    const apiModal = document.getElementById('apiModal');
    const apiUrlInput = document.getElementById('apiUrlInput');

    window.openConfig = () => {
        apiUrlInput.value = getStoredApiUrl();
        apiModal.classList.remove('hidden');
    }

    window.closeConfig = () => apiModal.classList.add('hidden');

    window.saveConfig = () => {
        if (saveApiUrl(apiUrlInput.value)) {
            closeConfig();
            refreshData();
        }
    };


    document.querySelector('header').addEventListener('dblclick', window.openConfig);

    // Nút làm mới
    const refreshBtn = document.querySelector('button[onclick="fetchData()"]');
    if (refreshBtn) {
        refreshBtn.onclick = refreshData;
    }

    // Tải dữ liệu lần đầu (First load)
    refreshData().then(() => navigateTo('home'));
});
