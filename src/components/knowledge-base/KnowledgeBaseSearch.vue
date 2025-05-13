<template>
  <div class="flex gap-2 w-full sm:w-1/2">
    <select
      v-model="searchType"
      class="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600"
    >
      <option value="text">Search by Text</option>
      <option value="category">Search by Category</option>
    </select>
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="searchType === 'text' ? 'Search questions...' : 'Search category...'"
      class="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: {
    query: string
    type: 'text' | 'category'
  }
}

interface Emits {
  (e: 'update:modelValue', value: { query: string; type: 'text' | 'category' }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref(props.modelValue.query)
const searchType = ref<'text' | 'category'>(props.modelValue.type)

// Watch for local changes and emit updates
watch([searchQuery, searchType], ([newQuery, newType]) => {
  emit('update:modelValue', {
    query: newQuery,
    type: newType
  })
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue.query
  searchType.value = newValue.type
}, { deep: true })
</script> 