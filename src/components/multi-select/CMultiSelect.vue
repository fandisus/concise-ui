<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import CButton from '../button/CButton.vue'
import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import type {
  CSelectKeyAccessor,
  CSelectLabelAccessor,
  CSelectOption,
  CSelectValue,
  CSelectValueAccessor,
} from '../select/types'
import type { CMultiSelectModelValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CMultiSelectModelValue
    options?: object[]
    optionLabel?: CSelectLabelAccessor
    optionValue?: CSelectValueAccessor
    optionKey?: CSelectKeyAccessor
    placeholder?: string
    filterable?: boolean
    clearable?: boolean
    size?: CFormControlSize
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    optionLabel: undefined,
    optionValue: undefined,
    optionKey: undefined,
    placeholder: undefined,
    filterable: false,
    clearable: false,
    size: 'medium',
    disabled: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CMultiSelectModelValue]
  clear: []
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)
const objectKeys = new WeakMap<object, number>()
const listboxId = `c-multi-select-listbox-${useId()}`
const controlElement = ref<HTMLElement | null>(null)
const listElement = ref<HTMLUListElement | null>(null)
const isOpen = ref(false)
const isFiltering = ref(false)
const query = ref('')
const highlightedKey = ref<string | number | null>(null)
let nextObjectKey = 0

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

function valuesMatch(left: CSelectValue, right: CSelectValue) {
  if (Object.is(left, right)) return true
  if (
    props.optionValue ||
    !props.optionKey ||
    typeof left !== 'object' ||
    left === null ||
    typeof right !== 'object' ||
    right === null
  ) {
    return false
  }

  const leftKey =
    typeof props.optionKey === 'function'
      ? props.optionKey(left)
      : readPath(left, props.optionKey)
  const rightKey =
    typeof props.optionKey === 'function'
      ? props.optionKey(right)
      : readPath(right, props.optionKey)

  return (
    (typeof leftKey === 'string' || typeof leftKey === 'number') &&
    Object.is(leftKey, rightKey)
  )
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

function selectedIndex(value: CSelectValue) {
  return props.modelValue.findIndex((selected) => valuesMatch(selected, value))
}

function isSelected(value: CSelectValue) {
  return selectedIndex(value) >= 0
}

const selectedLabels = computed(() =>
  visibleOptions.value
    .filter((option) => isSelected(option.value))
    .map((option) => option.label),
)
const selectedSummary = computed(() => selectedLabels.value.join(', '))
const displayText = computed(() => selectedSummary.value || props.placeholder || '')
const filterText = computed(() => (isFiltering.value ? query.value.trim() : ''))
const filteredOptions = computed(() => {
  const search = filterText.value.toLocaleLowerCase()
  return search
    ? visibleOptions.value.filter((option) => option.label.toLocaleLowerCase().includes(search))
    : visibleOptions.value
})
const highlightedIndex = computed(() =>
  filteredOptions.value.findIndex((option) => option.key === highlightedKey.value),
)
const activeDescendant = computed(() =>
  highlightedIndex.value >= 0 ? `${listboxId}-option-${highlightedIndex.value}` : undefined,
)

watch(
  selectedSummary,
  (summary) => {
    if (!isFiltering.value) query.value = summary
  },
  { immediate: true },
)

watch(filteredOptions, () => {
  if (
    isOpen.value &&
    (highlightedIndex.value < 0 || filteredOptions.value[highlightedIndex.value]?.disabled)
  ) {
    highlightFirstEnabled()
  }
})

watch(highlightedIndex, (index) => {
  if (index < 0) return
  nextTick(() => {
    const option = listElement.value?.children[index]
    if (option instanceof HTMLElement) option.scrollIntoView({ block: 'nearest' })
  })
})

function highlightFirstEnabled() {
  highlightedKey.value = filteredOptions.value.find((option) => !option.disabled)?.key ?? null
}

function openList() {
  if (props.disabled) return
  isOpen.value = true
  if (highlightedIndex.value < 0) highlightFirstEnabled()
}

function closeList() {
  isOpen.value = false
  isFiltering.value = false
  query.value = selectedSummary.value
  highlightedKey.value = null
}

function handleFocus(event: FocusEvent) {
  openList()
  if (props.filterable) (event.currentTarget as HTMLInputElement).select()
}

function handleClick(event: MouseEvent) {
  openList()
  if (props.filterable && !isFiltering.value) {
    const input = event.currentTarget as HTMLInputElement
    input.select()
  }
}

function handleControlClick() {
  controlElement.value?.focus()
  openList()
}

function handleInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  isFiltering.value = true
  isOpen.value = true
  nextTick(highlightFirstEnabled)
}

function toggleOption(option: (typeof visibleOptions.value)[number]) {
  if (option.disabled) return
  const next = [...props.modelValue]
  const index = selectedIndex(option.value)
  if (index >= 0) next.splice(index, 1)
  else next.push(option.value)
  emit('update:modelValue', next)
  controlElement.value?.focus()
}

function moveHighlight(direction: 1 | -1) {
  if (!isOpen.value) {
    openList()
    return
  }
  const options = filteredOptions.value
  if (!options.length) return

  let index = highlightedIndex.value
  for (let attempt = 0; attempt < options.length; attempt += 1) {
    index = (index + direction + options.length) % options.length
    if (!options[index]?.disabled) {
      highlightedKey.value = options[index]?.key ?? null
      return
    }
  }
}

