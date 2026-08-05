<script setup lang="ts">
import type { CFormControlSize } from '../form/types'

withDefaults(
  defineProps<{
    tag?: string
    size?: CFormControlSize
  }>(),
  {
    tag: 'span',
    size: 'medium',
  },
)
</script>

<template>
  <component :is="tag" class="c-input-addon" :class="`is-${size}`">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.c-input-addon {
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: 30px;
  min-width: 30px;
  padding: 4px 8px;
  color: var(--c-muted-text-color, #626a75);
  font: inherit;
  line-height: 1.2;
  white-space: nowrap;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);

  &.is-small {
    height: 26px;
    min-width: 26px;
    padding: 3px 6px;
    font-size: 12px;
  }

  &.is-large {
    height: 34px;
    min-width: 34px;
    padding: 5px 9px;
    font-size: 14px;
  }
}
</style>
