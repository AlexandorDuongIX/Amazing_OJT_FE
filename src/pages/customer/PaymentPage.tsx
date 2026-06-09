import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Loading from '../../components/Loading'

interface Order {
  id: string
  total: number
  paymentStatus: string
  createdAt: string
}

export default function PaymentPage() {
  const navigate = useNavigate()

  const [processing, setProcessing] =
    useState<boolean>(false)

  const handlePayment = (): void => {
    setProcessing(true)

    setTimeout(() => {
      const order: Order = {
        id: `AMZ-${Date.now()}`,
        total: 1280000,
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(
        'latestOrder',
        JSON.stringify(order)
      )

      setProcessing(false)

      navigate('/success')
    }, 3000)
  }

  if (processing) {
    return (
      <Loading
        variant="fullscreen"
        text="Đang xử lý thanh toán..."
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-section-gap">
      <h1 className="text-5xl font-headline mb-10">
        Xác nhận thanh toán
      </h1>

      <div className="bg-surface-container-low p-10">
        <div className="flex justify-between mb-4">
          <span>Tạm tính</span>
          <span>1.250.000 VNĐ</span>
        </div>

        <div className="flex justify-between mb-4">
          <span>Phí vận chuyển</span>
          <span>30.000 VNĐ</span>
        </div>

        <div className="flex justify-between font-bold text-xl mb-8">
          <span>Tổng cộng</span>
          <span>1.280.000 VNĐ</span>
        </div>

        <Button
          variant="gold"
          fullWidth
          onClick={handlePayment}
        >
          Thanh toán ngay
        </Button>
      </div>
    </div>
  )
}