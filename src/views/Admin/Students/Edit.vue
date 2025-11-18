<script setup lang="ts">
import { useSections } from '@/composables/useSections';
import { useStudentById } from '@/composables/useStudents';
import { SelectOptions, Student } from '@/interfaces';
import { updateStudent } from '@/services/studentService';
import { FormError } from '@nuxt/ui';
import { reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const toast = useToast()


const { data: studentDoc, pending: studentPending } = useStudentById(router.currentRoute.value.params.id as string);

const { data: sections, pending: sectionsPending } = useSections();

const genderOptions = ref<SelectOptions[]>([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]);

const sectionOptions = ref<SelectOptions[]>([]);

const student = reactive<Student>({
  id: studentDoc.value?.id || '',
  lastName: studentDoc.value?.lastName || '',
  firstName: studentDoc.value?.firstName || '',
  middleName: studentDoc.value?.middleName || '',
  age: studentDoc.value?.age || 0,
  gender: studentDoc.value?.gender || '',
  sectionId: studentDoc.value?.sectionId || ''
});

const isLoading = ref(false);

const validate = (state: Student): FormError[] => {
  const errors = [];
  if (!state.lastName) errors.push({ name: 'lastName', message: 'Last Name is required' });
  if (!state.firstName) errors.push({ name: 'firstName', message: 'First Name is required' });
  if (!state.age || state.age <= 0) errors.push({ name: 'age', message: 'Age must be a positive number' });
  if (!state.gender) errors.push({ name: 'gender', message: 'Gender is required' });
  if (!state.sectionId) errors.push({ name: 'sectionId', message: 'Section is required' });
  return errors;
}

const editStudentHandler = async () => {
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
    return;
  }

  isLoading.value = true;
  emit('loading', isLoading.value);
  updateStudent(student)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastName} updated successfully.`, color: 'success' })
      isLoading.value = false;
      emit('loading', isLoading.value);
      router.push({ name: 'Students' });
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
    value: section.id
  }));
  emit('loading', sectionsPending.value);
});

watch(studentDoc, (newVal) => {
  if (!newVal) return;
  student.id = newVal.id;
  student.lastName = newVal.lastName;
  student.firstName = newVal.firstName;
  student.middleName = newVal.middleName;
  student.age = newVal.age;
  student.gender = newVal.gender;
  student.sectionId = newVal.sectionId;
  emit('loading', studentPending.value);
});

</script>

<template>
  <PageHeaderTitle :title="'Edit Student: ' + student.lastName + ', ' + student.firstName" />

  <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="student" @submit="editStudentHandler()">
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Last Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.lastName" type="text" placeholder="Enter last name" required
          :disabled="studentPending" />
      </UFormField>
      <UFormField label="First Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.firstName" type="text" placeholder="Enter first name" required
          :disabled="studentPending" />
      </UFormField>
    </div>
    <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
      <UFormField label="Middle Name" class="w-full" size="xl">
        <UInput class="w-full" v-model="student.middleName" type="text" placeholder="Enter middle name (optional)"
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
        <USelect class="w-full" v-model="student.sectionId" :items="sectionOptions" :disabled="studentPending" />
      </UFormField>
    </div>
    <div class="flex justify-start">
      <UButton :loading="isLoading"  :disabled="isLoading || studentPending" type="submit"
        label="Save" class="mt-6" size="xl" />
    </div>
  </UForm>
</template>
