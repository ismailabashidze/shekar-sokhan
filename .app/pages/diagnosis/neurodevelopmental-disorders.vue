<template>
  <div class="from-primary-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br via-white to-blue-50">
    <!-- Header Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.blue.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.primary.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.cyan.400) 0%, transparent 50%)" />
      </div>

      <div class="container relative mx-auto max-w-7xl px-4 py-12">
        <!-- Navigation Breadcrumb and Theme Toggle -->
        <div class="mb-8 flex items-center justify-between">
          <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
            <Icon name="ph:house" class="size-4" />
            <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              خانه
            </NuxtLink>
            <Icon name="ph:caret-left" class="size-3" />
            <NuxtLink to="/diagnosis" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              راهنمای تشخیصی
            </NuxtLink>
            <Icon name="ph:caret-left" class="size-3" />
            <NuxtLink to="/diagnosis/categories" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              دسته‌بندی‌ها
            </NuxtLink>
            <Icon name="ph:caret-left" class="size-3" />
            <span class="text-primary-600 dark:text-primary-400 font-medium">اختلالات نوروتکاملی</span>
          </div>

          <!-- Theme Toggle -->
          <div class="flex items-center gap-3">
            <BaseThemeToggle />
          </div>
        </div>

        <!-- Main Header -->
        <div class="mb-12 text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
            <div class="relative rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
              <Icon :name="categoryData.icon" class="size-8 text-white" />
              <div class="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                DSM-5 Category
              </div>
              <div class="text-muted-800 text-lg font-bold dark:text-white">
                {{ categoryData.titleEn }}
              </div>
            </div>
          </div>

          <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
            {{ categoryData.titleFa }}
          </h1>

          <p class="text-muted-600 dark:text-muted-400 mx-auto mb-8 max-w-4xl text-lg leading-relaxed">
            {{ categoryData.description }}
          </p>

          <!-- Category Stats -->
          <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                <Icon name="ph:list-numbers" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ categoryData.stats.count }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                اختلال اصلی
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 p-3">
                <Icon name="ph:baby" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {{ categoryData.stats.onsetPeriod }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                دوران شروع
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 p-3">
                <Icon name="ph:trend-up" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {{ categoryData.stats.prevalence }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                شیوع کلی
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto max-w-7xl px-4 pb-12">
      <!-- Category Overview -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mx-auto max-w-4xl">
          <div class="mb-8 text-center">
            <Icon name="ph:info" class="mx-auto mb-4 size-12 text-blue-500" />
            <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
              {{ categoryData.overview.title }}
            </h2>
          </div>

          <div class="prose prose-lg prose-muted dark:prose-invert max-w-none text-right leading-relaxed">
            <p class="text-muted-600 dark:text-muted-400 mb-6">
              <strong class="text-muted-800 dark:text-white">{{ categoryData.titleFa }}</strong>
              {{ categoryData.overview.description }}
            </p>

            <div class="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                  ویژگی‌های کلیدی:
                </h4>
                <ul class="space-y-2">
                  <li
                    v-for="feature in categoryData.keyFeatures"
                    :key="feature"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5 shrink-0" />
                    <span class="text-muted-600 dark:text-muted-400">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                  حیطه‌های تأثیرگذاری:
                </h4>
                <ul class="space-y-2">
                  <li
                    v-for="area in categoryData.impactAreas"
                    :key="area.text"
                    class="flex items-start gap-2"
                  >
                    <Icon :name="area.icon" :class="`size-5 text-${area.color}-500 shrink-0 mt-0.5`" />
                    <span class="text-muted-600 dark:text-muted-400">{{ area.text }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Disorders List -->
      <div class="mb-12">
        <div class="mb-8 text-center">
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            اختلالات این دسته‌بندی
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            در ادامه، فهرست کاملی از اختلالات نوروتکاملی بر اساس DSM-5 ارائه شده است.
          </p>
        </div>

        <div class="space-y-8">
          <div
            v-for="(disorder, index) in disorders"
            :key="index"
            class="dark:bg-muted-800/90 dark:border-muted-700/50 group overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
          >
            <!-- Disorder Header -->
            <div
              class="cursor-pointer p-6 transition-all duration-300"
              :class="getDisorderGradient(index)"
              @click="toggleDisorder(index)"
            >
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)" />
              </div>

              <div class="relative z-10">
                <div class="flex items-center justify-between">
                  <div class="flex flex-1 items-center gap-4">
                    <!-- Expand/Collapse Icon -->
                    <div class="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all duration-300">
                      <Icon
                        :name="expandedItems.has(index) ? 'ph:caret-down' : 'ph:caret-left'"
                        class="size-5 text-white transition-transform duration-300"
                        :class="{ 'rotate-90': expandedItems.has(index) }"
                      />
                    </div>

                    <!-- DSM Code -->
                    <div class="rounded-lg border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
                      <div class="font-mono text-xs font-bold text-white">
                        {{ disorder.code }}
                      </div>
                    </div>

                    <!-- Disorder Info -->
                    <div class="flex-1">
                      <h3 class="mb-1 text-xl font-bold text-white drop-shadow-sm">
                        {{ disorder.titleFa }}
                      </h3>
                      <p class="text-sm font-medium text-white/80">
                        {{ disorder.titleEn }}
                      </p>
                    </div>
                  </div>

                  <!-- Prevalence Badge and Details Button -->
                  <div class="flex items-center gap-3 text-right">
                    <div class="rounded-lg border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
                      <div class="text-xs font-medium text-white">
                        شیوع
                      </div>
                      <div class="text-sm font-bold text-white">
                        {{ disorder.prevalence }}
                      </div>
                    </div>

                    <!-- Details Button -->
                    <button
                      class="group rounded-lg border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-white/50 hover:bg-white/30"
                      title="اطلاعات تشخیصی تفصیلی"
                      @click.stop="viewDisorderDetails(disorder)"
                    >
                      <div class="flex items-center gap-2">
                        <Icon name="ph:info-fill" class="size-4 text-white" />
                        <span class="hidden text-xs font-medium text-white sm:inline">جزئیات</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Disorder Details (Expandable) -->
            <Transition
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-screen"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-screen"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="expandedItems.has(index)" class="from-muted-25 dark:from-muted-800/50 dark:to-muted-700 bg-gradient-to-b to-white">
                <div class="space-y-6 p-8">
                  <!-- Description -->
                  <div>
                    <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                      توضیحات
                    </h4>
                    <p class="text-muted-600 dark:text-muted-400 leading-relaxed">
                      {{ disorder.description }}
                    </p>
                  </div>

                  <!-- Key Features Grid -->
                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Age of Onset -->
                    <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div class="mb-2 flex items-center gap-2">
                        <Icon name="ph:calendar" class="size-5 text-blue-600 dark:text-blue-400" />
                        <h5 class="font-semibold text-blue-800 dark:text-blue-300">
                          سن شروع
                        </h5>
                      </div>
                      <p class="text-sm text-blue-700 dark:text-blue-300">
                        {{ disorder.ageOfOnset }}
                      </p>
                    </div>

                    <!-- Course -->
                    <div class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <div class="mb-2 flex items-center gap-2">
                        <Icon name="ph:trend-up" class="size-5 text-green-600 dark:text-green-400" />
                        <h5 class="font-semibold text-green-800 dark:text-green-300">
                          سیر اختلال
                        </h5>
                      </div>
                      <p class="text-sm text-green-700 dark:text-green-300">
                        {{ disorder.course }}
                      </p>
                    </div>
                  </div>

                  <!-- Core Symptoms -->
                  <div v-if="disorder.coreSymptoms">
                    <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                      علائم اصلی
                    </h4>
                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div
                        v-for="symptom in disorder.coreSymptoms"
                        :key="symptom"
                        class="rounded-lg border-r-4 border-purple-500 bg-purple-50 p-3 dark:bg-purple-900/20"
                      >
                        <p class="text-sm text-purple-700 dark:text-purple-300">
                          {{ symptom }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Associated Features -->
                  <div v-if="disorder.associatedFeatures">
                    <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                      ویژگی‌های همراه
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="feature in disorder.associatedFeatures"
                        :key="feature"
                        class="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      >
                        {{ feature }}
                      </span>
                    </div>
                  </div>

                  <!-- Treatment Approaches -->
                  <div v-if="disorder.treatmentApproaches">
                    <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                      رویکردهای درمانی
                    </h4>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div
                        v-for="treatment in disorder.treatmentApproaches"
                        :key="treatment"
                        class="rounded-lg bg-teal-50 p-4 text-center dark:bg-teal-900/20"
                      >
                        <Icon name="ph:heart-fill" class="mx-auto mb-2 size-6 text-teal-600 dark:text-teal-400" />
                        <p class="text-sm font-medium text-teal-700 dark:text-teal-300">
                          {{ treatment }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Additional Resources -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-6 text-center">
          <Icon name="ph:books" class="text-primary-500 mx-auto mb-4 size-12" />
          <h2 class="text-muted-800 mb-2 text-2xl font-bold dark:text-white">
            منابع مفید
          </h2>
          <p class="text-muted-600 dark:text-muted-400">
            اطلاعات بیشتر و منابع تخصصی
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            v-for="resource in categoryData.resources"
            :key="resource.title"
            :class="`bg-gradient-to-br from-${resource.color}-50 to-${resource.color}-100 dark:from-${resource.color}-900/20 dark:to-${resource.color}-800/20 p-6 rounded-xl border border-${resource.color}-200 dark:border-${resource.color}-800`"
          >
            <Icon :name="resource.icon" :class="`size-8 text-${resource.color}-600 dark:text-${resource.color}-400 mb-3`" />
            <h4 :class="`font-semibold text-${resource.color}-800 dark:text-${resource.color}-300 mb-2`">
              {{ resource.title }}
            </h4>
            <p :class="`text-sm text-${resource.color}-700 dark:text-${resource.color}-300`">
              {{ resource.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'اختلالات نوروتکاملی - DSM-5 | ذهنا',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'اختلالات نوروتکاملی - DSM-5 | ذهنا',
  meta: [
    {
      name: 'description',
      content: 'راهنمای کامل اختلالات نوروتکاملی بر اساس DSM-5. شامل تمام اختلالات این دسته‌بندی از اوتیسم تا ADHD و اختلالات یادگیری با معیارهای تشخیصی دقیق.',
    },
    {
      name: 'keywords',
      content: 'اختلالات نوروتکاملی, اوتیسم, ADHD, اختلالات یادگیری, DSM-5, تشخیص کودکان, رشد عصبی',
    },
  ],
})

// State
const expandedItems = ref(new Set())

// Category Information
const categoryData = {
  code: 'Neurodevelopmental Disorders',
  titleFa: 'اختلالات نوروتکاملی',
  titleEn: 'Neurodevelopmental Disorders',
  icon: 'ph:brain-fill',
  description: 'اختلالاتی که معمولاً در دوران کودکی شروع می‌شوند و بر رشد و عملکرد سیستم عصبی مرکزی تأثیر می‌گذارند. این اختلالات اغلب با کمبودهایی در عملکرد شخصی، اجتماعی، تحصیلی یا شغلی همراه هستند.',
  stats: {
    count: 25,
    onsetPeriod: 'کودکی',
    prevalence: '3-15%',
  },
  keyFeatures: [
    'شروع در دوران رشد',
    'تأثیر بر عملکرد روزانه',
    'ماهیت مزمن',
    'نیاز به مداخله تخصصی',
  ],
  impactAreas: [
    { icon: 'ph:brain', text: 'عملکردهای اجرایی', color: 'blue' },
    { icon: 'ph:chat-circle', text: 'زبان و ارتباطات', color: 'green' },
    { icon: 'ph:graduation-cap', text: 'یادگیری تحصیلی', color: 'purple' },
    { icon: 'ph:users', text: 'مهارت‌های اجتماعی', color: 'orange' },
  ],
  overview: {
    title: 'درباره اختلالات نوروتکاملی',
    description: 'مجموعه‌ای از شرایط هستند که در دوران تکامل (معمولاً قبل از ورود به مدرسه) آغاز می‌شوند و با کاهش یا تأخیر در عملکرد شخصی، اجتماعی، تحصیلی یا شغلی مشخص می‌شوند.',
  },
  resources: [
    {
      icon: 'ph:book-open',
      title: 'راهنمای DSM-5',
      description: 'مرجع اصلی تشخیص اختلالات نوروتکاملی',
      color: 'blue',
    },
    {
      icon: 'ph:users',
      title: 'انجمن‌های تخصصی',
      description: 'سازمان‌های حمایت از خانواده‌ها',
      color: 'emerald',
    },
    {
      icon: 'ph:graduation-cap',
      title: 'آموزش و پژوهش',
      description: 'آخرین یافته‌های علمی و روش‌های درمان',
      color: 'purple',
    },
  ],
}

// Complete list of Neurodevelopmental Disorders from DSM-5
const disorders = [
  {
    code: '315.8 (F88)',
    titleFa: 'اختلال تکاملی عمومی',
    titleEn: 'Global Developmental Delay',
    prevalence: '1-3%',
    ageOfOnset: 'قبل از 5 سالگی',
    course: 'معمولاً بهبود یافته با مداخله زودهنگام',
    description: 'تأخیر قابل توجه در دو یا بیشتر از حیطه‌های تکاملی شامل عملکرد شناختی، زبان، مهارت‌های حرکتی، یا عملکرد تطبیقی در کودکان زیر 5 سال.',
    coreSymptoms: [
      'تأخیر در نقاط عطف تکاملی',
      'کندی در یادگیری مهارت‌های جدید',
      'مشکل در عملکردهای روزانه',
      'نیاز به حمایت در فعالیت‌های مختلف',
    ],
    associatedFeatures: ['مشکلات حسی', 'اختلالات خواب', 'مسائل رفتاری'],
    treatmentApproaches: ['درمان زودهنگام', 'کاردرمانی', 'گفتاردرمانی'],
  },
  {
    code: '319 (F79)',
    titleFa: 'معلولیت ذهنی غیرمشخص',
    titleEn: 'Unspecified Intellectual Disability',
    prevalence: '1%',
    ageOfOnset: 'دوران تکاملی',
    course: 'مزمن، اما قابل بهبود با حمایت',
    description: 'کاهش قابل توجه در عملکرد ذهنی و تطبیقی که در دوران تکاملی آغاز می‌شود، اما اطلاعات کافی برای تعیین شدت وجود ندارد.',
    coreSymptoms: [
      'کاهش عملکرد ذهنی',
      'محدودیت در مهارت‌های تطبیقی',
      'شروع در دوران تکاملی',
      'تأثیر بر عملکرد روزانه',
    ],
    associatedFeatures: ['مشکلات ارتباطی', 'نیاز به حمایت', 'چالش‌های اجتماعی'],
    treatmentApproaches: ['برنامه‌های آموزشی', 'مهارت‌های زندگی', 'حمایت خانوادگی'],
  },
  {
    code: '317 (F70)',
    titleFa: 'معلولیت ذهنی خفیف',
    titleEn: 'Mild Intellectual Disability',
    prevalence: '0.7%',
    ageOfOnset: 'دوران تکاملی',
    course: 'با حمایت، قابلیت زندگی مستقل',
    description: 'کاهش خفیف در عملکرد ذهنی و تطبیقی. افراد معمولاً قادر به یادگیری مهارت‌های تحصیلی تا سطح کلاس ششم هستند.',
    coreSymptoms: [
      'IQ بین 50-70',
      'کندی در یادگیری تحصیلی',
      'مهارت‌های اجتماعی محدود',
      'نیاز به راهنمایی در تصمیمات پیچیده',
    ],
    associatedFeatures: ['قابلیت اشتغال', 'روابط اجتماعی', 'زندگی نیمه مستقل'],
    treatmentApproaches: ['آموزش تخصصی', 'مهارت‌های شغلی', 'حمایت اجتماعی'],
  },
  {
    code: '318.0 (F71)',
    titleFa: 'معلولیت ذهنی متوسط',
    titleEn: 'Moderate Intellectual Disability',
    prevalence: '0.1%',
    ageOfOnset: 'دوران تکاملی',
    course: 'نیاز به حمایت مداوم',
    description: 'کاهش متوسط در عملکرد ذهنی و تطبیقی. افراد قادر به یادگیری مهارت‌های پایه و انجام کارهای ساده تحت نظارت هستند.',
    coreSymptoms: [
      'IQ بین 35-50',
      'مهارت‌های تحصیلی محدود',
      'نیاز به نظارت در فعالیت‌های روزانه',
      'قابلیت ارتباط ساده',
    ],
    associatedFeatures: ['مشکلات حرکتی', 'نیاز به حمایت', 'کارهای محافظت شده'],
    treatmentApproaches: ['آموزش مهارت‌های زندگی', 'کاردرمانی', 'حمایت خانوادگی'],
  },
  {
    code: '318.1 (F72)',
    titleFa: 'معلولیت ذهنی شدید',
    titleEn: 'Severe Intellectual Disability',
    prevalence: '0.05%',
    ageOfOnset: 'دوران تکاملی',
    course: 'نیاز به حمایت گسترده',
    description: 'کاهش شدید در عملکرد ذهنی و تطبیقی. افراد نیاز به حمایت مداوم در اکثر فعالیت‌های روزانه دارند.',
    coreSymptoms: [
      'IQ بین 20-35',
      'مهارت‌های زبانی بسیار محدود',
      'وابستگی در فعالیت‌های روزانه',
      'نیاز به نظارت مداوم',
    ],
    associatedFeatures: ['مشکلات پزشکی', 'نیاز به مراقبت', 'محدودیت‌های حرکتی'],
    treatmentApproaches: ['مراقبت پزشکی', 'فیزیوتراپی', 'حمایت خانوادگی'],
  },
  {
    code: '318.2 (F73)',
    titleFa: 'معلولیت ذهنی عمیق',
    titleEn: 'Profound Intellectual Disability',
    prevalence: '0.02%',
    ageOfOnset: 'دوران تکاملی',
    course: 'نیاز به مراقبت کامل',
    description: 'کاهش بسیار شدید در عملکرد ذهنی و تطبیقی. افراد نیاز به مراقبت و حمایت کامل در تمام جنبه‌های زندگی دارند.',
    coreSymptoms: [
      'IQ زیر 20',
      'عدم توانایی زبانی',
      'وابستگی کامل',
      'نیاز به مراقبت 24 ساعته',
    ],
    associatedFeatures: ['مشکلات پزشکی پیچیده', 'معلولیت‌های جسمی', 'نیاز به تجهیزات ویژه'],
    treatmentApproaches: ['مراقبت پزشکی تخصصی', 'فیزیوتراپی', 'حمایت خانوادگی'],
  },
  {
    code: '315.8 (F88)',
    titleFa: 'اختلال ارتباطی غیرمشخص',
    titleEn: 'Unspecified Communication Disorder',
    prevalence: '5-7%',
    ageOfOnset: 'دوران کودکی',
    course: 'متغیر، اغلب قابل بهبود',
    description: 'مشکلات در ارتباط که معیارهای اختلالات ارتباطی خاص را برآورده نمی‌کند اما باعث اختلال قابل توجه در عملکرد می‌شود.',
    coreSymptoms: [
      'مشکل در ارتباط کلامی',
      'محدودیت در استفاده از زبان',
      'تأثیر بر روابط اجتماعی',
      'اختلال در عملکرد تحصیلی',
    ],
    associatedFeatures: ['اضطراب اجتماعی', 'مشکلات تحصیلی', 'انزوا'],
    treatmentApproaches: ['گفتاردرمانی', 'درمان رفتاری', 'آموزش اجتماعی'],
  },
  {
    code: '315.39 (F80.9)',
    titleFa: 'اختلال زبان',
    titleEn: 'Language Disorder',
    prevalence: '7.4%',
    ageOfOnset: 'دوران کودکی',
    course: 'بهبود با مداخله زودهنگام',
    description: 'کاهش مداوم در کسب و استفاده از زبان در تمام روش‌های ارتباطی (کلامی، نوشتاری، اشاره‌ای) به دلیل کمبود در درک یا تولید.',
    coreSymptoms: [
      'واژگان محدود',
      'ساختار جملات ناقص',
      'مشکل در درک زبان',
      'استفاده نامناسب از زبان',
    ],
    associatedFeatures: ['مشکلات خواندن', 'اختلالات یادگیری', 'مسائل اجتماعی'],
    treatmentApproaches: ['گفتاردرمانی', 'آموزش زبان', 'درمان خانوادگی'],
  },
  {
    code: '315.35 (F80.0)',
    titleFa: 'اختلال صدا و گفتار',
    titleEn: 'Speech Sound Disorder',
    prevalence: '8-9%',
    ageOfOnset: 'دوران کودکی',
    course: 'معمولاً بهبود می‌یابد',
    description: 'مشکلات مداوم در تولید صداهای گفتار که با درک و وضوح گفتار تداخل کرده و ارتباط کلامی را محدود می‌کند.',
    coreSymptoms: [
      'تلفظ نادرست صداها',
      'حذف یا جایگزینی صداها',
      'گفتار نامفهوم',
      'تأثیر بر ارتباط',
    ],
    associatedFeatures: ['خجالت در صحبت', 'اجتناب از ارتباط', 'مشکلات اجتماعی'],
    treatmentApproaches: ['گفتاردرمانی', 'تمرین تلفظ', 'درمان خانوادگی'],
  },
  {
    code: '315.35 (F98.5)',
    titleFa: 'اختلال روانی گفتار (لکنت)',
    titleEn: 'Childhood-Onset Fluency Disorder (Stuttering)',
    prevalence: '1%',
    ageOfOnset: '2-7 سالگی',
    course: 'ممکن است ادامه یابد یا بهبود یابد',
    description: 'اختلالاتی در روان بودن و الگوی زمانی طبیعی گفتار که برای سن فرد و مهارت‌های زبانی نامناسب است.',
    coreSymptoms: [
      'تکرار صداها یا هجاها',
      'کشیدن صداها',
      'توقف‌های غیرطبیعی',
      'تنش در هنگام صحبت',
    ],
    associatedFeatures: ['اضطراب گفتاری', 'اجتناب از صحبت', 'حرکات همراه'],
    treatmentApproaches: ['گفتاردرمانی تخصصی', 'تکنیک‌های آرامش', 'درمان خانوادگی'],
  },
  {
    code: '315.39 (F80.89)',
    titleFa: 'اختلال ارتباط اجتماعی (عملکردی)',
    titleEn: 'Social (Pragmatic) Communication Disorder',
    prevalence: 'نامشخص',
    ageOfOnset: 'دوران رشد',
    course: 'مزمن، قابل بهبود با درمان',
    description: 'کمبودهای مداوم در استفاده اجتماعی از ارتباطات کلامی و غیرکلامی که منجر به محدودیت‌های عملکردی می‌شود.',
    coreSymptoms: [
      'استفاده نامناسب از ارتباط',
      'عدم درک قوانین مکالمه',
      'مشکل در تطبیق با زمینه',
      'محدودیت در روابط اجتماعی',
    ],
    associatedFeatures: ['مشکلات تحصیلی', 'انزوای اجتماعی', 'سوء تفاهم‌های مکرر'],
    treatmentApproaches: ['آموزش مهارت‌های اجتماعی', 'گفتاردرمانی', 'درمان گروهی'],
  },
  {
    code: '299.00 (F84.0)',
    titleFa: 'اختلال طیف اوتیسم',
    titleEn: 'Autism Spectrum Disorder',
    prevalence: '1-2%',
    ageOfOnset: 'دوران کودکی',
    course: 'مزمن، بهبود با مداخله زودهنگام',
    description: 'کمبودهای مداوم در ارتباطات و تعامل اجتماعی در زمینه‌های متعدد، همراه با الگوهای محدود، تکراری رفتار، علایق یا فعالیت‌ها.',
    coreSymptoms: [
      'کمبودهای ارتباط اجتماعی',
      'رفتارهای تکراری',
      'علایق محدود',
      'حساسیت‌های حسی',
    ],
    associatedFeatures: ['مقاومت در برابر تغییر', 'نیازهای ویژه', 'استعدادهای خاص'],
    treatmentApproaches: ['تحلیل رفتار کاربردی', 'گفتاردرمانی', 'کاردرمانی'],
  },
  {
    code: '314.01 (F90.2)',
    titleFa: 'اختلال کمبود توجه/فزون‌کنشی - نوع ترکیبی',
    titleEn: 'ADHD, Combined Presentation',
    prevalence: '7%',
    ageOfOnset: 'قبل از 12 سالگی',
    course: 'اغلب تا بزرگسالی ادامه می‌یابد',
    description: 'الگویی مداوم از کمبود توجه و/یا فزون‌کنشی-تکانشگری که با عملکرد یا رشد تداخل کرده یا آن را مختل می‌کند.',
    coreSymptoms: [
      'کمبود توجه',
      'فزون‌کنشی',
      'تکانشگری',
      'مشکل در تمرکز',
    ],
    associatedFeatures: ['مشکلات تحصیلی', 'روابط اجتماعی مشکل‌دار', 'عزت نفس پایین'],
    treatmentApproaches: ['دارودرمانی', 'درمان رفتاری', 'آموزش والدین'],
  },
  {
    code: '314.00 (F90.0)',
    titleFa: 'اختلال کمبود توجه/فزون‌کنشی - نوع غالباً غافل',
    titleEn: 'ADHD, Predominantly Inattentive Presentation',
    prevalence: '3%',
    ageOfOnset: 'قبل از 12 سالگی',
    course: 'ممکن است با سن بهبود یابد',
    description: 'الگوی غالب کمبود توجه بدون فزون‌کنشی-تکانشگری قابل توجه.',
    coreSymptoms: [
      'کمبود توجه شدید',
      'فراموشکاری',
      'مشکل در سازماندهی',
      'اجتناب از کارهای ذهنی',
    ],
    associatedFeatures: ['آهسته‌کاری', 'رویاپردازی', 'مشکلات تحصیلی'],
    treatmentApproaches: ['استراتژی‌های سازماندهی', 'دارودرمانی', 'آموزش مهارت‌های مطالعه'],
  },
  {
    code: '314.01 (F90.1)',
    titleFa: 'اختلال کمبود توجه/فزون‌کنشی - نوع غالباً فزون‌کنش/تکانشی',
    titleEn: 'ADHD, Predominantly Hyperactive/Impulsive Presentation',
    prevalence: '1%',
    ageOfOnset: 'قبل از 12 سالگی',
    course: 'ممکن است با سن بهبود یابد',
    description: 'الگوی غالب فزون‌کنشی-تکانشگری بدون کمبود توجه قابل توجه.',
    coreSymptoms: [
      'فزون‌کنشی شدید',
      'تکانشگری',
      'بی‌قراری',
      'مشکل در انتظار',
    ],
    associatedFeatures: ['رفتار پرخطر', 'مشکلات اجتماعی', 'تصادفات بیشتر'],
    treatmentApproaches: ['درمان رفتاری', 'دارودرمانی', 'آموزش خودکنترلی'],
  },
  {
    code: '314.01 (F90.9)',
    titleFa: 'اختلال کمبود توجه/فزون‌کنشی غیرمشخص',
    titleEn: 'Other Specified ADHD',
    prevalence: 'متغیر',
    ageOfOnset: 'قبل از 12 سالگی',
    course: 'متغیر',
    description: 'علائم ADHD که معیارهای کامل را برآورده نمی‌کند اما باعث اختلال قابل توجه می‌شود.',
    coreSymptoms: [
      'برخی علائم ADHD',
      'اختلال عملکردی',
      'شروع دیرهنگام',
      'علائم زیر آستانه',
    ],
    associatedFeatures: ['مشکلات خفیف', 'عملکرد نسبتاً خوب', 'نیاز به حمایت محدود'],
    treatmentApproaches: ['مداخلات رفتاری', 'استراتژی‌های مقابله‌ای', 'حمایت تحصیلی'],
  },
  {
    code: '315.00 (F81.0)',
    titleFa: 'اختلال خواندن خاص',
    titleEn: 'Specific Learning Disorder with Impairment in Reading',
    prevalence: '4%',
    ageOfOnset: 'سن مدرسه',
    course: 'مزمن، بهبود با مداخله',
    description: 'مشکلات مداوم در یادگیری و استفاده از مهارت‌های تحصیلی، به‌طور خاص در خواندن کلمات، سرعت یا روانی خواندن، و درک مطلب.',
    coreSymptoms: [
      'خواندن آهسته و دشوار',
      'اشتباهات در خواندن',
      'مشکل در درک مطلب',
      'اجتناب از خواندن',
    ],
    associatedFeatures: ['اضطراب تحصیلی', 'عزت نفس پایین', 'مشکلات انگیزشی'],
    treatmentApproaches: ['آموزش خواندن تخصصی', 'روش‌های چندحسی', 'حمایت تحصیلی'],
  },
  {
    code: '315.2 (F81.81)',
    titleFa: 'اختلال نوشتن خاص',
    titleEn: 'Specific Learning Disorder with Impairment in Written Expression',
    prevalence: '2%',
    ageOfOnset: 'سن مدرسه',
    course: 'بهبود با آموزش تخصصی',
    description: 'مشکلات در مهارت‌های نوشتاری شامل دقت املا، دستور زبان و علائم نگارشی، و وضوح یا سازماندهی بیان کتبی.',
    coreSymptoms: [
      'اشتباهات املایی فراوان',
      'دستور زبان ضعیف',
      'نوشتار نامنظم',
      'سازماندهی ضعیف متن',
    ],
    associatedFeatures: ['کندنویسی', 'اجتناب از نوشتن', 'خستگی در نوشتن'],
    treatmentApproaches: ['آموزش نوشتن تخصصی', 'تکنولوژی کمکی', 'تمرین مهارت‌های حرکتی'],
  },
  {
    code: '315.1 (F81.2)',
    titleFa: 'اختلال ریاضی خاص',
    titleEn: 'Specific Learning Disorder with Impairment in Mathematics',
    prevalence: '3%',
    ageOfOnset: 'سن مدرسه',
    course: 'مزمن، بهبود با آموزش',
    description: 'مشکلات در پردازش اطلاعات عددی، یادگیری حقایق حسابی، و انجام محاسبات دقیق یا روان.',
    coreSymptoms: [
      'مشکل با مفاهیم عددی',
      'محاسبات آهسته',
      'اشتباهات حسابی',
      'مشکل در حل مسئله',
    ],
    associatedFeatures: ['اضطراب ریاضی', 'اجتناب از ریاضی', 'عزت نفس پایین'],
    treatmentApproaches: ['آموزش ریاضی تخصصی', 'ابزارهای کمکی', 'روش‌های بصری'],
  },
  {
    code: '315.4 (F82)',
    titleFa: 'اختلال هماهنگی رشدی',
    titleEn: 'Developmental Coordination Disorder',
    prevalence: '5-6%',
    ageOfOnset: 'دوران کودکی',
    course: 'ممکن است تا بزرگسالی ادامه یابد',
    description: 'کسب و اجرای مهارت‌های حرکتی هماهنگ شده به‌طور قابل توجهی زیر انتظار برای سن تقویمی فرد است.',
    coreSymptoms: [
      'مهارت‌های حرکتی ضعیف',
      'کندی در انجام کارها',
      'مشکل در ورزش',
      'دست‌خط ضعیف',
    ],
    associatedFeatures: ['خودباوری پایین', 'اجتناب از فعالیت‌های حرکتی', 'مشکلات اجتماعی'],
    treatmentApproaches: ['فیزیوتراپی', 'کاردرمانی', 'تمرین مهارت‌های حرکتی'],
  },
  {
    code: '307.3 (F98.4)',
    titleFa: 'اختلال حرکات کلیشه‌ای',
    titleEn: 'Stereotypic Movement Disorder',
    prevalence: '4-16%',
    ageOfOnset: 'دوران کودکی',
    course: 'ممکن است با سن کاهش یابد',
    description: 'رفتار حرکتی تکراری، ظاهراً بدون هدف که به‌طور قابل توجهی با فعالیت‌های اجتماعی، تحصیلی یا سایر فعالیت‌ها تداخل می‌کند.',
    coreSymptoms: [
      'حرکات تکراری',
      'خودآسیبی (در برخی موارد)',
      'تداخل با فعالیت‌ها',
      'شروع در دوران کودکی',
    ],
    associatedFeatures: ['معلولیت ذهنی', 'اختلالات نوروتکاملی', 'استرس'],
    treatmentApproaches: ['تحلیل رفتار', 'محیط‌سازی', 'دارودرمانی در موارد شدید'],
  },
  {
    code: '307.59 (F95.9)',
    titleFa: 'اختلال تیک غیرمشخص',
    titleEn: 'Unspecified Tic Disorder',
    prevalence: '1%',
    ageOfOnset: 'قبل از 18 سالگی',
    course: 'متغیر',
    description: 'علائم اختلال تیک که معیارهای کامل هیچ‌یک از اختلالات تیک خاص را برآورده نمی‌کند.',
    coreSymptoms: [
      'حرکات یا صداهای ناخودآگاه',
      'ماهیت تکراری',
      'کنترل محدود',
      'متغیر بودن شدت',
    ],
    associatedFeatures: ['استرس', 'خستگی', 'مشکلات اجتماعی'],
    treatmentApproaches: ['آموزش کنترل', 'درمان رفتاری', 'دارودرمانی'],
  },
  {
    code: '315.8 (F88)',
    titleFa: 'اختلال نوروتکاملی دیگر مشخص',
    titleEn: 'Other Specified Neurodevelopmental Disorder',
    prevalence: 'متغیر',
    ageOfOnset: 'دوران تکاملی',
    course: 'متغیر',
    description: 'علائم نوروتکاملی که باعث اختلال قابل توجه می‌شود اما معیارهای کامل هیچ‌یک از اختلالات خاص را ندارد.',
    coreSymptoms: [
      'علائم نوروتکاملی',
      'اختلال عملکردی',
      'شروع در دوران رشد',
      'عدم تطابق با معیارهای خاص',
    ],
    associatedFeatures: ['نیازهای ویژه', 'چالش‌های تحصیلی', 'مسائل اجتماعی'],
    treatmentApproaches: ['درمان فردی', 'حمایت خانوادگی', 'مداخلات آموزشی'],
  },
  {
    code: '315.9 (F89)',
    titleFa: 'اختلال نوروتکاملی غیرمشخص',
    titleEn: 'Unspecified Neurodevelopmental Disorder',
    prevalence: 'متغیر',
    ageOfOnset: 'دوران تکاملی',
    course: 'متغیر',
    description: 'علائم نوروتکاملی که اطلاعات کافی برای تشخیص دقیق‌تر وجود ندارد.',
    coreSymptoms: [
      'علائم مبهم نوروتکاملی',
      'نیاز به ارزیابی بیشتر',
      'اختلال عملکردی',
      'اطلاعات ناکافی',
    ],
    associatedFeatures: ['نیاز به بررسی', 'علائم اولیه', 'مشکلات شناسایی‌نشده'],
    treatmentApproaches: ['ارزیابی جامع', 'مداخله موقت', 'مانیتورینگ'],
  },
]

// Helper functions
const toggleDisorder = (index: number) => {
  if (expandedItems.value.has(index)) {
    expandedItems.value.delete(index)
  }
  else {
    expandedItems.value.add(index)
  }
}

const viewDisorderDetails = (disorder: any) => {
  const router = useRouter()

  // Navigate to specific disorder detail pages where available
  const disorderRoutes = {
    'اختلال تکاملی عمومی': '/diagnosis/global-developmental-delay',
    // Add more specific disorder pages as they are created
    // 'اختلال طیف اوتیسم': '/diagnosis/autism-spectrum-disorder',
    // 'ADHD - نوع ترکیبی': '/diagnosis/adhd-combined',
    // etc.
  }

  const route = disorderRoutes[disorder.titleFa]
  if (route) {
    // Navigate to dedicated disorder page
    router.push(route)
  }
  else {
    // For disorders without dedicated pages yet, show detailed information
    console.log('Viewing detailed information for:', disorder.titleFa)
    alert(`جزئیات ${disorder.titleFa}:\n\nکد DSM-5: ${disorder.code}\nشیوع: ${disorder.prevalence}\nسن شروع: ${disorder.ageOfOnset}\n\nبرای اطلاعات تشخیصی کامل، لطفاً با متخصص مشورت کنید.\n\nصفحه تخصصی این اختلال به زودی اضافه خواهد شد.`)
  }
}

const getDisorderGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative',
    'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 relative',
    'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 relative',
    'bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 relative',
    'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 relative',
    'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 relative',
    'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 relative',
    'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 relative',
    'bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative',
    'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative',
  ]
  return gradients[index % gradients.length]
}
</script>

<style scoped>
/* Enhanced glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Enhanced shadow effects */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth max-height transitions */
.max-h-screen {
  max-height: 100vh;
}

.max-h-0 {
  max-height: 0;
  overflow: hidden;
}

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Custom hover effects */
.group:hover .group-hover\:-translate-x-1 {
  transform: translateX(-0.25rem);
}
</style>
