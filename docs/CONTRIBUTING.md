# CONTRIBUTING — Quy trình làm việc

---

## Git flow

**Base branch:** `main`

**Branch naming:**
- Tính năng mới: `feature/<tên-ngắn-gọn>`
- Sửa lỗi: `fix/<tên-lỗi>`
- Refactor không thêm tính năng: `refactor/<mô-tả>`
- Cấu hình, tooling: `chore/<mô-tả>`

Ví dụ: `feature/mini-cart`, `fix/product-filter-reset`, `chore/add-path-alias`

Luôn tạo branch từ `main` đã được cập nhật mới nhất.

---

## Commit message

Dùng **Conventional Commits**:

```
<type>(<scope>): <mô tả ngắn>
```

| Type | Dùng khi |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `refactor` | Đổi cấu trúc code, không thêm tính năng, không sửa bug |
| `chore` | Cấu hình, dependency, tooling |
| `docs` | Chỉ sửa tài liệu |
| `style` | Chỉ sửa format, whitespace (không ảnh hưởng logic) |

**Scope** là tên feature hoặc khu vực bị ảnh hưởng: `cart`, `product`, `auth`, `navbar`, `config`.

Ví dụ:
```
feat(cart): add mini cart popup with item count badge
fix(product): correct price filter not resetting on category change
chore(config): add @/ path alias to vite and tsconfig
refactor(button): replace manual class join with cn()
```

---

## Pull Request

**Kích thước PR:** nhỏ — 1 tính năng hoặc 1 bugfix mỗi PR. PR lớn khó review và dễ conflict.

**Mô tả PR phải có:**
- **Làm gì:** tóm tắt thay đổi trong 2-3 câu
- **Screenshot:** ảnh trước/sau nếu có thay đổi UI
- **Cách test:** các bước để reviewer kiểm tra tính năng

---

## Review checklist

Trước khi approve PR, kiểm tra:

- [ ] Đặt tên file, component, hook, service đúng conventions trong `PROJECT-RULES.md`?
- [ ] Không hardcode màu, font, hay giá trị spacing thô — dùng Tailwind token?
- [ ] Component không tự gọi API — data đến từ props hoặc store?
- [ ] Class có điều kiện dùng `cn()`, không nối chuỗi thủ công?
- [ ] Import dùng alias `@/`, không có `../../`?
- [ ] Không có `any` trong TypeScript?
- [ ] UI responsive ổn trên mobile và desktop?
- [ ] Không để `console.log` debug thừa?
