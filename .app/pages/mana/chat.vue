<script setup lang="ts">

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
const getVoice = async (item) => {
  item.isVoiceDone = false
  const v = await $fetch('https://seam.brro.ir/tts', {
    method: 'POST',
    body: {
      text: item.contentFa.message,
      // voice: 'fa-IR-DilaraNeural', // fa-IR-FaridNeural
      voice: voice, //
      file_name: 'output.mp3',
    },
  })
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      new Audio(url).play()
      item.isVoiceDone = true
    })
}
// const test = await $fetch('/api/chroma', {
//   method: 'GET',
// })
// console.log(test)
const { user, incDivision, getUserDetails, getAnalysis } = useUser()
const userDetails = ref()
const { open } = usePanels()
const seamless = useSeamless()
const { goals, getGoals } = useGoal()

const { translated, translate, translateS2T } = seamless
const { getMessages, saveMessage, deleteAllMessages, deleteMessage }
  = useMessage()

const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(true)
const isTyping = ref(false)
const { counter, reset, pause, resume } = useInterval(1000, { controls: true })
const isNewMessagesDone = ref(true)
const newMessagesIndex = ref(0)
const timer = ref(30)
const type = ref('briefing')
const isGoingToDone = ref(false)
const showTenMin = ref(false)
const selectedEmoji = ref()
const showDoneModal = ref(false)
const isRequestForReport = ref(false)
const startChargeTime = ref()
const requestForReport = async () => {
  isRequestForReport.value = true
  let conv = conversation.value.messages.filter(m => m.role === 'user' || m.role === 'assistant')
  let sendToLLM = combineMessages(conv, 'user')
  const answer = await $fetch('/api/analysis', {
    method: 'POST',
    body: {
      llmMessages: [
        ...sendToLLM
          .map((m) => {
            return {
              role: m.role ?? 'assistant',
              content: m.role === 'user' || m.role === 'assistant' ? 'CHAT:' + m.content.message : 'ASSESSMENT:' + JSON.stringify({ GHQAnalysis: m.GHQAnalysis, behavioralAnalysis: m.behavioralAnalysis, emotionalAnalysis: m.emotionalAnalysis, thoughtsAndConcerns: m.thoughtsAndConcerns }),

            }
          })
          .filter(Boolean),
      ],
      userId: user.value.id,
      currentDivision: user.value.currentDeletionDivider,
      userDetails: userDetails.value[0],
    },
  })
  isRequestForReport.value = false
  navigateTo('/mana/waitForReport')
}
const goToDoneAndEnd = async () => {
  type.value = 'summary'
  isGoingToDone.value = true
  conversation.value.messages.push({
    role: 'separator',
    content: { message: 'Summary and conclusion in the last ten minutes.' },
    contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
  })
  saveMessage({
    role: 'separator',
    content: { message: 'Summary and conclusion in the last ten minutes.' },
    contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
    user: user.value.id,
    deletionDivider: user.value.currentDeletionDivider,
  })
  messageLoading.value = true
  pause()
  isGoingToDone.value = false
  showTenMin.value = false
  await askForMana()
  messageLoading.value = false
}

