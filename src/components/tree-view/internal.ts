import type { CTreeViewItem, CTreeViewSelectionState } from './types'

export interface CTreeViewResolvedNode {
  item: CTreeViewItem
  key: unknown
  renderKey: PropertyKey
  label: string
  value: unknown
  children: CTreeViewResolvedNode[]
}

export type CTreeViewSelectionMap = Map<unknown, CTreeViewSelectionState>
