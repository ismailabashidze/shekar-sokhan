<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'سفر درمانی - تعرفه‌ها',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - تعرفه‌ها',
    description: 'انتخاب بسته مناسب سفر درمانی با هوش مصنوعی',
    categories: ['therapy', 'pricing'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 3,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - تعرفه‌ها | ذهنا',
  meta: [
    { name: 'description', content: 'انتخاب بسته مناسب درمان با هوش مصنوعی. تعرفه‌های متنوع برای همه نیازها' }
  ]
})

const router = useRouter()
const isVisible = ref(false)
const selectedPlan = ref('premium')
const isProcessing = ref(false)

const plans = [
  {
    id: 'basic',
    name: 'بسته پایه',
    price: '699,000',
    originalPrice: '899,000',
    duration: '۱۰ روزه',
    popular: false,
    color: 'muted',
    description: 'مناسب برای آشنایی با سفر درمانی',
    features: [
      'دسترسی کامل به هوش مصنوعی درمانگر',
      'ارزیابی و تجزیه‌وتحلیل شخصیت',
      'برنامه‌های تمرینی شخصی‌سازی شده',
      'پشتیبانی ۲۴/۷',
      'گزارش‌های پیشرفت هفتگی',
      'دسترسی به کتابخانه منابع آموزشی'
    ],
    limitations: [
      'حداکثر ۱۰ جلسه گفتگو در ماه',
      'دسترسی به ۵ تمرین تخصصی'
    ]
  },
  {
    id: 'premium',
    name: 'بسته پیشرفته',
    price: '1,299,000',
    originalPrice: '1,799,000',
    duration: 'یک ماهه',
    popular: true,
    color: 'primary',
    description: 'بهترین انتخاب برای درمان جامع',
    features: [
      'تمام امکانات بسته پایه',
      'تجزیه‌وتحلیل عمیق احساسات',
      'برنامه‌های درمانی تخصصی (CBT, DBT)',
      'مشاوره اضطراری',
      'گزارش‌های پیشرفت روزانه',
      'ماژول‌های تخصصی (اضطراب، افسردگی، خواب)',
      'امکان مشاوره با متخصص انسانی (۲ جلسه)',
      'تمرین‌های مراقبه و آرام‌سازی'
    ],
    limitations: [
      'نامحدود گفتگو',
      'دسترسی کامل به تمرین‌ها'
    ]
  },
  {
    id: 'professional',
    name: 'بسته حرفه‌ای',
    price: '2,199,000',
    originalPrice: '2,999,000',
    duration: 'دو ماهه',
    popular: false,
    color: 'success',
    description: 'برای تغییرات عمیق و پایدار',
    features: [
      'تمام امکانات بسته پیشرفته',
      'برنامه درمانی کاملاً شخصی‌سازی شده',
      'نظارت و ارزیابی مداوم توسط متخصص',
      'مشاوره هفتگی با روان‌شناس (۸ جلسه)',
      'تحلیل پیشرفته الگوهای رفتاری',
      'برنامه پیشگیری از عود',
      'گروه‌های پشتیبانی آنلاین',
      'کیت ابزارهای خودمراقبتی'
    ],
    limitations: []
  }
]

const benefits = [
  {
    icon: 'ph:shield-check',
    title: 'محرمانگی کامل',
    description: 'همه اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود'
  },
  {
    icon: 'ph:clock',
    title: 'دسترسی ۲۴/۷',
    description: 'هر زمان که نیاز داشتید، هوش مصنوعی درمانگر در دسترس شماست'
  },
  {
    icon: 'ph:brain',
    title: 'مبتنی بر علم',
    description: 'استفاده از روش‌های درمانی مدرن و مبتنی بر شواهد علمی'
  },
  {
    icon: 'ph:heart',
    title: 'بدون قضاوت',
    description: 'محیطی امن و پذیرنده برای بیان احساسات و تجربیات شما'
  }
]

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const selectPlan = (planId: string) => {
  selectedPlan.value = planId
}

const proceedWithPlan = async () => {
  if (!selectedPlan.value) return
  
  isProcessing.value = true
  
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Navigate to payment or next step
  router.push(`/therapy-journey/payment?plan=${selectedPlan.value}`)
}
</script>

