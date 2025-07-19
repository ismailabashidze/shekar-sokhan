<script setup lang="ts">
definePageMeta({
  title: 'جلسه مداخله بحران',
  layout: 'empty',
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'جلسه مداخله بحران - ذهنا'
})

const route = useRoute()
const router = useRouter()
const { user, role } = useUser()
const toaster = useToaster()

const sessionId = route.params.id as string
const isTherapist = computed(() => role.value === 'therapist' || role.value === 'admin')

// Session state
const sessionActive = ref(true)
const sessionStartTime = ref(new Date())
const messages = ref([])
const newMessage = ref('')
const typing = ref(false)
const connectionStatus = ref('connected')

// Crisis assessment
const crisisLevel = ref('medium')
const riskAssessment = ref({
  suicidalThoughts: false,
  harmToOthers: false,
  substanceUse: false,
  psychosis: false,
  safetyPlan: false
})

// Session participants
const participants = ref({
  client: {
    id: 'client-1',
    name: 'کاربر بحرانی',
    avatar: '/img/avatars/default-male.jpg',
    status: 'online'
  },
  therapist: {
    id: 'therapist-1',
    name: 'دکتر سارا احمدی',
    avatar: '/img/avatars/therapist-1.jpg',
    status: 'online',
    specialty: 'مشاور بحران'
  }
})

// Emergency actions
const emergencyActions = [
  {
    action: 'call_emergency',
    label: 'تماس با اورژانس',
    icon: 'ph:phone-duotone',
    color: 'danger',
    phone: '115'
  },
  {
    action: 'contact_family',
    label: 'تماس با خانواده',
    icon: 'ph:users-duotone',
    color: 'warning'
  },
  {
    action: 'safety_plan',
    label: 'برنامه ایمنی',
    icon: 'ph:shield-check-duotone',
    color: 'success'
  },
  {
    action: 'resource_referral',
    label: 'ارجاع به منابع',
    icon: 'ph:hospital-duotone',
    color: 'info'
  }
]

// Quick responses for therapists
const quickResponses = [
  'من اینجا هستم و گوش می‌دهم. احساسات شما مهم است.',
  'شما در این لحظه امنیت دارید. بیایید آرام نفس بکشیم.',
  'چه کاری می‌تواند الآن به شما کمک کند؟',
  'شما تنها نیستید. ما با هم این مشکل را حل می‌کنیم.',
  'بیایید روی راه‌حل‌های امن تمرکز کنیم.',
  'آیا در حال حاضر در مکان امنی هستید؟'
]

