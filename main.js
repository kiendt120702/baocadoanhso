
document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const inputExcel = document.getElementById('inputExcel');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const processButton = document.getElementById('processButton');
  const uploadButton = document.querySelector('.upload-button');
  const loading = document.getElementById('loading');
  const resultsContainer = document.getElementById('resultsContainer');
  
  let fileSelected = false;
  
  // Xử lý khi click vào nút tải lên
  uploadButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện click lan đến dropZone
    inputExcel.click();
  });
  
  // Xử lý khi click vào khu vực drop
  dropZone.addEventListener('click', function(e) {
    if (e.target === dropZone || !e.target.classList.contains('upload-button')) {
      inputExcel.click();
    }
  });
  
  // Xử lý khi kéo file vào khu vực drop
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.style.backgroundColor = '#e9f0fd';
    dropZone.style.borderColor = '#4088f4';
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f7faff';
    dropZone.style.borderColor = '#c3d7f9';
    dropZone.classList.remove('dragover');
  });
  
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f7faff';
    dropZone.style.borderColor = '#c3d7f9';
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        inputExcel.files = e.dataTransfer.files;
        displayFileInfo(file);
      } else {
        showNotification('error', 'Vui lòng chọn file Excel (.xlsx, .xls)');
      }
    }
  });
  
  // Xử lý khi chọn file
  inputExcel.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        displayFileInfo(file);
        fileSelected = true;
      } else {
        showNotification('error', 'Vui lòng chọn file Excel (.xlsx, .xls)');
      }
    }
  });
  
  // Xử lý khi nhấn nút phân tích
  processButton.addEventListener('click', function() {
    if (!inputExcel.files || inputExcel.files.length === 0) {
      showNotification('warning', 'Vui lòng chọn file Excel trước khi phân tích');
      return;
    }
    
    fileInfo.style.display = 'none';
    loading.style.display = 'block';
    
    // Thêm độ trễ nhỏ để hiển thị animation loading
    setTimeout(() => {
      processExcelFile(inputExcel.files[0]);
    }, 800);
  });
  
  function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileInfo.classList.add('active');
    dropZone.style.display = 'none';
    
    // Hiệu ứng nhẹ khi file được chọn
    fileInfo.style.animation = 'none';
    setTimeout(() => {
      fileInfo.style.animation = 'fadeIn 0.5s ease-in-out';
    }, 10);
  }
  
  function processExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        
        if (json.length === 0) {
          showNotification('error', 'File Excel không có dữ liệu hoặc định dạng không đúng');
          loading.style.display = 'none';
          fileInfo.style.display = 'block';
          return;
        }
    
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
    
        loading.style.display = 'none';
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('active');
        document.getElementById('summaryTable').style.display = 'table';
        document.getElementById('summaryTable').classList.add('active');
        document.getElementById('exportBtn').style.display = 'inline-block';
        document.getElementById('exportBtn').classList.add('active');
        
        // Scroll to results
        setTimeout(() => {
          resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        
        // Reset fileSelected để cho phép chọn file mới nếu cần
        fileSelected = false;
        
        showNotification('success', 'Phân tích dữ liệu thành công!');
      } catch (error) {
        console.error('Lỗi khi xử lý file Excel:', error);
        showNotification('error', 'Có lỗi xảy ra khi xử lý file Excel. Vui lòng kiểm tra lại định dạng file.');
        loading.style.display = 'none';
        fileInfo.style.display = 'block';
      }
    };
    
    reader.onerror = function() {
      showNotification('error', 'Không thể đọc file. Vui lòng thử lại.');
      loading.style.display = 'none';
      fileInfo.style.display = 'block';
    };
  
    reader.readAsArrayBuffer(file);
  }
  
  // Nút xuất dữ liệu
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      showNotification('info', 'Chức năng xuất dữ liệu đang được phát triển');
    });
  }
  
  // Hàm hiển thị thông báo
  function showNotification(type, message) {
    // Kiểm tra và xóa thông báo cũ
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Tạo thông báo mới
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Biểu tượng theo loại thông báo
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    if (type === 'info') icon = 'ℹ️';
    
    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Hiệu ứng hiển thị
    setTimeout(() => {
      notification.classList.add('show');
      
      // Tự động ẩn sau 4 giây
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    }, 10);
  }
});

function exportSummaryTableToExcel() {
  const table = document.getElementById('summaryTable');
  if (!table) return;

  // Dùng SheetJS tạo workbook từ bảng HTML
  const wb = XLSX.utils.table_to_book(table, { sheet: "Tổng hợp" });

  // Ghi file Excel
  XLSX.writeFile(wb, 'ket-qua-phan-tich.xlsx');
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', function() {
    exportSummaryTableToExcel();
  });
}
