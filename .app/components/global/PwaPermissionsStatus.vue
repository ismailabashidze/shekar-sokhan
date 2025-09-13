<script setup lang="ts">
interface PermissionStatus {
  granted: boolean
  text: string
  color: 'success' | 'warning' | 'danger'
  icon: string
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// PWA Installation Status
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
  return 'standalone' in window.navigator && (window.navigator as any).standalone
}

// PWA Installation Management
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstallingPwa = ref(false)

// Notification Permission Status
const getNotificationStatus = (): PermissionStatus => {
  if (typeof window === 'undefined') {
    return {
      granted: false,
      text: 'در حال بررسی...',
      color: 'warning',
      icon: 'ph:bell-slash',
    }
  }

  if (!('Notification' in window)) {
    return {
      granted: false,
      text: 'مرورگر شما از اعلانات پشتیبانی نمی‌کند',
      color: 'danger',
      icon: 'ph:bell-simple-slash',
    }
  }

  switch (Notification.permission) {
    case 'granted':
      return {
        granted: true,
        text: 'دسترسی اعلانات داده شده',
        color: 'success',
        icon: 'ph:bell',
      }
    case 'denied':
      return {
        granted: false,
        text: 'دسترسی اعلانات رد شده',
        color: 'danger',
        icon: 'ph:bell-slash',
      }
    default:
      return {
        granted: false,
        text: 'دسترسی اعلانات خواسته نشده',
        color: 'warning',
        icon: 'ph:bell-slash',
      }
  }
}

// Microphone Permission Status
const microphoneStatus = ref<PermissionStatus>({
  granted: false,
  text: 'در حال بررسی...',
  color: 'warning',
  icon: 'ph:microphone-slash',
})

const checkMicrophonePermission = async () => {
  if (typeof window === 'undefined' || !navigator.permissions) {
    microphoneStatus.value = {
      granted: false,
      text: 'بررسی دسترسی میکروفون امکان‌پذیر نیست',
      color: 'danger',
      icon: 'ph:microphone-slash',
    }
    return
  }

  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })

    switch (permission.state) {
      case 'granted':
        microphoneStatus.value = {
          granted: true,
          text: 'دسترسی میکروفون داده شده',
          color: 'success',
          icon: 'ph:microphone',
        }
        break
      case 'denied':
        microphoneStatus.value = {
          granted: false,
          text: 'دسترسی میکروفون رد شده',
          color: 'danger',
          icon: 'ph:microphone-slash',
        }
        break
      default:
        microphoneStatus.value = {
          granted: false,
          text: 'دسترسی میکروفون خواسته نشده',
          color: 'warning',
          icon: 'ph:microphone-slash',
        }
    }

    // Listen for permission changes
    permission.addEventListener('change', () => {
      checkMicrophonePermission()
    })
  }
  catch (error) {
    microphoneStatus.value = {
      granted: false,
      text: 'خطا در بررسی دسترسی میکروفون',
      color: 'danger',
      icon: 'ph:microphone-slash',
    }
  }
}

// Reactive states
const pwaInstalled = ref(false)
const notificationStatus = ref<PermissionStatus>({
  granted: false,
  text: 'در حال بررسی...',
  color: 'warning',
  icon: 'ph:bell-slash',
})

// PWA Status computed
const pwaStatus = computed((): PermissionStatus => {
  return {
    granted: pwaInstalled.value,
    text: pwaInstalled.value ? 'اپلیکیشن نصب شده' : 'اپلیکیشن نصب نشده',
    color: pwaInstalled.value ? 'success' : 'warning',
    icon: pwaInstalled.value ? 'ph:device-mobile' : 'ph:device-mobile-slash',
  }
})

// Check if PWA install is available
const canInstallPwa = computed(() => {
  return !pwaInstalled.value && deferredPrompt.value !== null
})

// Show install guidance even if prompt is not available
const showInstallGuidance = computed(() => {
  return !pwaInstalled.value && deferredPrompt.value === null
})

// Actions
const installPwa = async () => {
  if (!deferredPrompt.value) {
    return
  }

  isInstallingPwa.value = true

  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      // بررسی که آیا واقعاً نصب شده یا نه
      setTimeout(() => {
        if (isPwaInstalled()) {
          pwaInstalled.value = true
          localStorage.removeItem('pwa-install-dismissed')
        }
      }, 1000)
    }

    deferredPrompt.value = null
  }
  catch (error) {
    console.error('Error installing PWA:', error)
  }
  finally {
    isInstallingPwa.value = false
  }
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return

  try {
    const permission = await Notification.requestPermission()
    notificationStatus.value = getNotificationStatus()

    if (permission === 'granted') {
      // Show test notification
      new Notification('مجوز اعلان‌ها', {
        body: 'اعلان‌های فوری با موفقیت فعال شد!',
        icon: '/favicon.ico',
      })
    }
  }
  catch (error) {
    console.error('Error requesting notification permission:', error)
  }
}

