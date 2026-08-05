<script setup lang="ts">
import { computed, ref } from 'vue'

import { CIcon, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

import { iconCatalog } from './icon-catalog'
import type { IconCatalogEntry } from './icon-catalog'

const selectedCategory = ref('All')
const search = ref('')
const copyStatus = ref('')

const iconUsage = `<CIcon>✓</CIcon>
<CIcon display="circle" size="20px">⚙︎</CIcon>
<CIcon color="red">♥</CIcon>
<CIcon :rotate="-0.5" label="Refreshing">↻</CIcon>`

const categories = ['All', ...new Set(iconCatalog.map((entry) => entry.category))]

const filteredIcons = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()

  return iconCatalog.filter((entry) => {
    if (selectedCategory.value !== 'All' && entry.category !== selectedCategory.value) return false
    if (!query) return true

    return (
      entry.name.toLocaleLowerCase().includes(query) ||
      entry.category.toLocaleLowerCase().includes(query) ||
      entry.icon.includes(query)
    )
  })
})

const groupedIcons = computed(() => {
  const groups = new Map<string, IconCatalogEntry[]>()

  for (const entry of filteredIcons.value) {
    const entries = groups.get(entry.category) ?? []
    entries.push(entry)
    groups.set(entry.category, entries)
  }

  return Array.from(groups, ([category, entries]) => ({ category, entries }))
})

async function copyIcon(entry: IconCatalogEntry) {
  try {
    await navigator.clipboard.writeText(entry.icon)
    copyStatus.value = `Copied ${entry.icon} — ${entry.name}`
  } catch {
    copyStatus.value = 'Copy failed. Select the symbol and copy it manually.'
  }
}
</script>

<template>
  <article class="glyph-page">
    <header class="page-header">
      <div>
        <p class="category">Visual</p>
        <h1>Icon</h1>
      </div>
      <p>
        <code>CIcon</code> presents monochrome Unicode symbols using the surrounding text color.
        Copy a curated symbol into the component's default slot.
      </p>
    </header>

    <CSeparator />

    <section class="section">
      <h2>Curated symbol catalog</h2>
      <p>
        These symbols were selected for compact application commands and indicators. Rendering
        can vary slightly with the installed symbol font.
      </p>

      <div class="filters">
        <label>
          <span>Category</span>
          <select v-model="selectedCategory">
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </label>

        <label>
          <span>Search</span>
          <input v-model="search" type="search" placeholder="Name, category, or symbol" />
        </label>

        <span class="result-count">{{ filteredIcons.length }} symbols</span>
      </div>

      <div v-if="groupedIcons.length" class="catalog">
        <section v-for="group in groupedIcons" :key="group.category" class="catalog-section">
          <h3>{{ group.category }}</h3>

          <div class="grid">
            <button
              v-for="entry in group.entries"
              :key="`${entry.category}-${entry.name}`"
              type="button"
              class="card interactive"
              :title="`Copy ${entry.name}`"
              @click="copyIcon(entry)"
            >
              <CIcon size="20px">{{ entry.icon }}</CIcon>
              <code>{{ entry.name }}</code>
            </button>
          </div>
        </section>
      </div>

      <p v-else class="empty">No symbols match the current filters.</p>
      <p class="copy-status" aria-live="polite">{{ copyStatus }}</p>
    </section>

    <section class="section">
      <h2>Usage</h2>
      <p>Paste a Unicode symbol into the default slot and configure its presentation with props.</p>
      <CCodeBlock :code="iconUsage" />
    </section>

    <section class="section">
      <h2>Display and size</h2>
      <div class="example-row">
        <div class="example">
          <CIcon size="16px">✓</CIcon>
          <code>&lt;CIcon&gt;✓&lt;/CIcon&gt;</code>
        </div>
        <div class="example">
          <CIcon size="1.5em">✓</CIcon>
          <code>1.5em inline</code>
        </div>
        <div class="example">
          <CIcon display="circle" size="18px">✓</CIcon>
          <code>18px circle</code>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Color</h2>
      <p>The color prop accepts any valid CSS color value and applies it to the symbol.</p>
      <div class="example-row">
        <div class="example">
          <CIcon size="22px" color="red">♥</CIcon>
          <code>red</code>
        </div>
        <div class="example">
          <CIcon display="circle" size="18px" color="green">✓</CIcon>
          <code>green</code>
        </div>
        <div class="example dark">
          <CIcon size="22px" color="#FFFF00">★</CIcon>
          <code>#FFFF00</code>
        </div>
        <div class="example">
          <CIcon size="22px" color="rgba(47, 111, 173, 0.65)">ⓘ</CIcon>
          <code>rgba(47, 111, 173, 0.65)</code>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Rotation</h2>
      <p>The signed value represents revolutions per second. Negative values rotate counterclockwise.</p>
      <div class="example-row">
        <div class="example">
          <CIcon display="circle" size="20px" :rotate="1" label="Loading settings">⚙︎</CIcon>
          <code>:rotate="1"</code>
        </div>
        <div class="example">
          <CIcon size="24px" :rotate="-0.5" label="Refreshing">↻</CIcon>
          <code>:rotate="-0.5"</code>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./glyph-demo.scss"></style>
