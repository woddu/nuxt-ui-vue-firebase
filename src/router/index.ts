import { createRouter, createWebHistory } from "vue-router"
import StudentsView from "@/views/StudentsView.vue"
import type { Router, RouterOptions } from "vue-router"
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const router: Router = createRouter({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
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

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(), 
      (user: any) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  document.title = `Vue Firebase - ${String(to.name)}`
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (!await getCurrentUser()) {
      next({ name: "Login" });
    }
    next();
  } else {
    if (await getCurrentUser()) {
      next({ name: "Home" });
    }
    next();
  }
});


export default router