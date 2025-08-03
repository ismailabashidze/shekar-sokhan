<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'سفر درمانی - شروع جلسه اول',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - شروع جلسه اول',
    description: 'شروع جلسه اول: بررسی شکایت اصلی و تحلیل علائم',
    categories: ['therapy', 'session', 'assessment'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 2,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - شروع جلسه اول | ذهنا',
  meta: [
    { name: 'description', content: 'آغاز جلسه اول درمان: تحلیل جامع شکایت اصلی، بررسی علائم و درک وضعیت بیمار' }
  ]
})

const router = useRouter()
const route = useRoute()
const isVisible = ref(false)
const currentStep = ref(0)
const isStarting = ref(false)

// اهداف ساده جلسه اول
const sessionFocus = ref({
  title: 'جلسه اول: آشنایی و درک مشکل شما',
  duration: '60 دقیقه',
  objectives: [
    {
      id: 'getting-to-know',
      title: 'آشنایی و ایجاد اعتماد',
      description: 'در این بخش با هم آشنا می‌شویم و محیط امنی برای صحبت ایجاد می‌کنیم',
      icon: 'ph:handshake',
      color: 'success',
      details: [
        'معرفی و آشنایی اولیه',
        'توضیح نحوه کار مشاوره',
        'ایجاد احساس راحتی و اعتماد'
      ]
    },
    {
      id: 'main-problem',
      title: 'درک مشکل اصلی شما',
      description: 'با هم در مورد آنچه شما را اینجا آورده صحبت خواهیم کرد',
      icon: 'ph:chat-circle-dots',
      color: 'primary',
      details: [
        'گوش دادن به داستان شما',
        'درک چالش‌های فعلی',
        'شناسایی مهم‌ترین مشکل'
      ]
    },
    {
      id: 'daily-impact',
      title: 'تأثیر بر زندگی روزانه',
      description: 'بررسی اینکه مشکل چگونه بر زندگی شما تأثیر گذاشته است',
      icon: 'ph:house',
      color: 'warning',
      details: [
        'تأثیر بر کار و تحصیل',
        'تأثیر بر روابط خانوادگی',
        'تأثیر بر احساسات و خلق'
      ]
    },
    {
      id: 'initial-plan',
      title: 'برنامه‌ریزی اولیه',
      description: 'شروع طراحی برنامه برای جلسات بعدی',
      icon: 'ph:calendar',
      color: 'info',
      details: [
        'تعیین اهداف کلی',
        'برنامه‌ریزی جلسات آینده',
        'پاسخ به سؤالات شما'
      ]
    }
  ]
})

// روش‌های ساده ارزیابی
const assessmentTools = ref([
  {
    name: 'گفتگوی صمیمانه',
    description: 'صحبت راحت و آزاد در مورد احساسات و مشکلات شما',
    icon: 'ph:chat-circle-dots',
    duration: '30 دقیقه'
  },
  {
    name: 'پرسش‌های ساده',
    description: 'چند سؤال مهم برای درک بهتر وضعیت شما',
    icon: 'ph:clipboard-text',
    duration: '15 دقیقه'
  },
  {
    name: 'بررسی احساسات',
    description: 'شناسایی احساسات و عکس‌العمل‌های شما',
    icon: 'ph:heart',
    duration: '15 دقیقه'
  }
])

// آماده‌سازی ذهنی
const psychologicalPreparation = ref([
  {
    title: 'محیط امن و دوستانه',
    description: 'فضایی راحت و بدون قضاوت برای صحبت کردن',
    icon: 'ph:shield-check',
    details: [
      'احترام به شما و نظراتتان',
      'محرمانه بودن تمام صحبت‌ها',
      'آزادی کامل در بیان احساسات'
    ]
  },
  {
    title: 'همکاری و مشارکت',
    description: 'کار کردن با هم برای حل مشکل',
    icon: 'ph:handshake',
    details: [
      'شما در مرکز فرآیند هستید',
      'نظرات شما مهم است',
      'با هم تصمیم می‌گیریم'
    ]
  },
  {
    title: 'درک و آگاهی',
    description: 'کمک به شما برای درک بهتر وضعیت',
    icon: 'ph:lightbulb',
    details: [
      'عادی بودن مشکلات روانی',
      'همه گاهی نیاز به کمک دارند',
      'راه حل‌هایی وجود دارد'
    ]
  }
])

