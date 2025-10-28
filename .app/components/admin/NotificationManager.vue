<template>
  <div class="notification-manager rounded-lg bg-white p-6 shadow-lg">
    <h3 class="mb-4 text-lg font-semibold">
      مدیریت اعلان‌ها
    </h3>

    <!-- Current Notifications -->
    <div class="mb-6">
      <h4 class="text-md mb-2 font-medium">
        اعلان‌های فعلی ({{ currentNotifications.length }})
      </h4>
      <div class="max-h-40 space-y-2 overflow-y-auto">
        <div
          v-for="notification in currentNotifications"
          :key="notification.tag"
          class="flex items-center justify-between rounded bg-gray-50 p-2"
        >
          <div class="flex-1">
            <div class="font-medium">
              {{ notification.title }}
            </div>
            <div class="text-sm text-gray-600">
              {{ notification.body }}
            </div>
            <div class="text-xs text-gray-400">
              Type: {{ notification.data?.type || 'unknown' }} |
              Priority: {{ notification.data?.priority || 'medium' }}
            </div>
          </div>
          <button
            class="ml-2 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
            @click="closeNotification(notification)"
          >
            بستن
          </button>
        </div>
      </div>

      <div class="mt-2 flex gap-2">
        <button
          class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          @click="refreshNotifications"
        >
          بروزرسانی
        </button>
        <button
          class="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          :disabled="currentNotifications.length === 0"
          @click="clearAllNotifications"
        >
          پاک کردن همه
        </button>
      </div>
    </div>

    <!-- Test Notifications -->
    <div class="mb-6">
      <h4 class="text-md mb-2 font-medium">
        تست اعلان‌ها
      </h4>
      <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
        <button
          class="rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600"
          @click="sendTestNotification('session', 'low')"
        >
          جلسه (کم اهمیت)
        </button>
        <button
          class="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
          @click="sendTestNotification('admin', 'medium')"
        >
          مدیریت (متوسط)
        </button>
        <button
          class="rounded bg-orange-500 px-3 py-2 text-sm text-white hover:bg-orange-600"
          @click="sendTestNotification('system', 'high')"
        >
          سیستم (مهم)
        </button>
        <button
          class="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
          @click="sendTestNotification('session', 'urgent')"
        >
          فوری
        </button>
        <button
          class="rounded bg-purple-500 px-3 py-2 text-sm text-white hover:bg-purple-600"
          @click="sendGroupedNotifications"
        >
          گروهی (3 عدد)
        </button>
      </div>
    </div>

    <!-- Notification Stats -->
    <div class="mb-6">
      <h4 class="text-md mb-2 font-medium">
        آمار اعلان‌ها
      </h4>
      <div class="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
        <div class="rounded bg-gray-50 p-2">
          <div class="text-lg font-bold">
            {{ stats.totalEvents }}
          </div>
          <div class="text-xs text-gray-600">
            کل رویدادها
          </div>
        </div>
        <div class="rounded bg-gray-50 p-2">
          <div class="text-lg font-bold">
            {{ stats.currentNotifications }}
          </div>
          <div class="text-xs text-gray-600">
            اعلان‌های فعلی
          </div>
        </div>
        <div class="rounded bg-gray-50 p-2">
          <div class="text-lg font-bold">
            {{ stats.eventsByType.clicked || 0 }}
          </div>
          <div class="text-xs text-gray-600">
            کلیک شده
          </div>
        </div>
        <div class="rounded bg-gray-50 p-2">
          <div class="text-lg font-bold">
            {{ stats.eventsByType.dismissed || 0 }}
          </div>
          <div class="text-xs text-gray-600">
            رد شده
          </div>
        </div>
      </div>

      <div class="mt-2 flex gap-2">
        <button
          class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          @click="refreshStats"
        >
          بروزرسانی آمار
        </button>
        <button
          class="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
          @click="syncEvents"
        >
          همگام‌سازی رویدادها
        </button>
      </div>
    </div>

    <!-- Recent Events -->
    <div>
      <h4 class="text-md mb-2 font-medium">
        رویدادهای اخیر
      </h4>
      <div class="max-h-32 space-y-1 overflow-y-auto text-sm">
        <div
          v-for="event in stats.recentEvents"
          :key="event.timestamp"
          class="flex justify-between rounded bg-gray-50 p-1 text-xs"
        >
          <span>{{ event.type }} - {{ event.action || 'N/A' }}</span>
          <span>{{ formatTime(event.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  getCurrentNotifications,
  clearAllNotifications: clearAll,
  clearNotificationsByType,
  getNotificationStats,
  syncNotificationEvents,
} = useServiceWorkerNotifications()

const currentNotifications = ref<Notification[]>([])
const stats = ref({
  totalEvents: 0,
  currentNotifications: 0,
  eventsByType: {} as Record<string, number>,
  eventsByAction: {} as Record<string, number>,
  recentEvents: [] as any[],
})

// Refresh current notifications
const refreshNotifications = async () => {
  try {
    currentNotifications.value = await getCurrentNotifications()
  }
  catch (error) {
    console.error('Error refreshing notifications:', error)
  }
}

// Clear all notifications
const clearAllNotifications = async () => {
  try {
    await clearAll()
    await refreshNotifications()
  }
  catch (error) {
    console.error('Error clearing notifications:', error)
  }
}

// Close specific notification
const closeNotification = (notification: Notification) => {
  notification.close()
  setTimeout(refreshNotifications, 100)
}

// Send test notification
const sendTestNotification = async (type: string, priority: string) => {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    alert('Notifications not supported')
    return
  }

  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert('Notification permission denied')
      return
    }
  }

  const testMessages = {
    session: 'جلسه درمانی شما تمام شد. چطور احساس می‌کنید؟',
    admin: 'پیام جدیدی از تیم پشتیبانی برای شما ارسال شده است.',
    system: 'سیستم به‌روزرسانی شده است. لطفاً برنامه را مجدداً راه‌اندازی کنید.',
  }

  const titles = {
    session: 'یادآوری جلسه',
    admin: 'پیام مدیریت',
    system: 'اعلان سیستم',
  }

  // Create test notification data
  const notificationData = {
    title: titles[type as keyof typeof titles],
    body: testMessages[type as keyof typeof testMessages],
    data: {
      type,
      priority,
      notificationId: `test-${Date.now()}`,
      actionUrl: type === 'session' ? '/sessions' : '/notifications',
      timestamp: Date.now(),
    },
  }

  // Send via service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      ...notificationData,
    })
  }
  else {
    // Fallback to direct notification
    new Notification(notificationData.title, {
      body: notificationData.body,
      icon: '/pwa-192x192.png',
      data: notificationData.data,
    })
  }

  setTimeout(refreshNotifications, 500)
}

