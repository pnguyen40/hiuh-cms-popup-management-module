# Bàn giao thiết kế Popup — v1.0.0

Ngày: 06/11/2026. Đầu ra: prototype HTML có thể bấm thử, theo lựa chọn của người dùng.

## Mở bản thử

- Máy chủ đang chạy: http://127.0.0.1:8766/
- Có thể mở trực tiếp `index.html` bằng Chrome. Giữ nguyên thư mục và các file đi kèm.
- Khi cần khởi chạy lại: `python3 -m http.server 8766 --bind 127.0.0.1 --directory /Users/phongnguyen/workspace/Nexlab/docs-ba/CMS/popup-design-v1.0.0`
- Chọn **Bản thiết kế** hoặc **Kịch bản thử** để đổi vai trò, tiến đồng hồ, xem dữ liệu trống/đang tải/lỗi hoặc tạo lỗi ở lần lưu tiếp theo.
- Dữ liệu chỉ lưu trong localStorage của bản thử. Không dùng dữ liệu đăng nhập, không gọi API CMS, không publish/deploy.

## Nguồn và ưu tiên

1. `/Users/phongnguyen/workspace/Nexlab/docs-ba/CMS/mini-brd-popup/CMS-mini-BRD-POPUP-BUC-v1.0.0.md`: bản cập nhật người dùng chỉ định.
2. `/Users/phongnguyen/workspace/Nexlab/.kiro/specs/cms-popup-mini-brd/requirements-deslop.md`: 14 nhóm US/AC.
3. https://hiuh-ops-dev.nexlab.tech/cms/banners: trực tiếp khảo sát danh sách và form tạo mới, phiên đã đăng nhập qua Chrome Debug. Không ghi dữ liệu lên trang thật. Ảnh tại `evidence/cms-banners-source.png`, `evidence/cms-create-source.png`.

Điểm lệch cần xử lý trước dev: US 11.5 yêu cầu đóng khi đổi sang mobile, trong khi BR-POPUP-15 và DETAIL-POPUP-01 của mini-BRD cập nhật quy định chỉ kiểm tra khung nhìn một lần tại mốc 1.000 ms, không lắng nghe resize/xoay màn hình. Prototype theo mini-BRD cập nhật. Không chỉnh lại hai tài liệu nguồn.

## Màn hình và đường đi

| Màn hình | Đường đi | Nội dung |
|---|---|---|
| Danh sách | `#list` | Popup đang chạy, tìm kiếm, lọc cấu hình/hiển thị, sắp xếp, menu từng dòng |
| Tạo | `#new` | Tám trường nội dung; ảnh mẫu hoặc tải ảnh từ thiết bị; xem trước tức thời |
| Sửa | `#edit/POP-002` | Giữ mã, lưu thay đổi, cảnh báo khi tái xuất bản cùng mã |
| Hẹn lịch | `#edit/POP-003` | Bắt đầu, gỡ tùy chọn, tác động thay thế, khoảng lịch giao nhau |
| Xem trước | Nút Xem trước/Mở rộng | Dialog ảnh 3:2, nhãn nổi, nhóm nội dung, tiêu đề, mô tả, CTA, nút đóng và Để sau |
| Trải nghiệm người xem | `#website` | Trễ 1 giây, trang/khung nhìn, một lần mỗi phiên, ghi nhớ đóng, CTA cùng tab mô phỏng |
| Lỗi và phân quyền | Bản thiết kế | Trống, tải, lỗi kết nối, lỗi lưu, xung đột, thu hồi quyền; giao diện Marketing |

Tên, nội dung chiến dịch, tài khoản Minh Anh và bảy Popup đều là dữ liệu minh họa. Ảnh có nguồn tham chiếu trong BRD; không suy luận danh tính hay tình trạng sức khỏe người trong ảnh.

## Truy vết yêu cầu

