<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

useHead({ htmlAttrs: { dir: 'rtl' } })

definePageMeta({
  title: 'فرم بیمار جدید',
  layout: 'sidebar',
})

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
  }),
})

type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)

const initialValues: FormInput = {
  avatar: null,
  patient: {
    name: '',
    age: '',
    shortDescription: '',
    longDescription: '',
    definingTraits: '',
    backStory: '',
    personality: '',
    appearance: '',
    motivation: '',
    moodAndCurrentEmotions: '',
  },
}

const currentAvatar = computed(() => '/img/avatars/default-male.jpg')

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
const { createNewPatient } = usePatient()

const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    try {
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
      }

      let record
      if (values.avatar) {
        const formData = new FormData()
        formData.append('avatar', values.avatar)

        for (const key in patientData) {
          formData.append(key, patientData[key as keyof typeof patientData] || '')
        }

        record = await createNewPatient(formData)
      }
      else {
        record = await createNewPatient(patientData)
      }

      toaster.clearAll()
      toaster.show({
        title: 'موفقیت',
        message: 'بیمار جدید با موفقیت ایجاد شد!',
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })

      resetForm()
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
      console.error('patient-create-error', error)

      if (error.data && error.data.data) {
        const backendErrors = error.data.data
        for (const key in backendErrors) {
          setFieldError(`patient.${key}`, backendErrors[key].message)
        }
      }

      toaster.clearAll()
      toaster.show({
        title: 'خطا',
        message: 'مشکلی در ایجاد بیمار پیش آمد. لطفاً دوباره تلاش کنید.',
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
                  icon="ph:image-duotone"
                  :filter-file-dropped="
                    (file) => file.type.startsWith('image')
                  "
                  @drop="
                    (value) => {
                      inputFile = value
                    }
                  "
                />
                <BaseInputFileHeadless
                  v-slot="{ open, remove, preview, files }"
                  v-model="inputFile"
                  accept="image/*"
                >
                  <div class="relative size-20">
                    <img
                      v-if="files?.length && files.item(0)"
                      :src="preview(files.item(0)!).value"
                      alt="Upload preview"
                      class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
                    >
                    <img
                      v-else
                      :src="currentAvatar"
                      alt="Upload preview"
                      class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center dark:invert"
                    >
                    <div
                      v-if="files?.length && files.item(0)"
                      class="absolute bottom-0 end-0 z-20"
                    >
                      <BaseButtonIcon
                        size="sm"
                        rounded="full"
                        data-nui-tooltip="حذف تصویر"
                        class="scale-90"
                        @click="remove(files.item(0)!)"
                      >
                        <Icon name="lucide:x" class="size-4" />
                      </BaseButtonIcon>
                    </div>
                    <div v-else class="absolute bottom-0 end-0 z-20">
                      <div class="relative" data-nui-tooltip="آپلود تصویر">
                        <BaseButtonIcon
                          size="sm"
                          rounded="full"
                          @click="open"
                        >
                          <Icon name="lucide:plus" class="size-4" />
                        </BaseButtonIcon>
                      </div>
                    </div>
                  </div>
                </BaseInputFileHeadless>
                <div
                  v-if="fileError"
                  class="text-danger-600 inline-block font-sans text-[.8rem]"
                >
                  {{ fileError }}
                </div>
              </div>
              <div class="grid grid-cols-12 gap-4">
                <!-- Name -->
                <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.name"
                  >
                    <BaseInput
                      label="نام"
                      placeholder="نام کامل بیمار را وارد کنید (مثال: علی احمدی)"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
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
                      label="سن"
                      placeholder="سن بیمار را به سال وارد کنید (مثال: ۳۰)"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="number"
                      min="0"
                      max="150"
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
                    <BaseInput
                      label="توضیح کوتاه"
                      placeholder="توضیح مختصری درباره بیمار (مثال: مردی ۳۰ ساله با سابقه بیماری قلبی)"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
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
                      label="توضیح بلند"
                      placeholder="توضیحات کامل درباره وضعیت بیمار، علائم و نشانه‌ها"
                      rows="5"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
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
                      label="ویژگی‌های تعریف‌کننده"
                      placeholder="ویژگی‌ها و خصوصیات بارز بیمار (مثال: بسیار صبور، علاقه‌مند به مطالعه، توانایی حل مسائل پیچیده)"
                      rows="5"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <!-- Backstory -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="patient.backStory"
                  >
                    <BaseTextarea
                      label="پیشینه"
                      placeholder="پیشینه و سوابق بیمار را بنویسید (مثال: در کودکی علاقه زیادی به ریاضیات داشت، در دانشگاه فیزیک خواند و اکنون مهندس است)"
                      rows="5"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
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
                    label="شخصیت"
                    placeholder="خصوصیات شخصیتی بیمار (مثال: مهربان، خوش‌برخورد، اجتماعی)"
                    rows="5"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
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
                    label="ظاهر"
                    placeholder="توصیف ظاهری بیمار (مثال: قد بلند، موهای مشکی، چشمان قهوه‌ای)"
                    rows="5"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
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
                    label="انگیزه"
                    placeholder="انگیزه‌ها و اهداف بیمار (مثال: بهبود سلامتی برای مراقبت از خانواده)"
                    rows="5"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
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
                    label="حالت روحی و احساسات فعلی"
                    placeholder="حالت روحی و احساسات فعلی بیمار را توصیف کنید (مثال: اضطراب، نگرانی درباره آینده، امیدواری)"
                    rows="5"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
            <div
              class="mt-5 flex flex-col-reverse text-right md:block md:space-x-3"
            >
              <BaseButton
                type="submit"
                color="primary"
                class="!h-12 w-full sm:w-40"
              >
                ایجاد بیمار
              </BaseButton>
            </div>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
