<script setup lang="ts">
import { useOpenRouter } from '@/composables/useOpenRouter'
import { useAIResponseSettings } from '@/composables/useAIResponseSettings'
import { convertToEmotionWheel } from '@/utils/emotion-mapper'
import { useOpenAITTS } from '@/composables/useOpenAITTS'

definePageMeta({
  title: 'گفتگو با روانشناس',
  layout: 'empty',
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const { getTherapists } = useTherapist()
const { getCurrentSession, endSession, createSession } = useTherapistSession()
const { getMessages, sendMessage } = useTherapistsMessages()
const { unreadCount } = useNotifications()
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
const ttsLoadingMessageId = ref<string | null>(null)
const hasShownPremiumMessage = ref(false)
const showPremiumAlert = ref(false)

const { play, isLoading: isTTSLoading, error: ttsError } = useOpenAITTS()

const userReport = ref<Report | null>(null)
const hasPreviousData = ref(false)

const playMessageTTS = async (message: any) => {
  if (!message || !message.text) return

  ttsLoadingMessageId.value = message.id
  try {
    await play(message.text)
  }
  catch (error) {
    console.error('Error playing TTS:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پخش صوتی پیام',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    ttsLoadingMessageId.value = null
  }
}

const { generateAnalysis, createAnalysis, getAnalysisForSession } = useSessionAnalysis()
const { createAndLinkAnalysis, getMessageAnalysis } = useMessageAnalysis()
const {
  submitFeedback,
  getFeedbackForMessage,
  validateFeedback,
  FEEDBACK_CATEGORIES,
} = useMessageFeedback()

// AI Response Settings
const { settings: aiSettings, setPremiumStatus } = useAIResponseSettings()

// AI Settings Display Computed
const aiSettingsDisplayText = computed(() => {
  const settings = aiSettings.value

  const emojiMap = {
    very_high: '🤩',
    high: '😊😊',
    medium: '🙂',
    low: '😐',
    none: '🚫',
  }

  const lengthMap = {
    short: 'کوتاه',
    medium: 'متوسط',
    long: 'بلند',
  }

  const toneMap = {
    formal: 'رسمی',
    neutral: 'خنثی',
    casual: 'راحت',
  }

  const creativityMap = {
    0: 'دقیق',
    1: 'متعادل',
    2: 'خلاق',
  }

  return [
    `${settings.isPremium ? '👑' : '🔓'} ${settings.isPremium ? 'پریمیوم' : 'عادی'}`,
    `طول: ${lengthMap[settings.lengthPref]}`,
    `ایموجی: ${emojiMap[settings.emojiLevel]}`,
    `لحن: ${toneMap[settings.tone]}`,
    `خلاقیت: ${creativityMap[settings.creativity]}`,
  ].join(' • ')
})

const toggleAudioUser = () => {
  showAudioUser.value = !showAudioUser.value
}

const togglePremiumStatus = () => {
  setPremiumStatus(!aiSettings.value.isPremium)
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
      // Reset premium message flag when loading new messages
      hasShownPremiumMessage.value = false
      showPremiumAlert.value = false
      scrollToBottom()
      startSessionTimer() // Start session timer when messages are loaded
    }
    else if (!showNoCharge.value) {
      const newSession = await createSession(therapistId)
      if (newSession) {
        activeSession.value = newSession
        sessionId.value = newSession.id
        messages.value = []
        // Reset premium message flag when creating a new session
        hasShownPremiumMessage.value = false
        showPremiumAlert.value = false
        startSessionTimer() // Start session timer for new session
      }
    }
  }
  catch (error) {
    console.error('Error loading messages:', error)
    messages.value = []
    // Reset premium message flag when clearing messages due to error
    hasShownPremiumMessage.value = false
    showPremiumAlert.value = false
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
    thinkingResponse.value = 'در حال تحلیل پیام شما...'
    let analysisResult = null
    let formattedAnalysis = ''
    try {
      // Call generateInlineAnalysis with the user message
      const lastMessage = {
        role: 'user',
        content: userMessage.text,
      }
      
      // Create AbortController for inline analysis
      const analysisAbortController = new AbortController()
      
      // Set a timeout for the analysis request
      const analysisTimeout = setTimeout(() => {
        analysisAbortController.abort()
      }, 30000) // 30 seconds timeout for analysis
      
      analysisResult = await generateInlineAnalysis(lastMessage, { signal: analysisAbortController.signal })
      
      // Clear the timeout if the request completes successfully
      clearTimeout(analysisTimeout)

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
      
      // Keep the analysis visible for a moment before proceeding
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    catch (err) {
      // Check if this is a timeout error
      if (err.message && err.message.includes('زمان پاسخ‌دهی به پایان رسید')) {
        thinkingResponse.value = 'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.'
        toaster.show({
          title: 'زمان پاسخ‌دهی به پایان رسید',
          message: 'درخواست تحلیل پیام شما به دلیل طولانی شدن زمان پاسخ‌دهی لغو شد. لطفا دوباره تلاش کنید.',
          color: 'warning',
          icon: 'ph:warning-circle-fill',
          closable: true,
        })
      } else {
        thinkingResponse.value = 'خطا در دریافت تحلیل. لطفا دوباره تلاش کنید.'
        toaster.show({
          title: 'خطا در تحلیل پیام',
          message: 'در دریافت تحلیل پیام خطایی رخ داد. لطفا دوباره تلاش کنید.',
          color: 'danger',
          icon: 'ph:warning-circle-fill',
          closable: true,
        })
      }
      console.error('Inline analysis error:', err)
      // Wait a moment to show the error before proceeding
      await new Promise(resolve => setTimeout(resolve, 1500))
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
    thinkingResponse.value = 'در حال فکر کردن...'
    
    // Reset streaming state for new message
    streamingBuffer.value = ''
    streamingMessageId.value = '' // Reset message ID tracking
    if (streamingTypingTimeout) {
      clearTimeout(streamingTypingTimeout)
      streamingTypingTimeout = null
    }

    // Debug: Log AI settings before sending
    console.log('AI Settings from messaging.vue (line 443):', aiSettings.value)
    console.log('AI Settings isPremium:', aiSettings.value.isPremium)
    console.log('AI Settings lengthPref:', aiSettings.value.lengthPref)

        // Create AbortController for request cancellation
    const abortController = new AbortController()
    const { signal } = abortController

    // Add a timeout to prevent indefinite thinking state
    const streamTimeout = new Promise((_, reject) => {
      setTimeout(() => {
        // Abort the request when timeout occurs
        abortController.abort()
        reject(new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.'))
      }, 60000) // 60 seconds timeout
    })

    // Race between streamChat and timeout
    try {
      await Promise.race([
        streamChat(chatMessagesForAI, { 
          therapistDetails: selectedConversationComputed.value?.user, 
          aiResponseSettings: aiSettings.value, 
          typingConfig: typingConfig.value,
          signal // Pass abort signal to streamChat
        }, (chunk) => {
          // Handle multi-message responses
          if (typeof chunk === 'object' && chunk.type === 'multi_message') {
            isMultiMessageMode.value = true
            handleMultiMessageChunk(chunk)
          }
          else {
            // Handle regular single message streaming with typing effect
            isMultiMessageMode.value = false
            aiResponse += chunk
            handleStreamingChunk(chunk)
          }
        }),
        streamTimeout
      ])
    } catch (error) {
      // Check if the error is due to abort
      if (error.name === 'AbortError' || signal.aborted) {
        console.log('Request was aborted due to timeout')
        throw new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.')
      }
      throw error
    }

    // Mark streaming as complete for typing effect
    if (!isMultiMessageMode.value && streamingBuffer.value) {
      handleStreamingChunk('', true) // Mark as complete
    }

    // Ensure we're not stuck in thinking mode
    isAIThinking.value = false

    // Remove any temporary typing indicators
    messages.value = messages.value.filter(msg => !msg.isTyping)

    // Save AI response to PocketBase (only for single message mode)
    if (aiResponse && !isMultiMessageMode.value) {
      const savedAIMessage = await sendMessage(currentTherapist.id, session.id, aiResponse, 'received')

      // Add AI response to messages with the correct ID
      messages.value.push({
        type: 'received',
        text: aiResponse,
        timestamp: savedAIMessage.time, // Use timestamp from saved message
        id: savedAIMessage.id, // Use ID from saved message
      })

      // Check if we should show the premium alert
      // Show after the first AI message if user is not premium and has charge
      if (!aiSettings.value.isPremium && !hasShownPremiumMessage.value && !showNoCharge.value) {
        showPremiumAlert.value = true
        hasShownPremiumMessage.value = true
      }
    }
    // Multi-message responses are already saved individually in handleMultiMessageChunk
    checkIfScrolledToBottom()
    isAIResponding.value = false
  }
  catch (e) {
    console.error('Error in chat:', e)
    // Ensure we're not stuck in thinking mode
    isAIThinking.value = false
    isAIResponding.value = false
    
    // Check if this is a timeout error
    if (e.message && e.message.includes('زمان پاسخ‌دهی به پایان رسید')) {
      toaster.show({
        title: 'زمان پاسخ‌دهی به پایان رسید',
        message: 'درخواست شما به دلیل طولانی شدن زمان پاسخ‌دهی لغو شد. لطفا دوباره تلاش کنید.',
        color: 'warning',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
    } else {
      messages.value.push({
        type: 'received',
        text: 'متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.',
        timestamp: new Date().toISOString(),
        id: 'error-' + Date.now(),
      })
    }
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
  
  // Session Details
  let output = '**جزئیات جلسه:**\n'
  output += `- هدف جلسه: ${analysisResult.session_mainGoal || 'نامشخص'}\n`
  output += `- نیاز به مداخله انسانی: ${analysisResult.session_humanInterventionNeeded ? 'بله' : 'خیر'}\n`
  output += `- نیازهای ناهشیار: ${analysisResult.session_unconsciousNeeds || 'نامشخص'}\n\n`

  // Last Message Analysis
  output += '**تحلیل پیام آخر:**\n'
  output += `- احساسات اولیه: ${(analysisResult.lastMessage_primaryEmotions || []).join(', ') || 'نامشخص'}\n`
  output += `- احساسات دقیق‌تر: ${(analysisResult.lastMessage_nuancedEmotions || []).join(', ') || 'نامشخص'}\n`
  output += `- شدت احساسات: ${analysisResult.lastMessage_emotionIntensity || 'نامشخص'}\n`
  output += `- تناسب با هدف جلسه: ${analysisResult.lastMessage_alignmentWithGoal || 'نامشخص'}\n`
  output += `- پاسخ پیشنهادی: ${analysisResult.emotionalResponse || 'نامشخص'}\n`
  
  return output
}

watch(messages, (newMessages) => {
  // Show toast after 10 messages
  if (newMessages.length === 10) {
    // Use nextTick to ensure DOM is updated
    nextTick(() => {
      // Check if toast has already been shown by looking for a flag in localStorage or a ref
      const toastShown = localStorage.getItem('tenMessagesToastShown')
      if (!toastShown) {
        toaster.show({
          title: 'شما به پیش می‌روید!',
          message: 'می‌توانید جلسه را با کلیک بر روی دکمه تیک سبز رنگ در منوی ناوبری پایان دهید.',
          color: 'success',
          icon: 'ph:check-circle',
          closable: true,
          duration: 10000
        })
        // Set flag so toast doesn't show again
        localStorage.setItem('tenMessagesToastShown', 'true')
      }
    })
  }
  
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

watch(timeToShow, (newValue) => {
  if (newValue !== undefined && newValue <= 0 && activeSession.value?.id) {
    // Pause the interval to prevent further decrements
    pause()
    
    // Clear the timer interval
    if (timeUpdateInterval.value) {
      clearInterval(timeUpdateInterval.value)
      timeUpdateInterval.value = null
    }
    
    // Only end session if we haven't already done so
    if (!showNoCharge.value) {
      isReportModalOpen.value = true
      // isGeneratingAnalysis.value = true
      // Call handleConfirmEndSession without await to avoid blocking
      handleConfirmEndSession()
      showNoCharge.value = true
    }
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
  // Reset premium message flag when component is mounted
  hasShownPremiumMessage.value = false
  showPremiumAlert.value = false
  
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

    // Initialize the timer to update every second for a more accurate countdown
    timeUpdateInterval.value = setInterval(() => {
      if (remainingTime.value && startChargeTime.value) {
        const now = new Date()
        const remainingMilliseconds = remainingTime.value.getTime() - now.getTime()
        timeToShow.value = Math.floor(remainingMilliseconds / (1000 * 60))
        // The watch function will handle the session end when timeToShow <= 0
      }
    }, 1000)

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
            
            // Clear the timer interval
            if (timeUpdateInterval.value) {
              clearInterval(timeUpdateInterval.value)
              timeUpdateInterval.value = null
            }
          }
        },
      )

      // fetching userReport for having memory of previous sessions
      try {
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
        } else {
          // User has no report, create a new empty report for them
          console.log('User has no previous report, creating a new one')
          try {
            const newReport = await createReport({
              user: nuxtApp.$pb.authStore.model?.id,
              totalSessions: 0,
              summaries: [],
              possibleDeeperGoals: [],
              possibleRiskFactors: [],
              finalDemographicProfile: {}
            })
            userReport.value = newReport
            hasPreviousData.value = false
            console.log('New report created for user:', newReport)
            
            // Even for new users, we want to start the conversation
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
                // Create a minimal report data object for first-time users
                const firstTimeReport = {
                  totalSessions: 0,
                  summaries: [],
                  possibleDeeperGoals: [],
                  possibleRiskFactors: [],
                  finalDemographicProfile: {}
                }
                // startAIConversationWithSummary(selectedConversationComputed.value?.user, session.id, firstTimeReport)
              }
              else {
                console.log('Messages already exist in conversation, skipping AI introduction')
              }
            }, 1000)
          }
          catch (createError) {
            console.error('Error creating new report for user:', createError)
            // Continue without report if creation fails
          }
        }
      }
      catch (fetchError) {
        console.error('Error fetching user report:', fetchError)
        // Try to create a new report even if fetching failed
        try {
          const newReport = await createReport({
            user: nuxtApp.$pb.authStore.model?.id,
            totalSessions: 0,
            summaries: [],
            possibleDeeperGoals: [],
            possibleRiskFactors: [],
            finalDemographicProfile: {}
          })
          userReport.value = newReport
          hasPreviousData.value = false
          console.log('New report created for user after fetch error:', newReport)
          
          // Even for new users, we want to start the conversation
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
              // Create a minimal report data object for first-time users
              const firstTimeReport = {
                totalSessions: 0,
                summaries: [],
                possibleDeeperGoals: [],
                possibleRiskFactors: [],
                finalDemographicProfile: {}
              }
              // startAIConversationWithSummary(selectedConversationComputed.value?.user, session.id, firstTimeReport)
            }
            else {
              console.log('Messages already exist in conversation, skipping AI introduction')
            }
          }, 1000)
        }
        catch (createError) {
          console.error('Error creating new report after fetch error:', createError)
          // Continue without report if creation fails
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
  
  // Clear countdown interval if it exists
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
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
    // Reset premium message flag when messages are cleared
    hasShownPremiumMessage.value = false
    showPremiumAlert.value = false
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

=== دستورالعمل مهم برای تجربه کاربری ===
CRITICAL UX RULE: هنگامی که اطلاعات خاصی در دسترس ندارید (مانند نام مراجع، سن، یا جزئیات شخصی)، از کلمات طبیعی و دوستانه استفاده کنید به جای قالب‌های خالی یا placeholder ها.

مثال‌های درست:
- به جای [نام مراجع] از "دوست من" یا "عزیز من" استفاده کنید
- به جای [سن] از عبارات کلی مثل "در این سن" یا "در دوره‌ای از زندگی که هستید" استفاده کنید
- به جای [موقعیت] از "در شرایط فعلی" یا "در وضعیت کنونی" استفاده کنید

این کار باعث احساس طبیعی‌تر و دوستانه‌تر شدن گفتگو می‌شود و تجربه کاربری بهتری ایجاد می‌کند.

با توجه به اطلاعات بالا، جلسه جدید را با یک خلاصه از جلسات قبلی و وضعیت مراجع شروع کن و از مراجع بپرس که امروز حالش چطور است و میخواهد درباره چه مسائلی صحبت کند. لحن باید گرم و حرفه‌ای باشد.
همین طور از اهداف عمیق تر احتمالی نیز استفاده کن. کاربر را ترغیب به دادن پاسخ در مورد موضوعات احتمالی کن.
از ایموجی های خوب و جذاب استفاده کن.
مطمئن شو که پاسخت به زبان فارسی باشد.
حتما پاسخ را تنها به زبان فارسی بده.
 `,
    }
    console.log('report', report)

    // Generate initial AI message
    let aiResponse = ''
    streamingBuffer.value = '' // Reset buffer
    streamingMessageId.value = '' // Reset message ID tracking
    if (streamingTypingTimeout) {
      clearTimeout(streamingTypingTimeout)
      streamingTypingTimeout = null
    }

    // Create AbortController for conversation starter
    const conversationAbortController = new AbortController()
    
    // Add a timeout to prevent indefinite thinking state
    const conversationTimeout = new Promise((_, reject) => {
      setTimeout(() => {
        // Abort the request when timeout occurs
        conversationAbortController.abort()
        reject(new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.'))
      }, 60000) // 60 seconds timeout
    })

    // Call the OpenRouter API with the system context (CONVERSATION STARTER MODE)
    try {
      await Promise.race([
        streamChat([systemContext], {
          therapistDetails: therapist,
          aiResponseSettings: aiSettings.value,
          isConversationStarter: true, // Enable comprehensive summary mode
          typingConfig: typingConfig.value,
          signal: conversationAbortController.signal // Pass abort signal
        }, (chunk) => {
          // Conversation starters are ALWAYS single message - no multi-message handling
          aiResponse += chunk
          handleStreamingChunk(chunk)
        }),
        conversationTimeout
      ])
    } catch (error) {
      // Check if the error is due to abort
      if (error.name === 'AbortError' || conversationAbortController.signal.aborted) {
        console.log('Conversation starter request was aborted due to timeout')
        throw new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.')
      }
      throw error
    }

    // Mark streaming as complete for typing effect
    if (streamingBuffer.value) {
      handleStreamingChunk('', true)
    }

    isAIThinking.value = false

    // Remove the temporary typing message
    messages.value = messages.value.filter(msg => !msg.isTyping)

    // Save AI response to PocketBase (conversation starters are always single messages)
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

    // Check if it's a timeout error
    if (e.message && e.message.includes('زمان پاسخ‌دهی به پایان رسید')) {
      toaster.show({
        title: 'زمان پاسخ‌دهی به پایان رسید',
        message: 'درخواست شروع گفتگوی جدید به دلیل طولانی شدن زمان پاسخ‌دهی لغو شد. لطفا دوباره تلاش کنید.',
        color: 'warning',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
    }
    // Check if it's an authentication error
    else if (e.message && e.message.includes('No auth credentials found')) {
      toaster.show({
        title: 'خطا در احراز هویت',
        message: 'مشکلی در احراز هویت رخ داد. لطفاً مجدداً وارد شوید.',
        color: 'danger',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
    }
    else {
      // Add fallback message if the summary fails
      messages.value.push({
        type: 'received',
        text: 'سلام، من روانشناس شما هستم. به نظر می‌رسد جلسات قبلی با هم داشته‌ایم. امروز حالتان چطور است و درباره چه چیزی می‌خواهید صحبت کنیم؟',
        timestamp: new Date().toISOString(),
        id: 'auto-' + Date.now(),
      })
    }
    scrollToBottom()
  }
  finally {
    isAIResponding.value = false
    messageLoading.value = false
  }
}

const isReportModalOpen = ref(false)
const isPremiumModalOpen = ref(false)

const openReportModal = () => {
  isReportModalOpen.value = true
}

const openPremiumModal = () => {
  isPremiumModalOpen.value = true
}

const closePremiumModal = () => {
  isPremiumModalOpen.value = false
}

const closeReportModal = () => {
  // Allow closing the modal even when generating analysis
  isReportModalOpen.value = false
  
  // Clear countdown interval if it exists
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
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

const isFeedbackModalOpen = ref(false)
const selectedMessageForFeedback = ref<any>(null)
const feedbackForm = ref({
  rating: 0,
  general_text: '',
  general_other: '',
  problems_categories: {} as Record<string, boolean>,
  problems_other: '',
  quality_categories: {} as Record<string, boolean>,
  quality_other: '',
  improvements_categories: {} as Record<string, boolean>,
  improvements_other: '',
})
const isSubmittingFeedback = ref(false)
const feedbackStep = ref(1)
const feedbackErrors = ref<string[]>([])
const existingFeedback = ref<any>(null)
const showRetryConfirm = ref(false)
const selectedFeedbackType = ref<'problems' | 'quality' | null>(null)
const feedbackModalContent = ref<HTMLElement | null>(null)

const openMessageDetailModal = (message: any) => {
  selectedMessage.value = message
  isMessageDetailModalOpen.value = true
}

const closeMessageDetailModal = () => {
  isMessageDetailModalOpen.value = false
  selectedMessage.value = null
}

const openFeedbackModal = async (message: any) => {
  selectedMessageForFeedback.value = message
  feedbackStep.value = 1
  feedbackErrors.value = []
  selectedFeedbackType.value = null

  // Check if feedback already exists for this message
  try {
    existingFeedback.value = await getFeedbackForMessage(message.id)
    if (existingFeedback.value) {
      // Load existing feedback data
      feedbackForm.value = {
        rating: existingFeedback.value.rating || 0,
        general_text: existingFeedback.value.general_text || '',
        general_other: existingFeedback.value.general_other || '',
        problems_categories: existingFeedback.value.problems_categories || {},
        problems_other: existingFeedback.value.problems_other || '',
        quality_categories: existingFeedback.value.quality_categories || {},
        quality_other: existingFeedback.value.quality_other || '',
        improvements_categories: existingFeedback.value.improvements_categories || {},
        improvements_other: existingFeedback.value.improvements_other || '',
      }
    }
    else {
      // Reset form for new feedback
      feedbackForm.value = {
        rating: 0,
        general_text: '',
        general_other: '',
        problems_categories: {},
        problems_other: '',
        quality_categories: {},
        quality_other: '',
        improvements_categories: {},
        improvements_other: '',
      }
    }
  }
  catch (error) {
    console.error('Error checking existing feedback:', error)
    existingFeedback.value = null
  }

  isFeedbackModalOpen.value = true
}

const resetModalScroll = () => {
  if (feedbackModalContent.value) {
    feedbackModalContent.value.scrollTop = 0
  }
}

const closeFeedbackModal = () => {
  isFeedbackModalOpen.value = false
  selectedMessageForFeedback.value = null
}

const nextFeedbackStep = () => {
  feedbackErrors.value = []

  if (feedbackStep.value === 1) {
    // Validate basic feedback and category selection
    const errors = validateFeedback(feedbackForm.value)
    if (errors.length > 0) {
      feedbackErrors.value = errors
      return
    }

    // Check if user selected a feedback type
    if (!selectedFeedbackType.value) {
      feedbackErrors.value = ['لطفاً نوع بازخورد خود را انتخاب کنید (مشکلات یا نقاط قوت)']
      return
    }
  }

  if (feedbackStep.value < 3) {
    feedbackStep.value++
    resetModalScroll()
  }
}

const prevFeedbackStep = () => {
  if (feedbackStep.value > 1) {
    feedbackStep.value--
    resetModalScroll()
  }
  feedbackErrors.value = []
}

const submitMessageFeedback = async () => {
  if (!selectedMessageForFeedback.value || !activeSession.value || !activeTherapistId.value) return

  // Final validation
  const errors = validateFeedback(feedbackForm.value)
  if (errors.length > 0) {
    feedbackErrors.value = errors
    feedbackStep.value = 1
    return
  }

  isSubmittingFeedback.value = true
  try {
    const feedbackData = {
      message_id: selectedMessageForFeedback.value.id,
      session_id: activeSession.value.id,
      user_id: nuxtApp.$pb.authStore.model.id,
      therapist_id: activeTherapistId.value,
      message_content: selectedMessageForFeedback.value.text,
      ...feedbackForm.value,
    }

    if (existingFeedback.value) {
      // Update existing feedback
      await nuxtApp.$pb.collection('message_feedback').update(existingFeedback.value.id, feedbackData)
      toaster.show({
        title: 'موفق',
        message: 'بازخورد شما با موفقیت به‌روزرسانی شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      })
    }
    else {
      // Create new feedback
      await submitFeedback(feedbackData)
      toaster.show({
        title: 'موفق',
        message: 'بازخورد شما با موفقیت ثبت شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      })
    }

    closeFeedbackModal()
  }
  catch (error) {
    console.error('Error submitting feedback:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ثبت بازخورد. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    isSubmittingFeedback.value = false
  }
}

const confirmRetryMessage = () => {
  showRetryConfirm.value = true
}

const retryLastMessage = async () => {
  if (messageLoading.value || isAIResponding.value || !messages.value.length) return

  showRetryConfirm.value = false

  // Find the last AI message
  const lastAIMessage = [...messages.value].reverse().find(msg => msg.type === 'received')
  if (!lastAIMessage) {
    toaster.show({
      title: 'خطا',
      message: 'هیچ پیام روانشناس برای تکرار یافت نشد.',
      color: 'warning',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    return
  }

  try {
    messageLoading.value = true
    isAIResponding.value = true

    // Show user feedback
    toaster.show({
      title: 'در حال تولید پاسخ جدید',
      message: 'لطفا کمی صبر کنید...',
      color: 'info',
      icon: 'ph:arrow-clockwise',
      closable: true,
    })

    // Remove the last AI message from the UI and database
    const lastAIMessageIndex = messages.value.findIndex(msg => msg.id === lastAIMessage.id)
    if (lastAIMessageIndex !== -1) {
      messages.value.splice(lastAIMessageIndex, 1)
    }

    // Delete from database
    try {
      await nuxtApp.$pb.collection('therapists_messages').delete(lastAIMessage.id)
    }
    catch (deleteError) {
      console.error('Error deleting message from database:', deleteError)
      // Continue even if delete fails
    }

    // Get the last user message to regenerate response
    const lastUserMessage = [...messages.value].reverse().find(msg => msg.type === 'sent')
    if (!lastUserMessage) {
      toaster.show({
        title: 'خطا',
        message: 'پیام کاربری برای تولید پاسخ یافت نشد.',
        color: 'danger',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
      return
    }

    // Prepare chat history for AI
    const contextMessages = messages.value.map(msg => ({
      role: msg.type === 'sent' ? 'user' : 'assistant',
      content: msg.text,
    }))

    // Generate new AI response
    let aiResponse = ''
    isAIThinking.value = true
    thinkingResponse.value = ''
    
    // Reset streaming state for new message
    streamingBuffer.value = ''
    streamingMessageId.value = '' // Reset message ID tracking
    if (streamingTypingTimeout) {
      clearTimeout(streamingTypingTimeout)
      streamingTypingTimeout = null
    }

    // Create AbortController for retry
    const retryAbortController = new AbortController()
    
    // Add a timeout to prevent indefinite thinking state
    const retryTimeout = new Promise((_, reject) => {
      setTimeout(() => {
        // Abort the request when timeout occurs
        retryAbortController.abort()
        reject(new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.'))
      }, 60000) // 60 seconds timeout
    })

    await Promise.race([
      streamChat(contextMessages, { 
        therapistDetails: selectedConversationComputed.value?.user, 
        aiResponseSettings: aiSettings.value, 
        typingConfig: typingConfig.value,
        signal: retryAbortController.signal // Pass abort signal
      }, (chunk) => {
        // Handle multi-message responses
        if (typeof chunk === 'object' && chunk.type === 'multi_message') {
          handleMultiMessageChunk(chunk)
        }
        else {
          // Handle regular single message streaming with typing effect
          isMultiMessageMode.value = false
          aiResponse += chunk
          handleStreamingChunk(chunk)
        }
      }),
      retryTimeout
    ])

    // Mark streaming as complete for typing effect
    if (!isMultiMessageMode.value && streamingBuffer.value) {
      handleStreamingChunk('', true) // Mark as complete
    }

    isAIThinking.value = false

    // Save new AI response to PocketBase
    const savedAIMessage = await sendMessage(activeTherapistId.value!, activeSession.value!.id, aiResponse, 'received')

    // Add new AI response to messages
    messages.value.push({
      type: 'received',
      text: aiResponse,
      timestamp: savedAIMessage.time,
      id: savedAIMessage.id,
    })

    scrollToBottom()

    toaster.show({
      title: 'موفق',
      message: 'پاسخ جدید تولید شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  }
  catch (error) {
    console.error('Error retrying message:', error)
    
    // Check if this is a timeout error
    if (error.message && error.message.includes('زمان پاسخ‌دهی به پایان رسید')) {
      toaster.show({
        title: 'زمان پاسخ‌دهی به پایان رسید',
        message: 'درخواست تولید پاسخ جدید به دلیل طولانی شدن زمان پاسخ‌دهی لغو شد. لطفا دوباره تلاش کنید.',
        color: 'warning',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
    } else {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید پاسخ جدید. لطفا دوباره تلاش کنید.',
        color: 'danger',
        icon: 'ph:warning-circle-fill',
        closable: true,
      })
    }
  }
  finally {
    messageLoading.value = false
    isAIResponding.value = false
  }
}

const cancelRetry = () => {
  showRetryConfirm.value = false
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
const countdownSeconds = ref(120) // 2 minutes in seconds
const countdownInterval = ref<NodeJS.Timeout | null>(null)

const formatCountdownTime = computed(() => {
  const minutes = Math.floor(countdownSeconds.value / 60)
  const seconds = countdownSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const handleConfirmEndSession = async () => {
  if (!activeSession.value) return
  // Prevent multiple clicks
  if (isGeneratingAnalysis.value) return
  isGeneratingAnalysis.value = true
  countdownSeconds.value = 120 // Reset to 2 minutes
  
  // Start countdown timer
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  countdownInterval.value = setInterval(() => {
    countdownSeconds.value--
    if (countdownSeconds.value <= 0 && countdownInterval.value) {
      clearInterval(countdownInterval.value)
    }
  }, 1000)
  
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
      const savedAnalysisId = existingAnalysis.id
      console.log('Found existing analysis, navigating to:', `/darmana/therapists/analysis?analysis_id=${savedAnalysisId}`)
      isReportModalOpen.value = false
      isGeneratingAnalysis.value = false
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
        countdownInterval.value = null
      }
      // Use nextTick to ensure state updates before navigation
      nextTick(() => {
        console.log('Performing navigation to analysis page with existing analysis')
        navigateTo(`/darmana/therapists/analysis?analysis_id=${savedAnalysisId}`)
      })
      return
    }

    // Generate new analysis
    console.log('Generating new analysis for session:', activeSession.value.id)
    const contextMessages = messages.value.map(msg => ({
      role: msg.type === 'sent' ? 'user' : 'assistant',
      content: msg.text,
    }))
    
    // Add timeout to analysis generation
    const analysisPromise = generateAnalysis({ sessionId: activeSession.value.id, messages: contextMessages })
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('زمان تحلیل جلسه به پایان رسید')), 180000) // 3 minutes timeout
    )
    
    const genAnalysis = await Promise.race([analysisPromise, timeoutPromise])
    console.log('Analysis generated successfully:', genAnalysis)
    const analysis = await createAnalysis({ ...genAnalysis, session: activeSession.value.id })
    console.log('Analysis created successfully with ID:', analysis.id)
    await endSession(activeSession.value.id, analysis.id)
    console.log('Session ended successfully')
    
    // Update user's final report with session data
    try {
      if (userReport.value) {
        // Update existing report
        const updatedReport = {
          totalSessions: (userReport.value.totalSessions || 0) + 1,
          summaries: [
            ...(userReport.value.summaries || []),
            {
              sessionId: activeSession.value.id,
              title: analysis.title || 'جلسه مشاوره',
              summary: analysis.summaryOfSession || '',
              date: new Date().toISOString()
            }
          ],
          finalDemographicProfile: {
            ...(userReport.value.finalDemographicProfile || {}),
            ...(analysis.demographicData || {})
          },
          possibleRiskFactors: [
            ...(userReport.value.possibleRiskFactors || []),
            ...(analysis.possibleRiskFactorsExtracted || [])
          ],
          possibleDeeperGoals: [
            ...(userReport.value.possibleDeeperGoals || []),
            analysis.possibleDeeperGoalsOfPatient || ''
          ]
        }
        
        await updateReport(userReport.value.id, updatedReport)
        console.log('User report updated successfully')
      } else {
        // Create new report if it doesn't exist
        const newReport = {
          user: nuxtApp.$pb.authStore.model.id,
          totalSessions: 1,
          summaries: [
            {
              sessionId: activeSession.value.id,
              title: analysis.title || 'جلسه مشاوره',
              summary: analysis.summaryOfSession || '',
              date: new Date().toISOString()
            }
          ],
          finalDemographicProfile: analysis.demographicData || {},
          possibleRiskFactors: analysis.possibleRiskFactorsExtracted || [],
          possibleDeeperGoals: [analysis.possibleDeeperGoalsOfPatient || '']
        }
        
        const createdReport = await createReport(newReport)
        userReport.value = createdReport
        console.log('New user report created successfully')
      }
    } catch (reportError) {
      console.error('Error updating user report:', reportError)
      // Continue with navigation even if report update fails
    }
    
    // Close modal and reset state before navigation
    isReportModalOpen.value = false
    isGeneratingAnalysis.value = false
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
    
    // Use nextTick to ensure state updates before navigation
    nextTick(() => {
      console.log('Performing navigation to analysis page with new analysis')
      navigateTo(`/darmana/therapists/analysis?analysis_id=${analysis.id}`)
    })
  }
  catch (error) {
    console.error('Error ending session:', error)
    toaster.show({
      title: 'خطا',
      message: error.message || 'خطا در پایان جلسه. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    isGeneratingAnalysis.value = false
    isReportModalOpen.value = false
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
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
const showPremiumModal = ref(false)

// Typing effect for single messages
const typingQueue = ref('')
const displayedResponse = ref('')
const isTypingActive = ref(false)
const currentMessageId = ref('') // Track current message ID

// Function to start typing effect for single messages
const startTypingEffect = (fullText: string, messageId: string = '') => {
  // If message ID changed, reset the typing effect
  if (messageId && currentMessageId.value !== messageId) {
    currentMessageId.value = messageId
    isTypingActive.value = false
    displayedResponse.value = ''
  }
  
  if (!typingConfig.value.enableTypingEffect) {
    thinkingResponse.value = fullText
    return
  }

  // Stop any current typing for different message
  if (messageId && currentMessageId.value !== messageId) {
    isTypingActive.value = false
  }

  // Start new typing effect
  typingQueue.value = fullText
  isTypingActive.value = true

  let currentIndex = displayedResponse.value.length // Continue from where we left off
  const typeNextChar = () => {
    if (currentIndex < typingQueue.value.length && isTypingActive.value) {
      displayedResponse.value += typingQueue.value[currentIndex]
      thinkingResponse.value = displayedResponse.value
      currentIndex++

      // Random delay between 20-50ms for natural typing
      const delay = Math.random() * 30 + 20
      setTimeout(typeNextChar, delay)
    }
    else {
      isTypingActive.value = false
    }
  }

  // Only start if we're at the beginning or continuing the same message
  if (displayedResponse.value === '' || currentMessageId.value === messageId) {
    typeNextChar()
  }
}

// For streaming, we need to handle typing differently
let streamingBuffer = ref('')
let streamingTypingTimeout: NodeJS.Timeout | null = null
let streamingMessageId = ref('') // Track streaming message ID

const handleStreamingChunk = (chunk: string, isComplete: boolean = false) => {
  // Reset buffer when starting a new message
  if (!streamingMessageId.value) {
    streamingMessageId.value = 'msg-' + Date.now()
    streamingBuffer.value = ''
  }
  
  streamingBuffer.value += chunk

  if (typingConfig.value.enableTypingEffect) {
    // Clear previous timeout
    if (streamingTypingTimeout) {
      clearTimeout(streamingTypingTimeout)
    }

    // If this is the final chunk or enough delay, start typing
    if (isComplete) {
      startTypingEffect(streamingBuffer.value, streamingMessageId.value)
      // Reset message ID for next message
      streamingMessageId.value = ''
    }
    else {
      // Debounce typing effect - only start if no new chunks for 100ms
      streamingTypingTimeout = setTimeout(() => {
        startTypingEffect(streamingBuffer.value, streamingMessageId.value)
      }, 100)
    }
  }
  else {
    thinkingResponse.value = streamingBuffer.value
  }
}

// Multi-message handling state
const pendingMultiMessages = ref<any[]>([])
const isMultiMessageMode = ref(false)

// Handle multi-message chunks
const handleMultiMessageChunk = async (chunk: any) => {
  console.log(`📨 Received multi-message chunk ${chunk.index + 1}/${chunk.total}:`, chunk.message)

  // Validate chunk structure
  if (!chunk || typeof chunk.index !== 'number' || typeof chunk.total !== 'number' || !chunk.message) {
    console.error('❌ Invalid multi-message chunk structure:', chunk)
    return
  }

  const currentTherapist = selectedConversationComputed.value?.user
  if (!currentTherapist?.id || !activeSession.value?.id) {
    console.error('❌ Missing therapist or session for multi-message chunk')
    return
  }

  try {
    // Validate message content
    if (!chunk.message.trim()) {
      console.warn(`⚠️ Empty message in chunk ${chunk.index + 1}, skipping`)
      return
    }

    // Save each message to database
    const savedAIMessage = await sendMessage(currentTherapist.id, activeSession.value.id, chunk.message, 'received')

    if (!savedAIMessage?.id) {
      console.error('❌ Failed to save multi-message chunk to database')
      return
    }

    // Add to messages with delay for visual effect
    const messageData = {
      type: 'received',
      text: chunk.message,
      timestamp: savedAIMessage.time,
      id: savedAIMessage.id,
      isMultiMessage: true,
      multiMessageIndex: chunk.index,
      multiMessageTotal: chunk.total,
    }

    if (chunk.index === 0) {
      // First message shows immediately
      messages.value.push(messageData)
      scrollToBottom()
    }
    else {
      // Subsequent messages appear with configurable delay
      const delay = typingConfig.value.messageDelay

      setTimeout(() => {
        messages.value.push(messageData)
        scrollToBottom()

        // Show typing indicator before each message (except the last one)
        if (chunk.index < chunk.total - 1) {
          isAIThinking.value = true
          thinkingResponse.value = 'در حال نوشتن پیام بعدی...'

          // Keep typing indicator for a reasonable time before next message
          setTimeout(() => {
            isAIThinking.value = false
            thinkingResponse.value = ''
          }, Math.min(800, delay - 200)) // Typing indicator duration
        }
      }, delay * chunk.index) // Use cumulative delays like in backend
    }

    // Update final response for database consistency
    if (chunk.index === chunk.total - 1) {
      // Last message, set final state
      const finalDelay = typingConfig.value.messageDelay * chunk.index + 500

      setTimeout(() => {
        isAIResponding.value = false
        isMultiMessageMode.value = false
        console.log('✅ Multi-message sequence completed')
        
        // Check if we should show the premium alert
        // Show after the first AI message if user is not premium and has charge
        if (!aiSettings.value.isPremium && !hasShownPremiumMessage.value && !showNoCharge.value) {
          showPremiumAlert.value = true
          hasShownPremiumMessage.value = true
        }
      }, finalDelay)
    }
  }
  catch (error) {
    console.error('❌ Error handling multi-message chunk:', error)

    // Fallback: show error message
    messages.value.push({
      type: 'received',
      text: 'خطا در دریافت پیام. لطفا دوباره تلاش کنید.',
      timestamp: new Date().toISOString(),
      id: 'error-multi-' + Date.now(),
    })

    isAIResponding.value = false
    isMultiMessageMode.value = false
  }
}

const testMessageInput = ref('نام من علی است و 25 ساله هستم و می‌خواهم اضطراب خودم را کنترل کنم')

// Configurable typing settings - easily customizable delays
const typingConfig = ref({
  messageDelay: 2000, // Delay between multi-messages in milliseconds (change this number to adjust speed)
  enableTypingEffect: true,
})

// To customize delay: Change messageDelay value above
// Examples:
// - 1000 = 1 second delay (faster)
// - 2000 = 2 second delay (default)
// - 3000 = 3 second delay (slower)

// --- Ensure no 'thinking' message is pushed to messages ---
// In submitMessage or any streaming logic, do not push a 'thinking' or empty message to messages array.
// Only use isAIThinking and thinkingResponse for the typing indicator.

</script>

<template>
  <HorizontalSideBar />
  <div class="relative">
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen overflow-hidden">
      <!-- Sidebar -->
      <div
        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-30 hidden h-screen w-20 border-r bg-white sm:block"
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

            <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="text-danger-400 hover:text-danger-500 hover:bg-danger-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 disabled:opacity-50"
                title="پاک کردن چت"
                @click="openDeleteModal()"
              >
                <Icon name="ph:trash-duotone" class="size-5" />
              </button>
            </div>

            <!-- Premium Status Button -->
            <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="flex size-12 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105"
                :class="aiSettings.isPremium
                  ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-500/20 bg-yellow-500/10'
                  : 'text-gray-500 hover:text-gray-600 hover:bg-gray-500/20 bg-gray-500/10'"
                :title="aiSettings.isPremium ? 'وضعیت پریمیوم' : 'وضعیت عادی'"
                @click="openPremiumModal()"
              >
                <Icon
                  :name="aiSettings.isPremium ? 'ph:crown-fill' : 'ph:crown'"
                  class="size-5"
                />
              </button>
            </div>

            <div class="flex h-16 w-full items-center justify-center">
              <NotificationIcon />
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <DemoAccountMenu />
            </div>
          </div>
        </div>
      </div>
      <!-- Conversations -->
      <div
        class="ltablet:border-r border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-70 h-screen w-16 bg-white sm:w-20 lg:border-r"
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
              class="bg-success-500/30 dark:bg-success-500/70 dark:text-muted-100 text-muted-600 hover:text-success-500 hover:bg-success-500/50 mr-2 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="پایان جلسه"
              @click="handleEndSession"
            >
              <Icon
                name="ph:check"
                class="size-5"
              />
            </button>
            <div class="-mr-1">
              <NuxtLink
                to="/settings/ai-response"
                class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 "
                title="AI Controls"
              >
                <Icon
                  name="ph:sliders-duotone"
                  class="size-5"
                />
              </NuxtLink>
            </div>
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
            <div class="flex items-center gap-2 mt-5">
              <div class="flex">
                <BaseMessage
                  v-if="!showNoCharge"
                  class="w-[180px] absolute-timer sm:relative sm:top-auto sm:left-auto sm:z-auto"
                  :color="timeToShow > 10 ? 'success' : 'warning'"
                >
                  <span v-if="timeToShow > 0">
                    <span class="mx-2">⏰</span>
                    {{ timeToShow ?? '--' }} دقیقه</span>
                  <span v-else>وقت تقریبا تمام است</span>
                </BaseMessage>
                <BaseMessage
                  v-else
                  class="w-[280px] justify-center !pl-2 absolute-timer sm:relative sm:top-auto sm:left-auto sm:z-auto"
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

                  <!-- AI Controls button -->
                  <NuxtLink
                    to="/settings/ai-response"
                    class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                    title="AI Controls"
                  >
                    <Icon
                      name="ph:sliders-duotone"
                      class="size-5"
                    />
                  </NuxtLink>
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
            class="relative flex h-[calc(100vh-4rem)] flex-col p-4 !pb-60 sm:p-8 sm:!pb-60"
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
                    {{ showNoCharge ? 'دریافت اشتراک' : 'شروع گفت و گو' }}
                  </h3>
                  <p class="text-muted-400 mt-2">
                    {{ showNoCharge ? 'برای ادامه‌ی استفاده از سامانه لطفا اشتراک تهیه کنید.' : 'به چت درمانی خوش آمدید. اینجا می‌توانید با روانشناس خود گفت و گو کنید.' }}
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
                      دریافت اشتراک
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
                          <!-- Message bubble and buttons on desktop -->
                          <div
                            class="hidden items-start gap-2 sm:flex"
                            :class="[
                              item.type === 'sent'
                                ? 'flex-row-reverse'
                                : 'flex-row',
                            ]"
                          >
                            <div
                              class="rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                              :class="[
                                item.type === 'sent'
                                  ? 'bg-primary-500 prose-p:text-white text-white rounded-br-md'
                                  : 'bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100 rounded-bl-md border border-muted-200 dark:border-muted-700',
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

                            <!-- Desktop buttons - next to message bubble -->
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
                            <BaseButton
                              v-if="item.type === 'received'"
                              rounded="full"
                              title="ثبت بازخورد"
                              size="sm"
                              color="info"
                              @click="openFeedbackModal(item)"
                            >
                              <Icon name="ph:magnifying-glass-duotone" class="size-4" />
                            </BaseButton>
                            <BaseButton
                              v-if="item.type === 'received' && item.id === [...messages].reverse().find(msg => msg.type === 'received')?.id"
                              rounded="full"
                              title="تولید پاسخ جدید"
                              size="sm"
                              color="warning"
                              :disabled="messageLoading || isAIResponding"
                              @click="confirmRetryMessage"
                            >
                              <Icon name="ph:arrow-clockwise-duotone" class="size-4" />
                            </BaseButton>
                            <BaseButton
                              v-if="item.type === 'received'"
                              rounded="full"
                              title="پخش صوتی"
                              size="sm"
                              color="info"
                              :loading="ttsLoadingMessageId === item.id"
                              @click="playMessageTTS(item)"
                            >
                              <Icon
                                v-if="ttsLoadingMessageId === item.id"
                                name="ph:spinner"
                                class="size-4 animate-spin"
                              />
                              <Icon
                                v-else
                                name="ph:play"
                                class="size-4"
                              />
                            </BaseButton>
                          </div>

                          <!-- Message bubble only on mobile -->
                          <div class="block sm:hidden">
                            <div
                              class="rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                              :class="[
                                item.type === 'sent'
                                  ? 'bg-primary-500 prose-p:text-white text-white rounded-br-md'
                                  : 'bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100 rounded-bl-md border border-muted-200 dark:border-muted-700',
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
                          </div>

                          <!-- Timestamp and mobile buttons -->
                          <div
                            class="mt-2 flex items-center gap-2"
                            :class="[
                              item.type === 'sent' ? 'justify-end' : 'justify-start'
                            ]"
                          >
                            <!-- Desktop timestamp -->
                            <span class="text-muted-500 hidden font-sans text-xs sm:block bg-muted-100 dark:bg-muted-800 px-2 py-1 rounded-full">
                              {{ formatTime(item.timestamp) }}
                            </span>

                            <!-- Mobile: sent messages - button on right of timestamp -->
                            <template v-if="item.type === 'sent'">
                              <span class="text-muted-500 block font-sans text-xs sm:hidden bg-muted-100 dark:bg-muted-800 px-2 py-1 rounded-full">
                                {{ formatTime(item.timestamp) }}
                              </span>
                              <BaseButton
                                class="block sm:hidden"
                                rounded="full"
                                title="مشاهده جزئیات"
                                size="sm"
                                color="primary"
                                @click="openMessageDetailModal(item)"
                              >
                                <Icon name="ph:magnifying-glass-duotone" class="size-4" />
                              </BaseButton>
                            </template>

                            <!-- Mobile: received messages - buttons on left of timestamp -->
                            <template v-if="item.type === 'received'">
                              <div class="flex gap-2 sm:hidden">
                                <BaseButton
                                  rounded="full"
                                  title="ثبت بازخورد"
                                  size="sm"
                                  color="info"
                                  @click="openFeedbackModal(item)"
                                >
                                  <Icon name="ph:magnifying-glass-duotone" class="size-4" />
                                </BaseButton>
                                <BaseButton
                                  v-if="item.id === [...messages].reverse().find(msg => msg.type === 'received')?.id"
                                  rounded="full"
                                  title="تولید پاسخ جدید"
                                  size="sm"
                                  color="warning"
                                  :disabled="messageLoading || isAIResponding"
                                  @click="confirmRetryMessage"
                                >
                                  <Icon name="ph:arrow-clockwise-duotone" class="size-4" />
                                </BaseButton>
                              </div>
                              <span class="text-muted-500 block font-sans text-xs sm:hidden bg-muted-100 dark:bg-muted-800 px-2 py-1 rounded-full">
                                {{ formatTime(item.timestamp) }}
                              </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Assistant thinking bubble -->
                <div v-if="isAIThinking" class="mb-4 flex justify-start">
                  <div class="flex max-w-[85%] flex-col items-start">
                    <div class="bg-white dark:bg-muted-800 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100 rounded-2xl rounded-bl-md px-4 py-3 border border-muted-200 dark:border-muted-700 shadow-sm">
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
                <!-- Premium Upgrade Alert -->
                <div 
                  v-else-if="showPremiumAlert"
                  id="premium-upgrade-alert"
                  class="bg-gradient-to-l from-yellow-400/20 to-orange-500/20 dark:from-yellow-600/20 dark:to-orange-700/20 border border-yellow-300 dark:border-yellow-700/50 rounded-2xl p-4 sm:p-5 w-full animate-pulse-slow"
                >
                  <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div class="order-1 flex items-start gap-1">
                      <div class="bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 flex size-10 items-center justify-center rounded-xl shadow-lg">
                        <Icon name="ph:crown-fill" class="text-white size-5" />
                      </div>
                      <div class="text-right">
                        <h4 class="font-heading text-yellow-800 dark:text-yellow-200 text-lg font-bold">
                          ویژگی‌های پیشرفته در انتظار شماست!
                        </h4>
                        <p class="text-yellow-700 dark:text-yellow-300 mt-1 text-sm">
                          با ارتقاء به نسخه پرمیوم، از تمام امکانات پیشرفته هوش مصنوعی بهره‌مند شوید.
                        </p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                            سبک‌های ارتباطی پیشرفته
                          </span>
                          <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                            خلاقیت حداکثری
                          </span>
                          <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                            قالب‌بندی پیشرفته
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="order-3 flex gap-2">
                      <BaseButton
                        color="primary"
                        class="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                        @click="showPremiumModal = true"
                      >
                        <Icon name="ph:crown-fill" class="mr-2 size-4" />
                        ارتقاء به پرمیوم
                      </BaseButton>
                      <div class="order-2">
                        <BaseButtonIcon
                          size="sm"
                          class="bg-white/50 dark:bg-muted-800/50 hover:bg-white dark:hover:bg-muted-700 backdrop-blur-sm"
                          @click="showPremiumAlert = false"
                        >
                          <Icon name="ph:x" class="text-yellow-700 dark:text-yellow-300 size-4" />
                        </BaseButtonIcon>
                      </div>
                    </div>
                  </div>
                </div>
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
            <div class="grid grid-cols-2 gap-3">
              <BaseButton
                type="button"
                color="primary"
                class="w-full"
                @click="gotoReport()"
              >
                نمایش پیشینه
                <Icon name="ph:address-book-tabs" class="mr-2 size-5" />
              </BaseButton>
              <BaseButton
                type="button"
                :color="aiSettings.isPremium ? 'warning' : 'muted'"
                class="w-full"
                @click="openPremiumModal()"
              >
                تنظیمات حاضر
                <Icon
                  name="ph:gear-duotone"
                  class="mr-2 size-5"
                />
              </BaseButton>
            </div>
            <BaseButton
              type="button"
              class="mt-3"
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
      
      <!-- Additional information when not generating -->
      <div v-if="!isGeneratingAnalysis" class="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div class="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
          <Icon name="ph:timer-duotone" class="size-5" />
          <span class="text-sm font-medium">زمان تقریبی تولید گزارش: ۲ دقیقه</span>
        </div>
      </div>
      
      <!-- Countdown timer when generating -->
      <div v-if="isGeneratingAnalysis" class="mt-4">
        <div class="text-muted-500 dark:text-muted-400 mb-2 text-sm">
          زمان باقی‌مانده تقریبی:
        </div>
        <div class="text-primary-600 dark:text-primary-400 text-2xl font-bold">
          {{ formatCountdownTime }}
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-2 p-4 md:p-6">
        <BaseButton
          @click="closeReportModal"
        >
          انصراف
        </BaseButton>
        <BaseButton
          color="success"
          variant="solid"
          :loading="isGeneratingAnalysis"
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

  <!-- Message Feedback Modal -->
  <TairoModal
    :open="isFeedbackModalOpen"
    size="xl"
    @close="closeFeedbackModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <div class="flex items-center gap-3">
          <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
            {{ existingFeedback ? 'ویرایش بازخورد' : 'بازخورد پیام' }}
          </h3>
          <BaseTag
            v-if="existingFeedback"
            color="info"
            size="sm"
          >
            ویرایش
          </BaseTag>
        </div>
        <div class="flex items-center gap-3">
          <!-- Step indicator -->
          <div class="flex items-center gap-2">
            <div
              v-for="step in 3"
              :key="step"
              class="h-2 w-8 rounded-full transition-all duration-200"
              :class="step === feedbackStep ? 'bg-primary-500' : step < feedbackStep ? 'bg-success-500' : 'bg-muted-300'"
            />
          </div>
          <BaseButtonClose @click="closeFeedbackModal" />
        </div>
      </div>
    </template>

    <div ref="feedbackModalContent" class="max-h-[75vh] overflow-y-auto p-4 md:p-6">
      <div v-if="selectedMessageForFeedback">
        <!-- Errors display -->
        <BaseMessage
          v-if="feedbackErrors.length > 0"
          class="mb-6"
          color="danger"
        >
          <div class="space-y-1">
            <div class="font-medium">
              لطفا موارد زیر را بررسی کنید:
            </div>
            <ul class="text-sm">
              <li
                v-for="error in feedbackErrors"
                :key="error"
                class="flex items-center gap-2"
              >
                <Icon name="ph:warning-circle-fill" class="size-4" />
                {{ error }}
              </li>
            </ul>
          </div>
        </BaseMessage>

        <!-- Step 1: Message Display and Category Selection -->
        <div v-if="feedbackStep === 1" class="space-y-8">
          <!-- Message content -->
          <div class="from-primary-50 to-info-50 dark:from-primary-900/20 dark:to-info-900/20 mb-6 rounded-xl bg-gradient-to-r p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:chat-circle-duotone" class="text-primary-500 size-5" />
              <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">پیام روانشناس</span>
            </div>
            <div class="prose prose-sm dark:prose-invert dark:bg-muted-800 max-h-60 max-w-none overflow-y-auto rounded-lg bg-white p-3 text-right">
              <AddonMarkdownRemark :source="selectedMessageForFeedback.text" />
            </div>
          </div>

          <div class="mb-8 text-center">
            <div class="from-primary-100 to-info-100 dark:from-primary-900/30 dark:to-info-900/30 mb-4 inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br">
              <Icon name="ph:star-duotone" class="text-primary-600 dark:text-primary-400 size-8" />
            </div>
            <h4 class="text-muted-800 text-xl font-bold dark:text-white">
              ارزیابی کلی
            </h4>
            <p class="text-muted-500 mt-2 text-sm">
              ابتدا امتیاز کلی و نوع بازخورد خود را انتخاب کنید
            </p>
          </div>

          <!-- Rating -->
          <div class="space-y-4 text-right">
            <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
              امتیاز کلی <span class="text-danger-500">*</span>
            </label>
            <div class="bg-muted-50 dark:bg-muted-800 flex items-center justify-center gap-3 rounded-xl p-4">
              <span class="text-muted-600 text-sm">ضعیف</span>
              <div class="flex gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="transition-all duration-200 hover:scale-110"
                  :class="star <= feedbackForm.rating ? 'text-yellow-400 drop-shadow-sm' : 'text-muted-300 hover:text-yellow-300'"
                  @click="feedbackForm.rating = star"
                >
                  <Icon name="ph:star-fill" class="size-8" />
                </button>
              </div>
              <span class="text-muted-600 text-sm">عالی</span>
            </div>
            <div v-if="feedbackForm.rating > 0" class="text-center">
              <span class="text-primary-600 dark:text-primary-400 text-sm">
                امتیاز شما: {{ feedbackForm.rating }} از 5
              </span>
            </div>
          </div>

          <!-- Feedback Type Selection -->
          <div class="space-y-6 text-right">
            <div class="mb-6 text-center">
              <h5 class="text-muted-800 mb-2 text-lg font-bold dark:text-white">
                نوع بازخورد
              </h5>
              <p class="text-muted-500 text-sm">
                کدام جنبه را می‌خواهید ارزیابی کنید؟
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Problems Selection -->
              <button
                type="button"
                class="focus:ring-primary-500/20 group relative rounded-xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4"
                :class="selectedFeedbackType === 'problems'
                  ? 'border-danger-500 bg-gradient-to-br from-danger-50 to-red-50 dark:from-danger-900/20 dark:to-red-900/20 shadow-lg shadow-danger-500/10'
                  : 'border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800 hover:border-danger-300 hover:shadow-md'"
                @click="selectedFeedbackType = 'problems'"
              >
                <div class="mb-3 flex items-center justify-center">
                  <div
                    class="flex size-12 items-center justify-center rounded-full transition-all duration-300"
                    :class="selectedFeedbackType === 'problems'
                      ? 'bg-danger-100 dark:bg-danger-900/40'
                      : 'bg-muted-100 dark:bg-muted-700 group-hover:bg-danger-50'"
                  >
                    <Icon
                      name="ph:warning-duotone"
                      :class="selectedFeedbackType === 'problems'
                        ? 'text-danger-600 dark:text-danger-400'
                        : 'text-muted-500 group-hover:text-danger-500'"
                      class="size-6"
                    />
                  </div>
                </div>
                <h6
                  class="mb-2 font-bold"
                  :class="selectedFeedbackType === 'problems'
                    ? 'text-danger-700 dark:text-danger-300'
                    : 'text-muted-800 dark:text-white group-hover:text-danger-600'"
                >
                  مشکلات موجود
                </h6>
                <p
                  class="text-sm"
                  :class="selectedFeedbackType === 'problems'
                    ? 'text-danger-600 dark:text-danger-400'
                    : 'text-muted-500 group-hover:text-danger-500'"
                >
                  اگر مشکلی در پاسخ دیدید
                </p>
              </button>

              <!-- Quality Selection -->
              <button
                type="button"
                class="focus:ring-primary-500/20 group relative rounded-xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4"
                :class="selectedFeedbackType === 'quality'
                  ? 'border-success-500 bg-gradient-to-br from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20 shadow-lg shadow-success-500/10'
                  : 'border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800 hover:border-success-300 hover:shadow-md'"
                @click="selectedFeedbackType = 'quality'"
              >
                <div class="mb-3 flex items-center justify-center">
                  <div
                    class="flex size-12 items-center justify-center rounded-full transition-all duration-300"
                    :class="selectedFeedbackType === 'quality'
                      ? 'bg-success-100 dark:bg-success-900/40'
                      : 'bg-muted-100 dark:bg-muted-700 group-hover:bg-success-50'"
                  >
                    <Icon
                      name="ph:heart-duotone"
                      :class="selectedFeedbackType === 'quality'
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-muted-500 group-hover:text-success-500'"
                      class="size-6"
                    />
                  </div>
                </div>
                <h6
                  class="mb-2 font-bold"
                  :class="selectedFeedbackType === 'quality'
                    ? 'text-success-700 dark:text-success-300'
                    : 'text-muted-800 dark:text-white group-hover:text-success-600'"
                >
                  نقاط قوت پاسخ
                </h6>
                <p
                  class="text-sm"
                  :class="selectedFeedbackType === 'quality'
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-muted-500 group-hover:text-success-500'"
                >
                  نقاط مثبت و قوت‌های پاسخ
                </p>
              </button>
            </div>
          </div>

          <!-- General feedback -->
          <div class="space-y-3 text-right">
            <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
              نظر کلی <span class="text-danger-500">*</span>
            </label>
            <BaseTextarea
              v-model="feedbackForm.general_text"
              placeholder="لطفا نظر کلی خود را درباره این پاسخ بنویسید... (حداقل 10 کاراکتر)"
              :rows="4"
              size="lg"
            />
            <div class="text-muted-400 text-right text-xs">
              {{ feedbackForm.general_text.length }} کاراکتر
            </div>
          </div>

          <!-- Additional comments -->
          <div class="space-y-3 text-right">
            <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">توضیحات اضافی</label>
            <BaseTextarea
              v-model="feedbackForm.general_other"
              placeholder="اگر توضیح بیشتری دارید، اینجا بنویسید... (اختیاری)"
              :rows="3"
            />
          </div>
        </div>

        <!-- Step 2: Selected Category Details -->
        <div v-if="feedbackStep === 2" class="space-y-8">
          <div class="mb-6 text-center">
            <div
              class="mb-4 inline-flex size-16 items-center justify-center rounded-full"
              :class="selectedFeedbackType === 'problems'
                ? 'bg-danger-100 dark:bg-danger-900/30'
                : 'bg-success-100 dark:bg-success-900/30'"
            >
              <Icon
                :name="selectedFeedbackType === 'problems' ? 'ph:warning-duotone' : 'ph:heart-duotone'"
                :class="selectedFeedbackType === 'problems'
                  ? 'text-danger-600 dark:text-danger-400'
                  : 'text-success-600 dark:text-success-400'"
                class="size-8"
              />
            </div>
            <h4 class="text-muted-800 text-xl font-bold dark:text-white">
              {{ selectedFeedbackType === 'problems' ? 'مشکلات موجود' : 'نقاط قوت پاسخ' }}
            </h4>
            <p class="text-muted-500 mt-2 text-sm">
              {{ selectedFeedbackType === 'problems'
                ? 'مشکلات موجود در پاسخ را مشخص کنید'
                : 'نقاط قوت و مثبت پاسخ را انتخاب کنید' }}
            </p>
          </div>

          <!-- Problems Section -->
          <div v-if="selectedFeedbackType === 'problems'" class="from-danger-25 to-orange-25 dark:from-danger-950/20 space-y-5 rounded-2xl bg-gradient-to-br p-6 dark:to-orange-950/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="bg-danger-100 dark:bg-danger-900/30 flex size-10 items-center justify-center rounded-xl">
                <Icon name="ph:warning-duotone" class="text-danger-600 dark:text-danger-400 size-5" />
              </div>
              <div>
                <label class="text-danger-800 dark:text-danger-200 block text-right text-base font-bold">مشکلات موجود</label>
                <p class="text-danger-600 dark:text-danger-300 text-sm">
                  در صورت وجود مشکل، انتخاب کنید
                </p>
              </div>
              <div class="ml-auto">
                <div class="text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900/40 rounded-full px-2 py-1 text-xs">
                  {{ Object.keys(feedbackForm.problems_categories).filter(k => feedbackForm.problems_categories[k]).length }} انتخاب شده
                </div>
              </div>
            </div>

            <!-- Problem categories with enhanced design -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="problem in FEEDBACK_CATEGORIES.problems.subcategories"
                :key="problem.id"
                class="group relative"
              >
                <button
                  type="button"
                  class="relative w-full overflow-hidden rounded-xl border-2 p-4 text-right transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  :class="feedbackForm.problems_categories[problem.id]
                    ? 'border-danger-400 bg-gradient-to-br from-danger-50 to-red-50 text-danger-800 dark:from-danger-900/30 dark:to-red-900/30 dark:text-danger-200 shadow-lg shadow-danger-100/50'
                    : 'border-muted-200 bg-white dark:bg-muted-800 hover:border-danger-300 dark:border-muted-600 hover:bg-danger-25 dark:hover:bg-danger-950/10'"
                  @click="feedbackForm.problems_categories[problem.id] = !feedbackForm.problems_categories[problem.id]"
                >
                  <!-- Severity indicator -->
                  <div
                    v-if="problem.severity"
                    class="absolute left-2 top-2 size-2 rounded-full"
                    :class="{
                      'bg-red-500': problem.severity === 'critical',
                      'bg-orange-500': problem.severity === 'high',
                      'bg-yellow-500': problem.severity === 'medium',
                      'bg-blue-500': problem.severity === 'low'
                    }"
                  />

                  <div class="mb-2 flex items-start justify-between">
                    <div class="flex items-center gap-2">
                      <Icon :name="problem.icon || 'ph:warning-duotone'" class="size-5 opacity-75" />
                      <span class="font-semibold">{{ problem.name }}</span>
                    </div>
                    <Icon
                      v-if="feedbackForm.problems_categories[problem.id]"
                      name="ph:check-circle-fill"
                      class="text-danger-500 animate-in zoom-in size-6 duration-200"
                    />
                    <div v-else class="border-muted-300 group-hover:border-danger-400 size-6 rounded-full border-2 transition-colors" />
                  </div>

                  <p class="mb-3 text-sm leading-relaxed opacity-90">
                    {{ problem.description }}
                  </p>

                  <!-- Examples (show on hover or when selected) -->
                  <div
                    v-if="problem.examples && (feedbackForm.problems_categories[problem.id] || false)"
                    class="dark:bg-muted-700/50 space-y-1 rounded-lg bg-white/50 p-2 text-xs"
                  >
                    <div class="font-medium opacity-75">
                      مثال:
                    </div>
                    <ul class="space-y-1">
                      <li
                        v-for="example in problem.examples"
                        :key="example"
                        class="flex items-start gap-1"
                      >
                        <span class="text-danger-400 mt-0.5">•</span>
                        <span class="opacity-80">{{ example }}</span>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>
            </div>

            <!-- Custom problem input -->
            <div class="mt-6">
              <label class="text-danger-700 dark:text-danger-300 mb-2 block text-right text-sm font-medium">
                توضیح بیشتر یا مشکل دیگری؟
              </label>
              <BaseTextarea
                v-model="feedbackForm.problems_other"
                placeholder="اگر مشکل خاصی وجود دارد که در فهرست نیست، لطفاً توضیح دهید..."
                :rows="3"
                size="lg"
                class="!border-danger-200 focus:!border-danger-400 dark:!border-danger-800"
              />
            </div>
          </div>

          <!-- Quality Section -->
          <div v-if="selectedFeedbackType === 'quality'" class="from-success-25 to-emerald-25 dark:from-success-950/20 space-y-5 rounded-2xl bg-gradient-to-br p-6 dark:to-emerald-950/20">
            <div class="mb-4 flex items-center gap-3">
              <div class="bg-success-100 dark:bg-success-900/30 flex size-10 items-center justify-center rounded-xl">
                <Icon name="ph:heart-duotone" class="text-success-600 dark:text-success-400 size-5" />
              </div>
              <div>
                <label class="text-success-800 dark:text-success-200 block text-right text-base font-bold">نقاط قوت پاسخ</label>
                <p class="text-success-600 dark:text-success-300 text-sm">
                  مواردی که در پاسخ خوب بود
                </p>
              </div>
              <div class="ml-auto">
                <div class="text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/40 rounded-full px-2 py-1 text-xs">
                  {{ Object.keys(feedbackForm.quality_categories).filter(k => feedbackForm.quality_categories[k]).length }} انتخاب شده
                </div>
              </div>
            </div>

            <!-- Quality categories with enhanced design -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="quality in FEEDBACK_CATEGORIES.quality.subcategories"
                :key="quality.id"
                class="group relative"
              >
                <button
                  type="button"
                  class="relative w-full overflow-hidden rounded-xl border-2 p-4 text-right transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  :class="feedbackForm.quality_categories[quality.id]
                    ? 'border-success-400 bg-gradient-to-br from-success-50 to-emerald-50 text-success-800 dark:from-success-900/30 dark:to-emerald-900/30 dark:text-success-200 shadow-lg shadow-success-100/50'
                    : 'border-muted-200 bg-white dark:bg-muted-800 hover:border-success-300 dark:border-muted-600 hover:bg-success-25 dark:hover:bg-success-950/10'"
                  @click="feedbackForm.quality_categories[quality.id] = !feedbackForm.quality_categories[quality.id]"
                >
                  <!-- Impact indicator -->
                  <div
                    v-if="quality.impact"
                    class="absolute left-2 top-2 size-2 rounded-full"
                    :class="{
                      'bg-emerald-500': quality.impact === 'high',
                      'bg-green-500': quality.impact === 'medium',
                      'bg-lime-500': quality.impact === 'low'
                    }"
                  />

                  <div class="mb-2 flex items-start justify-between">
                    <div class="flex items-center gap-2">
                      <Icon :name="quality.icon || 'ph:heart-duotone'" class="size-5 opacity-75" />
                      <span class="font-semibold">{{ quality.name }}</span>
                    </div>
                    <Icon
                      v-if="feedbackForm.quality_categories[quality.id]"
                      name="ph:check-circle-fill"
                      class="text-success-500 animate-in zoom-in size-6 duration-200"
                    />
                    <div v-else class="border-muted-300 group-hover:border-success-400 size-6 rounded-full border-2 transition-colors" />
                  </div>

                  <p class="mb-3 text-sm leading-relaxed opacity-90">
                    {{ quality.description }}
                  </p>

                  <!-- Examples -->
                  <div
                    v-if="quality.examples && (feedbackForm.quality_categories[quality.id] || false)"
                    class="dark:bg-muted-700/50 space-y-1 rounded-lg bg-white/50 p-2 text-xs"
                  >
                    <div class="font-medium opacity-75">
                      مثال:
                    </div>
                    <ul class="space-y-1">
                      <li
                        v-for="example in quality.examples"
                        :key="example"
                        class="flex items-start gap-1"
                      >
                        <span class="text-success-400 mt-0.5">•</span>
                        <span class="opacity-80">{{ example }}</span>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>
            </div>

            <!-- Custom quality input -->
            <div class="mt-6">
              <label class="text-success-700 dark:text-success-300 mb-2 block text-right text-sm font-medium">
                نقاط قوت دیگر؟
              </label>
              <BaseTextarea
                v-model="feedbackForm.quality_other"
                placeholder="چه چیز دیگری در این پاسخ خوب بود؟ لطفاً توضیح دهید..."
                :rows="3"
                size="lg"
                class="!border-success-200 focus:!border-success-400 dark:!border-success-800"
              />
            </div>
          </div>

          <!-- Progress indicator -->
          <div class="mt-8 flex items-center justify-center gap-2">
            <div class="text-muted-600 flex items-center gap-1 text-xs">
              <Icon name="ph:info-duotone" class="size-4" />
              <span>انتخاب هیچ‌کدام از گزینه‌ها اختیاری است</span>
            </div>
          </div>
        </div>

        <!-- Step 3: Improvements -->
        <div v-if="feedbackStep === 3" class="space-y-8">
          <div class="mb-8 text-center">
            <div class="from-warning-100 dark:from-warning-900/30 mb-4 inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br to-amber-100 dark:to-amber-900/30">
              <Icon name="ph:lightbulb-duotone" class="text-warning-600 dark:text-warning-400 size-8" />
            </div>
            <h4 class="text-muted-800 text-xl font-bold dark:text-white">
              پیشنهادات بهبود
            </h4>
            <p class="text-muted-500 mt-2 text-sm">
              چگونه می‌توان پاسخ‌ها را بهتر کرد؟
            </p>
            <div class="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
              <Icon name="ph:rocket-duotone" class="size-4" />
              <span>ایده‌های شما برای بهبود</span>
            </div>
          </div>

          <!-- Improvements Section -->
          <div class="from-warning-25 to-amber-25 dark:from-warning-950/20 space-y-6 rounded-2xl bg-gradient-to-br p-6 dark:to-amber-950/20">
            <div class="mb-6 flex items-center gap-3">
              <div class="bg-warning-100 dark:bg-warning-900/30 flex size-10 items-center justify-center rounded-xl">
                <Icon name="ph:lightbulb-duotone" class="text-warning-600 dark:text-warning-400 size-5" />
              </div>
              <div>
                <label class="text-warning-800 dark:text-warning-200 block text-base font-bold">پیشنهادات شما</label>
                <p class="text-warning-600 dark:text-warning-300 text-sm">
                  چه چیزی می‌تواند بهتر باشد؟
                </p>
              </div>
              <div class="ml-auto">
                <div class="text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/40 rounded-full px-2 py-1 text-xs">
                  {{ Object.keys(feedbackForm.improvements_categories).filter(k => feedbackForm.improvements_categories[k]).length }} انتخاب شده
                </div>
              </div>
            </div>

            <!-- Improvements grid with enhanced design -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="improvement in FEEDBACK_CATEGORIES.improvements.subcategories"
                :key="improvement.id"
                class="group relative"
              >
                <button
                  type="button"
                  class="relative w-full overflow-hidden rounded-xl border-2 p-4 text-right transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  :class="feedbackForm.improvements_categories[improvement.id]
                    ? 'border-warning-400 bg-gradient-to-br from-warning-50 to-amber-50 text-warning-800 dark:from-warning-900/30 dark:to-amber-900/30 dark:text-warning-200 shadow-lg shadow-warning-100/50'
                    : 'border-muted-200 bg-white dark:bg-muted-800 hover:border-warning-300 dark:border-muted-600 hover:bg-warning-25 dark:hover:bg-warning-950/10'"
                  @click="feedbackForm.improvements_categories[improvement.id] = !feedbackForm.improvements_categories[improvement.id]"
                >
                  <!-- Priority indicator -->
                  <div
                    v-if="improvement.priority"
                    class="absolute left-2 top-2 size-2 rounded-full"
                    :class="{
                      'bg-red-400': improvement.priority === 'high',
                      'bg-yellow-400': improvement.priority === 'medium',
                      'bg-blue-400': improvement.priority === 'low'
                    }"
                  />

                  <div class="mb-2 flex items-start justify-between">
                    <div class="flex items-center gap-2">
                      <Icon :name="improvement.icon || 'ph:lightbulb-duotone'" class="size-5 opacity-75" />
                      <span class="font-semibold">{{ improvement.name }}</span>
                    </div>
                    <Icon
                      v-if="feedbackForm.improvements_categories[improvement.id]"
                      name="ph:check-circle-fill"
                      class="text-warning-500 animate-in zoom-in size-6 duration-200"
                    />
                    <div v-else class="border-muted-300 group-hover:border-warning-400 size-6 rounded-full border-2 transition-colors" />
                  </div>

                  <p class="mb-3 text-sm leading-relaxed opacity-90">
                    {{ improvement.description }}
                  </p>

                  <!-- Examples -->
                  <div
                    v-if="improvement.examples && (feedbackForm.improvements_categories[improvement.id] || false)"
                    class="dark:bg-muted-700/50 space-y-1 rounded-lg bg-white/50 p-2 text-xs"
                  >
                    <div class="font-medium opacity-75">
                      مثال:
                    </div>
                    <ul class="space-y-1">
                      <li
                        v-for="example in improvement.examples"
                        :key="example"
                        class="flex items-start gap-1"
                      >
                        <span class="text-warning-400 mt-0.5">•</span>
                        <span class="opacity-80">{{ example }}</span>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>
            </div>

            <!-- Custom improvement input with enhanced design -->
            <div class="dark:bg-muted-800/50 mt-8 rounded-xl bg-white/50 p-5">
              <label class="text-warning-700 dark:text-warning-300 mb-3 block flex items-center gap-2 text-sm font-semibold">
                <Icon name="ph:chat-circle-text-duotone" class="size-4" />
                پیشنهاد خاص شما
              </label>
              <BaseTextarea
                v-model="feedbackForm.improvements_other"
                placeholder="ایده‌های شما برای بهبود پاسخ‌ها چیست؟ چه چیزی می‌تواند تجربه را بهتر کند؟"
                :rows="4"
                size="lg"
                class="!border-warning-200 focus:!border-warning-400 dark:!border-warning-800"
              />
              <div class="text-warning-600 dark:text-warning-400 mt-2 text-xs opacity-75">
                هر ایده‌ای که دارید، هر کوچک که باشد، برای ما ارزشمند است! ✨
              </div>
            </div>
          </div>

          <!-- Enhanced Summary Section -->
          <div class="from-info-50 via-blue-25 dark:from-info-950/20 border-info-200/50 dark:border-info-800/30 rounded-2xl border bg-gradient-to-br to-indigo-50 p-6 dark:via-blue-950/10 dark:to-indigo-950/20">
            <div class="mb-6 flex items-center gap-3">
              <div class="from-info-100 dark:from-info-900/50 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br to-blue-100 dark:to-blue-900/50">
                <Icon name="ph:clipboard-text-duotone" class="text-info-600 dark:text-info-400 size-6" />
              </div>
              <div>
                <h5 class="text-info-800 dark:text-info-200 text-lg font-bold">
                  خلاصه بازخورد شما
                </h5>
                <p class="text-info-600 dark:text-info-300 text-sm">
                  مرور نهایی قبل از ارسال
                </p>
              </div>
            </div>

            <div class="grid gap-4">
              <!-- Rating Summary -->
              <div class="dark:bg-muted-800/70 rounded-xl bg-white/70 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-muted-700 dark:text-muted-300 font-medium">امتیاز کلی:</span>
                  <div class="flex items-center gap-2">
                    <div class="flex">
                      <Icon
                        v-for="star in 5"
                        :key="star"
                        name="ph:star-fill"
                        class="size-5"
                        :class="star <= feedbackForm.rating ? 'text-yellow-400' : 'text-muted-300'"
                      />
                    </div>
                    <span class="text-primary-600 dark:text-primary-400 text-lg font-bold">
                      {{ feedbackForm.rating }}/5
                    </span>
                  </div>
                </div>
              </div>

              <!-- Categories Summary -->
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <!-- Problems -->
                <div class="dark:bg-muted-800/70 rounded-lg bg-white/70 p-3">
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:warning-duotone" class="text-danger-500 size-4" />
                      <span class="text-danger-700 dark:text-danger-300 text-sm font-medium">مشکلات</span>
                    </div>
                    <span class="bg-danger-100 dark:bg-danger-900/40 text-danger-600 dark:text-danger-400 rounded-full px-2 py-0.5 text-xs">
                      {{ Object.keys(feedbackForm.problems_categories).filter(k => feedbackForm.problems_categories[k]).length }}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs">
                    <div
                      v-for="(selected, key) in feedbackForm.problems_categories"
                      v-if="selected"
                      :key="key"
                      class="text-danger-600 dark:text-danger-400 flex items-center gap-1"
                    >
                      <span>•</span>
                      <span>{{ FEEDBACK_CATEGORIES.problems.subcategories.find(p => p.id === key)?.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Quality -->
                <div class="dark:bg-muted-800/70 rounded-lg bg-white/70 p-3">
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:heart-duotone" class="text-success-500 size-4" />
                      <span class="text-success-700 dark:text-success-300 text-sm font-medium">نقاط قوت</span>
                    </div>
                    <span class="bg-success-100 dark:bg-success-900/40 text-success-600 dark:text-success-400 rounded-full px-2 py-0.5 text-xs">
                      {{ Object.keys(feedbackForm.quality_categories).filter(k => feedbackForm.quality_categories[k]).length }}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs">
                    <div
                      v-for="(selected, key) in feedbackForm.quality_categories"
                      v-if="selected"
                      :key="key"
                      class="text-success-600 dark:text-success-400 flex items-center gap-1"
                    >
                      <span>•</span>
                      <span>{{ FEEDBACK_CATEGORIES.quality.subcategories.find(q => q.id === key)?.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Improvements -->
                <div class="dark:bg-muted-800/70 rounded-lg bg-white/70 p-3">
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:lightbulb-duotone" class="text-warning-500 size-4" />
                      <span class="text-warning-700 dark:text-warning-300 text-sm font-medium">پیشنهادات</span>
                    </div>
                    <span class="bg-warning-100 dark:bg-warning-900/40 text-warning-600 dark:text-warning-400 rounded-full px-2 py-0.5 text-xs">
                      {{ Object.keys(feedbackForm.improvements_categories).filter(k => feedbackForm.improvements_categories[k]).length }}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs">
                    <div
                      v-for="(selected, key) in feedbackForm.improvements_categories"
                      v-if="selected"
                      :key="key"
                      class="text-warning-600 dark:text-warning-400 flex items-center gap-1"
                    >
                      <span>•</span>
                      <span>{{ FEEDBACK_CATEGORIES.improvements.subcategories.find(i => i.id === key)?.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Comments Summary -->
              <div v-if="feedbackForm.general_text?.trim() || feedbackForm.problems_other?.trim() || feedbackForm.quality_other?.trim() || feedbackForm.improvements_other?.trim()" class="dark:bg-muted-800/70 rounded-xl bg-white/70 p-4">
                <h6 class="text-muted-700 dark:text-muted-300 mb-3 flex items-center gap-2 font-medium">
                  <Icon name="ph:chat-circle-text-duotone" class="size-4" />
                  نظرات تفصیلی
                </h6>
                <div class="space-y-2 text-sm">
                  <div v-if="feedbackForm.general_text?.trim()">
                    <span class="text-primary-600 text-right font-medium">نظر کلی:</span>
                    <p class="text-muted-600 dark:text-muted-400 mt-1 text-xs italic">
                      {{ feedbackForm.general_text }}
                    </p>
                  </div>
                  <div v-if="feedbackForm.improvements_other?.trim()">
                    <span class="text-warning-600 font-medium">پیشنهادات:</span>
                    <p class="text-muted-600 dark:text-muted-400 mt-1 text-xs italic">
                      {{ feedbackForm.improvements_other }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Final message -->
            <div class="mt-6 text-center">
              <div class="text-info-700 dark:text-info-300 bg-info-100/50 dark:bg-info-900/30 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
                <Icon name="ph:heart-duotone" class="size-4" />
                <span>ممنون از وقتی که برای بازخورد گذاشتید! 🙏</span>
              </div>
            </div>
          </div>

          <!-- Progress hint -->
          <div class="flex items-center justify-center gap-2">
            <div class="text-muted-600 flex items-center gap-1 text-xs">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-4" />
              <span>آماده برای ارسال بازخورد</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex justify-between">
          <div>
            <BaseButton
              v-if="feedbackStep > 1"
              variant="outline"
              @click="prevFeedbackStep"
            >
              <Icon name="ph:arrow-right" class="ml-1 size-4" />
              قبلی
            </BaseButton>
          </div>
          <div class="flex gap-2">
            <BaseButton
              :disabled="isSubmittingFeedback"
              @click="closeFeedbackModal"
            >
              انصراف
            </BaseButton>
            <BaseButton
              v-if="feedbackStep < 3"
              color="primary"
              @click="nextFeedbackStep"
            >
              بعدی
              <Icon name="ph:arrow-left" class="mr-1 size-4" />
            </BaseButton>
            <BaseButton
              v-else
              color="success"
              :loading="isSubmittingFeedback"
              :disabled="isSubmittingFeedback || feedbackForm.rating === 0"
              @click="submitMessageFeedback"
            >
              <Icon name="ph:check" class="ml-1 size-4" />
              {{ existingFeedback ? 'به‌روزرسانی' : 'ثبت بازخورد' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Retry Confirmation Modal -->
  <TairoModal
    :open="showRetryConfirm"
    size="sm"
    @close="cancelRetry"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          تولید پاسخ جدید
        </h3>
        <BaseButtonClose @click="cancelRetry" />
      </div>
    </template>

    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24 justify-center">
          <Icon
            name="ph:arrow-clockwise-duotone"
            class="text-warning-500 size-24"
          />
        </div>

        <h3 class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white">
          تولید پاسخ جدید؟
        </h3>

        <p class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-sm leading-5">
          پاسخ فعلی روانشناس حذف شده و پاسخ جدیدی تولید می‌شود. این عمل قابل بازگشت نیست.
        </p>

        <BaseMessage color="warning" class="mt-4 text-xs">
          <div class="flex items-center gap-2">
            <Icon name="ph:info-duotone" class="size-4" />
            <span>تولید پاسخ جدید ممکن است چند ثانیه طول بکشد.</span>
          </div>
        </BaseMessage>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="cancelRetry">
            انصراف
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            @click="retryLastMessage"
          >
            <Icon name="ph:arrow-clockwise" class="ml-1 size-4" />
            تولید پاسخ جدید
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Premium Status Modal -->
  <TairoModal
    :open="isPremiumModalOpen"
    size="md"
    @close="closePremiumModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          {{ aiSettings.isPremium ? 'وضعیت پریمیوم' : 'وضعیت عادی' }}
        </h3>
        <BaseButtonClose @click="closePremiumModal" />
      </div>
    </template>

    <div class="max-h-[70vh] overflow-y-auto p-4 md:p-6">
      <div class="space-y-6">
        <!-- Premium Status Card -->
        <div
          class="rounded-xl p-6"
          :class="aiSettings.isPremium
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 dark:from-yellow-950/30 dark:to-orange-950/30 dark:border-yellow-800/30'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 dark:from-gray-900/30 dark:to-gray-800/30 dark:border-gray-700/30'"
        >
          <div class="mb-4 flex items-center gap-4">
            <div
              class="flex size-12 items-center justify-center rounded-xl"
              :class="aiSettings.isPremium
                ? 'bg-yellow-500/20 text-yellow-600'
                : 'bg-gray-500/20 text-gray-600'"
            >
              <Icon :name="aiSettings.isPremium ? 'ph:crown-fill' : 'ph:crown'" class="size-6" />
            </div>
            <div>
              <h4 class="text-lg font-semibold" :class="aiSettings.isPremium ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-800 dark:text-gray-200'">
                {{ aiSettings.isPremium ? 'کاربر پریمیوم' : 'کاربر عادی' }}
              </h4>
              <p class="text-sm" :class="aiSettings.isPremium ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-300'">
                {{ aiSettings.isPremium ? 'تمام امکانات فعال است' : 'دسترسی محدود به امکانات' }}
              </p>
            </div>
          </div>

          <!-- Toggle Premium Button -->
          <div class="mb-4">
            <button
              class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              :class="aiSettings.isPremium
                ? 'bg-gray-500/20 text-gray-700 dark:text-gray-300 hover:bg-gray-500/30'
                : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30'"
              @click="togglePremiumStatus"
            >
              <Icon :name="aiSettings.isPremium ? 'ph:crown' : 'ph:crown-fill'" class="size-4" />
              {{ aiSettings.isPremium ? 'تبدیل به عادی' : 'فعال‌سازی پریمیوم' }}
            </button>
          </div>
        </div>
        <!-- AI Settings Summary -->
        <div class="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 dark:border-purple-800/30 dark:from-purple-950/30 dark:to-pink-950/30">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-600">
              <Icon name="ph:robot" class="size-5" />
            </div>
            <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200">
              تنظیمات AI فعلی
            </h4>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <Icon name="ph:chat-circle" class="size-4 text-purple-500" />
              <span class="text-purple-700 dark:text-purple-300">
                {{ aiSettings.multiMsgMode === 'single' ? 'تک پیام' : aiSettings.multiMsgMode === 'multi_short' ? 'چند پیام کوتاه' : 'چند پیام متوسط' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:text-aa" class="size-4 text-purple-500" />
              <span class="text-purple-700 dark:text-purple-300">
                {{ aiSettings.lengthPref === 'short' ? 'کوتاه' : aiSettings.lengthPref === 'medium' ? 'متوسط' : 'بلند' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:smiley" class="size-4 text-purple-500" />
              <span class="text-purple-700 dark:text-purple-300">
                {{ aiSettings.emojiLevel === 'very_high' ? 'فوق‌العاده' : aiSettings.emojiLevel === 'high' ? 'زیاد' : aiSettings.emojiLevel === 'medium' ? 'متعادل' : aiSettings.emojiLevel === 'low' ? 'کم' : 'بدون ایموجی' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:sparkle" class="size-4 text-purple-500" />
              <span class="text-purple-700 dark:text-purple-300">
                {{ aiSettings.creativity === '0' ? 'دقیق' : aiSettings.creativity === '1' ? 'متعادل' : 'خلاق' }}
              </span>
            </div>
          </div>

          <div class="mt-4 border-t border-purple-200 pt-4 dark:border-purple-700">
            <NuxtLink
              to="/settings/ai-response"
              class="inline-flex items-center gap-2 text-sm text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
            >
              <Icon name="ph:gear" class="size-4" />
              تغییر تنظیمات AI
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </TairoModal>

  <!-- Premium Upgrade Modal -->
  <TairoModal :open="showPremiumModal" @close="showPremiumModal = false">
    <template #header>
      <div class="flex items-center gap-3 px-8 py-6">
        <Icon name="ph:crown-duotone" class="size-6 text-yellow-500" />
        <h3 class="text-lg font-semibold leading-tight">
          بروزرسانی به نسخه پرمیوم
        </h3>
      </div>
    </template>
    <div class="max-h-[70vh] overflow-y-auto space-y-6 px-8 py-2">
      <div class="mx-2 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 p-8 dark:from-yellow-950/20 dark:to-amber-950/20">
        <div class="mb-6 flex flex-row-reverse items-start gap-4">
          <div class="rounded-xl bg-yellow-500 p-3 shadow-lg">
            <Icon name="ph:sparkle-duotone" class="size-7 text-white" />
          </div>
          <div class="flex-1 text-right">
            <h4 class="mb-2 text-xl font-bold leading-tight text-yellow-800 dark:text-yellow-200">
              ویژگی‌های پیشرفته
            </h4>
            <p class="text-sm leading-snug text-yellow-600 dark:text-yellow-300">
              مخصوص کاربران پرمیوم
            </p>
          </div>
        </div>
        <div class="dark:bg-muted-800/60 rounded-lg bg-white/60 p-5 text-justify backdrop-blur-sm">
          <div class="text-muted-700 dark:text-muted-200 space-y-2 text-base leading-snug">
            <p class="leading-snug">
              با ارتقاء به نسخه پرمیوم، از تمام امکانات پیشرفته هوش مصنوعی بهره‌مند شوید.
            </p>
            <p class="leading-snug">
              این قابلیت فقط برای کاربران پرمیوم قابل دسترسی است.
            </p>
          </div>
        </div>
      </div>
      <div class="space-y-3 px-2">
        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-4 py-1.5">
          <Icon name="ph:check-circle-duotone" class="size-5 shrink-0 text-green-500" />
          <span class="leading-snug">دسترسی به تمام سبک‌های ارتباطی</span>
        </div>
        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-4 py-1.5">
          <Icon name="ph:check-circle-duotone" class="size-5 shrink-0 text-green-500" />
          <span class="leading-snug">امکانات پیشرفته قالب‌بندی</span>
        </div>
        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-4 py-1.5">
          <Icon name="ph:check-circle-duotone" class="size-5 shrink-0 text-green-500" />
          <span class="leading-snug">حداکثر سطح خلاقیت و شخصی‌سازی</span>
        </div>
        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-4 py-1.5">
          <Icon name="ph:check-circle-duotone" class="size-5 shrink-0 text-green-500" />
          <span class="leading-snug">پاسخ‌های بلند و تفصیلی</span>
        </div>
        <div class="text-muted-600 dark:text-muted-300 flex items-center gap-4 py-1.5">
          <Icon name="ph:check-circle-duotone" class="size-5 shrink-0 text-green-500" />
          <span class="leading-snug">سبک‌های ارتباطی رسمی و دوستانه</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-between gap-6 px-8 py-6">
        <BaseButton
          color="muted"
          size="lg"
          class="px-6 py-3 leading-tight"
          @click="showPremiumModal = false"
        >
          بعداً
        </BaseButton>
        <BaseButton
          size="lg"
          class="bg-gradient-to-r from-yellow-500 to-amber-500 px-8 py-3 font-semibold leading-tight text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          @click="$router.push('/onboarding')"
        >
          <Icon name="ph:crown-duotone" class="ml-2 size-5" />
          بروزرسانی به پرمیوم
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

/* Pulse animation for premium alert */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

</style>
<style scoped>
#no-money-message {
  justify-content: space-evenly;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Mobile timer positioning */
@media (max-width: 640px) {
  .absolute-timer {
    position: absolute;
    top: 85px;
    right: 1rem;
    z-index: 10; /* Lower z-index to ensure sidebar is above */
  }
}

/* Ensure sidebar is above timer */
.border-r {
  z-index: 20; /* Higher z-index for sidebar */
}
</style>
