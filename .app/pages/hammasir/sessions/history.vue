<script setup lang="ts">
import { useSessions } from '~/composables/hammasir/useSessions'
import type { CounselingSessionDto } from '~/types/api'

definePageMeta({
  title: 'تاریخچه جلسات',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  userSessions,
  isSessionsLoading,
  sessionsError,
  getUserSessions,
} = useSessions()

const sessions = ref<CounselingSessionDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref({ start: '', end: '' })
const sortBy = ref('scheduledTime')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

onMounted(async () => {
  await loadSessions()
})

const loadSessions = async (page: number = 1) => {
  try {
    isLoading.value = true
    error.value = null
    currentPage.value = page

    // In a real implementation, we would pass filters to the API
    await getUserSessions(page, itemsPerPage.value, statusFilter.value)
    sessions.value = userSessions.value
  }
  catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری جلسات'
  }
  finally {
    isLoading.value = false
  }
}

const filteredSessions = computed(() => {
  let filtered = sessions.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(session =>
      (session.counselor?.name || '').toLowerCase().includes(query) ||
      (session.notes || '').toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(session => session.status === statusFilter.value)
  }

  // Apply date range filter
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = new Date(dateRange.value.start)
    const endDate = new Date(dateRange.value.end)
    filtered = filtered.filter(session => {
      const sessionDate = new Date(session.scheduledTime)
      return sessionDate >= startDate && sessionDate <= endDate
    })
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy.value) {
      case 'scheduledTime':
        aValue = new Date(a.scheduledTime).getTime()
        bValue = new Date(b.scheduledTime).getTime()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'counselor':
        aValue = a.counselor?.name || ''
        bValue = b.counselor?.name || ''
        break
      default:
        aValue = a[sortBy.value as keyof CounselingSessionDto]
        bValue = b[sortBy.value as keyof CounselingSessionDto]
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSessions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / itemsPerPage.value)
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    SCHEDULED: 'زمان‌بندی شده',
    CONFIRMED: 'تایید شده',
    COMPLETED: 'تکمیل شده',
    CANCELLED: 'لغو شده',
    RESCHEDULED: 'تغییر زمان داده شده',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    RESCHEDULED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getSessionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    individual: 'فردى',
    couple: 'زوجین',
    family: 'خانواده',
    group: 'گروهى',
  }
  return typeMap[type] || type
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  const date = new Date(dateString)
  return `${date.toLocaleDateString('fa-IR')} - ${date.toLocaleTimeString('fa-IR')}`
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateRange.value = { start: '', end: '' }
  sortBy.value = 'scheduledTime'
  sortOrder.value = 'desc'
  loadSessions()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="mb-8 border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              تاریخچه جلسات
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مشاهده و مدیریت تاریخچه جلسات مشاوره شما
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <NuxtLink
              to="/hammasir/sessions"
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              <span>بازگشت به جلسات</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <!-- Search -->
            <div class="sm:col-span-4">
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                جستجو
              </label>
              <div class="mt-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجو بر اساس نام مشاور یا یادداشت‌ها..."
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @input="loadSessions(1)"
                >
              </div>
            </div>

            <!-- Status Filter -->
            <div class="sm:col-span-3">
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت
              </label>
              <div class="mt-1">
                <select
                  v-model="statusFilter"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadSessions(1)"
                >
                  <option value="">
                    همه وضعیت‌ها
                  </option>
                  <option value="SCHEDULED">
                    زمان‌بندی شده
                  </option>
                  <option value="CONFIRMED">
                    تایید شده
                  </option>
                  <option value="COMPLETED">
                    تکمیل شده
                  </option>
                  <option value="CANCELLED">
                    لغو شده
                  </option>
                  <option value="RESCHEDULED">
                    تغییر زمان داده شده
                  </option>
                </select>
              </div>
            </div>

            <!-- Date Range -->
            <div class="sm:col-span-3">
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                بازه زمانی
              </label>
              <div class="mt-1 grid grid-cols-2 gap-2">
                <input
                  v-model="dateRange.start"
                  type="date"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadSessions(1)"
                >
                <input
                  v-model="dateRange.end"
                  type="date"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadSessions(1)"
                >
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end sm:col-span-2">
              <button
                class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="clearFilters"
              >
                <Icon name="ph:x" class="ml-2 size-4" />
                <span>پاک کردن فیلترها</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sorting Controls -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div>
            <label class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              مرتب‌سازی بر اساس:
            </label>
            <select
              v-model="sortBy"
              class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              @change="loadSessions(1)"
            >
              <option value="scheduledTime">
                تاریخ جلسه
              </option>
              <option value="status">
                وضعیت
              </option>
              <option value="counselor">
                نام مشاور
              </option>
            </select>
          </div>
          <button
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; loadSessions(1)"
          >
            <Icon
              :name="sortOrder === 'asc' ? 'ph:sort-ascending' : 'ph:sort-descending'"
              class="ml-2 size-4"
            />
            <span>{{ sortOrder === 'asc' ? 'صعودی' : 'نزولی' }}</span>
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          تعداد کل جلسات: {{ filteredSessions.length }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading || isSessionsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری جلسات...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error || sessionsError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری جلسات
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ error || sessionsError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadSessions"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredSessions.length === 0" class="rounded-lg border border-gray-200 bg-white p-12 text-center shadow dark:border-gray-700 dark:bg-gray-800">
        <Icon name="ph:calendar-x" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          جلسه‌ای یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          هنوز جلسه‌ای بر اساس فیلترهای انتخاب شده یافت نشده است.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="clearFilters"
          >
            <Icon name="ph:x" class="ml-2 size-4" />
            <span>پاک کردن فیلترها</span>
          </button>
        </div>
      </div>

      <!-- Sessions List -->
      <div v-else>
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="session in paginatedSessions"
              :key="session.id"
            >
              <div class="px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <Icon name="ph:calendar" class="size-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div class="mr-4">
                      <div class="flex items-center">
                        <p class="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {{ session.counselor?.name || 'مشاور نامشخص' }}
                        </p>
                        <span
                          class="mr-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
                          :class="getStatusClass(session.status)"
                        >
                          {{ getStatusText(session.status) }}
                        </span>
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Icon name="ph:clock" class="ml-1.5 size-4 shrink-0" />
                        <span>{{ formatDateTime(session.scheduledTime) }}</span>
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Icon name="ph:tag" class="ml-1.5 size-4 shrink-0" />
                        <span>{{ getSessionTypeText(session.sessionType) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-3 space-x-reverse">
                    <NuxtLink
                      :to="`/hammasir/sessions/${session.id}`"
                      class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Icon name="ph:eye" class="ml-1 size-4" />
                      <span>جزئیات</span>
                    </NuxtLink>
                  </div>
                </div>
                <div v-if="session.notes" class="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="ph:note" class="ml-1.5 size-4 shrink-0" />
                  <span class="truncate">{{ session.notes }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <span>نمایش</span>
            <span class="font-medium">
              {{ (currentPage - 1) * itemsPerPage + 1 }}
            </span>
            <span>تا</span>
            <span class="font-medium">
              {{ Math.min(currentPage * itemsPerPage, filteredSessions.length) }}
            </span>
            <span>از</span>
            <span class="font-medium">
              {{ filteredSessions.length }}
            </span>
            <span>جلسه</span>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              :disabled="currentPage === 1"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="prevPage"
            >
              <Icon name="ph:caret-right" class="size-4" />
            </button>
            <div class="flex items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                صفحه
              </span>
              <input
                v-model.number="currentPage"
                type="number"
                min="1"
                :max="totalPages"
                class="mx-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="goToPage($event.target.value)"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">
                از {{ totalPages }}
              </span>
            </div>
            <button
              :disabled="currentPage === totalPages"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="nextPage"
            >
              <Icon name="ph:caret-left" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>