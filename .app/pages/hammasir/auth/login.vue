<script setup lang="ts">
import type { LoginRequest } from '~/composables/hammasir-auth'

// Page metadata
definePageMeta({
  title: 'ورود به همسیر',
  layout: 'empty',
  auth: false
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'ورود به همسیر - پلتفرم همسان‌یابی و مشاوره'
})

// Composables
const { login, getGoogleOAuthUrl } = useAuth()
const router = useRouter()
const route = useRoute()

// Reactive state
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const rememberMe = ref(false)

// Form data
const loginForm = reactive<LoginRequest>({
  email: '',
  password: ''
})

// Form validation
const errors = reactive({
  email: '',
  password: ''
})

// Computed properties
const isFormValid = computed(() => {
  return loginForm.email.length > 0 && 
         loginForm.password.length > 0 &&
         isValidEmail(loginForm.email)
})

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
  errors.email = ''
  errors.password = ''
}

function validateForm(): boolean {
  clearMessages()
  let isValid = true

  if (!loginForm.email) {
    errors.email = 'ایمیل الزامی است'
    isValid = false
  } else if (!isValidEmail(loginForm.email)) {
    errors.email = 'فرمت ایمیل معتبر نیست'
    isValid = false
  }

  if (!loginForm.password) {
    errors.password = 'رمز عبور الزامی است'
    isValid = false
  } else if (loginForm.password.length < 6) {
    errors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد'
    isValid = false
  }

  return isValid
}

// Event handlers
async function handleLogin() {
  if (!validateForm()) return

  isLoading.value = true
  clearMessages()

  try {
    const tokens = await login(loginForm)
    
    // Store tokens (you might want to use a token manager composable)
    if (process.client) {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('rememberedEmail', loginForm.email)
      }
    }

    successMessage.value = 'ورود موفقیت‌آمیز بود'
    
    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect as string || '/hammasir/dashboard'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1500)

  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.status === 401) {
      errorMessage.value = 'ایمیل یا رمز عبور اشتباه است'
    } else if (error.status === 400) {
      errorMessage.value = 'اطلاعات وارد شده معتبر نیست'
    } else if (error.message?.includes('network')) {
      errorMessage.value = 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید'
    } else {
      errorMessage.value = 'خطایی در ورود رخ داده است. لطفاً دوباره تلاش کنید'
    }
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleLogin() {
  isGoogleLoading.value = true
  clearMessages()

  try {
    const { url } = await getGoogleOAuthUrl()
    
    // Store current route for redirect after OAuth
    if (process.client) {
      localStorage.setItem('oauthRedirect', route.query.redirect as string || '/hammasir/dashboard')
    }
    
    // Redirect to Google OAuth
    window.location.href = url

  } catch (error: any) {
    console.error('Google OAuth error:', error)
    errorMessage.value = 'خطا در ورود با گوگل. لطفاً دوباره تلاش کنید'
  } finally {
    isGoogleLoading.value = false
  }
}

// Load remembered credentials on mount
onMounted(() => {
  if (process.client) {
    const remembered = localStorage.getItem('rememberMe')
    if (remembered) {
      rememberMe.value = true
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) {
        loginForm.email = savedEmail
      }
    }
  }
})

