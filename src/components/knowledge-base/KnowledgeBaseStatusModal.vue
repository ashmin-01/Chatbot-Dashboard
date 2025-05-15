<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="400px"
    class="status-modal"
  >
    <div class="flex flex-col items-center justify-center py-8">
      <!-- Loading State -->
      <template v-if="!isSuccess">
        <i class="ri-loader-4-line animate-spin text-4xl text-orange-500 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Adding your knowledge to the hive 🐝</h3>
        <p class="text-sm text-gray-500">Please wait while we process your request...</p>
      </template>

      <!-- Success State -->
      <template v-else>
        <i class="ri-checkbox-circle-line text-4xl text-green-500 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Knowledge Item Added!</h3>
        <p class="text-sm text-gray-500">You have successfully added a new knowledge item.</p>
      </template>
    </div>

    <!-- Close Button (only show in success state) -->
    <template #footer>
      <div class="flex justify-center">
        <el-button
          v-if="isSuccess"
          type="primary"
          @click="$emit('update:modelValue', false)"
        >
          Greate, Thanks! 
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  isSuccess: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped>
.status-modal :deep(.el-dialog__body) {
  padding: 0;
}

.status-modal :deep(.el-dialog__header) {
  display: none;
}

.status-modal :deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
