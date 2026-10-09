# UX SPECIFICATION — SOLAR LIGHT

> **Mục tiêu**: Chuẩn hóa trải nghiệm người dùng, luồng hành trình chính và quy cách tương tác cho website Đèn năng lượng mặt trời.

---

## 1. Bản Đồ Trang (Sitemap)

```text
/ (Trang chủ: Hero, Eco Calculator, Danh mục nổi bật, Bán chạy, Cam kết, Đánh giá khách)
├── /products (Catalogue & Danh sách sản phẩm: Bộ lọc công suất, loại đèn, khoảng giá, sắp xếp)
│   └── /products/[slug] (Chi tiết sản phẩm: Gallery ảnh, Thông số kỹ thuật, Tính năng, Đánh giá, Nút mua)
├── /cart (Giỏ hàng & Checkout: Danh sách chọn mua, Form thông tin giao hàng COD / Yêu cầu tư vấn)
├── /order-success?orderId=... (Màn hình cảm ơn & xác nhận đơn)
├── /calculator (Công cụ tính toán tiết kiệm điện & tư vấn công suất đèn phù hợp)
├── /contact (Liên hệ, bản đồ showroom, hotline, form yêu cầu khảo sát công trình)
├── /login (Đăng nhập quản trị viên)
└── /admin (Khu vực quản trị — RBAC Protected)
    ├── /admin/dashboard (Thống kê đơn hàng, sản phẩm, doanh thu)
    ├── /admin/products (Quản lý sản phẩm: thêm mới, cập nhật giá, tồn kho, ảnh)
    └── /admin/orders (Quản lý danh sách đơn hàng & trạng thái xử lý)
```

---

## 2. Các Hành Trình Người Dùng Cốt Lõi (User Journeys)

### Hành trình 1: Khách Mua Hàng Hộ Gia Đình (Buyer Flow)
1. Khách truy cập Trang chủ $\rightarrow$ Bị thu hút bởi thông điệp "0 đồng tiền điện" và công cụ tính tiết kiệm điện.
2. Thử nghiệm kéo thanh trượt "5 bóng đèn sân vườn, thắp sáng 10h/đêm" $\rightarrow$ Xem kết quả tiết kiệm được ~3.600.000đ/năm.
3. Bấm nút "Xem đèn phù hợp" $\rightarrow$ Chuyển đến trang Danh mục đã tự lọc danh sách "Đèn sân vườn".
4. Bấm vào sản phẩm "Đèn năng lượng mặt trời Solar 200W IP67" $\rightarrow$ Xem bảng thông số pin, ảnh chụp đêm thực tế.
5. Bấm "Thêm vào giỏ" $\rightarrow$ Toast xanh xuất hiện, badge giỏ hàng nhảy số 1.
6. Mở Giỏ hàng $\rightarrow$ Điền thông tin (Tên, SĐT, Địa chỉ) $\rightarrow$ Chọn hình thức "Thanh toán khi nhận hàng (COD)" $\rightarrow$ Bấm "Xác Nhận Đặt Hàng".
7. Nhận mã đơn hàng `#SL-2026-XXXX` kèm thông báo nhân viên sẽ gọi xác nhận trong 15 phút.

### Hành trình 2: Khách Doanh Nghiệp / Công Trình Cần Báo Giá (B2B Lead Flow)
1. Khách cần lắp đèn đường nông thôn hoặc xưởng bãi.
2. Bấm nút "Báo Giá Dự Án / Công Trình" trên Menu chính.
3. Điền form ngắn: Loại công trình, Chiều dài/Diện tích, Số lượng dự kiến $\rightarrow$ Gửi yêu cầu.
4. Đơn yêu cầu được lưu vào hệ thống Admin với nhãn "Khách dự án".

### Hành trình 3: Quản Trị Viên Vận Hành Cửa Hàng (Admin Flow)
1. Đăng nhập qua `/login`.
2. Vào Dashboard xem thống kê: 3 đơn hàng mới chờ gọi điện.
3. Mở chi tiết đơn hàng $\rightarrow$ Gọi điện cho khách tư vấn $\rightarrow$ Chuyển trạng thái đơn sang "Đã xác nhận".
4. Thêm một mẫu đèn đường mới 500W: nhập tiêu đề, tải ảnh, điền thông số pin $\rightarrow$ Bấm lưu $\rightarrow$ Sản phẩm lập tức xuất hiện ngoài trang chủ.

---

## 3. Quy Chuẩn 6 Trạng Thái UX Bắt Buộc

1. **Loading State**:
   - Sử dụng **Skeleton Shimmer** màu tối pha ánh kim (`surface-shimmer`) mô phỏng bố cục Product Card và bảng thông số khi đang nạp dữ liệu.
   - Không dùng spinner trắng trơn làm gián đoạn trải nghiệm thị giác.
2. **Empty State**:
   - Khi bộ lọc không tìm thấy sản phẩm hoặc giỏ hàng trống: Hiển thị icon đèn mặt trời cách điệu, câu thông điệp thân thiện: *"Chưa có sản phẩm nào trong giỏ hàng của bạn"* kèm nút CTA *"Khám phá các mẫu đèn bán chạy ngay"*.
3. **Error State**:
   - Khi lỗi mạng hoặc database: Hiển thị banner/card lỗi với thông điệp: *"Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối mạng và thử lại"*, kèm nút `Thử lại (Retry)`.
   - Lỗi nhập form: Hiển thị viền đỏ và text cảnh báo ngay dưới ô nhập liệu (Inline validation).
4. **Success State**:
   - Thêm giỏ hàng: Toast góc trên bên phải mượt mà trong 3 giây.
   - Đặt hàng thành công: Icon checkmark màu xanh lá năng lượng mượt mà, thông tin mã đơn rõ ràng.
5. **Forbidden / 403 State**:
   - Người dùng thường cố vào `/admin`: Trang thông báo lịch sự *"Khu vực quản trị dành riêng cho nhân viên cửa hàng"* kèm nút *"Quay về trang chủ"*.
6. **Offline State**:
   - Khi thiết bị mất internet: Thanh thông báo cố định màu vàng cam mỏng ở đỉnh màn hình *"Bạn đang ngoại tuyến. Vui lòng kiểm tra lại kết nối mạng"*.
