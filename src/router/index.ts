import { createRouter, createWebHistory } from "vue-router"
import type { RouteMeta, Router, RouterOptions } from "vue-router"
import { getAuth, User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/user";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Role, Teacher } from "@/interfaces";


function roleMeta(role: Role): RouteMeta {
  return {
    requiresAuth: true,
    requiresVerified: true,
    roles: [role],
  };
}

const adminMeta: RouteMeta   = roleMeta('admin');
const headTeacherMeta: RouteMeta = roleMeta('headteacher');
const teacherMeta: RouteMeta = roleMeta('teacher');

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
      meta: adminMeta,
    },
    {
      path: "/students",
      name: "Students",
      component: () => import("@/views/Admin/Students/StudentsView.vue"),
      meta: adminMeta,
      redirect: { name: "Students-List" },
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
          meta: adminMeta,
        },
        {
          path: "/students/edit/:id",
          name: "Edit-Student",
          component: () => import("@/views/Admin/Students/Edit.vue"),
          meta: adminMeta,
        },
        {
          path: "/students/add",
          name: "Add-Student",
          component: () => import("@/views/Admin/Students/Add.vue"),
          meta: adminMeta,
        },        
      ],
    },
    {
      path: "/sections",
      name: "Sections",
      component: () => import("@/views/Admin/SectionsView.vue"),
      meta: adminMeta,
    },
    {
      path: "/teachers",
      name: "Teachers",
      component: () => import("@/views/Admin/Teachers/TeachersView.vue"),
      meta: adminMeta,
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
          meta: adminMeta,
        },
        {
          path: "/teachers/add",
          name: "Add-Teacher",
          component: () => import("@/views/Admin/Teachers/Add.vue"),
          meta: adminMeta,
        },
        {
          path: "/teachers/edit/:id",
          name: "Edit-Teacher",
          component: () => import("@/views/Admin/Teachers/Edit.vue"),
          meta: adminMeta,
        },
        {
          path: "/teachers/assign/:id",
          name: "Assign-Teacher",
          component: () => import("@/views/Admin/Teachers/Assign.vue"),
          meta: adminMeta,
        }
      ]
    },
    {
      path: '/subjects',
      name: 'Subjects',
      component: () => import("@/views/Admin/SubjectsView.vue"),
      meta: adminMeta,    
    },
    {
      path: "/advisories",
      name: "Advisories",
      component: () => import("@/views/Teacher/Advisories/AdvisoriesView.vue"),
      meta: teacherMeta,
      redirect: { name: "Advisories-Sections" },
      children: [
        {
          path: "",
          name: "Advisories-Sections",
          component: () => import("@/views/Teacher/Advisories/Index.vue"),
          meta: teacherMeta,
        }
      ]
    },
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

  // Load Firestore user into Pinia if not already set
  if (userStore.user === null && currentUser) {
    const q = query(collection(db, "users"), where("email", "==", currentUser.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0].data();
      userStore.setUser(userDoc as Teacher); // or a broader User type
    } else {
      console.warn("No matching user document found in Firestore");
      userStore.setUser(null);
    }
  }

  const meta = to.meta as RouteMeta; // typed meta

  // 🔑 Auth required
  if (meta.requiresAuth) {
    if (!currentUser) {
      return next({ name: "Login" });
    }

    // 🔑 Verified required
    if (meta.requiresVerified && !userStore.user?.verified) {
      // return next({ name: "VerifyAccount" }); // or wherever you want to send them
    }

    // 🔑 Role check
    if (meta.roles && !meta.roles.includes(userStore.user?.role as Role)) {
      // redirect to a safe default depending on role
      if (userStore.user?.role === "teacher") {
        return next({ name: "Advisories" });
      } else {
        return next({ name: "Home" });
      }
    }
  } else {
    // If route does not require auth but user is logged in, redirect to home
    if (currentUser) {
      return next({ name: "Home" });
    }
  }

  return next();
});




export default router