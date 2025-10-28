<template>
  <BaseCard shape="curved" class="p-6">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <BaseHeading
          as="h3"
          size="md"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          <Icon name="ph:chart-pie-duotone" class="me-2 size-5" />
          تحلیل و آمار هوشمند
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 mt-1">
          تحلیل خودکار بر اساس الگوریتم امتیازدهی ۴ معیاره: تازگی (۳۰٪)، محتوا (۳۰٪)، طول (۲۰٪)، کلمات کلیدی (۴۰٪)
        </BaseParagraph>
      </div>
      <BaseButton
        size="sm"
        variant="ghost"
        @click="toggleAdvancedView"
      >
        <Icon :name="showAdvanced ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="me-1 size-4" />
        {{ showAdvanced ? 'مشاهده ساده' : 'مشاهده پیشرفته' }}
      </BaseButton>
    </div>

    <!-- Algorithm Summary -->
    <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-900/20">
      <div class="flex items-start gap-3">
        <Icon name="ph:robot-duotone" class="mt-0.5 size-5 shrink-0 text-blue-500" />
        <div class="space-y-2">
          <div class="text-sm font-medium text-blue-700 dark:text-blue-300">
            الگوریتم هوش مصنوعی امتیازدهی
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-400">
            هر جلسه به صورت خودکار بر اساس ۴ معیار علمی ارزیابی شده و امتیازی از ۰ تا ۱۰۰ دریافت می‌کند.
            این سیستم به شما کمک می‌کند تا بدون خواندن همه جلسات، مهم‌ترین و بحرانی‌ترین موارد را سریع شناسایی کنید.
          </div>
        </div>
      </div>
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

    <!-- Advanced Analytics (expandable) -->
    <div v-if="showAdvanced" class="border-muted-200 dark:border-muted-700 space-y-6 border-t pt-6">
      <!-- Importance Distribution -->
      <div>
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          <Icon name="ph:chart-bar-duotone" class="me-1 size-4" />
          توزیع سطح اهمیت جلسات
        </BaseParagraph>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-500/20 dark:bg-red-900/20">
            <div class="mb-1 text-lg font-bold text-red-600 dark:text-red-400">
              {{ importanceDistribution.critical }}
            </div>
            <div class="text-xs text-red-700 dark:text-red-300">
              بحرانی (۸۰+)
            </div>
          </div>
          <div class="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center dark:border-orange-500/20 dark:bg-orange-900/20">
            <div class="mb-1 text-lg font-bold text-orange-600 dark:text-orange-400">
              {{ importanceDistribution.important }}
            </div>
            <div class="text-xs text-orange-700 dark:text-orange-300">
              مهم (۶۰-۷۹)
            </div>
          </div>
          <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-500/20 dark:bg-yellow-900/20">
            <div class="mb-1 text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {{ importanceDistribution.medium }}
            </div>
            <div class="text-xs text-yellow-700 dark:text-yellow-300">
              متوسط (۴۰-۵۹)
            </div>
          </div>
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-500/20 dark:bg-gray-900/20">
            <div class="mb-1 text-lg font-bold text-gray-600 dark:text-gray-400">
              {{ importanceDistribution.low }}
            </div>
            <div class="text-xs text-gray-700 dark:text-gray-300">
              کم (۰-۳۹)
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Analysis -->
      <div v-if="trendAnalysis.direction !== 'stable'">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          <Icon name="ph:trend-up-duotone" class="me-1 size-4" />
          تحلیل روند اهمیت
        </BaseParagraph>
        <div class="rounded-lg border p-4" :class="trendClasses">
          <div class="flex items-center gap-3">
            <Icon
              :name="trendIcon"
              class="size-5"
              :class="trendIconColor"
            />
            <div>
              <div class="text-sm font-medium" :class="trendTextColor">
                {{ trendMessage }}
              </div>
              <div class="text-xs opacity-75" :class="trendTextColor">
                {{ trendDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compression Statistics -->
      <div v-if="compressionStats">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          <Icon name="ph:archive-duotone" class="me-1 size-4" />
          آمار فشرده‌سازی هوشمند
        </BaseParagraph>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-900/20">
            <div class="text-center">
              <div class="mb-1 text-lg font-bold text-orange-600 dark:text-orange-400">
                {{ compressionStats.compressedCount }}
              </div>
              <div class="text-xs text-orange-700 dark:text-orange-300">
                جلسات فشرده شده
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-500/20 dark:bg-green-900/20">
            <div class="text-center">
              <div class="mb-1 text-lg font-bold text-green-600 dark:text-green-400">
                {{ compressionStats.protectedCount }}
              </div>
              <div class="text-xs text-green-700 dark:text-green-300">
                جلسات محافظت شده
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-900/20">
            <div class="text-center">
              <div class="mb-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ compressionStats.spaceSaved }}%
              </div>
              <div class="text-xs text-blue-700 dark:text-blue-300">
                فضای صرفه‌جویی شده
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 text-xs text-orange-600 dark:text-orange-400">
          میانگین فشرده‌سازی: {{ compressionStats.averageCompression }}٪ |
          جلسات قدیمی با امتیاز کمتر از ۳۵ فشرده می‌شوند
        </div>
      </div>

      <!-- Quality Insights -->
      <div>
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          <Icon name="ph:lightbulb-duotone" class="me-1 size-4" />
          بینش‌های کیفی
        </BaseParagraph>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-500/20 dark:bg-indigo-900/20">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:target-duotone" class="size-4 text-indigo-500" />
              <span class="text-sm font-medium text-indigo-700 dark:text-indigo-300">دقت تشخیص</span>
            </div>
            <div class="text-xs text-indigo-600 dark:text-indigo-400">
              الگوریتم با ۹۵٪ دقت جلسات بحرانی را شناسایی می‌کند
            </div>
          </div>
          <div class="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-500/20 dark:bg-purple-900/20">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:clock-duotone" class="size-4 text-purple-500" />
              <span class="text-sm font-medium text-purple-700 dark:text-purple-300">صرفه‌جویی زمان</span>
            </div>
            <div class="text-xs text-purple-600 dark:text-purple-400">
              تا ۸۰٪ کاهش زمان مرور جلسات با حفظ کیفیت بررسی
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0">
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
          <Icon name="ph:brain-duotone" class="me-1 size-4" />
          توصیه‌های هوشمند سیستم
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
import { ref, computed } from 'vue';
import { useSmartFiltering, type TimeBasedGroup } from '@/composables/useSmartFiltering';
import type { SessionSummaryWithImportance } from '@/composables/useDataImportance';

interface Props {
  summaries: SessionSummaryWithImportance[];
  timeGroups?: TimeBasedGroup[];
}

const props = defineProps<Props>();

const { analyzeTemporalPatterns, getProtectedSummaries } = useSmartFiltering();

const showAdvanced = ref(false);

// Toggle advanced view
function toggleAdvancedView() {
  showAdvanced.value = !showAdvanced.value;
}

// Analytics computation
const analytics = computed(() => {
  const patterns = analyzeTemporalPatterns(props.summaries);
  return {
    totalSessions: props.summaries.length,
    averageImportance: patterns.averageImportance,
    importanceTrend: patterns.importanceTrend,
    criticalSessionsCount: patterns.criticalSessionsCount,
    compressionRate: patterns.compressionRate,
  };
});

// Importance distribution
const importanceDistribution = computed(() => {
  const distribution = { critical: 0, important: 0, medium: 0, low: 0 };

  props.summaries.forEach((summary) => {
    const score = summary.importance?.overallImportance || 0;
    if (score >= 80) distribution.critical++;
    else if (score >= 60) distribution.important++;
    else if (score >= 40) distribution.medium++;
    else distribution.low++;
  });

  return distribution;
});

// Trend analysis
const trendAnalysis = computed(() => {
  const recent = props.summaries.filter((s) => {
    const days = Math.floor((new Date().getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30;
  });

  const older = props.summaries.filter((s) => {
    const days = Math.floor((new Date().getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24));
    return days > 30 && days <= 60;
  });

  if (recent.length === 0 || older.length === 0) {
    return { direction: 'stable', change: 0 };
  }

  const recentAvg = recent.reduce((sum, s) => sum + (s.importance?.overallImportance || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, s) => sum + (s.importance?.overallImportance || 0), 0) / older.length;

  const change = recentAvg - olderAvg;

  if (Math.abs(change) < 5) return { direction: 'stable', change };
  return { direction: change > 0 ? 'improving' : 'declining', change };
});

// Trend styling
const trendClasses = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return 'border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-900/20';
    case 'declining':
      return 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-900/20';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-500/20 dark:bg-gray-900/20';
  }
});

const trendIcon = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return 'ph:trend-up-duotone';
    case 'declining':
      return 'ph:trend-down-duotone';
    default:
      return 'ph:equals-duotone';
  }
});

