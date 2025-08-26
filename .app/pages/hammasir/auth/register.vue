<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { RegisterDto } from '~/types/api'

definePageMeta({
  title: 'ثبت نام در همسیر',
  layout: 'auth',
  middleware: ['guest']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { register, getGoogleOAuthURL, isAuthLoading, authError } = useAuth()
const router = useRouter()

const formData = ref<RegisterDto>({
  email: '',
  password: '',
  acceptTerms: false
})

const errors = ref<Record<string, string>>({})
const confirmPassword = ref('')

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.value.email) {
    newErrors.email = 'ایمیل الزامی است'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    newErrors.email = 'ایمیل نامعتبر است'
  }
  
  if (!formData.value.password) {
    newErrors.password = 'رمز عبور الزامی است'
  } else if (formData.value.password.length < 8) {
    newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
    newErrors.password = 'رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد'
  }
  
  if (!confirmPassword.value) {
    newErrors.confirmPassword = 'تکرار رمز عبور الزامی است'
  } else if (formData.value.password !== confirmPassword.value) {
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
    } else {
      console.error('Failed to get Google OAuth URL')
    }
  } catch (error) {
    console.error('Google login error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side with illustration -->
    <div class="hidden lg:flex lg:w-1/2 bg-indigo-50 dark:bg-gray-900 items-center justify-center p-12">
      <div class="max-w-md text-center">
        
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          همسیر - مسیر آگاهانه به سوی ازدواج
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          با کمک ما، آمادگی لازم برای ازدواج موفق و پایدار را پیدا کنید
        </p>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <img 
            src="/img/illustrations/wizard/family.png" 
            alt="خانواده" 
            class="w-full h-auto rounded-lg mb-4"
          >
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            با استفاده از آزمون‌های علمی و روان‌شناختی، خود و نیازهای واقعی خود را بشناسید و همسر هماهنگ و سازگار با خود را پیدا کنید.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Right side with form -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center">
          <div class="flex justify-center mb-6">
            <img 
              src="/img/icons/logos/hamdel.png" 
              alt="همسیر لوگو" 
              class="w-16 h-16 object-contain"
            >
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            ثبت نام در همسیر
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            برای شروع مسیر همسان‌یابی خود ثبت نام کنید
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                آدرس ایمیل
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icon name="ph:at-fill" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  :class="[
                    'block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    errors.email 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'example@email.com'"
                />
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                رمز عبور
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icon name="ph:lock-fill" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    errors.password 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'حداقل ۸ کاراکتر'"
                />
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
              <p class="mt-2 text-xs text-gray-500">
                رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد
              </p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                تکرار رمز عبور
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icon name="ph:lock-fill" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  :class="[
                    'block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    errors.confirmPassword 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'تکرار رمز عبور'"
                />
              </div>
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="acceptTerms"
                  v-model="formData.acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
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
            <p v-if="errors.acceptTerms" class="mt-2 text-sm text-red-600">{{ errors.acceptTerms }}</p>

            <div>
              <button
                type="submit"
                :disabled="isAuthLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="isAuthLoading" class="flex items-center">
                  <Icon name="line-md:loading-twotone-loop" class="ml-2 h-5 w-5" />
                  در حال ثبت نام...
                </span>
                <span v-else>ثبت نام</span>
              </button>
              
              <p v-if="authError" class="mt-3 text-sm text-red-600 text-center">
                {{ translateAuthError(authError) }}
              </p>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  یا
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button 
                  @click="handleGoogleLogin"
                  :disabled="isAuthLoading"
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Icon name="logos:google-icon" class="h-5 w-5" />
                </button>
              </div>
              <div>
                <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Icon name="fa6-brands:microsoft" class="h-5 w-5" />
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