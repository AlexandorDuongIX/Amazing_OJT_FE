import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'
import Loading from '../../../components/Loading'
import { orderApi, type OrderResponse } from '../../../services/orderApi'

interface OrderData {
  id?: number
  orderNumber?: string
  totalPrice?: number
  status?: number
  createdAt?: string
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

const statusLabels: Record<number, string> = {
  0: 'Chờ xác nhận',
  1: 'Đang xử lý',
  2: 'Đã gửi hàng',
  3: 'Đã giao',
  4: 'Đã hủy',
  5: 'Trả hàng',
}

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderItems, setOrderItems] = useState<OrderResponse['items']>([])

  useEffect(() => {
    const raw = localStorage.getItem('latestOrder')
    if (!raw) {
      setLoading(false)
      return
    }

    try {
      const parsed: OrderResponse = JSON.parse(raw)
      setOrder({
        id: parsed.id,
        orderNumber: parsed.orderNumber,
        totalPrice: parsed.totalPrice,
        status: parsed.status,
        createdAt: parsed.createdAt,
      })
      setOrderItems(parsed.items || [])

      // Try to fetch fresh data from API
      if (parsed.id) {
        orderApi.getOrderById(parsed.id).then((fresh) => {
          setOrder({
            id: fresh.id,
            orderNumber: fresh.orderNumber,
            totalPrice: fresh.totalPrice,
            status: fresh.status,
            createdAt: fresh.createdAt,
          })
          setOrderItems(fresh.items || [])
        }).catch(() => {
          // Use cached data
        })
      }
    } catch {
      // Invalid JSON
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto text-center py-section-gap px-4">
        <span className="material-symbols-outlined text-[80px] text-gray-300">
          help
        </span>
        <h1 className="text-3xl font-headline mt-6 mb-4">
          Không tìm thấy đơn hàng
        </h1>
        <p className="text-gray-500 mb-8">
          Không có thông tin đơn hàng nào được tìm thấy.
        </p>
        <Button variant="gold" onClick={() => navigate('/')}>
          VỀ TRANG CHỦ
        </Button>
      </div>
    )
  }

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="max-w-3xl mx-auto text-center py-section-gap px-4">
      {/* Success Icon */}
      <span className="material-symbols-outlined text-[120px] text-secondary">
        check_circle
      </span>

      <h1 className="text-4xl sm:text-5xl font-headline mt-6 mb-4">
        Đặt hàng thành công!
      </h1>

      <p className="text-gray-500 mb-2">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.
      </p>

      {/* Order Info Card */}
      <div className="mt-8 mb-10 border border-gray-200 p-6 sm:p-8 text-left max-w-lg mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          Mã đơn hàng:
        </p>
        <p className="font-bold text-xl sm:text-2xl mb-4 font-mono tracking-wide">
          {order.orderNumber ?? `#${order.id}`}
        </p>

        <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
          {createdAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày đặt</span>
              <span className="font-medium">{createdAt}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Trạng thái</span>
            <span className="font-medium text-secondary">
              {statusLabels[order.status ?? 0] ?? 'Đang xử lý'}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="text-gray-500">Tổng thanh toán</span>
            <span className="font-bold text-lg text-on-surface">
              {formatVND(order.totalPrice ?? 0)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        {orderItems.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Sản phẩm đã đặt ({orderItems.length})
            </p>
            <div className="space-y-2">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-gray-600">
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="truncate font-medium">
                      {item.product?.name ?? `Sản phẩm #${item.productId}`}
                    </p>
                    <p className="text-gray-400">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` / Màu: ${item.color}`}
                      {` x${item.quantity}`}
                    </p>
                  </div>
                  <span className="font-medium">{formatVND(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="gold" onClick={() => navigate('/orders')}>
          XEM ĐƠN HÀNG
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          TIẾP TỤC MUA SẮM
        </Button>
      </div>
    </div>
  )
}

