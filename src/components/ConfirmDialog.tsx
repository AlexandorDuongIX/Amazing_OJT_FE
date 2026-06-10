import { useEffect } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  productName?: string
}

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, productName }: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onCancel}
    >
      <div
        className="relative bg-surface-container-lowest w-full max-w-[420px] px-10 pt-8 pb-7"
        style={{ borderRadius: '4px' }}
        role="dialog"
        aria-modal="true"
        aria-label="Xác nhận xoá sản phẩm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close × */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-on-surface hover:opacity-50 transition-opacity cursor-pointer leading-none"
          style={{ fontSize: '16px' }}
          aria-label="Đóng"
        >
          ×
        </button>

        {/* Heading */}
        <h2
          className="font-headline text-[18px] text-on-surface text-center mx-auto leading-snug"
          style={{ maxWidth: '340px' }}
        >
          Bạn chắc chắn muốn bỏ sản phẩm này?
        </h2>

        {/* Product name hint */}
        {productName && (
          <p className="font-body text-[11px] text-on-surface-variant text-center mt-2 line-clamp-1 px-4">
            {productName}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-7">
          <button
            onClick={onCancel}
            className="flex-1 h-[52px] bg-surface-container-lowest font-label text-[12px] uppercase tracking-[0.15em] text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            style={{ border: '1px solid var(--color-on-surface)', borderRadius: '2px' }}
          >
            Không
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[52px] bg-surface-container-lowest font-label text-[12px] uppercase tracking-[0.15em] text-[#D4AF37] hover:bg-[#FDF9EE] transition-colors cursor-pointer"
            style={{ border: '1px solid #D4AF37', borderRadius: '2px' }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  )
}
