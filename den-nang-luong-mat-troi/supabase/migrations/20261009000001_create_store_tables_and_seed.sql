-- ====================================================================
-- MIGRATION: KHỞI TẠO CÁC BẢNG CỬA HÀNG & NẠP DỮ LIỆU ĐÈN SOLAR
-- DỰ ÁN: SOLAR LIGHTING (ĐÈN NĂNG LƯỢNG MẶT TRỜI)
-- LƯU Ý: RLS TẠM THỜI TẮT THEO YÊU CẦU ĐỂ DỄ DÀNG KIỂM TRA TRÊN TABLE EDITOR
-- ====================================================================

-- 1. BẢNG DANH MỤC SẢN PHẨM (CATEGORIES)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BẢNG SẢN PHẨM ĐÈN SOLAR (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    category_name TEXT NOT NULL,
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
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    power_watt INTEGER NOT NULL,
    unit_price NUMERIC(12, 0) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- ====================================================================
-- TẮT RLS & PHÂN QUYỀN ĐẦY ĐỦ CHO GIAI ĐOẠN DEV / TABLE EDITOR
-- ====================================================================
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.categories TO anon, authenticated, service_role;
GRANT ALL ON public.products TO anon, authenticated, service_role;
GRANT ALL ON public.orders TO anon, authenticated, service_role;
GRANT ALL ON public.order_items TO anon, authenticated, service_role;

-- ====================================================================
-- ĐỔ DỮ LIỆU SẴN (SEED DATA)
-- ====================================================================

-- 1. Đổ 4 danh mục
INSERT INTO public.categories (id, name, description, display_order) VALUES
('street', 'Đèn Đường Mặt Trời', 'Đèn đường năng lượng mặt trời liền thể, pin rời và đĩa bay UFO cho đường làng, phố xá', 1),
('flood', 'Đèn Pha Siêu Sáng', 'Đèn pha mặt trời công suất lớn chiếu sáng sân bãi, công trình, ao tôm, kho bãi', 2),
('garden', 'Đèn Sân Vườn & Trụ Cổng', 'Đèn trang trí sân vườn, đèn trụ cổng hoàng gia, đèn cắm cỏ lối đi biệt thự', 3),
('indoor', 'Đèn Trong Nhà & Ban Công', 'Đèn ốp trần solar trong nhà, ban công, giải pháp thắp sáng miễn phí khi cúp điện', 4)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 2. Đổ 8 món đèn năng lượng mặt trời
INSERT INTO public.products (
    id, name, slug, category_id, category_name, power_watt, price, original_price,
    battery_capacity, solar_panel, ip_rating, lighting_time, lighting_area, led_chip,
    image_url, gallery_urls, description, features, is_featured, stock_quantity, warranty_years
) VALUES
(
    'prod-001',
    'Đèn Đường Năng Lượng Mặt Trời Liền Thể Solar Street 300W',
    'den-duong-nang-luong-mat-troi-300w',
    'street',
    'Đèn Đường Liền Thể',
    300,
    1250000,
    1650000,
    '30.000mAh Pin LiFePO4',
    'Tấm pin Monocrystalline 6V/32W',
    'IP67 Chống Nước',
    '12 - 16 giờ liên tục',
    '150 - 200 m²',
    'Chip LED SMD 5730 (480 mắt LED)',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    'Dòng đèn đường liền thể công suất thực 300W chuyên dụng chiếu sáng đường làng ngõ xóm, sân bãi trang trại, cổng biệt thự. Thân vỏ nhôm đúc nguyên khối tản nhiệt tuyệt hảo, cảm biến ánh sáng tự động bật ban đêm, tắt ban ngày kèm remote điều khiển hẹn giờ tiện lợi.',
    ARRAY['Tự động bật khi trời tối, tự tắt sạc pin khi trời sáng', 'Pin Lithium sắt Phosphate LiFePO4 thế hệ mới chống chai, tuổi thọ trên 8 năm', 'Kèm cần gắn tường bằng thép mạ kẽm sơn tĩnh điện', 'Chống sét lan truyền, chịu bão gió cấp 12'],
    true,
    45,
    3
),
(
    'prod-002',
    'Đèn Pha Năng Lượng Mặt Trời Siêu Sáng Solar Flood 500W Cao Cấp',
    'den-pha-nang-luong-mat-troi-500w-cao-cap',
    'flood',
    'Đèn Pha Sân Bãi',
    500,
    1890000,
    2450000,
    '48.000mAh LiFePO4',
    'Tấm pin Mono rời 6V/50W (Kèm dây nối 5m)',
    'IP67 Kháng Bụi Nước',
    '14 - 18 giờ chiếu sáng',
    '250 - 350 m²',
    'Chip LED Philips SMD 3030 (600 mắt LED)',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'],
    'Đèn pha mặt trời công suất siêu khủng 500W tấm pin rời, thấu kính quang học lồi góc chiếu rộng 140 độ. Phù hợp sân bóng chuyền, bãi đỗ xe xưởng sản xuất, ao tôm, vuông tôm và sân thượng gia đình.',
    ARRAY['Hiển thị % dung lượng pin trực quan trên mặt đèn (20% - 40% - 60% - 80% - 100%)', 'Dây nối dài 5m đúc chống nước dễ dàng lắp đặt tấm pin ngoài trời và đèn trong hiên', 'Thấu kính quang học chống chói mắt bảo vệ thị lực', 'Thân đèn nhôm hàng không phủ sơn tĩnh điện chống ăn mòn muối biển'],
    true,
    30,
    5
),
(
    'prod-003',
    'Đèn Đường Pin Rời Khủng Long Solar Street 500W Dự Án Nông Thôn',
    'den-duong-pin-roi-solar-street-500w',
    'street',
    'Đèn Đường Pin Rời',
    500,
    2350000,
    2900000,
    '60.000mAh LiFePO4 Dung Lượng Chuẩn',
    'Tấm pin Monocrystalline công suất lớn 6V/60W',
    'IP68 Chuẩn Công Trình',
    '15 - 20 giờ (Sáng 2-3 đêm mưa)',
    '300 - 450 m²',
    'Bridgelux USA SMD 5054 (720 chip LED)',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    'Sản phẩm chủ lực cho các dự án thắp sáng đường quê Nông Thôn Mới và công trình đô thị. Tấm pin rời chỉnh góc 360 độ đón nắng tối đa, pin lưu trữ dung lượng lớn đảm bảo sáng thấu đêm ngay cả trong những ngày mưa bão kéo dài.',
    ARRAY['Cảm biến radar vi sóng: phát hiện chuyển động tự tăng 100% sáng, chế độ chờ 30% sáng', 'Bảo vệ quá nạp, quá xả, tự ngắt thông minh BMS', 'Đạt chứng nhận kiểm định chất lượng Quatest 3 và tiêu chuẩn CE/RoHS', 'Hỗ trợ đầy đủ hồ sơ CO/CQ cho công trình dự án'],
    true,
    25,
    5
),
(
    'prod-004',
    'Đèn Trụ Cổng Năng Lượng Mặt Trời Nhôm Đúc Phong Cách Hoàng Gia',
    'den-tru-cong-mat-troi-nhom-duc-hoang-gia',
    'garden',
    'Đèn Trụ Cổng & Tường Rào',
    60,
    850000,
    1100000,
    '12.000mAh Lithium Ion',
    'Tấm pin 4 mặt tích hợp trên mái đèn',
    'IP65 Chống Nước Mưa',
    '10 - 12 giờ',
    '40 - 60 m²',
    'LED 3 chế độ màu (Trắng / Vàng nắng / Trung tính)',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    'Thiết kế cổ điển châu Âu sang trọng, thân nhôm đúc hoa văn tinh xảo phủ sơn đồng cổ chống rỉ sét. Kính thủy tinh mờ chịu lực tán xạ ánh sáng ấm cúng, tôn vinh đẳng cấp cổng chính và tường rào biệt thự.',
    ARRAY['3 màu ánh sáng tùy chọn qua remote: Trắng tinh khôi, Vàng ấm áp, Trung tính nhẹ dịu', 'Không cần kéo dây điện nguy hiểm, dễ dàng tự lắp đặt trong 10 phút', 'Tấm pin mặt trời 4 mặt đón nắng mọi hướng cả ngày', 'Bền bỉ chịu mưa nắng thời tiết nhiệt đới khắc nghiệt'],
    false,
    50,
    2
),
(
    'prod-005',
    'Đèn Pha Năng Lượng Mặt Trời 200W Gia Đình Solar Flood 200W',
    'den-pha-nang-luong-mat-troi-200w-gia-dinh',
    'flood',
    'Đèn Pha Gia Đình',
    200,
    890000,
    1200000,
    '20.000mAh LiFePO4',
    'Tấm pin Poly 6V/25W',
    'IP67 Chống Nước',
    '10 - 14 giờ',
    '100 - 150 m²',
    'Chip LED SMD 5730 (256 mắt LED)',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'],
    'Lựa chọn phổ biến nhất cho mọi gia đình Việt Nam. Chiếu sáng sân trước, vườn cây, chuồng trại, cổng ngõ. Lắp đặt đơn giản, bền bỉ qua năm tháng với chi phí đầu tư cực kỳ tiết kiệm.',
    ARRAY['Sạc nhanh 4 - 6 giờ nắng là đầy bình', 'Đèn báo pin LED 5 nấc hiển thị rõ ràng', 'Remote điều khiển từ xa khoảng cách 10m xuyên tường nhẹ', 'Đổi mới 1 đổi 1 trong 30 ngày nếu có lỗi kỹ thuật'],
    true,
    60,
    3
),
(
    'prod-006',
    'Đèn Cắm Cỏ Sân Vườn Năng Lượng Mặt Trời Smart Garden 10W (Bộ 4 Chiếc)',
    'bo-4-den-cam-co-san-vuon-10w',
    'garden',
    'Đèn Cắm Cỏ & Lối Đi',
    40,
    520000,
    750000,
    '4 x 2.200mAh Lithium',
    'Tấm pin Polycrystalline trên đầu đèn',
    'IP65 Chống Nước Ngập Nhẹ',
    '8 - 10 giờ',
    '20 - 30 m²',
    'LED Warm White 3000K ấm áp',
    'https://images.unsplash.com/photo-1558441719-f8185c7f8fb7?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1558441719-f8185c7f8fb7?auto=format&fit=crop&w=800&q=80'],
    'Bộ 4 đèn cắm cỏ năng lượng mặt trời thiết kế tinh gọn cắm trực tiếp vào bãi cỏ, bồn hoa, lối đi dạo sân vườn. Tự động phát sáng lung linh khi màn đêm buông xuống, tạo điểm nhấn cảnh quan lãng mạn cho khuôn viên nhà vườn.',
    ARRAY['Chân cắm nhọn bằng nhựa ABS gia cường, dễ dàng di chuyển vị trí', 'Ánh sáng vàng ấm 3000K tạo chiều sâu phong cảnh ban đêm', 'Chống chịu mưa nắng 365 ngày', 'Combo 4 chiếc siêu tiết kiệm'],
    false,
    80,
    2
),
(
    'prod-007',
    'Đèn Ốp Trần Năng Lượng Mặt Trời Trong Nhà Solar Ceiling 100W',
    'den-op-tran-nang-luong-mat-troi-100w',
    'indoor',
    'Đèn Trong Nhà & Ban Công',
    100,
    790000,
    1050000,
    '15.000mAh Lithium LiFePO4',
    'Tấm pin tách rời 6V/18W kèm dây 5m',
    'IP54 Phù Hợp Trong Nhà & Ban Công',
    '10 - 12 giờ',
    '60 - 80 m²',
    'SMD 2835 Ánh sáng dịu mắt chống cận',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    'Giải pháp chiếu sáng miễn phí tiền điện ngay trong phòng khách, nhà bếp, phòng ngủ hoặc ban công, gara ô tô. Tấm pin đặt trên mái nhà hứng nắng, đèn ốp gọn gàng trên trần với chao đèn mica chống chói mắt.',
    ARRAY['Điều khiển bật tắt linh hoạt qua công tắc hoặc remote cầm tay', 'Chiếu sáng dự phòng hoàn hảo những khi khu vực bị mất điện lưới', 'Không bức xạ nhiệt, an toàn cho trẻ nhỏ và người cao tuổi', 'Bảo hành chính hãng 2 năm'],
    false,
    40,
    2
),
(
    'prod-008',
    'Đèn Đường Đĩa Bay UFO Năng Lượng Mặt Trời 1000W Chiếu Sáng 360 Độ',
    'den-ufo-nang-luong-mat-troi-1000w-chieu-360-do',
    'street',
    'Đèn Đường Đĩa Bay UFO',
    1000,
    2450000,
    3200000,
    '65.000mAh Pin LiFePO4 Khủng',
    'Tấm pin Mono phủ kín mặt nón trên 6V/65W',
    'IP67 Chống Bão Cực Mạnh',
    '14 - 18 giờ liên tục',
    '350 - 500 m²',
    '1200 mắt LED SMD 5730 bố trí vòng tròn 360°',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    'Thiết kế hình đĩa bay UFO độc đáo với các cụm LED phân bổ tròn đều 360 độ, không có góc chết. Thích hợp ngã ba, ngã tư đường làng, quảng trường, sân thể thao và khuôn viên resort du lịch.',
    ARRAY['Góc tỏa ánh sáng toàn diện 360 độ bán kính chiếu rộng tới 20m', 'Cảm biến quang học siêu nhạy và cảm biến chuyển động kép', 'Lắp trên cột phi 76mm hoặc cần cong cực kỳ chắc chắn', 'Khả năng tản nhiệt vòng tròn tối ưu gia tăng tuổi thọ chip LED'],
    true,
    20,
    5
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_id = EXCLUDED.category_id,
    category_name = EXCLUDED.category_name,
    power_watt = EXCLUDED.power_watt,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    battery_capacity = EXCLUDED.battery_capacity,
    solar_panel = EXCLUDED.solar_panel,
    ip_rating = EXCLUDED.ip_rating,
    lighting_time = EXCLUDED.lighting_time,
    lighting_area = EXCLUDED.lighting_area,
    led_chip = EXCLUDED.led_chip,
    image_url = EXCLUDED.image_url,
    gallery_urls = EXCLUDED.gallery_urls,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    is_featured = EXCLUDED.is_featured,
    stock_quantity = EXCLUDED.stock_quantity,
    warranty_years = EXCLUDED.warranty_years,
    updated_at = timezone('utc'::text, now());
