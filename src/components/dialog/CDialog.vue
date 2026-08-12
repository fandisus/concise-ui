<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useSlots, watch } from 'vue'

import type { CDialogCloseEvent, CDialogCloseReason, CDialogSize } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    title?: string
    ariaLabel?: string
    closable?: boolean
    closeOnEscape?: boolean
    closeOnOutside?: boolean
    size?: CDialogSize
    fullScreen?: boolean
    allowOverflow?: boolean
    width?: string
    teleportTo?: string | HTMLElement
  }>(),
  {
    title: undefined,
    ariaLabel: 'Dialog',
    closable: true,
    closeOnEscape: true,
    closeOnOutside: true,
    size: 'medium',
    fullScreen: false,
    allowOverflow: false,
    width: undefined,
    teleportTo: 'body',
  },
)

const open = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  close: [event: CDialogCloseEvent]
}>()

defineSlots<{
  default(props: { close: () => void }): unknown
  header?(): unknown
  actions?(props: { close: () => void }): unknown
  footer?(props: { close: () => void }): unknown
}>()

const slots = useSlots()
const dialogElement = ref<HTMLDialogElement | null>(null)
const uid = useId()
const titleId = `c-dialog-title-${uid}`
const hasHeading = computed(() => Boolean(props.title || slots.header))
const hasHeader = computed(() => hasHeading.value || Boolean(slots.actions) || props.closable)
const dialogStyle = computed(() => ({ '--c-dialog-width': props.width }))

async function syncOpenState(shouldOpen: boolean) {
  await nextTick()
  const dialog = dialogElement.value
  if (!dialog) return

  if (shouldOpen && !dialog.open) dialog.showModal()
  else if (!shouldOpen && dialog.open) dialog.close()
}

function close(reason: CDialogCloseReason = 'programmatic') {
  if (!open.value) return
  open.value = false
  dialogElement.value?.close()
  emit('close', { reason })
}

function closeDialog() {
  close()
}

function handleCancel(event: Event) {
  event.preventDefault()
  if (props.closeOnEscape) close('escape')
}

function handleBackdropClick(event: MouseEvent) {
  if (props.closeOnOutside && event.target === dialogElement.value) close('outside')
}

watch(open, (value) => void syncOpenState(value))
onMounted(() => void syncOpenState(open.value))

defineExpose({ close })
</script>

<template>
  <Teleport :to="teleportTo">
    <dialog
      ref="dialogElement"
      v-bind="$attrs"
      class="c-dialog"
      :class="[
        `is-${size}`,
        { 'is-full-screen': fullScreen, 'allows-overflow': allowOverflow },
      ]"
      :style="dialogStyle"
      :aria-labelledby="hasHeading ? titleId : undefined"
      :aria-label="hasHeading ? undefined : ariaLabel"
      @cancel="handleCancel"
      @click="handleBackdropClick"
    >
      <div class="surface">
        <header v-if="hasHeader" class="header">
          <div v-if="hasHeading" :id="titleId" class="heading">
            <slot name="header">
              <div class="title">{{ title }}</div>
            </slot>
          </div>

          <div v-if="$slots.actions || closable" class="controls">
            <div v-if="$slots.actions" class="actions">
              <slot name="actions" :close="closeDialog" />
            </div>
            <button
              v-if="closable"
              type="button"
              class="close-button"
              :aria-label="`Close ${title || 'dialog'}`"
              @click="close('close-button')"
            >
              ×
            </button>
          </div>
        </header>

        <div class="body">
          <slot :close="closeDialog" />
        </div>

        <footer v-if="$slots.footer" class="footer">
          <slot name="footer" :close="closeDialog" />
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped lang="scss">
.c-dialog {
  box-sizing: border-box;
  width: min(var(--c-dialog-width, var(--c-dialog-default-width, 480px)), calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  margin: auto;
  padding: 0;
  overflow: visible;
  color: var(--c-text-color, #20242a);
  font-family: var(--c-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: var(--c-font-size, 13px);
  background: transparent;
  border: 0;

  &.is-small {
    --c-dialog-default-width: 360px;
  }

  &.is-medium {
    --c-dialog-default-width: 480px;
  }

  &.is-large {
    --c-dialog-default-width: 720px;
  }

  &::backdrop {
    background: var(--c-dialog-backdrop-color, rgb(20 28 38 / 38%));
  }

  .surface {
    display: flex;
    max-height: calc(100vh - 24px);
    overflow: hidden;
    flex-direction: column;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #c7ccd3);
    border-radius: var(--c-border-radius, 3px);
    box-shadow: var(--c-dialog-shadow, 0 8px 24px rgb(20 28 38 / 24%));
  }

  .header,
  .footer {
    display: flex;
    flex: none;
    align-items: center;
    padding: 7px 10px;
    gap: 8px;
    background: var(--c-subtle-surface-color, #f7f8fa);
  }

  .header {
    min-height: 34px;
    justify-content: space-between;
    border-bottom: 1px solid var(--c-border-color, #d5d9df);
  }

  .heading {
    min-width: 0;
    font-weight: 600;
  }

  .title {
    font-size: 13px;
    line-height: 1.35;
  }

  .controls,
  .actions,
  .footer {
    display: flex;
    align-items: center;
  }

  .controls {
    flex: none;
    margin-inline-start: auto;
    gap: 6px;
  }

  .actions,
  .footer {
    gap: 6px;
  }

  .close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 22px;
    padding: 0;
    color: var(--c-muted-text-color, #626a75);
    font: inherit;
    font-size: 17px;
    line-height: 1;
    cursor: pointer;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #cfd4da);
    border-radius: var(--c-border-radius, 3px);

    &:hover {
      color: var(--c-text-color, #20242a);
      background: var(--c-hover-color, #edf3fa);
    }

    &:focus-visible {
      outline: 2px solid var(--c-focus-color, #3578c6);
      outline-offset: 1px;
    }
  }

  .body {
    min-height: 0;
    padding: var(--c-dialog-padding, 12px);
    overflow: auto;
  }

  .footer {
    justify-content: flex-end;
    border-top: 1px solid var(--c-border-color, #d5d9df);
  }

  &.is-full-screen {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;

    .surface {
      width: 100%;
      height: 100%;
      max-height: 100vh;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .body {
      flex: 1 1 auto;
    }
  }

  &.allows-overflow {
    .surface,
    .body {
      overflow: visible;
    }
  }
}

@media (prefers-reduced-motion: no-preference) {
  .c-dialog[open] .surface {
    animation: c-dialog-enter 120ms ease-out;
  }
}

@keyframes c-dialog-enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