// Send grouped notifications for testing
const sendGroupedNotifications = async () => {
  const campaignId = `test-campaign-${Date.now()}`

  for (let i = 1; i <= 3; i++) {
    await sendTestNotificationWithData({
      type: 'admin',
      priority: 'medium',
      campaignId,
      title: `پیام گروهی ${i}`,
      body: `این پیام شماره ${i} از کمپین تست است.`,
    })

    // Small delay between notifications
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  setTimeout(refreshNotifications, 1000)
}

// Send test notification with custom data
const sendTestNotificationWithData = async (data: any) => {
  if (Notification.permission !== 'granted') {
    await Notification.requestPermission()
  }

  new Notification(data.title, {
    body: data.body,
    icon: '/pwa-192x192.png',
    data: {
      ...data,
      notificationId: `test-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    },
  })
}

// Refresh stats
const refreshStats = async () => {
  try {
    stats.value = await getNotificationStats()
  }
  catch (error) {
    console.error('Error refreshing stats:', error)
  }
}

// Sync events with server
const syncEvents = async () => {
  try {
    const result = await syncNotificationEvents()
    alert(`همگام‌سازی انجام شد: ${result.synced} موفق، ${result.errors} خطا`)
    await refreshStats()
  }
  catch (error) {
    console.error('Error syncing events:', error)
    alert('خطا در همگام‌سازی')
  }
}

// Format timestamp
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('fa-IR')
}

// Initialize
onMounted(async () => {
  await refreshNotifications()
  await refreshStats()

  // Auto-refresh every 10 seconds
  setInterval(async () => {
    await refreshNotifications()
    await refreshStats()
  }, 10000)
})
</script>

<style scoped>
.notification-manager {
  direction: rtl;
  font-family: 'Vazir', sans-serif;
}
</style>
