/* ============================================================
   Loading Component — AMAZING Design System
   ============================================================
   - Spinner with gold accent
   - Fullscreen overlay or inline variant
   - Custom loading text
   ============================================================ */

interface LoadingProps {
  /** Display mode: fullscreen overlay or inline */
  variant?: 'fullscreen' | 'inline'
  /** Loading text */
  text?: string
  /** Size of spinner in px */
  size?: number
}

function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-2 border-outline-variant border-t-secondary-fixed-dim"
      style={{
        width: size,
        height: size,
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}

export default function Loading({
  variant = 'inline',
  text = 'Đang tải...',
  size = 40,
}: LoadingProps) {
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
        <Spinner size={size} />
        {text && (
          <p className="font-label text-[14px] font-medium tracking-widest uppercase text-on-surface-variant">
            {text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-section-gap">
      <Spinner size={size} />
      {text && (
        <p className="font-label text-[12px] font-medium tracking-widest uppercase text-on-surface-variant">
          {text}
        </p>
      )}
    </div>
  )
}
