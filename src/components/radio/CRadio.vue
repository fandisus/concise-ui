<script setup lang="ts">
import { computed } from 'vue'

import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import type { CRadioValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CRadioValue | null
    value: CRadioValue
    size?: CFormControlSize
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: null,
    size: 'medium',
    disabled: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CRadioValue]
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)
const checked = computed(() => Object.is(props.modelValue, props.value))
</script>

<template>
  <label class="c-radio" :class="[`is-${size}`, { 'is-disabled': disabled }]">
    <input
      v-bind="$attrs"
      class="input"
      type="radio"
      :id="controlId"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      @change="emit('update:modelValue', value)"
    />
    <span v-if="$slots.default" class="label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.c-radio {
  display: inline-flex;
  align-items: flex-start;
  width: fit-content;
  min-width: 0;
  gap: 6px;
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.35;
  cursor: pointer;

  .input {
    box-sizing: border-box;
    position: relative;
    flex: none;
    width: 16px;
    height: 16px;
    margin: 1px 0 0;
    appearance: none;
    cursor: inherit;
    background: var(--c-input-background, var(--c-surface-color, #fff));
    border: 1px solid var(--c-control-border-color, #bfc5ce);
    border-radius: 50%;

    &::after {
      position: absolute;
      top: 3px;
      left: 3px;
      display: none;
      width: 8px;
      height: 8px;
      content: '';
      background: var(--c-primary-color, #286aa6);
      border-radius: 50%;
    }

    &:checked {
      border-color: var(--c-primary-border-color, var(--c-primary-color, #286aa6));

      &::after {
        display: block;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--c-focus-color, #3578c6);
      outline-offset: 2px;
    }

    &[aria-invalid='true'] {
      border-color: var(--c-danger-color, #b42318);
    }
  }

  &.is-disabled {
    color: var(--c-disabled-text-color, #8a9099);
    cursor: not-allowed;

    .input {
      background: var(--c-disabled-background-color, #f1f3f5);
      border-color: var(--c-disabled-border-color, #d5d9df);
    }
  }

  &.is-small {
    font-size: 12px;

    .input {
      width: 14px;
      height: 14px;

      &::after {
        top: 3px;
        left: 3px;
        width: 6px;
        height: 6px;
      }
    }
  }

  &.is-large {
    font-size: 14px;

    .input {
      width: 18px;
      height: 18px;

      &::after {
        top: 4px;
        left: 4px;
      }
    }
  }
}
</style>
