<script setup lang="ts">
import type { ProfileAnalytics } from '~/types/hammasir'

interface MetricCard {
  id: string
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  icon: string
  color: string
  description?: string
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
  }>
}

interface Props {
  analytics: ProfileAnalytics
  timeRange?: 'week' | 'month' | 'quarter' | 'year'
  showCharts?: boolean
  compact?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'time-range-change', range: string): void
  (e: 'refresh'): void
  (e: 'export', format: 'pdf' | 'csv' | 'json'): void
}

const props = withDefaults(defineProps<Props>(), {
  timeRange: 'month',
  showCharts: true,
  compact: false,
  loading: false,
})

const emit = defineEmits<Emits>()

// Time range options
const timeRangeOptions = [
  { value: 'week', label: 'هفته گذشته' },
  { value: 'month', label: 'ماه گذشته' },
  { value: 'quarter', label: 'سه ماه گذشته' },
  { value: 'year', label: 'سال گذشته' }
]

// Generate metric cards from analytics data
const metricCards = computed<MetricCard[]>(() => {
  if (!props.analytics) return []

  return [
    {
      id: 'overall-score',
      title: 'امتیاز کلی',
      value: Math.round(props.analytics.overallScore * 100),
      icon: 'ph:chart-pie',
      color: 'blue',
      description: 'امتیاز کلی پروفایل بر اساس تکمیل بخش‌ها'
    },
    {
      id: 'completion-level',
      title: 'سطح تکمیل',
      value: `${props.analytics.completionLevel}%`,
      icon: 'ph:check-circle',
      color: 'green',
      description: 'درصد تکمیل اطلاعات پروفایل'
    },
    {
      id: 'matching-potential',
      title: 'پتانسیل انطباق',
      value: `${props.analytics.matchingPotential}%`,
      icon: 'ph:users',
      color: 'purple',
      description: 'احتمال یافتن انطباق مناسب'
    },
    {
      id: 'recommendations',
      title: 'توصیه‌ها',
      value: props.analytics.recommendationsCount,
      icon: 'ph:lightbulb',
      color: 'yellow',
      description: 'تعداد توصیه‌های فعال'
    },
    {
      id: 'sections-analyzed',
      title: 'بخش‌های تحلیل شده',
      value: props.analytics.sectionsAnalyzed,
      icon: 'ph:chart-line',
      color: 'indigo',
      description: 'تعداد بخش‌های تجزیه و تحلیل شده'
    },
    {
      id: 'data-quality',
      title: 'کیفیت داده‌ها',
      value: `${Math.round(props.analytics.dataQualityScore * 100)}%`,
      icon: 'ph:shield-check',
      color: 'teal',
      description: 'کیفیت و دقت اطلاعات وارد شده'
    }
  ]
})

// Generate completion breakdown chart data
const completionChartData = computed<ChartData>(() => {
  if (!props.analytics.sectionBreakdown) {
    return { labels: [], datasets: [] }
  }

  const breakdown = props.analytics.sectionBreakdown
  return {
    labels: ['اطلاعات شخصی', 'تحصیلات', 'شغل', 'مکان', 'ترجیحات'],
    datasets: [{
      label: 'درصد تکمیل',
      data: [
        breakdown.personalInfo || 0,
        breakdown.education || 0,
        breakdown.occupation || 0,
        breakdown.location || 0,
        breakdown.preferences || 0
      ],
      backgroundColor: [
        '#3B82F6', // blue
        '#10B981', // green
        '#8B5CF6', // purple
        '#F59E0B', // yellow
        '#EF4444'  // red
      ]
    }]
  }
})

// Generate matching trends data (mock data for demo)
const matchingTrendsData = computed<ChartData>(() => {
  // In real app, this would come from props.analytics
  const labels = ['هفته 1', 'هفته 2', 'هفته 3', 'هفته 4']
  return {
    labels,
    datasets: [{
      label: 'پتانسیل انطباق',
      data: [65, 72, 78, props.analytics.matchingPotential],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 2
    }]
  }
})

// Get metric color classes
const getMetricColor = (color: string) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30',
    teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30'
  }
  return colors[color as keyof typeof colors] || colors.blue
}

// Format change percentage
const formatChange = (change: { value: number; type: string }) => {
  const sign = change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''
  return `${sign}${Math.abs(change.value)}%`
}

// Handle time range change
const handleTimeRangeChange = (range: string) => {
  emit('time-range-change', range)
}

