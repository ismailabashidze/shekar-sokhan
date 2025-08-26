<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { EmailDto } from '~/types/api'

definePageMeta({
  title: 'فراموشی رمز عبور',
  layout: 'auth',
  middleware: ['guest']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { requestPasswordReset, isAuthLoading, authError } = useAuth()
const router = useRouter()

const formData = ref<EmailDto>({
  email: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitted = ref(false)

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.value.email) {
    newErrors.email = 'ایمیل الزامی است'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    newErrors.email = 'ایمیل نامعتبر است'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handlePasswordReset = async () => {
  if (!validateForm()) return
  
  const result = await requestPasswordReset(formData.value)
  if (result) {
    isSubmitted.value = true
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          بازیابی رمز عبور
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          لینک بازیابی رمز عبور برای شما ارسال خواهد شد
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!isSubmitted">
          <form class="space-y-6" @submit.prevent="handlePasswordReset">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                آدرس ایمیل
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="formData.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  :class="[
                    'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    errors.email 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :placeholder="'example@email.com'"
                />
                <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                آدرس ایمیلی که با آن ثبت نام کرده‌اید را وارد کنید
              </p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isAuthLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="isAuthLoading">در حال ارسال...</span>
                <span v-else>ارسال لینک بازیابی</span>
              </button>
              
              <p v-if="authError" class="mt-2 text-sm text-red-600 text-center">
                {{ authError }}
              </p>
            </div>
          </form>
        </div>
        
        <div v-else>
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">لینک بازیابی ارسال شد</h3>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <p>لینک بازیابی رمز عبور به ایمیل "{{ formData.email }}" ارسال شد. لطفاً صندوق ورودی خود را چک کنید.</p>
              </div>
              <div class="mt-6">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  اگر ایمیل را دریافت نکرده‌اید، پوشه اسپم خود را نیز چک کنید.
                </p>
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