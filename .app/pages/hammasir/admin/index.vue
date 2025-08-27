<template>
  <div class="admin-dashboard">
    <h1 class="mb-6 text-2xl font-bold">
      پیشخوان مدیریت
    </h1>

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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              مجموع کاربران
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.totalUsers }}
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
              کاربران فعال
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.activeUsers }}
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
              کاربران در انتظار
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.pendingUsers }}
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="rounded-full bg-red-100 p-3 text-red-600">
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              کاربران تعلیق شده
            </p>
            <p class="text-2xl font-semibold">
              {{ stats.suspendedUsers }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            آخرین کاربران ثبت‌نام شده
          </h2>
        </div>
        <div class="p-6">
          <div v-if="recentUsers.length === 0" class="py-4 text-center text-gray-500">
            کاربری یافت نشد
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li
              v-for="user in recentUsers"
              :key="user.userId"
              class="py-4"
            >
              <div class="flex items-center">
                <div class="size-10 rounded-xl border-2 border-dashed bg-gray-200" />
                <div class="mr-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user.personalInfo?.firstName }} {{ user.personalInfo?.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    @{{ user.username }}
                  </p>
                </div>
                <div class="mr-auto">
                  <span
                    class="rounded-full px-2 py-1 text-xs font-medium"
                    :class="getStatusClass(user.status)"
                  >
                    {{ getStatusText(user.status) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            عملیات سریع
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NuxtLink
              to="/hammasir/admin/profiles"
              class="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-6 transition-colors hover:bg-blue-100"
            >
              <div class="mb-3 rounded-full bg-blue-100 p-3 text-blue-600">
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
              <span class="text-sm font-medium text-gray-900">مدیریت پروفایل‌ها</span>
            </NuxtLink>

            <a
              href="#"
              class="flex flex-col items-center justify-center rounded-lg bg-green-50 p-6 transition-colors hover:bg-green-100"
            >
              <div class="mb-3 rounded-full bg-green-100 p-3 text-green-600">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">گزارش‌ها</span>
            </a>

            <a
              href="#"
              class="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-6 transition-colors hover:bg-yellow-100"
            >
              <div class="mb-3 rounded-full bg-yellow-100 p-3 text-yellow-600">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">تنظیمات</span>
            </a>

            <a
              href="#"
              class="flex flex-col items-center justify-center rounded-lg bg-red-50 p-6 transition-colors hover:bg-red-100"
            >
              <div class="mb-3 rounded-full bg-red-100 p-3 text-red-600">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">خروج</span>
            </a>
          </div>
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

import { ref, onMounted } from 'vue'
import { useAdminProfile } from '~/composables/hammasir/useAdminProfile'
import type { UserProfileDto } from '~/types/api'

// State
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  pendingUsers: 0,
  suspendedUsers: 0,
})

const recentUsers = ref<UserProfileDto[]>([])

// Composables
const { getAllProfiles } = useAdminProfile()

// Initialize
onMounted(() => {
  loadDashboardData()
})

// Methods
const loadDashboardData = async () => {
  try {
    // Load recent users (first 5)
    const result = await getAllProfiles(1, 5)

    if (result) {
      recentUsers.value = result.profiles

      // Calculate statistics (in a real app, you might have a separate API endpoint for this)
      stats.value.totalUsers = result.total
      stats.value.activeUsers = result.profiles.filter(u => u.status === 'ACTIVE').length
      stats.value.pendingUsers = result.profiles.filter(u => u.status === 'PENDING_VERIFICATION').length
      stats.value.suspendedUsers = result.profiles.filter(u => u.status === 'SUSPENDED').length
    }
  }
  catch (err) {
    console.error('Error loading dashboard data:', err)
  }
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
</script>

<style scoped>
.admin-dashboard {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-dashboard {
    padding: 1rem;
  }
}
</style>
