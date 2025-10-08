<template>
  <div class="flex min-h-screen items-center justify-center bg-muted-50 p-4 dark:bg-muted-900/50">
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-2xl shadow-lg dark:bg-muted-800">
        <div class="text-center mb-8">
          <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <Icon name="ph:lock-duotone" class="text-primary-500 size-10" />
          </div>
          <h2 class="font-heading mt-4 text-xl font-semibold text-muted-900 dark:text-white">
            سیستم قفل شده است
          </h2>
          <p class="mt-2 text-muted-500 dark:text-muted-400">
            برای ادامه کار گذرواژه خود را وارد کنید
          </p>
        </div>

        <form @submit.prevent="verifyPasskey" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label for="passkey" class="mb-2 block text-sm font-medium text-muted-700 dark:text-white">
                گذرواژه ۴ رقمی
              </label>
              <div class="flex justify-center">
                <div class="grid grid-cols-4 gap-3 w-full max-w-xs">
                  <div v-for="index in 4" :key="index" class="relative">
                    <input
                      :id="`digit-${index}`"
                      ref="digitInputs"
                      v-model="passkeyDigits[index - 1]"
                      type="password"
                      inputmode="numeric"
                      maxlength="1"
                      class="border-muted-300 dark:border-muted-700 dark:bg-muted-900 dark:text-white h-14 w-full rounded-lg border text-center text-2xl focus:border-primary-500 focus:ring-primary-500"
                      @input="handleInput(index - 1)"
                      @keydown="handleKeydown($event, index - 1)"
                      @focus="handleFocus($event)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ error }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <BaseButton
              type="submit"
              color="primary"
              variant="solid"
              size="lg"
              class="w-full"
              :disabled="!isPasskeyComplete"
            >
              باز کردن قفل
            </BaseButton>
            
            <div class="flex gap-2">
              <BaseButton
                color="muted"
                variant="outline"
                size="md"
                class="flex-1"
                @click="handleNeedHelp"
              >
                نیاز به کمک دارم
              </BaseButton>
              
              <BaseButton
                color="primary"
                variant="outline"
                size="md"
                class="flex-1"
                @click="handleLogout"
              >
                خروج
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'قفل سیستم',
})

const passkeyDigits = ref<string[]>(Array(4).fill(''))
const error = ref('')
const digitInputs = ref<HTMLInputElement[]>([])

// Check if all digits are filled
const isPasskeyComplete = computed(() => {
  return passkeyDigits.value.every(digit => digit.length === 1 && /^\d$/.test(digit))
})

// Handle input for each digit
const handleInput = (index: number) => {
  const value = passkeyDigits.value[index]
  
  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    passkeyDigits.value[index] = value.slice(-1).replace(/\D/g, '')
  }
  
  // Move to next input if current is filled
  if (value && index < 3 && digitInputs.value[index + 1]) {
    digitInputs.value[index + 1].focus()
  }
  
  // Clear error when user starts typing
  if (error.value) {
    error.value = ''
  }
}

// Handle keyboard events for backspacing
const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !passkeyDigits.value[index] && index > 0) {
    // Move to previous input if current is empty
    digitInputs.value[index - 1].focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    digitInputs.value[index - 1].focus()
  } else if (event.key === 'ArrowRight' && index < 3) {
    digitInputs.value[index + 1].focus()
  }
}

// Handle focus to select content
const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  setTimeout(() => target.select(), 0)
}

// Verify the entered passkey
const verifyPasskey = () => {
  if (!process.client) return
  
  const enteredPasskey = passkeyDigits.value.join('')
  
  // Get the stored passkey from localStorage
  const storedPasskey = localStorage.getItem('passkey')
  
  if (storedPasskey) {
    // Decode the base64 encoded passkey
    const decodedPasskey = atob(storedPasskey)
    
    if (enteredPasskey === decodedPasskey) {
      // Set authentication flag
      localStorage.setItem('passkeyAuthenticated', 'true')
      localStorage.removeItem('manualLock') // Remove manual lock flag if present
      
      // Redirect back to dashboard
      navigateTo('/dashboard')
    } else {
      error.value = 'گذرواژه وارد شده اشتباه است، لطفاً دوباره تلاش کنید'
      
      // Clear the input fields
      passkeyDigits.value = Array(4).fill('')
      
      // Focus on the first input
      if (digitInputs.value[0]) {
        digitInputs.value[0].focus()
      }
    }
  } else {
    // If no passkey is set, redirect to dashboard
    navigateTo('/dashboard')
  }
}

// Handle need help button
const handleNeedHelp = () => {
  // This can be customized based on your needs
  alert('اگر گذرواژه خود را فراموش کرده‌اید، لطفاً با پشتیبانی تماس بگیرید')
}

// Handle logout button
const handleLogout = () => {
  if (!process.client) return
  
  // Clear authentication status
  localStorage.removeItem('passkeyAuthenticated')
  
  // Redirect to login page
  navigateTo('/auth/login')
}

// Focus on first input when component mounts
onMounted(() => {
  if (process.client) {
    if (digitInputs.value[0]) {
      digitInputs.value[0].focus()
    }
    
    // Clear any previous error on mount
    error.value = ''
  }
})
</script>