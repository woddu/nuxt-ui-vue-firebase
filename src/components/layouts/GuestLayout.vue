<script setup lang="ts">

defineProps({
  progress: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <UProgress class="fixed top-0 left-0 right-0 z-50" v-if="progress" />
        <slot/>
    </div>
</template>