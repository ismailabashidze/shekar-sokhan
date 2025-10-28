<template>
  <div class="bg-muted-50 dark:bg-muted-950 min-h-screen">
    <!-- Header -->
    <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 border-b bg-white">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
              نظارت بر سیستم
            </h1>
            <p class="text-muted-600 dark:text-muted-400 mt-1">
              نظارت بلادرنگ و وضعیت سلامت سیستم اعلان‌ها
            </p>
          </div>

          <div class="flex items-center gap-4">
            <!-- Health Status Badge -->
            <div class="flex items-center gap-2">
              <div
                class="size-3 rounded-full"
                :class="{
                  'bg-success-500': healthStatus === 'healthy',
                  'bg-warning-500': healthStatus === 'degraded',
                  'bg-danger-500': healthStatus === 'unhealthy'
                }"
              />
              <span class="text-sm font-medium">
                {{ healthStatus === 'healthy' ? 'سالم' : healthStatus === 'degraded' ? 'کاهش عملکرد' : 'ناسالم' }}
              </span>
            </div>

            <!-- Monitoring Toggle -->
            <button
              class="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
              :class="isMonitoring
                ? 'bg-success-50 border-success-200 text-success-700 hover:bg-success-100'
                : 'bg-muted-50 border-muted-200 text-muted-700 hover:bg-muted-100'"
              @click="toggleMonitoring"
            >
              <Icon :name="isMonitoring ? 'lucide:pause' : 'lucide:play'" class="size-4" />
              {{ isMonitoring ? 'توقف نظارت' : 'شروع نظارت' }}
            </button>

            <!-- Refresh Button -->
            <button
              :disabled="isRefreshing"
              class="border-muted-200 text-muted-700 hover:bg-muted-50 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors disabled:opacity-50"
              @click="refreshData"
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
      </div>
    </div>

    <div class="space-y-6 p-6">
      <!-- Collection Status Warning -->
      <div
        v-if="!collectionStatus.areMonitoringCollectionsReady.value"
        class="bg-warning-50 border-warning-200 rounded-lg border p-4"
      >
        <div class="flex items-start gap-3">
          <Icon name="lucide:alert-triangle" class="text-warning-600 mt-0.5 size-5" />
          <div class="flex-1">
            <h3 class="text-warning-800 font-medium">
              مجموعه‌های مورد نیاز برای نظارت موجود نیست
            </h3>
            <p class="text-warning-700 mt-1 text-sm">
              برای عملکرد صحیح سیستم نظارت، مجموعه‌های زیر باید در پنل ادمین PocketBase ایجاد شوند:
              <strong>{{ collectionStatus.getMissingCollections.value.join(', ') }}</strong>
            </p>
            <div class="mt-3 flex gap-2">
              <button
                class="bg-warning-600 hover:bg-warning-700 rounded px-3 py-1 text-sm text-white transition-colors"
                @click="showSetupGuide = !showSetupGuide"
              >
                {{ showSetupGuide ? 'پنهان کردن راهنما' : 'نمایش راهنمای نصب' }}
              </button>
              <button
                class="bg-muted-600 hover:bg-muted-700 rounded px-3 py-1 text-sm text-white transition-colors"
                @click="collectionStatus.checkAllCollections()"
              >
                بررسی مجدد
              </button>
            </div>

            <!-- Setup Guide -->
            <div v-if="showSetupGuide" class="bg-warning-25 border-warning-100 mt-4 rounded border p-3 text-sm">
              <h4 class="text-warning-800 mb-2 font-medium">
                راهنمای ایجاد مجموعه‌ها:
              </h4>
              <ol class="text-warning-700 list-inside list-decimal space-y-1">
                <li>به پنل ادمین PocketBase بروید</li>
                <li>روی "Collections" کلیک کنید</li>
                <li>روی "New collection" کلیک کنید</li>
                <li>مجموعه‌های <code>notification_logs</code> و <code>system_metrics</code> را ایجاد کنید</li>
                <li>فایل‌های JSON موجود در پروژه را برای تنظیمات استفاده کنید</li>
              </ol>
              <p class="mt-2 text-xs">
                برای راهنمای کامل، فایل <code>createCollectionsManually.md</code> را مشاهده کنید.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="نرخ تحویل"
          :value="currentMetrics?.notification_delivery_rate || 0"
          unit="%"
          :trend="deliveryTrend"
          :status="getMetricStatus('delivery', currentMetrics?.notification_delivery_rate || 0)"
          icon="lucide:send"
        />

        <MetricCard
          title="نرخ خطا"
          :value="currentMetrics?.error_rate || 0"
          unit="%"
          :trend="errorTrend"
          :status="getMetricStatus('error', currentMetrics?.error_rate || 0)"
          icon="lucide:alert-triangle"
        />

        <MetricCard
          title="زمان پاسخ"
          :value="currentMetrics?.database_response_time || 0"
          unit="ms"
          :trend="responseTrend"
          :status="getMetricStatus('response', currentMetrics?.database_response_time || 0)"
          icon="lucide:clock"
        />

        <MetricCard
          title="کمپین‌های فعال"
          :value="currentMetrics?.active_campaigns || 0"
          unit=""
          :trend="campaignTrend"
          :status="'neutral'"
          icon="lucide:megaphone"
        />
      </div>

      <!-- Alerting System Status -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                وضعیت سیستم هشدار
              </h2>
              <p class="text-muted-600 dark:text-muted-400 mt-1 text-sm">
                وضعیت بلادرنگ سیستم تشدید هشدار و بازیابی
              </p>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <div
                  class="size-2 rounded-full"
                  :class="{
                    'bg-success-500': alertingSystemStatus === 'operational',
                    'bg-warning-500': alertingSystemStatus === 'degraded',
                    'bg-danger-500': alertingSystemStatus === 'failed'
                  }"
                />
                <span class="text-sm font-medium">
                  {{ getAlertingStatusText(alertingSystemStatus) }}
                </span>
              </div>

              <NuxtLink to="/monitoring/alerting" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                پیکربندی
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
            <!-- Active Escalations -->
            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ activeEscalations }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                تشدیدهای فعال
              </div>
            </div>

            <!-- Recovery Actions -->
            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ recoveryActionsExecuted }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                اقدامات بازیابی (۲۴ ساعت)
              </div>
            </div>

            <!-- Notification Channels -->
            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ enabledChannels }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                کانال‌های فعال
              </div>
            </div>

            <!-- Alert Response Time -->
            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ avgAlertResponseTime }}s
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                میانگین زمان پاسخ
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts Section -->
      <div
        v-if="activeAlerts.length > 0"
        class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white"
      >
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
              هشدارهای فعال ({{ activeAlerts.length }})
            </h2>
            <div class="flex items-center gap-3">
              <button
                :disabled="isTestingAlerts"
                class="rounded border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                @click="testAlertingSystem"
              >
                <Icon
                  name="lucide:zap"
                  class="mr-1 inline size-3"
                  :class="{ 'animate-pulse': isTestingAlerts }"
                />
                تست سیستم
              </button>
              <button class="text-primary-600 hover:text-primary-700 text-sm font-medium" @click="acknowledgeAllAlerts">
                تأیید همه
              </button>
            </div>
          </div>
        </div>

        <div class="divide-muted-200 dark:divide-muted-800 divide-y">
          <AdminMonitoringAlertItem
            v-for="alert in activeAlerts"
            :key="alert.id"
            :alert="alert"
            @acknowledge="acknowledgeAlert"
            @resolve="resolveAlert"
          />
        </div>
      </div>

      <!-- No Alerts State -->
      <div v-else class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
              هشدارهای سیستم
            </h2>
            <button
              :disabled="isTestingAlerts"
              class="rounded border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
              @click="testAlertingSystem"
            >
              <Icon
                name="lucide:zap"
                class="mr-1 inline size-3"
                :class="{ 'animate-pulse': isTestingAlerts }"
              />
              تست سیستم
            </button>
          </div>
        </div>

        <div class="p-6 text-center">
          <Icon name="lucide:check-circle" class="text-success-500 mx-auto mb-3 size-12" />
          <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
            همه سیستم‌ها عملیاتی
          </h3>
          <p class="text-muted-600 dark:text-muted-400">
            هیچ هشدار فعالی وجود ندارد. سیستم اعلان‌ها به خوبی کار می‌کند.
          </p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Delivery Rate Chart -->
        <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6">
          <h3 class="text-muted-800 dark:text-muted-100 mb-4 text-lg font-semibold">
            روند نرخ تحویل
          </h3>
          <MetricsChart
            :data="historicalMetrics"
            metric="notification_delivery_rate"
            color="#10b981"
            :height="300"
          />
        </div>

        <!-- Error Rate Chart -->
        <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6">
          <h3 class="text-muted-800 dark:text-muted-100 mb-4 text-lg font-semibold">
            روند نرخ خطا
          </h3>
          <MetricsChart
            :data="historicalMetrics"
            metric="error_rate"
            color="#ef4444"
            :height="300"
          />
        </div>
      </div>

      <!-- System Components Status -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
            اجزای سیستم
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ComponentStatus
              name="پایگاه داده"
              :status="componentHealth.database"
              icon="lucide:database"
              :details="getDatabaseDetails()"
            />

            <ComponentStatus
              name="سرویس اعلان"
              :status="componentHealth.notification"
              icon="lucide:bell"
              :details="getNotificationDetails()"
            />

            <ComponentStatus
              name="Service Worker"
              :status="componentHealth.serviceWorker"
              icon="lucide:cog"
              :details="getServiceWorkerDetails()"
            />

            <ComponentStatus
              name="قالب‌ها"
              :status="componentHealth.templates"
              icon="lucide:file-text"
              :details="getTemplateDetails()"
            />
          </div>
        </div>
      </div>

      <!-- Performance Summary -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
            خلاصه عملکرد (۷ روز گذشته)
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ performanceSummary.successRate }}%
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                نرخ موفقیت
              </div>
            </div>

            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ performanceSummary.avgResponseTime }}ms
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                میانگین پاسخ
              </div>
            </div>

            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ performanceSummary.uptime }}%
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                زمان فعالیت
              </div>
            </div>

            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ performanceSummary.errorCount }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                کل خطاها
              </div>
            </div>

            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ performanceSummary.throughput }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                معیارها/روز
              </div>
            </div>

            <div class="text-center">
              <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                {{ currentMetrics?.user_engagement_score || 0 }}%
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                مشارکت
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
              گزارش‌های اخیر سیستم
            </h2>
            <NuxtLink to="/monitoring/logs" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              مشاهده همه گزارش‌ها
            </NuxtLink>
          </div>
        </div>

        <div class="divide-muted-200 dark:divide-muted-800 max-h-96 divide-y overflow-y-auto">
          <LogEntry
            v-for="log in recentLogs"
            :key="log.id"
            :log="log"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Meta
