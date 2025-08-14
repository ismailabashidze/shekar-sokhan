<script setup lang="ts">
import type { UserProfile, PersonalInfo, Demographics, Preferences, PrivacySettings, EducationInfo, OccupationInfo, LocationInfo } from '~/composables/profile'

definePageMeta({
  title: 'ویرایش پروفایل',
  preview: {
    title: 'Edit Profile',
    description: 'Edit personal information and profile settings',
    categories: ['profile'],
    src: '/img/screens/profile-edit-hammasir.png',
    srcDark: '/img/screens/profile-edit-hammasir-dark.png',
    order: 7,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Get route and query parameters
const route = useRoute()
const router = useRouter()

// Check admin role and userId from query params
const userRole = ref('')
const targetUserId = ref('')
const isAdminMode = ref(false)
const profileId = route.query.profile || '0'

// Mock profiles (same as profile view page)
const mockProfiles: UserProfile[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    personalInfo: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      firstName: 'سارا',
      lastName: 'محمدی',
      email: 'sara.mohammadi@example.com',
      phoneNumber: '09123456789',
      dateOfBirth: '1373-05-15',
      gender: 'FEMALE',
      profilePicture: '/img/avatars/sara.jpg'
    } as PersonalInfo,
    demographics: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      education: [
        {
          id: '123e4567-e89b-12d3-a456-426614174004',
          institution: 'دانشگاه تهران',
          degree: 'کارشناسی ارشد',
          field: 'روانشناسی',
          startDate: '1395-09-01',
          endDate: '1397-07-30',
          isCurrentlyEnrolled: false
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174005',
          institution: 'دانشگاه شهید بهشتی',
          degree: 'کارشناسی',
          field: 'علوم تربیتی',
          startDate: '1391-09-01',
          endDate: '1395-07-30',
          isCurrentlyEnrolled: false
        }
      ] as EducationInfo[],
      occupation: [
        {
          id: '123e4567-e89b-12d3-a456-426614174006',
          company: 'شرکت مشاوره آینده‌ساز',
          position: 'مشاور روانشناس',
          startDate: '1398-02-01',
          endDate: undefined,
          isCurrentJob: true
        }
      ] as OccupationInfo[],
      location: [
        {
          id: '123e4567-e89b-12d3-a456-426614174007',
          city: 'تهران',
          state: 'تهران',
          country: 'ایران',
          isPrimary: true
        }
      ] as LocationInfo[]
    } as Demographics,
    preferences: {
      id: '123e4567-e89b-12d3-a456-426614174008',
      communication: {
        email: true,
        sms: false
      }
    } as Preferences,
    privacySettings: {
      id: '123e4567-e89b-12d3-a456-426614174009',
      isProfileVisibleToCounselors: true,
      isProfileVisibleToOtherUsers: false,
      allowDataAnalysisForMatching: true
    } as PrivacySettings,
    status: 'ACTIVE',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-08-13T10:15:00Z'
  },
  {
    id: '234f5678-f90c-23e4-b567-537725285111',
    userId: '234f5678-f90c-23e4-b567-537725285222',
    personalInfo: {
      id: '234f5678-f90c-23e4-b567-537725285333',
      firstName: 'علی',
      lastName: 'احمدی',
      email: 'ali.ahmadi@gmail.com',
      phoneNumber: '09987654321',
      dateOfBirth: '1368-12-25',
      gender: 'MALE',
      profilePicture: '/img/avatars/ali.jpg'
    } as PersonalInfo,
    demographics: {
      id: '234f5678-f90c-23e4-b567-537725285444',
      education: [
        {
          id: '234f5678-f90c-23e4-b567-537725285555',
          institution: 'دانشگاه صنعتی شریف',
          degree: 'دکتری',
          field: 'مهندسی کامپیوتر',
          startDate: '1392-09-01',
          endDate: '1398-06-30',
          isCurrentlyEnrolled: false
        }
      ] as EducationInfo[],
      occupation: [
        {
          id: '234f5678-f90c-23e4-b567-537725285666',
          company: 'شرکت فناوری پارس',
          position: 'مدیر فنی',
          startDate: '1399-01-15',
          endDate: undefined,
          isCurrentJob: true
        },
        {
          id: '234f5678-f90c-23e4-b567-537725285777',
          company: 'استارت‌آپ تک‌نوین',
          position: 'توسعه‌دهنده ارشد',
          startDate: '1396-03-01',
          endDate: '1398-12-30',
          isCurrentJob: false
        }
      ] as OccupationInfo[],
      location: [
        {
          id: '234f5678-f90c-23e4-b567-537725285888',
          city: 'اصفهان',
          state: 'اصفهان',
          country: 'ایران',
          isPrimary: true
        }
      ] as LocationInfo[]
    } as Demographics,
    preferences: {
      id: '234f5678-f90c-23e4-b567-537725285999',
      communication: {
        email: true,
        sms: true
      }
    } as Preferences,
    privacySettings: {
      id: '234f5678-f90c-23e4-b567-537725286000',
      isProfileVisibleToCounselors: false,
      isProfileVisibleToOtherUsers: true,
      allowDataAnalysisForMatching: false
    } as PrivacySettings,
    status: 'ACTIVE',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-08-10T16:45:00Z'
  },
  {
    id: '345g6789-g01d-34f5-c678-648836396111',
    userId: '345g6789-g01d-34f5-c678-648836396222',
    personalInfo: {
      id: '345g6789-g01d-34f5-c678-648836396333',
      firstName: 'مریم',
      lastName: 'کریمی',
      email: 'maryam.karimi@yahoo.com',
      phoneNumber: '09356789012',
      dateOfBirth: '1375-08-10',
      gender: 'FEMALE',
      profilePicture: '/img/avatars/maryam.jpg'
    } as PersonalInfo,
    demographics: {
      id: '345g6789-g01d-34f5-c678-648836396444',
      education: [
        {
          id: '345g6789-g01d-34f5-c678-648836396555',
          institution: 'دانشگاه علوم پزشکی تهران',
          degree: 'کارشناسی',
          field: 'پرستاری',
          startDate: '1394-09-01',
          endDate: undefined,
          isCurrentlyEnrolled: true
        }
      ] as EducationInfo[],
      occupation: [
        {
          id: '345g6789-g01d-34f5-c678-648836396666',
          company: 'بیمارستان امام خمینی',
          position: 'پرستار',
          startDate: '1397-06-01',
          endDate: undefined,
          isCurrentJob: true
        }
      ] as OccupationInfo[],
      location: [
        {
          id: '345g6789-g01d-34f5-c678-648836396777',
          city: 'شیراز',
          state: 'فارس',
          country: 'ایران',
          isPrimary: true
        },
        {
          id: '345g6789-g01d-34f5-c678-648836396888',
          city: 'تهران',
          state: 'تهران',
          country: 'ایران',
          isPrimary: false
        }
      ] as LocationInfo[]
    } as Demographics,
    preferences: {
      id: '345g6789-g01d-34f5-c678-648836396999',
      communication: {
        email: false,
        sms: true
      }
    } as Preferences,
    privacySettings: {
      id: '345g6789-g01d-34f5-c678-648836397000',
      isProfileVisibleToCounselors: true,
      isProfileVisibleToOtherUsers: true,
      allowDataAnalysisForMatching: true
    } as PrivacySettings,
    status: 'PENDING_VERIFICATION',
    createdAt: '2024-06-15T09:10:00Z',
    updatedAt: '2024-08-12T11:30:00Z'
  },
  {
    id: '456h7890-h12e-45g6-d789-759947507111',
    userId: '456h7890-h12e-45g6-d789-759947507222',
    personalInfo: {
      id: '456h7890-h12e-45g6-d789-759947507333',
      firstName: 'محمد',
      lastName: 'رضایی',
      email: 'mohammad.rezaei@outlook.com',
      phoneNumber: '09198765432',
      dateOfBirth: '1355-03-20',
      gender: 'MALE',
      profilePicture: '/img/avatars/mohammad.jpg'
    } as PersonalInfo,
    demographics: {
      id: '456h7890-h12e-45g6-d789-759947507444',
      education: [
        {
          id: '456h7890-h12e-45g6-d789-759947507555',
          institution: 'دانشگاه فردوسی مشهد',
          degree: 'کارشناسی ارشد',
          field: 'مدیریت بازرگانی',
          startDate: '1378-09-01',
          endDate: '1380-07-30',
          isCurrentlyEnrolled: false
        }
      ] as EducationInfo[],
      occupation: [
        {
          id: '456h7890-h12e-45g6-d789-759947507666',
          company: 'شرکت پتروشیمی جم',
          position: 'مدیر عامل',
          startDate: '1385-05-01',
          endDate: undefined,
          isCurrentJob: true
        }
      ] as OccupationInfo[],
      location: [
        {
          id: '456h7890-h12e-45g6-d789-759947507777',
          city: 'مشهد',
          state: 'خراسان رضوی',
          country: 'ایران',
          isPrimary: true
        }
      ] as LocationInfo[]
    } as Demographics,
    preferences: {
      id: '456h7890-h12e-45g6-d789-759947507888',
      communication: {
        email: true,
        sms: true
      }
    } as Preferences,
    privacySettings: {
      id: '456h7890-h12e-45g6-d789-759947507999',
      isProfileVisibleToCounselors: false,
      isProfileVisibleToOtherUsers: false,
      allowDataAnalysisForMatching: false
    } as PrivacySettings,
    status: 'SUSPENDED',
    createdAt: '2023-11-20T12:45:00Z',
    updatedAt: '2024-07-25T14:20:00Z'
  },
  {
    id: '567i8901-i23f-56h7-e890-860058618111',
    userId: '567i8901-i23f-56h7-e890-860058618222',
    personalInfo: {
      id: '567i8901-i23f-56h7-e890-860058618333',
      firstName: 'فاطمه',
      lastName: 'حسینی',
      email: 'fateme.hosseini@proton.me',
      phoneNumber: '09301234567',
      dateOfBirth: '1385-11-05',
      gender: 'FEMALE',
      profilePicture: '/img/avatars/fateme.jpg'
    } as PersonalInfo,
    demographics: {
      id: '567i8901-i23f-56h7-e890-860058618444',
      education: [
        {
          id: '567i8901-i23f-56h7-e890-860058618555',
          institution: 'دانشگاه هنر تهران',
          degree: 'کارشناسی',
          field: 'طراحی گرافیک',
          startDate: '1404-09-01',
          endDate: undefined,
          isCurrentlyEnrolled: true
        }
      ] as EducationInfo[],
      occupation: [
        {
          id: '567i8901-i23f-56h7-e890-860058618666',
          company: 'استودیو کریتیو',
          position: 'طراح گرافیک',
          startDate: '1402-08-15',
          endDate: undefined,
          isCurrentJob: true
        }
      ] as OccupationInfo[],
      location: [
        {
          id: '567i8901-i23f-56h7-e890-860058618777',
          city: 'تبریز',
          state: 'آذربایجان شرقی',
          country: 'ایران',
          isPrimary: true
        }
      ] as LocationInfo[]
    } as Demographics,
    preferences: {
      id: '567i8901-i23f-56h7-e890-860058618888',
      communication: {
        email: true,
        sms: false
      }
    } as Preferences,
    privacySettings: {
      id: '567i8901-i23f-56h7-e890-860058618999',
      isProfileVisibleToCounselors: true,
      isProfileVisibleToOtherUsers: false,
      allowDataAnalysisForMatching: true
    } as PrivacySettings,
    status: 'DEACTIVATED',
    createdAt: '2024-08-01T07:15:00Z',
    updatedAt: '2024-08-13T09:00:00Z'
  }
]

