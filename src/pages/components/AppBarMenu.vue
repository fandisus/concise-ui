<script setup lang="ts">
import { ref } from 'vue'

import { CAppBar, CButton, CMenu, CSeparator } from '@/index'
import type { CMenuEntry, CMenuSelectEvent } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const lastAction = ref('No command selected')

const appBarUsage = `<CAppBar>
  <template #start>
    <CMenu :items="mainMenu" orientation="horizontal" />
  </template>

  <template #center>Order Management</template>

  <template #end>
    <input type="search" placeholder="Search" />
    <CButton variant="primary">Create order</CButton>
  </template>
</CAppBar>`

const appBarJavaScript = `const mainMenu = [
  {
    label: 'File',
    icon: '▤',
    children: [
      { label: 'Documents', type: 'header' },
      { label: 'New', icon: '+', command: () => createDocument() },
      { label: 'Open…', icon: '📂', command: () => openDocument() },
      { label: 'Storage', type: 'header' },
      { label: 'Save', icon: '💾', command: () => saveDocument() },
    ],
  },
  {
    label: 'Edit',
    icon: '✎',
    children: [
      { label: 'Undo', icon: '↶', command: () => undo() },
      { label: 'Redo', icon: '↷', command: () => redo(), disabled: true },
    ],
  },
  { type: 'separator' },
  { label: 'Help', icon: '?', url: '#help' },
]`

const itemStructureJavaScript = `const fileMenu = [
  { label: 'Menus', type: 'header' },
  {
    label: 'File',
    icon: '▤',
    children: [
      { label: 'Open…', icon: '📂', command: () => openDocument() },
      { type: 'separator' },
      { label: 'Save', icon: '💾', command: () => saveDocument() },
    ],
  },
  { label: 'Forms', type: 'header' },
  { label: 'Input', url: '/components/input' },
  { label: 'Date Picker', url: '/components/date-picker' },
]`

const disabledAndHiddenJavaScript = `import { computed } from 'vue'

const editMenu = computed(() => [
  {
    label: 'Redo',
    icon: '↷',
    disabled: !canRedo.value,
    command: () => redo(),
  },
  {
    label: 'Administration',
    icon: '⚙︎',
    hidden: !currentUser.value.isAdministrator,
    url: '/administration',
  },
])`

const linkStateJavaScript = `import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navigation = computed(() => [
  {
    label: 'Dashboard',
    icon: '⌂',
    url: '/dashboard',
    active: route.path === '/dashboard',
  },
  {
    label: 'Documentation',
    icon: '?',
    url: 'https://example.com/docs',
    target: '_blank',
  },
])`

const topMenu: CMenuEntry[] = [
  {
    label: 'File',
    icon: '▤',
    children: [
      { label: 'Documents', type: 'header' },
      { label: 'New', icon: '+' },
      { label: 'Open…', icon: '📂' },
      { label: 'Storage', type: 'header' },
      { label: 'Save', icon: '💾' },
      { label: 'Save As…', icon: '💾' },
    ],
  },
  {
    label: 'Edit',
    icon: '✎',
    children: [
      { label: 'Undo', icon: '↶' },
      { label: 'Redo', icon: '↷', disabled: true },
      { type: 'separator' },
      { label: 'Preferences', icon: '⚙︎' },
    ],
  },
  { type: 'separator' },
  { label: 'Help', icon: '?', url: '#help' },
]

function recordSelection(event: CMenuSelectEvent) {
  lastAction.value = event.item.label
}
</script>

