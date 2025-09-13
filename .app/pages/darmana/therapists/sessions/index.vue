<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import type { SessionAnalysis } from '~/composables/useSessionAnalysis'

// Define types
interface Therapist {
  id: string
  name: string
  specialty?: string
  avatar?: string
}

interface SessionWithExpanded {
  id: string
  session_type: 'educational' | 'therapic'
  start_time: string
  end_time: string
  user: string
  status: 'inprogress' | 'done' | 'closed' | 'deleted' | 'generatingReport'
  count_of_total_messages: number
  total_time_passed: number
  session_analysis_for_system: string
  created: string
  updated?: string
  expand?: {
    therapist?: Therapist
    session_analysis_for_system?: SessionAnalysis
  }
}

definePageMeta({
  title: 'جلسات مشاوره',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const statusFilter = ref('all')
const perPage = ref(10)
const sessions = ref<SessionWithExpanded[]>([])
const loading = ref(false)
const toaster = useToaster()
const nuxtApp = useNuxtApp()
const { role } = useUser()

const isAdmin = computed(() => role.value === 'admin')
const targetUserId = computed(() => {
  const queryUserId = Array.isArray(route.query.userId)
    ? route.query.userId[0]
    : route.query.userId

  return queryUserId || nuxtApp.$pb.authStore.model?.id
})

const { getSessions } = useSessions()

// Format date to Persian format
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'تاریخ نامشخص'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format duration in minutes to readable format
const formatDuration = (minutes: number | undefined): string => {
  if (!minutes || minutes <= 0) return 'زمان ثبت نشده'
  if (minutes < 60) return `${minutes} دقیقه`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours} ساعت و ${remainingMinutes} دقیقه`
}

// Get status display text and color
const getStatusInfo = (status: SessionWithExpanded['status']) => {
  switch (status) {
    case 'inprogress':
      return { text: 'در حال انجام', color: 'warning' as const }
    case 'done':
      return { text: 'تکمیل شده', color: 'success' as const }
    case 'closed':
      return { text: 'بسته شده', color: 'info' as const }
    case 'deleted':
      return { text: 'حذف شده', color: 'danger' as const }
    case 'generatingReport':
      return { text: 'در انتظار گزارش', color: 'primary' as const }
    default:
      return { text: 'نامشخص', color: 'muted' as const }
  }
}

// Get session type display text and color
const getSessionTypeInfo = (type: SessionWithExpanded['session_type']) => {
  switch (type) {
    case 'educational':
      return { text: 'آموزشی', color: 'info' as const, icon: 'ph:graduation-cap-duotone' }
    case 'therapic':
      return { text: 'درمانی', color: 'success' as const, icon: 'ph:heartbeat-duotone' }
    default:
      return { text: 'نامشخص', color: 'muted' as const, icon: 'ph:question-duotone' }
  }
}

// Format time for display
const formatTime = (timeString: string | undefined, isOngoing = false): string => {
  if (!timeString) {
    return isOngoing ? 'در حال انجام' : 'زمان نامشخص'
  }
  const date = new Date(timeString)
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Get trust level color
const getTrustLevelColor = (level: 'veryHigh' | 'high' | 'low' | 'veryLow') => {
  switch (level) {
    case 'veryHigh':
      return 'success' as const
    case 'high':
      return 'info' as const
    case 'low':
      return 'warning' as const
    case 'veryLow':
      return 'danger' as const
    default:
      return 'muted' as const
  }
}

// Get trust level text
const getTrustLevelText = (level: 'veryHigh' | 'high' | 'low' | 'veryLow') => {
  switch (level) {
    case 'veryHigh':
      return 'بسیار بالا'
    case 'high':
      return 'بالا'
    case 'low':
      return 'پایین'
    case 'veryLow':
      return 'بسیار پایین'
    default:
      return 'نامشخص'
  }
}

// Check if user is trying to access another user's sessions without admin rights
const checkAccess = () => {
  const queryUserId = Array.isArray(route.query.userId)
    ? route.query.userId[0]
    : route.query.userId

  if (queryUserId && !isAdmin.value) {
    // Non-admin trying to access another user's sessions - redirect to their own sessions
    router.push('/darmana/therapists/sessions')
    return false
  }
  return true
}

// Fetch sessions
const fetchSessions = async () => {
  loading.value = true

  if (!checkAccess()) {
    loading.value = false
    return
  }

  try {
    let filterObj: any = {}

    // Check if we're manually filtering by status
    if (statusFilter.value !== 'all') {
      filterObj.status = statusFilter.value
    } else {
      // Auto-filter logic: first check for ongoing sessions
      filterObj.status = 'inprogress'
    }

    // If admin is viewing another user's sessions, use patientId filter
    if (isAdmin.value && route.query.userId) {
      filterObj.patientId = route.query.userId
    }

    const result = await getSessions(filterObj)
    sessions.value = result as unknown as SessionWithExpanded[]
    
    // If no ongoing sessions and we're using auto-filter, show completed sessions
    if (sessions.value.length === 0 && statusFilter.value === 'all') {
      filterObj.status = 'done'
      const completedResult = await getSessions(filterObj)
      sessions.value = completedResult as unknown as SessionWithExpanded[]
    }
    
    console.log('Sessions loaded:', sessions.value)
  }
  catch (error) {
    console.error('Error fetching sessions:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت اطلاعات جلسات',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    loading.value = false
  }
}

// Refresh sessions data
const refreshSessions = () => {
  // Reset to auto-filter mode when refreshing
  if (statusFilter.value === 'all') {
    fetchSessions()
  } else {
    // If manually filtered, keep the filter
    fetchSessions()
  }
  
  toaster.show({
    title: 'بروزرسانی',
    message: 'اطلاعات جلسات بروزرسانی شد',
    color: 'success',
    icon: 'ph:check-circle-fill',
    closable: true,
  })
}

// Navigate to session analysis
const viewSessionAnalysis = (sessionId: string) => {
  navigateTo(`/darmana/therapists/analysis?analysis_id=${sessionId}`)
}

// Navigate to session history
const viewSessionHistory = (sessionId: string) => {
  navigateTo(`/darmana/therapists/history?sessionId=${sessionId}`)
}

// Continue a session
const continueSession = (therapistId: string) => {
  navigateTo(`/darmana/therapists/messaging?therapistId=${therapistId}`)
}

// Filter sessions based on search term
const filteredSessions = computed(() => {
  if (!filter.value.trim()) return sessions.value

  const searchTerm = filter.value.toLowerCase()
  return sessions.value.filter((session) => {
    // Search in therapist name if expanded
    const therapistName = session.expand?.therapist?.name || ''
    // Search in session ID
    return therapistName.toLowerCase().includes(searchTerm)
      || session.id.toLowerCase().includes(searchTerm)
  })
})

// Pagination
const paginatedSessions = computed(() => {
  const start = (page.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredSessions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / perPage.value)
})

// Fetch sessions on component mount
onMounted(() => {
  fetchSessions()
})
</script>

<template>
  <div class="mb-5">
    <TairoContentWrapper>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:chat-circle-text-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            جلسات مشاوره
          </BaseHeading>
        </div>

        <div class="flex items-center gap-2">
          <BaseSelect
            v-model="statusFilter"
            shape="rounded"
            class="hidden w-40 sm:block"
            data-tour="sessions-filter"
            @update:model-value="fetchSessions"
          >
            <option value="all">
              جلسات فعال/تکمیل شده
            </option>
            <option value="inprogress">
              در حال انجام
            </option>
            <option value="done">
              تکمیل شده
            </option>
            <option value="generatingReport">
              در انتظار گزارش
            </option>
            <option value="closed">
              بسته شده
            </option>
            <option value="deleted">
              حذف شده
            </option>
          </BaseSelect>

          <BaseInput
            v-model="filter"
            icon="lucide:search"
            placeholder="جستجو در جلسات..."
            data-tour="sessions-search"
            :classes="{
              wrapper: 'hidden sm:block w-full sm:w-64',
            }"
          />

          <BaseButton
            color="success"
            shape="curved"
            class="gap-1"
            data-tour="sessions-refresh"
            @click="refreshSessions"
          >
            <Icon name="ph:arrows-clockwise-duotone" class="size-4" />
            <span class="hidden sm:inline">بروزرسانی</span>
          </BaseButton>

          <BaseButton
            color="primary"
            class="w-full gap-1 sm:w-auto"
            shape="curved"
            data-tour="sessions-new"
            @click="navigateTo('/darmana/therapists/chooseTherapist')"
          >
            <Icon name="ph:plus-bold" class="size-4" />
            <span>جلسه جدید</span>
          </BaseButton>
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        تاریخچه جلسات مشاوره شما با روانشناسان
      </BaseParagraph>

      <!-- Loading state -->
      <div v-if="loading" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 w-full">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div
                v-for="i in 5"
                :key="i"
              >
                <BaseCard shape="curved" class="overflow-hidden">
                  <div class="p-4">
                    <div class="flex items-center justify-between">
                      <BasePlaceload class="h-5 w-40 rounded" />
                      <BasePlaceload class="h-5 w-20 rounded" />
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                      <BasePlaceload class="h-4 w-32 rounded" />
                      <BasePlaceload class="h-4 w-24 rounded" />
                    </div>
                    <div class="mt-3 flex items-center justify-between">
                      <BasePlaceload class="h-4 w-28 rounded" />
                      <BasePlaceload class="h-8 w-24 rounded" />
                    </div>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="!loading && filteredSessions.length === 0">
        <BasePlaceholderPage
          :title="statusFilter === 'all' ? 'جلسه‌ای در حال انجام یا تکمیل شده یافت نشد' : 'جلسه‌ای یافت نشد'"
          :subtitle="statusFilter === 'all' ? 'هیچ جلسه‌ای در حال انجام یا تکمیل شده یافت نشد. لطفا یک جلسه جدید شروع کنید.' : 'هیچ جلسه‌ای با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید یا یک جلسه جدید شروع کنید.'"
        >
          <template #image>
            <img
              class="block dark:hidden"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
            <img
              class="hidden dark:block"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
          </template>
          <template #action>
            <div class="flex gap-2">
              <BaseButton
                v-if="statusFilter !== 'all'"
                color="muted"
                shape="curved"
                @click="statusFilter = 'all'; fetchSessions()"
              >
                نمایش جلسات فعال/تکمیل شده
              </BaseButton>
              <BaseButton
                color="primary"
                shape="curved"
                @click="navigateTo('/darmana/therapists/chooseTherapist')"
              >
                شروع جلسه جدید
              </BaseButton>
            </div>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Results list -->
      <div
        v-else
        class="mt-6 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2"
        data-tour="sessions-list"
      >
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <BaseCard
            v-for="(session, index) in paginatedSessions"
            :key="session.id"
            shape="curved"
            class="border-muted-200 dark:border-muted-700 mb-4 flex h-full flex-col overflow-hidden border transition-all duration-300 hover:shadow-lg"
            :data-tour="index === 0 ? 'sessions-card' : undefined"
          >
            <div class="bg-muted-50 dark:bg-muted-800/30 border-muted-200 dark:border-muted-700 border-b p-4">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="flex items-center">
                  <BaseAvatar
                    :src="session.expand?.therapist?.avatar ? `https://pocket.zehna.ir/api/files/therapists/${session.expand.therapist.id}/${session.expand.therapist.avatar}` : '/img/avatars/default-male.jpg'"
                    size="lg"
                    class="ml-3"
                  />
                  <div>
                    <div class="flex items-center">
                      <BaseTag
                        :color="getSessionTypeInfo(session.session_type).color"
                        shape="curved"
                        size="md"
                        class="ml-2"
                      >
                        <div class="flex items-center px-3 py-1">
                          <Icon :name="getSessionTypeInfo(session.session_type).icon" class="ml-1 size-3" />
                          {{ getSessionTypeInfo(session.session_type).text }}
                        </div>
                      </BaseTag>
                      <BaseHeading
                        tag="h3"
                        size="sm"
                        weight="medium"
                        class="text-muted-800 dark:text-white"
                      >
                        {{ session.expand?.therapist?.name || 'روانشناس' }}
                      </BaseHeading>
                    </div>

                    <div v-if="session.expand?.therapist?.specialty" class="text-muted-400 mt-1 text-xs">
                      {{ session.expand.therapist.specialty }}
                    </div>

                    <div class="text-muted-400 mt-1 flex items-center">
                      <Icon name="ph:calendar-duotone" class="ml-1 size-4" />
                      <BaseParagraph size="xs">
                        {{ formatDate(session.created) }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>

                <div class="mt-3 md:mt-0">
                  <BaseTag
                    :color="getStatusInfo(session.status).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="px-3 py-1">
                      {{ getStatusInfo(session.status).text }}
                    </div>
                  </BaseTag>
                </div>
              </div>
            </div>

            <div class="flex-1 p-4">
              <!-- Main Content Grid -->
              <div class="grid h-full grid-cols-1 gap-4">
                <!-- Session Stats Row -->
                <div class="grid grid-cols-1 md:grid-cols-3">
                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-primary-100 dark:bg-primary-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:clock-duotone" class="text-primary-500 size-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">مدت جلسه</span>
                      <span class="text-muted-800 font-medium dark:text-white">
                        {{ formatDuration(session.total_time_passed) }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-info-100 dark:bg-info-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:chat-dots-duotone" class="text-info-500 size-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">تعداد پیام‌ها</span>
                      <span class="text-muted-800 font-medium dark:text-white">
                        {{ session.status === 'inprogress' ? 'در حال انجام' : (session.count_of_total_messages || '0') + ' پیام' }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-success-100 dark:bg-success-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:timer-duotone" class="text-success-500 size-4" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">زمان شروع/پایان</span>
                      <span class="text-muted-800 font-medium dark:text-white">
                        {{ session.status === 'inprogress' ? 'در حال انجام' : formatTime(session.start_time) + ' - ' + formatTime(session.end_time) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Analysis Summary -->
                <div v-if="session.expand?.session_analysis_for_system" class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
                  <div class="mb-3 flex items-center">
                    <div class="bg-info-100 dark:bg-info-500/20 ml-2 rounded-full p-1">
                      <Icon name="ph:brain-duotone" class="text-info-500 size-4" />
                    </div>
                    <BaseHeading
                      tag="h4"
                      size="xs"
                      weight="medium"
                      class="text-muted-700 dark:text-muted-300"
                    >
                      تحلیل جلسه
                    </BaseHeading>
                  </div>

                  <div class="space-y-3">
                    <!-- Session Title -->
                    <div v-if="session.expand.session_analysis_for_system.title">
                      <BaseHeading
                        tag="h5"
                        size="xs"
                        weight="medium"
                        class="text-muted-600 dark:text-muted-400 mb-1"
                      >
                        {{ session.expand.session_analysis_for_system.title }}
                      </BaseHeading>
                      <BaseParagraph
                        v-if="session.expand.session_analysis_for_system.summaryOfSession"
                        size="xs"
                        class="text-muted-500"
                      >
                        {{ session.expand.session_analysis_for_system.summaryOfSession }}
                      </BaseParagraph>
                    </div>

                    <!-- Trust Level -->
                    <div v-if="session.expand.session_analysis_for_system.finalTrustAndOppennessOfUser" class="flex items-center justify-between">
                      <span class="text-muted-600 dark:text-muted-400 text-xs">سطح اعتماد:</span>
                      <BaseTag
                        :color="getTrustLevelColor(session.expand.session_analysis_for_system.finalTrustAndOppennessOfUser)"
                        shape="curved"
                        size="sm"
                        class="trust-level-badge"
                      >
                        {{ getTrustLevelText(session.expand.session_analysis_for_system.finalTrustAndOppennessOfUser) }}
                      </BaseTag>
                    </div>

                    <!-- Key Headlines -->
                    <div v-if="session.expand.session_analysis_for_system.headlines && session.expand.session_analysis_for_system.headlines.length > 0">
                      <span class="text-muted-600 dark:text-muted-400 mb-2 block text-xs">نکات کلیدی:</span>
                      <div class="space-y-1">
                        <div
                          v-for="(headline, index) in session.expand.session_analysis_for_system.headlines.slice(0, 1)"
                          :key="index"
                          class="dark:bg-muted-800 rounded-md bg-white p-2"
                        >
                          <span class="text-muted-700 dark:text-muted-300 text-xs font-medium">{{ headline.title }}</span>
                          <BaseParagraph size="xs" class="text-muted-500 mt-1">
                            {{ headline.description }}
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fallback for sessions without analysis -->
                <div v-else class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
                  <div class="mb-3 flex items-center">
                    <div class="bg-muted-200 dark:bg-muted-700 ml-2 rounded-full p-1">
                      <Icon name="ph:clock-duotone" class="text-muted-500 size-4" />
                    </div>
                    <BaseHeading
                      tag="h4"
                      size="xs"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400"
                    >
                      اطلاعات جلسه
                    </BaseHeading>
                  </div>

                  <div class="space-y-3">
                    <!-- Session ID -->
                    <div v-if="session.status !== 'inprogress'">
                      <span class="text-muted-600 dark:text-muted-400 text-xs">شناسه جلسه:</span>
                      <BaseParagraph size="xs" class="text-muted-700 dark:text-muted-300 mt-1 font-mono">
                        {{ session.status === 'inprogress' ? 'در حال انجام' : session.id.slice(-8) }}
                      </BaseParagraph>
                    </div>

                    <!-- Status Info -->
                    <div v-if="session.status === 'inprogress'" class="text-center">
                      <Icon name="ph:play-duotone" class="text-primary-500 mx-auto mb-2 size-6" />
                      <BaseParagraph size="xs" class="text-primary-600 dark:text-primary-400">
                        این جلسه در حال انجام است
                      </BaseParagraph>
                    </div>

                    <div v-else-if="session.status === 'done'" class="text-center">
                      <Icon name="ph:clock-countdown-duotone" class="text-info-500 mx-auto mb-2 size-6" />
                      <BaseParagraph size="xs" class="text-muted-500">
                        تحلیل این جلسه در حال پردازش است
                      </BaseParagraph>
                    </div>

                    <div v-else class="text-center">
                      <Icon name="ph:info-duotone" class="text-muted-400 mx-auto mb-2 size-6" />
                      <BaseParagraph size="xs" class="text-muted-400">
                        تحلیل برای این جلسه در دسترس نیست
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="border-muted-200 dark:border-muted-700 border-t p-4"
              :data-tour="index === 0 ? 'sessions-actions' : undefined"
            >
              <div class="flex flex-wrap items-center justify-end gap-2">
                <BaseButton
                  v-if="session.status === 'done' || session.status === 'generatingReport'"
                  color="info"
                  shape="curved"
                  :disabled="session.status === 'generatingReport'"
                  @click="viewSessionAnalysis(session.session_analysis_for_system)"
                >
                  <Icon name="ph:chart-line-duotone" class="ml-1 size-4" />
                  مشاهده تحلیل
                </BaseButton>

                <BaseButton
                  color="warning"
                  shape="curved"
                  :data-tour="index === 0 ? 'sessions-history' : undefined"
                  @click="viewSessionHistory(session.id)"
                >
                  <Icon name="ph:clock-counter-clockwise-duotone" class="ml-1 size-4" />
                  تاریخچه
                </BaseButton>

                <BaseButton
                  v-if="session.status === 'inprogress'"
                  color="success"
                  shape="curved"
                  @click="continueSession(session.expand?.therapist?.id)"
                >
                  <Icon name="ph:play-duotone" class="ml-1 size-4" />
                  ادامه جلسه
                </BaseButton>
                
                <BaseButton
                  v-else-if="!['done', 'inprogress', 'closed', 'deleted', 'generatingReport'].includes(session.status)"
                  color="muted"
                  shape="curved"
                  disabled
                >
                  <Icon name="ph:info-duotone" class="ml-1 size-4" />
                  {{ session.status === 'closed' ? 'جلسه بسته شده' : 'غیرقابل دسترس' }}
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </TransitionGroup>

        <!-- Pagination -->
        <div v-if="filteredSessions.length > perPage" class="my-6">
          <BasePagination
            :total-items="filteredSessions.length"
            :item-per-page="perPage"
            :current-page="page"
            rounded="full"
          />
        </div>
      </div>
    </TairoContentWrapper>

    <!-- Tour Component -->
    <TourButton />
  </div>
</template>

<style scoped>
.text-muted-400 {
  line-height: 1.6;
}

.flex.items-center {
  line-height: 1.5;
}

/* Remove the margin-bottom that was causing the issue */
.flex.items-center:not(.nui-tag .flex.items-center):not(.bg-info-100 + div .flex.items-center) {
  margin-bottom: 0;
}

/* Ensure tag content is visible */
.nui-tag .flex.items-center {
  line-height: normal;
  margin-bottom: 0;
}

/* Fix icon container margin in analysis section */
.bg-info-100 {
  margin-bottom: 0 !important;
}

.bg-info-100 + div {
  margin-bottom: 0;
}

.text-xs {
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.bg-muted-100 {
  line-height: 1.5;
}

.bg-muted-100 .flex-col span {
  line-height: 1.6;
  padding: 0.125rem 0;
}

/* Fix trust level badge spacing */
.trust-level-badge {
  margin: 0 !important;
  padding: 0.25rem 0.75rem !important;
}

/* Fix trust level container spacing */
.flex.items-center.justify-between {
  margin-bottom: 0.75rem;
}

.flex.items-center.justify-between:last-child {
  margin-bottom: 0;
}
</style>
