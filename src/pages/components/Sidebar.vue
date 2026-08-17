<script setup lang="ts">
import { ref } from 'vue'

import CCodeBlock from '@/documentation/CCodeBlock.vue'
import { CButton, CMenu, CSeparator, CSideBar } from '@/index'
import type { CMenuEntry, CMenuSelectEvent } from '@/index'

const lastAction = ref('No item selected')
const sidebarCollapsed = ref(false)

const navigation: CMenuEntry[] = [
  { label: 'Dashboard', icon: '⌂', active: true },
  {
    label: 'Sales',
    icon: '∑',
    children: [
      { label: 'Orders', icon: '▤' },
      { label: 'Customers', icon: '👥' },
      {
        label: 'Reports',
        icon: '▦',
        children: [
          { label: 'Daily Report', icon: '▤' },
          { label: 'Monthly Report', icon: '▤' },
        ],
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Administration',
    icon: '⚙︎',
    children: [
      { label: 'Users', icon: '👥' },
      { label: 'System Settings', icon: '⚙︎' },
    ],
  },
]

const groupedNavigation: CMenuEntry[] = [
  { label: 'Menus', type: 'header' },
  { label: 'AppBar & Menu', icon: '▤' },
  { label: 'Context Menu', icon: '⌖' },
  { label: 'Sidebar', icon: '◧', active: true },
  { label: 'Forms', type: 'header' },
  { label: 'Input', icon: '⌨' },
  { label: 'Select', icon: '▾' },
  { label: 'Date Picker', icon: '◫' },
]

const styledNavigation: CMenuEntry[] = [
  { label: 'Menus', type: 'header', class: 'primary-heading' },
  { label: 'AppBar & Menu' },
  { label: 'Sidebar' },
  {
    label: 'Forms',
    type: 'header',
    style: { color: '#8a3b12', background: '#fff2e8' },
  },
  { label: 'Input' },
  { label: 'Select' },
]

const menuHeaderUsage = `<script setup>
const navigation = [
  { label: 'Menus', type: 'header' },
  { label: 'AppBar & Menu', icon: '▤', url: '/components/app-bar-menu' },
  { label: 'Context Menu', icon: '⌖', url: '/components/context-menu' },
  { label: 'Sidebar', icon: '◧', url: '/components/sidebar', active: true },

  { label: 'Forms', type: 'header' },
  { label: 'Input', icon: '⌨', url: '/components/input' },
  { label: 'Select', icon: '▾', url: '/components/select' },
  { label: 'Date Picker', icon: '◫', url: '/components/date-picker' },
]
<\/script>

<template>
  <CMenu :items="navigation" orientation="vertical" />
</template>`

const menuHeaderStyleUsage = `<script setup>
const navigation = [
  { label: 'Menus', type: 'header', class: 'primary-heading' },
  { label: 'AppBar & Menu' },
  { label: 'Sidebar' },
  {
    label: 'Forms',
    type: 'header',
    style: { color: '#8a3b12', background: '#fff2e8' },
  },
  { label: 'Input' },
  { label: 'Select' },
]
<\/script>

<template>
  <CMenu class="styled-menu" :items="navigation" />
</template>

<style scoped>
.styled-menu {
  --c-menu-header-color: #24527a;
  --c-menu-header-background: #edf5fc;
  --c-menu-header-padding: 7px 8px 4px;
}

.styled-menu :deep(.primary-heading) {
  border-inline-start: 3px solid #286aa6;
}
</style>`

const sidebarUsage = `<CSideBar
  v-model:collapsed="sidebarCollapsed"
  collapse-button
  width="250px"
  aria-label="Application navigation"
>
  <template #header>
    <strong>Company workspace</strong>
  </template>

  <CMenu
    :items="navigation"
    orientation="vertical"
    submenu-mode="inline"
  />

  <template #footer>Administrator</template>
</CSideBar>`

const collapseUsage = `<script setup>
import { ref } from 'vue'

const sidebarCollapsed = ref(false)
<\/script>

<template>
  <CSideBar
    collapse-button
    v-model:collapsed="sidebarCollapsed"
    collapsed-width="38px"
    aria-label="Application navigation"
  >
    <template #header>
      <strong>Company workspace</strong>
    </template>

    <CMenu :items="navigation" submenu-mode="inline" />
  </CSideBar>
</template>`

const externalCollapseUsage = `<CButton @click="sidebarCollapsed = !sidebarCollapsed">
  Toggle sidebar
</CButton>

<CSideBar v-model:collapsed="sidebarCollapsed">
  Externally controlled content
</CSideBar>`

const placementUsage = `<div class="workspace">
  <CSideBar placement="start" width="180px" aria-label="Navigation">
    <template #header><strong>Navigation</strong></template>
    Main menu
  </CSideBar>

  <main>Application content</main>

  <CSideBar placement="end" width="180px" aria-label="Properties">
    <template #header><strong>Properties</strong></template>
    Selection details
  </CSideBar>
</div>

<style scoped>
.workspace {
  display: flex;
  min-height: 0;
}

.workspace > main {
  flex: 1;
  min-width: 0;
}
</style>`

const backgroundUsage = `<CSideBar style="background: #dbe8f5">
  Solid color
</CSideBar>

<CSideBar style="background: linear-gradient(180deg, #ffffff, #e7eef6)">
  Gradient
</CSideBar>

<CSideBar class="image-sidebar">
  Background image
</CSideBar>

<style scoped>
.image-sidebar {
  --c-text-color: #fff;
  background: center / cover no-repeat url('/images/sidebar.jpg');
}
</style>`

const sidebarJavaScript = `import { ref } from 'vue'

const sidebarCollapsed = ref(false)

const navigation = [
  {
    label: 'Dashboard',
    icon: '⌂',
    url: '/dashboard',
    active: true,
  },
  {
    label: 'Sales',
    icon: '∑',
    children: [
      { label: 'Orders', icon: '▤', url: '/sales/orders' },
      { label: 'Customers', icon: '👥', url: '/sales/customers' },
      {
        label: 'Reports',
        icon: '▦',
        children: [
          { label: 'Daily Report', icon: '▤', url: '/sales/reports/daily' },
          { label: 'Monthly Report', icon: '▤', url: '/sales/reports/monthly' },
        ],
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Administration',
    icon: '⚙︎',
    children: [
      { label: 'Users', icon: '👥', url: '/admin/users' },
      { label: 'System Settings', icon: '⚙︎', url: '/admin/settings' },
    ],
  },
]`

function recordSelection(event: CMenuSelectEvent) {
  lastAction.value = event.item.label
}
</script>

<template>
  <article class="sidebar-page">
    <header class="page-header">
      <div>
        <p class="category">Layout</p>
        <h1>Sidebar</h1>
      </div>
      <p>
        <code>CSideBar</code> provides header, scrollable content, and footer regions for compact
        desktop application navigation.
      </p>
    </header>

    <CSeparator />

    <section class="example">
      <div class="description">
        <h2>Navigation sidebar</h2>
        <p>
          A vertical menu expands inline while the surrounding application content remains fixed.
          Multiple branches can remain expanded.
        </p>
      </div>

      <div class="external-control">
        <CButton @click="sidebarCollapsed = !sidebarCollapsed">Toggle from outside</CButton>
        <span>Collapsed: {{ sidebarCollapsed }}</span>
      </div>

      <div class="preview">
        <CSideBar
          v-model:collapsed="sidebarCollapsed"
          collapse-button
          width="250px"
          aria-label="Example sidebar"
        >
          <template #header>
            <strong>Company workspace</strong>
          </template>

          <CMenu
            :items="navigation"
            orientation="vertical"
            submenu-mode="inline"
            aria-label="Example sidebar navigation"
            @select="recordSelection"
          />

          <template #footer>
            <span class="user">Administrator</span>
          </template>
        </CSideBar>

        <div class="placeholder">
          <strong>Application content</strong>
          <span>Select or expand items in the sidebar.</span>
        </div>
      </div>

      <div class="status" aria-live="polite">Last selection: {{ lastAction }}</div>
      <CCodeBlock class="code-sample" :code="sidebarUsage" />
      <CCodeBlock class="code-sample" :code="sidebarJavaScript" language="javascript" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Collapsible sidebar</h2>
        <p>
          Bind <code>collapsed</code> to control whether the sidebar is open, independently of how
          that state is changed. Add <code>collapse-button</code> only when the sidebar should render
          its own boxed toggle before the header content. The sidebar preserves its menu state while
          collapsed, including expanded menu branches.
        </p>
      </div>

      <dl class="property-list">
        <div>
          <dt><code>collapse-button</code></dt>
          <dd>Shows the built-in header toggle. It does not enable or disable collapse behavior.</dd>
        </div>
        <div>
          <dt><code>collapsed</code></dt>
          <dd>
            Controls the collapsed state. Use <code>v-model:collapsed</code> with either the built-in
            button or an external control. The built-in button can also manage its own state when no
            model is supplied.
          </dd>
        </div>
        <div>
          <dt><code>collapsed-width</code></dt>
          <dd>Sets the width of the collapsed sidebar. The default is <code>38px</code>.</dd>
        </div>
      </dl>

      <CCodeBlock class="code-sample" :code="collapseUsage" />
      <CCodeBlock class="code-sample" :code="externalCollapseUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Menu headers</h2>
        <p>
          Add <code>{ label: '...', type: 'header' }</code> to divide a long vertical menu into
          recognizable groups. Headers are visual labels rather than actions, so they are skipped
          by keyboard navigation. They also support <code>hidden</code> for conditional groups.
        </p>
      </div>

      <div class="preview header-preview">
        <CSideBar width="230px" aria-label="Grouped component navigation">
          <template #header><strong>Components</strong></template>
          <CMenu
            :items="groupedNavigation"
            orientation="vertical"
            aria-label="Grouped component menu"
          />
        </CSideBar>

        <div class="placeholder">
          <strong>Grouped navigation</strong>
          <span>Headers separate related menu entries without becoming selectable items.</span>
        </div>
      </div>

      <CCodeBlock class="code-sample" :code="menuHeaderUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Styling menu headers</h2>
        <p>
          Set header CSS variables on <code>CMenu</code> to style every heading consistently. For a
          particular heading, add <code>class</code> or <code>style</code> to its data object. With
          scoped CSS, use <code>:deep()</code> when targeting that class because the rendered header
          belongs to <code>CMenu</code>.
        </p>
      </div>

      <div class="styled-header-preview">
        <CMenu class="styled-menu" :items="styledNavigation" aria-label="Styled menu headers" />
      </div>

      <dl class="property-list header-style-properties">
        <div>
          <dt><code>--c-menu-header-color</code></dt>
          <dd>Heading text color.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-background</code></dt>
          <dd>Heading background, including colors and gradients.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-padding</code></dt>
          <dd>Inner spacing for each heading.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-horizontal-padding</code></dt>
          <dd>Optional padding override when a header appears in a horizontal menu.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-font-size</code></dt>
          <dd>Heading text size.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-font-weight</code></dt>
          <dd>Heading text weight.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-letter-spacing</code></dt>
          <dd>Spacing between heading characters.</dd>
        </div>
        <div>
          <dt><code>--c-menu-header-text-transform</code></dt>
          <dd>Text transformation such as <code>uppercase</code> or <code>none</code>.</dd>
        </div>
      </dl>

      <CCodeBlock class="code-sample" :code="menuHeaderStyleUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Placement</h2>
        <p>
          Use the default <code>placement="start"</code> for navigation before the main content and
          <code>placement="end"</code> for tools or details after it. These are logical directions:
          start is left and end is right in left-to-right layouts, with the meaning reversed in
          right-to-left layouts.
        </p>
        <p>
          Placement controls which inner edge receives the divider. The parent flex or grid layout
          and the sidebar's document order determine its actual position. For the usual
          side-by-side application shell, give the parent <code>display: flex</code> and allow the
          main content to grow with <code>flex: 1</code>.
        </p>
      </div>

      <div class="placement-preview">
        <CSideBar placement="start" width="180px" aria-label="Example navigation sidebar">
          <template #header><strong>Navigation</strong></template>
          Main menu
        </CSideBar>

        <main class="placement-content">Application content</main>

        <CSideBar placement="end" width="180px" aria-label="Example properties sidebar">
          <template #header><strong>Properties</strong></template>
          Selection details
        </CSideBar>
      </div>

      <CCodeBlock class="code-sample" :code="placementUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Custom backgrounds</h2>
        <p>
          Apply standard <code>class</code> or <code>style</code> attributes to customize the
          sidebar with any valid CSS background, including a color, gradient, or image.
        </p>
        <p>
          For dark backgrounds, set <code>--c-text-color</code> so sidebar content and nested
          Concise UI components use a suitable foreground color.
        </p>
      </div>

      <div class="background-preview">
        <CSideBar
          class="solid-background"
          width="200px"
          aria-label="Solid background example"
        >
          <template #header><strong>Solid color</strong></template>
          #dbe8f5
        </CSideBar>
        <CSideBar
          class="gradient-background"
          width="200px"
          aria-label="Gradient background example"
        >
          <template #header><strong>Gradient</strong></template>
          linear-gradient(...)
        </CSideBar>
      </div>

      <CCodeBlock class="code-sample" :code="backgroundUsage" />
    </section>
  </article>
</template>

<style scoped lang="scss">
.sidebar-page {
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
  }

  .description {
    margin-bottom: 10px;

    p {
      margin-bottom: 0;
      color: var(--c-muted-text-color, #626a75);
      line-height: 1.5;
    }
  }

  .preview {
    display: flex;
    height: 360px;
    overflow: hidden;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }

  .header-preview {
    height: 300px;
  }

  .styled-header-preview {
    width: min(100%, 320px);
    padding: 5px;
    margin-bottom: 8px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }

  .styled-menu {
    --c-menu-header-color: #24527a;
    --c-menu-header-background: #edf5fc;
    --c-menu-header-padding: 7px 8px 4px;

    :deep(.primary-heading) {
      border-inline-start: 3px solid #286aa6;
    }
  }

  .user {
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
  }

  .placeholder {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 0;
    color: var(--c-muted-text-color, #626a75);
    background: var(--c-subtle-surface-color, #f7f8fa);
    gap: 5px;
  }

  .status {
    padding: 6px 9px;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    background: var(--c-subtle-surface-color, #f7f8fa);
    border: 1px solid var(--c-border-color, #d5d9df);
    border-top: 0;
  }

  .code-sample {
    margin-top: 8px;
  }

  .external-control {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    gap: 8px;

    span {
      color: var(--c-muted-text-color, #626a75);
      font-size: 12px;
    }
  }

  .property-list {
    margin: 0;
    border: 1px solid var(--c-border-color, #d5d9df);

    > div {
      display: grid;
      grid-template-columns: 130px minmax(0, 1fr);

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

  .header-style-properties > div {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .placement-preview {
    display: flex;
    height: 180px;
    overflow: hidden;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }

  .placement-content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    color: var(--c-muted-text-color, #626a75);
    background: var(--c-subtle-surface-color, #f7f8fa);
  }

  .background-preview {
    display: flex;
    height: 150px;
    overflow: hidden;
    gap: 12px;

    .c-side-bar {
      border: 1px solid var(--c-border-color, #d5d9df);
    }

    .solid-background {
      background: #dbe8f5;
    }

    .gradient-background {
      --c-text-color: #fff;
      background: linear-gradient(180deg, #34495e, #1f2d3a);
    }
  }
}
</style>
