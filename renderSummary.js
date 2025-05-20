function renderSummary(summary) {
  const danhMucs = ['Chân váy (dải cũ)', 'Chân váy (dải mới)', 'Quần (dải mới)', 'Không xác định'];
  // Đã xóa 'Quần (dải cũ)' khỏi danh sách vì đã gộp vào 'Chân váy (dải cũ)'
  
  const table = document.getElementById('summaryTable');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  let tongDoanhSo = 0;
  let tongTraffic = 0;
  let tongKhach = 0;

  danhMucs.forEach((danhMuc) => {
    const dtkh = doanhThuTheoKhachHang[danhMuc] || 0;
    const views = summary[danhMuc]?.views || 0;
    const revenue = summary[danhMuc]?.revenue || 0;
    const khach = dtkh > 0 ? Math.round(revenue / dtkh) : 0;

    tongDoanhSo += revenue;
    tongTraffic += views;
    tongKhach += khach;
  });

  const afterInputId = 'after-input-Tổng';
  const afterValue = summary['Tổng']?.after || Math.round(tongDoanhSo * 0.97);
  summary['Tổng'] = summary['Tổng'] || {};
  summary['Tổng'].after = afterValue;

  const hoanHuyTong = tongDoanhSo > 0
    ? (((tongDoanhSo - afterValue) / tongDoanhSo) * 100).toFixed(2)
    : '0.00';

  const tongChuyenDoi = tongTraffic > 0 ? (tongKhach / tongTraffic * 100).toFixed(2) + ' %' : '0 %';
  const doanhSoMoiKH_Tong = tongKhach > 0 ? (tongDoanhSo / tongKhach).toLocaleString('vi-VN') + ' đ' : '0 đ';

  const tongGroup = document.createElement('tr');
  tongGroup.className = 'highlight-group';
  tongGroup.innerHTML = `<td colspan="2" class="category-header">Tổng</td>`;
  tbody.appendChild(tongGroup);

  const tongRows = [
    ['Doanh số', tongDoanhSo.toLocaleString('vi-VN') + ' đ', 'revenue-cell'],
    ['Traffic', tongTraffic, 'neutral-metric'],
    ['Tỉ lệ chuyển đổi (%)', `<span class="positive-metric">${tongChuyenDoi}</span>`, 'highlight-sub'],
    ['Số khách hàng', tongKhach, ''],
    ['Doanh số mỗi khách hàng', doanhSoMoiKH_Tong, 'revenue-cell'],
    ['Tỷ lệ hoàn huỷ (%)', `<span class="negative-metric">${hoanHuyTong} %</span>`, 'highlight-sub'],
    ['Doanh số sau hoàn huỷ', `<input type="number" id="${afterInputId}" value="${afterValue}" data-danhmuc="Tổng" class="form-control">`, 'revenue-cell'],
  ];

  tongRows.forEach(([label, value, className]) => {
    const tr = document.createElement('tr');
    tr.className = className || '';
    tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });

  danhMucs.forEach((danhMuc) => {
    if (!summary[danhMuc]) return;

    const dtkh = doanhThuTheoKhachHang[danhMuc] || 0;
    const views = summary[danhMuc].views;
    const revenue = summary[danhMuc].revenue;
    const khach = dtkh > 0 ? Math.round(revenue / dtkh) : 0;
    const chuyenDoi = views > 0 ? (khach / views * 100).toFixed(2) + ' %' : '0 %';

    const after = revenue * (1 - hoanHuyTong / 100);
    summary[danhMuc].after = after;

    const doanhSoMoiKH = dtkh > 0 ? dtkh.toLocaleString('vi-VN') + ' đ' : 'Không xác định';

    const groupRow = document.createElement('tr');
    groupRow.className = 'highlight-group';
    groupRow.innerHTML = `<td colspan="2" class="category-header">${danhMuc}</td>`;
    tbody.appendChild(groupRow);

    const rows = [
      ['Doanh số', revenue.toLocaleString('vi-VN') + ' đ', 'revenue-cell'],
      ['Traffic', views, 'neutral-metric'],
      ['Tỉ lệ chuyển đổi (%)', `<span class="positive-metric">${chuyenDoi}</span>`, 'highlight-sub'],
      ['Số khách hàng', khach, ''],
      ['Doanh số mỗi khách hàng', doanhSoMoiKH, 'revenue-cell'],
      ['Tỷ lệ hoàn huỷ (%)', `<span class="negative-metric">${hoanHuyTong} %</span>`, 'highlight-sub'],
      ['Doanh số sau hoàn huỷ', after.toLocaleString('vi-VN') + ' đ', 'revenue-cell'],
    ];

    rows.forEach(([label, value, className]) => {
      const tr = document.createElement('tr');
      tr.className = className || '';
      tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
      tbody.appendChild(tr);
    });
  });

  const input = document.getElementById(afterInputId);
  if (input) {
    input.addEventListener('change', () => {
      const newVal = parseFloat(input.value);
      if (!isNaN(newVal)) {
        summary['Tổng'].after = newVal;
        renderSummary(summary);
      }
    });
    
    input.addEventListener('focus', function() {
      this.parentNode.parentNode.classList.add('active-row');
    });
    
    input.addEventListener('blur', function() {
      this.parentNode.parentNode.classList.remove('active-row');
    });
  }
}
