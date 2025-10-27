import "./assets/main.css"

import { firebaseApp } from "./firebase"
import { VueFire, VueFireAuth } from "vuefire"
import router from "./router"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from "vue"
import uiPlugin from "@nuxt/ui/vue-plugin"
import App from "./App.vue"

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(VueFire, { 
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
})

app.use(uiPlugin)
app.use(router)
app.use(pinia)

app.mount("#app")
