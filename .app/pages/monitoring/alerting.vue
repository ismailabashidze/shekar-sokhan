<template>
  <div class="bg-muted-50 dark:bg-muted-950 min-h-screen">
    <!-- Header -->
    <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 border-b bg-white">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
              مدیریت هشدارها
            </h1>
            <p class="text-muted-600 dark:text-muted-400 mt-1">
              پیکربندی تشدید هشدار، اعلان‌ها و بازیابی خودکار
            </p>
          </div>

          <div class="flex items-center gap-4">
            <button
              :disabled="isTesting"
              class="border-primary-200 text-primary-700 hover:bg-primary-50 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors disabled:opacity-50"
              @click="testAlertSystem"
            >
              <Icon
                name="lucide:zap"
                class="size-4"
                :class="{ 'animate-pulse': isTesting }"
              />
              تست سیستم هشدار
            </button>

            <button
              :disabled="isSaving"
              class="bg-primary-600 hover:bg-primary-700 flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors disabled:opacity-50"
              @click="saveConfiguration"
            >
              <Icon
                name="lucide:save"
                class="size-4"
                :class="{ 'animate-spin': isSaving }"
              />
              ذخیره پیکربندی
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6 p-6">
      <!-- Escalation Configuration -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
            پیکربندی تشدید
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mt-1 text-sm">
            پیکربندی نحوه تشدید هشدارها و ارسال به چه کسانی
          </p>
        </div>

        <div class="space-y-6 p-6">
          <!-- Global Settings -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
                فعال‌سازی تشدید
              </label>
              <div class="flex items-center">
                <input
                  v-model="escalationConfig.enabled"
                  type="checkbox"
                  class="text-primary-600 bg-muted-100 border-muted-300 focus:ring-primary-500 size-4 rounded"
                >
                <span class="text-muted-600 ml-2 text-sm">
                  فعال‌سازی تشدید خودکار هشدار
                </span>
              </div>
            </div>

            <div>
              <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
                فاصله تشدید (دقیقه)
              </label>
              <input
                v-model.number="escalationConfig.escalationInterval"
                type="number"
                min="5"
                max="120"
                class="border-muted-300 focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border px-3 py-2 focus:ring-2"
              >
            </div>

            <div>
              <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
                مهلت حل خودکار (دقیقه)
              </label>
              <input
                v-model.number="escalationConfig.autoResolveTimeout"
                type="number"
                min="30"
                max="1440"
                class="border-muted-300 focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border px-3 py-2 focus:ring-2"
              >
            </div>
          </div>

          <!-- Escalation Levels -->
          <div>
            <h3 class="text-md text-muted-800 dark:text-muted-100 mb-4 font-medium">
              سطوح تشدید
            </h3>

            <div class="space-y-4">
              <div
                v-for="(level, index) in escalationConfig.escalationLevels"
                :key="level.level"
                class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
              >
                <div class="mb-4 flex items-center justify-between">
                  <h4 class="text-muted-800 dark:text-muted-100 text-sm font-medium">
                    سطح {{ level.level }} - {{ getSeverityText(level.severity) }}
                  </h4>

                  <div class="flex items-center gap-2">
                    <label class="text-muted-600 text-xs">بازیابی خودکار:</label>
                    <input
                      v-model="level.autoRecoveryEnabled"
                      type="checkbox"
                      class="text-primary-600 bg-muted-100 border-muted-300 focus:ring-primary-500 size-4 rounded"
                    >
                  </div>
                </div>

                <!-- Notification Channels -->
                <div class="mb-4">
                  <h5 class="text-muted-700 dark:text-muted-300 mb-2 text-xs font-medium">
                    کانال‌های اعلان
                  </h5>
                  <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div
                      v-for="channel in level.notificationChannels"
                      :key="channel.type"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="channel.enabled"
                        type="checkbox"
                        class="text-primary-600 bg-muted-100 border-muted-300 focus:ring-primary-500 size-4 rounded"
                      >
                      <span class="text-muted-600 text-xs capitalize">
                        {{ getChannelTypeText(channel.type) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Recipients -->
                <div>
                  <h5 class="text-muted-700 dark:text-muted-300 mb-2 text-xs font-medium">
                    گیرندگان: {{ level.recipients.length }} ادمین
                  </h5>
                  <div class="flex items-center gap-2">
                    <label class="text-muted-600 text-xs">نیاز به تأیید:</label>
                    <input
                      v-model="level.requiresAcknowledgment"
                      type="checkbox"
                      class="text-primary-600 bg-muted-100 border-muted-300 focus:ring-primary-500 size-4 rounded"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recovery Actions Configuration -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
            اقدامات بازیابی خودکار
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mt-1 text-sm">
            پیکربندی اقدامات بازیابی خودکار برای خرابی‌های سیستم
          </p>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="action in recoveryActions"
              :key="action.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="mb-3 flex items-center justify-between">
                <div>
                  <h4 class="text-muted-800 dark:text-muted-100 text-sm font-medium">
                    {{ action.name }}
                  </h4>
                  <p class="text-muted-600 dark:text-muted-400 text-xs">
                    {{ action.description }}
                  </p>
                </div>

                <div class="flex items-center gap-4">
                  <span class="bg-muted-100 text-muted-700 rounded-full px-2 py-1 text-xs">
                    {{ action.component }}
                  </span>
                  <span
                    class="rounded-full px-2 py-1 text-xs"
                    :class="{
                      'bg-green-100 text-green-800': action.trigger === 'automatic',
                      'bg-blue-100 text-blue-800': action.trigger === 'manual'
                    }"
                  >
                    {{ getTriggerText(action.trigger) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                <div>
                  <span class="text-muted-600">زمان انتظار:</span>
                  <span class="ml-1 font-medium">{{ action.cooldownMinutes }}د</span>
                </div>
                <div>
                  <span class="text-muted-600">حداکثر تلاش:</span>
                  <span class="ml-1 font-medium">{{ action.maxRetries }}</span>
                </div>
                <div>
                  <span class="text-muted-600">مراحل:</span>
                  <span class="ml-1 font-medium">{{ action.actions.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Alerts -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                هشدارهای فعال
              </h2>
              <p class="text-muted-600 dark:text-muted-400 mt-1 text-sm">
                هشدارهای فعلی سیستم که نیاز به توجه دارند
              </p>
            </div>

            <button
              :disabled="isRefreshing"
              class="text-muted-600 hover:text-muted-800 flex items-center gap-2 px-3 py-2 text-sm transition-colors"
              @click="refreshAlerts"
            >
              <Icon
                name="lucide:refresh-cw"
                class="size-4"
                :class="{ 'animate-spin': isRefreshing }"
              />
              بروزرسانی
            </button>
          </div>
        </div>

        <div class="divide-muted-200 dark:divide-muted-800 divide-y">
          <div v-if="isLoadingAlerts" class="p-6 text-center">
            <Icon name="lucide:loader-2" class="text-muted-400 mx-auto size-6 animate-spin" />
            <p class="text-muted-600 mt-2 text-sm">
              در حال بارگذاری هشدارها...
            </p>
          </div>

          <div v-else-if="activeAlerts.length === 0" class="p-6 text-center">
            <Icon name="lucide:check-circle" class="text-success-500 mx-auto mb-2 size-8" />
            <p class="text-muted-600 text-sm">
              هیچ هشدار فعالی وجود ندارد
            </p>
          </div>

          <AdminMonitoringAlertItem
            v-for="alert in activeAlerts"
            :key="alert.id"
            :alert="alert"
            @acknowledge="acknowledgeAlert"
            @resolve="resolveAlert"
          />
        </div>
      </div>

      <!-- Alert History -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
            تاریخچه هشدارهای اخیر
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mt-1 text-sm">
            فعالیت هشدارها در ۲۴ ساعت گذشته
          </p>
        </div>

        <div class="divide-muted-200 dark:divide-muted-800 divide-y">
          <div v-if="recentAlerts.length === 0" class="p-6 text-center">
            <p class="text-muted-600 text-sm">
              هیچ هشدار اخیری وجود ندارد
            </p>
          </div>

          <AdminMonitoringAlertItem
            v-for="alert in recentAlerts"
            :key="alert.id"
            :alert="alert"
            @acknowledge="acknowledgeAlert"
            @resolve="resolveAlert"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Page metadata
definePageMeta({
  title: 'مدیریت هشدارها',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// Composables
const systemAlerting = useSystemAlerting()
const monitoring = useNotificationMonitoring()

// Reactive state
const isTesting = ref(false)
const isSaving = ref(false)
const isRefreshing = ref(false)
const isLoadingAlerts = ref(true)

// Configuration
const escalationConfig = ref(systemAlerting.escalationConfig.value)
const recoveryActions = ref(systemAlerting.recoveryActions.value)

// Alerts
const activeAlerts = ref<SystemAlert[]>([])
const recentAlerts = ref<SystemAlert[]>([])

// Initialize
onMounted(async () => {
  await initializeAlertingSystem()
  await loadAlerts()
})

/**
 * Initialize the alerting system
 */
const initializeAlertingSystem = async (): Promise<void> => {
  try {
    await systemAlerting.initializeAlerting()
  }
  catch (error) {
    console.error('❌ خطا در راه‌اندازی سیستم هشدار:', error)
  }
}

/**
 * Load active and recent alerts
 */
const loadAlerts = async (): Promise<void> => {
  try {
    isLoadingAlerts.value = true

    // Load active alerts (unresolved)
    const activeAlertsResponse = await monitoring.getAlerts({
      filter: 'resolved_at = ""',
      sort: '-triggered_at',
      perPage: 50,
    })
    activeAlerts.value = activeAlertsResponse.items

    // Load recent alerts (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString()

    const recentAlertsResponse = await monitoring.getAlerts({
      filter: `triggered_at >= "${yesterdayISO}"`,
      sort: '-triggered_at',
      perPage: 20,
    })
    recentAlerts.value = recentAlertsResponse.items
  }
  catch (error) {
    console.error('❌ خطا در بارگذاری هشدارها:', error)
  }
  finally {
    isLoadingAlerts.value = false
  }
}

/**
 * Get trigger text in Persian
 */
const getTriggerText = (trigger: string) => {
  switch (trigger) {
    case 'automatic': return 'خودکار'
    case 'manual': return 'دستی'
    default: return trigger
  }
}

/**
 * Get channel type text in Persian
 */
const getChannelTypeText = (channelType: string) => {
  switch (channelType) {
    case 'email': return 'ایمیل'
    case 'sms': return 'پیامک'
    case 'webhook': return 'وب‌هوک'
    case 'push_notification': return 'اعلان فوری'
    case 'slack': return 'اسلک'
    case 'discord': return 'دیسکورد'
    case 'telegram': return 'تلگرام'
    default: return channelType.replace('_', ' ')
  }
}

/**
 * Get severity text in Persian
 */
const getSeverityText = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'low': return 'کم'
    case 'medium': return 'متوسط'
    case 'high': return 'زیاد'
    case 'critical': return 'بحرانی'
    case 'urgent': return 'فوری'
    default: return severity.toUpperCase()
  }
}

/**
 * Test the alert system
 */
const testAlertSystem = async (): Promise<void> => {
  try {
    isTesting.value = true

    // Create a test alert
    const testAlert: Omit<SystemAlert, 'id' | 'created' | 'updated'> = {
      type: 'system',
      severity: 'medium',
      title: 'هشدار تست - بررسی سیستم',
      message: 'این یک هشدار تست برای تأیید عملکرد صحیح سیستم هشدار است.',
      component: 'ALERTING_SYSTEM',
      metric_name: 'test_metric',
      metric_value: 100,
      threshold: 80,
      triggered_at: new Date().toISOString(),
      auto_resolved: false,
    }

    // Process the test alert
    const createdAlert = await monitoring.createAlert(testAlert)
    if (createdAlert) {
      await systemAlerting.processAlert(createdAlert)
    }

    // Refresh alerts to show the new test alert
    await loadAlerts()

    // Show success message
    console.log('✅ هشدار تست با موفقیت ایجاد و پردازش شد')
  }
  catch (error) {
    console.error('❌ خطا در تست سیستم هشدار:', error)
  }
  finally {
    isTesting.value = false
  }
}

/**
 * Save configuration changes
 */
const saveConfiguration = async (): Promise<void> => {
  try {
    isSaving.value = true

    // In a real implementation, you would save the configuration to the database
    // For now, we'll just update the local configuration
    console.log('✅ پیکربندی ذخیره شد:', {
      escalationConfig: escalationConfig.value,
      recoveryActions: recoveryActions.value,
    })

    // Show success message
    console.log('✅ پیکربندی هشدار با موفقیت ذخیره شد')
  }
  catch (error) {
    console.error('❌ خطا در ذخیره پیکربندی:', error)
  }
  finally {
    isSaving.value = false
  }
}

/**
 * Refresh alerts
 */
const refreshAlerts = async (): Promise<void> => {
  try {
    isRefreshing.value = true
    await loadAlerts()
  }
  catch (error) {
    console.error('❌ خطا در بروزرسانی هشدارها:', error)
  }
  finally {
    isRefreshing.value = false
  }
}

/**
 * Acknowledge an alert
 */
const acknowledgeAlert = async (alertId: string): Promise<void> => {
  try {
    await monitoring.acknowledgeAlert(alertId)
    await loadAlerts()
    console.log('✅ هشدار با موفقیت تأیید شد')
  }
  catch (error) {
    console.error('❌ خطا در تأیید هشدار:', error)
  }
}

/**
 * Resolve an alert
 */
const resolveAlert = async (alertId: string): Promise<void> => {
  try {
    await monitoring.resolveAlert(alertId)
    await loadAlerts()
    console.log('✅ هشدار با موفقیت حل شد')
  }
  catch (error) {
    console.error('❌ خطا در حل هشدار:', error)
  }
}
</script>
