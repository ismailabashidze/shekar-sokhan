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
  title: 'تأیید صلاحیت مشاوران',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
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

const newDocument = ref({
  type: 'CERTIFICATE',
  fileName: '',
  fileSize: 0,
  mimeType: '',
  description: ''
})

const isUploading = ref(false)
const uploadError = ref<string | null>(null)

// Initialize data
onMounted(async () => {
  await Promise.all([
    getMyVerificationDocuments(),
    getMyVerificationStatus()
  ])
})

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

const handleDocumentUpload = async () => {
  if (!newDocument.value.fileName) {
    uploadError.value = 'لطفاً نام فایل را وارد کنید'
    return
  }

  isUploading.value = true
  uploadError.value = null

  try {
    // In a real implementation, you would upload the file first
    // and then register the document with the returned file ID
    const mockDocument: VerificationDocumentDto = {
      id: Date.now().toString(),
      type: newDocument.value.type as any,
      fileName: newDocument.value.fileName,
      fileSize: newDocument.value.fileSize,
      mimeType: newDocument.value.mimeType,
      description: newDocument.value.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await registerVerificationDocument(mockDocument)
    
    // Reset form
    newDocument.value = {
      type: 'CERTIFICATE',
      fileName: '',
      fileSize: 0,
      mimeType: '',
      description: ''
    }
  } catch (error: any) {
    uploadError.value = error.message || 'خطا در آپلود مدرک'
  } finally {
    isUploading.value = false
  }
}

const handleSubmitVerification = async () => {
  try {
    const result = await submitVerificationRequest()
    if (result) {
      // Refresh status
      await getMyVerificationStatus()
    }
  } catch (error: any) {
    console.error('Error submitting verification:', error)
  }
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          تأیید صلاحیت مشاور
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          مدیریت مدارک و وضعیت تأیید صلاحیت شما
        </p>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Error Messages -->
      <div v-if="verificationError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ verificationError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Verification Status -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            وضعیت تأیید صلاحیت
          </h2>
          <button
            :disabled="isVerificationSubmitting"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            @click="handleSubmitVerification"
          >
            <Icon
              v-if="isVerificationSubmitting"
              name="ph:spinner"
              class="ml-2 size-4 animate-spin"
            />
            <span>{{ isVerificationSubmitting ? 'در حال ارسال...' : 'ارسال درخواست تأیید' }}</span>
          </button>
        </div>

        <div v-if="userVerificationStatus" class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              وضعیت فعلی
            </div>
            <div class="mt-1 flex items-center">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="getStatusClass(userVerificationStatus.status)"
              >
                {{ getStatusText(userVerificationStatus.status) }}
              </span>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              تاریخ ثبت
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(userVerificationStatus.submittedAt) }}
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              آخرین به‌روزرسانی
            </div>
            <div class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(userVerificationStatus.updatedAt) }}
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <Icon name="ph:warning" class="mx-auto size-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            وضعیت تأیید صلاحیت یافت نشد
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            هنوز درخواست تأیید صلاحیتی ثبت نکرده‌اید.
          </p>
        </div>
      </div>

      <!-- Upload Documents -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          آپلود مدارک
        </h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع مدرک *
                </label>
                <select
                  v-model="newDocument.type"
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="CERTIFICATE">
                    گواهی‌نامه
                  </option>
                  <option value="DEGREE">
                    مدرک تحصیلی
                  </option>
                  <option value="LICENSE">
                    پروانه کار
                  </option>
                  <option value="CV">
                    رزومه
                  </option>
                  <option value="PORTFOLIO">
                    نمونه کار
                  </option>
                  <option value="OTHER">
                    سایر
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  نام فایل *
                </label>
                <input
                  v-model="newDocument.fileName"
                  type="text"
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="مثال: گواهی‌نامه روان‌شناسی.pdf"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  اندازه فایل (بایت)
                </label>
                <input
                  v-model.number="newDocument.fileSize"
                  type="number"
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="مثال: 1024000"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع فایل (MIME)
                </label>
                <input
                  v-model="newDocument.mimeType"
                  type="text"
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="مثال: application/pdf"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  توضیحات
                </label>
                <textarea
                  v-model="newDocument.description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="توضیحات مربوط به مدرک..."
                />
              </div>

              <div class="flex justify-end space-x-3 space-x-reverse">
                <button
                  :disabled="isUploading"
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  @click="handleDocumentUpload"
                >
                  <Icon
                    v-if="isUploading"
                    name="ph:spinner"
                    class="ml-2 size-4 animate-spin"
                  />
                  <span>{{ isUploading ? 'در حال آپلود...' : 'آپلود مدرک' }}</span>
                </button>
              </div>
            </div>

            <div v-if="uploadError" class="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div class="flex">
                <div class="shrink-0">
                  <Icon name="ph:x-circle" class="size-5 text-red-400" />
                </div>
                <div class="mr-3">
                  <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                    خطا در آپلود مدرک
                  </h3>
                  <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{{ uploadError }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
            <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              راهنمای آپلود مدارک
            </h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start">
                <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                <span>مدارک باید به وضوح خوانا و قابل تشخیص باشند</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                <span>فرمت‌های پشتیبانی شده: PDF, JPG, PNG</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                <span>حداکثر حجم فایل: 5 مگابایت</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                <span>توضیحات مدرک را به طور کامل و دقیق وارد کنید</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Uploaded Documents -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          مدارک آپلود شده
        </h2>

        <div v-if="isVerificationLoading" class="py-8 text-center">
          <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-indigo-500" />
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            در حال بارگذاری مدارک...
          </p>
        </div>

        <div v-else-if="userVerificationDocuments && userVerificationDocuments.length > 0">
          <div class="overflow-hidden rounded-md shadow ring-1 ring-black/5 dark:ring-gray-600 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    نام فایل
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    نوع مدرک
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    اندازه
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    تاریخ آپلود
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr
                  v-for="document in userVerificationDocuments"
                  :key="document.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {{ document.fileName }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ getDocumentTypeText(document.type) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ document.fileSize > 0 ? `${Math.round(document.fileSize / 1024)} KB` : '-' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(document.createdAt) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      دانلود
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <Icon name="ph:folder-open" class="mx-auto size-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            مدرکی آپلود نشده است
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            برای شروع، مدارک لازم را آپلود کنید.
          </p>
        </div>
      </div>

      <!-- Verification Requests -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">
          تاریخچه درخواست‌ها
        </h2>

        <div v-if="verificationRequests && verificationRequests.length > 0" class="overflow-hidden rounded-md shadow ring-1 ring-black/5 dark:ring-gray-600 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                  شناسه
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
                  {{ request.id.substring(0, 8) }}
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
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    جزئیات
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="py-8 text-center">
          <Icon name="ph:clipboard-text" class="mx-auto size-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            درخواستی ثبت نشده است
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            پس از ثبت درخواست تأیید صلاحیت، تاریخچه آن در اینجا نمایش داده می‌شود.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>