<script setup lang="ts">
import { ref } from 'vue'

import { CButton, CIcon, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const clickCount = ref(0)

const basicUsage = `<CButton @click="save">Save</CButton>
<CButton variant="primary" @click="submit">Submit</CButton>
<CButton variant="success" @click="approve">Approve</CButton>
<CButton variant="warning" @click="suspend">Suspend</CButton>
<CButton variant="danger" @click="remove">Delete</CButton>`

const iconUsage = `<CButton icon="💾">Save</CButton>

<CButton icon="🗑️" variant="danger" aria-label="Delete record" />

<CButton>
  <template #icon><CIcon>📂</CIcon></template>
  Open
</CButton>`

const stateUsage = `<CButton :disabled="!canSave">Save</CButton>
<CButton :loading="isSaving" variant="primary">Save changes</CButton>`

const sizeUsage = `<CButton size="small">Small</CButton>
<CButton size="medium">Medium</CButton>
<CButton size="large">Large</CButton>`

const formUsage = `<form @submit.prevent="submit">
  <CButton type="submit" variant="primary">Submit</CButton>
  <CButton type="reset">Reset</CButton>
</form>`
</script>

<template>
  <article class="button-page">
    <header class="page-header">
      <div>
        <p class="category">Controls</p>
        <h1>Button</h1>
      </div>
      <p>
        <code>CButton</code> provides compact actions with native button behavior, restrained
        semantic variants, icons, and asynchronous states.
      </p>
    </header>

    <CSeparator />

    <section class="section">
      <h2>Variants</h2>
      <p>
        Use color only when it communicates meaning: primary for the main action, success for a
        positive workflow outcome, warning for a consequential action, and danger for a
        destructive operation.
      </p>
      <div class="preview-row">
        <CButton @click="clickCount++">Default</CButton>
        <CButton variant="primary" @click="clickCount++">Primary</CButton>
        <CButton variant="success" @click="clickCount++">Success</CButton>
        <CButton variant="warning" @click="clickCount++">Warning</CButton>
        <CButton variant="danger" @click="clickCount++">Danger</CButton>
        <span class="status" aria-live="polite">Clicks: {{ clickCount }}</span>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Icons</h2>
      <p>
        Pass a Unicode symbol or emoji through <code>icon</code>, or use the named
        <code>icon</code> slot for custom presentation. Icon-only buttons require an
        <code>aria-label</code>.
      </p>
      <div class="preview-row">
        <CButton icon="💾">Save</CButton>
        <CButton icon="📂">Open</CButton>
        <CButton icon="🗑️" variant="danger" aria-label="Delete record" />
        <CButton aria-label="Confirm">
          <template #icon><CIcon color="green">✓</CIcon></template>
        </CButton>
      </div>
      <CCodeBlock class="code-sample" :code="iconUsage" />
    </section>

    <section class="section">
      <h2>Disabled and loading</h2>
      <p>
        Disabled buttons cannot be activated. Loading also disables the button, adds
        <code>aria-busy="true"</code>, and replaces its icon with a rotating progress symbol.
      </p>
      <div class="preview-row">
        <CButton disabled>Unavailable</CButton>
        <CButton loading>Loading</CButton>
        <CButton loading variant="primary">Saving changes</CButton>
      </div>
      <CCodeBlock class="code-sample" :code="stateUsage" />
    </section>

    <section class="section">
      <h2>Sizes</h2>
      <p>
        Use semantic sizes to keep controls consistent. The compact <code>medium</code> size is the
        default; small and large are available for denser tool areas or more prominent actions.
      </p>
      <div class="preview-row">
        <CButton size="small" icon="✓">Small</CButton>
        <CButton size="medium" icon="✓">Medium</CButton>
        <CButton size="large" icon="✓">Large</CButton>
      </div>
      <CCodeBlock class="code-sample" :code="sizeUsage" />
    </section>

    <section class="section">
      <h2>Native form behavior</h2>
      <p>
        The default <code>type</code> is <code>button</code>, preventing accidental form submission.
        Set it explicitly to <code>submit</code> or <code>reset</code> when needed. Native attributes
        and event listeners are forwarded to the underlying button.
      </p>
      <CCodeBlock class="code-sample" :code="formUsage" />
    </section>

    <section class="section">
      <h2>Properties</h2>
      <dl class="property-list">
        <div>
          <dt><code>variant</code></dt>
          <dd>
            <code>default</code>, <code>primary</code>, <code>success</code>,
            <code>warning</code>, or <code>danger</code>.
          </dd>
        </div>
        <div>
          <dt><code>type</code></dt>
          <dd><code>button</code>, <code>submit</code>, or <code>reset</code>.</dd>
        </div>
        <div>
          <dt><code>size</code></dt>
          <dd>
            <code>small</code> (26px), <code>medium</code> (30px, default), or
            <code>large</code> (34px).
          </dd>
        </div>
        <div>
          <dt><code>icon</code></dt>
          <dd>An optional Unicode symbol or emoji displayed before the label.</dd>
        </div>
        <div>
          <dt><code>disabled</code></dt>
          <dd>Disables native interaction and applies disabled styling.</dd>
        </div>
        <div>
          <dt><code>loading</code></dt>
          <dd>Disables interaction and displays an accessible progress state.</dd>
        </div>
        <div>
          <dt><code>aria-label</code></dt>
          <dd>Provides an accessible name, particularly for icon-only buttons.</dd>
        </div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
.button-page {
  width: min(100%, 1100px);
  margin: 0 auto;

  .page-header {
    display: grid;
    grid-template-columns: minmax(220px, 0.7fr) minmax(320px, 1.3fr);
    align-items: end;
    padding-bottom: 20px;
    gap: 32px;

    > p {
      margin-bottom: 0;
      color: var(--c-muted-text-color, #626a75);
      line-height: 1.5;
    }
  }

  .category {
    margin: 0 0 4px;
    color: var(--c-primary-color, #2f6fad);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 0;
    font-size: 25px;
  }

  h2 {
    margin-bottom: 5px;
    font-size: 16px;
  }

  .section {
    padding: 22px 0;

    > p {
      margin-bottom: 10px;
      color: var(--c-muted-text-color, #626a75);
      line-height: 1.5;
    }
  }

  .preview-row {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 8px;
    gap: 8px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }

  .status {
    margin-inline-start: auto;
    color: var(--c-muted-text-color, #626a75);
    font-size: 12px;
  }

  .code-sample {
    margin-top: 8px;
  }

  .property-list {
    margin: 0;
    border: 1px solid var(--c-border-color, #d5d9df);

    > div {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr);

      + div {
        border-top: 1px solid var(--c-border-color, #d5d9df);
      }
    }

    dt,
    dd {
      margin: 0;
      padding: 8px 10px;
    }

    dt {
      font-weight: 600;
      background: var(--c-subtle-surface-color, #f7f8fa);
      border-inline-end: 1px solid var(--c-border-color, #d5d9df);
    }

    dd {
      line-height: 1.45;
    }
  }
}
</style>
