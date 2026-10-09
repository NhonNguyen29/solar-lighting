# THREAT MODEL — SOLAR LIGHT

> **Mục tiêu**: Nhận diện sớm các rủi ro bảo mật tiềm ẩn, ranh giới tin cậy và thiết lập biện pháp phòng vệ ngay từ tầng thiết kế kiến trúc.

---

## 1. Tài Sản Quan Trọng Cần Bảo Vệ
1. **Thông tin cá nhân khách hàng (PII)**: Họ tên, Số điện thoại, Địa chỉ nhận hàng ghi trong các đơn hàng đèn mặt trời.
2. **Tính toàn vẹn dữ liệu đơn hàng**: Ngăn chặn việc làm giả mã đơn, sửa đổi số lượng hoặc giả mạo trạng thái thanh toán.
3. **Bí mật quản trị & Cấu hình**: API keys bí mật (`SUPABASE_SERVICE_ROLE_KEY`), thông tin tài khoản Admin quản trị.
4. **Tính sẵn sàng của dịch vụ (Availability)**: Bảo vệ hệ thống khỏi spam đơn hàng rác gây tràn tài nguyên hoặc nghẽn dịch vụ.

---

## 2. Mô Hình Phân Tích Mối Đe Dọa (STRIDE Matrix)

| Vectơ Tấn Công | Mức Rủi Ro | Kịch Bản Tấn Công Tiềm Ẩn | Biện Pháp Phòng Vệ Bắt Buộc |
| :--- | :--- | :--- | :--- |
| **Spoofing (Giả mạo danh tính)** | Cao (P0) | Kẻ xấu mạo danh Admin để vào trang `/admin` đổi giá sản phẩm hoặc xóa dữ liệu. | Xác thực chặt chẽ qua Supabase Auth + Bảng `user_roles` kiểm tra ở Server-side Middleware. Cấm tin cậy client state. |
| **Tampering (Sửa đổi dữ liệu)** | Cao (P0) | Khách gửi request đặt hàng tự sửa giá từ 2.500.000đ xuống 1.000đ. | Server Action tính toán lại tổng tiền độc lập dựa trên `price` của sản phẩm trong DB. Cấm nhận tổng tiền từ client. |
| **Repudiation (Chối bỏ trách nhiệm)** | Trung bình (P1) | Khách đặt nhiều đơn hàng ảo nhưng chối bỏ. | Lưu trữ địa chỉ IP, User-Agent, thời gian tạo đơn (`created_at`). Xác thực SĐT qua bước gọi điện xác nhận. |
| **Information Disclosure (Rò rỉ thông tin)** | Cao (P0) | Kẻ xấu dùng Anon API Key gọi `SELECT * FROM orders` để cào số điện thoại khách hàng. | **Bật RLS ngay lập tức**: Cấm quyền `SELECT` trên bảng `orders` đối với role `anon`. Chỉ tài khoản có role `admin` mới được đọc. |
| **Denial of Service (Từ chối dịch vụ / Spam)** | Trung bình (P1) | Bot spam tự động gửi hàng ngàn form đặt hàng gây quá tải. | Rate limiting ở form đặt hàng (giới hạn tối đa 3 đơn / phút trên 1 IP), honeypot field chống bot tự động. |
| **Elevation of Privilege (Leo thang đặc quyền)** | Cao (P0) | Người dùng tự sửa `user_metadata` để tự nâng tài khoản lên `role: 'admin'`. | Quyền hạn lưu độc lập tại bảng `public.user_roles`, chỉ có thể chỉnh sửa trực tiếp bởi Database Owner. |

---

## 3. Ranh Giới Tin Cậy & Quy Tắc An Ninh Bất Di Bất Dịch
- **CẤM** đưa `SUPABASE_SERVICE_ROLE_KEY` vào bất kỳ file Client Component nào (`'use client'`).
- **CẤM** cấp quyền ghi (`INSERT`, `UPDATE`, `DELETE`) vào bảng `products` cho bất kỳ vai trò nào ngoài `admin`.
- **CẤM** in thông tin đơn hàng đầy đủ ra log công khai.
