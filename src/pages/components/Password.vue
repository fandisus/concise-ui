<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CPassword, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const password = ref('warehouse-2026')
const passwordVisible = ref(false)

const basicUsage = `<CFormField label="Password" required>
  <CPassword v-model="password" autocomplete="current-password" />
</CFormField>`
const visibilityUsage = `<CPassword
  v-model="password"
  v-model:visible="passwordVisible"
/>

<CPassword v-model="password" :revealable="false" />`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Password</h1></div>
      <p>
        <code>CPassword</code> combines a native password input with an optional accessible
        visibility control. Password values remain ordinary strings managed through
        <code>v-model</code>.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Basic usage</h2>
      <div class="preview">
        <CFormField label="Password" required>
          <CPassword v-model="password" autocomplete="current-password" />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Visibility control</h2>
      <p>
        Visibility is managed internally by default. Use <code>v-model:visible</code> when the
        application needs to observe or control it, or disable the toggle with
        <code>:revealable="false"</code>.
      </p>
      <div class="preview">
        <CPassword v-model="password" v-model:visible="passwordVisible" aria-label="Controlled password" />
        <CPassword v-model="password" :revealable="false" aria-label="Password without reveal button" />
      </div>
      <CCodeBlock class="code-sample" :code="visibilityUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <div class="preview">
        <CPassword size="small" model-value="secret" aria-label="Small password" />
        <CPassword size="large" model-value="secret" aria-label="Large password" />
        <CPassword disabled model-value="secret" aria-label="Disabled password" />
        <CPassword invalid model-value="secret" aria-label="Invalid password" />
      </div>
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Password string used by <code>v-model</code>.</dd></div>
        <div><dt><code>visible</code></dt><dd>Optional controlled visibility state used by <code>v-model:visible</code>.</dd></div>
        <div><dt><code>revealable</code></dt><dd>Shows the visibility button when true. Defaults to true.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables the input and visibility button.</dd></div>
        <div><dt><code>readonly</code></dt><dd>Prevents editing while allowing visibility changes.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
