<template>
  <div class="dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
    <!-- Header Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.purple.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.indigo.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.violet.400) 0%, transparent 50%)" />
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
            <span class="text-primary-600 dark:text-primary-400 font-medium">طیف اسکیزوفرنی</span>
          </div>

          <!-- Theme Toggle -->
          <div class="flex items-center gap-3">
            <BaseThemeToggle />
          </div>
        </div>

        <!-- Main Header -->
        <div class="mb-12 text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
            <div class="relative rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3">
              <Icon name="ph:eye-fill" class="size-8 text-white" />
              <div class="absolute inset-0 animate-ping rounded-full bg-purple-400/30" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                DSM-5 Category
              </div>
              <div class="text-muted-800 text-lg font-bold dark:text-white">
                Schizophrenia Spectrum
              </div>
            </div>
          </div>

          <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
            طیف اسکیزوفرنی و سایر اختلالات روان‌پریشی
          </h1>

          <p class="text-muted-600 dark:text-muted-400 mx-auto mb-8 max-w-4xl text-lg leading-relaxed">
            اختلالاتی که با عوارض روان‌پریشانه مانند توهمات، هذیان‌ها، تفکر غیرمنظم، رفتار حرکتی غیرطبیعی، و علائم منفی مشخص می‌شوند.
          </p>

          <!-- Category Stats -->
          <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                <Icon name="ph:list-numbers" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-purple-600 dark:text-purple-400">
                {{ disorders.length }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                اختلال اصلی
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 p-3">
                <Icon name="ph:users" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                0.3-0.7%
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                شیوع کلی
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-violet-600 p-3">
                <Icon name="ph:trend-up" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-3xl font-bold text-violet-600 dark:text-violet-400">
                بلوغ
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                دوران شروع
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
            <Icon name="ph:info" class="mx-auto mb-4 size-12 text-purple-500" />
            <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
              درباره طیف اسکیزوفرنی
            </h2>
          </div>

          <div class="prose prose-lg prose-muted dark:prose-invert max-w-none text-right leading-relaxed">
            <p class="text-muted-600 dark:text-muted-400 mb-6">
              <strong class="text-muted-800 dark:text-white">طیف اسکیزوفرنی و سایر اختلالات روان‌پریشی</strong>
              شامل اختلالاتی است که با پنج حیطه کلیدی علائم مشخص می‌شوند: توهمات، هذیان‌ها، تفکر غیرمنظم،
              رفتار حرکتی غیرطبیعی و علائم منفی.
            </p>

            <div class="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                  علائم مثبت:
                </h4>
                <ul class="space-y-2">
                  <li class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5 shrink-0" />
                    <span class="text-muted-600 dark:text-muted-400">توهمات</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5 shrink-0" />
                    <span class="text-muted-600 dark:text-muted-400">هذیان‌ها</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5 shrink-0" />
                    <span class="text-muted-600 dark:text-muted-400">تفکر غیرمنظم</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5 shrink-0" />
                    <span class="text-muted-600 dark:text-muted-400">رفتار غیرطبیعی</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-muted-800 mb-3 text-lg font-semibold dark:text-white">
                  علائم منفی:
                </h4>
                <ul class="space-y-2">
                  <li class="flex items-start gap-2">
                    <Icon name="ph:minus-circle" class="mt-0.5 size-5 shrink-0 text-orange-500" />
                    <span class="text-muted-600 dark:text-muted-400">کاهش بیان عاطفی</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:minus-circle" class="mt-0.5 size-5 shrink-0 text-orange-500" />
                    <span class="text-muted-600 dark:text-muted-400">بی‌انگیزگی</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:minus-circle" class="mt-0.5 size-5 shrink-0 text-orange-500" />
                    <span class="text-muted-600 dark:text-muted-400">کاهش گفتار</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:minus-circle" class="mt-0.5 size-5 shrink-0 text-orange-500" />
                    <span class="text-muted-600 dark:text-muted-400">انزوای اجتماعی</span>
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
            در ادامه، فهرست کاملی از اختلالات طیف اسکیزوفرنی بر اساس DSM-5 ارائه شده است.
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
                    <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                      <div class="mb-2 flex items-center gap-2">
                        <Icon name="ph:calendar" class="size-5 text-purple-600 dark:text-purple-400" />
                        <h5 class="font-semibold text-purple-800 dark:text-purple-300">
                          سن شروع
                        </h5>
                      </div>
                      <p class="text-sm text-purple-700 dark:text-purple-300">
                        {{ disorder.ageOfOnset }}
                      </p>
                    </div>

                    <!-- Course -->
                    <div class="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                      <div class="mb-2 flex items-center gap-2">
                        <Icon name="ph:trend-up" class="size-5 text-indigo-600 dark:text-indigo-400" />
                        <h5 class="font-semibold text-indigo-800 dark:text-indigo-300">
                          سیر اختلال
                        </h5>
                      </div>
                      <p class="text-sm text-indigo-700 dark:text-indigo-300">
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
                        class="rounded-lg border-r-4 border-violet-500 bg-violet-50 p-3 dark:bg-violet-900/20"
                      >
                        <p class="text-sm text-violet-700 dark:text-violet-300">
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
                        class="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
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
                        class="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20"
                      >
                        <Icon name="ph:heart-fill" class="mx-auto mb-2 size-6 text-emerald-600 dark:text-emerald-400" />
                        <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">
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
          <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20">
            <Icon name="ph:book-open" class="mb-3 size-8 text-purple-600 dark:text-purple-400" />
            <h4 class="mb-2 font-semibold text-purple-800 dark:text-purple-300">
              راهنمای DSM-5
            </h4>
            <p class="text-sm text-purple-700 dark:text-purple-300">
              مرجع اصلی تشخیص اختلالات طیف اسکیزوفرنی
            </p>
          </div>

          <div class="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-indigo-800/20">
            <Icon name="ph:pill" class="mb-3 size-8 text-indigo-600 dark:text-indigo-400" />
            <h4 class="mb-2 font-semibold text-indigo-800 dark:text-indigo-300">
              درمان دارویی
            </h4>
            <p class="text-sm text-indigo-700 dark:text-indigo-300">
              آنتی‌سایکوتیک‌ها و داروهای ضدروان‌پریشی
            </p>
          </div>

          <div class="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 p-6 dark:border-violet-800 dark:from-violet-900/20 dark:to-violet-800/20">
            <Icon name="ph:users" class="mb-3 size-8 text-violet-600 dark:text-violet-400" />
            <h4 class="mb-2 font-semibold text-violet-800 dark:text-violet-300">
              حمایت خانوادگی
            </h4>
            <p class="text-sm text-violet-700 dark:text-violet-300">
              آموزش و حمایت از خانواده‌های بیماران
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'default',
  title: 'طیف اسکیزوفرنی - DSM-5 | ذهنا',
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'طیف اسکیزوفرنی - DSM-5 | ذهنا',
  meta: [
    {
      name: 'description',
      content: 'راهنمای کامل اختلالات طیف اسکیزوفرنی بر اساس DSM-5. شامل تمام اختلالات روان‌پریشی با معیارهای تشخیصی دقیق.',
    },
    {
      name: 'keywords',
      content: 'اسکیزوفرنی, اختلالات روان‌پریشی, توهمات, هذیان, DSM-5, تشخیص روانپزشکی',
    },
  ],
});

