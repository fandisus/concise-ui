<script setup lang="ts">
import { ref } from 'vue'

import { CContextMenu, CSeparator, CToast } from '@/index'
import type {
  CContextMenuCloseEvent,
  CContextMenuOpenEvent,
  CMenuEntry,
  CToastItem,
} from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const selectedAction = ref('None')
const selectedFileName = ref<string | null>(null)
const menuState = ref('Closed')
const toasts = ref<CToastItem[]>([])
const contextMenu = ref<InstanceType<typeof CContextMenu> | null>(null)

const fileMenu: CMenuEntry[] = [
  { label: 'Open', icon: '📂', command: () => openFile(selectedFileName.value) },
  {
    label: 'Open with',
    icon: '▹',
    children: [
      {
        label: 'Text editor',
        icon: '✎',
        command: () => openInEditor(selectedFileName.value),
      },
      {
        label: 'Spreadsheet',
        icon: '▦',
        command: () => openInSpreadsheet(selectedFileName.value),
      },
    ],
  },
  { type: 'separator' },
  { label: 'Rename', icon: '✎', command: () => renameFile(selectedFileName.value) },
  { label: 'Copy', icon: '⧉', command: () => copyFile(selectedFileName.value) },
  { label: 'Delete', icon: '🗑️', command: () => deleteFile(selectedFileName.value) },
  { type: 'separator' },
  { label: 'Restore previous version', icon: '↶', disabled: true },
]

const files = [
  { name: 'Quarterly report.xlsx', type: 'Spreadsheet', size: '842 KB' },
  { name: 'Warehouse notes.txt', type: 'Text document', size: '18 KB' },
  { name: 'Product catalog.pdf', type: 'PDF document', size: '4.2 MB' },
]

type FileEntry = (typeof files)[number]

function showContextMenu(event: MouseEvent, file: FileEntry) {
  selectedFileName.value = file.name
  contextMenu.value?.open(event)
}

function showContextMenuFromKeyboard(event: KeyboardEvent, file: FileEntry) {
  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return
  event.preventDefault()

  selectedFileName.value = file.name
  const target = event.currentTarget as HTMLElement
  const bounds = target.getBoundingClientRect()
  void contextMenu.value?.openAt(bounds.left + 8, bounds.bottom + 4, event)
}

function showFileAction(action: string, fileName: string | null, variant: 'info' | 'danger' = 'info') {
  if (!fileName) return

  selectedAction.value = `${action}: ${fileName}`
  toasts.value.push({
    title: action,
    message: fileName,
    variant,
  })
}

function openFile(fileName: string | null) {
  showFileAction('Open', fileName)
}

function openInEditor(fileName: string | null) {
  showFileAction('Open in text editor', fileName)
}

function openInSpreadsheet(fileName: string | null) {
  showFileAction('Open in spreadsheet', fileName)
}

function renameFile(fileName: string | null) {
  showFileAction('Rename', fileName)
}

function copyFile(fileName: string | null) {
  showFileAction('Copy', fileName)
}

function deleteFile(fileName: string | null) {
  showFileAction('Delete', fileName, 'danger')
}

function recordOpen(event: CContextMenuOpenEvent) {
  menuState.value = `Opened at ${Math.round(event.x)}, ${Math.round(event.y)}`
}

function recordClose(event: CContextMenuCloseEvent) {
  menuState.value = `Closed: ${event.reason}`
}

const basicJavaScript = `const selectedFileName = ref(null)
const toasts = ref([])
const contextMenu = ref(null)

const fileMenu = [
  {
    label: 'Open',
    icon: '📂',
    command: () => openFile(selectedFileName.value),
  },
  {
    label: 'Open with',
    children: [
      {
        label: 'Text editor',
        command: () => openInEditor(selectedFileName.value),
      },
      {
        label: 'Spreadsheet',
        command: () => openInSpreadsheet(selectedFileName.value),
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Rename',
    icon: '✎',
    command: () => renameFile(selectedFileName.value),
  },
  {
    label: 'Delete',
    icon: '🗑️',
    command: () => deleteFile(selectedFileName.value),
  },
]

function showContextMenu(event, file) {
  selectedFileName.value = file.name
  contextMenu.value?.open(event)
}

function showContextMenuFromKeyboard(event, file) {
  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return
  event.preventDefault()

  selectedFileName.value = file.name
  const bounds = event.currentTarget.getBoundingClientRect()
  contextMenu.value?.openAt(bounds.left + 8, bounds.bottom + 4, event)
}

function showFileAction(action, fileName, variant = 'info') {
  if (!fileName) return
  toasts.value.push({
    title: action,
    message: fileName,
    variant,
  })
}

function openFile(fileName) {
  showFileAction('Open', fileName)
}

function openInEditor(fileName) {
  showFileAction('Open in text editor', fileName)
}

function openInSpreadsheet(fileName) {
  showFileAction('Open in spreadsheet', fileName)
}

function renameFile(fileName) {
  showFileAction('Rename', fileName)
}

function deleteFile(fileName) {
  showFileAction('Delete', fileName, 'danger')
}`

