import type PocketBase from 'pocketbase'
import type { MessageTemplate, TemplateContext, RenderedTemplate } from './useTemplateEngine'

// Types for message generation
interface UserProfile {
  id: string
  name?: string
  email?: string
  role?: string
  last_active_at?: string
  session_count?: number
  preferred_language?: 'fa' | 'en'
  engagement_score?: number
  notification_preferences?: any
}

interface SessionHistory {
  id: string
  session_type?: 'educational' | 'therapic' | 'therapy_journey'
  duration?: number
  completed_at?: string
  analysis_score?: number
  message_count?: number
}

interface PersonalizationContext {
  user: UserProfile
  recentSessions: SessionHistory[]
  engagementPatterns: EngagementPattern
  timeContext: TimeContext
  customData?: Record<string, any>
}

interface EngagementPattern {
  averageSessionDuration: number
  sessionFrequency: number // sessions per week
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  responseRate: number // 0-1
  clickThroughRate: number // 0-1
  engagementScore: number // 0-100
  lastEngagement?: string
}

interface TimeContext {
  currentTime: Date
  userTimezone: string
  dayOfWeek: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  isWeekend: boolean
  timeSinceLastSession?: number // hours
}

interface MessageGenerationOptions {
  userId: string
  sessionId?: string
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  customContext?: Record<string, any>
  templateCategory?: 'session' | 'admin' | 'system'
  language?: 'fa' | 'en'
}

interface GeneratedMessage {
  template: MessageTemplate
  renderedMessage: RenderedTemplate
  personalizationScore: number // 0-100, how personalized the message is
  contextData: PersonalizationContext
  generatedAt: string
}

