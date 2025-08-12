import { ref, computed } from 'vue'

// Define feedback interface based on actual PocketBase structure
interface MessageFeedback {
  id: string
  message_id: string
  user_id: string
  session_id: string
  therapist_id: string
  rating?: number
  message_content?: string
  general_text?: string
  general_other?: string
  problems_categories?: Record<string, any>
  problems_other?: string
  quality_categories?: Record<string, any>
  quality_other?: string
  improvements_categories?: Record<string, any>
  improvements_other?: string
  created: string
  updated?: string
  expand?: {
    user_id?: {
      id: string
      name: string
      email: string
      avatar: string
    }
    therapist_id?: {
      id: string
      name: string
      email: string
      avatar: string
      specialty?: string
    }
    session_id?: {
      id: string
      session_type: string
      status: string
      created: string
    }
    message_id?: {
      id: string
      text: string
      sender: string
      created: string
    }
  }
}

// Mock data function
const getMockFeedbacks = (): MessageFeedback[] => [
  {
    id: '1',
    message_id: 'msg_001',
    user_id: 'user_001',
    session_id: 'session_001',
    therapist_id: 'therapist_001',
    rating: 5,
    message_content: 'پیام درمانگر بسیار مفید و دلگرم‌کننده بود',
    general_text: 'بازخورد کلی بسیار مثبت',
    problems_categories: {},
    quality_categories: { helpful_advice: true, empathetic_response: true },
    improvements_categories: {},
    created: new Date(Date.now() - 86400000).toISOString(),
    expand: {
      user_id: {
        id: 'user_001',
        name: 'سارا احمدی',
        email: 'sara.ahmadi@example.com',
        avatar: '/img/avatars/user1.jpg',
      },
      therapist_id: {
        id: 'therapist_001',
        name: 'دکتر رضا محمدی',
        email: 'reza.mohammadi@example.com',
        avatar: '/img/avatars/therapist1.jpg',
        specialty: 'روانشناس بالینی',
      },
      session_id: {
        id: 'session_001',
        session_type: 'therapy',
        status: 'completed',
        created: new Date(Date.now() - 90000000).toISOString(),
      },
      message_id: {
        id: 'msg_001',
        text: 'پیام درمانگر بسیار مفید و دلگرم‌کننده بود',
        sender: 'therapist',
        created: new Date(Date.now() - 87400000).toISOString(),
      },
    },
  },
  {
    id: '2',
    message_id: 'msg_002',
    user_id: 'user_002',
    session_id: 'session_002',
    therapist_id: 'therapist_002',
    rating: 3,
    message_content: 'پیام قابل قبول بود اما جای بهبود دارد',
    general_text: 'نیاز به بهبود دارد',
    problems_categories: { irrelevant: true, generic: true, confusing: true, islamic_contradiction: true },
    quality_categories: {},
    improvements_categories: { visual_aids: true, more_examples: true, more_detail: true, practical: true },
    problems_other: 'پاسخ کمی کلی بود',
    created: new Date(Date.now() - 172800000).toISOString(),
    expand: {
      user_id: {
        id: 'user_002',
        name: 'علی رضایی',
        email: 'ali.rezaei@example.com',
        avatar: '/img/avatars/user2.jpg',
      },
      therapist_id: {
        id: 'therapist_002',
        name: 'دکتر فاطمه کریمی',
        email: 'fateme.karimi@example.com',
        avatar: '/img/avatars/therapist2.jpg',
        specialty: 'مشاور خانواده',
      },
      session_id: {
        id: 'session_002',
        session_type: 'counseling',
        status: 'completed',
        created: new Date(Date.now() - 175000000).toISOString(),
      },
    },
  },
  {
    id: '3',
    message_id: 'msg_003',
    user_id: 'user_003',
    session_id: 'session_003',
    therapist_id: 'therapist_001',
    rating: 4,
    message_content: 'درمانگر خوب گوش داد و راهنمایی مناسب ارائه داد',
    general_text: 'تجربه مثبت',
    problems_categories: {},
    quality_categories: { good_listening: true, professional_approach: true },
    improvements_categories: { response_speed: true },
    created: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    message_id: 'msg_004',
    user_id: 'user_004',
    session_id: 'session_004',
    therapist_id: 'therapist_003',
    rating: 2,
    message_content: 'پاسخ درمانگر مناسب نبود',
    general_text: 'ناراضی از پاسخ',
    problems_categories: { irrelevant_response: true, lack_of_empathy: true },
    quality_categories: {},
    improvements_categories: { content_depth: true, empathy: true },
    problems_other: 'پاسخ به سوال اصلی داده نشد',
    created: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '5',
    message_id: 'msg_005',
    user_id: 'user_005',
    session_id: 'session_005',
    therapist_id: 'therapist_002',
    rating: 5,
    message_content: 'عالی بود، دقیقاً همان چیزی که نیاز داشتم',
    general_text: 'کاملاً راضی',
    problems_categories: {},
    quality_categories: { helpful_advice: true, clear_communication: true, supportive_tone: true },
    improvements_categories: {},
    created: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '6',
    message_id: 'msg_006',
    user_id: 'user_006',
    session_id: 'session_006',
    therapist_id: 'therapist_001',
    rating: 1,
    message_content: 'پیام کاملاً نامناسب و غیرحرفه‌ای بود',
    general_text: 'بسیار ناراضی',
    problems_categories: { inappropriate_content: true, unprofessional_behavior: true },
    quality_categories: {},
    improvements_categories: { professional_approach: true, content_quality: true },
    problems_other: 'لحن درمانگر قضاوت‌گرانه بود',
    created: new Date(Date.now() - 518400000).toISOString(),
  },
]

