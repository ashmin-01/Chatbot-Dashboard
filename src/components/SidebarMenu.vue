<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconHome from './icons/IconHome.vue'
import IconInfoCircle from './icons/IconInfoCircle.vue'

// Get the i18n composition API instance
const { t } = useI18n()

// Define menu items with icons, labels, and routes
const menuItems = [
  { icon: IconHome, labelKey: 'navigation.dashboard', route: '/' },
  { icon: IconInfoCircle, labelKey: 'navigation.about', route: '/about' },
  { icon: IconInfoCircle, label: 'API Example', route: '/api-example' },
  { icon: IconInfoCircle, label: 'TanStack API', route: '/tanstack-api' },
  // Add more menu items as needed
]

// State for sidebar collapse functionality
const collapsed = ref(false)
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <aside
    class="flex flex-col h-screen bg-background-soft text-text border-r border-border transition-[width] duration-300 ease-in-out"
    :class="{ 'w-[70px]': collapsed, 'w-[250px]': !collapsed }"
  >
    <div class="flex items-center p-4 border-b border-border h-16">
      <img alt="Vue logo" class="w-10 h-10" src="@/assets/logo.svg" />
      <h2 v-if="!collapsed" class="ml-2 text-lg font-bold flex-grow">
        {{ t('navigation.dashboard') }}
      </h2>
      <button
        class="bg-transparent border-none text-text text-2xl cursor-pointer"
        @click="toggleSidebar"
      >
        <span v-if="collapsed">›</span>
        <span v-else>‹</span>
      </button>
    </div>

    <nav class="flex-grow py-4 overflow-y-auto">
      <ul class="list-none p-0 m-0">
        <li v-for="item in menuItems" :key="item.labelKey || item.label">
          <RouterLink
            :to="item.route"
            class="flex items-center px-4 py-3 text-text no-underline transition-colors duration-200 hover:bg-background-mute router-link-active:bg-primary-hover router-link-active:text-primary router-link-active:font-bold"
          >
            <span class="w-6 h-6 flex items-center justify-center"
              ><component :is="item.icon"
            /></span>
            <span v-if="!collapsed" class="ml-3">{{
              item.labelKey ? t(item.labelKey) : item.label
            }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div v-if="!collapsed" class="p-4 text-sm text-center border-t border-border">
      <p>© 2023 Dashboard</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  height: 100vh;
  width: 250px;
  transition: width 0.3s ease;
  border-right: 1px solid var(--color-border);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-header h2 {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  flex-grow: 1;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
}

.sidebar-nav {
  flex-grow: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: var(--color-background-mute);
}

.nav-link.active {
  background-color: var(--color-primary-hover);
  color: var(--color-primary);
  font-weight: bold;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  margin-left: 0.75rem;
}

.sidebar-footer {
  padding: 1rem;
  font-size: 0.875rem;
  text-align: center;
  border-top: 1px solid var(--color-border);
}
</style>
