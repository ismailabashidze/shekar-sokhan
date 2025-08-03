<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'سفر درمانی - خوش آمدید',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - خوش آمدید',
    description: 'شروع سفر درمانی با هوش مصنوعی',
    categories: ['therapy', 'welcome'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 1,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - خوش آمدید | ذهنا',
  meta: [
    { name: 'description', content: 'آغاز سفر بهبود و رشد شخصی با کمک هوش مصنوعی. محرمانه، امن و حرفه‌ای.' }
  ]
})

const router = useRouter()
const isVisible = ref(false)
const currentStep = ref(0)
const isStarting = ref(false)

const steps = [
  {
    icon: 'ph:shield-check',
    title: 'حریم خصوصی و محرمانگی',
    description: 'تمامی اطلاعاتی که در این سفر درمانی با ما به اشتراک می‌گذارید، کاملاً محرمانه و امن نگهداری می‌شود. ما متعهد به حفظ حریم خصوصی شما هستیم و هیچ اطلاعاتی بدون اجازه شما با اشخاص ثالث به اشتراک گذاشته نخواهد شد.',
    color: 'primary',
    bgClass: 'bg-primary-50 dark:bg-primary-900/50',
    iconColor: 'text-primary-500',
    titleColor: 'text-primary-700 dark:text-primary-300'
  },
  {
    icon: 'ph:chat-circle-dots',
    title: 'صداقت و صراحت',
    description: 'برای دریافت بهترین کمک و راهنمایی، لطفاً در پاسخ‌هایتان کاملاً صادق و صریح باشید. هیچ قضاوتی انجام نخواهد شد و هدف ما تنها کمک به شما برای رسیدن به بهترین نسخه خودتان است.',
    color: 'success',
    bgClass: 'bg-success-50 dark:bg-success-900/50',
    iconColor: 'text-success-500',
    titleColor: 'text-success-700 dark:text-success-300'
  },
  {
    icon: 'ph:robot',
    title: 'درمان با کمک هوش مصنوعی',
    description: 'سیستم هوش مصنوعی ما بر اساس جدیدترین روش‌های علمی درمان شناختی-رفتاری طراحی شده است. این ابزار قدرتمند می‌تواند شما را در شناخت بهتر خود، مدیریت احساسات و حل مسائل یاری کند.',
    color: 'info',
    bgClass: 'bg-info-50 dark:bg-info-900/50',
    iconColor: 'text-info-500',
    titleColor: 'text-info-700 dark:text-info-300'
  }
]

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  // Progressive reveal of steps
  const interval = setInterval(() => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    } else {
      clearInterval(interval)
    }
  }, 800)
})

