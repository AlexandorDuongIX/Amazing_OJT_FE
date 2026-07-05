import { create } from 'zustand';
import type { Promotion } from '../data/promotionStorage';

interface PromotionState {
  selectedVoucher: Promotion | null;
  discountAmount: number;
  applyVoucher: (voucher: Promotion, currentTotal: number) => void;
  clearVoucher: () => void;
}

export const usePromotionStore = create<PromotionState>((set) => ({
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