import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')