<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { CFormField, CSelect, CSeparator } from '@/index'
import type { CSelectOption, CSelectValue } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const warehouse = ref<CSelectValue | null>('north')
const priority = ref<CSelectValue | null>(null)
const status = ref<CSelectValue | null>('active')

const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
]
const selectedProduct = ref<(typeof products)[number] | null>(products[0] ?? null)
const selectedProductId = ref<number | null>(1)
const filteredProduct = ref<(typeof products)[number] | null>(null)
const remoteProductId = ref<number | null>(1)
const remoteProducts = ref([...products])
const remoteLoading = ref(false)
let remoteTimer: ReturnType<typeof setTimeout> | undefined

function searchProducts(query: string) {
  if (remoteTimer !== undefined) clearTimeout(remoteTimer)
  if (!query) {
    remoteProducts.value = []
    remoteLoading.value = false
    return
  }

  remoteLoading.value = true
  remoteTimer = setTimeout(() => {
    remoteProducts.value = products.filter((product) =>
      product.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    )
    remoteLoading.value = false
  }, 600)
}

onBeforeUnmount(() => {
  if (remoteTimer !== undefined) clearTimeout(remoteTimer)
})

const warehouses: CSelectOption[] = [
  { label: 'North warehouse', value: 'north' },
  { label: 'Central warehouse', value: 'central' },
  { label: 'South warehouse', value: 'south', disabled: true },
]

const dataJavaScript = `const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
]

const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]`

const statuses: CSelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const dataUsage = `<CSelect
  v-model="selectedProductId"
  :options="products"
  option-label="name"
  option-value="id"
  option-key="id"
/>

<!-- label and value are interpreted automatically -->
<CSelect
  v-model="status"
  :options="statuses"
/>`

const slotUsage = `<CSelect v-model="priority" placeholder="Select priority">
  <option value="normal">Normal</option>
  <option value="urgent">Urgent</option>
</CSelect>`

const objectJavaScript = `const products = [
  { id: 1, name: 'Book', code: 'BOO' },
  { id: 2, name: 'Stove', code: 'STV' },
]

const selectedProduct = ref(null)`

const objectUsage = `<CSelect
  v-model="selectedProduct"
  :options="products"
  option-label="name"
  option-key="id"
  clearable
/>`

const filterableUsage = `<CSelect
  v-model="filteredProduct"
  :options="products"
  option-label="name"
  option-key="id"
  placeholder="Search products"
  filterable
  clearable
/>`

