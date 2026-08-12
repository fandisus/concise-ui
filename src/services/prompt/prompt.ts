import { shallowRef } from 'vue'

import type {
  CPromptConfirmOptions,
  CPromptInputOptions,
  CPromptMessageOptions,
  CPromptSelectOptions,
  CPromptService,
} from './types'

export type PromptKind = 'confirm' | 'input' | 'message' | 'select'
export type PromptTone = 'default' | 'error' | 'info' | 'success' | 'warning'

export interface PromptRequest {
  kind: PromptKind
  tone: PromptTone
  options:
    | CPromptConfirmOptions
    | CPromptInputOptions
    | CPromptMessageOptions
    | CPromptSelectOptions<unknown>
  resolve: (value: unknown) => void
}

export const activePrompt = shallowRef<PromptRequest | null>(null)

const queue: PromptRequest[] = []
let installed = false

export function registerPromptHost() {
  installed = true
}

function showNextPrompt() {
  if (!activePrompt.value) activePrompt.value = queue.shift() ?? null
}

function enqueue<T>(request: Omit<PromptRequest, 'resolve'>) {
  if (!installed) {
    return Promise.reject<T>(
      new Error('CPromptPlugin must be installed with app.use(CPromptPlugin) before using CPrompt.'),
    )
  }

  return new Promise<T>((resolve) => {
    queue.push({ ...request, resolve: resolve as (value: unknown) => void })
    showNextPrompt()
  })
}

function message(tone: PromptTone, options: CPromptMessageOptions) {
  return enqueue<void>({ kind: 'message', tone, options })
}

export function settlePrompt(value: unknown) {
  const request = activePrompt.value
  if (!request) return

  activePrompt.value = null
  request.resolve(value)
  queueMicrotask(showNextPrompt)
}

export function cancelPrompt() {
  const request = activePrompt.value
  if (!request) return

  settlePrompt(request.kind === 'confirm' ? false : request.kind === 'message' ? undefined : null)
}

export const CPrompt: CPromptService = {
  info: (options) => message('info', options),
  success: (options) => message('success', options),
  warning: (options) => message('warning', options),
  error: (options) => message('error', options),
  message: (options) => message('default', options),
  confirm: (options) => enqueue<boolean>({ kind: 'confirm', tone: 'default', options }),
  input: (options) => enqueue<string | null>({ kind: 'input', tone: 'default', options }),
  select: <T>(options: CPromptSelectOptions<T>) =>
    enqueue<T | null>({
      kind: 'select',
      tone: 'default',
      options: options as CPromptSelectOptions<unknown>,
    }),
}
