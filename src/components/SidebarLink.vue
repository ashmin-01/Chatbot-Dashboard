<script setup lang="ts">
defineProps<{
  item: { icon: string; labelKey?: string; label?: string; route: string }
  collapsed: boolean
  isActive?: boolean
}>()

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="item.route"
    class="flex items-center gap-3 rounded-4xl transition-all duration-300 ease-in-out transform"
    :class="[
      collapsed ? 'justify-center px-2 py-4' : 'px-6 py-5',
      isActive
        ? 'bg-[var(--color-sidebar-selection-box)] text-[var(--color-sidebar-text-selected)] font-bold shadow-md scale-[1.01]'
        : 'text-[var(--color-sidebar-text-default)] hover:text-[var(--color-sidebar-text-selected)] font-semibold hover:bg-opacity-10 hover:scale-[1.01]'
    ]"
  >
    <component
      :is="item.icon"
      class="w-6 h-6 transition-colors duration-200"
      :class="{
          '[&>path]:stroke-[var(--color-sidebar-icon-selected)]': isActive,
          '[&>path]:stroke-[var(--color-sidebar-icon-default)]': !isActive
      }"
    />

    <span
      v-if="!collapsed"
      class="transition-opacity duration-300"
    >
      {{ item.labelKey ? t(item.labelKey) : item.label }}
    </span>
  </RouterLink>
</template>
