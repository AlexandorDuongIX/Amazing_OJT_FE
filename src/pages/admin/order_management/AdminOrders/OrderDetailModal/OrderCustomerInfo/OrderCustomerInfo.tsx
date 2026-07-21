import type { AdminOrderCustomer } from '@/types/adminOrder'

interface OrderCustomerInfoProps {
  customer: AdminOrderCustomer
}

export default function OrderCustomerInfo({ customer }: OrderCustomerInfoProps) {
  return (
    <div>
      <p className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
        Khách hàng
      </p>
      <p className="font-body text-[14px] font-semibold text-primary">{customer.name}</p>
      <p className="font-body text-[13px] text-on-surface-variant">{customer.email}</p>
      <p className="font-body text-[13px] text-on-surface-variant">{customer.phone}</p>
      <p className="font-body text-[13px] text-on-surface-variant">{customer.address}</p>
    </div>
  )
}
