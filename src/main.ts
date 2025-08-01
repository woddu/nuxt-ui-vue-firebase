import "./assets/main.css"

import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import uiPlugin from "@nuxt/ui/vue-plugin"
import App from "./App.vue"
import { firebaseApp } from "./firebase"
import { VueFire, VueFireAuth } from "vuefire"
import StudentsView from "./views/StudentsView.vue"

const app = createApp(App)

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./views/HomeView.vue"),
    },
    {
      path: "/students",
      name: "Students",
      component: StudentsView,
    },
  ],
  history: createWebHistory(),
})

app.use(VueFire, { 
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
})

app.use(uiPlugin)
app.use(router)

app.mount("#app")