export const useAdminFeedbacks = () => {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()

  // State
  const allFeedbacksData = ref<MessageFeedback[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const perPage = ref(5)
  const searchQuery = ref('')
  const ratingFilter = ref('all')
  const totalPages = ref(0)
  const totalItems = ref(0)

  // Helper function to build filter string
  const buildFilterString = () => {
    const conditions: string[] = []

    if (ratingFilter.value !== 'all') {
      conditions.push(`rating = ${ratingFilter.value}`)
    }

    // Note: feedback_type filter removed as it's not part of the actual schema

    if (searchQuery.value.trim()) {
      const searchTerm = searchQuery.value.replace(/"/g, '\\"')
      conditions.push(`(message_content ~ "${searchTerm}" || general_text ~ "${searchTerm}" || problems_other ~ "${searchTerm}" || quality_other ~ "${searchTerm}" || improvements_other ~ "${searchTerm}" || user_id.name ~ "${searchTerm}" || user_id.email ~ "${searchTerm}" || therapist_id.name ~ "${searchTerm}")`)
    }

    return conditions.join(' && ')
  }

  // Data fetching
  const fetchFeedbacks = async () => {
    loading.value = true
    error.value = null

    try {
      const filterString = buildFilterString()

      const result = await nuxtApp.$pb.collection('message_feedback').getList(currentPage.value, perPage.value, {
        ...(filterString && { filter: filterString }),
        sort: '-created',
        expand: 'user_id,therapist_id,session_id,message_id',
      })

      allFeedbacksData.value = result.items as MessageFeedback[]
      totalPages.value = result.totalPages
      totalItems.value = result.totalItems

      return result
    }
    catch (e: any) {
      error.value = e.message || 'خطا در دریافت بازخوردها'
      console.error('Error fetching feedbacks:', e)

      toaster.show({
        title: 'خطا',
        message: error.value,
        color: 'danger',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })

      // Fallback to mock data in case of error
      allFeedbacksData.value = getMockFeedbacks()
      totalItems.value = allFeedbacksData.value.length
      totalPages.value = Math.ceil(totalItems.value / perPage.value)
    }
    finally {
      loading.value = false
    }
  }

  // Computed properties - now using server-side pagination
  const paginatedFeedbacks = computed(() => allFeedbacksData.value)

  // Methods
  const setPage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      await fetchFeedbacks()
    }
  }

  const setPerPage = async (count: number) => {
    perPage.value = count
    currentPage.value = 1 // Reset to first page
    await fetchFeedbacks()
  }

  const setSearch = async (query: string) => {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page
    await fetchFeedbacks()
  }

  const setRatingFilter = async (rating: string) => {
    ratingFilter.value = rating
    currentPage.value = 1 // Reset to first page
    await fetchFeedbacks()
  }

  const resetFilters = async () => {
    searchQuery.value = ''
    ratingFilter.value = 'all'
    currentPage.value = 1
    await fetchFeedbacks()
  }

  const refreshFeedbacks = async () => {
    // Refetch data with current filters
    await fetchFeedbacks()
  }

  return {
    // State
    feedbacks: paginatedFeedbacks,
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    perPage: readonly(perPage),
    searchQuery: readonly(searchQuery),
    ratingFilter: readonly(ratingFilter),
    totalItems: readonly(totalItems),
    totalPages: readonly(totalPages),

    // Methods
    fetchFeedbacks,
    setPage,
    setPerPage,
    setSearch,
    setRatingFilter,
    resetFilters,
    refreshFeedbacks,
  }
}
