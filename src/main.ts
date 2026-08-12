import { createApp } from 'vue'
import App from './App.vue'
import { CPromptPlugin } from './index'
import router from './router'
import './styles/demo.css'

createApp(App).use(router).use(CPromptPlugin).mount('#app')
