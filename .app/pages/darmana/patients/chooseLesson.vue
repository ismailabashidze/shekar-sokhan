<script setup lang="ts">
definePageMeta({
  title: 'انتخاب درس',
  preview: {
    title: 'درس های روانشناسی',
    description: 'تمرین مهارت های روانشناسی با هوش مصنوعی',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-course.png',
    srcDark: '/img/screens/dashboards-course-dark.png',
    order: 13,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const lessons = [
  {
    title: 'مدیریت مقاومت در جلسه درمان',
    slug: 'resistance-management',
    description:
      'در این درس، شما با تکنیک‌های مدیریت مقاومت بیمار در جلسات درمانی آشنا می‌شوید و با عامل هوش مصنوعی تمرین خواهید کرد.',
    category: 'مهارت های پایه',
    duration: 60,
    difficulty: 'متوسط',
    techniques: ['گوش دادن فعال', 'بازتاب احساسات', 'مواجهه سازنده'],
    scenarios: [
      {
        title: 'مقاومت در برابر تغییر',
        description: 'بیمار در برابر تغییرات پیشنهادی مقاومت می‌کند',
      },
      {
        title: 'انکار مشکل',
        description: 'بیمار وجود مشکل را انکار می‌کند',
      },
    ],
  },
  {
    title: 'کار با احساسات عمیق',
    slug: 'deep-emotions',
    description:
      'تمرین تکنیک‌های کار با احساسات عمیق و دردناک بیمار، با تمرکز بر ایجاد فضای امن و حمایتگر.',
    category: 'مهارت های پیشرفته',
    duration: 90,
    difficulty: 'پیشرفته',
    techniques: ['همدلی عمیق', 'پذیرش غیرشرطی', 'تنظیم هیجان'],
    scenarios: [
      {
        title: 'تروما',
        description: 'کار با خاطرات آسیب‌زا',
      },
      {
        title: 'سوگ',
        description: 'همراهی در فرآیند سوگواری',
      },
    ],
  },
  {
    title: 'مدیریت انتقال و انتقال متقابل',
    slug: 'transference-management',
    description:
      'آشنایی با مفاهیم انتقال و انتقال متقابل و تمرین تشخیص و مدیریت آنها در جلسه درمان.',
    category: 'روان پویشی',
    duration: 75,
    difficulty: 'پیشرفته',
    techniques: ['تحلیل انتقال', 'خودآگاهی درمانگر', 'مرزبندی حرفه‌ای'],
    scenarios: [
      {
        title: 'وابستگی عاطفی',
        description: 'مدیریت وابستگی عاطفی بیمار به درمانگر',
      },
      {
        title: 'خشم انتقالی',
        description: 'کار با خشم بیمار نسبت به درمانگر',
      },
    ],
  },
]

const resources = [
  {
    name: 'راهنمای تکنیک‌های پایه',
    size: '2.3 MB',
    uploaded: '۲ روز پیش',
    icon: '/img/icons/files/pdf.svg',
  },
  {
    name: 'فرم‌های ارزیابی جلسه',
    size: '79 KB',
    uploaded: '۱ هفته پیش',
    icon: '/img/icons/files/sheet.svg',
  },
  {
    name: 'چک‌لیست مهارت‌ها',
    size: '42 KB',
    uploaded: '۲ هفته پیش',
    icon: '/img/icons/files/doc-2.svg',
  },
]

const progress = [
  {
    name: 'مهارت‌های پایه',
    completion: '78%',
    status: 'در حال پیشرفت',
    nextLesson: 'مدیریت مقاومت',
  },
  {
    name: 'تکنیک‌های پیشرفته',
    completion: '45%',
    status: 'در حال یادگیری',
    nextLesson: 'کار با احساسات',
  },
  {
    name: 'روان پویشی',
    completion: '30%',
    status: 'تازه شروع شده',
    nextLesson: 'مفاهیم پایه',
  },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col justify-between md:flex-row md:items-center">
      <div class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-left lg:max-w-full">
        <Icon
          name="ph:brain-duotone"
          class="text-primary-500 size-12"
        />
        <div>
          <BaseHeading
            as="h2"
            size="2xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>درس‌های روانشناسی</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">تمرین مهارت‌های روانشناسی با هوش مصنوعی</span>
          </BaseParagraph>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start">
        <BaseButton>
          <span>راهنما</span>
        </BaseButton>
        <BaseButton
          color="primary"
        >
          <span>شروع درس</span>
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <div class="ltablet:gap-x-4 mt-10 grid grid-cols-12 gap-x-6 gap-y-12">
      <!-- Main content -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 mb-2 dark:text-white"
          >
            درس‌های در دسترس
          </BaseHeading>
          <BaseParagraph
            lead="normal"
            class="text-muted-500"
          >
            درس مورد نظر خود را انتخاب کنید و با عامل هوش مصنوعی تمرین کنید
          </BaseParagraph>
        </div>

        <!-- Lessons -->
        <div class="space-y-4">
          <div
            v-for="(lesson, index) in lessons"
            :key="index"
            class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex flex-col rounded-xl border bg-white p-6"
          >
            <div class="mb-3 flex items-center justify-between">
              <BaseHeading
                as="h4"
                size="sm"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                {{ lesson.title }}
              </BaseHeading>
              <BaseTag
                :color="lesson.difficulty === 'پیشرفته' ? 'danger' : 'primary'"
                rounded="lg"
              >
                {{ lesson.difficulty }}
              </BaseTag>
            </div>
            <BaseParagraph
              size="sm"
              class="text-muted-500 mb-4"
            >
              {{ lesson.description }}
            </BaseParagraph>
            <div class="mb-4 flex flex-wrap gap-2">
              <BaseTag
                v-for="technique in lesson.techniques"
                :key="technique"
                color="info"
                rounded="lg"
              >
                {{ technique }}
              </BaseTag>
            </div>
            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="ph:clock-duotone"
                  class="text-primary-500"
                />
                <span class="text-muted-500 text-sm">{{ lesson.duration }} دقیقه</span>
              </div>
              <BaseButton
                :to="`/darmana/patients/${lesson.slug}`"
                color="primary"
              >
                شروع تمرین
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <!-- Progress section -->
        <div class="mb-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 mb-2 dark:text-white"
          >
            پیشرفت شما
          </BaseHeading>
          <div class="space-y-4">
            <div
              v-for="(item, index) in progress"
              :key="index"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 flex flex-col rounded-xl border bg-white p-4"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-800 text-sm font-medium dark:text-white">{{ item.name }}</span>
                <span class="text-primary-500 text-sm">{{ item.completion }}</span>
              </div>
              <div class="bg-muted-100 dark:bg-muted-700 h-2 rounded-full">
                <div
                  class="bg-primary-500 h-2 rounded-full"
                  :style="{ width: item.completion }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Resources section -->
        <div>
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 mb-2 dark:text-white"
          >
            منابع آموزشی
          </BaseHeading>
          <div class="space-y-4">
            <div
              v-for="(resource, index) in resources"
              :key="index"
              class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 flex items-center gap-3 rounded-xl border bg-white p-4"
            >
              <img
                :src="resource.icon"
                class="size-8"
                alt="File icon"
              >
              <div class="grow">
                <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                  {{ resource.name }}
                </h4>
                <p class="text-muted-500 text-xs">
                  {{ resource.size }} • {{ resource.uploaded }}
                </p>
              </div>
              <BaseButton
                color="primary"
                shape="icon"
              >
                <Icon
                  name="lucide:download"
                  class="size-4"
                />
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
