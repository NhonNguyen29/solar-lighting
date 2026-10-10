export interface AssetOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

// Danh mục ảnh có sẵn trong thư viện assets dành cho sản phẩm đèn năng lượng mặt trời
export const PRESET_ASSETS: AssetOption[] = [
  {
    id: 'asset-street-300w',
    name: 'Ảnh Đèn Đường Liền Thể 300W',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    category: 'street',
  },
  {
    id: 'asset-flood-500w',
    name: 'Ảnh Đèn Pha Sân Bãi 500W Cao Cấp',
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    category: 'flood',
  },
  {
    id: 'asset-street-solar-panel',
    name: 'Ảnh Đèn Đường Tấm Pin Rời Dự Án',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    category: 'street',
  },
  {
    id: 'asset-garden-pillar',
    name: 'Ảnh Đèn Trụ Cổng Nhôm Đúc Hoàng Gia',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    category: 'garden',
  },
  {
    id: 'asset-flood-family',
    name: 'Ảnh Đèn Pha Gia Đình 200W',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    category: 'flood',
  },
  {
    id: 'asset-garden-lawn',
    name: 'Ảnh Đèn Cắm Cỏ Lối Đi Sân Vườn',
    url: 'https://images.unsplash.com/photo-1558441719-f8185c7f8fb7?auto=format&fit=crop&w=800&q=80',
    category: 'garden',
  },
  {
    id: 'asset-ceiling-indoor',
    name: 'Ảnh Đèn Ốp Trần Trong Nhà & Ban Công',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    category: 'indoor',
  },
  {
    id: 'asset-ufo-1000w',
    name: 'Ảnh Đèn Đường Đĩa Bay UFO 1000W 360 Độ',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    category: 'street',
  },
];
