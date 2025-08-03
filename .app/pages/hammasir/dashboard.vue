<script setup lang="ts">
definePageMeta({
  title: 'داشبورد همسیر',
  preview: {
    title: 'Hammasir Dashboard',
    description: 'Personal growth roadmap dashboard',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-hammasir.png',
    srcDark: '/img/screens/dashboards-hammasir-dark.png',
    order: 1,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const currentUser = {
  name: 'سارا احمدی',
  avatar: '/img/avatars/2.svg',
  currentStage: 'کنترل هیجان',
  roadmapProgress: 3,
  totalStages: 6,
  matchmakingUnlocked: false
}

const roadmapStages = [
  { 
    id: 1, 
    name: 'آشنایی اولیه', 
    type: 'test', 
    status: 'completed', 
    icon: 'ph:user-circle',
    duration: '2 هفته',
    completedAt: '1403/02/15',
    progress: 100,
    description: 'بررسی اولیه شخصیت و اهداف زندگی',
    requirements: [],
    tasks: [
      { name: 'تکمیل پرسش‌نامه اولیه', completed: true },
      { name: 'آپلود عکس پروفایل', completed: true },
      { name: 'تعیین اهداف ازدواج', completed: true }
    ],
    badge: 'شروع قدم',
    insights: 'شما با انگیزه بالا وارد مسیر همسان‌یابی شده‌اید'
  },
  { 
    id: 2, 
    name: 'تحلیل شخصیت', 
    type: 'test', 
    status: 'completed', 
    icon: 'ph:brain',
    duration: '3 هفته',
    completedAt: '1403/03/20',
    progress: 100,
    description: 'بررسی عمیق ویژگی‌های شخصیتی و روانی',
    requirements: ['تکمیل آشنایی اولیه'],
    tasks: [
      { name: 'آزمون شخصیت NEO', completed: true },
      { name: 'آزمون هوش هیجانی', completed: true },
      { name: 'تحلیل الگوی ارتباطی', completed: true },
      { name: 'مشاورع اولیه با روان‌شناس', completed: true }
    ],
    badge: 'خودشناس',
    insights: 'شما فردی درون‌گرا با هوش هیجانی بالا هستید'
  },
  { 
    id: 3, 
    name: 'کنترل هیجان', 
    type: 'course', 
    status: 'current', 
    icon: 'ph:heart',
    duration: '4 هفته',
    startedAt: '1403/04/01',
    progress: 65,
    description: 'یادگیری مهارت‌های مدیریت و کنترل هیجانات',
    requirements: ['تکمیل تحلیل شخصیت'],
    tasks: [
      { name: 'دوره مدیریت هیجانات (13 جلسه)', completed: false, progress: 65 },
      { name: 'آزمون Cattell', completed: false },
      { name: 'آزمون Glasser', completed: false },
      { name: 'تمرینات عملی هفتگی', completed: false, progress: 45 }
    ],
    badge: null,
    insights: 'در حال یادگیری تکنیک‌های مدیریت استرس و خشم',
    nextMilestone: 'تکمیل جلسه 10 دوره (تا 5 روز دیگر)'
  },
  { 
    id: 4, 
    name: 'مشاوره تخصصی', 
    type: 'counseling', 
    status: 'pending', 
    icon: 'ph:chat-circle',
    duration: '2 هفته',
    estimatedStart: '1403/05/01',
    progress: 0,
    description: 'جلسات مشاوره فردی با روان‌شناس متخصص',
    requirements: ['تکمیل 75% دوره کنترل هیجان'],
    tasks: [
      { name: 'انتخاب مشاور', completed: false },
      { name: '4 جلسه مشاوره فردی', completed: false },
      { name: 'ارزیابی نهایی آمادگی', completed: false }
    ],
    badge: null,
    unlockMessage: 'برای باز کردن این مرحله، 75% دوره فعلی را تکمیل کنید'
  },
  { 
    id: 5, 
    name: 'آمادگی ازدواج', 
    type: 'test', 
    status: 'pending', 
    icon: 'ph:rings',
    duration: '1 هفته',
    estimatedStart: '1403/05/15',
    progress: 0,
    description: 'ارزیابی نهایی آمادگی برای ازدواج',
    requirements: ['تکمیل مشاوره تخصصی'],
    tasks: [
      { name: 'آزمون آمادگی ازدواج', completed: false },
      { name: 'بررسی سازگاری مالی', completed: false },
      { name: 'تحلیل اهداف مشترک', completed: false }
    ],
    badge: null,
    unlockMessage: 'پس از تأیید مشاور قابل دسترسی'
  },
  { 
    id: 6, 
    name: 'همسان‌سازی', 
    type: 'match', 
    status: 'pending', 
    icon: 'ph:users',
    duration: 'مداوم',
    estimatedStart: '1403/06/01',
    progress: 0,
    description: 'ورود به فرآیند همسان‌یابی و آشنایی',
    requirements: ['تکمیل آزمون آمادگی'],
    tasks: [
      { name: 'مشاهده پیشنهادها', completed: false },
      { name: 'شروع ارتباط با افراد', completed: false },
      { name: 'برنامه‌ریزی جلسات', completed: false }
    ],
    badge: null,
    specialFeature: 'همسان‌یابی هوشمند بر اساس تحلیل‌های قبلی'
  }
]

const expandedStage = ref(null)

const currentStageDetails = {
  name: 'کنترل هیجان',
  course: {
    title: 'دوره مدیریت هیجانات',
    status: 'in_progress',
    progress: 65,
    telegramLink: 'https://t.me/hammasir_course'
  },
  tests: [
    { name: 'آزمون NEO', status: 'completed' },
    { name: 'آزمون Cattell', status: 'pending' },
    { name: 'آزمون Glasser', status: 'pending' }
  ],
  counseling: {
    status: 'not_booked',
    availableCounselors: 3
  }
}

const notifications = [
  {
    id: 1,
    title: 'نتیجه آزمون NEO',
    message: 'تحلیل شخصیت شما آماده شده است',
    type: 'analysis',
    date: '2 ساعت پیش',
    isNew: true
  },
  {
    id: 2,
    title: 'دوره جدید',
    message: 'دوره "مدیریت استرس" فعال شد',
    type: 'course',
    date: '1 روز پیش',
    isNew: true
  },
  {
    id: 3,
    title: 'پیشنهاد مشاوره',
    message: 'مشاور احمدی جلسه پیشنهاد داده',
    type: 'counseling',
    date: '3 روز پیش',
    isNew: false
  }
]

const psychologicalAnalysis = {
  latest: 'درون‌گرایی بالا و کنترل هیجان مناسب',
  recommendation: 'پیشنهاد ادامه تمرینات مدیریت خشم',
  score: 78
}

const quickActions = [
  { title: 'مشاهده Roadmap کامل', icon: 'ph:map-trifold', action: 'roadmap' },
  { title: 'تکمیل پرسش‌نامه‌ها', icon: 'ph:clipboard-text', action: 'questionnaires' },
  { title: 'درخواست مشاوره', icon: 'ph:user-circle-gear', action: 'counseling' },
  { title: 'ادامه دوره فعلی', icon: 'ph:play-circle', action: 'continue_course' },
  { title: 'ویرایش پروفایل', icon: 'ph:user-gear', action: 'profile' }
]

function getStageIcon(type: string) {
  switch (type) {
    case 'test': return 'ph:clipboard-text'
    case 'course': return 'ph:book-open'
    case 'counseling': return 'ph:chat-circle'
    case 'match': return 'ph:users'
    default: return 'ph:circle'
  }
}

function getStageColor(status: string) {
  switch (status) {
    case 'completed': return 'success'
    case 'current': return 'warning'
    case 'pending': return 'muted'
    default: return 'muted'
  }
}

function toggleStageDetails(stageId: number) {
  expandedStage.value = expandedStage.value === stageId ? null : stageId
}

function getProgressColor(progress: number) {
  if (progress >= 75) return 'from-green-400 to-emerald-500'
  if (progress >= 50) return 'from-blue-400 to-indigo-500'
  if (progress >= 25) return 'from-yellow-400 to-orange-500'
  return 'from-gray-400 to-gray-500'
}

function getTimeRemaining(stage: any) {
  if (stage.status === 'completed') return null
  if (stage.status === 'current' && stage.nextMilestone) return stage.nextMilestone
  if (stage.estimatedStart) return `شروع تخمینی: ${stage.estimatedStart}`
  return null
}

function canAccessStage(stage: any) {
  if (stage.status === 'completed' || stage.status === 'current') return true
  
  const currentStageIndex = roadmapStages.findIndex(s => s.status === 'current')
  const stageIndex = roadmapStages.findIndex(s => s.id === stage.id)
  
  return stageIndex <= currentStageIndex + 1
}

function handleQuickAction(action: string) {
  switch (action) {
    case 'roadmap':
      navigateTo('/hammasir/roadmap')
      break
    case 'questionnaires':
      navigateTo('/hammasir/questionnaires')
      break
    case 'counseling':
      // TODO: Navigate to counseling page
      console.log('Navigate to counseling')
      break
    case 'continue_course':
      // TODO: Navigate to current course
      console.log('Continue current course')
      break
    case 'profile':
      // TODO: Navigate to profile page
      console.log('Navigate to profile')
      break
    default:
      console.log('Unknown action:', action)
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-700 {
  animation-delay: 700ms;
}

/* Custom glassmorphism effect */
.glass-effect {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Gradient text animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover scale animations */
.hover-scale {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Card shadow animations */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Roadmap specific animations */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s infinite;
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Roadmap path animations */
.road-progress {
  animation: road-progress 3s ease-in-out infinite;
}

@keyframes road-progress {
  0%, 100% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: 20;
  }
}
</style>

<template>
  <div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <!-- Column -->
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-1 shadow-2xl shadow-primary-500/25">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            <div class="relative rounded-2xl bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-16">
              <!-- Floating decorative elements -->
              <div class="absolute top-6 right-8 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
              <div class="absolute bottom-8 left-12 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
              
              <!-- Compact Info Cards at Top -->
              <div class="absolute top-6 left-8 right-8 flex justify-between items-start z-20">
                <!-- Current Stage Compact Card -->
                <div class="backdrop-blur-sm bg-white/15 rounded-xl p-3 border border-white/25 shadow-lg w-44">
                  <div class="flex items-center mb-2">
                    <Icon name="ph:target" class="w-4 h-4 me-2 text-yellow-300" />
                    <BaseHeading as="h4" size="sm" weight="semibold" class="text-white">
                      <span>مرحله فعلی</span>
                    </BaseHeading>
                  </div>
                  <BaseParagraph size="xs" class="text-yellow-200 font-medium mb-2">
                    <span>{{ currentUser.currentStage }}</span>
                  </BaseParagraph>
                  <div class="flex items-center justify-between text-xs text-white/80 mb-1">
                    <span>پیشرفت کلی</span>
                    <span class="font-bold">{{ Math.round((currentUser.roadmapProgress / currentUser.totalStages) * 100) }}%</span>
                  </div>
                  <div class="relative bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full h-full transition-all duration-700"
                      :style="{ width: `${(currentUser.roadmapProgress / currentUser.totalStages) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-white/60 text-xs mt-1 block">{{ currentUser.roadmapProgress }} از {{ currentUser.totalStages }} مرحله</span>
                </div>
                
                <!-- Matchmaking Compact Card -->
                <div class="backdrop-blur-sm bg-white/15 rounded-xl p-3 border border-white/25 shadow-lg w-44">
                  <div class="flex items-center mb-2">
                    <Icon :name="currentUser.matchmakingUnlocked ? 'ph:heart' : 'ph:lock'" class="w-4 h-4 me-2" :class="currentUser.matchmakingUnlocked ? 'text-pink-300' : 'text-gray-300'" />
                    <BaseHeading as="h4" size="sm" weight="semibold" class="text-white">
                      <span>همسان‌سازی</span>
                    </BaseHeading>
                  </div>
                  <BaseParagraph size="xs" class="text-white/90 mb-2 leading-relaxed">
                    <span>{{ currentUser.matchmakingUnlocked ? 'آماده برای آشنایی!' : 'در انتظار تکمیل مراحل' }}</span>
                  </BaseParagraph>
                  <BaseButton 
                    :disabled="!currentUser.matchmakingUnlocked"
                    size="xs"
                    class="w-full relative overflow-hidden group text-xs"
                    :class="currentUser.matchmakingUnlocked ? 'bg-gradient-to-r from-pink-700 to-rose-700 hover:from-pink-800 hover:to-rose-800 text-white font-bold shadow-lg shadow-pink-700/25' : 'bg-gray-600 text-white font-bold'"
                  >
                    <Icon :name="currentUser.matchmakingUnlocked ? 'ph:heart' : 'ph:lock'" class="w-3 h-3 me-1" />
                    <span>{{ currentUser.matchmakingUnlocked ? 'مشاهده' : 'قفل' }}</span>
                  </BaseButton>
                </div>
              </div>
              
              <!-- Main Welcome Content -->
              <div class="relative flex w-full items-center justify-center pt-24 pb-4">
                <div class="text-center max-w-4xl mx-auto px-8">
                  <div class="relative mb-6 inline-block">
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-full blur-lg scale-110"></div>
                    <BaseAvatar
                      :src="currentUser.avatar"
                      size="2xl"
                      class="relative border-2 border-white/30 ring-4 ring-white/20 ring-offset-4 ring-offset-transparent shadow-xl"
                    />
                    <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
                  </div>
                  
                  <BaseHeading
                    as="h1"
                    size="5xl"
                    weight="bold"
                    lead="tight"
                    class="ltablet:!text-4xl text-white drop-shadow-lg mb-4"
                  >
                    <span class="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">خوش آمدید، {{ currentUser.name }}</span>
                  </BaseHeading>
                  
                  <BaseParagraph class="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
                    <span>به داشبورد شخصی خود خوش آمدید. اینجا می‌توانید پیشرفت خود را در مسیر همسان‌یابی دنبال کنید، با مراحل مختلف آشنا شوید و بر اساس تحلیل‌های روان‌شناختی به هدف نهایی خود برسید.</span>
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>

          <!-- Roadmap Timeline -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-6 shadow-xl border border-white/20">
            <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100/50 to-blue-100/50 rounded-full blur-2xl"></div>
            
            <div class="relative flex items-center justify-between mb-8">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                lead="tight"
                class="text-gray-800 dark:text-white flex items-center"
              >
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center me-3 shadow-lg">
                  <Icon name="ph:map-trifold" class="w-5 h-5 text-white" />
                </div>
                <span class="bg-gradient-to-r from-gray-800 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">نقشه راه من</span>
              </BaseHeading>
              <BaseButton size="sm" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>مشاهده کامل</span>
              </BaseButton>
            </div>
            
            <div class="relative">
              <!-- Enhanced connecting line with progress -->
              <div class="absolute inset-y-0 left-8 w-1 bg-gradient-to-b from-green-400 via-blue-500 to-gray-300 transform rounded-full shadow-sm"></div>
              
              <div class="space-y-6">
                <div 
                  v-for="(stage, index) in roadmapStages" 
                  :key="stage.id"
                  class="relative"
                >
                  <!-- Main Stage Card -->
                  <div 
                    class="relative cursor-pointer group transition-all duration-300 hover:scale-[1.01]"
                    :class="{
                      'opacity-60': !canAccessStage(stage) && stage.status === 'pending',
                      'cursor-not-allowed': !canAccessStage(stage) && stage.status === 'pending'
                    }"
                    @click="canAccessStage(stage) ? toggleStageDetails(stage.id) : null"
                  >
                    <div class="flex items-start w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 mr-4">
                      <!-- Stage Icon with enhanced styling -->
                      <div class="relative flex-shrink-0 z-10 me-6">
                        <div 
                          class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110"
                          :class="{
                            'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-green-500/30': stage.status === 'completed',
                            'bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-yellow-500/30 animate-pulse': stage.status === 'current',
                            'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-600 shadow-gray-500/20': stage.status === 'pending'
                          }"
                        >
                          <Icon :name="getStageIcon(stage.type)" class="w-7 h-7" />
                          
                          <!-- Enhanced badges -->
                          <div v-if="stage.status === 'completed'" class="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-500">
                            <Icon name="ph:check" class="w-3 h-3 text-green-500" />
                          </div>
                          
                          <div v-if="stage.status === 'current'" class="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full animate-ping"></div>
                          
                          <div v-if="!canAccessStage(stage) && stage.status === 'pending'" class="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center shadow-lg">
                            <Icon name="ph:lock" class="w-3 h-3 text-white" />
                          </div>
                        </div>
                        
                        <!-- Progress circle for current stage -->
                        <div v-if="stage.status === 'current' && stage.progress" class="absolute inset-0 rounded-2xl">
                          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" fill="none" class="text-gray-300" />
                            <circle 
                              cx="32" cy="32" r="28" 
                              stroke="currentColor" 
                              stroke-width="2" 
                              fill="none" 
                              class="text-orange-500"
                              :stroke-dasharray="`${2 * Math.PI * 28}`"
                              :stroke-dashoffset="`${2 * Math.PI * 28 * (1 - stage.progress / 100)}`"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Enhanced Stage Content -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-3">
                          <div>
                            <BaseHeading as="h4" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <span>{{ stage.name }}</span>
                            </BaseHeading>
                            <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-2">
                              <span>{{ stage.description }}</span>
                            </BaseParagraph>
                            
                            <!-- Duration and timing info -->
                            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div class="flex items-center">
                                <Icon name="ph:clock" class="w-3 h-3 me-1" />
                                <span>{{ stage.duration }}</span>
                              </div>
                              
                              <div v-if="stage.completedAt" class="flex items-center">
                                <Icon name="ph:calendar-check" class="w-3 h-3 me-1" />
                                <span>تکمیل: {{ stage.completedAt }}</span>
                              </div>
                              
                              <div v-if="stage.startedAt" class="flex items-center">
                                <Icon name="ph:play" class="w-3 h-3 me-1" />
                                <span>شروع: {{ stage.startedAt }}</span>
                              </div>
                              
                              <div v-if="getTimeRemaining(stage)" class="flex items-center text-orange-600 dark:text-orange-400">
                                <Icon name="ph:timer" class="w-3 h-3 me-1" />
                                <span>{{ getTimeRemaining(stage) }}</span>
                              </div>
                            </div>
                          </div>
                          
                          <!-- Progress indicator -->
                          <div v-if="stage.progress !== undefined" class="text-left ms-4">
                            <div class="text-2xl font-bold text-gray-800 dark:text-white mb-1">{{ stage.progress }}%</div>
                            <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                class="h-full rounded-full transition-all duration-500"
                                :class="`bg-gradient-to-r ${getProgressColor(stage.progress)}`"
                                :style="{ width: `${stage.progress}%` }"
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Status and action area -->
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <BaseTag 
                              :class="{
                                'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200': stage.status === 'completed',
                                'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200': stage.status === 'current',
                                'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-300': stage.status === 'pending'
                              }"
                              rounded="full"
                              size="sm"
                              class="font-medium px-4 py-2 shadow-sm"
                            >
                              {{ stage.status === 'completed' ? '✓ تکمیل شده' : stage.status === 'current' ? '⚡ در حال انجام' : '⏳ در انتظار' }}
                            </BaseTag>
                            
                            <!-- Badge display -->
                            <div v-if="stage.badge" class="flex items-center bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
                              <Icon name="ph:medal" class="w-3 h-3 me-1" />
                              <span>{{ stage.badge }}</span>
                            </div>
                          </div>
                          
                          <!-- Expand/collapse indicator -->
                          <div v-if="canAccessStage(stage)" class="flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                            <Icon 
                              :name="expandedStage === stage.id ? 'ph:caret-up' : 'ph:caret-down'" 
                              class="w-5 h-5 transition-transform duration-200"
                              :class="{ 'rotate-180': expandedStage === stage.id }"
                            />
                          </div>
                        </div>
                        
                        <!-- Unlock message for locked stages -->
                        <div v-if="!canAccessStage(stage) && stage.unlockMessage" class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div class="flex items-center text-amber-700 dark:text-amber-300 text-sm">
                            <Icon name="ph:warning" class="w-4 h-4 me-2 flex-shrink-0" />
                            <span>{{ stage.unlockMessage }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Expanded Details Panel -->
                  <div 
                    v-if="expandedStage === stage.id && canAccessStage(stage)"
                    class="mt-4 mr-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 shadow-inner transition-all duration-300"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Tasks/Requirements Section -->
                      <div>
                        <BaseHeading as="h5" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4 flex items-center">
                          <Icon name="ph:list-checks" class="w-5 h-5 me-2 text-blue-600" />
                          <span>وظایف و فعالیت‌ها</span>
                        </BaseHeading>
                        
                        <div class="space-y-3">
                          <div 
                            v-for="task in stage.tasks" 
                            :key="task.name"
                            class="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/50"
                          >
                            <div class="flex items-center flex-1">
                              <div 
                                class="w-6 h-6 rounded-full flex items-center justify-center me-3 transition-all duration-200"
                                :class="task.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                              >
                                <Icon :name="task.completed ? 'ph:check' : 'ph:circle'" class="w-3 h-3" />
                              </div>
                              <span 
                                class="text-sm font-medium transition-colors"
                                :class="task.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'"
                              >
                                {{ task.name }}
                              </span>
                            </div>
                            
                            <!-- Task progress if available -->
                            <div v-if="task.progress !== undefined" class="flex items-center ms-3">
                              <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden me-2">
                                <div 
                                  class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                                  :style="{ width: `${task.progress}%` }"
                                ></div>
                              </div>
                              <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">{{ task.progress }}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Requirements -->
                        <div v-if="stage.requirements && stage.requirements.length" class="mt-6">
                          <BaseHeading as="h6" size="sm" weight="medium" class="text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <Icon name="ph:link" class="w-4 h-4 me-2 text-orange-500" />
                            <span>پیش‌نیازها</span>
                          </BaseHeading>
                          <div class="space-y-2">
                            <div 
                              v-for="req in stage.requirements" 
                              :key="req"
                              class="flex items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                            >
                              <Icon name="ph:arrow-circle-left" class="w-4 h-4 me-2 text-orange-600" />
                              <span class="text-sm text-orange-700 dark:text-orange-300">{{ req }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Insights and Additional Info -->
                      <div>
                        <BaseHeading as="h5" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4 flex items-center">
                          <Icon name="ph:lightbulb" class="w-5 h-5 me-2 text-yellow-500" />
                          <span>بینش و اطلاعات</span>
                        </BaseHeading>
                        
                        <!-- Insights -->
                        <div v-if="stage.insights" class="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
                          <BaseParagraph size="sm" class="text-indigo-800 dark:text-indigo-200 font-medium">
                            <span>{{ stage.insights }}</span>
                          </BaseParagraph>
                        </div>
                        
                        <!-- Special features -->
                        <div v-if="stage.specialFeature" class="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                          <div class="flex items-start">
                            <Icon name="ph:star" class="w-5 h-5 me-2 text-purple-600 flex-shrink-0 mt-0.5" />
                            <BaseParagraph size="sm" class="text-purple-800 dark:text-purple-200 font-medium">
                              <span>{{ stage.specialFeature }}</span>
                            </BaseParagraph>
                          </div>
                        </div>
                        
                        <!-- Action buttons for current/accessible stages -->
                        <div v-if="stage.status === 'current' || stage.status === 'completed'" class="space-y-3">
                          <BaseButton 
                            v-if="stage.status === 'current'"
                            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Icon name="ph:play" class="w-4 h-4 me-2" />
                            <span>ادامه {{ stage.type === 'course' ? 'دوره' : stage.type === 'test' ? 'آزمون' : 'مشاوره' }}</span>
                          </BaseButton>
                          
                          <BaseButton 
                            v-if="stage.status === 'completed'"
                            variant="outline"
                            class="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
                          >
                            <Icon name="ph:eye" class="w-4 h-4 me-2" />
                            <span>مشاهده نتایج و گزارش</span>
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Current Stage Details -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20 p-6 shadow-xl border border-orange-200/50">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/30 to-orange-200/30 rounded-full blur-xl"></div>
            
            <div class="relative flex items-center justify-between mb-8">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                lead="tight"
                class="text-gray-800 dark:text-white flex items-center"
              >
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center me-4 shadow-lg shadow-orange-500/25">
                  <Icon name="ph:target" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <span class="bg-gradient-to-r from-gray-800 to-orange-600 dark:from-white dark:to-orange-300 bg-clip-text text-transparent">مرحله فعلی من</span>
                  <div class="text-lg font-medium text-orange-600 dark:text-orange-400 mt-1">{{ currentStageDetails.name }}</div>
                </div>
              </BaseHeading>
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-500/25">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse me-2"></div>
                  <span class="font-medium">در حال انجام</span>
                </div>
              </div>
            </div>
            
            <div class="relative space-y-8">
              <!-- Course Section -->
              <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-xl"></div>
                
                <div class="relative flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 me-3">
                      <Icon name="ph:book-open" class="w-5 h-5 text-white" />
                    </div>
                    <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                      <span>{{ currentStageDetails.course.title }}</span>
                    </BaseHeading>
                  </div>
                  <div class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                    {{ currentStageDetails.course.status === 'in_progress' ? 'در حال انجام' : 'تکمیل شده' }}
                  </div>
                </div>
                
                <div class="mb-6">
                  <div class="flex justify-between text-sm mb-3">
                    <span class="text-gray-600 dark:text-gray-300 font-medium">پیشرفت دوره</span>
                    <span class="text-gray-800 dark:text-white font-bold text-lg">{{ currentStageDetails.course.progress }}%</span>
                  </div>
                  <div class="relative bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                    <div class="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50"></div>
                    <div 
                      class="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full h-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                      :style="{ width: `${currentStageDetails.course.progress}%` }"
                    >
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-3">
                  <BaseButton class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Icon name="ph:play" class="w-4 h-4 me-2 relative z-10" />
                    <span class="relative z-10">ادامه دوره</span>
                  </BaseButton>
                  <BaseButton class="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Icon name="ph:telegram-logo" class="w-4 h-4 me-2" />
                    <span>تلگرام</span>
                  </BaseButton>
                </div>
              </div>
              
              <!-- Tests Section -->
              <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-xl"></div>
                
                <div class="relative flex items-center mb-6">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 me-3">
                    <Icon name="ph:clipboard-text" class="w-5 h-5 text-white" />
                  </div>
                  <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                    <span>پرسش‌نامه‌های روان‌شناختی</span>
                  </BaseHeading>
                </div>
                
                <div class="space-y-4">
                  <div 
                    v-for="test in currentStageDetails.tests" 
                    :key="test.name"
                    class="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    :class="test.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200' : 'bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-600'"
                  >
                    <div class="flex items-center">
                      <div 
                        class="w-8 h-8 rounded-lg flex items-center justify-center me-3 shadow-sm"
                        :class="test.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                      >
                        <Icon :name="test.status === 'completed' ? 'ph:check' : 'ph:clock'" class="w-4 h-4" />
                      </div>
                      <span class="font-medium text-gray-800 dark:text-white">{{ test.name }}</span>
                    </div>
                    <div 
                      class="px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                      :class="test.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                    >
                      {{ test.status === 'completed' ? '✓ تکمیل شده' : '⏳ در انتظار' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Counseling Section -->
              <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 p-6 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-full blur-xl"></div>
                
                <div class="relative flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 me-3">
                      <Icon name="ph:chat-circle" class="w-5 h-5 text-white" />
                    </div>
                    <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                      <span>جلسه مشاوره فردی</span>
                    </BaseHeading>
                  </div>
                  <div class="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    رزرو نشده
                  </div>
                </div>
                
                <div class="mb-6">
                  <div class="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <Icon name="ph:users" class="w-4 h-4 me-2" />
                    <span class="font-medium">{{ currentStageDetails.counseling.availableCounselors }} مشاور متخصص در دسترس</span>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    مشاوران با تجربه بالای 5 سال
                  </div>
                </div>
                
                <BaseButton class="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Icon name="ph:calendar-plus" class="w-4 h-4 me-2 relative z-10" />
                  <span class="relative z-10">رزرو جلسه مشاوره</span>
                </BaseButton>
              </div>
              
              <!-- Stage Completion -->
              <div class="text-center pt-8">
                <div class="relative inline-block">
                  <BaseButton 
                    class="px-12 py-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 shadow-lg relative overflow-hidden group cursor-not-allowed"
                    disabled
                  >
                    <Icon name="ph:lock" class="w-5 h-5 me-3" />
                    <span class="text-lg font-semibold">اتمام مرحله</span>
                  </BaseButton>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon name="ph:x" class="w-3 h-3 text-white" />
                  </div>
                </div>
                <div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                  <div class="flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Icon name="ph:warning" class="w-5 h-5 me-2" />
                    <span class="font-medium">برای اتمام مرحله، همه بخش‌ها را تکمیل کنید</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Psychological Analysis -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 shadow-xl border border-indigo-200/50">
            <div class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-xl"></div>
            
            <div class="relative flex items-center justify-between mb-6">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                lead="tight"
                class="text-gray-800 dark:text-white flex items-center"
              >
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center me-4 shadow-lg shadow-indigo-500/25">
                  <Icon name="ph:brain" class="w-6 h-6 text-white" />
                </div>
                <span class="bg-gradient-to-r from-gray-800 to-indigo-600 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">تحلیل‌های روان‌شناختی</span>
              </BaseHeading>
              <BaseButton class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span>مشاهده همه</span>
              </BaseButton>
            </div>
            
            <div class="relative">
              <div class="bg-gradient-to-br from-white/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-indigo-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div class="flex items-center justify-between mb-4">
                  <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                    <span>آخرین تحلیل شخصیت</span>
                  </BaseHeading>
                  <div class="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    <div class="text-2xl font-bold me-2">{{ psychologicalAnalysis.score }}</div>
                    <div class="text-sm opacity-80">/100</div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <div class="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl p-4 border border-indigo-200/50">
                    <BaseParagraph size="md" class="text-gray-700 dark:text-gray-200 font-medium">
                      <span>{{ psychologicalAnalysis.latest }}</span>
                    </BaseParagraph>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-yellow-200/50">
                  <div class="flex items-start">
                    <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center me-3 shadow-lg flex-shrink-0">
                      <Icon name="ph:lightbulb" class="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800 dark:text-white mb-1">پیشنهاد متخصص</div>
                      <BaseParagraph size="sm" class="text-gray-700 dark:text-gray-200">
                        <span>{{ psychologicalAnalysis.recommendation }}</span>
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!-- Notifications Widget -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 p-6 shadow-xl border border-yellow-200/50">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200/30 to-yellow-200/30 rounded-full blur-lg"></div>
            
            <div class="relative flex items-center justify-between mb-6">
              <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center me-3 shadow-lg shadow-yellow-500/25 relative">
                  <Icon name="ph:bell" class="w-5 h-5 text-white" />
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span>اعلان‌های من</span>
              </BaseHeading>
              <div class="bg-gradient-to-r from-red-500 to-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-sm font-bold animate-bounce">
                {{ notifications.filter(n => n.isNew).length }}
              </div>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="notification in notifications.slice(0, 3)" 
                :key="notification.id"
                class="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                :class="notification.isNew ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300/50' : 'bg-white/70 dark:bg-gray-800/70 border border-gray-200/50'"
              >
                <div class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div 
                        class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                        :class="{
                          'bg-gradient-to-br from-blue-500 to-indigo-600 text-white': notification.type === 'analysis',
                          'bg-gradient-to-br from-green-500 to-emerald-600 text-white': notification.type === 'course',
                          'bg-gradient-to-br from-purple-500 to-pink-600 text-white': notification.type === 'counseling'
                        }"
                      >
                        <Icon 
                          :name="notification.type === 'analysis' ? 'ph:chart-line' : notification.type === 'course' ? 'ph:book-open' : 'ph:chat-circle'"
                          class="w-5 h-5"
                        />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <BaseHeading as="h5" size="sm" weight="semibold" class="text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <span>{{ notification.title }}</span>
                      </BaseHeading>
                      <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                        <span>{{ notification.message }}</span>
                      </BaseParagraph>
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ notification.date }}</span>
                        <div v-if="notification.isNew" class="flex items-center">
                          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse me-2"></div>
                          <span class="text-xs font-bold text-red-600 dark:text-red-400">جدید</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Hover effect overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </div>
            </div>
            
            <div class="mt-6">
              <BaseButton class="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Icon name="ph:list" class="w-4 h-4 me-2 relative z-10" />
                <span class="relative z-10">مشاهده همه اعلان‌ها</span>
              </BaseButton>
            </div>
          </div>
          
          <!-- Matchmaking Status -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-red-900/20 p-6 shadow-xl border border-pink-200/50">
            <div class="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tr from-red-200/40 to-pink-200/40 rounded-full blur-lg"></div>
            
            <div class="relative text-center">
              <div class="mb-6">
                <div class="relative inline-block">
                  <div 
                    class="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
                    :class="currentUser.matchmakingUnlocked ? 'bg-gradient-to-br from-pink-700 to-rose-800' : 'bg-gradient-to-br from-gray-600 to-gray-700'"
                  >
                    <Icon 
                      :name="currentUser.matchmakingUnlocked ? 'ph:heart' : 'ph:lock'"
                      class="w-10 h-10 text-white"
                    />
                  </div>
                  
                  <!-- Status indicator -->
                  <div 
                    class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    :class="currentUser.matchmakingUnlocked ? 'bg-green-500' : 'bg-red-500'"
                  >
                    <Icon :name="currentUser.matchmakingUnlocked ? 'ph:check' : 'ph:x'" class="w-4 h-4 text-white" />
                  </div>
                  
                  <!-- Floating hearts animation (when unlocked) -->
                  <div v-if="currentUser.matchmakingUnlocked" class="absolute inset-0 pointer-events-none">
                    <div class="absolute top-0 left-0 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75"></div>
                    <div class="absolute top-2 right-2 w-2 h-2 bg-rose-400 rounded-full animate-ping opacity-50 animation-delay-300"></div>
                    <div class="absolute bottom-1 left-3 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60 animation-delay-700"></div>
                  </div>
                </div>
              </div>
              
              <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-3">
                <span class="bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">آمادگی برای آشنایی</span>
              </BaseHeading>
              
              <div class="mb-6">
                <div 
                  class="rounded-xl p-4 border backdrop-blur-sm"
                  :class="currentUser.matchmakingUnlocked ? 'bg-green-100/80 dark:bg-green-900/30 border-green-300/50' : 'bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-300/50'"
                >
                  <BaseParagraph size="sm" class="font-medium leading-relaxed"
                    :class="currentUser.matchmakingUnlocked ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'"
                  >
                    <span v-if="!currentUser.matchmakingUnlocked">
                      برای ورود به مرحله آشنایی، ابتدا جلسه مشاوره تأیید نهایی را کامل کنید.
                    </span>
                    <span v-else>
                      شما آماده مشاهده پیشنهادهای همسان‌سازی هستید!
                    </span>
                  </BaseParagraph>
                </div>
              </div>
              
              <BaseButton 
                :disabled="!currentUser.matchmakingUnlocked"
                class="w-full relative overflow-hidden group transition-all duration-300 hover:scale-105"
                :class="currentUser.matchmakingUnlocked ? 'bg-gradient-to-r from-pink-700 to-rose-800 hover:from-pink-800 hover:to-rose-900 text-white font-bold shadow-lg hover:shadow-xl' : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold shadow-lg cursor-not-allowed'"
              >
                <div v-if="currentUser.matchmakingUnlocked" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Icon :name="currentUser.matchmakingUnlocked ? 'ph:users' : 'ph:lock'" class="w-5 h-5 me-2 relative z-10" />
                <span class="relative z-10 font-bold">{{ currentUser.matchmakingUnlocked ? 'مشاهده پیشنهادها' : 'قفل شده' }}</span>
              </BaseButton>
              
              <div v-if="currentUser.matchmakingUnlocked" class="mt-4">
                <div class="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-3 border border-pink-200/50">
                  <div class="flex items-center justify-center">
                    <Icon name="ph:heart" class="w-4 h-4 text-pink-600 me-2 animate-pulse" />
                    <span class="text-sm font-bold text-pink-700 dark:text-pink-300">3 پیشنهاد جدید در انتظار شما!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 p-6 shadow-xl border border-emerald-200/50">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-200/30 to-emerald-200/30 rounded-full blur-lg"></div>
            
            <div class="relative">
              <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-6 flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center me-3 shadow-lg shadow-emerald-500/25">
                  <Icon name="ph:lightning" class="w-5 h-5 text-white" />
                </div>
                <span class="bg-gradient-to-r from-gray-800 to-emerald-600 dark:from-white dark:to-emerald-300 bg-clip-text text-transparent">دسترسی سریع</span>
              </BaseHeading>
              
              <div class="space-y-3">
                <button 
                  v-for="action in quickActions" 
                  :key="action.action"
                  @click="handleQuickAction(action.action)"
                  class="group w-full flex items-center gap-4 p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-right"
                >
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-all duration-300">
                      <Icon :name="action.icon" class="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ action.title }}</span>
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800 transition-all duration-300">
                      <Icon name="ph:caret-left" class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
