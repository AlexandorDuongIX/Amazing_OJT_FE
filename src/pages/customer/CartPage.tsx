import { useState } from 'react'
import Button from '../../components/Button'

interface CartItem {
  id: string
  name: string
  image: string
  quantity: number
  size: string
  price: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Áo Khoác Premium',
      image: 'https://picsum.photos/200',
      quantity: 1,
      size: 'L',
      price: 1250000,
    },
  ])

  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item
      )
    )
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  )

  const shippingFee = 30000

  const total = subtotal + shippingFee

  return (
    <div className="max-w-[1440px] mx-auto px-margin-desktop py-section-gap">
      <h1 className="font-headline text-[48px] mb-12">
        Giỏ hàng
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 border-b border-outline-variant py-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover"
              />

              <div className="flex-1">
                <h3 className="font-headline text-xl">
                  {item.name}
                </h3>

                <p>Size: {item.size}</p>

                <p className="font-bold mt-2">
                  {item.price.toLocaleString()} VNĐ
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                    className="w-8 h-8 border"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 border"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-surface-container-low p-8">
          <h2 className="font-headline text-2xl mb-6">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>
                {subtotal.toLocaleString()} VNĐ
              </span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee.toLocaleString()} VNĐ
              </span>
            </div>

            <hr />

            <div className="flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span>
                {total.toLocaleString()} VNĐ
              </span>
            </div>
          </div>

          <Button
            href="/checkout"
            variant="gold"
            fullWidth
            className="mt-8"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  )
}