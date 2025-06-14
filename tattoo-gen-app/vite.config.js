// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // make sure this line exists
  ],
  define: { 'process.env': {} }            // quiets Vuetify warnings
})
