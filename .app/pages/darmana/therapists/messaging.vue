<script setup lang="ts">
// import { generateInlineAnalysis } from '@/composables/useOpenRouter'  // REMOVE this import
import { useOpenRouter } from '@/composables/useOpenRouter'
import { convertToEmotionWheel } from '@/utils/emotion-mapper'

definePageMeta({
  title: 'گفتگو با روانشناس',
  layout: 'empty',
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const { getTherapists } = useTherapist()
const { getCurrentSession, endSession, createSession } = useTherapistSession()
const { getMessages, sendMessage } = useTherapistsMessages()
const route = useRoute()
const nuxtApp = useNuxtApp()
const toaster = useToaster()
const conversations = ref<{ id: string, user: Therapist }[]>([])
const messages = ref<Message[]>([])
const loading = ref(false)
const messageLoading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const newMessage = ref('')
const activeTherapistId = ref<string | null>(null)
const activeSession = ref<any>(null)
const showEmojiPicker = ref(false)
const showAudioUser = ref(false)
const showNoCharge = ref(true)
const remainingTime = ref<Date>()
const timeToShow = ref<number>()
const startChargeTime = ref<Date>()
const sessionId = ref<string | null>(null)
const sessionElapsedTime = ref(0)
const timeUpdateInterval = ref<NodeJS.Timeout | null>(null)
const userSubscription = ref<any>(null) // Initialize with null
const currentLoadingTherapistId = ref<string | null>(null)
const showScrollButton = ref(false)
const isAIResponding = ref(false)

const userReport = ref<Report | null>(null)
const hasPreviousData = ref(false)

// Feedback modal state
const showFeedbackModal = ref(false)
const feedbackMessage = ref<any>(null)
const feedbackRating = ref(5)
const feedbackLoading = ref(false)
const feedbackActiveTab = ref('general')

// Separate feedback data for each tab
const generalFeedback = ref({
  text: '',
  otherText: ''
})
const problemsFeedback = ref({
  categories: [] as string[],
  otherText: ''
})
const qualityFeedback = ref({
  categories: [] as string[],
  otherText: ''
})
const improvementsFeedback = ref({
  categories: [] as string[],
  otherText: ''
})

// Feedback problem categories
const problemCategories = [
  { value: 'not_empathic', label: 'پیام همدلانه نیست', icon: 'ph:heart-break-duotone', color: 'danger' },
  { value: 'repetitive', label: 'پیشنهاد تکراری است', icon: 'ph:repeat-duotone', color: 'warning' },
  { value: 'not_helpful', label: 'پاسخ مفید نیست', icon: 'ph:thumbs-down-duotone', color: 'danger' },
  { value: 'too_generic', label: 'پاسخ کلی و عمومی است', icon: 'ph:chats-duotone', color: 'warning' },
  { value: 'inappropriate', label: 'پاسخ نامناسب است', icon: 'ph:warning-duotone', color: 'danger' },
  { value: 'off_topic', label: 'خارج از موضوع است', icon: 'ph:arrow-square-out-duotone', color: 'warning' },
  { value: 'too_long', label: 'خیلی طولانی است', icon: 'ph:text-align-justify-duotone', color: 'info' },
  { value: 'too_short', label: 'خیلی کوتاه است', icon: 'ph:text-align-center-duotone', color: 'info' },
  { value: 'not_islamic_aligned', label: 'منطبق با باورهای اسلامی نیست', icon: 'ph:mosque-duotone', color: 'danger' },
]

// Feedback quality categories
const qualityCategories = [
  { value: 'clear_helpful', label: 'واضح و مفید', icon: 'ph:lightbulb-duotone', color: 'success' },
  { value: 'professional', label: 'حرفه‌ای و مناسب', icon: 'ph:medal-duotone', color: 'success' },
  { value: 'good_timing', label: 'زمان‌بندی مناسب', icon: 'ph:clock-duotone', color: 'success' },
  { value: 'empathetic', label: 'همدلانه و دلسوزانه', icon: 'ph:heart-duotone', color: 'success' },
  { value: 'actionable', label: 'قابل اجرا و عملی', icon: 'ph:check-square-duotone', color: 'success' },
  { value: 'comprehensive', label: 'جامع و کامل', icon: 'ph:list-checks-duotone', color: 'success' },
]

// Feedback improvement suggestions
const improvementSuggestions = [
  { value: 'more_empathy', label: 'بیشتر همدلی نشان دهد', icon: 'ph:heart-duotone', color: 'primary' },
  { value: 'more_specific', label: 'خاص‌تر و مشخص‌تر باشد', icon: 'ph:target-duotone', color: 'primary' },
  { value: 'more_examples', label: 'مثال‌های بیشتر ارائه دهد', icon: 'ph:list-bullets-duotone', color: 'primary' },
  { value: 'ask_questions', label: 'سوال‌های بیشتری بپرسد', icon: 'ph:question-duotone', color: 'primary' },
  { value: 'shorter_response', label: 'پاسخ کوتاه‌تری دهد', icon: 'ph:minus-duotone', color: 'primary' },
  { value: 'longer_response', label: 'پاسخ بیشتر توضیح دهد', icon: 'ph:plus-duotone', color: 'primary' },
]

const { generateAnalysis, createAnalysis, getAnalysisForSession } = useSessionAnalysis()
const { createAndLinkAnalysis, getMessageAnalysis } = useMessageAnalysis()
const { 
  getSessionGoals, 
  createGoal, 
  updateGoalProgress, 
  generateAIGoals, 
  evaluateGoalAchievement,
  goalTemplates 
} = useSessionGoals()

// Goals state
const sessionGoals = ref<any[]>([])
const goalsLoading = ref(false)
const showGoalsModal = ref(false)
const selectedGoal = ref<any>(null)

const toggleAudioUser = () => {
  showAudioUser.value = !showAudioUser.value
}

const emojiCategories = [
  { name: 'شاد', emojis: ['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊', '😇', '😉', '😋', '😎', '😍', '😘', '🥳', '🤗', '😜', '😝'] },
  { name: 'غمگین', emojis: ['😢', '😭', '😞', '😔', '😟', '😥', '😓', '🥺', '💧', '😪', '😿', '😿'] },
  { name: 'عصبانی', emojis: ['😠', '😡', '😤', '🤬', '😒', '👿', '💢', '👺', '👹', '🤯'] },
  { name: 'عشق', emojis: ['❤️', '💕', '💗', '💓', '💖', '😍', '🥰', '😘', '💘', '💝', '💋'] },
  { name: 'تعجب', emojis: ['😲', '😯', '😦', '😧', '😱', '😨', '🧐', '😮‍💨', '😵‍💫', '🤔'] },
  { name: 'ترس', emojis: ['😱', '😨', '😰', '😖', '😧', '😣', '👻', '🕷️', '🕸️'] },
  { name: 'حیوانات', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'] },
  { name: 'غذا', emojis: ['🍏', '🍎', '🍌', '🍉', '🍇', '🍓', '🍔', '🍕', '🍟', '🍿', '🍩', '🍪', '🧁', '🍰', '🍣'] },
  { name: 'ورزش', emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🥊'] },
]
const currentCategory = ref(emojiCategories[0].name)
const tabContainerRef = ref<HTMLElement | null>(null)
const scrollTabs = (direction: 'left' | 'right') => {
  if (!tabContainerRef.value) return
  const amount = tabContainerRef.value.clientWidth * 0.7
  tabContainerRef.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
}
const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault()
    submitMessage()
  }
}

const emojiPickerRef = ref<HTMLElement>()
onClickOutside(emojiPickerRef, () => {
  showEmojiPicker.value = false
})

const formatTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}
const scrollToBottom = () => {
  nextTick(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  })
}

const checkIfScrolledToBottom = () => {
  if (!chatEl.value) return true
  const { scrollHeight, scrollTop, clientHeight } = chatEl.value
  const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10
  showScrollButton.value = !isAtBottom
}

const loadMessages = async (therapistId: string) => {
  if (currentLoadingTherapistId.value === therapistId || showNoCharge.value) {
    return
  }

  loading.value = true
  currentLoadingTherapistId.value = therapistId

  try {
    if (!nuxtApp.$pb.authStore.isValid) {
      await navigateTo('/auth/login')
      return
    }

    const session = await getCurrentSession(therapistId)
    if (session) {
      activeSession.value = session
      sessionId.value = session.id
      const loadedMessages = await getMessages(session.id)

      // Load analysis data for messages that have message_analysis
      const messagesWithAnalysis = await Promise.all(
        loadedMessages.map(async (msg) => {
          let analysisResult = null

          // Only try to load analysis for user messages (sent) that have message_analysis field
          if (msg.type === 'sent' && msg.message_analysis) {
            try {
              const analysisData = await getMessageAnalysis(msg.message_analysis)
              // Convert database format to the format expected by the UI
              analysisResult = {
                lastMessage_emotions: analysisData.emotions || [],
                correspondingEmojis: analysisData.emojis || '',
                // Note: emotionalResponse is not stored in message_analysis collection
                // It's part of the full analysis result generated dynamically
              }
            }
            catch (analysisError) {
              console.error('Error loading analysis for message:', msg.id, analysisError)
              // Continue without analysis if loading fails
            }
          }

          return {
            ...msg,
            timestamp: msg.time,
            analysisResult,
          }
        }),
      )

      messages.value = messagesWithAnalysis
      scrollToBottom()
      startSessionTimer() // Start session timer when messages are loaded
      
      // Load session goals
      await loadSessionGoals()
    }
    else if (!showNoCharge.value) {
      const newSession = await createSession(therapistId)
      if (newSession) {
        activeSession.value = newSession
        sessionId.value = newSession.id
        messages.value = []
        startSessionTimer() // Start session timer for new session
      }
    }
  }
  catch (error) {
    console.error('Error loading messages:', error)
    messages.value = []
  }
  finally {
    loading.value = false
    currentLoadingTherapistId.value = null
  }
}

const selectConversation = async (therapistId: string) => {
  activeTherapistId.value = therapistId
  await loadMessages(therapistId)
  // Update session time immediately after loading messages
  if (activeSession.value) {
    updateSessionTime()
  }
  navigateTo({
    query: {
      ...route.query,
      therapistId,
    },
  })
}

watch(
  () => conversations.value,
  async (newConversations) => {
    if (newConversations.length > 0 && !activeTherapistId.value && !showNoCharge.value) {
      const therapistId = route.query.therapistId as string
      if (therapistId) {
        activeTherapistId.value = therapistId
        await loadMessages(therapistId)
      }
    }
  },
)

watch(activeTherapistId, async (newId) => {
  if (newId) {
    await loadMessages(newId)
  }
})

onUnmounted(() => {
  currentLoadingTherapistId.value = null
})

const selectedConversationComputed = computed(() => {
  return conversations.value.find(
    conversation => conversation.user.id === activeTherapistId.value,
  )
})

