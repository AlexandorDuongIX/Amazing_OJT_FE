import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import {
  BookOpenText,
  Boxes,
  House,
  Megaphone,
  Menu,
  ShoppingBag,
  TicketPercent,
  Users,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface AdminLayoutProps {
  children: ReactNode
}

interface AdminLink {
  label: string
  href: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

const links: AdminLink[] = [
  { label: 'Dashboard', href: '/admin', icon: House },
  { label: 'Products', href: '/admin/inventory', icon: Boxes },

  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Marketing', href: '/admin/marketing', icon: Megaphone },
  { label: 'Promotions', href: '/admin/promotions', icon: TicketPercent },
const sidebarLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'inventory_2' },
  { label: 'Customers', href: '/admin/customers', icon: 'group' },
  { label: 'Orders', href: '/admin/orders', icon: 'shopping_bag' },
  { label: 'Content Management', href: '/admin/content', icon: 'article' },
  { label: 'Reports', href: '/admin/reports', icon: 'analytics' },
  { label: 'Staff', href: '/admin/staff', icon: 'badge' },
]

function isLinkActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function AdminNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col bg-[#1a1c1c] text-white">
      <div className="px-8 pb-10 pt-8 text-center">
        <Link to="/admin" onClick={onNavigate} className="inline-flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a84a]">
          <span className="font-serif text-lg font-bold uppercase tracking-[-0.05em]">Amazing</span>
          <span className="mt-1 text-xs uppercase tracking-[0.22em] text-[#838484]">Luxury Admin</span>
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1">
        <ul className="space-y-1">
          {links.map((item) => {
            const active = isLinkActive(pathname, item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-12 items-center gap-4 border-l-2 px-8 text-sm uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c6a84a] ${
                    active
                      ? 'border-[#9a7b00] text-[#b99a24]'
                      : 'border-transparent text-[#838484] hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.4} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center bg-white/10 font-serif text-sm">AV</div>
          <div>
            <p className="text-sm font-bold">Alexander V.</p>
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#838484]">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!drawerOpen) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-[#fbf9f9] text-[#1b1c1c]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 lg:block">
        <AdminNavigation />
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#c4c7c7]/40 bg-[#fbf9f9]/95 px-5 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setDrawerOpen(true)}
          className="grid size-11 place-items-center border border-[#c4c7c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <Menu size={20} />
        </button>
        <span className="font-serif text-lg font-bold uppercase">Amazing</span>
        <span className="w-11" aria-hidden="true" />
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Dismiss navigation overlay"
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="relative h-full w-[min(88vw,20rem)] shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a84a]"
            >
              <X size={22} />
            </button>
            <AdminNavigation onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      <main className="min-h-screen lg:ml-72">{children}</main>
    </div>
  )
}
