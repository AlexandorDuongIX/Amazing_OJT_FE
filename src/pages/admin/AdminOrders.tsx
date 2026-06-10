interface Order {
  id: string
  customer: string
  total: number
  status: string
}

const orders: Order[] = [
  {
    id: 'AMZ-1001',
    customer: 'Nguyễn Văn A',
    total: 1250000,
    status: 'PAID',
  },
]

export default function AdminOrders() {
  return (
    <div>
      <h1 className="text-4xl font-headline mb-8">
        Orders
      </h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>
                {order.total.toLocaleString()}
              </td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}