// Cấu hình phân loại sản phẩm
let productCategories = {
  // Cấu hình cho loại KA (Ví dụ: Chân váy)
  "KA": [
    { min: 1, max: 17, category: "Chân váy (dải cũ)" },
    { min: 18, max: 99, category: "Chân váy (dải mới)" }
  ],
  // Cấu hình cho loại KB (Ví dụ: Chân váy loại khác)
  "KB": [
    { min: 1, max: 24, category: "Chân váy (dải cũ)" },
    { min: 25, max: 99, category: "Chân váy (dải mới)" }
  ],
  // Cấu hình cho loại KC (Ví dụ: Quần)
  "KC": [
    { min: 1, max: 6, category: "Quần (dải cũ)" },
    { min: 7, max: 99, category: "Quần (dải mới)" }
  ]
};

let resultData = [];

const doanhThuTheoKhachHang = {
  'Chân váy (dải cũ)': 130000,
  'Chân váy (dải mới)': 129000,
  'Quần (dải mới)': 159000,
};

function getDanhMuc(name) {
  const match = name.match(/\b(K[A-Z])(\d{2})\b/);
  if (!match) return 'Không xác định';

  const type = match[1];
  const num = parseInt(match[2], 10);

  // Kiểm tra nếu loại sản phẩm có trong cấu hình
  if (productCategories[type]) {
    // Tìm danh mục phù hợp dựa trên số
    for (const range of productCategories[type]) {
      if (num >= range.min && num <= range.max) {
        return range.category;
      }
    }
  }

  return 'Không xác định';
}

// Lưu cấu hình vào localStorage để duy trì giữa các phiên
function saveProductCategories() {
  localStorage.setItem('productCategories', JSON.stringify(productCategories));
}

// Tải cấu hình từ localStorage nếu có
function loadProductCategories() {
  const saved = localStorage.getItem('productCategories');
  if (saved) {
    try {
      productCategories = JSON.parse(saved);
    } catch (e) {
      console.error('Lỗi khi tải cấu hình phân loại sản phẩm:', e);
    }
  }
}

// Tải cấu hình khi khởi động
document.addEventListener('DOMContentLoaded', function() {
  loadProductCategories();
});
