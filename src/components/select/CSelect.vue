<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRaw, useId, watch } from 'vue'

import CButton from '../button/CButton.vue'
import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import CIcon from '../icon/CIcon.vue'
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
    clearable?: boolean
    filterable?: boolean
    debounceWait?: number
    loading?: boolean
    minSearchLength?: number
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
    clearable: false,
    filterable: false,
    debounceWait: 300,
    loading: false,
    minSearchLength: 0,
    size: 'medium',
    disabled: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CSelectValue | null]
  search: [query: string]
  clear: []
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)
const objectKeys = new WeakMap<object, number>()
const listboxId = `c-select-listbox-${useId()}`
const inputElement = ref<HTMLInputElement | null>(null)
const listElement = ref<HTMLUListElement | null>(null)
const isOpen = ref(false)
const isFiltering = ref(false)
const query = ref('')
const highlightedKey = ref<string | number | null>(null)
const cachedSelection = ref<{ value: CSelectValue; label: string } | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | undefined
let lastSearchQuery: string | undefined
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

function valuesMatch(left: CSelectValue | null, right: CSelectValue | null) {
  if (Object.is(left, right)) return true
  if (
    typeof left === 'object' &&
    left !== null &&
    typeof right === 'object' &&
    right !== null &&
    Object.is(toRaw(left), toRaw(right))
  ) {
    return true
  }
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

const selectedOption = computed(() =>
  visibleOptions.value.find((option) => valuesMatch(option.value, selection.value)),
)
const selectedLabel = computed(() => {
  const value = selection.value
  if (value === null) return ''
  if (selectedOption.value) return selectedOption.value.label
  if (!props.optionValue && typeof value === 'object') {
    const label = resolveLabel(value, props.optionLabel)
    if (label) return label
  }
  if (cachedSelection.value && valuesMatch(cachedSelection.value.value, value)) {
    return cachedSelection.value.label
  }
  return ''
})
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
const searchTooShort = computed(
  () =>
    (isFiltering.value || selection.value === null) &&
    query.value.trim().length < Math.max(0, props.minSearchLength),
)
const activeDescendant = computed(() =>
  !props.loading && !searchTooShort.value && highlightedIndex.value >= 0
    ? `${listboxId}-option-${highlightedIndex.value}`
    : undefined,
)

watch(
  [selection, selectedOption],
  ([value, option]) => {
    if (value === null) cachedSelection.value = null
    else if (option) cachedSelection.value = { value, label: option.label }
    else if (!props.optionValue && typeof value === 'object') {
      const label = resolveLabel(value, props.optionLabel)
      if (label) cachedSelection.value = { value, label }
    }

    if (!isOpen.value) query.value = selectedLabel.value
  },
  { immediate: true },
)

watch(filteredOptions, () => {
  if (
    isOpen.value &&
    !props.loading &&
    !searchTooShort.value &&
    (highlightedIndex.value < 0 || filteredOptions.value[highlightedIndex.value]?.disabled)
  ) {
    highlightFirstEnabled()
  }
})

watch(
  () => props.loading,
  (loading) => {
    if (loading) highlightedKey.value = null
    else if (isOpen.value && !searchTooShort.value) highlightFirstEnabled()
  },
)

watch(highlightedIndex, (index) => {
  if (index < 0) return
  nextTick(() => {
    const option = listElement.value?.children[index]
    if (option instanceof HTMLElement) option.scrollIntoView({ block: 'nearest' })
  })
})

watch(
  [required, selection, () => props.filterable],
  () => {
    nextTick(() => {
      inputElement.value?.setCustomValidity(
        props.filterable && required.value && selection.value === null
          ? 'Please select an option.'
          : '',
      )
    })
  },
  { immediate: true },
)

function highlightFirstEnabled() {
  highlightedKey.value = filteredOptions.value.find((option) => !option.disabled)?.key ?? null
}

function emitSearch(queryValue: string) {
  lastSearchQuery = queryValue
  emit('search', queryValue)
}

function cancelScheduledSearch() {
  if (searchTimer !== undefined) clearTimeout(searchTimer)
  searchTimer = undefined
}

function scheduleSearch(value: string) {
  cancelScheduledSearch()
  const search = value.trim()

  if (search.length < Math.max(0, props.minSearchLength)) {
    if (lastSearchQuery !== '') emitSearch('')
    return
  }
  if (!search) {
    emitSearch('')
    return
  }

  const wait = Math.max(0, props.debounceWait)
  if (!wait) emitSearch(search)
  else {
    searchTimer = setTimeout(() => {
      searchTimer = undefined
      emitSearch(search)
    }, wait)
  }
}

function openList() {
  if (props.disabled) return
  isOpen.value = true
  const selected = selectedOption.value
  highlightedKey.value =
    !props.loading && !searchTooShort.value && selected && !selected.disabled
      ? selected.key
      : null
  if (highlightedKey.value === null && !props.loading && !searchTooShort.value) {
    highlightFirstEnabled()
  }
}

function closeList(restoreLabel = true) {
  cancelScheduledSearch()
  isOpen.value = false
  isFiltering.value = false
  highlightedKey.value = null
  if (restoreLabel) query.value = selectedLabel.value
}

function handleFocus(event: FocusEvent) {
  openList()
  const input = event.currentTarget as HTMLInputElement
  input.select()
}

function handleClick(event: MouseEvent) {
  openList()
  if (!isFiltering.value) (event.currentTarget as HTMLInputElement).select()
}

function handleInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  isFiltering.value = true
  scheduleSearch(query.value)
  isOpen.value = true
  nextTick(() => {
    if (!props.loading && !searchTooShort.value) highlightFirstEnabled()
    else highlightedKey.value = null
  })
}

