<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CDialog, CFormField, CInput, CSeparator } from '@/index'
import type { CDialogCloseEvent, CDialogSize } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const editOpen = ref(false)
const deleteOpen = ref(false)
const sizedOpen = ref(false)
const stackedOpen = ref(false)
const childDialogOpen = ref(false)
const dialogSize = ref<CDialogSize>('medium')
const dialogFullScreen = ref(false)
const customerName = ref('Northwind Traders')
const customerEmail = ref('orders@northwind.example')
const lastClose = ref('None')

function recordClose(event: CDialogCloseEvent) {
  lastClose.value = event.reason
}

function saveCustomer(close: () => void) {
  close()
}

function showSizedDialog(size: CDialogSize | 'full-screen') {
  dialogFullScreen.value = size === 'full-screen'
  if (size !== 'full-screen') dialogSize.value = size
  sizedOpen.value = true
}

const basicJavaScript = `const editOpen = ref(false)
const customerName = ref('Northwind Traders')

function saveCustomer(close) {
  saveRecord(customerName.value)
  close()
}`

const basicUsage = `<CButton @click="editOpen = true">Edit customer</CButton>

<CDialog v-model="editOpen" title="Edit customer">
  <CFormField label="Customer name">
    <CInput v-model="customerName" autofocus />
  </CFormField>

  <template #footer="{ close }">
    <CButton @click="close">Cancel</CButton>
    <CButton variant="primary" @click="saveCustomer(close)">
      Save
    </CButton>
  </template>
</CDialog>`

const confirmationUsage = `<CDialog
  v-model="deleteOpen"
  title="Delete customer"
  width="380px"
  :close-on-outside="false"
>
  This operation cannot be undone.

  <template #footer="{ close }">
    <CButton @click="close">Cancel</CButton>
    <CButton variant="danger" @click="deleteCustomer">
      Delete
    </CButton>
  </template>
</CDialog>`

const headerUsage = `<CDialog v-model="open">
  <template #header>
    Importing purchase orders
  </template>
  <template #actions="{ close }">
    <CButton size="small" @click="close">Stop</CButton>
  </template>

  <!-- Dialog content -->
</CDialog>`

const sizeUsage = `<CDialog v-model="open" size="small" />
<CDialog v-model="open" size="medium" />
<CDialog v-model="open" size="large" />
<CDialog v-model="open" full-screen />

<!-- A custom width overrides the selected size. -->
<CDialog v-model="open" width="42rem" />`

