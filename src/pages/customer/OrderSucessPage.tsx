import Button from '../../components/Button'

interface Order {
  id?: string
  total?: number
  paymentStatus?: string
  createdAt?: string
}

export default function OrderSuccessPage() {
  const order: Order = JSON.parse(
    localStorage.getItem('latestOrder') || '{}'
  )

  return (
    <div className="max-w-3xl mx-auto text-center py-section-gap">
      <span className="material-symbols-outlined text-[120px] text-secondary">
        check_circle
      </span>

      <h1 className="text-5xl font-headline mt-6 mb-6">
        Thanh toán thành công
      </h1>

      <p className="text-lg mb-4">
        Mã đơn hàng:
      </p>

      <p className="font-bold text-2xl mb-10">
        {order.id ?? 'N/A'}
      </p>

      <Button
        href="/"
        variant="gold"
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  )
}
