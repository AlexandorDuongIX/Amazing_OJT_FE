import { Link, useLocation } from 'react-router-dom'

/* ============================================================
   AdminLayout — AMAZING Luxury Admin Shell
   ============================================================
   - Fixed dark sidebar (w-72) with brand + navigation
   - Active link highlight with gold left-border
   - Profile avatar at bottom
   - Top-level main content area with offset
   ============================================================ */

interface SidebarLink {
  label: string
  href: string
  icon: string
}

const sidebarLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'inventory_2' },
  { label: 'Customers', href: '/admin/customers', icon: 'group' },
  { label: 'Orders', href: '/admin/orders', icon: 'shopping_bag' },
  { label: 'Content Management', href: '/admin/content', icon: 'article' },
  { label: 'Reports', href: '/admin/reports', icon: 'analytics' },
  { label: 'Staff', href: '/admin/staff', icon: 'badge' },
]

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* ---- Sidebar ---- */}
      <nav className="fixed left-0 top-0 h-full w-72 flex flex-col py-8 bg-tertiary-container border-r border-outline-variant/20 z-50">
        {/* Brand */}
        <div className="px-8 mb-12">
          <h1 className="font-headline font-bold text-[18px] tracking-tighter text-on-tertiary">
            AMAZING
          </h1>
          <p className="font-label uppercase tracking-widest text-caption text-on-tertiary/60">
            ADMIN
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-4 pl-4 py-3 transition-all duration-300 ${isActive
                    ? 'text-secondary border-l-2 border-secondary translate-x-1'
                    : 'text-on-tertiary-container opacity-70 hover:opacity-100 hover:text-secondary hover:bg-on-tertiary-fixed/10'
                  }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label uppercase tracking-widest text-label-md">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Profile Footer */}
        <div className="px-8 mt-auto pt-8 border-t border-on-tertiary-fixed-variant flex items-center gap-4">
          <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center text-on-surface font-bold text-label-md">
            A
          </div>
          <div>
            <p className="font-headline font-semibold text-body-md text-on-tertiary">
              Alexander V.
            </p>
            <p className="font-body text-caption text-on-tertiary/40">Super Admin</p>
          </div>
        </div>
      </nav>

      {/* ---- Main Content Area ---- */}
      <main className="ml-72 min-h-screen flex flex-col flex-1">
        <div className="p-10 max-w-[1440px] mx-auto w-full flex-1">
          {children}
        </div>

        {/* Footer */}
        <div className="ml-0 px-10 max-w-[1440px] mx-auto w-full">
          <div className="flex justify-between items-center py-8 border-t border-outline-variant">
            <p className="font-body text-caption uppercase tracking-wider text-on-surface-variant/60">
              © 2026 AMAZING FASHION. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <a
                href="#"
                className="font-body text-caption uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-body text-caption uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="font-body text-caption uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
