<script setup lang="ts">
import type { MatchSuggestion, IntroductionRequest, MatchmakingModule } from '~/composables/matchmaking'

definePageMeta({
  title: 'همسان‌یابی - نمونه',
  preview: {
    title: 'Matchmaking Mock',
    description: 'Mock version with sample data for development and testing',
    categories: ['matchmaking', 'development'],
    src: '/img/screens/matchmaking-mock.png',
    srcDark: '/img/screens/matchmaking-mock-dark.png',
    order: 4,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Composable utility functions (not API calls)
const {
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

// Extended mock user profiles for display
const mockProfiles: Record<string, {
  name: string
  age: number
  city: string
  profession: string
  bio: string
  interests: string[]
  avatar?: string
  education?: string
  height?: string
  religion?: string
}> = {
  'user1': {
    name: 'سارا احمدی',
    age: 28,
    city: 'تهران',
    profession: 'روان‌شناس بالینی',
    bio: 'علاقه‌مند به کتاب‌خوانی، طبیعت‌گردی و یادگیری زبان‌های جدید. به دنبال رابطه‌ای پایدار و معنادار هستم.',
    interests: ['کتاب‌خوانی', 'طبیعت‌گردی', 'فیلم‌های اروپایی', 'موسیقی کلاسیک', 'یوگا', 'عکاسی'],
    education: 'کارشناسی ارشد روان‌شناسی',
    height: '165 سانتی‌متر',
    religion: 'مسلمان'
  },
  'user2': {
    name: 'نسرین رضایی',
    age: 32,
    city: 'اصفهان',
    profession: 'مهندس نرم‌افزار',
    bio: 'فعال در حوزه فناوری، ورزشکار و علاقه‌مند به هنر. دوست دارم با افراد خلاق و پرانرژی آشنا شوم.',
    interests: ['برنامه‌نویسی', 'شنا', 'عکاسی', 'سفر', 'موسیقی کلاسیک', 'طبیعت‌گردی'],
    education: 'کارشناسی مهندسی کامپیوتر',
    height: '168 سانتی‌متر',
    religion: 'مسلمان'
  },
  'user3': {
    name: 'مریم حسینی',
    age: 25,
    city: 'شیراز', 
    profession: 'معلم ابتدایی',
    bio: 'عاشق آموزش، طبیعت و فعالیت‌های اجتماعی. به دنبال شریک زندگی‌ای مهربان و متعهد هستم.',
    interests: ['آموزش', 'طبیعت', 'نقاشی آبرنگ', 'آشپزی سنتی', 'کتاب‌های کودک'],
    education: 'کارشناسی تربیت معلم',
    height: '160 سانتی‌متر',
    religion: 'مسلمان'
  },
  'user4': {
    name: 'امیرحسین کریمی',
    age: 30,
    city: 'مشهد',
    profession: 'پزشک عمومی',
    bio: 'به خدمت به جامعه علاقه‌مند هستم. اوقات فراغتم را به مطالعه و ورزش می‌گذرانم.',
    interests: ['پزشکی', 'تنیس', 'کتاب‌های علمی', 'سینما', 'سفر'],
    education: 'دکترای پزشکی',
    height: '180 سانتی‌متر',
    religion: 'مسلمان'
  },
  'user5': {
    name: 'زهرا موسوی',
    age: 26,
    city: 'تبریز',
    profession: 'گرافیست',
    bio: 'طراح گرافیک با علاقه به هنرهای تجسمی. دوست دارم دنیا را از زاویه‌های مختلف ببینم.',
    interests: ['طراحی گرافیک', 'نقاشی', 'موزه‌گردی', 'قهوه‌های تخصصی', 'فیلم‌های مستقل'],
    education: 'کارشناسی گرافیک',
    height: '162 سانتی‌متر',
    religion: 'مسلمان'
  },
  'user6': {
    name: 'فاطمه نوری',
    age: 29,
    city: 'کرج',
    profession: 'حسابدار',
    bio: 'فرد منظم و برنامه‌ریزی‌شده‌ای هستم که به خانواده و دوستان اهمیت زیادی می‌دهم.',
    interests: ['حسابداری', 'شطرنج', 'باغبانی', 'خانواده', 'فیلم‌های کمدی'],
    education: 'کارشناسی حسابداری',
    height: '163 سانتی‌متر',
    religion: 'مسلمان'
  }
}

// Enhanced mock suggestions data with varied statuses
const mockSuggestions: MatchSuggestion[] = [
  {
    id: 'sug1',
    suggestedUserId: 'user1',
    compatibilityScore: 0.92,
    analysis: {
      compatibilityFactors: ['علایق مشترک قوی', 'اهداف زندگی مشابه', 'شخصیت بسیار سازگار', 'ارزش‌های یکسان'],
      strengths: ['ارتباط عمیق و معنادار', 'درک کامل یکدیگر', 'احترام متقابل', 'حمایت عاطفی قوی'],
      challenges: ['تفاوت جزئی در سبک زندگی', 'نیاز به هماهنگی بیشتر در برنامه‌ریزی'],
      recommendations: ['گذراندن زمان کیفی بیشتر با یکدیگر', 'صحبت صادقانه درباره اهداف آینده', 'شرکت در فعالیت‌های مشترک'],
      summary: 'سازگاری فوق‌العاده بالا با پتانسیل رابطه بسیار موفق و پایدار'
    },
    status: 'NEW',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sug2', 
    suggestedUserId: 'user2',
    compatibilityScore: 0.78,
    analysis: {
      compatibilityFactors: ['ارزش‌های مشترک', 'نگرش مثبت به زندگی', 'انرژی مشابه'],
      strengths: ['صداقت و شفافیت', 'حمایت از اهداف یکدیگر', 'روحیه مثبت'],
      challenges: ['تفاوت در علایق ورزشی', 'سبک ارتباط متفاوت', 'اولویت‌بندی متفاوت'],
      recommendations: ['کشف علایق مشترک جدید', 'بهبود مهارت‌های ارتباطی', 'احترام به تفاوت‌ها'],
      summary: 'سازگاری خوب با امکان رشد و توسعه رابطه'
    },
    status: 'LIKED',
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: 'sug3',
    suggestedUserId: 'user3', 
    compatibilityScore: 0.85,
    analysis: {
      compatibilityFactors: ['شخصیت مکمل یکدیگر', 'هدف مشترک تشکیل خانواده', 'نگرش مشابه به زندگی'],
      strengths: ['صبر و مدارا بالا', 'تعهد قوی', 'مهربانی و دلسوزی'],
      challenges: ['تفاوت در انرژی اجتماعی', 'سبک تصمیم‌گیری متفاوت'],
      recommendations: ['درک عمیق‌تر نیازهای یکدیگر', 'تمرین مهارت‌های حل تعارض', 'صبر در ساخت رابطه'],
      summary: 'سازگاری بالا با پتانسیل عالی برای رابطه دوام‌دار'
    },
    status: 'REQUESTED',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'sug4',
    suggestedUserId: 'user4',
    compatibilityScore: 0.67,
    analysis: {
      compatibilityFactors: ['احترام به حرفه یکدیگر', 'جدیت در زندگی'],
      strengths: ['مسئولیت‌پذیری', 'تعهد به اهداف'],
      challenges: ['تفاوت در اوقات فراغت', 'برنامه کاری سنگین', 'کمبود زمان مشترک'],
      recommendations: ['برنامه‌ریزی دقیق‌تر برای وقت گذرانی', 'درک بیشتر مسئولیت‌های شغلی'],
      summary: 'سازگاری متوسط با نیاز به تلاش بیشتر'
    },
    status: 'VIEWED',
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 'sug5',
    suggestedUserId: 'user5',
    compatibilityScore: 0.74,
    analysis: {
      compatibilityFactors: ['خلاقیت مشترک', 'نگرش هنری', 'علاقه به کشف تجربه‌های جدید'],
      strengths: ['خلاقیت و نوآوری', 'انعطاف‌پذیری', 'نگرش باز به دنیا'],
      challenges: ['تفاوت در سبک زندگی', 'برخورد متفاوت با مسائل مالی'],
      recommendations: ['تعریف اهداف مشترک', 'احترام به سبک زندگی یکدیگر'],
      summary: 'سازگاری خوب با امکان رابطه خلاقانه و پویا'
    },
    status: 'NEW',
    createdAt: '2024-01-11T11:20:00Z'
  },
  {
    id: 'sug6',
    suggestedUserId: 'user6',
    compatibilityScore: 0.71,
    analysis: {
      compatibilityFactors: ['ارزش‌های خانوادگی', 'نگرش سنتی', 'ثبات طلبی'],
      strengths: ['پایداری و ثبات', 'تعهد خانوادگی', 'قابلیت اعتماد بالا'],
      challenges: ['تفاوت در میزان اجتماعی بودن', 'سبک تفریح متفاوت'],
      recommendations: ['ایجاد تعادل بین فعالیت‌های خانگی و اجتماعی', 'کشف علایق مشترک جدید'],
      summary: 'سازگاری خوب با تمرکز بر ارزش‌های خانوادگی'
    },
    status: 'NEW',
    createdAt: '2024-01-10T14:10:00Z'
  }
]

// Enhanced mock introduction requests with more variety
const mockIntroRequests: IntroductionRequest[] = [
  {
    id: 'req1',
    requesterId: 'user2',
    targetId: 'currentUser',
    status: 'PENDING',
    message: 'سلام! پروفایل شما را دیدم و فکر می‌کنم نقاط مشترک جالبی داریم. خصوصاً علاقه مشترکمان به فناوری و عکاسی توجهم را جلب کرد. خوشحال می‌شوم بیشتر آشنا شویم و درباره تجربه‌هایمان صحبت کنیم.',
    requestedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'req2',
    requesterId: 'currentUser', 
    targetId: 'user1',
    status: 'ACCEPTED',
    message: 'با توجه به علایق مشترکمان در حوزه روان‌شناسی و کتاب‌خوانی، فکر می‌کنم می‌توانیم گفتگوهای جالبی داشته باشیم. خوشحال می‌شوم بیشتر صحبت کنیم.',
    requestedAt: '2024-01-15T11:45:00Z',
    respondedAt: '2024-01-15T18:30:00Z'
  },
  {
    id: 'req3',
    requesterId: 'user6',
    targetId: 'currentUser',
    status: 'PENDING',
    message: 'سلام وقت بخیر. پس از مطالعه پروفایل شما، احساس کردم که نگرش‌های مشابهی نسبت به زندگی و خانواده داریم. امیدوارم فرصتی برای گفتگو و آشنایی بیشتر پیدا کنیم.',
    requestedAt: '2024-01-14T09:30:00Z'
  },
  {
    id: 'req4',
    requesterId: 'currentUser',
    targetId: 'user5',
    status: 'REJECTED',
    message: 'علاقه مشترکمان به هنر و خلاقیت توجهم را جلب کرد. دوست دارم درباره پروژه‌های هنری و تجربه‌هایتان بشنوم.',
    requestedAt: '2024-01-13T16:15:00Z',
    respondedAt: '2024-01-14T10:22:00Z'
  },
  {
    id: 'req5',
    requesterId: 'user1',
    targetId: 'currentUser',
    status: 'ACCEPTED',
    message: 'با سلام و احترام. علاقه مشترک ما به کتاب‌خوانی و طبیعت‌گردی بسیار جالب توجه بود. امیدوارم بتوانیم آشنایی خوبی داشته باشیم.',
    requestedAt: '2024-01-12T13:45:00Z',
    respondedAt: '2024-01-12T19:10:00Z'
  },
  {
    id: 'req6',
    requesterId: 'currentUser',
    targetId: 'user3',
    status: 'PENDING',
    message: 'سلام مریم خانم. علاقه شما به آموزش و کار با کودکان و همچنین شخصیت مهربان شما از پروفایلتان مشهود است. خوشحال می‌شوم بیشتر آشنا شویم.',
    requestedAt: '2024-01-11T20:00:00Z'
  }
]

// Load data with pure mock (no API calls)
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
    // Simulate API loading time
    await new Promise(resolve => setTimeout(resolve, 800))
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
    // Simulate API loading time
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    // Simulate API loading time
    await new Promise(resolve => setTimeout(resolve, 400))
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

// Mock actions (simulate API calls)
async function handleSuggestionAction(suggestion: MatchSuggestion, action: 'like' | 'dismiss') {
  const actionKey = `${suggestion.id}-${action}`
  
  try {
    processingAction.value[actionKey] = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (action === 'like') {
      suggestion.status = 'LIKED'
    } else {
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create new request and add to list
    const newRequest: IntroductionRequest = {
      id: `req${Date.now()}`,
      requesterId: 'currentUser',
      targetId: selectedSuggestion.value.suggestedUserId,
      status: 'PENDING',
      message: introMessage.value,
      requestedAt: new Date().toISOString()
    }
    
    introductionRequests.value.unshift(newRequest)
    
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    if (action === 'accept') {
      request.status = 'ACCEPTED'
    } else {
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
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
    interests: [],
    education: '',
    height: '',
    religion: ''
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getAgeRange(age: number) {
  if (age < 25) return 'جوان'
  if (age < 35) return 'میانسال'
  return 'بالغ'
}

function viewProfile(userId: string) {
  const profile = getProfile(userId)
  alert(`مشاهده پروفایل: ${profile.name}\n\nسن: ${profile.age} سال\nشهر: ${profile.city}\nشغل: ${profile.profession}\n\nدرباره:\n${profile.bio}\n\nتحصیلات: ${profile.education}\nقد: ${profile.height}`)
  // TODO: Navigate to profile page or open profile modal
  console.log('Viewing profile for user:', userId, profile)
}

</script>

<template>
  <div class="space-y-8">
    <!-- Page Header with Mock Badge -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700 p-1 shadow-2xl shadow-pink-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-pink-600/90 via-rose-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Mock Badge -->
        <div class="absolute top-4 left-4">
          <div class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            نسخه آزمایشی
          </div>
        </div>
        
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
            <span>کشف افراد سازگار و مدیریت درخواست‌های آشنایی - نسخه آزمایشی</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Icon name="ph:users" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ suggestions.length }}</div>
            <div class="text-sm text-blue-600 dark:text-blue-300">پیشنهادات فعال</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Icon name="ph:heart" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-green-900 dark:text-green-100">
              {{ suggestions.filter(s => s.status === 'LIKED').length }}
            </div>
            <div class="text-sm text-green-600 dark:text-green-300">پسندیده‌ها</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon name="ph:envelope" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ introductionRequests.length }}</div>
            <div class="text-sm text-purple-600 dark:text-purple-300">درخواست‌ها</div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Icon name="ph:check-circle" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {{ introductionRequests.filter(r => r.status === 'ACCEPTED').length }}
            </div>
            <div class="text-sm text-orange-600 dark:text-orange-300">پذیرفته‌شده</div>
          </div>
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
                <!-- Status Badge -->
                <div class="flex justify-between items-start mb-4">
                  <BaseTag 
                    size="sm" 
                    rounded="full"
                    :class="suggestion.status === 'NEW' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            suggestion.status === 'LIKED' ? 'bg-green-100 text-green-700 border-green-200' :
                            suggestion.status === 'REQUESTED' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'"
                  >
                    {{ getSuggestionStatusLabel(suggestion.status) }}
                  </BaseTag>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(suggestion.createdAt).split(' ')[0] }}
                  </div>
                </div>

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
                      {{ getProfile(suggestion.suggestedUserId).profession }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      {{ getProfile(suggestion.suggestedUserId).city }} • {{ getProfile(suggestion.suggestedUserId).education }}
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
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {{ suggestion.analysis.summary }}
                  </div>
                </div>

                <!-- Bio -->
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ getProfile(suggestion.suggestedUserId).bio }}
                </p>

                <!-- Interests -->
                <div class="flex flex-wrap gap-2">
                  <BaseTag 
                    v-for="interest in getProfile(suggestion.suggestedUserId).interests.slice(0, 4)"
                    :key="interest"
                    size="sm"
                    rounded="full"
                    class="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300"
                  >
                    {{ interest }}
                  </BaseTag>
                  <BaseTag 
                    v-if="getProfile(suggestion.suggestedUserId).interests.length > 4"
                    size="sm"
                    rounded="full"
                    class="bg-gray-100 text-gray-600 border-gray-200"
                  >
                    +{{ getProfile(suggestion.suggestedUserId).interests.length - 4 }}
                  </BaseTag>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    v-if="suggestion.status === 'NEW'"
                    @click="handleSuggestionAction(suggestion, 'like')"
                    :disabled="processingAction[`${suggestion.id}-like`]"
                    class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    <Icon 
                      :name="processingAction[`${suggestion.id}-like`] ? 'ph:spinner' : 'ph:heart'" 
                      class="w-4 h-4 me-2 inline" 
                      :class="processingAction[`${suggestion.id}-like`] ? 'animate-spin' : ''"
                    />
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
                    v-if="suggestion.status === 'REQUESTED'"
                    disabled
                    class="flex-1 bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-xl cursor-not-allowed"
                  >
                    <Icon name="ph:check" class="w-4 h-4 me-2 inline" />
                    درخواست ارسال شده
                  </button>

                  <button
                    v-if="suggestion.status === 'NEW'"
                    @click="handleSuggestionAction(suggestion, 'dismiss')"
                    :disabled="processingAction[`${suggestion.id}-dismiss`]"
                    class="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    <Icon 
                      :name="processingAction[`${suggestion.id}-dismiss`] ? 'ph:spinner' : 'ph:x'" 
                      class="w-4 h-4" 
                      :class="processingAction[`${suggestion.id}-dismiss`] ? 'animate-spin' : ''"
                    />
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
                    درخواست: {{ formatDate(request.requestedAt) }}
                    <span v-if="request.respondedAt" class="block">
                      <Icon name="ph:check" class="w-4 h-4 inline me-1" />
                      پاسخ: {{ formatDate(request.respondedAt) }}
                    </span>
                  </div>
                  
                  <p v-if="request.message" class="text-sm text-gray-700 dark:text-gray-300 mb-4 bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <Icon name="ph:quotes" class="w-4 h-4 inline me-1 text-gray-400" />
                    {{ request.message }}
                  </p>

                  <!-- Profile View Button (always visible) -->
                  <div class="flex items-center justify-between">
                    <button
                      @click="viewProfile(request.requesterId !== 'currentUser' ? request.requesterId : request.targetId)"
                      class="text-pink-600 hover:text-pink-700 font-medium py-1 px-3 rounded-lg border border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 text-sm"
                    >
                      <Icon name="ph:user-circle" class="w-4 h-4 me-1 inline" />
                      مشاهده پروفایل
                    </button>

                    <!-- Response Actions (for incoming requests) -->
                    <div v-if="request.requesterId !== 'currentUser' && request.status === 'PENDING'" class="flex gap-3">
                      <button
                        @click="handleRequestResponse(request, 'accept')"
                        :disabled="processingAction[`${request.id}-accept`]"
                        class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                      >
                        <Icon 
                          :name="processingAction[`${request.id}-accept`] ? 'ph:spinner' : 'ph:check'" 
                          class="w-4 h-4 me-2 inline" 
                          :class="processingAction[`${request.id}-accept`] ? 'animate-spin' : ''"
                        />
                        پذیرفتن
                      </button>
                      <button
                        @click="handleRequestResponse(request, 'reject')"
                        :disabled="processingAction[`${request.id}-reject`]"
                        class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                      >
                        <Icon 
                          :name="processingAction[`${request.id}-reject`] ? 'ph:spinner' : 'ph:x'" 
                          class="w-4 h-4 me-2 inline" 
                          :class="processingAction[`${request.id}-reject`] ? 'animate-spin' : ''"
                        />
                        رد کردن
                      </button>
                    </div>
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
          <!-- Mock Data Notice -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <Icon name="ph:info" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  اطلاعات نسخه آزمایشی
                </h3>
                <p class="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  این صفحه از داده‌های آزمایشی استفاده می‌کند و عملیات واقعی انجام نمی‌دهد.
                </p>
                <ul class="text-blue-600 dark:text-blue-400 text-sm space-y-1">
                  <li>• {{ suggestions.length }} پیشنهاد فعال</li>
                  <li>• {{ introductionRequests.length }} درخواست آشنایی</li>
                  <li>• تمام عملیات شبیه‌سازی شده است</li>
                </ul>
              </div>
            </div>
          </div>

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
              
              <div v-if="moduleStatus.enabledAt" class="text-sm text-gray-600 dark:text-gray-400">
                فعال شده در: {{ formatDate(moduleStatus.enabledAt) }}
              </div>
              
              <div v-if="moduleStatus.status === 'ENABLED'" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="handleDisableModule"
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <Icon name="ph:prohibit" class="w-4 h-4 me-2 inline" />
                  غیرفعال‌کردن همسان‌یابی (آزمایشی)
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
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Icon name="ph:user" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">نمایش پروفایل</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">پروفایل شما برای دیگران قابل مشاهده باشد</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.showProfile" />
                </div>
              </BaseCard>

              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Icon name="ph:camera" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">نمایش عکس پروفایل</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">عکس شما برای افراد بالقوه نمایش داده شود</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.showPhoto" />
                </div>
              </BaseCard>

              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Icon name="ph:calendar" class="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">نمایش سن دقیق</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">سن دقیق شما نمایش داده شود</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.showExactAge" />
                </div>
              </BaseCard>

              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Icon name="ph:circle" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">وضعیت آنلاین</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">وضعیت آنلاین بودن شما نمایش داده شود</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.showOnlineStatus" />
                </div>
              </BaseCard>

              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <Icon name="ph:heart" class="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">نمایش علایق</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">علایق شما در پروفایل نمایش داده شود</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.showInterests" />
                </div>
              </BaseCard>
              
              <BaseCard class="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Icon name="ph:bell" class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">دریافت اعلان‌ها</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">اطلاع از پیشنهادات و درخواست‌های جدید</p>
                    </div>
                  </div>
                  <BaseSwitch v-model="privacySettings.receiveNotifications" />
                </div>
              </BaseCard>
            </div>

            <!-- Advanced Privacy Controls -->
            <div class="mt-6 space-y-6">
              <!-- Profile Visibility -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900 dark:text-white">سطح نمایش پروفایل</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">انتخاب شده:</span>
                    <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                         :class="privacySettings.profileVisibility === 'public' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                 privacySettings.profileVisibility === 'verified' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'">
                      <Icon :name="privacySettings.profileVisibility === 'public' ? 'ph:globe' :
                                   privacySettings.profileVisibility === 'verified' ? 'ph:shield-check' : 'ph:lock'" 
                            class="w-3 h-3" />
                      <span>{{ 
                        privacySettings.profileVisibility === 'public' ? 'عمومی' :
                        privacySettings.profileVisibility === 'verified' ? 'محدود' : 'خصوصی'
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="public"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/10 dark:peer-checked:bg-blue-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-blue-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:globe" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">عمومی</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">همه کاربران می‌توانند پروفایل شما را ببینند</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="verified"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-yellow-500 peer-checked:bg-yellow-50 peer-checked:text-yellow-600 peer-checked:shadow-lg peer-checked:shadow-yellow-500/10 dark:peer-checked:bg-yellow-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-yellow-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:shield-check" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">محدود</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-yellow-500 peer-checked:bg-yellow-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">فقط کاربران تایید شده پروفایل شما را می‌بینند</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.profileVisibility"
                    value="private"
                    name="profileVisibility"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600 peer-checked:shadow-lg peer-checked:shadow-red-500/10 dark:peer-checked:bg-red-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-red-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:lock" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">خصوصی</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">پروفایل شما مخفی است و فقط درخواست‌های شما نمایش داده می‌شود</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <!-- Message Permissions -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900 dark:text-white">مجوز ارسال پیام</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">انتخاب شده:</span>
                    <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                         :class="privacySettings.messagePermissions === 'everyone' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                 privacySettings.messagePermissions === 'verified' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'">
                      <Icon :name="privacySettings.messagePermissions === 'everyone' ? 'ph:users' :
                                   privacySettings.messagePermissions === 'verified' ? 'ph:shield-check' : 'ph:prohibit'" 
                            class="w-3 h-3" />
                      <span>{{ 
                        privacySettings.messagePermissions === 'everyone' ? 'همه کاربران' :
                        privacySettings.messagePermissions === 'verified' ? 'کاربران تایید شده' : 'هیچ کس'
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="everyone"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 peer-checked:shadow-lg peer-checked:shadow-green-500/10 dark:peer-checked:bg-green-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-green-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:users" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">همه کاربران</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">هر کاربری می‌تواند برای شما پیام ارسال کند</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="verified"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/10 dark:peer-checked:bg-blue-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-blue-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:shield-check" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">کاربران تایید شده</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">فقط کاربران تایید شده می‌توانند پیام ارسال کنند</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.messagePermissions"
                    value="none"
                    name="messagePermissions"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600 peer-checked:shadow-lg peer-checked:shadow-red-500/10 dark:peer-checked:bg-red-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-red-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:prohibit" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">هیچ کس</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">امکان دریافت پیام از کاربران دیگر وجود ندارد</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <!-- Contact Sharing -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900 dark:text-white">اشتراک اطلاعات تماس</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">انتخاب شده:</span>
                    <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                         :class="privacySettings.contactSharing === 'full' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                 privacySettings.contactSharing === 'limited' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'">
                      <Icon :name="privacySettings.contactSharing === 'full' ? 'ph:address-book' :
                                   privacySettings.contactSharing === 'limited' ? 'ph:phone' : 'ph:x-circle'" 
                            class="w-3 h-3" />
                      <span>{{ 
                        privacySettings.contactSharing === 'full' ? 'کامل' :
                        privacySettings.contactSharing === 'limited' ? 'محدود' : 'هیچ کدام'
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="full"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 peer-checked:shadow-lg peer-checked:shadow-green-500/10 dark:peer-checked:bg-green-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-green-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:address-book" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">کامل</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">همه اطلاعات تماس شما با افراد سازگار به اشتراک گذاشته می‌شود</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="limited"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-yellow-500 peer-checked:bg-yellow-50 peer-checked:text-yellow-600 peer-checked:shadow-lg peer-checked:shadow-yellow-500/10 dark:peer-checked:bg-yellow-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-yellow-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:phone" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">محدود</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-yellow-500 peer-checked:bg-yellow-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">فقط اطلاعات پایه برای ارتباط اولیه به اشتراک گذاشته می‌شود</p>
                        </div>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>

                  <BaseRadioHeadless
                    v-model="privacySettings.contactSharing"
                    value="none"
                    name="contactSharing"
                  >
                    <BaseCard class="group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg peer-checked:!border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600 peer-checked:shadow-lg peer-checked:shadow-red-500/10 dark:peer-checked:bg-red-950/20">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-[.peer:checked]:bg-red-500 group-[.peer:checked]:text-white transition-colors">
                          <Icon name="ph:x-circle" class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h4 class="font-medium text-gray-900 dark:text-white">هیچ کدام</h4>
                            <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition-colors">
                              <Icon name="ph:check" class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">هیچ اطلاعات تماس شما به اشتراک گذاشته نمی‌شود</p>
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

        <!-- About Section -->
        <div class="text-right bg-muted-100 dark:bg-muted-800 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-muted-900 dark:text-white mb-2">درباره این شخص:</h4>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ getProfile(selectedSuggestion.suggestedUserId).bio }}
          </BaseParagraph>
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
            این پیام به عنوان درخواست آشنایی ارسال خواهد شد.
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