<template>
  <article id="help" class="component-page">
    <header class="page-header">
      <div>
        <p class="category">Navigation</p>
        <h1>AppBar &amp; Menu</h1>
      </div>
      <p>
        Compose application-level regions with <code>CAppBar</code>, then place data-driven
        horizontal or vertical menus where the workflow needs them.
      </p>
    </header>

    <CSeparator />

    <section class="example">
      <div class="description">
        <h2>Application bar</h2>
        <p>A horizontal menu can share the bar with centered context and controls at the end.</p>
      </div>

      <div class="preview">
        <CAppBar aria-label="Example application bar">
          <template #start>
            <strong class="brand">Operations</strong>
            <CMenu
              :items="topMenu"
              orientation="horizontal"
              aria-label="Example application menu"
              @select="recordSelection"
            />
          </template>

          <template #center>
            <span class="context">Order Management</span>
          </template>

          <template #end>
            <input class="input" type="search" aria-label="Search orders" placeholder="Search" />
            <CButton variant="primary">Create order</CButton>
          </template>
        </CAppBar>
        <div class="status" aria-live="polite">Last action: {{ lastAction }}</div>
      </div>
      <CCodeBlock class="code-sample" :code="appBarUsage" />
      <CCodeBlock class="code-sample" :code="appBarJavaScript" language="javascript" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Item content and hierarchy</h2>
        <p>
          Each regular menu entry has a label and can include a Unicode icon or a nested menu.
        </p>
      </div>

      <dl class="property-list">
        <div>
          <dt><code>label</code></dt>
          <dd>The required text displayed for the menu item.</dd>
        </div>
        <div>
          <dt><code>icon</code></dt>
          <dd>
            An optional Unicode symbol or emoji rendered with <code>CIcon</code> before the label.
          </dd>
        </div>
        <div>
          <dt><code>children</code></dt>
          <dd>
            An optional array of menu entries. Providing children turns the item into a submenu
            trigger. Children can contain regular items, deeper submenus, headers, and separators.
          </dd>
        </div>
        <div>
          <dt><code>type: 'header'</code></dt>
          <dd>
            Displays a noninteractive group heading. Headers are skipped by keyboard navigation and
            support <code>hidden</code> for conditional groups.
          </dd>
        </div>
        <div>
          <dt><code>type: 'separator'</code></dt>
          <dd>Displays a noninteractive visual division between groups of items.</dd>
        </div>
      </dl>

      <CCodeBlock class="code-sample" :code="itemStructureJavaScript" language="javascript" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Disabled and hidden items</h2>
        <p>
          Set <code>disabled</code> when an action is currently unavailable. The item remains
          visible but cannot be activated, is skipped by menu keyboard navigation, and its command
          will not run. Use <code>hidden</code> when an item should not be shown at all.
        </p>
      </div>

      <dl class="property-list">
        <div>
          <dt><code>disabled</code></dt>
          <dd>
            Applies disabled styling and <code>aria-disabled="true"</code>. It is commonly derived
            from application state, permissions, or whether an operation can currently run.
          </dd>
        </div>
        <div>
          <dt><code>hidden</code></dt>
          <dd>
            Removes the item from rendering and keyboard navigation. It is commonly derived from
            permissions, feature availability, or application context, and also works on
            separators.
          </dd>
        </div>
      </dl>

      <CCodeBlock
        class="code-sample"
        :code="disabledAndHiddenJavaScript"
        language="javascript"
      />
    </section>

    <section class="example">
      <div class="description">
        <h2>Link state and targets</h2>
        <p>
          Menu entries with a <code>url</code> render as links. Use <code>target</code> to choose
          where a link opens and <code>active</code> to identify the current page.
        </p>
      </div>

      <dl class="property-list">
        <div>
          <dt><code>url</code></dt>
          <dd>
            Becomes the link's <code>href</code>. Without it, the item renders as a button for a
            command or submenu.
          </dd>
        </div>
        <div>
          <dt><code>target</code></dt>
          <dd>
            Becomes the link's HTML <code>target</code>. Omit it for the current tab
            (<code>_self</code>), or use <code>_blank</code> for a new tab. It has no effect without
            <code>url</code>.
          </dd>
        </div>
        <div>
          <dt><code>active</code></dt>
          <dd>
            Applies current-page styling and <code>aria-current="page"</code>. Set it from the
            router or application state; <code>CMenu</code> does not match routes automatically.
          </dd>
        </div>
      </dl>

      <CCodeBlock class="code-sample" :code="linkStateJavaScript" language="javascript" />
    </section>

  </article>
</template>

<style scoped lang="scss">
.component-page {
  width: min(100%, 1100px);
  margin: 0 auto;

  .page-header {
    display: grid;
    grid-template-columns: minmax(220px, 0.7fr) minmax(320px, 1.3fr);
    align-items: end;
    padding-bottom: 20px;
    gap: 32px;

    > p {
      margin-bottom: 0;
      color: var(--c-muted-text-color, #626a75);
      line-height: 1.5;
    }
  }

  .category {
    margin: 0 0 4px;
    color: var(--c-primary-color, #2f6fad);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 0;
    font-size: 25px;
  }

  h2 {
    margin-bottom: 5px;
    font-size: 16px;
  }

  .example {
    padding: 22px 0;

    .description {
      margin-bottom: 10px;

      p {
        margin-bottom: 0;
        color: var(--c-muted-text-color, #626a75);
        line-height: 1.5;
      }
    }

    .preview {
      overflow: visible;
      background: var(--c-surface-color, #fff);
      border: 1px solid var(--c-border-color, #d5d9df);

    }

    .status {
      padding: 6px 9px;
      color: var(--c-muted-text-color, #626a75);
      font-size: 12px;
      background: var(--c-subtle-surface-color, #f7f8fa);
      border-top: 1px solid var(--c-border-color, #d5d9df);
    }

    .code-sample {
      margin-top: 8px;
    }
  }

  .property-list {
    margin: 0;
    border: 1px solid var(--c-border-color, #d5d9df);

    > div {
      display: grid;
      grid-template-columns: 100px minmax(0, 1fr);

      + div {
        border-top: 1px solid var(--c-border-color, #d5d9df);
      }
    }

    dt,
    dd {
      margin: 0;
      padding: 8px 10px;
    }

    dt {
      font-weight: 600;
      background: var(--c-subtle-surface-color, #f7f8fa);
      border-inline-end: 1px solid var(--c-border-color, #d5d9df);
    }

    dd {
      line-height: 1.45;
    }
  }

  .brand {
    padding-inline-end: 4px;
  }

  .context {
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
  }

  .input {
    box-sizing: border-box;
    width: 150px;
    height: 30px;
    padding: 4px 7px;
    color: inherit;
    font: inherit;
    background: #fff;
    border: 1px solid var(--c-border-color, #bfc5ce);
    border-radius: var(--c-border-radius, 3px);

    &:focus {
      border-color: var(--c-focus-color, #3578c6);
      outline: 1px solid var(--c-focus-color, #3578c6);
    }
  }
}
</style>