const remoteUsage = `<CSelect
  v-model="selectedProductId"
  :options="products"
  option-label="name"
  option-value="id"
  option-key="id"
  filterable
  :loading="loading"
  :debounce-wait="350"
  :min-search-length="2"
  @search="searchProducts"
/>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Select</h1></div>
      <p>
        <code>CSelect</code> is a single-value selection control. It uses a native select by
        default and can become a searchable combobox for longer data-driven lists.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Object options</h2>
      <p>
        Pass raw objects with <code>option-label</code> to choose the displayed field. When
        <code>option-value</code> is omitted, selecting an option binds the complete object. Use
        <code>option-key</code> to provide stable rendering identity. Add <code>clearable</code> when
        users should be able to return the model to <code>null</code>.
      </p>
      <div class="preview">
        <CFormField label="Product">
          <CSelect
            v-model="selectedProduct"
            :options="products"
            option-label="name"
            option-key="id"
            clearable
          />
        </CFormField>
        <span>Selected object: {{ selectedProduct }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="objectJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="objectUsage" />
    </section>

    <section class="section">
      <h2>Filter existing options</h2>
      <p>
        Add <code>filterable</code> when a long list should be searchable. Typing narrows the
        available options but does not create a new value: <code>v-model</code> changes only when
        the user selects an existing option. Use <code>CAutoComplete</code> when arbitrary
        user-entered values should be allowed.
      </p>
      <p>
        This mode works with data-driven <code>options</code>. Use Arrow Up or Arrow Down to move,
        Enter to select, and Escape to discard the current search and restore the selected label.
      </p>
      <div class="preview">
        <CFormField label="Product search">
          <CSelect
            v-model="filteredProduct"
            :options="products"
            option-label="name"
            option-key="id"
            placeholder="Search products"
            filterable
            clearable
          />
        </CFormField>
        <span>Selected object: {{ filteredProduct }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="filterableUsage" />
    </section>

    <section class="section">
      <h2>Remote options and cached selection</h2>
      <p>
        In filterable mode, <code>search</code> emits the trimmed query after
        <code>debounce-wait</code>. The parent performs the request and replaces
        <code>options</code>. Use <code>min-search-length</code> to avoid short requests and set
        <code>loading</code> while awaiting the response.
      </p>
      <p>
        Searching never changes <code>v-model</code>. The last resolved label is cached with its
        selected value, so replacing the options—even with results that omit the selected
        record—does not make the committed selection disappear. Escape or blur restores that
        cached label. An initially loaded primitive value must still have its matching option
        supplied at least once so its label can be learned.
      </p>
      <div class="preview">
        <CFormField label="Remote product" hint="Select Book, then search for Stove and press Escape.">
          <CSelect
            v-model="remoteProductId"
            :options="remoteProducts"
            option-label="name"
            option-value="id"
            option-key="id"
            placeholder="Search products"
            filterable
            clearable
            :loading="remoteLoading"
            :debounce-wait="350"
            :min-search-length="2"
            @search="searchProducts"
          />
        </CFormField>
        <span>Selected ID: {{ remoteProductId }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="remoteUsage" />
    </section>

    <section class="section">
      <h2>Data-driven options</h2>
      <p>
        For raw objects, <code>option-label</code> selects the text shown to the user and
        <code>option-value</code> selects the field written to <code>v-model</code>. Both accept a
        property path or function. If <code>option-value</code> is omitted, the complete object is
        used as shown above.
      </p>
      <p>
        When every option already has <code>label</code> and <code>value</code> fields,
        <code>CSelect</code> interprets those fields automatically—no accessor props are needed.
        These structured options can also include <code>disabled</code> and <code>hidden</code>.
      </p>
      <div class="preview">
        <CFormField label="Product ID">
          <CSelect
            v-model="selectedProductId"
            :options="products"
            option-label="name"
            option-value="id"
            option-key="id"
          />
        </CFormField>
        <span>Mapped value: {{ selectedProductId }}</span>

        <CFormField label="Status">
          <CSelect v-model="status" :options="statuses" />
        </CFormField>
        <span>Automatic value: {{ status }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="dataJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="dataUsage" />
    </section>

    <section class="section">
      <h2>Native option slot</h2>
      <p>
        Use the default slot when native <code>option</code> or <code>optgroup</code> markup is more
        convenient. Data-driven and slotted options can also be combined. Slotted options are
        available in the default native mode; <code>filterable</code> reads from the
        <code>options</code> prop instead.
      </p>
      <div class="preview">
        <CFormField label="Priority">
          <CSelect v-model="priority" placeholder="Select priority">
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </CSelect>
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="slotUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <div class="preview">
        <CFormField label="Small (26px)"><CSelect v-model="warehouse" :options="warehouses" size="small" /></CFormField>
        <CFormField label="Large (34px)"><CSelect v-model="warehouse" :options="warehouses" size="large" /></CFormField>
        <CFormField label="Disabled"><CSelect :model-value="'north'" :options="warehouses" disabled /></CFormField>
        <CFormField label="Invalid"><CSelect v-model="warehouse" :options="warehouses" invalid /></CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Selected primitive, object, or <code>null</code>, used by <code>v-model</code>.</dd></div>
        <div><dt><code>options</code></dt><dd>Array of <code>{ label, value }</code> records or raw objects.</dd></div>
        <div><dt><code>option-label</code></dt><dd>Property path or function used to label raw object options.</dd></div>
        <div><dt><code>option-value</code></dt><dd>Property path or function selecting the bound value. Omit it to bind the complete object.</dd></div>
        <div><dt><code>option-key</code></dt><dd>Property path or function providing stable rendering and object-selection identity.</dd></div>
        <div><dt><code>clearable</code></dt><dd>Shows a compact × button that clears the selected model to <code>null</code>.</dd></div>
        <div><dt><code>filterable</code></dt><dd>Replaces the native select with a searchable, existing-options-only combobox.</dd></div>
        <div><dt><code>debounce-wait</code></dt><dd>Milliseconds to wait before emitting a non-empty <code>search</code>. Defaults to <code>300</code>.</dd></div>
        <div><dt><code>loading</code></dt><dd>Shows loading feedback in filterable mode without changing the selection.</dd></div>
        <div><dt><code>min-search-length</code></dt><dd>Minimum trimmed query length required before emitting a non-empty search.</dd></div>
        <div><dt><code>placeholder</code></dt><dd>Disabled initial option displayed while the model is null.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables selection and focus.</dd></div>
        <div><dt><code>required</code></dt><dd>Requires an actual option selection, including in filterable mode.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
        <div><dt><code>search</code></dt><dd>Emitted with the debounced query, or immediately with an empty string when below the minimum.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
