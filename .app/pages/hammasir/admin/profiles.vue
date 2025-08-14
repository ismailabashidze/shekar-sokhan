<script setup lang="ts">
import type { UserProfile, PersonalInfo, Demographics, Preferences, PrivacySettings, EducationInfo, OccupationInfo, LocationInfo } from '~/composables/profile'

definePageMeta({
  title: 'مدیریت پروفایل‌ها',
  preview: {
    title: 'Profiles Management',
    description: 'Admin panel for managing user profiles',
    categories: ['admin', 'profile'],
    src: '/img/screens/admin-profiles-hammasir.png',
    srcDark: '/img/screens/admin-profiles-hammasir-dark.png',
    order: 10,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Use profile composable
const { updateUserStatus } = useProfile()

// Get Nuxt app instance for $fetch
const { $fetch } = useNuxtApp()

// Simplified mock profiles data for testing
const mockProfiles = ref<UserProfile[]>([
  {
    id: '1',
    userId: '1',
    personalInfo: {
      firstName: 'سارا',
      lastName: 'محمدی',
      email: 'sara.mohammadi@example.com',
      phoneNumber: '09123456789'
    },
    demographics: {
      education: [{ degree: 'کارشناسی ارشد' }],
      occupation: [{ position: 'مشاور روانشناس' }],
      location: [{ city: 'تهران', state: 'تهران' }]
    },
    status: 'ACTIVE',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-08-13T10:15:00Z'
  },
  {
    id: '2',
    userId: '2',
    personalInfo: {
      firstName: 'علی',
      lastName: 'احمدی',
      email: 'ali.ahmadi@gmail.com',
      phoneNumber: '09987654321'
    },
    demographics: {
      education: [{ degree: 'دکتری' }],
      occupation: [{ position: 'مدیر فنی' }],
      location: [{ city: 'اصفهان', state: 'اصفهان' }]
    },
    status: 'SUSPENDED',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-08-10T16:45:00Z'
  },
  {
    id: '3',
    userId: '3',
    personalInfo: {
      firstName: 'مریم',
      lastName: 'کریمی',
      email: 'maryam.karimi@yahoo.com',
      phoneNumber: '09356789012'
    },
    demographics: {
      education: [{ degree: 'کارشناسی' }],
      occupation: [{ position: 'پرستار' }],
      location: [{ city: 'شیراز', state: 'فارس' }]
    },
    status: 'PENDING_VERIFICATION',
    createdAt: '2024-06-15T09:10:00Z',
    updatedAt: '2024-08-12T11:30:00Z'
  }
])

// Pagination and filtering
const currentPage = ref(1)
const itemsPerPage = ref(5)
const searchQuery = ref('')
const selectedStatus = ref<string>('')


// Computed properties for filtering and pagination
const filteredProfiles = computed(() => {
  let filtered = mockProfiles.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(profile => 
      profile.personalInfo?.firstName?.toLowerCase().includes(query) ||
      profile.personalInfo?.lastName?.toLowerCase().includes(query) ||
      profile.personalInfo?.email?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(profile => profile.status === selectedStatus.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProfiles.value.length / itemsPerPage.value))

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProfiles.value.slice(start, end)
})

// Helper functions
function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'PENDING_VERIFICATION':
      return 'warning'
    case 'SUSPENDED':
      return 'danger'
    case 'DEACTIVATED':
      return 'muted'
    default:
      return 'default'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'فعال'
    case 'PENDING_VERIFICATION':
      return 'در انتظار تأیید'
    case 'SUSPENDED':
      return 'معلق'
    case 'DEACTIVATED':
      return 'غیرفعال'
    default:
      return 'نامشخص'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'ph:check-circle-fill'
    case 'PENDING_VERIFICATION':
      return 'ph:clock-fill'
    case 'SUSPENDED':
      return 'ph:pause-circle-fill'
    case 'DEACTIVATED':
      return 'ph:x-circle-fill'
    default:
      return 'ph:question-fill'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}

function getStatusActionColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'danger'  // Red for suspend action
    case 'SUSPENDED':
      return 'success' // Green for activate action
    case 'DEACTIVATED':
      return 'success' // Green for activate action
    case 'PENDING_VERIFICATION':
      return 'warning' // Yellow for pending status
    default:
      return 'default'
  }
}

