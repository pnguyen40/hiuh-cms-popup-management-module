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

# Design System: HIUH CMS Popup

## Overview

Kế thừa hệ thống hiển thị thực tế của trang Banner, khảo sát ngày 06/11/2026 bằng agent-browser qua Chrome Debug. Đây là phần mở rộng cho tác vụ quản trị nội dung. Không thay hệ nhận diện của CMS.

Màu hành động, font, nền nhạt, thanh bên, nhóm tab, bảng và form thống nhất với giao diện đang chạy. Bản thiết kế thêm trang soạn thảo hai cột và phần xem trước để đáp ứng tám trường nội dung của Popup.

## Colors

Màu xanh chính dùng cho hành động quan trọng và điều hướng đang chọn. Màu xanh lá cho đang hoạt động; vàng cho hết hạn/cảnh báo; đỏ cho dữ liệu lỗi. Cấu hình Xuất bản dùng xanh lam nhạt để phân biệt với Đang hiển thị.

Trạng thái luôn có nhãn chữ; không dựa riêng vào màu. Nền cảnh báo có đường viền mảnh, không dùng vạch màu dày.

## Typography

Lexend cho thao tác và dữ liệu; Plus Jakarta Sans cho tiêu đề. Hai họ font đã được quan sát bằng computed style trên CMS. Font lưu cục bộ, kèm giấy phép OFL.

Tiêu đề trang 21–22 px, tiêu đề nhóm 14 px, thao tác 12 px. Dữ liệu bảng dùng chữ gọn; thời gian dùng tabular numerals. Tiêu đề Popup phía Website 26 px và tự xuống dòng. Không giới hạn nội dung bằng cắt dấu ba chấm trong form/xem trước.

## Layout

Desktop: thanh bên 248 px, header 70 px, nội dung tối đa 1450 px, lề 32 px. Danh sách có tab, tiêu đề, một dải thông tin Popup hiện hành, thanh tìm/lọc và bảng.

Soạn thảo: cột nhập liệu và cột xem trước; xem trước giữ vị trí khi cuộn. Thanh tác vụ dính cuối viewport. Dưới 1060 px chuyển một cột; dưới 800 px thanh bên thu gọn và bảng cuộn ngang trong vùng riêng. Đây là responsive của **CMS**, khác với quy tắc hiển thị Popup trên Website.

## Elevation & Depth

Bảng và vùng form phân tách bằng viền. Bóng chỉ dùng cho menu nổi, dialog, thông báo và Popup để nhận biết lớp tương tác. Nền mờ giúp tập trung vào Popup. Không có hiệu ứng trang trí hoặc animation khi tải màn quản trị.

## Shapes

Điều khiển bo góc nhỏ; vùng nội dung bo vừa; badge trạng thái dạng viên. Ảnh luôn có khung 3:2, dùng object-fit: cover. Icon SVG nét 1.65, cùng hệ 24 × 24.

## Components

- **Dải Popup đang hiển thị:** ảnh nhỏ, tiêu đề, lịch gỡ, nút xem trước và sửa. Không biến thành thống kê chiến dịch.
- **Bảng:** tách Cấu hình và Hiển thị. “Chờ đến lịch” là mô tả phụ, không tạo trạng thái thứ ba cho cấu hình.
- **Form:** nhãn hiện rõ, dấu * chỉ bốn trường bắt buộc lúc xuất bản; trường tùy chọn được ghi rõ. Lỗi sát trường và có tổng hợp ở đầu form.
- **Xuất bản:** cảnh báo tác động thay thế nằm sẵn trong form; không mở xác nhận phụ. Lưu thay đổi trên bản đã xuất bản vẫn giữ trạng thái.
- **Xem trước:** cập nhật theo dữ liệu nhập; vùng thu nhỏ không nhận focus. Nút mở rộng dùng dialog có focus trap và Escape.
- **Gỡ:** nhãn “Chuyển về Nháp” để thể hiện vẫn giữ bản ghi, khác với xóa.
- **Kịch bản thử:** công cụ phục vụ duyệt thiết kế, không phải chức năng sản phẩm cần phát triển.

## Do's and Don'ts

- Giữ cả nhãn cấu hình và nhãn hiển thị khi mô tả bản ghi.
- Giữ các quy tắc và những điểm còn mở trong HANDOFF.md.
- Giữ một ảnh 3:2, đúng tám trường nội dung, hai trường lịch.
- Không thêm duyệt bài, tiếng Anh, ảnh mobile, độ ưu tiên, thống kê hoặc xóa bản ghi.
- Không biến các lựa chọn của bảng kịch bản thử thành yêu cầu chức năng CMS.
