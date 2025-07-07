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
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-muted-500">تازگی:</span>
            <span class="font-medium">{{ summary.importance?.recency || 0 }}/100</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-500">محتوا:</span>
            <span class="font-medium">{{ summary.importance?.contentScore || 0 }}/100</span>
          </div>
        </div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-muted-500">طول:</span>
            <span class="font-medium">{{ summary.importance?.lengthScore || 0 }}/100</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-500">کلمات کلیدی:</span>
            <span class="font-medium">{{ summary.importance?.keywordScore || 0 }}/100</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle details button -->
    <button
      class="text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 absolute bottom-2 right-2 transition-colors duration-300"
      @click="showDetails = !showDetails"
    >
      <Icon :name="showDetails ? 'ph:caret-up-duotone' : 'ph:info-duotone'" class="size-4" />
    </button>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SessionSummaryWithImportance } from '@/composables/useDataImportance'

interface Props {
  summary: SessionSummaryWithImportance
}

interface Emits {
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDetails = ref(false)

// Computed properties for importance display
const importanceScore = computed(() => {
  return Math.round(props.summary.importance?.overallImportance || 0)
})

const importanceLevel = computed(() => {
  const score = importanceScore.value
  if (score >= 80) return 'بحرانی'
  if (score >= 60) return 'مهم'
  if (score >= 40) return 'متوسط'
  return 'کم'
})

const importanceIcon = computed(() => {
  const score = importanceScore.value
  if (score >= 80) return 'ph:warning-duotone'
  if (score >= 60) return 'ph:star-duotone'
  if (score >= 40) return 'ph:circle-duotone'
  return 'ph:minus-circle-duotone'
})

const importanceColorClass = computed(() => {
  const score = importanceScore.value
  if (score >= 80) return 'border-red-200 dark:border-red-500/20 border-2'
  if (score >= 60) return 'border-orange-200 dark:border-orange-500/20 border-2'
  if (score >= 40) return 'border-yellow-200 dark:border-yellow-500/20 border-2'
  return 'border-gray-200 dark:border-gray-500/20 border-2'
})

const importanceBadgeClass = computed(() => {
  const score = importanceScore.value
  if (score >= 80) return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  if (score >= 60) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
})

const importanceTitleClass = computed(() => {
  const score = importanceScore.value
  if (score >= 80) return 'text-red-600 dark:text-red-400'
  if (score >= 60) return 'text-orange-600 dark:text-orange-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-gray-600 dark:text-gray-400'
})

// Recency calculation
const recencyDays = computed(() => {
  if (!props.summary.date) return null
  const sessionDate = new Date(props.summary.date)
  const now = new Date()
  return Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
})

const recencyText = computed(() => {
  const days = recencyDays.value
  if (days === null) return ''

  if (days === 0) return 'امروز'
  if (days === 1) return 'دیروز'
  if (days <= 7) return `${days} روز پیش`
  if (days <= 30) return `${Math.floor(days / 7)} هفته پیش`
  if (days <= 365) return `${Math.floor(days / 30)} ماه پیش`
  return `${Math.floor(days / 365)} سال پیش`
})

// Compression ratio calculation
const compressionRatio = computed(() => {
  if (!props.summary.isCompressed || !props.summary.originalLength) return 0
  const ratio = ((props.summary.originalLength - props.summary.summary.length) / props.summary.originalLength) * 100
  return Math.round(ratio)
})

// Format date function
function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
