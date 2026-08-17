<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import type { CCheckboxModelValue, CCheckboxValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CCheckboxModelValue
    value?: CCheckboxValue
    trueValue?: CCheckboxValue
    falseValue?: CCheckboxValue
    size?: CFormControlSize
    indeterminate?: boolean
    threeState?: boolean
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: false,
    value: true,
    trueValue: true,
    falseValue: false,
    size: 'medium',
    indeterminate: false,
    threeState: false,
    disabled: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CCheckboxModelValue]
}>()

const input = ref<HTMLInputElement>()
const { controlId, describedBy, invalid, required } = useFormControl(props)
const checked = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue.some((entry) => Object.is(entry, props.value))
    : Object.is(props.modelValue, props.trueValue),
)
const usesThreeStates = computed(() => props.threeState && !Array.isArray(props.modelValue))
const isIndeterminate = computed(() =>
  usesThreeStates.value ? props.modelValue === null : props.indeterminate,
)

watchEffect(() => {
  if (input.value) input.value.indeterminate = isIndeterminate.value
})

function updateValue(event: Event) {
  const nextChecked = (event.target as HTMLInputElement).checked

  if (usesThreeStates.value) {
    if (Object.is(props.modelValue, props.falseValue)) {
      emit('update:modelValue', props.trueValue)
    } else if (Object.is(props.modelValue, props.trueValue)) {
      emit('update:modelValue', null)
    } else {
      emit('update:modelValue', props.falseValue)
    }
    return
  }

  if (Array.isArray(props.modelValue)) {
    const next = props.modelValue.filter((entry) => !Object.is(entry, props.value))
    if (nextChecked) next.push(props.value)
    emit('update:modelValue', next)
    return
  }

  emit('update:modelValue', nextChecked ? props.trueValue : props.falseValue)
}
</script>

<template>
  <label class="c-checkbox" :class="[`is-${size}`, { 'is-disabled': disabled }]">
    <input
      ref="input"
      v-bind="$attrs"
      class="input"
      type="checkbox"
      :id="controlId"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :aria-checked="isIndeterminate ? 'mixed' : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      @change="updateValue"
    />
    <span v-if="$slots.default" class="label"><slot /></span>
  </label>
</template>

<style scoped lang="scss">
.c-checkbox {
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
    border-radius: 2px;

    &::after {
      position: absolute;
      display: none;
      content: '';
    }

    &:checked,
    &:indeterminate {
      background: var(--c-primary-color, #286aa6);
      border-color: var(--c-primary-border-color, #245f95);
    }

    &:checked::after {
      top: 1px;
      left: 4px;
      display: block;
      width: 4px;
      height: 8px;
      border: solid var(--c-primary-text-color, #fff);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    &:indeterminate::after {
      top: 6px;
      left: 3px;
      display: block;
      width: 8px;
      height: 2px;
      background: var(--c-primary-text-color, #fff);
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
      background-color: var(--c-disabled-background-color, #f1f3f5);
      border-color: var(--c-disabled-border-color, #d5d9df);
    }
  }

  &.is-small {
    font-size: 12px;

    .input {
      width: 14px;
      height: 14px;

      &:checked::after {
        top: 0;
        left: 3px;
      }

      &:indeterminate::after {
        top: 5px;
        left: 2px;
      }
    }
  }

  &.is-large {
    font-size: 14px;

    .input {
      width: 18px;
      height: 18px;

      &:checked::after {
        top: 2px;
        left: 5px;
      }

      &:indeterminate::after {
        top: 7px;
        left: 4px;
      }
    }
  }
}
</style>
