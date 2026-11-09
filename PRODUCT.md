# Quản lý Popup — HIUH Operation Portal

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Prototype HTML/CSS/JavaScript chạy tại máy; người dùng đã chọn prototype HTML để bấm thử. Không kết nối API hoặc ghi lên CMS thật.

## Users
Super Admin, Operator, Biên tập, Trưởng phòng Marketing, Phó phòng Marketing, Nhân viên Marketing. Cùng quyền tạo, sửa, xuất bản, hẹn lịch và chuyển nháp Popup. Quyền này không cấp quyền các tab CMS khác.

## Product Purpose
Chuẩn bị nhiều chiến dịch và vận hành tối đa một Popup đang hoạt động trên trang chủ Website HIUH.

## Capabilities and Constraints
Tám trường nội dung, hai trường lịch. Chỉ tiếng Việt. Một ảnh 3:2; 1200 × 800 là tham chiếu, ảnh khác tỷ lệ cắt phủ. Bốn trường bắt buộc khi xuất bản: ảnh, tiêu đề, nhãn CTA, đường dẫn CTA. CTA nội bộ tối đa 500 ký tự, nhận query/anchor, không nhận URL tuyệt đối hoặc dạng //.

Nháp/Xuất bản là cấu hình; Ẩn/Đang hiển thị/Hết hạn là trạng thái suy ra. Kích hoạt mới tự chuyển Popup cũ về Nháp, không xác nhận phụ. Nhiều lịch tương lai được phép giao nhau. Không khôi phục Popup cũ khi hết hạn. Không xóa bản ghi, không duyệt, không dịch, không thống kê chiến dịch.

Website chỉ hiển thị ở trang chủ và khung nhìn được hỗ trợ, sau 1.000 ms; mọi thao tác đóng được ghi nhớ theo định danh Popup. CTA không ghi vết đóng. Mini-BRD cập nhật kiểm tra viewport một lần tại mốc 1.000 ms, không theo dõi resize. Điểm lệch với Yêu cầu 11.5 của US phải được bàn giao rõ.

## Brand Commitments
Kế thừa giao diện thực tế https://hiuh-ops-dev.nexlab.tech/cms/banners đã khảo sát bằng agent-browser qua Chrome Debug ngày 06/11/2026.

## Evidence on Hand
- ../mini-brd-popup/CMS-mini-BRD-POPUP-BUC-v1.0.0.md
- ../../../.kiro/specs/cms-popup-mini-brd/requirements-deslop.md (đường dẫn workspace: /Users/phongnguyen/workspace/Nexlab/.kiro/specs/cms-popup-mini-brd/requirements-deslop.md)
- evidence/cms-banners-source.png; evidence/cms-create-source.png
- assets/popup-reference.webp: ảnh tham chiếu đã dẫn trong mini-BRD. Không suy luận danh tính hay tình trạng sức khỏe.

## Product Principles
- Hai loại trạng thái phải dễ phân biệt.
- Tác động thay thế phải được giải thích trước hành động, không thêm xác nhận phụ.
- Sửa một bản ghi giữ nguyên định danh và vết đóng.
- Điểm chưa chốt là đề xuất thiết kế, không phải quy tắc nghiệp vụ đã phê duyệt.

## Open Decisions
DETAIL-POPUP-01..06: breakpoint, múi giờ và xung đột lịch, cơ chế nhận diện người xem, sự kiện tải xong, dung lượng/định dạng ảnh/độ dài chuỗi ngoài CTA/bản nháp rỗng/nhóm nội dung, giao diện lựa chọn không hiển thị lại và quyền tab. Đề xuất của prototype sẽ được ghi riêng trong DESIGN.md.
