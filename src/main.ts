import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin, vueQueryPluginOptions } from './tanstack'
import { i18n, initializeI18n } from './i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'

// Initialize i18n with stored locale preference
initializeI18n()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
