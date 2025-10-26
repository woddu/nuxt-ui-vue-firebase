<script setup lang="ts">
import { useTeacherById } from '@/composables/useTeachers';
import { SelectOptions, Teacher } from '@/interfaces';
import { updateTeacher } from '@/services/teacherService';
import { FormError } from '@nuxt/ui';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const toast = useToast()

const isLoading = ref(false);

const { data: teacherDoc, pending: teacherPending } = useTeacherById(router.currentRoute.value.params.id as string);

const genderOptions = ref<SelectOptions[]>([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]);

const teacher = reactive<Teacher>({
    id: teacherDoc.value?.id || '',
    firstName: teacherDoc.value?.firstName || '',
    lastName: teacherDoc.value?.lastName || '',
    middleName: teacherDoc.value?.middleName || '',
    gender: teacherDoc.value?.gender || '',
    email: teacherDoc.value?.email || '',
    username: teacherDoc.value?.username || '',
    role: teacherDoc.value?.role || '',
    verified: teacherDoc.value?.verified || false
});

const validate = (state: Teacher): FormError[] => {
    const errors = [];
    if (!state.lastName) errors.push({ name: 'lastName', message: 'Last Name is required' });
    if (!state.firstName) errors.push({ name: 'firstName', message: 'First Name is required' });
    if (!state.email) errors.push({ name: 'email', message: 'Email is required' });
    if (!state.username) errors.push({ name: 'username', message: 'Username is required' });
    if (!state.verified) errors.push({ name: 'verified', message: 'Verified is required' });
    if (!state.gender) errors.push({ name: 'gender', message: 'Gender is required' });          
    return errors;
}

const editTeacherHandler = async () => {
    const errors = validate(teacher);
    if (errors.length > 0) {
      for (const error of errors) {
        toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
      }
      return;
    }

    isLoading.value = true;

    updateTeacher(teacher)
        .then(() => {
            toast.add({ title: 'Success', description: `Teacher: ${teacher.lastName} updated successfully.`, color: 'success' });
            // Redirect or reset form as needed
        })
        .catch((error) => {
            console.error("Error updating teacher: ", error);
            toast.add({ title: 'Error', description: 'An error occurred while updating the teacher.', color: 'error' });
        })
        .finally(() => {
            isLoading.value = false;
        });
}

watch(teacherDoc, (newVal) => {
    if (newVal) {
        teacher.id = newVal.id;
        teacher.firstName = newVal.firstName;
        teacher.lastName = newVal.lastName;
        teacher.middleName = newVal.middleName;
        teacher.gender = newVal.gender;
        teacher.email = newVal.email;
        teacher.username = newVal.username;
        teacher.role = newVal.role;
        teacher.verified = newVal.verified;
        emit('loading', teacherPending.value);
    }
});

watch(teacherPending, (newVal) => {
    emit('loading', newVal)
})

</script>

<template>
    <PageHeaderTitle :title="'Edit Teacher: ' + teacher.lastName + ', ' + teacher.firstName" />

    <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="teacher" @submit="editTeacherHandler()">
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Email" class="w-full" size="xl">
        <UInput class="w-full" v-model="teacher.email" type="email" placeholder="Enter email" required />
      </UFormField>
      <UFormField label="Username" class="w-full" size="xl">
        <UInput class="w-full" v-model="teacher.username" type="text" placeholder="Enter username" required />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Last Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="teacher.lastName" type="text" placeholder="Enter last name" required />
      </UFormField>
      <UFormField label="First Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="teacher.firstName" type="text" placeholder="Enter first name" required />
      </UFormField>
      <UFormField label="Middle Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="teacher.middleName" type="text" placeholder="Enter middle name (optional)" />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Age" class="w-full" size="xl">
        <UInput class="w-full" v-model.number="teacher.age" type="number" placeholder="Enter age" required min="1" />
      </UFormField>
      <UFormField label="Gender" class="w-full" size="xl">
        <USelect class="w-full" v-model="teacher.gender" :items="genderOptions" />
      </UFormField>
    </div>    
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Verified" class="w-full" size="xl">
        <USelect class="w-full" v-model="teacher.verified" :items="[
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]" />
      </UFormField>
      <UFormField label="Role" class="w-full" size="xl">
        <USelect class="w-full" v-model="teacher.role" :items="[
          { label: 'Teacher', value: 'teacher' },
          { label: 'Head Teacher', value: 'headteacher' },
          { label: 'Admin', value: 'admin' }
        ]" />
      </UFormField>
    </div>        
    <div class="flex justify-end">
      <UButton :loading="isLoading"  :disabled="isLoading" type="submit" label="Add"
        class="mt-6" size="xl"/>
    </div>
  </UForm>
</template>