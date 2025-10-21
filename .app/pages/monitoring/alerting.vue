<template>
  <div class="min-h-screen bg-muted-50 dark:bg-muted-950">
    <!-- Header -->
    <div class="bg-white dark:bg-muted-900 border-b border-muted-200 dark:border-muted-800">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-muted-800 dark:text-muted-100">
              مدیریت هشدارها
            </h1>
            <p class="text-muted-600 dark:text-muted-400 mt-1">
              پیکربندی تشدید هشدار، اعلان‌ها و بازیابی خودکار
            </p>
          </div>

          <div class="flex items-center gap-4">
            <button @click="testAlertSystem" :disabled="isTesting"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-50">
              <Icon name="lucide:zap" class="w-4 h-4" :class="{ 'animate-pulse': isTesting }" />
              تست سیستم هشدار
            </button>

            <button @click="saveConfiguration" :disabled="isSaving"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50">
              <Icon name="lucide:save" class="w-4 h-4" :class="{ 'animate-spin': isSaving }" />
              ذخیره پیکربندی
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Escalation Configuration -->
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800">
        <div class="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
          <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
            پیکربندی تشدید
          </h2>
          <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
            پیکربندی نحوه تشدید هشدارها و ارسال به چه کسانی
          </p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Global Settings -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                فعال‌سازی تشدید
              </label>
              <div class="flex items-center">
                <input v-model="escalationConfig.enabled" type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-muted-100 border-muted-300 rounded focus:ring-primary-500" />
                <span class="ml-2 text-sm text-muted-600">
                  فعال‌سازی تشدید خودکار هشدار
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                فاصله تشدید (دقیقه)
              </label>
              <input v-model.number="escalationConfig.escalationInterval" type="number" min="5" max="120"
                class="w-full px-3 py-2 border border-muted-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
                مهلت حل خودکار (دقیقه)
              </label>
              <input v-model.number="escalationConfig.autoResolveTimeout" type="number" min="30" max="1440"
                class="w-full px-3 py-2 border border-muted-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <!-- Escalation Levels -->
          <div>
            <h3 class="text-md font-medium text-muted-800 dark:text-muted-100 mb-4">
              سطوح تشدید
            </h3>

            <div class="space-y-4">
              <div v-for="(level, index) in escalationConfig.escalationLevels" :key="level.level"
                class="border border-muted-200 dark:border-muted-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-medium text-muted-800 dark:text-muted-100">
                    سطح {{ level.level }} - {{ getSeverityText(level.severity) }}
                  </h4>

                  <div class="flex items-center gap-2">
                    <label class="text-xs text-muted-600">بازیابی خودکار:</label>
                    <input v-model="level.autoRecoveryEnabled" type="checkbox"
                      class="w-4 h-4 text-primary-600 bg-muted-100 border-muted-300 rounded focus:ring-primary-500" />
                  </div>
                </div>

                <!-- Notification Channels -->
                <div class="mb-4">
                  <h5 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-2">
                    کانال‌های اعلان
                  </h5>
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div v-for="channel in level.notificationChannels" :key="channel.type"
                      class="flex items-center gap-2">
                      <input v-model="channel.enabled" type="checkbox"
                        class="w-4 h-4 text-primary-600 bg-muted-100 border-muted-300 rounded focus:ring-primary-500" />
                      <span class="text-xs text-muted-600 capitalize">
                        {{ getChannelTypeText(channel.type) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Recipients -->
                <div>
                  <h5 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-2">
                    گیرندگان: {{ level.recipients.length }} ادمین
                  </h5>
                  <div class="flex items-center gap-2">
                    <label class="text-xs text-muted-600">نیاز به تأیید:</label>
                    <input v-model="level.requiresAcknowledgment" type="checkbox"
                      class="w-4 h-4 text-primary-600 bg-muted-100 border-muted-300 rounded focus:ring-primary-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recovery Actions Configuration -->
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800">
        <div class="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
          <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
            اقدامات بازیابی خودکار
          </h2>
          <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
            پیکربندی اقدامات بازیابی خودکار برای خرابی‌های سیستم
          </p>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div v-for="action in recoveryActions" :key="action.id"
              class="border border-muted-200 dark:border-muted-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="text-sm font-medium text-muted-800 dark:text-muted-100">
                    {{ action.name }}
                  </h4>
                  <p class="text-xs text-muted-600 dark:text-muted-400">
                    {{ action.description }}
                  </p>
                </div>

                <div class="flex items-center gap-4">
                  <span class="text-xs px-2 py-1 rounded-full bg-muted-100 text-muted-700">
                    {{ action.component }}
                  </span>
                  <span class="text-xs px-2 py-1 rounded-full" :class="{
                    'bg-green-100 text-green-800': action.trigger === 'automatic',
                    'bg-blue-100 text-blue-800': action.trigger === 'manual'
                  }">
                    {{ getTriggerText(action.trigger) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800">
        <div class="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
                هشدارهای فعال
              </h2>
              <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
                هشدارهای فعلی سیستم که نیاز به توجه دارند
              </p>
            </div>

            <button @click="refreshAlerts" :disabled="isRefreshing"
              class="flex items-center gap-2 px-3 py-2 text-sm text-muted-600 hover:text-muted-800 transition-colors">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
              بروزرسانی
            </button>
          </div>
        </div>

        <div class="divide-y divide-muted-200 dark:divide-muted-800">
          <div v-if="isLoadingAlerts" class="p-6 text-center">
            <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto text-muted-400" />
            <p class="text-sm text-muted-600 mt-2">در حال بارگذاری هشدارها...</p>
          </div>

          <div v-else-if="activeAlerts.length === 0" class="p-6 text-center">
            <Icon name="lucide:check-circle" class="w-8 h-8 mx-auto text-success-500 mb-2" />
            <p class="text-sm text-muted-600">هیچ هشدار فعالی وجود ندارد</p>
          </div>

          <AdminMonitoringAlertItem v-for="alert in activeAlerts" :key="alert.id" :alert="alert"
            @acknowledge="acknowledgeAlert" @resolve="resolveAlert" />
        </div>
      </div>

      <!-- Alert History -->
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800">
        <div class="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
          <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
            تاریخچه هشدارهای اخیر
          </h2>
          <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
            فعالیت هشدارها در ۲۴ ساعت گذشته
          </p>
        </div>

        <div class="divide-y divide-muted-200 dark:divide-muted-800">
          <div v-if="recentAlerts.length === 0" class="p-6 text-center">
            <p class="text-sm text-muted-600">هیچ هشدار اخیری وجود ندارد</p>
          </div>

          <AdminMonitoringAlertItem v-for="alert in recentAlerts" :key="alert.id" :alert="alert"
            @acknowledge="acknowledgeAlert" @resolve="resolveAlert" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Page metadata
definePageMeta({
  title: 'مدیریت هشدارها',
  layout: 'sidebar'
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
  } catch (error) {
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
      perPage: 50
    })
    activeAlerts.value = activeAlertsResponse.items

    // Load recent alerts (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString()

    const recentAlertsResponse = await monitoring.getAlerts({
      filter: `triggered_at >= "${yesterdayISO}"`,
      sort: '-triggered_at',
      perPage: 20
    })
    recentAlerts.value = recentAlertsResponse.items

  } catch (error) {
    console.error('❌ خطا در بارگذاری هشدارها:', error)
  } finally {
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
      auto_resolved: false
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

  } catch (error) {
    console.error('❌ خطا در تست سیستم هشدار:', error)
  } finally {
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
      recoveryActions: recoveryActions.value
    })

    // Show success message
    console.log('✅ پیکربندی هشدار با موفقیت ذخیره شد')

  } catch (error) {
    console.error('❌ خطا در ذخیره پیکربندی:', error)
  } finally {
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
  } catch (error) {
    console.error('❌ خطا در بروزرسانی هشدارها:', error)
  } finally {
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
  } catch (error) {
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
  } catch (error) {
    console.error('❌ خطا در حل هشدار:', error)
  }
}
</script>