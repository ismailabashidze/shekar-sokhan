<script setup lang="ts">
definePageMeta({
  title: 'گزارش جلسات مشاوره',
  layout: 'sidebar',
  middleware: ['auth']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  userSessions, 
  isSessionsLoading, 
  sessionsError, 
  getUserSessions,
  generateSessionReport
} = useSessions()

const router = useRouter()
const route = useRoute()

const sessionId = ref('')
const isGenerating = ref(false)
const generatedReport = ref<any>(null)
const reportError = ref<string | null>(null)

onMounted(async () => {
  await loadSessions()
})

const loadSessions = async () => {
  try {
    await getUserSessions(1, 50)
  } catch (err: any) {
    console.error('Error loading sessions:', err)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const formatTime = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSessionStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'REQUESTED': 'درخواست داده شده',
    'ACCEPTED': 'پذیرفته شده',
    'REJECTED': 'رد شده',
    'CANCELLED_BY_APPLICANT': 'لغو شده توسط درخواست‌کننده',
    'CANCELLED_BY_COUNSELOR': 'لغو شده توسط مشاور',
    'COMPLETED': 'تکمیل شده',
    'CONFIRMED': 'تأیید شده',
    'IN_PROGRESS': 'در حال انجام',
    'NO_SHOW': 'حضور نداشته'
  }
  return statusMap[status] || status
}

const getSessionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'INITIAL_CONSULTATION': 'مشاوره اولیه',
    'FOLLOW_UP': 'جلسه پیگیری',
    'CRISIS_INTERVENTION': 'مداخله بحرانی',
    'ASSESSMENT_SESSION': 'جلسه ارزیابی',
    'PROGRESS_REVIEW': 'بررسی پیشرفت',
    'TERMINATION': 'پایان مشاوره'
  }
  return typeMap[type] || type
}

const handleGenerateReport = async () => {
  if (!sessionId.value) {
    reportError.value = 'لطفاً یک جلسه را انتخاب کنید'
    return
  }

  isGenerating.value = true
  reportError.value = null
  generatedReport.value = null

  try {
    const result = await generateSessionReport(sessionId.value)
    if (result) {
      generatedReport.value = result
    }
  } catch (err: any) {
    reportError.value = err.message || 'خطا در تولید گزارش'
  } finally {
    isGenerating.value = false
  }
}

const exportReport = () => {
  // In a real implementation, this would export the report to PDF or another format
  alert('در یک پیاده‌سازی واقعی، گزارش به صورت PDF یا فرمت دیگری صادر می‌شود')
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          گزارش جلسات مشاوره
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          تولید و مشاهده گزارش‌های جلسات مشاوره
        </p>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Session Selection -->
      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          انتخاب جلسه
        </h2>
        
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              جلسه
            </label>
            <select
              v-model="sessionId"
              :disabled="isSessionsLoading"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">
                انتخاب جلسه...
              </option>
              <option
                v-for="session in userSessions"
                :key="session.id"
                :value="session.id"
              >
                {{ getSessionTypeText(session.type) }} - {{ formatDate(session.scheduledAt) }} ({{ getSessionStatusText(session.status) }})
              </option>
            </select>
            <p v-if="isSessionsLoading" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              در حال بارگذاری جلسات...
            </p>
          </div>
          
          <div class="flex items-end">
            <button
              :disabled="!sessionId || isGenerating"
              class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              @click="handleGenerateReport"
            >
              <span v-if="isGenerating">در حال تولید گزارش...</span>
              <span v-else>تولید گزارش</span>
            </button>
          </div>
        </div>
        
        <div v-if="sessionsError" class="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div class="flex">
            <div class="shrink-0">
              <Icon name="ph:x-circle" class="size-5 text-red-400" />
            </div>
            <div class="mr-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                خطا
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ sessionsError }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="reportError" class="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div class="flex">
            <div class="shrink-0">
              <Icon name="ph:x-circle" class="size-5 text-red-400" />
            </div>
            <div class="mr-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                خطا در تولید گزارش
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ reportError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Report -->
      <div v-if="generatedReport" class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            گزارش تولید شده
          </h2>
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="exportReport"
          >
            <Icon name="ph:download" class="ml-2 size-4" />
            <span>صدور گزارش</span>
          </button>
        </div>
        
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <div class="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              خلاصه
            </h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              {{ generatedReport.summary }}
            </p>
          </div>
          
          <div class="mb-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              تحلیل‌ها
            </h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="analysis in generatedReport.analysis"
                :key="analysis.id"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <h4 class="mb-2 font-medium text-gray-900 dark:text-white">
                  {{ analysis.title }}
                </h4>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ analysis.description }}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              توصیه‌ها
            </h3>
            <ul class="list-inside list-disc space-y-2">
              <li
                v-for="recommendation in generatedReport.recommendations"
                :key="recommendation.id"
                class="text-gray-700 dark:text-gray-300"
              >
                {{ recommendation.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-lg border border-gray-200 bg-white p-12 text-center shadow dark:border-gray-700 dark:bg-gray-800">
        <Icon name="ph:file-text" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          گزارشی وجود ندارد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برای تولید گزارش، یک جلسه را انتخاب کنید و روی دکمه "تولید گزارش" کلیک کنید.
        </p>
      </div>
    </div>
  </div>
</template>