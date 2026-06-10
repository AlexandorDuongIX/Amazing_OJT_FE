import { useState } from "react";
import { Info, Ticket, ChevronRight } from "lucide-react";
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
        <p className="text-base font-body">Giao đến địa chỉ</p>
        <p className="text-base font-body">Phí vận chuyển: 50.000 VND</p>
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
        <p className="text-base font-body">Giao hỏa tốc (2h)</p>
        <p className="text-base font-body">Phí vận chuyển: 100.000 VND</p>

        {/* Info icon (top-right) */}
        <span
          className="absolute top-1/2 -translate-y-1/2 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Giao hàng trong vòng 2 giờ (áp dụng nội thành, có thể thay đổi theo điều kiện thực tế)"
        >
          <Info size={20} />
        </span>
      </button>
    </div>
  );
}

function OrderSummary() {
  return (
    <div className="bg-[#D9D9D9]/50 text-black border-[#757575] p-5 h-fit">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-[#757575]">
        <span className="text-base font-bold tracking-wide">Tổng đơn hàng</span>
        <span className="text-base font-bold">
          {ORDER_SUMMARY.itemCount} Sản Phẩm
        </span>
      </div>

      {/* Lines */}
      <div className="py-6 space-y-5 border-b border-[#757575]">
        <div className="flex justify-between text-base">
          <span>Tạm tính</span>
          <span>{ORDER_SUMMARY.subtotal}</span>
        </div>
        <div className="flex justify-between text-base">
          <span>Phí vận chuyển</span>
          <span>{ORDER_SUMMARY.shipping}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-6">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold">Tổng đơn đặt hàng</span>
          <span className="text-base font-bold">{ORDER_SUMMARY.total}</span>
        </div>

        <div className="mt-5 pt-5 border-t border-[#757575]">
          <div className="flex justify-between items-start text-sm gap-4">
            <span className="flex-1 text-left">
              Đã bao gồm thuế giá trị gia tăng
            </span>
            <span className="whitespace-nowrap">
              {ORDER_SUMMARY.vatIncluded}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoucherBox() {
  return (
    <div className="mt-4 border-y border-[#757575] py-4 px-4">
      <button
        type="button"
        className="w-full flex items-center justify-between text-sm text-black group"
      >
        <div className="flex items-center gap-2">
          <Ticket size={16} strokeWidth={1.5} />
          <span>Phiếu giảm giá (1)</span>
        </div>

        <ChevronRight
          size={16}
          strokeWidth={2}
          className="group-hover:translate-x-0.5 transition-transform"
        />
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

  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const handleChange = (field: keyof AddressForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // clear lỗi khi user nhập lại
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<AddressForm> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!form.province.trim()) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!form.ward.trim()) newErrors.ward = "Vui lòng chọn phường";
    if (!form.addressDetail.trim())
      newErrors.addressDetail = "Vui lòng nhập địa chỉ chi tiết";

    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)[3-9][0-9]{8}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-body mb-1">Đăng ký địa chỉ mới</h3>

      <p className="text-sm">
        <span className="text-red-500">* </span>
        <span className="text-black">
          Vui lòng kiểm tra ký địa chỉ của bạn. Sai lệch thông tin có thể khiến
          đơn hàng bị hủy hoặc giao chậm.
        </span>
      </p>

      <p className="text-sm mb-5 text-right">
        <span className="text-black">Bắt buộc </span>
        <span className="text-blue-700">*</span>
      </p>

      <div className="space-y-4">
        {/* Full name */}
        <div>
          <label className="text-base font-body text-gray-700 mb-1 block">
            Họ và Tên <span className="text-blue-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng nhập họ và tên"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`w-full border px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition-colors
              ${errors.fullName ? "border-red-500" : "border-gray-400 focus:border-black"}`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Province */}
        <div>
          <label className="text-base font-body text-gray-700 mb-1 block">
            Thành phố/Tỉnh <span className="text-blue-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng chọn 1 thành phố/tỉnh"
            value={form.province}
            onChange={(e) => handleChange("province", e.target.value)}
            className={`w-full border px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition-colors
              ${errors.province ? "border-red-500" : "border-gray-400 focus:border-black"}`}
          />
          {errors.province && (
            <p className="text-xs text-red-500 mt-1">{errors.province}</p>
          )}
        </div>

        {/* Ward */}
        <div>
          <label className="text-base font-body text-gray-700 mb-1 block">
            Phường <span className="text-blue-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Vui lòng chọn phường của bạn"
            value={form.ward}
            onChange={(e) => handleChange("ward", e.target.value)}
            className={`w-full border px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition-colors
              ${errors.ward ? "border-red-500" : "border-gray-400 focus:border-black"}`}
          />
          {errors.ward && (
            <p className="text-xs text-red-500 mt-1">{errors.ward}</p>
          )}
        </div>

        {/* Address detail */}
        <div>
          <label className="text-base font-body text-gray-700 mb-1 block">
            Chi tiết địa chỉ <span className="text-blue-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Số nhà, số đường, toà nhà,..."
            value={form.addressDetail}
            onChange={(e) => handleChange("addressDetail", e.target.value)}
            className={`w-full border px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition-colors
              ${errors.addressDetail ? "border-red-500" : "border-gray-400 focus:border-black"}`}
          />
          {errors.addressDetail && (
            <p className="text-xs text-red-500 mt-1">{errors.addressDetail}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-base font-body text-gray-700 mb-1 block">
            Số điện thoại <span className="text-blue-700">*</span>
          </label>
          <input
            type="tel"
            placeholder="Vui lòng nhập số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full border px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition-colors
              ${errors.phone ? "border-red-500" : "border-gray-400 focus:border-black"}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-fit px-10 py-2.5 bg-black text-white rounded-full hover:bg-black/90 transition"
          >
            XÁC NHẬN
          </button>
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
      <h3 className="text-sm font-body mb-4">Địa chỉ giao hàng</h3>
      <p className="text-xs text-gray-500 mb-4">
        *Vui lòng kiểm tra ký địa chỉ của bạn. Sai lệch thông tin có thể khiến
        đơn hàng bị hủy hoặc giao chậm.
      </p>

      {/* Saved card */}
      <div className="border border-gray-200 p-4 mb-4 relative">
        {/* Checkmark */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4l3 3 5-6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-sm space-y-0.5">
            <p className="font-body">{address.name}</p>
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
        <Button onClick={onContinue} className="w-full">
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
      <h2 className="text-base font-body mb-1">2. Phương thức thanh toán</h2>
      <p className="text-sm text-gray-400">
        Vui lòng chọn phương thức thanh toán.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type AddressState = "form" | "saved";

export default function Payment() {
  const [shippingOption, setShippingOption] = useState<"standard" | "express">(
    "standard",
  );
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
        Miễn phí giao hàng tiêu chuẩn từ 500.000 VND | Freeship Hỏa tốc cho đơn
        từ 1.000.000 VND.
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-body mb-8 tracking-wide">Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* ── Left column ── */}
          <div>
            {/* Section 1 */}
            <div className="mb-2">
              <h2 className="text-xl font-semibold mb-5">
                1. Tùy chọn giao hàng
              </h2>

              <ShippingOptions
                selected={shippingOption}
                onChange={setShippingOption}
              />

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
          <div className="flex flex-col gap-4 sticky top-24 self-start">
            <OrderSummary />
            <VoucherBox />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
