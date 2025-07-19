<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SessionAnalysis } from '~/composables/useSessionAnalysis'

// Define types
interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  created: string
  updated?: string
  emailVisibility?: boolean
  verified?: boolean
  role?: string
  lastLogin?: string
  username?: string
  collectionId?: string
  collectionName?: string
  expand?: any
  // Nested meta structure
  meta?: {
    name?: string
    email?: string
    phone?: string
    age?: number
    gender?: string
    location?: string
    occupation?: string
    education?: string
    maritalStatus?: string
    emergencyContact?: string
    medicalHistory?: string
    notes?: string
  }
  // Additional user fields (direct)
  age?: number
  gender?: string
  location?: string
  occupation?: string
  education?: string
  maritalStatus?: string
  emergencyContact?: string
  medicalHistory?: string
  notes?: string
  isActive?: boolean
  suspendedUntil?: string
  lastActivity?: string
  totalSessions?: number
  activeSessions?: number
  completedSessions?: number
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
    therapist?: {
      id: string
      name: string
      specialty?: string
      avatar?: string
    }
    session_analysis_for_system?: SessionAnalysis
  }
}

definePageMeta({
  title: 'جزئیات کاربر',
  layout: 'sidebar',
  middleware: 'admin'
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id as string)

const user = ref<User | null>(null)
const userSessions = ref<SessionWithExpanded[]>([])
const loading = ref(false)
const sessionsLoading = ref(false)
const error = ref('')
const toaster = useToaster()
const { role } = useUser()

const isAdmin = computed(() => role.value === 'admin')

const { getSessionsByUserId } = useSessions()

// Check admin access
const checkAdminAccess = () => {
  if (!isAdmin.value) {
    navigateTo('/dashboard')
    return false
  }
  return true
}

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

// Format short date
const formatShortDate = (dateString: string | undefined): string => {
  if (!dateString) return 'نامشخص'
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

// Get user avatar URL
const getUserAvatarUrl = (user: User) => {
  if (user.avatar) {
    return `https://pocket.zehna.ir/api/files/users/${user.id}/${user.avatar}`
  }
  return '/img/avatars/default-male.jpg'
}

// Get user role display
const getUserRoleDisplay = (role: string | undefined) => {
  switch (role) {
    case 'admin':
      return { text: 'مدیر', color: 'danger' as const }
    case 'user':
      return { text: 'کاربر', color: 'success' as const }
    case 'therapist':
      return { text: 'مشاور', color: 'info' as const }
    default:
      return { text: 'نامشخص', color: 'muted' as const }
  }
}

// Get user status display
const getUserStatusDisplay = (user: User) => {
  if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
    return { text: 'تعلیق شده', color: 'warning' as const, icon: 'ph:warning-duotone' }
  }
  if (user.isActive === false) {
    return { text: 'غیرفعال', color: 'danger' as const, icon: 'ph:x-circle-duotone' }
  }
  return { text: 'فعال', color: 'success' as const, icon: 'ph:check-circle-duotone' }
}

// Get verification status display
const getVerificationDisplay = (verified: boolean | undefined) => {
  if (verified) {
    return { text: 'تایید شده', color: 'success' as const, icon: 'ph:check-circle-duotone' }
  }
  return { text: 'تایید نشده', color: 'warning' as const, icon: 'ph:clock-duotone' }
}

// Get gender display
const getGenderDisplay = (gender: string | undefined) => {
  switch (gender) {
    case 'male':
      return { text: 'مرد', icon: 'ph:person-duotone' }
    case 'female':
      return { text: 'زن', icon: 'ph:person-duotone' }
    default:
      return { text: 'نامشخص', icon: 'ph:question-duotone' }
  }
}

// Get marital status display
const getMaritalStatusDisplay = (status: string | undefined) => {
  switch (status) {
    case 'single':
      return { text: 'مجرد', icon: 'ph:user-duotone' }
    case 'married':
      return { text: 'متاهل', icon: 'ph:users-duotone' }
    case 'divorced':
      return { text: 'مطلقه', icon: 'ph:user-minus-duotone' }
    case 'widowed':
      return { text: 'بیوه', icon: 'ph:user-minus-duotone' }
    default:
      return { text: 'نامشخص', icon: 'ph:question-duotone' }
  }
}

// Format last activity
const formatLastActivity = (dateString: string | undefined): string => {
  if (!dateString) return 'نامشخص'
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'اکنون'
  } else if (diffInHours < 24) {
    return `${diffInHours} ساعت پیش`
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24)
    return `${days} روز پیش`
  } else {
    return formatShortDate(dateString)
  }
}

