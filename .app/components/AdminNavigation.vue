<script setup lang="ts">
const adminNavigation = [
  {
    title: 'پیشخوان',
    icon: { name: 'ph:house-duotone', class: 'w-5 h-5' },
    to: '/baham/admin',
  },
  {
    title: 'مدیریت کاربران',
    icon: { name: 'ph:users-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/users',
  },
  {
    title: 'مدیریت بارها',
    icon: { name: 'ph:package-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/loads',
  },
  {
    title: 'مدیریت سفارشات',
    icon: { name: 'ph:shopping-cart-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/orders',
  },
  {
    title: 'مدیریت مالی',
    icon: { name: 'ph:currency-circle-dollar-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/financial',
  },
  {
    title: 'تیکت‌های پشتیبانی',
    icon: { name: 'ph:ticket-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/tickets',
  },
  {
    title: 'مدیریت محتوا',
    icon: { name: 'ph:book-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/content',
  },
  {
    title: 'تنظیمات سیستم',
    icon: { name: 'ph:gear-duotone', class: 'w-5 h-5' },
    to: '/baham/admin/settings',
  },
]
</script>

<template>
  <div class="space-y-1">
    <NuxtLink
      v-for="item in adminNavigation"
      :key="item.title"
      :to="item.to"
      class="text-muted-700 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-800 group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
      active-class="bg-muted-100 text-primary-600 dark:bg-muted-800 dark:text-primary-400"
    >
      <Icon 
        v-if="item.icon" 
        :name="item.icon.name" 
        :class="[item.icon.class, 'mr-3 flex-shrink-0']" 
      />
      {{ item.title }}
    </NuxtLink>
  </div>
</template>