<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CPrompt, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const lastResult = ref('None')

const warehouses = [
  { id: 1, name: 'Central Warehouse', code: 'CTR' },
  { id: 2, name: 'East Distribution Center', code: 'EDC' },
  { id: 3, name: 'Returns Warehouse', code: 'RTN' },
]

async function showMessage() {
  await CPrompt.warning({
    title: 'Insufficient credit',
    message: 'The order exceeds the customer’s available credit.',
  })
  lastResult.value = 'Warning acknowledged'
}

async function confirmDelete() {
  const confirmed = await CPrompt.confirm({
    question: 'Delete this record?',
    title: 'Confirmation',
    icon: '?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    confirmVariant: 'danger',
  })
  lastResult.value = `Confirmed: ${confirmed}`
}

async function requestFilename() {
  const filename = await CPrompt.input({
    question: 'Enter a filename',
    title: 'Rename file',
    initialValue: 'report.xlsx',
    placeholder: 'Filename',
  })
  lastResult.value = filename === null ? 'Input cancelled' : `Filename: ${filename}`
}

async function chooseWarehouse() {
  const warehouse = await CPrompt.select({
    question: 'Choose a warehouse',
    options: warehouses,
    title: 'Move stock',
    placeholder: 'Select warehouse',
    optionLabel: 'name',
  })
  lastResult.value = warehouse === null ? 'Selection cancelled' : `Warehouse: ${warehouse.name}`
}

async function chooseColor() {
  const color = await CPrompt.select({
    question: 'Choose a color',
    options: ['Red', 'Green', 'Blue'],
  })
  lastResult.value = color === null ? 'Selection cancelled' : `Color: ${color}`
}

const installUsage = `import { createApp } from 'vue'
import { CPromptPlugin } from '@icfm/concise-ui'
import App from './App.vue'

createApp(App)
  .use(CPromptPlugin)
  .mount('#app')`

const messageUsage = `await CPrompt.warning({
  title: 'Insufficient credit',
  message: 'The order exceeds the available credit.',
})

await CPrompt.message({
  title: 'Server response',
  message: serverOutput,
  icon: '😘',
  preformatted: true,
})

await CPrompt.message({
  title: 'How to use this page',
  unsafeHtml: hardcodedInFrontEndHtml,
})`

const confirmUsage = `const confirmed = await CPrompt.confirm({
  question: 'Delete this record?',
  title: 'Confirmation',
  icon: '?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  confirmVariant: 'danger',
})`

const inputUsage = `const filename = await CPrompt.input({
  question: 'Enter a filename',
  title: 'Rename file',
  initialValue: 'report.xlsx',
  placeholder: 'Filename',
})

// Empty input is valid only when explicitly enabled.
const optionalNote = await CPrompt.input({
  question: 'Add an optional note',
  required: false,
})`

const selectUsage = `const warehouse = await CPrompt.select({
  question: 'Choose a warehouse',
  options: warehouses,
  title: 'Move stock',
  placeholder: 'Select warehouse',
  optionLabel: 'name',
})

const color = await CPrompt.select({
  question: 'Choose a color',
  options: ['Red', 'Green', 'Blue'],
})`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Feedback</p><h1>Prompt</h1></div>
      <p>
        <code>CPrompt</code> provides queued, promise-based messages, confirmations, text input,
        and searchable selection without placing a host component in the application template.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Installation</h2>
      <p>
        Install <code>CPromptPlugin</code> once. It creates the internal prompt host automatically;
        no <code>CPromptHost</code> markup is required in <code>App.vue</code>. Calls made while
        another prompt is open wait in a queue.
      </p>
      <CCodeBlock class="code-sample" :code="installUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Messages</h2>
      <p>
        <code>info()</code>, <code>success()</code>, <code>warning()</code>, and
        <code>error()</code> supply semantic defaults. <code>message()</code> remains neutral and
        supports preformatted text or explicitly trusted HTML.
      </p>
      <div class="preview">
        <div class="actions">
          <CButton size="small" @click="CPrompt.info({ message: 'The report is ready.' })">Info</CButton>
          <CButton size="small" variant="success" @click="CPrompt.success({ message: 'Record saved.' })">Success</CButton>
          <CButton size="small" variant="warning" @click="showMessage">Warning</CButton>
          <CButton size="small" variant="danger" @click="CPrompt.error({ message: 'Save failed.' })">Error</CButton>
        </div>
        <span>Last result: {{ lastResult }}</span>
      </div>
      <p class="security-note">
        <code>unsafeHtml</code> is not sanitized. Use it only with hardcoded or otherwise trusted
        frontend HTML—never with user input or unsanitized server responses.
      </p>
      <CCodeBlock class="code-sample" :code="messageUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Confirmation</h2>
      <p>
        <code>confirm()</code> resolves to <code>true</code> after confirmation and
        <code>false</code> after cancellation or dismissal.
      </p>
      <div class="preview"><CButton variant="danger" @click="confirmDelete">Confirm deletion</CButton></div>
      <CCodeBlock class="code-sample" :code="confirmUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Text input</h2>
      <p>
        <code>input()</code> resolves to the submitted string or <code>null</code> when cancelled.
        Input is required by default, so whitespace-only text cannot be submitted. Set
        <code>required: false</code> when an empty string is meaningful.
      </p>
      <div class="preview"><CButton @click="requestFilename">Rename file</CButton></div>
      <CCodeBlock class="code-sample" :code="inputUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Searchable selection</h2>
      <p>
        Every select prompt is filterable. String arrays return the selected string. Object arrays
        return the original selected object and use <code>option-label</code> to display and filter
        choices.
      </p>
      <div class="preview">
        <div class="actions">
          <CButton @click="chooseWarehouse">Choose warehouse</CButton>
          <CButton @click="chooseColor">Choose color</CButton>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="selectUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Methods and results</h2>
      <dl class="property-list">
        <div><dt><code>info()</code></dt><dd>Semantic informational message; resolves after acknowledgement.</dd></div>
        <div><dt><code>success()</code></dt><dd>Semantic success message; resolves after acknowledgement.</dd></div>
        <div><dt><code>warning()</code></dt><dd>Semantic warning message; resolves after acknowledgement.</dd></div>
        <div><dt><code>error()</code></dt><dd>Semantic error message; resolves after acknowledgement.</dd></div>
        <div><dt><code>message()</code></dt><dd>Neutral, preformatted, or trusted-HTML message; resolves after acknowledgement.</dd></div>
        <div><dt><code>confirm()</code></dt><dd>Resolves to a boolean.</dd></div>
        <div><dt><code>input()</code></dt><dd>Resolves to a string or <code>null</code>.</dd></div>
        <div><dt><code>select()</code></dt><dd>Resolves to the selected string/object or <code>null</code>.</dd></div>
      </dl>
      <p class="reference-note">
        All methods accept optional <code>title</code>, <code>icon</code>,
        <code>confirmLabel</code>, <code>size</code>, and <code>width</code> fields. Confirmation,
        input, and selection also accept <code>cancelLabel</code> and
        <code>confirmVariant</code>.
      </p>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.security-note {
  padding: 7px 9px;
  color: var(--c-warning-text-color, #7a4d00) !important;
  background: var(--c-warning-background-color, #fff8e6);
  border: 1px solid var(--c-warning-border-color, #d7951d);
}

.reference-note {
  margin-top: 10px !important;
}
</style>
