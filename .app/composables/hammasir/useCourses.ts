import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  CourseDto,
  LessonDto,
  EnrollmentDto,
  EnrollInCourseDto,
  LearningProgressDto,
  UpdateLessonProgressDto,
  CourseNoteDto,
  CreateLessonDto,
  UpdateLessonDto,
} from '~/types/api'

// Courses state
const coursesState = ref({
  courses: [] as CourseDto[],
  currentCourse: null as CourseDto | null,
  enrollments: [] as EnrollmentDto[],
  currentEnrollment: null as EnrollmentDto | null,
  learningProgress: [] as LearningProgressDto[],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null as string | null,
  totalCourses: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Courses errors
const coursesError = ref<string | null>(null)
const isCoursesLoading = ref(false)
const isCoursesCreating = ref(false)
const isCoursesUpdating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Course not found': 'دوره یافت نشد',
  'Invalid course data': 'داده‌های دوره نامعتبر است',
  'Course creation failed': 'ایجاد دوره ناموفق بود',
  'Course update failed': 'به‌روزرسانی دوره ناموفق بود',
  'Lesson not found': 'درس یافت نشد',
  'Invalid lesson data': 'داده‌های درس نامعتبر است',
  'Lesson creation failed': 'ایجاد درس ناموفق بود',
  'Lesson update failed': 'به‌روزرسانی درس ناموفق بود',
  'Enrollment not found': 'ثبت‌نام یافت نشد',
  'Enrollment failed': 'ثبت‌نام ناموفق بود',
  'Progress update failed': 'به‌روزرسانی پیشرفت ناموفق بود',
}

// Function to translate error messages
const translateError = (error: any): string => {
  // Convert error to string if it's not already
  const errorMessage = typeof error === 'string'
    ? error
    : error?.message
      ? error.message
      : JSON.stringify(error)

  // Check if we have a direct translation
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  // Handle HTTP status codes (only if errorMessage is a string)
  if (typeof errorMessage === 'string') {
    if (errorMessage.startsWith('HTTP 400:')) {
      return 'درخواست نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 401:')) {
      return 'احراز هویت ناموفق بود'
    }
    if (errorMessage.startsWith('HTTP 403:')) {
      return 'دسترسی غیرمجاز'
    }
    if (errorMessage.startsWith('HTTP 404:')) {
      return 'دوره یافت نشد'
    }
    if (errorMessage.startsWith('HTTP 409:')) {
      return 'تداخل در درخواست'
    }
    if (errorMessage.startsWith('HTTP 422:')) {
      return 'اطلاعات ارسالی نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 429:')) {
      return 'تعداد درخواست‌ها بیش از حد مجاز است'
    }
    if (errorMessage.startsWith('HTTP 500:')) {
      return 'خطای سرور'
    }
    if (errorMessage.startsWith('HTTP 502:')) {
      return 'خطای دروازه'
    }
    if (errorMessage.startsWith('HTTP 503:')) {
      return 'سرویس در دسترس نیست'
    }
    if (errorMessage.startsWith('HTTP 504:')) {
      return 'وقفه در پاسخ سرور'
    }
  }

  // Default fallback
  return errorMessage
}

