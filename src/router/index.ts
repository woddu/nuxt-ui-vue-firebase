import { createRouter, createWebHistory } from "vue-router"
import StudentsView from "@/views/StudentsView.vue"
import type { Router, RouterOptions } from "vue-router"

const router: Router = createRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/students",
      name: "Students",
      component: StudentsView,
    },
  ],
  history: createWebHistory(),
} as RouterOptions)

export default router