<template>
  <div class="admin-verification-requests">
    <h1 class="mb-6 text-2xl font-bold">
      درخواست‌های تأیید مشاوران
    </h1>

    <!-- Filter Section -->
    <div class="mb-6 rounded-lg bg-white p-4 shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              در انتظار بررسی
            </option>
            <option value="APPROVED">
              تأیید شده
            </option>
            <option value="REJECTED">
              رد شده
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">مرتب‌سازی بر اساس</label>
          <select
            v-model="sortBy"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="submittedAt">
              تاریخ ارسال
            </option>
            <option value="counselorName">
              نام مشاور
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="filterRequests"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>

    <!-- Verification Requests Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div v-if="isLoading" class="p-6 text-center">
        <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-blue-500" />
        <p class="mt-2">
          در حال بارگذاری درخواست‌ها...
        </p>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        <p>{{ error }}</p>
        <button
          class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="loadRequests"
        >
          تلاش مجدد
        </button>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نام مشاور
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                وضعیت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                تاریخ ارسال
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                مدارک
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="request in verificationRequests"
              :key="request.id"
              class="hover:bg-gray-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ request.counselor?.personalInfo?.firstName }} {{ request.counselor?.personalInfo?.lastName }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getStatusClass(request.status)"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatDate(request.submittedAt) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="document in request.documents"
                    :key="document.fileId"
                    class="inline-flex cursor-pointer rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
                    @click="viewDocument(document.fileId)"
                  >
                    {{ getDocumentTypeText(document.type) }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <NuxtLink
                  :to="`/hammasir/admin/counselors/${request.counselorId}`"
                  class="ml-3 text-blue-600 hover:text-blue-900"
                >
                  مشاهده پروفایل
                </NuxtLink>
                <button
                  v-if="request.status === 'PENDING'"
                  class="text-green-600 hover:text-green-900"
                  @click="openApproveModal(request.id)"
                >
                  تأیید
                </button>
                <button
                  v-if="request.status === 'PENDING'"
                  class="text-red-600 hover:text-red-900"
                  @click="openRejectModal(request.id)"
                >
                  رد
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
                درخواست
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

    <!-- Approve Confirmation Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            تأیید درخواست
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از تأیید این درخواست اطمینان دارید؟
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">توضیحات (اختیاری)</label>
            <textarea
              v-model="approvalNotes"
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="دلیل تأیید..."
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeApproveModal"
          >
            انصراف
          </button>
          <button
            :disabled="isApproving"
            class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            @click="confirmApproval"
          >
            {{ isApproving ? 'در حال تأیید...' : 'تأیید درخواست' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            رد درخواست
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از رد این درخواست اطمینان دارید؟
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">دلیل رد *</label>
            <textarea
              v-model="rejectionReason"
              rows="3"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="دلیل رد کردن درخواست..."
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeRejectModal"
          >
            انصراف
          </button>
          <button
            :disabled="isRejecting || !rejectionReason"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            @click="confirmRejection"
          >
            {{ isRejecting ? 'در حال رد...' : 'رد درخواست' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Document Viewer Modal -->
    <div v-if="showDocumentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            مشاهده سند
          </h3>
        </div>
        <div class="px-6 py-4">
          <div v-if="documentUrl" class="flex justify-center">
            <iframe
              :src="documentUrl"
              class="h-96 w-full"
              frameborder="0"
            />
          </div>
          <div v-else class="py-8 text-center">
            <p>
              در حال بارگذاری سند...
            </p>
          </div>
        </div>
        <div class="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            @click="closeDocumentModal"
          >
            بستن
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
import type { VerificationRequestDto } from '~/types/api'

// State
const statusFilter = ref('')
const sortBy = ref('submittedAt')
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showDocumentModal = ref(false)
const selectedRequestId = ref('')
const approvalNotes = ref('')
const rejectionReason = ref('')
const documentUrl = ref('')
const isApproving = ref(false)
const isRejecting = ref(false)

// Composables
const {
  adminState,
  isAdminLoading,
  adminError,
  getAllVerificationRequestsAdmin,
  updateVerificationStatusAdmin,
  getFileMetadataAdmin,
} = useAdmin()

// Computed properties
const verificationRequests = computed(() => adminState.value.verificationRequests)
const isLoading = computed(() => isAdminLoading.value)
const error = computed(() => adminError.value)
const currentPage = computed(() => adminState.value.currentPage)
const itemsPerPage = computed(() => adminState.value.itemsPerPage)
const totalItems = computed(() => adminState.value.totalVerificationRequests)
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
  loadRequests()
})

// Methods
const loadRequests = async () => {
  await getAllVerificationRequestsAdmin(statusFilter.value)
}

const filterRequests = () => {
  getAllVerificationRequestsAdmin(statusFilter.value)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'در انتظار بررسی',
    APPROVED: 'تأیید شده',
    REJECTED: 'رد شده',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getDocumentTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    CERTIFICATE: 'گواهی‌نامه',
    DEGREE: 'مدرک تحصیلی',
    LICENSE: 'پروانه کار',
    CV: 'رزومه',
    PORTFOLIO: 'نمونه کار',
    OTHER: 'سایر',
  }
  return typeMap[type] || type
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const openApproveModal = (requestId: string) => {
  selectedRequestId.value = requestId
  approvalNotes.value = ''
  showApproveModal.value = true
}

const closeApproveModal = () => {
  showApproveModal.value = false
  selectedRequestId.value = ''
  approvalNotes.value = ''
}

const openRejectModal = (requestId: string) => {
  selectedRequestId.value = requestId
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedRequestId.value = ''
  rejectionReason.value = ''
}

const confirmApproval = async () => {
  if (!selectedRequestId.value) return

  isApproving.value = true

  try {
    const result = await updateVerificationStatusAdmin(selectedRequestId.value, 'APPROVED')

    if (result) {
      closeApproveModal()
      // Reload requests to show updated status
      await loadRequests()
    }
  }
  catch (err: any) {
    console.error('Error approving request:', err)
  }
  finally {
    isApproving.value = false
  }
}

const confirmRejection = async () => {
  if (!selectedRequestId.value || !rejectionReason.value) return

  isRejecting.value = true

  try {
    const result = await updateVerificationStatusAdmin(selectedRequestId.value, 'REJECTED')

    if (result) {
      closeRejectModal()
      // Reload requests to show updated status
      await loadRequests()
    }
  }
  catch (err: any) {
    console.error('Error rejecting request:', err)
  }
  finally {
    isRejecting.value = false
  }
}

const viewDocument = async (fileId: string) => {
  try {
    // Get file metadata to get download URL
    const fileMetadata = await getFileMetadataAdmin(fileId)
    
    if (fileMetadata && fileMetadata.s3Key) {
      // In a real implementation, you would generate a signed URL for the file
      // For now, we'll just show a placeholder
      documentUrl.value = `/api/v1/files/${fileId}/download`
      showDocumentModal.value = true
    }
  }
  catch (err: any) {
    console.error('Error viewing document:', err)
  }
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  documentUrl.value = ''
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
.admin-verification-requests {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-verification-requests {
    padding: 1rem;
  }
}
</style>