import "./assets/main.css"

import { createApp } from "vue"
import uiPlugin from "@nuxt/ui/vue-plugin"
import App from "./App.vue"
import { firebaseApp } from "./firebase"
import { VueFire, VueFireAuth } from "vuefire"
import router from "./router"

const app = createApp(App)

app.use(VueFire, { 
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
})

app.use(uiPlugin)
app.use(router)

app.mount("#app")
