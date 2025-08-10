<script setup lang="ts">
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout.vue';

</script>

<template>
    <AuthenticatedLayout>
        <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted mb-4">Dashboard</h1>

        <USeparator class="mt-4 mb-8 px-2" color="primary" size="lg" />

        <UCard class="p-4">
            <template #header>
                <h2 class="text-xl font-bold">Welcome to your dashboard</h2>
            </template>
            <p class="mt-2">Here you can find an overview of your account and activities.</p>
        </UCard>
        
    </AuthenticatedLayout>
</template>