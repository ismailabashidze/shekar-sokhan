<template>
  <div class="admin-files">
    <h1 class="mb-6 text-2xl font-bold">
      مدیریت فایل‌های سیستمی
    </h1>

    <!-- Search and Filter Section -->
    <div class="mb-6 rounded-lg bg-white p-4 shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">شناسه کاربر</label>
          <input
            v-model="userIdFilter"
            type="text"
            placeholder="شناسه کاربر..."
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">نوع فایل</label>
          <select
            v-model="fileTypeFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه انواع
            </option>
            <option value="PROFILE_IMAGE">
              تصویر پروفایل
            </option>
            <option value="DOCUMENT">
              سند
            </option>
            <option value="SESSION_RECORDING">
              ضبط جلسه
            </option>
            <option value="COURSE_MATERIAL">
              محتوای دوره
            </option>
            <option value="ASSESSMENT_FILE">
              فایل ارزیابی
            </option>
            <option value="MESSAGE_ATTACHMENT">
              پیوست پیام
            </option>
            <option value="NOTIFICATION_ATTACHMENT">
              پیوست اعلان
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">وضعیت</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه وضعیت‌ها
            </option>
            <option value="PENDING">
              در انتظار
            </option>
            <option value="UPLOADED">
              آپلود شده
            </option>
            <option value="PROCESSING">
              در حال پردازش
            </option>
            <option value="READY">
              آماده
            </option>
            <option value="ERROR">
              خطا
            </option>
            <option value="DELETED">
              حذف شده
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="searchFiles"
          >
            جستجو
          </button>
        </div>
      </div>
    </div>

    <!-- Files Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div v-if="isLoading" class="p-6 text-center">
        <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-blue-500" />
        <p class="mt-2">
          در حال بارگذاری فایل‌ها...
        </p>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        <p>{{ error }}</p>
        <button
          class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="loadFiles"
        >
          تلاش مجدد
        </button>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نام فایل
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نوع فایل
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                اندازه
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                وضعیت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                کاربر
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                تاریخ ایجاد
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="file in files"
              :key="file.id"
              class="hover:bg-gray-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ file.fileName }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ getFileTypeText(file.fileType) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatFileSize(file.fileSize) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getStatusClass(file.status)"
                >
                  {{ getStatusText(file.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ file.userId }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatDate(file.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <button
                  v-if="file.status === 'READY'"
                  class="ml-3 text-blue-600 hover:text-blue-900"
                  @click="downloadFile(file.id)"
                >
                  دانلود
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="deleteFile(file.id)"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="prevPage"
            >
              قبلی
            </button>
            <button
              :disabled="currentPage === totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="nextPage"
            >
              بعدی
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                نمایش
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                تا
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
                از
                <span class="font-medium">{{ totalItems }}</span>
                فایل
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  @click="prevPage"
                >
                  <span class="sr-only">قبلی</span>
                  &larr;
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  :class="[
                    page === currentPage
                      ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center border px-4 py-2 text-sm font-medium'
                  ]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  @click="nextPage"
                >
                  <span class="sr-only">بعدی</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            حذف فایل
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از حذف این فایل اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeDeleteModal"
          >
            انصراف
          </button>
          <button
            :disabled="isDeleting"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            @click="confirmDelete"
          >
            {{ isDeleting ? 'در حال حذف...' : 'حذف فایل' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '~/composables/hammasir/useAdmin'
import type { FileMetadataDto } from '~/types/api'

// State
const userIdFilter = ref('')
const fileTypeFilter = ref('')
const statusFilter = ref('')
const showDeleteModal = ref(false)
const selectedFileId = ref('')
const isDeleting = ref(false)

// Composables
const {
  adminState,
  isAdminLoading,
  adminError,
  getAllFilesAdmin,
  deleteFileAdmin,
} = useAdmin()

// Computed properties
const files = computed(() => adminState.value.files)
const isLoading = computed(() => isAdminLoading.value)
const error = computed(() => adminError.value)
const currentPage = computed(() => adminState.value.currentPage)
const itemsPerPage = computed(() => adminState.value.itemsPerPage)
const totalItems = computed(() => adminState.value.totalFiles)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Displayed pages for pagination
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  const halfMaxPages = Math.floor(maxPages / 2)

  let startPage = Math.max(1, currentPage.value - halfMaxPages)
  let endPage = Math.min(totalPages.value, currentPage.value + halfMaxPages)

  if (endPage - startPage + 1 < maxPages) {
    if (startPage === 1) {
      endPage = Math.min(totalPages.value, startPage + maxPages - 1)
    }
    else {
      startPage = Math.max(1, endPage - maxPages + 1)
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Initialize
onMounted(() => {
  loadFiles()
})

// Methods
const loadFiles = async () => {
  await getAllFilesAdmin(
    userIdFilter.value,
    fileTypeFilter.value,
    statusFilter.value
  )
}

const searchFiles = () => {
  getAllFilesAdmin(
    userIdFilter.value,
    fileTypeFilter.value,
    statusFilter.value
  )
}

const getFileTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    PROFILE_IMAGE: 'تصویر پروفایل',
    DOCUMENT: 'سند',
    SESSION_RECORDING: 'ضبط جلسه',
    COURSE_MATERIAL: 'محتوای دوره',
    ASSESSMENT_FILE: 'فایل ارزیابی',
    MESSAGE_ATTACHMENT: 'پیوست پیام',
    NOTIFICATION_ATTACHMENT: 'پیوست اعلان',
  }
  return typeMap[type] || type
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'در انتظار',
    UPLOADED: 'آپلود شده',
    PROCESSING: 'در حال پردازش',
    READY: 'آماده',
    ERROR: 'خطا',
    DELETED: 'حذف شده',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    UPLOADED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    READY: 'bg-green-100 text-green-800',
    ERROR: 'bg-red-100 text-red-800',
    DELETED: 'bg-gray-100 text-gray-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const downloadFile = (fileId: string) => {
  // In a real implementation, you would generate a download URL and trigger the download
  console.log(`Downloading file with ID: ${fileId}`)
  // Example:
  // const downloadUrl = `/api/v1/files/${fileId}/download`
  // window.open(downloadUrl, '_blank')
}

const deleteFile = (fileId: string) => {
  selectedFileId.value = fileId
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedFileId.value = ''
}

const confirmDelete = async () => {
  if (!selectedFileId.value) return

  isDeleting.value = true

  try {
    const result = await deleteFileAdmin(selectedFileId.value)

    if (result) {
      closeDeleteModal()
      // Reload files to show updated list
      await loadFiles()
    }
  }
  catch (err: any) {
    console.error('Error deleting file:', err)
  }
  finally {
    isDeleting.value = false
  }
}

const goToPage = (page: number) => {
  // In a real implementation, you would pass pagination parameters to the API
  console.log(`Navigating to page ${page}`)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}
</script>

<style scoped>
.admin-files {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-files {
    padding: 1rem;
  }
}
</style>