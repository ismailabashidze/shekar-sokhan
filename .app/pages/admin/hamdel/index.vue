<script setup lang="ts">
definePageMeta({
	title: "همدل - داشبورد مدیریتی",
	layout: "sidebar",
});

// Mock data for executive overview
const executiveSummary = ref({
	totalSessions: 1247,
	activeUsers: 892,
	highRiskCases: 23,
	averageSessionDuration: 45,
	therapistPerformance: 87.3,
	systemHealth: 98.2,
});

const riskDistribution = ref([
	{ level: "بسیار بالا", count: 23, percentage: 1.8, color: "danger" },
	{ level: "بالا", count: 67, percentage: 5.4, color: "warning" },
	{ level: "متوسط", count: 234, percentage: 18.8, color: "info" },
	{ level: "پایین", count: 523, percentage: 42.0, color: "success" },
	{ level: "بدون خطر", count: 400, percentage: 32.0, color: "muted" },
]);

const therapistPerformance = ref([
	{
		id: 1,
		name: "دکتر احمدی",
		score: 92.5,
		sessions: 156,
		positiveBehaviors: 89,
		improvementAreas: 3,
		trend: "up",
	},
	{
		id: 2,
		name: "دکتر محمدی",
		score: 88.3,
		sessions: 142,
		positiveBehaviors: 76,
		improvementAreas: 5,
		trend: "stable",
	},
	{
		id: 3,
		name: "دکتر رضایی",
		score: 85.7,
		sessions: 128,
		positiveBehaviors: 71,
		improvementAreas: 7,
		trend: "down",
	},
]);

const recentAlerts = ref([
	{
		id: 1,
		type: "high_risk",
		message: "کاربر با شناسه #1234 در سطح خطر بسیار بالا شناسایی شد",
		time: "۵ دقیقه پیش",
		userId: 1234,
		therapistId: 2,
		severity: "critical",
	},
	{
		id: 2,
		type: "system_error",
		message: "خطا در تحلیل پیام کاربر #5678",
		time: "۱۵ دقیقه پیش",
		userId: 5678,
		severity: "warning",
	},
	{
		id: 3,
		type: "performance",
		message: "کاهش عملکرد درمانگر با شناسه #3",
		time: "۱ ساعت پیش",
		therapistId: 3,
		severity: "info",
	},
]);

const userEngagement = ref({
	dailyActive: 342,
	weeklyActive: 892,
	monthlyActive: 1456,
	averageMessagesPerSession: 18.5,
	sessionCompletionRate: 87.3,
});

const systemMetrics = ref({
	aiResponseTime: 1.2,
	analysisSuccessRate: 98.7,
	serverUptime: 99.9,
	databasePerformance: 95.4,
});

// Computed properties for formatting
const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fa-IR").format(num);
};

const getTrendIcon = (trend: string) => {
	switch (trend) {
		case "up":
			return "ph:trend-up-duotone";
		case "down":
			return "ph:trend-down-duotone";
		default:
			return "ph:minus-duotone";
	}
};

