<script setup lang="ts">
import type { Course } from '~/composables/education'

definePageMeta({
  title: 'دوره‌های آموزشی',
  preview: {
    title: 'Education Courses',
    description: 'Browse and filter educational courses',
    categories: ['education'],
    src: '/img/screens/education-courses.png',
    srcDark: '/img/screens/education-courses-dark.png',
    order: 2,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Enhanced mock data for courses with categories and levels
const mockCourses = [
  {
    id: '1',
    title: 'مدیریت هیجانات در روابط',
    thumbnail: '/img/courses/emotion-management.jpg',
    category: 'psychology',
    level: 'beginner',
    duration: '4 هفته',
    instructor: 'دکتر سارا محمدی',
    rating: 4.8,
    studentsCount: 245,
    lessons: [
      { id: '1-1', title: 'شناخت انواع هیجانات' },
      { id: '1-2', title: 'کنترل خشم و عصبانیت' },
      { id: '1-3', title: 'ابراز احساسات مثبت' }
    ]
  },
  {
    id: '2',
    title: 'مهارت‌های ارتباطی موثر',
    thumbnail: '/img/courses/communication.jpg',
    category: 'communication',
    level: 'intermediate',
    duration: '6 هفته',
    instructor: 'دکتر احمد رضایی',
    rating: 4.9,
    studentsCount: 189,
    lessons: [
      { id: '2-1', title: 'اصول گوش دادن فعال' },
      { id: '2-2', title: 'بیان نیازها و خواسته‌ها' },
      { id: '2-3', title: 'حل تعارض در روابط' }
    ]
  },
  {
    id: '3',
    title: 'خودشناسی و توسعه شخصیت',
    thumbnail: '/img/courses/self-discovery.jpg',
    category: 'personal-development',
    level: 'beginner',
    duration: '8 هفته',
    instructor: 'دکتر فاطمه حسینی',
    rating: 4.7,
    studentsCount: 312,
    lessons: [
      { id: '3-1', title: 'شناخت نقاط قوت و ضعف' },
      { id: '3-2', title: 'تعیین اهداف زندگی' },
      { id: '3-3', title: 'ساخت هویت مثبت' }
    ]
  },
  {
    id: '4',
    title: 'آمادگی برای ازدواج',
    thumbnail: '/img/courses/marriage-prep.jpg',
    category: 'marriage',
    level: 'intermediate',
    duration: '5 هفته',
    instructor: 'دکتر مهدی کریمی',
    rating: 4.6,
    studentsCount: 156,
    lessons: [
      { id: '4-1', title: 'انتظارات واقعی از ازدواج' },
      { id: '4-2', title: 'مهارت‌های زندگی مشترک' },
      { id: '4-3', title: 'برنامه‌ریزی مالی خانوادگی' }
    ]
  },
  {
    id: '5',
    title: 'مدیریت استرس و اضطراب',
    thumbnail: '/img/courses/stress-management.jpg',
    category: 'psychology',
    level: 'advanced',
    duration: '7 هفته',
    instructor: 'دکتر زهرا علوی',
    rating: 4.9,
    studentsCount: 98,
    lessons: [
      { id: '5-1', title: 'تشخیص علائم استرس' },
      { id: '5-2', title: 'تکنیک‌های آرام‌سازی' },
      { id: '5-3', title: 'مدیریت زمان و اولویت‌بندی' }
    ]
  },
  {
    id: '6',
    title: 'بینش اجتماعی و فرهنگی',
    thumbnail: '/img/courses/social-insight.jpg',
    category: 'social-skills',
    level: 'intermediate',
    duration: '3 هفته',
    instructor: 'دکتر حسن نوری',
    rating: 4.5,
    studentsCount: 203,
    lessons: [
      { id: '6-1', title: 'درک تفاوت‌های فردی' },
      { id: '6-2', title: 'احترام به تنوع فرهنگی' },
      { id: '6-3', title: 'ساخت روابط سالم اجتماعی' }
    ]
  },
  {
    id: '7',
    title: 'تکنیک‌های مذاکره و متقاعدسازی',
    thumbnail: '/img/courses/negotiation.jpg',
    category: 'communication',
    level: 'advanced',
    duration: '4 هفته',
    instructor: 'دکتر علی جعفری',
    rating: 4.8,
    studentsCount: 127,
    lessons: [
      { id: '7-1', title: 'اصول مذاکره موثر' },
      { id: '7-2', title: 'فنون متقاعدسازی' },
      { id: '7-3', title: 'حل اختلافات' }
    ]
  },
  {
    id: '8',
    title: 'ساخت اعتماد به نفس',
    thumbnail: '/img/courses/confidence.jpg',
    category: 'personal-development',
    level: 'beginner',
    duration: '6 هفته',
    instructor: 'دکتر مریم صادقی',
    rating: 4.7,
    studentsCount: 278,
    lessons: [
      { id: '8-1', title: 'شناخت خود واقعی' },
      { id: '8-2', title: 'غلبه بر ترس‌ها' },
      { id: '8-3', title: 'ایجاد عادات مثبت' }
    ]
  }
]

// Categories and levels
const categories = [
  { value: '', label: 'همه دسته‌ها', icon: 'ph:grid-four', color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-50 dark:bg-slate-700' },
  { value: 'psychology', label: 'روان‌شناسی', icon: 'ph:brain', color: 'from-indigo-400 to-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { value: 'communication', label: 'ارتباطات', icon: 'ph:chat-circle', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { value: 'personal-development', label: 'توسعه فردی', icon: 'ph:trend-up', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { value: 'marriage', label: 'آمادگی ازدواج', icon: 'ph:heart', color: 'from-rose-400 to-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-900/20' },
  { value: 'social-skills', label: 'مهارت‌های اجتماعی', icon: 'ph:users', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' }
]

const levels = [
  { value: '', label: 'همه سطوح', icon: 'ph:stack', badge: '∞', color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-50 dark:bg-slate-700' },
  { value: 'beginner', label: 'مقدماتی', icon: 'ph:baby', badge: '1', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { value: 'intermediate', label: 'متوسط', icon: 'ph:graduation-cap', badge: '2', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  { value: 'advanced', label: 'پیشرفته', icon: 'ph:medal', badge: '3', color: 'from-red-400 to-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' }
]

// Reactive filters - allow multi-selection for categories
const selectedCategories = ref<string[]>([])
const selectedLevel = ref('')
const searchQuery = ref('')

// Helper functions for category selection
function toggleCategory(categoryValue: string) {
  if (categoryValue === '') {
    // "All categories" selected - clear all other selections
    selectedCategories.value = []
  } else {
    // Toggle individual category
    const index = selectedCategories.value.indexOf(categoryValue)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(categoryValue)
    }
  }
}

function isCategorySelected(categoryValue: string) {
  if (categoryValue === '') {
    return selectedCategories.value.length === 0
  }
  return selectedCategories.value.includes(categoryValue)
}

// Enhanced filtered courses with proper logic
const filteredCourses = computed(() => {
  let courses = [...mockCourses]

  // Filter by categories (if any selected)
  if (selectedCategories.value.length > 0) {
    courses = courses.filter(course => 
      selectedCategories.value.includes(course.category)
    )
  }

  // Filter by level
  if (selectedLevel.value) {
    courses = courses.filter(course => course.level === selectedLevel.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    courses = courses.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.instructor?.toLowerCase().includes(query) ||
      course.lessons?.some(lesson => lesson.title.toLowerCase().includes(query))
    )
  }

  return courses
})

// Get category display text
function getCategoryDisplayText() {
  if (selectedCategories.value.length === 0) {
    return 'همه دسته‌ها'
  } else if (selectedCategories.value.length === 1) {
    return categories.find(c => c.value === selectedCategories.value[0])?.label || 'نامشخص'
  } else {
    return `${selectedCategories.value.length} دسته انتخاب شده`
  }
}

// Course actions
function showCourseDetails(course: any) {
  navigateTo(`/hammasir/education/courses/${course.id}`)
}

function enrollInCourse(course: Course) {
  console.log('Enroll in course:', course.title)
  // TODO: Implement enrollment logic
}

function resetFilters() {
  selectedCategories.value = []
  selectedLevel.value = ''
  searchQuery.value = ''
}
</script>

<template>
  <div>
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-1 shadow-2xl shadow-primary-500/25 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Floating decorative elements -->
        <div class="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-6 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center max-w-4xl mx-auto">
          <BaseHeading
            as="h1"
            size="4xl"
            weight="bold"
            lead="tight"
            class="text-white drop-shadow-lg mb-4"
          >
            <span class="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">دوره‌های آموزشی همسیر</span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
            <span>با دوره‌های تخصصی ما مهارت‌های لازم برای زندگی موفق و روابط سالم را کسب کنید</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-8 shadow-xl border border-white/20 mb-8">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100/50 to-blue-100/50 rounded-full blur-2xl"></div>
      
      <div class="relative">
        <!-- Search Section -->
        <div class="mb-8">
          <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-4 flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center me-4 shadow-xl shadow-blue-500/25">
              <Icon name="ph:magnifying-glass" class="w-6 h-6 text-white" />
            </div>
            <span>جستجو و فیلتر دوره‌ها</span>
          </BaseHeading>
          
          <div class="relative max-w-2xl mx-auto">
            <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 focus-within:border-primary-300 dark:focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/50">
              <!-- Search Input -->
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در دوره‌ها، مدرس‌ها و موضوعات..."
                class="flex-1 h-16 px-8 text-lg bg-transparent border-0 outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                @keyup.enter="() => {}"
              />
              
              <!-- Beautiful Search Button -->
              <button 
                class="group relative h-12 w-12 m-2 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800"
                @click="() => {}"
              >
                <Icon name="ph:magnifying-glass" class="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                
                <!-- Ripple effect on click -->
                <div class="absolute inset-0 bg-white opacity-0 rounded-full group-active:opacity-20 group-active:scale-100 scale-0 transition-all duration-150"></div>
              </button>
            </div>
            
            <!-- Search suggestions or quick filters (when focused) -->
            <div 
              v-if="searchQuery && searchQuery.length > 0" 
              class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden"
            >
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">جستجو برای: "{{ searchQuery }}"</div>
                <div class="flex items-center text-primary-600 dark:text-primary-400">
                  <Icon name="ph:magnifying-glass" class="w-4 h-4 me-2" />
                  <span class="text-sm font-medium">{{ filteredCourses.length }} نتیجه پیدا شد</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center me-3 shadow-lg">
                <Icon name="ph:squares-four" class="w-4 h-4 text-white" />
              </div>
              <span>دسته‌بندی‌ها</span>
            </BaseHeading>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">
              <span>{{ getCategoryDisplayText() }}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button 
              v-for="category in categories" 
              :key="category.value"
              @click="toggleCategory(category.value)"
              class="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] transform cursor-pointer shadow-sm hover:shadow-md"
              :class="isCategorySelected(category.value)
                ? 'ring-2 ring-gray-300 dark:ring-gray-600 scale-[1.02] ' + category.bgColor
                : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <!-- Icon -->
              <div class="flex flex-col items-center text-center">
                <div 
                  class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105 shadow-sm"
                  :class="'bg-gradient-to-br text-white ' + category.color"
                >
                  <Icon :name="category.icon" class="w-7 h-7" />
                </div>
                
                <!-- Label -->
                <span 
                  class="text-sm font-semibold leading-tight transition-colors duration-300 text-gray-700 dark:text-gray-200"
                >
                  {{ category.label }}
                </span>
              </div>
              
              <!-- Selection indicator -->
              <div v-if="isCategorySelected(category.value)" class="absolute top-3 right-3 w-5 h-5 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center">
                <Icon name="ph:check" class="w-3 h-3 text-white font-bold" />
              </div>
            </button>
          </div>
        </div>

        <!-- Level Filter -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-800 dark:text-white flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center me-3 shadow-lg">
                <Icon name="ph:ranking" class="w-4 h-4 text-white" />
              </div>
              <span>سطح دشواری</span>
            </BaseHeading>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">
              <span>{{ selectedLevel ? levels.find(l => l.value === selectedLevel)?.label : 'همه سطوح' }}</span>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-5 justify-center">
            <button 
              v-for="level in levels" 
              :key="level.value"
              @click="selectedLevel = selectedLevel === level.value ? '' : level.value"
              class="group relative overflow-hidden rounded-2xl p-6 min-w-[140px] transition-all duration-300 hover:scale-[1.02] transform cursor-pointer shadow-sm hover:shadow-md"
              :class="selectedLevel === level.value 
                ? 'ring-2 ring-gray-300 dark:ring-gray-600 scale-[1.02] ' + level.bgColor
                : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <!-- Content -->
              <div class="flex flex-col items-center text-center">
                <!-- Badge and Icon -->
                <div class="relative mb-4">
                  <div 
                    class="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm"
                    :class="'bg-gradient-to-br text-white ' + level.color"
                  >
                    <Icon :name="level.icon" class="w-8 h-8" />
                  </div>
                  
                  <!-- Level Badge -->
                  <div 
                    class="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm font-bold text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600"
                  >
                    {{ level.badge }}
                  </div>
                </div>
                
                <!-- Label -->
                <span class="text-sm font-semibold leading-tight text-gray-700 dark:text-gray-200">
                  {{ level.label }}
                </span>
              </div>
              
              <!-- Selection indicator -->
              <div v-if="selectedLevel === level.value" class="absolute top-3 left-3 w-5 h-5 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center">
                <Icon name="ph:check" class="w-3 h-3 text-white font-bold" />
              </div>
            </button>
          </div>
        </div>
        
        <!-- Filter Summary & Actions -->
        <div class="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-6 border border-gray-200/80 dark:border-gray-700/80">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- Results count -->
            <div class="flex items-center gap-4">
              <div class="flex items-center bg-gray-600 dark:bg-gray-700 text-white px-5 py-2.5 rounded-xl shadow-sm">
                <Icon name="ph:list-bullets" class="w-4 h-4 me-2" />
                <span class="font-bold">{{ filteredCourses.length }}</span>
                <span class="text-gray-200 mr-2">دوره یافت شد</span>
              </div>
              
              <!-- Active filters indicator -->
              <div v-if="selectedCategories.length > 0 || selectedLevel || searchQuery" class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">فیلتر فعال</span>
              </div>
            </div>
            
            <!-- Clear filters -->
            <BaseButton 
              v-if="selectedCategories.length > 0 || selectedLevel || searchQuery"
              @click="resetFilters"
              class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-sm hover:shadow-md transition-all duration-300 px-5 py-2.5 rounded-xl"
            >
              <Icon name="ph:broom" class="w-4 h-4 me-2" />
              <span class="font-medium">پاک کردن فیلترها</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Grid -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50"
      >
        <!-- Course Thumbnail -->
        <div class="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div class="w-full h-full flex items-center justify-center">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Icon name="ph:book-open" class="w-10 h-10 text-white" />
            </div>
          </div>
          
          <!-- Course level badge -->
          <div class="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            مقدماتی
          </div>
        </div>
        
        <!-- Course Content -->
        <div class="p-6">
          <BaseHeading as="h4" size="md" weight="bold" class="text-gray-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <span>{{ course.title }}</span>
          </BaseHeading>
          
          <!-- Course meta info -->
          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <Icon name="ph:list-bullets" class="w-4 h-4 me-2" />
              <span>{{ course.lessons?.length || 0 }} جلسه</span>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <Icon name="ph:clock" class="w-4 h-4 me-2" />
              <span>{{ course.duration }}</span>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <Icon name="ph:graduation-cap" class="w-4 h-4 me-2" />
              <span>{{ course.instructor }}</span>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <Icon name="ph:users" class="w-4 h-4 me-2" />
              <span>{{ course.studentsCount }} دانشجو</span>
            </div>
          </div>

          <!-- Rating and Level -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <Icon name="ph:star-fill" class="w-4 h-4 text-yellow-500" />
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ course.rating }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <BaseTag 
                size="sm" 
                rounded="full"
                :class="{
                  'bg-emerald-100 text-emerald-700 border-emerald-200': course.level === 'beginner',
                  'bg-amber-100 text-amber-700 border-amber-200': course.level === 'intermediate', 
                  'bg-red-100 text-red-700 border-red-200': course.level === 'advanced'
                }"
              >
                {{ levels.find(l => l.value === course.level)?.label || 'نامشخص' }}
              </BaseTag>
            </div>
          </div>
          
          <!-- Course category tag -->
          <div class="mb-4">
            <BaseTag 
              size="sm" 
              rounded="full"
              :class="{
                'bg-indigo-100 text-indigo-700 border-indigo-200': course.category === 'psychology',
                'bg-blue-100 text-blue-700 border-blue-200': course.category === 'communication',
                'bg-emerald-100 text-emerald-700 border-emerald-200': course.category === 'personal-development',
                'bg-rose-100 text-rose-700 border-rose-200': course.category === 'marriage',
                'bg-amber-100 text-amber-700 border-amber-200': course.category === 'social-skills'
              }"
            >
              {{ categories.find(c => c.value === course.category)?.label || 'نامشخص' }}
            </BaseTag>
          </div>
          
          <!-- Beautiful Action Buttons -->
          <div class="flex gap-2">
            <!-- Primary Action - Course Details -->
            <button 
              class="group flex-1 relative overflow-hidden bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              @click="showCourseDetails(course)"
            >
              <!-- Background animation -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div class="relative flex items-center justify-center gap-1.5">
                <Icon name="ph:eye" class="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span class="text-sm font-medium">مشاهده جزئیات</span>
              </div>
            </button>
            
            <!-- Secondary Action - Add to Favorites/Enroll -->
            <button 
              class="group relative overflow-hidden bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
              @click="enrollInCourse(course)"
              title="افزودن به علاقه‌مندی‌ها"
            >
              <Icon name="ph:heart" class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-red-500" />
            </button>
            
            <!-- Quick Action - Bookmark -->
            <button 
              class="group relative overflow-hidden bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
              @click="() => console.log('Bookmark course:', course.title)"
              title="نشان‌گذاری دوره"
            >
              <Icon name="ph:bookmark" class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-500" />
            </button>
          </div>
        </div>
        
        <!-- Hover effect overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      </div>
    </div>
    
    <!-- No Results State -->
    <div v-else class="text-center py-16">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-12 shadow-lg border border-gray-200/50">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-2xl"></div>
        
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Icon name="ph:magnifying-glass" class="w-10 h-10 text-white" />
          </div>
          
          <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-3">
            <span>دوره‌ای یافت نشد</span>
          </BaseHeading>
          
          <BaseParagraph class="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            <span>متأسفانه با فیلترهای انتخابی شما دوره‌ای یافت نشد. لطفاً فیلترها را تغییر دهید و دوباره تلاش کنید.</span>
          </BaseParagraph>
          
          <BaseButton 
            @click="resetFilters"
            class="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4 me-2" />
            <span>نمایش همه دوره‌ها</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>