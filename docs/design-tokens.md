# Design Tokens — Ý nghĩa và cách dùng

**Nguồn sự thật duy nhất:** `src/index.css` — block `@theme` (Tailwind CSS v4).
Dự án không có `tailwind.config.js`. Mọi token được khai báo dưới dạng CSS custom property trong `@theme`, Tailwind tự sinh utility class tương ứng.

Khi cần thêm token mới: thêm vào `src/index.css`, không tạo file config riêng.

---

## Color — Vai trò

Hệ thống màu theo **Material Design 3**, gồm các nhóm:

### Nhóm primary (đen)
Dùng cho: nền tối, text chính, các element nổi bật trên nền sáng, CTA thứ cấp.
- `primary` — màu chủ đạo tối nhất
- `on-primary` — text/icon đặt trên nền `primary`
- `primary-container` — nền của element được highlight nhẹ
- `on-primary-container` — text trên nền `primary-container`

### Nhóm secondary (vàng gold)
Dùng cho: CTA chính, accent, badge, underline highlight. **Cấm dùng cho text body** vì độ tương phản thấp trên nền sáng.
- `secondary` — accent gold
- `on-secondary` — text đặt trên nền `secondary`
- `secondary-container` — nền vàng nhạt hơn
- `on-secondary-container` — text trên nền `secondary-container`

### Nhóm surface / background (trắng xám)
Dùng cho: nền trang, nền card, nền modal.
- `background`, `surface` — nền chính của trang
- `surface-container-*` (lowest → highest) — các mức nền card, từ nhạt đến đậm hơn
- `on-surface`, `on-background` — text mặc định trên nền sáng

### Nhóm neutral (xám)
Dùng cho: text phụ, border, placeholder, divider.
- `outline` — border, divider
- `outline-variant` — border nhạt hơn
- `on-surface-variant` — text phụ, caption

### Nhóm error (đỏ)
Dùng cho: trạng thái lỗi, validation fail, destructive action.
- `error` — màu lỗi
- `on-error` — text trên nền lỗi
- `error-container` — nền thông báo lỗi nhạt

---

## Typography — Vai trò

### Font families
| Font | Class Tailwind | Dùng cho |
|---|---|---|
| Playfair Display | `font-headline`, `font-display`, `font-serif` | Tiêu đề, headline, display text |
| Montserrat | `font-body`, `font-label`, `font-caption`, `font-sans` | Body text, label, button, caption |

**Quy tắc cứng:** Playfair Display chỉ dành cho tiêu đề/headline. Không dùng cho body text, button, hay label.

### Type scale (từ lớn đến nhỏ)

| Level | Dùng khi nào |
|---|---|
| `display-lg` | Hero section — dòng chữ lớn nhất trang, chỉ 1-2 từ |
| `headline-lg` | Section heading chính |
| `headline-md` | Sub-heading, tiêu đề card lớn |
| `body-lg` | Body text đọc dài, mô tả sản phẩm |
| `body-md` | Body text thông thường, label |
| `label-md` | Button text, tag, badge |
| `caption` | Metadata nhỏ, helper text, timestamp |

Giá trị px thực tế xem tại `src/index.css`. Docs chỉ mô tả *khi nào* dùng, không lưu lại số cụ thể.

---

## Spacing & Layout

| Token | Dùng khi nào |
|---|---|
| `spacing-base` (8px) | Đơn vị gốc — tất cả spacing là bội số của đây |
| `spacing-gutter` (24px) | Khoảng cách giữa columns trong grid |
| `spacing-margin-desktop` (80px) | Padding ngang của container trên desktop |
| `spacing-margin-mobile` (20px) | Padding ngang trên mobile |
| `spacing-section-gap` (120px) | Khoảng cách giữa các section trên cùng 1 page |
| `spacing-container-max` (1440px) | Max-width của layout chính |

**Scope:** Dự án là **desktop-first** — thiết kế cho màn desktop trước, dùng breakpoint `md:` để điều chỉnh về mobile.

---

## Cách dùng trong code

Token được tham chiếu qua **Tailwind utility class**, không bao giờ qua giá trị thô.

- Màu: `bg-primary`, `text-on-primary`, `bg-secondary`, `border-outline`
- Font: `font-headline`, `font-body`, `font-label`
- Khi class có điều kiện: viết thẳng trên `className` bằng template literal + ternary

**Cấm:**
- Hardcode giá trị màu (dù trong `class` hay `style`)
- Hardcode font-family string trong JSX
- Dùng `style={{ color: '...' }}` thay vì class

Nếu cần token chưa có: thêm vào block `@theme` trong `src/index.css`, không bypass bằng giá trị thô.