const getTrendColor = (trend: string) => {
	switch (trend) {
		case "up":
			return "text-success-500";
		case "down":
			return "text-danger-500";
		default:
			return "text-muted-500";
	}
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-muted-800 dark:text-white">
          داشبورد مدیریتی همدل
        </h1>
        <p class="text-muted-500 dark:text-muted-400">
          نمای کلی عملکرد سیستم و سلامت کاربران
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton color="primary" shape="curved">
          <Icon name="ph:download-duotone" class="ml-2 size-4" />
          export گزارش
        </BaseButton>
        <BaseButton color="muted" shape="curved">
          <Icon name="ph:funnel-duotone" class="ml-2 size-4" />
          فیلتر
        </BaseButton>
      </div>
    </div>

    <!-- Executive Summary Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <BaseCard class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted-500 text-sm font-medium">جلسات فعال</p>
            <p class="text-3xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(executiveSummary.totalSessions) }}
            </p>
            <p class="text-success-500 mt-1 text-sm">
              <Icon name="ph:trend-up-duotone" class="size-4" />
              ۱۲٪ افزایش این هفته
            </p>
          </div>
          <div class="bg-primary-500/10 rounded-lg p-3">
            <Icon name="ph:chat-circle-duotone" class="text-primary-500 size-6" />
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted-500 text-sm font-medium">کاربران فعال</p>
            <p class="text-3xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(executiveSummary.activeUsers) }}
            </p>
            <p class="text-success-500 mt-1 text-sm">
              <Icon name="ph:trend-up-duotone" class="size-4" />
              ۸٪ افزایش این ماه
            </p>
          </div>
          <div class="bg-success-500/10 rounded-lg p-3">
            <Icon name="ph:users-duotone" class="text-success-500 size-6" />
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted-500 text-sm font-medium">موارد پرخطر</p>
            <p class="text-3xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(executiveSummary.highRiskCases) }}
            </p>
            <p class="text-danger-500 mt-1 text-sm">
              <Icon name="ph:warning-duotone" class="size-4" />
              نیاز به توجه فوری
            </p>
          </div>
          <div class="bg-danger-500/10 rounded-lg p-3">
            <Icon name="ph:shield-warning-duotone" class="text-danger-500 size-6" />
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted-500 text-sm font-medium">میانگین امتیاز درمانگران</p>
            <p class="text-3xl font-bold text-muted-800 dark:text-white">
              {{ executiveSummary.therapistPerformance }}%
            </p>
            <p class="text-info-500 mt-1 text-sm">
              <Icon name="ph:chart-line-duotone" class="size-4" />
              عملکرد خوب
            </p>
          </div>
          <div class="bg-info-500/10 rounded-lg p-3">
            <Icon name="ph:star-duotone" class="text-info-500 size-6" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Risk Distribution & Recent Alerts -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Risk Distribution -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            توزیع سطح ریسک کاربران
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:info-duotone" class="size-4" />
          </BaseButton>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="risk in riskDistribution"
            :key="risk.level"
            class="flex items-center gap-3"
          >
            <div class="flex-1">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-sm font-medium">{{ risk.level }}</span>
                <span class="text-sm text-muted-500">{{ risk.count }} کاربر</span>
              </div>
              <div class="bg-muted-200 dark:bg-muted-700 h-2 rounded-full overflow-hidden">
                <div
                  :class="`bg-${risk.color}-500 h-full rounded-full transition-all duration-500`"
                  :style="{ width: `${risk.percentage}%` }"
                />
              </div>
            </div>
            <span class="text-muted-500 text-sm w-12 text-left">
              {{ risk.percentage }}%
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Recent Alerts -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            هشدارهای اخیر
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:bell-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-3">
          <div
            v-for="alert in recentAlerts"
            :key="alert.id"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-3 transition-colors hover:bg-muted-50 dark:hover:bg-muted-800"
          >
            <div class="flex items-start gap-3">
              <div
                :class="`rounded-lg p-2 ${
                  alert.severity === 'critical' ? 'bg-danger-500/10' :
                  alert.severity === 'warning' ? 'bg-warning-500/10' :
                  'bg-info-500/10'
                }`"
              >
                <Icon
                  :name="alert.severity === 'critical' ? 'ph:warning-circle-duotone' :
                         alert.severity === 'warning' ? 'ph:alert-duotone' :
                         'ph:info-duotone'"
                  :class="`size-4 ${
                    alert.severity === 'critical' ? 'text-danger-500' :
                    alert.severity === 'warning' ? 'text-warning-500' :
                    'text-info-500'
                  }`"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm text-muted-800 dark:text-muted-200">
                  {{ alert.message }}
                </p>
                <p class="text-muted-500 mt-1 text-xs">{{ alert.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Therapist Performance & User Engagement -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Top Therapists -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            برترین درمانگران
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            مشاهده همه
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="therapist in therapistPerformance"
            :key="therapist.id"
            class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted-50 dark:hover:bg-muted-800"
          >
            <div class="flex items-center gap-3">
              <BaseAvatar size="sm" text="DR" class="bg-primary-500 text-white" />
              <div>
                <p class="font-medium text-muted-800 dark:text-muted-200">
                  {{ therapist.name }}
                </p>
                <p class="text-muted-500 text-xs">
                  {{ therapist.sessions }} جلسه • {{ therapist.positiveBehaviors }} رفتار مثبت
                </p>
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold text-muted-800 dark:text-white">
                  {{ therapist.score }}
                </span>
                <Icon
                  :name="getTrendIcon(therapist.trend)"
                  :class="`size-4 ${getTrendColor(therapist.trend)}`"
                />
              </div>
              <p class="text-muted-500 text-xs">{{ therapist.improvementAreas }} نیاز به بهبود</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- User Engagement Metrics -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            معیارهای تعامل کاربران
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:chart-bar-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
            <div class="flex items-center gap-2">
              <Icon name="ph:sun-duotone" class="text-warning-500 size-5" />
              <span class="text-muted-500 text-sm">روزانه</span>
            </div>
            <p class="mt-2 text-2xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(userEngagement.dailyActive) }}
            </p>
          </div>

          <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
            <div class="flex items-center gap-2">
              <Icon name="ph:calendar-duotone" class="text-info-500 size-5" />
              <span class="text-muted-500 text-sm">هفتگی</span>
            </div>
            <p class="mt-2 text-2xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(userEngagement.weeklyActive) }}
            </p>
          </div>

          <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
            <div class="flex items-center gap-2">
              <Icon name="ph:calendar-check-duotone" class="text-success-500 size-5" />
              <span class="text-muted-500 text-sm">ماهانه</span>
            </div>
            <p class="mt-2 text-2xl font-bold text-muted-800 dark:text-white">
              {{ formatNumber(userEngagement.monthlyActive) }}
            </p>
          </div>

          <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
            <div class="flex items-center gap-2">
              <Icon name="ph:percent-duotone" class="text-primary-500 size-5" />
              <span class="text-muted-500 text-sm">نمایش کامل</span>
            </div>
            <p class="mt-2 text-2xl font-bold text-muted-800 dark:text-white">
              {{ userEngagement.sessionCompletionRate }}%
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-muted-500 text-sm">میانگین پیام در هر جلسه</span>
            <span class="font-medium">{{ userEngagement.averageMessagesPerSession }}</span>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- System Health -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          سلامت سیستم
        </h3>
        <div class="flex items-center gap-2">
          <div class="bg-success-500 h-2 w-2 rounded-full animate-pulse" />
          <span class="text-success-500 text-sm">سیستم سالم</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div class="text-center">
          <div class="bg-primary-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:cpu-duotone" class="text-primary-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">زمان پاسخ هوش مصنوعی</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ systemMetrics.aiResponseTime }}ثانیه
          </p>
        </div>

        <div class="text-center">
          <div class="bg-success-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:check-circle-duotone" class="text-success-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">نرخ موفقیت تحلیل</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ systemMetrics.analysisSuccessRate }}%
          </p>
        </div>

        <div class="text-center">
          <div class="bg-info-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:server-duotone" class="text-info-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">آپتایم سرور</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ systemMetrics.serverUptime }}%
          </p>
        </div>

        <div class="text-center">
          <div class="bg-warning-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:database-duotone" class="text-warning-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">عملکرد پایگاه داده</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ systemMetrics.databasePerformance }}%
          </p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>