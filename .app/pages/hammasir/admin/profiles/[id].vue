<template>
  <div class="admin-profile-details">
    <NuxtLink
      to="/hammasir/admin/profiles"
      class="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
    >
      &larr; بازگشت به لیست پروفایل‌ها
    </NuxtLink>

    <div v-if="isLoading" class="py-12 text-center">
      <div class="inline-block size-12 animate-spin rounded-full border-y-2 border-blue-500" />
      <p class="mt-4">
        در حال بارگذاری اطلاعات پروفایل...
      </p>
    </div>

    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p class="text-red-800">
        {{ error }}
      </p>
      <button
        class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="loadProfile"
      >
        تلاش مجدد
      </button>
    </div>

    <div v-else-if="profile" class="space-y-6">
      <!-- Profile Header -->
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center">
            <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
            <div class="mr-4">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ profile.personalInfo?.firstName }} {{ profile.personalInfo?.lastName }}
              </h1>
              <p class="text-gray-600">
                @{{ profile.username }}
              </p>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
              :class="getStatusClass(profile.status)"
            >
              {{ getStatusText(profile.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Profile Actions -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-900">
          عملیات مدیریتی
        </h2>
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="openStatusModal"
          >
            تغییر وضعیت
          </button>
          <button
            v-if="profile.status !== 'SUSPENDED'"
            class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            @click="handleSuspendUser"
          >
            تعلیق کاربر
          </button>
          <button
            v-if="profile.status === 'SUSPENDED'"
            class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            @click="handleUnsuspendUser"
          >
            رفع تعلیق کاربر
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
                نام کاربری
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.username }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                ایمیل
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.email }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                نام
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.personalInfo?.firstName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                نام خانوادگی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.personalInfo?.lastName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                شماره تلفن
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.personalInfo?.phoneNumber }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                تاریخ تولد
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.personalInfo?.dateOfBirth ? formatDate(profile.personalInfo.dateOfBirth) : '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                جنسیت
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ getGenderText(profile.personalInfo?.gender) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                کد ملی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.personalInfo?.nationalId }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Demographics Information -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            اطلاعات دموگرافیک
          </h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                استان
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.demographics?.province }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                شهر
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.demographics?.city }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                تحصیلات
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ getEducationLevelText(profile.demographics?.educationLevel) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                شغل
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.demographics?.occupation }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Preferences -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            ترجیحات
          </h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                زبان ترجیحی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ profile.preferences?.preferredLanguage }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                موضوعات ترجیحی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span
                  v-for="topic in profile.preferences?.preferredTopics"
                  :key="topic"
                  class="mb-2 mr-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                >
                  {{ topic }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            تنظیمات حریم خصوصی
          </h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                نمایش پروفایل عمومی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span :class="profile.privacySettings?.isProfilePublic ? 'text-green-600' : 'text-red-600'">
                  {{ profile.privacySettings?.isProfilePublic ? 'فعال' : 'غیرفعال' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                دریافت ایمیل بازاریابی
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span :class="profile.privacySettings?.marketingEmails ? 'text-green-600' : 'text-red-600'">
                  {{ profile.privacySettings?.marketingEmails ? 'فعال' : 'غیرفعال' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            تغییر وضعیت کاربر
          </h3>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4">
            تغییر وضعیت برای کاربر: <strong>{{ profile?.username }}</strong>
          </p>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">وضعیت جدید</label>
            <select
              v-model="newStatus"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">
                فعال
              </option>
              <option value="Inactive">
                غیرفعال
              </option>
              <option value="Suspended">
                تعلیق شده
              </option>
              <option value="Pending">
                در انتظار تأیید
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">توضیحات (اختیاری)</label>
            <textarea
              v-model="statusReason"
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="دلیل تغییر وضعیت..."
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeStatusModal"
          >
            انصراف
          </button>
          <button
            :disabled="isUpdatingStatus"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            @click="updateStatus"
          >
            {{ isUpdatingStatus ? 'در حال به‌روزرسانی...' : 'تغییر وضعیت' }}
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
import { useAdminProfile } from '~/composables/hammasir/useAdminProfile'
import { useAdmin } from '~/composables/hammasir/useAdmin'
import type { UserProfileDto } from '~/types/api'

// Route
const route = useRoute()

// State
const showStatusModal = ref(false)
const newStatus = ref('ACTIVE')
const statusReason = ref('')
const isUpdatingStatus = ref(false)

// Composables
const { adminProfileState, getProfileById, updateUserStatusAdmin, suspendUser, unsuspendUser } = useAdminProfile()

// Use the new admin composable for additional functionality
const {
  getCounselorByIdAdmin,
  getAllFilesAdmin,
  adminState,
  isAdminLoading,
} = useAdmin()

// Computed properties
const profile = computed(() => adminProfileState.value.profiles.find(p => p.userId === route.params.id) || null)
const isLoading = computed(() => adminProfileState.value.isLoading || isAdminLoading.value)
const error = computed(() => adminProfileState.value.error)

// Initialize
onMounted(() => {
  loadProfile()
})

// Methods
const loadProfile = async () => {
  const userId = route.params.id as string
  if (!userId) {
    // Handle error - userId not provided
    return
  }

  await getProfileById(userId)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'فعال',
    INACTIVE: 'غیرفعال',
    SUSPENDED: 'تعلیق شده',
    PENDING_VERIFICATION: 'در انتظار تأیید',
    DEACTIVATED: 'غیرفعال شده',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
    DEACTIVATED: 'bg-gray-100 text-gray-800',
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

const getEducationLevelText = (educationLevel: string) => {
  const educationMap: Record<string, string> = {
    HIGH_SCHOOL: 'دیپلم',
    BACHELOR: 'لیسانس',
    MASTER: 'فوق لیسانس',
    PHD: 'دکتری',
    VOCATIONAL: 'حرفه‌ای',
    OTHER: 'سایر',
  }
  return educationMap[educationLevel] || educationLevel || 'نامشخص'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const openStatusModal = () => {
  if (profile.value) {
    newStatus.value = profile.value.status || 'ACTIVE'
  }
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  statusReason.value = ''
}

const updateStatus = async () => {
  if (!profile.value) return

  isUpdatingStatus.value = true

  try {
    const result = await updateUserStatusAdmin(profile.value.userId, {
      status: newStatus.value,
    })

    if (result) {
      closeStatusModal()
      // Reload the profile to show updated status
      await loadProfile()
    }
  }
  catch (err: any) {
    console.error('Error updating status:', err)
  }
  finally {
    isUpdatingStatus.value = false
  }
}

const handleSuspendUser = async () => {
  if (!profile.value) return

  if (confirm('آیا از تعلیق این کاربر اطمینان دارید؟')) {
    try {
      const result = await suspendUser(profile.value.userId)

      if (result) {
        // Reload the profile to show updated status
        await loadProfile()
      }
    }
    catch (err: any) {
      console.error('Error suspending user:', err)
    }
  }
}

const handleUnsuspendUser = async () => {
  if (!profile.value) return

  if (confirm('آیا از رفع تعلیق این کاربر اطمینان دارید؟')) {
    try {
      const result = await unsuspendUser(profile.value.userId)

      if (result) {
        // Reload the profile to show updated status
        await loadProfile()
      }
    }
    catch (err: any) {
      console.error('Error unsuspending user:', err)
    }
  }
}
</script>

<style scoped>
.admin-profile-details {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-profile-details {
    padding: 1rem;
  }
}
</style>
