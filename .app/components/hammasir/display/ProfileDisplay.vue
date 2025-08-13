<script setup lang="ts">
import { useProfileAnalytics } from '~/composables/hammasir/useProfileAnalytics'
import type { ProfileDisplayData, UserProfile } from '~/types/hammasir'

interface Props {
  profile: UserProfile
  compact?: boolean
  showActions?: boolean
  showProgress?: boolean
  readonly?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'edit', section?: string): void
  (e: 'export'): void
  (e: 'share'): void
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showActions: true,
  showProgress: true,
  readonly: false,
  loading: false,
})

const emit = defineEmits<Emits>()

const { state: analyticsState, loadAnalytics } = useProfileAnalytics()

// Load analytics data
onMounted(() => {
  loadAnalytics()
})

// Computed properties for display
const fullName = computed(() => {
  return `${props.profile.personalInfo.firstName} ${props.profile.personalInfo.lastName}`.trim()
})

const profileCompletionPercentage = computed(() => {
  return analyticsState.completionStatus?.overallPercentage || 0
})

const verificationStatus = computed(() => {
  return props.profile.status
})

// Format dates
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

// Get education level label
const getEducationLevelLabel = (level: string) => {
  const labels = {
    'HIGH_SCHOOL': 'دیپلم',
    'BACHELOR': 'کارشناسی',
    'MASTER': 'کارشناسی ارشد',
    'PHD': 'دکتری',
    'VOCATIONAL': 'فنی و حرفه‌ای',
    'OTHER': 'سایر'
  }
  return labels[level as keyof typeof labels] || level
}

// Get employment type label
const getEmploymentTypeLabel = (type: string) => {
  const labels = {
    'FULL_TIME': 'تمام وقت',
    'PART_TIME': 'پاره وقت',
    'CONTRACT': 'پیمانی',
    'FREELANCE': 'آزاد',
    'INTERNSHIP': 'کارآموزی'
  }
  return labels[type as keyof typeof labels] || type
}

// Check if section has data
const hasEducationData = computed(() => {
  return props.profile.demographics.education && props.profile.demographics.education.length > 0
})

const hasOccupationData = computed(() => {
  return props.profile.demographics.occupation && props.profile.demographics.occupation.length > 0
})

const hasLocationData = computed(() => {
  return props.profile.demographics.location && props.profile.demographics.location.length > 0
})
</script>

