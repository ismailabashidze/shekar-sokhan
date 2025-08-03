<script setup lang="ts">
definePageMeta({
  title: 'نقشه راه ازدواج',
  preview: {
    title: 'Marriage Roadmap',
    description: 'Step-by-step guide to marriage preparation',
    categories: ['guidance'],
    src: '/img/screens/roadmap-hammasir.png',
    srcDark: '/img/screens/roadmap-hammasir-dark.png',
    order: 5,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Mock user progress data
const userProgress = ref({
  currentStage: 2,
  completedMilestones: [1, 2, 3, 4],
  totalScore: 65,
  lastActivity: '1403/04/12'
})

// Roadmap stages data
const roadmapStages = [
  {
    id: 1,
    title: 'خودشناسی',
    subtitle: 'شناخت عمیق از شخصیت و ویژگی‌های خود',
    description: 'در این مرحله با انجام آزمون‌های شخصیت‌شناسی، نقاط قوت و ضعف خود را بشناسید.',
    icon: 'ph:user-circle',
    color: 'blue',
    duration: '2-3 هفته',
    difficulty: 'آسان',
    status: 'completed',
    progress: 100,
    estimatedTime: '15-20 ساعت',
    milestones: [
      {
        id: 1,
        title: 'دوره خودشناسی پایه',
        description: '6 جلسه آنلاین درباره اصول شناخت شخصیت',
        status: 'completed',
        type: 'course',
        duration: '90 دقیقه',
        sessions: 6,
        points: 30
      },
      {
        id: 2,
        title: 'آزمون شخصیت NEO',
        description: 'شناسایی پنج عامل اصلی شخصیت',
        status: 'completed',
        type: 'test',
        link: '/hammasir/neo-test',
        duration: '30 دقیقه',
        points: 25
      },
      {
        id: 3,
        title: 'آزمون سبک‌های دلبستگی',
        description: 'درک الگوهای رفتاری در روابط',
        status: 'completed',
        type: 'test',
        duration: '20 دقیقه',
        points: 20
      },
      {
        id: 4,
        title: 'آزمون ارزش‌های زندگی',
        description: 'تعیین اولویت‌ها و اهداف مهم',
        status: 'completed',
        type: 'test',
        duration: '15 دقیقه',
        points: 15
      },
      {
        id: 5,
        title: 'جلسه مشاوره فردی',
        description: 'تحلیل نتایج آزمون‌ها با روان‌شناس',
        status: 'completed',
        type: 'therapy',
        duration: '60 دقیقه',
        therapist: 'دکتر مریم احمدی',
        points: 35
      },
      {
        id: 6,
        title: 'گزارش جامع خودشناسی',
        description: 'دریافت گزارش کامل شخصیت و توصیه‌ها',
        status: 'completed',
        type: 'report',
        points: 25
      }
    ]
  },
  {
    id: 2,
    title: 'آمادگی روانی',
    subtitle: 'تقویت مهارت‌های عاطفی و ارتباطی',
    description: 'توسعه هوش هیجانی، مهارت‌های ارتباطی و آمادگی برای زندگی مشترک.',
    icon: 'ph:heart',
    color: 'rose',
    duration: '3-4 هفته',
    difficulty: 'متوسط',
    status: 'in_progress',
    progress: 60,
    estimatedTime: '20-25 ساعت',
    milestones: [
      {
        id: 7,
        title: 'دوره هوش هیجانی',
        description: '8 جلسه آموزش مدیریت احساسات',
        status: 'completed',
        type: 'course',
        duration: '75 دقیقه',
        sessions: 8,
        instructor: 'دکتر علی رضایی',
        points: 35
      },
      {
        id: 8,
        title: 'آزمون هوش هیجانی Cattell',
        description: 'ارزیابی سطح هوش عاطفی',
        status: 'completed',
        type: 'test',
        duration: '25 دقیقه',
        points: 20
      },
      {
        id: 9,
        title: 'دوره مهارت‌های ارتباطی',
        description: 'تکنیک‌های گفتگوی مؤثر و فعال گوش دادن',
        status: 'in_progress',
        type: 'course',
        duration: '90 دقیقه',
        sessions: 10,
        progress: 60,
        nextSession: '1403/04/15',
        points: 40
      },
      {
        id: 10,
        title: 'ورکشاپ مدیریت تعارض',
        description: 'شبیه‌سازی موقعیت‌های تعارض و حل آن',
        status: 'locked',
        type: 'workshop',
        duration: '3 ساعت',
        sessions: 2,
        points: 30
      },
      {
        id: 11,
        title: 'جلسات مشاوره زوجی (شبیه‌سازی)',
        description: '3 جلسه تمرین ارتباط با همسر آینده',
        status: 'locked',
        type: 'therapy',
        duration: '60 دقیقه',
        sessions: 3,
        therapist: 'دکتر فاطمه حسینی',
        points: 45
      },
      {
        id: 12,
        title: 'آزمون آمادگی ارتباطی',
        description: 'ارزیابی نهایی مهارت‌های ارتباطی',
        status: 'locked',
        type: 'test',
        duration: '30 دقیقه',
        points: 25
      }
    ]
  },
  {
    id: 3,
    title: 'مالی و اقتصادی',
    subtitle: 'برنامه‌ریزی مالی برای زندگی مشترک',
    description: 'یادگیری مدیریت بودجه، سرمایه‌گذاری و برنامه‌ریزی مالی خانواده.',
    icon: 'ph:coins',
    color: 'green',
    duration: '2-3 هفته',
    difficulty: 'متوسط',
    status: 'upcoming',
    progress: 0,
    estimatedTime: '12-15 ساعت',
    milestones: [
      {
        id: 13,
        title: 'دوره مدیریت مالی خانواده',
        description: '5 جلسه آموزش بودجه‌بندی و صرفه‌جویی',
        status: 'locked',
        type: 'course',
        duration: '60 دقیقه',
        sessions: 5,
        instructor: 'مهندس سعید نوری',
        points: 30
      },
      {
        id: 14,
        title: 'ورکشاپ سرمایه‌گذاری مشترک',
        description: 'انواع سرمایه‌گذاری امن برای زوج‌ها',
        status: 'locked',
        type: 'workshop',
        duration: '4 ساعت',
        sessions: 1,
        points: 25
      },
      {
        id: 15,
        title: 'مشاوره مالی فردی',
        description: 'جلسه تحلیل وضعیت مالی شخصی',
        status: 'locked',
        type: 'therapy',
        duration: '45 دقیقه',
        therapist: 'مشاور محمد کریمی',
        points: 20
      },
      {
        id: 16,
        title: 'طرح کسب‌وکار خانوادگی',
        description: 'ایده‌پردازی برای درآمد مشترک',
        status: 'locked',
        type: 'project',
        duration: '2 هفته',
        points: 35
      },
      {
        id: 17,
        title: 'گزارش برنامه مالی',
        description: 'تدوین برنامه مالی 5 ساله',
        status: 'locked',
        type: 'report',
        points: 25
      }
    ]
  },
  {
    id: 4,
    title: 'خانواده و اجتماع',
    subtitle: 'آمادگی برای تشکیل خانواده',
    description: 'درک مسئولیت‌های خانوادگی، تربیت فرزند و روابط اجتماعی.',
    icon: 'ph:users',
    color: 'purple',
    duration: '3-4 هفته',
    difficulty: 'سخت',
    status: 'upcoming',
    progress: 0,
    estimatedTime: '25-30 ساعت',
    milestones: [
      {
        id: 12,
        title: 'مهارت‌های والدینی',
        description: 'اصول تربیت کودک',
        status: 'locked',
        type: 'course',
        points: 30
      },
      {
        id: 13,
        title: 'روابط با خانواده‌ها',
        description: 'مدیریت روابط با خویشاوندان',
        status: 'locked',
        type: 'workshop',
        points: 20
      },
      {
        id: 14,
        title: 'مسئولیت‌های اجتماعی',
        description: 'نقش خانواده در جامعه',
        status: 'locked',
        type: 'course',
        points: 15
      }
    ]
  },
  {
    id: 5,
    title: 'آمادگی نهایی',
    subtitle: 'آماده‌سازی برای ازدواج',
    description: 'بررسی نهایی آمادگی، انتخاب همسر و آمادگی برای زندگی مشترک.',
    icon: 'ph:check-circle',
    color: 'indigo',
    duration: '2-3 هفته',
    difficulty: 'متوسط',
    status: 'upcoming',
    progress: 0,
    estimatedTime: '10-15 ساعت',
    milestones: [
      {
        id: 15,
        title: 'معیارهای انتخاب همسر',
        description: 'تعیین ویژگی‌های مطلوب',
        status: 'locked',
        type: 'assessment',
        points: 25
      },
      {
        id: 16,
        title: 'سازگاری روانی',
        description: 'بررسی انطباق شخصیتی',
        status: 'locked',
        type: 'test',
        points: 30
      },
      {
        id: 17,
        title: 'گزارش نهایی آمادگی',
        description: 'ارزیابی جامع آمادگی ازدواج',
        status: 'locked',
        type: 'report',
        points: 35
      }
    ]
  }
]

function getStageStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'green'
    case 'in_progress': return 'blue'
    case 'upcoming': return 'gray'
    default: return 'gray'
  }
}

function getMilestoneStatusIcon(status: string) {
  switch (status) {
    case 'completed': return 'ph:check-circle'
    case 'in_progress': return 'ph:play-circle'
    case 'locked': return 'ph:lock'
    default: return 'ph:circle'
  }
}

function getMilestoneTypeIcon(type: string) {
  switch (type) {
    case 'test': return 'ph:clipboard-text'
    case 'course': return 'ph:book'
    case 'workshop': return 'ph:users'
    case 'therapy': return 'ph:chat-circle'
    case 'assessment': return 'ph:chart-bar'
    case 'planning': return 'ph:calendar'
    case 'report': return 'ph:file-text'
    case 'project': return 'ph:lightbulb'
    default: return 'ph:circle'
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'آسان': return 'green'
    case 'متوسط': return 'yellow'
    case 'سخت': return 'red'
    default: return 'gray'
  }
}

function navigateToMilestone(milestone: any) {
  if (milestone.status === 'locked') return
  
  if (milestone.link) {
    navigateTo(milestone.link)
  } else {
    // For demo purposes, show an alert
    console.log('Navigate to milestone:', milestone.title)
  }
}

const overallProgress = computed(() => {
  const totalMilestones = roadmapStages.reduce((sum, stage) => sum + stage.milestones.length, 0)
  return Math.round((userProgress.value.completedMilestones.length / totalMilestones) * 100)
})

const currentStage = computed(() => {
  return roadmapStages.find(stage => stage.id === userProgress.value.currentStage)
})

// Modal state
const selectedStage = ref(null)
const isModalOpen = ref(false)

function openStageModal(stage: any) {
  selectedStage.value = stage
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedStage.value = null
}

function getModalHeaderColor(status: string) {
  switch (status) {
    case 'completed': return 'from-green-500 to-emerald-600'
    case 'in_progress': return 'from-rose-500 to-rose-600'
    case 'upcoming': return 'from-gray-500 to-gray-600'
    default: return 'from-rose-500 to-rose-600'
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-1 shadow-2xl shadow-indigo-500/25 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-indigo-600/90 via-purple-700/90 to-pink-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Floating decorative elements -->
        <div class="absolute top-6 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-8 left-12 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-6 shadow-xl">
            <Icon name="ph:map-trifold" class="w-10 h-10 text-white" />
          </div>
          
          <BaseHeading
            as="h1"
            size="4xl"
            weight="bold"
            lead="tight"
            class="text-white drop-shadow-lg mb-4"
          >
            <span>نقشه راه ازدواج</span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            <span>مسیر گام به گام آمادگی برای ازدواج. از خودشناسی تا آمادگی نهایی، همه مراحل ضروری را طی کنید.</span>
          </BaseParagraph>

          <!-- Overall Progress -->
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-md mx-auto">
            <div class="flex items-center justify-between mb-3">
              <span class="text-white/80 text-sm">پیشرفت کلی</span>
              <span class="text-white font-bold text-lg">{{ overallProgress }}%</span>
            </div>
            <div class="w-full bg-white/20 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-700"
                :style="{ width: `${overallProgress}%` }"
              ></div>
            </div>
            <div class="text-white/70 text-xs mt-2">
              {{ userProgress.completedMilestones.length }} از {{ roadmapStages.reduce((sum, stage) => sum + stage.milestones.length, 0) }} فعالیت تکمیل شده
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Stage Highlight -->
    <div v-if="currentStage" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg me-4 bg-gradient-to-br from-rose-400 to-rose-600 text-white"
          >
            <Icon name="ph:heart" class="w-6 h-6" />
          </div>
          <div>
            <BaseHeading as="h2" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
              <span>مرحله فعلی: {{ currentStage.title }}</span>
            </BaseHeading>
            <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
              <span>{{ currentStage.subtitle }}</span>
            </BaseParagraph>
          </div>
        </div>
        
        <div class="text-left">
          <div class="text-2xl font-bold text-blue-600">
            {{ currentStage.progress }}%
          </div>
          <div class="text-xs text-gray-500">تکمیل</div>
        </div>
      </div>
      
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div 
          class="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-rose-400 to-rose-600"
          :style="{ width: `${currentStage.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Roadmap Timeline -->
    <div class="space-y-8">
      <div
        v-for="(stage, index) in roadmapStages"
        :key="stage.id"
        class="relative"
      >
        <!-- Timeline Line -->
        <div 
          v-if="index < roadmapStages.length - 1"
          class="absolute left-8 top-20 w-0.5 h-full bg-gray-200 dark:bg-gray-700 z-0"
          :class="stage.status === 'completed' ? 'bg-green-400' : ''"
        ></div>

        <!-- Stage Card -->
        <div 
          @click="openStageModal(stage)"
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <!-- Stage Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between">
              <div class="flex items-start">
                <!-- Stage Number & Icon -->
                <div class="relative me-4">
                  <div 
                    class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
                    :class="stage.status === 'completed' 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                      : stage.status === 'in_progress'
                      ? `bg-gradient-to-br from-${stage.color}-400 to-${stage.color}-600 text-white`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                  >
                    <Icon :name="stage.icon" class="w-8 h-8" />
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-200 dark:border-gray-700">
                    {{ stage.id }}
                  </div>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <BaseHeading as="h3" size="xl" weight="semibold" class="text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span>{{ stage.title }}</span>
                    </BaseHeading>
                    
                    <!-- Status Badge -->
                    <div 
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="stage.status === 'completed' 
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : stage.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'"
                    >
                      {{ stage.status === 'completed' ? 'تکمیل شده' : stage.status === 'in_progress' ? 'در حال انجام' : 'آینده' }}
                    </div>
                    
                    <!-- Interactive Indicator -->
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-blue-600">
                      <Icon name="ph:cursor-click" class="w-4 h-4" />
                      <span class="text-xs font-medium">کلیک کنید</span>
                    </div>
                  </div>
                  
                  <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-3">
                    <span>{{ stage.subtitle }}</span>
                  </BaseParagraph>
                  
                  <BaseParagraph class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <span>{{ stage.description }}</span>
                  </BaseParagraph>
                </div>
              </div>
              
              <!-- Stage Stats -->
              <div class="text-left space-y-2">
                <div class="text-2xl font-bold" :class="`text-${getStageStatusColor(stage.status)}-600`">
                  {{ stage.progress }}%
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div class="flex items-center">
                    <Icon name="ph:clock" class="w-3 h-3 me-1" />
                    <span>{{ stage.duration }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:timer" class="w-3 h-3 me-1" />
                    <span>{{ stage.estimatedTime }}</span>
                  </div>
                  <div class="flex items-center col-span-2">
                    <Icon name="ph:chart-line" class="w-3 h-3 me-1" />
                    <span 
                      class="px-1 py-0.5 rounded text-xs"
                      :class="`bg-${getDifficultyColor(stage.difficulty)}-100 text-${getDifficultyColor(stage.difficulty)}-700`"
                    >
                      {{ stage.difficulty }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="stage.status === 'completed' 
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : `bg-gradient-to-r from-${stage.color}-400 to-${stage.color}-600`"
                  :style="{ width: `${stage.progress}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Click Indicator -->
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Icon name="ph:cursor-click" class="w-4 h-4 me-2" />
                <span>کلیک کنید برای مشاهده جزئیات</span>
              </div>
              
              <BaseButton
                size="sm"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                @click.stop="openStageModal(stage)"
              >
                <Icon name="ph:eye" class="w-4 h-4 me-2" />
                <span>مشاهده جزئیات</span>
              </BaseButton>
            </div>
          </div>

          <!-- Milestones -->
          <div class="p-6">
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
              <span>فعالیت‌های مرحله</span>
            </BaseHeading>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="milestone in stage.milestones"
                :key="milestone.id"
                @click.stop="navigateToMilestone(milestone)"
                class="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200"
                :class="{
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': milestone.status === 'completed',
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800': milestone.status === 'in_progress',
                  'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600': milestone.status !== 'locked',
                  'opacity-60 cursor-not-allowed': milestone.status === 'locked'
                }"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <div 
                      class="w-8 h-8 rounded-lg flex items-center justify-center me-3"
                      :class="milestone.status === 'completed' 
                        ? 'bg-green-500 text-white'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'"
                    >
                      <Icon :name="getMilestoneStatusIcon(milestone.status)" class="w-4 h-4" />
                    </div>
                    
                    <div class="flex-1">
                      <div class="font-medium text-sm text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {{ milestone.title }}
                      </div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">
                        {{ milestone.description }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-6 h-6 rounded-lg flex items-center justify-center"
                      :class="milestone.status === 'completed' 
                        ? 'bg-green-100 text-green-600'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'"
                    >
                      <Icon :name="getMilestoneTypeIcon(milestone.type)" class="w-3 h-3" />
                    </div>
                    
                    <div class="text-xs font-medium text-gray-500 text-center">
                      <div>+{{ milestone.points }}</div>
                      <div class="text-gray-400">امتیاز</div>
                    </div>
                  </div>
                </div>
                
                <!-- Milestone Detail Button -->
                <div class="mt-3">
                  <BaseButton
                    size="sm"
                    class="w-full font-medium shadow-sm transition-all duration-300"
                    :class="{
                      'bg-green-500 text-white hover:bg-green-600 shadow-green-500/25': milestone.status === 'completed',
                      'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25': milestone.status === 'in_progress',
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25': milestone.status !== 'completed' && milestone.status !== 'in_progress' && milestone.status !== 'locked',
                      'bg-gray-300 text-gray-500 cursor-not-allowed': milestone.status === 'locked'
                    }"
                    @click.stop="navigateToMilestone(milestone)"
                    :disabled="milestone.status === 'locked'"
                  >
                    <Icon 
                      :name="milestone.status === 'completed' ? 'ph:eye' : milestone.status === 'in_progress' ? 'ph:play' : milestone.status === 'locked' ? 'ph:lock' : 'ph:arrow-left'" 
                      class="w-4 h-4 me-2" 
                    />
                    <span>{{ milestone.status === 'completed' ? 'مشاهده نتایج' : milestone.status === 'in_progress' ? 'ادامه' : milestone.status === 'locked' ? 'قفل شده' : 'شروع' }}</span>
                  </BaseButton>
                </div>
              </div>
            </div>
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
        @click="navigateTo('/hammasir/questionnaires')"
        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
      >
        <Icon name="ph:clipboard-text" class="w-4 h-4 me-2" />
        <span>مشاهده پرسش‌نامه‌ها</span>
      </BaseButton>
    </div>

    <!-- Stage Detail Modal -->
    <div 
      v-if="isModalOpen && selectedStage"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div 
        @click.stop
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <!-- Modal Header -->
        <div class="relative overflow-hidden">
          <div 
            class="absolute inset-0 bg-gradient-to-br opacity-90"
            :class="getModalHeaderColor(selectedStage?.status)"
          ></div>
          
          <div class="relative p-6 text-white">
            <div class="flex items-start justify-between">
              <div class="flex items-start">
                <div 
                  class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg me-4 bg-white/20 backdrop-blur-sm"
                >
                  <Icon name="ph:heart" class="w-8 h-8" />
                </div>
                
                <div>
                  <BaseHeading as="h2" size="2xl" weight="bold" class="text-white mb-2">
                    <span>{{ selectedStage?.title || 'مرحله' }}</span>
                  </BaseHeading>
                  <BaseParagraph class="text-white/90 mb-3">
                    <span>{{ selectedStage?.subtitle || 'توضیحات مرحله' }}</span>
                  </BaseParagraph>
                  <BaseParagraph class="text-white/80 text-sm leading-relaxed">
                    <span>{{ selectedStage?.description || 'شرح کامل مرحله' }}</span>
                  </BaseParagraph>
                </div>
              </div>
              
              <button 
                @click="closeModal"
                class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Icon name="ph:x" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Stage Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="text-2xl font-bold">{{ selectedStage?.progress || 0 }}%</div>
                <div class="text-xs opacity-80">پیشرفت</div>
              </div>
              
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="text-lg font-bold">{{ selectedStage?.milestones?.length || 0 }}</div>
                <div class="text-xs opacity-80">فعالیت</div>
              </div>
              
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="text-lg font-bold">{{ selectedStage?.duration || '-' }}</div>
                <div class="text-xs opacity-80">مدت زمان</div>
              </div>
              
              <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div class="text-lg font-bold">{{ selectedStage?.estimatedTime || '-' }}</div>
                <div class="text-xs opacity-80">تخمین زمان</div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-6">
              <div class="w-full bg-white/20 rounded-full h-2">
                <div 
                  class="bg-white h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${selectedStage?.progress || 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6 max-h-96 overflow-y-auto">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-6">
            <span>فعالیت‌های مرحله {{ selectedStage?.title || 'انتخاب شده' }}</span>
          </BaseHeading>
          
          <div class="space-y-4">
            <div
              v-for="milestone in (selectedStage?.milestones || [])"
              :key="milestone.id"
              @click="navigateToMilestone(milestone)"
              class="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200"
              :class="{
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': milestone.status === 'completed',
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800': milestone.status === 'in_progress',
                'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600': milestone.status !== 'locked',
                'opacity-60 cursor-not-allowed': milestone.status === 'locked'
              }"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start flex-1">
                  <!-- Status Icon -->
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center me-4 flex-shrink-0"
                    :class="milestone.status === 'completed' 
                      ? 'bg-green-500 text-white'
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'"
                  >
                    <Icon :name="getMilestoneStatusIcon(milestone.status)" class="w-5 h-5" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <!-- Title and Description -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <span>{{ milestone.title }}</span>
                        </BaseHeading>
                        <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          <span>{{ milestone.description }}</span>
                        </BaseParagraph>
                      </div>
                      
                      <!-- Type Icon and Points -->
                      <div class="flex items-center gap-3 ms-4">
                        <div 
                          class="w-8 h-8 rounded-lg flex items-center justify-center"
                          :class="milestone.status === 'completed' 
                            ? 'bg-green-100 text-green-600'
                            : milestone.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'"
                        >
                          <Icon :name="getMilestoneTypeIcon(milestone.type)" class="w-4 h-4" />
                        </div>
                        
                        <div class="text-center">
                          <div class="text-sm font-bold text-gray-800 dark:text-white">+{{ milestone.points }}</div>
                          <div class="text-xs text-gray-500">امتیاز</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Detailed Information -->
                    <div class="grid md:grid-cols-2 gap-4 mt-4">
                      <!-- Duration and Sessions -->
                      <div v-if="milestone.duration || milestone.sessions" class="space-y-2">
                        <div v-if="milestone.duration" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:clock" class="w-4 h-4 me-2 text-blue-500" />
                          <span class="font-medium">مدت زمان:</span>
                          <span class="ms-1">{{ milestone.duration }}</span>
                        </div>
                        
                        <div v-if="milestone.sessions" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:list" class="w-4 h-4 me-2 text-green-500" />
                          <span class="font-medium">تعداد جلسات:</span>
                          <span class="ms-1">{{ milestone.sessions }} جلسه</span>
                        </div>
                      </div>
                      
                      <!-- Instructor/Therapist -->
                      <div v-if="milestone.instructor || milestone.therapist" class="space-y-2">
                        <div v-if="milestone.instructor" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:user" class="w-4 h-4 me-2 text-purple-500" />
                          <span class="font-medium">مدرس:</span>
                          <span class="ms-1 text-blue-600">{{ milestone.instructor }}</span>
                        </div>
                        
                        <div v-if="milestone.therapist" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:user-circle-gear" class="w-4 h-4 me-2 text-purple-500" />
                          <span class="font-medium">مشاور:</span>
                          <span class="ms-1 text-purple-600">{{ milestone.therapist }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Next Session -->
                    <div v-if="milestone.nextSession" class="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div class="flex items-center text-sm text-orange-700 dark:text-orange-300">
                        <Icon name="ph:calendar" class="w-4 h-4 me-2" />
                        <span class="font-medium">جلسه بعدی:</span>
                        <span class="ms-1">{{ milestone.nextSession }}</span>
                      </div>
                    </div>
                    
                    <!-- Progress Bar for In-Progress Items -->
                    <div v-if="milestone.status === 'in_progress' && milestone.progress" class="mt-4">
                      <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-gray-600 dark:text-gray-400">پیشرفت فعالیت</span>
                        <span class="font-bold text-blue-600">{{ milestone.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${milestone.progress}%` }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Action Button -->
                    <div v-if="milestone.status !== 'locked'" class="mt-4">
                      <BaseButton
                        v-if="milestone.status === 'completed'"
                        size="sm"
                        class="bg-green-500 text-white hover:bg-green-600"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 me-2" />
                        <span>مشاهده نتایج</span>
                      </BaseButton>
                      
                      <BaseButton
                        v-else-if="milestone.status === 'in_progress'"
                        size="sm"
                        class="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Icon name="ph:play" class="w-4 h-4 me-2" />
                        <span>ادامه</span>
                      </BaseButton>
                      
                      <BaseButton
                        v-else
                        size="sm"
                        variant="outline"
                        class="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Icon name="ph:arrow-left" class="w-4 h-4 me-2" />
                        <span>شروع</span>
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedStage?.milestones?.filter(m => m.status === 'completed').length || 0 }} از {{ selectedStage?.milestones?.length || 0 }} فعالیت تکمیل شده
            </div>
            
            <div class="flex gap-3">
              <BaseButton
                @click="closeModal"
                variant="outline"
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <span>بستن</span>
              </BaseButton>
              
              <BaseButton
                v-if="selectedStage?.status !== 'upcoming'"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Icon name="ph:play" class="w-4 h-4 me-2" />
                <span>ادامه مرحله</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
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