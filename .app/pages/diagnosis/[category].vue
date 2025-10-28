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
    <div v-else-if="categoryData">
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
              <span class="text-primary-600 dark:text-primary-400 font-medium">{{ categoryData.titleFa }}</span>
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

            <!-- Description moved to markdown card below -->
          </div>

          <!-- Category Stats -->
          <div class="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                <Icon name="ph:list-numbers" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ categoryData.stats?.count || categoryDisorders.length || 'N/A' }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-center text-sm">
                اختلال اصلی
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 p-3">
                <Icon name="ph:baby" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-center text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {{ categoryData.stats?.onsetPeriod || 'متغیر' }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-center text-sm">
                دوران شروع
              </div>
            </div>

            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 p-3">
                <Icon name="ph:trend-up" class="size-8 text-white" />
              </div>
              <div class="mb-1 text-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {{ categoryData.stats?.prevalence || 'متغیر' }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-center text-sm">
                شیوع کلی
              </div>
            </div>
          </div>

          <!-- Description Card -->
          <div v-if="categoryData && categoryData.description" class="mx-auto mb-12 max-w-4xl">
            <div class="dark:bg-muted-800/80 dark:border-muted-700/50 rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
              <div class="mb-6 flex items-center gap-3">
                <div class="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 p-3">
                  <Icon name="ph:info" class="size-6 text-white" />
                </div>
                <h2 class="text-muted-800 text-2xl font-bold dark:text-white">
                  درباره این دسته‌بندی
                </h2>
              </div>

              <div class="relative">
                <div
                  :class="[
                    'prose prose-lg dark:prose-invert rtl max-w-none leading-relaxed text-gray-800 transition-all duration-300 dark:text-gray-200',
                    !descriptionExpanded ? 'max-h-32 overflow-hidden' : ''
                  ]"
                >
                  <AddonMarkdownRemark :source="categoryData.description" />
                </div>

                <!-- Fade overlay when collapsed -->
                <div
                  v-if="!descriptionExpanded"
                  class="dark:from-muted-800/90 pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent"
                />
              </div>

              <!-- More/Less Button -->
              <div class="mt-4 text-center">
                <button
                  class="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                  @click="toggleDescription"
                >
                  <span>{{ descriptionExpanded ? 'نمایش کمتر' : 'ادامه مطلب' }}</span>
                  <Icon
                    :name="descriptionExpanded ? 'ph:caret-up' : 'ph:caret-down'"
                    class="size-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Disorders Section -->
      <div class="container mx-auto max-w-7xl px-4 pb-12">
        <div class="mb-12 text-center">
          <h2 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
            اختلالات این دسته‌بندی
          </h2>
          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl">
            در ادامه، فهرست کاملی از اختلالات این دسته‌بندی بر اساس DSM-5 ارائه شده است.
          </p>
        </div>

        <!-- Disorders List -->
        <div v-if="categoryDisorders.length > 0" class="space-y-8">
          <div
            v-for="(disorder, index) in categoryDisorders"
            :key="disorder.id || disorder.code"
            class="dark:bg-muted-800/90 dark:border-muted-700/50 group overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
          >
            <!-- Disorder Header -->
            <div
              class="relative cursor-pointer p-6 transition-all duration-300"
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

                    <!-- Disorder Info -->
                    <div class="flex-1">
                      <div class="mb-2 flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="mb-1 text-xl font-bold text-white">
                            {{ disorder.title || disorder.titleFa }}
                          </h3>
                          <p class="text-sm text-white/80">
                            {{ disorder.titleEn }}
                          </p>
                        </div>
                        <div class="ml-4 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                          {{ disorder.code }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick summary when collapsed -->
                <div v-if="!expandedItems.has(index)" class="ml-12 mt-4">
                  <p class="line-clamp-2 text-sm leading-relaxed text-white/80">
                    {{ disorder.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Expandable Content -->
            <div
              v-if="expandedItems.has(index)"
              class="dark:border-muted-700/50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 border-t border-white/20 bg-gradient-to-br from-slate-50 via-white to-slate-100"
            >
              <div class="space-y-8 p-8">
                <!-- Description Section -->
                <div class="text-center">
                  <h4 class="text-muted-800 mb-3 flex items-center justify-center gap-2 text-lg font-bold dark:text-white">
                    <Icon name="ph:info" class="text-primary-500 size-5" />
                    توضیحات
                  </h4>
                  <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-4xl leading-relaxed">
                    {{ disorder.description || 'توضیحات در دسترس نیست.' }}
                  </p>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <!-- Left Column -->
                  <div class="space-y-6">
                    <!-- Course & Onset -->
                    <div class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:trend-up" class="size-5 text-emerald-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          سیر اختلال
                        </h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.course || 'معمولاً بهبود یافته یا مداخله زودهنگام' }}
                      </p>
                    </div>

                    <!-- Age of Onset -->
                    <div class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:calendar" class="size-5 text-blue-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          سن شروع
                        </h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.ageOfOnset || 'قبل از 5 سالگی' }}
                      </p>
                    </div>

                    <!-- Core Symptoms -->
                    <div v-if="disorder.coreSymptoms && disorder.coreSymptoms.length > 0" class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:warning" class="size-5 text-red-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          علائم اصلی
                        </h4>
                      </div>
                      <div class="space-y-2">
                        <div
                          v-for="symptom in disorder.coreSymptoms"
                          :key="symptom"
                          class="rounded-lg border-r-4 border-red-400 bg-red-50 p-3 dark:bg-red-900/20"
                        >
                          {{ symptom }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-6">
                    <!-- Prevalence -->
                    <div class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:chart-bar" class="size-5 text-purple-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          شیوع
                        </h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.prevalence || disorder.Prevalence || '1-3%' }}
                      </p>
                    </div>

                    <!-- Associated Features -->
                    <div v-if="disorder.associatedFeatures && disorder.associatedFeatures.length > 0" class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:link" class="size-5 text-orange-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          ویژگی‌های همراه
                        </h4>
                      </div>
                      <div class="flex flex-wrap justify-center gap-2">
                        <span
                          v-for="feature in disorder.associatedFeatures"
                          :key="feature"
                          class="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                        >
                          {{ feature }}
                        </span>
                      </div>
                    </div>

                    <!-- Treatment Approaches -->
                    <div v-if="disorder.treatmentApproaches && disorder.treatmentApproaches.length > 0" class="text-center">
                      <div class="mb-4 flex items-center justify-center gap-2">
                        <Icon name="ph:heart" class="size-5 text-emerald-500" />
                        <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                          رویکردهای درمانی
                        </h4>
                      </div>
                      <div class="grid grid-cols-1 gap-3">
                        <div
                          v-for="treatment in disorder.treatmentApproaches"
                          :key="treatment"
                          class="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        >
                          <Icon name="ph:heart" class="size-4" />
                          {{ treatment }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Details -->
                <div v-if="disorder.minimumCriteria" class="border-muted-200 dark:border-muted-700 border-t pt-6">
                  <div class="mb-4 text-center">
                    <div class="mb-3 flex items-center justify-center gap-2">
                      <Icon name="ph:check-circle" class="size-5 text-blue-500" />
                      <h4 class="text-muted-800 text-lg font-bold dark:text-white">
                        معیارهای تشخیصی
                      </h4>
                    </div>
                  </div>
                  <div class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="text-muted-600 dark:text-muted-400 text-center text-sm leading-relaxed">
                      {{ disorder.minimumCriteria }}
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-4 pt-4 text-center">
                  <div class="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                      @click="handleDisorderClick(disorder)"
                    >
                      <Icon name="ph:info" class="size-5" />
                      <span>مطالعه تخصصی کامل</span>
                      <Icon name="ph:arrow-left" class="size-4" />
                    </button>

                    <button
                      class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
                      @click="handleInterviewClick(disorder)"
                    >
                      <Icon name="ph:user-focus" class="size-5" />
                      <span>مصاحبه تشخیصی</span>
                      <Icon name="ph:arrow-left" class="size-4" />
                    </button>
                  </div>

                  <p class="text-muted-500 dark:text-muted-400 text-xs">
                    برای مطالعه کامل اختلال یا شروع مصاحبه تشخیصی گام به گام
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Disorders Found -->
        <div v-else class="py-12 text-center">
          <Icon name="ph:magnifying-glass" class="text-muted-400 mx-auto mb-4 size-16" />
          <h3 class="text-muted-600 dark:text-muted-400 mb-2 text-xl font-semibold">
            هیچ اختلالی یافت نشد
          </h3>
          <p class="text-muted-500 dark:text-muted-500">
            اختلالات این دسته‌بندی هنوز ایجاد نشده‌اند.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDSMInfoGenerator } from '~/composables/useDSMInfoGenerator';
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue';

