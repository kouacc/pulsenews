import './assets/css/style.css'
import V3ScrollLock from 'v3-scroll-lock'

import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(
  createRouter({
    history: createWebHistory()
  })
)
app.use(pinia)
app.use(V3ScrollLock, {})

app.mount('#app')
