import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

/* ============================================================
   Button Component — AMAZING Design System
   ============================================================
   Variants: primary (dark), outline, gold, ghost
   Sizes: sm, md, lg
   Can render as <button> or <a> via the `href` prop.
   ============================================================ */

type ButtonVariant = 'primary' | 'outline' | 'gold' | 'ghost' | 'primary-border'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsAnchor = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-on-tertiary text-tertiary hover:bg-secondary-container hover:text-on-secondary-container',
  outline:
    'bg-transparent text-primary border border-outline-variant hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim',
  gold:
    'bg-secondary-fixed-dim text-on-secondary-fixed hover:bg-secondary hover:text-on-secondary',
  ghost:
    'bg-transparent text-primary hover:text-secondary-fixed-dim',
  'primary-border':
    'border border-primary bg-on-tertiary text-tertiary hover:bg-secondary-container hover:text-on-secondary-container hover:border-secondary-container',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-[12px]',
  md: 'px-8 py-3 text-label-md',
  lg: 'px-10 py-4 text-label-md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-label uppercase tracking-widest',
    'transition-colors duration-300',
    'cursor-pointer select-none',
    'whitespace-nowrap',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsAnchor
    return (
      <a href={href} className={baseClasses} {...anchorProps}>
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button type="button" className={baseClasses} {...buttonProps}>
      {children}
    </button>
  )
}
