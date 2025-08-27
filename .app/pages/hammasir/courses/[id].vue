<template>
  <div class="py-8">
    <!-- Loading state -->
    <div v-if="isCoursesLoading && !currentCourse" class="flex items-center justify-center py-12">
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
            خطا در بارگذاری دوره
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{{ coursesError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Course content -->
    <div v-else-if="currentCourse">
      <div class="mb-8">
        <NuxtLink 
          to="/hammasir/courses" 
          class="mb-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <svg class="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت به دوره‌ها
        </NuxtLink>
        
        <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {{ currentCourse.title }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          {{ currentCourse.description || 'توضیحاتی برای این دوره وجود ندارد' }}
        </p>
      </div>

      <div class="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90" />
        <div class="relative z-10">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <span class="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">پیشرفته</span>
              <span class="mr-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium">4 هفته</span>
            </div>
          </div>
          <h2 class="mb-4 text-2xl font-bold">
            {{ currentCourse.title }}
          </h2>

          <div class="mt-8 grid grid-cols-3 gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold">
                {{ currentCourse.lessons?.length || 0 }}
              </div>
              <div class="text-white/80">
                درس
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold">
                8
              </div>
              <div class="text-white/80">
                ماژول
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold">
                0%
              </div>
              <div class="text-white/80">
                پیشرفت شما
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm">پیشرفت</span>
              <span class="text-sm">0%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-white/20">
              <div class="h-2 rounded-full bg-white" style="width: 0%" />
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <div class="flex space-x-4 space-x-reverse">
              <span class="rounded-full bg-white/20 px-3 py-1 text-sm">فعال</span>
              <span class="rounded-full bg-white/20 px-3 py-1 text-sm">در حال انجام</span>
            </div>
            <button 
              v-if="!isEnrolled"
              :disabled="isCoursesCreating"
              class="rounded-lg bg-white px-6 py-3 font-medium text-purple-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              @click="enrollInCourseHandler"
            >
              <span v-if="isCoursesCreating">در حال ثبت‌نام...</span>
              <span v-else>ثبت‌نام در دوره</span>
            </button>
            <button 
              v-else
              class="rounded-lg bg-white px-6 py-3 font-medium text-purple-600 transition-colors hover:bg-gray-50"
            >
              ادامه یادگیری
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              محتوای دوره
            </h3>

            <div class="space-y-4">
              <div
                v-for="(lesson, index) in currentCourse.lessons"
                :key="lesson.id"
                class="overflow-hidden rounded-lg border border-gray-200 transition-colors dark:border-gray-600"
              >
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 space-x-reverse">
                      <div class="flex size-8 items-center justify-center rounded-full bg-gray-300">
                        <svg
                          class="size-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          {{ lesson.title }}
                        </h4>
                        <div class="mt-1 flex items-center space-x-4 space-x-reverse">
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            ⏱️ 15 دقیقه
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        قفل شده
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              درباره این دوره
            </h3>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="mb-4 text-gray-600 dark:text-gray-300">
                {{ currentCourse.description || 'توضیحاتی برای این دوره وجود ندارد' }}
              </p>
              <p class="mb-6 text-gray-600 dark:text-gray-300">
                این دوره شامل {{ currentCourse.lessons?.length || 0 }} درس است که به شما کمک می‌کند تا مهارت‌های لازم را کسب کنید.
              </p>

              <h4 class="mb-3 font-semibold text-gray-900 dark:text-white">
                آنچه خواهید آموخت:
              </h4>
              <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                <li class="flex items-start space-x-2 space-x-reverse">
                  <svg
                    class="mt-0.5 size-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>مفاهیم پایه و اساسی این حوزه</span>
                </li>
                <li class="flex items-start space-x-2 space-x-reverse">
                  <svg
                    class="mt-0.5 size-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>مهارت‌های عملی و کاربردی</span>
                </li>
                <li class="flex items-start space-x-2 space-x-reverse">
                  <svg
                    class="mt-0.5 size-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>تمرین‌ها و پروژه‌های عملی</span>
                </li>
                <li class="flex items-start space-x-2 space-x-reverse">
                  <svg
                    class="mt-0.5 size-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>ارزیابی و گواهی پایان دوره</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              اقدامات دوره
            </h3>
            <div class="space-y-3">
              <button 
                v-if="!isEnrolled"
                :disabled="isCoursesCreating"
                class="flex w-full items-center justify-center space-x-2 space-x-reverse rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                @click="enrollInCourseHandler"
              >
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span v-if="isCoursesCreating">در حال ثبت‌نام...</span>
                <span v-else>ثبت‌نام در دوره</span>
              </button>
              <button 
                v-else
                class="flex w-full items-center justify-center space-x-2 space-x-reverse rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700"
              >
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>ادامه یادگیری</span>
              </button>
              
              <button class="flex w-full items-center justify-center space-x-2 space-x-reverse rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>دانلود منابع</span>
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              پشتیبانی و انجمن
            </h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg
                    class="size-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    گروه تلگرام
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    247 عضو فعال
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <svg
                    class="size-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    تیم پشتیبانی
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    پاسخ در کمتر از 2 ساعت
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              مدرس دوره
            </h3>
            <div class="mb-4 flex items-center space-x-4 space-x-reverse">
              <div class="flex size-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <span class="text-lg font-medium text-gray-600 dark:text-gray-300">دم</span>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  دکتر مایکل چن
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  دکترای روانشناسی
                </div>
              </div>
            </div>
            <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
              دکتر چن با بیش از 15 سال تجربه در زمینه آموزش، متخصص برجسته‌ای در حوزه این حوزه است.
            </p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">تجربه تدریس:</span>
              <span class="font-medium text-gray-900 dark:text-white">10 سال</span>
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
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'جزئیات دوره',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

const { 
  currentCourse, 
  userEnrollments,
  isCoursesLoading, 
  isCoursesCreating,
  coursesError,
  getCourseById,
  enrollInCourse
} = useCourses()

// Check if user is enrolled in this course
const isEnrolled = computed(() => {
  if (!currentCourse.value || !userEnrollments.value) return false
  return userEnrollments.value.some(enrollment => enrollment.courseId === currentCourse.value?.id)
})

// Load course on page mount
onMounted(async () => {
  const courseId = route.params.id as string
  if (courseId) {
    await getCourseById(courseId)
  } else {
    // Redirect to courses list if no ID provided
    router.push('/hammasir/courses')
  }
})

// Handle course enrollment
const enrollInCourseHandler = async () => {
  if (!currentCourse.value) return
  
  try {
    const enrollmentData = {
      courseId: currentCourse.value.id
    }
    
    const result = await enrollInCourse(enrollmentData)
    if (result) {
      // Enrollment successful
      console.log('Successfully enrolled in course:', result)
    }
  } catch (error) {
    console.error('Error enrolling in course:', error)
  }
}
</script>