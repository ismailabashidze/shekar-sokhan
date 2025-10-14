<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  layout: 'blank',
  title: 'تنظیمات قفل',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()
const toaster = useToaster()
const { setPin, hasPin, removePin } = useLockSystem()
const { user } = useUser()

const VALIDATION_TEXT = {
  PIN_REQUIRED: 'ورود پین الزامی است',
  PIN_LENGTH: 'پین باید ۴ رقمی باشد',
  PIN_INVALID: 'فقط اعداد مجاز است',
  CONFIRM_PIN_REQUIRED: 'تأیید پین الزامی است',
  CONFIRM_PIN_MISMATCH: 'پین‌ها یکسان نیستند',
}

const zodSchema = z.object({
  pin: z.string({ required_error: VALIDATION_TEXT.PIN_REQUIRED })
    .min(4, VALIDATION_TEXT.PIN_LENGTH)
    .max(4, VALIDATION_TEXT.PIN_LENGTH)
    .regex(/^\d{4}$/, VALIDATION_TEXT.PIN_INVALID),
  confirmPin: z.string({ required_error: VALIDATION_TEXT.CONFIRM_PIN_REQUIRED })
    .min(4, VALIDATION_TEXT.PIN_LENGTH)
    .max(4, VALIDATION_TEXT.PIN_LENGTH),
}).refine(data => data.pin === data.confirmPin, {
  message: VALIDATION_TEXT.CONFIRM_PIN_MISMATCH,
  path: ['confirmPin'],
})

type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = computed<FormInput>(() => ({
  pin: '',
  confirmPin: '',
}))

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
} = useForm({
  validationSchema,
})

const isRemovingPin = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    if (!user.value?.id) {
      throw new Error('کاربر وارد نشده است')
    }

    // Set the PIN (save to both PocketBase and localStorage)
    const success = await setPin(values.pin, user.value.id)

    if (!success) {
      throw new Error('Failed to save PIN to server')
    }

    toaster.show({
      title: 'موفقیت',
      message: 'پین با موفقیت تنظیم شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    })

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }
  catch (error) {
    console.error('Set PIN error:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در تنظیم پین پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
})

const handleRemovePin = async () => {
  isRemovingPin.value = true

  try {
    removePin()

    toaster.show({
      title: 'موفقیت',
      message: 'قفل برنامه با موفقیت حذف شد',
      color: 'success',
      icon: 'ph:trash',
      closable: true,
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }
  catch (error) {
    console.error('Remove PIN error:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در حذف پین پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    isRemovingPin.value = false
  }
}

// Redirect if user already has PIN set
if (hasPin.value) {
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-muted-800">
    <div
      class="relative hidden w-0 flex-1 items-center justify-center bg-muted-100 dark:bg-muted-900 lg:flex lg:w-2/5"
    >
      <div class="mx-auto flex size-full max-w-2xl items-center justify-center p-12">
        <div class="text-center">
          <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Icon name="ph:lock-simple" class="size-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="mb-4 text-2xl font-bold text-muted-800 dark:text-muted-200">
            تنظیم پین امنیتی
          </h1>
          <p class="mx-auto max-w-sm text-muted-500 dark:text-muted-400">
            برای محافظت از حریم خصوصی خود، یک پین ۴ رقمی تنظیم کنید
          </p>
        </div>
      </div>
    </div>

    <div class="relative flex flex-1 flex-col justify-center px-6 py-8 lg:w-3/5 lg:flex-none">
      <div class="relative mx-auto w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-muted-800">
        <!-- Header -->
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-900">
            <Icon name="ph:shield-check" class="size-8 text-success-600 dark:text-success-400" />
          </div>
          <h2 class="text-xl font-semibold text-muted-800 dark:text-muted-200">
            ایجاد پین امنیتی
          </h2>
          <p class="mt-1 text-sm text-muted-500">
            پین ۴ رقمی خود را برای قفل کردن برنامه تنظیم کنید
          </p>
        </div>

        <!-- PIN Setup Form -->
        <form
          method="POST"
          action=""
          class="space-y-4"
          novalidate
          @submit.prevent="onSubmit"
        >
          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="pin"
          >
            <BaseInput
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="password"
              maxlength="4"
              label="پین ۴ رقمی"
              placeholder="••••"
              shape="curved"
              :classes="{
                input: 'h-12 text-center text-xl font-mono',
              }"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>

          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="confirmPin"
          >
            <BaseInput
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="password"
              maxlength="4"
              label="تأیید پین"
              placeholder="••••"
              shape="curved"
              :classes="{
                input: 'h-12 text-center text-xl font-mono',
              }"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>

          <!-- Submit Button -->
          <BaseButton
            :disabled="isSubmitting"
            :loading="isSubmitting"
            type="submit"
            color="primary"
            shape="curved"
            class="!h-12 w-full"
          >
            <Icon name="ph:check" class="size-4" />
            تنظیم پین
          </BaseButton>
        </form>

        <!-- Security Info -->
        <div class="mt-6 border-t border-muted-200 pt-6 dark:border-muted-700">
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <Icon name="ph:info" class="mt-0.5 size-5 text-muted-400" />
              <div class="text-xs text-muted-500">
                <p>• پین شما به صورت محلی ذخیره می‌شود</p>
                <p>• با قفل کردن برنامه، فقط با وارد کردن پین می‌توانید به آن دسترسی داشته باشید</p>
                <p>• خروج از حساب کاربری قفل را باز نمی‌کند</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-4">
          <BaseButton
            type="button"
            color="muted"
            variant="outline"
            shape="curved"
            class="!h-10 w-full"
            @click="router.go(-1)"
          >
            <Icon name="ph:arrow-right" class="size-4" />
            بازگشت
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
