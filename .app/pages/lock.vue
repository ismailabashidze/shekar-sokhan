<script setup lang="ts">

definePageMeta({
  layout: 'blank', // Use a blank layout for lock screen
  title: 'قفل برنامه',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const VALIDATION_TEXT = {
  PIN_LENGTH: 'پین باید ۴ رقمی باشد',
  PIN_INVALID: 'پین نامعتبر است',
}

const router = useRouter()
const toaster = useToaster()
const { unlockApp, isAppLocked } = useLockSystem()
const { user } = useUser()

const isVerifying = ref(false)
const showSupportModal = ref(false)

// OTP Input variables
const pinInputRefs = ref<HTMLInputElement[]>([])
const pinDigits = ref<string[]>(['', '', '', ''])
const pinError = ref('')

const lastFilledIndex = computed(() => {
  for (let i = pinDigits.value.length - 1; i >= 0; i--) {
    if (pinDigits.value[i] !== '') {
      return i
    }
  }
  return -1
})

const setPinInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    pinInputRefs.value[index] = el
  }
}

// Prevent navigation away from lock page while app is locked
// This is an additional safety guard
onBeforeRouteLeave((to, from) => {
  // Allow navigation to auth pages (for logout)
  if (to.path.startsWith('/auth')) {
    return true
  }

  // Block navigation if still locked
  if (isAppLocked.value) {
    console.log('🔒 [Lock Page] Navigation blocked - App is still locked')
    toaster.show({
      title: 'برنامه قفل است',
      message: 'برای دسترسی به برنامه، پین خود را وارد کنید یا خارج شوید',
      color: 'warning',
      icon: 'ph:lock',
      closable: true,
    })
    return false
  }

  return true
})

const sanitizeDigit = (value: string | undefined) => {
  if (!value) return ''

  // Convert Arabic-Indic digits (٠-٩) to English
  let sanitized = value.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
  // Convert Persian digits (۰-۹) to English
  sanitized = sanitized.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0))
  // Remove all non-digit characters
  sanitized = sanitized.replace(/\D/g, '')
  // Return only the last digit
  return sanitized.slice(-1)
}

const clearPinInputs = () => {
  pinDigits.value = ['', '', '', '']
  nextTick(() => {
    const firstInput = pinInputRefs.value[0]
    firstInput?.focus()
  })
}

const validatePinDigits = () => {
  if (pinDigits.value.some(digit => digit === '')) {
    pinError.value = VALIDATION_TEXT.PIN_LENGTH
    return null
  }

  if (!pinDigits.value.every(digit => /^\d$/.test(digit))) {
    pinError.value = VALIDATION_TEXT.PIN_INVALID
    return null
  }

  return pinDigits.value.join('')
}

const submitPin = async () => {
  if (isVerifying.value) return

  pinError.value = ''
  const pin = validatePinDigits()
  if (!pin) return

  isVerifying.value = true

  try {
    const unlocked = unlockApp(pin)

    if (unlocked) {
      toaster.show({
        title: 'موفقیت',
        message: 'برنامه با موفقیت باز شد',
        color: 'success',
        icon: 'ph:lock-open',
        closable: true,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 300)
    }
    else {
      pinError.value = 'پین صحیح نیست'
      clearPinInputs()
      toaster.show({
        title: 'پین نادرست',
        message: 'پین وارد شده صحیح نیست',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      })
    }
  }
  catch (error) {
    console.error('Unlock error:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در باز کردن قفل پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    isVerifying.value = false
  }
}

const logout = async () => {
  try {
    const { logout: logoutUser } = useUser()
    await logoutUser()

    toaster.show({
      title: 'خروج موفق',
      message: 'با موفقیت خارج شدید',
      color: 'success',
      icon: 'ph:sign-out',
      closable: true,
    })

    router.push('/auth/login')
  }
  catch (error) {
    console.error('Logout error:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در خروج پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
}

// Redirect if not locked - check on mount
onMounted(() => {
  if (!isAppLocked.value) {
    console.log('🔓 [Lock Page] Not locked - Redirecting to dashboard')
    router.replace('/dashboard')
    return
  }

  nextTick(() => {
    pinInputRefs.value[0]?.focus()
  })
})

// Methods for OTP input handling
const handlePinInput = (index: number, event?: Event) => {
  // Get the raw input value
  const rawValue = (event?.target as HTMLInputElement)?.value || pinDigits.value[index]

  // Sanitize and convert any Farsi/Arabic numerals to English
  const sanitized = sanitizeDigit(rawValue)

  // Update the model with sanitized value
  pinDigits.value[index] = sanitized

  // Also update the input element directly to ensure display is correct
  if (event?.target) {
    (event.target as HTMLInputElement).value = sanitized
  }

  if (pinError.value) {
    pinError.value = ''
  }

  if (sanitized && index < 3) {
    nextTick(() => {
      const nextInput = pinInputRefs.value[index + 1]
      nextInput?.focus()
    })
  }

  if (pinDigits.value.every(digit => digit !== '')) {
    submitPin()
  }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !pinDigits.value[index] && index > 0) {
    // Move to previous input on backspace if current is empty
    nextTick(() => {
      const prevInput = pinInputRefs.value[index - 1]
      prevInput?.focus()
    })
  }
  else if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      const prevInput = pinInputRefs.value[index - 1]
      prevInput?.focus()
    })
  }
  else if (event.key === 'ArrowRight' && index < 3) {
    nextTick(() => {
      const nextInput = pinInputRefs.value[index + 1]
      nextInput?.focus()
    })
  }
  else if (event.key.length === 1) {
    // Allow English digits (0-9), Arabic-Indic digits (٠-٩), and Persian digits (۰-۹)
    const isValidDigit = /[0-9٠-٩۰-۹]/.test(event.key)
    if (!isValidDigit) {
      event.preventDefault()
    }
  }
}

