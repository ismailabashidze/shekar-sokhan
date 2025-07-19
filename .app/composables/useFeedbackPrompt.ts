export interface FeedbackData {
  problems_categories: string[]
  problems_other: string
  quality_categories: string[]
  quality_other: string
  improvements_categories: string[]
  improvements_other: string
  general_text: string
  general_other: string
}

export function useFeedbackPrompt() {
  const nuxtApp = useNuxtApp()

  // Get user's global feedback profile from all their previous feedback
  const getUserFeedbackProfile = async (userId: string): Promise<string> => {
    try {
      // Get all feedback for this user
      const feedbacks = await nuxtApp.$pb.collection('message_feedback').getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-created'
      })
      
      if (feedbacks.length === 0) return ''
      
      // Aggregate all feedback
      const problemsSet = new Set<string>()
      const qualitySet = new Set<string>()
      const improvementsSet = new Set<string>()
      const generalComments: string[] = []
      
      feedbacks.forEach(feedback => {
        // Collect problems
        if (feedback.problems_categories) {
          feedback.problems_categories.forEach((cat: string) => problemsSet.add(cat))
        }
        if (feedback.problems_other) {
          generalComments.push(`مشکل: ${feedback.problems_other}`)
        }
        
        // Collect quality aspects
        if (feedback.quality_categories) {
          feedback.quality_categories.forEach((cat: string) => qualitySet.add(cat))
        }
        if (feedback.quality_other) {
          generalComments.push(`نقطه قوت: ${feedback.quality_other}`)
        }
        
        // Collect improvements
        if (feedback.improvements_categories) {
          feedback.improvements_categories.forEach((cat: string) => improvementsSet.add(cat))
        }
        if (feedback.improvements_other) {
          generalComments.push(`پیشنهاد: ${feedback.improvements_other}`)
        }
        
        // General feedback
        if (feedback.general_text) {
          generalComments.push(`نظر کلی: ${feedback.general_text}`)
        }
        if (feedback.general_other) {
          generalComments.push(`نظر اضافی: ${feedback.general_other}`)
        }
      })
      
      if (problemsSet.size === 0 && qualitySet.size === 0 && improvementsSet.size === 0 && generalComments.length === 0) {
        return ''
      }
      
      let summary = '📋 راهنمای شخصی‌سازی بر اساس بازخوردهای شما\n\n'
      
      if (problemsSet.size > 0) {
        summary += '🚫 مشکلات شناسایی شده که باید اجتناب کنم:\n\n'
        problemsSet.forEach(problem => {
          const description = getProblemDescription(problem)
          const instruction = getProblemInstruction(problem)
          summary += `   • ${description}\n     → ${instruction}\n\n`
        })
      }
      
      if (qualitySet.size > 0) {
        summary += '✅ نقاط قوت که باید حفظ کنم:\n\n'
        qualitySet.forEach(quality => {
          const description = getQualityDescription(quality)
          const instruction = getQualityInstruction(quality)
          summary += `   • ${description}\n     → ${instruction}\n\n`
        })
      }
      
      if (improvementsSet.size > 0) {
        summary += '🔄 بهبودهایی که باید اعمال کنم:\n\n'
        improvementsSet.forEach(improvement => {
          const description = getImprovementDescription(improvement)
          const instruction = getImprovementInstruction(improvement)
          summary += `   • ${description}\n     → ${instruction}\n\n`
        })
      }
      
      if (generalComments.length > 0) {
        summary += '💬 نظرات کلی شما:\n\n'
        // Get unique comments (last 5 to avoid too long prompt)
        const uniqueComments = [...new Set(generalComments)].slice(-5)
        uniqueComments.forEach(comment => {
          summary += `   • ${comment}\n\n`
        })
      }
      
      summary += '📝 دستورالعمل نهایی:\n'
      summary += 'لطفاً این تنظیمات را در تمام پیام‌های خود رعایت کنید و مطابق این بازخورد‌ها عمل کنید.\n'
      
      return summary
    } catch (error) {
      console.error('Error fetching user feedback profile:', error)
      return ''
    }
  }

  // Get feedback summary for a session
  const getSessionFeedbackSummary = async (sessionId: string): Promise<string> => {
    try {
      const feedbacks = await nuxtApp.$pb.collection('message_feedback').getFullList({
        filter: `session_id = "${sessionId}"`,
        sort: '-created'
      })

      if (feedbacks.length === 0) {
        return ''
      }

      // Process feedback to create a summary
      const feedbackSummary = processFeedbackForPrompt(feedbacks)
      return feedbackSummary
    } catch (error) {
      console.error('Error fetching session feedback:', error)
      return ''
    }
  }

  // Process feedback data to create a coherent summary for the AI
  const processFeedbackForPrompt = (feedbacks: any[]): string => {
    const problemsSet = new Set<string>()
    const qualitySet = new Set<string>()
    const improvementsSet = new Set<string>()
    const generalComments: string[] = []

    // Aggregate feedback
    feedbacks.forEach(feedback => {
      // Collect problems
      if (feedback.problems_categories) {
        feedback.problems_categories.forEach((cat: string) => problemsSet.add(cat))
      }
      if (feedback.problems_other) {
        generalComments.push(`مشکل: ${feedback.problems_other}`)
      }

      // Collect quality aspects
      if (feedback.quality_categories) {
        feedback.quality_categories.forEach((cat: string) => qualitySet.add(cat))
      }
      if (feedback.quality_other) {
        generalComments.push(`نقطه قوت: ${feedback.quality_other}`)
      }

      // Collect improvements
      if (feedback.improvements_categories) {
        feedback.improvements_categories.forEach((cat: string) => improvementsSet.add(cat))
      }
      if (feedback.improvements_other) {
        generalComments.push(`پیشنهاد: ${feedback.improvements_other}`)
      }

      // General feedback
      if (feedback.general_text) {
        generalComments.push(`نظر کلی: ${feedback.general_text}`)
      }
      if (feedback.general_other) {
        generalComments.push(`نظر اضافی: ${feedback.general_other}`)
      }
    })

    // Create feedback summary
    let summary = '\n--- بازخورد مراجع از پیام‌های قبلی ---\n'
    
    if (problemsSet.size > 0) {
      summary += 'مشکلات شناسایی شده:\n'
      problemsSet.forEach(problem => {
        summary += `- ${getProblemDescription(problem)}\n`
      })
    }

    if (qualitySet.size > 0) {
      summary += 'نقاط قوت شناسایی شده:\n'
      qualitySet.forEach(quality => {
        summary += `- ${getQualityDescription(quality)}\n`
      })
    }

    if (improvementsSet.size > 0) {
      summary += 'پیشنهادات بهبود:\n'
      improvementsSet.forEach(improvement => {
        summary += `- ${getImprovementDescription(improvement)}\n`
      })
    }

    if (generalComments.length > 0) {
      summary += 'نظرات کلی:\n'
      generalComments.forEach(comment => {
        summary += `- ${comment}\n`
      })
    }

    summary += '--- پایان بازخورد ---\n'
    summary += 'لطفاً این بازخورد را در پیام‌های بعدی خود در نظر بگیرید و سعی کنید مشکلات شناسایی شده را برطرف کنید.\n'

    return summary
  }

  // Helper functions to get descriptions
  const getProblemDescription = (problem: string): string => {
    const descriptions: Record<string, string> = {
      'not_empathic': 'پیام همدلانه نیست',
      'repetitive': 'پیشنهاد تکراری است',
      'not_helpful': 'پاسخ مفید نیست',
      'too_generic': 'پاسخ کلی و عمومی است',
      'inappropriate': 'پاسخ نامناسب است',
      'off_topic': 'خارج از موضوع است',
      'too_long': 'خیلی طولانی است',
      'too_short': 'خیلی کوتاه است',
      'not_islamic_aligned': 'منطبق با باورهای اسلامی نیست'
    }
    return descriptions[problem] || problem
  }

  const getQualityDescription = (quality: string): string => {
    const descriptions: Record<string, string> = {
      'clear_helpful': 'واضح و مفید',
      'professional': 'حرفه‌ای و مناسب',
      'good_timing': 'زمان‌بندی مناسب',
      'empathetic': 'همدلانه و دلسوزانه',
      'actionable': 'قابل اجرا و عملی',
      'comprehensive': 'جامع و کامل'
    }
    return descriptions[quality] || quality
  }

  const getImprovementDescription = (improvement: string): string => {
    const descriptions: Record<string, string> = {
      'more_empathy': 'بیشتر همدلی نشان دهد',
      'more_specific': 'خاص‌تر و مشخص‌تر باشد',
      'more_examples': 'مثال‌های بیشتر ارائه دهد',
      'ask_questions': 'سوال‌های بیشتری بپرسد',
      'shorter_response': 'پاسخ کوتاه‌تری دهد',
      'longer_response': 'پاسخ بیشتر توضیح دهد'
    }
    return descriptions[improvement] || improvement
  }

  // Helper functions to get clear instructions for each category
  const getProblemInstruction = (problem: string): string => {
    const instructions: Record<string, string> = {
      'not_empathic': 'از کلمات همدلانه و دلسوزانه استفاده کنم و احساسات مراجع را تأیید کنم',
      'repetitive': 'از تکرار پیشنهادات و مفاهیم قبلی اجتناب کنم و راه‌حل‌های متنوع ارائه دهم',
      'not_helpful': 'پاسخ‌های عملی و کاربردی ارائه دهم که مستقیماً به مشکل مراجع کمک کند',
      'too_generic': 'پاسخ‌های اختصاصی و شخصی‌سازی شده بدهم که مخصوص وضعیت مراجع باشد',
      'inappropriate': 'از پاسخ‌های نامناسب اجتناب کنم و همواره حرفه‌ای باشم',
      'off_topic': 'روی موضوع اصلی متمرکز بمانم و از انحراف از بحث پرهیز کنم',
      'too_long': 'پاسخ‌های مختصر و مفید ارائه دهم',
      'too_short': 'توضیحات کافی و جامع ارائه دهم',
      'not_islamic_aligned': 'پاسخ‌هایم با اصول و باورهای اسلامی مطابقت داشته باشد'
    }
    return instructions[problem] || 'این مشکل را در پاسخ‌های آینده برطرف کنم'
  }

  const getQualityInstruction = (quality: string): string => {
    const instructions: Record<string, string> = {
      'clear_helpful': 'همچنان پاسخ‌های واضح و مفید ارائه دهم',
      'professional': 'رفتار حرفه‌ای و مناسب خود را حفظ کنم',
      'good_timing': 'زمان‌بندی مناسب پاسخ‌ها را ادامه دهم',
      'empathetic': 'همدلی و دلسوزی خود را در پاسخ‌ها حفظ کنم',
      'actionable': 'پیشنهادات عملی و قابل اجرا ارائه دهم',
      'comprehensive': 'پاسخ‌های جامع و کامل ارائه دهم'
    }
    return instructions[quality] || 'این ویژگی مثبت را حفظ کنم'
  }

  const getImprovementInstruction = (improvement: string): string => {
    const instructions: Record<string, string> = {
      'more_empathy': 'بیشتر از عبارات همدلانه مثل "متوجه احساستان هستم" استفاده کنم',
      'more_specific': 'به جای توصیه‌های کلی، راه‌حل‌های مشخص و دقیق ارائه دهم',
      'more_examples': 'مثال‌های عملی و واقعی بیشتری در پاسخ‌هایم بیاورم',
      'ask_questions': 'سوال‌های هدفمند بیشتری بپرسم تا بهتر مراجع را بشناسم',
      'shorter_response': 'پاسخ‌هایم را کوتاه‌تر و مختصرتر کنم',
      'longer_response': 'توضیحات بیشتر و جزئیات دقیق‌تری ارائه دهم'
    }
    return instructions[improvement] || 'این بهبود را در پاسخ‌های آینده اعمال کنم'
  }

  // Build enhanced system prompt with feedback
  const buildEnhancedSystemPrompt = (
    basePrompt: string,
    feedbackSummary: string,
    sessionGoals?: any[],
    userFeedbackProfile?: string
  ): string => {
    let enhancedPrompt = basePrompt

    // Add user's global feedback profile first (highest priority)
    if (userFeedbackProfile) {
      enhancedPrompt += userFeedbackProfile
    }

    // Add session goals if available
    if (sessionGoals && sessionGoals.length > 0) {
      enhancedPrompt += '\n--- اهداف جلسه ---\n'
      sessionGoals.forEach(goal => {
        enhancedPrompt += `هدف: ${goal.title}\n`
        enhancedPrompt += `توضیح: ${goal.description}\n`
        enhancedPrompt += `وضعیت: ${goal.status}\n`
        enhancedPrompt += `اولویت: ${goal.priority}\n`
        if (goal.target_behaviors && goal.target_behaviors.length > 0) {
          enhancedPrompt += `رفتارهای هدف: ${goal.target_behaviors.join(', ')}\n`
        }
        enhancedPrompt += '---\n'
      })
    }

    // Add session-specific feedback summary
    if (feedbackSummary) {
      enhancedPrompt += feedbackSummary
    }

    return enhancedPrompt
  }

  return {
    getSessionFeedbackSummary,
    processFeedbackForPrompt,
    buildEnhancedSystemPrompt,
    getUserFeedbackProfile
  }
}