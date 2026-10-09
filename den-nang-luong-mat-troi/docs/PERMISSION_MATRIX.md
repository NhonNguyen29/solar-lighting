# PERMISSION MATRIX (Ma Trận Phân Quyền) — SOLAR LIGHT

> **Nguyên tắc**: Mặc định từ chối (Default Deny). Mọi thao tác không được liệt kê cụ thể dưới đây đều bị hệ thống chặn hoàn toàn.

---

## 1. Ma Trận Quyền Dữ Liệu Tầng Database (PostgreSQL RLS)

| Bảng dữ liệu / Thao tác | Khách vãng lai (`anon`) | Người dùng thường (`authenticated`) | Quản trị viên (`admin`) | Ghi chú an ninh |
| :--- | :--- | :--- | :--- | :--- |
| **Bảng `products`** | | | | |
| - Đọc danh sách & chi tiết (`SELECT`) | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | Công khai để khách xem hàng |
| - Thêm sản phẩm mới (`INSERT`) | ❌ Từ chối | ❌ Từ chối | ✅ Cho phép | Chỉ Admin mới được đăng đèn |
| - Sửa thông tin, giá bán (`UPDATE`) | ❌ Từ chối | ❌ Từ chối | ✅ Cho phép | Ghi log thay đổi giá |
| - Xóa sản phẩm (`DELETE`) | ❌ Từ chối | ❌ Từ chối | ✅ Cho phép | Ưu tiên ẩn sản phẩm (`is_active`) |
| **Bảng `orders`** | | | | |
| - Đọc toàn bộ đơn hàng (`SELECT`) | ❌ TỪ CHỐI TUYỆT ĐỐI | ❌ TỪ CHỐI TUYỆT ĐỐI | ✅ Cho phép | Chống rò rỉ SĐT, địa chỉ |
| - Đọc đơn của chính mình (`SELECT`) | ⚠️ Chỉ xem qua mã đơn & session | ✅ Cho phép (`auth.uid() = user_id`) | ✅ Cho phép | Khách xem lại đơn vừa đặt |
| - Tạo đơn hàng mới (`INSERT`) | ✅ Cho phép (Kiểm tra form hợp lệ) | ✅ Cho phép | ❌ Không áp dụng | Đặt hàng không bắt buộc login |
| - Đổi trạng thái đơn (`UPDATE`) | ❌ Từ chối | ❌ Từ chối | ✅ Cho phép | Đổi sang: Đã liên hệ, Đang giao |
| - Xóa đơn hàng (`DELETE`) | ❌ Từ chối | ❌ Từ chối | ❌ TỪ CHỐI | Cấm xóa đơn để đối soát doanh thu |
| **Bảng `user_roles`** | | | | |
| - Đọc vai trò (`SELECT`) | ❌ Từ chối | ✅ Chỉ xem vai trò của chính mình | ✅ Cho phép | Kiểm tra quyền truy cập |
| - Sửa đổi vai trò (`UPDATE`) | ❌ Từ chối | ❌ Từ chối | 🛑 Chỉ thao tác DB nội bộ | Cấm tự nâng quyền |

---

## 2. Ma Trận Quyền Điều Hướng & Giao Diện (Route Guards)

| Tuyến đường (Route) | Khách vãng lai | Người dùng đăng nhập | Admin | Hành vi khi vi phạm quyền |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Trang chủ) | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | Không có |
| `/products/*` (Sản phẩm) | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | Không có |
| `/cart` (Giỏ hàng) | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | Không có |
| `/order-success` | ✅ Cho phép (Có mã đơn) | ✅ Cho phép | ✅ Cho phép | Nếu không có mã đơn: về `/` |
| `/login` | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | Đã login admin: chuyển hướng vào `/admin` |
| `/admin/*` (Toàn bộ trang admin) | ❌ Chặn hoàn toàn | ❌ Chặn hoàn toàn | ✅ Cho phép | Tự động chuyển hướng về `/login?error=unauthorized` |