<template>
  <div class="dark:bg-gradient-to-br dark:from-muted-900 dark:to-muted-800 bg-gradient-to-br from-slate-50 to-white min-h-screen">
    <!-- Floating particles background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-300/20 rounded-full animate-pulse"></div>
      <div class="absolute top-3/4 right-1/3 w-3 h-3 bg-success-300/20 rounded-full animate-pulse delay-500"></div>
      <div class="absolute top-1/2 right-1/4 w-1 h-1 bg-info-300/20 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-300/20 rounded-full animate-pulse delay-700"></div>
    </div>

    <div class="relative flex flex-col justify-center px-6 py-12">
      <div class="relative mx-auto w-full max-w-7xl">
        <!--Nav-->
        <div 
          class="flex w-full items-center justify-between mb-12 transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 -translate-y-4': !isVisible }"
        >
          <NuxtLink
            to="/therapy-journey/welcome"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-all duration-300 hover:gap-3"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت</span>
          </NuxtLink>
          <!--Theme button-->
          <BaseThemeToggle />
        </div>

        <div class="text-center">
          <!-- Header -->
          <div 
            class="mb-16 transition-all duration-1000 delay-200"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <div class="relative inline-block mb-6">
              <div class="absolute inset-0 bg-primary-500/10 rounded-full animate-ping"></div>
              <Icon 
                name="ph:coins" 
                class="relative mx-auto size-16 text-primary-500"
              />
            </div>
            <BaseHeading
              as="h1"
              size="4xl"
              lead="tight"
              weight="bold"
              class="mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-primary-300 dark:to-primary-400"
            >
              انتخاب بسته درمانی مناسب
            </BaseHeading>
            <BaseParagraph size="xl" class="text-muted-600 dark:text-muted-300 mb-4 font-medium max-w-3xl mx-auto">
              با توجه به نیازها و شرایط شما، بهترین بسته درمانی را انتخاب کنید
            </BaseParagraph>
          </div>

          <!-- Pricing Plans -->
          <div 
            class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-400"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              class="relative group cursor-pointer transition-all duration-300 hover:-translate-y-2"
              :class="{
                'transform scale-105 ring-2 ring-primary-500 ring-opacity-50': selectedPlan === plan.id
              }"
              @click="selectPlan(plan.id)"
            >
              <!-- Popular badge -->
              <div 
                v-if="plan.popular" 
                class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10"
              >
                محبوب‌ترین انتخاب
              </div>

              <div 
                class="relative bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 h-full"
                :class="{
                  'bg-primary-50/80 dark:bg-primary-900/20 border-primary-200/50': plan.popular,
                  'ring-2 ring-primary-400 shadow-primary-500/20': selectedPlan === plan.id
                }"
              >
                <!-- Plan header -->
                <div class="text-center mb-8">
                  <BaseHeading
                    as="h3"
                    size="2xl"
                    weight="bold"
                    class="mb-2"
                    :class="{
                      'text-primary-700 dark:text-primary-300': plan.popular,
                      'text-muted-700 dark:text-muted-200': !plan.popular
                    }"
                  >
                    {{ plan.name }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-6">
                    {{ plan.description }}
                  </BaseParagraph>
                  
                  <!-- Price -->
                  <div class="mb-4">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <span 
                        class="text-4xl font-bold"
                        :class="{
                          'text-primary-600 dark:text-primary-400': plan.popular,
                          'text-muted-700 dark:text-muted-200': !plan.popular
                        }"
                      >
                        {{ plan.price.toLocaleString() }}
                      </span>
                      <span class="text-lg text-muted-500">تومان</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-sm text-muted-400 line-through">{{ plan.originalPrice.toLocaleString() }} تومان</span>
                      <span class="text-xs bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 px-2 py-1 rounded-full">
                        تخفیف ویژه
                      </span>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-500 mt-2">
                      {{ plan.duration }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Features -->
                <div class="space-y-4 mb-8">
                  <div 
                    v-for="feature in plan.features" 
                    :key="feature"
                    class="flex items-start gap-3 text-right"
                  >
                    <Icon 
                      name="ph:check-circle" 
                      class="size-5 text-success-500 flex-shrink-0 mt-0.5"
                    />
                    <span class="text-sm text-muted-600 dark:text-muted-300">{{ feature }}</span>
                  </div>
                  
                  <!-- Limitations if any -->
                  <div v-if="plan.limitations.length > 0" class="pt-4 border-t border-muted-200 dark:border-muted-700">
                    <div 
                      v-for="limitation in plan.limitations" 
                      :key="limitation"
                      class="flex items-start gap-3 text-right mb-2"
                    >
                      <Icon 
                        name="ph:info" 
                        class="size-5 text-muted-400 flex-shrink-0 mt-0.5"
                      />
                      <span class="text-sm text-muted-500 dark:text-muted-400">{{ limitation }}</span>
                    </div>
                  </div>
                </div>

                <!-- Select button -->
                <BaseButton
                  :color="selectedPlan === plan.id ? 'primary' : 'muted'"
                  :variant="selectedPlan === plan.id ? 'solid' : 'outline'"
                  size="lg"
                  class="w-full transition-all duration-300"
                  @click="selectPlan(plan.id)"
                >
                  <Icon 
                    :name="selectedPlan === plan.id ? 'ph:check-circle' : 'ph:circle'" 
                    class="size-5 ml-2"
                  />
                  {{ selectedPlan === plan.id ? 'انتخاب شده' : 'انتخاب این بسته' }}
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div 
            class="mb-16 transition-all duration-1000 delay-600"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <BaseHeading
              as="h2"
              size="2xl"
              weight="bold" 
              class="mb-8 text-muted-700 dark:text-muted-200"
            >
              چرا سفر درمانی ذهنا؟
            </BaseHeading>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                v-for="benefit in benefits" 
                :key="benefit.title"
                class="bg-white/60 dark:bg-muted-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Icon 
                  :name="benefit.icon" 
                  class="size-12 text-primary-500 mx-auto mb-4"
                />
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-3 text-muted-700 dark:text-muted-200"
                >
                  {{ benefit.title }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  {{ benefit.description }}
                </BaseParagraph>
              </div>
            </div>
          </div>

          <!-- Money back guarantee -->
          <div 
            class="mb-12 transition-all duration-1000 delay-800"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <div class="bg-success-50/80 dark:bg-success-900/20 backdrop-blur-sm rounded-2xl p-8 border border-success-200/50">
              <Icon name="ph:medal-duotone" class="size-12 text-success-500 mx-auto mb-4" />
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="mb-4 text-success-700 dark:text-success-300"
              >
                ضمانت بازگشت وجه
              </BaseHeading>
              <BaseParagraph class="text-success-600 dark:text-success-400 max-w-2xl mx-auto">
                اگر در ۷ روز اول از خدمات ما راضی نبودید، کل مبلغ پرداختی شما بازگردانده خواهد شد.
                هیچ سوال یا شرطی نخواهیم پرسید.
              </BaseParagraph>
            </div>
          </div>

          <!-- Continue Button -->
          <div 
            class="transition-all duration-1000 delay-1000"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <BaseButton
              @click="proceedWithPlan"
              :disabled="!selectedPlan || isProcessing"
              :loading="isProcessing"
              color="primary"
              size="xl"
              class="px-16 py-5 text-xl font-bold shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-2 transition-all duration-500 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ph:arrow-left" class="size-6 ml-3" />
              <span>{{ isProcessing ? 'در حال پردازش...' : 'ادامه پرداخت' }}</span>
            </BaseButton>
            
            <div class="mt-6 flex items-center justify-center gap-2 text-sm text-muted-500">
              <Icon name="ph:lock" class="size-4" />
              <span>پرداخت امن با درگاه بانکی معتبر</span>
            </div>
          </div>

          <!-- Legal Info -->
          <div 
            class="mt-12 transition-all duration-1000 delay-1200"
            :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
          >
            <BaseParagraph size="sm" class="text-muted-400 leading-relaxed max-w-3xl mx-auto">
              با ادامه پرداخت، شما تأیید می‌کنید که 
              <NuxtLink 
                to="/auth/terms" 
                class="text-primary-600 hover:text-primary-500 underline underline-offset-2 transition-colors"
              >
                شرایط استفاده
              </NuxtLink>
              و 
              <NuxtLink 
                to="/auth/privacy" 
                class="text-primary-600 hover:text-primary-500 underline underline-offset-2 transition-colors"
              >
                سیاست حریم خصوصی
              </NuxtLink>
              را مطالعه کرده و با آن‌ها موافقت دارید.
            </BaseParagraph>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>