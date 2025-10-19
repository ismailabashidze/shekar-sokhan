import type { Ref } from 'vue'

export interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: 'user_inactive' | 'session_complete' | 'analysis_ready' | 'custom'
  delay_minutes: number // Flexible timing in minutes
  enabled: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template: {
    title: string
    message: string
    action_url?: string
    action_text?: string
  }
}

export function useNotificationRules() {
  const { $pb } = useNuxtApp()
  const { createNotification } = useNotifications()

  // Default notification rules (can be customized via admin panel)
  const defaultRules: NotificationRule[] = [
    // ============================================
    // ANALYSIS NOTIFICATIONS
    // ============================================

    // Immediate notification
    {
      id: 'analysis_immediate',
      name: 'تحلیل آماده شد',
      description: 'بلافاصله پس از آماده شدن تحلیل',
      trigger: 'analysis_ready',
      delay_minutes: 0, // Immediate
      enabled: true,
      priority: 'high',
      template: {
        title: 'تحلیل جلسه آماده شد ✨',
        message: 'نتایج تحلیل جلسه شما آماده است',
        action_url: '/therapy-journey/analysis/{{analysisId}}',
        action_text: 'مشاهده تحلیل',
      },
    },

    // 30 minutes later
    {
      id: 'analysis_followup_1',
      name: 'نکات کلیدی',
      description: '30 دقیقه بعد از تحلیل',
      trigger: 'analysis_ready',
      delay_minutes: 30,
      enabled: true,
      priority: 'medium',
      template: {
        title: 'نکات کلیدی جلسه شما 💡',
        message: 'بینش‌های مهمی از جلسه شما استخراج شده است',
        action_url: '/therapy-journey/analysis/{{analysisId}}',
        action_text: 'مشاهده نکات',
      },
    },

    // 2 hours later
    {
      id: 'analysis_followup_2',
      name: 'پیشنهادات درمانی',
      description: '2 ساعت بعد از تحلیل',
      trigger: 'analysis_ready',
      delay_minutes: 120, // 2 hours
      enabled: true,
      priority: 'medium',
      template: {
        title: 'پیشنهادات شخصی‌سازی شده 🎯',
        message: 'پیشنهادات درمانی برای شما آماده است',
        action_url: '/therapy-journey/analysis/{{analysisId}}',
        action_text: 'مشاهده پیشنهادات',
      },
    },

    // 1 day later
    {
      id: 'analysis_review',
      name: 'مرور جلسه',
      description: '1 روز بعد از تحلیل',
      trigger: 'analysis_ready',
      delay_minutes: 1440, // 24 hours
      enabled: true,
      priority: 'low',
      template: {
        title: 'زمان مرور جلسه 📚',
        message: 'بیایید نکات کلیدی جلسه را مرور کنیم',
        action_url: '/therapy-journey/analysis/{{analysisId}}',
        action_text: 'مرور جلسه',
      },
    },

    // 1 week later
    {
      id: 'analysis_longterm',
      name: 'پیگیری پیشرفت',
      description: '1 هفته بعد از تحلیل',
      trigger: 'analysis_ready',
      delay_minutes: 10080, // 7 days
      enabled: true,
      priority: 'low',
      template: {
        title: 'پیگیری پیشرفت هفتگی 🌱',
        message: 'چطور می‌توانید از بینش‌های جلسه استفاده کنید؟',
        action_url: '/therapy-journey/analysis/{{analysisId}}',
        action_text: 'بررسی پیشرفت',
      },
    },

    // ============================================
    // USER INACTIVITY NOTIFICATIONS
    // ============================================

    // 1 hour inactive (disabled by default - might be too soon)
    {
      id: 'inactive_1hour',
      name: 'یک ساعت غیبت',
      description: '1 ساعت بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 60,
      enabled: false,
      priority: 'low',
      template: {
        title: 'هنوز اینجا هستیم! 💙',
        message: 'مشاور هوشمند شما منتظر شماست',
        action_url: '/dashboard',
        action_text: 'ادامه گفتگو',
      },
    },

    // 6 hours inactive
    {
      id: 'inactive_6hours',
      name: '6 ساعت غیبت',
      description: '6 ساعت بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 360,
      enabled: true,
      priority: 'low',
      template: {
        title: 'دلمان برای شما تنگ شده 💙',
        message: 'یک گفتگوی کوتاه می‌تواند روز شما را بهتر کند',
        action_url: '/dashboard',
        action_text: 'شروع گفتگو',
      },
    },

    // 1 day inactive
    {
      id: 'inactive_1day',
      name: 'یک روز غیبت',
      description: '24 ساعت بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 1440, // 24 hours
      enabled: true,
      priority: 'medium',
      template: {
        title: 'دلتان برای ذهنا تنگ نشده؟ 💙',
        message: 'یک روز از آخرین بازدید شما می‌گذرد. مشاور شما منتظر شماست!',
        action_url: '/dashboard',
        action_text: 'بازگشت به ذهنا',
      },
    },

    // 3 days inactive
    {
      id: 'inactive_3days',
      name: '3 روز غیبت',
      description: '3 روز بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 4320, // 3 days
      enabled: true,
      priority: 'medium',
      template: {
        title: 'خیلی دلتنگ شدیم! 🌟',
        message: '3 روز از آخرین گفتگوی شما می‌گذرد. آیا همه چیز خوب است؟',
        action_url: '/dashboard',
        action_text: 'گفتگو با مشاور',
      },
    },

    // 1 week inactive
    {
      id: 'inactive_1week',
      name: 'یک هفته غیبت',
      description: '7 روز بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 10080, // 7 days
      enabled: true,
      priority: 'high',
      template: {
        title: 'به شما فکر می‌کنیم 💭',
        message: 'یک هفته از آخرین بازدید شما می‌گذرد. آیا نیاز به کمک دارید؟',
        action_url: '/dashboard',
        action_text: 'بازگشت',
      },
    },

    // 2 weeks inactive
    {
      id: 'inactive_2weeks',
      name: 'دو هفته غیبت',
      description: '14 روز بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 20160, // 14 days
      enabled: true,
      priority: 'high',
      template: {
        title: 'خیلی دلتنگتان شدیم! 💔',
        message: 'دو هفته از آخرین بازدید شما می‌گذرد. همیشه اینجا هستیم',
        action_url: '/dashboard',
        action_text: 'بازگشت به ذهنا',
      },
    },

    // 1 month inactive
    {
      id: 'inactive_1month',
      name: 'یک ماه غیبت',
      description: '30 روز بعد از آخرین فعالیت',
      trigger: 'user_inactive',
      delay_minutes: 43200, // 30 days
      enabled: true,
      priority: 'urgent',
      template: {
        title: 'خیلی وقت است شما را ندیده‌ایم 🥺',
        message: 'یک ماه از آخرین بازدید شما می‌گذرد. آیا می‌خواهید دوباره شروع کنیم؟',
        action_url: '/dashboard',
        action_text: 'شروع دوباره',
      },
    },

    // ============================================
    // SESSION COMPLETION NOTIFICATIONS
    // ============================================

    // Immediate after session
    {
      id: 'session_complete_immediate',
      name: 'پایان جلسه - فوری',
      description: 'بلافاصله پس از پایان جلسه',
      trigger: 'session_complete',
      delay_minutes: 0,
      enabled: true,
      priority: 'medium',
      template: {
        title: 'جلسه با موفقیت به پایان رسید ✅',
        message: 'از زمانی که برای خود گذاشتید متشکریم',
        action_url: '/darmana/therapists/sessions',
        action_text: 'مشاهده جلسات',
      },
    },

    // 2 hours after session
    {
      id: 'session_followup_2hours',
      name: 'پیگیری جلسه - 2 ساعت',
      description: '2 ساعت بعد از پایان جلسه',
      trigger: 'session_complete',
      delay_minutes: 120,
      enabled: true,
      priority: 'low',
      template: {
        title: 'چطور احساس می‌کنید؟ 😊',
        message: 'امیدواریم جلسه برایتان مفید بوده باشد',
        action_url: '/darmana/therapists/sessions',
        action_text: 'مشاهده یادداشت‌ها',
      },
    },

    // 4 hours after session
    {
      id: 'session_followup_4hours',
      name: 'پیگیری جلسه - 4 ساعت',
      description: '4 ساعت بعد از پایان جلسه',
      trigger: 'session_complete',
      delay_minutes: 240,
      enabled: true,
      priority: 'low',
      template: {
        title: 'ادامه گفتگو 💬',
        message: 'آیا موضوعی هست که می‌خواهید درباره‌اش صحبت کنید؟',
        action_url: '/darmana/therapists/sessions',
        action_text: 'ادامه گفتگو',
      },
    },

    // Next day after session
    {
      id: 'session_nextday',
      name: 'یادآوری روز بعد',
      description: '24 ساعت بعد از پایان جلسه',
      trigger: 'session_complete',
      delay_minutes: 1440,
      enabled: true,
      priority: 'low',
      template: {
        title: 'مرور جلسه دیروز 📝',
        message: 'آیا می‌خواهید نکات کلیدی جلسه دیروز را مرور کنیم؟',
        action_url: '/darmana/therapists/history',
        action_text: 'مرور جلسه',
      },
    },
  ]

  // Get rules from PocketBase (or use defaults if collection doesn't exist)
  const getRules = async (): Promise<NotificationRule[]> => {
    try {
      const records = await $pb.collection('notification_rules').getFullList<NotificationRule>({
        sort: 'delay_minutes',
      })

      return records.length > 0 ? records : defaultRules
    }
    catch (err) {
      console.warn('Using default notification rules:', err)
      return defaultRules
    }
  }

  // Get rules by trigger type
  const getRulesByTrigger = async (
    trigger: NotificationRule['trigger'],
  ): Promise<NotificationRule[]> => {
    const rules = await getRules()
    return rules.filter(r => r.trigger === trigger && r.enabled)
  }

  // Calculate notification schedule time based on delay
  const calculateScheduleTime = (delayMinutes: number, fromDate?: Date): Date => {
    const baseDate = fromDate || new Date()
    return new Date(baseDate.getTime() + delayMinutes * 60 * 1000)
  }

  // Replace template variables with actual values
  const fillTemplate = (template: string, context: Record<string, any>): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] || '')
  }

  // Schedule notifications based on rules for a specific trigger
  const scheduleNotificationsFromRules = async (
    userId: string,
    trigger: NotificationRule['trigger'],
    context: Record<string, any> = {},
  ) => {
    try {
      const rules = await getRulesByTrigger(trigger)

      if (rules.length === 0) {
        console.log(`No enabled rules found for trigger: ${trigger}`)
        return []
      }

      const notifications = []

      for (const rule of rules) {
        const scheduleTime = calculateScheduleTime(rule.delay_minutes)

        // Replace template variables
        const title = fillTemplate(rule.template.title, context)
        const message = fillTemplate(rule.template.message, context)
        const actionUrl = rule.template.action_url
          ? fillTemplate(rule.template.action_url, context)
          : undefined

        const notificationData = {
          title,
          message,
          type: 'info' as const,
          priority: rule.priority,
          recipient_user_id: userId,
          action_url: actionUrl,
          action_text: rule.template.action_text,
          announce_time: scheduleTime.toISOString(),
          rule_id: rule.id,
          fcm_sent: false,
        }

        // Create notification in PocketBase
        const created = await createNotification(notificationData)
        notifications.push(created)
      }

      console.log(`✅ Created ${notifications.length} scheduled notifications for ${trigger}`)
      return notifications
    }
    catch (err) {
      console.error('Error scheduling notifications from rules:', err)
      throw err
    }
  }

  // Format delay for display (e.g., "2 ساعت", "1 روز")
  const formatDelay = (minutes: number): string => {
    if (minutes === 0) return 'فوری'
    if (minutes < 60) return `${minutes} دقیقه`
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours} ساعت`
    }
    if (minutes < 10080) {
      const days = Math.floor(minutes / 1440)
      return `${days} روز`
    }
    const weeks = Math.floor(minutes / 10080)
    return `${weeks} هفته`
  }

  // Initialize default rules in database (admin use)
  const initializeDefaultRules = async () => {
    try {
      const existingRules = await $pb.collection('notification_rules').getFullList()

      if (existingRules.length > 0) {
        console.log('Notification rules already exist, skipping initialization')
        return existingRules
      }

      // Create all default rules
      const promises = defaultRules.map(rule =>
        $pb.collection('notification_rules').create(rule),
      )

      const created = await Promise.all(promises)
      console.log(`✅ Initialized ${created.length} default notification rules`)
      return created
    }
    catch (err) {
      console.error('Error initializing default rules:', err)
      throw err
    }
  }

  return {
    // State
    defaultRules,

    // Methods
    getRules,
    getRulesByTrigger,
    calculateScheduleTime,
    fillTemplate,
    scheduleNotificationsFromRules,
    formatDelay,
    initializeDefaultRules,
  }
}
