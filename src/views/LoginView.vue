<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Teacher } from '@/interfaces';

const auth = getAuth();

const router = useRouter();

const isLoading = ref(false);

const userStore = useUserStore();

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
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0].data();
      userStore.setUser(userDoc as Teacher); // Save Firestore user data into Pinia
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
        <UCard class="max-w-md w-full p-6" variant="subtle">
            <template #header>
                <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">Login</h1>                
            </template>
            
            <UForm :validate="validate" :state="state"  @submit="onSubmit">
                <div class="flex flex-col gap-4 justify-center">
                    <UFormField label="Email" class="w-full" size="xl">
                        <UInput
                          class="w-full"
                          v-model="state.email"
                          type="email"
                          placeholder="Enter your email"
                          required />
                    </UFormField>
                    <UFormField label="Password" class="w-full" size="xl">
                        <UInput
                          class="w-full"
                          v-model="state.password"
                          type="password"
                          placeholder="Enter your password"
                          required />
                    </UFormField>
                </div>
                <UButton
                  :disabled="isLoading"
                  type="submit"
                  label="Login"
                  class="mt-4" 
                  size="xl"/>
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
