import { createRouter, createWebHistory } from "vue-router"
import type { Router, RouterOptions } from "vue-router"
import { getAuth, User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/user";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Teacher } from "@/interfaces";

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
      component: () => import("@/views/Admin/HomeView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/students",
      name: "Students",
      component: () => import("@/views/Admin/Students/StudentsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: { name: "students-list" },
      children: [
        {
          path: "",
          name: "Students-Overview",
          redirect: { name: "Students-List" }
        },
        {
          path: "/students/list",
          name: "Students-List",
          component: () => import("@/views/Admin/Students/Table.vue"),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: "/students/edit/:id",
          name: "Edit-Student",
          component: () => import("@/views/Admin/Students/Edit.vue"),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: "/students/add",
          name: "Add-Student",
          component: () => import("@/views/Admin/Students/Add.vue"),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        
      ],
    },
    {
      path: "/sections",
      name: "Sections",
      component: () => import("@/views/Admin/SectionsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/advisories",
      name: "Advisories",
      component: () => import("@/views/Teacher/AdvisoriesView.vue"),
      meta: { requiresAuth: true, requiresTeacher: true },
    },
    {
      path: "/teachers",
      name: "Teachers",
      component: () => import("@/views/Admin/Teachers/TeachersView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: { name: "Teachers-List" },
      children: [
        {
          path: "",
          name: "Teachers-Overview",
          redirect: { name: "Teachers-List" }
        },
        {
          path: "/teachers/list",
          name: "Teachers-List",
          component: () => import("@/views/Admin/Teachers/Table.vue"),
          meta: { requiresAuth: true, requiresAdmin: true },
        },
      ]
    }
  ],
  history: createWebHistory(),
} as RouterOptions)

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user); // user is User | null
      },
      reject
    );
  });
};


router.beforeEach(async (to, from, next) => {
  document.title = `Student Management Sys - ${String(to.name)}`;
  const currentUser = await getCurrentUser();
  const userStore = useUserStore();

  if (userStore.user === null && currentUser) {
    const q = query(collection(db, "users"), where("email", "==", currentUser.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0].data();
      userStore.setUser(userDoc as Teacher); // Save Firestore user data into Pinia
    } else {
      console.warn("No matching user document found in Firestore");
      userStore.setUser(null);
    }
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (!currentUser) {
      return next({ name: "Login" });
    }

    // 🔑 check admin requirement
    if (to.matched.some((record: any) => record.meta.requiresAdmin)) {
      if (userStore.user?.role !== "admin") {
        // redirect non-admins to a safe page
        return next({ name: "Advisories" }); 
      }
    } else if (to.matched.some((record: any) => record.meta.requiresTeacher)) {
      if (userStore.user?.role !== "teacher") {
        // redirect non-teachers to a safe page
        return next({ name: "Home" }); 
      }
    }

    return next();
  } else {
    if (currentUser) {
      return next({ name: "Home" });
    }
    return next();
  }
});



export default router