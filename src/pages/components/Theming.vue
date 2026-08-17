<script setup lang="ts">
import { ref } from 'vue'

import {
  CButton,
  CCheckbox,
  CFormField,
  CInput,
  CPanel,
  CProgressBar,
  CSelect,
  CSeparator,
} from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const customerName = ref('North Distribution Center')
const notifications = ref(true)
const priority = ref('normal')
const priorities = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgent', value: 'urgent' },
]

const brandThemeUsage = `.yellow-brand-theme {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
  --c-primary-hover-color: #e2b51f;
  --c-primary-active-color: #cfa30f;
  --c-focus-color: #a97800;
  --c-selection-color: #fff0a8;
  --c-selection-text-color: #3b2d00;
  --c-selection-subtle-color: #fff8d8;
}`

const globalThemeUsage = `/* Apply the brand to the complete application. */
:root {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
  --c-primary-hover-color: #e2b51f;
  --c-primary-active-color: #cfa30f;
  --c-focus-color: #a97800;
}`

const scopedThemeUsage = `<div class="yellow-brand-theme">
  <CPanel title="Operations workspace">
    <CButton variant="primary">Create shipment</CButton>
  </CPanel>
</div>

<style scoped>
.yellow-brand-theme {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
}
</style>`

const colorSchemeUsage = `<div class="c-theme-light company-brand">Light workspace</div>
<div class="c-theme-dark company-brand">Dark workspace</div>

<style>
.company-brand {
  /* Brand values are independent from light/dark neutral surfaces. */
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
}
</style>`

const variableGroups = [
  {
    title: 'Neutral color scheme',
    description: 'Use these together when defining light or dark application surfaces.',
    variables: [
      ['--c-page-background-color', 'Application canvas behind component surfaces.'],
      ['--c-text-color', 'Default foreground text.'],
      ['--c-muted-text-color', 'Secondary labels, hints, and supporting text.'],
      ['--c-surface-color', 'Panels, menus, dialogs, tables, and other raised surfaces.'],
      ['--c-subtle-surface-color', 'Headers, footers, and quiet secondary regions.'],
      ['--c-input-background', 'Editable control background; usually related to the surface.'],
      ['--c-border-color', 'General structural dividers and container borders.'],
      ['--c-control-border-color', 'Default border for interactive controls.'],
      ['--c-control-hover-border-color', 'Interactive control border on hover.'],
      ['--c-hover-color', 'Neutral hover background.'],
      ['--c-active-color', 'Neutral pressed background.'],
      ['--c-placeholder-color', 'Placeholder text.'],
      ['--c-disabled-text-color', 'Disabled foreground.'],
      ['--c-disabled-background-color', 'Disabled control background.'],
      ['--c-disabled-border-color', 'Disabled control border.'],
      ['--c-readonly-background-color', 'Read-only control background.'],
      ['--c-progress-track-color', 'Unfilled progress track.'],
    ],
  },
  {
    title: 'Brand and interaction',
    description: 'Override these to apply an organization or product accent palette.',
    variables: [
      ['--c-primary-color', 'Primary action and strong selected-state background.'],
      ['--c-primary-text-color', 'Text and marks displayed on the primary color.'],
      ['--c-primary-border-color', 'Primary control border.'],
      ['--c-primary-hover-color', 'Primary action hover background.'],
      ['--c-primary-active-color', 'Primary action pressed background.'],
      ['--c-focus-color', 'Keyboard focus outline.'],
      ['--c-selection-color', 'Current-page and selected-row background.'],
      ['--c-selection-text-color', 'Foreground on subtle selected backgrounds.'],
      ['--c-selection-subtle-color', 'Range and low-emphasis selection fill.'],
    ],
  },
  {
    title: 'Semantic status',
    description: 'Keep status colors stable unless the product has an accessible semantic palette.',
    variables: [
      ['--c-info-color', 'Informational accent.'],
      ['--c-info-text-color', 'Foreground displayed on the informational color.'],
      ['--c-info-border-color', 'Informational border.'],
      ['--c-success-color', 'Success background and accent.'],
      ['--c-success-text-color', 'Foreground displayed on the success color.'],
      ['--c-success-border-color', 'Success border.'],
      ['--c-success-hover-color', 'Success action hover background.'],
      ['--c-success-active-color', 'Success action pressed background.'],
      ['--c-warning-color', 'Warning background and accent.'],
      ['--c-warning-text-color', 'Foreground displayed on the warning color.'],
      ['--c-warning-border-color', 'Warning border.'],
      ['--c-warning-hover-color', 'Warning action hover background.'],
      ['--c-warning-active-color', 'Warning action pressed background.'],
      ['--c-danger-color', 'Danger background, accent, and validation border.'],
      ['--c-danger-text-color', 'Foreground displayed on the danger color.'],
      ['--c-danger-border-color', 'Danger action border.'],
      ['--c-danger-hover-color', 'Danger action hover background.'],
      ['--c-danger-active-color', 'Danger action pressed background.'],
    ],
  },
  {
    title: 'Specialized neutral surfaces',
    description: 'Use these when a table or compact icon treatment needs finer scheme control.',
    variables: [
      ['--c-table-border-color', 'Table grid lines.'],
      ['--c-table-header-background', 'Table header cells, including sticky headers.'],
      ['--c-table-row-hover-background', 'Hovered table row cells.'],
      ['--c-table-footer-background', 'Table footer cells.'],
      ['--c-table-frozen-background', 'Frozen body cells.'],
      ['--c-data-table-loading-background', 'Loading overlay above existing table rows.'],
      ['--c-glyph-circle-background', 'Circular icon display background.'],
      ['--c-glyph-circle-border-color', 'Circular icon display border.'],
    ],
  },
]
</script>

