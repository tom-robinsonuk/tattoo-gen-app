//import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import router from './router'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
