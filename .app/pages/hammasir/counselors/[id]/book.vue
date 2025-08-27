<script setup lang="ts">
import { usePublicCounselors } from '~/composables/hammasir/usePublicCounselors'
import type { TimeSlotDto, CreateSessionDto } from '~/types/api'

definePageMeta({
  title: 'رزرو جلسه مشاوره',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

const {
  publicCounselorsList,
  isCounselorsLoading,
  counselorsError,
  getPublicCounselorById,
  getCounselorAvailability,
  getAvailableTimeSlots,
  createCounselingSession,
} = usePublicCounselors()

const counselorId = route.params.id as string
const counselor = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedDate = ref('')
const availableSlots = ref<TimeSlotDto[]>([])
const selectedSlot = ref<TimeSlotDto | null>(null)
const sessionType = ref('individual')
const notes = ref('')
const isBooking = ref(false)
const bookingError = ref<string | null>(null)

// Load counselor data
onMounted(async () => {
  await loadCounselor()
})

const loadCounselor = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await getPublicCounselorById(counselorId)
    if (result) {
      counselor.value = result
    }
    else {
      error.value = 'مشاور یافت نشد'
    }
  }
  catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری اطلاعات مشاور'
  }
  finally {
    isLoading.value = false
  }
}

// Load available time slots for a date
const loadTimeSlots = async (date: string) => {
  selectedDate.value = date
  selectedSlot.value = null

  try {
    const slots = await getAvailableTimeSlots(counselorId, date, date)
    availableSlots.value = slots || []
  }
  catch (err: any) {
    console.error('Error loading time slots:', err)
    error.value = 'خطا در بارگذاری ساعات آزاد'
  }
}

// Select a time slot
const selectSlot = (slot: TimeSlotDto) => {
  selectedSlot.value = slot
}

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format time for display
const formatTime = (timeString: string) => {
  const time = new Date(timeString)
  return time.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

// Book appointment
const bookAppointment = async () => {
  if (!selectedSlot.value) {
    bookingError.value = 'لطفاً یک ساعت را انتخاب کنید'
    return
  }

  isBooking.value = true
  bookingError.value = null

  try {
    const sessionData: CreateSessionDto = {
      applicantId: '', // This would be the current user's ID
      counselorId: counselorId,
      type: sessionType.value as any,
      scheduledAt: selectedSlot.value.startTime,
    }

    const result = await createCounselingSession(sessionData)
    if (result) {
      // Redirect to payment or confirmation page
      router.push(`/hammasir/sessions/${result.id}/payment`)
    }
  }
  catch (err: any) {
    bookingError.value = err.message || 'خطا در رزرو جلسه'
  }
  finally {
    isBooking.value = false
  }
}

// Get next 7 days
const nextSevenDays = computed(() => {
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date.toISOString().split('T')[0])
  }

  return days
})

// Get day name
const getDayName = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', { weekday: 'short' })
}

