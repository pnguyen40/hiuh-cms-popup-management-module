---
name: HIUH CMS Popup
description: Thiết kế module Popup kế thừa HIUH Operation Portal
colors:
  primary: "#0052d7"
  primary-hover: "#0045b5"
  primary-soft: "#edf3ff"
  heading: "#16205c"
  text: "#3b4177"
  muted: "#656d93"
  background: "#f6f8fd"
  surface: "#ffffff"
  border: "#e1e6f2"
  border-control: "#cbd3e6"
  success: "#168046"
  success-soft: "#dcfce7"
  warning: "#8b5307"
  warning-soft: "#fff5d3"
  danger: "#c33535"
  danger-soft: "#fff1f1"
typography:
  page-title:
    fontFamily: "Plus Jakarta Sans, Lexend, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
  control:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  control: "8px"
  panel: "12px"
  dialog: "14px"
spacing:
  tight: "8px"
  control: "12px"
  group: "16px"
  section: "24px"
  canvas: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
    height: "38px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
---

# Design System: HIUH CMS Popup & Màn hình chờ

## Overview

Kế thừa hệ nhận diện của prototype v1.0.0. Phần mở rộng phục vụ biên tập đa nền tảng trong cùng một record. Skill impeccable được dùng để giữ bố cục quản trị nhất quán, làm rõ phạm vi ảnh hưởng và kiểm tra giao diện responsive.

## Colors

Giữ token màu ở frontmatter. Xanh chính dùng cho hành động và tab được chọn; trạng thái có cả chữ và màu. Dùng nền trắng, nền trang nhạt và viền để tách vùng công việc.

## Typography

Lexend cho dữ liệu, Plus Jakarta Sans cho tiêu đề; font và giấy phép lưu cục bộ. Nội dung 13 px; form mới 12 px; tiêu đề trang 21–22 px. Văn bản dài xuống dòng; không cắt nội dung đang biên tập.

## Layout

Thanh bên 248 px, header 70 px. Danh sách giữ dải menu CMS của v1.0 phía trên tiêu đề, sau đó là dải hiệu lực bốn nền tảng, tab lọc, tìm kiếm và bảng. Menu cuộn ngang khi thiếu chỗ và đưa mục Quản lý Popup vào vùng nhìn thấy. Dải hiệu lực có thumbnail cao 132 px (110 px ở màn hình nhỏ), dùng contain để thấy toàn ảnh đúng biến thể của từng nền tảng. Form hai cột trên desktop, cột nhập và xem trước; dưới 1060 px về một cột. Dải nền tảng về hai cột dưới 1100 px. Bảng cuộn ngang trong vùng riêng, không làm tràn toàn trang.

## Elevation & Depth

Nền và viền phân tách vùng tĩnh. Bóng trung tính có độ lệch dùng cho dialog/menu/Popup. Các bóng xanh kế thừa được đổi sang bóng đen cùng độ trong suốt để bỏ hiệu ứng sáng màu; không thêm glow.

## Shapes

Điều khiển bo 8 px, vùng form bo 12 px, Popup bo 14 px. Ảnh truyền thông dùng object-fit: contain; chiều cao khung xem trước do client quy định, không biến thành tỷ lệ ảnh upload bắt buộc.

## Components

- Checkbox: chọn tập nền tảng; khóa khi record Xuất bản. Nhãn giải thích chuyển Nháp trước khi đổi tập.
- Tab danh sách: lọc cùng tập record, có số lượng; không tạo record riêng.
- Tab chi tiết: chỉ cấu hình đích CTA, ảnh Dr App và xem trước. Không có lịch hoặc trạng thái riêng.
- Hình ảnh: ảnh ngang/dọc dùng chung, trạng thái thiếu ảnh và lỗi sát trường; không cắt ảnh trong xem trước.
- Phạm vi thay thế: liệt kê ID, tiêu đề và tất cả nền tảng của record bị thay trước lệnh xuất bản.
- Kiosk: ảnh dọc trong màn hình chờ, nút Bắt đầu riêng của client; không có nút đóng/nền mờ Popup.
- Bản thử: dữ liệu mẫu và các tham số đề xuất được nhận diện trong Kịch bản thử; không đưa các điều khiển mô phỏng thành yêu cầu CMS thật.

## Do's and Don'ts

- Giữ một lịch và một trạng thái rõ ràng cho cả record.
- Xem trước theo nền tảng không lưu vết đóng và không xuất bản.
- Không ràng buộc tỷ lệ 3:2 hoặc 9:16 cho ảnh tải lên.
- Không thêm xuất bản/gỡ riêng một nền tảng hoặc ghép Web mobile với app bệnh nhân.
- Không áp quy tắc không hiển thị lại cho Kiosk dùng chung.

