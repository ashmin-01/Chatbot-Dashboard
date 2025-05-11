<template>
  <div class="flex border-b border-gray-200 !mb-3 text-sm font-medium text-gray-500">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('update:activeTab', tab)"
      class="px-4 py-2 -mb-px border-b-2"
      :class="
        activeTab === tab
          ? 'border-orange-500 text-orange-600'
          : 'border-transparent hover:text-orange-500 hover:border-orange-300'
      "
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: string[];
  activeTab: string;
}>();

defineEmits<{
  'update:activeTab': [tab: string];
}>();
</script>
