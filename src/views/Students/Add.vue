<script setup lang="ts">
import { sectionsRef, studentsRef } from '@/firebase';
import { Section, SelectOptions, Student } from '@/interfaces';
import { FormError } from '@nuxt/ui';
import { addDoc } from 'firebase/firestore';
import { watch } from 'vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection } from 'vuefire';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const toast = useToast()


const { data: sections, pending: sectionsPending } = useCollection<Section>(sectionsRef)

const genderOptions = ref<SelectOptions[]>([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]);

const sectionOptions = ref<SelectOptions[]>([]);


const student = reactive<Student>({
  id: '',
  lastname: '',
  firstname: '',
  middlename: '',
  age: 0,
  gender: 'other',
  section: 'N/A'
});

const isLoading = ref(false)

const validate = (state: Student): FormError[] => {
  const errors = [];
  if (!state.lastname) errors.push({ name: 'lastname', message: 'Last Name is required' });
  if (!state.firstname) errors.push({ name: 'firstname', message: 'First Name is required' });
  if (!state.age || state.age <= 0) errors.push({ name: 'age', message: 'Age must be a positive number' });
  if (!state.gender) errors.push({ name: 'gender', message: 'Gender is required' });
  if (!state.section) errors.push({ name: 'section', message: 'Section is required' });
  return errors;
}

const addStudent = async () => {
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
  }

  isLoading.value = true;
  await addDoc(studentsRef, student as Student)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastname} added successfully.`, color: 'success' })
      router.push({ name: 'students' });
    })
    .catch((error) => {
      console.error("Error adding student: ", error);
      toast.add({ title: 'Error', description: `Failed to add student: ${error.message}`, color: 'error' })
    })
    .finally(() => {
      isLoading.value = false;
    });
}

watch(sections, () => {
  sectionOptions.value = sections.value.map(section => ({
    label: section.name,
    value: section.name
  }));
  emit('loading', sectionsPending.value);
});

</script>

<template>
  <PageHeaderTitle title="Add Student" />

  <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="student" @submit="addStudent()">
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Last Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.lastname" type="text" placeholder="Enter last name" required />
      </UFormField>
      <UFormField label="First Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.firstname" type="text" placeholder="Enter first name" required />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Middle Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.middlename" type="text" placeholder="Enter middle name (optional)" />
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
        <USelect class="w-full" v-model="student.section" :items="sectionOptions" />
      </UFormField>
    </div>
    <div class="flex justify-end">
      <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" type="submit" label="Add"
        class="mt-6" />
    </div>
  </UForm>
</template>