const expectations = ref([
  {
    title: 'احساس راحتی و امنیت',
    description: 'در اینجا می‌توانید بدون نگرانی صحبت کنید',
    icon: 'ph:shield-check'
  },
  {
    title: 'درک کامل مشکل شما',
    description: 'با دقت به حرف‌هایتان گوش خواهیم داد',
    icon: 'ph:ear'
  },
  {
    title: 'همکاری مؤثر',
    description: 'با هم برای بهبود وضعیت کار خواهیم کرد',
    icon: 'ph:handshake'
  },
  {
    title: 'برنامه مناسب',
    description: 'برنامه‌ای متناسب با نیازهای شما خواهیم داشت',
    icon: 'ph:calendar'
  }
])

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  // Progressive reveal
  const interval = setInterval(() => {
    if (currentStep.value < 3) {
      currentStep.value++
    } else {
      clearInterval(interval)
    }
  }, 1000)
})

const startSession = async () => {
  isStarting.value = true
  
  // Add loading effect
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Navigate to the actual session/chat
  router.push('/therapy-journey/chat?session=1&focus=chief-complaint')
}

const goBack = () => {
  router.push('/therapy-journey/result')
}
</script>

<template>
  <div class="dark:bg-gradient-to-br dark:from-muted-900 dark:to-muted-800 bg-gradient-to-br from-slate-50 to-white min-h-screen">
    <!-- Background particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-300/20 rounded-full animate-pulse"></div>
      <div class="absolute top-3/4 right-1/3 w-3 h-3 bg-success-300/20 rounded-full animate-pulse delay-500"></div>
      <div class="absolute top-1/2 right-1/4 w-1 h-1 bg-info-300/20 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-warning-300/20 rounded-full animate-pulse delay-700"></div>
    </div>

    <div class="relative flex flex-col px-6 py-8">
      <div class="relative mx-auto w-full max-w-6xl">
        <!-- Navigation Header -->
        <div 
          class="flex w-full items-center justify-between mb-8 transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 -translate-y-4': !isVisible }"
        >
          <button
            @click="goBack"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-all duration-300 hover:gap-3"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به نتایج ارزیابی</span>
          </button>
          <BaseThemeToggle />
        </div>

        <!-- Main Content -->
        <div 
          class="transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
        >
          <!-- Header -->
          <div class="text-center mb-12">
            <div class="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Icon name="ph:chat-circle-dots" class="size-12 text-indigo-600" />
            </div>
            <BaseHeading as="h1" size="4xl" weight="bold" class="mb-4">
              {{ sessionFocus.title }}
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 max-w-3xl mx-auto text-lg mb-4">
              این جلسه فرصتی است تا با هم آشنا شویم، مشکل شما را درک کنیم و قدم اول را برای بهبود بردارید. هدف ما ایجاد فضایی امن و راحت است که بتوانید آزادانه صحبت کنید.
            </BaseParagraph>
            <div class="flex items-center justify-center gap-2 text-muted-500">
              <Icon name="ph:clock" class="size-5" />
              <span class="font-medium">{{ sessionFocus.duration }}</span>
            </div>
          </div>

          <!-- Session Objectives -->
          <div class="mb-12">
            <BaseHeading as="h2" size="2xl" weight="bold" class="text-center mb-8">
              اهداف جلسه اول
            </BaseHeading>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                v-for="(objective, index) in sessionFocus.objectives"
                :key="objective.id"
                class="transition-all duration-800 transform"
                :class="{ 
                  'opacity-100 translate-y-0': currentStep >= index, 
                  'opacity-0 translate-y-8': currentStep < index 
                }"
              >
                <div :class="`bg-gradient-to-br from-${objective.color}-50 to-${objective.color}-100 dark:from-${objective.color}-900/15 dark:to-${objective.color}-800/10 rounded-2xl p-6 h-full border border-${objective.color}-200/60 dark:border-${objective.color}-700/40 shadow-lg hover:shadow-xl transition-shadow duration-300`">
                  <div class="flex items-start gap-4 mb-4">
                    <div :class="`w-12 h-12 bg-${objective.color}-500/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`">
                      <Icon :name="objective.icon" :class="`size-6 text-${objective.color}-600`" />
                    </div>
                    <div class="flex-1">
                      <BaseHeading as="h3" size="lg" weight="bold" :class="`text-${objective.color}-800 dark:text-${objective.color}-200 mb-2`">
                        {{ objective.title }}
                      </BaseHeading>
                      <BaseParagraph class="text-slate-700 dark:text-slate-300 text-sm mb-4">
                        {{ objective.description }}
                      </BaseParagraph>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <div 
                      v-for="detail in objective.details"
                      :key="detail"
                      class="flex items-center gap-2"
                    >
                      <Icon name="ph:check-circle" :class="`size-4 text-${objective.color}-600`" />
                      <span class="text-sm text-slate-700 dark:text-slate-300">{{ detail }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- روش‌های کار -->
          <div class="mb-12">
            <BaseHeading as="h2" size="2xl" weight="bold" class="text-center mb-8">
              چگونه کار می‌کنیم
            </BaseHeading>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="(tool, index) in assessmentTools"
                :key="tool.name"
                class="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-800 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-600/40 text-center hover:shadow-xl transition-all duration-300 shadow-md"
              >
                <div class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-800/40 dark:to-blue-800/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Icon :name="tool.icon" class="size-8 text-indigo-600" />
                </div>
                <BaseHeading as="h3" size="lg" weight="bold" class="text-slate-800 dark:text-slate-200 mb-2">
                  {{ tool.name }}
                </BaseHeading>
                <BaseParagraph class="text-slate-600 dark:text-slate-300 text-sm mb-3">
                  {{ tool.description }}
                </BaseParagraph>
                <div class="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Icon name="ph:timer" class="size-4 text-indigo-500" />
                  <span>{{ tool.duration }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- What to Expect -->
          <div class="mb-12">
            <BaseHeading as="h2" size="2xl" weight="bold" class="text-center mb-8">
              در این جلسه چه انتظاری داشته باشید
            </BaseHeading>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="expectation in expectations"
                :key="expectation.title"
                class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/15 dark:to-teal-900/15 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon :name="expectation.icon" class="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="base" weight="bold" class="text-emerald-800 dark:text-emerald-200 mb-2">
                      {{ expectation.title }}
                    </BaseHeading>
                    <BaseParagraph class="text-slate-700 dark:text-slate-300 text-sm">
                      {{ expectation.description }}
                    </BaseParagraph>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- آماده‌سازی ذهنی -->
          <div class="mb-12">
            <BaseHeading as="h2" size="2xl" weight="bold" class="text-center mb-8">
              آماده‌سازی قبل از جلسه
            </BaseHeading>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div 
                v-for="prep in psychologicalPreparation"
                :key="prep.title"
                class="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/15 dark:to-blue-900/15 rounded-xl p-6 border border-sky-200/50 dark:border-sky-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-4">
                  <div class="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon :name="prep.icon" class="size-6 text-sky-600" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="base" weight="bold" class="text-sky-800 dark:text-sky-200 mb-2">
                      {{ prep.title }}
                    </BaseHeading>
                    <BaseParagraph class="text-slate-700 dark:text-slate-300 text-sm mb-3">
                      {{ prep.description }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="detail in prep.details"
                    :key="detail"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:check-circle" class="size-4 text-sky-600 mt-0.5" />
                    <span class="text-xs text-slate-700 dark:text-slate-300">{{ detail }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- نکات مهم -->
          <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-12 border border-indigo-200/30 dark:border-indigo-700/30">
            <div class="w-full">
              <BaseHeading as="h3" size="xl" weight="bold" class="text-indigo-800 dark:text-indigo-200 mb-6 text-center flex items-center justify-center gap-3">
                <Icon name="ph:heart" class="size-8 text-pink-500" />
                نکات مهم برای جلسه
              </BaseHeading>
                <div class="space-y-8">
                  <!-- قبل از جلسه -->
                  <div class="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200/50 dark:border-cyan-700/30 shadow-sm">
                    <h4 class="font-bold text-cyan-800 dark:text-cyan-200 mb-4 text-lg flex items-center gap-2">
                      <Icon name="ph:clock-clockwise" class="size-6 text-cyan-600" />
                      قبل از جلسه
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-cyan-600" />
                        <span class="text-slate-700 dark:text-slate-300">در جایی آرام و بدون مزاحمت بنشینید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-cyan-600" />
                        <span class="text-slate-700 dark:text-slate-300">چند بار عمیق نفس بکشید و آرام شوید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-cyan-600" />
                        <span class="text-slate-700 dark:text-slate-300">وقت کافی برای خودتان در نظر بگیرید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-cyan-600" />
                        <span class="text-slate-700 dark:text-slate-300">یک لیوان آب یا نوشیدنی آماده کنید</span>
                      </p>
                      <p class="flex items-start gap-2 md:col-span-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-cyan-600" />
                        <span class="text-slate-700 dark:text-slate-300">اگر دستمال کاغذی نیاز داشته باشید آماده کنید</span>
                      </p>
                    </div>
                  </div>

                  <!-- حین جلسه -->
                  <div class="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm">
                    <h4 class="font-bold text-emerald-800 dark:text-emerald-200 mb-4 text-lg flex items-center gap-2">
                      <Icon name="ph:chat-dots" class="size-6 text-emerald-600" />
                      حین جلسه
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-emerald-600" />
                        <span class="text-slate-700 dark:text-slate-300">صادقانه و راحت صحبت کنید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-emerald-600" />
                        <span class="text-slate-700 dark:text-slate-300">اگر احساس ناراحتی کردید حتماً بگویید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-emerald-600" />
                        <span class="text-slate-700 dark:text-slate-300">هروقت لازم باشد می‌توانید استراحت کنید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-emerald-600" />
                        <span class="text-slate-700 dark:text-slate-300">سؤال‌هایتان را بپرسید</span>
                      </p>
                      <p class="flex items-start gap-2 md:col-span-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-emerald-600" />
                        <span class="text-slate-700 dark:text-slate-300">نگران قضاوت نباشید - اینجا جای امن است</span>
                      </p>
                    </div>
                  </div>

                  <!-- بعد از جلسه -->
                  <div class="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200/50 dark:border-violet-700/30 shadow-sm">
                    <h4 class="font-bold text-violet-800 dark:text-violet-200 mb-4 text-lg flex items-center gap-2">
                      <Icon name="ph:heart" class="size-6 text-violet-600" />
                      بعد از جلسه
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-violet-600" />
                        <span class="text-slate-700 dark:text-slate-300">کمی وقت برای خودتان بگذارید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-violet-600" />
                        <span class="text-slate-700 dark:text-slate-300">نکات مهم را یادداشت کنید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-violet-600" />
                        <span class="text-slate-700 dark:text-slate-300">با خودتان مهربان باشید</span>
                      </p>
                      <p class="flex items-start gap-2">
                        <Icon name="ph:check-circle" class="size-5 mt-0.5 text-violet-600" />
                        <span class="text-slate-700 dark:text-slate-300">فعالیت آرام‌بخشی انجام دهید</span>
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-6">
            <BaseButton
              @click="goBack"
              variant="pastel"
              color="muted"
              size="lg"
              class="px-8"
            >
              <Icon name="ph:arrow-right" class="size-5 ml-2" />
              بازگشت
            </BaseButton>
            
            <BaseButton
              @click="startSession"
              :loading="isStarting"
              :disabled="isStarting"
              color="primary"
              size="lg"
              class="px-12 relative overflow-hidden group"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Icon name="ph:play" class="size-5 ml-2" />
              <span>{{ isStarting ? 'در حال آماده‌سازی جلسه...' : 'شروع جلسه اول' }}</span>
            </BaseButton>
          </div>

          <!-- Time Estimate and Final Notes -->
          <div class="text-center mt-8">
            <div class="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-muted-800 dark:to-muted-700 rounded-xl p-6 mb-6">
              <Icon name="ph:clock-clockwise" class="size-12 text-primary-500 mx-auto mb-3" />
              <BaseHeading as="h3" size="lg" weight="bold" class="text-muted-700 dark:text-muted-200 mb-2">
                زمان‌بندی جلسه
              </BaseHeading>
              <div class="flex items-center justify-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-4">
                <Icon name="ph:timer" class="size-4" />
                <span>این جلسه حدود 60 دقیقه طول خواهد کشید</span>
              </div>
              <BaseParagraph class="text-sm text-muted-500 dark:text-muted-400">
                زمان بر اساس شرایط و نیاز هر فرد متفاوت است
              </BaseParagraph>
            </div>
            
            <div class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl p-6 border border-emerald-200/40 dark:border-emerald-700/20">
              <Icon name="ph:heart-straight" class="size-8 text-emerald-500 mx-auto mb-3" />
              <BaseHeading as="h3" size="base" weight="bold" class="text-emerald-700 dark:text-emerald-300 mb-3">
                یادآوری مهم: شما قهرمان زندگی خودتان هستید
              </BaseHeading>
              <BaseParagraph class="text-sm text-emerald-600 dark:text-emerald-400">
                اینکه برای کمک اینجا آمده‌اید نشان از قدرت و جرأت شما دارد. بهتر شدن کار زمان است و ما با هم این مسیر را طی خواهیم کرد.
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>