<script setup lang="ts">
import { ref } from 'vue'

import { CDataTable, CSeparator } from '@/index'
import type { CDataTableColumn, CDataTableQuery } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const warehouses = ['Central', 'North', 'South', 'East']
const owners = ['Maya', 'Ravi', 'Elena', 'Noah']
const sourceRows = Array.from({ length: 47 }, (_, index) => ({
  id: 1001 + index,
  name: `Stock movement ${String(index + 1).padStart(2, '0')}`,
  warehouse: warehouses[index % warehouses.length],
  pic: owners[index % owners.length],
  status: index % 3 === 0 ? 'Open' : index % 3 === 1 ? 'Approved' : 'In transit',
}))
const frozenRows = sourceRows.slice(0, 18)

const rows = ref(sourceRows.slice(0, 10))
const page = ref(1)
const perPage = ref(10)
const total = ref(sourceRows.length)
const loading = ref(false)
const lastQuery = ref<CDataTableQuery | null>(null)
const filters = { module: 'inventory' }
let latestRequest = 0

async function callData(query: CDataTableQuery) {
  const request = ++latestRequest
  loading.value = true
  lastQuery.value = query

  await new Promise((resolve) => setTimeout(resolve, 350))
  if (request !== latestRequest) return

  const search = query.filters.search.trim().toLocaleLowerCase()
  const filteredRows = search
    ? sourceRows.filter((row) =>
        [row.id, row.name, row.warehouse, row.pic, row.status]
          .join(' ')
          .toLocaleLowerCase()
          .includes(search),
      )
    : sourceRows
  const start = (query.page - 1) * query.perPage

  rows.value = filteredRows.slice(start, start + query.perPage)
  page.value = query.page
  perPage.value = query.perPage
  total.value = filteredRows.length
  loading.value = false
}

const automaticRows = [
  { id: 1, name: 'Book', category: 'Office', stock: 42, internalCode: 'BOO' },
  { id: 2, name: 'Stove', category: 'Appliance', stock: 8, internalCode: 'STV' },
  { id: 3, name: 'Cable', category: 'Electrical', stock: 135, internalCode: 'CBL' },
]

const explicitColumns: CDataTableColumn[] = [
  { field: 'name', header: 'Product' },
  { field: 'stock', header: 'Available' },
  { field: 'id', header: 'ID' },
]

const stateColumns: CDataTableColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
]

const controlledUsage = `<script setup>
import { ref } from 'vue'

const rows = ref([])
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const loading = ref(false)
const filters = { module: 'inventory' }

async function callData(query) {
  loading.value = true
  const res = await getSomething(someUrl, query)

  rows.value = res.paginated.data
  page.value = res.paginated.current_page
  perPage.value = res.paginated.per_page
  total.value = res.paginated.total
  loading.value = false
}
<\/script>

<template>
  <CDataTable
    class="documents-table"
    :value="rows"
    :page="page"
    :per-page="perPage"
    :total="total"
    :loading="loading"
    :additional-filters="filters"
    paginator
    paginator-position="top"
    @query="callData"
  >
    <template #top-left><strong>Inventory movements</strong></template>

    <template #thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Warehouse</th>
        <th scope="col">PIC</th>
        <th scope="col">Status</th>
      </tr>
    </template>

    <template #tbody="{ data }">
      <tr v-for="row in data" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.warehouse }}</td>
        <td>{{ row.pic }}</td>
        <td>{{ row.status }}</td>
      </tr>
    </template>

    <template #tfoot>
      <tr><td colspan="5">{{ rows.length }} records on this page</td></tr>
    </template>
  </CDataTable>
</template>`

const generatedUsage = `<script setup>
const rows = [
  { id: 1, name: 'Book', category: 'Office', stock: 42, internalCode: 'BOO' },
  { id: 2, name: 'Stove', category: 'Appliance', stock: 8, internalCode: 'STV' },
  { id: 3, name: 'Cable', category: 'Electrical', stock: 135, internalCode: 'CBL' },
]

const columns = [
  { field: 'name', header: 'Product' },
  { field: 'stock', header: 'Available' },
  { field: 'id', header: 'ID' },
]
<\/script>

<template>
  <CDataTable
    :value="rows"
    auto-columns
    :exclude-fields="['internalCode']"
  >
    <template #top-left><strong>Automatic columns</strong></template>
    <template #top-right />
  </CDataTable>

  <CDataTable :value="rows" :columns="columns">
    <template #top-left><strong>Explicit order</strong></template>
    <template #top-right />
  </CDataTable>
</template>`

