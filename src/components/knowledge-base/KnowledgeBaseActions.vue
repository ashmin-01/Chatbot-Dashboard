<template>
  <div class="flex flex-wrap gap-2">
    <button
      @click="$emit('add')"
      class="flex-1 sm:flex-none cursor-pointer bg-gradient-to-r from-[var(--color-primary)] to-[#FFA500] hover:shadow-lg text-white text-sm sm:text-base whitespace-nowrap font-medium px-4 sm:px-6 py-2 rounded-full transition-all duration-300 min-w-[140px] "
    >
      + Add Knowledge Item
    </button>
    <button
  @click="fileInput?.click()"
  class="flex-1 sm:flex-none cursor-pointer border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] font-medium px-4 py-2 rounded-full text-sm sm:text-base whitespace-nowrap min-w-[100px]"
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
