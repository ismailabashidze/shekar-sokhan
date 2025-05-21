<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, onMounted, nextTick } from 'vue'
import { useTherapistsMessages } from '@/composables/therapistsMessages'
import type { Message } from '@/types'

definePageMeta({
  title: 'تاریخچه گفتگو',
  layout: 'empty',
  preview: {
    title: 'Messaging History',
    description: 'View message history',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-messaging.png',
    srcDark: '/img/screens/dashboards-messaging-dark.png',
    order: 26,
  },
})

useHead({ htmlAttrs: { dir: 'rtl' } })
const { getMessages, getMessagesForAdmin } = useTherapistsMessages()
const route = useRoute()

// Reactive references
const messages = ref<Message[]>([])
const loading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const activeTherapistId = ref<string | null>(null)
const activeSession = ref<any>(null)
const search = ref('')
const sessionId = ref<string | null>(null)

const formatTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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

const loadSessionMessages = async (sessionId: string) => {
  if (!sessionId) return

  loading.value = true

  try {
    // Get session details directly from PocketBase
    try {
      const session = await nuxtApp.$pb.collection('sessions').getOne(sessionId, {
        expand: 'therapist',
      })

      if (session) {
        activeSession.value = session

        // Get therapist info if available
        if (session.expand?.therapist) {
          activeTherapistId.value = session.expand.therapist.id
        }

        // Load messages for this session using the appropriate method based on user role
        try {
          const { role } = useUser()
          const isAdmin = role.value === 'admin'
          
          const loadedMessages = isAdmin 
            ? await getMessagesForAdmin(sessionId)
            : await getMessages(sessionId)
            
          console.log('Loaded messages:', loadedMessages)
          messages.value = loadedMessages.map(msg => ({
            ...msg,
            timestamp: msg.time,
          }))
          scrollToBottom()
        }
        catch (messageError) {
          console.error('Error loading messages:', messageError)
          messages.value = []
        }
      }
    }
    catch (sessionError) {
      console.error('Error loading session:', sessionError)
      activeSession.value = null
    }
  }
  catch (error) {
    console.error('Error loading session messages:', error)
    messages.value = []
    activeSession.value = null
  }
  finally {
    loading.value = false
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(async () => {
  loading.value = true
  try {
    // Get session ID from URL query parameter
    const urlSessionId = route.query.sessionId as string
    if (urlSessionId) {
      sessionId.value = urlSessionId
      await loadSessionMessages(urlSessionId)
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
  }
})

const gotoList = () => {
  navigateTo('/darmana/therapists/sessions')
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

const filteredMessages = computed(() => {
  if (!search.value.trim()) return messages.value

  const searchTerm = search.value.toLowerCase()
  return messages.value.filter(message =>
    message.text.toLowerCase().includes(searchTerm),
  )
})
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

      <!-- Current conversation -->
      <div
        class="relative w-full transition-all duration-300"
        :class="
          expanded
            ? 'ltablet:max-w-[calc(100%_-_160px)] lg:max-w-[calc(100%_-_100px)]'
            : 'ltablet:max-w-[calc(100%_-_470px)] lg:max-w-[calc(100%_-_470px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div
            class="border-muted-200 dark:border-muted-700 flex h-16 w-full items-center justify-between border-b px-4 sm:px-8"
          >
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="search"
                rounded="lg"
                icon="lucide:search"
                placeholder="جست و جو در پیام‌ها"
                class="w-full sm:w-64"
              />

              <!-- Session date info -->
              <div v-if="activeSession" class="hidden items-center md:flex">
                <BaseTag
                  color="info"
                  shape="curved"
                  size="sm"
                  class="mr-2"
                >
                  <div class="flex items-center px-2 py-1">
                    <Icon name="ph:calendar-duotone" class="ml-1 size-3.5" />
                    <span class="text-xs">{{ formatDate(activeSession.created) }}</span>
                  </div>
                </BaseTag>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Session type tag -->
              <div v-if="activeSession" class="flex items-center">
                <BaseTag
                  :color="activeSession.session_type === 'educational' ? 'success' : 'primary'"
                  shape="curved"
                  size="sm"
                  class="ml-2"
                >
                  <div class="flex items-center px-2 py-1.5">
                    <Icon
                      :name="activeSession.session_type === 'educational' ? 'ph:graduation-cap-duotone' : 'ph:heart-duotone'"
                      class="ml-1 size-3"
                    />
                    {{ activeSession.session_type === 'educational' ? 'آموزشی' : 'درمانی' }}
                  </div>
                </BaseTag>
              </div>

              <!-- Status tag -->
              <div v-if="activeSession" class="hidden sm:block">
                <BaseTag
                  :color="activeSession.status === 'done' ? 'success' : activeSession.status === 'inprogress' ? 'info' : 'warning'"
                  shape="curved"
                  size="sm"
                >
                  <div class="flex items-center px-2 py-1.5">
                    {{ activeSession.status === 'done' ? 'تکمیل شده' :
                      activeSession.status === 'inprogress' ? 'در حال انجام' :
                      activeSession.status === 'closed' ? 'بسته شده' : 'نامشخص' }}
                  </div>
                </BaseTag>
              </div>

              <div class="flex">
                <button
                  class="bg-primary-500/30 dark:bg-primary-500/70 dark:text-muted-100 text-muted-600 hover:text-primary-500 hover:bg-primary-500/50 mr-1 flex size-10 items-center justify-center rounded-2xl transition-colors duration-300 sm:mr-3 sm:size-12"
                  title="نمایش اطلاعات"
                  @click="changeExpanded()"
                >
                  <Icon
                    name="ph:info-duotone"
                    class="size-4 sm:size-5"
                  />
                </button>

                <button
                  v-if="activeSession"
                  class="bg-muted-500/30 dark:bg-muted-500/70 dark:text-muted-100 text-muted-600 hover:text-muted-500 hover:bg-muted-500/50 mr-1 flex size-10 items-center justify-center rounded-2xl transition-colors duration-300 sm:mr-3 sm:size-12"
                  @click="gotoList()"
                >
                  <Icon name="ph:arrow-left-duotone" class="ml-1 size-4" />
                </button>
              </div>
            </div>
          </div>
          <!-- Body -->
          <div
            ref="chatEl"
            class="relative flex h-[calc(100vh-4rem)] flex-col p-4 !pb-20 sm:p-8"
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

            <!-- Session info card -->
            <div v-if="activeSession && !loading" class="mb-6">
              <BaseCard class="p-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-primary-100 dark:bg-primary-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:clock-duotone" class="text-primary-500 size-5" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">مدت جلسه</span>
                      <span class="text-muted-800 dark:text-white">
                        {{ activeSession.total_time_passed ? `${activeSession.total_time_passed} دقیقه` : 'نامشخص' }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-info-100 dark:bg-info-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:chat-dots-duotone" class="text-info-500 size-5" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">تعداد پیام‌ها</span>
                      <span class="text-muted-800 dark:text-white">
                        {{ activeSession.count_of_total_messages || messages.length || '0' }} پیام
                      </span>
                    </div>
                  </div>

                  <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                    <div class="bg-success-100 dark:bg-success-500/20 ml-3 rounded-full p-2">
                      <Icon name="ph:timer-duotone" class="text-success-500 size-5" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-muted-400 text-xs">زمان شروع/پایان</span>
                      <span class="text-muted-800 font-medium dark:text-white">
                        {{ formatTime(activeSession.start_time || activeSession.created) }} -
                        {{ formatTime(activeSession.end_time || new Date()) }}
                      </span>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>

            <!-- Messages loop -->
            <div v-if="!loading" class="space-y-12">
              <div v-if="messages.length === 0" class="flex h-[60vh] flex-col items-center justify-center text-center">
                <div class="mb-6">
                  <Icon name="ph:chat-circle-dots-duotone" class="text-primary-500 size-16" />
                </div>
                <div class="max-w-sm">
                  <h3 class="font-heading text-muted-800 text-xl font-medium leading-normal dark:text-white">
                    تاریخچه گفتگو
                  </h3>
                  <p class="text-muted-400 mt-2">
                    تاریخچه گفتگو را مشاهده کنید.
                  </p>
                </div>
              </div>
              <div
                v-else
                class="space-y-8"
              >
                <!-- Messages -->
                <div
                  v-for="item in filteredMessages"
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
              </div>
            </div>
          </div>
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
          <span>اطلاعات جلسه</span>
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
        <!-- Session details -->
        <div v-else-if="activeSession" class="mt-8">
          <div class="flex items-center justify-center">
            <BaseAvatar
              size="2xl"
              rounded="full"
              :src="
                activeSession.expand?.therapist?.avatar
                  ? `https://pocket.zehna.ir/api/files/therapists/${activeSession.expand.therapist.id}/${activeSession.expand.therapist.avatar}`
                  : '/img/avatars/1.svg'
              "
              :text="activeSession.expand?.therapist?.name?.charAt(0) || 'ر'"
              class="bg-primary-500"
            />
          </div>
          <div class="mt-2 space-y-3 text-center">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-white"
            >
              <span>{{ activeSession.expand?.therapist?.name || 'روانشناس' }}</span>
            </BaseHeading>
            <BaseMessage color="info">
              <div class="text-center">
                <Icon name="ph:info" class="ml-2" />
                شما در حال دیدن تاریخچه مکالمه هستید
              </div>
            </BaseMessage>
            <!-- Session details -->
            <div class="border-muted-200 dark:border-muted-700 mt-6 border-t pt-4">
              <div class="mb-4 text-right">
                <h4 class="text-muted-800 font-medium dark:text-white">
                  اطلاعات جلسه
                </h4>
              </div>

              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-400 text-sm">نوع جلسه:</span>
                <span class="text-muted-800 dark:text-white">
                  {{ activeSession.session_type === 'educational' ? 'آموزشی' : 'درمانی' }}
                </span>
              </div>

              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-400 text-sm">وضعیت:</span>
                <span class="text-muted-800 dark:text-white">
                  {{ activeSession.status === 'done' ? 'تکمیل شده' :
                    activeSession.status === 'inprogress' ? 'در حال انجام' :
                    activeSession.status === 'closed' ? 'بسته شده' : 'نامشخص' }}
                </span>
              </div>

              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-400 text-sm">تاریخ شروع:</span>
                <span class="text-muted-800 dark:text-white">{{ formatDate(activeSession.created) }}</span>
              </div>

              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-400 text-sm">تعداد پیام‌ها:</span>
                <span class="text-muted-800 dark:text-white">{{ activeSession.count_of_total_messages || messages.length || '0' }}</span>
              </div>

              <div class="mb-2 flex items-center justify-between">
                <span class="text-muted-400 text-sm">مدت زمان:</span>
                <span class="text-muted-800 dark:text-white">
                  {{ activeSession.total_time_passed ? `${activeSession.total_time_passed} دقیقه` : 'نامشخص' }}
                </span>
              </div>
            </div>

            <div class="my-4 space-y-2">
              <BaseButton
                v-if="activeSession.status === 'done'"
                rounded="lg"
                class="w-full"
                color="info"
                @click="navigateTo(`/darmana/therapists/analysis?analysis_id=${activeSession.session_analysis_for_system}`)"
              >
                مشاهده تحلیل
              </BaseButton>
              <BaseButton
                rounded="lg"
                class="w-full"
                color="primary"
                @click="gotoList()"
              >
                بازگشت به لیست جلسات
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nui-slimscroll::-webkit-scrollbar {
  width: 5px;
}
.nui-slimscroll::-webkit-scrollbar-thumb {
  background: rgba(125, 125, 125, 0.4);
  border-radius: 10px;
}
.nui-slimscroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
</style>
