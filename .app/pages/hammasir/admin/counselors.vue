<template>
  <div class="admin-counselors">
    <h1 class="mb-6 text-2xl font-bold">
      لیست مشاوران
    </h1>

    <!-- Search and Filter Section -->
    <div class="mb-6 rounded-lg bg-white p-4 shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">جستجو بر اساس نام</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="نام یا نام خانوادگی..."
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">وضعیت تأیید</label>
          <select
            v-model="verificationStatusFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه وضعیت‌ها
            </option>
            <option value="PENDING">
              در انتظار تأیید
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
          <label class="mb-1 block text-sm font-medium text-gray-700">تخصص</label>
          <select
            v-model="specializationFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه تخصص‌ها
            </option>
            <option value="PSYCHOLOGY">
              روانشناسی
            </option>
            <option value="PSYCHIATRY">
              روانپزشکی
            </option>
            <option value="SOCIAL_WORK">
              کار соیال
            </option>
            <option value="MARITAL_THERAPY">
              مشاوره زناشویی
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="searchCounselors"
          >
            جستجو
          </button>
        </div>
      </div>
    </div>

    <!-- Counselors Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div v-if="isLoading" class="p-6 text-center">
        <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-blue-500" />
        <p class="mt-2">
          در حال بارگذاری مشاوران...
        </p>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        <p>{{ error }}</p>
        <button
          class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="loadCounselors"
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
                تخصص‌ها
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                سال‌های تجربه
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                وضعیت تأیید
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                تاریخ ثبت‌نام
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="counselor in counselors"
              :key="counselor.id"
              class="hover:bg-gray-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ counselor.personalInfo?.firstName }} {{ counselor.personalInfo?.lastName }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="spec in counselor.specializations"
                    :key="spec.name"
                    class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {{ spec.name }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ counselor.professionalInfo?.yearsOfExperience }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getVerificationStatusClass(counselor.verificationStatus)"
                >
                  {{ getVerificationStatusText(counselor.verificationStatus) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatDate(counselor.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <NuxtLink
                  :to="`/hammasir/admin/counselors/${counselor.id}`"
                  class="ml-3 text-blue-600 hover:text-blue-900"
                >
                  جزئیات
                </NuxtLink>
                <button
                  v-if="counselor.verificationStatus === 'PENDING'"
                  class="text-green-600 hover:text-green-900"
                  @click="approveCounselor(counselor.id)"
                >
                  تأیید
                </button>
                <button
                  v-if="counselor.verificationStatus === 'PENDING'"
                  class="text-red-600 hover:text-red-900"
                  @click="rejectCounselor(counselor.id)"
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
                مشاور
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

    <!-- Approval Confirmation Modal -->
    <div v-if="showApprovalModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            تأیید مشاور
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از تأیید این مشاور اطمینان دارید؟
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
            @click="closeApprovalModal"
          >
            انصراف
          </button>
          <button
            :disabled="isApproving"
            class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            @click="confirmApproval"
          >
            {{ isApproving ? 'در حال تأیید...' : 'تأیید مشاور' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Rejection Confirmation Modal -->
    <div v-if="showRejectionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            رد مشاور
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از رد این مشاور اطمینان دارید؟
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">دلیل رد</label>
            <textarea
              v-model="rejectionReason"
              rows="3"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="دلیل رد کردن مشاور..."
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeRejectionModal"
          >
            انصراف
          </button>
          <button
            :disabled="isRejecting"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            @click="confirmRejection"
          >
            {{ isRejecting ? 'در حال رد...' : 'رد مشاور' }}
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
import type { CounselorProfileDto } from '~/types/api'

// State
const searchTerm = ref('')
const verificationStatusFilter = ref('')
const specializationFilter = ref('')
const showApprovalModal = ref(false)
const showRejectionModal = ref(false)
const selectedCounselorId = ref('')
const approvalNotes = ref('')
const rejectionReason = ref('')
const isApproving = ref(false)
const isRejecting = ref(false)

// Composables
const {
  adminState,
  isAdminLoading,
  adminError,
  getAllCounselorsAdmin,
  updateVerificationStatusAdmin,
} = useAdmin()

// Computed properties
const counselors = computed(() => adminState.value.counselors)
const isLoading = computed(() => isAdminLoading.value)
const error = computed(() => adminError.value)
const currentPage = computed(() => adminState.value.currentPage)
const itemsPerPage = computed(() => adminState.value.itemsPerPage)
const totalItems = computed(() => adminState.value.totalCounselors)
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
  loadCounselors()
})

// Methods
const loadCounselors = async () => {
  await getAllCounselorsAdmin(
    currentPage.value,
    itemsPerPage.value,
    verificationStatusFilter.value,
    specializationFilter.value
  )
}

const searchCounselors = () => {
  getAllCounselorsAdmin(1, itemsPerPage.value, verificationStatusFilter.value, specializationFilter.value)
}

const getVerificationStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'در انتظار تأیید',
    APPROVED: 'تأیید شده',
    REJECTED: 'رد شده',
  }
  return statusMap[status] || status
}

const getVerificationStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const approveCounselor = (counselorId: string) => {
  selectedCounselorId.value = counselorId
  approvalNotes.value = ''
  showApprovalModal.value = true
}

const rejectCounselor = (counselorId: string) => {
  selectedCounselorId.value = counselorId
  rejectionReason.value = ''
  showRejectionModal.value = true
}

const closeApprovalModal = () => {
  showApprovalModal.value = false
  selectedCounselorId.value = ''
  approvalNotes.value = ''
}

const closeRejectionModal = () => {
  showRejectionModal.value = false
  selectedCounselorId.value = ''
  rejectionReason.value = ''
}

const confirmApproval = async () => {
  if (!selectedCounselorId.value) return

  isApproving.value = true

  try {
    const result = await updateVerificationStatusAdmin(selectedCounselorId.value, 'APPROVED')

    if (result) {
      closeApprovalModal()
      // Reload counselors to show updated status
      await loadCounselors()
    }
  }
  catch (err: any) {
    console.error('Error approving counselor:', err)
  }
  finally {
    isApproving.value = false
  }
}

const confirmRejection = async () => {
  if (!selectedCounselorId.value || !rejectionReason.value) return

  isRejecting.value = true

  try {
    const result = await updateVerificationStatusAdmin(selectedCounselorId.value, 'REJECTED')

    if (result) {
      closeRejectionModal()
      // Reload counselors to show updated status
      await loadCounselors()
    }
  }
  catch (err: any) {
    console.error('Error rejecting counselor:', err)
  }
  finally {
    isRejecting.value = false
  }
}

const goToPage = (page: number) => {
  getAllCounselorsAdmin(page, itemsPerPage.value, verificationStatusFilter.value, specializationFilter.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    getAllCounselorsAdmin(currentPage.value - 1, itemsPerPage.value, verificationStatusFilter.value, specializationFilter.value)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    getAllCounselorsAdmin(currentPage.value + 1, itemsPerPage.value, verificationStatusFilter.value, specializationFilter.value)
  }
}
</script>

<style scoped>
.admin-counselors {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-counselors {
    padding: 1rem;
  }
}
</style>