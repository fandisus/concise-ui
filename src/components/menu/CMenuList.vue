<script setup lang="ts">
import { computed, nextTick } from 'vue'

import CSeparator from '../separator/CSeparator.vue'
import CIcon from '../icon/CIcon.vue'
import type {
  CMenuActionItem,
  CMenuEntry,
  CMenuOrientation,
  CMenuSelectEvent,
} from './types'

interface CMenuItemSlotProps {
  item: CMenuActionItem
  depth: number
  expanded: boolean
}

const props = withDefaults(
  defineProps<{
    items: CMenuEntry[]
    orientation: CMenuOrientation
    submenuMode: 'inline' | 'flyout'
    expandedKeys: Set<string>
    level?: number
    path?: string
    parentItemKey?: string
    ariaLabel?: string
  }>(),
  {
    level: 0,
    path: '',
    parentItemKey: undefined,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  toggle: [key: string, force?: boolean]
  select: [event: CMenuSelectEvent]
}>()

defineSlots<{
  item(props: CMenuItemSlotProps): unknown
}>()

const visibleItems = computed(() => props.items.filter((item) => !item.hidden))
const currentOrientation = computed<CMenuOrientation>(() =>
  props.level === 0 ? props.orientation : 'vertical',
)
const isRoot = computed(() => props.level === 0)

function itemKey(item: CMenuEntry, index: number) {
  const segment = item.id ? `id:${encodeURIComponent(item.id)}` : `index:${index}`
  return props.path ? `${props.path}/${segment}` : segment
}

function isActionItem(item: CMenuEntry): item is CMenuActionItem {
  return item.type !== 'separator'
}

function hasChildren(item: CMenuActionItem) {
  return Boolean(item.children?.some((child) => !child.hidden))
}

function isFirstFocusable(index: number) {
  return visibleItems.value.findIndex((item) => isActionItem(item) && !item.disabled) === index
}

function activateItem(event: MouseEvent, item: CMenuActionItem, key: string) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (hasChildren(item)) {
    event.preventDefault()
    emit('toggle', key)
    return
  }

  const context = { item, originalEvent: event }
  item.command?.(context)
  emit('select', context)
}

function directTriggers(menu: HTMLElement) {
  return Array.from(menu.children)
    .map((child) => child.querySelector<HTMLElement>(':scope > [data-c-menu-trigger]'))
    .filter((trigger): trigger is HTMLElement => Boolean(trigger && trigger.getAttribute('aria-disabled') !== 'true'))
}

function focusRelative(menu: HTMLElement, target: HTMLElement, offset: number) {
  const triggers = directTriggers(menu)
  if (triggers.length === 0) return

  const currentIndex = triggers.indexOf(target)
  const nextIndex = (Math.max(currentIndex, 0) + offset + triggers.length) % triggers.length
  triggers[nextIndex]?.focus()
}

async function openAndFocusSubmenu(target: HTMLElement, key: string) {
  emit('toggle', key, true)
  await nextTick()

  const entry = target.closest('[data-c-menu-item]')
  const submenu = entry?.querySelector<HTMLElement>(':scope > [data-c-menu-submenu]')
  if (submenu) directTriggers(submenu)[0]?.focus()
}

function onKeydown(event: KeyboardEvent) {
  const menu = event.currentTarget as HTMLElement
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-c-menu-trigger]')
  if (!target || target.parentElement?.parentElement !== menu) return

  const entry = target.closest<HTMLElement>('[data-c-menu-item]')
  const key = entry?.dataset.itemKey
  const ownsSubmenu = target.getAttribute('aria-haspopup') === 'menu'
  const horizontal = currentOrientation.value === 'horizontal'

  if ((horizontal && event.key === 'ArrowRight') || (!horizontal && event.key === 'ArrowDown')) {
    event.preventDefault()
    focusRelative(menu, target, 1)
  } else if ((horizontal && event.key === 'ArrowLeft') || (!horizontal && event.key === 'ArrowUp')) {
    event.preventDefault()
    focusRelative(menu, target, -1)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    const triggers = directTriggers(menu)
    const nextTarget = event.key === 'Home' ? triggers[0] : triggers.at(-1)
    nextTarget?.focus()
  } else if (
    key &&
    ownsSubmenu &&
    ((horizontal && event.key === 'ArrowDown') ||
      (!horizontal && props.submenuMode === 'flyout' && event.key === 'ArrowRight'))
  ) {
    event.preventDefault()
    void openAndFocusSubmenu(target, key)
  } else if (
    key &&
    ownsSubmenu &&
    !horizontal &&
    props.submenuMode === 'inline' &&
    event.key === 'ArrowRight'
  ) {
    event.preventDefault()
    emit('toggle', key, true)
  } else if (event.key === 'ArrowLeft' && !isRoot.value && props.parentItemKey) {
    event.preventDefault()
    const parentEntry = menu.parentElement?.closest<HTMLElement>('[data-c-menu-item]')
    parentEntry?.querySelector<HTMLElement>(':scope > [data-c-menu-trigger]')?.focus()
    emit('toggle', props.parentItemKey, false)
  } else if (event.key === 'Escape' && !isRoot.value && props.parentItemKey) {
    event.preventDefault()
    const parentEntry = menu.parentElement?.closest<HTMLElement>('[data-c-menu-item]')
    parentEntry?.querySelector<HTMLElement>(':scope > [data-c-menu-trigger]')?.focus()
    emit('toggle', props.parentItemKey, false)
  } else if (event.key === ' ' && target.tagName === 'A') {
    event.preventDefault()
    target.click()
  }
}
</script>

