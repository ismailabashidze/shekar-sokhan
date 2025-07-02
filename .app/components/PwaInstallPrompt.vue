<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 right-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Icon name="mdi:download" class="w-5 h-5 text-white" />
          </div>
        </div>
        <div class="flex-1 min-w-0 pr-2">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
            نصب اپلیکیشن
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            برای دسترسی آسان‌تر، اپ رو روی دستگاهتون نصب کنید
          </p>
        </div>
      </div>
      
      <div class="mt-4 flex space-x-2 rtl:space-x-reverse">
        <button
          @click="installPwa"
          class="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
        >
          نصب
        </button>
        <button
          @click="dismissPrompt"
          class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 px-3 rounded-md transition-colors"
        >
          بعداً
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const showInstallPrompt = ref(false)
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

onMounted(() => {
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    
    // Show install prompt after a delay
    setTimeout(() => {
      if (!localStorage.getItem('pwa-install-dismissed')) {
        showInstallPrompt.value = true
      }
    }, 3000)
  })

  // Listen for app installation
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    localStorage.removeItem('pwa-install-dismissed')
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) return

  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully')
    }
    
    showInstallPrompt.value = false
    deferredPrompt.value = null
  } catch (error) {
    console.error('Error installing PWA:', error)
  }
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  
  // Show again after 7 days
  setTimeout(() => {
    localStorage.removeItem('pwa-install-dismissed')
  }, 7 * 24 * 60 * 60 * 1000)
}
</script> 