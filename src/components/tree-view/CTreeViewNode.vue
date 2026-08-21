<script setup lang="ts">
import { computed } from 'vue'

import CCheckbox from '../checkbox/CCheckbox.vue'
import CIcon from '../icon/CIcon.vue'
import type { CTreeViewResolvedNode, CTreeViewSelectionMap } from './internal'
import type { CTreeViewNodeSlotProps } from './types'

const props = defineProps<{
  node: CTreeViewResolvedNode
  depth: number
  expandedKeys: Set<unknown>
  selectionStates: CTreeViewSelectionMap
  selectable: boolean
  expandedIcon: string
  collapsedIcon: string
  expandedFolderIcon: string
  collapsedFolderIcon: string
  fileIcon: string
}>()

const emit = defineEmits<{
  toggle: [key: unknown]
  select: [node: CTreeViewResolvedNode]
}>()

defineSlots<{
  node?(props: CTreeViewNodeSlotProps): unknown
}>()

const hasChildren = computed(() => props.node.children.length > 0)
const expanded = computed(() => hasChildren.value && props.expandedKeys.has(props.node.key))
const selectionState = computed(() => props.selectionStates.get(props.node.key) ?? 'unchecked')
const checked = computed(() => selectionState.value === 'checked')
const indeterminate = computed(() => selectionState.value === 'indeterminate')
</script>

<template>
  <li
    class="node"
    role="treeitem"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-checked="selectable ? (indeterminate ? 'mixed' : checked) : undefined"
  >
    <div class="row">
      <button
        v-if="hasChildren"
        class="disclosure"
        type="button"
        :aria-label="`${expanded ? 'Collapse' : 'Expand'} ${node.label}`"
        :aria-expanded="expanded"
        @click="emit('toggle', node.key)"
      >
        <CIcon>{{ expanded ? expandedIcon : collapsedIcon }}</CIcon>
      </button>
      <span v-else class="disclosure-spacer" aria-hidden="true" />

      <CCheckbox
        v-if="selectable"
        :model-value="checked"
        :indeterminate="indeterminate"
        :aria-label="`Select ${node.label}`"
        @update:model-value="emit('select', node)"
      />

      <div class="content">
        <slot
          name="node"
          :item="node.item"
          :depth="depth"
          :is-leaf="!hasChildren"
          :expanded="expanded"
          :selected="checked"
          :indeterminate="indeterminate"
        >
          <CIcon class="node-icon" aria-hidden="true">{{
            hasChildren ? (expanded ? expandedFolderIcon : collapsedFolderIcon) : fileIcon
          }}</CIcon>
          <span class="label">{{ node.label }}</span>
        </slot>
      </div>
    </div>

    <ul v-if="expanded" class="children" role="group">
      <CTreeViewNode
        v-for="child in node.children"
        :key="child.renderKey"
        :node="child"
        :depth="depth + 1"
        :expanded-keys="expandedKeys"
        :selection-states="selectionStates"
        :selectable="selectable"
        :expanded-icon="expandedIcon"
        :collapsed-icon="collapsedIcon"
        :expanded-folder-icon="expandedFolderIcon"
        :collapsed-folder-icon="collapsedFolderIcon"
        :file-icon="fileIcon"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      >
        <template v-if="$slots.node" #node="slotProps">
          <slot name="node" v-bind="slotProps" />
        </template>
      </CTreeViewNode>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.node {
  margin: 0;
  padding: 0;
  list-style: none;

  .row {
    display: flex;
    align-items: center;
    min-height: var(--c-tree-view-row-height, 28px);
    padding: 1px 5px;
    gap: 5px;
    border-radius: var(--c-border-radius, 3px);

    &:hover {
      background: var(--c-hover-color, #eef1f5);
    }
  }

  .disclosure,
  .disclosure-spacer {
    box-sizing: border-box;
    display: inline-flex;
    flex: 0 0 var(--c-tree-view-disclosure-size, 18px);
    align-items: center;
    justify-content: center;
    width: var(--c-tree-view-disclosure-size, 18px);
    height: var(--c-tree-view-disclosure-size, 18px);
  }

  .disclosure {
    padding: 0;
    color: var(--c-muted-text-color, #626a75);
    font: inherit;
    font-size: 10px;
    line-height: 1;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: var(--c-border-radius, 3px);

    &:hover {
      color: var(--c-text-color, #20242a);
      background: var(--c-active-color, #e1e5ea);
    }

    &:focus-visible {
      outline: 2px solid var(--c-focus-color, #3578c6);
      outline-offset: 1px;
    }
  }

  .content {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    gap: 5px;

    .node-icon {
      flex: none;
    }

    .label {
      min-width: 0;
      overflow-wrap: anywhere;
    }
  }

  .children {
    margin: 0;
    padding: 0 0 0 var(--c-tree-view-indent, 20px);
  }
}
</style>
