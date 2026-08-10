export type CContextMenuCloseReason =
  | 'disabled'
  | 'escape'
  | 'outside'
  | 'programmatic'
  | 'select'
  | 'viewport'

export interface CContextMenuOpenEvent {
  x: number
  y: number
  originalEvent?: Event
}

export interface CContextMenuCloseEvent {
  reason: CContextMenuCloseReason
}
