<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(false)

</script>

<template>
    <AuthenticatedLayout 
        title="Subjects"
        :progress="isLoading">
        <RouterView @loading="(value: boolean) => isLoading = value" />
    </AuthenticatedLayout>
</template>