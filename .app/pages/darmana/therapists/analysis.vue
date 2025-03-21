<script setup lang="ts">
import Slider from '@vueform/slider'
import '~/assets/css/slider.css'

const trustLevel = ref(75)

const { getUserDetailsWithUserId } = useUser()
const route = useRoute()
const sessionId = computed(() => route.query.sessionId as string)
const analysisData = ref<any>(null)

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

definePageMeta({
  title: 'گزارش جلسه',
  layout: 'sidebar',
  preview: {
    title: 'مصاحبه مانا',
    description: 'بررسی جزییات پیام ها',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-health.png',
    srcDark: '/img/screens/dashboards-health-dark.png',
    order: 17,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const suicideRiskCondition = reactive(useSuicideRiskCondition())
const userDetails = ref({ expand: { user: { currentDeletionDivider: 0 } } })
const userSum = ref([])
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
  if (!sessionId.value) return
  const data = localStorage.getItem(`analysis_${sessionId.value}`)
  if (data) {
    analysisData.value = JSON.parse(data)
    localStorage.removeItem(`analysis_${sessionId.value}`)
  }
  userDetails.value = await getUserDetailsWithUserId(route.query.userDetailsId as string)
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
              <BaseParagraph size="sm" class="text-white opacity-70">
                <span>
                  گزارش کمی و کیفی تحلیلی اقدامات و تعاملات هوش مصنوعی با کاربر
                </span>
              </BaseParagraph>
              <div
                class="mt-6 flex flex-wrap gap-y-6 pb-4 text-center sm:mt-4 sm:gap-x-8 sm:pb-0 sm:text-left"
              >
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseTag
                    rounded="md"
                    variant="pastel"
                    color="default"
                  >
                    {{ userDetails.expand.user.currentDeletionDivider == 0 ? 'جلسه مصاحبه' : `جلسه شماره ${userDetails.expand.user.currentDeletionDivider}` }}
                  </BaseTag>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <div>
                    <BaseTag
                      rounded="md"
                      variant="pastel"
                      color="default"
                    >
                      پایان زمان در
                      {{ new Date( userDetails.expand.user.expireChargeTime ).toLocaleTimeString('fa') }} - {{ new Date( userDetails.expand.user.expireChargeTime ).toLocaleDateString('fa') }}
                    </BaseTag>
                  </div>
                </div>
                <div v-if="userDetails?.expand?.user?.hasCharge" class="min-w-[33.3%] sm:min-w-0">
                  <BaseTag
                    rounded="md"
                    variant="outline"
                    color="info"
                  >
                    جلسه در حال برگزاری
                  </BaseTag>
                </div>
                <div v-else class="min-w-[33.3%] sm:min-w-0">
                  <BaseTag
                    rounded="md"
                    variant="outline"
                    color="success"
                  >
                    جلسه پایان یافته
                  </BaseTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div v-for="headline in headlines" class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox size="md" class="bg-primary-500/10">
              <Icon name="ph:clipboard" class="text-primary-500 size-5" />
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
            <div class="col-span-12 mt-5">
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
            </div>
            <div class="col-span-12 mt-5">
              <BaseCard shape="curved" class="p-6">
                <div class="mb-2 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>بررسی درمانگر</span>
                  </BaseHeading>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      تحلیلی از روانشناس و اقدامات، همراه با امتیاز و توضیحات امتیاز در بخش زیر آمده است.
                    </span>
                    psychotherapistEvaluation
                    psychotherapistEvaluationScore
                    psychotherapistEvaluationScoreDescription
                  </BaseParagraph>
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
                  <div class="mt-5 grid grid-cols-12 gap-4">
                    <div class="col-span-12 sm:col-span-6">
                      DemographicData
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
                        behavioralAnalysisSummary
                        emotionalAnalysisSummary
                        thoughtsAndConcernsSummary
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
                    <Icon name="ph:question-duotone" class="size-4" />
                    <span>
                      میزان مشارکت و اعتماد ارزیابی شده از پیام های کاربر
                    </span>
                  </BaseParagraph>
                  finalTrustAndOppennessOfUser
                  finalTrustAndOppennessOfUserEvaluationDescription
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
                </BaseCard>
                <BaseCard class="mt-5 p-6">
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
                  <!-- <GoalsCompact /> -->
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
                    psychoAnalysis
                    defenceMechanisms
                    schemas
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="size-4" />
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
                  <div class="mt-5 w-full">
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

                                  <BaseText
                                    size="xs"
                                    class="text-muted-400"
                                  >
                                    Software Engineer
                                  </BaseText>
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="size-3 rounded-full bg-current"
                                  />
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

                                  <BaseText
                                    size="xs"
                                    class="text-muted-400"
                                  >
                                    Sales Manager
                                  </BaseText>
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="size-3 rounded-full bg-current"
                                  />
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

                                  <BaseText
                                    size="xs"
                                    class="text-muted-400"
                                  >
                                    HR Manager
                                  </BaseText>
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="size-3 rounded-full bg-current"
                                  />
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

                                  <BaseText
                                    size="xs"
                                    class="text-muted-400"
                                  >
                                    Software Engineer
                                  </BaseText>
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="size-3 rounded-full bg-current"
                                  />
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

                                  <BaseText
                                    size="xs"
                                    class="text-muted-400"
                                  >
                                    Sales Manager
                                  </BaseText>
                                </div>

                                <div class="child text-muted-300 ms-auto">
                                  <div
                                    class="size-3 rounded-full bg-current"
                                  />
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
                      <span>بررسی فاکتور: افسردگی</span>
                    </BaseHeading>
                  </div>
                  <div class="flex justify-between">
                    <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        نمودار زیر بررسی وضعیت اطمینان و مقدار افسردگی را در طول جلسه نشان می دهد.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        اطلاعات بیشتر
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <div class="grid grid-cols-2 items-center justify-center gap-4">
                    <div class="flex justify-center">
                      <DemoChartPie class="w-[350px]" />
                    </div>
                    <AddonApexcharts
                      v-bind="suicideRiskCondition"
                      class="relative -start-5"
                    />
                  </div>
                </BaseCard>
              </div>
              <div class="col-span-6">
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
                      <Icon name="ph:question-duotone" class="size-4" />
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
                      :loading="isLoading"
                      :disabled="isLoading"
                      @click="genereateRisks()"
                    >
                      بروز رسانی
                    </BaseButton>
                  </div>
                  <AddonApexcharts
                    v-bind="suicideRiskCondition"
                    class="relative -start-5"
                  />
                </BaseCard>
              </div>
              <!-- Chart -->

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
  <div v-if="analysisData">
    <div class="mb-6">
      <BaseHeading 
        as="h2" 
        size="2xl" 
        weight="medium" 
        lead="tight" 
        class="text-muted-800 dark:text-white"
      >
        {{ analysisData.summaryOfSession || 'خلاصه جلسه' }}
      </BaseHeading>
    </div>

    <div class="mb-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <BaseHeading 
            as="h3" 
            size="sm" 
            weight="medium" 
            lead="tight" 
            class="mb-2 text-muted-800 dark:text-white"
          >
            سطح اعتماد و صداقت مراجع
          </BaseHeading>
          <BaseProgress :value="trustLevelComputed" class="h-2" />
        </div>
        <div class="flex size-12 items-center justify-center text-2xl">
          {{ formatEmoji(trustLevelComputed) }}
        </div>
      </div>
    </div>

    <div class="mb-6 grid gap-6 md:grid-cols-2">
      <div 
        v-for="(headline, index) in headlinesComputed" 
        :key="index" 
        class="flex items-start gap-4"
      >
        <div class="flex-1">
          <BaseHeading 
            as="h4" 
            size="sm" 
            weight="medium" 
            lead="tight" 
            class="mb-2 text-muted-800 dark:text-white"
          >
            {{ headline.title }}
          </BaseHeading>
          <BaseText size="sm" class="text-muted-500">
            {{ headline.content }}
          </BaseText>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex h-96 items-center justify-center">
    <BaseHeading 
      as="h3" 
      size="lg" 
      weight="medium" 
      lead="tight" 
      class="text-muted-800 dark:text-white"
    >
      داده‌های تحلیل یافت نشد
    </BaseHeading>
  </div>
</template>
