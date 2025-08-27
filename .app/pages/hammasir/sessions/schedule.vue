<script setup lang="ts">
import { useSessions } from '~/composables/hammasir/useSessions'
import type { CounselingSessionDto } from '~/types/api'

definePageMeta({
  title: 'برنامه جلسات',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  userSessions,
  isSessionsLoading,
  sessionsError,
  getUserSessions,
  cancelSession,
} = useSessions()

const sessions = ref<CounselingSessionDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentDate = ref(new Date())
const selectedView = ref<'week' | 'month'>('week')

// Filter states
const statusFilter = ref('')
const counselorFilter = ref('')

onMounted(async () => {
  await loadSessions()
})

const loadSessions = async () => {
  try {
    isLoading.value = true
    error.value = null
    await getUserSessions(1, 100, statusFilter.value)
    sessions.value = userSessions.value
  }
  catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری جلسات'
  }
  finally {
    isLoading.value = false
  }
}

const handleCancelSession = async (sessionId: string) => {
  if (!confirm('آیا از لغو این جلسه اطمینان دارید؟')) return

  try {
    const result = await cancelSession(sessionId)
    if (result) {
      await loadSessions()
    }
  }
  catch (err: any) {
    error.value = err.message || 'خطا در لغو جلسه'
  }
}

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
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RESCHEDULED: 'bg-yellow-100 text-yellow-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
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

// Calendar functions
const getWeekDates = () => {
  const dates = []
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)) // Start from Monday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    dates.push(date)
  }

  return dates
}

const getMonthDates = () => {
  const dates = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const endDay = lastDay.getDay()

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    dates.push({ date, isCurrentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    dates.push({ date, isCurrentMonth: true })
  }

  // Next month days
  const daysNeeded = 42 - dates.length // 6 weeks
  for (let i = 1; i <= daysNeeded; i++) {
    const date = new Date(year, month + 1, i)
    dates.push({ date, isCurrentMonth: false })
  }

  return dates
}

const getSessionsForDate = (date: Date) => {
  return sessions.value.filter(session => {
    const sessionDate = new Date(session.scheduledTime)
    return (
      sessionDate.getDate() === date.getDate() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getFullYear() === date.getFullYear()
    )
  })
}

const navigateWeek = (direction: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + direction * 7)
  currentDate.value = newDate
}

const navigateMonth = (direction: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + direction)
  currentDate.value = newDate
}

