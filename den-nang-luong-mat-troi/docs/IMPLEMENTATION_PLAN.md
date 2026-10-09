# IMPLEMENTATION PLAN (Kế Hoạch Triển Khai Theo Lát Cắt Dọc) — SOLAR LIGHT

> **Nguyên tắc kỹ thuật**: Triển khai theo từng **Lát cắt dọc (Vertical Slice)** khép kín. Mỗi lát cắt gồm giao diện, logic xử lý, dữ liệu và kiểm thử cục bộ trước khi chuyển sang lát cắt tiếp theo.

---

## 1. Lộ Trình 5 Lát Cắt Dọc (Vertical Slices Roadmap)

```text
[Slice 1: Khung Dự Án, Design System & Trang Chủ Localhost]
      |
      v -> Checkpoint: Gate D (Duyệt Prototype Localhost)
[Slice 2: Danh Mục Sản Phẩm, Bộ Lọc Công Suất W & Chi Tiết Đèn]
      |
      v -> Kiểm thử tương tác & Responsive
[Slice 3: Giỏ Hàng, Bộ Tính Toán Tiết Kiệm Điện & Đặt Hàng COD]
      |
      v -> Checkpoint: Khách hoàn tất đặt hàng thử nghiệm
[Slice 4: Database Supabase, Bật RLS Sớm & Đồng Bộ Dữ Liệu Thật]
      |
      v -> Checkpoint: Gate E (CỔNG CỨNG - Duyệt Schema & Test Allow/Deny)
[Slice 5: Phân Hệ Quản Trị (Admin Portal), Deep QA & Phát Hành Production]
      |
      v -> Checkpoint: Gate F (QA & Security) & Gate G (Phát Hành Production)
```

---

## 2. Chi Tiết Thực Thi Từng Lát Cắt

### Lát Cắt 1: Khởi Tạo Dự Án, Design System & Trang Chủ Hoàn Chỉnh
- **Mục tiêu**: Thiết lập bộ khung ứng dụng, nạp Design Tokens (Eco Green & Solar Amber), dựng Header/Footer chuẩn, Hero Banner, Cam kết thương hiệu và danh mục sản phẩm tiêu biểu.
- **Hạng mục công việc**:
  1. Khởi tạo cấu trúc dự án Web App chuẩn.
  2. Cấu hình bảng màu, font chữ Google Fonts (`Outfit` & `Inter`), hệ thống CSS variables.
  3. Xây dựng components: `Header` (logo, hotline, giỏ hàng badge), `Footer`, `HeroBanner`, `ProductCard`, `FeatureBadges`.
  4. Chuẩn bị bộ dữ liệu mẫu ban đầu (`products.ts`) gồm 8 mẫu đèn thực tế (Đèn đường 300W/500W, Đèn pha 200W, Đèn sân vườn trụ cổng).
  5. Chạy dev server local, xác minh `http://localhost:3000` chạy sạch không có lỗi.
- **Điểm kiểm soát**: **Gate D (Duyệt Giao diện cơ sở trên Localhost)**.

### Lát Cắt 2: Danh Mục Catalogue Đa Tiêu Chí & Trang Chi Tiết Đèn
- **Mục tiêu**: Xây dựng trải nghiệm duyệt đèn chuyên nghiệp với bộ lọc kỹ thuật.
- **Hạng mục công việc**:
  1. Xây dựng trang `/products`: Bố cục lưới sản phẩm kèm thanh công cụ lọc bên trái (Sidebar Filter).
  2. Bộ lọc đa tiêu chí: Lọc theo phân loại đèn (Đèn đường, Đèn pha, Đèn sân vườn), Lọc theo công suất (100W, 200W, 300W, 500W+), Lọc theo khoảng giá.
  3. Thanh tìm kiếm sản phẩm tức thì (Instant Search) lọc theo tên hoặc mã đèn.
  4. Xây dựng trang `/products/[slug]`: Thư viện ảnh đèn, bảng thông số kỹ thuật (Kích thước tấm pin, dung lượng pin LiFePO4, số chip LED, độ chống nước IP67), nút "Thêm vào giỏ" và nút "Tư vấn nhanh".

### Lát Cắt 3: Bộ Tính Tiết Kiệm Điện, Giỏ Hàng & Form Đặt Hàng COD
- **Mục tiêu**: Khách hàng trải nghiệm tính năng độc đáo và hoàn tất đặt hàng.
- **Hạng mục công việc**:
  1. Xây dựng Widget `EcoCalculator`: Kéo chọn số bóng đèn $\rightarrow$ Tính số tiền điện tiết kiệm được mỗi năm & lượng khí thải CO₂ giảm được.
  2. Xây dựng trang `/cart`: Quản lý giỏ hàng (tăng/giảm số lượng, xóa món, tính tổng tiền).
  3. Xây dựng Form đặt hàng nhanh: Tên, SĐT, Địa chỉ, Ghi chú lắp đặt.
  4. Xây dựng màn hình `/order-success`: Xác nhận đơn hàng thành công kèm mã đơn.

### Lát Cắt 4: Tích Hợp Database Supabase & Kích Hoạt RLS Sớm (Security Shift-Left)
- **Mục tiêu**: Lưu trữ sản phẩm và đơn hàng vào CSDL PostgreSQL thật, bảo vệ bằng chính sách an ninh nhiều lớp.
- **Hạng mục công việc**:
  1. Thiết lập migration tạo bảng `products`, `orders`, `order_items`.
  2. Bật RLS 100% trên các bảng ngay trong migration.
  3. Cấp quyền `GRANT` tối thiểu và cấu hình chính sách `USING` / `WITH CHECK`.
  4. Viết và chạy test SQL kiểm tra allow/deny (khách không xem được đơn của người khác).
  5. Đồng bộ code để Server Components đọc sản phẩm từ DB và Server Action ghi đơn vào DB.
- **Điểm kiểm soát**: **Gate E — CỔNG CỨNG (Duyệt Schema & Bằng chứng RLS)**.

### Lát Cắt 5: Phân Hệ Quản Trị Admin, Deep QA & Phát Hành Production
- **Mục tiêu**: Hoàn thiện toàn bộ hệ thống, kiểm thử sâu và sẵn sàng đưa lên Internet.
- **Hạng mục công việc**:
  1. Xây dựng phân hệ `/admin`: Dashboard thống kê, bảng danh sách đơn hàng (đổi trạng thái đơn), quản lý thêm/sửa sản phẩm.
  2. Thiết lập rào chắn Route Guard bảo vệ `/admin` bằng tài khoản Admin.
  3. Chạy toàn bộ chuỗi kiểm thử Deep QA: Lint, Typecheck, Build production, Secret scan, kiểm tra responsive trên mobile thật.
  4. Lập hồ sơ `QA_REPORT.md`, `SECURITY_REVIEW.md`, `RELEASE_CHECKLIST.md`.
- **Điểm kiểm soát**: **Gate F (Duyệt QA & Security)** $\rightarrow$ **Gate G (Phát hành Production)**.
