<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { ref, h, resolveComponent, watch, onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useTeachers } from '@/composables/useTeachers';
import { deleteTeacher, updateTeacherVerification } from '@/services/teacherService';
import { computed } from 'vue';
import { columnCapitalize } from '@/views/util';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const router = useRouter()

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UBadge = resolveComponent('UBadge')

const teachers = useTeachers();

const filtered = computed(() =>
  teachers.value.filter(t => t.username !== "admin")
)

const pending = computed(() => teachers.pending.value);

const error = computed(() => teachers.error.value);

const showWarningModal = ref(false);

const toast = useToast();

const isLoading = ref(false);

const globalFilter = ref('');

const teacher = reactive({
    id: '',
    lastName: '',
    firstName: ''
});

const tableColumn: TableColumn<DocumentData>[] = [
    columnCapitalize('lastName'),
    columnCapitalize('firstName'),
    {
        accessorKey: 'verified',
        header: 'Verified',
        filterFn: 'equals',
        cell: ({ row }) => {
            return h(UBadge, { class: 'capitalize', variant: 'subtle', color: row.getValue<any>('verified') ? 'success' : 'error' }, () =>
                    row.getValue<Boolean>('verified') ? 'Yes' : 'No'
                )
        }
    },
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
                label: row.original.verified ? 'Unverify' : 'Verify',
                onselect: () => {
                    emit('loading', true);
                    updateTeacherVerification(row.original.id, !row.original.verified)
                }
            },  {
                label: 'Assign',
                onSelect: () => {
                    emit('loading', true);
                    router.push({
                        name: 'Assign-Teacher',
                        params: { id: row.original.id }
                    });
                }
            }, {
                label: 'Edit Teacher',
                onSelect: () => {
                    emit('loading', true);
                    router.push({
                        name: 'Edit-Teacher',
                        params: { id: row.original.id }
                    });
                }
            }, {
                label: 'Delete Teacher',
                onSelect: () => {
                    teacher.id = row.original.id;
                    teacher.lastName = row.original.lastName;
                    teacher.firstName = row.original.firstName;
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

const addTeacher = () => {
    emit('loading', true);
    router.push({ name: 'Add-Teacher' });
}

const deleteTeacherHandler = async () => {
    isLoading.value = true;
    emit('loading', isLoading.value);
    deleteTeacher(teacher.id)
        .then(() => {
            toast.add({ title: 'Success', description: `Teacher: ${teacher.lastName} deleted successfully.`, color: 'success' });
            teachers.data.value = [...teachers.data.value]
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

const table = useTemplateRef('table');

const statusFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('verified')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

onMounted(() => {
  emit('loading', false);
});

</script>

<template>
    <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
        <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" size="xl"/>

        <div class="flex items-center gap-2">

            <USelect 
                v-model="statusFilter" 
                class="max-w-auto min-w-32" 
                placeholder="Filter by Verified" 
                :items="[
                    { label: 'All', value: 'all' },
                    { label: 'Verified', value: true },
                    { label: 'Unverified', value: false }
                ]" 
                size="xl"/>

            <UButton
                icon="i-lucide-plus"
                label="Add Teacher"
                @click="addTeacher()"
                size="xl" />
        </div>
    </div>
    <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-11rem)]">
        <UTable
          sticky
          ref="table"
          :data="filtered"
          :columns="tableColumn"
          :loading="pending"
          :error="error"
          :global-filter="globalFilter" 
          class="max-h-[calc(100vh-11rem)]"/>
        <UModal v-model:open="showWarningModal" title="Confirm Deletion">
            <template #body>
                <p>Are you sure you want to delete {{ teacher.lastName }}?</p>
            </template>
            <template #footer>
                <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Cancel"
                    @click="showWarningModal = false" size="xl" />
                <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Delete"
                    color="error" @click="deleteTeacherHandler" size="xl" />
            </template>
        </UModal>
    </div>
</template>