const frozenUsage = `<script setup>
const warehouses = ['Central', 'North', 'South', 'East']
const owners = ['Maya', 'Ravi', 'Elena', 'Noah']
const rows = Array.from({ length: 18 }, (_, index) => ({
  id: 1001 + index,
  name: 'Stock movement ' + String(index + 1).padStart(2, '0'),
  warehouse: warehouses[index % warehouses.length],
  pic: owners[index % owners.length],
  status: index % 3 === 0 ? 'Open' : index % 3 === 1 ? 'Approved' : 'In transit',
}))
<\/script>

<template>
  <div class="data-table-scroll">
    <CDataTable
      sticky-header
      :value="rows"
      style="min-width: 1050px"
      aria-label="Scrollable inventory movements"
    >
      <template #top-left><strong>Frozen inventory view</strong></template>
      <template #top-right>
        <span class="scroll-hint">Scroll horizontally and vertically</span>
      </template>

      <template #thead>
        <tr>
          <th scope="col" class="c-table-frozen-start frozen-id">ID</th>
          <th scope="col" class="name-column">Name</th>
          <th scope="col">Warehouse</th>
          <th scope="col">PIC</th>
          <th scope="col" class="c-table-frozen-end frozen-status">Status</th>
        </tr>
      </template>

      <template #tbody="{ data }">
        <tr v-for="row in data" :key="row.id">
          <td class="c-table-frozen-start frozen-id">{{ row.id }}</td>
          <td class="name-column">{{ row.name }}</td>
          <td>{{ row.warehouse }}</td>
          <td>{{ row.pic }}</td>
          <td class="c-table-frozen-end frozen-status">{{ row.status }}</td>
        </tr>
      </template>
    </CDataTable>
  </div>
</template>

<style scoped>
.data-table-scroll {
  max-height: 240px;
  overflow: auto;
}

.name-column {
  min-width: 240px;
}

.frozen-id {
  min-width: 70px;
}

.frozen-status {
  min-width: 105px;
}

.scroll-hint {
  color: var(--c-muted-text-color, #626a75);
  font-size: 12px;
  white-space: nowrap;
}
</style>`

