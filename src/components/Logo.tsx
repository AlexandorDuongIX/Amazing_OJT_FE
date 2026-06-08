import type { CSSProperties } from 'react'

interface LogoProps {
  /** Width of the logo in px (height scales proportionally) */
  width?: number
  /** Optional className for the wrapper */
  className?: string
  /** Optional inline style overrides */
  style?: CSSProperties
  /** If true, renders light version for dark backgrounds */
  inverted?: boolean
}

/**
 * AMAZING brand logo — Playfair Display wordmark with gold accent underline.
 * Renders as inline SVG so it inherits page fonts and stays crisp at any size.
 */
export default function Logo({ width = 200, className, style, inverted = false }: LogoProps) {
  const height = (width / 200) * 60
  const textColor = inverted ? '#FFFFFF' : '#1A1A1A'

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="AMAZING logo"
      role="img"
    >
      <text
        x="0"
        y="45"
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fontSize="36"
        fill={textColor}
        letterSpacing="4"
      >
        AMAZING
      </text>
      <rect
        x="0"
        y="52"
        width="40"
        height="2"
        fill="#D4AF37"
      />
    </svg>
  )
}
