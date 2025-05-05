<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setLocale, getStoredLocale } from '../i18n'

const currentLocale = ref(getStoredLocale())

function toggleLanguage() {
  const newLocale = currentLocale.value === 'en' ? 'ar' : 'en'
  setLocale(newLocale)
  currentLocale.value = newLocale
}

onMounted(() => {
  // Ensure the component reflects the current locale on mount
  currentLocale.value = getStoredLocale()
})
</script>

<template>
  <div class="inline-block">
    <button
      @click="toggleLanguage"
      class="px-4 py-2 text-sm rounded-md cursor-pointer transition-all duration-200 [dir='rtl']:font-sans"
    >
      {{ currentLocale === 'en' ? 'العربية' : 'English' }}
    </button>
  </div>
</template>

<!-- Removed scoped CSS as we're now using Tailwind utility classes -->
