<template>
  <div class="space-y-1">
    <NuxtLink
      to="/hammasir/courses"
      class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      :class="isActive('/hammasir/courses') && !isSubpathActive('/hammasir/courses/my') && !isSubpathActive('/hammasir/courses/progress') 
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      <svg class="mr-3 size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      همه دوره‌ها
    </NuxtLink>
    
    <NuxtLink
      to="/hammasir/courses/my"
      class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      :class="isSubpathActive('/hammasir/courses/my') 
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      <svg class="mr-3 size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      دوره‌های من
    </NuxtLink>
    
    <NuxtLink
      to="/hammasir/courses/progress"
      class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      :class="isSubpathActive('/hammasir/courses/progress') 
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      <svg class="mr-3 size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      پیشرفت یادگیری
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if current route exactly matches the given path
const isActive = (path: string) => {
  return route.path === path
}

// Check if current route is a subpath of the given path
const isSubpathActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>