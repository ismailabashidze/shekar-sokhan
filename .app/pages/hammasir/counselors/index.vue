<script setup lang="ts">
import { usePublicCounselors } from '~/composables/hammasir/usePublicCounselors'
import type { CounselorPublicProfileDto } from '~/types/api'

definePageMeta({
  title: 'لیست مشاوران',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  publicCounselorsList,
  isCounselorsLoading,
  counselorsError,
  getPublicCounselors,
  getCounselorAvailability,
  getAvailableTimeSlots,
} = usePublicCounselors()

const searchQuery = ref('')
const specializationFilter = ref('')
const experienceFilter = ref('')
const ratingFilter = ref(0)
const showFilters = ref(false)

// Mock data for specializations
const specializations = ref([
  { id: 'premarital', name: 'پیش از ازدواج' },
  { id: 'couple', name: 'زوجین' },
  { id: 'family', name: 'خانواده' },
  { id: 'individual', name: 'فردى' },
  { id: 'career', name: 'حرفه‌اى' },
])

// Mock data for experience levels
const experienceLevels = ref([
  { id: 'beginner', name: 'مبتدی (1-3 سال)' },
  { id: 'intermediate', name: 'متوسط (3-7 سال)' },
  { id: 'expert', name: 'حرفه‌اى (بیش از 7 سال)' },
])

// Filtered counselors
const filteredCounselors = computed(() => {
  let counselors = publicCounselorsList.value || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    counselors = counselors.filter(counselor =>
      counselor.firstName.toLowerCase().includes(query)
      || counselor.lastName.toLowerCase().includes(query)
      || (counselor.specializations && counselor.specializations.some(spec =>
        spec.name.toLowerCase().includes(query))),
    )
  }

  if (specializationFilter.value) {
    counselors = counselors.filter(counselor =>
      counselor.specializations && counselor.specializations.some(spec =>
        spec.name === specializationFilter.value),
    )
  }

  if (experienceFilter.value) {
    // Mock experience filtering
    counselors = counselors.filter((counselor) => {
      // In a real implementation, this would be based on actual experience data
      return experienceFilter.value === 'expert' ? true : true
    })
  }

  return counselors
})

// Load counselors on mount
onMounted(async () => {
  await getPublicCounselors(1, 20)
})

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

// View counselor profile
const viewCounselorProfile = (counselorId: string) => {
  navigateTo(`/hammasir/counselors/${counselorId}`)
}

// Book appointment
const bookAppointment = (counselorId: string) => {
  navigateTo(`/hammasir/counselors/${counselorId}/book`)
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              لیست مشاوران
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مشاوران متخصص در زمینه‌های مختلف روان‌شناسی
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="showFilters = !showFilters"
            >
              <Icon name="ph:funnel" class="ml-2 size-4" />
              <span>فیلترها</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Filters -->
      <div v-show="showFilters" class="mb-6 overflow-hidden rounded-lg bg-white shadow transition-all duration-300 dark:bg-gray-800">
        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                جستجو
              </label>
              <div class="mt-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="نام مشاور یا تخصص..."
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                تخصص
              </label>
              <div class="mt-1">
                <select
                  v-model="specializationFilter"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="">
                    همه تخصص‌ها
                  </option>
                  <option
                    v-for="specialization in specializations"
                    :key="specialization.id"
                    :value="specialization.id"
                  >
                    {{ specialization.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                سابقه کار
              </label>
              <div class="mt-1">
                <select
                  v-model="experienceFilter"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="">
                    همه سطوح
                  </option>
                  <option
                    v-for="level in experienceLevels"
                    :key="level.id"
                    :value="level.id"
                  >
                    {{ level.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="getPublicCounselors(1, 20, searchQuery, specializationFilter)"
            >
              <Icon name="ph:magnifying-glass" class="ml-2 size-4" />
              <span>اعمال فیلترها</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isCounselorsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری مشاوران...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="counselorsError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری مشاوران
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ counselorsError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="getPublicCounselors(1, 20)"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCounselors.length === 0" class="py-12 text-center">
        <Icon name="ph:users" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          مشاوری یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          هیچ مشاوری با فیلترهای انتخاب شده یافت نشد.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="resetFilters"
          >
            <Icon name="ph:arrows-clockwise" class="ml-2 size-4" />
            <span>بازنشانی فیلترها</span>
          </button>
        </div>
      </div>

      <!-- Counselors List -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="counselor in filteredCounselors"
          :key="counselor.id"
          class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="shrink-0">
                <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
              </div>
              <div class="mr-4 min-w-0 flex-1">
                <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
                  {{ counselor.firstName }} {{ counselor.lastName }}
                </h3>
                <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                  {{ counselor.specializations?.map(s => s.name).join(', ') || 'متخصص' }}
                </p>
              </div>
            </div>

            <div class="mt-4 flex items-center">
              <div class="flex items-center">
                <div class="flex">
                  <Icon
                    v-for="(star, index) in getRatingStars(counselor.rating || 0)"
                    :key="index"
                    :name="star === 'full' ? 'ph:star-fill' : star === 'half' ? 'ph:star-half-fill' : 'ph:star'"
                    class="size-4 text-yellow-400"
                  />
                </div>
                <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  ({{ counselor.rating || 0 }})
                </span>
              </div>
              <div class="mr-auto text-sm text-gray-500 dark:text-gray-400">
                {{ counselor.sessionCount || 0 }} جلسه
              </div>
            </div>

            <div class="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Icon name="ph:map-pin" class="ml-1 size-4" />
              <span>{{ counselor.city || 'تهران' }}</span>
            </div>

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(counselor.hourlyRate || 200000) }}
                  <span class="text-xs text-gray-500 dark:text-gray-400">/جلسه</span>
                </div>
                <div class="flex items-center">
                  <div
                    :class="counselor.isOnline ? 'bg-green-400' : 'bg-gray-400'"
                    class="ml-1 size-2 rounded-full"
                  />
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ counselor.isOnline ? 'آنلاین' : 'آفلاین' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex space-x-3 space-x-reverse">
              <button
                class="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="viewCounselorProfile(counselor.id)"
              >
                <Icon name="ph:eye" class="ml-1 size-4" />
                <span>مشاهده</span>
              </button>
              <button
                class="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="bookAppointment(counselor.id)"
              >
                <Icon name="ph:calendar-plus" class="ml-1 size-4" />
                <span>رزرو</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function resetFilters() {
  throw new Error('Function not implemented.')
}
</script>
