import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { CMenuEntry } from '@/index'

export function useTopNavigation() {
  const route = useRoute()
  const router = useRouter()

  return computed<CMenuEntry[]>(() => [
    {
      id: 'home',
      label: 'Home',
      icon: '⌂',
      active: route.name === 'home',
      command: () => void router.push({ name: 'home' }),
    },
    {
      id: 'components',
      label: 'Components',
      icon: '▦',
      active: route.path.startsWith('/components'),
      children: [
        {
          id: 'app-bar-menu',
          label: 'AppBar & Menu',
          icon: '☰',
          active: route.name === 'app-bar-menu',
          command: () => void router.push({ name: 'app-bar-menu' }),
        },
        {
          id: 'sidebar',
          label: 'Sidebar',
          icon: '◧',
          active: route.name === 'sidebar',
          command: () => void router.push({ name: 'sidebar' }),
        },
        { type: 'separator' },
        {
          id: 'button',
          label: 'Button',
          icon: '▭',
          active: route.name === 'button',
          command: () => void router.push({ name: 'button' }),
        },
        {
          id: 'icon',
          label: 'Icon',
          icon: '☆',
          active: route.name === 'icon',
          command: () => void router.push({ name: 'icon' }),
        },
        {
          id: 'emoji',
          label: 'Emoji',
          icon: '☺︎',
          active: route.name === 'emoji',
          command: () => void router.push({ name: 'emoji' }),
        },
      ],
    },
  ])
}

export function useComponentNavigation() {
  const route = useRoute()
  const router = useRouter()

  return computed<CMenuEntry[]>(() => [
    {
      id: 'app-bar-menu',
      label: 'AppBar & Menu',
      icon: '☰',
      active: route.name === 'app-bar-menu',
      command: () => void router.push({ name: 'app-bar-menu' }),
    },
    {
      id: 'sidebar',
      label: 'Sidebar',
      icon: '◧',
      active: route.name === 'sidebar',
      command: () => void router.push({ name: 'sidebar' }),
    },
    { type: 'separator' },
    {
      id: 'button',
      label: 'Button',
      icon: '▭',
      active: route.name === 'button',
      command: () => void router.push({ name: 'button' }),
    },
    {
      id: 'icon',
      label: 'Icon',
      icon: '☆',
      active: route.name === 'icon',
      command: () => void router.push({ name: 'icon' }),
    },
    {
      id: 'emoji',
      label: 'Emoji',
      icon: '☺︎',
      active: route.name === 'emoji',
      command: () => void router.push({ name: 'emoji' }),
    },
  ])
}
