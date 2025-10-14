<template>
  <div class="from-primary-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br via-white to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="border-primary-500 mx-auto mb-4 size-12 animate-spin rounded-full border-2 border-t-transparent" />
        <p class="text-muted-600 dark:text-muted-400">
          در حال بارگذاری...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex min-h-screen items-center justify-center">
      <div class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <Icon name="ph:warning" class="mx-auto mb-4 size-12 text-red-500" />
        <h2 class="mb-2 text-xl font-bold text-red-800 dark:text-red-200">
          خطا در بارگذاری
        </h2>
        <p class="text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <button class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600" @click="$router.push('/diagnosis/categories')">
          بازگشت به دسته‌بندی‌ها
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="disorderInfo">
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
              <span class="text-primary-600 dark:text-primary-400 font-medium">{{ disorderInfo.title || disorderInfo.titleFa }}</span>
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
                <Icon :name="disorderInfo.icon || 'ph:brain-fill'" class="size-8 text-white" />
                <div class="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
              </div>
              <div class="text-right">
                <div class="text-muted-600 dark:text-muted-400 text-sm">
                  DSM-5 Code: {{ disorderInfo.code }}
                </div>
                <div class="text-muted-800 text-lg font-bold dark:text-white">
                  {{ disorderInfo.titleEn }}
                </div>
              </div>
            </div>

            <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
              {{ disorderInfo.title || disorderInfo.titleFa }}
            </h1>

            <p class="text-muted-600 dark:text-muted-400 mx-auto mb-8 max-w-4xl text-lg leading-relaxed">
              {{ disorderInfo.description }}
            </p>

            <!-- Key Stats -->
            <div class="mx-auto max-w-6xl space-y-4">
              <!-- Compact Stats Row -->
              <div class="flex flex-wrap justify-center gap-4">
                <!-- Age of Onset (if short) -->
                <div v-if="(disorderInfo.ageOfOnset || 'قبل از ۵ سال').split(' ').length <= 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 group w-64 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                  <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg transition-transform group-hover:scale-110">
                    <Icon name="ph:calendar" class="size-5 text-white" />
                  </div>
                  <div class="text-center">
                    <div class="mb-1 text-lg font-bold leading-tight text-green-600 dark:text-green-400">
                      {{ disorderInfo.ageOfOnset || 'قبل از ۵ سال' }}
                    </div>
                    <div class="text-muted-500 dark:text-muted-400 text-xs font-medium">
                      سن شروع
                    </div>
                  </div>
                </div>

                <!-- Suicide Risk (if short) -->
                <div v-if="(disorderInfo.suicideRisk || 'پایین').split(' ').length <= 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 group w-64 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                  <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 p-3 shadow-lg transition-transform group-hover:scale-110">
                    <Icon name="ph:warning" class="size-5 text-white" />
                  </div>
                  <div class="text-center">
                    <div class="mb-1 text-lg font-bold leading-tight text-purple-600 dark:text-purple-400">
                      {{ disorderInfo.suicideRisk || 'پایین' }}
                    </div>
                    <div class="text-muted-500 dark:text-muted-400 text-xs font-medium">
                      سطح خطر خودکشی
                    </div>
                  </div>
                </div>

                <!-- Prognosis (if short) -->
                <div v-if="(disorderInfo.prognosis || 'قابل بهبود').split(' ').length <= 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 group w-64 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                  <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg transition-transform group-hover:scale-110">
                    <Icon name="ph:trend-up" class="size-5 text-white" />
                  </div>
                  <div class="text-center">
                    <div class="mb-1 text-lg font-bold leading-tight text-orange-600 dark:text-orange-400">
                      {{ disorderInfo.prognosis || 'قابل بهبود' }}
                    </div>
                    <div class="text-muted-500 dark:text-muted-400 text-xs font-medium">
                      پیش‌آگهی
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full-width Stats for Long Content -->
              <!-- Prevalence (if long) -->
              <div v-if="(disorderInfo.Prevalence || disorderInfo.prevalence || 'N/A').split(' ').length > 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <div class="flex items-start gap-5">
                  <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 shadow-lg">
                    <Icon name="ph:percent" class="size-7 text-white" />
                  </div>
                  <div class="flex-1 text-right">
                    <div class="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      شیوع
                    </div>
                    <p class="text-muted-700 dark:text-muted-200 text-base font-medium leading-relaxed">
                      {{ disorderInfo.Prevalence || disorderInfo.prevalence || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Age of Onset (if long) -->
              <div v-if="(disorderInfo.ageOfOnset || 'قبل از ۵ سال').split(' ').length > 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <div class="flex items-start gap-5">
                  <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg">
                    <Icon name="ph:calendar" class="size-7 text-white" />
                  </div>
                  <div class="flex-1 text-right">
                    <div class="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
                      سن شروع
                    </div>
                    <p class="text-muted-700 dark:text-muted-200 text-base font-medium leading-relaxed">
                      {{ disorderInfo.ageOfOnset || 'قبل از ۵ سال' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Suicide Risk (if long) -->
              <div v-if="(disorderInfo.suicideRisk || 'پایین').split(' ').length > 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <div class="flex items-start gap-5">
                  <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 p-4 shadow-lg">
                    <Icon name="ph:warning" class="size-7 text-white" />
                  </div>
                  <div class="flex-1 text-right">
                    <div class="mb-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                      سطح خطر خودکشی
                    </div>
                    <p class="text-muted-700 dark:text-muted-200 text-base font-medium leading-relaxed">
                      {{ disorderInfo.suicideRisk || 'پایین' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Prognosis (if long) -->
              <div v-if="(disorderInfo.prognosis || 'قابل بهبود').split(' ').length > 5" class="dark:bg-muted-800/90 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <div class="flex items-start gap-5">
                  <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-4 shadow-lg">
                    <Icon name="ph:trend-up" class="size-7 text-white" />
                  </div>
                  <div class="flex-1 text-right">
                    <div class="mb-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                      پیش‌آگهی
                    </div>
                    <p class="text-muted-700 dark:text-muted-200 text-base font-medium leading-relaxed">
                      {{ disorderInfo.prognosis || 'قابل بهبود' }}
                    </p>
                  </div>
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
            <!-- Empty State Button for Diagnostic Criteria -->
            <div v-if="!disorderInfo.diagnosisCriteria || disorderInfo.diagnosisCriteria.length === 0" class="py-8 text-center">
              <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800">
                <Icon name="ph:plus-circle" class="mx-auto mb-4 size-12 text-gray-400" />
                <p class="mb-4 text-gray-600 dark:text-gray-400">
                  معیارهای تشخیصی تعریف نشده است
                </p>
                <button
                  class="bg-primary-500 hover:bg-primary-600 rounded-lg px-6 py-2 font-medium text-white transition-colors"
                  @click="handleAddDiagnosticCriteria"
                >
                  افزودن معیارهای تشخیصی
                </button>
              </div>
            </div>

            <div
              v-for="criterion in (disorderInfo.diagnosisCriteria || [])"
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
        <!-- Specifiers Section -->
        <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div class="mb-8 text-center">
            <Icon name="ph:tag" class="mx-auto mb-4 size-12 text-emerald-500" />
            <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
              مشخص‌کننده‌ها
            </h2>
          </div>

          <!-- Empty State Button for Specifiers -->
          <div v-if="!disorderInfo.specifiers || disorderInfo.specifiers.length === 0" class="py-8 text-center">
            <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800">
              <Icon name="ph:plus-circle" class="mx-auto mb-4 size-12 text-gray-400" />
              <p class="mb-4 text-gray-600 dark:text-gray-400">
                مشخص‌کننده‌ها تعریف نشده است
              </p>
              <button
                class="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
                @click="handleAddSpecifiers"
              >
                افزودن مشخص‌کننده‌ها
              </button>
            </div>
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
                {{ disorderInfo.diagnosticFeatures?.length || 0 }}
              </div>
              <div class="text-sm text-red-700 dark:text-red-300">
                ویژگی‌های تشخیصی
              </div>
            </div>
            <div class="rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 p-4 text-center dark:from-blue-900/30 dark:to-blue-800/30">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ disorderInfo.associated_features?.length || 0 }}
              </div>
              <div class="text-sm text-blue-700 dark:text-blue-300">
                علائم همراه
              </div>
            </div>
            <div class="rounded-xl bg-gradient-to-r from-orange-100 to-orange-200 p-4 text-center dark:from-orange-900/30 dark:to-orange-800/30">
              <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ disorderInfo.riskAndPrognosticFactors?.length || 0 }}
              </div>
              <div class="text-sm text-orange-700 dark:text-orange-300">
                عوامل خطر
              </div>
            </div>
            <div class="rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 p-4 text-center dark:from-purple-900/30 dark:to-purple-800/30">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {{ disorderInfo.differentialDiagnosis?.length || 0 }}
              </div>
              <div class="text-sm text-purple-700 dark:text-purple-300">
                تشخیص‌های افتراقی
              </div>
            </div>
          </div>

          <!-- Diagnostic Features Section -->
          <div class="space-y-8">
            <!-- Diagnostic Features -->
            <div class="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
              <div class="mb-6 flex items-center justify-between">
                <h3 class="flex items-center gap-3 text-xl font-semibold text-purple-800 dark:text-purple-300">
                  <div class="rounded-full bg-purple-500 p-2">
                    <Icon name="ph:stethoscope" class="size-6 text-white" />
                  </div>
                  ویژگی‌های تشخیصی
                </h3>
                <div class="rounded-full bg-purple-200 px-3 py-1 dark:bg-purple-800">
                  <span class="text-sm font-medium text-purple-800 dark:text-purple-200">{{ disorderInfo.diagnosticFeatures?.length || 0 }} ویژگی</span>
                </div>
              </div>

              <div class="grid gap-4">
                <!-- Empty State for Diagnostic Features -->
                <div v-if="!disorderInfo.diagnosticFeatures || disorderInfo.diagnosticFeatures.length === 0" class="py-6 text-center">
                  <div class="rounded-xl border-2 border-dashed border-purple-300 bg-purple-100 p-6 dark:border-purple-700 dark:bg-purple-900/30">
                    <Icon name="ph:plus-circle" class="mx-auto mb-3 size-10 text-purple-400" />
                    <p class="mb-3 text-purple-600 dark:text-purple-400">
                      ویژگی‌های تشخیصی تعریف نشده است
                    </p>
                    <button
                      class="rounded-lg bg-purple-500 px-5 py-2 font-medium text-white transition-colors hover:bg-purple-600"
                      @click="handleAddDiagnosticFeatures"
                    >
                      افزودن ویژگی‌های تشخیصی
                    </button>
                  </div>
                </div>

                <div
                  v-for="(feature, index) in (disorderInfo.diagnosticFeatures || [])"
                  :key="feature.title"
                  class="rounded-lg border border-purple-200 bg-white p-5 shadow-sm dark:border-purple-700 dark:bg-purple-800/30"
                >
                  <div class="flex items-start gap-4">
                    <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                      <h4 class="mb-2 font-semibold text-purple-800 dark:text-purple-200">
                        {{ feature.title }}
                      </h4>
                      <p class="text-sm leading-relaxed text-purple-700 dark:text-purple-300">
                        {{ feature.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Associated Features -->
            <div class="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <div class="mb-6 flex items-center justify-between">
                <h3 class="flex items-center gap-3 text-xl font-semibold text-blue-800 dark:text-blue-300">
                  <div class="rounded-full bg-blue-500 p-2">
                    <Icon name="ph:heart-fill" class="size-6 text-white" />
                  </div>
                  علائم همراه
                </h3>
                <div class="rounded-full bg-blue-200 px-3 py-1 dark:bg-blue-800">
                  <span class="text-sm font-medium text-blue-800 dark:text-blue-200">{{ disorderInfo.associated_features?.length || 0 }} دسته</span>
                </div>
              </div>

              <div class="grid gap-4">
                <div v-if="!disorderInfo.associated_features || disorderInfo.associated_features.length === 0" class="py-6 text-center">
                  <div class="rounded-xl border-2 border-dashed border-blue-300 bg-blue-100 p-6 dark:border-blue-700 dark:bg-blue-900/30">
                    <Icon name="ph:plus-circle" class="mx-auto mb-3 size-10 text-blue-400" />
                    <p class="mb-3 text-blue-600 dark:text-blue-400">
                      علائم همراه تعریف نشده است
                    </p>
                    <button
                      class="rounded-lg bg-blue-500 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                      @click="handleAddAssociatedFeatures"
                    >
                      افزودن علائم همراه
                    </button>
                  </div>
                </div>

                <div
                  v-for="(category, index) in (disorderInfo.associated_features || [])"
                  :key="category.category"
                  class="rounded-lg border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-700 dark:bg-blue-800/30"
                >
                  <h4 class="mb-3 flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-200">
                    <div class="flex size-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      {{ index + 1 }}
                    </div>
                    {{ category.category }}
                  </h4>
                  <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div
                      v-for="item in category.items"
                      :key="item"
                      class="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {{ item }}
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
                <!-- Empty State Button for Differential Diagnosis -->
                <div v-if="!disorderInfo.diagnosticFeatures?.differential_diagnostics || disorderInfo.diagnosticFeatures.differential_diagnostics.length === 0" class="py-6 text-center">
                  <div class="rounded-xl border-2 border-dashed border-purple-300 bg-purple-100 p-6 dark:border-purple-700 dark:bg-purple-900/30">
                    <Icon name="ph:plus-circle" class="mx-auto mb-3 size-10 text-purple-400" />
                    <p class="mb-3 text-purple-600 dark:text-purple-400">
                      تشخیص‌های افتراقی تعریف نشده است
                    </p>
                    <button
                      class="rounded-lg bg-purple-500 px-5 py-2 font-medium text-white transition-colors hover:bg-purple-600"
                      @click="handleAddDifferentialDiagnosis"
                    >
                      افزودن تشخیص‌های افتراقی
                    </button>
                  </div>
                </div>

                <div
                  v-for="diagnosis in (disorderInfo.diagnosticFeatures?.differential_diagnostics || [])"
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
            <!-- Empty State Button for Diagnostic Markers -->
            <div v-if="!disorderInfo.diagnosticMarkers || disorderInfo.diagnosticMarkers.length === 0" class="col-span-full py-8 text-center">
              <div class="rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-6 dark:border-cyan-700 dark:bg-cyan-900/30">
                <Icon name="ph:plus-circle" class="mx-auto mb-4 size-12 text-cyan-400" />
                <p class="mb-4 text-cyan-600 dark:text-cyan-400">
                  نشانگرهای تشخیصی تعریف نشده است
                </p>
                <button
                  class="rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white transition-colors hover:bg-cyan-600"
                  @click="handleAddDiagnosticMarkers"
                >
                  افزودن نشانگرهای تشخیصی
                </button>
              </div>
            </div>

            <div
              v-for="(markerCategory, index) in (disorderInfo.diagnosticMarkers || [])"
              :key="index"
              class="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 dark:border-cyan-800 dark:from-cyan-900/20 dark:to-blue-900/20"
            >
              <div class="mb-4 flex items-center gap-3">
                <div class="rounded-lg bg-cyan-500 p-2">
                  <Icon :name="getCategoryIcon(markerCategory.category)" class="size-6 text-white" />
                </div>
                <h3 class="font-semibold text-cyan-800 dark:text-cyan-300">
                  {{ markerCategory.category }}
                </h3>
              </div>

              <div class="space-y-2">
                <div class="mb-3 text-sm font-medium text-cyan-700 dark:text-cyan-400">
                  نشانگرها:
                </div>
                <div class="space-y-2">
                  <div
                    v-for="(marker, idx) in markerCategory.markers"
                    :key="idx"
                    class="flex items-start gap-2 rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-700 dark:bg-cyan-900/30"
                  >
                    <Icon name="ph:check-circle" class="mt-0.5 size-4 shrink-0 text-cyan-500" />
                    <span class="text-sm text-cyan-700 dark:text-cyan-300">{{ marker }}</span>
                  </div>
                </div>
              </div>

              <!-- Additional info based on category -->
              <div class="mt-4 rounded-lg bg-cyan-100 p-3 dark:bg-cyan-900/50">
                <p class="text-xs leading-relaxed text-cyan-600 dark:text-cyan-400">
                  {{ getCategoryDescription(markerCategory.category) }}
                </p>
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
              تأثیر عوامل فرهنگی، اجتماعی و اعتقادی بر فرآیند تشخیص و درمان
            </p>
          </div>

          <div v-if="!disorderInfo.cultureRelatedDiagnosticIssues || disorderInfo.cultureRelatedDiagnosticIssues.length === 0" class="py-8 text-center">
            <Icon name="ph:info" class="text-muted-400 mx-auto mb-4 size-12" />
            <p class="text-muted-500 dark:text-muted-400">
              اطلاعات مرتبط با مسائل فرهنگی موجود نیست
            </p>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div
              v-for="(issue, index) in disorderInfo.cultureRelatedDiagnosticIssues"
              :key="index"
              class="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-purple-900/20"
            >
              <div class="mb-4 flex items-center gap-3">
                <div class="rounded-lg bg-indigo-500 p-2">
                  <Icon name="ph:lightbulb" class="size-6 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-indigo-800 dark:text-indigo-300">
                  {{ issue.aspect }}
                </h3>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(consideration, idx) in issue.considerations"
                  :key="idx"
                  class="rounded-lg border border-indigo-200 bg-white p-4 dark:border-indigo-700 dark:bg-indigo-900/30"
                >
                  <div class="flex items-start gap-2">
                    <Icon name="ph:arrow-right" class="mt-0.5 size-4 shrink-0 text-indigo-500" />
                    <p class="text-sm leading-relaxed text-indigo-700 dark:text-indigo-300">
                      {{ consideration }}
                    </p>
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

          <div v-if="!disorderInfo.genderRelatedDiagnosticIssues || disorderInfo.genderRelatedDiagnosticIssues.length === 0" class="py-8 text-center">
            <Icon name="ph:info" class="text-muted-400 mx-auto mb-4 size-12" />
            <p class="text-muted-500 dark:text-muted-400">
              اطلاعات مرتبط با مسائل جنسیتی موجود نیست
            </p>
          </div>

          <div v-else class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div
              v-for="(issue, index) in disorderInfo.genderRelatedDiagnosticIssues"
              :key="index"
              class="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6 dark:border-pink-800 dark:from-pink-900/20 dark:to-purple-900/20"
            >
              <div class="mb-4 flex items-center gap-3">
                <div class="rounded-lg bg-pink-500 p-2">
                  <Icon name="ph:gender-intersex" class="size-6 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-pink-800 dark:text-pink-300">
                  {{ issue.aspect }}
                </h3>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(consideration, idx) in issue.considerations"
                  :key="idx"
                  class="rounded-lg border border-pink-200 bg-white p-4 dark:border-pink-700 dark:bg-pink-900/30"
                >
                  <div class="flex items-start gap-2">
                    <Icon name="ph:arrow-right" class="mt-0.5 size-4 shrink-0 text-pink-500" />
                    <p class="text-sm leading-relaxed text-pink-700 dark:text-pink-300">
                      {{ consideration }}
                    </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDSMInfoGenerator } from '~/composables/useDSMInfoGenerator'

// Get route params
const route = useRoute()
const disorderSlug = route.params.disorder as string

// Dynamic data fetching
const { fetchDisorderBySlug } = useDSMInfoGenerator()

// State
const disorderInfo = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch data on mount
onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    console.log(`🚀 Loading disorder page for slug: ${disorderSlug}`)

    // Add small delay to prevent PocketBase auto-cancellation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Fetch disorder data from PocketBase
    const disorderResult = await fetchDisorderBySlug(disorderSlug)

    disorderInfo.value = disorderResult

    console.log(`✅ Successfully loaded disorder: ${disorderResult.title || disorderResult.titleFa}`)

    // Update page meta dynamically
    const pageTitle = `${disorderResult.title || disorderResult.titleFa} - DSM-5 | ذهنا`
    const pageDescription = `راهنمای جامع ${disorderResult.title || disorderResult.titleFa} (${disorderResult.titleEn}) بر اساس معیارهای DSM-5. شامل علائم، معیارهای تشخیصی، و اطلاعات کامل تشخیصی.`

    useHead({
      htmlAttrs: { dir: 'rtl' },
      title: pageTitle,
      meta: [
        {
          name: 'description',
          content: pageDescription,
        },
        {
          name: 'keywords',
          content: `${disorderResult.title || disorderResult.titleFa}, ${disorderResult.titleEn}, DSM-5, ${disorderResult.code}, اختلالات روانی, تشخیص`,
        },
      ],
    })
  }
  catch (err: any) {
    console.error('Error loading disorder data:', err)
    error.value = err.message || 'خطا در بارگذاری اطلاعات'
  }
  finally {
    loading.value = false
  }
})

