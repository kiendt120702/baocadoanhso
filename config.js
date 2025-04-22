let resultData = [];

const doanhThuTheoKhachHang = {
  'Chân váy (dải cũ)': 130000,
  'Chân váy (dải mới)': 129000,
  'Quần (dải mới)': 159000,
};

function getDanhMuc(name) {
  const match = name.match(/\b(K[ABC])(\d{2})\b/);
  if (!match) return 'Không xác định';

  const type = match[1];
  const num = parseInt(match[2], 10);

  if (type === 'KA') {
    if (num >= 1 && num <= 17) return 'Chân váy (dải cũ)';
    if (num >= 18 && num <= 99) return 'Chân váy (dải mới)';
  }
  if (type === 'KB') {
    if (num >= 1 && num <= 24) return 'Chân váy (dải cũ)';
    if (num >= 25 && num <= 99) return 'Chân váy (dải mới)';
  }
  if (type === 'KC') {
    if (num >= 1 && num <= 6) return 'Quần (dải cũ)';
    if (num >= 7 && num <= 99) return 'Quần (dải mới)';
  }

  return 'Không xác định';
}
