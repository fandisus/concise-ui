<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { InputHTMLAttributes } from 'vue'

import type { CFormControlSize } from '../form/types'
import CInput from '../input/CInput.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    type?: InputHTMLAttributes['type']
    size?: CFormControlSize
    debounceWait?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'medium',
    debounceWait: 300,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  debounce: [value: string]
}>()

const isComposing = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
  if (debounceTimer === undefined) return

  clearTimeout(debounceTimer)
  debounceTimer = undefined
}

function scheduleDebounce(value: string) {
  clearTimer()

  const wait = Math.max(0, props.debounceWait)
  if (wait === 0) {
    emit('debounce', value)
    return
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = undefined
    emit('debounce', value)
  }, wait)
}

function updateValue(value: string) {
  emit('update:modelValue', value)
  if (!isComposing.value) scheduleDebounce(value)
}

function handleCompositionStart() {
  isComposing.value = true
  clearTimer()
}

function handleCompositionEnd(event: CompositionEvent) {
  isComposing.value = false
  scheduleDebounce((event.target as HTMLInputElement).value)
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <CInput
    v-bind="$attrs"
    class="c-debounce-input"
    :model-value="modelValue"
    :type="type"
    :size="size"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :invalid="invalid"
    @update:model-value="updateValue"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
  />
</template>

<style scoped lang="scss">
.c-debounce-input {
  min-width: 0;
}
</style>
