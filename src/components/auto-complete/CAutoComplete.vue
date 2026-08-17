<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

import CButton from '../button/CButton.vue'
import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import CIcon from '../icon/CIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: string[]
    placeholder?: string
    clearable?: boolean
    debounceWait?: number
    loading?: boolean
    minSearchLength?: number
    size?: CFormControlSize
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    placeholder: undefined,
    clearable: false,
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
  'update:modelValue': [value: string]
  search: [query: string]
  select: [value: string]
  clear: []
}>()

const { controlId, describedBy, invalid, required } = useFormControl(props)
const listboxId = `c-auto-complete-listbox-${useId()}`
const inputElement = ref<HTMLInputElement | null>(null)
const listElement = ref<HTMLUListElement | null>(null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
let searchTimer: ReturnType<typeof setTimeout> | undefined
let lastSearchQuery: string | undefined

const filteredOptions = computed(() => {
  const search = props.modelValue.trim().toLocaleLowerCase()
  return search
    ? props.options.filter((option) => option.toLocaleLowerCase().includes(search))
    : props.options
})
const searchTooShort = computed(
  () => props.modelValue.trim().length < Math.max(0, props.minSearchLength),
)
const activeDescendant = computed(() =>
  !props.loading && !searchTooShort.value && highlightedIndex.value >= 0
    ? `${listboxId}-option-${highlightedIndex.value}`
    : undefined,
)

watch(filteredOptions, () => {
  if (!isOpen.value || props.loading || searchTooShort.value) return
  highlightedIndex.value = filteredOptions.value.length ? 0 : -1
})

watch(
  () => props.loading,
  (loading) => {
    if (loading) highlightedIndex.value = -1
    else if (isOpen.value && !searchTooShort.value) {
      highlightedIndex.value = filteredOptions.value.length ? 0 : -1
    }
  },
)

watch(highlightedIndex, (index) => {
  if (index < 0) return
  nextTick(() => {
    const option = listElement.value?.children[index]
    if (option instanceof HTMLElement) option.scrollIntoView({ block: 'nearest' })
  })
})

function openList() {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = -1
}

function emitSearch(query: string) {
  lastSearchQuery = query
  emit('search', query)
}

function cancelScheduledSearch() {
  if (searchTimer !== undefined) clearTimeout(searchTimer)
  searchTimer = undefined
}

function scheduleSearch(value: string) {
  cancelScheduledSearch()

  const query = value.trim()
  if (query.length < Math.max(0, props.minSearchLength)) {
    if (lastSearchQuery !== '') emitSearch('')
    return
  }
  if (!query) {
    emitSearch('')
    return
  }

  const wait = Math.max(0, props.debounceWait)
  if (!wait) emitSearch(query)
  else {
    searchTimer = setTimeout(() => {
      searchTimer = undefined
      emitSearch(query)
    }, wait)
  }
}

function closeList() {
  isOpen.value = false
  highlightedIndex.value = -1
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  scheduleSearch(value)
  isOpen.value = true
}

function chooseOption(value: string) {
  cancelScheduledSearch()
  emit('update:modelValue', value)
  emit('select', value)
  closeList()
  inputElement.value?.focus()
}

function moveHighlight(direction: 1 | -1) {
  if (!isOpen.value) openList()
  if (props.loading || searchTooShort.value) return
  const count = filteredOptions.value.length
  if (!count) return
  highlightedIndex.value =
    highlightedIndex.value < 0
      ? direction === 1
        ? 0
        : count - 1
      : (highlightedIndex.value + direction + count) % count
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && isOpen.value && highlightedIndex.value >= 0) {
    event.preventDefault()
    const option = filteredOptions.value[highlightedIndex.value]
    if (option !== undefined) chooseOption(option)
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

function clearValue() {
  emit('update:modelValue', '')
  scheduleSearch('')
  closeList()
  emit('clear')
}

onBeforeUnmount(() => {
  cancelScheduledSearch()
})
</script>

<template>
  <div
    class="c-auto-complete-control"
    :class="{ 'is-clearable': clearable }"
    @focusout="handleFocusOut"
  >
    <div class="combobox">
      <input
        ref="inputElement"
        v-bind="$attrs"
        class="field"
        :class="[`is-${size}`, { 'is-invalid': invalid }]"
        :id="controlId"
        :value="modelValue"
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
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        @focus="openList"
        @click="openList"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <span class="indicator" aria-hidden="true">
        <CIcon v-if="loading" :rotate="1">↻</CIcon>
        <span v-else>▼</span>
      </span>
    </div>

    <CButton
      v-if="clearable"
      class="clear"
      icon="×"
      :size="size"
      :disabled="disabled || !modelValue"
      :aria-controls="controlId"
      aria-label="Clear value"
      @click="clearValue"
    />

    <ul
      v-show="isOpen"
      ref="listElement"
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
          :key="`${option}:${index}`"
          class="option"
          :class="{
            'is-highlighted': index === highlightedIndex,
            'is-selected': option === modelValue,
          }"
          role="option"
          :aria-selected="option === modelValue ? 'true' : 'false'"
          @mousemove="highlightedIndex = index"
          @mousedown.prevent
          @click="chooseOption(option)"
        >
          {{ option }}
        </li>
        <li v-if="!filteredOptions.length" class="empty" role="presentation">
          No matching suggestions
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.c-auto-complete-control {
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

.combobox {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-width: 0;

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

.field {
  box-sizing: border-box;
  flex: 1 1 auto;
  width: 100%;
  height: 30px;
  min-width: 0;
  padding: 4px 28px 4px 7px;
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.2;
  background-color: var(--c-input-background, var(--c-surface-color, #fff));
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
}

.empty {
  color: var(--c-muted-text-color, #68717d);
}
</style>
