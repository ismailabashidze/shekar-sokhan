<template>
  <div class="mx-auto w-full max-w-md">
    <form @submit.prevent="handleLogin">
      <TairoFormGroup 
        label="ورود به حساب کاربری" 
        sublabel="لطفاً اطلاعات خود را وارد کنید"
      >
        <div class="space-y-4">
          <!-- Email Input -->
          <BaseInput
            v-model="loginForm.email"
            label="ایمیل"
            placeholder="example@email.com"
            type="email"
            :loading="isLoading"
            :error="errors.email"
            required
            autocomplete="email"
            dir="ltr"
            class="text-left"
          />

          <!-- Password Input -->
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
          />

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <BaseCheckbox
              v-model="rememberMe"
              label="مرا به خاطر بسپار"
              :disabled="isLoading"
            />
            <NuxtLink
              to="/hammasir/auth/forgot-password"
              class="text-primary-500 hover:text-primary-600 text-sm transition-colors"
            >
              فراموشی رمز عبور؟
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="text-red-700 text-sm">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
            <div class="text-green-700 text-sm">
              {{ successMessage }}
            </div>
          </div>

          <!-- Login Button -->
          <BaseButton
            type="submit"
            color="primary"
            class="w-full"
            :loading="isLoading"
            :disabled="!isFormValid"
            size="md"
          >
            <Icon name="ph:sign-in-duotone" class="me-2 size-4" />
            ورود
          </BaseButton>

          <!-- Divider -->
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="border-muted-200 dark:border-muted-700 w-full border-t" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white dark:bg-muted-900 text-muted-500 px-4">
                یا
              </span>
            </div>
          </div>

          <!-- Google Login -->
          <BaseButton
            type="button"
            color="default"
            variant="outline"
            class="w-full"
            :loading="isGoogleLoading"
            @click="handleGoogleLogin"
          >
            <Icon name="logos:google-icon" class="me-2 size-4" />
            ورود با گوگل
          </BaseButton>

          <!-- Register Link -->
          <div class="text-center">
            <span class="text-muted-500 text-sm">حساب کاربری ندارید؟</span>
            <NuxtLink
              to="/hammasir/auth/register"
              class="text-primary-500 hover:text-primary-600 ms-1 text-sm transition-colors"
            >
              ثبت نام کنید
            </NuxtLink>
          </div>
        </div>
      </TairoFormGroup>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from '~/composables/hammasir-auth'

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
      }
    }

    successMessage.value = 'ورود موفقیت‌آمیز بود'
    
    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect as string || '/dashboard'
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
      localStorage.setItem('oauthRedirect', route.query.redirect as string || '/dashboard')
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
      // You might want to load saved email here
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