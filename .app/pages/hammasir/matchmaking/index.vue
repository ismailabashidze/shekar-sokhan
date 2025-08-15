<script setup lang="ts">
import type { MatchSuggestion, IntroductionRequest, MatchmakingModule } from '~/composables/matchmaking'

definePageMeta({
  title: 'همسان‌یابی',
  preview: {
    title: 'Matchmaking',
    description: 'Find compatible matches and manage introduction requests',
    categories: ['matchmaking'],
    src: '/img/screens/matchmaking.png',
    srcDark: '/img/screens/matchmaking-dark.png',
    order: 3,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Composable
const {
  getSuggestions,
  likeSuggestion,
  dismissSuggestion,
  createIntroductionRequest,
  getIntroductionRequests,
  acceptRequest,
  rejectRequest,
  getModuleStatus,
  disableModule,
  getSuggestionStatusLabel,
  getRequestStatusLabel,
  getModuleStatusLabel,
  getCompatibilityScoreColor,
  formatCompatibilityScore,
  isSuggestionExpired,
  getSuggestionActionIcon,
  getRequestStatusIcon
} = useMatchmaking()

// Reactive data
const suggestions = ref<MatchSuggestion[]>([])
const introductionRequests = ref<IntroductionRequest[]>([])
const moduleStatus = ref<MatchmakingModule | null>(null)
const loading = ref({
  suggestions: true,
  requests: true,
  module: true
})
const error = ref<string | null>(null)
const activeTab = ref<'suggestions' | 'requests' | 'settings'>('suggestions')
const showIntroModal = ref(false)
const selectedSuggestion = ref<MatchSuggestion | null>(null)
const introMessage = ref('')
const processingAction = ref<Record<string, boolean>>({})

// Privacy settings
const privacySettings = ref({
  showProfile: true,
  showPhoto: true,
  showExactAge: true,
  showOnlineStatus: false,
  showInterests: true,
  receiveNotifications: true,
  profileVisibility: 'public', // public, friends, private
  messagePermissions: 'verified', // everyone, verified, none
  contactSharing: 'limited' // full, limited, none
})

// Mock user profiles for display
const mockProfiles: Record<string, {
  name: string
  age: number
  city: string
  profession: string
  bio: string
  interests: string[]
  avatar?: string
}> = {
  'user1': {
    name: 'سارا احمدی',
    age: 28,
    city: 'تهران',
    profession: 'روان‌شناس',
    bio: 'علاقه‌مند به کتاب‌خوانی، طبیعت‌گردی و یادگیری زبان‌های جدید.',
    interests: ['کتاب‌خوانی', 'طبیعت‌گردی', 'فیلم', 'موسیقی']
  },
  'user2': {
    name: 'علی رضایی',
    age: 32,
    city: 'اصفهان',
    profession: 'مهندس نرم‌افزار',
    bio: 'فعال در حوزه فناوری، ورزشکار و علاقه‌مند به هنر.',
    interests: ['فناوری', 'ورزش', 'عکاسی', 'سفر']
  },
  'user3': {
    name: 'مریم حسینی',
    age: 25,
    city: 'شیراز', 
    profession: 'معلم',
    bio: 'عاشق آموزش، طبیعت و فعالیت‌های اجتماعی.',
    interests: ['آموزش', 'طبیعت', 'نقاشی', 'آشپزی']
  }
}

// Mock suggestions data
const mockSuggestions: MatchSuggestion[] = [
  {
    id: 'sug1',
    suggestedUserId: 'user1',
    compatibilityScore: 0.87,
    analysis: {
      compatibilityFactors: ['علایق مشترک', 'اهداف زندگی مشابه', 'شخصیت سازگار'],
      strengths: ['ارتباط قوی', 'درک متقابل', 'احترام به یکدیگر'],
      challenges: ['تفاوت در سبک زندگی', 'اولویت‌های متفاوت کاری'],
      recommendations: ['گذراندن زمان بیشتر با یکدیگر', 'صحبت درباره اهداف آینده'],
      summary: 'سازگاری بالا با پتانسیل رابطه موفق'
    },
    status: 'NEW',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sug2', 
    suggestedUserId: 'user2',
    compatibilityScore: 0.73,
    analysis: {
      compatibilityFactors: ['ارزش‌های مشترک', 'نگرش مثبت به زندگی'],
      strengths: ['صداقت', 'حمایت از یکدیگر'],
      challenges: ['تفاوت در علایق', 'سبک ارتباط متفاوت'],
      recommendations: ['کشف علایق مشترک جدید', 'بهبود مهارت‌های ارتباطی'],
      summary: 'سازگاری خوب با امکان رشد رابطه'
    },
    status: 'VIEWED',
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: 'sug3',
    suggestedUserId: 'user3', 
    compatibilityScore: 0.65,
    analysis: {
      compatibilityFactors: ['شخصیت مکمل', 'هدف مشترک تشکیل خانواده'],
      strengths: ['صبر و مدارا', 'تعهد'],
      challenges: ['تفاوت در انرژی اجتماعی', 'سبک تصمیم‌گیری متفاوت'],
      recommendations: ['درک بیشتر نیازهای یکدیگر', 'تمرین حل تعارض'],
      summary: 'سازگاری متوسط با نیاز به کار بیشتر'
    },
    status: 'NEW',
    createdAt: '2024-01-13T09:15:00Z'
  }
]

// Mock introduction requests
const mockIntroRequests: IntroductionRequest[] = [
  {
    id: 'req1',
    requesterId: 'user1',
    targetId: 'currentUser',
    status: 'PENDING',
    message: 'سلام! پروفایل شما را دیدم و فکر می‌کنم نقاط مشترک جالبی داریم. خوشحال می‌شوم بیشتر آشنا شویم.',
    requestedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'req2',
    requesterId: 'currentUser', 
    targetId: 'user2',
    status: 'ACCEPTED',
    message: 'با توجه به علایق مشترکمان، خوشحال می‌شوم بیشتر صحبت کنیم.',
    requestedAt: '2024-01-15T11:45:00Z',
    respondedAt: '2024-01-15T18:30:00Z'
  }
]

// Load data
onMounted(async () => {
  await Promise.all([
    loadSuggestions(),
    loadIntroductionRequests(),
    loadModuleStatus()
  ])
})

async function loadSuggestions() {
  try {
    loading.value.suggestions = true
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    suggestions.value = mockSuggestions
  } catch (err) {
    error.value = 'خطا در بارگذاری پیشنهادات'
    console.error('Error loading suggestions:', err)
  } finally {
    loading.value.suggestions = false
  }
}

async function loadIntroductionRequests() {
  try {
    loading.value.requests = true
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 600))
    introductionRequests.value = mockIntroRequests
  } catch (err) {
    error.value = 'خطا در بارگذاری درخواست‌ها'
    console.error('Error loading requests:', err)
  } finally {
    loading.value.requests = false
  }
}

async function loadModuleStatus() {
  try {
    loading.value.module = true
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300))
    moduleStatus.value = {
      id: 'mod1',
      userId: 'currentUser',
      status: 'ENABLED',
      enabledAt: '2024-01-10T10:00:00Z'
    }
  } catch (err) {
    error.value = 'خطا در بارگذاری وضعیت ماژول'
    console.error('Error loading module status:', err)
  } finally {
    loading.value.module = false
  }
}

