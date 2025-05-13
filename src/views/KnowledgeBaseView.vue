<template>
  <div class="px-8 py-6 min-h-screen">
    <!-- Header -->
    <div class="!mb-4">
      <h2 class="text-3xl font-semibold text-gray-800">Knowledge Base</h2>
      <p class="!mt-2 text-gray-500">
        Manage the bot’s brain. Add, update, or review answers to customer queries.
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 !mb-3 text-sm font-medium text-gray-500">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 -mb-px border-b-2"
        :class="
          activeTab === tab
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent hover:text-orange-500 hover:border-orange-300'
        "
      >
        {{ tab }}
      </button>
    </div>

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
          <div
            v-if="showModal"
            class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div class="bg-white rounded-lg w-full max-w-xl p-6 shadow-lg relative">
              <!-- Close Button -->
              <button
                @click="showModal = false"
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <i class="ri-close-line text-2xl"></i>
              </button>

              <!-- Toggle Language -->
              <div class="flex justify-center mb-4 gap-2">
                <button
                  :class="
                    language === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                  "
                  class="px-4 py-1 rounded"
                  @click="language = 'en'"
                >
                  English
                </button>
                <button
                  :class="
                    language === 'ar' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                  "
                  class="px-4 py-1 rounded"
                  @click="language = 'ar'"
                >
                  Arabic
                </button>
              </div>

              <!-- Form Fields -->
              <div class="space-y-4">
                <div v-if="language === 'en'">
                  <input
                    v-model="form.en.question"
                    placeholder="English Question"
                    class="w-full border !mt-4 p-2 rounded"
                  />
                  <textarea
                    v-model="form.en.answer"
                    placeholder="English Answer"
                    class="w-full border !mt-4 p-2 rounded"
                  ></textarea>
                  <input
                    v-model="form.en.category"
                    placeholder="English Category"
                    class="w-full border !mt-4 p-2 rounded"
                  />
                </div>

                <div v-if="language === 'ar'">
                  <input
                    v-model="form.ar.question"
                    placeholder="Arabic Question"
                    class="w-full border !mt-4 p-2 rounded"
                  />
                  <textarea
                    v-model="form.ar.answer"
                    placeholder="Arabic Answer"
                    class="w-full border !mt-4 p-2 rounded"
                  ></textarea>
                  <input
                    v-model="form.ar.category"
                    placeholder="Arabic Category"
                    class="w-full border !mt-4 p-2 rounded"
                  />
                </div>

                <!-- Save Button -->
                <div class="text-right">
                  <button
                    @click="addKnowledgeItem"
                    class="bg-green-500 hover:bg-green-600 text-white !mt-4 px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Bulk Actions-->
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
            v-if="checkedItems.length > 0"
            type="danger"
            size="small"
            @click="confirmBulkDelete"
            :disabled="checkedItems.length === 0"
          >
            Delete Selected ({{ checkedItems.length }})
          </el-button>
        </div>
      </div>
      <!-- Knowledge Items -->
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

<!-- Knowledge Items (only shows when not loading, no error, and has items) -->
<div
  v-for="(item, index) in filteredItems"
  v-else
  :key="item.id"
  class="relative bg-white rounded-xl p-4 shadow flex flex-col gap-3 !mb-4 !mt-3"
  :class="{ 'bg-orange-50 border border-orange-200': isItemChecked(index) }"
>
  <!-- Your existing item content here -->
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
  </div>
</template>

<script setup>
import { ref, computed , watch , onMounted } from 'vue'
import Papa from 'papaparse'
import http from '../api/http'
import { ElMessageBox, ElMessage } from 'element-plus'


// Reactive state
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedItems = ref([]) // Stores IDs/Indicies of checked
const activeTab = ref('FAQs')
const tabs = ref(['FAQs', 'Long-form Answers', 'API Responses', 'Archived'])
const searchQuery = ref('')
const searchType = ref('text')
const showModal = ref(false)
const language = ref('en')
const form = ref({
  en: { question: '', answer: '', category: '' },
  ar: { question: '', answer: '', category: '' },
})
const editingIndex = ref(null)
const showMoreIndex = ref(null)
const archivedItems = ref([])
const knowledgeItems = ref([])
const loading = ref(false)
const error = ref(null)
//watch
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

const selectedItems = computed(() => {
  return knowledgeItems.value.filter((item) => checkedItems.value.includes(item.id))
})
// Helper functions
const getItemId = (index) => {
  return knowledgeItems.value[index].id
}

const isItemChecked = (index) => {
  return checkedItems.value.includes(getItemId(index))
}
// Checkbox group handlers
const handleCheckAllChange = (val) => {
  const idsInFiltered = filteredItems.value.map((item) => item.id)
  if (val) {
    checkedItems.value = [...idsInFiltered]
  } else {
    checkedItems.value = []
  }
  isIndeterminate.value = false
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
    },
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
    const uuidsToDelete = [...checkedItems.value]

    // Optimistically remove items from the UI
    knowledgeItems.value = knowledgeItems.value.filter(
      (item) => !uuidsToDelete.includes(item.id)
    )
    checkedItems.value = []
    checkAll.value = false
    isIndeterminate.value = false

    // Make the backend DELETE request
    await http.delete('/delete-documents', {
      data: uuidsToDelete,  // This is the request body
      params: { collection_name: 'FAQs' }, // This is the query param
    })

    ElMessage.success(`Deleted ${uuidsToDelete.length} items successfully`)
  } catch (error) {
    console.error('Bulk delete error:', error)
    ElMessage.error(error.response?.data?.detail?.message || 'Failed to delete items')
  }
}

function editItem(index) {
  const item = knowledgeItems.value[index]
  language.value = 'en'
  form.value = {
    en: {
      question: item.question,
      answer: item.responsePreview,
      category: item.category[0] || '',
    },
    ar: {
      question: item.question_ar || '',
      answer: item.answer_ar || '',
      category: item.category_ar || '',
    },
  }
  editingIndex.value = index
  showModal.value = true
}


function archiveItem(index) {
  const item = knowledgeItems.value.splice(index, 1)[0]
  archivedItems.value.push(item)
}
// edited here for the delete

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

//end of delete edited
async function addKnowledgeItem() {
  try {
    const documentData = {  // Single object instead of array
      question_ar: form.value.ar.question,
      answer_ar: form.value.ar.answer,
      category_ar: form.value.ar.category,
      question_en: form.value.en.question,
      answer_en: form.value.en.answer,
      category_en: form.value.en.category,
    };

    // Send with correct parameter structure
    const response = await http.post('/add-document',
      { propert: documentData },  // Match backend field name
      { params: { collectionName: 'faqs' } }  // Query parameter
    );

    const newItem = {
      question: form.value.en.question,
      responsePreview: form.value.en.answer,
      category: [form.value.en.category],
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
    console.log('Document added successfully:', response.data)
  } catch (error) {
    console.error('Full error details:', error.response?.data)
    if (error.response?.data?.detail) {
      console.log(`Validation errors:\n${JSON.stringify(error.response.data.detail, null, 2)}`)
    }
  }
}

function resetForm() {
  form.value = {
    en: { question: '', answer: '', category: '' },
    ar: { question: '', answer: '', category: '' },
  }
  language.value = 'en'
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
