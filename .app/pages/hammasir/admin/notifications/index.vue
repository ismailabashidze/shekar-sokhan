<template>
  <div class="admin-notifications">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        مدیریت اعلان‌ها
      </h1>
      <button
        class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="openCreateModal"
      >
        ایجاد اعلان جدید
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 rounded-lg bg-white p-4 shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">جستجو بر اساس عنوان</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="عنوان اعلان..."
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">نوع اعلان</label>
          <select
            v-model="typeFilter"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              همه انواع
            </option>
            <option value="info">
              اطلاعاتی
            </option>
            <option value="success">
              موفقیت
            </option>
            <option value="warning">
              هشدار
            </option>
            <option value="error">
              خطا
            </option>
            <option value="system">
              سیستمی
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="searchNotifications"
          >
            جستجو
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div v-if="isLoading" class="p-6 text-center">
        <div class="inline-block size-8 animate-spin rounded-full border-y-2 border-blue-500" />
        <p class="mt-2">
          در حال بارگذاری اعلان‌ها...
        </p>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        <p>{{ error }}</p>
        <button
          class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="loadNotifications"
        >
          تلاش مجدد
        </button>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                عنوان
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                پیام
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                نوع
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
              v-for="notification in notifications"
              :key="notification.id"
              class="hover:bg-gray-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {{ notification.title }}
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-sm text-gray-900">
                {{ notification.message }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getNotificationTypeClass(notification.type)"
                >
                  {{ getNotificationTypeText(notification.type) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {{ formatDate(notification.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <button
                  class="ml-3 text-blue-600 hover:text-blue-900"
                  @click="viewNotification(notification)"
                >
                  مشاهده
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="deleteNotification(notification.id)"
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
                اعلان
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

    <!-- Create Notification Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            ایجاد اعلان جدید
          </h3>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="createNotification">
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">عنوان *</label>
              <input
                v-model="newNotification.title"
                type="text"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">پیام *</label>
              <textarea
                v-model="newNotification.message"
                rows="3"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">نوع *</label>
              <select
                v-model="newNotification.type"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">
                  اطلاعاتی
                </option>
                <option value="success">
                  موفقیت
                </option>
                <option value="warning">
                  هشدار
                </option>
                <option value="error">
                  خطا
                </option>
                <option value="system">
                  سیستمی
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">گیرندگان *</label>
              <div class="flex space-x-3 space-x-reverse">
                <label class="inline-flex items-center">
                  <input
                    v-model="recipientType"
                    type="radio"
                    value="all"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                  <span class="mr-2">همه کاربران</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="recipientType"
                    type="radio"
                    value="specific"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                  <span class="mr-2">کاربران خاص</span>
                </label>
              </div>
            </div>
            <div v-if="recipientType === 'specific'" class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">شناسه کاربران (با کاما جدا کنید)</label>
              <input
                v-model="specificRecipients"
                type="text"
                placeholder="user1,user2,user3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </form>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeCreateModal"
          >
            انصراف
          </button>
          <button
            :disabled="isCreating"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            @click="createNotification"
          >
            {{ isCreating ? 'در حال ارسال...' : 'ارسال اعلان' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Notification Modal -->
    <div v-if="showViewModal && selectedNotification" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            جزئیات اعلان
          </h3>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">عنوان</label>
            <p class="text-gray-900">
              {{ selectedNotification.title }}
            </p>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">پیام</label>
            <p class="text-gray-900">
              {{ selectedNotification.message }}
            </p>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">نوع</label>
            <span
              class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
              :class="getNotificationTypeClass(selectedNotification.type)"
            >
              {{ getNotificationTypeText(selectedNotification.type) }}
            </span>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">تاریخ ایجاد</label>
            <p class="text-gray-900">
              {{ formatDate(selectedNotification.createdAt) }}
            </p>
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">گیرندگان</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="recipient in selectedNotification.recipients"
                :key="recipient"
                class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {{ recipient }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            @click="closeViewModal"
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
import { useAdminNotifications } from '~/composables/hammasir/useAdminNotifications'
import type { SystemNotificationDto } from '~/types/api'

// State
const searchTerm = ref('')
const typeFilter = ref('')
const showCreateModal = ref(false)
const showViewModal = ref(false)
const selectedNotification = ref<SystemNotificationDto | null>(null)
const recipientType = ref<'all' | 'specific'>('all')
const specificRecipients = ref('')
const isCreating = ref(false)

// New notification form
const newNotification = ref({
  title: '',
  message: '',
  type: 'info',
})

// Composables
const {
  adminNotificationsState,
  isAdminNotificationsLoading,
  isAdminNotificationsSending,
  adminNotificationsError,
  getSystemNotificationsAdmin,
  sendSystemNotificationAdmin,
  deleteSystemNotificationAdmin,
} = useAdminNotifications()

// Computed properties
const notifications = computed(() => adminNotificationsState.value.notifications)
const isLoading = computed(() => isAdminNotificationsLoading.value)
const isSending = computed(() => isAdminNotificationsSending.value)
const error = computed(() => adminNotificationsError.value)
const currentPage = computed(() => adminNotificationsState.value.currentPage)
const itemsPerPage = computed(() => adminNotificationsState.value.itemsPerPage)
const totalItems = computed(() => adminNotificationsState.value.totalNotifications)
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
  loadNotifications()
})

// Methods
const loadNotifications = async () => {
  await getSystemNotificationsAdmin(currentPage.value, itemsPerPage.value, typeFilter.value)
}

const searchNotifications = () => {
  getSystemNotificationsAdmin(1, itemsPerPage.value, typeFilter.value)
}

const getNotificationTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    info: 'اطلاعاتی',
    success: 'موفقیت',
    warning: 'هشدار',
    error: 'خطا',
    system: 'سیستمی',
  }
  return typeMap[type] || type
}

const getNotificationTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    system: 'bg-purple-100 text-purple-800',
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const openCreateModal = () => {
  showCreateModal.value = true
  newNotification.value = {
    title: '',
    message: '',
    type: 'info',
  }
  recipientType.value = 'all'
  specificRecipients.value = ''
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createNotification = async () => {
  isCreating.value = true

  try {
    // Prepare recipients
    let recipients: string[] = []
    if (recipientType.value === 'all') {
      // In a real app, you might have an API to get all users
      // For now, we'll use a placeholder
      recipients = ['all-users']
    }
    else {
      recipients = specificRecipients.value.split(',').map(id => id.trim()).filter(id => id)
    }

    const result = await sendSystemNotificationAdmin({
      title: newNotification.value.title,
      message: newNotification.value.message,
      type: newNotification.value.type,
      recipients,
    })

    if (result) {
      closeCreateModal()
      // Reload notifications to show the new one
      await loadNotifications()
    }
  }
  catch (err: any) {
    console.error('Error creating notification:', err)
  }
  finally {
    isCreating.value = false
  }
}

const viewNotification = (notification: SystemNotificationDto) => {
  selectedNotification.value = notification
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedNotification.value = null
}

const deleteNotification = async (notificationId: string) => {
  if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
    try {
      const result = await deleteSystemNotificationAdmin(notificationId)

      if (result) {
        // Reload notifications to reflect the deletion
        await loadNotifications()
      }
    }
    catch (err: any) {
      console.error('Error deleting notification:', err)
    }
  }
}

const goToPage = (page: number) => {
  getSystemNotificationsAdmin(page, itemsPerPage.value, typeFilter.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    getSystemNotificationsAdmin(currentPage.value - 1, itemsPerPage.value, typeFilter.value)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    getSystemNotificationsAdmin(currentPage.value + 1, itemsPerPage.value, typeFilter.value)
  }
}
</script>

<style scoped>
.admin-notifications {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-notifications {
    padding: 1rem;
  }
}
</style>
