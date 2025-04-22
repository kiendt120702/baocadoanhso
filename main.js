document.getElementById('inputExcel').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    document.getElementById('loading').style.display = 'block';
  
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
  
      const summary = {
        'Tổng': { views: 0, revenue: 0 },
        'Chân váy (dải cũ)': { views: 0, revenue: 0 },
        'Chân váy (dải mới)': { views: 0, revenue: 0 },
        'Quần (dải mới)': { views: 0, revenue: 0 },
      };
  
      const categoryData = {
        'Chân váy (dải cũ)': [],
        'Chân váy (dải mới)': [],
        'Quần (dải mới)': []
      };
  
      json.forEach(row => {
        const name = row['Sản phẩm'];
        const views = parseInt(row['Lượt truy cập sản phẩm']) || 0;
        const revenueRaw = row['Doanh số (Đơn đã xác nhận) (VND)'];
  
        let revenue = 0;
        if (typeof revenueRaw === 'string') {
          revenue = Number(revenueRaw.replace(/\./g, '').replace(',', '.'));
        } else if (!isNaN(revenueRaw)) {
          revenue = revenueRaw;
        }
  
        const danhMuc = getDanhMuc(name);
  
        if (summary[danhMuc]) {
          summary[danhMuc].views += views;
          summary[danhMuc].revenue += revenue;
        }
  
        if (categoryData[danhMuc]) {
          categoryData[danhMuc].push({ name, revenue, views });
        }
  
        summary['Tổng'].views += views;
        summary['Tổng'].revenue += revenue;
      });
  
      renderSummary(summary);
      renderCategoryTables(categoryData);
  
      document.getElementById('loading').style.display = 'none';
      document.getElementById('summaryTable').style.display = 'table';
      document.getElementById('exportBtn').style.display = 'inline-block';
    };
  
    reader.readAsArrayBuffer(file);
  });
  
