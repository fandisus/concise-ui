<script setup lang="ts">
import CIcon from '../icon/CIcon.vue'
import type { CButtonSize, CButtonType, CButtonVariant } from './types'

withDefaults(
  defineProps<{
    type?: CButtonType
    variant?: CButtonVariant
    size?: CButtonSize
    icon?: string
    disabled?: boolean
    loading?: boolean
    ariaLabel?: string
  }>(),
  {
    type: 'button',
    variant: 'default',
    size: 'medium',
    icon: undefined,
    disabled: false,
    loading: false,
    ariaLabel: undefined,
  },
)
</script>

<template>
  <button
    class="c-button"
    :class="[
      `is-${variant}`,
      `is-${size}`,
      { 'is-loading': loading, 'is-icon-only': !$slots.default },
    ]"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span v-if="loading" class="icon" aria-hidden="true">
      <CIcon :rotate="1">↻</CIcon>
    </span>
    <span v-else-if="icon || $slots.icon" class="icon" aria-hidden="true">
      <slot name="icon">
        <CIcon>{{ icon }}</CIcon>
      </slot>
    </span>

    <span v-if="$slots.default" class="label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.c-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: var(--c-control-height, 30px);
  padding: 4px 10px;
  gap: 6px;
  color: var(--c-text-color, #20242a);
  font: inherit;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);

  &:hover:not(:disabled) {
    background: var(--c-hover-color, #eef1f5);
  }

  &:active:not(:disabled) {
    background: var(--c-active-color, #e1e5ea);
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 2px solid var(--c-focus-color, #3578c6);
    outline-offset: 1px;
  }

  &:disabled {
    color: var(--c-disabled-text-color, #8a9099);
    cursor: not-allowed;
    background: var(--c-disabled-background-color, #f1f3f5);
    border-color: var(--c-disabled-border-color, #d5d9df);
  }

  &.is-primary {
    color: var(--c-primary-text-color, #fff);
    background: var(--c-primary-color, #286aa6);
    border-color: var(--c-primary-border-color, #245f95);

    &:hover:not(:disabled) {
      background: var(--c-primary-hover-color, #245f95);
    }

    &:active:not(:disabled) {
      background: var(--c-primary-active-color, #1f5687);
    }
  }

  &.is-success {
    color: var(--c-success-text-color, #fff);
    background: var(--c-success-color, #2f7d32);
    border-color: var(--c-success-border-color, #27692a);

    &:hover:not(:disabled) {
      background: var(--c-success-hover-color, #27692a);
    }

    &:active:not(:disabled) {
      background: var(--c-success-active-color, #205923);
    }
  }

  &.is-warning {
    color: var(--c-warning-text-color, #3d2a00);
    background: var(--c-warning-color, #f0ad32);
    border-color: var(--c-warning-border-color, #d7951d);

    &:hover:not(:disabled) {
      background: var(--c-warning-hover-color, #e3a025);
    }

    &:active:not(:disabled) {
      background: var(--c-warning-active-color, #cf8d18);
    }
  }

  &.is-danger {
    color: var(--c-danger-text-color, #fff);
    background: var(--c-danger-color, #b42318);
    border-color: var(--c-danger-border-color, #991b1b);

    &:hover:not(:disabled) {
      background: var(--c-danger-hover-color, #991b1b);
    }

    &:active:not(:disabled) {
      background: var(--c-danger-active-color, #7f1d1d);
    }
  }

  &.is-primary:disabled,
  &.is-success:disabled,
  &.is-warning:disabled,
  &.is-danger:disabled {
    color: var(--c-disabled-text-color, #8a9099);
    background: var(--c-disabled-background-color, #f1f3f5);
    border-color: var(--c-disabled-border-color, #d5d9df);
  }

  &.is-icon-only {
    width: var(--c-control-height, 30px);
    padding: 0;
  }

  .icon {
    display: inline-flex;
    flex: none;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.is-small {
    min-height: 26px;
    padding: 3px 8px;
    font-size: 12px;

    &.is-icon-only {
      width: 26px;
    }
  }

  &.is-large {
    min-height: 34px;
    padding: 5px 12px;
    font-size: 14px;

    &.is-icon-only {
      width: 34px;
    }
  }
}
</style>
