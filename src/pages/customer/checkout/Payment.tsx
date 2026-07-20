import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { useCartStore } from "../cart/cartStore";
import { useAuthStore } from "../auth/authStore";
import { addressApi, type UserAddressDto } from "../../../services/addressApi";
import { orderApi, type CreateOrderRequest } from "../../../services/orderApi";
import { cartApi } from "../../../services/cartApi";

// ─── Types ───────────────────────────────────────────────────────────────────
type ShippingOption = "standard" | "express";
type AddressState = "select" | "form";

// ─── Shipping Options ─────────────────────────────────────────────────────────
function ShippingOptions({
  selected,
  onChange,
}: {
  selected: ShippingOption;
  onChange: (v: ShippingOption) => void;
}) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={() => onChange("standard")}
        className={`flex-1 border px-4 py-3 text-left transition-colors ${
          selected === "standard"
            ? "border-black bg-white"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        <p className="text-sm font-medium">Giao đến địa chỉ</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Phí vận chuyển: 50.000 VND
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange("express")}
        className={`flex-1 border px-4 py-3 text-left transition-colors relative ${
          selected === "express"
            ? "border-black bg-white"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        <p className="text-sm font-medium">Giao hỏa tốc (2h)</p>
        <p className="text-xs text-gray-500 mt-0.2">
          Phí vận chuyển: 100.000 VND
        </p>
        <span
          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          title="Giao hàng trong vòng 2 giờ (áp dụng nội thành, có thể thay đổi theo điều kiện thực tế)"
        >
          <Info size={20} />
        </span>
      </button>
    </div>
  );
}

