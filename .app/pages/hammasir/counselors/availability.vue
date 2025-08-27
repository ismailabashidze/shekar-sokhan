<script setup lang="ts">
import { useCounselorScheduling } from '~/composables/hammasir/useCounselorScheduling'
import { useProfileCounselor } from '~/composables/hammasir/useProfileCounselor'
import type { TimeSlotDto } from '~/types/api'

definePageMeta({
  title: 'دسترس‌پذیری مشاور',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

const {
  schedulingState,
  timeSlots,
  availability,
  isSchedulingLoading,
  schedulingError,
  getCounselorAvailability,
  getMyAvailability
} = useCounselorScheduling()

const {
  counselorProfileState,
  isProfileLoading,
  profileError,
  getMyCounselorProfile
} = useProfileCounselor()

const counselorId = ref('')
const currentDate = ref(new Date())
const selectedWeekOffset = ref(0)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Initialize
onMounted(async () => {
  await loadCounselorProfile()
})

const loadCounselorProfile = async () => {
  isLoading.value = true
  error.value = null

  try {
    const profile = await getMyCounselorProfile()
    if (profile) {
      counselorId.value = profile.id
      await loadAvailability()
    } else {
      error.value = 'پروفایل مشاور یافت نشد'
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری پروفایل مشاور'
  } finally {
    isLoading.value = false
  }
}

const loadAvailability = async () => {
  if (!counselorId.value) return

  isLoading.value = true
  error.value = null

  try {
    // Calculate start and end dates for the week
    const startDate = new Date(currentDate.value)
    startDate.setDate(startDate.getDate() + (selectedWeekOffset.value * 7))
    startDate.setDate(startDate.getDate() - startDate.getDay() + 6) // Start from Saturday (Persian week start)
    
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6) // End of the week (Friday)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    await getCounselorAvailability(counselorId.value, startDateStr, endDateStr)
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری زمان‌های آزاد'
  } finally {
    isLoading.value = false
  }
}

const getWeekDates = () => {
  const dates = []
  const startDate = new Date(currentDate.value)
  startDate.setDate(startDate.getDate() + (selectedWeekOffset.value * 7))
  startDate.setDate(startDate.getDate() - startDate.getDay() + 6) // Start from Saturday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }

  return dates
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fa-IR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

const formatTime = (timeString: string) => {
  const time = new Date(timeString)
  return time.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString('fa-IR', { weekday: 'long' })
}

const groupedSlotsByDay = computed(() => {
  const groups: Record<string, TimeSlotDto[]> = {}
  
  timeSlots.value.forEach(slot => {
    const date = new Date(slot.startTime).toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(slot)
  })
  
  return groups
})

const weekDates = computed(() => getWeekDates())

const navigateWeek = (direction: number) => {
  selectedWeekOffset.value += direction
  loadAvailability()
}

const refreshAvailability = () => {
  loadAvailability()
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
              زمان‌های آزاد مشاوره
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مشاهده و مدیریت زمان‌های آزاد برای جلسات مشاوره
            </p>
          </div>
          <div class="mt-4 flex space-x-3 space-x-reverse md:mt-0">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="refreshAvailability"
            >
              <Icon name="ph:arrows-clockwise" class="ml-2 size-4" />
              <span>تازه‌سازی</span>
            </button>
            <NuxtLink
              to="/hammasir/counselors/me"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              <span>بازگشت به پروفایل</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isAnyLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری زمان‌های آزاد...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="anyError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ anyError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadCounselorProfile"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Availability Calendar -->
      <div v-else class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Week Navigation -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex items-center justify-between">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateWeek(-1)"
            >
              <Icon name="ph:caret-right" class="size-4" />
            </button>

            <div class="text-center">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ weekDates[0] ? getDayName(weekDates[0]) : '' }} تا {{ weekDates[6] ? getDayName(weekDates[6]) : '' }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ weekDates[0] ? weekDates[0].toLocaleDateString('fa-IR') : '' }} - {{ weekDates[6] ? weekDates[6].toLocaleDateString('fa-IR') : '' }}
              </p>
            </div>

            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="navigateWeek(1)"
            >
              <Icon name="ph:caret-left" class="size-4" />
            </button>
          </div>
        </div>

        <!-- Days of Week -->
        <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
          <div
            v-for="(date, index) in weekDates"
            :key="index"
            class="border-l border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-900 dark:border-gray-600 dark:text-white"
            :class="{ 'border-l-0': index === 6 }"
          >
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ date.toLocaleDateString('fa-IR', { weekday: 'short' }) }}
            </div>
            <div class="mt-1 text-lg">
              {{ date.toLocaleDateString('fa-IR', { day: 'numeric' }) }}
            </div>
          </div>
        </div>

        <!-- Time Slots -->
        <div class="p-4 sm:p-6">
          <div v-if="schedulingState.timeSlots.length === 0" class="py-12 text-center">
            <Icon name="ph:calendar-x" class="mx-auto size-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              زمان آزادی یافت نشد
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              برای این هفته زمان آزادی برای جلسات مشخص نشده است.
            </p>
            <div class="mt-6">
              <NuxtLink
                to="/hammasir/counselors/me/availability-config"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Icon name="ph:calendar-plus" class="ml-2 size-4" />
                <span>تعریف زمان‌های کاری</span>
              </NuxtLink>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-7">
            <div
              v-for="(date, index) in weekDates"
              :key="index"
              class="space-y-3"
            >
              <div class="text-center text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(date) }}
              </div>

              <div class="space-y-2">
                <div
                  v-for="slot in groupedSlotsByDay[date.toISOString().split('T')[0]]"
                  :key="slot.startTime"
                  class="rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200"
                >
                  <div>
                    {{ formatTime(slot.startTime) }}
                  </div>
                  <div class="mt-1 text-xs">
                    تا {{ formatTime(slot.endTime) }}
                  </div>
                </div>

                <div
                  v-if="!groupedSlotsByDay[date.toISOString().split('T')[0]] || groupedSlotsByDay[date.toISOString().split('T')[0]].length === 0"
                  class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                >
                  بدون زمان آزاد
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Section -->
      <div class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div class="flex items-start">
          <Icon name="ph:info" class="ml-3 mt-0.5 size-5 shrink-0 text-blue-500" />
          <div>
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
              راهنمای زمان‌های آزاد
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul class="list-inside list-disc space-y-1">
                <li>زمان‌های سبز رنگ نشان‌دهنده ساعات آزاد شما برای جلسات مشاوره هستند</li>
                <li>کاربران می‌توانند از طریق این زمان‌ها جلسه رزرو کنند</li>
                <li>برای تغییر یا اضافه کردن زمان‌های آزاد، به بخش تنظیم دسترس‌پذیری مراجعه کنید</li>
                <li>زمان‌های آبی نشان‌دهنده جلسات رزرو شده هستند</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>