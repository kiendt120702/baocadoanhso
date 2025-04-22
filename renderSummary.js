function renderSummary(summary) {
    const danhMucs = ['Chân váy (dải cũ)', 'Chân váy (dải mới)', 'Quần (dải mới)'];
    const table = document.getElementById('summaryTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
  
    let tongDoanhSo = 0;
    let tongTraffic = 0;
    let tongKhach = 0;
  
    // Tính tổng trước
    danhMucs.forEach((danhMuc) => {
      const dtkh = doanhThuTheoKhachHang[danhMuc] || 0;
      const views = summary[danhMuc].views;
      const revenue = summary[danhMuc].revenue;
      const khach = Math.round(revenue / dtkh);
  
      tongDoanhSo += revenue;
      tongTraffic += views;
      tongKhach += khach;
    });
  
    // Tính sau hoàn huỷ tổng từ ô nhập tay
    const afterInputId = 'after-input-Tổng';
    const afterValue = summary['Tổng']?.after || Math.round(tongDoanhSo * 0.97);
    summary['Tổng'] = summary['Tổng'] || {};
    summary['Tổng'].after = afterValue;
  
    const hoanHuyTong = tongDoanhSo > 0
      ? (((tongDoanhSo - afterValue) / tongDoanhSo) * 100).toFixed(2)
      : '0.00';
  
    // Hiển thị từng dải
    danhMucs.forEach((danhMuc) => {
      const dtkh = doanhThuTheoKhachHang[danhMuc] || 0;
      const views = summary[danhMuc].views;
      const revenue = summary[danhMuc].revenue;
      const khach = Math.round(revenue / dtkh);
      const chuyenDoi = views > 0 ? (khach / views * 100).toFixed(2) + ' %' : '0 %';
  
      const after = revenue * (1 - hoanHuyTong / 100);
      summary[danhMuc].after = after;
  
      const doanhSoMoiKH = dtkh.toLocaleString('vi-VN') + ' đ';
  
      const groupRow = document.createElement('tr');
      groupRow.className = 'highlight-group';
      groupRow.innerHTML = `<td colspan="2">${danhMuc}</td>`;
      tbody.appendChild(groupRow);
  
      const rows = [
        ['Doanh số', revenue.toLocaleString('vi-VN') + ' đ'],
        ['Traffic', views],
        ['Tỉ lệ chuyển đổi (%)', chuyenDoi],
        ['Số khách hàng', khach],
        ['Doanh số mỗi khách hàng', doanhSoMoiKH],
        ['Tỷ lệ hoàn huỷ (%)', hoanHuyTong + ' %'],
        ['Doanh số sau hoàn huỷ', after.toLocaleString('vi-VN') + ' đ'],
      ];
  
      rows.forEach(([label, value]) => {
        const tr = document.createElement('tr');
        tr.className = label.includes('Tỉ lệ') || label.includes('Traffic') ? 'highlight-sub' : '';
        tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
        tbody.appendChild(tr);
      });
    });
  
    // Tính tổng và hiển thị dòng Tổng
    const tongChuyenDoi = tongTraffic > 0 ? (tongKhach / tongTraffic * 100).toFixed(2) + ' %' : '0 %';
    const doanhSoMoiKH_Tong = tongKhach > 0 ? (tongDoanhSo / tongKhach).toLocaleString('vi-VN') + ' đ' : '0 đ';
  
    const tongGroup = document.createElement('tr');
    tongGroup.className = 'highlight-group';
    tongGroup.innerHTML = `<td colspan="2">Tổng</td>`;
    tbody.appendChild(tongGroup);
  
    const tongRows = [
      ['Doanh số', tongDoanhSo.toLocaleString('vi-VN') + ' đ'],
      ['Traffic', tongTraffic],
      ['Tỉ lệ chuyển đổi (%)', tongChuyenDoi],
      ['Số khách hàng', tongKhach],
      ['Doanh số mỗi khách hàng', doanhSoMoiKH_Tong],
      ['Tỷ lệ hoàn huỷ (%)', hoanHuyTong + ' %'],
      ['Doanh số sau hoàn huỷ', `<input type="number" id="${afterInputId}" value="${afterValue}" data-danhmuc="Tổng" style="width: 120px;">`],
    ];
  
    tongRows.forEach(([label, value]) => {
      const tr = document.createElement('tr');
      tr.className = label.includes('Tỉ lệ') || label.includes('Traffic') ? 'highlight-sub' : '';
      tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
      tbody.appendChild(tr);
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
    }
  }
  
