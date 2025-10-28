<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';

definePageMeta({
  layout: 'empty',
  title: 'ثبت نام پژوهشگر',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const VALIDATION_TEXT = {
  FIRST_NAME_REQUIRED: 'نام نیاز است',
  LAST_NAME_REQUIRED: 'نام خانوادگی نیاز است',
  EMAIL_REQUIRED: 'آدرس ایمیل نیاز است',
  EMAIL_INVALID: 'یک ایمیل معتبر وارد کنید',
  PHONE_REQUIRED: 'شماره تماس نیاز است',
  PHONE_INVALID: 'شماره تماس معتبر نیست',
  INSTITUTION_REQUIRED: 'نام موسسه/دانشگاه نیاز است',
  FIELD_REQUIRED: 'حوزه پژوهشی نیاز است',
  DEGREE_REQUIRED: 'مقطع تحصیلی نیاز است',
  TERMS_REQUIRED: 'لطفاً قوانین و شرایط استفاده را مطالعه و بپذیرید',
};

const zodSchema = z.object({
  firstName: z.string({ required_error: VALIDATION_TEXT.FIRST_NAME_REQUIRED }).min(1, VALIDATION_TEXT.FIRST_NAME_REQUIRED),
  lastName: z.string({ required_error: VALIDATION_TEXT.LAST_NAME_REQUIRED }).min(1, VALIDATION_TEXT.LAST_NAME_REQUIRED),
  email: z.string({ required_error: VALIDATION_TEXT.EMAIL_REQUIRED }).min(1, VALIDATION_TEXT.EMAIL_REQUIRED).email(VALIDATION_TEXT.EMAIL_INVALID),
  phone: z.string({ required_error: VALIDATION_TEXT.PHONE_REQUIRED }).min(1, VALIDATION_TEXT.PHONE_REQUIRED).regex(/^09\d{9}$/, VALIDATION_TEXT.PHONE_INVALID),
  institution: z.string({ required_error: VALIDATION_TEXT.INSTITUTION_REQUIRED }).min(1, VALIDATION_TEXT.INSTITUTION_REQUIRED),
  researchField: z.string({ required_error: VALIDATION_TEXT.FIELD_REQUIRED }).min(1, VALIDATION_TEXT.FIELD_REQUIRED),
  academicDegree: z.string({ required_error: VALIDATION_TEXT.DEGREE_REQUIRED }).min(1, VALIDATION_TEXT.DEGREE_REQUIRED),
  experience: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
  message: 'لطفاً قوانین و شرایط استفاده را مطالعه و بپذیرید',
  }),
});

type FormInput = z.infer<typeof zodSchema>;

const validationSchema = toTypedSchema(zodSchema);
const initialValues = computed<FormInput>(() => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  institution: '',
  researchField: '',
  academicDegree: '',
  experience: '',
  acceptTerms: false,
}));

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  errors,
  validate,
} = useForm({
  validationSchema,
});

const router = useRouter();
const toaster = useToaster();

const validateAndSubmit = async () => {
  // Validate all fields with vee-validate
  const validationResult = await validate();
  
  // Check if terms are accepted
  const checkboxElement = document.querySelector('input[type="checkbox"]');
  const isTermsChecked = checkboxElement?.checked;
  
  // If terms not checked, show specific toast
  if (!isTermsChecked) {
    toaster.clearAll();
    toaster.show({
      title: 'قوانین استفاده',
      message: 'لطفاً قوانین و شرایط استفاده را مطالعه و بپذیرید',
      color: 'danger',
      icon: 'ph:warning-fill',
      closable: true,
    });
    return;
  }
  
  // If validation has other errors, show general toast (field errors will show automatically)
  if (!validationResult.valid) {
    toaster.clearAll();
    toaster.show({
      title: 'خطا در اطلاعات',
      message: 'لطفاً تمام فیلدهای الزامی را کامل کنید.',
      color: 'danger',
      icon: 'ph:warning-fill',
      closable: true,
    });
    return;
  }

  // If valid, proceed with submission
  await handleSubmit(onSubmit)();
};

const onSubmit = async (values: FormInput) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toaster.clearAll();
    toaster.show({
      title: 'ثبت نام موفق',
      message: 'درخواست پژوهشگری شما با موفقیت ثبت شد. پس از بررسی، ایمیل تأیید برای شما ارسال خواهد شد.',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });

    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  }
  catch (error: any) {
    toaster.show({
      title: 'خطا در ثبت نام',
      message: error.message || 'متاسفانه مشکلی در ثبت نام پیش آمد. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-fill',
      closable: true,
    });
  }
};

