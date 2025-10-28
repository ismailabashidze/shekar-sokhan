<template>
  <div class="from-primary-50 to-success-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br via-white">
    <!-- Header Section with Glassmorphism -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.primary.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.success.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.blue.400) 0%, transparent 50%)" />
      </div>

      <div class="container relative mx-auto max-w-7xl px-4 py-12">
        <!-- Navigation Breadcrumb and Theme Toggle -->
        <div class="mb-8 flex items-center justify-between">
          <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
            <Icon name="ph:house" class="size-4" />
            <span
              class="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-200"
              @click="$router.push('/therapy-journey/welcome')"
            >
              سفر درمانی
            </span>
            <Icon name="ph:caret-left" class="size-3" />
            <span class="text-primary-600 dark:text-primary-400 font-medium">اختلالات پیشنهادی</span>
          </div>

          <!-- Theme Toggle -->
          <div class="flex items-center gap-3">
            <BaseThemeToggle />
          </div>
        </div>

        <!-- Main Header -->
        <div class="mb-8 text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm">
            <div class="from-primary-500 to-primary-600 rounded-full bg-gradient-to-r p-2">
              <Icon name="ph:brain" class="size-6 text-white" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                تحلیل تخصصی DSM-5
              </div>
              <div class="text-muted-800 font-bold dark:text-white">
                اختلالات پیشنهادی جهت بررسی
              </div>
            </div>
          </div>

          <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
            نتایج ارزیابی شما
          </h1>

          <!-- Stats Cards -->
          <div class="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mb-3 flex items-center justify-center">
                <div class="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                  <Icon name="ph:folder-open" class="size-6 text-white" />
                </div>
              </div>
              <div class="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ disorderCategories.length }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                دسته‌بندی DSM-5
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mb-3 flex items-center justify-center">
                <div class="from-success-500 to-success-600 rounded-full bg-gradient-to-r p-3">
                  <Icon name="ph:stethoscope" class="size-6 text-white" />
                </div>
              </div>
              <div class="text-success-600 dark:text-success-400 mb-1 text-3xl font-bold">
                {{ totalDisorders }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                اختلال شناسایی شده
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mb-3 flex items-center justify-center">
                <div class="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                  <Icon name="ph:chart-line-up" class="size-6 text-white" />
                </div>
              </div>
              <div class="mb-1 text-3xl font-bold text-purple-600 dark:text-purple-400">
                {{ Math.round((totalDisorders / (disorderCategories.length * 5)) * 100) || 0 }}%
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                درصد جامعیت
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto max-w-7xl px-4 pb-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-12">
        <!-- Loading Header -->
        <div class="mb-12 text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
            <div class="relative">
              <div class="from-primary-500 to-primary-600 rounded-full bg-gradient-to-r p-2">
                <Icon name="ph:brain" class="size-6 text-white" />
              </div>
              <!-- Pulse Animation -->
              <div class="bg-primary-400/30 absolute inset-0 animate-ping rounded-full" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                در حال بارگذاری...
              </div>
              <div class="text-muted-800 font-bold dark:text-white">
                اختلالات تشخیصی DSM-5
              </div>
            </div>
          </div>

          <div class="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div class="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <Icon name="ph:clock" class="size-4 shrink-0 animate-spin" />
              <span>در حال بارگذاری اطلاعات تشخیصی شما...</span>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton Cards -->
        <div class="space-y-8">
          <div
            v-for="n in 3"
            :key="n"
            class="dark:bg-muted-800/90 dark:border-muted-700/50 animate-pulse overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm"
          >
            <!-- Skeleton Header -->
            <div class="from-muted-200 to-muted-300 dark:from-muted-700 dark:to-muted-800 bg-gradient-to-br p-8">
              <div class="mb-6 flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <div class="rounded-2xl bg-white/20 p-4">
                    <div class="size-10 rounded bg-white/30" />
                  </div>
                  <div>
                    <div class="mb-2 h-8 w-48 rounded bg-white/30" />
                    <div class="h-4 w-32 rounded bg-white/20" />
                  </div>
                </div>
                <div class="rounded-full bg-white/20 p-4">
                  <div class="h-8 w-16 rounded bg-white/30" />
                </div>
              </div>
              <div class="rounded-2xl bg-white/10 p-4">
                <div class="h-16 rounded bg-white/20" />
              </div>
            </div>

            <!-- Skeleton Content -->
            <div class="p-8">
              <div class="space-y-4">
                <div
                  v-for="i in 2"
                  :key="i"
                  class="from-muted-100 to-muted-50 dark:from-muted-700 dark:to-muted-800 border-muted-200/50 dark:border-muted-600/50 rounded-2xl border bg-gradient-to-r p-6"
                >
                  <div class="mb-4 flex items-center justify-between">
                    <div class="flex flex-1 items-center gap-4">
                      <div class="bg-primary-100 dark:bg-primary-900/50 rounded-xl p-2">
                        <div class="bg-primary-300 dark:bg-primary-700 size-5 rounded" />
                      </div>
                      <div class="bg-primary-200 dark:bg-primary-800 rounded-xl px-4 py-2">
                        <div class="bg-primary-400 dark:bg-primary-600 h-3 w-20 rounded" />
                      </div>
                      <div class="flex-1">
                        <div class="bg-muted-300 dark:bg-muted-600 mb-2 h-6 w-3/4 rounded" />
                        <div class="bg-muted-200 dark:bg-muted-700 h-4 w-full rounded" />
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div class="rounded-lg bg-blue-100 px-3 py-2 dark:bg-blue-900/30">
                        <div class="mb-1 h-3 w-12 rounded bg-blue-300 dark:bg-blue-700" />
                        <div class="h-4 w-16 rounded bg-blue-400 dark:bg-blue-600" />
                      </div>
                      <div class="rounded-lg bg-green-100 px-3 py-2 dark:bg-green-900/30">
                        <div class="h-3 w-16 rounded bg-green-400 dark:bg-green-700" />
                      </div>
                    </div>
                  </div>
                  <div class="border-muted-200 dark:border-muted-600 border-t pt-4">
                    <div class="flex items-center gap-6">
                      <div class="bg-muted-300 dark:bg-muted-600 h-4 w-24 rounded" />
                      <div class="bg-muted-300 dark:bg-muted-600 h-4 w-20 rounded" />
                      <div class="bg-muted-300 dark:bg-muted-600 h-4 w-20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="loadingError" class="py-20 text-center">
        <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mx-auto max-w-lg rounded-3xl border border-white/20 bg-white/80 p-12 shadow-2xl backdrop-blur-sm">
          <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 p-6 dark:from-red-900/50 dark:to-red-800/50">
            <Icon name="ph:warning-circle" class="size-12 text-red-500 dark:text-red-400" />
          </div>
          <h3 class="mb-3 text-2xl font-bold text-red-700 dark:text-red-300">
            خطا در بارگذاری اطلاعات
          </h3>
          <p class="mb-6 leading-relaxed text-red-600 dark:text-red-400">
            {{ loadingError }}
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <BaseButton
              color="danger"
              size="lg"
              class="bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
              @click="retryLoading"
            >
              <div class="flex items-center gap-2">
                <Icon name="ph:arrow-clockwise" class="size-4" />
                <span>تلاش مجدد</span>
              </div>
            </BaseButton>
            <BaseButton
              color="white"
              size="lg"
              class="border-muted-200 border-2 bg-white/90 shadow-lg transition-all duration-300 hover:scale-105 hover:border-red-300 hover:bg-white hover:shadow-xl"
              @click="$router.push('/therapy-journey/wait')"
            >
              <div class="text-muted-700 flex items-center gap-2 hover:text-red-600">
                <Icon name="ph:arrow-left" class="size-4" />
                <span>بازگشت به ارزیابی</span>
              </div>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div v-else-if="disorderCategories.length > 0" class="space-y-12">
        <div
          v-for="(category, categoryIndex) in disorderCategories"
          :key="categoryIndex"
          class="group relative"
        >
          <!-- Category Card with Advanced Design -->
          <div class="dark:bg-muted-800/90 dark:border-muted-700/50 hover:shadow-3xl overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]">
            <!-- Category Header with Gradient -->
            <div class="relative overflow-hidden">
              <!-- Dynamic gradient based on category index -->
              <div
                class="relative z-10 p-8 text-white"
                :class="getCategoryGradient(categoryIndex)"
              >
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-10">
                  <div class="absolute inset-0" style="background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)" />
                </div>

                <div class="relative z-10">
                  <div class="mb-6 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                      <!-- Enhanced Icon -->
                      <div class="relative">
                        <div class="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
                          <Icon :name="getCategoryIcon(categoryIndex)" class="size-10" />
                        </div>
                        <!-- Pulse Animation -->
                        <div class="absolute inset-0 animate-ping rounded-2xl bg-white/20" />
                      </div>

                      <div>
                        <h2 class="mb-2 text-3xl font-bold drop-shadow-sm">
                          {{ category.categoryTitleFa }}
                        </h2>
                        <p class="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
                          {{ category.categoryTitle }}
                        </p>
                      </div>
                    </div>

                    <!-- Enhanced Stats -->
                    <div class="text-right">
                      <div class="rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <div class="text-2xl font-bold">
                          {{ category.disorders.length }}
                        </div>
                        <div class="text-xs text-white/80">
                          اختلال شناسایی شده
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Enhanced Description -->
                  <div class="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <p class="leading-relaxed text-white/90">
                      {{ category.categoryDescription }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Disorders Grid -->
            <div class="p-8">
              <div class="grid gap-6">
                <div
                  v-for="(disorder, disorderIndex) in category.disorders"
                  :key="disorderIndex"
                  class="group relative"
                >
                  <!-- Enhanced Disorder Card -->
                  <div class="to-muted-50/50 dark:from-muted-700 dark:to-muted-800 border-muted-200/50 dark:border-muted-600/50 overflow-hidden rounded-2xl border bg-gradient-to-r from-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <!-- Disorder Header with Better Design -->
                    <div
                      class="hover:bg-muted-50/80 dark:hover:bg-muted-700/80 cursor-pointer p-6 transition-all duration-300"
                      @click="toggleDisorder(categoryIndex, disorderIndex)"
                    >
                      <div class="flex items-center justify-between">
                        <!-- Left Section -->
                        <div class="flex flex-1 items-center gap-4">
                          <!-- Expand/Collapse Icon with Animation -->
                          <div class="relative">
                            <div class="bg-primary-100 dark:bg-primary-900/50 rounded-xl p-2 transition-all duration-300">
                              <Icon
                                :name="isExpanded(categoryIndex, disorderIndex) ? 'ph:caret-down' : 'ph:caret-left'"
                                class="text-primary-600 dark:text-primary-400 size-5 transition-transform duration-300"
                                :class="{ 'rotate-90': isExpanded(categoryIndex, disorderIndex) }"
                              />
                            </div>
                          </div>

                          <!-- DSM Code Badge -->
                          <div class="from-primary-500 to-primary-600 rounded-xl bg-gradient-to-r px-4 py-2 text-white shadow-md">
                            <div class="font-mono text-xs font-bold tracking-wide">
                              {{ disorder.code }}
                            </div>
                          </div>

                          <!-- Disorder Info -->
                          <div class="flex-1">
                            <h3 class="text-muted-800 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 text-xl font-bold transition-colors dark:text-white">
                              {{ disorder.title }}
                            </h3>
                            <p class="text-muted-600 dark:text-muted-400 line-clamp-2 text-sm leading-relaxed">
                              {{ disorder.description }}
                            </p>
                          </div>
                        </div>

                        <!-- Right Section - Stats and Risk -->
                        <div class="mr-4 shrink-0 space-y-3 text-right">
                          <!-- Prevalence -->
                          <div class="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/30">
                            <div class="text-xs font-medium text-blue-600 dark:text-blue-400">
                              شیوع
                            </div>
                            <div class="text-sm font-bold text-blue-700 dark:text-blue-300">
                              {{ disorder.Prevalence?.match(/\d+%?/)?.[0] || 'متغیر' }}
                            </div>
                          </div>

                          <!-- Suicide Risk Badge -->
                          <div
                            class="flex items-center justify-end gap-2 rounded-lg px-3 py-2 text-xs font-bold"
                            :class="getSuicideRiskClass(disorder.suicideRisk)"
                          >
                            <Icon :name="getSuicideRiskIcon(disorder.suicideRisk)" class="size-4" />
                            <span>{{ getSuicideRiskLabel(disorder.suicideRisk) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Quick Stats Row -->
                      <div class="border-muted-200 dark:border-muted-600 mt-4 border-t pt-4">
                        <div class="flex items-center gap-6 text-sm">
                          <!-- Criteria Count -->
                          <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2">
                            <Icon name="ph:list-checks" class="size-4 text-green-500" />
                            <span>{{ disorder.diagnosisCriteria?.length || 0 }} معیار تشخیصی</span>
                          </div>

                          <!-- Specifiers Count -->
                          <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2">
                            <Icon name="ph:tag" class="size-4 text-blue-500" />
                            <span>{{ disorder.specifiers?.length || 0 }} مشخصه</span>
                          </div>

                          <!-- Markers Count -->
                          <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2">
                            <Icon name="ph:flask" class="size-4 text-purple-500" />
                            <span>{{ disorder.diagnosticMarkers?.length || 0 }} نشانگر</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Disorder Details (Expandable with Smooth Animation) -->
                    <Transition
                      enter-active-class="transition-all duration-500 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-screen"
                      leave-active-class="transition-all duration-300 ease-in"
                      leave-from-class="opacity-100 max-h-screen"
                      leave-to-class="opacity-0 max-h-0"
                    >
                      <div v-if="isExpanded(categoryIndex, disorderIndex)" class="border-muted-200/50 dark:border-muted-600/50 from-muted-25 dark:from-muted-800/50 dark:to-muted-700 border-t bg-gradient-to-b to-white">
                        <div class="space-y-8 p-8">
                          <!-- Basic Information -->
                          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="space-y-4">
                              <div>
                                <h4 class="text-muted-700 dark:text-muted-300 mb-2 flex items-center gap-2 font-medium">
                                  <Icon name="ph:clipboard-text" class="size-4" />
                                  حداقل معیارهای تشخیص
                                </h4>
                                <p class="text-muted-600 dark:text-muted-400 bg-muted-50 dark:bg-muted-800 rounded p-3 text-sm">
                                  {{ disorder.minimumCriteria }}
                                </p>
                              </div>

                              <div>
                                <h4 class="text-muted-700 dark:text-muted-300 mb-2 flex items-center gap-2 font-medium">
                                  <Icon name="ph:info" class="size-4" />
                                  نکته ویژه
                                </h4>
                                <p class="text-muted-600 dark:text-muted-400 bg-muted-50 dark:bg-muted-800 rounded p-3 text-sm">
                                  {{ disorder.specialNote }}
                                </p>
                              </div>
                            </div>

                            <div class="space-y-4">
                              <div>
                                <h4 class="text-muted-700 dark:text-muted-300 mb-2 flex items-center gap-2 font-medium">
                                  <Icon name="ph:trend-up" class="size-4" />
                                  توسعه و سیر
                                </h4>
                                <p class="text-muted-600 dark:text-muted-400 bg-muted-50 dark:bg-muted-800 rounded p-3 text-sm">
                                  {{ disorder.developmentAndCourse }}
                                </p>
                              </div>

                              <div>
                                <h4 class="text-muted-700 dark:text-muted-300 mb-2 flex items-center gap-2 font-medium">
                                  <Icon name="ph:warning" class="size-4" />
                                  خطر خودکشی
                                </h4>
                                <p
                                  class="rounded p-3 text-sm"
                                  :class="getSuicideRiskDetailClass(disorder.suicideRisk)"
                                >
                                  {{ disorder.suicideRisk }}
                                </p>
                              </div>
                            </div>
                          </div>

                          <!-- Diagnosis Criteria -->
                          <div v-if="disorder.diagnosisCriteria && disorder.diagnosisCriteria.length > 0">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-3 flex items-center gap-2 font-medium">
                              <Icon name="ph:list-checks" class="size-4" />
                              معیارهای تشخیصی DSM-5
                            </h4>
                            <div class="space-y-3">
                              <div
                                v-for="(criteria, idx) in disorder.diagnosisCriteria"
                                :key="idx"
                                class="border-muted-200 dark:border-muted-600 rounded-lg border p-4"
                              >
                                <div class="flex items-start gap-3">
                                  <div class="bg-primary-500 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                                    {{ criteria.alphabet }}
                                  </div>
                                  <div class="flex-1">
                                    <p class="text-muted-700 dark:text-muted-300">
                                      {{ criteria.description }}
                                    </p>
                                    <div v-if="criteria.subsets && criteria.subsets.length > 0" class="mt-2 space-y-1">
                                      <div
                                        v-for="subset in criteria.subsets"
                                        :key="subset.number"
                                        class="text-muted-600 dark:text-muted-400 flex items-start gap-2 text-sm"
                                      >
                                        <span class="bg-muted-200 dark:bg-muted-700 shrink-0 rounded px-2 py-1 text-xs font-medium">
                                          {{ subset.number }}
                                        </span>
                                        <span>{{ subset.description }}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Specifiers -->
                          <div v-if="disorder.specifiers && disorder.specifiers.length > 0">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-3 flex items-center gap-2 font-medium">
                              <Icon name="ph:tag" class="size-4" />
                              مشخصه‌ها
                            </h4>
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div
                                v-for="specifier in disorder.specifiers"
                                :key="specifier.title"
                                class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4"
                              >
                                <h5 class="text-muted-700 dark:text-muted-300 mb-2 font-medium">
                                  {{ specifier.title }}
                                </h5>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="condition in specifier.conditions"
                                    :key="condition"
                                    class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full px-2 py-1 text-xs"
                                  >
                                    {{ condition }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Diagnostic Features -->
                          <div v-if="disorder.diagnosticFeatures">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-4 flex items-center gap-2 font-medium">
                              <Icon name="ph:magnifying-glass" class="size-4" />
                              ویژگی‌های تشخیصی
                            </h4>

                            <!-- Core Symptoms -->
                            <div v-if="disorder.diagnosticFeatures.core_symptoms" class="mb-6">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
                                علائم اصلی
                              </h5>

                              <!-- Mandatory Symptoms -->
                              <div v-if="disorder.diagnosticFeatures.core_symptoms.mandatory" class="mb-4">
                                <h6 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  علائم اجباری
                                </h6>
                                <div class="space-y-2">
                                  <div
                                    v-for="symptom in disorder.diagnosticFeatures.core_symptoms.mandatory"
                                    :key="symptom.symptom"
                                    class="flex items-start gap-3 rounded border-r-4 border-red-500 bg-red-50 p-3 dark:bg-red-900/20"
                                  >
                                    <Icon name="ph:star-fill" class="mt-0.5 size-4 shrink-0 text-red-500" />
                                    <div>
                                      <div class="font-medium text-red-700 dark:text-red-300">
                                        {{ symptom.symptom }}
                                      </div>
                                      <div class="text-sm text-red-600 dark:text-red-400">
                                        {{ symptom.description }}
                                      </div>
                                      <div class="mt-1 text-xs text-red-500 dark:text-red-500">
                                        {{ symptom.quantification }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- Associated Symptoms -->
                              <div v-if="disorder.diagnosticFeatures.core_symptoms.associated" class="mb-4">
                                <h6 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  علائم مرتبط
                                </h6>
                                <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div
                                    v-for="symptom in disorder.diagnosticFeatures.core_symptoms.associated"
                                    :key="symptom.symptom"
                                    class="flex items-start gap-3 rounded bg-blue-50 p-3 dark:bg-blue-900/20"
                                  >
                                    <Icon
                                      :name="getSymptomCategoryIcon(symptom.category)"
                                      class="mt-0.5 size-4 shrink-0 text-blue-500"
                                    />
                                    <div>
                                      <div class="font-medium text-blue-700 dark:text-blue-300">
                                        {{ symptom.symptom }}
                                      </div>
                                      <div class="text-sm text-blue-600 dark:text-blue-400">
                                        {{ symptom.description }}
                                      </div>
                                      <div class="mt-1 text-xs capitalize text-blue-500 dark:text-blue-500">
                                        {{ symptom.category }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Temporal Pattern -->
                            <div v-if="disorder.diagnosticFeatures.temporal_pattern" class="mb-6">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
                                الگوی زمانی
                              </h5>
                              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
                                <div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                  <div v-if="disorder.diagnosticFeatures.temporal_pattern.duration">
                                    <div class="text-muted-500 text-xs">
                                      مدت زمان
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                                      {{ disorder.diagnosticFeatures.temporal_pattern.duration }}
                                    </div>
                                  </div>
                                  <div v-if="disorder.diagnosticFeatures.temporal_pattern.frequency">
                                    <div class="text-muted-500 text-xs">
                                      فراوانی
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                                      {{ disorder.diagnosticFeatures.temporal_pattern.frequency }}
                                    </div>
                                  </div>
                                  <div v-if="disorder.diagnosticFeatures.temporal_pattern.onset">
                                    <div class="text-muted-500 text-xs">
                                      شروع
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                                      {{ disorder.diagnosticFeatures.temporal_pattern.onset }}
                                    </div>
                                  </div>
                                  <div v-if="disorder.diagnosticFeatures.temporal_pattern.remission">
                                    <div class="text-muted-500 text-xs">
                                      بهبودی
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                                      {{ disorder.diagnosticFeatures.temporal_pattern.remission }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Functional Impairment -->
                            <div v-if="disorder.diagnosticFeatures.functional_impairment" class="mb-6">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
                                اختلال عملکردی
                              </h5>
                              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
                                <div class="mb-3 flex flex-wrap gap-2">
                                  <span
                                    v-for="domain in disorder.diagnosticFeatures.functional_impairment.domains"
                                    :key="domain"
                                    class="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                  >
                                    {{ getFunctionalDomainLabel(domain) }}
                                  </span>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="level in disorder.diagnosticFeatures.functional_impairment.severity_levels"
                                    :key="level"
                                    class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                  >
                                    {{ getSeverityLabel(level) }}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <!-- Contextual Factors -->
                            <div v-if="disorder.diagnosticFeatures.contextual_factors && disorder.diagnosticFeatures.contextual_factors.length > 0" class="mb-6">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
                                عوامل زمینه‌ای (بعنوان نمونه)
                              </h5>
                              <div class="space-y-3">
                                <div
                                  v-for="factor in disorder.diagnosticFeatures.contextual_factors"
                                  :key="factor.factor"
                                  class="rounded-lg border-r-4 border-purple-500 bg-purple-50 p-4 dark:bg-purple-900/20"
                                >
                                  <div class="mb-1 font-medium text-purple-700 dark:text-purple-300">
                                    {{ factor.factor }}
                                  </div>
                                  <div class="mb-2 text-sm text-purple-600 dark:text-purple-400">
                                    {{ factor.impact_description }}
                                  </div>
                                  <div class="inline-block rounded bg-purple-100 px-2 py-1 text-xs text-purple-500 dark:bg-purple-800/50 dark:text-purple-500">
                                    {{ getContextTypeLabel(factor.type) }}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Differential Diagnostics -->
                            <div v-if="disorder.diagnosticFeatures.differential_diagnostics && disorder.diagnosticFeatures.differential_diagnostics.length > 0">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-3 font-medium">
                                تشخیص افتراقی
                              </h5>
                              <div class="space-y-3">
                                <div
                                  v-for="diff in disorder.diagnosticFeatures.differential_diagnostics"
                                  :key="diff.disorder"
                                  class="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20"
                                >
                                  <div class="mb-2 font-medium text-yellow-700 dark:text-yellow-300">
                                    {{ diff.disorder }}
                                  </div>
                                  <div class="space-y-2">
                                    <div
                                      v-for="feature in diff.distinguishing_features"
                                      :key="feature.feature"
                                      class="text-sm"
                                    >
                                      <div class="font-medium text-yellow-600 dark:text-yellow-400">
                                        {{ feature.feature }}
                                      </div>
                                      <div class="text-yellow-600 dark:text-yellow-400">
                                        {{ feature.comparison }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Diagnostic Markers -->
                          <div v-if="disorder.diagnosticMarkers && disorder.diagnosticMarkers.length > 0">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-3 flex items-center gap-2 font-medium">
                              <Icon name="ph:flask" class="size-4" />
                              نشانگرهای تشخیصی
                            </h4>
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div
                                v-for="marker in disorder.diagnosticMarkers"
                                :key="marker.name"
                                class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
                              >
                                <div class="mb-2 font-medium text-green-700 dark:text-green-300">
                                  {{ getMarkerTypeLabel(marker.name) }}
                                </div>
                                <div class="space-y-1">
                                  <div
                                    v-for="subtype in marker.subtype"
                                    :key="subtype"
                                    class="rounded bg-green-100 px-2 py-1 text-sm text-green-600 dark:bg-green-800/50 dark:text-green-400"
                                  >
                                    {{ subtype }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Associated Features -->
                          <div v-if="disorder.associated_features">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-4 flex items-center gap-2 font-medium">
                              <Icon name="ph:link" class="size-4" />
                              ویژگی‌های مرتبط
                            </h4>

                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <!-- Supporting Symptoms -->
                              <div v-if="disorder.associated_features.supporting_symptoms">
                                <h5 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  علائم جانبی
                                </h5>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="symptom in disorder.associated_features.supporting_symptoms"
                                    :key="symptom"
                                    class="rounded-full bg-teal-100 px-2 py-1 text-xs text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                                  >
                                    {{ symptom }}
                                  </span>
                                </div>
                              </div>

                              <!-- Common Comorbidities -->
                              <div v-if="disorder.associated_features.common_comorbidities">
                                <h5 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  اختلالات همزمان شایع
                                </h5>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="comorbidity in disorder.associated_features.common_comorbidities"
                                    :key="comorbidity"
                                    class="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                                  >
                                    {{ comorbidity }}
                                  </span>
                                </div>
                              </div>

                              <!-- Functional Impacts -->
                              <div v-if="disorder.associated_features.functional_impacts">
                                <h5 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  تأثیرات عملکردی
                                </h5>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="impact in disorder.associated_features.functional_impacts"
                                    :key="impact"
                                    class="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                  >
                                    {{ impact }}
                                  </span>
                                </div>
                              </div>

                              <!-- Biological Findings -->
                              <div v-if="disorder.associated_features.biological_findings">
                                <h5 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                  یافته‌های بیولوژیک
                                </h5>
                                <div class="flex flex-wrap gap-2">
                                  <span
                                    v-for="finding in disorder.associated_features.biological_findings"
                                    :key="finding"
                                    class="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                                  >
                                    {{ finding }}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <!-- Demographic Patterns -->
                            <div v-if="disorder.associated_features.demographic_patterns" class="mt-4">
                              <h5 class="text-muted-600 dark:text-muted-400 mb-2 text-sm font-medium">
                                الگوهای جمعیت‌شناختی
                              </h5>
                              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
                                <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                  <div v-if="disorder.associated_features.demographic_patterns.age_onset">
                                    <div class="text-muted-500 text-xs">
                                      سن شروع
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300">
                                      {{ disorder.associated_features.demographic_patterns.age_onset }}
                                    </div>
                                  </div>
                                  <div v-if="disorder.associated_features.demographic_patterns.gender_distribution">
                                    <div class="text-muted-500 text-xs">
                                      توزیع جنسیتی
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300">
                                      {{ disorder.associated_features.demographic_patterns.gender_distribution }}
                                    </div>
                                  </div>
                                  <div v-if="disorder.associated_features.demographic_patterns.cultural_variations">
                                    <div class="text-muted-500 text-xs">
                                      تنوعات فرهنگی
                                    </div>
                                    <div class="text-muted-700 dark:text-muted-300">
                                      {{ disorder.associated_features.demographic_patterns.cultural_variations }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Risk and Prognostic Factors -->
                          <div v-if="disorder.riskAndPrognosticFactors">
                            <h4 class="text-muted-700 dark:text-muted-300 mb-3 flex items-center gap-2 font-medium">
                              <Icon name="ph:warning" class="size-4" />
                              عوامل خطر و پیش‌آگهی
                            </h4>
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div v-if="disorder.riskAndPrognosticFactors.Environmental" class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                <h5 class="mb-2 font-medium text-red-700 dark:text-red-300">
                                  عوامل محیطی
                                </h5>
                                <p class="text-sm text-red-600 dark:text-red-400">
                                  {{ disorder.riskAndPrognosticFactors.Environmental }}
                                </p>
                              </div>
                              <div v-if="disorder.riskAndPrognosticFactors.geneticAndPhysiological" class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                <h5 class="mb-2 font-medium text-blue-700 dark:text-blue-300">
                                  عوامل ژنتیکی و فیزیولوژیک
                                </h5>
                                <p class="text-sm text-blue-600 dark:text-blue-400">
                                  {{ disorder.riskAndPrognosticFactors.geneticAndPhysiological }}
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
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="py-12 text-center">
        <Icon name="ph:brain" class="text-muted-400 mx-auto mb-4 size-16" />
        <h3 class="text-muted-700 dark:text-muted-300 mb-2 text-xl font-semibold">
          اطلاعات تشخیصی یافت نشد
        </h3>
        <p class="text-muted-500 mb-6">
          لطفاً ابتدا ارزیابی خود را تکمیل کنید
        </p>
        <BaseButton @click="$router.push('/therapy-journey/wait')">
          بازگشت به ارزیابی
        </BaseButton>
      </div>

      <!-- Enhanced Action Buttons -->
      <div v-if="disorderCategories.length > 0" class="mt-16">
        <div class="text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
            <div class="mb-6">
              <h3 class="text-muted-800 mb-2 text-2xl font-bold dark:text-white">
                مرحله بعدی
              </h3>
              <p class="text-muted-600 dark:text-muted-400">
                آماده شدن برای جلسه درمانی یا تجدید ارزیابی
              </p>
            </div>

            <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <BaseButton
                color="primary"
                size="xl"
                class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 group relative min-w-48 overflow-hidden bg-gradient-to-r shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                @click="$router.push('/therapy-journey/ready')"
              >
                <div class="flex items-center gap-3">
                  <Icon name="ph:arrow-left" class="size-5 transition-transform group-hover:-translate-x-1" />
                  <span class="font-semibold">ادامه به جلسه درمانی</span>
                </div>
              </BaseButton>

              <BaseButton
                color="white"
                size="xl"
                class="border-muted-200 hover:border-primary-300 group relative min-w-48 overflow-hidden border-2 bg-white/90 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl"
                @click="$router.push('/therapy-journey/wait')"
              >
                <div class="text-muted-700 group-hover:text-primary-600 flex items-center gap-3">
                  <Icon name="ph:arrow-clockwise" class="size-5 transition-transform group-hover:rotate-180" />
                  <span class="font-semibold">تجدید ارزیابی</span>
                </div>
              </BaseButton>
            </div>

            <!-- Additional Info -->
            <div class="border-muted-200 dark:border-muted-600 mt-6 border-t pt-6">
              <div class="text-muted-500 dark:text-muted-400 flex items-center justify-center gap-2 text-sm">
                <Icon name="ph:info" class="size-4" />
                <span>تمامی اطلاعات بر اساس معیارهای DSM-5 تدوین شده است</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State Enhanced -->
      <div v-else class="py-20 text-center">
        <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mx-auto max-w-lg rounded-3xl border border-white/20 bg-white/80 p-12 shadow-2xl backdrop-blur-sm">
          <div class="from-muted-100 to-muted-200 dark:from-muted-700 dark:to-muted-800 mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br p-6">
            <Icon name="ph:brain" class="text-muted-400 dark:text-muted-500 size-12" />
          </div>
          <h3 class="text-muted-700 dark:text-muted-300 mb-3 text-2xl font-bold">
            اطلاعات تشخیصی یافت نشد
          </h3>
          <p class="text-muted-500 dark:text-muted-400 mb-8 leading-relaxed">
            برای مشاهده اختلالات پیشنهادی، ابتدا ارزیابی کامل خود را تکمیل کنید
          </p>
          <BaseButton
            color="primary"
            size="lg"
            class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 bg-gradient-to-r shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            @click="$router.push('/therapy-journey/wait')"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:arrow-left" class="size-4" />
              <span>شروع ارزیابی</span>
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'default',
  title: 'اختلالات پیشنهادی جهت بررسی | ذهنا',
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'اختلالات پیشنهادی جهت بررسی | ذهنا',
});

const { getGoalsByUser } = useGoals();
const { user } = useUser();

// State
const disorderCategories = ref([]);
const expandedItems = ref(new Set());
const isLoading = ref(true);
const loadingError = ref(null);

// Computed
const totalDisorders = computed(() => {
  return disorderCategories.value.reduce((total, category) => {
    return total + (category.disorders?.length || 0);
  }, 0);
});

// Methods
const toggleDisorder = (categoryIndex: number, disorderIndex: number) => {
  const key = `${categoryIndex}-${disorderIndex}`;
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key);
  }
  else {
    expandedItems.value.add(key);
  }
};

const isExpanded = (categoryIndex: number, disorderIndex: number) => {
  const key = `${categoryIndex}-${disorderIndex}`;
  return expandedItems.value.has(key);
};

const getSuicideRiskClass = (risk: string) => {
  if (risk?.includes('بالا') || risk?.includes('high')) {
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  }
  else if (risk?.includes('متوسط') || risk?.includes('moderate')) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  }
  else {
    return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
  }
};

const getSuicideRiskLabel = (risk: string) => {
  if (risk?.includes('بالا') || risk?.includes('high')) {
    return 'خطر بالا';
  }
  else if (risk?.includes('متوسط') || risk?.includes('moderate')) {
    return 'خطر متوسط';
  }
  else {
    return 'خطر پایین';
  }
};

const getSuicideRiskIcon = (risk: string) => {
  if (risk?.includes('بالا') || risk?.includes('high')) {
    return 'ph:warning-circle-fill';
  }
  else if (risk?.includes('متوسط') || risk?.includes('moderate')) {
    return 'ph:warning-fill';
  }
  else {
    return 'ph:shield-check-fill';
  }
};

const getCategoryGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
    'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
    'bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700',
    'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
    'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700',
  ];
  return gradients[index % gradients.length];
};

const getCategoryIcon = (index: number) => {
  const icons = [
    'ph:brain-fill',
    'ph:heart-fill',
    'ph:moon-stars-fill',
    'ph:lightning-fill',
    'ph:shield-star-fill',
    'ph:star-four-fill',
  ];
  return icons[index % icons.length];
};

const getSuicideRiskDetailClass = (risk: string) => {
  if (risk?.includes('بالا') || risk?.includes('high')) {
    return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  }
  else if (risk?.includes('متوسط') || risk?.includes('moderate')) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
  }
  else {
    return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
  }
};

const getSymptomCategoryIcon = (category: string) => {
  const icons = {
    mood: 'ph:smiley',
    anxiety: 'ph:lightning',
    behavioral: 'ph:user',
    somatic: 'ph:heart',
  };
  return icons[category] || 'ph:circle';
};

const getFunctionalDomainLabel = (domain: string) => {
  const labels = {
    occupational: 'شغلی',
    social: 'اجتماعی',
    academic: 'تحصیلی',
    interpersonal: 'بین‌فردی',
  };
  return labels[domain] || domain;
};

const getSeverityLabel = (level: string) => {
  const labels = {
    mild: 'خفیف',
    moderate: 'متوسط',
    severe: 'شدید',
  };
  return labels[level] || level;
};

const getContextTypeLabel = (type: string) => {
  const labels = {
    life_stressors: 'استرس‌های زندگی',
    cultural_background: 'پیشینه فرهنگی',
    family_dynamics: 'دینامیک خانواده',
    socioeconomic_status: 'وضعیت اقتصادی-اجتماعی',
  };
  return labels[type] || type.replace(/_/g, ' ');
};

const getMarkerTypeLabel = (type: string) => {
  const labels = {
    biological: 'بیولوژیک',
    neurophysiological: 'نوروفیزیولوژیک',
    cognitive_behavioral: 'شناختی-رفتاری',
    digital: 'دیجیتال',
    other: 'سایر',
  };
  return labels[type] || type;
};

// Load user goals on mount
const loadUserGoals = async () => {
  isLoading.value = true;
  loadingError.value = null;

  try {
    if (!user.value?.id) {
      throw new Error('کاربر وارد سیستم نشده است');
    }

    const goals = await getGoalsByUser(user.value.id);
    console.log('Loaded goals:', goals);

    if (goals && goals.length > 0) {
      // Extract suggestedDisordersToInvestigate from the first goal
      const firstGoal = goals[0];
      const goalData = firstGoal?.goals || firstGoal;

      if (goalData?.suggestedDisordersToInvestigate) {
        disorderCategories.value = goalData.suggestedDisordersToInvestigate;
        console.log('Loaded disorder categories:', disorderCategories.value);
      }
      else {
        console.warn('No suggestedDisordersToInvestigate found in goals');
        disorderCategories.value = [];
      }
    }
    else {
      console.warn('No goals found for user');
      disorderCategories.value = [];
    }
  }
  catch (error) {
    console.error('Error loading user goals:', error);
    loadingError.value = error.message || 'خطا در بارگذاری اطلاعات تشخیصی. لطفاً دوباره تلاش کنید.';
    disorderCategories.value = [];
  }
  finally {
    isLoading.value = false;
  }
};

// Retry loading function
const retryLoading = () => {
  loadUserGoals();
};

onMounted(() => {
  loadUserGoals();
});
</script>

<style scoped>
/* Custom styles for better RTL support and animations */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}

/* Enhanced glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Text clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* Custom gradient animations */
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  animation: gradient-x 15s ease infinite;
  background-size: 400% 400%;
}

/* Enhanced pulse animation */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

/* Floating animation for cards */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.group:hover .animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Enhanced button effects */
.btn-shimmer {
  position: relative;
  overflow: hidden;
}

.btn-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn-shimmer:hover::before {
  left: 100%;
}

/* Improved focus states for accessibility */
.focus\:ring-primary:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>
