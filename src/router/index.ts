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
          path: 'context-menu',
          name: 'context-menu',
          component: () => import('@/pages/components/ContextMenu.vue'),
        },
        {
          path: 'sidebar',
          name: 'sidebar',
          component: () => import('@/pages/components/Sidebar.vue'),
        },
        {
          path: 'panel',
          name: 'panel',
          component: () => import('@/pages/components/Panel.vue'),
        },
        {
          path: 'button',
          name: 'button',
          component: () => import('@/pages/components/Button.vue'),
        },
        {
          path: 'dialog',
          name: 'dialog',
          component: () => import('@/pages/components/Dialog.vue'),
        },
        {
          path: 'prompt',
          name: 'prompt',
          component: () => import('@/pages/components/Prompt.vue'),
        },
        {
          path: 'form-field',
          name: 'form-field',
          component: () => import('@/pages/components/FormField.vue'),
        },
        {
          path: 'input',
          name: 'input',
          component: () => import('@/pages/components/Input.vue'),
        },
        {
          path: 'debounce-input',
          name: 'debounce-input',
          component: () => import('@/pages/components/DebounceInput.vue'),
        },
        {
          path: 'number-input',
          name: 'number-input',
          component: () => import('@/pages/components/NumberInput.vue'),
        },
        {
          path: 'input-group',
          name: 'input-group',
          component: () => import('@/pages/components/InputGroup.vue'),
        },
        {
          path: 'text-area',
          name: 'text-area',
          component: () => import('@/pages/components/TextArea.vue'),
        },
        {
          path: 'password',
          name: 'password',
          component: () => import('@/pages/components/Password.vue'),
        },
        {
          path: 'checkbox',
          name: 'checkbox',
          component: () => import('@/pages/components/Checkbox.vue'),
        },
        {
          path: 'radio',
          name: 'radio',
          component: () => import('@/pages/components/Radio.vue'),
        },
        {
          path: 'select',
          name: 'select',
          component: () => import('@/pages/components/Select.vue'),
        },
        {
          path: 'multi-select',
          name: 'multi-select',
          component: () => import('@/pages/components/MultiSelect.vue'),
        },
        {
          path: 'auto-complete',
          name: 'auto-complete',
          component: () => import('@/pages/components/AutoComplete.vue'),
        },
        {
          path: 'progress-bar',
          name: 'progress-bar',
          component: () => import('@/pages/components/ProgressBar.vue'),
        },
        {
          path: 'toast',
          name: 'toast',
          component: () => import('@/pages/components/Toast.vue'),
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
