<script setup lang="ts">
import { sectionsRef } from '@/firebase';
import { useCollection } from 'vuefire';
import { ref, reactive, h, resolveComponent } from 'vue';
import { Section } from '@/interfaces';
import type { FormError, TableColumn } from '@nuxt/ui';
import { addDoc, deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const { data, error, pending } = useCollection(sectionsRef);

const showFormModal = ref(false);

const showWarningModal = ref(false);

const isEditing = ref(false);

const isLoading = ref(false);

const globalFilter = ref('');

const section = reactive<Section>({
    id: '',
    name: '',
    grade: 0
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
    column('name'),
    column('grade'),
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
                label: 'Edit Section',
                onSelect: () => {
                    section.id = row.original.id;
                    section.name = row.original.name;
                    section.grade = row.original.grade;
                    isEditing.value = true;
                    showFormModal.value = true;
                }
            }, {
                label: 'Delete Student',
                onSelect: () => {
                    emptySection();
                    section.id = row.original.id;
                    section.name = row.original.name;
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

const addSection = async () => {
    const errors = validate(section);
    if (errors.length > 0) {
        for (const error of errors) {
            toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
        }
    }

    isLoading.value = true;
    await addDoc(sectionsRef, section as Section)
        .then(() => {
            showFormModal.value = false;
            toast.add({ title: 'Success', description: `Section: ${section.name} added successfully.`, color: 'success' })
            emptySection()
        })
        .catch((error) => {
            console.error("Error adding section: ", error);
            toast.add({ title: 'Error', description: `Failed to add section: ${error.message}`, color: 'error' })
        });
}

const editSection = async () => {
    const errors = validate(section);
    if (errors.length > 0) {
        for (const error of errors) {
            toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
        }
    }

    isLoading.value = true;
    const sectionDocRef = doc(sectionsRef, section.id);
    await updateDoc(sectionDocRef, section)
        .then(() => {
            toast.add({ title: 'Success', description: `Section: ${section.name} updated successfully.`, color: 'success' })
            emptySection()
        })
        .catch((error) => {
            console.error("Error updating section: ", error);
            toast.add({ title: 'Error', description: `Failed to update section: ${error.message}`, color: 'error' })
        })
        .finally(() => {
            isLoading.value = false;
            showFormModal.value = false;
        });
};

const deleteSection = async () => {
    isLoading.value = true;
    const sectionDocRef = doc(sectionsRef, section.id);
    await deleteDoc(sectionDocRef)
        .then(() => {
            toast.add({ title: 'Success', description: `Section: ${section.name} deleted successfully.`, color: 'success' });
            emptySection();
        })
        .catch((error) => {
            console.error("Error deleting section: ", error);
            toast.add({ title: 'Error', description: `Failed to delete section: ${error.message}`, color: 'error' });
        })
        .finally(() => {
            isLoading.value = false;
            showWarningModal.value = false;
        });
};

function emptySection() {
    section.id = '';
    section.name = '';
    section.grade = 0;

    isEditing.value = false
}
</script>

<template>
    <AuthenticatedLayout :progress="pending">
        <PageHeaderTitle title="Sections" />

        <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
            <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" />

            <UModal v-model:open="showFormModal" :title="isEditing ? 'Edit Student' : 'Add Student'"
                :description="isEditing ? 'Edit the student details below:' : 'Fill in the student details below:'">

                <template #body>
                    <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="section"
                        @submit="isEditing ? editSection() : addSection()">
                        <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
                            <UFormField label="Name" class="w-full" size="xl">
                                <UInput class="w-full" v-model="section.name" type="text"
                                    placeholder="Enter section name" required />
                            </UFormField>
                            <UFormField label="First Name" class="w-full" size="xl">
                                <UInput class="w-full" v-model="section.grade" type="number"
                                    placeholder="Enter section grade level" required />
                            </UFormField>
                        </div>
                        <div class="flex justify-end">
                            <UButton :disabled="isLoading" type="submit" :label="isEditing ? 'Save' : 'Add'"
                                class="mt-6" />
                        </div>
                    </UForm>

                </template>

                <UButton label="Add Section" @click="emptySection" />
            </UModal>
        </div>
        <div class="border border-muted relative z-[1] rounded-md ">
            <UTable ref="table" :data="data" :columns="tableColumn" :loading="pending" :error="error"
                :global-filter="globalFilter" />
            <UModal v-model:open="showWarningModal" title="Confirm Deletion">
                <template #body>
                    <p>Are you sure you want to delete {{ section.name }}?</p>
                </template>
                <template #footer>
                    <UButton :disabled="isLoading" label="Cancel" @click="showWarningModal = false" />
                    <UButton :disabled="isLoading" label="Delete" color="error" @click="deleteSection" />
                </template>
            </UModal>
        </div>
    </AuthenticatedLayout>
</template>