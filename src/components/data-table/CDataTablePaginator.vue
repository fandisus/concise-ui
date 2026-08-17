<script setup lang="ts">
import { computed, useId } from 'vue'

import CButton from '../button/CButton.vue'

const props = withDefaults(
  defineProps<{
    page?: number
    perPage?: number
    total?: number
    perPageOptions?: number[]
    loading?: boolean
    position?: 'top' | 'bottom'
  }>(),
  {
    page: 1,
    perPage: 10,
    total: 0,
    perPageOptions: () => [10, 25, 50, 100],
    loading: false,
    position: 'bottom',
  },
)

const emit = defineEmits<{
  page: [page: number]
  perPage: [perPage: number]
}>()

const pageSizeId = `c-data-table-page-size-${useId()}`

const normalizedTotal = computed(() =>
  Number.isFinite(props.total) ? Math.max(0, Math.floor(props.total)) : 0,
)
const normalizedPerPage = computed(() =>
  Number.isFinite(props.perPage) && props.perPage > 0 ? Math.floor(props.perPage) : 10,
)
const pageCount = computed(() =>
  Math.max(1, Math.ceil(normalizedTotal.value / normalizedPerPage.value)),
)
const normalizedPage = computed(() => {
  const page = Number.isFinite(props.page) ? Math.max(1, Math.floor(props.page)) : 1
  return Math.min(page, pageCount.value)
})
const rangeStart = computed(() =>
  normalizedTotal.value === 0
    ? 0
    : (normalizedPage.value - 1) * normalizedPerPage.value + 1,
)
const rangeEnd = computed(() =>
  normalizedTotal.value === 0
    ? 0
    : Math.min(normalizedPage.value * normalizedPerPage.value, normalizedTotal.value),
)
const availablePageSizes = computed(() => {
  const values = props.perPageOptions
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.floor(value))

  if (!values.includes(normalizedPerPage.value)) values.push(normalizedPerPage.value)
  return [...new Set(values)].sort((left, right) => left - right)
})
const navigationDisabled = computed(() => props.loading || normalizedTotal.value === 0)

function requestPage(page: number) {
  const requestedPage = Math.min(Math.max(1, page), pageCount.value)
  if (props.loading || requestedPage === normalizedPage.value) return
  emit('page', requestedPage)
}

function changePerPage(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (props.loading || !Number.isFinite(value) || value <= 0 || value === normalizedPerPage.value) {
    return
  }
  emit('perPage', Math.floor(value))
}
</script>

<template>
  <nav class="c-data-table-paginator" :aria-label="`Table pagination (${position})`">
    <span class="range">
      {{ rangeStart }}–{{ rangeEnd }} of {{ normalizedTotal }}
    </span>

    <span class="page-size">
      <label :for="pageSizeId">Rows per page</label>
      <select
        :id="pageSizeId"
        :value="normalizedPerPage"
        :disabled="loading"
        @change="changePerPage"
      >
        <option v-for="option in availablePageSizes" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </span>

    <span class="navigation">
      <CButton
        size="small"
        aria-label="First page"
        :disabled="navigationDisabled || normalizedPage <= 1"
        @click="requestPage(1)"
      >
        «
      </CButton>
      <CButton
        size="small"
        aria-label="Previous page"
        :disabled="navigationDisabled || normalizedPage <= 1"
        @click="requestPage(normalizedPage - 1)"
      >
        ‹
      </CButton>
      <span class="page-number">Page {{ normalizedPage }} of {{ pageCount }}</span>
      <CButton
        size="small"
        aria-label="Next page"
        :disabled="navigationDisabled || normalizedPage >= pageCount"
        @click="requestPage(normalizedPage + 1)"
      >
        ›
      </CButton>
      <CButton
        size="small"
        aria-label="Last page"
        :disabled="navigationDisabled || normalizedPage >= pageCount"
        @click="requestPage(pageCount)"
      >
        »
      </CButton>
    </span>
  </nav>
</template>

<style scoped lang="scss">
.c-data-table-paginator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 34px;
  padding: 4px 6px;
  gap: 6px 14px;
  color: var(--c-muted-text-color, #626a75);
  font-size: 12px;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-border-color, #d5d9df);

  .range {
    min-width: 90px;
    font-variant-numeric: tabular-nums;
  }

  .page-size,
  .navigation {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .page-size {
    margin-inline-start: auto;

    select {
      box-sizing: border-box;
      height: 26px;
      padding: 2px 22px 2px 6px;
      color: var(--c-text-color, #20242a);
      font: inherit;
      background: var(--c-input-background, #fff);
      border: 1px solid var(--c-control-border-color, #bfc5ce);
      border-radius: var(--c-border-radius, 3px);

      &:focus {
        border-color: var(--c-focus-color, #3578c6);
        outline: 1px solid var(--c-focus-color, #3578c6);
      }

      &:disabled {
        color: var(--c-disabled-text-color, #8a9099);
        cursor: not-allowed;
        background: var(--c-disabled-background-color, #f1f3f5);
      }
    }
  }

  .navigation :deep(.c-button) {
    width: 26px;
    min-height: 26px;
    padding: 0;
    font-size: 15px;
  }

  .page-number {
    min-width: 86px;
    color: var(--c-text-color, #20242a);
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
}
</style>
