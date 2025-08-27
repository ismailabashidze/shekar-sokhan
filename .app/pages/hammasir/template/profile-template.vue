<script setup lang="ts">
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

// Mock user data
const userProfile = ref({
  // Self-reported demographic information
  demographics: {
    firstName: 'سارا',
    lastName: 'محمدی',
    gender: 'female',
    ageRange: '25-30',
    birthPlace: 'تهران',
    currentLocation: 'تهران',
    education: 'کارشناسی ارشد',
    completedAt: '1403/03/10',
    verified: true,
    verifiedBy: 'دکتر مریم احمدی',
  },

  // Analytical information from assessments
  analytics: {
    personality: {
      type: 'ENFJ-A',
      factors: {
        extraversion: 72,
        agreeableness: 83,
        conscientiousness: 69,
        neuroticism: 58,
        openness: 76,
      },
      lastUpdated: '1403/03/15',
      source: 'آزمون NEO',
    },
    goals: {
      primary: 'تشکیل خانواده مستحکم',
      secondary: ['رشد شخصی', 'استقلال مالی', 'تعادل کار و زندگی'],
      motivations: ['عشق و صمیمیت', 'امنیت عاطفی', 'رشد مشترک'],
      lastUpdated: '1403/03/12',
      source: 'آزمون ارزش‌های زندگی',
    },
    compatibility: {
      score: 82,
      preferredTraits: ['صداقت', 'همدلی', 'مسئولیت‌پذیری'],
      lifestyle: 'متعادل و فعال',
      lastUpdated: '1403/03/18',
      source: 'تحلیل جامع سازگاری',
    },
  },

  // Counselor notes and professional insights
  counselorNotes: {
    strengths: [
      'توانایی ارتباطی بالا',
      'انعطاف‌پذیری در مواجهه با تغییرات',
      'تعهد قوی به اهداف شخصی',
    ],
    criticalAreas: [
      'مدیریت استرس در شرایط چالش‌برانگیز',
      'تقویت اعتماد به نفس در تصمیم‌گیری‌های مهم',
    ],
    recommendations: [
      'شرکت در دوره مدیریت استرس',
      'تمرین تکنیک‌های مدیتیشن',
      'توسعه مهارت‌های حل مسئله',
    ],
    nextSession: '1403/04/20',
    counselor: 'دکتر مریم احمدی',
    lastUpdated: '1403/04/10',
  },

  // Additional analytical data
  communication: {
    style: 'فعال و همدلانه',
    conflictResolution: 'مذاکره و توافق',
    emotionalExpression: 'بالا',
    listeningSkills: 78,
    lastUpdated: '1403/03/20',
    source: 'آزمون مهارت‌های ارتباطی',
  },

  financialProfile: {
    managementStyle: 'محتاط و برنامه‌ریز',
    riskTolerance: 'متوسط',
    savingsGoals: ['خانه', 'تحصیل فرزندان', 'بازنشستگی'],
    monthlyBudget: 'تنظیم شده',
    lastUpdated: '1403/03/22',
    source: 'مشاوره مالی',
  },

  lifestylePreferences: {
    workLifeBalance: 'بالا',
    socialActivity: 'فعال',
    hobbies: ['مطالعه', 'ورزش', 'سفر', 'آشپزی'],
    familyOrientation: 'بالا',
    healthFocus: 'متوسط تا بالا',
    lastUpdated: '1403/03/25',
    source: 'پرسش‌نامه سبک زندگی',
  },

  // Completion tracking
  completionStatus: {
    demographics: { completed: true, score: 100, lastUpdated: '1403/03/10' },
    personality: { completed: true, score: 85, lastUpdated: '1403/03/15' },
    values: { completed: true, score: 90, lastUpdated: '1403/03/12' },
    goals: { completed: false, score: 60, promoted: true, deadline: '1403/04/15' },
    communication: { completed: true, score: 78, lastUpdated: '1403/03/20' },
    financial: { completed: true, score: 88, lastUpdated: '1403/03/22' },
    lifestyle: { completed: true, score: 92, lastUpdated: '1403/03/25' },
    compatibility: { completed: true, score: 95, lastUpdated: '1403/03/18' },
    readiness: { completed: false, score: 30, locked: true, requires: 'تکمیل بخش اهداف' },
  },

  // Assessment history
  assessmentHistory: [
    {
      id: 1,
      name: 'آزمون شخصیت NEO',
      type: 'personality',
      completedAt: '1403/03/15',
      score: 85,
      status: 'completed',
      resultSummary: 'شخصیت برون‌گرا با ثبات عاطفی مناسب',
    },
    {
      id: 2,
      name: 'آزمون ارزش‌های زندگی',
      type: 'values',
      completedAt: '1403/03/12',
      score: 90,
      status: 'completed',
      resultSummary: 'اولویت بالا برای خانواده و رشد شخصی',
    },
    {
      id: 3,
      name: 'آزمون مهارت‌های ارتباطی',
      type: 'communication',
      completedAt: '1403/03/20',
      score: 78,
      status: 'completed',
      resultSummary: 'مهارت‌های قوی گوش دادن، نیاز به تقویت بیان احساسات',
    },
    {
      id: 4,
      name: 'مشاوره مالی',
      type: 'financial',
      completedAt: '1403/03/22',
      score: 88,
      status: 'completed',
      resultSummary: 'آگاهی مالی خوب، برنامه‌ریزی مناسب',
    },
    {
      id: 5,
      name: 'آزمون سازگاری ازدواج',
      type: 'compatibility',
      completedAt: '1403/03/18',
      score: 95,
      status: 'completed',
      resultSummary: 'آمادگی بالا برای روابط طولانی‌مدت',
    },
  ],

  // Growth tracking
  growthMetrics: {
    personalGrowth: 78,
    relationshipSkills: 82,
    emotionalMaturity: 75,
    lifeSkills: 88,
    overallReadiness: 81,
    improvementAreas: [
      { area: 'مدیریت استرس', current: 65, target: 80, priority: 'بالا' },
      { area: 'بیان احساسات', current: 70, target: 85, priority: 'متوسط' },
      { area: 'حل تعارض', current: 75, target: 90, priority: 'متوسط' },
    ],
  },
})

