<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { ResetPasswordDto } from '~/types/api'

definePageMeta({
  title: 'بازیابی رمز عبور',
  layout: 'auth',
  middleware: ['guest'],
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { resetPassword, isAuthLoading, authError } = useAuth()
const route = useRoute()
const router = useRouter()

const formData = ref<ResetPasswordDto>({
  token: '',
  newPassword: '',
})

const errors = ref<Record<string, string>>({})
const confirmPassword = ref('')
const isResetSuccessful = ref(false)

// Get token from query parameters
onMounted(() => {
  if (route.query.token) {
    formData.value.token = route.query.token as string
  }
})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.value.token) {
    newErrors.token = 'توکن بازیابی الزامی است'
  }

  if (!formData.value.newPassword) {
    newErrors.newPassword = 'رمز عبور جدید الزامی است'
  }
  else if (formData.value.newPassword.length < 8) {
    newErrors.newPassword = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
  }
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.newPassword)) {
    newErrors.newPassword = 'رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد'
  }

  if (!confirmPassword.value) {
    newErrors.confirmPassword = 'تکرار رمز عبور الزامی است'
  }
  else if (formData.value.newPassword !== confirmPassword.value) {
    newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleResetPassword = async () => {
  if (!validateForm()) return

  const result = await resetPassword(formData.value)
  if (result) {
    isResetSuccessful.value = true
    // Redirect to login page after successful reset
    setTimeout(() => {
      router.push('/hammasir/auth/login')
    }, 3000)
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          بازیابی رمز عبور
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          رمز عبور جدید خود را وارد کنید
        </p>
      </div>

      <div class="bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
        <div v-if="!isResetSuccessful">
          <form class="space-y-6" @submit.prevent="handleResetPassword">
            <div>
              <label for="token" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد بازیابی
              </label>
              <div class="mt-1">
                <input
                  id="token"
                  v-model="formData.token"
                  name="token"
                  type="text"
                  required
                  :class="[
                    'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
                    errors.token
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'کد دریافتی از ایمیل'"
                >
                <p v-if="errors.token" class="mt-2 text-sm text-red-600">
                  {{ errors.token }}
                </p>
              </div>
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                رمز عبور جدید
              </label>
              <div class="mt-1">
                <input
                  id="newPassword"
                  v-model="formData.newPassword"
                  name="newPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
                    errors.newPassword
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'حداقل ۸ کاراکتر'"
                >
                <p v-if="errors.newPassword" class="mt-2 text-sm text-red-600">
                  {{ errors.newPassword }}
                </p>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد
              </p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                تکرار رمز عبور جدید
              </label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
                    errors.confirmPassword
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'تکرار رمز عبور جدید'"
                >
                <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isAuthLoading"
                class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <span v-if="isAuthLoading">در حال بازیابی...</span>
                <span v-else>بازیابی رمز عبور</span>
              </button>

              <p v-if="authError" class="mt-2 text-center text-sm text-red-600">
                {{ authError }}
              </p>
            </div>
          </form>
        </div>

        <div v-else>
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
                رمز عبور با موفقیت تغییر کرد!
              </h3>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>رمز عبور شما با موفقیت به‌روزرسانی شد. در حال انتقال به صفحه ورود...</p>
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
