import { createVNode, render } from 'vue'
import type { App, Plugin } from 'vue'

import CToastHost from './CToastHost.vue'
import { registerToastHost } from './toast'
import type { CToastPluginOptions } from './types'

const installedApps = new WeakSet<App>()
let hostMounted = false

export const CToastPlugin: Plugin<[CToastPluginOptions?]> = {
  install(app, options = {}) {
    if (installedApps.has(app)) return
    installedApps.add(app)

    if (typeof document === 'undefined' || hostMounted) return
    hostMounted = true
    registerToastHost()

    const container = document.createElement('div')
    container.dataset.cToastHost = ''
    document.body.append(container)

    const host = createVNode(CToastHost, options)
    host.appContext = app._context
    render(host, container)
  },
}
