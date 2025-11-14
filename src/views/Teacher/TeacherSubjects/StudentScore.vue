<script setup lang="ts">
import { useScoresByStudent } from '@/composables/useScores';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const studentScore = useScoresByStudent(router.currentRoute.value.params.id as string)

</script>

<template>

    
</template>