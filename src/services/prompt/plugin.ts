import { createVNode, render } from 'vue'
import type { App, Plugin } from 'vue'

import CPromptHost from './CPromptHost.vue'
import { registerPromptHost } from './prompt'
import type { CPromptPluginOptions } from './types'

const installedApps = new WeakSet<App>()
let hostMounted = false

export const CPromptPlugin: Plugin<[CPromptPluginOptions?]> = {
  install(app, options = {}) {
    if (installedApps.has(app)) return
    installedApps.add(app)

    if (typeof document === 'undefined' || hostMounted) return
    hostMounted = true
    registerPromptHost()

    const container = document.createElement('div')
    container.dataset.cPromptHost = ''
    document.body.append(container)

    const host = createVNode(CPromptHost, { teleportTo: options.teleportTo })
    host.appContext = app._context
    render(host, container)
  },
}
