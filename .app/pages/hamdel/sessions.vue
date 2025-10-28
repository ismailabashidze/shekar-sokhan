<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          جلسات
        </h1>
        <p class="text-gray-600">
          مدیریت جلسات درمانی بیماران
        </p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <button class="btn btn-primary">
          <Icon name="ph:plus" class="ml-2 size-4" />
          جلسه جدید
        </button>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="rounded-lg bg-white shadow">
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            تقویم جلسات
          </h2>
          <div class="flex space-x-2 space-x-reverse">
            <button class="btn btn-secondary btn-sm">
              هفته
            </button>
            <button class="btn btn-primary btn-sm">
              ماه
            </button>
          </div>
        </div>
      </div>
      <div class="p-6">
        <!-- Simple calendar grid -->
        <div class="grid grid-cols-7 gap-1 text-center">
          <div class="py-2 text-sm font-medium text-gray-500">
            شنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            یکشنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            دوشنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            سه‌شنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            چهارشنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            پنجشنبه
          </div>
          <div class="py-2 text-sm font-medium text-gray-500">
            جمعه
          </div>

          <!-- Calendar days -->
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="min-h-[80px] cursor-pointer rounded-lg border p-2 hover:bg-gray-50"
            :class="{
              'border-blue-200 bg-blue-50': day.isToday,
              'bg-gray-50': !day.isCurrentMonth
            }"
          >
            <div class="text-sm font-medium">
              {{ day.day }}
            </div>
            <div v-if="day.sessions.length > 0" class="mt-1">
              <div
                v-for="session in day.sessions.slice(0, 2)"
                :key="session.id"
                class="mb-1 truncate rounded bg-pink-100 px-1 py-0.5 text-xs text-pink-800"
              >
                {{ session.patient }}
              </div>
              <div v-if="day.sessions.length > 2" class="text-xs text-gray-500">
                +{{ day.sessions.length - 2 }} بیشتر
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Sessions -->
    <div class="rounded-lg bg-white shadow">
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900">
          جلسات امروز
        </h2>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="session in todaySessions"
          :key="session.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="shrink-0">
                <img
                  class="size-10 rounded-full"
                  :src="session.patientAvatar"
                  :alt="session.patient"
                >
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ session.patient }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ session.time }} - {{ session.type }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3 space-x-reverse">
              <span
                class="rounded-full px-2 py-1 text-xs font-medium"
                :class="getSessionStatusClass(session.status)"
              >
                {{ session.status }}
              </span>
              <button class="btn btn-secondary btn-sm">
                جزئیات
              </button>
              <button
                v-if="session.status === 'منتظر'"
                class="btn btn-primary btn-sm"
              >
                شروع جلسه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'zone',
  // Using global middlewares only
})

// Generate calendar days
const calendarDays = ref<Array<{
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  sessions: Array<{ id: number, patient: string }>
}>>([])

// Mock data
const todaySessions = [
  {
    id: 1,
    patient: 'علی رضایی',
    patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    time: '۰۹:۰۰',
    type: 'درمان فردی',
    status: 'منتظر',
  },
  {
    id: 2,
    patient: 'مریم احمدی',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    time: '۱۰:۳۰',
    type: 'درمان فردی',
    status: 'در حال انجام',
  },
  {
    id: 3,
    patient: 'سعید محمدی',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    time: '۱۴:۰۰',
    type: 'گروه درمانی',
    status: 'انجام شده',
  },
]

// Generate mock calendar
onMounted(() => {
  const days = []
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get first day of month
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)

  // Add previous month days
  const startPadding = firstDay.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(firstDay)
    date.setDate(date.getDate() - i - 1)
    days.push({
      date: date.toISOString(),
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      sessions: [],
    })
  }

  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear, currentMonth, i)
    const isToday = date.toDateString() === today.toDateString()

    // Add random sessions for demo
    const sessions = []
    if (Math.random() > 0.7 && !isToday) {
      const sessionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < sessionCount; j++) {
        sessions.push({
          id: i * 10 + j,
          patient: ['علی رضایی', 'مریم احمدی', 'سعید محمدی'][j % 3],
        })
      }
    }

    days.push({
      date: date.toISOString(),
      day: i,
      isCurrentMonth: true,
      isToday,
      sessions,
    })
  }

  // Add next month days to complete grid
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(lastDay)
    date.setDate(date.getDate() + i)
    days.push({
      date: date.toISOString(),
      day: i,
      isCurrentMonth: false,
      isToday: false,
      sessions: [],
    })
  }

  calendarDays.value = days
})

const getSessionStatusClass = (status: string) => {
  switch (status) {
    case 'منتظر':
      return 'bg-yellow-100 text-yellow-800'
    case 'در حال انجام':
      return 'bg-blue-100 text-blue-800'
    case 'انجام شده':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
