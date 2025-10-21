import type PocketBase from 'pocketbase'
import type { 
  MessageTemplate, 
  TemplateContext, 
  RenderedTemplate,
  TemplateValidationResult,
  TemplatePreviewOptions
} from './useTemplateEngine'
import { useTemplateLanguage } from './useTemplateLanguage'
import { useTemplateLanguage } from './useTemplateLanguage'

export const useTemplatePreview = () => {

  /**
   * Preview template with comprehensive validation and sample data
   */
  const previewTemplate = async (options: TemplatePreviewOptions): Promise<{
    rendered: RenderedTemplate
    validation: TemplateValidationResult
    languageValidation: { isValid: boolean; warnings: string[] }
    context: TemplateContext
    metadata: {
      characterCounts: {
        title: number
        body: number
        actionText?: number
      }
      estimatedDisplayTime: number
      hasVariables: boolean
      variableCount: number
      language: 'fa' | 'en'
    }
  }> => {
    const { template, context, sampleData = true, language } = options
    const { renderTemplate, validateTemplate, generateSampleContext } = useTemplateEngine()
    const { validateTemplateLanguage, createLanguageContext } = useTemplateLanguage()

    // Generate or use provided context
    let previewContext: TemplateContext
    if (sampleData) {
      previewContext = {
        ...generateSampleContext(template),
        ...context
      }
    } else {
      previewContext = context || {}
    }

    // Create language-specific context
    const finalLanguage = language || template.language
    const languageContext = createLanguageContext(previewContext, finalLanguage)

    // Render the template
    const rendered = renderTemplate({
      template: { ...template, language: finalLanguage },
      context: languageContext,
      strictMode: false
    })

    // Validate template
    const validation = validateTemplate(template)
    const languageValidation = validateTemplateLanguage(template)

    // Calculate metadata
    const metadata = {
      characterCounts: {
        title: rendered.title.length,
        body: rendered.body.length,
        actionText: rendered.actionText?.length
      },
      estimatedDisplayTime: calculateDisplayTime(rendered),
      hasVariables: (template.variables?.length || 0) > 0,
      variableCount: template.variables?.length || 0,
      language: finalLanguage
    }

    return {
      rendered,
      validation,
      languageValidation,
      context: languageContext,
      metadata
    }
  }

  /**
   * Calculate estimated display time for notification
   */
  const calculateDisplayTime = (rendered: RenderedTemplate): number => {
    // Average reading speed: 200 words per minute for Persian, 250 for English
    const wordsPerMinute = 200
    const totalText = `${rendered.title} ${rendered.body} ${rendered.actionText || ''}`
    const wordCount = totalText.split(/\s+/).length
    
    // Convert to seconds and add base display time
    const readingTime = (wordCount / wordsPerMinute) * 60
    const baseDisplayTime = 3 // 3 seconds base display time
    
    return Math.max(baseDisplayTime, Math.ceil(readingTime))
  }

  /**
   * Generate multiple preview variations with different contexts
   */
  const generatePreviewVariations = async (template: MessageTemplate): Promise<{
    variations: Array<{
      name: string
      description: string
      rendered: RenderedTemplate
      context: TemplateContext
    }>
    validation: TemplateValidationResult
  }> => {
    const { renderTemplate, validateTemplate, generateSampleContext } = useTemplateEngine()
    const { createLanguageContext } = useTemplateLanguage()
    const validation = validateTemplate(template)
    const variations: Array<{
      name: string
      description: string
      rendered: RenderedTemplate
      context: TemplateContext
    }> = []

    // Base sample context
    const baseSampleContext = generateSampleContext(template)

    // Variation 1: New user
    const newUserContext = {
      ...baseSampleContext,
      user: {
        ...baseSampleContext.user!,
        name: 'کاربر جدید',
        session_count: 1,
        last_active_at: new Date().toISOString()
      }
    }

    variations.push({
      name: 'کاربر جدید',
      description: 'پیش‌نمایش برای کاربر تازه عضو شده',
      rendered: renderTemplate({
        template,
        context: createLanguageContext(newUserContext, template.language),
        strictMode: false
      }),
      context: newUserContext
    })

    // Variation 2: Active user
    const activeUserContext = {
      ...baseSampleContext,
      user: {
        ...baseSampleContext.user!,
        name: 'علی محمدی',
        session_count: 25,
        last_active_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    }

    variations.push({
      name: 'کاربر فعال',
      description: 'پیش‌نمایش برای کاربر با تعامل بالا',
      rendered: renderTemplate({
        template,
        context: createLanguageContext(activeUserContext, template.language),
        strictMode: false
      }),
      context: activeUserContext
    })

    // Variation 3: Inactive user
    const inactiveUserContext = {
      ...baseSampleContext,
      user: {
        ...baseSampleContext.user!,
        name: 'مریم احمدی',
        session_count: 8,
        last_active_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      }
    }

    variations.push({
      name: 'کاربر غیرفعال',
      description: 'پیش‌نمایش برای کاربر با تعامل کم',
      rendered: renderTemplate({
        template,
        context: createLanguageContext(inactiveUserContext, template.language),
        strictMode: false
      }),
      context: inactiveUserContext
    })

    // Variation 4: Long session
    if (template.category === 'session') {
      const longSessionContext = {
        ...baseSampleContext,
        session: {
          ...baseSampleContext.session!,
          duration: 90,
          analysis_score: 95
        }
      }

      variations.push({
        name: 'جلسه طولانی',
        description: 'پیش‌نمایش برای جلسه با مدت زمان بالا',
        rendered: renderTemplate({
          template,
          context: createLanguageContext(longSessionContext, template.language),
          strictMode: false
        }),
        context: longSessionContext
      })
    }

    return {
      variations,
      validation
    }
  }

  /**
   * Test template with real user data (if available)
   */
  const testTemplateWithRealData = async (
    template: MessageTemplate,
    userId?: string,
    sessionId?: string
  ): Promise<{
    rendered: RenderedTemplate
    context: TemplateContext
    success: boolean
    errors: string[]
  }> => {
    const errors: string[] = []
    let success = true

    try {
      const { $pb } = useNuxtApp()
      const pb = $pb as PocketBase
      const context: TemplateContext = {
        system: {
          app_name: 'ذهنا',
          current_date: new Date().toLocaleDateString('fa-IR'),
          current_time: new Date().toLocaleTimeString('fa-IR'),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }

      // Fetch user data if provided
      if (userId) {
        try {
          const user = await pb.collection('users').getOne(userId)
          context.user = {
            id: user.id,
            name: user.name || user.email,
            email: user.email,
            role: user.role,
            last_active_at: user.last_active_at,
            session_count: user.session_count || 0
          }
        } catch (error) {
          errors.push(`خطا در دریافت اطلاعات کاربر: ${error}`)
          success = false
        }
      }

      // Fetch session data if provided
      if (sessionId) {
        try {
          const session = await pb.collection('sessions').getOne(sessionId)
          context.session = {
            id: session.id,
            type: session.type,
            duration: session.duration,
            completed_at: session.completed_at,
            analysis_score: session.analysis_score
          }
        } catch (error) {
          errors.push(`خطا در دریافت اطلاعات جلسه: ${error}`)
          success = false
        }
      }

      // If no real data available, use sample data
      if (!context.user && !context.session) {
        const sampleContext = generateSampleContext(template)
        Object.assign(context, sampleContext)
        errors.push('داده‌های واقعی در دسترس نیست، از داده‌های نمونه استفاده شد')
      }

      const languageContext = createLanguageContext(context, template.language)
      const rendered = renderTemplate({
        template,
        context: languageContext,
        strictMode: false
      })

      return {
        rendered,
        context: languageContext,
        success,
        errors
      }
    } catch (error) {
      return {
        rendered: {
          title: 'خطا در رندر قالب',
          body: `خطا: ${error}`
        },
        context: {},
        success: false,
        errors: [`خطای کلی: ${error}`]
      }
    }
  }

  /**
   * Validate template against different screen sizes and platforms
   */
  const validateTemplateForPlatforms = (rendered: RenderedTemplate): {
    mobile: { isValid: boolean; warnings: string[] }
    desktop: { isValid: boolean; warnings: string[] }
    web: { isValid: boolean; warnings: string[] }
  } => {
    const results = {
      mobile: { isValid: true, warnings: [] as string[] },
      desktop: { isValid: true, warnings: [] as string[] },
      web: { isValid: true, warnings: [] as string[] }
    }

    // Mobile validation
    if (rendered.title.length > 50) {
      results.mobile.warnings.push('عنوان برای موبایل خیلی طولانی است (بیش از ۵۰ کاراکتر)')
      results.mobile.isValid = false
    }
    
    if (rendered.body.length > 150) {
      results.mobile.warnings.push('متن برای موبایل خیلی طولانی است (بیش از ۱۵۰ کاراکتر)')
      results.mobile.isValid = false
    }

    // Desktop validation
    if (rendered.title.length > 100) {
      results.desktop.warnings.push('عنوان برای دسکتاپ خیلی طولانی است (بیش از ۱۰۰ کاراکتر)')
      results.desktop.isValid = false
    }
    
    if (rendered.body.length > 300) {
      results.desktop.warnings.push('متن برای دسکتاپ خیلی طولانی است (بیش از ۳۰۰ کاراکتر)')
      results.desktop.isValid = false
    }

    // Web validation (similar to desktop but more lenient)
    if (rendered.title.length > 120) {
      results.web.warnings.push('عنوان برای وب خیلی طولانی است (بیش از ۱۲۰ کاراکتر)')
      results.web.isValid = false
    }
    
    if (rendered.body.length > 400) {
      results.web.warnings.push('متن برای وب خیلی طولانی است (بیش از ۴۰۰ کاراکتر)')
      results.web.isValid = false
    }

    // Action text validation (all platforms)
    if (rendered.actionText && rendered.actionText.length > 20) {
      const warning = 'متن دکمه عمل خیلی طولانی است (بیش از ۲۰ کاراکتر)'
      results.mobile.warnings.push(warning)
      results.desktop.warnings.push(warning)
      results.web.warnings.push(warning)
    }

    return results
  }

  /**
   * Generate comprehensive template report
   */
  const generateTemplateReport = async (template: MessageTemplate): Promise<{
    overview: {
      name: string
      category: string
      language: string
      isActive: boolean
      variableCount: number
    }
    validation: TemplateValidationResult
    languageValidation: { isValid: boolean; warnings: string[] }
    variations: Array<{
      name: string
      rendered: RenderedTemplate
      platformValidation: ReturnType<typeof validateTemplateForPlatforms>
    }>
    recommendations: string[]
  }> => {
    const validation = validateTemplate(template)
    const languageValidation = validateTemplateLanguage(template)
    const { variations } = await generatePreviewVariations(template)
    
    const recommendations: string[] = []
    
    // Generate recommendations based on validation results
    if (!validation.isValid) {
      recommendations.push('قالب دارای خطاهای ساختاری است که باید برطرف شوند')
    }
    
    if (validation.warnings.length > 0) {
      recommendations.push('توجه به هشدارهای اعتبارسنجی برای بهبود کیفیت قالب')
    }
    
    if (!languageValidation.isValid) {
      recommendations.push('بررسی و اصلاح مسائل زبان‌شناختی قالب')
    }
    
    // Check if template has variables
    if (!template.variables || template.variables.length === 0) {
      recommendations.push('افزودن متغیرها برای شخصی‌سازی بیشتر پیام‌ها')
    }
    
    // Check template length across variations
    const hasLongContent = variations.some(v => 
      v.rendered.title.length > 80 || v.rendered.body.length > 200
    )
    
    if (hasLongContent) {
      recommendations.push('کوتاه کردن محتوای قالب برای سازگاری بهتر با پلتفرم‌های مختلف')
    }

    return {
      overview: {
        name: template.name,
        category: template.category,
        language: template.language,
        isActive: template.is_active,
        variableCount: template.variables?.length || 0
      },
      validation,
      languageValidation,
      variations: variations.map(v => ({
        name: v.name,
        rendered: v.rendered,
        platformValidation: validateTemplateForPlatforms(v.rendered)
      })),
      recommendations
    }
  }

  return {
    // Core preview functions
    previewTemplate,
    generatePreviewVariations,
    testTemplateWithRealData,
    
    // Validation functions
    validateTemplateForPlatforms,
    generateTemplateReport,
    
    // Utility functions
    calculateDisplayTime
  }
}