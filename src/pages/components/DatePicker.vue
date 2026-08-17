<script setup lang="ts">
import { computed, ref } from 'vue'

import { CDatePicker, CFormField, CSeparator } from '@/index'
import type { CDatePickerModelValue } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const invoiceDate = ref<CDatePickerModelValue>('2026-08-17')
const reportingPeriod = ref<CDatePickerModelValue>(['2026-08-01', '2026-08-17'])
const departureDate = ref<CDatePickerModelValue>('2026-08-20')
const returnDate = ref<CDatePickerModelValue>('2026-08-27')
const returnMinimum = computed(() =>
  typeof departureDate.value === 'string' ? departureDate.value : undefined,
)
const constrainedPeriod = ref<CDatePickerModelValue>([null, null])
const smallDate = ref<CDatePickerModelValue>('2026-08-17')
const largeDate = ref<CDatePickerModelValue>('2026-08-17')
const requiredRange = ref<CDatePickerModelValue>([null, null])
const invalidDate = ref<CDatePickerModelValue>(null)

const singleUsage = `<script setup>
import { ref } from 'vue'

const invoiceDate = ref('2026-08-17')
<\/script>

<template>
  <CFormField label="Invoice date">
    <CDatePicker v-model="invoiceDate" />
  </CFormField>
</template>`

const rangeUsage = `<script setup>
import { ref } from 'vue'

const reportingPeriod = ref(['2026-08-01', '2026-08-17'])
<\/script>

<template>
  <CFormField label="Reporting period">
    <CDatePicker v-model="reportingPeriod" range />
  </CFormField>
</template>`

const independentUsage = `<script setup>
import { ref } from 'vue'

const departureDate = ref('2026-08-20')
const returnDate = ref('2026-08-27')
<\/script>

<template>
  <div class="date-fields">
    <CFormField label="Departure">
      <CDatePicker v-model="departureDate" />
    </CFormField>
    <CFormField label="Return">
      <CDatePicker v-model="returnDate" :min="departureDate" />
    </CFormField>
  </div>
</template>`

const constraintUsage = `<CDatePicker
  v-model="period"
  range
  min="2026-01-01"
  max="2026-12-31"
/>`

const stateUsage = `<CDatePicker size="small" model-value="2026-08-17" />
<CDatePicker size="large" model-value="2026-08-17" />
<CDatePicker disabled model-value="2026-08-17" />
<CDatePicker readonly model-value="2026-08-17" />
<CFormField label="Required range" required>
  <CDatePicker v-model="requiredRange" range />
</CFormField>
<CDatePicker invalid />`

