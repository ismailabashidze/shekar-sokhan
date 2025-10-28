<template>
  <div class="bg-muted-50 dark:bg-muted-950 min-h-screen">
    <!-- Header -->
    <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 border-b bg-white">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
              گزارش‌های سیستم
            </h1>
            <p class="text-muted-600 dark:text-muted-400 mt-1">
              گزارش‌ها و رویدادهای تفصیلی سیستم
            </p>
          </div>

          <div class="flex items-center gap-4">
            <!-- Back to Dashboard -->
            <NuxtLink
              to="/admin/monitoring/dashboard"
              class="border-muted-200 text-muted-700 hover:bg-muted-50 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
            >
              <Icon name="lucide:arrow-left" class="size-4" />
              بازگشت به داشبورد
            </NuxtLink>

            <!-- Refresh Button -->
            <button
              :disabled="isLoading"
              class="border-muted-200 text-muted-700 hover:bg-muted-50 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors disabled:opacity-50"
              @click="refreshLogs"
            >
              <Icon
                name="lucide:refresh-cw"
                class="size-4"
                :class="{ 'animate-spin': isLoading }"
              />
              بروزرسانی
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Filters -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 mb-6 rounded-lg border bg-white p-6">
        <h2 class="text-muted-800 dark:text-muted-100 mb-4 text-lg font-semibold">
          فیلترها
        </h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Level Filter -->
          <div>
            <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
              سطح گزارش
            </label>
            <select
              v-model="filters.level"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-800 dark:text-muted-200 w-full rounded-lg border bg-white px-3 py-2"
              @change="applyFilters"
            >
              <option value="">
                همه سطوح
              </option>
              <option value="DEBUG">
                اشکال‌زدایی
              </option>
              <option value="INFO">
                اطلاعات
              </option>
              <option value="WARN">
                هشدار
              </option>
              <option value="ERROR">
                خطا
              </option>
              <option value="CRITICAL">
                بحرانی
              </option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
              دسته‌بندی
            </label>
            <select
              v-model="filters.category"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-800 dark:text-muted-200 w-full rounded-lg border bg-white px-3 py-2"
              @change="applyFilters"
            >
              <option value="">
                همه دسته‌ها
              </option>
              <option value="NOTIFICATION_DELIVERY">
                تحویل اعلان
              </option>
              <option value="NOTIFICATION_TOKEN">
                توکن اعلان
              </option>
              <option value="SCHEDULING">
                زمان‌بندی
              </option>
              <option value="TEMPLATE_RENDERING">
                رندر قالب
              </option>
              <option value="USER_GROUPS">
                گروه‌های کاربری
              </option>
              <option value="CAMPAIGNS">
                کمپین‌ها
              </option>
              <option value="SERVICE_WORKER">
                Service Worker
              </option>
              <option value="DATABASE">
                پایگاه داده
              </option>
              <option value="SYSTEM">
                سیستم
              </option>
              <option value="PERFORMANCE">
                عملکرد
              </option>
            </select>
          </div>

          <!-- Component Filter -->
          <div>
            <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
              جزء سیستم
            </label>
            <input
              v-model="filters.component"
              type="text"
              placeholder="فیلتر بر اساس جزء سیستم"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-800 dark:text-muted-200 w-full rounded-lg border bg-white px-3 py-2"
              @input="applyFilters"
            >
          </div>

          <!-- Time Range -->
          <div>
            <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
              بازه زمانی
            </label>
            <select
              v-model="filters.timeRange"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-800 dark:text-muted-200 w-full rounded-lg border bg-white px-3 py-2"
              @change="applyFilters"
            >
              <option value="1h">
                ساعت گذشته
              </option>
              <option value="6h">
                ۶ ساعت گذشته
              </option>
              <option value="24h">
                ۲۴ ساعت گذشته
              </option>
              <option value="7d">
                ۷ روز گذشته
              </option>
              <option value="30d">
                ۳۰ روز گذشته
              </option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-4">
          <label class="text-muted-700 dark:text-muted-300 mb-2 block text-sm font-medium">
            جستجوی پیام‌ها
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="جستجو در پیام‌های گزارش..."
            class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-800 dark:text-muted-200 w-full rounded-lg border bg-white px-3 py-2"
            @input="applyFilters"
          >
        </div>
      </div>

      <!-- Log Stats -->
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-4 text-center"
        >
          <div class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
            {{ logStats.total }}
          </div>
          <div class="text-muted-600 dark:text-muted-400 text-sm">
            کل گزارش‌ها
          </div>
        </div>

        <div
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-4 text-center"
        >
          <div class="text-danger-600 text-2xl font-bold">
            {{ logStats.errors }}
          </div>
          <div class="text-muted-600 dark:text-muted-400 text-sm">
            خطاها
          </div>
        </div>

        <div
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-4 text-center"
        >
          <div class="text-warning-600 text-2xl font-bold">
            {{ logStats.warnings }}
          </div>
          <div class="text-muted-600 dark:text-muted-400 text-sm">
            هشدارها
          </div>
        </div>

        <div
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-4 text-center"
        >
          <div class="text-2xl font-bold text-blue-600">
            {{ logStats.info }}
          </div>
          <div class="text-muted-600 dark:text-muted-400 text-sm">
            اطلاعات
          </div>
        </div>

        <div
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-4 text-center"
        >
          <div class="text-muted-600 text-2xl font-bold">
            {{ logStats.debug }}
          </div>
          <div class="text-muted-600 dark:text-muted-400 text-sm">
            اشکال‌زدایی
          </div>
        </div>
      </div>

      <!-- Logs List -->
      <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white">
        <div class="border-muted-200 dark:border-muted-800 border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
              ورودی‌های گزارش ({{ filteredLogs.length }})
            </h2>

            <div class="flex items-center gap-2">
              <!-- Export Button -->
              <button
                class="text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded px-3 py-1 text-sm font-medium transition-colors"
                @click="exportLogs"
              >
                خروجی
              </button>

              <!-- Clear Logs Button -->
              <button
                class="text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded px-3 py-1 text-sm font-medium transition-colors"
                @click="clearLogs"
              >
                پاک کردن گزارش‌ها
              </button>
            </div>
          </div>
        </div>

        <div class="divide-muted-200 dark:divide-muted-800 max-h-96 divide-y overflow-y-auto">
          <div v-if="isLoading" class="p-8 text-center">
            <Icon name="lucide:loader-2" class="text-muted-400 mx-auto mb-2 size-6 animate-spin" />
            <p class="text-muted-600 dark:text-muted-400">
              در حال بارگذاری گزارش‌ها...
            </p>
          </div>

          <div v-else-if="filteredLogs.length === 0" class="p-8 text-center">
            <Icon name="lucide:file-text" class="text-muted-400 mx-auto mb-4 size-12" />
            <p class="text-muted-600 dark:text-muted-400">
              هیچ گزارشی مطابق با فیلترهای شما یافت نشد.
            </p>
          </div>

          <LogEntry
            v-for="log in filteredLogs"
            :key="log.id"
            :log="log"
          />
        </div>

        <!-- Pagination -->
        <div v-if="filteredLogs.length > 0" class="border-muted-200 dark:border-muted-800 border-t px-6 py-4">
          <div class="flex items-center justify-between">
            <p class="text-muted-600 dark:text-muted-400 text-sm">
              نمایش {{ Math.min(currentPage * pageSize, filteredLogs.length) }} از {{ filteredLogs.length }} گزارش
            </p>

            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800 rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                @click="previousPage"
              >
                قبلی
              </button>

              <span class="px-3 py-1 text-sm">
                صفحه {{ currentPage }} از {{ totalPages }}
              </span>

              <button
                :disabled="currentPage === totalPages"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800 rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                @click="nextPage"
              >
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
  layout: 'sidebar',
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
  search: '',
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
      log.component?.toLowerCase().includes(filters.value.component.toLowerCase()),
    )
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(log =>
      log.message.toLowerCase().includes(searchTerm)
      || log.component?.toLowerCase().includes(searchTerm)
      || log.method?.toLowerCase().includes(searchTerm),
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
  const totalFiltered = logs.value.filter((log) => {
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
        log.message.toLowerCase().includes(searchTerm)
        || log.component?.toLowerCase().includes(searchTerm)
        || log.method?.toLowerCase().includes(searchTerm)
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
    debug: 0,
  }

  logs.value.forEach((log) => {
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
      limit: 1000,
    })

    logs.value = fetchedLogs
    currentPage.value = 1
  }
  catch (error) {
    console.error('Failed to refresh logs:', error)
  }
  finally {
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
      details: log.details,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  catch (error) {
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
  }
  catch (error) {
    console.error('Failed to clear logs:', error)
  }
}

// Initialize
onMounted(() => {
  refreshLogs()
})
</script>
