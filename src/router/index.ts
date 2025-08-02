import { createRouter, createWebHistory } from "vue-router"
import StudentsView from "@/views/StudentsView.vue"
import type { Router, RouterOptions } from "vue-router"
import { getAuth } from "firebase/auth";

const router: Router = createRouter({
  routes: [
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/RegisterView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/students",
      name: "Students",
      component: StudentsView,
      meta: { requiresAuth: true },
    },
  ],
  history: createWebHistory(),
} as RouterOptions)

// Global navigation guard to check authentication
router.beforeEach((to, from, next) => {
  
  if (to.matched.some(record => record.meta.requiresAuth) && !getAuth().currentUser) {
    next({ name: "Register" });
  } else {
    next();
  }
});

export default router