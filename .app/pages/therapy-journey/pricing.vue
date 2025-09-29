<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'سفر درمانی - تعرفه‌ها',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - تعرفه‌ها',
    description: 'انتخاب بسته مناسب سفر درمانی با هوش مصنوعی',
    categories: ['therapy', 'pricing'],
    src: '/img/logo.svg',
    srcDark: '/img/logo.svg',
    order: 3,
  },
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - تعرفه‌ها | ذهنا',
  meta: [
    { name: 'description', content: 'انتخاب بسته مناسب درمان با هوش مصنوعی. تعرفه‌های متنوع برای همه نیازها' },
  ],
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
      'دسترسی به کتابخانه منابع آموزشی',
    ],
    limitations: [
      'حداکثر ۱۰ جلسه گفتگو در ماه',
      'دسترسی به ۵ تمرین تخصصی',
    ],
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
      'تمرین‌های مراقبه و آرام‌سازی',
    ],
    limitations: [
      'نامحدود گفتگو',
      'دسترسی کامل به تمرین‌ها',
    ],
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
      'کیت ابزارهای خودمراقبتی',
    ],
    limitations: [],
  },
]

const benefits = [
  {
    icon: 'ph:shield-check',
    title: 'محرمانگی کامل',
    description: 'همه اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود',
  },
  {
    icon: 'ph:clock',
    title: 'دسترسی ۲۴/۷',
    description: 'هر زمان که نیاز داشتید، هوش مصنوعی درمانگر در دسترس شماست',
  },
  {
    icon: 'ph:brain',
    title: 'مبتنی بر علم',
    description: 'استفاده از روش‌های درمانی مدرن و مبتنی بر شواهد علمی',
  },
  {
    icon: 'ph:heart',
    title: 'بدون قضاوت',
    description: 'محیطی امن و پذیرنده برای بیان احساسات و تجربیات شما',
  },
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
  <div class="dark:from-muted-900 dark:to-muted-800 min-h-screen bg-gradient-to-br from-slate-50 to-white dark:bg-gradient-to-br">
    <!-- Floating particles background -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="bg-primary-300/20 absolute left-1/4 top-1/4 size-2 animate-pulse rounded-full" />
      <div class="bg-success-300/20 absolute right-1/3 top-3/4 size-3 animate-pulse rounded-full delay-500" />
      <div class="bg-info-300/20 absolute right-1/4 top-1/2 size-1 animate-pulse rounded-full delay-1000" />
      <div class="bg-primary-300/20 absolute bottom-1/4 left-1/3 size-2 animate-pulse rounded-full delay-700" />
    </div>

    <div class="relative flex flex-col justify-center px-6 py-12">
      <div class="relative mx-auto w-full max-w-7xl">
        <!--Nav-->
        <div
          class="mb-12 flex w-full items-center justify-between transition-all duration-1000"
          :class="{ 'translate-y-0 opacity-100': isVisible, '-translate-y-4 opacity-0': !isVisible }"
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
            class="mb-16 transition-all delay-200 duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <div class="relative mb-6 inline-block">
              <div class="bg-primary-500/10 absolute inset-0 animate-ping rounded-full" />
              <Icon
                name="ph:coins"
                class="text-primary-500 relative mx-auto size-16"
              />
            </div>
            <BaseHeading
              as="h1"
              size="4xl"
              lead="tight"
              weight="bold"
              class="from-primary-600 via-primary-500 to-primary-600 dark:from-primary-400 dark:via-primary-300 dark:to-primary-400 mb-6 bg-gradient-to-r bg-clip-text text-transparent"
            >
              انتخاب بسته درمانی مناسب
            </BaseHeading>
            <BaseParagraph size="xl" class="text-muted-600 dark:text-muted-300 mx-auto mb-4 max-w-3xl font-medium">
              با توجه به نیازها و شرایط شما، بهترین بسته درمانی را انتخاب کنید
            </BaseParagraph>
          </div>

          <!-- Pricing Plans -->
          <div
            class="delay-400 mb-16 grid grid-cols-1 gap-8 transition-all duration-1000 md:grid-cols-3"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2"
              :class="{
                'ring-primary-500 scale-105 ring-2 ring-opacity-50': selectedPlan === plan.id
              }"
              @click="selectPlan(plan.id)"
            >
              <!-- Popular badge -->
              <div
                v-if="plan.popular"
                class="from-primary-500 to-primary-600 absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-bold text-white shadow-lg"
              >
                محبوب‌ترین انتخاب
              </div>

              <div
                class="dark:bg-muted-800/80 relative h-full rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
                :class="{
                  'bg-primary-50/80 dark:bg-primary-900/20 border-primary-200/50': plan.popular,
                  'ring-primary-400 shadow-primary-500/20 ring-2': selectedPlan === plan.id
                }"
              >
                <!-- Plan header -->
                <div class="mb-8 text-center">
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
                    <div class="mb-2 flex items-center justify-center gap-2">
                      <span
                        class="text-4xl font-bold"
                        :class="{
                          'text-primary-600 dark:text-primary-400': plan.popular,
                          'text-muted-700 dark:text-muted-200': !plan.popular
                        }"
                      >
                        {{ plan.price.toLocaleString() }}
                      </span>
                      <span class="text-muted-500 text-lg">تومان</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-muted-400 text-sm line-through">{{ plan.originalPrice.toLocaleString() }} تومان</span>
                      <span class="bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 rounded-full px-2 py-1 text-xs">
                        تخفیف ویژه
                      </span>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-500 mt-2">
                      {{ plan.duration }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Features -->
                <div class="mb-8 space-y-4">
                  <div
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-start gap-3 text-right"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="text-success-500 mt-0.5 size-5 shrink-0"
                    />
                    <span class="text-muted-600 dark:text-muted-300 text-sm">{{ feature }}</span>
                  </div>

                  <!-- Limitations if any -->
                  <div v-if="plan.limitations.length > 0" class="border-muted-200 dark:border-muted-700 border-t pt-4">
                    <div
                      v-for="limitation in plan.limitations"
                      :key="limitation"
                      class="mb-2 flex items-start gap-3 text-right"
                    >
                      <Icon
                        name="ph:info"
                        class="text-muted-400 mt-0.5 size-5 shrink-0"
                      />
                      <span class="text-muted-500 dark:text-muted-400 text-sm">{{ limitation }}</span>
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
                    class="ml-2 size-5"
                  />
                  {{ selectedPlan === plan.id ? 'انتخاب شده' : 'انتخاب این بسته' }}
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div
            class="delay-600 mb-16 transition-all duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <BaseHeading
              as="h2"
              size="2xl"
              weight="bold"
              class="text-muted-700 dark:text-muted-200 mb-8"
            >
              چرا سفر درمانی ذهنا؟
            </BaseHeading>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div
                v-for="benefit in benefits"
                :key="benefit.title"
                class="dark:bg-muted-800/60 rounded-xl border border-white/20 bg-white/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon
                  :name="benefit.icon"
                  class="text-primary-500 mx-auto mb-4 size-12"
                />
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="text-muted-700 dark:text-muted-200 mb-3"
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
            class="delay-800 mb-12 transition-all duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <div class="bg-success-50/80 dark:bg-success-900/20 border-success-200/50 rounded-2xl border p-8 backdrop-blur-sm">
              <Icon name="ph:medal-duotone" class="text-success-500 mx-auto mb-4 size-12" />
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="text-success-700 dark:text-success-300 mb-4"
              >
                ضمانت بازگشت وجه
              </BaseHeading>
              <BaseParagraph class="text-success-600 dark:text-success-400 mx-auto max-w-2xl">
                اگر در ۷ روز اول از خدمات ما راضی نبودید، کل مبلغ پرداختی شما بازگردانده خواهد شد.
                هیچ سوال یا شرطی نخواهیم پرسید.
              </BaseParagraph>
            </div>
          </div>

          <!-- Continue Button -->
          <div
            class="transition-all delay-1000 duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <BaseButton
              :disabled="!selectedPlan || isProcessing"
              :loading="isProcessing"
              color="primary"
              size="xl"
              class="hover:shadow-primary-500/25 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 bg-gradient-to-r px-16 py-5 text-xl font-bold shadow-2xl transition-all duration-500 hover:-translate-y-2 disabled:cursor-not-allowed disabled:opacity-50"
              @click="proceedWithPlan"
            >
              <Icon name="ph:arrow-left" class="ml-3 size-6" />
              <span>{{ isProcessing ? 'در حال پردازش...' : 'ادامه پرداخت' }}</span>
            </BaseButton>

            <div class="text-muted-500 mt-6 flex items-center justify-center gap-2 text-sm">
              <Icon name="ph:lock" class="size-4" />
              <span>پرداخت امن با درگاه بانکی معتبر</span>
            </div>
          </div>

          <!-- Legal Info -->
          <div
            class="delay-1200 mt-12 transition-all duration-1000"
            :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
          >
            <BaseParagraph size="sm" class="text-muted-400 mx-auto max-w-3xl leading-relaxed">
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
