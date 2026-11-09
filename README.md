# HIUH CMS Popup Management — v1.0.0

Prototype tương tác để bàn giao module Quản lý Popup cho dev.

## Mở bản thử

- Mở `popup-design-v1.0.0-standalone.html` trực tiếp bằng Chrome hoặc Edge. CSS, JavaScript, font và ảnh đã được nhúng trong file.
- Để phát triển bản chia module, chạy từ thư mục repo:

```sh
python3 -m http.server 8760 --bind 127.0.0.1
```

Sau đó mở http://127.0.0.1:8760/.

## Nội dung

- Danh sách, tìm kiếm, bộ lọc, tạo/sửa, lưu nháp, xuất bản, hẹn lịch và xem trước Popup.
- Mô phỏng Website, ghi nhớ đóng, phân quyền và tình huống lỗi qua **Kịch bản thử**.
- Dữ liệu mẫu lưu trong trình duyệt; prototype không kết nối API CMS.

## Mã nguồn và bàn giao

- `state.js`: dữ liệu, validation, vòng đời và đồng hồ mô phỏng.
- `ui.js`, `editor.js`, `website.js`, `main.js`: giao diện và tương tác.
- `styles.css`, `assets/`: giao diện, font, giấy phép và ảnh.
- `HANDOFF.md`, `PRODUCT.md`, `DESIGN.md`: phạm vi, quy tắc và các điểm cần chốt.
- `evidence/`: ảnh và báo cáo kiểm chứng bản gốc.

Các đường dẫn workspace và cổng máy chủ trong tài liệu bàn giao gốc là thông tin lịch sử; dùng hướng dẫn mở ở README này cho repo mới.