| US | Thể hiện trong prototype | Giới hạn |
|---|---|---|
| 1 — Danh sách/nháp | Tạo nháp, giữ Popup đang hoạt động, thông báo lưu lỗi | Dữ liệu trình duyệt |
| 2 — Nội dung | Đúng 8 trường nội dung và 2 trường lịch; không có EN/mobile asset | Nhóm nội dung nhập tự do là đề xuất |
| 3 — Ảnh | Khung 3:2, cover, không chặn vì khác 1200 × 800 | Chấp nhận ảnh trình duyệt đọc được; chưa đặt dung lượng nghiệp vụ |
| 4 — Trạng thái | Nháp/Xuất bản và Ẩn/Đang hiển thị/Hết hạn riêng | Đồng hồ mô phỏng, không có scheduler máy chủ |
| 5 — Sửa | Giữ ID, giữ Xuất bản, giữ vết đóng, xung đột và đối chiếu | Mô phỏng version cục bộ |
| 6 — Validation | Bốn trường bắt buộc; CTA ≤500, /, query, anchor; không HTTP/HTTPS// | Các điều kiện kỹ thuật bổ sung liệt kê dưới |
| 7 — Xuất bản | Thay Popup đang hoạt động, đưa bản cũ về nháp, không xác nhận phụ | Giao dịch trong trạng thái cục bộ |
| 8 — Lịch | Nhiều lịch tương lai giao nhau, tự thay khi tiến đồng hồ, hết hạn không hồi phục | Mốc thời gian được điều khiển trong kịch bản thử |
| 9 — Chuyển nháp | Dừng và hủy lịch, giữ bản ghi | Không có xóa |
| 10 — RBAC | 6 vai cho phép; Marketing/Operator chỉ thấy tab Popup; vai khác bị chặn; thu hồi quyền khi lưu | Không thay cơ chế bảo mật backend |
| 11 — Website | Trang chủ và khung nhìn; không có nền mờ khi không đủ điều kiện | Resize theo BRD mới, cần sửa US 11.5 |
| 12 — Trễ | Timer 1.000 ms sau khi ảnh trang mô phỏng giải mã xong | Sự kiện tải xong thực tế còn chờ chốt |
| 13 — Ghi nhớ | ×, Để sau, nền mờ, Escape; cùng mã giữ vết qua phiên; mã mới độc lập | localStorage/sessionStorage, không đồng bộ tài khoản |
| 14 — CTA | Trang đích mô phỏng đổi cùng tab; giữ vết đã xem, không ghi vết đóng | Không mở website hay dữ liệu thật |

## Đề xuất chưa được chốt nghiệp vụ

Không coi các lựa chọn dưới đây là quyết định đã duyệt:

| Mục mở | Lựa chọn để bấm thử | Cần quyết định |
|---|---|---|
| DETAIL-POPUP-01 | Từ 1024 px là hỗ trợ; 390 px là mobile; kiểm tra cả viewport thực | Ngưỡng thực tế cho website |
| DETAIL-POPUP-02 | UTC+7; từ chối gỡ trước/bằng bắt đầu, bắt đầu hẹn lịch đã qua và trùng chính xác; vẫn cho phép khoảng lịch giao nhau | Múi giờ, lịch quá khứ và xử lý đồng thời ở backend |
| DETAIL-POPUP-03 | Vết đóng localStorage, vết xem sessionStorage | Định nghĩa phiên, đồng bộ người xem, ưu tiên tài khoản/cookie |
| DETAIL-POPUP-04 | Trang mô phỏng chờ ảnh giải mã rồi đếm 1.000 ms | Sự kiện tải xong chuẩn; cập nhật nội dung/gỡ trên trang đang mở |
| DETAIL-POPUP-05 | Nháp có ít nhất một trường; nhóm nhập tự do; không giới hạn ngoài CTA | Mức tối thiểu nháp, danh mục nhóm, định dạng/dung lượng ảnh, giới hạn chuỗi |
| DETAIL-POPUP-06 | Dòng giải thích “Đóng để không hiển thị lại thông báo này”, không thêm checkbox điều kiện | Bố trí cuối cùng và cách mở route riêng theo quyền |

