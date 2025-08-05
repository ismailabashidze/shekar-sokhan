<script setup lang="ts">
definePageMeta({
  title: 'نتایج آزمون شخصیت NEO',
  preview: {
    title: 'NEO Personality Test Results',
    description: 'Detailed personality analysis results',
    categories: ['results'],
    src: '/img/screens/neo-results-hammasir.png',
    srcDark: '/img/screens/neo-results-hammasir-dark.png',
    order: 3,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Mock NEO test results data
const testInfo = {
  name: 'آزمون شخصیت NEO',
  completedAt: '1403/03/15',
  duration: '28 دقیقه',
  totalQuestions: 60,
  overallScore: 78,
  reliability: 96
}

const personalityFactors = [
  {
    id: 'extraversion',
    name: 'برون‌گرایی',
    englishName: 'Extraversion',
    score: 72,
    percentile: 68,
    level: 'بالا',
    color: 'blue',
    icon: 'ph:users',
    description: 'تمایل به جامعه‌پذیری، فعالیت و انرژی مثبت',
    interpretation: 'شما فردی اجتماعی و پرانرژی هستید که از تعامل با دیگران لذت می‌برید.',
    traits: [
      { name: 'گرمی', score: 75, description: 'روابط صمیمانه و دوستانه' },
      { name: 'اجتماعی بودن', score: 82, description: 'تمایل به حضور در جمع' },
      { name: 'جسارت', score: 68, description: 'اعتماد به نفس در موقعیت‌های جدید' },
      { name: 'فعالیت', score: 79, description: 'انرژی و نشاط بالا' },
      { name: 'هیجان‌طلبی', score: 65, description: 'تمایل به تجربیات هیجان‌انگیز' },
      { name: 'احساسات مثبت', score: 77, description: 'تجربه مکرر احساسات خوشایند' }
    ],
    recommendations: [
      'در موقعیت‌های اجتماعی و تیمی عملکرد بهتری دارید',
      'شغل‌هایی که نیاز به تعامل با مردم دارند مناسب شماست',
      'در ازدواج، همسری که اجتماعی باشد بهتر با شما جور درمی‌آید'
    ]
  },
  {
    id: 'agreeableness',
    name: 'توافق‌پذیری',
    englishName: 'Agreeableness',
    score: 83,
    percentile: 85,
    level: 'بالا',
    color: 'green',
    icon: 'ph:heart',
    description: 'تمایل به همکاری، اعتماد و همدلی با دیگران',
    interpretation: 'شما فردی مهربان، قابل اعتماد و همکار هستید که به راحتی با دیگران ارتباط برقرار می‌کنید.',
    traits: [
      { name: 'اعتماد', score: 79, description: 'باور به خوبی دیگران' },
      { name: 'صداقت', score: 88, description: 'رفتار صادقانه و مستقیم' },
      { name: 'نوع‌دوستی', score: 85, description: 'تمایل به کمک به دیگران' },
      { name: 'تواضع', score: 80, description: 'فروتنی و عدم تکبر' },
      { name: 'نرم‌خویی', score: 82, description: 'مدارا و بردباری در تعاملات' },
      { name: 'همدلی', score: 87, description: 'درک احساسات دیگران' }
    ],
    recommendations: [
      'در روابط زناشویی قابلیت سازگاری بالایی دارید',
      'مناسب برای مشاغل خدماتی و انسان‌دوستانه',
      'ممکن است گاهی نیاز به قاطعیت بیشتر داشته باشید'
    ]
  },
  {
    id: 'conscientiousness',
    name: 'وظیفه‌شناسی',
    englishName: 'Conscientiousness',
    score: 69,
    percentile: 62,
    level: 'متوسط به بالا',
    color: 'purple',
    icon: 'ph:target',
    description: 'تمایل به نظم، مسئولیت‌پذیری و خودانضباطی',
    interpretation: 'شما فردی منظم و مسئول هستید که به تعهدات خود پایبند می‌مانید.',
    traits: [
      { name: 'شایستگی', score: 73, description: 'احساس کفایت و توانایی' },
      { name: 'نظم', score: 65, description: 'ترتیب و سازماندهی' },
      { name: 'وظیفه‌شناسی', score: 78, description: 'پایبندی به تعهدات' },
      { name: 'تلاش برای موفقیت', score: 71, description: 'انگیزه برای دستیابی به اهداف' },
      { name: 'خودانضباطی', score: 64, description: 'کنترل رفتار و تکانه‌ها' },
      { name: 'تأمل', score: 63, description: 'تفکر قبل از عمل' }
    ],
    recommendations: [
      'در برنامه‌ریزی زندگی مشترک توانایی خوبی دارید',
      'مناسب برای مسئولیت‌های مهم و پیچیده',
      'گاهی انعطاف بیشتری در برنامه‌ها در نظر بگیرید'
    ]
  },
  {
    id: 'neuroticism',
    name: 'ثبات عاطفی',
    englishName: 'Emotional Stability',
    score: 58,
    percentile: 45,
    level: 'متوسط',
    color: 'yellow',
    icon: 'ph:scales',
    description: 'توانایی کنترل احساسات منفی و مدیریت استرس',
    interpretation: 'شما ثبات عاطفی متوسطی دارید و در اکثر موقعیت‌ها می‌توانید احساساتتان را کنترل کنید.',
    traits: [
      { name: 'اضطراب', score: 52, description: 'میزان نگرانی و تنش' },
      { name: 'خشم', score: 48, description: 'تمایل به عصبانیت' },
      { name: 'افسردگی', score: 45, description: 'احساسات غمگینی' },
      { name: 'خودآگاهی', score: 62, description: 'حساسیت به قضاوت دیگران' },
      { name: 'تکانشگری', score: 55, description: 'کنترل تکانه‌ها' },
      { name: 'آسیب‌پذیری', score: 51, description: 'واکنش به استرس' }
    ],
    recommendations: [
      'تکنیک‌های مدیریت استرس را تمرین کنید',
      'در روابط، ارتباط باز و صادقانه برقرار کنید',
      'برای بهبود ثبات عاطفی، ورزش منظم و مدیتیشن مفید است'
    ]
  },
  {
    id: 'openness',
    name: 'گشودگی به تجربه',
    englishName: 'Openness to Experience',
    score: 76,
    percentile: 74,
    level: 'بالا',
    color: 'indigo',
    icon: 'ph:lightbulb',
    description: 'تمایل به تجربیات جدید، خلاقیت و کنجکاوی',
    interpretation: 'شما فردی خلاق و کنجکاو هستید که از یادگیری و تجربیات جدید لذت می‌برید.',
    traits: [
      { name: 'تخیل', score: 81, description: 'قدرت تجسم و خیال‌پردازی' },
      { name: 'زیبایی‌شناسی', score: 73, description: 'حساسیت به هنر و زیبایی' },
      { name: 'احساسات', score: 79, description: 'عمق و تنوع احساسی' },
      { name: 'اعمال', score: 68, description: 'تمایل به تجربه فعالیت‌های جدید' },
      { name: 'ایده‌ها', score: 82, description: 'علاقه به مفاهیم انتزاعی' },
      { name: 'ارزش‌ها', score: 71, description: 'بازنگری در باورها و ارزش‌ها' }
    ],
    recommendations: [
      'در ازدواج، همسری که از تغییر و تنوع استقبال کند مناسب شماست',
      'مشاغل خلاقانه و نوآورانه برای شما مناسب‌تر است',
      'از فرصت‌های یادگیری و رشد شخصی استفاده کنید'
    ]
  }
]

const compatibilityInsights = [
  {
    title: 'سازگاری در ازدواج',
    score: 82,
    description: 'بر اساس ویژگی‌های شخصیتی شما، احتمال سازگاری بالایی در روابط طولانی‌مدت دارید.',
    factors: [
      'برون‌گرایی بالا: تمایل به ارتباطات اجتماعی',
      'توافق‌پذیری بالا: سازگاری و همکاری در روابط',
      'گشودگی بالا: انعطاف‌پذیری در مواجهه با تغییرات'
    ]
  },
  {
    title: 'نقاط قوت در روابط',
    items: [
      'توانایی برقراری ارتباط مؤثر',
      'همدلی و درک احساسات همسر',
      'انعطاف‌پذیری در حل مشکلات',
      'تمایل به فعالیت‌های مشترک'
    ]
  },
  {
    title: 'نکات قابل توجه',
    items: [
      'ممکن است در موقعیت‌های پراسترس حساسیت بیشتری نشان دهید',
      'نیاز به تعادل بین فعالیت‌های اجتماعی و آرامش خانگی',
      'اهمیت یافتن همسری با سطح انرژی مشابه'
    ]
  }
]

const developmentAreas = [
  {
    area: 'مدیریت استرس',
    priority: 'بالا',
    description: 'تقویت مهارت‌های مقابله با استرس و اضطراب',
    suggestions: [
      'تمرین تکنیک‌های تنفس عمیق',
      'ورزش منظم و فعالیت بدنی',
      'مدیتیشن و ذهن‌آگاهی',
      'برنامه‌ریزی بهتر برای کاهش استرس'
    ]
  },
  {
    area: 'تقویت خودانضباطی',
    priority: 'متوسط',
    description: 'بهبود مهارت‌های سازماندهی و خودکنترلی',
    suggestions: [
      'تنظیم اهداف کوتاه‌مدت و قابل دستیابی',
      'استفاده از ابزارهای برنامه‌ریزی',
      'ایجاد عادات مثبت روزانه',
      'تمرین تأخیر در ارضای نیازها'
    ]
  }
]

const careerRecommendations = [
  {
    category: 'مشاغل مناسب',
    jobs: [
      'مشاور ازدواج و خانواده',
      'روان‌شناس بالینی',
      'مربی و معلم',
      'منابع انسانی',
      'فروش و بازاریابی',
      'روزنامه‌نگار',
      'طراح گرافیک'
    ]
  },
  {
    category: 'محیط کار ایده‌آل',
    features: [
      'فضای کاری اجتماعی و تیمی',
      'امکان خلاقیت و نوآوری',
      'تعامل مستقیم با مردم',
      'برنامه‌های آموزشی و توسعه',
      'انعطاف در ساعات کاری'
    ]
  }
]

function getScoreColor(score: number) {
  if (score >= 75) return 'green'
  if (score >= 60) return 'blue'
  if (score >= 40) return 'yellow'
  return 'red'
}

function getScoreLevel(score: number) {
  if (score >= 80) return 'خیلی بالا'
  if (score >= 70) return 'بالا'
  if (score >= 60) return 'متوسط به بالا'
  if (score >= 40) return 'متوسط'
  if (score >= 30) return 'متوسط به پایین'
  return 'پایین'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-1 shadow-2xl shadow-blue-500/25 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Floating decorative elements -->
        <div class="absolute top-6 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-8 left-12 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative flex items-center justify-between">
          <div>
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center me-4 shadow-xl">
                <Icon name="ph:user-circle" class="w-8 h-8 text-white" />
              </div>
              <div>
                <BaseHeading as="h1" size="3xl" weight="bold" class="text-white drop-shadow-lg">
                  <span>{{ testInfo.name }}</span>
                </BaseHeading>
                <BaseParagraph class="text-white/80">
                  <span>نتایج تحلیل شخصیت پنج عاملی</span>
                </BaseParagraph>
              </div>
            </div>
            
            <div class="flex items-center gap-6 text-white/90">
              <div class="flex items-center">
                <Icon name="ph:calendar" class="w-4 h-4 me-2" />
                <span>تکمیل شده: {{ testInfo.completedAt }}</span>
              </div>
              <div class="flex items-center">
                <Icon name="ph:clock" class="w-4 h-4 me-2" />
                <span>مدت زمان: {{ testInfo.duration }}</span>
              </div>
              <div class="flex items-center">
                <Icon name="ph:list" class="w-4 h-4 me-2" />
                <span>{{ testInfo.totalQuestions }} سوال</span>
              </div>
            </div>
          </div>
          
          <!-- Overall Score -->
          <div class="text-center">
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <BaseParagraph class="text-white/80 mb-2">
                <span>امتیاز کلی</span>
              </BaseParagraph>
              <div class="text-4xl font-bold text-white mb-2">{{ testInfo.overallScore }}</div>
              <div class="w-16 h-2 bg-white/20 rounded-full mx-auto mb-2">
                <div 
                  class="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                  :style="{ width: `${testInfo.overallScore}%` }"
                ></div>
              </div>
              <BaseParagraph class="text-white/70 text-xs">
                <span>قابلیت اطمینان: {{ testInfo.reliability }}%</span>
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personality Factors -->
    <div class="space-y-8 mb-12">
      <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-8">
        <span>عوامل شخصیت پنج‌گانه</span>
      </BaseHeading>
      
      <div 
        v-for="factor in personalityFactors" 
        :key="factor.id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <!-- Factor Header -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center">
            <div 
              class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg me-4"
              :class="`bg-gradient-to-br from-${factor.color}-400 to-${factor.color}-600 text-white`"
            >
              <Icon :name="factor.icon" class="w-8 h-8" />
            </div>
            <div>
              <BaseHeading as="h3" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                <span>{{ factor.name }}</span>
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
                <span>{{ factor.englishName }}</span>
              </BaseParagraph>
            </div>
          </div>
          
          <!-- Score Display -->
          <div class="text-left">
            <div class="flex items-center gap-4 mb-2">
              <div class="text-3xl font-bold" :class="`text-${getScoreColor(factor.score)}-600`">
                {{ factor.score }}
              </div>
              <div 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="`bg-${getScoreColor(factor.score)}-100 text-${getScoreColor(factor.score)}-700`"
              >
                {{ factor.level }}
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>رتبه صدکی: {{ factor.percentile }}%</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              :class="`bg-gradient-to-r from-${factor.color}-400 to-${factor.color}-600`"
              :style="{ width: `${factor.score}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3">
              <span>توصیف</span>
            </BaseHeading>
            <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              <span>{{ factor.description }}</span>
            </BaseParagraph>
            
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <BaseParagraph class="text-blue-800 dark:text-blue-200 font-medium">
                <span>{{ factor.interpretation }}</span>
              </BaseParagraph>
            </div>
          </div>
          
          <div>
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3">
              <span>ویژگی‌های فرعی</span>
            </BaseHeading>
            <div class="space-y-3">
              <div 
                v-for="trait in factor.traits" 
                :key="trait.name"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div class="flex-1">
                  <div class="font-medium text-gray-800 dark:text-white text-sm">{{ trait.name }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">{{ trait.description }}</div>
                </div>
                <div class="flex items-center gap-2 ms-4">
                  <div class="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div 
                      class="h-2 rounded-full transition-all duration-500"
                      :class="`bg-gradient-to-r from-${getScoreColor(trait.score)}-400 to-${getScoreColor(trait.score)}-600`"
                      :style="{ width: `${trait.score}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium w-8" :class="`text-${getScoreColor(trait.score)}-600`">
                    {{ trait.score }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-3">
            <span>توصیه‌ها</span>
          </BaseHeading>
          <div class="grid md:grid-cols-3 gap-4">
            <div 
              v-for="recommendation in factor.recommendations" 
              :key="recommendation"
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
            >
              <div class="flex items-start">
                <Icon name="ph:lightbulb" class="w-4 h-4 text-green-600 me-2 mt-0.5 flex-shrink-0" />
                <span class="text-sm text-green-800 dark:text-green-200">{{ recommendation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compatibility Insights -->
    <div class="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-8 border border-pink-200/50 dark:border-pink-800/50 mb-8">
      <BaseHeading as="h2" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-6 flex items-center">
        <Icon name="ph:heart" class="w-6 h-6 me-3 text-pink-600" />
        <span>بینش‌های سازگاری در ازدواج</span>
      </BaseHeading>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div 
          v-for="insight in compatibilityInsights" 
          :key="insight.title"
          class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-3">
            <span>{{ insight.title }}</span>
          </BaseHeading>
          
          <div v-if="insight.score" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">امتیاز سازگاری</span>
              <span class="font-bold text-pink-600 text-lg">{{ insight.score }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-700"
                :style="{ width: `${insight.score}%` }"
              ></div>
            </div>
          </div>
          
          <BaseParagraph v-if="insight.description" class="text-gray-600 dark:text-gray-400 mb-4">
            <span>{{ insight.description }}</span>
          </BaseParagraph>
          
          <div v-if="insight.factors" class="space-y-2">
            <div 
              v-for="factor in insight.factors" 
              :key="factor"
              class="flex items-center text-sm text-gray-700 dark:text-gray-300"
            >
              <Icon name="ph:check" class="w-4 h-4 text-green-500 me-2" />
              <span>{{ factor }}</span>
            </div>
          </div>
          
          <div v-if="insight.items" class="space-y-2">
            <div 
              v-for="item in insight.items" 
              :key="item"
              class="flex items-center text-sm text-gray-700 dark:text-gray-300"
            >
              <Icon name="ph:star" class="w-4 h-4 text-yellow-500 me-2" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Development Areas -->
    <div class="grid md:grid-cols-2 gap-8 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <BaseHeading as="h2" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon name="ph:trend-up" class="w-5 h-5 me-3 text-blue-600" />
          <span>حوزه‌های قابل توسعه</span>
        </BaseHeading>
        
        <div class="space-y-6">
          <div 
            v-for="area in developmentAreas" 
            :key="area.area"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                <span>{{ area.area }}</span>
              </BaseHeading>
              <div 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="area.priority === 'بالا' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
              >
                اولویت {{ area.priority }}
              </div>
            </div>
            
            <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              <span>{{ area.description }}</span>
            </BaseParagraph>
            
            <div class="space-y-2">
              <div 
                v-for="suggestion in area.suggestions" 
                :key="suggestion"
                class="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <Icon name="ph:arrow-left" class="w-3 h-3 text-blue-500 me-2" />
                <span>{{ suggestion }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Career Recommendations -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <BaseHeading as="h2" size="xl" weight="bold" class="text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon name="ph:briefcase" class="w-5 h-5 me-3 text-green-600" />
          <span>توصیه‌های شغلی</span>
        </BaseHeading>
        
        <div class="space-y-6">
          <div 
            v-for="category in careerRecommendations" 
            :key="category.category"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
              <span>{{ category.category }}</span>
            </BaseHeading>
            
            <div v-if="category.jobs" class="grid grid-cols-2 gap-2">
              <div 
                v-for="job in category.jobs" 
                :key="job"
                class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 text-center"
              >
                <span class="text-sm text-green-800 dark:text-green-200 font-medium">{{ job }}</span>
              </div>
            </div>
            
            <div v-if="category.features" class="space-y-2">
              <div 
                v-for="feature in category.features" 
                :key="feature"
                class="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <Icon name="ph:check" class="w-4 h-4 text-green-500 me-2" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 justify-center">
      <BaseButton
        @click="navigateTo('/hammasir/questionnaires')"
        variant="outline"
        class="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
        <span>بازگشت به پرسش‌نامه‌ها</span>
      </BaseButton>
      
      <BaseButton class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
        <Icon name="ph:download" class="w-4 h-4 me-2" />
        <span>دانلود گزارش PDF</span>
      </BaseButton>
      
      <BaseButton class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
        <Icon name="ph:share" class="w-4 h-4 me-2" />
        <span>اشتراک‌گذاری نتایج</span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>