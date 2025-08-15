<script setup lang="ts">
import type { Course } from '~/composables/education'

definePageMeta({
  title: 'دوره‌های من',
  preview: {
    title: 'My Courses',
    description: 'View and manage enrolled courses',
    categories: ['education'],
    src: '/img/screens/my-courses.png',
    srcDark: '/img/screens/my-courses-dark.png',
    order: 2,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Composable
const { getMyEnrollments } = useEducation()

// Reactive data
const enrollments = ref<Array<{
  id: string
  courseId: string
  enrolledAt: string
  status: 'active' | 'completed' | 'paused'
  progress: number
  course: Course
}>>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeFilter = ref<'all' | 'active' | 'completed' | 'paused'>('all')

// Mock enrollments data
const mockEnrollments = [
  {
    id: 'e1',
    courseId: '1',
    enrolledAt: '1403/05/10',
    status: 'active' as const,
    progress: 65,
    course: {
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
        { id: '1-3', title: 'ابراز احساسات مثبت' },
        { id: '1-4', title: 'مهارت‌های ارتباطی در بحران' },
        { id: '1-5', title: 'ایجاد روابط پایدار' },
        { id: '1-6', title: 'تمرین‌های عملی و ارزیابی نهایی' }
      ]
    }
  },
  {
    id: 'e2',
    courseId: '2',
    enrolledAt: '1403/04/15',
    status: 'completed' as const,
    progress: 100,
    course: {
      id: '2',
      title: 'غلبه بر اضطراب اجتماعی',
      thumbnail: '/img/courses/social-anxiety.jpg',
      category: 'psychology',
      level: 'intermediate',
      duration: '6 هفته',
      instructor: 'دکتر احمد رضایی',
      rating: 4.7,
      studentsCount: 189,
      lessons: [
        { id: '2-1', title: 'شناخت اضطراب اجتماعی' },
        { id: '2-2', title: 'تکنیک‌های آرام‌سازی' },
        { id: '2-3', title: 'مهارت‌های ارتباطی' },
        { id: '2-4', title: 'مواجهه تدریجی' }
      ]
    }
  },
  {
    id: 'e3',
    courseId: '3',
    enrolledAt: '1403/06/01',
    status: 'paused' as const,
    progress: 25,
    course: {
      id: '3',
      title: 'تقویت اعتماد به نفس',
      thumbnail: '/img/courses/self-confidence.jpg',
      category: 'self-development',
      level: 'beginner',
      duration: '3 هفته',
      instructor: 'مریم حسینی',
      rating: 4.9,
      studentsCount: 312,
      lessons: [
        { id: '3-1', title: 'درک مفهوم اعتماد به نفس' },
        { id: '3-2', title: 'شناسایی نقاط قوت' },
        { id: '3-3', title: 'چالش با افکار منفی' }
      ]
    }
  }
]

// Load enrollments
onMounted(async () => {
  try {
    loading.value = true
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800))
    enrollments.value = mockEnrollments
  } catch (err) {
    error.value = 'خطا در بارگذاری دوره‌ها'
    console.error('Error fetching enrollments:', err)
  } finally {
    loading.value = false
  }
})

// Computed
const filteredEnrollments = computed(() => {
  if (activeFilter.value === 'all') return enrollments.value
  return enrollments.value.filter(enrollment => enrollment.status === activeFilter.value)
})

const statsData = computed(() => {
  const total = enrollments.value.length
  const active = enrollments.value.filter(e => e.status === 'active').length
  const completed = enrollments.value.filter(e => e.status === 'completed').length
  const paused = enrollments.value.filter(e => e.status === 'paused').length
  
  return { total, active, completed, paused }
})

// Methods
function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'در حال مطالعه'
    case 'completed': return 'تکمیل شده'
    case 'paused': return 'متوقف شده'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'completed': return 'bg-green-100 text-green-700 border-green-200'
    case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'psychology': return 'روان‌شناسی'
    case 'self-development': return 'توسعه فردی'
    case 'mindfulness': return 'ذهن‌آگاهی'
    case 'relationship': return 'روابط'
    default: return category
  }
}

function continueCourse(enrollment: any) {
  navigateTo(`/hammasir/education/courses/${enrollment.course.id}`)
}

function viewCertificate(enrollment: any) {
  console.log('View certificate for:', enrollment.course.title)
  // TODO: Implement certificate viewing
}

