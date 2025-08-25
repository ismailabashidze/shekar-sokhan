<script setup lang="ts">
const buyerLinks = [
  {
    title: 'پیشخوان',
    path: '/baham/buyer',
    icon: 'ph:house-duotone'
  },
  {
    title: 'بازار',
    path: '/baham/buyer/marketplace',
    icon: 'ph:storefront-duotone'
  },
  {
    title: 'سبد خرید',
    path: '/baham/buyer/cart',
    icon: 'ph:shopping-cart-duotone'
  },
  {
    title: 'سفارشات من',
    path: '/baham/buyer/orders',
    icon: 'ph:package-duotone'
  },
  {
    title: 'توزیع‌کنندگان',
    path: '/baham/buyer/distributors',
    icon: 'ph:truck-duotone'
  },
  {
    title: 'پشتیبانی',
    path: '/baham/buyer/support',
    icon: 'ph:headset-duotone'
  },
  {
    title: 'تراکنش‌ها',
    path: '/baham/buyer/transactions',
    icon: 'ph:receipt-duotone'
  },
  {
    title: 'کیف پول',
    path: '/baham/buyer/wallet',
    icon: 'ph:wallet-duotone'
  },
  {
    title: 'تنظیمات',
    path: '/baham/buyer/settings',
    icon: 'ph:gear-duotone'
  }
]
</script>

<template>
  <nav class="flex flex-wrap gap-2 mb-6">
    <NuxtLink 
      v-for="link in buyerLinks" 
      :key="link.path"
      :to="link.path"
      class="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-muted-800 text-gray-800 dark:text-white hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-colors"
    >
      <Icon :name="link.icon" class="size-5 ml-2" />
      {{ link.title }}
    </NuxtLink>
  </nav>
</template>