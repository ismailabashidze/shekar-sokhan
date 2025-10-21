import type PocketBase from 'pocketbase'
import type { GeneratedMessage } from './useMessageGenerator'

// Types for engagement optimization
interface EngagementMetrics {
  userId: string
  messageId?: string
  templateId: string
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  deliveryTime: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: string
  isWeekend: boolean
  
  // Engagement tracking
  delivered: boolean
  deliveredAt?: string
  opened: boolean
  openedAt?: string
  clicked: boolean
  clickedAt?: string
  
  // Context data
  userEngagementScore: number
  sessionFrequency: number
  personalizationScore: number
  
  // A/B testing
  testGroup?: string
  testVariant?: string
}

interface ABTestConfig {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  variants: ABTestVariant[]
  trafficSplit: number[] // e.g., [50, 50] for 50/50 split
  startDate: string
  endDate?: string
  targetSampleSize: number
  currentSampleSize: number
  confidenceLevel: number // e.g., 95
  created: string
  updated: string
}

interface ABTestVariant {
  id: string
  name: string
  templateId: string
  weight: number // 0-100
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    deliveryRate: number
    openRate: number
    clickRate: number
  }
}

interface ABTestResult {
  testId: string
  winningVariant: string
  confidence: number
  improvement: number // percentage improvement
  metrics: {
    [variantId: string]: {
      sent: number
      delivered: number
      opened: number
      clicked: number
      deliveryRate: number
      openRate: number
      clickRate: number
    }
  }
  recommendation: 'continue' | 'stop' | 'extend'
  significance: boolean
}

interface OptimizationRecommendation {
  userId: string
  recommendedTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  recommendedDayOfWeek: string[]
  recommendedMessageType: string
  recommendedPersonalizationLevel: 'low' | 'medium' | 'high'
  confidence: number
  reasoning: string[]
}

