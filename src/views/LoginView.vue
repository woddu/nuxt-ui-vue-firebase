<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Teacher } from '@/interfaces';
import { getTeacherByEmail } from '@/services/teacherService';
import { useSubjectStore } from '@/stores/subject';
import { useSectionStore } from '@/stores/sections';
import { useTeacherStore } from '@/stores/teacherSubjects';

const auth = getAuth();

const router = useRouter();

const isLoading = ref(false);

const userStore = useUserStore();

const subjectsStore = useSubjectStore();

const sectionsStore = useSectionStore();

const teachersStore = useTeacherStore();

const state = reactive({
  email: '',
  password: ''
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  isLoading.value = true;

  try {
    // 1. Sign in with Firebase Auth
    const { user } = await signInWithEmailAndPassword(
      auth,
      state.email,
      state.password
    );

    // 2. Query Firestore for the user document
    const snapshot = await getTeacherByEmail(user?.email ?? "");

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const userDoc = { id: docSnap.id, ...docSnap.data() };

      userStore.setUser(userDoc as Teacher); // Save Firestore user data into Pinia
      console.log("User data loaded:", userDoc);
      console.log("User Store:", userStore.user);
      if (userStore.user?.role === 'admin') {
        subjectsStore.start();
        sectionsStore.start();
      } else if (userStore.user?.role === 'teacher') {
        teachersStore.start(userStore.user?.id);
      }
    } else {
      console.warn("No matching user document found in Firestore");
      userStore.setUser(null);
    }

    // 3. Success feedback
    toast.add({
      title: "Success",
      description: "Logged in successfully.",
      color: "success",
    });

    router.push("/");
    isLoading.value = false;
  } catch (error: any) {
    console.error("Error logging in user:", error);

    switch (error.code) {
      case "auth/invalid-email":
        toast.add({
          title: "Error",
          description: "Invalid email format.",
          color: "error",
        });
        break;
      case "auth/user-not-found":
        toast.add({
          title: "Error",
          description: "User not found. Please register first.",
          color: "error",
        });
        break;
      case "auth/wrong-password":
        toast.add({
          title: "Error",
          description: "Incorrect password. Please try again.",
          color: "error",
        });
        break;
      case "auth/invalid-credential":
        toast.add({
          title: "Error",
          description: "Invalid credentials provided.",
          color: "error",
        });
        break;
      default:
        toast.add({
          title: "Error",
          description: error.message,
          color: "error",
        });
    }
  } finally {
    isLoading.value = false;
  }
}


</script>

<template>
  <GuestLayout :progress="isLoading">
    <UCard class="max-w-2xs sm:max-w-xs md:max-w-md w-full p-4 md:p-6" variant="subtle">
      <template #header>
        <div class="w-full flex justify-center items-center">
          <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted text-center">Login</h1>
        </div>
      </template>

      <UForm :validate="validate" :state="state" @submit="onSubmit">
        <div class="flex flex-col gap-4 justify-center">
          <UFormField label="Email" class="w-full" size="xl">
            <UInput class="w-full" v-model="state.email" type="email" placeholder="Enter your email" required />
          </UFormField>
          <UFormField label="Password" class="w-full" size="xl">
            <UInput class="w-full" v-model="state.password" type="password" placeholder="Enter your password"
              required />
          </UFormField>
          <UButton :disabled="isLoading" type="submit" label="Login" class="mt-4 justify-center items-center" size="xl" />
        </div>
      </UForm>
      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <ULink to="/register" class="text-primary hover:underline">Register here</ULink>
        </p>
      </template>

    </UCard>
  </GuestLayout>
</template>
