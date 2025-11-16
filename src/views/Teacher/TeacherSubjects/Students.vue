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
                        
                    }
                })
            )
        }
    }
]

onMounted(() => {
    emit('loading', false);
});

</script>

<template>
    <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]">
        <UTable sticky ref="table" :data="students" :columns="tableColumn" :loading="pending.value" :error="error"
        :global-filter="globalFilter" class="max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]"/>
    </div>
</template>