<template>
  <article class="form-page theming-page">
    <header class="page-header">
      <div><p class="category">Foundation</p><h1>Theming</h1></div>
      <p>
        Concise UI colors are inherited CSS custom properties. Theme any ancestor with ordinary CSS;
        no provider, plugin, runtime theme object, or additional package is required.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Inherited CSS variables</h2>
      <p>
        Every component reads semantic <code>--c-*</code> variables from its element and ancestors.
        The nearest declaration wins, following normal CSS inheritance and cascade rules. Importing
        Concise UI installs low-specificity default light variables on <code>:root</code>, allowing
        application declarations to override them cleanly.
      </p>
      <p>
        Override semantic roles rather than component selectors. This keeps the theme independent
        from component markup and lets future components inherit the same palette automatically.
      </p>
    </section>

    <section class="section">
      <h2>Yellow brand palette</h2>
      <p>
        This example uses yellow for primary actions. The separate
        <code>--c-primary-text-color</code> supplies dark text, checkbox marks, and selected-option
        text instead of assuming every primary color needs white foreground content.
      </p>

      <div class="preview yellow-brand-theme brand-preview">
        <CPanel title="Operations workspace" top-accent-color="var(--c-primary-color)">
          <div class="brand-form">
            <CFormField label="Customer">
              <CInput v-model="customerName" />
            </CFormField>
            <CFormField label="Priority">
              <CSelect v-model="priority" :options="priorities" />
            </CFormField>
            <CCheckbox v-model="notifications">Send dispatch notification</CCheckbox>
            <CProgressBar :value="68" show-value />
            <div class="actions">
              <CButton>Cancel</CButton>
              <CButton variant="primary">Create shipment</CButton>
            </div>
          </div>
        </CPanel>
      </div>
      <CCodeBlock class="code-sample" :code="brandThemeUsage" language="css" />
    </section>

    <section class="section">
      <h2>Global and scoped themes</h2>
      <p>
        Declare variables on <code>:root</code> to theme the complete application. Declare the same
        variables on a class, layout, panel, or feature root to theme only that subtree. Components
        outside the subtree continue inheriting the surrounding palette.
      </p>
      <p>
        Teleported content such as dialogs and service toasts inherits from its teleport target,
        commonly <code>body</code>. Put shared brand variables on <code>:root</code> or the configured
        teleport target when those overlays must use the same theme.
      </p>
      <CCodeBlock class="code-sample" :code="globalThemeUsage" language="css" />
      <CCodeBlock class="code-sample" :code="scopedThemeUsage" />
    </section>

    <section class="section">
      <h2>Light, dark, and brand are separate</h2>
      <p>
        Use <code>c-theme-light</code> or <code>c-theme-dark</code> for neutral surfaces and readable
        foregrounds. These classes intentionally do not replace primary or status colors, so the
        same company brand can be combined with either color scheme.
      </p>

      <div class="scheme-grid">
        <div class="scheme-card c-theme-light yellow-brand-theme">
          <strong>Light workspace</strong>
          <CInput model-value="Shipment 1042" readonly />
          <CButton variant="primary">Open shipment</CButton>
        </div>
        <div class="scheme-card c-theme-dark yellow-brand-theme">
          <strong>Dark workspace</strong>
          <CInput model-value="Shipment 1042" readonly />
          <CButton variant="primary">Open shipment</CButton>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="colorSchemeUsage" />
    </section>

    <section class="section">
      <h2>Recommended semantic variables</h2>
      <p>
        Start with the brand variables and override neutral variables only when creating a complete
        light or dark scheme. Component-specific variables remain available for exceptional cases,
        but semantic variables should define the common palette.
      </p>
      <p>
        Dimensions, stacking levels, shadows, and individual component accents use separate
        component-specific variables because they are not part of the shared color palette.
      </p>

      <section v-for="group in variableGroups" :key="group.title" class="variable-group">
        <h3>{{ group.title }}</h3>
        <p>{{ group.description }}</p>
        <dl class="property-list variable-list">
          <div v-for="variable in group.variables" :key="variable[0]">
            <dt><code>{{ variable[0] }}</code></dt>
            <dd>{{ variable[1] }}</dd>
          </div>
        </dl>
      </section>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.theming-page {
  width: min(100%, 980px);
}

.yellow-brand-theme {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
  --c-primary-hover-color: #e2b51f;
  --c-primary-active-color: #cfa30f;
  --c-focus-color: #a97800;
  --c-selection-color: #fff0a8;
  --c-selection-text-color: #3b2d00;
  --c-selection-subtle-color: #fff8d8;
}

.brand-preview {
  max-width: 680px;
  color: var(--c-text-color);
  background: var(--c-page-background-color);
}

.brand-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  > :nth-child(n + 3) {
    grid-column: 1 / -1;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.scheme-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.scheme-card {
  display: grid;
  padding: 12px;
  color: var(--c-text-color);
  background: var(--c-surface-color);
  border: 1px solid var(--c-border-color);
  gap: 9px;
}

.variable-group {
  margin-top: 16px;

  h3 {
    margin: 0 0 3px;
    font-size: 14px;
  }

  > p {
    margin: 0 0 7px;
    color: var(--c-muted-text-color, #626a75);
  }
}

.form-page .variable-list > div {
  grid-template-columns: 245px minmax(0, 1fr);
}

@media (max-width: 720px) {
  .brand-form,
  .scheme-grid {
    grid-template-columns: 1fr;
  }

  .form-page .variable-list > div {
    grid-template-columns: 1fr;

    dt {
      border-inline-end: 0;
      border-bottom: 1px solid var(--c-border-color, #d5d9df);
    }
  }
}
</style>
