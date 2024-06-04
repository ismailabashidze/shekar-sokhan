<script setup lang="ts">
import { type BackendMessage, Content } from '~/composables/message'
interface TranslatedResponse {
  translatedMsg: string
  translatedThoughts: string
  translatedAction: string
  translatedNextSteps: string
}
definePageMeta({
  title: 'پیام ها',
  layout: 'empty',
  preview: {
    title: 'ذهنا',
    description: 'سامانه همدلی هوشمند',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-messaging.png',
    srcDark: '/img/screens/dashboards-messaging-dark.png',
    order: 26,
  },
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// const test = await $fetch('/api/chroma', {
//   method: 'GET',
// })
// console.log(test)

const { user, incDivision } = useUser()
const { open } = usePanels()
const seamless = useSeamless()

const { translated, translate } = seamless
const { getMessages, saveMessage, deleteAllMessages, deleteMessage }
  = useMessage()

const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(true)
const conversation = ref({
  user: {
    name: 'مانی، همدل هوشمند',
    photo: '/img/avatars/mani.jpg',
    role: 'عامل هوش مصنوعی',
    bio: 'مانی اولین عامل هوشمند همدلی',
    age: '50s-180s',
    location: 'ایران',
  },
  messages: [
    {
      role: 'separator',
      content: { message: 'Conversation Started' },
      contentFa: { message: 'شروع گفت و گو' },
    },
    {
      role: 'assistant',
      contentFa: {
        message:
          'سلام. من مانی هستم 👋، و این جا هستم که به شما کمک کنم. توجه داشته باشید که تمام پیام هایی که رد و بدل می کنیم محرمانه، و بر طبق قوانین و مقررات در سایت هستن که در ابتدای ورودتون داخل نرم افزار، اون ها رو پذیرفته اید.',
      },
      content: {
        message:
          'Hi. I\'m Mani. a Licensed Psychotherapist. My goal here is to build a great therapeutic alliance, based on trust and empathy. How can I help you?',
        thoughts:
          'I will do my best. I have to be kind and positive to form a good starting point.',
        nextSteps: 'Starting conversation',
        action: 'intializing conversation properly.',
      },
      time: new Date().toLocaleTimeString('fa'),
    },
  ] as BackendMessage[],
})

const sleep = (time: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, time))
}
async function processResponse(answer) {
  const msg = answer.message
  const thoughts = answer.thoughts
  const action = answer.action
  const nextSteps = answer.nextSteps

  // An array to store the translation results
  let results = []

  // List of parts to be translated
  const parts = [
    { text: msg, srcLang: 'eng', tgtLang: 'pes' },
    { text: thoughts, srcLang: 'eng', tgtLang: 'pes' },
    { text: action, srcLang: 'eng', tgtLang: 'pes' },
    { text: nextSteps, srcLang: 'eng', tgtLang: 'pes' },
  ]

  try {
    for (const part of parts) {
      const translated = await translateAndAssemble(part.text, part.srcLang, part.tgtLang)
      results.push(translated)
    }

    // Destructure the results to individual variables
    const [translatedMsg, translatedThoughts, translatedAction, translatedNextSteps] = results

    // Return an object with all processed parts
    return {
      translatedMsg,
      translatedThoughts,
      translatedAction,
      translatedNextSteps,
    }
  }
  catch (error) {
    console.error('An error occurred during translation and assembly:', error)
    throw error
  }
}
const darkStatus = useColorMode()
const currentStat = ref(darkStatus.preference)
if (darkStatus.preference === 'system') {
  currentStat.value = darkStatus.value
}
watch(darkStatus, (newVal, oldValue) => {
  currentStat.value = newVal.preference
})
const nuxtApp = useNuxtApp()
const toaster = useToaster()
const signout = () => {
  nuxtApp.$pb.authStore.clear()
  localStorage.setItem('user', '')
  toaster.show({
    title: 'خروج از سیستم', // Authentication
    message: `خروج موفقیت آمیز بود`, // Please log in again
    color: 'success',
    icon: 'ph:check',
    closable: true,
  })
  navigateTo('/auth/login')
}

const showNoCharge = ref(false)

