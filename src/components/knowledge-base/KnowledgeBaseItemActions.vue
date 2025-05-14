<template>
  <div class="flex items-center gap-2">
    <button
      @click="$emit('edit')"
      class="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
      title="Edit"
    >
      <i class="ri-edit-line"></i>
    </button>
    <button
      @click="$emit('archive')"
      class="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
      title="Archive"
    >
      <i class="ri-archive-line"></i>
    </button>
    <button
      @click="$emit('delete')"
      class="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
      title="Delete"
    >
      <i class="ri-delete-bin-line"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  edit: []
  archive: []
  delete: []
}>()
</script>
