<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})

const nuxtApp = useNuxtApp()
const toaster = useToaster()
const router = useRouter()
const { logout: logoutUser } = useUser()
const { setPremiumStatus } = useAIResponseSettings()

onMounted(async () => {
  // Clear the auth store and reset user data
  await logoutUser()
  
  // Reset premium status to false on logout
  setPremiumStatus(false)

  // Show success toast
  toaster.show({
    title: 'خروج موفق',
    message: 'با موفقیت از حساب کاربری خود خارج شدید',
    color: 'success',
    timeout: 2000,
  })
  setTimeout(() => {
  // Redirect to login page
    router.push('/auth/login')
  }, 2000)
})
useHead({ htmlAttrs: { dir: 'rtl' } })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-muted-400 text-sm">
      در حال خروج...
    </div>
  </div>
</template>
