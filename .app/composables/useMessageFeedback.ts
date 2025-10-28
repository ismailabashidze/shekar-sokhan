export interface MessageFeedbackData {
  message_id: string;
  session_id: string;
  user_id: string;
  therapist_id: string;
  rating?: number;
  message_content?: string;
  general_text?: string;
  general_other?: string;
  problems_categories?: Record<string, any>;
  problems_other?: string;
  quality_categories?: Record<string, any>;
  quality_other?: string;
  improvements_categories?: Record<string, any>;
  improvements_other?: string;
}

export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: FeedbackSubcategory[];
}

export interface FeedbackSubcategory {
  id: string;
  name: string;
  description?: string;
}

export interface FeedbackAnalytics {
  averageRating: number;
  totalFeedbacks: number;
  categoryBreakdown: Record<string, number>;
  recentFeedbacks: MessageFeedbackData[];
  improvementSuggestions: string[];
}

export const FEEDBACK_CATEGORIES = {
  problems: {
    id: 'problems',
    name: 'مشکلات',
    description: 'مشکلات موجود در پاسخ',
    icon: 'ph:warning-duotone',
    color: 'danger',
    subcategories: [
      {
        id: 'irrelevant',
        name: 'غیر مرتبط',
        description: 'پاسخ مرتبط با سوال نیست',
        icon: 'ph:target-duotone',
        severity: 'high',
        examples: ['پاسخ به سوال دیگری داده', 'موضوع اصلی نادیده گرفته شده'],
      },
      {
        id: 'inaccurate',
        name: 'نادرست',
        description: 'اطلاعات ارائه شده اشتباه است',
        icon: 'ph:x-circle-duotone',
        severity: 'high',
        examples: ['اطلاعات پزشکی نادرست', 'توصیه‌های خطرناک'],
      },
      {
        id: 'incomplete',
        name: 'ناکامل',
        description: 'پاسخ کامل نیست',
        icon: 'ph:circle-half-duotone',
        severity: 'medium',
        examples: ['سوال کاملاً پاسخ داده نشده', 'جنبه‌های مهم نادیده گرفته شده'],
      },
      {
        id: 'inappropriate',
        name: 'نامناسب',
        description: 'محتوای نامناسب یا آزاردهنده',
        icon: 'ph:prohibit-duotone',
        severity: 'critical',
        examples: ['لحن نامناسب', 'محتوای حساس بدون هشدار'],
      },
      {
        id: 'confusing',
        name: 'گیج‌کننده',
        description: 'پاسخ قابل فهم نیست',
        icon: 'ph:question-duotone',
        severity: 'medium',
        examples: ['جملات پیچیده و نامفهوم', 'ساختار نامنظم'],
      },
      {
        id: 'repetitive',
        name: 'تکراری',
        description: 'پاسخ تکراری و غیرضروری',
        icon: 'ph:copy-duotone',
        severity: 'low',
        examples: ['تکرار پاسخ‌های قبلی', 'اطلاعات اضافی'],
      },
      {
        id: 'insensitive',
        name: 'بی‌توجه',
        description: 'عدم توجه به حالت احساسی کاربر',
        icon: 'ph:heart-break-duotone',
        severity: 'high',
        examples: ['نادیده گیری احساسات', 'پاسخ خشک و بی‌روح'],
      },
      {
        id: 'generic',
        name: 'کلیشه‌ای',
        description: 'پاسخ عمومی و غیرشخصی',
        icon: 'ph:robot-duotone',
        severity: 'medium',
        examples: ['پاسخ‌های قالبی', 'عدم شخصی‌سازی'],
      },
      {
        id: 'cultural_mismatch',
        name: 'ناهماهنگی فرهنگی',
        description: 'عدم تطبیق با فرهنگ و بافت اجتماعی',
        icon: 'ph:globe-duotone',
        severity: 'high',
        examples: ['نادیده گیری فرهنگ ایرانی', 'پیشنهادات غیرقابل اجرا در جامعه'],
      },
      {
        id: 'islamic_contradiction',
        name: 'مغایرت با ارزش‌های اسلامی',
        description: 'تضاد با اصول و ارزش‌های دینی',
        icon: 'ph:mosque-duotone',
        severity: 'critical',
        examples: ['توصیه‌های مخالف شریعت', 'نادیده گیری آموزه‌های اسلامی'],
      },
    ],
  },
  quality: {
    id: 'quality',
    name: 'کیفیت',
    description: 'ارزیابی کیفیت پاسخ',
    icon: 'ph:heart-duotone',
    color: 'success',
    subcategories: [
      {
        id: 'helpful',
        name: 'مفید',
        description: 'پاسخ کمک‌کننده بود',
        icon: 'ph:hand-heart-duotone',
        impact: 'high',
        examples: ['مشکل حل شد', 'راهکار عملی داشت'],
      },
      {
        id: 'empathetic',
        name: 'همدلانه',
        description: 'پاسخ با همدلی ارائه شد',
        icon: 'ph:heart-duotone',
        impact: 'high',
        examples: ['احساس درک شدن', 'لحن مهربانانه'],
      },
      {
        id: 'professional',
        name: 'حرفه‌ای',
        description: 'پاسخ حرفه‌ای و علمی',
        icon: 'ph:graduation-cap-duotone',
        impact: 'high',
        examples: ['استناد به منابع معتبر', 'تخصص واضح'],
      },
      {
        id: 'personalized',
        name: 'شخصی‌سازی شده',
        description: 'پاسخ متناسب با شرایط من بود',
        icon: 'ph:user-focus-duotone',
        impact: 'high',
        examples: ['در نظر گیری شرایط خاص', 'پاسخ منحصر به فرد'],
      },
      {
        id: 'actionable',
        name: 'عملی',
        description: 'راهکارهای عملی ارائه شد',
        icon: 'ph:gear-duotone',
        impact: 'high',
        examples: ['مراحل واضح', 'قابل اجرا بودن'],
      },
      {
        id: 'supportive',
        name: 'حمایتگر',
        description: 'احساس حمایت کردم',
        icon: 'ph:shield-check-duotone',
        impact: 'high',
        examples: ['ایجاد اعتماد', 'حس امنیت'],
      },
      {
        id: 'encouraging',
        name: 'تشویق‌کننده',
        description: 'انگیزه و امید بخش',
        icon: 'ph:trophy-duotone',
        impact: 'medium',
        examples: ['ایجاد انگیزه', 'تأکید بر نقاط قوت'],
      },
      {
        id: 'timely',
        name: 'به‌موقع',
        description: 'پاسخ سریع و مناسب',
        icon: 'ph:clock-duotone',
        impact: 'medium',
        examples: ['پاسخ فوری', 'در زمان نیاز'],
      },
    ],
  },
  improvements: {
    id: 'improvements',
    name: 'بهبودها',
    description: 'پیشنهادات برای بهبود',
    icon: 'ph:lightbulb-duotone',
    color: 'warning',
    subcategories: [
      {
        id: 'more_detail',
        name: 'جزئیات بیشتر',
        description: 'نیاز به توضیحات بیشتر',
        icon: 'ph:magnifying-glass-plus-duotone',
        priority: 'high',
        examples: ['توضیح عمیق‌تر مفاهیم', 'پوشش جنبه‌های بیشتر'],
      },
      {
        id: 'simpler_language',
        name: 'زبان ساده‌تر',
        description: 'استفاده از زبان ساده‌تر',
        icon: 'ph:text-aa-duotone',
        priority: 'medium',
        examples: ['کلمات ساده‌تر', 'جملات کوتاه‌تر'],
      },
      {
        id: 'more_examples',
        name: 'مثال‌های بیشتر',
        description: 'ارائه مثال‌های عملی بیشتر',
        icon: 'ph:lightbulb-filament-duotone',
        priority: 'high',
        examples: ['مثال‌های عملی', 'داستان‌های موردی'],
      },
      {
        id: 'step_by_step',
        name: 'مرحله به مرحله',
        description: 'راهنمای گام به گام',
        icon: 'ph:steps-duotone',
        priority: 'high',
        examples: ['لیست مرحله‌ای', 'راهنمای عملی'],
      },
      {
        id: 'resources',
        name: 'منابع اضافی',
        description: 'معرفی منابع و مطالب مفید',
        icon: 'ph:books-duotone',
        priority: 'medium',
        examples: ['کتاب‌های مفید', 'لینک‌های آموزشی'],
      },
      {
        id: 'follow_up',
        name: 'پیگیری',
        description: 'سوالات پیگیری مناسب',
        icon: 'ph:chat-circle-dots-duotone',
        priority: 'medium',
        examples: ['سوالات تکمیلی', 'پیگیری وضعیت'],
      },
      {
        id: 'visual_aids',
        name: 'کمک‌های تصویری',
        description: 'استفاده از نمودار و تصویر',
        icon: 'ph:image-duotone',
        priority: 'low',
        examples: ['نمودار توضیحی', 'عکس‌های آموزشی'],
      },
      {
        id: 'interactive',
        name: 'تعاملی‌تر',
        description: 'بیشتر درگیر کردن کاربر',
        icon: 'ph:hand-tap-duotone',
        priority: 'medium',
        examples: ['سوال از کاربر', 'تمرین‌های عملی'],
      },
    ],
  },
} as const;

