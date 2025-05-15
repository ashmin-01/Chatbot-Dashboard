<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router' // <-- Import useRoute

import SidebarLink from './SidebarLink.vue'

// Import your icons
import dashboardIcon from './icons/my-icons/dashboardIcon.svg'
import knowledgeBaseIcon from './icons/my-icons/knowledgeBaseIcon.svg'
import analyticsIcon from './icons/my-icons/analyticsIcon.svg'
import developerToolsIcon from './icons/my-icons/developerToolsIcon.svg'
import settingsIcon from './icons/my-icons/settingsIcon.svg'
import notificationsIcon from './icons/my-icons/notificationsIcon.svg'
import logoutIcon from './icons/my-icons/logoutIcon.svg'

const { t } = useI18n()
const route = useRoute() // <-- Get current route

const mainMenu = [
  { icon: dashboardIcon, labelKey: 'navigation.dashboard', route: '/' },
  { icon: knowledgeBaseIcon, labelKey: 'navigation.knowledgeBase', route: '/knowledge-base' },
  { icon: analyticsIcon, label: 'Analytics & Reports', route: '/api-example' },
  { icon: developerToolsIcon, label: 'Developer Tools', route: '/tanstack-api' },
]

const footerMenu = [
{ icon: settingsIcon, label: 'Settings', route: '/settings' },
  { icon: notificationsIcon, label: 'Notifications & Alerts', route: '/notifications' },
  { icon: logoutIcon, label: 'Logout', route: '/logout' },
]

const collapsed = ref(false)
const toggleSidebar = () => (collapsed.value = !collapsed.value)

// Computed property to get current route path
const currentRoute = computed(() => route.path)
</script>

<template>
  <aside
    class="relative flex flex-col h-screen transition-[width] duration-300 ease-in-out font-sans rounded-r-4xl z-20"
    :class="{ 'w-[70px]': collapsed, 'w-[300px]': !collapsed }"
    :style="{ '--sidebar-width': collapsed ? '70px' : '300px' }"
    style="background-color: var(--color-sidebar)"
  >
    <!-- Toggle Button -->
    <button
      class="absolute top-2 right-6 text-3xl cursor-pointer text-text"
      @click="toggleSidebar"
    >
      <span v-if="collapsed">›</span>
      <span v-else>‹</span>
    </button>

    <!-- Logo -->
    <div class="flex justify-center items-center py-12">
      <img
        alt="BeeOrder logo"
        :class="[collapsed ? 'w-12 h-12' : 'w-28 h-28']"
        src="@/assets/beeorder_logo.png"
      />
    </div>

    <!-- Main Menu -->
    <nav class="flex-grow px-2 space-y-2">
      <SidebarLink
        v-for="item in mainMenu"
        :key="item.labelKey || item.label"
        :item="item"
        :collapsed="collapsed"
        :is-active="currentRoute === item.route"
      />
    </nav>

    <!-- Footer Menu -->
    <div class="px-2 pb-20 space-y-2">
      <SidebarLink
        v-for="item in footerMenu"
        :key="item.label"
        :item="item"
        :collapsed="collapsed"
        :is-active="currentRoute === item.route"
      />
    </div>

    <!-- Footer -->
    <div v-if="!collapsed" class="p-5 text-sm text-center">
      <p class="text-center w-full">© 2025 BeeOrder Dashboard</p>
    </div>
  </aside>
</template>
