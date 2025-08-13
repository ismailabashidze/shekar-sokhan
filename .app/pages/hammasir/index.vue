<script setup lang="ts">
// Profile Overview Page - Main entry point for Hammasir module
import { useApplicantProfileService } from '~/composables/hammasir/useApplicantProfileService'
import { useProfileAnalytics } from '~/composables/hammasir/useProfileAnalytics'
import { useProfileForm } from '~/composables/hammasir/useProfileForm'

definePageMeta({
  title: 'پروفایل شخصی - هم مسیر',
  description: 'مشاهده و مدیریت پروفایل شخصی در پلتفرم همسر',
  layout: 'sidebar'
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Composables
const { getMyProfile } = useApplicantProfileService()
const { profile, loading: profileLoading, error: profileError, refresh: refreshProfile } = getMyProfile()
const { state: analyticsState, loadAnalytics } = useProfileAnalytics()
const { state: formState } = useProfileForm(profile.value)

// Mock profile data for testing
const mockProfile = ref(null)

// Generate mock data based on test mode
const generateMockProfile = (testMode: string) => {
  const baseProfile = {
    personalInfo: {
      firstName: 'علی',
      lastName: 'احمدی',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: ''
    },
    demographics: {
      education: [],
      occupation: [],
      location: []
    },
    preferences: {
      communication: {
        email: false,
        sms: false
      }
    },
    privacySettings: {
      isProfileVisibleToCounselors: false,
      isProfileVisibleToOtherUsers: false,
      allowDataAnalysisForMatching: false
    },
    status: 'PENDING_VERIFICATION',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }

  switch (testMode) {
    case 'fresh-start':
      return baseProfile

    case 'partially-1':
      return {
        ...baseProfile,
        personalInfo: {
          ...baseProfile.personalInfo,
          email: 'ali@example.com',
          phoneNumber: '09123456789'
        }
      }

    case 'partially-2':
      return {
        ...baseProfile,
        personalInfo: {
          ...baseProfile.personalInfo,
          email: 'ali@example.com',
          phoneNumber: '09123456789',
          dateOfBirth: '1990-05-15',
          gender: 'MALE'
        },
        demographics: {
          ...baseProfile.demographics,
          education: [{
            id: '1',
            institutionName: 'دانشگاه تهران',
            degree: 'کارشناسی ارشد',
            fieldOfStudy: 'مهندسی کامپیوتر',
            educationLevel: 'MASTER',
            startDate: '01-09-2010',
            endDate: '30-06-2012',
            isCurrent: false,
            isGraduated: true
          }]
        },
        preferences: {
          communication: {
            email: true,
            sms: false
          }
        }
      }

    case 'mostly-done':
      return {
        ...baseProfile,
        personalInfo: {
          ...baseProfile.personalInfo,
          email: 'ali@example.com',
          phoneNumber: '09123456789',
          dateOfBirth: '1990-05-15',
          gender: 'MALE'
        },
        demographics: {
          education: [{
            id: '1',
            institutionName: 'دانشگاه تهران',
            degree: 'کارشناسی ارشد',
            fieldOfStudy: 'مهندسی کامپیوتر',
            educationLevel: 'MASTER',
            startDate: '01-09-2010',
            endDate: '30-06-2012',
            isCurrent: false,
            isGraduated: true
          }],
          occupation: [{
            id: '1',
            currentPosition: 'توسعه‌دهنده نرم‌افزار',
            companyName: 'شرکت فناوری پارس',
            industry: 'فناوری اطلاعات',
            employmentType: 'FULL_TIME',
            startDate: '01-01-2020',
            isCurrentJob: true
          }],
          location: [{
            id: '1',
            city: 'تهران',
            state: 'تهران',
            country: 'ایران',
            isCurrent: true
          }]
        },
        preferences: {
          communication: {
            email: true,
            sms: false
          }
        },
        privacySettings: {
          isProfileVisibleToCounselors: true,
          isProfileVisibleToOtherUsers: false,
          allowDataAnalysisForMatching: true
        },
        status: 'UNDER_REVIEW'
      }

    case 'done':
      return {
        ...baseProfile,
        personalInfo: {
          ...baseProfile.personalInfo,
          email: 'ali@example.com',
          phoneNumber: '09123456789',
          dateOfBirth: '1990-05-15',
          gender: 'MALE',
          profilePicture: '/avatar-placeholder.jpg'
        },
        demographics: {
          education: [{
            id: '1',
            institutionName: 'دانشگاه تهران',
            degree: 'کارشناسی ارشد',
            fieldOfStudy: 'مهندسی کامپیوتر',
            educationLevel: 'MASTER',
            startDate: '01-09-2010',
            endDate: '30-06-2012',
            isCurrent: false,
            isGraduated: true
          }],
          occupation: [{
            id: '1',
            currentPosition: 'توسعه‌دهنده نرم‌افزار',
            companyName: 'شرکت فناوری پارس',
            industry: 'فناوری اطلاعات',
            employmentType: 'FULL_TIME',
            startDate: '01-01-2020',
            isCurrentJob: true
          }],
          location: [{
            id: '1',
            city: 'تهران',
            state: 'تهران',
            country: 'ایران',
            isCurrent: true
          }]
        },
        preferences: {
          communication: {
            email: true,
            sms: true
          }
        },
        privacySettings: {
          isProfileVisibleToCounselors: true,
          isProfileVisibleToOtherUsers: true,
          allowDataAnalysisForMatching: true
        },
        status: 'VERIFIED',
        updatedAt: '2024-08-13T12:00:00Z'
      }

    default:
      return baseProfile
  }
}

// Reactive state
const viewMode = ref<'overview' | 'sections' | 'progress'>('overview')
const sectionLayout = ref<'accordion' | 'tabs' | 'grid'>('accordion')
const refreshing = ref(false)

// Test data dropdown
const testDataMode = ref<'fresh-start' | 'partially-1' | 'partially-2' | 'mostly-done' | 'done'>('partially-1')

// Load analytics data
onMounted(async () => {
  console.log('Page mounted, profile:', profile.value ? 'available' : 'missing')
  // Initialize with mock data
  mockProfile.value = generateMockProfile(testDataMode.value)
  console.log('Loading analytics...')
  await loadAnalytics(testDataMode.value)
  console.log('Analytics loaded:', analyticsState.completionStatus ? 'success' : 'failed')
})

// Watch test data mode changes
watch(testDataMode, async (newMode) => {
  console.log('Test data mode changed to:', newMode)
  // Update mock profile data
  mockProfile.value = generateMockProfile(newMode)
  await loadAnalytics(newMode)
})

// Computed profile that uses mock data in test mode
const currentProfile = computed(() => {
  return mockProfile.value || profile.value
})

// Handle refresh
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await Promise.all([
      refreshProfile(),
      loadAnalytics(testDataMode.value)
    ])
  } finally {
    refreshing.value = false
  }
}