onMounted(async () => {
  const msg = await getMessages()
  msg.map(m => (m.time = new Date(m.created ?? '').toLocaleTimeString('fa')))
  conversation.value.messages.push(...msg)

  loading.value = false
  // await autoConversation()
  await sleep(2000)
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 300)
  const u = await nuxtApp.$pb
    .collection('users')
    .getOne(nuxtApp.$pb.authStore.model.id, {})
  showNoCharge.value = !u.hasCharge
  if (nuxtApp.$pb.authStore.isValid) {
    nuxtApp.$pb.collection('users').subscribe(
      nuxtApp.$pb.authStore.model.id,
      (e) => {
        if (!e.record.hasCharge) {
          showNoCharge.value = true
        }
      },
      {},
    )
  }
})

// async function autoConversation() {
//   const lastContent = conversation.value.messages.at(-1)?.content as string
//   const m = await ask(PATIENT_AGENT, lastContent as string)
//   const t = await translate(m, 'eng', 'pes')
//   const newMessage: BackendMessage = {
//     role: 'user',
//     translatedFa: t,
//     content: m,
//     time: new Date().toLocaleTimeString('fa'),
//   }
//   conversation.value.messages.push(newMessage)
//   // const userEval = await ask('SummaryJsonizer', translated.value)
//   await saveMessage({
//     content: m as string,
//     translatedFa: t,
//     user: user.value.record.id,
//     role: 'user',
//     // evaluations: JSON.parse(userEval),
//     evaluations: {},
//   })
//   const answer = await ask('Mani', m)
//   // const AIEval = await ask('SummaryJsonizer', translated.value)
//   const t2 = await translate(answer, 'eng', 'pes')
//   await saveMessage({
//     content: answer,
//     translatedFa: t2 as string,
//     user: user.value.record.id,
//     role: 'assistant',
//     time: new Date().toLocaleTimeString('fa'),
//     evaluations: {},
//   })
//   conversation.value.messages.push({
//     role: 'assistant',
//     translatedFa: t2,
//     content: answer,
//     created: new Date().toLocaleTimeString('fa'),
//   })
//   await autoConversation()
// }
async function translateAndAssemble(
  answer: string,
  from: string,
  to: string,
): Promise<string> {
  // Split the text into tokens to check the count
  const tokens = answer.split(/\s+/)

  // Check if the text has less than 200 tokens
  if (tokens.length < 200) {
    // Translate the entire text as a single chunk
    return translate(answer, from, to)
  }
  else {
    // If more than 200 tokens, proceed with splitting into chunks by sentences
    const chunks = answer
      .split(/[\.\n]\s*/)
      .filter(chunk => chunk.trim().length > 0)

    const translatePromises = chunks.map((chunk, index) => {
      return translate(chunk, from, to).then(translatedChunk => ({
        index,
        translatedChunk,
      }))
    })

    // Await all the translation promises
    const translatedChunksWithIndex = await Promise.all(translatePromises)

    // Sort the translated chunks by their original index to maintain order
    translatedChunksWithIndex.sort((a, b) => a.index - b.index)

    // Join the translated chunks with a new line
    return translatedChunksWithIndex
      .map(item => item.translatedChunk)
      .join('\n')
  }
}

