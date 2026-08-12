<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import CButton from '../../components/button/CButton.vue'
import type { CButtonVariant } from '../../components/button/types'
import CDialog from '../../components/dialog/CDialog.vue'
import CIcon from '../../components/icon/CIcon.vue'
import CInput from '../../components/input/CInput.vue'
import CSelect from '../../components/select/CSelect.vue'
import type { CSelectOption, CSelectValue } from '../../components/select/types'
import { activePrompt, cancelPrompt, settlePrompt } from './prompt'
import type {
  CPromptConfirmOptions,
  CPromptInputOptions,
  CPromptMessageOptions,
  CPromptSelectOptions,
} from './types'

defineProps<{
  teleportTo?: string | HTMLElement
}>()

const inputValue = ref('')
const selectedValue = ref<CSelectValue | null>(null)

const request = computed(() => activePrompt.value)
const options = computed(() => request.value?.options)
const messageOptions = computed(() => options.value as CPromptMessageOptions | undefined)
const confirmOptions = computed(() => options.value as CPromptConfirmOptions | undefined)
const inputOptions = computed(() => options.value as CPromptInputOptions | undefined)
const selectOptions = computed(() => options.value as CPromptSelectOptions<unknown> | undefined)
const isMessage = computed(() => request.value?.kind === 'message')
const isConfirm = computed(() => request.value?.kind === 'confirm')
const isInput = computed(() => request.value?.kind === 'input')
const isSelect = computed(() => request.value?.kind === 'select')
const inputRequired = computed(() => inputOptions.value?.required ?? true)
const canSubmitInput = computed(() => !inputRequired.value || inputValue.value.trim().length > 0)
const canSubmitSelect = computed(() => selectedValue.value !== null)
const confirmLabel = computed(() => {
  if (options.value?.confirmLabel) return options.value.confirmLabel
  if (isSelect.value) return 'Select'
  if (isConfirm.value) return 'Yes'
  return 'OK'
})

const defaultTitle = computed(() => {
  if (options.value?.title) return options.value.title
  if (!isMessage.value) return isConfirm.value ? 'Confirmation' : isInput.value ? 'Input' : 'Select'
  return {
    default: 'Message',
    error: 'Error',
    info: 'Information',
    success: 'Success',
    warning: 'Warning',
  }[request.value?.tone ?? 'default']
})

const defaultIcon = computed(() => {
  if (options.value?.icon) return options.value.icon
  return {
    default: 'i',
    error: '×',
    info: 'i',
    success: '✓',
    warning: '!',
  }[request.value?.tone ?? 'default']
})

const confirmVariant = computed<CButtonVariant>(() => {
  if (isConfirm.value) return confirmOptions.value?.confirmVariant ?? 'primary'
  if (isInput.value) return inputOptions.value?.confirmVariant ?? 'primary'
  if (isSelect.value) return selectOptions.value?.confirmVariant ?? 'primary'
  return 'primary'
})

const normalizedSelectOptions = computed(() => {
  const source = selectOptions.value?.options ?? []
  const optionLabel = selectOptions.value?.optionLabel

  return source.map<CSelectOption>((item) => {
    if (typeof item !== 'object' || item === null) {
      return { label: String(item), value: item as CSelectValue }
    }

    let label: unknown
    if (typeof optionLabel === 'function') label = optionLabel(item)
    else if (optionLabel) {
      label = optionLabel.split('.').reduce<unknown>((value, key) => {
        if (typeof value !== 'object' || value === null) return undefined
        return (value as Record<string, unknown>)[key]
      }, item)
    } else label = (item as Record<string, unknown>).label

    return { label: label == null ? '' : String(label), value: item }
  })
})

watch(
  request,
  (next) => {
    inputValue.value = next?.kind === 'input' ? (next.options as CPromptInputOptions).initialValue ?? '' : ''
    selectedValue.value = null
  },
  { immediate: true },
)

function submit() {
  if (isMessage.value) settlePrompt(undefined)
  else if (isConfirm.value) settlePrompt(true)
  else if (isInput.value && canSubmitInput.value) settlePrompt(inputValue.value)
  else if (isSelect.value && canSubmitSelect.value) settlePrompt(selectedValue.value)
}
</script>

<template>
  <CDialog
    :model-value="Boolean(request)"
    :title="defaultTitle"
    :size="options?.size"
    :width="options?.width"
    :allow-overflow="isSelect"
    :teleport-to="teleportTo"
    @update:model-value="!$event && cancelPrompt()"
  >
    <div class="c-prompt-content" :class="`is-${request?.tone ?? 'default'}`">
      <span v-if="defaultIcon" class="icon" aria-hidden="true"><CIcon>{{ defaultIcon }}</CIcon></span>

      <div class="content">
        <template v-if="isMessage">
          <div
            v-if="messageOptions?.unsafeHtml !== undefined"
            class="message"
            v-html="messageOptions.unsafeHtml"
          />
          <pre v-else-if="messageOptions?.preformatted" class="preformatted">{{ messageOptions.message }}</pre>
          <div v-else class="message">{{ messageOptions?.message }}</div>
        </template>

        <template v-else-if="isConfirm">
          <div class="question">{{ confirmOptions?.question }}</div>
        </template>

        <template v-else-if="isInput">
          <label class="question" for="c-prompt-input">{{ inputOptions?.question }}</label>
          <CInput
            id="c-prompt-input"
            v-model="inputValue"
            :placeholder="inputOptions?.placeholder"
            :required="inputRequired"
            autofocus
            @keydown.enter="submit"
          />
        </template>

        <template v-else-if="isSelect">
          <label class="question" for="c-prompt-select">{{ selectOptions?.question }}</label>
          <CSelect
            id="c-prompt-select"
            v-model="selectedValue"
            :options="normalizedSelectOptions"
            :placeholder="selectOptions?.placeholder"
            filterable
            required
            autofocus
          />
        </template>
      </div>
    </div>

    <template #footer>
      <CButton v-if="!isMessage" @click="cancelPrompt">
        {{ confirmOptions?.cancelLabel ?? inputOptions?.cancelLabel ?? selectOptions?.cancelLabel ?? 'Cancel' }}
      </CButton>
      <CButton
        :variant="confirmVariant"
        :disabled="(isInput && !canSubmitInput) || (isSelect && !canSubmitSelect)"
        @click="submit"
      >
        {{ confirmLabel }}
      </CButton>
    </template>
  </CDialog>
</template>

<style scoped lang="scss">
.c-prompt-content {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: start;
  gap: 9px;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--c-primary-color, #286aa6);
    font-size: 18px;
    font-weight: 700;
  }

  &.is-success .icon {
    color: var(--c-success-color, #2f7d32);
  }

  &.is-warning .icon {
    color: var(--c-warning-text-color, #7a4d00);
  }

  &.is-error .icon {
    color: var(--c-danger-color, #b42318);
  }

  .content {
    display: grid;
    min-width: 0;
    gap: 7px;
  }

  .question {
    font-weight: 600;
    line-height: 1.4;
  }

  .message {
    overflow-wrap: anywhere;
    line-height: 1.5;
  }

  .preformatted {
    max-height: 50vh;
    margin: 0;
    overflow: auto;
    font: 12px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
  }
}
</style>
