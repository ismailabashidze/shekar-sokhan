import type PocketBase from 'pocketbase'
import type { MessageTemplate } from './useTemplateEngine'
import type { GeneratedMessage } from './useMessageGenerator'

// Types for message variation system
interface MessageHistory {
  id: string
  userId: string
  templateId: string
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  sentAt: string
  templateVariation?: string
  contentHash?: string // Hash of the rendered content to detect duplicates
}

interface VariationRule {
  id: string
  name: string
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  minIntervalHours: number // Minimum hours between similar messages
  maxRepetitions: number // Max times same template can be used
  variationStrategy: 'template_rotation' | 'content_variation' | 'timing_variation' | 'hybrid'
  isActive: boolean
}

interface TemplatePool {
  messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
  templates: MessageTemplate[]
  usageHistory: { [templateId: string]: number }
  lastUsed: { [templateId: string]: string }
}

interface ContentVariation {
  baseTemplate: MessageTemplate
  variations: {
    greeting: string[]
    motivational: string[]
    callToAction: string[]
    closing: string[]
  }
}

interface VariationSelection {
  selectedTemplate: MessageTemplate
  variationApplied: boolean
  variationType: 'template' | 'content' | 'timing' | 'none'
  reasoning: string
  avoidanceReason?: string
}