const basicUsage = `<CToast v-model="toasts" position="top-end" />

<CContextMenu
  ref="contextMenu"
  :items="fileMenu"
  aria-label="File actions"
/>

<div
  v-for="file in files"
  :key="file.name"
  tabindex="0"
  @contextmenu="showContextMenu($event, file)"
  @keydown="showContextMenuFromKeyboard($event, file)"
>
  {{ file.name }}
</div>`

const programmaticJavaScript = `const contextMenu = ref(null)

function showMenu(event) {
  contextMenu.value?.open(event)
}

function showMenuAt(x, y) {
  contextMenu.value?.openAt(x, y)
}`

const programmaticUsage = `<CContextMenu ref="contextMenu" :items="items" />`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Navigation</p><h1>Context Menu</h1></div>
      <p>
        <code>CContextMenu</code> is a standalone, data-driven command menu opened from any target
        through its component ref.
      </p>
    </header>
    <CSeparator />
    <CToast v-model="toasts" position="top-end" />

    <section class="section">
      <h2>File actions</h2>
      <p>
        Right-click a file to open the example. Selecting an action shows that file's name in a
        toast. The target file is stored before opening, and each menu command receives that
        filename—for example, <code>openFile(selectedFileName.value)</code>. The menu uses the same
        items, separators, disabled state, commands, icons, and nested children as
        <code>CMenu</code>.
      </p>
      <CContextMenu
        ref="contextMenu"
        :items="fileMenu"
        aria-label="File actions"
        @open="recordOpen"
        @close="recordClose"
      />
      <div class="file-list" aria-label="Example files">
        <div class="file header"><span>Name</span><span>Type</span><span>Size</span></div>
        <div
          v-for="file in files"
          :key="file.name"
          class="file"
          tabindex="0"
          @contextmenu="showContextMenu($event, file)"
          @keydown="showContextMenuFromKeyboard($event, file)"
        >
          <span>📄 {{ file.name }}</span><span>{{ file.type }}</span><span>{{ file.size }}</span>
        </div>
      </div>
      <div class="status" aria-live="polite">
        <span>Last action: {{ selectedAction }}</span>
        <span>{{ menuState }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Interaction and positioning</h2>
      <p>
        The menu is teleported to <code>body</code>, positioned from viewport coordinates, and
        shifted inward when it would cross the viewport edge. It closes after selection, clicking
        or focusing outside, pressing Escape, scrolling, resizing, or leaving the browser window.
      </p>
      <p>
        The target owns its context-menu and keyboard listeners. In this example, a focused row
        handles the Context Menu key and Shift+F10 by calling <code>openAt()</code>. The first
        available command receives focus, and Escape restores focus to the invoking row.
      </p>
    </section>

    <section class="section">
      <h2>Opening methods</h2>
      <p>
        A component ref exposes <code>open(event)</code>,
        <code>openAt(x, y, originalEvent?)</code>, and <code>close(reason?)</code>.
        <code>open(event)</code> prevents the browser menu and uses the pointer coordinates.
        <code>openAt()</code> is useful for keyboard targets, table cells, and canvas objects.
      </p>
      <CCodeBlock class="code-sample" :code="programmaticJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="programmaticUsage" />
    </section>

    <section class="section">
      <h2>Properties, events, methods, and slots</h2>
      <dl class="property-list">
        <div><dt><code>items</code></dt><dd>Array of <code>CMenuEntry</code> commands, nested menus, and separators.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Prevents <code>open()</code> and <code>openAt()</code> from displaying the menu.</dd></div>
        <div><dt><code>aria-label</code></dt><dd>Accessible name applied to the menu. Defaults to <code>Context menu</code>.</dd></div>
        <div><dt><code>open(event)</code></dt><dd>Exposed method that opens at a mouse event's viewport coordinates.</dd></div>
        <div><dt><code>openAt(x, y, event?)</code></dt><dd>Exposed method that opens at explicit viewport coordinates.</dd></div>
        <div><dt><code>close(reason?)</code></dt><dd>Exposed method that dismisses the menu.</dd></div>
        <div><dt><code>@open</code></dt><dd>Emitted with viewport coordinates and the optional original event.</dd></div>
        <div><dt><code>@close</code></dt><dd>Emitted with the reason the menu was dismissed.</dd></div>
        <div><dt><code>@select</code></dt><dd>Emitted with the selected <code>CMenuSelectEvent</code>.</dd></div>
        <div><dt><code>#item</code></dt><dd>Custom rendering forwarded to every underlying menu item.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.file-list {
  background: var(--c-surface-color, #fff);
  border: 1px solid var(--c-border-color, #d5d9df);
}

.file {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) 150px 80px;

  + .file {
    border-top: 1px solid var(--c-border-color, #d5d9df);
  }

  span {
    padding: 6px 8px;

    + span {
      border-inline-start: 1px solid var(--c-border-color, #d5d9df);
    }
  }

  &.header {
    font-weight: 600;
    background: var(--c-subtle-surface-color, #f7f8fa);
  }

  &:not(.header):focus {
    position: relative;
    outline: 2px solid var(--c-focus-color, #3578c6);
    outline-offset: -2px;
  }
}

.status {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  color: var(--c-muted-text-color, #626a75);
  font-size: 12px;
  background: var(--c-subtle-surface-color, #f7f8fa);
  border: 1px solid var(--c-border-color, #d5d9df);
  border-top: 0;
}
</style>
