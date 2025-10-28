<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          بیماران
        </h1>
        <p class="text-gray-600">
          مدیریت بیماران بخش هم‌دل
        </p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <button class="btn btn-primary">
          <Icon name="ph:plus" class="ml-2 size-4" />
          بیمار جدید
        </button>
        <button class="btn btn-secondary">
          <Icon name="ph:download-simple" class="ml-2 size-4" />
          خروجی
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="rounded-lg bg-white p-6 shadow">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="flex-1">
          <div class="relative">
            <Icon name="ph:magnifying-glass" class="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی بیمار..."
              class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 focus:ring-2"
            >
          </div>
        </div>
        <select class="focus:ring-primary-500 focus:border-primary-500 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2">
          <option>همه وضعیت‌ها</option>
          <option>در حال درمان</option>
          <option>اتمام درمان</option>
          <option>مرخص شده</option>
        </select>
      </div>
    </div>

    <!-- Patients Table -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              بیمار
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              کد ملی
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              تاریخ شروع
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              جلسات
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              وضعیت
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="patient in mockPatients" :key="patient.id">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <div class="size-10 shrink-0">
                  <img
                    class="size-10 rounded-full"
                    :src="patient.avatar"
                    :alt="patient.name"
                  >
                </div>
                <div class="mr-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ patient.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ patient.phone }}
                  </div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
              {{ patient.nationalCode }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
              {{ patient.startDate }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ patient.sessions }}
              </div>
              <div class="text-sm text-gray-500">
                جلسه
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="getStatusClass(patient.status)"
              >
                {{ patient.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
              <button class="text-primary-600 hover:text-primary-900 ml-3">
                مشاهده
              </button>
              <button class="text-gray-600 hover:text-gray-900">
                ویرایش
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'zone',
  // Using global middlewares only
})

const mockPatients = [
  {
    id: 1,
    name: 'علی رضایی',
    nationalCode: '0012345678',
    phone: '0912-345-6789',
    startDate: '۱۴۰۲/۰۳/۱۵',
    sessions: 12,
    status: 'در حال درمان',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'مریم احمدی',
    nationalCode: '0023456789',
    phone: '0913-456-7890',
    startDate: '۱۴۰۲/۰۴/۲۰',
    sessions: 8,
    status: 'در حال درمان',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'سعید محمدی',
    nationalCode: '0034567890',
    phone: '0914-567-8901',
    startDate: '۱۴۰۲/۰۲/۱۰',
    sessions: 20,
    status: 'اتمام درمان',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  },
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'در حال درمان':
      return 'bg-green-100 text-green-800'
    case 'اتمام درمان':
      return 'bg-blue-100 text-blue-800'
    case 'مرخص شده':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}
</script>
