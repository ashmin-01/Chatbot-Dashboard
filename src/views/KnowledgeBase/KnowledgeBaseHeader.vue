<template>
  <div class="!mb-4">
    <h2 class="text-3xl font-semibold text-gray-800">{{ title }}</h2>
    <p class="!mt-2 text-gray-500">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>
