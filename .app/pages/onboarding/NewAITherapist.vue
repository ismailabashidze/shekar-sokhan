<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

useHead({ htmlAttrs: { dir: 'rtl' } })

definePageMeta({
  title: 'فرم روانشناس هوش مصنوعی جدید',
  layout: 'sidebar',
})

const VALIDATION_TEXT = {
  NAME_REQUIRED: 'نام روانشناس نمی‌تواند خالی باشد',
  SPECIALTY_REQUIRED: 'تخصص روانشناس نمی‌تواند خالی باشد',
  SHORT_DESC_REQUIRED: 'توضیح کوتاه نمی‌تواند خالی باشد',
  LONG_DESC_REQUIRED: 'توضیح بلند نمی‌تواند خالی باشد',
  TRAITS_REQUIRED: 'ویژگی‌های تعریف‌کننده نمی‌تواند خالی باشد',
  BACKSTORY_REQUIRED: 'پیشینه نمی‌تواند خالی باشد',
  PERSONALITY_REQUIRED: 'شخصیت نمی‌تواند خالی باشد',
  APPEARANCE_REQUIRED: 'ظاهر نمی‌تواند خالی باشد',
  APPROACH_REQUIRED: 'رویکرد درمانی نمی‌تواند خالی باشد',
  EXPERTISE_REQUIRED: 'تخصص و مهارت‌ها نمی‌تواند خالی باشد',
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
  therapist: z.object({
    name: z.string().min(1, VALIDATION_TEXT.NAME_REQUIRED),
    specialty: z.string().min(1, VALIDATION_TEXT.SPECIALTY_REQUIRED),
    shortDescription: z.string().min(1, VALIDATION_TEXT.SHORT_DESC_REQUIRED),
    longDescription: z.string().min(1, VALIDATION_TEXT.LONG_DESC_REQUIRED),
    definingTraits: z.string().min(1, VALIDATION_TEXT.TRAITS_REQUIRED),
    backStory: z.string().min(1, VALIDATION_TEXT.BACKSTORY_REQUIRED),
    personality: z.string().min(1, VALIDATION_TEXT.PERSONALITY_REQUIRED),
    appearance: z.string().min(1, VALIDATION_TEXT.APPEARANCE_REQUIRED),
    approach: z.string().min(1, VALIDATION_TEXT.APPROACH_REQUIRED),
    expertise: z.string().min(1, VALIDATION_TEXT.EXPERTISE_REQUIRED),
    isActive: z.boolean().default(true),
  }),
})

type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)

const initialValues: FormInput = {
  avatar: null,
  therapist: {
    name: '',
    specialty: '',
    shortDescription: '',
    longDescription: '',
    definingTraits: '',
    backStory: '',
    personality: '',
    appearance: '',
    approach: '',
    expertise: '',
    isActive: true,
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
const generating = ref(false)
const loadingFields = ref<string[]>([])

const inputFile = ref<FileList | null>(null)
const fileError = useFieldError('avatar')
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  setFieldValue('avatar', file)
})

const { generateTherapist } = useOpenRouter()

const canGenerate = computed(() => {
  return Boolean(
    values.therapist.name?.trim()
    && values.therapist.specialty?.trim()
    && values.therapist.shortDescription?.trim()
    && !generating.value,
  )
})

const generateDetails = async () => {
  // Prevent multiple simultaneous generations
  if (generating.value) {
    return
  }

  // Check if required fields are filled
  if (!values.therapist.name || !values.therapist.specialty || !values.therapist.shortDescription) {
    toaster.error('لطفا نام، تخصص و توضیح کوتاه را وارد کنید')
    return
  }

  generating.value = true
  // Set loading state for fields that will be generated
  loadingFields.value = ['longDescription', 'definingTraits', 'backStory', 'personality', 'appearance', 'approach', 'expertise']

  try {
    const response = await generateTherapist({
      name: values.therapist.name,
      specialty: values.therapist.specialty,
      shortDescription: values.therapist.shortDescription,
    })

    // Parse the response if it's in JSON format
    let parsedResponse
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response)
        if (parsed.choices?.[0]?.message?.content) {
          parsedResponse = JSON.parse(parsed.choices[0].message.content)
        }
      }
      catch (e) {
        console.error('Error parsing response:', e)
        throw new Error('خطا در پردازش پاسخ')
      }
    }
    else {
      parsedResponse = response
    }

    // Update form fields with generated content
    if (parsedResponse) {
      Object.entries(parsedResponse).forEach(([key, value]) => {
        if (typeof value === 'string') {
          setFieldValue(`therapist.${key}`, value.trim())
        }
      })

      toaster.clearAll()
      toaster.show({
        title: 'تولید موفق',
        message: 'اطلاعات روانشناس با موفقیت تولید شد',
        color: 'success',
        icon: 'ph:user-circle-fill',
        closable: true,
      })
    }
  }
  catch (error: any) {
    console.error('Error generating details:', error)
    // Clear any partially generated content
    loadingFields.value.forEach((field) => {
      setFieldValue(`therapist.${field}`, '')
    })

    toaster.clearAll()
    toaster.show({
      title: 'خطا',
      message: error?.message || error?.data?.message || 'خطا در تولید اطلاعات',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    generating.value = false
    loadingFields.value = []
  }
}

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    return confirm('شما تغییرات ذخیره‌نشده دارید. آیا مطمئن هستید که می‌خواهید خارج شوید؟')
  }
})