definePageMeta({
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });
// Composables
const monitoring = useNotificationMonitoring();
const logger = useNotificationLogger();
const collectionStatus = useCollectionStatus();

// Reactive state
const isRefreshing = ref(false);
const isTestingAlerts = ref(false);
const showSetupGuide = ref(false);
const healthStatus = ref<'healthy' | 'degraded' | 'unhealthy'>('healthy');
const componentHealth = ref({
  database: 'up' as 'up' | 'down' | 'slow',
  notification: 'up' as 'up' | 'down' | 'degraded',
  serviceWorker: 'active' as 'active' | 'inactive' | 'error',
  templates: 'operational' as 'operational' | 'degraded' | 'failed',
});
const historicalMetrics = ref<SystemMetrics[]>([]);
const performanceSummary = ref({
  avgDeliveryTime: 0,
  avgResponseTime: 0,
  successRate: 0,
  errorCount: 0,
  throughput: 0,
  uptime: 0,
});
const recentLogs = ref<any[]>([]);

// Alerting system status
const alertingSystemStatus = ref<'operational' | 'degraded' | 'failed'>('operational');
const activeEscalations = ref(0);
const recoveryActionsExecuted = ref(0);
const enabledChannels = ref(3);
const avgAlertResponseTime = ref(2.5);

