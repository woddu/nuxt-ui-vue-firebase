<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui';
import { useCollection } from 'vuefire';
import { studentsRef } from '@/firebase';
import { addDoc, deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { ref, reactive, h, resolveComponent } from 'vue';
import { Student } from '@/interfaces';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const { data, error, pending } = useCollection(studentsRef);

const showFormModal = ref(false);

const showWarningModal = ref(false);

const isEditing = ref(false);

const isLoading = ref(false);

const globalFilter = ref('');

const student = reactive<Student>({
  id: '',
  lastname: '',
  firstname: '',
  middlename: '',
  age: 0,
  section: ''
});

const toast = useToast();

function column(key: string): TableColumn<DocumentData> {
  return {
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }) => row.getValue(key) ? row.getValue(key) : 'N/A',
  }
} 

const tableColumn: TableColumn<DocumentData>[] = [
  column('lastname'),
  column('firstname'),
  column('middlename'),
  column('age'),
  column('section'),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const items = [{
        type: 'label',
        label: 'Actions'
      },{
        type: 'separator'
      },{
        label: 'Edit Student',
        onSelect: () => {
          student.id = row.original.id;
          student.lastname = row.original.lastname;
          student.firstname = row.original.firstname;
          student.middlename = row.original.middlename;
          student.age = row.original.age;
          isEditing.value = true;
          showFormModal.value = true;
        }
      }, {
        label: 'Delete Student',
        onSelect: () => {
          emptyStudent();
          student.id = row.original.id;
          student.lastname = row.original.lastname;
          showWarningModal.value = true;
        }
      }]

      return h('div', { class: 'text-right' }, h(UDropdownMenu, {
        'content': {
          align: 'end'
        },
        items,
        'aria-label': 'Actions dropdown'
      }, () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'class': 'ml-auto',
        'aria-label': 'Actions dropdown'
      })))
    }
  }
];

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.lastname) errors.push({ name: 'lastname', message: 'Last Name is required' });
  if (!state.firstname) errors.push({ name: 'firstname', message: 'First Name is required' });
  if (!state.age || state.age <= 0) errors.push({ name: 'age', message: 'Age must be a positive number' });
  return errors;
}

const addStudent = async () =>{
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
  }
  
  isLoading.value = true;
  await addDoc(studentsRef, student as Student)
  .then(() => {
    showFormModal.value = false;
    toast.add({ title: 'Success', description: `Student: ${student.lastname} added successfully.`, color: 'success' })
    emptyStudent()
  })
  .catch((error) => {
    console.error("Error adding student: ", error);
    toast.add({ title: 'Error', description: `Failed to add student: ${error.message}`, color: 'error' })
  });
} 

const editStudent = async () => {
  const errors = validate(student);
  if (errors.length > 0) {
    for (const error of errors) {
      toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
    }
  }
  
  isLoading.value = true;
  const studentDocRef = doc(studentsRef, student.id);
  await updateDoc(studentDocRef, student)
  .then(() => {
    toast.add({ title: 'Success', description: `Student: ${student.lastname} updated successfully.`, color: 'success' })
    emptyStudent()
  })
  .catch((error) => {
    console.error("Error updating student: ", error);
    toast.add({ title: 'Error', description: `Failed to update student: ${error.message}`, color: 'error' })
  })
  .finally(() => {
    isLoading.value = false;
    showFormModal.value = false;
  });
};

const deleteStudent = async () => {
  isLoading.value = true;
  const studentDocRef = doc(studentsRef, student.id);
  await deleteDoc(studentDocRef)
  .then(() => {
    toast.add({ title: 'Success', description: `Student: ${student.lastname} deleted successfully.`, color: 'success' });
    emptyStudent();
  })
  .catch((error) => {
    console.error("Error deleting student: ", error);
    toast.add({ title: 'Error', description: `Failed to delete student: ${error.message}`, color: 'error' });
  })
  .finally(() => {
    isLoading.value = false;
    showWarningModal.value = false;
  });
};

function emptyStudent() {
  student.lastname = '';
  student.firstname = '';
  student.middlename = '';
  student.age = 0;
  isEditing.value = false
}

</script>

<template>
  <AuthenticatedLayout :progress="isLoading">
    <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted mb-4">Students</h1>

    <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter"/>

      <UModal v-model:open="showFormModal" :title="isEditing ? 'Edit Student' : 'Add Student'" >

        <template #body>
          <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="student" @submit="isEditing ? editStudent() : addStudent()">
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
                  <UInput class="w-full" v-model.number="student.age" type="number" placeholder="Enter age"
                    required min="1"/>
                </UFormField>
            </div>
            <div class="flex justify-end">
              <UButton :disabled="isLoading" type="submit" :label="isEditing ? 'Save' : 'Add'" class="mt-6" />
            </div>
          </UForm>

        </template>
        
        <UButton label="Add Student" @click="emptyStudent" />
      </UModal>
    </div>
    <div class="border border-muted relative z-[1] rounded-md ">
      <UTable
        ref="table"
        :data="data"
        :columns="tableColumn"
        :loading="pending"
        :error="error" 
        :global-filter="globalFilter"  
      />
        <UModal v-model:open="showWarningModal" title="Confirm Deletion">
          <template #body>
            <p>Are you sure you want to delete {{ student.lastname }}?</p>
          </template>
          <template #footer>
            <UButton :disabled="isLoading" label="Cancel" @click="showWarningModal = false" />
            <UButton :disabled="isLoading" label="Delete" color="error" @click="deleteStudent" />
          </template>
        </UModal>
    </div>
  </AuthenticatedLayout>
</template>