export const useMessageGenerator = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  const templateEngine = useTemplateEngine()
  const notifications = useNotifications()

  /**
   * Generate personalized message for a user based on their profile and session history
   */
  const generatePersonalizedMessage = async (options: MessageGenerationOptions): Promise<GeneratedMessage | null> => {
    try {
      console.log('🎯 Generating personalized message for user:', options.userId)

      // Build personalization context
      const context = await buildPersonalizationContext(options.userId, options.sessionId)
      if (!context) {
        throw new Error('Could not build personalization context')
      }

      // Select best template based on context
      const template = await selectBestTemplate(options, context)
      if (!template) {
        throw new Error('No suitable template found')
      }

      // Create template context with personalized data
      const templateContext = await createPersonalizedTemplateContext(context, options)

      // Render the template
      const renderedMessage = templateEngine.renderTemplate({
        template,
        context: templateContext,
        strictMode: false
      })

      // Calculate personalization score
      const personalizationScore = calculatePersonalizationScore(context, template, options)

      const generatedMessage: GeneratedMessage = {
        template,
        renderedMessage,
        personalizationScore,
        contextData: context,
        generatedAt: new Date().toISOString()
      }

      console.log(`✅ Generated personalized message with score: ${personalizationScore}`)
      return generatedMessage

    } catch (error) {
      console.error('❌ Error generating personalized message:', error)
      return null
    }
  }

  /**
   * Build comprehensive personalization context for a user
   */
  const buildPersonalizationContext = async (userId: string, sessionId?: string): Promise<PersonalizationContext | null> => {
    try {
      // Get user profile
      const user = await pb.collection('users').getOne<UserProfile>(userId)
      
      // Get recent session history (last 10 sessions)
      const sessionsResult = await pb.collection('sessions').getList<SessionHistory>(1, 10, {
        filter: `user = "${userId}" && status = "done"`,
        sort: '-created'
      })

      // Get user's notification analytics for engagement patterns
      const analytics = await notifications.getNotificationAnalytics(30)
      
      // Build engagement patterns
      const engagementPatterns = await buildEngagementPatterns(userId, sessionsResult.items, analytics)
      
      // Build time context
      const timeContext = buildTimeContext(user.preferred_language || 'fa')

      const context: PersonalizationContext = {
        user,
        recentSessions: sessionsResult.items,
        engagementPatterns,
        timeContext
      }

      return context

    } catch (error) {
      console.error('❌ Error building personalization context:', error)
      return null
    }
  }

  /**
   * Build engagement patterns from user data and analytics
   */
  const buildEngagementPatterns = async (
    userId: string, 
    sessions: SessionHistory[], 
    analytics: any
  ): Promise<EngagementPattern> => {
    try {
      const patterns: EngagementPattern = {
        averageSessionDuration: 0,
        sessionFrequency: 0,
        preferredTimeOfDay: 'evening',
        responseRate: 0,
        clickThroughRate: 0,
        engagementScore: 0
      }

      // Calculate average session duration
      if (sessions.length > 0) {
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        patterns.averageSessionDuration = Math.round(totalDuration / sessions.length)
      }

      // Calculate session frequency (sessions per week)
      if (sessions.length > 0) {
        const oldestSession = new Date(sessions[sessions.length - 1].completed_at || '')
        const daysSinceOldest = (Date.now() - oldestSession.getTime()) / (1000 * 60 * 60 * 24)
        patterns.sessionFrequency = Math.round((sessions.length / daysSinceOldest) * 7)
      }

      // Determine preferred time of day from session completion times
      if (sessions.length > 0) {
        const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 }
        
        sessions.forEach(session => {
          if (session.completed_at) {
            const hour = new Date(session.completed_at).getHours()
            if (hour >= 6 && hour < 12) timeSlots.morning++
            else if (hour >= 12 && hour < 18) timeSlots.afternoon++
            else if (hour >= 18 && hour < 22) timeSlots.evening++
            else timeSlots.night++
          }
        })

        patterns.preferredTimeOfDay = Object.entries(timeSlots)
          .reduce((a, b) => timeSlots[a[0] as keyof typeof timeSlots] > timeSlots[b[0] as keyof typeof timeSlots] ? a : b)[0] as any
      }

      // Use analytics data if available
      if (analytics) {
        patterns.responseRate = analytics.delivered > 0 ? analytics.opened / analytics.delivered : 0
        patterns.clickThroughRate = analytics.delivered > 0 ? analytics.clicked / analytics.delivered : 0
        patterns.engagementScore = analytics.engagementScore || 0
      }

      return patterns

    } catch (error) {
      console.error('❌ Error building engagement patterns:', error)
      return {
        averageSessionDuration: 30,
        sessionFrequency: 2,
        preferredTimeOfDay: 'evening',
        responseRate: 0.5,
        clickThroughRate: 0.2,
        engagementScore: 50
      }
    }
  }

  /**
   * Build time context for message generation
   */
  const buildTimeContext = (userLanguage: 'fa' | 'en' = 'fa'): TimeContext => {
    const now = new Date()
    const hour = now.getHours()
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon'
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening'
    else timeOfDay = 'night'

    const dayOfWeek = userLanguage === 'fa' 
      ? ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'][now.getDay()]
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]

    return {
      currentTime: now,
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dayOfWeek,
      timeOfDay,
      isWeekend: now.getDay() === 0 || now.getDay() === 6
    }
  }

  /**
   * Select the best template based on context and options
   */
  const selectBestTemplate = async (
    options: MessageGenerationOptions,
    context: PersonalizationContext
  ): Promise<MessageTemplate | null> => {
    try {
      const userLanguage = context.user.preferred_language || 'fa'
      const category = options.templateCategory || 'session'

      // Get available templates
      const templates = await templateEngine.getTemplates({
        category,
        language: userLanguage,
        isActive: true
      })

      if (templates.length === 0) {
        // Fallback to other language if no templates found
        const fallbackTemplates = await templateEngine.getTemplates({
          category,
          language: userLanguage === 'fa' ? 'en' : 'fa',
          isActive: true
        })
        
        if (fallbackTemplates.length === 0) {
          throw new Error('No templates available')
        }
        
        return fallbackTemplates[0]
      }

      // For now, select the first available template
      // TODO: Implement more sophisticated template selection based on:
      // - User engagement patterns
      // - Message type
      // - Time of day
      // - Session history
      
      return templates[0]

    } catch (error) {
      console.error('❌ Error selecting best template:', error)
      return null
    }
  }

  /**
   * Create personalized template context
   */
  const createPersonalizedTemplateContext = async (
    context: PersonalizationContext,
    options: MessageGenerationOptions
  ): Promise<TemplateContext> => {
    const { user, recentSessions, engagementPatterns, timeContext } = context

    // Get session data if sessionId provided
    let sessionData = undefined
    if (options.sessionId) {
      try {
        const session = await pb.collection('sessions').getOne(options.sessionId)
        sessionData = {
          id: session.id,
          type: session.session_type,
          duration: session.total_time_passed,
          completed_at: session.end_time || new Date().toISOString(),
          analysis_score: session.analysis_score || 0
        }
      } catch (error) {
        console.warn('Could not fetch session data:', error)
      }
    }

    // Build personalized greeting based on time of day
    const getPersonalizedGreeting = (): string => {
      const name = user.name || 'کاربر عزیز'
      const { timeOfDay } = timeContext
      
      switch (timeOfDay) {
        case 'morning':
          return `صبح بخیر ${name}`
        case 'afternoon':
          return `ظهر بخیر ${name}`
        case 'evening':
          return `عصر بخیر ${name}`
        case 'night':
          return `شب بخیر ${name}`
        default:
          return `سلام ${name}`
      }
    }

    // Build motivational content based on engagement patterns
    const getMotivationalContent = (): string => {
      const { sessionFrequency, engagementScore } = engagementPatterns
      
      if (sessionFrequency >= 5) {
        return 'شما در مسیر درمان بسیار فعال هستید!'
      } else if (sessionFrequency >= 3) {
        return 'پیشرفت شما در درمان قابل تحسین است.'
      } else if (sessionFrequency >= 1) {
        return 'هر قدم در مسیر درمان ارزشمند است.'
      } else {
        return 'ما همیشه در کنار شما هستیم.'
      }
    }

    // Build session insights
    const getSessionInsights = (): string => {
      if (recentSessions.length === 0) {
        return 'آماده شروع سفر درمانی خود هستید؟'
      }

      const lastSession = recentSessions[0]
      const avgDuration = engagementPatterns.averageSessionDuration

      if (lastSession.duration && lastSession.duration > avgDuration) {
        return 'جلسه قبلی شما بسیار مفصل و مفید بود.'
      } else {
        return 'هر جلسه گامی به سوی بهبودی است.'
      }
    }

    return {
      user: {
        id: user.id,
        name: user.name || 'کاربر عزیز',
        email: user.email,
        role: user.role,
        last_active_at: user.last_active_at,
        session_count: user.session_count || 0
      },
      session: sessionData,
      system: {
        app_name: 'ذهنا',
        current_date: timeContext.currentTime.toLocaleDateString('fa-IR'),
        current_time: timeContext.currentTime.toLocaleTimeString('fa-IR'),
        timezone: timeContext.userTimezone
      },
      custom: {
        // Personalized content
        greeting: getPersonalizedGreeting(),
        motivational_content: getMotivationalContent(),
        session_insights: getSessionInsights(),
        
        // Context data
        time_of_day: timeContext.timeOfDay,
        day_of_week: timeContext.dayOfWeek,
        is_weekend: timeContext.isWeekend,
        
        // Engagement data
        session_frequency: engagementPatterns.sessionFrequency,
        engagement_score: engagementPatterns.engagementScore,
        preferred_time: engagementPatterns.preferredTimeOfDay,
        
        // Session statistics
        total_sessions: recentSessions.length,
        avg_session_duration: engagementPatterns.averageSessionDuration,
        last_session_date: recentSessions[0]?.completed_at ? 
          new Date(recentSessions[0].completed_at).toLocaleDateString('fa-IR') : null,
        
        // Custom data from options
        ...options.customContext
      }
    }
  }

  /**
   * Calculate how personalized a message is (0-100 score)
   */
  const calculatePersonalizationScore = (
    context: PersonalizationContext,
    template: MessageTemplate,
    options: MessageGenerationOptions
  ): number => {
    let score = 0

    // Base score for having user data
    if (context.user.name) score += 10
    if (context.user.session_count && context.user.session_count > 0) score += 15

    // Score for session history
    if (context.recentSessions.length > 0) score += 20
    if (context.recentSessions.length >= 5) score += 10

    // Score for engagement patterns
    if (context.engagementPatterns.engagementScore > 0) score += 15
    if (context.engagementPatterns.sessionFrequency > 0) score += 10

    // Score for time-based personalization
    score += 10 // Always have time context

    // Score for template variables usage
    const templateVariables = template.variables || []
    const personalizedVariables = templateVariables.filter(v => 
      v.source === 'user' || v.source === 'session' || v.name.includes('custom')
    )
    if (personalizedVariables.length > 0) {
      score += Math.min(20, personalizedVariables.length * 5)
    }

    return Math.min(100, score)
  }

  /**
   * Generate multiple message variations to avoid repetition
   */
  const generateMessageVariations = async (
    options: MessageGenerationOptions,
    count: number = 3
  ): Promise<GeneratedMessage[]> => {
    try {
      const variations: GeneratedMessage[] = []
      const context = await buildPersonalizationContext(options.userId, options.sessionId)
      
      if (!context) {
        throw new Error('Could not build personalization context')
      }

      // Get multiple templates of the same category
      const userLanguage = context.user.preferred_language || 'fa'
      const category = options.templateCategory || 'session'
      
      const templates = await templateEngine.getTemplates({
        category,
        language: userLanguage,
        isActive: true
      })

      // Generate variations using different templates or contexts
      for (let i = 0; i < Math.min(count, Math.max(1, templates.length)); i++) {
        const template = templates[i] || templates[0]
        
        // Vary the custom context slightly for each variation
        const variedOptions = {
          ...options,
          customContext: {
            ...options.customContext,
            variation_index: i,
            variation_total: count
          }
        }

        const templateContext = await createPersonalizedTemplateContext(context, variedOptions)
        
        const renderedMessage = templateEngine.renderTemplate({
          template,
          context: templateContext,
          strictMode: false
        })

        const personalizationScore = calculatePersonalizationScore(context, template, variedOptions)

        variations.push({
          template,
          renderedMessage,
          personalizationScore,
          contextData: context,
          generatedAt: new Date().toISOString()
        })
      }

      return variations

    } catch (error) {
      console.error('❌ Error generating message variations:', error)
      return []
    }
  }

  /**
   * Get message generation recommendations based on user context
   */
  const getMessageRecommendations = async (userId: string): Promise<{
    recommendedType: MessageGenerationOptions['messageType']
    recommendedPriority: MessageGenerationOptions['priority']
    recommendedTiming: 'immediate' | 'delayed' | 'scheduled'
    reasoning: string
  }> => {
    try {
      const context = await buildPersonalizationContext(userId)
      if (!context) {
        throw new Error('Could not build context for recommendations')
      }

      const { engagementPatterns, recentSessions, timeContext } = context

      // Determine recommended message type
      let recommendedType: MessageGenerationOptions['messageType'] = 'reminder'
      let recommendedPriority: MessageGenerationOptions['priority'] = 'medium'
      let recommendedTiming: 'immediate' | 'delayed' | 'scheduled' = 'delayed'
      let reasoning = ''

      // Check if user just completed a session
      if (recentSessions.length > 0) {
        const lastSession = recentSessions[0]
        const hoursSinceLastSession = lastSession.completed_at ? 
          (Date.now() - new Date(lastSession.completed_at).getTime()) / (1000 * 60 * 60) : 24

        if (hoursSinceLastSession < 2) {
          recommendedType = 'session_complete'
          recommendedTiming = 'immediate'
          reasoning = 'User just completed a session'
        } else if (hoursSinceLastSession < 24) {
          recommendedType = 'follow_up'
          recommendedTiming = 'delayed'
          reasoning = 'Follow-up after recent session'
        }
      }

      // Check engagement patterns
      if (engagementPatterns.engagementScore < 30) {
        recommendedType = 'encouragement'
        recommendedPriority = 'high'
        reasoning = 'Low engagement score, needs encouragement'
      } else if (engagementPatterns.sessionFrequency >= 5) {
        recommendedType = 'milestone'
        recommendedPriority = 'medium'
        reasoning = 'High activity user, celebrate milestones'
      }

      // Check time context
      if (timeContext.timeOfDay === engagementPatterns.preferredTimeOfDay) {
        recommendedTiming = 'immediate'
        reasoning += ' (optimal time for user)'
      } else {
        recommendedTiming = 'scheduled'
        reasoning += ' (schedule for user\'s preferred time)'
      }

      return {
        recommendedType,
        recommendedPriority,
        recommendedTiming,
        reasoning
      }

    } catch (error) {
      console.error('❌ Error getting message recommendations:', error)
      return {
        recommendedType: 'reminder',
        recommendedPriority: 'medium',
        recommendedTiming: 'delayed',
        reasoning: 'Default recommendation due to error'
      }
    }
  }

  return {
    // Core message generation
    generatePersonalizedMessage,
    generateMessageVariations,
    
    // Context building
    buildPersonalizationContext,
    buildEngagementPatterns,
    createPersonalizedTemplateContext,
    
    // Utilities
    calculatePersonalizationScore,
    getMessageRecommendations,
    
    // Template selection
    selectBestTemplate
  }
}