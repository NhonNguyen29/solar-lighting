-- ====================================================================
-- MIGRATION: KHỞI TẠO HỆ THỐNG DỮ LIỆU & ROW LEVEL SECURITY (RLS)
-- DỰ ÁN: SOLAR LIGHT (CỬA HÀNG ĐÈN NĂNG LƯỢNG MẶT TRỜI)
-- ====================================================================

-- 1. BẢNG PHÂN QUYỀN NGƯỜI DÙNG (USER ROLES - RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BẢNG DANH MỤC SẢN PHẨM ĐÈN SOLAR (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('street', 'flood', 'garden', 'indoor')),
    power_watt INTEGER NOT NULL CHECK (power_watt > 0),
    price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12, 0) CHECK (original_price >= price),
    battery_capacity TEXT NOT NULL,
    solar_panel TEXT NOT NULL,
    ip_rating TEXT NOT NULL DEFAULT 'IP67',
    lighting_time TEXT NOT NULL DEFAULT '12 - 16 giờ',
    lighting_area TEXT NOT NULL,
    led_chip TEXT NOT NULL,
    image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    warranty_years INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BẢNG ĐƠN HÀNG & BÁO GIÁ DỰ ÁN (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE,
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

-- 4. BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN (ORDER ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    power_watt INTEGER NOT NULL,
    unit_price NUMERIC(12, 0) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- ====================================================================
-- PHÂN QUYỀN GRANT TỐI THIỂU (LEAST PRIVILEGE)
-- ====================================================================
REVOKE ALL ON public.user_roles FROM PUBLIC;
REVOKE ALL ON public.products FROM PUBLIC;
REVOKE ALL ON public.orders FROM PUBLIC;
REVOKE ALL ON public.order_items FROM PUBLIC;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- ====================================================================
-- KÍCH HOẠT ROW LEVEL SECURITY (RLS 100%)
-- ====================================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. POLICIES CHO BẢNG PRODUCTS
-- Mọi người (cả khách và user) đều được xem sản phẩm
CREATE POLICY "Public can view products"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

-- Chỉ Admin mới được thêm/sửa/xóa sản phẩm
CREATE POLICY "Only admin can manage products"
ON public.products FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 2. POLICIES CHO BẢNG ORDERS
-- Khách vãng lai và user được tạo đơn hàng mới
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Chỉ Admin mới được đọc toàn bộ danh sách đơn hàng để xử lý
CREATE POLICY "Only admin can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Chỉ Admin mới được cập nhật trạng thái đơn hàng
CREATE POLICY "Only admin can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. POLICIES CHO BẢNG ORDER_ITEMS
CREATE POLICY "Public can insert order items"
ON public.order_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admin can view order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. POLICIES CHO BẢNG USER_ROLES
CREATE POLICY "Users can read own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
