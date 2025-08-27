<script setup lang="ts">
definePageMeta({
  title: 'تحلیل‌های مشاوره',
  layout: 'sidebar',
  middleware: ['auth']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  sessionAnalysis,
  isAnalysisLoading,
  analysisError,
  getSessionAnalysis,
  generateSessionReport
} = useAnalysis()

const router = useRouter()
const route = useRoute()

const sessionId = ref('')
const analysisType = ref('personality')
const isAnalyzing = ref(false)
const generatedAnalysis = ref<any>(null)
const analysisErrorMessage = ref<string | null>(null)

onMounted(async () => {
  // Load initial analysis if session ID is provided in route
  if (route.query.sessionId) {
    sessionId.value = route.query.sessionId as string
    await loadAnalysis()
  }
})

const loadAnalysis = async () => {
  if (!sessionId.value) {
    analysisErrorMessage.value = 'شناسه جلسه مشخص نشده است'
    return
  }

  isAnalyzing.value = true
  analysisErrorMessage.value = null
  generatedAnalysis.value = null

  try {
    const result = await getSessionAnalysis(sessionId.value)
    if (result) {
      generatedAnalysis.value = result
    }
  } catch (err: any) {
    analysisErrorMessage.value = err.message || 'خطا در بارگذاری تحلیل'
  } finally {
    isAnalyzing.value = false
  }
}

const handleAnalyze = async () => {
  await loadAnalysis()
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const getAnalysisTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'personality': 'تحلیل شخصیت',
    'compatibility': 'تحلیل سازگاری',
    'emotional': 'تحلیل عاطفی',
    'behavioral': 'تحلیل رفتاری',
    'cognitive': 'تحلیل شناختی'
  }
  return typeMap[type] || type
}

const getFactorTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'PERSONALITY_TRAIT': 'ویژگی شخصیتی',
    'EMOTIONAL_PATTERN': 'الگوی عاطفی',
    'BEHAVIORAL_TENDENCY': 'گرایش رفتاری',
    'COGNITIVE_STYLE': 'سبک شناختی',
    'RELATIONSHIP_DYNAMIC': 'پویایی رابطه',
    'COMMUNICATION_PATTERN': 'الگوی ارتباطی'
  }
  return typeMap[type] || type
}

const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 0.8) return { level: 'بالا', class: 'bg-green-100 text-green-800' }
  if (confidence >= 0.6) return { level: 'متوسط', class: 'bg-yellow-100 text-yellow-800' }
  if (confidence >= 0.4) return { level: 'پایین', class: 'bg-orange-100 text-orange-800' }
  return { level: 'بسیار پایین', class: 'bg-red-100 text-red-800' }
}