// Actions
async function handleSuggestionAction(suggestion: MatchSuggestion, action: 'like' | 'dismiss') {
  const actionKey = `${suggestion.id}-${action}`
  
  try {
    processingAction.value[actionKey] = true
    
    if (action === 'like') {
      await likeSuggestion(suggestion.id)
      suggestion.status = 'LIKED'
    } else {
      await dismissSuggestion(suggestion.id)
      // Remove from list
      const index = suggestions.value.findIndex(s => s.id === suggestion.id)
      if (index > -1) {
        suggestions.value.splice(index, 1)
      }
    }
  } catch (err) {
    error.value = 'خطا در انجام عملیات'
    console.error('Error handling suggestion action:', err)
  } finally {
    processingAction.value[actionKey] = false
  }
}

function openIntroModal(suggestion: MatchSuggestion) {
  selectedSuggestion.value = suggestion
  introMessage.value = ''
  showIntroModal.value = true
}

async function sendIntroductionRequest() {
  if (!selectedSuggestion.value) return
  
  try {
    await createIntroductionRequest({
      targetId: selectedSuggestion.value.suggestedUserId,
      message: introMessage.value
    })
    
    // Update suggestion status
    selectedSuggestion.value.status = 'REQUESTED'
    
    showIntroModal.value = false
    selectedSuggestion.value = null
    introMessage.value = ''
  } catch (err) {
    error.value = 'خطا در ارسال درخواست معرفی'
    console.error('Error sending introduction request:', err)
  }
}

