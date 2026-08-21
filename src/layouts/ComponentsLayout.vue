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
          <RouterLink class="docs-brand" to="/" aria-label="Concise UI home">
            <img src="/concise-ui-mark.png" alt="" width="30" height="30" />
            <span>
              <strong>concise-ui</strong>
              <small>Component docs</small>
            </span>
          </RouterLink>
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

<style scoped lang="scss">
.docs-brand {
  display: flex;
  align-items: center;
  min-width: 0;
  color: var(--c-text-color, #20242a);
  text-decoration: none;
  gap: 7px;

  img {
    flex: none;
    object-fit: contain;
  }

  span {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.15;
  }

  strong {
    color: #0f172a;
    font-size: 14px;
    letter-spacing: -0.01em;
  }

  small {
    margin-top: 2px;
    color: var(--c-muted-text-color, #626a75);
    font-size: 10px;
  }

  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid var(--c-focus-color, #3578c6);
    outline-offset: 2px;
  }
}
</style>
