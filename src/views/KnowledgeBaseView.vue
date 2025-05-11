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
      <div
        v-for="(item, index) in filteredItems"
        :key="index"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const knowledgeItems = ref([
  {
    id: 1,
    question: 'What is the BeeOrder Loyalty Program?',
    responsePreview: 'The BeeOrder Loyalty Program lets you earn points...',
    category: ['Loyalty Program'],
    author: 'Jane Doe',
    date: 'Mar 12, 2025 – 10:45 AM',
  },
  {
    question: "Why don't all the restaurants and stores appear in the app for me?",
    responsePreview:
      'You may not see all the restaurants and stores in the app due to: Delivery Range: Each restaurant has...',
    category: ['BeeOrder Guide'],
    author: 'Jane Doe',
    date: 'Feb 28, 2024 – 3:15 PM',
  },
  {
    id: 2,
    question: 'How can I make an e-payment via Bemo?',
    responsePreview:
      '1 - Ensure that the phone number linked to your BeeOrder app matches the phone number...',
    category: ['E-Payment'],
    author: 'Jane Doe',
    date: 'Jan 05, 2023 – 8:30 AM',
  },
  {
    id: 3,
    question: 'How can I change items in my order?',
    responsePreview:
      '1 - Contact customer service.\n2 - Provide your order number and the requested changes. if the restaurant has...',
    category: ['Help with an Order'],
    author: 'Jane Doe',
    date: 'Oct 19, 2022 – 6:50 PM',
  },
])

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
  checkedItems.value = val ? filteredItems.value.map((item) => item.id) : []
  isIndeterminate.value = false
}

const handleCheckedItemsChange = () => {
  const checkedCount = checkedItems.value.length
  checkAll.value = checkedCount === filteredItems.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < filteredItems.value.length
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
const bulkDeleteItems = async () => {
  try {
    const deleteCount = checkedItems.value.length // Store count first
    knowledgeItems.value = knowledgeItems.value.filter(
      (item) => !checkedItems.value.includes(item.id),
    )

    checkedItems.value = []
    checkAll.value = false
    isIndeterminate.value = false

    ElMessage.success(`Deleted ${deleteCount} items successfully`)
  } catch (error) {
    ElMessage.error('Failed to delete items')
    console.error('Bulk delete error:', error)
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
    ar: { question: '', answer: '', category: '' },
  }
  editingIndex.value = index
  showModal.value = true
}

function archiveItem(index) {
  const item = knowledgeItems.value.splice(index, 1)[0]
  archivedItems.value.push(item)
}

function deleteItem(index) {
  knowledgeItems.value.splice(index, 1)
  showMoreIndex.value = null
}

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
