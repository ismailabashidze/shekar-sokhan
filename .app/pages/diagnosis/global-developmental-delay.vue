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
            <NuxtLink to="/diagnosis/neurodevelopmental-disorders" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              اختلالات نوروتکاملی
            </NuxtLink>
            <Icon name="ph:caret-left" class="size-3" />
            <span class="text-primary-600 dark:text-primary-400 font-medium">اختلال تکاملی عمومی</span>
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
              <Icon name="ph:brain-fill" class="size-8 text-white" />
              <div class="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                DSM-5 Code: 315.8 (F88)
              </div>
              <div class="text-muted-800 text-lg font-bold dark:text-white">
                Global Developmental Delay
              </div>
            </div>
          </div>

          <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
            اختلال تکاملی عمومی
          </h1>

          <p class="text-muted-600 dark:text-muted-400 mx-auto mb-8 max-w-4xl text-lg leading-relaxed">
            {{ disorderInfo.description }}
          </p>

          <!-- Key Stats -->
          <div class="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-4">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                <Icon name="ph:percent" class="size-6 text-white" />
              </div>
              <div class="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ disorderInfo.Prevalence }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                شیوع
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 p-3">
                <Icon name="ph:calendar" class="size-6 text-white" />
              </div>
              <div class="mb-1 text-xl font-bold text-green-600 dark:text-green-400">
                قبل از ۵ سال
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                سن شروع
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                <Icon name="ph:warning" class="size-6 text-white" />
              </div>
              <div class="mb-1 text-xl font-bold text-purple-600 dark:text-purple-400">
                {{ disorderInfo.suicideRisk }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                سطح خطر خودکشی
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-3">
                <Icon name="ph:trend-up" class="size-6 text-white" />
              </div>
              <div class="mb-1 text-lg font-bold text-orange-600 dark:text-orange-400">
                قابل بهبود
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                پیش‌آگهی
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto max-w-7xl px-4 pb-12">
      <!-- Overview Section -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mx-auto max-w-4xl">
          <div class="mb-8 text-center">
            <Icon name="ph:info" class="mx-auto mb-4 size-12 text-blue-500" />
            <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
              اطلاعات کلی
            </h2>
          </div>

          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- Development and Course -->
            <div class="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
              <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
                <Icon name="ph:chart-line" class="size-6" />
                رشد و سیر اختلال
              </h3>
              <p class="leading-relaxed text-blue-700 dark:text-blue-300">
                {{ disorderInfo.developmentAndCourse }}
              </p>
            </div>

            <!-- Special Note -->
            <div class="rounded-xl bg-amber-50 p-6 dark:bg-amber-900/20">
              <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-amber-800 dark:text-amber-300">
                <Icon name="ph:warning-circle" class="size-6" />
                نکته ویژه
              </h3>
              <p class="leading-relaxed text-amber-700 dark:text-amber-300">
                {{ disorderInfo.specialNote }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnostic Criteria -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:check-square" class="text-primary-500 mx-auto mb-4 size-12" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            معیارهای تشخیصی
          </h2>
          <div class="bg-primary-50 dark:bg-primary-900/20 mx-auto max-w-3xl rounded-xl p-4">
            <p class="text-primary-700 dark:text-primary-300 font-medium">
              {{ disorderInfo.minimumCriteria }}
            </p>
          </div>
        </div>

        <div class="space-y-8">
          <div
            v-for="criterion in disorderInfo.diagnosisCriteria"
            :key="criterion.alphabet"
            class="from-muted-50 dark:from-muted-800 dark:to-muted-700 border-primary-500 rounded-2xl border-r-4 bg-gradient-to-r to-white p-6"
          >
            <div class="mb-4 flex items-start gap-4">
              <div class="bg-primary-500 flex size-8 items-center justify-center rounded-full font-bold text-white">
                {{ criterion.alphabet }}
              </div>
              <div class="flex-1">
                <h3 class="text-muted-800 mb-2 text-lg font-semibold dark:text-white">
                  معیار {{ criterion.alphabet }}
                </h3>
                <p class="text-muted-600 dark:text-muted-400">
                  {{ criterion.description }}
                </p>
              </div>
            </div>

            <div v-if="criterion.subsets && criterion.subsets.length > 0" class="mr-12 space-y-3">
              <div
                v-for="subset in criterion.subsets"
                :key="subset.number"
                class="dark:bg-muted-600/50 flex items-start gap-3 rounded-lg bg-white/50 p-4"
              >
                <div class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex size-6 items-center justify-center rounded-full text-sm font-medium">
                  {{ subset.number }}
                </div>
                <p class="text-muted-700 dark:text-muted-300 text-sm leading-relaxed">
                  {{ subset.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Specifiers -->
      <div v-if="disorderInfo.specifiers.length > 0" class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:tag" class="mx-auto mb-4 size-12 text-emerald-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            مشخص‌کننده‌ها
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            v-for="specifier in disorderInfo.specifiers"
            :key="specifier.title"
            class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20"
          >
            <h3 class="mb-4 text-lg font-semibold text-emerald-800 dark:text-emerald-300">
              {{ specifier.title }}
            </h3>

            <div v-if="specifier.conditions && specifier.conditions.length > 0" class="space-y-2">
              <div class="mb-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                شرایط:
              </div>
              <div class="space-y-2">
                <div
                  v-for="condition in specifier.conditions"
                  :key="condition"
                  class="rounded-lg bg-emerald-100 p-3 text-sm leading-relaxed text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300"
                >
                  {{ condition }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnostic Features -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:magnifying-glass" class="mx-auto mb-4 size-12 text-purple-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            ویژگی‌های تشخیصی
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            راهنمای جامع برای شناسایی و تشخیص اختلال تکاملی عمومی بر اساس معیارهای علمی DSM-5
          </p>
        </div>

        <!-- Overview Stats -->
        <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="rounded-xl bg-gradient-to-r from-red-100 to-red-200 p-4 text-center dark:from-red-900/30 dark:to-red-800/30">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ disorderInfo.diagnosticFeatures.core_symptoms.mandatory.length }}
            </div>
            <div class="text-sm text-red-700 dark:text-red-300">
              علائم اساسی
            </div>
          </div>
          <div class="rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 p-4 text-center dark:from-blue-900/30 dark:to-blue-800/30">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ disorderInfo.diagnosticFeatures.core_symptoms.associated.length }}
            </div>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              علائم همراه
            </div>
          </div>
          <div class="rounded-xl bg-gradient-to-r from-orange-100 to-orange-200 p-4 text-center dark:from-orange-900/30 dark:to-orange-800/30">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ disorderInfo.diagnosticFeatures.contextual_factors.length }}
            </div>
            <div class="text-sm text-orange-700 dark:text-orange-300">
              عوامل زمینه‌ای
            </div>
          </div>
          <div class="rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 p-4 text-center dark:from-purple-900/30 dark:to-purple-800/30">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ disorderInfo.diagnosticFeatures.differential_diagnostics.length }}
            </div>
            <div class="text-sm text-purple-700 dark:text-purple-300">
              تشخیص‌های افتراقی
            </div>
          </div>
        </div>

        <!-- Core Symptoms Section -->
        <div class="space-y-8">
          <!-- Mandatory Symptoms -->
          <div class="rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="flex items-center gap-3 text-xl font-semibold text-red-800 dark:text-red-300">
                <div class="rounded-full bg-red-500 p-2">
                  <Icon name="ph:warning-circle-fill" class="size-6 text-white" />
                </div>
                علائم اساسی (اجباری)
              </h3>
              <div class="rounded-full bg-red-200 px-3 py-1 dark:bg-red-800">
                <span class="text-sm font-medium text-red-800 dark:text-red-200">ضروری برای تشخیص</span>
              </div>
            </div>

            <div class="mb-4 rounded-lg bg-red-100 p-4 dark:bg-red-900/50">
              <h4 class="mb-2 font-medium text-red-800 dark:text-red-300">
                معیار حذف:
              </h4>
              <p class="text-sm text-red-700 dark:text-red-400">
                {{ disorderInfo.diagnosticFeatures.core_symptoms.exclusion_criteria }}
              </p>
            </div>

            <div class="grid gap-4">
              <div
                v-for="(symptom, index) in disorderInfo.diagnosticFeatures.core_symptoms.mandatory"
                :key="symptom.symptom"
                class="rounded-lg border border-red-200 bg-white p-5 shadow-sm dark:border-red-700 dark:bg-red-800/30"
              >
                <div class="flex items-start gap-4">
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <h4 class="mb-2 font-semibold text-red-800 dark:text-red-200">
                      {{ symptom.symptom }}
                    </h4>
                    <p class="mb-3 text-sm leading-relaxed text-red-700 dark:text-red-300">
                      {{ symptom.description }}
                    </p>
                    <div class="rounded-lg bg-red-200 px-3 py-2 dark:bg-red-900">
                      <div class="mb-1 text-xs font-medium text-red-800 dark:text-red-200">
                        کمیت‌سازی:
                      </div>
                      <div class="text-xs text-red-700 dark:text-red-300">
                        {{ symptom.quantification }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Associated Symptoms -->
          <div class="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="flex items-center gap-3 text-xl font-semibold text-blue-800 dark:text-blue-300">
                <div class="rounded-full bg-blue-500 p-2">
                  <Icon name="ph:info-fill" class="size-6 text-white" />
                </div>
                علائم همراه
              </h3>
              <div class="rounded-full bg-blue-200 px-3 py-1 dark:bg-blue-800">
                <span class="text-sm font-medium text-blue-800 dark:text-blue-200">حمایت‌کننده تشخیص</span>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div
                v-for="symptom in disorderInfo.diagnosticFeatures.core_symptoms.associated"
                :key="symptom.symptom"
                class="rounded-lg border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-700 dark:bg-blue-800/30"
              >
                <div class="mb-3 flex items-start gap-3">
                  <div class="mt-1 shrink-0 rounded-full bg-blue-500 p-1">
                    <Icon :name="getSymptomIcon(symptom.category)" class="size-4 text-white" />
                  </div>
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">
                    {{ symptom.symptom }}
                  </h4>
                </div>
                <p class="mb-3 mr-7 text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                  {{ symptom.description }}
                </p>
                <div class="mr-7">
                  <span class="rounded-full bg-blue-200 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ symptom.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Temporal Pattern -->
          <div class="rounded-xl border-2 border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
            <h3 class="mb-6 flex items-center gap-3 text-xl font-semibold text-green-800 dark:text-green-300">
              <div class="rounded-full bg-green-500 p-2">
                <Icon name="ph:clock-fill" class="size-6 text-white" />
              </div>
              الگوی زمانی و سیر اختلال
            </h3>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="rounded-lg border border-green-200 bg-white p-5 shadow-sm dark:border-green-700 dark:bg-green-800/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:calendar" class="size-5 text-green-600 dark:text-green-400" />
                  <h4 class="font-semibold text-green-800 dark:text-green-200">
                    مدت زمان
                  </h4>
                </div>
                <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                  {{ disorderInfo.diagnosticFeatures.temporal_pattern.duration }}
                </p>
              </div>

              <div class="rounded-lg border border-green-200 bg-white p-5 shadow-sm dark:border-green-700 dark:bg-green-800/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:repeat" class="size-5 text-green-600 dark:text-green-400" />
                  <h4 class="font-semibold text-green-800 dark:text-green-200">
                    تناوب و تداوم
                  </h4>
                </div>
                <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                  {{ disorderInfo.diagnosticFeatures.temporal_pattern.frequency }}
                </p>
              </div>

              <div class="rounded-lg border border-green-200 bg-white p-5 shadow-sm dark:border-green-700 dark:bg-green-800/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:play-circle" class="size-5 text-green-600 dark:text-green-400" />
                  <h4 class="font-semibold text-green-800 dark:text-green-200">
                    زمان شروع
                  </h4>
                </div>
                <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                  {{ disorderInfo.diagnosticFeatures.temporal_pattern.onset }}
                </p>
              </div>

              <div class="rounded-lg border border-green-200 bg-white p-5 shadow-sm dark:border-green-700 dark:bg-green-800/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:trend-up" class="size-5 text-green-600 dark:text-green-400" />
                  <h4 class="font-semibold text-green-800 dark:text-green-200">
                    پیش‌آگهی
                  </h4>
                </div>
                <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                  {{ disorderInfo.diagnosticFeatures.temporal_pattern.remission }}
                </p>
              </div>
            </div>

            <!-- Symptom-Free Period Info -->
            <div class="mt-4 rounded-lg bg-green-100 p-4 dark:bg-green-900/50">
              <h4 class="mb-2 flex items-center gap-2 font-medium text-green-800 dark:text-green-300">
                <Icon name="ph:pause-circle" class="size-4" />
                دوره‌های بدون علامت
              </h4>
              <div class="text-sm text-green-700 dark:text-green-400">
                <span class="font-medium">ضروری: {{ disorderInfo.diagnosticFeatures.temporal_pattern.symptom_free_period.required ? 'بله' : 'خیر' }}</span>
                <span class="mx-2">•</span>
                <span>{{ disorderInfo.diagnosticFeatures.temporal_pattern.symptom_free_period.description }}</span>
              </div>
            </div>
          </div>

          <!-- Functional Impairment -->
          <div class="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <h3 class="mb-6 flex items-center gap-3 text-xl font-semibold text-amber-800 dark:text-amber-300">
              <div class="rounded-full bg-amber-500 p-2">
                <Icon name="ph:lightning-fill" class="size-6 text-white" />
              </div>
              اختلال عملکردی
            </h3>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="rounded-lg border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-700 dark:bg-amber-800/30">
                <h4 class="mb-3 font-semibold text-amber-800 dark:text-amber-200">
                  الزام وجود اختلال
                </h4>
                <div class="text-amber-700 dark:text-amber-300">
                  <span class="text-lg font-bold">{{ disorderInfo.diagnosticFeatures.functional_impairment.required ? '✓' : '✗' }}</span>
                  <span class="mr-2">{{ disorderInfo.diagnosticFeatures.functional_impairment.required ? 'ضروری است' : 'اختیاری' }}</span>
                </div>
              </div>

              <div class="rounded-lg border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-700 dark:bg-amber-800/30">
                <h4 class="mb-3 font-semibold text-amber-800 dark:text-amber-200">
                  حیطه‌های تأثیرگذار
                </h4>
                <div class="space-y-1">
                  <div
                    v-for="domain in disorderInfo.diagnosticFeatures.functional_impairment.domains"
                    :key="domain"
                    class="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300"
                  >
                    <Icon name="ph:check-circle" class="size-4 text-amber-500" />
                    {{ domain }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 rounded-lg bg-amber-100 p-4 dark:bg-amber-900/50">
              <h4 class="mb-2 font-medium text-amber-800 dark:text-amber-300">
                سطوح شدت
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="level in disorderInfo.diagnosticFeatures.functional_impairment.severity_levels"
                  :key="level"
                  class="rounded-full bg-amber-200 px-3 py-1 text-sm text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                >
                  {{ level }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contextual Factors -->
          <div class="rounded-xl border-2 border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
            <h3 class="mb-6 flex items-center gap-3 text-xl font-semibold text-orange-800 dark:text-orange-300">
              <div class="rounded-full bg-orange-500 p-2">
                <Icon name="ph:globe-hemisphere-east-fill" class="size-6 text-white" />
              </div>
              عوامل زمینه‌ای و فرهنگی
            </h3>

            <div class="space-y-4">
              <div
                v-for="factor in disorderInfo.diagnosticFeatures.contextual_factors"
                :key="factor.factor"
                class="rounded-lg border border-orange-200 bg-white p-5 shadow-sm dark:border-orange-700 dark:bg-orange-800/30"
              >
                <div class="flex items-start gap-4">
                  <div class="shrink-0 rounded-lg bg-orange-100 p-2 dark:bg-orange-800">
                    <Icon name="ph:tag" class="size-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div class="flex-1">
                    <h4 class="mb-2 font-semibold text-orange-800 dark:text-orange-200">
                      {{ factor.factor }}
                    </h4>
                    <p class="mb-3 text-sm leading-relaxed text-orange-700 dark:text-orange-300">
                      {{ factor.impact_description }}
                    </p>
                    <span class="rounded-full bg-orange-200 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {{ factor.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Differential Diagnostics -->
          <div class="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <h3 class="mb-6 flex items-center gap-3 text-xl font-semibold text-purple-800 dark:text-purple-300">
              <div class="rounded-full bg-purple-500 p-2">
                <Icon name="ph:scales-fill" class="size-6 text-white" />
              </div>
              تشخیص افتراقی و اختلالات مشابه
            </h3>

            <div class="space-y-4">
              <div
                v-for="diagnosis in disorderInfo.diagnosticFeatures.differential_diagnostics"
                :key="diagnosis.disorder"
                class="rounded-lg border border-purple-200 bg-white p-5 shadow-sm dark:border-purple-700 dark:bg-purple-800/30"
              >
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-800">
                      <Icon name="ph:first-aid-kit" class="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 class="font-semibold text-purple-800 dark:text-purple-200">
                        {{ diagnosis.disorder }}
                      </h4>
                      <p class="mt-1 text-sm text-purple-600 dark:text-purple-400">
                        {{ diagnosis.disorderEn }}
                      </p>
                    </div>
                  </div>
                  <div class="shrink-0 rounded-lg bg-purple-200 px-3 py-1 dark:bg-purple-900">
                    <span class="font-mono text-xs font-semibold text-purple-800 dark:text-purple-200">{{ diagnosis.code }}</span>
                  </div>
                </div>

                <div class="mr-11 space-y-3">
                  <div class="mb-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                    ویژگی‌های متمایز:
                  </div>
                  <div
                    v-for="feature in diagnosis.distinguishing_features"
                    :key="feature.feature"
                    class="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <span class="text-sm font-medium text-purple-800 dark:text-purple-200">{{ feature.feature }}:</span>
                      </div>
                      <div class="flex-1 text-right">
                        <span class="text-sm text-purple-600 dark:text-purple-400">{{ feature.comparison }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnostic Markers -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:test-tube" class="mx-auto mb-4 size-12 text-cyan-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            نشانگرهای تشخیصی
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            ابزارها و آزمون‌های تشخیصی که در ارزیابی و تایید اختلال تکاملی عمومی مورد استفاده قرار می‌گیرند
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div
            v-for="marker in disorderInfo.diagnosticMarkers"
            :key="marker.name"
            class="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 dark:border-cyan-800 dark:from-cyan-900/20 dark:to-blue-900/20"
          >
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-cyan-500 p-2">
                <Icon :name="getMarkerIcon(marker.name)" class="size-6 text-white" />
              </div>
              <h3 class="font-semibold text-cyan-800 dark:text-cyan-300">
                {{ getMarkerTitle(marker.name) }}
              </h3>
            </div>

            <div class="space-y-2">
              <div class="mb-3 text-sm font-medium text-cyan-700 dark:text-cyan-400">
                انواع آزمون‌ها:
              </div>
              <div class="space-y-2">
                <div
                  v-for="subtype in marker.subtype"
                  :key="subtype"
                  class="flex items-start gap-2 rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-700 dark:bg-cyan-900/30"
                >
                  <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-cyan-500" />
                  <span class="text-sm text-cyan-700 dark:text-cyan-300">{{ getSubtypeLabel(subtype) }}</span>
                </div>
              </div>
            </div>

            <!-- Additional info based on marker type -->
            <div class="mt-4 rounded-lg bg-cyan-100 p-3 dark:bg-cyan-900/50">
              <p class="text-xs leading-relaxed text-cyan-600 dark:text-cyan-400">
                {{ getMarkerDescription(marker.name) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Clinical Notes -->
        <div class="mt-8 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-6 dark:border-cyan-800 dark:from-cyan-900/20 dark:to-blue-900/20">
          <div class="flex items-start gap-4">
            <div class="shrink-0 rounded-lg bg-cyan-500 p-2">
              <Icon name="ph:warning-octagon" class="size-6 text-white" />
            </div>
            <div>
              <h3 class="mb-2 font-semibold text-cyan-800 dark:text-cyan-300">
                نکات مهم کلینیکی
              </h3>
              <ul class="space-y-2 text-sm text-cyan-700 dark:text-cyan-400">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot" class="mt-1 size-4 shrink-0" />
                  <span>هیچ نشانگر زیستی خاصی برای تشخیص قطعی GDD وجود ندارد</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot" class="mt-1 size-4 shrink-0" />
                  <span>تشخیص اصولاً بر اساس مشاهدات کلینیکی و آزمون‌های تکاملی استوار است</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot" class="mt-1 size-4 shrink-0" />
                  <span>آزمون‌های تکمیلی برای رد علل زمینه‌ای (اختلالات ژنتیکی، متابولیک) استفاده می‌شوند</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot" class="mt-1 size-4 shrink-0" />
                  <span>ارزیابی چندرشته‌ای شامل روانشناسی، گفتاردرمانی، و کاردرمانی ضروری است</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Associated Features -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:tree-structure" class="mx-auto mb-4 size-12 text-emerald-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            ویژگی‌های همراه
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            اطلاعات جامع درباره علائم حمایت‌کننده، الگوهای جمعیت‌شناختی، و سایر ویژگی‌های مرتبط با اختلال تکاملی عمومی
          </p>
        </div>

        <!-- Supporting Symptoms -->
        <div class="mb-8">
          <div class="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20">
            <h3 class="mb-4 flex items-center gap-3 text-xl font-semibold text-emerald-800 dark:text-emerald-300">
              <div class="rounded-lg bg-emerald-500 p-2">
                <Icon name="ph:list-plus" class="size-6 text-white" />
              </div>
              علائم حمایت‌کننده
            </h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="symptom in disorderInfo.associated_features.supporting_symptoms"
                :key="symptom"
                class="flex items-center gap-3 rounded-lg border border-emerald-200 bg-white p-4 dark:border-emerald-700 dark:bg-emerald-900/30"
              >
                <Icon name="ph:check-circle-fill" class="size-5 shrink-0 text-emerald-500" />
                <span class="text-sm text-emerald-700 dark:text-emerald-300">{{ symptom }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Demographic Patterns -->
        <div class="mb-8">
          <div class="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 class="mb-4 flex items-center gap-3 text-xl font-semibold text-blue-800 dark:text-blue-300">
              <div class="rounded-lg bg-blue-500 p-2">
                <Icon name="ph:chart-bar" class="size-6 text-white" />
              </div>
              الگوهای جمعیت‌شناختی
            </h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="rounded-lg border border-blue-200 bg-white p-5 dark:border-blue-700 dark:bg-blue-900/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:calendar-blank" class="size-5 text-blue-600 dark:text-blue-400" />
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">
                    سن شروع
                  </h4>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  {{ disorderInfo.associated_features.demographic_patterns.age_onset }}
                </p>
              </div>

              <div class="rounded-lg border border-blue-200 bg-white p-5 dark:border-blue-700 dark:bg-blue-900/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:gender-intersex" class="size-5 text-blue-600 dark:text-blue-400" />
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">
                    توزیع جنسیتی
                  </h4>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  {{ disorderInfo.associated_features.demographic_patterns.gender_distribution }}
                </p>
              </div>

              <div class="rounded-lg border border-blue-200 bg-white p-5 dark:border-blue-700 dark:bg-blue-900/30">
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:globe-hemisphere-west" class="size-5 text-blue-600 dark:text-blue-400" />
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200">
                    تنوع فرهنگی
                  </h4>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  {{ disorderInfo.associated_features.demographic_patterns.cultural_variations }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Comorbidities -->
        <div class="mb-8">
          <div class="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            <h3 class="mb-4 flex items-center gap-3 text-xl font-semibold text-amber-800 dark:text-amber-300">
              <div class="rounded-lg bg-amber-500 p-2">
                <Icon name="ph:intersect" class="size-6 text-white" />
              </div>
              اختلالات همراه شایع
            </h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="comorbidity in disorderInfo.associated_features.common_comorbidities"
                :key="comorbidity"
                class="flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-700 dark:bg-amber-900/30"
              >
                <div class="mt-1 shrink-0 rounded-full bg-amber-500 p-1">
                  <Icon name="ph:warning" class="size-4 text-white" />
                </div>
                <span class="text-sm leading-relaxed text-amber-700 dark:text-amber-300">{{ comorbidity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Functional Impacts -->
        <div class="mb-8">
          <div class="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6 dark:border-red-800 dark:from-red-900/20 dark:to-pink-900/20">
            <h3 class="mb-4 flex items-center gap-3 text-xl font-semibold text-red-800 dark:text-red-300">
              <div class="rounded-lg bg-red-500 p-2">
                <Icon name="ph:lightning-slash" class="size-6 text-white" />
              </div>
              تأثیرات عملکردی
            </h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="impact in disorderInfo.associated_features.functional_impacts"
                :key="impact"
                class="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-4 dark:border-red-700 dark:bg-red-900/30"
              >
                <Icon name="ph:minus-circle" class="mt-0.5 size-5 shrink-0 text-red-500" />
                <span class="text-sm leading-relaxed text-red-700 dark:text-red-300">{{ impact }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Developmental Course -->
        <div class="mb-8">
          <div class="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h3 class="mb-6 flex items-center gap-3 text-xl font-semibold text-purple-800 dark:text-purple-300">
              <div class="rounded-lg bg-purple-500 p-2">
                <Icon name="ph:trend-up" class="size-6 text-white" />
              </div>
              سیر تکاملی
            </h3>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div class="rounded-lg border border-purple-200 bg-white p-5 dark:border-purple-700 dark:bg-purple-900/30">
                <h4 class="mb-3 flex items-center gap-2 font-semibold text-purple-800 dark:text-purple-200">
                  <Icon name="ph:path" class="size-5" />
                  پیشرفت معمول
                </h4>
                <p class="text-sm leading-relaxed text-purple-700 dark:text-purple-300">
                  {{ disorderInfo.associated_features.developmental_course.typical_progression }}
                </p>
              </div>

              <div class="rounded-lg border border-purple-200 bg-white p-5 dark:border-purple-700 dark:bg-purple-900/30">
                <h4 class="mb-3 flex items-center gap-2 font-semibold text-purple-800 dark:text-purple-200">
                  <Icon name="ph:warning-diamond" class="size-5" />
                  عوامل خطر
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="risk in disorderInfo.associated_features.developmental_course.risk_factors"
                    :key="risk"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:dot" class="mt-1 size-4 shrink-0 text-purple-500" />
                    <span class="text-sm text-purple-700 dark:text-purple-300">{{ risk }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Feature Categories -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Biological Findings -->
          <div class="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 dark:border-teal-800 dark:from-teal-900/20 dark:to-cyan-900/20">
            <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-teal-800 dark:text-teal-300">
              <Icon name="ph:dna" class="size-5" />
              یافته‌های زیستی
            </h3>
            <div class="space-y-2">
              <div
                v-for="finding in disorderInfo.associated_features.biological_findings"
                :key="finding"
                class="rounded-lg border border-teal-200 bg-white p-3 text-sm text-teal-700 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
              >
                {{ finding }}
              </div>
            </div>
          </div>

          <!-- Cognitive-Emotional Patterns -->
          <div class="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 dark:border-rose-800 dark:from-rose-900/20 dark:to-pink-900/20">
            <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-rose-800 dark:text-rose-300">
              <Icon name="ph:brain" class="size-5" />
              الگوهای شناختی-هیجانی
            </h3>
            <div class="space-y-2">
              <div
                v-for="pattern in disorderInfo.associated_features.cognitive_emotional_patterns"
                :key="pattern"
                class="rounded-lg border border-rose-200 bg-white p-3 text-sm text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
              >
                {{ pattern }}
              </div>
            </div>
          </div>

          <!-- Cultural Manifestations -->
          <div class="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:border-violet-800 dark:from-violet-900/20 dark:to-purple-900/20">
            <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-violet-800 dark:text-violet-300">
              <Icon name="ph:globe" class="size-5" />
              تظاهرات فرهنگی
            </h3>
            <div class="space-y-2">
              <div
                v-for="manifestation in disorderInfo.associated_features.cultural_manifestations"
                :key="manifestation"
                class="rounded-lg border border-violet-200 bg-white p-3 text-sm text-violet-700 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              >
                {{ manifestation }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk and Prognostic Factors -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:shield-warning" class="mx-auto mb-4 size-12 text-orange-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            عوامل خطر و پیش‌آگهی
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            شناسایی عوامل خطرساز محیطی و ژنتیکی-فیزیولوژیکی که در بروز اختلال تکاملی عمومی نقش دارند
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Environmental Factors -->
          <div class="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
            <div class="mb-6 flex items-center gap-3">
              <div class="rounded-full bg-green-500 p-3">
                <Icon name="ph:tree-evergreen" class="size-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-green-800 dark:text-green-300">
                  عوامل محیطی
                </h3>
                <p class="text-sm text-green-600 dark:text-green-400">
                  تأثیرات محیط و شرایط زندگی
                </p>
              </div>
            </div>

            <div class="rounded-lg border border-green-200 bg-white p-5 dark:border-green-700 dark:bg-green-900/30">
              <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                {{ disorderInfo.riskAndPrognosticFactors.Environmental }}
              </p>
            </div>

            <!-- Environmental Risk Categories -->
            <div class="mt-6 space-y-3">
              <h4 class="mb-3 font-semibold text-green-800 dark:text-green-300">
                دسته‌بندی عوامل محیطی:
              </h4>

              <div class="grid gap-3">
                <div class="flex items-start gap-3 rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                  <Icon name="ph:house" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <div class="text-sm font-medium text-green-800 dark:text-green-200">
                      محیط خانوادگی
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                      محرومیت محیطی، کمبود تحریک
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                  <Icon name="ph:virus" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <div class="text-sm font-medium text-green-800 dark:text-green-200">
                      عفونت‌های مادرزادی
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                      عفونت‌های دوران بارداری
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                  <Icon name="ph:warning-octagon" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <div class="text-sm font-medium text-green-800 dark:text-green-200">
                      آسیب‌های محیطی
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                      مواجهه با سموم، آسیب‌های فیزیکی
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                  <Icon name="ph:hamburger" class="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <div class="text-sm font-medium text-green-800 dark:text-green-200">
                      مشکلات تغذیه‌ای
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                      سوءتغذیه، کمبود ویتامین‌ها
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Genetic and Physiological Factors -->
          <div class="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div class="mb-6 flex items-center gap-3">
              <div class="rounded-full bg-blue-500 p-3">
                <Icon name="ph:dna" class="size-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-300">
                  عوامل ژنتیکی و فیزیولوژیکی
                </h3>
                <p class="text-sm text-blue-600 dark:text-blue-400">
                  عوامل زیستی و ارثی
                </p>
              </div>
            </div>

            <div class="rounded-lg border border-blue-200 bg-white p-5 dark:border-blue-700 dark:bg-blue-900/30">
              <p class="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                {{ disorderInfo.riskAndPrognosticFactors.geneticAndPhysiological }}
              </p>
            </div>

            <!-- Genetic Risk Categories -->
            <div class="mt-6 space-y-3">
              <h4 class="mb-3 font-semibold text-blue-800 dark:text-blue-300">
                دسته‌بندی عوامل ژنتیکی-فیزیولوژیکی:
              </h4>

              <div class="grid gap-3">
                <div class="flex items-start gap-3 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <Icon name="ph:dna" class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      عوامل ژنتیکی
                    </div>
                    <div class="text-xs text-blue-600 dark:text-blue-400">
                      ناهنجاری‌های کروموزومی، جهش‌های ژنتیکی
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <Icon name="ph:flask" class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      اختلالات متابولیک
                    </div>
                    <div class="text-xs text-blue-600 dark:text-blue-400">
                      اختلالات متابولیک مادرزادی
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <Icon name="ph:brain" class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      آسیب‌های مغزی
                    </div>
                    <div class="text-xs text-blue-600 dark:text-blue-400">
                      آسیب‌های مغزی، تروما، هیپوکسی
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <Icon name="ph:baby" class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      مشکلات دوران بارداری
                    </div>
                    <div class="text-xs text-blue-600 dark:text-blue-400">
                      مشکلات بارداری، زایمان پیچیده
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prognostic Information -->
        <div class="mt-8 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20">
          <div class="flex items-start gap-4">
            <div class="shrink-0 rounded-lg bg-amber-500 p-2">
              <Icon name="ph:chart-line-up" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="mb-3 font-semibold text-amber-800 dark:text-amber-300">
                اطلاعات پیش‌آگهی
              </h3>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 class="mb-2 flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
                    <Icon name="ph:trend-up" class="size-4" />
                    عوامل بهبود پیش‌آگهی
                  </h4>
                  <ul class="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span>تشخیص و مداخله زودهنگام</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span>حمایت خانوادگی مناسب</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span>دسترسی به خدمات تخصصی</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span>عدم وجود علل زمینه‌ای جدی</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="mb-2 flex items-center gap-2 font-medium text-red-800 dark:text-red-200">
                    <Icon name="ph:trend-down" class="size-4" />
                    عوامل بدتر کننده پیش‌آگهی
                  </h4>
                  <ul class="space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:x-circle" class="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span>تأخیر در تشخیص و درمان</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:x-circle" class="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span>وجود اختلالات همراه متعدد</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:x-circle" class="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span>شدت بالای تأخیر تکاملی</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:x-circle" class="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span>محدودیت منابع و حمایت</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Culture Related Diagnostic Issues -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:globe-hemisphere-west" class="mx-auto mb-4 size-12 text-indigo-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            مسائل تشخیصی مرتبط با فرهنگ
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            تأثیر عوامل فرهنگی، اجتماعی و اعتقادی بر فرآیند تشخیص و درمان اختلال تکاملی عمومی
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Social Stigma -->
          <div class="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-6 dark:border-red-800 dark:from-red-900/20 dark:to-rose-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-red-500 p-2">
                <Icon name="ph:eye-slash" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-red-800 dark:text-red-300">
                انگ اجتماعی
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-red-200 bg-white p-4 dark:border-red-700 dark:bg-red-900/30">
              <p class="text-sm leading-relaxed text-red-700 dark:text-red-300">
                {{ disorderInfo.cultureRelatedDiagnosticIssues.stigma }}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-red-800 dark:text-red-300">
                تأثیرات انگ اجتماعی:
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-2 rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
                  <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-red-500" />
                  <span class="text-xs text-red-700 dark:text-red-300">تأخیر در مراجعه برای تشخیص</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
                  <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-red-500" />
                  <span class="text-xs text-red-700 dark:text-red-300">اجتناب از درمان‌های تخصصی</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
                  <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-red-500" />
                  <span class="text-xs text-red-700 dark:text-red-300">انزوای اجتماعی خانواده</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cultural Beliefs -->
          <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-indigo-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-purple-500 p-2">
                <Icon name="ph:heart" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-purple-800 dark:text-purple-300">
                باورهای فرهنگی و مذهبی
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-purple-200 bg-white p-4 dark:border-purple-700 dark:bg-purple-900/30">
              <p class="text-sm leading-relaxed text-purple-700 dark:text-purple-300">
                {{ disorderInfo.cultureRelatedDiagnosticIssues.beliefs }}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-purple-800 dark:text-purple-300">
                انواع باورهای مؤثر:
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:star" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">باورهای مذهبی درباره علت اختلال</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:star" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">تفسیرهای سنتی از تأخیر رشدی</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:star" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">نگرش‌های فرهنگی به ناتوانی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Access and Language Barriers -->
        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Access Issues -->
          <div class="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-amber-500 p-2">
                <Icon name="ph:lock" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-300">
                دسترسی محدود
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-700 dark:bg-amber-900/30">
              <p class="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                {{ disorderInfo.cultureRelatedDiagnosticIssues.access }}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                موانع دسترسی:
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-2 rounded-lg bg-amber-100 p-3 dark:bg-amber-900/50">
                  <Icon name="ph:map-pin" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span class="text-xs text-amber-700 dark:text-amber-300">فاصله جغرافیایی از مراکز تخصصی</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-amber-100 p-3 dark:bg-amber-900/50">
                  <Icon name="ph:currency-dollar" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span class="text-xs text-amber-700 dark:text-amber-300">محدودیت‌های مالی و اقتصادی</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-amber-100 p-3 dark:bg-amber-900/50">
                  <Icon name="ph:clock" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span class="text-xs text-amber-700 dark:text-amber-300">طولانی بودن لیست انتظار</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Language Barriers -->
          <div class="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 dark:border-teal-800 dark:from-teal-900/20 dark:to-cyan-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-teal-500 p-2">
                <Icon name="ph:translate" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-teal-800 dark:text-teal-300">
                موانع زبانی
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-teal-200 bg-white p-4 dark:border-teal-700 dark:bg-teal-900/30">
              <p class="text-sm leading-relaxed text-teal-700 dark:text-teal-300">
                {{ disorderInfo.cultureRelatedDiagnosticIssues.language }}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-teal-800 dark:text-teal-300">
                چالش‌های زبانی:
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-2 rounded-lg bg-teal-100 p-3 dark:bg-teal-900/50">
                  <Icon name="ph:chat-circle" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                  <span class="text-xs text-teal-700 dark:text-teal-300">مشکل ارتباط با پزشک و درمانگر</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-teal-100 p-3 dark:bg-teal-900/50">
                  <Icon name="ph:file-text" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                  <span class="text-xs text-teal-700 dark:text-teal-300">عدم فهم اسناد و گزارش‌های پزشکی</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-teal-100 p-3 dark:bg-teal-900/50">
                  <Icon name="ph:question" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                  <span class="text-xs text-teal-700 dark:text-teal-300">نادرست فهمیدن دستورات درمانی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clinical Recommendations -->
        <div class="mt-8 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 dark:border-indigo-800 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
          <div class="flex items-start gap-4">
            <div class="shrink-0 rounded-lg bg-indigo-500 p-2">
              <Icon name="ph:lightbulb" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="mb-4 font-semibold text-indigo-800 dark:text-indigo-300">
                توصیه‌های کلینیکی برای رفع مسائل فرهنگی
              </h3>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 class="mb-3 flex items-center gap-2 font-medium text-indigo-800 dark:text-indigo-200">
                    <Icon name="ph:users" class="size-4" />
                    رویکرد فرهنگی-حساس
                  </h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">احترام به باورهای فرهنگی خانواده</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">درنظر گیری تفاوت‌های فرهنگی در ارزیابی</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">همکاری با رهبران جامعه محلی</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="mb-3 flex items-center gap-2 font-medium text-indigo-800 dark:text-indigo-200">
                    <Icon name="ph:gear" class="size-4" />
                    اقدامات عملی
                  </h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">استفاده از مترجم در صورت نیاز</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">آموزش خانواده به زبان مادری</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                      <span class="text-indigo-700 dark:text-indigo-300">تطبیق روش‌های درمان با فرهنگ خانواده</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gender Related Diagnostic Issues -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <Icon name="ph:gender-intersex" class="mx-auto mb-4 size-12 text-pink-500" />
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            مسائل تشخیصی مرتبط با جنسیت
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            تأثیر عوامل جنسیتی بر الگوهای تشخیص، شیوع، و ارائه علائم اختلال تکاملی عمومی
          </p>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Prevalence Patterns -->
          <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-blue-500 p-2">
                <Icon name="ph:chart-pie" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300">
                الگوهای شیوع
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-700 dark:bg-blue-900/30">
              <p class="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                {{ disorderInfo.genderRelatedDiagnosticIssues.prevalence }}
              </p>
            </div>

            <!-- Gender Statistics -->
            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                آمار جنسیتی:
              </h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:gender-male" class="size-4 text-blue-500" />
                    <span class="text-xs font-medium text-blue-700 dark:text-blue-300">پسران</span>
                  </div>
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">نسبت بالاتر</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:gender-female" class="size-4 text-pink-500" />
                    <span class="text-xs font-medium text-blue-700 dark:text-blue-300">دختران</span>
                  </div>
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">کمتر تشخیص</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Presentation Differences -->
          <div class="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6 dark:border-pink-800 dark:from-pink-900/20 dark:to-rose-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-pink-500 p-2">
                <Icon name="ph:mask-happy" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-pink-800 dark:text-pink-300">
                تفاوت‌های ارائه علائم
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-pink-200 bg-white p-4 dark:border-pink-700 dark:bg-pink-900/30">
              <p class="text-sm leading-relaxed text-pink-700 dark:text-pink-300">
                {{ disorderInfo.genderRelatedDiagnosticIssues.presentation }}
              </p>
            </div>

            <!-- Presentation Patterns -->
            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-pink-800 dark:text-pink-300">
                الگوهای ارائه:
              </h4>
              <div class="space-y-2">
                <div class="rounded-lg bg-pink-100 p-3 dark:bg-pink-900/50">
                  <div class="mb-1 flex items-center gap-2">
                    <Icon name="ph:gender-male" class="size-4 text-blue-500" />
                    <span class="text-xs font-medium text-pink-800 dark:text-pink-200">پسران</span>
                  </div>
                  <span class="text-xs text-pink-600 dark:text-pink-400">علائم آشکارتر و قابل تشخیص‌تر</span>
                </div>
                <div class="rounded-lg bg-pink-100 p-3 dark:bg-pink-900/50">
                  <div class="mb-1 flex items-center gap-2">
                    <Icon name="ph:gender-female" class="size-4 text-pink-500" />
                    <span class="text-xs font-medium text-pink-800 dark:text-pink-200">دختران</span>
                  </div>
                  <span class="text-xs text-pink-600 dark:text-pink-400">علائم پنهان‌تر، سازگاری اجتماعی بیشتر</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Expectations -->
          <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-violet-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-purple-500 p-2">
                <Icon name="ph:users" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-purple-800 dark:text-purple-300">
                انتظارات اجتماعی
              </h3>
            </div>

            <div class="mb-4 rounded-lg border border-purple-200 bg-white p-4 dark:border-purple-700 dark:bg-purple-900/30">
              <p class="text-sm leading-relaxed text-purple-700 dark:text-purple-300">
                {{ disorderInfo.genderRelatedDiagnosticIssues.expectations }}
              </p>
            </div>

            <!-- Social Impact -->
            <div class="space-y-3">
              <h4 class="mb-2 text-sm font-medium text-purple-800 dark:text-purple-300">
                تأثیرات اجتماعی:
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:eye" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">انتظارات متفاوت از رفتار پسران و دختران</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:mask-sad" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">پنهان‌کاری علائم در دختران</span>
                </div>
                <div class="flex items-start gap-2 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                  <Icon name="ph:flag" class="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <span class="text-xs text-purple-700 dark:text-purple-300">تشخیص دیرهنگام در دختران</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Diagnostic Bias and Challenges -->
        <div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Gender Bias in Assessment -->
          <div class="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-amber-500 p-2">
                <Icon name="ph:scales" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-300">
                سوگیری جنسیتی در ارزیابی
              </h3>
            </div>

            <div class="space-y-4">
              <div class="rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-700 dark:bg-amber-900/30">
                <h4 class="mb-2 font-medium text-amber-800 dark:text-amber-200">
                  عوامل سوگیری:
                </h4>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start gap-2">
                    <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span class="text-amber-700 dark:text-amber-300">ابزارهای تشخیصی بر اساس نمونه‌های مردانه</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span class="text-amber-700 dark:text-amber-300">انتظارات کلینیکی متفاوت</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:warning" class="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span class="text-amber-700 dark:text-amber-300">کم‌توجهی به علائم دختران</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Assessment Challenges -->
          <div class="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 dark:border-teal-800 dark:from-teal-900/20 dark:to-cyan-900/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-teal-500 p-2">
                <Icon name="ph:puzzle-piece" class="size-6 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-teal-800 dark:text-teal-300">
                چالش‌های ارزیابی
              </h3>
            </div>

            <div class="space-y-4">
              <div class="rounded-lg border border-teal-200 bg-white p-4 dark:border-teal-700 dark:bg-teal-900/30">
                <h4 class="mb-2 font-medium text-teal-800 dark:text-teal-200">
                  موانع تشخیص:
                </h4>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start gap-2">
                    <Icon name="ph:question" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                    <span class="text-teal-700 dark:text-teal-300">مهارت‌های تقلید اجتماعی در دختران</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:question" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                    <span class="text-teal-700 dark:text-teal-300">انطباق ظاهری با انتظارات</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:question" class="mt-0.5 size-4 shrink-0 text-teal-500" />
                    <span class="text-teal-700 dark:text-teal-300">تشخیص اشتباه سایر اختلالات</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Clinical Recommendations for Gender-Sensitive Assessment -->
        <div class="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-6 dark:border-emerald-800 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20">
          <div class="flex items-start gap-4">
            <div class="shrink-0 rounded-lg bg-emerald-500 p-2">
              <Icon name="ph:first-aid-kit" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="mb-4 font-semibold text-emerald-800 dark:text-emerald-300">
                توصیه‌های کلینیکی برای ارزیابی حساس به جنسیت
              </h3>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 class="mb-3 flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-200">
                    <Icon name="ph:magnifying-glass" class="size-4" />
                    رویکرد ارزیابی
                  </h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">ارزیابی دقیق‌تر دختران</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">توجه به تفاوت‌های ارائه علائم</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">استفاده از ابزارهای جنسیت-حساس</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 class="mb-3 flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-200">
                    <Icon name="ph:lightbulb" class="size-4" />
                    اقدامات پیشگیرانه
                  </h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">آموزش کلینیسین‌ها درباره سوگیری جنسیتی</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">افزایش آگاهی والدین</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span class="text-emerald-700 dark:text-emerald-300">غربالگری زودهنگام دختران</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
        <div class="mb-6 text-center">
          <Icon name="ph:books" class="text-primary-500 mx-auto mb-4 size-12" />
          <h2 class="text-muted-800 mb-2 text-2xl font-bold dark:text-white">
            اطلاعات تکمیلی
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
            <Icon name="ph:stethoscope" class="mx-auto mb-3 size-8 text-blue-600 dark:text-blue-400" />
            <h4 class="mb-2 font-semibold text-blue-800 dark:text-blue-300">
              ارزیابی تخصصی
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              نیاز به ارزیابی چندرشته‌ای توسط متخصصان
            </p>
          </div>

          <div class="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/20">
            <Icon name="ph:heart" class="mx-auto mb-3 size-8 text-emerald-600 dark:text-emerald-400" />
            <h4 class="mb-2 font-semibold text-emerald-800 dark:text-emerald-300">
              مداخله زودهنگام
            </h4>
            <p class="text-sm text-emerald-700 dark:text-emerald-300">
              اهمیت حیاتی شناسایی و درمان زودهنگام
            </p>
          </div>

          <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20">
            <Icon name="ph:users" class="mx-auto mb-3 size-8 text-purple-600 dark:text-purple-400" />
            <h4 class="mb-2 font-semibold text-purple-800 dark:text-purple-300">
              حمایت خانوادگی
            </h4>
            <p class="text-sm text-purple-700 dark:text-purple-300">
              نقش کلیدی خانواده در درمان و بهبود
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'اختلال تکاملی عمومی - DSM-5 | ذهنا',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'اختلال تکاملی عمومی - DSM-5 | ذهنا',
  meta: [
    {
      name: 'description',
      content: 'راهنمای جامع اختلال تکاملی عمومی (Global Developmental Delay) بر اساس معیارهای DSM-5. شامل علائم، معیارهای تشخیصی، و اطلاعات کامل تشخیصی.',
    },
    {
      name: 'keywords',
      content: 'اختلال تکاملی عمومی, Global Developmental Delay, DSM-5, تأخیر رشد, اختلالات نوروتکاملی, تشخیص کودکان',
    },
  ],
})

// Complete disorder information based on your exact structure
const disorderInfo = {
  code: '315.8 (F88)',
  title: 'اختلال تکاملی عمومی',
  titleEn: 'Global Developmental Delay',
  description: 'تأخیر قابل توجه در دو یا بیشتر از حیطه‌های تکاملی شامل عملکرد شناختی، زبان، مهارت‌های حرکتی، یا عملکرد تطبیقی در کودکان زیر 5 سال که نمی‌توان آنها را به طور قابل اعتماد با استفاده از آزمون‌های استاندارد ارزیابی کرد.',
  minimumCriteria: 'تأخیر قابل توجه در حداقل ۲ حیطه تکاملی + عدم امکان ارزیابی قابل اعتماد با آزمون‌های استاندارد + سن زیر ۵ سال',
  specialNote: 'این تشخیص برای کودکان زیر ۵ سال محفوظ است که نمی‌توان سطح شدت معلولیت ذهنی آنها را به دلیل سن کم یا عوامل دیگر تعیین کرد.',
  Prevalence: '1-3%', // Fixed key name to match structure
  developmentAndCourse: 'معمولاً در سال‌های اول زندگی قابل تشخیص است. با مداخله زودهنگام مناسب، بسیاری از کودکان بهبود قابل توجهی نشان می‌دهند. سیر اختلال به شدت تأخیر، کیفیت مداخلات، و عوامل زیربنایی بستگی دارد.',
  suicideRisk: 'پایین',
  diagnosisCriteria: [
    {
      alphabet: 'A',
      description: 'تأخیر در رسیدن به نشانه‌های تکاملی انتظاری در دو یا بیشتر از حیطه‌های زیر:',
      subsets: [
        {
          number: '1',
          description: 'عملکرد شناختی (مهارت‌های حل مسئله، برنامه‌ریزی، استدلال، قضاوت، یادگیری)',
        },
        {
          number: '2',
          description: 'مهارت‌های زبانی و ارتباطی (درک و بیان زبان، مهارت‌های ارتباط)',
        },
        {
          number: '3',
          description: 'مهارت‌های حرکتی (حرکات درشت و ظریف، تعادل، هماهنگی)',
        },
        {
          number: '4',
          description: 'عملکرد تطبیقی (مهارت‌های اجتماعی، خودمراقبتی، زندگی روزانه)',
        },
      ],
    },
    {
      alphabet: 'B',
      description: 'کودک تحت 5 سال سن است.',
      subsets: [],
    },
    {
      alphabet: 'C',
      description: 'عدم امکان ارزیابی قابل اعتماد عملکرد ذهنی با استفاده از آزمون‌های استاندارد به دلیل:',
      subsets: [
        {
          number: '1',
          description: 'سن پایین کودک',
        },
        {
          number: '2',
          description: 'عدم همکاری یا امتناع از انجام آزمون',
        },
        {
          number: '3',
          description: 'اختلالات حسی یا حرکتی شدید',
        },
        {
          number: '4',
          description: 'بیماری جسمی یا عوامل محیطی',
        },
      ],
    },
    {
      alphabet: 'D',
      description: 'تأخیرهای تکاملی قابل توجه هستند و در فعالیت‌های روزانه و عملکرد اجتماعی تأثیر می‌گذارند.',
      subsets: [],
    },
    {
      alphabet: 'E',
      description: 'تأخیرهای تکاملی ناشی از یک اختلال پزشکی یا ژنتیکی شناخته شده نیست (یا در صورت وجود، تأخیرها فراتر از آنچه انتظار می‌رود است).',
      subsets: [],
    },
  ],
  specifiers: [
    {
      title: 'شدت تأخیر',
      conditions: [
        'نیاز به حمایت محدود - قابلیت انجام برخی مهارت‌های روزانه با کمک کم',
        'نیاز به حمایت قابل توجه - نیاز به راهنمایی و حمایت در اکثر فعالیت‌ها',
        'نیاز به حمایت گسترده - وابستگی کامل و نیاز به مراقبت مداوم',
      ],
    },
    {
      title: 'حیطه‌های درگیر',
      conditions: [
        'تأخیر شناختی - مشکل در یادگیری، حافظه، و پردازش اطلاعات',
        'تأخیر زبانی - کندی در کسب مهارت‌های گفتاری و درک زبان',
        'تأخیر حرکتی - مشکل در مهارت‌های حرکتی درشت و ظریف',
        'تأخیر تطبیقی - مشکل در مهارت‌های خودمراقبتی و اجتماعی',
      ],
    },
  ],
  diagnosticFeatures: {
    core_symptoms: {
      mandatory: [
        {
          symptom: 'تأخیر در نقاط عطف تکاملی',
          description: 'کودک در رسیدن به مهارت‌های مورد انتظار برای سن خود تأخیر دارد',
          quantification: 'حداقل در ۲ حیطه تکاملی',
        },
        {
          symptom: 'عدم امکان ارزیابی استاندارد',
          description: 'نمی‌توان عملکرد ذهنی کودک را با آزمون‌های استاندارد ارزیابی کرد',
          quantification: 'به دلیل سن کم یا شدت علائم',
        },
      ],
      associated: [
        {
          symptom: 'مشکلات ارتباطی',
          description: 'کودک در برقراری ارتباط با دیگران دچار مشکل است',
          category: 'behavioral',
        },
        {
          symptom: 'اختلالات خواب',
          description: 'الگوهای غیرطبیعی خواب و بیداری',
          category: 'somatic',
        },
        {
          symptom: 'حساسیت‌های حسی',
          description: 'واکنش‌های غیرطبیعی به محرک‌های حسی',
          category: 'behavioral',
        },
      ],
      exclusion_criteria: 'تشخیص در صورت امکان ارزیابی دقیق با آزمون‌های استاندارد استفاده نمی‌شود',
    },
    temporal_pattern: {
      duration: 'تأخیر باید در دوران تکاملی (قبل از ۵ سالگی) آغاز شده باشد',
      frequency: 'علائم مداوم و قابل مشاهده در زمینه‌های مختلف',
      onset: 'معمولاً در سال‌های اول زندگی قابل تشخیص',
      remission: 'با مداخله زودهنگام ممکن است بهبود قابل توجهی حاصل شود',
      symptom_free_period: {
        required: false,
        description: 'علائم معمولاً مداوم هستند اما شدت آنها متغیر است',
      },
    },
    functional_impairment: {
      required: true,
      domains: ['occupational', 'social', 'academic'],
      severity_levels: ['mild', 'moderate', 'severe'],
    },
    contextual_factors: [
      {
        factor: 'سطح اجتماعی-اقتصادی خانواده',
        impact_description: 'دسترسی به خدمات درمانی و آموزشی را تحت تأثیر قرار می‌دهد',
        type: 'socioeconomic_status',
      },
      {
        factor: 'باورهای فرهنگی درباره ناتوانی',
        impact_description: 'ممکن است باعث تأخیر در تشخیص یا عدم پذیرش درمان شود',
        type: 'cultural_background',
      },
      {
        factor: 'دسترسی به خدمات درمانی',
        impact_description: 'کیفیت و دسترسی به مداخلات زودهنگام',
        type: 'healthcare_access',
      },
    ],
    differential_diagnostics: [
      {
        disorder: 'معلولیت ذهنی',
        disorderEn: 'Intellectual Disability',
        code: '319 (F79)',
        distinguishing_features: [
          {
            feature: 'قابلیت ارزیابی',
            comparison: 'در GDD امکان ارزیابی دقیق وجود ندارد',
          },
          {
            feature: 'آزمون‌های استاندارد',
            comparison: 'در معلولیت ذهنی آزمون‌های IQ قابل اجرا هستند',
          },
        ],
      },
      {
        disorder: 'اختلالات طیف اوتیسم',
        disorderEn: 'Autism Spectrum Disorder',
        code: '299.00 (F84.0)',
        distinguishing_features: [
          {
            feature: 'الگوهای رفتاری',
            comparison: 'در اوتیسم رفتارهای تکراری و محدودیت‌های اجتماعی بیشتر است',
          },
          {
            feature: 'ارتباط اجتماعی',
            comparison: 'در GDD تأخیر عمومی، در اوتیسم کیفیت ارتباط مشکل‌دار است',
          },
        ],
      },
      {
        disorder: 'اختلالات ارتباطی',
        disorderEn: 'Communication Disorders',
        code: '315.39 (F80.9)',
        distinguishing_features: [
          {
            feature: 'دامنه تأثیر',
            comparison: 'در اختلالات ارتباطی فقط زبان درگیر است، در GDD چندین حیطه',
          },
          {
            feature: 'مهارت‌های غیرزبانی',
            comparison: 'در اختلالات ارتباطی مهارت‌های غیرزبانی معمولاً طبیعی است',
          },
        ],
      },
      {
        disorder: 'اختلال شنوایی',
        disorderEn: 'Hearing Impairment',
        code: '389.9 (H90.3)',
        distinguishing_features: [
          {
            feature: 'علت اولیه',
            comparison: 'در اختلال شنوایی مشکل حسی اولیه وجود دارد',
          },
          {
            feature: 'بهبود با کمک',
            comparison: 'با سمعک یا کاشت حلزون بهبود قابل توجه در ارتباط',
          },
        ],
      },
      {
        disorder: 'اختلال بینایی',
        disorderEn: 'Visual Impairment',
        code: '369.9 (H54.7)',
        distinguishing_features: [
          {
            feature: 'مهارت‌های حرکتی',
            comparison: 'در اختلال بینایی عمدتاً مهارت‌های حرکتی درشت متأثر است',
          },
          {
            feature: 'مهارت‌های شناختی',
            comparison: 'مهارت‌های شناختی کلامی معمولاً محفوظ است',
          },
        ],
      },
    ],
  },

  diagnosticMarkers: [
    {
      name: 'neurophysiological',
      subtype: ['EEG abnormalities', 'brain imaging findings', 'developmental assessments'],
    },
    {
      name: 'cognitive_behavioral',
      subtype: ['standardized developmental tests', 'behavioral observations', 'adaptive functioning scales'],
    },
    {
      name: 'biological',
      subtype: ['genetic testing', 'metabolic screening', 'chromosomal analysis'],
    },
  ],

  associated_features: {
    supporting_symptoms: [
      'تأخیر در کنترل دفع',
      'مشکلات تغذیه',
      'اختلالات خواب',
      'رفتارهای خودآسیبی',
    ],
    demographic_patterns: {
      age_onset: 'قبل از ۵ سالگی',
      gender_distribution: 'شایع‌تر در پسران',
      cultural_variations: 'تشخیص ممکن است تحت تأثیر عوامل فرهنگی باشد',
    },
    common_comorbidities: [
      'اختلالات طیف اوتیسم',
      'اختلال کمبود توجه/فزون‌کنشی',
      'اختلالات تشنجی',
      'مشکلات بینایی یا شنوایی',
    ],
    functional_impacts: [
      'محدودیت در خودمراقبتی',
      'مشکلات تحصیلی',
      'چالش‌های اجتماعی',
      'وابستگی به مراقب',
    ],
    developmental_course: {
      typical_progression: 'با مداخله زودهنگام پیش‌آگهی بهتر',
      risk_factors: [
        'عوامل ژنتیکی',
        'مشکلات دوران بارداری',
        'آسیب‌های مغزی',
        'محرومیت محیطی',
      ],
    },
    biological_findings: [
      'تغییرات در تصویربرداری مغز',
      'ناهنجاری‌های ژنتیکی',
      'اختلالات متابولیک',
    ],
    cognitive_emotional_patterns: [
      'کندی در پردازش اطلاعات',
      'مشکلات حافظه',
      'اضطراب جدایی',
      'تنظیم هیجانی ضعیف',
    ],
    cultural_manifestations: [
      'تفسیرهای فرهنگی از تأخیر رشدی',
      'نگرش‌های خانوادگی به ناتوانی',
      'باورهای مذهبی و درمان',
    ],
  },

  riskAndPrognosticFactors: {
    Environmental: 'محرومیت محیطی، کمبود تحریک، آسیب‌های محیطی، مشکلات تغذیه‌ای، عفونت‌های مادرزادی',
    geneticAndPhysiological: 'عوامل ژنتیکی، ناهنجاری‌های کروموزومی، اختلالات متابولیک مادرزادی، آسیب‌های مغزی، مشکلات دوران بارداری و زایمان',
  },

  cultureRelatedDiagnosticIssues: {
    stigma: 'انگ اجتماعی ناتوانی در برخی فرهنگ‌ها',
    beliefs: 'باورهای فرهنگی و مذهبی درباره علل تأخیر رشدی',
    access: 'دسترسی محدود به خدمات تشخیصی در برخی جوامع',
    language: 'موانع زبانی در ارزیابی و درمان',
  },

  genderRelatedDiagnosticIssues: {
    prevalence: 'شیوع بیشتر در پسران',
    presentation: 'ممکن است در دختران کمتر تشخیص داده شود',
    expectations: 'انتظارات متفاوت جامعه از پسران و دختران',
  },

  differentialDiagnosis: {
    'معلولیت ذهنی': 'امکان ارزیابی دقیق با آزمون‌های استاندارد',
    'اختلالات طیف اوتیسم': 'علائم اجتماعی و ارتباطی خاص',
    'اختلالات زبان خاص': 'محدود به حیطه زبانی',
    'اختلالات شنوایی': 'مشکلات حسی اولیه',
  },

  comorbidity: {
    common: [
      'اختلالات طیف اوتیسم',
      'اختلال کمبود توجه/فزون‌کنشی',
      'اختلالات تشنجی',
      'مشکلات بینایی/شنوایی',
    ],
    medical: [
      'اختلالات ژنتیکی',
      'اختلالات متابولیک',
      'آسیب‌های مغزی',
      'مشکلات عصبی',
    ],
  },
}

// Helper function for symptom category icons
const getSymptomIcon = (category: string) => {
  const iconMap = {
    behavioral: 'ph:user-focus',
    somatic: 'ph:heart',
    mood: 'ph:smiley-sad',
    anxiety: 'ph:lightning',
    cognitive: 'ph:brain',
    social: 'ph:users',
    motor: 'ph:hand',
    sensory: 'ph:eye',
  }
  return iconMap[category.toLowerCase()] || 'ph:circle'
}

// Helper functions for diagnostic markers
const getMarkerIcon = (markerName: string) => {
  const iconMap = {
    biological: 'ph:dna',
    neurophysiological: 'ph:pulse',
    cognitive_behavioral: 'ph:brain',
    digital: 'ph:computer-tower',
    other: 'ph:test-tube',
  }
  return iconMap[markerName] || 'ph:test-tube'
}

const getMarkerTitle = (markerName: string) => {
  const titleMap = {
    biological: 'نشانگرهای زیستی',
    neurophysiological: 'نشانگرهای عصب‌فیزیولوژیکی',
    cognitive_behavioral: 'ارزیابی‌های شناختی-رفتاری',
    digital: 'ابزارهای دیجیتال',
    other: 'سایر نشانگرها',
  }
  return titleMap[markerName] || markerName
}

const getSubtypeLabel = (subtype: string) => {
  const labelMap = {
    'biomarkers': 'نشانگرهای زیستی',
    'genetic_markers': 'نشانگرهای ژنتیکی',
    'endocrine_profiles': 'پروفایل‌های هورمونی',
    'immune_markers': 'نشانگرهای ایمنی',
    'metabolic_profiles': 'پروفایل‌های متابولیک',
    'EEG abnormalities': 'ناهنجاری‌های EEG',
    'brain imaging findings': 'یافته‌های تصویربرداری مغز',
    'developmental assessments': 'ارزیابی‌های تکاملی',
    'standardized developmental tests': 'آزمون‌های استاندارد تکاملی',
    'behavioral observations': 'مشاهدات رفتاری',
    'adaptive functioning scales': 'مقیاس‌های عملکرد تطبیقی',
    'genetic testing': 'آزمون‌های ژنتیکی',
    'metabolic screening': 'غربالگری متابولیک',
    'chromosomal analysis': 'تجزیه و تحلیل کروموزومی',
  }
  return labelMap[subtype] || subtype
}

const getMarkerDescription = (markerName: string) => {
  const descriptionMap = {
    biological: 'آزمون‌های خون، آزمایش‌های ژنتیکی، و بررسی‌های متابولیک برای شناسایی علل زمینه‌ای',
    neurophysiological: 'EEG، MRI مغز، و سایر آزمون‌های عملکرد سیستم عصبی مرکزی',
    cognitive_behavioral: 'آزمون‌های استاندارد تکاملی، مشاهده رفتار، و ارزیابی مهارت‌های تطبیقی',
    digital: 'نرم‌افزارهای ارزیابی، اپلیکیشن‌های نظارتی، و ابزارهای تشخیص کامپیوتری',
    other: 'سایر روش‌های تشخیصی و ارزیابی که در موارد خاص استفاده می‌شوند',
  }
  return descriptionMap[markerName] || 'ابزارهای تشخیصی تخصصی'
}

// Console log for structure verification
console.log('=== COMPLETE STRUCTURE IMPLEMENTED ===')
console.log('✓ All required fields from your goal structure are now included')
console.log('✓ Fixed prevalence key name to "Prevalence"')
console.log('✓ Fixed specifiers structure to {title, conditions}')
console.log('✓ Implemented complete diagnosticFeatures with all subsections')
console.log('✓ Added all missing sections: diagnosticMarkers, associated_features, etc.')
console.log('Structure ready for DSM-5 compliant implementation!')
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

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
</style>
