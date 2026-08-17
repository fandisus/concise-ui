<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

import type { CFormControlSize } from '../form/types'
import { useFormControl } from '../form/useFormControl'
import type { CDatePickerModelValue, CDatePickerRangeValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CDatePickerModelValue
    range?: boolean
    min?: string
    max?: string
    placeholder?: string
    size?: CFormControlSize
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
    startLabel?: string
    endLabel?: string
  }>(),
  {
    modelValue: null,
    range: false,
    min: undefined,
    max: undefined,
    placeholder: undefined,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    startLabel: 'Select start date',
    endLabel: 'Select end date',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CDatePickerModelValue]
  change: [value: CDatePickerModelValue]
}>()

interface CalendarDay {
  date: Date
  iso: string
  day: number
  currentMonth: boolean
  disabled: boolean
}

const attrs = useAttrs()
const generatedId = `c-date-picker-${useId()}`
const rootElement = ref<HTMLElement | null>(null)
const triggerElement = ref<HTMLButtonElement | null>(null)
const calendarElement = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const awaitingRangeEnd = ref(false)
const hoveredDate = ref<string | null>(null)
const today = startOfDay(new Date())
const visibleMonth = ref(startOfMonth(today))
const { controlId, describedBy, invalid: formInvalid, required } = useFormControl(props)

const triggerId = computed(() => controlId.value ?? generatedId)
const calendarId = computed(() => `${triggerId.value}-calendar`)
const triggerAttrs = computed(() => {
  const forwarded = { ...attrs }
  delete forwarded.class
  delete forwarded.style
  delete forwarded.id
  return forwarded
})
const rangeValue = computed<CDatePickerRangeValue>(() => {
  if (Array.isArray(props.modelValue)) {
    return [props.modelValue[0] ?? null, props.modelValue[1] ?? null]
  }
  return [props.modelValue ?? null, null]
})
const singleValue = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue[0] ?? null
  return props.modelValue ?? null
})
const invertedRange = computed(() => {
  const [start, end] = rangeValue.value
  return Boolean(start && end && start > end)
})
const selectedDateIsOutsideLimits = computed(() => {
  const values = props.range ? rangeValue.value : [singleValue.value]
  return values.some((value) => Boolean(value && dateIsDisabled(value)))
})
const invalid = computed(
  () => formInvalid.value || invertedRange.value || selectedDateIsOutsideLimits.value,
)
const hasValue = computed(() =>
  props.range ? Boolean(rangeValue.value[0] || rangeValue.value[1]) : Boolean(singleValue.value),
)
const displayValue = computed(() => {
  if (!props.range) return singleValue.value ? formatDisplayDate(singleValue.value) : ''

  const [start, end] = rangeValue.value
  if (!start && !end) return ''
  if (start && !end) return `${formatDisplayDate(start)} - ...`
  if (!start && end) return `... - ${formatDisplayDate(end)}`
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
})
const resolvedPlaceholder = computed(
  () => props.placeholder ?? (props.range ? 'Select date range' : 'Select date'),
)
const selectionInstruction = computed(() =>
  props.range && awaitingRangeEnd.value ? props.endLabel : props.startLabel,
)
const monthTitle = computed(() =>
  new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(visibleMonth.value),
)
const weekdayLabels = computed(() => {
  const sunday = new Date(2026, 0, 4)
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(addDays(sunday, index)),
  )
})
const calendarDays = computed<CalendarDay[]>(() => {
  const first = startOfMonth(visibleMonth.value)
  const gridStart = addDays(first, -first.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    const iso = toIsoDate(date)
    return {
      date,
      iso,
      day: date.getDate(),
      currentMonth: date.getMonth() === first.getMonth(),
      disabled: dateIsDisabled(iso),
    }
  })
})
const previewRange = computed<[string, string] | null>(() => {
  if (!props.range) return null
  const start = rangeValue.value[0]
  const candidate = awaitingRangeEnd.value ? hoveredDate.value : null
  if (!start || !candidate) return null
  return start <= candidate ? [start, candidate] : [candidate, start]
})
const previousMonthDisabled = computed(() => {
  if (!props.min) return false
  return toIsoDate(endOfMonth(addMonths(visibleMonth.value, -1))) < props.min
})
const nextMonthDisabled = computed(() => {
  if (!props.max) return false
  return toIsoDate(startOfMonth(addMonths(visibleMonth.value, 1))) > props.max
})

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) return
    awaitingRangeEnd.value = Boolean(
      props.range && rangeValue.value[0] && !rangeValue.value[1],
    )
  },
  { deep: true },
)

