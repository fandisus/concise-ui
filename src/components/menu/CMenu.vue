<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import CMenuList from './CMenuList.vue'
import type {
  CMenuEntry,
  CMenuOrientation,
  CMenuSelectEvent,
  CMenuSubmenuMode,
} from './types'

const props = withDefaults(
  defineProps<{
    items: CMenuEntry[]
    orientation?: CMenuOrientation
    submenuMode?: CMenuSubmenuMode
    ariaLabel?: string
  }>(),
  {
    orientation: 'vertical',
    submenuMode: 'auto',
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  select: [event: CMenuSelectEvent]
}>()

const expandedKeys = ref<Set<string>>(new Set())
const rootList = ref<{ $el: HTMLElement } | null>(null)

const resolvedSubmenuMode = computed<'inline' | 'flyout'>(() => {
  if (props.submenuMode !== 'auto') return props.submenuMode
  return props.orientation === 'horizontal' ? 'flyout' : 'inline'
})

function parentKey(key: string) {
  const separatorIndex = key.lastIndexOf('/')
  return separatorIndex === -1 ? '' : key.slice(0, separatorIndex)
}

function toggleItem(key: string, force?: boolean) {
  const next = new Set(expandedKeys.value)
  const shouldExpand = force ?? !next.has(key)

  if (shouldExpand) {
    if (resolvedSubmenuMode.value === 'flyout') {
      const siblingParent = parentKey(key)

      for (const expandedKey of next) {
        if (parentKey(expandedKey) === siblingParent && expandedKey !== key) {
          next.delete(expandedKey)

          for (const descendantKey of next) {
            if (descendantKey.startsWith(`${expandedKey}/`)) next.delete(descendantKey)
          }
        }
      }
    }

    next.add(key)
  } else {
    next.delete(key)

    for (const expandedKey of next) {
      if (expandedKey.startsWith(`${key}/`)) next.delete(expandedKey)
    }
  }

  expandedKeys.value = next
}

function selectItem(event: CMenuSelectEvent) {
  expandedKeys.value = new Set()
  emit('select', event)
}

function eventIsInsideMenu(event: Event) {
  const element = rootList.value?.$el
  return Boolean(element && event.composedPath().includes(element))
}

function closeFromOutside(event: Event) {
  if (
    resolvedSubmenuMode.value === 'flyout' &&
    expandedKeys.value.size > 0 &&
    !eventIsInsideMenu(event)
  ) {
    expandedKeys.value = new Set()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeFromOutside, true)
  document.addEventListener('focusin', closeFromOutside, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeFromOutside, true)
  document.removeEventListener('focusin', closeFromOutside, true)
})
</script>

<template>
  <CMenuList
    ref="rootList"
    :items="items"
    :orientation="orientation"
    :submenu-mode="resolvedSubmenuMode"
    :expanded-keys="expandedKeys"
    :aria-label="ariaLabel"
    @toggle="toggleItem"
    @select="selectItem"
  >
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
  </CMenuList>
</template>
