<script setup lang="ts">
import { useSessions } from '~/composables/hammasir/useSessions'
import { usePublicCounselors } from '~/composables/hammasir/usePublicCounselors'
import type { CreateSessionDto, CounselorPublicProfileDto } from '~/types/api'

definePageMeta({
  title: 'درخواست جلسه جدید',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()

const {
  isSessionsLoading,
  sessionsError,
  createSession,
} = useSessions()

const {
  publicCounselorsList,
  isCounselorsLoading,
  counselorsError,
  getPublicCounselors,
} = usePublicCounselors()

const counselors = ref<CounselorPublicProfileDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCreating = ref(false)

// Form data
const formData = ref<CreateSessionDto>({
  counselorId: '',
  scheduledTime: '',
  sessionType: 'individual',
  notes: '',
})

// Form validation
const formErrors = ref<Record<string, string>>({})

onMounted(async () => {
  await loadCounselors()
})

const loadCounselors = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const result = await getPublicCounselors(1, 50)
    if (result) {
      counselors.value = result.counselors
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری لیست مشاوران'
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  const errors: Record<string, string> = {}
  
  if (!formData.value.counselorId) {
    errors.counselorId = 'انتخاب مشاور الزامی است'
  }
  
  if (!formData.value.scheduledTime) {
    errors.scheduledTime = 'انتخاب تاریخ و زمان جلسه الزامی است'
  }
  
  if (!formData.value.sessionType) {
    errors.sessionType = 'انتخاب نوع جلسه الزامی است'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    isCreating.value = true
    error.value = null
    
    const result = await createSession(formData.value)
    if (result) {
      // Redirect to sessions list with success message
      router.push({
        path: '/hammasir/sessions',
        query: { success: 'جلسه با موفقیت ثبت شد' }
      })
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در ثبت جلسه'
  } finally {
    isCreating.value = false
  }
}

const getSpecializationsText = (specializations: any[]) => {
  if (!specializations || specializations.length === 0) return 'بدون تخصص'
  return specializations.map(s => s.name).join(', ')
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              درخواست جلسه جدید
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              درخواست جلسه مشاوره با مشاوران ما
            </p>
          </div>
          <NuxtLink
            to="/hammasir/sessions"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            <span>بازگشت به جلسات</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading || isCounselorsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری مشاوران...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error || counselorsError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ error || counselorsError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadCounselors"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                اطلاعات جلسه
              </h2>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <!-- Form Error -->
              <div v-if="error || sessionsError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div class="flex">
                  <div class="shrink-0">
                    <Icon name="ph:x-circle" class="size-5 text-red-400" />
                  </div>
                  <div class="mr-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                      خطا در ثبت جلسه
                    </h3>
                    <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{{ error || sessionsError }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Counselor Selection -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    مشاور <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <select
                      v-model="formData.counselorId"
                      :class="[
                        'block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white',
                        formErrors.counselorId 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      ]"
                    >
                      <option value="">
                        انتخاب مشاور
                      </option>
                      <option
                        v-for="counselor in counselors"
                        :key="counselor.id"
                        :value="counselor.id"
                      >
                        {{ counselor.firstName }} {{ counselor.lastName }} - {{ getSpecializationsText(counselor.specializations) }}
                      </option>
                    </select>
                    <p v-if="formErrors.counselorId" class="mt-2 text-sm text-red-600">
                      {{ formErrors.counselorId }}
                    </p>
                  </div>
                </div>

                <!-- Session Type -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    نوع جلسه <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <label
                      v-for="type in sessionTypes"
                      :key="type.value"
                      class="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none"
                      :class="[
                        formData.sessionType === type.value
                          ? 'z-10 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-300 dark:border-gray-600',
                        formErrors.sessionType ? 'border-red-300 dark:border-red-600' : ''
                      ]"
                    >
                      <input
                        v-model="formData.sessionType"
                        type="radio"
                        :value="type.value"
                        class="sr-only"
                        :aria-labelledby="`session-type-${type.value}-label`"
                        :aria-describedby="`session-type-${type.value}-description`"
                      >
                      <span class="flex flex-1">
                        <span class="flex flex-col">
                          <span
                            id="`session-type-${type.value}-label`"
                            class="block text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {{ type.label }}
                          </span>
                          <span
                            id="`session-type-${type.value}-description`"
                            class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            <Icon :name="type.icon" class="ml-1.5 size-4" />
                            {{ type.description }}
                          </span>
                        </span>
                      </span>
                      <Icon
                        v-if="formData.sessionType === type.value"
                        name="ph:check-circle"
                        class="size-5 text-indigo-600"
                      />
                    </label>
                  </div>
                  <p v-if="formErrors.sessionType" class="mt-2 text-sm text-red-600">
                    {{ formErrors.sessionType }}
                  </p>
                </div>

                <!-- Scheduled Time -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    تاریخ و زمان جلسه <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      v-model="formData.scheduledTime"
                      type="datetime-local"
                      :class="[
                        'block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white',
                        formErrors.scheduledTime 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      ]"
                    >
                    <p v-if="formErrors.scheduledTime" class="mt-2 text-sm text-red-600">
                      {{ formErrors.scheduledTime }}
                    </p>
                  </div>
                </div>

                <!-- Notes -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    یادداشت‌ها
                  </label>
                  <div class="mt-1">
                    <textarea
                      v-model="formData.notes"
                      rows="4"
                      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="هر گونه اطلاعات اضافی که می‌خواهید با مشاور در میان بگذارید..."
                    />
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end space-x-3 space-x-reverse">
                  <NuxtLink
                    to="/hammasir/sessions"
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    انصراف
                  </NuxtLink>
                  <button
                    type="submit"
                    :disabled="isCreating || isSessionsLoading"
                    class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <Icon
                      v-if="isCreating || isSessionsLoading"
                      name="ph:spinner"
                      class="ml-2 size-4 animate-spin"
                    />
                    <span>{{ isCreating || isSessionsLoading ? 'در حال ثبت...' : 'ثبت جلسه' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Counselors List -->
        <div class="lg:col-span-1">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                مشاوران پیشنهادی
              </h2>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div v-if="counselors.length === 0" class="py-8 text-center">
                <Icon name="ph:users" class="mx-auto size-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  مشاوری یافت نشد
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  در حال حاضر مشاوری برای نمایش وجود ندارد.
                </p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="counselor in counselors.slice(0, 5)"
                  :key="counselor.id"
                  class="flex items-start rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {{ counselor.firstName.charAt(0) }}{{ counselor.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div class="mr-3 min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {{ counselor.firstName }} {{ counselor.lastName }}
                    </p>
                    <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                      {{ getSpecializationsText(counselor.specializations) }}
                    </p>
                    <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Icon name="ph:star" class="ml-1 size-3.5 text-yellow-400" />
                      <span>{{ counselor.rating || 0 }}/5</span>
                      <span class="mx-1">•</span>
                      <span>{{ counselor.sessionCount || 0 }} جلسه</span>
                    </div>
                  </div>
                </div>

                <NuxtLink
                  to="/hammasir/counselors"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  مشاهده همه مشاوران
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                راهنمایی
              </h2>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <Icon name="ph:info" class="ml-3 mt-0.5 size-5 shrink-0 text-blue-500" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      انتخاب مشاور
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      مشاور خود را از بین لیست مشاوران پیشنهادی انتخاب کنید.
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:clock" class="ml-3 mt-0.5 size-5 shrink-0 text-blue-500" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      زمان‌بندی
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      زمان جلسه را با توجه به در دسترس بودن مشاور انتخاب کنید.
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:note" class="ml-3 mt-0.5 size-5 shrink-0 text-blue-500" />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      یادداشت‌ها
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      هر گونه اطلاعات اضافی که می‌خواهید با مشاور در میان بگذارید را در این قسمت بنویسید.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Session types data
const sessionTypes = [
  {
    value: 'individual',
    label: 'فردى',
    description: 'جلسه با یک مشاور',
    icon: 'ph:user'
  },
  {
    value: 'couple',
    label: 'زوجین',
    description: 'جلسه برای زوج‌ها',
    icon: 'ph:users'
  },
  {
    value: 'family',
    label: 'خانواده',
    description: 'جلسه خانوادگی',
    icon: 'ph:house'
  },
  {
    value: 'group',
    label: 'گروهى',
    description: 'جلسه گروهی',
    icon: 'ph:users-three'
  }
]

export default {
  setup() {
    return {
      sessionTypes
    }
  }
}
</script>