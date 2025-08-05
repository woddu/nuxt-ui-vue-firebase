<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useRouter } from 'vue-router';

const auth = getAuth();

const router = useRouter();

const isLoading = ref(false)

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
    isLoading.value = true
    await createUserWithEmailAndPassword(auth, state.email, state.password)
        .then((data) =>{
            // console.log('User registered successfully:', data.user);
            // console.log(auth.currentUser);
            toast.add({ title: 'Success', description: 'Registered successfully.', color: 'success' })
            router.push('/');
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            toast.add({ title: 'Error', description: error.message, color: 'error' });
        }).finally(() => {
            isLoading.value = false
        });
}

</script>

<template>
    <GuestLayout :progress="isLoading">
        <UCard class="max-w-md w-full p-6">
            <template #header>
                <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">Register</h1>                
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
                  label="Register"
                  class="mt-4" />
            </UForm>
            <template #footer>
                <p class="text-center text-sm text-gray-500">
                    Already have an account? 
                    <ULink to="/login" class="text-primary hover:underline">Login here</ULink>
                </p>
            </template>
        </UCard>
    </GuestLayout>
</template>