// Watch form changes to clear errors
watch(loginForm, () => {
  if (errors.email && isValidEmail(loginForm.email)) {
    errors.email = ''
  }
  if (errors.password && loginForm.password.length >= 6) {
    errors.password = ''
  }
  if (errorMessage.value) {
    errorMessage.value = ''
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 flex items-center justify-center p-6 relative">
    <!-- Theme Toggle Button -->
    <div class="fixed top-6 left-6 z-50">
      <div class="relative">
        <div class="absolute inset-0 bg-white/20 dark:bg-muted-800/20 backdrop-blur-md rounded-full"></div>
        <BaseThemeToggle class="relative z-10" />
      </div>
    </div>

    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary-200/30 to-purple-300/30 dark:from-primary-800/20 dark:to-purple-700/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-primary-200/20 dark:from-pink-800/10 dark:to-primary-800/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 dark:from-purple-800/5 dark:to-pink-800/5 rounded-full blur-2xl"></div>
    </div>

    <!-- Main login container -->
    <div class="relative w-full max-w-md">
      <!-- Logo and header -->
      <div class="text-center mb-8">
        <div class="relative flex justify-center items-center">
          <!-- Simple logo without mask -->
          <div class="relative">
            <img 
              src="/img/hammasir-logo.png" 
              alt="لوگو همسیر" 
              class="w-48 h-32 object-contain transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
        
        <BaseHeading as="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white mb-2">
          <span class="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
            ورود به همسیر
          </span>
        </BaseHeading>
        
        <BaseParagraph class="text-muted-600 dark:text-muted-400 font-medium">
          به پلتفرم همسان‌یابی و توسعه فردی خوش آمدید
        </BaseParagraph>
      </div>

      <!-- Login form card -->
      <div class="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-muted-800/95 backdrop-blur-xl p-8 shadow-2xl border border-white/40 dark:border-muted-700/40">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-purple-100/30 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-primary-100/30 dark:from-pink-900/20 dark:to-primary-900/20 rounded-full blur-xl"></div>

        <form @submit.prevent="handleLogin" class="relative space-y-6">
          <!-- Email Input -->
          <div class="space-y-2">
            <BaseInput
              v-model="loginForm.email"
              label="آدرس ایمیل"
              placeholder="example@email.com"
              type="email"
              :loading="isLoading"
              :error="errors.email"
              required
              autocomplete="email"
              dir="ltr"
              class="text-left"
              size="lg"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <BaseInput
              v-model="loginForm.password"
              label="رمز عبور"
              placeholder="رمز عبور خود را وارد کنید"
              type="password"
              :loading="isLoading"
              :error="errors.password"
              required
              autocomplete="current-password"
              dir="ltr"
              class="text-left"
              size="lg"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <BaseCheckbox
              v-model="rememberMe"
              label="مرا به خاطر بسپار"
              :disabled="isLoading"
              color="primary"
            />
            <NuxtLink
              to="/hammasir/auth/forgot-password"
              class="text-primary-500 hover:text-primary-600 text-sm transition-colors font-medium"
            >
              فراموشی رمز عبور؟
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <Transition name="slide-fade">
            <div v-if="errorMessage" class="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <div class="flex items-center">
                <Icon name="ph:warning-circle" class="w-5 h-5 text-red-500 me-3 flex-shrink-0" />
                <div class="text-red-700 dark:text-red-300 text-sm font-medium">
                  {{ errorMessage }}
                </div>
              </div>
            </div>
          </Transition>

          <!-- Success Message -->
          <Transition name="slide-fade">
            <div v-if="successMessage" class="rounded-xl bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
              <div class="flex items-center">
                <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 me-3 flex-shrink-0" />
                <div class="text-green-700 dark:text-green-300 text-sm font-medium">
                  {{ successMessage }}
                </div>
              </div>
            </div>
          </Transition>

          <!-- Login Button -->
          <BaseButton
            type="submit"
            color="primary"
            class="w-full relative overflow-hidden group"
            :loading="isLoading"
            :disabled="!isFormValid"
            size="lg"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Icon name="ph:sign-in-duotone" class="me-2 size-4 relative z-10" />
            <span class="relative z-10">ورود به حساب کاربری</span>
          </BaseButton>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="border-muted-300 dark:border-muted-600 w-full border-t" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white dark:bg-muted-800 text-muted-600 dark:text-muted-400 px-4 font-medium">
                یا
              </span>
            </div>
          </div>

          <!-- Google Login -->
          <BaseButton
            type="button"
            color="default"
            variant="outline"
            class="w-full relative overflow-hidden group"
            :loading="isGoogleLoading"
            @click="handleGoogleLogin"
            size="lg"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Icon name="logos:google-icon" class="me-2 size-4 relative z-10" />
            <span class="relative z-10">ورود با گوگل</span>
          </BaseButton>
        </form>
      </div>

      <!-- Register Link -->
      <div class="text-center mt-8">
        <BaseParagraph class="text-muted-600 dark:text-muted-400">
          حساب کاربری ندارید؟
          <NuxtLink
            to="/hammasir/auth/register"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 ms-1 font-medium transition-colors hover:underline"
          >
            ثبت نام کنید
          </NuxtLink>
        </BaseParagraph>
      </div>

      <!-- Additional Links -->
      <div class="text-center mt-6 space-y-2">
        <div class="flex items-center justify-center space-x-4 space-x-reverse">
          <NuxtLink
            to="/hammasir"
            class="text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-500 text-sm transition-colors"
          >
            صفحه اصلی
          </NuxtLink>
          <span class="text-muted-400 dark:text-muted-500">•</span>
          <NuxtLink
            to="/support"
            class="text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-500 text-sm transition-colors"
          >
            پشتیبانی
          </NuxtLink>
          <span class="text-muted-400 dark:text-muted-500">•</span>
          <NuxtLink
            to="/privacy"
            class="text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-500 text-sm transition-colors"
          >
            حریم خصوصی
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transition animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Shimmer effect for buttons */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>