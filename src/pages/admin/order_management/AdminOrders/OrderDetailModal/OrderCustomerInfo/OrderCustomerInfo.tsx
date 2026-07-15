import type { AdminOrderCustomer } from '@/types/adminOrder'

interface OrderCustomerInfoProps {
  customer: AdminOrderCustomer
  paymentMethod: string
}

export default function OrderCustomerInfo({ customer, paymentMethod }: OrderCustomerInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
          Khách hàng
        </p>
        <p className="font-body text-[14px] font-semibold text-primary">{customer.name}</p>
        <p className="font-body text-[13px] text-on-surface-variant">{customer.email}</p>
        <p className="font-body text-[13px] text-on-surface-variant">{customer.phone}</p>
        <p className="font-body text-[13px] text-on-surface-variant">{customer.address}</p>
      </div>
      <div>
        <p className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
          Phương thức thanh toán
        </p>
        <p className="font-body text-[14px] text-primary">{paymentMethod}</p>
      </div>
    </div>
  )
}
