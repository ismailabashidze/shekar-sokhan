<script setup lang="ts">
import { useCounselorProfile } from '~/composables/hammasir/useCounselorProfile'
import type { 
  CounselorProfileDto, 
  UpdateCounselorProfileDto,
  UpdateCounselorPersonalInfoDto,
  UpdateCounselorProfessionalInfoDto,
  SpecializationDto
} from '~/types/api'

definePageMeta({
  title: 'پروفایل مشاور',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  counselorProfile,
  isProfileLoading,
  profileError,
  getMyCounselorProfile,
  updateMyCounselorProfile,
  updatePersonalInfo,
  updateProfessionalInfo,
  updateSpecializations,
  updateAvailability,
  updateRates
} = useCounselorProfile()

const isEditing = ref(false)
const editSection = ref<'personal' | 'professional' | 'specializations' | null>(null)
const editedProfile = ref<UpdateCounselorProfileDto>({
  firstName: '',
  lastName: '',
  bio: '',
  city: '',
  yearsOfExperience: 0,
  hourlyRate: 0,
  education: '',
  certifications: []
})
const editedPersonalInfo = ref<UpdateCounselorPersonalInfoDto>({
  firstName: '',
  lastName: '',
  bio: '',
  city: '',
  yearsOfExperience: 0
})
const editedProfessionalInfo = ref<UpdateCounselorProfessionalInfoDto>({
  education: '',
  certifications: []
})
const editedSpecializations = ref<SpecializationDto[]>([])

// Initialize the profile data
onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    await getMyCounselorProfile()
    if (counselorProfile.value) {
      // Initialize edit forms with current data
      editedPersonalInfo.value = {
        firstName: counselorProfile.value.firstName || '',
        lastName: counselorProfile.value.lastName || '',
        bio: counselorProfile.value.bio || '',
        city: counselorProfile.value.city || '',
        yearsOfExperience: counselorProfile.value.yearsOfExperience || 0
      }
      
      editedProfessionalInfo.value = {
        education: counselorProfile.value.education || '',
        certifications: counselorProfile.value.certifications || []
      }
      
      editedSpecializations.value = counselorProfile.value.specializations || []
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const startEditing = (section: 'personal' | 'professional' | 'specializations') => {
  editSection.value = section
  isEditing.value = true
  
  // Populate the edit form with current data
  if (counselorProfile.value) {
    if (section === 'personal') {
      editedPersonalInfo.value = {
        firstName: counselorProfile.value.firstName || '',
        lastName: counselorProfile.value.lastName || '',
        bio: counselorProfile.value.bio || '',
        city: counselorProfile.value.city || '',
        yearsOfExperience: counselorProfile.value.yearsOfExperience || 0
      }
    } else if (section === 'professional') {
      editedProfessionalInfo.value = {
        education: counselorProfile.value.education || '',
        certifications: counselorProfile.value.certifications || []
      }
    } else if (section === 'specializations') {
      editedSpecializations.value = [...(counselorProfile.value.specializations || [])]
    }
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editSection.value = null
}

const saveProfile = async () => {
  if (!counselorProfile.value) return

  try {
    if (editSection.value === 'personal') {
      await updatePersonalInfo(editedPersonalInfo.value)
    } else if (editSection.value === 'professional') {
      await updateProfessionalInfo(editedProfessionalInfo.value)
    } else if (editSection.value === 'specializations') {
      await updateSpecializations(editedSpecializations.value)
    }
    
    await loadProfile()
    cancelEditing()
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const getRatingStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  if (hasHalfStar) {
    stars.push('half')
  }

  while (stars.length < 5) {
    stars.push('empty')
  }

  return stars
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          پروفایل مشاور
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          اطلاعات پروفایل مشاور
        </p>
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
      <div v-else-if="counselorProfile" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <!-- Profile Header -->
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center">
              <div class="size-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <div class="mr-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ counselorProfile.firstName }} {{ counselorProfile.lastName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ counselorProfile.specializations?.map(s => s.name).join(', ') || 'متخصص' }}
                </p>
              </div>
            </div>
            <div class="mt-4 md:mt-0">
              <span
                class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                :class="counselorProfile.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ counselorProfile.isOnline ? 'آنلاین' : 'آفلاین' }}
              </span>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <div v-if="!isEditing">
            <!-- Personal Information -->
            <div class="mb-8">
              <div class="flex items-center justify-between">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  اطلاعات شخصی
                </h3>
                <button
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="startEditing('personal')"
                >
                  <Icon name="ph:pencil-simple" class="ml-2 size-4" />
                  <span>ویرایش</span>
                </button>
              </div>
              
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.firstName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نام خانوادگی
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.lastName }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    شهر
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.city || 'نامشخص' }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    سابقه کار
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.yearsOfExperience || 0 }} سال
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    بیوگرافی
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.bio || 'بدون توضیحات' }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Professional Information -->
            <div class="mb-8">
              <div class="flex items-center justify-between">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  اطلاعات حرفه‌ای
                </h3>
                <button
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="startEditing('professional')"
                >
                  <Icon name="ph:pencil-simple" class="ml-2 size-4" />
                  <span>ویرایش</span>
                </button>
              </div>
              
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تحصیلات
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ counselorProfile.education || 'نامشخص' }}
                  </dd>
                </div>
                
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    گواهینامه‌ها
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    <div v-if="counselorProfile.certifications && counselorProfile.certifications.length > 0" class="space-y-2">
                      <div
                        v-for="cert in counselorProfile.certifications"
                        :key="cert.name"
                        class="rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                      >
                        <div class="font-medium text-gray-900 dark:text-white">{{ cert.name }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ cert.issuingOrg }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ cert.issueDate }}</div>
                      </div>
                    </div>
                    <div v-else class="text-gray-500 dark:text-gray-400">
                      گواهینامه‌ای ثبت نشده است
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Specializations -->
            <div class="mb-8">
              <div class="flex items-center justify-between">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  تخصص‌ها
                </h3>
                <button
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="startEditing('specializations')"
                >
                  <Icon name="ph:pencil-simple" class="ml-2 size-4" />
                  <span>ویرایش</span>
                </button>
              </div>
              
              <div v-if="counselorProfile.specializations && counselorProfile.specializations.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="spec in counselorProfile.specializations"
                  :key="spec.name"
                  class="rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
                >
                  {{ spec.name }}
                </span>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400">
                تخصصی ثبت نشده است
              </div>
            </div>

            <!-- Rates -->
            <div>
              <div class="flex items-center justify-between">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  نرخ‌ها
                </h3>
                <NuxtLink
                  to="/hammasir/counselors/me/rates"
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Icon name="ph:pencil-simple" class="ml-2 size-4" />
                  <span>تنظیم نرخ‌ها</span>
                </NuxtLink>
              </div>
              
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(counselorProfile.hourlyRate || 0) }}
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/جلسه</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Forms -->
          <div v-else>
            <form @submit.prevent="saveProfile">
              <!-- Personal Info Edit Form -->
              <div v-if="editSection === 'personal'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  ویرایش اطلاعات شخصی
                </h3>
                
                <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">نام</label>
                    <input
                      v-model="editedPersonalInfo.firstName"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">نام خانوادگی</label>
                    <input
                      v-model="editedPersonalInfo.lastName"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">شهر</label>
                    <input
                      v-model="editedPersonalInfo.city"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">سابقه کار (سال)</label>
                    <input
                      v-model.number="editedPersonalInfo.yearsOfExperience"
                      type="number"
                      min="0"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                  </div>
                  
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">بیوگرافی</label>
                    <textarea
                      v-model="editedPersonalInfo.bio"
                      rows="4"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Professional Info Edit Form -->
              <div v-else-if="editSection === 'professional'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  ویرایش اطلاعات حرفه‌ای
                </h3>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">تحصیلات</label>
                  <input
                    v-model="editedProfessionalInfo.education"
                    type="text"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">گواهینامه‌ها</label>
                  <div class="mt-2 space-y-3">
                    <div
                      v-for="(cert, index) in editedProfessionalInfo.certifications"
                      :key="index"
                      class="flex gap-2"
                    >
                      <input
                        v-model="cert.name"
                        type="text"
                        placeholder="نام گواهینامه"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                      <input
                        v-model="cert.issuingOrg"
                        type="text"
                        placeholder="سازمان صادرکننده"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                      <button
                        type="button"
                        class="rounded-md bg-red-600 px-3 text-white hover:bg-red-700"
                        @click="editedProfessionalInfo.certifications.splice(index, 1)"
                      >
                        <Icon name="ph:trash" class="size-5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      @click="editedProfessionalInfo.certifications.push({ name: '', issuingOrg: '', issueDate: '' })"
                    >
                      <Icon name="ph:plus" class="ml-2 size-4" />
                      <span>افزودن گواهینامه</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Specializations Edit Form -->
              <div v-else-if="editSection === 'specializations'" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  ویرایش تخصص‌ها
                </h3>
                
                <div class="space-y-3">
                  <div
                    v-for="(spec, index) in editedSpecializations"
                    :key="index"
                    class="flex gap-2"
                  >
                    <input
                      v-model="spec.name"
                      type="text"
                      placeholder="نام تخصص"
                      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                    <button
                      type="button"
                      class="rounded-md bg-red-600 px-3 text-white hover:bg-red-700"
                      @click="editedSpecializations.splice(index, 1)"
                    >
                      <Icon name="ph:trash" class="size-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    @click="editedSpecializations.push({ name: '' })"
                  >
                    <Icon name="ph:plus" class="ml-2 size-4" />
                    <span>افزودن تخصص</span>
                  </button>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  @click="cancelEditing"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  class="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>