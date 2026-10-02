import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CPromptHost from '../services/prompt/CPromptHost.vue'
import {
  activePrompt,
  multiplePrompts,
  CPrompt,
  registerPromptHost,
  cancelPrompt,
} from '../services/prompt/prompt'

const originalMethods = new Map(
  ['show', 'showModal', 'close'].map((name) => [
    name,
    Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name),
  ]),
)

describe('CPrompt instances', () => {
  beforeEach(() => {
    registerPromptHost()
    for (const name of ['show', 'showModal', 'close'] as const) {
      Object.defineProperty(HTMLDialogElement.prototype, name, {
        configurable: true,
        value: vi.fn(function (this: HTMLDialogElement) {
          if (name === 'close') this.removeAttribute('open')
          else this.setAttribute('open', '')
        }),
      })
    }
  })

  afterEach(() => {
    cancelPrompt()
    for (const request of multiplePrompts.value) cancelPrompt(request)
    for (const [name, descriptor] of originalMethods) {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
      else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
    }
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('settles independent messages separately without advancing the queue', async () => {
    const first = CPrompt.message({ message: 'First' })
    const second = CPrompt.message({ message: 'Second' })
    const independent = CPrompt.message({ message: 'Independent', instanceMode: 'multiple' })
    const other = CPrompt.info({ message: 'Other', instanceMode: 'multiple' })
    expect(activePrompt.value?.options).toMatchObject({ message: 'First' })
    expect(multiplePrompts.value).toHaveLength(2)
    cancelPrompt(multiplePrompts.value[1])
    await other
    expect(multiplePrompts.value).toHaveLength(1)
    expect(activePrompt.value?.options).toMatchObject({ message: 'First' })
    cancelPrompt()
    await first
    await nextTick()
    expect(activePrompt.value?.options).toMatchObject({ message: 'Second' })
    cancelPrompt(multiplePrompts.value[0])
    await independent
    cancelPrompt()
    await second
  })

  it('renders iconless messages and dismisses only the active box on Escape', async () => {
    const first = CPrompt.message({ message: 'Iconless', instanceMode: 'multiple', icon: null })
    const second = CPrompt.info({ message: 'With icon', instanceMode: 'multiple' })
    const wrapper = mount(CPromptHost, { attachTo: document.body })
    await nextTick()
    await nextTick()
    const dialogs = document.body.querySelectorAll<HTMLDialogElement>('.c-dialog')
    expect(dialogs).toHaveLength(2)
    expect(dialogs[0]!.querySelector('.icon')).toBeNull()
    expect(dialogs[0]!.querySelector('.is-iconless')).not.toBeNull()
    expect(dialogs[1]!.querySelector('.icon')).not.toBeNull()
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
    dialogs[0]!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    await first
    await nextTick()
    expect(multiplePrompts.value).toHaveLength(1)
    expect(multiplePrompts.value[0]!.options).toMatchObject({ message: 'With icon' })
    cancelPrompt(multiplePrompts.value[0])
    await second
    wrapper.unmount()
  })
})
