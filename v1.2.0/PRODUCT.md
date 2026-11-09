# Popup & Màn hình chờ — v1.2.0

## Platform
web

## Stack
Prototype HTML/CSS/JavaScript cục bộ, kế thừa popup-design-v1.0.0. Không có API production. Lưu riêng bằng khóa hiuh-popup-design-v1.2.0.

## Users
Super Admin, Operator, Biên tập và ba vai Marketing. Một nhóm quyền cho bốn nền tảng.

## Product Purpose
Biên tập một nội dung và chọn Web, Mobile (app bệnh nhân), Kiosk (màn hình chờ khi rảnh), Dr App. Một record có một timeline và trạng thái chung; cần lịch khác thì sao chép/tạo record độc lập.

## Capabilities and Constraints
Checkbox chọn đích; tab danh sách lọc cùng ID; tab chi tiết cấu hình ảnh/CTA và xem trước. Hai biến thể ảnh, không cố định tỷ lệ. Mobile/Kiosk bắt buộc ảnh dọc. Dr App chọn ảnh ngang/dọc. Kiosk-only không bắt CTA.

Xuất bản kiểm tra toàn record, không thành công một phần. Thay thế các record giao nền tảng chuyển toàn bộ record cũ về Nháp. Không khôi phục bản cũ. Không sửa tập nền tảng khi Xuất bản.

Kiosk rảnh hiển thị nội dung hoặc màn hình mặc định; Bắt đầu mở phiên; kết thúc quay về rảnh; không lưu vết đóng lâu dài. Web giữ hành vi trang chủ và ghi nhớ đóng; app có chính sách đề xuất được ghi rõ.

## Brand Commitments
Giữ hệ nhận diện, token, font, sidebar, bảng, form và trạng thái của prototype v1.0.0. Mode Operate. Phần mới ưu tiên phạm vi thao tác và lịch chung rõ ràng.

## Evidence on Hand
- ../mini-brd-popup/CMS-mini-BRD-POPUP-BUC-v1.2.0.md
- ../popup-design-v1.0.0/DESIGN.md và evidence/
- assets/sources.json

## Open Decisions
Các DETAIL ở Mini-BRD Mục 9.3: trigger/tần suất app, route thật, độ trễ đồng bộ, offline Kiosk, ngưỡng Web, giới hạn ảnh, contain/cover. Giá trị trong prototype được ghi là đề xuất, không phải tích hợp thật.
