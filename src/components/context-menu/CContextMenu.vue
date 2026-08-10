<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import CMenu from '../menu/CMenu.vue'
import type { CMenuActionItem, CMenuEntry, CMenuSelectEvent } from '../menu/types'
import type {
  CContextMenuCloseEvent,
  CContextMenuCloseReason,
  CContextMenuOpenEvent,
} from './types'

interface CContextMenuItemSlotProps {
  item: CMenuActionItem
  depth: number
  expanded: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    items: CMenuEntry[]
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    disabled: false,
    ariaLabel: 'Context menu',
  },
)

const emit = defineEmits<{
  open: [event: CContextMenuOpenEvent]
  close: [event: CContextMenuCloseEvent]
  select: [event: CMenuSelectEvent]
}>()

defineSlots<{
  item?(props: CContextMenuItemSlotProps): unknown
}>()

const isOpen = ref(false)
const panelElement = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)
const viewportMargin = 8
let focusToRestore: HTMLElement | null = null

function eventIsInsidePanel(event: Event) {
  const panel = panelElement.value
  return Boolean(panel && event.composedPath().includes(panel))
}

async function openAt(nextX: number, nextY: number, originalEvent?: Event) {
  if (props.disabled) return

  if (!isOpen.value) {
    focusToRestore =
      originalEvent?.currentTarget instanceof HTMLElement
        ? originalEvent.currentTarget
        : document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
  }

  const requestedX = Number.isFinite(nextX) ? nextX : 0
  const requestedY = Number.isFinite(nextY) ? nextY : 0
  x.value = Math.max(viewportMargin, requestedX)
  y.value = Math.max(viewportMargin, requestedY)
  isOpen.value = true
  emit('open', { x: requestedX, y: requestedY, originalEvent })

  await nextTick()
  const panel = panelElement.value
  if (!panel || !isOpen.value) return

  const bounds = panel.getBoundingClientRect()
  x.value = Math.max(
    viewportMargin,
    Math.min(requestedX, window.innerWidth - bounds.width - viewportMargin),
  )
  y.value = Math.max(
    viewportMargin,
    Math.min(requestedY, window.innerHeight - bounds.height - viewportMargin),
  )

  await nextTick()
  panel
    .querySelector<HTMLElement>('[data-c-menu-trigger][tabindex="0"]')
    ?.focus({ preventScroll: true })
}

function open(event: MouseEvent) {
  event.preventDefault()
  void openAt(event.clientX, event.clientY, event)
}

function close(reason: CContextMenuCloseReason = 'programmatic') {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close', { reason })

  const target = focusToRestore
  focusToRestore = null
  if (reason === 'escape') {
    nextTick(() => target?.focus({ preventScroll: true }))
  }
}

function handleSelect(event: CMenuSelectEvent) {
  emit('select', event)
  close('select')
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (isOpen.value && !eventIsInsidePanel(event)) close('outside')
}

function handleDocumentFocusIn(event: FocusEvent) {
  if (isOpen.value && !eventIsInsidePanel(event)) close('outside')
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (!isOpen.value || event.key !== 'Escape') return
  event.preventDefault()
  event.stopPropagation()
  close('escape')
}

function handleViewportChange() {
  close('viewport')
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close('disabled')
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
  document.addEventListener('focusin', handleDocumentFocusIn, true)
  document.addEventListener('keydown', handleDocumentKeydown, true)
  document.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('blur', handleViewportChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  document.removeEventListener('focusin', handleDocumentFocusIn, true)
  document.removeEventListener('keydown', handleDocumentKeydown, true)
  document.removeEventListener('scroll', handleViewportChange, true)
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('blur', handleViewportChange)
})

defineExpose({ open, openAt, close })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="panelElement"
      v-bind="$attrs"
      class="c-context-menu"
      :style="{ left: `${x}px`, top: `${y}px` }"
      @contextmenu.prevent
    >
      <CMenu
        :items="items"
        orientation="vertical"
        submenu-mode="flyout"
        :aria-label="ariaLabel"
        @select="handleSelect"
      >
        <template v-if="$slots.item" #item="slotProps">
          <slot name="item" v-bind="slotProps" />
        </template>
      </CMenu>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.c-context-menu {
  position: fixed;
  z-index: var(--c-context-menu-z-index, 1100);
  min-width: var(--c-context-menu-min-width, 190px);
  max-width: min(var(--c-context-menu-max-width, 320px), calc(100vw - 16px));
  padding: 3px;
  color: var(--c-text-color, #20242a);
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-border-color, #d5d9df);
  border-radius: var(--c-border-radius, 3px);
  box-shadow: var(--c-menu-shadow, 0 3px 10px rgb(20 28 38 / 14%));

  :deep(.c-menu.is-root) {
    width: 100%;
  }
}
</style>
