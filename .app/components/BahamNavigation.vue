<script setup lang="ts">
const navigationLinks = [
  {
    title: 'صفحه اصلی',
    path: '/baham',
    icon: 'ph:house-duotone'
  },
  {
    title: 'نحوه کار',
    path: '/baham/how-it-works',
    icon: 'ph:flow-arrow-duotone'
  },
  {
    title: 'درباره ما',
    path: '/baham/about',
    icon: 'ph:info-duotone'
  },
  {
    title: 'تماس با ما',
    path: '/baham/contact',
    icon: 'ph:phone-duotone'
  },
  {
    title: 'سوالات متداول',
    path: '/baham/faq',
    icon: 'ph:question-duotone'
  }
]
</script>

<template>
  <nav class="flex flex-wrap gap-2 mb-6">
    <NuxtLink 
      v-for="link in navigationLinks" 
      :key="link.path"
      :to="link.path"
      class="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-muted-800 text-gray-800 dark:text-white hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-colors"
    >
      <Icon :name="link.icon" class="size-5 ml-2" />
      {{ link.title }}
    </NuxtLink>
  </nav>
</template>