function displayValue(value: CDatePickerModelValue) {
  if (Array.isArray(value)) return `${value[0] ?? 'empty'} → ${value[1] ?? 'empty'}`
  return value ?? 'empty'
}
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Date Picker</h1></div>
      <p>
        <code>CDatePicker</code> provides a compact calendar popover for selecting one date or a
        start and end range without introducing calendar dependencies.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Single date</h2>
      <p>
        Single mode binds an ISO <code>YYYY-MM-DD</code> string. Choose a day to update the model
        and close the calendar. Clear removes the selection and emits <code>null</code>.
      </p>
      <div class="preview">
        <CFormField label="Invoice date">
          <CDatePicker v-model="invoiceDate" />
        </CFormField>
        <span>Model value: <code>{{ displayValue(invoiceDate) }}</code></span>
      </div>
      <CCodeBlock class="code-sample" :code="singleUsage" />
    </section>

    <section class="section">
      <h2>Date range</h2>
      <p>
        Add <code>range</code> to bind <code>[start, end]</code>. One calendar stays open after the
        first click so the next click selects the end date. Dates between the boundaries are
        highlighted, and either boundary may temporarily be <code>null</code>.
      </p>
      <div class="preview range-preview">
        <CFormField label="Reporting period">
          <CDatePicker v-model="reportingPeriod" range />
        </CFormField>
        <span>Model value: <code>{{ displayValue(reportingPeriod) }}</code></span>
      </div>
      <CCodeBlock class="code-sample" :code="rangeUsage" />
    </section>

    <section class="section">
      <h2>Independent dates</h2>
      <p>
        Use two <code>CDatePicker</code> components when the dates are separate fields rather than
        one range value. Constraints can still connect them; this return date cannot precede the
        departure date.
      </p>
      <div class="preview date-fields">
        <CFormField label="Departure">
          <CDatePicker v-model="departureDate" />
        </CFormField>
        <CFormField label="Return">
          <CDatePicker v-model="returnDate" :min="returnMinimum" />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="independentUsage" />
    </section>

    <section class="section">
      <h2>Range order and constraints</h2>
      <p>
        The first click establishes one boundary and the second click establishes the other. If the
        second date precedes the first, the component orders them automatically. Global
        <code>min</code> and <code>max</code> constraints disable dates outside the allowed interval.
      </p>
      <div class="preview range-preview">
        <CFormField label="2026 reporting period" hint="Allowed dates: January–December 2026">
          <CDatePicker
            v-model="constrainedPeriod"
            range
            min="2026-01-01"
            max="2026-12-31"
          />
        </CFormField>
        <span>Model value: <code>{{ displayValue(constrainedPeriod) }}</code></span>
      </div>
      <CCodeBlock class="code-sample" :code="constraintUsage" />
    </section>

    <section class="section">
      <h2>Sizes and states</h2>
      <p>
        Sizes match the existing form controls. Disabled and read-only controls cannot open the
        calendar. Required and invalid states are exposed through the trigger's ARIA attributes.
      </p>
      <div class="preview">
        <CFormField label="Small">
          <CDatePicker v-model="smallDate" size="small" />
        </CFormField>
        <CFormField label="Large">
          <CDatePicker v-model="largeDate" size="large" />
        </CFormField>
        <CFormField label="Disabled">
          <CDatePicker disabled model-value="2026-08-17" />
        </CFormField>
        <CFormField label="Read-only">
          <CDatePicker readonly model-value="2026-08-17" />
        </CFormField>
        <CFormField label="Required range" required>
          <CDatePicker v-model="requiredRange" range />
        </CFormField>
        <CFormField label="Invalid">
          <CDatePicker v-model="invalidDate" invalid />
        </CFormField>
      </div>
      <CCodeBlock class="code-sample" :code="stateUsage" />
    </section>

    <section class="section">
      <h2>Keyboard use</h2>
      <p>
        Press <kbd>Enter</kbd>, <kbd>Space</kbd>, or <kbd>Arrow Down</kbd> on the field to open the
        calendar. Arrow keys move by day or week, <kbd>Home</kbd> and <kbd>End</kbd> move within the
        week, <kbd>Page Up</kbd> and <kbd>Page Down</kbd> change month, and <kbd>Escape</kbd> closes
        the popover.
      </p>
    </section>

    <section class="section">
      <h2>Properties and events</h2>
      <dl class="property-list">
        <div><dt><code>model-value</code></dt><dd>A date string or <code>null</code> in single mode; <code>[start, end]</code> in range mode.</dd></div>
        <div><dt><code>range</code></dt><dd>Selects an ordered start and end date from one calendar. Defaults to false.</dd></div>
        <div><dt><code>min</code></dt><dd>Earliest permitted ISO date for either boundary.</dd></div>
        <div><dt><code>max</code></dt><dd>Latest permitted ISO date for either boundary.</dd></div>
        <div><dt><code>placeholder</code></dt><dd>Text shown while no date is selected.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>disabled</code></dt><dd>Disables all date controls.</dd></div>
        <div><dt><code>readonly</code></dt><dd>Prevents changes while keeping the controls focusable where supported.</dd></div>
        <div><dt><code>required</code></dt><dd>Marks the calendar trigger as required for form-field accessibility.</dd></div>
        <div><dt><code>invalid</code></dt><dd>Applies invalid styling and <code>aria-invalid</code>.</dd></div>
        <div><dt><code>start-label</code></dt><dd>Range instruction shown before the first selection. Defaults to <code>Select start date</code>.</dd></div>
        <div><dt><code>end-label</code></dt><dd>Range instruction shown while awaiting the second selection. Defaults to <code>Select end date</code>.</dd></div>
        <div><dt><code>@update:model-value</code></dt><dd>Emits the single date or range tuple used by <code>v-model</code>.</dd></div>
        <div><dt><code>@change</code></dt><dd>Emits after a single date is chosen, a complete range is chosen, or the value is cleared. The temporary first range selection does not emit it.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.form-page .range-preview {
  max-width: 680px;
}

.form-page .date-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > * {
    flex: 1 1 220px;
    min-width: 0;
  }
}
</style>
