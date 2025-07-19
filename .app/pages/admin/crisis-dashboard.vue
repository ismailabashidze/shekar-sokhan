<script setup lang="ts">
definePageMeta({
  title: 'داشبورد مداخله بحران',
  layout: 'sidebar',
  middleware: 'admin'
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'داشبورد مداخله بحران - ادمین'
})

const { role } = useUser()
const toaster = useToaster()

// Dashboard stats
const crisisStats = ref({
  activeSessions: 5,
  onlineTherapists: 12,
  waitingQueue: 3,
  todayInterventions: 28,
  highRiskCases: 2,
  avgResponseTime: 3.2,
  successfulInterventions: 94.5,
  totalThisWeek: 156
})

// Active crisis sessions
const activeSessions = ref([
  {
    id: 'session-1',
    clientId: 'client-1',
    therapistId: 'therapist-1',
    clientName: 'کاربر ۱',
    therapistName: 'دکتر سارا احمدی',
    startTime: new Date(Date.now() - 1200000), // 20 minutes ago
    crisisLevel: 'high',
    status: 'active',
    riskFactors: ['suicidal_thoughts', 'substance_use'],
    location: 'تهران'
  },
  {
    id: 'session-2',
    clientId: 'client-2',
    therapistId: 'therapist-2',
    clientName: 'کاربر ۲',
    therapistName: 'دکتر علی رضایی',
    startTime: new Date(Date.now() - 900000), // 15 minutes ago
    crisisLevel: 'medium',
    status: 'active',
    riskFactors: ['anxiety', 'panic_attacks'],
    location: 'اصفهان'
  }
])

// Waiting queue
const waitingQueue = ref([
  {
    id: 'wait-1',
    clientName: 'کاربر ۳',
    requestTime: new Date(Date.now() - 300000), // 5 minutes ago
    crisisLevel: 'medium',
    description: 'اضطراب شدید و حملات پانیک',
    preferredLanguage: 'persian',
    location: 'مشهد'
  },
  {
    id: 'wait-2',
    clientName: 'کاربر ۴',
    requestTime: new Date(Date.now() - 180000), // 3 minutes ago
    crisisLevel: 'high',
    description: 'افکار آسیب‌رسانی',
    preferredLanguage: 'persian',
    location: 'شیراز'
  }
])

// Online therapists
const onlineTherapists = ref([
  {
    id: 'therapist-1',
    name: 'دکتر سارا احمدی',
    specialty: 'روانشناس بالینی',
    currentLoad: 2,
    maxLoad: 3,
    status: 'busy',
    avgResponseTime: 2.5,
    totalToday: 8,
    rating: 4.9
  },
  {
    id: 'therapist-2',
    name: 'دکتر علی رضایی',
    specialty: 'مشاور بحران',
    currentLoad: 1,
    maxLoad: 2,
    status: 'available',
    avgResponseTime: 1.8,
    totalToday: 6,
    rating: 4.8
  }
])

// Recent alerts
const recentAlerts = ref([
  {
    id: 'alert-1',
    type: 'high_risk',
    message: 'درخواست بحران سطح بالا در صف انتظار',
    time: new Date(Date.now() - 120000),
    priority: 'high',
    handled: false
  },
  {
    id: 'alert-2',
    type: 'response_time',
    message: 'زمان پاسخگویی بیش از حد مجاز',
    time: new Date(Date.now() - 600000),
    priority: 'medium',
    handled: true
  }
])

// Crisis level colors
const getCrisisLevelColor = (level: string) => {
  switch (level) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'muted'
  }
}

// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'success'
    case 'busy': return 'warning'
    case 'offline': return 'muted'
    default: return 'info'
  }
}