const exportAnalysis = () => {
  // In a real implementation, this would export the analysis to PDF or another format
  alert('در یک پیاده‌سازی واقعی، تحلیل به صورت PDF یا فرمت دیگری صادر می‌شود')
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              تحلیل‌های مشاوره
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              تحلیل‌های عمیق بر اساس جلسات مشاوره
            </p>
          </div>
          <div class="mt-4 flex md:mt-0">
            <NuxtLink
              to="/hammasir/sessions"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              <span>بازگشت به جلسات</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Analysis Controls -->
      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          ابزار تحلیل
        </h2>
        
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              شناسه جلسه *
            </label>
            <input
              v-model="sessionId"
              type="text"
              placeholder="شناسه جلسه..."
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
          </div>
          
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              نوع تحلیل
            </label>
            <select
              v-model="analysisType"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="personality">
                تحلیل شخصیت
              </option>
              <option value="compatibility">
                تحلیل سازگاری
              </option>
              <option value="emotional">
                تحلیل عاطفی
              </option>
              <option value="behavioral">
                تحلیل رفتاری
              </option>
              <option value="cognitive">
                تحلیل شناختی
              </option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button
              :disabled="!sessionId || isAnalyzing"
              class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              @click="handleAnalyze"
            >
              <span v-if="isAnalyzing">در حال تحلیل...</span>
              <span v-else>انجام تحلیل</span>
            </button>
          </div>
        </div>
        
        <div v-if="analysisErrorMessage" class="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div class="flex">
            <div class="shrink-0">
              <Icon name="ph:x-circle" class="size-5 text-red-400" />
            </div>
            <div class="mr-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                خطا
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ analysisErrorMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isAnalyzing" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال انجام تحلیل...</span>
      </div>

      <!-- Analysis Results -->
      <div v-else-if="generatedAnalysis" class="space-y-8">
        <!-- Analysis Header -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ getAnalysisTypeText(analysisType) }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                تحلیل جلسه {{ sessionId }}
              </p>
            </div>
            <div class="mt-4 flex space-x-3 space-x-reverse md:mt-0">
              <button
                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="exportAnalysis"
              >
                <Icon name="ph:download" class="ml-2 size-4" />
                <span>صدور گزارش</span>
              </button>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div class="flex items-center">
                <div class="flex size-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Icon name="ph:chart-bar" class="size-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div class="mr-3">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    دقت تحلیل
                  </p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ Math.round((generatedAnalysis.confidence || 0) * 100) }}%
                  </p>
                </div>
              </div>
            </div>
            
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div class="flex items-center">
                <div class="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Icon name="ph:target" class="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div class="mr-3">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    عوامل تحلیل‌شده
                  </p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ generatedAnalysis.factors?.length || 0 }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div class="flex items-center">
                <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Icon name="ph:lightbulb" class="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="mr-3">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    توصیه‌ها
                  </p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ generatedAnalysis.recommendations?.length || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Factors Analysis -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
            عوامل تحلیل‌شده
          </h3>
          
          <div class="grid gap-6 md:grid-cols-2">
            <div
              v-for="factor in generatedAnalysis.factors"
              :key="factor.id"
              class="rounded-lg border border-gray-200 p-5 dark:border-gray-700"
            >
              <div class="mb-3 flex items-start justify-between">
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ factor.title }}
                  </h4>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ getFactorTypeText(factor.type) }}
                  </p>
                </div>
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5"
                  :class="getConfidenceLevel(factor.confidence || 0).class"
                >
                  {{ getConfidenceLevel(factor.confidence || 0).level }}
                </span>
              </div>
              
              <div class="mb-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">مقدار:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ factor.value }}</span>
                </div>
                <div class="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    :style="{ width: `${(factor.value as number) * 100}%` }"
                  />
                </div>
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>{{ factor.description }}</p>
              </div>
              
              <div v-if="factor.implications && factor.implications.length > 0" class="mt-4">
                <h5 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  پیامدها:
                </h5>
                <ul class="space-y-1">
                  <li
                    v-for="implication in factor.implications"
                    :key="implication"
                    class="flex items-start text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Icon name="ph:dot-outline" class="ml-2 mt-1.5 size-4 shrink-0 text-gray-400" />
                    <span>{{ implication }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div v-if="generatedAnalysis.recommendations && generatedAnalysis.recommendations.length > 0" class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
            توصیه‌ها
          </h3>
          
          <div class="space-y-4">
            <div
              v-for="recommendation in generatedAnalysis.recommendations"
              :key="recommendation.id"
              class="rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20"
            >
              <div class="flex">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Icon name="ph:lightbulb" class="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div class="mr-4 flex-1">
                  <h4 class="text-lg font-medium text-green-800 dark:text-green-200">
                    {{ recommendation.title }}
                  </h4>
                  <p class="mt-2 text-green-700 dark:text-green-300">
                    {{ recommendation.description }}
                  </p>
                  <div v-if="recommendation.resources && recommendation.resources.length > 0" class="mt-3">
                    <h5 class="mb-2 text-sm font-medium text-green-700 dark:text-green-300">
                      منابع پیشنهادی:
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <a
                        v-for="resource in recommendation.resources"
                        :key="resource.id"
                        :href="resource.url"
                        target="_blank"
                        class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                      >
                        {{ resource.title }}
                        <Icon name="ph:arrow-up-right" class="mr-1 size-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Insights -->
        <div v-if="generatedAnalysis.insights && generatedAnalysis.insights.length > 0" class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
            بینش‌ها
          </h3>
          
          <div class="grid gap-6 md:grid-cols-2">
            <div
              v-for="insight in generatedAnalysis.insights"
              :key="insight.id"
              class="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20"
            >
              <div class="flex">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Icon name="ph:eye" class="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="mr-4 flex-1">
                  <h4 class="text-lg font-medium text-blue-800 dark:text-blue-200">
                    {{ insight.title }}
                  </h4>
                  <p class="mt-2 text-blue-700 dark:text-blue-300">
                    {{ insight.description }}
                  </p>
                  <div class="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <span>دقت: {{ Math.round((insight.confidence || 0) * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-lg border border-gray-200 bg-white p-12 text-center shadow dark:border-gray-700 dark:bg-gray-800">
        <Icon name="ph:chart-line-up" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          تحلیلی وجود ندارد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برای دریافت تحلیل، یک جلسه را انتخاب کنید و روی دکمه "انجام تحلیل" کلیک کنید.
        </p>
      </div>
    </div>
  </div>
</template>