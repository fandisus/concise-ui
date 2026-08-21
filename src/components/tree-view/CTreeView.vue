<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import CTreeViewNode from './CTreeViewNode.vue'
import type { CTreeViewResolvedNode, CTreeViewSelectionMap } from './internal'
import type {
  CTreeViewItem,
  CTreeViewNodeSlotProps,
  CTreeViewSelectionChangeEvent,
  CTreeViewSelectionClickEvent,
  CTreeViewSelectionMapper,
  CTreeViewSelectionPredicate,
  CTreeViewSelectionState,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    items?: CTreeViewItem[]
    itemLabel?: string
    itemValue?: string
    itemKey?: string
    itemChildren?: string
    selectable?: boolean
    expandAllButton?: boolean
    collapseAllButton?: boolean
    expandedIcon?: string
    collapsedIcon?: string
    expandedFolderIcon?: string
    collapsedFolderIcon?: string
    fileIcon?: string
  }>(),
  {
    items: () => [],
    itemLabel: 'label',
    itemValue: 'value',
    itemKey: 'key',
    itemChildren: 'children',
    selectable: false,
    expandAllButton: false,
    collapseAllButton: false,
    expandedIcon: '▼',
    collapsedIcon: '▶',
    expandedFolderIcon: '📂',
    collapsedFolderIcon: '📁',
    fileIcon: '📄',
  },
)

const emit = defineEmits<{
  'selection-click': [event: CTreeViewSelectionClickEvent]
  'selection-change': [event: CTreeViewSelectionChangeEvent]
}>()

defineSlots<{
  node?(props: CTreeViewNodeSlotProps): unknown
}>()

const expandedKeys = ref<Set<unknown>>(new Set())
const explicitSelectionKeys = ref<Set<unknown>>(new Set())
const selectionStates = ref<CTreeViewSelectionMap>(new Map())
let itemsInitialized = false

function renderKey(key: unknown, path: number[]): PropertyKey {
  return typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol'
    ? key
    : path.join('.')
}

function resolveItems(items: CTreeViewItem[], parentPath: number[] = []): CTreeViewResolvedNode[] {
  return items.map((item, index) => {
    const path = [...parentPath, index]
    const key = item[props.itemKey]
    const childrenValue = item[props.itemChildren]
    const children = Array.isArray(childrenValue) ? (childrenValue as CTreeViewItem[]) : []
    const labelValue = item[props.itemLabel]

    return {
      item,
      key,
      renderKey: renderKey(key, path),
      label: labelValue == null ? '' : String(labelValue),
      value: item[props.itemValue],
      children: resolveItems(children, path),
    }
  })
}

const nodes = computed(() => resolveItems(props.items))

function flattenNodes(source: CTreeViewResolvedNode[]): CTreeViewResolvedNode[] {
  return source.flatMap((node) => [node, ...flattenNodes(node.children)])
}

function calculateSelectionStates(
  source: CTreeViewResolvedNode[],
  explicitKeys: Set<unknown>,
): CTreeViewSelectionMap {
  const states: CTreeViewSelectionMap = new Map()

  function visit(node: CTreeViewResolvedNode): CTreeViewSelectionState {
    if (node.children.length === 0) {
      const state = explicitKeys.has(node.key) ? 'checked' : 'unchecked'
      states.set(node.key, state)
      return state
    }

    const childStates = node.children.map(visit)
    const allChecked = childStates.every((state) => state === 'checked')
    const allUnchecked = childStates.every((state) => state === 'unchecked')
    const state = allChecked ? 'checked' : allUnchecked ? 'unchecked' : 'indeterminate'
    states.set(node.key, state)
    return state
  }

  source.forEach(visit)
  return states
}

function effectiveSelectionChanged(
  previous: CTreeViewSelectionMap,
  next: CTreeViewSelectionMap,
) {
  const previousSelected = [...previous].filter(([, state]) => state !== 'unchecked')
  const nextSelected = [...next].filter(([, state]) => state !== 'unchecked')

  return (
    previousSelected.length !== nextSelected.length ||
    previousSelected.some(([key, state]) => next.get(key) !== state)
  )
}

function buildHierarchicalSelections(source: CTreeViewResolvedNode[]): CTreeViewItem[] {
  return source.flatMap((node) => {
    const children = buildHierarchicalSelections(node.children)
    const state = selectionStates.value.get(node.key) ?? 'unchecked'
    if (state !== 'checked' && children.length === 0) return []

    const selectedItem = { ...node.item }
    if (node.children.length > 0) selectedItem[props.itemChildren] = children
    return [selectedItem]
  })
}

function getSelections() {
  return buildHierarchicalSelections(nodes.value)
}

function getFlatSelections(): CTreeViewItem[]
function getFlatSelections(key: string): unknown[]
function getFlatSelections<TResult>(mapper: CTreeViewSelectionMapper<TResult>): TResult[]
function getFlatSelections<TResult>(
  transform?: string | CTreeViewSelectionMapper<TResult>,
): CTreeViewItem[] | unknown[] | TResult[] {
  const selectedItems = flattenNodes(nodes.value)
    .filter((node) => selectionStates.value.get(node.key) === 'checked')
    .map((node) => node.item)

  if (typeof transform === 'function') return selectedItems.map(transform)
  if (typeof transform === 'string') return selectedItems.map((item) => item[transform])
  return selectedItems
}

function emitSelectionChange() {
  emit('selection-change', {
    selections: getSelections(),
    flatSelections: getFlatSelections(),
  })
}

