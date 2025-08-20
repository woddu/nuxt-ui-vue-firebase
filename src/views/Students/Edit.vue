<script setup lang="ts">
import { sectionsRef, studentsRef } from '@/firebase';
import { Section, SelectOptions, Student } from '@/interfaces';
import { FormError } from '@nuxt/ui';
import { doc, updateDoc } from 'firebase/firestore';
import { reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCollection, useDocument } from 'vuefire';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const toast = useToast()

const studentDocRef = doc(studentsRef, router.currentRoute.value.params.id as string);

const { data: studentDoc, pending: studentPending } = useDocument(studentDocRef)

const { data: sections, pending: sectionsPending } = useCollection<Section>(sectionsRef)

const genderOptions = ref<SelectOptions[]>([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]);

const sectionOptions = ref<SelectOptions[]>([]);

const student = reactive<Student>({
  id: studentDoc.value?.id || '',
  lastname: studentDoc.value?.lastname || '',
  firstname: studentDoc.value?.firstname || '',
  middlename: studentDoc.value?.middlename || '',
  age: studentDoc.value?.age || 0,
  gender: studentDoc.value?.gender || '',
  section: studentDoc.value?.section || ''
});

const isLoading = ref(false);

const validate = (state: Student): FormError[] => {
  const errors = [];
  if (!state.lastname) errors.push({ name: 'lastname', message: 'Last Name is required' });
  if (!state.firstname) errors.push({ name: 'firstname', message: 'First Name is required' });
  if (!state.age || state.age <= 0) errors.push({ name: 'age', message: 'Age must be a positive number' });
  if (!state.gender) errors.push({ name: 'gender', message: 'Gender is required' });
  if (!state.section) errors.push({ name: 'section', message: 'Section is required' });
  return errors;
}

const editStudent = async () => {
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
  }

  isLoading.value = true;
  emit('loading', isLoading.value);
  await updateDoc(studentDocRef, student)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastname} updated successfully.`, color: 'success' })
      isLoading.value = false;
      emit('loading', isLoading.value);
      router.push({ name: 'students' });
    })
    .catch((error) => {
      console.error("Error updating student: ", error);
      toast.add({ title: 'Error', description: `Failed to update student: ${error.message}`, color: 'error' })
    })
    .finally(() => {
      isLoading.value = false;
      emit('loading', isLoading.value);
    });
};

watch(sections, () => {
  
  sectionOptions.value = sections.value.map(section => ({
    label: section.name,
    value: section.name
  }));
  emit('loading', sectionsPending.value);
});

watch(studentDoc, (newVal) => {
  if (!newVal) return;
  student.id = newVal.id;
  student.lastname = newVal.lastname;
  student.firstname = newVal.firstname;
  student.middlename = newVal.middlename;
  student.age = newVal.age;
  student.gender = newVal.gender;
  student.section = newVal.section;
  emit('loading', studentPending.value);
});

</script>

<template>
  <PageHeaderTitle :title="'Edit Student: ' + student.lastname + ', ' + student.firstname" />

  <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="student" @submit="editStudent()">
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Last Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.lastname" type="text" placeholder="Enter last name" required
          :disabled="studentPending" />
      </UFormField>
      <UFormField label="First Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.firstname" type="text" placeholder="Enter first name" required
          :disabled="studentPending" />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Middle Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.middlename" type="text" placeholder="Enter middle name (optional)"
          :disabled="studentPending" />
      </UFormField>
      <UFormField label="Age" class="w-full" size="xl">
        <UInput class="w-full" v-model.number="student.age" type="number" placeholder="Enter age" required min="1"
          :disabled="studentPending" />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Gender" class="w-full" size="xl">
        <USelect class="w-full" v-model="student.gender" :items="genderOptions" :disabled="studentPending" />
      </UFormField>
      <UFormField label="Section" class="w-full" size="xl">
        <USelect class="w-full" v-model="student.section" :items="sectionOptions" :disabled="studentPending" />
      </UFormField>
    </div>
    <div class="flex justify-start">
      <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading || studentPending" type="submit"
        label="Save" class="mt-6" size="xl" />
    </div>
  </UForm>
</template>
