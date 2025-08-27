<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { VerifyEmailDto } from '~/types/api'

definePageMeta({
  title: 'تأیید آدرس ایمیل',
  layout: 'auth',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { verifyEmail, isAuthLoading, authError } = useAuth()
const route = useRoute()
const router = useRouter()

const verificationToken = ref('')
const isVerified = ref(false)
const verificationError = ref('')

// Check if token is in query parameters
onMounted(() => {
  if (route.query.token) {
    verificationToken.value = route.query.token as string
    handleVerifyEmail()
  }
})

const handleVerifyEmail = async () => {
  if (!verificationToken.value) {
    verificationError.value = 'توکن تأیید ایمیل الزامی است'
    return
  }

  const payload: VerifyEmailDto = {
    token: verificationToken.value,
  }

  const result = await verifyEmail(payload)
  if (result) {
    isVerified.value = true
    // Redirect to dashboard after successful verification
    setTimeout(() => {
      router.push('/hammasir/dashboard')
    }, 3000)
  }
  else {
    verificationError.value = 'تأیید ایمیل ناموفق بود. لطفاً دوباره تلاش کنید.'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          تأیید آدرس ایمیل
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          برای تکمیل فرآیند ثبت نام، ایمیل خود را تأیید کنید
        </p>
      </div>

      <div class="bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
        <div v-if="!isVerified && !verificationError">
          <div class="text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                class="size-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                ایمیل تأیید ارسال شد
              </h3>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>لینک تأیید به ایمیلتان ارسال شده است. لطفاً روی لینک موجود در ایمیل کلیک کنید.</p>
              </div>
              <div class="mt-6">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <p>اگر ایمیل را دریافت نکرده‌اید:</p>
                </div>
                <button
                  :disabled="isAuthLoading"
                  class="mt-2 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  @click="handleVerifyEmail"
                >
                  <span v-if="isAuthLoading">در حال ارسال مجدد...</span>
                  <span v-else>ارسال مجدد ایمیل</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="isVerified">
          <div class="text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
              <svg
                class="size-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                ایمیل شما تأیید شد!
              </h3>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>حساب کاربری شما با موفقیت فعال شد. در حال انتقال به داشبورد...</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg
                class="size-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                تأیید ایمیل ناموفق
              </h3>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>{{ verificationError }}</p>
              </div>
              <div class="mt-6">
                <button
                  :disabled="isAuthLoading"
                  class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  @click="handleVerifyEmail"
                >
                  <span v-if="isAuthLoading">در حال تلاش مجدد...</span>
                  <span v-else>تلاش مجدد</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <NuxtLink to="/hammasir/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              بازگشت به صفحه ورود
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
