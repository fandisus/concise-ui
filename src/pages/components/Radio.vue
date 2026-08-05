<script setup lang="ts">
import { ref } from 'vue'

import { CRadio, CSeparator } from '@/index'
import type { CRadioValue } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const shipping = ref<CRadioValue | null>('standard')

const groupUsage = `<fieldset>
  <legend>Shipping method</legend>
  <CRadio v-model="shipping" name="shipping" value="standard">Standard</CRadio>
  <CRadio v-model="shipping" name="shipping" value="express">Express</CRadio>
  <CRadio v-model="shipping" name="shipping" value="pickup">Pickup</CRadio>
</fieldset>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Radio</h1></div>
      <p>
        <code>CRadio</code> represents one mutually exclusive choice. Radios sharing a model and
        native <code>name</code> form a keyboard-accessible group.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Radio group</h2>
      <p>
        Use a native <code>fieldset</code> and <code>legend</code> to give the complete group an
        accessible label. Each radio emits its own <code>value</code> when selected.
      </p>
      <div class="preview">
        <fieldset class="radio-group">
          <legend>Shipping method</legend>
          <CRadio v-model="shipping" name="shipping" value="standard">Standard</CRadio>
          <CRadio v-model="shipping" name="shipping" value="express">Express</CRadio>
          <CRadio v-model="shipping" name="shipping" value="pickup">Pickup</CRadio>
        </fieldset>
        <span>Selected: {{ shipping }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="groupUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <div class="preview">
        <CRadio :model-value="1" :value="1" size="small" name="small-example">Small</CRadio>
        <CRadio :model-value="1" :value="1" size="large" name="large-example">Large</CRadio>
        <CRadio :model-value="false" :value="true" disabled name="disabled-example">Disabled</CRadio>
        <CRadio :model-value="true" :value="true" invalid name="invalid-example">Invalid</CRadio>
      </div>
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Currently selected group value, used by <code>v-model</code>.</dd></div>
        <div><dt><code>value</code></dt><dd>Required value emitted when this radio is selected.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Prevents this option from being selected.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.radio-group {
  display: grid;
  margin: 0;
  padding: 8px 10px 10px;
  gap: 7px;
  border: 1px solid var(--c-border-color, #d5d9df);

  legend {
    padding: 0 4px;
    font-weight: 600;
  }
}
</style>