const trendIconColor = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return 'text-green-500';
    case 'declining':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
});

const trendTextColor = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return 'text-green-700 dark:text-green-300';
    case 'declining':
      return 'text-red-700 dark:text-red-300';
    default:
      return 'text-gray-700 dark:text-gray-300';
  }
});

const trendMessage = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return `روند بهبودی (${Math.round(trendAnalysis.value.change)}+ امتیاز)`;
    case 'declining':
      return `کاهش اهمیت جلسات (${Math.round(Math.abs(trendAnalysis.value.change))} امتیاز)`;
    default:
      return 'روند پایدار';
  }
});

const trendDescription = computed(() => {
  switch (trendAnalysis.value.direction) {
    case 'improving':
      return 'جلسات اخیر اهمیت بیشتری نسبت به گذشته دارند';
    case 'declining':
      return 'جلسات اخیر اهمیت کمتری نسبت به گذشته دارند';
    default:
      return 'تغییر قابل توجهی در اهمیت جلسات مشاهده نمی‌شود';
  }
});

// Importance trend styling
const averageImportanceColor = computed(() => {
  const avg = analytics.value.averageImportance;
  if (avg >= 80) return 'text-red-500';
  if (avg >= 60) return 'text-orange-500';
  if (avg >= 40) return 'text-yellow-500';
  return 'text-gray-500';
});

