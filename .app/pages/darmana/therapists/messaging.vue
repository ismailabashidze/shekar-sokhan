<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import AudioUser from '@/components/global/AudioUser.vue'
import { useUser } from '@/composables/user'
import { useTherapistsMessages } from '@/composables/therapistsMessages'
import type { Therapist, Message } from '@/types'
import { useSessionAnalysis } from '~/composables/useSessionAnalysis'

definePageMeta({
  title: 'گفتگو با روانشناس',
  layout: 'empty',
  preview: {
    title: 'Messaging app',
    description: 'For chat and messaging apps',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-messaging.png',
    srcDark: '/img/screens/dashboards-messaging-dark.png',
    order: 26,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })
const { open } = usePanels()
const { getTherapists } = useTherapist()
const { getCurrentSession, createSession, endSession, updateSession } = useTherapistSession()
const { getMessages, sendMessage } = useTherapistsMessages()
const route = useRoute()

// Properly typed reactive references
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
const search = ref('')
const { role } = useUser()
const sessionId = ref<string | null>(null)

const { generateAnalysis, createAnalysis } = useSessionAnalysis()

const handleSessionStatusChange = async (newStatus: string) => {
  if (newStatus === 'done') {
    try {
      // Get all messages for this session
      const allMessages = messages.value.map(msg => ({
        role: msg.type === 'sent' ? 'patient' : 'therapist',
        content: msg.text
      }))

      // Generate and save analysis
      const generatedAnalysis = await generateAnalysis({
        sessionId: activeSession.value?.id,
        messages: allMessages
      })
      
      await createAnalysis({
        session: activeSession.value?.id,
        ...generatedAnalysis
      })

      // Navigate to analysis page
      navigateTo(`/darmana/therapists/analysis?sessionId=${activeSession.value?.id}`)
    } catch (error) {
      console.error('Error generating session analysis:', error)
    }
  }
}

const toggleAudioUser = () => {
  showAudioUser.value = !showAudioUser.value
}

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊',
  '😇', '🙃', '😉', '😊', '😋', '😎', '😍',
  '😘', '😗', '😙', '😚', '😛', '😝', '😞',
  '😟', '😠', '😡', '😢', '😣', '😤', '😥',
  '😦', '😧', '😨', '😩', '😪', '😫', '😬',
  '😭', '😮', '😯', '😰', '😱', '😲', '😳',
  '😴', '😵', '😶', '😷', '😸', '😹', '😺',
  '😻', '😼', '😽', '😾', '😿', '🙀', '🙂',
  '🙃', '🙄', '🙅', '🙆', '🙇', '🙈',
  '🙉', '🙊', '🙋', '🙌', '🙍', '🙎', '🙏',
  '💪', '🤝', '❤️', '💔', '⭐', '🌟', '🎉',
  '🎊', '🎈', '🎁', '👨‍⚕️', '🏥',
]

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

const initializeFromRoute = async () => {
  const therapistId = route.query.therapistId as string
  if (!therapistId || showNoCharge.value) return

  // Wait for conversations to be loaded if they're not ready yet
  if (conversations.value.length === 0) {
    const therapists = await getTherapists()
    conversations.value = therapists.map(p => ({ id: p.id, user: p }))
  }

  // Find the therapist in conversations
  const conversation = conversations.value.find(c => c.user.id === therapistId)
  if (conversation) {
    activeTherapistId.value = therapistId
    try {
      // Try to find an in-progress session first
      const session = await getCurrentSession(therapistId)
      if (session) {
        // Found an in-progress session, use it
        activeSession.value = session
        sessionId.value = session.id
        // Load existing messages for this session
        const loadedMessages = await getMessages(session.id)
        messages.value = loadedMessages.map(msg => ({
          ...msg,
          timestamp: msg.time,
        }))
        scrollToBottom()
      }
      else if (!showNoCharge.value) {
        // No in-progress session found and user has charge, create new one
        const newSession = await createSession(therapistId)
        if (newSession) {
          activeSession.value = newSession
          sessionId.value = newSession.id
          messages.value = [] // New session starts with empty messages
        }
      }
    }
    catch (error) {
      console.error('Error initializing session:', error)
      messages.value = []
    }
  }
}

