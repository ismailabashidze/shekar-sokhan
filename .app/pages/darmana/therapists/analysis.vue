<script setup lang="ts">
import Slider from '@vueform/slider'
import '~/assets/css/slider.css'

definePageMeta({
  title: 'گزارش جلسه',
  layout: 'sidebar',
  preview: {
    title: 'بررسی گزارش جلسه',
    description: 'بررسی جزییات پیام ها',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-health.png',
    srcDark: '/img/screens/dashboards-health-dark.png',
    order: 17,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const trustLevel = ref(75)

const route = useRoute()
const toaster = useToaster()

const analysisId = computed(() => route.query.analysis_id as string)
const analysisData = ref<any>({ expireChargeTime: new Date() })
const { getAnalysisById } = useSessionAnalysis()
const { getUserAvatarUrl } = useAvatarManager()
const { createNotification } = useNotifications()

// State for notification status checking
const userNotifications = ref<any[]>([])
const notificationStatusChecked = ref(false)

const formatEmoji = (trustLevel: number): string => {
  if (trustLevel >= 80) return '😍' // Heart eyes for 100
  if (trustLevel >= 60) return '😊' // Happy face for 80 to 99
  if (trustLevel >= 25) return '😐' // Stoic face for 50 to 79
  return '😠' // Angry face for 0 to 49
}

const trustLevelComputed = computed(() => {
  if (!analysisData.value) return 0
  const trust = analysisData.value.finalTrustAndOppennessOfUser
  switch (trust) {
    case 'veryHigh': return 100
    case 'high': return 75
    case 'low': return 50
    case 'veryLow': return 25
    default: return 0
  }
})

const headlinesComputed = computed(() => analysisData.value?.headlines || [])

// Enhanced next steps with AI-generated caring messages and scheduling
const enhancedNextSteps = ref<any[]>([])
const generatingMessages = ref(false)
const notificationsCreated = ref(false)

// Generate caring messages using AI
const generateCaringMessage = async (
  userName: string,
  stepTitle: string,
  stepDescription: string,
  therapistName: string,
  sessionTitle: string,
  sessionSummary: string,
  deeperGoals: string,
  demographicData: any,
  psychoAnalysis: string,
  riskFactors: any[],
  defenceMechanisms: any[],
): Promise<string> => {
  const { streamChat } = useOpenRouter()

  // Prepare demographic info
  const demographicInfo = demographicData
    ? [
        demographicData.age && `سن: ${demographicData.age}`,
        demographicData.gender && `جنسیت: ${demographicData.gender === 'male' ? 'مرد' : demographicData.gender === 'female' ? 'زن' : 'دیگر'}`,
        demographicData.education && `تحصیلات: ${demographicData.education}`,
        demographicData.occupation && `شغل: ${demographicData.occupation}`,
        demographicData.maritalStatus && `وضعیت تأهل: ${demographicData.maritalStatus}`,
      ].filter(Boolean).join('، ')
    : ''

  // Prepare psychological insights
  const psychoInsights = [
    psychoAnalysis && `تحلیل روانی: ${psychoAnalysis}`,
    riskFactors.length > 0 && `عوامل خطر: ${riskFactors.map(r => r.title).join('، ')}`,
    defenceMechanisms.length > 0 && `مکانیزم‌های دفاعی: ${defenceMechanisms.map(m => m.name).join('، ')}`,
  ].filter(Boolean).join(' | ')

  const prompt = `تو یک روانشناس باتجربه با نام "${therapistName}" هستی. بر اساس جلسه درمانی اخیر، می‌خوای برای مراجعت به نام "${userName}" یک پیام مهربان و هدفمند بنویسی.

اطلاعات جلسه:
موضوع جلسه: ${sessionTitle}
خلاصه جلسه: ${sessionSummary}
اهداف عمیق‌تر مراجع: ${deeperGoals}

اطلاعات دموگرافیک مراجع:
${demographicInfo || 'اطلاعات دموگرافیک در دسترس نیست'}

تحلیل‌های روانشناختی:
${psychoInsights || 'تحلیل‌های تکمیلی در دسترس نیست'}

موضوع پیگیری خاص: ${stepTitle}
جزئیات: ${stepDescription}

پیام باید:
- مستقیماً به موضوع جلسه، اطلاعات دموگرافیک، و تحلیل‌های روانشناختی مرتبط باشه
- از نکات مطرح شده در جلسه و تحلیل‌های روانی استفاده کنه
- با توجه به سن، جنسیت، شغل و وضعیت تأهل مراجع شخصی‌سازی بشه
- مهربان و صمیمی باشه ولی حرفه‌ای باقی بمونه
- انگیزه‌بخش و امیدوارکننده باشه
- کوتاه و مؤثر باشه (حداکثر 2-3 جمله)
- از نام مراجع استفاده کنه
- ارتباط منطقی بین جلسه قبل و موضوع پیگیری داشته باشه
- ایموجی‌های مناسب و معنادار استفاده کنه

فقط متن پیام رو بنویس، بدون توضیح اضافی.`

  const messages = [
    { role: 'system', content: 'تو یک دستیار روانشناس متخصص هستی که در تجزیه و تحلیل جلسات درمانی و نوشتن پیام‌های هدفمند و شخصی‌سازی شده با در نظر گیری اطلاعات دموگرافیک و تحلیل‌های روانشناختی تخصص داری.' },
    { role: 'user', content: prompt },
  ]

  let result = ''
  await streamChat(messages as any[], {}, (chunk) => {
    result += chunk
  })

  return result.trim()
}

// Save enhanced next steps to database
const saveEnhancedNextSteps = async (steps: any[]) => {
  try {
    // Use the same composable that loads the analysis data
    const { updateAnalysis } = useSessionAnalysis()

    await updateAnalysis(analysisId.value, {
      suggestedNextStepsForTherapistForNextSession: steps,
    })
  }
  catch (error) {
    console.error('Error saving enhanced next steps:', error)
  }
}

// Create notifications for enhanced next steps
const createCaringNotifications = async (steps: any[]) => {
  try {
    if (!analysisData.value?.expand?.session?.expand?.user?.id) {
      console.warn('Cannot create notifications: user ID not found')
      return
    }

    // Check if notifications have already been created
    if (notificationsCreated.value) {
      console.log('Notifications already created for this analysis')
      return
    }

    const userId = analysisData.value.expand.session.expand.user.id
    const therapistName = analysisData.value.expand.session.expand.therapist?.name || 'مشاور'
    const therapistId = analysisData.value.expand.session.expand.therapist?.id

    const notifications = await Promise.all(
      steps.map(async (step, index) => {
        // Create notification for each step
        const notificationData = {
          title: `💝 پیام مهربان از ${therapistName}`,
          message: step.suggestedMessage,
          complete_message: `<div class="space-y-4">
            <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4">
              <h3 class="font-semibold text-lg mb-2 text-pink-800 dark:text-pink-200">🌟 ${step.title}</h3>
              <p class="text-pink-700 dark:text-pink-300 mb-3">${step.description}</p>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-pink-200 dark:border-pink-700">
                <p class="text-gray-800 dark:text-gray-200 leading-relaxed">${step.suggestedMessage}</p>
              </div>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>💕 این پیام با مهربانی و توجه ویژه برای شما تهیه شده است.</p>
              <p>🕐 زمان‌بندی: ${step.schedule.label}</p>
            </div>
          </div>`,
          type: 'info' as const,
          priority: 'medium' as const,
          recipient_user_id: userId,
          user_id: therapistId,
          user_name: therapistName,
          user_role: 'therapist',
          action_url: `/darmana/therapists/sessions?session_id=${analysisData.value.expand.session.id}`,
          action_text: 'ادامه گفتگو',
          announce_time: step.scheduledDate.toISOString(),
        }

        return await createNotification(notificationData)
      }),
    )

    // Mark notifications as created
    notificationsCreated.value = true

    return notifications
  }
  catch (error) {
    console.error('Error creating caring notifications:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در ایجاد اعلان‌ها به وجود آمد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Fetch user notifications to check status
const fetchUserNotifications = async (userId: string) => {
  try {
    const { $pb } = useNuxtApp()

    // Get notifications for this specific user from PocketBase
    const notifications = await $pb.collection('notifications').getList(1, 50, {
      filter: `recipient_user_id = "${userId}"`,
      sort: '-created',
    })

    userNotifications.value = notifications.items
    notificationStatusChecked.value = true

    return notifications.items
  }
  catch (error) {
    console.error('Error fetching user notifications:', error)
    return []
  }
}

// Check notification status for each step
const checkNotificationStatus = (step: any) => {
  if (!notificationStatusChecked.value || !step.suggestedMessage) {
    return {
      status: 'planned',
      notificationExists: false,
      notificationId: null,
      actualStatus: 'not_checked',
    }
  }

  // Enhanced matching logic for better consistency
  const matchingNotification = userNotifications.value.find((notification) => {
    // Primary match: message content similarity
    const messageMatch = notification.message.includes(step.suggestedMessage.substring(0, 50))
      || step.suggestedMessage.includes(notification.message.substring(0, 50))

    // Secondary match: title pattern
    const titleMatch = notification.title.includes('پیام مهربان')
      && (notification.title.includes(step.title.substring(0, 20)) || step.title.includes(notification.title.substring(0, 20)))

    // Time-based match: scheduled time proximity (within 5 minutes)
    const timeMatch = notification.announce_time
      && Math.abs(new Date(notification.announce_time).getTime() - step.scheduledDate.getTime()) < 300000 // Within 5 minutes

    return messageMatch || titleMatch || timeMatch
  })

  if (!matchingNotification) {
    return {
      status: 'planned',
      notificationExists: false,
      notificationId: null,
      actualStatus: 'not_created',
    }
  }

  // Check actual status based on announce_time and current time
  const now = new Date()
  const announceTime = matchingNotification.announce_time ? new Date(matchingNotification.announce_time) : null

  let actualStatus = 'created'
  if (announceTime) {
    if (announceTime > now) {
      actualStatus = 'scheduled' // In queue, waiting to be sent
    }
    else {
      actualStatus = 'sent' // Time has passed, should be sent
    }
  }
  else {
    actualStatus = 'sent' // No announce_time means sent immediately
  }

  return {
    status: actualStatus,
    notificationExists: true,
    notificationId: matchingNotification.id,
    actualStatus,
    announceTime: matchingNotification.announce_time,
    isRead: matchingNotification.is_read,
  }
}

// Process enhanced next steps
const processEnhancedNextSteps = async () => {
  if (!analysisData.value?.suggestedNextStepsForTherapistForNextSession?.length) {
    enhancedNextSteps.value = []
    return
  }

  // Fetch user notifications to check status
  const userId = analysisData.value?.expand?.session?.expand?.user?.id
  if (userId) {
    await fetchUserNotifications(userId)
  }

  // Check if messages are already generated (have suggestedMessage field)
  const hasGeneratedMessages = analysisData.value.suggestedNextStepsForTherapistForNextSession.some(
    (step: any) => step.suggestedMessage,
  )

  if (hasGeneratedMessages) {
    // Use existing data from database
    enhancedNextSteps.value = analysisData.value.suggestedNextStepsForTherapistForNextSession.map((step: any, index: number) => {
      const scheduleOptions = [
        { label: '۲ ساعت دیگر', hours: 2 },
        { label: '۴ ساعت دیگر', hours: 4 },
        { label: '۸ ساعت دیگر', hours: 8 },
        { label: 'فردا', hours: 24 },
        { label: '۲ روز دیگر', hours: 48 },
        { label: '۳ روز دیگر', hours: 72 },
        { label: '۴ روز دیگر', hours: 96 },
        { label: 'یک هفته دیگر', hours: 168 },
      ]

      const schedule = step.schedule || scheduleOptions[index % scheduleOptions.length]
      const scheduledDate = step.scheduledDate ? new Date(step.scheduledDate) : new Date(Date.now() + schedule.hours * 60 * 60 * 1000)

      return {
        ...step,
        schedule,
        scheduledDate,
        status: step.status || 'planned',
      }
    })

    // Check if notifications were already created
    notificationsCreated.value = analysisData.value.notificationsCreated || false

    return
  }

  // Generate new messages
  generatingMessages.value = true

  const scheduleOptions = [
    { label: '۲ ساعت دیگر', hours: 2 },
    { label: '۴ ساعت دیگر', hours: 4 },
    { label: '۸ ساعت دیگر', hours: 8 },
    { label: 'فردا', hours: 24 },
    { label: '۲ روز دیگر', hours: 48 },
    { label: '۳ روز دیگر', hours: 72 },
    { label: '۴ روز دیگر', hours: 96 },
    { label: 'یک هفته دیگر', hours: 168 },
  ]

  const userName = analysisData.value?.expand?.session?.expand?.user?.meta?.name || 'عزیز'
  const therapistName = analysisData.value?.expand?.session?.expand?.therapist?.name || 'روانشناس'
  const sessionTitle = analysisData.value?.title || 'جلسه درمانی'
  const sessionSummary = analysisData.value?.summaryOfSession || 'بررسی موضوعات روانشناختی'
  const deeperGoals = analysisData.value?.possibleDeeperGoalsOfPatient || 'بهبود وضعیت روانی و دستیابی به آرامش درونی'
  const demographicData = analysisData.value?.demographicData || {}
  const psychoAnalysis = analysisData.value?.psychoAnalysis || ''
  const riskFactors = analysisData.value?.possibleRiskFactorsExtracted || []
  const defenceMechanisms = analysisData.value?.detectedDefenceMechanisms || []

  try {
    // Generate up to 5 messages from the existing steps, repeating if necessary
    const stepsToProcess = []
    const originalSteps = analysisData.value.suggestedNextStepsForTherapistForNextSession

    for (let i = 0; i < 5; i++) {
      const originalStep = originalSteps[i % originalSteps.length]
      stepsToProcess.push({
        ...originalStep,
        title: i >= originalSteps.length ? `${originalStep.title} (ادامه ${i - originalSteps.length + 2})` : originalStep.title,
      })
    }

    const processedSteps = await Promise.all(
      stepsToProcess.map(async (step: any, index: number) => {
        const schedule = scheduleOptions[index % scheduleOptions.length]
        const scheduledDate = new Date(Date.now() + schedule.hours * 60 * 60 * 1000)

        // Generate AI message with comprehensive context
        const suggestedMessage = await generateCaringMessage(
          userName,
          step.title,
          step.description,
          therapistName,
          sessionTitle,
          sessionSummary,
          deeperGoals,
          demographicData,
          psychoAnalysis,
          riskFactors,
          defenceMechanisms,
        )

        // Determine status based on scheduled date
        const now = new Date()
        const timeDiff = scheduledDate.getTime() - now.getTime()

        let status = 'planned' // Default status
        if (step.status) {
          status = step.status
        }
        else if (timeDiff < 0) {
          status = 'sent'
        }
        else if (timeDiff < 24 * 60 * 60 * 1000) { // Less than 24 hours
          status = 'scheduled'
        }

        return {
          ...step,
          suggestedMessage,
          schedule,
          scheduledDate,
          status, // planned, scheduled, sent, converted_to_session
        }
      }),
    )

    enhancedNextSteps.value = processedSteps

    // Save to database
    await saveEnhancedNextSteps(processedSteps)

    // Create notifications for caring messages
    const createdNotifications = await createCaringNotifications(processedSteps)

    // Save notification status to database only if notifications were created
    if (createdNotifications && createdNotifications.length > 0) {
      const { updateAnalysis } = useSessionAnalysis()
      await updateAnalysis(analysisId.value, {
        notificationsCreated: true,
      })

      // Update local analysis data
      analysisData.value.notificationsCreated = true
    }

    // Update local analysis data
    analysisData.value.suggestedNextStepsForTherapistForNextSession = processedSteps

    // Show success message
    toaster.show({
      title: 'موفقیت',
      message: `${processedSteps.length} پیام مهربان تولید و زمان‌بندی شد`,
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  }
  catch (error) {
    console.error('Error generating messages:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در تولید پیام‌ها به وجود آمد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    generatingMessages.value = false
  }
}

const headlines = ref([
  {
    nameFa: 'شکایت اصلی',
    valueFa: 'مشکلات خانوادگی',
    descriptionFa: 'مریم با خانواده و بالاخص مادرش مشکل دارد. از نوجوانی این فاصله زیاد شده و الان تشدید شده است.',
  },
  {
    nameFa: 'نشانگان',
    valueFa: 'افسردگی',
    descriptionFa: 'مریم از خود نشگان قدرتمندی از افسردگی با ریشه هایی از اختلال شخصیت نشان می دهد.',
  },
  {
    nameFa: 'بنیاد شخصیت',
    valueFa: 'رشد یافته',
    descriptionFa: 'از لحاظ تحولی شخصیت مریم رشد یافته است. او از مکانیزم های دفاعی سطح بالا استفاده می کند.',
  },
  {
    nameFa: 'خطر خودکشی',
    valueFa: 'پایین',
    descriptionFa: 'مریم صریحا اعلام کرده که به خودکشی فکر نمی کند و این یک پیش آگهی خوب است.',
  },
])

onMounted(async () => {
  if (!analysisId.value) {
    toaster.clearAll()
    toaster.show({
      title: 'مشکل در بارگزاری داده',
      message: 'تحلیل با این شناسه یافت نشد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    navigateTo('/dashboard')
    return
  }
  analysisData.value = await getAnalysisById(analysisId.value)
  console.log(analysisData.value)

  // Process enhanced next steps after data is loaded
  await processEnhancedNextSteps()
})

const isLoading = ref(false)

// Detect and resolve data conflicts
const detectDataConflicts = (step: any) => {
  const notificationStatus = checkNotificationStatus(step)
  const conflicts = []

  // Check for time conflicts
  if (notificationStatus.notificationExists && notificationStatus.announceTime) {
    const dbTime = new Date(notificationStatus.announceTime)
    const stepTime = new Date(step.scheduledDate)
    const timeDiff = Math.abs(dbTime.getTime() - stepTime.getTime())

    if (timeDiff > 300000) { // More than 5 minutes difference
      conflicts.push({
        type: 'time_mismatch',
        message: 'زمان‌بندی در پایگاه داده با زمان محاسبه شده متفاوت است',
        dbTime: dbTime.toLocaleString('fa-IR'),
        stepTime: stepTime.toLocaleString('fa-IR'),
      })
    }
  }

  // Check for status conflicts
  if (notificationStatus.notificationExists) {
    const now = new Date()
    const announceTime = notificationStatus.announceTime ? new Date(notificationStatus.announceTime) : null

    if (announceTime && announceTime > now && notificationStatus.actualStatus !== 'scheduled') {
      conflicts.push({
        type: 'status_mismatch',
        message: 'وضعیت اعلان با زمان‌بندی آن مطابقت ندارد',
        expectedStatus: 'scheduled',
        actualStatus: notificationStatus.actualStatus,
      })
    }
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    notificationStatus,
  }
}

// Function to get status info with conflict detection
const getStatusInfo = (step: any) => {
  const conflictInfo = detectDataConflicts(step)
  const notificationStatus = conflictInfo.notificationStatus
  const status = notificationStatus.actualStatus

  // Add conflict indicator to the status if there are conflicts
  const conflictIndicator = conflictInfo.hasConflicts ? ' ⚠️' : ''

  switch (status) {
    case 'not_checked':
      return {
        label: 'در حال بررسی...',
        color: 'muted',
        icon: 'ph:spinner-duotone',
        bgClass: 'bg-gradient-to-r from-gray-500/15 to-slate-500/20 dark:from-gray-400/20 dark:to-slate-400/25 border border-gray-200/40 dark:border-gray-400/30',
        textClass: 'text-gray-700 dark:text-gray-300',
        iconClass: 'text-gray-600 dark:text-gray-400',
        pulseClass: 'animate-spin',
        conflicts: conflictInfo.conflicts,
      }
    case 'not_created':
      return {
        label: `پیام تولید شده${conflictIndicator}`,
        color: 'info',
        icon: 'ph:lightbulb-duotone',
        bgClass: 'bg-gradient-to-r from-blue-500/15 to-blue-600/20 dark:from-blue-400/20 dark:to-blue-500/25 border border-blue-200/30 dark:border-blue-400/20',
        textClass: 'text-blue-600 dark:text-blue-400',
        iconClass: 'text-blue-500 dark:text-blue-400',
        pulseClass: '',
        conflicts: conflictInfo.conflicts,
      }
    case 'created':
      return {
        label: `پیام ایجاد شده${conflictIndicator}`,
        color: 'info',
        icon: 'ph:check-square-duotone',
        bgClass: 'bg-gradient-to-r from-blue-500/15 to-blue-600/20 dark:from-blue-400/20 dark:to-blue-500/25 border border-blue-200/30 dark:border-blue-400/20',
        textClass: 'text-blue-600 dark:text-blue-400',
        iconClass: 'text-blue-500 dark:text-blue-400',
        pulseClass: '',
        conflicts: conflictInfo.conflicts,
      }
    case 'scheduled':
      return {
        label: `در صف ارسال${conflictIndicator}`,
        color: 'warning',
        icon: 'ph:clock-countdown-duotone',
        bgClass: conflictInfo.hasConflicts
          ? 'bg-gradient-to-r from-red-500/15 to-orange-500/20 dark:from-red-400/20 dark:to-orange-400/25 border border-red-200/40 dark:border-red-400/30'
          : 'bg-gradient-to-r from-amber-500/15 to-orange-500/20 dark:from-amber-400/20 dark:to-orange-400/25 border border-amber-200/40 dark:border-amber-400/30 shadow-amber-100/50 dark:shadow-amber-900/20',
        textClass: conflictInfo.hasConflicts
          ? 'text-red-700 dark:text-red-300'
          : 'text-amber-700 dark:text-amber-300',
        iconClass: conflictInfo.hasConflicts
          ? 'text-red-600 dark:text-red-400'
          : 'text-amber-600 dark:text-amber-400',
        pulseClass: 'animate-pulse',
        conflicts: conflictInfo.conflicts,
      }
    case 'sent':
      return {
        label: notificationStatus.isRead ? `ارسال و خوانده شده${conflictIndicator}` : `ارسال شده${conflictIndicator}`,
        color: notificationStatus.isRead ? 'success' : 'primary',
        icon: notificationStatus.isRead ? 'ph:check-circle-duotone' : 'ph:paper-plane-duotone',
        bgClass: notificationStatus.isRead
          ? 'bg-gradient-to-r from-emerald-500/15 to-green-500/20 dark:from-emerald-400/20 dark:to-green-400/25 border border-emerald-200/40 dark:border-emerald-400/30'
          : 'bg-gradient-to-r from-purple-500/15 to-indigo-500/20 dark:from-purple-400/20 dark:to-indigo-400/25 border border-purple-200/40 dark:border-purple-400/30',
        textClass: notificationStatus.isRead
          ? 'text-emerald-700 dark:text-emerald-300'
          : 'text-purple-700 dark:text-purple-300',
        iconClass: notificationStatus.isRead
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-purple-600 dark:text-purple-400',
        pulseClass: '',
        conflicts: conflictInfo.conflicts,
      }
    case 'converted_to_session':
      return {
        label: `تبدیل به جلسه${conflictIndicator}`,
        color: 'primary',
        icon: 'ph:video-camera-duotone',
        bgClass: 'bg-gradient-to-r from-purple-500/15 to-indigo-500/20 dark:from-purple-400/20 dark:to-indigo-400/25 border border-purple-200/40 dark:border-purple-400/30',
        textClass: 'text-purple-700 dark:text-purple-300',
        iconClass: 'text-purple-600 dark:text-purple-400',
        pulseClass: '',
        conflicts: conflictInfo.conflicts,
      }
    default:
      return {
        label: `نامشخص${conflictIndicator}`,
        color: 'muted',
        icon: 'ph:question-duotone',
        bgClass: 'bg-gradient-to-r from-gray-500/15 to-slate-500/20 dark:from-gray-400/20 dark:to-slate-400/25 border border-gray-200/40 dark:border-gray-400/30',
        textClass: 'text-gray-700 dark:text-gray-300',
        iconClass: 'text-gray-600 dark:text-gray-400',
        pulseClass: '',
        conflicts: conflictInfo.conflicts,
      }
  }
}

</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div
          class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row"
        >
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Doctor illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>بررسی کیفی و کمی اطلاعات</span>
              </BaseHeading>
              <BaseParagraph size="lg" class="text-white opacity-80">
                <span class="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span class="text-white/80">گزارش تحلیلی جلسه درمانی</span>
                  <BaseAvatar
                    :src="getUserAvatarUrl(analysisData?.expand?.session?.expand?.user) || '/img/avatars/default-male.jpg'"
                    :text="analysisData?.expand?.session?.expand?.user.meta.name?.substring(0, 2) || 'کا'"
                    size="xs"
                    class="inline-block align-middle"
                  />
                  <span class="font-bold text-white">
                    {{ analysisData?.expand?.session?.expand?.user.meta.name }}
                  </span>
                  <span class="rounded-full bg-white/10 px-2 py-0.5 text-sm text-white/80">با</span>
                  <span class="font-bold text-white">
                    {{ analysisData?.expand?.session?.expand?.therapist?.name }}
                  </span>
                </span>
              </BaseParagraph>
              <div
                class="mt-6 flex flex-wrap gap-4 pb-4 text-center sm:mt-4 sm:pb-0 sm:text-right"
              >
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="flex items-center gap-1 text-xs font-medium text-white/50">
                      <Icon name="ph:play-circle-duotone" class="size-3" />
                      شروع جلسه
                    </span>
                    <div class="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <Icon name="ph:calendar-duotone" class="size-4 text-white/70" />
                      <span class="text-sm font-bold text-white">
                        {{ new Date(analysisData?.expand?.session?.start_time).toLocaleString('fa').split(', ').reverse().join(' - ') }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="flex items-center gap-1 text-xs font-medium text-white/50">
                      <Icon name="ph:stop-circle-duotone" class="size-3" />
                      پایان جلسه
                    </span>
                    <div class="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <Icon name="ph:calendar-duotone" class="size-4 text-white/70" />
                      <span class="text-sm font-bold text-white">
                        {{ new Date(analysisData?.expand?.session?.end_time).toLocaleString('fa').split(', ').reverse().join(' - ') }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="flex items-center gap-1 text-xs font-medium text-white/50">
                      <Icon
                        :name="analysisData?.expand?.session?.status === 'done' ? 'ph:check-circle-duotone' : 'ph:clock-duotone'"
                        class="size-3"
                      />
                      وضعیت
                    </span>
                    <div
                      class="flex items-center gap-2 rounded-xl px-4 py-2"
                      :class="{
                        'bg-success-500/20 backdrop-blur-sm': analysisData?.expand?.session?.status === 'done',
                        'bg-info-500/20 backdrop-blur-sm': analysisData?.expand?.session?.status !== 'done'
                      }"
                    >
                      <Icon
                        :name="analysisData?.expand?.session?.status === 'done' ? 'ph:check-circle-fill' : 'ph:clock-fill'"
                        class="size-4"
                        :class="{
                          'text-success-400': analysisData?.expand?.session?.status === 'done',
                          'text-info-400': analysisData?.expand?.session?.status !== 'done'
                        }"
                      />
                      <span
                        class="text-sm font-bold"
                        :class="{
                          'text-success-400': analysisData?.expand?.session?.status === 'done',
                          'text-info-400': analysisData?.expand?.session?.status !== 'done'
                        }"
                      >
                        {{ analysisData?.expand?.session?.status === 'done' ? 'جلسه پایان یافته' : 'جلسه در حال برگزاری' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="flex items-center gap-1 text-xs font-medium text-white/50">
                      <Icon name="ph:chat-circle-duotone" class="size-3" />
                      تعداد پیام‌ها
                    </span>
                    <div class="bg-primary-500/20 flex items-center gap-2 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <Icon name="ph:chat-circle-fill" class="text-primary-400 size-4" />
                      <span class="text-primary-400 text-sm font-bold">
                        {{ analysisData?.expand?.session?.count_of_total_messages }} پیام
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="mt-4 flex justify-center gap-3 sm:justify-end">
                <BaseButton
                  color="warning"
                  shape="curved"
                  @click="navigateTo(`/darmana/therapists/history?sessionId=${analysisData?.expand?.session?.id}`)"
                >
                  <Icon name="ph:clock-counter-clockwise-duotone" class="ml-1 size-4" />
                  پیام های جلسه
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Session Title -->
      <div class="col-span-12">
        <BaseCard shape="curved" class="p-6">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>موضوع جلسه</span>
            </BaseHeading>
          </div>
          <div class="mt-2 text-center">
            <span class="text-primary-500 text-xl font-bold">{{ analysisData?.title || 'بدون عنوان' }}</span>
          </div>
        </BaseCard>
      </div>

      <!-- Icon box -->
      <div
        v-for="(headline, index) in headlinesComputed"
        :key="index"
        class="col-span-6 sm:col-span-3"
      >
        <div class="flex h-full flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox size="md" class="bg-primary-500/10">
              <Icon name="ph:clipboard" class="text-primary-500 size-5" />
            </BaseIconBox>
            <div>
              <div class="flex items-center gap-1 font-sans">
                <span>{{ headline.title }}</span>
              </div>
              <BaseParagraph size="xs" class="text-muted-400">
                <span>
                  {{ headline.description }}
                </span>
              </BaseParagraph>
            </div>
          </div>
          <div class="mt-auto">
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 mb-3 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Column -->
      <div class="col-span-12">
        <!-- Inner grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Inner column -->
          <div class="ltablet:col-span-12 col-span-12 lg:col-span-12">
            <!-- Chart subgrid -->
            <div class="col-span-12 sm:col-span-12">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>خلاصه پیام های جلسه</span>
                  </BaseHeading>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      پیام های رد و بدل شده بین کاربر و مشاور به صورت محتوایی بررسی شده و خلاصه سازی
                      گردیده است.
                    </span>
                    <NuxtLink
                      to="#"
                      class="text-primary-500 underline-offset-4 hover:underline"
                    >
                      اطلاعات بیشتر
                    </NuxtLink>
                  </BaseParagraph>
                </div>
                <div class="mt-5 text-justify">
                  {{ analysisData?.summaryOfSession || 'در حال حاضر اطلاعاتی وجود ندارد.' }}
                </div>
                <!-- <AddonApexcharts v-bind="scatterEnergy" /> -->
              </BaseCard>
            </div>
            <!-- <div class="col-span-12 mt-5">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>مدیریت رویداد</span>
                  </BaseHeading>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      لیست اقدامات و رویدادهای تعاملی هوش مصنوعی با کاربر در زیر
                      آمده است.
                    </span>
                  </BaseParagraph>
                </div>
              </BaseCard>
            </div> -->
            <div class="col-span-12 mt-5">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h2"
                    size="md"
                    weight="medium"
                    class="text-muted-800 mb-3 dark:text-white"
                  >
                    <span>بررسی درمانگر</span>
                  </BaseHeading>
                </div>

                <!-- Score Card -->
                <div class="grid w-full gap-6">
                  <!-- Score and Description Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <!-- Score Card -->
                    <div class="bg-muted-800 dark:bg-muted-900 relative h-[400px] overflow-hidden rounded-2xl p-6">
                      <div class="bg-primary-500/10 pointer-events-none absolute right-0 top-0 size-32 rounded-bl-[6rem]" />
                      <div class="bg-primary-500/5 pointer-events-none absolute bottom-0 left-0 size-24 rounded-tr-[4rem]" />
                      <div class="relative z-10">
                        <!-- Header -->
                        <div class="mb-8 flex items-center justify-between">
                          <h3 class="flex items-center gap-2 text-lg font-semibold text-white">
                            <Icon name="ph:star-duotone" class="text-primary-500 size-6" />
                            امتیاز درمانگر
                          </h3>
                          <div class="bg-primary-500/10 flex items-center gap-1 rounded-lg px-3 py-1">
                            <Icon name="ph:trend-up-duotone" class="text-primary-400 size-4" />
                            <span class="text-primary-400 text-sm">عملکرد مثبت</span>
                          </div>
                        </div>

                        <!-- Main Score -->
                        <div class="mb-8 flex items-center justify-center">
                          <div class="text-center">
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-primary-400 text-xl font-medium">100/</span>
                              <span class="text-primary-500 text-7xl font-bold leading-none tracking-tight">
                                {{
                                  100 - (analysisData.negativeScoresList?.reduce((total: number, item: any) => total + (item.points || 0), 0) || 0)
                                }}
                              </span>
                            </div>
                            <div class="text-primary-400 mt-2 flex items-center justify-center gap-1">
                              <Icon name="ph:chart-bar-duotone" class="size-5" />
                              <span class="text-sm">امتیاز کلی</span>
                            </div>
                          </div>
                        </div>

                        <!-- Performance Metrics -->
                        <div class="grid grid-cols-2 gap-4">
                          <div class="bg-muted-900/50 rounded-xl p-4">
                            <div class="mb-3 flex items-center justify-center gap-2">
                              <Icon name="ph:timer-duotone" class="text-primary-400 size-5" />
                              <span class="text-muted-200 text-sm">زمان جلسه</span>
                            </div>
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-2xl font-semibold text-white">{{ analysisData?.expand?.session?.total_time_passed }}</span>
                              <span class="text-muted-400 text-sm">دقیقه</span>
                            </div>
                          </div>
                          <div class="bg-muted-900/50 rounded-xl p-4">
                            <div class="mb-3 flex items-center justify-center gap-2">
                              <Icon name="ph:chats-circle-duotone" class="text-primary-400 size-5" />
                              <span class="text-muted-200 text-sm">تعداد پیام‌ها</span>
                            </div>
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-2xl font-semibold text-white">{{ analysisData?.expand?.session?.count_of_total_messages }}</span>
                              <span class="text-muted-400 text-sm">پیام</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-4">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:user-circle-gear-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          بررسی عملکرد درمانگر
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.psychotherapistEvaluation }}
                      </p>
                    </div>
                  </div>
                  <!-- Therapist Evaluation Sections -->
                  <div class="mt-6 grid grid-cols-1 gap-6">
                    <!-- Negative Points and Positive Behaviors in one row -->
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <!-- Negative Points List -->
                      <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                        <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                          <Icon name="ph:minus-circle-duotone" class="text-danger-500 size-6" />
                          <span>نقاط منفی</span>
                        </h3>
                        <div class="grid gap-3">
                          <div
                            v-for="(item, index) in analysisData.negativeScoresList"
                            :key="index"
                            class="bg-danger-500/5 border-danger-500/20 dark:bg-danger-500/10 dark:border-danger-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                          >
                            <div class="flex items-start gap-3">
                              <div class="bg-danger-500/10 dark:bg-danger-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <span class="text-danger-500 font-bold">{{ item.points }}-</span>
                              </div>
                              <div class="flex-1">
                                <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                  {{ item.cause }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <!-- Empty state for negative points -->
                          <div
                            v-if="!analysisData.negativeScoresList || analysisData.negativeScoresList.length === 0"
                            class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                          >
                            <Icon name="ph:smiley" class="text-muted-400 mx-auto mb-2 size-6" />
                            <p class="text-muted-500 dark:text-muted-400 text-sm">
                              هیچ نقطه منفی برای این جلسه ثبت نشده است.
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Positive Behaviors List -->
                      <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                        <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-6" />
                          <span>رفتارهای مثبت</span>
                        </h3>
                        <div class="grid gap-3">
                          <div
                            v-for="(item, index) in analysisData.psychotherapistEvaluationScorePositiveBehavior"
                            :key="index"
                            class="bg-success-500/5 border-success-500/20 dark:bg-success-500/10 dark:border-success-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                          >
                            <div class="flex items-start gap-3">
                              <div class="bg-success-500/10 dark:bg-success-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <Icon name="ph:check-bold" class="text-success-500 size-4" />
                              </div>
                              <div class="flex-1">
                                <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                  {{ item }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <!-- Empty state for positive behaviors -->
                          <div
                            v-if="!analysisData.psychotherapistEvaluationScorePositiveBehavior || analysisData.psychotherapistEvaluationScorePositiveBehavior.length === 0"
                            class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                          >
                            <Icon name="ph:note-pencil" class="text-muted-400 mx-auto mb-2 size-6" />
                            <p class="text-muted-500 dark:text-muted-400 text-sm">
                              هنوز هیچ رفتار مثبتی برای این جلسه ثبت نشده است.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Suggestions to Improve List -->
                    <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                      <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                        <Icon name="ph:lightbulb-duotone" class="text-primary-500 size-6" />
                        <span>پیشنهادات بهبود</span>
                      </h3>
                      <div class="grid gap-3">
                        <div
                          v-for="(item, index) in analysisData.psychotherapistEvaluationScoreSuggestionsToImprove"
                          :key="index"
                          class="bg-primary-500/5 border-primary-500/20 dark:bg-primary-500/10 dark:border-primary-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                        >
                          <div class="flex items-start gap-3">
                            <div class="bg-primary-500/10 dark:bg-primary-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                              <Icon name="ph:arrow-up-right" class="text-primary-500 size-4" />
                            </div>
                            <div class="flex-1">
                              <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                {{ item }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <!-- Empty state for suggestions -->
                        <div
                          v-if="!analysisData.psychotherapistEvaluationScoreSuggestionsToImprove || analysisData.psychotherapistEvaluationScoreSuggestionsToImprove.length === 0"
                          class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                        >
                          <Icon name="ph:lightbulb" class="text-muted-400 mx-auto mb-2 size-6" />
                          <p class="text-muted-500 dark:text-muted-400 text-sm">
                            هیچ پیشنهادی برای بهبود در این جلسه ثبت نشده است.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
            <div class="mt-5 grid grid-cols-12 gap-6">
              <!-- Chart -->
              <div class="col-span-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اطلاعات دموگرافیک</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        اطلاعات دموگرافیک کاربر که می تواند توسط خود کاربر اظهار
                        شده یا در جریان مصاحبه و گفت و گو استخراج گردد.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <div class="relative mt-5">
                    <div class="grid grid-cols-12 gap-4">
                      <!-- First Name -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">نام</label>
                          <span v-if="analysisData.demographicData?.firstName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.firstName || ''"
                          disabled
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="نام"
                          :class="{'opacity-50': !analysisData.demographicData?.firstName}"
                        />
                      </div>

                      <!-- Last Name -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">نام خانوادگی</label>
                          <span v-if="analysisData.demographicData?.lastName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.lastName || ''"
                          disabled
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="نام خانوادگی"
                          :class="{'opacity-50': !analysisData.demographicData?.lastName}"
                        />
                      </div>

                      <!-- Age -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">سن</label>
                          <span v-if="analysisData.demographicData?.age" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.age || ''"
                          disabled
                          type="number"
                          icon="ph:calendar-duotone"
                          placeholder="سن"
                          :class="{'opacity-50': !analysisData.demographicData?.age}"
                        />
                      </div>

                      <!-- Gender -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">جنسیت</label>
                          <span v-if="analysisData.demographicData?.gender" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.gender || ''"
                          disabled
                          placeholder="جنسیت"
                          :class="{'opacity-50': !analysisData.demographicData?.gender}"
                        >
                          <option value="">
                            جنسیت
                          </option>
                          <option value="male">
                            مرد
                          </option>
                          <option value="female">
                            زن
                          </option>
                          <option value="other">
                            دیگر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Education -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">تحصیلات</label>
                          <span v-if="analysisData.demographicData?.education" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.education || ''"
                          disabled
                          placeholder="تحصیلات"
                          :class="{'opacity-50': !analysisData.demographicData?.education}"
                        >
                          <option value="">
                            تحصیلات
                          </option>
                          <option value="under diploma">
                            زیر دیپلم
                          </option>
                          <option value="diploma">
                            دیپلم
                          </option>
                          <option value="bachelor">
                            کارشناسی
                          </option>
                          <option value="master">
                            کارشناسی ارشد
                          </option>
                          <option value="phd">
                            دکتری
                          </option>
                          <option value="other">
                            سایر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Occupation -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">شغل</label>
                          <span v-if="analysisData.demographicData?.occupation" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.occupation || ''"
                          disabled
                          placeholder="شغل"
                          :class="{'opacity-50': !analysisData.demographicData?.occupation}"
                        >
                          <option value="">
                            شغل
                          </option>
                          <option value="student">
                            دانشجو
                          </option>
                          <option value="employed">
                            کارمند
                          </option>
                          <option value="self-employed">
                            آزاد
                          </option>
                          <option value="unemployed">
                            بیکار
                          </option>
                          <option value="retired">
                            بازننشسته
                          </option>
                          <option value="householder">
                            خانه‌دار
                          </option>
                          <option value="other">
                            سایر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Marital Status -->
                      <div class="col-span-12">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">وضعیت تأهل</label>
                          <span v-if="analysisData.demographicData?.maritalStatus" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.maritalStatus || ''"
                          disabled
                          placeholder="وضعیت تأهل"
                          :class="{'opacity-50': !analysisData.demographicData?.maritalStatus}"
                        >
                          <option value="">
                            وضعیت تأهل
                          </option>
                          <option value="single">
                            مجرد
                          </option>
                          <option value="married">
                            متأهل
                          </option>
                          <option value="divorced">
                            مطلقه
                          </option>
                          <option value="widowed">
                            بیوه
                          </option>
                        </BaseSelect>
                      </div>
                    </div>

                    <!-- No Data Overlay -->
                    <div
                      v-if="!analysisData.demographicData ||
                        Object.values(analysisData.demographicData).every(value => !value)"
                      class="bg-muted-100/50 dark:bg-muted-900/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm"
                    >
                      <div class="text-center">
                        <Icon
                          name="ph:user-circle-minus-duotone"
                          class="text-muted-400 mb-2 size-12"
                        />
                        <p class="text-muted-500 dark:text-muted-400">
                          اطلاعات جمعیت‌شناختی در دسترس نیست
                        </p>
                      </div>
                    </div>
                  </div>
                  <TairoFormGroup
                    class="mt-5"
                    label="تحلیل‌های روانشناختی"
                    sublabel="خلاصه تحلیل‌های رفتاری، احساسی و نگرانی‌های مراجع"
                  >
                    <div
                      v-if="!analysisData.behavioralAnalysisSummary && !analysisData.emotionalAnalysisSummary && !analysisData.thoughtsAndConcernsSummary"
                      class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-6 text-center"
                    >
                      <Icon
                        name="ph:note-pencil-duotone"
                        class="text-muted-400 mb-2 size-12"
                      />
                      <p class="text-muted-500 dark:text-muted-400">
                        هنوز تحلیلی ثبت نشده است
                      </p>
                    </div>

                    <div v-else class="grid gap-6">
                      <!-- Behavioral Analysis -->
                      <div
                        v-if="analysisData.behavioralAnalysisSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:brain-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            تحلیل رفتاری
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.behavioralAnalysisSummary }}
                        </p>
                      </div>

                      <!-- Emotional Analysis -->
                      <div
                        v-if="analysisData.emotionalAnalysisSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:heart-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            تحلیل احساسی
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.emotionalAnalysisSummary }}
                        </p>
                      </div>

                      <!-- Thoughts and Concerns -->
                      <div
                        v-if="analysisData.thoughtsAndConcernsSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:lightbulb-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            افکار و نگرانی‌ها
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.thoughtsAndConcernsSummary }}
                        </p>
                      </div>
                    </div>
                  </TairoFormGroup>
                </BaseCard>
              </div>
              <div class="col-span-4">
                <BaseCard class="p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>ارزیابی اعتماد</span>
                    </BaseHeading>
                  </div>
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      میزان مشارکت و اعتماد ارزیابی شده از پیام های کاربر
                    </span>
                  </BaseParagraph>
                  <div
                    class="mt-[80px] flex flex-col gap-6 md:flex-row md:items-end"
                  >
                    <div class="w-full max-w-sm space-y-4 px-4">
                      <!-- Slider component with custom formatting -->
                      <Slider
                        v-model="trustLevelComputed"
                        :format="formatEmoji"
                        class="rounded-tooltip"
                      />
                    </div>
                  </div>
                  <p class="mt-5 text-justify">
                    {{ analysisData.finalTrustAndOppennessOfUserEvaluationDescription }}
                  </p>
                </BaseCard>
                <!-- Possible Risk Factors -->
                <div class="col-span-12 my-6">
                  <BaseCard shape="curved" class="p-6">
                    <div class="mb-2 flex items-center justify-between">
                      <BaseHeading
                        as="h3"
                        size="md"
                        weight="semibold"
                        lead="tight"
                        class="text-muted-800 dark:text-white"
                      >
                        <span>عوامل خطر احتمالی</span>
                      </BaseHeading>
                    </div>
                    <div class="flex justify-between">
                      <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                        <Icon name="ph:warning-duotone" class="size-4" />
                        <span>
                          عوامل خطر شناسایی شده که نیاز به توجه ویژه دارند
                        </span>
                      </BaseParagraph>
                    </div>

                    <!-- Risk Factors List -->
                    <div v-if="analysisData.possibleRiskFactorsExtracted?.length > 0" class="mt-6">
                      <div class="grid gap-4">
                        <div
                          v-for="(risk, index) in analysisData.possibleRiskFactorsExtracted"
                          :key="index"
                          class="group relative"
                        >
                          <BaseCard
                            shape="rounded"
                            class="border-warning-100 dark:border-warning-500/20 border-2 p-4 transition-all hover:shadow-lg"
                          >
                            <div class="flex w-full items-start gap-3">
                              <div class="bg-warning-500/10 dark:bg-warning-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <Icon
                                  name="ph:warning-circle-duotone"
                                  class="text-warning-500 size-5"
                                />
                              </div>
                              <div class="flex-1">
                                <BaseHeading
                                  as="h4"
                                  size="sm"
                                  weight="medium"
                                  lead="none"
                                  class="mb-3"
                                >
                                  {{ risk.title }}
                                </BaseHeading>
                                <BaseText size="xs" class="text-muted-400">
                                  {{ risk.description }}
                                </BaseText>
                              </div>
                            </div>
                          </BaseCard>
                        </div>
                      </div>
                    </div>
                    <div v-else class="mt-6 text-center">
                      <Icon
                        name="ph:shield-check-duotone"
                        class="text-muted-400 mb-2 size-12"
                      />
                      <BaseText size="sm" class="text-muted-400">
                        در حال حاضر عامل خطر قابل توجهی شناسایی نشده است.
                      </BaseText>
                    </div>
                  </BaseCard>
                </div>
              </div>
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>وضعیت روانی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:brain-duotone" class="size-4" />
                      <span>
                        تحلیل روانی پیام های کاربر نشان می دهد که وی در چه
                        وضعیتی از لحاظ ارتباط روانی با هوش مصنوعی است.
                      </span>
                    </BaseParagraph>
                  </div>

                  <!-- Main Analysis -->
                  <div v-if="analysisData.psychoAnalysis" class="mt-5">
                    <div class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-4">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:brain-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          تحلیل روانشناختی
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.psychoAnalysis }}
                      </p>
                    </div>
                  </div>

                  <!-- Defense Mechanisms -->
                  <div v-if="analysisData.detectedDefenceMechanisms?.length > 0" class="mt-6">
                    <h4 class="text-muted-800 dark:text-muted-100 mb-4 flex items-center gap-2 font-semibold">
                      <Icon name="ph:shield-duotone" class="text-primary-500 size-5" />
                      مکانیزم‌های دفاعی شناسایی شده
                    </h4>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <div
                        v-for="mechanism in analysisData.detectedDefenceMechanisms"
                        :key="mechanism.name"
                        class="group relative"
                      >
                        <BaseCard
                          shape="rounded"
                          class="border-2 p-4 transition-all duration-300 hover:shadow-lg"
                          :class="{
                            'border-success-500 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-500/10': mechanism.confidence === 'very_high',
                            'border-info-500 dark:border-info-400 hover:bg-info-50 dark:hover:bg-info-500/10': mechanism.confidence === 'high',
                            'border-warning-500 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-500/10': mechanism.confidence === 'low',
                            'border-muted-300 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800': mechanism.confidence === 'very_low'
                          }"
                        >
                          <div class="flex w-full items-start gap-3">
                            <div
                              class="rounded-lg p-2"
                              :class="{
                                'bg-success-500/10 dark:bg-success-500/20': mechanism.confidence === 'very_high',
                                'bg-info-500/10 dark:bg-info-500/20': mechanism.confidence === 'high',
                                'bg-warning-500/10 dark:bg-warning-500/20': mechanism.confidence === 'low',
                                'bg-muted-300/10 dark:bg-muted-700/20': mechanism.confidence === 'very_low'
                              }"
                            >
                              <Icon
                                :name="mechanism.name.toLowerCase().includes('انکار') ? 'ph:prohibit-duotone' :
                                  mechanism.name.toLowerCase().includes('فرافکنی') ? 'ph:arrows-out-duotone' :
                                  mechanism.name.toLowerCase().includes('درون‌فکنی') ? 'ph:arrow-fat-lines-down-duotone' :
                                  mechanism.name.toLowerCase().includes('جابجایی') ? 'ph:arrows-left-right-duotone' :
                                  mechanism.name.toLowerCase().includes('واکنش') ? 'ph:arrows-out-duotone' :
                                  mechanism.name.toLowerCase().includes('دلیل') ? 'ph:brain-duotone' : 'ph:shield-duotone'"
                                class="size-5"
                                :class="{
                                  'text-success-500': mechanism.confidence === 'very_high',
                                  'text-info-500': mechanism.confidence === 'high',
                                  'text-warning-500': mechanism.confidence === 'low',
                                  'text-muted-300': mechanism.confidence === 'very_low'
                                }"
                              />
                            </div>
                            <div class="flex-1">
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="mb-3 flex items-center justify-between gap-2"
                              >
                                {{ mechanism.name }}
                                <div class="flex items-center gap-2">
                                  <div class="text-xs">
                                    <Icon name="ph:target" class="size-4" />
                                  </div>
                                  <div
                                    v-for="i in 4"
                                    :key="i"
                                    class="size-1.5 rounded-full transition-all duration-300"
                                    :class="{
                                      'bg-success-500': mechanism.confidence === 'very_high' && i <= 4,
                                      'bg-info-500': mechanism.confidence === 'high' && i <= 3,
                                      'bg-warning-500': mechanism.confidence === 'low' && i <= 2,
                                      'bg-muted-300': mechanism.confidence === 'very_low' && i <= 1,
                                      'bg-muted-200 dark:bg-muted-700':
                                        (mechanism.confidence === 'very_high' && i > 4) ||
                                        (mechanism.confidence === 'high' && i > 3) ||
                                        (mechanism.confidence === 'low' && i > 2) ||
                                        (mechanism.confidence === 'very_low' && i > 1)
                                    }"
                                  />
                                </div>
                              </BaseHeading>
                              <BaseText size="xs" class="text-muted-400 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                                {{ mechanism.evidence }}
                              </BaseText>
                            </div>
                          </div>
                        </BaseCard>
                      </div>
                    </div>
                  </div>

                  <!-- Schemas -->
                  <div v-if="analysisData.detectedSchemas?.length > 0" class="mt-6">
                    <h4 class="text-muted-800 dark:text-muted-100 mb-4 flex items-center gap-2 font-semibold">
                      <Icon name="ph:tree-structure-duotone" class="text-primary-500 size-5" />
                      طرحواره‌های شناسایی شده
                    </h4>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <div
                        v-for="schema in analysisData.detectedSchemas"
                        :key="schema.name"
                        class="group relative"
                      >
                        <BaseCard
                          shape="rounded"
                          class="border-2 p-4 transition-all duration-300 hover:shadow-lg"
                          :class="{
                            'border-success-500 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-500/10': schema.confidence === 'very_high',
                            'border-info-500 dark:border-info-400 hover:bg-info-50 dark:hover:bg-info-500/10': schema.confidence === 'high',
                            'border-warning-500 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-500/10': schema.confidence === 'low',
                            'border-muted-300 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800': schema.confidence === 'very_low'
                          }"
                        >
                          <div class="flex w-full items-start gap-3">
                            <div
                              class="rounded-lg p-2"
                              :class="{
                                'bg-success-500/10 dark:bg-success-500/20': schema.confidence === 'very_high',
                                'bg-info-500/10 dark:bg-info-500/20': schema.confidence === 'high',
                                'bg-warning-500/10 dark:bg-warning-500/20': schema.confidence === 'low',
                                'bg-muted-300/10 dark:bg-muted-700/20': schema.confidence === 'very_low'
                              }"
                            >
                              <Icon
                                :name="schema.name.toLowerCase().includes('رهاشدگی') ? 'ph:person-simple-walk-duotone' :
                                  schema.name.toLowerCase().includes('بی‌اعتمادی') ? 'ph:warning-circle-duotone' :
                                  schema.name.toLowerCase().includes('نقص') ? 'ph:puzzle-piece-duotone' :
                                  schema.name.toLowerCase().includes('انزوا') ? 'ph:user-circle-minus-duotone' :
                                  schema.name.toLowerCase().includes('شکست') ? 'ph:x-circle-duotone' :
                                  schema.name.toLowerCase().includes('وابستگی') ? 'ph:link-duotone' : 'ph:tree-structure-duotone'"
                                class="size-5"
                                :class="{
                                  'text-success-500': schema.confidence === 'very_high',
                                  'text-info-500': schema.confidence === 'high',
                                  'text-warning-500': schema.confidence === 'low',
                                  'text-muted-300': schema.confidence === 'very_low'
                                }"
                              />
                            </div>
                            <div class="flex-1">
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="mb-3 flex items-center justify-between gap-2"
                              >
                                {{ schema.name }}
                                <div class="flex items-center gap-1">
                                  <div class="text-xs">
                                    <Icon name="ph:target" class="size-4" />
                                  </div>
                                  <div
                                    v-for="i in 4"
                                    :key="i"
                                    class="size-1.5 rounded-full transition-all duration-300"
                                    :class="{
                                      'bg-success-500': schema.confidence === 'very_high' && i <= 4,
                                      'bg-info-500': schema.confidence === 'high' && i <= 3,
                                      'bg-warning-500': schema.confidence === 'low' && i <= 2,
                                      'bg-muted-300': schema.confidence === 'very_low' && i <= 1,
                                      'bg-muted-200 dark:bg-muted-700':
                                        (schema.confidence === 'very_high' && i > 4) ||
                                        (schema.confidence === 'high' && i > 3) ||
                                        (schema.confidence === 'low' && i > 2) ||
                                        (schema.confidence === 'very_low' && i > 1)
                                    }"
                                  />
                                </div>
                              </BaseHeading>
                              <BaseText size="xs" class="text-muted-400 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                                {{ schema.evidence }}
                              </BaseText>
                            </div>
                          </div>
                        </BaseCard>
                      </div>
                    </div>
                  </div>
                </BaseCard>
              </div>
              <!-- Possible Deeper Goals of Patient -->
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اهداف عمیق‌تر احتمالی مراجع</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:target-duotone" class="size-4" />
                      <span>
                        تحلیل اهداف و انگیزه‌های عمیق‌تر مراجع که ممکن است به صورت صریح بیان نشده باشند
                      </span>
                    </BaseParagraph>
                  </div>
                  <div v-if="analysisData.possibleDeeperGoalsOfPatient" class="mt-5">
                    <div class="bg-muted-100 dark:bg-muted-800/50 border-primary-100 dark:border-primary-500/20 rounded-xl border p-4 transition-all hover:shadow-md">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:target-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          اهداف عمیق‌تر
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.possibleDeeperGoalsOfPatient }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="mt-6 text-center">
                    <Icon
                      name="ph:target-duotone"
                      class="text-muted-400 mb-2 size-12"
                    />
                    <BaseText size="sm" class="text-muted-400">
                      در حال حاضر تحلیلی از اهداف عمیق‌تر مراجع وجود ندارد.
                    </BaseText>
                  </div>
                </BaseCard>
              </div>
              <!-- Suggested Next Steps for Therapist -->
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="border-primary-100/30 dark:border-primary-500/20 overflow-hidden border-2 p-0">
                  <!-- Header Section with Gradient -->
                  <div class="from-primary-500/10 via-primary-400/5 dark:from-primary-600/20 dark:via-primary-500/10 border-primary-100/30 dark:border-primary-500/20 border-b bg-gradient-to-r to-orange-400/10 p-6 dark:to-orange-500/15">
                    <div class="mb-2 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="from-primary-500 dark:from-primary-400 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br to-orange-500 shadow-lg dark:to-orange-400">
                          <Icon name="ph:magic-wand-duotone" class="size-7 text-white" />
                        </div>
                        <div>
                          <BaseHeading
                            as="h3"
                            size="xl"
                            weight="bold"
                            lead="tight"
                            class="text-muted-800 mb-1 dark:text-white"
                          >
                            <span>پیشنهادات برای جلسه بعدی</span>
                          </BaseHeading>
                          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                            <Icon name="ph:heart-duotone" class="ml-1 inline size-4" />
                            <span>
                              پیشنهادات مهربانانه و زمان‌بندی مناسب برای ادامه ارتباط با مراجع
                            </span>
                          </BaseParagraph>
                        </div>
                      </div>
                      <div class="dark:bg-muted-800/60 rounded-xl bg-white/60 px-4 py-2 backdrop-blur-sm">
                        <span class="text-primary-600 dark:text-primary-400 text-sm font-semibold">
                          تولید شده با هوش مصنوعی
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Content Section -->
                  <div class="p-6">
                    <!-- Notifications Status -->
                    <div v-if="notificationsCreated || enhancedNextSteps.length > 0" class="mb-6">
                      <div class="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-700 dark:from-emerald-900/20 dark:to-teal-900/20">
                        <div class="flex items-center gap-3">
                          <div class="rounded-lg bg-emerald-500/10 p-2 dark:bg-emerald-500/20">
                            <Icon name="ph:bell-simple-duotone" class="size-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div class="flex-1">
                            <h4 class="font-semibold text-emerald-800 dark:text-emerald-200">
                              وضعیت اعلان‌ها
                            </h4>
                            <p class="text-sm text-emerald-700 dark:text-emerald-300">
                              {{ notificationsCreated ?
                                `${enhancedNextSteps.length} اعلان زمان‌بندی شده ایجاد و برنامه‌ریزی شد` :
                                `${enhancedNextSteps.length} پیام آماده زمان‌بندی هستند`
                              }}
                            </p>
                          </div>
                          <div class="flex items-center gap-2">
                            <div
                              :class="[
                                'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                                notificationsCreated
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
                              ]"
                            >
                              <Icon
                                :name="notificationsCreated ? 'ph:check-circle-fill' : 'ph:clock-fill'"
                                class="size-3"
                              />
                              <span>{{ notificationsCreated ? 'زمان‌بندی شده' : 'آماده زمان‌بندی' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Enhanced Next Steps List -->
                    <div v-if="generatingMessages" class="mt-6 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-3">
                          <Icon name="ph:spinner-duotone" class="text-primary-500 size-6 animate-spin" />
                        </div>
                        <div>
                          <p class="text-muted-800 dark:text-muted-200 font-medium">
                            در حال تولید پیام‌های مهربان...
                          </p>
                          <p class="text-muted-500 text-sm">
                            لطفاً کمی صبر کنید
                          </p>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="enhancedNextSteps.length > 0" class="mt-6">
                      <div class="grid gap-6">
                        <div
                          v-for="(step, index) in enhancedNextSteps"
                          :key="index"
                          class="group relative"
                        >
                          <BaseCard
                            shape="rounded"
                            class="border-primary-100/50 dark:border-primary-500/20 hover:border-primary-200 dark:hover:border-primary-400/30 hover:shadow-primary-100/20 dark:hover:shadow-primary-900/20 group relative overflow-hidden border-2 p-0 transition-all duration-500 hover:shadow-xl"
                          >
                            <!-- Gradient Background -->
                            <div class="from-primary-50/50 to-primary-50/30 dark:from-primary-900/20 dark:via-muted-900 dark:to-primary-800/10 absolute inset-0 bg-gradient-to-br via-white opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                            <!-- Content -->
                            <div class="relative z-10 p-6">
                              <!-- Header with title and status -->
                              <div class="mb-6 flex items-start justify-between">
                                <div class="flex items-start gap-4">
                                  <div class="from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                                    <Icon name="ph:chat-circle-duotone" class="size-6 text-white" />
                                  </div>
                                  <div class="flex-1">
                                    <BaseHeading
                                      as="h4"
                                      size="lg"
                                      weight="bold"
                                      lead="tight"
                                      class="text-muted-800 group-hover:text-primary-700 dark:group-hover:text-primary-300 mb-2 transition-colors duration-300 dark:text-white"
                                    >
                                      {{ step.title }}
                                    </BaseHeading>
                                    <BaseText size="sm" class="text-muted-600 dark:text-muted-300 leading-relaxed">
                                      {{ step.description }}
                                    </BaseText>
                                  </div>
                                </div>

                                <div class="text-right">
                                  <!-- Status Badge -->
                                  <div
                                    :class="[
                                      getStatusInfo(step).bgClass,
                                      getStatusInfo(step).pulseClass,
                                      'flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md'
                                    ]"
                                  >
                                    <Icon
                                      :name="getStatusInfo(step).icon"
                                      :class="getStatusInfo(step).iconClass"
                                      class="size-4 transition-transform duration-300 hover:scale-110"
                                    />
                                    <span
                                      :class="getStatusInfo(step).textClass"
                                      class="text-sm font-bold tracking-wide"
                                    >
                                      {{ getStatusInfo(step).label }}
                                    </span>
                                  </div>

                                  <!-- Schedule Info -->
                                  <div class="text-muted-500 dark:text-muted-400 mt-2 text-xs font-medium">
                                    <div class="flex items-center justify-end gap-1.5">
                                      <Icon name="ph:calendar-check-duotone" class="size-3 opacity-70" />
                                      <span>{{ step.schedule.label }}</span>
                                    </div>
                                    <div class="mt-1 text-right text-xs opacity-80">
                                      {{ new Intl.DateTimeFormat('fa-IR', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }).format(step.scheduledDate) }}
                                    </div>
                                    <!-- Notification Status -->
                                    <div class="mt-2 flex items-center justify-end gap-1">
                                      <div
                                        :class="[
                                          'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                                          checkNotificationStatus(step).notificationExists
                                            ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
                                              : checkNotificationStatus(step).actualStatus === 'sent'
                                                ? checkNotificationStatus(step).isRead
                                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300'
                                                  : 'bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                        ]"
                                      >
                                        <Icon
                                          :name="checkNotificationStatus(step).notificationExists
                                            ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                              ? 'ph:clock-countdown-duotone'
                                              : checkNotificationStatus(step).actualStatus === 'sent'
                                                ? checkNotificationStatus(step).isRead
                                                  ? 'ph:check-circle-fill'
                                                  : 'ph:paper-plane-duotone'
                                                : 'ph:check-square-duotone'
                                            : 'ph:lightbulb-duotone'"
                                          class="size-3"
                                        />
                                        <span>{{
                                          checkNotificationStatus(step).notificationExists
                                            ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                              ? 'در صف ارسال'
                                              : checkNotificationStatus(step).actualStatus === 'sent'
                                                ? checkNotificationStatus(step).isRead
                                                  ? 'ارسال و خوانده شده'
                                                  : 'ارسال شده'
                                                : 'ایجاد شده'
                                            : 'آماده ایجاد'
                                        }}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <!-- Caring Message Section -->
                              <div class="from-muted-50/80 to-muted-100/60 dark:from-muted-800/40 dark:to-muted-800/60 dark:border-muted-700/30 rounded-2xl border border-white/50 bg-gradient-to-r p-5 backdrop-blur-sm">
                                <div class="mb-4 flex items-center justify-between">
                                  <div class="flex items-center gap-3">
                                    <div class="rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-2 dark:from-pink-400/20 dark:to-rose-400/20">
                                      <Icon name="ph:heart-duotone" class="size-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <span class="text-muted-700 dark:text-muted-200 text-base font-semibold">
                                      پیام پیشنهادی
                                    </span>
                                  </div>
                                  <div class="flex items-center gap-2">
                                    <div
                                      :class="[
                                        'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                                        checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? checkNotificationStatus(step).isRead
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300'
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300'
                                              : 'bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300'
                                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                      ]"
                                    >
                                      <Icon
                                        :name="checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? 'ph:clock-countdown-fill'
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? checkNotificationStatus(step).isRead
                                                ? 'ph:check-circle-fill'
                                                : 'ph:paper-plane-fill'
                                              : 'ph:check-square-fill'
                                          : 'ph:lightbulb-fill'"
                                        class="size-3"
                                      />
                                      <span>{{
                                        checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? 'در صف ارسال'
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? checkNotificationStatus(step).isRead
                                                ? 'ارسال و مطالعه شده'
                                                : 'ارسال شده'
                                              : 'اعلان ایجاد شده'
                                          : 'آماده ایجاد اعلان'
                                      }}</span>
                                    </div>
                                  </div>
                                </div>
                                <div class="dark:border-muted-700 dark:bg-muted-900/80 rounded-xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                                  <p class="text-muted-800 dark:text-muted-100 text-base leading-relaxed">
                                    {{ step.suggestedMessage }}
                                  </p>
                                </div>
                                <!-- Notification Info -->
                                <div
                                  class="mt-4 rounded-lg p-3"
                                  :class="[
                                    checkNotificationStatus(step).notificationExists
                                      ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                                        : checkNotificationStatus(step).actualStatus === 'sent'
                                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                                      : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20'
                                  ]"
                                >
                                  <div class="flex items-center gap-2">
                                    <Icon
                                      :name="checkNotificationStatus(step).notificationExists
                                        ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                          ? 'ph:clock-duotone'
                                          : checkNotificationStatus(step).actualStatus === 'sent'
                                            ? 'ph:check-circle-duotone'
                                            : 'ph:bell-duotone'
                                        : 'ph:info-duotone'"
                                      class="size-4"
                                      :class="[
                                        checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? 'text-green-600 dark:text-green-400'
                                              : 'text-blue-600 dark:text-blue-400'
                                          : 'text-gray-600 dark:text-gray-400'
                                      ]"
                                    />
                                    <span
                                      class="text-sm font-medium"
                                      :class="[
                                        checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? 'text-amber-700 dark:text-amber-300'
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? 'text-green-700 dark:text-green-300'
                                              : 'text-blue-700 dark:text-blue-300'
                                          : 'text-gray-700 dark:text-gray-300'
                                      ]"
                                    >
                                      {{
                                        checkNotificationStatus(step).notificationExists
                                          ? checkNotificationStatus(step).actualStatus === 'scheduled'
                                            ? `این پیام در صف ارسال قرار دارد و در ${new Date(checkNotificationStatus(step).announceTime).toLocaleDateString('fa-IR')} ساعت ${new Date(checkNotificationStatus(step).announceTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} ارسال خواهد شد`
                                            : checkNotificationStatus(step).actualStatus === 'sent'
                                              ? checkNotificationStatus(step).isRead
                                                ? 'این پیام ارسال شده و توسط کاربر مطالعه شده است'
                                                : 'این پیام ارسال شده اما هنوز توسط کاربر مطالعه نشده است'
                                              : 'این پیام در سیستم ثبت شده و آماده ارسال است'
                                          : 'این پیام آماده ایجاد اعلان زمان‌بندی شده است'
                                      }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </BaseCard>
                        </div>
                      </div>
                    </div>
                    <div v-else class="mt-6 text-center">
                      <Icon
                        name="ph:clipboard-text-duotone"
                        class="text-muted-400 mb-2 size-12"
                      />
                      <BaseText size="sm" class="text-muted-400">
                        در حال حاضر پیشنهادی برای جلسه بعدی وجود ندارد.
                      </BaseText>
                    </div>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