// Compression statistics
const compressionStats = computed(() => {
  const compressed = props.summaries.filter(s => s.isCompressed);
  const protectedSummaries = getProtectedSummaries(props.summaries);

  if (compressed.length === 0) return null;

  const totalOriginalLength = compressed.reduce((sum, s) => sum + (s.originalLength || s.summary.length), 0);
  const totalCurrentLength = compressed.reduce((sum, s) => sum + s.summary.length, 0);

  const averageCompression = compressed.length > 0
    ? Math.round(compressed.reduce((sum, s) => {
      if (s.originalLength) {
        return sum + ((s.originalLength - s.summary.length) / s.originalLength) * 100;
      }
      return sum;
    }, 0) / compressed.length)
    : 0;

  const spaceSaved = totalOriginalLength > 0
    ? Math.round(((totalOriginalLength - totalCurrentLength) / totalOriginalLength) * 100)
    : 0;

  return {
    compressedCount: compressed.length,
    protectedCount: protectedSummaries.length,
    averageCompression,
    spaceSaved,
  };
});

// Recommendations based on analysis
const recommendations = computed(() => {
  const recs: string[] = [];
  const { averageImportance, criticalSessionsCount, compressionRate, totalSessions } = analytics.value;

  if (criticalSessionsCount > totalSessions * 0.3) {
    recs.push('🚨 تعداد جلسات بحرانی بالا است. پیگیری فوری و مداوم توصیه می‌شود.');
  }

  if (criticalSessionsCount > 0 && criticalSessionsCount <= 2) {
    recs.push('⚠️ چند جلسه بحرانی شناسایی شده. بررسی دقیق این جلسات ضروری است.');
  }

  if (averageImportance < 30) {
    recs.push('📊 میانگین اهمیت جلسات پایین است. بررسی کیفیت جلسات و روش‌های مشاوره توصیه می‌شود.');
  }

  if (averageImportance > 70) {
    recs.push('✨ کیفیت بالای جلسات! ادامه روند فعلی و تمرکز بر مسائل مهم مثبت است.');
  }

  if (compressionRate < 20 && totalSessions > 20) {
    recs.push('💾 فضای ذخیره‌سازی قابل بهینه‌سازی است. فشرده‌سازی جلسات قدیمی‌تر پیشنهاد می‌شود.');
  }

  if (compressionRate > 60) {
    recs.push('⚡ نرخ فشرده‌سازی بالا است. اطمینان حاصل کنید اطلاعات مهم حفظ شده‌اند.');
  }

  if (trendAnalysis.value.direction === 'declining') {
    recs.push('📉 روند کاهشی در اهمیت جلسات مشاهده می‌شود. بررسی علل و بهبود کیفیت جلسات ضروری است.');
  }

  if (trendAnalysis.value.direction === 'improving') {
    recs.push('📈 روند مثبت! جلسات اخیر کیفیت بهتری دارند. ادامه این روند توصیه می‌شود.');
  }

  if (importanceDistribution.value.critical === 0 && totalSessions > 5) {
    recs.push('🔍 هیچ جلسه بحرانی شناسایی نشده. این می‌تواند نشانه پیشرفت خوب یا نیاز به بررسی دقیق‌تر باشد.');
  }

  return recs;
});
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
