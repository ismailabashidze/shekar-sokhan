<script setup lang="ts">
import type { Course } from '~/composables/education'

definePageMeta({
  title: 'جزئیات دوره',
  preview: {
    title: 'Course Details',
    description: 'Detailed course information and enrollment',
    categories: ['education'],
    src: '/img/screens/course-details.png',
    srcDark: '/img/screens/course-details-dark.png',
    order: 3,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Get course ID from route
const route = useRoute()
const courseId = route.params.course as string

// Mock course data for demonstration
const mockCourseDetails: Record<string, Course & {
  description: string
  prerequisites: string[]
  learningOutcomes: string[]
  syllabus: Array<{
    week: number
    title: string
    topics: string[]
    assignments?: string[]
  }>
  instructor: {
    name: string
    bio: string
    avatar: string
    rating: number
    experience: string
    specialties: string[]
  }
  price: {
    original: number
    discounted?: number
    currency: string
  }
  schedule: {
    startDate: string
    duration: string
    sessionsPerWeek: number
    sessionDuration: string
  }
  reviews: Array<{
    id: string
    userName: string
    userAvatar: string
    rating: number
    comment: string
    date: string
  }>
}> = {
  '1': {
    id: '1',
    title: 'مدیریت هیجانات در روابط',
    thumbnail: '/img/courses/emotion-management.jpg',
    category: 'psychology',
    level: 'beginner',
    duration: '4 هفته',
    instructor: {
      name: 'دکتر سارا محمدی',
      bio: 'متخصص روان‌شناسی بالینی با بیش از 10 سال تجربه در زمینه مشاوره خانواده و روابط. فارغ‌التحصیل دانشگاه تهران و دارای مدرک دکترای روان‌شناسی از دانشگاه شهید بهشتی.',
      avatar: '/img/avatars/instructor-1.svg',
      rating: 4.9,
      experience: '10+ سال تجربه',
      specialties: ['روان‌شناسی بالینی', 'مشاوره خانواده', 'مدیریت هیجان', 'روان‌درمانی']
    },
    rating: 4.8,
    studentsCount: 245,
    description: 'این دوره جامع به شما کمک می‌کند تا مهارت‌های لازم برای مدیریت هیجانات در روابط شخصی و اجتماعی را کسب کنید. در این دوره با تکنیک‌های علمی و عملی آشنا خواهید شد که به شما کمک می‌کند تا روابط سالم‌تری برقرار کنید.',
    prerequisites: [
      'علاقه به یادگیری و رشد شخصی',
      'آمادگی برای تمرین تکنیک‌های آموخته شده',
      'داشتن زمان کافی برای انجام تمرینات هفتگی'
    ],
    learningOutcomes: [
      'شناخت انواع هیجانات و نحوه تأثیر آن‌ها بر روابط',
      'یادگیری تکنیک‌های کنترل خشم و عصبانیت',
      'تسلط بر روش‌های ابراز احساسات مثبت',
      'ایجاد مهارت‌های ارتباطی مؤثر',
      'افزایش اعتماد به نفس در روابط اجتماعی'
    ],
    price: {
      original: 750000,
      discounted: 525000,
      currency: 'تومان'
    },
    schedule: {
      startDate: '1403/06/15',
      duration: '4 هفته',
      sessionsPerWeek: 2,
      sessionDuration: '90 دقیقه'
    },
    lessons: [
      { id: '1-1', title: 'شناخت انواع هیجانات' },
      { id: '1-2', title: 'کنترل خشم و عصبانیت' },
      { id: '1-3', title: 'ابراز احساسات مثبت' },
      { id: '1-4', title: 'مهارت‌های ارتباطی در بحران' },
      { id: '1-5', title: 'ایجاد روابط پایدار' },
      { id: '1-6', title: 'تمرین‌های عملی و ارزیابی نهایی' }
    ],
    syllabus: [
      {
        week: 1,
        title: 'مبانی مدیریت هیجان',
        topics: [
          'شناخت هیجانات پایه',
          'نقش هیجانات در روابط',
          'تشخیص علائم هیجانی'
        ],
        assignments: ['تکمیل پرسش‌نامه خودسنجی هیجانی', 'مشاهده ویدیوی آموزشی']
      },
      {
        week: 2,
        title: 'کنترل هیجانات منفی',
        topics: [
          'تکنیک‌های آرام‌سازی',
          'مدیریت خشم',
          'روش‌های کاهش اضطراب'
        ],
        assignments: ['تمرین تکنیک‌های تنفسی', 'نوشتن دفترچه هیجانی']
      },
      {
        week: 3,
        title: 'ابراز هیجانات مثبت',
        topics: [
          'بیان احساسات به روش سالم',
          'فنون ارتباط مؤثر',
          'ایجاد همدلی'
        ],
        assignments: ['تمرین مکالمه با خانواده', 'تحلیل موقعیت‌های ارتباطی']
      },
      {
        week: 4,
        title: 'تثبیت مهارت‌ها و ارزیابی',
        topics: [
          'مرور کلی مطالب',
          'تمرین‌های عملی',
          'برنامه‌ریزی برای آینده'
        ],
        assignments: ['پروژه نهایی', 'ارائه تجربیات شخصی']
      }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'مریم احمدی',
        userAvatar: '/img/avatars/user-1.svg',
        rating: 5,
        comment: 'دوره فوق‌العاده‌ای بود! واقعاً روابطم با خانواده بهتر شده و یاد گرفتم چطور هیجاناتم رو کنترل کنم.',
        date: '1403/05/20'
      },
      {
        id: 'r2',
        userName: 'علی رضایی',
        userAvatar: '/img/avatars/user-2.svg',
        rating: 5,
        comment: 'دکتر محمدی استاد بسیار خوبی هستند. مطالب عملی و کاربردی بود.',
        date: '1403/05/18'
      },
      {
        id: 'r3',
        userName: 'فاطمه کریمی',
        userAvatar: '/img/avatars/user-3.svg',
        rating: 4,
        comment: 'دوره خوبی بود ولی کاش بیشتر روی مثال‌های عملی تمرکز می‌شد.',
        date: '1403/05/15'
      }
    ]
  }
}

// Simulate API call
const { $fetch } = useNuxtApp()

const course = ref<Course | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Mock getCourseById function
const getCourseById = async (courseId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const courseData = mockCourseDetails[courseId]
  if (!courseData) {
    throw new Error('Course not found')
  }
  return courseData
}

// Fetch course data
onMounted(async () => {
  try {
    loading.value = true
    course.value = await getCourseById(courseId)
  } catch (err) {
    error.value = 'دوره مورد نظر یافت نشد'
    console.error('Error fetching course:', err)
  } finally {
    loading.value = false
  }
})

// Reactive data
const activeTab = ref('overview')
const isEnrolled = ref(false)

// Methods
function enrollInCourse() {
  isEnrolled.value = true
  // TODO: Implement actual enrollment
  console.log('Enrolling in course:', course.value?.title)
}

function addToWishlist() {
  // TODO: Implement wishlist functionality
  console.log('Added to wishlist:', course.value?.title)
}

function shareCourse() {
  // TODO: Implement share functionality
  console.log('Sharing course:', course.value?.title)
}

// Computed
const discountPercentage = computed(() => {
  if (!course.value?.price.discounted || !course.value?.price.original) return 0
  return Math.round(((course.value.price.original - course.value.price.discounted) / course.value.price.original) * 100)
})

const averageRating = computed(() => {
  if (!course.value?.reviews?.length) return 0
  const sum = course.value.reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / course.value.reviews.length).toFixed(1)
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">در حال بارگذاری اطلاعات دوره...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-12 shadow-lg border border-red-200/50">
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Icon name="ph:warning" class="w-10 h-10 text-white" />
          </div>
          
          <BaseHeading as="h3" size="lg" weight="bold" class="text-gray-800 dark:text-white mb-3">
            <span>{{ error }}</span>
          </BaseHeading>
          
          <BaseParagraph class="text-gray-600 dark:text-gray-300 mb-6">
            <span>لطفاً دوباره تلاش کنید یا به صفحه دوره‌ها بازگردید.</span>
          </BaseParagraph>
          
          <BaseButton 
            @click="$router.push('/hammasir/education/courses')"
            class="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
            <span>بازگشت به دوره‌ها</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Course Content -->
    <div v-else-if="course" class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-1 shadow-2xl shadow-primary-500/25">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
        <div class="relative rounded-2xl bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-purple-700/90 backdrop-blur-xl px-8 py-12">
          <!-- Floating decorative elements -->
          <div class="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
          <div class="absolute bottom-6 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
          
          <div class="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <!-- Course Info -->
            <div class="lg:col-span-2">
              <div class="flex items-center gap-3 mb-4">
                <BaseTag 
                  size="sm" 
                  rounded="full"
                  class="bg-white/20 text-white border-white/30"
                >
                  {{ course.category === 'psychology' ? 'روان‌شناسی' : 'سایر' }}
                </BaseTag>
                <BaseTag 
                  size="sm" 
                  rounded="full"
                  class="bg-white/20 text-white border-white/30"
                >
                  {{ course.level === 'beginner' ? 'مقدماتی' : course.level === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
                </BaseTag>
              </div>
              
              <BaseHeading
                as="h1"
                size="4xl"
                weight="bold"
                lead="tight"
                class="text-white drop-shadow-lg mb-4"
              >
                <span>{{ course.title }}</span>
              </BaseHeading>
              
              <BaseParagraph class="text-white/90 text-lg leading-relaxed mb-6">
                <span>{{ course.description }}</span>
              </BaseParagraph>
              
              <!-- Course Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ph:users" class="w-5 h-5 text-white/80" />
                    <span class="text-white/80 text-sm">دانشجویان</span>
                  </div>
                  <div class="text-white font-bold text-lg">{{ course.studentsCount }}</div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ph:star-fill" class="w-5 h-5 text-yellow-300" />
                    <span class="text-white/80 text-sm">امتیاز</span>
                  </div>
                  <div class="text-white font-bold text-lg">{{ averageRating }}</div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ph:clock" class="w-5 h-5 text-white/80" />
                    <span class="text-white/80 text-sm">مدت دوره</span>
                  </div>
                  <div class="text-white font-bold text-lg">{{ course.duration }}</div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ph:list-bullets" class="w-5 h-5 text-white/80" />
                    <span class="text-white/80 text-sm">جلسات</span>
                  </div>
                  <div class="text-white font-bold text-lg">{{ course.lessons?.length }}</div>
                </div>
              </div>
            </div>
            
            <!-- Enrollment Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <!-- Price -->
              <div class="mb-6">
                <div v-if="course.price.discounted" class="flex items-center gap-3 mb-2">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ course.price.discounted.toLocaleString() }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">{{ course.price.currency }}</span>
                  <BaseTag 
                    size="sm" 
                    rounded="full"
                    class="bg-red-100 text-red-700 border-red-200"
                  >
                    {{ discountPercentage }}% تخفیف
                  </BaseTag>
                </div>
                <div v-if="course.price.discounted" class="text-gray-500 dark:text-gray-400 line-through">
                  {{ course.price.original.toLocaleString() }} {{ course.price.currency }}
                </div>
                <div v-else class="flex items-center gap-3 mb-2">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ course.price.original.toLocaleString() }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">{{ course.price.currency }}</span>
                </div>
              </div>
              
              <!-- Enrollment Button -->
              <div class="space-y-3 mb-6">
                <button 
                  v-if="!isEnrolled"
                  @click="enrollInCourse"
                  class="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Icon name="ph:plus-circle" class="w-5 h-5 me-2 inline" />
                  ثبت نام در دوره
                </button>
                
                <div v-else class="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg text-center">
                  <Icon name="ph:check-circle" class="w-5 h-5 me-2 inline" />
                  ثبت نام شده
                </div>
                
                <div class="flex gap-2">
                  <button 
                    @click="addToWishlist"
                    class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <Icon name="ph:heart" class="w-4 h-4 me-1 inline" />
                    علاقه‌مندی
                  </button>
                  
                  <button 
                    @click="shareCourse"
                    class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <Icon name="ph:share" class="w-4 h-4 me-1 inline" />
                    اشتراک‌گذاری
                  </button>
                </div>
              </div>
              
              <!-- Course Schedule -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">برنامه دوره</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">تاریخ شروع:</span>
                    <span class="font-medium">{{ course.schedule.startDate }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">جلسات در هفته:</span>
                    <span class="font-medium">{{ course.schedule.sessionsPerWeek }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">مدت هر جلسه:</span>
                    <span class="font-medium">{{ course.schedule.sessionDuration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <nav class="px-6 py-4">
            <div class="flex justify-center">
              <div class="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl">
                <button 
                  v-for="tab in [
                    { id: 'overview', label: 'بررسی کلی', icon: 'ph:info' },
                    { id: 'syllabus', label: 'سرفصل‌ها', icon: 'ph:list-bullets' },
                    { id: 'instructor', label: 'مدرس', icon: 'ph:user-circle' },
                    { id: 'reviews', label: 'نظرات', icon: 'ph:star' }
                  ]"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap"
                  :class="activeTab === tab.id 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'"
                >
                  <Icon 
                    :name="tab.icon" 
                    class="w-4 h-4 transition-all duration-300" 
                    :class="activeTab === tab.id ? 'text-white' : ''"
                  />
                  <span class="font-medium">{{ tab.label }}</span>
                  
                  <!-- Active glow effect -->
                  <div 
                    v-if="activeTab === tab.id"
                    class="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-500/20 rounded-xl blur-sm -z-10"
                  ></div>
                </button>
              </div>
            </div>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-8">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-8">
            <!-- Learning Outcomes -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">اهداف یادگیری</h3>
              <div class="grid gap-3">
                <div 
                  v-for="outcome in course.learningOutcomes" 
                  :key="outcome"
                  class="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                >
                  <Icon name="ph:check-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ outcome }}</span>
                </div>
              </div>
            </div>

            <!-- Prerequisites -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">پیش‌نیازها</h3>
              <div class="grid gap-3">
                <div 
                  v-for="prerequisite in course.prerequisites" 
                  :key="prerequisite"
                  class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                  <Icon name="ph:lightbulb" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ prerequisite }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Syllabus Tab -->
          <div v-if="activeTab === 'syllabus'" class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">برنامه هفتگی دوره</h3>
            
            <div class="space-y-4">
              <div 
                v-for="week in course.syllabus" 
                :key="week.week"
                class="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-primary-500 text-white rounded-lg flex items-center justify-center font-bold">
                    {{ week.week }}
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ week.title }}</h4>
                </div>
                
                <div class="mb-4">
                  <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-2">موضوعات:</h5>
                  <ul class="space-y-1">
                    <li 
                      v-for="topic in week.topics" 
                      :key="topic"
                      class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                    >
                      <Icon name="ph:dot" class="w-4 h-4 text-primary-500" />
                      {{ topic }}
                    </li>
                  </ul>
                </div>
                
                <div v-if="week.assignments" class="mb-4">
                  <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-2">تکالیف:</h5>
                  <ul class="space-y-1">
                    <li 
                      v-for="assignment in week.assignments" 
                      :key="assignment"
                      class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                    >
                      <Icon name="ph:pencil" class="w-4 h-4 text-orange-500" />
                      {{ assignment }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructor Tab -->
          <div v-if="activeTab === 'instructor'" class="space-y-6">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-shrink-0">
                <div class="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Icon name="ph:user" class="w-16 h-16 text-white" />
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ course.instructor.name }}</h3>
                <p class="text-primary-600 dark:text-primary-400 font-medium mb-4">{{ course.instructor.experience }}</p>
                
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex items-center gap-1">
                    <Icon name="ph:star-fill" class="w-5 h-5 text-yellow-500" />
                    <span class="font-semibold">{{ course.instructor.rating }}</span>
                    <span class="text-gray-500 dark:text-gray-400">امتیاز مدرس</span>
                  </div>
                </div>
                
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{{ course.instructor.bio }}</p>
                
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-3">تخصص‌ها:</h4>
                  <div class="flex flex-wrap gap-2">
                    <BaseTag 
                      v-for="specialty in course.instructor.specialties" 
                      :key="specialty"
                      size="sm" 
                      rounded="full"
                      class="bg-primary-100 text-primary-700 border-primary-200"
                    >
                      {{ specialty }}
                    </BaseTag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">نظرات دانشجویان</h3>
              <div class="flex items-center gap-2">
                <Icon name="ph:star-fill" class="w-5 h-5 text-yellow-500" />
                <span class="font-semibold">{{ averageRating }}</span>
                <span class="text-gray-500 dark:text-gray-400">({{ course.reviews.length }} نظر)</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="review in course.reviews" 
                :key="review.id"
                class="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="ph:user" class="w-6 h-6 text-white" />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h5 class="font-semibold text-gray-900 dark:text-white">{{ review.userName }}</h5>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{{ review.date }}</span>
                    </div>
                    
                    <div class="flex items-center gap-1 mb-3">
                      <Icon 
                        v-for="i in 5" 
                        :key="i"
                        name="ph:star-fill" 
                        class="w-4 h-4"
                        :class="i <= review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'"
                      />
                    </div>
                    
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>