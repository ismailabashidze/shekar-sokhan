<script setup lang="ts">
const { isOpen } = useSidebar()

// Define your hammasir-specific navigation items here
const hammasirItems = [
  {
    title: 'داشبورد',
    icon: 'ph:house-duotone',
    to: '/hammasir/dashboard',
  },
  {
    title: 'مشاوران',
    icon: 'ph:chalkboard-teacher',
    to: '/hammasir/counselors',
  },
  {
    title: 'جلسات',
    icon: 'ph:calendar-blank',
    to: '/hammasir/sessions',
  },
  {
    title: 'مشاوره',
    icon: 'ph:chat',
    to: '/hammasir/counseling',
  },
  {
    title: 'نقشه راه',
    icon: 'ph:map-trifold',
    to: '/hammasir/roadmap',
  },
]
</script>

<template>
  <div
    class="pointer-events-none fixed start-0 top-0 z-[60] flex h-full xl:z-10"
  >
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 pointer-events-auto relative z-20 flex h-full w-[80px] flex-col border-r bg-white transition-all duration-300"
      :class="
        isOpen
          ? ''
          : '-translate-x-full rtl:translate-x-full xl:translate-x-0 rtl:xl:-translate-x-0'
      "
    >
    <div class="flex mt-5 h-12 w-full items-center justify-center">
      <slot name="logo">
        <img 
          src="/img/logo-hammasir.png" 
          alt="Hammasir Logo" 
          class="h-10"
        />
      </slot>
    </div>
    
    <!-- Top Menu -->
    <div class="flex flex-col items-center justify-center gap-2 p-2">
      <BaseThemeToggle />
      <NuxtLink
        v-for="item in hammasirItems"
        :key="item.title"
        :to="item.to"
        class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
        :title="item.title"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
      </NuxtLink>
    </div>

    <!-- Bottom Menu -->
    <div class="mt-auto flex flex-col items-center justify-center gap-2 p-2">
      <NuxtLink
        to="/hammasir/admin"
        class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
        title="تنظیمات"
      >
        <Icon name="ph:gear" class="w-5 h-5" />
      </NuxtLink>
      <NuxtLink
        to="/hammasir/my-profile"
        class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
        title="پروفایل"
      >
        <Icon name="ph:user" class="w-5 h-5" />
      </NuxtLink>
    </div>
  </div>
  </div>
</template>