const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Stop the stream immediately since we only want permission
    stream.getTracks().forEach(track => track.stop())

    // Recheck permission status
    await checkMicrophonePermission()
  }
  catch (error) {
    console.error('Error requesting microphone permission:', error)
    await checkMicrophonePermission()
  }
}

const showInstallInstructions = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  let instructions = ''

  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    instructions = `نصب در Chrome:
1. روی آیکون سه نقطه (⋮) در گوشه بالا سمت راست کلیک کنید
2. گزینه "Install app" یا "نصب اپلیکیشن" را انتخاب کنید
3. در پنجره باز شده روی "Install" کلیک کنید`
  }
  else if (userAgent.includes('firefox')) {
    instructions = `نصب در Firefox:
1. روی آیکون خانه (🏠) در نوار آدرس کلیک کنید
2. گزینه "Install this site as an app" را انتخاب کنید
3. نام اپلیکیشن را وارد کنید و "Install" را بزنید`
  }
  else if (userAgent.includes('edg')) {
    instructions = `نصب در Edge:
1. روی آیکون سه نقطه (⋯) کلیک کنید
2. گزینه "Apps" > "Install this site as an app" را انتخاب کنید
3. روی "Install" کلیک کنید`
  }
  else if (userAgent.includes('safari')) {
    instructions = `نصب در Safari (iOS):
1. روی آیکون Share (↗️) کلیک کنید
2. گزینه "Add to Home Screen" را انتخاب کنید
3. نام اپلیکیشن را تایید کنید و "Add" بزنید`
  }
  else {
    instructions = `راهنمای عمومی:
1. در منوی مرورگر دنبال گزینه "Install app" یا "Add to home screen" بگردید
2. یا از آیکون + در نوار آدرس استفاده کنید
3. در صورت عدم وجود، از مرورگر Chrome یا Edge استفاده کنید`
  }

  alert(`🚀 راهنمای نصب PWA\n\n${instructions}`)
}