async function handleRequestResponse(request: IntroductionRequest, action: 'accept' | 'reject') {
  const actionKey = `${request.id}-${action}`
  
  try {
    processingAction.value[actionKey] = true
    
    if (action === 'accept') {
      await acceptRequest(request.id)
      request.status = 'ACCEPTED'
    } else {
      await rejectRequest(request.id)
      request.status = 'REJECTED'
    }
    
    request.respondedAt = new Date().toISOString()
  } catch (err) {
    error.value = 'خطا در پاسخ به درخواست'
    console.error('Error responding to request:', err)
  } finally {
    processingAction.value[actionKey] = false
  }
}

async function handleDisableModule() {
  try {
    await disableModule()
    if (moduleStatus.value) {
      moduleStatus.value.status = 'DISABLED_BY_USER'
      moduleStatus.value.disabledAt = new Date().toISOString()
    }
  } catch (err) {
    error.value = 'خطا در غیرفعال‌سازی ماژول'
    console.error('Error disabling module:', err)
  }
}

// Helper functions
function getProfile(userId: string) {
  return mockProfiles[userId] || {
    name: 'کاربر ناشناس',
    age: 0,
    city: '',
    profession: '',
    bio: '',
    interests: []
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fa-IR')
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700 p-1 shadow-2xl shadow-pink-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-pink-600/90 via-rose-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Decorative elements -->
        <div class="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-6 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Icon name="ph:heart" class="w-8 h-8 text-white" />
          </div>
          
          <BaseHeading as="h1" size="4xl" weight="bold" class="text-white drop-shadow-lg mb-4">
            <span>همسان‌یابی</span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-lg">
            <span>کشف افراد سازگار و مدیریت درخواست‌های آشنایی</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Module Status Alert -->
    <div v-if="moduleStatus && moduleStatus.status !== 'ENABLED'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
      <div class="flex items-center gap-4">
        <Icon name="ph:warning" class="w-6 h-6 text-yellow-600" />
        <div>
          <h3 class="font-semibold text-yellow-800 dark:text-yellow-200">
            ماژول همسان‌یابی غیرفعال است
          </h3>
          <p class="text-yellow-700 dark:text-yellow-300">
            وضعیت: {{ getModuleStatusLabel(moduleStatus.status) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <nav class="px-6 py-4">
          <div class="flex justify-center">
            <div class="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl">
              <button 
                v-for="tab in [
                  { id: 'suggestions', label: 'پیشنهادات', icon: 'ph:users' },
                  { id: 'requests', label: 'درخواست‌ها', icon: 'ph:envelope' },
                  { id: 'settings', label: 'تنظیمات', icon: 'ph:gear' }
                ]"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap"
                :class="activeTab === tab.id 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'"
              >
                <Icon 
                  :name="tab.icon" 
                  class="w-4 h-4 transition-all duration-300" 
                  :class="activeTab === tab.id ? 'text-white' : ''"
                />
                <span class="font-medium">{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Suggestions Tab -->
        <div v-if="activeTab === 'suggestions'" class="space-y-6">
          <!-- Loading State -->
          <div v-if="loading.suggestions" class="flex items-center justify-center py-16">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-300">در حال بارگذاری پیشنهادات...</p>
            </div>
          </div>

          <!-- Suggestions List -->
          <div v-else-if="suggestions.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              v-for="suggestion in suggestions" 
              :key="suggestion.id"
              class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div class="space-y-4">
                <!-- Profile Header -->
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="ph:user" class="w-8 h-8 text-white" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-lg text-gray-900 dark:text-white">
                        {{ getProfile(suggestion.suggestedUserId).name }}
                      </h3>
                      <BaseTag 
                        size="sm" 
                        rounded="full"
                        class="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        {{ getProfile(suggestion.suggestedUserId).age }} سال
                      </BaseTag>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ getProfile(suggestion.suggestedUserId).profession }} • {{ getProfile(suggestion.suggestedUserId).city }}
                    </p>
                  </div>
                </div>

                <!-- Compatibility Score -->
                <div class="bg-white dark:bg-gray-700 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">میزان سازگاری</span>
                    <span class="font-bold text-lg" :class="getCompatibilityScoreColor(suggestion.compatibilityScore)">
                      {{ formatCompatibilityScore(suggestion.compatibilityScore) }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
                      :style="{ width: `${suggestion.compatibilityScore * 100}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Bio -->
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ getProfile(suggestion.suggestedUserId).bio }}
                </p>

                <!-- Interests -->
                <div class="flex flex-wrap gap-2">
                  <BaseTag 
                    v-for="interest in getProfile(suggestion.suggestedUserId).interests.slice(0, 3)"
                    :key="interest"
                    size="sm"
                    rounded="full"
                    class="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300"
                  >
                    {{ interest }}
                  </BaseTag>
                  <BaseTag 
                    v-if="getProfile(suggestion.suggestedUserId).interests.length > 3"
                    size="sm"
                    rounded="full"
                    class="bg-gray-100 text-gray-600 border-gray-200"
                  >
                    +{{ getProfile(suggestion.suggestedUserId).interests.length - 3 }}
                  </BaseTag>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    @click="handleSuggestionAction(suggestion, 'like')"
                    :disabled="processingAction[`${suggestion.id}-like`] || suggestion.status !== 'NEW'"
                    class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    <Icon name="ph:heart" class="w-4 h-4 me-2 inline" />
                    پسندیدن
                  </button>

                  <button
                    v-if="suggestion.status === 'LIKED'"
                    @click="openIntroModal(suggestion)"
                    class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <Icon name="ph:paper-plane" class="w-4 h-4 me-2 inline" />
                    درخواست آشنایی
                  </button>

                  <button
                    v-else
                    @click="handleSuggestionAction(suggestion, 'dismiss')"
                    :disabled="processingAction[`${suggestion.id}-dismiss`] || suggestion.status !== 'NEW'"
                    class="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    <Icon name="ph:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:users" class="w-12 h-12 text-gray-400" />
            </div>
            <BaseHeading as="h3" size="lg" class="text-gray-600 dark:text-gray-400 mb-4">
              <span>پیشنهادی یافت نشد</span>
            </BaseHeading>
            <BaseParagraph class="text-gray-500 dark:text-gray-500">
              <span>در حال حاضر پیشنهاد جدیدی برای شما وجود ندارد.</span>
            </BaseParagraph>
          </div>
        </div>

        <!-- Requests Tab -->
        <div v-if="activeTab === 'requests'" class="space-y-6">
          <!-- Loading State -->
          <div v-if="loading.requests" class="flex items-center justify-center py-16">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-300">در حال بارگذاری درخواست‌ها...</p>
            </div>
          </div>

          <!-- Requests List -->
          <div v-else-if="introductionRequests.length > 0" class="space-y-4">
            <div 
              v-for="request in introductionRequests" 
              :key="request.id"
              class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg border border-gray-200/50 p-6"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="ph:user" class="w-6 h-6 text-white" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      {{ request.requesterId === 'currentUser' ? 
                          `به ${getProfile(request.targetId).name}` : 
                          `از ${getProfile(request.requesterId).name}` }}
                    </h3>
                    <BaseTag 
                      size="sm" 
                      rounded="full"
                      :class="request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              request.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 border-green-200' :
                              'bg-red-100 text-red-700 border-red-200'"
                    >
                      <Icon :name="getRequestStatusIcon(request.status)" class="w-3 h-3 me-1" />
                      {{ getRequestStatusLabel(request.status) }}
                    </BaseTag>
                  </div>
                  
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Icon name="ph:calendar" class="w-4 h-4 inline me-1" />
                    {{ formatDate(request.requestedAt) }}
                  </div>
                  
                  <p v-if="request.message" class="text-sm text-gray-700 dark:text-gray-300 mb-4 bg-white dark:bg-gray-700 rounded-lg p-3">
                    {{ request.message }}
                  </p>

                  <!-- Response Actions (for incoming requests) -->
                  <div v-if="request.requesterId !== 'currentUser' && request.status === 'PENDING'" class="flex gap-3">
                    <button
                      @click="handleRequestResponse(request, 'accept')"
                      :disabled="processingAction[`${request.id}-accept`]"
                      class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      <Icon name="ph:check" class="w-4 h-4 me-2 inline" />
                      پذیرفتن
                    </button>
                    <button
                      @click="handleRequestResponse(request, 'reject')"
                      :disabled="processingAction[`${request.id}-reject`]"
                      class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      <Icon name="ph:x" class="w-4 h-4 me-2 inline" />
                      رد کردن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:envelope" class="w-12 h-12 text-gray-400" />
            </div>
            <BaseHeading as="h3" size="lg" class="text-gray-600 dark:text-gray-400 mb-4">
              <span>درخواستی یافت نشد</span>
            </BaseHeading>
            <BaseParagraph class="text-gray-500 dark:text-gray-500">
              <span>هنوز هیچ درخواست آشنایی‌ای ندارید.</span>
            </BaseParagraph>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <!-- Module Status -->
          <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">وضعیت ماژول</h3>
            
            <div v-if="moduleStatus" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">وضعیت فعلی:</span>
                <BaseTag 
                  size="sm" 
                  rounded="full"
                  :class="moduleStatus.status === 'ENABLED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'"
                >
                  {{ getModuleStatusLabel(moduleStatus.status) }}
                </BaseTag>
              </div>
              
              <div v-if="moduleStatus.status === 'ENABLED'" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="handleDisableModule"
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <Icon name="ph:prohibit" class="w-4 h-4 me-2 inline" />
                  غیرفعال‌کردن همسان‌یابی
                </button>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  با غیرفعال‌کردن، دیگر پیشنهادات دریافت نخواهید کرد
                </p>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">تنظیمات حریم خصوصی</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">نمایش پروفایل</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">پروفایل شما برای دیگران قابل مشاهده باشد</p>
                </div>
                <BaseSwitch v-model="privacySettings.showProfile" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">نمایش عکس پروفایل</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">عکس شما برای افراد بالقوه نمایش داده شود</p>
                </div>
                <BaseSwitch v-model="privacySettings.showPhoto" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">نمایش سن دقیق</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">سن دقیق شما نمایش داده شود</p>
                </div>
                <BaseSwitch v-model="privacySettings.showExactAge" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">وضعیت آنلاین</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">وضعیت آنلاین بودن شما نمایش داده شود</p>
                </div>
                <BaseSwitch v-model="privacySettings.showOnlineStatus" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">نمایش علایق</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">علایق شما در پروفایل نمایش داده شود</p>
                </div>
                <BaseSwitch v-model="privacySettings.showInterests" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">دریافت اعلان‌ها</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">اطلاع از پیشنهادات و درخواست‌های جدید</p>
                </div>
                <BaseSwitch v-model="privacySettings.receiveNotifications" />
              </div>
            </div>

            <!-- Advanced Privacy Controls -->
            <div class="mt-6 space-y-6">
              <!-- Profile Visibility -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">سطح نمایش پروفایل</h4>
                <div class="grid grid-cols-1 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="public"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 peer-checked:shadow-lg peer-checked:shadow-primary-500/10 dark:peer-checked:bg-primary-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:globe" class="w-5 h-5 text-primary-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            عمومی
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            همه کاربران می‌توانند پروفایل شما را ببینند
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="verified"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 peer-checked:shadow-lg peer-checked:shadow-primary-500/10 dark:peer-checked:bg-primary-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:shield-check" class="w-5 h-5 text-primary-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            محدود
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            فقط کاربران تایید شده پروفایل شما را می‌بینند
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="private"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 peer-checked:shadow-lg peer-checked:shadow-primary-500/10 dark:peer-checked:bg-primary-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:lock" class="w-5 h-5 text-primary-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            خصوصی
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            پروفایل شما مخفی است و فقط درخواست‌های شما نمایش داده می‌شود
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <!-- Message Permissions -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">مجوز ارسال پیام</h4>
                <div class="grid grid-cols-1 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="everyone"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:users" class="w-5 h-5 text-success-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            همه کاربران
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            هر کاربری می‌تواند برای شما پیام ارسال کند
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="verified"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:shield-check" class="w-5 h-5 text-success-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            کاربران تایید شده
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            فقط کاربران تایید شده می‌توانند پیام ارسال کنند
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="none"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:prohibit" class="w-5 h-5 text-success-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            هیچ کس
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            امکان دریافت پیام از کاربران دیگر وجود ندارد
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <!-- Contact Sharing -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">اشتراک اطلاعات تماس</h4>
                <div class="grid grid-cols-1 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="full"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:share-network" class="w-5 h-5 text-info-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            کامل
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            همه اطلاعات تماس شما با افراد سازگار به اشتراک گذاشته می‌شود
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="limited"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:eye" class="w-5 h-5 text-info-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            محدود
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            فقط اطلاعات پایه برای ارتباط اولیه به اشتراک گذاشته می‌شود
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="none"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 text-right transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:eye-slash" class="w-5 h-5 text-info-500" />
                        <div>
                          <BaseHeading as="h5" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                            هیچ کدام
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-500 dark:text-muted-400">
                            هیچ اطلاعات تماس شما به اشتراک گذاشته نمی‌شود
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Introduction Request Modal -->
    <TairoModal 
      :open="showIntroModal" 
      @close="showIntroModal = false"
      size="md"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 sm:p-5">
          <div class="flex items-center gap-2">
            <div class="flex size-10 items-center justify-center rounded-full bg-pink-500/20 text-pink-500">
              <Icon name="ph:paper-plane" class="size-5" />
            </div>
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              ارسال درخواست آشنایی
            </h3>
          </div>
          <BaseButtonClose @click="showIntroModal = false" />
        </div>
      </template>

      <div v-if="selectedSuggestion" class="p-4 sm:p-5">
        <!-- Profile Info -->
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:user" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-muted-900 dark:text-white mb-1">
            {{ getProfile(selectedSuggestion.suggestedUserId).name }}
          </h3>
          <BaseParagraph class="text-muted-500 dark:text-muted-400">
            {{ getProfile(selectedSuggestion.suggestedUserId).profession }} • {{ getProfile(selectedSuggestion.suggestedUserId).city }}
          </BaseParagraph>
          <div class="mt-3">
            <BaseTag color="success" rounded="full" size="sm">
              <Icon name="ph:heart" class="w-4 h-4 me-1" />
              سازگاری {{ formatCompatibilityScore(selectedSuggestion.compatibilityScore) }}
            </BaseTag>
          </div>
        </div>

        <!-- Message Input -->
        <div class="mb-6">
          <BaseTextarea
            v-model="introMessage"
            label="پیام معرفی (اختیاری)"
            placeholder="پیام کوتاهی برای معرفی خود بنویسید..."
            rows="4"
            class="w-full"
          />
          <BaseParagraph size="xs" class="text-muted-400 mt-2">
            این پیام همراه با درخواست معرفی شما ارسال خواهد شد.
          </BaseParagraph>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <BaseButton
            @click="sendIntroductionRequest"
            color="primary"
          >
            <Icon name="ph:paper-plane" class="w-4 h-4 me-2" />
            ارسال درخواست
          </BaseButton>
          <BaseButton
            @click="showIntroModal = false"
            variant="outline"
          >
            انصراف
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>