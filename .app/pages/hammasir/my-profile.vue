<script setup lang="ts">
import { useProfile } from '~/composables/hammasir/useProfile'
import type { UserProfileDto, PersonalInfoDto, DemographicsDto, PreferencesDto, PrivacySettingsDto } from '~/types/api'

definePageMeta({
  title: 'پروفایل من',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  currentUserProfile,
  isProfileLoading,
  profileError,
  profileState,
  getMyProfile,
  updateMyProfile,
  toggleMockData,
  useMockData,
  mockProfile,
} = useProfile()

const isEditing = ref(false)
const editedProfile = ref<Partial<UserProfileDto>>({})
const isSaving = ref(false)
const saveError = ref<string | null>(null)

// Initialize the profile data
onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    await getMyProfile()
  }
  catch (error) {
    console.error('Error loading profile:', error)
  }
}

const startEditing = () => {
  // Initialize the edited profile with current data
  const profile = mockProfile.value || currentUserProfile.value
  if (profile) {
    editedProfile.value = JSON.parse(JSON.stringify(profile)) as Partial<UserProfileDto>
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedProfile.value = {}
  saveError.value = null
}

const saveProfile = async () => {
  const profile = mockProfile.value || currentUserProfile.value
  if (!editedProfile.value || !profile) return

  // If we're using mock data, just update the mock profile
  if (useMockData.value) {
    mockProfile.value = {
      ...profile,
      ...editedProfile.value,
      personalInfo: {
        ...profile.personalInfo,
        ...editedProfile.value.personalInfo,
      },
      privacySettings: {
        ...profile.privacySettings,
        ...editedProfile.value.privacySettings,
      },
    } as UserProfileDto
    isEditing.value = false
    return
  }

  isSaving.value = true
  saveError.value = null

  try {
    // Create a proper UserProfileDto object with all required fields
    const profileToUpdate: UserProfileDto = {
      id: profile.id,
      userId: profile.userId,
      personalInfo: {
        id: profile.personalInfo.id,
        firstName: editedProfile.value.personalInfo?.firstName || profile.personalInfo.firstName,
        lastName: editedProfile.value.personalInfo?.lastName || profile.personalInfo.lastName,
        email: editedProfile.value.personalInfo?.email || profile.personalInfo.email,
        phoneNumber: editedProfile.value.personalInfo?.phoneNumber || profile.personalInfo.phoneNumber || '',
        dateOfBirth: editedProfile.value.personalInfo?.dateOfBirth || profile.personalInfo.dateOfBirth,
        gender: editedProfile.value.personalInfo?.gender || profile.personalInfo.gender,
        profilePicture: profile.personalInfo.profilePicture,
      },
      demographics: {
        id: profile.demographics.id,
        education: editedProfile.value.demographics?.education || profile.demographics.education,
        occupation: editedProfile.value.demographics?.occupation || profile.demographics.occupation,
        location: editedProfile.value.demographics?.location || profile.demographics.location,
      },
      preferences: {
        id: profile.preferences.id,
        communication: editedProfile.value.preferences?.communication || profile.preferences.communication,
      },
      privacySettings: {
        id: profile.privacySettings.id,
        isProfileVisibleToCounselors: editedProfile.value.privacySettings?.isProfileVisibleToCounselors !== undefined
          ? editedProfile.value.privacySettings.isProfileVisibleToCounselors
          : profile.privacySettings.isProfileVisibleToCounselors,
        isProfileVisibleToOtherUsers: editedProfile.value.privacySettings?.isProfileVisibleToOtherUsers !== undefined
          ? editedProfile.value.privacySettings.isProfileVisibleToOtherUsers
          : profile.privacySettings.isProfileVisibleToOtherUsers,
        allowDataAnalysisForMatching: editedProfile.value.privacySettings?.allowDataAnalysisForMatching !== undefined
          ? editedProfile.value.privacySettings.allowDataAnalysisForMatching
          : profile.privacySettings.allowDataAnalysisForMatching,
      },
      status: editedProfile.value.status || profile.status,
      createdAt: profile.createdAt,
      updatedAt: new Date().toISOString(),
    }

    await updateMyProfile(profileToUpdate)
    isEditing.value = false
  }
  catch (error: any) {
    saveError.value = error.message || 'خطا در به‌روزرسانی پروفایل'
    console.error('Error saving profile:', error)
  }
  finally {
    isSaving.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'فعال',
    PENDING_VERIFICATION: 'در انتظار تأیید',
    SUSPENDED: 'تعلیق شده',
    DEACTIVATED: 'غیرفعال',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    DEACTIVATED: 'bg-gray-100 text-gray-800',
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getGenderText = (gender: string) => {
  const genderMap: Record<string, string> = {
    MALE: 'مرد',
    FEMALE: 'زن',
  }
  return genderMap[gender] || gender
}

// Mock data for UI demonstration
const fillMockData = () => {
  toggleMockData()
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              پروفایل من
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              اطلاعات پروفایل شما
            </p>
          </div>
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="fillMockData()"
          >
            {{ useMockData ? 'استفاده از داده‌های واقعی' : 'پر کردن با داده‌های تستی' }}
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Loading State -->
      <div v-if="isProfileLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری پروفایل...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="profileError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری پروفایل
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ profileError }}</p>
            </div>
            <div class="mt-4">
              <button
                class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="loadProfile"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="currentUserProfile || useMockData" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Profile Header -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center">
              <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <div class="mr-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.firstName }} {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.lastName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.email }}
                </p>
              </div>
            </div>
            <div class="mt-4 md:mt-0">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="getStatusClass((useMockData ? mockProfile : currentUserProfile)?.status)"
              >
                {{ getStatusText((useMockData ? mockProfile : currentUserProfile)?.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex justify-end">
            <button
              v-if="!isEditing"
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="startEditing"
            >
              <Icon name="ph:pencil-simple" class="ml-2 size-4" />
              ویرایش پروفایل
            </button>
            <div v-else class="flex space-x-3 space-x-reverse">
              <button
                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="cancelEditing"
              >
                انصراف
              </button>
              <button
                :disabled="isSaving"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                @click="saveProfile"
              >
                <Icon
                  v-if="isSaving"
                  name="ph:spinner"
                  class="ml-2 size-4 animate-spin"
                />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Save Error -->
        <div v-if="saveError" class="px-4 py-5 sm:px-6">
          <div class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div class="flex">
              <div class="shrink-0">
                <Icon name="ph:x-circle" class="size-5 text-red-400" />
              </div>
              <div class="mr-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                  خطا در ذخیره پروفایل
                </h3>
                <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{{ saveError }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="px-4 py-5 sm:px-6">
          <div v-if="!isEditing">
            <!-- Personal Information -->
            <div class="mb-8">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                اطلاعات شخصی
              </h3>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ایمیل
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.email }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.firstName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام خانوادگی
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.lastName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    شماره تلفن
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.phoneNumber }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ تولد
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ (useMockData ? mockProfile : currentUserProfile)?.personalInfo?.dateOfBirth ? formatDate((useMockData ? mockProfile : currentUserProfile)?.personalInfo?.dateOfBirth) : '-' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    جنسیت
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ getGenderText((useMockData ? mockProfile : currentUserProfile)?.personalInfo?.gender) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Privacy Settings -->
            <div>
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                تنظیمات حریم خصوصی
              </h3>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نمایش پروفایل به مشاوران
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    <span :class="((useMockData ? mockProfile : currentUserProfile)?.privacySettings?.isProfileVisibleToCounselors ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')">
                      {{ (useMockData ? mockProfile : currentUserProfile)?.privacySettings?.isProfileVisibleToCounselors ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نمایش پروفایل به سایر کاربران
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    <span :class="((useMockData ? mockProfile : currentUserProfile)?.privacySettings?.isProfileVisibleToOtherUsers ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')">
                      {{ (useMockData ? mockProfile : currentUserProfile)?.privacySettings?.isProfileVisibleToOtherUsers ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    اجازه تحلیل داده‌ها برای همخوانی‌یابی
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    <span :class="((useMockData ? mockProfile : currentUserProfile)?.privacySettings?.allowDataAnalysisForMatching ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')">
                      {{ (useMockData ? mockProfile : currentUserProfile)?.privacySettings?.allowDataAnalysisForMatching ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-else>
            <div class="space-y-6">
              <!-- Personal Information Section -->
              <div>
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  اطلاعات شخصی
                </h3>
                <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">نام</label>
                    <input
                      v-model="editedProfile.personalInfo.firstName"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">نام خانوادگی</label>
                    <input
                      v-model="editedProfile.personalInfo.lastName"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ایمیل</label>
                    <input
                      v-model="editedProfile.personalInfo.email"
                      type="email"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">شماره تلفن</label>
                    <input
                      v-model="editedProfile.personalInfo.phoneNumber"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">تاریخ تولد</label>
                    <input
                      v-model="editedProfile.personalInfo.dateOfBirth"
                      type="date"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">جنسیت</label>
                    <select
                      v-model="editedProfile.personalInfo.gender"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                      <option value="MALE">
                        مرد
                      </option>
                      <option value="FEMALE">
                        زن
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Privacy Settings Section -->
              <div>
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  تنظیمات حریم خصوصی
                </h3>
                <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div class="flex items-center">
                    <input
                      v-model="editedProfile.privacySettings.isProfileVisibleToCounselors"
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    >
                    <label class="mr-2 block text-sm text-gray-900 dark:text-white">
                      نمایش پروفایل به مشاوران
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="editedProfile.privacySettings.isProfileVisibleToOtherUsers"
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    >
                    <label class="mr-2 block text-sm text-gray-900 dark:text-white">
                      نمایش پروفایل به سایر کاربران
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="editedProfile.privacySettings.allowDataAnalysisForMatching"
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    >
                    <label class="mr-2 block text-sm text-gray-900 dark:text-white">
                      اجازه تحلیل داده‌ها برای همخوانی‌یابی
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <Icon name="ph:user" class="mx-auto size-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          پروفایل یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          اطلاعات پروفایل شما در دسترس نیست.
        </p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="loadProfile"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
