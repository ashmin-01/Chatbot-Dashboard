<template>
  <div class="space-y-4">
    <!-- Add API Button -->
    <div class="flex justify-end">
      <button
        @click="$emit('add')"
        class="cursor-pointer bg-gradient-to-r from-[var(--color-primary)] to-[#FFA500] hover:shadow-lg text-white font-medium px-6 py-2 !mb-3 rounded-full transition-all duration-300 flex items-center gap-3"
      >
        <i class="ri-add-line"></i>
        <span>Add API Response</span>
      </button>
    </div>

    <!-- API List -->
    <div v-if="apis.length > 0" class="space-y-4">
      <div
        v-for="api in apis"
        :key="api.id"
        class="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-border)]"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-[#1A202C]">{{ api.name }}</h4>
            <p class="text-sm text-[var(--color-placeholder)] break-all">{{ api.url }}</p>
            <p class="text-sm text-[#1A202C]">{{ api.description }}</p>
          </div>
          <KnowledgeBaseItemActions
            @edit="$emit('edit', api)"
            @archive="$emit('archive', api)"
            @delete="$emit('delete', api)"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 bg-white rounded-lg border border-[var(--color-border)] !mb-3"
    >
      <i class="ri-api-line text-4xl text-[var(--color-primary)] mb-4"></i>
      <h3 class="text-lg font-semibold text-[#1A202C] mb-2">No API Responses</h3>
      <p class="text-sm text-[var(--color-placeholder)]">
        Add your first API response to get started
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import KnowledgeBaseItemActions from './KnowledgeBaseItemActions.vue'

interface Api {
  id: string
  name: string
  url: string
  description: string
  headers: string
}

defineProps<{
  apis: Api[]
}>()

defineEmits<{
  add: []
  edit: [api: Api]
  archive: [api: Api]
  delete: [api: Api]
}>()
</script>
