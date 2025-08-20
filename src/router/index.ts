import { createRouter, createWebHistory } from "vue-router"
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
      component: () => import("@/views/Students/StudentsView.vue"),
      meta: { requiresAuth: true },
      redirect: { name: "students-list" },
      children: [
        {
          path: "",
          name: "students-overview",
          redirect: { name: "students-list" }
        },
        {
          path: "/students/list",
          name: "students-list",
          component: () => import("@/views/Students/Table.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/students/edit/:id",
          name: "edit-student",
          component: () => import("@/views/Students/Edit.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/students/add",
          name: "add-student",
          component: () => import("@/views/Students/Add.vue"),
          meta: { requiresAuth: true },
        },
        
      ],
    },
    {
      path: "/sections",
      name: "Sections",
      component: () => import("@/views/SectionsView.vue"),
      meta: { requiresAuth: true },
    }
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
  document.title = `Student Management Sys - ${String(to.name)}`
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