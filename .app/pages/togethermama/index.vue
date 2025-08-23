<script setup lang="ts">
definePageMeta({
  title: 'TogetherMama - خدمات مشاوره والدین',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const plans = [
  {
    id: 'basic',
    name: 'بسته مقدماتی',
    price: '499,000',
    duration: 'ماهانه',
    popular: false,
    color: 'muted',
    description: 'مناسب برای والدین جدید',
    features: [
      'دسترسی به مقالات آموزشی',
      '۲ جلسه مشاوره در ماه',
      'گروه حمایتی آنلاین',
      'دانلود منابع آموزشی',
    ],
  },
  {
    id: 'standard',
    name: 'بسته استاندارد',
    price: '899,000',
    duration: 'ماهانه',
    popular: true,
    color: 'primary',
    description: 'برای رشد و توسعه کودک',
    features: [
      'تمام امکانات بسته مقدماتی',
      '۴ جلسه مشاوره در ماه',
      'مشاوره تخصصی (کودک، نوجوان)',
      'برنامه‌های شخصی‌سازی شده',
      'تحلیل رفتار کودک',
    ],
  },
  {
    id: 'premium',
    name: 'بسته حرفه‌ای',
    price: '1,399,000',
    duration: 'ماهانه',
    popular: false,
    color: 'success',
    description: 'برای چالش‌های پیچیده',
    features: [
      'تمام امکانات بسته استاندارد',
      'جلسات نامحدود مشاوره',
      'مشاوره با متخصصان حوزه کودک',
      'برنامه‌های تخصصی (رفتاری، آموزشی)',
      'تحلیل عمیق رشد کودک',
      'پشتیبانی ۲۴ ساعته',
    ],
  },
]

const benefits = [
  {
    icon: 'ph:heart',
    title: 'حمایت از والدین',
    description: 'محیطی امن برای به اشتراک گذاشتن تجربیات والدین',
  },
  {
    icon: 'ph:graduation-cap',
    title: 'آموزش تخصصی',
    description: 'دسترسی به مقالات و ویدئوهای آموزشی تخصصی',
  },
  {
    icon: 'ph:users',
    title: 'گروه حمایتی',
    description: 'ارتباط با والدین دیگر و تبادل تجربیات',
  },
  {
    icon: 'ph:brain',
    title: 'روش‌های علمی',
    description: 'استفاده از روش‌های مدرن آموزش و پرورش کودک',
  },
]

const selectPlan = (planId: string) => {
  navigateTo(`/togethermama/auth/register?plan=${planId}`)
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
        <div class="mb-12 flex w-full items-center justify-between">
          <div></div>
          <!--Theme button-->
          <BaseThemeToggle />
        </div>

        <div class="text-center">
          <!-- Header -->
          <div class="mb-16">
            <div class="relative mb-6 inline-block">
              <div class="bg-primary-500/10 absolute inset-0 animate-ping rounded-full" />
              <Icon
                name="ph:baby-duotone"
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
              TogetherMama - رشد کودک و آرامش والدین
            </BaseHeading>
            <BaseParagraph size="xl" class="text-muted-600 dark:text-muted-300 mx-auto mb-4 max-w-3xl font-medium">
              با کمک متخصصان ما، رشد سالم کودکان و آرامش والدین را تجربه کنید
            </BaseParagraph>
          </div>

          <!-- Pricing Plans -->
          <div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2"
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
                    <BaseParagraph size="sm" class="text-muted-500">
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
                </div>

                <!-- Select button -->
                <BaseButton
                  :color="plan.popular ? 'primary' : 'muted'"
                  :variant="plan.popular ? 'solid' : 'outline'"
                  size="lg"
                  class="w-full transition-all duration-300"
                  @click="selectPlan(plan.id)"
                >
                  <Icon
                    name="ph:arrow-left"
                    class="ml-2 size-5"
                  />
                  ثبت‌نام
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="mb-16">
            <BaseHeading
              as="h2"
              size="2xl"
              weight="bold"
              class="text-muted-700 dark:text-muted-200 mb-8"
            >
              چرا TogetherMama؟
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

          <!-- CTA Section -->
          <div class="mb-12">
            <div class="bg-success-50/80 dark:bg-success-900/20 border-success-200/50 rounded-2xl border p-8 backdrop-blur-sm">
              <Icon name="ph:medal-duotone" class="text-success-500 mx-auto mb-4 size-12" />
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="text-success-700 dark:text-success-300 mb-4"
              >
                ضمانت رضایت
              </BaseHeading>
              <BaseParagraph class="text-success-600 dark:text-success-400 mx-auto max-w-2xl">
                اگر در ۷ روز اول از خدمات ما راضی نبودید، کل مبلغ پرداختی شما بازگردانده خواهد شد.
              </BaseParagraph>
            </div>
          </div>

          <!-- Login Link -->
          <div class="mt-8">
            <BaseParagraph class="text-muted-500">
              قبلاً ثبت‌نام کرده‌اید؟
              <NuxtLink
                to="/togethermama/auth/login"
                class="text-primary-600 hover:text-primary-500 font-medium underline underline-offset-2 transition-colors"
              >
                وارد شوید
              </NuxtLink>
            </BaseParagraph>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
