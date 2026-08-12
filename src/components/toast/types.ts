export type CToastVariant = 'default' | 'success' | 'info' | 'warning' | 'danger'

export type CToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'

export type CToastCloseReason = 'dismiss' | 'timeout'

export interface CToastItem {
  id?: string | number
  title?: string
  message: string
  icon?: string
  variant?: CToastVariant
  duration?: number
  closable?: boolean
  data?: unknown
}

export interface CToastCloseEvent {
  item: CToastItem
  reason: CToastCloseReason
}
