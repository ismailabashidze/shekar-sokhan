<script setup lang="ts">
// import { generateInlineAnalysis } from '@/composables/useOpenRouter'  // REMOVE this import
import { useOpenRouter } from '@/composables/useOpenRouter'

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

const { generateAnalysis, createAnalysis, getAnalysisForSession } = useSessionAnalysis()

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
      messages.value = loadedMessages.map(msg => ({
        ...msg,
        timestamp: msg.time,
      }))
      scrollToBottom()
      startSessionTimer() // Start session timer when messages are loaded
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
    messages.value.push({
      ...userMessage,
      id: savedUserMessage.id,
      timestamp: savedUserMessage.time,
    })
    newMessage.value = ''
    scrollToBottom()

    // Remove temp assistant message logic. Do not push empty message.

    isAIResponding.value = true
    showScrollButton.value = false

    // Inline Analysis Integration
    isAIThinking.value = true
    thinkingResponse.value = ''
    let analysisResult = null
    let formattedAnalysis = ''
    try {
      // Prepare chat history for analysis (convert to ChatMessage[])
      const chatMessages = messages.value.map(msg => ({
        role: msg.type === 'sent' ? 'user' : 'assistant',
        content: msg.text,
      }))
      // Find the last message (assuming it's the user's latest)
      const lastMessageForAnalysis = chatMessages.length > 0 ? [chatMessages[chatMessages.length - 1]] : []
      // Call generateInlineAnalysis with only the last message
      analysisResult = await generateInlineAnalysis(lastMessageForAnalysis)
      // Format and display analysis inline (replace thinking bubble with analysis)
      formattedAnalysis = formatInlineAnalysis(analysisResult)
      thinkingResponse.value = formattedAnalysis
    }
    catch (err) {
      thinkingResponse.value = 'خطا در دریافت تحلیل. لطفا دوباره تلاش کنید.'
      console.error('Inline analysis error:', err)
    }
    finally {
      isAIThinking.value = false
    }

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
    })
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
            if (messages.value.length === 0 ) {
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
    console.log('report', report);
    
    // Generate initial AI message
    let aiResponse = ''

    // Call the OpenRouter API with the system context
    await streamChat([systemContext], { therapistDetails: therapist }, (chunk) => {
      aiResponse += chunk
      thinkingResponse.value = aiResponse
    })

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
    } catch (error: any) {
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
            ...savedAnalysis.demographicData,
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
                    {{ showNoCharge ? 'امکان استفاده رایگان' : 'شروع گفت و گو' }}
                  </h3>
                  <p class="text-muted-400 mt-2">
                    {{ showNoCharge ? 'با توجه به نیاز به همدلی، در حال حاضر می توانید رایگان از سیستم استفاده کنید' : 'به چت درمانی خوش آمدید. اینجا می‌توانید با روانشناس خود گفت و گو کنید.' }}
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
                      @click="$router.push('/deeds/flwuszbc7yo9obf')"
                    >
دریافت کد                    </BaseButton>
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
      <p> {{ isGeneratingAnalysis ? 'در حال ساخت گزارش...' : 'آیا مایل به پایان دادن این جلسه و ساخت گزارش از این گفتگو هستید؟' }} </p>
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
