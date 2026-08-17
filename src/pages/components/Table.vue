<script setup lang="ts">
import { CSeparator, CTable } from '@/index'
import CCodeBlock from '@/documentation/CCodeBlock.vue'

const rows = [
  { id: 1001, name: 'Inventory adjustment', owner: 'Maya', amount: 1240 },
  { id: 1002, name: 'Warehouse transfer', owner: 'Ravi', amount: 875 },
  { id: 1003, name: 'Purchase receipt', owner: 'Elena', amount: 2310 },
]

const scrollingRows = [
  { id: 2001, reference: 'TR-2401', warehouse: 'Central', owner: 'Maya', status: 'Open', quantity: 18, amount: 1240 },
  { id: 2002, reference: 'TR-2402', warehouse: 'North', owner: 'Ravi', status: 'Approved', quantity: 42, amount: 2875 },
  { id: 2003, reference: 'TR-2403', warehouse: 'South', owner: 'Elena', status: 'Open', quantity: 9, amount: 630 },
  { id: 2004, reference: 'TR-2404', warehouse: 'Central', owner: 'Noah', status: 'In transit', quantity: 27, amount: 1940 },
  { id: 2005, reference: 'TR-2405', warehouse: 'East', owner: 'Maya', status: 'Approved', quantity: 31, amount: 2210 },
  { id: 2006, reference: 'TR-2406', warehouse: 'North', owner: 'Ravi', status: 'Open', quantity: 16, amount: 1080 },
  { id: 2007, reference: 'TR-2407', warehouse: 'South', owner: 'Elena', status: 'In transit', quantity: 54, amount: 3620 },
  { id: 2008, reference: 'TR-2408', warehouse: 'Central', owner: 'Noah', status: 'Approved', quantity: 23, amount: 1575 },
  { id: 2009, reference: 'TR-2409', warehouse: 'East', owner: 'Maya', status: 'Open', quantity: 12, amount: 840 },
  { id: 2010, reference: 'TR-2410', warehouse: 'North', owner: 'Ravi', status: 'In transit', quantity: 38, amount: 2690 },
  { id: 2011, reference: 'TR-2411', warehouse: 'South', owner: 'Elena', status: 'Approved', quantity: 21, amount: 1450 },
  { id: 2012, reference: 'TR-2412', warehouse: 'Central', owner: 'Noah', status: 'Open', quantity: 47, amount: 3180 },
]

const basicUsage = `<script setup>
const rows = [
  { id: 1001, name: 'Inventory adjustment', owner: 'Maya', amount: 1240 },
  { id: 1002, name: 'Warehouse transfer', owner: 'Ravi', amount: 875 },
  { id: 1003, name: 'Purchase receipt', owner: 'Elena', amount: 2310 },
]
<\/script>

<template>
  <CTable aria-label="Recent inventory documents">
    <template #thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Description</th>
        <th scope="col">Owner</th>
        <th scope="col" class="numeric">Amount</th>
      </tr>
    </template>

    <template #tbody>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.owner }}</td>
        <td class="numeric">{{ row.amount.toLocaleString() }}</td>
      </tr>
    </template>

    <template #tfoot>
      <tr>
        <td colspan="3">Total</td>
        <td class="numeric">
          {{ rows.reduce((total, row) => total + row.amount, 0).toLocaleString() }}
        </td>
      </tr>
    </template>
  </CTable>
</template>

<style scoped>
.numeric {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
</style>`

const stickyUsage = `<div class="table-scroll-region">
  <CTable sticky-header class="wide-table" aria-label="Stock transfers">
    <template #thead>
      <tr>
        <th scope="col" class="c-table-frozen-start">ID</th>
        <th scope="col">Reference</th>
        <th scope="col">Warehouse</th>
        <th scope="col">Owner</th>
        <th scope="col">Status</th>
        <th scope="col" class="numeric">Quantity</th>
        <th scope="col" class="numeric c-table-frozen-end">Amount</th>
      </tr>
    </template>

    <template #tbody>
      <tr v-for="row in scrollingRows" :key="row.id">
        <td class="c-table-frozen-start">{{ row.id }}</td>
        <td>{{ row.reference }}</td>
        <td>{{ row.warehouse }}</td>
        <td>{{ row.owner }}</td>
        <td>{{ row.status }}</td>
        <td class="numeric">{{ row.quantity }}</td>
        <td class="numeric c-table-frozen-end">{{ row.amount.toLocaleString() }}</td>
      </tr>
    </template>
  </CTable>
</div>

<style scoped>
.table-scroll-region {
  max-height: 240px;
  overflow: auto;
}

.wide-table {
  min-width: 1050px;
}

.numeric {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
</style>`
</script>

