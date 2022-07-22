import { createApp } from 'vue'
import App from './App.vue'

import Design from '@q/design'
import '@q/design/dist/design.css'

const app = createApp(App)
app.use(Design).mount('#app')