export const useEngagementOptimizer = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  const messageGenerator = useMessageGenerator()

  /**
   * Track engagement metrics for a message
   */
  const trackEngagementMetrics = async (metrics: Partial<EngagementMetrics>): Promise<boolean> => {
    try {
      // Check if metrics record already exists
      let existingMetrics = null
      if (metrics.messageId) {
        try {
          existingMetrics = await pb.collection('engagement_metrics').getFirstListItem(
            `message_id = "${metrics.messageId}"`
          )
        } catch (error) {
          // Record doesn't exist, will create new one
        }
      }

      if (existingMetrics) {
        // Update existing metrics
        await pb.collection('engagement_metrics').update(existingMetrics.id, metrics)
        console.log('📊 Updated engagement metrics:', existingMetrics.id)
      } else {
        // Create new metrics record
        const created = await pb.collection('engagement_metrics').create({
          ...metrics,
          created: new Date().toISOString()
        })
        console.log('📊 Created engagement metrics:', created.id)
      }

      return true
    } catch (error) {
      console.error('❌ Error tracking engagement metrics:', error)
      return false
    }
  }

  /**
   * Analyze user engagement patterns to optimize future messages
   */
  const analyzeUserEngagementPatterns = async (userId: string, days: number = 30): Promise<OptimizationRecommendation | null> => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get user's engagement metrics
      const metrics = await pb.collection('engagement_metrics').getList(1, 1000, {
        filter: `user_id = "${userId}" && created >= "${startDate.toISOString()}"`,
        sort: '-created'
      })

      if (metrics.items.length === 0) {
        return null
      }

      // Analyze patterns
      const patterns = analyzeEngagementData(metrics.items)
      
      // Generate recommendations
      const recommendation: OptimizationRecommendation = {
        userId,
        recommendedTimeOfDay: patterns.bestTimeOfDay,
        recommendedDayOfWeek: patterns.bestDaysOfWeek,
        recommendedMessageType: patterns.bestMessageType,
        recommendedPersonalizationLevel: patterns.bestPersonalizationLevel,
        confidence: patterns.confidence,
        reasoning: patterns.reasoning
      }

      return recommendation

    } catch (error) {
      console.error('❌ Error analyzing engagement patterns:', error)
      return null
    }
  }

  /**
   * Analyze engagement data to find patterns
   */
  const analyzeEngagementData = (metrics: any[]): {
    bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    bestDaysOfWeek: string[]
    bestMessageType: string
    bestPersonalizationLevel: 'low' | 'medium' | 'high'
    confidence: number
    reasoning: string[]
  } => {
    const reasoning: string[] = []

    // Analyze time of day performance
    const timeOfDayStats = {
      morning: { sent: 0, opened: 0, clicked: 0 },
      afternoon: { sent: 0, opened: 0, clicked: 0 },
      evening: { sent: 0, opened: 0, clicked: 0 },
      night: { sent: 0, opened: 0, clicked: 0 }
    }

    // Analyze day of week performance
    const dayOfWeekStats: { [key: string]: { sent: number, opened: number, clicked: number } } = {}

    // Analyze message type performance
    const messageTypeStats: { [key: string]: { sent: number, opened: number, clicked: number } } = {}

    // Analyze personalization level performance
    const personalizationStats = {
      low: { sent: 0, opened: 0, clicked: 0 },
      medium: { sent: 0, opened: 0, clicked: 0 },
      high: { sent: 0, opened: 0, clicked: 0 }
    }

    // Process metrics
    metrics.forEach((metric: any) => {
      // Time of day analysis
      if (metric.time_of_day && timeOfDayStats[metric.time_of_day]) {
        timeOfDayStats[metric.time_of_day].sent++
        if (metric.opened) timeOfDayStats[metric.time_of_day].opened++
        if (metric.clicked) timeOfDayStats[metric.time_of_day].clicked++
      }

      // Day of week analysis
      if (metric.day_of_week) {
        if (!dayOfWeekStats[metric.day_of_week]) {
          dayOfWeekStats[metric.day_of_week] = { sent: 0, opened: 0, clicked: 0 }
        }
        dayOfWeekStats[metric.day_of_week].sent++
        if (metric.opened) dayOfWeekStats[metric.day_of_week].opened++
        if (metric.clicked) dayOfWeekStats[metric.day_of_week].clicked++
      }

      // Message type analysis
      if (metric.message_type) {
        if (!messageTypeStats[metric.message_type]) {
          messageTypeStats[metric.message_type] = { sent: 0, opened: 0, clicked: 0 }
        }
        messageTypeStats[metric.message_type].sent++
        if (metric.opened) messageTypeStats[metric.message_type].opened++
        if (metric.clicked) messageTypeStats[metric.message_type].clicked++
      }

      // Personalization level analysis
      const personalizationScore = metric.personalization_score || 0
      let level: 'low' | 'medium' | 'high' = 'medium'
      if (personalizationScore < 40) level = 'low'
      else if (personalizationScore > 70) level = 'high'

      personalizationStats[level].sent++
      if (metric.opened) personalizationStats[level].opened++
      if (metric.clicked) personalizationStats[level].clicked++
    })

    // Find best time of day
    let bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'evening'
    let bestTimeRate = 0
    
    Object.entries(timeOfDayStats).forEach(([time, stats]) => {
      if (stats.sent > 0) {
        const rate = (stats.opened + stats.clicked * 2) / stats.sent // Weight clicks more
        if (rate > bestTimeRate) {
          bestTimeRate = rate
          bestTimeOfDay = time as any
        }
      }
    })

    if (bestTimeRate > 0) {
      reasoning.push(`بهترین زمان ارسال: ${bestTimeOfDay} با نرخ تعامل ${(bestTimeRate * 100).toFixed(1)}%`)
    }

    // Find best days of week
    const bestDaysOfWeek: string[] = []
    const dayRates: Array<{ day: string, rate: number }> = []
    
    Object.entries(dayOfWeekStats).forEach(([day, stats]) => {
      if (stats.sent > 0) {
        const rate = (stats.opened + stats.clicked * 2) / stats.sent
        dayRates.push({ day, rate })
      }
    })

    dayRates.sort((a, b) => b.rate - a.rate)
    bestDaysOfWeek.push(...dayRates.slice(0, 3).map(d => d.day)) // Top 3 days

    if (dayRates.length > 0) {
      reasoning.push(`بهترین روزهای هفته: ${bestDaysOfWeek.join(', ')}`)
    }

    // Find best message type
    let bestMessageType = 'reminder'
    let bestMessageRate = 0
    
    Object.entries(messageTypeStats).forEach(([type, stats]) => {
      if (stats.sent > 0) {
        const rate = (stats.opened + stats.clicked * 2) / stats.sent
        if (rate > bestMessageRate) {
          bestMessageRate = rate
          bestMessageType = type
        }
      }
    })

    if (bestMessageRate > 0) {
      reasoning.push(`بهترین نوع پیام: ${bestMessageType} با نرخ تعامل ${(bestMessageRate * 100).toFixed(1)}%`)
    }

    // Find best personalization level
    let bestPersonalizationLevel: 'low' | 'medium' | 'high' = 'medium'
    let bestPersonalizationRate = 0
    
    Object.entries(personalizationStats).forEach(([level, stats]) => {
      if (stats.sent > 0) {
        const rate = (stats.opened + stats.clicked * 2) / stats.sent
        if (rate > bestPersonalizationRate) {
          bestPersonalizationRate = rate
          bestPersonalizationLevel = level as any
        }
      }
    })

    if (bestPersonalizationRate > 0) {
      reasoning.push(`بهترین سطح شخصی‌سازی: ${bestPersonalizationLevel}`)
    }

    // Calculate confidence based on sample size
    const totalSent = metrics.length
    let confidence = 0
    if (totalSent >= 100) confidence = 95
    else if (totalSent >= 50) confidence = 80
    else if (totalSent >= 20) confidence = 60
    else if (totalSent >= 10) confidence = 40
    else confidence = 20

    return {
      bestTimeOfDay,
      bestDaysOfWeek,
      bestMessageType,
      bestPersonalizationLevel,
      confidence,
      reasoning
    }
  }

  /**
   * Create A/B test for message optimization
   */
  const createABTest = async (config: Omit<ABTestConfig, 'id' | 'created' | 'updated' | 'currentSampleSize'>): Promise<ABTestConfig | null> => {
    try {
      const testConfig: ABTestConfig = {
        ...config,
        id: '', // Will be set by PocketBase
        currentSampleSize: 0,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }

      const created = await pb.collection('ab_tests').create(testConfig)
      console.log('🧪 Created A/B test:', created.id)
      
      return created as unknown as ABTestConfig

    } catch (error) {
      console.error('❌ Error creating A/B test:', error)
      return null
    }
  }

  /**
   * Get active A/B test for a message type
   */
  const getActiveABTest = async (messageType: string): Promise<ABTestConfig | null> => {
    try {
      const test = await pb.collection('ab_tests').getFirstListItem(
        `message_type = "${messageType}" && status = "active"`
      )

      return test as unknown as ABTestConfig

    } catch (error) {
      if ((error as any).status === 404) {
        return null // No active test found
      }
      console.error('❌ Error getting active A/B test:', error)
      return null
    }
  }

  /**
   * Assign user to A/B test variant
   */
  const assignToABTestVariant = async (userId: string, testConfig: ABTestConfig): Promise<string> => {
    try {
      // Use user ID hash to ensure consistent assignment
      const userHash = hashUserId(userId)
      const totalWeight = testConfig.trafficSplit.reduce((sum, weight) => sum + weight, 0)
      const userBucket = userHash % totalWeight

      let currentWeight = 0
      for (let i = 0; i < testConfig.variants.length; i++) {
        currentWeight += testConfig.trafficSplit[i]
        if (userBucket < currentWeight) {
          return testConfig.variants[i].id
        }
      }

      // Fallback to first variant
      return testConfig.variants[0].id

    } catch (error) {
      console.error('❌ Error assigning to A/B test variant:', error)
      return testConfig.variants[0].id
    }
  }

  /**
   * Simple hash function for consistent user assignment
   */
  const hashUserId = (userId: string): number => {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Generate optimized message using A/B testing and engagement patterns
   */
  const generateOptimizedMessage = async (options: {
    userId: string
    sessionId?: string
    messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    customContext?: Record<string, any>
  }): Promise<GeneratedMessage | null> => {
    try {
      // Check for active A/B test
      const activeTest = await getActiveABTest(options.messageType)
      
      if (activeTest) {
        // User is part of A/B test
        const variantId = await assignToABTestVariant(options.userId, activeTest)
        const variant = activeTest.variants.find(v => v.id === variantId)
        
        if (variant) {
          // Generate message using specific template from A/B test
          const message = await messageGenerator.generatePersonalizedMessage({
            ...options,
            customContext: {
              ...options.customContext,
              ab_test_id: activeTest.id,
              ab_test_variant: variantId
            }
          })

          if (message) {
            // Track A/B test assignment
            await trackEngagementMetrics({
              userId: options.userId,
              templateId: variant.templateId,
              messageType: options.messageType,
              deliveryTime: new Date().toISOString(),
              timeOfDay: getCurrentTimeOfDay(),
              dayOfWeek: getCurrentDayOfWeek(),
              isWeekend: isWeekend(),
              delivered: true,
              deliveredAt: new Date().toISOString(),
              userEngagementScore: message.contextData.engagementPatterns.engagementScore,
              sessionFrequency: message.contextData.engagementPatterns.sessionFrequency,
              personalizationScore: message.personalizationScore,
              testGroup: activeTest.id,
              testVariant: variantId
            })

            // Update A/B test metrics
            await updateABTestMetrics(activeTest.id, variantId, 'sent')
          }

          return message
        }
      }

      // No A/B test active, use engagement-based optimization
      const recommendation = await analyzeUserEngagementPatterns(options.userId)
      
      if (recommendation) {
        // Apply optimization recommendations
        const optimizedOptions = {
          ...options,
          customContext: {
            ...options.customContext,
            optimization_applied: true,
            recommended_time: recommendation.recommendedTimeOfDay,
            recommended_personalization: recommendation.recommendedPersonalizationLevel
          }
        }

        const message = await messageGenerator.generatePersonalizedMessage(optimizedOptions)
        
        if (message) {
          // Track engagement metrics
          await trackEngagementMetrics({
            userId: options.userId,
            templateId: message.template.id,
            messageType: options.messageType,
            deliveryTime: new Date().toISOString(),
            timeOfDay: getCurrentTimeOfDay(),
            dayOfWeek: getCurrentDayOfWeek(),
            isWeekend: isWeekend(),
            delivered: true,
            deliveredAt: new Date().toISOString(),
            userEngagementScore: message.contextData.engagementPatterns.engagementScore,
            sessionFrequency: message.contextData.engagementPatterns.sessionFrequency,
            personalizationScore: message.personalizationScore
          })
        }

        return message
      }

      // Fallback to standard message generation
      return await messageGenerator.generatePersonalizedMessage(options)

    } catch (error) {
      console.error('❌ Error generating optimized message:', error)
      return null
    }
  }

  /**
   * Update A/B test metrics
   */
  const updateABTestMetrics = async (testId: string, variantId: string, action: 'sent' | 'delivered' | 'opened' | 'clicked'): Promise<boolean> => {
    try {
      const test = await pb.collection('ab_tests').getOne<ABTestConfig>(testId)
      const variant = test.variants.find(v => v.id === variantId)
      
      if (!variant) {
        throw new Error('Variant not found')
      }

      // Update variant metrics
      variant.metrics[action]++
      
      // Recalculate rates
      if (variant.metrics.sent > 0) {
        variant.metrics.deliveryRate = variant.metrics.delivered / variant.metrics.sent
        variant.metrics.openRate = variant.metrics.opened / variant.metrics.sent
        variant.metrics.clickRate = variant.metrics.clicked / variant.metrics.sent
      }

      // Update test
      await pb.collection('ab_tests').update(testId, {
        variants: test.variants,
        current_sample_size: test.currentSampleSize + (action === 'sent' ? 1 : 0),
        updated: new Date().toISOString()
      })

      console.log(`📊 Updated A/B test metrics: ${testId} - ${variantId} - ${action}`)
      return true

    } catch (error) {
      console.error('❌ Error updating A/B test metrics:', error)
      return false
    }
  }

  /**
   * Analyze A/B test results
   */
  const analyzeABTestResults = async (testId: string): Promise<ABTestResult | null> => {
    try {
      const test = await pb.collection('ab_tests').getOne<ABTestConfig>(testId)
      
      if (test.variants.length < 2) {
        throw new Error('Need at least 2 variants for analysis')
      }

      // Find winning variant (highest click rate)
      let winningVariant = test.variants[0]
      let bestRate = winningVariant.metrics.clickRate
      
      test.variants.forEach(variant => {
        if (variant.metrics.clickRate > bestRate) {
          bestRate = variant.metrics.clickRate
          winningVariant = variant
        }
      })

      // Calculate improvement
      const controlVariant = test.variants[0] // Assume first variant is control
      const improvement = controlVariant.id === winningVariant.id ? 0 : 
        ((winningVariant.metrics.clickRate - controlVariant.metrics.clickRate) / controlVariant.metrics.clickRate) * 100

      // Simple significance test (would need proper statistical test in production)
      const significance = test.currentSampleSize >= test.targetSampleSize && improvement > 10

      // Build metrics object
      const metrics: { [variantId: string]: any } = {}
      test.variants.forEach(variant => {
        metrics[variant.id] = variant.metrics
      })

      // Determine recommendation
      let recommendation: 'continue' | 'stop' | 'extend' = 'continue'
      if (significance && improvement > 20) {
        recommendation = 'stop' // Clear winner
      } else if (test.currentSampleSize >= test.targetSampleSize * 2) {
        recommendation = 'stop' // Enough data collected
      } else if (improvement < 5 && test.currentSampleSize >= test.targetSampleSize) {
        recommendation = 'stop' // No significant improvement
      }

      const result: ABTestResult = {
        testId,
        winningVariant: winningVariant.id,
        confidence: significance ? test.confidenceLevel : Math.min(test.confidenceLevel, 50),
        improvement,
        metrics,
        recommendation,
        significance
      }

      return result

    } catch (error) {
      console.error('❌ Error analyzing A/B test results:', error)
      return null
    }
  }

  /**
   * Get current time of day
   */
  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }

  /**
   * Get current day of week in Persian
   */
  const getCurrentDayOfWeek = (): string => {
    const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه']
    return days[new Date().getDay()]
  }

  /**
   * Check if current day is weekend
   */
  const isWeekend = (): boolean => {
    const day = new Date().getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  return {
    // Engagement tracking
    trackEngagementMetrics,
    analyzeUserEngagementPatterns,
    
    // A/B testing
    createABTest,
    getActiveABTest,
    assignToABTestVariant,
    updateABTestMetrics,
    analyzeABTestResults,
    
    // Optimized message generation
    generateOptimizedMessage,
    
    // Utilities
    getCurrentTimeOfDay,
    getCurrentDayOfWeek,
    isWeekend
  }
}