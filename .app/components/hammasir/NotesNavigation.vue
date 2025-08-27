<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
        یادداشت‌ها
      </h2>
    </div>
    <div class="px-4 py-5 sm:px-6">
      <nav class="space-y-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center rounded-md px-3 py-2 text-sm font-medium"
          :class="[
            item.current 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
          ]"
        >
          <Icon :name="item.icon" class="ml-3 h-5 w-5 flex-shrink-0" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navigationItems = [
  {
    name: 'لیست یادداشت‌ها',
    to: '/hammasir/notes',
    icon: 'ph:note',
    current: route.path === '/hammasir/notes'
  },
  {
    name: 'داشبورد',
    to: '/hammasir/notes/dashboard',
    icon: 'ph:chart-line',
    current: route.path === '/hammasir/notes/dashboard'
  },
  {
    name: 'افزودن یادداشت',
    to: '/hammasir/notes/add',
    icon: 'ph:plus',
    current: route.path === '/hammasir/notes/add'
  }
]
</script>