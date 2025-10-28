<script setup lang="ts">
import GuestLayout from '@/components/layouts/GuestLayout.vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { reactive, ref } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useRouter } from 'vue-router';
import { addTeacher, getTeacherByEmail } from '@/services/teacherService';
import { Teacher } from '@/interfaces';

const auth = getAuth();

const router = useRouter();

const isLoading = ref(false)

const state = reactive({
    username: '',
    email: '',
    lastName: '',
    firstName: '',
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
    const errors = validate(state);
    if (errors.length) {
        let errorMessage = '';
        isLoading.value = false;
        errors.forEach((error) => {
            errorMessage += `${error.message}\n`;
        });
        toast.add({ title: "Error", description: errorMessage, color: "error" });
        return;
    }
    try {
        // 2. Query Firestore for the user document
        const snapshot = await getTeacherByEmail(state.email);

        if (!snapshot.empty) {
            toast.add({ title: "Error", description: "Email already in use.", color: "error" });
            isLoading.value = false;
            return;
        }

        const { user } = await createUserWithEmailAndPassword(auth, state.email, state.password)

        if (!user) {
            throw new Error('Failed to create user');
        }

        const newTeacher: Omit<Teacher, 'id'> = {
            email: user.email ?? '',
            firstName: state.firstName,
            lastName: state.lastName,
            username: state.username,
            verified: false,
            role: 'teacher'
        }

        addTeacher(newTeacher as Teacher)
            .catch((error) => {
                throw new Error('Failed to add teacher: ' + error.message);
            })
            .finally(() => {
                isLoading.value = false;
            })

        toast.add({ title: 'Success', description: 'Registered successfully.', color: 'success' })
        router.push('/Login');
    } catch (error: any) {
        toast.add({ title: 'Error', description: error.message, color: 'error' });
    } finally {
        isLoading.value = false
    }
}

</script>

<template>
    <GuestLayout :progress="isLoading">
        <UCard class="max-w-2xs sm:max-w-xs md:max-w-md w-full p-4 md:p-6" variant="soft">
            <template #header>
                <div class="w-full flex justify-center items-center">
                    <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">Register</h1>
                </div>
            </template>

            <UForm :validate="validate" :state="state" @submit="onSubmit">
                <div class="flex flex-col gap-4 justify-center">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <UFormField label="First Name" class="w-full" size="xl">
                            <UInput class="w-full" v-model="state.firstName" type="text" placeholder="Enter your first name" required />
                        </UFormField>
                        <UFormField label="Last Name" class="w-full" size="xl">
                            <UInput class="w-full" v-model="state.lastName" type="text" placeholder="Enter your last name" required />
                        </UFormField>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <UFormField label="Username" class="w-full" size="xl">
                            <UInput class="w-full" v-model="state.username" type="text" placeholder="Enter your username" required />
                        </UFormField>
                        <UFormField label="Email" class="w-full" size="xl">
                            <UInput class="w-full" v-model="state.email" type="email" placeholder="Enter your email"
                                required />
                        </UFormField>
                    </div>
                    <UFormField label="Password" class="w-full" size="xl">
                        <UInput class="w-full" v-model="state.password" type="password"
                            placeholder="Enter your password" required />
                    </UFormField>
                    <UButton :disabled="isLoading" type="submit" label="Register" class="mt-4 justify-center items-center" size="xl" />
                </div>
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
