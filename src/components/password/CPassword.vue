<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import CButton from '../button/CButton.vue'
import { useFormControl } from '../form/useFormControl'
import type { CFormControlSize } from '../form/types'
import CInput from '../input/CInput.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    size?: CFormControlSize
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
    revealable?: boolean
    visible?: boolean
  }>(),
  {
    modelValue: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    revealable: true,
    visible: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:visible': [visible: boolean]
}>()

const internalVisible = ref(false)
const isVisible = computed(() => props.visible ?? internalVisible.value)
const { controlId, describedBy, invalid, required } = useFormControl(props)

watch(
  () => props.visible,
  (visible) => {
    if (visible !== undefined) internalVisible.value = visible
  },
)

function toggleVisibility() {
  const visible = !isVisible.value
  internalVisible.value = visible
  emit('update:visible', visible)
}
</script>

<template>
  <div class="c-password" :class="[`is-${size}`, { 'is-invalid': invalid }]">
    <CInput
      v-bind="$attrs"
      class="input"
      :id="controlId"
      :model-value="modelValue"
      :type="isVisible ? 'text' : 'password'"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :aria-describedby="describedBy"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <CButton
      v-if="revealable"
      class="toggle"
      :size="size"
      :icon="isVisible ? '⊘' : '◉'"
      :disabled="disabled"
      :aria-controls="controlId"
      :aria-pressed="isVisible"
      :aria-label="isVisible ? 'Hide password' : 'Show password'"
      @click="toggleVisibility"
    />
  </div>
</template>

<style scoped lang="scss">
.c-password {
  display: flex;
  width: 100%;
  min-width: 0;

  .input {
    flex: 1 1 auto;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  .toggle {
    flex: none;
    margin-inline-start: -1px;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
}
</style>
