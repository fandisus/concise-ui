<script setup lang="ts">
import CToast from '../../components/toast/CToast.vue'
import type { CToastItem, CToastPosition } from '../../components/toast/types'
import { handleServiceToastClose, serviceToasts } from './toast'

withDefaults(
  defineProps<{
    position?: CToastPosition
    duration?: number
    closable?: boolean
    teleportTo?: string | HTMLElement
    ariaLabel?: string
  }>(),
  {
    position: 'top-end',
    duration: 5000,
    closable: true,
    teleportTo: 'body',
    ariaLabel: 'Notifications',
  },
)

function updateToasts(items: CToastItem[]) {
  serviceToasts.value = items
}
</script>

<template>
  <CToast
    :model-value="serviceToasts"
    :position="position"
    :duration="duration"
    :closable="closable"
    :teleport-to="teleportTo"
    :aria-label="ariaLabel"
    @update:model-value="updateToasts"
    @close="handleServiceToastClose"
  />
</template>
