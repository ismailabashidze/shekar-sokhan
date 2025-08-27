<template>
  <div class="admin-counselor-details">
    <NuxtLink
      to="/hammasir/admin/counselors"
      class="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
    >
      &larr; بازگشت به لیست مشاوران
    </NuxtLink>

    <div v-if="isLoading" class="py-12 text-center">
      <div class="inline-block size-12 animate-spin rounded-full border-y-2 border-blue-500" />
      <p class="mt-4">
        در حال بارگذاری اطلاعات مشاور...
      </p>
    </div>

    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p class="text-red-800">
        {{ error }}
      </p>
      <button
        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="loadCounselor"
      >
        تلاش مجدد
      </button>
    </div>

    <div v-else-if="counselor" class="space-y-6">
      <!-- Counselor Header -->
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center">
            <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
            <div class="mr-4">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ counselor.personalInfo?.firstName }} {{ counselor.personalInfo?.lastName }}
              </h1>
              <p class="text-gray-600">
                مشاور {{ getSpecializationText(counselor.specializations?.[0]?.name) }}
              </p>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
              :class="getVerificationStatusClass(counselor.verificationStatus)"
            >
              {{ getVerificationStatusText(counselor.verificationStatus) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Counselor Actions -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-900">
          عملیات مدیریتی
        </h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-if="counselor.verificationStatus === 'PENDING'"
            class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            @click="openApproveModal"
          >
            تأیید مشاور
          </button>
          <button
            v-if="counselor.verificationStatus === 'PENDING'"
            class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            @click="openRejectModal"
          >
            رد مشاور
          </button>
          <button
            v-if="counselor.verificationStatus === 'APPROVED'"
            class="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            @click="openSuspendModal"
          >
            تعلیق مشاور
          </button>
          <button
            v-if="counselor.verificationStatus === 'SUSPENDED'"
            class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            @click="unsuspendCounselor"
          >
            رفع تعلیق مشاور
          </button>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            اطلاعات شخصی
          </h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                نام
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.firstName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                نام خانوادگی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.lastName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                جنسیت
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ getGenderText(counselor.personalInfo?.gender) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                شماره تلفن
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.phoneNumber }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                ایمیل
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.email }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                تاریخ تولد
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.dateOfBirth ? formatDate(counselor.personalInfo.dateOfBirth) : '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                بیوگرافی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.personalInfo?.bio }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Professional Information -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            اطلاعات حرفه‌ای
          </h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                سال‌های تجربه
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ counselor.professionalInfo?.yearsOfExperience }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                تخصص‌ها
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="spec in counselor.specializations"
                    :key="spec.name"
                    class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {{ getSpecializationText(spec.name) }}
                  </span>
                </div>
              </dd>
            </div>
            <div class="md:col-span-2">
              <dt class="text-sm font-medium text-gray-500">
                گواهی‌نامه‌ها
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                <ul class="space-y-2">
                  <li
                    v-for="cert in counselor.professionalInfo?.certifications"
                    :key="cert.name"
                  >
                    <div class="flex items-center">
                      <span class="font-medium">{{ cert.name }}</span>
                      <span class="mx-2">-</span>
                      <span>{{ cert.issuingOrg }}</span>
                      <span class="mx-2">-</span>
                      <span>{{ cert.issueDate ? formatDate(cert.issueDate) : '-' }}</span>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Availability -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            زمان‌های کاری
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="slot in counselor.availability?.timeSlots"
              :key="`${slot.startTime}-${slot.endTime}`"
              class="rounded-md border border-gray-200 p-3"
            >
              <div class="flex justify-between">
                <span class="font-medium">{{ formatTime(slot.startTime) }}</span>
                <span>-</span>
                <span class="font-medium">{{ formatTime(slot.endTime) }}</span>
              </div>
              <div class="mt-1">
                <span
                  :class="slot.isAvailable ? 'text-green-600' : 'text-red-600'"
                >
                  {{ slot.isAvailable ? 'در دسترس' : 'غیر قابل دسترس' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rates -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            تعرفه‌ها
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="rate in counselor.rates"
              :key="`${rate.amount}-${rate.currency}`"
              class="rounded-md border border-gray-200 p-3"
            >
              <div class="text-lg font-medium">
                {{ formatCurrency(rate.amount, rate.currency) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ getRateUnitText(rate.unit) }}
              </div>
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
            تأیید مشاور
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از تأیید مشاور "{{ counselor?.personalInfo?.firstName }} {{ counselor?.personalInfo?.lastName }}" اطمینان دارید؟
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
            {{ isApproving ? 'در حال تأیید...' : 'تأیید مشاور' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            رد مشاور
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از رد مشاور "{{ counselor?.personalInfo?.firstName }} {{ counselor?.personalInfo?.lastName }}" اطمینان دارید؟
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">دلیل رد *</label>
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
            @click="closeRejectModal"
          >
            انصراف
          </button>
          <button
            :disabled="isRejecting || !rejectionReason"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            @click="confirmRejection"
          >
            {{ isRejecting ? 'در حال رد...' : 'رد مشاور' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Suspend Confirmation Modal -->
    <div v-if="showSuspendModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            تعلیق مشاور
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            آیا از تعلیق مشاور "{{ counselor?.personalInfo?.firstName }} {{ counselor?.personalInfo?.lastName }}" اطمینان دارید؟
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">دلیل تعلیق *</label>
            <textarea
              v-model="suspensionReason"
              rows="3"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="دلیل تعلیق کردن مشاور..."
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeSuspendModal"
          >
            انصراف
          </button>
          <button
            :disabled="isSuspending || !suspensionReason"
            class="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            @click="confirmSuspension"
          >
            {{ isSuspending ? 'در حال تعلیق...' : 'تعلیق مشاور' }}
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

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAdmin } from '~/composables/hammasir/useAdmin'
import type { CounselorProfileDto } from '~/types/api'

// Route
const route = useRoute()

// State
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showSuspendModal = ref(false)
const approvalNotes = ref('')
const rejectionReason = ref('')
const suspensionReason = ref('')
const isApproving = ref(false)
const isRejecting = ref(false)
const isSuspending = ref(false)

// Composables
const {
  adminState,
  isAdminLoading,
  adminError,
  getCounselorByIdAdmin,
  updateVerificationStatusAdmin,
} = useAdmin()

// Computed properties
const counselor = computed(() => adminState.value.counselors.find(c => c.id === route.params.id) || null)
const isLoading = computed(() => isAdminLoading.value)
const error = computed(() => adminError.value)

// Initialize
onMounted(() => {
  loadCounselor()
})

// Methods
const loadCounselor = async () => {
  const counselorId = route.params.id as string
  if (!counselorId) {
    // Handle error - counselorId not provided
    return
  }

  await getCounselorByIdAdmin(counselorId)
}

const getVerificationStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'در انتظار تأیید',
    APPROVED: 'تأیید شده',
    REJECTED: 'رد شده',
    SUSPENDED: 'تعلیق شده',
  }
  return statusMap[status] || status
}

const getVerificationStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-orange-100 text-orange-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getGenderText = (gender: string) => {
  const genderMap: Record<string, string> = {
    MALE: 'مرد',
    FEMALE: 'زن',
  }
  return genderMap[gender] || gender || 'نامشخص'
}

const getSpecializationText = (specialization: string) => {
  const specializationMap: Record<string, string> = {
    PSYCHOLOGY: 'روانشناسی',
    PSYCHIATRY: 'روانپزشکی',
    SOCIAL_WORK: 'کار سوشیال',
    MARITAL_THERAPY: 'مشاوره زناشویی',
    FAMILY_THERAPY: 'درمان خانواده',
    COGNITIVE_BEHAVIORAL_THERAPY: 'درمان شناختی-رفتاری',
    TRAUMA_THERAPY: 'درمان تروما',
    CHILD_AND_ADOLESCENT_PSYCHOTHERAPY: 'روان درمانی کودکان و نوجوانان',
  }
  return specializationMap[specialization] || specialization || 'نامشخص'
}

const getRateUnitText = (unit: string) => {
  const unitMap: Record<string, string> = {
    SESSION: 'جلسه',
    HOUR: 'ساعت',
    DAY: 'روز',
    WEEK: 'هفته',
    MONTH: 'ماه',
  }
  return unitMap[unit] || unit || 'جلسه'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const formatTime = (timeString: string) => {
  // Assuming timeString is in HH:mm:ss format
  const [hours, minutes] = timeString.split(':')
  return `${hours}:${minutes}`
}

const formatCurrency = (amount: number, currency: string) => {
  const currencyMap: Record<string, string> = {
    IRR: 'ریال',
    USD: 'دلار',
    EUR: 'یورو',
  }
  const currencySymbol = currencyMap[currency] || currency
  return `${amount.toLocaleString('fa-IR')} ${currencySymbol}`
}

const openApproveModal = () => {
  approvalNotes.value = ''
  showApproveModal.value = true
}

const closeApproveModal = () => {
  showApproveModal.value = false
  approvalNotes.value = ''
}

const openRejectModal = () => {
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionReason.value = ''
}

const openSuspendModal = () => {
  suspensionReason.value = ''
  showSuspendModal.value = true
}

const closeSuspendModal = () => {
  showSuspendModal.value = false
  suspensionReason.value = ''
}

const confirmApproval = async () => {
  if (!counselor.value) return

  isApproving.value = true

  try {
    const result = await updateVerificationStatusAdmin(counselor.value.id, 'APPROVED')

    if (result) {
      closeApproveModal()
      // Reload the counselor to show updated status
      await loadCounselor()
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
  if (!counselor.value || !rejectionReason.value) return

  isRejecting.value = true

  try {
    const result = await updateVerificationStatusAdmin(counselor.value.id, 'REJECTED')

    if (result) {
      closeRejectModal()
      // Reload the counselor to show updated status
      await loadCounselor()
    }
  }
  catch (err: any) {
    console.error('Error rejecting counselor:', err)
  }
  finally {
    isRejecting.value = false
  }
}

const confirmSuspension = async () => {
  if (!counselor.value || !suspensionReason.value) return

  isSuspending.value = true

  try {
    const result = await updateVerificationStatusAdmin(counselor.value.id, 'SUSPENDED')

    if (result) {
      closeSuspendModal()
      // Reload the counselor to show updated status
      await loadCounselor()
    }
  }
  catch (err: any) {
    console.error('Error suspending counselor:', err)
  }
  finally {
    isSuspending.value = false
  }
}

const unsuspendCounselor = async () => {
  if (!counselor.value) return

  if (confirm(`آیا از رفع تعلیق مشاور "${counselor.value.personalInfo?.firstName} ${counselor.value.personalInfo?.lastName}" اطمینان دارید؟`)) {
    try {
      const result = await updateVerificationStatusAdmin(counselor.value.id, 'APPROVED')

      if (result) {
        // Reload the counselor to show updated status
        await loadCounselor()
      }
    }
    catch (err: any) {
      console.error('Error unsuspending counselor:', err)
    }
  }
}
</script>

<style scoped>
.admin-counselor-details {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-counselor-details {
    padding: 1rem;
  }
}
</style>