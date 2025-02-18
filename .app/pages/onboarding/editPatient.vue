<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

useHead({ htmlAttrs: { dir: 'rtl' } })

definePageMeta({
  title: 'ویرایش بیمار',
  layout: 'sidebar',
})

const route = useRoute()
const patientId = route.query.userId as string
const role = useLocalStorage('role', '')
const isAdmin = computed(() => role.value === 'admin')

const VALIDATION_TEXT = {
  NAME_REQUIRED: 'نام بیمار نمی‌تواند خالی باشد',
  AGE_REQUIRED: 'سن بیمار نمی‌تواند خالی باشد',
  AGE_INVALID: 'سن بیمار باید یک عدد معتبر بین ۰ تا ۱۵۰ باشد',
  SHORT_DESC_REQUIRED: 'توضیح کوتاه نمی‌تواند خالی باشد',
  LONG_DESC_REQUIRED: 'توضیح بلند نمی‌تواند خالی باشد',
  TRAITS_REQUIRED: 'ویژگی‌های تعریف‌کننده نمی‌تواند خالی باشد',
  BACKSTORY_REQUIRED: 'پیشینه نمی‌تواند خالی باشد',
  PERSONALITY_REQUIRED: 'شخصیت نمی‌تواند خالی باشد',
  APPEARANCE_REQUIRED: 'ظاهر نمی‌تواند خالی باشد',
  MOTIVATION_REQUIRED: 'انگیزه نمی‌تواند خالی باشد',
  MOOD_REQUIRED: 'حالت روحی و احساسات فعلی نمی‌تواند خالی باشد',
  AVATAR_TOO_BIG: 'اندازه تصویر آواتار باید کمتر از ۱ مگابایت باشد',
}

const ONE_MB = 1000000

const zodSchema = z.object({
  avatar: z
    .instanceof(File)
    .nullable()
    .refine(file => !file || file.size <= ONE_MB, {
      message: VALIDATION_TEXT.AVATAR_TOO_BIG,
    }),
  patient: z.object({
    name: z.string().min(1, VALIDATION_TEXT.NAME_REQUIRED),
    age: z.preprocess((val) => {
      if (val === '') return undefined
      return Number(val)
    }, z.number({
      required_error: VALIDATION_TEXT.AGE_REQUIRED,
      invalid_type_error: VALIDATION_TEXT.AGE_INVALID,
    }).min(0, VALIDATION_TEXT.AGE_INVALID).max(150, VALIDATION_TEXT.AGE_INVALID)),
    shortDescription: z.string().min(1, VALIDATION_TEXT.SHORT_DESC_REQUIRED),
    longDescription: z.string().min(1, VALIDATION_TEXT.LONG_DESC_REQUIRED),
    definingTraits: z.string().min(1, VALIDATION_TEXT.TRAITS_REQUIRED),
    backStory: z.string().min(1, VALIDATION_TEXT.BACKSTORY_REQUIRED),
    personality: z.string().min(1, VALIDATION_TEXT.PERSONALITY_REQUIRED),
    appearance: z.string().min(1, VALIDATION_TEXT.APPEARANCE_REQUIRED),
    motivation: z.string().min(1, VALIDATION_TEXT.MOTIVATION_REQUIRED),
    moodAndCurrentEmotions: z.string().min(1, VALIDATION_TEXT.MOOD_REQUIRED),
    isActive: z.boolean().default(true),
  }),
})

type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)

const initialValues: FormInput = {
  avatar: null,
  patient: {
    name: '',
    age: undefined,
    shortDescription: '',
    longDescription: '',
    definingTraits: '',
    backStory: '',
    personality: '',
    appearance: '',
    motivation: '',
    moodAndCurrentEmotions: '',
    isActive: true,
  },
}

const nuxtApp = useNuxtApp()
const { updatePatient } = usePatient()

// Fetch patient data
const fetchPatientData = async () => {
  try {
    const record = await nuxtApp.$pb.collection('patients').getOne(patientId)
    if (record) {
      // Then set other fields
      setFieldValue('patient', {
        name: record.name,
        age: record.age,
        shortDescription: record.shortDescription,
        longDescription: record.longDescription,
        definingTraits: record.definingTraits,
        backStory: record.backStory,
        personality: record.personality,
        appearance: record.appearance,
        motivation: record.motivation,
        moodAndCurrentEmotions: record.moodAndCurrentEmotions,
        isActive: record.isActive ?? true,
      })

      // If avatar exists, create a File object from the URL
      if (record.avatar) {
        const avatarUrl = `http://localhost:8090/api/files/patients/${patientId}/${record.avatar}`
        const response = await fetch(avatarUrl)
        const blob = await response.blob()
        const file = new File([blob], record.avatar, { type: blob.type })
        setFieldValue('avatar', file)
      }
    }
  }
  catch (error) {
    console.error('Error fetching patient:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در دریافت اطلاعات بیمار پیش آمد.',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

const currentAvatar = computed(() => {
  if (!patientId)
    return '/img/avatars/default-male.jpg'

  if (values.value?.avatar instanceof File)
    return URL.createObjectURL(values.value.avatar)

  if (values.value?.avatar)
    return `http://localhost:8090/api/files/patients/${patientId}/${values.value.avatar}`

  return '/img/avatars/default-male.jpg'
})

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
} = useForm<FormInput>({
  validationSchema,
  initialValues,
})

const success = ref(false)

const inputFile = ref<FileList | null>(null)
const fileError = useFieldError('avatar')
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  setFieldValue('avatar', file)
})

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    return confirm('شما تغییرات ذخیره‌نشده دارید. آیا مطمئن هستید که می‌خواهید خارج شوید؟')
  }
})

const toaster = useToaster()