// Computed trends (simplified for demo)
const deliveryTrend = computed(() => {
  if (historicalMetrics.value.length < 2) return 'neutral';
  const recent = historicalMetrics.value.slice(-2);
  return recent[1].notification_delivery_rate > recent[0].notification_delivery_rate ? 'up' : 'down';
});

const errorTrend = computed(() => {
  if (historicalMetrics.value.length < 2) return 'neutral';
  const recent = historicalMetrics.value.slice(-2);
  return recent[1].error_rate < recent[0].error_rate ? 'up' : 'down';
});

const responseTrend = computed(() => {
  if (historicalMetrics.value.length < 2) return 'neutral';
  const recent = historicalMetrics.value.slice(-2);
  return recent[1].database_response_time < recent[0].database_response_time ? 'up' : 'down';
});

const campaignTrend = computed(() => {
  if (historicalMetrics.value.length < 2) return 'neutral';
  const recent = historicalMetrics.value.slice(-2);
  return recent[1].active_campaigns > recent[0].active_campaigns ? 'up' : 'down';
});

// Destructure monitoring composable
const {
  currentMetrics,
  activeAlerts,
  isMonitoring,
  startMonitoring,
  stopMonitoring,
  performHealthCheck,
  getHistoricalMetrics,
  getPerformanceSummary,
  acknowledgeAlert: ackAlert,
  resolveAlert: resolveAlertById,
} = monitoring;