function applySelection(nextExplicitKeys: Set<unknown>, notify = true) {
  const nextStates = calculateSelectionStates(nodes.value, nextExplicitKeys)
  const changed = effectiveSelectionChanged(selectionStates.value, nextStates)
  explicitSelectionKeys.value = nextExplicitKeys
  selectionStates.value = nextStates
  if (changed && notify) emitSelectionChange()
  return changed
}

function toggleExpanded(key: unknown) {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}

function expandAll() {
  expandedKeys.value = new Set(
    flattenNodes(nodes.value)
      .filter((node) => node.children.length > 0)
      .map((node) => node.key),
  )
}

function collapseAll() {
  expandedKeys.value = new Set()
}

function setSubtreeSelection(node: CTreeViewResolvedNode, selected: boolean, keys: Set<unknown>) {
  if (selected) keys.add(node.key)
  else keys.delete(node.key)
  node.children.forEach((child) => setSubtreeSelection(child, selected, keys))
}

function selectNode(node: CTreeViewResolvedNode) {
  const currentState = selectionStates.value.get(node.key) ?? 'unchecked'
  const selected = currentState !== 'checked'
  const next = new Set(explicitSelectionKeys.value)
  setSubtreeSelection(node, selected, next)
  const changed = applySelection(next, false)

  emit('selection-click', {
    item: node.item,
    key: node.key,
    value: node.value,
    state: selectionStates.value.get(node.key) ?? 'unchecked',
  })
  if (changed) emitSelectionChange()
}

function setSelectionsBy(key: string, values: unknown[]): void
function setSelectionsBy(predicate: CTreeViewSelectionPredicate): void
function setSelectionsBy(
  keyOrPredicate: string | CTreeViewSelectionPredicate,
  values: unknown[] = [],
) {
  const next = new Set<unknown>()
  flattenNodes(nodes.value).forEach((node) => {
    const selected =
      typeof keyOrPredicate === 'function'
        ? Boolean(keyOrPredicate(node.item))
        : values.includes(node.item[keyOrPredicate])
    if (selected) next.add(node.key)
  })
  applySelection(next)
}

watch(
  nodes,
  (nextNodes) => {
    const availableKeys = new Set(flattenNodes(nextNodes).map((node) => node.key))
    const nextExplicit = new Set(
      [...explicitSelectionKeys.value].filter((key) => availableKeys.has(key)),
    )
    expandedKeys.value = new Set([...expandedKeys.value].filter((key) => availableKeys.has(key)))
    applySelection(nextExplicit, itemsInitialized)
    itemsInitialized = true
  },
  { immediate: true },
)

defineExpose({ getSelections, getFlatSelections, setSelectionsBy })
</script>

<template>
  <div
    class="c-tree-view-container"
    :class="{ 'has-controls': expandAllButton || collapseAllButton }"
  >
    <div
      v-if="expandAllButton || collapseAllButton"
      class="c-tree-view-controls"
      role="toolbar"
      aria-label="Tree expansion controls"
    >
      <button v-if="expandAllButton" class="control" type="button" @click="expandAll">
        Expand all
      </button>
      <button v-if="collapseAllButton" class="control" type="button" @click="collapseAll">
        Collapse all
      </button>
    </div>
    <ul
      v-bind="$attrs"
      class="c-tree-view"
      role="tree"
      :aria-multiselectable="selectable || undefined"
    >
      <CTreeViewNode
        v-for="node in nodes"
        :key="node.renderKey"
        :node="node"
        :depth="0"
        :expanded-keys="expandedKeys"
        :selection-states="selectionStates"
        :selectable="selectable"
        :expanded-icon="expandedIcon"
        :collapsed-icon="collapsedIcon"
        :expanded-folder-icon="expandedFolderIcon"
        :collapsed-folder-icon="collapsedFolderIcon"
        :file-icon="fileIcon"
        @toggle="toggleExpanded"
        @select="selectNode"
      >
        <template v-if="$slots.node" #node="slotProps">
          <slot name="node" v-bind="slotProps" />
        </template>
      </CTreeViewNode>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.c-tree-view-container {
  display: contents;

  &.has-controls {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
}

.c-tree-view-controls {
  display: flex;
  align-items: center;
  padding: 4px;
  gap: 4px;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-border-color, #d5d9df);
  border-bottom: 0;
  border-radius: var(--c-border-radius, 3px) var(--c-border-radius, 3px) 0 0;

  .control {
    min-height: 24px;
    padding: 2px 8px;
    color: var(--c-text-color, #20242a);
    font: inherit;
    cursor: pointer;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-control-border-color, #bfc5ce);
    border-radius: var(--c-border-radius, 3px);

    &:hover {
      background: var(--c-hover-color, #eef1f5);
      border-color: var(--c-control-hover-border-color, #929aa6);
    }

    &:active {
      background: var(--c-active-color, #e1e5ea);
    }

    &:focus-visible {
      outline: 2px solid var(--c-focus-color, #3578c6);
      outline-offset: 1px;
    }
  }

  + .c-tree-view {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
}

.c-tree-view {
  box-sizing: border-box;
  min-width: 0;
  margin: 0;
  padding: var(--c-tree-view-padding, 4px);
  color: var(--c-text-color, #20242a);
  font: inherit;
  line-height: 1.35;
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-border-color, #d5d9df);
  border-radius: var(--c-border-radius, 3px);
}
</style>
