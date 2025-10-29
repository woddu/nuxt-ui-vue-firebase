<script setup lang="ts">
import { ref } from "vue";

const isLoading = ref(true);

</script>

<!-- 
    flow:
        1. Show Advisories in a table with action: view Students, SOG
        2. On click of view Students, navigate to Advisory Students view
        3. In Advisory Students view, show list of students in a table under this advisory with actions to view details
        4. On click of SOG, navigate to Advisory SOG view
        5. In Advisory SOG view, show list of SOGs in a table under this advisory with actions to view grades

-->

<template>
    <AuthenticatedLayout :progress="isLoading" title="Advisories">
        <RouterView @loading="(value: boolean) => isLoading = value" />
    </AuthenticatedLayout>
</template>

