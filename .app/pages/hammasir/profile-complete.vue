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

// Mock user profile data based on UserProfile interface
const userProfile = ref<UserProfile>({
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
})

// Additional analytics data (keeping for display purposes)
const analyticsData = ref({
  
  personality: {
    type: 'ENFJ-A',
    factors: {
      extraversion: 72,
      agreeableness: 83,
      conscientiousness: 69,
      neuroticism: 58,
      openness: 76
    },
    lastUpdated: '1403/03/15',
    source: 'آزمون NEO'
  },
  goals: {
    primary: 'تشکیل خانواده مستحکم',
    secondary: ['رشد شخصی', 'استقلال مالی', 'تعادل کار و زندگی'],
    motivations: ['عشق و صمیمیت', 'امنیت عاطفی', 'رشد مشترک'],
    lastUpdated: '1403/03/12',
    source: 'آزمون ارزش‌های زندگی'
  },
  compatibility: {
    score: 82,
    preferredTraits: ['صداقت', 'همدلی', 'مسئولیت‌پذیری'],
    lifestyle: 'متعادل و فعال',
    lastUpdated: '1403/03/18',
    source: 'تحلیل جامع سازگاری'
  },
  counselorNotes: {
    strengths: [
      'توانایی ارتباطی بالا',
      'انعطاف‌پذیری در مواجهه با تغییرات',
      'تعهد قوی به اهداف شخصی'
    ],
    criticalAreas: [
      'مدیریت استرس در شرایط چالش‌برانگیز',
      'تقویت اعتماد به نفس در تصمیم‌گیری‌های مهم'
    ],
    recommendations: [
      'شرکت در دوره مدیریت استرس',
      'تمرین تکنیک‌های مدیتیشن',
      'توسعه مهارت‌های حل مسئله'
    ],
    nextSession: '1403/04/20',
    counselor: 'دکتر مریم احمدی',
    lastUpdated: '1403/04/10'
  },
  communication: {
    style: 'فعال و همدلانه',
    conflictResolution: 'مذاکره و توافق',
    emotionalExpression: 'بالا',
    listeningSkills: 78,
    lastUpdated: '1403/03/20',
    source: 'آزمون مهارت‌های ارتباطی'
  },
  financialProfile: {
    managementStyle: 'محتاط و برنامه‌ریز',
    riskTolerance: 'متوسط',
    savingsGoals: ['خانه', 'تحصیل فرزندان', 'بازنشستگی'],
    monthlyBudget: 'تنظیم شده',
    lastUpdated: '1403/03/22',
    source: 'مشاوره مالی'
  },
  lifestylePreferences: {
    workLifeBalance: 'بالا',
    socialActivity: 'فعال',
    hobbies: ['مطالعه', 'ورزش', 'سفر', 'آشپزی'],
    familyOrientation: 'بالا',
    healthFocus: 'متوسط تا بالا',
    lastUpdated: '1403/03/25',
    source: 'پرسش‌نامه سبک زندگی'
  },
  completionStatus: {
    demographics: { completed: true, score: 100, lastUpdated: '1403/03/10' },
    personality: { completed: true, score: 85, lastUpdated: '1403/03/15' },
    values: { completed: true, score: 90, lastUpdated: '1403/03/12' },
    goals: { completed: false, score: 60, promoted: true, deadline: '1403/04/15' },
    communication: { completed: true, score: 78, lastUpdated: '1403/03/20' },
    financial: { completed: true, score: 88, lastUpdated: '1403/03/22' },
    lifestyle: { completed: true, score: 92, lastUpdated: '1403/03/25' },
    compatibility: { completed: true, score: 95, lastUpdated: '1403/03/18' },
    readiness: { completed: false, score: 30, locked: true, requires: 'تکمیل بخش اهداف' }
  },
  assessmentHistory: [
    {
      id: 1,
      name: 'آزمون شخصیت NEO',
      type: 'personality',
      completedAt: '1403/03/15',
      score: 85,
      status: 'completed',
      resultSummary: 'شخصیت برون‌گرا با ثبات عاطفی مناسب'
    },
    {
      id: 2,
      name: 'آزمون ارزش‌های زندگی',
      type: 'values',
      completedAt: '1403/03/12',
      score: 90,
      status: 'completed',
      resultSummary: 'اولویت بالا برای خانواده و رشد شخصی'
    },
    {
      id: 3,
      name: 'آزمون مهارت‌های ارتباطی',
      type: 'communication',
      completedAt: '1403/03/20',
      score: 78,
      status: 'completed',
      resultSummary: 'مهارت‌های قوی گوش دادن، نیاز به تقویت بیان احساسات'
    },
    {
      id: 4,
      name: 'مشاوره مالی',
      type: 'financial',
      completedAt: '1403/03/22',
      score: 88,
      status: 'completed',
      resultSummary: 'آگاهی مالی خوب، برنامه‌ریزی مناسب'
    },
    {
      id: 5,
      name: 'آزمون سازگاری ازدواج',
      type: 'compatibility',
      completedAt: '1403/03/18',
      score: 95,
      status: 'completed',
      resultSummary: 'آمادگی بالا برای روابط طولانی‌مدت'
    }
  ],
  growthMetrics: {
    personalGrowth: 78,
    relationshipSkills: 82,
    emotionalMaturity: 75,
    lifeSkills: 88,
    overallReadiness: 81,
    improvementAreas: [
      { area: 'مدیریت استرس', current: 65, target: 80, priority: 'بالا' },
      { area: 'بیان احساسات', current: 70, target: 85, priority: 'متوسط' },
      { area: 'حل تعارض', current: 75, target: 90, priority: 'متوسط' }
    ]
  }
})