const getRandomColor = () => {
  const colors = [
    'bg-primary-500',
    'bg-info-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-danger-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}




const {
  streamChat,
  models,
  selectedModel,
  loading: modelsLoading,
  error: modelsError,
  searchQuery,
  retryFetch,
  filteredModels,
  generateInlineAnalysis,
} = useOpenRouter()

const { role, user } = useUser()
const { createReport, updateReport, getReportByUserId } = useReport()
const streamingResponse = ref('')
const showModelError = ref(false)
const modelSearchInput = ref('')
const showModelDropdown = ref(false)
const showSystemPromptModal = ref(false)
const showFeedbackSummaryModal = ref(false)
const showFactoryResetModal = ref(false)
const systemPromptContent = ref('')
const feedbackSummaryContent = ref('')
const loadingSystemPrompt = ref(false)
const loadingFeedbackSummary = ref(false)
const factoryResetLoading = ref(false)

watch(modelSearchInput, (newValue) => {
  searchQuery.value = newValue
})

watch(activeTherapistId, async (newId) => {
  streamingResponse.value = ''
  if (newId) {
    await loadMessages(newId)
  }
})

async function submitMessage() {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  if (!newMessage.value || messageLoading.value || !activeSession.value?.id) return

  try {
    messageLoading.value = true
    const now = new Date().toISOString()
    streamingResponse.value = ''

    const userMessage = {
      type: 'sent',
      text: newMessage.value,
      timestamp: now,
    }

    const currentTherapist = selectedConversationComputed.value?.user
    if (!currentTherapist?.id) {
      console.error('No active therapist found')
      return
    }

    const session = activeSession.value

    const savedUserMessage = await sendMessage(currentTherapist.id, session.id, userMessage.text, 'sent')

    // Add user message immediately (without analysis first)
    const messageId = savedUserMessage.id
    messages.value.push({
      ...userMessage,
      id: messageId,
      timestamp: savedUserMessage.time,
      analysisResult: null, // Will be updated later
    })
    newMessage.value = ''
    scrollToBottom()

    // Inline Analysis Integration (in background)
    isAIThinking.value = true
    thinkingResponse.value = ''
    let analysisResult = null
    let formattedAnalysis = ''
    try {
      // Call generateInlineAnalysis with the user message
      const lastMessage = {
        role: 'user',
        content: userMessage.text,
      }
      analysisResult = await generateInlineAnalysis(lastMessage)

      console.log('analysisResult', analysisResult)

      // Save analysis to database and link to message
      try {
        const { analysis: savedAnalysis } = await createAndLinkAnalysis(messageId, analysisResult)
        console.log('Analysis saved to database:', savedAnalysis)
      }
      catch (dbError) {
        console.error('Error saving analysis to database:', dbError)
        // Continue even if database save fails
      }

      formattedAnalysis = formatInlineAnalysis(analysisResult)
      thinkingResponse.value = formattedAnalysis

      // Update the message with analysis result using message ID
      const messageToUpdate = messages.value.find(msg => msg.id === messageId)
      if (messageToUpdate) {
        messageToUpdate.analysisResult = analysisResult
      }
    }
    catch (err) {
      thinkingResponse.value = 'خطا در دریافت تحلیل. لطفا دوباره تلاش کنید.'
      console.error('Inline analysis error:', err)
    }
    finally {
      isAIThinking.value = false
    }

    // Remove temp assistant message logic. Do not push empty message.

    isAIResponding.value = true
    showScrollButton.value = false

    // --- NEW: Send analysis as detail to streamChat ---
    // Optionally, push the analysis as a new message (for display) ONLY if it is not empty
    if (thinkingResponse.value && thinkingResponse.value.trim() !== '') {
      // messages.value.push({
      //   type: 'analysis',
      //   text: thinkingResponse.value,
      //   timestamp: new Date().toISOString(),
      //   id: 'analysis-' + Date.now(),
      //   isExpanded: false,
      // })

      checkIfScrolledToBottom()
    }

    // Prepare chat history for AI with analysis; let composable inject system prompt
    const contextMessages = messages.value.map(msg => ({
      role: msg.type === 'sent' ? 'user' : 'assistant',
      content: msg.text,
    }))
    const chatMessagesForAI = [
      ...contextMessages,
      { role: 'user', content: userMessage.text },
    ]
    // Call streamChat with therapistDetails option (so system prompt is automatically added)
    let aiResponse = ''
    // Show streaming response in real time
    isAIThinking.value = true
    thinkingResponse.value = ''
    await streamChat(chatMessagesForAI, { therapistDetails: selectedConversationComputed.value?.user }, (chunk) => {
      aiResponse += chunk
      thinkingResponse.value = aiResponse
    }, activeSession.value?.id, activeSession.value?.goals)
    isAIThinking.value = false

    // Remove any temporary typing indicators
    messages.value = messages.value.filter(msg => !msg.isTyping)

    // Save AI response to PocketBase
    const savedAIMessage = await sendMessage(currentTherapist.id, session.id, aiResponse, 'received')

    // Add AI response to messages with the correct ID
    messages.value.push({
      type: 'received',
      text: aiResponse,
      timestamp: savedAIMessage.time, // Use timestamp from saved message
      id: savedAIMessage.id, // Use ID from saved message
    })
    checkIfScrolledToBottom()
    isAIResponding.value = false
  }
  catch (e) {
    console.error('Error in chat:', e)
    messages.value.push({
      type: 'received',
      text: 'متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.',
      timestamp: new Date().toISOString(),
      id: 'error-' + Date.now(),
    })
    scrollToBottom()
  }
  finally {
    messageLoading.value = false
  }
}

const showAnalysis = ref(false)
const toggleAnalysis = () => {
  showAnalysis.value = !showAnalysis.value
  nextTick(() => {
    if (showAnalysis.value) {
      scrollToBottom()
    }
  })
}

function formatInlineAnalysis(analysisResult) {
  if (!analysisResult) return 'نتیجه‌ای یافت نشد.'
  let output = ''

  if (showAnalysis.value) {
    output += '<div class="analysis-message bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">'

    if (showAnalysis.value) {
      output += '<div class="analysis-message bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">'

      if (showAnalysis.value) {
      // Session Details
        output += `\n**جزئیات جلسه:**\n`
        output += `- هدف جلسه: ${analysisResult.session_mainGoal || 'نامشخص'}\n`
        output += `- نیاز به مداخله انسانی: ${analysisResult.session_humanInterventionNeeded ? 'بله' : 'خیر'}\n`
        output += `- نیازهای ناهشیار: ${analysisResult.session_unconsciousNeeds || 'نامشخص'}\n`

        // Last Message Analysis
        output += `\n**تحلیل پیام آخر:**\n`
        output += `- احساسات اولیه: ${(analysisResult.lastMessage_primaryEmotions || []).join(', ') || 'نامشخص'}\n`
        output += `- احساسات دقیق‌تر: ${(analysisResult.lastMessage_nuancedEmotions || []).join(', ') || 'نامشخص'}\n`
        output += `- شدت احساسات: ${analysisResult.lastMessage_emotionIntensity || 'نامشخص'}\n`
        output += `- تناسب با هدف جلسه: ${analysisResult.lastMessage_alignmentWithGoal || 'نامشخص'}\n`
        output += `- پاسخ پیشنهادی: ${analysisResult.emotionalResponse || 'نامشخص'}\n`
      }
      else {
        output = '<div class="analysis-icon cursor-pointer" @click="showAnalysis = !showAnalysis"><Icon name="ph:chart-line" class="w-6 h-6 text-primary-500" /></div>'
      }
    }
    else {
      output = '<div class="analysis-icon cursor-pointer flex items-center justify-center p-3" @click="toggleAnalysis"><Icon name="ph:chart-line" class="w-6 h-6 text-primary-500" /></div>'
    }
  }
  else {
    output = '<div class="analysis-icon cursor-pointer flex items-center justify-center p-3" @click="toggleAnalysis"><Icon name="ph:chart-line" class="w-6 h-6 text-primary-500" /></div>'
  }
  return output + '</div>' + '</div>'
}

watch(messages, () => {
  if (!isAIResponding.value) {
    scrollToBottom()
  }
}, { deep: true })

const { pause, resume } = useInterval(1000, { controls: true })

const checkForHalfTime = () => {
  if (!startChargeTime.value || !timeToShow.value) return false
  const start = startChargeTime.value
  const now = new Date()
  const temp = Math.floor((now.getTime() - start.getTime()) / 60000)
  return (temp / timeToShow.value > 1)
}

watch(timeToShow, async (newValue) => {
  if (newValue <= 0 && activeSession.value?.id) {
    const startTime = new Date(activeSession.value.created)
    const endTime = new Date()
    const totalTimePassedMinutes = Math.round((endTime - startTime) / (1000 * 60))
    isReportModalOpen.value = true
    isGeneratingAnalysis.value = true
    await handleConfirmEndSession()
    showNoCharge.value = true
    pause()
  }
})

const updateSessionTime = () => {
  if (activeSession.value?.created) {
    try {
      // Convert the PocketBase timestamp to a Date object
      const startTime = new Date(activeSession.value.created)
      const currentTime = new Date()

      // Ensure both dates are valid
      if (isNaN(startTime.getTime()) || isNaN(currentTime.getTime())) {
        console.error('Invalid date detected:', { start: activeSession.value.created })
        sessionElapsedTime.value = 0
        return
      }

      const elapsedMilliseconds = currentTime.getTime() - startTime.getTime()
      const minutes = Math.floor(elapsedMilliseconds / 60000)

      // Sanity check: if minutes is negative or too large, something is wrong
      if (minutes < 0 || minutes > 24 * 60) {
        console.error('Invalid elapsed time:', minutes, 'minutes')
        sessionElapsedTime.value = 0
        return
      }

      sessionElapsedTime.value = minutes
    }
    catch (error) {
      console.error('Error calculating session time:', error)
      sessionElapsedTime.value = 0
    }
  }
  else {
    sessionElapsedTime.value = 0
  }
}

const startSessionTimer = () => {
  // Initial update
  updateSessionTime()

  // Clear existing interval if any
  if (timeUpdateInterval.value) {
    clearInterval(timeUpdateInterval.value)
  }

  // Update every 30 seconds
  timeUpdateInterval.value = setInterval(() => {
    updateSessionTime()
  }, 30000)
}

onMounted(async () => {
  loading.value = true
  try {
    const therapists = await getTherapists()
    conversations.value = therapists.map(p => ({ id: p.id, user: p }))

    const u = await nuxtApp.$pb
      .collection('users')
      .getOne(nuxtApp.$pb.authStore.model.id, {})
    showNoCharge.value = !u.hasCharge
    remainingTime.value = new Date(u.expireChargeTime)
    startChargeTime.value = new Date(u.startChargeTime)
    timeToShow.value = Math.floor((remainingTime.value.getTime() - new Date().getTime()) / (1000 * 60))

    const therapistId = route.query.therapistId as string
    if (therapistId) {
      activeTherapistId.value = therapistId
      const conversation = conversations.value.find(c => c.user.id === therapistId)
      if (conversation && !showNoCharge.value) {
        await loadMessages(therapistId)
      }
    }

    if (timeToShow.value <= 0) {
      showNoCharge.value = true
      pause()
    }

    timeUpdateInterval.value = setInterval(() => {
      if (timeToShow.value !== undefined) {
        timeToShow.value = timeToShow.value - 1
      }
    }, 60000)

    if (nuxtApp.$pb.authStore.isValid) {
      userSubscription.value = await nuxtApp.$pb.collection('users').subscribe(
        nuxtApp.$pb.authStore.model?.id,
        (e) => {
          const expireTime = new Date(e.record.expireChargeTime).getTime()
          timeToShow.value = Math.floor((expireTime - new Date().getTime()) / (1000 * 60))
          if (!e.record.hasCharge) {
            showNoCharge.value = true
            setTimeout(() => {
              if (chatEl.value) {
                chatEl.value.scrollTo({
                  top: chatEl.value.scrollHeight,
                  behavior: 'smooth',
                })
              }
            }, 600)
            pause()
          }
        },
      )

      // fetching userReport for having memory of previous sessions
      const userReportData = await getReportByUserId(nuxtApp.$pb.authStore.model?.id)
      if (userReportData) {
        userReport.value = userReportData
        hasPreviousData.value = true

        // If there are previous sessions (totalSessions > 0), we'll have AI start the conversation
        if (userReportData.totalSessions && userReportData.totalSessions > 0 && userReportData.summaries.length > 0) {
          console.log('This user has previous sessions, AI will start with a summary')
          // Wait a moment for UI to initialize properly
          setTimeout(() => {
            const session = activeSession.value
            if (!session) {
              console.error('No active session found')
              return
            }

            // Check if there are already messages in the conversation
            // If there are messages, don't trigger the AI introduction
            if (messages.value.length === 0) {
              startAIConversationWithSummary(selectedConversationComputed.value?.user, session.id, userReportData)
            }
            else {
              console.log('Messages already exist in conversation, skipping AI introduction')
            }
          }, 1000)
        }
      }
    }
  }
  catch (error) {
    console.error('Error initializing:', error)
  }
  finally {
    loading.value = false
    setTimeout(() => {
      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 300)
    resume()
  }
  if (chatEl.value) {
    chatEl.value.addEventListener('scroll', checkIfScrolledToBottom)
  }
})

onUnmounted(() => {
  pause()
  if (timeUpdateInterval.value) {
    clearInterval(timeUpdateInterval.value)
  }
  try {
    if (userSubscription.value) {
      nuxtApp.$pb.collection('users').unsubscribe(userSubscription.value)
    }
  }
  catch (error) {
    console.error('Error unsubscribing:', error)
  }
  if (chatEl.value) {
    chatEl.value.removeEventListener('scroll', checkIfScrolledToBottom)
  }
})

const clearMessages = async (sessionId: string) => {
  if (!sessionId) { throw new Error('Session ID is required') }
  try {
    const messageIds = messages.value
      .filter(msg => msg.session === sessionId)
      .map(msg => msg.id)

    for (const messageId of messageIds) {
      await nuxtApp.$pb.collection('therapists_messages').delete(messageId)
    }
    toaster.show({
      title: 'پاک کردن پیامها ',
      message: 'پیام ها با موفقیت پاک شدند.',
      color: 'success',
      icon: 'ph:eraser',
      closable: true,
    })
    messages.value = []
  }
  catch (error) {
    console.error('Error clearing messages:', error)
    throw error
  }
}

const confirmClearChat = async () => {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  if (!activeTherapistId.value) {
    toaster.show({
      title: 'خطا',
      message: 'لطفاً ابتدا یک روانشناس را انتخاب کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  try {
    await clearMessages(activeSession.value.id)
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error clearing messages:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پاک کردن پیام‌ها',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

const gotoList = () => {
  navigateTo('/darmana/therapists/chooseTherapist')
}
const gotoReport = () => {
  navigateTo(`/report`)
}

// Feedback functions
const openFeedbackModal = (message: any) => {
  console.log('Opening feedback modal for message:', message)
  
  if (!message) {
    console.warn('No message provided to feedback modal')
    toaster.show({
      title: 'خطا',
      message: 'پیام مورد نظر یافت نشد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  feedbackMessage.value = message
  feedbackRating.value = 5
  feedbackActiveTab.value = 'general'
  
  // Reset all feedback data
  generalFeedback.value = { text: '', otherText: '' }
  problemsFeedback.value = { categories: [], otherText: '' }
  qualityFeedback.value = { categories: [], otherText: '' }
  improvementsFeedback.value = { categories: [], otherText: '' }
  
  showFeedbackModal.value = true
}

const closeFeedbackModal = () => {
  showFeedbackModal.value = false
  feedbackMessage.value = null
  feedbackRating.value = 5
  feedbackActiveTab.value = 'general'
  
  // Reset all feedback data
  generalFeedback.value = { text: '', otherText: '' }
  problemsFeedback.value = { categories: [], otherText: '' }
  qualityFeedback.value = { categories: [], otherText: '' }
  improvementsFeedback.value = { categories: [], otherText: '' }
}

// Helper function to get message content from different possible message structures
const getMessageContent = (message: any): string => {
  if (!message) return ''
  return message.text || message.content || message.message || ''
}

// Toggle functions for different feedback types
const toggleProblemsCategory = (category: string) => {
  const index = problemsFeedback.value.categories.indexOf(category)
  if (index > -1) {
    problemsFeedback.value.categories.splice(index, 1)
  } else {
    problemsFeedback.value.categories.push(category)
  }
}

const toggleQualityCategory = (category: string) => {
  const index = qualityFeedback.value.categories.indexOf(category)
  if (index > -1) {
    qualityFeedback.value.categories.splice(index, 1)
  } else {
    qualityFeedback.value.categories.push(category)
  }
}

const toggleImprovementsCategory = (category: string) => {
  const index = improvementsFeedback.value.categories.indexOf(category)
  if (index > -1) {
    improvementsFeedback.value.categories.splice(index, 1)
  } else {
    improvementsFeedback.value.categories.push(category)
  }
}

const submitFeedback = async () => {
  // Check if any feedback has been provided
  const hasGeneralFeedback = generalFeedback.value.text.trim() || generalFeedback.value.otherText.trim()
  const hasProblemsFeedback = problemsFeedback.value.categories.length > 0 || problemsFeedback.value.otherText.trim()
  const hasQualityFeedback = qualityFeedback.value.categories.length > 0 || qualityFeedback.value.otherText.trim()
  const hasImprovementsFeedback = improvementsFeedback.value.categories.length > 0 || improvementsFeedback.value.otherText.trim()
  
  if (!feedbackMessage.value || (!hasGeneralFeedback && !hasProblemsFeedback && !hasQualityFeedback && !hasImprovementsFeedback)) {
    toaster.show({
      title: 'خطا',
      message: 'لطفاً حداقل یک نظر یا گزینه را انتخاب کنید',
      color: 'warning',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }
  
  feedbackLoading.value = true
  try {
    // Create comprehensive feedback record in database
    await nuxtApp.$pb.collection('message_feedback').create({
      message_id: feedbackMessage.value.id,
      session_id: activeSession.value?.id,
      user_id: nuxtApp.$pb.authStore.model?.id,
      therapist_id: activeTherapistId.value,
      rating: feedbackRating.value,
      message_content: feedbackMessage.value.text,
      
      // General feedback
      general_text: generalFeedback.value.text.trim(),
      general_other: generalFeedback.value.otherText.trim(),
      
      // Problems feedback
      problems_categories: problemsFeedback.value.categories,
      problems_other: problemsFeedback.value.otherText.trim(),
      
      // Quality feedback
      quality_categories: qualityFeedback.value.categories,
      quality_other: qualityFeedback.value.otherText.trim(),
      
      // Improvements feedback
      improvements_categories: improvementsFeedback.value.categories,
      improvements_other: improvementsFeedback.value.otherText.trim(),
      
      created: new Date().toISOString()
    })

    // Feedback will be stored in message_feedback collection and aggregated when needed
    // This ensures it persists and works with existing database structure

    // Generate single improved response with feedback applied
    try {
      isAIResponding.value = true
      isAIThinking.value = true
      thinkingResponse.value = ''
      
      // Create comprehensive feedback summary
      const feedbackSummary = []
      if (problemsFeedback.value.categories.length > 0) {
        feedbackSummary.push(`مشکلات: ${problemsFeedback.value.categories.join(', ')}`)
      }
      if (problemsFeedback.value.otherText.trim()) {
        feedbackSummary.push(`مشکل دیگر: ${problemsFeedback.value.otherText}`)
      }
      if (qualityFeedback.value.categories.length > 0) {
        feedbackSummary.push(`نقاط قوت: ${qualityFeedback.value.categories.join(', ')}`)
      }
      if (qualityFeedback.value.otherText.trim()) {
        feedbackSummary.push(`نقطه قوت دیگر: ${qualityFeedback.value.otherText}`)
      }
      if (improvementsFeedback.value.categories.length > 0) {
        feedbackSummary.push(`پیشنهادات: ${improvementsFeedback.value.categories.join(', ')}`)
      }
      if (improvementsFeedback.value.otherText.trim()) {
        feedbackSummary.push(`پیشنهاد دیگر: ${improvementsFeedback.value.otherText}`)
      }
      if (generalFeedback.value.text.trim()) {
        feedbackSummary.push(`نظر کلی: ${generalFeedback.value.text}`)
      }
      if (generalFeedback.value.otherText.trim()) {
        feedbackSummary.push(`نظر اضافی: ${generalFeedback.value.otherText}`)
      }
      
      // Get conversation context
      const contextMessages = messages.value
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .slice(-10)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      
      // Get the last user message to understand what they were discussing
      const lastUserMessage = messages.value
        .filter(msg => msg.type === 'user')
        .slice(-1)[0]
      
      const improvedResponsePrompt = {
        role: 'user',
        content: `بازخورد مراجع در مورد پیام قبلی من:
${feedbackSummary.join('\n')}

${lastUserMessage ? `در ادامه موضوع "${lastUserMessage.text.slice(0, 50)}..." که در حال بحث بودیم، ` : ''}لطفاً پاسخ بهتری ارائه دهید که:
- از دریافت بازخورد تشکر کنید (کوتاه)
- این نکات را در نظر بگیرد
- به درستی به نیازهای من پاسخ دهد
- موضوع اصلی را ادامه دهد
- مناسب یک روانشناس حرفه‌ای باشد`
      }
      
      const chatMessagesForAI = [
        ...contextMessages,
        improvedResponsePrompt
      ]
      
      let aiResponse = ''
      await streamChat(chatMessagesForAI, { therapistDetails: selectedConversationComputed.value?.user }, (chunk) => {
        aiResponse += chunk
        thinkingResponse.value = aiResponse
      }, activeSession.value?.id, activeSession.value?.goals)
      
      isAIThinking.value = false
      
      // Add the single improved response to messages
      const improvedMessage = {
        id: Date.now().toString(),
        text: aiResponse,
        type: 'assistant',
        timestamp: new Date(),
        user: selectedConversationComputed.value?.user
      }
      
      messages.value.push(improvedMessage)
      
      // Save improved response to database
      if (activeSession.value?.id) {
        await nuxtApp.$pb.collection('messages').create({
          session_id: activeSession.value.id,
          content: improvedMessage.text,
          type: 'assistant',
          user_id: selectedConversationComputed.value?.user?.id,
          created: improvedMessage.timestamp.toISOString()
        })
      }
      
    } catch (error) {
      console.error('Error generating improved response:', error)
      isAIThinking.value = false
    } finally {
      isAIResponding.value = false
    }

    // Show success toast
    toaster.show({
      title: 'نظر شما ثبت شد',
      message: 'بازخورد شما در پاسخ‌های آینده اعمال خواهد شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })

    closeFeedbackModal()
  } catch (error) {
    console.error('Error submitting feedback:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ثبت نظر. لطفاً دوباره تلاش کنید',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    feedbackLoading.value = false
  }
}

// Goals functions
const loadSessionGoals = async () => {
  if (!activeSession.value?.id) return
  
  goalsLoading.value = true
  try {
    const goals = await getSessionGoals(activeSession.value.id)
    sessionGoals.value = goals
  } catch (error) {
    console.error('Error loading session goals:', error)
  } finally {
    goalsLoading.value = false
  }
}

// Function to display current system prompt
const displaySystemPrompt = async () => {
  if (!activeSession.value?.id) return
  
  loadingSystemPrompt.value = true
  try {
    const { getSessionFeedbackSummary, buildEnhancedSystemPrompt, getUserFeedbackProfile } = useFeedbackPrompt()
    const userId = nuxtApp.$pb.authStore.model?.id
    
    // Get both session feedback and user profile
    const [feedbackSummary, userProfile] = await Promise.all([
      getSessionFeedbackSummary(activeSession.value.id),
      userId ? getUserFeedbackProfile(userId) : Promise.resolve('')
    ])
    
    // Base system prompt for therapist
    const basePrompt = `اطلاعات هویتی تو در پایین آمده است:
نام: ${selectedConversationComputed.value?.user?.name || 'روانشناس'}
تخصص: ${selectedConversationComputed.value?.user?.specialty || 'روانشناسی'}
توضیح کوتاه: ${selectedConversationComputed.value?.user?.shortDescription || ''}
توضیح بلند: ${selectedConversationComputed.value?.user?.longDescription || ''}
صفات تعریف کننده: ${selectedConversationComputed.value?.user?.definingTraits || ''}
داستان زندگی: ${selectedConversationComputed.value?.user?.backStory || ''}
شخصیت: ${selectedConversationComputed.value?.user?.personality || ''}
ظاهر: ${selectedConversationComputed.value?.user?.appearance || ''}
رویکرد: ${selectedConversationComputed.value?.user?.approach || ''}
تخصص: ${selectedConversationComputed.value?.user?.expertise || ''}

تو یک روانشناس هستی که در یک سیستم مشاوره متنی با مراجعین در حال گفتگو هستی.
همیشه در نقش یک روانشناس حرفه‌ای باش و از اصول اخلاقی و حرفه‌ای پیروی کن.`
    
    // Build enhanced prompt
    const enhancedPrompt = buildEnhancedSystemPrompt(basePrompt, feedbackSummary, activeSession.value?.goals, userProfile)
    
    systemPromptContent.value = enhancedPrompt
    showSystemPromptModal.value = true
    
  } catch (error) {
    console.error('Error generating system prompt:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در نمایش system prompt',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    loadingSystemPrompt.value = false
  }
}

// Function to display user feedback summary
const displayFeedbackSummary = async () => {
  loadingFeedbackSummary.value = true
  try {
    const { getUserFeedbackProfile } = useFeedbackPrompt()
    const userId = nuxtApp.$pb.authStore.model?.id
    
    if (!userId) {
      toaster.show({
        title: 'خطا',
        message: 'کاربر شناسایی نشده',
        color: 'warning',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
      return
    }
    
    const userProfile = await getUserFeedbackProfile(userId)
    
    if (!userProfile) {
      toaster.show({
        title: 'اطلاعات',
        message: 'هنوز بازخوردی ثبت نشده است',
        color: 'info',
        icon: 'ph:info-circle-fill',
        closable: true,
      })
      return
    }
    
    feedbackSummaryContent.value = userProfile
    showFeedbackSummaryModal.value = true
    
  } catch (error) {
    console.error('Error getting feedback summary:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در نمایش خلاصه بازخوردها',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    loadingFeedbackSummary.value = false
  }
}

// Factory reset function - removes all user data
const performFactoryReset = async () => {
  factoryResetLoading.value = true
  try {
    const userId = nuxtApp.$pb.authStore.model?.id
    if (!userId) {
      toaster.show({
        title: 'خطا',
        message: 'کاربر شناسایی نشده',
        color: 'warning',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
      return
    }

    let totalDeleted = 0

    // Helper function to safely delete records
    const safeDelete = async (collection: string, filter: string) => {
      try {
        console.log(`Fetching ${collection} records with filter: ${filter}`)
        const records = await nuxtApp.$pb.collection(collection).getFullList({
          filter: filter
        })
        
        console.log(`Found ${records.length} ${collection} records to delete`)
        
        for (const record of records) {
          try {
            console.log(`Deleting ${collection} record ${record.id}`)
            await nuxtApp.$pb.collection(collection).delete(record.id)
            totalDeleted++
            console.log(`Successfully deleted ${collection} record ${record.id}`)
          } catch (deleteError) {
            console.warn(`Failed to delete ${collection} record ${record.id}:`, deleteError)
            // Continue with other records
          }
        }
      } catch (fetchError) {
        console.warn(`Failed to fetch ${collection} records:`, fetchError)
      }
    }

    // Delete all user data sequentially to avoid overwhelming the server
    await safeDelete('sessions', `user = "${userId}"`)
    await safeDelete('messages', `user_id = "${userId}"`)
    await safeDelete('message_feedback', `user_id = "${userId}"`)
    await safeDelete('final_reports', `user = "${userId}"`)

    // Also try to delete any session-related data
    if (activeSession.value?.id) {
      await safeDelete('messages', `session_id = "${activeSession.value.id}"`)
      await safeDelete('message_feedback', `session_id = "${activeSession.value.id}"`)
    }

    // Clear local state
    messages.value = []
    activeSession.value = null
    activeTherapistId.value = null
    conversations.value = []
    systemPromptContent.value = ''
    feedbackSummaryContent.value = ''

    toaster.show({
      title: 'بازنشانی انجام شد',
      message: `${totalDeleted} رکورد پاک شد. در حال خروج از سیستم...`,
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })

    showFactoryResetModal.value = false

    // Logout user and redirect to login
    setTimeout(async () => {
      try {
        // Clear PocketBase auth
        nuxtApp.$pb.authStore.clear()
        
        // Redirect to login page
        await navigateTo('/auth/login')
      } catch (error) {
        console.error('Error during logout:', error)
        // Fallback - reload page
        window.location.href = '/auth/login'
      }
    }, 2000)

  } catch (error) {
    console.error('Error during factory reset:', error)
    toaster.show({
      title: 'خطا در بازنشانی',
      message: 'خطایی در پاک کردن اطلاعات رخ داد. لطفاً دوباره تلاش کنید',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    factoryResetLoading.value = false
  }
}

const generateSessionGoals = async () => {
  if (!activeSession.value?.id || !nuxtApp.$pb.authStore.model?.id) {
    console.warn('Missing required IDs for goal generation')
    return
  }
  
  goalsLoading.value = true
  try {
    // Get user's recent sessions for goal generation
    const { getReportByUserId } = useReport()
    const userReport = await getReportByUserId(nuxtApp.$pb.authStore.model.id)
    
    if (!userReport) {
      console.warn('No user report found for goal generation')
      toaster.show({
        title: 'اطلاعات ناکافی',
        message: 'برای تولید اهداف، ابتدا نیاز به جلسات قبلی دارید',
        color: 'warning',
        icon: 'ph:info-duotone'
      })
      return
    }
    
    if (userReport.summaries && userReport.summaries.length > 0) {
      // Use last 3 sessions for goal generation
      const recentSessions = userReport.summaries.slice(-3)
      
      console.log('Recent sessions for goal generation:', recentSessions)
      
      const aiGoals = await generateAIGoals(
        nuxtApp.$pb.authStore.model.id,
        activeSession.value.id,
        recentSessions
      )
      
      // Create goals in database
      if (aiGoals.goals && aiGoals.goals.length > 0) {
        for (const goalData of aiGoals.goals) {
          await createGoal({
            session_id: activeSession.value.id,
            user_id: nuxtApp.$pb.authStore.model.id,
            therapist_id: activeTherapistId.value,
            title: goalData.title,
            description: goalData.description,
            goal_type: goalData.goal_type,
            priority: goalData.priority,
            target_behaviors: goalData.target_behaviors || [],
            success_criteria: goalData.success_criteria || [],
            // Don't include based_on_sessions if it contains invalid IDs
            based_on_sessions: []
          })
        }
        
        // Reload goals
        await loadSessionGoals()
        
        toaster.show({
          title: 'موفق',
          message: 'اهداف جلسه با موفقیت تولید شد',
          color: 'success',
          icon: 'ph:check-circle-fill',
          closable: true,
        })
      } else {
        toaster.show({
          title: 'خطا',
          message: 'خطا در تولید اهداف از سرور',
          color: 'danger',
          icon: 'ph:warning-circle-fill',
          closable: true,
        })
      }
    } else {
      toaster.show({
        title: 'اطلاعات ناکافی',
        message: 'برای تولید اهداف، ابتدا نیاز به جلسات قبلی دارید',
        color: 'warning',
        icon: 'ph:info-duotone',
        closable: true,
      })
    }
  } catch (error) {
    console.error('Error generating session goals:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید اهداف جلسه',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    goalsLoading.value = false
  }
}

const evaluateGoals = async () => {
  if (!activeSession.value?.id || sessionGoals.value.length === 0) return
  
  try {
    for (const goal of sessionGoals.value) {
      if (goal.status !== 'achieved') {
        await evaluateGoalAchievement(goal.id, messages.value)
      }
    }
    
    // Reload goals to show updated progress
    await loadSessionGoals()
    
    toaster.show({
      title: 'موفق',
      message: 'ارزیابی اهداف انجام شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  } catch (error) {
    console.error('Error evaluating goals:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ارزیابی اهداف',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

const openGoalModal = (goal: any) => {
  selectedGoal.value = goal
  showGoalsModal.value = true
}

const closeGoalModal = () => {
  showGoalsModal.value = false
  selectedGoal.value = null
}

const getGoalStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'muted'
    case 'in_progress': return 'warning'
    case 'achieved': return 'success'
    case 'partially_achieved': return 'info'
    case 'modified': return 'primary'
    default: return 'muted'
  }
}

const getGoalStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'در انتظار'
    case 'in_progress': return 'در حال انجام'
    case 'achieved': return 'محقق شده'
    case 'partially_achieved': return 'تا حدی محقق شده'
    case 'modified': return 'تغییر یافته'
    default: return 'نامشخص'
  }
}

const getGoalPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'muted'
  }
}

const getGoalPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'بالا'
    case 'medium': return 'متوسط'
    case 'low': return 'پایین'
    default: return 'نامشخص'
  }
}

// Function to have the AI start the conversation with a summary of previous sessions
async function startAIConversationWithSummary(therapist: any, sessionId: string, report: any) {
  if (!therapist || !sessionId || !report) return

  try {
    isAIResponding.value = true
    messageLoading.value = true
    streamingResponse.value = ''
    isAIThinking.value = true
    thinkingResponse.value = '...'

    // Add a temporary thinking message to show the user something is happening
    const tempThinkingId = 'thinking-' + Date.now()
    messages.value.push({
      type: 'received',
      text: 'درحال تحلیل جلسات قبلی...',
      timestamp: new Date().toISOString(),
      id: tempThinkingId,
      isTyping: true,
    })

    // Create a system message with the report summary data
    const systemContext = {
      role: 'system',
      content: `مراجع قبلا ${report.totalSessions} جلسه مشاوره داشته است. خلاصه جلسات قبلی:
${report.summaries?.map((session: any, idx: number) =>
  `جلسه ${idx + 1}: ${session.title}\n${session.summary}`,
).join('\n\n')}

اهداف عمیق‌تر احتمالی مراجع:
${report.possibleDeeperGoals?.join('\n')}

عوامل خطر احتمالی:
${report.possibleRiskFactors?.flat().map((risk: any) =>
  `${risk.title}: ${risk.description}`,
).join('\n')}
همچنین ممکن است اطلاعات دموگرافیک ارائه شده باشند: ${report.finalDemographicProfile}
اگر مقادیر مشخص نیستند، یعنی کاربر اطلاعات دموگرافیک را ارائه نکرده است.
از اطلاعاتی استفاده کن که کاربر وارد کرده است.
 با توجه به اطلاعات بالا، جلسه جدید را با یک خلاصه از جلسات قبلی و وضعیت مراجع شروع کن و از مراجع بپرس که امروز حالش چطور است و میخواهد درباره چه مسائلی صحبت کند. لحن باید گرم و حرفه‌ای باشد.
 همین طور از اهداف عمیق تر احتمالی نیز استفاده کن.  کاربر را ترغیب به دادن پاسخ در مورد موضوعات احتمالی کن.
 از ایموجی های خوب و جذاب استفاده کن.
 `,
    }
    console.log('report', report)

    // Generate initial AI message
    let aiResponse = ''

    // Call the OpenRouter API with the system context
    await streamChat([systemContext], { therapistDetails: therapist }, (chunk) => {
      aiResponse += chunk
      thinkingResponse.value = aiResponse
    }, activeSession.value?.id, activeSession.value?.goals)

    isAIThinking.value = false

    // Remove the temporary typing message
    messages.value = messages.value.filter(msg => !msg.isTyping)

    // Save AI response to PocketBase
    const savedAIMessage = await sendMessage(therapist.id, sessionId, aiResponse, 'received')

    // Add AI response to messages with the correct ID
    messages.value.push({
      type: 'received',
      text: aiResponse,
      timestamp: savedAIMessage.time,
      id: savedAIMessage.id,
    })

    scrollToBottom()
  }
  catch (e) {
    console.error('Error starting AI conversation with summary:', e)
    // Add fallback message if the summary fails
    messages.value.push({
      type: 'received',
      text: 'سلام، من روانشناس شما هستم. به نظر می‌رسد جلسات قبلی با هم داشته‌ایم. امروز حالتان چطور است و درباره چه چیزی می‌خواهید صحبت کنیم؟',
      timestamp: new Date().toISOString(),
      id: 'auto-' + Date.now(),
    })
    scrollToBottom()
  }
  finally {
    isAIResponding.value = false
    messageLoading.value = false
  }
}

const isReportModalOpen = ref(false)

const openReportModal = () => {
  isReportModalOpen.value = true
}

const closeReportModal = () => {
  if (!isGeneratingAnalysis.value) {
    isReportModalOpen.value = false
  }
}

const isDeleteModalOpen = ref(false)

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const isMessageDetailModalOpen = ref(false)
const selectedMessage = ref<any>(null)

const openMessageDetailModal = (message: any) => {
  selectedMessage.value = message
  isMessageDetailModalOpen.value = true
}

const closeMessageDetailModal = () => {
  isMessageDetailModalOpen.value = false
  selectedMessage.value = null
}

// Convert analysis result to EmotionWheel format
const selectedMessageEmotions = computed(() => {
  if (!selectedMessage.value?.analysisResult?.lastMessage_emotions) {
    return []
  }

  try {
    return convertToEmotionWheel(selectedMessage.value.analysisResult.lastMessage_emotions)
  }
  catch (error) {
    console.error('Error converting emotions:', error)
    return []
  }
})

const handleEndSession = async () => {
  if (!activeSession.value) return

  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'شارژ شما به پایان رسیده است.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  if (messages.value.length < 10) {
    toaster.show({
      title: 'خطا',
      message: 'برای ساخت گزارش، حداقل ۱۰ پیام باید رد و بدل شده باشد.',
      color: 'danger',
    })
    return
  }

  isReportModalOpen.value = true
}

const isGeneratingAnalysis = ref(false)

const handleConfirmEndSession = async () => {
  if (!activeSession.value) return

  isGeneratingAnalysis.value = true
  let savedAnalysisId = null

  try {
    // 1. Check if analysis already exists for this session
    let existingAnalysis = null
    try {
      existingAnalysis = await getAnalysisForSession(activeSession.value.id)
    }
    catch (error: any) {
      if (error?.status !== 404) {
        console.error('Error getting analysis for session:', error)
        toaster.show({
          title: 'خطا',
          message: 'خطا در بررسی آنالیز جلسه',
          color: 'danger',
          icon: 'ph:warning-circle-fill',
          closable: true,
        })
        isGeneratingAnalysis.value = false
        isReportModalOpen.value = false
        return
      }
      // If 404, just continue (analysis does not exist)
    }
    if (existingAnalysis) {
      savedAnalysisId = existingAnalysis.id
      isReportModalOpen.value = false
      await navigateTo(`/darmana/therapists/analysis?analysis_id=${savedAnalysisId}`)
      return
    }

    // 2. If not, generate and save analysis
    // Remove first AI message if it was the starting message (for users with previous sessions)
    let messagesToAnalyze = messages.value
    if (messages.value.length > 0 && messages.value[0].type === 'received') {
      // If first message is from AI (received), exclude it from analysis
      messagesToAnalyze = messages.value.slice(1)
    }

    const allMessages = messagesToAnalyze.map(msg => ({
      role: msg.type === 'sent' ? 'patient' : 'therapist',
      content: msg.text,
    }))

    const startTime = new Date(activeSession.value.created)
    const endTime = new Date()
    const totalTimePassedMinutes = Math.round((endTime - startTime) / (1000 * 60))

    // Generate and save analysis
    const generatedAnalysis = await generateAnalysis({
      sessionId: activeSession.value.id,
      messages: allMessages,
    })

    const savedAnalysis = await createAnalysis({
      session: activeSession.value.id,
      ...generatedAnalysis,
    })

    savedAnalysisId = savedAnalysis.id
    // Try to update session with the analysis ID
    try {
      await nuxtApp.$pb.collection('sessions').update(activeSession.value.id, {
        status: 'done',
        end_time: endTime.toISOString(),
        count_of_total_messages: messagesToAnalyze.length,
        total_time_passed: totalTimePassedMinutes,
        updated: endTime.toISOString(),
        session_analysis_for_system: savedAnalysisId,
      })

      activeSession.value.status = 'done'
      activeSession.value.session_analysis_for_system = savedAnalysisId
      let report: Report | null = null

      // Check if user already has a report
      const existingReport = await getReportByUserId(nuxtApp.$pb.authStore.model?.id)

      if (!existingReport) {
        // Create new report
        report = await createReport({
          user: nuxtApp.$pb.authStore.model.id,
          totalSessions: 1,
          summaries: [{
            session: activeSession.value.id,
            summary: savedAnalysis.summaryOfSession,
            title: savedAnalysis.title,
            date: activeSession.value.created,
            duration: totalTimePassedMinutes,
          }],
          finalDemographicProfile: savedAnalysis.demographicData,
          possibleRiskFactors: savedAnalysis.possibleRiskFactorsExtracted ? [savedAnalysis.possibleRiskFactorsExtracted] : [],
          possibleDeeperGoals: savedAnalysis.possibleDeeperGoalsOfPatient ? [savedAnalysis.possibleDeeperGoalsOfPatient] : [],
        })
      }
      else {
        // Update existing report
        const updatedData = {
          totalSessions: (existingReport.totalSessions || 0) + 1,
          summaries: [...(existingReport.summaries || []), {
            session: activeSession.value.id,
            summary: savedAnalysis.summaryOfSession,
            title: savedAnalysis.title,
            date: activeSession.value.created,
            duration: totalTimePassedMinutes,
          }],
          finalDemographicProfile: {
            ...(existingReport.finalDemographicProfile || {}),
            // Only merge non-null values from new demographic data
            ...Object.fromEntries(
              Object.entries(savedAnalysis.demographicData || {})
                .filter(([key, value]) => value !== null && value !== undefined),
            ),
          },
          possibleRiskFactors: [
            ...(existingReport.possibleRiskFactors || []),
            ...(savedAnalysis.possibleRiskFactorsExtracted ? [savedAnalysis.possibleRiskFactorsExtracted] : []),
          ],
          possibleDeeperGoals: [
            ...(existingReport.possibleDeeperGoals || []),
            ...(savedAnalysis.possibleDeeperGoalsOfPatient ? [savedAnalysis.possibleDeeperGoalsOfPatient] : []),
          ],
        }
        report = await updateReport(existingReport.id, updatedData)
      }
    }
    catch (updateError) {
      console.error('Error updating session:', updateError)
      // Continue even if session update fails - we'll still navigate to analysis
    }
  }
  catch (error) {
    console.error('Error ending session:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پایان جلسه. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    isGeneratingAnalysis.value = false
    isReportModalOpen.value = false

    await navigateTo(`/darmana/therapists/analysis?analysis_id=${savedAnalysisId}`)
  }
}

const handleAudioText = (text: string) => {
  newMessage.value = text
}

const handleAudioSend = () => {
  if (newMessage.value && !messageLoading.value) {
    submitMessage()
  }
}
const handleTextareaClick = () => {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}
const thinkingResponse = ref('')
const isAIThinking = ref(false)
// --- Ensure no 'thinking' message is pushed to messages ---
// In submitMessage or any streaming logic, do not push a 'thinking' or empty message to messages array.
// Only use isAIThinking and thinkingResponse for the typing indicator.

</script>

<template>
  <div class="relative">
    <!-- Horizontal Sidebar -->
    <HorizontalSideBar />
    
    <!-- Main Content with top padding for HorizontalSideBar -->
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen overflow-hidden">
      <!-- Sidebar -->
      <div
        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-r bg-white sm:block"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col">
            <div
              class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
            >
              <NuxtLink to="/dashboard" class="flex items-center justify-center">
                <div class="rounded-full bg-white p-[5px]">
                  <img
                    src="/img/logo-no-bg.png"
                    width="40"
                    height="40"
                    alt=""
                    srcset=""
                  >
                </div>
              <!-- <TairoLogo class="text-primary-600 h-10" /> -->
              </NuxtLink>
            </div>
            <div
              class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
            >
              <BaseThemeToggle />
            </div>
          </div>
          <div class="flex flex-col">
            <div
              class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
            >
              <a
                href="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Back"
                @click.prevent="gotoList()"
              >
                <Icon name="lucide:arrow-right" class="size-5" />
              </a>
            </div>

            <!-- <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="text-danger-400 hover:text-danger-500 hover:bg-danger-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 disabled:opacity-50"
                title="پاک کردن چت"
                @click="openDeleteModal()"
              >
                <Icon name="ph:trash-duotone" class="size-5" />
              </button>
            </div> -->
            <div class="flex h-16 w-full items-center justify-center">
              <DemoAccountMenu />
            </div>
          </div>
        </div>
      </div>
      <!-- Conversations -->
      <div
        class="ltablet:border-r border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-[9] h-screen w-16 bg-white sm:w-20 lg:border-r"
      >
        <div class="mt-3 flex h-full flex-col justify-between gap-2">
          <!-- List -->
          <div>
            <a
              v-for="conversation in conversations"
              :key="conversation.id"
              href="#"
              class="flex size-16 shrink-0 items-center justify-center border-s-2 sm:w-20"
              :class="
                activeTherapistId === conversation.user.id
                  ? 'border-primary-500'
                  : 'border-transparent'
              "
              @click.prevent="selectConversation(conversation.user.id)"
            >
              <div class="relative flex w-full justify-center gap-2">
                <div
                  class="relative flex w-14 shrink-0 items-center justify-center"
                >
                  <a
                    href="#"
                    class="relative block"
                    :class="[
                      selectedConversationComputed?.user.id === conversation.user.id
                        ? 'z-10'
                        : '',
                    ]"
                    @click.prevent="selectConversation(conversation.user.id)"
                  >
                    <BaseAvatar
                      size="sm"
                      rounded="full"
                      :src="
                        conversation.user.avatar
                          ? `https://pocket.zehna.ir/api/files/therapists/${conversation.user.id}/${conversation.user.avatar}`
                          : '/img/avatars/1.svg'
                      "
                      :text="conversation.user.name?.charAt(0)"
                      :class="getRandomColor()"
                    />
                  </a>
                </div>
              </div>
            </a>
          </div>
          <div class="mb-12 flex flex-col gap-3 sm:hidden">
            <button
              class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-2 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="نمایش اطلاعات"
              @click="expanded = !expanded"
            >
              <Icon
                name="ph:robot"
                class="size-5"
              />
            </button>
            <button
              class="bg-success-500/30 dark:bg-success-500/70 dark:text-muted-100 text-muted-600 hover:text-success-500 hover:bg-success-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="پایان جلسه"
              @click="handleEndSession"
            >
              <Icon
                name="ph:check"
                class="size-5"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Current conversation -->
      <div
        class="relative w-full transition-all duration-300"
        :class="
          expanded
            ? 'ltablet:max-w-[calc(100%_-_160px)] lg:max-w-[calc(100%_-_160px)]'
            : 'ltablet:max-w-[calc(100%_-_470px)] lg:max-w-[calc(100%_-_550px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div
            class="mb-2 flex h-16 w-full items-center justify-between px-4 sm:px-8"
          >
            <div class="mt-[140px] flex items-center gap-2 md:mt-4">
              <div class="flex">
                <BaseMessage
                  v-if="!showNoCharge"
                  class="w-[180px]"
                  :color="timeToShow > 10 ? 'success' : 'warning'"
                >
                  <span v-if="timeToShow > 0">
                    <span class="mx-2">⏰</span>
                    {{ timeToShow ?? '--' }} دقیقه</span>
                  <span v-else>وقت تقریبا تمام است</span>
                </BaseMessage>
                <BaseMessage
                  v-else
                  class="w-[280px] justify-center !pl-2"
                  color="warning"
                >
                  لطفا اشتراک تهیه فرمایید.
                  <BaseButtonIcon
                    rounded="full"
                    size="sm"
                    color="success"
                    class="mr-3"
                    to="/onboarding"
                  >
                    <Icon name="ph:shopping-cart" class="size-5" />
                  </BaseButtonIcon>
                </BaseMessage>
                <div class="hidden sm:flex">
                  <button
                    class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                    title="نمایش اطلاعات"
                    @click="expanded = !expanded"
                  >
                    <Icon
                      name="ph:robot"
                      class="size-5"
                    />
                  </button>
                  <button
                    class="bg-success-500/30 dark:bg-success-500/70 dark:text-muted-100 text-muted-600 hover:text-success-500 hover:bg-success-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                    title="پایان جلسه"
                    @click="handleEndSession"
                  >
                    <Icon
                      name="ph:check"
                      class="size-5"
                    />
                  </button>
                </div>
              </div>
            </div>

            <TairoSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            />
          </div>
          <!-- Body -->
          <div
            ref="chatEl"
            class="relative flex h-[calc(100vh-4rem)] flex-col p-4 !pb-60 sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto nui-slimscroll'"
          >
            <!-- Loader-->
            <div v-if="loading" class="mt-8">
              <div class="mb-3 flex items-center justify-center">
                <BasePlaceload
                  class="size-24 shrink-0 rounded-full"
                  :width="96"
                  :height="96"
                />
              </div>
              <div class="flex flex-col items-center">
                <BasePlaceload class="mb-2 h-3 w-full max-w-40 rounded" />
                <BasePlaceload class="mb-2 h-3 w-full max-w-24 rounded" />
                <div class="my-4 flex w-full flex-col items-center">
                  <BasePlaceload class="mb-2 h-2 w-full max-w-60 rounded" />
                  <BasePlaceload class="mb-2 h-2 w-full max-w-52 rounded" />
                </div>
                <div class="mb-6 flex w-full items-center justify-center">
                  <div class="px-4">
                    <BasePlaceload class="h-3 w-14 rounded" />
                  </div>
                  <div class="px-4">
                    <BasePlaceload class="h-3 w-14 rounded" />
                  </div>
                </div>
                <div class="w-full">
                  <BasePlaceload class="h-10 w-full rounded-xl" />
                  <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
                </div>
              </div>
            </div>
            <!-- Messages loop -->
            <div v-else class="space-y-12">
              <div v-if="messages.length === 0" class="flex h-[60vh] flex-col items-center justify-center text-center">
                <div class="mb-6">
                  <Icon name="ph:chat-circle-dots-duotone" class="text-primary-500 size-16" />
                </div>
                <div class="max-w-sm">
                  <h3 class="font-heading text-muted-800 text-xl font-medium leading-normal dark:text-white">
                    {{ showNoCharge ? 'نیاز به دریافت اشتراک' : 'شروع گفت و گو' }}
                  </h3>
                  <p class="text-muted-400 mt-2">
                    {{ showNoCharge ? 'برای استفاده از سرویس ها باید اشتراک تهیه کنید.' : 'به چت درمانی خوش آمدید. اینجا می‌توانید با روانشناس خود گفت و گو کنید.' }}
                  </p>
                  <div class="mt-4">
                    <BaseButton
                      v-if="!showNoCharge"
                      @click="newMessage = 'سلام، من نیاز به کمک دارم.'"
                    >
                      شروع گفت و گو
                    </BaseButton>
                    <BaseButton
                      v-else
                      color="primary"
                      @click="$router.push('/onboarding')"
                    >
                        تهیه اشتراک
                    </BaseButton>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="space-y-8"
              >
                <div
                  v-for="item in messages"
                  :key="item.id"
                  class="mb-4"
                >
                  <div
                    class="flex"
                    :class="[
                      item.type === 'sent' ? 'justify-end' : 'justify-start',
                    ]"
                  >
                    <div
                      class="flex max-w-[85%] flex-col"
                      :class="[
                        item.type === 'sent'
                          ? 'items-end'
                          : 'items-start',
                      ]"
                    >
                      <div
                        class="relative mb-2 flex items-center gap-3"
                        :class="[
                          item.type === 'sent'
                            ? 'flex-row-reverse'
                            : 'flex-row',
                        ]"
                      >
                        <div
                          class="flex flex-col gap-1"
                          :class="[
                            item.type === 'sent'
                              ? 'items-end'
                              : 'items-start',
                          ]"
                        >
                          <div
                            class="flex items-start gap-2"
                            :class="[
                              item.type === 'sent'
                                ? 'flex-row-reverse'
                                : 'flex-row',
                            ]"
                          >
                            <div
                              class="rounded-xl px-4 py-2"
                              :class="[
                                item.type === 'sent'
                                  ? 'bg-primary-500 prose-p:text-white text-white'
                                  : 'bg-muted-200 dark:bg-muted-700 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100',
                              ]"
                            >
                              <span
                                class="block font-sans"
                                :class="[
                                  item.type === 'sent'
                                    ? 'prose-p:text-white text-white'
                                    : 'text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100',
                                ]"
                              >
                                <AddonMarkdownRemark :source="item.text" />
                              </span>
                            </div>
                            <!-- Detail button for sent messages -->
                            <BaseButton
                              v-if="item.type === 'sent'"
                              rounded="full"
                              title="مشاهده جزئیات"
                              size="sm"
                              color="primary"
                              @click="openMessageDetailModal(item)"
                            >
                              <Icon name="ph:magnifying-glass-duotone" class="size-4" />
                            </BaseButton>
                            <!-- Feedback button for assistant messages -->
                            <BaseButton
                              v-if="item.type === 'received' && !item.isTyping"
                              rounded="full"
                              title="نظر دهید"
                              size="sm"
                              color="warning"
                              @click="openFeedbackModal(item)"
                            >
                              <Icon name="ph:chat-circle-text-duotone" class="size-4" />
                            </BaseButton>
                          </div>
                          <span class="text-muted-400 font-sans text-xs">
                            {{ formatTime(item.timestamp) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Assistant thinking bubble -->
                <div v-if="isAIThinking" class="mb-4 flex justify-start">
                  <div class="flex max-w-[85%] flex-col items-start">
                    <div class="bg-muted-200 dark:bg-muted-700 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100 rounded-xl px-4 py-2">
                      <span class="block flex items-center font-sans">
                        <AddonMarkdownRemark :source="thinkingResponse || 'در حال فکر کردن'" />
                        <span class="typing-ellipsis ml-2" />
                      </span>
                    </div>
                  </div>
                </div>
                <!-- No Charge Message -->
                <BaseMessage
                  v-if="showNoCharge"
                  id="no-money-message"
                  color="danger"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="order-2">
                      <BaseButton
                        color="primary"
                        @click="$router.push('/onboarding')"
                      >
                        خرید اشتراک
                      </BaseButton>
                    </div>
                    <div class="order-1">
                      بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.
                    </div>
                  </div>
                </BaseMessage>
              </div>
            </div>
          </div>

          <!-- Compose form - Fixed at bottom -->

          <form
            method="POST"
            action=""
            class="bg-muted-100 dark:bg-muted-900 absolute inset-x-0 bottom-0 w-full p-4"
            @submit.prevent="submitMessage"
          >
            <div class="relative w-full">
              <!-- Scroll to bottom button -->
              <button
                v-if="showScrollButton"
                class="bg-primary-500/20 hover:bg-primary-500/30 dark:bg-primary-500/30 dark:hover:bg-primary-500/40 absolute bottom-[calc(var(--messages-form-height))] left-0 z-10 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300"
                title="پایین صفحه برو"
                @click="scrollToBottom"
              >
                <span class="text-primary-500 text-sm">رفتن به آخرین پیام</span>
                <Icon name="ph:arrow-down-bold" class="text-primary-500 size-5" />
              </button>
              <BaseTextarea
                v-model="newMessage"
                :disabled="showNoCharge || isAIResponding || isAIThinking"
                size="sm"
                label="پیام شما"
                rounded="md"
                :placeholder="showNoCharge ? 'بسته مصرفی شما به اتمام رسیده است' : isAIResponding || isAIThinking ? 'لطفا صبر کنید...' : 'برای ارسال از ↵ + crtl  استفاده کنید.'"
                :rows="6"
                addon
                class="dark:bg-muted-800 bg-white"
                @click="handleTextareaClick"
                @keydown="handleKeydown"
              >
                <template #addon>
                  <div class="flex items-center gap-2">
                    <BaseAvatar
                      src="/img/icons/animated/lightbulb.gif"
                      class="me-1"
                      size="xs"
                    />

                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="semibold"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>درمانا</span>
                    </BaseHeading>
                  </div>

                  <div class="flex items-center gap-2">
                    <!-- Emoji Button -->
                    <div class="relative">
                      <button
                        type="button"
                        class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                        @click.prevent="showEmojiPicker = !showEmojiPicker"
                      >
                        <Icon name="lucide:smile" class="size-5" />
                      </button>

                      <!-- Emoji Picker -->
                      <div
                        v-if="showEmojiPicker"
                        ref="emojiPickerRef"
                        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute bottom-full end-0 mb-2 w-96 rounded-lg border bg-white shadow-lg"
                      >
                        <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b p-2">
                          <span class="text-sm font-medium">انتخاب ایموجی</span>
                          <BaseButtonIcon
                            size="xs"
                            @click="showEmojiPicker = false"
                          >
                            <Icon name="lucide:x" class="size-4" />
                          </BaseButtonIcon>
                        </div>
                        <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-700 relative flex items-center overflow-hidden border-b bg-white p-2">
                          <button
                            type="button"
                            class="text-muted-600 hover:text-primary-500 p-1"
                            @click="scrollTabs('left')"
                          >
                            <Icon name="lucide:chevron-left" class="size-5" />
                          </button>
                          <div ref="tabContainerRef" class="hide-scrollbar flex flex-1 space-x-2 overflow-x-auto p-1">
                            <button
                              v-for="cat in emojiCategories"
                              :key="cat.name"
                              type="button"
                              :class="[
                                'whitespace-nowrap rounded-t-lg px-3 py-1 transition-colors duration-150',
                                currentCategory === cat.name
                                  ? 'bg-muted-100 dark:bg-muted-700 text-muted-800 border-primary-500 dark:border-primary-400 border-b-2 dark:text-white'
                                  : 'text-muted-600 dark:text-muted-400 hover:bg-muted-700 dark:hover:bg-muted-600 bg-transparent hover:text-white'
                              ]"
                              @click="currentCategory = cat.name"
                            >
                              {{ cat.name }}
                            </button>
                          </div>
                          <button
                            type="button"
                            class="text-muted-600 hover:text-primary-500 p-1"
                            @click="scrollTabs('right')"
                          >
                            <Icon name="lucide:chevron-right" class="size-5" />
                          </button>
                        </div>
                        <div class="grid grid-cols-8 gap-2 p-2">
                          <button
                            v-for="emoji in emojiCategories.find(c => c.name === currentCategory).emojis"
                            :key="emoji"
                            type="button"
                            class="hover:bg-muted-100 dark:hover:bg-muted-700 w-full cursor-pointer items-center justify-center rounded p-1 text-2xl"
                            @click="insertEmoji(emoji)"
                          >
                            {{ emoji }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Audio User Component -->
                    <div class="relative">
                      <button
                        type="button"
                        class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                        @click.prevent="toggleAudioUser"
                      >
                        <Icon name="ph:microphone" class="size-5" />
                      </button>
                    </div>

                    <!-- Send Button -->
                    <button
                      type="submit"
                      :disabled="!newMessage || messageLoading"
                      class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-10 items-center justify-center transition-colors duration-300 disabled:opacity-50"
                    >
                      <Icon name="lucide:send" class="size-5" />
                    </button>
                  </div>
                </template>
              </BaseTextarea>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Therapist details sidebar -->
    <div
      class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300"
      :class="expanded ? '-translate-x-full' : 'translate-x-0'"
    >
      <div class="flex h-16 w-full items-center justify-between px-8">
        <BaseHeading
          tag="h3"
          size="lg"
          class="text-muted-800 dark:text-white"
        >
          <span>اطلاعات روانشناس</span>
        </BaseHeading>
        <BaseButtonIcon small @click="expanded = true">
          <Icon
            name="lucide:arrow-left"
            class="pointer-events-none size-4"
          />
        </BaseButtonIcon>
      </div>
      <div class="relative flex w-full flex-col px-8">
        <!-- Loader -->
        <div v-if="loading" class="mt-8">
          <div class="mb-3 flex items-center justify-center">
            <BasePlaceload
              class="size-24 shrink-0 rounded-full"
              :width="96"
              :height="96"
            />
          </div>
          <div class="flex flex-col items-center">
            <BasePlaceload class="mb-2 h-3 w-full max-w-40 rounded" />
            <BasePlaceload class="mb-2 h-3 w-full max-w-24 rounded" />
            <div class="my-4 flex w-full flex-col items-center">
              <BasePlaceload class="mb-2 h-2 w-full max-w-60 rounded" />
              <BasePlaceload class="mb-2 h-2 w-full max-w-52 rounded" />
            </div>
            <div class="mb-6 flex w-full items-center justify-center">
              <div class="px-4">
                <BasePlaceload class="h-3 w-14 rounded" />
              </div>
              <div class="px-4">
                <BasePlaceload class="h-3 w-14 rounded" />
              </div>
            </div>
            <div class="w-full">
              <BasePlaceload class="h-10 w-full rounded-xl" />
              <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
            </div>
          </div>
        </div>
        <!-- User details -->
        <div v-else class="mt-8">
          <div class="flex items-center justify-center">
            <BaseAvatar
              size="2xl"
              rounded="full"
              :src="
                selectedConversationComputed?.user.avatar
                  ? `https://pocket.zehna.ir/api/files/therapists/${selectedConversationComputed.user.id}/${selectedConversationComputed.user.avatar}`
                  : '/img/avatars/1.svg'
              "
              :text="selectedConversationComputed?.user.name?.charAt(0)"
              :class="getRandomColor()"
            />
          </div>
          <div class="mt-2 space-y-3 text-center">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white"
            >
              <span>{{ selectedConversationComputed?.user.name }}</span>
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-400">
              <span>{{ selectedConversationComputed?.user.definingTraits }}</span>
            </BaseParagraph>

            <!-- Session Time Display -->
            <div v-if="activeSession" class="mt-4 grid grid-cols-2 gap-4">
              <div class="bg-muted-200 dark:bg-muted-800/50 rounded-xl p-4">
                <div class="mb-3 flex items-center justify-center gap-2">
                  <Icon name="ph:timer-duotone" class="text-primary-500 dark:text-primary-400 size-5" />
                  <span class="text-muted-600 dark:text-muted-300 text-sm">زمان گذشته</span>
                </div>
                <div class="flex items-baseline justify-center gap-1">
                  <span class="text-muted-800 text-2xl font-semibold dark:text-white">{{ sessionElapsedTime || 0 }}</span>
                  <span class="text-muted-500 dark:text-muted-400 text-sm">دقیقه</span>
                </div>
              </div>
              <div class="bg-muted-200 dark:bg-muted-800/50 rounded-xl p-4">
                <div class="mb-3 flex items-center justify-center gap-2">
                  <Icon name="ph:chats-circle-duotone" class="text-primary-500 dark:text-primary-400 size-5" />
                  <span class="text-muted-600 dark:text-muted-300 text-sm">پیام‌ها</span>
                </div>
                <div class="flex items-baseline justify-center gap-1">
                  <span class="text-muted-800 text-2xl font-semibold dark:text-white">{{ messages.length }}</span>
                  <span class="text-muted-500 dark:text-muted-400 text-sm">پیام</span>
                </div>
              </div>
            </div>

            <div class="my-4 space-y-2">
              <!-- Model search and selector -->
              <div v-if="!modelsError && role === 'admin'" class="relative">
                <BaseInput
                  v-model="modelSearchInput"
                  icon="ph:magnifying-glass"
                  placeholder="جست و جوی مدل های زبانی . . . "
                  class="w-full"
                  @focus="showModelDropdown = true"
                />

                <!-- Model dropdown -->
                <div
                  v-if="showModelDropdown"
                  ref="emojiPickerRef"
                  class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg"
                >
                  <div class="max-h-60 overflow-y-auto p-2">
                    <button
                      v-for="model in filteredModels"
                      :key="model.id"
                      type="button"
                      class="hover:bg-muted-100 dark:hover:bg-muted-700 w-full cursor-pointer rounded p-2 text-left"
                      :class="{ 'bg-muted-100 dark:bg-muted-700': model.id === selectedModel }"
                      @click="selectedModel = model.id; showModelDropdown = false"
                    >
                      <div class="flex items-center justify-between">
                        <span class="font-medium">{{ model.name }}</span>
                        <span class="text-muted-400 text-xs">
                          {{ model.pricing.prompt }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Selected model display -->
              <div
                v-if="selectedModel && !modelsLoading && role === 'admin'"
                class="bg-muted-100 dark:bg-muted-800 flex items-center gap-2 rounded p-2"
              >
                <Icon name="ph:robot" class="text-primary-500 size-5" />
                <span class="text-sm">
                  مدل انتخاب شده : {{ models.find(m => m.id === selectedModel)?.name }}
                </span>
              </div>

              <!-- Error state -->
              <div v-if="modelsError && role === 'admin'" class="text-center">
                <p class="text-danger-500 mb-2">
                  {{ modelsError }}
                </p>
                <BaseButton
                  color="danger"
                  :loading="modelsLoading"
                  @click="retryFetch"
                >
                  تلاش برای دریافت مدل ها
                </BaseButton>
              </div>

              <!-- Model error toast -->
              <div
                v-if="showModelError && role === 'admin'"
                class="bg-danger-500 fixed right-4 top-4 z-50 rounded px-4 py-2 text-white shadow-lg"
              >
                خطایی در پاسخ مدل رخ داد. لطفا دوباره تلاش کنید.
              </div>
            </div>

            <BaseMessage class="mt-5" color="info">
              لطفا توجه داشته باشید که عامل هوش مصنوعی در فاز توسعه می‌‌باشد
              و احتمال ارائه‌ی پاسخ‌های اشتباه را دارد.
            </BaseMessage>
            <BaseMessage class="mt-5" color="warning">
              استفاده شما از سامانه به معنای پذیرش قوانین استفاده و حریم خصوصی است.
            </BaseMessage>
            <BaseButton
              type="button"
              class="ml-3"
              color="primary"
              @click="gotoReport()"
            >
              نمایش پیشینه
              <Icon name="ph:address-book-tabs" class="mr-2 size-5" />
            </BaseButton>
            <BaseButton
              type="button"
              @click="expanded = true"
            >
              بستن پنل
              <Icon name="ph:arrow-left" class="mr-2 size-5" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio User Modal -->
    <TairoModal
      :open="showAudioUser"
      size="md"
      @close="showAudioUser = false"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 sm:p-5">
          <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
            تبدیل صوت به متن
          </h3>
          <BaseButtonClose @click="showAudioUser = false" />
        </div>
      </template>
      <div class="p-4 sm:p-5">
        <AudioUser
          @close="showAudioUser = false"
          @text-ready="handleAudioText"
          @send-message="handleAudioSend"
        />
      </div>
    </TairoModal>
  </div>

  <TairoModal
    :open="isDeleteModalOpen"
    size="sm"
    @close="closeDeleteModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          حذف پیام‌ها
        </h3>
        <BaseButtonClose @click="closeDeleteModal" />
      </div>
    </template>

    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24 justify-center">
          <Icon
            name="ph:trash-duotone"
            class="text-danger-500 size-24"
          />
        </div>

        <h3 class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white">
          حذف تمام پیام‌ها
        </h3>

        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
          آیا مطمئن هستید که می‌خواهید تمام پیام‌های این گفتگو را حذف کنید؟ این عمل قابل بازگشت نیست.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="closeDeleteModal">
            انصراف
          </BaseButton>

          <BaseButton
            color="danger"
            variant="solid"
            @click="confirmClearChat"
          >
            حذف
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Report Modal -->
  <TairoModal
    :open="isReportModalOpen"
    size="sm"
    @close="closeReportModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          ساخت گزارش
        </h3>
        <BaseButtonClose
          v-if="!isGeneratingAnalysis"
          @click="closeReportModal"
        />
      </div>
    </template>
    <div class="relative mx-auto mb-4 flex size-24 justify-center">
      <Icon
        name="ph:clipboard-text"
        class="text-success-500 size-24"
      />
    </div>
    <div class="p-4 text-center md:p-6">
      <p> {{ isGeneratingAnalysis ? 'در حال ساخت گزارش هستیم. لطفا منتظر  بمانید. . . ' : 'آیا مایل به پایان دادن این جلسه و ساخت گزارش از این گفتگو هستید؟' }} </p>
    </div>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-2 p-4 md:p-6">
        <BaseButton
          :disabled="isGeneratingAnalysis"
          @click="closeReportModal"
        >
          انصراف
        </BaseButton>
        <BaseButton
          color="success"
          variant="solid"
          :loading="isGeneratingAnalysis"
          :disabled="isGeneratingAnalysis"
          @click="handleConfirmEndSession"
        >
          تایید
        </BaseButton>
      </div>
    </template>
    <template #content>
      <div class="relative">
        <!-- Loading overlay -->
        <div v-if="isGeneratingAnalysis" class="dark:bg-muted-800/80 absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
          <BaseProgress />
          <p class="text-muted-500 dark:text-muted-400 mt-4">
            در حال تحلیل جلسه و ساخت گزارش...
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Existing modal content -->
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Message Detail Modal -->
  <TairoModal
    :open="isMessageDetailModalOpen"
    size="xl"
    @close="closeMessageDetailModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          جزئیات پیام
        </h3>
        <BaseButtonClose @click="closeMessageDetailModal" />
      </div>
    </template>

    <div class="max-h-[70vh] overflow-y-auto p-4 md:p-6">
      <div v-if="selectedMessage" class="space-y-4">
        <!-- Message content -->
        <div class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
          <div class="mb-2 flex items-center gap-2">
            <Icon name="ph:chat-circle-duotone" class="text-primary-500 size-5" />
            <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">محتوای پیام</span>
          </div>
          <div class="prose prose-sm dark:prose-invert max-w-none text-right">
            <AddonMarkdownRemark :source="selectedMessage.text" />
          </div>
        </div>

        <!-- Message metadata -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Message ID -->
          <div class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:hash-duotone" class="text-info-500 size-5" />
              <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">شناسه پیام</span>
            </div>
            <span class="text-muted-500 dark:text-muted-400 font-mono text-xs">{{ selectedMessage.id }}</span>
          </div>

          <!-- Message time -->
          <div class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:clock-duotone" class="text-warning-500 size-5" />
              <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">زمان ارسال</span>
            </div>
            <span class="text-muted-700 dark:text-muted-300 text-sm">
              {{ new Date(selectedMessage.time || selectedMessage.timestamp).toLocaleString('fa') }}
            </span>
          </div>

          <!-- Message type -->
          <div class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:user-duotone" class="text-success-500 size-5" />
              <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">نوع پیام</span>
            </div>
            <span class="text-muted-700 dark:text-muted-300 text-sm">
              {{ selectedMessage.type === 'sent' ? 'ارسالی (کاربر)' : 'دریافتی (روانشناس)' }}
            </span>
          </div>

          <!-- Character count -->
          <div class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:text-aa-duotone" class="size-5 text-purple-500" />
              <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">تعداد کاراکتر</span>
            </div>
            <span class="text-muted-700 dark:text-muted-300 text-sm">
              {{ selectedMessage.text?.length || 0 }} کاراکتر
            </span>
          </div>
        </div>
        <!-- Emotion Wheel -->
        <div v-if="selectedMessage.analysisResult?.lastMessage_emotions" class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
          <div class="mb-4 flex items-center gap-2">
            <Icon name="ph:heart-duotone" class="size-5 text-pink-500" />
            <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">حالت احساسی پیام</span>
          </div>

          <!-- Emotions Summary -->
          <div class="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              v-for="emotion in selectedMessage.analysisResult.lastMessage_emotions.filter(e => e.severity !== 'خالی')"
              :key="emotion.emotionName"
              class="dark:bg-muted-700 flex items-center justify-between rounded-lg bg-white p-2"
            >
              <span class="text-sm font-medium">{{ emotion.emotionName }}</span>
              <span
                class="rounded-full px-2 py-1 text-xs"
                :class="{
                  'bg-red-100 text-red-800': emotion.severity === 'زیاد',
                  'bg-orange-100 text-orange-800': emotion.severity === 'متوسط',
                  'bg-blue-100 text-blue-800': emotion.severity === 'کم'
                }"
              >
                {{ emotion.severity }}
              </span>
            </div>
          </div>

          <!-- Corresponding Emojis -->
          <div v-if="selectedMessage.analysisResult.correspondingEmojis" class="mb-4 text-center">
            <div class="text-muted-600 dark:text-muted-300 mb-2 text-sm font-medium">
              ایموجی‌های متناظر
            </div>
            <div class="text-2xl">
              {{ selectedMessage.analysisResult.correspondingEmojis }}
            </div>
          </div>

          <!-- Emotion Wheel Visualization -->
          <div class="mb-4">
            <div class="text-muted-600 dark:text-muted-300 mb-2 text-sm font-medium">
              چرخه احساسات
            </div>
            <EmotionWheel :model-value="selectedMessageEmotions" lang="pes" />
          </div>

          <!-- Emotional Response -->
          <div v-if="selectedMessage.analysisResult.emotionalResponse" class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div class="mb-2 flex items-center gap-2">
              <Icon name="ph:lightbulb-duotone" class="size-4 text-blue-500" />
              <span class="text-sm font-medium text-blue-700 dark:text-blue-300">پاسخ پیشنهادی</span>
            </div>
            <p class="text-right text-sm text-blue-600 dark:text-blue-400">
              {{ selectedMessage.analysisResult.emotionalResponse }}
            </p>
          </div>
        </div>

        <!-- No Analysis Available -->
        <div v-else class="bg-muted-100 dark:bg-muted-800 rounded-xl p-4">
          <div class="text-muted-500 dark:text-muted-400 text-center">
            <Icon name="ph:chart-line-duotone" class="mx-auto mb-2 size-12 opacity-50" />
            <p class="text-sm">
              تحلیل احساسات برای این پیام در دسترس نیست
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex justify-end">
          <BaseButton @click="closeMessageDetailModal">
            بستن
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Feedback Modal -->
  <TairoModal
    :open="showFeedbackModal"
    size="xl"
    @close="closeFeedbackModal"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2">
        <div class="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-3 rounded-xl">
          <Icon name="ph:chat-circle-text-duotone" class="text-primary-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-right text-2xl font-bold">
            نظرسنجی پیام
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            نظر شما به بهبود کیفیت پاسخ‌ها کمک می‌کند
          </p>
        </div>
      </div>
    </template>

    <div class="px-6 py-4 space-y-8 max-h-[70vh] overflow-y-auto text-right">
      <!-- Message preview -->
      <div v-if="feedbackMessage" class="bg-gradient-to-r from-muted-50 to-muted-100 dark:from-muted-800 dark:to-muted-700 rounded-xl p-5 border border-muted-200 dark:border-muted-600">
        <div class="mb-4 flex items-center gap-3">
          <Icon name="ph:chat-duotone" class="text-info-500 size-6" />
          <span class="text-muted-700 dark:text-muted-300 text-base font-semibold">پیام مورد بررسی</span>
        </div>
        <div class="bg-white dark:bg-muted-900 text-muted-800 dark:text-muted-100 rounded-lg p-4 max-h-32 overflow-y-auto shadow-sm border border-muted-200 dark:border-muted-600 text-right">
          <div v-if="getMessageContent(feedbackMessage)">
            <AddonMarkdownRemark :source="getMessageContent(feedbackMessage)" />
          </div>
          <div v-else class="text-muted-500 dark:text-muted-400 italic">
            متن پیام موجود نیست
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="space-y-5">
        <div class="flex items-center gap-3">
          <Icon name="ph:ranking-duotone" class="text-warning-500 size-6" />
          <BaseFormLabel for="rating" class="text-muted-700 dark:text-muted-300 font-semibold text-base">
            امتیاز کلی (۱ تا ۵)
          </BaseFormLabel>
        </div>
        <div class="flex items-center gap-4 bg-muted-50 dark:bg-muted-800 rounded-xl p-5">
          <div class="flex items-center gap-2">
            <button
              v-for="rating in 5"
              :key="rating"
              type="button"
              class="text-4xl transition-all duration-200 hover:scale-110"
              :class="rating <= feedbackRating ? 'text-yellow-400 drop-shadow-lg' : 'text-muted-300 dark:text-muted-600 hover:text-yellow-200'"
              @click="feedbackRating = rating"
            >
              <Icon name="ph:star-duotone" class="size-8" />
            </button>
          </div>
          <div class="bg-primary-500/10 px-4 py-2 rounded-full">
            <span class="text-primary-600 dark:text-primary-400 text-sm font-semibold">
              {{ feedbackRating }} از ۵ ستاره
            </span>
          </div>
        </div>
      </div>

      <!-- Feedback Tabs -->
      <div class="space-y-5">
        <div class="flex items-center gap-3">
          <Icon name="ph:folders-duotone" class="text-success-500 size-6" />
          <BaseFormLabel class="text-muted-700 dark:text-muted-300 font-semibold text-base">
            دسته‌بندی نظرات
          </BaseFormLabel>
        </div>
        
        <!-- Tab Navigation -->
        <div class="flex border-b border-muted-200 dark:border-muted-700">
          <button
            type="button"
            class="px-4 py-2 font-medium text-sm transition-colors border-b-2"
            :class="{
              'border-primary-500 text-primary-600 dark:text-primary-400': feedbackActiveTab === 'general',
              'border-transparent text-muted-500 dark:text-muted-400 hover:text-muted-700 dark:hover:text-muted-300': feedbackActiveTab !== 'general'
            }"
            @click="feedbackActiveTab = 'general'"
          >
            عمومی
          </button>
          <button
            type="button"
            class="px-4 py-2 font-medium text-sm transition-colors border-b-2"
            :class="{
              'border-primary-500 text-primary-600 dark:text-primary-400': feedbackActiveTab === 'problems',
              'border-transparent text-muted-500 dark:text-muted-400 hover:text-muted-700 dark:hover:text-muted-300': feedbackActiveTab !== 'problems'
            }"
            @click="feedbackActiveTab = 'problems'"
          >
            مشکلات
          </button>
          <button
            type="button"
            class="px-4 py-2 font-medium text-sm transition-colors border-b-2"
            :class="{
              'border-primary-500 text-primary-600 dark:text-primary-400': feedbackActiveTab === 'quality',
              'border-transparent text-muted-500 dark:text-muted-400 hover:text-muted-700 dark:hover:text-muted-300': feedbackActiveTab !== 'quality'
            }"
            @click="feedbackActiveTab = 'quality'"
          >
            کیفیت
          </button>
          <button
            type="button"
            class="px-4 py-2 font-medium text-sm transition-colors border-b-2"
            :class="{
              'border-primary-500 text-primary-600 dark:text-primary-400': feedbackActiveTab === 'improvements',
              'border-transparent text-muted-500 dark:text-muted-400 hover:text-muted-700 dark:hover:text-muted-300': feedbackActiveTab !== 'improvements'
            }"
            @click="feedbackActiveTab = 'improvements'"
          >
            پیشنهادات
          </button>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[200px]">
          <!-- General Tab -->
          <div v-if="feedbackActiveTab === 'general'" class="space-y-4">
            <p class="text-muted-600 dark:text-muted-400 text-sm text-right">
              نظر کلی خود را در مورد این پیام بیان کنید
            </p>
            <BaseTextarea
              v-model="generalFeedback.text"
              placeholder="نظر خود را اینجا بنویسید..."
              rows="4"
              :disabled="feedbackLoading"
              class="resize-none"
            />
          </div>

          <!-- Problems Tab -->
          <div v-if="feedbackActiveTab === 'problems'" class="space-y-4">
            <p class="text-muted-600 dark:text-muted-400 text-sm">
              مشکلات موجود در این پیام را مشخص کنید
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="option in problemCategories"
                :key="option.value"
                type="button"
                class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                :class="{
                  'border-danger-500 bg-danger-50 dark:bg-danger-500/10': problemsFeedback.categories.includes(option.value),
                  'border-muted-200 dark:border-muted-600 bg-white dark:bg-muted-800 hover:border-danger-300 dark:hover:border-danger-600': !problemsFeedback.categories.includes(option.value)
                }"
                @click="toggleProblemsCategory(option.value)"
              >
                <div 
                  class="p-2 rounded-lg shrink-0"
                  :class="{
                    'bg-danger-500/20': problemsFeedback.categories.includes(option.value),
                    'bg-muted-100 dark:bg-muted-700': !problemsFeedback.categories.includes(option.value)
                  }"
                >
                  <Icon 
                    :name="option.icon" 
                    class="size-5"
                    :class="{
                      'text-danger-600 dark:text-danger-400': problemsFeedback.categories.includes(option.value),
                      [`text-${option.color}-500`]: !problemsFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
                <span 
                  class="text-sm font-medium text-right flex-1"
                  :class="{
                    'text-danger-700 dark:text-danger-300': problemsFeedback.categories.includes(option.value),
                    'text-muted-700 dark:text-muted-300': !problemsFeedback.categories.includes(option.value)
                  }"
                >
                  {{ option.label }}
                </span>
                <div class="mr-auto">
                  <Icon 
                    name="ph:check-circle-duotone" 
                    class="size-5 transition-all duration-200"
                    :class="{
                      'text-danger-500 scale-100': problemsFeedback.categories.includes(option.value),
                      'text-transparent scale-0': !problemsFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
              </button>
            </div>
            
            <!-- Additional problems feedback -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
                توضیحات بیشتر (اختیاری)
              </label>
              <BaseTextarea
                v-model="problemsFeedback.otherText"
                placeholder="سایر مشکلات یا توضیحات بیشتر..."
                rows="3"
                :disabled="feedbackLoading"
                class="resize-none"
              />
            </div>
          </div>

          <!-- Quality Tab -->
          <div v-if="feedbackActiveTab === 'quality'" class="space-y-4">
            <p class="text-muted-600 dark:text-muted-400 text-sm">
              نقاط قوت و کیفیت این پیام را مشخص کنید
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="option in qualityCategories"
                :key="option.value"
                type="button"
                class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                :class="{
                  'border-success-500 bg-success-50 dark:bg-success-500/10': qualityFeedback.categories.includes(option.value),
                  'border-muted-200 dark:border-muted-600 bg-white dark:bg-muted-800 hover:border-success-300 dark:hover:border-success-600': !qualityFeedback.categories.includes(option.value)
                }"
                @click="toggleQualityCategory(option.value)"
              >
                <div 
                  class="p-2 rounded-lg shrink-0"
                  :class="{
                    'bg-success-500/20': qualityFeedback.categories.includes(option.value),
                    'bg-muted-100 dark:bg-muted-700': !qualityFeedback.categories.includes(option.value)
                  }"
                >
                  <Icon 
                    :name="option.icon" 
                    class="size-5"
                    :class="{
                      'text-success-600 dark:text-success-400': qualityFeedback.categories.includes(option.value),
                      [`text-${option.color}-500`]: !qualityFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
                <span 
                  class="text-sm font-medium text-right flex-1"
                  :class="{
                    'text-success-700 dark:text-success-300': qualityFeedback.categories.includes(option.value),
                    'text-muted-700 dark:text-muted-300': !qualityFeedback.categories.includes(option.value)
                  }"
                >
                  {{ option.label }}
                </span>
                <div class="mr-auto">
                  <Icon 
                    name="ph:check-circle-duotone" 
                    class="size-5 transition-all duration-200"
                    :class="{
                      'text-success-500 scale-100': qualityFeedback.categories.includes(option.value),
                      'text-transparent scale-0': !qualityFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
              </button>
            </div>
            
            <!-- Additional quality feedback -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
                توضیحات بیشتر (اختیاری)
              </label>
              <BaseTextarea
                v-model="qualityFeedback.otherText"
                placeholder="سایر نقاط قوت یا توضیحات بیشتر..."
                rows="3"
                :disabled="feedbackLoading"
                class="resize-none"
              />
            </div>
          </div>

          <!-- Improvements Tab -->
          <div v-if="feedbackActiveTab === 'improvements'" class="space-y-4">
            <p class="text-muted-600 dark:text-muted-400 text-sm">
              پیشنهادات شما برای بهبود این نوع پیام‌ها
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="option in improvementSuggestions"
                :key="option.value"
                type="button"
                class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-500/10': improvementsFeedback.categories.includes(option.value),
                  'border-muted-200 dark:border-muted-600 bg-white dark:bg-muted-800 hover:border-primary-300 dark:hover:border-primary-600': !improvementsFeedback.categories.includes(option.value)
                }"
                @click="toggleImprovementsCategory(option.value)"
              >
                <div 
                  class="p-2 rounded-lg shrink-0"
                  :class="{
                    'bg-primary-500/20': improvementsFeedback.categories.includes(option.value),
                    'bg-muted-100 dark:bg-muted-700': !improvementsFeedback.categories.includes(option.value)
                  }"
                >
                  <Icon 
                    :name="option.icon" 
                    class="size-5"
                    :class="{
                      'text-primary-600 dark:text-primary-400': improvementsFeedback.categories.includes(option.value),
                      [`text-${option.color}-500`]: !improvementsFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
                <span 
                  class="text-sm font-medium text-right flex-1"
                  :class="{
                    'text-primary-700 dark:text-primary-300': improvementsFeedback.categories.includes(option.value),
                    'text-muted-700 dark:text-muted-300': !improvementsFeedback.categories.includes(option.value)
                  }"
                >
                  {{ option.label }}
                </span>
                <div class="mr-auto">
                  <Icon 
                    name="ph:check-circle-duotone" 
                    class="size-5 transition-all duration-200"
                    :class="{
                      'text-primary-500 scale-100': improvementsFeedback.categories.includes(option.value),
                      'text-transparent scale-0': !improvementsFeedback.categories.includes(option.value)
                    }"
                  />
                </div>
              </button>
            </div>
            
            <!-- Additional improvements feedback -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-muted-700 dark:text-muted-300">
                توضیحات بیشتر (اختیاری)
              </label>
              <BaseTextarea
                v-model="improvementsFeedback.otherText"
                placeholder="سایر پیشنهادات یا توضیحات بیشتر..."
                rows="3"
                :disabled="feedbackLoading"
                class="resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Other specific feedback -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon name="ph:note-duotone" class="text-warning-500 size-6" />
          <BaseFormLabel for="other-feedback" class="text-muted-700 dark:text-muted-300 font-semibold text-base">
            سایر موارد (اختیاری)
          </BaseFormLabel>
        </div>
        <BaseInput
          id="other-feedback"
          v-model="generalFeedback.otherText"
          placeholder="مثال: پیشنهاد خاص، نکته فنی، و غیره..."
          :disabled="feedbackLoading"
        />
      </div>
    </div>

    <template #footer>
      <div class="p-6 bg-muted-50 dark:bg-muted-800 border-t border-muted-200 dark:border-muted-700 w-full">
        <div class="flex justify-between items-center">
          <div class="text-muted-500 dark:text-muted-400 text-sm flex items-center gap-2">
            <Icon name="ph:shield-check-duotone" class="size-4" />
            نظرات شما محرمانه و امن است
          </div>
          <div class="flex gap-4">
            <BaseButton
              type="button"
              color="muted"
              size="lg"
              @click="closeFeedbackModal"
            >
              انصراف
            </BaseButton>
            <BaseButton
              type="button"
              color="primary"
              size="lg"
              :loading="feedbackLoading"
              @click="submitFeedback"
            >
              <Icon name="ph:paper-plane-duotone" class="size-4 ml-2" />
              ارسال نظر
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Goals Detail Modal -->
  <TairoModal
    :open="showGoalsModal"
    size="lg"
    @close="closeGoalModal"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2">
        <div class="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-3 rounded-xl">
          <Icon name="ph:target-duotone" class="text-primary-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-xl font-bold">
            جزئیات هدف
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            پیشرفت و وضعیت هدف درمانی
          </p>
        </div>
      </div>
    </template>

    <div v-if="selectedGoal" class="px-6 py-4 space-y-6">
      <!-- Goal Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">
            {{ selectedGoal.title }}
          </h4>
          <p class="text-muted-600 dark:text-muted-300 text-sm">
            {{ selectedGoal.description }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <BaseTag
            :color="getGoalStatusColor(selectedGoal.status)"
            size="sm"
          >
            {{ getGoalStatusText(selectedGoal.status) }}
          </BaseTag>
          <BaseTag
            :color="getGoalPriorityColor(selectedGoal.priority)"
            size="sm"
          >
            {{ getGoalPriorityText(selectedGoal.priority) }}
          </BaseTag>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-700 dark:text-muted-300">پیشرفت</span>
          <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {{ selectedGoal.progress_percentage || 0 }}%
          </span>
        </div>
        <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-3">
          <div
            class="bg-primary-500 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${selectedGoal.progress_percentage || 0}%` }"
          ></div>
        </div>
      </div>

      <!-- Goal Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Target Behaviors -->
        <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
          <h5 class="font-medium text-muted-800 dark:text-white mb-3 flex items-center gap-2">
            <Icon name="ph:list-checks-duotone" class="text-success-500 size-4" />
            رفتارهای هدف
          </h5>
          <ul v-if="selectedGoal.target_behaviors && selectedGoal.target_behaviors.length > 0" class="space-y-2">
            <li
              v-for="behavior in selectedGoal.target_behaviors"
              :key="behavior"
              class="flex items-start gap-2 text-sm text-muted-600 dark:text-muted-300"
            >
              <Icon name="ph:check-duotone" class="text-success-500 size-4 mt-0.5 shrink-0" />
              {{ behavior }}
            </li>
          </ul>
          <p v-else class="text-sm text-muted-500 dark:text-muted-400">
            رفتاری تعیین نشده
          </p>
        </div>

        <!-- Success Criteria -->
        <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
          <h5 class="font-medium text-muted-800 dark:text-white mb-3 flex items-center gap-2">
            <Icon name="ph:trophy-duotone" class="text-warning-500 size-4" />
            معیارهای موفقیت
          </h5>
          <ul v-if="selectedGoal.success_criteria && selectedGoal.success_criteria.length > 0" class="space-y-2">
            <li
              v-for="criteria in selectedGoal.success_criteria"
              :key="criteria"
              class="flex items-start gap-2 text-sm text-muted-600 dark:text-muted-300"
            >
              <Icon name="ph:star-duotone" class="text-warning-500 size-4 mt-0.5 shrink-0" />
              {{ criteria }}
            </li>
          </ul>
          <p v-else class="text-sm text-muted-500 dark:text-muted-400">
            معیاری تعیین نشده
          </p>
        </div>
      </div>

      <!-- AI Evaluation -->
      <div v-if="selectedGoal.ai_evaluation" class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
        <h5 class="font-medium text-muted-800 dark:text-white mb-3 flex items-center gap-2">
          <Icon name="ph:brain-duotone" class="text-blue-500 size-4" />
          ارزیابی هوشمند
        </h5>
        <p class="text-sm text-muted-700 dark:text-muted-300">
          {{ selectedGoal.ai_evaluation }}
        </p>
      </div>

      <!-- Notes -->
      <div v-if="selectedGoal.notes" class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
        <h5 class="font-medium text-muted-800 dark:text-white mb-3 flex items-center gap-2">
          <Icon name="ph:note-duotone" class="text-info-500 size-4" />
          یادداشت‌ها
        </h5>
        <p class="text-sm text-muted-600 dark:text-muted-300">
          {{ selectedGoal.notes }}
        </p>
      </div>

      <!-- Timestamps -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center gap-2">
          <Icon name="ph:calendar-plus-duotone" class="text-muted-400 size-4" />
          <span class="text-muted-500 dark:text-muted-400">ایجاد:</span>
          <span class="text-muted-700 dark:text-muted-300">
            {{ new Date(selectedGoal.created).toLocaleDateString('fa-IR') }}
          </span>
        </div>
        <div v-if="selectedGoal.updated" class="flex items-center gap-2">
          <Icon name="ph:calendar-check-duotone" class="text-muted-400 size-4" />
          <span class="text-muted-500 dark:text-muted-400">آخرین بروزرسانی:</span>
          <span class="text-muted-700 dark:text-muted-300">
            {{ new Date(selectedGoal.updated).toLocaleDateString('fa-IR') }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-6 bg-muted-50 dark:bg-muted-800 border-t border-muted-200 dark:border-muted-700">
        <div class="flex justify-end">
          <BaseButton
            type="button"
            color="muted"
            size="lg"
            @click="closeGoalModal"
          >
            بستن
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- System Prompt Modal -->
  <TairoModal
    :open="showSystemPromptModal"
    size="xl"
    @close="showSystemPromptModal = false"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2">
        <div class="bg-gradient-to-r from-muted-500/20 to-muted-600/20 p-3 rounded-xl">
          <Icon name="ph:code-block-duotone" class="text-muted-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-right text-2xl font-bold">
            System Prompt
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            پرامپت سیستم که شامل اطلاعات شما و بازخوردهای قبلی می‌باشد
          </p>
        </div>
      </div>
    </template>

    <div class="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto text-right">
      <div class="bg-gradient-to-r from-muted-50 to-muted-100 dark:from-muted-800 dark:to-muted-700 rounded-xl p-5 border border-muted-200 dark:border-muted-600">
        <div class="mb-4 flex items-center gap-3">
          <Icon name="ph:code-duotone" class="text-muted-500 size-6" />
          <span class="text-muted-700 dark:text-muted-300 text-base font-semibold">متن کامل پرامپت سیستم</span>
        </div>
        <div class="bg-white dark:bg-muted-900 text-muted-800 dark:text-muted-100 rounded-lg p-6 max-h-96 overflow-y-auto shadow-sm border border-muted-200 dark:border-muted-600 text-right">
          <pre class="whitespace-pre-wrap text-sm font-mono leading-relaxed">{{ systemPromptContent }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-x-3 justify-end p-6">
        <BaseButton
          type="button"
          color="muted"
          size="lg"
          @click="showSystemPromptModal = false"
          class="min-w-[120px]"
        >
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>

  <!-- Feedback Summary Modal -->
  <TairoModal
    :open="showFeedbackSummaryModal"
    size="xl"
    @close="showFeedbackSummaryModal = false"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2">
        <div class="bg-gradient-to-r from-info-500/20 to-info-600/20 p-3 rounded-xl">
          <Icon name="ph:chat-circle-dots-duotone" class="text-info-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-right text-2xl font-bold">
            خلاصه بازخوردهای شما
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            بازخوردهای ثبت شده شما که در پاسخ‌های AI اعمال می‌شود
          </p>
        </div>
      </div>
    </template>

    <div class="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto text-right">
      <div class="bg-gradient-to-r from-info-50 to-info-100 dark:from-info-800 dark:to-info-700 rounded-xl p-5 border border-info-200 dark:border-info-600">
        <div class="mb-4 flex items-center gap-3">
          <Icon name="ph:chat-circle-text-duotone" class="text-info-500 size-6" />
          <span class="text-info-700 dark:text-info-300 text-base font-semibold">بازخوردهای اعمال شده</span>
        </div>
        <div class="bg-white dark:bg-muted-900 text-muted-800 dark:text-muted-100 rounded-lg p-6 max-h-96 overflow-y-auto shadow-sm border border-muted-200 dark:border-muted-600 text-right">
          <pre class="whitespace-pre-wrap text-sm leading-relaxed font-sans">{{ feedbackSummaryContent }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-x-3 justify-end p-6">
        <BaseButton
          type="button"
          color="muted"
          size="lg"
          @click="showFeedbackSummaryModal = false"
          class="min-w-[120px]"
        >
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>

  <!-- Factory Reset Confirmation Modal -->
  <TairoModal
    :open="showFactoryResetModal"
    size="md"
    @close="showFactoryResetModal = false"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2">
        <div class="bg-gradient-to-r from-danger-500/20 to-danger-600/20 p-3 rounded-xl">
          <Icon name="ph:warning-duotone" class="text-danger-600 size-7" />
        </div>
        <div>
          <h3 class="font-heading text-muted-900 dark:text-white text-right text-2xl font-bold">
            بازنشانی کامل
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
            این عمل غیرقابل برگشت است
          </p>
        </div>
      </div>
    </template>

    <div class="px-6 py-6 space-y-6 text-right">
      <div class="bg-gradient-to-r from-danger-50 to-danger-100 dark:from-danger-900/30 dark:to-danger-800/30 rounded-xl p-6 border border-danger-200 dark:border-danger-700">
        <div class="mb-6 flex items-center gap-3">
          <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-6" />
          <span class="text-danger-700 dark:text-danger-300 text-base font-semibold">هشدار مهم</span>
        </div>
        <div class="text-danger-800 dark:text-danger-200 text-sm leading-relaxed space-y-4">
          <p class="font-medium text-base">این عمل تمام اطلاعات زیر را به طور کامل پاک خواهد کرد:</p>
          <ul class="space-y-3 mr-4">
            <li class="flex items-center gap-3">
              <Icon name="ph:dot-duotone" class="size-4 text-danger-500" />
              <span>تمام جلسات درمانی شما</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="ph:dot-duotone" class="size-4 text-danger-500" />
              <span>تمام پیام‌ها و مکالمات</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="ph:dot-duotone" class="size-4 text-danger-500" />
              <span>تمام بازخوردها و تنظیمات شخصی</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="ph:dot-duotone" class="size-4 text-danger-500" />
              <span>تمام گزارش‌ها و تحلیل‌ها</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="ph:dot-duotone" class="size-4 text-danger-500" />
              <span>تمام اهداف و پیشرفت‌ها</span>
            </li>
          </ul>
          <div class="mt-6 p-4 bg-danger-100 dark:bg-danger-900/50 rounded-lg border border-danger-200 dark:border-danger-700">
            <p class="font-medium text-danger-700 dark:text-danger-300 flex items-center gap-2">
              <Icon name="ph:warning-duotone" class="size-5" />
              این عمل غیرقابل برگشت است و تمام اطلاعات شما برای همیشه پاک خواهد شد.
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-x-3 justify-end p-6">
        <BaseButton
          type="button"
          color="muted"
          size="lg"
          @click="showFactoryResetModal = false"
          class="min-w-[120px]"
        >
          انصراف
        </BaseButton>
        <BaseButton
          type="button"
          color="danger"
          size="lg"
          :loading="factoryResetLoading"
          @click="performFactoryReset"
          class="min-w-[180px]"
        >
          <Icon name="ph:trash-duotone" class="size-4 ml-1" />
          بله، همه چیز را پاک کن
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>

<style scoped>
.typing-ellipsis {
  display: inline-block;
  width: 1.5em;
  text-align: right; /* RTL support */
  direction: rtl;
}
.typing-ellipsis::after {
  content: '';
  display: inline-block;
  width: 1.5em;
  vertical-align: bottom;
  animation: ellipsis-rtl steps(4,end) 1.2s infinite;
}
@keyframes ellipsis-rtl {
  0% { content: ''; }
  25% { content: '\002E'; }        /* . */
  50% { content: '\002E\002E'; }  /* .. */
  75% { content: '\002E\002E\002E'; } /* ... */
  100% { content: ''; }
}

</style>
<style scoped>
#no-money-message {
  justify-content: space-evenly;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