watch(
  [() => props.disabled, () => props.readonly],
  ([disabled, readonly]) => {
    if (disabled || readonly) closeCalendar(false)
  },
)

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIsoDate(value: string | null | undefined) {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return toIsoDate(date) === value ? date : null
}

function formatDisplayDate(value: string) {
  const date = parseIsoDate(value)
  if (!date) return value
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatAccessibleDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function dateIsDisabled(iso: string) {
  return Boolean((props.min && iso < props.min) || (props.max && iso > props.max))
}

function dayIsSelected(iso: string) {
  if (!props.range) return singleValue.value === iso
  return rangeValue.value[0] === iso || rangeValue.value[1] === iso
}

function dayIsInRange(iso: string) {
  if (!props.range) return false
  const displayedRange = previewRange.value
  if (displayedRange) return iso > displayedRange[0] && iso < displayedRange[1]
  const [start, end] = rangeValue.value
  return Boolean(start && end && iso > start && iso < end)
}

function initialFocusDate() {
  const selected = props.range ? rangeValue.value[0] : singleValue.value
  if (selected && !dateIsDisabled(selected)) return selected
  const todayIso = toIsoDate(today)
  if (!dateIsDisabled(todayIso)) return todayIso
  return props.min ?? props.max ?? todayIso
}

function focusDate(iso: string) {
  nextTick(() => {
    calendarElement.value
      ?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)
      ?.focus({ preventScroll: true })
  })
}

function showMonthContaining(iso: string) {
  const date = parseIsoDate(iso)
  if (date) visibleMonth.value = startOfMonth(date)
}

async function openCalendar() {
  if (props.disabled || props.readonly || isOpen.value) return
  const focusIso = initialFocusDate()
  showMonthContaining(focusIso)
  awaitingRangeEnd.value = Boolean(props.range && rangeValue.value[0] && !rangeValue.value[1])
  hoveredDate.value = null
  isOpen.value = true
  await nextTick()
  focusDate(focusIso)
}

function closeCalendar(restoreFocus = true) {
  if (!isOpen.value) return
  isOpen.value = false
  hoveredDate.value = null
  if (restoreFocus) nextTick(() => triggerElement.value?.focus({ preventScroll: true }))
}

function toggleCalendar() {
  if (isOpen.value) closeCalendar()
  else void openCalendar()
}

function selectDate(iso: string) {
  if (dateIsDisabled(iso)) return

  if (!props.range) {
    emit('update:modelValue', iso)
    emit('change', iso)
    closeCalendar()
    return
  }

  const start = rangeValue.value[0]
  if (!awaitingRangeEnd.value || !start) {
    emit('update:modelValue', [iso, null])
    awaitingRangeEnd.value = true
    hoveredDate.value = null
    return
  }

  const value: CDatePickerRangeValue = iso < start ? [iso, start] : [start, iso]
  emit('update:modelValue', value)
  emit('change', value)
  awaitingRangeEnd.value = false
  closeCalendar()
}

function clearValue() {
  const value: CDatePickerModelValue = props.range ? [null, null] : null
  emit('update:modelValue', value)
  emit('change', value)
  awaitingRangeEnd.value = false
  hoveredDate.value = null
}

function selectToday() {
  const iso = toIsoDate(today)
  if (!dateIsDisabled(iso)) selectDate(iso)
}

function moveMonth(amount: number) {
  const nextMonth = addMonths(visibleMonth.value, amount)
  if (amount < 0 && previousMonthDisabled.value) return
  if (amount > 0 && nextMonthDisabled.value) return
  visibleMonth.value = nextMonth
  focusDate(firstEnabledDateInMonth(nextMonth, amount))
}

function firstEnabledDateInMonth(month: Date, direction: number) {
  if (direction < 0) {
    const last = toIsoDate(endOfMonth(month))
    return props.max && last > props.max ? props.max : last
  }
  const first = toIsoDate(startOfMonth(month))
  return props.min && first < props.min ? props.min : first
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void openCalendar()
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeCalendar()
  }
}