// Check status on mount
onMounted(async () => {
  pwaInstalled.value = isPwaInstalled()
  notificationStatus.value = getNotificationStatus()
  await checkMicrophonePermission()

  // Listen for the beforeinstallprompt event
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      pwaInstalled.value = true
      deferredPrompt.value = null
      localStorage.removeItem('pwa-install-dismissed')
    })
  }

  // Periodic check for PWA installation status
  const checkPwaStatus = () => {
    const newStatus = isPwaInstalled()
    if (newStatus !== pwaInstalled.value) {
      pwaInstalled.value = newStatus
    }
  }

  const intervalId = setInterval(checkPwaStatus, 3000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <div class="space-y-4">
    <BaseHeading
      tag="h2"
      size="lg"
      weight="semibold"
      class="text-muted-900 dark:text-white"
    >
      وضعیت اپلیکیشن و مجوزها
    </BaseHeading>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- PWA Installation Status -->
      <BaseCard class="p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-lg shadow-sm"
            :class="[
              pwaStatus.color === 'success' ? 'from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30 bg-gradient-to-br' :
              'from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30 bg-gradient-to-br'
            ]"
          >
            <Icon
              :name="pwaStatus.icon"
              class="size-5"
              :class="
                pwaStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                'text-warning-600 dark:text-warning-400'
              "
            />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-muted-900 text-sm font-semibold dark:text-white">
              PWA
            </h3>
            <p
              class="mt-1 text-xs"
              :class="
                pwaStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                'text-warning-600 dark:text-warning-400'
              "
            >
              {{ pwaStatus.text }}
            </p>
            <!-- دکمه نصب خودکار PWA -->
            <BaseButton
              v-if="canInstallPwa"
              size="xs"
              variant="outline"
              color="primary"
              class="mt-3 px-3 py-1.5"
              :loading="isInstallingPwa"
              @click="installPwa"
            >
              <Icon name="ph:download" class="mr-1.5 size-3" />
              نصب اپلیکیشن
            </BaseButton>

            <!-- راهنمای نصب دستی -->
            <BaseButton
              v-else-if="showInstallGuidance"
              size="xs"
              variant="outline"
              color="info"
              class="mt-3 px-3 py-1.5"
              @click="showInstallInstructions"
            >
              <Icon name="ph:info" class="mr-1.5 size-3" />
              راهنمای نصب
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Notification Permission Status -->
      <BaseCard class="p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-lg shadow-sm"
            :class="[
              notificationStatus.color === 'success' ? 'from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30 bg-gradient-to-br' :
              notificationStatus.color === 'warning' ? 'from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30 bg-gradient-to-br' :
              'from-danger-100 to-danger-200 dark:from-danger-900/20 dark:to-danger-800/30 bg-gradient-to-br'
            ]"
          >
            <Icon
              :name="notificationStatus.icon"
              class="size-5"
              :class="
                notificationStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                notificationStatus.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                'text-danger-600 dark:text-danger-400'
              "
            />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-muted-900 text-sm font-semibold dark:text-white">
              اعلانات
            </h3>
            <p
              class="mt-1 text-xs"
              :class="
                notificationStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                notificationStatus.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                'text-danger-600 dark:text-danger-400'
              "
            >
              {{ notificationStatus.text }}
            </p>
            <BaseButton
              v-if="!notificationStatus.granted && notificationStatus.color !== 'danger'"
              size="xs"
              variant="outline"
              color="primary"
              class="mt-3 px-3 py-1.5"
              @click="requestNotificationPermission"
            >
              <Icon name="ph:bell" class="mr-1.5 size-3" />
              درخواست مجوز
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Microphone Permission Status -->
      <BaseCard class="p-4">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-lg shadow-sm"
            :class="[
              microphoneStatus.color === 'success' ? 'from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30 bg-gradient-to-br' :
              microphoneStatus.color === 'warning' ? 'from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30 bg-gradient-to-br' :
              'from-danger-100 to-danger-200 dark:from-danger-900/20 dark:to-danger-800/30 bg-gradient-to-br'
            ]"
          >
            <Icon
              :name="microphoneStatus.icon"
              class="size-5"
              :class="
                microphoneStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                microphoneStatus.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                'text-danger-600 dark:text-danger-400'
              "
            />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-muted-900 text-sm font-semibold dark:text-white">
              میکروفون
            </h3>
            <p
              class="mt-1 text-xs"
              :class="
                microphoneStatus.color === 'success' ? 'text-success-600 dark:text-success-400' :
                microphoneStatus.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                'text-danger-600 dark:text-danger-400'
              "
            >
              {{ microphoneStatus.text }}
            </p>
            <BaseButton
              v-if="!microphoneStatus.granted && microphoneStatus.color !== 'danger'"
              size="xs"
              variant="outline"
              color="primary"
              class="mt-3 px-3 py-1.5"
              @click="requestMicrophonePermission"
            >
              <Icon name="ph:microphone" class="mr-1.5 size-3" />
              درخواست مجوز
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Additional Info -->
    <BaseCard class="p-4">
      <div class="space-y-3">
        <h4 class="text-muted-900 text-sm font-medium dark:text-white">
          💡 اطلاعات مفید
        </h4>

        <div class="text-muted-500 dark:text-muted-400 space-y-2 text-xs leading-relaxed">
          <div class="flex items-start gap-2">
            <Icon name="ph:device-mobile" class="mt-0.5 size-3 shrink-0" />
            <span><strong>PWA:</strong> نصب اپلیکیشن روی دستگاه برای دسترسی سریع‌تر و تجربه بهتر</span>
          </div>

          <div class="flex items-start gap-2">
            <Icon name="ph:bell" class="mt-0.5 size-3 shrink-0" />
            <span><strong>اعلانات:</strong> دریافت اطلاع‌رسانی‌های مهم حتی زمانی که مرورگر بسته است</span>
          </div>

          <div class="flex items-start gap-2">
            <Icon name="ph:microphone" class="mt-0.5 size-3 shrink-0" />
            <span><strong>میکروفون:</strong> استفاده از قابلیت‌های صوتی مانند ضبط صدا و تماس صوتی</span>
          </div>
        </div>

        <div class="border-muted-200 dark:border-muted-700 mt-3 border-t pt-3">
          <p class="text-muted-500 dark:text-muted-400 text-xs">
            <strong>نکته امنیتی:</strong> تمام مجوزها در دستگاه شما محلی هستند و در هر زمان قابل تغییر از تنظیمات مرورگر می‌باشند.
          </p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
