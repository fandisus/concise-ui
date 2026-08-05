<script setup lang="ts">
import { computed } from 'vue'

import CButton from '../button/CButton.vue'
import type { CFormControlSize } from '../form/types'
import CInput from '../input/CInput.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    size?: CFormControlSize
    controls?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: null,
    min: undefined,
    max: undefined,
    step: 1,
    size: 'medium',
    controls: true,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputValue = computed(() => props.modelValue?.toString() ?? '')
const normalizedStep = computed(() =>
  Number.isFinite(props.step) && props.step > 0 ? props.step : 1,
)
const canDecrement = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (props.modelValue === null || props.min === undefined || props.modelValue > props.min),
)
const canIncrement = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (props.modelValue === null || props.max === undefined || props.modelValue < props.max),
)

function updateValue(value: string) {
  if (value === '') {
    emit('update:modelValue', null)
    return
  }

  const number = Number(value)
  if (Number.isFinite(number)) emit('update:modelValue', number)
}

function clamp(value: number) {
  let next = value
  if (props.min !== undefined) next = Math.max(next, props.min)
  if (props.max !== undefined) next = Math.min(next, props.max)
  return Number(next.toPrecision(15))
}

function stepBy(direction: -1 | 1) {
  if (direction < 0 && !canDecrement.value) return
  if (direction > 0 && !canIncrement.value) return

  if (props.modelValue === null) {
    const initial = direction > 0 ? (props.min ?? 0) : (props.max ?? 0)
    emit('update:modelValue', clamp(initial))
    return
  }

  emit('update:modelValue', clamp(props.modelValue + normalizedStep.value * direction))
}
</script>

<template>
  <div class="c-number-input" :class="{ 'has-controls': controls }">
    <CButton
      v-if="controls"
      class="step decrement"
      icon="−"
      :size="size"
      :disabled="!canDecrement"
      aria-label="Decrease value"
      @click="stepBy(-1)"
    />

    <CInput
      v-bind="$attrs"
      class="input"
      :model-value="inputValue"
      type="number"
      :min="min"
      :max="max"
      :step="normalizedStep"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      @update:model-value="updateValue"
    />

    <CButton
      v-if="controls"
      class="step increment"
      icon="+"
      :size="size"
      :disabled="!canIncrement"
      aria-label="Increase value"
      @click="stepBy(1)"
    />
  </div>
</template>

<style scoped lang="scss">
.c-number-input {
  display: flex;
  width: 100%;
  min-width: 0;

  .input {
    flex: 1 1 auto;
  }

  .step {
    flex: none;
  }

  &.has-controls {
    .input {
      border-radius: 0;
      appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        margin: 0;
        appearance: none;
      }
    }

    .decrement {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    .increment {
      margin-inline-start: -1px;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    .input {
      margin-inline-start: -1px;
    }
  }
}
</style>
