<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';

const auth = getAuth();

const email = ref('');
const password = ref('');

const registerUser = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        // Handle successful registration (e.g., redirect or show a success message)
    } catch (error) {
        // Handle registration errors (e.g., show an error message)
    }
};
</script>

<template>
    <div class="authenticated-layout">
        <UCard class="max-w-md w-full p-6">
            <template #header>
                <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">Register</h1>                
            </template>
            
            <UForm @submit.prevent="registerUser">
                <div class="flex flex-col gap-4 justify-center">
                    <UFormField label="Email" class="w-full" size="lg">
                        <UInput v-model="email" type="email" placeholder="Enter your email" required />
                    </UFormField>
                    <UFormField label="Password" class="w-full" size="lg">
                        <UInput v-model="password" type="password" placeholder="Enter your password" required />
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