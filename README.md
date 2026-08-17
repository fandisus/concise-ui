# Concise UI

Concise UI is a Vue 3 component framework for desktop-first enterprise and productivity software.

It is designed for applications such as ERP, WMS, CRM, POS, finance, inventory, administration, and other internal business systems. The goal is a compact, professional interface that displays information efficiently without imitating Bootstrap, Material Design, or old desktop software.

> Concise UI is currently under active development. Its public API may change before the first stable release.

## Design principles

- High information density with compact controls and restrained spacing
- Clear hierarchy through typography, borders, and layout
- Conservative use of color for actions, status, selection, and validation
- Desktop-first mouse and keyboard interaction
- Accessible native semantics where possible
- Lightweight components without unnecessary runtime dependencies
- Scoped SCSS and CSS variables for theme customization
- Predictable Vue APIs and public TypeScript types

The complete design direction is documented in [AGENTS.md](./AGENTS.md).

## Theming

Concise UI uses inherited CSS custom properties. Override semantic variables globally on
`:root` or locally on any ancestor; no theme provider or runtime configuration is required:

```css
:root {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
  --c-primary-hover-color: #e2b51f;
  --c-primary-active-color: #cfa30f;
}
```

Use `c-theme-light` and `c-theme-dark` to select neutral surfaces independently from the brand
palette. The documentation application contains the complete semantic-variable reference and
scoped-theme examples.

## Components

### Layout and menus

- `CAppBar`
- `CContextMenu`
- `CMenu`
- `CPanel`
- `CSeparator`
- `CSideBar`

### Forms

- `CButton`
- `CProgressBar`
- `CFormField`
- `CInputGroup`
- `CInputAddon`
- `CInput`
- `CDebounceInput`
- `CTextArea`
- `CPassword`
- `CNumberInput`
- `CDatePicker`
- `CCheckbox`
- `CRadio`
- `CSelect`
- `CMultiSelect`
- `CAutoComplete`

### Data and feedback

- `CDialog`
- `CPrompt` / `CPromptPlugin`
- `CTable`
- `CDataTable`
- `CToast` / `CToastService` / `CToastPlugin`

### Icons

- `CIcon`

`CIcon` displays Unicode symbols and emoji supplied by the application. Concise UI does not bundle an icon font or emoji package.

## Basic usage

Components and their public types are exported from the package entry point:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CButton, CFormField, CInput, CProgressBar } from '@icfm/concise-ui'

const name = ref('')
const progress = ref(35)
</script>

<template>
  <CFormField label="Customer name" required>
    <CInput v-model="name" placeholder="Enter a name" />
  </CFormField>

  <CButton variant="primary">Save</CButton>
  <CProgressBar :value="progress" show-value />
</template>
```

Component styling is authored as scoped SCSS and uses theme variables. The production build emits `dist/concise-ui.css` alongside the JavaScript bundles; applications must include that generated stylesheet. Theme variables can customize presentation without changing component behavior.

## Programmatic prompts

Install the prompt plugin once; it mounts its internal host without requiring template markup:

```js
import { createApp } from 'vue'
import { CPromptPlugin } from '@icfm/concise-ui'
import App from './App.vue'

createApp(App).use(CPromptPlugin).mount('#app')
```

Prompts use a JavaScript-friendly options object and return promises:

```js
import { CPrompt } from '@icfm/concise-ui'

const confirmed = await CPrompt.confirm({
  question: 'Delete this record?',
  confirmLabel: 'Delete',
  confirmVariant: 'danger',
})
```

Calls are queued when another prompt is open. Selection prompts are always filterable and return the selected string or original object.

## Programmatic toasts

Install `CToastPlugin` to create a shared toast host automatically:

```js
import { CToastPlugin, CToastService } from '@icfm/concise-ui'

app.use(CToastPlugin, { position: 'top-end' })

CToastService.success({
  title: 'Saved',
  message: 'The record was saved successfully.',
  onClose(event) {
    console.log(event.reason)
  },
})
```

The service manages its own item identities. Items may define `onAutoClose`, `onUserClose`, and `onClose` callbacks. The declarative `CToast` component remains available when an application needs direct array ownership or custom item slots.

## Data-driven selection

`CSelect` and `CMultiSelect` accept standard `{ label, value }` records or raw objects with accessor props:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CSelect } from '@icfm/concise-ui'

const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
]

const selectedProduct = ref(null)
</script>

<template>
  <CSelect
    v-model="selectedProduct"
    :options="products"
    option-label="name"
    option-key="id"
    filterable
    clearable
  />
</template>
```

Omitting `option-value` binds the complete object. Adding `option-value="id"` binds only the ID.

Filterable `CSelect` and `CAutoComplete` also support parent-controlled remote searching through `@search`, `debounce-wait`, `min-search-length`, and `loading`. Components coordinate the interaction but leave authentication, networking, cancellation, and error handling to the application.

## Documentation application

The repository contains a documentation application with live examples and highlighted Vue and JavaScript snippets for the public components.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite and navigate to **Components**.

## Development commands

```sh
# Start the documentation development server
npm run dev

# Type-check, build the library, and emit declarations
npm run build

# Run unit tests
npm run test:unit

# Run the configured linters
npm run lint

# Format source files
npm run format
```

The supported Node.js versions are `^22.18.0` or `>=24.12.0`. Vue `^3.5.0` is a peer dependency.

## Project structure

```text
src/
├─ components/       Public component implementations and types
├─ documentation/    Documentation-only components
├─ layouts/          Documentation application layouts
├─ pages/components/ Component guides and live examples
├─ router/           Documentation routes
├─ styles/           Documentation application styles
└─ index.ts          Public library exports
```

## Adding a component

The required component workflow is documented in [AGENTS.md](./AGENTS.md#creating-a-new-component). In summary:

1. Define the API, states, events, slots, model shape, and keyboard behavior.
2. Implement the component and any reusable public types.
3. Include accessibility and theme-aware compact styling.
4. Export the component and its public types from `src/index.ts`.
5. Create its documentation page with live examples and code snippets.
6. Register its documentation route and both navigation entries.
7. Review API consistency, accessibility, documentation accuracy, and the final diff.