// Session timer
const sessionDuration = computed(() => {
  const now = new Date()
  const diff = now.getTime() - sessionStartTime.value.getTime()
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Send message
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: Date.now().toString(),
    senderId: user.value?.id,
    senderType: isTherapist.value ? 'therapist' : 'client',
    content: newMessage.value,
    timestamp: new Date(),
    type: 'text'
  }

  messages.value.push(message)
  newMessage.value = ''

  // Auto-scroll to bottom
  nextTick(() => {
    const container = document.getElementById('messages-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// Send quick response
const sendQuickResponse = (response: string) => {
  newMessage.value = response
  sendMessage()
}

// Emergency action
const handleEmergencyAction = (action: string) => {
  switch (action) {
    case 'call_emergency':
      if (process.client) {
        window.open('tel:115')
      }
      break
    case 'contact_family':
      // Open family contact modal
      break
    case 'safety_plan':
      // Create safety plan
      break
    case 'resource_referral':
      // Show resources
      break
  }
}

// End session
const endSession = async () => {
  try {
    sessionActive.value = false
    
    toaster.show({
      title: 'جلسه پایان یافت',
      message: 'جلسه مداخله بحران با موفقیت پایان یافت',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/darmana/crisis')
    }, 2000)
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در پایان جلسه',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Load session data
const loadSessionData = async () => {
  try {
    // Load session messages and data
    messages.value = [
      {
        id: '1',
        senderId: 'client-1',
        senderType: 'client',
        content: 'سلام، احساس خیلی بدی دارم و نمی‌دانم چه کار کنم',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: '2',
        senderId: 'therapist-1',
        senderType: 'therapist',
        content: 'سلام، من اینجا هستم تا به شما کمک کنم. می‌توانید بیشتر توضیح دهید که چه احساسی دارید؟',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      }
    ]
  } catch (error) {
    console.error('Error loading session:', error)
  }
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  loadSessionData()
})

onUnmounted(() => {
  // Cleanup
})
</script>

<template>
  <div class="h-screen bg-white dark:bg-muted-900 flex flex-col">
    <!-- Header -->
    <div class="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h1 class="text-lg font-semibold text-red-800 dark:text-red-200">
              جلسه مداخله بحران
            </h1>
          </div>
          
          <div class="flex items-center gap-4 text-sm text-red-700 dark:text-red-300">
            <span>مدت جلسه: {{ sessionDuration }}</span>
            <span>سطح بحران: 
              <BaseTag :color="crisisLevel === 'high' ? 'danger' : crisisLevel === 'medium' ? 'warning' : 'success'" size="sm">
                {{ crisisLevel === 'high' ? 'بالا' : crisisLevel === 'medium' ? 'متوسط' : 'پایین' }}
              </BaseTag>
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Connection Status -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm text-muted-600 dark:text-muted-400">متصل</span>
          </div>

          <!-- Emergency Actions (for therapists) -->
          <div v-if="isTherapist" class="flex items-center gap-2">
            <BaseButton
              v-for="action in emergencyActions"
              :key="action.action"
              :color="action.color"
              variant="outline"
              size="sm"
              @click="handleEmergencyAction(action.action)"
            >
              <Icon :name="action.icon" class="w-4 h-4" />
            </BaseButton>
          </div>

          <!-- End Session -->
          <BaseButton
            color="danger"
            variant="outline"
            size="sm"
            @click="endSession"
          >
            <Icon name="ph:x-duotone" class="w-4 h-4 mr-2" />
            پایان جلسه
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Messages -->
        <div id="messages-container" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.senderType === (isTherapist ? 'therapist' : 'client') ? 'justify-end' : 'justify-start'"
          >
            <div class="flex items-start gap-3 max-w-lg">
              <BaseAvatar
                v-if="message.senderType !== (isTherapist ? 'therapist' : 'client')"
                :src="message.senderType === 'therapist' ? participants.therapist.avatar : participants.client.avatar"
                size="sm"
              />
              
              <div class="flex flex-col">
                <div
                  class="px-4 py-3 rounded-2xl"
                  :class="message.senderType === (isTherapist ? 'therapist' : 'client')
                    ? 'bg-primary-500 text-white ml-8'
                    : 'bg-muted-100 dark:bg-muted-800 text-muted-900 dark:text-white mr-8'"
                >
                  <p class="text-sm">{{ message.content }}</p>
                </div>
                <span class="text-xs text-muted-500 mt-1 px-2">
                  {{ new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>

              <BaseAvatar
                v-if="message.senderType === (isTherapist ? 'therapist' : 'client')"
                :src="message.senderType === 'therapist' ? participants.therapist.avatar : participants.client.avatar"
                size="sm"
              />
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="typing" class="flex justify-start">
            <div class="flex items-center gap-3 max-w-lg">
              <BaseAvatar
                :src="participants.therapist.avatar"
                size="sm"
              />
              <div class="bg-muted-100 dark:bg-muted-800 px-4 py-3 rounded-2xl">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-muted-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-muted-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-muted-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Responses (for therapists) -->
        <div v-if="isTherapist" class="border-t border-muted-200 dark:border-muted-700 p-4">
          <div class="flex flex-wrap gap-2">
            <BaseButton
              v-for="response in quickResponses"
              :key="response"
              variant="outline"
              size="sm"
              @click="sendQuickResponse(response)"
              class="text-xs"
            >
              {{ response.length > 50 ? response.substring(0, 50) + '...' : response }}
            </BaseButton>
          </div>
        </div>

        <!-- Message Input -->
        <div class="border-t border-muted-200 dark:border-muted-700 p-6">
          <div class="flex items-end gap-4">
            <div class="flex-1">
              <BaseTextarea
                v-model="newMessage"
                placeholder="پیام خود را بنویسید..."
                rows="2"
                @keydown="handleKeydown"
              />
            </div>
            <BaseButton
              color="primary"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
            >
              <Icon name="ph:paper-plane-tilt-duotone" class="w-5 h-5" />
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Sidebar (for therapists) -->
      <div v-if="isTherapist" class="w-80 border-l border-muted-200 dark:border-muted-700 bg-muted-50 dark:bg-muted-800">
        <div class="p-6 space-y-6">
          <!-- Client Info -->
          <div>
            <h3 class="font-semibold text-muted-900 dark:text-white mb-3">اطلاعات کلاینت</h3>
            <div class="flex items-center gap-3 p-3 bg-white dark:bg-muted-900 rounded-lg">
              <BaseAvatar :src="participants.client.avatar" size="sm" />
              <div>
                <div class="font-medium text-muted-900 dark:text-white">{{ participants.client.name }}</div>
                <div class="text-sm text-muted-600 dark:text-muted-400">{{ participants.client.status }}</div>
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div>
            <h3 class="font-semibold text-muted-900 dark:text-white mb-3">ارزیابی خطر</h3>
            <div class="space-y-3">
              <div
                v-for="(value, key) in riskAssessment"
                :key="key"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-muted-600 dark:text-muted-400">
                  {{
                    key === 'suicidalThoughts' ? 'افکار خودکشی' :
                    key === 'harmToOthers' ? 'خطر برای دیگران' :
                    key === 'substanceUse' ? 'سوءمصرف مواد' :
                    key === 'psychosis' ? 'علائم روان‌پریشی' :
                    'برنامه ایمنی'
                  }}
                </span>
                <BaseCheckbox
                  :model-value="value"
                  color="danger"
                  @update:model-value="riskAssessment[key] = $event"
                />
              </div>
            </div>
          </div>

          <!-- Crisis Level -->
          <div>
            <h3 class="font-semibold text-muted-900 dark:text-white mb-3">سطح بحران</h3>
            <BaseListbox
              v-model="crisisLevel"
              :items="[
                { label: 'پایین', value: 'low' },
                { label: 'متوسط', value: 'medium' },
                { label: 'بالا', value: 'high' }
              ]"
            />
          </div>

          <!-- Emergency Contacts -->
          <div>
            <h3 class="font-semibold text-muted-900 dark:text-white mb-3">تماس‌های اضطراری</h3>
            <div class="space-y-2">
              <BaseButton
                variant="outline"
                size="sm"
                class="w-full justify-start"
                @click="makeEmergencyCall('115')"
              >
                <Icon name="ph:phone-duotone" class="w-4 h-4 mr-2" />
                اورژانس (115)
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                class="w-full justify-start"
                @click="makeEmergencyCall('1480')"
              >
                <Icon name="ph:heart-duotone" class="w-4 h-4 mr-2" />
                خط اورژانس روانشناسی
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>