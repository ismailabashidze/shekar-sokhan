<script setup lang="ts">
import type { UserProfile, ProfileCompletionStatus } from '~/types/hammasir'

interface Props {
  profile: UserProfile
  completionStatus?: ProfileCompletionStatus
  showActions?: boolean
  showProgress?: boolean
  variant?: 'default' | 'compact' | 'hero'
  loading?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'share'): void
  (e: 'download'): void
  (e: 'settings'): void
  (e: 'upload-avatar', file: File): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showProgress: true,
  variant: 'default',
  loading: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

// Computed values
const fullName = computed(() => {
  return `${props.profile.personalInfo.firstName} ${props.profile.personalInfo.lastName}`.trim()
})

const completionPercentage = computed(() => {
  return props.completionStatus?.overallPercentage || 0
})

const verificationStatus = computed(() => {
  return props.profile.status
})

// Format last updated date
const formatLastUpdated = (dateString: string) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'امروز'
    if (diffInDays === 1) return 'دیروز'
    if (diffInDays < 7) return `${diffInDays} روز پیش`
    
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

// Get status color and label
const getStatusInfo = (status: string) => {
  const statusMap = {
    'PENDING_VERIFICATION': { color: 'yellow', label: 'در انتظار تأیید' },
    'VERIFIED': { color: 'green', label: 'تأیید شده' },
    'REJECTED': { color: 'red', label: 'رد شده' },
    'UNDER_REVIEW': { color: 'blue', label: 'در حال بررسی' },
    'INCOMPLETE': { color: 'gray', label: 'ناقص' }
  }
  return statusMap[status as keyof typeof statusMap] || { color: 'gray', label: status }
}

// Avatar upload handler
const handleAvatarUpload = (file: File) => {
  emit('upload-avatar', file)
}

// Get completion level description
const getCompletionDescription = (percentage: number) => {
  if (percentage >= 90) return 'پروفایل کامل'
  if (percentage >= 70) return 'تقریباً کامل'
  if (percentage >= 50) return 'نیمه کامل'
  if (percentage >= 25) return 'شروع شده'
  return 'ناقص'
}
</script>

