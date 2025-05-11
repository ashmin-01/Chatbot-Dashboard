<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitch from './ThemeSwitch.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const searchQuery = ref('')
const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const userMenuItems = [
  { label: t('navigation.profile'), action: () => console.log('Profile clicked') },
  { label: t('navigation.settings'), action: () => console.log('Settings clicked') },
  { label: t('common.logout'), action: () => console.log('Logout clicked') },
]
</script>

<template>
  <header
    class="flex items-center justify-end h-16 px-6 z-10 -mt-2 bg-[var(--color-topbar)] shadow-sm"
  >
    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <button
        class="p-2 cursor-pointer text-icon hover:bg-background-mute rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Theme Switch -->
      <ThemeSwitch class="cursor-pointer" />

      <!-- User Profile -->
      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex cursor-pointer items-center space-x-2 p-2 hover:bg-background-mute rounded-lg transition-colors duration-200"
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin+User"
            alt="User avatar"
            class="w-8 h-8 rounded-full"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.174l3.71-3.944a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>
        </button>

        <!-- User Menu Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 py-2 bg-background-soft rounded-lg shadow-xl border border-border"
        >
          <a
            v-for="item in userMenuItems"
            :key="item.label"
            href="#"
            @click.prevent="item.action"
            class="block px-4 py-2 text-sm text-text hover:bg-background-mute"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
