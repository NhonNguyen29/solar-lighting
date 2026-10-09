# PRODUCT BRIEF — SOLAR LIGHT (Cửa Hàng & Catalogue Đèn Năng Lượng Mặt Trời)

## 1. Thông Tin Tiếp Nhận (Khuôn 4 Nhãn Vàng)
- **VIỆC**: Xây dựng website bán hàng và giới thiệu catalogue trực tuyến chuyên biệt về **Đèn năng lượng mặt trời (Solar Lighting Store)**. Ứng dụng cung cấp trải nghiệm tìm kiếm, lọc theo thông số kỹ thuật (công suất W, dung lượng pin, chuẩn chống nước IP), giỏ hàng, đặt hàng / gửi yêu cầu báo giá tư vấn, và phân hệ quản trị (Admin) để cập nhật sản phẩm và xử lý đơn hàng.
- **NGUỒN**: 
  - Mô hình nghiệp vụ bán lẻ và phân phối thiết bị năng lượng tái tạo tại Việt Nam.
  - Hệ thống dữ liệu mẫu gồm 4 danh mục chính: *Đèn đường năng lượng mặt trời*, *Đèn pha công nghiệp & sân bãi*, *Đèn trang trí sân vườn/trụ cổng*, *Đèn dân dụng trong nhà*.
  - Tiêu chuẩn thông số kỹ thuật ngành: Công suất (60W - 1000W), Chuẩn IP65 - IP67, Dung lượng Pin Lithium LiFePO4, Thời gian sáng 10-14h liên tục.
- **KẾT QUẢ**: 
  - Một Web App hoàn chỉnh chạy trên Next.js + Supabase.
  - Giao diện thẩm mỹ cao cấp với phong cách năng lượng sạch (Eco Green & Solar Amber/Gold, chế độ Dark/Light mode hiện đại).
  - Bộ lọc sản phẩm đa tiêu chí hoạt động mượt mà.
  - Luồng giỏ hàng và đặt mua hàng lưu trực tiếp vào cơ sở dữ liệu.
  - Trang quản trị `/admin` có bảo vệ phân quyền (RBAC), quản lý sản phẩm và trạng thái đơn hàng.
- **LƯU Ý**: 
  - **Phân loại rủi ro**: **Mức 3 — Web App tiêu chuẩn có Database, Auth & CRUD**.
  - Không lưu thông tin thanh toán nhạy cảm (giai đoạn MVP áp dụng phương thức COD và Yêu cầu tư vấn/báo giá).
  - Đảm bảo bảo mật ngay từ đầu: Bật PostgreSQL RLS trên toàn bộ các bảng trong Supabase.

---

## 2. Người Dùng Mục Tiêu (Personas)
1. **Khách hàng cá nhân (Hộ gia đình)**:
   - *Nhu cầu*: Tìm đèn chiếu sáng sân vườn, cổng rào, lối đi, đèn chiếu sáng khi cúp điện.
   - *Hành vi*: Quan tâm độ bền, độ sáng thực tế, bảo hành, dễ tự lắp đặt không cần đi dây điện.
2. **Khách hàng doanh nghiệp / Dự án (Chủ xưởng, trang trại, công trình đường quê)**:
   - *Nhu cầu*: Mua số lượng lớn đèn đường, đèn pha công suất cao (300W - 1000W).
   - *Hành vi*: Cần báo giá nhanh, thông số tấm pin Poly/Mono, thời gian sáng thâu đêm.
3. **Quản trị viên cửa hàng (Admin / Sales)**:
   - *Nhu cầu*: Cập nhật nhanh giá đèn, tình trạng còn hàng, thêm sản phẩm mới kèm ảnh và nhận thông báo khi có khách đặt hàng để gọi điện tư vấn.

---

## 3. Phạm Vi Triển Khai MVP (In-Scope vs Out-of-Scope)

### A. Trong phạm vi MVP (In-Scope):
- **Trang chủ (Home Page)**:
  - Hero Banner ấn tượng: Thông điệp "Chiếu sáng 0 đồng tiền điện - Bền bỉ 10 năm".
  - Bộ tính toán trực quan: "Bạn tiết kiệm bao nhiêu tiền điện mỗi năm khi dùng đèn mặt trời?".
  - Danh mục sản phẩm nổi bật & Sản phẩm bán chạy nhất.
  - Cam kết chất lượng (Bảo hành 2-5 năm, chống nước chuẩn IP67, đổi mới 30 ngày).
- **Trang Sản phẩm & Catalogue (Catalog & Product Listing)**:
  - Bộ lọc đa chiều: Theo loại đèn, dải công suất (100W, 200W, 300W, 500W+), mức giá.
  - Tìm kiếm sản phẩm tức thì (Instant search).
- **Trang Chi tiết Sản phẩm (Product Detail Page)**:
  - Thư viện ảnh sản phẩm sắc nét.
  - Bảng thông số kỹ thuật chi tiết: Tấm pin năng lượng mặt trời, dung lượng pin lưu trữ, số chip LED, diện tích chiếu sáng.
  - Nút "Thêm vào giỏ" và nút "Nhận báo giá / Tư vấn nhanh".
- **Giỏ hàng & Đặt hàng (Cart & Checkout)**:
  - Giỏ hàng lưu cục bộ (Local State/Cookie).
  - Form đặt hàng đơn giản hóa (Họ tên, SĐT, Địa chỉ nhận hàng, Ghi chú lắp đặt).
  - Đơn hàng được lưu vào Database Supabase thật.
- **Phân hệ Quản trị (Admin Portal - `/admin`)**:
  - Đăng nhập bảo mật qua Supabase Auth.
  - Bảng điều khiển (Dashboard) thống kê đơn hàng.
  - Quản lý danh mục & sản phẩm (CRUD sản phẩm).
  - Quản lý đơn hàng: Xem chi tiết và cập nhật trạng thái đơn (Mới, Đã liên hệ, Đang giao, Đã giao).

### B. Để lại giai đoạn tiếp theo (Out-of-Scope cho bản MVP):
- Tích hợp cổng thanh toán trực tuyến tự động (VNPay, Momo, Stripe).
- Đăng nhập bằng mạng xã hội phức tạp (sẽ bổ sung ở bản V2.1).
- Tích hợp hệ thống theo dõi hành trình xe vận chuyển của bên thứ 3 (GHN, Viettel Post API).