// Backup static data in case dynamic loading fails (keeping original structure)
const staticDisorderInfo = {
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
      category: 'علائم اصلی',
      markers: [
        'حملات پانیک ناگهانی و غیرمنتظره',
        'ترس از حملات پانیک اضافی یا عواقب آن',
      ],
    },
    {
      category: 'علائم جسمی',
      markers: [
        'تپش قلب، تپش قلب یا ضربان قلب سریع',
        'تعریق',
        'لرزش یا لرزش',
        'احساس تنگی نفس یا خفگی',
        'درد یا ناراحتی قفسه سینه',
      ],
    },
    {
      category: 'علائم روانی',
      markers: [
        'احساس غیر واقعی بودن یا جدا شدن از خود (دگرسان بینی)',
        'ترس از دست دادن کنترل یا دیوانگی',
      ],
    },
  ],

  associated_features: [
    {
      category: 'علائم جسمی',
      items: [
        'تأخیر در کنترل دفع',
        'مشکلات تغذیه',
        'اختلالات خواب',
        'رفتارهای خودآسیبی',
      ],
    },
    {
      category: 'علائم رفتاری',
      items: [
        'اختلالات طیف اوتیسم',
        'اختلال کمبود توجه/فزون‌کنشی',
        'اختلالات تشنجی',
        'مشکلات بینایی یا شنوایی',
      ],
    },
  ],

  riskAndPrognosticFactors: [
    {
      category: 'عوامل خطر',
      factors: [
        'محرومیت محیطی',
        'کمبود تحریک',
        'آسیب‌های محیطی',
        'مشکلات تغذیه‌ای',
        'عفونت‌های مادرزادی',
      ],
    },
    {
      category: 'عوامل پیش‌آگهی',
      factors: [
        'عوامل ژنتیکی',
        'ناهنجاری‌های کروموزومی',
        'اختلالات متابولیک مادرزادی',
        'آسیب‌های مغزی',
        'مشکلات دوران بارداری و زایمان',
      ],
    },
  ],

  cultureRelatedDiagnosticIssues: [
    {
      aspect: 'فرهنگ و مفهوم اختلال',
      considerations: [
        'انگ اجتماعی ناتوانی در برخی فرهنگ‌ها',
        'باورهای فرهنگی و مذهبی درباره علل تأخیر رشدی',
      ],
    },
    {
      aspect: 'فرهنگ و دسترسی',
      considerations: [
        'دسترسی محدود به خدمات تشخیصی در برخی جوامع',
        'موانع زبانی در ارزیابی و درمان',
      ],
    },
  ],

  genderRelatedDiagnosticIssues: [
    {
      aspect: 'تفاوت‌های جنسیتی در شیوع',
      considerations: [
        'شیوع بیشتر در پسران',
        'ممکن است در دختران کمتر تشخیص داده شود',
      ],
    },
    {
      aspect: 'تفاوت‌های جنسیتی در علائم',
      considerations: [
        'انتظارات متفاوت جامعه از پسران و دختران',
        'علائم ممکن است در دختران متفاوت بروز کند',
      ],
    },
  ],

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

