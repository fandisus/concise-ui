<script setup lang="ts">
import { computed } from 'vue'

import { isGlyphSize } from './types'
import type { CGlyphDisplay, CGlyphSize } from './types'

const props = withDefaults(
  defineProps<{
    display?: CGlyphDisplay
    size?: CGlyphSize
    rotate?: number
    label?: string
  }>(),
  {
    display: 'inline',
    size: undefined,
    rotate: 0,
    label: undefined,
  },
)

const isRotating = computed(() => Number.isFinite(props.rotate) && props.rotate !== 0)

const glyphStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}

  if (isGlyphSize(props.size)) style['--c-glyph-size'] = props.size

  if (isRotating.value) {
    style['--c-glyph-rotation-duration'] = `${1 / Math.abs(props.rotate)}s`
    style['--c-glyph-rotation-direction'] = props.rotate < 0 ? 'reverse' : 'normal'
  }

  return style
})
</script>

<template>
  <span
    class="c-glyph"
    :class="[`is-${display}`, { 'is-rotating': isRotating }]"
    :style="glyphStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span class="content"><slot /></span>
  </span>
</template>

<style scoped lang="scss">
.c-glyph {
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  font-size: var(--c-glyph-size, 1em);
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  vertical-align: -0.125em;

  &.is-inline {
    width: 1em;
    height: 1em;
  }

  &.is-circle {
    width: 1.75em;
    height: 1.75em;
    background: var(--c-glyph-circle-background, #eef1f5);
    border: 1px solid var(--c-glyph-circle-border-color, #d5d9df);
    border-radius: 50%;
    vertical-align: middle;
  }

  .content {
    display: inline-block;
    transform-origin: center;
  }

  &.is-rotating .content {
    animation: c-glyph-rotate var(--c-glyph-rotation-duration) linear infinite;
    animation-direction: var(--c-glyph-rotation-direction);
  }
}

@keyframes c-glyph-rotate {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-glyph.is-rotating .content {
    animation: none;
  }
}
</style>
