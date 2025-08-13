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
                <div class="flex flex-wrap items-center gap-4 text-white/90 text-sm mb-4">
                  <div v-if="profile.personalInfo.email" class="flex items-center">
                    <Icon name="ph:envelope" class="w-4 h-4 me-1" />
                    <span>{{ profile.personalInfo.email }}</span>
                  </div>
                  <div v-if="profile.personalInfo.phoneNumber" class="flex items-center">
                    <Icon name="ph:phone" class="w-4 h-4 me-1" />
                    <span>{{ profile.personalInfo.phoneNumber }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:calendar" class="w-4 h-4 me-1" />
                    <span>عضو از {{ formatLastUpdated(profile.createdAt) }}</span>
                  </div>
                </div>

                <!-- Status and Last Updated -->
                <div class="flex flex-wrap items-center gap-4 mb-4">
                  <HammasirCommonStatusBadge
                    :status="verificationStatus"
                    size="sm"
                    class="bg-white/20 border-white/30"
                  />
                  <div class="text-white/80 text-sm flex items-center">
                    <Icon name="ph:clock" class="w-4 h-4 me-1" />
                    <span>آخرین بروزرسانی: {{ formatLastUpdated(profile.updatedAt) }}</span>
                  </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                    <div class="text-lg font-bold text-white">{{ profile.demographics.education?.length || 0 }}</div>
                    <div class="text-xs text-white/80">تحصیلات</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                    <div class="text-lg font-bold text-white">{{ profile.demographics.occupation?.length || 0 }}</div>
                    <div class="text-xs text-white/80">شغل</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                    <div class="text-lg font-bold text-white">{{ profile.demographics.location?.length || 0 }}</div>
                    <div class="text-xs text-white/80">مکان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress & Actions Sidebar -->
          <div class="flex-shrink-0">
            <!-- Progress Circle -->
            <div v-if="showProgress" class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div class="text-center">
                <BaseParagraph class="text-white/80 mb-3">تکمیل پروفایل</BaseParagraph>
                <div class="relative w-20 h-20 mx-auto mb-3">
                  <svg class="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="rgba(255,255,255,0.2)"
                      stroke-width="6"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="white"
                      stroke-width="6"
                      fill="transparent"
                      stroke-linecap="round"
                      :stroke-dasharray="220"
                      :stroke-dashoffset="220 - (220 * completionPercentage) / 100"
                      class="transition-all duration-500"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-bold text-white">{{ completionPercentage }}%</span>
                  </div>
                </div>
                <div class="text-xs text-white/80">{{ getCompletionDescription(completionPercentage) }}</div>
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