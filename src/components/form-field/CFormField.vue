<script setup lang="ts">
import { computed, provide, useId, useSlots } from 'vue'

import { cFormFieldKey } from './context'

const props = withDefaults(
  defineProps<{
    label?: string
    for?: string
    hint?: string
    error?: string
    required?: boolean
    invalid?: boolean
  }>(),
  {
    label: undefined,
    for: undefined,
    hint: undefined,
    error: undefined,
    required: false,
    invalid: false,
  },
)

const slots = useSlots()
const uid = useId()
const controlId = computed(() => props.for ?? `c-field-${uid}`)
const hasHint = computed(() => Boolean(props.hint || slots.hint))
const hasError = computed(() => Boolean(props.error || slots.error))
const invalid = computed(() => props.invalid || hasError.value)
const hintId = computed(() => `${controlId.value}-hint`)
const errorId = computed(() => `${controlId.value}-error`)
const describedBy = computed(() => {
  const ids = []
  if (hasHint.value) ids.push(hintId.value)
  if (hasError.value) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

provide(cFormFieldKey, {
  controlId,
  describedBy,
  invalid,
  required: computed(() => props.required),
})
</script>

<template>
  <div class="c-form-field" :class="{ 'is-invalid': invalid }">
    <label v-if="label || $slots.label" class="label" :for="controlId">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="required" aria-hidden="true">*</span>
    </label>

    <div class="control">
      <slot
        :id="controlId"
        :described-by="describedBy"
        :invalid="invalid"
        :required="required"
      />
    </div>

    <div v-if="hasHint" :id="hintId" class="hint">
      <slot name="hint">{{ hint }}</slot>
    </div>

    <div v-if="hasError" :id="errorId" class="error" role="alert">
      <slot name="error">{{ error }}</slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-form-field {
  display: grid;
  min-width: 0;
  gap: 4px;
  color: var(--c-text-color, #20242a);
  font-family: var(--c-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: var(--c-font-size, 13px);

  .label {
    width: fit-content;
    font-weight: 600;
    line-height: 1.3;
  }

  .required {
    margin-inline-start: 3px;
    color: var(--c-danger-color, #b42318);
  }

  .control {
    min-width: 0;
  }

  .hint,
  .error {
    font-size: 12px;
    line-height: 1.35;
  }

  .hint {
    color: var(--c-muted-text-color, #626a75);
  }

  .error {
    color: var(--c-danger-color, #b42318);
  }
}
</style>
