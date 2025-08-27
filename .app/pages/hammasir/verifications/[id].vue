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
  title: 'جزئیات تأیید صلاحیت',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

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

const verificationId = route.params.id as string
const selectedDocument = ref<VerificationDocumentDto | null>(null)
const isDocumentLoading = ref(false)

// Initialize data
onMounted(async () => {
  await loadDocumentDetails()
})

const loadDocumentDetails = async () => {
  isDocumentLoading.value = true
  try {
    // In a real implementation, you would fetch the specific document by ID
    // For now, we'll simulate getting the document from the list
    await getMyVerificationDocuments()
    
    if (userVerificationDocuments.value) {
      selectedDocument.value = userVerificationDocuments.value.find(doc => doc.id === verificationId) || null
    }
  } catch (error) {
    console.error('Error loading document details:', error)
  } finally {
    isDocumentLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '-'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Back button -->
      <div class="mb-6">
        <button
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="router.back()"
        >
          <Icon name="ph:arrow-right" class="ml-2 size-4" />
          <span>بازگشت</span>
        </button>
      </div>

      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          جزئیات مدرک تأیید صلاحیت
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          اطلاعات کامل درباره مدرک انتخاب شده
        </p>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Loading State -->
      <div v-if="isDocumentLoading || isVerificationLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری جزئیات مدرک...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری جزئیات مدرک
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ verificationError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadDocumentDetails"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Details -->
      <div v-else-if="selectedDocument" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center">
              <div class="flex size-16 items-center justify-center rounded-xl border-2 border-dashed bg-gray-200 dark:bg-gray-700">
                <Icon name="ph:file-text" class="size-8 text-gray-500 dark:text-gray-400" />
              </div>
              <div class="mr-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ selectedDocument.fileName }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ getDocumentTypeText(selectedDocument.type) }}
                </p>
              </div>
            </div>
            <div class="mt-4 md:mt-0">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="getStatusClass(selectedDocument.status || 'PENDING')"
              >
                {{ getStatusText(selectedDocument.status || 'PENDING') }}
              </span>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Document Information -->
            <div>
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                اطلاعات مدرک
              </h3>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    شناسه مدرک
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedDocument.id }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نوع مدرک
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ getDocumentTypeText(selectedDocument.type) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام فایل
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedDocument.fileName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    اندازه فایل
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatFileSize(selectedDocument.fileSize) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نوع فایل
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedDocument.mimeType || '-' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ آپلود
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(selectedDocument.createdAt) }}
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    توضیحات
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedDocument.description || 'بدون توضیحات' }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Document Preview -->
            <div>
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                پیش‌نمایش مدرک
              </h3>
              <div class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50">
                <div class="text-center">
                  <Icon name="ph:file" class="mx-auto size-12 text-gray-400 dark:text-gray-500" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    پیش‌نمایش مدرک
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    (در صورت موجود بودن فایل)
                  </p>
                  <button class="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    دانلود مدرک
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Document Status History -->
          <div class="mt-8">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              تاریخچه وضعیت
            </h3>
            <div class="overflow-hidden rounded-md bg-gray-50 shadow ring-1 ring-black/5 dark:bg-gray-700/50 dark:ring-gray-600">
              <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      وضعیت
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      تاریخ
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      توضیحات
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">عملیات</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                      <span
                        class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        :class="getStatusClass(selectedDocument.status || 'PENDING')"
                      >
                        {{ getStatusText(selectedDocument.status || 'PENDING') }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(selectedDocument.createdAt) }}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      مدرک آپلود شد
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <span class="text-gray-500 dark:text-gray-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Document Actions -->
          <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
            <button
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="router.back()"
            >
              بازگشت
            </button>
            <button class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <Icon name="ph:download" class="ml-2 size-4" />
              <span>دانلود مدرک</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-md bg-gray-50 p-12 text-center shadow dark:bg-gray-800">
        <Icon name="ph:file-x" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          مدرک یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          مدرک مورد نظر یافت نشد یا دسترسی به آن محدود شده است.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="router.back()"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            <span>بازگشت</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>