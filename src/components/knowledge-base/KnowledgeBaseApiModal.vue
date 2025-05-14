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
          <i class="ri-api-line text-xl text-[var(--color-primary)]"></i>
        </div>
        <h3 class="text-[20px] font-bold text-[#1A202C]">
          {{ isEditing ? 'Edit API Response' : 'Add New API Response' }}
        </h3>
      </div>

      <!-- Form Fields -->
      <div class="!space-y-6">
        <!-- API Name -->
        <div>
          <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">API Name</label>
          <input
            v-model="formData.name"
            placeholder="e.g., 'Payment Gateway API'"
            required
            class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
            :class="{ 'border-red-500': errors.name }"
          />
          <span v-if="errors.name" class="text-red-500 text-xs mt-1 px-1">{{ errors.name }}</span>
        </div>

        <!-- API URL -->
        <div>
          <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">API URL</label>
          <input
            v-model="formData.url"
            placeholder="e.g., 'https://api.example.com/v1/payments'"
            required
            class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)]"
            :class="{ 'border-red-500': errors.url }"
          />
          <span v-if="errors.url" class="text-red-500 text-xs mt-1 px-1">{{ errors.url }}</span>
        </div>

        <!-- API Description -->
        <div>
          <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">API Description</label>
          <div class="relative">
            <textarea
              v-model="formData.description"
              placeholder="Describe the purpose and functionality of this API"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)] resize-none overflow-y-auto min-h-[100px] max-h-[200px]"
              :class="{ 'border-red-500': errors.description }"
              rows="3"
            ></textarea>
            <div class="absolute bottom-2 right-2 text-xs text-[var(--color-placeholder)]">
              {{ formData.description.length }}/500
            </div>
          </div>
          <span v-if="errors.description" class="text-red-500 text-xs mt-1 px-1">{{ errors.description }}</span>
        </div>

        <!-- API Headers -->
        <div>
          <label class="block text-sm font-medium text-[#1A202C] px-1 !mb-1">API Headers</label>
          <div class="relative">
            <textarea
              v-model="formData.headers"
              placeholder="Enter API headers in JSON format"
              required
              class="w-full border border-[var(--color-border)] p-2 rounded-2xl placeholder-[var(--color-placeholder)] resize-none overflow-y-auto min-h-[100px] max-h-[200px] font-mono text-sm"
              :class="{ 'border-red-500': errors.headers }"
              rows="3"
            ></textarea>
          </div>
          <span v-if="errors.headers" class="text-red-500 text-xs mt-1 px-1">{{ errors.headers }}</span>
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
            <span>{{ isEditing ? 'Save Changes' : 'Add API' }}</span>
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
  name: string
  url: string
  description: string
  headers: string
}

interface FormErrors {
  name: string
  url: string
  description: string
  headers: string
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
  name: '',
  url: '',
  description: '',
  headers: ''
})

// Form errors
const errors = ref<FormErrors>({
  name: '',
  url: '',
  description: '',
  headers: ''
})

// Loading state
const loading = ref(false)

// Reset form function
const resetForm = () => {
  formData.value = {
    name: '',
    url: '',
    description: '',
    headers: ''
  }
  resetErrors()
}

// Reset errors
const resetErrors = () => {
  errors.value = {
    name: '',
    url: '',
    description: '',
    headers: ''
  }
}

// Validate form
const validateForm = (): boolean => {
  let isValid = true
  resetErrors()

  if (!formData.value.name.trim()) {
    errors.value.name = 'This field is required'
    isValid = false
  }
  if (!formData.value.url.trim()) {
    errors.value.url = 'This field is required'
    isValid = false
  }
  if (!formData.value.description.trim()) {
    errors.value.description = 'This field is required'
    isValid = false
  }
  if (!formData.value.headers.trim()) {
    errors.value.headers = 'This field is required'
    isValid = false
  }

  // Validate headers JSON format
  try {
    JSON.parse(formData.value.headers)
  } catch (e) {
    errors.value.headers = 'Invalid JSON format'
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