<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { ref, h, resolveComponent, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useStudents } from '@/composables/useStudents';
import { deleteStudent } from '@/services/studentService';
import { useSections } from '@/composables/useSections';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const router = useRouter()

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const students = useStudents();

const pending = ref(students.pending.value);

const error = ref(students.error.value);  

const sections = useSections();

const showWarningModal = ref(false);

const toast = useToast();

const isLoading = ref(false);

const globalFilter = ref('');

function column(key: string, capitalize: boolean = false): TableColumn<DocumentData> {
  return {
    accessorKey: key,
    header: key === 'sectionId' ? 'Section' : key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }) => {
      if (key === 'sectionId') {
        const sectionId = row.getValue<String>('sectionId');
        const section = sections.data.value.find(sec => sec.id === sectionId);
        return section ? section.name : 'N/A';
      } else {
        if (capitalize && row.getValue(key) != undefined) {
          return row.getValue<String>(key) ? row.getValue<String>(key).charAt(0).toUpperCase() + row.getValue<String>(key).slice(1) : 'N/A';
        }
        return row.getValue<String>(key) ? row.getValue<String>(key) : 'N/A';
      }
    }
  }
}

const student = reactive({
  id: '',
  lastName: '',
  firstName: ''
});

const tableColumn: TableColumn<DocumentData>[] = [
  column('lastName'),
  column('firstName'),
  column('middleName'),
  column('age'),
  column('sectionId'),
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
            name: 'Edit-Student',
            params: { id: row.original.id }
          });
        }
      }, {
        label: 'Delete Student',
        onSelect: () => {
          student.id = row.original.id;
          student.lastName = row.original.lastName;
          student.firstName = row.original.firstName;
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
  router.push({ name: 'Add-Student' });
}

const deleteStudentHandler = async () => {
  isLoading.value = true;
  emit('loading', isLoading.value);
  deleteStudent(student.id)
    .then(() => {
      toast.add({ title: 'Success', description: `Student: ${student.lastName} deleted successfully.`, color: 'success' });
      students.data.value = [...students.data.value]
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

onMounted(() => {
  emit('loading', students.pending.value);
});

watch(students.pending, (newVal) => {
  emit('loading', newVal);
  pending.value = newVal;
});

</script>

<template>

  <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
    <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" />

    <UButton label="Add Student" @click="addStudent()" size="xl"/>
  </div>
  <div class="border border-muted relative z-[1] rounded-md ">
    <UTable ref="table" :data="students" :columns="tableColumn" :loading="pending" :error="error"
      :global-filter="globalFilter" />
    <UModal v-model:open="showWarningModal" title="Confirm Deletion">
      <template #body>
        <p>Are you sure you want to delete {{ student.lastName }}?</p>
      </template>
      <template #footer>
        <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Cancel"
          @click="showWarningModal = false" size="xl"/>
        <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Delete" color="error"
          @click="deleteStudentHandler" size="xl"/>
      </template>
    </UModal>
  </div>
</template>