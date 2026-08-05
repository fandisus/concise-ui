<script setup lang="ts">
import { CAppBar, CMenu, CSideBar } from '@/index'

import { useComponentNavigation, useTopNavigation } from './useLayoutNavigation'

const navigation = useTopNavigation()
const componentNavigation = useComponentNavigation()
</script>

<template>
  <div class="demo-layout">
    <CAppBar tag="header" aria-label="Application header">
      <template #start>
        <RouterLink class="demo-layout__brand" to="/">Concise UI</RouterLink>
        <CMenu :items="navigation" orientation="horizontal" aria-label="Primary navigation" />
      </template>
    </CAppBar>

    <div class="demo-layout__workspace">
      <CSideBar width="220px" aria-label="Component navigation">
        <template #header>
          <strong>Components</strong>
        </template>

        <CMenu
          :items="componentNavigation"
          orientation="vertical"
          submenu-mode="inline"
          aria-label="Component pages"
        />
      </CSideBar>

      <main class="demo-layout__main demo-layout__main--with-sidebar">
        <RouterView />
      </main>
    </div>
  </div>
</template>
