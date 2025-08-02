<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { reactive } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useRouter } from 'vue-router';

const auth = getAuth();

const router = useRouter();

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
    await createUserWithEmailAndPassword(auth, state.email, state.password)
        .then((data) =>{
            console.log('User registered successfully:', data.user);
            console.log(auth.currentUser);
            toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
            router.push('/');
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            toast.add({ title: 'Error', description: error.message, color: 'danger' });
        });
}

</script>

<template>
    <div class="authenticated-layout">
        <UCard class="max-w-md w-full p-6">
            <template #header>
                <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">Register</h1>                
            </template>
            
            <UForm :validate="validate" :state="state"  @submit="onSubmit">
                <div class="flex flex-col gap-4 justify-center">
                    <UFormField label="Email" class="w-full" size="lg">
                        <UInput class="w-full" v-model="state.email" type="email" placeholder="Enter your email" required />
                    </UFormField>
                    <UFormField label="Password" class="w-full" size="lg">
                        <UInput class="w-full" v-model="state.password" type="password" placeholder="Enter your password" required />
                    </UFormField>
                </div>
                <UButton type="submit" label="Register" class="mt-4" />
            </UForm>
        </UCard>
    </div>
</template>

<style scoped>
/* a responsive layout that centers a card for a registration form */
.authenticated-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>