// Navigation handlers
const navigateToEdit = (section?: string) => {
  if (section) {
    navigateTo(`/hammasir/edit/${section}`)
  } else {
    navigateTo('/hammasir/edit')
  }
}

const navigateToAnalytics = () => {
  navigateTo('/hammasir/analytics')
}

const navigateToHandbook = () => {
  navigateTo('/hammasir/handbook')
}

const navigateToMatching = () => {
  navigateTo('/matching')
}

// Action handlers
const handleProfileAction = (action: string, data?: any) => {
  switch (action) {
    case 'edit':
      navigateToEdit()
      break
    case 'analytics':
      navigateToAnalytics()
      break
    case 'handbook':
      navigateToHandbook()
      break
    case 'matching':
      navigateToMatching()
      break
    case 'export':
      handleExport(data || 'pdf')
      break
    case 'share':
      handleShare()
      break
    case 'print':
      handlePrint()
      break
    case 'refresh':
      handleRefresh()
      break
  }
}

// Export functionality
const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
  try {
    // Implementation would depend on your export service
    console.log(`Exporting profile as ${format}`)
    
    // Example implementation:
    // const exportData = await useApplicantProfileService().exportProfile(format)
    // downloadFile(exportData, `profile.${format}`)
    
    $toast.success(`پروفایل با موفقیت در قالب ${format} دانلود شد`)
  } catch (error) {
    $toast.error('خطا در دانلود فایل')
    console.error('Export error:', error)
  }
}

// Share functionality
const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'پروفایل شخصی',
        text: 'مشاهده پروفایل من در پلتفرم همسر',
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      $toast.success('لینک پروفایل کپی شد')
    }
  } catch (error) {
    console.error('Share error:', error)
    $toast.error('خطا در اشتراک‌گذاری')
  }
}

// Print functionality
const handlePrint = () => {
  window.print()
}

// Error handling
const handleError = (error: any) => {
  console.error('Profile error:', error)
  $toast.error('خطا در بارگذاری پروفایل')
}

// Watch for profile changes
watch(profile, async (newProfile) => {
  console.log('Profile changed:', newProfile ? 'available' : 'missing')
  if (newProfile) {
    console.log('Loading analytics from watcher...')
    await loadAnalytics(testDataMode.value)
    console.log('Analytics loaded from watcher:', analyticsState.completionStatus ? 'success' : 'failed')
  }
})

