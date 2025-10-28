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
  <div class="dark:bg-muted-800 flex min-h-screen bg-white">
    <div class="bg-muted-100 dark:bg-muted-900 relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-2/5">
      <div class="mx-auto flex size-full max-w-2xl items-center justify-center p-12">
        <!-- Lock Icon -->
        <div class="text-center">
          <div
            class="bg-primary-100 dark:bg-primary-900 mx-auto mb-6 flex size-24 items-center justify-center rounded-full"
          >
            <Icon name="ph:lock-fill" class="text-primary-600 dark:text-primary-400 size-12" />
          </div>
          <h1 class="text-muted-800 dark:text-muted-200 mb-4 text-2xl font-bold">
            برنامه قفل شده است
          </h1>
          <p class="text-muted-500 dark:text-muted-400 mx-auto max-w-sm">
            برای دسترسی به برنامه، پین ۴ رقمی خود را وارد کنید
          </p>
        </div>
      </div>
    </div>

    <div class="relative flex flex-1 flex-col justify-center px-6 py-8 lg:w-3/5 lg:flex-none">
      <div class="dark:bg-muted-800 relative mx-auto w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <!-- User Info -->
        <div class="mb-6 text-center">
          <div v-if="user?.avatar" class="mx-auto mb-4">
            <img
              :src="`https://pocket.zehna.ir/api/files/users/${user.id}/${user.avatar}`"
              :alt="user.username || 'User'"
              class="mx-auto size-16 rounded-full object-cover"
            >
          </div>
          <div
            v-else
            class="bg-muted-200 dark:bg-muted-700 mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
          >
            <Icon name="ph:user" class="text-muted-500 size-8" />
          </div>
          <h2 class="text-muted-800 dark:text-muted-200 text-xl font-semibold">
            {{ user?.username || 'کاربر گرامی' }}
          </h2>
          <p class="text-muted-500 mt-1 text-sm">
            پین خود را برای باز کردن قفل وارد کنید
          </p>
        </div>

        <!-- PIN Input Form -->
        <form
          method="POST"
          action=""
          class="space-y-6"
          novalidate
          @submit.prevent="submitPin"
        >
          <!-- OTP Input Fields -->
          <div class="space-y-3">
            <label class="text-muted-700 dark:text-muted-300 text-sm font-medium">
              پین ۴ رقمی
            </label>
            <div class="flex justify-center gap-3" dir="ltr">
              <input
                v-for="n in 4"
                :key="n"
                :ref="el => setPinInputRef(el, n - 1)"
                v-model="pinDigits[n - 1]"
                type="tel"
                inputmode="numeric"
                maxlength="1"
                :autofocus="n === 1"
                autocomplete="one-time-code"
                pattern="[0-9]*"
                dir="ltr"
                class="border-muted-300 text-muted-800 focus:border-primary-500 focus:ring-primary-500/30 dark:border-muted-700 dark:bg-muted-900/50 dark:text-muted-200 size-14 rounded-lg border text-center text-2xl font-bold focus:outline-none focus:ring-2"
                @input="handlePinInput(n - 1, $event)"
                @keydown="handleKeyDown($event, n - 1)"
                @paste="handlePaste"
                @focus="handleFocus(n - 1)"
              >
            </div>
            <div v-if="pinError" class="text-danger-600 dark:text-danger-400 text-sm font-medium">
              {{ pinError }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <BaseButton
              :disabled="isVerifying"
              :loading="isVerifying"
              type="submit"
              color="primary"
              shape="curved"
              class="!h-12 w-full"
            >
              باز کردن قفل
              <Icon name="ph:lock-open" class="mr-2 size-4" />
            </BaseButton>

            <div class="grid grid-cols-2 gap-3">
              <BaseButton
                type="button"
                color="info"
                variant="outline"
                shape="curved"
                class="!h-12"
                @click="showSupportModal = true"
              >
                پشتیبانی
                <Icon name="ph:phone" class="mr-2 size-4" />
              </BaseButton>

              <BaseButton
                type="button"
                color="muted"
                variant="outline"
                shape="curved"
                class="!h-12"
                @click="logout"
              >
                خروج
                <Icon name="ph:sign-out" class="mr-2 size-4" />
              </BaseButton>
            </div>
          </div>
        </form>

        <!-- Support Info -->
        <div class="border-muted-200 dark:border-muted-700 mt-6 border-t pt-6">
          <div class="text-center">
            <p class="text-muted-500 mb-2 text-sm">
              در صورت فراموشی پین با پشتیبانی تماس بگیرید
            </p>
            <button
              class="text-primary-600 hover:text-primary-500 mx-auto flex items-center justify-center gap-2 text-sm font-medium"
              @click="showSupportModal = true"
            >
              <span dir="ltr">021 4421 4594</span>
              <Icon name="ph:phone" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Support Modal -->
  <TairoModal
    :open="showSupportModal"
    size="sm"
    @close="showSupportModal = false"
  >
    <template #header>
      <div class="flex items-center gap-4 p-4" dir="rtl">
        <div
          class="from-info-500 to-primary-500 flex size-14 items-center justify-center rounded-full bg-gradient-to-br"
        >
          <Icon name="ph:headset" class="size-6 text-white" />
        </div>
        <div class="flex-1 text-right">
          <h3 class="text-muted-800 dark:text-muted-200 text-lg font-semibold">
            تماس با پشتیبانی
          </h3>
          <p class="text-muted-500 mt-1 text-sm">
            تیم پشتیبانی ما برای کمک به شما در دسترس است
          </p>
        </div>
      </div>
    </template>

    <template>
      <div class="space-y-4 p-4 text-center" dir="rtl">
        <!-- Phone Number Display -->
        <div class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
          <div class="mb-3 flex justify-center">
            <Icon name="ph:phone-call" class="text-primary-600 dark:text-primary-400 size-12" />
          </div>
          <p class="text-muted-800 dark:text-muted-200 mb-2 text-base font-semibold">
            شماره تماس پشتیبانی
          </p>
          <p class="text-primary-600 dark:text-primary-400 mb-4 text-2xl font-bold" dir="ltr">
            021 4421 4594
          </p>
          <a
            href="tel:02144214594"
            class="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all"
          >
            <Icon name="ph:phone" class="size-4" />
            تماس مستقیم
          </a>
        </div>

        <!-- Working Hours -->
        <div class="bg-muted-100 dark:bg-muted-800/70 rounded-2xl p-5">
          <div class="mb-4 flex justify-center">
            <div class="dark:bg-muted-800 flex size-12 items-center justify-center rounded-full bg-white p-2 shadow-md">
              <Icon name="ph:clock" class="text-info-600 dark:text-info-400 size-6" />
            </div>
          </div>
          <p class="text-muted-800 dark:text-muted-200 mb-4 text-base font-semibold">
            ساعات کاری
          </p>
          <div class="space-y-3 text-sm">
            <div
              class="text-muted-700 dark:bg-muted-900 dark:text-muted-300 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
            >
              <span>شنبه تا چهارشنبه</span>
              <div class="flex items-center gap-2">
                <span>۹ الی ۱۷</span>
                <Icon name="ph:calendar-blank" class="text-info-500 size-4" />
              </div>
            </div>
            <div
              class="text-muted-700 dark:bg-muted-900 dark:text-muted-300 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
            >
              <span>پنج‌شنبه</span>
              <div class="flex items-center gap-2">
                <span>۹ الی ۱۳</span>
                <Icon name="ph:calendar-blank" class="text-info-500 size-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Support Options -->
        <div class="grid grid-cols-3 gap-3">
          <a
            href="tel:02144214594"
            class="border-muted-300 hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all"
          >
            <Icon name="ph:phone" class="text-muted-600 dark:text-muted-400 mb-2 size-6" />
            <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">تماس تلفنی</span>
            <span class="text-muted-500 text-xs" dir="ltr">021 4421 4594</span>
          </a>
          <a
            href="mailto:support@zehna.ir"
            class="border-muted-300 hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all"
          >
            <Icon name="ph:envelope" class="text-muted-600 dark:text-muted-400 mb-2 size-6" />
            <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">ایمیل</span>
            <span class="text-muted-500 text-xs">support@zehna.ir</span>
          </a>
          <a
            href="https://t.me/zehnasupport"
            class="border-muted-300 hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-800/50 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all"
          >
            <Icon name="ph:paper-plane-tilt" class="text-muted-600 dark:text-muted-400 mb-2 size-6" />
            <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">تلگرام</span>
            <span class="text-muted-500 text-xs">@zehnasupport</span>
          </a>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-row-reverse gap-3 p-4" dir="rtl">
        <BaseButton
          color="muted"
          variant="outline"
          class="flex-1"
          @click="showSupportModal = false"
        >
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
