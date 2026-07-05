import { useState } from "react";
import { create } from 'zustand';
import type { Promotion } from '../data/promotionStorage';
import { Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SavedAddress {
  id: string;
  name: string;
  district: string;
  city: string;
  gender: string;
  phone: string;
}

interface AddressForm {
  fullName: string;
  province: string;
  ward: string;
  addressDetail: string;
  phone: string;
}

interface PromotionState {
  selectedVoucher: Promotion | null;
  discountAmount: number;
  applyVoucher: (voucher: Promotion, currentTotal: number) => void;
  clearVoucher: () => void;
}

const usePromotionStore = create<PromotionState>((set) => ({
  selectedVoucher: null,
  discountAmount: 0,

  applyVoucher: (voucher: Promotion, currentTotal: number) => {
    let discount: number;
    
    // Tính toán số tiền được giảm dựa trên chuỗi định dạng (Ví dụ: '15%' hoặc '$50')
    if (voucher.value.includes('%')) {
      const percentage = parseFloat(voucher.value.replace('%', ''));
      discount = (currentTotal * percentage) / 100;
    } else if (voucher.value.includes('$')) {
      discount = parseFloat(voucher.value.replace('$', ''));
    } else {
      discount = parseFloat(voucher.value) || 0;
    }

    // Đảm bảo số tiền giảm không vượt quá tổng giá trị đơn hàng
    if (discount > currentTotal) {
      discount = currentTotal;
    }

    set({ selectedVoucher: voucher, discountAmount: discount });
  },

  clearVoucher: () => set({ selectedVoucher: null, discountAmount: 0 }),
}));

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SAVED_ADDRESS: SavedAddress = {
  id: "1",
  name: "Nguyễn Văn A (Địa chỉ thành viên)",
  district: "Quận Bình Thạnh",
  city: "TP Hồ Chí Minh",
  gender: "Nam",
  phone: "0123 456 789",
};

const ORDER_SUMMARY = {
  itemCount: 3,
  subtotal: "2.580.000 VND",
  shipping: "0 VND",
  total: "2.580.000 VND",
  vatIncluded: "239.091 VND",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ShippingOptions({
  selected,
  onChange,
}: {
  selected: "standard" | "express";
  onChange: (v: "standard" | "express") => void;
}) {
  return (
    <div className="flex gap-3 mb-6">
      {/* Standard */}
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

      {/* Express */}
      <button
        type="button"
        onClick={() => onChange("express")}
        className={`flex-1 border px-4 py-3 text-left transition-colors relative ${
          selected === "express"
            ? "border-black bg-white"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        {/* Content */}
        <p className="text-sm font-medium">Giao hỏa tốc (2h)</p>
        <p className="text-xs text-gray-500 mt-0.2">
          Phí vận chuyển: 100.000 VND
        </p>

        {/* Info icon (top-right) */}
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

function OrderSummary() {
  const { discountAmount } = usePromotionStore();
  return (
    <div className="bg-gray-50 border border-gray-200 p-5 h-fit sticky top-24">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <span className="text-sm font-medium tracking-wide">Tổng đơn hàng</span>
        <span className="text-sm font-medium">{ORDER_SUMMARY.itemCount} Sản Phẩm</span>
      </div>

      {/* Lines */}
      <div className="py-4 space-y-3 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span>{ORDER_SUMMARY.subtotal}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giảm giá</span>
            <span>-{discountAmount.toLocaleString('vi-VN')} VND</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span>{ORDER_SUMMARY.shipping}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Tổng đơn đặt hàng</span>
          <span className="text-sm font-semibold">{ORDER_SUMMARY.total}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          Đã bao gồm thuế giá trị gia tăng {ORDER_SUMMARY.vatIncluded}
        </p>
      </div>

      {/* Voucher */}
      <button
        type="button"
        className="w-full flex items-center justify-between pt-4 text-sm text-gray-600 hover:text-black transition-colors group"
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="10" rx="1" />
            <path d="M12 7v10M2 12h3m14 0h3" strokeLinecap="round" />
          </svg>
          <span>Phiếu giảm giá (1)</span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="group-hover:translate-x-0.5 transition-transform"
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Address Form (State 1) ───────────────────────────────────────────────────
function NewAddressForm({ onConfirm }: { onConfirm: () => void }) {
  const [form, setForm] = useState<AddressForm>({
    fullName: "",
    province: "",
    ward: "",
    addressDetail: "",
    phone: "",
  });

  const handleChange = (field: keyof AddressForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = Object.values(form).every((v) => v.trim() !== "");

  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">Đăng ký địa chỉ mới</h3>
      <p className="text-xs text-gray-500 mb-1">
        *Vui lòng kiểm tra ký địa chỉ của bạn. Sai lệch thông tin có thể khiến đơn hàng bị hủy
        hoặc giao chậm.
      </p>
      <p className="text-xs text-gray-400 mb-5 text-right">Bắt buộc *</p>

      <div className="space-y-4">
        {/* Full name */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng nhập họ và tên"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Province */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Thành phố/Tỉnh <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng chọn 1 thành phố/tỉnh"
            value={form.province}
            onChange={(e) => handleChange("province", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Ward */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Phường <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng chọn phường của bạn"
            value={form.ward}
            onChange={(e) => handleChange("ward", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Address detail */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Chi tiết địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Số nhà, số đường, toà nhà,..."
            value={form.addressDetail}
            onChange={(e) => handleChange("addressDetail", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Số điện thoại</label>
          <input
            type="tel"
            placeholder="Vui lòng nhập số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="pt-2">
          <Button
            variant="primary-border"
            onClick={onConfirm}
            disabled={!isValid}
            className="w-fit px-10"
          >
            XÁC NHẬN
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Saved Address card (State 2) ─────────────────────────────────────────────
function SavedAddressCard({
  address,
  onEdit,
  onRegisterNew,
  onContinue,
}: {
  address: SavedAddress;
  onEdit: () => void;
  onRegisterNew: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Địa chỉ giao hàng</h3>
      <p className="text-xs text-gray-500 mb-4">
        *Vui lòng kiểm tra ký địa chỉ của bạn. Sai lệch thông tin có thể khiến đơn hàng bị hủy
        hoặc giao chậm.
      </p>

      {/* Saved card */}
      <div className="border border-gray-200 p-4 mb-4 relative">
        {/* Checkmark */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm space-y-0.5">
            <p className="font-medium">{address.name}</p>
            <p className="text-gray-600">{address.district}</p>
            <p className="text-gray-600">{address.gender}</p>
            <p className="text-gray-600">{address.city}</p>
            <p className="text-gray-600">{address.phone}</p>
          </div>
        </div>

        {/* Edit / Current label */}
        <div className="flex gap-3 mt-3 ml-8 text-xs">
          <button
            type="button"
            onClick={onEdit}
            className="underline text-gray-600 hover:text-black transition-colors"
          >
            Sửa
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">Địa chỉ hiện tại</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <Button variant="outline" onClick={onRegisterNew} className="w-full">
          ĐĂNG KÝ ĐỊA CHỈ MỚI
        </Button>
        <Button
          variant="primary-border"
          onClick={onContinue}
          className="w-full"
        >
          TIẾP TỤC
        </Button>
      </div>
    </div>
  );
}

// ─── Payment methods (Step 2) ─────────────────────────────────────────────────
function PaymentMethod() {
  return (
    <div className="mt-10">
      <h2 className="text-base font-semibold mb-1">2. Phương thức thanh toán</h2>
      <p className="text-sm text-gray-400">Vui lòng chọn phương thức thanh toán.</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type AddressState = "form" | "saved";

export default function Payment() {
  const [shippingOption, setShippingOption] = useState<"standard" | "express">("standard");
  const [addressState, setAddressState] = useState<AddressState>("form");

  // Simulate: toggle between states for demonstration
  // In production, check if user has saved address from API
  const hasSavedAddress = addressState === "saved";

  const handleFormConfirm = () => {
    setAddressState("saved");
  };

  const handleEdit = () => {
    setAddressState("form");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Promo banner */}
      <div className="h-[80px]"></div>

      <div className="w-fit mx-auto px-10 py-2 bg-black text-white text-xs tracking-wide text-center">
        Miễn phí giao hàng tiêu chuẩn từ 500.000 VND | Freeship Hỏa tốc cho đơn từ 1.000.000 VND.
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-xl font-semibold mb-8 tracking-wide">Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* ── Left column ── */}
          <div>
            {/* Section 1 */}
            <div className="mb-2">
              <h2 className="text-base font-semibold mb-5">1. Tùy chọn giao hàng</h2>

              <ShippingOptions selected={shippingOption} onChange={setShippingOption} />

              {hasSavedAddress ? (
                <SavedAddressCard
                  address={MOCK_SAVED_ADDRESS}
                  onEdit={handleEdit}
                  onRegisterNew={handleEdit}
                  onContinue={() => alert("Tiếp tục thanh toán!")}
                />
              ) : (
                <NewAddressForm onConfirm={handleFormConfirm} />
              )}
            </div>

            {/* Section 2 */}
            <PaymentMethod />
          </div>

          {/* ── Right column: Order summary ── */}
          <OrderSummary />
        </div>
      </main>

      <Footer />
    </div>
  );
}
