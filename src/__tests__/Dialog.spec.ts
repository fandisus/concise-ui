import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CDialog from '../components/dialog/CDialog.vue'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

function restoreDialogMethod(name: 'showModal' | 'close', descriptor?: PropertyDescriptor) {
  if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
}

function createPointerEvent(type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX,
    clientY,
  })

  Object.defineProperties(event, {
    isPrimary: { value: true },
    pointerId: { value: 1 },
  })
  return event
}

describe('CDialog dragging', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute('open', '')
      },
    })
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute('open')
      },
    })
  })

  afterEach(() => {
    restoreDialogMethod('showModal', originalShowModal)
    restoreDialogMethod('close', originalClose)
    document.body.innerHTML = ''
  })

  it('moves from the header and remains inside the viewport', async () => {
    const wrapper = mount(CDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Move dialog' },
    })
    await nextTick()

    const dialog = document.body.querySelector<HTMLDialogElement>('.c-dialog')!
    const surface = dialog.querySelector<HTMLElement>('.surface')!
    const header = dialog.querySelector<HTMLElement>('.header')!
    header.setPointerCapture = vi.fn<(pointerId: number) => void>()
    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 80,
      right: 500,
      bottom: 380,
      width: 400,
      height: 300,
      x: 100,
      y: 80,
      toJSON: () => undefined,
    })

    header.dispatchEvent(createPointerEvent('pointerdown', 200, 120))
    header.dispatchEvent(createPointerEvent('pointermove', 350, 270))
    await nextTick()

    expect(dialog.classList).toContain('is-dragging')
    expect(dialog.style.getPropertyValue('--c-dialog-x')).toBe('150px')
    expect(dialog.style.getPropertyValue('--c-dialog-y')).toBe('150px')

    header.dispatchEvent(createPointerEvent('pointermove', 2000, 2000))
    await nextTick()
    expect(dialog.style.getPropertyValue('--c-dialog-x')).toBe(`${window.innerWidth - 500}px`)
    expect(dialog.style.getPropertyValue('--c-dialog-y')).toBe(`${window.innerHeight - 380}px`)

    header.dispatchEvent(createPointerEvent('pointerup', 2000, 2000))
    await nextTick()
    expect(dialog.classList).not.toContain('is-dragging')

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    expect(dialog.style.getPropertyValue('--c-dialog-x')).toBe('0px')
    expect(dialog.style.getPropertyValue('--c-dialog-y')).toBe('0px')
    wrapper.unmount()
  })

  it('does not drag from controls or when dragging is disabled', async () => {
    const wrapper = mount(CDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Fixed dialog', draggable: false },
    })
    await nextTick()

    const dialog = document.body.querySelector<HTMLDialogElement>('.c-dialog')!
    expect(dialog.classList).not.toContain('is-draggable')

    await wrapper.setProps({ draggable: true })
    const closeButton = dialog.querySelector<HTMLElement>('.close-button')!
    closeButton.dispatchEvent(createPointerEvent('pointerdown', 10, 10))
    expect(dialog.classList).not.toContain('is-dragging')
    wrapper.unmount()
  })
})
