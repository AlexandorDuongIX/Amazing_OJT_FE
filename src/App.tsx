import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/customer/HomePage'

import ProductListPage from './pages/customer/ProductListPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import CartPage from './pages/customer/cart/CartPage'
import OrderSuccessPage from './pages/customer/OrderSucessPage'
import { LoginPage, RegisterPage } from './pages/customer/AuthPages'
import Payment from './pages/customer/Payment'
import AdminInventory from './pages/admin/AdminInventory'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

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
        className={`px-4 py-2 rounded-full font-label text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
          !isAdmin
            ? 'bg-primary text-on-primary shadow-md'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        Khách hàng
      </Link>

      <Link
        to="/admin"
        className={`px-4 py-2 rounded-full font-label text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
          isAdmin
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
      <ScrollToTop />
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
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/success"
            element={
              <CustomerLayout>
                <OrderSuccessPage />
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
            path="/admin/inventory"
            element={
              <AdminLayout>
                <AdminInventory />
              </AdminLayout>
            }
          />
          
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<CustomerLayout />} />

          {/* Payment Route */}  
          <Route path="/payment" element={<Payment />} />

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

        <RoleSwitcher />
      </div>
    </BrowserRouter>
  )
}

export default App