export const useMessageFeedback = () => {
  const nuxtApp = useNuxtApp();

  const submitFeedback = async (feedbackData: MessageFeedbackData) => {
    try {
      return await nuxtApp.$pb
        .collection('message_feedback')
        .create(feedbackData);
    }
    catch (error) {
      console.error('Error submitting message feedback:', error);
      throw error;
    }
  };

  const getFeedbackForMessage = async (messageId: string) => {
    try {
      return await nuxtApp.$pb
        .collection('message_feedback')
        .getFirstListItem(`message_id="${messageId}"`);
    }
    catch (error) {
      if (error.status === 404) {
        return null;
      }
      console.error('Error getting message feedback:', error);
      throw error;
    }
  };

  const updateFeedback = async (id: string, feedbackData: Partial<MessageFeedbackData>) => {
    try {
      return await nuxtApp.$pb
        .collection('message_feedback')
        .update(id, feedbackData);
    }
    catch (error) {
      console.error('Error updating message feedback:', error);
      throw error;
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await nuxtApp.$pb
        .collection('message_feedback')
        .delete(id);

      return true;
    }
    catch (error) {
      console.error('Error deleting message feedback:', error);
      throw error;
    }
  };

  const getFeedbacksBySession = async (sessionId: string) => {
    try {
      const records = await nuxtApp.$pb
        .collection('message_feedback')
        .getList(1, 50, {
          filter: `session_id="${sessionId}"`,
          sort: '-created',
        });

      return records.items;
    }
    catch (error) {
      console.error('Error getting session feedbacks:', error);
      return [];
    }
  };

  const getFeedbacksByTherapist = async (therapistId: string, limit = 100) => {
    try {
      const records = await nuxtApp.$pb
        .collection('message_feedback')
        .getList(1, limit, {
          filter: `therapist_id="${therapistId}"`,
          sort: '-created',
        });

      return records.items;
    }
    catch (error) {
      console.error('Error getting therapist feedbacks:', error);
      return [];
    }
  };

  const getFeedbackAnalytics = async (therapistId: string): Promise<FeedbackAnalytics> => {
    try {
      const feedbacks = await getFeedbacksByTherapist(therapistId, 200);

      const averageRating = feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length
        : 0;

      const categoryBreakdown: Record<string, number> = {};
      const improvementSuggestions: string[] = [];

      feedbacks.forEach((feedback) => {
        // Count problems
        if (feedback.problems_categories) {
          Object.keys(feedback.problems_categories).forEach((key) => {
            categoryBreakdown[`problem_${key}`] = (categoryBreakdown[`problem_${key}`] || 0) + 1;
          });
        }

        // Count quality aspects
        if (feedback.quality_categories) {
          Object.keys(feedback.quality_categories).forEach((key) => {
            categoryBreakdown[`quality_${key}`] = (categoryBreakdown[`quality_${key}`] || 0) + 1;
          });
        }

        // Collect improvement suggestions
        if (feedback.improvements_other?.trim()) {
          improvementSuggestions.push(feedback.improvements_other.trim());
        }
      });

      return {
        averageRating: Math.round(averageRating * 100) / 100,
        totalFeedbacks: feedbacks.length,
        categoryBreakdown,
        recentFeedbacks: feedbacks.slice(0, 10),
        improvementSuggestions: improvementSuggestions.slice(0, 20),
      };
    }
    catch (error) {
      console.error('Error getting feedback analytics:', error);
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        categoryBreakdown: {},
        recentFeedbacks: [],
        improvementSuggestions: [],
      };
    }
  };

  const validateFeedback = (feedback: Partial<MessageFeedbackData>): string[] => {
    const errors: string[] = [];

    if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
      errors.push('امتیاز باید بین 1 تا 5 باشد');
    }

    if (!feedback.general_text?.trim()) {
      errors.push('نظر کلی الزامی است');
    }

    if (feedback.general_text && feedback.general_text.length < 10) {
      errors.push('نظر کلی باید حداقل 10 کاراکتر باشد');
    }

    return errors;
  };

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
  };
};
