# DESIGN SYSTEM SPECIFICATION — SOLAR LIGHT

> **Phong cách thẩm mỹ**: **Eco-Tech & Clean Solar Energy** — Hiện đại, sang trọng, mang lại cảm giác tin cậy, công nghệ sạch và thân thiện môi trường. Tông màu xanh lá sinh thái kết hợp ánh vàng mặt trời năng động trên nền tối tương phản cao hoặc nền sáng thanh lịch.

---

## 1. Bảng Màu Chuẩn (Semantic Color Palette)

```css
:root {
  /* Nền và Bề mặt (Surface & Background) */
  --color-bg-main: #0b1315;          /* Xanh đen than hoạt tính - sâu lắng, công nghệ */
  --color-bg-card: #132226;          /* Nền thẻ sản phẩm, hộp thông tin */
  --color-bg-subtle: #1c3137;        /* Nền hover, ô input, dropdown */
  --color-border: #26434b;           /* Đường viền tinh tế */

  /* Màu Thương Hiệu Chủ Đạo (Brand Colors) */
  --color-primary: #10b981;          /* Xanh ngọc lục bảo (Emerald Green) - Năng lượng sạch */
  --color-primary-hover: #059669;    
  --color-primary-light: #d1fae5;

  /* Màu Điểm Nhấn Năng Lượng Mặt Trời (Solar Accent) */
  --color-solar: #f59e0b;            /* Vàng hổ phách ánh nắng mặt trời (Amber Solar) */
  --color-solar-glow: #fbbf24;       /* Vàng rực rỡ cho icon năng lượng, tia sáng, rating */
  --color-solar-hover: #d97706;

  /* Màu Chữ & Văn Bản (Typography Colors) */
  --color-text-main: #f8fafc;        /* Trắng sáng tương phản cao */
  --color-text-muted: #94a3b8;       /* Xám bạc cho mô tả phụ, thông số */
  --color-text-inverted: #0f172a;    /* Chữ tối dùng trên nền nút màu sáng */

  /* Trạng Thái Hệ Thống (Feedback Status) */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #0ea5e9;
}
```

---

## 2. Hệ Thống Typography (Google Fonts)

- **Font Tiêu đề & Logo (Headings)**: `'Outfit'`, sans-serif — Bo tròn hiện đại, mang hơi thở công nghệ cao.
- **Font Nội dung & Thông số kỹ thuật (Body & Monospace)**: `'Inter'`, sans-serif — Rõ ràng, dễ đọc ở mọi kích cỡ màn hình, hỗ trợ hiển thị số liệu hoàn hảo.
- **Thang kích thước chữ (Type Scale)**:
  - `Display / Hero Title`: 2.5rem – 3.5rem (40px – 56px), `font-weight: 800`, line-height: 1.15.
  - `Heading 1`: 2rem – 2.5rem (32px – 40px), `font-weight: 700`.
  - `Heading 2`: 1.5rem – 1.875rem (24px – 30px), `font-weight: 600`.
  - `Heading 3`: 1.25rem (20px), `font-weight: 600`.
  - `Body Text`: 1rem (16px), line-height: 1.6, `font-weight: 400`.
  - `Small / Badge / Meta`: 0.875rem (14px) & 0.75rem (12px), `font-weight: 500`.

---

## 3. Khoảng Cách (Spacing) & Bán Kính Bo Góc (Border Radius)

- **Spacing Grid**: Hệ số 4px/8px chuẩn mực:
  - `space-1`: 4px | `space-2`: 8px | `space-3`: 12px | `space-4`: 16px | `space-6`: 24px | `space-8`: 32px | `space-12`: 48px
- **Border Radius**:
  - `radius-sm`: 6px (Badge, tag nhỏ)
  - `radius-md`: 10px (Nút bấm, ô input)
  - `radius-lg`: 16px (Card sản phẩm, modal popup)
  - `radius-xl`: 24px (Container lớn, hero banner)
  - `radius-full`: 9999px (Pill badge, nút icon tròn)

---

## 4. Hiệu Ứng Chiếu Sáng & Đổ Bóng (Glow & Shadows)

- **Solar Glow Effect**:
  ```css
  --glow-solar: 0 0 25px -5px rgba(245, 158, 11, 0.35);
  --glow-green: 0 0 25px -5px rgba(16, 185, 129, 0.35);
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  ```
- **Micro-interactions (Hiệu ứng vi mô)**:
  - Hover Card: Thẻ nổi nhẹ lên 4px (`transform: translateY(-4px)`), viền phát sáng nhẹ màu vàng ánh dương.
  - Button Active: Co nhẹ (`transform: scale(0.98)`) tạo cảm giác bấm cơ học đầm tay.

---

## 5. Quy Chuẩn Tiếp Cận WCAG 2.2 AA (Accessibility)
- Tỷ lệ tương phản chữ `--color-text-main` trên `--color-bg-card` đạt $\ge$ 12:1 (vượt chuẩn 4.5:1).
- Tỷ lệ tương phản chữ `--color-text-muted` đạt $\ge$ 5.2:1.
- Nút bấm và liên kết có đường viền chỉ báo khi focus bàn phím: `outline: 2px solid var(--color-solar); outline-offset: 2px;`.