// Fetch user details
const fetchUser = async () => {
  loading.value = true
  error.value = ''

  if (!checkAdminAccess()) {
    loading.value = false
    return
  }

  try {
    const nuxtApp = useNuxtApp()
    const pb = nuxtApp.$pb
    
    const userRecord = await pb.collection('users').getOne(userId.value)
    
    console.log('Raw user record:', userRecord)
    
    user.value = {
      id: userRecord.id,
      name: userRecord.meta?.name || userRecord.name || userRecord.username || userRecord.email || 'کاربر ناشناس',
      email: userRecord.meta?.email || userRecord.email || '',
      phone: userRecord.meta?.phone || userRecord.phone || '',
      avatar: userRecord.avatar || '',
      created: userRecord.created,
      updated: userRecord.updated,
      emailVisibility: userRecord.emailVisibility || false,
      verified: userRecord.verified || false,
      role: userRecord.role || 'user',
      lastLogin: userRecord.lastLogin || '',
      username: userRecord.username || '',
      collectionId: userRecord.collectionId || '',
      collectionName: userRecord.collectionName || '',
      // Store meta object
      meta: userRecord.meta || {},
      // Additional fields - check both meta and direct fields
      age: userRecord.meta?.age || userRecord.age || null,
      gender: userRecord.meta?.gender || userRecord.gender || '',
      location: userRecord.meta?.location || userRecord.location || '',
      occupation: userRecord.meta?.occupation || userRecord.occupation || '',
      education: userRecord.meta?.education || userRecord.education || '',
      maritalStatus: userRecord.meta?.maritalStatus || userRecord.maritalStatus || '',
      emergencyContact: userRecord.meta?.emergencyContact || userRecord.emergencyContact || '',
      medicalHistory: userRecord.meta?.medicalHistory || userRecord.medicalHistory || '',
      notes: userRecord.meta?.notes || userRecord.notes || '',
      isActive: userRecord.isActive !== false, // Default to true
      suspendedUntil: userRecord.suspendedUntil || '',
      lastActivity: userRecord.lastActivity || userRecord.updated || userRecord.created,
      expand: userRecord.expand || {}
    }

    console.log('User loaded:', user.value)
  }
  catch (error) {
    console.error('Error fetching user:', error)
    error.value = 'خطا در دریافت اطلاعات کاربر'
    toaster.show({
      title: 'خطا',
      message: 'کاربر مورد نظر پیدا نشد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    loading.value = false
  }
}

// Fetch user sessions
const fetchUserSessions = async () => {
  sessionsLoading.value = true

  try {
    // Use the new getSessionsByUserId function
    const sessions = await getSessionsByUserId(userId.value)
    
    // Sort by attendance date (newest first)
    const sortedSessions = sessions.sort((a, b) => {
      const dateA = new Date(a.attend_date || a.created).getTime()
      const dateB = new Date(b.attend_date || b.created).getTime()
      return dateB - dateA
    })

    userSessions.value = sortedSessions as unknown as SessionWithExpanded[]

    console.log('User sessions loaded:', userSessions.value)
  }
  catch (error) {
    console.error('Error fetching user sessions:', error)
    userSessions.value = []
  }
  finally {
    sessionsLoading.value = false
  }
}

// Navigate to session analysis
const viewSessionAnalysis = (sessionId: string) => {
  navigateTo(`/darmana/therapists/analysis?analysis_id=${sessionId}`)
}

// Navigate to session history
const viewSessionHistory = (sessionId: string) => {
  navigateTo(`/darmana/therapists/history?sessionId=${sessionId}`)
}

// Navigate back to admin sessions
const goBackToSessions = () => {
  navigateTo('/admin/sessions')
}

// Computed session stats
const sessionStats = computed(() => {
  const stats = {
    total: userSessions.value.length,
    inProgress: userSessions.value.filter(s => s.status === 'inprogress').length,
    completed: userSessions.value.filter(s => s.status === 'done').length,
    closed: userSessions.value.filter(s => s.status === 'closed').length,
    educational: userSessions.value.filter(s => s.session_type === 'educational').length,
    therapic: userSessions.value.filter(s => s.session_type === 'therapic').length,
    totalTime: userSessions.value.reduce((sum, s) => sum + (s.total_time_passed || 0), 0),
    totalMessages: userSessions.value.reduce((sum, s) => sum + (s.count_of_total_messages || 0), 0)
  }
  return stats
})

// Fetch data on component mount
onMounted(() => {
  fetchUser()
  fetchUserSessions()
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <BaseButton
            color="muted"
            shape="curved"
            size="sm"
            class="ml-4"
            @click="goBackToSessions"
          >
            <Icon name="ph:arrow-right-duotone" class="ml-1 size-4" />
            بازگشت
          </BaseButton>
          <Icon name="ph:user-circle-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            جزئیات کاربر
          </BaseHeading>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="border-primary-500 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <span class="text-muted-600 dark:text-muted-400 mt-4 text-sm">در حال بارگذاری...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-10">
        <BasePlaceholderPage
          title="خطا در بارگذاری"
          :subtitle="error"
        >
          <template #image>
            <div class="flex items-center justify-center">
              <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-24" />
            </div>
          </template>
          <template #action>
            <BaseButton
              color="primary"
              shape="curved"
              @click="fetchUser"
            >
              تلاش مجدد
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- User Details -->
      <div v-else-if="user" class="space-y-6">
        <!-- User Profile Card -->
        <BaseCard shape="curved" class="p-6">
          <div class="flex flex-col items-center md:flex-row md:items-start">
            <!-- Avatar -->
            <div class="mb-4 flex-shrink-0 md:mb-0 md:ml-6">
              <BaseAvatar
                :src="getUserAvatarUrl(user)"
                size="2xl"
                class="border-4 border-white shadow-lg dark:border-gray-800"
              />
            </div>

            <!-- User Info -->
            <div class="flex-1 text-center md:text-right">
              <div class="mb-3 flex flex-col items-center md:flex-row md:items-center">
                <BaseHeading
                  tag="h3"
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white ml-3"
                >
                  {{ user.name }}
                </BaseHeading>
                <div class="flex items-center gap-2">
                  <BaseTag
                    :color="getUserRoleDisplay(user.role).color"
                    shape="curved"
                    size="sm"
                  >
                    {{ getUserRoleDisplay(user.role).text }}
                  </BaseTag>
                  <BaseTag
                    :color="getUserStatusDisplay(user).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="flex items-center px-2 py-1">
                      <Icon :name="getUserStatusDisplay(user).icon" class="ml-1 size-3" />
                      {{ getUserStatusDisplay(user).text }}
                    </div>
                  </BaseTag>
                  <BaseTag
                    :color="getVerificationDisplay(user.verified).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="flex items-center px-2 py-1">
                      <Icon :name="getVerificationDisplay(user.verified).icon" class="ml-1 size-3" />
                      {{ getVerificationDisplay(user.verified).text }}
                    </div>
                  </BaseTag>
                </div>
              </div>

              <!-- Primary Information -->
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:envelope-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">{{ user.email }}</span>
                </div>
                <div v-if="user.phone" class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:phone-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">{{ user.phone }}</span>
                </div>
                <div v-if="user.username" class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:user-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">{{ user.username }}</span>
                </div>
                <div class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:calendar-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">عضویت: {{ formatShortDate(user.created) }}</span>
                </div>
                <div class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:clock-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">آخرین فعالیت: {{ formatLastActivity(user.lastActivity) }}</span>
                </div>
                <div v-if="user.location" class="flex items-center justify-center md:justify-start">
                  <Icon name="ph:map-pin-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">{{ user.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Additional User Information -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Personal Information -->
          <BaseCard shape="curved" class="p-6">
            <BaseHeading
              tag="h4"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white mb-4"
            >
              اطلاعات شخصی
            </BaseHeading>
            <div class="space-y-4">
              <!-- Always show name -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:user-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">نام:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.name }}</span>
              </div>
              
              <!-- Always show email -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:envelope-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">ایمیل:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.email || 'ثبت نشده' }}</span>
              </div>

              <!-- Show phone if available -->
              <div v-if="user.phone" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:phone-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">تلفن:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.phone }}</span>
              </div>

              <!-- Show username if available -->
              <div v-if="user.username" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:at-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">نام کاربری:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.username }}</span>
              </div>

              <div v-if="user.age" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:calendar-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">سن:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.age }} سال</span>
              </div>
              <div v-if="user.gender" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon :name="getGenderDisplay(user.gender).icon" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">جنسیت:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ getGenderDisplay(user.gender).text }}</span>
              </div>
              <div v-if="user.maritalStatus" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon :name="getMaritalStatusDisplay(user.maritalStatus).icon" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">وضعیت تاهل:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ getMaritalStatusDisplay(user.maritalStatus).text }}</span>
              </div>
              <div v-if="user.occupation" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:briefcase-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">شغل:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.occupation }}</span>
              </div>
              <div v-if="user.education" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:graduation-cap-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">تحصیلات:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.education }}</span>
              </div>
              <div v-if="user.emergencyContact" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:phone-call-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">تماس اضطراری:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ user.emergencyContact }}</span>
              </div>
            </div>
          </BaseCard>

          <!-- System Information -->
          <BaseCard shape="curved" class="p-6">
            <BaseHeading
              tag="h4"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white mb-4"
            >
              اطلاعات سیستم
            </BaseHeading>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:fingerprint-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">شناسه کاربر:</span>
                </div>
                <span class="text-muted-800 dark:text-white font-mono text-sm">{{ user.id.slice(-8) }}</span>
              </div>
              <div v-if="user.lastLogin" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:sign-in-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">آخرین ورود:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ formatShortDate(user.lastLogin) }}</span>
              </div>
              <div v-if="user.updated" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:pencil-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">آخرین بروزرسانی:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ formatShortDate(user.updated) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:eye-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">نمایش ایمیل:</span>
                </div>
                <BaseTag
                  :color="user.emailVisibility ? 'success' : 'muted'"
                  shape="curved"
                  size="sm"
                >
                  {{ user.emailVisibility ? 'فعال' : 'غیرفعال' }}
                </BaseTag>
              </div>
              <div v-if="user.suspendedUntil" class="flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="ph:warning-duotone" class="text-muted-400 ml-2 size-4" />
                  <span class="text-muted-600 dark:text-muted-400 text-sm">تعلیق تا:</span>
                </div>
                <span class="text-muted-800 dark:text-white text-sm font-medium">{{ formatShortDate(user.suspendedUntil) }}</span>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Medical & Notes Information -->
        <div v-if="user.medicalHistory || user.notes" class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Medical History -->
          <BaseCard v-if="user.medicalHistory" shape="curved" class="p-6">
            <BaseHeading
              tag="h4"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white mb-4"
            >
              سابقه پزشکی
            </BaseHeading>
            <div class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
              <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                {{ user.medicalHistory }}
              </BaseParagraph>
            </div>
          </BaseCard>

          <!-- Admin Notes -->
          <BaseCard v-if="user.notes" shape="curved" class="p-6">
            <BaseHeading
              tag="h4"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white mb-4"
            >
              یادداشت‌های مدیریت
            </BaseHeading>
            <div class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
              <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                {{ user.notes }}
              </BaseParagraph>
            </div>
          </BaseCard>
        </div>

        <!-- Session Statistics -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <BaseCard shape="curved" class="p-4">
            <div class="flex items-center">
              <div class="bg-primary-100 dark:bg-primary-500/20 ml-3 rounded-full p-3">
                <Icon name="ph:chat-circle-dots-duotone" class="text-primary-500 size-5" />
              </div>
              <div>
                <div class="text-muted-400 text-xs">کل جلسات</div>
                <div class="text-muted-800 dark:text-white text-lg font-semibold">{{ sessionStats.total }}</div>
              </div>
            </div>
          </BaseCard>

          <BaseCard shape="curved" class="p-4">
            <div class="flex items-center">
              <div class="bg-success-100 dark:bg-success-500/20 ml-3 rounded-full p-3">
                <Icon name="ph:check-circle-duotone" class="text-success-500 size-5" />
              </div>
              <div>
                <div class="text-muted-400 text-xs">تکمیل شده</div>
                <div class="text-muted-800 dark:text-white text-lg font-semibold">{{ sessionStats.completed }}</div>
              </div>
            </div>
          </BaseCard>

          <BaseCard shape="curved" class="p-4">
            <div class="flex items-center">
              <div class="bg-warning-100 dark:bg-warning-500/20 ml-3 rounded-full p-3">
                <Icon name="ph:clock-duotone" class="text-warning-500 size-5" />
              </div>
              <div>
                <div class="text-muted-400 text-xs">کل زمان</div>
                <div class="text-muted-800 dark:text-white text-lg font-semibold">{{ formatDuration(sessionStats.totalTime) }}</div>
              </div>
            </div>
          </BaseCard>

          <BaseCard shape="curved" class="p-4">
            <div class="flex items-center">
              <div class="bg-info-100 dark:bg-info-500/20 ml-3 rounded-full p-3">
                <Icon name="ph:chat-dots-duotone" class="text-info-500 size-5" />
              </div>
              <div>
                <div class="text-muted-400 text-xs">کل پیام‌ها</div>
                <div class="text-muted-800 dark:text-white text-lg font-semibold">{{ sessionStats.totalMessages }}</div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- User Sessions -->
        <BaseCard shape="curved" class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              tag="h4"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white"
            >
              جلسات کاربر
            </BaseHeading>
            <BaseTag
              color="primary"
              shape="curved"
              size="sm"
            >
              {{ sessionStats.total }} جلسه
            </BaseTag>
          </div>

          <!-- Sessions Loading -->
          <div v-if="sessionsLoading" class="flex items-center justify-center py-8">
            <div class="border-primary-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
            <span class="text-muted-600 dark:text-muted-400 mr-2 text-sm">در حال بارگذاری جلسات...</span>
          </div>

          <!-- No Sessions -->
          <div v-else-if="userSessions.length === 0" class="py-8 text-center">
            <Icon name="ph:chat-circle-duotone" class="text-muted-400 mx-auto mb-4 size-12" />
            <BaseParagraph class="text-muted-500">
              این کاربر هیچ جلسه‌ای ندارد
            </BaseParagraph>
          </div>

          <!-- Sessions List -->
          <div v-else class="space-y-4">
            <div
              v-for="session in userSessions"
              :key="session.id"
              class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-900/50 rounded-lg border p-4 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <BaseAvatar
                    :src="session.expand?.therapist?.avatar ? `https://pocket.zehna.ir/api/files/therapists/${session.expand.therapist.id}/${session.expand.therapist.avatar}` : '/img/avatars/default-male.jpg'"
                    size="md"
                    class="ml-3"
                  />
                  <div>
                    <div class="flex items-center">
                      <BaseTag
                        :color="getSessionTypeInfo(session.session_type).color"
                        shape="curved"
                        size="sm"
                        class="ml-2"
                      >
                        <div class="flex items-center px-2 py-1">
                          <Icon :name="getSessionTypeInfo(session.session_type).icon" class="ml-1 size-3" />
                          {{ getSessionTypeInfo(session.session_type).text }}
                        </div>
                      </BaseTag>
                      <span class="text-muted-800 dark:text-white text-sm font-medium">
                        {{ session.expand?.therapist?.name || 'مشاور ناشناس' }}
                      </span>
                    </div>
                    <div class="text-muted-400 mt-1 text-xs">
                      {{ formatDate(session.attend_date || session.created) }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <BaseTag
                    :color="getStatusInfo(session.status).color"
                    shape="curved"
                    size="sm"
                  >
                    {{ getStatusInfo(session.status).text }}
                  </BaseTag>

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
                </div>
              </div>

              <div class="mt-3 grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-muted-400 text-xs">مدت</div>
                  <div class="text-muted-700 dark:text-muted-300 text-sm">{{ formatDuration(session.total_time_passed) }}</div>
                </div>
                <div class="text-center">
                  <div class="text-muted-400 text-xs">پیام‌ها</div>
                  <div class="text-muted-700 dark:text-muted-300 text-sm">{{ session.count_of_total_messages || 0 }}</div>
                </div>
                <div class="text-center">
                  <div class="text-muted-400 text-xs">شناسه</div>
                  <div class="text-muted-700 dark:text-muted-300 font-mono text-sm">{{ session.id.slice(-8) }}</div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </TairoContentWrapper>
  </div>
</template>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease;
}

.hover\:bg-muted-50:hover {
  background-color: rgb(248 250 252);
}

.dark .hover\:bg-muted-900\/50:hover {
  background-color: rgb(23 23 23 / 0.5);
}
</style>