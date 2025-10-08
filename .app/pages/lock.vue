<script setup lang="ts">

definePageMeta({
  title: 'قفل صفحه',
  layout: 'blank', // Use a blank layout for lock screen
})

const { logout } = useUser()
const passkey = ref('')
const error = ref('')
const isLoggingOut = ref(false)
const isUnlocking = ref(false)

// Function to handle passkey input
function onPasskeyInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Only allow numeric input and limit to 4 digits
  if (/^\d*$/.test(value) && value.length <= 4) {
    passkey.value = value
    error.value = ''
  } else {
    // Remove non-numeric characters
    passkey.value = value.replace(/\D/g, '').substring(0, 4)
  }
  
  // Auto submit when 4 digits are entered
  if (passkey.value.length === 4) {
    attemptUnlock()
  }
}

// Function to attempt to unlock
async function attemptUnlock() {
  if (isUnlocking.value) return // Prevent multiple attempts
  
  isUnlocking.value = true
  error.value = ''
  
  try {
    // TODO: Implement actual unlock logic based on your authentication system
    // For now, we'll just show an error as an example
    // This is where you might make an API call to verify the passkey
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For now, we'll just show an error as an example
    error.value = 'کلمه عبور اشتباه است. لطفاً دوباره تلاش کنید.'
  } finally {
    isUnlocking.value = false
  }
}

// Function for unlock button click
function handleUnlock() {
  if (passkey.value.length !== 4) {
    error.value = 'لطفاً ۴ رقم را وارد کنید'
    return
  }
  attemptUnlock()
}

const isSupportLoading = ref(false)

// Function for support button
async function handleSupport() {
  isSupportLoading.value = true
  // TODO: Implement support functionality (e.g., open support modal, redirect to support page)
  // For now, we'll just show an alert after a small delay
  await new Promise(resolve => setTimeout(resolve, 300))
  alert('پشتیبانی')
  isSupportLoading.value = false
}

// Function for logout button
async function handleLogout() {
  isLoggingOut.value = true
  const result = await logout()
  isLoggingOut.value = false
  
  if (result) {
    // Redirect to login page after successful logout
    await navigateTo('/auth/login')
  } else {
    error.value = 'خطا در خروج از سیستم'
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-muted-100 p-4 dark:bg-muted-900">
    <div class="w-full max-w-md">
      <!-- Lock icon -->
      <div class="mb-8 flex justify-center">
        <div class="bg-primary-500/10 flex size-24 items-center justify-center rounded-full p-6">
          <Icon name="ph:lock-key-duotone" class="text-primary-500 size-12" />
        </div>
      </div>

      <!-- Card container -->
      <div class="bg-white dark:bg-muted-800 rounded-2xl p-8 shadow-lg">
        <!-- Title -->
        <div class="mb-8 text-center">
          <BaseHeading
            as="h2"
            size="lg"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            برای ادامه دسترسی، رمز را وارد کنید
          </BaseHeading>
        </div>

        <!-- Passkey input -->
        <div class="mb-6">
          <label for="passkey" class="mb-2 block text-sm font-medium text-muted-700 dark:text-muted-300 text-right">
            رمز چهار رقمی
          </label>
          
          <div class="relative">
            <input
              id="passkey"
              v-model="passkey"
              type="password"
              inputmode="numeric"
              maxlength="4"
              placeholder="••••"
              class="bg-muted-50 border-muted-300 text-muted-700 dark:text-white dark:bg-muted-700 dark:border-muted-600 dark:placeholder-muted-400 block w-full rounded-xl border px-4 py-3 text-center text-2xl focus:border-primary-500 focus:ring-primary-500"
              @input="onPasskeyInput"
            />
          </div>
          
          <!-- Error message -->
          <div v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">
            {{ error }}
          </div>
        </div>

        <!-- Progress dots for passkey -->
        <div class="mb-8 flex justify-center space-x-4">
          <div
            v-for="n in 4"
            :key="n"
            class="bg-muted-200 dark:bg-muted-700 size-4 rounded-full"
            :class="{
              'bg-primary-500': passkey.length >= n,
            }"
          />
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-3 gap-3">
          <BaseButton
            :disabled="passkey.length !== 4 || isUnlocking"
            color="primary"
            class="col-span-1"
            @click="handleUnlock"
          >
            <Icon v-if="!isUnlocking" name="ph:lock-open" class="me-2 size-5" />
            <Icon v-else name="eos-icons:loading" class="me-2 size-5 animate-spin" />
            <span>{{ isUnlocking ? 'در حال باز کردن...' : 'باز کردن' }}</span>
          </BaseButton>
          
          <BaseButton
            :disabled="isSupportLoading"
            color="info"
            variant="outline"
            class="col-span-1"
            @click="handleSupport"
          >
            <Icon v-if="!isSupportLoading" name="ph:chat-circle" class="me-2 size-5" />
            <Icon v-else name="eos-icons:loading" class="me-2 size-5 animate-spin" />
            <span>{{ isSupportLoading ? 'در حال بارگذاری...' : 'پشتیبانی' }}</span>
          </BaseButton>
          
          <BaseButton
            :disabled="isLoggingOut"
            color="muted"
            variant="outline"
            class="col-span-1"
            @click="handleLogout"
          >
            <Icon v-if="!isLoggingOut" name="ph:sign-out" class="me-2 size-5" />
            <Icon v-else name="eos-icons:loading" class="me-2 size-5 animate-spin" />
            <span>{{ isLoggingOut ? 'در حال خروج...' : 'خروج' }}</span>
          </BaseButton>
        </div>
      </div>
      
      <!-- Hint text -->
      <div class="mt-6 text-center text-sm text-muted-500 dark:text-muted-400">
        رمز خود را با دقت وارد کنید
      </div>
    </div>
  </div>
</template>