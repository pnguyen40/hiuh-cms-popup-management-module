disposition: ship

Phạm vi: prototype HTML và các luồng cục bộ; không phải nghiệm thu hệ thống thật. Tự kiểm tra trong chat chính theo yêu cầu người dùng không dùng sub-agent. Không có reviewer độc lập.

## persistence

Đạt: PRODUCT.md, DESIGN.md, HANDOFF.md và .impeccable/design.json nằm trong thư mục artifact, không sửa quy tắc thiết kế chung của workspace. Nguồn nghiệp vụ được giữ nguyên. Ảnh tham chiếu và font có nguồn tại assets/sources.json.

## fidelity

| Thành phần | Kết quả | Căn cứ |
|---|---|---|
| TYPE | match | Lexend + Plus Jakarta Sans, đã đọc computed style của CMS và kiểm tra font tải thành công |
| MATERIAL | match | Ảnh tham chiếu thật từ BRD, không thay bằng hình vẽ; icon SVG thống nhất |
| GROUND | match | Nền #f6f8fd, bề mặt trắng, xanh #0052d7 khớp CMS |
| Thanh bên và tab | adaptation | Giữ khung CMS; Marketing/Operator chỉ có tab Popup theo RBAC |
| Bảng và trạng thái | adaptation | Giữ kiểu bảng, tách hai loại trạng thái, thêm nội dung/lịch cần cho Popup |
| Form | adaptation | Trang hai cột thay dialog hẹp của Banner để nhập tám trường và xem trước |
| Ảnh | match | Đo ảnh trong editor và preview đều có tỷ lệ 1.5, object-fit: cover |
| Website | adaptation | Trang nền mô phỏng được ghi nhãn, chỉ dùng để kiểm tra hành vi Popup |
| Mobile CMS | adaptation | Thu gọn sidebar, bảng cuộn riêng; không tràn trang tại 390 px |

## ceiling

Đạt mức prototype để duyệt và bàn giao cho dev. Giao diện không thêm thống kê, duyệt, ảnh mobile hoặc xóa bản ghi. Các biến thể lỗi, empty, loading, phân quyền có trong bảng kịch bản thử. Các giá trị chưa chốt nằm trong HANDOFF.md.

## material_fixes

Đã xử lý và kiểm tra lại:

1. Caption/nhãn ẩn trong bảng gây root scrollWidth 902 px trên viewport 390 px → đặt containing block tại vùng cuộn. Kiểm tra lại root scrollWidth = 390 px.
2. Tab Popup bị khuất trên mobile → tự đưa tab được chọn vào vùng nhìn thấy.
3. Preview thu nhỏ có nút trùng trong thứ tự focus → dùng inert và aria-hidden.
4. Định dạng ngày giờ không tách được ở locale thực tế → định dạng riêng ngày và giờ.
5. Đối chiếu xung đột phải dùng bản lưu mới nhất → thêm refresh và kiểm chứng thay version thực.
6. Thông báo trong native dialog cần nằm ở top layer → hiển thị phản hồi ngay trong dialog.

## keep

Giữ hệ nhận diện CMS, hai loại trạng thái riêng, ảnh 3:2 và xuất bản không có xác nhận phụ.

## Rà soát cảnh báo hook sau bàn giao

- Ba cảnh báo `overused-font` trong styles.css: giữ Plus Jakarta Sans vì đã xác minh đây là font tiêu đề của CMS tham chiếu. Đã lưu ngoại lệ đúng giá trị font, chỉ áp dụng file styles.css này.
- Cảnh báo `dark-glow` trong index.html: cảnh báo nhầm. Detector mô tả “dark page”, nhưng computed background của body là rgb(246,248,253), các bề mặt có bóng là trắng; các bóng có độ lệch dọc 2–20 px, không phải halo không độ lệch. Đã lưu ngoại lệ riêng rule này cho index.html.
- Các ngoại lệ được thêm bằng lệnh `impeccable hooks ignore-value` vào `.impeccable/config.json` của workspace; không tắt rule toàn dự án hoặc bỏ qua toàn file. Không thay giao diện chỉ để qua detector.
- Các gợi ý mức advisory về token màu, cỡ chữ và bán kính (gồm `design-system-radius: 10px`) giữ nguyên, không sửa hoặc ẩn ngoài phạm vi bốn cảnh báo trên.
