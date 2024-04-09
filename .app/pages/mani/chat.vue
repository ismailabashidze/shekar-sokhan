<script setup lang="ts">
import { BackendMessage } from '~/composables/message'

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

const PATIENT_AGENT = 'ZohrehPatient'

const { user } = useUser()
const { open } = usePanels()
const seamless = useSeamless()

const { translated, translate } = seamless
const { getMessages, saveMessage, deleteAllMessages } = useMessage()

const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(true)
const conversation = ref({
  user: {
    name: 'مانی، مشاور بحران',
    photo: '/img/avatars/1.svg',
    role: 'ایجنت هوش مصنوعی',
    bio: 'مانی، مشاور بحران توانایی همدلی، و انجام مداخلات بحران و بالاخص خودکشی را دارست.',
    age: '50s-180s',
    location: 'ایران',
  },
  messages: [
    {
      role: 'separator',
      translatedFa: 'شروع گفت و گو',
      content: 'Conversation Started',
    },
    {
      role: 'assistant',
      translatedFa:
        'سلام. من مانی هستم 👋، و این جا هستم که به شما کمک کنم. توجه داشته باشید که تمام پیام هایی که رد و بدل می کنیم محرمانه، و بر طبق قوانین و مقررات در سایت هستن که در ابتدای ورودتون داخل نرم افزار، اون ها رو پذیرفته اید.',
      // 'سلام. من زینب هستم. دوست خوب تو.',
      content: "Hi. I'm Mani. How can I help you?",
      time: new Date().toLocaleTimeString('fa'),
    },
  ] as BackendMessage[],
})