function handleDayKeydown(event: KeyboardEvent, day: CalendarDay) {
  let target = day.date

  if (event.key === 'ArrowLeft') target = addDays(day.date, -1)
  else if (event.key === 'ArrowRight') target = addDays(day.date, 1)
  else if (event.key === 'ArrowUp') target = addDays(day.date, -7)
  else if (event.key === 'ArrowDown') target = addDays(day.date, 7)
  else if (event.key === 'Home') target = addDays(day.date, -day.date.getDay())
  else if (event.key === 'End') target = addDays(day.date, 6 - day.date.getDay())
  else if (event.key === 'PageUp') target = addMonths(day.date, -1)
  else if (event.key === 'PageDown') target = addMonths(day.date, 1)
  else if (event.key === 'Escape') {
    event.preventDefault()
    closeCalendar()
    return
  } else return

  event.preventDefault()
  const iso = toIsoDate(target)
  if (dateIsDisabled(iso)) return
  visibleMonth.value = startOfMonth(target)
  focusDate(iso)
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (isOpen.value && !rootElement.value?.contains(event.target as Node)) closeCalendar(false)
}

function handleDocumentFocusIn(event: FocusEvent) {
  if (isOpen.value && !rootElement.value?.contains(event.target as Node)) closeCalendar(false)
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
  document.addEventListener('focusin', handleDocumentFocusIn, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  document.removeEventListener('focusin', handleDocumentFocusIn, true)
})
</script>

