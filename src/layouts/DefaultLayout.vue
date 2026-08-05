<script setup lang="ts">
import { CAppBar, CMenu } from '@/index'

import { useTopNavigation } from './useLayoutNavigation'

const navigation = useTopNavigation()
</script>

<template>
  <div class="demo-layout">
    <CAppBar tag="header" aria-label="Application header">
      <template #start>
        <RouterLink class="demo-layout__brand" to="/">Concise UI</RouterLink>
        <CMenu :items="navigation" orientation="horizontal" aria-label="Primary navigation" />
      </template>
    </CAppBar>

    <main class="demo-layout__main">
      <RouterView />
    </main>
  </div>
</template>
