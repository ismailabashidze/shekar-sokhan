<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watch, ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import AudioUser from '@/components/global/AudioUser.vue';
import { useUser } from '@/composables/user';

definePageMeta({
  title: 'Messaging',
  layout: 'empty',
  preview: {
    title: 'Messaging app',
    description: 'For chat and messaging apps',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-messaging.png',
    srcDark: '/img/screens/dashboards-messaging-dark.png',
    order: 26,
  },
});
useHead({ htmlAttrs: { dir: 'rtl' } });
const { open } = usePanels();
const { getPatients } = usePatient();
const { getMessages, sendMessage, createSeparator, clearMessages, updateMessage } = usePatientMessages();
const route = useRoute();

const conversations = ref<{ id: string; user: Patient }[]>([]);
const messages = ref<Message[]>([]);
const loading = ref(false);
const messageLoading = ref(false);
const chatEl = ref<HTMLElement>();
const expanded = ref(false);
const search = ref('');
const newMessage = ref('');
const activePatientId = ref<string | null>(null);
const showEmojiPicker = ref(false);
const showAudioUser = ref(false);
const { role } = useUser();

const toggleAudioUser = () => {
  showAudioUser.value = !showAudioUser.value;
};

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊',
  '😇', '🙃', '😉', '😊', '😋', '😎', '😍',
  '😘', '😗', '😙', '😚', '😛', '😝', '😞',
  '😟', '😠', '😡', '😢', '😣', '😤', '😥',
  '😦', '😧', '😨', '😩', '😪', '😫', '😬',
  '😭', '😮', '😯', '😰', '😱', '😲', '😳',
  '😴', '😵', '😶', '😷', '😸', '😹', '😺',
  '😻', '😼', '😽', '😾', '😿', '🙀', '🙁',
  '🙂', '🙃', '🙄', '🙅', '🙆', '🙇', '🙈',
  '🙉', '🙊', '🙋', '🙌', '🙍', '🙎', '🙏',
  '💪', '🤝', '❤️', '💔', '⭐', '🌟', '🎉',
  '🎊', '🎈', '🎁', '👨‍⚕️', '🏥',
];

const insertEmoji = (emoji: string) => {
  newMessage.value += emoji;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    submitMessage();
  }
};

const emojiPickerRef = ref<HTMLElement>();
onClickOutside(emojiPickerRef, () => {
  showEmojiPicker.value = false;
});

const initializeFromRoute = async () => {
  const patientId = route.query.patientId as string;
  if (patientId && conversations.value.length > 0) {
    const conversation = conversations.value.find(c => c.user.id === patientId);
    if (conversation) {
      activePatientId.value = patientId;
      await loadMessages(patientId);
    }
  }
  else if (conversations.value.length > 0 && !activePatientId.value) {
    activePatientId.value = conversations.value[0].user.id;
    await loadMessages(conversations.value[0].user.id);
  }
};

const currentLoadingPatientId = ref<string | null>(null);

const formatTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
};

const loadMessages = async (patientId: string) => {
  if (currentLoadingPatientId.value === patientId) return;

  loading.value = true;
  currentLoadingPatientId.value = patientId;

  try {
    const nuxtApp = useNuxtApp();
    if (!nuxtApp.$pb.authStore.isValid) {
      await navigateTo('/auth/login');
      return;
    }

    const loadedMessages = await getMessages(patientId);
    messages.value = loadedMessages.map(msg => ({
      ...msg,
      timestamp: msg.created,
    }));
    scrollToBottom();
  }
  catch (error) {
    console.error('Error loading messages:', error);
    messages.value = [];
  }
  finally {
    loading.value = false;
    currentLoadingPatientId.value = null;
  }
};

const selectConversation = async (patientId: string) => {
  activePatientId.value = patientId;
  await loadMessages(patientId);
  navigateTo({
    query: {
      ...route.query,
      patientId,
    },
  });
};