function getStatusActionIcon(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'ph:pause'
    case 'SUSPENDED':
      return 'ph:play'
    case 'DEACTIVATED':
      return 'ph:play'
    case 'PENDING_VERIFICATION':
      return 'ph:gear'
    default:
      return 'ph:gear'
  }
}

function getStatusActionLabel(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'تعلیق'
    case 'SUSPENDED':
      return 'فعال‌سازی'
    case 'DEACTIVATED':
      return 'فعال‌سازی'
    case 'PENDING_VERIFICATION':
      return 'تغییر وضعیت'
    default:
      return 'تغییر وضعیت'
  }
}

function viewProfile(userId: string) {
  // Navigate to profile view with userId query param
  navigateTo(`/hammasir/profile?userId=${userId}`)
}

function editProfile(userId: string) {
  // Navigate to profile edit with userId for admin mode
  navigateTo(`/hammasir/profile/edit?userId=${userId}`)
}

function toggleProfileStatus(profile: UserProfile) {
  selectedUserProfile.value = profile
  showStatusModal.value = true
  statusUpdateError.value = ''
}

// Status change functions
function closeStatusModal() {
  showStatusModal.value = false
  selectedUserProfile.value = null
  statusUpdateError.value = ''
  isUpdatingStatus.value = false
}

