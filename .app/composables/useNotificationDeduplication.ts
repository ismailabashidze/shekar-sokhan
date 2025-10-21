import type PocketBase from 'pocketbase'

// Types for deduplication system
interface DeduplicationKey {
  userId: string
  ruleId?: string
  sessionId?: string
  campaignId?: string
  templateId?: string
  contentHash?: string
}

interface DeduplicationRule {
  type: 'session_based' | 'campaign_based' | 'content_based' | 'time_based'
  windowMinutes: number
  maxOccurrences: number
  keyFields: string[]
}

interface NotificationFingerprint {
  id?: string
  user_id: string
  rule_id?: string
  session_id?: string
  campaign_id?: string
  template_id?: string
  content_hash: string
  fingerprint_key: string
  created_at: string
  expires_at: string
  occurrence_count: number
  metadata?: Record<string, any>
}

export const useNotificationDeduplication = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Default deduplication rules
  const defaultDeduplicationRules: Record<string, DeduplicationRule> = {
    session_complete: {
      type: 'session_based',
      windowMinutes: 60, // 1 hour window
      maxOccurrences: 1,
      keyFields: ['userId', 'sessionId', 'ruleId']
    },
    admin_campaign: {
      type: 'campaign_based',
      windowMinutes: 1440, // 24 hour window
      maxOccurrences: 1,
      keyFields: ['userId', 'campaignId']
    },
    system_event: {
      type: 'content_based',
      windowMinutes: 720, // 12 hour window
      maxOccurrences: 2,
      keyFields: ['userId', 'templateId', 'contentHash']
    },
    user_inactive: {
      type: 'time_based',
      windowMinutes: 2880, // 48 hour window
      maxOccurrences: 1,
      keyFields: ['userId', 'ruleId']
    }
  }

  /**
   * Check if a notification is a duplicate and should be prevented
   */
  const isDuplicateNotification = async (
    key: DeduplicationKey,
    trigger: string = 'session_complete',
    customRule?: DeduplicationRule
  ): Promise<boolean> => {
    try {
      const rule = customRule || defaultDeduplicationRules[trigger] || defaultDeduplicationRules.session_complete
      
      // Generate fingerprint key
      const fingerprintKey = generateFingerprintKey(key, rule)
      
      console.log('🔍 Checking for duplicate notification:', fingerprintKey)

      // Check existing fingerprints
      const existingFingerprints = await pb.collection('notification_fingerprints').getList(1, 10, {
        filter: `fingerprint_key = "${fingerprintKey}" && expires_at > "${new Date().toISOString()}"`,
        sort: '-created'
      })

      if (existingFingerprints.items.length === 0) {
        console.log('✅ No duplicates found, notification allowed')
        return false
      }

      // Check occurrence count
      const totalOccurrences = existingFingerprints.items.reduce(
        (sum: number, fp: any) => sum + (fp.occurrence_count || 1), 
        0
      )

      const isDuplicate = totalOccurrences >= rule.maxOccurrences
      
      if (isDuplicate) {
        console.log(`🚫 Duplicate detected: ${totalOccurrences}/${rule.maxOccurrences} occurrences`)
      } else {
        console.log(`✅ Within limits: ${totalOccurrences}/${rule.maxOccurrences} occurrences`)
      }

      return isDuplicate

    } catch (error) {
      console.error('❌ Error checking for duplicates:', error)
      // On error, allow notification to prevent blocking legitimate notifications
      return false
    }
  }

  /**
   * Record a notification fingerprint to prevent future duplicates
   */
  const recordNotificationFingerprint = async (
    key: DeduplicationKey,
    trigger: string = 'session_complete',
    customRule?: DeduplicationRule
  ): Promise<NotificationFingerprint | null> => {
    try {
      const rule = customRule || defaultDeduplicationRules[trigger] || defaultDeduplicationRules.session_complete
      
      // Generate fingerprint key
      const fingerprintKey = generateFingerprintKey(key, rule)
      
      // Calculate expiration time
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + rule.windowMinutes)

      // Check if fingerprint already exists
      const existingFingerprints = await pb.collection('notification_fingerprints').getList(1, 1, {
        filter: `fingerprint_key = "${fingerprintKey}" && expires_at > "${new Date().toISOString()}"`
      })

      let fingerprint: NotificationFingerprint

      if (existingFingerprints.items.length > 0) {
        // Update existing fingerprint
        const existing = existingFingerprints.items[0] as any
        fingerprint = await pb.collection('notification_fingerprints').update(existing.id, {
          occurrence_count: (existing.occurrence_count || 1) + 1,
          expires_at: expiresAt.toISOString(),
          metadata: {
            ...existing.metadata,
            lastOccurrence: new Date().toISOString(),
            trigger
          }
        }) as NotificationFingerprint
        
        console.log('🔄 Updated existing fingerprint:', fingerprintKey)
      } else {
        // Create new fingerprint
        fingerprint = await pb.collection('notification_fingerprints').create({
          user_id: key.userId,
          rule_id: key.ruleId,
          session_id: key.sessionId,
          campaign_id: key.campaignId,
          template_id: key.templateId,
          content_hash: key.contentHash || '',
          fingerprint_key: fingerprintKey,
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          occurrence_count: 1,
          metadata: {
            trigger,
            rule: rule.type,
            windowMinutes: rule.windowMinutes
          }
        }) as NotificationFingerprint

        console.log('✅ Created new fingerprint:', fingerprintKey)
      }

      return fingerprint

    } catch (error) {
      console.error('❌ Error recording notification fingerprint:', error)
      return null
    }
  }

  /**
   * Generate a unique fingerprint key based on deduplication rule
   */
  const generateFingerprintKey = (
    key: DeduplicationKey,
    rule: DeduplicationRule
  ): string => {
    const keyParts: string[] = []

    rule.keyFields.forEach(field => {
      switch (field) {
        case 'userId':
          keyParts.push(`user:${key.userId}`)
          break
        case 'ruleId':
          if (key.ruleId) keyParts.push(`rule:${key.ruleId}`)
          break
        case 'sessionId':
          if (key.sessionId) keyParts.push(`session:${key.sessionId}`)
          break
        case 'campaignId':
          if (key.campaignId) keyParts.push(`campaign:${key.campaignId}`)
          break
        case 'templateId':
          if (key.templateId) keyParts.push(`template:${key.templateId}`)
          break
        case 'contentHash':
          if (key.contentHash) keyParts.push(`content:${key.contentHash}`)
          break
      }
    })

    return keyParts.join('|')
  }

  /**
   * Generate content hash for content-based deduplication
   */
  const generateContentHash = (content: {
    title?: string
    message?: string
    actionUrl?: string
    templateVariables?: Record<string, any>
  }): string => {
    try {
      // Create a normalized content string
      const normalizedContent = {
        title: content.title?.trim().toLowerCase() || '',
        message: content.message?.trim().toLowerCase() || '',
        actionUrl: content.actionUrl || '',
        variables: content.templateVariables || {}
      }

      // Simple hash function (in production, consider using crypto.subtle.digest)
      const contentString = JSON.stringify(normalizedContent)
      let hash = 0
      
      for (let i = 0; i < contentString.length; i++) {
        const char = contentString.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }

      return Math.abs(hash).toString(36)

    } catch (error) {
      console.error('❌ Error generating content hash:', error)
      return 'unknown'
    }
  }

  /**
   * Clean up expired fingerprints
   */
  const cleanupExpiredFingerprints = async (): Promise<number> => {
    try {
      const now = new Date().toISOString()
      
      // Get expired fingerprints
      const expiredFingerprints = await pb.collection('notification_fingerprints').getList(1, 1000, {
        filter: `expires_at <= "${now}"`
      })

      let deletedCount = 0

      // Delete expired fingerprints in batches
      for (const fingerprint of expiredFingerprints.items) {
        try {
          await pb.collection('notification_fingerprints').delete(fingerprint.id)
          deletedCount++
        } catch (error) {
          console.error(`❌ Error deleting fingerprint ${fingerprint.id}:`, error)
        }
      }

      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} expired fingerprints`)
      }

      return deletedCount

    } catch (error) {
      console.error('❌ Error cleaning up expired fingerprints:', error)
      return 0
    }
  }

  /**
   * Get deduplication statistics
   */
  const getDeduplicationStats = async (days: number = 7) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const fingerprints = await pb.collection('notification_fingerprints').getList(1, 1000, {
        filter: `created_at >= "${startDate.toISOString()}"`,
        sort: '-created_at'
      })

      const stats = {
        totalFingerprints: fingerprints.totalItems,
        duplicatesPrevented: 0,
        byTrigger: {} as Record<string, number>,
        byRule: {} as Record<string, number>,
        averageOccurrences: 0
      }

      let totalOccurrences = 0

      fingerprints.items.forEach((fp: any) => {
        const occurrences = fp.occurrence_count || 1
        totalOccurrences += occurrences

        if (occurrences > 1) {
          stats.duplicatesPrevented += (occurrences - 1)
        }

        const trigger = fp.metadata?.trigger || 'unknown'
        stats.byTrigger[trigger] = (stats.byTrigger[trigger] || 0) + 1

        const ruleType = fp.metadata?.rule || 'unknown'
        stats.byRule[ruleType] = (stats.byRule[ruleType] || 0) + 1
      })

      if (fingerprints.items.length > 0) {
        stats.averageOccurrences = totalOccurrences / fingerprints.items.length
      }

      return stats

    } catch (error) {
      console.error('❌ Error getting deduplication stats:', error)
      return null
    }
  }

  /**
   * Check and prevent duplicate for session-based notifications
   */
  const checkSessionDuplicate = async (
    userId: string,
    sessionId: string,
    ruleId: string
  ): Promise<boolean> => {
    return await isDuplicateNotification(
      { userId, sessionId, ruleId },
      'session_complete'
    )
  }

  /**
   * Check and prevent duplicate for campaign-based notifications
   */
  const checkCampaignDuplicate = async (
    userId: string,
    campaignId: string
  ): Promise<boolean> => {
    return await isDuplicateNotification(
      { userId, campaignId },
      'admin_campaign'
    )
  }

  /**
   * Check and prevent duplicate for content-based notifications
   */
  const checkContentDuplicate = async (
    userId: string,
    templateId: string,
    content: {
      title?: string
      message?: string
      actionUrl?: string
      templateVariables?: Record<string, any>
    }
  ): Promise<boolean> => {
    const contentHash = generateContentHash(content)
    
    return await isDuplicateNotification(
      { userId, templateId, contentHash },
      'system_event'
    )
  }

  /**
   * Record fingerprint after successful notification scheduling
   */
  const recordSuccessfulScheduling = async (
    key: DeduplicationKey,
    trigger: string = 'session_complete'
  ): Promise<void> => {
    try {
      await recordNotificationFingerprint(key, trigger)
    } catch (error) {
      console.error('❌ Error recording successful scheduling:', error)
    }
  }

  return {
    // Core deduplication methods
    isDuplicateNotification,
    recordNotificationFingerprint,
    recordSuccessfulScheduling,

    // Specialized duplicate checks
    checkSessionDuplicate,
    checkCampaignDuplicate,
    checkContentDuplicate,

    // Utility methods
    generateFingerprintKey,
    generateContentHash,
    cleanupExpiredFingerprints,
    getDeduplicationStats,

    // Configuration
    defaultDeduplicationRules
  }
}