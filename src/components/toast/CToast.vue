<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import CButton from '../button/CButton.vue'
import CIcon from '../icon/CIcon.vue'
import type {
  CToastCloseEvent,
  CToastCloseReason,
  CToastItem,
  CToastPosition,
  CToastVariant,
} from './types'

type ToastKey = string

interface ToastTimer {
  duration: number
  handle: ReturnType<typeof setTimeout>
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: CToastItem[]
    position?: CToastPosition
    duration?: number
    closable?: boolean
    teleportTo?: string | HTMLElement
    ariaLabel?: string
  }>(),
  {
    modelValue: () => [],
    position: 'top-end',
    duration: 5000,
    closable: true,
    teleportTo: 'body',
    ariaLabel: 'Notifications',
  },
)

const emit = defineEmits<{
  'update:modelValue': [items: CToastItem[]]
  close: [event: CToastCloseEvent]
}>()

defineSlots<{
  item?(props: { item: CToastItem; dismiss: () => void }): unknown
}>()

const objectKeys = new WeakMap<CToastItem, number>()
const timers = new Map<ToastKey, ToastTimer>()
const hoveredKeys = new Set<ToastKey>()
const focusedKeys = new Set<ToastKey>()
let nextObjectKey = 0

function objectKey(item: CToastItem) {
  let key = objectKeys.get(item)
  if (key === undefined) {
    key = nextObjectKey++
    objectKeys.set(item, key)
  }
  return key
}

function itemKey(item: CToastItem): ToastKey {
  return item.id === undefined
    ? `object:${objectKey(item)}`
    : `id:${typeof item.id}:${String(item.id)}`
}

function normalizedDuration(item: CToastItem) {
  const value = item.duration ?? props.duration
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function resolvedVariant(item: CToastItem): CToastVariant {
  return item.variant ?? 'default'
}

function resolvedIcon(item: CToastItem) {
  if (item.icon) return item.icon
  return {
    default: '●',
    success: '✓',
    info: 'i',
    warning: '!',
    danger: '×',
  }[resolvedVariant(item)]
}

const normalizedItems = computed(() =>
  props.modelValue.map((item) => ({
    item,
    key: itemKey(item),
    duration: normalizedDuration(item),
    closable: item.closable ?? props.closable,
    variant: resolvedVariant(item),
  })),
)

function clearTimer(key: ToastKey) {
  const timer = timers.get(key)
  if (timer) clearTimeout(timer.handle)
  timers.delete(key)
}

function startTimer(key: ToastKey) {
  const entry = normalizedItems.value.find((candidate) => candidate.key === key)
  if (
    !entry ||
    entry.duration === 0 ||
    timers.has(key) ||
    hoveredKeys.has(key) ||
    focusedKeys.has(key)
  ) {
    return
  }

  timers.set(key, {
    duration: entry.duration,
    handle: setTimeout(() => removeItem(key, 'timeout'), entry.duration),
  })
}

function pauseTimer(key: ToastKey, source: 'focus' | 'hover') {
  if (source === 'focus') focusedKeys.add(key)
  else hoveredKeys.add(key)
  clearTimer(key)
}

function resumeTimer(key: ToastKey, source: 'focus' | 'hover') {
  if (source === 'focus') focusedKeys.delete(key)
  else hoveredKeys.delete(key)
  startTimer(key)
}

function handleToastFocusOut(event: FocusEvent, key: ToastKey) {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !(event.currentTarget as HTMLElement).contains(next)) {
    resumeTimer(key, 'focus')
  }
}

function removeItem(key: ToastKey, reason: CToastCloseReason) {
  const entry = normalizedItems.value.find((candidate) => candidate.key === key)
  if (!entry) return

  hoveredKeys.delete(key)
  focusedKeys.delete(key)
  clearTimer(key)
  emit(
    'update:modelValue',
    normalizedItems.value
      .filter((candidate) => candidate.key !== key)
      .map((candidate) => candidate.item),
  )
  emit('close', { item: entry.item, reason })
}

function syncTimers() {
  const activeKeys = new Set(normalizedItems.value.map((entry) => entry.key))

  for (const key of timers.keys()) {
    if (!activeKeys.has(key)) clearTimer(key)
  }
  for (const key of hoveredKeys) {
    if (!activeKeys.has(key)) hoveredKeys.delete(key)
  }
  for (const key of focusedKeys) {
    if (!activeKeys.has(key)) focusedKeys.delete(key)
  }

  for (const entry of normalizedItems.value) {
    const existing = timers.get(entry.key)
    if (entry.duration === 0) {
      clearTimer(entry.key)
    } else if (!existing || existing.duration !== entry.duration) {
      clearTimer(entry.key)
      startTimer(entry.key)
    }
  }
}