// State
const expandedItems = ref(new Set());

// Complete list of Schizophrenia Spectrum Disorders from DSM-5
const disorders = [
  {
    code: '301.22 (F21)',
    titleFa: 'اختلال شخصیت اسکیزوتایپال',
    titleEn: 'Schizotypal Personality Disorder',
    prevalence: '0.6%',
    ageOfOnset: 'اوایل بزرگسالی',
    course: 'مزمن و پایدار',
    description: 'الگویی فراگیر از کمبودهای اجتماعی و بین‌فردی که با کاهش ظرفیت روابط نزدیک، تحریفات شناختی یا ادراکی، و رفتار عجیب‌وغریب مشخص می‌شود.',
    coreSymptoms: [
      'افکار ارجاعی',
      'باورهای عجیب‌وغریب',
      'تجارب ادراکی غیرعادی',
      'تفکر و گفتار عجیب',
    ],
    associatedFeatures: ['انزوای اجتماعی', 'اضطراب اجتماعی', 'سوء ظن'],
    treatmentApproaches: ['روان‌درمانی', 'دارودرمانی محدود', 'مهارت‌های اجتماعی'],
  },
  {
    code: '297.1 (F22)',
    titleFa: 'اختلال هذیانی',
    titleEn: 'Delusional Disorder',
    prevalence: '0.02%',
    ageOfOnset: 'میانسالی',
    course: 'مزمن اما عملکرد نسبتاً سالم',
    description: 'یک یا چند هذیان برای مدت یک ماه یا بیشتر، بدون اختلال قابل توجه در عملکرد و بدون سایر علائم مشخص اسکیزوفرنی.',
    coreSymptoms: [
      'هذیان‌های ثابت',
      'عدم وجود سایر علائم روان‌پریشی',
      'عملکرد نسبتاً طبیعی',
      'بصیرت محدود',
    ],
    associatedFeatures: ['خشم و تهاجم', 'مشکلات قانونی', 'ایزولاسیون اجتماعی'],
    treatmentApproaches: ['آنتی‌سایکوتیک‌ها', 'روان‌درمانی', 'مدیریت استرس'],
  },
  {
    code: '298.8 (F23)',
    titleFa: 'اختلال روان‌پریشی کوتاه',
    titleEn: 'Brief Psychotic Disorder',
    prevalence: '0.05%',
    ageOfOnset: 'اواخر نوجوانی تا بزرگسالی',
    course: 'کوتاه‌مدت، بهبودی کامل',
    description: 'شروع ناگهانی یک یا چند علامت روان‌پریشانه که حداقل یک روز اما کمتر از یک ماه ادامه می‌یابد و در نهایت بازگشت کامل به سطح عملکرد قبلی.',
    coreSymptoms: [
      'شروع ناگهانی',
      'توهمات یا هذیان‌ها',
      'تفکر غیرمنظم',
      'مدت کوتاه (کمتر از یک ماه)',
    ],
    associatedFeatures: ['استرس شدید', 'تغییرات خلقی', 'آشفتگی'],
    treatmentApproaches: ['آنتی‌سایکوتیک‌ها', 'بستری', 'حمایت روانی'],
  },
  {
    code: '295.40 (F20.81)',
    titleFa: 'اختلال اسکیزوفرنی‌شکل',
    titleEn: 'Schizophreniform Disorder',
    prevalence: '0.2%',
    ageOfOnset: 'اواخر نوجوانی تا بزرگسالی',
    course: 'متوسط‌مدت، احتمال بهبودی یا تبدیل به اسکیزوفرنی',
    description: 'علائم مشخصه اسکیزوفرنی که برای مدتی بین یک تا شش ماه ادامه می‌یابد.',
    coreSymptoms: [
      'علائم اسکیزوفرنی',
      'مدت ۱-۶ ماه',
      'اختلال عملکردی',
      'عدم وجود اختلال خلقی',
    ],
    associatedFeatures: ['کاهش عملکرد', 'ایزولاسیون اجتماعی', 'مشکلات شغلی'],
    treatmentApproaches: ['آنتی‌سایکوتیک‌ها', 'روان‌درمانی', 'بازتوانی'],
  },
  {
    code: '295.90 (F20.9)',
    titleFa: 'اسکیزوفرنی',
    titleEn: 'Schizophrenia',
    prevalence: '0.3-0.7%',
    ageOfOnset: 'اواخر نوجوانی تا اوایل بزرگسالی',
    course: 'مزمن، نیاز به درمان طولانی‌مدت',
    description: 'اختلالی مزمن که با علائم مثبت (توهمات، هذیان‌ها) و منفی (کاهش بیان عاطفی، بی‌انگیزگی) مشخص می‌شود.',
    coreSymptoms: [
      'توهمات',
      'هذیان‌ها',
      'تفکر غیرمنظم',
      'علائم منفی',
    ],
    associatedFeatures: ['اختلال شناختی', 'مشکلات عملکردی', 'مشکلات اجتماعی'],
    treatmentApproaches: ['آنتی‌سایکوتیک‌ها', 'روان‌درمانی', 'بازتوانی روانی-اجتماعی'],
  },
  {
    code: '295.70 (F25.9)',
    titleFa: 'اختلال اسکیزوعاطفی',
    titleEn: 'Schizoaffective Disorder',
    prevalence: '0.3%',
    ageOfOnset: 'اوایل بزرگسالی',
    course: 'مزمن با دوره‌های بهتری و بدتری',
    description: 'دوره‌ای از بیماری که در آن معیارهای اسکیزوفرنی و اختلال خلقی اساسی همزمان برآورده می‌شود.',
    coreSymptoms: [
      'علائم اسکیزوفرنی',
      'علائم خلقی',
      'توهمات بدون اختلال خلقی',
      'هذیان‌های مستقل از خلق',
    ],
    associatedFeatures: ['نوسانات خلقی', 'عملکرد متغیر', 'مشکلات روابط'],
    treatmentApproaches: ['آنتی‌سایکوتیک‌ها', 'تنظیم‌کننده‌های خلق', 'روان‌درمانی'],
  },
  {
    code: '293.81/293.82',
    titleFa: 'اختلال روان‌پریشی ناشی از مواد/داروها',
    titleEn: 'Substance/Medication-Induced Psychotic Disorder',
    prevalence: 'متغیر',
    ageOfOnset: 'متغیر بر اساس مواد',
    course: 'معمولاً موقت، بسته به ماده',
    description: 'توهمات یا هذیان‌هایی که در ارتباط مستقیم با اثرات مسمومیت یا ترک مواد یا داروها بروز می‌کند.',
    coreSymptoms: [
      'توهمات یا هذیان‌ها',
      'ارتباط با مواد/داروها',
      'عدم وجود قبل از مصرف',
      'بهبودی پس از قطع',
    ],
    associatedFeatures: ['مشکلات مصرف مواد', 'علائم ترک', 'تغییرات رفتاری'],
    treatmentApproaches: ['قطع ماده', 'آنتی‌سایکوتیک‌ها', 'درمان اعتیاد'],
  },
  {
    code: '293.81/293.82',
    titleFa: 'اختلال روان‌پریشی ناشی از حالت پزشکی',
    titleEn: 'Psychotic Disorder Due to Another Medical Condition',
    prevalence: 'متغیر',
    ageOfOnset: 'متغیر بر اساس بیماری',
    course: 'بسته به بیماری زمینه‌ای',
    description: 'توهمات یا هذیان‌هایی که اثر فیزیولوژیک مستقیم یک حالت پزشکی عمومی هستند.',
    coreSymptoms: [
      'توهمات یا هذیان‌ها',
      'ارتباط با بیماری پزشکی',
      'شواهد فیزیولوژیک',
      'عدم وجود قبل از بیماری',
    ],
    associatedFeatures: ['علائم عصبی', 'تغییرات شناختی', 'علائم جسمانی'],
    treatmentApproaches: ['درمان بیماری زمینه‌ای', 'آنتی‌سایکوتیک‌ها', 'مراقبت پزشکی'],
  },
  {
    code: '298.9 (F29)',
    titleFa: 'طیف اسکیزوفرنی و اختلال روان‌پریشی دیگر مشخص',
    titleEn: 'Other Specified Schizophrenia Spectrum and Other Psychotic Disorder',
    prevalence: 'متغیر',
    ageOfOnset: 'متغیر',
    course: 'متغیر',
    description: 'علائم روان‌پریشانه که باعث اختلال قابل توجه می‌شود اما معیارهای کامل هیچ‌یک از اختلالات خاص را ندارد.',
    coreSymptoms: [
      'علائم روان‌پریشانه',
      'اختلال عملکردی',
      'عدم تطابق کامل با معیارها',
      'نیاز به دقت تشخیصی',
    ],
    associatedFeatures: ['علائم متنوع', 'درجات مختلف شدت', 'پاسخ متغیر به درمان'],
    treatmentApproaches: ['درمان فردی', 'بر اساس علائم غالب', 'نظارت دقیق'],
  },
  {
    code: '298.9 (F29)',
    titleFa: 'طیف اسکیزوفرنی و اختلال روان‌پریشی غیرمشخص',
    titleEn: 'Unspecified Schizophrenia Spectrum and Other Psychotic Disorder',
    prevalence: 'متغیر',
    ageOfOnset: 'متغیر',
    course: 'نامشخص',
    description: 'علائم روان‌پریشانه که اطلاعات کافی برای تشخیص دقیق‌تر وجود ندارد.',
    coreSymptoms: [
      'علائم روان‌پریشانه',
      'اطلاعات ناکافی',
      'نیاز به ارزیابی بیشتر',
      'تأثیر بر عملکرد',
    ],
    associatedFeatures: ['عدم قطعیت تشخیصی', 'نیاز به پیگیری', 'علائم ابهام‌آمیز'],
    treatmentApproaches: ['ارزیابی جامع', 'درمان علامتی', 'نظارت مداوم'],
  },
];

// Helper functions
const toggleDisorder = (index: number) => {
  if (expandedItems.value.has(index)) {
    expandedItems.value.delete(index);
  }
  else {
    expandedItems.value.add(index);
  }
};

const viewDisorderDetails = (disorder: any) => {
  // For now, show detailed information in alert
  alert(`جزئیات ${disorder.titleFa}:\n\nکد DSM-5: ${disorder.code}\nشیوع: ${disorder.prevalence}\nسن شروع: ${disorder.ageOfOnset}\n\nبرای اطلاعات تشخیصی کامل، لطفاً با متخصص مشورت کنید.\n\nصفحه تخصصی این اختلال به زودی اضافه خواهد شد.`);
};

const getDisorderGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 relative',
    'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 relative',
    'bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 relative',
    'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 relative',
    'bg-gradient-to-br from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 relative',
    'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative',
    'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 relative',
    'bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600 relative',
    'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 relative',
    'bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-fuchsia-600 relative',
  ];
  return gradients[index % gradients.length];
};
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
