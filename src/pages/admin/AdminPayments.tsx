interface Payment {
  id: string
  orderId: string
  customer: string
  amount: number
  status: string
}

const payments: Payment[] = [
  {
    id: 'PM001',
    orderId: 'AMZ-1001',
    customer: 'Nguyễn Văn A',
    amount: 1250000,
    status: 'PAID',
  },
]

export default function AdminPayments() {
  return (
    <div>
      <h1 className="text-4xl font-headline mb-8">
        Payments
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Đơn hàng</th>
            <th>Khách hàng</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.orderId}</td>
              <td>{payment.customer}</td>
              <td>
                {payment.amount.toLocaleString()}
              </td>
              <td>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}