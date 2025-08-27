<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        ماژول مشاوره
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        درخواست مشاوره حرفه‌ای و پیگیری وضعیت جلسات
      </p>
    </div>

    <!-- کارت‌های آماری جلسات -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- درخواست مشاوره -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
          <svg
            class="size-8 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          درخواست مشاوره
        </h3>
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          زمان‌بندی جلسه با یکی از مشاوران حرفه‌ای ما
        </p>
        <button class="w-full rounded-lg bg-purple-600 py-2 font-medium text-white transition-colors hover:bg-purple-700" @click="showNewRequestForm = !showNewRequestForm">
          {{ showNewRequestForm ? 'بستن فرم' : 'درخواست جدید' }}
        </button>
      </div>

      <!-- جلسات فعال -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg
            class="size-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          جلسات فعال
        </h3>
        <div class="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
          {{ activeRequests.length }}
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          مشاوره‌های آینده
        </p>
      </div>

      <!-- جلسات تکمیل شده -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <svg
            class="size-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          تکمیل شده
        </h3>
        <div class="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ userStats.completedSessions }}
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          کل جلسات انجام شده
        </p>
      </div>
    </div>

    <!-- فرم درخواست مشاوره جدید -->
    <div v-if="showNewRequestForm" class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        درخواست مشاوره جدید
      </h2>
      <form class="space-y-6" @submit.prevent="submitCounselingRequest">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">نوع مشاوره</label>
            <select v-model="newRequest.type" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="">
                انتخاب کنید
              </option>
              <option value="individual">
                مشاوره فردی
              </option>
              <option value="couple">
                مشاوره زوجین
              </option>
              <option value="family">
                مشاوره خانوادگی
              </option>
              <option value="premarital">
                مشاوره پیش از ازدواج
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">اولویت</label>
            <select v-model="newRequest.priority" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="normal">
                عادی
              </option>
              <option value="urgent">
                فوری
              </option>
              <option value="emergency">
                اورژانس
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">موضوع مشاوره</label>
          <input
            v-model="newRequest.subject"
            type="text"
            placeholder="عنوان کوتاه از موضوع مشاوره"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">شرح مسئله</label>
          <textarea
            v-model="newRequest.description"
            rows="4"
            placeholder="لطفاً مسئله خود را به طور کامل شرح دهید"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex items-center justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="showNewRequestForm = false"
          >
            انصراف
          </button>
          <button type="submit" class="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            ارسال درخواست
          </button>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- درخواست‌های فعال -->
      <div class="lg:col-span-2">
        <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            درخواست‌های فعال
          </h3>

          <div v-if="activeRequests.length === 0" class="py-8 text-center">
            <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg
                class="size-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">
              هیچ درخواست فعالی ندارید
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="request in activeRequests"
              :key="request.id"
              class="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-2 flex items-center space-x-3 space-x-reverse">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ request.subject }}
                    </h4>
                    <span :class="getStatusBadge(request.status)" class="rounded-full px-2 py-1 text-xs font-medium">
                      {{ getStatusText(request.status) }}
                    </span>
                    <span :class="getPriorityBadge(request.priority)" class="rounded-full px-2 py-1 text-xs font-medium">
                      {{ getPriorityText(request.priority) }}
                    </span>
                  </div>
                  <p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
                    {{ request.description }}
                  </p>
                  <div class="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                    <span>📅 {{ request.createdAt }}</span>
                    <span>👨‍⚕️ {{ request.counselor || 'در انتظار تخصیص' }}</span>
                    <span>🔖 {{ getCounselingTypeText(request.type) }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button v-if="request.status === 'confirmed' && request.meetingLink" class="rounded-lg bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700">
                    ورود به جلسه
                  </button>
                  <button class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg
                      class="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تاریخچه درخواست‌ها -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            تاریخچه درخواست‌ها
          </h3>

          <div class="space-y-4">
            <div
              v-for="request in pastRequests"
              :key="request.id"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-2 flex items-center space-x-3 space-x-reverse">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ request.subject }}
                    </h4>
                    <span :class="getStatusBadge(request.status)" class="rounded-full px-2 py-1 text-xs font-medium">
                      {{ getStatusText(request.status) }}
                    </span>
                  </div>
                  <p class="mb-3 text-sm text-gray-600 dark:text-gray-300">
                    {{ request.description }}
                  </p>
                  <div class="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                    <span>📅 {{ request.createdAt }}</span>
                    <span>👨‍⚕️ {{ request.counselor }}</span>
                    <span>⭐ {{ request.rating ? `امتیاز: ${request.rating}/5` : 'بدون امتیاز' }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button v-if="request.status === 'completed' && !request.rating" class="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700">
                    امتیازدهی
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- لیست مشاوران -->
      <div class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            مشاوران
          </h3>

          <div class="space-y-4">
            <div
              v-for="counselor in counselors"
              :key="counselor.id"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
            >
              <div class="flex items-start space-x-4 space-x-reverse">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <span class="text-lg font-medium text-gray-600 dark:text-gray-300">{{ counselor.name.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <div class="mb-1 flex items-center justify-between">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ counselor.name }}
                    </h4>
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ counselor.rating }}</span>
                      <div class="flex text-yellow-400">
                        <svg
                          v-for="i in 5"
                          :key="i"
                          class="size-4 fill-current"
                          :class="i <= counselor.rating ? 'text-yellow-400' : 'text-gray-300'"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    {{ counselor.speciality }}
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ counselor.experience }} سال تجربه • {{ counselor.sessionCount }} جلسه
                    </div>
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <div :class="counselor.isOnline ? 'bg-green-400' : 'bg-gray-400'" class="size-2 rounded-full" />
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ counselor.isOnline ? 'آنلاین' : 'آفلاین' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- آمار مشاوره -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            آمار شما
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">کل جلسات</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ userStats.totalSessions }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">جلسات تکمیل شده</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ userStats.completedSessions }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">میانگین امتیاز</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ userStats.averageRating }}/5</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">ساعات مشاوره</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ userStats.totalHours }} ساعت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'ماژول مشاوره',
  preview: {
    title: 'Counseling Module',
    description: 'Professional counseling request and management system',
    categories: ['counseling'],
    src: '/img/screens/counseling-module.png',
    srcDark: '/img/screens/counseling-module-dark.png',
    order: 1,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const showNewRequestForm = ref(false)

const newRequest = ref({
  type: '',
  priority: 'normal',
  subject: '',
  description: '',
})

const activeRequests = ref([
  {
    id: 1,
    subject: 'مشکلات ارتباطی در زندگی زناشویی',
    description: 'در دوران اخیر با همسرم مشکلات ارتباطی داریم و نیاز به راهنمایی حرفه‌ای داریم.',
    type: 'couple',
    priority: 'urgent',
    status: 'confirmed',
    counselor: 'دکتر سارا احمدی',
    createdAt: '1403/05/15',
    meetingLink: 'https://meet.example.com/abc123',
  },
  {
    id: 2,
    subject: 'اضطراب قبل از ازدواج',
    description: 'نزدیک به تاریخ ازدواج هستم و دچار اضطراب و نگرانی شده‌ام.',
    type: 'premarital',
    priority: 'normal',
    status: 'pending',
    counselor: null,
    createdAt: '1403/05/18',
  },
])

const pastRequests = ref([
  {
    id: 3,
    subject: 'مدیریت استرس کاری',
    description: 'در محیط کار دچار استرس زیادی می‌شوم و نیاز به راهکارهای مدیریت استرس دارم.',
    type: 'individual',
    priority: 'normal',
    status: 'completed',
    counselor: 'دکتر رضا محمدی',
    createdAt: '1403/04/10',
    rating: 5,
  },
  {
    id: 4,
    subject: 'تربیت فرزند نوجوان',
    description: 'در تربیت فرزند نوجوانم مشکل دارم و نیاز به راهنمایی دارم.',
    type: 'family',
    priority: 'normal',
    status: 'completed',
    counselor: 'دکتر مریم کریمی',
    createdAt: '1403/03/25',
    rating: null,
  },
])

const counselors = ref([
  {
    id: 1,
    name: 'دکتر سارا احمدی',
    speciality: 'مشاوره زوجین و خانواده',
    experience: 8,
    sessionCount: 245,
    rating: 4.8,
    isOnline: true,
  },
  {
    id: 2,
    name: 'دکتر رضا محمدی',
    speciality: 'مشاوره فردی و مدیریت استرس',
    experience: 12,
    sessionCount: 380,
    rating: 4.9,
    isOnline: false,
  },
  {
    id: 3,
    name: 'دکتر مریم کریمی',
    speciality: 'مشاوره کودک و نوجوان',
    experience: 6,
    sessionCount: 156,
    rating: 4.7,
    isOnline: true,
  },
  {
    id: 4,
    name: 'دکتر علی نوری',
    speciality: 'مشاوره پیش از ازدواج',
    experience: 10,
    sessionCount: 290,
    rating: 4.6,
    isOnline: false,
  },
])

const userStats = ref({
  totalSessions: 8,
  completedSessions: 6,
  averageRating: 4.7,
  totalHours: 12,
})

const submitCounselingRequest = () => {
  // Logic to submit the counseling request
  console.log('Submitting request:', newRequest.value)
  showNewRequestForm.value = false
  // Reset form
  newRequest.value = {
    type: '',
    priority: 'normal',
    subject: '',
    description: '',
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'در انتظار'
    case 'confirmed':
      return 'تایید شده'
    case 'completed':
      return 'تکمیل شده'
    case 'cancelled':
      return 'لغو شده'
    default:
      return 'نامشخص'
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'emergency':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'فوری'
    case 'emergency':
      return 'اورژانس'
    default:
      return 'عادی'
  }
}

const getCounselingTypeText = (type: string) => {
  switch (type) {
    case 'individual':
      return 'مشاوره فردی'
    case 'couple':
      return 'مشاوره زوجین'
    case 'family':
      return 'مشاوره خانوادگی'
    case 'premarital':
      return 'مشاوره پیش از ازدواج'
    default:
      return 'نامشخص'
  }
}
</script>
