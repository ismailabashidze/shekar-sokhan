<script setup lang="ts">
import type { PasswordResetRequest } from '~/composables/hammasir-auth'

// Page metadata
definePageMeta({
  title: 'بازیابی رمز عبور',
  layout: 'empty',
  auth: false
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'بازیابی رمز عبور - همسیر'
})

// Composables
const { requestPasswordReset } = useAuth()
const router = useRouter()

// Reactive state
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const emailSent = ref(false)

// Form data
const resetForm = reactive<PasswordResetRequest>({
  email: ''
})

// Form validation
const errors = reactive({
  email: ''
})

// Computed properties
const isFormValid = computed(() => {
  return resetForm.email.length > 0 && isValidEmail(resetForm.email)
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
}

function validateForm(): boolean {
  clearMessages()
  let isValid = true

  if (!resetForm.email) {
    errors.email = 'ایمیل الزامی است'
    isValid = false
  } else if (!isValidEmail(resetForm.email)) {
    errors.email = 'فرمت ایمیل معتبر نیست'
    isValid = false
  }

  return isValid
}

// Event handlers
async function handlePasswordReset() {
  if (!validateForm()) return

  isLoading.value = true
  clearMessages()

  try {
    await requestPasswordReset(resetForm)
    
    emailSent.value = true
    successMessage.value = 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد'

  } catch (error: any) {
    console.error('Password reset error:', error)
    
    if (error.status === 404) {
      errorMessage.value = 'این ایمیل در سیستم ثبت نشده است'
    } else if (error.status === 400) {
      errorMessage.value = 'درخواست معتبر نیست'
    } else {
      errorMessage.value = 'خطایی رخ داده است. لطفاً دوباره تلاش کنید'
    }
  } finally {
    isLoading.value = false
  }
}

// Watch form changes to clear errors
watch(() => resetForm.email, () => {
  if (errors.email && isValidEmail(resetForm.email)) {
    errors.email = ''
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

    <!-- Main recovery container -->
    <div class="relative w-full max-w-md">
      <!-- Logo and header -->
      <div class="text-center mb-8">
        <div class="relative flex justify-center items-center mb-6">
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
            بازیابی رمز عبور
          </span>
        </BaseHeading>
        
        <BaseParagraph class="text-muted-600 dark:text-muted-400 font-medium">
          ایمیل خود را وارد کنید تا لینک بازیابی را دریافت کنید
        </BaseParagraph>
      </div>

      <!-- Recovery form card -->
      <div class="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-muted-800/95 backdrop-blur-xl p-8 shadow-2xl border border-white/40 dark:border-muted-700/40">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-purple-100/30 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-primary-100/30 dark:from-pink-900/20 dark:to-primary-900/20 rounded-full blur-xl"></div>

        <div v-if="!emailSent">
          <form @submit.prevent="handlePasswordReset" class="relative space-y-6">
            <!-- Email Input -->
            <div class="space-y-2">
              <BaseInput
                v-model="resetForm.email"
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

            <!-- Reset Button -->
            <BaseButton
              type="submit"
              color="primary"
              class="w-full relative overflow-hidden group"
              :loading="isLoading"
              :disabled="!isFormValid"
              size="lg"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Icon name="ph:paper-plane-duotone" class="me-2 size-4 relative z-10" />
              <span class="relative z-10">ارسال لینک بازیابی</span>
            </BaseButton>
          </form>
        </div>

        <!-- Success message -->
        <div v-else class="relative text-center space-y-6">
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Icon name="ph:check-circle" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div>
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
              ایمیل ارسال شد!
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-400">
              لینک بازیابی رمز عبور به ایمیل شما ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.
            </BaseParagraph>
          </div>

          <BaseButton
            @click="emailSent = false"
            variant="outline"
            class="w-full"
          >
            <Icon name="ph:arrow-left" class="me-2 size-4" />
            ارسال مجدد
          </BaseButton>
        </div>
      </div>

      <!-- Back to login -->
      <div class="text-center mt-8">
        <BaseParagraph class="text-muted-600 dark:text-muted-400">
          رمز عبور خود را به یاد آوردید؟
          <NuxtLink
            to="/hammasir/auth/login"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 ms-1 font-medium transition-colors hover:underline"
          >
            بازگشت به ورود
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>