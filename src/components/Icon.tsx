import type { ReactNode, SVGProps } from 'react'

export type IconName =
    | 'search'
    | 'heart'
    | 'user'
    | 'shopping-bag'
    | 'menu'
    | 'close'
    | 'mail'
    | 'lock'
    | 'eye'
    | 'eye-off'
    | 'arrow-right'
    | 'check-circle'
    | 'error-circle'
    | 'search-off'
    | 'dashboard'
    | 'inventory'
    | 'users'
    | 'campaign'
    | 'analytics'
    | 'badge'
    | 'payments'
    | 'cart'
    | 'person-add'
    | 'apparel'
    | 'ticket'
    | 'edit-note'
    | 'add-business'
    | 'chevron-right'
    | 'calendar'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: IconName
    size?: number
}

const iconPaths: Record<IconName, ReactNode> = {
    search: (
        <>
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
        </>
    ),
    heart: (
        <path d="M20.8 4.7c-2-2-5.2-1.8-6.9.4L12 7.4l-1.9-2.3C8.4 2.9 5.2 2.7 3.2 4.7c-2.2 2.2-2.1 5.8.2 8l8.6 8 8.6-8c2.3-2.2 2.4-5.8.2-8Z" />
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20c1.4-3.6 4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
        </>
    ),
    'shopping-bag': (
        <>
            <path d="M6.5 8.5h11l1 12h-13l1-12Z" />
            <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
        </>
    ),
    menu: (
        <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </>
    ),
    close: (
        <>
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </>
    ),
    mail: (
        <>
            <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
            <path d="m4 7 8 6 8-6" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="10" width="14" height="10" rx="1.5" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
    ),
    eye: (
        <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </>
    ),
    'eye-off': (
        <>
            <path d="m4 4 16 16" />
            <path d="M9.4 5.4A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17.5 17.5 0 0 1-3.2 4.1" />
            <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
            <path d="M6.1 7.7A17.4 17.4 0 0 0 2.5 12s3.5 7 9.5 7a9.7 9.7 0 0 0 3-.5" />
        </>
    ),
    'arrow-right': (
        <>
            <path d="M4 12h16" />
            <path d="m14 6 6 6-6 6" />
        </>
    ),
    'check-circle': (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12.5 2.6 2.6L16.5 9" />
        </>
    ),
    'error-circle': (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5" />
            <path d="M12 16.5h.01" />
        </>
    ),
    'search-off': (
        <>
            <path d="m4 4 16 16" />
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
        </>
    ),
    dashboard: (
        <>
            <rect x="4" y="4" width="7" height="7" rx="1" />
            <rect x="13" y="4" width="7" height="7" rx="1" />
            <rect x="4" y="13" width="7" height="7" rx="1" />
            <rect x="13" y="13" width="7" height="7" rx="1" />
        </>
    ),
    inventory: (
        <>
            <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
            <path d="M4 7.5v9L12 21l8-4.5v-9" />
            <path d="M12 12v9" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="8" r="3" />
            <path d="M3.8 19c.9-3 2.6-4.5 5.2-4.5s4.3 1.5 5.2 4.5" />
            <path d="M15 11.5a3 3 0 1 0-.7-5.9" />
            <path d="M15.8 14.7c2.2.4 3.7 1.8 4.4 4.3" />
        </>
    ),
    campaign: (
        <>
            <path d="M4 13h3l9 4V7L7 11H4v2Z" />
            <path d="M7 13v5" />
            <path d="M19 9.5v5" />
        </>
    ),
    analytics: (
        <>
            <path d="M4 20V4" />
            <path d="M4 20h16" />
            <rect x="7" y="12" width="3" height="5" rx=".5" />
            <rect x="12" y="8" width="3" height="9" rx=".5" />
            <rect x="17" y="5" width="3" height="12" rx=".5" />
        </>
    ),
    badge: (
        <>
            <rect x="6" y="4" width="12" height="16" rx="2" />
            <circle cx="12" cy="10" r="2.5" />
            <path d="M8.5 16c.8-1.8 2-2.7 3.5-2.7s2.7.9 3.5 2.7" />
        </>
    ),
    payments: (
        <>
            <rect x="3.5" y="6" width="17" height="12" rx="2" />
            <path d="M3.5 10h17" />
            <path d="M7 15h4" />
        </>
    ),
    cart: (
        <>
            <path d="M4 5h2l2 10h9.5l2-7H7" />
            <circle cx="10" cy="19" r="1.5" />
            <circle cx="17" cy="19" r="1.5" />
        </>
    ),
    'person-add': (
        <>
            <circle cx="9" cy="8" r="4" />
            <path d="M2.5 20c1.2-3.6 3.4-5.4 6.5-5.4 2 0 3.7.8 4.9 2.3" />
            <path d="M18 10v8" />
            <path d="M14 14h8" />
        </>
    ),
    apparel: (
        <>
            <path d="M9 4h6l2.5 2 3 1.5-2 4-2.5-1V20H8V10.5l-2.5 1-2-4 3-1.5L9 4Z" />
            <path d="M9 4c.5 1.7 1.5 2.5 3 2.5S14.5 5.7 15 4" />
        </>
    ),
    ticket: (
        <>
            <path d="M4 8a2 2 0 0 1 2-2h12v4a2 2 0 0 0 0 4v4H6a2 2 0 0 1-2-2v-4a2 2 0 0 0 0-4Z" />
            <path d="M12 7v10" />
        </>
    ),
    'edit-note': (
        <>
            <path d="M4 6h10" />
            <path d="M4 11h8" />
            <path d="M4 16h6" />
            <path d="m14 18 5-5 2 2-5 5h-2v-2Z" />
        </>
    ),
    'add-business': (
        <>
            <path d="M4 20V6h10v14" />
            <path d="M8 10h2" />
            <path d="M8 14h2" />
            <path d="M14 12h7" />
            <path d="M17.5 8.5v7" />
        </>
    ),
    'chevron-right': <path d="m9 6 6 6-6 6" />,
    calendar: (
        <>
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4" />
            <path d="M16 3v4" />
            <path d="M4 10h16" />
        </>
    ),
}

export default function Icon({
    name,
    size = 24,
    className = '',
    ...props
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {iconPaths[name]}
        </svg>
    )
}