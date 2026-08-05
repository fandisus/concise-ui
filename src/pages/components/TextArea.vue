<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CSeparator, CTextArea } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const notes = ref('Deliver to receiving dock 3.')

const basicUsage = `<CFormField label="Delivery notes" hint="Include access or handling instructions.">
  <CTextArea v-model="notes" rows="4" />
</CFormField>`
const stateUsage = `<CTextArea readonly model-value="Read-only notes" />
<CTextArea disabled model-value="Unavailable" />
<CTextArea invalid model-value="Review this value" />`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Text Area</h1></div>
      <p>
        <code>CTextArea</code> provides compact multiline text entry while preserving native rows,
        length constraints, selection, and resize behavior.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Basic usage</h2>
      <div class="preview">
        <CFormField label="Delivery notes" hint="Include access or handling instructions.">
          <CTextArea v-model="notes" rows="4" />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Sizes</h2>
      <p>The size controls minimum height, padding, and typography. Native <code>rows</code> remains available.</p>
      <div class="preview">
        <CTextArea size="small" placeholder="Small" aria-label="Small text area" />
        <CTextArea size="medium" placeholder="Medium" aria-label="Medium text area" />
        <CTextArea size="large" placeholder="Large" aria-label="Large text area" />
      </div>
    </section>

    <section class="section">
      <h2>States</h2>
      <div class="preview">
        <CTextArea readonly model-value="Read-only notes" aria-label="Read-only notes" />
        <CTextArea disabled model-value="Unavailable" aria-label="Disabled notes" />
        <CTextArea invalid model-value="Review this value" aria-label="Invalid notes" />
      </div>
      <CCodeBlock class="code-sample" :code="stateUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>String value used by <code>v-model</code>.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Prevents editing and focus.</dd></div>
        <div><dt><code>readonly</code></dt><dd>Prevents editing while keeping the value focusable.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
