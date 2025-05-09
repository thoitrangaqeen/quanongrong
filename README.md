# Trang Web Bán Quần Ống Rộng Kẻ Sọc

Đây là mã nguồn cho trang web bán quần ống rộng kẻ sọc với tính năng Flash Sale và form đặt hàng kết nối với Google Sheets.

## Cấu trúc thư mục

```
shop quần áo/
├── index.html      - Trang chính
├── styles.css      - File CSS
├── script.js       - JavaScript
└── images/         - Thư mục chứa hình ảnh sản phẩm
```

## Tính năng

- Giao diện tối ưu cho điện thoại di động
- Hiệu ứng Flash Sale với đồng hồ đếm ngược 2 giờ
- Hiển thị giá gốc (299k) và giá sale (199k)
- Form đặt hàng kết nối với Google Sheets
- Hiệu ứng động để thu hút người dùng

## Hướng dẫn kết nối Google Sheets

1. Tạo Google Sheets mới
2. Đặt tên cho các cột: Họ tên, Số điện thoại, Địa chỉ, Kích thước, Số lượng, Ghi chú, Tổng tiền, Ngày đặt hàng
3. Mở Google Apps Script bằng cách chọn Extensions > Apps Script
4. Xóa mã mặc định và dán mã sau:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Lấy dữ liệu từ request
  var data = e.parameter;
  
  // Thêm dữ liệu vào sheet
  sheet.appendRow([
    data.fullName,
    data.phone,
    data.address,
    data.size,
    data.quantity,
    data.note,
    data.totalPrice,
    data.orderDate
  ]);
  
  // Trả về kết quả
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Lưu script
6. Nhấp vào "Deploy" > "New deployment"
7. Chọn loại "Web app"
8. Đặt:
   - Execute as: "Me"
   - Who has access: "Anyone"
9. Nhấp "Deploy"
10. Sao chép URL Web App và dán vào biến `scriptURL` trong file script.js

## Hướng dẫn tùy chỉnh

### Thay đổi thông tin sản phẩm

Mở file `index.html` và tìm các phần sau để chỉnh sửa:

- Thay đổi tên sản phẩm: Tìm thẻ `<h2>Quần Ống Rộng Kẻ Sọc Thời Trang</h2>`
- Thay đổi giá: Tìm `.current-price` và `.original-price`
- Thay đổi thông tin chi tiết sản phẩm: Tìm phần `<section class="product-details">`

### Thay đổi hình ảnh

1. Thêm hình ảnh sản phẩm vào thư mục `images/`
2. Cập nhật đường dẫn trong phần `<section class="product-images">`

### Thay đổi thời gian Flash Sale

Mở file `script.js` và tìm dòng:
```javascript
let totalSeconds = 2 * 60 * 60; // 2 giờ
```

Thay đổi số giờ theo nhu cầu.

## Chạy trang web

Mở file `index.html` trong trình duyệt để xem trang web.
