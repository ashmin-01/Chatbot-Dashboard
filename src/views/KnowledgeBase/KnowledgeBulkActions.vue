<template>
  <div class="flex items-center p-1 px-6">
    <el-checkbox
      :model-value="checkAll"
      :indeterminate="isIndeterminate"
      @update:model-value="$emit('update:checkAll', $event)"
    >
      Select All
    </el-checkbox>
    <div class="flex px-3">
      <el-button
        v-if="checkedItems.length > 0"
        type="danger"
        size="small"
        @click="$emit('bulk-delete')"
        :disabled="checkedItems.length === 0"
      >
        Delete Selected ({{ checkedItems.length }})
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  checkAll: boolean;
  isIndeterminate: boolean;
  checkedItems: any[];
}>();

defineEmits<{
  'update:checkAll': [value: boolean];
  'bulk-delete': [];
}>();
</script>
