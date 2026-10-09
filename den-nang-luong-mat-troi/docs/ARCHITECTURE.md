# ARCHITECTURE DESIGN — SOLAR LIGHT

> **Kiến trúc hệ thống**: Web App hiện đại xây dựng trên nền tảng Next.js (App Router), kết hợp Tailwind CSS/Modern CSS Tokens, cơ sở dữ liệu quan hệ PostgreSQL trên Supabase và triển khai CI/CD trên Vercel.

---

## 1. Ngăn Xếp Công Nghệ (Technology Stack)

| Thành phần | Lựa chọn công nghệ | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | Hỗ trợ Server Components tối ưu SEO cho trang sản phẩm, Server Actions xử lý giỏ hàng/đặt hàng an toàn, không lộ code xử lý ra client. |
| **Styling** | **Tailwind CSS + CSS Design Tokens** | Tùy biến linh hoạt, kích thước bundle CSS siêu nhẹ, dễ dàng cấu hình hệ màu Eco-Tech (Emerald Green & Solar Amber). |
| **Database** | **Supabase PostgreSQL** | Hệ quản trị CSDL quan hệ mạnh mẽ, tích hợp sẵn Row Level Security (RLS), Data API tự động và mở rộng dễ dàng. |
| **Auth** | **Supabase Auth** | Xác thực chuẩn công nghiệp, bảo vệ phiên qua cookie HttpOnly, hỗ trợ MFA cho tài khoản Admin. |
| **Hosting & CI/CD** | **Vercel** | Nền tảng hosting tối ưu nhất cho Next.js, hỗ trợ preview deployments và instant rollback khi có sự cố. |

---

## 2. Sơ Đồ Kiến Trúc & Ranh Giới Tin Cậy (Trust Boundaries)

```text
+-------------------------------------------------------------------------+
| [ VÙNG KHÔNG TIN CẬY (UNTRUSTED) ]                                     |
| Trình duyệt của Khách hàng (Mobile / Desktop Chrome, Safari)           |
| - Giao diện người dùng: Xem sản phẩm, Bộ tính toán, Chọn giỏ hàng        |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTPS / POST Server Actions
                                    v
+-------------------------------------------------------------------------+
| [ VÙNG TIN CẬY MÁY CHỦ (TRUSTED SERVER - Next.js App Router) ]          |
| - Server Components: Render HTML sạch, tối ưu SEO, không gửi JS thừa   |
| - Server Actions: Validate form (Zod), kiểm tra session và quyền        |
| - Rate Limiter: Chặn spam đặt hàng và brute force đăng nhập             |
+-------------------------------------------------------------------------+
                                    |
                                    | Supabase SDK (Anon Key + User JWT)
                                    v
+-------------------------------------------------------------------------+
| [ VÙNG DỮ LIỆU AN TOÀN (SECURE DATA - Supabase PostgreSQL) ]            |
| - Row Level Security (RLS) bắt buộc trên 100% các bảng                  |
| - Bảng products: Public Read, Admin Write                                |
| - Bảng orders / order_items: User/Guest Write, Chỉ Admin Read All       |
| - Bảng user_roles: RBAC server-side verification                        |
+-------------------------------------------------------------------------+
```

---

## 3. Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

### Bảng 1: `products` (Danh mục sản phẩm đèn)
```sql
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('street', 'flood', 'garden', 'indoor')),
    power_watt INTEGER NOT NULL CHECK (power_watt > 0), -- 60, 100, 200, 300, 500, 1000
    price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12, 0) CHECK (original_price >= price),
    battery_capacity TEXT NOT NULL, -- Ví dụ: '30.000mAh LiFePO4'
    solar_panel TEXT NOT NULL,      -- Ví dụ: 'Tấm pin Monocrystalline 6V/35W'
    ip_rating TEXT NOT NULL DEFAULT 'IP67', -- IP65, IP67, IP68
    lighting_time TEXT NOT NULL DEFAULT '12 - 16 giờ',
    lighting_area TEXT NOT NULL,    -- Ví dụ: '150 - 200 m²'
    image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### Bảng 2: `orders` (Đơn đặt hàng & yêu cầu báo giá)
```sql
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE, -- Ví dụ: 'SL-202610-001'
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    customer_note TEXT,
    order_type TEXT NOT NULL DEFAULT 'retail' CHECK (order_type IN ('retail', 'project_quote')),
    payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'bank_transfer')),
    total_amount NUMERIC(12, 0) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'shipping', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### Bảng 3: `order_items` (Chi tiết sản phẩm trong đơn)
```sql
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    power_watt INTEGER NOT NULL,
    unit_price NUMERIC(12, 0) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);
```

### Bảng 4: `user_roles` (Phân quyền người dùng - RBAC)
```sql
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 4. Quyết Định Kiến Trúc Trọng Yếu (Architecture Decision Records - ADR)
- **ADR-01: Kiến trúc Dữ liệu tĩnh chuyển dịch linh hoạt**:
  Giai đoạn Prototype (Localhost ban đầu) sử dụng `data/products.ts` với mock data có cấu trúc chuẩn khớp 100% với schema PostgreSQL. Khi nối Supabase ở Giai đoạn 4, việc chuyển đổi là drop-in replacement liền mạch mà không phải sửa lại giao diện hay components.
- **ADR-02: Bảo mật Form Đặt Hàng Phía Máy Chủ**:
  Toàn bộ tính toán tổng tiền đơn hàng phải được tính lại tại Server Action dựa trên giá trong cơ sở dữ liệu, không tin cậy tổng tiền do client gửi lên.
- **ADR-03: Security-by-Design RLS**:
  Bảng `orders` chỉ cho phép `anon` và `authenticated` thực hiện `INSERT` đơn hàng mới. Tuyệt đối không cấp quyền `SELECT` công khai cho `anon` trên bảng `orders` để tránh việc kẻ xấu quét số điện thoại và thông tin khách mua đèn.
