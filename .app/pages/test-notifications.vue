<script setup lang="ts">
import { persianDateTimeToISO, isoToPersianDateTime, getRelativeTimeToAnnounce, formatPersianDate } from '~/utils/persian-date'
import PersianCalendar from '~/components/PersianCalendar.vue'

definePageMeta({
  title: 'تست اعلانات',
  layout: 'sidebar',
})
useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'تست اعلانات - پنل ادمین - ذهنا',
})

const { createNotification } = useNotifications()
const { $pb } = useNuxtApp()

// PWA notifications composable
const pwaNotifications = usePwaNotifications()

const isCreating = ref(false)
const testResults = ref<string[]>([])

// PWA test state
const pwaTestResults = ref<string[]>([])
const isPwaTestRunning = ref(false)

const getCurrentUserId = () => {
  return $pb.authStore.model?.id || 'test-user-id'
}

const createTestNotification = async (type: string, announceTime?: string) => {
  isCreating.value = true
  testResults.value = []
  
  try {
    const currentUserId = getCurrentUserId()
    
    const testNotifications = [
      {
        title: `تست اعلان ${type} - بدون زمان اعلان`,
        message: `این اعلان ${type} هیچ زمان اعلانی ندارد و باید فوراً نمایش داده شود`,
        type: 'info' as const,
        priority: 'medium' as const,
        recipient_user_id: currentUserId,
        user_id: currentUserId,
        user_name: 'تست کننده',
        user_role: 'admin',
        // announce_time: undefined (بدون زمان اعلان)
      },
      {
        title: `تست اعلان ${type} - زمان گذشته`,
        message: `این اعلان ${type} زمان گذشته دارد و باید فوراً نمایش داده شود`,
        type: 'success' as const,
        priority: 'high' as const,
        recipient_user_id: currentUserId,
        user_id: currentUserId,
        user_name: 'تست کننده',
        user_role: 'admin',
        announce_time: new Date(Date.now() - 60000).toISOString(), // 1 دقیقه پیش
      },
      {
        title: `تست اعلان ${type} - زمان آینده نزدیک`,
        message: `این اعلان ${type} زمان آینده نزدیک دارد و نباید الان نمایش داده شود`,
        type: 'warning' as const,
        priority: 'urgent' as const,
        recipient_user_id: currentUserId,
        user_id: currentUserId,
        user_name: 'تست کننده',
        user_role: 'admin',
        announce_time: new Date(Date.now() + 300000).toISOString(), // 5 دقیقه بعد
      },
      {
        title: `تست اعلان ${type} - زمان آینده دور`,
        message: `این اعلان ${type} زمان آینده دور دارد و نباید الان نمایش داده شود`,
        type: 'error' as const,
        priority: 'low' as const,
        recipient_user_id: currentUserId,
        user_id: currentUserId,
        user_name: 'تست کننده',
        user_role: 'admin',
        announce_time: new Date(Date.now() + 86400000).toISOString(), // 24 ساعت بعد
      },
      {
        title: `تست اعلان ${type} - زمان سفارشی`,
        message: `این اعلان ${type} زمان سفارشی دارد`,
        type: 'system' as const,
        priority: 'medium' as const,
        recipient_user_id: currentUserId,
        user_id: currentUserId,
        user_name: 'تست کننده',
        user_role: 'admin',
        announce_time: announceTime || new Date(Date.now() + 60000).toISOString(), // 1 دقیقه بعد یا زمان سفارشی
      }
    ]

    const results = []
    
    // Create notifications sequentially to avoid auto-cancellation
    for (let i = 0; i < testNotifications.length; i++) {
      const notification = testNotifications[i]
      try {
        const result = await createNotification(notification)
        const status = notification.announce_time 
          ? (new Date(notification.announce_time) <= new Date() ? 'نمایش داده شده' : 'زمان‌بندی شده')
          : 'نمایش داده شده'
        
        results.push(`✅ اعلان ${i + 1}: ${notification.title} - ${status}`)
        
        // Add small delay between requests to prevent auto-cancellation
        if (i < testNotifications.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (error) {
        results.push(`❌ اعلان ${i + 1}: خطا - ${error.message}`)
      }
    }

    testResults.value = results
    
  } catch (error) {
    testResults.value = [`❌ خطای کلی: ${error.message}`]
  } finally {
    isCreating.value = false
  }
}

// Test PWA notification system
const testPwaNotifications = async () => {
  isPwaTestRunning.value = true
  pwaTestResults.value = []
  
  try {
    const results = []
    
    // Test 1: Check PWA support
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    results.push(
      isSupported 
        ? '✅ PWA notifications are supported'
        : '❌ PWA notifications are not supported'
    )
    
    // Test 2: Check permission status (both reactive and native)
    const nativePermission = Notification.permission
    const reactivePermission = pwaNotifications.permission
    results.push(`🔒 Native Permission: ${nativePermission}`)
    results.push(`🔒 Reactive Permission: ${reactivePermission}`)
    
    // Test 3: Request permission if needed
    if (nativePermission !== 'granted') {
      results.push('⏳ Requesting notification permission...')
      const granted = await pwaNotifications.requestPermission()
      results.push(
        granted 
          ? '✅ Permission granted successfully'
          : '❌ Permission denied or failed'
      )
    } else {
      results.push('✅ Permission already granted')
    }
    
    // Test 4: Check service worker
    if (navigator.serviceWorker.controller) {
      results.push('✅ Service worker is active')
    } else {
      results.push('⚠️ Service worker not active - registering...')
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        results.push('✅ Service worker registered successfully')
      } catch (error) {
        results.push(`❌ Service worker registration failed: ${error.message}`)
      }
    }
    
    // Test 5: Test local notification
    if (Notification.permission === 'granted') {
      results.push('⏳ Testing local notification...')
      const success = await pwaNotifications.showLocalNotification({
        title: 'تست PWA نوتیفیکیشن',
        message: 'این یک تست PWA notification است',
        type: 'info',
        priority: 'medium',
        url: '/notifications',
        actionText: 'مشاهده'
      })
      results.push(
        success 
          ? '✅ Local notification shown successfully'
          : '❌ Failed to show local notification'
      )
    }
    
    // Test 6: Test push subscription
    if (Notification.permission === 'granted') {
      results.push('⏳ Testing push subscription...')
      const subscribed = await pwaNotifications.subscribeToPush()
      results.push(
        subscribed 
          ? '✅ Push subscription successful'
          : '❌ Push subscription failed'
      )
      
      if (subscribed) {
        results.push(`📱 Subscription status: ${pwaNotifications.isSubscribed ? 'Active' : 'Inactive'}`)
      }
    }
    
    pwaTestResults.value = results
    
  } catch (error) {
    pwaTestResults.value = [`❌ PWA test error: ${error.message}`]
  } finally {
    isPwaTestRunning.value = false
  }
}

// Test background notifications by simulating service worker push event
const testBackgroundNotifications = async () => {
  isPwaTestRunning.value = true
  pwaTestResults.value = []
  
  try {
    // Check permission from native API directly
    const currentPermission = Notification.permission
    
    if (currentPermission !== 'granted') {
      pwaTestResults.value = [`❌ PWA permission required for background notifications. Current: ${currentPermission}`]
      return
    }

    pwaTestResults.value = ['⏳ Ensuring service worker is ready...']

    // Ensure service worker is ready
    const registration = await ensureServiceWorkerReady()
    
    pwaTestResults.value = ['⏳ Testing background notifications...']

    // Create a test notification that simulates push event
    const testData = {
      title: 'تست Background Notification',
      message: 'این نوتیفیکیشن از طریق service worker push event ایجاد شده است',
      type: 'system',
      priority: 'high',
      url: '/notifications',
      action_text: 'مشاهده',
      id: `test-bg-${Date.now()}`
    }

    // Test showing notification directly through service worker
    await registration.showNotification(testData.title, {
      body: testData.message,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `bg-test-${Date.now()}`,
      data: {
        url: testData.url,
        notificationId: testData.id,
        type: testData.type,
        timestamp: Date.now()
      },
      actions: [{
        action: 'open',
        title: testData.action_text,
        icon: '/pwa-192x192.png'
      }],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      dir: 'rtl',
      lang: 'fa',
      renotify: true
    })

    pwaTestResults.value = [
      '✅ Background notification test completed',
      '✅ Service worker notification shown',
      '📱 This simulates how notifications work when app is closed',
      '💡 Close the app and create a new notification to test real background mode',
      `🔒 Permission Status: ${currentPermission}`,
      `📡 Service Worker: ${registration.active ? 'Active' : 'Inactive'}`,
      `🆔 Registration Scope: ${registration.scope}`
    ]
    
  } catch (error) {
    pwaTestResults.value = [`❌ Background notification test failed: ${error.message}`]
  } finally {
    isPwaTestRunning.value = false
  }
}

// Test both PWA and regular notifications
const testFullNotificationFlow = async () => {
  isCreating.value = true
  testResults.value = []
  
  try {
    const currentUserId = getCurrentUserId()
    
    // Create a test notification that should trigger PWA notification
    const testNotification = {
      title: 'تست کامل نوتیفیکیشن',
      message: 'این تست کامل عملکرد نوتیفیکیشن است که باید هم در سیستم ثبت شود و هم به صورت PWA notification نمایش داده شود',
      type: 'info' as const,
      priority: 'high' as const,
      recipient_user_id: currentUserId,
      user_id: currentUserId,
      user_name: 'تست کننده',
      user_role: 'admin',
      action_url: '/notifications',
      action_text: 'مشاهده در سیستم'
    }
    
    testResults.value = ['⏳ Creating test notification...']
    
    const result = await createNotification(testNotification)
    
    // Wait a moment for PWA notification to trigger
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    testResults.value = [
      '✅ Notification created successfully',
      '✅ PWA notification should be triggered automatically',
      '✅ Check your browser for the notification popup',
      '📋 You should see a native notification if permission is granted',
      '🔄 The notification should also appear in the notifications list'
    ]
    
  } catch (error) {
    testResults.value = [`❌ خطا در تست کامل: ${error.message}`]
  } finally {
    isCreating.value = false
  }
}

const clearTestResults = () => {
  testResults.value = []
  pwaTestResults.value = []
}

// Custom announce time with Persian calendar
const customPersianDate = ref('')
const customTime = ref('')
const customAnnounceTimeFormatted = computed(() => {
  if (!customPersianDate.value || !customTime.value) return ''
  return persianDateTimeToISO(customPersianDate.value, customTime.value)
})

onMounted(() => {
  // Set default custom time to 2 minutes from now
  const defaultTime = new Date(Date.now() + 120000) // 2 minutes from now
  const { persianDate, time } = isoToPersianDateTime(defaultTime.toISOString())
  customPersianDate.value = persianDate
  customTime.value = time
})

// Helper to ensure service worker is ready
const ensureServiceWorkerReady = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported')
  }

  // Check if already registered and active
  if (navigator.serviceWorker.controller) {
    return navigator.serviceWorker.ready
  }

  // Register service worker
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    
    // Wait for it to be active
    if (registration.active) {
      return registration
    }

    // Wait for registration to complete
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker registration timeout'))
      }, 10000)

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              clearTimeout(timeout)
              resolve(registration)
            }
          })
        }
      })

      // If already installing/waiting
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.installing?.state === 'activated') {
            clearTimeout(timeout)
            resolve(registration)
          }
        })
      } else if (registration.waiting) {
        clearTimeout(timeout)
        resolve(registration)
      }
    })
  } catch (error) {
    throw new Error(`Service worker registration failed: ${error.message}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-muted-50 dark:bg-muted-900">
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-muted-900 dark:text-white">
          تست عملکرد اعلانات
        </h1>
        <p class="text-muted-500 dark:text-muted-400 mt-2">
          آزمایش سناریوهای مختلف announce_time
        </p>
      </div>

      <div class="space-y-6">
        <!-- Test Buttons -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            آزمایش سناریوهای مختلف
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseButton
              :loading="isCreating"
              :disabled="isCreating"
              variant="solid"
              color="primary"
              @click="createTestNotification('استندارد')"
            >
              <Icon name="ph:test-tube" class="mr-2 size-4" />
              تست‌های استندارد
            </BaseButton>

            <BaseButton
              :loading="isCreating"
              :disabled="isCreating"
              variant="solid"
              color="success"
              @click="testFullNotificationFlow"
            >
              <Icon name="ph:bell" class="mr-2 size-4" />
              تست کامل نوتیفیکیشن
            </BaseButton>

            <BaseButton
              :loading="isCreating"
              :disabled="isCreating"
              variant="outline"
              color="danger"
              @click="clearTestResults"
            >
              <Icon name="ph:trash" class="mr-2 size-4" />
              پاک کردن نتایج
            </BaseButton>
          </div>
        </BaseCard>

        <!-- PWA Notifications Test -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            تست PWA نوتیفیکیشن
          </h2>
          
          <div class="space-y-4">
            <!-- Instructions -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
                📋 راهنمای استفاده
              </h3>
              <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>• ابتدا دکمه "تست PWA نوتیفیکیشن" را بزنید تا مجوز دریافت کنید</p>
                <p>• برای تست background، دکمه "تست Background" را بزنید</p>
                <p>• برای تست کامل، دکمه "تست کامل نوتیفیکیشن" را بزنید</p>
                <p>• برای تست واقعی background، اپ را ببندید و از بخش notifications یک اعلان جدید بسازید</p>
              </div>
            </div>

            <!-- Auto-cancellation Warning -->
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 class="font-medium text-amber-900 dark:text-amber-100 mb-2">
                ⚠️ نکته مهم در مورد خطای Auto-cancellation
              </h3>
              <div class="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <p>• اگر خطای "autocancelled" دیدید، نگران نباشید! این رفتار عادی PocketBase است</p>
                <p>• وقتی چندین درخواست همزمان ارسال می‌شود، درخواست‌های قبلی cancel می‌شوند</p>
                <p>• حالا تست‌ها sequential اجرا می‌شوند تا این مشکل نداشته باشیم</p>
                <p>• در استفاده واقعی معمولاً این مشکل پیش نمی‌آید</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BaseButton
                :loading="isPwaTestRunning"
                :disabled="isPwaTestRunning"
                variant="outline"
                color="primary"
                @click="testPwaNotifications"
              >
                <Icon name="ph:device-mobile" class="mr-2 size-4" />
                تست PWA نوتیفیکیشن
              </BaseButton>

              <BaseButton
                :loading="isPwaTestRunning"
                :disabled="isPwaTestRunning"
                variant="outline"
                color="warning"
                @click="testBackgroundNotifications"
              >
                <Icon name="ph:moon" class="mr-2 size-4" />
                تست Background
              </BaseButton>

              <BaseButton
                :loading="isPwaTestRunning"
                :disabled="isPwaTestRunning"
                variant="outline"
                color="muted"
                @click="() => { pwaTestResults = [] }"
              >
                <Icon name="ph:x" class="mr-2 size-4" />
                پاک کردن نتایج PWA
              </BaseButton>
            </div>

            <!-- PWA Status Info -->
            <div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span class="text-muted-600 dark:text-muted-400">PWA Support:</span>
                  <span :class="pwaNotifications.isSupported ? 'text-success-600' : 'text-danger-600'">
                    {{ pwaNotifications.isSupported ? 'Supported' : 'Not Supported' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-600 dark:text-muted-400">Permission:</span>
                  <span :class="{
                    'text-success-600': pwaNotifications.permission === 'granted',
                    'text-warning-600': pwaNotifications.permission === 'default',
                    'text-danger-600': pwaNotifications.permission === 'denied'
                  }">
                    {{ pwaNotifications.permission || 'Unknown' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-600 dark:text-muted-400">Push Subscription:</span>
                  <span :class="pwaNotifications.isSubscribed ? 'text-success-600' : 'text-muted-600'">
                    {{ pwaNotifications.isSubscribed ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Permission Help -->
            <div v-if="pwaNotifications.permission === 'denied'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 class="font-medium text-red-900 dark:text-red-100 mb-2">
                🚫 نوتیفیکیشن‌ها غیرفعال شده
              </h3>
              <div class="text-sm text-red-700 dark:text-red-300 space-y-1">
                <p>• در Chrome: Settings → Privacy and Security → Site Settings → Notifications</p>
                <p>• در Edge: Settings → Cookies and Site Permissions → Notifications</p>
                <p>• در Firefox: Settings → Privacy & Security → Permissions → Notifications</p>
                <p>• یا روی آیکون قفل در نوار آدرس کلیک کنید و Notifications را Allow کنید</p>
              </div>
            </div>

            <!-- PWA Test Results -->
            <div v-if="pwaTestResults.length > 0" class="space-y-2">
              <h3 class="font-medium text-muted-900 dark:text-white">نتایج تست PWA:</h3>
              <div
                v-for="(result, index) in pwaTestResults"
                :key="index"
                class="p-3 rounded-lg text-sm"
                :class="{
                  'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300': result.startsWith('✅'),
                  'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300': result.startsWith('❌'),
                  'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300': result.startsWith('⏳'),
                  'bg-info-50 dark:bg-info-900/20 text-info-700 dark:text-info-300': result.startsWith('🔒') || result.startsWith('📱')
                }"
              >
                {{ result }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Custom Time Test -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            تست با زمان سفارشی
          </h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Persian Calendar -->
              <PersianCalendar
                v-model="customPersianDate"
                label="تاریخ اعلان سفارشی"
                placeholder="انتخاب تاریخ"
                clearable
              />
              
              <!-- Time Picker -->
              <BaseInput
                v-model="customTime"
                type="time"
                label="ساعت اعلان"
                placeholder="00:00"
                :disabled="!customPersianDate"
              />
              
              <!-- Test Button -->
              <div class="flex items-end">
                <BaseButton
                  :loading="isCreating"
                  :disabled="isCreating || !customPersianDate || !customTime"
                  variant="outline"
                  color="primary"
                  class="w-full"
                  @click="createTestNotification('سفارشی', customAnnounceTimeFormatted)"
                >
                  <Icon name="ph:clock" class="mr-2 size-4" />
                  تست با زمان سفارشی
                </BaseButton>
              </div>
            </div>
            
            <!-- Schedule Info -->
            <div v-if="customPersianDate && customTime" class="bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800 rounded-lg border p-4">
              <div class="text-sm space-y-2">
                <div class="text-info-700 dark:text-info-300 font-medium">
                  📅 تاریخ: {{ formatPersianDate(customPersianDate) }}
                </div>
                <div class="text-info-600 dark:text-info-400">
                  🕐 ساعت: {{ customTime }}
                </div>
                <div class="text-info-600 dark:text-info-400">
                  🌐 ISO String: {{ customAnnounceTimeFormatted }}
                </div>
                <div class="text-info-700 dark:text-info-300 font-semibold">
                  ⏰ {{ getRelativeTimeToAnnounce(customAnnounceTimeFormatted) }}
                </div>
                <div class="text-info-500 dark:text-info-400 text-xs">
                  وضعیت: {{ new Date(customAnnounceTimeFormatted) <= new Date() ? 'زمان گذشته/حال - نمایش داده می‌شود' : 'زمان آینده - زمان‌بندی می‌شود' }}
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Test Results -->
        <BaseCard v-if="testResults.length > 0" class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            نتایج تست
          </h2>
          
          <div class="space-y-2">
            <div
              v-for="(result, index) in testResults"
              :key="index"
              class="p-3 rounded-lg"
              :class="result.startsWith('✅') ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300'"
            >
              {{ result }}
            </div>
          </div>
        </BaseCard>

        <!-- Current Status -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            وضعیت فعلی سیستم
          </h2>
          
          <div class="space-y-2 text-sm">
            <p class="text-muted-600 dark:text-muted-300">
              <strong>زمان فعلی:</strong> {{ new Date().toLocaleString('fa-IR') }}
            </p>
            <p class="text-muted-600 dark:text-muted-300">
              <strong>ISO String:</strong> {{ new Date().toISOString() }}
            </p>
            <p class="text-muted-600 dark:text-muted-300">
              <strong>کاربر فعلی:</strong> {{ getCurrentUserId() }}
            </p>
          </div>
        </BaseCard>

        <!-- Instructions -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-900 dark:text-white mb-4">
            راهنمای تست
          </h2>
          
          <div class="space-y-3 text-sm text-muted-600 dark:text-muted-300">
            <p>
              <strong>تست‌های استندارد:</strong> شامل 5 اعلان با سناریوهای مختلف:
            </p>
            <ul class="list-disc list-inside space-y-1 mr-4">
              <li>اعلان بدون زمان اعلان (باید فوراً نمایش داده شود)</li>
              <li>اعلان با زمان گذشته (باید فوراً نمایش داده شود)</li>
              <li>اعلان با زمان آینده نزدیک - 5 دقیقه (نباید نمایش داده شود)</li>
              <li>اعلان با زمان آینده دور - 24 ساعت (نباید نمایش داده شود)</li>
              <li>اعلان با زمان سفارشی</li>
            </ul>
            <p class="mt-4">
              <strong>نحوه تست:</strong> پس از ایجاد اعلانات، به صفحه اعلانات بروید تا نتیجه را ببینید.
            </p>
            <p>
              <strong>Debug:</strong> کنسول مرورگر را باز کنید تا لاگ‌های تفصیلی را ببینید.
            </p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template> 