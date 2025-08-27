<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { RegisterDto } from '~/types/api'

definePageMeta({
  title: 'ثبت نام در همسیر',
  layout: 'auth',
  middleware: ['guest'],
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { register, getGoogleOAuthURL, isAuthLoading, authError } = useAuth()
const router = useRouter()

const formData = ref<RegisterDto>({
  email: '',
  password: '',
  acceptTerms: false,
})

const errors = ref<Record<string, string>>({})
const confirmPassword = ref('')

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.value.email) {
    newErrors.email = 'ایمیل الزامی است'
  }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    newErrors.email = 'ایمیل نامعتبر است'
  }

  if (!formData.value.password) {
    newErrors.password = 'رمز عبور الزامی است'
  }
  else if (formData.value.password.length < 8) {
    newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
  }
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
    newErrors.password = 'رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد'
  }

  if (!confirmPassword.value) {
    newErrors.confirmPassword = 'تکرار رمز عبور الزامی است'
  }
  else if (formData.value.password !== confirmPassword.value) {
    newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست'
  }

  if (!formData.value.acceptTerms) {
    newErrors.acceptTerms = 'پذیرش شرایط و قوانین الزامی است'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  const result = await register(formData.value)
  if (result) {
    // Redirect to verification page or dashboard
    router.push('/hammasir/auth/verify-email')
  }
}

// Function to translate specific error messages
const translateAuthError = (error: string | null) => {
  if (!error) return error

  // Translate specific validation errors
  if (error === 'email must be an email') {
    return 'ایمیل باید یک ایمیل معتبر باشد'
  }

  if (error === 'password must be a string') {
    return 'رمز عبور باید یک رشته باشد'
  }

  return error
}

const handleGoogleLogin = async () => {
  try {
    const result = await getGoogleOAuthURL()
    if (result && result.url) {
      // Redirect to Google OAuth URL
      window.location.href = result.url
    }
    else {
      console.error('Failed to get Google OAuth URL')
    }
  }
  catch (error) {
    console.error('Google login error:', error)
  }
}
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left side with illustration -->
    <div class="hidden items-center justify-center bg-indigo-50 p-12 dark:bg-gray-900 lg:flex lg:w-1/2">
      <div class="max-w-md text-center">
        <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          همسیر - مسیر آگاهانه به سوی ازدواج
        </h2>
        <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
          با کمک ما، آمادگی لازم برای ازدواج موفق و پایدار را پیدا کنید
        </p>
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <img
            src="/img/illustrations/wizard/family.png"
            alt="خانواده"
            class="mb-4 h-auto w-full rounded-lg"
          >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            با استفاده از آزمون‌های علمی و روان‌شناختی، خود و نیازهای واقعی خود را بشناسید و همسر هماهنگ و سازگار با خود را پیدا کنید.
          </p>
        </div>
      </div>
    </div>

    <!-- Right side with form -->
    <div class="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="w-full max-w-md space-y-8">
        <!-- Mobile logo -->
        <div class="text-center lg:hidden">
          <div class="mb-6 flex justify-center">
            <img
              src="/img/icons/logos/hamdel.png"
              alt="همسیر لوگو"
              class="size-16 object-contain"
            >
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            ثبت نام در همسیر
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            برای شروع مسیر همسان‌یابی خود ثبت نام کنید
          </p>
        </div>

        <div class="bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                آدرس ایمیل
              </label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Icon name="ph:at-fill" class="size-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  :class="[
                    'block w-full rounded-lg border py-3 pl-3 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm',
                    errors.email
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'example@email.com'"
                >
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                رمز عبور
              </label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Icon name="ph:lock-fill" class="size-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full rounded-lg border py-3 pl-3 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm',
                    errors.password
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'حداقل ۸ کاراکتر'"
                >
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
              <p class="mt-2 text-xs text-gray-500">
                رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد
              </p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                تکرار رمز عبور
              </label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Icon name="ph:lock-fill" class="size-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full rounded-lg border py-3 pl-3 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm',
                    errors.confirmPassword
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'تکرار رمز عبور'"
                >
              </div>
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>

            <div class="flex items-start">
              <div class="flex h-5 items-center">
                <input
                  id="acceptTerms"
                  v-model="formData.acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                >
              </div>
              <div class="mr-3 text-sm">
                <label for="acceptTerms" class="font-medium text-gray-700 dark:text-gray-300">
                  <span>
                    با
                    <a href="/hammasir/terms" class="text-indigo-600 hover:text-indigo-500">شرایط و قوانین</a>
                    و
                    <a href="/hammasir/privacy" class="text-indigo-600 hover:text-indigo-500">حریم خصوصی</a>
                    موافقم
                  </span>
                </label>
              </div>
            </div>
            <p v-if="errors.acceptTerms" class="mt-2 text-sm text-red-600">
              {{ errors.acceptTerms }}
            </p>

            <div>
              <button
                type="submit"
                :disabled="isAuthLoading"
                class="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <span v-if="isAuthLoading" class="flex items-center">
                  <Icon name="line-md:loading-twotone-loop" class="ml-2 size-5" />
                  در حال ثبت نام...
                </span>
                <span v-else>ثبت نام</span>
              </button>

              <p v-if="authError" class="mt-3 text-center text-sm text-red-600">
                {{ translateAuthError(authError) }}
              </p>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  یا
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  :disabled="isAuthLoading"
                  class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  @click="handleGoogleLogin"
                >
                  <Icon name="logos:google-icon" class="size-5" />
                </button>
              </div>
              <div>
                <a href="#" class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  <Icon name="fa6-brands:microsoft" class="size-5" />
                </a>
              </div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              قبلاً حساب کاربری ایجاد کرده‌اید؟
              <NuxtLink to="/hammasir/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                وارد شوید
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
