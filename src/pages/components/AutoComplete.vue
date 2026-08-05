<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { CAutoComplete, CFormField, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const cities = [
  'Bandung',
  'Bekasi',
  'Bogor',
  'Denpasar',
  'Jakarta',
  'Makassar',
  'Medan',
  'Semarang',
  'Surabaya',
  'Yogyakarta',
]

const destination = ref('Jakarta')
const department = ref('')
const smallValue = ref('Bandung')
const largeValue = ref('Surabaya')
const remoteCity = ref('')
const remoteOptions = ref<string[]>([])
const remoteLoading = ref(false)
let remoteTimer: ReturnType<typeof setTimeout> | undefined

function searchCities(query: string) {
  if (remoteTimer !== undefined) clearTimeout(remoteTimer)
  if (!query) {
    remoteOptions.value = []
    remoteLoading.value = false
    return
  }

  remoteLoading.value = true
  remoteTimer = setTimeout(() => {
    remoteOptions.value = cities.filter((city) =>
      city.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    )
    remoteLoading.value = false
  }, 600)
}

onBeforeUnmount(() => {
  if (remoteTimer !== undefined) clearTimeout(remoteTimer)
})

const basicJavaScript = `const cities = [
  'Bandung',
  'Bekasi',
  'Bogor',
  'Denpasar',
  'Jakarta',
  'Makassar',
  'Medan',
  'Semarang',
  'Surabaya',
  'Yogyakarta',
]

const destination = ref('Jakarta')`

const basicUsage = `<CAutoComplete
  v-model="destination"
  :options="cities"
  placeholder="Enter a destination"
  clearable
/>`

const arbitraryUsage = `<CAutoComplete
  v-model="department"
  :options="['Sales', 'Finance', 'Operations']"
  placeholder="Choose or enter a department"
/>

<p>Current value: {{ department }}</p>`

const remoteJavaScript = `const suggestions = ref([])
const loading = ref(false)
let controller

async function searchCustomers(query) {
  controller?.abort()

  if (!query) {
    suggestions.value = []
    loading.value = false
    return
  }

  const request = new AbortController()
  controller = request
  loading.value = true

  try {
    const response = await fetch(
      \`/api/customers?q=\${encodeURIComponent(query)}\`,
      { signal: request.signal },
    )
    suggestions.value = await response.json()
  } catch (error) {
    if (error.name !== 'AbortError') throw error
  } finally {
    if (controller === request) loading.value = false
  }
}`

const remoteUsage = `<CAutoComplete
  v-model="customer"
  :options="suggestions"
  :loading="loading"
  :debounce-wait="350"
  :min-search-length="2"
  @search="searchCustomers"
/>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Auto Complete</h1></div>
      <p>
        <code>CAutoComplete</code> is a text input with string suggestions. Users may select a
        suggestion or keep any arbitrary text they enter.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>String suggestions</h2>
      <p>
        Pass a simple array of strings through <code>options</code>. Matching is case-insensitive
        and checks the entire string. Because the options have no object mapping, the API does not
        need <code>option-label</code>, <code>option-value</code>, or <code>option-key</code>.
      </p>
      <div class="preview">
        <CFormField label="Destination">
          <CAutoComplete
            v-model="destination"
            :options="cities"
            placeholder="Enter a destination"
            clearable
          />
        </CFormField>
        <span>Current value: {{ destination }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Arbitrary values</h2>
      <p>
        Typing updates <code>v-model</code> immediately, even when the text is absent from
        <code>options</code>. Suggestions assist entry but do not constrain it. The
        <code>select</code> event is emitted only when a listed suggestion is explicitly chosen.
      </p>
      <div class="preview">
        <CFormField label="Department" hint="You may enter a department not shown in the list.">
          <CAutoComplete
            v-model="department"
            :options="['Sales', 'Finance', 'Operations']"
            placeholder="Choose or enter a department"
          />
        </CFormField>
        <span>Current value: {{ department }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="arbitraryUsage" />
    </section>

    <section class="section">
      <h2>Keyboard usage</h2>
      <p>
        Use Arrow Up or Arrow Down to move through suggestions, Enter to accept the highlighted
        suggestion, and Escape to close the list without changing the current text. Tab keeps the
        arbitrary value and moves focus normally.
      </p>
    </section>

    <section class="section">
      <h2>Remote suggestions</h2>
      <p>
        The component does not make network requests itself. After the user pauses typing,
        <code>search</code> emits the trimmed query and the parent replaces <code>options</code>.
        <code>debounce-wait</code> controls that pause, while <code>min-search-length</code> prevents
        short queries from starting a search.
      </p>
      <p>
        When the query drops below the minimum, an empty search is emitted immediately so the
        parent can cancel work and clear stale results. Set <code>loading</code> while awaiting the
        response; users can continue typing while the spinner is visible.
      </p>
      <div class="preview">
        <CFormField label="Remote city search" hint="Type at least two characters.">
          <CAutoComplete
            v-model="remoteCity"
            :options="remoteOptions"
            :loading="remoteLoading"
            :debounce-wait="350"
            :min-search-length="2"
            placeholder="Search cities"
            clearable
            @search="searchCities"
          />
        </CFormField>
        <span>Current value: {{ remoteCity }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="remoteJavaScript" language="javascript" />
      <CCodeBlock class="code-sample" :code="remoteUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <div class="preview">
        <CFormField label="Small (26px)">
          <CAutoComplete v-model="smallValue" :options="cities" size="small" />
        </CFormField>
        <CFormField label="Large (34px)">
          <CAutoComplete v-model="largeValue" :options="cities" size="large" />
        </CFormField>
        <CFormField label="Disabled">
          <CAutoComplete model-value="Jakarta" :options="cities" disabled />
        </CFormField>
        <CFormField label="Invalid">
          <CAutoComplete model-value="Unknown office" :options="cities" invalid />
        </CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Properties and events</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>Current string, including values absent from the suggestion list.</dd></div>
        <div><dt><code>options</code></dt><dd>Array of strings used as suggestions.</dd></div>
        <div><dt><code>debounce-wait</code></dt><dd>Milliseconds to wait before emitting a non-empty <code>search</code>. Defaults to <code>300</code>.</dd></div>
        <div><dt><code>loading</code></dt><dd>Shows remote loading feedback without disabling text entry.</dd></div>
        <div><dt><code>min-search-length</code></dt><dd>Minimum trimmed query length required before emitting a non-empty search.</dd></div>
        <div><dt><code>clearable</code></dt><dd>Adds a compact button that clears the value to an empty string.</dd></div>
        <div><dt><code>placeholder</code></dt><dd>Text displayed while the value is empty.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables input and focus.</dd></div>
        <div><dt><code>required</code></dt><dd>Applies native required validation.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
        <div><dt><code>search</code></dt><dd>Emitted with the debounced query, or immediately with an empty string when below the minimum.</dd></div>
        <div><dt><code>select</code></dt><dd>Emitted with the string when a suggestion is explicitly selected.</dd></div>
        <div><dt><code>clear</code></dt><dd>Emitted after the clear button resets the value.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>
