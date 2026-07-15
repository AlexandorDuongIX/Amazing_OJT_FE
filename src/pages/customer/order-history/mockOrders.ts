import type { Order } from '@/types/order'

export const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-2025-001',
    date: '10/06/2025',
    status: 'Đã giao',
    items: [
      { name: 'Áo thun Basic White', price: 290000, quantity: 2, image: 'https://picsum.photos/seed/shirt1/64/64' },
    ],
    total: 580000,
  },
  {
    id: '#ORD-2025-002',
    date: '08/06/2025',
    status: 'Đang xử lý',
    items: [
      { name: 'Quần jean Slim Fit', price: 650000, quantity: 1, image: 'https://picsum.photos/seed/jeans1/64/64' },
      { name: 'Áo polo Navy', price: 450000, quantity: 1, image: 'https://picsum.photos/seed/polo1/64/64' },
    ],
    total: 1100000,
  },
  {
    id: '#ORD-2025-003',
    date: '05/06/2025',
    status: 'Đã hủy',
    items: [
      { name: 'Váy hoa midi', price: 780000, quantity: 1, image: 'https://picsum.photos/seed/dress1/64/64' },
    ],
    total: 780000,
  },
  {
    id: '#ORD-2025-004',
    date: '01/06/2025',
    status: 'Đã giao',
    items: [
      { name: 'Áo khoác bomber', price: 1200000, quantity: 1, image: 'https://picsum.photos/seed/jacket1/64/64' },
      { name: 'Áo thun Basic Black', price: 290000, quantity: 2, image: 'https://picsum.photos/seed/shirt2/64/64' },
      { name: 'Quần short kaki', price: 350000, quantity: 1, image: 'https://picsum.photos/seed/shorts1/64/64' },
    ],
    total: 2130000,
  },
  {
    id: '#ORD-2025-005',
    date: '28/05/2025',
    status: 'Đang xử lý',
    items: [
      { name: 'Áo sơ mi Oxford trắng', price: 520000, quantity: 1, image: 'https://picsum.photos/seed/shirt3/64/64' },
    ],
    total: 520000,
  },
  {
    id: '#ORD-2025-006',
    date: '20/05/2025',
    status: 'Đã giao',
    items: [
      { name: 'Đầm maxi hoa nhí', price: 890000, quantity: 1, image: 'https://picsum.photos/seed/dress2/64/64' },
      { name: 'Áo croptop trắng', price: 320000, quantity: 2, image: 'https://picsum.photos/seed/crop1/64/64' },
      { name: 'Quần jogger xám', price: 420000, quantity: 1, image: 'https://picsum.photos/seed/jogger1/64/64' },
      { name: 'Áo thun in họa tiết', price: 280000, quantity: 1, image: 'https://picsum.photos/seed/shirt4/64/64' },
      { name: 'Quần jean ống rộng', price: 680000, quantity: 1, image: 'https://picsum.photos/seed/jeans2/64/64' },
    ],
    total: 2910000,
  },
  {
    id: '#ORD-2025-007',
    date: '15/05/2025',
    status: 'Trả hàng/Hoàn tiền',
    items: [
      { name: 'Áo len cổ lọ', price: 580000, quantity: 1, image: 'https://picsum.photos/seed/sweater1/64/64' },
      { name: 'Quần tây ống đứng', price: 720000, quantity: 1, image: 'https://picsum.photos/seed/pants1/64/64' },
    ],
    total: 1300000,
  },
  {
    id: '#ORD-2025-008',
    date: '10/05/2025',
    status: 'Đã giao',
    items: [
      { name: 'Áo blazer dáng suông', price: 950000, quantity: 1, image: 'https://picsum.photos/seed/blazer1/64/64' },
    ],
    total: 950000,
  },
  {
    id: '#ORD-2025-009',
    date: '05/05/2025',
    status: 'Đã hủy',
    items: [
      { name: 'Chân váy tennis trắng', price: 420000, quantity: 1, image: 'https://picsum.photos/seed/skirt1/64/64' },
      { name: 'Áo thể thao năng động', price: 350000, quantity: 2, image: 'https://picsum.photos/seed/sport1/64/64' },
    ],
    total: 1120000,
  },
  {
    id: '#ORD-2025-010',
    date: '28/04/2025',
    status: 'Đang xử lý',
    items: [
      { name: 'Áo hoodie oversize', price: 650000, quantity: 1, image: 'https://picsum.photos/seed/hoodie1/64/64' },
    ],
    total: 650000,
  },
  {
    id: '#ORD-2025-011',
    date: '20/04/2025',
    status: 'Đã giao',
    items: [
      { name: 'Áo khoác denim', price: 890000, quantity: 1, image: 'https://picsum.photos/seed/denim1/64/64' },
      { name: 'Quần baggy kaki', price: 480000, quantity: 1, image: 'https://picsum.photos/seed/baggy1/64/64' },
      { name: 'Áo thun bo dáng ngắn', price: 260000, quantity: 2, image: 'https://picsum.photos/seed/shirt5/64/64' },
    ],
    total: 1890000,
  },
  {
    id: '#ORD-2025-012',
    date: '12/04/2025',
    status: 'Trả hàng/Hoàn tiền',
    items: [
      { name: 'Áo sơ mi linen beige', price: 490000, quantity: 1, image: 'https://picsum.photos/seed/linen1/64/64' },
    ],
    total: 490000,
  },
  {
    id: '#ORD-2025-013',
    date: '05/04/2025',
    status: 'Đang xử lý',
    items: [
      { name: 'Đầm wrap floral', price: 750000, quantity: 1, image: 'https://picsum.photos/seed/wrap1/64/64' },
      { name: 'Thắt lưng da tổng hợp', price: 180000, quantity: 1, image: 'https://picsum.photos/seed/belt1/64/64' },
    ],
    total: 930000,
  },
]
