<script setup lang="ts">
import { useAuth } from '~/composables/hammasir/useAuth'
import type { LoginDto } from '~/types/api'

definePageMeta({
  title: 'ورود به حساب کاربری',
  layout: 'auth',
  middleware: ['guest'],
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { login, getGoogleOAuthURL, isAuthLoading, authError } = useAuth()
const router = useRouter()

const formData = ref<LoginDto>({
  email: '',
  password: '',
})

const errors = ref<Record<string, string>>({})

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
  else if (formData.value.password.length < 6) {
    newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  const result = await login(formData.value)
  if (result) {
    // Redirect to dashboard or intended page
    router.push('/hammasir/dashboard')
  }
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
  <div class="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          ورود به حساب کاربری
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          برای ادامه وارد حساب خود شوید
        </p>
      </div>

      <div class="bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
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
                  'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
                  errors.email
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                :placeholder="'example@email.com'"
              >
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              رمز عبور
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="formData.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                :class="[
                  'block w-full appearance-none rounded-md border px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
                  errors.password
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                :placeholder="'حداقل ۶ کاراکتر'"
              >
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              >
              <label for="remember-me" class="mr-2 block text-sm text-gray-900 dark:text-white">
                مرا به خاطر بسپار
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/hammasir/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                رمز عبور خود را فراموش کرده‌اید؟
              </NuxtLink>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isAuthLoading"
              class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span v-if="isAuthLoading">در حال ورود...</span>
              <span v-else>ورود</span>
            </button>

            <p v-if="authError" class="mt-2 text-center text-sm text-red-600">
              {{ authError }}
            </p>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">
                یا
              </span>
            </div>
          </div>

          <div class="mt-6">
            <button
              :disabled="isAuthLoading"
              class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              @click="handleGoogleLogin"
            >
              <svg class="mx-2 size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84.87-2.22.81-.62z" />
              </svg>
              <span>ورود با گوگل</span>
            </button>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            حساب کاربری ندارید؟
            <NuxtLink to="/hammasir/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              ثبت نام کنید
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
