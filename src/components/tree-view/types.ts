export type CTreeViewItem = Record<string, unknown>

export type CTreeViewSelectionState = 'checked' | 'unchecked' | 'indeterminate'

export interface CTreeViewSelectionClickEvent {
  item: CTreeViewItem
  key: unknown
  value: unknown
  state: CTreeViewSelectionState
}

export interface CTreeViewSelectionChangeEvent {
  selections: CTreeViewItem[]
  flatSelections: CTreeViewItem[]
}

export interface CTreeViewExpose {
  getSelections(): CTreeViewItem[]
  getFlatSelections(): CTreeViewItem[]
  getFlatSelections(key: string): unknown[]
  setSelectionsBy(key: string, values: unknown[]): void
}
