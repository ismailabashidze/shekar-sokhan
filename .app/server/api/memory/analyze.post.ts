/**
 * Server API endpoint for memory analysis
 * This handles mem0 operations server-side where the library is properly available
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { content, userId } = body

    if (!content || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: content, userId'
      })
    }

    // Simple rule-based analysis (can be enhanced with AI later)
    const result = performAnalysis(content)

    return {
      success: true,
      analysis: result
    }
  } catch (error) {
    console.error('Memory analysis error:', error)
    
    return {
      success: false,
      error: error.message || 'Analysis failed',
      analysis: {
        isWorth: false,
        reason: 'خطا در تحلیل'
      }
    }
  }
})

function performAnalysis(content: string) {
  // Enhanced rule-based analysis
  const personalInfoPatterns = [
    /نام\s*من\s*([^\s]+)/,
    /(\d+)\s*ساله/,
    /شغل\s*من/,
    /(متأهل|مجرد|طلاق)/
  ]

  const goalPatterns = [
    /می‌?خواهم/,
    /هدف\s*من/,
    /آرزو/,
    /قصد\s*دارم/,
    /برنامه\s*دارم/
  ]

  const symptomPatterns = [
    /اضطراب/,
    /افسرده/,
    /استرس/,
    /نگران/,
    /ترس/,
    /خواب\s*ن?دارم/,
    /سردرد/,
    /خسته/
  ]

  const triggerPatterns = [
    /باعث\s*استرس/,
    /نگران\s*می‌?کن/,
    /ترسناک/,
    /مشکل‌زا/
  ]

  const relationshipPatterns = [
    /(مادر|پدر|والدین)/,
    /(همسر|زن|شوهر)/,
    /(فرزند|بچه|پسر|دختر)/,
    /(دوست|رفیق)/,
    /(خانواده|بستگان)/,
    /دعوا\s*کرد/,
    /رابطه/
  ]

  const progressPatterns = [
    /بهتر\s*شد/,
    /پیشرفت/,
    /موفق\s*شد/,
    /تونست/,
    /بتوان/
  ]

  let category = 'other'
  let importance = 3
  let isWorth = false
  let reason = 'پیام عمومی'

  const lowerContent = content.toLowerCase()

  // Check patterns
  if (personalInfoPatterns.some(pattern => pattern.test(content))) {
    category = 'personal_info'
    importance = 7
    isWorth = true
    reason = 'حاوی اطلاعات شخصی'
  } else if (goalPatterns.some(pattern => pattern.test(content))) {
    category = 'goals'
    importance = 8
    isWorth = true
    reason = 'بیان هدف یا آرزو'
  } else if (symptomPatterns.some(pattern => pattern.test(content))) {
    category = 'symptoms'
    importance = 8
    isWorth = true
    reason = 'شامل علائم روانی'
  } else if (triggerPatterns.some(pattern => pattern.test(content))) {
    category = 'triggers'
    importance = 7
    isWorth = true
    reason = 'شناسایی محرک استرس'
  } else if (relationshipPatterns.some(pattern => pattern.test(content))) {
    category = 'relationships'
    importance = 7
    isWorth = true
    reason = 'مربوط به روابط'
  } else if (progressPatterns.some(pattern => pattern.test(content))) {
    category = 'progress'
    importance = 8
    isWorth = true
    reason = 'نشان‌دهنده پیشرفت'
  }

  // Skip very short messages or common greetings
  const commonPhrases = ['سلام', 'ممنون', 'متشکر', 'خداحافظ', 'چطور', 'خوبم', 'خوبید']
  if (content.length < 8 || commonPhrases.some(phrase => lowerContent.includes(phrase))) {
    if (!isWorth) { // Only override if not already marked as important
      isWorth = false
      reason = 'پیام کوتاه یا تعارفی'
    }
  }

  return {
    isWorth,
    reason,
    suggestedCategory: category,
    suggestedImportance: importance,
    extractedInfo: isWorth ? content : null
  }
}