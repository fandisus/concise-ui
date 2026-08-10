<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CCheckbox, CFormField, CInput, CPanel, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const customerName = ref('Northwind Traders')
const contactEmail = ref('orders@northwind.example')
const active = ref(true)
const filtersCollapsed = ref(false)

const basicUsage = `<CPanel title="Customer details" accent-color="#286aa6">
  <template #actions>
    <CButton size="small">Save</CButton>
  </template>

  <div class="form-grid">
    <CFormField label="Customer name">
      <CInput v-model="customerName" />
    </CFormField>

    <CFormField label="Contact email">
      <CInput v-model="contactEmail" type="email" />
    </CFormField>
  </div>
</CPanel>`

const headerUsage = `<CPanel accent-color="rgb(47 125 50)">
  <template #header>
    Inventory thresholds <small>Warehouse A</small>
  </template>

  <!-- Grouped controls -->
</CPanel>`

const collapsibleJavaScript = `const filtersCollapsed = ref(false)`

const collapsibleUsage = `<div class="collapse-status">
  <span>
    Current state: {{ filtersCollapsed ? 'Collapsed' : 'Expanded' }}
  </span>
  <CButton
    size="small"
    @click="filtersCollapsed = !filtersCollapsed"
  >
    Toggle from outside
  </CButton>
</div>

<CPanel
  v-model:collapsed="filtersCollapsed"
  title="Advanced filters"
  collapsible
>
  <!-- Controls remain mounted while the panel is collapsed. -->
</CPanel>`

const pricingUsage = `<div class="pricing-grid">
  <CPanel title="Starter" top-accent-color="#286aa6">
    <div class="plan-content">
      <strong class="price">$19 <small>/ month</small></strong>
      <ul>
        <li>3 team members</li>
        <li>5 GB document storage</li>
        <li>Email support</li>
      </ul>
      <CButton>Choose Starter</CButton>
    </div>
  </CPanel>

  <CPanel title="Business" top-accent-color="#2f7d32">
    <!-- Price, features, and action -->
  </CPanel>

  <CPanel title="Enterprise" top-accent-color="#7656a8">
    <!-- Price, features, and action -->
  </CPanel>
</div>`

const pricingCss = `.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  align-items: stretch;
  gap: 10px;
}

.plan-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
}

.plan-action {
  width: 100%;
  margin-top: auto;
}`

