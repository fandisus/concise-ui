<script setup lang="ts">
import { CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

defineOptions({ name: 'InstallationPage' })

const registryInstall = `npm install @icfm/concise-ui`

const applicationSetup = `import { createApp } from 'vue'
import App from './App.vue'

import '@icfm/concise-ui/style.css'

createApp(App).mount('#app')`

const componentUsage = `<script setup>
import { ref } from 'vue'
import { CButton, CFormField, CInput } from '@icfm/concise-ui'

const name = ref('')
<\/script>

<template>
  <CFormField label="Customer name">
    <CInput v-model="name" />
  </CFormField>
  <CButton variant="primary">Save</CButton>
</template>`

const serviceSetup = `import { createApp } from 'vue'
import { CPromptPlugin, CToastPlugin } from '@icfm/concise-ui'
import '@icfm/concise-ui/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(CPromptPlugin)
app.use(CToastPlugin)
app.mount('#app')`

const localInstall = `# In the Concise UI checkout
npm install
npm run build

# In the consuming application
npm install ../concise-ui`

const themeSetup = `/* Application CSS loaded after Concise UI's stylesheet */
:root {
  --c-primary-color: #f4c430;
  --c-primary-text-color: #241c00;
  --c-primary-border-color: #c99a00;
}`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Getting started</p><h1>Installation</h1></div>
      <p>
        Install Concise UI in a Vue 3 application, load its component stylesheet once, and import
        only the components or optional services the application uses.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Requirements</h2>
      <p>
        Concise UI requires Vue <code>3.5</code> or newer. It is distributed as an ES module with
        TypeScript declarations, so JavaScript applications receive IDE completion without needing
        to write TypeScript.
      </p>
    </section>

    <section class="section">
      <h2>Install from npm</h2>
      <p>Run the installation command from the consuming Vue application's directory.</p>
      <CCodeBlock class="code-sample" :code="registryInstall" language="bash" />
    </section>

    <section class="section">
      <h2>Load the stylesheet</h2>
      <p>
        Import the stylesheet once, normally in <code>main.js</code> or <code>main.ts</code>. Without
        this import, components render their markup but do not receive Concise UI styling.
      </p>
      <CCodeBlock class="code-sample" :code="applicationSetup" language="javascript" />
    </section>

    <section class="section">
      <h2>Use components</h2>
      <p>
        Components and public types are named exports. Import them directly where they are used;
        global component registration is not required.
      </p>
      <CCodeBlock class="code-sample" :code="componentUsage" />
    </section>

    <section class="section">
      <h2>Optional Prompt and Toast services</h2>
      <p>
        Ordinary components need no Vue plugin. Install the Prompt or Toast plugins only when the
        application uses their programmatic services. Their internal hosts are mounted
        automatically, so no host component is needed in <code>App.vue</code>.
      </p>
      <CCodeBlock class="code-sample" :code="serviceSetup" language="javascript" />
    </section>

    <section class="section">
      <h2>Install from a local checkout</h2>
      <p>
        During framework development, build Concise UI first and install its directory into the
        consuming project. Run the build and reinstall after changing library source files.
      </p>
      <CCodeBlock class="code-sample" :code="localInstall" language="bash" />
    </section>

    <section class="section">
      <h2>Theme the application</h2>
      <p>
        Override inherited semantic CSS variables in application CSS loaded after the library
        stylesheet. Themes can be global on <code>:root</code> or scoped to any ancestor element.
        See the Theming page for the complete variable reference.
      </p>
      <CCodeBlock class="code-sample" :code="themeSetup" language="css" />
    </section>

    <section class="section">
      <h2>Quick troubleshooting</h2>
      <dl class="property-list troubleshooting">
        <div><dt>Unstyled controls</dt><dd>Confirm <code>@icfm/concise-ui/style.css</code> is imported once by the application entry point.</dd></div>
        <div><dt>Unknown import</dt><dd>Use named imports from <code>@icfm/concise-ui</code>; component files are not public package entry points.</dd></div>
        <div><dt>Local changes missing</dt><dd>Rebuild the library, then reinstall or refresh the local file dependency in the consuming project.</dd></div>
        <div><dt>Theme not applied</dt><dd>Load application overrides after the library stylesheet or scope them on an ancestor of the component.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.form-page {
  .code-sample {
    max-width: 760px;
  }

  .troubleshooting > div {
    grid-template-columns: 170px minmax(0, 1fr);
  }
}

@media (max-width: 620px) {
  .form-page .troubleshooting > div {
    grid-template-columns: 1fr;

    dt {
      border-inline-end: 0;
      border-bottom: 1px solid var(--c-border-color, #d5d9df);
    }
  }
}
</style>
