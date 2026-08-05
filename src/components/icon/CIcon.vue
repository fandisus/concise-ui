<script setup lang="ts">
import { computed } from 'vue'

import CGlyph from '../glyph/CGlyph.vue'
import type { CGlyphDisplay, CGlyphSize } from '../glyph/types'

const props = withDefaults(
  defineProps<{
    display?: CGlyphDisplay
    size?: CGlyphSize
    rotate?: number
    color?: string
    label?: string
  }>(),
  {
    display: 'inline',
    size: undefined,
    rotate: 0,
    color: undefined,
    label: undefined,
  },
)

const iconStyle = computed(() => (props.color ? { color: props.color } : undefined))
</script>

<template>
  <CGlyph
    class="c-icon"
    :display="display"
    :size="size"
    :rotate="rotate"
    :label="label"
    :style="iconStyle"
  >
    <slot />
  </CGlyph>
</template>

<style scoped lang="scss">
.c-icon {
  color: inherit;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol",
    "Noto Sans Symbols 2", system-ui, sans-serif;
}
</style>
