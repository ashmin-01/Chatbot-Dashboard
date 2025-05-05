<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import SidebarMenu from './components/SidebarMenu.vue'
import DashboardHeader from './components/DashboardHeader.vue'

const route = useRoute()
const showDashboardLayout = computed(() => {
  return !['login', 'register'].includes(route.name as string)
})
</script>

<template>
  <div class="flex h-screen w-full m-0 p-0">
    <template v-if="showDashboardLayout">
      <SidebarMenu />
      <div class="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div class="flex-1 overflow-y-auto px-8 py-4 md:px-4 md:py-4">
          <RouterView />
        </div>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
