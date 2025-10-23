<script setup lang="ts">
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout.vue';
import { getStudentCount } from '@/composables/useStudents';
import { getTeachersCount } from '@/composables/useTeachers';
import { onMounted, ref } from 'vue';


const pending = ref(true);

const studentCount = ref(0);

const teacherCount = ref(0);

onMounted(async () => {
    try {        
        studentCount.value = await getStudentCount();
        
        teacherCount.value = await getTeachersCount();
    } catch (err: any) {
        // error.value = err.message ?? 'Failed to fetch count'
    } finally {
        pending.value = false
    }
});
</script>

<template>
    <AuthenticatedLayout :progress="pending" >
        <!-- grid of cards for dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard class="px-4 pt-4 pb-2" variant="soft">
                <div class="flex justify-between gap-4">
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                        Students 
                    </h2>
                    <div v-if="pending || studentCount === 0" class="grow">
                        <USkeleton class="w-1/2 h-full ml-auto"/>
                    </div>
                    <h2 v-else class="text-xl lg:text-2xl text-highlighted font-bold">
                            {{ studentCount }}
                    </h2>
                </div>            
            </UCard>
            <UCard class="px-4 pt-4 pb-2 col-span-2" variant="soft">
                <div class="flex justify-between gap-4">
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                        Teachers
                    </h2>
                    <div v-if="pending || teacherCount === 0" class="grow">
                        <USkeleton class="w-1/2 h-full ml-auto"/>
                    </div>
                    <h2 v-else class="text-xl lg:text-2xl text-highlighted font-bold">
                        {{ teacherCount }}
                    </h2>
                </div>
            </UCard>
        </div>            
    </AuthenticatedLayout>
</template>