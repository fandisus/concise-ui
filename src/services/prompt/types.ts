import type { CButtonVariant } from '../../components/button/types'
import type { CDialogSize } from '../../components/dialog/types'

export interface CPromptBaseOptions {
  title?: string
  icon?: string
  confirmLabel?: string
  size?: CDialogSize
  width?: string
}

export interface CPromptMessageOptions extends CPromptBaseOptions {
  message?: string
  preformatted?: boolean
  unsafeHtml?: string
}

export interface CPromptConfirmOptions extends CPromptBaseOptions {
  question: string
  cancelLabel?: string
  confirmVariant?: CButtonVariant
}

export interface CPromptInputOptions extends CPromptBaseOptions {
  question: string
  initialValue?: string
  placeholder?: string
  required?: boolean
  cancelLabel?: string
  confirmVariant?: CButtonVariant
}

export interface CPromptSelectOptions<T> extends CPromptBaseOptions {
  question: string
  options: readonly T[]
  placeholder?: string
  optionLabel?: string | ((option: T) => string)
  cancelLabel?: string
  confirmVariant?: CButtonVariant
}

export interface CPromptService {
  info(options: CPromptMessageOptions): Promise<void>
  success(options: CPromptMessageOptions): Promise<void>
  warning(options: CPromptMessageOptions): Promise<void>
  error(options: CPromptMessageOptions): Promise<void>
  message(options: CPromptMessageOptions): Promise<void>
  confirm(options: CPromptConfirmOptions): Promise<boolean>
  input(options: CPromptInputOptions): Promise<string | null>
  select<T>(options: CPromptSelectOptions<T>): Promise<T | null>
}

export interface CPromptPluginOptions {
  teleportTo?: string | HTMLElement
}