const stateUsage = `<script setup>
const columns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
]
<\/script>

<template>
  <CDataTable :value="[]" :columns="columns" loading>
    <template #top-left><strong>Loading without rows</strong></template>
    <template #top-right />
    <template #loading>Refreshing inventory…</template>
  </CDataTable>

  <CDataTable :value="[]" :columns="columns">
    <template #top-left><strong>Custom empty state</strong></template>
    <template #top-right />
    <template #empty>No matching inventory records.</template>
  </CDataTable>
</template>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Data display</p><h1>Data Table</h1></div>
      <p>
        <code>CDataTable</code> composes <code>CTable</code> with parent-controlled querying,
        pagination, search, generated columns, and compact loading and empty states.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Parent-controlled data</h2>
      <p>
        The component never performs network requests or changes the supplied records. Search and
        paginator actions emit a complete <code>query</code>; the parent loads data and writes the
        resulting rows, page, page size, and total back into the props. No query is emitted on
        mount, so the parent remains responsible for its initial load.
      </p>
      <div class="preview data-preview">
        <CDataTable
          class="documents-table"
          :value="rows"
          :page="page"
          :per-page="perPage"
          :total="total"
          :loading="loading"
          :additional-filters="filters"
          paginator
          paginator-position="top"
          @query="callData"
        >
          <template #top-left><strong>Inventory movements</strong></template>

          <template #thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Warehouse</th>
              <th scope="col">PIC</th>
              <th scope="col">Status</th>
            </tr>
          </template>

          <template #tbody="{ data }">
            <tr v-for="row in data" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.warehouse }}</td>
              <td>{{ row.pic }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </template>

          <template #tfoot>
            <tr><td colspan="5">{{ rows.length }} records on this page</td></tr>
          </template>
        </CDataTable>
        <p class="query-readout">
          Last query:
          <code v-if="lastQuery">
            page {{ lastQuery.page }}, {{ lastQuery.perPage }} rows, search
            “{{ lastQuery.filters.search }}”, module “{{ lastQuery.filters.module }}”
          </code>
          <span v-else>Use search or pagination to emit one.</span>
        </p>
      </div>
      <CCodeBlock class="code-sample" :code="controlledUsage" />
    </section>

    <section class="section">
      <h2>Generated columns</h2>
      <p>
        Explicit <code>columns</code> define both displayed fields and order. Without explicit
        columns, <code>auto-columns</code> reads <code>Object.keys(value[0])</code> and creates readable
        headings. <code>exclude-fields</code> affects only automatic columns; it never removes an
        explicitly configured column.
      </p>
      <p>
        A custom <code>thead</code> or <code>tbody</code> replaces only its corresponding generated
        section. For example, an application can supply a custom body while retaining a header
        generated from <code>columns</code>.
      </p>
      <div class="preview data-preview example-stack">
        <CDataTable
          :value="automaticRows"
          auto-columns
          :exclude-fields="['internalCode']"
        >
          <template #top-left><strong>Automatic columns</strong></template>
          <template #top-right />
        </CDataTable>

        <CDataTable :value="automaticRows" :columns="explicitColumns">
          <template #top-left><strong>Explicit order</strong></template>
          <template #top-right />
        </CDataTable>
      </div>
      <CCodeBlock class="code-sample" :code="generatedUsage" />
    </section>

    <section class="section">
      <h2>Sticky header and frozen columns</h2>
      <p>
        Set <code>sticky-header</code> on <code>CDataTable</code> to propagate the behavior to its
        composed <code>CTable</code>. Apply <code>c-table-frozen-start</code> or
        <code>c-table-frozen-end</code> to the matching <code>th</code> and <code>td</code> cells in
        custom slots. Cells at the sticky-header intersections receive the correct higher layer.
      </p>
      <p>
        Sticky positioning needs a scrolling ancestor. This example also demonstrates that the
        inline <code>style</code> supplied to <code>CDataTable</code> reaches the underlying table and
        gives it enough width for horizontal scrolling.
      </p>
      <div class="preview data-preview">
        <div class="data-table-scroll">
          <CDataTable
            sticky-header
            :value="frozenRows"
            style="min-width: 1050px"
            aria-label="Scrollable inventory movements"
          >
            <template #top-left><strong>Frozen inventory view</strong></template>
            <template #top-right>
              <span class="scroll-hint">Scroll horizontally and vertically</span>
            </template>

            <template #thead>
              <tr>
                <th scope="col" class="c-table-frozen-start frozen-id">ID</th>
                <th scope="col" class="name-column">Name</th>
                <th scope="col">Warehouse</th>
                <th scope="col">PIC</th>
                <th scope="col" class="c-table-frozen-end frozen-status">Status</th>
              </tr>
            </template>

            <template #tbody="{ data }">
              <tr v-for="row in data" :key="row.id">
                <td class="c-table-frozen-start frozen-id">{{ row.id }}</td>
                <td class="name-column">{{ row.name }}</td>
                <td>{{ row.warehouse }}</td>
                <td>{{ row.pic }}</td>
                <td class="c-table-frozen-end frozen-status">{{ row.status }}</td>
              </tr>
            </template>
          </CDataTable>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="frozenUsage" />
    </section>

    <section class="section">
      <h2>Loading and empty data</h2>
      <p>
        Loading overlays existing rows rather than clearing them. With no rows, loading takes
        precedence over the empty state. Replace either default presentation through its named
        slot.
      </p>
      <div class="preview data-preview state-grid">
        <CDataTable :value="[]" :columns="stateColumns" loading>
          <template #top-left><strong>Loading without rows</strong></template>
          <template #top-right />
          <template #loading>Refreshing inventory…</template>
        </CDataTable>

        <CDataTable :value="[]" :columns="stateColumns">
          <template #top-left><strong>Custom empty state</strong></template>
          <template #top-right />
          <template #empty>No matching inventory records.</template>
        </CDataTable>
      </div>
      <CCodeBlock class="code-sample" :code="stateUsage" />
    </section>

    <section class="section">
      <h2>Table attributes and CTable behavior</h2>
      <p>
        Attributes not declared by <code>CDataTable</code> are forwarded to its underlying
        <code>CTable</code>. This includes <code>class</code>, <code>style</code>, native table
        attributes, and event listeners. They are not consumed by the outer data-table wrapper.
        The declared <code>sticky-header</code> property is passed directly to <code>CTable</code>.
      </p>
      <p>
        Frozen columns remain available by applying <code>c-table-frozen-start</code> or
        <code>c-table-frozen-end</code> to the relevant cells in custom table slots. Generated
        columns intentionally do not infer frozen positioning.
      </p>
      <p>
        There is no <code>CColumn</code> abstraction or context-menu integration. Rendering and row
        interactions remain ordinary Vue and native table markup owned by the parent.
      </p>
    </section>

    <section class="section">
      <h2>Query contract</h2>
      <p>
        Debounced search and page-size changes request page <code>1</code>. Navigation requests the
        selected page. <code>additional-filters</code> is shallow-copied into the emitted filters and
        is never mutated.
      </p>
      <CCodeBlock
        class="code-sample"
        language="javascript"
        :code="`{
  page: 2,
  perPage: 25,
  filters: {
    search: 'stock',
    module: 'inventory'
  }
}`"
      />
    </section>

    <section class="section">
      <h2>Properties, events, and slots</h2>
      <dl class="property-list">
        <div><dt><code>value</code></dt><dd>Rows currently supplied by the parent.</dd></div>
        <div><dt><code>page</code></dt><dd>Current one-based page. Defaults to <code>1</code>.</dd></div>
        <div><dt><code>per-page</code></dt><dd>Current page size. Defaults to <code>10</code>.</dd></div>
        <div><dt><code>total</code></dt><dd>Total records across all server pages. Defaults to <code>0</code>.</dd></div>
        <div><dt><code>loading</code></dt><dd>Shows the loading overlay and disables paginator controls.</dd></div>
        <div><dt><code>sticky-header</code></dt><dd>Passes sticky-header behavior through to the composed <code>CTable</code>.</dd></div>
        <div><dt><code>paginator</code></dt><dd>Enables pagination controls. Defaults to false.</dd></div>
        <div><dt><code>paginator-position</code></dt><dd><code>top</code>, <code>bottom</code>, or <code>both</code>. Defaults to <code>both</code>.</dd></div>
        <div><dt><code>per-page-options</code></dt><dd>Available page sizes. Defaults to <code>[10, 25, 50, 100]</code>.</dd></div>
        <div><dt><code>additional-filters</code></dt><dd>Parent-owned values copied into every emitted query.</dd></div>
        <div><dt><code>columns</code></dt><dd>Explicit <code>{ field, header }</code> definitions controlling displayed fields and order.</dd></div>
        <div><dt><code>auto-columns</code></dt><dd>Infers columns from the first row when explicit columns are absent.</dd></div>
        <div><dt><code>exclude-fields</code></dt><dd>Field names removed only from automatically inferred columns.</dd></div>
        <div><dt><code>@query</code></dt><dd>Emits the complete parent-controlled query after search or paginator actions.</dd></div>
        <div><dt><code>thead</code></dt><dd>Replaces the generated header.</dd></div>
        <div><dt><code>tbody</code></dt><dd>Replaces generated rows and receives <code>{ data: value }</code>.</dd></div>
        <div><dt><code>tfoot</code></dt><dd>Optional native table footer rows.</dd></div>
        <div><dt><code>top-left</code></dt><dd>Optional toolbar content. Empty by default.</dd></div>
        <div><dt><code>top-right</code></dt><dd>Replaces the default debounced search input.</dd></div>
        <div><dt><code>loading</code></dt><dd>Replaces the default loading indicator.</dd></div>
        <div><dt><code>empty</code></dt><dd>Replaces the default <code>No data</code> presentation.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.form-page .data-preview {
  max-width: none;
}

.example-stack,
.state-grid {
  display: grid;
  gap: 18px;
}

.query-readout {
  margin: 0;
  color: var(--c-muted-text-color, #626a75);
  font-size: 12px;
}

.data-table-scroll {
  max-height: 240px;
  overflow: auto;
}

.name-column {
  min-width: 240px;
}

.frozen-id {
  min-width: 70px;
}

.frozen-status {
  min-width: 105px;
}

.scroll-hint {
  color: var(--c-muted-text-color, #626a75);
  font-size: 12px;
  white-space: nowrap;
}
</style>