const currentLoadingTherapistId = ref<string | null>(null)

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

const loadMessages = async (therapistId: string) => {
  if (currentLoadingTherapistId.value === therapistId || showNoCharge.value) {
    return
  }

  loading.value = true
  currentLoadingTherapistId.value = therapistId

  try {
    const nuxtApp = useNuxtApp()
    if (!nuxtApp.$pb.authStore.isValid) {
      await navigateTo('/auth/login')
      return
    }

    // Try to find an in-progress session first
    const session = await getCurrentSession(therapistId)
    if (session) {
      // Found an in-progress session, use it
      activeSession.value = session
      sessionId.value = session.id
      // Load existing messages for this session
      const loadedMessages = await getMessages(session.id)
      messages.value = loadedMessages.map(msg => ({
        ...msg,
        timestamp: msg.time,
      }))
      scrollToBottom()
    }
    else if (!showNoCharge.value) {
      // No in-progress session found and user has charge, create new one
      const newSession = await createSession(therapistId)
      if (newSession) {
        activeSession.value = newSession
        sessionId.value = newSession.id
        messages.value = [] // New session starts with empty messages
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
  navigateTo({
    query: {
      ...route.query,
      therapistId,
    },
  })
}

// Watch conversations for initial load
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

// Watch active therapist changes
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
  processing: aiProcessing,
  models,
  selectedModel,
  loading: modelsLoading,
  error: modelsError,
  searchQuery,
  retryFetch,
  filteredModels,
} = useOpenRouter()

const streamingResponse = ref('')
const showModelError = ref(false)
const modelSearchInput = ref('')
const showModelDropdown = ref(false)

// Sync model search input with composable's searchQuery
watch(modelSearchInput, (newValue) => {
  searchQuery.value = newValue
})

// Reset streaming response when selecting a new conversation
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

    // Use existing session
    const session = activeSession.value

    const savedUserMessage = await sendMessage(currentTherapist.id, session.id, userMessage.text, 'sent')
    messages.value.push({
      ...userMessage,
      id: savedUserMessage.id,
      timestamp: savedUserMessage.time,
    })
    newMessage.value = ''
    scrollToBottom()

    if (!showNoCharge.value) {
      const assistantMessage = {
        type: 'received',
        text: '',
        timestamp: now,
      }

      const messageId = 'temp-' + Date.now()
      messages.value.push({
        ...assistantMessage,
        id: messageId,
      })
      scrollToBottom()

      const therapistDetails = {
        name: currentTherapist.name || '',
        specialty: currentTherapist.specialty || '',
        shortDescription: currentTherapist.shortDescription || '',
        longDescription: currentTherapist.longDescription || '',
        definingTraits: currentTherapist.definingTraits || '',
        backStory: currentTherapist.backStory || '',
        personality: currentTherapist.personality || '',
        appearance: currentTherapist.appearance || '',
        approach: currentTherapist.approach || '',
        expertise: currentTherapist.expertise || '',
      }

      const messageHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'sent' ? 'user' : 'assistant',
        content: msg.text,
      }))

      let isMessageSaved = false
      await streamChat(
        messageHistory,
        { therapistDetails },
        async (chunk) => {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content && !isMessageSaved) {
            streamingResponse.value += content
            const messageIndex = messages.value.findIndex(m => m.id === messageId)
            if (messageIndex !== -1) {
              messages.value[messageIndex].text = streamingResponse.value
            }
            scrollToBottom()
          }
        },
      )

      if (session.id && !isMessageSaved) {
        isMessageSaved = true
        const savedAssistantMessage = await sendMessage(currentTherapist.id, session.id, streamingResponse.value, 'received')
        const messageIndex = messages.value.findIndex(m => m.id === messageId)
        if (messageIndex !== -1) {
          messages.value[messageIndex].id = savedAssistantMessage.id
          messages.value[messageIndex].timestamp = savedAssistantMessage.time
        }
        scrollToBottom()
      }
    }
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

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const { counter, reset, pause, resume } = useInterval(1000, { controls: true })
const showTenMin = ref(false)
const isGoingToDone = ref(false)
const type = ref('briefing')

