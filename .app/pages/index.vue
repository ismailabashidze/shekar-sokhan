<script setup lang="ts">
definePageMeta({
  title: 'انتخاب سرویس',
  layout: 'sidebar',
  preview: {
    title: 'انتخاب سرویس',
    description: 'استفاده از سرویس ها',
    categories: ['layouts'],
    src: '/img/logo.svg',
    srcDark: '/img/logo.svg',
    order: 84,
  },
});
useHead({ htmlAttrs: { dir: 'rtl' } });
const nuxtApp = useNuxtApp();
const toaster = useToaster();
navigateTo('/dashboard');
// Temporarily disabled authentication check for testing
// if (!nuxtApp.$pb.authStore.isValid) {
//   toaster.clearAll()
//   toaster.show({
//     title: 'احراز هویت',
//     message: `لطفا ابتدا وارد شوید`,
//     color: 'warning',
//     icon: 'ph:warning',
//     closable: true,
//   })
//   navigateTo('/auth/login', { redirectCode: 401 })
// }
// else {
// TEMPORARILY DISABLED FOR ADMIN TESTING
// navigateTo('/mana/chat', { redirectCode: 301 })
// navigateTo('/dashboard', { redirectCode: 301 })
// }
</script>

<template>
  <div>
    <!-- Version Display -->
    <CommonVersionDisplay />
  </div>
</template>