onMounted(async () => {
  loading.value = true;
  try {
    const nuxtApp = useNuxtApp();
    if (!nuxtApp.$pb.authStore.isValid) {
      return;
    }
    const patients = await getPatients();
    conversations.value = patients.map((patient: any) => ({
      user: patient,
      unread: 0,
      lastMessage: '',
      lastMessageTime: '',
    }));

    if (route.query.patientId) {
      const patientId = route.query.patientId as string;
      activePatientId.value = patientId;
      await loadMessages(patientId);
    }
    else if (conversations.value.length > 0) {
      activePatientId.value = conversations.value[0].user.id;
      await loadMessages(conversations.value[0].user.id);
    }
  }
  catch (error: any) {
    console.error('Error initializing chat:', error);
    if (error?.isAbort) {
      // Request was cancelled, likely due to component unmount
      return;
    }
  }
  finally {
    loading.value = false;
  }
});

watch(
  () => route.query.patientId,
  async (newPatientId) => {
    if (newPatientId) {
      await initializeFromRoute();
    }
  },
);

watch(
  () => conversations.value,
  async (newConversations) => {
    if (newConversations.length > 0 && !activePatientId.value) {
      await initializeFromRoute();
    }
  },
);

watch(activePatientId, async (newId) => {
  if (newId) {
    await loadMessages(newId);
  }
});

onUnmounted(() => {
  currentLoadingPatientId.value = null;
});

const selectedConversationComputed = computed(() => {
  return conversations.value.find(
    conversation => conversation.user.id === activePatientId.value,
  );
});

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
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
} = useOpenRouter();

const streamingResponse = ref('');
const showModelError = ref(false);
const modelSearchInput = ref('');
const showModelDropdown = ref(false);

// Sync model search input with composable's searchQuery
watch(modelSearchInput, (newValue) => {
  searchQuery.value = newValue;
});

// Reset streaming response when selecting a new conversation
watch(activePatientId, async (newId) => {
  streamingResponse.value = '';
  if (newId) {
    await loadMessages(newId);
  }
});

async function submitMessage() {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
    return;
  }

  if (!newMessage.value || messageLoading.value) return;

  try {
    messageLoading.value = true;
    const now = new Date().toISOString();
    streamingResponse.value = ''; // Reset streaming response for new message
    const userMessage = {
      type: 'sent',
      text: newMessage.value,
      timestamp: now,
    };

    // First save and show the user message
    const savedUserMessage = await sendMessage(activePatientId.value, userMessage.text, 'sent');
    messages.value.push({
      ...userMessage,
      id: savedUserMessage.id,
      timestamp: savedUserMessage.created,
    });
    newMessage.value = '';
    scrollToBottom();

    // Only proceed with AI response if user has charge
    if (!showNoCharge.value) {
      // Create an empty assistant message that will be filled with the stream
      const assistantMessage = {
        type: 'received',
        text: '',
        timestamp: now,
      };

      // Add the empty message to UI
      messages.value.push({
        ...assistantMessage,
        id: 'temp-' + Date.now(),
      });
      scrollToBottom();

      // Get current patient details and proceed with chat
      const currentPatient = conversations.value.find(c => c.user.id === activePatientId.value)?.user;

      // Create message history excluding the empty message we just added
      const messageHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'sent' ? 'user' : 'assistant',
        content: msg.text,
      }));

      await streamChat(
        messageHistory,
        {
          patientDetails: currentPatient
            ? {
                name: currentPatient.name,
                age: currentPatient.age,
                shortDescription: currentPatient.shortDescription,
                longDescription: currentPatient.longDescription,
                definingTraits: currentPatient.definingTraits,
                backStory: currentPatient.backStory,
                personality: currentPatient.personality,
                appearance: currentPatient.appearance,
                motivation: currentPatient.motivation,
                moodAndCurrentEmotions: currentPatient.moodAndCurrentEmotions,
              }
            : undefined,
        },
        async (chunk) => {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            streamingResponse.value += content;
            messages.value[messages.value.length - 1].text = streamingResponse.value;
            scrollToBottom();
          }
        },
      );

      // After stream is complete, save the full message
      const savedAssistantMessage = await sendMessage(activePatientId.value, streamingResponse.value, 'received');
      // Update the message ID and timestamp in the UI
      const lastMessage = messages.value[messages.value.length - 1];
      lastMessage.id = savedAssistantMessage.id;
      lastMessage.timestamp = savedAssistantMessage.created;
      scrollToBottom();
    }
  }
  catch (e) {
    console.error('Error in chat:', e);
    messages.value.push({
      type: 'received',
      text: 'متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.',
      timestamp: new Date().toISOString(),
      id: 'error-' + Date.now(),
    });
    scrollToBottom();
  }
  finally {
    messageLoading.value = false;
  }
}

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, 300);
});

