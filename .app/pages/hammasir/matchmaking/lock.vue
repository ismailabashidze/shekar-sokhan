<script setup lang="ts">
definePageMeta({
  title: 'همسان‌یابی قفل شده',
  preview: {
    title: 'Matchmaking Locked',
    description: 'Matchmaking module is locked',
    categories: ['matchmaking'],
    src: '/img/screens/matchmaking-lock.png',
    srcDark: '/img/screens/matchmaking-lock-dark.png',
    order: 5,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

function backToDashboard() {
  navigateTo('/hammasir')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
      <!-- Lock Icon -->
      <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="ph:lock" class="w-10 h-10 text-white" />
      </div>
      
      <!-- Title -->
      <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white mb-4">
        <span>دسترسی محدود شده</span>
      </BaseHeading>
      
      <!-- Description -->
      <BaseParagraph class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        <span>
          متأسفانه در حال حاضر امکان دسترسی به این بخش وجود ندارد.
        </span>
      </BaseParagraph>
      
      <!-- Back Button -->
      <BaseButton 
        @click="backToDashboard"
        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4"
        size="lg"
      >
        <Icon name="ph:arrow-left" class="w-5 h-5 me-2" />
        بازگشت به داشبورد
      </BaseButton>
    </div>
  </div>
</template>