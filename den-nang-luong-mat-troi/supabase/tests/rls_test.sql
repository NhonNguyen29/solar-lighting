-- ====================================================================
-- TEST SUITE: KIỂM THỬ MA TRẬN PHÂN QUYỀN VÀ BẢO MẬT ROW LEVEL SECURITY (RLS)
-- ====================================================================

BEGIN;

-- BƯỚC 1: TẠO DỮ LIỆU GIẢ LẬP ĐỂ TEST
INSERT INTO auth.users (id, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@solarlight.vn'),
('22222222-2222-2222-2222-222222222222', 'customer@gmail.com');

INSERT INTO public.user_roles (user_id, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin'),
('22222222-2222-2222-2222-222222222222', 'customer');

-- TEST CASE 1: KHÁCH VÃNG LAI (ANON) ĐỌC DANH SÁCH SẢN PHẨM -> PHẢI THÀNH CÔNG (ALLOW)
SET ROLE anon;
SELECT count(*) FROM public.products; 
-- KỲ VỌNG: Trả về số lượng sản phẩm (>0) -> PASS

-- TEST CASE 2: KHÁCH VÃNG LAI (ANON) CỐ ĐỌC DANH SÁCH ĐƠN HÀNG -> PHẢI BỊ CHẶN (DENY 0 DÒNG)
SET ROLE anon;
SELECT count(*) FROM public.orders; 
-- KỲ VỌNG: 0 dòng trả về do RLS chặn quyền SELECT -> PASS

-- TEST CASE 3: KHÁCH VÃNG LAI (ANON) THÊM ĐƠN HÀNG MỚI (CHECKOUT) -> PHẢI THÀNH CÔNG (ALLOW)
SET ROLE anon;
INSERT INTO public.orders (order_code, customer_name, customer_phone, shipping_address, total_amount)
VALUES ('SL-TEST-001', 'Khách Vãng Lai', '0912345678', 'Hà Nội', 1250000);
-- KỲ VỌNG: Insert thành công -> PASS

-- TEST CASE 4: USER BÌNH THƯỜNG CỐ TÌNH ĐỔI GIÁ SẢN PHẨM -> PHẢI BỊ CHẶN (DENY)
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222"}';
UPDATE public.products SET price = 1000 WHERE slug = 'den-duong-nang-luong-mat-troi-300w';
-- KỲ VỌNG: 0 dòng bị cập nhật do thiếu quyền admin -> PASS

-- TEST CASE 5: ADMIN ĐĂNG NHẬP XEM ĐƠN VÀ ĐỔI TRẠNG THÁI -> PHẢI THÀNH CÔNG (ALLOW)
SET request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';
SELECT count(*) FROM public.orders;
-- KỲ VỌNG: Thấy đầy đủ đơn hàng -> PASS

UPDATE public.orders SET status = 'contacted' WHERE order_code = 'SL-TEST-001';
-- KỲ VỌNG: Cập nhật thành công 1 dòng -> PASS

ROLLBACK;
