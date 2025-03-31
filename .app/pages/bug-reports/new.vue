<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { ref } from 'vue'

definePageMeta({
  title: 'گزارش خطا',
  preview: {
    title: 'Bug Report Form',
    description: 'For reporting bugs and issues',
    categories: ['layouts', 'forms'],
    src: '/img/screens/layouts-form-4.png',
    srcDark: '/img/screens/layouts-form-4-dark.png',
    order: 50,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const VALIDATION_TEXT = {
  TITLE_REQUIRED: 'عنوان خطا باید حداقل ۵ کاراکتر باشد',
  SHORTDESC_REQUIRED: 'توضیح مختصر باید حداقل ۱۰ کاراکتر باشد',
  LONGDESC_REQUIRED: 'توضیح کامل باید حداقل ۴۰ کاراکتر باشد',
  OPTION_REQUIRED: 'لطفاً یک گزینه را انتخاب کنید',
  PRIORITY_REQUIRED: 'انتخاب اولویت الزامی است',
  CATEGORY_REQUIRED: 'انتخاب دسته‌بندی الزامی است',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    bug: z.object({
      title: z.string().min(5, VALIDATION_TEXT.TITLE_REQUIRED),
      shortDesc: z.string().min(10, VALIDATION_TEXT.SHORTDESC_REQUIRED),
      longDesc: z.string().min(40, VALIDATION_TEXT.LONGDESC_REQUIRED),
      steps: z.array(z.string()).optional(),
      priority: z.string().min(1, VALIDATION_TEXT.PRIORITY_REQUIRED),
      category: z.string().min(1, VALIDATION_TEXT.CATEGORY_REQUIRED),
      date: z.object({
        reported: z.date().nullable(),
      }),
    }),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (!data.bug.steps || data.bug.steps.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['bug.steps'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  bug: {
    title: '',
    shortDesc: '',
    longDesc: '',
    steps: [],
    priority: '',
    category: '',
    date: {
      reported: null,
    },
  },
}

const { resetForm, meta, values, validate, errors } = useForm({
  validationSchema,
  initialValues,
})

const { createBugReport } = useBugReportApi()
const { user } = useUser()
const router = useRouter()
const toaster = useToaster()
const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Get values from the form
    const bugData = {
      title: values.bug?.title || '',
      shortDesc: values.bug?.shortDesc || '',
      longDesc: values.bug?.longDesc || '',
      priority: values.bug?.priority || '',
      category: values.bug?.category || '',
      user: user.value?.id,
    }

    // Log the data being submitted
    console.log('Submitting bug report:', bugData)

    // Validate manually if needed
    if (!bugData.title || bugData.title.length < 5) {
      throw new Error(VALIDATION_TEXT.TITLE_REQUIRED)
    }
    if (!bugData.shortDesc || bugData.shortDesc.length < 10) {
      throw new Error(VALIDATION_TEXT.SHORTDESC_REQUIRED)
    }
    if (!bugData.longDesc || bugData.longDesc.length < 40) {
      throw new Error(VALIDATION_TEXT.LONGDESC_REQUIRED)
    }
    if (!bugData.priority) {
      throw new Error(VALIDATION_TEXT.PRIORITY_REQUIRED)
    }
    if (!bugData.category) {
      throw new Error(VALIDATION_TEXT.CATEGORY_REQUIRED)
    }

    // Submit to API
    await createBugReport(bugData)

    toaster.show({
      title: 'موفقیت',
      message: 'گزارش خطا با موفقیت ثبت شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    resetForm()
    router.push('/bug-reports')
  }
  catch (error) {
    console.error('Error submitting bug report:', error)
    toaster.show({
      title: 'خطا',
      message: error instanceof Error ? error.message : 'خطا در ثبت گزارش. لطفا دوباره تلاش کنید',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
  finally {
    isSubmitting.value = false
  }
}

// Ask the user for confirmation before leaving the page if the form has unsaved changes
onBeforeRouteLeave((to, from, next) => {
  // Only show confirmation if form has unsaved changes
  if (meta.value && meta.value.dirty) {
    if (confirm('تغییرات ذخیره نشده دارید. آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      next()
    }
    else {
      next(false)
    }
  }
  else {
    next()
  }
})

</script>

<template>
  <form
    action=""
    method="POST"
    class="relative py-3 sm:mx-auto sm:max-w-xl"
    @submit.prevent
  >
    <BaseCard rounded="lg" class="relative px-4 py-10 sm:p-10 md:mx-0">
      <div class="mx-auto max-w-md">
        <div class="flex items-center gap-4">
          <div
            class="bg-danger-500/20 text-danger-500 flex size-14 shrink-0 items-center justify-center rounded-full font-sans text-2xl"
          >
            <Icon name="ph:bug-duotone" class="size-5" />
          </div>
          <div class="block text-xl font-semibold text-gray-700">
            <BaseHeading
              as="h3"
              size="lg"
              weight="medium"
            >
              گزارش خطا
            </BaseHeading>
            <BaseText
              size="sm"
              class="text-muted-400"
            >
              گزارش مشکلات و خطاهای سیستم
            </BaseText>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="grid grid-cols-12 gap-4 py-8">
            <div class="col-span-12">
              <BaseMessage
                title="توضیحات"
                size="lg"
                weight="medium"
                color="info"
                class="text-justify"
              >
                لطفا مراحل ایجاد باگ را به صورت شفاف و گام به گام بنویسید. هر چقدر جزییات بیشتری را با ما در میان بگذارید راحت تر می توانیم خطای گزارش شده را بفهمیم و رفع کنیم.
              </BaseMessage>
            </div>
            <div class="relative z-20 col-span-12">
              <Field
                v-slot="{
                  field,
                  errorMessage,
                  handleChange,
                }"
                name="bug.date"
              >
                <div class="flex w-full flex-col gap-4 sm:flex-row">
                  <div class="relative grow">
                    <BaseInput
                      rounded="lg"
                      label="تاریخ گزارش"
                      icon="ph:calendar-blank-duotone"
                      :model-value="new Date().toLocaleDateString('fa-IR')"
                      :classes="{
                        input: '!h-11 !ps-11',
                        icon: '!h-11 !w-11',
                      }"
                      :error="errorMessage"
                      :disabled="true"
                      type="text"
                    />
                  </div>
                  <div class="relative grow">
                    <BaseInput
                      rounded="lg"
                      label="زمان گزارش"
                      icon="ph:clock-duotone"
                      :model-value="new Date().toLocaleTimeString('fa-IR')"
                      :classes="{
                        input: '!h-11 !ps-11',
                        icon: '!h-11 !w-11',
                      }"
                      :disabled="true"
                      type="text"
                    />
                  </div>
                </div>
              </Field>
            </div>
            <div class="col-span-12">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="bug.title"
              >
                <BaseInput
                  label="عنوان خطا"
                  rounded="lg"
                  icon="ph:warning-duotone"
                  placeholder="مثال: خطا در بارگذاری صفحه پروفایل"
                  :classes="{
                    input: '!h-11 !ps-11',
                    icon: '!h-11 !w-11',
                  }"
                  :model-value="field.value"
                  :error="errorMessage"
                  type="text"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
            <div class="col-span-12">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="bug.shortDesc"
              >
                <BaseInput
                  label="توضیح مختصر"
                  rounded="lg"
                  icon="ph:note-pencil-duotone"
                  placeholder="مثال: صفحه پروفایل بارگذاری نمی‌شود"
                  :classes="{
                    input: '!h-11 !ps-11',
                    icon: '!h-11 !w-11',
                  }"
                  :model-value="field.value"
                  :error="errorMessage"
                  type="text"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>

            <div class="col-span-12">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="bug.longDesc"
              >
                <BaseTextarea
                  label="توضیح کامل"
                  rounded="lg"
                  placeholder="مثال:
۱. وارد صفحه پروفایل کاربری شدم
۲. روی دکمه ویرایش اطلاعات کلیک کردم
۳. فرم را پر کردم و دکمه ذخیره را فشار دادم
۴. صفحه سفید شد و هیچ پیامی نمایش داده نشد
۵. با رفرش کردن صفحه، تغییرات ذخیره نشده بود"
                  rows="5"
                  :model-value="field.value"
                  :error="errorMessage"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>

            <div class="col-span-12 sm:col-span-6">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="bug.priority"
              >
                <BaseSelect
                  label="اولویت"
                  rounded="lg"
                  icon="ph:flag-duotone"
                  placeholder="اولویت خطا را انتخاب کنید..."
                  :classes="{
                    input: '!h-11 !ps-11',
                    icon: '!h-11 !w-11',
                  }"
                  :model-value="field.value"
                  :error="errorMessage"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                >
                  <option value="">
                    انتخاب کنید
                  </option>
                  <option value="critical">
                    بحرانی
                  </option>
                  <option value="high">
                    بالا
                  </option>
                  <option value="medium">
                    متوسط
                  </option>
                  <option value="low">
                    پایین
                  </option>
                </BaseSelect>
              </Field>
            </div>
            <div class="col-span-12 sm:col-span-6">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="bug.category"
              >
                <BaseSelect
                  label="دسته‌بندی"
                  rounded="lg"
                  icon="ph:folder-duotone"
                  placeholder="دسته‌بندی خطا را انتخاب کنید..."
                  :classes="{
                    input: '!h-11 !ps-11',
                    icon: '!h-11 !w-11',
                  }"
                  :model-value="field.value"
                  :error="errorMessage"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                >
                  <option value="">
                    انتخاب کنید
                  </option>
                  <option value="ui">
                    رابط کاربری
                  </option>
                  <option value="functionality">
                    عملکرد
                  </option>
                  <option value="performance">
                    کارایی
                  </option>
                  <option value="security">
                    امنیت
                  </option>
                  <option value="other">
                    سایر
                  </option>
                </BaseSelect>
              </Field>
            </div>
          </div>
          <div class="flex items-center gap-4 pt-4">
            <BaseButton
              rounded="lg"
              class="!h-12 w-full"
              @click="router.push('/bug-reports')"
            >
              انصراف
            </BaseButton>
            <BaseButton
              rounded="lg"
              color="danger"
              class="!h-12 w-full"
              type="button"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              @click="submitForm"
            >
              ثبت گزارش
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>
  </form>
</template>
