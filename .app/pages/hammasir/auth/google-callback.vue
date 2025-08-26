<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { GoogleCallbackDto } from '~/types/api'

definePageMeta({
  title: 'تأیید ورود با گوگل',
  layout: 'auth',
  middleware: ['guest']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { handleGoogleOAuthCallback, isAuthLoading, authError } = useAuth()
const route = useRoute()
const router = useRouter()

const isProcessing = ref(true)
const processingError = ref('')

onMounted(async () => {
  // Extract authorization code from URL query parameters
  const code = route.query.code as string
  const error = route.query.error as string
  
  if (error) {
    processingError.value = `خطا در ورود با گوگل: ${error}`
    isProcessing.value = false
    return
  }
  
  if (!code) {
    processingError.value = 'کد احراز هویت یافت نشد'
    isProcessing.value = false
    return
  }
  
  // Prepare callback data
  const callbackData: GoogleCallbackDto = {
    code
  }
  
  // Handle Google OAuth callback
  const result = await handleGoogleOAuthCallback(callbackData)
  if (result) {
    // Redirect to dashboard or intended page
    router.push('/hammasir/dashboard')
  } else {
    processingError.value = authError.value || 'ورود با گوگل ناموفق بود'
  }
  
  isProcessing.value = false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <div v-if="isProcessing">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            در حال تأیید ورود با گوگل
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            لطفاً منتظر بمانید...
          </p>
        </div>
        
        <div v-else-if="processingError">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            خطا در ورود با گوگل
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {{ processingError }}
          </p>
          <div class="mt-6">
            <NuxtLink 
              to="/hammasir/auth/login" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              بازگشت به صفحه ورود
            </NuxtLink>
          </div>
        </div>
        
        <div v-else>
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 class="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            ورود موفق!
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            در حال انتقال به داشبورد...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>