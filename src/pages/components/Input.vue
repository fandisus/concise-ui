<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CInput, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const name = ref('Ada Lovelace')
const search = ref('')

const basicUsage = `<CInput v-model="name" placeholder="Full name" />
<CInput v-model="search" type="search" placeholder="Search records" />`
const sizeUsage = `<CInput size="small" placeholder="Small" />
<CInput size="medium" placeholder="Medium" />
<CInput size="large" placeholder="Large" />`
const stateUsage = `<CInput disabled model-value="Unavailable" />
<CInput readonly model-value="Read-only value" />
<CInput invalid model-value="Invalid value" />`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Input</h1></div>
      <p>
        <code>CInput</code> is a compact native input with <code>v-model</code>, consistent sizing,
        validation styling, and forwarded HTML attributes.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Basic usage</h2>
      <div class="preview">
        <CFormField label="Full name"><CInput v-model="name" /></CFormField>
        <CFormField label="Search"><CInput v-model="search" type="search" placeholder="Search records" /></CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Sizes</h2>
      <div class="preview-row">
        <CInput size="small" placeholder="Small" aria-label="Small input" />
        <CInput size="medium" placeholder="Medium" aria-label="Medium input" />
        <CInput size="large" placeholder="Large" aria-label="Large input" />
      </div>
      <CCodeBlock class="code-sample" :code="sizeUsage" />
    </section>

    <section class="section">
      <h2>States</h2>
      <div class="preview">
        <CInput disabled model-value="Unavailable" aria-label="Disabled input" />
        <CInput readonly model-value="Read-only value" aria-label="Read-only input" />
        <CInput invalid model-value="Invalid value" aria-label="Invalid input" />
      </div>
      <CCodeBlock class="code-sample" :code="stateUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>String value used by <code>v-model</code>.</dd></div>
        <div><dt><code>type</code></dt><dd>Any native HTML input type. Defaults to <code>text</code>.</dd></div>
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