// SEO and meta
useHead({
  title: 'پروفایل شخصی - همسر',
  meta: [
    { name: 'description', content: 'مشاهده و مدیریت پروفایل شخصی در پلتفرم همسر' },
    { name: 'keywords', content: 'پروفایل، همسر، ازدواج، انطباق‌یابی' },
    { property: 'og:title', content: 'پروفایل شخصی - همسر' },
    { property: 'og:description', content: 'مشاهده و مدیریت پروفایل شخصی در پلتفرم همسر' },
    { property: 'og:type', content: 'profile' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
    <!-- Loading State -->
    <div v-if="profileLoading" class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header Skeleton -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div class="animate-pulse">
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 rounded-3xl shadow-lg"></div>
                <div class="space-y-3">
                  <div class="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-48"></div>
                  <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-32"></div>
                  <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-40"></div>
                </div>
              </div>
              <div class="w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 rounded-3xl shadow-lg"></div>
            </div>
          </div>
        </div>

        <!-- Content Skeletons -->
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div v-for="i in 3" :key="i" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="animate-pulse">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 rounded-2xl shadow-md"></div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-32"></div>
                      <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-48"></div>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                  <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div v-for="i in 2" :key="i" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div class="animate-pulse space-y-4">
                <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-24"></div>
                <div class="space-y-3">
                  <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                  <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="profileError" class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto text-center">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-4">
          خطا در بارگذاری پروفایل
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
          متأسفانه در بارگذاری اطلاعات پروفایل مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
        </BaseParagraph>
        <div class="flex justify-center gap-4">
          <BaseButton variant="solid" @click="handleRefresh">
            <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
            تلاش مجدد
          </BaseButton>
          <BaseButton variant="outline" @click="navigateTo('/')">
            بازگشت به خانه
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="currentProfile" class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <!-- Profile Header -->
        <HammasirProfileProfileHeader
          :profile="currentProfile"
          :completion-status="analyticsState.completionStatus"
          variant="hero"
          :loading="refreshing"
          @edit="navigateToEdit()"
          @share="handleShare"
          @download="handleExport('pdf')"
          @settings="navigateTo('/hammasir/settings')"
        />

        <!-- View Mode Selector -->
        <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white">
                اطلاعات پروفایل
              </BaseHeading>
              
              <!-- View Toggle -->
              <div class="flex bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-1.5 shadow-inner">
                <button
                  :class="`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                    viewMode === 'overview' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`"
                  @click="viewMode = 'overview'"
                >
                  <Icon name="ph:house" class="w-4 h-4 me-2" />
                  کلی
                </button>
                <button
                  :class="`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                    viewMode === 'sections' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`"
                  @click="viewMode = 'sections'"
                >
                  <Icon name="ph:squares-four" class="w-4 h-4 me-2" />
                  بخش‌ها
                </button>
                <button
                  :class="`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                    viewMode === 'progress' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`"
                  @click="viewMode = 'progress'"
                >
                  <Icon name="ph:chart-line" class="w-4 h-4 me-2" />
                  پیشرفت
                </button>
              </div>
            </div>

            <!-- Layout Selector (for sections view) -->
            <div v-if="viewMode === 'sections'" class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">نمایش:</span>
              <select
                v-model="sectionLayout"
                class="text-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl px-4 py-2 shadow-inner focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[140px]"
              >
                <option value="accordion">📑 آکاردئون</option>
                <option value="tabs">🗂️ تب‌ها</option>
                <option value="grid">🏗️ شبکه</option>
              </select>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-3">
              <!-- Test Data Dropdown -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">آزمایش داده:</span>
                <select
                  v-model="testDataMode"
                  class="text-sm border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl px-4 py-2 shadow-inner focus:ring-2 focus:ring-yellow-500 transition-all duration-200 min-w-[160px] border border-yellow-200/50 dark:border-yellow-700/50"
                >
                  <option value="fresh-start">🆕 شروع جدید</option>
                  <option value="partially-1">📝 نیمه‌کامل ۱</option>
                  <option value="partially-2">📋 نیمه‌کامل ۲</option>
                  <option value="mostly-done">✅ تقریباً تمام</option>
                  <option value="done">🎉 کامل</option>
                </select>
              </div>
              
              <BaseButton
                variant="outline"
                size="sm"
                :loading="refreshing"
                class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
                @click="handleRefresh"
              >
                <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
                بروزرسانی
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6 animate-slide-in-left">
            <!-- Overview Mode -->
            <div v-if="viewMode === 'overview'">
              <HammasirDisplayProfileDisplay
                :profile="currentProfile"
                :show-actions="true"
                :show-progress="true"
                @edit="navigateToEdit"
                @export="handleExport"
                @share="handleShare"
              />
            </div>

            <!-- Sections Mode -->
            <div v-else-if="viewMode === 'sections'">
              <!-- Debug info -->
              <div v-if="false" class="mb-4 p-4 bg-yellow-100 rounded">
                <div>Profile: {{ currentProfile ? 'Available' : 'Missing' }}</div>
                <div>Completion Status: {{ analyticsState.completionStatus ? 'Available' : 'Missing' }}</div>
                <div>Analytics State: {{ analyticsState ? 'Available' : 'Missing' }}</div>
              </div>
              
              <HammasirProfileProfileSections
                v-if="currentProfile"
                :profile="currentProfile"
                :completion-status="analyticsState.completionStatus"
                :layout="sectionLayout"
                :show-progress="true"
                :show-actions="true"
                @edit-section="navigateToEdit"
                @section-expand="(sectionId) => console.log('Expanded:', sectionId)"
              />
              
              <div v-else class="text-center py-8">
                <div class="text-gray-500">پروفایل در دست بارگذاری...</div>
              </div>
            </div>

            <!-- Progress Mode -->
            <div v-else-if="viewMode === 'progress'">
              <HammasirDisplayProgressDisplay
                :completion-status="analyticsState.completionStatus"
                :show-timeline="true"
                :show-actions="true"
                @start-section="navigateToEdit"
                @continue-section="navigateToEdit"
              />
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6 animate-slide-in-right">
            <!-- Profile Completion -->
            <HammasirProfileProfileCompletion
              :completion-status="analyticsState.completionStatus"
              :show-actions="true"
              :show-tips="true"
              variant="card"
              @section-click="navigateToEdit"
            />

            <!-- Profile Actions -->
            <HammasirProfileProfileActions
              :profile="currentProfile"
              :completion-status="analyticsState.completionStatus"
              layout="vertical"
              variant="card"
              :show-descriptions="true"
              @edit="navigateToEdit()"
              @analytics="navigateToAnalytics"
              @handbook="navigateToHandbook"
              @matching="navigateToMatching"
              @export="handleExport"
              @share="handleShare"
              @print="handlePrint"
              @settings="navigateTo('/hammasir/settings')"
            />

            <!-- Quick Stats -->
            <div v-if="analyticsState.analytics" class="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="ph:chart-pie" class="w-5 h-5 text-white" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  آمار سریع
                </BaseHeading>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">امتیاز کلی</span>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-xs font-bold text-white">{{ Math.round(analyticsState.analytics.overallScore * 100) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">پتانسیل انطباق</span>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-xs font-bold text-white">{{ analyticsState.analytics.matchingPotential }}%</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">توصیه‌های فعال</span>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                      <span class="text-xs font-bold text-white">{{ analyticsState.analytics.recommendationsCount }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-white/30 dark:border-gray-600/30">
                <BaseButton
                  variant="outline"
                  size="sm"
                  class="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 group"
                  @click="navigateToAnalytics"
                >
                  <Icon name="ph:chart-pie" class="w-4 h-4 me-2 group-hover:rotate-12 transition-transform duration-300" />
                  مشاهده تحلیل کامل
                </BaseButton>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-gradient-to-br from-white/80 to-green-50/80 dark:from-gray-800/80 dark:to-green-900/20 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="ph:clock-clockwise" class="w-5 h-5 text-white" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  فعالیت اخیر
                </BaseHeading>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-start gap-4 p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl group hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md mt-0.5">
                    <Icon name="ph:user-circle" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      پروفایل به‌روزرسانی شد
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">2 روز پیش</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-4 p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl group hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md mt-0.5">
                    <Icon name="ph:briefcase" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      سوابق شغلی اضافه شد
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">5 روز پیش</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-4 p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl group hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md mt-0.5">
                    <Icon name="ph:brain" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      تحلیل جدید تولید شد
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">1 هفته پیش</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto text-center">
        <Icon name="ph:user-plus" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-4">
          پروفایل شما هنوز ایجاد نشده
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
          برای استفاده از امکانات پلتفرم، ابتدا پروفایل خود را ایجاد کنید.
        </BaseParagraph>
        <BaseButton variant="solid" @click="navigateToEdit()">
          <Icon name="ph:plus" class="w-4 h-4 me-2" />
          ایجاد پروفایل
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
  }
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out 0.2s both;
}

/* Glassmorphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

/* Hover effects for cards */
.hover\:shadow-xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

/* Button hover animations */
.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modern scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}
</style>