watch(message, () => {
  if (isTyping.value) {
    // mana decided to write, but will stop, because user decided to write.
    timer.value = 5
    setTimeout(() => {
      reset()
    }, 10000)
  }
  else {
    // mana has not decided to write.
    timer.value = 20
    reset()
  }
})
watch(counter, (n, o) => {
  if (n == timer.value) {
    isTyping.value = true
    pause()
    setTimeout(() => {
      // a wait to ensure sending the message.
      if (isTyping.value) {
        askForMana()
      }
    }, 2000)
  }
  else {
    isTyping.value = false

    resume()
  }
})
const conversation = ref({
  user: {
    name: 'مانا، همدل هوشمند',
    photo: '/img/avatars/mana.jpg',
    role: 'عامل هوش مصنوعی',
    bio: 'مانا اولین عامل هوشمند همدلی',
    age: '50s-180s',
    location: 'ایران',
  },
  messages: [
    {
      role: 'separator',
      content: { message: 'Conversation Started' },
      contentFa: { message: 'شروع گفت و گو' },
    },
  ],
})
function combineMessages(dataArray, targetRole) {
  // Create a deep copy of dataArray
  let dataCopy = dataArray.map(item => ({
    ...item,
    content: { ...item.content },
  }))

  let startIndex = null // Start index of the target role sequence
  let combinedMessage = '' // Storage for combined message

  for (let i = 0; i < dataCopy.length; i++) {
    const item = dataCopy[i]

    // Check if the current item's role matches the target
    if (item.role === targetRole) {
      if (startIndex === null) {
        startIndex = i // Mark the start of a new sequence
        combinedMessage = item.content.message // Initialize combined message
      }
      else {
        combinedMessage += ' ' + item.content.message // Concatenate messages
      }
    }
    else if (startIndex !== null) {
      // We've reached the end of a sequence of target roles
      dataCopy[startIndex].content.message = combinedMessage // Set the combined message
      // Remove the subsequent items of the same role
      dataCopy.splice(startIndex + 1, i - startIndex - 1)
      i = startIndex + 1 // Adjust the loop index after modification
      startIndex = null // Reset start index
      combinedMessage = '' // Reset combined message
    }
  }

  // Check if the array ended with target role items
  if (startIndex !== null) {
    dataCopy[startIndex].content.message = combinedMessage // Set the combined message
    dataCopy.splice(startIndex + 1, dataCopy.length - startIndex - 1)
  }
  return dataCopy
}
function convertToInformal(text) {
  if (typeof text != 'string') return text
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  // text = text.replace(/می\s(.*?)ید/g, 'می $1ین') // General pattern for conjugations
  // text = text.replace(/\bرا\b/g, ' رو ')
  // text = text.replace(/\sرا\s/g, ' رو ')
  // text = text.replace(/ است\./g, 'ه.')
  // text = text.replace(/چگونه بود/g, 'چطور بود')
  // text = text.replace(/در ابتدا/g, 'اولش')
  // text = text.replace(/می توانم/g, 'می تونم')
  // text = text.replace(/آنها/g, 'اونها')
  // text = text.replace(/توانستم/g, 'تونستم')
  // text = text.replace(/به شما دادم/g, 'بهتون دادم')
  // text = text.replace(/پیام های من/g, 'پیامام')
  // text = text.replace(/به نظر می رسد/g, 'بنظر میاد')
  // text = text.replace(/ هستید/g, 'ید ')
  // text = text.replace(/هنگامی که/g, 'وقتی که')
  // text = text.replace(/می شویم/g, 'می شیم')
  // text = text.replace(/می تواند/g, 'می تونه')
  // text = text.replace(/می توانید/g, 'می تونین')

  // text = text.replace(/شود/g, 'بشه')
  // text = text.replace(/\sیک\s/g, ' یه ')
  // text = text.replace(/به یاد داشته باشید/g, 'بدونین')
  // text = text.replace(/احساس بسیار قابل ارتباطه/g, 'احساس بسیار قابل درکه')
  // text = text.replace(/\sآن\s/g, ' اون ')
  // text = text.replace(/در مورد اون/g, 'درموردش')
  // text = text.replace(/باشید/g, 'باشین')
  // text = text.replace(/یافتن/g, 'پیدا کردن')
  // text = text.replace(/نشوی/g, 'نشی')
  // text = text.replace(/\sاگر\s/g, ' اگه ')
  // text = text.replace(/تا به حال/g, 'تا حالا')
  // text = text.replace(/می دهند/g, 'می دن')
  // text = text.replace(/می توانند/g, 'می تونن')
  // text = text.replace(/کنند/g, 'کنن')
  // text = text.replace(/گاهی اوقات/g, 'بعضی وقتا')
  // text = text.replace(/می تواند/g, 'می تونه')
  // text = text.replace(/ایجاد کند/g, 'ایجاد کنه')
  // text = text.replace(/می توانم/g, 'می تونم')
  // text = text.replace(/کاملا خوب است/g, 'اوکیه')
  // text = text.replace(/\sکنید\s/g, ' کنین ')
  // text = text.replace(/\bکنید\b/g, ' کنین ') // Corrected this pattern
  // text = text.replace(/خویشاوند/g, 'فامیل')
  // text = text.replace(/ندارید/g, 'ندارین')
  // text = text.replace(/به دنبال/g, 'گشتن دنبال')
  // text = text.replace(/خواهید شد/g, 'می شین')
  // text = text.replace(/دارد/g, 'داره')
  // text = text.replace(/دارید/g, 'دارین')
  // text = text.replace(/ببرید/g, 'ببرین')
  // text = text.replace(/خودتان/g, 'خودتون')
  // text = text.replace(/فعالیت های/g, 'فعالیتای')
  // text = text.replace(/هرگز از خودتان دست نکشید/g, 'هرگز خودتونو فراموش نکنین')
  // text = text.replace(/ هستید/g, 'هستین')
  // text = text.replace(/ هایی/g, 'ایی')
  // text = text.replace(/می آورین/g, 'میارین')
  // text = text.replace(/از زمان به زمان/g, 'بعضی وقتا')
  // text = text.replace(/کند/g, 'کنه')
  // text = text.replace(/شماه/g, 'شماست')
  // text = text.replace(/می توان/g, 'می شه')
  // text = text.replace(/بپذیرید/g, 'بپذیرین')
  // text = text.replace(/بدانید/g, 'بدونین')
  // text = text.replace(/اگه بیش از حد احساس می کنین/g, 'اگه فکر می کنین احساستون بیش از حده')
  // text = text.replace(/بحث کنیم/g, 'گپ بزنیم')
  // text = text.replace(/بگذرانید/g, 'بذارید')
  // text = text.replace(/آن ها/g, 'اونا')
  // text = text.replace(/دهید/g, 'بدین')
  // text = text.replace(/به نظرت چطوره/g, 'نظرت چیه')
  // text = text.replace(/گشتن دنبال/g, 'دنبال')
  // text = text.replace(/گوش گوش/g, 'گوش')
  // text = text.replace(/پینا/g, 'پیدا')
  // text = text.replace(/می شهیم/g, 'می شه')
  // text = text.replace(/دادهه/g, 'داده')
  // text = text.replace(/ هستم\s/g, 'م ')
  // text = text.replace(/از طریق احساسات خود حرکت کنید/g, 'با احساسات خود کنار بیای')
  // text = text.replace(/بیایید/g, 'بیا')
  // text = text.replace(/شویم/g, 'شیم')
  // text = text.replace(/ است،/g, 'ه، ')
  // text = text.replace(/خوش آمدید!/g, 'خواهش می کنم!')
  // text = text.replace(/گذراندن/g, 'گذروندن')
  // text = text.replace(/آنه/g, 'اونه')
  // text = text.replace(/ است\s/g, 'ه ')
  // text = text.replace(/آیا\s/g, '')
  // text = text.replace(/دهیم/g, 'بدیم')
  // text = text.replace(/ هستم\./g, 'م.')
  // text = text.replace(/می دانم/g, 'می دونم')
  // text = text.replace(/من می دونم/g, 'می دونم')
  // text = text.replace(/باشد/g, 'باشه')
  // text = text.replace(/شجاعانهه/g, 'شجاعانه س ')
  // text = text.replace(/کننه/g, 'کننده')
  // text = text.replace(/ است\s/g, 'ه ')
  // text = text.replace(/باشد/g, 'باشه')
  // text = text.replace(/کهتون/g, 'که شما ')
  // text = text.replace(/نیستید،/g, 'نیستین،')
  // text = text.replace(/اولیهم/g, 'اولیه ام')
  // text = text.replace(/؟م /g, '؟ ')
  // text = text.replace(/کرده اید./g, 'کرده این.')
  // text = text.replace(/در حال حاضر/g, 'الان')
  // text = text.replace(/با من/g, 'باهام')
  // text = text.replace(/با شما/g, 'باهات')
  // text = text.replace(/بگذاری/g, 'بذاری')
  // text = text.replace(/می خواهم/g, 'می خوام')
  // text = text.replace(/بدانین/g, 'بدونین')
  // text = text.replace(/دانستن/g, 'دونستن')
  // text = text.replace(/وقت ميگيره/g, 'ممکنه زمان بر باشه')
  // text = text.replace(/احساسات خود/g, 'احساساتتون')
  // text = text.replace(/می خواهین/g, 'می خواین')
  // text = text.replace(/می شهین/g, 'می شه')
  // text = text.replace(/با اون/g, 'باهاش')
  // text = text.replace(/بگویید؟/g, 'بگین؟')
  // text = text.replace(/ماید/g, 'ما هستید')
  // text = text.replace(/علناً/g, 'راحت')
  // text = text.replace(/زیرا/g, 'چون')
  // text = text.replace(/ترویج می دهد./g, 'ایجاد می کنه.')
  // text = text.replace(/اینگونه/g, 'این طوری')
  // text = text.replace(/بسیار دوستانهه/g, 'خیلی عاطفی بود!')
  // text = text.replace(/می رسد،/g, 'می رسه،')
  // text = text.replace(/کدام یه رو/g, 'کدومو')
  // text = text.replace(/می دانستین؟/g, 'می دونی؟')
  // text = text.replace(/چه اتفاقی می افتد؟/g, 'چی شد؟')
  // text = text.replace(/اینگونه/g, 'این طوری')
  // text = text.replace(/مفین/g, 'خوب')
  // text = text.replace(/نبودند/g, 'نبودن')
  // text = text.replace(/ي/g, 'ی')
  // text = text.replace(/پیام های/g, 'پیامای')
  // text = text.replace(/به نظر شما/g, 'بنظرت')
  // text = text.replace(/عذرخواهی می کنم/g, 'می بخشین')
  // text = text.replace(/پاسخ هایم رو/g, 'پاسخامو')
  // text = text.replace(/بهبود بخشم/g, 'بهتر کنم')
  // text = text.replace(/مطمئن شوم/g, 'مطمئن بشم')
  // text = text.replace(/اونها برای شما ارزشی دارند./g, 'اونا مناسب هستن.')
  // text = text.replace(/از اطلاعات ما/g, 'با توجه به اطلاعات')
  // text = text.replace(/احساس غرق شدن/g, 'با توجه به اطلاعات')
  // text = text.replace(/اعتقاد دارم/g, 'ایمان دارم')
  // text = text.replace(/احساس غرق شدن/g, 'با توجه به اطلاعات')
  // text = text.replace(/باهاشها/g, 'باهاشون')
  // text = text.replace(/بدانم./g, 'بدونم.')
  // text = text.replace(/بدهم/g, 'بدم')
  // text = text.replace(/باین/g, 'باید')
  // text = text.replace(/من می فهمم که شما باید احساس کمی پایین به تازگی/g, 'می فهمم که یکم احساس کمبود می کنی')
  // text = text.replace(/کنید./g, 'کنین.')
  // text = text.replace(/می گذارد/g, 'می ذاره')
  // text = text.replace(/شاین/g, 'شاید')
  // text = text.replace(/به او/g, 'بهش')
  // text = text.replace(/به من/g, 'بهم')
  // text = text.replace(/به شما/g, 'بهت')
  // text = text.replace(/از شما/g, 'ازت')
  // text = text.replace(/از من/g, 'ازم')
  // text = text.replace(/کردهه/g, 'کرده')
  // text = text.replace(/طریق اون/g, 'اون طریق')
  // text = text.replace(/بازم/g, 'آماده ام')
  // text = text.replace(/باز بیان/g, 'راحت')
  // text = text.replace(/در حالی که/g, 'اگرچه')
  // text = text.replace(/بگذارم/g, 'بذارم')
  // text = text.replace(/چگونه کار می کنین/g, 'نظرتون چیه')
  // text = text.replace(/بهشن/g, 'بهش')
  // text = text.replace(/شماه/g, 'شماست')
  // text = text.replace(/ماه./g, 'ماست.')
  // text = text.replace(/خودمان/g, 'خودمون')
  // text = text.replace(/برای شما/g, 'براتون')
  // text = text.replace(/دهم؟/g, 'بدم؟')
  // text = text.replace(/ نشان /g, ' نشون ')
  // text = text.replace(/در نظر بگیرید/g, 'بدونین')
  // text = text.replace(/می خواند/g, 'می خونه')
  // text = text.replace(/بدانی/g, 'بدونی')
  // text = text.replace(/می دهم/g, 'می دم')
  // text = text.replace(/باز بودن/g, 'راحت بودن')
  // text = text.replace(/شنینن/g, 'شنیدن')
  // text = text.replace(/کنندهه/g, 'کننده ست')
  // text = text.replace(/هنوز هم/g, 'هنوزم')
  // text = text.replace(/باز شوید/g, 'راحت باشید')
  // text = text.replace(/می بشه/g, 'می شه')
  // text = text.replace(/می مانم/g, 'می مونم')
  // text = text.replace(/ما می شه/g, 'می شه')
  // text = text.replace(/استراتژی/g, 'راه حل')
  // text = text.replace(/می دهد/g, 'می ده')
  // text = text.replace(/شمی شه/g, 'می شه')
  // text = text.replace(/تشویق/g, 'دلگرم')
  // text = text.replace(/گرما/g, 'گرمی')
  // text = text.replace(/پیشنهادات باز/g, 'پیشنهادات آماده')
  // text = text.replace(/چیست/g, 'چیه')
  // text = text.replace(/ همان /g, 'همون')
  // text = text.replace(/می دانین/g, 'می دونین')
  // text = text.replace(/از تماس با ما دریغ نکنین/g, 'حتما با من صحبت رو ادامه بدین')
  // text = text.replace(/آمابدین/g, 'آماده این')
  // text = text.replace(/پشت سر دارین/g, 'پشت سر می ذارین')
  // text = text.replace(/نبدین/g, 'ندین')
  // text = text.replace(/ادامه یابد/g, 'ادامه پیدا کنه')
  // text = text.replace(/همسرتان/g, 'همسرتون')
  // text = text.replace(/دهد؟/g, 'بده؟')
  // text = text.replace(/غرق شدن/g, 'ناتوانی')
  // text = text.replace(/پیشین/g, 'قبلی')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')
  // text = text.replace(/بگویید/g, 'بگین')

  // Add more generalized patterns here
  return text
}

