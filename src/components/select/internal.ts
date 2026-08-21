import type { CSelectValue } from './types'

export interface CSelectResolvedOption {
  key: string | number
  label: string
  value: CSelectValue
  disabled: boolean
}
