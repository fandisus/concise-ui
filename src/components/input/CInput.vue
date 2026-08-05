<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

import { useFormControl } from '../form/useFormControl'
import type { CFormControlSize } from '../form/types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    type?: InputHTMLAttributes['type']
    size?: CFormControlSize
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    v-bind="$attrs"
    class="c-input"
    :class="[`is-${size}`, { 'is-invalid': invalid }]"
    :id="controlId"
    :value="modelValue ?? ''"
    :type="type"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    @input="updateValue"
  />
</template>

<style scoped lang="scss">
.c-input {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  min-width: 0;
  padding: 4px 7px;
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.2;
  background: var(--c-input-background, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);

  &::placeholder {
    color: var(--c-placeholder-color, #7a828d);
  }

  &:hover:not(:disabled):not(:read-only) {
    border-color: var(--c-control-hover-border-color, #929aa6);
  }

  &:focus {
    position: relative;
    z-index: 1;
    border-color: var(--c-focus-color, #3578c6);
    outline: 1px solid var(--c-focus-color, #3578c6);
  }

  &:disabled {
    color: var(--c-disabled-text-color, #8a9099);
    cursor: not-allowed;
    background: var(--c-disabled-background-color, #f1f3f5);
    border-color: var(--c-disabled-border-color, #d5d9df);
  }

  &:read-only:not(:disabled) {
    background: var(--c-readonly-background-color, #f7f8fa);
  }

  &.is-invalid {
    border-color: var(--c-danger-color, #b42318);

    &:focus {
      outline-color: var(--c-danger-color, #b42318);
    }
  }

  &.is-small {
    height: 26px;
    padding: 3px 6px;
    font-size: 12px;
  }

  &.is-large {
    height: 34px;
    padding: 5px 8px;
    font-size: 14px;
  }
}
</style>
