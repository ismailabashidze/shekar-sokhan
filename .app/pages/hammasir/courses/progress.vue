<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        پیشرفت یادگیری
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        پیگیری پیشرفت شما در دوره‌های ثبت‌نام شده
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
            خطا در بارگذاری پیشرفت
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{{ coursesError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="learningProgress.length === 0" class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <svg class="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        پیشرفتی یافت نشد
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        شما هنوز در هیچ دوره‌ای پیشرفتی ثبت نکرده‌اید.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/hammasir/courses/my"
          class="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          مشاهده دوره‌های من
        </NuxtLink>
      </div>
    </div>

    <!-- Progress list -->
    <div v-else class="space-y-6">
      <div
        v-for="progress in learningProgress"
        :key="progress.courseId"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ getCourseTitle(progress.courseId) }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                آخرین به‌روزرسانی: {{ formatDate(progress.lastUpdated || new Date().toISOString()) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {{ Math.round(progress.completionPercentage || 0) }}%
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                تکمیل شده
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">پیشرفت</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ Math.round(progress.completionPercentage || 0) }}%
              </span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                class="h-2 rounded-full bg-purple-600" 
                :style="{ width: `${progress.completionPercentage || 0}%` }"
              />
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ progress.completedLessons || 0 }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                درس تکمیل شده
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ progress.totalLessons || 0 }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                کل درس‌ها
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ progress.estimatedHours || 0 }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                ساعت تخمینی
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <NuxtLink 
              :to="`/hammasir/courses/${progress.courseId}`"
              class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              ادامه یادگیری
              <svg class="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourses } from '~/composables/hammasir/useCourses'
import type { CourseDto, LearningProgressDto } from '~/types/api'

definePageMeta({
  title: 'پیشرفت یادگیری',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  learningProgress, 
  userCourses,
  isCoursesLoading, 
  coursesError,
  getMyLearningProgress,
  getAllCourses
} = useCourses()

// Load progress and courses on page mount
onMounted(async () => {
  await Promise.all([
    getMyLearningProgress(),
    getAllCourses()
  ])
})

// Get course title by ID
const getCourseTitle = (courseId: string) => {
  const course = userCourses.value.find(c => c.id === courseId)
  return course ? course.title : 'دوره نامشخص'
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR')
}
</script>