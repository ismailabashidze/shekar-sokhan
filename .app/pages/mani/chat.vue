<script setup lang="ts">
import { BackendMessage } from '~/composables/conversation'
import { AgentTask } from '~/composables/crew'
import { UIMessage } from '~/composables/message'

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
})

useHead({ htmlAttrs: { dir: 'rtl' } })
// const { report, udpateReport } = useReport()
const { user } = useUser()

const { open } = usePanels()
const seamless = useSeamless()
const { translated, translate } = seamless
const llm = useLLM()
const { answer, ask } = llm
const { agentAction } = useCrew()
const { getMessages, saveMessage, convertedMessages } = useMessage()
const nuxtApp = useNuxtApp()

const conversation = ref({
  user: {
    name: 'مانی، مشاور بحران',
    photo: '/img/avatars/1.svg',
    role: 'ایجنت هوش مصنوعی',
    bio: 'مانی، مشاور بحران توانایی همدلی، و انجام مداخلات بحران و بالاخص خودکشی را دارست.',
    age: '12500ms-17000ms',
    location: 'ایران',
  },
  messages: [
    {
      type: 'separator',
      text: '',
      time: 'شروع گفت و گو',
      attachments: [],
    },
    {
      type: 'recieved',
      text: 'سلام. من مانی هستم 👋. چطور می تونم به شما کمک کنم؟',
      time: new Date().toLocaleTimeString('fa'),
      attachments: [],
    },
  ],
})

const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(true)
const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const history = computed(() => {
  return convertedMessages('LLMMessage')
    .map((item) => `${item.role}:${item.content}`)
    .join('; ')
})

onMounted(async () => {
  const msg = await getMessages()
  conversation.value.messages.push(...convertedMessages('UIMessage'))
  await sleep(2000)
  loading.value = false
  await askFromPsychotherapist()
  // await analyzeAllMessages('suicide_risk_labeler')
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 300)
})
async function analyzeAllMessages(analyze: AgentTask) {
  const msgs = convertedMessages('BackendMessage') as BackendMessage[]
  for (let i = 0; i < msgs.length; i++) {
    const currentMessage = msgs[i]
    const { data } = await agentAction({
      task: analyze,
      text: currentMessage.msgEn,
    })
    if (data.value.result.length > 10) {
      console.log('there is perhaps an error')
    }
    // data.value.result = data.value.result.replace('\n', '')
    const updatedEvaluations = {
      ...msgs[i].evaluations,
      [analyze]: data.value.result, // Using computed property name
    }

    const updatedMessage = {
      ...msgs[i],
      evaluations: updatedEvaluations,
    }

    await nuxtApp.$pb.collection('messages').update(msgs[i].id, updatedMessage)
  }
}
async function askFromPsychotherapist() {
  const msgs = convertedMessages('LLMMessage')

  let lastMessage = ''
  if (msgs.length) {
    lastMessage = msgs.at(-1).content
  } else {
    lastMessage = "Hi, there! I'm Mani. How can I help you ?"
  }
  const res = await agentAction({
    task: 'happy_agent',
    // text: `${history.value}||${lastMessage}`,
    text: `||${lastMessage}`,
  })
  const msgEn = res.data.value.result
  await translate(msgEn, 'English', 'Western Persian')
  await saveMessage({
    msgEn,
    msgFa: translated.value,
    anonymousUser: user.value.id,
    sender: 'user',
  })
  const newMessage: UIMessage = {
    type: 'sent',
    text: translated.value,
    time: new Date().toLocaleTimeString('fa'),
    attachments: [],
  }
  conversation.value.messages.push(newMessage)
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 30)
  await sleep(2000)
  await answerToPatient()
}
async function answerToPatient() {
  const msgs = convertedMessages('LLMMessage')
  let lastMessage = ''
  if (msgs.length) {
    lastMessage = msgs.at(-1).content
  }
  const res = await agentAction({
    task: 'counselling_agent',
    // text: `${history.value}||${lastMessage}`,
    text: `||${lastMessage}`,
  })
  const msgEn = res.data.value.result
  await translate(msgEn, 'English', 'Western Persian')
  await saveMessage({
    msgEn,
    msgFa: translated.value,
    anonymousUser: user.value.id,
    sender: 'ai',
  })
  const newMessage: UIMessage = {
    type: 'recieved',
    text: translated.value,
    time: new Date().toLocaleTimeString('fa'),
    attachments: [],
  }
  conversation.value.messages.push(newMessage)
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 30)
  await sleep(2000)
  await askFromPsychotherapist()
}

