<template>
  <Transition name="slide-up">
    <div
      v-if="shouldShowPrompt"
      class="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
    >
      <BaseCard class="border border-muted-200 bg-white p-4 shadow-xl dark:border-muted-700 dark:bg-muted-900">
        <div class="flex items-start gap-3">
          <div class="shrink-0">
            <div class="bg-primary-500 flex size-10 items-center justify-center rounded-lg">
              <Icon name="ph:bell" class="size-5 text-white" />
            </div>
          </div>
          
          <div class="min-w-0 flex-1">
            <h3 class="text-muted-900 text-sm font-semibold dark:text-white">
              فعال‌سازی اعلان‌های فوری
            </h3>
            <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs leading-relaxed">
              برای دریافت اعلان‌های مهم حتی زمانی که مرورگر بسته است، اعلان‌های فوری را فعال کنید.
            </p>
            
            <!-- Error Message -->
            <p v-if="error" class="text-danger-600 dark:text-danger-400 mt-2 text-xs">
              {{ error }}
            </p>
          </div>
          
          <!-- Close button -->
          <button
            class="text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 shrink-0 transition-colors"
            @click="dismissPrompt"
          >
            <Icon name="ph:x" class="size-4" />
          </button>
        </div>

        <div class="mt-4 flex gap-2">
          <BaseButton
            v-if="permission !== 'denied'"
            size="sm"
            variant="solid"
            color="primary"
            :loading="isLoading"
            class="flex-1"
            @click="handleEnableNotifications"
          >
            <Icon name="ph:bell" class="ml-2 size-4" />
            فعال‌سازی
          </BaseButton>
          
          <BaseButton
            v-else
            size="sm"
            variant="outline"
            color="muted"
            class="flex-1"
            disabled
          >
            دسترسی رد شده
          </BaseButton>

          <BaseButton
            size="sm"
            variant="ghost"
            color="muted"
            @click="dismissPrompt"
          >
            بعداً
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const {
  isSupported,
  permission,
  isSubscribed,
  isLoading,
  error,
  requestPermission,
} = usePwaNotifications()

// State
const showPrompt = ref(false)
const isDismissed = ref(false)

// Show prompt conditions
const shouldShowPrompt = computed(() => {
  return showPrompt.value 
    && !isDismissed.value
    && isSupported.value 
    && permission.value !== 'granted' 
    && !isSubscribed.value
})

// Methods
const handleEnableNotifications = async () => {
  const success = await requestPermission()
  if (success) {
    showPrompt.value = false
    console.log('PWA notifications enabled by user')
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  isDismissed.value = true
  
  // Remember dismissal for this session
  sessionStorage.setItem('pwa-prompt-dismissed', 'true')
}

// Auto-show logic
onMounted(() => {
  // Don't show if user just logged in (wait for auto-request to finish first)
  const justLoggedIn = sessionStorage.getItem('just-logged-in')
  if (justLoggedIn) {
    // Wait longer if user just logged in to avoid overwhelming
    setTimeout(() => {
      sessionStorage.removeItem('just-logged-in')
    }, 10000)
    return
  }

  // Check if already dismissed this session
  const sessionDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
  if (sessionDismissed) {
    isDismissed.value = true
    return
  }

  // Check if we should show the prompt
  if (isSupported.value && permission.value === 'default') {
    // Show after a delay to not overwhelm the user
    setTimeout(() => {
      // Double check conditions before showing
      if (permission.value === 'default' && !isSubscribed.value) {
        showPrompt.value = true
      }
    }, 5000) // Show after 5 seconds to let user get oriented
  }
})

// Watch for permission changes to hide prompt
watch(permission, (newPermission) => {
  if (newPermission === 'granted') {
    showPrompt.value = false
  }
})

watch(isSubscribed, (newSubscribed) => {
  if (newSubscribed) {
    showPrompt.value = false
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style> 