function moveHighlight(direction: 1 | -1) {
  if (!isOpen.value) {
    openList()
    return
  }
  if (props.loading || searchTooShort.value) return
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

function chooseOption(option: (typeof visibleOptions.value)[number]) {
  if (option.disabled) return
  cancelScheduledSearch()
  cachedSelection.value = { value: option.value, label: option.label }
  emit('update:modelValue', option.value)
  query.value = option.label
  closeList(false)
  inputElement.value?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (!isOpen.value) openList()
    else if (!props.loading && !searchTooShort.value) {
      const option = filteredOptions.value[highlightedIndex.value]
      if (option) chooseOption(option)
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
  cachedSelection.value = null
  emit('update:modelValue', null)
  query.value = ''
  if (props.filterable) scheduleSearch('')
  closeList(false)
  emit('clear')
}

onBeforeUnmount(() => {
  cancelScheduledSearch()
})
</script>

<template>
  <div
    class="c-select-control"
    :class="{ 'is-clearable': clearable, 'is-filterable': filterable }"
    @focusout="filterable ? handleFocusOut($event) : undefined"
  >
    <template v-if="filterable">
      <div class="combobox">
        <input
          ref="inputElement"
          v-bind="$attrs"
          class="c-select search"
          :class="[`is-${size}`, { 'is-invalid': invalid, 'has-placeholder': !query }]"
          :id="controlId"
          :value="query"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-busy="loading ? 'true' : undefined"
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
        <span class="indicator" aria-hidden="true">
          <CIcon v-if="loading" :rotate="1">↻</CIcon>
          <span v-else>▼</span>
        </span>
      </div>

      <ul
        ref="listElement"
        v-show="isOpen"
        :id="listboxId"
        class="options"
        role="listbox"
        :aria-busy="loading ? 'true' : undefined"
      >
        <li v-if="loading" class="empty" role="presentation">Loading…</li>
        <li v-else-if="searchTooShort" class="empty" role="presentation">
          Type at least {{ Math.max(0, minSearchLength) }}
          {{ Math.max(0, minSearchLength) === 1 ? 'character' : 'characters' }}
        </li>
        <template v-else>
          <li
            v-for="(option, index) in filteredOptions"
            :id="`${listboxId}-option-${index}`"
            :key="option.key"
            class="option"
            :class="{
              'is-highlighted': option.key === highlightedKey,
              'is-selected': valuesMatch(option.value, selection),
              'is-disabled': option.disabled,
            }"
            role="option"
            :aria-selected="valuesMatch(option.value, selection) ? 'true' : 'false'"
            :aria-disabled="option.disabled ? 'true' : undefined"
            @mousemove="!option.disabled && (highlightedKey = option.key)"
            @mousedown.prevent
            @click="chooseOption(option)"
          >
            {{ option.label }}
          </li>
          <li v-if="!filteredOptions.length" class="empty" role="presentation">
            No matching options
          </li>
        </template>
      </ul>
    </template>

    <select
      v-else
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

    <CButton
      v-if="clearable"
      class="clear"
      icon="×"
      :size="size"
      :disabled="disabled || (modelValue ?? null) === null"
      :aria-controls="controlId"
      aria-label="Clear selection"
      @click="clearSelection"
    />
  </div>
</template>

<style scoped lang="scss">
.c-select-control {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;

  .c-select,
  .combobox {
    flex: 1 1 auto;
    min-width: 0;
  }

  &.is-clearable {
    .c-select {
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

.combobox {
  position: relative;
  display: flex;
}

.indicator {
  position: absolute;
  inset-inline-end: 9px;
  top: 50%;
  display: inline-flex;
  color: var(--c-muted-text-color, #68717d);
  font-size: 10px;
  line-height: 1;
  pointer-events: none;
  transform: translateY(-50%);
}

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

  &.search {
    cursor: text;
  }

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
  cursor: default;

  &.is-highlighted {
    background: var(--c-hover-color, #eef1f5);
  }

  &.is-selected {
    color: var(--c-primary-text-color, #fff);
    background: var(--c-primary-color, #286aa6);
  }

  &.is-disabled {
    color: var(--c-disabled-text-color, #8a9099);
  }
}

.empty {
  color: var(--c-muted-text-color, #68717d);
}
</style>
