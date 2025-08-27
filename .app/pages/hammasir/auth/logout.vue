<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'

definePageMeta({
  title: 'خروج از حساب کاربری',
  middleware: ['auth'],
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
  <div class="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="bg-white px-4 py-8 text-center shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
        <div class="flex justify-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-indigo-100">
            <svg
              class="size-6 animate-spin text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
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
            :disabled="isAuthLoading"
            class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            @click="handleLogout"
          >
            <span v-if="isAuthLoading">در حال خروج...</span>
            <span v-else>خروج اضطراری</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