// Get day number
const getDayNumber = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', { day: 'numeric' })
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="router.back()"
        >
          <Icon name="ph:arrow-right" class="ml-2 size-4" />
          <span>بازگشت</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری اطلاعات مشاور...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ error }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadCounselor"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div v-else-if="counselor" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Header -->
        <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <div class="flex items-center">
            <div class="shrink-0">
              <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
            </div>
            <div class="mr-4">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                رزرو جلسه با {{ counselor.firstName }} {{ counselor.lastName }}
              </h1>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ counselor.specializations?.map(s => s.name).join(', ') || 'متخصص' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 p-6 lg:grid-cols-3">
          <!-- Booking Steps -->
          <div class="space-y-8 lg:col-span-2">
            <!-- Step 1: Select Date -->
            <div>
              <h2 class="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <span class="ml-2 flex size-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">1</span>
                <span>انتخاب تاریخ</span>
              </h2>

              <div class="grid grid-cols-7 gap-2">
                <button
                  v-for="date in nextSevenDays"
                  :key="date"
                  :class="[
                    'rounded-lg border px-2 py-3 text-center transition-colors',
                    selectedDate === date
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  ]"
                  @click="loadTimeSlots(date)"
                >
                  <div class="text-xs font-medium">
                    {{ getDayName(date) }}
                  </div>
                  <div class="mt-1 text-lg font-bold">
                    {{ getDayNumber(date) }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 2: Select Time -->
            <div>
              <h2 class="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <span class="ml-2 flex size-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">2</span>
                <span>انتخاب ساعت</span>
                <span v-if="selectedDate" class="mr-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({{ formatDate(selectedDate) }})
                </span>
              </h2>

              <div v-if="selectedDate">
                <div v-if="availableSlots.length === 0" class="py-8 text-center">
                  <Icon name="ph:clock" class="mx-auto size-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    ساعت آزادی یافت نشد
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    برای این تاریخ ساعت آزادی وجود ندارد. لطفاً تاریخ دیگری را انتخاب کنید.
                  </p>
                </div>

                <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  <button
                    v-for="slot in availableSlots"
                    :key="slot.startTime"
                    :class="[
                      'rounded-lg border px-2 py-3 text-center text-sm transition-colors',
                      selectedSlot?.startTime === slot.startTime
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="selectSlot(slot)"
                  >
                    {{ formatTime(slot.startTime) }}
                  </button>
                </div>
              </div>

              <div v-else class="py-8 text-center">
                <Icon name="ph:calendar-blank" class="mx-auto size-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  تاریخی انتخاب نشده است
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  لطفاً یک تاریخ را از تقویم بالا انتخاب کنید تا ساعات آزاد نمایش داده شوند.
                </p>
              </div>
            </div>

            <!-- Step 3: Session Details -->
            <div>
              <h2 class="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <span class="ml-2 flex size-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">3</span>
                <span>جزئیات جلسه</span>
              </h2>

              <div class="space-y-6">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    نوع جلسه
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      :class="[
                        'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                        sessionType === 'individual'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      ]"
                      @click="sessionType = 'individual'"
                    >
                      <div class="flex items-center">
                        <Icon name="ph:user" class="ml-2 size-5" />
                        <span>فردى</span>
                      </div>
                    </button>
                    <button
                      :class="[
                        'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                        sessionType === 'couple'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      ]"
                      @click="sessionType = 'couple'"
                    >
                      <div class="flex items-center">
                        <Icon name="ph:users" class="ml-2 size-5" />
                        <span>زوجین</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    یادداشت‌ها (اختیاری)
                  </label>
                  <textarea
                    v-model="notes"
                    rows="3"
                    placeholder="هر گونه اطلاعات اضافی که می‌خواهید با مشاور در میان بگذارید..."
                    class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Selected Slot Preview -->
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-700/50">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                جلسه انتخاب شده
              </h3>

              <div v-if="selectedSlot" class="space-y-4">
                <div class="flex items-center">
                  <Icon name="ph:calendar" class="ml-2 size-5 text-gray-500 dark:text-gray-400" />
                  <span class="text-gray-900 dark:text-white">
                    {{ formatDate(selectedSlot.startTime) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <Icon name="ph:clock" class="ml-2 size-5 text-gray-500 dark:text-gray-400" />
                  <span class="text-gray-900 dark:text-white">
                    {{ formatTime(selectedSlot.startTime) }}
                  </span>
                </div>
                <div class="flex items-center">
                  <Icon name="ph:currency-dollar" class="ml-2 size-5 text-gray-500 dark:text-gray-400" />
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(counselor.hourlyRate || 200000) }}
                  </span>
                </div>
              </div>

              <div v-else class="py-4 text-center">
                <Icon name="ph:selection" class="mx-auto size-8 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  هنوز جلسه‌ای انتخاب نشده است
                </p>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="rounded-lg border border-gray-200 bg-white p-5 shadow dark:border-gray-600 dark:bg-gray-700">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                خلاصه رزرو
              </h3>

              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">مشاور</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ counselor.firstName }} {{ counselor.lastName }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">نوع جلسه</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ sessionType === 'individual' ? 'فردى' : 'زوجین' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">هزینه جلسه</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(counselor.hourlyRate || 200000) }}
                  </span>
                </div>
                <div class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                  <div class="flex justify-between text-base font-medium">
                    <span class="text-gray-900 dark:text-white">مجموع</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ formatCurrency(counselor.hourlyRate || 200000) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Error -->
            <div v-if="bookingError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div class="flex">
                <div class="shrink-0">
                  <Icon name="ph:x-circle" class="size-5 text-red-400" />
                </div>
                <div class="mr-3">
                  <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                    خطا در رزرو جلسه
                  </h3>
                  <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{{ bookingError }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Book Button -->
            <button
              :disabled="!selectedSlot || isBooking"
              :class="[
                'w-full rounded-lg border border-transparent px-4 py-3 text-base font-medium shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                selectedSlot && !isBooking
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              ]"
              @click="bookAppointment"
            >
              <div class="flex items-center justify-center">
                <Icon
                  v-if="isBooking"
                  name="ph:spinner"
                  class="ml-2 size-5 animate-spin"
                />
                <Icon
                  v-else
                  name="ph:calendar-plus"
                  class="ml-2 size-5"
                />
                <span>
                  {{ isBooking ? 'در حال رزرو...' : 'تأیید و رزرو جلسه' }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