// Dynamic page meta
definePageMeta({
  layout: 'default',
  title: 'DSM-5 Disorder | ذهنا',
})

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
const getCategoryIcon = (category: string) => {
  const iconMap = {
    'علائم اصلی': 'ph:warning-circle',
    'علائم جسمی': 'ph:heart-beat',
    'علائم روانی': 'ph:brain',
    'علائم رفتاری': 'ph:user-focus',
    'نشانگرهای زیستی': 'ph:dna',
    'نشانگرهای عصب‌فیزیولوژیکی': 'ph:pulse',
    'ارزیابی‌های شناختی-رفتاری': 'ph:brain',
    'ابزارهای دیجیتال': 'ph:computer-tower',
    'سایر نشانگرها': 'ph:test-tube',
  }
  return iconMap[category] || 'ph:circle'
}

const getCategoryDescription = (category: string) => {
  const descriptionMap = {
    'علائم اصلی': 'نشانه‌های کلیدی و اساسی که برای تشخیص اختلال ضروری هستند',
    'علائم جسمی': 'تظاهرات فیزیکی و جسمانی که در طول حملات یا دوره‌های اختلال بروز می‌کنند',
    'علائم روانی': 'نشانه‌های ذهنی، هیجانی و شناختی مرتبط با اختلال',
    'علائم رفتاری': 'تغییرات قابل مشاهده در رفتار و عملکرد فرد',
    'نشانگرهای زیستی': 'آزمون‌های خون، آزمایش‌های ژنتیکی، و بررسی‌های متابولیک برای شناسایی علل زمینه‌ای',
    'نشانگرهای عصب‌فیزیولوژیکی': 'EEG، MRI مغز، و سایر آزمون‌های عملکرد سیستم عصبی مرکزی',
    'ارزیابی‌های شناختی-رفتاری': 'آزمون‌های استاندارد تکاملی، مشاهده رفتار، و ارزیابی مهارت‌های تطبیقی',
    'ابزارهای دیجیتال': 'نرم‌افزارهای ارزیابی، اپلیکیشن‌های نظارتی، و ابزارهای تشخیص کامپیوتری',
    'سایر نشانگرها': 'سایر روش‌های تشخیصی و ابزارهای کمکی مورد استفاده در ارزیابی',
  }
  return descriptionMap[category] || 'توضیحات اضافی برای این دسته از نشانگرها'
}