<template>
  <div 
    :class="`relative overflow-hidden rounded-2xl transition-all duration-300 ${
      variant === 'hero' 
        ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-1 shadow-2xl' 
        : variant === 'compact'
        ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-1 shadow-xl'
    }`"
  >
    <!-- Hero Variant Background Effects -->
    <div v-if="variant === 'hero'" class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>

    <!-- Main Content Container -->
    <div 
      :class="`relative ${
        variant === 'compact'
          ? 'p-4'
          : variant === 'hero'
          ? 'rounded-2xl bg-gradient-to-br from-purple-600/90 via-blue-600/90 to-indigo-700/90 backdrop-blur-xl p-8'
          : 'rounded-2xl bg-gradient-to-br from-indigo-500/90 via-purple-600/90 to-pink-500/90 backdrop-blur-xl p-6'
      }`"
    >
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>

      <!-- Compact Variant -->
      <div v-if="variant === 'compact'" class="flex items-center justify-between">
        <div class="flex items-center">
          <!-- Avatar -->
          <div class="relative group">
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <img
                v-if="profile.personalInfo.profilePicture"
                :src="profile.personalInfo.profilePicture"
                :alt="fullName"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="ph:user" class="w-6 h-6 text-gray-400" />
              </div>
            </div>
            
            <!-- Avatar Upload Overlay (if not readonly) -->
            <HammasirCommonAvatarUpload
              v-if="!readonly"
              :model-value="profile.personalInfo.profilePicture"
              size="sm"
              class="absolute inset-0 opacity-0 group-hover:opacity-100"
              @update:model-value="handleAvatarUpload"
            />
          </div>

          <div class="ms-3">
            <BaseHeading as="h2" size="md" weight="semibold" class="text-gray-800 dark:text-white">
              {{ fullName }}
            </BaseHeading>
            <div class="flex items-center gap-2 mt-1">
              <HammasirCommonStatusBadge
                :status="verificationStatus"
                size="xs"
              />
              <span v-if="showProgress" class="text-xs text-gray-500 dark:text-gray-400">
                {{ completionPercentage }}% تکمیل
              </span>
            </div>
          </div>
        </div>

        <!-- Compact Actions -->
        <div v-if="showActions && !readonly" class="flex items-center gap-2">
          <BaseButton size="xs" variant="ghost" @click="emit('edit')">
            <Icon name="ph:pencil" class="w-4 h-4" />
          </BaseButton>
          <BaseDropdown>
            <template #trigger>
              <BaseButton size="xs" variant="ghost">
                <Icon name="ph:dots-three-vertical" class="w-4 h-4" />
              </BaseButton>
            </template>
            <template #content>
              <div class="py-2 min-w-[160px]">
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="emit('share')">
                  <Icon name="ph:share" class="w-4 h-4 me-3" />
                  اشتراک‌گذاری
                </button>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="emit('download')">
                  <Icon name="ph:download" class="w-4 h-4 me-3" />
                  دانلود
                </button>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" @click="emit('settings')">
                  <Icon name="ph:gear" class="w-4 h-4 me-3" />
                  تنظیمات
                </button>
              </div>
            </template>
          </BaseDropdown>
        </div>
      </div>

      <!-- Default & Hero Variants -->
      <div v-else>
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <!-- Profile Information -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <!-- Avatar -->
              <div class="relative group flex-shrink-0">
                <div 
                  :class="`${
                    variant === 'hero' ? 'w-28 h-28' : 'w-24 h-24'
                  } bg-white/20 rounded-2xl overflow-hidden shadow-xl border-4 border-white/30`"
                >
                  <img
                    v-if="profile.personalInfo.profilePicture"
                    :src="profile.personalInfo.profilePicture"
                    :alt="fullName"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="ph:user-circle" class="w-16 h-16 text-white/70" />
                  </div>
                </div>
                
                <!-- Avatar Upload Overlay (if not readonly) -->
                <div v-if="!readonly" class="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Icon name="ph:camera" class="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    @change="handleAvatarUpload($event.target.files[0])"
                  />
                </div>
              </div>

              <!-- Profile Details -->
              <div class="flex-1 min-w-0">
                <BaseHeading 
                  as="h1" 
                  :size="variant === 'hero' ? '3xl' : '2xl'" 
                  weight="bold" 
                  class="text-white drop-shadow-lg mb-3"
                >
                  {{ fullName }}
                </BaseHeading>
                
                <!-- Contact Information -->
                <div class="flex flex-wrap items-center gap-6 text-white/90 text-sm mb-6">
                  <div v-if="profile.personalInfo.email" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <Icon name="ph:envelope-simple" class="w-3 h-3 text-white" />
                    </div>
                    <span class="text-xs font-medium">{{ profile.personalInfo.email }}</span>
                  </div>
                  <div v-if="profile.personalInfo.phoneNumber" class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    <div class="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Icon name="ph:phone-call" class="w-3 h-3 text-white" />
                    </div>
                    <span class="text-xs font-medium">{{ profile.personalInfo.phoneNumber }}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    <div class="w-6 h-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                      <Icon name="ph:calendar-check" class="w-3 h-3 text-white" />
                    </div>
                    <span class="text-xs font-medium">عضو از {{ formatLastUpdated(profile.createdAt) }}</span>
                  </div>
                </div>

                <!-- Status and Last Updated -->
                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <div class="flex items-center gap-3">
                    <HammasirCommonStatusBadge
                      :status="verificationStatus"
                      size="sm"
                      class="bg-white/20 border-white/30 shadow-lg"
                    />
                    <div class="flex items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <div class="w-5 h-5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                        <Icon name="ph:clock-clockwise" class="w-3 h-3 text-white" />
                      </div>
                      <span class="text-xs font-medium">بروزرسانی: {{ formatLastUpdated(profile.updatedAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Quick Stats -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                      <Icon name="ph:graduation-cap" class="w-5 h-5 text-white" />
                    </div>
                    <div class="text-xl font-bold text-white mb-1">{{ profile.demographics.education?.length || 0 }}</div>
                    <div class="text-xs text-white/90 font-medium">تحصیلات</div>
                  </div>
                  <div class="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                      <Icon name="ph:briefcase" class="w-5 h-5 text-white" />
                    </div>
                    <div class="text-xl font-bold text-white mb-1">{{ profile.demographics.occupation?.length || 0 }}</div>
                    <div class="text-xs text-white/90 font-medium">شغل</div>
                  </div>
                  <div class="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                      <Icon name="ph:map-pin" class="w-5 h-5 text-white" />
                    </div>
                    <div class="text-xl font-bold text-white mb-1">{{ profile.demographics.location?.length || 0 }}</div>
                    <div class="text-xs text-white/90 font-medium">مکان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress & Actions Sidebar -->
          <div class="flex-shrink-0">
            <!-- Enhanced Progress Circle -->
            <div v-if="showProgress" class="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 mb-6 shadow-xl">
              <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <Icon name="ph:chart-pie-slice" class="w-3 h-3 text-white" />
                  </div>
                  <BaseParagraph class="text-white font-semibold">تکمیل پروفایل</BaseParagraph>
                </div>
                <div class="relative w-24 h-24 mx-auto mb-4">
                  <!-- Background Circle -->
                  <svg class="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(255,255,255,0.2)"
                      stroke-width="8"
                      fill="transparent"
                    />
                    <!-- Progress Circle -->
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#progressGradient)"
                      stroke-width="8"
                      fill="transparent"
                      stroke-linecap="round"
                      :stroke-dasharray="251"
                      :stroke-dashoffset="251 - (251 * completionPercentage) / 100"
                      class="transition-all duration-1000 ease-out"
                    />
                    <!-- Gradient Definition -->
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#22d3ee" />
                        <stop offset="50%" stop-color="#3b82f6" />
                        <stop offset="100%" stop-color="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-bold text-white drop-shadow-md">{{ completionPercentage }}%</span>
                  </div>
                </div>
                <div class="text-sm text-white/90 font-medium bg-white/20 rounded-full px-3 py-1">{{ getCompletionDescription(completionPercentage) }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="showActions && !readonly" class="flex flex-col gap-3">
              <BaseButton
                variant="solid"
                class="bg-white/20 hover:bg-white/30 text-white border-white/30"
                @click="emit('edit')"
              >
                <Icon name="ph:pencil" class="w-4 h-4 me-2" />
                ویرایش پروفایل
              </BaseButton>
              
              <div class="grid grid-cols-2 gap-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  class="text-white border-white/30 hover:bg-white/10"
                  @click="emit('share')"
                >
                  <Icon name="ph:share" class="w-4 h-4 me-1" />
                  اشتراک
                </BaseButton>
                
                <BaseButton
                  variant="outline"
                  size="sm"
                  class="text-white border-white/30 hover:bg-white/10"
                  @click="emit('download')"
                >
                  <Icon name="ph:download" class="w-4 h-4 me-1" />
                  دانلود
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>