<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})

const nuxtApp = useNuxtApp()
const toaster = useToaster()
const router = useRouter()

onMounted(() => {
  // Clear the auth store
  nuxtApp.$pb.authStore.clear()

  // Show success toast
  toaster.show({
    title: 'خروج موفق',
    message: 'با موفقیت از حساب کاربری خود خارج شدید',
    color: 'success',
    timeout: 2000,
  })

  // Redirect to login page
  router.push('/auth/login')
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-muted-400 text-sm">
      در حال خروج...
    </div>
  </div>
</template>
