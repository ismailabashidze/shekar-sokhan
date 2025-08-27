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
  title: 'همگام‌سازی تأیید صلاحیت',
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

const isSyncing = ref(false)
const syncResult = ref<{ success: boolean; message: string } | null>(null)

// Initialize data
onMounted(async () => {
  await Promise.all([
    getSyncStatus(),
    validateKeycloakConsistency('all')
  ])
})

const handleSync = async () => {
  isSyncing.value = true
  syncResult.value = null

  try {
    const result = await syncWithKeycloak()
    if (result) {
      syncResult.value = {
        success: true,
        message: 'همگام‌سازی با موفقیت انجام شد'
      }
      // Refresh sync status
      await getSyncStatus()
    }
  } catch (error: any) {
    syncResult.value = {
      success: false,
      message: error.message || 'خطا در همگام‌سازی'
    }
  } finally {
    isSyncing.value = false
  }
}

const handleValidate = async (counselorId?: string) => {
  try {
    const result = await validateKeycloakConsistency(counselorId || 'all')
    if (result) {
      // Show validation result
      console.log('Validation result:', result)
    }
  } catch (error: any) {
    console.error('Validation error:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const getSyncStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'SUCCESS': 'موفق',
    'FAILED': 'ناموفق',
    'IN_PROGRESS': 'در حال انجام',
    'PENDING': 'در انتظار'
  }
  return statusMap[status] || status
}

const getSyncStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'SUCCESS': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'PENDING': 'bg-yellow-100 text-yellow-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          همگام‌سازی تأیید صلاحیت
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          مدیریت همگام‌سازی داده‌های تأیید صلاحیت با سیستم‌های خارجی
        </p>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Sync Status -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          وضعیت همگام‌سازی
        </h2>

        <div v-if="isVerificationLoading" class="py-8 text-center">
          <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-indigo-500" />
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            در حال بارگذاری وضعیت همگام‌سازی...
          </p>
        </div>

        <div v-else-if="currentSyncStatus" class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              وضعیت آخرین همگام‌سازی
            </div>
            <div class="mt-1 flex items-center">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="getSyncStatusClass(currentSyncStatus.status)"
              >
                {{ getSyncStatusText(currentSyncStatus.status) }}
              </span>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              تاریخ آخرین همگام‌سازی
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(currentSyncStatus.lastSyncedAt) }}
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              تعداد رکوردهای همگام‌سازی‌شده
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ currentSyncStatus.recordsProcessed }}
            </div>
          </div>

          <div class="sm:col-span-3">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              پیام‌های خطا (در صورت وجود)
            </div>
            <div v-if="currentSyncStatus.errorMessage" class="mt-1 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {{ currentSyncStatus.errorMessage }}
            </div>
            <div v-else class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              هیچ خطایی در همگام‌سازی گزارش نشده است
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <Icon name="ph:warning" class="mx-auto size-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            وضعیت همگام‌سازی یافت نشد
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            هنوز همگام‌سازی‌ای انجام نشده است.
          </p>
        </div>
      </div>

      <!-- Sync Controls -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          کنترل‌های همگام‌سازی
        </h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-600">
            <h3 class="mb-4 text-base font-medium text-gray-900 dark:text-white">
              همگام‌سازی کامل
            </h3>
            <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
              اجرای همگام‌سازی کامل تمام داده‌های تأیید صلاحیت با سیستم‌های خارجی
            </p>
            <button
              :disabled="isSyncing || isVerificationSyncing"
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              @click="handleSync"
            >
              <Icon
                v-if="isSyncing || isVerificationSyncing"
                name="ph:spinner"
                class="ml-2 size-4 animate-spin"
              />
              <span>{{ isSyncing || isVerificationSyncing ? 'در حال همگام‌سازی...' : 'اجرای همگام‌سازی کامل' }}</span>
            </button>
          </div>

          <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-600">
            <h3 class="mb-4 text-base font-medium text-gray-900 dark:text-white">
              اعتبارسنجی داده‌ها
            </h3>
            <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
              بررسی یکپارچگی داده‌های تأیید صلاحیت با سیستم‌های خارجی
            </p>
            <button
              :disabled="isVerificationLoading"
              class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              @click="handleValidate()"
            >
              <Icon
                v-if="isVerificationLoading"
                name="ph:spinner"
                class="ml-2 size-4 animate-spin"
              />
              <span>{{ isVerificationLoading ? 'در حال اعتبارسنجی...' : 'اجرای اعتبارسنجی' }}</span>
            </button>
          </div>
        </div>

        <!-- Sync Result -->
        <div v-if="syncResult" class="mt-6">
          <div
            class="rounded-md p-4"
            :class="syncResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'"
          >
            <div class="flex">
              <div class="shrink-0">
                <Icon
                  :name="syncResult.success ? 'ph:check-circle' : 'ph:x-circle'"
                  :class="syncResult.success ? 'text-green-400' : 'text-red-400'"
                  class="size-5"
                />
              </div>
              <div class="mr-3">
                <h3
                  class="text-sm font-medium"
                  :class="syncResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'"
                >
                  {{ syncResult.success ? 'همگام‌سازی موفق' : 'خطا در همگام‌سازی' }}
                </h3>
                <div
                  class="mt-2 text-sm"
                  :class="syncResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
                >
                  <p>{{ syncResult.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Results -->
      <div v-if="keycloakValidation" class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          نتایج اعتبارسنجی
        </h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              وضعیت اعتبارسنجی
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ keycloakValidation.isValid ? 'معتبر' : 'نامعتبر' }}
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              تعداد کاربران بررسی‌شده
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ keycloakValidation.validatedUsersCount }}
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              تعداد ناسازگاری‌ها
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ keycloakValidation.inconsistencies?.length || 0 }}
            </div>
          </div>
        </div>

        <div v-if="keycloakValidation.inconsistencies && keycloakValidation.inconsistencies.length > 0" class="mt-6">
          <h3 class="mb-3 text-base font-medium text-gray-900 dark:text-white">
            لیست ناسازگاری‌ها
          </h3>
          <div class="overflow-hidden rounded-md shadow ring-1 ring-black/5 dark:ring-gray-600">
            <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    شناسه کاربر
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    نوع ناسازگاری
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    توضیحات
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr
                  v-for="inconsistency in keycloakValidation.inconsistencies"
                  :key="inconsistency.userId"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {{ inconsistency.userId }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ inconsistency.type }}
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ inconsistency.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>