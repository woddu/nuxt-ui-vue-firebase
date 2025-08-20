<script setup lang="ts">
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout.vue';
import useStudentsCount from '@/composables/useStudentsCount';
import { onMounted, ref } from 'vue';


const pending = ref(true);
const count = ref(0);

onMounted(async () => {
    const { pending: newPending, count: newCount } = await useStudentsCount();
    pending.value = newPending.value;
    count.value = newCount.value;
});
</script>

<template>
    <AuthenticatedLayout>
        <PageHeaderTitle title="Dashboard" />
        <!-- grid of cards for dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard class="px-4 pt-4 pb-2" variant="soft">
                <div v-if="pending || count === 0">
                    <USkeleton />
                </div>
                <div class="flex justify-between gap-4">
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                        Students 
                    </h2>
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                            {{ count }}
                    </h2>
                </div>            
            </UCard>
            <UCard class="px-4 pt-4 pb-2 col-span-2" variant="soft">
                <div v-if="pending || count === 0">
                    <USkeleton />
                </div>
                <div class="flex justify-between gap-4">
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                        Students
                    </h2>
                    <h2 class="text-xl lg:text-2xl text-highlighted font-bold">
                        {{ count }}
                    </h2>
                </div>
            </UCard>
        </div>            
    </AuthenticatedLayout>
</template>