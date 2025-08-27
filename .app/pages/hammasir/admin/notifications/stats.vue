<template>
  <div class="admin-notification-stats">
    <h1 class="mb-6 text-2xl font-bold">
      آمار اعلان‌ها
    </h1>

    <!-- Summary Cards -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-blue-100 p-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              مجموع اعلان‌ها
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.totalNotifications }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-green-100 p-3 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              اعلان‌های خوانده شده
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.readNotifications }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-yellow-100 p-3 text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              اعلان‌های در انتظار
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.pendingNotifications }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-purple-100 p-3 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              کاربران هدف
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.targetUsers }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Notifications by Type Chart -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            اعلان‌ها بر اساس نوع
          </h2>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="typeChart" />
          </div>
        </div>
      </div>

      <!-- Notifications Over Time Chart -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            اعلان‌ها در طول زمان
          </h2>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="timeChart" />
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Stats -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Top Notification Types -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            محبوب‌ترین انواع اعلان
          </h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="(type, index) in topNotificationTypes"
              :key="type.name"
              class="flex items-center"
            >
              <div class="w-8 text-sm font-medium text-gray-500">
                {{ index + 1 }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center">
                  <span
                    class="mr-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    :class="getNotificationTypeClass(type.name)"
                  >
                    {{ getNotificationTypeText(type.name) }}
                  </span>
                  <span class="truncate text-sm font-medium text-gray-900">{{ type.name }}</span>
                </div>
              </div>
              <div class="ml-2 text-sm text-gray-500">
                {{ type.count }}
              </div>
              <div class="mr-2 h-2 w-24 rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-blue-600"
                  :style="{ width: `${(type.count / topNotificationTypes[0].count) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            فعالیت اخیر
          </h2>
        </div>
        <div class="p-6">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="activity in recentActivity"
              :key="activity.id"
              class="py-4"
            >
              <div class="flex items-center">
                <div class="shrink-0">
                  <div
                    class="flex size-8 items-center justify-center rounded-full"
                    :class="getActivityTypeClass(activity.type)"
                  >
                    <svg
                      v-if="activity.type === 'sent'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <svg
                      v-else-if="activity.type === 'read'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                </div>
                <div class="mr-3 min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">
                    {{ activity.title }}
                  </p>
                  <p class="truncate text-sm text-gray-500">
                    {{ activity.description }}
                  </p>
                </div>
                <div class="mr-2 shrink-0 text-sm text-gray-500">
                  {{ formatTime(activity.timestamp) }}
                </div>
              </div>
            </li>
          </ul>
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

import { ref, onMounted, onBeforeUnmount } from 'vue'
// In a real implementation, you would import Chart.js
// import Chart from 'chart.js/auto'

// State
const typeChart = ref<HTMLCanvasElement | null>(null)
const timeChart = ref<HTMLCanvasElement | null>(null)
let typeChartInstance: any = null
let timeChartInstance: any = null

// Stats data
const stats = ref({
  totalNotifications: 12456,
  readNotifications: 9876,
  pendingNotifications: 2580,
  targetUsers: 5432,
})

// Top notification types data
const topNotificationTypes = ref([
  { name: 'info', count: 4567 },
  { name: 'success', count: 3210 },
  { name: 'warning', count: 2345 },
  { name: 'error', count: 1234 },
  { name: 'system', count: 1100 },
])

// Recent activity data
const recentActivity = ref([
  {
    id: '1',
    type: 'sent',
    title: 'اعلان جدید ارسال شد',
    description: 'اعلان "تعمیرات سیستم" به 5432 کاربر ارسال شد',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'read',
    title: 'اعلان خوانده شد',
    description: 'کاربران 876 اعلان "یادآوری جلسه" را خواندند',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    type: 'sent',
    title: 'اعلان جدید ارسال شد',
    description: 'اعلان "نتایج ارزیابی" به 1245 کاربر ارسال شد',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '4',
    type: 'deleted',
    title: 'اعلان حذف شد',
    description: 'اعلان "تست سیستم" حذف شد',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
])

// Initialize
onMounted(() => {
  // Initialize charts
  initCharts()
})

onBeforeUnmount(() => {
  // Destroy chart instances to prevent memory leaks
  if (typeChartInstance) {
    typeChartInstance.destroy()
  }
  if (timeChartInstance) {
    timeChartInstance.destroy()
  }
})

// Methods
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

const getActivityTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    sent: 'bg-blue-500',
    read: 'bg-green-500',
    deleted: 'bg-red-500',
  }
  return classMap[type] || 'bg-gray-500'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'همین الان'
  if (diffMins < 60) return `${diffMins} دقیقه پیش`
  if (diffHours < 24) return `${diffHours} ساعت پیش`
  return `${diffDays} روز پیش`
}

const initCharts = () => {
  // In a real implementation, you would initialize Chart.js here
  // For now, we'll just log to console
  console.log('Initializing charts...')

  // Example of how you would initialize charts with Chart.js:
  /*
  if (typeChart.value) {
    typeChartInstance = new Chart(typeChart.value, {
      type: 'doughnut',
      data: {
        labels: ['اطلاعاتی', 'موفقیت', 'هشدار', 'خطا', 'سیستمی'],
        datasets: [{
          data: [4567, 3210, 2345, 1234, 1100],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(168, 85, 247, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }

  if (timeChart.value) {
    timeChartInstance = new Chart(timeChart.value, {
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
        datasets: [{
          label: 'اعلان‌های ارسال شده',
          data: [1200, 1900, 1500, 2200, 1800, 2100],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    })
  }
  */
}
</script>

<style scoped>
.admin-notification-stats {
  padding: 1.5rem;
}

.chart-container {
  position: relative;
  height: 300px;
}

@media (max-width: 640px) {
  .admin-notification-stats {
    padding: 1rem;
  }
}
</style>
