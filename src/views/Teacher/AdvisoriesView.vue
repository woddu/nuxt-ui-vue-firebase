<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const userStore = useUserStore();

const isLoading = ref(false);

</script>

<template>
    <AuthenticatedLayout :progress="isLoading" title="Advisories">
        <div class="p-4">
            <h1 class="text-2xl font-bold mb-4">Advisories for {{ userStore.user?.lastName + " " + userStore.user?.firstName }}</h1>
            <!-- Content for advisories goes here -->
            <p>This is where the advisories content will be displayed.</p>
        </div>

    </AuthenticatedLayout>
</template>

