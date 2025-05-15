function renderCategoryTables(categoryData) {
  const categoryTablesWrapper = document.getElementById('categoryTables');
  categoryTablesWrapper.innerHTML = '';

  Object.entries(categoryData).forEach(([danhMuc, items]) => {
    if (items.length === 0) return;

    // Sắp xếp theo doanh số giảm dần
    items.sort((a, b) => b.revenue - a.revenue);

    const table = document.createElement('table');
    table.className = 'category-table';
    
    const caption = document.createElement('caption');
    caption.innerHTML = `<i class="category-icon">📊</i> ${danhMuc}`;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Tên sản phẩm</th>
        <th>Doanh số (VND)</th>
        <th>Traffic</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let totalViews = 0;
    let totalRevenue = 0;

    // Thêm các dòng sản phẩm với màu nền xen kẽ
    items.forEach((item, index) => {
      totalViews += item.views;
      totalRevenue += item.revenue;

      const tr = document.createElement('tr');
      
      // Tô màu cho dòng có doanh số cao
      if (item.revenue > totalRevenue * 0.2) {
        tr.className = 'high-revenue';
      }
      
      tr.innerHTML = `
        <td>${item.name}</td>
        <td class="revenue-cell">${item.revenue.toLocaleString('vi-VN')} đ</td>
        <td>${item.views}</td>
      `;
      tbody.appendChild(tr);
    });

    // Thêm dòng tổng cộng
    const totalRow = document.createElement('tr');
    totalRow.className = 'grand-total';
    totalRow.innerHTML = `
      <td>Tổng</td>
      <td class="revenue-cell">${totalRevenue.toLocaleString('vi-VN')} đ</td>
      <td>${totalViews}</td>
    `;
    tbody.appendChild(totalRow);

    table.appendChild(tbody);
    categoryTablesWrapper.appendChild(table);
    
  
  });
}