const askForMana = async () => {
  if (isNewMessagesDone.value && !showNoCharge.value) {
    try {
      let sendToLLM = combineMessages(conversation.value.messages, 'user')

      const answer = await $fetch('/api/llm', {
        method: 'POST',
        body: {
          type: type.value,
          llmMessages: [
            ...sendToLLM
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
          userId: user.value.id,
          currentDivision: user.value.currentDeletionDivider,
          userDetails: userDetails.value[0],
        },
      })
      selectedEmoji.value = '🕊'
      const res = await processResponse(JSON.parse(answer))
      let informalTranslatedMsg = convertToInformal(res.message)
      const newMsg = await saveMessage({
        user: user.value.id,
        role: 'assistant',
        time: new Date().toLocaleTimeString('fa'),
        content: JSON.parse(answer),
        contentFa: res,
        deletionDivider: user.value.currentDeletionDivider,
      })

      conversation.value.messages.push({
        id: newMsg.id,
        role: 'assistant',
        content: JSON.parse(answer),
        contentFa: res,
        time: new Date().toLocaleTimeString('fa'),
        isVoiceDone: false,
      })

      await nextTick()

      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }
      isTyping.value = false
      counter.value = 0
      timer.value = 120
      messageLoading.value = false
      await getVoice(conversation.value.messages.at(-1))
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
      await askForMana()
      // messageLoading.value = false
    }
  }
  else {
    setTimeout(() => {
      askForMana()
    }, 10000)
  }
}

