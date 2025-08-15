export interface Course {
  id?: string
  title?: string
  thumbnail?: string
  lessons?: Lesson[]
}

export interface Lesson {
  id?: string
  title?: string
}

export interface Enrollment {
  id?: string
  courseId?: string
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED'
  metadata?: EnrollmentMetadata
}

export interface EnrollmentMetadata {
  couponCode?: string
}

export interface LearningProgress {
  courseId?: string
  overallProgress?: number
  assessmentsCompleted?: object[]
  achievements?: object[]
}

export interface CourseNote {
  userId?: string
  courseId?: string
  content?: string
}

export interface LearningReport {
  id?: string
  reportType?: 'LEARNING_PROGRESS' | 'KNOWLEDGE_GAPS' | 'PERFORMANCE_EVALUATION'
  content?: object
  analysis?: object
}

export interface CourseListParams {
  category?: string
  level?: string
}

export interface EnrollmentListParams {
  userId?: string
  courseId?: string
}

export interface ProgressParams {
  courseId?: string
}

export interface NotesParams {
  userId: string
  courseId?: string
}

export interface LessonProgressUpdate {
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface ReportsParams {
  userId?: string
}

export function useEducation() {
  const { $fetch } = useNuxtApp()

  const getCourses = async (params?: CourseListParams): Promise<Course[]> => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.level) query.set('level', params.level)
    
    const url = `/api/v1/education/courses${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  const createCourse = async (course: Course): Promise<Course> => {
    return await $fetch('/api/v1/education/courses', {
      method: 'POST',
      body: course
    })
  }

  const getCourseById = async (courseId: string): Promise<Course> => {
    return await $fetch(`/api/v1/education/courses/${courseId}`)
  }

  const updateCourse = async (courseId: string, course: Course): Promise<Course> => {
    return await $fetch(`/api/v1/education/courses/${courseId}`, {
      method: 'PUT',
      body: course
    })
  }

  const deleteCourse = async (courseId: string): Promise<void> => {
    return await $fetch(`/api/v1/education/courses/${courseId}`, {
      method: 'DELETE'
    })
  }

  const enrollInCourse = async (courseId: string): Promise<void> => {
    return await $fetch('/api/v1/education/enrollments', {
      method: 'POST',
      body: { courseId }
    })
  }

  const getAllEnrollments = async (params?: EnrollmentListParams): Promise<Enrollment[]> => {
    const query = new URLSearchParams()
    if (params?.userId) query.set('userId', params.userId)
    if (params?.courseId) query.set('courseId', params.courseId)
    
    const url = `/api/v1/education/enrollments${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  const getMyEnrollments = async (): Promise<Enrollment[]> => {
    return await $fetch('/api/v1/education/me/enrollments')
  }

  const getMyLearningProgress = async (params?: ProgressParams): Promise<LearningProgress> => {
    const query = new URLSearchParams()
    if (params?.courseId) query.set('courseId', params.courseId)
    
    const url = `/api/v1/education/me/progress${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  const updateMyLessonProgress = async (lessonId: string, update: LessonProgressUpdate): Promise<void> => {
    return await $fetch(`/api/v1/education/me/progress/lessons/${lessonId}`, {
      method: 'PUT',
      body: update
    })
  }

  const createNoteForParticipant = async (note: CourseNote): Promise<CourseNote> => {
    return await $fetch('/api/v1/education/notes', {
      method: 'POST',
      body: note
    })
  }

  const getNotes = async (params: NotesParams): Promise<CourseNote[]> => {
    const query = new URLSearchParams()
    query.set('userId', params.userId)
    if (params.courseId) query.set('courseId', params.courseId)
    
    const url = `/api/v1/education/notes?${query.toString()}`
    return await $fetch(url)
  }

  const getLearningReports = async (params?: ReportsParams): Promise<LearningReport[]> => {
    const query = new URLSearchParams()
    if (params?.userId) query.set('userId', params.userId)
    
    const url = `/api/v1/education/reports${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  return {
    getCourses,
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getAllEnrollments,
    getMyEnrollments,
    getMyLearningProgress,
    updateMyLessonProgress,
    createNoteForParticipant,
    getNotes,
    getLearningReports,
  }
}