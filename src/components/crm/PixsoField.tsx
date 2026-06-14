import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  paragraphClass: string
  frameClass: string
  contentClass: string
  strokeClass: string
}

export function PixsoInput({
  paragraphClass,
  frameClass,
  contentClass,
  strokeClass,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`stroke-wrapper-${strokeClass.replace('stroke-', '')}`}>
      <div className={frameClass}>
        <div className={contentClass}>
          <input className={`ic-pixso-field ${paragraphClass}`} {...props} />
        </div>
      </div>
      <div className={strokeClass} />
    </div>
  )
}

export function PixsoTextarea({
  paragraphClass,
  frameClass,
  contentClass,
  strokeClass,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`stroke-wrapper-${strokeClass.replace('stroke-', '')}`}>
      <div className={frameClass}>
        <div className={contentClass}>
          <textarea className={`ic-pixso-field ic-pixso-textarea ${paragraphClass}`} {...props} />
        </div>
      </div>
      <div className={strokeClass} />
    </div>
  )
}

export function PixsoPriceInput({
  value,
  onChange,
  frameClass,
  contentClass,
  paragraphClass,
  strokeClass,
}: {
  value: number
  onChange: (v: number) => void
  frameClass: string
  contentClass: string
  paragraphClass: string
  strokeClass: string
}) {
  return (
    <PixsoInput
      type="number"
      value={value === 0 ? '' : value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      frameClass={frameClass}
      contentClass={contentClass}
      paragraphClass={paragraphClass}
      strokeClass={strokeClass}
    />
  )
}

export function PixsoButton({
  children,
  onClick,
  className,
  variant = 'primary',
}: {
  children: ReactNode
  onClick?: () => void
  className: string
  variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      type="button"
      className={`ic-btn ${variant === 'primary' ? 'ic-pixso-btn-primary' : 'ic-pixso-btn-ghost'} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
