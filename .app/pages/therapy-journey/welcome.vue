<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  title: 'سفر درمانی - خوش آمدید',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - خوش آمدید',
    description: 'شروع سفر درمانی با هوش مصنوعی',
    categories: ['therapy', 'welcome'],
    src: '/img/logo.svg',
    srcDark: '/img/logo.svg',
    order: 1,
  },
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - خوش آمدید | ذهنا',
  meta: [
    { name: 'description', content: 'آغاز سفر بهبود و رشد شخصی با کمک هوش مصنوعی. محرمانه، امن و حرفه‌ای.' },
  ],
});

const router = useRouter();
const isVisible = ref(false);
const currentStep = ref(0);
const isStarting = ref(false);

const steps = [
  {
    icon: 'ph:shield-check',
    title: 'حریم خصوصی و محرمانگی',
    description: 'تمامی اطلاعاتی که در این سفر درمانی با ما به اشتراک می‌گذارید، کاملاً محرمانه و امن نگهداری می‌شود. ما متعهد به حفظ حریم خصوصی شما هستیم و هیچ اطلاعاتی بدون اجازه شما با اشخاص ثالث به اشتراک گذاشته نخواهد شد.',
    color: 'primary',
    bgClass: 'bg-primary-50 dark:bg-primary-900/50',
    iconColor: 'text-primary-500',
    titleColor: 'text-primary-700 dark:text-primary-300',
  },
  {
    icon: 'ph:chat-circle-dots',
    title: 'صداقت و صراحت',
    description: 'برای دریافت بهترین کمک و راهنمایی، لطفاً در پاسخ‌هایتان کاملاً صادق و صریح باشید. هیچ قضاوتی انجام نخواهد شد و هدف ما تنها کمک به شما برای رسیدن به بهترین نسخه خودتان است.',
    color: 'success',
    bgClass: 'bg-success-50 dark:bg-success-900/50',
    iconColor: 'text-success-500',
    titleColor: 'text-success-700 dark:text-success-300',
  },
  {
    icon: 'ph:robot',
    title: 'درمان با کمک هوش مصنوعی',
    description: 'سیستم هوش مصنوعی ما بر اساس جدیدترین روش‌های علمی درمان شناختی-رفتاری طراحی شده است. این ابزار قدرتمند می‌تواند شما را در شناخت بهتر خود، مدیریت احساسات و حل مسائل یاری کند.',
    color: 'info',
    bgClass: 'bg-info-50 dark:bg-info-900/50',
    iconColor: 'text-info-500',
    titleColor: 'text-info-700 dark:text-info-300',
  },
];

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  // Progressive reveal of steps
  const interval = setInterval(() => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    }
    else {
      clearInterval(interval);
    }
  }, 800);
});

