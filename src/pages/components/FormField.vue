<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CInput, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const customer = ref('Contoso Ltd.')
const email = ref('invalid-address')

const basicUsage = `<CFormField
  label="Customer"
  hint="Enter the registered company name."
  required
>
  <CInput v-model="customer" />
</CFormField>`

const errorUsage = `<CFormField
  label="Email"
  error="Enter a valid email address."
>
  <CInput v-model="email" type="email" />
</CFormField>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Form Field</h1></div>
      <p>
        <code>CFormField</code> consistently connects a label, hint, validation message, and
        required state to a nested Concise UI form control.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Label and hint</h2>
      <p>
        The field generates an input ID and accessible description automatically. Use
        <code>for</code> only when a specific ID is required.
      </p>
      <div class="preview">
        <CFormField label="Customer" hint="Enter the registered company name." required>
          <CInput v-model="customer" />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Validation message</h2>
      <p>
        Providing <code>error</code> marks the nested control invalid, connects the message with
        <code>aria-describedby</code>, and announces it as an alert.
      </p>
      <div class="preview">
        <CFormField label="Email" error="Enter a valid email address.">
          <CInput v-model="email" type="email" />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="errorUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>label</code></dt><dd>Text displayed above the control.</dd></div>
        <div><dt><code>for</code></dt><dd>Optional control ID; generated automatically by default.</dd></div>
        <div><dt><code>hint</code></dt><dd>Supporting text connected to the control.</dd></div>
        <div><dt><code>error</code></dt><dd>Validation message that also marks the field invalid.</dd></div>
        <div><dt><code>required</code></dt><dd>Shows a required marker and marks the nested control required.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Marks the nested control invalid without requiring an error string.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
