<template>
  <BaseCard
    shape="rounded"
    :class="[
      'relative p-5 transition-all duration-300 hover:shadow-lg',
      importanceColorClass,
      { 'opacity-75': summary.isCompressed }
    ]"
  >
    <!-- Importance Badge -->
    <div class="absolute left-2 top-2 flex items-center gap-2">
      <div
        :class="[
          'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
          importanceBadgeClass
        ]"
      >
        <Icon :name="importanceIcon" class="size-3" />
        <span>{{ importanceLevel }}</span>
        <span class="opacity-75">({{ importanceScore }})</span>
      </div>

      <!-- Compression indicator -->
      <div
        v-if="summary.isCompressed"
        v-tooltip="'این خلاصه فشرده شده است'"
        class="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-600 dark:bg-orange-900 dark:text-orange-400"
      >
        <Icon name="ph:archive-duotone" class="size-3" />
        <span>فشرده</span>
      </div>
    </div>

    <!-- Delete button -->
    <button
      class="text-danger-500 hover:text-danger-600 dark:text-danger-400 dark:hover:text-danger-300 absolute bottom-2 left-2 transition-colors duration-300"
      @click.prevent="$emit('delete')"
    >
      <Icon name="ph:trash-duotone" class="size-5" />
    </button>

    <!-- Main Content -->
    <div class="mb-8 pr-20">
      <BaseHeading
        as="h4"
        size="sm"
        weight="medium"
        lead="tight"
        :class="importanceTitleClass"
        class="mb-2"
      >
        {{ summary.title }}
      </BaseHeading>

      <!-- Session metadata -->
      <div class="my-2 flex flex-wrap gap-4">
        <span v-if="summary.date" class="text-muted-500 dark:text-muted-400 flex items-center gap-1 text-xs">
          <Icon name="ph:calendar-duotone" class="size-3" />
          تاریخ: {{ formatDate(summary.date) }}
        </span>
        <span v-if="summary.duration" class="text-muted-500 dark:text-muted-400 flex items-center gap-1 text-xs">
          <Icon name="ph:clock-duotone" class="size-3" />
          مدت: {{ summary.duration }} دقیقه
        </span>
        <span v-if="recencyDays !== null" class="text-muted-500 dark:text-muted-400 flex items-center gap-1 text-xs">
          <Icon name="ph:timer-duotone" class="size-3" />
          {{ recencyText }}
        </span>
      </div>

      <!-- Summary content -->
      <BaseText
        size="sm"
        class="text-muted-700 dark:text-muted-300 mb-2 leading-relaxed"
      >
        {{ summary.summary }}
      </BaseText>

      <!-- Compression info -->
      <div v-if="summary.isCompressed && summary.originalLength" class="text-muted-500 mt-2 text-xs">
        <Icon name="ph:info-duotone" class="me-1 size-3" />
        محتوا از {{ summary.originalLength }} کاراکتر به {{ summary.summary.length }} کاراکتر فشرده شد
        ({{ compressionRatio }}% فشرده‌سازی)
      </div>
    </div>

    <!-- Importance Details (Expandable) -->
    <div v-if="showDetails" class="border-muted-200 dark:border-muted-700 mt-3 border-t pt-3">
      <div class="mb-3">
        <BaseText size="xs" class="text-muted-600 dark:text-muted-400 font-medium">
          <Icon name="ph:calculator-duotone" class="me-1 size-3" />
          جزئیات محاسبه امتیاز نهایی: {{ importanceScore }}
        </BaseText>
        <BaseText size="xs" class="text-muted-500 mt-1">
          امتیاز بر اساس فرمول علمی: (تازگی×۰.۳) + (محتوا×۰.۳) + (طول×۰.۲) + (کلیدی×۰.۴)
        </BaseText>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Recency Score with explanation -->
        <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-900/20">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ph:clock-duotone" class="size-4 text-blue-500" />
              <span class="text-xs font-medium text-blue-700 dark:text-blue-300">تازگی (وزن: ۳۰٪)</span>
            </div>
            <span class="text-xs font-semibold text-blue-700 dark:text-blue-300">
              {{ summary.importance?.recency || 0 }}/100
            </span>
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-400">
            <div class="mb-1 font-medium">
              {{ recencyExplanation }}
            </div>
            <div class="opacity-75">
              {{ recencyDetailsExplanation }}
            </div>
          </div>
        </div>

        <!-- Content Score with explanation -->
        <div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-500/20 dark:bg-green-900/20">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ph:text-aa-duotone" class="size-4 text-green-500" />
              <span class="text-xs font-medium text-green-700 dark:text-green-300">محتوا (وزن: ۳۰٪)</span>
            </div>
            <span class="text-xs font-semibold text-green-700 dark:text-green-300">
              {{ summary.importance?.contentScore || 0 }}/100
            </span>
          </div>
          <div class="text-xs text-green-600 dark:text-green-400">
            <div class="mb-1 font-medium">
              {{ contentExplanation }}
            </div>
            <div class="opacity-75">
              {{ contentDetailsExplanation }}
            </div>
          </div>
        </div>

        <!-- Length Score with explanation -->
        <div class="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-500/20 dark:bg-purple-900/20">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ph:ruler-duotone" class="size-4 text-purple-500" />
              <span class="text-xs font-medium text-purple-700 dark:text-purple-300">طول (وزن: ۲۰٪)</span>
            </div>
            <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
              {{ summary.importance?.lengthScore || 0 }}/100
            </span>
          </div>
          <div class="text-xs text-purple-600 dark:text-purple-400">
            <div class="mb-1 font-medium">
              {{ lengthExplanation }}
            </div>
            <div class="opacity-75">
              {{ lengthDetailsExplanation }}
            </div>
          </div>
        </div>

        <!-- Keyword Score with explanation -->
        <div class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-900/20">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ph:key-duotone" class="size-4 text-red-500" />
              <span class="text-xs font-medium text-red-700 dark:text-red-300">کلمات کلیدی (وزن: ۴۰٪)</span>
            </div>
            <span class="text-xs font-semibold text-red-700 dark:text-red-300">
              {{ summary.importance?.keywordScore || 0 }}/100
            </span>
          </div>
          <div class="text-xs text-red-600 dark:text-red-400">
            <div class="mb-1 font-medium">
              {{ keywordExplanation }}
            </div>
            <div class="opacity-75">
              {{ keywordDetailsExplanation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Final Calculation -->
      <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-500/20 dark:bg-gray-900/20">
        <div class="text-xs text-gray-600 dark:text-gray-400">
          <div class="mb-2 flex items-center gap-2 font-medium">
            <Icon name="ph:equals-duotone" class="size-3" />
            محاسبه نهایی با میانگین وزنی:
          </div>
          <div class="rounded bg-gray-100 p-2 font-mono dark:bg-gray-800">
            ({{ summary.importance?.recency || 0 }} × ۰.۳) +
            ({{ summary.importance?.contentScore || 0 }} × ۰.۳) +
            ({{ summary.importance?.lengthScore || 0 }} × ۰.۲) +
            ({{ summary.importance?.keywordScore || 0 }} × ۰.۴) =
            <span class="font-bold text-gray-800 dark:text-gray-200">{{ importanceScore }}</span>
          </div>
          <div class="mt-2 text-xs opacity-75">
            نتیجه: این جلسه در دسته <strong class="text-gray-700 dark:text-gray-300">{{ importanceLevel }}</strong> قرار می‌گیرد.
          </div>
        </div>
      </div>

      <!-- Actionable Insights -->
      <div v-if="actionableInsights.length > 0" class="mt-4">
        <div class="mb-2 flex items-center gap-2">
          <Icon name="ph:brain-duotone" class="size-3 text-indigo-500" />
          <BaseText size="xs" class="font-medium text-indigo-600 dark:text-indigo-400">
            بینش‌های عملی برای این جلسه:
          </BaseText>
        </div>
        <div class="space-y-1">
          <div
            v-for="(insight, index) in actionableInsights"
            :key="index"
            class="flex items-start gap-1 text-xs text-indigo-600 dark:text-indigo-400"
          >
            <Icon name="ph:arrow-circle-right-duotone" class="mt-0.5 size-3 shrink-0" />
            <span>{{ insight }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle details button -->
    <button
      v-tooltip="showDetails ? 'مخفی کردن جزئیات امتیازدهی' : 'نمایش جزئیات امتیازدهی'"
      class="text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 absolute bottom-2 right-2 transition-colors duration-300"
      @click="showDetails = !showDetails"
    >
      <Icon :name="showDetails ? 'ph:caret-up-duotone' : 'ph:info-duotone'" class="size-4" />
    </button>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SessionSummaryWithImportance } from '@/composables/useDataImportance';

interface Props {
  summary: SessionSummaryWithImportance;
}

interface Emits {
  (e: 'delete'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDetails = ref(false);

// Computed properties for importance display
const importanceScore = computed(() => {
  return Math.round(props.summary.importance?.overallImportance || 0);
});

const importanceLevel = computed(() => {
  const score = importanceScore.value;
  if (score >= 80) return 'بحرانی';
  if (score >= 60) return 'مهم';
  if (score >= 40) return 'متوسط';
  return 'کم';
});

const importanceIcon = computed(() => {
  const score = importanceScore.value;
  if (score >= 80) return 'ph:warning-duotone';
  if (score >= 60) return 'ph:star-duotone';
  if (score >= 40) return 'ph:circle-duotone';
  return 'ph:minus-circle-duotone';
});

const importanceColorClass = computed(() => {
  const score = importanceScore.value;
  if (score >= 80) return 'border-red-200 dark:border-red-500/20 border-2';
  if (score >= 60) return 'border-orange-200 dark:border-orange-500/20 border-2';
  if (score >= 40) return 'border-yellow-200 dark:border-yellow-500/20 border-2';
  return 'border-gray-200 dark:border-gray-500/20 border-2';
});

const importanceBadgeClass = computed(() => {
  const score = importanceScore.value;
  if (score >= 80) return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  if (score >= 60) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
});

const importanceTitleClass = computed(() => {
  const score = importanceScore.value;
  if (score >= 80) return 'text-red-600 dark:text-red-400';
  if (score >= 60) return 'text-orange-600 dark:text-orange-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-gray-600 dark:text-gray-400';
});

// Recency calculation
const recencyDays = computed(() => {
  if (!props.summary.date) return null;
  const sessionDate = new Date(props.summary.date);
  const now = new Date();
  return Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
});

const recencyText = computed(() => {
  const days = recencyDays.value;
  if (days === null) return '';

  if (days === 0) return 'امروز';
  if (days === 1) return 'دیروز';
  if (days <= 7) return `${days} روز پیش`;
  if (days <= 30) return `${Math.floor(days / 7)} هفته پیش`;
  if (days <= 365) return `${Math.floor(days / 30)} ماه پیش`;
  return `${Math.floor(days / 365)} سال پیش`;
});

// Compression ratio calculation
const compressionRatio = computed(() => {
  if (!props.summary.isCompressed || !props.summary.originalLength) return 0;
  const ratio = ((props.summary.originalLength - props.summary.summary.length) / props.summary.originalLength) * 100;
  return Math.round(ratio);
});

// Detailed explanations for importance scores
const recencyExplanation = computed(() => {
  const days = recencyDays.value;
  if (days === null) return 'تاریخ جلسه مشخص نیست';

  if (days <= 7) return `جلسه جدید (${days} روز پیش) - امتیاز کامل`;
  if (days <= 30) return `جلسه اخیر (${days} روز پیش) - امتیاز بالا`;
  if (days <= 90) return `جلسه متوسط (${days} روز پیش) - امتیاز متوسط`;
  if (days <= 180) return `جلسه قدیمی (${days} روز پیش) - امتیاز کم`;
  return `جلسه خیلی قدیمی (${days} روز پیش) - امتیاز پایین`;
});

const contentExplanation = computed(() => {
  const score = props.summary.importance?.contentScore || 0;
  const text = props.summary.summary.toLowerCase();

  // Count important keywords
  const importantKeywords = ['افسردگی', 'اضطراب', 'استرس', 'ترس', 'خشم', 'نگرانی', 'خانواده', 'ازدواج', 'طلاق', 'فرزند'];
  const keywordCount = importantKeywords.filter(keyword => text.includes(keyword)).length;

  if (score >= 80) return `محتوای غنی با ${keywordCount} کلمه کلیدی مهم`;
  if (score >= 60) return `محتوای خوب با ${keywordCount} کلمه کلیدی`;
  if (score >= 40) return `محتوای متوسط با ${keywordCount} کلمه کلیدی`;
  return `محتوای محدود - ${keywordCount} کلمه کلیدی یافت شد`;
});

const lengthExplanation = computed(() => {
  const length = props.summary.summary.length;
  const score = props.summary.importance?.lengthScore || 0;

  if (length < 50) return `متن کوتاه (${length} کاراکتر) - جزئیات محدود`;
  if (length <= 200) return `متن متوسط (${length} کاراکتر) - اطلاعات مناسب`;
  if (length <= 500) return `متن مفصل (${length} کاراکتر) - اطلاعات کامل`;
  return `متن جامع (${length} کاراکتر) - اطلاعات کامل`;
});

const keywordExplanation = computed(() => {
  const score = props.summary.importance?.keywordScore || 0;
  const text = props.summary.summary.toLowerCase();

  // Check for critical keywords
  const criticalKeywords = ['خودکشی', 'آسیب', 'خشونت', 'بحران', 'فوری'];
  const criticalFound = criticalKeywords.filter(keyword => text.includes(keyword));

  // Check for important keywords
  const importantKeywords = ['افسردگی', 'اضطراب', 'اعتیاد', 'خانواده'];
  const importantFound = importantKeywords.filter(keyword => text.includes(keyword));

  if (criticalFound.length > 0) {
    return `کلمات بحرانی یافت شد: ${criticalFound.join('، ')}`;
  }
  if (importantFound.length > 0) {
    return `کلمات مهم یافت شد: ${importantFound.join('، ')}`;
  }
  if (score > 0) {
    return 'کلمات کلیدی عمومی مشاوره یافت شد';
  }
  return 'هیچ کلمه کلیدی خاصی یافت نشد';
});

// Actionable insights
const actionableInsights = computed(() => {
  const insights: string[] = [];
  const score = importanceScore.value;

  if (score >= 80) {
    insights.push('این جلسه بسیار مهم و بحرانی است. باید به سراغ جلسات آینده بروید.');
  }
  else if (score >= 60) {
    insights.push('این جلسه مهم است. باید به سراغ جلسات آینده بروید.');
  }
  else if (score >= 40) {
    insights.push('این جلسه متوسط است. باید به سراغ جلسات آینده بروید.');
  }
  else {
    insights.push('این جلسه کم اهمیت است. باید به سراغ جلسات آینده بروید.');
  }

  if (summary.isCompressed) {
    insights.push('این خلاصه فشرده شده است. برای بهبود حافظه، می‌توانید محتوای جلسه را کاهش دهید.');
  }

  if (recencyDays.value === 0) {
    insights.push('این جلسه امروز رخ داده است. باید به سراغ جلسات آینده بروید.');
  }
  else if (recencyDays.value === 1) {
    insights.push('این جلسه دیروز رخ داده است. باید به سراغ جلسات آینده بروید.');
  }
  else if (recencyDays.value > 7) {
    insights.push('این جلسه چند روز پیش رخ داده است. باید به سراغ جلسات آینده بروید.');
  }

  if (keywordExplanation.value.includes('بحرانی')) {
    insights.push('این جلسه شامل کلمات بحرانی یافت. باید به سراغ جلسات آینده بروید.');
  }

  return insights;
});

// Detailed explanations for importance scores (expanded)
const recencyDetailsExplanation = computed(() => {
  const days = recencyDays.value;
  if (days === null) return 'تاریخ جلسه مشخص نیست';

  if (days <= 7) return 'جلسه جدید - امتیاز کامل';
  if (days <= 30) return 'جلسه اخیر - امتیاز بالا';
  if (days <= 90) return 'جلسه متوسط - امتیاز متوسط';
  if (days <= 180) return 'جلسه قدیمی - امتیاز کم';
  return 'جلسه خیلی قدیمی - امتیاز پایین';
});

const contentDetailsExplanation = computed(() => {
  const score = props.summary.importance?.contentScore || 0;
  const text = props.summary.summary.toLowerCase();

  // Count important keywords
  const importantKeywords = ['افسردگی', 'اضطراب', 'استرس', 'ترس', 'خشم', 'نگرانی', 'خانواده', 'ازدواج', 'طلاق', 'فرزند'];
  const keywordCount = importantKeywords.filter(keyword => text.includes(keyword)).length;

  if (score >= 80) return `محتوای غنی با ${keywordCount} کلمه کلیدی مهم`;
  if (score >= 60) return `محتوای خوب با ${keywordCount} کلمه کلیدی`;
  if (score >= 40) return `محتوای متوسط با ${keywordCount} کلمه کلیدی`;
  return `محتوای محدود - ${keywordCount} کلمه کلیدی یافت شد`;
});

const lengthDetailsExplanation = computed(() => {
  const length = props.summary.summary.length;
  const score = props.summary.importance?.lengthScore || 0;

  if (length < 50) return 'متن کوتاه - جزئیات محدود';
  if (length <= 200) return 'متن متوسط - اطلاعات مناسب';
  if (length <= 500) return 'متن مفصل - اطلاعات کامل';
  return 'متن جامع - اطلاعات کامل';
});

const keywordDetailsExplanation = computed(() => {
  const score = props.summary.importance?.keywordScore || 0;
  const text = props.summary.summary.toLowerCase();

  // Check for critical keywords
  const criticalKeywords = ['خودکشی', 'آسیب', 'خشونت', 'بحران', 'فوری'];
  const criticalFound = criticalKeywords.filter(keyword => text.includes(keyword));

  // Check for important keywords
  const importantKeywords = ['افسردگی', 'اضطراب', 'اعتیاد', 'خانواده'];
  const importantFound = importantKeywords.filter(keyword => text.includes(keyword));

  if (criticalFound.length > 0) {
    return `کلمات بحرانی یافت شد: ${criticalFound.join('، ')}`;
  }
  if (importantFound.length > 0) {
    return `کلمات مهم یافت شد: ${importantFound.join('، ')}`;
  }
  if (score > 0) {
    return 'کلمات کلیدی عمومی مشاوره یافت شد';
  }
  return 'هیچ کلمه کلیدی خاصی یافت نشد';
});

// Format date function
function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
/* Ensure proper RTL layout */
[dir="rtl"] .flex {
  direction: rtl;
}

/* Animation for importance indicator */
.importance-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Compressed content styling */
.opacity-75 {
  background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.05) 100%);
}
</style>