export const useMessageVariationSystem = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  const templateEngine = useTemplateEngine()
  const messageGenerator = useMessageGenerator()

  /**
   * Get message history for a user to avoid repetition
   */
  const getMessageHistory = async (userId: string, days: number = 30): Promise<MessageHistory[]> => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const history = await pb.collection('message_history').getList(1, 1000, {
        filter: `user_id = "${userId}" && sent_at >= "${startDate.toISOString()}"`,
        sort: '-sent_at'
      })

      return history.items as unknown as MessageHistory[]

    } catch (error) {
      console.error('❌ Error getting message history:', error)
      return []
    }
  }

  /**
   * Record message in history to track usage
   */
  const recordMessageHistory = async (
    userId: string,
    templateId: string,
    messageType: string,
    renderedContent: string,
    variation?: string
  ): Promise<boolean> => {
    try {
      const contentHash = generateContentHash(renderedContent)

      await pb.collection('message_history').create({
        user_id: userId,
        template_id: templateId,
        message_type: messageType,
        sent_at: new Date().toISOString(),
        template_variation: variation,
        content_hash: contentHash
      })

      console.log('📝 Recorded message history for user:', userId)
      return true

    } catch (error) {
      console.error('❌ Error recording message history:', error)
      return false
    }
  }

  /**
   * Generate simple hash for content comparison
   */
  const generateContentHash = (content: string): string => {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Get variation rules for a message type
   */
  const getVariationRules = async (messageType: string): Promise<VariationRule | null> => {
    try {
      const rule = await pb.collection('variation_rules').getFirstListItem(
        `message_type = "${messageType}" && is_active = true`
      )

      return rule as unknown as VariationRule

    } catch (error) {
      if ((error as any).status === 404) {
        // Return default rules if none found
        return {
          id: 'default',
          name: 'Default Variation Rule',
          messageType: messageType as any,
          minIntervalHours: 24,
          maxRepetitions: 2,
          variationStrategy: 'template_rotation',
          isActive: true
        }
      }
      console.error('❌ Error getting variation rules:', error)
      return null
    }
  }

  /**
   * Build template pool for a message type
   */
  const buildTemplatePool = async (
    messageType: string,
    language: 'fa' | 'en' = 'fa',
    userId?: string
  ): Promise<TemplatePool> => {
    try {
      // Get all active templates for this message type
      const templates = await templateEngine.getTemplates({
        category: 'session', // Assuming session category for now
        language,
        isActive: true
      })

      // Filter templates that could be used for this message type
      // (In a real implementation, you might have a field linking templates to message types)
      const relevantTemplates = templates.filter(template => 
        template.name.toLowerCase().includes(messageType.toLowerCase()) ||
        template.description?.toLowerCase().includes(messageType.toLowerCase())
      )

      // If no specific templates found, use all session templates
      const finalTemplates = relevantTemplates.length > 0 ? relevantTemplates : templates

      // Build usage history if user provided
      const usageHistory: { [templateId: string]: number } = {}
      const lastUsed: { [templateId: string]: string } = {}

      if (userId) {
        const history = await getMessageHistory(userId, 30)
        
        history.forEach(record => {
          usageHistory[record.templateId] = (usageHistory[record.templateId] || 0) + 1
          if (!lastUsed[record.templateId] || record.sentAt > lastUsed[record.templateId]) {
            lastUsed[record.templateId] = record.sentAt
          }
        })
      }

      return {
        messageType: messageType as any,
        templates: finalTemplates,
        usageHistory,
        lastUsed
      }

    } catch (error) {
      console.error('❌ Error building template pool:', error)
      return {
        messageType: messageType as any,
        templates: [],
        usageHistory: {},
        lastUsed: {}
      }
    }
  }

  /**
   * Select best template variation to avoid repetition
   */
  const selectTemplateVariation = async (
    userId: string,
    messageType: string,
    language: 'fa' | 'en' = 'fa'
  ): Promise<VariationSelection> => {
    try {
      // Get variation rules
      const rules = await getVariationRules(messageType)
      if (!rules) {
        throw new Error('No variation rules found')
      }

      // Build template pool
      const pool = await buildTemplatePool(messageType, language, userId)
      if (pool.templates.length === 0) {
        throw new Error('No templates available')
      }

      // Get recent message history
      const recentHistory = await getMessageHistory(userId, 7) // Last 7 days
      
      // Apply variation strategy
      const selection = await applyVariationStrategy(pool, rules, recentHistory)
      
      return selection

    } catch (error) {
      console.error('❌ Error selecting template variation:', error)
      
      // Fallback selection
      const fallbackTemplates = await templateEngine.getTemplates({
        category: 'session',
        language,
        isActive: true
      })

      return {
        selectedTemplate: fallbackTemplates[0],
        variationApplied: false,
        variationType: 'none',
        reasoning: 'Fallback selection due to error',
        avoidanceReason: `Error in variation system: ${error}`
      }
    }
  }

  /**
   * Apply variation strategy based on rules and history
   */
  const applyVariationStrategy = async (
    pool: TemplatePool,
    rules: VariationRule,
    recentHistory: MessageHistory[]
  ): Promise<VariationSelection> => {
    const now = new Date()
    
    // Filter out templates that violate rules
    const availableTemplates = pool.templates.filter(template => {
      const usageCount = pool.usageHistory[template.id] || 0
      const lastUsedStr = pool.lastUsed[template.id]
      
      // Check max repetitions
      if (usageCount >= rules.maxRepetitions) {
        return false
      }
      
      // Check minimum interval
      if (lastUsedStr) {
        const lastUsed = new Date(lastUsedStr)
        const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60)
        if (hoursSinceLastUse < rules.minIntervalHours) {
          return false
        }
      }
      
      return true
    })

    if (availableTemplates.length === 0) {
      // All templates are overused or too recent, select least recently used
      const sortedByLastUse = pool.templates.sort((a, b) => {
        const aLastUsed = pool.lastUsed[a.id] ? new Date(pool.lastUsed[a.id]).getTime() : 0
        const bLastUsed = pool.lastUsed[b.id] ? new Date(pool.lastUsed[b.id]).getTime() : 0
        return aLastUsed - bLastUsed
      })

      return {
        selectedTemplate: sortedByLastUse[0],
        variationApplied: true,
        variationType: 'template',
        reasoning: 'Selected least recently used template (all templates overused)',
        avoidanceReason: 'All templates exceeded usage limits or minimum interval'
      }
    }

    // Apply strategy-specific selection
    let selectedTemplate: MessageTemplate
    let reasoning: string

    switch (rules.variationStrategy) {
      case 'template_rotation':
        // Select template with lowest usage count
        selectedTemplate = availableTemplates.reduce((prev, current) => {
          const prevUsage = pool.usageHistory[prev.id] || 0
          const currentUsage = pool.usageHistory[current.id] || 0
          return currentUsage < prevUsage ? current : prev
        })
        reasoning = 'Template rotation: selected least used template'
        break

      case 'content_variation':
        // Select template and apply content variations
        selectedTemplate = availableTemplates[0] // Use first available
        selectedTemplate = await applyContentVariations(selectedTemplate, recentHistory)
        reasoning = 'Content variation: modified template content to avoid repetition'
        break

      case 'timing_variation':
        // Select based on time-based factors
        selectedTemplate = selectByTimingFactors(availableTemplates, now)
        reasoning = 'Timing variation: selected template based on time factors'
        break

      case 'hybrid':
        // Combine multiple strategies
        selectedTemplate = availableTemplates.reduce((prev, current) => {
          const prevScore = calculateTemplateScore(prev, pool, now)
          const currentScore = calculateTemplateScore(current, pool, now)
          return currentScore > prevScore ? current : prev
        })
        reasoning = 'Hybrid strategy: selected template with highest variation score'
        break

      default:
        selectedTemplate = availableTemplates[0]
        reasoning = 'Default selection: first available template'
    }

    return {
      selectedTemplate,
      variationApplied: true,
      variationType: 'template',
      reasoning
    }
  }

  /**
   * Apply content variations to a template
   */
  const applyContentVariations = async (
    template: MessageTemplate,
    recentHistory: MessageHistory[]
  ): Promise<MessageTemplate> => {
    try {
      // Get content variations for this template
      const variations = await getContentVariations(template.id)
      if (!variations) {
        return template
      }

      // Create a modified copy of the template
      const modifiedTemplate = { ...template }

      // Apply variations to avoid recent content
      const recentHashes = recentHistory.map(h => h.contentHash).filter(Boolean)
      
      // Try different variation combinations until we find one that's different
      for (let attempt = 0; attempt < 5; attempt++) {
        const variedTemplate = applyRandomVariations(modifiedTemplate, variations)
        
        // Test if this variation would produce different content
        const testContext = await templateEngine.generateSampleContext(variedTemplate)
        const testRender = templateEngine.renderTemplate({
          template: variedTemplate,
          context: testContext,
          strictMode: false
        })
        
        const testHash = generateContentHash(testRender.title + testRender.body)
        
        if (!recentHashes.includes(testHash)) {
          return variedTemplate
        }
      }

      return modifiedTemplate

    } catch (error) {
      console.error('❌ Error applying content variations:', error)
      return template
    }
  }

  /**
   * Get content variations for a template
   */
  const getContentVariations = async (templateId: string): Promise<ContentVariation | null> => {
    try {
      const variations = await pb.collection('content_variations').getFirstListItem(
        `template_id = "${templateId}"`
      )

      return variations as unknown as ContentVariation

    } catch (error) {
      if ((error as any).status === 404) {
        // Return default variations
        return {
          baseTemplate: {} as MessageTemplate,
          variations: {
            greeting: ['سلام', 'درود', 'احوال شما چطور است؟'],
            motivational: ['شما در مسیر درست هستید', 'پیشرفت شما عالی است', 'ادامه دهید'],
            callToAction: ['بیایید ادامه دهیم', 'آماده جلسه بعدی هستید؟', 'وقت شروع است'],
            closing: ['موفق باشید', 'منتظر دیدار شما هستیم', 'تا بعد']
          }
        }
      }
      return null
    }
  }

  /**
   * Apply random variations to template content
   */
  const applyRandomVariations = (template: MessageTemplate, variations: ContentVariation): MessageTemplate => {
    const modifiedTemplate = { ...template }

    // Replace placeholders with random variations
    const replaceVariations = (text: string): string => {
      return text
        .replace(/\{\{greeting\}\}/g, getRandomItem(variations.variations.greeting))
        .replace(/\{\{motivational\}\}/g, getRandomItem(variations.variations.motivational))
        .replace(/\{\{call_to_action\}\}/g, getRandomItem(variations.variations.callToAction))
        .replace(/\{\{closing\}\}/g, getRandomItem(variations.variations.closing))
    }

    modifiedTemplate.title_template = replaceVariations(modifiedTemplate.title_template)
    modifiedTemplate.body_template = replaceVariations(modifiedTemplate.body_template)
    
    if (modifiedTemplate.action_text_template) {
      modifiedTemplate.action_text_template = replaceVariations(modifiedTemplate.action_text_template)
    }

    return modifiedTemplate
  }

  /**
   * Get random item from array
   */
  const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Select template based on timing factors
   */
  const selectByTimingFactors = (templates: MessageTemplate[], currentTime: Date): MessageTemplate => {
    const hour = currentTime.getHours()
    const dayOfWeek = currentTime.getDay()

    // Simple timing-based selection (could be more sophisticated)
    // Morning templates for morning hours, etc.
    const morningTemplates = templates.filter(t => 
      t.name.toLowerCase().includes('morning') || 
      t.name.toLowerCase().includes('صبح')
    )
    
    const eveningTemplates = templates.filter(t => 
      t.name.toLowerCase().includes('evening') || 
      t.name.toLowerCase().includes('عصر') ||
      t.name.toLowerCase().includes('شب')
    )

    if (hour >= 6 && hour < 12 && morningTemplates.length > 0) {
      return getRandomItem(morningTemplates)
    } else if (hour >= 18 && hour < 22 && eveningTemplates.length > 0) {
      return getRandomItem(eveningTemplates)
    }

    // Default to random selection
    return getRandomItem(templates)
  }

  /**
   * Calculate template score for hybrid strategy
   */
  const calculateTemplateScore = (template: MessageTemplate, pool: TemplatePool, currentTime: Date): number => {
    let score = 100 // Base score

    // Reduce score based on usage frequency
    const usageCount = pool.usageHistory[template.id] || 0
    score -= usageCount * 20

    // Reduce score based on recency
    const lastUsedStr = pool.lastUsed[template.id]
    if (lastUsedStr) {
      const lastUsed = new Date(lastUsedStr)
      const hoursSinceLastUse = (currentTime.getTime() - lastUsed.getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastUse < 48) {
        score -= (48 - hoursSinceLastUse) * 2
      }
    }

    // Bonus for time-appropriate templates
    const hour = currentTime.getHours()
    if ((hour >= 6 && hour < 12 && template.name.toLowerCase().includes('morning')) ||
        (hour >= 18 && hour < 22 && template.name.toLowerCase().includes('evening'))) {
      score += 10
    }

    return Math.max(0, score)
  }

  /**
   * Generate message with variation system
   */
  const generateVariedMessage = async (options: {
    userId: string
    sessionId?: string
    messageType: 'session_complete' | 'follow_up' | 'encouragement' | 'reminder' | 'milestone'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    language?: 'fa' | 'en'
    customContext?: Record<string, any>
  }): Promise<GeneratedMessage | null> => {
    try {
      const language = options.language || 'fa'

      // Select varied template
      const selection = await selectTemplateVariation(options.userId, options.messageType, language)
      
      // Generate message using selected template
      const context = await messageGenerator.buildPersonalizationContext(options.userId, options.sessionId)
      if (!context) {
        throw new Error('Could not build personalization context')
      }

      const templateContext = await messageGenerator.createPersonalizedTemplateContext(context, options)
      
      const renderedMessage = templateEngine.renderTemplate({
        template: selection.selectedTemplate,
        context: templateContext,
        strictMode: false
      })

      const personalizationScore = messageGenerator.calculatePersonalizationScore(
        context,
        selection.selectedTemplate,
        options
      )

      const generatedMessage: GeneratedMessage = {
        template: selection.selectedTemplate,
        renderedMessage,
        personalizationScore,
        contextData: context,
        generatedAt: new Date().toISOString()
      }

      // Record in message history
      await recordMessageHistory(
        options.userId,
        selection.selectedTemplate.id,
        options.messageType,
        renderedMessage.title + ' ' + renderedMessage.body,
        selection.variationType
      )

      console.log(`✅ Generated varied message: ${selection.reasoning}`)
      return generatedMessage

    } catch (error) {
      console.error('❌ Error generating varied message:', error)
      return null
    }
  }

  /**
   * Get variation statistics for a user
   */
  const getVariationStats = async (userId: string, days: number = 30): Promise<{
    totalMessages: number
    uniqueTemplates: number
    repetitionRate: number
    averageInterval: number
    variationEffectiveness: number
  }> => {
    try {
      const history = await getMessageHistory(userId, days)
      
      if (history.length === 0) {
        return {
          totalMessages: 0,
          uniqueTemplates: 0,
          repetitionRate: 0,
          averageInterval: 0,
          variationEffectiveness: 0
        }
      }

      const uniqueTemplates = new Set(history.map(h => h.templateId)).size
      const repetitionRate = (history.length - uniqueTemplates) / history.length
      
      // Calculate average interval between messages
      let totalInterval = 0
      for (let i = 1; i < history.length; i++) {
        const current = new Date(history[i-1].sentAt)
        const previous = new Date(history[i].sentAt)
        totalInterval += (current.getTime() - previous.getTime()) / (1000 * 60 * 60) // hours
      }
      const averageInterval = history.length > 1 ? totalInterval / (history.length - 1) : 0

      // Calculate variation effectiveness (lower repetition = higher effectiveness)
      const variationEffectiveness = Math.max(0, (1 - repetitionRate) * 100)

      return {
        totalMessages: history.length,
        uniqueTemplates,
        repetitionRate: Math.round(repetitionRate * 100) / 100,
        averageInterval: Math.round(averageInterval * 10) / 10,
        variationEffectiveness: Math.round(variationEffectiveness)
      }

    } catch (error) {
      console.error('❌ Error getting variation stats:', error)
      return {
        totalMessages: 0,
        uniqueTemplates: 0,
        repetitionRate: 0,
        averageInterval: 0,
        variationEffectiveness: 0
      }
    }
  }

  return {
    // Core variation functions
    selectTemplateVariation,
    generateVariedMessage,
    
    // History management
    getMessageHistory,
    recordMessageHistory,
    
    // Template pool management
    buildTemplatePool,
    
    // Content variations
    applyContentVariations,
    getContentVariations,
    
    // Statistics and analytics
    getVariationStats,
    
    // Utilities
    generateContentHash,
    getVariationRules
  }
}