const { counter, reset, pause, resume } = useInterval(1000, { controls: true });
const showNoCharge = ref(false);
const remainingTime = ref<Date>();
const currentTime = ref(new Date());
const timeToShow = computed(() => {
  if (!remainingTime.value) return 0;
  const diff = remainingTime.value.getTime() - currentTime.value.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60)));
});
const startChargeTime = ref<Date>();
const showTenMin = ref(false);
const isGoingToDone = ref(false);
const type = ref('briefing');

// Time and charge monitoring
const checkForHalfTime = () => {
  const start = new Date(startChargeTime.value);
  const now = new Date();
  const temp = Math.floor((now.getTime() - start.getTime()) / 60000);
  return (temp / timeToShow.value > 1);
};

onMounted(async () => {
  loading.value = true;
  try {
    const nuxtApp = useNuxtApp();
    const patients = await getPatients();
    conversations.value = patients.map(p => ({ id: p.id, user: p }));
    await initializeFromRoute();

    // Initialize charge and time data
    const u = await nuxtApp.$pb
      .collection('users')
      .getOne(nuxtApp.$pb.authStore.model.id, {});
    showNoCharge.value = !u.hasCharge;
    remainingTime.value = new Date(u.expireChargeTime);
    startChargeTime.value = new Date(u.startChargeTime);
    if (timeToShow.value <= 0) {
      showNoCharge.value = true;
      pause();
    }

    // Subscribe to user changes for real-time charge updates
    if (nuxtApp.$pb.authStore.isValid) {
      nuxtApp.$pb.collection('users').subscribe(
        nuxtApp.$pb.authStore.model.id,
        (e) => {
          // Update remainingTime; computed timeToShow will recalc automatically
          remainingTime.value = new Date(e.record.expireChargeTime);
          if (!e.record.hasCharge) {
            showNoCharge.value = true;
          }
          console.log('[Timer] Subscription event: new expireChargeTime =', e.record.expireChargeTime, 'updated remainingTime =', remainingTime.value, 'timeToShow =', timeToShow.value);
        },
        {},
      );
    }
  }
  catch (error) {
    console.error('Error initializing:', error);
  }
  finally {
    loading.value = false;
  }
});

// Start the counter and time updater when component is mounted
onMounted(() => {
  resume();
  console.log('[Timer] Starting clock ticks, initial timeToShow =', timeToShow.value);
  const timer = setInterval(() => {
    currentTime.value = new Date();
    console.log('[Timer] Tick at', currentTime.value, 'timeToShow =', timeToShow.value);
  }, 60000);
  onUnmounted(() => {
    console.log('[Timer] Clearing clock ticks');
    clearInterval(timer);
  });
});

// Log whenever timeToShow recomputes
watch(timeToShow, (newVal, oldVal) => {
  console.log('[Timer] timeToShow changed from', oldVal, 'to', newVal);
});

// Log initial remainingTime, startChargeTime, and timeToShow after loading user data
onMounted(async () => {
  console.log('[Timer] Initialized: remainingTime =', remainingTime.value, 'startChargeTime =', startChargeTime.value, 'timeToShow =', timeToShow.value);
});

const nuxtApp = useNuxtApp();
const toaster = useToaster();
const logout = () => {
  nuxtApp.$pb.authStore.clear();
  toaster.show({
    title: 'خروج از سیستم',
    message: `خروج موفقیت آمیز بود`,
    color: 'success',
    icon: 'ph:check',
    closable: true,
  });
  navigateTo('/auth/login');
};
const changeExpanded = () => {
  expanded.value = !expanded.value;
  localStorage.setItem('expanded', expanded.value + '');
};

const isDeleteModalOpen = ref(false);

