import { ref } from 'vue'

import type {
  CToastCloseEvent,
  CToastItem,
  CToastVariant,
} from '../../components/toast/types'
import type {
  CToastSemanticItem,
  CToastServiceApi,
  CToastServiceCloseReason,
  CToastServiceItem,
} from './types'

export const serviceToasts = ref<CToastItem[]>([])

const sourceItems = new WeakMap<CToastItem, CToastServiceItem>()
let installed = false

export function registerToastHost() {
  installed = true
}

function requireHost() {
  if (!installed) {
    throw new Error(
      'CToastPlugin must be installed with app.use(CToastPlugin) before using CToastService.',
    )
  }
}

function show(item: CToastServiceItem) {
  requireHost()
  const renderedItem: CToastItem = {
    title: item.title,
    message: item.message,
    icon: item.icon,
    variant: item.variant,
    duration: item.duration,
    closable: item.closable,
  }
  sourceItems.set(renderedItem, item)
  serviceToasts.value.push(renderedItem)
}

function semantic(variant: CToastVariant, item: CToastSemanticItem) {
  show({ ...item, variant })
}

function notifyClose(item: CToastItem, reason: CToastServiceCloseReason) {
  const source = sourceItems.get(item)
  if (!source) return

  const event = { item: source, reason }
  try {
    if (reason === 'timeout') source.onAutoClose?.(event)
    else if (reason === 'dismiss') source.onUserClose?.(event)
  } finally {
    try {
      source.onClose?.(event)
    } finally {
      sourceItems.delete(item)
    }
  }
}

export function handleServiceToastClose(event: CToastCloseEvent) {
  notifyClose(event.item, event.reason)
}

export const CToastService: CToastServiceApi = {
  show,
  info: (item) => semantic('info', item),
  success: (item) => semantic('success', item),
  warning: (item) => semantic('warning', item),
  error: (item) => semantic('danger', item),
  clear() {
    requireHost()
    const items = serviceToasts.value
    serviceToasts.value = []
    for (const item of items) notifyClose(item, 'clear')
  },
}
