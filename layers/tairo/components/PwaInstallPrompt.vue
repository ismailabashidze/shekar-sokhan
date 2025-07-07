<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 right-4 z-50">
    <div class="max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div class="flex items-start space-x-4 rtl:space-x-reverse">
        <div class="shrink-0">
          <div class="bg-primary-500 flex size-10 items-center justify-center rounded-lg">
            <Icon name="mdi:download" class="size-6 text-white" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            نصب اپلیکیشن
          </h3>
          <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            برای دسترسی آسان‌تر، اپ رو روی دستگاهتون نصب کنید
          </p>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          class="bg-primary-500 hover:bg-primary-600 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors"
          @click="installPwa"
        >
          <Icon name="mdi:download" class="size-4" />
          نصب
        </button>
        <button
          class="flex-1 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="dismissPrompt"
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
  if (process.client && window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  if (process.client) {
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
  }
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
  }
  catch (error) {
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