<template>
  <div class="space-y-6">
    <!-- Profile Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 p-1 shadow-2xl shadow-purple-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-purple-600/90 via-indigo-700/90 to-blue-700/90 backdrop-blur-xl px-8 py-8">
        <!-- Loading Overlay -->
        <div v-if="loading" class="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        <!-- Profile Info -->
        <div class="flex items-start justify-between">
          <div class="flex items-start">
            <!-- Avatar -->
            <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center me-6 shadow-xl overflow-hidden">
              <img
                v-if="profile.personalInfo.profilePicture"
                :src="profile.personalInfo.profilePicture"
                :alt="fullName"
                class="w-full h-full object-cover"
              />
              <Icon v-else name="ph:user-circle" class="w-12 h-12 text-white" />
            </div>
            
            <div>
              <BaseHeading as="h1" size="2xl" weight="bold" class="text-white drop-shadow-lg mb-2">
                {{ fullName }}
              </BaseHeading>
              
              <div class="flex items-center gap-4 text-white/90 text-sm mb-3">
                <div v-if="profile.personalInfo.email" class="flex items-center">
                  <Icon name="ph:envelope" class="w-4 h-4 me-1" />
                  <span>{{ profile.personalInfo.email }}</span>
                </div>
                <div v-if="profile.personalInfo.phoneNumber" class="flex items-center">
                  <Icon name="ph:phone" class="w-4 h-4 me-1" />
                  <span>{{ profile.personalInfo.phoneNumber }}</span>
                </div>
              </div>

              <!-- Status and Last Updated -->
              <div class="flex items-center gap-3">
                <HammasirCommonStatusBadge
                  :status="verificationStatus"
                  size="sm"
                  class="bg-white/20 border-white/30"
                />
                <span class="text-white/80 text-sm">
                  آخرین بروزرسانی: {{ formatDate(profile.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Progress Circle -->
          <div v-if="showProgress" class="text-center">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <BaseParagraph class="text-white/80 mb-2">تکمیل پروفایل</BaseParagraph>
              <div class="text-4xl font-bold text-white mb-2">{{ profileCompletionPercentage }}%</div>
              <HammasirCommonProgressBar
                :value="profileCompletionPercentage"
                variant="default"
                size="sm"
                class="w-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="showActions && !readonly" class="flex justify-center gap-3">
      <BaseButton
        variant="outline"
        @click="emit('edit')"
      >
        <Icon name="ph:pencil" class="w-4 h-4 me-2" />
        ویرایش پروفایل
      </BaseButton>
      
      <BaseButton
        variant="outline"
        @click="emit('export')"
      >
        <Icon name="ph:download" class="w-4 h-4 me-2" />
        دانلود گزارش
      </BaseButton>
      
      <BaseButton
        variant="outline"
        @click="emit('share')"
      >
        <Icon name="ph:share" class="w-4 h-4 me-2" />
        اشتراک‌گذاری
      </BaseButton>
    </div>

    <!-- Profile Sections -->
    <div class="grid gap-6">
      <!-- Enhanced Personal Information -->
      <HammasirCommonFormSection
        title="اطلاعات شخصی تکمیل شده"
        description="اطلاعات پایه و تماس"
        icon="ph:user-circle-check"
        :completed="true"
        :progress="100"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/50 dark:border-pink-700/30 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
              <Icon name="ph:gender-intersex" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">جنسیت</div>
              <div class="font-semibold text-gray-800 dark:text-white text-lg">
                {{ profile.personalInfo.gender === 'FEMALE' ? 'زن' : 'مرد' }}
              </div>
            </div>
          </div>
          
          <div v-if="profile.personalInfo.dateOfBirth" class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
              <Icon name="ph:calendar-star" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">تاریخ تولد</div>
              <div class="font-semibold text-gray-800 dark:text-white text-lg">
                {{ profile.personalInfo.dateOfBirth }}
              </div>
            </div>
          </div>
          
          <div v-if="profile.personalInfo.phoneNumber" class="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <Icon name="ph:phone-call" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">تلفن همراه</div>
              <div class="font-semibold text-gray-800 dark:text-white text-lg">
                {{ profile.personalInfo.phoneNumber }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Info Row -->
        <div class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <Icon name="ph:check-circle" class="w-4 h-4 text-white" />
              </div>
              <span class="font-semibold text-gray-800 dark:text-white">اطلاعات شخصی تکمیل شده</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                <Icon name="ph:seal-check" class="w-4 h-4" />
                تأیید شده
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Enhanced Education Section -->
      <HammasirCommonFormSection
        v-if="hasEducationData"
        title="سوابق تحصیلی تکمیل شده"
        description="تحصیلات و مدارک علمی"
        icon="ph:graduation-cap"
        :completed="hasEducationData"
        :progress="hasEducationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-6">
          <div
            v-for="(education, index) in profile.demographics.education"
            :key="education.id || index"
            class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-blue-300/20 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div class="relative p-6">
              <!-- Header Section -->
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-start gap-4">
                  <!-- Education Level Icon -->
                  <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name="ph:graduation-cap" class="w-7 h-7 text-white" />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-xl font-bold text-gray-800 dark:text-white">
                        {{ education.degree }}
                      </h4>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div class="w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                        <Icon name="ph:buildings" class="w-3 h-3 text-white" />
                      </div>
                      <span class="font-medium text-lg">{{ education.institutionName }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="flex flex-col items-end gap-2">
                  <HammasirCommonStatusBadge
                    :status="education.isCurrent ? 'active' : (education.isGraduated ? 'completed' : 'in_progress')"
                    size="sm"
                  />
                  <div class="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-2 py-1 rounded-full backdrop-blur-sm">
                    {{ getEducationLevelLabel(education.educationLevel) }}
                  </div>
                </div>
              </div>
              
              <!-- Details Grid -->
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Field of Study -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:book-open" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">رشته</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ education.fieldOfStudy }}</div>
                  </div>
                </div>
                
                <!-- Education Level -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:trophy" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">سطح</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ getEducationLevelLabel(education.educationLevel) }}</div>
                  </div>
                </div>
                
                <!-- Start Date -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:calendar-check" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">شروع</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ education.startDate }}</div>
                  </div>
                </div>
                
                <!-- End Date -->
                <div v-if="!education.isCurrent" class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:calendar-x" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">پایان</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ education.endDate || 'تعیین نشده' }}</div>
                  </div>
                </div>
                
                <!-- Current Status Indicator -->
                <div v-else class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-sm">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <Icon name="ph:lightning" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">وضعیت</div>
                    <div class="font-semibold text-green-700 dark:text-green-300">در حال تحصیل</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Enhanced Occupation Section -->
      <HammasirCommonFormSection
        v-if="hasOccupationData"
        title="سوابق شغلی تکمیل شده"
        description="تجربیات و پست‌های شغلی"
        icon="ph:briefcase"
        :completed="hasOccupationData"
        :progress="hasOccupationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-6">
          <div
            v-for="(occupation, index) in profile.demographics.occupation"
            :key="occupation.id || index"
            class="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-teal-300/20 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div class="relative p-6">
              <!-- Header Section -->
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-start gap-4">
                  <!-- Job Icon -->
                  <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name="ph:briefcase" class="w-7 h-7 text-white" />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-xl font-bold text-gray-800 dark:text-white">
                        {{ occupation.currentPosition }}
                      </h4>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div class="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <Icon name="ph:buildings" class="w-3 h-3 text-white" />
                      </div>
                      <span class="font-medium text-lg">{{ occupation.companyName }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="flex flex-col items-end gap-2">
                  <HammasirCommonStatusBadge
                    :status="occupation.isCurrentJob ? 'active' : 'completed'"
                    size="sm"
                  />
                  <div class="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-2 py-1 rounded-full backdrop-blur-sm">
                    {{ getEmploymentTypeLabel(occupation.employmentType) }}
                  </div>
                </div>
              </div>
              
              <!-- Details Grid -->
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Industry -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:factory" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">صنعت</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ occupation.industry }}</div>
                  </div>
                </div>
                
                <!-- Employment Type -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:user-gear" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">نوع استخدام</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ getEmploymentTypeLabel(occupation.employmentType) }}</div>
                  </div>
                </div>
                
                <!-- Start Date -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:calendar-plus" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">شروع</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ occupation.startDate }}</div>
                  </div>
                </div>
                
                <!-- End Date -->
                <div v-if="!occupation.isCurrentJob" class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:calendar-minus" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">پایان</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ occupation.endDate || 'تعیین نشده' }}</div>
                  </div>
                </div>
                
                <!-- Current Job Indicator -->
                <div v-else class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-sm">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <Icon name="ph:lightning" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">وضعیت</div>
                    <div class="font-semibold text-green-700 dark:text-green-300">شغل فعلی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Enhanced Location Section -->
      <HammasirCommonFormSection
        v-if="hasLocationData"
        title="محل‌های سکونت تکمیل شده"
        description="شهرها و مناطق سکونت"
        icon="ph:map-pin"
        :completed="hasLocationData"
        :progress="hasLocationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-6">
          <div
            v-for="(location, index) in profile.demographics.location"
            :key="location.id || index"
            class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-amber-300/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-yellow-300/20 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div class="relative p-6">
              <!-- Header Section -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <!-- Location Icon -->
                  <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name="ph:map-pin" class="w-7 h-7 text-white" />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-xl font-bold text-gray-800 dark:text-white">
                        {{ location.city }}
                      </h4>
                      <div v-if="location.isCurrent" class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div class="text-gray-600 dark:text-gray-400 font-medium">
                      {{ location.state }}, {{ location.country }}
                    </div>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="flex flex-col items-end gap-2">
                  <HammasirCommonStatusBadge
                    v-if="location.isCurrent"
                    status="active"
                    size="sm"
                  />
                  <HammasirCommonStatusBadge
                    v-else
                    status="completed"
                    size="sm"
                  />
                </div>
              </div>
              
              <!-- Location Details Grid -->
              <div class="grid md:grid-cols-3 gap-4">
                <!-- City -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:city" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">شهر</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ location.city }}</div>
                  </div>
                </div>
                
                <!-- State/Province -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:flag" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">استان</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ location.state }}</div>
                  </div>
                </div>
                
                <!-- Country -->
                <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:globe" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">کشور</div>
                    <div class="font-semibold text-gray-800 dark:text-white">{{ location.country }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Current Location Indicator -->
              <div v-if="location.isCurrent" class="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <Icon name="ph:house" class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">وضعیت</div>
                    <div class="font-semibold text-green-700 dark:text-green-300">محل سکونت فعلی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Enhanced Creative Preferences Section -->
      <HammasirCommonFormSection
        title="تنظیمات و ترجیحات تکمیل شده"
        description="ارتباطات و حریم خصوصی"
        icon="ph:sliders"
        :completed="true"
        :progress="100"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-8">
          <!-- Communication Preferences Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full transform translate-x-12 -translate-y-12"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200/30 to-indigo-300/30 rounded-full transform -translate-x-8 translate-y-8"></div>
            
            <div class="relative p-6">
              <!-- Communication Header -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="ph:chat-circle" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 class="text-xl font-bold text-gray-800 dark:text-white">ارتباطات</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">اعلانات و اطلاع‌رسانی</p>
                </div>
              </div>
              
              <div class="grid gap-4">
                <!-- Email Notifications -->
                <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-200 group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon name="ph:envelope" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">اطلاعیه‌های ایمیلی</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">دریافت ایمیل برای بروزرسانی‌ها</div>
                    </div>
                  </div>
                  <div class="relative">
                    <!-- Toggle Switch Visual -->
                    <div :class="`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.preferences.communication.email ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`">
                      <div :class="`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.preferences.communication.email ? 'translate-x-4.5' : 'translate-x-0.5'} translate-y-0.5`">
                        <!-- ON State Indicator -->
                        <div v-if="profile.preferences.communication.email" class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <!-- OFF State Indicator -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- SMS Notifications -->
                <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-200 group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon name="ph:device-mobile" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">اطلاعیه‌های پیامکی</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">دریافت پیامک برای اطلاعات مهم</div>
                    </div>
                  </div>
                  <div class="relative">
                    <!-- Toggle Switch Visual -->
                    <div :class="`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.preferences.communication.sms ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`">
                      <div :class="`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.preferences.communication.sms ? 'translate-x-4.5' : 'translate-x-0.5'} translate-y-0.5`">
                        <!-- ON State Indicator -->
                        <div v-if="profile.preferences.communication.sms" class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <!-- OFF State Indicator -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Privacy Settings Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-red-200/50 dark:border-red-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-rose-300/30 rounded-full transform translate-x-12 -translate-y-12"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200/30 to-pink-300/30 rounded-full transform -translate-x-8 translate-y-8"></div>
            
            <div class="relative p-6">
              <!-- Privacy Header -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="ph:shield-check" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 class="text-xl font-bold text-gray-800 dark:text-white">حریم خصوصی</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">کنترل نمایش اطلاعات</p>
                </div>
              </div>
              
              <div class="grid gap-4">
                <!-- Counselor Visibility -->
                <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-200 group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon name="ph:user-focus" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">نمایش به مشاوران</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">اجازه مشاهده پروفایل توسط مشاوران</div>
                    </div>
                  </div>
                  <div class="relative">
                    <div :class="`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.privacySettings.isProfileVisibleToCounselors ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`">
                      <div :class="`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.privacySettings.isProfileVisibleToCounselors ? 'translate-x-4.5' : 'translate-x-0.5'} translate-y-0.5`">
                        <!-- ON State Indicator -->
                        <div v-if="profile.privacySettings.isProfileVisibleToCounselors" class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <!-- OFF State Indicator -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- User Visibility -->
                <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-200 group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon name="ph:users" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">نمایش به کاربران</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">اجازه مشاهده پروفایل توسط کاربران</div>
                    </div>
                  </div>
                  <div class="relative">
                    <div :class="`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.privacySettings.isProfileVisibleToOtherUsers ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`">
                      <div :class="`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.privacySettings.isProfileVisibleToOtherUsers ? 'translate-x-4.5' : 'translate-x-0.5'} translate-y-0.5`">
                        <!-- ON State Indicator -->
                        <div v-if="profile.privacySettings.isProfileVisibleToOtherUsers" class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <!-- OFF State Indicator -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Matching Analysis -->
                <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/40 rounded-xl backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all duration-200 group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon name="ph:heart" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white">انطباق‌یابی</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">اجازه تحلیل داده برای یافتن همسر</div>
                    </div>
                  </div>
                  <div class="relative">
                    <div :class="`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${profile.privacySettings.allowDataAnalysisForMatching ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`">
                      <div :class="`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.privacySettings.allowDataAnalysisForMatching ? 'translate-x-4.5' : 'translate-x-0.5'} translate-y-0.5`">
                        <!-- ON State Indicator -->
                        <div v-if="profile.privacySettings.allowDataAnalysisForMatching" class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <!-- OFF State Indicator -->
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>
    </div>
  </div>
</template>