<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
    await signInWithEmailAndPassword(auth, state.email, state.password)
        .then((data) =>{
            console.log('User logged in successfully:', data.user);
            console.log(auth.currentUser);
            toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
            router.push('/');
        })
        .catch((error) => {
            console.error('Error logging in user:', error);
            switch(error.code) {
                case 'auth/invalid-email':
                    toast.add({ title: 'Error', description: 'Invalid email format.', color: 'danger' });
                    break;
                case 'auth/user-not-found':
                    toast.add({ title: 'Error', description: 'User not found. Please register first.', color: 'danger' });
                    break;
                case 'auth/wrong-password':
                    toast.add({ title: 'Error', description: 'Incorrect password. Please try again.', color: 'danger' });
                    break;
                default:
                    toast.add({ title: 'Error', description: error.message, color: 'danger' });
            }
            toast.add({ title: 'Error', description: error.message, color: 'danger' });
        });
}

</script>

<template>
    <GuestLayout>
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
    </GuestLayout>
</template>
