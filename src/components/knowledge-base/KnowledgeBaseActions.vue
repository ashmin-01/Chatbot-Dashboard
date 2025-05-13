<template>
  <div class="flex gap-2">
    <button
      @click="$emit('add')"
      class="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
    >
      + Add Knowledge Item
    </button>
    <button
      @click="fileInput?.click()"
      class="cursor-pointer border border-orange-400 text-orange-500 hover:bg-orange-50 font-medium px-4 py-2 rounded"
    >
      Import
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".csv, application/json, .json, .xlsx"
      @change="handleFileUpload"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'add'): void
  (e: 'file-upload', file: File): void
}

const emit = defineEmits<Emits>()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    emit('file-upload', input.files[0])
    // Reset the input value so the same file can be selected again
    input.value = ''
  }
}
</script> 