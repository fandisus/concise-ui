<script setup lang="ts">
import { computed } from 'vue'

import type { CProgressBarSize, CProgressBarVariant } from './types'

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    indeterminate?: boolean
    showValue?: boolean
    size?: CProgressBarSize
    variant?: CProgressBarVariant
    ariaLabel?: string
  }>(),
  {
    value: 0,
    max: 100,
    indeterminate: false,
    showValue: false,
    size: 'medium',
    variant: 'default',
    ariaLabel: undefined,
  },
)

defineSlots<{
  value(props: { value: number; max: number; percentage: number }): unknown
}>()

const normalizedMax = computed(() =>
  Number.isFinite(props.max) && props.max > 0 ? props.max : 100,
)
const normalizedValue = computed(() => {
  if (!Number.isFinite(props.value)) return 0
  return Math.min(Math.max(props.value, 0), normalizedMax.value)
})
const percentage = computed(() => (normalizedValue.value / normalizedMax.value) * 100)
const percentageLabel = computed(() => `${Math.round(percentage.value)}%`)
</script>

<template>
  <div
    class="c-progress-bar"
    :class="[`is-${size}`, `is-${variant}`, { 'is-indeterminate': indeterminate }]"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : normalizedMax"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
  >
    <span class="track" aria-hidden="true">
      <span
        class="fill"
        :style="indeterminate ? undefined : { width: `${percentage}%` }"
      />
    </span>

    <span v-if="showValue && !indeterminate" class="value">
      <slot
        name="value"
        :value="normalizedValue"
        :max="normalizedMax"
        :percentage="percentage"
      >
        {{ percentageLabel }}
      </slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.c-progress-bar {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 7px;

  .track {
    position: relative;
    box-sizing: border-box;
    flex: 1 1 auto;
    height: 10px;
    overflow: hidden;
    background: var(--c-progress-track-color, #e5e8ec);
    border: 1px solid var(--c-border-color, #cfd4da);
    border-radius: var(--c-border-radius, 3px);
  }

  .fill {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    background: var(--c-primary-color, #286aa6);
    transition: width 160ms ease-out;
  }

  .value {
    flex: none;
    min-width: 3.5em;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    line-height: 1;
    text-align: end;
    font-variant-numeric: tabular-nums;
  }

  &.is-small .track {
    height: 6px;
  }

  &.is-large .track {
    height: 14px;
  }

  &.is-success .fill {
    background: var(--c-success-color, #2f7d32);
  }

  &.is-warning .fill {
    background: var(--c-warning-color, #f0ad32);
  }

  &.is-danger .fill {
    background: var(--c-danger-color, #b42318);
  }

  &.is-indeterminate .fill {
    width: 35%;
    animation: c-progress-bar-indeterminate 1.2s ease-in-out infinite;
  }
}

@keyframes c-progress-bar-indeterminate {
  from {
    transform: translateX(-110%);
  }

  to {
    transform: translateX(300%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-progress-bar {
    .fill {
      transition: none;
    }

    &.is-indeterminate .fill {
      animation-duration: 2.4s;
    }
  }
}
</style>