function pauseResumeCourse(enrollment: any) {
  const newStatus = enrollment.status === 'paused' ? 'active' : 'paused'
  enrollment.status = newStatus
  console.log(`Course ${newStatus === 'active' ? 'resumed' : 'paused'}:`, enrollment.course.title)
  // TODO: Implement API call
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-1 shadow-2xl shadow-primary-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Decorative elements -->
        <div class="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-6 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Icon name="ph:student" class="w-8 h-8 text-white" />
          </div>
          
          <BaseHeading as="h1" size="4xl" weight="bold" class="text-white drop-shadow-lg mb-4">
            <span>دوره‌های من</span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-lg">
            <span>پیشرفت و مدیریت دوره‌های ثبت‌نام شده</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">در حال بارگذاری دوره‌ها...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-12 shadow-lg border border-red-200/50">
        <div class="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon name="ph:warning" class="w-10 h-10 text-white" />
        </div>
        <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-3">
          <span>{{ error }}</span>
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-300">
          <span>لطفاً دوباره تلاش کنید.</span>
        </BaseParagraph>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Icon name="ph:books" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsData.total }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">کل دوره‌ها</div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Icon name="ph:play-circle" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsData.active }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">در حال مطالعه</div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Icon name="ph:check-circle" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsData.completed }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">تکمیل شده</div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Icon name="ph:pause-circle" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsData.paused }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">متوقف شده</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div class="flex flex-wrap gap-3 justify-center">
          <button 
            v-for="filter in [
              { id: 'all', label: 'همه دوره‌ها', icon: 'ph:list' },
              { id: 'active', label: 'در حال مطالعه', icon: 'ph:play-circle' },
              { id: 'completed', label: 'تکمیل شده', icon: 'ph:check-circle' },
              { id: 'paused', label: 'متوقف شده', icon: 'ph:pause-circle' }
            ]"
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300"
            :class="activeFilter === filter.id 
              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            <Icon :name="filter.icon" class="w-4 h-4" />
            <span>{{ filter.label }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEnrollments.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon name="ph:empty" class="w-12 h-12 text-gray-400" />
        </div>
        <BaseHeading as="h3" size="lg" class="text-gray-600 dark:text-gray-400 mb-4">
          <span>دوره‌ای یافت نشد</span>
        </BaseHeading>
        <BaseParagraph class="text-gray-500 dark:text-gray-500 mb-6">
          <span>در این دسته‌بندی دوره‌ای ثبت‌نام نکرده‌اید.</span>
        </BaseParagraph>
        <BaseButton @click="$router.push('/hammasir/education/courses')" class="bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <Icon name="ph:plus" class="w-4 h-4 me-2" />
          <span>مرور دوره‌ها</span>
        </BaseButton>
      </div>

      <!-- Course Cards -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          v-for="enrollment in filteredEnrollments" 
          :key="enrollment.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <!-- Progress Bar -->
          <div class="h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              class="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-500"
              :style="{ width: `${enrollment.progress}%` }"
            ></div>
          </div>

          <div class="p-6">
            <!-- Course Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="ph:book-open" class="w-8 h-8 text-white" />
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <BaseTag 
                    size="sm" 
                    rounded="full"
                    :class="getStatusColor(enrollment.status)"
                  >
                    {{ getStatusLabel(enrollment.status) }}
                  </BaseTag>
                  <BaseTag 
                    size="sm" 
                    rounded="full"
                    class="bg-gray-100 text-gray-700 border-gray-200"
                  >
                    {{ getCategoryLabel(enrollment.course.category) }}
                  </BaseTag>
                </div>
                
                <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {{ enrollment.course.title }}
                </h3>
                
                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <Icon name="ph:user" class="w-4 h-4" />
                    <span>{{ enrollment.course.instructor }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="ph:calendar" class="w-4 h-4" />
                    <span>{{ enrollment.enrolledAt }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Info -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">پیشرفت دوره</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enrollment.progress }}%</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-500">
                {{ Math.ceil((enrollment.progress / 100) * enrollment.course.lessons.length) }} از {{ enrollment.course.lessons.length }} جلسه تکمیل شده
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                v-if="enrollment.status !== 'completed'"
                @click="continueCourse(enrollment)"
                class="flex-1 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <Icon name="ph:play" class="w-4 h-4 me-2 inline" />
                ادامه دوره
              </button>

              <button
                v-if="enrollment.status === 'completed'"
                @click="viewCertificate(enrollment)"
                class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <Icon name="ph:certificate" class="w-4 h-4 me-2 inline" />
                مشاهده گواهی
              </button>

              <button
                v-if="enrollment.status !== 'completed'"
                @click="pauseResumeCourse(enrollment)"
                class="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <Icon 
                  :name="enrollment.status === 'paused' ? 'ph:play' : 'ph:pause'" 
                  class="w-4 h-4" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>