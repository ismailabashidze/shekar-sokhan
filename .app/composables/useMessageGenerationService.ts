import type PocketBase from 'pocketbase'
import type { GeneratedMessage } from './useMessageGenerator'

// Main service interface for message generation
interface MessageGenerationRequest {
  userId: string
  sessionId?: string
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  language?: 'fa' | 'en'
  customContext?: Record<string, any>
  
  // Generation options
  useOptimization?: boolean // Use engagement-based optimization
  useVariation?: boolean // Use variation system to avoid repetition
  generateMultiple?: boolean // Generate multiple variations
  variationCount?: number // Number of variations to generate
}

interface MessageGenerationResult {
  success: boolean
  message?: GeneratedMessage
  messages?: GeneratedMessage[] // For multiple variations
  error?: string
  metadata: {
    generationMethod: 'standard' | 'optimized' | 'varied' | 'multiple'
    processingTime: number
    optimizationApplied: boolean
    variationApplied: boolean
    abTestActive: boolean
    recommendations?: any
  }
}

/**
 * Main message generation service that orchestrates all message generation components
 * This is the primary interface for generating AI-powered personalized messages
 */
export const useMessageGenerationService = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  // Import all message generation components
  const messageGenerator = useMessageGenerator()
  const engagementOptimizer = useEngagementOptimizer()
  const variationSystem = useMessageVariationSystem()

  /**
   * Generate a personalized message using the full AI-powered system
   * This is the main entry point for message generation
   */
  const generateMessage = async (request: MessageGenerationRequest): Promise<MessageGenerationResult> => {
    const startTime = Date.now()
    
    try {
      console.log('🤖 Starting AI-powered message generation for user:', request.userId)

      // Validate request
      if (!request.userId || !request.messageType) {
        throw new Error('User ID and message type are required')
      }

      let result: MessageGenerationResult = {
        success: false,
        metadata: {
          generationMethod: 'standard',
          processingTime: 0,
          optimizationApplied: false,
          variationApplied: false,
          abTestActive: false
        }
      }

      // Check if we should generate multiple variations
      if (request.generateMultiple) {
        result = await generateMultipleVariations(request, startTime)
      }
      // Check if we should use optimization (A/B testing + engagement patterns)
      else if (request.useOptimization !== false) { // Default to true
        result = await generateOptimizedMessage(request, startTime)
      }
      // Check if we should use variation system
      else if (request.useVariation !== false) { // Default to true
        result = await generateVariedMessage(request, startTime)
      }
      // Fallback to standard generation
      else {
        result = await generateStandardMessage(request, startTime)
      }

      // Track generation metrics
      await trackGenerationMetrics(request, result)

      console.log(`✅ Message generation completed in ${result.metadata.processingTime}ms`)
      return result

    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ Error in message generation service:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          generationMethod: 'error',
          processingTime,
          optimizationApplied: false,
          variationApplied: false,
          abTestActive: false
        }
      }
    }
  }

  /**
   * Generate optimized message using engagement patterns and A/B testing
   */
  const generateOptimizedMessage = async (
    request: MessageGenerationRequest,
    startTime: number
  ): Promise<MessageGenerationResult> => {
    try {
      // Check for active A/B test
      const activeTest = await engagementOptimizer.getActiveABTest(request.messageType)
      
      // Generate optimized message
      const message = await engagementOptimizer.generateOptimizedMessage({
        userId: request.userId,
        sessionId: request.sessionId,
        messageType: request.messageType,
        priority: request.priority,
        customContext: request.customContext
      })

      if (!message) {
        throw new Error('Failed to generate optimized message')
      }

      return {
        success: true,
        message,
        metadata: {
          generationMethod: 'optimized',
          processingTime: Date.now() - startTime,
          optimizationApplied: true,
          variationApplied: false,
          abTestActive: !!activeTest
        }
      }

    } catch (error) {
      console.error('❌ Error generating optimized message, falling back to varied message:', error)
      return await generateVariedMessage(request, startTime)
    }
  }

  /**
   * Generate message using variation system to avoid repetition
   */
  const generateVariedMessage = async (
    request: MessageGenerationRequest,
    startTime: number
  ): Promise<MessageGenerationResult> => {
    try {
      const message = await variationSystem.generateVariedMessage({
        userId: request.userId,
        sessionId: request.sessionId,
        messageType: request.messageType,
        priority: request.priority,
        language: request.language,
        customContext: request.customContext
      })

      if (!message) {
        throw new Error('Failed to generate varied message')
      }

      return {
        success: true,
        message,
        metadata: {
          generationMethod: 'varied',
          processingTime: Date.now() - startTime,
          optimizationApplied: false,
          variationApplied: true,
          abTestActive: false
        }
      }

    } catch (error) {
      console.error('❌ Error generating varied message, falling back to standard generation:', error)
      return await generateStandardMessage(request, startTime)
    }
  }

  /**
   * Generate multiple message variations
   */
  const generateMultipleVariations = async (
    request: MessageGenerationRequest,
    startTime: number
  ): Promise<MessageGenerationResult> => {
    try {
      const count = request.variationCount || 3
      
      const messages = await messageGenerator.generateMessageVariations({
        userId: request.userId,
        sessionId: request.sessionId,
        messageType: request.messageType,
        priority: request.priority,
        customContext: request.customContext
      }, count)

      if (messages.length === 0) {
        throw new Error('Failed to generate message variations')
      }

      return {
        success: true,
        messages,
        metadata: {
          generationMethod: 'multiple',
          processingTime: Date.now() - startTime,
          optimizationApplied: false,
          variationApplied: true,
          abTestActive: false
        }
      }

    } catch (error) {
      console.error('❌ Error generating multiple variations, falling back to single message:', error)
      return await generateStandardMessage(request, startTime)
    }
  }

  /**
   * Generate standard personalized message
   */
  const generateStandardMessage = async (
    request: MessageGenerationRequest,
    startTime: number
  ): Promise<MessageGenerationResult> => {
    try {
      const message = await messageGenerator.generatePersonalizedMessage({
        userId: request.userId,
        sessionId: request.sessionId,
        messageType: request.messageType,
        priority: request.priority,
        customContext: request.customContext,
        language: request.language
      })

      if (!message) {
        throw new Error('Failed to generate standard message')
      }

      return {
        success: true,
        message,
        metadata: {
          generationMethod: 'standard',
          processingTime: Date.now() - startTime,
          optimizationApplied: false,
          variationApplied: false,
          abTestActive: false
        }
      }

    } catch (error) {
      throw new Error(`Standard message generation failed: ${error}`)
    }
  }

  /**
   * Get message generation recommendations for a user
   */
  const getGenerationRecommendations = async (userId: string): Promise<{
    recommendedType: MessageGenerationRequest['messageType']
    recommendedPriority: MessageGenerationRequest['priority']
    recommendedTiming: 'immediate' | 'delayed' | 'scheduled'
    useOptimization: boolean
    useVariation: boolean
    reasoning: string[]
  }> => {
    try {
      // Get recommendations from message generator
      const messageRecs = await messageGenerator.getMessageRecommendations(userId)
      
      // Get engagement patterns
      const engagementRecs = await engagementOptimizer.analyzeUserEngagementPatterns(userId)
      
      // Get variation stats
      const variationStats = await variationSystem.getVariationStats(userId)

      const reasoning: string[] = [messageRecs.reasoning]

      // Determine if optimization should be used
      const useOptimization = engagementRecs ? engagementRecs.confidence > 60 : false
      if (useOptimization) {
        reasoning.push('استفاده از بهینه‌سازی بر اساس الگوهای تعامل کاربر')
      }

      // Determine if variation should be used
      const useVariation = variationStats.repetitionRate > 0.3 // If repetition rate > 30%
      if (useVariation) {
        reasoning.push('استفاده از سیستم تنوع برای جلوگیری از تکرار')
      }

      return {
        recommendedType: messageRecs.recommendedType,
        recommendedPriority: messageRecs.recommendedPriority,
        recommendedTiming: messageRecs.recommendedTiming,
        useOptimization,
        useVariation,
        reasoning
      }

    } catch (error) {
      console.error('❌ Error getting generation recommendations:', error)
      return {
        recommendedType: 'reminder',
        recommendedPriority: 'medium',
        recommendedTiming: 'delayed',
        useOptimization: false,
        useVariation: true,
        reasoning: ['پیشنهاد پیش‌فرض به دلیل خطا در سیستم']
      }
    }
  }

  /**
   * Track message generation metrics for analytics
   */
  const trackGenerationMetrics = async (
    request: MessageGenerationRequest,
    result: MessageGenerationResult
  ): Promise<void> => {
    try {
      await pb.collection('generation_metrics').create({
        user_id: request.userId,
        message_type: request.messageType,
        generation_method: result.metadata.generationMethod,
        processing_time: result.metadata.processingTime,
        success: result.success,
        optimization_applied: result.metadata.optimizationApplied,
        variation_applied: result.metadata.variationApplied,
        ab_test_active: result.metadata.abTestActive,
        personalization_score: result.message?.personalizationScore || 0,
        created: new Date().toISOString()
      }).catch(() => {
        // Ignore errors if collection doesn't exist
        console.debug('Generation metrics collection not available')
      })

    } catch (error) {
      console.debug('Could not track generation metrics:', error)
    }
  }

  /**
   * Get generation analytics for admin dashboard
   */
  const getGenerationAnalytics = async (days: number = 30): Promise<{
    totalGenerations: number
    successRate: number
    averageProcessingTime: number
    methodBreakdown: { [method: string]: number }
    averagePersonalizationScore: number
    optimizationUsage: number
    variationUsage: number
  }> => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const metrics = await pb.collection('generation_metrics').getList(1, 10000, {
        filter: `created >= "${startDate.toISOString()}"`,
        sort: '-created'
      })

      if (metrics.items.length === 0) {
        return {
          totalGenerations: 0,
          successRate: 0,
          averageProcessingTime: 0,
          methodBreakdown: {},
          averagePersonalizationScore: 0,
          optimizationUsage: 0,
          variationUsage: 0
        }
      }

      const successful = metrics.items.filter((m: any) => m.success)
      const successRate = (successful.length / metrics.items.length) * 100

      const totalProcessingTime = metrics.items.reduce((sum: number, m: any) => sum + (m.processing_time || 0), 0)
      const averageProcessingTime = totalProcessingTime / metrics.items.length

      const methodBreakdown: { [method: string]: number } = {}
      metrics.items.forEach((m: any) => {
        methodBreakdown[m.generation_method] = (methodBreakdown[m.generation_method] || 0) + 1
      })

      const totalPersonalizationScore = successful.reduce((sum: number, m: any) => sum + (m.personalization_score || 0), 0)
      const averagePersonalizationScore = successful.length > 0 ? totalPersonalizationScore / successful.length : 0

      const optimizationUsage = (metrics.items.filter((m: any) => m.optimization_applied).length / metrics.items.length) * 100
      const variationUsage = (metrics.items.filter((m: any) => m.variation_applied).length / metrics.items.length) * 100

      return {
        totalGenerations: metrics.items.length,
        successRate: Math.round(successRate * 10) / 10,
        averageProcessingTime: Math.round(averageProcessingTime),
        methodBreakdown,
        averagePersonalizationScore: Math.round(averagePersonalizationScore),
        optimizationUsage: Math.round(optimizationUsage * 10) / 10,
        variationUsage: Math.round(variationUsage * 10) / 10
      }

    } catch (error) {
      console.error('❌ Error getting generation analytics:', error)
      return {
        totalGenerations: 0,
        successRate: 0,
        averageProcessingTime: 0,
        methodBreakdown: {},
        averagePersonalizationScore: 0,
        optimizationUsage: 0,
        variationUsage: 0
      }
    }
  }

  /**
   * Test message generation with different configurations
   */
  const testMessageGeneration = async (userId: string, messageType: string): Promise<{
    standard: GeneratedMessage | null
    optimized: GeneratedMessage | null
    varied: GeneratedMessage | null
    multiple: GeneratedMessage[]
  }> => {
    try {
      console.log('🧪 Testing message generation with different configurations')

      const [standard, optimized, varied, multiple] = await Promise.all([
        // Standard generation
        generateMessage({
          userId,
          messageType: messageType as any,
          useOptimization: false,
          useVariation: false
        }),

        // Optimized generation
        generateMessage({
          userId,
          messageType: messageType as any,
          useOptimization: true,
          useVariation: false
        }),

        // Varied generation
        generateMessage({
          userId,
          messageType: messageType as any,
          useOptimization: false,
          useVariation: true
        }),

        // Multiple variations
        generateMessage({
          userId,
          messageType: messageType as any,
          generateMultiple: true,
          variationCount: 3
        })
      ])

      return {
        standard: standard.message || null,
        optimized: optimized.message || null,
        varied: varied.message || null,
        multiple: multiple.messages || []
      }

    } catch (error) {
      console.error('❌ Error testing message generation:', error)
      return {
        standard: null,
        optimized: null,
        varied: null,
        multiple: []
      }
    }
  }

  return {
    // Main generation function
    generateMessage,
    
    // Specific generation methods
    generateOptimizedMessage,
    generateVariedMessage,
    generateMultipleVariations,
    generateStandardMessage,
    
    // Recommendations and analytics
    getGenerationRecommendations,
    getGenerationAnalytics,
    
    // Testing and utilities
    testMessageGeneration,
    trackGenerationMetrics
  }
}