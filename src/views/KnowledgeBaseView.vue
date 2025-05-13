<template>
  <div class="px-8 py-6 min-h-screen">
    <!-- Header -->
    <KnowledgeBaseHeader />

    <!-- Tabs -->
    <KnowledgeBaseTabs v-model:activeTab="activeTab" />

    <!-- Tab Content -->
    <div class="space-y-3">
      <!-- FAQs Tab -->
      <template v-if="activeTab === 'FAQs'">
        <!-- Search + Buttons -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-3 gap-3">
          <KnowledgeBaseSearch v-model="searchState" />
          <KnowledgeBaseActions
            @add="showModal = true"
            @file-upload="handleFileUpload"
          />
        </div>

        <!-- Knowledge Base Select -->
        <KnowledgeBaseSelect
          v-model:selectedItems="checkedItems"
          :total-items="filteredItems.length"
          :item-ids="filteredItems.map(item => item.id)"
          @bulk-delete="bulkDeleteItems"
        />

        <!-- Knowledge Base Modal -->
        <KnowledgeBaseModal
          v-model="showModal"
          :is-editing="editingIndex !== null"
          :initial-data="form"
          @save="addKnowledgeItem"
          @cancel="resetForm"
        />

        <!-- Loading/Error States -->
        <div v-if="loading" class="flex justify-center py-8">
          <i class="ri-loader-4-line animate-spin text-2xl text-orange-500"></i>
        </div>

        <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mx-4">
          {{ error }}
        </div>

        <div v-else-if="knowledgeItems.length === 0" class="bg-yellow-50 text-yellow-700 p-4 rounded-lg mx-4">
          No knowledge items found.
        </div>

        <!-- Knowledge Items List -->
        <template v-else>
          <KnowledgeBaseItem
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :item="item"
            :is-checked="isItemChecked(index)"
            @update:checked="(checked) => handleItemCheck(index, checked)"
            @edit="editItem(index)"
            @archive="archiveItem(index)"
            @delete="deleteItem(index)"
          />
        </template>
      </template>

      <!-- Other Tabs -->
      <template v-else>
        <div class="bg-yellow-50 text-yellow-700 p-4 rounded-lg mx-4">
          {{ activeTab }} content coming soon...
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Papa from 'papaparse'
import http from '../api/http'
import { ElMessageBox, ElMessage } from 'element-plus'
import KnowledgeBaseHeader from '../components/knowledge-base/KnowledgeBaseHeader.vue'
import KnowledgeBaseTabs from '../components/knowledge-base/KnowledgeBaseTabs.vue'
import KnowledgeBaseModal from '../components/knowledge-base/KnowledgeBaseModal.vue'
import KnowledgeBaseSelect from '../components/knowledge-base/KnowledgeBaseSelect.vue'
import KnowledgeBaseSearch from '../components/knowledge-base/KnowledgeBaseSearch.vue'
import KnowledgeBaseItem from '../components/knowledge-base/KnowledgeBaseItem.vue'
import KnowledgeBaseActions from '../components/knowledge-base/KnowledgeBaseActions.vue'

// Reactive state
const searchState = ref({
  query: '',
  type: 'text'
})
const checkedItems = ref([]) // Stores IDs of checked items
const activeTab = ref('FAQs')
const showModal = ref(false)
const editingIndex = ref(null)
const showMoreIndex = ref(null)
const archivedItems = ref([])
const knowledgeItems = ref([])
const loading = ref(false)
const error = ref(null)
const form = ref({
  en: { question: '', answer: '', category: '' },
  ar: { question: '', answer: '', category: '' },
})

// Watch for search changes
watch(() => searchState.value, () => {
  // Deselect any items when search/filter changes
  checkedItems.value = []
}, { deep: true })

// Computed properties
const filteredItems = computed(() => {
  const { query, type } = searchState.value
  if (type === 'text') {
    return knowledgeItems.value.filter(
      (item) =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.responsePreview.toLowerCase().includes(query.toLowerCase()),
    )
  } else if (type === 'category') {
    return knowledgeItems.value.filter((item) =>
      item.category[0].toLowerCase().includes(query.toLowerCase()),
    )
  }
  return knowledgeItems.value
})

// Helper functions
const getItemId = (index) => {
  return knowledgeItems.value[index].id
}

const isItemChecked = (index) => {
  return checkedItems.value.includes(getItemId(index))
}

const handleItemCheck = (index, checked) => {
  const itemId = getItemId(index)
  if (checked) {
    checkedItems.value.push(itemId)
  } else {
    const itemIndex = checkedItems.value.indexOf(itemId)
    if (itemIndex > -1) {
      checkedItems.value.splice(itemIndex, 1)
    }
  }
}

// Bulk delete confirmation
const confirmBulkDelete = () => {
  ElMessageBox.confirm(
    `Are you sure you want to delete ${checkedItems.value.length} items?`,
    'Confirm Bulk Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      bulkDeleteItems()
    })
    .catch(() => {
      ElMessage.info('Bulk delete canceled')
    })
}

