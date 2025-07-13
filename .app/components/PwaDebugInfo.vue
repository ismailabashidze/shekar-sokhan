<template>
  <div v-if="showDebug" class="fixed bottom-20 left-4 z-40 max-w-sm">
    <BaseCard class="border-muted-200 dark:border-muted-700 dark:bg-muted-900 border bg-white p-3 shadow-lg">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="text-muted-900 text-sm font-semibold dark:text-white">
          وضعیت PWA
        </h4>
        <button
          class="text-muted-400 hover:text-muted-600 dark:hover:text-muted-300"
          @click="showDebug = false"
        >
          <Icon name="ph:x" class="size-4" />
        </button>
      </div>

      <div class="space-y-2 text-xs">
        <!-- Service Worker Status -->
        <div class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">Service Worker:</span>
          <div class="flex items-center gap-1">
            <div
              :class="[
                'size-2 rounded-full',
                swStatus === 'active' ? 'bg-green-500' :
                swStatus === 'installing' ? 'bg-yellow-500' :
                swStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
              ]"
            />
            <span :class="getStatusColor(swStatus)">{{ getStatusText(swStatus) }}</span>
          </div>
        </div>

        <!-- PWA Support -->
        <div class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">PWA Support:</span>
          <span :class="isSupported ? 'text-green-600' : 'text-red-600'">
            {{ isSupported ? 'پشتیبانی می‌شود' : 'پشتیبانی نمی‌شود' }}
          </span>
        </div>

        <!-- Notification Permission -->
        <div class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">Notifications:</span>
          <span :class="getPermissionColor(notificationPermission)">
            {{ getPermissionText(notificationPermission) }}
          </span>
        </div>

        <!-- Is Standalone -->
        <div class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">Installed:</span>
          <span :class="isStandalone ? 'text-green-600' : 'text-gray-600'">
            {{ isStandalone ? 'نصب شده' : 'نصب نشده' }}
          </span>
        </div>

        <!-- Cache Status -->
        <div v-if="cacheInfo" class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">Cache:</span>
          <span class="text-blue-600">{{ cacheInfo.totalCaches }} cache, {{ cacheInfo.totalItems }} items</span>
        </div>

        <!-- App Version -->
        <div class="flex items-center justify-between">
          <span class="text-muted-600 dark:text-muted-400">App Version:</span>
          <span class="text-purple-600">v{{ appVersion }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-3 flex gap-2">
        <BaseButton
          size="xs"
          variant="outline"
          color="primary"
          @click="refreshServiceWorker"
        >
          Refresh SW
        </BaseButton>
        <BaseButton
          size="xs"
          variant="outline"
          color="warning"
          @click="clearCaches"
        >
          Clear Cache
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
// PWA Debug component for development
const showDebug = ref(false)
const swStatus = ref<'unknown' | 'installing' | 'active' | 'error'>('unknown')
const isSupported = ref(false)
const notificationPermission = ref<NotificationPermission>('default')
const isStandalone = ref(false)
const cacheInfo = ref<any>(null)

// دریافت ورژن app
const { version: appVersion } = useAppVersion()

// Check PWA status
const checkPWAStatus = async () => {
  if (!process.client) return

  // Check if PWA is supported
  isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window

  // Check notification permission
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission
  }

  // Check if app is installed (standalone mode)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches

  // Check service worker status
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        if (registration.active) {
          swStatus.value = 'active'
        }
        else if (registration.installing) {
          swStatus.value = 'installing'
        }
      }
    }
    catch (error) {
      swStatus.value = 'error'
      console.error('Error checking service worker:', error)
    }
  }

  // Get cache info
  if ('caches' in window) {
    try {
      const { getCacheStatus } = usePwaCache()
      cacheInfo.value = await getCacheStatus()
    }
    catch (error) {
      console.error('Error getting cache status:', error)
    }
  }
}

// Helper functions
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'installing': return 'در حال نصب'
    case 'error': return 'خطا'
    default: return 'نامشخص'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600'
    case 'installing': return 'text-yellow-600'
    case 'error': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getPermissionText = (permission: NotificationPermission) => {
  switch (permission) {
    case 'granted': return 'مجاز'
    case 'denied': return 'رد شده'
    default: return 'سوال نشده'
  }
}

const getPermissionColor = (permission: NotificationPermission) => {
  switch (permission) {
    case 'granted': return 'text-green-600'
    case 'denied': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

// Actions
const refreshServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        console.log('Service worker updated')
      }
    }
    catch (error) {
      console.error('Error updating service worker:', error)
    }
  }
  await checkPWAStatus()
}

const clearCaches = async () => {
  try {
    const { clearAllCaches } = usePwaCache()
    await clearAllCaches()
    console.log('All caches cleared')
  }
  catch (error) {
    console.error('Error clearing caches:', error)
  }
  await checkPWAStatus()
}

// Show debug panel on key combination (Ctrl+Shift+P)
onMounted(() => {
  // Only show in development
  if (process.env.NODE_ENV === 'development') {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        showDebug.value = !showDebug.value
        if (showDebug.value) {
          checkPWAStatus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })
  }
})

// Watch for changes
watch(showDebug, (isShown) => {
  if (isShown) {
    checkPWAStatus()
  }
})
</script>
