import { createApp } from 'vue'
import App from './App.vue'
import VueCryptojs from 'vue-cryptojs'

createApp(App)
  .use(VueCryptojs)
    .mount('#main')