// Methods
const toggleMonitoring = async () => {
  try {
    if (isMonitoring.value) {
      stopMonitoring();
    }
    else {
      await startMonitoring();
    }
  }
  catch (error) {
    console.error('Failed to toggle monitoring:', error);
  }
};

const refreshData = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    // Perform health check
    const healthResult = await performHealthCheck();
    healthStatus.value = healthResult.status;
    componentHealth.value = healthResult.components;

    // Get historical metrics
    historicalMetrics.value = await getHistoricalMetrics(7, 'hour');

    // Get performance summary
    performanceSummary.value = await getPerformanceSummary(7);

    // Get recent logs
    const logs = await logger.getLogs({
      limit: 20,
    });
    recentLogs.value = logs;

    // Update alerting system metrics
    await updateAlertingMetrics();
  }
  catch (error) {
    // Handle different types of errors gracefully
    if (error instanceof Error && error.message.includes('404')) {
      console.warn('⚠️ Some monitoring collections are not set up yet. Please ensure notification_logs and system_metrics collections exist.');
    }
    else if (error instanceof Error && error.message.includes('autocancelled')) {
      console.debug('Request was auto-cancelled, this is normal during rapid refreshes');
    }
    else {
      console.error('Failed to refresh data:', error);
    }
  }
  finally {
    isRefreshing.value = false;
  }
};

const updateAlertingMetrics = async () => {
  try {
    // Get active escalations count
    const { $pb } = useNuxtApp();
    const pb = $pb as any;

    // Count active alerts with escalation levels
    const escalatedAlerts = await pb.collection('system_alerts').getList(1, 1, {
      filter: 'resolved_at = "" && escalation_level > 0',
      fields: 'id',
    });
    activeEscalations.value = escalatedAlerts.totalItems;

    // Count recovery actions in last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recoveryAlerts = await pb.collection('system_alerts').getList(1, 1, {
      filter: `recovery_attempted = true && triggered_at >= "${yesterday.toISOString()}"`,
      fields: 'id',
    });
    recoveryActionsExecuted.value = recoveryAlerts.totalItems;

    // Determine alerting system status
    if (activeEscalations.value > 5) {
      alertingSystemStatus.value = 'degraded';
    }
    else if (activeEscalations.value > 10) {
      alertingSystemStatus.value = 'failed';
    }
    else {
      alertingSystemStatus.value = 'operational';
    }

    // Calculate average alert response time (mock for now)
    avgAlertResponseTime.value = Math.random() * 5 + 1;
  }
  catch (error) {
    console.error('Failed to update alerting metrics:', error);
    alertingSystemStatus.value = 'degraded';
  }
};

const getAlertingStatusText = (status: string) => {
  switch (status) {
    case 'operational': return 'عملیاتی';
    case 'degraded': return 'کاهش عملکرد';
    case 'failed': return 'خراب';
    default: return status;
  }
};

