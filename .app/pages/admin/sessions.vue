<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { SessionAnalysis } from '~/composables/useSessionAnalysis'

// Define types
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

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
  status: 'inprogress' | 'done' | 'closed' | 'deleted'
  count_of_total_messages: number
  total_time_passed: number
  session_analysis_for_system: string
  created: string
  updated?: string
  attend_date?: string
  expand?: {
    user?: User
    therapist?: Therapist
    session_analysis_for_system?: SessionAnalysis
  }
}

definePageMeta({
  title: 'مدیریت جلسات',
  layout: 'sidebar',
  middleware: 'admin'
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed({
  get: () => parseInt((route.query.page as string) ?? '1'),
  set: (value: number) => {
    router.push({
      query: { ...route.query, page: value.toString() }
    })
  }
})

const filter = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const perPage = ref(10)
const sessions = ref<SessionWithExpanded[]>([])
const loading = ref(false)
const pageLoading = ref(false)
const totalItems = ref(0)
const hasMore = ref(true)
const toaster = useToaster()
const { role } = useUser()

const isAdmin = computed(() => role.value === 'admin')

const { getAllSessionsForAdmin } = useSessions()
const { getSessionGoals } = useSessionGoals()

// Goals state
const sessionGoalsMap = ref(new Map())
const showGoalsModal = ref(false)
const selectedSessionGoals = ref([])
const selectedSession = ref(null)
const goalsLoading = ref(false)

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

// Format attendance date (shorter format)
const formatAttendDate = (dateString: string | undefined): string => {
  if (!dateString) return 'حضور نامشخص'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return 'زمان نامشخص'
  const date = new Date(timeString)
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Redirect non-admin users
const checkAdminAccess = () => {
  if (!isAdmin.value) {
    navigateTo('/dashboard')
    return false
  }
  return true
}

// Fetch sessions with server-side pagination
const fetchSessions = async (pageNum: number = 1) => {
  if (pageNum === 1) {
    loading.value = true
  } else {
    pageLoading.value = true
  }

  if (!checkAdminAccess()) {
    loading.value = false
    pageLoading.value = false
    return
  }

  try {
    // Build filter object for API call with pagination
    let filterObj: any = {
      page: pageNum,
      perPage: perPage.value,
      sort: '-created' // Sort by created desc (newest first)
    }

    if (statusFilter.value !== 'all') {
      filterObj.status = statusFilter.value
    }

    if (typeFilter.value !== 'all') {
      filterObj.session_type = typeFilter.value
    }

    // Add search filter if present
    if (filter.value.trim()) {
      filterObj.search = filter.value.trim()
    }

    // Use the new getAllSessionsForAdmin function
    const result = await getAllSessionsForAdmin(filterObj)
    
    // Handle the response from getAllSessionsForAdmin
    sessions.value = result.items as unknown as SessionWithExpanded[]
    totalItems.value = result.totalItems || 0
    
    // Sort client-side by attend_date as fallback (in case server doesn't sort by attend_date)
    sessions.value.sort((a, b) => {
      const dateA = new Date(a.attend_date || a.created).getTime()
      const dateB = new Date(b.attend_date || b.created).getTime()
      return dateB - dateA // Newest first
    })

    hasMore.value = pageNum < result.totalPages
    
    // Load goals for all sessions
    const sessionIds = sessions.value.map(session => session.id)
    if (sessionIds.length > 0) {
      await loadSessionsGoals(sessionIds)
    }
    
    console.log('Admin sessions loaded:', {
      page: pageNum,
      total: totalItems.value,
      loaded: sessions.value.length,
      hasMore: hasMore.value,
      perPage: perPage.value,
      totalPages: result.totalPages
    })
  }
  catch (error) {
    console.error('Error fetching sessions:', error)
    // Reset values on error
    sessions.value = []
    totalItems.value = 0
    hasMore.value = false
    
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
    pageLoading.value = false
  }
}

// Refresh sessions data
const refreshSessions = () => {
  page.value = 1
  fetchSessions(1)
  toaster.show({
    title: 'بروزرسانی',
    message: 'اطلاعات جلسات بروزرسانی شد',
    color: 'success',
    icon: 'ph:check-circle-fill',
    closable: true,
  })
}

// Handle filter changes
const handleFilterChange = () => {
  page.value = 1
  fetchSessions(1)
}

// Handle page change
const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchSessions(newPage)
}

// Navigate to session analysis
const viewSessionAnalysis = (sessionId: string) => {
  navigateTo(`/darmana/therapists/analysis?analysis_id=${sessionId}`)
}

// Navigate to session history
const viewSessionHistory = (sessionId: string) => {
  navigateTo(`/darmana/therapists/history?sessionId=${sessionId}`)
}

// Navigate to user profile
const viewUserProfile = (userId: string) => {
  navigateTo(`/admin/users/${userId}`)
}

// Goals functions
const viewSessionGoals = async (session: any) => {
  selectedSession.value = session
  goalsLoading.value = true
  
  try {
    const goals = await getSessionGoals(session.id)
    console.log('Session goals loaded:', goals)
    selectedSessionGoals.value = goals
    showGoalsModal.value = true
  } catch (error) {
    console.error('Error loading session goals:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در بارگذاری اهداف جلسه',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    goalsLoading.value = false
  }
}

const closeGoalsModal = () => {
  showGoalsModal.value = false
  selectedSessionGoals.value = []
  selectedSession.value = null
}

const getGoalStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'muted'
    case 'in_progress': return 'warning'
    case 'achieved': return 'success'
    case 'partially_achieved': return 'info'
    case 'modified': return 'primary'
    default: return 'muted'
  }
}

const getGoalStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'در انتظار'
    case 'in_progress': return 'در حال انجام'
    case 'achieved': return 'محقق شده'
    case 'partially_achieved': return 'تا حدی محقق شده'
    case 'modified': return 'تغییر یافته'
    default: return 'نامشخص'
  }
}

const getGoalPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'muted'
  }
}

const getGoalPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'بالا'
    case 'medium': return 'متوسط'
    case 'low': return 'پایین'
    default: return 'نامشخص'
  }
}

// Load goals for sessions
const loadSessionsGoals = async (sessionIds: string[]) => {
  try {
    const goalsPromises = sessionIds.map(async (sessionId) => {
      const goals = await getSessionGoals(sessionId)
      return { sessionId, goals }
    })
    
    const results = await Promise.all(goalsPromises)
    const newGoalsMap = new Map()
    
    results.forEach(({ sessionId, goals }) => {
      newGoalsMap.set(sessionId, goals)
    })
    
    sessionGoalsMap.value = newGoalsMap
  } catch (error) {
    console.error('Error loading sessions goals:', error)
  }
}

// Watch for filter changes with debounce
let searchTimeout: NodeJS.Timeout | null = null

watch([filter, statusFilter, typeFilter], () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 300)
})

// Watch for page changes
watch(page, (newPage) => {
  if (newPage > 1) {
    handlePageChange(newPage)
  }
})

// Computed values for pagination
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / perPage.value)
})

// Fetch sessions on component mount
onMounted(() => {
  fetchSessions(page.value)
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:shield-star-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            مدیریت جلسات
          </BaseHeading>
        </div>

        <div class="flex items-center gap-2">
          <BaseSelect
            v-model="typeFilter"
            shape="rounded"
            class="hidden w-32 sm:block"
          >
            <option value="all">
              همه انواع
            </option>
            <option value="educational">
              آموزشی
            </option>
            <option value="therapic">
              درمانی
            </option>
          </BaseSelect>

          <BaseSelect
            v-model="statusFilter"
            shape="rounded"
            class="hidden w-40 sm:block"
          >
            <option value="all">
              همه وضعیت‌ها
            </option>
            <option value="inprogress">
              در حال انجام
            </option>
            <option value="done">
              تکمیل شده
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
            :classes="{
              wrapper: 'hidden sm:block w-full sm:w-64',
            }"
          />

          <BaseButton
            color="success"
            shape="curved"
            class="gap-1"
            @click="refreshSessions"
          >
            <Icon name="ph:arrows-clockwise-duotone" class="size-4" />
            <span class="hidden sm:inline">بروزرسانی</span>
          </BaseButton>
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        مدیریت و مشاهده تمام جلسات مشاوره (مرتب شده بر اساس جدیدترین تاریخ حضور)
      </BaseParagraph>

      <!-- Loading state -->
      <div v-if="loading" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 w-full">
            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="i in 8"
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
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="!loading && sessions.length === 0">
        <BasePlaceholderPage
          title="جلسه‌ای یافت نشد"
          subtitle="هیچ جلسه‌ای با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید."
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
            <BaseButton
              color="primary"
              shape="curved"
              @click="statusFilter = 'all'; typeFilter = 'all'; filter = ''; handleFilterChange()"
            >
              نمایش همه جلسات
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Admin Sessions Table -->
      <div v-else class="mt-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-muted-200 dark:border-muted-700 border-b">
                <th class="text-muted-500 px-4 py-3 text-center text-sm font-medium">
                  #
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  تاریخ حضور
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  کاربر
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  مشاور
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  نوع جلسه
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  وضعیت
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  مدت
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  پیام‌ها
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  اهداف
                </th>
                <th class="text-muted-500 px-4 py-3 text-right text-sm font-medium">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(session, index) in sessions"
                :key="session.id"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-900/50 border-b transition-colors"
              >
                <!-- Row Index -->
                <td class="px-4 py-3 text-center">
                  <span class="bg-muted-100 dark:bg-muted-800 text-muted-600 dark:text-muted-400 inline-flex size-8 items-center justify-center rounded-full text-sm font-medium">
                    {{ ((page - 1) * perPage) + index + 1 }}
                  </span>
                </td>

                <!-- Attend Date -->
                <td class="px-4 py-3">
                  <div class="flex flex-col">
                    <span class="text-muted-800 dark:text-white text-sm font-medium">
                      {{ formatAttendDate(session.attend_date || session.created) }}
                    </span>
                    <span class="text-muted-400 text-xs">
                      {{ formatTime(session.attend_date || session.created) }}
                    </span>
                  </div>
                </td>

                <!-- User -->
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <BaseAvatar
                      :src="session.expand?.user?.avatar ? `https://pocket.zehna.ir/api/files/users/${session.expand.user.id}/${session.expand.user.avatar}` : '/img/avatars/default-male.jpg'"
                      size="sm"
                      class="ml-3"
                    />
                    <div>
                      <div class="text-muted-800 dark:text-white text-sm font-medium">
                        {{ session.expand?.user?.name || session.expand?.user?.email || 'کاربر ناشناس' }}
                      </div>
                      <div v-if="session.expand?.user?.email" class="text-muted-400 text-xs">
                        {{ session.expand.user.email }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Therapist -->
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <BaseAvatar
                      :src="session.expand?.therapist?.avatar ? `https://pocket.zehna.ir/api/files/therapists/${session.expand.therapist.id}/${session.expand.therapist.avatar}` : '/img/avatars/default-male.jpg'"
                      size="sm"
                      class="ml-3"
                    />
                    <div>
                      <div class="text-muted-800 dark:text-white text-sm font-medium">
                        {{ session.expand?.therapist?.name || 'مشاور ناشناس' }}
                      </div>
                      <div v-if="session.expand?.therapist?.specialty" class="text-muted-400 text-xs">
                        {{ session.expand.therapist.specialty }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Session Type -->
                <td class="px-4 py-3">
                  <BaseTag
                    :color="getSessionTypeInfo(session.session_type).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="flex items-center px-2 py-1">
                      <Icon :name="getSessionTypeInfo(session.session_type).icon" class="ml-1 size-3" />
                      {{ getSessionTypeInfo(session.session_type).text }}
                    </div>
                  </BaseTag>
                </td>

                <!-- Status -->
                <td class="px-4 py-3">
                  <BaseTag
                    :color="getStatusInfo(session.status).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="px-2 py-1">
                      {{ getStatusInfo(session.status).text }}
                    </div>
                  </BaseTag>
                </td>

                <!-- Duration -->
                <td class="px-4 py-3">
                  <span class="text-muted-700 dark:text-muted-300 text-sm">
                    {{ formatDuration(session.total_time_passed) }}
                  </span>
                </td>

                <!-- Messages -->
                <td class="px-4 py-3">
                  <span class="text-muted-700 dark:text-muted-300 text-sm">
                    {{ session.count_of_total_messages || '0' }}
                  </span>
                </td>

                <!-- Goals -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <BaseButton
                      color="primary"
                      shape="curved"
                      size="sm"
                      @click="viewSessionGoals(session)"
                    >
                      <Icon name="ph:target-duotone" class="size-4" />
                    </BaseButton>
                    <span 
                      v-if="sessionGoalsMap.get(session.id)"
                      class="text-muted-600 dark:text-muted-400 text-xs"
                    >
                      {{ sessionGoalsMap.get(session.id).length }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <BaseButton
                      v-if="session.status === 'done'"
                      color="info"
                      shape="curved"
                      size="sm"
                      @click="viewSessionAnalysis(session.session_analysis_for_system)"
                    >
                      <Icon name="ph:chart-line-duotone" class="size-4" />
                    </BaseButton>

                    <BaseButton
                      color="warning"
                      shape="curved"
                      size="sm"
                      @click="viewSessionHistory(session.id)"
                    >
                      <Icon name="ph:clock-counter-clockwise-duotone" class="size-4" />
                    </BaseButton>

                    <BaseButton
                      v-if="session.expand?.user?.id"
                      color="muted"
                      shape="curved"
                      size="sm"
                      @click="viewUserProfile(session.expand.user.id)"
                    >
                      <Icon name="ph:user-duotone" class="size-4" />
                    </BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="my-6">
          <BasePagination
            :total-items="totalItems"
            :item-per-page="perPage"
            :current-page="page"
            rounded="full"
            @update:current-page="handlePageChange"
          />
        </div>

        <!-- Page loading indicator -->
        <div v-if="pageLoading" class="flex items-center justify-center py-8">
          <div class="flex items-center gap-2">
            <div class="border-primary-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
            <span class="text-muted-600 dark:text-muted-400 text-sm">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>

  <!-- Session Goals Modal -->
  <TairoModal
    :open="showGoalsModal"
    size="xl"
    @close="closeGoalsModal"
  >
    <template #header>
      <div class="flex items-center gap-4 p-5 text-right">
        <div class="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-3 rounded-xl">
          <Icon name="ph:target-duotone" class="text-primary-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-xl font-bold">
            اهداف جلسه
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            مشاهده و بررسی اهداف تعریف شده برای جلسه
          </p>
        </div>
      </div>
    </template>

    <div class="px-6 py-4 max-h-[70vh] overflow-y-auto text-right">
      <!-- Session Info -->
      <div v-if="selectedSession" class="mb-6 bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-muted-800 dark:text-white">
              جلسه {{ selectedSession.expand?.user?.name || 'کاربر ناشناس' }}
            </h4>
            <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
              {{ new Date(selectedSession.created).toLocaleDateString('fa-IR') }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <BaseTag
              :color="selectedSession.status === 'done' ? 'success' : 'warning'"
              size="sm"
            >
              {{ selectedSession.status === 'done' ? 'تکمیل شده' : 'در حال انجام' }}
            </BaseTag>
            <BaseTag
              :color="selectedSession.session_type === 'therapic' ? 'info' : 'primary'"
              size="sm"
            >
              {{ selectedSession.session_type === 'therapic' ? 'درمانی' : 'آموزشی' }}
            </BaseTag>
          </div>
        </div>
      </div>

      <!-- Goals Loading -->
      <div v-if="goalsLoading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-muted-100 dark:bg-muted-800 rounded-lg p-4"
        >
          <div class="flex items-center gap-3 mb-3">
            <BasePlaceload class="h-6 w-6 rounded-full" />
            <BasePlaceload class="h-4 w-1/3 rounded" />
            <BasePlaceload class="h-4 w-16 rounded" />
          </div>
          <BasePlaceload class="h-3 w-full rounded mb-2" />
          <BasePlaceload class="h-3 w-3/4 rounded" />
        </div>
      </div>

      <!-- Goals List -->
      <div v-else-if="selectedSessionGoals.length > 0" class="space-y-4">
        <div
          v-for="goal in selectedSessionGoals"
          :key="goal.id"
          class="bg-white dark:bg-muted-800 rounded-lg border border-muted-200 dark:border-muted-700 p-4"
        >
          <!-- Goal Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h5 class="font-medium text-muted-800 dark:text-white text-lg mb-1">
                {{ goal.title }}
              </h5>
              <p class="text-muted-600 dark:text-muted-300 text-sm">
                {{ goal.description }}
              </p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <BaseTag
                :color="getGoalStatusColor(goal.status)"
                size="sm"
              >
                {{ getGoalStatusText(goal.status) }}
              </BaseTag>
              <BaseTag
                :color="getGoalPriorityColor(goal.priority)"
                size="sm"
              >
                {{ getGoalPriorityText(goal.priority) }}
              </BaseTag>
              <BaseTag
                :color="goal.goal_type === 'general' ? 'info' : 'primary'"
                size="sm"
              >
                {{ goal.goal_type === 'general' ? 'کلی' : 'خاص' }}
              </BaseTag>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-muted-700 dark:text-muted-300">پیشرفت</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {{ Math.round(goal.progress_percentage || 0) }}%
                </span>
                <span v-if="!goal.progress_percentage && !goal.ai_evaluation" class="text-xs text-muted-500 dark:text-muted-400">
                  (ارزیابی نشده)
                </span>
              </div>
            </div>
            <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-2">
              <div
                class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${Math.round(goal.progress_percentage || 0)}%` }"
              ></div>
            </div>
          </div>

          <!-- Goal Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Target Behaviors -->
            <div>
              <h6 class="font-medium text-muted-800 dark:text-white mb-2 flex items-center gap-2">
                <Icon name="ph:list-checks-duotone" class="text-success-500 size-4" />
                رفتارهای هدف
              </h6>
              <ul v-if="goal.target_behaviors && goal.target_behaviors.length > 0" class="space-y-1">
                <li
                  v-for="behavior in goal.target_behaviors"
                  :key="behavior"
                  class="flex items-start gap-2 text-sm text-muted-600 dark:text-muted-300"
                >
                  <Icon name="ph:check-duotone" class="text-success-500 size-3 mt-0.5 shrink-0" />
                  {{ behavior }}
                </li>
              </ul>
              <p v-else class="text-sm text-muted-500 dark:text-muted-400">
                رفتاری تعیین نشده
              </p>
            </div>

            <!-- Success Criteria -->
            <div>
              <h6 class="font-medium text-muted-800 dark:text-white mb-2 flex items-center gap-2">
                <Icon name="ph:trophy-duotone" class="text-warning-500 size-4" />
                معیارهای موفقیت
              </h6>
              <ul v-if="goal.success_criteria && goal.success_criteria.length > 0" class="space-y-1">
                <li
                  v-for="criteria in goal.success_criteria"
                  :key="criteria"
                  class="flex items-start gap-2 text-sm text-muted-600 dark:text-muted-300"
                >
                  <Icon name="ph:star-duotone" class="text-warning-500 size-3 mt-0.5 shrink-0" />
                  {{ criteria }}
                </li>
              </ul>
              <p v-else class="text-sm text-muted-500 dark:text-muted-400">
                معیاری تعیین نشده
              </p>
            </div>
          </div>

          <!-- AI Evaluation -->
          <div v-if="goal.ai_evaluation" class="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <h6 class="font-medium text-muted-800 dark:text-white mb-2 flex items-center gap-2">
              <Icon name="ph:brain-duotone" class="text-blue-500 size-4" />
              ارزیابی هوشمند
            </h6>
            <p class="text-sm text-muted-700 dark:text-muted-300">
              {{ goal.ai_evaluation }}
            </p>
          </div>

          <!-- Timestamps -->
          <div class="mt-4 flex items-center justify-between text-xs text-muted-500 dark:text-muted-400">
            <span>ایجاد: {{ new Date(goal.created).toLocaleDateString('fa-IR') }}</span>
            <span v-if="goal.updated">
              آخرین بروزرسانی: {{ new Date(goal.updated).toLocaleDateString('fa-IR') }}
            </span>
          </div>
        </div>
      </div>

      <!-- No Goals -->
      <div v-else class="text-center py-8">
        <Icon name="ph:target-duotone" class="text-muted-400 size-16 mx-auto mb-4" />
        <h4 class="font-medium text-muted-800 dark:text-white mb-2">
          اهدافی برای این جلسه تعیین نشده
        </h4>
        <p class="text-muted-500 dark:text-muted-400 text-sm">
          هیچ هدف درمانی برای این جلسه ثبت نشده است
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-6 bg-muted-50 dark:bg-muted-800 border-t border-muted-200 dark:border-muted-700 w-full">
        <div class="flex justify-end">
          <BaseButton
            type="button"
            color="muted"
            size="lg"
            @click="closeGoalsModal"
          >
            بستن
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>

<style scoped>
table {
  border-collapse: collapse;
}

th, td {
  vertical-align: top;
}

.hover\:bg-muted-50:hover {
  background-color: rgb(248 250 252);
}

.dark .hover\:bg-muted-900\/50:hover {
  background-color: rgb(23 23 23 / 0.5);
}
</style>