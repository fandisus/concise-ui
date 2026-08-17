export type CMenuOrientation = 'horizontal' | 'vertical'
export type CMenuSubmenuMode = 'auto' | 'inline' | 'flyout'

export interface CMenuCommandContext {
  item: CMenuActionItem
  originalEvent: MouseEvent
}

export interface CMenuActionItem {
  type?: 'item'
  id?: string
  label: string
  icon?: string
  url?: string
  target?: string
  children?: CMenuEntry[]
  disabled?: boolean
  hidden?: boolean
  active?: boolean
  command?: (context: CMenuCommandContext) => void
}

export interface CMenuSeparatorItem {
  type: 'separator'
  id?: string
  hidden?: boolean
}

export interface CMenuHeaderItem {
  type: 'header'
  id?: string
  label: string
  hidden?: boolean
  class?: string | string[] | Record<string, boolean>
  style?: string | Record<string, string | number>
}

export type CMenuEntry = CMenuActionItem | CMenuHeaderItem | CMenuSeparatorItem

export interface CMenuSelectEvent extends CMenuCommandContext {}