const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    try {
      const formData = new FormData()
      if (values.avatar instanceof File)
        formData.append('avatar', values.avatar)

      const patientData = {
        name: values.patient.name,
        age: values.patient.age,
        shortDescription: values.patient.shortDescription,
        longDescription: values.patient.longDescription,
        definingTraits: values.patient.definingTraits,
        backStory: values.patient.backStory,
        personality: values.patient.personality,
        appearance: values.patient.appearance,
        motivation: values.patient.motivation,
        moodAndCurrentEmotions: values.patient.moodAndCurrentEmotions,
        isActive: values.patient.isActive,
      }

      // Add all patient data fields to FormData
      Object.entries(patientData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert boolean to string 'true'/'false' for FormData
          const formValue = typeof value === 'boolean' ? value.toString() : value
          formData.append(key, formValue)
        }
      })

      const { updatePatient } = usePatient()
      const record = await updatePatient(patientId, formData)

      toaster.clearAll()
      toaster.show({
        title: 'موفقیت',
        message: 'اطلاعات بیمار با موفقیت به‌روزرسانی شد!',
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })

      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      success.value = true
      setTimeout(() => {
        success.value = false
      }, 3000)
    }
    catch (error: any) {
      console.error('patient-update-error', error)

      if (error.data && error.data.data) {
        const backendErrors = error.data.data
        for (const key in backendErrors) {
          setFieldError(`patient.${key}`, backendErrors[key].message)
        }
      }

      toaster.clearAll()
      toaster.show({
        title: 'خطا',
        message: 'مشکلی در به‌روزرسانی بیمار پیش آمد. لطفاً دوباره تلاش کنید.',
        color: 'danger',
        icon: 'lucide:alert-triangle',
        closable: true,
      })

      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  },
  () => {
    success.value = false

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)

// Fetch patient data when component is mounted
onMounted(() => {
  if (patientId) {
    fetchPatientData()
  }
})
</script>

<template>
  <div>
    <div class="mb-4 flex flex-col justify-end md:flex-row md:items-center">
      <div
        class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
      >
        <BaseButtonAction class="gap-2" @click.prevent="$router.back()">
          <Icon name="lucide:arrow-right" class="size-3" />
          <span>بازگشت</span>
        </BaseButtonAction>
      </div>
    </div>

    <BaseCard>
      <form
        method="POST"
        action=""
        class="divide-muted-200 dark:divide-muted-700 grid divide-x sm:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <div
          rounded="lg"
          class="bg-muted-50 dark:bg-muted-800/60 space-y-8 p-10"
        >
          <div class="mx-auto flex w-full max-w-[410px] flex-col">
            <div>
              <div
                class="relative mb-5 flex flex-col items-center justify-center gap-4"
              >
                <BaseFullscreenDropfile
                  v-model="inputFile"
                  :error="fileError"
                  :preview-url="currentAvatar"
                  :disabled="!isAdmin"
                  class="mx-auto size-20"
                />
              </div>
              <div class="grid grid-cols-12 gap-4">
                <!-- Name -->
                <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.name"
                  >
                    <BaseInput
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="نام"
                      placeholder="نام بیمار را وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Age -->
                <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.age"
                  >
                    <BaseInput
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="سن"
                      type="number"
                      placeholder="سن بیمار را وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Short Description -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.shortDescription"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="توضیح کوتاه"
                      placeholder="یک توضیح کوتاه در مورد بیمار وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Long Description -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.longDescription"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="توضیح بلند"
                      placeholder="یک توضیح کامل در مورد بیمار وارد کنید"
                      rows="4"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Defining Traits -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.definingTraits"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="ویژگی‌های تعریف‌کننده"
                      placeholder="ویژگی‌های تعریف‌کننده بیمار را وارد کنید"
                      rows="4"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Back Story -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.backStory"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      :disabled="!isAdmin"
                      label="پیشینه"
                      placeholder="پیشینه بیمار را وارد کنید"
                      rows="4"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div rounded="lg" class="w-full space-y-8 p-10">
          <div class="mx-auto w-full max-w-[410px] sm:pt-28">
            <div class="grid grid-cols-12 gap-4">
              <!-- Personality -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="patient.personality"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    :disabled="!isAdmin"
                    label="شخصیت"
                    placeholder="شخصیت بیمار را وارد کنید"
                    rows="4"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>

              <!-- Appearance -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="patient.appearance"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    :disabled="!isAdmin"
                    label="ظاهر"
                    placeholder="ظاهر بیمار را وارد کنید"
                    rows="4"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>

              <!-- Motivation -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="patient.motivation"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    :disabled="!isAdmin"
                    label="انگیزه"
                    placeholder="انگیزه بیمار را وارد کنید"
                    rows="4"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>

              <!-- Mood and Current Emotions -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="patient.moodAndCurrentEmotions"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    :disabled="!isAdmin"
                    label="حالت روحی و احساسات فعلی"
                    placeholder="حالت روحی و احساسات فعلی بیمار را وارد کنید"
                    rows="4"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>

            <div v-if="isAdmin" class="mt-6 flex justify-between gap-2">
              <div class="flex items-center justify-between">
                <BaseSwitchThin
                  :model-value="values?.patient?.isActive ?? false"
                  :disabled="!isAdmin"
                  label="وضعیت بیمار"
                  help="بیمار فعال است یا غیر فعال"
                  @update:model-value="(val) => setFieldValue('patient.isActive', val)"
                >
                  <span class="text-muted-400 dark:text-muted-400 text-sm">
                    {{ values?.patient?.isActive ? 'فعال' : 'غیر فعال' }}
                  </span>
                </BaseSwitchThin>
              </div>
              <BaseButton
                type="submit"
                color="primary"
                :loading="isSubmitting"
              >
                به‌روزرسانی
              </BaseButton>
            </div>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
