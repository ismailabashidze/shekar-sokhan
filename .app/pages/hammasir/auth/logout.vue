<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'

definePageMeta({
  title: 'خروج از حساب کاربری',
  middleware: ['auth']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { logout, isAuthLoading } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  const result = await logout()
  if (result) {
    // Redirect to login page after successful logout
    router.push('/hammasir/auth/login')
  }
}

// Automatically logout when page loads
onMounted(() => {
  handleLogout()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <div class="flex justify-center">
          <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
          در حال خروج از حساب کاربری
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          در حال پاک‌سازی اطلاعات نشست...
        </p>
        <div class="mt-6">
          <button
            @click="handleLogout"
            :disabled="isAuthLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="isAuthLoading">در حال خروج...</span>
            <span v-else>خروج اضطراری</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>