// Handle export
const handleExport = (format: 'pdf' | 'csv' | 'json') => {
  emit('export', format)
}

// Generate insights based on analytics
const insights = computed(() => {
  if (!props.analytics) return []
  
  const insights = []
  
  // Profile completion insights
  if (props.analytics.completionLevel < 80) {
    insights.push({
      type: 'warning',
      title: 'تکمیل پروفایل',
      message: 'با تکمیل بخش‌های باقی‌مانده، پتانسیل انطباق‌یابی شما تا 25% افزایش می‌یابد.',
      action: 'تکمیل پروفایل'
    })
  }
  
  // Matching potential insights
  if (props.analytics.matchingPotential > 80) {
    insights.push({
      type: 'success',
      title: 'پتانسیل بالا',
      message: 'پتانسیل انطباق‌یابی شما در سطح عالی قرار دارد. احتمال یافتن انطباق مناسب بسیار بالاست.',
      action: 'مشاهده انطباق‌ها'
    })
  } else if (props.analytics.matchingPotential < 50) {
    insights.push({
      type: 'info',
      title: 'بهبود انطباق‌یابی',
      message: 'با بهبود کیفیت اطلاعات و تکمیل بخش‌های اختیاری می‌توانید پتانسیل خود را افزایش دهید.',
      action: 'نکات بهبود'
    })
  }
  
  // Data quality insights
  if (props.analytics.dataQualityScore < 0.7) {
    insights.push({
      type: 'warning',
      title: 'کیفیت داده‌ها',
      message: 'برخی از اطلاعات وارد شده نیاز به بازنگری دارند. بهبود کیفیت داده‌ها دقت تحلیل‌ها را افزایش می‌دهد.',
      action: 'بررسی اطلاعات'
    })
  }
  
  return insights
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <BaseHeading as="h2" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
          تجزیه و تحلیل پروفایل
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400">
          آمار تفصیلی و بینش‌های شخصی‌سازی شده
        </BaseParagraph>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Time Range Selector -->
        <BaseSelect
          :model-value="timeRange"
          :options="timeRangeOptions"
          class="min-w-[140px]"
          @update:model-value="handleTimeRangeChange"
        />
        
        <!-- Refresh Button -->
        <BaseButton
          variant="outline"
          size="sm"
          :loading="loading"
          @click="emit('refresh')"
        >
          <Icon name="ph:arrow-clockwise" class="w-4 h-4" />
        </BaseButton>
        
        <!-- Export Dropdown -->
        <BaseDropdown>
          <template #trigger>
            <BaseButton variant="outline" size="sm">
              <Icon name="ph:download" class="w-4 h-4 me-2" />
              خروجی
            </BaseButton>
          </template>
          
          <template #content>
            <div class="py-2">
              <button
                v-for="format in [
                  { value: 'pdf', label: 'فایل PDF', icon: 'ph:file-pdf' },
                  { value: 'csv', label: 'فایل CSV', icon: 'ph:file-csv' },
                  { value: 'json', label: 'فایل JSON', icon: 'ph:brackets-curly' }
                ]"
                :key="format.value"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="handleExport(format.value as 'pdf' | 'csv' | 'json')"
              >
                <Icon :name="format.icon" class="w-4 h-4 me-3" />
                {{ format.label }}
              </button>
            </div>
          </template>
        </BaseDropdown>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="animate-pulse">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="metric in metricCards"
          :key="metric.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="`w-12 h-12 rounded-xl flex items-center justify-center ${getMetricColor(metric.color)}`">
              <Icon :name="metric.icon" class="w-6 h-6" />
            </div>
            
            <!-- Change Indicator -->
            <div v-if="metric.change" class="text-right">
              <div
                :class="`text-sm font-medium ${
                  metric.change.type === 'increase' ? 'text-green-600' : 
                  metric.change.type === 'decrease' ? 'text-red-600' : 
                  'text-gray-600'
                }`"
              >
                {{ formatChange(metric.change) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ metric.change.period }}</div>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {{ metric.value }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ metric.title }}
            </div>
          </div>
          
          <div v-if="metric.description" class="text-xs text-gray-500 dark:text-gray-400">
            {{ metric.description }}
          </div>
        </div>
      </div>

      <!-- Insights Section -->
      <div v-if="insights.length > 0" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <Icon name="ph:lightbulb" class="w-5 h-5 text-yellow-500 me-2" />
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
            بینش‌های شخصی
          </BaseHeading>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="(insight, index) in insights"
            :key="index"
            :class="`rounded-lg p-4 border ${
              insight.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
              insight.type === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
              'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
            }`"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div :class="`font-medium mb-1 ${
                  insight.type === 'success' ? 'text-green-800 dark:text-green-200' :
                  insight.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                  insight.type === 'error' ? 'text-red-800 dark:text-red-200' :
                  'text-blue-800 dark:text-blue-200'
                }`">
                  {{ insight.title }}
                </div>
                <div :class="`text-sm ${
                  insight.type === 'success' ? 'text-green-700 dark:text-green-300' :
                  insight.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                  insight.type === 'error' ? 'text-red-700 dark:text-red-300' :
                  'text-blue-700 dark:text-blue-300'
                }`">
                  {{ insight.message }}
                </div>
              </div>
              
              <BaseButton
                size="xs"
                variant="outline"
                :class="`ms-3 ${
                  insight.type === 'success' ? 'border-green-300 text-green-700 hover:bg-green-100' :
                  insight.type === 'warning' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' :
                  insight.type === 'error' ? 'border-red-300 text-red-700 hover:bg-red-100' :
                  'border-blue-300 text-blue-700 hover:bg-blue-100'
                }`"
              >
                {{ insight.action }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="showCharts && !compact" class="grid lg:grid-cols-2 gap-6">
        <!-- Completion Breakdown Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            تفکیک تکمیل بخش‌ها
          </BaseHeading>
          
          <!-- Simple Progress Bars (instead of chart library) -->
          <div class="space-y-4">
            <div v-for="(label, index) in completionChartData.labels" :key="label" class="flex items-center">
              <div class="w-24 text-sm text-gray-600 dark:text-gray-400 me-4">{{ label }}</div>
              <div class="flex-1">
                <HammasirCommonProgressBar
                  :value="completionChartData.datasets[0].data[index]"
                  size="sm"
                  :variant="index % 2 === 0 ? 'blue' : 'green'"
                />
              </div>
              <div class="w-12 text-sm text-gray-600 dark:text-gray-400 ms-3 text-left">
                {{ completionChartData.datasets[0].data[index] }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Matching Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            روند پتانسیل انطباق‌یابی
          </BaseHeading>
          
          <!-- Simple Line Visualization -->
          <div class="space-y-3">
            <div v-for="(label, index) in matchingTrendsData.labels" :key="label" class="flex items-center">
              <div class="w-16 text-sm text-gray-600 dark:text-gray-400 me-4">{{ label }}</div>
              <div class="flex-1 flex items-center">
                <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 flex-1 me-3">
                  <div 
                    class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    :style="`width: ${matchingTrendsData.datasets[0].data[index]}%`"
                  ></div>
                </div>
                <div class="w-12 text-sm font-medium text-purple-600 text-left">
                  {{ matchingTrendsData.datasets[0].data[index] }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div v-if="!compact" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
          جزئیات تحلیل
        </BaseHeading>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Section Quality Scores -->
          <div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">کیفیت بخش‌ها</div>
            <div class="space-y-3">
              <div v-for="section in [
                { name: 'اطلاعات شخصی', score: 0.95 },
                { name: 'تحصیلات', score: 0.88 },
                { name: 'سوابق شغلی', score: 0.82 },
                { name: 'مکان', score: 0.76 },
                { name: 'ترجیحات', score: 0.91 }
              ]" :key="section.name" class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ section.name }}</span>
                <div class="flex items-center">
                  <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full me-2">
                    <div 
                      class="h-2 rounded-full transition-all"
                      :class="section.score > 0.8 ? 'bg-green-500' : section.score > 0.6 ? 'bg-yellow-500' : 'bg-red-500'"
                      :style="`width: ${section.score * 100}%`"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-8 text-left">
                    {{ Math.round(section.score * 100) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Activity Summary -->
          <div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">فعالیت اخیر</div>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">آخرین به‌روزرسانی</span>
                <span class="text-sm text-gray-800 dark:text-white">2 روز پیش</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">تعداد تغییرات</span>
                <span class="text-sm text-gray-800 dark:text-white">8</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">بازدید پروفایل</span>
                <span class="text-sm text-gray-800 dark:text-white">12</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">پیشنهادات جدید</span>
                <span class="text-sm text-gray-800 dark:text-white">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>