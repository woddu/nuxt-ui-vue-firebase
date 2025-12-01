<script setup lang="ts">
import { useStudentsBySection } from '@/composables/useStudents';
import { useTeacherStore } from '@/stores/teacherSubjects';
import { columnCapitalize } from '@/views/util';
import { TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { watch } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>();

const router = useRouter();

const isLoading = ref(false)

const teacherStore = useTeacherStore();

const advisory = computed(() => 
    teacherStore.advisorySections()?.data.value.find(ad => 
    ad.id === router.currentRoute.value.params.id) ?? null
)

const students = useStudentsBySection(router.currentRoute.value.params.id as string)

const pending = computed(() => students.pending.value)

const error = computed(() => students.error.value)

const globalFilter = ref('')

const studentsColumn: TableColumn<DocumentData>[] = [
    columnCapitalize('lastName'),
    columnCapitalize('firstName'),
]

onMounted(() => {
    emit('loading', false);
});

watch(isLoading, (newValue) => {
    emit('loading', newValue);
})

</script>

<template>

    <PageHeaderTitle :title="`${advisory?.name} Students`" />

    <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
            <UInput v-model="globalFilter" class="max-w-sm min-w-[12ch]" placeholder="Filter" size="xl"/>
    </div>
    <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-18rem)] md:max-h-[calc(100vh-15rem)]">
        <UTable sticky ref="table" :data="students ?? []" :columns="studentsColumn" :loading="pending" :error="error"
            :global-filter="globalFilter" class="max-h-[calc(100vh-18rem)] md:max-h-[calc(100vh-15rem)]"/>
    </div>
</template>