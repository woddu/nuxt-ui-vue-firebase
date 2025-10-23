<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>

<template>
    <h1 class="text-xl sm:text-2xl text-pretty font-bold text-highlighted mb-4">
        {{ title }}
    </h1>
</template>