// Profile selection and editing logic
const selectedProfileIndex = ref(parseInt(profileId as string) || 0)
const currentProfile = ref<UserProfile | null>(null)
const isLoading = ref(false)
const error = ref('')

// Function to fetch profile by userId (simulated API call)
async function fetchProfileByUserId(userId: string): Promise<UserProfile | null> {
  isLoading.value = true
  error.value = ''
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find profile by userId in mock data
    const profile = mockProfiles.find(p => p.userId === userId)
    
    if (!profile) {
      throw new Error(`Profile with userId ${userId} not found`)
    }
    
    return profile
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'خطا در بارگذاری پروفایل'
    return null
  } finally {
    isLoading.value = false
  }
}

// Get the profile to edit
const profileToEdit = computed(() => {
  if (isAdminMode.value && currentProfile.value) {
    return currentProfile.value
  }
  return mockProfiles[selectedProfileIndex.value]
})

const editForm = ref<UserProfile>(JSON.parse(JSON.stringify(profileToEdit.value)))

// Initialize role and user data
onMounted(async () => {
  // Get role from localStorage
  if (process.client) {
    userRole.value = localStorage.getItem('role') || ''
    isAdminMode.value = userRole.value === 'admin'
    
    // Get userId from query params if admin
    if (isAdminMode.value && route.query.userId) {
      targetUserId.value = route.query.userId as string
      
      // Fetch the specific user's profile
      const profile = await fetchProfileByUserId(targetUserId.value)
      if (profile) {
        currentProfile.value = profile
        editForm.value = JSON.parse(JSON.stringify(profile))
      }
    } else {
      // Regular mode - use profile selector
      editForm.value = JSON.parse(JSON.stringify(mockProfiles[selectedProfileIndex.value]))
    }
  }
})

