<template>
  <div class="admin-profiles">
    <h1 class="mb-6 text-2xl font-bold">
      لیست پروفایل‌های کاربران
    </h1>

    <!-- Search and Filter Section -->
    <div class="mb-6 rounded-lg bg-white p-4 shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <label class="mb-1 block text-sm font-medium text-gray-700">وضعیت کاربر</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه وضعیت‌ها
            </option>
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
        <div class="flex items-end">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="searchProfiles"
          >
            جستجو
          </button>
        </div>
      </div>
    </div>

    <!-- Profiles Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div v-if="isLoading" class="p-6 text-center">
        <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-blue-500" />
        <p class="mt-2">
          در حال بارگذاری پروفایل‌ها...
        </p>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        <p>{{ error }}</p>
        <button
          class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="loadProfiles"
        >
          تلاش مجدد
        </button>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نام کاربری
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نام کامل
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                ایمیل
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                وضعیت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                تاریخ عضویت
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="profile in filteredProfiles"
              :key="profile.userId"
              class="hover:bg-gray-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ profile.username }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ profile.personalInfo?.firstName }} {{ profile.personalInfo?.lastName }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ profile.email }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getStatusClass(profile.status)"
                >
                  {{ getStatusText(profile.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatDate(profile.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <NuxtLink
                  :to="`/hammasir/admin/profiles/${profile.userId}`"
                  class="ml-3 text-blue-600 hover:text-blue-900"
                >
                  جزئیات
                </NuxtLink>
                <button
                  class="text-indigo-600 hover:text-indigo-900"
                  @click="openStatusModal(profile)"
                >
                  تغییر وضعیت
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
                پروفایل
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
            تغییر وضعیت برای کاربر: <strong>{{ selectedProfile?.username }}</strong>
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

import { ref, computed, onMounted } from 'vue'
import { useAdminProfile } from '~/composables/hammasir/useAdminProfile'
import type { UserProfileDto } from '~/types/api'

// State
const searchTerm = ref('')
const statusFilter = ref('')
const showStatusModal = ref(false)
const selectedProfile = ref<UserProfileDto | null>(null)
const newStatus = ref('ACTIVE')
const statusReason = ref('')
const isUpdatingStatus = ref(false)

// Composables
const { adminProfileState, getAllProfiles, updateUserStatusAdmin } = useAdminProfile()

// Computed properties
const profiles = computed(() => adminProfileState.value.profiles)
const isLoading = computed(() => adminProfileState.value.isLoading)
const error = computed(() => adminProfileState.value.error)
const currentPage = computed(() => adminProfileState.value.currentPage)
const itemsPerPage = computed(() => adminProfileState.value.itemsPerPage)
const totalItems = computed(() => adminProfileState.value.totalProfiles)
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
  loadProfiles()
})

// Methods
const loadProfiles = async () => {
  await getAllProfiles(currentPage.value, itemsPerPage.value, searchTerm.value, statusFilter.value)
}

const searchProfiles = () => {
  getAllProfiles(1, itemsPerPage.value, searchTerm.value, statusFilter.value)
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const openStatusModal = (profile: UserProfileDto) => {
  selectedProfile.value = profile
  newStatus.value = profile.status || 'ACTIVE'
  statusReason.value = ''
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedProfile.value = null
  newStatus.value = 'ACTIVE'
  statusReason.value = ''
}

const updateStatus = async () => {
  if (!selectedProfile.value) return

  isUpdatingStatus.value = true

  try {
    const result = await updateUserStatusAdmin(selectedProfile.value.userId, {
      status: newStatus.value,
    })

    if (result) {
      closeStatusModal()
      // Reload the profiles to show updated status
      await loadProfiles()
    }
  }
  catch (err: any) {
    console.error('Error updating status:', err)
  }
  finally {
    isUpdatingStatus.value = false
  }
}

const goToPage = (page: number) => {
  getAllProfiles(page, itemsPerPage.value, searchTerm.value, statusFilter.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    getAllProfiles(currentPage.value - 1, itemsPerPage.value, searchTerm.value, statusFilter.value)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    getAllProfiles(currentPage.value + 1, itemsPerPage.value, searchTerm.value, statusFilter.value)
  }
}
</script>

<style scoped>
.admin-profiles {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-profiles {
    padding: 1rem;
  }
}
</style>
