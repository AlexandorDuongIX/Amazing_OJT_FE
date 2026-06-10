# PROJECT-RULES — Quy tắc viết code

File này là tài liệu AI đọc trước khi sinh code và người mới đọc trước khi tạo PR.

---

## Naming

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| File component | PascalCase | `MiniCart.tsx`, `ProductCard.tsx` |
| File hook | camelCase, prefix `use` | `useCartStore.ts`, `useDebounce.ts` |
| File service | camelCase, suffix `Service` | `productService.ts`, `orderService.ts` |
| File util/helper | camelCase | `formatVND.ts`, `formatDate.ts` |
| Type / Interface | PascalCase, không prefix `I` | `Product`, `CartItem`, `OrderStatus` |
| Props interface | `<Component>Props`, đặt cùng file | `ProductCardProps` trong `ProductCard.tsx` |
| Zustand store | `useXxxStore` | `useCartStore`, `useAuthStore` |
| Store action | động từ | `addItem`, `removeItem`, `clearCart` |

---

## Component pattern

- Chỉ dùng **functional component**. Không class component.
- Props luôn khai báo bằng `interface`, không dùng `type` cho props.
- Dự án tự build UI từ Tailwind — chưa có component library.
- Khi 1 component có nhiều biến thể (size, color, style): dùng **variant prop**, không tạo 2 component riêng.
- **Khi nào tách component mới:**
  - Tái dùng ở 2 nơi trở lên → tách ra `src/components/`
  - Component cha dài hơn ~150 dòng logic → tách phần hiển thị ra
  - Chưa cần → để inline trong file page

- **Sub-component inline trong file page:** đặt tên đầy đủ và có ngữ nghĩa (`ProductCard`, không phải `Card`), không export. Khi cần dùng ở nơi thứ 2 → tách file riêng và export.

- **Event handler naming:**
  - Prop callback nhận từ ngoài: prefix `on` + động từ — `onAdd`, `onClose`, `onSelect`
  - Handler định nghĩa bên trong component: prefix `handle` + động từ — `handleAdd`, `handleClose`
  - Không trộn lẫn hai convention trong cùng codebase

---

## Async state pattern

Mọi thao tác async (fetch data, form submit) phải xử lý đủ 3 trạng thái — không được bỏ sót bất kỳ trạng thái nào:

| Trạng thái | Yêu cầu |
|---|---|
| **Loading** | Hiện skeleton hoặc spinner — không để UI trống trắng |
| **Error** | Hiện thông báo lỗi người dùng đọc được — không chỉ `console.error` |
| **Empty** | Hiện empty state có nghĩa — không để lưới/danh sách trống không giải thích |

Đặt tên 3 biến state nhất quán: `data`, `loading`, `error` — để dễ scan khi review.

---

## State management

| Loại state | Dùng gì |
|---|---|
| State dùng chung (cart, auth, user preferences) | Zustand store |
| State cục bộ (popup open/close, hover, form input) | `useState` |
| State phái sinh từ props/store | `useMemo` / selector |

**Quy tắc store:**
- Action đặt tên là động từ rõ nghĩa: `addItem`, không phải `item` hay `setItem`.
- Không để side effect trong store: không gọi API, không hiện toast bên trong action.
- Cart store phải dùng `persist` middleware để sống sót qua reload.

---

## Tailwind trên className

- Luôn viết Tailwind class **thẳng trên `className`** — không dùng utility wrapper như `cn()`.
- Class có điều kiện: dùng template literal + ternary hoặc array `.filter(Boolean).join(' ')`.
- Ưu tiên design token: `text-primary`, `bg-secondary`, `font-headline`.
- Cấm hardcode giá trị màu hoặc font thô — nếu token chưa tồn tại, thêm vào `src/index.css`.
- Không dùng inline style (`style={{...}}`) trừ giá trị động thật sự không biểu diễn được bằng class (ví dụ: width tính từ JS).

---

## Import

- Dùng alias `@/` cho mọi import nội bộ: `@/components/Button`, `@/store/useCartStore`.
- Cấm `../../` — alias `@/` cần cấu hình trong `vite.config.ts` và `tsconfig.app.json` trước khi dùng.
- **Thứ tự import trong file:**
  1. Thư viện ngoài (`react`, `react-router-dom`, `zustand`)
  2. Alias `@/` (component, store, service, type)
  3. File cùng folder (`./Button`, `./styles`)

---

## Anti-patterns (tuyệt đối tránh)

| Tránh | Thay bằng |
|---|---|
| `fetch` hoặc `axios` trong component | Gọi qua service, kết quả lưu store |
| Hardcode màu (`#D4AF37`) hoặc font | Dùng Tailwind token (`text-secondary`) |
| Prop drilling quá 2 cấp khi đã có store | Dùng Zustand store |
| `any` trong TypeScript | Type rõ ràng hoặc `unknown` nếu thật sự không biết |
| Class component | Functional component |
| Comment giải thích *cái gì* code làm | Tên biến/hàm tốt thay thế comment |
