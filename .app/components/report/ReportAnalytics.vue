<template>
  <BaseCard shape="curved" class="p-6">
    <div class="mb-4 flex items-center justify-between">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <Icon name="ph:chart-pie-duotone" class="me-2 size-5" />
        تحلیل و آمار
      </BaseHeading>
      <BaseButton
        size="sm"
        variant="ghost"
        @click="toggleAdvancedView"
      >
        <Icon :name="showAdvanced ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="me-1 size-4" />
        {{ showAdvanced ? 'مشاهده ساده' : 'مشاهده پیشرفته' }}
      </BaseButton>
    </div>

    <!-- Main Stats Grid -->
    <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <!-- Total Sessions -->
      <div class="text-center">
        <div class="text-primary-500 mb-1 text-2xl font-bold">
          {{ analytics.totalSessions }}
        </div>
        <div class="text-muted-500 text-xs">
          کل جلسات
        </div>
      </div>

      <!-- Average Importance -->
      <div class="text-center">
        <div class="mb-1 text-2xl font-bold" :class="averageImportanceColor">
          {{ Math.round(analytics.averageImportance) }}
        </div>
        <div class="text-muted-500 text-xs">
          میانگین اهمیت
        </div>
      </div>

      <!-- Critical Sessions -->
      <div class="text-center">
        <div class="mb-1 text-2xl font-bold text-red-500">
          {{ analytics.criticalSessionsCount }}
        </div>
        <div class="text-muted-500 text-xs">
          جلسات بحرانی
        </div>
      </div>

      <!-- Compression Rate -->
      <div class="text-center">
        <div class="mb-1 text-2xl font-bold text-orange-500">
          {{ Math.round(analytics.compressionRate) }}%
        </div>
        <div class="text-muted-500 text-xs">
          نرخ فشرده‌سازی
        </div>
      </div>
    </div>

    <!-- Importance Trend -->
    <div class="mb-6">
      <div class="mb-2 flex items-center justify-between">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 font-medium">
          روند اهمیت جلسات
        </BaseParagraph>
        <div class="flex items-center gap-1" :class="trendColorClass">
          <Icon :name="trendIcon" class="size-4" />
          <span class="text-sm font-medium">{{ trendText }}</span>
        </div>
      </div>
      <div class="bg-muted-100 dark:bg-muted-800 h-2 rounded-full">
        <div
          class="bg-primary-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${Math.max(analytics.averageImportance, 5)}%` }"
        />
      </div>
    </div>

    <!-- Advanced View -->
    <div v-if="showAdvanced" class="space-y-6">
      <!-- Time-based Groups -->
      <div v-if="timeGroups.length > 0">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          توزیع زمانی جلسات
        </BaseParagraph>
        <div class="space-y-3">
          <div
            v-for="group in timeGroups"
            :key="group.period"
            class="bg-muted-50 dark:bg-muted-800/50 rounded-lg p-3"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">
                {{ group.label }}
              </span>
              <div class="flex items-center gap-2">
                <span :class="getGroupImportanceColor(group.importance)" class="text-xs font-medium">
                  {{ getGroupImportanceLabel(group.importance) }}
                </span>
                <span class="text-muted-500 text-xs">
                  {{ group.items.length }} جلسه
                </span>
              </div>
            </div>
            <div class="bg-muted-200 dark:bg-muted-700 h-1 rounded-full">
              <div
                :class="getGroupProgressColor(group.importance)"
                class="h-1 rounded-full transition-all duration-500"
                :style="{ width: `${(group.items.length / analytics.totalSessions) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Importance Distribution -->
      <div>
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          توزیع اهمیت جلسات
        </BaseParagraph>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="level in importanceDistribution"
            :key="level.label"
            class="bg-muted-50 dark:bg-muted-800/50 rounded-lg p-3 text-center"
          >
            <div class="mb-1 text-lg font-bold" :class="level.color">
              {{ level.count }}
            </div>
            <div class="text-muted-500 text-xs">
              {{ level.label }}
            </div>
            <div class="text-muted-400 text-xs">
              ({{ level.percentage }}%)
            </div>
          </div>
        </div>
      </div>

      <!-- Compression Analysis -->
      <div v-if="compressionStats">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          تحلیل فشرده‌سازی
        </BaseParagraph>
        <div class="bg-muted-50 dark:bg-muted-800/50 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-muted-600 dark:text-muted-400">جلسات فشرده:</span>
                <span class="font-medium">{{ compressionStats.compressedCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-600 dark:text-muted-400">متوسط فشرده‌سازی:</span>
                <span class="font-medium">{{ compressionStats.averageCompression }}%</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-muted-600 dark:text-muted-400">جلسات محافظت شده:</span>
                <span class="font-medium">{{ compressionStats.protectedCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-600 dark:text-muted-400">صرفه‌جویی فضا:</span>
                <span class="font-medium text-green-600 dark:text-green-400">
                  {{ compressionStats.spaceSaved }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          توصیه‌های بهینه‌سازی
        </BaseParagraph>
        <div class="space-y-2">
          <div
            v-for="(recommendation, index) in recommendations"
            :key="index"
            class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-900/20"
          >
            <div class="flex items-start gap-3">
              <Icon name="ph:lightbulb-duotone" class="mt-0.5 size-4 shrink-0 text-blue-500" />
              <div class="text-sm text-blue-700 dark:text-blue-300">
                {{ recommendation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSmartFiltering, type TimeBasedGroup } from '@/composables/useSmartFiltering'
import type { SessionSummaryWithImportance } from '@/composables/useDataImportance'

interface Props {
  summaries: SessionSummaryWithImportance[]
  timeGroups?: TimeBasedGroup[]
}

const props = defineProps<Props>()

const { analyzeTemporalPatterns, getProtectedSummaries } = useSmartFiltering()

const showAdvanced = ref(false)

// Analytics computation
const analytics = computed(() => {
  const patterns = analyzeTemporalPatterns(props.summaries)
  return {
    totalSessions: props.summaries.length,
    averageImportance: patterns.averageImportance,
    importanceTrend: patterns.importanceTrend,
    criticalSessionsCount: patterns.criticalSessionsCount,
    compressionRate: patterns.compressionRate,
  }
})

// Importance trend styling
const trendColorClass = computed(() => {
  switch (analytics.value.importanceTrend) {
    case 'increasing':
      return 'text-green-600 dark:text-green-400'
    case 'decreasing':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-muted-500'
  }
})

const trendIcon = computed(() => {
  switch (analytics.value.importanceTrend) {
    case 'increasing':
      return 'ph:trend-up-duotone'
    case 'decreasing':
      return 'ph:trend-down-duotone'
    default:
      return 'ph:minus-duotone'
  }
})

const trendText = computed(() => {
  switch (analytics.value.importanceTrend) {
    case 'increasing':
      return 'افزایشی'
    case 'decreasing':
      return 'کاهشی'
    default:
      return 'ثابت'
  }
})

const averageImportanceColor = computed(() => {
  const avg = analytics.value.averageImportance
  if (avg >= 70) return 'text-red-500'
  if (avg >= 50) return 'text-orange-500'
  if (avg >= 30) return 'text-yellow-500'
  return 'text-green-500'
})

// Importance distribution
const importanceDistribution = computed(() => {
  const total = props.summaries.length
  if (total === 0) return []

  const levels = [
    { label: 'بحرانی', min: 80, max: 100, color: 'text-red-500', count: 0 },
    { label: 'مهم', min: 60, max: 79, color: 'text-orange-500', count: 0 },
    { label: 'متوسط', min: 40, max: 59, color: 'text-yellow-500', count: 0 },
    { label: 'کم', min: 0, max: 39, color: 'text-gray-500', count: 0 },
  ]

  props.summaries.forEach((summary) => {
    const importance = summary.importance?.overallImportance || 0
    const level = levels.find(l => importance >= l.min && importance <= l.max)
    if (level) level.count++
  })

  return levels.map(level => ({
    ...level,
    percentage: Math.round((level.count / total) * 100),
  }))
})

// Compression statistics
const compressionStats = computed(() => {
  const compressed = props.summaries.filter(s => s.isCompressed)
  const protectedSummaries = getProtectedSummaries(props.summaries)

  if (compressed.length === 0) return null

  const totalOriginalLength = compressed.reduce((sum, s) => sum + (s.originalLength || s.summary.length), 0)
  const totalCurrentLength = compressed.reduce((sum, s) => sum + s.summary.length, 0)

  const averageCompression = compressed.length > 0
    ? Math.round(compressed.reduce((sum, s) => {
      if (s.originalLength) {
        return sum + ((s.originalLength - s.summary.length) / s.originalLength) * 100
      }
      return sum
    }, 0) / compressed.length)
    : 0

  const spaceSaved = totalOriginalLength > 0
    ? Math.round(((totalOriginalLength - totalCurrentLength) / totalOriginalLength) * 100)
    : 0

  return {
    compressedCount: compressed.length,
    protectedCount: protectedSummaries.length,
    averageCompression,
    spaceSaved,
  }
})

// Recommendations based on analysis
const recommendations = computed(() => {
  const recs: string[] = []
  const { averageImportance, criticalSessionsCount, compressionRate, totalSessions } = analytics.value

  if (criticalSessionsCount > totalSessions * 0.3) {
    recs.push('تعداد جلسات بحرانی بالا است. پیگیری بیشتر توصیه می‌شود.')
  }

  if (averageImportance < 30) {
    recs.push('میانگین اهمیت جلسات پایین است. ممکن است نیاز به بازنگری در روش‌های مشاوره باشد.')
  }

  if (compressionRate < 20 && totalSessions > 20) {
    recs.push('می‌توانید با فشرده‌سازی جلسات قدیمی‌تر، فضای ذخیره‌سازی را بهینه کنید.')
  }

  if (compressionRate > 60) {
    recs.push('نرخ فشرده‌سازی بالا است. مطمئن شوید اطلاعات مهم حفظ شده‌اند.')
  }

  if (analytics.value.importanceTrend === 'decreasing') {
    recs.push('روند اهمیت جلسات کاهشی است. بررسی علل و بهبود کیفیت جلسات پیشنهاد می‌شود.')
  }

  return recs
})

function toggleAdvancedView() {
  showAdvanced.value = !showAdvanced.value
}

function getGroupImportanceColor(importance: string) {
  switch (importance) {
    case 'critical':
      return 'text-red-600 dark:text-red-400'
    case 'high':
      return 'text-orange-600 dark:text-orange-400'
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

function getGroupImportanceLabel(importance: string) {
  switch (importance) {
    case 'critical':
      return 'بحرانی'
    case 'high':
      return 'مهم'
    case 'medium':
      return 'متوسط'
    default:
      return 'کم'
  }
}

function getGroupProgressColor(importance: string) {
  switch (importance) {
    case 'critical':
      return 'bg-red-500'
    case 'high':
      return 'bg-orange-500'
    case 'medium':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
/* Smooth transitions for analytics */
.transition-all {
  transition: all 0.3s ease;
}

/* Progress bar animations */
.h-2, .h-1 {
  transition: width 0.5s ease-in-out;
}
</style>
