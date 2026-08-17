<script setup lang="ts">
import { ref } from 'vue'

import { CDebounceInput, CFormField, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const query = ref('')
const debouncedQuery = ref('')
const debounceCount = ref(0)
const smallValue = ref('')
const largeValue = ref('')
const invalidValue = ref('')

function handleDebounce(value: string) {
  debouncedQuery.value = value
  debounceCount.value += 1
}

const basicUsage = `<script setup>
import { ref } from 'vue'

const query = ref('')

function search(value) {
  // Fetch or filter using the settled value.
  console.log(value)
}
<\/script>

<template>
  <CDebounceInput
    v-model="query"
    :debounce-wait="600"
    placeholder="Search products"
    @debounce="search"
  />
</template>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Debounce Input</h1></div>
      <p>
        <code>CDebounceInput</code> binds its value immediately like <code>CInput</code>, then emits a
        separate <code>debounce</code> event after the user stops typing.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Immediate value, delayed action</h2>
      <p>
        <code>v-model</code> updates on every input event. After no new input occurs for
        <code>debounce-wait</code> milliseconds, <code>@debounce</code> emits the latest string. Use the
        model for current UI state and the event for heavier work such as searching or filtering.
      </p>
      <div class="preview">
        <CFormField label="Product search" hint="The debounce event waits for 600ms">
          <CDebounceInput
            v-model="query"
            :debounce-wait="600"
            placeholder="Search products"
            @debounce="handleDebounce"
          />
        </CFormField>
        <div class="result-list">
          <span>Current model: <code>{{ query || '(empty)' }}</code></span>
          <span>Last debounced value: <code>{{ debouncedQuery || '(empty)' }}</code></span>
          <span>Debounce events: {{ debounceCount }}</span>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Behavior</h2>
      <p>
        Each new keystroke restarts the timer. A wait of <code>0</code> emits immediately, and a
        negative wait is treated as zero. Unfinished IME composition does not trigger the debounce
        event; the timer starts when composition finishes.
      </p>
      <p>
        Changing <code>model-value</code> from application code updates the input normally but does
        not emit <code>@debounce</code>. The event represents user input rather than every possible
        model change.
      </p>
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <p>
        The component accepts the same sizing, validation, and native input attributes as
        <code>CInput</code>.
      </p>
      <div class="preview">
        <CFormField label="Small">
          <CDebounceInput v-model="smallValue" size="small" placeholder="Small" />
        </CFormField>
        <CFormField label="Large">
          <CDebounceInput v-model="largeValue" size="large" placeholder="Large" />
        </CFormField>
        <CFormField label="Disabled">
          <CDebounceInput disabled model-value="Cannot edit" />
        </CFormField>
        <CFormField label="Read-only">
          <CDebounceInput readonly model-value="Read only" />
        </CFormField>
        <CFormField label="Invalid">
          <CDebounceInput v-model="invalidValue" invalid placeholder="Invalid value" />
        </CFormField>
      </div>
    </section>

    <section class="section">
      <h2>Properties and events</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>The current string value. It updates immediately through <code>v-model</code>.</dd></div>
        <div><dt><code>debounce-wait</code></dt><dd>Idle time before <code>@debounce</code>, in milliseconds. Defaults to <code>300</code>.</dd></div>
        <div><dt><code>type</code></dt><dd>Native HTML input type. Defaults to <code>text</code>.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code>, <code>readonly</code>, <code>required</code>, <code>invalid</code></dt><dd>The same form states supported by <code>CInput</code>.</dd></div>
        <div><dt><code>@update:model-value</code></dt><dd>Emitted immediately whenever the user changes the input.</dd></div>
        <div><dt><code>@debounce</code></dt><dd>Emitted with the latest string after the configured idle period.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./form-demo.scss"></style>

<style scoped lang="scss">
.result-list {
  display: grid;
  gap: 5px;
}
</style>
