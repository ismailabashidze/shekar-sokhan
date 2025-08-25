<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Simple breadcrumb generation based on route path
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(path => path)
  
  // Skip the first segment ('baham') and map the rest
  return pathArray.slice(1).map((segment, index) => {
    // Create the path up to this point
    const path = '/baham/' + pathArray.slice(1, index + 2).join('/')
    
    // Map segment to readable name
    const nameMap = {
      'buyer': 'پیشخوان خریدار',
      'marketplace': 'بازار',
      'cart': 'سبد خرید',
      'orders': 'سفارشات من',
      'distributors': 'توزیع‌کنندگان',
      'support': 'پشتیبانی',
      'transactions': 'تراکنش‌ها',
      'wallet': 'کیف پول',
      'settings': 'تنظیمات',
      'provider': 'پیشخوان ارائه‌دهنده',
      'loads': 'بارها',
      'requests': 'درخواست‌ها',
      'inventory': 'موجودی',
      'reports': 'گزارشات',
      'distributor': 'پیشخوان توزیع‌کننده',
      'coordination': 'هماهنگی',
      'area': 'منطقه',
      'profile': 'پروفایل',
      'admin': 'پیشخوان ادمین',
      'users': 'کاربران',
      'financial': 'مالی',
      'tickets': 'تیکت‌ها',
      'content': 'محتوا'
    }
    
    return {
      name: nameMap[segment] || segment,
      path: path
    }
  })
})
</script>

<template>
  <nav class="flex mb-6" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink to="/baham" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
          <Icon name="ph:house-duotone" class="mr-2.5 size-4" />
          خانه
        </NuxtLink>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <div class="flex items-center">
          <Icon name="ph:caret-left" class="size-4 text-gray-400 mx-1" />
          <NuxtLink 
            :to="crumb.path" 
            class="ml-1 text-sm font-medium"
            :class="index === breadcrumbs.length - 1 
              ? 'text-gray-500 dark:text-gray-400 pointer-events-none' 
              : 'text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white'"
            :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
          >
            {{ crumb.name }}
          </NuxtLink>
        </div>
      </li>
    </ol>
  </nav>
</template>