<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    accentColor?: string
    topAccentColor?: string
    collapsible?: boolean
  }>(),
  {
    title: undefined,
    accentColor: undefined,
    topAccentColor: undefined,
    collapsible: false,
  },
)

const collapsed = defineModel<boolean>('collapsed', { default: false })

defineSlots<{
  default(): unknown
  header?(): unknown
  actions?(): unknown
}>()

const slots = useSlots()
const uid = useId()
const titleId = `c-panel-title-${uid}`
const bodyId = `c-panel-body-${uid}`
const hasHeading = computed(() => Boolean(props.title || slots.header))
const hasHeader = computed(() => hasHeading.value || Boolean(slots.actions) || props.collapsible)
const isCollapsed = computed(() => props.collapsible && collapsed.value)
const accentStyle = computed(() => ({
  '--c-panel-accent-color': props.accentColor,
  '--c-panel-top-accent-color': props.topAccentColor,
}))

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <section
    class="c-panel"
    :class="{
      'has-accent': accentColor,
      'has-top-accent': topAccentColor,
      'is-collapsed': isCollapsed,
    }"
    :style="accentStyle"
    :aria-labelledby="hasHeading ? titleId : undefined"
  >
    <header v-if="hasHeader" class="header">
      <div v-if="hasHeading" :id="titleId" class="heading">
        <slot name="header">
          <div class="title">{{ title }}</div>
        </slot>
      </div>

      <div v-if="$slots.actions || collapsible" class="controls">
        <div v-if="$slots.actions" class="actions">
          <slot name="actions" />
        </div>

        <button
          v-if="collapsible"
          type="button"
          class="collapse-button"
          :aria-expanded="!isCollapsed"
          :aria-controls="bodyId"
          :aria-label="`${isCollapsed ? 'Expand' : 'Collapse'} ${title || 'panel'}`"
          @click="toggleCollapsed"
        >
          <span class="chevron" :class="{ 'is-collapsed': isCollapsed }" aria-hidden="true" />
        </button>
      </div>
    </header>

    <div v-show="!isCollapsed" :id="bodyId" class="body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.c-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  color: var(--c-text-color, #20242a);
  font-family: var(--c-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: var(--c-font-size, 13px);
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-border-color, #d5d9df);
  border-radius: var(--c-border-radius, 3px);

  &.has-accent {
    border-inline-start-color: var(--c-panel-accent-color);
    border-inline-start-width: var(--c-panel-accent-width, 5px);
  }

  &.has-top-accent {
    border-top-color: var(--c-panel-top-accent-color);
    border-top-width: var(--c-panel-top-accent-width, 5px);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
    padding: 5px 9px;
    gap: 10px;
    background: var(--c-subtle-surface-color, #f7f8fa);
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

  .actions {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .controls {
    display: flex;
    flex: none;
    align-items: center;
    margin-inline-start: auto;
    gap: 6px;
  }

  .collapse-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 22px;
    padding: 0;
    color: var(--c-muted-text-color, #626a75);
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

  .chevron {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid currentcolor;
    border-bottom: 1.5px solid currentcolor;
    transform: translateY(-2px) rotate(45deg);

    &.is-collapsed {
      transform: translateX(-2px) rotate(-45deg);
    }
  }

  .body {
    flex: 1 1 auto;
    min-width: 0;
    padding: var(--c-panel-padding, 10px);
  }

  &.is-collapsed .header {
    border-bottom: 0;
  }
}
</style>
