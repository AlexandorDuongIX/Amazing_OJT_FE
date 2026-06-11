import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/customer/HomePage'

import ProductListPage from './pages/customer/ProductListPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import CartPage from './pages/customer/cart/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import PaymentPage from './pages/customer/PaymentPage'
import OrderSuccessPage from './pages/customer/OrderSucessPage'
import OrderHistoryPage from './pages/customer/order-history'
import { LoginPage, RegisterPage } from './pages/customer/AuthPages'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminPayments from './pages/admin/AdminPayments'

function CustomerLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[80px]">
        {children ?? <HomePage />}
      </main>
      <Footer />
    </>
  )
}

function RoleSwitcher() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-background/90 border border-outline-variant/30 rounded-full shadow-2xl p-1.5 flex items-center gap-1 backdrop-blur-md">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full font-label text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${!isAdmin
          ? 'bg-primary text-on-primary shadow-md'
          : 'text-on-surface-variant hover:text-primary'
          }`}
      >
        Khách hàng
      </Link>

      <Link
        to="/admin"
        className={`px-4 py-2 rounded-full font-label text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${isAdmin
          ? 'bg-primary text-on-primary shadow-md'
          : 'text-on-surface-variant hover:text-primary'
          }`}
      >
        Admin
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-background font-body antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
        <Routes>

          {/* Customer Routes */}

          <Route
            path="/"
            element={
              <CustomerLayout>
                <HomePage />
              </CustomerLayout>
            }
          />

          <Route
            path="/collections"
            element={
              <CustomerLayout>
                <ProductListPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/collections/:category"
            element={
              <CustomerLayout>
                <ProductListPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <CustomerLayout>
                <ProductDetailPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/login"
            element={
              <CustomerLayout>
                <LoginPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/register"
            element={
              <CustomerLayout>
                <RegisterPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <CustomerLayout>
                <CartPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <CustomerLayout>
                <CheckoutPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/payment"
            element={
              <CustomerLayout>
                <PaymentPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/success"
            element={
              <CustomerLayout>
                <OrderSuccessPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/orders"
            element={
              <CustomerLayout>
                <OrderHistoryPage />
              </CustomerLayout>
            }
          />

          {/* Admin Routes */}

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <AdminLayout>
                <AdminPayments />
              </AdminLayout>
            }
          />

          {/* Catch-all redirect to Home */}

          <Route
            path="*"
            element={
              <CustomerLayout>
                <HomePage />
              </CustomerLayout>
            }
          />
        </Routes>

        {/* Floating Switcher for Easy Testing */}
        <RoleSwitcher />
      </div>
    </BrowserRouter>
  )
}

export default App
