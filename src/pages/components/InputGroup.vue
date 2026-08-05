<script setup lang="ts">
import { ref } from 'vue'

import {
  CButton,
  CFormField,
  CIcon,
  CInput,
  CInputAddon,
  CInputGroup,
  CNumberInput,
  CPassword,
  CSeparator,
} from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const search = ref('')
const password = ref('warehouse-2026')
const price = ref<number | null>(49.95)
const lastAction = ref('No action selected')

const searchUsage = `<CFormField label="Search">
  <CInputGroup>
    <CInputAddon><CIcon>⌕</CIcon></CInputAddon>
    <CInput v-model="search" />
    <CButton variant="primary">Search</CButton>
  </CInputGroup>
</CFormField>`

const compositionUsage = `<CInputGroup>
  <CPassword v-model="password" />
  <CButton>Generate</CButton>
</CInputGroup>

<CInputGroup>
  <CInputAddon>$</CInputAddon>
  <CNumberInput v-model="price" :controls="false" />
  <CInputAddon>USD</CInputAddon>
</CInputGroup>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Input Group</h1></div>
      <p>
        <code>CInputGroup</code> joins inputs, addons, and buttons into one compact control without
        adding component-specific prefix and suffix props.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Icon and action</h2>
      <p>
        Place children in visual order. Use <code>CInputAddon</code> for non-interactive icons or
        text, and a real <code>CButton</code> for actions.
      </p>
      <div class="preview">
        <CFormField label="Search records">
          <CInputGroup>
            <CInputAddon><CIcon>⌕</CIcon></CInputAddon>
            <CInput v-model="search" placeholder="Order or customer" />
            <CButton variant="primary" @click="lastAction = `Searched for ${search || 'everything'}`">
              Search
            </CButton>
          </CInputGroup>
        </CFormField>
        <span class="status" aria-live="polite">{{ lastAction }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="searchUsage" />
    </section>

    <section class="section">
      <h2>Compound controls</h2>
      <p>
        Password and number inputs keep their own internal controls. Additional addons and buttons
        are placed outside them, and the group joins all outer borders automatically.
      </p>
      <div class="preview">
        <CFormField label="Password">
          <CInputGroup>
            <CPassword v-model="password" />
            <CButton @click="lastAction = 'Generated password'">Generate</CButton>
          </CInputGroup>
        </CFormField>

        <CFormField label="Unit price">
          <CInputGroup>
            <CInputAddon>$</CInputAddon>
            <CNumberInput v-model="price" :controls="false" />
            <CInputAddon>USD</CInputAddon>
          </CInputGroup>
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="compositionUsage" />
    </section>

    <section class="section">
      <h2>Responsibilities</h2>
      <dl class="property-list">
        <div>
          <dt><code>CInputGroup</code></dt>
          <dd>Arranges children horizontally, joins adjacent borders, and preserves focus stacking.</dd>
        </div>
        <div>
          <dt><code>CInputAddon</code></dt>
          <dd>Displays non-interactive text, units, or icons with a bordered neutral background.</dd>
        </div>
        <div>
          <dt>Child order</dt>
          <dd>Determines whether an addon or button appears before or after the input.</dd>
        </div>
        <div>
          <dt>Sizes</dt>
          <dd>Set the same size on the input, addon, and button when using a non-default size.</dd>
        </div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