const themeUsage = `:root {
  --c-panel-accent-width: 7px;
  --c-panel-top-accent-width: 7px;
  --c-panel-padding: 12px;
}`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Layout</p><h1>Panel</h1></div>
      <p>
        <code>CPanel</code> groups related controls or information in a compact bordered container
        with an optional title and color accent.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Grouping form controls</h2>
      <p>
        Use <code>title</code> to name the group and <code>accent-color</code> when the group needs a
        stronger visual marker. The accent accepts any valid CSS color. It should reinforce
        meaning rather than serve as the only indication of status.
      </p>
      <div class="preview">
        <CPanel title="Customer details" accent-color="#286aa6">
          <template #actions>
            <CButton size="small">Save</CButton>
          </template>

          <div class="form-grid">
            <CFormField label="Customer name">
              <CInput v-model="customerName" />
            </CFormField>
            <CFormField label="Contact email">
              <CInput v-model="contactEmail" type="email" />
            </CFormField>
            <CCheckbox v-model="active">Active customer</CCheckbox>
          </div>
        </CPanel>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Accent colors</h2>
      <p>
        Without <code>accent-color</code>, the panel remains neutral. Named colors, hexadecimal
        colors, and CSS color functions are supported.
      </p>
      <div class="panel-grid">
        <CPanel title="Neutral">
          Ordinary grouping without additional emphasis.
        </CPanel>
        <CPanel title="Orders" accent-color="#286aa6">
          A hexadecimal application color.
        </CPanel>
        <CPanel title="Available stock" accent-color="rgb(47 125 50)">
          A color supplied through an RGB function.
        </CPanel>
        <CPanel title="Needs attention" accent-color="orange">
          A named CSS color.
        </CPanel>
        <CPanel title="Professional plan" top-accent-color="#7656a8">
          A top accent works well when panels are arranged as cards.
        </CPanel>
      </div>
    </section>

    <section class="section">
      <h2>Collapsible content</h2>
      <p>
        Add <code>collapsible</code> to place a keyboard-accessible toggle in the header. The panel
        manages its own state when used alone. Bind <code>v-model:collapsed</code> when another part
        of the application also needs to read or change that state. Collapsing hides the body
        without unmounting its inputs.
      </p>
      <div class="preview">
        <div class="collapse-status">
          <span>Current state: {{ filtersCollapsed ? 'Collapsed' : 'Expanded' }}</span>
          <CButton size="small" @click="filtersCollapsed = !filtersCollapsed">
            Toggle from outside
          </CButton>
        </div>
        <CPanel
          v-model:collapsed="filtersCollapsed"
          title="Advanced filters"
          top-accent-color="#286aa6"
          collapsible
        >
          <div class="form-grid">
            <CFormField label="Reference">
              <CInput placeholder="Order or invoice number" />
            </CFormField>
            <CFormField label="Assigned team">
              <CInput placeholder="Team name" />
            </CFormField>
          </div>
        </CPanel>
      </div>
      <CCodeBlock
        class="code-sample"
        :code="collapsibleJavaScript"
        language="javascript"
      />
      <CCodeBlock class="code-sample" :code="collapsibleUsage" />
    </section>

    <section class="section">
      <h2>Custom header and actions</h2>
      <p>
        The <code>header</code> slot replaces the plain title while retaining the panel's accessible
        label relationship. The <code>actions</code> slot places compact controls at the opposite
        side of the header.
      </p>
      <div class="preview">
        <CPanel accent-color="rgb(47 125 50)">
          <template #header>
            <span class="custom-heading">Inventory thresholds <small>Warehouse A</small></span>
          </template>
          <template #actions>
            <CButton size="small">Edit</CButton>
          </template>
          Reorder points and safety-stock quantities can be edited together in this panel.
        </CPanel>
      </div>
      <CCodeBlock class="code-sample" :code="headerUsage" />
    </section>

    <section class="section">
      <h2>Pricing plans</h2>
      <p>
        Panels can also present comparable choices. A three-column grid keeps the plans aligned,
        while distinct top accents make each tier easy to scan. The panel body fills the available
        height, allowing each action to remain aligned at the bottom.
      </p>
      <div class="pricing-grid">
        <CPanel class="pricing-card" title="Starter" top-accent-color="#286aa6">
          <div class="plan-content">
            <strong class="price">$19 <small>/ month</small></strong>
            <p>For small teams organizing their first shared workspace.</p>
            <ul class="plan-features">
              <li>3 team members</li>
              <li>5 GB document storage</li>
              <li>Email support</li>
            </ul>
            <CButton class="plan-action">Choose Starter</CButton>
          </div>
        </CPanel>

        <CPanel class="pricing-card" title="Business" top-accent-color="#2f7d32">
          <div class="plan-content">
            <strong class="price">$49 <small>/ month</small></strong>
            <p>For growing operations that need more control and capacity.</p>
            <ul class="plan-features">
              <li>15 team members</li>
              <li>100 GB document storage</li>
              <li>Priority support</li>
            </ul>
            <CButton class="plan-action" variant="primary">Choose Business</CButton>
          </div>
        </CPanel>

        <CPanel class="pricing-card" title="Enterprise" top-accent-color="#7656a8">
          <div class="plan-content">
            <strong class="price">Custom</strong>
            <p>For larger organizations with specialized workflows and policies.</p>
            <ul class="plan-features">
              <li>Unlimited team members</li>
              <li>Custom storage allocation</li>
              <li>Dedicated support contact</li>
            </ul>
            <CButton class="plan-action">Contact sales</CButton>
          </div>
        </CPanel>
      </div>
      <CCodeBlock class="code-sample" :code="pricingUsage" />
      <CCodeBlock class="code-sample" :code="pricingCss" language="css" />
    </section>

    <section class="section">
      <h2>Theme variables</h2>
      <p>
        Inline-start and top accents are <code>5px</code> wide, while body padding is
        <code>10px</code> by default. Themes can adjust these values without changing component
        behavior.
      </p>
      <CCodeBlock class="code-sample" :code="themeUsage" language="css" />
    </section>

    <section class="section">
      <h2>Properties, models, and slots</h2>
      <dl class="property-list">
        <div><dt><code>title</code></dt><dd>Optional text displayed in the header and used to label the panel.</dd></div>
        <div><dt><code>accent-color</code></dt><dd>Optional CSS color used for the panel's inline-start border.</dd></div>
        <div><dt><code>top-accent-color</code></dt><dd>Optional CSS color used for the panel's top border.</dd></div>
        <div><dt><code>collapsible</code></dt><dd>Adds an accessible header button that can hide and reveal the panel body.</dd></div>
        <div><dt><code>collapsed</code></dt><dd>Optional <code>v-model:collapsed</code> state. Only affects the body when <code>collapsible</code> is enabled.</dd></div>
        <div><dt><code>@update:collapsed</code></dt><dd>Emitted when the header button changes the collapsed state.</dd></div>
        <div><dt><code>default</code></dt><dd>The controls or content grouped by the panel.</dd></div>
        <div><dt><code>header</code></dt><dd>Custom header content that replaces <code>title</code>.</dd></div>
        <div><dt><code>actions</code></dt><dd>Compact controls aligned opposite the title or custom header.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px 12px;

  > :last-child {
    grid-column: 1 / -1;
  }
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.collapse-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;
}

.plan-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  p,
  ul {
    margin: 0;
  }
}

.price {
  font-size: 22px;
  line-height: 1.2;

  small {
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
    font-weight: 400;
  }
}

.plan-features {
  padding-inline-start: 18px;
  line-height: 1.7;
}

.plan-action {
  width: 100%;
  margin-top: auto;
}

.custom-heading {
  display: flex;
  align-items: baseline;
  gap: 7px;

  small {
    color: var(--c-muted-text-color, #626a75);
    font-weight: 400;
  }
}

@media (max-width: 700px) {
  .form-grid,
  .panel-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