// Edit state
const editingSection = ref(null)
const editForm = ref({})

// Section completion percentage
const overallCompletion = computed(() => {
  const sections = Object.values(analyticsData.value.completionStatus)
  const totalScore = sections.reduce((sum, section) => sum + section.score, 0)
  return Math.round(totalScore / sections.length)
})

// Promoted sections that need attention
const promotedSections = computed(() => {
  return Object.entries(analyticsData.value.completionStatus)
    .filter(([_, section]) => section.promoted)
    .map(([key, section]) => ({ key, ...section }))
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

function getSectionIcon(section: string) {
  switch (section) {
    case 'demographics': return 'ph:user'
    case 'personality': return 'ph:user-circle'
    case 'values': return 'ph:star'
    case 'goals': return 'ph:target'
    case 'communication': return 'ph:chat-circle'
    case 'financial': return 'ph:coins'
    case 'lifestyle': return 'ph:house'
    case 'compatibility': return 'ph:heart'
    case 'readiness': return 'ph:check-circle'
    default: return 'ph:circle'
  }
}

function getSectionTitle(section: string) {
  switch (section) {
    case 'demographics': return 'اطلاعات جمعیت‌شناختی'
    case 'personality': return 'تحلیل شخصیت'
    case 'values': return 'ارزش‌های زندگی'
    case 'goals': return 'اهداف و انگیزه‌ها'
    case 'communication': return 'مهارت‌های ارتباطی'
    case 'financial': return 'پروفایل مالی'
    case 'lifestyle': return 'سبک زندگی'
    case 'compatibility': return 'سازگاری ازدواج'
    case 'readiness': return 'آمادگی نهایی'
    default: return 'بخش نامشخص'
  }
}

function getCompletionColor(score: number) {
  if (score >= 90) return 'green'
  if (score >= 70) return 'blue'
  if (score >= 50) return 'yellow'
  return 'red'
}

function navigateToAssessment(section: string) {
  if (section === 'goals') {
    // Navigate to goals assessment
    console.log('Navigate to goals assessment')
  } else if (section === 'lifestyle') {
    alert('برای دسترسی به این بخش، ابتدا بخش اهداف را تکمیل کنید.')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 p-1 shadow-2xl shadow-purple-500/25 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-purple-600/90 via-indigo-700/90 to-blue-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Floating decorative elements -->
        <div class="absolute top-6 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-8 left-12 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative">
          <!-- Profile Header -->
          <div class="flex items-start justify-between mb-8">
            <div class="flex items-start">
              <div class="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center me-6 shadow-xl">
                <Icon name="ph:user-circle" class="w-12 h-12 text-white" />
              </div>
              
              <div>
                <BaseHeading as="h1" size="3xl" weight="bold" class="text-white drop-shadow-lg mb-2">
                  <span>{{ userProfile.personalInfo?.firstName }} {{ userProfile.personalInfo?.lastName }}</span>
                </BaseHeading>
                <BaseParagraph class="text-white/90 mb-3">
                  <span>پروفایل شخصی و نتایج ارزیابی‌ها</span>
                </BaseParagraph>
                <div class="flex items-center gap-4 text-white/80 text-sm">
                  <div class="flex items-center">
                    <Icon name="ph:map-pin" class="w-4 h-4 me-1" />
                    <span>{{ userProfile.demographics?.location?.[0]?.city }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:graduation-cap" class="w-4 h-4 me-1" />
                    <span>{{ userProfile.demographics?.education?.[0]?.degree }}</span>
                  </div>
                  <div v-if="userProfile.status === 'ACTIVE'" class="flex items-center text-green-300">
                    <Icon name="ph:check-circle" class="w-4 h-4 me-1" />
                    <span>تأیید شده</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Overall Completion -->
            <div class="text-center">
              <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <BaseParagraph class="text-white/80 mb-2">
                  <span>تکمیل پروفایل</span>
                </BaseParagraph>
                <div class="text-4xl font-bold text-white mb-2">{{ overallCompletion }}%</div>
                <div class="w-16 h-2 bg-white/20 rounded-full mx-auto mb-2">
                  <div 
                    class="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                    :style="{ width: `${overallCompletion}%` }"
                  ></div>
                </div>
                <BaseParagraph class="text-white/70 text-xs">
                  <span>از 6 بخش</span>
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promoted Sections Alert -->
    <div v-if="promotedSections.length > 0" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
      <div class="flex items-start">
        <Icon name="ph:warning" class="w-6 h-6 text-amber-600 me-3 mt-0.5" />
        <div class="flex-1">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-amber-800 dark:text-amber-200 mb-2">
            <span>بخش‌های نیازمند تکمیل</span>
          </BaseHeading>
          <div class="space-y-2">
            <div v-for="section in promotedSections" :key="section.key" class="flex items-center justify-between p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <div class="flex items-center">
                <Icon :name="getSectionIcon(section.key)" class="w-4 h-4 text-amber-600 me-2" />
                <span class="font-medium text-amber-800 dark:text-amber-200">{{ getSectionTitle(section.key) }}</span>
                <span v-if="section.deadline" class="text-xs text-amber-600 ms-2">
                  (مهلت: {{ section.deadline }})
                </span>
              </div>
              <BaseButton
                size="sm"
                class="bg-amber-500 text-white hover:bg-amber-600"
                @click="navigateToAssessment(section.key)"
              >
                <span>تکمیل</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Sections -->
    <div class="grid gap-8">
      <!-- Self-Reported Demographics -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:user" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>اطلاعات جمعیت‌شناختی خوداظهاری</span>
              </BaseHeading>
              <div class="flex items-center gap-2">
                <div class="flex items-center text-green-600">
                  <Icon name="ph:check-circle" class="w-4 h-4 me-1" />
                  <span class="text-sm">تکمیل شده</span>
                </div>
                <span class="text-gray-400">•</span>
                <span class="text-sm text-gray-500">آخرین بروزرسانی: {{ new Date(userProfile.updatedAt || '').toLocaleDateString('fa-IR') }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div v-if="userProfile.status === 'ACTIVE'" class="flex items-center text-green-600 text-sm">
              <Icon name="ph:shield-check" class="w-4 h-4 me-1" />
              <span>تأیید شده</span>
            </div>
            
            <BaseButton
              v-if="editingSection !== 'demographics'"
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
              @click="startEditing('demographics')"
            >
              <Icon name="ph:pencil" class="w-4 h-4 me-2" />
              <span>ویرایش</span>
            </BaseButton>
          </div>
        </div>
        
        <div v-if="editingSection === 'demographics'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            <span>ویرایش اطلاعات شخصی</span>
          </BaseHeading>
          
          <div class="grid md:grid-cols-2 gap-4 mb-6">
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

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-1">
            <div class="text-sm text-gray-500">جنسیت</div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.personalInfo?.gender === 'FEMALE' ? 'زن' : 'مرد' }}
            </div>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm text-gray-500">ایمیل</div>
            <div class="font-medium text-gray-800 dark:text-white">{{ userProfile.personalInfo?.email }}</div>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm text-gray-500">شماره تلفن</div>
            <div class="font-medium text-gray-800 dark:text-white">{{ userProfile.personalInfo?.phoneNumber }}</div>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm text-gray-500">محل سکونت</div>
            <div class="font-medium text-gray-800 dark:text-white">{{ userProfile.demographics?.location?.[0]?.city }}, {{ userProfile.demographics?.location?.[0]?.state }}</div>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm text-gray-500">تحصیلات</div>
            <div class="font-medium text-gray-800 dark:text-white">{{ userProfile.demographics?.education?.[0]?.degree }} - {{ userProfile.demographics?.education?.[0]?.field }}</div>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm text-gray-500">شغل</div>
            <div class="font-medium text-gray-800 dark:text-white">{{ userProfile.demographics?.occupation?.[0]?.position }} در {{ userProfile.demographics?.occupation?.[0]?.company }}</div>
          </div>
        </div>
      </div>

      <!-- Analytical Information from Assessments -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Personality Analysis -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:user-circle" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>تحلیل شخصیت</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ analyticsData.personality.source }} • {{ analyticsData.personality.lastUpdated }}
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span class="font-medium text-purple-800 dark:text-purple-200">نوع شخصیت</span>
              <span class="text-purple-600 font-bold">{{ analyticsData.personality.type }}</span>
            </div>
            
            <div class="space-y-3">
              <div v-for="(score, factor) in analyticsData.personality.factors" :key="factor" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ factor === 'extraversion' ? 'برون‌گرایی' : 
                       factor === 'agreeableness' ? 'توافق‌پذیری' :
                       factor === 'conscientiousness' ? 'وظیفه‌شناسی' :
                       factor === 'neuroticism' ? 'ثبات عاطفی' : 'گشودگی' }}
                  </span>
                  <span class="font-medium">{{ score }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getCompletionColor(score) === 'green' ? 'bg-green-500' : 
                           getCompletionColor(score) === 'blue' ? 'bg-blue-500' :
                           getCompletionColor(score) === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: `${score}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals and Motivations -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:target" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>اهداف و انگیزه‌ها</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ analyticsData.goals.source }} • {{ analyticsData.goals.lastUpdated }}
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-500 mb-2">هدف اصلی</div>
              <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.goals.primary }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">اهداف فرعی</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="goal in analyticsData.goals.secondary" 
                  :key="goal"
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {{ goal }}
                </span>
              </div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">انگیزه‌های کلیدی</div>
              <div class="space-y-2">
                <div 
                  v-for="motivation in analyticsData.goals.motivations" 
                  :key="motivation"
                  class="flex items-center"
                >
                  <Icon name="ph:heart" class="w-4 h-4 text-red-500 me-2" />
                  <span class="text-gray-700 dark:text-gray-300 text-sm">{{ motivation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Communication Skills -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:chat-circle" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>مهارت‌های ارتباطی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ analyticsData.communication.source }} • {{ analyticsData.communication.lastUpdated }}
              </div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500 mb-2">سبک ارتباطی</div>
                <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.communication.style }}</div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500 mb-2">حل تعارض</div>
                <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.communication.conflictResolution }}</div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500 mb-2">بیان احساسات</div>
                <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.communication.emotionalExpression }}</div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500 mb-2">مهارت گوش دادن</div>
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 me-3">
                    <div 
                      class="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${analyticsData.communication.listeningSkills}%` }"
                    ></div>
                  </div>
                  <span class="font-bold text-orange-600">{{ analyticsData.communication.listeningSkills }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial and Lifestyle Profiles -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Financial Profile -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:coins" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>پروفایل مالی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ analyticsData.financialProfile.source }} • {{ analyticsData.financialProfile.lastUpdated }}
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-500 mb-2">سبک مدیریت مالی</div>
              <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.financialProfile.managementStyle }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">تحمل ریسک</div>
              <div class="font-medium text-gray-800 dark:text-white">{{ analyticsData.financialProfile.riskTolerance }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">اهداف پس‌انداز</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="goal in analyticsData.financialProfile.savingsGoals" 
                  :key="goal"
                  class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                >
                  {{ goal }}
                </span>
              </div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">وضعیت بودجه</div>
              <div class="flex items-center">
                <Icon name="ph:check-circle" class="w-4 h-4 text-emerald-600 me-2" />
                <span class="font-medium text-emerald-600">{{ analyticsData.financialProfile.monthlyBudget }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifestyle Preferences -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:house" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>ترجیحات سبک زندگی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ analyticsData.lifestylePreferences.source }} • {{ analyticsData.lifestylePreferences.lastUpdated }}
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500 mb-1">تعادل کار-زندگی</div>
                <div class="font-medium text-gray-800 dark:text-white text-sm">{{ analyticsData.lifestylePreferences.workLifeBalance }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">فعالیت اجتماعی</div>
                <div class="font-medium text-gray-800 dark:text-white text-sm">{{ analyticsData.lifestylePreferences.socialActivity }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">گرایش خانوادگی</div>
                <div class="font-medium text-gray-800 dark:text-white text-sm">{{ analyticsData.lifestylePreferences.familyOrientation }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">توجه به سلامت</div>
                <div class="font-medium text-gray-800 dark:text-white text-sm">{{ analyticsData.lifestylePreferences.healthFocus }}</div>
              </div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-2">علایق و سرگرمی‌ها</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="hobby in analyticsData.lifestylePreferences.hobbies" 
                  :key="hobby"
                  class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                >
                  {{ hobby }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment History -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon name="ph:clock-clockwise" class="w-5 h-5 me-3 text-indigo-600" />
          <span>تاریخچه ارزیابی‌ها</span>
        </BaseHeading>
        
        <div class="space-y-4">
          <div 
            v-for="assessment in analyticsData.assessmentHistory" 
            :key="assessment.id"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center me-4">
                <Icon :name="getSectionIcon(assessment.type)" class="w-5 h-5 text-white" />
              </div>
              
              <div>
                <div class="font-medium text-gray-800 dark:text-white">{{ assessment.name }}</div>
                <div class="text-sm text-gray-500">{{ assessment.completedAt }} • امتیاز: {{ assessment.score }}%</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ assessment.resultSummary }}</div>
              </div>
            </div>
            
            <BaseButton
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Icon name="ph:eye" class="w-4 h-4 me-2" />
              <span>مشاهده</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Growth Metrics -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon name="ph:trend-up" class="w-5 h-5 me-3 text-blue-600" />
          <span>شاخص‌های رشد</span>
        </BaseHeading>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span class="text-white font-bold text-lg">{{ analyticsData.growthMetrics.personalGrowth }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">رشد شخصی</div>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span class="text-white font-bold text-lg">{{ analyticsData.growthMetrics.relationshipSkills }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">مهارت‌های رابطه</div>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span class="text-white font-bold text-lg">{{ analyticsData.growthMetrics.emotionalMaturity }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">بلوغ عاطفی</div>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span class="text-white font-bold text-lg">{{ analyticsData.growthMetrics.lifeSkills }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">مهارت‌های زندگی</div>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span class="text-white font-bold text-lg">{{ analyticsData.growthMetrics.overallReadiness }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">آمادگی کلی</div>
          </div>
        </div>
        
        <!-- Improvement Areas -->
        <div>
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            <span>حوزه‌های قابل بهبود</span>
          </BaseHeading>
          
          <div class="space-y-4">
            <div 
              v-for="area in analyticsData.growthMetrics.improvementAreas" 
              :key="area.area"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <span class="font-medium text-gray-800 dark:text-white">{{ area.area }}</span>
                  <span 
                    class="ms-2 px-2 py-1 rounded-full text-xs font-medium"
                    :class="area.priority === 'بالا' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
                  >
                    اولویت {{ area.priority }}
                  </span>
                </div>
                
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ area.current }}% → {{ area.target }}%
                </div>
              </div>
              
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="area.priority === 'بالا' ? 'bg-red-500' : 'bg-yellow-500'"
                  :style="{ width: `${area.current}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Status Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-6">
          <span>وضعیت تکمیل بخش‌ها</span>
        </BaseHeading>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(status, section) in analyticsData.completionStatus" 
            :key="section"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
            :class="{
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': status.completed,
              'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800': status.promoted,
              'bg-gray-50 dark:bg-gray-700/50': status.locked
            }"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <Icon 
                  :name="getSectionIcon(section)" 
                  class="w-5 h-5 me-2"
                  :class="{
                    'text-green-600': status.completed,
                    'text-amber-600': status.promoted,
                    'text-gray-400': status.locked,
                    'text-blue-600': !status.completed && !status.promoted && !status.locked
                  }"
                />
                <span class="font-medium text-gray-800 dark:text-white text-sm">
                  {{ getSectionTitle(section) }}
                </span>
              </div>
              
              <div class="text-right">
                <div 
                  class="text-lg font-bold"
                  :class="`text-${getCompletionColor(status.score)}-600`"
                >
                  {{ status.score }}%
                </div>
              </div>
            </div>
            
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="{
                  'bg-green-500': status.completed,
                  'bg-amber-500': status.promoted,
                  'bg-gray-400': status.locked,
                  'bg-blue-500': !status.completed && !status.promoted && !status.locked
                }"
                :style="{ width: `${status.score}%` }"
              ></div>
            </div>
            
            <div class="text-xs text-gray-500">
              <div v-if="status.completed">
                تکمیل شده • {{ status.lastUpdated }}
              </div>
              <div v-else-if="status.promoted">
                نیاز به تکمیل • مهلت: {{ status.deadline }}
              </div>
              <div v-else-if="status.locked">
                قفل شده • {{ status.requires }}
              </div>
              <div v-else>
                در دسترس برای تکمیل
              </div>
            </div>
            
            <div v-if="!status.completed" class="mt-3">
              <BaseButton
                size="sm"
                class="w-full"
                :class="{
                  'bg-amber-500 text-white hover:bg-amber-600': status.promoted,
                  'bg-gray-300 text-gray-500 cursor-not-allowed': status.locked,
                  'bg-blue-500 text-white hover:bg-blue-600': !status.promoted && !status.locked
                }"
                :disabled="status.locked"
                @click="navigateToAssessment(section)"
              >
                <span v-if="status.locked">قفل شده</span>
                <span v-else-if="status.promoted">تکمیل فوری</span>
                <span v-else>شروع</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Counselor Notes -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center me-4">
              <Icon name="ph:clipboard-text" class="w-6 h-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>یادداشت‌های مشاور</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                {{ analyticsData.counselorNotes.counselor }} • {{ analyticsData.counselorNotes.lastUpdated }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Strengths -->
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3 flex items-center">
              <Icon name="ph:star" class="w-4 h-4 me-2 text-green-600" />
              <span>نقاط قوت</span>
            </BaseHeading>
            <div class="space-y-2">
              <div 
                v-for="strength in analyticsData.counselorNotes.strengths" 
                :key="strength"
                class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <span class="text-sm text-green-800 dark:text-green-200">{{ strength }}</span>
              </div>
            </div>
          </div>
          
          <!-- Critical Areas -->
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3 flex items-center">
              <Icon name="ph:warning" class="w-4 h-4 me-2 text-amber-600" />
              <span>حوزه‌های حیاتی</span>
            </BaseHeading>
            <div class="space-y-2">
              <div 
                v-for="area in analyticsData.counselorNotes.criticalAreas" 
                :key="area"
                class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
              >
                <span class="text-sm text-amber-800 dark:text-amber-200">{{ area }}</span>
              </div>
            </div>
          </div>
          
          <!-- Recommendations -->
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3 flex items-center">
              <Icon name="ph:lightbulb" class="w-4 h-4 me-2 text-blue-600" />
              <span>توصیه‌ها</span>
            </BaseHeading>
            <div class="space-y-2">
              <div 
                v-for="recommendation in analyticsData.counselorNotes.recommendations" 
                :key="recommendation"
                class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <span class="text-sm text-blue-800 dark:text-blue-200">{{ recommendation }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Next Session -->
        <div class="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="ph:calendar" class="w-5 h-5 text-indigo-600 me-2" />
              <span class="font-medium text-indigo-800 dark:text-indigo-200">
                جلسه مشاوره بعدی: {{ analyticsData.counselorNotes.nextSession }}
              </span>
            </div>
            
            <BaseButton
              size="sm"
              class="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              <Icon name="ph:video-camera" class="w-4 h-4 me-2" />
              <span>پیوستن</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 justify-center mt-8">
      <BaseButton
        @click="navigateTo('/hammasir')"
        variant="outline"
        class="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
        <span>بازگشت به داشبورد</span>
      </BaseButton>
      
      <BaseButton
        class="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
      >
        <Icon name="ph:download" class="w-4 h-4 me-2" />
        <span>دانلود گزارش کامل</span>
      </BaseButton>
    </div>
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