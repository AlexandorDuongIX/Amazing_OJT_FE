import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuthStore } from '../pages/stores/authStore'

/* ============================================================
   Navbar Component — AMAZING Design System
   ============================================================
   - Fixed header with backdrop blur
   - Logo centered
   - Desktop nav links left / action icons right
   - Mobile hamburger menu
   - Shadow on scroll
   - Active underline animates smoothly via CSS transition
   ============================================================ */

interface NavLink {
  label: string
  to: string
  matchPrefix?: string
}

const navLinks: NavLink[] = [
  { label: 'Nam', to: '/collections/nam', matchPrefix: '/collections/nam' },
  { label: 'Nữ', to: '/collections/nu', matchPrefix: '/collections/nu' },
  { label: 'Phụ kiện', to: '/collections/phu-kien', matchPrefix: '/collections/phu-kien' },
  { label: 'Blog', to: '#' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const location = useLocation()

  const { user, logout } = useAuthStore()

  const isActive = (link: NavLink) =>
    !!link.matchPrefix && location.pathname.startsWith(link.matchPrefix)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const handleClose = () => setUserMenuOpen(false)
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [userMenuOpen])

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/30 ${scrolled
            ? 'bg-background/95 shadow-sm'
            : 'bg-background/90 backdrop-blur-md'
          }`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base w-full max-w-[1440px] mx-auto h-[80px]">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-primary scale-95 active:scale-100 transition-transform cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-gutter">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative font-label text-[14px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 pb-1 ${active
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: active ? '100%' : '0%' }}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Brand Logo (Center) */}
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
            aria-label="AMAZING - Trang chủ"
          >
            <Logo width={160} className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Trailing Icons */}
          <div className="flex items-center gap-4">
            <button className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer" aria-label="Tìm kiếm">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
            <button className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer hidden md:block" aria-label="Yêu thích">
              <span className="material-symbols-outlined text-[24px]">favorite</span>
            </button>
            <div className="relative hidden md:block">
              <button
                className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer block"
                aria-label="Tài khoản"
                onClick={(e) => {
                  e.stopPropagation()
                  setUserMenuOpen(!userMenuOpen)
                }}
              >
                <span className="material-symbols-outlined text-[24px]">person</span>
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#e2e2e2] rounded-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-3 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user ? (
                    <>
                      <div className="px-5 py-2 border-b border-[#f0f0f0] mb-2">
                        <p className="font-label text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Tài khoản</p>
                        <p className="font-body text-[14px] font-semibold text-primary truncate mt-0.5">{user.name}</p>
                        <p className="font-body text-[12px] text-on-surface-variant/80 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 text-left px-5 py-2.5 font-body text-[14px] text-error hover:bg-error/5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 font-body text-[14px] text-primary hover:bg-[#f5f5f5] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        <span>Đăng nhập</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 font-body text-[14px] text-primary hover:bg-[#f5f5f5] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        <span>Đăng ký</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <button className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer relative" aria-label="Giỏ hàng">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-tertiary/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-in Panel */}
          <nav className="absolute top-0 left-0 h-full w-[280px] bg-background shadow-xl p-margin-mobile flex flex-col"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div className="flex justify-between items-center mb-10">
              <Logo width={130} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary cursor-pointer"
                aria-label="Đóng menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const active = isActive(link)
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative font-label text-[16px] font-semibold uppercase tracking-[0.1em] transition-colors w-fit ${active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                      }`}
                  >
                    {link.label}
                    {/* Animated underline */}
                    <span
                      className="absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: active ? '100%' : '0%' }}
                    />
                  </Link>
                )
              })}
            </div>
            <div className="mt-auto flex items-center gap-6 pt-8 border-t border-outline-variant/30">
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" aria-label="Yêu thích">
                <span className="material-symbols-outlined">favorite</span>
              </button>
              {user ? (
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                  aria-label="Đăng xuất"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span className="font-label text-[14px] font-semibold">Đăng xuất ({user.name})</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                  aria-label="Tài khoản"
                >
                  <span className="material-symbols-outlined">person</span>
                  <span className="font-label text-[14px] font-semibold">Đăng nhập</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
