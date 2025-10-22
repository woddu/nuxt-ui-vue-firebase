<script setup lang="ts">
import { useSections } from '@/composables/useSections';
import { SelectOptions, Student } from '@/interfaces';
import { addStudent } from '@/services/studentService';
import { FormError } from '@nuxt/ui';
import { onMounted, watch } from 'vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const toast = useToast()

const sections = useSections();

const genderOptions = ref<SelectOptions[]>([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]);

const sectionOptions = ref<SelectOptions[]>([]);


const student = reactive<Student>({
  id: '',
  lastName: '',
  firstName: '',
  middleName: '',
  age: 0,
  gender: 'other',
  sectionId: 'N/A'
});

const isLoading = ref(false)

const validate = (state: Student): FormError[] => {
  const errors = [];
  if (!state.lastName) errors.push({ name: 'lastName', message: 'Last Name is required' });
  if (!state.firstName) errors.push({ name: 'firstName', message: 'First Name is required' });
  if (!state.age || state.age <= 0) errors.push({ name: 'age', message: 'Age must be a positive number' });
  if (!state.gender) errors.push({ name: 'gender', message: 'Gender is required' });
  if (!state.sectionId) errors.push({ name: 'sectionId', message: 'Section is required' });
  return errors;
}

const addStudentHandler = async () => {
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
  }

  isLoading.value = true;
  addStudent(student)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastName} added successfully.`, color: 'success' })
      router.push({ name: 'Students' });
    })
    .catch((error) => {
      console.error("Error adding student: ", error);
      toast.add({ title: 'Error', description: `Failed to add student: ${error.message}`, color: 'error' })
    })
    .finally(() => {
      isLoading.value = false;
    });
}

watch(sections.data, (newVal) => {
  sectionOptions.value = newVal.map(section => ({
    label: section.name,
    value: section.name
  }));  
});

watch(sections.pending, (newVal) => {
  emit('loading', newVal);
});

onMounted(() => {
  emit('loading', sections.pending.value);
});

</script>

<template>
  <PageHeaderTitle title="Add Student" />

  <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="student" @submit="addStudentHandler()">
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Last Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.lastName" type="text" placeholder="Enter last name" required />
      </UFormField>
      <UFormField label="First Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.firstName" type="text" placeholder="Enter first name" required />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Middle Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.middleName" type="text" placeholder="Enter middle name (optional)" />
      </UFormField>
      <UFormField label="Age" class="w-full" size="xl">
        <UInput class="w-full" v-model.number="student.age" type="number" placeholder="Enter age" required min="1" />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Gender" class="w-full" size="xl">
        <USelect class="w-full" v-model="student.gender" :items="genderOptions" />
      </UFormField>
      <UFormField label="Section" class="w-full" size="xl">
        <USelect class="w-full" v-model="student.sectionId" :items="sectionOptions" />
      </UFormField>
    </div>
    <div class="flex justify-end">
      <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" type="submit" label="Add"
        class="mt-6" size="xl"/>
    </div>
  </UForm>
</template>