import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/customer/home/HomePage'

import ProductListPage from './pages/customer/products/ProductListPage'
import ProductDetailPage from './pages/customer/products/ProductDetailPage'
import CartPage from './pages/customer/cart/CartPage'
import Payment from './pages/customer/checkout/Payment'
import OrderSuccessPage from './pages/customer/checkout/OrderSuccessPage'
import OrderHistoryPage from './pages/customer/order-history'
import { LoginPage, RegisterPage } from './pages/customer/auth/AuthPages'
import WishlistPage from './pages/customer/wishlist/WishlistPage'
import ProtectedRoute from './components/ProtectedRoute'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ContentManagementPage from './pages/admin/ContentManagementPage'
import CustomerManagement from './pages/admin/CustomerManagement'
import AdminOrders from './pages/admin/order_management/AdminOrders/AdminOrders'
import ReportManagementPage from './pages/admin/ReportManagementPage'

import PromotionManagement from './pages/admin/promotions/PromotionManagement'
import BlogListPage from './pages/customer/blog/BlogListPage'
import BlogDetailPage from './pages/customer/blog/BlogDetailPage'
import ProductManagementPage from './pages/admin/products/ProductManagementPage'
import InventoryPage from './pages/admin/InventoryPage'

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function CustomerLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  const hideFooter = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Navbar />
      <main className="pt-[80px]">
        {children ?? <HomePage />}
      </main>
      {!hideFooter && <Footer />}
    </>
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
            path="/order-success"
            element={
              <CustomerLayout>
                <OrderSuccessPage />
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
            path="/blogs"
            element={
              <CustomerLayout>
                <BlogListPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/blog/:id"
            element={
              <CustomerLayout>
                <BlogDetailPage />
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

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <CustomerLayout>
                  <OrderHistoryPage />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <CustomerLayout>
                <WishlistPage />
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
            path="/admin/products"
            element={
              <AdminLayout>
                <ProductManagementPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <AdminLayout>
                <InventoryPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/promotions"
            element={
              <AdminLayout>
                <PromotionManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminLayout>
                <ContentManagementPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminLayout>
                <CustomerManagement />
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
            path="/admin/reports"
            element={
              <AdminLayout>
                <ReportManagementPage />
              </AdminLayout>
            }
          />

          {/* Staff Routes (same as Admin, without Reports) */}

          <Route
            path="/staff"
            element={
              <AdminLayout role="staff">
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/products"
            element={
              <AdminLayout role="staff">
                <ProductManagementPage />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/inventory"
            element={
              <AdminLayout role="staff">
                <InventoryPage />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/promotions"
            element={
              <AdminLayout role="staff">
                <PromotionManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/content"
            element={
              <AdminLayout role="staff">
                <ContentManagementPage />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/customers"
            element={
              <AdminLayout role="staff">
                <CustomerManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/staff/orders"
            element={
              <AdminLayout role="staff">
                <AdminOrders />
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
      </div>
    </BrowserRouter>
  )
}

export default App