const sleep = (time: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, time))
}
async function processResponse(answer: Record<string, any>): Promise<Record<string, any>> {
  // Creating an array to hold promises for each key-value pair that needs processing
  const promises = []
  const result: Record<string, any> = {}
  // Iterate over the keys in the answer object
  for (const key in answer) {
    if (typeof answer[key] === 'string') {
      // Create a promise to translate and assemble the string value
      const promise = translateAndAssemble(answer[key], 'English', 'Western Persian')
        .then((translatedValue) => {
          result[key] = translatedValue
        })
        .catch((error) => {
          console.error(`An error occurred during translation and assembly of ${key}:`, error)
          throw error
        })

      promises.push(promise)
    }
    else {
    // Directly assign non-string values to the result object
      result[key] = answer[key]
    }
  }

  try {
    // Wait for all promises to be resolved
    await Promise.all(promises)
    // Return an object with all processed parts
    return result
  }
  catch (error) {
    // Handle any errors that occur during the translation and assembly
    console.error('An error occurred during translation and assembly:', error)
    throw error
  }
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
const remainingTime = ref()
const timeToShow = ref()
let voice = ''

onMounted(async () => {
  voice = localStorage.getItem('voice') as string

  const local = localStorage.getItem('expanded')
  if (local === null) {
    localStorage.setItem('expanded', 'false')
    expanded.value = false
  }
  else {
    expanded.value = localStorage.getItem('expanded') == 'true'
  }
  // getGoals()
  const msg = await getMessages()
  msg.map(m => (m.time = new Date(m.created ?? '').toLocaleTimeString('fa')))
  msg.map(m => (m.isVoiceDone = true))
  conversation.value.messages.push(...msg)
  console.log('informals')

  conversation.value.messages.map((m) => {
    m.contentFa.message = convertToInformal(m.contentFa.message)
  })
  loading.value = false
  // await autoConversation()
  await sleep(200)
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
  remainingTime.value = new Date(u.expireChargeTime)
  startChargeTime.value = new Date(u.startChargeTime)
  timeToShow.value = Math.floor((remainingTime.value.getTime() - new Date().getTime()) / (1000 * 60))
  if (timeToShow.value <= 0) {
    pause()
  }
  setInterval(() => {
    timeToShow.value = timeToShow.value - 1
    // if (timeToShow.value == 10) {
    //   showTenMin.value = true
    //   conversation.value.messages.push({
    //     role: 'separator',
    //     content: { message: 'Summary and conclusion in the last ten minutes.' },
    //     contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
    //   })
    //   saveMessage({
    //     role: 'separator',
    //     content: { message: 'Summary and conclusion in the last ten minutes.' },
    //     contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
    //     user: user.value.id,
    //     deletionDivider: user.value.currentDeletionDivider,
    //   })
    // }
  }, 60000)
  if (nuxtApp.$pb.authStore.isValid) {
    nuxtApp.$pb.collection('users').subscribe(
      nuxtApp.$pb.authStore.model.id,
      (e) => {
        timeToShow.value = Math.floor((new Date(e.record.expireChangeTime).getTime() - new Date().getTime()) / (1000 * 60))
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
      {},
    )
  }
  userDetails.value = await getUserDetails(nuxtApp.$pb.authStore.model.id)
  console.log('userDetails.value')
  if (userDetails.value.length === 0) {
    navigateTo('/mana/initiation')
  }
  if (conversation.value.messages.length == 1) {
    timer.value = 3
    type.value = 'introduce'
    messageLoading.value = true
  }
  else {
    type.value = 'briefing'
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
//     user: user.value.id,
//     role: 'user',
//     // evaluations: JSON.parse(userEval),
//     evaluations: {},
//   })
//   const answer = await ask('Mana', m)
//   // const AIEval = await ask('SummaryJsonizer', translated.value)
//   const t2 = await translate(answer, 'English', 'Western Persian')
//   await saveMessage({
//     content: answer,
//     translatedFa: t2 as string,
//     user: user.value.id,
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

  // Join the translated chunks with a new line, ensuring each ends with proper punctuation
  return translatedChunksWithIndex
    .map((item) => {
      let { translatedChunk } = item
      // Check if the translated chunk ends with ., ,, !, or ?
      if (!/[.,!?؟]$/.test(translatedChunk.trim())) {
        translatedChunk += '.'
      }
      return translatedChunk
    })
    .join('\n')
}

async function submitMessage() {
  if (!message.value) return
  if (messageLoading.value) return
  const m = message.value
  message.value = ''
  const newMessage = {
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
  isNewMessagesDone.value = false
  const t = await translateAndAssemble(m, 'Western Persian', 'English')
  conversation.value.messages[
    conversation.value.messages.length - 1
  ].content.message = t

  const res = await saveMessage({
    role: 'user',
    content: { message: t },
    contentFa: { message: m },
    user: user.value.id,
    deletionDivider: user.value.currentDeletionDivider,
  })
  isNewMessagesDone.value = true
  newMessagesIndex.value++
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
  if (showNoCharge.value) {
    toaster.show({
      title: 'حذف پیام ها',
      message: `لطفا اشتراک تهیه کنید`,
      color: 'warning',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }
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
  // message.value = conversation.value.messages.at(-1)?.contentFa
  //   ?.message as string
  // conversation.value.messages.pop()
  isNewMessagesDone.value = true
  counter.value = timer.value
  await askForMana()
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
function resetReport() {
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
const checkForHalfTime = () => {
  const start = new Date(startChargeTime.value)
  const now = new Date()
  const temp = Math.floor((now.getTime() - start.getTime()) / 60000)

  return (temp / timeToShow.value > 1)
}
const fatBtn = () => {
  expanded.value = true
  localStorage.setItem('expanded', expanded.value + '')
  showDoneModal.value = true
}
const changeExpanded = () => {
  expanded.value = !expanded.value
  localStorage.setItem('expanded', expanded.value + '')
}
</script>

<template>
  <div class="relative max-h-screen overflow-hidden">
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
        <div class="ml-5 flex flex-row gap-x-2">
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
            <NuxtLink
              to="#"
              class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
              title="Settings"
            >
              <Icon name="ph:house-line" class="size-5" />
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
      class="flex min-h-screen bg-[url('../../img/back/pocket.png')] dark:bg-[url('../../img/back/back-dark.png')]"
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
                title="پاک کردن گفت و گو"
                class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
                @click="canDelete"
              >
                <Icon name="ph:arrow-clockwise" class="size-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to="/mana/"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="بازگشت به صفحه اصلی"
              >
                <Icon name="ph:house-line" class="size-5" />
              </NuxtLink>
            </div>
            <div class=" hidden h-16 w-full items-center justify-center md:flex">
              <button
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="نمایش اطلاعات"
                @click="changeExpanded()"
              >
                <Icon
                  name="ph:robot"
                  class="size-5"
                />
              </button>
            </div>
            <!-- <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to=""
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="Settings"
                @click="translateS2T"
              >
                <Icon name="ph:warning" class="size-5" />
              </NuxtLink>
            </div> -->

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
            ? 'ltablet:max-w-[calc(100%_-_80px)] lg:max-w-[calc(100%_-_80px)]'
            : 'ltablet:max-w-[calc(100%_-_380px)] lg:max-w-[calc(100%_-_470px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div
            class="flex h-16 w-full items-center justify-between gap-2 px-4 sm:px-8"
          >
            <div class="invisible flex items-center gap-2 sm:visible">
              <BaseInput
                v-model="search"
                shape="curved"
                icon="lucide:search"
                placeholder="جست و جو"
              />
            </div>

            <!-- <TairoSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            /> -->
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
                  title="ثبت و تکمیل"
                  :disabled="!checkForHalfTime || conversation.messages.length < 10"
                  @click="fatBtn()"
                >
                  <Icon
                    name="ph:check-fat"
                    class="size-5"
                  />
                </button>
              </div>
            </div>
          </div>
          <!-- Body -->
          <!-- HERE -->
          <div
            ref="chatEl"
            class="relative h-[calc(100vh_-193px)] w-full p-4 sm:h-[calc(100vh_-125px)] sm:p-8"
            :class="loading ? 'overflow-hidden' : 'overflow-y-auto nui-slimscroll'"
          >
            <!-- Loader-->
            <div
              class="pointer-events-none absolute inset-0 z-10 size-full bg-[url('../../img/back/back.png')] p-8 transition-opacity  duration-300 dark:bg-[url('../../img/back/back-dark.png')]"
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
              <BaseMessage color="info">
                اولین هدف برای هوش مصنوعی آشنایی بیشتر با شما تنظیم شده است.
                برخی از تغییرات در اهداف با شما به اشتراک گذاشته می شود.
              </BaseMessage>
              <div
                v-for="(item, index) in conversation?.messages"
                :key="index"
                class="relative flex w-full gap-4"
                style="margin-top: 10px;"
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
                      size="md"
                    />
                    <BaseAvatar
                      v-else-if="item.role === 'user'"
                      src="/img/avatars/user.png"
                      size="md"
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
                      <!-- <p class="whitespace-pre-line text-justify font-sans text-sm" v-html=" item?.role === 'assistant' ? item?.contentFa.empathy + '\n\n' + item?.contentFa.solutions + '\n\n' + item?.contentFa.investigating : item?.contentFa.message " /> -->
                      <p class="whitespace-pre-line text-justify font-sans text-sm" v-html="item.contentFa.message" />

                      <div
                        v-if="item.role === 'assistant'"
                        class="w-100 mt-2 flex flex-row-reverse"
                      >
                        <button
                          class="bg-primary-500 hover:bg-primary-700 mr-2 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                          :class="item.isVoiceDone? '' : 'animate-spin'"
                          @click="getVoice(item)"
                        >
                          <Icon :name="item.isVoiceDone? 'lucide:play' : 'lucide:loader-circle'" class="size-5" />
                        </button>
                        <div
                          v-if="
                            index == conversation?.messages.length - 1 &&
                              index != 1 && isTyping == false && showNoCharge == false
                          "
                          class="flex"
                        >
                          <button
                            class="bg-primary-500 hover:bg-primary-700 mx-2 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                            @click="resend()"
                          >
                            <Icon name="lucide:rotate-cw" class="size-5" />
                          </button>
                          <button
                            class="bg-warning-500 hover:bg-warning-700 flex size-9 items-center justify-center rounded-full text-white transition-colors duration-300"
                            @click="showReportModal = true"
                          >
                            <Icon name="lucide:shield-alert" class="size-5" />
                          </button>
                        </div>
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
                color="danger"
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
                  <BaseButton
                    v-if="conversation.messages.length > 10"
                    color="success"
                    class="my-3 mr-2 w-[150px]"

                    @click="showDoneModal = true"
                  >
                    ساخت گزارش
                  </BaseButton>
                </div>
              </BaseMessage>
            </div>
          </div>
          <!-- Compose -->
          <transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="transform opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="transform opacity-0"
          >
            <div v-show="isTyping" class="dark:bg-muted-700 absolute bottom-[110px] flex  w-full bg-gray-200 py-2 sm:bottom-[60px]  ">
              <div class="text-muted-800 mr-2 text-sm font-light dark:text-white">
                💻 مانا در حال نوشتن است <span class="typing" />
              </div>
            </div>
          </transition>
          <form
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-end px-4 pb-2 sm:px-8 md:items-center"
            @submit.prevent="submitMessage"
          >
            <div class="relative w-full">
              <BaseInput
                v-model="message"
                :loading="messageLoading"
                :disabled="messageLoading || showNoCharge"
                rounded="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="متن را بنویسید ..."
                autocomplete="off"
              />
              <!-- <div class="absolute end-2 top-0 flex h-12 items-center gap-1">
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
              </div> -->
            </div>
          </form>
        </div>
      </div>
      <!-- Current user -->
      <div
        class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300"
        :class="!expanded ? 'translate-x-0' : '-translate-x-full'"
      >
        <div
          class="flex h-16 w-full flex-row-reverse items-center justify-between px-8"
        >
          <BaseButtonIcon small @click="changeExpanded()">
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
              <div class="relative">
                <BaseAvatar :src="conversation?.user.photo" size="4xl" />
                <div class="absolute bottom-0 left-0 text-2xl">
                  {{ selectedEmoji }}
                </div>
              </div>
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
                  <span> درباره مانا، هوش مصنوعی </span>
                </BaseButton>

                <BaseMessage class="mt-5" color="info">
                  لطفا توجه داشته باشید که عامل هوش مصنوعی در فاز توسعه می‌‌باشد
                  و احتمال ارائه‌ی پاسخ‌های اشتباه را دارد.
                </BaseMessage>
                <BaseMessage class="mt-5" color="warning">
                  با مانا با ادبیاتی ساده صحبت کنید. او به شما گوش می کند و شما
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
    :open="showTenMin"
    size="sm"
    @close="showTenMin = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          به پایان گفت و گو نزدیک شده ایم
        </h3>

        <BaseButtonClose @click="showTenMin = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full text-center">
        <Icon
          name="ph:timer"
          class="mb-5 block size-[75px] text-yellow-500"
        />

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          ۱۰ دقیقه پایانی
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-justify text-sm leading-5"
        >
          به ده دقیقه پایانی صحبت نزدیک شده ایم. می توانید جلسه را پایان و چارچوب بندی کنید، یا به همین شکل ادامه بدهید. البته بدانید که هر موقع بخواهید می توانید اشتراک تهیه کرده و صحبت را ادامه بدهید.
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showTenMin = false">
            ادامه می دم
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            :loading="isGoingToDone"
            @click="goToDoneAndEnd"
          >
            چارچوب بندی و پایان
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <TairoModal
    :open="showDoneModal"
    size="md"
    @close="showDoneModal = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          پایان گفت و گو و ساخت گزارش
        </h3>

        <BaseButtonClose @click="showDoneModal = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full text-center">
        <Icon
          name="ph:clipboard"
          class="text-success-500 mb-5 block size-[75px]"
        />

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          پایان گفت و گو و ساخت گزارش
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-justify text-sm leading-5"
        >
          با انتخاب گزینه ی ساخت گزارش، این جلسه به پایان خواهد رسید. شما به صفحه ی ارائه گزارش جلسه جا به جا خواهید شد و امکان بازگشت و ویرایش این گفت و گو را نخواهید داشت.
        </p>
        <div v-if="!checkForHalfTime() && !timeToShow" class="text-danger-500 mt-3">
          حداقل نیمی از زمان جلسه باید گذشته باشد
        </div>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showDoneModal = false">
            ادامه می دم
          </BaseButton>

          <BaseButton
            color="success"
            variant="solid"
            :loading="isRequestForReport"
            :disabled="!checkForHalfTime || conversation.messages.length < 10"
            @click="requestForReport"
          >
            ساخت گزارش
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

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
            @click.prevent="resetReport"
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
        <div class="mt-5 h-[180px] w-full overflow-auto pl-5">
          <form class="mx-auto w-full">
            <fieldset class="w-full space-y-6">
              <div class="grid gap-6 sm:grid-cols-1">
                <BaseCheckboxHeadless
                  v-for="r in reportChoices"
                  :key="r"
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
  <!-- <TairoModal
    :open="showWelcome"
    size="sm"
    @close="showWelcome = false"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          مانا یک طرح اولیه دانش بنیان است
        </h3>

        <BaseButtonClose @click="showTenMin = false" />
      </div>
    </template>

    <div class="p-4 md:p-6">
      <div class="mx-auto w-full text-center">
        <Icon
          name="ph:brain"
          class="mb-5 block size-[75px] text-green-500"
        />

        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          مانا، اولین هوش مصنوعی در حوزه ی انسانی است که برای کمک به انسان ها در بحران ها و تنهایی های زندگی طراحی شده است. او تلاش می کند تا شما را بشناسد و همدلی و کمک ارائه نماید.
          با این حال، مانا یک طرح اولیه دانش بنیان است و بخش هایی دارد که باید تکمیل شوند. برای این منظور و برای این که بهتر بتوانید از نرم افزار استفاده کنید، موارد زیر را در نظر داشته باشید:
        </h3>
        <ul>
          <li>از معادل های ساده استفاده کنید. از استعاره، ترکیبات مبهم و واژگان دارای چند معنی است، استفاده نکنید.</li>
          <li>از معادل های ساده استفاده کنید. از استعاره، ترکیبات مبهم و واژگان دارای چند معنی است، استفاده نکنید.</li>
          <li>از معادل های ساده استفاده کنید. از استعاره، ترکیبات مبهم و واژگان دارای چند معنی است، استفاده نکنید.</li>
        </ul>
        انتخاب صدا
        مردانه
        زنانه
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showTenMin = false">
            ادامه می دم
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            :loading="isGoingToDone"
            @click="goToDoneAndEnd"
          >
            چارچوب بندی و پایان
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal> -->
</template>
<style>
@keyframes dots {
  0%, 10% {
      content: '';
  }
  20%, 30% {
      content: '.';
  }
  40%, 50% {
      content: '..';
  }
  60%, 70% {
      content: '...';
  }
  80% {
      content: '..';
  }
  90% {
      content: '.';
  }
  100% {
      content: '';
  }
}
.typing::after {
  content: '';
  animation: dots 2s steps(1, end) infinite;
}
</style>
