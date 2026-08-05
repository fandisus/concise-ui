<script setup lang="ts">
import { ref } from 'vue'

import { CCheckbox, CFormField, CSeparator } from '@/index'
import type { CCheckboxValue } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const enabled = ref<CCheckboxValue | CCheckboxValue[]>(true)
const permissions = ref<CCheckboxValue | CCheckboxValue[]>(['read', 'reports'])
const accepted = ref<CCheckboxValue | CCheckboxValue[]>(false)
const smallChecked = ref<CCheckboxValue | CCheckboxValue[]>(true)
const largeChecked = ref<CCheckboxValue | CCheckboxValue[]>(true)
const approval = ref<boolean | null>(false)

const basicUsage = `<CCheckbox v-model="enabled">Enable notifications</CCheckbox>`
const groupUsage = `<CCheckbox v-model="permissions" value="read">Read</CCheckbox>
<CCheckbox v-model="permissions" value="write">Write</CCheckbox>
<CCheckbox v-model="permissions" value="reports">Reports</CCheckbox>`
const valueUsage = `<CCheckbox
  v-model="status"
  true-value="enabled"
  false-value="disabled"
>
  Account enabled
</CCheckbox>`
const threeStateUsage = `<script setup lang="ts">
import { ref } from 'vue'

const approval = ref<boolean | null>(false)
<\/script>

<template>
  <CCheckbox v-model="approval" three-state>
    Approval state
  </CCheckbox>
</template>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Checkbox</h1></div>
      <p>
        <code>CCheckbox</code> supports boolean choices, custom checked values, array groups, and
        indeterminate presentation while retaining a native checkbox input.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Boolean value</h2>
      <div class="preview">
        <CCheckbox v-model="enabled">Enable notifications</CCheckbox>
        <span>Model: {{ enabled }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Array group</h2>
      <p>
        When the model is an array, each checkbox adds or removes its <code>value</code>. This is
        useful for permissions and independent feature selections.
      </p>
      <div class="preview">
        <CCheckbox v-model="permissions" value="read">Read</CCheckbox>
        <CCheckbox v-model="permissions" value="write">Write</CCheckbox>
        <CCheckbox v-model="permissions" value="reports">Reports</CCheckbox>
        <span>Selected: {{ permissions }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="groupUsage" />
    </section>

    <section class="section">
      <h2>States and sizes</h2>
      <div class="preview">
        <CCheckbox v-model="smallChecked" size="small">Small</CCheckbox>
        <CCheckbox v-model="largeChecked" size="large">Large</CCheckbox>
        <CCheckbox indeterminate>Partially selected</CCheckbox>
        <CCheckbox disabled>Disabled</CCheckbox>
        <CFormField error="You must accept the policy.">
          <CCheckbox v-model="accepted">Accept policy</CCheckbox>
        </CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Custom values</h2>
      <p>
        <code>true-value</code> and <code>false-value</code> replace the default boolean values for
        scalar models.
      </p>
      <CCodeBlock class="code-sample" :code="valueUsage" />
    </section>

    <section class="section">
      <h2>Three-state checkbox</h2>
      <p>
        Add <code>three-state</code> to cycle through unchecked, checked, and indeterminate values.
        The model sequence is <code>false → true → null → false</code>, where <code>null</code>
        represents the indeterminate state. Three-state behavior applies to scalar models, not
        array groups.
      </p>
      <div class="preview">
        <CCheckbox v-model="approval" three-state>Approval state</CCheckbox>
        <span>Model: {{ approval === null ? 'null (indeterminate)' : approval }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="threeStateUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>A scalar checkbox value or an array used by <code>v-model</code>.</dd></div>
        <div><dt><code>value</code></dt><dd>Value added to or removed from an array model.</dd></div>
        <div><dt><code>true-value</code></dt><dd>Scalar value emitted when checked. Defaults to true.</dd></div>
        <div><dt><code>false-value</code></dt><dd>Scalar value emitted when unchecked. Defaults to false.</dd></div>
        <div><dt><code>indeterminate</code></dt><dd>Displays a mixed state without changing the model by itself.</dd></div>
        <div><dt><code>three-state</code></dt><dd>Cycles a scalar model through false, true, and null.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables interaction.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