// Methods

// fetch chunks
const fetchKnowledgeItems = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await http.get('/chunks', {
      params: { collection_name: 'FAQs' },
      timeout: 30000
    });

    // Handle the nested response structure
    if (!response.data?.chunks?.objects) {
      throw new Error('Invalid response format - missing objects array');
    }

    knowledgeItems.value = response.data.chunks.objects.map(chunk => ({
      id: chunk.uuid,
      question: chunk.properties.question_en,
      responsePreview: chunk.properties.answer_en,
      category: [chunk.properties.category_en],
      question_ar: chunk.properties.question_ar,
      answer_ar: chunk.properties.answer_ar,
      category_ar: chunk.properties.category_ar,
      author: 'Admin',
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }));
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.response?.data?.detail ||
                 err.message ||
                 'Failed to load knowledge base';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
}

// load data when component mounts
onMounted(fetchKnowledgeItems)

const bulkDeleteItems = async () => {
  try {
    const response = await http.delete('/delete-documents', {
      data: checkedItems.value,
      params: { collection_name: 'FAQs' }
    })
    if (response.data.success) {
      ElMessage.success('Items deleted successfully')
      checkedItems.value = []
      await fetchKnowledgeItems()
    }
  } catch (err) {
    console.error('Error deleting items:', err)
    ElMessage.error('Failed to delete items')
  }
}

function editItem(index) {
  const item = knowledgeItems.value[index]
  editingIndex.value = index
  showModal.value = true
}

function archiveItem(index) {
  const item = knowledgeItems.value.splice(index, 1)[0]
  archivedItems.value.push(item)
}

async function deleteItem(index) {
  const item = knowledgeItems.value[index]

  try {
    await http.delete('/delete-document', {
      params: {
        uuid: item.id,
        collection_name: 'FAQs'
      }
    })

    knowledgeItems.value.splice(index, 1)
    showMoreIndex.value = null
    ElMessage.success(`Item deleted successfully`)
  } catch (error) {
    console.error('Delete error:', error)
    ElMessage.error(
      error.response?.data?.detail?.message || 'Failed to delete item'
    )
  }
}

async function addKnowledgeItem(formData) {
  try {
    const documentData = {
      question_ar: formData.ar.question,
      answer_ar: formData.ar.answer,
      category_ar: formData.ar.category,
      question_en: formData.en.question,
      answer_en: formData.en.answer,
      category_en: formData.en.category,
    };

    const response = await http.post('/add-document',
      { propert: documentData },  // This matches the backend's Document model
      {
        params: { collectionName: 'FAQs' },  // Changed to match the case in backend
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const newItem = {
      question: formData.en.question,
      responsePreview: formData.en.answer,
      category: [formData.en.category],
      author: 'You',
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }

    if (editingIndex.value !== null) {
      knowledgeItems.value.splice(editingIndex.value, 1, newItem)
    } else {
      knowledgeItems.value.unshift(newItem)
    }

    resetForm()
    ElMessage.success('Knowledge item added successfully')
    console.log('Document added successfully:', response.data)
  } catch (error) {
    console.error('Full error details:', error.response?.data)
    ElMessage.error(error.response?.data?.detail?.message || 'Failed to add knowledge item')
    if (error.response?.data?.detail) {
      console.log(`Validation errors:\n${JSON.stringify(error.response.data.detail, null, 2)}`)
    }
  }
}

function resetForm() {
  editingIndex.value = null
  showModal.value = false
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.csv')) {
    parseCSV(file)
  } else if (fileName.endsWith('.json')) {
    parseJSON(file)
  } else if (fileName.endsWith('.xlsx')) {
    parseXLSX(file)
  } else {
    alert('Unsupported file type. Please upload a CSV, JSON, or XLSX file.')
  }

  event.target.value = ''
}

function parseCSV(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: ({ data }) => insertParsedItems(data),
    error: (err) => alert('CSV parsing error: ' + err.message),
  })
}

function parseJSON(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result)
      insertParsedItems(json)
    } catch (err) {
      alert('JSON parsing error: ' + err.message)
    }
  }
  reader.readAsText(file)
}

function insertParsedItems(data) {
  const parsedItems = data.map((row) => ({
    id: Math.max(...knowledgeItems.value.map(i => i.id), 0) + 1,
    question: row['question_en'] || '',
    responsePreview: row['answer_en'] || '',
    category: [row['category_en'] || ''],
    author: 'Imported',
    date: new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    question_ar: row['question_ar'] || '',
    answer_ar: row['answer_ar'] || '',
    category_ar: row['category_ar'] || '',
  }))

  knowledgeItems.value.unshift(...parsedItems)
}
</script>

<style scoped>
@import 'remixicon/fonts/remixicon.css';
.bulk-actions {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

:deep(.el-checkbox) {
  margin-right: 0;
  margin-left: -0.5rem;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
}
</style>
