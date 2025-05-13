<template>
  <div class="px-8 py-6 min-h-screen">
    <!-- Header -->
    <KnowledgeBaseHeader />

    <!-- Tabs -->
    <KnowledgeBaseTabs v-model:activeTab="activeTab" />

    <!-- Tab Content -->
    <div v-if="activeTab === 'FAQs'" class="space-y-3">
      <!-- Search + Buttons inside FAQs tab -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-3 gap-3">
        <div class="flex gap-2 w-full sm:w-1/2">
          <select
            v-model="searchType"
            class="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600"
          >
            <option value="text">Search by Text</option>
            <option value="category">Search by Category</option>
          </select>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchType === 'text' ? 'Search questions...' : 'Search category...'"
            class="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div class="flex gap-2">
          <!-- Add Knowledge Item Button triggers this -->
          <button
            @click="showModal = true"
            class="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
          >
            + Add Knowledge Item
          </button>
          <!-- Import Button -->
          <button
            @click="$refs.fileInput.click()"
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
          <!-- Modal -->
          <KnowledgeBaseModal
            v-model="showModal"
            :is-editing="editingIndex !== null"
            :initial-data="form"
            @save="addKnowledgeItem"
            @cancel="resetForm"
          />
        </div>
      </div>


      <!-- Knowledge Base Select -->
      <KnowledgeBaseSelect
        v-model:selectedItems="checkedItems"
        :total-items="filteredItems.length"
        :item-ids="filteredItems.map(item => item.id)"
        @bulk-delete="bulkDeleteItems"
      />
    </div>

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
    <div
      v-for="(item, index) in filteredItems"
      v-else
      :key="item.id"
      class="relative bg-white rounded-xl p-4 shadow flex flex-col gap-3 !mb-4 !mt-3"
      :class="{ 'bg-orange-50 border border-orange-200': isItemChecked(index) }"
    >
      <div class="flex items-start gap-1">
        <!-- Checkbox positioned to the left -->
        <el-checkbox
          v-model="checkedItems"
          :value="getItemId(index)"
          @change="handleCheckedItemsChange"
          class="px-2"
        />
        <div class="flex-1">
          <!-- Top Right Icons -->
          <div class="absolute top-3 right-3 flex gap-2 text-gray-400">
            <button @click="editItem(index)" class="cursor-pointer hover:text-gray-600">
              <i class="ri-pencil-line"></i>
            </button>
            <button @click="archiveItem(index)" class="cursor-pointer hover:text-gray-600">
              <i class="ri-archive-line"></i>
            </button>
            <button
              @click="deleteItem(index)"
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

// Reactive state
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedItems = ref([]) // Stores IDs of checked items
const activeTab = ref('FAQs')
const searchQuery = ref('')
const searchType = ref('text')
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
watch([searchQuery, searchType], () => {
  // Deselect any items when search/filter changes
  checkedItems.value = []
  checkAll.value = false
  isIndeterminate.value = false
})

// Computed properties
const filteredItems = computed(() => {
  if (searchType.value === 'text') {
    return knowledgeItems.value.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.responsePreview.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  } else if (searchType.value === 'category') {
    return knowledgeItems.value.filter((item) =>
      item.category[0].toLowerCase().includes(searchQuery.value.toLowerCase()),
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

const handleCheckedItemsChange = () => {
  const filteredIds = filteredItems.value.map((item) => item.id)
  const checkedCount = checkedItems.value.filter(id => filteredIds.includes(id)).length

  checkAll.value = checkedCount === filteredIds.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < filteredIds.length
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