// Time and charge monitoring
const checkForHalfTime = () => {
  if (!startChargeTime.value || !timeToShow.value) return false
  const start = startChargeTime.value
  const now = new Date()
  const temp = Math.floor((now.getTime() - start.getTime()) / 60000)
  return (temp / timeToShow.value > 1)
}

watch(timeToShow, async (newValue) => {
  if (newValue <= 0 && activeSession.value?.id) {
    await endSession(activeSession.value.id)
    showNoCharge.value = true
    pause()
  }
})

let timeUpdateInterval: NodeJS.Timeout
let userSubscription: any

onMounted(async () => {
  loading.value = true
  try {
    const nuxtApp = useNuxtApp()
    // First load therapists
    const therapists = await getTherapists()
    conversations.value = therapists.map(p => ({ id: p.id, user: p }))

    // Then get user info
    const u = await nuxtApp.$pb
      .collection('users')
      .getOne(nuxtApp.$pb.authStore.model.id, {})
    showNoCharge.value = !u.hasCharge
    remainingTime.value = new Date(u.expireChargeTime)
    startChargeTime.value = new Date(u.startChargeTime)
    timeToShow.value = Math.floor((remainingTime.value.getTime() - new Date().getTime()) / (1000 * 60))

    // After conversations are loaded, initialize the route
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

    // Update time every minute with stored reference
    timeUpdateInterval = setInterval(() => {
      if (timeToShow.value !== undefined) {
        timeToShow.value = timeToShow.value - 1
      }
    }, 60000)

    // Store subscription reference for cleanup using PocketBase's subscribe method
    if (nuxtApp.$pb.authStore.isValid) {
      userSubscription = await nuxtApp.$pb.collection('users').subscribe(
        nuxtApp.$pb.authStore.model.id,
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
})

// Clean up intervals and subscriptions
onUnmounted(() => {
  pause()
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
  // PocketBase uses unsubscribe() method on the subscription object
  try {
    if (userSubscription) {
      // Proper cleanup for PocketBase subscription
      nuxtApp.$pb.collection('users').unsubscribe(userSubscription)
    }
  }
  catch (error) {
    console.error('Error unsubscribing:', error)
  }
})

const clearMessages = async (therapistId: string) => {
  if (!therapistId) { throw new Error('Therapist ID is required') }
  try {
    const nuxtApp = useNuxtApp()
    await nuxtApp.$pb.collection('therapists_messages').delete(`filter=therapist='${therapistId}'`)
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
    await clearMessages(activeTherapistId.value)
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

const isReportModalOpen = ref(false)

const openReportModal = () => {
  isReportModalOpen.value = true
}

const closeReportModal = () => {
  isReportModalOpen.value = false
}

const submitReport = async () => {
  try {
    // Calculate total time passed in minutes
    const startTime = new Date(activeSession.value.created)
    const endTime = new Date()
    const totalTimePassedMinutes = Math.round((endTime - startTime) / (1000 * 60))

    // Update session status to done with additional metrics
    const session = await nuxtApp.$pb.collection('sessions').update(activeSession.value.id, {
      status: 'done',
      end_time: endTime.toISOString(),
      count_of_total_messages: messages.value.length,
      total_time_passed: totalTimePassedMinutes,
      updated: endTime.toISOString(),
    })

    if (!session) {
      throw new Error('Failed to update session status')
    }

    // Add your report generation logic here
    navigateTo('/darmana/therapists/waitForReport')
    toaster.show({
      title: 'موفق',
      message: 'درخواست ساخت گزارش با موفقیت ارسال شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
    closeReportModal()
  }
  catch (error) {
    console.error('Error generating report:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ساخت گزارش',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
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

const nuxtApp = useNuxtApp()
const toaster = useToaster()
const logout = () => {
  nuxtApp.$pb.authStore.clear()
  toaster.show({
    title: 'خروج از سیستم',
    message: `خروج موفقیت آمیز بود`,
    color: 'success',
    icon: 'ph:check',
    closable: true,
  })
  navigateTo('/auth/login')
}
const changeExpanded = () => {
  expanded.value = !expanded.value
  localStorage.setItem('expanded', expanded.value + '')
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

  // Open the report modal first
  isReportModalOpen.value = true
}

const isGeneratingAnalysis = ref(false)

const handleConfirmEndSession = async () => {
  if (!activeSession.value) return
  
  isGeneratingAnalysis.value = true

  try {
    // Get all messages for this session
    const allMessages = messages.value.map(msg => ({
      role: msg.type === 'sent' ? 'patient' : 'therapist',
      content: msg.text
    }))

    // End the session using the endSession function
    await endSession(activeSession.value.id)
    activeSession.value.status = 'done'

    // Generate and save analysis
    const generatedAnalysis = await generateAnalysis({
      sessionId: activeSession.value.id,
      messages: allMessages
    })
    
    const savedAnalysis = await createAnalysis({
      session: activeSession.value.id,
      ...generatedAnalysis
    })

    // Close the modal
    isReportModalOpen.value = false

    // Navigate to analysis page with analysis ID
    await navigateTo(`/darmana/therapists/analysis?analysis_id=${savedAnalysis.id}`)
  } catch (error) {
    console.error('Error ending session:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پایان جلسه. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    isGeneratingAnalysis.value = false
  }
}

const handleAudioText = (text: string) => {
  newMessage.value = text
}

const handleAudioSend = () => {
  // Trigger the send button click
  if (newMessage.value && !messageLoading.value) {
    submitMessage()
  }
}
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
              <NuxtLink to="#" class="flex items-center justify-center">
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
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="جستجو"
                @click="open('search')"
              >
                <Icon name="ph:magnifying-glass-duotone" class="size-5" />
              </button>
            </div>

            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="تنظیمات"
              >
                <Icon name="ph:gear-six-duotone" class="size-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="text-danger-400 hover:text-danger-500 hover:bg-danger-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 disabled:opacity-50"
                title="پاک کردن چت"
                @click="clearChat"
              >
                <Icon name="ph:trash-duotone" class="size-5" />
              </button>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="خروج"
                @click="logout()"
              >
                <Icon
                  name="ph:sign-out"
                  class="pointer-events-none size-5"
                />
              </NuxtLink>
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
        <div class="mt-3 flex h-full flex-col">
          <!-- List -->
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
            class="flex h-16 w-full items-center justify-between px-4 sm:px-8"
          >
            <div class="flex items-center gap-2">
              <BaseInput
                v-model="search"
                rounded="lg"
                icon="lucide:search"
                placeholder="جست و جو"
              />
            </div>

            <TairoSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            />
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
              <div class="flex">
                <button
                  class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-3 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                  title="نمایش اطلاعات"
                  @click="changeExpanded()"
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
          <!-- Body -->
          <div
            ref="chatEl"
            class="relative flex h-[calc(100vh-4rem)] flex-col p-4 !pb-60 sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto nui-slimscroll'"
          >
            <!-- Loader-->
            <div
              class="pointer-events-none absolute inset-0 z-10 size-full bg-[url('../../img/back/back.png')] p-8 transition-opacity duration-300 dark:bg-[url('../../img/back/back-dark.png')]"
              :class="loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <div class="flex h-full flex-col items-center justify-center">
                <div class="flex items-center gap-2">
                  <BaseButtonIcon loading="default" />
                </div>
              </div>
            </div>
            <!-- Messages loop -->
            <div v-if="!loading" class="space-y-12">
              <div v-if="messages.length === 0" class="flex h-[60vh] flex-col items-center justify-center text-center">
                <div class="mb-6">
                  <Icon name="ph:chat-circle-dots-duotone" class="text-primary-500 size-16" />
                </div>
                <div class="max-w-sm">
                  <h3 class="font-heading text-muted-800 text-xl font-medium leading-normal dark:text-white">
                    {{ showNoCharge ? 'نیاز به خرید اشتراک' : 'شروع گفت و گو' }}
                  </h3>
                  <p class="text-muted-400 mt-2">
                    {{ showNoCharge ? 'برای گفتگو با روانشناس نیاز به خرید اشتراک دارید.' : 'به چت درمانی خوش آمدید. اینجا می‌توانید با روانشناس خود گفت و گو کنید.' }}
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
                      @click="navigateTo('/onboarding')"
                    >
                      خرید اشتراک
                    </BaseButton>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="space-y-8"
              >
                <!-- Messages -->
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
                                ? 'bg-primary-500 text-white prose-p:text-white'
                                : 'bg-muted-200 dark:bg-muted-700 text-muted-800 dark:text-muted-100 prose-p:text-muted-800 dark:prose-p:text-muted-100',
                            ]"
                          >
                            <span
                              class="block font-sans"
                              :class="[
                                item.type === 'sent'
                                  ? 'text-white prose-p:text-white'
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
              <BaseTextarea
                v-model="newMessage"
                :disabled="showNoCharge"
                size="sm"
                label="پیام شما"
                rounded="md"
                :placeholder="showNoCharge ? 'بسته مصرفی شما به اتمام رسیده است' : 'برای ارسال از ↵ + crtl  استفاده کنید.'"
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
                        <div class="grid grid-cols-9 gap-x-3 p-2">
                          <button
                            v-for="emoji in emojis"
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
            <div class="my-4">
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400"
              >
                <span>{{ selectedConversationComputed?.user.shortDescription }}</span>
              </BaseParagraph>
            </div>
            <div
              class="border-muted-200 dark:border-muted-700 flex w-full justify-center border-t pt-4"
            >
              <div class="flex items-center justify-center gap-2 px-4">
                <Icon
                  name="ph:user-duotone"
                  class="text-muted-400 size-4"
                />
                <span class="text-muted-400 font-sans text-xs">
                  سن: {{ selectedConversationComputed?.user.age }} سال
                </span>
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

            <!-- Click outside directive for model dropdown -->
            <button
              v-if="showModelDropdown"
              type="button"
              class="fixed inset-0 z-40"
              @click="showModelDropdown = false"
            />

            <BaseButton
              rounded="lg"
              class="w-full"
              @click="navigateTo(`/darmana/therapists/editTherapist?userId=${route.query.therapistId}`)"
            >
              نمایش نمایه
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
      </div>
    </template>
    <div class="relative mx-auto mb-4 flex size-24 justify-center">
      <Icon
        name="ph:clipboard-text"
        class="text-success-500 size-24"
      />
    </div>
    <div class="p-4 text-center md:p-6">
      <p>آیا مایل به پایان دادن این جلسه و ساخت گزارش از این گفتگو هستید؟</p>
    </div>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-2 p-4 md:p-6">
        <BaseButton @click="closeReportModal">
          انصراف
        </BaseButton>
        <BaseButton
          color="success"
          variant="solid"
          @click="handleConfirmEndSession"
          :loading="isGeneratingAnalysis"
          :disabled="isGeneratingAnalysis"
        >
          {{ isGeneratingAnalysis ? 'در حال ساخت گزارش...' : 'تایید' }}
        </BaseButton>
      </div>
    </template>
    <template #content>
      <div class="relative">
        <!-- Loading overlay -->
        <div v-if="isGeneratingAnalysis" class="absolute inset-0 bg-white/80 dark:bg-muted-800/80 flex flex-col items-center justify-center z-50">
          <BaseProgress />
          <p class="mt-4 text-muted-500 dark:text-muted-400">در حال تحلیل جلسه و ساخت گزارش...</p>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Existing modal content -->
        </div>
      </div>
    </template>
  </TairoModal>
</template>
<style scoped>
#no-money-message {
  justify-content: space-evenly;
}
</style>
