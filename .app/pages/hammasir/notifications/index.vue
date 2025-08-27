<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHammasirNotifications } from '~/composables/hammasir/useHammasirNotifications'
import type { NotificationDto, SystemNotificationDto } from '~/types/api'

definePageMeta({
  title: 'اعلان‌های همسیر',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  userNotifications,
  systemNotificationsList,
  unreadNotificationsCount,
  isNotificationsLoading,
  isNotificationsSending,
  notificationsError,
  getNotifications,
  getSystemNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  loadMockData: loadMockDataFn,
} = useHammasirNotifications()

const activeTab = ref('user')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Use the mock data from the composable
const loadMockData = () => {
  loadMockDataFn()
}

const displayedNotifications = computed(() => {
  if (activeTab.value === 'user') {
    return userNotifications.value || []
  }
  else {
    return systemNotificationsList.value || []
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const markAllAsReadHandler = async () => {
  await markAllAsRead()
  await getUnreadCount()
}

const handleMarkAsRead = async (notificationId: string) => {
  const success = await markAsRead(notificationId)
  if (success) {
    await getUnreadCount()
  }
}

const handleDelete = async (notificationId: string) => {
  const success = await deleteNotification(notificationId)
  if (success) {
    // Refresh the list
    if (activeTab.value === 'user') {
      await getNotifications(currentPage.value, itemsPerPage.value)
    }
    else {
      await getSystemNotifications(currentPage.value, itemsPerPage.value)
    }
    await getUnreadCount()
  }
}

// Initialize data
onMounted(async () => {
  await Promise.all([
    getNotifications(1, itemsPerPage.value),
    getSystemNotifications(1, itemsPerPage.value),
    getUnreadCount(),
  ])
})
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              اعلان‌های همسیر
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مدیریت اعلان‌های مرتبط با همسیریابی
            </p>
          </div>
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="loadMockData"
          >
            <Icon name="ph:test-tube" class="ml-2 size-4" />
            <span>بارگذاری داده‌های تستی</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Loading State -->
      <div v-if="isNotificationsLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری اعلان‌ها...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="notificationsError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری اعلان‌ها
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ notificationsError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Content -->
      <div v-else>
        <!-- Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              :class="[
                activeTab === 'user'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
              ]"
              @click="activeTab = 'user'"
            >
              اعلان‌های من
              <span v-if="unreadNotificationsCount" class="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {{ unreadNotificationsCount }}
              </span>
            </button>
            <button
              :class="[
                activeTab === 'system'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
              ]"
              @click="activeTab = 'system'"
            >
              اعلان‌های سیستمی
            </button>
          </nav>
        </div>

        <!-- Action Bar -->
        <div class="my-6 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ activeTab === 'user' ? 'اعلان‌های من' : 'اعلان‌های سیستمی' }}
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ displayedNotifications.length }} اعلان
            </p>
          </div>
          <button
            v-if="activeTab === 'user' && unreadNotificationsCount > 0"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="markAllAsReadHandler"
          >
            علامت‌گذاری همه به عنوان خوانده شده
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="displayedNotifications.length === 0 && !isNotificationsLoading" class="py-12 text-center">
          <Icon name="ph:bell" class="mx-auto size-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            اعلانی یافت نشد
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            هنوز هیچ اعلانی برای نمایش وجود ندارد.
          </p>
          <div class="mt-6">
            <button
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="loadMockData"
            >
              <Icon name="ph:test-tube" class="ml-2 size-4" />
              <span>بارگذاری داده‌های تستی</span>
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div v-else class="overflow-hidden rounded-md bg-white shadow dark:bg-gray-800">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="notification in displayedNotifications" :key="notification.id">
              <div class="p-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <p class="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {{ notification.title }}
                    </p>
                    <div v-if="!notification.readAt && activeTab === 'user'" class="mr-2 shrink-0">
                      <span class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                        جدید
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(notification.createdAt) }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {{ notification.message }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 flex justify-end space-x-3 space-x-reverse">
                  <button
                    v-if="!notification.readAt && activeTab === 'user'"
                    class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    @click="handleMarkAsRead(notification.id)"
                  >
                    خواندم
                  </button>
                  <button
                    class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="handleDelete(notification.id)"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