CTA cũng từ chối dấu gạch chéo ngược và ký tự điều khiển/khoảng trắng nguyên dạng; đây là bảo vệ kỹ thuật của prototype, cần chuẩn hóa với schema dev. Query `?`, `&`, `=` và anchor `#` vẫn được chấp nhận.

Thời điểm nhập dùng bộ chọn ngày giờ native nên cách hiển thị AM/PM hoặc 24 giờ phụ thuộc thiết lập trình duyệt. Giá trị lưu được diễn giải theo UTC+7 của bản thử.

## Kiểm chứng đã chạy

Thực hiện bằng agent-browser, phiên riêng `ab-popup-prototype-1106`, trên localhost. Các thay đổi trong lúc thử đã được khôi phục về dữ liệu mẫu.

- Syntax check cả 5 file JavaScript: đạt. Browser không ghi nhận lỗi JavaScript sau các luồng chính.
- Thiếu bốn trường: hiện bốn lỗi, Popup cũ giữ nguyên. CTA HTTPS bị chặn cả lúc lưu nháp; đường dẫn có query/anchor lưu thành công.
- Tạo nháp → xuất bản thay thế → chuyển nháp: đạt, không thêm dialog xác nhận xuất bản.
- Hẹn lịch qua form: đạt. Hai lịch giao nhau cùng tồn tại; đến lịch thay Popup hiện hành; hủy lịch và hết hạn không hồi phục bản cũ.
- Lỗi lưu không thay dữ liệu. Sai version bị chặn; nội dung đang nhập được giữ. Bản đối chiếu và nạp lại lấy đúng dữ liệu cục bộ mới nhất.
- Vai Marketing chỉ thấy tab Popup. Vai ngoài danh sách bị chặn; thu hồi quyền chặn lần lưu tiếp theo.
- Website: sau 1 giây mới hiển thị; không hiển thị ở trang dịch vụ hoặc khung nhìn mobile; một lần trong phiên. Bốn cách đóng đều ghi vết; phiên mới vẫn không hiện lại.
- CTA điều hướng cùng tab mô phỏng, giữ vết xem và không ghi vết đóng.
- Tìm kiếm không kết quả và xóa bộ lọc: đạt.
- Desktop 1440 × 1000, 1280 × 900; CMS mobile 390 × 844: đã xem ảnh thực. Không tràn ngang toàn trang; bảng có vùng cuộn riêng. Đã sửa caption ẩn làm tràn ngang và tab đang chọn bị khuất. Preview thu nhỏ không nhận focus.

Ảnh kiểm chứng nằm trong `evidence/`. Việc kiểm tra do cùng agent thực hiện theo yêu cầu không dùng sub-agent; không phải báo cáo QA độc lập hoặc nghiệm thu backend.

## Cấu trúc bàn giao

- `index.html`: điểm vào.
- `styles.css`: token và responsive.
- `state.js`: dữ liệu, vòng đời, validation, version, đồng hồ.
- `ui.js`: khung CMS, danh sách, bộ lọc, trạng thái và component Popup.
- `editor.js`: form, ảnh, xem trước, lỗi, lưu và đối chiếu.
- `website.js`: mô phỏng hành vi người xem.
- `main.js`: điều hướng và bảng kịch bản thử.
- `DESIGN.md`, `.impeccable/design.json`: thiết kế kế thừa và token.
- `assets/`: font, giấy phép và ảnh tham chiếu có nguồn.

Các chức năng của bảng kịch bản thử, đồng hồ giả lập, đổi vai và khôi phục dữ liệu chỉ phục vụ duyệt thiết kế; không đưa vào phạm vi sản phẩm.