// Get route params
const route = useRoute();
const categorySlug = route.params.category as string;

// Dynamic data fetching
const { fetchCategoryData } = useDSMInfoGenerator();

// State
const categoryData = ref<any>(null);
const categoryDisorders = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const descriptionExpanded = ref(false);
const expandedItems = ref(new Set<number>());

// Fetch data on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log(`🚀 Loading category page for slug: ${categorySlug}`);

    // Add small delay to prevent PocketBase auto-cancellation
    await new Promise(resolve => setTimeout(resolve, 100));

    // Fetch category data (which includes disorders) from PocketBase
    const categoryResult = await fetchCategoryData(categorySlug);

    // Extract disorders from the category data instead of separate fetch
    const disordersResult = categoryResult.disorders || [];

    categoryData.value = categoryResult;
    categoryDisorders.value = disordersResult;

    console.log(`✅ Successfully loaded category: ${categoryResult.titleEn} with ${disordersResult.length} disorders`);
    console.log('🔍 Category description:', categoryResult.description);
    console.log('🔍 Description type:', typeof categoryResult.description);
    console.log('🔍 Description length:', categoryResult.description?.length);

    // Update page meta dynamically
    const pageTitle = `${categoryResult.titleFa} - DSM-5 | ذهنا`;
    const pageDescription = `راهنمای کامل ${categoryResult.titleFa} بر اساس DSM-5. ${categoryResult.description}`;

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
          content: `${categoryResult.titleFa}, ${categoryResult.titleEn}, DSM-5, تشخیص, اختلالات روانی`,
        },
      ],
    });

    console.log(`✅ Loaded category: ${categoryResult.titleEn} with ${disordersResult.length} disorders`);
  }
  catch (err: any) {
    console.error('Error loading category data:', err);
    error.value = err.message || 'خطا در بارگذاری اطلاعات';
  }
  finally {
    loading.value = false;
  }
});