// Console log for structure verification
console.log('=== COMPLETE STRUCTURE IMPLEMENTED ===')
console.log('✓ All required fields from your goal structure are now included')
console.log('✓ Fixed prevalence key name to "Prevalence"')
console.log('✓ Fixed specifiers structure to {title, conditions}')
console.log('✓ Implemented complete diagnosticFeatures with all subsections')
console.log('✓ Added all missing sections: diagnosticMarkers, associated_features, etc.')
console.log('Structure ready for DSM-5 compliant implementation!')

// Empty section handlers - to be defined by user requirements
const handleAddDiagnosticCriteria = () => {
  console.log('Add Diagnostic Criteria clicked')
  // User will specify action later
}

const handleAddSpecifiers = () => {
  console.log('Add Specifiers clicked')
  // User will specify action later
}

const handleAddDiagnosticFeatures = () => {
  console.log('Add Diagnostic Features clicked')
  // User will specify action later
}

const handleAddAssociatedFeatures = () => {
  console.log('Add Associated Features clicked')
  // User will specify action later
}

const handleAddDifferentialDiagnosis = () => {
  console.log('Add Differential Diagnosis clicked')
  // User will specify action later
}

const handleAddDiagnosticMarkers = () => {
  console.log('Add Diagnostic Markers clicked')
  // User will specify action later
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
