<template>
  <div
    class="relative bg-white rounded-xl p-4 shadow flex flex-col gap-3 !mb-4 !mt-3"
    :class="{ 'bg-orange-50 border border-orange-200': isChecked }"
  >
    <div class="flex items-start gap-1">
      <el-checkbox
        :model-value="isChecked"
        @update:model-value="$emit('update:checked', $event)"
        :value="item.id"
        class="px-2"
      />
      <div class="flex-1">
        <!-- Top Right Icons -->
        <div class="absolute top-3 right-3 flex gap-2 text-gray-400">
          <button @click="handleEdit" class="cursor-pointer hover:text-gray-600">
  <i class="ri-pencil-line"></i>
</button>
          <button @click="$emit('archive')" class="cursor-pointer hover:text-gray-600">
            <i class="ri-archive-line"></i>
          </button>
          <button
            @click="$emit('delete')"
            class="cursor-pointer hover:text-red-600 text-red-400"
          >
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>

        <!-- Question -->
        <div class="text-base font-medium text-gray-800 pr-16 !mb-3">{{ item.question }}</div>

        <!-- Category & Preview -->
        <div class="flex items-center gap-2 text-sm text-gray-600 !mb-3">
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-1 py-0.5 rounded">
            {{ item.category[0] }}
          </span>
          <span>{{ item.responsePreview }}</span>
        </div>

        <!-- Author & Date -->
        <div class="text-xs text-gray-400 !mt-2">{{ item.author }} – {{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

interface KnowledgeItem {
  id: string
  question: string
  responsePreview: string
  category: string[]
  author: string
  date: string
  question_ar?: string
  answer_ar?: string
  category_ar?: string
}

interface Props {
  item: KnowledgeItem
  isChecked: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void
  (e: 'edit', item: KnowledgeItem): void
  (e: 'archive'): void
  (e: 'delete'): void
}>()

const handleEdit = () => {
  emit('edit', props.item)
}
</script>
<style scoped>
.el-checkbox {
  margin-right: 0;
  margin-left: -0.5rem;
}

.el-checkbox__label {
  font-size: 14px;
}
</style>
