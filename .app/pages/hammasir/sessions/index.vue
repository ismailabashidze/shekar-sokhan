<script setup lang="ts">
import { useSessions } from '~/composables/hammasir/useSessions'
import type { CounselingSessionDto } from '~/types/api'

definePageMeta({
  title: 'جلسات مشاوره',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  userSessions,
  isSessionsLoading,
  sessionsError,
  getUserSessions,
  createSession,
  cancelSession,
} = useSessions()

const sessions = ref<CounselingSessionDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const showCreateForm = ref(false)
const isCreating = ref(false)

// Form data
const formData = ref({
  counselorId: '',
  scheduledTime: '',
  sessionType: 'individual',
  notes: '',
})

// Filter states
const statusFilter = ref('')
const dateFilter = ref('')

onMounted(async () => {
  await loadSessions()
})

const loadSessions = async () => {
  try {
    isLoading.value = true
    error.value = null
    await getUserSessions(1, 20, statusFilter.value)
    sessions.value = userSessions.value
  }
  catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری جلسات'
  }
  finally {
    isLoading.value = false
  }
}

const handleCreateSession = async () => {
  if (!formData.value.counselorId || !formData.value.scheduledTime) {
    error.value = 'لطفاً تمام فیلدهای الزامی را پر کنید'
    return
  }

  try {
    isCreating.value = true
    error.value = null

    const result = await createSession({
      counselorId: formData.value.counselorId,
      scheduledTime: new Date(formData.value.scheduledTime).toISOString(),
      sessionType: formData.value.sessionType,
      notes: formData.value.notes,
    })

    if (result) {
      showCreateForm.value = false
      resetForm()
      await loadSessions()
    }
  }
  catch (err: any) {
    error.value = err.message || 'خطا در ایجاد جلسه'
  }
  finally {
    isCreating.value = false
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

const resetForm = () => {
  formData.value = {
    counselorId: '',
    scheduledTime: '',
    sessionType: 'individual',
    notes: '',
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
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              جلسات مشاوره
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مدیریت جلسات مشاوره شما
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <button
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="showCreateForm = !showCreateForm"
            >
              <Icon name="ph:plus" class="ml-2 size-4" />
              درخواست جلسه جدید
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Create Session Form -->
      <div v-if="showCreateForm" class="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            درخواست جلسه جدید
          </h3>
        </div>
        <div class="px-4 py-5 sm:px-6">
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

          <form class="space-y-6" @submit.prevent="handleCreateSession">
            <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  مشاور
                </label>
                <div class="mt-1">
                  <input
                    v-model="formData.counselorId"
                    type="text"
                    placeholder="شناسه مشاور"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required
                  >
                </div>
              </div>

              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاریخ و زمان
                </label>
                <div class="mt-1">
                  <input
                    v-model="formData.scheduledTime"
                    type="datetime-local"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required
                  >
                </div>
              </div>

              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع جلسه
                </label>
                <div class="mt-1">
                  <select
                    v-model="formData.sessionType"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value="individual">
                      فردى
                    </option>
                    <option value="couple">
                      زوجین
                    </option>
                    <option value="family">
                      خانواده
                    </option>
                    <option value="group">
                      گروهى
                    </option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  یادداشت‌ها
                </label>
                <div class="mt-1">
                  <textarea
                    v-model="formData.notes"
                    rows="3"
                    class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="showCreateForm = false"
              >
                انصراف
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Icon
                  v-if="isCreating"
                  name="ph:spinner"
                  class="ml-2 size-4 animate-spin"
                />
                <span>{{ isCreating ? 'در حال ایجاد...' : 'درخواست جلسه' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                تاریخ
              </label>
              <div class="mt-1">
                <input
                  v-model="dateFilter"
                  type="date"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadSessions"
                >
              </div>
            </div>

            <div class="flex items-end sm:col-span-2">
              <button
                class="inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="loadSessions"
              >
                <Icon name="ph:funnel" class="ml-2 size-4" />
                اعمال فیلترها
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

      <!-- Sessions List -->
      <div v-else>
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              لیست جلسات
              <span class="mr-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ sessions.length }} جلسه)
              </span>
            </h3>
          </div>

          <div v-if="sessions.length === 0" class="py-12 text-center">
            <Icon name="ph:calendar-x" class="mx-auto size-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              جلسه‌ای یافت نشد
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              هنوز جلسه‌ای برای شما ثبت نشده است.
            </p>
          </div>

          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="session in sessions" :key="session.id">
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
                          class="mr-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                          :class="getStatusClass(session.status)"
                        >
                          {{ getStatusText(session.status) }}
                        </span>
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Icon name="ph:clock" class="mr-1.5 size-4 shrink-0" />
                        <span>{{ formatDateTime(session.scheduledTime) }}</span>
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Icon name="ph:tag" class="mr-1.5 size-4 shrink-0" />
                        <span>{{ getSessionTypeText(session.sessionType) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-3 space-x-reverse">
                    <button
                      v-if="session.status === 'SCHEDULED' || session.status === 'CONFIRMED'"
                      class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      @click="handleCancelSession(session.id)"
                    >
                      لغو جلسه
                    </button>
                    <button
                      class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      @click="getSessionById(session.id)"
                    >
                      جزئیات
                    </button>
                  </div>
                </div>
                <div v-if="session.notes" class="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="ph:note" class="mr-1.5 size-4 shrink-0" />
                  <span class="truncate">{{ session.notes }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
