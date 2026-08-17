<script setup lang="ts">
withDefaults(
  defineProps<{
    stickyHeader?: boolean
  }>(),
  {
    stickyHeader: false,
  },
)

defineSlots<{
  thead?: () => unknown
  tbody?: () => unknown
  tfoot?: () => unknown
}>()
</script>

<template>
  <table class="c-table" :class="{ 'is-sticky-header': stickyHeader }">
    <thead v-if="$slots.thead">
      <slot name="thead" />
    </thead>
    <tbody v-if="$slots.tbody">
      <slot name="tbody" />
    </tbody>
    <tfoot v-if="$slots.tfoot">
      <slot name="tfoot" />
    </tfoot>
  </table>
</template>

<style scoped lang="scss">
.c-table {
  width: 100%;
  color: var(--c-text-color, #20242a);
  font-size: 13px;
  line-height: 1.35;
  border-collapse: separate;
  border-spacing: 0;
  border-block-start: 1px solid var(--c-table-border-color, var(--c-border-color, #d5d9df));
  border-inline-start: 1px solid var(--c-table-border-color, var(--c-border-color, #d5d9df));
  isolation: isolate;

  :deep(th),
  :deep(td) {
    padding: 6px 8px;
    vertical-align: middle;
    border-block-end: 1px solid var(--c-table-border-color, var(--c-border-color, #d5d9df));
    border-inline-end: 1px solid var(--c-table-border-color, var(--c-border-color, #d5d9df));
  }

  :deep(th) {
    font-weight: 600;
    text-align: start;
  }

  thead :deep(th) {
    background: var(--c-table-header-background, #eef1f5);
  }

  tbody :deep(tr:hover > td) {
    background: var(--c-table-row-hover-background, #f5f8fb);
  }

  tfoot :deep(th),
  tfoot :deep(td) {
    font-weight: 600;
    background: var(--c-table-footer-background, #f7f8fa);
  }

  :deep(.c-table-frozen-start),
  :deep(.c-table-frozen-end) {
    position: sticky;
    z-index: 1;
    background: var(--c-table-frozen-background, var(--c-surface-color, #fff));
  }

  :deep(.c-table-frozen-start) {
    inset-inline-start: 0;
  }

  :deep(.c-table-frozen-end) {
    inset-inline-end: 0;
  }

  thead :deep(.c-table-frozen-start),
  thead :deep(.c-table-frozen-end) {
    z-index: 2;
    background: var(--c-table-header-background, #eef1f5);
  }

  tfoot :deep(.c-table-frozen-start),
  tfoot :deep(.c-table-frozen-end) {
    background: var(--c-table-footer-background, #f7f8fa);
  }

  &.is-sticky-header thead :deep(th) {
    position: sticky;
    inset-block-start: var(--c-table-sticky-top, 0);
    z-index: 2;
    background: var(--c-table-header-background, #eef1f5);
  }

  &.is-sticky-header thead :deep(.c-table-frozen-start),
  &.is-sticky-header thead :deep(.c-table-frozen-end) {
    z-index: 3;
  }
}
</style>
