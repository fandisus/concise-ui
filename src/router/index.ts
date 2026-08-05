import { createRouter, createWebHistory } from 'vue-router'

import ComponentsLayout from '@/layouts/ComponentsLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/_Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage,
        },
      ],
    },
    {
      path: '/components',
      component: ComponentsLayout,
      children: [
        {
          path: '',
          redirect: { name: 'app-bar-menu' },
        },
        {
          path: 'app-bar-menu',
          name: 'app-bar-menu',
          component: () => import('@/pages/components/AppBarMenu.vue'),
        },
        {
          path: 'sidebar',
          name: 'sidebar',
          component: () => import('@/pages/components/Sidebar.vue'),
        },
        {
          path: 'button',
          name: 'button',
          component: () => import('@/pages/components/Button.vue'),
        },
        {
          path: 'icon',
          name: 'icon',
          component: () => import('@/pages/components/Icon.vue'),
        },
        {
          path: 'emoji',
          name: 'emoji',
          component: () => import('@/pages/components/Emoji.vue'),
        },
      ],
    },
  ],
})

export default router
