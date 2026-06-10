import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import MiniCart from './MiniCart'
import { useCartStore } from '../store/cartStore'

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
  const { items, toggleCart } = useCartStore()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const location = useLocation()

  const isActive = (link: NavLink) =>
    !!link.matchPrefix && location.pathname.startsWith(link.matchPrefix)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            <button className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer hidden md:block" aria-label="Tài khoản">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </button>
            <button onClick={toggleCart} className="text-primary hover:text-secondary-fixed-dim scale-95 active:scale-100 transition-transform cursor-pointer relative" aria-label="Giỏ hàng">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MiniCart />

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
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" aria-label="Tài khoản">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
