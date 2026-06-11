import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/customer/HomePage'
import ProductListPage from './pages/customer/ProductListPage'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import { LoginPage, RegisterPage } from './pages/customer/AuthPages'
import Payment from './pages/customer/Payment'
import ProductDetailPage from './pages/customer/ProductDetailPage'

function CustomerLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-[80px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<ProductListPage />} />
          <Route path="/collections/:category" element={<ProductListPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
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
      <ScrollToTop />
      <div className="bg-background text-on-background font-body antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
        <Routes>
          {/* Customer Routes */}
          <Route path="/*" element={<CustomerLayout />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<CustomerLayout />} />

          {/* Payment Route */}
          <Route path="/payment" element={<Payment />} />
        </Routes>

        {/* Floating Switcher for Easy Testing */}
        <RoleSwitcher />
      </div>
    </BrowserRouter>
  )
}

export default App
