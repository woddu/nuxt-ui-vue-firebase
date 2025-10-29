<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacherSubjects';
import { onMounted, ref } from 'vue';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>();

const router = useRouter();

const teacherStore = useTeacherStore();

const isLoading = ref(false)

const advisoriesItems = computed(() => teacherStore.advisorySections()?.data.value.map(advisory => ({
        id: advisory.id,
        label: advisory.name,
    })) ?? [{ id: 'empty', label: 'empty' }]
);

onMounted(() => {
    emit('loading', false);
});

watch(isLoading, (newValue) => {
    emit('loading', newValue);
})

</script>

<template>

    <UAccordion
      type="multiple"
      :items="advisoriesItems"
      :ui="{
        label: 'text-xl text-highlighted font-semibold'
      }">
        <template #content="{ item }">
            <div class="m-2 mb-2.5 flex"> 
                <ul>
                    <li>
                        <UButton
                            class="cursor-pointer"
                            variant="ghost"
                            label="View Students" 
                            @click="() => {
                                isLoading = true;
                                router.push({
                                    name: 'Advisories-Students',
                                    params: { id: item.id }
                                });
                            }"
                            size="xl"
                          />
                    </li>
                    <li>
                        <UButton
                            class="cursor-pointer"
                            variant="ghost"
                            label="View SOG" 
                            size="xl"
                          />
                            <!-- @click="router.push({
                                name: 'Advisories-SOG',
                                params: { id: item.id }
                            });" -->
                    </li>
                </ul>               
            </div>
        </template>
    </UAccordion>
</template>