<template>
  <ul
    class="c-menu"
    :class="[
      `is-${currentOrientation}`,
      `is-${submenuMode}`,
      { 'is-root': isRoot, submenu: !isRoot },
    ]"
    data-c-menu-list
    :data-c-menu-submenu="isRoot ? undefined : ''"
    :role="isRoot && orientation === 'horizontal' ? 'menubar' : 'menu'"
    :aria-label="isRoot ? ariaLabel : undefined"
    :aria-orientation="currentOrientation"
    @keydown.stop="onKeydown"
  >
    <template v-for="(item, index) in visibleItems" :key="itemKey(item, index)">
      <li v-if="item.type === 'separator'" class="separator" role="none">
        <CSeparator
          :orientation="isRoot && orientation === 'horizontal' ? 'vertical' : 'horizontal'"
        />
      </li>

      <li
        v-else
        class="item"
        :class="{
          'is-expanded': expandedKeys.has(itemKey(item, index)),
          'is-disabled': item.disabled,
          'is-active': item.active,
          'has-children': hasChildren(item),
        }"
        role="none"
        data-c-menu-item
        :data-item-key="itemKey(item, index)"
      >
        <component
          :is="item.url ? 'a' : 'button'"
          class="trigger"
          data-c-menu-trigger
          :href="item.url"
          :target="item.target"
          :type="item.url ? undefined : 'button'"
          role="menuitem"
          :tabindex="item.disabled || !isFirstFocusable(index) ? -1 : 0"
          :aria-disabled="item.disabled ? 'true' : undefined"
          :aria-current="item.active ? 'page' : undefined"
          :aria-haspopup="hasChildren(item) ? 'menu' : undefined"
          :aria-expanded="hasChildren(item) ? expandedKeys.has(itemKey(item, index)) : undefined"
          @click="activateItem($event, item, itemKey(item, index))"
        >
          <slot
            name="item"
            :item="item"
            :depth="level"
            :expanded="expandedKeys.has(itemKey(item, index))"
          >
            <CIcon v-if="item.icon" class="icon">{{ item.icon }}</CIcon>
            <span class="label">{{ item.label }}</span>
            <span v-if="hasChildren(item)" class="indicator" aria-hidden="true">
              {{
                submenuMode === 'inline'
                  ? expandedKeys.has(itemKey(item, index))
                    ? '−'
                    : '+'
                  : isRoot && orientation === 'horizontal'
                    ? '▾'
                    : '›'
              }}
            </span>
          </slot>
        </component>

        <CMenuList
          v-if="hasChildren(item) && expandedKeys.has(itemKey(item, index))"
          :items="item.children ?? []"
          :orientation="orientation"
          :submenu-mode="submenuMode"
          :expanded-keys="expandedKeys"
          :level="level + 1"
          :path="itemKey(item, index)"
          :parent-item-key="itemKey(item, index)"
          @toggle="(key, force) => emit('toggle', key, force)"
          @select="emit('select', $event)"
        >
          <template v-if="$slots.item" #item="slotProps">
            <slot name="item" v-bind="slotProps" />
          </template>
        </CMenuList>
      </li>
    </template>
  </ul>
</template>

<style scoped lang="scss">
.c-menu {
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--c-text-color, #20242a);
  font-family: var(--c-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: var(--c-font-size, 13px);

  &.is-horizontal {
    flex-direction: row;
    align-items: stretch;
  }

  &.is-vertical {
    flex-direction: column;
    width: 100%;
  }

  .item {
    position: relative;
    min-width: 0;

    &.is-active > .trigger {
      color: var(--c-selection-text-color, #173f70);
      background: var(--c-selection-color, #dceafa);
    }

    &.is-disabled > .trigger {
      color: var(--c-disabled-text-color, #8a9099);
      pointer-events: none;
      cursor: default;
    }
  }

  .trigger {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    width: 100%;
    min-height: var(--c-control-height, 30px);
    margin: 0;
    padding: 4px 8px;
    gap: 6px;
    overflow: hidden;
    color: inherit;
    font: inherit;
    line-height: 1.2;
    text-align: start;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--c-border-radius, 3px);

    &:hover {
      background: var(--c-hover-color, #eef1f5);
    }

    &:focus-visible {
      position: relative;
      z-index: 1;
      outline: 2px solid var(--c-focus-color, #3578c6);
      outline-offset: -2px;
    }
  }

  .icon,
  .indicator {
    flex: none;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .indicator {
    min-width: 1em;
    color: var(--c-muted-text-color, #626a75);
    text-align: center;
  }

  .separator {
    display: flex;
    align-items: stretch;
    padding: 3px 6px;
  }

  &.is-horizontal > .separator {
    padding: 5px 3px;
  }

  &.submenu {
    z-index: var(--c-menu-z-index, 1000);
  }

  &.is-flyout.submenu {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: var(--c-menu-min-width, 180px);
    padding: 3px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
    border-radius: var(--c-border-radius, 3px);
    box-shadow: var(--c-menu-shadow, 0 3px 10px rgb(20 28 38 / 14%));
  }

  &.is-horizontal.is-root > .item > .submenu {
    top: 100%;
    left: 0;
  }

  &.is-inline.submenu {
    position: static;
    padding-inline-start: 14px;
  }
}
</style>
