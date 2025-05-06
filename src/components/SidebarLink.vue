<script setup lang="ts">
defineProps<{
  item: { icon: string; labelKey?: string; label?: string; route: string }
  collapsed: boolean
}>()

import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
 <RouterLink
  :to="item.route"
  class="flex items-center gap-3 rounded-4xl transition-all duration-300 ease-in-out transform"
  :class="[
    collapsed ? 'justify-center px-2 py-4' : 'px-6 py-5',
    route.path === item.route
      ? 'bg-[var(--color-sidebar-selection-box)] text-[var(--color-sidebar-text-selected)] font-bold shadow-md scale-[1.01]'
      : 'text-[var(--color-sidebar-text-default)] hover:text-[var(--color-sidebar-text-selected)] font-semibold hover:bg-opacity-10 hover:scale-[1.01]'
  ]"
>
  <span
    class="w-6 h-6 flex items-center justify-center transition-colors duration-300"
    :class="{
      'text-[var(--color-sidebar-icon-selected)]': route.path === item.route,
      'text-[var(--color-sidebar-icon-default)]': route.path !== item.route
    }"
  >
    <component :is="item.icon" />
  </span>

  <span
    v-if="!collapsed"
    class="transition-opacity duration-300"
  >
    {{ item.labelKey ? t(item.labelKey) : item.label }}
  </span>
</RouterLink>
</template>
