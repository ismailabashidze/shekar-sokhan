<script setup lang="ts">
import { useSessions } from '~/composables/hammasir/useSessions'
import type { CounselingSessionDto } from '~/types/api'

definePageMeta({
  title: 'جزئیات جلسه مشاوره',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

const {
  currentSession,
  isSessionsLoading,
  sessionsError,
  getSessionById,
  updateSession,
  cancelSession,
} = useSessions()

const session = ref<CounselingSessionDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isUpdating = ref(false)
const showEditForm = ref(false)

// Form data for editing session
const editForm = ref({
  notes: '',
  status: '',
})

const sessionId = route.params.id as string

onMounted(async () => {
  await loadSession()
})

const loadSession = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // First try to get from the composable state
    if (currentSession.value && currentSession.value.id === sessionId) {
      session.value = currentSession.value
      return
    }
    
    // If not in state, fetch from API
    const result = await getSessionById(sessionId)
    if (result) {
      session.value = result
      // Initialize form with current data
      editForm.value.notes = result.notes || ''
      editForm.value.status = result.status
    } else {
      error.value = 'جلسه یافت نشد'
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری جلسه'
  } finally {
    isLoading.value = false
  }
}

const handleUpdateSession = async () => {
  if (!session.value) return

  try {
    isUpdating.value = true
    error.value = null

    const result = await updateSession(sessionId, {
      notes: editForm.value.notes,
      status: editForm.value.status,
    })

    if (result) {
      session.value = result
      showEditForm.value = false
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در به‌روزرسانی جلسه'
  } finally {
    isUpdating.value = false
  }
}

const handleCancelSession = async () => {
  if (!session.value || !confirm('آیا از لغو این جلسه اطمینان دارید؟')) return

  try {
    const result = await cancelSession(sessionId)
    if (result) {
      // Refresh the session data
      await loadSession()
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در لغو جلسه'
  }
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

const toggleEditForm = () => {
  showEditForm.value = !showEditForm.value
  if (session.value) {
    editForm.value.notes = session.value.notes || ''
    editForm.value.status = session.value.status
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="goBack"
        >
          <Icon name="ph:arrow-right" class="ml-2 size-4" />
          <span>بازگشت</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading || isSessionsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری جلسه...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error || sessionsError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ error || sessionsError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadSession"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Details -->
      <div v-else-if="session" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Session Header -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center">
              <div class="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Icon name="ph:calendar" class="size-8 text-white" />
              </div>
              <div class="mr-4">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  جلسه مشاوره
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ session.counselor?.name || 'مشاور نامشخص' }}
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center md:mt-0">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="getStatusClass(session.status)"
              >
                {{ getStatusText(session.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-wrap items-center justify-end gap-3">
            <button
              v-if="session.status === 'SCHEDULED' || session.status === 'CONFIRMED'"
              class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              @click="handleCancelSession"
            >
              <Icon name="ph:x-circle" class="ml-2 size-4" />
              <span>لغو جلسه</span>
            </button>
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="toggleEditForm"
            >
              <Icon name="ph:pencil-simple" class="ml-2 size-4" />
              <span>{{ showEditForm ? 'انصراف' : 'ویرایش' }}</span>
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="showEditForm" class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
            <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              ویرایش جلسه
            </h2>
            
            <div v-if="error" class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
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
                </div>
              </div>
            </div>
            
            <form class="space-y-6" @submit.prevent="handleUpdateSession">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  یادداشت‌ها
                </label>
                <div class="mt-1">
                  <textarea
                    v-model="editForm.notes"
                    rows="4"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  وضعیت
                </label>
                <div class="mt-1">
                  <select
                    v-model="editForm.status"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white sm:text-sm"
                  >
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
              
              <div class="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  @click="toggleEditForm"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <Icon
                    v-if="isUpdating"
                    name="ph:spinner"
                    class="ml-2 size-4 animate-spin"
                  />
                  <span>{{ isUpdating ? 'در حال به‌روزرسانی...' : 'ذخیره تغییرات' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Session Details -->
        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Session Information -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                اطلاعات جلسه
              </h2>
              
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    شناسه جلسه
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.id }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نوع جلسه
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ getSessionTypeText(session.sessionType) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ و زمان
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDateTime(session.scheduledTime) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    مدت زمان
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.duration }} دقیقه
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    یادداشت‌ها
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.notes || 'بدون یادداشت' }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Counselor Information -->
            <div>
              <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                اطلاعات مشاور
              </h2>
              
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام مشاور
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.counselor?.name || 'نامشخص' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تخصص
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.counselor?.specialization || 'نامشخص' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    امتیاز
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.counselor?.rating || 'نامشخص' }}
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    توضیحات
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ session.counselor?.bio || 'بدون توضیحات' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="border-t border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <h2 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            تاریخچه جلسه
          </h2>
          
          <div class="flow-root">
            <ul class="-mb-8">
              <li>
                <div class="relative pb-8">
                  <span class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  <div class="relative flex space-x-3 space-x-reverse">
                    <div>
                      <span class="flex size-8 items-center justify-center rounded-full bg-blue-500">
                        <Icon name="ph:calendar-plus" class="size-4 text-white" />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5">
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-medium text-gray-900 dark:text-white">
                          جلسه ایجاد شد
                        </span>
                        <span class="mr-2 whitespace-nowrap">
                          {{ formatDateTime(session.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="session.updatedAt !== session.createdAt">
                <div class="relative pb-8">
                  <span class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  <div class="relative flex space-x-3 space-x-reverse">
                    <div>
                      <span class="flex size-8 items-center justify-center rounded-full bg-green-500">
                        <Icon name="ph:pencil-simple" class="size-4 text-white" />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5">
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-medium text-gray-900 dark:text-white">
                          جلسه به‌روزرسانی شد
                        </span>
                        <span class="mr-2 whitespace-nowrap">
                          {{ formatDateTime(session.updatedAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="relative pb-8">
                  <div class="relative flex space-x-3 space-x-reverse">
                    <div>
                      <span
                        class="flex size-8 items-center justify-center rounded-full"
                        :class="session.status === 'SCHEDULED' || session.status === 'CONFIRMED' ? 'bg-yellow-500' : 'bg-gray-500'"
                      >
                        <Icon
                          :name="session.status === 'SCHEDULED' || session.status === 'CONFIRMED' ? 'ph:clock' : 'ph:check'"
                          class="size-4 text-white"
                        />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5">
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        <span
                          class="font-medium"
                          :class="session.status === 'SCHEDULED' || session.status === 'CONFIRMED' ? 'text-gray-900 dark:text-white' : 'text-green-600 dark:text-green-400'"
                        >
                          {{ session.status === 'SCHEDULED' || session.status === 'CONFIRMED' ? 'جلسه در انتظار انجام' : 'جلسه تکمیل شد' }}
                        </span>
                        <span
                          v-if="session.status === 'COMPLETED'"
                          class="mr-2 whitespace-nowrap"
                        >
                          {{ formatDateTime(session.updatedAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-md bg-gray-50 p-12 text-center dark:bg-gray-800">
        <Icon name="ph:calendar-x" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          جلسه یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          جلسه مورد نظر یافت نشد یا دسترسی به آن محدود شده است.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            <span>بازگشت</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>