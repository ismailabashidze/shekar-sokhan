export interface MessageFeedbackData {
  message_id: string
  session_id: string
  user_id: string
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
}

export interface FeedbackCategory {
  id: string
  name: string
  description?: string
  subcategories?: FeedbackSubcategory[]
}

export interface FeedbackSubcategory {
  id: string
  name: string
  description?: string
}

export interface FeedbackAnalytics {
  averageRating: number
  totalFeedbacks: number
  categoryBreakdown: Record<string, number>
  recentFeedbacks: MessageFeedbackData[]
  improvementSuggestions: string[]
}

export const FEEDBACK_CATEGORIES = {
  problems: {
    id: 'problems',
    name: 'مشکلات',
    description: 'مشکلات موجود در پاسخ',
    subcategories: [
      { id: 'irrelevant', name: 'غیر مرتبط', description: 'پاسخ مرتبط با سوال نیست' },
      { id: 'inaccurate', name: 'نادرست', description: 'اطلاعات ارائه شده اشتباه است' },
      { id: 'incomplete', name: 'ناکامل', description: 'پاسخ کامل نیست' },
      { id: 'inappropriate', name: 'نامناسب', description: 'محتوای نامناسب یا آزاردهنده' },
      { id: 'confusing', name: 'گیج‌کننده', description: 'پاسخ قابل فهم نیست' },
      { id: 'repetitive', name: 'تکراری', description: 'پاسخ تکراری و غیرضروری' }
    ]
  },
  quality: {
    id: 'quality',
    name: 'کیفیت',
    description: 'ارزیابی کیفیت پاسخ',
    subcategories: [
      { id: 'helpful', name: 'مفید', description: 'پاسخ کمک‌کننده بود' },
      { id: 'empathetic', name: 'همدلانه', description: 'پاسخ با همدلی ارائه شد' },
      { id: 'professional', name: 'حرفه‌ای', description: 'پاسخ حرفه‌ای و علمی' },
      { id: 'personalized', name: 'شخصی‌سازی شده', description: 'پاسخ متناسب با شرایط من بود' },
      { id: 'actionable', name: 'عملی', description: 'راهکارهای عملی ارائه شد' },
      { id: 'supportive', name: 'حمایتگر', description: 'احساس حمایت کردم' }
    ]
  },
  improvements: {
    id: 'improvements',
    name: 'بهبودها',
    description: 'پیشنهادات برای بهبود',
    subcategories: [
      { id: 'more_detail', name: 'جزئیات بیشتر', description: 'نیاز به توضیحات بیشتر' },
      { id: 'simpler_language', name: 'زبان ساده‌تر', description: 'استفاده از زبان ساده‌تر' },
      { id: 'more_examples', name: 'مثال‌های بیشتر', description: 'ارائه مثال‌های عملی بیشتر' },
      { id: 'step_by_step', name: 'مرحله به مرحله', description: 'راهنمای گام به گام' },
      { id: 'resources', name: 'منابع اضافی', description: 'معرفی منابع و مطالب مفید' },
      { id: 'follow_up', name: 'پیگیری', description: 'سوالات پیگیری مناسب' }
    ]
  }
} as const

export const useMessageFeedback = () => {
  const nuxtApp = useNuxtApp()

  const submitFeedback = async (feedbackData: MessageFeedbackData) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .create(feedbackData)
      
      return record
    } catch (error) {
      console.error('Error submitting message feedback:', error)
      throw error
    }
  }

  const getFeedbackForMessage = async (messageId: string) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .getFirstListItem(`message_id="${messageId}"`)
      
      return record
    } catch (error) {
      if (error.status === 404) {
        return null
      }
      console.error('Error getting message feedback:', error)
      throw error
    }
  }

  const updateFeedback = async (id: string, feedbackData: Partial<MessageFeedbackData>) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .update(id, feedbackData)
      
      return record
    } catch (error) {
      console.error('Error updating message feedback:', error)
      throw error
    }
  }

  const deleteFeedback = async (id: string) => {
    try {
      await nuxtApp.$pb
        .collection('message_feedback')
        .delete(id)
      
      return true
    } catch (error) {
      console.error('Error deleting message feedback:', error)
      throw error
    }
  }

  const getFeedbacksBySession = async (sessionId: string) => {
    try {
      const records = await nuxtApp.$pb
        .collection('message_feedback')
        .getList(1, 50, {
          filter: `session_id="${sessionId}"`,
          sort: '-created'
        })
      
      return records.items
    } catch (error) {
      console.error('Error getting session feedbacks:', error)
      return []
    }
  }

  const getFeedbacksByTherapist = async (therapistId: string, limit = 100) => {
    try {
      const records = await nuxtApp.$pb
        .collection('message_feedback')
        .getList(1, limit, {
          filter: `therapist_id="${therapistId}"`,
          sort: '-created'
        })
      
      return records.items
    } catch (error) {
      console.error('Error getting therapist feedbacks:', error)
      return []
    }
  }

  const getFeedbackAnalytics = async (therapistId: string): Promise<FeedbackAnalytics> => {
    try {
      const feedbacks = await getFeedbacksByTherapist(therapistId, 200)
      
      const averageRating = feedbacks.length > 0 
        ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length 
        : 0

      const categoryBreakdown: Record<string, number> = {}
      const improvementSuggestions: string[] = []

      feedbacks.forEach(feedback => {
        // Count problems
        if (feedback.problems_categories) {
          Object.keys(feedback.problems_categories).forEach(key => {
            categoryBreakdown[`problem_${key}`] = (categoryBreakdown[`problem_${key}`] || 0) + 1
          })
        }

        // Count quality aspects
        if (feedback.quality_categories) {
          Object.keys(feedback.quality_categories).forEach(key => {
            categoryBreakdown[`quality_${key}`] = (categoryBreakdown[`quality_${key}`] || 0) + 1
          })
        }

        // Collect improvement suggestions
        if (feedback.improvements_other?.trim()) {
          improvementSuggestions.push(feedback.improvements_other.trim())
        }
      })

      return {
        averageRating: Math.round(averageRating * 100) / 100,
        totalFeedbacks: feedbacks.length,
        categoryBreakdown,
        recentFeedbacks: feedbacks.slice(0, 10),
        improvementSuggestions: improvementSuggestions.slice(0, 20)
      }
    } catch (error) {
      console.error('Error getting feedback analytics:', error)
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        categoryBreakdown: {},
        recentFeedbacks: [],
        improvementSuggestions: []
      }
    }
  }

  const validateFeedback = (feedback: Partial<MessageFeedbackData>): string[] => {
    const errors: string[] = []
    
    if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
      errors.push('امتیاز باید بین 1 تا 5 باشد')
    }
    
    if (!feedback.general_text?.trim()) {
      errors.push('نظر کلی الزامی است')
    }
    
    if (feedback.general_text && feedback.general_text.length < 10) {
      errors.push('نظر کلی باید حداقل 10 کاراکتر باشد')
    }
    
    return errors
  }

  return {
    submitFeedback,
    getFeedbackForMessage,
    updateFeedback,
    deleteFeedback,
    getFeedbacksBySession,
    getFeedbacksByTherapist,
    getFeedbackAnalytics,
    validateFeedback,
    FEEDBACK_CATEGORIES,
  }
}