const toaster = useToaster()
const { createNewTherapist } = useTherapist()

const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    try {
      const therapistData = {
        name: values.therapist.name,
        specialty: values.therapist.specialty,
        shortDescription: values.therapist.shortDescription,
        longDescription: values.therapist.longDescription,
        definingTraits: values.therapist.definingTraits,
        backStory: values.therapist.backStory,
        personality: values.therapist.personality,
        appearance: values.therapist.appearance,
        approach: values.therapist.approach,
        expertise: values.therapist.expertise,
        isActive: values.therapist.isActive,
      }

      let record
      if (values.avatar) {
        const formData = new FormData()
        formData.append('avatar', values.avatar)

        for (const key in therapistData) {
          formData.append(key, therapistData[key as keyof typeof therapistData] || '')
        }

        record = await createNewTherapist(formData)
      }
      else {
        record = await createNewTherapist(therapistData)
      }

      toaster.clearAll()
      toaster.show({
        title: 'موفقیت',
        message: 'روانشناس هوش مصنوعی جدید با موفقیت ایجاد شد!',
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
      console.error('therapist-create-error', error)

      if (error.data && error.data.data) {
        const backendErrors = error.data.data
        for (const key in backendErrors) {
          setFieldError(`therapist.${key}`, backendErrors[key].message)
        }
      }

      toaster.clearAll()
      toaster.show({
        title: 'خطا',
        message: 'مشکلی در ایجاد روانشناس هوش مصنوعی پیش آمد. لطفاً دوباره تلاش کنید.',
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

const therapistStatus = computed(() => values.therapist.isActive ? 'روانشناس فعال است' : 'روانشناس غیرفعال است')
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
                    name="therapist.name"
                  >
                    <BaseInput
                      v-model="field.value"
                      :error="errorMessage"
                      label="نام"
                      placeholder="نام روانشناس را وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Specialty -->
                <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="therapist.specialty"
                  >
                    <BaseInput
                      v-model="field.value"
                      :error="errorMessage"
                      label="تخصص"
                      placeholder="تخصص روانشناس را وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Short Description -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="therapist.shortDescription"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      label="توضیح کوتاه"
                      placeholder="یک توضیح کوتاه در مورد روانشناس وارد کنید"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Generate Button -->
                <div class="col-span-12 flex justify-end">
                  <BaseButton
                    type="button"
                    color="primary"
                    :loading="generating"
                    :disabled="!canGenerate"
                    @click="generateDetails"
                  >
                    <Icon name="ph:magic-wand" class="ml-2 size-4" />
                    <span>تولید خودکار سایر اطلاعات</span>
                  </BaseButton>
                </div>

                <!-- Long Description -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="therapist.longDescription"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      label="توضیح بلند"
                      placeholder="یک توضیح کامل در مورد روانشناس وارد کنید"
                      rows="4"
                      :loading="loadingFields.includes('longDescription')"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Defining Traits -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="therapist.definingTraits"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      label="ویژگی‌های تعریف‌کننده"
                      placeholder="ویژگی‌های تعریف‌کننده روانشناس را وارد کنید"
                      rows="4"
                      :loading="loadingFields.includes('definingTraits')"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <!-- Back Story -->
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="therapist.backStory"
                  >
                    <BaseTextarea
                      v-model="field.value"
                      :error="errorMessage"
                      label="پیشینه"
                      placeholder="پیشینه روانشناس را وارد کنید"
                      rows="4"
                      :loading="loadingFields.includes('backStory')"
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
                  name="therapist.personality"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    label="شخصیت"
                    placeholder="خصوصیات شخصیتی روانشناس را وارد کنید"
                    rows="5"
                    :loading="loadingFields.includes('personality')"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <!-- Appearance -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="therapist.appearance"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    label="ظاهر"
                    placeholder="توصیف ظاهری روانشناس را وارد کنید"
                    rows="5"
                    :loading="loadingFields.includes('appearance')"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <!-- Approach -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="therapist.approach"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    label="رویکرد درمانی"
                    placeholder="رویکرد و روش درمانی روانشناس را وارد کنید"
                    rows="5"
                    :loading="loadingFields.includes('approach')"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <!-- Expertise -->
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="therapist.expertise"
                >
                  <BaseTextarea
                    v-model="field.value"
                    :error="errorMessage"
                    label="تخصص و مهارت‌ها"
                    placeholder="تخصص و مهارت‌های روانشناس را وارد کنید"
                    rows="5"
                    :loading="loadingFields.includes('expertise')"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
            <div
              class="mt-5 flex flex-row justify-between gap-4 md:space-x-3"
            >
              <div class="flex items-center justify-between">
                <BaseSwitchThin
                  :model-value="values.therapist.isActive"
                  label="وضعیت روانشناس"
                  :sublabel="values.therapist.isActive ? 'روانشناس فعال است' : 'روانشناس غیرفعال است'"
                  @update:model-value="(val) => setFieldValue('therapist.isActive', val)"
                />
              </div>
              <BaseButton
                type="submit"
                color="primary"
                class="!ml-0 !h-12 w-full sm:w-40"
              >
                ایجاد روانشناس
              </BaseButton>
            </div>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
