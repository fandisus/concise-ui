export type CTreeViewItem = Record<string, unknown>

export type CTreeViewSelectionState = 'checked' | 'unchecked' | 'indeterminate'

export interface CTreeViewNodeSlotProps {
  item: CTreeViewItem
  depth: number
  isLeaf: boolean
  expanded: boolean
  selected: boolean
  indeterminate: boolean
}

export type CTreeViewSelectionMapper<TResult> = (item: CTreeViewItem) => TResult
export type CTreeViewSelectionPredicate = (item: CTreeViewItem) => boolean

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
  getFlatSelections<TResult>(mapper: CTreeViewSelectionMapper<TResult>): TResult[]
  setSelectionsBy(key: string, values: unknown[]): void
  setSelectionsBy(predicate: CTreeViewSelectionPredicate): void
}
