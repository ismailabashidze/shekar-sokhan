<script setup lang="ts">
import type { UserProfile, PersonalInfo, Demographics, Preferences, PrivacySettings, EducationInfo, OccupationInfo, LocationInfo } from '~/composables/profile'

definePageMeta({
  title: 'پروفایل شخصی',
  preview: {
    title: 'Personal Profile',
    description: 'Personal information and assessment results',
    categories: ['profile'],
    src: '/img/screens/profile-hammasir.png',
    srcDark: '/img/screens/profile-hammasir-dark.png',
    order: 6,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Use profile composable
const { updateUserStatus } = useProfile()

// Get route and query parameters
const route = useRoute()
const router = useRouter()

// Check admin role and userId from query params
const userRole = ref('')
const targetUserId = ref('')
const isAdminMode = ref(false)

// Initialize role and user data
onMounted(() => {
  // Get role from localStorage
  if (process.client) {
    userRole.value = localStorage.getItem('role') || ''
    isAdminMode.value = userRole.value === 'admin'
    
    // Get userId from query params if admin
    if (isAdminMode.value && route.query.userId) {
      targetUserId.value = route.query.userId as string
    }
  }
})

// Multiple mock user profiles for testing different scenarios
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

// Profile selection and fetching logic
const selectedProfileIndex = ref(0)
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

// Profile logic
const userProfile = computed(() => {
  if (isAdminMode.value && currentProfile.value) {
    return currentProfile.value
  }
  return mockProfiles[selectedProfileIndex.value]
})

// Profile selector options (only for non-admin mode)
const profileOptions = computed(() => 
  mockProfiles.map((profile, index) => ({
    value: index,
    label: `${profile.personalInfo?.firstName} ${profile.personalInfo?.lastName} - ${profile.status === 'ACTIVE' ? 'فعال' : 
           profile.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
           profile.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال'}`,
    status: profile.status
  }))
)

// Watch for admin mode changes and fetch profile
watch([isAdminMode, targetUserId], async ([adminMode, userId]) => {
  if (adminMode && userId) {
    const profile = await fetchProfileByUserId(userId)
    if (profile) {
      currentProfile.value = profile
    }
  }
}, { immediate: false })

// Initialize profile data
onMounted(async () => {
  // If admin mode and userId provided, fetch that profile
  if (isAdminMode.value && targetUserId.value) {
    const profile = await fetchProfileByUserId(targetUserId.value)
    if (profile) {
      currentProfile.value = profile
    }
  }
  // Otherwise use profile from query param or default
  else if (route.query.profile) {
    selectedProfileIndex.value = parseInt(route.query.profile as string) || 0
  }
})


// Edit state
const editingSection = ref(null)
const editForm = ref({})

// Status change modal state
const showStatusModal = ref(false)
const isUpdatingStatus = ref(false)
const statusUpdateError = ref('')

// Status options for the modal
const statusOptions = [
  { value: 'ACTIVE', label: 'فعال', description: 'کاربر می‌تواند از تمام امکانات استفاده کند', color: 'success', icon: 'ph:check-circle-fill' },
  { value: 'SUSPENDED', label: 'معلق', description: 'دسترسی کاربر به طور موقت محدود شده است', color: 'danger', icon: 'ph:pause-circle-fill' },
  { value: 'DEACTIVATED', label: 'غیرفعال', description: 'حساب کاربری غیرفعال شده است', color: 'muted', icon: 'ph:x-circle-fill' },
  { value: 'PENDING_VERIFICATION', label: 'در انتظار تأیید', description: 'حساب کاربری نیاز به تأیید دارد', color: 'warning', icon: 'ph:clock-fill' }
]

// Get current status info
const currentStatusInfo = computed(() => {
  return statusOptions.find(option => option.value === userProfile.value.status) || statusOptions[0]
})

// Get available status actions (exclude current status)
const availableStatusActions = computed(() => {
  return statusOptions.filter(option => option.value !== userProfile.value.status)
})


function startEditing(section: string) {
  editingSection.value = section
  if (section === 'demographics') {
    editForm.value = { ...userProfile.value.personalInfo }
  }
}

function cancelEditing() {
  editingSection.value = null
  editForm.value = {}
}

function saveSection() {
  if (editingSection.value === 'demographics') {
    if (userProfile.value.personalInfo) {
      userProfile.value.personalInfo = { ...editForm.value }
    }
    userProfile.value.updatedAt = new Date().toISOString()
  }
  editingSection.value = null
  editForm.value = {}
}

// Status change functions
function openStatusModal() {
  showStatusModal.value = true
  statusUpdateError.value = ''
}

function closeStatusModal() {
  showStatusModal.value = false
  statusUpdateError.value = ''
  isUpdatingStatus.value = false
}

async function changeUserStatus(newStatus: UserProfile['status']) {
  if (!isAdminMode.value || !targetUserId.value) {
    return
  }

  isUpdatingStatus.value = true
  statusUpdateError.value = ''

  try {
    // Call the API function from profile.ts
    const updatedProfile = await updateUserStatus(targetUserId.value, newStatus)
    
    // Update the current profile with the new status
    if (currentProfile.value) {
      currentProfile.value.status = updatedProfile.status
      currentProfile.value.updatedAt = updatedProfile.updatedAt
    }
    
    // Update the mock data as well for consistency
    const mockIndex = mockProfiles.findIndex(p => p.userId === targetUserId.value)
    if (mockIndex !== -1) {
      mockProfiles[mockIndex].status = updatedProfile.status
      mockProfiles[mockIndex].updatedAt = updatedProfile.updatedAt
    }
    
    closeStatusModal()
    
    // Show success message
    const statusLabel = statusOptions.find(opt => opt.value === newStatus)?.label || newStatus
    alert(`وضعیت کاربر با موفقیت به "${statusLabel}" تغییر یافت.`)
    
  } catch (err) {
    statusUpdateError.value = err instanceof Error ? err.message : 'خطا در بروزرسانی وضعیت کاربر'
  } finally {
    isUpdatingStatus.value = false
  }
}

</script>

<template>
  <div>
    <!-- Profile Selector (only show in non-admin mode) -->
    <div v-if="!isAdminMode" class="fixed top-4 left-4 z-50">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-80">
        <div class="flex items-center mb-3">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center me-3">
            <Icon name="ph:user-switch-fill" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-gray-800 dark:text-white">انتخاب پروفایل تست</span>
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
        
        <!-- Quick status indicator -->
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full me-2" :class="{
              'bg-green-500': userProfile.status === 'ACTIVE',
              'bg-yellow-500': userProfile.status === 'PENDING_VERIFICATION',  
              'bg-red-500': userProfile.status === 'SUSPENDED',
              'bg-gray-500': userProfile.status === 'DEACTIVATED'
            }"></div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              وضعیت: {{ userProfile.status === 'ACTIVE' ? 'فعال' : 
                        userProfile.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
                        userProfile.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال' }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ mockProfiles.length }} پروفایل
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Mode Indicator -->
    <div v-if="isAdminMode" class="fixed top-4 left-4 z-50">
      <div class="bg-gradient-to-r from-red-500/90 to-pink-600/90 backdrop-blur-md rounded-2xl shadow-xl border border-red-300/50 p-4 min-w-80">
        <div class="flex items-center mb-3">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center me-3">
            <Icon name="ph:crown-fill" class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white">حالت مدیریت - مشاهده پروفایل کاربر</span>
        </div>
        
        <div class="bg-white/10 rounded-xl p-3">
          <div class="text-white/80 text-sm mb-1">شناسه کاربر:</div>
          <div class="text-white font-mono font-bold">{{ targetUserId }}</div>
        </div>
        
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full me-2" :class="{
              'bg-green-400': userProfile.status === 'ACTIVE',
              'bg-yellow-400': userProfile.status === 'PENDING_VERIFICATION',  
              'bg-red-400': userProfile.status === 'SUSPENDED',
              'bg-gray-400': userProfile.status === 'DEACTIVATED'
            }"></div>
            <span class="text-sm font-medium text-white/80">
              وضعیت: {{ userProfile.status === 'ACTIVE' ? 'فعال' : 
                        userProfile.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
                        userProfile.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال' }}
            </span>
          </div>
          <div class="flex gap-2">
            <BaseButton 
              @click="openStatusModal"
              size="sm"
              class="bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-500 hover:to-red-500 text-white border-white/30"
            >
              <Icon name="ph:gear-six-fill" class="w-4 h-4 me-1" />
              تغییر وضعیت
            </BaseButton>
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
    <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 shadow-2xl shadow-purple-500/25 mb-12">
      <!-- Advanced decorative patterns -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/8 via-transparent to-transparent"></div>
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400/15 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 right-1/4 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl"></div>
        <!-- Grid pattern overlay -->
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>
      
      <div class="relative px-8 lg:px-12 py-20">
        <!-- Profile Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div class="relative group">
              <!-- Main avatar -->
              <div class="w-32 h-32 bg-gradient-to-br from-white/25 to-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-all duration-500 group-hover:shadow-white/20">
                <Icon name="ph:user-circle-fill" class="w-20 h-20 text-white/90 drop-shadow-xl" />
              </div>
              <!-- Status indicators -->
              <div class="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                <Icon name="ph:check-bold" class="w-6 h-6 text-white" />
              </div>
              <div class="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg animate-pulse">
                <Icon name="ph:crown-fill" class="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <BaseHeading as="h1" class="text-white drop-shadow-2xl mb-3 text-4xl lg:text-5xl font-black tracking-tight">
                  <span class="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                    {{ userProfile.personalInfo?.firstName }} {{ userProfile.personalInfo?.lastName }}
                  </span>
                </BaseHeading>
                <BaseParagraph class="text-white/80 mb-6 text-xl font-medium">
                  <span>پروفایل شخصی و اطلاعات کاربری</span>
                </BaseParagraph>
              </div>
              
              <!-- Enhanced info badges -->
              <div class="flex flex-wrap items-center gap-4">
                <div class="group flex items-center bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div class="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center me-3">
                    <Icon name="ph:map-pin-fill" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-white/60 text-xs font-medium">محل سکونت</div>
                    <div class="text-white font-bold">{{ userProfile.demographics?.location?.[0]?.city }}</div>
                  </div>
                </div>
                
                <div class="group flex items-center bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div class="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center me-3">
                    <Icon name="ph:graduation-cap-fill" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-white/60 text-xs font-medium">تحصیلات</div>
                    <div class="text-white font-bold">{{ userProfile.demographics?.education?.[0]?.degree }}</div>
                  </div>
                </div>
                
                <div class="group flex items-center bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div class="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center me-3">
                    <Icon name="ph:briefcase-fill" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-white/60 text-xs font-medium">شغل</div>
                    <div class="text-white font-bold">{{ userProfile.demographics?.occupation?.[0]?.position }}</div>
                  </div>
                </div>
                
                <div v-if="userProfile.status === 'ACTIVE'" class="group flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 backdrop-blur-md rounded-2xl px-5 py-3 border border-green-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                  <div class="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-xl flex items-center justify-center me-3">
                    <Icon name="ph:shield-check-fill" class="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <div class="text-green-200/80 text-xs font-medium">وضعیت</div>
                    <div class="text-green-200 font-bold">تأیید شده</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <BaseButton 
              @click="navigateTo(`/hammasir/profile/edit?profile=${selectedProfileIndex}`)"
              class="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon name="ph:pencil-simple" class="w-5 h-5 me-2" />
              <span>ویرایش پروفایل</span>
            </BaseButton>
            <BaseButton class="bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105">
              <Icon name="ph:share-network" class="w-5 h-5 me-2" />
              <span>اشتراک‌گذاری</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>


    <!-- Profile Sections - Multi-Column Layout -->
    <div class="grid lg:grid-cols-12 gap-8">
      
      <!-- Left Column (8 columns) -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Personal Information -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-blue-500/10 border border-blue-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
                <Icon name="ph:user-fill" class="w-8 h-8 text-white" />
              </div>
              <div>
                <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                  <span>اطلاعات شخصی</span>
                </BaseHeading>
                <div class="flex items-center gap-3">
                  <div class="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                    <Icon name="ph:check-circle-fill" class="w-4 h-4 me-1" />
                    <span class="text-sm font-medium">تکمیل شده</span>
                  </div>
                  <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">آخرین بروزرسانی: {{ new Date(userProfile.updatedAt || '').toLocaleDateString('fa-IR') }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div v-if="userProfile.status === 'ACTIVE'" class="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                <Icon name="ph:shield-check-fill" class="w-5 h-5 me-2" />
                <span class="font-medium">تأیید شده</span>
              </div>
              
              <BaseButton
                v-if="editingSection !== 'demographics'"
                size="sm"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                @click="startEditing('demographics')"
              >
                <Icon name="ph:pencil-simple" class="w-4 h-4 me-2" />
                <span>ویرایش</span>
              </BaseButton>
            </div>
          </div>
          
          <div v-if="editingSection === 'demographics'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
              <span>ویرایش اطلاعات شخصی</span>
            </BaseHeading>
            
            <div class="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام</label>
                <input
                  v-model="editForm.firstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام خانوادگی</label>
                <input
                  v-model="editForm.lastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره تلفن</label>
                <input
                  v-model="editForm.phoneNumber"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div class="flex gap-3">
              <BaseButton
                class="bg-green-500 text-white hover:bg-green-600"
                @click="saveSection"
              >
                <Icon name="ph:check" class="w-4 h-4 me-2" />
                <span>ذخیره</span>
              </BaseButton>
              <BaseButton
                variant="outline"
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
                @click="cancelEditing"
              >
                <span>انصراف</span>
              </BaseButton>
            </div>
          </div>

          <div v-else>
            <!-- Personal Information Grid -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Name Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/30 border border-blue-200/60 dark:border-blue-700/40 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:user-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-blue-700 dark:text-blue-300">نام کامل</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-xl leading-tight">
                    {{ userProfile.personalInfo?.firstName }} {{ userProfile.personalInfo?.lastName }}
                  </div>
                </div>
              </div>
              
              <!-- Gender Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/30 border border-purple-200/60 dark:border-purple-700/40 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center me-2">
                      <Icon :name="userProfile.personalInfo?.gender === 'FEMALE' ? 'ph:gender-female-fill' : 'ph:gender-male-fill'" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-purple-700 dark:text-purple-300">جنسیت</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-xl">
                    {{ userProfile.personalInfo?.gender === 'FEMALE' ? 'زن' : 'مرد' }}
                  </div>
                </div>
              </div>
              
              <!-- Birth Date Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/30 border border-green-200/60 dark:border-green-700/40 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:calendar-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-green-700 dark:text-green-300">تاریخ تولد</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-xl">{{ userProfile.personalInfo?.dateOfBirth }}</div>
                </div>
              </div>
              
              <!-- Email Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/30 border border-orange-200/60 dark:border-orange-700/40 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:envelope-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-orange-700 dark:text-orange-300">ایمیل</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-lg break-all">{{ userProfile.personalInfo?.email }}</div>
                </div>
              </div>
              
              <!-- Phone Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-teal-900/30 border border-teal-200/60 dark:border-teal-700/40 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:phone-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-teal-700 dark:text-teal-300">شماره تلفن</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-xl">{{ userProfile.personalInfo?.phoneNumber }}</div>
                </div>
              </div>
              
              <!-- Status Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 dark:from-rose-900/20 dark:via-red-900/20 dark:to-rose-900/30 border border-rose-200/60 dark:border-rose-700/40 hover:shadow-xl hover:shadow-rose-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:shield-check-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-rose-700 dark:text-rose-300">وضعیت حساب</div>
                  </div>
                  <div class="flex items-center">
                    <span class="px-4 py-2 rounded-2xl text-sm font-black shadow-lg" :class="{
                      'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30': userProfile.status === 'ACTIVE',
                      'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30': userProfile.status === 'PENDING_VERIFICATION',
                      'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/30': userProfile.status === 'SUSPENDED',
                      'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-gray-500/30': userProfile.status === 'DEACTIVATED'
                    }">
                      {{ userProfile.status === 'ACTIVE' ? 'فعال' : 
                         userProfile.status === 'PENDING_VERIFICATION' ? 'در انتظار تأیید' :
                         userProfile.status === 'SUSPENDED' ? 'معلق' : 'غیرفعال' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Created Date Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-indigo-900/30 border border-indigo-200/60 dark:border-indigo-700/40 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:calendar-plus-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-indigo-700 dark:text-indigo-300">تاریخ ایجاد</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-lg">{{ new Date(userProfile.createdAt || '').toLocaleDateString('fa-IR') }}</div>
                </div>
              </div>
              
              <!-- Updated Date Card -->
              <div class="group relative overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-violet-900/30 border border-violet-200/60 dark:border-violet-700/40 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-500 hover:-translate-y-1">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-200/40 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div class="relative">
                  <div class="flex items-center mb-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center me-2">
                      <Icon name="ph:clock-clockwise-fill" class="w-4 h-4 text-white" />
                    </div>
                    <div class="text-sm font-bold text-violet-700 dark:text-violet-300">آخرین بروزرسانی</div>
                  </div>
                  <div class="font-black text-gray-900 dark:text-white text-lg">{{ new Date(userProfile.updatedAt || '').toLocaleDateString('fa-IR') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Education & Occupation Combined -->
        <div class="grid md:grid-cols-2 gap-6">
          
          <!-- Education Information -->
          <div v-if="userProfile.demographics?.education?.length" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-green-500/10 border border-green-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center me-4 shadow-lg">
                <Icon name="ph:graduation-cap-fill" class="w-7 h-7 text-white" />
              </div>
              <div>
                <BaseHeading as="h3" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-1">
                  <span>سوابق تحصیلی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  <span>مدارک و تجربیات دانشگاهی</span>
                </BaseParagraph>
              </div>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="edu in userProfile.demographics.education" 
                :key="edu.id"
                class="group border border-green-100/50 dark:border-gray-700 rounded-2xl p-5 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10 hover:shadow-lg transition-all duration-300"
              >
                <div class="font-bold text-gray-800 dark:text-white text-lg mb-1">{{ edu.degree }}</div>
                <div class="text-green-600 dark:text-green-400 font-medium mb-2">{{ edu.field }}</div>
                <div class="text-gray-600 dark:text-gray-400 mb-3">{{ edu.institution }}</div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full">
                    {{ edu.startDate }} - {{ edu.isCurrentlyEnrolled ? 'در حال تحصیل' : edu.endDate }}
                  </div>
                  <div v-if="edu.isCurrentlyEnrolled">
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm border border-blue-200">فعال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Occupation Information -->
          <div v-if="userProfile.demographics?.occupation?.length" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-orange-500/10 border border-orange-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center me-4 shadow-lg">
                <Icon name="ph:briefcase-fill" class="w-7 h-7 text-white" />
              </div>
              <div>
                <BaseHeading as="h3" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-1">
                  <span>سوابق شغلی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  <span>تجربیات حرفه‌ای و مشاغل</span>
                </BaseParagraph>
              </div>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="job in userProfile.demographics.occupation" 
                :key="job.id"
                class="group border border-orange-100/50 dark:border-gray-700 rounded-2xl p-5 bg-gradient-to-r from-orange-50/30 to-amber-50/30 dark:from-orange-900/10 dark:to-amber-900/10 hover:shadow-lg transition-all duration-300"
              >
                <div class="font-bold text-gray-800 dark:text-white text-lg mb-1">{{ job.position }}</div>
                <div class="text-orange-600 dark:text-orange-400 font-medium mb-3">{{ job.company }}</div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full">
                    {{ job.startDate }} - {{ job.isCurrentJob ? 'در حال حاضر' : job.endDate }}
                  </div>
                  <div v-if="job.isCurrentJob">
                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-sm border border-green-200">شغل فعلی</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-red-500/10 border border-red-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
          <div class="flex items-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center me-6 shadow-lg">
              <Icon name="ph:shield-check-fill" class="w-8 h-8 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
                <span>تنظیمات حریم خصوصی</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>کنترل دسترسی و نمایش اطلاعات شخصی</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="grid gap-6">
            <div class="flex items-center justify-between p-6 border border-red-100/50 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:users-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white block text-lg mb-1">نمایش پروفایل برای مشاوران</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا مشاوران بتوانند پروفایل شما را مشاهده کنند؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <Icon 
                  :name="userProfile.privacySettings?.isProfileVisibleToCounselors ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                  :class="userProfile.privacySettings?.isProfileVisibleToCounselors ? 'text-green-500' : 'text-red-500'"
                  class="w-8 h-8"
                />
                <span class="ms-3 font-bold text-lg" :class="userProfile.privacySettings?.isProfileVisibleToCounselors ? 'text-green-600' : 'text-red-600'">
                  {{ userProfile.privacySettings?.isProfileVisibleToCounselors ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-6 border border-red-100/50 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:user-list-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white block text-lg mb-1">نمایش پروفایل برای سایر کاربران</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا کاربران دیگر بتوانند پروفایل شما را مشاهده کنند؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <Icon 
                  :name="userProfile.privacySettings?.isProfileVisibleToOtherUsers ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                  :class="userProfile.privacySettings?.isProfileVisibleToOtherUsers ? 'text-green-500' : 'text-red-500'"
                  class="w-8 h-8"
                />
                <span class="ms-3 font-bold text-lg" :class="userProfile.privacySettings?.isProfileVisibleToOtherUsers ? 'text-green-600' : 'text-red-600'">
                  {{ userProfile.privacySettings?.isProfileVisibleToOtherUsers ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-6 border border-red-100/50 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-red-50/30 to-pink-50/30 dark:from-red-900/10 dark:to-pink-900/10 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:chart-line-up-fill" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <span class="font-bold text-gray-800 dark:text-white block text-lg mb-1">تحلیل داده‌ها برای انطباق‌یابی</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">آیا اجازه تحلیل داده‌ها برای بهبود انطباق‌یابی را می‌دهید؟</span>
                </div>
              </div>
              <div class="flex items-center">
                <Icon 
                  :name="userProfile.privacySettings?.allowDataAnalysisForMatching ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                  :class="userProfile.privacySettings?.allowDataAnalysisForMatching ? 'text-green-500' : 'text-red-500'"
                  class="w-8 h-8"
                />
                <span class="ms-3 font-bold text-lg" :class="userProfile.privacySettings?.allowDataAnalysisForMatching ? 'text-green-600' : 'text-red-600'">
                  {{ userProfile.privacySettings?.allowDataAnalysisForMatching ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Right Column (4 columns) -->
      <div class="lg:col-span-4 space-y-8">
        
        <!-- Location Information -->
        <div v-if="userProfile.demographics?.location?.length" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-purple-500/10 border border-purple-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          <div class="flex items-center mb-6">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center me-4 shadow-lg">
              <Icon name="ph:map-pin-fill" class="w-7 h-7 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-1">
                <span>محل سکونت</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>آدرس‌ها و اطلاعات مکانی</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="location in userProfile.demographics.location" 
              :key="location.id"
              class="border border-purple-100/50 dark:border-gray-700 rounded-2xl p-5 bg-gradient-to-r from-purple-50/30 to-violet-50/30 dark:from-purple-900/10 dark:to-violet-900/10 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl flex items-center justify-center me-3">
                    <Icon name="ph:map-pin-line-fill" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 dark:text-white text-lg">{{ location.city }}, {{ location.state }}</div>
                    <div class="text-purple-600 dark:text-purple-400 font-medium">{{ location.country }}</div>
                  </div>
                </div>
                <div v-if="location.isPrimary">
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold shadow-sm border border-purple-200">اصلی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Communication Preferences -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-teal-500/10 border border-teal-100/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300">
          <div class="flex items-center mb-6">
            <div class="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center me-4 shadow-lg">
              <Icon name="ph:chat-circle-fill" class="w-7 h-7 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-1">
                <span>تنظیمات ارتباطات</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                <span>ترجیحات دریافت اعلان‌ها</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-5 border border-teal-100/50 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:envelope-fill" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <span class="font-bold text-gray-800 dark:text-white text-lg">اعلان‌های ایمیل</span>
              </div>
              <div class="flex items-center">
                <Icon 
                  :name="userProfile.preferences?.communication?.email ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                  :class="userProfile.preferences?.communication?.email ? 'text-green-500' : 'text-red-500'"
                  class="w-7 h-7"
                />
                <span class="ms-3 font-bold text-lg" :class="userProfile.preferences?.communication?.email ? 'text-green-600' : 'text-red-600'">
                  {{ userProfile.preferences?.communication?.email ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-5 border border-teal-100/50 dark:border-gray-700 rounded-2xl bg-gradient-to-r from-teal-50/30 to-cyan-50/30 dark:from-teal-900/10 dark:to-cyan-900/10 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-xl flex items-center justify-center me-4">
                  <Icon name="ph:device-mobile-fill" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <span class="font-bold text-gray-800 dark:text-white text-lg">اعلان‌های پیامکی</span>
              </div>
              <div class="flex items-center">
                <Icon 
                  :name="userProfile.preferences?.communication?.sms ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
                  :class="userProfile.preferences?.communication?.sms ? 'text-green-500' : 'text-red-500'"
                  class="w-7 h-7"
                />
                <span class="ms-3 font-bold text-lg" :class="userProfile.preferences?.communication?.sms ? 'text-green-600' : 'text-red-600'">
                  {{ userProfile.preferences?.communication?.sms ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>

    <!-- Enhanced Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 mb-8">
      <BaseButton
        @click="navigateTo('/hammasir')"
        class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 px-8 py-4 rounded-2xl"
      >
        <Icon name="ph:arrow-right-bold" class="w-5 h-5 me-3 group-hover:translate-x-1 transition-transform duration-300" />
        <span class="font-bold">بازگشت به داشبورد</span>
      </BaseButton>
      
      <BaseButton
        class="group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 px-8 py-4 rounded-2xl"
      >
        <Icon name="ph:download-bold" class="w-5 h-5 me-3 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-bold">دانلود گزارش کامل</span>
      </BaseButton>
      
      <BaseButton
        class="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 px-8 py-4 rounded-2xl"
      >
        <Icon name="ph:printer-bold" class="w-5 h-5 me-3 group-hover:scale-110 transition-transform duration-300" />
        <span class="font-bold">چاپ پروفایل</span>
      </BaseButton>
    </div>

    <!-- Stats Footer -->
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon name="ph:calendar-check-fill" class="w-8 h-8 text-white" />
          </div>
          <div class="font-black text-2xl text-gray-800 dark:text-white mb-1">98%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">تکمیل پروفایل</div>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon name="ph:shield-check-fill" class="w-8 h-8 text-white" />
          </div>
          <div class="font-black text-2xl text-gray-800 dark:text-white mb-1">{{ userProfile.status === 'ACTIVE' ? '100%' : '0%' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">تأیید اطلاعات</div>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon name="ph:eye-fill" class="w-8 h-8 text-white" />
          </div>
          <div class="font-black text-2xl text-gray-800 dark:text-white mb-1">{{ userProfile.privacySettings?.isProfileVisibleToCounselors ? '🔓' : '🔒' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">حریم خصوصی</div>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon name="ph:clock-clockwise-fill" class="w-8 h-8 text-white" />
          </div>
          <div class="font-black text-2xl text-gray-800 dark:text-white mb-1">{{ Math.floor((new Date().getTime() - new Date(userProfile.createdAt || '').getTime()) / (1000 * 60 * 60 * 24)) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">روز عضویت</div>
        </div>
      </div>
    </div>

    <!-- Status Change Modal -->
    <BaseModal 
      :open="showStatusModal" 
      @close="closeStatusModal"
      size="md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Icon name="ph:gear-six-fill" class="w-6 h-6 text-white" />
          </div>
          <div>
            <BaseHeading as="h2" size="xl" weight="bold" class="text-gray-800 dark:text-white">
              تغییر وضعیت کاربر
            </BaseHeading>
            <BaseParagraph class="text-gray-600 dark:text-gray-400">
              تغییر وضعیت حساب کاربری {{ userProfile.personalInfo?.firstName }} {{ userProfile.personalInfo?.lastName }}
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- User Info Card -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div class="flex items-center gap-4">
            <BaseAvatar
              :src="userProfile.personalInfo?.profilePicture"
              :text="`${userProfile.personalInfo?.firstName?.[0]}${userProfile.personalInfo?.lastName?.[0]}`"
              size="lg"
              class="ring-4 ring-blue-200 dark:ring-blue-700"
            />
            <div class="flex-1">
              <div class="font-bold text-gray-800 dark:text-white text-xl mb-1">
                {{ userProfile.personalInfo?.firstName }} {{ userProfile.personalInfo?.lastName }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 mb-2">{{ userProfile.personalInfo?.email }}</div>
              <div class="flex items-center gap-2">
                <BaseBadge :color="currentStatusInfo.color" class="flex items-center gap-1">
                  <Icon :name="currentStatusInfo.icon" class="w-3 h-3" />
                  <span>{{ currentStatusInfo.label }}</span>
                </BaseBadge>
                <span class="text-sm text-gray-500 dark:text-gray-400">وضعیت فعلی</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Status Warning -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200/50 dark:border-yellow-700/50">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-fill" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <div class="font-medium text-yellow-800 dark:text-yellow-200 mb-1">هشدار</div>
              <div class="text-sm text-yellow-700 dark:text-yellow-300">
                تغییر وضعیت کاربر ممکن است بر دسترسی‌های او تأثیر بگذارد. این عمل قابل بازگشت است.
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="statusUpdateError" class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-red-200/50 dark:border-red-700/50">
          <div class="flex items-start gap-3">
            <Icon name="ph:x-circle-fill" class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <div class="font-medium text-red-800 dark:text-red-200 mb-1">خطا در بروزرسانی</div>
              <div class="text-sm text-red-700 dark:text-red-300">{{ statusUpdateError }}</div>
            </div>
          </div>
        </div>

        <!-- Status Options -->
        <div class="space-y-3">
          <div class="font-medium text-gray-800 dark:text-white mb-3">انتخاب وضعیت جدید:</div>
          <div 
            v-for="option in availableStatusActions" 
            :key="option.value"
            class="group"
          >
            <BaseButton
              @click="changeUserStatus(option.value as UserProfile['status'])"
              :disabled="isUpdatingStatus"
              variant="outline"
              :color="option.color"
              class="w-full p-4 text-right justify-start hover:scale-[1.02] transition-all duration-300"
            >
              <div class="flex items-center gap-4 w-full">
                <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${
                  option.color === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  option.color === 'danger' ? 'bg-red-100 dark:bg-red-900/30' :
                  option.color === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-gray-100 dark:bg-gray-800'
                }`">
                  <Icon 
                    :name="isUpdatingStatus ? 'ph:spinner' : option.icon" 
                    :class="{ 
                      'animate-spin': isUpdatingStatus,
                      'text-green-600 dark:text-green-400': option.color === 'success',
                      'text-red-600 dark:text-red-400': option.color === 'danger',
                      'text-yellow-600 dark:text-yellow-400': option.color === 'warning',
                      'text-gray-600 dark:text-gray-400': option.color === 'muted'
                    }" 
                    class="w-5 h-5" 
                  />
                </div>
                <div class="flex-1">
                  <div class="font-bold text-gray-800 dark:text-white mb-1">{{ option.label }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ option.description }}</div>
                </div>
                <Icon name="ph:arrow-left" class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </BaseButton>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <BaseButton 
            @click="closeStatusModal"
            variant="outline"
            :disabled="isUpdatingStatus"
          >
            انصراف
          </BaseButton>
        </div>
      </template>
    </BaseModal>

  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>