const today = new Date()
const weekDates = computed(() => getWeekDates())
const monthDates = computed(() => getMonthDates())
const formattedCurrentDate = computed(() => {
  return currentDate.value.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
  })
})
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="mb-8 border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              برنامه جلسات
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              برنامه‌ریزی و مدیریت جلسات مشاوره شما
            </p>
          </div>
          <div class="mt-4 flex flex-wrap gap-3 md:mt-0">
            <div class="flex rounded-md shadow-sm">
              <button
                type="button"
                class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="selectedView = 'week'"
              >
                <Icon name="ph:calendar-week" class="ml-2 size-4" />
                <span>هفتگی</span>
              </button>
              <button
                type="button"
                class="-ml-px relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="selectedView = 'month'"
              >
                <Icon name="ph:calendar-blank" class="ml-2 size-4" />
                <span>ماهانه</span>
              </button>
            </div>

            <NuxtLink
              to="/hammasir/sessions/create"
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Icon name="ph:plus" class="ml-2 size-4" />
              <span>جلسه جدید</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت
              </label>
              <div class="mt-1">
                <select
                  v-model="statusFilter"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadSessions"
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

            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                مشاور
              </label>
              <div class="mt-1">
                <input
                  v-model="counselorFilter"
                  type="text"
                  placeholder="نام مشاور..."
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @input="loadSessions"
                >
              </div>
            </div>

            <div class="flex items-end sm:col-span-2">
              <button
                class="inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="loadSessions"
              >
                <Icon name="ph:funnel" class="ml-2 size-4" />
                <span>اعمال فیلترها</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading || isSessionsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری جلسات...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="sessionsError || error" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری جلسات
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ sessionsError || error }}</p>
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

      <!-- Week View -->
      <div v-else-if="selectedView === 'week'">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ formattedCurrentDate }}
          </h2>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateWeek(-1)"
            >
              <Icon name="ph:caret-right" class="ml-1 size-4" />
              <span>هفته قبل</span>
            </button>
            <button
              v-if="currentDate.toDateString() !== today.toDateString()"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="currentDate = new Date()"
            >
              <Icon name="ph:calendar-today" class="ml-1 size-4" />
              <span>امروز</span>
            </button>
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateWeek(1)"
            >
              <span>هفته بعد</span>
              <Icon name="ph:caret-left" class="mr-1 size-4" />
            </button>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            <div
              v-for="day in weekDates"
              :key="day.toISOString()"
              class="border-l border-gray-200 p-4 text-center dark:border-gray-700"
              :class="day.toDateString() === today.toDateString() ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
            >
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ day.toLocaleDateString('fa-IR', { weekday: 'short' }) }}
              </div>
              <div
                class="mt-1 text-lg font-bold"
                :class="day.toDateString() === today.toDateString() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'"
              >
                {{ day.toLocaleDateString('fa-IR', { day: 'numeric' }) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-7">
            <div
              v-for="day in weekDates"
              :key="day.toISOString()"
              class="min-h-32 border-l border-gray-200 p-2 dark:border-gray-700"
              :class="day.toDateString() === today.toDateString() ? 'bg-blue-50 dark:bg-blue-900/10' : ''"
            >
              <div v-for="session in getSessionsForDate(day)" :key="session.id" class="mb-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-700">
                <div class="flex items-center justify-between">
                  <div class="text-xs font-medium text-gray-900 dark:text-white">
                    {{ session.counselor?.name || 'مشاور نامشخص' }}
                  </div>
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5"
                    :class="getStatusClass(session.status)"
                  >
                    {{ getStatusText(session.status) }}
                  </span>
                </div>
                <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(session.scheduledTime).split(' - ')[1] }}
                </div>
                <div class="mt-1 flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getSessionTypeText(session.sessionType) }}
                  </span>
                  <button
                    v-if="session.status === 'SCHEDULED' || session.status === 'CONFIRMED'"
                    class="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    @click="handleCancelSession(session.id)"
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-else>
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ formattedCurrentDate }}
          </h2>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateMonth(-1)"
            >
              <Icon name="ph:caret-right" class="ml-1 size-4" />
              <span>ماه قبل</span>
            </button>
            <button
              v-if="currentDate.toDateString() !== today.toDateString()"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="currentDate = new Date()"
            >
              <Icon name="ph:calendar-today" class="ml-1 size-4" />
              <span>امروز</span>
            </button>
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateMonth(1)"
            >
              <span>ماه بعد</span>
              <Icon name="ph:caret-left" class="mr-1 size-4" />
            </button>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <!-- Day Headers -->
          <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            <div
              v-for="day in ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']"
              :key="day"
              class="border-l border-gray-200 p-4 text-center font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7">
            <div
              v-for="(dayObj, index) in monthDates"
              :key="index"
              class="min-h-32 border-l border-gray-200 p-2 dark:border-gray-700"
              :class="{
                'bg-gray-50 dark:bg-gray-800': !dayObj.isCurrentMonth,
                'bg-blue-50 dark:bg-blue-900/10': dayObj.isCurrentMonth && dayObj.date.toDateString() === today.toDateString(),
              }"
            >
              <div
                class="mb-1 text-right text-sm font-medium"
                :class="{
                  'text-gray-400 dark:text-gray-500': !dayObj.isCurrentMonth,
                  'text-blue-600 dark:text-blue-400': dayObj.isCurrentMonth && dayObj.date.toDateString() === today.toDateString(),
                  'text-gray-900 dark:text-white': dayObj.isCurrentMonth && dayObj.date.toDateString() !== today.toDateString(),
                }"
              >
                {{ dayObj.date.toLocaleDateString('fa-IR', { day: 'numeric' }) }}
              </div>

              <div v-for="session in getSessionsForDate(dayObj.date)" :key="session.id" class="mb-1 rounded border border-gray-200 bg-white p-1 text-xs shadow-sm dark:border-gray-600 dark:bg-gray-700">
                <div class="truncate font-medium text-gray-900 dark:text-white">
                  {{ session.counselor?.name || 'مشاور نامشخص' }}
                </div>
                <div class="flex items-center justify-between">
                  <span class="truncate text-gray-500 dark:text-gray-400">
                    {{ formatDateTime(session.scheduledTime).split(' - ')[1] }}
                  </span>
                  <span
                    class="inline-flex rounded-full px-1 py-0.5 text-xs font-semibold leading-4"
                    :class="getStatusClass(session.status)"
                  >
                    {{ getStatusText(session.status).charAt(0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && !isSessionsLoading && sessions.length === 0" class="rounded-lg border border-gray-200 bg-white p-12 text-center shadow dark:border-gray-700 dark:bg-gray-800">
        <Icon name="ph:calendar-x" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          جلسه‌ای یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          هنوز جلسه‌ای برای شما ثبت نشده است.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/hammasir/sessions/create"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Icon name="ph:plus" class="ml-2 size-4" />
            <span>ایجاد جلسه جدید</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>