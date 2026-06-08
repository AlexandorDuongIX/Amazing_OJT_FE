import { useEffect, useRef, type ReactNode } from 'react'

/* ============================================================
   Modal Component — AMAZING Design System
   ============================================================
   - Overlay backdrop with blur
   - Animated entrance (fade + scale)
   - Close on backdrop click or close button
   - Focus trap friendly
   ============================================================ */

interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Optional title displayed at the top */
  title?: string
  /** Modal content */
  children: ReactNode
  /** Max width class (default: max-w-lg) */
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-tertiary/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal Panel */}
      <div
        ref={panelRef}
        className={`relative bg-background rounded-xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
        style={{ animation: 'scaleIn 0.25s ease-out' }}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Modal dialog'}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-outline-variant/30">
            <h2 className="font-headline text-[24px] font-semibold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 z-10"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        )}

        {/* Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
