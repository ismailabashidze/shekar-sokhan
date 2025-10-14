<script setup lang="ts">
const { 
  lockApp, 
  hasPin, 
  isAppLocked,
  autoLockTimer,
  remainingTime,
  progressPercentage,
} = useLockSystem()
const { user } = useUser()

const isLocking = ref(false)

const handleLock = async () => {
  if (!hasPin.value) {
    // Redirect to setup PIN if no PIN is set
    await navigateTo('/settings/lock-setup')
    return
  }

  isLocking.value = true

  try {
    // Lock the app
    lockApp()

    // Navigate to lock screen
    await navigateTo('/lock')
  }
  catch (error) {
    console.error('Lock error:', error)
  }
  finally {
    isLocking.value = false
  }
}

// Only show lock button if user has PIN set
const shouldShow = computed(() => {
  return user.value && hasPin.value && !isAppLocked.value
})

// Format time as mm:ss
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// SVG circle calculations
const radius = 20
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  if (!autoLockTimer.value) return 0
  const progress = progressPercentage.value / 100
  return circumference * (1 - progress)
})
</script>

<template>
  <div v-if="shouldShow" class="relative inline-block">
    <!-- Spinning progress ring (only if timer active) -->
    <svg 
      v-if="autoLockTimer && !isAppLocked" 
      class="absolute inset-0 -rotate-90 size-12"
      viewBox="0 0 48 48"
    >
      <!-- Background circle -->
      <circle
        cx="24"
        cy="24"
        :r="radius"
        stroke="rgba(245, 158, 11, 0.2)"
        stroke-width="3"
        fill="none"
      />
      <!-- Progress circle -->
      <circle
        cx="24"
        cy="24"
        :r="radius"
        stroke="rgb(245, 158, 11)"
        stroke-width="3"
        fill="none"
        class="progress-ring transition-all duration-1000 ease-linear"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
      />
    </svg>
    
    <!-- Lock button (existing design) -->
    <button
      :disabled="isLocking"
      class="relative z-10 bg-warning-500 hover:bg-warning-600 flex size-12 flex-col items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
      :title="isLocking ? 'در حال قفل کردن...' : 'قفل کردن برنامه'"
      @click="handleLock"
    >
      <Icon
        v-if="!isLocking"
        name="ph:lock"
        :class="autoLockTimer ? 'size-5' : 'size-6'"
      />
      <Icon
        v-else
        name="line-md:loading-twotone-loop"
        class="size-6"
      />
      
      <!-- Countdown timer text (only if timer active) -->
      <span 
        v-if="autoLockTimer && remainingTime > 0" 
        class="absolute bottom-0.5 text-[9px] font-medium leading-none"
      >
        {{ formatTime(remainingTime) }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.progress-ring {
  filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.6));
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.9));
  }
}
</style>
