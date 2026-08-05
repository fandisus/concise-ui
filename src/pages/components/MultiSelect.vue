<script setup lang="ts">
import { ref } from 'vue'

import { CFormField, CMultiSelect, CSeparator } from '@/index'
import type { CMultiSelectModelValue, CSelectOption } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
  { id: 3, name: 'Desk lamp', code: 'LMP' },
  { id: 4, name: 'Storage box', code: 'BOX' },
]

const selectedProducts = ref<(typeof products)[number][]>([products[0]!])
const selectedProductIds = ref<CMultiSelectModelValue>([1, 3])
const selectedRegions = ref<CMultiSelectModelValue>(['north', 'central'])
const compactSelection = ref<CMultiSelectModelValue>(['north'])

const regions: CSelectOption[] = [
  { label: 'North region', value: 'north' },
  { label: 'Central region', value: 'central' },
  { label: 'South region', value: 'south' },
  { label: 'Archived region', value: 'archived', disabled: true },
]

const objectJavaScript = `const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
  { id: 3, name: 'Desk lamp', code: 'LMP' },
]

const selectedProducts = ref([products[0]])`

const objectUsage = `<CMultiSelect
  v-model="selectedProducts"
  :options="products"
  option-label="name"
  option-key="id"
  placeholder="Select products"
  clearable
/>`

const mappedUsage = `<CMultiSelect
  v-model="selectedProductIds"
  :options="products"
  option-label="name"
  option-value="id"
  option-key="id"
/>

<!-- label and value are interpreted automatically -->
<CMultiSelect v-model="selectedRegions" :options="regions" />`

const filterableUsage = `<CMultiSelect
  v-model="selectedProducts"
  :options="products"
  option-label="name"
  option-key="id"
  placeholder="Search products"
  filterable
  clearable
/>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Multi Select</h1></div>
      <p>
        <code>CMultiSelect</code> selects zero or more existing options and writes them to an
        array. Its popup stays open while users toggle several items.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Object options</h2>
      <p>
        Raw objects follow the same mapping rules as <code>CSelect</code>. Set
        <code>option-label</code> for the displayed field and omit <code>option-value</code> to bind
        the complete selected objects. <code>option-key</code> also lets the component match object
        selections by a stable field such as <code>id</code>. <code>CMultiSelect</code> always emits
        a new array instead of mutating the array supplied by the parent.
      </p>
      <div class="preview">
        <CFormField label="Products">
          <CMultiSelect
            v-model="selectedProducts"
            :options="products"
            option-label="name"
            option-key="id"
            placeholder="Select products"
            clearable
          />
        </CFormField>
        <span>Selected objects: {{ selectedProducts }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="objectJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="objectUsage" />
    </section>

    <section class="section">
      <h2>Mapped and structured options</h2>
      <p>
        Add <code>option-value</code> when the model should contain one field, such as an ID. If
        options already use the standard <code>label</code> and <code>value</code> fields, they are
        interpreted automatically and may also include <code>disabled</code> or <code>hidden</code>.
      </p>
      <div class="preview">
        <CFormField label="Product IDs">
          <CMultiSelect
            v-model="selectedProductIds"
            :options="products"
            option-label="name"
            option-value="id"
            option-key="id"
          />
        </CFormField>
        <span>Selected IDs: {{ selectedProductIds }}</span>

        <CFormField label="Regions">
          <CMultiSelect v-model="selectedRegions" :options="regions" />
        </CFormField>
        <span>Selected values: {{ selectedRegions }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="mappedUsage" />
    </section>

    <section class="section">
      <h2>Filter and clear</h2>
      <p>
        <code>filterable</code> lets users narrow the existing options without accepting arbitrary
        text. Selecting a result toggles it and keeps the list open. <code>clearable</code> adds a
        compact button that replaces the model with an empty array.
      </p>
      <p>
        Use Arrow Up or Arrow Down to move, Enter to toggle, and Escape to close the popup. In the
        non-filterable control, Space also toggles the highlighted option.
      </p>
      <div class="preview">
        <CFormField label="Search products">
          <CMultiSelect
            v-model="selectedProducts"
            :options="products"
            option-label="name"
            option-key="id"
            placeholder="Search products"
            filterable
            clearable
          />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="filterableUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <div class="preview">
        <CFormField label="Small (26px)">
          <CMultiSelect v-model="compactSelection" :options="regions" size="small" />
        </CFormField>
        <CFormField label="Large (34px)">
          <CMultiSelect v-model="compactSelection" :options="regions" size="large" />
        </CFormField>
        <CFormField label="Disabled">
          <CMultiSelect :model-value="['north']" :options="regions" disabled />
        </CFormField>
        <CFormField label="Invalid">
          <CMultiSelect v-model="compactSelection" :options="regions" invalid />
        </CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Array of selected primitives or objects, used by <code>v-model</code>.</dd></div>
        <div><dt><code>options</code></dt><dd>Array of <code>{ label, value }</code> records or raw objects.</dd></div>
        <div><dt><code>option-label</code></dt><dd>Property path or function used to label raw object options.</dd></div>
        <div><dt><code>option-value</code></dt><dd>Property path or function selecting each bound value. Omit it to bind complete objects.</dd></div>
        <div><dt><code>option-key</code></dt><dd>Property path or function providing stable rendering and object-selection identity.</dd></div>
        <div><dt><code>filterable</code></dt><dd>Adds existing-option filtering to the control.</dd></div>
        <div><dt><code>clearable</code></dt><dd>Adds a button that clears all selections to an empty array.</dd></div>
        <div><dt><code>placeholder</code></dt><dd>Text displayed while no values are selected.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables interaction and focus.</dd></div>
        <div><dt><code>required</code></dt><dd>Marks the control as requiring at least one selection for accessibility.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
