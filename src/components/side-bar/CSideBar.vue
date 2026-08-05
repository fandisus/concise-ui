<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import CButton from '../button/CButton.vue'
import type { CSideBarPlacement } from './types'

const props = withDefaults(
  defineProps<{
    tag?: string
    placement?: CSideBarPlacement
    width?: string
    collapseButton?: boolean
    collapsed?: boolean
    collapsedWidth?: string
    ariaLabel?: string
  }>(),
  {
    tag: 'aside',
    placement: 'start',
    width: 'var(--c-side-bar-width, 240px)',
    collapseButton: false,
    collapsed: undefined,
    collapsedWidth: '38px',
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
}>()

const internalCollapsed = ref(false)
const isCollapsed = computed(() => props.collapsed ?? internalCollapsed.value)

const sideBarStyle = computed(() => ({
  '--c-side-bar-current-width': isCollapsed.value ? props.collapsedWidth : props.width,
}))

watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed !== undefined) internalCollapsed.value = collapsed
  },
)

function toggleCollapsed() {
  const collapsed = !isCollapsed.value
  internalCollapsed.value = collapsed
  emit('update:collapsed', collapsed)
}
</script>

<template>
  <component
    :is="tag"
    class="c-side-bar"
    :class="[`is-${placement}`, { 'is-collapsed': isCollapsed }]"
    :style="sideBarStyle"
    :aria-label="ariaLabel"
  >
    <div v-if="$slots.header || collapseButton" class="header">
      <CButton
        v-if="collapseButton"
        class="toggle"
        icon="☰"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapsed"
      />

      <div v-show="!isCollapsed && $slots.header" class="header-content">
        <slot name="header" />
      </div>
    </div>

    <div v-show="!isCollapsed" class="content">
      <slot />
    </div>

    <div v-if="$slots.footer" v-show="!isCollapsed" class="footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<style scoped lang="scss">
.c-side-bar {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 var(--c-side-bar-current-width);
  flex-direction: column;
  width: var(--c-side-bar-current-width);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  color: var(--c-text-color, #20242a);
  font-family: var(--c-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: var(--c-font-size, 13px);
  background: var(--c-surface-color, #fff);
  transition:
    width var(--c-side-bar-transition-duration, 160ms) ease,
    flex-basis var(--c-side-bar-transition-duration, 160ms) ease;

  &.is-start {
    border-inline-end: 1px solid var(--c-border-color, #d5d9df);
  }

  &.is-end {
    border-inline-start: 1px solid var(--c-border-color, #d5d9df);
  }

  .header,
  .footer {
    box-sizing: border-box;
    display: flex;
    flex: none;
    align-items: center;
    min-height: var(--c-side-bar-section-height, 38px);
    padding: var(--c-side-bar-section-padding, 5px 8px);
    gap: var(--c-side-bar-gap, 6px);
  }

  .header {
    border-bottom: 1px solid var(--c-border-color, #d5d9df);
  }

  .header-content {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-width: 0;
  }

  .toggle {
    flex: none;
    --c-surface-color: transparent;
    --c-control-border-color: color-mix(in srgb, currentColor 35%, transparent);
    --c-hover-color: color-mix(in srgb, currentColor 10%, transparent);
    --c-active-color: color-mix(in srgb, currentColor 18%, transparent);
  }

  &.is-collapsed .header {
    justify-content: center;
    padding: 4px;
  }

  .footer {
    border-top: 1px solid var(--c-border-color, #d5d9df);
  }

  .content {
    box-sizing: border-box;
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--c-side-bar-content-padding, 4px);
    overflow: auto;
    overscroll-behavior: contain;
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-side-bar {
    transition: none;
  }
}
</style>
