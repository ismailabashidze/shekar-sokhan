<script setup lang="ts">
import Slider from '@vueform/slider'
import '~/assets/css/slider.css'

definePageMeta({
  title: 'گزارش جلسه',
  layout: 'sidebar',
  preview: {
    title: 'بررسی گزارش جلسه',
    description: 'بررسی جزییات پیام ها',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-health.png',
    srcDark: '/img/screens/dashboards-health-dark.png',
    order: 17,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const trustLevel = ref(75)

const route = useRoute()
const toaster = useToaster()

const analysisId = computed(() => route.query.analysis_id as string)
const analysisData = ref<any>({ expireChargeTime: new Date() })
const { getAnalysisById } = useSessionAnalysis()

const formatEmoji = (trustLevel: number): string => {
  if (trustLevel >= 80) return '😍' // Heart eyes for 100
  if (trustLevel >= 60) return '😊' // Happy face for 80 to 99
  if (trustLevel >= 25) return '😐' // Stoic face for 50 to 79
  return '😠' // Angry face for 0 to 49
}

const trustLevelComputed = computed(() => {
  if (!analysisData.value) return 0
  const trust = analysisData.value.finalTrustAndOppennessOfUser
  switch (trust) {
    case 'veryHigh': return 100
    case 'high': return 75
    case 'low': return 50
    case 'veryLow': return 25
    default: return 0
  }
})

const headlinesComputed = computed(() => analysisData.value?.headlines || [])

const headlines = ref([
  {
    nameFa: 'شکایت اصلی',
    valueFa: 'مشکلات خانوادگی',
    descriptionFa: 'مریم با خانواده و بالاخص مادرش مشکل دارد. از نوجوانی این فاصله زیاد شده و الان تشدید شده است.',
  },
  {
    nameFa: 'نشانگان',
    valueFa: 'افسردگی',
    descriptionFa: 'مریم از خود نشگان قدرتمندی از افسردگی با ریشه هایی از اختلال شخصیت نشان می دهد.',
  },
  {
    nameFa: 'بنیاد شخصیت',
    valueFa: 'رشد یافته',
    descriptionFa: 'از لحاظ تحولی شخصیت مریم رشد یافته است. او از مکانیزم های دفاعی سطح بالا استفاده می کند.',
  },
  {
    nameFa: 'خطر خودکشی',
    valueFa: 'پایین',
    descriptionFa: 'مریم صریحا اعلام کرده که به خودکشی فکر نمی کند و این یک پیش آگهی خوب است.',
  },
])

onMounted(async () => {
  if (!analysisId.value) {
    toaster.clearAll()
    toaster.show({
      title: 'مشکل در بارگزاری داده',
      message: `تحلیل با این شناسه یافت نشد`,
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    navigateTo('/dashboard')
    return
  }
  analysisData.value = await getAnalysisById(analysisId.value)
  console.log(analysisData.value)
})

const isLoading = ref(false)
// here from edit profile
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  FIRST_REQUIRED: 'Your first name can\'t be empty',
  LASTNAME_REQUIRED: 'Your last name can\'t be empty',
  OPTION_REQUIRED: 'Please select an option',
  AVATAR_TOO_BIG: `Avatar size must be less than 1MB`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
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
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>بررسی کیفی و کمی اطلاعات</span>
              </BaseHeading>
              <BaseParagraph size="lg" class="text-white opacity-80">
                <span class="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span class="text-white/80">گزارش تحلیلی جلسه درمانی</span>
                  <BaseAvatar
                    :src="analysisData?.expand?.session?.expand?.user.meta.avatarUrl || '/img/avatars/default-male.jpg'"
                    :text="analysisData?.expand?.session?.expand?.user.meta.name?.substring(0, 2) || 'کا'"
                    size="xs"
                    class="inline-block align-middle"
                  />
                  <span class="font-bold text-white">
                    {{ analysisData?.expand?.session?.expand?.user.meta.name }}
                  </span>
                  <span class="rounded-full bg-white/10 px-2 py-0.5 text-sm text-white/80">با</span>
                  <span class="font-bold text-white">
                    {{ analysisData?.expand?.session?.expand?.therapist?.name }}
                  </span>
                </span>
              </BaseParagraph>
              <div
                class="mt-6 flex flex-wrap gap-4 pb-4 text-center sm:mt-4 sm:pb-0 sm:text-right"
              >
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">شروع جلسه</span>
                    <div class="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <span class="text-sm font-bold text-white">
                        {{ new Date(analysisData?.expand?.session?.start_time).toLocaleString('fa') }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">پایان جلسه</span>
                    <div class="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <span class="text-sm font-bold text-white">
                        {{ new Date(analysisData?.expand?.session?.end_time).toLocaleString('fa') }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">وضعیت</span>
                    <div
                      class="rounded-xl px-4 py-2"
                      :class="{
                        'bg-success-500/20 backdrop-blur-sm': analysisData?.expand?.session?.status === 'done',
                        'bg-info-500/20 backdrop-blur-sm': analysisData?.expand?.session?.status !== 'done'
                      }"
                    >
                      <span
                        class="text-sm font-bold"
                        :class="{
                          'text-success-400': analysisData?.expand?.session?.status === 'done',
                          'text-info-400': analysisData?.expand?.session?.status !== 'done'
                        }"
                      >
                        {{ analysisData?.expand?.session?.status === 'done' ? 'جلسه پایان یافته' : 'جلسه در حال برگزاری' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">تعداد پیام‌ها</span>
                    <div class="bg-primary-500/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                      <span class="text-primary-400 text-sm font-bold">
                        {{ analysisData?.expand?.session?.count_of_total_messages }} پیام
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="mt-4 flex justify-center gap-3 sm:justify-end">
                <BaseButton
                  color="warning"
                  shape="curved"
                  @click="navigateTo(`/darmana/therapists/history?sessionId=${analysisData?.expand?.session?.id}`)"
                >
                  <Icon name="ph:clock-counter-clockwise-duotone" class="ml-1 size-4" />
                  پیام های جلسه
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Session Title -->
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
              <span>موضوع جلسه</span>
            </BaseHeading>
          </div>
          <div class="mt-2 text-center">
            <span class="text-primary-500 text-xl font-bold">{{ analysisData?.title || 'بدون عنوان' }}</span>
          </div>
        </BaseCard>
      </div>

      <!-- Icon box -->
      <div v-for="headline in headlinesComputed" class="col-span-6 sm:col-span-3">
        <div class="flex h-full flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox size="md" class="bg-primary-500/10">
              <Icon name="ph:clipboard" class="text-primary-500 size-5" />
            </BaseIconBox>
            <div>
              <div class="flex items-center gap-1 font-sans">
                <span>{{ headline.title }}</span>
              </div>
              <BaseParagraph size="xs" class="text-muted-400">
                <span>
                  {{ headline.description }}
                </span>
              </BaseParagraph>
            </div>
          </div>
          <div class="mt-auto">
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 mb-3 dark:text-white"
            />
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
                    <span>خلاصه پیام های جلسه</span>
                  </BaseHeading>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      پیام های رد و بدل شده بین کاربر و مشاور به صورت محتوایی بررسی شده و خلاصه سازی
                      گردیده است.
                    </span>
                    <NuxtLink
                      to="#"
                      class="text-primary-500 underline-offset-4 hover:underline"
                    >
                      اطلاعات بیشتر
                    </NuxtLink>
                  </BaseParagraph>
                </div>
                <div class="mt-5 text-justify">
                  {{ analysisData?.summaryOfSession || 'در حال حاضر اطلاعاتی وجود ندارد.' }}
                </div>
                <!-- <AddonApexcharts v-bind="scatterEnergy" /> -->
              </BaseCard>
            </div>
            <!-- <div class="col-span-12 mt-5">
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
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      لیست اقدامات و رویدادهای تعاملی هوش مصنوعی با کاربر در زیر
                      آمده است.
                    </span>
                  </BaseParagraph>
                </div>
              </BaseCard>
            </div> -->
            <div class="col-span-12 mt-5">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h2"
                    size="md"
                    weight="medium"
                    class="text-muted-800 mb-3 dark:text-white"
                  >
                    <span>بررسی درمانگر</span>
                  </BaseHeading>
                </div>

                <!-- Score Card -->
                <div class="grid w-full gap-6">
                  <!-- Score and Description Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <!-- Score Card -->
                    <div class="bg-muted-800 dark:bg-muted-900 relative h-[400px] overflow-hidden rounded-2xl p-6">
                      <div class="bg-primary-500/10 pointer-events-none absolute right-0 top-0 size-32 rounded-bl-[6rem]" />
                      <div class="bg-primary-500/5 pointer-events-none absolute bottom-0 left-0 size-24 rounded-tr-[4rem]" />
                      <div class="relative z-10">
                        <!-- Header -->
                        <div class="mb-8 flex items-center justify-between">
                          <h3 class="flex items-center gap-2 text-lg font-semibold text-white">
                            <Icon name="ph:star-duotone" class="text-primary-500 size-6" />
                            امتیاز درمانگر
                          </h3>
                          <div class="bg-primary-500/10 flex items-center gap-1 rounded-lg px-3 py-1">
                            <Icon name="ph:trend-up-duotone" class="text-primary-400 size-4" />
                            <span class="text-primary-400 text-sm">عملکرد مثبت</span>
                          </div>
                        </div>

                        <!-- Main Score -->
                        <div class="mb-8 flex items-center justify-center">
                          <div class="text-center">
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-primary-400 text-xl font-medium">100/</span>
                              <span class="text-primary-500 text-7xl font-bold leading-none tracking-tight">
                                {{
                                  100 - (analysisData.negativeScoresList?.reduce((total, item) => total + item.points, 0) || 0)
                                }}
                              </span>
                            </div>
                            <div class="text-primary-400 mt-2 flex items-center justify-center gap-1">
                              <Icon name="ph:chart-bar-duotone" class="size-5" />
                              <span class="text-sm">امتیاز کلی</span>
                            </div>
                          </div>
                        </div>

                        <!-- Performance Metrics -->
                        <div class="grid grid-cols-2 gap-4">
                          <div class="bg-muted-900/50 rounded-xl p-4">
                            <div class="mb-3 flex items-center justify-center gap-2">
                              <Icon name="ph:timer-duotone" class="text-primary-400 size-5" />
                              <span class="text-muted-200 text-sm">زمان جلسه</span>
                            </div>
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-2xl font-semibold text-white">{{ analysisData?.expand?.session?.total_time_passed }}</span>
                              <span class="text-muted-400 text-sm">دقیقه</span>
                            </div>
                          </div>
                          <div class="bg-muted-900/50 rounded-xl p-4">
                            <div class="mb-3 flex items-center justify-center gap-2">
                              <Icon name="ph:chats-circle-duotone" class="text-primary-400 size-5" />
                              <span class="text-muted-200 text-sm">تعداد پیام‌ها</span>
                            </div>
                            <div class="flex items-baseline justify-center gap-1">
                              <span class="text-2xl font-semibold text-white">{{ analysisData?.expand?.session?.count_of_total_messages }}</span>
                              <span class="text-muted-400 text-sm">پیام</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-4">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:user-circle-gear-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          بررسی عملکرد درمانگر
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.psychotherapistEvaluation }}
                      </p>
                    </div>
                  </div>
                  <!-- Therapist Evaluation Sections -->
                  <div class="mt-6 grid grid-cols-1 gap-6">
                    <!-- Negative Points and Positive Behaviors in one row -->
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <!-- Negative Points List -->
                      <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                        <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                          <Icon name="ph:minus-circle-duotone" class="text-danger-500 size-6" />
                          <span>نقاط منفی</span>
                        </h3>
                        <div class="grid gap-3">
                          <div
                            v-for="(item, index) in analysisData.negativeScoresList"
                            :key="index"
                            class="bg-danger-500/5 border-danger-500/20 dark:bg-danger-500/10 dark:border-danger-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                          >
                            <div class="flex items-start gap-3">
                              <div class="bg-danger-500/10 dark:bg-danger-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <span class="text-danger-500 font-bold">{{ item.points }}-</span>
                              </div>
                              <div class="flex-1">
                                <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                  {{ item.cause }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <!-- Empty state for negative points -->
                          <div
                            v-if="!analysisData.negativeScoresList || analysisData.negativeScoresList.length === 0"
                            class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                          >
                            <Icon name="ph:smiley" class="text-muted-400 mx-auto mb-2 size-6" />
                            <p class="text-muted-500 dark:text-muted-400 text-sm">
                              هیچ نقطه منفی برای این جلسه ثبت نشده است.
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Positive Behaviors List -->
                      <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                        <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-6" />
                          <span>رفتارهای مثبت</span>
                        </h3>
                        <div class="grid gap-3">
                          <div
                            v-for="(item, index) in analysisData.psychotherapistEvaluationScorePositiveBehavior"
                            :key="index"
                            class="bg-success-500/5 border-success-500/20 dark:bg-success-500/10 dark:border-success-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                          >
                            <div class="flex items-start gap-3">
                              <div class="bg-success-500/10 dark:bg-success-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <Icon name="ph:check-bold" class="text-success-500 size-4" />
                              </div>
                              <div class="flex-1">
                                <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                  {{ item }}
                                </p>
                              </div>
                            </div>
                          </div>
                          <!-- Empty state for positive behaviors -->
                          <div
                            v-if="!analysisData.psychotherapistEvaluationScorePositiveBehavior || analysisData.psychotherapistEvaluationScorePositiveBehavior.length === 0"
                            class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                          >
                            <Icon name="ph:note-pencil" class="text-muted-400 mx-auto mb-2 size-6" />
                            <p class="text-muted-500 dark:text-muted-400 text-sm">
                              هنوز هیچ رفتار مثبتی برای این جلسه ثبت نشده است.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Suggestions to Improve List -->
                    <div class="bg-muted-100 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 h-full rounded-xl border p-5">
                      <h3 class="text-muted-800 mb-4 flex items-center gap-2 text-lg font-semibold dark:text-white">
                        <Icon name="ph:lightbulb-duotone" class="text-primary-500 size-6" />
                        <span>پیشنهادات بهبود</span>
                      </h3>
                      <div class="grid gap-3">
                        <div
                          v-for="(item, index) in analysisData.psychotherapistEvaluationScoreSuggestionsToImprove"
                          :key="index"
                          class="bg-primary-500/5 border-primary-500/20 dark:bg-primary-500/10 dark:border-primary-500/30 rounded-xl border p-4 transition-all hover:shadow-md"
                        >
                          <div class="flex items-start gap-3">
                            <div class="bg-primary-500/10 dark:bg-primary-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                              <Icon name="ph:arrow-up-right" class="text-primary-500 size-4" />
                            </div>
                            <div class="flex-1">
                              <p class="text-muted-800 dark:text-muted-100 leading-relaxed">
                                {{ item }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <!-- Empty state for suggestions -->
                        <div
                          v-if="!analysisData.psychotherapistEvaluationScoreSuggestionsToImprove || analysisData.psychotherapistEvaluationScoreSuggestionsToImprove.length === 0"
                          class="bg-muted-100 dark:bg-muted-700/30 border-muted-200 dark:border-muted-700 rounded-xl border p-4 text-center"
                        >
                          <Icon name="ph:lightbulb" class="text-muted-400 mx-auto mb-2 size-6" />
                          <p class="text-muted-500 dark:text-muted-400 text-sm">
                            هیچ پیشنهادی برای بهبود در این جلسه ثبت نشده است.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
            <div class="mt-5 grid grid-cols-12 gap-6">
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
                      <Icon name="ph:question-duotone" class="size-4" />
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
                  <div class="relative mt-5">
                    <div class="grid grid-cols-12 gap-4">
                      <!-- First Name -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">نام</label>
                          <span v-if="analysisData.demographicData?.firstName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.firstName || ''"
                          disabled
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="نام"
                          :class="{'opacity-50': !analysisData.demographicData?.firstName}"
                        />
                      </div>

                      <!-- Last Name -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">نام خانوادگی</label>
                          <span v-if="analysisData.demographicData?.lastName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.lastName || ''"
                          disabled
                          type="text"
                          icon="ph:user-duotone"
                          placeholder="نام خانوادگی"
                          :class="{'opacity-50': !analysisData.demographicData?.lastName}"
                        />
                      </div>

                      <!-- Age -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">سن</label>
                          <span v-if="analysisData.demographicData?.age" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseInput
                          :model-value="analysisData.demographicData?.age || ''"
                          disabled
                          type="number"
                          icon="ph:calendar-duotone"
                          placeholder="سن"
                          :class="{'opacity-50': !analysisData.demographicData?.age}"
                        />
                      </div>

                      <!-- Gender -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">جنسیت</label>
                          <span v-if="analysisData.demographicData?.gender" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.gender || ''"
                          disabled
                          placeholder="جنسیت"
                          :class="{'opacity-50': !analysisData.demographicData?.gender}"
                        >
                          <option value="">
                            جنسیت
                          </option>
                          <option value="male">
                            مرد
                          </option>
                          <option value="female">
                            زن
                          </option>
                          <option value="other">
                            دیگر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Education -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">تحصیلات</label>
                          <span v-if="analysisData.demographicData?.education" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.education || ''"
                          disabled
                          placeholder="تحصیلات"
                          :class="{'opacity-50': !analysisData.demographicData?.education}"
                        >
                          <option value="">
                            تحصیلات
                          </option>
                          <option value="under diploma">
                            زیر دیپلم
                          </option>
                          <option value="diploma">
                            دیپلم
                          </option>
                          <option value="bachelor">
                            کارشناسی
                          </option>
                          <option value="master">
                            کارشناسی ارشد
                          </option>
                          <option value="phd">
                            دکتری
                          </option>
                          <option value="other">
                            سایر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Occupation -->
                      <div class="col-span-12 sm:col-span-6">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">شغل</label>
                          <span v-if="analysisData.demographicData?.occupation" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.occupation || ''"
                          disabled
                          placeholder="شغل"
                          :class="{'opacity-50': !analysisData.demographicData?.occupation}"
                        >
                          <option value="">
                            شغل
                          </option>
                          <option value="student">
                            دانشجو
                          </option>
                          <option value="employed">
                            کارمند
                          </option>
                          <option value="self-employed">
                            آزاد
                          </option>
                          <option value="unemployed">
                            بیکار
                          </option>
                          <option value="retired">
                            بازننشسته
                          </option>
                          <option value="householder">
                            خانه‌دار
                          </option>
                          <option value="other">
                            سایر
                          </option>
                        </BaseSelect>
                      </div>

                      <!-- Marital Status -->
                      <div class="col-span-12">
                        <div class="mb-1 flex items-center justify-between">
                          <label class="text-muted-400 text-xs font-medium">وضعیت تأهل</label>
                          <span v-if="analysisData.demographicData?.maritalStatus" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                          <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                        </div>
                        <BaseSelect
                          :model-value="analysisData.demographicData?.maritalStatus || ''"
                          disabled
                          placeholder="وضعیت تأهل"
                          :class="{'opacity-50': !analysisData.demographicData?.maritalStatus}"
                        >
                          <option value="">
                            وضعیت تأهل
                          </option>
                          <option value="single">
                            مجرد
                          </option>
                          <option value="married">
                            متأهل
                          </option>
                          <option value="divorced">
                            مطلقه
                          </option>
                          <option value="widowed">
                            بیوه
                          </option>
                        </BaseSelect>
                      </div>
                    </div>

                    <!-- No Data Overlay -->
                    <div
                      v-if="!analysisData.demographicData ||
                        Object.values(analysisData.demographicData).every(value => !value)"
                      class="bg-muted-100/50 dark:bg-muted-900/50 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm"
                    >
                      <div class="text-center">
                        <Icon
                          name="ph:user-circle-minus-duotone"
                          class="text-muted-400 mb-2 size-12"
                        />
                        <p class="text-muted-500 dark:text-muted-400">
                          اطلاعات جمعیت‌شناختی در دسترس نیست
                        </p>
                      </div>
                    </div>
                  </div>
                  <TairoFormGroup
                    class="mt-5"
                    label="تحلیل‌های روانشناختی"
                    sublabel="خلاصه تحلیل‌های رفتاری، احساسی و نگرانی‌های مراجع"
                  >
                    <div
                      v-if="!analysisData.behavioralAnalysisSummary && !analysisData.emotionalAnalysisSummary && !analysisData.thoughtsAndConcernsSummary"
                      class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-6 text-center"
                    >
                      <Icon
                        name="ph:note-pencil-duotone"
                        class="text-muted-400 mb-2 size-12"
                      />
                      <p class="text-muted-500 dark:text-muted-400">
                        هنوز تحلیلی ثبت نشده است
                      </p>
                    </div>

                    <div v-else class="grid gap-6">
                      <!-- Behavioral Analysis -->
                      <div
                        v-if="analysisData.behavioralAnalysisSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:brain-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            تحلیل رفتاری
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.behavioralAnalysisSummary }}
                        </p>
                      </div>

                      <!-- Emotional Analysis -->
                      <div
                        v-if="analysisData.emotionalAnalysisSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:heart-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            تحلیل احساسی
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.emotionalAnalysisSummary }}
                        </p>
                      </div>

                      <!-- Thoughts and Concerns -->
                      <div
                        v-if="analysisData.thoughtsAndConcernsSummary"
                        class="bg-muted-100 dark:bg-muted-800/50 hover:bg-muted-200 dark:hover:bg-muted-800 rounded-xl p-4"
                      >
                        <div class="mb-3 flex items-center gap-3">
                          <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                            <Icon name="ph:lightbulb-duotone" class="text-primary-500 size-5" />
                          </div>
                          <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                            افکار و نگرانی‌ها
                          </h4>
                        </div>
                        <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                          {{ analysisData.thoughtsAndConcernsSummary }}
                        </p>
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
                    <Icon name="ph:question-duotone" class="size-4" />
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
                        v-model="trustLevelComputed"
                        :format="formatEmoji"
                        class="rounded-tooltip"
                      />
                    </div>
                  </div>
                  <p class="mt-5 text-justify">
                    {{ analysisData.finalTrustAndOppennessOfUserEvaluationDescription }}
                  </p>
                </BaseCard>
                <!-- Possible Risk Factors -->
                <div class="col-span-12 my-6">
                  <BaseCard shape="curved" class="p-6">
                    <div class="mb-2 flex items-center justify-between">
                      <BaseHeading
                        as="h3"
                        size="md"
                        weight="semibold"
                        lead="tight"
                        class="text-muted-800 dark:text-white"
                      >
                        <span>عوامل خطر احتمالی</span>
                      </BaseHeading>
                    </div>
                    <div class="flex justify-between">
                      <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                        <Icon name="ph:warning-duotone" class="size-4" />
                        <span>
                          عوامل خطر شناسایی شده که نیاز به توجه ویژه دارند
                        </span>
                      </BaseParagraph>
                    </div>

                    <!-- Risk Factors List -->
                    <div v-if="analysisData.possibleRiskFactorsExtracted?.length > 0" class="mt-6">
                      <div class="grid gap-4">
                        <div
                          v-for="(risk, index) in analysisData.possibleRiskFactorsExtracted"
                          :key="index"
                          class="group relative"
                        >
                          <BaseCard
                            shape="rounded"
                            class="border-warning-100 dark:border-warning-500/20 border-2 p-4 transition-all hover:shadow-lg"
                          >
                            <div class="flex w-full items-start gap-3">
                              <div class="bg-warning-500/10 dark:bg-warning-500/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <Icon
                                  name="ph:warning-circle-duotone"
                                  class="text-warning-500 size-5"
                                />
                              </div>
                              <div class="flex-1">
                                <BaseHeading
                                  as="h4"
                                  size="sm"
                                  weight="medium"
                                  lead="none"
                                  class="mb-3"
                                >
                                  {{ risk.title }}
                                </BaseHeading>
                                <BaseText size="xs" class="text-muted-400">
                                  {{ risk.description }}
                                </BaseText>
                              </div>
                            </div>
                          </BaseCard>
                        </div>
                      </div>
                    </div>
                    <div v-else class="mt-6 text-center">
                      <Icon
                        name="ph:shield-check-duotone"
                        class="text-muted-400 mb-2 size-12"
                      />
                      <BaseText size="sm" class="text-muted-400">
                        در حال حاضر عامل خطر قابل توجهی شناسایی نشده است.
                      </BaseText>
                    </div>
                  </BaseCard>
                </div>
              </div>
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>وضعیت روانی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:brain-duotone" class="size-4" />
                      <span>
                        تحلیل روانی پیام های کاربر نشان می دهد که وی در چه
                        وضعیتی از لحاظ ارتباط روانی با هوش مصنوعی است.
                      </span>
                    </BaseParagraph>
                  </div>

                  <!-- Main Analysis -->
                  <div v-if="analysisData.psychoAnalysis" class="mt-5">
                    <div class="bg-muted-100 dark:bg-muted-800/50 rounded-xl p-4">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:brain-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          تحلیل روانشناختی
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.psychoAnalysis }}
                      </p>
                    </div>
                  </div>

                  <!-- Defense Mechanisms -->
                  <div v-if="analysisData.detectedDefenceMechanisms?.length > 0" class="mt-6">
                    <h4 class="text-muted-800 dark:text-muted-100 mb-4 flex items-center gap-2 font-semibold">
                      <Icon name="ph:shield-duotone" class="text-primary-500 size-5" />
                      مکانیزم‌های دفاعی شناسایی شده
                    </h4>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <div
                        v-for="mechanism in analysisData.detectedDefenceMechanisms"
                        :key="mechanism.name"
                        class="group relative"
                      >
                        <BaseCard
                          shape="rounded"
                          class="border-2 p-4 transition-all duration-300 hover:shadow-lg"
                          :class="{
                            'border-success-500 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-500/10': mechanism.confidence === 'very_high',
                            'border-info-500 dark:border-info-400 hover:bg-info-50 dark:hover:bg-info-500/10': mechanism.confidence === 'high',
                            'border-warning-500 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-500/10': mechanism.confidence === 'low',
                            'border-muted-300 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800': mechanism.confidence === 'very_low'
                          }"
                        >
                          <div class="flex w-full items-start gap-3">
                            <div
                              class="rounded-lg p-2"
                              :class="{
                                'bg-success-500/10 dark:bg-success-500/20': mechanism.confidence === 'very_high',
                                'bg-info-500/10 dark:bg-info-500/20': mechanism.confidence === 'high',
                                'bg-warning-500/10 dark:bg-warning-500/20': mechanism.confidence === 'low',
                                'bg-muted-300/10 dark:bg-muted-700/20': mechanism.confidence === 'very_low'
                              }"
                            >
                              <Icon
                                :name="mechanism.name.toLowerCase().includes('انکار') ? 'ph:prohibit-duotone' :
                                  mechanism.name.toLowerCase().includes('فرافکنی') ? 'ph:arrows-out-duotone' :
                                  mechanism.name.toLowerCase().includes('درون‌فکنی') ? 'ph:arrow-fat-lines-down-duotone' :
                                  mechanism.name.toLowerCase().includes('جابجایی') ? 'ph:arrows-left-right-duotone' :
                                  mechanism.name.toLowerCase().includes('واکنش') ? 'ph:arrows-out-duotone' :
                                  mechanism.name.toLowerCase().includes('دلیل') ? 'ph:brain-duotone' : 'ph:shield-duotone'"
                                class="size-5"
                                :class="{
                                  'text-success-500': mechanism.confidence === 'very_high',
                                  'text-info-500': mechanism.confidence === 'high',
                                  'text-warning-500': mechanism.confidence === 'low',
                                  'text-muted-300': mechanism.confidence === 'very_low'
                                }"
                              />
                            </div>
                            <div class="flex-1">
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="mb-3 flex items-center justify-between gap-2"
                              >
                                {{ mechanism.name }}
                                <div class="flex items-center gap-2">
                                  <div class="text-xs">
                                    <Icon name="ph:target" class="size-4" />
                                  </div>
                                  <div
                                    v-for="i in 4"
                                    :key="i"
                                    class="size-1.5 rounded-full transition-all duration-300"
                                    :class="{
                                      'bg-success-500': mechanism.confidence === 'very_high' && i <= 4,
                                      'bg-info-500': mechanism.confidence === 'high' && i <= 3,
                                      'bg-warning-500': mechanism.confidence === 'low' && i <= 2,
                                      'bg-muted-300': mechanism.confidence === 'very_low' && i <= 1,
                                      'bg-muted-200 dark:bg-muted-700':
                                        (mechanism.confidence === 'very_high' && i > 4) ||
                                        (mechanism.confidence === 'high' && i > 3) ||
                                        (mechanism.confidence === 'low' && i > 2) ||
                                        (mechanism.confidence === 'very_low' && i > 1)
                                    }"
                                  />
                                </div>
                              </BaseHeading>
                              <BaseText size="xs" class="text-muted-400 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                                {{ mechanism.evidence }}
                              </BaseText>
                            </div>
                          </div>
                        </BaseCard>
                      </div>
                    </div>
                  </div>

                  <!-- Schemas -->
                  <div v-if="analysisData.detectedSchemas?.length > 0" class="mt-6">
                    <h4 class="text-muted-800 dark:text-muted-100 mb-4 flex items-center gap-2 font-semibold">
                      <Icon name="ph:tree-structure-duotone" class="text-primary-500 size-5" />
                      طرحواره‌های شناسایی شده
                    </h4>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <div
                        v-for="schema in analysisData.detectedSchemas"
                        :key="schema.name"
                        class="group relative"
                      >
                        <BaseCard
                          shape="rounded"
                          class="border-2 p-4 transition-all duration-300 hover:shadow-lg"
                          :class="{
                            'border-success-500 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-500/10': schema.confidence === 'very_high',
                            'border-info-500 dark:border-info-400 hover:bg-info-50 dark:hover:bg-info-500/10': schema.confidence === 'high',
                            'border-warning-500 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-500/10': schema.confidence === 'low',
                            'border-muted-300 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800': schema.confidence === 'very_low'
                          }"
                        >
                          <div class="flex w-full items-start gap-3">
                            <div
                              class="rounded-lg p-2"
                              :class="{
                                'bg-success-500/10 dark:bg-success-500/20': schema.confidence === 'very_high',
                                'bg-info-500/10 dark:bg-info-500/20': schema.confidence === 'high',
                                'bg-warning-500/10 dark:bg-warning-500/20': schema.confidence === 'low',
                                'bg-muted-300/10 dark:bg-muted-700/20': schema.confidence === 'very_low'
                              }"
                            >
                              <Icon
                                :name="schema.name.toLowerCase().includes('رهاشدگی') ? 'ph:person-simple-walk-duotone' :
                                  schema.name.toLowerCase().includes('بی‌اعتمادی') ? 'ph:warning-circle-duotone' :
                                  schema.name.toLowerCase().includes('نقص') ? 'ph:puzzle-piece-duotone' :
                                  schema.name.toLowerCase().includes('انزوا') ? 'ph:user-circle-minus-duotone' :
                                  schema.name.toLowerCase().includes('شکست') ? 'ph:x-circle-duotone' :
                                  schema.name.toLowerCase().includes('وابستگی') ? 'ph:link-duotone' : 'ph:tree-structure-duotone'"
                                class="size-5"
                                :class="{
                                  'text-success-500': schema.confidence === 'very_high',
                                  'text-info-500': schema.confidence === 'high',
                                  'text-warning-500': schema.confidence === 'low',
                                  'text-muted-300': schema.confidence === 'very_low'
                                }"
                              />
                            </div>
                            <div class="flex-1">
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="mb-3 flex items-center justify-between gap-2"
                              >
                                {{ schema.name }}
                                <div class="flex items-center gap-1">
                                  <div class="text-xs">
                                    <Icon name="ph:target" class="size-4" />
                                  </div>
                                  <div
                                    v-for="i in 4"
                                    :key="i"
                                    class="size-1.5 rounded-full transition-all duration-300"
                                    :class="{
                                      'bg-success-500': schema.confidence === 'very_high' && i <= 4,
                                      'bg-info-500': schema.confidence === 'high' && i <= 3,
                                      'bg-warning-500': schema.confidence === 'low' && i <= 2,
                                      'bg-muted-300': schema.confidence === 'very_low' && i <= 1,
                                      'bg-muted-200 dark:bg-muted-700':
                                        (schema.confidence === 'very_high' && i > 4) ||
                                        (schema.confidence === 'high' && i > 3) ||
                                        (schema.confidence === 'low' && i > 2) ||
                                        (schema.confidence === 'very_low' && i > 1)
                                    }"
                                  />
                                </div>
                              </BaseHeading>
                              <BaseText size="xs" class="text-muted-400 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                                {{ schema.evidence }}
                              </BaseText>
                            </div>
                          </div>
                        </BaseCard>
                      </div>
                    </div>
                  </div>
                </BaseCard>
              </div>
              <!-- Possible Deeper Goals of Patient -->
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اهداف عمیق‌تر احتمالی مراجع</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:target-duotone" class="size-4" />
                      <span>
                        تحلیل اهداف و انگیزه‌های عمیق‌تر مراجع که ممکن است به صورت صریح بیان نشده باشند
                      </span>
                    </BaseParagraph>
                  </div>
                  <div v-if="analysisData.possibleDeeperGoalsOfPatient" class="mt-5">
                    <div class="bg-muted-100 dark:bg-muted-800/50 border-primary-100 dark:border-primary-500/20 rounded-xl border p-4 transition-all hover:shadow-md">
                      <div class="mb-3 flex items-center gap-3">
                        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2">
                          <Icon name="ph:target-duotone" class="text-primary-500 size-5" />
                        </div>
                        <h4 class="text-muted-800 dark:text-muted-100 font-semibold">
                          اهداف عمیق‌تر
                        </h4>
                      </div>
                      <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        {{ analysisData.possibleDeeperGoalsOfPatient }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="mt-6 text-center">
                    <Icon
                      name="ph:target-duotone"
                      class="text-muted-400 mb-2 size-12"
                    />
                    <BaseText size="sm" class="text-muted-400">
                      در حال حاضر تحلیلی از اهداف عمیق‌تر مراجع وجود ندارد.
                    </BaseText>
                  </div>
                </BaseCard>
              </div>
              <!-- Suggested Next Steps for Therapist -->
              <div class="col-span-12 mb-8">
                <BaseCard shape="curved" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>پیشنهادات برای جلسه بعدی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        پیشنهادات و راهکارهای مفید برای درمانگر جهت استفاده در جلسه بعدی با مراجع
                      </span>
                    </BaseParagraph>
                  </div>

                  <!-- Next Steps List -->
                  <div v-if="analysisData.suggestedNextStepsForTherapistForNextSession?.length > 0" class="mt-6">
                    <div class="grid gap-4">
                      <div
                        v-for="(step, index) in analysisData.suggestedNextStepsForTherapistForNextSession"
                        :key="index"
                        class="group relative"
                      >
                        <BaseCard
                          shape="rounded"
                          class="border-primary-100 dark:border-primary-500/20 border-2 p-4 transition-all duration-300 hover:shadow-lg"
                        >
                          <div class="flex w-full items-start gap-3">
                            <div
                              class="bg-primary-500/10 dark:bg-primary-500/20 rounded-lg p-2"
                            >
                              <Icon
                                name="ph:arrow-circle-right-duotone"
                                class="text-primary-500 size-5"
                              />
                            </div>
                            <div class="flex-1">
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="medium"
                                lead="none"
                                class="mb-3"
                              >
                                {{ step.title }}
                              </BaseHeading>
                              <BaseText size="xs" class="text-muted-400">
                                {{ step.description }}
                              </BaseText>
                            </div>
                          </div>
                        </BaseCard>
                      </div>
                    </div>
                  </div>
                  <div v-else class="mt-6 text-center">
                    <Icon
                      name="ph:clipboard-text-duotone"
                      class="text-muted-400 mb-2 size-12"
                    />
                    <BaseText size="sm" class="text-muted-400">
                      در حال حاضر پیشنهادی برای جلسه بعدی وجود ندارد.
                    </BaseText>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