const startJourney = async () => {
  isStarting.value = true
  
  // Add a nice loading effect
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Navigate to the next step of the therapy journey
  router.push('/therapy-journey/assessment')
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
      <div class="relative mx-auto w-full max-w-5xl">
        <!--Nav-->
        <div 
          class="flex w-full items-center justify-between mb-12 transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 -translate-y-4': !isVisible }"
        >
          <NuxtLink
            to="/dashboard"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-all duration-300 hover:gap-3"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به داشبورد</span>
          </NuxtLink>
          <!--Theme button-->
          <BaseThemeToggle />
        </div>

        <div class="text-center">
          <!-- Welcome Header with Animation -->
          <div 
            class="mb-12 transition-all duration-1000 delay-200"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
          >
            <div class="relative inline-block mb-6">
              <div class="absolute inset-0 bg-primary-500/10 rounded-full animate-ping"></div>
              <Icon 
                name="ph:heart-fill" 
                class="relative mx-auto size-20 text-primary-500 animate-pulse"
              />
            </div>
            <BaseHeading
              as="h1"
              size="5xl"
              lead="tight"
              weight="bold"
              class="mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-primary-300 dark:to-primary-400"
            >
              به سفر درمانی خوش آمدید
            </BaseHeading>
            <BaseParagraph size="xl" class="text-muted-600 dark:text-muted-300 mb-4 font-medium">
              آماده‌اید تا قدم اول را در مسیر بهبود و رشد شخصی بردارید؟
            </BaseParagraph>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 max-w-2xl mx-auto">
              در این سفر، همراه هوش مصنوعی پیشرفته، به کشف درونی‌تان می‌پردازیم و مهارت‌های جدیدی برای زندگی بهتر فرا می‌گیریم.
            </BaseParagraph>
          </div>

          <!-- Progressive Information Cards -->
          <div class="space-y-6 mb-12">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="transition-all duration-800 transform"
              :class="{ 
                'opacity-100 translate-y-0 scale-100': currentStep >= index, 
                'opacity-0 translate-y-8 scale-95': currentStep < index 
              }"
            >
              <div :class="[step.bgClass, 'rounded-2xl p-8 text-right shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 backdrop-blur-sm']">
                <div class="flex items-start gap-6">
                  <div :class="[step.iconColor, 'flex-shrink-0 relative w-16 h-16 flex items-center justify-center']">
                    <div class="absolute inset-0 rounded-full bg-current opacity-15 animate-pulse"></div>
                    <Icon :name="step.icon" class="relative size-6" />
                  </div>
                  <div class="flex-1">
                    <BaseHeading
                      as="h3"
                      size="xl"
                      weight="bold"
                      :class="[step.titleColor, 'mb-4']"
                    >
                      {{ step.title }}
                    </BaseHeading>
                    <BaseParagraph size="base" class="text-muted-700 dark:text-muted-200 leading-relaxed">
                      {{ step.description }}
                    </BaseParagraph>
                    
                    <!-- Additional info for each step -->
                    <div v-if="index === 0" class="mt-4 space-y-3">
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:lock" class="size-4" />
                          <span class="font-medium">همه داده‌ها با بالاترین استانداردهای امنیتی رمزگذاری و محافظت می‌شوند.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:database" class="size-4" />
                          <span class="font-medium">اطلاعات شما در سرورهای امن ایرانی نگهداری می‌شود و تحت قوانین حفاظت از داده‌های کشور محافظت می‌شود.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:eye-slash" class="size-4" />
                          <span class="font-medium">هیچ کس جز خود شما به مکالمات و اطلاعات شخصی‌تان دسترسی ندارد، حتی تیم پشتیبانی ما.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300">
                          <Icon name="ph:trash" class="size-4" />
                          <span class="font-medium">می‌توانید هر زمان که بخواهید تمام اطلاعات خود را به صورت کامل حذف کنید.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="index === 1" class="mt-4 space-y-3">
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:user-circle" class="size-4" />
                          <span class="font-medium">هر چه بیشتر در مورد احساسات و تجربیات‌تان بگویید، بهتر می‌توانیم کمک کنیم.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:scales" class="size-4" />
                          <span class="font-medium">هیچ قضاوت، انتقاد یا تحقیری انجام نخواهد شد. این یک محیط کاملاً امن و پذیرنده است.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:heart-straight" class="size-4" />
                          <span class="font-medium">صادق بودن با خودتان اولین قدم برای بهبود است. ما اینجا هستیم تا حمایت کنیم.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300">
                          <Icon name="ph:clock-countdown" class="size-4" />
                          <span class="font-medium">وقت خود را بگذارید. عجله‌ای نیست و می‌توانید هر زمان که احساس راحتی می‌کنید ادامه دهید.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="index === 2" class="mt-4 space-y-3">
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:graduation-cap" class="size-4" />
                          <span class="font-medium">در هر مرحله، راهنمایی‌های شخصی‌سازی شده و تمرین‌های عملی دریافت خواهید کرد.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:brain" class="size-4" />
                          <span class="font-medium">هوش مصنوعی ما بر مبنای روش‌های CBT، DBT و سایر درمان‌های مبتنی بر شواهد آموزش دیده است.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:chart-line-up" class="size-4" />
                          <span class="font-medium">پیشرفت شما به صورت مداوم ارزیابی می‌شود و روش‌ها بر اساس نیازهای شما تنظیم می‌شوند.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300 mb-2">
                          <Icon name="ph:handshake" class="size-4" />
                          <span class="font-medium">در صورت نیاز به مشاوره انسانی، می‌توانید به متخصصان واقعی ارجاع داده شوید.</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white/50 dark:bg-muted-800/50 rounded-lg">
                        <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-300">
                          <Icon name="ph:clock-clockwise" class="size-4" />
                          <span class="font-medium">سیستم ۲۴ ساعته در دسترس است و می‌توانید هر زمان که نیاز دارید از آن استفاده کنید.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Journey Stats -->
          <div 
            class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-1000"
            :class="{ 'opacity-100 translate-y-0': currentStep >= 2, 'opacity-0 translate-y-8': currentStep < 2 }"
          >
            <div class="bg-white/60 dark:bg-muted-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Icon name="ph:users" class="size-8 text-primary-500 mx-auto mb-3" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                بیش از ۱۰۰۰ کاربر موفق
              </BaseParagraph>
            </div>
            <div class="bg-white/60 dark:bg-muted-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Icon name="ph:clock" class="size-8 text-success-500 mx-auto mb-3" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                ۲۴/۷ در دسترس
              </BaseParagraph>
            </div>
            <div class="bg-white/60 dark:bg-muted-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Icon name="ph:certificate" class="size-8 text-info-500 mx-auto mb-3" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                مبتنی بر علم درمان
              </BaseParagraph>
            </div>
          </div>

          <!-- Enhanced Start Journey Button -->
          <div 
            class="transition-all duration-1000 delay-1200"
            :class="{ 'opacity-100 translate-y-0': currentStep >= 2, 'opacity-0 translate-y-8': currentStep < 2 }"
          >
            <BaseButton
              @click="startJourney"
              :loading="isStarting"
              :disabled="isStarting"
              color="primary"
              size="xl"
              class="relative overflow-hidden group px-16 py-5 text-xl font-bold shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-2 transition-all duration-500 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Icon name="ph:arrow-left" class="size-6 ml-3 transition-transform group-hover:-translate-x-1" />
              <span>{{ isStarting ? 'در حال آماده‌سازی...' : 'شروع سفر درمانی' }}</span>
            </BaseButton>
            
            <div class="mt-6 flex items-center justify-center gap-2 text-sm text-muted-500">
              <Icon name="ph:timer" class="size-4" />
              <span>تقریباً ۵ دقیقه زمان نیاز دارید</span>
            </div>
          </div>

          <!-- Enhanced Legal Info -->
          <div 
            class="mt-8 transition-all duration-1000 delay-1400"
            :class="{ 'opacity-100': currentStep >= 2, 'opacity-0': currentStep < 2 }"
          >
            <BaseParagraph size="sm" class="text-muted-400 leading-relaxed max-w-3xl mx-auto">
              با کلیک بر روی "شروع سفر درمانی" شما تأیید می‌کنید که 
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