const getMetricStatus = (type: string, value: number): 'good' | 'warning' | 'critical' | 'neutral' => {
  switch (type) {
    case 'delivery':
      if (value >= 95) return 'good';
      if (value >= 85) return 'warning';
      return 'critical';
    case 'error':
      if (value <= 1) return 'good';
      if (value <= 5) return 'warning';
      return 'critical';
    case 'response':
      if (value <= 500) return 'good';
      if (value <= 1000) return 'warning';
      return 'critical';
    default:
      return 'neutral';
  }
};

const acknowledgeAlert = async (alertId: string) => {
  try {
    await ackAlert(alertId);
    await refreshData();
  }
  catch (error) {
    console.error('Failed to acknowledge alert:', error);
  }
};

const resolveAlert = async (alertId: string) => {
  try {
    await resolveAlertById(alertId);
    await refreshData();
  }
  catch (error) {
    console.error('Failed to resolve alert:', error);
  }
};

const acknowledgeAllAlerts = async () => {
  try {
    const promises = activeAlerts.value.map((alert: any) =>
      alert.id ? ackAlert(alert.id) : Promise.resolve(),
    );
    await Promise.all(promises);
    await refreshData();
  }
  catch (error) {
    console.error('Failed to acknowledge all alerts:', error);
  }
};

const testAlertingSystem = async () => {
  if (isTestingAlerts.value) return;

  isTestingAlerts.value = true;
  try {
    // Run a quick test
    const testAlert = {
      type: 'system' as const,
      severity: 'medium' as const,
      title: 'Dashboard Test Alert',
      message: 'Testing alerting system from monitoring dashboard',
      component: 'MONITORING_DASHBOARD',
      metric_name: 'test_metric',
      metric_value: 75,
      threshold: 80,
      triggered_at: new Date().toISOString(),
      auto_resolved: false,
    };

    const createdAlert = await monitoring.createAlert(testAlert);
    if (createdAlert) {
      // Import and use system alerting
      const { useSystemAlerting } = await import('~/composables/useSystemAlerting');
      const systemAlerting = useSystemAlerting();
      await systemAlerting.processAlert(createdAlert);

      // Refresh data to show the new alert
      await refreshData();

      console.log('✅ Test alert created and processed successfully');
    }
  }
  catch (error) {
    console.error('❌ Failed to test alerting system:', error);
  }
  finally {
    isTestingAlerts.value = false;
  }
};

// Component details
const getDatabaseDetails = () => {
  return {
    'زمان پاسخ': `${currentMetrics.value?.database_response_time || 0}ms`,
    'وضعیت': componentHealth.value.database === 'up' ? 'فعال' : componentHealth.value.database === 'slow' ? 'کند' : 'غیرفعال',
  };
};

const getNotificationDetails = () => {
  return {
    'نرخ موفقیت توکن': `${currentMetrics.value?.notification_success_rate || 0}%`,
    'وضعیت': componentHealth.value.notification === 'up' ? 'فعال' : componentHealth.value.notification === 'degraded' ? 'کاهش عملکرد' : 'غیرفعال',
  };
};

const getServiceWorkerDetails = () => {
  return {
    'وضعیت': componentHealth.value.serviceWorker === 'active' ? 'فعال' : componentHealth.value.serviceWorker === 'inactive' ? 'غیرفعال' : 'خطا',
    'استفاده از حافظه': `${currentMetrics.value?.memory_usage || 0}MB`,
  };
};

const getTemplateDetails = () => {
  return {
    'نرخ موفقیت رندر': `${currentMetrics.value?.template_render_success_rate || 0}%`,
    'وضعیت': componentHealth.value.templates === 'operational' ? 'عملیاتی' : componentHealth.value.templates === 'degraded' ? 'کاهش عملکرد' : 'خراب',
  };
};

// Initialize
onMounted(async () => {
  // Check collection status first
  await collectionStatus.checkAllCollections();

  // Only proceed with monitoring if collections are ready
  if (collectionStatus.areMonitoringCollectionsReady.value) {
    await refreshData();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(refreshData, 30000);

    onUnmounted(() => {
      clearInterval(refreshInterval);
    });
  }
  else {
    console.warn('⚠️ Monitoring collections not ready. Missing:', collectionStatus.getMissingCollections.value);
  }
});
</script>
