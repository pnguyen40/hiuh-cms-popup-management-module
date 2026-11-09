# Bàn giao Popup & Màn hình chờ v1.2.0

## Mở bản thử

Mở index.html bằng Chrome/Edge, hoặc chạy máy chủ tĩnh tại thư mục này. Không cần npm hoặc API.

Trong workspace, bản thử đang phục vụ tại http://127.0.0.1:8762.

## Phạm vi

- Dải menu CMS đầu danh sách giữ như v1.0: Bài viết & Tin tức, Tag tin tức, Góc báo chí, Banner & Quảng cáo, Quản lý Popup. Quyền xem các tab giữ theo vai trò của v1.0.
- Dải hiệu lực hiển thị thumbnail từ đúng record đang hoạt động: Web lấy ảnh ngang; Mobile/Kiosk lấy ảnh dọc; Dr App lấy biến thể đã cấu hình. Ảnh hiển thị toàn bộ bằng contain; nền tảng chưa có nội dung và ảnh lỗi có trạng thái thay thế rõ ràng.
- Kế thừa prototype v1.0.0 và Mini-BRD v1.1.0; không ghi đè hai bản cũ.
- Checkbox chọn Web, Mobile (app bệnh nhân), Kiosk rảnh và Dr App.
- Tab danh sách là bộ lọc; tab chi tiết cấu hình nền tảng và xem trước.
- Một record dùng một lịch, một trạng thái, nội dung chung. Không xuất bản/gỡ riêng từng nền tảng.
- Sao chép thành Nháp: ID mới, timeline trống, không liên kết sửa ngược với nguồn.
- Ảnh ngang/dọc không khóa tỷ lệ. Mobile/Kiosk cần ảnh dọc. Dr App chọn biến thể ảnh.
- Kiosk-only không bắt CTA. Kiosk đang sử dụng không bị nội dung chen ngang.

## Tác động thay thế cần hiểu đúng

Nếu A chạy Web+Kiosk và B chỉ Web, xuất bản B chuyển toàn bộ A về Nháp, bao gồm Kiosk. Đây là hệ quả của trạng thái chung, không có gỡ riêng từng nền tảng. CMS liệt kê record/nền tảng bị tác động trước khi xuất bản.

Muốn từng kênh vận hành riêng: sao chép/tạo record độc lập rồi chọn nền tảng và timeline riêng cho từng record.

## Kịch bản để duyệt

1. Mở POP-006, xuất bản: bị chặn do thiếu ảnh dọc. Chọn ảnh dọc rồi thử các tab.
2. Chọn thêm Kiosk: xem trước đổi sang màn hình chờ, không có nút đóng Popup.
3. Xuất bản record nhiều nền tảng: kiểm tra cùng ID/trạng thái ở các tab danh sách.
4. Menu record → Sao chép thành bản nháp: ID mới, trạng thái Nháp, lịch rỗng.
5. Mở Trải nghiệm Kiosk → Bắt đầu → Kết thúc phiên. Cùng nội dung được phép hiện lại.
6. Bật Mô phỏng ảnh lỗi: Kiosk vẫn có màn hình mặc định và Bắt đầu.
7. Mở Trải nghiệm Mobile → Đóng → Phiên mới: Popup không hiện lại. Người xem mới đặt lại dữ liệu thử của nền tảng đó.
8. Kịch bản thử → đồng hồ 12/11/2026 08:00: POP-005 thay nội dung ở Web/Mobile/Kiosk.
9. Thử vai Marketing, vai không được phép, lỗi lưu và xung đột cập nhật.

## Các lựa chọn còn là đề xuất

Đối chiếu Mục 9.3 của Mini-BRD v1.2.0:

- Contain để giữ toàn ảnh; chưa chốt cover/contain production theo từng client.
- App mở Popup tại màn hình chính sau 1 giây, một lần/phiên, lưu vết đóng riêng nền tảng.
- Route app trong dropdown là minh họa; không phải route tích hợp thật.
- Dr App chọn ảnh ngang/dọc thủ công; không tự đổi theo xoay thiết bị.
- Web hỗ trợ từ 1024 px; Web mobile không nằm trong phạm vi mới.
- UTC+7; chặn cùng mốc bắt đầu khi giao nền tảng; vẫn cho phép khoảng lịch giao nhau.
- Timeout rảnh Kiosk, offline/cache và SLA đồng bộ cần đặc tả production.

## Giới hạn

Prototype chỉ dùng localStorage, sessionStorage và đồng hồ mô phỏng. Không chứng minh phân quyền backend, giao dịch phân tán, đăng nhập, đồng bộ đa thiết bị hoặc kết nối app thật. Ảnh dọc SVG là tài sản chữ minh họa; ảnh ngang và font kế thừa v1.0.0, nguồn ở assets/sources.json.

requirements-deslop.md và Notion chưa được cập nhật trong lượt này.

## Kiểm chứng

- Chạy: node tests/state.test.cjs — 18 kịch bản trạng thái.
- tests/browser-check.js — 29 kiểm tra DOM/tương tác bằng agent-browser trên trình duyệt thật.
- Ảnh chụp desktop 1440 px và mobile 390 px trong evidence/.
- Báo cáo kiểm chứng và tự rà soát giao diện: evidence/REVIEW.md.
- Tự thực hiện và tự rà soát theo yêu cầu không dùng sub-agent.

## Cấu trúc

- state.js: dữ liệu, validation, thay thế, lịch, sao chép.
- ui.js: khung CMS, bảng, tab, Popup/màn hình chờ dùng chung.
- editor.js: biên tập, media, xem trước, lưu.
- clients.js: trải nghiệm Web/Mobile/Kiosk/Dr App và vết đóng.
- main.js: định tuyến, sự kiện và bảng kịch bản thử.
- styles.css: CSS kế thừa; platforms.css: phần mở rộng v1.2.0.
