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
const { user, incDivision, getUserDetails } = useUser()
const userDetails = ref()
const seamless = useSeamless()

const { translate } = seamless
const { getMessages, saveMessage, deleteAllMessages, deleteMessage, addEditToMessage }
  = useMessage()

const { saveSuggest, getLastSuggestion }
  = useSuggestion()

const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(true)
const isTyping = ref(false)
const isNewMessagesDone = ref(true)
const newMessagesIndex = ref(0)
const showDoneModal = ref(false)
const startChargeTime = ref()
const suggestionLoading = ref(true)
const askForPatient = async () => {
  suggestionLoading.value = true
  if (isNewMessagesDone.value) {
    isTyping.value = true
    try {
      let sendToLLM = combineMessages(conversation.value.messages, 'user')
      const answer = await $fetch('/api/user', {
        method: 'POST',
        body: {
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
          userId: user.value.record.id,
          currentDivision: user.value.record.currentDeletionDivider,
          userDetails: userDetails.value[0],
        },
      })
      const res = await processResponse(JSON.parse(answer))
      let informalTranslatedMsg = convertToInformal(res.message)

      const newMsg = await saveMessage({
        role: 'user',
        user: user.value.record.id,
        time: new Date().toLocaleTimeString('fa'),
        content: JSON.parse(answer),
        contentFa: res,
        deletionDivider: user.value.record.currentDeletionDivider,
      })

      conversation.value.messages.push({
        id: newMsg.id,
        role: 'user',
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
      isNewMessagesDone.value = true
      // getVoice(conversation.value.messages.at(-1))
      await askForMana()
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
      await askForPatient()
    }
  }
}

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
      selectedByTherapist.value = []
      let sendToLLM = combineMessages(conversation.value.messages, 'user')
      const answer = await $fetch('/api/therapist', {
        method: 'POST',
        body: {
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
          userId: user.value.record.id,
          currentDivision: user.value.record.currentDeletionDivider,
          userDetails: userDetails.value[0],
        },
      })
      const res = await processArrayWithTranslatedTitlesAndValues(JSON.parse(answer))
      const msgId = conversation.value.messages.at(-1).id
      const uId = user.value.record.id
      sgg.value = await saveSuggest({ message: msgId, user: uId, suggestions: JSON.parse(answer), suggestionsFa: res })
      sggList.value = []
      sgg.value.suggestionsFa.map((s, i) => {
        if (Array.isArray(s.value)) {
          s.value.forEach((element, index) => {
            sggList.value.push ({ title: s.title, value: element })
            sggList.value.at(-1).valueEn = sgg.value.suggestions[i].value[index]
          })
        }
        else {
          sggList.value.push ({ title: s.title, value: s.value, valueEn: sgg.value.suggestions[i].value })
        }
      })
      conversation.value.messages.push({ role: 'assistant', content: { message: '' }, contentFa: { message: 'از پنل پایین انتخاب نمایید' }, correctedContentFa: null })
      await nextTick()

      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }

      suggestionLoading.value = false
    }
    catch (e) {
      console.log('here')
      console.log(e)
      // toaster.show({
      //   title: 'دریافت پیام', // Authentication
      //   message: `مشکلی وجود دارد`, // Please log in again
      //   color: 'danger',
      //   icon: 'ph:envelope',
      //   closable: true,
      // })
      await askForMana()
      // messageLoading.value = false
    }
  }
  else {
    setTimeout(() => {
      // askForMana()
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
async function processArrayWithTranslatedTitlesAndValues(inputArray: Array<Record<string, any>>): Promise<Array<Record<string, any>>> {
  // Create an array to hold promises for each item in the input array
  const promises = inputArray.map(async (item) => {
    const translatedItem: Record<string, any> = {}

    // Translate the 'title'
    const translatedTitle = await translateAndAssemble(item.title, 'English', 'Western Persian')
      .catch((error) => {
        console.error(`An error occurred during translation of title: ${item.title}`, error)
        throw error
      })

    translatedItem.title = translatedTitle

    // Check if 'value' is a string or an array of strings, then translate accordingly
    if (typeof item.value === 'string') {
      // Translate a single string value
      translatedItem.value = await translateAndAssemble(item.value, 'English', 'Western Persian')
        .catch((error) => {
          console.error(`An error occurred during translation of value: ${item.value}`, error)
          throw error
        })
    }
    else if (Array.isArray(item.value) && item.value.every(val => typeof val === 'string')) {
      // Translate an array of string values
      translatedItem.value = await Promise.all(
        item.value.map(val => translateAndAssemble(val, 'English', 'Western Persian')),
      ).catch((error) => {
        console.error(`An error occurred during translation of value array: ${item.value}`, error)
        throw error
      })
    }
    else {
      // Assign non-string or non-array-of-string values directly
      translatedItem.value = item.value
    }

    return translatedItem
  })

  try {
    // Wait for all promises to be resolved and return the array of translated items
    return await Promise.all(promises)
  }
  catch (error) {
    console.error('An error occurred during the translation process:', error)
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
const expandForm = ref(false)
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
  const msg = await getMessages()
  msg.map(m => (m.time = new Date(m.created ?? '').toLocaleTimeString('fa')))
  msg.map(m => (m.isVoiceDone = true))
  conversation.value.messages.push(...msg)
  conversation.value.messages.map((m) => {
    m.contentFa.message = convertToInformal(m.contentFa.message)
  })
  loading.value = false
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
  setInterval(() => {
    timeToShow.value = timeToShow.value - 1
    // if (timeToShow.value == 10) {
    //   showEditModal.value = true
    //   conversation.value.messages.push({
    //     role: 'separator',
    //     content: { message: 'Summary and conclusion in the last ten minutes.' },
    //     contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
    //   })
    //   saveMessage({
    //     role: 'separator',
    //     content: { message: 'Summary and conclusion in the last ten minutes.' },
    //     contentFa: { message: 'جمع بندی برای ده دقیقه پایانی' },
    //     user: user.value.record.id,
    //     deletionDivider: user.value.record.currentDeletionDivider,
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
          // pause()
        }
      },
      {},
    )
  }
  // TODO: IMPLEMENT A SYSTEM FOR AI PATIENTS TO ROLE PLAY AND READ THEM FROM HERE
  userDetails.value = await getUserDetails('dldw6y1ueeqmcft')
  if (conversation.value.messages.at(-1)?.role == 'assistant' || conversation.value.messages.length == 1 && showNoCharge.value == false) {
    await askForPatient()
  }
  else {
    sgg.value = await getLastSuggestion(conversation.value.messages.at(-1).id)

    if (sgg.value) {
      sgg.value.suggestionsFa.map((s, i) => {
        if (Array.isArray(s.value)) {
          s.value.forEach((element, index) => {
            sggList.value.push ({ title: s.title, value: element })
            sggList.value.at(-1).valueEn = sgg.value.suggestions[i].value[index]
          })
        }
        else {
          sggList.value.push ({ title: s.title, value: s.value, valueEn: sgg.value.suggestions[i].value })
        }
      })
      conversation.value.messages.push({ role: 'assistant', content: { message: '' }, contentFa: { message: 'از پنل پایین انتخاب نمایید' }, correctedContentFa: null })
      suggestionLoading.value = false
    }
    else {
      await askForMana()
    }
  }
})
const sgg = ref()
const sggList = ref([])
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

  await saveMessage({
    role: 'user',
    content: { message: t },
    contentFa: { message: m },
    user: user.value.record.id,
    deletionDivider: user.value.record.currentDeletionDivider,
  })
  isNewMessagesDone.value = true
  newMessagesIndex.value++
}
const showDeleteModal = ref(false)

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
const resend = async () => {
  toaster.show({
    title: 'باز ارسال آخرین پیام',
    message: `آخرین پیام عامل هوش مصنوعی حذف و پیام جدیدی ارسال خواهد شد`,
    color: 'warning',
    icon: 'lucide:rotate-cw',
    closable: true,
  })
  isTyping.value = true
  conversation.value.messages.pop()
  await deleteMessage(conversation.value.messages.at(-1).id)
  conversation.value.messages.pop()
  isNewMessagesDone.value = true
  await askForPatient()
}
const changeExpanded = () => {
  expanded.value = !expanded.value
  localStorage.setItem('expanded', expanded.value + '')
}
const selectedByTherapist = ref([])
const submitLoading = ref(false)
const submitTherapist = async () => {
  if (conversation.value.messages.at(-1).contentFa.message === 'از پنل پایین انتخاب نمایید') {
    toaster.show({
      title: 'ثبت',
      message: `ابتدا موارد را انتخاب نمایید`,
      color: 'warning',
      icon: 'ph:pencil',
      closable: true,
    })
    return
  }
  submitLoading.value = true
  const newMsg = await saveMessage({
    user: user.value.record.id,
    role: 'assistant',
    time: new Date().toLocaleTimeString('fa'),
    content: conversation.value.messages.at(-1).content,
    contentFa: conversation.value.messages.at(-1)?.contentFa,
    correctedContentFa: conversation.value.messages.at(-1)?.correctedContentFa,
    deletionDivider: user.value.record.currentDeletionDivider,
  })
  conversation.value.messages.at(-1).id = newMsg.id
  conversation.value.messages.at(-1).role = 'assistant'
  conversation.value.messages.at(-1).time = new Date().toLocaleTimeString('fa')
  conversation.value.messages.at(-1).isVoiceDone = false

  await nextTick()

  if (chatEl.value) {
    chatEl.value.scrollTo({
      top: chatEl.value.scrollHeight,
      behavior: 'smooth',
    })
  }

  await askForPatient()
  submitLoading.value = false
}
const submitEdit = ref(false)
const showEditModal = ref(false)
const selectedForEdit = ref()
const selectionType = ref('sentences')
const openEditModal = async (text, index) => {
  if (text.contentFa.message === 'از پنل پایین انتخاب نمایید') {
    toaster.show({
      title: 'ویرایش',
      message: `ابتدا موارد را انتخاب نمایید`,
      color: 'warning',
      icon: 'ph:pencil',
      closable: true,
    })
    return
  }

  showEditModal.value = true
  selectedForEdit.value = text
  selectedForEdit.value.index = index
  if (selectionType.value === 'words') {
    selectedForEdit.value.sliced = selectedForEdit.value.contentFa.message.match(/[\p{L}\p{M}\p{N}_']+|[^\s\p{L}\p{M}\p{N}_]+/gu)
  }
  else {
    const segmenter = new Intl.Segmenter('fa', { granularity: 'sentence' })
    const sentences = []

    for (const { segment } of segmenter.segment(selectedForEdit.value.contentFa.message)) {
      sentences.push(segment.trim())
    }

    selectedForEdit.value.sliced = sentences
    const segmenterEn = new Intl.Segmenter('en', { granularity: 'sentence' })
    const sentencesEn = []

    for (const { segment } of segmenterEn.segment(selectedForEdit.value.content.message)) {
      sentencesEn.push(segment.trim())
    }
    selectedForEdit.value.slicedEn = sentencesEn
  }
}
const submitEditFinal = async () => {
  if (editedText.value != '') {
    alert('لطفا تغییرات را ثبت و سپس ثبت نهایی کنید')
    return
  }
  submitEdit.value = true
  await sleep(2000)
  submitEdit.value = false
  showEditModal.value = false
  if (conversation.value.messages.at(-1)?.role == 'user') {
    await addEditToMessage(selectedForEdit.value)
  }
  conversation.value.messages.at(selectedForEdit.value.index).correctedContentFa = selectedForEdit.value.sliced.join('\n')
  toaster.show({
    title: 'ثبت تغییرات',
    message: `تغییرات با موفقیت ثبت شد`,
    color: 'success',
    icon: 'ph:check',
    closable: true,
  })
}
watch(selectionType, () => {
  openEditModal(selectedForEdit.value)
})
const selectedForEditIndex = ref ()
const updateSelectedIndex = async (i) => {
  if (i !== -1 && !editedText.value) {
    selectedForEditIndex.value = i
  }
}
const editedTextIndex = ref(-1)
const clickedOnText = (i) => {
  if (editedText.value) {
    errorText.value = 'تغییرات را ذخیره نمایید.'
    errorTextColor.value = 'danger'
    setTimeout(() => {
      errorText.value = ''
      errorTextColor.value = ''
    }, 2000)
    return
  }
  editedTextIndex.value = i
  editedText.value = selectedForEdit.value.sliced[i]
  // errorText.value = 'تغییرات را ذخیره نمایید یا متن را بازنشانی فرمایید.'
}
const editedText = ref()
const errorText = ref()
const errorTextColor = ref()

watch(editedText, () => {

})
const updateEditedToNew = () => {
  selectedForEdit.value.sliced[selectedForEditIndex.value] = editedText.value
  errorText.value = 'جمله ثبت شد'
  errorTextColor.value = 'success'
  setTimeout(() => {
    errorText.value = ''
    errorTextColor.value = ''
    editedText.value = ''
  }, 1000)
}
watch(selectedByTherapist, (n) => {
  if (conversation.value.messages.at(-1).role === 'assistant') {
    let temp = selectedByTherapist.value.map(s => s.value).join(' ')
    let tempEn = selectedByTherapist.value.map(s => s.valueEn).join(' ')

    if (temp == '') {
      temp = 'از پنل پایین انتخاب نمایید'
    }
    conversation.value.messages.at(-1).contentFa.message = temp
    conversation.value.messages.at(-1).content.message = tempEn
  }
})
const expandFormFn = async () => {
  expandForm.value = !expandForm.value
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
              @click="deleteAll"
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
      class="flex min-h-screen bg-[url('../../img/back/back.png')] dark:bg-[url('../../img/back/back-dark.png')]"
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
                @click="deleteAll"
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
                کد خود را وارد نمایید
                <BaseButtonIcon
                  rounded="full"
                  size="sm"
                  color="success"
                  class="mr-3"
                  to="/onboarding"
                >
                  <Icon name="ph:tag" class="size-5" />
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
          <!-- HERE -->
          <div
            ref="chatEl"
            class="relative h-[calc(100vh_-193px)] w-full p-4 sm:h-[calc(100vh_-330px)] sm:p-8"
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
              <div>
                <BaseMessage color="info">
                  پس از دریافت پیام مراجع، از لیست ارائه شده موارد را انتخاب و دکمه ی ثبت را فشار دهید. سپس منتظر پیام بعدی مراجع باشید.
                </BaseMessage>
                <BaseMessage color="warning" class="mt-3">
                  لطفا توجه داشته باشید که کاربر از اسم مانا به عنوان روانشناس یاد می کند، نه از نامی که شما به عنوان کاربر وارد کرده اید.
                </BaseMessage>
              </div>
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
                      src="/img/avatars/tara.webp"
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
                      <p class="whitespace-pre-line text-justify font-sans text-sm" v-html="item.correctedContentFa ?? item.contentFa.message" />
                      <div
                        v-if="item.role === 'user' && index +2 === conversation.messages.length "
                        class="w-100 mt-2 flex flex-row-reverse"
                      >
                        <div
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
                            @click="openEditModal(item, index)"
                          >
                            <Icon name="ph:pencil" class="size-5" />
                          </button>
                        </div>
                      </div>
                      <div
                        v-if="item.role === 'assistant' && !showNoCharge && index +1 === conversation.messages.length"
                        class="w-100 mt-2 flex flex-row-reverse"
                      >
                        <div
                          class="flex gap-2"
                        >
                          <BaseButtonIcon
                            rounded="full"
                            color="warning"
                            :loading="submitLoading || suggestionLoading"
                            @click="openEditModal(item, index)"
                          >
                            <Icon name="ph:pencil" class="size-5" />
                          </BaseButtonIcon>
                          <BaseButtonIcon
                            type="reset"
                            rounded="full"
                            color="success"
                            :loading="submitLoading || suggestionLoading"
                            @click.prevent="submitTherapist"
                          >
                            <Icon name="ph:check" class="size-5" />
                          </BaseButtonIcon>
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
                    برای شروع گفت و گو لازم است کد خود را وارد نمایید.
                  </div>
                  <BaseButton
                    color="primary"
                    class="my-3 mr-2 w-[150px]"
                    to="/onboarding"
                  >
                    ورود کد
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
            <div v-show="isTyping" class="dark:bg-muted-700 absolute bottom-3 flex  w-full bg-gray-200 py-2">
              <div class="text-muted-800 mr-2 text-sm font-light dark:text-white">
                💻 کاربر در حال نوشتن است <span class="typing" />
              </div>
            </div>
          </transition>
          <form
            v-show="!isTyping"
            class="bg-muted-100 dark:bg-muted-900 flex w-full items-end px-2 pb-2 sm:px-2 md:items-center"
            :class="expandForm ? 'special-exapnd': ''"
            @submit.prevent="submitMessage"
          >
            <BaseCard class="p-3" :style="expandForm? 'height:98vh' : ''">
              <div class="w-full">
                <form class="mx-auto w-full">
                  <fieldset class="w-full space-y-6">
                    <div
                      class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b pb-4"
                    >
                      <legend class="text-muted-800 dark:text-muted-100 font-sans text-xl font-medium">
                        پیشنهادات هوش مصنوعی
                      </legend>
                      <div class="flex gap-2">
                        <BaseButtonIcon
                          type="reset"
                          rounded="full"
                          color="primary"
                          :loading="submitLoading || suggestionLoading"
                          @click.prevent="expandFormFn"
                        >
                          <Icon :name="expandForm? 'ph:arrows-in': 'ph:arrows-out'" class="size-5" />
                        </BaseButtonIcon>
                      </div>
                    </div>
                    <div
                      class="overflow-auto"
                      :class="expandForm? 'h-[500px]':'h-[150px]'"
                    >
                      <div
                        v-if="suggestionLoading"
                        class="flex items-center "
                      >
                        <div class="grow space-y-2">
                          <BasePlaceload class="h-3 w-4/5 rounded-lg" />
                          <BasePlaceload class="h-3 w-3/5 rounded-lg" />
                        </div>
                        <div class="grow space-y-2">
                          <BasePlaceload class="h-3 w-4/5 rounded-lg" />
                          <BasePlaceload class="h-3 w-3/5 rounded-lg" />
                        </div>
                        <div class="grow space-y-2">
                          <BasePlaceload class="h-3 w-4/5 rounded-lg" />
                          <BasePlaceload class="h-3 w-3/5 rounded-lg" />
                        </div>
                      </div>
                      <div
                        v-else
                        class="grid gap-x-3 gap-y-2 overflow-auto sm:grid-cols-2"
                        :class="expandForm? 'h-[500px]':'h-[150px]'"
                      >
                        <BaseCheckboxHeadless
                          v-for="(s,i) in sggList"
                          :key="i"
                          v-model="selectedByTherapist"
                          :value="s"
                        >
                          <BaseCard
                            rounded="sm"
                            class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                          >
                            <div class="flex w-full items-center gap-2">
                              <div>
                                <BaseHeading
                                  as="h4"
                                  size="sm"
                                  weight="medium"
                                  lead="none"
                                >
                                  {{ s.title }}
                                </BaseHeading>

                                <BaseText size="xs" class="text-muted-400">
                                  {{ s.value }}
                                </BaseText>
                              </div>

                              <div class="child text-muted-300 ms-auto">
                                <div class="size-3 rounded-full bg-current" />
                              </div>
                            </div>
                          </BaseCard>
                        </BaseCheckboxHeadless>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </BaseCard>
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
    :open="showEditModal"
    size="3xl"
    @close="showEditModal = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          ثبت بهبود
        </h3>

        <BaseButtonClose @click="showEditModal = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto max-h-[400px] w-full overflow-y-auto text-center">
        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          تصحیح ترجمه یا بهبود معنا
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-justify text-sm leading-5"
        >
          با استفاده از پنل زیر می توانید پیام را ویرایش نمایید. می توانید جمله را به صورت کامل انتخاب کنید و تغییرات را جمله به جمله اعمال کنید یا اگر تغییرات محدود به چند کلمه است، آن ها را انتخاب و ویرایش نمایید.
        </p>
        <div class="mt-4 grid grid-cols-2 gap-6 md:max-w-lg">
          <BaseRadio
            v-model="selectionType"
            name="checkbox_base"
            value="sentences"
            label="انتخاب جمله"
            color="primary"
          />
          <BaseRadio
            v-model="selectionType2"
            name="checkbox_base"
            label="انتخاب کلمات (بزودی)"
            value="words"
            color="primary"
          />
        </div>
        <div class="grid grid-cols-2 gap-1">
          <div class="mt-2 text-justify">
            <Legend>متن انگلیسی</Legend>
            <BaseMessage dir="ltr" class="flex-col text-left">
              <div>
                <div
                  v-for="(s, i) in selectedForEdit.slicedEn"
                  :key="i"
                  class=" my-3 flex w-fit"
                  :class="selectedForEditIndex === i ? 'selectedEn': ''"
                >
                  {{ s }}
                </div>
              </div>
            </BaseMessage>
          </div>
          <div class="mt-2 text-justify">
            <Legend>متن فارسی</Legend>
            <BaseMessage>
              <div v-if="selectionType === 'words'" class="flex flex-wrap">
                <span
                  v-for="(s, i) in selectedForEdit.sliced"
                  :key="i"
                  class="elemental my-3 cursor-pointer"
                  :class="selectedForEditIndex === i ? 'selectedFa': ''"
                > {{ s }}</span>
              </div>
              <div v-if="selectionType === 'sentences'">
                <div
                  v-for="(s, i) in selectedForEdit.sliced"
                  :key="i"
                  class="elemental my-3 flex w-fit cursor-pointer"
                  :class="selectedForEditIndex === i ? 'selectedFa': ''"
                  @mouseenter="updateSelectedIndex(i)"
                  @mouseleave="updateSelectedIndex(-1)"
                  @click="clickedOnText(i)"
                >
                  {{ s }}
                </div>
              </div>
            </BaseMessage>
          </div>
        </div>
        <div class="mt-2 text-justify">
          <Legend>تغییرات</Legend>
          <BaseTextarea
            v-model="editedText"
            rounded="md"
            placeholder="جمله را از بالا انتخاب نمایید . . . "
            :rows="2"
            class="mt-2"
            addon
          >
            <template #addon>
              <div class="flex items-center gap-2">
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  <div :class="errorTextColor === 'danger'? 'text-danger-500' : 'text-success-500'">
                    {{ errorText }}
                  </div>
                </BaseHeading>
              </div>

              <div class="flex items-center gap-2">
                <BaseButton
                  color="primary"
                  size="sm"
                  @click="updateEditedToNew"
                >
                  ثبت
                </BaseButton>
              </div>
            </template>
          </BaseTextarea>
        </div>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showEditModal = false">
            بازگشت
          </BaseButton>

          <BaseButton
            color="warning"
            variant="solid"
            :loading="submitEdit"
            @click="submitEditFinal"
          >
            ثبت نهایی
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
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
.elemental{
  padding: 3px;
}
.selectedFa{
  background-color: aqua;
  border-radius: 5px;
}
.selectedEn {
  background-color:greenyellow;
  border-radius: 5px;
}
.special-exapnd{
  position: absolute;
    height: 100vh;
    z-index: 100;
}
</style>
