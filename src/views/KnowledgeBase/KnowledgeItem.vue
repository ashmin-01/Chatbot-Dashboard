<template>
  <div
    class="relative bg-white rounded-xl p-4 shadow flex flex-col gap-3 !mb-4 !mt-3"
    :class="{ 'bg-orange-50 border border-orange-200': isChecked }"
  >
    <div class="flex items-start gap-1">
      <el-checkbox
        :model-value="isChecked"
        @update:model-value="$emit('check', $event)"
        class="px-2"
      />
      <div class="flex-1">
        <div class="absolute top-3 right-3 flex gap-2 text-gray-400">
          <button @click="$emit('edit')" class="cursor-pointer hover:text-gray-600">
            <i class="ri-pencil-line"></i>
          </button>
          <button @click="$emit('archive')" class="cursor-pointer hover:text-gray-600">
            <i class="ri-archive-line"></i>
          </button>
        </div>
        <div class="text-base font-medium text-gray-800">{{ item.question }}</div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
            {{ item.category }}
          </span>
          <span>{{ item.answer }}</span>
        </div>
        <div class="text-xs text-gray-400">{{ item.author }} - {{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface KnowledgeItem {
  question: string;
  answer: string;
  category: string;
  author: string;
  date: string;
}

defineProps<{
  item: KnowledgeItem;
  isChecked: boolean;
}>();

defineEmits<{
  'check': [value: boolean];
  'edit': [];
  'archive': [];
}>();
</script>
