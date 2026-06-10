# ARCHITECTURE — Cấu trúc và data flow

---

## Layer overview

```
Page
  └─ Component (nhận props, hiển thị)
       └─ Hook (logic tái dùng, gọi store/service)
            └─ Service (điểm duy nhất gọi API)
                 └─ Mock API (hiện tại) / Backend thật (sau này)
```

**Vai trò từng layer:**

| Layer | Làm gì | Không làm gì |
|---|---|---|
| Page | Ghép layout, đọc params/route, gọi store | Chứa logic business phức tạp |
| Component | Hiển thị UI, nhận props, emit callback | Tự gọi API, tự đọc route params |
| Hook | Đóng gói logic tái dùng, kết nối store | Render JSX |
| Service | Gọi API, chuẩn hóa response thành type | Quản lý state, hiện toast |
| Store (Zustand) | Lưu state dùng chung, expose actions | Gọi API, có side effect |

Data chảy **1 chiều**: Service trả data → Store lưu → Component đọc từ store.

---

## Folder structure

Cây `src/` mục tiêu (một số folder chưa tồn tại, cần tạo khi bắt đầu feature tương ứng):

```
src/
├── types/          # Tất cả shared type/interface (Product, Order, CartItem...)
├── services/       # Hàm gọi API — điểm swap Mock ↔ BE thật
├── store/          # Zustand stores (useCartStore, useAuthStore...)
├── hooks/          # Custom hooks dùng nhiều nơi (useDebounce, useMediaQuery...)
├── utils/          # Helper thuần (formatVND, formatDate...)
├── constants/      # Giá trị không đổi dùng nhiều nơi
├── components/     # UI component dùng chung
│   └── ui/         # Primitive: Button, Modal, Loading, Logo...
├── pages/
│   ├── customer/   # Trang dành cho customer
│   └── admin/      # Trang dành cho admin
├── App.tsx         # Router + layout shell
├── main.tsx        # Entry point
└── index.css       # Design tokens (Tailwind v4 @theme)
```

**Quy tắc đặt file:**
- Dùng ở **1 nơi duy nhất** → đặt cạnh page đó (colocate).
- Dùng ở **2 nơi trở lên** → chuyển vào folder tương ứng trong `src/`.
- Type dùng chung → `src/types/`. Type chỉ dùng trong 1 component → đặt cùng file component.

---

## Routing

Tất cả route khai báo trong `src/App.tsx`.

| Path | Layout | Page |
|---|---|---|
| `/` | CustomerLayout | `HomePage` |
| `/collections` | CustomerLayout | `ProductListPage` |
| `/collections/:category` | CustomerLayout | `ProductListPage` (lọc theo category) |
| `/admin` | AdminLayout | `AdminDashboard` |
| `*` (catch-all) | CustomerLayout | `HomePage` |

**CustomerLayout** bọc: `Navbar` (fixed top, 80px) + `<Outlet>` + `Footer`.

**AdminLayout** bọc: sidebar cố định 288px bên trái + vùng main content bên phải.

**RoleSwitcher**: floating button góc phải dưới, dùng để chuyển qua lại giữa Customer và Admin view trong dev — không phải auth thật.

---

## Mock → API swap

Service là **điểm swap duy nhất**. Component và store không biết data đến từ đâu.

**Hiện tại:**
- Base URL lấy từ `VITE_API_BASE_URL` trong `.env`.
- Endpoint đang dùng: `GET /product`.
- MockAPI trả về **plain array** (`Product[]`), không bọc trong `{ data: ... }` — service đọc thẳng `response.data`.

**Quy tắc service:**
- Luôn trả về type đã chuẩn hóa (`Product[]`, `Order[]`) — component không xử lý response shape.
- Nếu API thay đổi cấu trúc trả về, chỉ sửa trong service, không đụng đến component.

**Khi đổi sang backend thật:**
1. Cập nhật `VITE_API_BASE_URL` trong `.env`.
2. Sửa cách bóc data trong service nếu cấu trúc response thay đổi.
3. Không cần sửa bất kỳ component nào.
