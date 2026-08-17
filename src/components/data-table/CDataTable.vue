<script setup lang="ts" generic="TRow extends object = CDataTableRow">
import { computed, ref } from 'vue'

import CDebounceInput from '../debounce-input/CDebounceInput.vue'
import CTable from '../table/CTable.vue'
import CDataTablePaginator from './CDataTablePaginator.vue'
import type {
  CDataTableColumn,
  CDataTablePaginatorPosition,
  CDataTableQuery,
  CDataTableRow,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    value?: TRow[]
    page?: number
    perPage?: number
    total?: number
    loading?: boolean
    stickyHeader?: boolean
    paginator?: boolean
    paginatorPosition?: CDataTablePaginatorPosition
    perPageOptions?: number[]
    additionalFilters?: Record<string, unknown>
    autoColumns?: boolean
    excludeFields?: string[]
    columns?: CDataTableColumn[]
  }>(),
  {
    value: () => [] as TRow[],
    page: 1,
    perPage: 10,
    total: 0,
    loading: false,
    stickyHeader: false,
    paginator: false,
    paginatorPosition: 'both',
    perPageOptions: () => [10, 25, 50, 100],
    additionalFilters: () => ({}),
    autoColumns: false,
    excludeFields: () => [],
  },
)

const emit = defineEmits<{
  query: [query: CDataTableQuery]
}>()

defineSlots<{
  thead?: () => unknown
  tbody?: (props: { data: TRow[] }) => unknown
  tfoot?: () => unknown
  'top-left'?: () => unknown
  'top-right'?: () => unknown
  loading?: () => unknown
  empty?: () => unknown
}>()

const search = ref('')
let lastDebouncedSearch = ''

const hasRows = computed(() => props.value.length > 0)
const showTopPaginator = computed(
  () => props.paginator && props.paginatorPosition !== 'bottom',
)
const showBottomPaginator = computed(
  () => props.paginator && props.paginatorPosition !== 'top',
)
const renderedColumns = computed<CDataTableColumn[]>(() => {
  if (props.columns !== undefined) return props.columns

  const firstRow = props.value[0]
  if (!props.autoColumns || !firstRow) return []

  const excluded = new Set(props.excludeFields)
  return Object.keys(firstRow)
    .filter((field) => !excluded.has(field))
    .map((field) => ({ field, header: formatHeader(field) }))
})

function formatHeader(field: string) {
  const label = field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()

  return label ? label.charAt(0).toLocaleUpperCase() + label.slice(1) : field
}

function cellValue(row: TRow, field: string) {
  return (row as CDataTableRow)[field]
}

function createQuery(page: number, perPage: number, searchValue = search.value): CDataTableQuery {
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1
  const normalizedPerPage =
    Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 10

  return {
    page: normalizedPage,
    perPage: normalizedPerPage,
    filters: {
      ...props.additionalFilters,
      search: searchValue,
    },
  }
}

function handleSearch(value: string) {
  if (value === lastDebouncedSearch) return
  lastDebouncedSearch = value
  emit('query', createQuery(1, props.perPage, value))
}

function handlePage(page: number) {
  emit('query', createQuery(page, props.perPage))
}

function handlePerPage(perPage: number) {
  emit('query', createQuery(1, perPage))
}
</script>

<template>
  <div class="c-data-table" :class="{ 'is-loading': loading, 'is-empty': !hasRows }">
    <div class="toolbar">
      <div v-if="$slots['top-left']" class="top-left">
        <slot name="top-left" />
      </div>
      <div class="top-right">
        <slot name="top-right">
          <CDebounceInput
            v-model="search"
            class="search"
            size="small"
            type="search"
            placeholder="Search"
            aria-label="Search table"
            @debounce="handleSearch"
          />
        </slot>
      </div>
    </div>

    <CDataTablePaginator
      v-if="showTopPaginator"
      position="top"
      :page="page"
      :per-page="perPage"
      :total="total"
      :per-page-options="perPageOptions"
      :loading="loading"
      @page="handlePage"
      @per-page="handlePerPage"
    />

    <div class="table-region">
      <CTable
        v-bind="$attrs"
        :sticky-header="stickyHeader"
        :aria-busy="loading ? 'true' : undefined"
      >
        <template v-if="$slots.thead || renderedColumns.length" #thead>
          <slot v-if="$slots.thead" name="thead" />
          <tr v-else>
            <th v-for="column in renderedColumns" :key="column.field" scope="col">
              {{ column.header }}
            </th>
          </tr>
        </template>

        <template #tbody>
          <slot v-if="$slots.tbody" name="tbody" :data="value" />
          <template v-else>
            <tr v-for="(row, rowIndex) in value" :key="rowIndex">
              <td v-for="column in renderedColumns" :key="column.field">
                {{ cellValue(row, column.field) }}
              </td>
            </tr>
          </template>
        </template>

        <template v-if="$slots.tfoot" #tfoot>
          <slot name="tfoot" />
        </template>
      </CTable>

      <div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
        <slot name="loading">
          <span class="spinner" aria-hidden="true" />
          <span>Loading…</span>
        </slot>
      </div>

      <div v-else-if="!hasRows" class="empty" role="status">
        <slot name="empty">No data</slot>
      </div>
    </div>

    <CDataTablePaginator
      v-if="showBottomPaginator"
      position="bottom"
      :page="page"
      :per-page="perPage"
      :total="total"
      :per-page-options="perPageOptions"
      :loading="loading"
      @page="handlePage"
      @per-page="handlePerPage"
    />
  </div>
</template>

<style scoped lang="scss">
.c-data-table {
  min-width: 0;

  .toolbar {
    display: flex;
    align-items: center;
    min-height: 36px;
    padding: 4px 0;
    gap: 8px;
  }

  .top-left,
  .top-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  .top-right {
    margin-inline-start: auto;
  }

  .search {
    width: 220px;
  }

  .table-region {
    position: relative;
    min-width: 0;
  }

  .loading-overlay {
    position: absolute;
    z-index: 4;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 58px;
    gap: 7px;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    cursor: progress;
    background: var(--c-data-table-loading-background, rgba(255, 255, 255, 0.72));
  }

  .spinner {
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    border: 2px solid var(--c-border-color, #d5d9df);
    border-top-color: var(--c-primary-color, #286aa6);
    border-radius: 50%;
    animation: c-data-table-spin 700ms linear infinite;
  }

  .empty {
    padding: 18px 10px;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    text-align: center;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
    border-block-start: 0;
  }

  &.is-loading.is-empty .table-region {
    min-height: 58px;
  }

  > :deep(.c-data-table-paginator) + .table-region,
  .table-region + :deep(.c-data-table-paginator) {
    margin-top: -1px;
  }
}

@keyframes c-data-table-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-data-table .spinner {
    animation-duration: 1.4s;
  }
}
</style>
