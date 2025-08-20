<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { useCollection } from 'vuefire';
import { studentsRef } from '@/firebase';
import { deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { ref, h, resolveComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { Student } from '@/interfaces';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter()

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const { data, error, pending } = useCollection(studentsRef);

const showWarningModal = ref(false);

const toast = useToast();

const isLoading = ref(false);

const globalFilter = ref('');

function column(key: string, capitalize: boolean = false): TableColumn<DocumentData> {
  return {
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }) => {
      if (capitalize && row.getValue(key) != undefined) {
        return row.getValue<String>(key) ? row.getValue<String>(key).charAt(0).toUpperCase() + row.getValue<String>(key).slice(1) : 'N/A';
      }
      return row.getValue<String>(key) ? row.getValue<String>(key) : 'N/A';
    }
  }
}

const student = reactive<Student>({
  id: '',
  lastname: '',
  firstname: '',
  middlename: '',
  age: 0,
  gender: 'other',
  section: 'N/A'
});

const tableColumn: TableColumn<DocumentData>[] = [
  column('lastname'),
  column('firstname'),
  column('middlename'),
  column('age'),
  column('section'),
  column('gender', true),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const items = [{
        type: 'label',
        label: 'Actions'
      }, {
        type: 'separator'
      }, {
        label: 'Edit Student',
        onSelect: () => {
          emit('loading', true);
          router.push({
            name: 'edit-student',
            params: { id: row.original.id }
          });
        }
      }, {
        label: 'Delete Student',
        onSelect: () => {
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

const addStudent = () => {
  emit('loading', true);
  router.push({ name: 'add-student' });
}

const deleteStudent = async () => {
  isLoading.value = true;
  emit('loading', isLoading.value);
  const studentDocRef = doc(studentsRef, student.id);
  await deleteDoc(studentDocRef)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastname} deleted successfully.`, color: 'success' });
      data.value = [...data.value]
    })
    .catch((error) => {
      console.error("Error deleting student: ", error);
      toast.add({ title: 'Error', description: `Failed to delete student: ${error.message}`, color: 'error' });
    })
    .finally(() => {
      isLoading.value = false;
      emit('loading', isLoading.value);
      showWarningModal.value = false;
    });
};

watch(pending, (newVal) => {
  emit('loading', newVal);
});

</script>

<template>
<PageHeaderTitle title="Students" />

  <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
    <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" />

    <UButton label="Add Student" @click="addStudent()" />
  </div>
  <div class="border border-muted relative z-[1] rounded-md ">
    <UTable ref="table" :data="data" :columns="tableColumn" :loading="pending" :error="error"
      :global-filter="globalFilter" />
    <UModal v-model:open="showWarningModal" title="Confirm Deletion">
      <template #body>
        <p>Are you sure you want to delete {{ student.lastname }}?</p>
      </template>
      <template #footer>
        <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Cancel"
          @click="showWarningModal = false" />
        <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Delete" color="error"
          @click="deleteStudent" />
      </template>
    </UModal>
  </div>
</template>