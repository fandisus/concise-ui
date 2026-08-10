<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CSeparator, CToast } from '@/index'
import type {
  CToastCloseEvent,
  CToastItem,
  CToastPosition,
  CToastVariant,
} from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const toasts = ref<CToastItem[]>([])
const position = ref<CToastPosition>('top-end')
const positions: CToastPosition[] = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
]
const lastClose = ref('None')

const messages: Record<CToastVariant, { title: string; message: string }> = {
  default: { title: 'Task queued', message: 'The export was added to the processing queue.' },
  success: { title: 'Saved', message: 'The customer record was saved successfully.' },
  info: { title: 'Synchronization', message: 'Three updated records are available.' },
  warning: { title: 'Low stock', message: 'Printer paper is below its reorder threshold.' },
  danger: { title: 'Save failed', message: 'The server rejected the latest changes.' },
}

function showToast(variant: CToastVariant, duration?: number) {
  const content = messages[variant]
  toasts.value.push({
    variant,
    title: content.title,
    message: content.message,
    duration,
  })
}

function recordClose(event: CToastCloseEvent) {
  lastClose.value = `${event.item.title ?? event.item.message}: ${event.reason}`
}

const basicJavaScript = `const toasts = ref([])

function notifySaved() {
  toasts.value.push({
    title: 'Saved',
    message: 'The customer record was saved successfully.',
    variant: 'success',
  })
}`

const basicUsage = `<CToast v-model="toasts" position="top-end" />

<CButton @click="notifySaved">Save</CButton>`

const persistentUsage = `toasts.value.push({
  title: 'Connection lost',
  message: 'Reconnect before continuing.',
  variant: 'danger',
  duration: 0,
  closable: true,
})`

const accentUsage = `:root {
  --c-toast-accent-width: 8px;
}`

const customUsage = `<CToast v-model="toasts">
  <template #item="{ item, dismiss }">
    <strong>{{ item.title }}</strong>
    <p>{{ item.message }}</p>
    <button type="button" @click="dismiss">Acknowledge</button>
  </template>
</CToast>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Feedback</p><h1>Toast</h1></div>
      <p>
        <code>CToast</code> presents temporary, non-blocking notifications in a compact overlay
        stack while the application owns the underlying message array.
      </p>
    </header>
    <CSeparator />

    <CToast v-model="toasts" :position="position" @close="recordClose" />

    <section class="section">
      <h2>Notification stack</h2>
      <p>
        Mount one toast host near the application root and bind an array with <code>v-model</code>.
        Add records to display notifications. <code>CToast</code> assigns each record an internal
        identity, so applications do not need to create or increment IDs.
      </p>
      <div class="preview">
        <div class="actions">
          <CButton size="small" @click="showToast('default')">Default</CButton>
          <CButton size="small" variant="success" @click="showToast('success')">Success</CButton>
          <CButton size="small" @click="showToast('info')">Info</CButton>
          <CButton size="small" variant="warning" @click="showToast('warning')">Warning</CButton>
          <CButton size="small" variant="danger" @click="showToast('danger')">Danger</CButton>
        </div>
        <span>Active notifications: {{ toasts.length }}</span>
        <span>Last close: {{ lastClose }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Duration and dismissal</h2>
      <p>
        The host's <code>duration</code> defaults to 5000 milliseconds. Set an item's duration to
        <code>0</code> for a persistent notification. Item-level <code>duration</code> and
        <code>closable</code> override the host defaults. Hovering a notification or moving focus
        into it pauses its timer; leaving restarts the full duration.
      </p>
      <div class="preview">
        <div class="actions">
          <CButton size="small" @click="showToast('info', 1500)">1.5 second toast</CButton>
          <CButton size="small" variant="danger" @click="showToast('danger', 0)">
            Persistent toast
          </CButton>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="persistentUsage" language="javascript" />
    </section>

    <section class="section">
      <h2>Position</h2>
      <p>
        The stack supports logical start, center, and end alignment at the top or bottom of the
        viewport. Change the position below, then create another notification.
      </p>
      <div class="preview positions">
        <label v-for="value in positions" :key="value">
          <input v-model="position" type="radio" :value="value" /> {{ value }}
        </label>
      </div>
    </section>

    <section class="section">
      <h2>Accent width</h2>
      <p>
        The semantic color accent is <code>6px</code> wide by default. Set
        <code>--c-toast-accent-width</code> in the global theme to make the toast variant easier to
        recognize without coloring the entire notification.
      </p>
      <CCodeBlock class="code-sample" :code="accentUsage" language="css" />
    </section>

    <section class="section">
      <h2>Custom item content</h2>
      <p>
        The <code>item</code> slot receives the toast record and a <code>dismiss()</code> callback.
        The semantic icon, outer notification styling, timer, and optional close button remain
        managed by <code>CToast</code>.
      </p>
      <CCodeBlock class="code-sample" :code="customUsage" />
    </section>

    <section class="section">
      <h2>Properties, events, and item fields</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Array of active <code>CToastItem</code> records, used by <code>v-model</code>.</dd></div>
        <div><dt><code>position</code></dt><dd><code>top-start</code>, <code>top-center</code>, <code>top-end</code>, or their bottom equivalents.</dd></div>
        <div><dt><code>duration</code></dt><dd>Default lifetime in milliseconds. Defaults to <code>5000</code>; zero is persistent.</dd></div>
        <div><dt><code>closable</code></dt><dd>Default visibility of each notification's dismiss button.</dd></div>
        <div><dt><code>teleport-to</code></dt><dd>Teleport target selector or element. Defaults to <code>body</code>.</dd></div>
        <div><dt><code>aria-label</code></dt><dd>Accessible name for the notification region.</dd></div>
        <div><dt><code>close</code></dt><dd>Emitted with the item and either <code>dismiss</code> or <code>timeout</code>.</dd></div>
        <div><dt><code>id</code></dt><dd>Optional application-provided identity. When omitted, <code>CToast</code> manages identity internally.</dd></div>
        <div><dt><code>title</code></dt><dd>Optional short heading displayed above the message.</dd></div>
        <div><dt><code>message</code></dt><dd>Required notification text.</dd></div>
        <div><dt><code>variant</code></dt><dd><code>default</code>, <code>success</code>, <code>info</code>, <code>warning</code>, or <code>danger</code>.</dd></div>
        <div><dt><code>icon</code></dt><dd>Optional Unicode icon replacing the variant's default symbol.</dd></div>
      </dl>
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

.positions {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}
</style>
