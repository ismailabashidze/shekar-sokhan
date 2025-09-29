<template>
  <div class="from-primary-50 via-white to-blue-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-muted-600 dark:text-muted-400">در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
        <Icon name="ph:warning" class="size-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">خطا در بارگذاری</h2>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="$router.push('/diagnosis/categories')" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
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
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.blue.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.primary.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.cyan.400) 0%, transparent 50%)"></div>
        </div>
        
        <div class="container mx-auto max-w-7xl px-4 py-12 relative">
          <!-- Navigation Breadcrumb and Theme Toggle -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-400">
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
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-3 bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm px-6 py-4 rounded-full shadow-lg border border-white/20 dark:border-muted-700/50 mb-6">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full relative">
                <Icon :name="categoryData.icon" class="size-8 text-white" />
                <div class="absolute inset-0 bg-blue-400/30 rounded-full animate-ping"></div>
              </div>
              <div class="text-right">
                <div class="text-sm text-muted-600 dark:text-muted-400">DSM-5 Category</div>
                <div class="font-bold text-muted-800 dark:text-white text-lg">{{ categoryData.titleEn }}</div>
              </div>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-muted-800 dark:text-white mb-4 leading-tight">
              {{ categoryData.titleFa }}
            </h1>
            
            <!-- Description moved to markdown card below -->
          </div>

          <!-- Category Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="ph:list-numbers" class="size-8 text-white" />
              </div>
              <div class="text-center text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{{ categoryData.stats?.count || categoryDisorders.length || 'N/A' }}</div>
              <div class="text-center text-sm text-muted-600 dark:text-muted-400">اختلال اصلی</div>
            </div>

            <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50">
              <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="ph:baby" class="size-8 text-white" />
              </div>
              <div class="text-center text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">{{ categoryData.stats?.onsetPeriod || 'متغیر' }}</div>
              <div class="text-center text-sm text-muted-600 dark:text-muted-400">دوران شروع</div>
            </div>

            <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50">
              <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icon name="ph:trend-up" class="size-8 text-white" />
              </div>
              <div class="text-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{{ categoryData.stats?.prevalence || 'متغیر' }}</div>
              <div class="text-center text-sm text-muted-600 dark:text-muted-400">شیوع کلی</div>
            </div>
          </div>

          <!-- Description Card -->
          <div v-if="categoryData && categoryData.description" class="max-w-4xl mx-auto mb-12">
            <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-muted-700/50">
              <div class="flex items-center gap-3 mb-6">
                <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-full">
                  <Icon name="ph:info" class="size-6 text-white" />
                </div>
                <h2 class="text-2xl font-bold text-muted-800 dark:text-white">درباره این دسته‌بندی</h2>
              </div>
              
              <div class="relative">
                <div 
                  :class="[
                    'prose prose-lg dark:prose-invert rtl max-w-none leading-relaxed text-gray-800 dark:text-gray-200 transition-all duration-300',
                    !descriptionExpanded ? 'max-h-32 overflow-hidden' : ''
                  ]"
                >
                  <AddonMarkdownRemark :source="categoryData.description" />
                </div>
                
                <!-- Fade overlay when collapsed -->
                <div 
                  v-if="!descriptionExpanded" 
                  class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent dark:from-muted-800/90 pointer-events-none"
                ></div>
              </div>
              
              <!-- More/Less Button -->
              <div class="mt-4 text-center">
                <button
                  @click="toggleDescription"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors duration-200 text-sm font-medium"
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
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-muted-800 dark:text-white mb-4">اختلالات این دسته‌بندی</h2>
          <p class="text-muted-600 dark:text-muted-400 max-w-3xl mx-auto">
            در ادامه، فهرست کاملی از اختلالات این دسته‌بندی بر اساس DSM-5 ارائه شده است.
          </p>
        </div>

        <!-- Disorders List -->
        <div v-if="categoryDisorders.length > 0" class="space-y-8">
          <div
            v-for="(disorder, index) in categoryDisorders"
            :key="disorder.id || disorder.code"
            class="group bg-white/90 dark:bg-muted-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-muted-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
          >
            <!-- Disorder Header -->
            <div 
              class="p-6 cursor-pointer transition-all duration-300 relative"
              :class="getDisorderGradient(index)"
              @click="toggleDisorder(index)"
            >
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)"></div>
              </div>
              
              <div class="relative z-10">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 flex-1">
                    <!-- Expand/Collapse Icon -->
                    <div class="bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-300">
                      <Icon 
                        :name="expandedItems.has(index) ? 'ph:caret-down' : 'ph:caret-left'" 
                        class="size-5 text-white transition-transform duration-300"
                        :class="{ 'rotate-90': expandedItems.has(index) }"
                      />
                    </div>
                    
                    <!-- Disorder Info -->
                    <div class="flex-1">
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                          <h3 class="text-xl font-bold text-white mb-1">{{ disorder.title || disorder.titleFa }}</h3>
                          <p class="text-white/80 text-sm">{{ disorder.titleEn }}</p>
                        </div>
                        <div class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white ml-4">
                          {{ disorder.code }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Quick summary when collapsed -->
                <div v-if="!expandedItems.has(index)" class="mt-4 ml-12">
                  <p class="text-white/80 text-sm leading-relaxed line-clamp-2">
                    {{ disorder.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Expandable Content -->
            <div 
              v-if="expandedItems.has(index)"
              class="border-t border-white/20 dark:border-muted-700/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900"
            >
              <div class="p-8 space-y-8">
                <!-- Description Section -->
                <div class="text-center">
                  <h4 class="text-lg font-bold text-muted-800 dark:text-white mb-3 flex items-center justify-center gap-2">
                    <Icon name="ph:info" class="size-5 text-primary-500" />
                    توضیحات
                  </h4>
                  <p class="text-muted-600 dark:text-muted-400 leading-relaxed max-w-4xl mx-auto">
                    {{ disorder.description || 'توضیحات در دسترس نیست.' }}
                  </p>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Left Column -->
                  <div class="space-y-6">
                    <!-- Course & Onset -->
                    <div class="text-center">
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:trend-up" class="size-5 text-emerald-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">سیر اختلال</h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.course || 'معمولاً بهبود یافته یا مداخله زودهنگام' }}
                      </p>
                    </div>

                    <!-- Age of Onset -->
                    <div class="text-center">
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:calendar" class="size-5 text-blue-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">سن شروع</h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.ageOfOnset || 'قبل از 5 سالگی' }}
                      </p>
                    </div>

                    <!-- Core Symptoms -->
                    <div class="text-center" v-if="disorder.coreSymptoms && disorder.coreSymptoms.length > 0">
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:warning" class="size-5 text-red-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">علائم اصلی</h4>
                      </div>
                      <div class="space-y-2">
                        <div 
                          v-for="symptom in disorder.coreSymptoms" 
                          :key="symptom"
                          class="bg-red-50 dark:bg-red-900/20 border-r-4 border-red-400 p-3 rounded-lg"
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
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:chart-bar" class="size-5 text-purple-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">شیوع</h4>
                      </div>
                      <p class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ disorder.prevalence || disorder.Prevalence || '1-3%' }}
                      </p>
                    </div>

                    <!-- Associated Features -->
                    <div class="text-center" v-if="disorder.associatedFeatures && disorder.associatedFeatures.length > 0">
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:link" class="size-5 text-orange-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">ویژگی‌های همراه</h4>
                      </div>
                      <div class="flex flex-wrap justify-center gap-2">
                        <span 
                          v-for="feature in disorder.associatedFeatures" 
                          :key="feature"
                          class="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm"
                        >
                          {{ feature }}
                        </span>
                      </div>
                    </div>

                    <!-- Treatment Approaches -->
                    <div class="text-center" v-if="disorder.treatmentApproaches && disorder.treatmentApproaches.length > 0">
                      <div class="flex items-center justify-center gap-2 mb-4">
                        <Icon name="ph:heart" class="size-5 text-emerald-500" />
                        <h4 class="text-lg font-bold text-muted-800 dark:text-white">رویکردهای درمانی</h4>
                      </div>
                      <div class="grid grid-cols-1 gap-3">
                        <div 
                          v-for="treatment in disorder.treatmentApproaches" 
                          :key="treatment"
                          class="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg"
                        >
                          <Icon name="ph:heart" class="size-4" />
                          {{ treatment }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Details -->
                <div v-if="disorder.minimumCriteria" class="border-t border-muted-200 dark:border-muted-700 pt-6">
                  <div class="text-center mb-4">
                    <div class="flex items-center justify-center gap-2 mb-3">
                      <Icon name="ph:check-circle" class="size-5 text-blue-500" />
                      <h4 class="text-lg font-bold text-muted-800 dark:text-white">معیارهای تشخیصی</h4>
                    </div>
                  </div>
                  <div class="prose prose-sm dark:prose-invert max-w-none">
                    <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed text-center">
                      {{ disorder.minimumCriteria }}
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-center pt-4 space-y-4">
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      @click="handleDisorderClick(disorder)"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Icon name="ph:info" class="size-5" />
                      <span>مطالعه تخصصی کامل</span>
                      <Icon name="ph:arrow-left" class="size-4" />
                    </button>
                    
                    <button
                      @click="handleInterviewClick(disorder)"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Icon name="ph:user-focus" class="size-5" />
                      <span>مصاحبه تشخیصی</span>
                      <Icon name="ph:arrow-left" class="size-4" />
                    </button>
                  </div>
                  
                  <p class="text-xs text-muted-500 dark:text-muted-400">
                    برای مطالعه کامل اختلال یا شروع مصاحبه تشخیصی گام به گام
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Disorders Found -->
        <div v-else class="text-center py-12">
          <Icon name="ph:magnifying-glass" class="size-16 text-muted-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-muted-600 dark:text-muted-400 mb-2">هیچ اختلالی یافت نشد</h3>
          <p class="text-muted-500 dark:text-muted-500">اختلالات این دسته‌بندی هنوز ایجاد نشده‌اند.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDSMInfoGenerator } from '~/composables/useDSMInfoGenerator'
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue'

// Get route params
const route = useRoute()
const categorySlug = route.params.category as string

// Dynamic data fetching
const { fetchCategoryData } = useDSMInfoGenerator()

// State
const categoryData = ref<any>(null)
const categoryDisorders = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const descriptionExpanded = ref(false)
const expandedItems = ref(new Set<number>())

// Fetch data on mount
onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    console.log(`🚀 Loading category page for slug: ${categorySlug}`)

    // Add small delay to prevent PocketBase auto-cancellation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Fetch category data (which includes disorders) from PocketBase
    const categoryResult = await fetchCategoryData(categorySlug)
    
    // Extract disorders from the category data instead of separate fetch
    const disordersResult = categoryResult.disorders || []

    categoryData.value = categoryResult
    categoryDisorders.value = disordersResult

    console.log(`✅ Successfully loaded category: ${categoryResult.titleEn} with ${disordersResult.length} disorders`)
    console.log('🔍 Category description:', categoryResult.description)
    console.log('🔍 Description type:', typeof categoryResult.description)
    console.log('🔍 Description length:', categoryResult.description?.length)

    // Update page meta dynamically
    const pageTitle = `${categoryResult.titleFa} - DSM-5 | ذهنا`
    const pageDescription = `راهنمای کامل ${categoryResult.titleFa} بر اساس DSM-5. ${categoryResult.description}`

    useHead({
      htmlAttrs: { dir: 'rtl' },
      title: pageTitle,
      meta: [
        { 
          name: 'description', 
          content: pageDescription
        },
        {
          name: 'keywords',
          content: `${categoryResult.titleFa}, ${categoryResult.titleEn}, DSM-5, تشخیص, اختلالات روانی`
        }
      ]
    })

    console.log(`✅ Loaded category: ${categoryResult.titleEn} with ${disordersResult.length} disorders`)

  } catch (err: any) {
    console.error('Error loading category data:', err)
    error.value = err.message || 'خطا در بارگذاری اطلاعات'
  } finally {
    loading.value = false
  }
})

