<script setup lang="ts">
import { CButton, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const horizontalUsage = `<section>
  <h3>Account details</h3>
  <p>Primary contact and billing information.</p>
</section>

<CSeparator />

<section>
  <h3>Permissions</h3>
  <p>Roles and application access.</p>
</section>`

const verticalUsage = `<div class="toolbar">
  <CButton>New</CButton>
  <CButton>Open</CButton>
  <CSeparator orientation="vertical" />
  <CButton>Save</CButton>
</div>

<style scoped>
.toolbar {
  display: flex;
  align-items: stretch;
  height: 30px;
  gap: 6px;
}
</style>`

const decorativeUsage = `<CSeparator decorative />`
</script>

<template>
  <article class="separator-page">
    <header class="page-header">
      <div>
        <p class="category">Layout &amp; Menus</p>
        <h1>Separator</h1>
      </div>
      <p>
        <code>CSeparator</code> creates a subtle horizontal or vertical division between related
        interface regions without adding layout spacing of its own.
      </p>
    </header>

    <CSeparator />

    <section class="example">
      <div class="description">
        <h2>Horizontal separator</h2>
        <p>
          Horizontal orientation is the default. Place it between sections, menu groups, or other
          stacked content and control the surrounding spacing from the parent layout.
        </p>
      </div>

      <div class="preview stacked-preview">
        <div><strong>Account details</strong><span>Primary contact and billing information.</span></div>
        <CSeparator />
        <div><strong>Permissions</strong><span>Roles and application access.</span></div>
      </div>
      <CCodeBlock class="code-sample" :code="horizontalUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Vertical separator</h2>
        <p>
          Set <code>orientation="vertical"</code> between controls in a horizontal layout. Its
          parent must provide a useful height, normally with a fixed row height or stretched flex
          children.
        </p>
      </div>

      <div class="preview">
        <div class="toolbar-preview">
          <CButton>New</CButton>
          <CButton>Open</CButton>
          <CSeparator orientation="vertical" />
          <CButton>Save</CButton>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="verticalUsage" />
    </section>

    <section class="example">
      <div class="description">
        <h2>Semantic and decorative use</h2>
        <p>
          By default the component exposes the semantic <code>separator</code> role and its
          orientation. Add <code>decorative</code> when the line is visual only and does not divide
          meaningful groups.
        </p>
      </div>
      <CCodeBlock class="code-sample" :code="decorativeUsage" />
    </section>

    <section class="example">
      <div class="description"><h2>Properties</h2></div>
      <dl class="property-list">
        <div>
          <dt><code>orientation</code></dt>
          <dd><code>horizontal</code> or <code>vertical</code>. Defaults to horizontal.</dd>
        </div>
        <div>
          <dt><code>decorative</code></dt>
          <dd>Hides the separator from assistive technology. Defaults to false.</dd>
        </div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
.separator-page {
  width: min(100%, 900px);
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

  .example {
    padding: 22px 0;

    .description {
      margin-bottom: 10px;

      p {
        margin-bottom: 0;
        color: var(--c-muted-text-color, #626a75);
        line-height: 1.5;
      }
    }
  }

  .preview {
    padding: 12px;
    background: var(--c-surface-color, #fff);
    border: 1px solid var(--c-border-color, #d5d9df);
  }

  .stacked-preview {
    display: grid;
    gap: 10px;

    > div {
      display: grid;
      gap: 3px;

      span {
        color: var(--c-muted-text-color, #626a75);
      }
    }
  }

  .toolbar-preview {
    display: flex;
    align-items: stretch;
    height: 30px;
    gap: 6px;
  }

  .code-sample {
    margin-top: 8px;
  }

  .property-list {
    margin: 0;
    border: 1px solid var(--c-border-color, #d5d9df);

    > div {
      display: grid;
      grid-template-columns: 120px minmax(0, 1fr);

      + div {
        border-top: 1px solid var(--c-border-color, #d5d9df);
      }
    }

    dt,
    dd {
      padding: 8px 10px;
      margin: 0;
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
