<script setup lang="ts">
import { computed } from 'vue'

import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import type {
  CSelectKeyAccessor,
  CSelectLabelAccessor,
  CSelectOption,
  CSelectValue,
  CSelectValueAccessor,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CSelectValue | null
    options?: object[]
    optionLabel?: CSelectLabelAccessor
    optionValue?: CSelectValueAccessor
    optionKey?: CSelectKeyAccessor
    placeholder?: string
    size?: CFormControlSize
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: null,
    options: () => [],
    optionLabel: undefined,
    optionValue: undefined,
    optionKey: undefined,
    placeholder: undefined,
    size: 'medium',
    disabled: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CSelectValue | null]
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)
const objectKeys = new WeakMap<object, number>()
let nextObjectKey = 0

const selection = computed({
  get: () => props.modelValue ?? null,
  set: (value: CSelectValue | null) => emit('update:modelValue', value),
})

function readPath(option: object, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (typeof value !== 'object' || value === null) return undefined
    return (value as Record<string, unknown>)[key]
  }, option)
}

function resolveLabel(option: object, accessor?: CSelectLabelAccessor) {
  const value = accessor
    ? typeof accessor === 'function'
      ? accessor(option)
      : readPath(option, accessor)
    : readPath(option, 'label')
  return value === undefined || value === null ? '' : String(value)
}

function resolveValue(option: object, accessor?: CSelectValueAccessor): CSelectValue {
  if (!accessor) return option
  return typeof accessor === 'function'
    ? accessor(option)
    : (readPath(option, accessor) as CSelectValue)
}

function objectKey(value: object) {
  let key = objectKeys.get(value)
  if (key === undefined) {
    key = nextObjectKey++
    objectKeys.set(value, key)
  }
  return key
}

const visibleOptions = computed(() =>
  props.options.flatMap((source, index) => {
    if (props.optionLabel || props.optionValue) {
      const record = source as Record<string, unknown>
      if (record.hidden) return []
      const value = resolveValue(source, props.optionValue)

      const explicitKey = props.optionKey
        ? typeof props.optionKey === 'function'
          ? props.optionKey(source)
          : readPath(source, props.optionKey)
        : undefined

      return [
        {
          key:
            typeof explicitKey === 'string' || typeof explicitKey === 'number'
              ? explicitKey
              : typeof value === 'object'
                ? `object:${objectKey(source)}`
                : `mapped:${typeof value}:${String(value)}:${index}`,
          label: resolveLabel(source, props.optionLabel),
          value,
          disabled: Boolean(record.disabled),
        },
      ]
    }

    const option = source as CSelectOption
    if (option.hidden) return []

    const valueKey =
      typeof option.value === 'object'
        ? `object:${objectKey(option.value)}`
        : `${typeof option.value}:${String(option.value)}:${index}`

    return [{ ...option, key: valueKey }]
  }),
)
</script>

<template>
  <select
    v-model="selection"
    v-bind="$attrs"
    class="c-select"
    :class="[
      `is-${size}`,
      {
        'is-invalid': invalid,
        'has-placeholder': Boolean(placeholder) && (modelValue ?? null) === null,
      },
    ]"
    :id="controlId"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
  >
    <option v-if="placeholder" :value="null" disabled>{{ placeholder }}</option>
    <option
      v-for="option in visibleOptions"
      :key="option.key"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
    <slot />
  </select>
</template>

<style scoped lang="scss">
.c-select {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  min-width: 0;
  padding: 4px 28px 4px 7px;
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.2;
  cursor: pointer;
  background-color: var(--c-input-background, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);

  &:hover:not(:disabled) {
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
    background-color: var(--c-disabled-background-color, #f1f3f5);
    border-color: var(--c-disabled-border-color, #d5d9df);
  }

  &.has-placeholder {
    color: var(--c-placeholder-color, #7a828d);
  }

  &.is-invalid {
    border-color: var(--c-danger-color, #b42318);

    &:focus {
      outline-color: var(--c-danger-color, #b42318);
    }
  }

  &.is-small {
    height: 26px;
    padding-block: 3px;
    font-size: 12px;
  }

  &.is-large {
    height: 34px;
    padding-block: 5px;
    font-size: 14px;
  }
}
</style>
