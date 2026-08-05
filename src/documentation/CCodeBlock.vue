<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'

type CCodeLanguage = 'markup' | 'css' | 'javascript' | 'typescript'

const props = withDefaults(
  defineProps<{
    code: string
    language?: CCodeLanguage
    wrap?: boolean
  }>(),
  {
    language: 'markup',
    wrap: false,
  },
)

const copyStatus = ref('')
let copyStatusTimer: ReturnType<typeof setTimeout> | undefined

const highlightedCode = computed(() => {
  const grammar = Prism.languages[props.language] ?? Prism.languages.markup!
  return Prism.highlight(props.code, grammar, props.language)
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copyStatus.value = 'Copied'
  } catch {
    copyStatus.value = 'Copy failed'
  }

  if (copyStatusTimer) clearTimeout(copyStatusTimer)
  copyStatusTimer = setTimeout(() => {
    copyStatus.value = ''
  }, 1800)
}

onBeforeUnmount(() => {
  if (copyStatusTimer) clearTimeout(copyStatusTimer)
})
</script>

<template>
  <div class="code-block" :class="{ 'is-wrapped': wrap }">
    <div class="header">
      <span>{{ language }}</span>
      <button type="button" @click="copyCode">{{ copyStatus || 'Copy' }}</button>
    </div>

    <pre><code :class="`language-${language}`" v-html="highlightedCode" /></pre>
    <span class="status" aria-live="polite">{{ copyStatus }}</span>
  </div>
</template>

<style scoped lang="scss">
.code-block {
  position: relative;
  overflow: hidden;
  color: #24292f;
  background: #f7f8fa;
  border: 1px solid var(--c-border-color, #d5d9df);
  border-radius: var(--c-border-radius, 3px);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 28px;
    padding: 3px 5px 3px 9px;
    color: var(--c-muted-text-color, #626a75);
    font-size: 11px;
    text-transform: uppercase;
    background: #eef1f5;
    border-bottom: 1px solid var(--c-border-color, #d5d9df);

    button {
      min-width: 52px;
      height: 22px;
      padding: 2px 7px;
      color: inherit;
      font: inherit;
      text-transform: none;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c7ccd3;
      border-radius: 2px;

      &:hover {
        color: #20242a;
        background: #f9fafb;
      }

      &:focus-visible {
        outline: 2px solid var(--c-focus-color, #3578c6);
        outline-offset: 1px;
      }
    }
  }

  pre {
    max-width: 100%;
    margin: 0;
    padding: 11px 13px;
    overflow: auto;
    tab-size: 2;
  }

  code {
    color: inherit;
    font-family: Consolas, "Cascadia Code", "SFMono-Regular", monospace;
    font-size: 12px;
    line-height: 1.5;
    text-shadow: none;
    white-space: pre;
  }

  &.is-wrapped code {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  :deep(.token) {
    &.comment,
    &.prolog,
    &.doctype,
    &.cdata {
      color: #6a737d;
    }

    &.punctuation {
      color: #57606a;
    }

    &.tag,
    &.constant,
    &.symbol,
    &.deleted {
      color: #cf222e;
    }

    &.boolean,
    &.number {
      color: #0550ae;
    }

    &.selector,
    &.attr-name,
    &.string,
    &.char,
    &.builtin,
    &.inserted {
      color: #116329;
    }

    &.operator,
    &.entity,
    &.url {
      color: #0a3069;
    }

    &.atrule,
    &.attr-value,
    &.keyword {
      color: #8250df;
    }

    &.function,
    &.class-name {
      color: #953800;
    }

    &.regex,
    &.important,
    &.variable {
      color: #bc4c00;
    }

    &.bold,
    &.important {
      font-weight: 700;
    }

    &.italic {
      font-style: italic;
    }
  }

  :deep(.language-css .token.string) {
    color: #0a3069;
  }
}
</style>