// Computed properties
const userCourses = computed(() => coursesState.value.courses)
const currentCourse = computed(() => coursesState.value.currentCourse)
const userEnrollments = computed(() => coursesState.value.enrollments)
const currentEnrollment = computed(() => coursesState.value.currentEnrollment)
const learningProgress = computed(() => coursesState.value.learningProgress)

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
}

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${getApiBaseUrl()}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth header if available and not explicitly excluded
  const authStore = useAuth()
  if (authStore.authTokens.value.accessToken && !options.headers?.['X-Skip-Auth']) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authStore.authTokens.value.accessToken}`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(translateError(errorMessage))
    }

    return await response.json()
  }
  catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw new Error(translateError(error))
  }
}

// Get all courses
const getAllCourses = async (
  category?: string,
  level?: string,
): Promise<CourseDto[] | null> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    let url = '/api/v1/education/courses'
    const queryParams = []

    if (category) {
      queryParams.push(`category=${category}`)
    }

    if (level) {
      queryParams.push(`level=${level}`)
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    const result = await apiRequest<CourseDto[]>(url)
    coursesState.value.courses = result
    return result
  }
  catch (error: any) {
    coursesError.value = error.message || 'دریافت دوره‌ها ناموفق بود'
    return null
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Get course by ID
const getCourseById = async (courseId: string): Promise<CourseDto | null> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    const course = await apiRequest<CourseDto>(`/api/v1/education/courses/${courseId}`)
    coursesState.value.currentCourse = course
    return course
  }
  catch (error: any) {
    coursesError.value = error.message || 'دریافت دوره ناموفق بود'
    return null
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Create a new course
const createCourse = async (data: CourseDto): Promise<CourseDto | null> => {
  isCoursesCreating.value = true
  coursesError.value = null

  try {
    const newCourse = await apiRequest<CourseDto>('/api/v1/education/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state at the beginning
    coursesState.value.courses.unshift(newCourse)
    coursesState.value.totalCourses++

    return newCourse
  }
  catch (error: any) {
    coursesError.value = error.message || 'ایجاد دوره ناموفق بود'
    return null
  }
  finally {
    isCoursesCreating.value = false
  }
}

// Update course
const updateCourse = async (
  courseId: string,
  data: CourseDto,
): Promise<CourseDto | null> => {
  isCoursesUpdating.value = true
  coursesError.value = null

  try {
    const updatedCourse = await apiRequest<CourseDto>(`/api/v1/education/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update in local state
    const index = coursesState.value.courses.findIndex(c => c.id === courseId)
    if (index !== -1) {
      coursesState.value.courses[index] = updatedCourse
    }

    // Update current course if it's the one being updated
    if (coursesState.value.currentCourse?.id === courseId) {
      coursesState.value.currentCourse = updatedCourse
    }

    return updatedCourse
  }
  catch (error: any) {
    coursesError.value = error.message || 'به‌روزرسانی دوره ناموفق بود'
    return null
  }
  finally {
    isCoursesUpdating.value = false
  }
}

