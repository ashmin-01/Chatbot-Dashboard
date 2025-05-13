<template>
  <div class="flex items-center p-1 px-6">
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      Select All
    </el-checkbox>
    <div class="flex px-3">
      <el-button
        v-if="selectedItems.length > 0"
        type="danger"
        size="small"
        @click="confirmBulkDelete"
        :disabled="selectedItems.length === 0"
      >
        Delete Selected ({{ selectedItems.length }})
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

interface Props {
  selectedItems: string[]
  totalItems: number
  itemIds: string[]
}

interface Emits {
  (e: 'update:selectedItems', value: string[]): void
  (e: 'bulk-delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const checkAll = ref(false)
const isIndeterminate = ref(false)

// Watch for changes in selected items
watch(() => props.selectedItems, (newVal) => {
  const checkedCount = newVal.length
  checkAll.value = checkedCount === props.totalItems
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.totalItems
}, { deep: true })

// Handle select all change
const handleCheckAllChange = (val: boolean) => {
  if (val) {
    // Select all items using the actual item IDs
    emit('update:selectedItems', [...props.itemIds])
  } else {
    // Deselect all items
    emit('update:selectedItems', [])
  }
  isIndeterminate.value = false
}

// Confirm bulk delete
const confirmBulkDelete = () => {
  ElMessageBox.confirm(
    `Are you sure you want to delete ${props.selectedItems.length} items?`,
    'Confirm Bulk Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      emit('bulk-delete')
    })
    .catch(() => {
      ElMessage.info('Bulk delete canceled')
    })
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