async function submitMessage() {
  if (!message.value) return
  if (messageLoading.value) return
  messageLoading.value = true
  const newMessage: UIMessage = {
    type: 'sent',
    text: message.value,
    time: new Date().toLocaleTimeString('fa'),
    attachments: [],
  }
  conversation.value.messages.push(newMessage)
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 30)
  const m = message.value
  message.value = ''
  const t = await translate(m, 'Western Persian', 'English')
  const userEval = await ask('SummaryJsonizer', translated.value)
  await saveMessage({
    msgEn: t as string,
    msgFa: m,
    anonymousUser: user.value.id,
    sender: 'user',
    evaluations: JSON.parse(userEval),
  })
  const answer = await ask('Mani', translated.value)
  // const AIEval = await ask('SummaryJsonizer', translated.value)
  const t2 = await translate(answer, 'English', 'Western Persian')
  await saveMessage({
    msgEn: answer,
    msgFa: t2 as string,
    anonymousUser: user.value.id,
    sender: 'ai',
    evaluations: {},
  })
  messageLoading.value = false
  conversation.value.messages.push({
    type: 'recieved',
    text: translated.value,
    time: new Date().toLocaleTimeString('fa'),
    attachments: [],
  })
  await nextTick()

  if (chatEl.value) {
    chatEl.value.scrollTo({
      top: chatEl.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div class="relative">
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen">
      <!-- Sidebar -->
      <div
        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-r bg-white sm:block"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col">
            <div
              class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
            >
              <NuxtLink to="#" class="flex items-center justify-center">
                <TairoLogo class="text-primary-600 h-10" />
              </NuxtLink>
            </div>
            <div
              class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
            >
              <a
                href="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Back"
                @click.prevent="navigateTo('/choose')"
              >
                <Icon name="lucide:arrow-right" class="h-5 w-5" />
              </a>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="جست و جو"
                @click="open('search')"
              >
                <Icon name="ph:magnifying-glass-duotone" class="h-5 w-5" />
              </button>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Settings"
              >
                <Icon name="ph:gear-six-duotone" class="h-5 w-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

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
                shape="curved"
                icon="lucide:search"
                placeholder="جست و جو"
              />
            </div>

            <TairoSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            />
          </div>
          <!-- Body -->
          <div
            ref="chatEl"
            class="relative h-[calc(100vh_-_128px)] w-full p-4 sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto slimscroll'"
          >
            <!-- Loader-->
            <div
              class="bg-muted-100 dark:bg-muted-900 pointer-events-none absolute inset-0 z-10 h-full w-full p-8 transition-opacity duration-300"
              :class="loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <div class="mt-12 space-y-12">
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-[14rem] rounded" />
                    <BasePlaceload class="h-3 w-full max-w-[8rem] rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-[16rem] rounded" />
                    <BasePlaceload class="h-3 w-full max-w-[12rem] rounded" />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-[16rem] rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-[12rem] rounded"
                    />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-[14rem] rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-[8rem] rounded"
                    />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-[14rem] rounded" />
                    <BasePlaceload class="h-3 w-full max-w-[8rem] rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="h-8 w-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-[16rem] rounded" />
                    <BasePlaceload class="h-3 w-full max-w-[12rem] rounded" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Messages loop -->
            <div v-if="!loading" class="space-y-12">
              <div
                v-for="(item, index) in conversation?.messages"
                :key="index"
                class="relative flex w-full gap-4"
                :class="[
                  item.type === 'recieved' ? 'flex-row' : 'flex-row-reverse',
                  item.type === 'separator' ? 'justify-center' : '',
                ]"
              >
                <template v-if="item.type !== 'separator'">
                  <div class="shrink-0">
                    <BaseAvatar
                      v-if="item.type === 'recieved'"
                      :src="conversation?.user.photo"
                      size="xs"
                    />
                    <BaseAvatar
                      v-else-if="item.type === 'sent'"
                      src="/img/avatars/3.svg"
                      size="xs"
                    />
                  </div>
                  <div class="flex max-w-md flex-col">
                    <div
                      class="bg-muted-200 dark:bg-muted-800 rounded-xl p-4"
                      :class="[
                        item.type === 'recieved' ? 'rounded-ss-none' : '',
                        item.type === 'sent' ? 'rounded-se-none' : '',
                      ]"
                    >
                      <p class="font-sans text-sm">{{ item.text }}</p>
                    </div>
                    <div
                      class="text-muted-400 mt-1 font-sans text-xs"
                      :class="item.type === 'recieved' ? 'text-right' : ''"
                    >
                      {{ item.time }}
                    </div>
                    <div
                      v-if="item.attachments.length > 0"
                      class="mt-2 space-y-2"
                    >
                      <template
                        v-for="(attachment, idx) in item.attachments"
                        :key="idx"
                      >
                        <div
                          v-if="attachment.type === 'image'"
                          class="dark:bg-muted-800 max-w-xs rounded-2xl bg-white p-2"
                          :class="item.type === 'sent' ? 'ms-auto' : ''"
                        >
                          <img
                            :src="attachment.image"
                            :alt="attachment.text"
                            class="rounded-xl"
                          />
                        </div>
                        <NuxtLink
                          :to="attachment.url"
                          v-else-if="attachment.type === 'link'"
                          class="dark:bg-muted-800 block max-w-xs rounded-2xl bg-white p-2"
                          :class="item.type === 'sent' ? 'ms-auto' : ''"
                        >
                          <img
                            :src="attachment.image"
                            :alt="attachment.text"
                            class="rounded-xl"
                          />
                          <div class="px-1 py-2">
                            <p
                              class="text-muted-800 dark:text-muted-100 font-sans"
                            >
                              {{ attachment.url?.replace(/(^\w+:|^)\/\//, '') }}
                            </p>
                            <p class="text-muted-400 font-sans text-xs">
                              {{ attachment.text }}
                            </p>
                          </div>
                        </NuxtLink>
                      </template>
                    </div>
                  </div>
                </template>
                <div v-else>
                  <div
                    class="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      class="border-muted-300/50 dark:border-muted-800 w-full border-t"
                    ></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span
                      class="bg-muted-100 dark:bg-muted-900 text-muted-400 px-3 font-sans text-xs uppercase"
                    >
                      {{ item.time }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Compose -->
          <form
            method="POST"
            action=""
            @submit.prevent="submitMessage"
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-center px-4 sm:px-8"
          >
            <div class="relative w-full">
              <BaseInput
                v-model.trim="message"
                :loading="messageLoading"
                :disabled="messageLoading"
                shape="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="متن را بنویسید ..."
              />
              <div class="absolute end-2 top-0 flex h-12 items-center gap-1">
                <button
                  type="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:smile" class="h-5 w-5" />
                </button>
                <button
                  type="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:paperclip" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Current user -->
      <div
        class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300"
        :class="expanded ? 'translate-x-full' : 'translate-x-0'"
      >
        <div class="flex h-16 w-full items-center justify-between px-8"></div>
        <div class="relative flex w-full flex-col px-8">
          <!-- Loader -->
          <div v-if="loading" class="mt-8">
            <div class="mb-3 flex items-center justify-center">
              <BasePlaceload
                class="h-24 w-24 shrink-0 rounded-full"
                :width="96"
                :height="96"
              />
            </div>
            <div class="flex flex-col items-center">
              <BasePlaceload class="mb-2 h-3 w-full max-w-[10rem] rounded" />
              <BasePlaceload class="mb-2 h-3 w-full max-w-[6rem] rounded" />
              <div class="my-4 flex w-full flex-col items-center">
                <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
                <BasePlaceload class="mb-2 h-2 w-full max-w-[13rem] rounded" />
              </div>
              <div class="mb-6 flex w-full items-center justify-center">
                <div class="px-4">
                  <BasePlaceload class="h-3 w-[3.5rem] rounded" />
                </div>
                <div class="px-4">
                  <BasePlaceload class="h-3 w-[3.5rem] rounded" />
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
              <BaseAvatar :src="conversation?.user.photo" size="2xl" />
            </div>
            <div class="text-center">
              <BaseHeading tag="h3" size="lg" class="mt-4">
                <span>{{ conversation?.user.name }}</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                <span>{{ conversation?.user.role }}</span>
              </BaseParagraph>
              <div class="my-4">
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400"
                >
                  <span>{{ conversation?.user.bio }}</span>
                </BaseParagraph>
              </div>
              <div
                class="divide-muted-200 dark:divide-muted-700 flex items-center justify-center divide-x"
                dir="ltr"
              >
                <div class="flex items-center justify-center gap-2 px-4">
                  <Icon
                    name="ph:timer-duotone"
                    class="text-muted-400 h-4 w-4"
                  />
                  <span class="text-muted-400 font-sans text-xs">
                    {{ conversation?.user.age }}
                  </span>
                </div>
                <div class="flex items-center justify-center gap-2 px-4">
                  <Icon
                    name="ph:map-pin-duotone"
                    class="text-muted-400 h-4 w-4"
                  />
                  <span class="text-muted-400 font-sans text-xs">
                    {{ conversation?.user.location }}
                  </span>
                </div>
              </div>
              <div class="mt-6">
                <BaseButton shape="curved" class="w-full">
                  <span> درباره مانی، هوش مصنوعی </span>
                </BaseButton>
                <button
                  type="button"
                  class="text-primary-500 mt-3 font-sans text-sm underline-offset-4 hover:underline"
                >
                  همرسانی گفت و گو
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TairoPanels />
  </div>
</template>
