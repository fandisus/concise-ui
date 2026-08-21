<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { CButton, CCheckbox, CSeparator, CTreeView } from '@/index'
import type {
  CCheckboxModelValue,
  CTreeViewExpose,
  CTreeViewItem,
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

interface AccessMenuItem extends CTreeViewItem {
  id: string
  url: string
  label: string
  rights?: string[]
  selectedRights?: string[]
  children?: AccessMenuItem[]
}

interface AccessResult {
  url: string
  rights: string[]
}

const menuItems = reactive<AccessMenuItem[]>([
  {
    id: 'workspace',
    url: '',
    label: 'Workspace',
    children: [
      {
        id: 'projects',
        url: '',
        label: 'Projects',
        children: [
          {
            id: 'project-overview',
            url: '/demo/projects/overview',
            label: 'Project Overview',
            rights: ['view', 'create', 'edit', 'archive'],
            selectedRights: [],
          },
          {
            id: 'project-calendar',
            url: '/demo/projects/calendar',
            label: 'Project Calendar',
            rights: ['view', 'edit'],
            selectedRights: [],
          },
        ],
      },
      {
        id: 'administration',
        url: '',
        label: 'Administration',
        children: [
          {
            id: 'user-management',
            url: '/demo/admin/users',
            label: 'User Management',
            rights: ['view', 'invite', 'edit', 'disable'],
            selectedRights: [],
          },
        ],
      },
    ],
  },
])

const existingAccess = [
  { url: '/demo/projects/overview', rights: ['view', 'edit'] },
  { url: '/demo/admin/users', rights: ['view'] },
]

const accessTree = ref<CTreeViewExpose | null>(null)
const accessResult = ref<AccessResult[]>([])
let previousAccessSelectionIds = new Set<unknown>()
let loadingExistingAccess = false

function initializeSelectedRights(source: AccessMenuItem[] = menuItems) {
  source.forEach((item) => {
    if (item.rights) {
      const access = existingAccess.find((entry) => entry.url === item.url)
      item.selectedRights = [...(access?.rights ?? [])]
    }
    if (item.children) initializeSelectedRights(item.children)
  })
}

function rightsFor(item: CTreeViewItem) {
  return Array.isArray(item.rights) ? item.rights.map(String) : []
}

function selectedRightsFor(item: CTreeViewItem) {
  return Array.isArray(item.selectedRights) ? item.selectedRights.map(String) : []
}

function setSelectedRights(item: CTreeViewItem, value: CCheckboxModelValue) {
  item.selectedRights = Array.isArray(value) ? value.map(String) : []
}

function synchronizeRightsWithTreeSelection(event: CTreeViewSelectionChangeEvent) {
  const selectedIds = new Set(event.flatSelections.map((item) => item.id))

  if (loadingExistingAccess) {
    previousAccessSelectionIds = selectedIds
    return
  }

  function visit(source: AccessMenuItem[]) {
    source.forEach((item) => {
      if (item.rights) {
        const wasSelected = previousAccessSelectionIds.has(item.id)
        const isSelected = selectedIds.has(item.id)
        if (isSelected && !wasSelected) item.selectedRights = [...item.rights]
        if (!isSelected && wasSelected) item.selectedRights = []
      }
      if (item.children) visit(item.children)
    })
  }

  visit(menuItems)
  previousAccessSelectionIds = selectedIds
}

function loadExistingSelection(selectItems: () => void) {
  loadingExistingAccess = true
  try {
    selectItems()
  } finally {
    loadingExistingAccess = false
  }
  initializeSelectedRights()
}

function selectExistingAccessByUrl() {
  loadExistingSelection(() => {
    accessTree.value?.setSelectionsBy(
      'url',
      existingAccess.map((access) => access.url),
    )
  })
}

function selectExistingAccessByPredicate() {
  loadExistingSelection(() => {
    accessTree.value?.setSelectionsBy((item) =>
      existingAccess.some((access) => access.url === item.url),
    )
  })
}

function readAccessConfiguration() {
  const mapped =
    accessTree.value?.getFlatSelections((item) => ({
      url: typeof item.url === 'string' ? item.url : '',
      rights: selectedRightsFor(item),
    })) ?? []

  accessResult.value = mapped.filter((item) => item.url.length > 0)
}

initializeSelectedRights()

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

const accessRightsJavaScript = `const menuItems = reactive([
  {
    id: 'workspace',
    url: '',
    label: 'Workspace',
    children: [
      {
        id: 'projects',
        url: '',
        label: 'Projects',
        children: [
          {
            id: 'project-overview',
            url: '/demo/projects/overview',
            label: 'Project Overview',
            rights: ['view', 'create', 'edit', 'archive'],
            selectedRights: [],
          },
          {
            id: 'project-calendar',
            url: '/demo/projects/calendar',
            label: 'Project Calendar',
            rights: ['view', 'edit'],
            selectedRights: [],
          },
        ],
      },
      {
        id: 'administration',
        url: '',
        label: 'Administration',
        children: [
          {
            id: 'user-management',
            url: '/demo/admin/users',
            label: 'User Management',
            rights: ['view', 'invite', 'edit', 'disable'],
            selectedRights: [],
          },
        ],
      },
    ],
  },
])

const existingAccess = [
  { url: '/demo/projects/overview', rights: ['view', 'edit'] },
  { url: '/demo/admin/users', rights: ['view'] },
]

let previousSelectionIds = new Set()
let loadingExistingAccess = false

function synchronizeRightsWithTreeSelection(event) {
  const selectedIds = new Set(
    event.flatSelections.map((item) => item.id),
  )

  if (loadingExistingAccess) {
    previousSelectionIds = selectedIds
    return
  }

  function visit(items) {
    items.forEach((item) => {
      if (item.rights) {
        const wasSelected = previousSelectionIds.has(item.id)
        const isSelected = selectedIds.has(item.id)

        if (isSelected && !wasSelected) {
          item.selectedRights = [...item.rights]
        }
        if (!isSelected && wasSelected) {
          item.selectedRights = []
        }
      }

      if (item.children) visit(item.children)
    })
  }

  visit(menuItems)
  previousSelectionIds = selectedIds
}

function initializeSelectedRights(items) {
  items.forEach((item) => {
    if (item.rights) {
      const access = existingAccess.find((entry) => entry.url === item.url)
      item.selectedRights = [...(access?.rights ?? [])]
    }
    if (item.children) initializeSelectedRights(item.children)
  })
}

initializeSelectedRights(menuItems)

function loadExistingSelection(selectItems) {
  loadingExistingAccess = true
  try {
    selectItems()
  } finally {
    loadingExistingAccess = false
  }
  initializeSelectedRights(menuItems)
}

function selectByUrl() {
  loadExistingSelection(() => {
    accessTree.value.setSelectionsBy(
      'url',
      existingAccess.map((access) => access.url),
    )
  })
}

function selectByPredicate() {
  loadExistingSelection(() => {
    accessTree.value.setSelectionsBy((item) =>
      existingAccess.some((access) => access.url === item.url),
    )
  })
}

function readAccessConfiguration() {
  return accessTree.value
    .getFlatSelections((item) => ({
      url: item.url,
      rights: item.selectedRights,
    }))
    .filter((item) => item.url)
}`

const accessRightsMarkup = `<CTreeView
  ref="accessTree"
  :items="menuItems"
  item-label="label"
  item-value="url"
  item-key="id"
  item-children="children"
  selectable
  @selection-change="synchronizeRightsWithTreeSelection"
>
  <template #node="{ item, isLeaf }">
    <div class="access-node">
      <span>{{ item.label }}</span>
      <div v-if="isLeaf && item.rights?.length" class="access-rights">
        <CCheckbox
          v-for="right in item.rights"
          :key="right"
          v-model="item.selectedRights"
          :value="right"
        >
          {{ right }}
        </CCheckbox>
      </div>
    </div>
  </template>
</CTreeView>`
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
        field returns that field from each checked item. Passing a mapper performs a read-only
        transformation with its return type inferred. Missing fields remain <code>undefined</code>;
        they are not removed.
      </p>
    </section>

    <section class="section">
      <h2>Custom nodes and access rights</h2>
      <p>
        The <code>node</code> slot replaces only the default folder/file icon and label. TreeView
        still owns indentation, disclosure, recursive rendering, and its selection checkbox. This
        lets an application place separate controls inside a node without moving domain behavior
        into the generic tree component.
      </p>
      <p>
        This fictional menu uses the unique <code>id</code> as <code>item-key</code>. Folder URLs are
        intentionally empty and therefore unsuitable as keys. The smaller rights checkboxes edit
        each page's <code>selectedRights</code> array independently from the TreeView checkbox.
      </p>
      <div class="access-demo">
        <CTreeView
          ref="accessTree"
          :items="menuItems"
          item-label="label"
          item-value="url"
          item-key="id"
          item-children="children"
          selectable
          aria-label="Demo menu access rights"
          @selection-change="synchronizeRightsWithTreeSelection"
        >
          <template #node="{ item, isLeaf }">
            <div class="access-node">
              <span class="access-label">{{ item.label }}</span>
              <div v-if="isLeaf && rightsFor(item).length" class="access-rights">
                <CCheckbox
                  v-for="right in rightsFor(item)"
                  :key="right"
                  :model-value="selectedRightsFor(item)"
                  :value="right"
                  size="small"
                  @update:model-value="setSelectedRights(item, $event)"
                >
                  {{ right }}
                </CCheckbox>
              </div>
            </div>
          </template>
        </CTreeView>

        <div class="access-output">
          <div class="actions">
            <CButton size="small" @click="selectExistingAccessByUrl">Load by URL</CButton>
            <CButton size="small" @click="selectExistingAccessByPredicate">
              Load by predicate
            </CButton>
            <CButton size="small" @click="readAccessConfiguration">Read result</CButton>
          </div>
          <p>
            Both loading buttons select the same pages and preserve their stored rights—for example,
            Project Overview loads only <code>view</code> and <code>edit</code>. For ordinary
            selection changes, the handler checks every right when a page becomes selected and
            clears them when it becomes unselected. Rights on pages whose tree state did not change
            remain available for individual adjustment.
          </p>
          <pre>{{ JSON.stringify(accessResult, null, 2) }}</pre>
        </div>
      </div>
      <CCodeBlock
        class="code-sample"
        :code="accessRightsJavaScript"
        language="javascript"
      />
      <CCodeBlock class="code-sample" :code="accessRightsMarkup" />
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
        <div><dt><code>#node</code></dt><dd>Replaces the default node icon and label. Receives <code>{ item, depth, isLeaf, expanded, selected, indeterminate }</code>.</dd></div>
        <div><dt><code>@selection-click</code></dt><dd>Emits <code>{ item, key, value, state }</code> for a direct checkbox interaction.</dd></div>
        <div><dt><code>@selection-change</code></dt><dd>Emits <code>{ selections, flatSelections }</code> whenever effective selection changes.</dd></div>
        <div><dt><code>getSelections()</code></dt><dd>Returns selected paths in hierarchical form.</dd></div>
        <div><dt><code>getFlatSelections(transform?)</code></dt><dd>Returns checked objects, a requested field, or the result of a mapper for every checked object.</dd></div>
        <div><dt><code>setSelectionsBy(key, values)</code></dt><dd>Replaces explicit selection using exact field matches.</dd></div>
        <div><dt><code>setSelectionsBy(predicate)</code></dt><dd>Replaces explicit selection with items for which the predicate returns true.</dd></div>
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

.access-demo {
  display: grid;
  grid-template-columns: minmax(330px, 1.2fr) minmax(260px, 0.8fr);
  align-items: start;
  gap: 10px;
}

.access-node {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 3px 0;
  gap: 4px;
}

.access-label {
  overflow-wrap: anywhere;
}

.access-rights {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  color: var(--c-muted-text-color, #626a75);
}

.access-output {
  min-width: 0;
  padding: 10px;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-border-color, #d5d9df);

  p {
    margin: 10px 0;
    color: var(--c-muted-text-color, #626a75);
    line-height: 1.45;
  }

  pre {
    min-height: 120px;
    margin: 0;
    padding: 8px;
    overflow: auto;
    font-size: 11px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }
}

@media (max-width: 700px) {
  .selection-demo,
  .access-demo {
    grid-template-columns: 1fr;
  }
}
</style>
