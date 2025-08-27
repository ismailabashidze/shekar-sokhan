<script setup lang="ts">
import { useVerifications } from '~/composables/hammasir/useVerifications'
import type { 
  VerificationDocumentDto, 
  VerificationStatusDto,
  VerificationRequestDto,
  KeycloakConsistencyValidationDto,
  SyncStatusDto
} from '~/types/api'

definePageMeta({
  title: 'درخواست‌های تأیید صلاحیت',
  layout: 'sidebar',
  middleware: ['auth', 'admin']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  userVerificationDocuments,
  userVerificationStatus,
  verificationRequests,
  currentSyncStatus,
  keycloakValidation,
  isVerificationLoading,
  isVerificationSubmitting,
  isVerificationSyncing,
  verificationError,
  getMyVerificationDocuments,
  registerVerificationDocument,
  submitVerificationRequest,
  getMyVerificationStatus,
  getAllVerificationRequests,
  updateVerificationStatus,
  validateKeycloakConsistency,
  getSyncStatus,
  syncWithKeycloak
} = useVerifications()

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Initialize data
onMounted(async () => {
  await loadRequests()
})

const loadRequests = async () => {
  try {
    await getAllVerificationRequests(currentPage.value, itemsPerPage.value, statusFilter.value, searchQuery.value)
  } catch (error) {
    console.error('Error loading verification requests:', error)
  }
}

const handleStatusChange = async (requestId: string, newStatus: string) => {
  try {
    await updateVerificationStatus(requestId, newStatus as any)
    // Refresh the list
    await loadRequests()
  } catch (error) {
    console.error('Error updating verification status:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'در انتظار بررسی',
    'APPROVED': 'تأیید شده',
    'REJECTED': 'رد شده',
    'SUSPENDED': 'تعلیق شده',
    'IN_PROGRESS': 'در حال پیگیری'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'SUSPENDED': 'bg-gray-100 text-gray-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getDocumentTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'CERTIFICATE': 'گواهی‌نامه',
    'DEGREE': 'مدرک تحصیلی',
    'LICENSE': 'پروانه کار',
    'CV': 'رزومه',
    'PORTFOLIO': 'نمونه کار',
    'OTHER': 'سایر'
  }
  return typeMap[type] || type
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              درخواست‌های تأیید صلاحیت
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مدیریت و بررسی درخواست‌های تأیید صلاحیت مشاوران
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <button
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="loadRequests"
            >
              <Icon name="ph:arrows-clockwise" class="ml-2 size-4" />
              <span>تازه‌سازی</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Filters -->
      <div class="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
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
                  placeholder="جستجو بر اساس نام یا شناسه..."
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @keyup.enter="loadRequests"
                >
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت
              </label>
              <div class="mt-1">
                <select
                  v-model="statusFilter"
                  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  @change="loadRequests"
                >
                  <option value="">
                    همه وضعیت‌ها
                  </option>
                  <option value="PENDING">
                    در انتظار بررسی
                  </option>
                  <option value="APPROVED">
                    تأیید شده
                  </option>
                  <option value="REJECTED">
                    رد شده
                  </option>
                  <option value="SUSPENDED">
                    تعلیق شده
                  </option>
                  <option value="IN_PROGRESS">
                    در حال پیگیری
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-end sm:col-span-2">
              <button
                class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="loadRequests"
              >
                <Icon name="ph:magnifying-glass" class="ml-2 size-4" />
                <span>اعمال فیلترها</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isVerificationLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری درخواست‌ها...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری درخواست‌ها
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ verificationError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadRequests"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Requests List -->
      <div v-else>
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              لیست درخواست‌ها
            </h3>
          </div>

          <div v-if="verificationRequests && verificationRequests.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    مشاور
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    وضعیت
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    تاریخ ثبت
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    تاریخ به‌روزرسانی
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    مدارک
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr
                  v-for="request in verificationRequests"
                  :key="request.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {{ request.counselor?.firstName }} {{ request.counselor?.lastName }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusClass(request.status)"
                    >
                      {{ getStatusText(request.status) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(request.submittedAt) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(request.updatedAt) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="document in request.documents"
                        :key="document.id"
                        class="inline-flex cursor-pointer rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        @click="router.push(`/hammasir/verifications/${document.id}`)"
                      >
                        {{ getDocumentTypeText(document.type) }}
                      </span>
                    </div>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex items-center justify-end space-x-2 space-x-reverse">
                      <NuxtLink
                        v-if="request.counselorId"
                        :to="`/hammasir/admin/counselors/${request.counselorId}`"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        پروفایل
                      </NuxtLink>
                      <button
                        v-if="request.status === 'PENDING'"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        @click="handleStatusChange(request.id, 'APPROVED')"
                      >
                        تأیید
                      </button>
                      <button
                        v-if="request.status === 'PENDING'"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        @click="handleStatusChange(request.id, 'REJECTED')"
                      >
                        رد
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="py-12 text-center">
            <Icon name="ph:clipboard-text" class="mx-auto size-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              درخواستی یافت نشد
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              هیچ درخواست تأیید صلاحیتی با فیلترهای انتخاب شده یافت نشد.
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="verificationRequests && verificationRequests.length > 0" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            نمایش
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            تا
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, verificationRequests.length) }}</span>
            از
            <span class="font-medium">{{ verificationRequests.length }}</span>
            درخواست
          </div>
          <div class="flex space-x-2 space-x-reverse">
            <button
              :disabled="currentPage === 1"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="currentPage--; loadRequests()"
            >
              قبلی
            </button>
            <button
              :disabled="currentPage * itemsPerPage >= verificationRequests.length"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="currentPage++; loadRequests()"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>