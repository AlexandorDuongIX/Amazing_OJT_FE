import { useState } from 'react'
import Button from '../../components/Button'

interface CheckoutForm {
  fullName: string
  phone: string
  email: string
  address: string
}

type PaymentMethod =
  | 'COD'
  | 'VNPAY'
  | 'MOMO'
  | 'ZALOPAY'

export default function CheckoutPage() {
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  })

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('COD')

  return (
    <div className="max-w-[1440px] mx-auto px-margin-desktop py-section-gap">
      <h1 className="font-headline text-[48px] mb-12">
        Thanh toán
      </h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Thông tin giao hàng */}
        <div>
          <h2 className="font-headline text-2xl mb-6">
            Thông tin nhận hàng
          </h2>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border p-4"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
            />

            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full border p-4"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-4"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Địa chỉ giao hàng"
              className="w-full border p-4 min-h-[120px]"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Thanh toán */}
        <div>
          <h2 className="font-headline text-2xl mb-6">
            Phương thức thanh toán
          </h2>

          <div className="space-y-4">
            <label className="block border p-5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'COD'}
                onChange={() =>
                  setPaymentMethod('COD')
                }
              />

              <span className="ml-3">
                Thanh toán khi nhận hàng (COD)
              </span>
            </label>

            <label className="block border p-5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'VNPAY'}
                onChange={() =>
                  setPaymentMethod('VNPAY')
                }
              />

              <span className="ml-3">
                Thanh toán qua VNPAY
              </span>
            </label>

            <label className="block border p-5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'MOMO'}
                onChange={() =>
                  setPaymentMethod('MOMO')
                }
              />

              <span className="ml-3">
                Thanh toán qua MoMo
              </span>
            </label>

            <label className="block border p-5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'ZALOPAY'}
                onChange={() =>
                  setPaymentMethod('ZALOPAY')
                }
              />

              <span className="ml-3">
                Thanh toán qua ZaloPay
              </span>
            </label>
          </div>

          <Button
            href="/payment"
            variant="gold"
            fullWidth
            className="mt-8"
          >
            Tiếp tục thanh toán
          </Button>
        </div>
      </div>
    </div>
  )
}