const handleFocus = (index: number) => {
  // Select all text when focusing on an input for easier replacement
  nextTick(() => {
    const target = pinInputRefs.value[index]
    target?.select()
  })
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text') ?? ''
  const numericPaste = paste.replace(/[^0-9\u0660-\u0669\u06F0-\u06F9]/g, '')

  if (!numericPaste) return

  const focusedIndex = pinInputRefs.value.findIndex(input => input === document.activeElement)
  const startIndex = focusedIndex >= 0 ? focusedIndex : 0

  for (let i = 0; i < Math.min(4 - startIndex, numericPaste.length); i++) {
    pinDigits.value[startIndex + i] = sanitizeDigit(numericPaste[i])
  }

  const nextFocusIndex = Math.min(startIndex + numericPaste.length, 3)
  nextTick(() => {
    const target = pinInputRefs.value[nextFocusIndex]
    target?.focus()
  })

  if (pinDigits.value.every(digit => digit !== '')) {
    submitPin()
  }
}

const getInputType = (index: number) => {
  if (!pinDigits.value[index]) {
    return 'text'
  }

  return index === lastFilledIndex.value ? 'text' : 'password'
}
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-muted-800">
    <div class="relative hidden w-0 flex-1 items-center justify-center bg-muted-100 dark:bg-muted-900 lg:flex lg:w-2/5">
      <div class="mx-auto flex size-full max-w-2xl items-center justify-center p-12">
        <!-- Lock Icon -->
        <div class="text-center">
          <div
            class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Icon name="ph:lock-fill" class="size-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="mb-4 text-2xl font-bold text-muted-800 dark:text-muted-200">
            برنامه قفل شده است
          </h1>
          <p class="mx-auto max-w-sm text-muted-500 dark:text-muted-400">
            برای دسترسی به برنامه، پین ۴ رقمی خود را وارد کنید
          </p>
        </div>
      </div>
    </div>

    <div class="relative flex flex-1 flex-col justify-center px-6 py-8 lg:w-3/5 lg:flex-none">
      <div class="relative mx-auto w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-muted-800">
        <!-- User Info -->
        <div class="mb-6 text-center">
          <div v-if="user?.avatar" class="mx-auto mb-4">
            <img :src="`https://pocket.zehna.ir/api/files/users/${user.id}/${user.avatar}`"
              :alt="user.username || 'User'" class="mx-auto size-16 rounded-full object-cover">
          </div>
          <div v-else
            class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted-200 dark:bg-muted-700">
            <Icon name="ph:user" class="size-8 text-muted-500" />
          </div>
          <h2 class="text-xl font-semibold text-muted-800 dark:text-muted-200">
            {{ user?.username || 'کاربر گرامی' }}
          </h2>
          <p class="mt-1 text-sm text-muted-500">
            پین خود را برای باز کردن قفل وارد کنید
          </p>
        </div>

        <!-- PIN Input Form -->
        <form method="POST" action="" class="space-y-6" novalidate @submit.prevent="submitPin">
          <!-- OTP Input Fields -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
              پین ۴ رقمی
            </label>
            <div class="flex justify-center gap-3" dir="ltr">
              <input v-for="n in 4" :key="n" :ref="el => setPinInputRef(el, n - 1)" v-model="pinDigits[n - 1]" type="tel"
                inputmode="numeric" maxlength="1" :autofocus="n === 1" autocomplete="one-time-code" pattern="[0-9]*"
                dir="ltr"
                class="h-14 w-14 rounded-lg border border-muted-300 text-center text-2xl font-bold text-muted-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-muted-700 dark:bg-muted-900/50 dark:text-muted-200"
                @input="handlePinInput(n - 1, $event)" @keydown="handleKeyDown($event, n - 1)" @paste="handlePaste"
                @focus="handleFocus(n - 1)" />
            </div>
            <div v-if="pinError" class="text-sm font-medium text-danger-600 dark:text-danger-400">
              {{ pinError }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <BaseButton :disabled="isVerifying" :loading="isVerifying" type="submit" color="primary" shape="curved"
              class="!h-12 w-full">
              باز کردن قفل
              <Icon name="ph:lock-open" class="mr-2 size-4" />
            </BaseButton>

            <div class="grid grid-cols-2 gap-3">
              <BaseButton type="button" color="info" variant="outline" shape="curved" class="!h-12"
                @click="showSupportModal = true">
                پشتیبانی
                <Icon name="ph:phone" class="mr-2 size-4" />
              </BaseButton>

              <BaseButton type="button" color="muted" variant="outline" shape="curved" class="!h-12" @click="logout">
                خروج
                <Icon name="ph:sign-out" class="mr-2 size-4" />
              </BaseButton>
            </div>
          </div>
        </form>

        <!-- Support Info -->
        <div class="mt-6 border-t border-muted-200 pt-6 dark:border-muted-700">
          <div class="text-center">
            <p class="mb-2 text-sm text-muted-500">
              در صورت فراموشی پین با پشتیبانی تماس بگیرید
            </p>
            <button
              class="mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-500"
              @click="showSupportModal = true">
              <span dir="ltr">021 4421 4594</span>
              <Icon name="ph:phone" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Support Modal -->
  <TairoModal :open="showSupportModal" size="sm" @close="showSupportModal = false">
    <template #header>
      <div class="flex items-center gap-4 p-4" dir="rtl">
        <div
          class="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-info-500 to-primary-500">
          <Icon name="ph:headset" class="size-6 text-white" />
        </div>
        <div class="flex-1 text-right">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-200">
            تماس با پشتیبانی
          </h3>
          <p class="mt-1 text-sm text-muted-500">
            تیم پشتیبانی ما برای کمک به شما در دسترس است
          </p>
        </div>
      </div>
    </template>

    <template>
      <div class="space-y-4 p-4 text-center" dir="rtl">
        <!-- Phone Number Display -->
        <div class="rounded-xl bg-primary-50 p-6 dark:bg-primary-900/20">
          <div class="mb-3 flex justify-center">
            <Icon name="ph:phone-call" class="size-12 text-primary-600 dark:text-primary-400" />
          </div>
          <p class="mb-2 text-base font-semibold text-muted-800 dark:text-muted-200">
            شماره تماس پشتیبانی
          </p>
          <p class="mb-4 text-2xl font-bold text-primary-600 dark:text-primary-400" dir="ltr">
            021 4421 4594
          </p>
          <a href="tel:02144214594"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700">
            <Icon name="ph:phone" class="size-4" />
            تماس مستقیم
          </a>
        </div>

        <!-- Working Hours -->
        <div class="rounded-2xl bg-muted-100 p-5 dark:bg-muted-800/70">
          <div class="mb-4 flex justify-center">
            <div class="flex size-12 items-center justify-center rounded-full bg-white p-2 shadow-md dark:bg-muted-800">
              <Icon name="ph:clock" class="size-6 text-info-600 dark:text-info-400" />
            </div>
          </div>
          <p class="mb-4 text-base font-semibold text-muted-800 dark:text-muted-200">
            ساعات کاری
          </p>
          <div class="space-y-3 text-sm">
            <div
              class="flex items-center justify-between rounded-lg bg-white p-3 text-muted-700 shadow-sm dark:bg-muted-900 dark:text-muted-300">
              <span>شنبه تا چهارشنبه</span>
              <div class="flex items-center gap-2">
                <span>۹ الی ۱۷</span>
                <Icon name="ph:calendar-blank" class="size-4 text-info-500" />
              </div>
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-white p-3 text-muted-700 shadow-sm dark:bg-muted-900 dark:text-muted-300">
              <span>پنج‌شنبه</span>
              <div class="flex items-center gap-2">
                <span>۹ الی ۱۳</span>
                <Icon name="ph:calendar-blank" class="size-4 text-info-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Support Options -->
        <div class="grid grid-cols-3 gap-3">
          <a href="tel:02144214594"
            class="flex flex-col items-center justify-center rounded-xl border border-muted-300 p-4 text-center transition-all hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50">
            <Icon name="ph:phone" class="mb-2 size-6 text-muted-600 dark:text-muted-400" />
            <span class="text-sm font-medium text-muted-700 dark:text-muted-300">تماس تلفنی</span>
            <span class="text-xs text-muted-500" dir="ltr">021 4421 4594</span>
          </a>
          <a href="mailto:support@zehna.ir"
            class="flex flex-col items-center justify-center rounded-xl border border-muted-300 p-4 text-center transition-all hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50">
            <Icon name="ph:envelope" class="mb-2 size-6 text-muted-600 dark:text-muted-400" />
            <span class="text-sm font-medium text-muted-700 dark:text-muted-300">ایمیل</span>
            <span class="text-xs text-muted-500">support@zehna.ir</span>
          </a>
          <a href="https://t.me/zehnasupport"
            class="flex flex-col items-center justify-center rounded-xl border border-muted-300 p-4 text-center transition-all hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50">
            <Icon name="ph:paper-plane-tilt" class="mb-2 size-6 text-muted-600 dark:text-muted-400" />
            <span class="text-sm font-medium text-muted-700 dark:text-muted-300">تلگرام</span>
            <span class="text-xs text-muted-500">@zehnasupport</span>
          </a>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-row-reverse gap-3 p-4" dir="rtl">
        <BaseButton color="muted" variant="outline" class="flex-1" @click="showSupportModal = false">
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
