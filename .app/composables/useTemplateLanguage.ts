import type PocketBase from 'pocketbase'
import type { MessageTemplate, TemplateContext } from './useTemplateEngine'

export const useTemplateLanguage = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  /**
   * Language-specific formatting rules and utilities
   */
  const LANGUAGE_CONFIG = {
    fa: {
      name: 'فارسی',
      direction: 'rtl',
      dateFormat: 'fa-IR',
      numberFormat: 'fa-IR',
      currency: 'IRR',
      currencySymbol: 'ریال',
      booleanTrue: 'بله',
      booleanFalse: 'خیر',
      timeFormat: '24h'
    },
    en: {
      name: 'English',
      direction: 'ltr',
      dateFormat: 'en-US',
      numberFormat: 'en-US',
      currency: 'USD',
      currencySymbol: '$',
      booleanTrue: 'Yes',
      booleanFalse: 'No',
      timeFormat: '12h'
    }
  } as const

  /**
   * Get user's preferred language from preferences or profile
   */
  const getUserLanguage = async (userId?: string): Promise<'fa' | 'en'> => {
    try {
      if (!userId && !pb.authStore.model?.id) {
        return 'fa' // Default to Persian
      }

      const targetUserId = userId || pb.authStore.model?.id

      // First try to get from notification preferences
      try {
        const preferences = await pb.collection('notification_preferences').getFirstListItem(
          `user_id = "${targetUserId}"`
        )
        
        if (preferences.language && ['fa', 'en'].includes(preferences.language)) {
          return preferences.language as 'fa' | 'en'
        }
      } catch {
        // Preferences not found, continue to user profile
      }

      // Fallback to user profile language
      const user = await pb.collection('users').getOne(targetUserId)
      if (user.language && ['fa', 'en'].includes(user.language)) {
        return user.language as 'fa' | 'en'
      }

      // Default to Persian
      return 'fa'
    } catch (error) {
      console.error('❌ Error getting user language:', error)
      return 'fa'
    }
  }

  /**
   * Format text based on language-specific rules
   */
  const formatTextForLanguage = (text: string, language: 'fa' | 'en'): string => {
    const config = LANGUAGE_CONFIG[language]
    
    // Apply language-specific text transformations
    if (language === 'fa') {
      // Persian-specific formatting
      text = convertNumbersToPersian(text)
      text = formatPersianText(text)
    } else {
      // English-specific formatting
      text = convertNumbersToEnglish(text)
    }

    return text
  }

  /**
   * Convert English numbers to Persian numbers
   */
  const convertNumbersToPersian = (text: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return text.replace(/[0-9]/g, (match) => persianNumbers[parseInt(match)])
  }

  /**
   * Convert Persian numbers to English numbers
   */
  const convertNumbersToEnglish = (text: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return text.replace(/[۰-۹]/g, (match) => {
      return persianNumbers.indexOf(match).toString()
    })
  }

  /**
   * Apply Persian text formatting rules
   */
  const formatPersianText = (text: string): string => {
    // Fix common Persian typography issues
    text = text.replace(/ي/g, 'ی') // Replace Arabic ي with Persian ی
    text = text.replace(/ك/g, 'ک') // Replace Arabic ك with Persian ک
    text = text.replace(/ء/g, 'ٔ') // Replace hamza
    
    // Add proper spacing around punctuation
    text = text.replace(/([،؛؟!])([^\s])/g, '$1 $2')
    text = text.replace(/([^\s])([،؛؟!])/g, '$1$2')
    
    return text
  }

  /**
   * Format date for specific language
   */
  const formatDateForLanguage = (date: Date | string, language: 'fa' | 'en', format?: string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const config = LANGUAGE_CONFIG[language]

    try {
      if (format) {
        // Custom format
        const options = parseFormatString(format)
        return new Intl.DateTimeFormat(config.dateFormat, options).format(dateObj)
      }

      // Default format
      if (language === 'fa') {
        return new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj)
      } else {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj)
      }
    } catch (error) {
      console.error('❌ Error formatting date:', error)
      return dateObj.toLocaleDateString()
    }
  }

  /**
   * Format number for specific language
   */
  const formatNumberForLanguage = (number: number, language: 'fa' | 'en', format?: string): string => {
    const config = LANGUAGE_CONFIG[language]

    try {
      if (format) {
        const options = parseFormatString(format)
        return new Intl.NumberFormat(config.numberFormat, options).format(number)
      }

      return new Intl.NumberFormat(config.numberFormat).format(number)
    } catch (error) {
      console.error('❌ Error formatting number:', error)
      return number.toString()
    }
  }

  /**
   * Format boolean for specific language
   */
  const formatBooleanForLanguage = (value: boolean, language: 'fa' | 'en'): string => {
    const config = LANGUAGE_CONFIG[language]
    return value ? config.booleanTrue : config.booleanFalse
  }

  /**
   * Parse format string into Intl options
   */
  const parseFormatString = (format: string): any => {
    try {
      return JSON.parse(format)
    } catch {
      // Handle simple format strings
      const options: any = {}
      
      if (format.includes('short')) options.dateStyle = 'short'
      if (format.includes('medium')) options.dateStyle = 'medium'
      if (format.includes('long')) options.dateStyle = 'long'
      if (format.includes('full')) options.dateStyle = 'full'
      
      if (format.includes('currency')) {
        options.style = 'currency'
        options.currency = format.includes('USD') ? 'USD' : 'IRR'
      }
      if (format.includes('percent')) options.style = 'percent'
      if (format.includes('decimal')) options.style = 'decimal'
      
      return options
    }
  }

  /**
   * Get template by category and user's preferred language with fallback
   */
  const getTemplateForUser = async (
    category: 'session' | 'admin' | 'system',
    userId?: string,
    templateName?: string
  ): Promise<MessageTemplate | null> => {
    try {
      const userLanguage = await getUserLanguage(userId)
      const fallbackLanguage: 'fa' | 'en' = userLanguage === 'fa' ? 'en' : 'fa'

      // Build filter
      let filter = `category = "${category}" && is_active = true`
      if (templateName) {
        filter += ` && name = "${templateName}"`
      }

      // First try user's preferred language
      let templates = await pb.collection('message_templates').getList(1, 10, {
        filter: `${filter} && language = "${userLanguage}"`,
        sort: 'name'
      })

      if (templates.items.length === 0) {
        // Fallback to other language
        templates = await pb.collection('message_templates').getList(1, 10, {
          filter: `${filter} && language = "${fallbackLanguage}"`,
          sort: 'name'
        })
      }

      return templates.items.length > 0 ? templates.items[0] as unknown as MessageTemplate : null
    } catch (error) {
      console.error('❌ Error getting template for user:', error)
      return null
    }
  }

  /**
   * Get all available templates grouped by language
   */
  const getTemplatesByLanguage = async (category?: 'session' | 'admin' | 'system'): Promise<{
    fa: MessageTemplate[]
    en: MessageTemplate[]
  }> => {
    try {
      let filter = 'is_active = true'
      if (category) {
        filter += ` && category = "${category}"`
      }

      const [faTemplates, enTemplates] = await Promise.all([
        pb.collection('message_templates').getList(1, 100, {
          filter: `${filter} && language = "fa"`,
          sort: 'name'
        }),
        pb.collection('message_templates').getList(1, 100, {
          filter: `${filter} && language = "en"`,
          sort: 'name'
        })
      ])

      return {
        fa: faTemplates.items as unknown as MessageTemplate[],
        en: enTemplates.items as unknown as MessageTemplate[]
      }
    } catch (error) {
      console.error('❌ Error getting templates by language:', error)
      return { fa: [], en: [] }
    }
  }

  /**
   * Create language-specific context with proper formatting
   */
  const createLanguageContext = (
    baseContext: TemplateContext,
    language: 'fa' | 'en'
  ): TemplateContext => {
    const config = LANGUAGE_CONFIG[language]
    
    // Clone the context to avoid mutations
    const context = JSON.parse(JSON.stringify(baseContext))

    // Apply language-specific formatting to system context
    if (context.system) {
      context.system.app_name = language === 'fa' ? 'ذهنا' : 'Zehna'
      context.system.language = language
      context.system.direction = config.direction
      
      // Format dates and times
      if (context.system.current_date) {
        context.system.current_date = formatDateForLanguage(
          new Date(context.system.current_date),
          language
        )
      }
      
      if (context.system.current_time) {
        const time = new Date(`2000-01-01 ${context.system.current_time}`)
        context.system.current_time = time.toLocaleTimeString(config.dateFormat, {
          hour12: config.timeFormat === '12h'
        })
      }
    }

    // Apply language-specific formatting to user context
    if (context.user) {
      // Format numbers
      if (typeof context.user.session_count === 'number') {
        context.user.session_count_formatted = formatNumberForLanguage(
          context.user.session_count,
          language
        )
      }
      
      // Format dates
      if (context.user.last_active_at) {
        context.user.last_active_formatted = formatDateForLanguage(
          new Date(context.user.last_active_at),
          language
        )
      }
    }

    // Apply language-specific formatting to session context
    if (context.session) {
      // Format numbers
      if (typeof context.session.duration === 'number') {
        context.session.duration_formatted = formatNumberForLanguage(
          context.session.duration,
          language
        )
      }
      
      if (typeof context.session.analysis_score === 'number') {
        context.session.analysis_score_formatted = formatNumberForLanguage(
          context.session.analysis_score,
          language
        )
      }
      
      // Format dates
      if (context.session.completed_at) {
        context.session.completed_at_formatted = formatDateForLanguage(
          new Date(context.session.completed_at),
          language
        )
      }
    }

    return context
  }

  /**
   * Validate template for language-specific requirements
   */
  const validateTemplateLanguage = (template: MessageTemplate): {
    isValid: boolean
    warnings: string[]
  } => {
    const warnings: string[] = []
    
    if (template.language === 'fa') {
      // Persian-specific validations
      
      // Check for Arabic characters that should be Persian
      if (template.title_template.includes('ي') || template.body_template.includes('ي')) {
        warnings.push('استفاده از "ي" عربی به جای "ی" فارسی')
      }
      
      if (template.title_template.includes('ك') || template.body_template.includes('ك')) {
        warnings.push('استفاده از "ك" عربی به جای "ک" فارسی')
      }
      
      // Check for English numbers in Persian text
      if (/[0-9]/.test(template.title_template) || /[0-9]/.test(template.body_template)) {
        warnings.push('استفاده از اعداد انگلیسی در متن فارسی - بهتر است از اعداد فارسی استفاده شود')
      }
      
      // Check for proper punctuation spacing
      if (/[،؛؟!][^\s]/.test(template.body_template)) {
        warnings.push('فاصله‌گذاری نادرست بعد از علائم نگارشی')
      }
    } else if (template.language === 'en') {
      // English-specific validations
      
      // Check for Persian characters in English template
      if (/[\u0600-\u06FF]/.test(template.title_template) || /[\u0600-\u06FF]/.test(template.body_template)) {
        warnings.push('Persian characters found in English template')
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings
    }
  }

  return {
    // Language detection and management
    getUserLanguage,
    getTemplateForUser,
    getTemplatesByLanguage,
    
    // Language-specific formatting
    formatTextForLanguage,
    formatDateForLanguage,
    formatNumberForLanguage,
    formatBooleanForLanguage,
    
    // Context utilities
    createLanguageContext,
    
    // Validation
    validateTemplateLanguage,
    
    // Utility functions
    convertNumbersToPersian,
    convertNumbersToEnglish,
    formatPersianText,
    
    // Constants
    LANGUAGE_CONFIG
  }
}