<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CNumberInput, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const quantity = ref<number | null>(12)
const price = ref<number | null>(49.95)
const smallValue = ref<number | null>(10)
const largeValue = ref<number | null>(10)
const invalidValue = ref<number | null>(10)

const modelUsage = `<script setup lang="ts">
import { ref } from 'vue'

const quantity = ref<number | null>(10)
<\/script>

<template>
  <CNumberInput v-model="quantity" />

  <!-- Equivalent explicit binding -->
  <CNumberInput
    :model-value="quantity"
    @update:model-value="quantity = $event"
  />
</template>`

const basicUsage = `<CFormField label="Quantity" required>
  <CNumberInput
    v-model="quantity"
    :min="0"
    :max="100"
    :step="1"
  />
</CFormField>`

const decimalUsage = `<CNumberInput v-model="price" :min="0" :step="0.05" />
<CNumberInput v-model="quantity" :controls="false" />`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Number Input</h1></div>
      <p>
        <code>CNumberInput</code> provides numeric <code>v-model</code> values, native keyboard
        entry, and optional compact step controls.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Value binding</h2>
      <p>
        The model is a <code>number</code> or <code>null</code>. An empty input emits
        <code>null</code>. Use <code>v-model</code> for an interactive control so typed values and
        step-button changes are written back to application state.
      </p>
      <p>
        Passing only <code>:model-value</code> is a one-way binding. In that case, handle
        <code>@update:model-value</code> yourself; otherwise the component can emit changes but the
        displayed model remains unchanged.
      </p>
      <CCodeBlock class="code-sample" :code="modelUsage" />
    </section>

    <section class="section">
      <h2>Constraints and steps</h2>
      <p>
        Use <code>min</code>, <code>max</code>, and <code>step</code> to describe the permitted range.
        The − and + buttons change the current value by <code>step</code> and clamp their result to
        the range. Manual input retains native browser validation and is not forcibly clamped while
        the user is typing.
      </p>
      <div class="preview">
        <CFormField label="Quantity" hint="Allowed range: 0–100" required>
          <CNumberInput v-model="quantity" :min="0" :max="100" :step="1" />
        </CFormField>
        <span>Current value: {{ quantity ?? 'empty' }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Decimals and controls</h2>
      <p>
        Decimal steps are normalized to avoid common floating-point artifacts. Set
        <code>:controls="false"</code> to remove the Concise UI − and + buttons and use the browser's
        native numeric control.
      </p>
      <div class="preview">
        <CFormField label="Unit price"><CNumberInput v-model="price" :min="0" :step="0.05" /></CFormField>
        <CFormField label="Without controls"><CNumberInput v-model="quantity" :controls="false" /></CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="decimalUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <p>
        Size changes the input and both step buttons together. Interactive examples use
        <code>v-model</code>; disabled and read-only controls intentionally prevent step changes.
      </p>
      <div class="preview">
        <CFormField label="Small (26px)">
          <CNumberInput v-model="smallValue" size="small" />
        </CFormField>
        <CFormField label="Large (34px)">
          <CNumberInput v-model="largeValue" size="large" />
        </CFormField>
        <CFormField label="Disabled">
          <CNumberInput disabled :model-value="10" />
        </CFormField>
        <CFormField label="Read-only">
          <CNumberInput readonly :model-value="10" />
        </CFormField>
        <CFormField label="Invalid">
          <CNumberInput v-model="invalidValue" invalid />
        </CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Numeric value or <code>null</code>. Use <code>v-model</code> for two-way binding.</dd></div>
        <div><dt><code>min</code></dt><dd>Optional lower constraint used by native validation and the decrement button.</dd></div>
        <div><dt><code>max</code></dt><dd>Optional upper constraint used by native validation and the increment button.</dd></div>
        <div><dt><code>step</code></dt><dd>Amount added or subtracted by the controls. Must be positive and defaults to <code>1</code>.</dd></div>
        <div><dt><code>controls</code></dt><dd>Shows Concise UI decrement and increment buttons. Defaults to true.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables entry and step controls.</dd></div>
        <div><dt><code>readonly</code></dt><dd>Prevents changes while keeping the input focusable.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