<template>
  <article class="form-page">
    <header class="page-header">
      <div><p class="category">Data display</p><h1>Table</h1></div>
      <p>
        <code>CTable</code> supplies compact, consistent table styling while leaving rows, cells,
        and application data entirely under your control.
      </p>
    </header>
    <CSeparator />

    <section class="section">
      <h2>Table sections</h2>
      <p>
        Put table rows directly into the <code>thead</code>, <code>tbody</code>, and
        <code>tfoot</code> slots. The component creates the matching semantic HTML section around
        each supplied slot.
      </p>
      <div class="preview table-preview">
        <CTable aria-label="Recent inventory documents">
          <template #thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Description</th>
              <th scope="col">Owner</th>
              <th scope="col" class="numeric">Amount</th>
            </tr>
          </template>

          <template #tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.owner }}</td>
              <td class="numeric">{{ row.amount.toLocaleString() }}</td>
            </tr>
          </template>

          <template #tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td class="numeric">
                {{ rows.reduce((total, row) => total + row.amount, 0).toLocaleString() }}
              </td>
            </tr>
          </template>
        </CTable>
      </div>
      <CCodeBlock class="code-sample" :code="basicUsage" />
    </section>

    <section class="section">
      <h2>Sticky header and frozen columns</h2>
      <p>
        Add <code>sticky-header</code> to keep headings visible during vertical scrolling. Apply
        <code>c-table-frozen-start</code> to every header, body, and footer cell in the first column,
        or <code>c-table-frozen-end</code> to every cell in the last column. The intersections remain
        above both the scrolling header and body cells.
      </p>
      <div class="preview sticky-preview">
        <div class="table-scroll-region">
          <CTable sticky-header class="wide-table" aria-label="Stock transfers">
            <template #thead>
              <tr>
                <th scope="col" class="c-table-frozen-start">ID</th>
                <th scope="col">Reference</th>
                <th scope="col">Warehouse</th>
                <th scope="col">Owner</th>
                <th scope="col">Status</th>
                <th scope="col" class="numeric">Quantity</th>
                <th scope="col" class="numeric c-table-frozen-end">Amount</th>
              </tr>
            </template>

            <template #tbody>
              <tr v-for="row in scrollingRows" :key="row.id">
                <td class="c-table-frozen-start">{{ row.id }}</td>
                <td>{{ row.reference }}</td>
                <td>{{ row.warehouse }}</td>
                <td>{{ row.owner }}</td>
                <td>{{ row.status }}</td>
                <td class="numeric">{{ row.quantity }}</td>
                <td class="numeric c-table-frozen-end">{{ row.amount.toLocaleString() }}</td>
              </tr>
            </template>
          </CTable>
        </div>
      </div>
      <CCodeBlock class="code-sample" :code="stickyUsage" />
    </section>

    <section class="section">
      <h2>Native table markup</h2>
      <p>
        Use ordinary <code>tr</code>, <code>th</code>, and <code>td</code> elements inside the slots,
        including native attributes such as <code>colspan</code>, <code>rowspan</code>, and
        <code>scope</code>. Attributes placed on <code>CTable</code>, such as
        <code>aria-label</code>, are forwarded to the underlying table.
      </p>
      <p>
        Each section is optional. For example, a small result table can provide only
        <code>thead</code> and <code>tbody</code>. Sticky and frozen positioning uses the nearest
        scrolling ancestor, so place the table inside an application-owned element with
        <code>overflow: auto</code> and an appropriate width or maximum height.
      </p>
      <p>
        If another sticky element sits above the table, set <code>--c-table-sticky-top</code> on
        <code>CTable</code> to the required offset.
      </p>
    </section>

    <section class="section">
      <h2>Properties, classes, and slots</h2>
      <dl class="property-list">
        <div><dt><code>sticky-header</code></dt><dd>Makes header cells sticky at the top of their nearest scrolling ancestor.</dd></div>
        <div><dt><code>c-table-frozen-start</code></dt><dd>Freezes a start-edge cell during horizontal scrolling. Apply it to each cell in the first column.</dd></div>
        <div><dt><code>c-table-frozen-end</code></dt><dd>Freezes an end-edge cell during horizontal scrolling. Apply it to each cell in the last column.</dd></div>
        <div><dt><code>thead</code></dt><dd>Rows rendered inside the table's <code>thead</code>. Usually contains column headings.</dd></div>
        <div><dt><code>tbody</code></dt><dd>Rows rendered inside the table's <code>tbody</code>. Use normal Vue loops and conditions here.</dd></div>
        <div><dt><code>tfoot</code></dt><dd>Rows rendered inside the table's optional <code>tfoot</code>, commonly totals or summaries.</dd></div>
      </dl>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use './form-demo.scss';

.form-page .table-preview {
  max-width: none;
  overflow-x: auto;
}

.form-page .sticky-preview {
  max-width: none;
}

.table-scroll-region {
  max-height: 240px;
  overflow: auto;
}

.wide-table {
  min-width: 1050px;
}

.numeric {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
</style>
