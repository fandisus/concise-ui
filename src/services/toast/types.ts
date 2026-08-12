import type {
  CToastCloseReason,
  CToastItem,
  CToastPosition,
  CToastVariant,
} from '../../components/toast/types'

export type CToastServiceCloseReason = CToastCloseReason | 'clear'

export interface CToastServiceCloseEvent {
  item: CToastServiceItem
  reason: CToastServiceCloseReason
}

export type CToastServiceItem = Omit<CToastItem, 'id' | 'variant'> & {
  variant?: CToastVariant
  onClose?: (event: CToastServiceCloseEvent) => void
  onAutoClose?: (event: CToastServiceCloseEvent) => void
  onUserClose?: (event: CToastServiceCloseEvent) => void
}

export type CToastSemanticItem = Omit<CToastServiceItem, 'variant'>

export interface CToastServiceApi {
  show(item: CToastServiceItem): void
  info(item: CToastSemanticItem): void
  success(item: CToastSemanticItem): void
  warning(item: CToastSemanticItem): void
  error(item: CToastSemanticItem): void
  clear(): void
}

export interface CToastPluginOptions {
  position?: CToastPosition
  duration?: number
  closable?: boolean
  teleportTo?: string | HTMLElement
  ariaLabel?: string
}