const academicDegrees = [
  'کارشناسی',
  'کارشناسی ارشد',
  'دکتری',
  'فوق دکتری',
  'استادیار',
  'دانشیار',
  'استاد',
];

const researchFields = [
  'روانشناسی بالینی',
  'روانشناسی رشد',
  'روانشناسی شناختی',
  'روانشناسی اجتماعی',
  'روانشناسی industrial-organizational',
  'عصب‌شناسی',
  'روانپزشکی',
  'مشاوره',
  'سایر',
];
</script>

<template>
  <div class="dark:bg-muted-800 flex min-h-screen bg-white">
    <div
      class="bg-muted-100 dark:bg-muted-900 relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-3/5"
    >
      <div
        class="mx-auto flex size-full max-w-4xl items-center justify-center"
      >
        <!--Media image-->
        <img
          class="mx-auto max-w-xl rounded-md"
          src="/img/illustrations/man-looking.svg"
          alt=""
          width="600"
          height="500"
        >
      </div>
    </div>
    <div
      class="relative flex flex-1 flex-col justify-center px-6 py-8 lg:w-2/5 lg:flex-none"
    >
      <div class="dark:bg-muted-800 relative mx-auto w-full max-w-md bg-white">
        <!--Nav-->
        <div class="flex w-full items-center justify-between">
          <NuxtLink
            to="/"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-colors duration-300"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به صفحه اصلی</span>
          </NuxtLink>
          <!--Theme button-->
          <BaseThemeToggle />
        </div>

        <div>
          <BaseHeading
            as="h2"
            size="3xl"
            lead="relaxed"
            weight="medium"
            class="mt-6"
          >
            ثبت نام پژوهشگر
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6 mt-3">
            برای دسترسی به ابزارهای پژوهشی و تحلیل داده، فرم زیر را تکمیل کنید.
          </BaseParagraph>
        </div>

        <!--Form section-->
        <div class="mt-5">
          <form
            method="POST"
            action=""
            class="mt-6"
            novalidate
          >
            <div class="space-y-4">
              <!-- Name Fields -->
              <div class="grid grid-cols-2 gap-4">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="firstName"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    label="نام"
                    placeholder="نام"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="lastName"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    label="نام خانوادگی"
                    placeholder="نام خانوادگی"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>

              <!-- Email -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="email"
              >
                <BaseInput
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  type="email"
                  label="آدرس ایمیل"
                  placeholder="example@email.com"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Phone -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="phone"
              >
                <BaseInput
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  type="tel"
                  label="شماره تماس"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Institution -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="institution"
              >
                <BaseInput
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  type="text"
                  label="موسسه/دانشگاه"
                  placeholder="نام موسسه یا دانشگاه"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Academic Degree -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="academicDegree"
              >
                <BaseListbox
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  label="مقطع تحصیلی"
                  placeholder="مقطع تحصیلی را انتخاب کنید"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                  :items="academicDegrees"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Research Field -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="researchField"
              >
                <BaseListbox
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  label="حوزه پژوهشی"
                  placeholder="حوزه پژوهشی خود را انتخاب کنید"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                  :items="researchFields"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Experience -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="experience"
              >
                <BaseTextarea
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  label="سابقه پژوهشی (اختیاری)"
                  placeholder="توضیحاتی در مورد سابقه و زمینه‌های پژوهشی خود بنویسید..."
                  shape="curved"
                  :rows="3"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <!-- Terms -->
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="acceptTerms"
              >
                <BaseCheckbox
                  :model-value="field.value"
                  :disabled="isSubmitting"
                  shape="curved"
                  color="primary"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                >
                  <span class="text-sm">
                    با ثبت نام،
                    <NuxtLink
                      to="/hampazhooh/terms"
                      class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                    >
                      قوانین استفاده
                    </NuxtLink>
                    و
                    <NuxtLink
                      to="/hampazhooh/privacy"
                      class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                    >
                      قوانین حریم خصوصی
                    </NuxtLink>
                    را می‌پذیرم.
                  </span>
                </BaseCheckbox>
              </Field>
            </div>
          </form>

          <!--Submit-->
            <div class="mt-6">
              <div class="block w-full rounded-md shadow-sm">
                <BaseButton
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  type="button"
                  color="primary"
                  shape="curved"
                  class="!h-11 w-full"
                  @click="validateAndSubmit"
                >
                  ثبت نام پژوهشگر
                </BaseButton>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
