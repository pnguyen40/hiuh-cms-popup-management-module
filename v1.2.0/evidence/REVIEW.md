# Kiểm chứng v1.2.0

Ngày: 09/11/2026. Tự thực hiện kiểm tra, không dùng sub-agent theo yêu cầu người dùng.

## Kết quả

- 18 kịch bản state qua Node VM: đạt.
- 29 kiểm tra tương tác trên Chromium qua agent-browser: đạt ở lần chạy cuối.
- Console JavaScript không ghi nhận lỗi trong các luồng được kiểm tra.
- Desktop 1440 px và mobile 390 px: bảng cuộn trong vùng riêng; form không làm tràn trang (scrollWidth 390, viewport 390).
- 37 file của prototype v1.0.0 và Mini-BRD v1.1.0 giữ nguyên SHA-256 so với đầu lượt.
- 25 BR, 27 AC, 7 BUC trong Mini-BRD mới. Liên kết local của phần hiện hành hợp lệ; phụ lục phỏng vấn nguồn được giữ nguyên.

## Rà soát giao diện

disposition: ship — phạm vi prototype cục bộ được kiểm tra, không phải chứng nhận production.

- persistence: có PRODUCT.md, DESIGN.md, metadata thiết kế và nguồn tài sản.
- fidelity: giữ màu/font/sidebar/bảng/form gốc; mở rộng checkbox, tab, ảnh dọc và màn hình chờ đúng phạm vi mới.
- ceiling: giao diện quản trị ưu tiên thao tác; lịch/trạng thái chung được nêu ở form và danh sách.
- material_fixes: đã đổi bóng màu kế thừa sang bóng trung tính; không tắt hoặc bỏ qua cảnh báo. Đã phục hồi nhãn nút Tạo nội dung ở mobile. Đã sửa thông báo CTA bị callback tải trang ghi đè, chạy lại 29 kiểm tra thành công.
- keep: một record có một lịch và một trạng thái; Kiosk không nhận hành vi đóng Popup lâu dài.

## Bằng chứng

- 01-list-desktop.png: danh sách desktop.
- 02-validation.png: lỗi thiếu ảnh dọc, record chưa xuất bản.
- 03-editor-desktop.png: form đa nền tảng và timeline chung.
- 04-list-mobile.png: danh sách tại 390 px.
- 05-editor-mobile.png: form một cột tại 390 px.
- 06-kiosk-idle.png: màn hình chờ Kiosk, có nút Bắt đầu.
- 07-patient-app.png: Popup app bệnh nhân dùng ảnh dọc.

## Giới hạn

Không kiểm chứng backend, app native, đồng bộ tài khoản/thiết bị, offline/cache production. Trigger/tần suất app, route thật, chính sách contain/cover và thời gian idle Kiosk vẫn là các DETAIL cần chốt trong Mini-BRD.
## Cập nhật menu CMS và thumbnail — 09/11/2026

- Khôi phục dải 5 mục CMS như v1.0; giữ quyền tab theo vai trò. Mục Quản lý Popup nhìn thấy được khi tải hoặc resize trên màn hình nhỏ.
- Thumbnail dùng đúng ảnh của nội dung có hiệu lực trên mỗi nền tảng, kể cả biến thể ngang/dọc của Dr App. Có trạng thái chưa có ảnh và không tải được ảnh.
- Đã chạy lại 18 kịch bản state và 29 kiểm tra browser có sẵn bằng agent-browser, phiên riêng `ab-popup-v12-1109`: đạt.
- 16 kiểm tra bổ sung trong browser: menu, ảnh tải thành công, Dr App đổi ảnh, chuyển nháp, kích hoạt lịch, hết hạn, vai Marketing và ảnh lỗi: đạt. Dữ liệu phiên thử đã khôi phục về mẫu.
- Desktop 1440 × 1000 và mobile 390 × 844: không tràn ngang toàn trang; tab đang chọn nằm trong viewport sau resize; không ghi nhận lỗi JavaScript.
- Ảnh mới: `12-overview-thumbnails-desktop.png`, `13-overview-thumbnails-mobile.png`.

