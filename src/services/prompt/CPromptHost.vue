<script setup lang="ts">
import CPromptInstance from './CPromptInstance.vue'
import { activePrompt, multiplePrompts } from './prompt'

defineProps<{ teleportTo?: string | HTMLElement }>()
</script>

<template>
  <CPromptInstance
    v-if="activePrompt"
    :key="activePrompt.id"
    :request="activePrompt"
    :teleport-to="teleportTo"
  />
  <CPromptInstance
    v-for="request in multiplePrompts"
    :key="request.id"
    :request="request"
    :teleport-to="teleportTo"
    multiple
  />
</template>