const stackedUsage = `<CDialog v-model="customerDialogOpen" title="Customer details">
  <CButton @click="historyDialogOpen = true">
    View history
  </CButton>

  <CDialog v-model="historyDialogOpen" title="Customer history" size="small">
    The newest dialog remains interactive above its parent.

    <template #footer="{ close }">
      <CButton @click="close">Return to customer</CButton>
    </template>
  </CDialog>
</CDialog>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Feedback</p><h1>Dialog</h1></div>
      <p>
        <code>CDialog</code> presents focused tasks and decisions in a compact modal surface while
        keeping keyboard focus inside the dialog.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Basic dialog</h2>
      <p>
        Bind <code>v-model</code> to control visibility. The native modal dialog makes the rest of
        the page inert, moves focus inside, and restores focus to the invoking control when closed.
      </p>
      <div class="preview">
        <div class="actions-row">
          <CButton variant="primary" @click="editOpen = true">Edit customer</CButton>
          <span>Last close reason: {{ lastClose }}</span>
        </div>
      </div>

      <CDialog v-model="editOpen" title="Edit customer" @close="recordClose">
        <div class="dialog-form">
          <CFormField label="Customer name">
            <CInput v-model="customerName" autofocus />
          </CFormField>
          <CFormField label="Contact email">
            <CInput v-model="customerEmail" type="email" />
          </CFormField>
        </div>

        <template #footer="{ close }">
          <CButton @click="close">Cancel</CButton>
          <CButton variant="primary" @click="saveCustomer(close)">Save</CButton>
        </template>
      </CDialog>

      <CCodeBlock class="code-sample" :code="basicJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Explicit confirmation</h2>
      <p>
        Set <code>close-on-outside="false"</code> when an accidental backdrop click should not
        dismiss an important decision. Escape and the header close button remain available unless
        their corresponding props are also disabled.
      </p>
      <div class="preview">
        <CButton variant="danger" @click="deleteOpen = true">Delete customer</CButton>
      </div>

      <CDialog
        v-model="deleteOpen"
        title="Delete customer"
        width="380px"
        :close-on-outside="false"
      >
        Delete <strong>{{ customerName }}</strong>? This operation cannot be undone.

        <template #footer="{ close }">
          <CButton @click="close">Cancel</CButton>
          <CButton variant="danger" @click="deleteOpen = false">Delete</CButton>
        </template>
      </CDialog>

      <CCodeBlock class="code-sample" :code="confirmationUsage" />
    </section>

    <section class="section">
      <h2>Header content and sizing</h2>
      <p>
        The <code>header</code> slot replaces the plain title, and <code>actions</code> places compact
        controls beside the close button. Supply <code>aria-label</code> when neither title nor a
        meaningful header is present.
      </p>
      <CCodeBlock class="code-sample" :code="headerUsage" />
    </section>

    <section class="section">
      <h2>Sizes and full screen</h2>
      <p>
        Use <code>small</code> for short decisions, <code>medium</code> for ordinary forms, and
        <code>large</code> for denser tasks. <code>full-screen</code> uses the entire viewport for
        workspace-like dialogs. A custom <code>width</code> overrides the selected size while still
        respecting viewport boundaries.
      </p>
      <div class="preview">
        <div class="size-actions">
          <CButton size="small" @click="showSizedDialog('small')">Small</CButton>
          <CButton size="small" @click="showSizedDialog('medium')">Medium</CButton>
          <CButton size="small" @click="showSizedDialog('large')">Large</CButton>
          <CButton size="small" @click="showSizedDialog('full-screen')">Full screen</CButton>
        </div>
      </div>

      <CDialog
        v-model="sizedOpen"
        :title="dialogFullScreen ? 'Full-screen workspace' : `${dialogSize} dialog`"
        :size="dialogSize"
        :full-screen="dialogFullScreen"
      >
        This live example demonstrates the selected dialog presentation.
        <template #footer="{ close }">
          <CButton @click="close">Close</CButton>
        </template>
      </CDialog>

      <CCodeBlock class="code-sample" :code="sizeUsage" />
    </section>

    <section class="section">
      <h2>Stacked dialogs</h2>
      <p>
        A dialog can open another <code>CDialog</code>. The newest dialog is placed above the parent
        and is the only interactive layer. Closing it restores focus inside the parent, which
        remains open with its form state intact.
      </p>
      <div class="preview">
        <CButton @click="stackedOpen = true">Open customer dialog</CButton>
      </div>

      <CDialog v-model="stackedOpen" title="Customer details">
        <p><strong>Northwind Traders</strong></p>
        <p>Account status: Active</p>
        <CButton @click="childDialogOpen = true">View account history</CButton>

        <CDialog v-model="childDialogOpen" title="Account history" size="small">
          <p>12 Aug 2026 — Contact email updated</p>
          <p>04 Aug 2026 — Credit limit reviewed</p>

          <template #footer="{ close }">
            <CButton @click="close">Return to customer</CButton>
          </template>
        </CDialog>

        <template #footer="{ close }">
          <CButton @click="close">Close customer</CButton>
        </template>
      </CDialog>

      <CCodeBlock class="code-sample" :code="stackedUsage" />
    </section>

    <section class="section">
      <h2>Properties, events, methods, and slots</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Boolean visibility state used by <code>v-model</code>.</dd></div>
        <div><dt><code>title</code></dt><dd>Optional header text that also labels the dialog.</dd></div>
        <div><dt><code>aria-label</code></dt><dd>Accessible fallback name when no title or custom header is supplied.</dd></div>
        <div><dt><code>closable</code></dt><dd>Shows the header close button. Defaults to <code>true</code>.</dd></div>
        <div><dt><code>close-on-escape</code></dt><dd>Allows Escape to dismiss the dialog. Defaults to <code>true</code>.</dd></div>
        <div><dt><code>close-on-outside</code></dt><dd>Allows backdrop clicks to dismiss the dialog. Defaults to <code>true</code>.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code> (360px), <code>medium</code> (480px), or <code>large</code> (720px).</dd></div>
        <div><dt><code>full-screen</code></dt><dd>Expands the dialog surface to fill the viewport.</dd></div>
        <div><dt><code>allow-overflow</code></dt><dd>Allows popups such as select lists to extend beyond the body instead of being clipped.</dd></div>
        <div><dt><code>width</code></dt><dd>Optional CSS width such as <code>42rem</code> that overrides <code>size</code>.</dd></div>
        <div><dt><code>teleport-to</code></dt><dd>Teleport selector or element. Defaults to <code>body</code>.</dd></div>
        <div><dt><code>@close</code></dt><dd>Emits <code>close-button</code>, <code>escape</code>, <code>outside</code>, or <code>programmatic</code>.</dd></div>
        <div><dt><code>close()</code></dt><dd>Exposed method for programmatic dismissal.</dd></div>
        <div><dt><code>default</code></dt><dd>Dialog body; receives a <code>close()</code> callback.</dd></div>
        <div><dt><code>header</code></dt><dd>Custom content replacing the plain title.</dd></div>
        <div><dt><code>actions</code></dt><dd>Compact header actions; receives <code>close()</code>.</dd></div>
        <div><dt><code>footer</code></dt><dd>Footer actions aligned to the end; receives <code>close()</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dialog-form {
  display: grid;
  gap: 10px;
}

.size-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
</style>