// Helper function to create slug from text
const createSlug = (text: string) => {
  return text?.toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-') // Replace Persian/Arabic chars and spaces with hyphens
    .replace(/[^\w\-]/g, '') // Remove non-word chars except hyphens  
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Get disorder slug
const getDisorderSlug = (disorder: any) => {
  return disorder.slug || 
         createSlug(disorder.titleEn) ||
         createSlug(disorder.title) ||
         createSlug(disorder.titleFa) ||
         disorder.id ||
         createSlug(disorder.code) ||
         'unknown-disorder'
}

// Navigation helper for disorder details
const handleDisorderClick = (disorder: any) => {
  const router = useRouter()
  
  console.log('🔍 Full disorder data:', disorder)
  console.log('🔍 Available keys:', Object.keys(disorder))
  
  const disorderSlug = getDisorderSlug(disorder)
  
  console.log('🚀 Generated slug:', disorderSlug)
  console.log('🚀 Navigating to:', `/diagnosis/disorders/${disorderSlug}`)
  
  router.push(`/diagnosis/disorders/${disorderSlug}`)
}

// Navigation helper for interview
const handleInterviewClick = (disorder: any) => {
  const router = useRouter()
  
  console.log('🎯 Starting interview for disorder:', disorder.title || disorder.titleFa)
  
  const disorderSlug = getDisorderSlug(disorder)
  
  console.log('🚀 Generated slug for interview:', disorderSlug)
  console.log('🚀 Navigating to interview:', `/diagnosis/interviewer/${disorderSlug}`)
  
  router.push(`/diagnosis/interviewer/${disorderSlug}`)
}

// Description toggle helper
const toggleDescription = () => {
  descriptionExpanded.value = !descriptionExpanded.value
}

// Disorders toggle helper
const toggleDisorder = (index: number) => {
  if (expandedItems.value.has(index)) {
    expandedItems.value.delete(index)
  } else {
    expandedItems.value.add(index)
  }
}

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
    'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700'
  ]
  return gradients[index % gradients.length]
}

// Dynamic page meta
definePageMeta({
  layout: 'default',
  title: 'DSM-5 Category | ذهنا',
})
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