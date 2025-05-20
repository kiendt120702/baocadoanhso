// Cấu hình phân loại sản phẩm
let productCategories = {
  "KA": [
    { min: 1, max: 17, category: "Chân váy (dải cũ)" },
    { min: 18, max: 99, category: "Chân váy (dải mới)" }
  ],
  "KB": [
    { min: 1, max: 24, category: "Chân váy (dải cũ)" },
    { min: 25, max: 99, category: "Chân váy (dải mới)" }
  ],
  "KC": [
    { min: 1, max: 6, category: "Chân váy (dải cũ)" }, // Đã thay đổi từ "Quần (dải cũ)" sang "Chân váy (dải cũ)"
    { min: 7, max: 99, category: "Quần (dải mới)" }
  ]
};

let resultData = [];

const doanhThuTheoKhachHang = {
  'Chân váy (dải cũ)': 130000,
  'Chân váy (dải mới)': 129000,
  'Quần (dải mới)': 159000,
  // 'Quần (dải cũ)' đã bị xóa vì đã gộp vào 'Chân váy (dải cũ)'
};

function getDanhMuc(name) {
  if (!name || typeof name !== 'string') return 'Không xác định';

  // Chuẩn hóa chuỗi: loại bỏ [, ], -, dấu cách và chuyển thành chữ hoa
  const cleanedName = name
    .replace(/[\[\]\-\s]+/g, '')
    .toUpperCase();

  // Sửa regex: bỏ \b để khớp trong chuỗi dài, vẫn tìm K[A-Z]\d{2}
  const match = cleanedName.match(/(K[A-Z])(\d{2})/);
  if (!match) return 'Không xác định';

  const type = match[1]; // Ví dụ: KC
  const num = parseInt(match[2], 10); // Ví dụ: 02

  // Kiểm tra nếu loại sản phẩm có trong cấu hình
  if (productCategories[type]) {
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
