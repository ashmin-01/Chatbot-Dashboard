<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg w-full max-w-xl p-6 shadow-lg relative">
      <button
        @click="$emit('update:show', false)"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <i class="ri-close-line text-2xl"></i>
      </button>

      <div class="flex justify-center mb-4 gap-2">
        <button
          :class="language === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-1 rounded"
          @click="$emit('update:language', 'en')"
        >
          English
        </button>
        <button
          :class="language === 'ar' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-1 rounded"
          @click="$emit('update:language', 'ar')"
        >
          Arabic
        </button>
      </div>

      <div class="space-y-4">
        <div v-if="language === 'en'">
          <input
            :value="form.en.question"
            @input="updateForm('en', 'question', $event)"
            placeholder="English Question"
            class="w-full border !mt-4 p-2 rounded"
          />
          <textarea
            :value="form.en.answer"
            @input="updateForm('en', 'answer', $event)"
            placeholder="English Answer"
            class="w-full border !mt-4 p-2 rounded"
          ></textarea>
          <input
            :value="form.en.category"
            @input="updateForm('en', 'category', $event)"
            placeholder="English Category"
            class="w-full border !mt-4 p-2 rounded"
          />
        </div>

        <div v-if="language === 'ar'">
          <input
            :value="form.ar.question"
            @input="updateForm('ar', 'question', $event)"
            placeholder="Arabic Question"
            class="w-full border !mt-4 p-2 rounded"
          />
          <textarea
            :value="form.ar.answer"
            @input="updateForm('ar', 'answer', $event)"
            placeholder="Arabic Answer"
            class="w-full border !mt-4 p-2 rounded"
          ></textarea>
          <input
            :value="form.ar.category"
            @input="updateForm('ar', 'category', $event)"
            placeholder="Arabic Category"
            class="w-full border !mt-4 p-2 rounded"
          />
        </div>

        <div class="text-right">
          <button
            @click="$emit('save')"
            class="bg-green-500 hover:bg-green-600 text-white !mt-4 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  question: string;
  answer: string;
  category: string;
}

interface Form {
  en: FormData;
  ar: FormData;
}

const props = defineProps<{
  show: boolean;
  form: Form;
  language: 'en' | 'ar';
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'update:form': [value: Form];
  'update:language': [value: 'en' | 'ar'];
  'save': [];
}>();

const updateForm = (lang: 'en' | 'ar', field: keyof FormData, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  const newForm = { ...props.form };
  newForm[lang][field] = value;
  emit('update:form', newForm);
};
</script>
