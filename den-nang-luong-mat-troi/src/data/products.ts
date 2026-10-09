import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Đèn Đường Năng Lượng Mặt Trời Liền Thể Solar Street 300W',
    slug: 'den-duong-nang-luong-mat-troi-300w',
    category: 'street',
    categoryName: 'Đèn Đường Liền Thể',
    powerWatt: 300,
    price: 1250000,
    originalPrice: 1650000,
    batteryCapacity: '30.000mAh Pin LiFePO4',
    solarPanel: 'Tấm pin Monocrystalline 6V/32W',
    ipRating: 'IP67 Chống Nước',
    lightingTime: '12 - 16 giờ liên tục',
    lightingArea: '150 - 200 m²',
    ledChip: 'Chip LED SMD 5730 (480 mắt LED)',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dòng đèn đường liền thể công suất thực 300W chuyên dụng chiếu sáng đường làng ngõ xóm, sân bãi trang trại, cổng biệt thự. Thân vỏ nhôm đúc nguyên khối tản nhiệt tuyệt hảo, cảm biến ánh sáng tự động bật ban đêm, tắt ban ngày kèm remote điều khiển hẹn giờ tiện lợi.',
    features: [
      'Tự động bật khi trời tối, tự tắt sạc pin khi trời sáng',
      'Pin Lithium sắt Phosphate LiFePO4 thế hệ mới chống chai, tuổi thọ trên 8 năm',
      'Kèm cần gắn tường bằng thép mạ kẽm sơn tĩnh điện',
      'Chống sét lan truyền, chịu bão gió cấp 12'
    ],
    isFeatured: true,
    stockQuantity: 45,
    warrantyYears: 3
  },
  {
    id: 'prod-002',
    name: 'Đèn Pha Năng Lượng Mặt Trời Siêu Sáng Solar Flood 500W Cao Cấp',
    slug: 'den-pha-nang-luong-mat-troi-500w-cao-cap',
    category: 'flood',
    categoryName: 'Đèn Pha Sân Bãi',
    powerWatt: 500,
    price: 1890000,
    originalPrice: 2450000,
    batteryCapacity: '48.000mAh LiFePO4',
    solarPanel: 'Tấm pin Mono rời 6V/50W (Kèm dây nối 5m)',
    ipRating: 'IP67 Kháng Bụi Nước',
    lightingTime: '14 - 18 giờ chiếu sáng',
    lightingArea: '250 - 350 m²',
    ledChip: 'Chip LED Philips SMD 3030 (600 mắt LED)',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Đèn pha mặt trời công suất siêu khủng 500W tấm pin rời, thấu kính quang học lồi góc chiếu rộng 140 độ. Phù hợp sân bóng chuyền, bãi đỗ xe xưởng sản xuất, ao tôm, vuông tôm và sân thượng gia đình.',
    features: [
      'Hiển thị % dung lượng pin trực quan trên mặt đèn (20% - 40% - 60% - 80% - 100%)',
      'Dây nối dài 5m đúc chống nước dễ dàng lắp đặt tấm pin ngoài trời và đèn trong hiên',
      'Thấu kính quang học chống chói mắt bảo vệ thị lực',
      'Thân đèn nhôm hàng không phủ sơn tĩnh điện chống ăn mòn muối biển'
    ],
    isFeatured: true,
    stockQuantity: 30,
    warrantyYears: 5
  },
  {
    id: 'prod-003',
    name: 'Đèn Đường Pin Rời Khủng Long Solar Street 500W Dự Án Nông Thôn',
    slug: 'den-duong-pin-roi-solar-street-500w',
    category: 'street',
    categoryName: 'Đèn Đường Pin Rời',
    powerWatt: 500,
    price: 2350000,
    originalPrice: 2900000,
    batteryCapacity: '60.000mAh LiFePO4 Dung Lượng Chuẩn',
    solarPanel: 'Tấm pin Monocrystalline công suất lớn 6V/60W',
    ipRating: 'IP68 Chuẩn Công Trình',
    lightingTime: '15 - 20 giờ (Sáng 2-3 đêm mưa)',
    lightingArea: '300 - 450 m²',
    ledChip: 'Bridgelux USA SMD 5054 (720 chip LED)',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sản phẩm chủ lực cho các dự án thắp sáng đường quê Nông Thôn Mới và công trình đô thị. Tấm pin rời chỉnh góc 360 độ đón nắng tối đa, pin lưu trữ dung lượng lớn đảm bảo sáng thấu đêm ngay cả trong những ngày mưa bão kéo dài.',
    features: [
      'Cảm biến radar vi sóng: phát hiện chuyển động tự tăng 100% sáng, chế độ chờ 30% sáng',
      'Bảo vệ quá nạp, quá xả, tự ngắt thông minh BMS',
      'Đạt chứng nhận kiểm định chất lượng Quatest 3 và tiêu chuẩn CE/RoHS',
      'Hỗ trợ đầy đủ hồ sơ CO/CQ cho công trình dự án'
    ],
    isFeatured: true,
    stockQuantity: 25,
    warrantyYears: 5
  },
  {
    id: 'prod-004',
    name: 'Đèn Trụ Cổng Năng Lượng Mặt Trời Nhôm Đúc Phong Cách Hoàng Gia',
    slug: 'den-tru-cong-mat-troi-nhom-duc-hoang-gia',
    category: 'garden',
    categoryName: 'Đèn Trụ Cổng & Tường Rào',
    powerWatt: 60,
    price: 850000,
    originalPrice: 1100000,
    batteryCapacity: '12.000mAh Lithium Ion',
    solarPanel: 'Tấm pin 4 mặt tích hợp trên mái đèn',
    ipRating: 'IP65 Chống Nước Mưa',
    lightingTime: '10 - 12 giờ',
    lightingArea: '40 - 60 m²',
    ledChip: 'LED 3 chế độ màu (Trắng / Vàng nắng / Trung tính)',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Thiết kế cổ điển châu Âu sang trọng, thân nhôm đúc hoa văn tinh xảo phủ sơn đồng cổ chống rỉ sét. Kính thủy tinh mờ chịu lực tán xạ ánh sáng ấm cúng, tôn vinh đẳng cấp cổng chính và tường rào biệt thự.',
    features: [
      '3 màu ánh sáng tùy chọn qua remote: Trắng tinh khôi, Vàng ấm áp, Trung tính nhẹ dịu',
      'Không cần kéo dây điện nguy hiểm, dễ dàng tự lắp đặt trong 10 phút',
      'Tấm pin mặt trời 4 mặt đón nắng mọi hướng cả ngày',
      'Bền bỉ chịu mưa nắng thời tiết nhiệt đới khắc nghiệt'
    ],
    isFeatured: false,
    stockQuantity: 50,
    warrantyYears: 2
  },
  {
    id: 'prod-005',
    name: 'Đèn Pha Năng Lượng Mặt Trời 200W Gia Đình Solar Flood 200W',
    slug: 'den-pha-nang-luong-mat-troi-200w-gia-dinh',
    category: 'flood',
    categoryName: 'Đèn Pha Gia Đình',
    powerWatt: 200,
    price: 890000,
    originalPrice: 1200000,
    batteryCapacity: '20.000mAh LiFePO4',
    solarPanel: 'Tấm pin Poly 6V/25W',
    ipRating: 'IP67 Chống Nước',
    lightingTime: '10 - 14 giờ',
    lightingArea: '100 - 150 m²',
    ledChip: 'Chip LED SMD 5730 (256 mắt LED)',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lựa chọn phổ biến nhất cho mọi gia đình Việt Nam. Chiếu sáng sân trước, vườn cây, chuồng trại, cổng ngõ. Lắp đặt đơn giản, bền bỉ qua năm tháng với chi phí đầu tư cực kỳ tiết kiệm.',
    features: [
      'Sạc nhanh 4 - 6 giờ nắng là đầy bình',
      'Đèn báo pin LED 5 nấc hiển thị rõ ràng',
      'Remote điều khiển từ xa khoảng cách 10m xuyên tường nhẹ',
      'Đổi mới 1 đổi 1 trong 30 ngày nếu có lỗi kỹ thuật'
    ],
    isFeatured: true,
    stockQuantity: 60,
    warrantyYears: 3
  },
  {
    id: 'prod-006',
    name: 'Đèn Cắm Cỏ Sân Vườn Năng Lượng Mặt Trời Smart Garden 10W (Bộ 4 Chiếc)',
    slug: 'bo-4-den-cam-co-san-vuon-10w',
    category: 'garden',
    categoryName: 'Đèn Cắm Cỏ & Lối Đi',
    powerWatt: 40,
    price: 520000,
    originalPrice: 750000,
    batteryCapacity: '4 x 2.200mAh Lithium',
    solarPanel: 'Tấm pin Polycrystalline trên đầu đèn',
    ipRating: 'IP65 Chống Nước Ngập Nhẹ',
    lightingTime: '8 - 10 giờ',
    lightingArea: '20 - 30 m²',
    ledChip: 'LED Warm White 3000K ấm áp',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-f8185c7f8fb7?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1558441719-f8185c7f8fb7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bộ 4 đèn cắm cỏ năng lượng mặt trời thiết kế tinh gọn cắm trực tiếp vào bãi cỏ, bồn hoa, lối đi dạo sân vườn. Tự động phát sáng lung linh khi màn đêm buông xuống, tạo điểm nhấn cảnh quan lãng mạn cho khuôn viên nhà vườn.',
    features: [
      'Chân cắm nhọn bằng nhựa ABS gia cường, dễ dàng di chuyển vị trí',
      'Ánh sáng vàng ấm 3000K tạo chiều sâu phong cảnh ban đêm',
      'Chống chịu mưa nắng 365 ngày',
      'Combo 4 chiếc siêu tiết kiệm'
    ],
    isFeatured: false,
    stockQuantity: 80,
    warrantyYears: 2
  },
  {
    id: 'prod-007',
    name: 'Đèn Ốp Trần Năng Lượng Mặt Trời Trong Nhà Solar Ceiling 100W',
    slug: 'den-op-tran-nang-luong-mat-troi-100w',
    category: 'indoor',
    categoryName: 'Đèn Trong Nhà & Ban Công',
    powerWatt: 100,
    price: 790000,
    originalPrice: 1050000,
    batteryCapacity: '15.000mAh Lithium LiFePO4',
    solarPanel: 'Tấm pin tách rời 6V/18W kèm dây 5m',
    ipRating: 'IP54 Phù Hợp Trong Nhà & Ban Công',
    lightingTime: '10 - 12 giờ',
    lightingArea: '60 - 80 m²',
    ledChip: 'SMD 2835 Ánh sáng dịu mắt chống cận',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Giải pháp chiếu sáng miễn phí tiền điện ngay trong phòng khách, nhà bếp, phòng ngủ hoặc ban công, gara ô tô. Tấm pin đặt trên mái nhà hứng nắng, đèn ốp gọn gàng trên trần với chao đèn mica chống chói mắt.',
    features: [
      'Điều khiển bật tắt linh hoạt qua công tắc hoặc remote cầm tay',
      'Chiếu sáng dự phòng hoàn hảo những khi khu vực bị mất điện lưới',
      'Không bức xạ nhiệt, an toàn cho trẻ nhỏ và người cao tuổi',
      'Bảo hành chính hãng 2 năm'
    ],
    isFeatured: false,
    stockQuantity: 40,
    warrantyYears: 2
  },
  {
    id: 'prod-008',
    name: 'Đèn Đường Đĩa Bay UFO Năng Lượng Mặt Trời 1000W Chiếu Sáng 360 Độ',
    slug: 'den-ufo-nang-luong-mat-troi-1000w-chieu-360-do',
    category: 'street',
    categoryName: 'Đèn Đường Đĩa Bay UFO',
    powerWatt: 1000,
    price: 2450000,
    originalPrice: 3200000,
    batteryCapacity: '65.000mAh Pin LiFePO4 Khủng',
    solarPanel: 'Tấm pin Mono phủ kín mặt nón trên 6V/65W',
    ipRating: 'IP67 Chống Bão Cực Mạnh',
    lightingTime: '14 - 18 giờ liên tục',
    lightingArea: '350 - 500 m²',
    ledChip: '1200 mắt LED SMD 5730 bố trí vòng tròn 360°',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Thiết kế hình đĩa bay UFO độc đáo với các cụm LED phân bổ tròn đều 360 độ, không có góc chết. Thích hợp ngã ba, ngã tư đường làng, quảng trường, sân thể thao và khuôn viên resort du lịch.',
    features: [
      'Góc tỏa ánh sáng toàn diện 360 độ bán kính chiếu rộng tới 20m',
      'Cảm biến quang học siêu nhạy và cảm biến chuyển động kép',
      'Lắp trên cột phi 76mm hoặc cần cong cực kỳ chắc chắn',
      'Khả năng tản nhiệt vòng tròn tối ưu gia tăng tuổi thọ chip LED'
    ],
    isFeatured: true,
    stockQuantity: 20,
    warrantyYears: 5
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Sản Phẩm', count: 8 },
  { id: 'street', name: 'Đèn Đường Mặt Trời', count: 3 },
  { id: 'flood', name: 'Đèn Pha Siêu Sáng', count: 2 },
  { id: 'garden', name: 'Đèn Sân Vườn & Trụ Cổng', count: 2 },
  { id: 'indoor', name: 'Đèn Trong Nhà & Ban Công', count: 1 }
];

export const POWER_OPTIONS = [
  { label: 'Tất cả công suất', value: 'all' },
  { label: 'Dưới 100W', value: 'under-100' },
  { label: '100W - 200W', value: '100-200' },
  { label: '300W', value: '300' },
  { label: '500W', value: '500' },
  { label: '1000W Siêu Khủng', value: '1000' }
];
