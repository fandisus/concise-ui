<script setup lang="ts">
import { computed } from 'vue'

import type { CSeparatorOrientation } from './types'

const props = withDefaults(
  defineProps<{
    orientation?: CSeparatorOrientation
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
    decorative: false,
  },
)

const separatorRole = computed(() => (props.decorative ? undefined : 'separator'))
</script>

<template>
  <div
    class="c-separator"
    :class="`is-${orientation}`"
    :role="separatorRole"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-orientation="decorative ? undefined : orientation"
  />
</template>

<style scoped lang="scss">
.c-separator {
  box-sizing: border-box;
  flex: none;
  border: 0 solid var(--c-border-color, #d5d9df);

  &.is-horizontal {
    width: 100%;
    height: 1px;
    border-top-width: 1px;
  }

  &.is-vertical {
    align-self: stretch;
    width: 1px;
    min-height: 1rem;
    border-left-width: 1px;
  }
}
</style>
