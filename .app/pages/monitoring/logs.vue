<template>
  <div class="min-h-screen bg-muted-50 dark:bg-muted-950">
    <!-- Header -->
    <div class="bg-white dark:bg-muted-900 border-b border-muted-200 dark:border-muted-800">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-muted-800 dark:text-muted-100">
              گزارش‌های سیستم
            </h1>
            <p class="text-muted-600 dark:text-muted-400 mt-1">
              گزارش‌ها و رویدادهای تفصیلی سیستم
            </p>
          </div>

          <div class="flex items-center gap-4">
            <!-- Back to Dashboard -->
            <NuxtLink to="/admin/monitoring/dashboard"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-muted-200 text-muted-700 hover:bg-muted-50 transition-colors">
              <Icon name="lucide:arrow-left" class="w-4 h-4" />
              بازگشت به داشبورد
            </NuxtLink>

            <!-- Refresh Button -->
            <button @click="refreshLogs" :disabled="isLoading"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-muted-200 text-muted-700 hover:bg-muted-50 transition-colors disabled:opacity-50">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
              بروزرسانی
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-6 mb-6">
        <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100 mb-4">
          فیلترها
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Level Filter -->
          <div>
            <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
              سطح گزارش
            </label>
            <select v-model="filters.level" @change="applyFilters"
              class="w-full px-3 py-2 border border-muted-200 dark:border-muted-700 rounded-lg bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-200">
              <option value="">همه سطوح</option>
              <option value="DEBUG">اشکال‌زدایی</option>
              <option value="INFO">اطلاعات</option>
              <option value="WARN">هشدار</option>
              <option value="ERROR">خطا</option>
              <option value="CRITICAL">بحرانی</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
              دسته‌بندی
            </label>
            <select v-model="filters.category" @change="applyFilters"
              class="w-full px-3 py-2 border border-muted-200 dark:border-muted-700 rounded-lg bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-200">
              <option value="">همه دسته‌ها</option>
              <option value="NOTIFICATION_DELIVERY">تحویل اعلان</option>
              <option value="FCM_TOKEN">توکن FCM</option>
              <option value="SCHEDULING">زمان‌بندی</option>
              <option value="TEMPLATE_RENDERING">رندر قالب</option>
              <option value="USER_GROUPS">گروه‌های کاربری</option>
              <option value="CAMPAIGNS">کمپین‌ها</option>
              <option value="SERVICE_WORKER">Service Worker</option>
              <option value="DATABASE">پایگاه داده</option>
              <option value="SYSTEM">سیستم</option>
              <option value="PERFORMANCE">عملکرد</option>
            </select>
          </div>

          <!-- Component Filter -->
          <div>
            <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
              جزء سیستم
            </label>
            <input v-model="filters.component" @input="applyFilters" type="text" placeholder="فیلتر بر اساس جزء سیستم"
              class="w-full px-3 py-2 border border-muted-200 dark:border-muted-700 rounded-lg bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-200">
          </div>

          <!-- Time Range -->
          <div>
            <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
              بازه زمانی
            </label>
            <select v-model="filters.timeRange" @change="applyFilters"
              class="w-full px-3 py-2 border border-muted-200 dark:border-muted-700 rounded-lg bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-200">
              <option value="1h">ساعت گذشته</option>
              <option value="6h">۶ ساعت گذشته</option>
              <option value="24h">۲۴ ساعت گذشته</option>
              <option value="7d">۷ روز گذشته</option>
              <option value="30d">۳۰ روز گذشته</option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
            جستجوی پیام‌ها
          </label>
          <input v-model="filters.search" @input="applyFilters" type="text" placeholder="جستجو در پیام‌های گزارش..."
            class="w-full px-3 py-2 border border-muted-200 dark:border-muted-700 rounded-lg bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-200">
        </div>
      </div>

      <!-- Log Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div
          class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-4 text-center">
          <div class="text-2xl font-bold text-muted-800 dark:text-muted-100">
            {{ logStats.total }}
          </div>
          <div class="text-sm text-muted-600 dark:text-muted-400">
            کل گزارش‌ها
          </div>
        </div>

        <div
          class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-4 text-center">
          <div class="text-2xl font-bold text-danger-600">
            {{ logStats.errors }}
          </div>
          <div class="text-sm text-muted-600 dark:text-muted-400">
            خطاها
          </div>
        </div>

        <div
          class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-4 text-center">
          <div class="text-2xl font-bold text-warning-600">
            {{ logStats.warnings }}
          </div>
          <div class="text-sm text-muted-600 dark:text-muted-400">
            هشدارها
          </div>
        </div>

        <div
          class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ logStats.info }}
          </div>
          <div class="text-sm text-muted-600 dark:text-muted-400">
            اطلاعات
          </div>
        </div>

        <div
          class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-4 text-center">
          <div class="text-2xl font-bold text-muted-600">
            {{ logStats.debug }}
          </div>
          <div class="text-sm text-muted-600 dark:text-muted-400">
            اشکال‌زدایی
          </div>
        </div>
      </div>

      <!-- Logs List -->
      <div class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800">
        <div class="px-6 py-4 border-b border-muted-200 dark:border-muted-800">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
              ورودی‌های گزارش ({{ filteredLogs.length }})
            </h2>

            <div class="flex items-center gap-2">
              <!-- Export Button -->
              <button @click="exportLogs"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1 rounded hover:bg-primary-50 transition-colors">
                خروجی
              </button>

              <!-- Clear Logs Button -->
              <button @click="clearLogs"
                class="text-sm text-danger-600 hover:text-danger-700 font-medium px-3 py-1 rounded hover:bg-danger-50 transition-colors">
                پاک کردن گزارش‌ها
              </button>
            </div>
          </div>
        </div>

        <div class="divide-y divide-muted-200 dark:divide-muted-800 max-h-96 overflow-y-auto">
          <div v-if="isLoading" class="p-8 text-center">
            <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-2 text-muted-400" />
            <p class="text-muted-600 dark:text-muted-400">در حال بارگذاری گزارش‌ها...</p>
          </div>

          <div v-else-if="filteredLogs.length === 0" class="p-8 text-center">
            <Icon name="lucide:file-text" class="w-12 h-12 mx-auto mb-4 text-muted-400" />
            <p class="text-muted-600 dark:text-muted-400">هیچ گزارشی مطابق با فیلترهای شما یافت نشد.</p>
          </div>

          <LogEntry v-for="log in filteredLogs" :key="log.id" :log="log" />
        </div>

        <!-- Pagination -->
        <div v-if="filteredLogs.length > 0" class="px-6 py-4 border-t border-muted-200 dark:border-muted-800">
          <div class="flex items-center justify-between">
            <p class="text-sm text-muted-600 dark:text-muted-400">
              نمایش {{ Math.min(currentPage * pageSize, filteredLogs.length) }} از {{ filteredLogs.length }} گزارش
            </p>

            <div class="flex items-center gap-2">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-muted-200 dark:border-muted-700 rounded hover:bg-muted-50 dark:hover:bg-muted-800 disabled:opacity-50 disabled:cursor-not-allowed">
                قبلی
              </button>

              <span class="px-3 py-1 text-sm">
                صفحه {{ currentPage }} از {{ totalPages }}
              </span>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-muted-200 dark:border-muted-700 rounded hover:bg-muted-50 dark:hover:bg-muted-800 disabled:opacity-50 disabled:cursor-not-allowed">
                بعدی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationLogger, LogLevel, LogCategory } from '~/composables/useNotificationLogger'
