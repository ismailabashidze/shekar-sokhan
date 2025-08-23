<script setup lang="ts">
definePageMeta({
  title: 'بسته‌های اشتراک',
  layout: 'default',
})

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

const selectPlan = (planId: string) => {
  // Mock function for selecting a plan
  alert(`بسته ${planId} انتخاب شد`)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>بسته‌های اشتراک</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>بسته مورد نظر خود را انتخاب کنید</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
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
            انتخاب بسته
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
