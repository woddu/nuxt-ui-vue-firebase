<script setup lang="ts">
import { ref, reactive, h, resolveComponent, computed } from 'vue';
import { Section } from '@/interfaces';
import type { FormError, TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { addSection, deleteSection, updateSection } from '@/services/sectionService';
import { columnCapitalize } from '../util';
import { useSectionStore } from '@/stores/sections';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const sectionStore = useSectionStore();

const sections = sectionStore.sections();

const pending = computed(() => sections.pending.value);

const error = computed(() => sections.error.value);

const showFormModal = ref(false);

const showWarningModal = ref(false);

const isEditing = ref(false);

const isLoading = ref(false);

const globalFilter = ref('');

const section = reactive<Section>({
    id: '',
    name: '',
    yearLevel: 0,
    strand: '',    
    subjectIds: []
});

const toast = useToast();

const tableColumn: TableColumn<DocumentData>[] = [
    columnCapitalize('name'),
    columnCapitalize('yearLevel'),
    {
        accessorKey: 'strand',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()

            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Strand',
                icon: isSorted
                ? isSorted === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
                class: '-mx-2.5',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => row.getValue('strand') ? row.getValue('strand') : 'N/A',
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
                label: 'Edit Section',
                onSelect: () => {
                    section.id = row.original.id;
                    section.name = row.original.name;
                    section.yearLevel = row.original.yearLevel;
                    section.strand = row.original.strand;
                    isEditing.value = true;
                    showFormModal.value = true;
                }
            }, {
                label: 'Delete Section',
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

const validate = (state: Section): FormError[] => {
    const errors = [];
    if (!state.name) {
        errors.push({ name: 'name', message: 'Name is required' });
        toast.add({ title: 'Validation Error', description: 'Name is required', color: 'error' });
    }
    if (state.yearLevel < 0) {
        errors.push({ name: 'grade', message: 'Grade can\'t be a negative number' });
        toast.add({ title: 'Validation Error', description: 'Grade can\'t be a negative number', color: 'error' });
    }
    return errors;
}

const addSectionHandler = async () => {

    isLoading.value = true;
    addSection(section)
        .then(() => {
            showFormModal.value = false;
            toast.add({ title: 'Success', description: `Section: ${section.name} added successfully.`, color: 'success' })
            sections.data.value = [...sections.data.value]
            emptySection()
        })
        .catch((error) => {            
            toast.add({ title: 'Error', description: `Failed to add section: ${error.message}`, color: 'error' })
        })
        .finally(() => {
            isLoading.value = false;
        });
}

const editSectionHandler = async () => {

    isLoading.value = true;
    updateSection(section)
        .then(() => {
            toast.add({ title: 'Success', description: `Section: ${section.name} updated successfully.`, color: 'success' })
            sections.data.value = [...sections.data.value]
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

const deleteSectionHandler = async () => {
    isLoading.value = true;
    deleteSection(section.id)
        .then(() => {
            toast.add({ title: 'Success', description: `Section: ${section.name} deleted successfully.`, color: 'success' });
            sections.data.value = [...sections.data.value]
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
    section.yearLevel = 0;
    section.strand = '';    
    isEditing.value = false
}
</script>

<template>
    <AuthenticatedLayout :progress="pending" title="Sections">

        <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
            <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" size="xl"/>

            <UModal v-model:open="showFormModal" :title="isEditing ? 'Edit Section' : 'Add Section'"
                :description="isEditing ? 'Edit the Section details below:' : 'Fill in the Section details below:'">

                <template #body>
                    <UForm class="flex flex-col gap-2 lg:gap-4 xl:gap-8" :validate="validate" :state="section"
                        @submit="isEditing ? editSectionHandler() : addSectionHandler()">
                        <div class="w-full flex flex-col gap-2 lg:gap-4 lg:flex-row xl:gap-8">
                            <UFormField label="Name" class="w-full" size="xl">
                                <UInput class="w-full" v-model="section.name" type="text"
                                    placeholder="Enter section name" />
                            </UFormField>
                            <UFormField label="Year Level" class="w-full" size="xl">
                                <UInput class="w-full" v-model="section.yearLevel" type="number"
                                    placeholder="Enter section year level" :default-value="0" required />
                            </UFormField>
                        </div>
                        <div class="flex justify-end">
                            <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" type="submit" :label="isEditing ? 'Save' : 'Add'"
                                class="mt-6" size="xl"/>
                        </div>
                    </UForm>

                </template>

                <UButton
                  icon="i-lucide-plus"
                  label="Add Section"
                  @click="emptySection"
                  size="xl" />
            </UModal>
        </div>
        <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-11rem)]">
            <UTable sticky ref="table" :data="sections" :columns="tableColumn" :loading="pending" :error="error"
                :global-filter="globalFilter" class="max-h-[calc(100vh-11rem)]"/>
            <UModal v-model:open="showWarningModal" title="Confirm Deletion">
                <template #body>
                    <p>Are you sure you want to delete {{ section.name }}?</p>
                </template>
                <template #footer>
                    <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Cancel" @click="showWarningModal = false" size="xl"/>
                    <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Delete" color="error" @click="deleteSectionHandler" size="xl"/>
                </template>
            </UModal>
        </div>
    </AuthenticatedLayout>
</template>