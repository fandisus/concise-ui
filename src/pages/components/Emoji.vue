<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { CIcon, CSeparator } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

import { emojiCatalog, emojiCatalogVersion } from './emoji-catalog'
import type { EmojiCatalogEntry } from './emoji-catalog'
import { emojiSearchAliases } from './emoji-search-aliases'

const pageSize = 120
const search = ref('')
const selectedGroup = ref('All')
const selectedSubgroup = ref('All')
const currentPage = ref(1)
const copyStatus = ref('')

const emojiUsage = `<CIcon>🚚</CIcon>
<CIcon display="circle" size="20px">📦</CIcon>
<CIcon :rotate="-0.25" label="Launching">🚀</CIcon>`

const unicodeGroups = Array.from(new Set(emojiCatalog.map((entry) => entry.group)))
const groups = ['All', ...unicodeGroups]

const groupCounts = new Map<string, number>()
groupCounts.set('All', emojiCatalog.length)

for (const entry of emojiCatalog) {
  groupCounts.set(entry.group, (groupCounts.get(entry.group) ?? 0) + 1)
}

const subgroups = computed(() => {
  if (selectedGroup.value === 'All') return ['All']

  return [
    'All',
    ...new Set(
      emojiCatalog
        .filter((entry) => entry.group === selectedGroup.value)
        .map((entry) => entry.subgroup),
    ),
  ]
})

const filteredEntries = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()

  return emojiCatalog.filter((entry) => {
    if (selectedGroup.value !== 'All' && entry.group !== selectedGroup.value) return false
    if (selectedSubgroup.value !== 'All' && entry.subgroup !== selectedSubgroup.value) return false
    if (!query) return true

    const aliases = emojiSearchAliases[entry.name] ?? []

    return (
      entry.name.toLocaleLowerCase().includes(query) ||
      entry.group.toLocaleLowerCase().includes(query) ||
      entry.subgroup.toLocaleLowerCase().includes(query) ||
      aliases.some((alias) => alias.includes(query))
    )
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / pageSize)))

const pageEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEntries.value.slice(start, start + pageSize)
})

const groupedPageEntries = computed(() => {
  const sections: Array<{
    key: string
    group: string
    subgroup: string
    entries: EmojiCatalogEntry[]
  }> = []

  for (const entry of pageEntries.value) {
    const key = `${entry.group}/${entry.subgroup}`
    let section = sections.at(-1)

    if (section?.key !== key) {
      section = { key, group: entry.group, subgroup: entry.subgroup, entries: [] }
      sections.push(section)
    }

    section.entries.push(entry)
  }

  return sections
})

function selectGroup(group: string) {
  selectedGroup.value = group
  selectedSubgroup.value = 'All'
}

async function copyEmoji(entry: EmojiCatalogEntry) {
  try {
    await navigator.clipboard.writeText(entry.emoji)
    copyStatus.value = `Copied ${entry.emoji} — ${entry.name}`
  } catch {
    copyStatus.value = 'Copy failed. Select the emoji text and copy it manually.'
  }
}

watch([selectedGroup, selectedSubgroup, search], () => {
  currentPage.value = 1
})

watch(search, (value) => {
  if (!value.trim()) return
  selectedGroup.value = 'All'
  selectedSubgroup.value = 'All'
})
</script>

<template>
  <article class="glyph-page">
    <header class="page-header">
      <div>
        <p class="category">Visual</p>
        <h1>Emoji</h1>
      </div>
      <p>
        Unicode Emoji {{ emojiCatalogVersion }} contains {{ emojiCatalog.length.toLocaleString() }}
        emoji characters and sequences. Render them with <code>CIcon</code>; artwork and color
        depend on the operating system.
      </p>
    </header>

    <CSeparator />

    <section class="section">
      <h2>Unicode catalog</h2>
      <p>
        Browse the official Unicode groups and subgroups, then copy an emoji directly into a
        <code>CIcon</code> default slot.
      </p>

      <div class="category-grid" aria-label="Emoji categories">
        <button
          v-for="group in groups"
          :key="group"
          type="button"
          class="category-button"
          :class="{ 'is-active': selectedGroup === group }"
          :aria-pressed="selectedGroup === group"
          @click="selectGroup(group)"
        >
          <span>{{ group }}</span>
          <span class="count">{{ groupCounts.get(group) }}</span>
        </button>
      </div>

      <div class="filters">
        <label>
          <span>Search</span>
          <input v-model="search" type="search" placeholder="Name, group, or subgroup" />
        </label>

        <label>
          <span>Subgroup</span>
          <select v-model="selectedSubgroup" :disabled="selectedGroup === 'All'">
            <option v-for="subgroup in subgroups" :key="subgroup" :value="subgroup">
              {{ subgroup }}
            </option>
          </select>
        </label>

        <div class="result-count">
          {{ filteredEntries.length.toLocaleString() }} result<span v-if="filteredEntries.length !== 1">s</span>
        </div>
      </div>

      <div v-if="groupedPageEntries.length" class="catalog">
        <section v-for="section in groupedPageEntries" :key="section.key" class="subgroup">
          <header class="subgroup-header">
            <strong>{{ section.subgroup }}</strong>
            <span>{{ section.group }}</span>
          </header>

          <div class="grid is-wide">
            <button
              v-for="entry in section.entries"
              :key="`${entry.emoji}-${entry.name}`"
              type="button"
              class="card interactive"
              :title="`Copy ${entry.name} · Emoji ${entry.version}`"
              @click="copyEmoji(entry)"
            >
              <CIcon size="22px">{{ entry.emoji }}</CIcon>
              <span class="details">
                <span>{{ entry.name }}</span>
                <code>E{{ entry.version }}</code>
              </span>
            </button>
          </div>
        </section>
      </div>

      <p v-else class="empty">No emoji match the current filters.</p>

      <p class="copy-status" aria-live="polite">{{ copyStatus }}</p>

      <nav v-if="pageCount > 1" class="pagination" aria-label="Emoji catalog pages">
        <button type="button" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }} of {{ pageCount }}</span>
        <button type="button" :disabled="currentPage === pageCount" @click="currentPage++">Next</button>
      </nav>
    </section>

    <section class="section">
      <h2>Presentation</h2>
      <p>Paste the selected character directly into the component's default slot.</p>
      <CCodeBlock :code="emojiUsage" />
      <div class="example-row">
        <div class="example">
          <CIcon size="16px">🍇</CIcon>
          <code>&lt;CIcon&gt;🍇&lt;/CIcon&gt;</code>
        </div>
        <div class="example">
          <CIcon display="circle" size="18px">📦</CIcon>
          <code>18px circle</code>
        </div>
        <div class="example">
          <CIcon size="24px" :rotate="-0.25" label="Launching">🚀</CIcon>
          <code>:rotate="-0.25"</code>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped lang="scss" src="./glyph-demo.scss"></style>
