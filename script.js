// Đồng hồ đếm ngược Flash Sale
function startCountdown() {
    // Đặt thời gian đếm ngược 2 giờ (đơn vị: giây)
    let totalSeconds = 2 * 60 * 46;
    
    // Lấy các phần tử hiển thị thời gian
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Cập nhật đồng hồ mỗi giây
    const countdownInterval = setInterval(function() {
        // Tính toán giờ, phút, giây
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Cập nhật hiển thị
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Cập nhật đồng hồ đếm ngược trong form đặt hàng
        if (document.getElementById('orderHours')) {
            document.getElementById('orderHours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('orderMinutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('orderSeconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        // Giảm thời gian còn lại
        totalSeconds--;
        
        // Nếu hết thời gian, dừng đếm ngược
        if (totalSeconds < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.flash-sale-container').innerHTML = '<div class="flash-sale-header"><div class="flash-sale-title"><i class="fas fa-clock"></i> Flash Sale đã kết thúc!</div></div>';
        }
    }, 1000);
    
    // Lưu thời gian bắt đầu vào localStorage để duy trì khi tải lại trang
    localStorage.setItem('countdownStartTime', Date.now());
    localStorage.setItem('countdownDuration', 2 * 60 * 60 * 1000);
}

// Khởi tạo đồng hồ đếm ngược khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Bắt đầu đồng hồ đếm ngược
    startCountdown();
    
    // Xử lý nút chọn kích thước
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa lớp active khỏi tất cả các nút
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm lớp active cho nút được chọn
            this.classList.add('active');
            
            // Cập nhật kích thước đã chọn trong form đặt hàng
            const selectedSize = this.getAttribute('data-size');
            document.getElementById('orderSize').value = selectedSize;
        });
    });
    
    // Xử lý nút chọn màu sắc
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa lớp active khỏi tất cả các nút
            colorButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm lớp active cho nút được chọn
            this.classList.add('active');
            
            // Cập nhật màu sắc đã chọn trong form đặt hàng
            const selectedColor = this.getAttribute('data-color');
            document.getElementById('orderColor').value = selectedColor;
        });
    });
    
    // Xử lý nút tăng/giảm số lượng
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const quantityInput = document.getElementById('quantity');
    const orderQuantityInput = document.getElementById('orderQuantity');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const totalPrice = document.getElementById('totalPrice');
    
    // Cập nhật tổng tiền dựa trên số lượng
    function updateTotalPrice() {
        const quantity = parseInt(orderQuantityInput.value);
        const price = 199000; // Giá sản phẩm: 199.000đ
        const total = quantity * price;
        totalPrice.textContent = formatCurrency(total);
    }
    
    // Định dạng số tiền thành chuỗi có dấu phân cách
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
    }
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            value--;
            quantityInput.value = value;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            value++;
            quantityInput.value = value;
        }
    });
    
    // Đồng bộ số lượng giữa phần thông tin sản phẩm và form đặt hàng
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        this.value = value;
        orderQuantityInput.value = value;
        summaryQuantity.textContent = value;
        updateTotalPrice();
    });
    
    orderQuantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        this.value = value;
        quantityInput.value = value;
        summaryQuantity.textContent = value;
        updateTotalPrice();
    });
    
    // Xử lý đổi hình ảnh sản phẩm khi nhấp vào thumbnail
    window.changeImage = function(src, thumbnail) {
        document.getElementById('mainImage').src = src;
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    };
    
    // Xử lý cuộn đến form đặt hàng khi nhấn nút "Mua ngay"
    window.scrollToOrderForm = function() {
        document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Xử lý form đặt hàng và gửi dữ liệu đến Google Sheets
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            size: document.getElementById('orderSize').value,
            color: document.getElementById('orderColor').value,
            quantity: document.getElementById('orderQuantity').value,
            note: document.getElementById('note').value,
            totalPrice: totalPrice.textContent,
            orderDate: new Date().toLocaleString()
        };
        
        // Gửi dữ liệu đến Google Sheets thông qua Google Apps Script
        sendToGoogleSheets(formData);
    });
    
    // Hàm gửi dữ liệu đến Google Sheets
    function sendToGoogleSheets(data) {
        // URL của Google Apps Script Web App
        // CHÚ Ý: Bạn cần thay thế URL này bằng URL của Google Apps Script Web App của bạn
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxEh1Kw_rzz51RR_EVsExqLg5pVNZmMt5Jk-pOL_hb-Cvcxo-b_1e6FIk_t6aE3VUxK/exec';
        
        // Tạo dữ liệu gửi đi
        const formDataToSend = new FormData();
        Object.keys(data).forEach(key => {
            formDataToSend.append(key, data[key]);
        });
        
        // Gửi dữ liệu bằng fetch API
        fetch(scriptURL, {
            method: 'POST',
            body: formDataToSend
        })
        .then(response => {
            if (response.ok) {
                // Hiển thị popup thông báo thành công
                document.getElementById('popup').style.display = 'flex';
                // Reset form
                checkoutForm.reset();
            } else {
                alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại sau!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại sau!');
        });
    }
    
    // Đóng popup khi nhấp vào nút đóng
    document.querySelector('.close-popup').addEventListener('click', function() {
        document.getElementById('popup').style.display = 'none';
    });
    
    // Khởi tạo giá trị ban đầu cho tổng tiền
    updateTotalPrice();
});

/*
 * HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS VÀ GOOGLE APPS SCRIPT
 * 
 * 1. Tạo Google Sheets mới
 * 2. Đặt tên cho các cột: Họ tên, Số điện thoại, Địa chỉ, Kích thước, Màu sắc, Số lượng, Ghi chú, Tổng tiền, Ngày đặt hàng
 * 3. Mở Google Apps Script bằng cách chọn Extensions > Apps Script
 * 4. Xóa mã mặc định và dán mã sau:
 *
 * function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Lấy dữ liệu từ request
  var data = e.parameter;
  
  // Thêm dữ liệu vào sheet
  sheet.appendRow([
    data.fullName,
    data.phone,
    data.address,
    data.size,
    data.color,
    data.quantity,
    data.note,
    data.totalPrice,
    data.orderDate
  ]);
  
  // Trả về kết quả
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
 *
 * 5. Lưu script
 * 6. Nhấp vào "Deploy" > "New deployment"
 * 7. Chọn loại "Web app"
 * 8. Đặt:
    - Execute as: "Me"
    - Who has access: "Anyone"
 *    - Who has access: "Anyone"
 * 9. Nhấp "Deploy"
 * 10. Sao chép URL Web App và dán vào biến scriptURL trong file script.js
 */
