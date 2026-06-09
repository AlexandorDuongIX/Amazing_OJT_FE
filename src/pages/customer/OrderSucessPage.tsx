import Button from '../../components/Button'
import Icon from '../../components/Icon'

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
      <Icon name="check-circle" size={120} className="mx-auto text-secondary" />

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
