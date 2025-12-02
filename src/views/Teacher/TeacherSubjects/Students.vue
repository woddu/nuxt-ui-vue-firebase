<script setup lang="ts">
import { useStudentsBySection } from '@/composables/useStudents';
import { columnCapitalize } from '@/views/util';
import { TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { onMounted, computed, ref, h, resolveComponent } from 'vue';
import { useRouter } from 'vue-router';

const UButton = resolveComponent('UButton');

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const isLoading = ref(false);

const students = useStudentsBySection(router.currentRoute.value.params.id as string)

const pending = computed(() => students.pending ?? false);

const error = computed(() => students.error);

const globalFilter = ref('');

const tableColumn: TableColumn<DocumentData>[] = [
    columnCapitalize('lastName'),
    columnCapitalize('firstName'),
    columnCapitalize('middleName'),
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right' },
                h(UButton, {
                    label: 'Grade',
                    variant: 'soft',
                    class: 'rounded-full cursor-pointer',
                    size: 'xl',
                    onClick: () => {
                        isLoading.value = true;
                        router.push({
                            name: 'Teacher-Subject-Student-Score',
                            params: {
                                id: row.original.id
                            },
                            query: {
                                sectionId: router.currentRoute.value.params.id as string,
                                sectionName: router.currentRoute.value.query.name as string,
                                subjectId: router.currentRoute.value.query.subjectId as string,
                                subjectName: router.currentRoute.value.query.subjectName as string,
                                subjectTrack: router.currentRoute.value.query.track as string,
                                teacherSubjectId: router.currentRoute.value.query.teacherSubjectId as string
                            }
                        })
                    }
                })
            )
        }
    }
]

onMounted(() => {
    isLoading.value = false;
    emit('loading', false);
});

</script>

<template>
    <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]">
        <UTable sticky ref="table" :data="students" :columns="tableColumn" :loading="pending.value" :error="error"
        :global-filter="globalFilter" class="max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]"/>
    </div>
</template>