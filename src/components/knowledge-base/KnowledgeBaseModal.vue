<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center z-50"
    style="background-color: rgba(0, 0, 0, 0.3);"
  >
    <div class="bg-[#F8FAFC] rounded-lg w-full max-w-2xl p-6 shadow-lg relative" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Close Button -->
      <button
        @click="handleClose"
        class="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <i class="ri-close-line text-xl"></i>
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3 !mb-6">
        <!-- Icon Placeholder -->
        <div class="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
          <i class="ri-lightbulb-line text-xl text-[var(--color-primary)]"></i>
        </div>
        <h3 class="text-[20px] font-bold text-[#1A202C]">
          {{ isEditing ? 'Edit Knowledge Item' : 'Add New Knowledge Item' }}
        </h3>
      </div>

      <!-- Form Fields -->
      <div class="!space-y-6">
        <!-- Questions Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">

              Customer Question (English)</label>
            <input
              v-model="formData.en.question"
              placeholder="e.g., 'What’s your delivery time?'"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
              :class="{ 'border-red-500': errors.en.question }"
            />
            <span v-if="errors.en.question" class="text-red-500 text-xs mt-1 px-1">{{ errors.en.question }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">
       
              سؤال الزبون (عربي)
          </label>
            <input
              v-model="formData.ar.question"
              placeholder="مثال: ما هي أوقات التوصيل؟"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
              :class="{ 'border-red-500': errors.ar.question }"
            />
            <span v-if="errors.ar.question" class="text-red-500 text-xs mt-1 px-1">{{ errors.ar.question }}</span>
          </div>
        </div>

        <!-- Answers Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">Bot Response (English)</label>
            <div class="relative">
              <textarea
                v-model="formData.en.answer"
                placeholder="e.g., 'Our delivery time is 30–45 mins!'"
                required
                class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)] resize-none overflow-y-auto min-h-[100px] max-h-[200px]"
                :class="{ 'border-red-500': errors.en.answer }"
                rows="3"
              ></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-[var(--color-placeholder)]">
                {{ formData.en.answer.length }}/500
              </div>
            </div>
            <span v-if="errors.en.answer" class="text-red-500 text-xs mt-1 px-1">{{ errors.en.answer }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">رد البوت (عربي)</label>
            <div class="relative">
              <textarea
                v-model="formData.ar.answer"
                placeholder="مثال: توصيلنا يستغرق 30-45 دقيقة"
                required
                class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)] resize-none overflow-y-auto min-h-[100px] max-h-[200px]"
                :class="{ 'border-red-500': errors.ar.answer }"
                rows="3"
              ></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-[var(--color-placeholder)]">
                {{ formData.ar.answer.length }}/500
              </div>
            </div>
            <span v-if="errors.ar.answer" class="text-red-500 text-xs mt-1 px-1">{{ errors.ar.answer }}</span>
          </div>
        </div>

        <!-- Categories Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">Knowledge Category (English)</label>
            <input
              v-model="formData.en.category"
              placeholder="e.g., 'Delivery, Pricing, Menu'"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
              :class="{ 'border-red-500': errors.en.category }"
            />
            <span v-if="errors.en.category" class="text-red-500 text-xs mt-1 px-1">{{ errors.en.category }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">تصنيف المعرفة (عربي)</label>
            <input
              v-model="formData.ar.category"
              placeholder="مثال: توصيل، أسعار، قائمة الطعام"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
              :class="{ 'border-red-500': errors.ar.category }"
            />
            <span v-if="errors.ar.category" class="text-red-500 text-xs mt-1 px-1">{{ errors.ar.category }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-6">
          <button
            @click="handleCancel"
            type="button"
            class="cursor-pointer border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] px-6 py-2 rounded-full transition-all duration-300"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="cursor-pointer bg-gradient-to-r from-[var(--color-primary)] to-[#FFA500] hover:shadow-lg text-white font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          >
            <span>{{ isEditing ? 'Save Changes' : 'Add Item' }}</span>
            <i v-if="loading" class="ri-loader-2-line animate-spin"></i>
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

interface FormErrors {
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

// Form errors
const errors = ref<FormErrors>({
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

// Loading state
const loading = ref(false)

// Reset form function
const resetForm = () => {
  formData.value = {
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
  }
  resetErrors()
}

// Reset errors
const resetErrors = () => {
  errors.value = {
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
  }
}

// Validate form
const validateForm = (): boolean => {
  let isValid = true
  resetErrors()

  // Validate English fields
  if (!formData.value.en.question.trim()) {
    errors.value.en.question = 'This field is required'
    isValid = false
  }
  if (!formData.value.en.answer.trim()) {
    errors.value.en.answer = 'This field is required'
    isValid = false
  }
  if (!formData.value.en.category.trim()) {
    errors.value.en.category = 'This field is required'
    isValid = false
  }

  // Validate Arabic fields
  if (!formData.value.ar.question.trim()) {
    errors.value.ar.question = 'This field is required'
    isValid = false
  }
  if (!formData.value.ar.answer.trim()) {
    errors.value.ar.answer = 'This field is required'
    isValid = false
  }
  if (!formData.value.ar.category.trim()) {
    errors.value.ar.category = 'This field is required'
    isValid = false
  }

  return isValid
}

// Watch for initial data changes
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  } else {
    resetForm()
  }
}, { immediate: true })

// Methods
const handleSave = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await emit('save', formData.value)
    resetForm()
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
  emit('update:modelValue', false)
}

const handleClose = () => {
  resetForm()
  emit('update:modelValue', false)
}
</script>