function highlightEdge(edge: 'first' | 'last') {
  if (!isOpen.value) openList()
  const options = edge === 'first' ? filteredOptions.value : [...filteredOptions.value].reverse()
  highlightedKey.value = options.find((option) => !option.disabled)?.key ?? null
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home' && isOpen.value) {
    event.preventDefault()
    highlightEdge('first')
  } else if (event.key === 'End' && isOpen.value) {
    event.preventDefault()
    highlightEdge('last')
  } else if (event.key === 'Enter' || (event.key === ' ' && !props.filterable)) {
    event.preventDefault()
    if (!isOpen.value) openList()
    else {
      const option = filteredOptions.value[highlightedIndex.value]
      if (option) toggleOption(option)
    }
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeList()
  } else if (event.key === 'Tab') {
    closeList()
  }
}

function handleFocusOut(event: FocusEvent) {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !(event.currentTarget as HTMLElement).contains(next)) closeList()
}

function clearSelection() {
  emit('update:modelValue', [])
  query.value = ''
  isFiltering.value = false
  emit('clear')
}
</script>

<template>
  <div
    class="c-multi-select-control"
    :class="{ 'is-clearable': clearable }"
    @focusout="handleFocusOut"
  >
    <input
      v-if="filterable"
      ref="controlElement"
      v-bind="$attrs"
      class="field search"
      :class="[`is-${size}`, { 'is-invalid': invalid, 'has-placeholder': !query }]"
      :id="controlId"
      :value="query"
      :placeholder="placeholder"
      :disabled="disabled"
      autocomplete="off"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-required="required ? 'true' : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      @focus="handleFocus"
      @click="handleClick"
      @input="handleInput"
      @keydown="handleKeydown"
    />

    <div
      v-else
      ref="controlElement"
      v-bind="$attrs"
      class="field"
      :class="[`is-${size}`, { 'is-invalid': invalid, 'has-placeholder': !modelValue.length, 'is-disabled': disabled }]"
      :id="controlId"
      :tabindex="disabled ? undefined : 0"
      role="combobox"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-required="required ? 'true' : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      @focus="handleFocus"
      @click="handleControlClick"
      @keydown="handleKeydown"
    >
      <span class="value">{{ displayText }}</span>
    </div>

    <CButton
      v-if="clearable"
      class="clear"
      icon="×"
      :size="size"
      :disabled="disabled || !modelValue.length"
      :aria-controls="controlId"
      aria-label="Clear selections"
      @click="clearSelection"
    />

    <ul
      v-show="isOpen"
      ref="listElement"
      :id="listboxId"
      class="options"
      role="listbox"
      aria-multiselectable="true"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :id="`${listboxId}-option-${index}`"
        :key="option.key"
        class="option"
        :class="{
          'is-highlighted': option.key === highlightedKey,
          'is-selected': isSelected(option.value),
          'is-disabled': option.disabled,
        }"
        role="option"
        :aria-selected="isSelected(option.value) ? 'true' : 'false'"
        :aria-disabled="option.disabled ? 'true' : undefined"
        @mousemove="!option.disabled && (highlightedKey = option.key)"
        @mousedown.prevent
        @click="toggleOption(option)"
      >
        <span class="check" aria-hidden="true">{{ isSelected(option.value) ? '✓' : '' }}</span>
        <span>{{ option.label }}</span>
      </li>
      <li v-if="!filteredOptions.length" class="empty" role="presentation">
        No matching options
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.c-multi-select-control {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;

  &.is-clearable {
    .field {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    .clear {
      flex: none;
      margin-inline-start: -1px;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  }
}

.field {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  height: 30px;
  min-width: 0;
  padding: 4px 28px 4px 7px;
  overflow: hidden;
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  background-color: var(--c-input-background, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);

  &::after {
    position: absolute;
    inset-inline-end: 9px;
    top: 50%;
    color: var(--c-muted-text-color, #68717d);
    font-size: 10px;
    line-height: 1;
    pointer-events: none;
    content: '▼';
    transform: translateY(-50%);
  }

  &.search {
    display: block;
    cursor: text;
  }

  &:hover:not(.is-disabled):not(:disabled) {
    border-color: var(--c-control-hover-border-color, #929aa6);
  }

  &:focus {
    z-index: 1;
    border-color: var(--c-focus-color, #3578c6);
    outline: 1px solid var(--c-focus-color, #3578c6);
  }

  &:disabled,
  &.is-disabled {
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

.value {
  overflow: hidden;
  text-overflow: ellipsis;
}

.options {
  position: absolute;
  z-index: 20;
  inset-inline: 0;
  top: calc(100% + 2px);
  max-height: 210px;
  padding: 2px;
  margin: 0;
  overflow-y: auto;
  color: var(--c-text-color, #20242a);
  list-style: none;
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);
  box-shadow: 0 2px 6px rgb(0 0 0 / 14%);
}

.option,
.empty {
  min-height: 26px;
  padding: 4px 7px;
  line-height: 18px;
}

.option {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 5px;
  cursor: default;

  &.is-highlighted {
    background: var(--c-hover-color, #eef1f5);
  }

  &.is-selected {
    color: var(--c-primary-color, #286aa6);
    font-weight: 600;
  }

  &.is-disabled {
    color: var(--c-disabled-text-color, #8a9099);
  }
}

.check {
  text-align: center;
}

.empty {
  color: var(--c-muted-text-color, #68717d);
}
</style>