<template>
  <div
    ref="rootElement"
    class="c-date-picker"
    :class="[
      $attrs.class,
      `is-${size}`,
      { 'is-open': isOpen, 'is-invalid': invalid, 'is-readonly': readonly },
    ]"
    :style="$attrs.style"
  >
    <button
      ref="triggerElement"
      v-bind="triggerAttrs"
      :id="triggerId"
      class="trigger"
      type="button"
      :disabled="disabled"
      :aria-controls="calendarId"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="dialog"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-required="required ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-describedby="describedBy"
      @click="toggleCalendar"
      @keydown="handleTriggerKeydown"
    >
      <span class="value" :class="{ placeholder: !hasValue }">
        {{ displayValue || resolvedPlaceholder }}
      </span>
      <span class="calendar-icon" aria-hidden="true">▦</span>
    </button>

    <div
      v-if="isOpen"
      :id="calendarId"
      ref="calendarElement"
      class="calendar"
      role="dialog"
      aria-modal="false"
      :aria-label="range ? 'Choose date range' : 'Choose date'"
      @keydown.esc.prevent.stop="closeCalendar()"
    >
      <div class="calendar-header">
        <button
          type="button"
          class="month-button"
          :disabled="previousMonthDisabled"
          aria-label="Previous month"
          @click="moveMonth(-1)"
        >
          ‹
        </button>
        <strong aria-live="polite">{{ monthTitle }}</strong>
        <button
          type="button"
          class="month-button"
          :disabled="nextMonthDisabled"
          aria-label="Next month"
          @click="moveMonth(1)"
        >
          ›
        </button>
      </div>

      <p v-if="range" class="instruction" aria-live="polite">{{ selectionInstruction }}</p>

      <div class="weekdays" aria-hidden="true">
        <span v-for="weekday in weekdayLabels" :key="weekday">{{ weekday }}</span>
      </div>

      <div class="days" role="group" :aria-label="monthTitle">
        <button
          v-for="day in calendarDays"
          :key="day.iso"
          type="button"
          class="day"
          :class="{
            'is-outside': !day.currentMonth,
            'is-today': day.iso === toIsoDate(today),
            'is-selected': dayIsSelected(day.iso),
            'is-in-range': dayIsInRange(day.iso),
          }"
          :data-date="day.iso"
          :disabled="day.disabled"
          :aria-label="formatAccessibleDate(day.date)"
          :aria-pressed="dayIsSelected(day.iso) ? 'true' : 'false'"
          :aria-current="day.iso === toIsoDate(today) ? 'date' : undefined"
          :tabindex="day.iso === initialFocusDate() ? 0 : -1"
          @click="selectDate(day.iso)"
          @keydown="handleDayKeydown($event, day)"
          @mouseenter="!day.disabled && (hoveredDate = day.iso)"
          @mouseleave="hoveredDate = null"
        >
          {{ day.day }}
        </button>
      </div>

      <div class="calendar-footer">
        <button
          type="button"
          class="text-button"
          :disabled="dateIsDisabled(toIsoDate(today))"
          @click="selectToday"
        >
          Today
        </button>
        <button type="button" class="text-button" :disabled="!hasValue" @click="clearValue">
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-date-picker {
  position: relative;
  width: 100%;
  min-width: 0;

  .trigger {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    min-width: 0;
    padding: 4px 7px;
    color: var(--c-text-color, #20242a);
    font: inherit;
    line-height: 1.2;
    text-align: start;
    cursor: pointer;
    background: var(--c-input-background, var(--c-surface-color, #fff));
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
      background: var(--c-disabled-background-color, #f1f3f5);
      border-color: var(--c-disabled-border-color, #d5d9df);
    }
  }

  .value {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.placeholder {
      color: var(--c-placeholder-color, #7a828d);
    }
  }

  .calendar-icon {
    flex: none;
    margin-inline-start: 8px;
    color: var(--c-muted-text-color, #68717d);
    font-size: 15px;
    line-height: 1;
  }

  &.is-invalid .trigger {
    border-color: var(--c-danger-color, #b42318);

    &:focus {
      outline-color: var(--c-danger-color, #b42318);
    }
  }

  &.is-readonly .trigger {
    cursor: default;
    background: var(--c-readonly-background-color, var(--c-subtle-surface-color, #f7f8fa));
  }

  &.is-small .trigger {
    height: 26px;
    padding: 3px 6px;
    font-size: 12px;
  }

  &.is-large .trigger {
    height: 34px;
    padding: 5px 8px;
    font-size: 14px;
  }
}

.calendar {
  position: absolute;
  z-index: var(--c-date-picker-z-index, 40);
  inset-inline-start: 0;
  top: calc(100% + 2px);
  box-sizing: border-box;
  width: 280px;
  max-width: calc(100vw - 16px);
  padding: 6px;
  color: var(--c-text-color, #20242a);
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-control-border-color, #bfc5ce);
  border-radius: var(--c-border-radius, 3px);
  box-shadow: 0 3px 10px rgb(20 28 38 / 14%);
}

.calendar-header,
.calendar-footer {
  display: flex;
  align-items: center;
}

.calendar-header {
  justify-content: space-between;
  min-height: 28px;

  strong {
    font-size: 13px;
  }
}

.month-button,
.text-button,
.day {
  color: inherit;
  font: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 2px;

  &:focus-visible {
    outline: 1px solid var(--c-focus-color, #3578c6);
    outline-offset: -1px;
  }

  &:disabled {
    color: var(--c-disabled-text-color, #8a9099);
    cursor: not-allowed;
  }
}

.month-button {
  width: 28px;
  height: 26px;
  padding: 0;
  font-size: 20px;

  &:hover:not(:disabled) {
    background: var(--c-hover-color, #eef1f5);
  }
}

.instruction {
  min-height: 17px;
  margin: 1px 2px 4px;
  color: var(--c-muted-text-color, #68717d);
  font-size: 11px;
}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekdays span {
  padding-block: 4px;
  color: var(--c-muted-text-color, #68717d);
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.day {
  position: relative;
  height: 30px;
  padding: 0;
  font-size: 12px;

  &:hover:not(:disabled),
  &.is-in-range {
    background: var(--c-selection-subtle-color, #dceaf8);
  }

  &.is-outside:not(.is-selected) {
    color: var(--c-muted-text-color, #7a828d);
  }

  &.is-today::after {
    position: absolute;
    inset-inline: 8px;
    bottom: 2px;
    height: 2px;
    content: '';
    background: var(--c-primary-color, #286aa6);
  }

  &.is-selected {
    color: var(--c-primary-text-color, #fff);
    background: var(--c-primary-color, #286aa6);

    &::after {
      background: currentcolor;
    }
  }
}

.calendar-footer {
  justify-content: space-between;
  padding-top: 5px;
  margin-top: 4px;
  border-top: 1px solid var(--c-border-color, #d5d9df);
}

.text-button {
  min-height: 24px;
  padding: 2px 5px;
  color: var(--c-primary-color, #286aa6);
  font-size: 12px;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }
}
</style>
