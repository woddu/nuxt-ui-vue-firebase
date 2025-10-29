<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacherSubjects';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const teacherStore = useTeacherStore();

const isLoading = ref(false);
onMounted(() => {
    emit('loading', false);
});

watch(isLoading, (value) => {
    emit('loading', value);
});

</script>

<template>
    <div class="m-2 mb-2.5 flex"> 
        <ul>
            <li v-for="subject in teacherStore.subjects()?.data.value" :key="subject.id">
                <UButton
                    class="cursor-pointer"
                    variant="ghost"
                    :label="subject.name" 
                    @click="() => {
                        isLoading = true;
                        router.push({
                            name: 'Teacher-Subject-Details',
                            params: { id: subject.id }
                        });
                    }"
                    size="xl"/>
            </li>
        </ul>
    </div>
</template>