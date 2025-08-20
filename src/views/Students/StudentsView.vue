<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(true);

</script>

<template>
  <AuthenticatedLayout :progress="isLoading">

    <RouterView @loading="(value: boolean) => isLoading = value" />
  </AuthenticatedLayout>
</template>