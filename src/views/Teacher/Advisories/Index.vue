<script setup lang="ts">
import { useTeacherStore } from '@/stores/teacherSubjects';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const teacherStore = useTeacherStore();

const advisoriesItems = computed(() => teacherStore.advisorySections()?.data.value.map(advisory => ({
        id: advisory.id,
        label: advisory.name,
    })) ?? [{ id: 'empty', label: 'empty' }]
);

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
                            variant="ghost"
                            label="View Students" 
                            @click="router.push({
                                name: 'Advisories-Students',
                                params: { id: item.id }
                            });" 
                          />
                    </li>
                    <li>
                        <UButton
                            variant="ghost"
                            label="View SOG" 
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