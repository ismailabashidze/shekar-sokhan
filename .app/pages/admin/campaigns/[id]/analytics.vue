<script setup lang="ts">
import type { NotificationCampaign, CampaignAnalytics } from '~/types/campaigns'

definePageMeta({
  title: 'آنالیتیک کمپین',
  layout: 'sidebar',
  // Using global middlewares only
})

const route = useRoute()
const campaignId = route.params.id as string

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'آنالیتیک کمپین - پنل ادمین - ذهنا',
})

const {
  getCampaignAnalytics,
  getCampaignMetrics,
} = useCampaignManager()

// State
const campaign = ref<NotificationCampaign | null>(null)
const analytics = ref<CampaignAnalytics | null>(null)
const isLoading = ref(true)
const selectedTimeRange = ref<'7d' | '30d' | '90d' | 'all'>('30d')

// Mock performance data for demonstration
const performanceData = ref([
  { date: '2024-01-01', sent: 100, delivered: 95, opened: 45, clicked: 12 },
  { date: '2024-01-02', sent: 150, delivered: 142, opened: 68, clicked: 18 },
  { date: '2024-01-03', sent: 120, delivered: 115, opened: 52, clicked: 15 },
  { date: '2024-01-04', sent: 200, delivered: 190, opened: 85, clicked: 22 },
  { date: '2024-01-05', sent: 180, delivered: 175, opened: 78, clicked: 20 },
  { date: '2024-01-06', sent: 160, delivered: 152, opened: 71, clicked: 19 },
  { date: '2024-01-07', sent: 140, delivered: 135, opened: 62, clicked: 16 },
])

// Initialize data
onMounted(async () => {
  try {
    analytics.value = await getCampaignAnalytics(campaignId)
    campaign.value = analytics.value.campaign
  }
  catch (error) {
    console.error('خطا در بارگذاری آنالیتیک:', error)
  }
  finally {
    isLoading.value = false
  }
})

// Computed
const metrics = computed(() => {
  return campaign.value ? getCampaignMetrics(campaign.value) : null
})

