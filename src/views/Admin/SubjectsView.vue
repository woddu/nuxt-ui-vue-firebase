<script setup lang="ts">
import { ref, reactive, h, resolveComponent, computed } from 'vue';
import { Subject } from '@/interfaces';
import type { FormError, TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { addSubject, deleteSubject, updateSubject } from '@/services/subjectService';
import { columnCapitalize } from '../util';
import { useSubjectStore } from '@/stores/subject';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const subjectStore = useSubjectStore()

const subjects = subjectStore.subjects()

const pending = computed(() => subjects.pending.value);

const error = computed(() => subjects.error.value);

const showFormModal = ref(false);

const showWarningModal = ref(false);

const isEditing = ref(false);

const isLoading = ref(false);

const globalFilter = ref('');

const subject = reactive<Subject>({
    id: '',
    name: '',
    track: '',
    teacherIds: []
});

const toast = useToast();


const tableColumn: TableColumn<DocumentData>[] = [
    columnCapitalize('name'),
    columnCapitalize('track'),
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
                label: 'Edit Subject',
                onSelect: () => {
                    subject.id = row.original.id;
                    subject.name = row.original.name;
                    subject.track = row.original.track;
                    isEditing.value = true;
                    showFormModal.value = true;
                }
            }, {
                label: 'Delete Subject',
                onSelect: () => {
                    emptySubject();
                    subject.id = row.original.id;
                    subject.name = row.original.name;
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

const validate = (state: Subject): FormError[] => {
    const errors = [];
    if (!state.name) {
        errors.push({ name: 'name', message: 'Name is required' });
        toast.add({ title: 'Validation Error', description: 'Name is required', color: 'error' });
    }
    if (!state.track) {
        errors.push({ name: 'track', message: 'Track is required' });
        toast.add({ title: 'Validation Error', description: 'Track is required', color: 'error' });
    }
    return errors;
}

const addSubjectHandler = async () => {

    isLoading.value = true;
    addSubject(subject)
        .then(() => {
            showFormModal.value = false;
            toast.add({ title: 'Success', description: `Subject: ${subject.name} added successfully.`, color: 'success' })
            subjects.data.value = [...subjects.data.value]
            emptySubject()
        })
        .catch((error) => {
            console.error("Error adding subject: ", error);
            toast.add({ title: 'Error', description: `Failed to add subject: ${error.message}`, color: 'error' })
        })
        .finally(() => {
            isLoading.value = false;
        });
}

const editSubjectHandler = async () => {

    isLoading.value = true;
    updateSubject(subject)
        .then(() => {
            toast.add({ title: 'Success', description: `Subject: ${subject.name} updated successfully.`, color: 'success' })
            subjects.data.value = [...subjects.data.value]
            emptySubject()
        })
        .catch((error) => {
            console.error("Error updating subject: ", error);
            toast.add({ title: 'Error', description: `Failed to update subject: ${error.message}`, color: 'error' })
        })
        .finally(() => {
            isLoading.value = false;
            showFormModal.value = false;
        });
};

const deleteSubjectHandler = async () => {
    isLoading.value = true;
    deleteSubject(subject.id)
        .then(() => {
            toast.add({ title: 'Success', description: `Subject: ${subject.name} deleted successfully.`, color: 'success' });
            subjects.data.value = [...subjects.data.value]
            emptySubject();
        })
        .catch((error) => {
            console.error("Error deleting subject: ", error);
            toast.add({ title: 'Error', description: `Failed to delete subject: ${error.message}`, color: 'error' });
        })
        .finally(() => {
            isLoading.value = false;
            showWarningModal.value = false;
        });
};

function emptySubject() {
    subject.id = '';
    subject.name = '';
    subject.track = '';    
    isEditing.value = false
}

</script>

<template>
    <AuthenticatedLayout :progress="pending" title="Subjects">

        <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
            <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" size="xl"/>

            <UModal v-model:open="showFormModal" :title="isEditing ? 'Edit Subject' : 'Add Subject'"
                :description="isEditing ? 'Edit the Subject details below:' : 'Fill in the Subject details below:'">

                <template #body>
                    <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="subject"
                        @submit="isEditing ? editSubjectHandler() : addSubjectHandler()">
                        <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
                            <UFormField label="Name" class="w-full" size="xl">
                                <UInput class="w-full" v-model="subject.name" type="text"
                                    placeholder="Enter subject name" />
                            </UFormField>
                            <UFormField label="Track" class="w-full" size="xl">
                                <UInput class="w-full" v-model="subject.track" type="text"
                                    placeholder="Enter subject track" />
                            </UFormField>
                        </div>
                        <div class="flex justify-end">
                            <UButton :loading="isLoading"  :disabled="isLoading" type="submit" :label="isEditing ? 'Save' : 'Add'"
                                class="mt-6" size="xl"/>
                        </div>
                    </UForm>

                </template>

                <UButton
                    icon="i-lucide-plus"
                    label="Add Subject"
                    @click="emptySubject"
                    size="xl" />
            </UModal>
        </div>
        <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-11rem)]">
            <UTable sticky ref="table" :data="subjects" :columns="tableColumn" :loading="pending" :error="error"
                :global-filter="globalFilter" class="max-h-[calc(100vh-11rem)]"/>
            <UModal v-model:open="showWarningModal" title="Confirm Deletion">
                <template #body>
                    <p>Are you sure you want to delete {{ subject.name }}?</p>
                </template>
                <template #footer>
                    <UButton :loading="isLoading"  :disabled="isLoading" label="Cancel" @click="showWarningModal = false" size="xl"/>
                    <UButton :loading="isLoading"  :disabled="isLoading" label="Delete" color="error" @click="deleteSubjectHandler" size="xl"/>
                </template>
            </UModal>
        </div>
    </AuthenticatedLayout>
</template>