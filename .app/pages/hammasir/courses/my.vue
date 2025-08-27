<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        دوره‌های من
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        لیست دوره‌هایی که در آن‌ها ثبت‌نام کرده‌اید
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isCoursesLoading" class="flex items-center justify-center py-12">
      <div class="size-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
    </div>

    <!-- Error state -->
    <div v-else-if="coursesError" class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="size-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="mr-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            خطا در بارگذاری دوره‌ها
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{{ coursesError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="userEnrollments.length === 0" class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <svg class="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        دوره‌ای یافت نشد
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        شما در هیچ دوره‌ای ثبت‌نام نکرده‌اید.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/hammasir/courses"
          class="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          مشاهده دوره‌ها
        </NuxtLink>
      </div>
    </div>

    <!-- Enrolled courses -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="enrollment in userEnrollments"
        :key="enrollment.id"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="p-6">
          <div class="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-blue-600" />
          
          <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            {{ getCourseTitle(enrollment.courseId) }}
          </h3>
          
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center">
              <span :class="getEnrollmentStatusClass(enrollment.status)" class="rounded-full px-2 py-1 text-xs font-medium">
                {{ getEnrollmentStatusText(enrollment.status) }}
              </span>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ getPaymentStatusText(enrollment.paymentStatus) }}
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <NuxtLink 
              :to="`/hammasir/courses/${enrollment.courseId}`"
              class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              ادامه یادگیری
            </NuxtLink>
            
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <span v-if="enrollment.status === 'IN_PROGRESS'">
                در حال انجام
              </span>
              <span v-else-if="enrollment.status === 'COMPLETED'">
                تکمیل شده
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourses } from '~/composables/hammasir/useCourses'
import type { CourseDto, EnrollmentDto } from '~/types/api'

definePageMeta({
  title: 'دوره‌های من',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  userEnrollments, 
  userCourses,
  isCoursesLoading, 
  coursesError,
  getMyEnrollments,
  getAllCourses
} = useCourses()

// Load enrollments and courses on page mount
onMounted(async () => {
  await Promise.all([
    getMyEnrollments(),
    getAllCourses()
  ])
})

// Get course title by ID
const getCourseTitle = (courseId: string) => {
  const course = userCourses.value.find(c => c.id === courseId)
  return course ? course.title : 'دوره نامشخص'
}

// Get enrollment status text
const getEnrollmentStatusText = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'در حال انجام'
    case 'COMPLETED':
      return 'تکمیل شده'
    default:
      return 'نامشخص'
  }
}

// Get enrollment status class
const getEnrollmentStatusClass = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// Get payment status text
const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'در انتظار پرداخت'
    case 'SUCCESSFUL':
      return 'پرداخت موفق'
    case 'FAILED':
      return 'پرداخت ناموفق'
    default:
      return 'نامشخص'
  }
}
</script>