const startJourney = async () => {
  isStarting.value = true;

  // Add a nice loading effect
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Navigate to the next step of the therapy journey
  router.push('/therapy-journey/assessment');
};
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
      <div class="relative mx-auto w-full max-w-5xl">
        <!--Nav-->
        <div
          class="mb-12 flex w-full items-center justify-between transition-all duration-1000"
          :class="{ 'translate-y-0 opacity-100': isVisible, '-translate-y-4 opacity-0': !isVisible }"
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
            class="mb-12 transition-all delay-200 duration-1000"
            :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
          >
            <div class="relative mb-6 inline-block">
              <div class="bg-primary-500/10 absolute inset-0 animate-ping rounded-full" />
              <Icon
                name="ph:heart-fill"
                class="text-primary-500 relative mx-auto size-20 animate-pulse"
              />
            </div>
            <BaseHeading
              as="h1"
              size="5xl"
              lead="tight"
              weight="bold"
              class="from-primary-600 via-primary-500 to-primary-600 dark:from-primary-400 dark:via-primary-300 dark:to-primary-400 mb-6 bg-gradient-to-r bg-clip-text text-transparent"
            >
              به سفر درمانی خوش آمدید
            </BaseHeading>
            <BaseParagraph size="xl" class="text-muted-600 dark:text-muted-300 mb-4 font-medium">
              آماده‌اید تا قدم اول را در مسیر بهبود و رشد شخصی بردارید؟
            </BaseParagraph>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mx-auto max-w-2xl">
              در این سفر، همراه هوش مصنوعی پیشرفته، به کشف درونی‌تان می‌پردازیم و مهارت‌های جدیدی برای زندگی بهتر فرا می‌گیریم.
            </BaseParagraph>
          </div>

          <!-- Progressive Information Cards -->
          <div class="mb-12 space-y-6">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="duration-800 transition-all"
              :class="{
                'translate-y-0 scale-100 opacity-100': currentStep >= index,
                'translate-y-8 scale-95 opacity-0': currentStep < index
              }"
            >
              <div :class="[step.bgClass, 'rounded-2xl border border-white/20 p-8 text-right shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl']">
                <div class="flex items-start gap-6">
                  <div :class="[step.iconColor, 'relative flex size-16 shrink-0 items-center justify-center']">
                    <div class="absolute inset-0 animate-pulse rounded-full bg-current opacity-15" />
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
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:lock" class="size-4" />
                          <span class="font-medium">همه داده‌ها با بالاترین استانداردهای امنیتی رمزگذاری و محافظت می‌شوند.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:database" class="size-4" />
                          <span class="font-medium">اطلاعات شما در سرورهای امن ایرانی نگهداری می‌شود و تحت قوانین حفاظت از داده‌های کشور محافظت می‌شود.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:eye-slash" class="size-4" />
                          <span class="font-medium">هیچ کس جز خود شما به مکالمات و اطلاعات شخصی‌تان دسترسی ندارد، حتی تیم پشتیبانی ما.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-2 text-sm">
                          <Icon name="ph:trash" class="size-4" />
                          <span class="font-medium">می‌توانید هر زمان که بخواهید تمام اطلاعات خود را به صورت کامل حذف کنید.</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="index === 1" class="mt-4 space-y-3">
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:user-circle" class="size-4" />
                          <span class="font-medium">هر چه بیشتر در مورد احساسات و تجربیات‌تان بگویید، بهتر می‌توانیم کمک کنیم.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:scales" class="size-4" />
                          <span class="font-medium">هیچ قضاوت، انتقاد یا تحقیری انجام نخواهد شد. این یک محیط کاملاً امن و پذیرنده است.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:heart-straight" class="size-4" />
                          <span class="font-medium">صادق بودن با خودتان اولین قدم برای بهبود است. ما اینجا هستیم تا حمایت کنیم.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-2 text-sm">
                          <Icon name="ph:clock-countdown" class="size-4" />
                          <span class="font-medium">وقت خود را بگذارید. عجله‌ای نیست و می‌توانید هر زمان که احساس راحتی می‌کنید ادامه دهید.</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="index === 2" class="mt-4 space-y-3">
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:graduation-cap" class="size-4" />
                          <span class="font-medium">در هر مرحله، راهنمایی‌های شخصی‌سازی شده و تمرین‌های عملی دریافت خواهید کرد.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:brain" class="size-4" />
                          <span class="font-medium">هوش مصنوعی ما بر مبنای روش‌های CBT، DBT و سایر درمان‌های مبتنی بر شواهد آموزش دیده است.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:chart-line-up" class="size-4" />
                          <span class="font-medium">پیشرفت شما به صورت مداوم ارزیابی می‌شود و روش‌ها بر اساس نیازهای شما تنظیم می‌شوند.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm">
                          <Icon name="ph:handshake" class="size-4" />
                          <span class="font-medium">در صورت نیاز به مشاوره انسانی، می‌توانید به متخصصان واقعی ارجاع داده شوید.</span>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/50 rounded-lg bg-white/50 p-4">
                        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-2 text-sm">
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
            class="mb-12 grid grid-cols-1 gap-6 transition-all delay-1000 duration-1000 md:grid-cols-3"
            :class="{ 'translate-y-0 opacity-100': currentStep >= 2, 'translate-y-8 opacity-0': currentStep < 2 }"
          >
            <div class="dark:bg-muted-800/60 rounded-xl border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
              <Icon name="ph:users" class="text-primary-500 mx-auto mb-3 size-8" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                بیش از ۱۰۰۰ کاربر موفق
              </BaseParagraph>
            </div>
            <div class="dark:bg-muted-800/60 rounded-xl border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
              <Icon name="ph:clock" class="text-success-500 mx-auto mb-3 size-8" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                ۲۴/۷ در دسترس
              </BaseParagraph>
            </div>
            <div class="dark:bg-muted-800/60 rounded-xl border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
              <Icon name="ph:certificate" class="text-info-500 mx-auto mb-3 size-8" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 font-medium">
                مبتنی بر علم درمان
              </BaseParagraph>
            </div>
          </div>

          <!-- Enhanced Start Journey Button -->
          <div
            class="delay-1200 transition-all duration-1000"
            :class="{ 'translate-y-0 opacity-100': currentStep >= 2, 'translate-y-8 opacity-0': currentStep < 2 }"
          >
            <BaseButton
              :loading="isStarting"
              :disabled="isStarting"
              color="primary"
              size="xl"
              class="hover:shadow-primary-500/25 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 group relative overflow-hidden bg-gradient-to-r px-16 py-5 text-xl font-bold shadow-2xl transition-all duration-500 hover:-translate-y-2"
              @click="startJourney"
            >
              <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-full" />
              <Icon name="ph:arrow-left" class="ml-3 size-6 transition-transform group-hover:-translate-x-1" />
              <span>{{ isStarting ? 'در حال آماده‌سازی...' : 'شروع سفر درمانی' }}</span>
            </BaseButton>

            <div class="text-muted-500 mt-6 flex items-center justify-center gap-2 text-sm">
              <Icon name="ph:timer" class="size-4" />
              <span>تقریباً ۵ دقیقه زمان نیاز دارید</span>
            </div>
          </div>

          <!-- Enhanced Legal Info -->
          <div
            class="delay-1400 mt-8 transition-all duration-1000"
            :class="{ 'opacity-100': currentStep >= 2, 'opacity-0': currentStep < 2 }"
          >
            <BaseParagraph size="sm" class="text-muted-400 mx-auto max-w-3xl leading-relaxed">
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