const openDeleteModal = () => {
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

const confirmClearChat = async () => {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
    return;
  }

  try {
    await clearMessages(activePatientId.value!);
    messages.value = [];
    closeDeleteModal();
  }
  catch (error) {
    console.error('Error clearing messages:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در پاک کردن پیام‌ها',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
};

const clearChat = () => {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
    return;
  }
  openDeleteModal();
};

const gotoList = () => {
  navigateTo('/darmana/patients/choosePatient');
};

const isReportModalOpen = ref(false);

const openReportModal = () => {
  isReportModalOpen.value = true;
};

const closeReportModal = () => {
  isReportModalOpen.value = false;
};

const submitReport = async () => {
  try {
    // Add your report generation logic here
    toaster.show({
      title: 'موفق',
      message: 'گزارش با موفقیت ساخته شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });
    closeReportModal();
  }
  catch (error) {
    console.error('Error generating report:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در ساخت گزارش',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
};

const handleTextareaClick = () => {
  if (showNoCharge.value) {
    toaster.show({
      title: 'خطا',
      message: 'بسته مصرفی شما به اتمام رسیده است. لطفاً اقدام به خرید اشتراک نمایید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
};
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
              activePatientId === conversation.user.id
                ? 'border-primary-500'
                : 'border-transparent'
            "
            @click.prevent="selectConversation(conversation.user.id)"
          >
            <div class="relative flex w-full justify-center gap-2">
              <div class="relative flex w-14 shrink-0 items-center justify-center">
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
                        ? `https://pocket.zehna.ir/api/files/patients/${conversation.user.id}/${conversation.user.avatar}`
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
                <span v-if="timeToShow > 0">⏱ {{ timeToShow ?? '--' }} دقیقه</span>
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
                  to="/onboarding/psychologist"
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
                    شروع گفت و گو
                  </h3>
                  <p class="text-muted-400 mt-2">
                    به چت درمانی خوش آمدید. اینجا می‌توانید با بیمار خود گفت و گو کنید.
                  </p>
                  <div class="mt-4">
                    <BaseButton @click="newMessage = 'سلام، چطور می‌توانم کمکتان کنم؟'">
                      شروع گفت و گو
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
                                ? 'bg-primary-500 text-white'
                                : 'bg-muted-200 dark:bg-muted-700',
                            ]"
                          >
                            <span
                              class="block font-sans"
                              :class="[
                                item.type === 'sent'
                                  ? 'text-white'
                                  : 'text-muted-800 dark:text-muted-100',
                              ]"
                            >
                              {{ item.text }}
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
                <!-- No Charge / Timer Message -->
                <BaseMessage
                  v-if="!showNoCharge"
                  class="mb-4 w-[180px]"
                  :color="timeToShow > 10 ? 'success' : 'warning'"
                >
                  <span v-if="timeToShow > 0">
                    <span class="mx-2">⏰</span>
                    {{ timeToShow ?? '--' }} دقیقه
                  </span>
                  <span v-else>وقت تقریبا تمام است</span>
                </BaseMessage>
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
                        @click="$router.push('/onboarding/psychologist')"
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
                      درمانا
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
                        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute bottom-full end-0 mb-2 w-64 rounded-lg border bg-white shadow-lg"
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
                        <div class="grid grid-cols-8 gap-1 p-2">
                          <button
                            v-for="emoji in emojis"
                            :key="emoji"
                            type="button"
                            class="hover:bg-muted-100 dark:hover:bg-muted-700 w-full cursor-pointer rounded p-2 text-left"
                            :class="{ 'bg-muted-100 dark:bg-muted-700': emoji === '😀' }"
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
      <!-- Current user -->
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
            <span>اطلاعات مراجع</span>
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
                    ? `https://pocket.zehna.ir/api/files/patients/${selectedConversationComputed.user.id}/${selectedConversationComputed.user.avatar}`
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
              <div
                v-if="showModelDropdown"
                class="fixed inset-0 z-40"
                @click="showModelDropdown = false"
              />

              <!-- <BaseButton
                rounded="lg"
                class="w-full"
                @click="navigateTo(`/darmana/patients/editPatient?userId=${route.query.patientId}`)"
              >
                نمایش نمایه
              </BaseButton> -->
            </div>
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
          @text-ready="(text) => { newMessage = newMessage ? newMessage + ' ' + text : text; showAudioUser = false; }"
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
            class="text-danger size-24"
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
    <div class="p-4 md:p-6">
      <p>آیا مایل به ساخت گزارش از این گفتگو هستید؟</p>
    </div>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-2 p-4 md:p-6">
        <BaseButton @click="closeReportModal">
          انصراف
        </BaseButton>
        <BaseButton color="primary" @click="submitReport">
          تایید
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
<style scoped>
#no-money-message {
  justify-content: space-evenly;
}
</style>
