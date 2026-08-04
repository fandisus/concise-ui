import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
  plugins: [vue(), ...(command === 'serve' ? [vueDevTools()] : [])],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'ConciseUI',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'es' ? 'concise-ui.js' : 'concise-ui.umd.cjs',
      cssFileName: 'concise-ui',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}))
