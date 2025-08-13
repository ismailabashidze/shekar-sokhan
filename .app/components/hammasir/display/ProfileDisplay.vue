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
      <!-- Personal Information -->
      <HammasirCommonFormSection
        title="اطلاعات شخصی"
        description="اطلاعات پایه و تماس"
        icon="ph:user"
        :completed="true"
        :progress="100"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-1">
            <div class="text-sm text-gray-500">جنسیت</div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ profile.personalInfo.gender === 'FEMALE' ? 'زن' : 'مرد' }}
            </div>
          </div>
          
          <div v-if="profile.personalInfo.dateOfBirth" class="space-y-1">
            <div class="text-sm text-gray-500">تاریخ تولد</div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ profile.personalInfo.dateOfBirth }}
            </div>
          </div>
          
          <div v-if="profile.personalInfo.phoneNumber" class="space-y-1">
            <div class="text-sm text-gray-500">تلفن همراه</div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ profile.personalInfo.phoneNumber }}
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Education -->
      <HammasirCommonFormSection
        v-if="hasEducationData"
        title="سوابق تحصیلی"
        description="تحصیلات و مدارک علمی"
        icon="ph:graduation-cap"
        :completed="hasEducationData"
        :progress="hasEducationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-4">
          <div
            v-for="(education, index) in profile.demographics.education"
            :key="education.id || index"
            class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-white">
                  {{ education.degree }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ education.institutionName }}
                </p>
              </div>
              <div class="text-right">
                <HammasirCommonStatusBadge
                  :status="education.isCurrent ? 'active' : (education.isGraduated ? 'completed' : 'in_progress')"
                  size="sm"
                />
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">رشته: </span>
                <span class="text-gray-800 dark:text-white">{{ education.fieldOfStudy }}</span>
              </div>
              <div>
                <span class="text-gray-500">سطح: </span>
                <span class="text-gray-800 dark:text-white">{{ getEducationLevelLabel(education.educationLevel) }}</span>
              </div>
              <div>
                <span class="text-gray-500">شروع: </span>
                <span class="text-gray-800 dark:text-white">{{ education.startDate }}</span>
              </div>
              <div v-if="!education.isCurrent">
                <span class="text-gray-500">پایان: </span>
                <span class="text-gray-800 dark:text-white">{{ education.endDate || 'تعیین نشده' }}</span>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Occupation -->
      <HammasirCommonFormSection
        v-if="hasOccupationData"
        title="سوابق شغلی"
        description="تجربیات و پست‌های شغلی"
        icon="ph:briefcase"
        :completed="hasOccupationData"
        :progress="hasOccupationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-4">
          <div
            v-for="(occupation, index) in profile.demographics.occupation"
            :key="occupation.id || index"
            class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-white">
                  {{ occupation.currentPosition }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ occupation.companyName }}
                </p>
              </div>
              <div class="text-right">
                <HammasirCommonStatusBadge
                  :status="occupation.isCurrentJob ? 'active' : 'completed'"
                  size="sm"
                />
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">صنعت: </span>
                <span class="text-gray-800 dark:text-white">{{ occupation.industry }}</span>
              </div>
              <div>
                <span class="text-gray-500">نوع استخدام: </span>
                <span class="text-gray-800 dark:text-white">{{ getEmploymentTypeLabel(occupation.employmentType) }}</span>
              </div>
              <div>
                <span class="text-gray-500">شروع: </span>
                <span class="text-gray-800 dark:text-white">{{ occupation.startDate }}</span>
              </div>
              <div v-if="!occupation.isCurrentJob">
                <span class="text-gray-500">پایان: </span>
                <span class="text-gray-800 dark:text-white">{{ occupation.endDate || 'تعیین نشده' }}</span>
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Location -->
      <HammasirCommonFormSection
        v-if="hasLocationData"
        title="محل‌های سکونت"
        description="شهرها و مناطق سکونت"
        icon="ph:map-pin"
        :completed="hasLocationData"
        :progress="hasLocationData ? 100 : 0"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="space-y-3">
          <div
            v-for="(location, index) in profile.demographics.location"
            :key="location.id || index"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center">
              <Icon name="ph:map-pin" class="w-4 h-4 text-gray-500 me-3" />
              <span class="font-medium text-gray-800 dark:text-white">
                {{ location.city }}, {{ location.state }}, {{ location.country }}
              </span>
            </div>
            <HammasirCommonStatusBadge
              v-if="location.isCurrent"
              status="active"
              size="xs"
            />
          </div>
        </div>
      </HammasirCommonFormSection>

      <!-- Preferences -->
      <HammasirCommonFormSection
        title="تنظیمات و ترجیحات"
        description="ارتباطات و حریم خصوصی"
        icon="ph:gear"
        :completed="true"
        :progress="100"
        :collapsible="compact"
        :default-expanded="!compact"
      >
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Communication Preferences -->
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white mb-3">ارتباطات</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">اطلاعیه‌های ایمیلی</span>
                <HammasirCommonStatusBadge
                  :status="profile.preferences.communication.email ? 'active' : 'disabled'"
                  size="xs"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">اطلاعیه‌های پیامکی</span>
                <HammasirCommonStatusBadge
                  :status="profile.preferences.communication.sms ? 'active' : 'disabled'"
                  size="xs"
                />
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white mb-3">حریم خصوصی</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">نمایش به مشاوران</span>
                <HammasirCommonStatusBadge
                  :status="profile.privacySettings.isProfileVisibleToCounselors ? 'active' : 'disabled'"
                  size="xs"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">نمایش به کاربران</span>
                <HammasirCommonStatusBadge
                  :status="profile.privacySettings.isProfileVisibleToOtherUsers ? 'active' : 'disabled'"
                  size="xs"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">انطباق‌یابی</span>
                <HammasirCommonStatusBadge
                  :status="profile.privacySettings.allowDataAnalysisForMatching ? 'active' : 'disabled'"
                  size="xs"
                />
              </div>
            </div>
          </div>
        </div>
      </HammasirCommonFormSection>
    </div>
  </div>
</template>