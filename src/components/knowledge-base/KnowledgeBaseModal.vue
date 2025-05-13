<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center z-50"
    style="background-color: rgba(0, 0, 0, 0.3);"
  >
    <div class="bg-[#F8FAFC] rounded-lg w-full max-w-2xl p-6 shadow-lg" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <h3 class="text-[20px] font-bold text-[#1A202C] !mb-6">
        {{ isEditing ? 'Edit Knowledge Item' : 'Add New Knowledge Item' }}
      </h3>

      <!-- Form Fields -->
      <div class="space-y-4">
        <!-- Questions Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Question (English)</label>
            <input
              v-model="formData.en.question"
              placeholder="Enter question in English"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Question (Arabic)</label>
            <input
              v-model="formData.ar.question"
              placeholder="Enter question in Arabic"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
            />
          </div>
        </div>

        <!-- Answers Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Answer (English)</label>
            <textarea
              v-model="formData.en.answer"
              placeholder="Enter answer in English"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Answer (Arabic)</label>
            <textarea
              v-model="formData.ar.answer"
              placeholder="Enter answer in Arabic"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Categories Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Category (English)</label>
            <input
              v-model="formData.en.category"
              placeholder="Enter category in English"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] !mb-1">Category (Arabic)</label>
            <input
              v-model="formData.ar.category"
              placeholder="Enter category in Arabic"
              required
              class="w-full border border-[#E2E8F0] p-2 rounded placeholder-[#A0AEC0] focus:border-[#2B3A42] focus:ring-1 focus:ring-[#2B3A42]"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-6">
          <button
            @click="handleCancel"
            type="button"
            class="cursor-pointer bg-[#E2E8F0] hover:bg-[#D1D5DB] text-[#1A202C] font-medium px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="cursor-pointer bg-[#28A745] hover:bg-[#218838] text-white font-medium px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FormData {
  en: {
    question: string
    answer: string
    category: string
  }
  ar: {
    question: string
    answer: string
    category: string
  }
}

// Props
const props = defineProps<{
  modelValue: boolean
  isEditing: boolean
  initialData?: FormData
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [data: FormData]
  'cancel': []
}>()

// Form data
const formData = ref<FormData>({
  en: {
    question: '',
    answer: '',
    category: ''
  },
  ar: {
    question: '',
    answer: '',
    category: ''
  }
})

// Watch for initial data changes
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  }
}, { immediate: true })

// Methods
const handleSave = () => {
  emit('save', formData.value)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script> 