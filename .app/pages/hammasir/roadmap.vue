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
  lastActivity: '1403/04/12',
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
        points: 30,
      },
      {
        id: 2,
        title: 'آزمون شخصیت NEO',
        description: 'شناسایی پنج عامل اصلی شخصیت',
        status: 'completed',
        type: 'test',
        link: '/hammasir/neo-test',
        duration: '30 دقیقه',
        points: 25,
      },
      {
        id: 3,
        title: 'آزمون سبک‌های دلبستگی',
        description: 'درک الگوهای رفتاری در روابط',
        status: 'completed',
        type: 'test',
        duration: '20 دقیقه',
        points: 20,
      },
      {
        id: 4,
        title: 'آزمون ارزش‌های زندگی',
        description: 'تعیین اولویت‌ها و اهداف مهم',
        status: 'completed',
        type: 'test',
        duration: '15 دقیقه',
        points: 15,
      },
      {
        id: 5,
        title: 'جلسه مشاوره فردی',
        description: 'تحلیل نتایج آزمون‌ها با روان‌شناس',
        status: 'completed',
        type: 'therapy',
        duration: '60 دقیقه',
        therapist: 'دکتر مریم احمدی',
        points: 35,
      },
      {
        id: 6,
        title: 'گزارش جامع خودشناسی',
        description: 'دریافت گزارش کامل شخصیت و توصیه‌ها',
        status: 'completed',
        type: 'report',
        points: 25,
      },
    ],
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
        points: 35,
      },
      {
        id: 8,
        title: 'آزمون هوش هیجانی Cattell',
        description: 'ارزیابی سطح هوش عاطفی',
        status: 'completed',
        type: 'test',
        duration: '25 دقیقه',
        points: 20,
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
        points: 40,
      },
      {
        id: 10,
        title: 'ورکشاپ مدیریت تعارض',
        description: 'شبیه‌سازی موقعیت‌های تعارض و حل آن',
        status: 'locked',
        type: 'workshop',
        duration: '3 ساعت',
        sessions: 2,
        points: 30,
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
        points: 45,
      },
      {
        id: 12,
        title: 'آزمون آمادگی ارتباطی',
        description: 'ارزیابی نهایی مهارت‌های ارتباطی',
        status: 'locked',
        type: 'test',
        duration: '30 دقیقه',
        points: 25,
      },
    ],
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
        points: 30,
      },
      {
        id: 14,
        title: 'ورکشاپ سرمایه‌گذاری مشترک',
        description: 'انواع سرمایه‌گذاری امن برای زوج‌ها',
        status: 'locked',
        type: 'workshop',
        duration: '4 ساعت',
        sessions: 1,
        points: 25,
      },
      {
        id: 15,
        title: 'مشاوره مالی فردی',
        description: 'جلسه تحلیل وضعیت مالی شخصی',
        status: 'locked',
        type: 'therapy',
        duration: '45 دقیقه',
        therapist: 'مشاور محمد کریمی',
        points: 20,
      },
      {
        id: 16,
        title: 'طرح کسب‌وکار خانوادگی',
        description: 'ایده‌پردازی برای درآمد مشترک',
        status: 'locked',
        type: 'project',
        duration: '2 هفته',
        points: 35,
      },
      {
        id: 17,
        title: 'گزارش برنامه مالی',
        description: 'تدوین برنامه مالی 5 ساله',
        status: 'locked',
        type: 'report',
        points: 25,
      },
    ],
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
        points: 30,
      },
      {
        id: 13,
        title: 'روابط با خانواده‌ها',
        description: 'مدیریت روابط با خویشاوندان',
        status: 'locked',
        type: 'workshop',
        points: 20,
      },
      {
        id: 14,
        title: 'مسئولیت‌های اجتماعی',
        description: 'نقش خانواده در جامعه',
        status: 'locked',
        type: 'course',
        points: 15,
      },
    ],
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
        points: 25,
      },
      {
        id: 16,
        title: 'سازگاری روانی',
        description: 'بررسی انطباق شخصیتی',
        status: 'locked',
        type: 'test',
        points: 30,
      },
      {
        id: 17,
        title: 'گزارش نهایی آمادگی',
        description: 'ارزیابی جامع آمادگی ازدواج',
        status: 'locked',
        type: 'report',
        points: 35,
      },
    ],
  },
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
  }
  else {
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
    <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-1 shadow-2xl shadow-indigo-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div class="relative rounded-2xl bg-gradient-to-br from-indigo-600/90 via-purple-700/90 to-pink-700/90 px-8 py-12 backdrop-blur-xl">
        <!-- Floating decorative elements -->
        <div class="absolute right-8 top-6 size-24 rounded-full bg-white/5 blur-2xl" />
        <div class="absolute bottom-8 left-12 size-32 rounded-full bg-pink-400/10 blur-3xl" />

        <div class="relative text-center">
          <div class="mb-6 inline-flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 shadow-xl">
            <Icon name="ph:map-trifold" class="size-10 text-white" />
          </div>

          <BaseHeading
            as="h1"
            size="4xl"
            weight="bold"
            lead="tight"
            class="mb-4 text-white drop-shadow-lg"
          >
            <span>نقشه راه ازدواج</span>
          </BaseHeading>

          <BaseParagraph class="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/90">
            <span>مسیر گام به گام آمادگی برای ازدواج. از خودشناسی تا آمادگی نهایی، همه مراحل ضروری را طی کنید.</span>
          </BaseParagraph>

          <!-- Overall Progress -->
          <div class="mx-auto max-w-md rounded-2xl border border-white/30 bg-white/20 p-6 backdrop-blur-sm">
            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm text-white/80">پیشرفت کلی</span>
              <span class="text-lg font-bold text-white">{{ overallProgress }}%</span>
            </div>
            <div class="h-3 w-full rounded-full bg-white/20">
              <div
                class="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                :style="{ width: `${overallProgress}%` }"
              />
            </div>
            <div class="mt-2 text-xs text-white/70">
              {{ userProgress.completedMilestones.length }} از {{ roadmapStages.reduce((sum, stage) => sum + stage.milestones.length, 0) }} فعالیت تکمیل شده
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Stage Highlight -->
    <div v-if="currentStage" class="mb-8 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="me-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg"
          >
            <Icon name="ph:heart" class="size-6" />
          </div>
          <div>
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-gray-800 dark:text-white"
            >
              <span>مرحله فعلی: {{ currentStage.title }}</span>
            </BaseHeading>
            <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
              <span>{{ currentStage.subtitle }}</span>
            </BaseParagraph>
          </div>
        </div>

        <div class="text-left">
          <div class="text-2xl font-bold text-blue-600">
            {{ currentStage.progress }}%
          </div>
          <div class="text-xs text-gray-500">
            تکمیل
          </div>
        </div>
      </div>

      <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          class="h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
          :style="{ width: `${currentStage.progress}%` }"
        />
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
          class="absolute left-8 top-20 z-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"
          :class="stage.status === 'completed' ? 'bg-green-400' : ''"
        />

        <!-- Stage Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800"
          @click="openStageModal(stage)"
        >
          <!-- Stage Header -->
          <div class="border-b border-gray-200 p-6 dark:border-gray-700">
            <div class="flex items-start justify-between">
              <div class="flex items-start">
                <!-- Stage Number & Icon -->
                <div class="relative me-4">
                  <div
                    class="relative z-10 flex size-16 items-center justify-center rounded-2xl shadow-lg"
                    :class="stage.status === 'completed'
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                      : stage.status === 'in_progress'
                        ? `bg-gradient-to-br from-${stage.color}-400 to-${stage.color}-600 text-white`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                  >
                    <Icon :name="stage.icon" class="size-8" />
                  </div>
                  <div class="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-xs font-bold dark:border-gray-700 dark:bg-gray-800">
                    {{ stage.id }}
                  </div>
                </div>

                <div class="flex-1">
                  <div class="mb-2 flex items-center gap-3">
                    <BaseHeading
                      as="h3"
                      size="xl"
                      weight="semibold"
                      class="text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                    >
                      <span>{{ stage.title }}</span>
                    </BaseHeading>

                    <!-- Status Badge -->
                    <div
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="stage.status === 'completed'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : stage.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'"
                    >
                      {{ stage.status === 'completed' ? 'تکمیل شده' : stage.status === 'in_progress' ? 'در حال انجام' : 'آینده' }}
                    </div>

                    <!-- Interactive Indicator -->
                    <div class="flex items-center gap-1 text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Icon name="ph:cursor-click" class="size-4" />
                      <span class="text-xs font-medium">کلیک کنید</span>
                    </div>
                  </div>

                  <BaseParagraph class="mb-3 text-gray-600 dark:text-gray-400">
                    <span>{{ stage.subtitle }}</span>
                  </BaseParagraph>

                  <BaseParagraph class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    <span>{{ stage.description }}</span>
                  </BaseParagraph>
                </div>
              </div>

              <!-- Stage Stats -->
              <div class="space-y-2 text-left">
                <div class="text-2xl font-bold" :class="`text-${getStageStatusColor(stage.status)}-600`">
                  {{ stage.progress }}%
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div class="flex items-center">
                    <Icon name="ph:clock" class="me-1 size-3" />
                    <span>{{ stage.duration }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:timer" class="me-1 size-3" />
                    <span>{{ stage.estimatedTime }}</span>
                  </div>
                  <div class="col-span-2 flex items-center">
                    <Icon name="ph:chart-line" class="me-1 size-3" />
                    <span
                      class="rounded px-1 py-0.5 text-xs"
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
              <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="stage.status === 'completed'
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : `bg-gradient-to-r from-${stage.color}-400 to-${stage.color}-600`"
                  :style="{ width: `${stage.progress}%` }"
                />
              </div>
            </div>

            <!-- Click Indicator -->
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Icon name="ph:cursor-click" class="me-2 size-4" />
                <span>کلیک کنید برای مشاهده جزئیات</span>
              </div>

              <BaseButton
                size="sm"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/40"
                @click.stop="openStageModal(stage)"
              >
                <Icon name="ph:eye" class="me-2 size-4" />
                <span>مشاهده جزئیات</span>
              </BaseButton>
            </div>
          </div>

          <!-- Milestones -->
          <div class="p-6">
            <BaseHeading
              as="h4"
              size="md"
              weight="semibold"
              class="mb-4 text-gray-800 dark:text-white"
            >
              <span>فعالیت‌های مرحله</span>
            </BaseHeading>

            <div class="grid gap-4 md:grid-cols-2">
              <div
                v-for="milestone in stage.milestones"
                :key="milestone.id"
                class="group rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700"
                :class="{
                  'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20': milestone.status === 'completed',
                  'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20': milestone.status === 'in_progress',
                  'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600': milestone.status !== 'locked',
                  'cursor-not-allowed opacity-60': milestone.status === 'locked'
                }"
                @click.stop="navigateToMilestone(milestone)"
              >
                <div class="mb-3 flex items-start justify-between">
                  <div class="flex items-center">
                    <div
                      class="me-3 flex size-8 items-center justify-center rounded-lg"
                      :class="milestone.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : milestone.status === 'in_progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'"
                    >
                      <Icon :name="getMilestoneStatusIcon(milestone.status)" class="size-4" />
                    </div>

                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {{ milestone.title }}
                      </div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">
                        {{ milestone.description }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <div
                      class="flex size-6 items-center justify-center rounded-lg"
                      :class="milestone.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : milestone.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'"
                    >
                      <Icon :name="getMilestoneTypeIcon(milestone.type)" class="size-3" />
                    </div>

                    <div class="text-center text-xs font-medium text-gray-500">
                      <div>+{{ milestone.points }}</div>
                      <div class="text-gray-400">
                        امتیاز
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Milestone Detail Button -->
                <div class="mt-3">
                  <BaseButton
                    size="sm"
                    class="w-full font-medium shadow-sm transition-all duration-300"
                    :class="{
                      'bg-green-500 text-white shadow-green-500/25 hover:bg-green-600': milestone.status === 'completed',
                      'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700': milestone.status === 'in_progress',
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/25 hover:from-gray-600 hover:to-gray-700': milestone.status !== 'completed' && milestone.status !== 'in_progress' && milestone.status !== 'locked',
                      'cursor-not-allowed bg-gray-300 text-gray-500': milestone.status === 'locked'
                    }"
                    :disabled="milestone.status === 'locked'"
                    @click.stop="navigateToMilestone(milestone)"
                  >
                    <Icon
                      :name="milestone.status === 'completed' ? 'ph:eye' : milestone.status === 'in_progress' ? 'ph:play' : milestone.status === 'locked' ? 'ph:lock' : 'ph:arrow-left'"
                      class="me-2 size-4"
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
        class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
        @click="navigateTo('/hammasir/questionnaires')"
      >
        <Icon name="ph:clipboard-text" class="me-2 size-4" />
        <span>مشاهده پرسش‌نامه‌ها</span>
      </BaseButton>
    </div>

    <!-- Stage Detail Modal -->
    <div
      v-if="isModalOpen && selectedStage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click="closeModal"
    >
      <div
        class="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-90"
            :class="getModalHeaderColor(selectedStage?.status)"
          />

          <div class="relative p-6 text-white">
            <div class="flex items-start justify-between">
              <div class="flex items-start">
                <div
                  class="me-4 flex size-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm"
                >
                  <Icon name="ph:heart" class="size-8" />
                </div>

                <div>
                  <BaseHeading
                    as="h2"
                    size="2xl"
                    weight="bold"
                    class="mb-2 text-white"
                  >
                    <span>{{ selectedStage?.title || 'مرحله' }}</span>
                  </BaseHeading>
                  <BaseParagraph class="mb-3 text-white/90">
                    <span>{{ selectedStage?.subtitle || 'توضیحات مرحله' }}</span>
                  </BaseParagraph>
                  <BaseParagraph class="text-sm leading-relaxed text-white/80">
                    <span>{{ selectedStage?.description || 'شرح کامل مرحله' }}</span>
                  </BaseParagraph>
                </div>
              </div>

              <button
                class="flex size-8 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
                @click="closeModal"
              >
                <Icon name="ph:x" class="size-5" />
              </button>
            </div>

            <!-- Stage Stats -->
            <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                <div class="text-2xl font-bold">
                  {{ selectedStage?.progress || 0 }}%
                </div>
                <div class="text-xs opacity-80">
                  پیشرفت
                </div>
              </div>

              <div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                <div class="text-lg font-bold">
                  {{ selectedStage?.milestones?.length || 0 }}
                </div>
                <div class="text-xs opacity-80">
                  فعالیت
                </div>
              </div>

              <div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                <div class="text-lg font-bold">
                  {{ selectedStage?.duration || '-' }}
                </div>
                <div class="text-xs opacity-80">
                  مدت زمان
                </div>
              </div>

              <div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                <div class="text-lg font-bold">
                  {{ selectedStage?.estimatedTime || '-' }}
                </div>
                <div class="text-xs opacity-80">
                  تخمین زمان
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-6">
              <div class="h-2 w-full rounded-full bg-white/20">
                <div
                  class="h-2 rounded-full bg-white transition-all duration-500"
                  :style="{ width: `${selectedStage?.progress || 0}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="max-h-96 overflow-y-auto p-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="mb-6 text-gray-800 dark:text-white"
          >
            <span>فعالیت‌های مرحله {{ selectedStage?.title || 'انتخاب شده' }}</span>
          </BaseHeading>

          <div class="space-y-4">
            <div
              v-for="milestone in (selectedStage?.milestones || [])"
              :key="milestone.id"
              class="group rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:shadow-lg dark:border-gray-700"
              :class="{
                'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20': milestone.status === 'completed',
                'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20': milestone.status === 'in_progress',
                'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600': milestone.status !== 'locked',
                'cursor-not-allowed opacity-60': milestone.status === 'locked'
              }"
              @click="navigateToMilestone(milestone)"
            >
              <div class="flex items-start justify-between">
                <div class="flex flex-1 items-start">
                  <!-- Status Icon -->
                  <div
                    class="me-4 flex size-10 shrink-0 items-center justify-center rounded-xl"
                    :class="milestone.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : milestone.status === 'in_progress'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'"
                  >
                    <Icon :name="getMilestoneStatusIcon(milestone.status)" class="size-5" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <!-- Title and Description -->
                    <div class="mb-3 flex items-start justify-between">
                      <div class="flex-1">
                        <BaseHeading
                          as="h4"
                          size="md"
                          weight="semibold"
                          class="mb-1 text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                        >
                          <span>{{ milestone.title }}</span>
                        </BaseHeading>
                        <BaseParagraph class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          <span>{{ milestone.description }}</span>
                        </BaseParagraph>
                      </div>

                      <!-- Type Icon and Points -->
                      <div class="ms-4 flex items-center gap-3">
                        <div
                          class="flex size-8 items-center justify-center rounded-lg"
                          :class="milestone.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : milestone.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500'"
                        >
                          <Icon :name="getMilestoneTypeIcon(milestone.type)" class="size-4" />
                        </div>

                        <div class="text-center">
                          <div class="text-sm font-bold text-gray-800 dark:text-white">
                            +{{ milestone.points }}
                          </div>
                          <div class="text-xs text-gray-500">
                            امتیاز
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Detailed Information -->
                    <div class="mt-4 grid gap-4 md:grid-cols-2">
                      <!-- Duration and Sessions -->
                      <div v-if="milestone.duration || milestone.sessions" class="space-y-2">
                        <div v-if="milestone.duration" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:clock" class="me-2 size-4 text-blue-500" />
                          <span class="font-medium">مدت زمان:</span>
                          <span class="ms-1">{{ milestone.duration }}</span>
                        </div>

                        <div v-if="milestone.sessions" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:list" class="me-2 size-4 text-green-500" />
                          <span class="font-medium">تعداد جلسات:</span>
                          <span class="ms-1">{{ milestone.sessions }} جلسه</span>
                        </div>
                      </div>

                      <!-- Instructor/Therapist -->
                      <div v-if="milestone.instructor || milestone.therapist" class="space-y-2">
                        <div v-if="milestone.instructor" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:user" class="me-2 size-4 text-purple-500" />
                          <span class="font-medium">مدرس:</span>
                          <span class="ms-1 text-blue-600">{{ milestone.instructor }}</span>
                        </div>

                        <div v-if="milestone.therapist" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Icon name="ph:user-circle-gear" class="me-2 size-4 text-purple-500" />
                          <span class="font-medium">مشاور:</span>
                          <span class="ms-1 text-purple-600">{{ milestone.therapist }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Next Session -->
                    <div v-if="milestone.nextSession" class="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                      <div class="flex items-center text-sm text-orange-700 dark:text-orange-300">
                        <Icon name="ph:calendar" class="me-2 size-4" />
                        <span class="font-medium">جلسه بعدی:</span>
                        <span class="ms-1">{{ milestone.nextSession }}</span>
                      </div>
                    </div>

                    <!-- Progress Bar for In-Progress Items -->
                    <div v-if="milestone.status === 'in_progress' && milestone.progress" class="mt-4">
                      <div class="mb-2 flex items-center justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">پیشرفت فعالیت</span>
                        <span class="font-bold text-blue-600">{{ milestone.progress }}%</span>
                      </div>
                      <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class="h-2 rounded-full bg-blue-500 transition-all duration-300"
                          :style="{ width: `${milestone.progress}%` }"
                        />
                      </div>
                    </div>

                    <!-- Action Button -->
                    <div v-if="milestone.status !== 'locked'" class="mt-4">
                      <BaseButton
                        v-if="milestone.status === 'completed'"
                        size="sm"
                        class="bg-green-500 text-white hover:bg-green-600"
                      >
                        <Icon name="ph:eye" class="me-2 size-4" />
                        <span>مشاهده نتایج</span>
                      </BaseButton>

                      <BaseButton
                        v-else-if="milestone.status === 'in_progress'"
                        size="sm"
                        class="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Icon name="ph:play" class="me-2 size-4" />
                        <span>ادامه</span>
                      </BaseButton>

                      <BaseButton
                        v-else
                        size="sm"
                        variant="outline"
                        class="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Icon name="ph:arrow-left" class="me-2 size-4" />
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
        <div class="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedStage?.milestones?.filter(m => m.status === 'completed').length || 0 }} از {{ selectedStage?.milestones?.length || 0 }} فعالیت تکمیل شده
            </div>

            <div class="flex gap-3">
              <BaseButton
                variant="outline"
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
                @click="closeModal"
              >
                <span>بستن</span>
              </BaseButton>

              <BaseButton
                v-if="selectedStage?.status !== 'upcoming'"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
              >
                <Icon name="ph:play" class="me-2 size-4" />
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
