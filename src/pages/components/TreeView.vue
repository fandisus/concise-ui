<script setup lang="ts">
import { computed, ref } from 'vue'

import { CButton, CSeparator, CTreeView } from '@/index'
import type {
  CTreeViewExpose,
  CTreeViewSelectionChangeEvent,
  CTreeViewSelectionClickEvent,
} from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const items = [
  {
    id: 1,
    name: 'Users',
    url: '/users',
    children: [
      { id: 2, name: 'Read users', url: '/users/read' },
      { id: 3, name: 'Create users', url: '/users/create' },
      {
        id: 4,
        name: 'Administration',
        children: [
          { id: 5, name: 'Edit users', url: '/users/edit' },
          { id: 6, name: 'Delete users', url: '/users/delete' },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Reports',
    url: '/reports',
    children: [
      { id: 8, name: 'Sales report', url: '/reports/sales' },
      { id: 9, name: 'Stock report', url: '/reports/stock' },
    ],
  },
  { id: 10, name: 'README.txt', url: '/readme' },
]

const tree = ref<CTreeViewExpose | null>(null)
const selectedNames = ref<string[]>([])
const lastInteraction = ref('No selection interaction yet.')
const hierarchicalSelection = computed(() => JSON.stringify(tree.value?.getSelections() ?? [], null, 2))

function updateSelection(event: CTreeViewSelectionChangeEvent) {
  selectedNames.value = event.flatSelections.map((item) => String(item.name))
}

function noteSelection(event: CTreeViewSelectionClickEvent) {
  lastInteraction.value = `${String(event.item.name)} is now ${event.state}.`
}

function selectEditorPermissions() {
  tree.value?.setSelectionsBy('url', ['/users/read', '/users/create', '/users/edit'])
}

function clearSelections() {
  tree.value?.setSelectionsBy('id', [])
}

const basicUsage = `<script setup>
const items = [
  {
    id: 1,
    name: 'Users',
    url: '/users',
    children: [
      { id: 2, name: 'Read users', url: '/users/read' },
      { id: 3, name: 'Create users', url: '/users/create' },
    ],
  },
]
<\/script>

<template>
  <CTreeView
    :items="items"
    item-label="name"
    item-value="url"
    item-key="id"
    item-children="children"
  />
</template>`

const selectionUsage = `<CTreeView
  ref="tree"
  :items="items"
  item-label="name"
  item-value="url"
  item-key="id"
  selectable
  @selection-click="noteSelection"
  @selection-change="updateSelection"
/>

<script setup>
function selectEditorPermissions() {
  tree.value.setSelectionsBy('url', [
    '/users/read',
    '/users/create',
    '/users/edit',
  ])
}

const nested = tree.value.getSelections()
const items = tree.value.getFlatSelections()
const urls = tree.value.getFlatSelections('url')
<\/script>`

const iconUsage = `<CTreeView
  :items="items"
  expanded-icon="−"
  collapsed-icon="+"
  expanded-folder-icon="▾"
  collapsed-folder-icon="▸"
  file-icon="•"
/>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Data &amp; Feedback</p><h1>Tree View</h1></div>
      <p>
        <code>CTreeView</code> presents hierarchical data with independent expansion and optional
        three-state selection. All interface state remains separate from the supplied objects.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Tree data</h2>
      <p>
        Map existing object fields with the <code>item-*</code> properties. Branches receive folder
        icons and disclosure controls; leaf rows reserve the same disclosure space so labels stay
        aligned. Expanding a branch does not select it.
      </p>
      <div class="preview">
        <CTreeView
          :items="items"
          item-label="name"
          item-value="url"
          item-key="id"
          item-children="children"
          aria-label="Application permissions"
        />
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Three-state selection</h2>
      <p>
        Add <code>selectable</code> to show checkboxes. Checking a branch checks every descendant;
        changing a child recalculates all ancestors. A partially selected branch is indeterminate.
        <code>selection-click</code> reports only the item directly handled by the user, while
        <code>selection-change</code> also reports changes made through the exposed API.
      </p>
      <div class="selection-demo">
        <CTreeView
          ref="tree"
          :items="items"
          item-label="name"
          item-value="url"
          item-key="id"
          item-children="children"
          selectable
          aria-label="Selectable application permissions"
          @selection-click="noteSelection"
          @selection-change="updateSelection"
        />
        <div class="selection-details">
          <div class="actions">
            <CButton size="small" @click="selectEditorPermissions">Select editor permissions</CButton>
            <CButton size="small" @click="clearSelections">Clear</CButton>
          </div>
          <p><strong>Direct interaction:</strong> {{ lastInteraction }}</p>
          <p><strong>Checked items:</strong> {{ selectedNames.join(', ') || 'None' }}</p>
          <pre>{{ hierarchicalSelection }}</pre>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="selectionUsage" />
    </section>

    <section class="section">
      <h2>Programmatic selection</h2>
      <p>
        <code>setSelectionsBy(key, values)</code> uses exact <code>values.includes(item[key])</code>
        matches. A matched branch does not automatically select its children; its final checked or
        indeterminate state is derived bottom-up from the exact child matches. The method emits
        <code>selection-change</code> only when the effective selection changes and never emits
        <code>selection-click</code>.
      </p>
      <p>
        <code>getSelections()</code> returns a hierarchy containing selected paths.
        <code>getFlatSelections()</code> returns checked item objects in tree order, and passing a
        field returns that field from each checked item. Missing fields remain
        <code>undefined</code>; they are not removed.
      </p>
    </section>

    <section class="section">
      <h2>Custom icons</h2>
      <p>
        All five structural icons accept ordinary Unicode text. Emoji and text symbols require no
        icon package and can be replaced independently.
      </p>
      <div class="preview">
        <CTreeView
          :items="items"
          item-label="name"
          item-key="id"
          expanded-icon="−"
          collapsed-icon="+"
          expanded-folder-icon="▾"
          collapsed-folder-icon="▸"
          file-icon="•"
          aria-label="Custom icon tree"
        />
      </div>
      <CCodeBlock class="code-sample" :code="iconUsage" />
    </section>

    <section class="section">
      <h2>Properties, events, and methods</h2>
      <dl class="property-list">
        <div><dt><code>items</code></dt><dd>The array containing root tree items.</dd></div>
        <div><dt><code>item-label</code></dt><dd>Displayed-label field. Defaults to <code>label</code>.</dd></div>
        <div><dt><code>item-value</code></dt><dd>Value field included as <code>value</code> in <code>selection-click</code>. Defaults to <code>value</code>.</dd></div>
        <div><dt><code>item-key</code></dt><dd>Unique-key field used for internal UI state. Defaults to <code>key</code>.</dd></div>
        <div><dt><code>item-children</code></dt><dd>Child-array field. Defaults to <code>children</code>.</dd></div>
        <div><dt><code>selectable</code></dt><dd>Displays three-state selection checkboxes.</dd></div>
        <div><dt><code>*-icon</code></dt><dd>Customizes disclosure, folder, and file icons.</dd></div>
        <div><dt><code>@selection-click</code></dt><dd>Emits <code>{ item, key, value, state }</code> for a direct checkbox interaction.</dd></div>
        <div><dt><code>@selection-change</code></dt><dd>Emits <code>{ selections, flatSelections }</code> whenever effective selection changes.</dd></div>
        <div><dt><code>getSelections()</code></dt><dd>Returns selected paths in hierarchical form.</dd></div>
        <div><dt><code>getFlatSelections(key?)</code></dt><dd>Returns checked objects or one requested field from each object.</dd></div>
        <div><dt><code>setSelectionsBy(key, values)</code></dt><dd>Replaces explicit selection using exact field matches.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.selection-demo {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(260px, 1fr);
  gap: 10px;
}

.selection-details {
  min-width: 0;
  padding: 10px;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-border-color, #d5d9df);

  p {
    margin: 10px 0 0;
  }

  pre {
    max-height: 240px;
    margin: 10px 0 0;
    padding: 8px;
    overflow: auto;
    font-size: 11px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 700px) {
  .selection-demo {
    grid-template-columns: 1fr;
  }
}
</style>
