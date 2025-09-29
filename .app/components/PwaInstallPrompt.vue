<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 right-4 z-50">
    <div class="max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div class="flex items-start space-x-3">
        <div class="shrink-0">
          <div class="bg-primary-500 flex size-8 items-center justify-center rounded-lg">
            <Icon name="mdi:download" class="size-5 text-white" />
          </div>
        </div>
        <div class="min-w-0 flex-1 pr-2">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
            نصب اپلیکیشن
          </h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            برای دسترسی آسان‌تر، اپ رو روی دستگاهتون نصب کنید
          </p>
        </div>
      </div>

      <div class="mt-4 flex space-x-2 rtl:space-x-reverse">
        <button
          class="bg-primary-500 hover:bg-primary-600 flex-1 rounded-md px-3 py-2 text-xs font-medium text-white transition-colors"
          @click="installPwa"
        >
          نصب
        </button>
        <button
          class="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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

// بررسی جامع برای تشخیص نصب PWA
const isPwaInstalled = (): boolean => {
  if (typeof window === 'undefined') return false

  // بررسی standalone mode (اصلی‌ترین روش)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  // بررسی navigator.standalone برای iOS Safari
  if ((navigator as any).standalone === true) {
    return true
  }

  // بررسی window.navigator.standalone برای iOS
  if ('standalone' in window.navigator && (window.navigator as any).standalone) {
    return true
  }

  // بررسی referrer برای installed PWA
  if (document.referrer.includes('android-app://')) {
    return true
  }

  // بررسی sessionStorage فقط اگر قبلاً به صورت دستی set شده باشد
  try {
    const manualFlag = sessionStorage.getItem('isPWA-manual')
    if (manualFlag === 'true') {
      return true
    }
  }
  catch (e) {
    // sessionStorage may not be available
  }

  // بررسی localStorage برای نصب دستی
  try {
    const manualInstall = localStorage.getItem('pwa-manually-installed')
    if (manualInstall === 'true') {
      return true
    }
  }
  catch (e) {
    // localStorage may not be available
  }

  return false
}

// دریافت prompt از global state
const getGlobalPrompt = (): BeforeInstallPromptEvent | null => {
  if (typeof window !== 'undefined' && window._pwaInstallPrompt) {
    return window._pwaInstallPrompt as BeforeInstallPromptEvent
  }
  return null
}

onMounted(() => {
  // اگر PWA قبلاً نصب شده باشد، پرامپت رو نشون نده
  if (isPwaInstalled()) {
    showInstallPrompt.value = false
    return
  }

  // بررسی اولیه برای global prompt
  const globalPrompt = getGlobalPrompt()
  if (globalPrompt) {
    deferredPrompt.value = globalPrompt
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
  })

  // Listen for app installation
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    localStorage.removeItem('pwa-install-dismissed')
    // Set sessionStorage flag for manual detection
    try {
      sessionStorage.setItem('isPWA-manual', 'true')
      localStorage.setItem('pwa-manually-installed', 'true')
    }
    catch (e) {
      // ignore
    }
  })

  // نمایش پرامپت بعد از delay (اگر شرایط مناسب باشد)
  setTimeout(() => {
    if (!isPwaInstalled() && !localStorage.getItem('pwa-install-dismissed') && (getGlobalPrompt() || deferredPrompt.value || isPwaSupported())) {
      showInstallPrompt.value = true
    }
  }, 3000)

  // بررسی دوره‌ای برای تشخیص تغییرات وضعیت نصب
  const checkInstallStatus = () => {
    if (isPwaInstalled() && showInstallPrompt.value) {
      showInstallPrompt.value = false
    }

    // بررسی برای prompt جدید
    const globalPrompt = getGlobalPrompt()
    if (globalPrompt && !deferredPrompt.value) {
      deferredPrompt.value = globalPrompt
    }
  }

  // بررسی هر 3 ثانیه (کمتر از قبل برای واکنش سریع‌تر)
  const intervalId = setInterval(checkInstallStatus, 3000)

  // پاک کردن interval هنگام unmount
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})

// بررسی پشتیبانی PWA
const isPwaSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

// راهنمایی نصب دستی
const showManualInstallGuidance = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  let instructions = ''

  if (userAgent.includes('chrome') || userAgent.includes('chromium')) {
    instructions = `در Chrome:
1. روی آیکون نصب (⬇️) در نوار آدرس کلیک کنید
2. یا از منوی سه نقطه، گزینه "Install app" را انتخاب کنید`
  }
  else if (userAgent.includes('firefox')) {
    instructions = `در Firefox:
1. از منوی hamburger، گزینه "Install this site as an app" را انتخاب کنید`
  }
  else if (userAgent.includes('edge')) {
    instructions = `در Edge:
1. روی آیکون نصب در نوار آدرس کلیک کنید
2. یا از منوی سه نقطه، گزینه "Apps" > "Install this site as an app" را انتخاب کنید`
  }
  else if (userAgent.includes('safari')) {
    instructions = `در Safari (iOS):
1. روی آیکون Share (📤) کلیک کنید
2. گزینه "Add to Home Screen" را انتخاب کنید`
  }
  else {
    instructions = `راهنمای عمومی:
1. در منوی مرورگر دنبال گزینه "Install app" یا "Add to home screen" بگردید
2. یا از آیکون + در نوار آدرس استفاده کنید
3. در صورت عدم وجود، از مرورگر Chrome یا Edge استفاده کنید`
  }

  alert(`🚀 راهنمای نصب PWA\n\n${instructions}`)
}

const installPwa = async () => {
  // بررسی برای prompt جدید از global state
  if (!deferredPrompt.value) {
    const globalPrompt = getGlobalPrompt()
    if (globalPrompt) {
      deferredPrompt.value = globalPrompt
    }
  }

  if (!deferredPrompt.value) {
    showManualInstallGuidance()
    return
  }

  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      // بررسی که آیا واقعاً نصب شده یا نه
      setTimeout(() => {
        if (isPwaInstalled()) {
          showInstallPrompt.value = false
          localStorage.removeItem('pwa-install-dismissed')
          try {
            sessionStorage.setItem('isPWA-manual', 'true')
            localStorage.setItem('pwa-manually-installed', 'true')
          }
          catch (e) {
            // ignore
          }
        }
      }, 1000)
    }
    else {
    }

    showInstallPrompt.value = false
    deferredPrompt.value = null
  }
  catch (error) {
    // Fallback to manual guidance
    showManualInstallGuidance()
  }
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())

  // نمایش مجدد بعد از 7 روز (فقط اگر PWA نصب نشده باشد)
  setTimeout(() => {
    if (!isPwaInstalled()) {
      localStorage.removeItem('pwa-install-dismissed')
    }
  }, 7 * 24 * 60 * 60 * 1000)
}
</script>