// ─── Order Summary (Right Column) ─────────────────────────────────────────────
function OrderSummary({
  subtotal,
  shippingCost,
  discountAmount,
}: {
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
}) {
  const formatVND = (amount: number) =>
    amount.toLocaleString("vi-VN") + " VND";

  const total = subtotal + shippingCost - discountAmount;
  const vatAmount = Math.round(total * 0.1);
  const items = useCartStore((s) => s.items);

  return (
    <div className="bg-gray-50 border border-gray-200 p-5 h-fit sticky top-24">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <span className="text-sm font-medium tracking-wide">Tổng đơn hàng</span>
        <span className="text-sm font-medium">
          {items.reduce((s, i) => s + i.quantity, 0)} Sản Phẩm
        </span>
      </div>

      <div className="py-4 space-y-3 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span>{formatVND(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giảm giá</span>
            <span>-{formatVND(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span>{formatVND(shippingCost)}</span>
        </div>
      </div>

      <div className="pt-4 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Tổng đơn đặt hàng</span>
          <span className="text-sm font-semibold">{formatVND(total)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          Đã bao gồm thuế GTGT {formatVND(vatAmount)}
        </p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="py-4 space-y-2 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Sản phẩm trong giỏ
        </p>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-8 h-10 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate">{item.name}</p>
              <p className="text-gray-400">
                {item.size && `Size: ${item.size}`}
                {item.color && ` / Màu: ${item.color}`}
                {` x${item.quantity}`}
              </p>
            </div>
            <span className="font-medium">
              {formatVND(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Select Address Form ──────────────────────────────────────────────────────
function SelectAddress({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
}: {
  addresses: UserAddressDto[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Địa chỉ giao hàng</h3>
      <p className="text-xs text-gray-500 mb-4">
        *Vui lòng kiểm tra kỹ địa chỉ của bạn. Sai lệch thông tin có thể khiến đơn hàng bị hủy hoặc giao chậm.
      </p>

      {addresses.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">
          Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`border p-4 cursor-pointer transition-colors ${
                selectedId === addr.id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedId === addr.id
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  {selectedId === addr.id && (
                    <div className="w-3 h-3 rounded-full bg-black" />
                  )}
                </div>
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">
                    {addr.receiverName}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Mặc định)
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600">{addr.addressLine}</p>
                  {addr.district && <p className="text-gray-600">{addr.district}</p>}
                  {addr.province && <p className="text-gray-600">{addr.province}</p>}
                  <p className="text-gray-600">{addr.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" onClick={onAddNew} className="w-full">
        + THÊM ĐỊA CHỈ MỚI
      </Button>
    </div>
  );
}

// ─── New Address Form ─────────────────────────────────────────────────────────
function NewAddressForm({
  onConfirm,
  onBack,
}: {
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    receiverName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressLine: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = form.receiverName.trim() && form.phone.trim() && form.addressLine.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError("");

    try {
      await addressApi.createAddress({
        receiverName: form.receiverName,
        phone: form.phone,
        addressLine: form.addressLine,
        ward: form.ward || undefined,
        district: form.district || undefined,
        province: form.province || undefined,
        isDefault: false,
      });
      onConfirm();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể lưu địa chỉ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-black cursor-pointer">
          ← Quay lại
        </button>
        <h3 className="text-sm font-semibold">Thêm địa chỉ mới</h3>
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-3 bg-red-50 p-2">{error}</p>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng nhập họ và tên"
            value={form.receiverName}
            onChange={(e) => handleChange("receiverName", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Vui lòng nhập số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Thành phố/Tỉnh
          </label>
          <input
            type="text"
            placeholder="Vui lòng nhập thành phố/tỉnh"
            value={form.province}
            onChange={(e) => handleChange("province", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Quận/Huyện
            </label>
            <input
              type="text"
              placeholder="Quận/Huyện"
              value={form.district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Phường/Xã
            </label>
            <input
              type="text"
              placeholder="Phường/Xã"
              value={form.ward}
              onChange={(e) => handleChange("ward", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Chi tiết địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Số nhà, tên đường, toà nhà,..."
            value={form.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="pt-2">
          <Button
            variant="primary-border"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="w-fit px-10"
          >
            {submitting ? "ĐANG LƯU..." : "XÁC NHẬN"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Method (Step 2) ──────────────────────────────────────────────────
function PaymentMethod() {
  return (
    <div className="mt-10">
      <h2 className="text-base font-semibold mb-1">
        <CreditCard size={18} className="inline mr-2" />
        2. Phương thức thanh toán
      </h2>
      <p className="text-sm text-gray-400">
        Vui lòng chọn phương thức thanh toán. Hiện tại chỉ hỗ trợ thanh toán khi nhận hàng (COD).
      </p>
      <div className="mt-3 p-4 border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</p>
            <p className="text-xs text-gray-400">Thanh toán bằng tiền mặt khi nhận được hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Payment Page ────────────────────────────────────────────────────────
export default function Payment() {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shippingOption, setShippingOption] = useState<ShippingOption>("standard");
  const [addressState, setAddressState] = useState<AddressState>("select");
  const [addresses, setAddresses] = useState<UserAddressDto[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const shippingCost = shippingOption === "express" ? 100000 : 50000;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const formatVND = (amount: number) =>
    amount.toLocaleString("vi-VN") + " VND";

  // Load addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const data = await addressApi.getMyAddresses();
        setAddresses(data);
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (err) {
        console.warn("Không thể tải địa chỉ:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, [user, navigate]);

  // Redirect to cart if empty
  if (!user) {
    navigate("/login");
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="h-[80px]" />
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-20 text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-semibold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-500 mb-6">Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
          <Button variant="gold" onClick={() => navigate("/collections")}>
            MUA SẮM NGAY
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="h-[80px]" />
        <main className="flex-1 flex items-center justify-center">
          <Loading />
        </main>
        <Footer />
      </div>
    );
  }

  const getSelectedAddress = () =>
    addresses.find((a) => a.id === selectedAddressId) || null;

const syncLocalItemsToServer = async (): Promise<boolean> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return false;

    let serverProductIds = new Set<number>();

    try {
      // Try to fetch existing cart from server
      const serverCart = await cartApi.getCartByUserId(userId);
      serverProductIds = new Set(serverCart.items?.map(i => i.productId) ?? []);
    } catch (err: any) {
      // 404 means cart doesn't exist yet - that's OK, we'll create it by adding items
      if (err?.response?.status !== 404) {
        console.warn('Failed to fetch server cart:', err);
      }
    }

    // Add items that exist locally but not on server
    for (const item of items) {
      const productId = parseInt(item.id, 10);
      if (isNaN(productId)) continue;

      if (!serverProductIds.has(productId)) {
        try {
          await cartApi.addToCart(userId, { productId, quantity: item.quantity });
          serverProductIds.add(productId);
        } catch (addErr) {
          console.warn(`Failed to sync product ${productId} to server:`, addErr);
        }
      }
    }

    return serverProductIds.size > 0;
  };

  const handlePlaceOrder = async () => {
    const addr = getSelectedAddress();
    if (!addr) {
      setError("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Sync local items to server before placing order
      if (user?.id) {
        await syncLocalItemsToServer();
      }

      const orderData: CreateOrderRequest = {
        shippingAddress: addr.addressLine,
        city: addr.province || undefined,
        state: addr.district || undefined,
        phoneNumber: addr.phone,
        country: "Vietnam",
        notes: shippingOption === "express" ? "Giao hỏa tốc (2h)" : undefined,
      };

      const order = await orderApi.placeOrder(orderData);
      localStorage.setItem("latestOrder", JSON.stringify(order));
      useCartStore.getState().clearCart();
      navigate("/order-success");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Đặt hàng thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="h-[80px]" />

      <div className="w-fit mx-auto px-10 py-2 bg-black text-white text-xs tracking-wide text-center">
        Miễn phí giao hàng tiêu chuẩn từ 500.000 VND | Freeship Hỏa tốc cho đơn từ 1.000.000 VND.
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-xl font-semibold mb-8 tracking-wide">
          <MapPin size={20} className="inline mr-2" />
          Thanh Toán
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* ── Left Column ── */}
          <div>
            {/* Section 1: Shipping */}
            <div className="mb-8">
              <h2 className="text-base font-semibold mb-5">
                <ShoppingBag size={18} className="inline mr-2" />
                1. Tùy chọn giao hàng
              </h2>

              <ShippingOptions selected={shippingOption} onChange={setShippingOption} />

              <p className="text-xs text-gray-400 mb-3">
                Phí vận chuyển: <strong>{formatVND(shippingCost)}</strong>
              </p>

              {addressState === "form" ? (
                <NewAddressForm
                  onConfirm={async () => {
                    // Refresh addresses after adding new one
                    try {
                      const data = await addressApi.getMyAddresses();
                      setAddresses(data);
                      const newAddr = data[data.length - 1];
                      if (newAddr) setSelectedAddressId(newAddr.id);
                    } catch {}
                    setAddressState("select");
                  }}
                  onBack={() => setAddressState("select")}
                />
              ) : (
                <SelectAddress
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onAddNew={() => setAddressState("form")}
                />
              )}
            </div>

            {/* Section 2: Payment */}
            <PaymentMethod />

            {/* Place Order Button */}
            <div className="mt-8">
              <Button
                variant="gold"
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedAddressId}
                className="w-full sm:w-auto px-12"
              >
                {submitting ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Bằng cách đặt hàng, bạn đồng ý với điều khoản và điều kiện của chúng tôi.
              </p>
            </div>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <OrderSummary
            subtotal={subtotal}
            shippingCost={shippingCost}
            discountAmount={0}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