// Delete course
const deleteCourse = async (courseId: string): Promise<boolean> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    await apiRequest<void>(`/api/v1/education/courses/${courseId}`, {
      method: 'DELETE',
    })

    // Remove from local state
    const index = coursesState.value.courses.findIndex(c => c.id === courseId)
    if (index !== -1) {
      coursesState.value.courses.splice(index, 1)
      coursesState.value.totalCourses--
    }

    // Clear current course if it's the one being deleted
    if (coursesState.value.currentCourse?.id === courseId) {
      coursesState.value.currentCourse = null
    }

    return true
  }
  catch (error: any) {
    coursesError.value = error.message || 'حذف دوره ناموفق بود'
    return false
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Create lesson
const createLesson = async (
  courseId: string,
  data: CreateLessonDto,
): Promise<LessonDto | null> => {
  isCoursesCreating.value = true
  coursesError.value = null

  try {
    const newLesson = await apiRequest<LessonDto>(`/api/v1/education/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to current course if it exists
    if (coursesState.value.currentCourse) {
      coursesState.value.currentCourse.lessons.push(newLesson)
    }

    return newLesson
  }
  catch (error: any) {
    coursesError.value = error.message || 'ایجاد درس ناموفق بود'
    return null
  }
  finally {
    isCoursesCreating.value = false
  }
}

// Update lesson
const updateLesson = async (
  courseId: string,
  lessonId: string,
  data: UpdateLessonDto,
): Promise<LessonDto | null> => {
  isCoursesUpdating.value = true
  coursesError.value = null

  try {
    const updatedLesson = await apiRequest<LessonDto>(
      `/api/v1/education/courses/${courseId}/lessons/${lessonId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    )

    // Update in current course if it exists
    if (coursesState.value.currentCourse) {
      const lessonIndex = coursesState.value.currentCourse.lessons.findIndex(l => l.id === lessonId)
      if (lessonIndex !== -1) {
        coursesState.value.currentCourse.lessons[lessonIndex] = updatedLesson
      }
    }

    return updatedLesson
  }
  catch (error: any) {
    coursesError.value = error.message || 'به‌روزرسانی درس ناموفق بود'
    return null
  }
  finally {
    isCoursesUpdating.value = false
  }
}

// Delete lesson
const deleteLesson = async (
  courseId: string,
  lessonId: string,
): Promise<boolean> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    await apiRequest<void>(`/api/v1/education/courses/${courseId}/lessons/${lessonId}`, {
      method: 'DELETE',
    })

    // Remove from current course if it exists
    if (coursesState.value.currentCourse) {
      const lessonIndex = coursesState.value.currentCourse.lessons.findIndex(l => l.id === lessonId)
      if (lessonIndex !== -1) {
        coursesState.value.currentCourse.lessons.splice(lessonIndex, 1)
      }
    }

    return true
  }
  catch (error: any) {
    coursesError.value = error.message || 'حذف درس ناموفق بود'
    return false
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Enroll in course
const enrollInCourse = async (data: EnrollInCourseDto): Promise<EnrollmentDto | null> => {
  isCoursesCreating.value = true
  coursesError.value = null

  try {
    const enrollment = await apiRequest<EnrollmentDto>('/api/v1/education/enrollments', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state
    coursesState.value.enrollments.push(enrollment)

    return enrollment
  }
  catch (error: any) {
    coursesError.value = error.message || 'ثبت‌نام در دوره ناموفق بود'
    return null
  }
  finally {
    isCoursesCreating.value = false
  }
}

// Get user enrollments
const getMyEnrollments = async (): Promise<EnrollmentDto[] | null> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    const result = await apiRequest<EnrollmentDto[]>('/api/v1/education/me/enrollments')
    coursesState.value.enrollments = result
    return result
  }
  catch (error: any) {
    coursesError.value = error.message || 'دریافت ثبت‌نام‌ها ناموفق بود'
    return null
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Get learning progress
const getMyLearningProgress = async (): Promise<LearningProgressDto[] | null> => {
  isCoursesLoading.value = true
  coursesError.value = null

  try {
    const result = await apiRequest<LearningProgressDto[]>('/api/v1/education/me/progress')
    coursesState.value.learningProgress = result
    return result
  }
  catch (error: any) {
    coursesError.value = error.message || 'دریافت پیشرفت آموزشی ناموفق بود'
    return null
  }
  finally {
    isCoursesLoading.value = false
  }
}

// Update lesson progress
const updateMyLessonProgress = async (
  lessonId: string,
  data: UpdateLessonProgressDto,
): Promise<LearningProgressDto | null> => {
  isCoursesUpdating.value = true
  coursesError.value = null

  try {
    const result = await apiRequest<LearningProgressDto>(
      `/api/v1/education/me/progress/lessons/${lessonId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    )

    // Update in local state
    const index = coursesState.value.learningProgress.findIndex(p => p.courseId === result.courseId)
    if (index !== -1) {
      coursesState.value.learningProgress[index] = result
    } else {
      coursesState.value.learningProgress.push(result)
    }

    return result
  }
  catch (error: any) {
    coursesError.value = error.message || 'به‌روزرسانی پیشرفت درس ناموفق بود'
    return null
  }
  finally {
    isCoursesUpdating.value = false
  }
}

// Create course note
const createCourseNote = async (data: CourseNoteDto): Promise<CourseNoteDto | null> => {
  isCoursesCreating.value = true
  coursesError.value = null

  try {
    const result = await apiRequest<CourseNoteDto>('/api/v1/education/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return result
  }
  catch (error: any) {
    coursesError.value = error.message || 'ایجاد یادداشت ناموفق بود'
    return null
  }
  finally {
    isCoursesCreating.value = false
  }
}

// Export everything
export const useCourses = () => {
  return {
    // State
    coursesState: readonly(coursesState),
    coursesError: readonly(coursesError),
    isCoursesLoading: readonly(isCoursesLoading),
    isCoursesCreating: readonly(isCoursesCreating),
    isCoursesUpdating: readonly(isCoursesUpdating),

    // Computed
    userCourses,
    currentCourse,
    userEnrollments,
    currentEnrollment,
    learningProgress,

    // Methods
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    enrollInCourse,
    getMyEnrollments,
    getMyLearningProgress,
    updateMyLessonProgress,
    createCourseNote,
  }
}