// Helper function to create slug from text
const createSlug = (text: string) => {
  return text?.toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-') // Replace Persian/Arabic chars and spaces with hyphens
    .replace(/[^\w\-]/g, '') // Remove non-word chars except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Get disorder slug
const getDisorderSlug = (disorder: any) => {
  return disorder.slug
    || createSlug(disorder.titleEn)
    || createSlug(disorder.title)
    || createSlug(disorder.titleFa)
    || disorder.id
    || createSlug(disorder.code)
    || 'unknown-disorder';
};

// Navigation helper for disorder details
const handleDisorderClick = (disorder: any) => {
  const router = useRouter();

  console.log('🔍 Full disorder data:', disorder);
  console.log('🔍 Available keys:', Object.keys(disorder));

  const disorderSlug = getDisorderSlug(disorder);

  console.log('🚀 Generated slug:', disorderSlug);
  console.log('🚀 Navigating to:', `/diagnosis/disorders/${disorderSlug}`);

  router.push(`/diagnosis/disorders/${disorderSlug}`);
};

// Navigation helper for interview
const handleInterviewClick = (disorder: any) => {
  const router = useRouter();

  console.log('🎯 Starting interview for disorder:', disorder.title || disorder.titleFa);

  const disorderSlug = getDisorderSlug(disorder);

  console.log('🚀 Generated slug for interview:', disorderSlug);
  console.log('🚀 Navigating to interview:', `/diagnosis/interviewer/${disorderSlug}`);

  router.push(`/diagnosis/interviewer/${disorderSlug}`);
};

// Description toggle helper
const toggleDescription = () => {
  descriptionExpanded.value = !descriptionExpanded.value;
};

// Disorders toggle helper
const toggleDisorder = (index: number) => {
  if (expandedItems.value.has(index)) {
    expandedItems.value.delete(index);
  }
  else {
    expandedItems.value.add(index);
  }
};

// Styling helper
const getDisorderGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
    'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
    'bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700',
    'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
    'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700',
    'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700',
    'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700',
    'bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700',
    'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
  ];
  return gradients[index % gradients.length];
};

// Dynamic page meta
definePageMeta({
  layout: 'default',
  title: 'DSM-5 Category | ذهنا',
});
</script>

<style scoped>
/* Enhanced glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Text line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>