// Format duration
const formatDuration = (startTime: Date) => {
  const now = new Date()
  const diff = now.getTime() - startTime.getTime()
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Assign therapist to waiting client
const assignTherapist = async (clientId: string, therapistId: string) => {
  try {
    // API call to assign therapist
    toaster.show({
      title: 'مشاور تخصیص یافت',
      message: 'مشاور با موفقیت به کلاینت تخصیص یافت',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تخصیص مشاور',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Monitor session
const monitorSession = (sessionId: string) => {
  navigateTo(`/darmana/crisis/session/${sessionId}`)
}

// Handle alert
const handleAlert = async (alertId: string) => {
  try {
    const alert = recentAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.handled = true
    }
    
    toaster.show({
      title: 'هشدار مدیریت شد',
      message: 'هشدار با موفقیت مدیریت شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در مدیریت هشدار',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Refresh data periodically
const refreshData = () => {
  // This would fetch real-time data from API
  console.log('Refreshing crisis dashboard data...')
}

onMounted(() => {
  // Set up periodic refresh
  const interval = setInterval(refreshData, 30000) // Every 30 seconds
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Icon name="ph:shield-warning-duotone" class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <BaseHeading tag="h1" size="xl" weight="semibold" class="text-muted-900 dark:text-white">
                داشبورد مداخله بحران
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                نظارت و مدیریت جلسات مداخله بحران در زمان واقعی
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-muted-600 dark:text-muted-400">زنده</span>
            </div>
            <BaseButton
              color="primary"
              variant="outline"
              size="sm"
              @click="refreshData"
            >
              <Icon name="ph:arrows-clockwise-duotone" class="w-4 h-4 mr-2" />
              بروزرسانی
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BaseCard class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-600 dark:text-muted-400">جلسات فعال</p>
              <p class="text-2xl font-bold text-muted-900 dark:text-white">{{ crisisStats.activeSessions }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Icon name="ph:chat-circle-duotone" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-600 dark:text-muted-400">مشاوران آنلاین</p>
              <p class="text-2xl font-bold text-muted-900 dark:text-white">{{ crisisStats.onlineTherapists }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Icon name="ph:users-duotone" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-600 dark:text-muted-400">صف انتظار</p>
              <p class="text-2xl font-bold text-muted-900 dark:text-white">{{ crisisStats.waitingQueue }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Icon name="ph:clock-duotone" class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-600 dark:text-muted-400">موارد پرخطر</p>
              <p class="text-2xl font-bold text-muted-900 dark:text-white">{{ crisisStats.highRiskCases }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Icon name="ph:warning-octagon-duotone" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Sessions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Active Sessions -->
          <BaseCard>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <BaseHeading tag="h3" size="md" weight="semibold">
                  جلسات فعال
                </BaseHeading>
                <BaseTag color="primary" size="sm">
                  {{ activeSessions.length }} جلسه
                </BaseTag>
              </div>
              
              <div class="space-y-4">
                <div
                  v-for="session in activeSessions"
                  :key="session.id"
                  class="flex items-center justify-between p-4 border border-muted-200 dark:border-muted-700 rounded-lg"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col items-center">
                      <BaseTag
                        :color="getCrisisLevelColor(session.crisisLevel)"
                        size="sm"
                      >
                        {{ session.crisisLevel === 'high' ? 'بالا' : session.crisisLevel === 'medium' ? 'متوسط' : 'پایین' }}
                      </BaseTag>
                      <span class="text-xs text-muted-500 mt-1">
                        {{ formatDuration(session.startTime) }}
                      </span>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-muted-900 dark:text-white">
                        {{ session.clientName }} → {{ session.therapistName }}
                      </h4>
                      <p class="text-sm text-muted-600 dark:text-muted-400">
                        عوامل خطر: {{ session.riskFactors.join(', ') }}
                      </p>
                      <p class="text-xs text-muted-500">
                        موقعیت: {{ session.location }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <BaseButton
                      variant="outline"
                      size="sm"
                      @click="monitorSession(session.id)"
                    >
                      <Icon name="ph:eye-duotone" class="w-4 h-4 mr-2" />
                      نظارت
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Waiting Queue -->
          <BaseCard>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <BaseHeading tag="h3" size="md" weight="semibold">
                  صف انتظار
                </BaseHeading>
                <BaseTag color="warning" size="sm">
                  {{ waitingQueue.length }} نفر
                </BaseTag>
              </div>
              
              <div class="space-y-4">
                <div
                  v-for="client in waitingQueue"
                  :key="client.id"
                  class="flex items-center justify-between p-4 border border-muted-200 dark:border-muted-700 rounded-lg"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col items-center">
                      <BaseTag
                        :color="getCrisisLevelColor(client.crisisLevel)"
                        size="sm"
                      >
                        {{ client.crisisLevel === 'high' ? 'بالا' : client.crisisLevel === 'medium' ? 'متوسط' : 'پایین' }}
                      </BaseTag>
                      <span class="text-xs text-muted-500 mt-1">
                        {{ formatDuration(client.requestTime) }}
                      </span>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-muted-900 dark:text-white">
                        {{ client.clientName }}
                      </h4>
                      <p class="text-sm text-muted-600 dark:text-muted-400">
                        {{ client.description }}
                      </p>
                      <p class="text-xs text-muted-500">
                        {{ client.location }} • {{ client.preferredLanguage }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <BaseListbox
                      :items="onlineTherapists.filter(t => t.currentLoad < t.maxLoad).map(t => ({ label: t.name, value: t.id }))"
                      placeholder="انتخاب مشاور"
                      size="sm"
                      @update:model-value="assignTherapist(client.id, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Online Therapists -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                مشاوران آنلاین
              </BaseHeading>
              
              <div class="space-y-3">
                <div
                  v-for="therapist in onlineTherapists"
                  :key="therapist.id"
                  class="flex items-center justify-between p-3 bg-muted-50 dark:bg-muted-800 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <div class="w-2 h-2 rounded-full absolute -top-1 -right-1"
                        :class="getStatusColor(therapist.status) === 'success' ? 'bg-green-500' : 
                               getStatusColor(therapist.status) === 'warning' ? 'bg-yellow-500' : 'bg-muted-400'"
                      ></div>
                    </div>
                    <div>
                      <div class="font-medium text-muted-900 dark:text-white text-sm">
                        {{ therapist.name }}
                      </div>
                      <div class="text-xs text-muted-600 dark:text-muted-400">
                        {{ therapist.currentLoad }}/{{ therapist.maxLoad }} جلسه
                      </div>
                    </div>
                  </div>
                  
                  <BaseTag
                    :color="getStatusColor(therapist.status)"
                    size="sm"
                  >
                    {{ therapist.status === 'available' ? 'آزاد' : therapist.status === 'busy' ? 'مشغول' : 'آفلاین' }}
                  </BaseTag>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Recent Alerts -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                هشدارهای اخیر
              </BaseHeading>
              
              <div class="space-y-3">
                <div
                  v-for="alert in recentAlerts"
                  :key="alert.id"
                  class="flex items-start gap-3 p-3 rounded-lg"
                  :class="alert.handled ? 'bg-muted-50 dark:bg-muted-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'"
                >
                  <Icon 
                    :name="alert.priority === 'high' ? 'ph:warning-octagon-duotone' : 'ph:warning-duotone'"
                    class="w-4 h-4 mt-0.5"
                    :class="alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'"
                  />
                  <div class="flex-1">
                    <p class="text-sm text-muted-900 dark:text-white">
                      {{ alert.message }}
                    </p>
                    <p class="text-xs text-muted-500 mt-1">
                      {{ new Date(alert.time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                  </div>
                  <BaseButton
                    v-if="!alert.handled"
                    variant="outline"
                    size="sm"
                    @click="handleAlert(alert.id)"
                  >
                    مدیریت
                  </BaseButton>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Quick Stats -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                آمار سریع
              </BaseHeading>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-600 dark:text-muted-400">میانگین پاسخگویی</span>
                  <span class="font-semibold text-muted-900 dark:text-white">{{ crisisStats.avgResponseTime }} دقیقه</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-600 dark:text-muted-400">نرخ موفقیت</span>
                  <span class="font-semibold text-green-600">{{ crisisStats.successfulInterventions }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-muted-600 dark:text-muted-400">این هفته</span>
                  <span class="font-semibold text-muted-900 dark:text-white">{{ crisisStats.totalThisWeek }} مداخله</span>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>