import type PocketBase from 'pocketbase'
import { useNotificationDeduplication } from './useNotificationDeduplication'

// Types for notification scheduling
interface NotificationRule {
  id: string
  name: string
  description?: string
  trigger: 'session_complete' | 'analysis_ready' | 'user_inactive' | 'admin_campaign' | 'system_event'
  delay_minutes: number
  enabled: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template_id: string
  conditions?: Record<string, any>
  created?: string
  updated?: string
}

interface ScheduledNotification {
  id?: string
  rule_id: string
  user_id: string
  session_id?: string
  campaign_id?: string
  scheduled_for: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  retry_count: number
  metadata?: Record<string, any>
  created?: string
  updated?: string
}

interface SchedulingContext {
  userId: string
  sessionId?: string
  campaignId?: string
  sessionType?: string
  sessionDuration?: number
  userTimezone?: string
  additionalData?: Record<string, any>
}

export const useNotificationScheduler = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  // Get deduplication system
  const deduplication = useNotificationDeduplication()

  /**
   * Core scheduling engine - schedules notifications based on rules
   */
  const scheduleNotifications = async (
    trigger: NotificationRule['trigger'],
    context: SchedulingContext
  ): Promise<ScheduledNotification[]> => {
    try {
      console.log('🕐 Scheduling notifications for trigger:', trigger, 'context:', context)

      // Get all enabled rules for this trigger
      const rules = await getActiveRules(trigger)
      
      if (rules.length === 0) {
        console.log('📭 No active rules found for trigger:', trigger)
        return []
      }

      console.log(`📋 Found ${rules.length} active rules for trigger: ${trigger}`)

      // Get user preferences for timezone-aware scheduling
      const userPreferences = await getUserNotificationPreferences(context.userId)
      
      // Schedule notifications for each rule
      const scheduledNotifications: ScheduledNotification[] = []
      
      for (const rule of rules) {
        try {
          // Check if rule conditions are met
          if (!(await evaluateRuleConditions(rule, context))) {
            console.log(`⏭️ Rule conditions not met for rule: ${rule.name}`)
            continue
          }

          // Check for duplicates using the deduplication system
          if (await checkForDuplicates(rule, context, trigger)) {
            console.log(`🔄 Duplicate notification prevented for rule: ${rule.name}`)
            continue
          }

          // Calculate scheduled time with timezone awareness
          const scheduledFor = calculateScheduledTime(
            rule.delay_minutes,
            userPreferences?.timezone || 'UTC',
            userPreferences
          )

          // Create scheduled notification record
          const scheduledNotification: ScheduledNotification = {
            rule_id: rule.id,
            user_id: context.userId,
            session_id: context.sessionId,
            campaign_id: context.campaignId,
            scheduled_for: scheduledFor.toISOString(),
            status: 'pending',
            retry_count: 0,
            metadata: {
              trigger,
              rule_name: rule.name,
              priority: rule.priority,
              template_id: rule.template_id,
              ...context.additionalData
            }
          }

          // Save to database
          const created = await pb.collection('scheduled_notifications').create(scheduledNotification)
          scheduledNotifications.push(created as ScheduledNotification)

          // Record fingerprint to prevent future duplicates
          await recordNotificationFingerprint(rule, context, trigger)

          console.log(`✅ Scheduled notification: ${rule.name} for ${scheduledFor.toISOString()}`)

        } catch (error) {
          console.error(`❌ Error scheduling notification for rule ${rule.name}:`, error)
          // Continue with other rules even if one fails
        }
      }

      console.log(`🎯 Successfully scheduled ${scheduledNotifications.length} notifications`)
      return scheduledNotifications

    } catch (error) {
      console.error('❌ Error in scheduleNotifications:', error)
      throw error
    }
  }

  /**
   * Get active notification rules for a specific trigger
   */
  const getActiveRules = async (trigger: NotificationRule['trigger']): Promise<NotificationRule[]> => {
    try {
      const rules = await pb.collection('notification_rules').getFullList<NotificationRule>({
        filter: `trigger = "${trigger}" && enabled = true`,
        sort: 'delay_minutes',
        expand: 'template_id'
      })

      return rules
    } catch (error) {
      console.error('❌ Error fetching notification rules:', error)
      return []
    }
  }

  /**
   * Get user notification preferences for timezone-aware scheduling
   */
  const getUserNotificationPreferences = async (userId: string) => {
    try {
      const preferences = await pb.collection('notification_preferences').getFirstListItem(
        `user_id = "${userId}"`
      )
      return preferences
    } catch (error) {
      // Return default preferences if none found
      return {
        enabled: true,
        timezone: 'UTC',
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        frequency: 'immediate'
      }
    }
  }

  /**
   * Evaluate rule conditions to determine if notification should be scheduled
   */
  const evaluateRuleConditions = async (
    rule: NotificationRule,
    context: SchedulingContext
  ): Promise<boolean> => {
    try {
      // If no conditions specified, rule applies
      if (!rule.conditions || Object.keys(rule.conditions).length === 0) {
        return true
      }

      // Evaluate each condition
      for (const [key, condition] of Object.entries(rule.conditions)) {
        if (!(await evaluateCondition(key, condition, context))) {
          return false
        }
      }

      return true
    } catch (error) {
      console.error('❌ Error evaluating rule conditions:', error)
      return false
    }
  }

  /**
   * Evaluate a single condition
   */
  const evaluateCondition = async (
    key: string,
    condition: any,
    context: SchedulingContext
  ): Promise<boolean> => {
    try {
      switch (key) {
        case 'session_type':
          return context.sessionType === condition.value

        case 'session_duration_min':
          return (context.sessionDuration || 0) >= condition.value

        case 'session_duration_max':
          return (context.sessionDuration || 0) <= condition.value

        case 'user_role':
          const user = await pb.collection('users').getOne(context.userId)
          return user.role === condition.value

        case 'time_of_day':
          const now = new Date()
          const currentHour = now.getHours()
          return currentHour >= condition.start && currentHour <= condition.end

        default:
          console.warn(`⚠️ Unknown condition key: ${key}`)
          return true
      }
    } catch (error) {
      console.error(`❌ Error evaluating condition ${key}:`, error)
      return false
    }
  }

  /**
   * Check for duplicate notifications using the deduplication system
   */
  const checkForDuplicates = async (
    rule: NotificationRule,
    context: SchedulingContext,
    trigger: string
  ): Promise<boolean> => {
    try {
      // Build deduplication key based on context
      const deduplicationKey = {
        userId: context.userId,
        ruleId: rule.id,
        sessionId: context.sessionId,
        campaignId: context.campaignId,
        templateId: rule.template_id
      }

      // Use the deduplication system to check for duplicates
      return await deduplication.isDuplicateNotification(deduplicationKey, trigger)

    } catch (error) {
      console.error('❌ Error checking for duplicates:', error)
      return false
    }
  }

  /**
   * Record notification fingerprint after successful scheduling
   */
  const recordNotificationFingerprint = async (
    rule: NotificationRule,
    context: SchedulingContext,
    trigger: string
  ): Promise<void> => {
    try {
      const deduplicationKey = {
        userId: context.userId,
        ruleId: rule.id,
        sessionId: context.sessionId,
        campaignId: context.campaignId,
        templateId: rule.template_id
      }

      await deduplication.recordNotificationFingerprint(deduplicationKey, trigger)

    } catch (error) {
      console.error('❌ Error recording notification fingerprint:', error)
    }
  }

  /**
   * Calculate scheduled time with timezone awareness and quiet hours respect
   */
  const calculateScheduledTime = (
    delayMinutes: number,
    timezone: string = 'UTC',
    userPreferences?: any
  ): Date => {
    const now = new Date()
    const scheduledTime = new Date(now.getTime() + (delayMinutes * 60 * 1000))

    // If no user preferences or immediate delivery, return as-is
    if (!userPreferences || delayMinutes === 0) {
      return scheduledTime
    }

    // Check if scheduled time falls within quiet hours
    if (isWithinQuietHours(scheduledTime, userPreferences, timezone)) {
      // Move to end of quiet hours
      const adjustedTime = moveOutOfQuietHours(scheduledTime, userPreferences, timezone)
      console.log(`🔇 Adjusted notification time from ${scheduledTime.toISOString()} to ${adjustedTime.toISOString()} (quiet hours)`)
      return adjustedTime
    }

    return scheduledTime
  }

  /**
   * Check if a time falls within user's quiet hours
   */
  const isWithinQuietHours = (
    time: Date,
    userPreferences: any,
    timezone: string
  ): boolean => {
    try {
      // Convert time to user's timezone
      const userTime = new Date(time.toLocaleString("en-US", { timeZone: timezone }))
      const currentHour = userTime.getHours()
      const currentMinute = userTime.getMinutes()
      const currentTimeMinutes = currentHour * 60 + currentMinute

      // Parse quiet hours
      const [startHour, startMinute] = userPreferences.quiet_hours_start.split(':').map(Number)
      const [endHour, endMinute] = userPreferences.quiet_hours_end.split(':').map(Number)
      const startTimeMinutes = startHour * 60 + startMinute
      const endTimeMinutes = endHour * 60 + endMinute

      // Handle overnight quiet hours (e.g., 22:00 to 08:00)
      if (startTimeMinutes > endTimeMinutes) {
        return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes
      } else {
        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
      }
    } catch (error) {
      console.error('❌ Error checking quiet hours:', error)
      return false
    }
  }

  /**
   * Move notification time out of quiet hours
   */
  const moveOutOfQuietHours = (
    time: Date,
    userPreferences: any,
    timezone: string
  ): Date => {
    try {
      const [endHour, endMinute] = userPreferences.quiet_hours_end.split(':').map(Number)
      
      // Create a new date for the end of quiet hours
      const adjustedTime = new Date(time)
      adjustedTime.setHours(endHour, endMinute, 0, 0)

      // If the end time is earlier in the day (overnight quiet hours), 
      // and current time is after midnight, use today's end time
      const [startHour] = userPreferences.quiet_hours_start.split(':').map(Number)
      if (startHour > endHour && time.getHours() < 12) {
        // Keep today's date
      } else if (startHour > endHour) {
        // Move to next day's end time
        adjustedTime.setDate(adjustedTime.getDate() + 1)
      }

      return adjustedTime
    } catch (error) {
      console.error('❌ Error moving out of quiet hours:', error)
      return time
    }
  }

  /**
   * Cancel scheduled notifications (e.g., when user starts new session)
   */
  const cancelScheduledNotifications = async (
    userId: string,
    sessionId?: string,
    campaignId?: string
  ): Promise<number> => {
    try {
      let filter = `user_id = "${userId}" && status = "pending"`

      if (sessionId) {
        filter += ` && session_id = "${sessionId}"`
      }

      if (campaignId) {
        filter += ` && campaign_id = "${campaignId}"`
      }

      // Get pending notifications
      const pendingNotifications = await pb.collection('scheduled_notifications').getFullList({
        filter
      })

      // Cancel each notification
      let cancelledCount = 0
      for (const notification of pendingNotifications) {
        try {
          await pb.collection('scheduled_notifications').update(notification.id, {
            status: 'cancelled',
            updated: new Date().toISOString()
          })
          cancelledCount++
        } catch (error) {
          console.error(`❌ Error cancelling notification ${notification.id}:`, error)
        }
      }

      console.log(`🚫 Cancelled ${cancelledCount} scheduled notifications`)
      return cancelledCount

    } catch (error) {
      console.error('❌ Error cancelling scheduled notifications:', error)
      return 0
    }
  }

  /**
   * Get scheduled notifications for a user
   */
  const getScheduledNotifications = async (
    userId: string,
    status?: ScheduledNotification['status']
  ): Promise<ScheduledNotification[]> => {
    try {
      let filter = `user_id = "${userId}"`
      
      if (status) {
        filter += ` && status = "${status}"`
      }

      const notifications = await pb.collection('scheduled_notifications').getFullList<ScheduledNotification>({
        filter,
        sort: 'scheduled_for',
        expand: 'rule_id'
      })

      return notifications
    } catch (error) {
      console.error('❌ Error fetching scheduled notifications:', error)
      return []
    }
  }

  return {
    // Core scheduling methods
    scheduleNotifications,
    cancelScheduledNotifications,
    getScheduledNotifications,
    
    // Rule management
    getActiveRules,
    
    // Utility methods
    getUserNotificationPreferences,
    evaluateRuleConditions,
    calculateScheduledTime,
    isWithinQuietHours,
    checkForDuplicates,
    recordNotificationFingerprint
  }
}