// Profile selector options
const profileOptions = computed(() => 
  mockProfiles.map((profile, index) => ({
    value: index,
    label: `${profile.personalInfo?.firstName} ${profile.personalInfo?.lastName} - ${profile.status === 'ACTIVE' ? 'فعال' : 
           profile.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
           profile.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال'}`,
    status: profile.status
  }))
)

// Watch profile selection changes
watch(selectedProfileIndex, (newIndex) => {
  editForm.value = JSON.parse(JSON.stringify(mockProfiles[newIndex]))
})

// Form validation and state
const formErrors = ref<Record<string, string>>({})
const isSaving = ref(false)
const showAllSections = ref(true) // Show all sections expanded by default

// Add/Remove functions for arrays
function addEducation() {
  if (!editForm.value.demographics?.education) {
    editForm.value.demographics!.education = []
  }
  editForm.value.demographics!.education!.push({
    id: Date.now().toString(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrentlyEnrolled: false
  })
}

function removeEducation(index: number) {
  editForm.value.demographics?.education?.splice(index, 1)
}

function addOccupation() {
  if (!editForm.value.demographics?.occupation) {
    editForm.value.demographics!.occupation = []
  }
  editForm.value.demographics!.occupation!.push({
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false
  })
}

function removeOccupation(index: number) {
  editForm.value.demographics?.occupation?.splice(index, 1)
}

function addLocation() {
  if (!editForm.value.demographics?.location) {
    editForm.value.demographics!.location = []
  }
  editForm.value.demographics!.location!.push({
    id: Date.now().toString(),
    city: '',
    state: '',
    country: 'ایران',
    isPrimary: false
  })
}

function removeLocation(index: number) {
  editForm.value.demographics?.location?.splice(index, 1)
}

// Save function
async function saveProfile() {
  isSaving.value = true
  formErrors.value = {}
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update the mock profile (in real app, this would be API call)
    mockProfiles[selectedProfileIndex.value] = JSON.parse(JSON.stringify(editForm.value))
    mockProfiles[selectedProfileIndex.value].updatedAt = new Date().toISOString()
    
    // Show success message
    alert('پروفایل با موفقیت ذخیره شد!')
    
  } catch (error) {
    formErrors.value.general = 'خطا در ذخیره اطلاعات. لطفاً مجدداً تلاش کنید.'
  } finally {
    isSaving.value = false
  }
}