async function submitMessage() {
  if (!message.value) return
  if (messageLoading.value) return
  messageLoading.value = true
  const m = message.value
  message.value = ''
  const newMessage: BackendMessage = {
    role: 'user',
    contentFa: { message: m },
    content: { message: '' },
    time: new Date().toLocaleTimeString('fa'),
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
  const t = await translateAndAssemble(m, 'pes', 'eng')
  conversation.value.messages[
    conversation.value.messages.length - 1
  ].content.message = t
  const res = await saveMessage({
    role: 'user',
    content: { message: t },
    contentFa: { message: m },
    user: user.value.record.id,
    deletionDivider: user.value.record.currentDeletionDivider,
  })
  if (res.id) {
    try {
      const answer = await $fetch('/api/llm', {
        method: 'POST',
        body: {
          type: 'briefing',
          llmMessages: [
            ...conversation.value.messages
              .map((m) => {
                if (m.role == 'assistant' || m.role == 'user') {
                  return {
                    role: m.role,
                    content: JSON.stringify(m.content),
                  }
                }
              })
              .filter(Boolean),
          ],
        },
      })
      const {
        translatedMsg,
        translatedThoughts,
        translatedAction,
        translatedNextSteps,
      } = await processResponse(JSON.parse(answer))

      const newMsg = await saveMessage({
        user: user.value.record.id,
        role: 'assistant',
        time: new Date().toLocaleTimeString('fa'),
        content: JSON.parse(answer),
        contentFa: {
          message: translatedMsg,
          thoughts: translatedThoughts,
          action: translatedAction,
          nextSteps: translatedNextSteps,
        },
        deletionDivider: user.value.record.currentDeletionDivider,
      })
      console.log('newMsg')
      console.log(newMsg)
      messageLoading.value = false
      conversation.value.messages.push({
        id: newMsg.id,
        role: 'assistant',
        content: JSON.parse(answer),
        contentFa: {
          message: translatedMsg,
          thoughts: translatedThoughts,
          action: translatedAction,
          nextSteps: translatedNextSteps,
        },
        time: new Date().toLocaleTimeString('fa'),
      })

      await nextTick()

      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    }
    catch (e) {
      console.log('here')
      console.log(e)
      toaster.show({
        title: 'دریافت پیام', // Authentication
        message: `مشکلی وجود دارد`, // Please log in again
        color: 'danger',
        icon: 'ph:envelope',
        closable: true,
      })
      messageLoading.value = false
    }
  }
}
const showDeleteModal = ref(false)
const showReportModal = ref(false)

const isDeleting = ref(false)
const deleteAll = async () => {
  isDeleting.value = true
  try {
    const res = await deleteAllMessages(nuxtApp.$pb.authStore.model.id)
    incDivision()
    toaster.show({
      title: 'حذف پیام ها', // Authentication
      message: `پیام ها با موفقیت حذف شد`, // Please log in again
      color: 'success',
      icon: 'ph:trash',
      closable: true,
    })
    await sleep(2000)
    window.location.reload()
  }
  catch (e) {
    toaster.show({
      title: 'حذف پیام ها', // Authentication
      message: `مشکلی وجود دارد`, // Please log in again
      color: 'danger',
      icon: 'ph:trash',
      closable: true,
    })
  }
  finally {
    showDeleteModal.value = false
    isDeleting.value = false
  }
}
const canDelete = async () => {
  if (conversation.value.messages.length < 3) {
    toaster.show({
      title: 'حذف پیام ها',
      message: `گفت و گو هنوز آغاز نشده است. برای حذف پیام ها باید بیشتر از یک باشد.`,
      color: 'warning',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }
  showDeleteModal.value = true
}
const resend = async () => {
  toaster.show({
    title: 'باز ارسال آخرین پیام',
    message: `آخرین پیام عامل هوش مصنوعی حذف و پیام جدیدی ارسال خواهد شد`,
    color: 'warning',
    icon: 'lucide:rotate-cw',
    closable: true,
  })

  await deleteMessage(conversation.value.messages.at(-1).id)
  conversation.value.messages.pop()
  message.value = conversation.value.messages.at(-1)?.contentFa
    ?.message as string
  conversation.value.messages.pop()
  await submitMessage()
}

const report = ref([])
const reportChoices = ref([
  {
    img: 'lucide:rotate-cw',
    name: 'repetitive',
    title: 'تکراری',
    description: 'پیام کاملا تکراری است',
    content:
      'user reported that your last message was too repetitive. try telling something new and use new words to convey the message.',
  },
  {
    img: 'lucide:circle-alert',
    name: 'unclear',
    title: 'نامفهوم',
    description: 'پاسخ داده شده از لحاظ معنایی نامفهوم است.',
    content:
      'user reported that your last message is not clear and has misleading. try checking the previous messages and reply based on the context. clear your message.',
  },
  {
    img: 'lucide:heart-off',
    name: 'unempathic',
    title: 'غیر همدلانه',
    description: 'پاسخ داده شده خالی از احساس همراهی و همدلی است.',
    content:
      'user reported that your last message is not empathic enough. Emphasize on empathy and make it bolder. Show more empathy.',
  },
  {
    img: 'lucide:scale',
    name: 'biased',
    title: 'جانبدارانه',
    description: 'پاسخ جانبدارانه است.',
    content:
      'user reported that your last message is biased. Try answering unbiased.',
  },
  {
    img: 'ph:mosque',
    name: 'nonIslamic',
    title: 'غیر شرعی',
    description: 'پاسخ داده شده با ارزش های اسلامی مغایرت دارد.',
    content:
      'user reported that your last message is not acceptable via islamic rules. Try to align with islamic values and answer again.',
  },
])
function reset() {
  report.value = []
}
const submitReport = async () => {
  const rep = report.value.map((r) => {
    return {
      role: 'user',
      content: { message: r.content },
      contentFa: { message: r.description },
    }
  })
  conversation.value.messages = conversation.value.messages.concat(rep)
  toaster.show({
    title: 'اعمال گزارش',
    message: `موارد گزارش شده اعمال و پیام ارسال خواهد شد.`,
    color: 'warning',
    icon: 'lucide:rotate-cw',
    closable: true,
  })
  showReportModal.value = false
  message.value = 'لطفا گزارش را اعمال کن و دوباره پاسخ بده'
  await submitMessage()
}
const closable = ref<boolean | undefined>()
</script>

<template>
  <div class="relative">
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 bg-white0 relative z-10 block w-full border-r sm:hidden"
    >
      <div class="flex w-full flex-row justify-between">
        <div class="flex flex-row">
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

          <!-- <div
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
            </div> -->
        </div>
        <div class="flex flex-row">
          <div class="flex h-16 w-full items-center justify-center">
            <NuxtLink
              to=""
              title="Settings"
              class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
              @click="canDelete"
            >
              <Icon name="ph:arrow-clockwise" class="size-5" />
            </NuxtLink>
          </div>
          <div class="flex h-16 w-full items-center justify-center">
            <button
              role="button"
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="جست و جو"
              @click="open('search')"
            >
              <Icon
                name="ph:info"
                class="size-5"
                @click="expanded = !expanded"
              />
            </button>
          </div>
          <div class="flex h-16 w-full items-center justify-center">
            <NuxtLink
              to="#"
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="Settings"
            >
              <Icon name="ph:gear-six-duotone" class="size-5" />
            </NuxtLink>
          </div>
          <div class="flex h-16 w-full items-center justify-center">
            <NuxtLink
              to=""
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="Settings"
              @click="signout"
            >
              <Icon name="ph:sign-out" class="size-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-muted-100 dark:bg-muted-900 flex min-h-screen"
      :style="
        currentStat === 'light'
          ? `background-image: url('../../img/back/back.png')`
          : `background-image: url('../../img/back/back-dark.png')`
      "
    >
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

            <!-- <div
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
            </div> -->
          </div>
          <div class="flex flex-col">
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to=""
                title="Settings"
                class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
                @click="canDelete"
              >
                <Icon name="ph:arrow-clockwise" class="size-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <button
                role="button"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="جست و جو"
                @click="open('search')"
              >
                <Icon
                  name="ph:info"
                  class="size-5"
                  @click="expanded = !expanded"
                />
              </button>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Settings"
              >
                <Icon name="ph:gear-six-duotone" class="size-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to=""
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Settings"
                @click="signout"
              >
                <Icon name="ph:sign-out" class="size-5" />
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
            class="relative h-[calc(100vh_-_180px)] w-full p-4 sm:h-[calc(100vh_-_128px)] sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto slimscroll'"
          >
            <!-- Loader-->
            <div
              class="bg-muted-100 dark:bg-muted-900 pointer-events-none absolute inset-0 z-10 size-full p-8 transition-opacity duration-300"
              :style="
                currentStat === 'light'
                  ? `background-image: url('../../img/back/back.png')`
                  : `background-image: url('../../img/back/back-dark.png')`
              "
              :class="loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <div class="mt-12 space-y-12">
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-56 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-32 rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-64 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-48 rounded" />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-64 rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-48 rounded"
                    />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-56 rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-32 rounded"
                    />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-56 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-32 rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-64 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-48 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Messages loop -->
            <div v-if="!loading" class="space-y-12">
              <BaseMessage type="info" :closable="true">
                <div class="flex content-between">
                  <div class="flex items-center">
                    اولین هدف برای هوش مصنوعی آشنایی بیشتر با شما تنظیم شده است.
                    برخی از تغییرات در اهداف با شما به اشتراک گذاشته می شود.
                  </div>
                </div>
              </BaseMessage>
              <div
                v-for="(item, index) in conversation?.messages"
                :key="index"
                class="relative flex w-full gap-4"
                :class="[
                  item.role === 'assistant' ? 'flex-row' : 'flex-row-reverse',
                  item.role === 'separator' ? 'justify-center' : '',
                ]"
              >
                <template v-if="item.role !== 'separator'">
                  <div
                    class="flex shrink-0 self-start rounded-full bg-white p-[3px]"
                  >
                    <BaseAvatar
                      v-if="item.role === 'assistant'"
                      :src="conversation?.user.photo"
                      size="xs"
                    />
                    <BaseAvatar
                      v-else-if="item.role === 'user'"
                      src="/img/avatars/user.png"
                      size="xs"
                    />
                  </div>
                  <div class="flex max-w-md flex-col">
                    <div
                      class="bg-muted-300 dark:bg-muted-800 rounded-xl p-4"
                      :class="[
                        item.role === 'assistant' ? 'rounded-ss-none' : '',
                        item.role === 'user' ? 'rounded-se-none' : '',
                      ]"
                    >
                      <p class="text-justify font-sans text-sm">
                        {{ item?.contentFa.message }}
                      </p>
                      <div
                        v-if="
                          item.role === 'assistant' &&
                            index == conversation?.messages.length - 1 &&
                            index != 1
                        "
                        class="w-100 mt-2 flex flex-row-reverse"
                      >
                        <button
                          role="button"
                          class="bg-primary-500 hover:bg-primary-700 mr-2 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                          @click="resend()"
                        >
                          <Icon name="lucide:rotate-cw" class="size-5" />
                        </button>
                        <button
                          role="button"
                          class="bg-warning-500 hover:bg-warning-700 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                          @click="showReportModal = true"
                        >
                          <Icon name="lucide:shield-alert" class="size-5" />
                        </button>
                      </div>
                    </div>
                    <div
                      class="text-muted-400 mt-1 font-sans text-xs"
                      :class="item.role === 'assistant' ? 'text-right' : ''"
                    >
                      {{ item.time }}
                    </div>

                    <!-- <div
                      v-if="item.attachments.length > 0"
                      class="mt-2 space-y-2"
                    >
                      <template
                        v-for="(attachment, idx) in item.attachments"
                        :key="idx"
                      >
                        <div
                          v-if="attachment.role === 'image'"
                          class="dark:bg-muted-800 max-w-xs rounded-2xl bg-white p-2"
                          :class="item.role === 'user' ? 'ms-auto' : ''"
                        >
                          <img
                            :src="attachment.image"
                            :alt="attachment.text"
                            class="rounded-xl"
                          />
                        </div>
                        <NuxtLink
                          :to="attachment.url"
                          v-else-if="attachment.role === 'link'"
                          class="dark:bg-muted-800 block max-w-xs rounded-2xl bg-white p-2"
                          :class="item.role === 'user' ? 'ms-auto' : ''"
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
                    </div> -->
                  </div>
                </template>
                <div v-else>
                  <div
                    class="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      class="border-muted-300/50 dark:border-muted-800 w-full border-t"
                    />
                  </div>
                  <div class="relative flex justify-center">
                    <span
                      class="bg-muted-100 dark:bg-muted-900 text-muted-400 px-3 font-sans text-xs uppercase"
                    >
                      {{ item.contentFa.message }}
                    </span>
                  </div>
                </div>
              </div>

              <BaseMessage
                v-if="showNoCharge"
                type="danger"
                class="flex justify-evenly"
              >
                <div class="flex content-between">
                  <div class="flex items-center">
                    به نظر می‌رسد بسته مصرفی شما به اتمام رسیده است. برای ادامه
                    استفاده از خدمات، لطفاً اقدام به خرید اشتراک نمایید.
                  </div>
                  <BaseButton
                    color="primary"
                    class="my-3 mr-2 w-[150px]"
                    to="/onboarding"
                  >
                    خرید اشتراک
                  </BaseButton>
                </div>
              </BaseMessage>
            </div>
          </div>
          <!-- Compose -->
          <form
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-center px-4 sm:px-8"
            @submit.prevent="submitMessage"
          >
            <div class="relative w-full">
              <BaseInput
                v-model="message"
                :loading="messageLoading"
                :disabled="messageLoading || showNoCharge"
                shape="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="متن را بنویسید ..."
                autocomplete="off"
              />
              <div class="absolute end-2 top-0 flex h-12 items-center gap-1">
                <button
                  role="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:smile" class="size-5" />
                </button>
                <button
                  role="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:paperclip" class="size-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Current user -->
      <div
        class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300"
        :class="expanded ? '-translate-x-full' : 'translate-x-0'"
      >
        <div
          class="flex h-16 w-full flex-row-reverse items-center justify-between px-8"
        >
          <BaseButtonIcon small @click="expanded = !expanded">
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
                <div class="mt-4 px-4">
                  <BasePlaceload class="h-3 w-14 rounded" />
                </div>
              </div>
              <div class="w-full">
                <BasePlaceload class="h-10 w-full rounded-xl" />
                <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
                <BasePlaceload class="mt-5 h-10 w-full rounded-xl" />
                <BasePlaceload class="mt-5 h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
          <!-- User details -->
          <div v-else class="mt-5">
            <div class="flex items-center justify-center">
              <BaseAvatar :src="conversation?.user.photo" size="2xl" />
            </div>
            <div class="text-center">
              <BaseHeading
                tag="h3"
                size="lg"
                class="mt-4"
              >
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
                    class="text-muted-400 size-4"
                  />
                  <span class="text-muted-400 font-sans text-xs">
                    {{ conversation?.user.age }}
                  </span>
                </div>
                <div class="flex items-center justify-center gap-2 px-4">
                  <Icon
                    name="ph:map-pin-duotone"
                    class="text-muted-400 size-4"
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
                <BaseMessage class="mt-5" type="info">
                  لطفا توجه داشته باشید که عامل هوش مصنوعی در فاز توسعه می‌‌باشد
                  و احتمال ارائه‌ی پاسخ‌های اشتباه را دارد.
                </BaseMessage>
                <BaseMessage class="mt-5" type="warning">
                  با مانی با ادبیاتی ساده صحبت کنید. او به شما گوش می کند و شما
                  را حمایت می کند. از ادبیات پیچیده و کلمات خاص استفاده نکنید.
                </BaseMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TairoPanels />
  </div>
  <TairoModal
    :open="showDeleteModal"
    size="sm"
    @close="showDeleteModal = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          بازنشانی و حذف گفت و گو
        </h3>

        <BaseButtonClose @click="showDeleteModal = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full text-center">
        <Icon
          name="ph:warning"
          class="mb-5 block size-[75px] text-yellow-500"
        />

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          لطفا توجه کنید
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-justify text-sm leading-5"
        >
          در صورت حذف، اطلاعات شما از بین خواهد رفت و عامل هوش مصنوعی به طور
          کامل دانش قبلی نسبت به شما را از دست خواهد داد. مطمئن هستید؟
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showDeleteModal = false">
            بازگشت
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            :loading="isDeleting"
            @click="deleteAll"
          >
            تایید و حذف
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
  <TairoModal
    :open="showReportModal"
    size="xl"
    @close="showReportModal = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          اعلام گزارش خطا
        </h3>
        <div class="flex">
          <BaseButtonIcon
            rounded="full"
            :color="'info'"
            @click.prevent="reset"
          >
            <Icon name="lucide:rotate-cw" />
          </BaseButtonIcon>
          <BaseButtonClose @click="showReportModal = false" />
        </div>
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full text-center">
        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          لطفا توجه کنید
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-justify text-sm leading-5"
        >
          گزارش شما روی آخرین پیام هوش مصنوعی ثبت می شود. می توانید از موارد زیر
          تعدادی را انتخاب نمایید و در نهایت گزارش را انتخاب کنید. اطلاعات
          انتخابی شما ثبت خواهد شد و یک پیام جدید با توجه به گزارش های شما ثبت و
          ارائه خواهد شد.
        </p>
        <div class="mt-5 w-full">
          <form class="mx-auto w-full">
            <fieldset class="w-full space-y-6">
              <div class="grid gap-6 sm:grid-cols-1">
                <BaseCheckboxHeadless
                  v-for="r in reportChoices"
                  v-model="report"
                  :value="r"
                >
                  <BaseCard
                    rounded="sm"
                    class="peer-checked:!border-warning-500 peer-checked:[&_.child]:!text-warning-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                  >
                    <div class="flex w-full items-center gap-2">
                      <button
                        role="button"
                        class="bg-warning-500 hover:bg-warning-700 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                        @click="showReportModal = true"
                      >
                        <Icon :name="r.img" class="size-5" />
                      </button>

                      <div class="mr-2">
                        <BaseHeading
                          as="h4"
                          size="sm"
                          weight="medium"
                          lead="none"
                          class="text-right"
                        >
                          {{ r.title }}
                        </BaseHeading>

                        <BaseText
                          size="xs"
                          class="text-muted-400 mt-2 text-right"
                        >
                          {{ r.description }}
                        </BaseText>
                      </div>

                      <div class="child text-muted-300 ms-auto">
                        <div class="size-3 rounded-full bg-current" />
                      </div>
                    </div>
                  </BaseCard>
                </BaseCheckboxHeadless>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showReportModal = false">
            بازگشت
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            :loading="isDeleting"
            :disabled="!report.length"
            @click="submitReport()"
          >
            گزارش
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>
