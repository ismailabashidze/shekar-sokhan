import { ref, computed, watch } from 'vue'

interface LockState {
  isLocked: boolean
  pin: string | null
  userId: string | null
  autoLockTimer: number | null // Timer in seconds (null = disabled)
}

const STORAGE_KEY = 'zehna_lock_state'

const lockState = ref<LockState>({
  isLocked: false,
  pin: null,
  userId: null,
  autoLockTimer: null,
})

const currentUserId = ref<string | null>(null)
let authListenerRegistered = false
let storageListenerRegistered = false

// Auto-lock timer state
const lastActivityTime = ref<number>(Date.now())
const remainingTime = ref<number>(0)
const isMonitoring = ref<boolean>(false)
let monitorInterval: NodeJS.Timeout | null = null

export const useLockSystem = () => {
  const nuxtApp = useNuxtApp()

  const refreshCurrentUserId = () => {
    const authStore = nuxtApp.$pb?.authStore

    if (authStore?.model?.id) {
      currentUserId.value = authStore.model.id
      return
    }

    if (process.client) {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          currentUserId.value = parsed?.id ?? null
          return
        }
      }
      catch {
        // Ignore malformed storage entries
      }
    }

    currentUserId.value = null
  }

  if (process.client) {
    refreshCurrentUserId()

    const authStore = nuxtApp.$pb?.authStore

    if (authStore && !authListenerRegistered) {
      authListenerRegistered = true
      authStore.onChange?.((_token, model) => {
        currentUserId.value = model?.id ?? null
      })
    }

    if (!storageListenerRegistered) {
      storageListenerRegistered = true
      window.addEventListener('storage', (event) => {
        if (event.key === 'pb_auth' || event.key === 'user') {
          refreshCurrentUserId()
        }
      })
    }
  }

  // Load lock state from localStorage on client side
  const loadLockState = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          lockState.value = JSON.parse(stored)
        }
      }
      catch (error) {
        console.warn('Failed to load lock state:', error)
      }
    }
  }

  // Save lock state to localStorage
  const saveLockState = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lockState.value))
      }
      catch (error) {
        console.warn('Failed to save lock state:', error)
      }
    }
  }

  // Initialize lock state
  loadLockState()

  // Watch for changes and save them
  watch(lockState, saveLockState, { deep: true })

  // Sync PIN from PocketBase server
  const syncPinFromServer = async (userId: string) => {
    if (!process.client) return

    try {
      const user = await nuxtApp.$pb.collection('users').getOne(userId)
      if (user.lockPin) {
        lockState.value = {
          isLocked: true, // Always lock when PIN exists
          pin: user.lockPin,
          userId,
          autoLockTimer: lockState.value.autoLockTimer, // Preserve timer setting
        }
        return true
      }
      return false
    }
    catch (error) {
      console.error('Failed to sync PIN from server:', error)
      return false
    }
  }

  // Save PIN to PocketBase server
  const setPinToServer = async (pin: string, userId: string) => {
    try {
      await nuxtApp.$pb.collection('users').update(userId, { lockPin: pin })
      return true
    }
    catch (error) {
      console.error('Failed to save PIN to server:', error)
      return false
    }
  }

  // Remove PIN from PocketBase server
  const removePinFromServer = async (userId: string) => {
    try {
      await nuxtApp.$pb.collection('users').update(userId, { lockPin: null })
      return true
    }
    catch (error) {
      console.error('Failed to remove PIN from server:', error)
      return false
    }
  }

  // Set a new PIN for the current user (both locally and server)
  const setPin = async (pin: string, userId: string) => {
    // Save to server first
    const success = await setPinToServer(pin, userId)
    if (success) {
      // Then update local state
      lockState.value = {
        isLocked: false, // Don't lock immediately after setup
        pin,
        userId,
        autoLockTimer: lockState.value.autoLockTimer, // Preserve timer setting
      }
      return true
    }
    return false
  }

  // Lock the application
  const lockApp = () => {
    if (lockState.value.pin) {
      lockState.value.isLocked = true
    }
  }

  // Unlock the application with PIN verification
  const unlockApp = (enteredPin: string): boolean => {
    if (enteredPin === lockState.value.pin) {
      lockState.value.isLocked = false
      return true
    }
    return false
  }

  // Check if app is locked for current user
  const isActiveUser = computed(() => {
    if (!lockState.value.userId) return false
    return lockState.value.userId === currentUserId.value
  })

  const isAppLocked = computed(() => {
    return lockState.value.isLocked
      && !!lockState.value.pin
      && isActiveUser.value
  })

  // Check if user has set up PIN
  const hasPin = computed(() => {
    return lockState.value.pin !== null
      && isActiveUser.value
  })

  // Remove PIN (disable lock system) - both locally and server
  const removePin = async (userId: string) => {
    // Remove from server first
    const success = await removePinFromServer(userId)
    if (success) {
      // Then clear local state
      lockState.value = {
        isLocked: false,
        pin: null,
        userId: null,
        autoLockTimer: null, // Clear timer when removing PIN
      }
      return true
    }
    return false
  }

  // Verify PIN without unlocking (for validation)
  const verifyPin = (enteredPin: string): boolean => {
    return enteredPin === lockState.value.pin
  }

  // Auto-lock timer functions

  // Set auto-lock timer duration (in seconds)
  const setAutoLockTimer = (seconds: number | null) => {
    lockState.value.autoLockTimer = seconds

    // Reset and restart monitoring if timer is set
    if (seconds && hasPin.value && !isAppLocked.value) {
      resetInactivityTimer()
      startInactivityMonitor()
    }
    else {
      stopInactivityMonitor()
    }
  }

  // Start monitoring user inactivity
  const startInactivityMonitor = () => {
    // Only start if conditions are met
    if (!lockState.value.autoLockTimer || isAppLocked.value || !hasPin.value) {
      return
    }

    // Stop existing monitor if any
    stopInactivityMonitor()

    isMonitoring.value = true
    lastActivityTime.value = Date.now()
    remainingTime.value = lockState.value.autoLockTimer

    // Check every second
    monitorInterval = setInterval(() => {
      if (!lockState.value.autoLockTimer) {
        stopInactivityMonitor()
        return
      }

      const elapsed = Math.floor((Date.now() - lastActivityTime.value) / 1000)
      const remaining = lockState.value.autoLockTimer - elapsed

      remainingTime.value = Math.max(0, remaining)

      // Auto-lock when timer expires
      if (remainingTime.value <= 0) {
        console.log('🔒 Auto-lock triggered - Inactivity timeout reached')
        lockApp()
        stopInactivityMonitor()
      }
    }, 1000)
  }

  // Stop monitoring
  const stopInactivityMonitor = () => {
    if (monitorInterval) {
      clearInterval(monitorInterval)
      monitorInterval = null
    }
    isMonitoring.value = false
    remainingTime.value = 0
  }

  // Reset inactivity timer on user activity
  const resetInactivityTimer = () => {
    lastActivityTime.value = Date.now()
    if (lockState.value.autoLockTimer) {
      remainingTime.value = lockState.value.autoLockTimer
    }
  }

  // Get progress percentage for visual ring
  const progressPercentage = computed(() => {
    if (!lockState.value.autoLockTimer) return 0
    return (remainingTime.value / lockState.value.autoLockTimer) * 100
  })

  // Get auto-lock timer value
  const autoLockTimer = computed(() => lockState.value.autoLockTimer)

  return {
    // State
    isAppLocked,
    hasPin,
    autoLockTimer,
    remainingTime,
    progressPercentage,
    isMonitoring,
    currentUserId,

    // Actions
    setPin,
    lockApp,
    unlockApp,
    removePin,
    verifyPin,

    // Server sync
    syncPinFromServer,
    setPinToServer,
    removePinFromServer,

    // Auto-lock timer
    setAutoLockTimer,
    startInactivityMonitor,
    stopInactivityMonitor,
    resetInactivityTimer,

    // Utilities
    loadLockState,
    saveLockState,
  }
}