// Cancel and return to profile view
function cancelEdit() {
  if (isAdminMode.value && targetUserId.value) {
    // Admin mode - return to admin profiles list
    router.push('/hammasir/admin/profiles')
  } else {
    // Regular mode - return to profile view
    router.push(`/hammasir/profile?profile=${selectedProfileIndex.value}`)
  }
}

// Form sections
const sections = [
  { id: 'personal', name: 'اطلاعات شخصی', icon: 'ph:user-fill' },
  { id: 'education', name: 'تحصیلات', icon: 'ph:graduation-cap-fill' },
  { id: 'occupation', name: 'شغل', icon: 'ph:briefcase-fill' },
  { id: 'location', name: 'موقعیت مکانی', icon: 'ph:map-pin-fill' },
  { id: 'preferences', name: 'تنظیمات ارتباطات', icon: 'ph:chat-circle-fill' },
  { id: 'privacy', name: 'حریم خصوصی', icon: 'ph:shield-check-fill' }
]
</script>

<template>
  <div>
    <!-- Profile Selector (only show in non-admin mode) -->
    <div v-if="!isAdminMode" class="fixed top-4 left-4 z-50">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-80">
        <div class="flex items-center mb-3">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center me-3">
            <Icon name="ph:pencil-simple-fill" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-gray-800 dark:text-white">ویرایش پروفایل</span>
        </div>
        
        <select 
          v-model="selectedProfileIndex"
          class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        >
          <option 
            v-for="option in profileOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Admin Mode Indicator -->
    <div v-if="isAdminMode" class="fixed top-4 left-4 z-50">
      <div class="bg-gradient-to-r from-red-500/90 to-pink-600/90 backdrop-blur-md rounded-2xl shadow-xl border border-red-300/50 p-4 min-w-80">
        <div class="flex items-center mb-3">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center me-3">
            <Icon name="ph:crown-fill" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white">حالت مدیریت - ویرایش پروفایل کاربر</span>
        </div>
        
        <div class="bg-white/10 rounded-xl p-3">
          <div class="text-white/80 text-sm mb-1">شناسه کاربر:</div>
          <div class="text-white font-mono font-bold">{{ targetUserId }}</div>
        </div>
        
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full me-2" :class="{
              'bg-green-400': editForm.status === 'ACTIVE',
              'bg-yellow-400': editForm.status === 'PENDING_VERIFICATION',  
              'bg-red-400': editForm.status === 'SUSPENDED',
              'bg-gray-400': editForm.status === 'DEACTIVATED'
            }"></div>
            <span class="text-sm font-medium text-white/80">
              وضعیت: {{ editForm.status === 'ACTIVE' ? 'فعال' : 
                        editForm.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
                        editForm.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال' }}
            </span>
          </div>
          <BaseButton 
            @click="router.push('/hammasir/admin/profiles')"
            size="sm"
            class="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Icon name="ph:arrow-right" class="w-4 h-4 me-1" />
            بازگشت
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:spinner" class="w-8 h-8 text-white animate-spin" />
          </div>
          <div class="font-bold text-gray-800 dark:text-white mb-2">در حال بارگذاری پروفایل...</div>
          <div class="text-gray-600 dark:text-gray-400">لطفاً منتظر بمانید</div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-red-200/50 dark:border-red-700/50 max-w-md">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:warning" class="w-8 h-8 text-white" />
          </div>
          <div class="font-bold text-gray-800 dark:text-white mb-2">خطا در بارگذاری</div>
          <div class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</div>
          <div class="flex gap-3 justify-center">
            <BaseButton 
              @click="error = ''"
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700"
            >
              بستن
            </BaseButton>
            <BaseButton 
              @click="router.push('/hammasir/admin/profiles')"
              size="sm"
              class="bg-red-500 hover:bg-red-600 text-white"
            >
              بازگشت به فهرست
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 shadow-2xl shadow-emerald-500/25 mb-12">
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/8 via-transparent to-transparent"></div>
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-emerald-400/15 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>
      
      <div class="relative px-8 lg:px-12 py-20">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div class="relative group">
              <div class="w-32 h-32 bg-gradient-to-br from-white/25 to-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-all duration-500">
                <Icon name="ph:pencil-circle-fill" class="w-20 h-20 text-white/90 drop-shadow-xl" />
              </div>
              <div class="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                <Icon name="ph:check-bold" class="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <div class="flex items-center mb-4">
                  <div class="px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30 me-4">
                    <span class="text-emerald-200 font-bold text-sm">✏️ حالت ویرایش</span>
                  </div>
                  <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <span class="text-white/80 font-medium text-sm">همه فیلدها قابل ویرایش هستند</span>
                  </div>
                </div>
                <BaseHeading as="h1" class="text-white drop-shadow-2xl mb-3 text-4xl lg:text-5xl font-black tracking-tight">
                  <span class="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                    ویرایش پروفایل {{ editForm.personalInfo?.firstName }} {{ editForm.personalInfo?.lastName }}
                  </span>
                </BaseHeading>
                <BaseParagraph class="text-white/80 mb-6 text-xl font-medium">
                  <span>ویرایش اطلاعات شخصی و تنظیمات حساب کاربری</span>
                </BaseParagraph>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <BaseButton 
              @click="cancelEdit"
              class="group w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl flex items-center justify-center"
            >
              <Icon name="ph:x-bold" class="w-6 h-6" />
            </BaseButton>
            <BaseButton 
              @click="saveProfile"
              :disabled="isSaving"
              class="group w-14 h-14 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 rounded-2xl flex items-center justify-center"
            >
              <Icon :name="isSaving ? 'ph:spinner' : 'ph:floppy-disk-bold'" :class="{ 'animate-spin': isSaving }" class="w-6 h-6" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Form - All Sections Visible -->
    <div class="space-y-8">
        
        <!-- Personal Information -->
        <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-blue-200/60 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <!-- Edit Mode Indicator -->
          <div class="absolute -top-3 -right-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Icon name="ph:pencil-simple-fill" class="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div class="flex items-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
              <Icon name="ph:user-fill" class="w-8 h-8 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                <span>اطلاعات شخصی</span>
                <span class="text-blue-500 text-lg ms-2">✏️</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>ویرایش اطلاعات پایه و هویتی</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">نام</label>
              <input
                v-model="editForm.personalInfo!.firstName"
                type="text"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="نام خود را وارد کنید"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">نام خانوادگی</label>
              <input
                v-model="editForm.personalInfo!.lastName"
                type="text"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">ایمیل</label>
              <input
                v-model="editForm.personalInfo!.email"
                type="email"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="example@email.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">شماره تلفن</label>
              <input
                v-model="editForm.personalInfo!.phoneNumber"
                type="tel"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="09123456789"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">تاریخ تولد</label>
              <input
                v-model="editForm.personalInfo!.dateOfBirth"
                type="text"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="1373-05-15"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">جنسیت</label>
              <select
                v-model="editForm.personalInfo!.gender"
                class="w-full px-4 py-4 border-2 border-blue-200 dark:border-gray-600 rounded-2xl bg-blue-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <option value="MALE">مرد</option>
                <option value="FEMALE">زن</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
                <Icon name="ph:graduation-cap-fill" class="w-8 h-8 text-white" />
              </div>
              <div>
                <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                  <span>سوابق تحصیلی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  <span>مدارک تحصیلی و تجربیات دانشگاهی</span>
                </BaseParagraph>
              </div>
            </div>
            
            <BaseButton
              @click="addEducation"
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon name="ph:plus-bold" class="w-5 h-5 me-2" />
              <span>افزودن مدرک</span>
            </BaseButton>
          </div>
          
          <div class="space-y-6">
            <div
              v-for="(education, index) in editForm.demographics?.education"
              :key="education.id"
              class="p-6 border-2 border-green-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">مدرک تحصیلی {{ index + 1 }}</h3>
                <BaseButton
                  @click="removeEducation(index)"
                  variant="outline"
                  class="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Icon name="ph:trash-bold" class="w-4 h-4" />
                </BaseButton>
              </div>
              
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نام موسسه</label>
                  <input
                    v-model="education.institution"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl bg-green-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:border-green-400 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="دانشگاه تهران"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">مقطع تحصیلی</label>
                  <input
                    v-model="education.degree"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl bg-green-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:border-green-400 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="کارشناسی ارشد"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رشته تحصیلی</label>
                  <input
                    v-model="education.field"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl bg-green-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:border-green-400 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="روانشناسی"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاریخ شروع</label>
                  <input
                    v-model="education.startDate"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-green-200 dark:border-gray-600 rounded-xl bg-green-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:border-green-400 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="1395-09-01"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاریخ پایان</label>
                  <input
                    v-model="education.endDate"
                    type="text"
                    :disabled="education.isCurrentlyEnrolled"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="1397-07-30"
                  />
                </div>
                
                <div class="flex items-center">
                  <input
                    v-model="education.isCurrentlyEnrolled"
                    type="checkbox"
                    class="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 me-3"
                  />
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">در حال تحصیل هستم</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Occupation -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
                <Icon name="ph:briefcase-fill" class="w-8 h-8 text-white" />
              </div>
              <div>
                <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                  <span>سوابق شغلی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  <span>تجربیات حرفه‌ای و مشاغل</span>
                </BaseParagraph>
              </div>
            </div>
            
            <BaseButton
              @click="addOccupation"
              class="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon name="ph:plus-bold" class="w-5 h-5 me-2" />
              <span>افزودن شغل</span>
            </BaseButton>
          </div>
          
          <div class="space-y-6">
            <div
              v-for="(job, index) in editForm.demographics?.occupation"
              :key="job.id"
              class="p-6 border-2 border-orange-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-orange-50/30 to-amber-50/30 dark:from-orange-900/10 dark:to-amber-900/10"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">شغل {{ index + 1 }}</h3>
                <BaseButton
                  @click="removeOccupation(index)"
                  variant="outline"
                  class="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Icon name="ph:trash-bold" class="w-4 h-4" />
                </BaseButton>
              </div>
              
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نام شرکت</label>
                  <input
                    v-model="job.company"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-orange-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-400 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="شرکت مشاوره آینده‌ساز"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">سمت شغلی</label>
                  <input
                    v-model="job.position"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-orange-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-400 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="مشاور روانشناس"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاریخ شروع</label>
                  <input
                    v-model="job.startDate"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-orange-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-400 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="1398-02-01"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاریخ پایان</label>
                  <input
                    v-model="job.endDate"
                    type="text"
                    :disabled="job.isCurrentJob"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="1400-02-01"
                  />
                </div>
                
                <div class="flex items-center sm:col-span-2">
                  <input
                    v-model="job.isCurrentJob"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 me-3"
                  />
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">این شغل فعلی من است</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
                <Icon name="ph:map-pin-fill" class="w-8 h-8 text-white" />
              </div>
              <div>
                <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                  <span>اطلاعات مکانی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  <span>آدرس‌ها و مکان‌های مرتبط</span>
                </BaseParagraph>
              </div>
            </div>
            
            <BaseButton
              @click="addLocation"
              class="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon name="ph:plus-bold" class="w-5 h-5 me-2" />
              <span>افزودن آدرس</span>
            </BaseButton>
          </div>
          
          <div class="space-y-6">
            <div
              v-for="(location, index) in editForm.demographics?.location"
              :key="location.id"
              class="p-6 border-2 border-purple-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-purple-50/30 to-violet-50/30 dark:from-purple-900/10 dark:to-violet-900/10"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">آدرس {{ index + 1 }}</h3>
                <BaseButton
                  @click="removeLocation(index)"
                  variant="outline"
                  class="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Icon name="ph:trash-bold" class="w-4 h-4" />
                </BaseButton>
              </div>
              
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">شهر</label>
                  <input
                    v-model="location.city"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-purple-200 dark:border-gray-600 rounded-xl bg-purple-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-400 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="تهران"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">استان</label>
                  <input
                    v-model="location.state"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-purple-200 dark:border-gray-600 rounded-xl bg-purple-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-400 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="تهران"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">کشور</label>
                  <input
                    v-model="location.country"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-purple-200 dark:border-gray-600 rounded-xl bg-purple-50/50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-400 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="ایران"
                  />
                </div>
                
                <div class="flex items-center">
                  <input
                    v-model="location.isPrimary"
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 me-3"
                  />
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">آدرس اصلی</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Communication Preferences -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-teal-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300">
          <div class="flex items-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
              <Icon name="ph:chat-circle-fill" class="w-8 h-8 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                <span>تنظیمات ارتباطات</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>ترجیحات دریافت پیام و اعلان‌ها</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between p-6 border-2 border-teal-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:envelope-fill" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white text-lg block mb-1">اعلان‌های ایمیل</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق ایمیل</span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  v-model="editForm.preferences!.communication!.email"
                  type="checkbox"
                  class="w-6 h-6 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div class="flex items-center justify-between p-6 border-2 border-teal-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:device-mobile-fill" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white text-lg block mb-1">اعلان‌های پیامکی</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق پیامک</span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  v-model="editForm.preferences!.communication!.sms"
                  type="checkbox"
                  class="w-6 h-6 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-red-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
          <div class="flex items-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
              <Icon name="ph:shield-check-fill" class="w-8 h-8 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                <span>تنظیمات حریم خصوصی</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>کنترل دسترسی و نمایش اطلاعات</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between p-6 border-2 border-red-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:users-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white text-lg block mb-1">نمایش پروفایل برای مشاوران</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا مشاوران بتوانند پروفایل شما را مشاهده کنند؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  v-model="editForm.privacySettings!.isProfileVisibleToCounselors"
                  type="checkbox"
                  class="w-6 h-6 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
              </div>
            </div>
            
            <div class="flex items-center justify-between p-6 border-2 border-red-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:user-list-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white text-lg block mb-1">نمایش پروفایل برای سایر کاربران</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا کاربران دیگر بتوانند پروفایل شما را مشاهده کنند؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  v-model="editForm.privacySettings!.isProfileVisibleToOtherUsers"
                  type="checkbox"
                  class="w-6 h-6 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
              </div>
            </div>
            
            <div class="flex items-center justify-between p-6 border-2 border-red-200 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:chart-line-up-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white text-lg block mb-1">تحلیل داده‌ها برای انطباق‌یابی</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا اجازه تحلیل داده‌ها برای بهبود انطباق‌یابی را می‌دهید؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  v-model="editForm.privacySettings!.allowDataAnalysisForMatching"
                  type="checkbox"
                  class="w-6 h-6 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

    </div>

    <!-- Fixed Save Bar -->
    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
        <div class="flex items-center gap-4">
          <BaseButton 
            @click="cancelEdit"
            class="w-14 h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl flex items-center justify-center hover:scale-105 transition-all duration-300"
          >
            <Icon name="ph:x-bold" class="w-6 h-6" />
          </BaseButton>
          
          <BaseButton 
            @click="saveProfile"
            :disabled="isSaving"
            class="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl flex items-center justify-center hover:scale-105"
          >
            <Icon :name="isSaving ? 'ph:spinner' : 'ph:floppy-disk-bold'" :class="{ 'animate-spin': isSaving }" class="w-6 h-6" />
          </BaseButton>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>