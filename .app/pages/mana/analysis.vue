<script setup lang="ts">
import 'v-calendar/dist/style.css'
import '~/assets/css/vcalendar.css'
// import { AgentTask } from '~/composables/crew'
// import { BackendMessage } from '~/composables/message'
import Slider from '@vueform/slider'
import '~/assets/css/slider.css'

const trustLevel = ref(75)

// Function to format the slider value as an emoji
const formatEmoji = (trustLevel: number): string => {
  if (trustLevel >= 80) return '😍' // Heart eyes for 100
  if (trustLevel >= 60) return '😊' // Happy face for 80 to 99
  if (trustLevel >= 25) return '😐' // Stoic face for 50 to 79
  return '😠' // Angry face for 0 to 49
}
definePageMeta({
  title: 'پردازش داده',
  layout: 'sidebar',
  preview: {
    title: 'داشبورد مانا',
    description: 'بررسی جزییات پیام ها',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-health.png',
    srcDark: '/img/screens/dashboards-health-dark.png',
    order: 17,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const suicideRiskCondition = reactive(useSuicideRiskCondition())
const scatterEnergy = reactive(useScatterEnergy())
const barOxygen = reactive(useBarOxygen())
const areaProgress = reactive(useAreaProgress())
const gaugePersonal = reactive(useGaugePersonal())

const {
  getMessagesByCode,
  saveSummerizedMessages,
  getSummerizedMessagesByCode,
} = useMessage()
const route = useRoute()
const { translate } = useSeamless()
const { agentAction } = useCrew()
// const { ask } = useLLM()
const { ask } = useOllama()
const nuxtApp = useNuxtApp()
const msgs = ref([])
const userSum = ref([])
const headlines = ref([
  {
    nameFa: "شکایت اصلی",
    valueFa: "مشکلات خانوادگی",
    descriptionFa: "مریم با خانواده و بالاخص مادرش مشکل دارد. از نوجوانی این فاصله زیاد شده و الان تشدید شده است."
  },
  {
    nameFa: "نشانگان",
    valueFa: "افسردگی",
    descriptionFa: "مریم از خود نشگان قدرتمندی از افسردگی با ریشه هایی از اختلال شخصیت نشان می دهد."
  },
  {
    nameFa: "بنیاد شخصیت",
    valueFa: "رشد یافته",
    descriptionFa: "از لحاظ تحولی شخصیت مریم رشد یافته است. او از مکانیزم های دفاعی سطح بالا استفاده می کند."
  },
  {
    nameFa: "خطر خودکشی",
    valueFa: "پایین",
    descriptionFa: "مریم صریحا اعلام کرده که به خودکشی فکر نمی کند و این یک پیش آگهی خوب است."
  }
])
onMounted(async () => {
  // userSum.value = await getSummerizedMessagesByCode(route.query.code as string)
  // msgs.value = await getMessagesByCode(route.query.code as string)
  // await getHeadlines()
  // msgs.value.map((m) => {
  //   if (m.role === 'user') {
  //     let label = 0
  //     const temp = m.evaluations.SuicideRiskEvaluation.toLowerCase()
  //       .replace(' ', '')
  //       .replace('.', '')
  //       .replace('\n', '')
  //     if (temp == 'verylow') {
  //       label = 0
  //     } else if (temp == 'low') {
  //       label = 1
  //     } else if (temp == 'medium') {
  //       label = 2
  //     } else if (temp == 'high') {
  //       label = 3
  //     } else if (temp == 'veryhigh') {
  //       label = 4
  //     }
  //     suicideRiskCondition.series[0].data.push(label)
  //     suicideRiskCondition.options.xaxis.categories.push(
  //       new Date(m.created).toLocaleTimeString('fa'),
  //     )
  //   }
  // })
})

function useSuicideRiskCondition() {
  const { primary } = useTailwindColors()
  const type = 'area'
  const height = 280

  const options = {
    chart: {
      offsetX: -20,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    colors: [primary.value],
    xaxis: {
      categories: [],
    },

    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5, // Since you have 4 categories (0-3), you need 3 ticks
      labels: {
        offsetX: -20,
        offsetY: -10,
        formatter: function (val) {
          const categories = ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد']
          return categories[val] // Return the category based on the numerical index
        },
      },
    },
    legend: {
      horizontalAlign: 'left',
    },
  }

  const series = ref([
    {
      name: 'ریسک خودکشی',
      data: [],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}
function useScatterEnergy() {
  const { primary, info, success } = useTailwindColors()
  const height = 280
  const type = 'scatter'

  const options = {
    chart: {
      height: 280,
      type: 'scatter',
      zoom: {
        type: 'xy',
      },
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value, info.value],
    dataLabels: {
      enabled: false,
      show: false,
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      show: false,
      type: 'datetime',
    },
    yaxis: {
      show: false,
      max: 70,
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'center',
    },
  }

  const series = ref([
    {
      name: 'Tonic',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        20,
        {
          min: 10,
          max: 60,
        },
      ),
    },
    {
      name: 'Tantra',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        20,
        {
          min: 10,
          max: 60,
        },
      ),
    },
    {
      name: 'Vital',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        30,
        {
          min: 10,
          max: 60,
        },
      ),
    },
  ])

  function generateDayWiseTimeSeries(
    baseval: number,
    count: number,
    yrange: { min: number; max: number },
  ) {
    let i = 0
    const series = []
    while (i < count) {
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

      series.push([baseval, y])
      baseval += 86400000
      i++
    }
    return series
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useBarOxygen() {
  const { primary } = useTailwindColors()
  const height = 280
  const type = 'bar'

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: asPercent,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: asPercent,
      },
    },
    colors: [primary.value],
  }

  const series = ref([
    {
      name: 'Variation (pt)',
      data: [23, 26, 10, 7, 11, 18, 16],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

function useAreaProgress() {
  const { primary } = useTailwindColors()
  const type = 'area'
  const height = 280

  const options = {
    chart: {
      offsetX: 20,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    colors: [primary.value],
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: 'left',
    },
  } as const

  const series = ref([
    {
      name: 'Progress (pt)',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

function useGaugePersonal() {
  const { primary } = useTailwindColors()
  const type = 'radialBar'
  const height = 220

  const options = {
    title: {
      text: undefined,
    },
    chart: {
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        hollow: {
          margin: 0,
          size: '35%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['Average Results'],
  }

  const series = ref([76])

  return {
    type,
    height,
    options,
    series,
  }
}
const isLoading = ref(false)
const generateUserSummary = async () => {
  isLoading.value = true
  const userMsgs = (await getMessagesByCode(route.query.code as string))
    .map((item: BackendMessage) => (item.role === 'user' ? item : undefined))
    .filter(Boolean)
  let combinedJson = {}

  userMsgs.forEach((item) => {
    combinedJson = { ...combinedJson, ...item.evaluations }
  })

  const res = await ask(
    'PatientSummerizer',
    userMsgs
      .map((item) => item?.content)
      .join('|')
      .replace('\n', ''),
  )
  const resFa = await translate(res, 'English', 'Western Persian')
  const save = await saveSummerizedMessages({
    messages: userMsgs.map((msg) => msg.id),
    anonymousUser: userMsgs[0].anonymousUser,
    summaryEn: res,
    summaryFa: resFa,
    type: 'user',
  })
  userSum.value = [save]
  isLoading.value = false
}
const genereateRisks = async () => {
  isLoading.value = true
  suicideRiskCondition.series[0].data = []
  suicideRiskCondition.options.xaxis.categories = []

  await analyzeAllMessages('SuicideRiskEvaluation')
  isLoading.value = false
}
async function analyzeAllMessages(analyze: AgentTask) {
  const userMsgs = (await getMessagesByCode(route.query.code as string))
    .map((item: BackendMessage) => (item.role === 'user' ? item : undefined))
    .filter(Boolean)

  for (let i = 0; i < userMsgs.length; i++) {
    let retryCounter = 0
    let maxRetries = 10
    while (retryCounter < maxRetries) {
      const currentMessage = userMsgs[i]
      const res = await ask('SuicideRiskEvaluation', currentMessage.content)

      if (res.length > 30) {
        console.log('There is perhaps an error, retrying...')
        retryCounter++
        continue
      } else {
        retryCounter = maxRetries
        const updatedEvaluations = {
          ...(userMsgs[i]?.evaluations ?? {}),
          [analyze]: res,
        }

        const updatedMessage = {
          ...userMsgs[i],
          evaluations: updatedEvaluations,
        }

        const m = await nuxtApp.$pb
          .collection('messages')
          .update(userMsgs[i].id, updatedMessage)
        console.log('analyze')
        console.log(analyze)

        if (analyze === 'SuicideRiskEvaluation') {
          let label = 0
          const temp = m.evaluations.SuicideRiskEvaluation.toLowerCase()
            .replace(' ', '')
            .replace('.', '')
            .replace('\n', '')
          if (temp == 'verylow') {
            label = 0
          } else if (temp == 'low') {
            label = 1
          } else if (temp == 'medium') {
            label = 2
          } else if (temp == 'high') {
            label = 3
          } else if (temp == 'veryhigh') {
            label = 4
          }
          console.log(label)

          suicideRiskCondition.series[0].data.push(label)
          suicideRiskCondition.options.xaxis.categories.push(
            new Date(m.created).toLocaleTimeString('fa'),
          )
        }
      }
    }
  }
}
async function generatingHeadlines() {
  let wholeEvals = {}
  const userMsgs = (await getMessagesByCode(route.query.code as string))
    .map((item: BackendMessage) => (item.role === 'user' ? item : undefined))
    .filter(Boolean)
  userMsgs.forEach((um) => {
    wholeEvals = { ...wholeEvals, ...um.evaluations }
  })
  let res
  let isResArray = false

  while (!isResArray) {
    try {
      res = await ask('HeadlineGenerator', JSON.stringify(wholeEvals))
      const parsedRes = JSON.parse(res)

      if (Array.isArray(parsedRes)) {
        isResArray = true
        const translations = await Promise.all(
          parsedRes.map(async (r) => {
            return await translate(
              `${r.name}-${r.value}-${r.description}`,
              'English',
              'Western Persian',
            )
          }),
        )
        const faParts = translations.map((t) => {
          return {
            nameFa: t?.split('-')[0],
            valueFa: t?.split('-')[1],
            descriptionFa: t?.split('-')[2],
          }
        })
        const db = parsedRes.map((r, i) => {
          return {
            ...r,
            ...faParts[i],
          }
        })
        const data = {
          anonymousUser: userMsgs[0]?.anonymousUser,
          headlines: db,
          wholeEvaluations: wholeEvals,
        }

        const record = await nuxtApp.$pb.collection('headlines').create(data)
      } else {
        console.log('Received non-array response, retrying...')
      }
    } catch (error) {
      console.error('Error during request:', error)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
    }
  }
}
async function getHeadlines() {
  headlines.value = await nuxtApp.$pb.collection('headlines').getList(1, 50, {
    filter: `anonymousUser.anonymousCode=${route.query.code as string}`,
  })
  if (!headlines.value.totalItems) {
    await generatingHeadlines()
  }
  headlines.value = await nuxtApp.$pb.collection('headlines').getList(1, 50, {
    filter: `anonymousUser.anonymousCode=${route.query.code as string}`,
  })
  headlines.value = headlines.value.items[0].headlines
}

// here from edit profile
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  FIRST_REQUIRED: "Your first name can't be empty",
  LASTNAME_REQUIRED: "Your last name can't be empty",
  OPTION_REQUIRED: 'Please select an option',
  AVATAR_TOO_BIG: `Avatar size must be less than 1MB`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>((v) => v instanceof File).nullable(),
    profile: z.object({
      firstName: z.string().min(1, VALIDATION_TEXT.FIRST_REQUIRED),
      lastName: z.string().min(1, VALIDATION_TEXT.LASTNAME_REQUIRED),
      role: z.string().optional(),
      location: z.string(),
      bio: z.string(),
    }),
    info: z.object({
      experience: z
        .union([
          z.literal('0-2 years'),
          z.literal('2-5 years'),
          z.literal('5-10 years'),
          z.literal('10+ years'),
        ])
        .nullable(),
      firstJob: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
      flexible: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
      remote: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
    }),
    social: z.object({
      facebook: z.string(),
      twitter: z.string(),
      dribbble: z.string(),
      instagram: z.string(),
      github: z.string(),
      gitlab: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (!data.info.experience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.experience'],
      })
    }
    if (!data.info.firstJob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.firstJob'],
      })
    }
    if (!data.info.flexible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.flexible'],
      })
    }
    if (!data.info.remote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.remote'],
      })
    }
    if (data.avatar && data.avatar.size > ONE_MB) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.AVATAR_TOO_BIG,
        path: ['avatar'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const { data, pending, error, refresh } = await useFetch('/api/profile')

const validationSchema = toTypedSchema(zodSchema)
const initialValues = computed<FormInput>(() => ({
  avatar: null,
  profile: {
    firstName: data.value?.personalInfo?.firstName || '',
    lastName: data.value?.personalInfo?.lastName || '',
    role: data.value?.personalInfo?.role || '',
    location: '',
    bio: '',
  },
  info: {
    experience: null,
    firstJob: null,
    flexible: null,
    remote: null,
  },
  social: {
    facebook: '',
    twitter: '',
    dribbble: '',
    instagram: '',
    github: '',
    gitlab: '',
  },
}))

// This is the list of options for the select inputs
const experience = ['0-2 years', '2-5 years', '5-10 years', '10+ years']
const answers = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

// This is the computed value that will be used to display the current avatar
const currentAvatar = computed(() => data.value?.personalInfo?.picture)

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
  setErrors,
} = useForm({
  validationSchema,
  initialValues,
})

const success = ref(false)
const fieldsWithErrors = computed(() => Object.keys(errors.value).length)

// BaseInputFileHeadless gives us a listfile input, but we need to
// extract the file from the list and set it to the form
const inputFile = ref<FileList | null>(null)
const fileError = useFieldError('avatar')
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  setFieldValue('avatar', file)
})

// Ask the user for confirmation before leaving the page if the form has unsaved changes
onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    return confirm('You have unsaved changes. Are you sure you want to leave?')
  }
})

const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    // here you have access to the validated form values
    console.log('profile-edit-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.profile.firstName === 'Maya') {
          // simulate a backend error
          setTimeout(
            () => reject(new Error('Fake backend validation error')),
            2000,
          )
        }
        setTimeout(resolve, 4000)
      })

      toaster.clearAll()
      toaster.show({
        title: 'Success',
        message: `Your profile has been updated!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    } catch (error: any) {
      // this will set the error on the form
      if (error.message === 'Fake backend validation error') {
        // @ts-expect-error - vee validate typing bug with nested keys
        setFieldError('profile.firstName', 'This first name is not allowed')

        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        toaster.clearAll()
        toaster.show({
          title: 'Oops!',
          message: 'Please review the errors in the form',
          color: 'danger',
          icon: 'lucide:alert-triangle',
          closable: true,
        })
      }
      return
    }

    // we can refresh the data from the server
    // this will update the initial values and the current avatar
    await refresh()

    resetForm()

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  },
  (error) => {
    // this callback is optional and called only if the form has errors
    success.value = false

    // here you have access to the error
    console.log('profile-edit-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)
</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div
          class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row"
        >
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Doctor illustration"
            />
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>بررسی کیفی و کمی اطلاعات</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white opacity-70">
                <span>
                  گزارش کمی و کیفی تحلیلی اقدامات و تعاملات هوش مصنوعی با کاربر
                </span>
              </BaseParagraph>
              <!-- <div
                class="mt-6 flex flex-wrap gap-y-6 pb-4 text-center sm:mt-4 sm:gap-x-8 sm:pb-0 sm:text-left"
              >
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>900 kcal</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>Burnt today</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>2300 kcal</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>Eaten today</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>2%</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>Fat burnt</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>11,424</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>Steps walked</span>
                  </BaseParagraph>
                </div>
                <div class="ptablet:hidden min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>8.4km</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>Distance today</span>
                  </BaseParagraph>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div v-for="headline in headlines" class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox size="md" class="bg-primary-500/10">
              <Icon name="ph:clipboard" class="text-primary-500 h-5 w-5" />
            </BaseIconBox>
            <div>
              <div class="flex items-center gap-1 font-sans">
                <span>{{ headline.nameFa }} - {{ headline.valueFa }}</span>
              </div>
              <BaseParagraph size="xs" class="text-muted-400">
                <span>
                  {{ headline.descriptionFa }}
                </span>
              </BaseParagraph>
            </div>
          </div>
          <div>
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
            </BaseHeading>
          </div>
        </div>
      </div>

      <!-- Column -->
      <div class="col-span-12">
        <!-- Inner grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Inner column -->
          <div class="ltablet:col-span-12 col-span-12 lg:col-span-12">
            <!-- Chart subgrid -->
            <div class="col-span-12">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>مدیریت رویداد</span>
                  </BaseHeading>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="h-4 w-4" />
                    <span>
                      لیست اقدامات و رویدادهای تعاملی هوش مصنوعی با کاربر در زیر
                      آمده است.
                    </span>
                  </BaseParagraph>
                  <BaseButton
                    color="primary"
                    @click="genereateRisks()"
                    :loading="isLoading"
                    :disabled="isLoading"
                    >بروز رسانی</BaseButton
                  >
                </div>
              </BaseCard>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
              <!-- Chart -->
              <div class="col-span-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اطلاعات دموگرافیک</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        اطلاعات دموگرافیک کاربر که می تواند توسط خود کاربر اظهار
                        شده یا در جریان مصاحبه و گفت و گو استخراج گردد.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <div class="grid grid-cols-12 gap-4 mt-5">
                    <div class="col-span-12 sm:col-span-6">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="profile.firstName"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="First name"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="profile.lastName"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="Last name"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                    <div class="col-span-12">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="profile.role"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          type="text"
                          icon="ph:suitcase-duotone"
                          placeholder="Job title"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                    <div class="col-span-12">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="profile.location"
                      >
                        <BaseInput
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          type="text"
                          icon="ph:map-pin-duotone"
                          placeholder="Location"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                    <div class="col-span-12">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="profile.bio"
                      >
                        <BaseTextarea
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          rows="4"
                          placeholder="About you / Short bio..."
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                  </div>
                  <TairoFormGroup
                    class="mt-5"
                    label="علاقه مندی ها و ارزش ها"
                    sublabel="اطلاعات جمع آوری شده در مورد علاقه مندی ها، ارزش ها و باور های کاربر"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="info.experience"
                        >
                          <BaseListbox
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            :items="experience"
                            placeholder="Experience"
                            shape="rounded"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="info.firstJob"
                        >
                          <BaseListbox
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            :items="answers"
                            :properties="{ label: 'label', value: 'value' }"
                            placeholder="Is this your first job?"
                            shape="rounded"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="info.flexible"
                        >
                          <BaseListbox
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            :items="answers"
                            :properties="{ label: 'label', value: 'value' }"
                            placeholder="Are you flexible?"
                            shape="rounded"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="info.remote"
                        >
                          <BaseListbox
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            :items="answers"
                            :properties="{ label: 'label', value: 'value' }"
                            placeholder="Do you work remotely?"
                            shape="rounded"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <TairoFormGroup
                    class="mt-5"
                    label="پروفایل اجتماعی"
                    sublabel="ارزش های اجتماعی و سیاسی کاربر"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.facebook"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:facebook-f"
                            placeholder="Facebook URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.twitter"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:twitter"
                            placeholder="Twitter URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.dribbble"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:dribbble"
                            placeholder="Dribbble URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.instagram"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:instagram"
                            placeholder="Instagram URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.github"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:github"
                            placeholder="Github URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="social.gitlab"
                        >
                          <BaseInput
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            icon="fa6-brands:gitlab"
                            placeholder="Gitlab URL"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>
                </BaseCard>
              </div>
              <div class="col-span-4">
                <BaseCard class="p-6">
                  <div class="mb-4 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>ارزیابی اعتماد</span>
                    </BaseHeading>
                  </div>
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="h-4 w-4" />
                    <span>
                      میزان مشارکت و اعتماد ارزیابی شده از پیام های کاربر
                    </span>
                  </BaseParagraph>
                  <div
                    class="mt-[80px] flex flex-col gap-6 md:flex-row md:items-end"
                  >
                    <div class="w-full max-w-sm space-y-4 px-4">
                      <!-- Slider component with custom formatting -->
                      <Slider
                        v-model="trustLevel"
                        :format="formatEmoji"
                        class="rounded-tooltip"
                      />
                    </div>
                  </div>
                </BaseCard>
                <BaseCard class="p-6 mt-5">
                  <!-- Title -->
                  <div class="mb-8 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اهداف جلسه</span>
                    </BaseHeading>
                    <NuxtLink
                      to="#"
                      class="bg-muted-100 hover:bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-900 text-primary-500 rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                    >
                      نمایش تمام موارد
                    </NuxtLink>
                  </div>
                  <GoalsCompact />
                </BaseCard>
              </div>
              <div class="col-span-12">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>وضعیت روانی اجتماعی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        تحلیل روانی پیام های کاربر نشان می دهد که وی در چه
                        وضعیتی از لحاظ ارتباط روانی با هوش مصنوعی است.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <div class="w-full mt-5">
                    <form class="mx-auto w-full">
                      <fieldset class="w-full space-y-6">
                        <div class="grid gap-6 sm:grid-cols-4">
                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_1"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/10.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Kendra Wilson
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Software Engineer</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_2"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/16.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Hermann Mayer
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Sales Manager</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_3"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/25.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Melany Lawright
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >HR Manager</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_1"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/10.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Kendra Wilson
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Software Engineer</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_2"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/16.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Hermann Mayer
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Sales Manager</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_3"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/25.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Melany Lawright
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >HR Manager</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>
                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_1"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/10.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Kendra Wilson
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Software Engineer</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>

                          <BaseCheckboxHeadless
                            v-model="value"
                            value="team_member_2"
                          >
                            <BaseCard
                              shape="rounded"
                              class="peer-checked:!border-primary-500 peer-checked:[&_.child]:!text-primary-500 border-2 p-4 opacity-50 peer-checked:opacity-100"
                            >
                              <div class="flex w-full items-center gap-2">
                                <BaseAvatar src="/img/avatars/16.svg" />

                                <div>
                                  <BaseHeading
                                    as="h4"
                                    size="sm"
                                    weight="medium"
                                    lead="none"
                                  >
                                    Hermann Mayer
                                  </BaseHeading>

                                  <BaseText size="xs" class="text-muted-400"
                                    >Sales Manager</BaseText
                                  >
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="h-3 w-3 rounded-full bg-current"
                                  ></div>
                                </div>
                              </div>
                            </BaseCard>
                          </BaseCheckboxHeadless>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </BaseCard>
              </div>
              <div class="col-span-12">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>ریسک خودکشی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        نمودار وضعیت ریسک خودکشی در واحد زمان را نشان می دهد.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                    <BaseButton
                      color="primary"
                      @click="genereateRisks()"
                      :loading="isLoading"
                      :disabled="isLoading"
                      >بروز رسانی</BaseButton
                    >
                  </div>
                  <AddonApexcharts
                    v-bind="suicideRiskCondition"
                    class="relative -start-5"
                  />
                </BaseCard>
              </div>
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-12">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>خلاصه پیام های مراجع</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        پیام های مراجع به صورت محتوایی بررسی شده و خلاصه سازی
                        گردیده است.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                    <BaseButton
                      color="primary"
                      @click="generateUserSummary()"
                      :loading="isLoading"
                      >ایجاد</BaseButton
                    >
                  </div>
                  <div class="mt-5 text-justify">
                    {{
                      userSum?.[0]?.summaryFa ??
                      `در حال حاضر اطلاعاتی وجود ندارد. از دکمه ی ایجاد استفاده
                    نمایید.`
                    }}
                  </div>
                  <!-- <AddonApexcharts v-bind="scatterEnergy" /> -->
                </BaseCard>
              </div>
              <!-- Chart -->
              <!-- <div class="col-span-12 sm:col-span-6">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>Oxygenation</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        Your oxygen seems a bit unstable. You can improve it.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        Read how
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts
                    v-bind="barOxygen"
                    class="relative -start-5"
                  />
                </BaseCard>
              </div> -->
              <!-- Chart -->
              <!-- <div class="col-span-12 sm:col-span-6">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>Overall Progress</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="h-4 w-4" />
                      <span>
                        Your overall progress is very good. Make it even better.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        Read how
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts
                    v-bind="areaProgress"
                    class="relative -start-5"
                  />
                </BaseCard>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
