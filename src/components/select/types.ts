export type CSelectPrimitive = string | number | boolean
export type CSelectValue = CSelectPrimitive | object

export interface CSelectOption {
  label: string
  value: CSelectValue
  disabled?: boolean
  hidden?: boolean
}

export type CSelectLabelAccessor = string | ((option: object) => string)
export type CSelectKeyAccessor = string | ((option: object) => string | number)
export type CSelectValueAccessor = string | ((option: object) => CSelectValue)