async function changeUserStatus(newStatus: UserProfile['status']) {
  if (!selectedUserProfile.value?.userId) {
    return
  }

  isUpdatingStatus.value = true
  statusUpdateError.value = ''

  try {
    // Call the API directly with proper $fetch
    const updatedProfile = await $fetch(`/api/v1/profiles/${selectedUserProfile.value.userId}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    }) as UserProfile
    
    // Update the profile in the list (make mockProfiles reactive)
    const profileIndex = mockProfiles.value.findIndex(p => p.userId === selectedUserProfile.value!.userId)
    if (profileIndex !== -1) {
      mockProfiles.value[profileIndex] = { ...mockProfiles.value[profileIndex], status: updatedProfile.status, updatedAt: updatedProfile.updatedAt }
    }
    
    closeStatusModal()
    
    // Show success message
    const statusLabel = filterStatusOptions.find(opt => opt.value === newStatus)?.label || newStatus
    alert(`وضعیت کاربر ${selectedUserProfile.value.personalInfo?.firstName} ${selectedUserProfile.value.personalInfo?.lastName} با موفقیت به "${statusLabel}" تغییر یافت.`)
    
  } catch (err) {
    statusUpdateError.value = err instanceof Error ? err.message : 'خطا در بروزرسانی وضعیت کاربر'
  } finally {
    isUpdatingStatus.value = false
  }
}

// Status change modal state
const showStatusModal = ref(false)
const selectedUserProfile = ref<UserProfile | null>(null)
const isUpdatingStatus = ref(false)
const statusUpdateError = ref('')

// Status options for filtering and modal
const statusOptions = [
  { value: 'ACTIVE', label: 'فعال', description: 'کاربر می‌تواند از تمام امکانات استفاده کند', color: 'success', icon: 'ph:check-circle-fill' },
  { value: 'SUSPENDED', label: 'معلق', description: 'دسترسی کاربر به طور موقت محدود می شود', color: 'danger', icon: 'ph:pause-circle-fill' },
  { value: 'DEACTIVATED', label: 'غیرفعال', description: 'حساب کاربری غیرفعال می شود', color: 'muted', icon: 'ph:x-circle-fill' },
  { value: 'PENDING_VERIFICATION', label: 'در انتظار تأیید', description: 'حساب کاربری نیاز به تأیید دارد', color: 'warning', icon: 'ph:clock-fill' }
]

// Status options for filtering dropdown (includes "all" option)
const filterStatusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  ...statusOptions
]

// Get current status info for selected user
const currentStatusInfo = computed(() => {
  if (!selectedUserProfile.value) return statusOptions[0]
  return statusOptions.find(option => option.value === selectedUserProfile.value!.status) || statusOptions[0]
})

// Get available status actions (exclude current status)
const availableStatusActions = computed(() => {
  if (!selectedUserProfile.value) return []
  return statusOptions.filter(option => option.value !== selectedUserProfile.value!.status)
})

// Watch for search/filter changes to reset pagination
watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="mb-5">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 shadow-2lg shadow-indigo-500/25 mb-12">
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/8 via-transparent to-transparent"></div>
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-3lg"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/15 to-transparent rounded-full blur-3lg"></div>
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>
      
      <div class="relative px-8 lg:px-12 py-20">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div class="relative group">
              <div class="w-32 h-32 bg-gradient-to-br from-white/25 to-white/10 rounded-[2rem] flex items-center justify-center shadow-2lg backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-all duration-500">
                <Icon name="ph:users-three-fill" class="w-20 h-20 text-white/90 drop-shadow-lg" />
              </div>
              <div class="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2lg flex items-center justify-center border-4 border-white/30 shadow-lg">
                <Icon name="ph:crown-fill" class="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <div class="flex items-center mb-4">
                  <div class="px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-2lg border border-indigo-400/30 me-4">
                    <span class="text-indigo-200 font-bold text-sm">👑 پنل مدیریت</span>
                  </div>
                  <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2lg border border-white/20">
                    <span class="text-white/80 font-medium text-sm">مدیریت کامل پروفایل‌ها</span>
                  </div>
                </div>
                <BaseHeading as="h1" class="text-white drop-shadow-2lg mb-3 text-4lg lg:text-5lg font-black tracking-tight">
                  <span class="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                    مدیریت پروفایل‌ها
                  </span>
                </BaseHeading>
                <BaseParagraph class="text-white/80 mb-6 text-lg font-medium">
                  <span>مشاهده، ویرایش و مدیریت تمام پروفایل‌های کاربران</span>
                </BaseParagraph>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <BaseButton class="group bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2lg">
              <Icon name="ph:download-bold" class="w-5 h-5 me-2" />
              <span>خروجی Excel</span>
            </BaseButton>
            <BaseButton class="group bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 rounded-2lg">
              <Icon name="ph:plus-bold" class="w-5 h-5 me-2" />
              <span>پروفایل جدید</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <BaseCard class="mb-8 shadow-lg border-2 border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-6 items-end">
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">جستجو در پروفایل‌ها</label>
            <BaseInput
              v-model="searchQuery"
              placeholder="نام، نام خانوادگی یا ایمیل را وارد کنید..."
              icon="ph:magnifying-glass"
              class="w-full"
            />
          </div>
          
          <div class="lg:w-64">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">فیلتر وضعیت</label>
            <BaseSelect v-model="selectedStatus">
              <option v-for="option in filterStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </BaseSelect>
          </div>
          
          <div class="lg:w-32">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">تعداد در صفحه</label>
            <BaseSelect v-model="itemsPerPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </BaseSelect>
          </div>
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium">{{ filteredProfiles.length }}</span> پروفایل یافت شد
          </div>
          <div class="flex gap-2">
            <BaseTag 
              color="success" 
              variant="pastel"
              rounded="full"
              size="sm"
              class="font-medium flex items-center gap-1"
            >
              <Icon name="ph:check-circle" class="w-3 h-3" />
              فعال: {{ mockProfiles.filter(p => p.status === 'ACTIVE').length }}
            </BaseTag>
            <BaseTag 
              color="warning" 
              variant="pastel"
              rounded="full"
              size="sm"
              class="font-medium flex items-center gap-1"
            >
              <Icon name="ph:clock" class="w-3 h-3" />
              در انتظار: {{ mockProfiles.filter(p => p.status === 'PENDING_VERIFICATION').length }}
            </BaseTag>
            <BaseTag 
              color="danger" 
              variant="pastel"
              rounded="full"
              size="sm"
              class="font-medium flex items-center gap-1"
            >
              <Icon name="ph:pause-circle" class="w-3 h-3" />
              معلق: {{ mockProfiles.filter(p => p.status === 'SUSPENDED').length }}
            </BaseTag>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Profiles List -->
    <div class="space-y-6">
      <BaseCard 
        v-for="profile in paginatedProfiles" 
        :key="profile.id"
        class="transition-all duration-300 hover:shadow-2lg hover:scale-[1.02] border-2 border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
      >
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center gap-6">
            <!-- Profile Avatar and Basic Info -->
            <div class="flex items-center gap-4 flex-1">
              <BaseAvatar
                :src="profile.personalInfo?.profilePicture"
                :text="`${profile.personalInfo?.firstName?.[0]}${profile.personalInfo?.lastName?.[0]}`"
                size="lg"
                class="ring-4 ring-gray-200 dark:ring-gray-700 shadow-lg"
              />
              
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white">
                    {{ profile.personalInfo?.firstName }} {{ profile.personalInfo?.lastName }}
                  </BaseHeading>
                  <BaseTag
                    :color="getStatusBadgeColor(profile.status!)"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium flex items-center gap-1.5"
                  >
                    <Icon 
                      :name="getStatusIcon(profile.status!)" 
                      class="w-3 h-3" 
                    />
                    {{ getStatusLabel(profile.status!) }}
                  </BaseTag>
                </div>
                
                <div class="space-y-1">
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <Icon name="ph:envelope" class="w-4 h-4 me-2" />
                    <span class="text-sm">{{ profile.personalInfo?.email }}</span>
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <Icon name="ph:phone" class="w-4 h-4 me-2" />
                    <span class="text-sm">{{ profile.personalInfo?.phoneNumber }}</span>
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <Icon name="ph:map-pin" class="w-4 h-4 me-2" />
                    <span class="text-sm">{{ profile.demographics?.location?.[0]?.city }}, {{ profile.demographics?.location?.[0]?.state }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Details -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 flex-1">
              <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div class="flex items-center justify-center mb-2">
                  <Icon name="ph:graduation-cap" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">تحصیلات</div>
                <div class="text-sm font-bold text-gray-800 dark:text-white">
                  {{ profile.demographics?.education?.[0]?.degree || 'نامشخص' }}
                </div>
              </div>

              <div class="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div class="flex items-center justify-center mb-2">
                  <Icon name="ph:briefcase" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div class="text-xs text-green-600 dark:text-green-400 font-medium mb-1">شغل</div>
                <div class="text-sm font-bold text-gray-800 dark:text-white">
                  {{ profile.demographics?.occupation?.[0]?.position || 'نامشخص' }}
                </div>
              </div>

              <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div class="flex items-center justify-center mb-2">
                  <Icon name="ph:calendar" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">تاریخ عضویت</div>
                <div class="text-sm font-bold text-gray-800 dark:text-white">
                  {{ formatDate(profile.createdAt!) }}
                </div>
              </div>

              <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <div class="flex items-center justify-center mb-2">
                  <Icon name="ph:clock" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div class="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">آخرین بروزرسانی</div>
                <div class="text-sm font-bold text-gray-800 dark:text-white">
                  {{ formatDate(profile.updatedAt!) }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 lg:flex-col lg:gap-3">
              <BaseButton
                @click="viewProfile(profile.userId!)"
                size="sm"
                variant="outline"
                class="flex-1 lg:w-32 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Icon name="ph:eye" class="w-4 h-4 me-2" />
                <span>مشاهده</span>
              </BaseButton>
              
              <BaseButton
                @click="editProfile(profile.userId!)"
                size="sm"
                variant="outline"
                class="flex-1 lg:w-32 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Icon name="ph:pencil" class="w-4 h-4 me-2" />
                <span>ویرایش</span>
              </BaseButton>
              
              <BaseButton
                @click="toggleProfileStatus(profile)"
                size="sm"
                :variant="profile.status === 'ACTIVE' ? 'solid' : 'outline'"
                :color="getStatusActionColor(profile.status!)"
                class="flex-1 lg:w-32"
              >
                <Icon :name="getStatusActionIcon(profile.status!)" class="w-4 h-4 me-2" />
                <span>{{ getStatusActionLabel(profile.status!) }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <div v-if="paginatedProfiles.length === 0" class="text-center py-16">
      <BaseCard class="max-w-md mx-auto shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div class="p-8">
          <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ph:users" class="w-12 h-12 text-gray-400" />
          </div>
          <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-600 dark:text-gray-400 mb-2">
            پروفایلی یافت نشد
          </BaseHeading>
          <BaseParagraph class="text-gray-500 dark:text-gray-500 mb-6">
            با فیلترهای انتخابی هیچ پروفایلی یافت نشد. لطفاً جستجو یا فیلترها را تغییر دهید.
          </BaseParagraph>
          <BaseButton @click="searchQuery = ''; selectedStatus = ''" variant="outline">
            پاک کردن فیلترها
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-12 flex justify-center">
      <BasePagination
        :total-items="filteredProfiles.length"
        :item-per-page="itemsPerPage"
        :current-page="currentPage"
        @update:current-page="currentPage = $event"
        class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg rounded-2lg border-2 border-gray-100 dark:border-gray-800"
      />
    </div>

    <!-- Status Change Modal -->
    <TairoModal 
      :open="showStatusModal" 
      @close="closeStatusModal"
      size="lg"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Icon name="ph:gear-six-fill" class="w-6 h-6 text-white" />
            </div>
            <div class="text-right">
              <BaseHeading as="h2" size="lg" weight="bold" class="text-gray-800 dark:text-white">
                تغییر وضعیت کاربر
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                تغییر وضعیت حساب کاربری {{ selectedUserProfile?.personalInfo?.firstName }} {{ selectedUserProfile?.personalInfo?.lastName }}
              </BaseParagraph>
            </div>
          </div>
          <BaseButtonClose @click="closeStatusModal" />
        </div>
      </template>

      <div v-if="selectedUserProfile" class="p-4 sm:p-5 space-y-6">
        <!-- User Info Card -->
        <div class="text-right bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2lg p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div class="flex items-center gap-4">
            <BaseAvatar
              :src="selectedUserProfile.personalInfo?.profilePicture"
              :text="`${selectedUserProfile.personalInfo?.firstName?.[0]}${selectedUserProfile.personalInfo?.lastName?.[0]}`"
              size="lg"
              class="ring-4 ring-blue-200 dark:ring-blue-700"
            />
            <div class="flex-1">
              <div class="font-bold text-gray-800 dark:text-white text-lg mb-1">
                {{ selectedUserProfile.personalInfo?.firstName }} {{ selectedUserProfile.personalInfo?.lastName }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 mb-2">{{ selectedUserProfile.personalInfo?.email }}</div>
              <div class="flex items-center gap-2">
                <BaseTag 
                  :color="currentStatusInfo.color" 
                  variant="pastel"
                  rounded="full"
                  size="sm"
                  class="font-medium flex items-center gap-1"
                >
                  <Icon :name="currentStatusInfo.icon" class="w-3 h-3" />
                  {{ currentStatusInfo.label }}
                </BaseTag>
                <span class="text-sm text-gray-500 dark:text-gray-400">وضعیت فعلی</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Status Warning -->
        <div class="text-right bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2lg p-4 border border-yellow-200/50 dark:border-yellow-700/50">
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
        <div v-if="statusUpdateError" class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2lg p-4 border border-red-200/50 dark:border-red-700/50">
          <div class="flex items-start gap-3">
            <Icon name="ph:x-circle-fill" class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <div class="font-medium text-red-800 dark:text-red-200 mb-1">خطا در بروزرسانی</div>
              <div class="text-sm text-red-700 dark:text-red-300">{{ statusUpdateError }}</div>
            </div>
          </div>
        </div>

        <!-- Status Options -->
        <div class="space-y-2">
          <div class="font-medium text-sm text-muted-800 dark:text-white mb-2 text-right">انتخاب وضعیت جدید:</div>
          <div class="space-y-1.5">
            <button 
              v-for="option in availableStatusActions" 
              :key="option.value"
              @click="changeUserStatus(option.value as UserProfile['status'])"
              :disabled="isUpdatingStatus"
              :class="[
                'group relative w-full p-2 rounded-lg border transition-all duration-150',
                'hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1',
                {
                  'border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:ring-red-500 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30': option.color === 'danger',
                  'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 focus:ring-yellow-500 dark:border-yellow-800 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30': option.color === 'warning',
                  'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/70': option.color === 'muted'
                },
                {
                  'opacity-60 cursor-not-allowed': isUpdatingStatus,
                  'cursor-pointer': !isUpdatingStatus
                }
              ]"
            >
              <div class="flex items-center gap-2 text-right" dir="rtl">
                <!-- Arrow Icon (RTL - rightmost) -->
                <Icon 
                  name="ph:arrow-right" 
                  :class="[
                    'w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5',
                    {
                      'text-red-400 group-hover:text-red-600': option.color === 'danger',
                      'text-yellow-400 group-hover:text-yellow-600': option.color === 'warning',
                      'text-gray-400 group-hover:text-gray-600': option.color === 'muted'
                    }
                  ]" 
                />

                <!-- Status Text Content -->
                <div class="flex-1 text-right min-w-0">
                  <div :class="[
                    'font-semibold text-sm leading-tight truncate',
                    {
                      'text-red-800 dark:text-red-200': option.color === 'danger',
                      'text-yellow-800 dark:text-yellow-200': option.color === 'warning',
                      'text-gray-800 dark:text-gray-200': option.color === 'muted'
                    }
                  ]">
                    {{ option.label }}
                  </div>
                  <div :class="[
                    'text-[11px] font-medium leading-tight truncate',
                    {
                      'text-red-600 dark:text-red-400': option.color === 'danger',
                      'text-yellow-600 dark:text-yellow-400': option.color === 'warning',
                      'text-gray-500 dark:text-gray-400': option.color === 'muted'
                    }
                  ]">
                    {{ option.description }}
                  </div>
                </div>

                <!-- Status Icon (RTL - leftmost) -->
                <div :class="[
                  'relative flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0',
                  {
                    'bg-red-100 dark:bg-red-900/40': option.color === 'danger',
                    'bg-yellow-100 dark:bg-yellow-900/40': option.color === 'warning', 
                    'bg-gray-100 dark:bg-gray-800': option.color === 'muted'
                  }
                ]">
                  <Icon 
                    :name="isUpdatingStatus ? 'ph:spinner' : option.icon" 
                    :class="[
                      'w-4 h-4',
                      {
                        'animate-spin': isUpdatingStatus,
                        'text-red-600 dark:text-red-400': option.color === 'danger',
                        'text-yellow-600 dark:text-yellow-400': option.color === 'warning',
                        'text-gray-600 dark:text-gray-400': option.color === 'muted'
                      }
                    ]" 
                  />
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <BaseButton 
            @click="closeStatusModal"
            variant="outline"
            :disabled="isUpdatingStatus"
          >
            انصراف
          </BaseButton>
        </div>
      </div>
    </TairoModal>

  </div>
</template>