const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
const nuxtApp = useNuxtApp()
const toaster = useToaster()
const signout = () => {
  nuxtApp.$pb.authStore.clear()
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
  msg.map((m) => (m.time = new Date(m.created ?? '').toLocaleTimeString('fa')))
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
//   const t = await translate(m, 'English', 'Western Persian')
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
//     anonymousUser: user.value.record.id,
//     role: 'user',
//     // evaluations: JSON.parse(userEval),
//     evaluations: {},
//   })
//   const answer = await ask('Mani', m)
//   // const AIEval = await ask('SummaryJsonizer', translated.value)
//   const t2 = await translate(answer, 'English', 'Western Persian')
//   await saveMessage({
//     content: answer,
//     translatedFa: t2 as string,
//     anonymousUser: user.value.record.id,
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
async function translateAndAssemble(answer: string) {
  const chunks = answer.split('\n').filter((chunk) => chunk.trim().length > 0)
  const translatePromises = chunks.map((chunk, index) => {
    return translate(chunk, 'English', 'Western Persian').then(
      (translatedChunk) => ({
        index,
        translatedChunk,
      }),
    )
  })

  const translatedChunksWithIndex = await Promise.all(translatePromises)
  translatedChunksWithIndex.sort((a, b) => a.index - b.index)
  const translatedAnswer = translatedChunksWithIndex
    .map((item) => item.translatedChunk)
    .join('\n')

  return translatedAnswer
}
async function submitMessage() {
  if (!message.value) return
  if (messageLoading.value) return
  messageLoading.value = true
  const m = message.value
  message.value = ''
  const newMessage: BackendMessage = {
    role: 'user',
    translatedFa: m,
    content: '',
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
  const t = await translate(m, 'Western Persian', 'English')
  conversation.value.messages[conversation.value.messages.length - 1].content =
    t as string
  // const userEval = await $fetch('/api/llm', {
  //   method: 'POST',
  //   body: {
  //     type: 'eval',
  //     llmMessages: [{ content: translated.value, role: 'user' }],
  //   },
  // })

  const res = await saveMessage({
    content: t as string,
    translatedFa: m,
    anonymousUser: user.value.record.id,
    role: 'user',
    // evaluations: JSON.parse(userEval),
    evaluations: {},
  })
  if (res === 'success') {
    try {
      const answer = await $fetch('/api/llm', {
        method: 'POST',
        body: {
          type: 'briefing',
          llmMessages: [
            ...conversation.value.messages
              .map((m) => {
                if (m.role === 'assistant') {
                  return { role: m.role, content: m.content }
                } else if (m.role === 'user') {
                  return {
                    role: m.role,
                    content: m.content + ' Answer as json',
                  }
                }
              })
              .filter(Boolean),
            { content: translated.value, role: 'user' },
          ],
        },
      })

      const msg = JSON.parse(answer).Message
      const thoughts = JSON.parse(answer).Thoughts
      const nextSteps = JSON.parse(answer).NextSteps
      const t2 = await translateAndAssemble(msg)

      await saveMessage({
        content: answer,
        translatedFa: t2,
        anonymousUser: user.value.record.id,
        role: 'assistant',
        time: new Date().toLocaleTimeString('fa'),
        evaluations: {},
      })
      messageLoading.value = false
      conversation.value.messages.push({
        role: 'assistant',
        translatedFa: t2,
        content: answer,
        time: new Date().toLocaleTimeString('fa'),
      })

      await nextTick()

      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    } catch (e) {
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
const isDeleting = ref(false)
const deleteAll = async () => {
  isDeleting.value = true
  try {
    const res = await deleteAllMessages(nuxtApp.$pb.authStore.model.id)
    toaster.show({
      title: 'حذف پیام ها', // Authentication
      message: `پیام ها با موفقیت حذف شد`, // Please log in again
      color: 'success',
      icon: 'ph:trash',
      closable: true,
    })
    await sleep(2000)
    window.location.reload()
  } catch (e) {
    toaster.show({
      title: 'حذف پیام ها', // Authentication
      message: `مشکلی وجود دارد`, // Please log in again
      color: 'danger',
      icon: 'ph:trash',
      closable: true,
    })
  } finally {
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
</script>

<template>
  <div class="relative">
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 border-r bg-white0 w-full sm:hidden block"
    >
      <div class="flex w-full flex-row justify-between">
        <div class="flex flex-row">
          <div
            class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
          >
            <NuxtLink to="#" class="flex items-center justify-center">
              <div class="p-[5px] rounded-full bg-white">
                <img
                  src="/img/logo-no-bg.png"
                  width="40"
                  height="40"
                  alt=""
                  srcset=""
                />
              </div>

              <!-- <TairoLogo class="text-primary-600 h-10" /> -->
            </NuxtLink>
          </div>
          <div
            class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
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
              class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 cursor-pointer flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
              @click="canDelete"
            >
              <Icon name="ph:arrow-clockwise" class="h-5 w-5" />
            </NuxtLink>
          </div>
          <div class="flex h-16 w-full items-center justify-center">
            <button
              role="button"
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="جست و جو"
              @click="open('search')"
            >
              <Icon
                name="ph:info"
                class="h-5 w-5"
                @click="expanded = !expanded"
              />
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
          <div class="flex h-16 w-full items-center justify-center">
            <NuxtLink
              to=""
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="Settings"
              @click="signout"
            >
              <Icon name="ph:sign-out" class="h-5 w-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen">
      <!-- Sidebar -->
      <div
        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 h-screen w-20 border-r bg-white sm:block hidden"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col">
            <div
              class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
            >
              <NuxtLink to="#" class="flex items-center justify-center">
                <div class="p-[5px] rounded-full bg-white">
                  <img
                    src="/img/logo-no-bg.png"
                    width="40"
                    height="40"
                    alt=""
                    srcset=""
                  />
                </div>

                <!-- <TairoLogo class="text-primary-600 h-10" /> -->
              </NuxtLink>
            </div>
            <div
              class="ltablet:w-full flex h-16 w-16 shrink-0 items-center justify-center lg:w-full"
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
                class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 cursor-pointer flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                @click="canDelete"
              >
                <Icon name="ph:arrow-clockwise" class="h-5 w-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <button
                role="button"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="جست و جو"
                @click="open('search')"
              >
                <Icon
                  name="ph:info"
                  class="h-5 w-5"
                  @click="expanded = !expanded"
                />
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
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to=""
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Settings"
                @click="signout"
              >
                <Icon name="ph:sign-out" class="h-5 w-5" />
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
            class="relative h-[calc(100vh_-_180px)] sm:h-[calc(100vh_-_128px)] w-full p-4 sm:p-8"
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
                  item.role === 'assistant' ? 'flex-row' : 'flex-row-reverse',
                  item.role === 'separator' ? 'justify-center' : '',
                ]"
              >
                <template v-if="item.role !== 'separator'">
                  <div class="shrink-0">
                    <BaseAvatar
                      v-if="item.role === 'assistant'"
                      :src="conversation?.user.photo"
                      size="xs"
                    />
                    <BaseAvatar
                      v-else-if="item.role === 'user'"
                      src="/img/avatars/3.svg"
                      size="xs"
                    />
                  </div>
                  <div class="flex max-w-md flex-col">
                    <div
                      class="bg-muted-200 dark:bg-muted-800 rounded-xl p-4"
                      :class="[
                        item.role === 'assistant' ? 'rounded-ss-none' : '',
                        item.role === 'user' ? 'rounded-se-none' : '',
                      ]"
                    >
                      <p class="font-sans text-sm text-justify">
                        {{ item.translatedFa }}
                      </p>
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
                    ></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span
                      class="bg-muted-100 dark:bg-muted-900 text-muted-400 px-3 font-sans text-xs uppercase"
                    >
                      {{ item.translatedFa }}
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
                    class="my-3 mr-2 w-[120px]"
                    to="/onboarding"
                    >خرید اشتراک</BaseButton
                  >
                </div>
              </BaseMessage>
            </div>
          </div>
          <!-- Compose -->
          <form
            @submit.prevent="submitMessage"
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-center px-4 sm:px-8"
          >
            <div class="relative w-full">
              <BaseInput
                v-model.trim="message"
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
                  <Icon name="lucide:smile" class="h-5 w-5" />
                </button>
                <button
                  role="button"
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
        :class="expanded ? '-translate-x-full' : 'translate-x-0'"
      >
        <div
          class="flex flex-row-reverse h-16 w-full items-center justify-between px-8"
        >
          <BaseButtonIcon small @click="expanded = !expanded">
            <Icon
              name="lucide:arrow-left"
              class="pointer-events-none h-4 w-4"
            />
          </BaseButtonIcon>
        </div>
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
                <div class="px-4 mt-4">
                  <BasePlaceload class="h-3 w-[3.5rem] rounded" />
                </div>
              </div>
              <div class="w-full">
                <BasePlaceload class="h-10 w-full rounded-xl" />
                <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
                <BasePlaceload class="h-10 w-full mt-5 rounded-xl" />
                <BasePlaceload class="h-10 w-full mt-5 rounded-xl" />
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
          class="block w-[75px] h-[75px] text-yellow-500 mb-5"
        />

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          لطفا توجه کنید
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5 text-justify mt-2"
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
          <BaseButton @click="showDeleteModal = false"> بازگشت </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            @click="deleteAll"
            :loading="isDeleting"
          >
            تایید و حذف
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>
