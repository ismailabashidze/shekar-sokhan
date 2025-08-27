<script setup lang="ts">
import { usePublicCounselors } from '~/composables/hammasir/usePublicCounselors'
import type { CounselorPublicProfileDto } from '~/types/api'

definePageMeta({
  title: 'پروفایل مشاور',
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
} = usePublicCounselors()

const counselorId = route.params.id as string
const counselor = ref<CounselorPublicProfileDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedDate = ref('')
const availableSlots = ref<any[]>([])
const showBookingModal = ref(false)

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

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

// Get rating stars
const getRatingStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  if (hasHalfStar) {
    stars.push('half')
  }

  while (stars.length < 5) {
    stars.push('empty')
  }

  return stars
}

// Load availability for selected date
const loadAvailability = async (date: string) => {
  selectedDate.value = date
  try {
    const slots = await getAvailableTimeSlots(counselorId, date, date)
    availableSlots.value = slots || []
  }
  catch (err: any) {
    console.error('Error loading availability:', err)
  }
}

// Book appointment
const bookAppointment = (slot: any) => {
  // In a real implementation, this would navigate to booking page
  // with the selected slot information
  console.log('Booking appointment for slot:', slot)
  showBookingModal.value = true
}

// Close modal
const closeModal = () => {
  showBookingModal.value = false
}

// Confirm booking
const confirmBooking = () => {
  // In a real implementation, this would call the booking API
  closeModal()
  // Show success message
  alert('جلسه با موفقیت رزرو شد!')
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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

      <!-- Counselor Profile -->
      <div v-else-if="counselor" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Header -->
        <div class="relative">
          <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div class="relative -mt-16 px-4 sm:px-6 md:px-8">
            <div class="flex items-end space-x-5 space-x-reverse">
              <div class="shrink-0">
                <div class="size-32 rounded-xl border-2 border-dashed bg-gray-200" />
              </div>
              <div class="pb-6">
                <div class="flex items-center">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ counselor.firstName }} {{ counselor.lastName }}
                  </h1>
                  <span
                    :class="counselor.isOnline ? 'bg-green-400' : 'bg-gray-400'"
                    class="mr-3 size-3 rounded-full"
                  />
                </div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ counselor.specializations?.map(s => s.name).join(', ') || 'متخصص' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-3">
          <!-- Main Content -->
          <div class="space-y-8 lg:col-span-2">
            <!-- About Section -->
            <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                درباره من
              </h2>
              <p class="leading-relaxed text-gray-700 dark:text-gray-300">
                {{ counselor.bio || 'اطلاعاتی درباره این مشاور ثبت نشده است.' }}
              </p>
            </div>

            <!-- Specializations -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                تخصص‌ها
              </h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="spec in counselor.specializations"
                  :key="spec.name"
                  class="rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
                >
                  {{ spec.name }}
                </span>
              </div>
            </div>

            <!-- Education -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                تحصیلات
              </h2>
              <div class="space-y-4">
                <div
                  v-for="cert in counselor.certifications"
                  :key="cert.name"
                  class="flex items-start rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div class="shrink-0">
                    <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
                  </div>
                  <div class="mr-4">
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ cert.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ cert.issuingOrg }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ cert.issueDate }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews -->
            <div>
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                  نظرات کاربران
                </h2>
                <div class="flex items-center">
                  <div class="flex">
                    <Icon
                      v-for="(star, index) in getRatingStars(counselor.rating || 0)"
                      :key="index"
                      :name="star === 'full' ? 'ph:star-fill' : star === 'half' ? 'ph:star-half-fill' : 'ph:star'"
                      class="size-5 text-yellow-400"
                    />
                  </div>
                  <span class="mr-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ counselor.rating || 0 }}
                  </span>
                  <span class="mr-1 text-sm text-gray-500 dark:text-gray-400">
                    ({{ counselor.reviewCount || 0 }} نظر)
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="review in 3"
                  :key="review"
                  class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="size-8 rounded-xl border-2 border-dashed bg-gray-200" />
                      <div class="mr-3">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                          کاربر ناشناس
                        </h3>
                        <div class="flex text-yellow-400">
                          <Icon name="ph:star-fill" class="size-4" />
                          <Icon name="ph:star-fill" class="size-4" />
                          <Icon name="ph:star-fill" class="size-4" />
                          <Icon name="ph:star-fill" class="size-4" />
                          <Icon name="ph:star-half-fill" class="size-4" />
                        </div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      1403/03/15
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    مشاور بسیار حرفه‌ای و با تجربه‌ای هستند. روش‌های تدریس و مشاوره‌شان بسیار مؤثر است.
                  </p>
                </div>

                <button class="w-full rounded-lg bg-indigo-50 py-3 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                  مشاهده همه نظرات
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Booking Card -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-600 dark:bg-gray-700">
              <div class="mb-6 text-center">
                <div class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(counselor.hourlyRate || 200000) }}
                </div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  هر جلسه 60 دقیقه‌ای
                </div>
              </div>

              <button
                class="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-medium text-white shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="showBookingModal = true"
              >
                <Icon name="ph:calendar-plus" class="ml-2 inline size-5" />
                <span>رزرو جلسه</span>
              </button>

              <div class="mt-4 text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="ph:clock" class="ml-1 inline size-4" />
                  <span>جلسه بعدی: 1403/04/15</span>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-600 dark:bg-gray-700">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                ساعات آزاد
              </h3>

              <div class="space-y-3">
                <div
                  v-for="day in 7"
                  :key="day"
                  class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-600"
                >
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'][day % 7] }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      1403/04/{{ 10 + day }}
                    </div>
                  </div>
                  <div class="text-sm font-medium text-green-600">
                    3 جلسه
                  </div>
                </div>
              </div>

              <button class="mt-4 w-full rounded-lg bg-indigo-50 py-2 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                مشاهده کامل برنامه
              </button>
            </div>

            <!-- Stats -->
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-600 dark:bg-gray-700">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                آمار
              </h3>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">جلسات انجام شده</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ counselor.sessionCount || 0 }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">سابقه کار</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ counselor.yearsOfExperience || 0 }} سال
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">زمان پاسخ‌گویی</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    24 ساعت
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              رزرو جلسه
            </h3>
            <button
              class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              @click="closeModal"
            >
              <Icon name="ph:x" class="size-5" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-6 flex items-center">
            <div class="size-12 rounded-xl border-2 border-dashed bg-gray-200" />
            <div class="mr-4">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ counselor?.firstName }} {{ counselor?.lastName }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ counselor?.specializations?.[0]?.name || 'متخصص' }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              تاریخ جلسه
            </label>
            <input
              type="date"
              class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
          </div>

          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              ساعت جلسه
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="hour in ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00']"
                :key="hour"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {{ hour }}
              </button>
            </div>
          </div>

          <div class="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              هزینه جلسه
            </span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(counselor?.hourlyRate || 200000) }}
            </span>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="closeModal"
            >
              انصراف
            </button>
            <button
              class="flex-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              @click="confirmBooking"
            >
              تأیید و پرداخت
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