const chartData = computed(() => {
  return {
    labels: performanceData.value.map(d => new Date(d.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'ارسال شده',
        data: performanceData.value.map(d => d.sent),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'تحویل شده',
        data: performanceData.value.map(d => d.delivered),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'بازدید شده',
        data: performanceData.value.map(d => d.opened),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
      },
      {
        label: 'کلیک شده',
        data: performanceData.value.map(d => d.clicked),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'عملکرد کمپین در طول زمان',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const engagementData = computed(() => {
  if (!metrics.value) return null

  return {
    labels: ['تحویل شده', 'بازدید شده', 'کلیک شده'],
    datasets: [{
      data: [
        metrics.value.delivery_rate,
        metrics.value.open_rate,
        metrics.value.click_rate,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(251, 146, 60)',
        'rgb(168, 85, 247)',
      ],
      borderWidth: 2,
    }],
  }
})

const engagementOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'نرخ‌های تعامل (%)',
    },
  },
}

// Methods
const exportAnalytics = () => {
  // Implementation for exporting analytics data
  console.log('Exporting analytics data...')
}

const refreshData = async () => {
  isLoading.value = true
  try {
    analytics.value = await getCampaignAnalytics(campaignId)
    campaign.value = analytics.value.campaign
  }
  catch (error) {
    console.error('خطا در بروزرسانی داده‌ها:', error)
  }
  finally {
    isLoading.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'draft': return 'warning'
    case 'scheduled': return 'info'
    case 'paused': return 'muted'
    case 'completed': return 'primary'
    default: return 'muted'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'draft': return 'پیش‌نویس'
    case 'scheduled': return 'زمان‌بندی شده'
    case 'paused': return 'متوقف'
    case 'completed': return 'تکمیل شده'
    default: return 'نامشخص'
  }
}
</script>

<template>
  <div class="campaign-analytics bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 text-center">
        <p class="text-muted-500 dark:text-muted-400">
          در حال بارگذاری آنالیتیک...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="!campaign" class="py-12 text-center">
        <Icon name="ph:warning" class="text-muted-400 mx-auto mb-4 size-12" />
        <p class="text-muted-500 dark:text-muted-400 mb-4">
          کمپین یافت نشد
        </p>
        <BaseButton
          variant="outline"
          :to="'/admin/campaigns/dashboard'"
        >
          بازگشت به داشبورد
        </BaseButton>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Header -->
        <div class="mb-8 flex items-start justify-between">
          <div>
            <div class="mb-2 flex items-center gap-3">
              <BaseButton
                variant="outline"
                size="sm"
                :to="'/admin/campaigns/dashboard'"
              >
                <Icon name="ph:arrow-right" class="ml-1 size-4" />
                بازگشت
              </BaseButton>
              <h1 class="text-muted-900 text-3xl font-bold dark:text-white">
                {{ campaign.name }}
              </h1>
              <BaseBadge
                :color="getStatusColor(campaign.status)"
                size="sm"
              >
                {{ getStatusLabel(campaign.status) }}
              </BaseBadge>
            </div>
            <p class="text-muted-500 dark:text-muted-400">
              {{ campaign.description }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <BaseButton
              variant="outline"
              :loading="isLoading"
              @click="refreshData"
            >
              <Icon name="ph:arrow-clockwise" class="ml-2 size-4" />
              بروزرسانی
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportAnalytics"
            >
              <Icon name="ph:download" class="ml-2 size-4" />
              خروجی
            </BaseButton>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                  کل ارسال‌ها
                </p>
                <p class="text-muted-900 text-3xl font-bold dark:text-white">
                  {{ metrics?.sent_count.toLocaleString('fa-IR') }}
                </p>
                <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
                  از زمان شروع کمپین
                </p>
              </div>
              <div class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg">
                <Icon name="ph:paper-plane-tilt" class="text-primary-600 dark:text-primary-400 size-6" />
              </div>
            </div>
          </div>

          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                  نرخ تحویل
                </p>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                  {{ metrics?.delivery_rate }}%
                </p>
                <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
                  {{ metrics?.delivered_count.toLocaleString('fa-IR') }} تحویل شده
                </p>
              </div>
              <div class="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Icon name="ph:check" class="size-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                  نرخ بازدید
                </p>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {{ metrics?.open_rate }}%
                </p>
                <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
                  {{ metrics?.opened_count.toLocaleString('fa-IR') }} بازدید
                </p>
              </div>
              <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Icon name="ph:eye" class="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                  نرخ کلیک
                </p>
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {{ metrics?.click_rate }}%
                </p>
                <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
                  {{ metrics?.clicked_count.toLocaleString('fa-IR') }} کلیک
                </p>
              </div>
              <div class="flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Icon name="ph:cursor-click" class="size-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Performance Trend Chart -->
          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6 lg:col-span-2">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
                روند عملکرد
              </h3>
              <div class="flex items-center gap-2">
                <select
                  v-model="selectedTimeRange"
                  class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-700 dark:text-muted-300 rounded-lg border bg-white px-3 py-2 text-sm"
                >
                  <option value="7d">
                    ۷ روز گذشته
                  </option>
                  <option value="30d">
                    ۳۰ روز گذشته
                  </option>
                  <option value="90d">
                    ۹۰ روز گذشته
                  </option>
                  <option value="all">
                    همه زمان‌ها
                  </option>
                </select>
              </div>
            </div>

            <div class="h-80">
              <!-- Chart component would go here -->
              <div class="bg-muted-100 dark:bg-muted-700 flex h-full items-center justify-center rounded-lg">
                <p class="text-muted-500 dark:text-muted-400 text-sm">
                  نمودار روند عملکرد (نیاز به کتابخانه Chart.js)
                </p>
              </div>
            </div>
          </div>

          <!-- Engagement Rates -->
          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <h3 class="text-muted-900 mb-6 text-lg font-semibold dark:text-white">
              نرخ‌های تعامل
            </h3>

            <div class="h-80">
              <!-- Pie chart component would go here -->
              <div class="bg-muted-100 dark:bg-muted-700 flex h-full items-center justify-center rounded-lg">
                <p class="text-muted-500 dark:text-muted-400 text-center text-sm">
                  نمودار دایره‌ای نرخ‌های تعامل<br>
                  (نیاز به کتابخانه Chart.js)
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Analytics -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Performance Breakdown -->
          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <h3 class="text-muted-900 mb-6 text-lg font-semibold dark:text-white">
              تجزیه عملکرد
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  نرخ موفقیت ارسال
                </span>
                <div class="flex items-center gap-2">
                  <div class="bg-muted-200 dark:bg-muted-700 h-2 w-24 rounded-full">
                    <div
                      class="h-2 rounded-full bg-green-500"
                      :style="{ width: `${metrics?.delivery_rate || 0}%` }"
                    />
                  </div>
                  <span class="text-muted-900 text-sm font-medium dark:text-white">
                    {{ metrics?.delivery_rate }}%
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  نرخ بازدید
                </span>
                <div class="flex items-center gap-2">
                  <div class="bg-muted-200 dark:bg-muted-700 h-2 w-24 rounded-full">
                    <div
                      class="h-2 rounded-full bg-blue-500"
                      :style="{ width: `${metrics?.open_rate || 0}%` }"
                    />
                  </div>
                  <span class="text-muted-900 text-sm font-medium dark:text-white">
                    {{ metrics?.open_rate }}%
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  نرخ کلیک
                </span>
                <div class="flex items-center gap-2">
                  <div class="bg-muted-200 dark:bg-muted-700 h-2 w-24 rounded-full">
                    <div
                      class="h-2 rounded-full bg-purple-500"
                      :style="{ width: `${metrics?.click_rate || 0}%` }"
                    />
                  </div>
                  <span class="text-muted-900 text-sm font-medium dark:text-white">
                    {{ metrics?.click_rate }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaign Details -->
          <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
            <h3 class="text-muted-900 mb-6 text-lg font-semibold dark:text-white">
              جزئیات کمپین
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  تاریخ ایجاد
                </span>
                <span class="text-muted-900 text-sm font-medium dark:text-white">
                  {{ new Date(campaign.created).toLocaleDateString('fa-IR') }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  آخرین بروزرسانی
                </span>
                <span class="text-muted-900 text-sm font-medium dark:text-white">
                  {{ new Date(campaign.updated).toLocaleDateString('fa-IR') }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  تعداد گروه‌های هدف
                </span>
                <span class="text-muted-900 text-sm font-medium dark:text-white">
                  {{ campaign.target_groups.length }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  نوع زمان‌بندی
                </span>
                <span class="text-muted-900 text-sm font-medium dark:text-white">
                  {{ campaign.schedule.type === 'immediate' ? 'فوری' :
                    campaign.schedule.type === 'scheduled' ? 'زمان‌بندی شده' : 'تکراری' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
