# ACCEPTANCE CRITERIA — SOLAR LIGHT (Tiêu Chí Nghiệm Thu)

> **Nguyên tắc**: Mọi tiêu chí phải đo lường được, bấm thấy được và kiểm chứng được bằng mắt và tay trên trình duyệt.

---

## 1. Tiêu Chí Nghiệm Thu Chức Năng (Functional Criteria)

### A. Trang Chủ & Bộ Tính Toán Tiết Kiệm Điện (Eco Calculator)
- [ ] Header hiển thị đầy đủ: Logo Solar Light, Menu (Trang chủ, Đèn đường, Đèn pha, Đèn sân vườn, Báo giá dự án, Liên hệ), Hotline tư vấn và Giỏ hàng có badge số lượng.
- [ ] Widget "Tính toán tiết kiệm điện": Cho phép kéo chọn số lượng bóng đèn thông thường (ví dụ: 5 bóng 100W, thắp sáng 10h/ngày) $\rightarrow$ Hệ thống tự động tính ra số tiền điện tiết kiệm ước tính trong 1 năm và 5 năm.
- [ ] Danh sách sản phẩm tiêu biểu hiển thị đầy đủ: Ảnh đại diện, Tên đèn, Công suất (W), Chuẩn IP, Giá bán kèm nhãn giảm giá (nếu có), nút "Xem nhanh" và "Thêm giỏ".

### B. Danh Mục Sản Phẩm & Bộ Lọc Đa Tiêu Chí
- [ ] Bấm chọn danh mục "Đèn đường", chỉ các sản phẩm thuộc danh mục đèn đường hiển thị.
- [ ] Chọn bộ lọc công suất "300W", danh sách tức thì cập nhật chỉ hiện sản phẩm 300W mà không phải tải lại toàn bộ trang (không giật lag).
- [ ] Ô tìm kiếm: Nhập từ khóa (ví dụ: "pha 200w") lọc ra chính xác sản phẩm tương ứng trong vòng dưới 300ms.

### C. Trang Chi Tiết Sản Phẩm (Product Detail)
- [ ] Hiển thị đầy đủ thông số kỹ thuật dạng bảng:
  - Công suất đèn (W)
  - Kích thước tấm pin & chất lượng (Polycrystalline / Monocrystalline)
  - Dung lượng pin lưu trữ (mAh & loại Pin Lithium LiFePO4 chống chai)
  - Thời gian sạc đầy (4 - 6 giờ nắng) & Thời gian chiếu sáng liên tục (12 - 16 giờ)
  - Tiêu chuẩn chống nước và bụi (IP65 / IP67)
- [ ] Bấm nút "Thêm vào giỏ": Badge trên Header tăng ngay lập tức, hiển thị thông báo popup hoặc toast xanh thông báo thành công.

### D. Giỏ Hàng & Quy Trình Đặt Hàng (Checkout)
- [ ] Mở giỏ hàng: Xem được toàn bộ sản phẩm đã chọn, tăng giảm số lượng, xóa sản phẩm, hiển thị tổng tiền chính xác.
- [ ] Form đặt hàng: Yêu cầu các trường tối thiểu:
  - Họ và tên khách hàng (Bắt buộc)
  - Số điện thoại liên hệ (Bắt buộc, kiểm tra đúng 10 chữ số)
  - Địa chỉ giao hàng (Bắt buộc)
  - Ghi chú yêu cầu (Tùy chọn - ví dụ: "Cần tư vấn loại cần đèn gắn tường")
- [ ] Khi bấm "Xác Nhận Đặt Hàng":
  - Nếu thông tin thiếu hoặc sai định dạng: Hiển thị cảnh báo màu đỏ tại đúng ô nhập liệu.
  - Nếu hợp lệ: Dữ liệu đơn hàng được lưu trực tiếp vào bảng `orders` và `order_items` trong database Supabase, màn hình chuyển sang thông báo "Đặt hàng thành công" kèm mã đơn hàng duy nhất.

### E. Phân Hệ Quản Trị (Admin Portal - `/admin`)
- [ ] Truy cập đường dẫn `/admin` khi chưa đăng nhập quyền Admin $\rightarrow$ Hệ thống tự động chuyển hướng về trang đăng nhập `/login` hoặc hiển thị thông báo chặn truy cập.
- [ ] Đăng nhập thành công với tài khoản Admin:
  - Dashboard hiển thị tổng số sản phẩm đang bán, tổng số đơn hàng đã nhận.
  - Mục Quản lý Sản phẩm: Cho phép thêm sản phẩm mới (Tên, Giá, Công suất, Ảnh, Thông số kỹ thuật) và chỉnh sửa thông tin sản phẩm có sẵn.
  - Mục Quản lý Đơn hàng: Xem danh sách đơn mới đặt, bấm chuyển trạng thái: `Mới tiếp nhận` $\rightarrow$ `Đã gọi xác nhận` $\rightarrow$ `Đang giao hàng` $\rightarrow$ `Hoàn thành`. Thay đổi được lưu vào database ngay lập tức.

---

## 2. Tiêu Chí Nghiệm Thu Kỹ Thuật, An Ninh & Hiệu Năng (Non-Functional Criteria)

### A. An Ninh & Phân Quyền (Security Shift-Left)
- [ ] **Bật RLS 100%**: Tất cả các bảng (`products`, `orders`, `order_items`, `user_roles`) đều kích hoạt `ROW LEVEL SECURITY`.
- [ ] **Bảo vệ dữ liệu khách**: Khách vãng lai và tài khoản người dùng bình thường không thể xem thông tin đơn hàng hoặc số điện thoại của khách hàng khác.
- [ ] **Bảo vệ Secret Keys**: Không để lộ `SUPABASE_SERVICE_ROLE_KEY` trong mã nguồn frontend hoặc trong file commit Git.

### B. Độ Thích Ứng Thiết Bị (Responsive & UX)
- [ ] Hoạt động trơn tru trên mọi kích thước màn hình: Mobile (375px - 414px), Tablet (768px), Desktop (1024px - 1440px+). Tuyệt đối không bị vỡ giao diện hoặc tràn thanh cuộn ngang.
- [ ] Bố cục nút gọi Hotline và Chat Zalo tư vấn được neo cố định góc dưới màn hình trên điện thoại để khách bấm gọi trực tiếp một chạm.

### C. Hiệu Năng (Performance & Core Web Vitals)
- [ ] Thời gian tải trang ban đầu (LCP) $\le$ 2.5 giây.
- [ ] Điểm số Google PageSpeed / Lighthouse $\ge$ 85 điểm trên cả bản Mobile và Desktop.
- [ ] Hình ảnh sản phẩm tối ưu định dạng hiện đại (WebP) kèm thuộc tính kích thước rõ ràng để tránh giật bố cục (CLS $\le$ 0.1).