// Edit state
const editingSection = ref(null)
const editForm = ref({})

// Section completion percentage
const overallCompletion = computed(() => {
  const sections = Object.values(userProfile.value.completionStatus)
  const totalScore = sections.reduce((sum, section) => sum + section.score, 0)
  return Math.round(totalScore / sections.length)
})

// Promoted sections that need attention
const promotedSections = computed(() => {
  return Object.entries(userProfile.value.completionStatus)
    .filter(([_, section]) => section.promoted)
    .map(([key, section]) => ({ key, ...section }))
})

function startEditing(section: string) {
  editingSection.value = section
  if (section === 'demographics') {
    editForm.value = { ...userProfile.value.demographics }
  }
}

function cancelEditing() {
  editingSection.value = null
  editForm.value = {}
}

function saveSection() {
  if (editingSection.value === 'demographics') {
    userProfile.value.demographics = { ...editForm.value }
    userProfile.value.demographics.lastUpdated = new Date().toLocaleDateString('fa-IR')
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
  }
  else if (section === 'lifestyle') {
    alert('برای دسترسی به این بخش، ابتدا بخش اهداف را تکمیل کنید.')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 p-1 shadow-2xl shadow-purple-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div class="relative rounded-2xl bg-gradient-to-br from-purple-600/90 via-indigo-700/90 to-blue-700/90 px-8 py-12 backdrop-blur-xl">
        <!-- Floating decorative elements -->
        <div class="absolute right-8 top-6 size-24 rounded-full bg-white/5 blur-2xl" />
        <div class="absolute bottom-8 left-12 size-32 rounded-full bg-blue-400/10 blur-3xl" />

        <div class="relative">
          <!-- Profile Header -->
          <div class="mb-8 flex items-start justify-between">
            <div class="flex items-start">
              <div class="me-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 shadow-xl">
                <Icon name="ph:user-circle" class="size-12 text-white" />
              </div>

              <div>
                <BaseHeading
                  as="h1"
                  size="3xl"
                  weight="bold"
                  class="mb-2 text-white drop-shadow-lg"
                >
                  <span>{{ userProfile.demographics.firstName }} {{ userProfile.demographics.lastName }}</span>
                </BaseHeading>
                <BaseParagraph class="mb-3 text-white/90">
                  <span>پروفایل شخصی و نتایج ارزیابی‌ها</span>
                </BaseParagraph>
                <div class="flex items-center gap-4 text-sm text-white/80">
                  <div class="flex items-center">
                    <Icon name="ph:map-pin" class="me-1 size-4" />
                    <span>{{ userProfile.demographics.currentLocation }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:graduation-cap" class="me-1 size-4" />
                    <span>{{ userProfile.demographics.education }}</span>
                  </div>
                  <div v-if="userProfile.demographics.verified" class="flex items-center text-green-300">
                    <Icon name="ph:check-circle" class="me-1 size-4" />
                    <span>تأیید شده</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Overall Completion -->
            <div class="text-center">
              <div class="rounded-2xl border border-white/30 bg-white/20 p-6 backdrop-blur-sm">
                <BaseParagraph class="mb-2 text-white/80">
                  <span>تکمیل پروفایل</span>
                </BaseParagraph>
                <div class="mb-2 text-4xl font-bold text-white">
                  {{ overallCompletion }}%
                </div>
                <div class="mx-auto mb-2 h-2 w-16 rounded-full bg-white/20">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                    :style="{ width: `${overallCompletion}%` }"
                  />
                </div>
                <BaseParagraph class="text-xs text-white/70">
                  <span>از 6 بخش</span>
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promoted Sections Alert -->
    <div v-if="promotedSections.length > 0" class="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
      <div class="flex items-start">
        <Icon name="ph:warning" class="me-3 mt-0.5 size-6 text-amber-600" />
        <div class="flex-1">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="mb-2 text-amber-800 dark:text-amber-200"
          >
            <span>بخش‌های نیازمند تکمیل</span>
          </BaseHeading>
          <div class="space-y-2">
            <div
              v-for="section in promotedSections"
              :key="section.key"
              class="flex items-center justify-between rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30"
            >
              <div class="flex items-center">
                <Icon :name="getSectionIcon(section.key)" class="me-2 size-4 text-amber-600" />
                <span class="font-medium text-amber-800 dark:text-amber-200">{{ getSectionTitle(section.key) }}</span>
                <span v-if="section.deadline" class="ms-2 text-xs text-amber-600">
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
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
              <Icon name="ph:user" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>اطلاعات جمعیت‌شناختی خوداظهاری</span>
              </BaseHeading>
              <div class="flex items-center gap-2">
                <div class="flex items-center text-green-600">
                  <Icon name="ph:check-circle" class="me-1 size-4" />
                  <span class="text-sm">تکمیل شده</span>
                </div>
                <span class="text-gray-400">•</span>
                <span class="text-sm text-gray-500">آخرین بروزرسانی: {{ userProfile.demographics.completedAt }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div v-if="userProfile.demographics.verified" class="flex items-center text-sm text-green-600">
              <Icon name="ph:shield-check" class="me-1 size-4" />
              <span>تأیید شده توسط {{ userProfile.demographics.verifiedBy }}</span>
            </div>

            <BaseButton
              v-if="editingSection !== 'demographics'"
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
              @click="startEditing('demographics')"
            >
              <Icon name="ph:pencil" class="me-2 size-4" />
              <span>ویرایش</span>
            </BaseButton>
          </div>
        </div>

        <div v-if="editingSection === 'demographics'" class="mb-6 rounded-xl bg-gray-50 p-6 dark:bg-gray-700/50">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="mb-4 text-gray-800 dark:text-white"
          >
            <span>ویرایش اطلاعات شخصی</span>
          </BaseHeading>

          <div class="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">نام</label>
              <input
                v-model="editForm.firstName"
                type="text"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">نام خانوادگی</label>
              <input
                v-model="editForm.lastName"
                type="text"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">محل تولد</label>
              <input
                v-model="editForm.birthPlace"
                type="text"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">محل سکونت</label>
              <input
                v-model="editForm.currentLocation"
                type="text"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
            </div>
          </div>

          <div class="flex gap-3">
            <BaseButton
              class="bg-green-500 text-white hover:bg-green-600"
              @click="saveSection"
            >
              <Icon name="ph:check" class="me-2 size-4" />
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

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="space-y-1">
            <div class="text-sm text-gray-500">
              جنسیت
            </div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.demographics.gender === 'female' ? 'زن' : 'مرد' }}
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-sm text-gray-500">
              محدوده سنی
            </div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.demographics.ageRange }} سال
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-sm text-gray-500">
              محل تولد
            </div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.demographics.birthPlace }}
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-sm text-gray-500">
              محل سکونت
            </div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.demographics.currentLocation }}
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-sm text-gray-500">
              تحصیلات
            </div>
            <div class="font-medium text-gray-800 dark:text-white">
              {{ userProfile.demographics.education }}
            </div>
          </div>
        </div>
      </div>

      <!-- Analytical Information from Assessments -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Personality Analysis -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
          <div class="mb-6 flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
              <Icon name="ph:user-circle" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>تحلیل شخصیت</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ userProfile.analytics.personality.source }} • {{ userProfile.analytics.personality.lastUpdated }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <span class="font-medium text-purple-800 dark:text-purple-200">نوع شخصیت</span>
              <span class="font-bold text-purple-600">{{ userProfile.analytics.personality.type }}</span>
            </div>

            <div class="space-y-3">
              <div
                v-for="(score, factor) in userProfile.analytics.personality.factors"
                :key="factor"
                class="space-y-2"
              >
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ factor === 'extraversion' ? 'برون‌گرایی' :
                      factor === 'agreeableness' ? 'توافق‌پذیری' :
                      factor === 'conscientiousness' ? 'وظیفه‌شناسی' :
                      factor === 'neuroticism' ? 'ثبات عاطفی' : 'گشودگی' }}
                  </span>
                  <span class="font-medium">{{ score }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getCompletionColor(score) === 'green' ? 'bg-green-500' :
                      getCompletionColor(score) === 'blue' ? 'bg-blue-500' :
                      getCompletionColor(score) === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'"
                    :style="{ width: `${score}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals and Motivations -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
          <div class="mb-6 flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
              <Icon name="ph:target" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>اهداف و انگیزه‌ها</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ userProfile.analytics.goals.source }} • {{ userProfile.analytics.goals.lastUpdated }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="mb-2 text-sm text-gray-500">
                هدف اصلی
              </div>
              <div class="font-medium text-gray-800 dark:text-white">
                {{ userProfile.analytics.goals.primary }}
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                اهداف فرعی
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="goal in userProfile.analytics.goals.secondary"
                  :key="goal"
                  class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                >
                  {{ goal }}
                </span>
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                انگیزه‌های کلیدی
              </div>
              <div class="space-y-2">
                <div
                  v-for="motivation in userProfile.analytics.goals.motivations"
                  :key="motivation"
                  class="flex items-center"
                >
                  <Icon name="ph:heart" class="me-2 size-4 text-red-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ motivation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Communication Skills -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
          <div class="mb-6 flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
              <Icon name="ph:chat-circle" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>مهارت‌های ارتباطی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ userProfile.communication.source }} • {{ userProfile.communication.lastUpdated }}
              </div>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <div>
                <div class="mb-2 text-sm text-gray-500">
                  سبک ارتباطی
                </div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ userProfile.communication.style }}
                </div>
              </div>

              <div>
                <div class="mb-2 text-sm text-gray-500">
                  حل تعارض
                </div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ userProfile.communication.conflictResolution }}
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <div class="mb-2 text-sm text-gray-500">
                  بیان احساسات
                </div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ userProfile.communication.emotionalExpression }}
                </div>
              </div>

              <div>
                <div class="mb-2 text-sm text-gray-500">
                  مهارت گوش دادن
                </div>
                <div class="flex items-center">
                  <div class="me-3 h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      class="h-2 rounded-full bg-orange-500 transition-all duration-500"
                      :style="{ width: `${userProfile.communication.listeningSkills}%` }"
                    />
                  </div>
                  <span class="font-bold text-orange-600">{{ userProfile.communication.listeningSkills }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial and Lifestyle Profiles -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Financial Profile -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
          <div class="mb-6 flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Icon name="ph:coins" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>پروفایل مالی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ userProfile.financialProfile.source }} • {{ userProfile.financialProfile.lastUpdated }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="mb-2 text-sm text-gray-500">
                سبک مدیریت مالی
              </div>
              <div class="font-medium text-gray-800 dark:text-white">
                {{ userProfile.financialProfile.managementStyle }}
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                تحمل ریسک
              </div>
              <div class="font-medium text-gray-800 dark:text-white">
                {{ userProfile.financialProfile.riskTolerance }}
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                اهداف پس‌انداز
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="goal in userProfile.financialProfile.savingsGoals"
                  :key="goal"
                  class="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                >
                  {{ goal }}
                </span>
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                وضعیت بودجه
              </div>
              <div class="flex items-center">
                <Icon name="ph:check-circle" class="me-2 size-4 text-emerald-600" />
                <span class="font-medium text-emerald-600">{{ userProfile.financialProfile.monthlyBudget }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifestyle Preferences -->
        <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
          <div class="mb-6 flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600">
              <Icon name="ph:house" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>ترجیحات سبک زندگی</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                منبع: {{ userProfile.lifestylePreferences.source }} • {{ userProfile.lifestylePreferences.lastUpdated }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="mb-1 text-sm text-gray-500">
                  تعادل کار-زندگی
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ userProfile.lifestylePreferences.workLifeBalance }}
                </div>
              </div>
              <div>
                <div class="mb-1 text-sm text-gray-500">
                  فعالیت اجتماعی
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ userProfile.lifestylePreferences.socialActivity }}
                </div>
              </div>
              <div>
                <div class="mb-1 text-sm text-gray-500">
                  گرایش خانوادگی
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ userProfile.lifestylePreferences.familyOrientation }}
                </div>
              </div>
              <div>
                <div class="mb-1 text-sm text-gray-500">
                  توجه به سلامت
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ userProfile.lifestylePreferences.healthFocus }}
                </div>
              </div>
            </div>

            <div>
              <div class="mb-2 text-sm text-gray-500">
                علایق و سرگرمی‌ها
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="hobby in userProfile.lifestylePreferences.hobbies"
                  :key="hobby"
                  class="rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700"
                >
                  {{ hobby }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment History -->
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <BaseHeading
          as="h2"
          size="xl"
          weight="semibold"
          class="mb-6 flex items-center text-gray-800 dark:text-white"
        >
          <Icon name="ph:clock-clockwise" class="me-3 size-5 text-indigo-600" />
          <span>تاریخچه ارزیابی‌ها</span>
        </BaseHeading>

        <div class="space-y-4">
          <div
            v-for="assessment in userProfile.assessmentHistory"
            :key="assessment.id"
            class="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
          >
            <div class="flex items-center">
              <div class="me-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600">
                <Icon :name="getSectionIcon(assessment.type)" class="size-5 text-white" />
              </div>

              <div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ assessment.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ assessment.completedAt }} • امتیاز: {{ assessment.score }}%
                </div>
                <div class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {{ assessment.resultSummary }}
                </div>
              </div>
            </div>

            <BaseButton
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Icon name="ph:eye" class="me-2 size-4" />
              <span>مشاهده</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Growth Metrics -->
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <BaseHeading
          as="h2"
          size="xl"
          weight="semibold"
          class="mb-6 flex items-center text-gray-800 dark:text-white"
        >
          <Icon name="ph:trend-up" class="me-3 size-5 text-blue-600" />
          <span>شاخص‌های رشد</span>
        </BaseHeading>

        <div class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
              <span class="text-lg font-bold text-white">{{ userProfile.growthMetrics.personalGrowth }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">
              رشد شخصی
            </div>
          </div>

          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
              <span class="text-lg font-bold text-white">{{ userProfile.growthMetrics.relationshipSkills }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">
              مهارت‌های رابطه
            </div>
          </div>

          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
              <span class="text-lg font-bold text-white">{{ userProfile.growthMetrics.emotionalMaturity }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">
              بلوغ عاطفی
            </div>
          </div>

          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
              <span class="text-lg font-bold text-white">{{ userProfile.growthMetrics.lifeSkills }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">
              مهارت‌های زندگی
            </div>
          </div>

          <div class="text-center">
            <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600">
              <span class="text-lg font-bold text-white">{{ userProfile.growthMetrics.overallReadiness }}</span>
            </div>
            <div class="text-sm font-medium text-gray-800 dark:text-white">
              آمادگی کلی
            </div>
          </div>
        </div>

        <!-- Improvement Areas -->
        <div>
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="mb-4 text-gray-800 dark:text-white"
          >
            <span>حوزه‌های قابل بهبود</span>
          </BaseHeading>

          <div class="space-y-4">
            <div
              v-for="area in userProfile.growthMetrics.improvementAreas"
              :key="area.area"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="font-medium text-gray-800 dark:text-white">{{ area.area }}</span>
                  <span
                    class="ms-2 rounded-full px-2 py-1 text-xs font-medium"
                    :class="area.priority === 'بالا' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
                  >
                    اولویت {{ area.priority }}
                  </span>
                </div>

                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ area.current }}% → {{ area.target }}%
                </div>
              </div>

              <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="area.priority === 'بالا' ? 'bg-red-500' : 'bg-yellow-500'"
                  :style="{ width: `${area.current}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Status Overview -->
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <BaseHeading
          as="h2"
          size="xl"
          weight="semibold"
          class="mb-6 text-gray-800 dark:text-white"
        >
          <span>وضعیت تکمیل بخش‌ها</span>
        </BaseHeading>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(status, section) in userProfile.completionStatus"
            :key="section"
            class="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
            :class="{
              'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20': status.completed,
              'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20': status.promoted,
              'bg-gray-50 dark:bg-gray-700/50': status.locked
            }"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center">
                <Icon
                  :name="getSectionIcon(section)"
                  class="me-2 size-5"
                  :class="{
                    'text-green-600': status.completed,
                    'text-amber-600': status.promoted,
                    'text-gray-400': status.locked,
                    'text-blue-600': !status.completed && !status.promoted && !status.locked
                  }"
                />
                <span class="text-sm font-medium text-gray-800 dark:text-white">
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

            <div class="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="{
                  'bg-green-500': status.completed,
                  'bg-amber-500': status.promoted,
                  'bg-gray-400': status.locked,
                  'bg-blue-500': !status.completed && !status.promoted && !status.locked
                }"
                :style="{ width: `${status.score}%` }"
              />
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
                  'cursor-not-allowed bg-gray-300 text-gray-500': status.locked,
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
      <div class="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600">
              <Icon name="ph:clipboard-text" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="mb-1 text-gray-800 dark:text-white"
              >
                <span>یادداشت‌های مشاور</span>
              </BaseHeading>
              <div class="text-sm text-gray-500">
                {{ userProfile.counselorNotes.counselor }} • {{ userProfile.counselorNotes.lastUpdated }}
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <!-- Strengths -->
          <div>
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-3 flex items-center text-gray-800 dark:text-white"
            >
              <Icon name="ph:star" class="me-2 size-4 text-green-600" />
              <span>نقاط قوت</span>
            </BaseHeading>
            <div class="space-y-2">
              <div
                v-for="strength in userProfile.counselorNotes.strengths"
                :key="strength"
                class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
              >
                <span class="text-sm text-green-800 dark:text-green-200">{{ strength }}</span>
              </div>
            </div>
          </div>

          <!-- Critical Areas -->
          <div>
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-3 flex items-center text-gray-800 dark:text-white"
            >
              <Icon name="ph:warning" class="me-2 size-4 text-amber-600" />
              <span>حوزه‌های حیاتی</span>
            </BaseHeading>
            <div class="space-y-2">
              <div
                v-for="area in userProfile.counselorNotes.criticalAreas"
                :key="area"
                class="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
              >
                <span class="text-sm text-amber-800 dark:text-amber-200">{{ area }}</span>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div>
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-3 flex items-center text-gray-800 dark:text-white"
            >
              <Icon name="ph:lightbulb" class="me-2 size-4 text-blue-600" />
              <span>توصیه‌ها</span>
            </BaseHeading>
            <div class="space-y-2">
              <div
                v-for="recommendation in userProfile.counselorNotes.recommendations"
                :key="recommendation"
                class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20"
              >
                <span class="text-sm text-blue-800 dark:text-blue-200">{{ recommendation }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Session -->
        <div class="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="ph:calendar" class="me-2 size-5 text-indigo-600" />
              <span class="font-medium text-indigo-800 dark:text-indigo-200">
                جلسه مشاوره بعدی: {{ userProfile.counselorNotes.nextSession }}
              </span>
            </div>

            <BaseButton
              size="sm"
              class="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              <Icon name="ph:video-camera" class="me-2 size-4" />
              <span>پیوستن</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-center gap-4">
      <BaseButton
        variant="outline"
        class="border-gray-300 text-gray-700 hover:bg-gray-50"
        @click="navigateTo('/hammasir')"
      >
        <Icon name="ph:arrow-right" class="me-2 size-4" />
        <span>بازگشت به داشبورد</span>
      </BaseButton>

      <BaseButton
        class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
      >
        <Icon name="ph:download" class="me-2 size-4" />
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
