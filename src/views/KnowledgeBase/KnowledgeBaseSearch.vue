<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-3 gap-3">
    <div class="flex gap-2 w-full sm:w-1/2">
      <select
        :value="searchType"
        @input="$emit('update:searchType', ($event.target as HTMLSelectElement).value)"
        class="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600"
      >
        <option value="text">Search by Text</option>
        <option value="category">Search by Category</option>
      </select>
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="searchType === 'text' ? 'Search questions...' : 'Search category...'"
        class="cursor-pointer flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
    <div class="flex gap-2">
      <button
        @click="$emit('add-item')"
        class="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
      >
        + Add Knowledge Item
      </button>
      <button
        @click="$emit('import')"
        class="cursor-pointer border border-orange-400 text-orange-500 hover:bg-orange-50 font-medium px-4 py-2 rounded"
      >
        Import
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchType: string;
  searchQuery: string;
}>();

defineEmits<{
  'update:searchType': [value: string];
  'update:searchQuery': [value: string];
  'add-item': [];
  'import': [];
}>();
</script>