watch(normalizedItems, syncTimers, { immediate: true })

onBeforeUnmount(() => {
  for (const key of timers.keys()) clearTimer(key)
  hoveredKeys.clear()
  focusedKeys.clear()
})
</script>

<template>
  <Teleport :to="teleportTo">
    <TransitionGroup
      v-bind="$attrs"
      tag="section"
      name="c-toast"
      class="c-toast-stack"
      :class="`is-${position}`"
      :aria-label="ariaLabel"
      aria-live="polite"
      aria-relevant="additions"
    >
      <article
        v-for="entry in normalizedItems"
        :key="entry.key"
        class="toast"
        :class="`is-${entry.variant}`"
        :role="entry.variant === 'danger' ? 'alert' : 'status'"
        aria-atomic="true"
        @mouseenter="pauseTimer(entry.key, 'hover')"
        @mouseleave="resumeTimer(entry.key, 'hover')"
        @focusin="pauseTimer(entry.key, 'focus')"
        @focusout="handleToastFocusOut($event, entry.key)"
      >
        <span class="icon" aria-hidden="true">
          <CIcon>{{ resolvedIcon(entry.item) }}</CIcon>
        </span>

        <div class="content">
          <slot
            name="item"
            :item="entry.item"
            :dismiss="() => removeItem(entry.key, 'dismiss')"
          >
            <strong v-if="entry.item.title" class="title">{{ entry.item.title }}</strong>
            <div class="message">{{ entry.item.message }}</div>
          </slot>
        </div>

        <CButton
          v-if="entry.closable"
          class="close"
          icon="×"
          size="small"
          :aria-label="`Dismiss ${entry.item.title || 'notification'}`"
          @click="removeItem(entry.key, 'dismiss')"
        />
      </article>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped lang="scss">
.c-toast-stack {
  position: fixed;
  z-index: var(--c-toast-z-index, 1200);
  display: flex;
  width: min(var(--c-toast-width, 340px), calc(100vw - 24px));
  margin: 0;
  padding: 0;
  gap: 7px;
  pointer-events: none;

  &.is-top-start,
  &.is-top-center,
  &.is-top-end {
    top: 12px;
    flex-direction: column;
  }

  &.is-bottom-start,
  &.is-bottom-center,
  &.is-bottom-end {
    bottom: 12px;
    flex-direction: column;
  }

  &.is-top-start,
  &.is-bottom-start {
    inset-inline-start: 12px;
  }

  &.is-top-end,
  &.is-bottom-end {
    inset-inline-end: 12px;
  }

  &.is-top-center,
  &.is-bottom-center {
    left: 50%;
    transform: translateX(-50%);
  }
}

.toast {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: start;
  width: 100%;
  min-height: 46px;
  padding: 8px;
  gap: 7px;
  color: var(--c-text-color, #20242a);
  pointer-events: auto;
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-border-color, #cfd4da);
  border-inline-start: var(--c-toast-accent-width, 6px) solid var(--c-primary-color, #286aa6);
  border-radius: var(--c-border-radius, 3px);
  box-shadow: var(--c-toast-shadow, 0 3px 12px rgb(20 28 38 / 18%));

  &.is-success {
    border-inline-start-color: var(--c-success-color, #2f7d32);

    .icon {
      color: var(--c-success-color, #2f7d32);
    }
  }

  &.is-info {
    border-inline-start-color: var(--c-info-color, #16869b);

    .icon {
      color: var(--c-info-color, #16869b);
    }
  }

  &.is-warning {
    border-inline-start-color: var(--c-warning-border-color, #d7951d);

    .icon {
      color: var(--c-warning-text-color, #7a4d00);
    }
  }

  &.is-danger {
    border-inline-start-color: var(--c-danger-color, #b42318);

    .icon {
      color: var(--c-danger-color, #b42318);
    }
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--c-primary-color, #286aa6);
    font-weight: 700;
  }

  .content {
    min-width: 0;
  }

  .title {
    display: block;
    margin-bottom: 2px;
    font-size: 13px;
    line-height: 1.3;
  }

  .message {
    overflow-wrap: anywhere;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    line-height: 1.4;
    white-space: pre-wrap;
  }

  .close {
    margin: -3px -3px -3px 0;
  }
}

.c-toast-enter-active,
.c-toast-leave-active {
  transition:
    opacity 140ms ease-out,
    transform 140ms ease-out;
}

.c-toast-enter-from,
.c-toast-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.is-bottom-start,
.is-bottom-center,
.is-bottom-end {
  .c-toast-enter-from,
  .c-toast-leave-to {
    transform: translateY(5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-toast-enter-active,
  .c-toast-leave-active {
    transition: none;
  }
}
</style>
