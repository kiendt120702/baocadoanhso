function renderCategoryTables(categoryData) {
    const categoryTablesWrapper = document.getElementById('categoryTables');
    categoryTablesWrapper.innerHTML = '';
  
    Object.entries(categoryData).forEach(([danhMuc, items]) => {
      if (items.length === 0) return;
  
      const table = document.createElement('table');
      table.style.marginTop = '40px';
      const caption = document.createElement('caption');
      caption.textContent = `📌 ${danhMuc}`;
      caption.style.fontWeight = 'bold';
      caption.style.padding = '10px';
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
  
      items.forEach(item => {
        totalViews += item.views;
        totalRevenue += item.revenue;
  
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.revenue.toLocaleString('vi-VN')} đ</td>
          <td>${item.views}</td>
        `;
        tbody.appendChild(tr);
      });
  
      const totalRow = document.createElement('tr');
      totalRow.style.fontWeight = 'bold';
      totalRow.style.background = '#f1f1f1';
      totalRow.innerHTML = `
        <td>Tổng</td>
        <td>${totalRevenue.toLocaleString('vi-VN')} đ</td>
        <td>${totalViews}</td>
      `;
      tbody.appendChild(totalRow);
  
      table.appendChild(tbody);
      categoryTablesWrapper.appendChild(table);
    });
  }
  
