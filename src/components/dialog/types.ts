export type CDialogSize = 'small' | 'medium' | 'large'

export type CDialogCloseReason = 'close-button' | 'escape' | 'outside' | 'programmatic'

export interface CDialogCloseEvent {
  reason: CDialogCloseReason
}
