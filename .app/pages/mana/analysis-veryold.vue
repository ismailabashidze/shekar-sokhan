<script setup lang="ts">
import 'v-calendar/dist/style.css'
import '~/assets/css/vcalendar.css'
import { AgentTask } from '~/composables/crew'
import { BackendMessage } from '~/composables/message'

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
const headlines = ref([])
onMounted(async () => {
  userSum.value = await getSummerizedMessagesByCode(route.query.code as string)
  msgs.value = await getMessagesByCode(route.query.code as string)
  await getHeadlines()
  msgs.value.map((m) => {
    if (m.role === 'user') {
      let label = 0
      const temp = m.evaluations.suicideRiskEvaluation
        .toLowerCase()
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
      suicideRiskCondition.series[0].data.push(label)
      suicideRiskCondition.options.xaxis.categories.push(
        new Date(m.created).toLocaleTimeString('fa'),
      )
    }
  })
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

  await analyzeAllMessages('suicideRiskEvaluation')
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
      const { data } = await agentAction({
        task: analyze,
        text: currentMessage.msgEn,
      })

      if (data.value.result.length > 30) {
        console.log('There is perhaps an error, retrying...')
        retryCounter++
        continue
      } else {
        retryCounter = maxRetries
        const updatedEvaluations = {
          ...(userMsgs[i]?.evaluations ?? {}),
          [analyze]: data.value.result, // Using computed property name
        }

        const updatedMessage = {
          ...userMsgs[i],
          evaluations: updatedEvaluations,
        }

        const m = await nuxtApp.$pb
          .collection('messages')
          .update(userMsgs[i].id, updatedMessage)
        if (analyze === 'suicideRiskEvaluation') {
          let label = 0
          const temp = m.evaluations.suicideRiskEvaluation
            .toLowerCase()
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
                  پایش محتوایی و معنایی پیام های کاربران سامانه خودکشی
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
            <div class="grid grid-cols-12 gap-6">
              <!-- Chart -->
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
              <div class="col-span-12 sm:col-span-6">
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
              </div>
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-6">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
