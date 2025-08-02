import { createRouter, createWebHistory } from "vue-router"
import StudentsView from "@/views/StudentsView.vue"
import type { Router, RouterOptions } from "vue-router"
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

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
  if (to.matched.some((record: any) => record.meta.requiresAuth) && !await getCurrentUser()) {
    next({ name: "Register" });
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if ((to.name === "Register" || to.name === "Login") && await getCurrentUser()) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router