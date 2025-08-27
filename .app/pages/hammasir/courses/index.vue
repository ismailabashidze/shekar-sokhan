<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        دوره‌های آموزشی
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        لیست کامل دوره‌های آموزشی موجود
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
    <div v-else-if="userCourses.length === 0" class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <svg class="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        دوره‌ای یافت نشد
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        در حال حاضر دوره‌ای برای نمایش وجود ندارد.
      </p>
    </div>

    <!-- Courses grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="course in userCourses"
        :key="course.id"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="p-6">
          <div v-if="course.thumbnail" class="mb-4 aspect-video overflow-hidden rounded-lg">
            <img :src="course.thumbnail" :alt="course.title" class="size-full object-cover">
          </div>
          <div v-else class="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-blue-600" />
          
          <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            {{ course.title }}
          </h3>
          
          <div class="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg class="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ course.lessons?.length || 0 }} درس</span>
          </div>
          
          <NuxtLink 
            :to="`/hammasir/courses/${course.id}`"
            class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            مشاهده دوره
            <svg class="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourses } from '~/composables/hammasir/useCourses'

definePageMeta({
  title: 'دوره‌های آموزشی',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  userCourses, 
  isCoursesLoading, 
  coursesError,
  getAllCourses 
} = useCourses()

// Load courses on page mount
onMounted(async () => {
  await getAllCourses()
})
</script>