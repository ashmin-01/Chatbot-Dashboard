<template>
  <div class="px-8 py-6 min-h-screen">
    <!--Header-->
    <KnowledgeBaseHeader
      title="Knowledge Base"
      description="Manage the bot's brain. Add, update, or review answers to customer queries."
    />
    <!--Tabs-->
    <KnowledgeTabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="activeTab = $event" />
    <!--FAQs Tab-->
    <div v-if="activeTab === 'FAQs'">
      <KnowledgeBaseSearch
        v-model:search-type="searchType"
        v-model:search-query="searchQuery"
        @add-item="showModal = true"
        @import="handleFileUpload"
      />

      <KnowledgeBulkActions
        v-model:check-all="checkAll"
        v-model:checked-items="checkedItems"
        :is-indeterminate="isIndeterminate"
        @bulk-delete="confirmBulkDelete"
      />

      <KnowledgeItem
        v-for="(item, index) in filteredItems"
        :key="index"
        :item="item"
        :is-checked="isItemChecked(index)"
        @check="handleItemCheck(index, $event)"
        @edit="editItem(index)"
        @archive="archiveItem(index)"
      />
    </div>

    <KnowledgeModal
      v-model:show="showModal"
      v-model:form="form"
      v-model:language="language"
      @save="addKnowledgeItem"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import KnowledgeBaseHeader from '@/views/KnowledgeBase/KnowledgeBaseHeader.vue'
import KnowledgeTabs from '@/views/KnowledgeBase/KnowledgeTabs.vue'
import KnowledgeBaseSearch from '@/views/KnowledgeBase/KnowledgeBaseSearch.vue'
import KnowledgeItem from '@/views/KnowledgeBase/KnowledgeItem.vue'
import KnowledgeModal from '@/views/KnowledgeBase/KnowledgeModal.vue'
import KnowledgeBulkActions from '@/views/KnowledgeBase/KnowledgeBulkActions.vue'

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
    const documentData = {
      // Single object instead of array
      question_ar: form.value.ar.question,
      answer_ar: form.value.ar.answer,
      category_ar: form.value.ar.category,
      question_en: form.value.en.question,
      answer_en: form.value.en.answer,
      category_en: form.value.en.category,
    }

    // Send with correct parameter structure
    const response = await http.post(
      '/add-document',
      { propert: documentData }, // Match backend field name
      { params: { collectionName: 'faqs' } }, // Query parameter
    )

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
    console.error('Error adding document:', error)
    alert('Failed to add document. Please try again.')
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
    id: Math.max(...knowledgeItems.value.map((i) => i.id), 0) + 1,
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
