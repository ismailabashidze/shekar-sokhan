<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    <!-- Time of Usage Card -->
    <div class="nui-card nui-card-rounded-lg nui-card-default flex items-center gap-2 p-3">
      <div
        class="nui-icon-box nui-box-rounded-full nui-box-sm nui-box-solid bg-info-100 text-info-500 dark:bg-info-500/20 dark:text-info-400 dark:border-info-500 dark:border-2"
      >
        <Icon name="ph:clock-duotone" class="size-5" />
      </div>
      <div>
        <h2 class="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
          <BasePlaceload v-if="!dashboardData.time_of_usage" class="h-3 w-24 rounded-lg" />
          <span v-else>{{ formatNumber(dashboardData.time_of_usage) }}</span>
        </h2>
        <p class="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal">
          <span class="text-muted-500 dark:text-muted-400 mt-2">دقیقه استفاده</span>
        </p>
      </div>
    </div>

    <!-- Message Count Card -->
    <div class="nui-card nui-card-rounded-lg nui-card-default flex items-center gap-2 p-3">
      <div
        class="nui-icon-box nui-box-rounded-full nui-box-sm nui-box-solid bg-primary-100 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500 dark:border-2"
      >
        <Icon name="ph:chat-circle-text-duotone" class="size-5" />
      </div>
      <div>
        <h2 class="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
          <BasePlaceload v-if="!dashboardData.count_of_messages" class="h-3 w-24 rounded-lg" />
          <span v-else>{{ formatNumber(dashboardData.count_of_messages) }}</span>
        </h2>
        <p class="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal">
          <span class="text-muted-500 dark:text-muted-400 mt-2">پیام ارسال شده</span>
        </p>
      </div>
    </div>

    <!-- User Count Card -->
    <div class="nui-card nui-card-rounded-lg nui-card-default flex items-center gap-2 p-3">
      <div
        class="nui-icon-box nui-box-rounded-full nui-box-sm nui-box-solid bg-success-100 text-success-500 dark:bg-success-500/20 dark:text-success-400 dark:border-success-500 dark:border-2"
      >
        <Icon name="ph:users-duotone" class="size-5" />
      </div>
      <div>
        <h2 class="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
          <BasePlaceload v-if="!dashboardData.count_of_users" class="h-3 w-24 rounded-lg" />
          <span v-else>{{ formatNumber(dashboardData.count_of_users) }}</span>
        </h2>
        <p class="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal">
          <span class="text-muted-500 dark:text-muted-400 mt-2">کاربر فعال</span>
        </p>
      </div>
    </div>

    <!-- Session Count Card -->
    <div class="nui-card nui-card-rounded-lg nui-card-default flex items-center gap-2 p-3">
      <div
        class="nui-icon-box nui-box-rounded-full nui-box-sm nui-box-solid bg-warning-100 text-warning-500 dark:bg-warning-500/20 dark:text-warning-400 dark:border-warning-500 dark:border-2"
      >
        <Icon name="ph:chats-circle-duotone" class="size-5" />
      </div>
      <div>
        <h2 class="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
          <BasePlaceload v-if="!dashboardData.count_of_sessions" class="h-3 w-24 rounded-lg" />
          <span v-else>{{ formatNumber(dashboardData.count_of_sessions) }}</span>
        </h2>
        <p class="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal">
          <span class="text-muted-500 dark:text-muted-400 mt-2">جلسه برگزار شده</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dashboardData = ref({
  time_of_usage: 0,
  count_of_messages: 0,
  count_of_users: 0,
  count_of_sessions: 0,
})

// Format numbers with Persian digits and commas
const formatNumber = (num) => {
  if (!num) return '۰'
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  // Convert number to string and add standard comma as thousands separator
  let str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // Replace English digits with Persian digits
  return str.replace(/[0-9]/g, d => persianDigits[d])
}

// Format minutes to hours and minutes in Persian
const formatMinutes = (minutes) => {
  if (!minutes) return '۰'

  // Convert to hours and minutes
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours.toLocaleString('fa-IR')}:${remainingMinutes.toString().padStart(2, '0').toLocaleString('fa-IR')}`
  }

  return minutes.toLocaleString('fa-IR')
}

// Fetch dashboard data from PocketBase
const fetchDashboardData = async () => {
  try {
    const nuxtApp = useNuxtApp()
    const response = await nuxtApp.$pb.collection('dashboard_data').getOne('dashboard-12345')

    // Update dashboard data
    dashboardData.value = {
      time_of_usage: response.time_of_usage || 0,
      count_of_messages: response.count_of_messages || 0,
      count_of_users: response.count_of_users || 0,
      count_of_sessions: response.count_of_sessions || 0,
    }
  }
  catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchDashboardData()
})
</script>
