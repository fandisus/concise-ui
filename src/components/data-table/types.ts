export type CDataTableRow = Record<string, unknown>

export interface CDataTableColumn {
  field: string
  header: string
}

export type CDataTablePaginatorPosition = 'top' | 'bottom' | 'both'

export interface CDataTableQueryFilters {
  search: string
  [field: string]: unknown
}

export interface CDataTableQuery {
  page: number
  perPage: number
  filters: CDataTableQueryFilters
}