import type { LogEntry as LogEntryType } from '~/composables/useNotificationLogger'

// Meta
definePageMeta({
  layout: 'sidebar'
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// Composables
const logger = useNotificationLogger()

// Reactive state
const isLoading = ref(false)
const logs = ref<LogEntryType[]>([])
const currentPage = ref(1)
const pageSize = ref(50)

// Filters
const filters = ref({
  level: '',
  category: '',
  component: '',
  timeRange: '24h',
  search: ''
})

// Computed
const filteredLogs = computed(() => {
  let filtered = [...logs.value]

  // Apply level filter
  if (filters.value.level) {
    filtered = filtered.filter(log => log.level === filters.value.level)
  }

  // Apply category filter
  if (filters.value.category) {
    filtered = filtered.filter(log => log.category === filters.value.category)
  }

  // Apply component filter
  if (filters.value.component) {
    filtered = filtered.filter(log =>
      log.component?.toLowerCase().includes(filters.value.component.toLowerCase())
    )
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(log =>
      log.message.toLowerCase().includes(searchTerm) ||
      log.component?.toLowerCase().includes(searchTerm) ||
      log.method?.toLowerCase().includes(searchTerm)
    )
  }

  // Sort by timestamp (newest first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Apply pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filtered.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  const totalFiltered = logs.value.filter(log => {
    let matches = true

    if (filters.value.level) {
      matches = matches && log.level === filters.value.level
    }
    if (filters.value.category) {
      matches = matches && log.category === filters.value.category
    }
    if (filters.value.component) {
      matches = matches && log.component?.toLowerCase().includes(filters.value.component.toLowerCase())
    }
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      matches = matches && (
        log.message.toLowerCase().includes(searchTerm) ||
        log.component?.toLowerCase().includes(searchTerm) ||
        log.method?.toLowerCase().includes(searchTerm)
      )
    }

    return matches
  }).length

  return Math.ceil(totalFiltered / pageSize.value)
})

const logStats = computed(() => {
  const stats = {
    total: logs.value.length,
    errors: 0,
    warnings: 0,
    info: 0,
    debug: 0
  }

  logs.value.forEach(log => {
    switch (log.level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        stats.errors++
        break
      case LogLevel.WARN:
        stats.warnings++
        break
      case LogLevel.INFO:
        stats.info++
        break
      case LogLevel.DEBUG:
        stats.debug++
        break
    }
  })

  return stats
})

// Methods
const refreshLogs = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const timeRangeHours = getTimeRangeHours(filters.value.timeRange)
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - timeRangeHours)

    const fetchedLogs = await logger.getLogs({
      startDate,
      limit: 1000
    })

    logs.value = fetchedLogs
    currentPage.value = 1

  } catch (error) {
    console.error('Failed to refresh logs:', error)
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  refreshLogs()
}

const getTimeRangeHours = (range: string): number => {
  switch (range) {
    case '1h': return 1
    case '6h': return 6
    case '24h': return 24
    case '7d': return 24 * 7
    case '30d': return 24 * 30
    default: return 24
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportLogs = async () => {
  try {
    const exportData = filteredLogs.value.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      category: log.category,
      message: log.message,
      component: log.component,
      method: log.method,
      duration_ms: log.duration_ms,
      user_id: log.user_id,
      details: log.details
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Failed to export logs:', error)
  }
}

const clearLogs = async () => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید همه گزارش‌ها را پاک کنید؟ این عمل قابل بازگشت نیست.')) {
    return
  }

  try {
    await logger.cleanupOldLogs(0) // Clear all logs
    await refreshLogs()
  } catch (error) {
    console.error('Failed to clear logs:', error)
  }
}

// Initialize
onMounted(() => {
  refreshLogs()
})
</script>