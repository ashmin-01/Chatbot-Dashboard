<template>
  <div class="px-8 py-6 min-h-screen">
    <!-- Header -->
    <div class="!mb-4">
      <h2 class="text-3xl font-semibold text-gray-800">Knowledge Base</h2>
      <p class="!mt-2 text-gray-500">Manage the bot’s brain. Add, update, or review answers to customer queries.</p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 !mb-3 text-sm font-medium text-gray-500">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 -mb-px border-b-2"
        :class="activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-orange-500 hover:border-orange-300'"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'FAQs'" class="space-y-3">
      <!-- Search + Buttons inside FAQs tab -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-3 gap-3">
        <div class="flex gap-2 w-full sm:w-1/2">
          <select v-model="searchType" class="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600">
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
          class="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
        >
          + Add Knowledge Item
        </button>
        <!-- Import Button -->
        <button
          @click="$refs.fileInput.click()"
          class="border border-orange-400 text-orange-500 hover:bg-orange-50 font-medium px-4 py-2 rounded"
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
            <button @click="showModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <i class="ri-close-line text-2xl"></i>
            </button>

            <!-- Toggle Language -->
            <div class="flex justify-center mb-4 gap-2">
              <button
                :class="language === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'"
                class="px-4 py-1 rounded"
                @click="language = 'en'"
              >English</button>
              <button
                :class="language === 'ar' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'"
                class="px-4 py-1 rounded"
                @click="language = 'ar'"
              >Arabic</button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <div v-if="language === 'en'">
                <input v-model="form.en.question" placeholder="English Question" class="w-full border !mt-4 p-2 rounded" />
                <textarea v-model="form.en.answer" placeholder="English Answer" class="w-full border !mt-4 p-2 rounded"></textarea>
                <input v-model="form.en.category" placeholder="English Category" class="w-full border !mt-4 p-2 rounded" />
              </div>

              <div v-if="language === 'ar'">
                <input v-model="form.ar.question" placeholder="Arabic Question" class="w-full border !mt-4 p-2 rounded"/>
                <textarea v-model="form.ar.answer" placeholder="Arabic Answer" class="w-full border !mt-4 p-2 rounded"></textarea>
                <input v-model="form.ar.category" placeholder="Arabic Category" class="w-full border !mt-4 p-2 rounded"/>
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

      <!-- Knowledge Items -->
      <div
        v-for="(item, index) in filteredItems"
        :key="index"
        class="relative bg-white rounded-xl p-4 shadow flex flex-col gap-2 !mb-4 !mt-3"
      >
      <!-- Top Right Icons -->
      <div class="absolute top-3 right-3 flex gap-2 text-gray-400">
        <button @click="editItem(index)" class="hover:text-gray-600"><i class="ri-pencil-line"></i></button>
        <button @click="archiveItem(index)" class="hover:text-gray-600"><i class="ri-archive-line"></i></button>
        <div class="relative">
          <button @click="toggleMore(index)" class="hover:text-gray-600"><i class="ri-more-line"></i></button>
          <div
            v-if="showMoreIndex === index"
            class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow text-sm z-10"
          >
            <button @click="deleteItem(index)" class="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">
              Delete
            </button>
            <button @click="duplicateItem(index)" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Duplicate
            </button>
          </div>
        </div>
      </div>

        <!-- Question -->
        <div class="text-base font-medium text-gray-800 pr-16">{{ item.question }}</div>

        <!-- Category & Preview -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-1 py-0.5 rounded">
            {{ item.category[0] }}
          </span>
          <span>{{ item.responsePreview }}</span>
        </div>

        <!-- Author & Date -->
        <div class="text-xs text-gray-400">{{ item.author }} – {{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
//import * as XLSX from 'xlsx';
export default {
  name: 'KnowledgeBase',
  data() {
    return {
      activeTab: 'FAQs',
      tabs: ['FAQs', 'Long-form Answers', 'API Responses', 'Archived'],
      searchQuery: '',
      searchType: 'text',
      showModal: false,
      language: 'en',
      form: {
      en: { question: '', answer: '', category: '' },
      ar: { question: '', answer: '', category: '' }
      },
      editingIndex: null,
      showMoreIndex: null,
      archivedItems: [],
      knowledgeItems: [
        {
          question: "What is the BeeOrder Loyalty Program?",
          responsePreview: "The BeeOrder Loyalty Program lets you earn points...",
          category: ["Loyalty Program"],
          author: "Jane Doe",
          date: "Mar 12, 2025 – 10:45 AM"
        },
        {
          question: "Why don’t all the restaurants and stores appear in the app for me?",
          responsePreview: "You may not see all the restaurants and stores in the app due to: Delivery Range: Each restaurant has...",
          category: ["BeeOrder Guide"],
          author: "Jane Doe",
          date: "Feb 28, 2024 – 3:15 PM"
        },
        {
          question: "How can I make an e-payment via Bemo?",
          responsePreview: "1 - Ensure that the phone number linked to your BeeOrder app matches the phone number...",
          category: ["E-Payment"],
          author: "Jane Doe",
          date: "Jan 05, 2023 – 8:30 AM"
        },
        {
          question: "How can I change items in my order?",
          responsePreview: "1 - Contact customer service.\n2 - Provide your order number and the requested changes. if the restaurant has...",
          category: ["Help with an Order"],
          author: "Jane Doe",
          date: "Oct 19, 2022 – 6:50 PM"
        }
      ]
    };
  },
  computed: {
    filteredItems() {
      if (this.searchType === 'text') {
        return this.knowledgeItems.filter(item =>
          item.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.responsePreview.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else if (this.searchType === 'category') {
        return this.knowledgeItems.filter(item =>
          item.category[0].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return this.knowledgeItems;
    }
  },
  methods: {
  editItem(index) {
  const item = this.knowledgeItems[index];
  this.language = 'en';
  this.form = {
    en: {
      question: item.question,
      answer: item.responsePreview,
      category: item.category[0] || ''
    },
    ar: { question: '', answer: '', category: '' } // You can adapt this
  };
  this.editingIndex = index;
  this.showModal = true;
},

archiveItem(index) {
  const item = this.knowledgeItems.splice(index, 1)[0];
  this.archivedItems.push(item);
},

deleteItem(index) {
  this.knowledgeItems.splice(index, 1);
  this.showMoreIndex = null;
},

duplicateItem(index) {
  const item = this.knowledgeItems[index];
  const copy = { ...item, date: new Date().toLocaleString('en-US'), author: "You" };
  this.knowledgeItems.unshift(copy);
  this.showMoreIndex = null;
},

toggleMore(index) {
  this.showMoreIndex = this.showMoreIndex === index ? null : index;
},

addKnowledgeItem() {
  const newItem = {
    question: this.form.en.question,
    responsePreview: this.form.en.answer,
    category: [this.form.en.category],
    author: "You",
    date: new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  };
  if (this.editingIndex !== null) {
    this.knowledgeItems.splice(this.editingIndex, 1, newItem);
  } else {
    this.knowledgeItems.unshift(newItem);
  }
  this.resetForm();
},

resetForm() {
  this.form = {
    en: { question: '', answer: '', category: '' },
    ar: { question: '', answer: '', category: '' }
  };
  this.language = 'en';
  this.editingIndex = null;
  this.showModal = false;
},
handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      this.parseCSV(file);
    } else if (fileName.endsWith('.json')) {
      this.parseJSON(file);
    } else if (fileName.endsWith('.xlsx')) {
      this.parseXLSX(file);
    } else {
      alert('Unsupported file type. Please upload a CSV, JSON, or XLSX file.');
    }

    event.target.value = ''; // reset input
  },

  parseCSV(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => this.insertParsedItems(data),
      error: (err) => alert('CSV parsing error: ' + err.message)
    });
  },

  parseJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        this.insertParsedItems(json);
      } catch (err) {
        alert('JSON parsing error: ' + err.message);
      }
    };
    reader.readAsText(file);
  },

 /* parseXLSX(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      this.insertParsedItems(jsonData);
    };
    reader.readAsBinaryString(file);
  },*/

  insertParsedItems(data) {
    const parsedItems = data.map(row => ({
      question: row['question_en'] || '',
      responsePreview: row['answer_en'] || '',
      category: [row['category_en'] || ''],
      author: "Imported",
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      question_ar: row['question_ar'] || '',
      answer_ar: row['answer_ar'] || '',
      category_ar: row['category_ar'] || ''
    }));

    this.knowledgeItems.unshift(...parsedItems);
  },
}

};
</script>

<style scoped>
@import 'remixicon/fonts/remixicon.css';
</style>
