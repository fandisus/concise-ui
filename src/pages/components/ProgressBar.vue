<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CProgressBar, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const progress = ref(42)

function adjustProgress(amount: number) {
  progress.value = Math.min(100, Math.max(0, progress.value + amount))
}

const basicUsage = `<CProgressBar :value="42" />
<CProgressBar :value="42" show-value />`

const indeterminateUsage = `<CProgressBar indeterminate aria-label="Loading report" />`

const customValueUsage = `<CProgressBar :value="3" :max="8" show-value>
  <template #value="{ value, max }">
    {{ value }} / {{ max }} files
  </template>
</CProgressBar>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Forms</p><h1>Progress Bar</h1></div>
      <p>
        <code>CProgressBar</code> communicates completion for bounded work or ongoing activity
        whose duration is not yet known.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Determinate progress</h2>
      <p>
        Set <code>value</code> when progress can be measured. Values are clamped between zero and
        <code>max</code>, which defaults to <code>100</code>. Add <code>show-value</code> to display a
        compact percentage beside the track.
      </p>
      <div class="preview">
        <CProgressBar :value="progress" />
        <CProgressBar :value="progress" show-value aria-label="Interactive progress" />
        <div class="actions">
          <CButton size="small" @click="adjustProgress(-10)">−10</CButton>
          <CButton size="small" @click="adjustProgress(10)">+10</CButton>
          <span>Current value: {{ progress }}</span>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Indeterminate progress</h2>
      <p>
        Use <code>indeterminate</code> while work is active but no meaningful percentage is
        available. In this mode value-related ARIA attributes and the optional value text are
        omitted. Supply an accessible label describing the operation.
      </p>
      <div class="preview">
        <CProgressBar indeterminate aria-label="Loading report" />
      </div>
      <CCodeBlock class="code-sample" :code="indeterminateUsage" />
    </section>

    <section class="section">
      <h2>Semantic variants</h2>
      <p>
        Variants communicate state without changing behavior. Keep the default for ordinary
        progress, and reserve semantic colors for meaningful outcomes or thresholds.
      </p>
      <div class="preview variants">
        <div><span>Default</span><CProgressBar :value="65" /></div>
        <div><span>Success</span><CProgressBar :value="100" variant="success" /></div>
        <div><span>Warning</span><CProgressBar :value="72" variant="warning" /></div>
        <div><span>Danger</span><CProgressBar :value="88" variant="danger" /></div>
      </div>
    </section>

    <section class="section">
      <h2>Sizes</h2>
      <div class="preview variants">
        <div><span>Small (6px)</span><CProgressBar :value="55" size="small" /></div>
        <div><span>Medium (10px)</span><CProgressBar :value="55" /></div>
        <div><span>Large (14px)</span><CProgressBar :value="55" size="large" /></div>
      </div>
    </section>

    <section class="section">
      <h2>Custom maximum and value text</h2>
      <p>
        Use the <code>value</code> slot when a percentage is less useful than application-specific
        units. The slot receives the normalized <code>value</code>, <code>max</code>, and calculated
        <code>percentage</code>.
      </p>
      <div class="preview">
        <CProgressBar :value="3" :max="8" show-value>
          <template #value="{ value, max }">{{ value }} / {{ max }} files</template>
        </CProgressBar>
      </div>
      <CCodeBlock class="code-sample" :code="customValueUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div><dt><code>value</code></dt><dd>Current numeric value. Defaults to <code>0</code> and is clamped to the valid range.</dd></div>
        <div><dt><code>max</code></dt><dd>Positive upper bound used to calculate the percentage. Defaults to <code>100</code>.</dd></div>
        <div><dt><code>indeterminate</code></dt><dd>Displays ongoing activity without claiming a measurable value.</dd></div>
        <div><dt><code>show-value</code></dt><dd>Displays the rounded percentage beside determinate progress.</dd></div>
        <div><dt><code>size</code></dt><dd><code>small</code>, <code>medium</code>, or <code>large</code>.</dd></div>
        <div><dt><code>variant</code></dt><dd><code>default</code>, <code>success</code>, <code>warning</code>, or <code>danger</code>.</dd></div>
        <div><dt><code>aria-label</code></dt><dd>Accessible name for the operation represented by the progress bar.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.variants > div {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
</style>
