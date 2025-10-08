<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  layout: 'empty',
  title: 'ورود',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const VALIDATION_TEXT = {
  EMAIL_REQUIRED: 'آدرس ایمیل نیاز است',
  EMAIL_INVALID: 'یک ایمیل معتبر وارد کنید',
  PASSWORD_REQUIRED: 'رمز عبور نیاز است',
}

const zodSchema = z.object({
  email: z.string({ required_error: VALIDATION_TEXT.EMAIL_REQUIRED }).min(1, VALIDATION_TEXT.EMAIL_REQUIRED).email(VALIDATION_TEXT.EMAIL_INVALID),
  password: z.string({ required_error: VALIDATION_TEXT.PASSWORD_REQUIRED }).min(1, VALIDATION_TEXT.PASSWORD_REQUIRED),
  trustDevice: z.boolean(),
})

type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = computed<FormInput>(() => ({
  email: '',
  password: '',
  trustDevice: false,
}))

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
} = useForm({
  validationSchema,
})

const router = useRouter()
const toaster = useToaster()

const onSubmit = handleSubmit(async (values) => {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('backend validation error')), 2000)
      setTimeout(resolve, 4000)
    })
  }
  catch (error: any) {
    if (error.message === 'backend validation error') {
      setFieldError('email', 'نام کاربری یا رمز عبور اشتباه است')
      setFieldError('password', 'نام کاربری یا رمز عبور اشتباه است')
    }
    return
  }
})
const nuxtApp = useNuxtApp()
const { setUser } = useUser()
const { downloadAndSaveAvatar } = useAvatarManager()
const isGoogleLogin = ref(false)

const loginWithGoogle = async () => {
  console.log('🔄 Google login button clicked!')
  try {
    isGoogleLogin.value = true

    // Debug: Check PocketBase instance
    console.log('📱 PocketBase instance:', nuxtApp.$pb)
    console.log('🌐 PocketBase URL:', nuxtApp.$pb.baseUrl)

    // Debug: Check OAuth providers
    console.log('🔍 Checking available OAuth providers...')

    const authData = await nuxtApp.$pb
      .collection('users')
      .authWithOAuth2({ provider: 'google' })

    console.log('✅ Google OAuth successful:', {
      userId: authData.record.id,
      email: authData.record.email,
      hasMeta: !!authData.meta,
    })

    // ذخیره meta در PocketBase
    await nuxtApp.$pb.collection('users').update(authData.record.id, { meta: authData.meta })

    const record = authData.record
    const pbMeta = authData.meta as Partial<MetaObj> || {}

    // دانلود و ذخیره آواتار اگر وجود دارد و کاربر آواتار محلی ندارد
    let avatarFileName = record.avatar
    if (!avatarFileName && pbMeta.avatarUrl) {
      console.log('🔄 Downloading avatar from Google...')
      avatarFileName = await downloadAndSaveAvatar(record.id, pbMeta.avatarUrl)
    }

    // ساخت object کاربر
    const appUser: User = {
      id: record.id,
      username: record.username,
      email: record.email,
      hasCharge: record.hasCharge as boolean,
      startChargeTime: record.startChargeTime as string,
      expireChargeTime: record.expireChargeTime as string,
      role: record.role as string,
      avatar: avatarFileName || undefined,
      meta: {
        avatarUrl: pbMeta.avatarUrl ?? '',
        expiry: pbMeta.expiry ?? '',
        isNew: pbMeta.isNew ?? false,
        email: pbMeta.email ?? record.email,
        name: pbMeta.name ?? '',
      } as MetaObj,
    }

    await setUser(appUser, 'user')

    // Update premium status based on user's charge status
    const { setPremiumStatus } = useAIResponseSettings()
    if (appUser.hasCharge) {
      setPremiumStatus(true)
    }

    toaster.clearAll()
    toaster.show({
      title: 'ورود موفق',
      message: `خوش آمدید`,
      color: 'success',
      icon: 'ph:user-circle-fill',
      closable: true,
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }
  catch (error) {
    console.error('❌ Google Login Error Details:', {
      error,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      response: error?.response,
      status: error?.status,
    })

    // More specific error handling
    let errorMessage = 'متاسفانه مشکلی در ورود پیش آمد. لطفا دوباره تلاش کنید.'

    if (error?.message?.includes('OAuth2')) {
      errorMessage = 'مشکل در تنظیمات OAuth. لطفا با پشتیبانی تماس بگیرید.'
    }
    else if (error?.message?.includes('network')) {
      errorMessage = 'مشکل در اتصال به اینترنت. لطفا اتصالتان را بررسی کنید.'
    }
    else if (error?.status === 400) {
      errorMessage = 'درخواست نامعتبر. لطفا صفحه را رفرش کنید.'
    }
    else if (error?.status === 500) {
      errorMessage = 'مشکل سرور. لطفا چند دقیقه بعد تلاش کنید.'
    }

    toaster.show({
      title: 'خطا در ورود',
      message: errorMessage,
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    isGoogleLogin.value = false
  }
}

// Check if we're in a client-side environment
if (process.client) {
  // Check if a passkey is set but not authenticated, redirect to lock screen
  const passkey = localStorage.getItem('passkey')
  if (passkey) {
    const isAuthenticated = localStorage.getItem('passkeyAuthenticated')
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigateTo('/lock-screen')
    }
  }
}

if (nuxtApp.$pb.authStore.isValid) {
  navigateTo('/dashboard')
}
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
          src="/img/illustrations/login.png"
          alt=""
          width="619"
          height="594"
        >
      </div>
    </div>
    <div
      class="relative flex flex-1 flex-col justify-center px-6 py-8 lg:w-2/5 lg:flex-none"
    >
      <div class="dark:bg-muted-800 relative mx-auto w-full max-w-sm bg-white">
        <!--Nav-->
        <div class="flex w-full items-center justify-between">
          <NuxtLink
            to="https://zehna.ir"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-colors duration-300"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به صفحه‌ی معرفی</span>
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
            کاربر عزیز، خوش آمدید
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6 mt-3">
            ورود در سامانه به منزله
            <NuxtLink
              to="/auth/terms"
              class="text-primary-600 hover:text-primary-500 font-sans font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
            >
              پذیرش قوانین استفاده
            </NuxtLink>
            و پذیرش
            <NuxtLink
              to="/auth/privacy"
              class="text-primary-600 hover:text-primary-500 font-sans font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
            >
              قوانین حریم خصوصی
            </NuxtLink>
            است.
          </BaseParagraph>
          <!-- Social Sign Up Buttons -->
          <div class="flex flex-wrap justify-between gap-4">
            <!--Google button-->
            <button
              class="dark:bg-muted-700 text-muted-800 border-muted-300 dark:border-muted-600 nui-focus relative inline-flex grow items-center justify-center gap-2 rounded-xl border bg-white px-6 py-4 transition-all duration-200 disabled:opacity-50 dark:text-white"
              :disabled="isGoogleLogin"
              @click="loginWithGoogle"
            >
              <Icon
                v-if="!isGoogleLogin"
                name="logos:google-icon"
                class="size-5"
              />
              <Icon
                v-else
                name="line-md:loading-twotone-loop"
                class="size-5"
              />
              <div>
                {{ isGoogleLogin ? 'در حال ورود...' : 'ورود با گوگل' }}
              </div>
            </button>
            <!--Twitter button-->
            <button
              class="bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 nui-focus w-[calc(50%_-_0.5rem)] cursor-pointer rounded-xl px-5 py-4 text-center transition-colors duration-300 md:w-auto"
            >
              <Icon name="fa6-brands:microsoft" class="mx-auto size-4" />
            </button>
            <!--Linkedin button-->
            <!-- <button
              class="bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 nui-focus w-[calc(50%_-_0.5rem)] cursor-pointer rounded-xl px-5 py-4 text-center transition-colors duration-300 md:w-auto"
            >
              <Icon name="fa6-brands:linkedin-in" class="mx-auto h-4 w-4" />
            </button> -->
          </div>
          <!-- 'or' divider -->
          <div class="flex-100 mt-8 flex items-center">
            <hr
              class="border-muted-200 dark:border-muted-700 flex-auto border-t-2"
            >
            <span class="text-muted-400 px-4 font-sans font-light">
              یا با استفاده از
            </span>
            <hr
              class="border-muted-200 dark:border-muted-700 flex-auto border-t-2"
            >
          </div>
        </div>

        <!--Form section-->
        <div>
          <div class="mt-5">
            <!--Form-->
            <form
              method="POST"
              action=""
              class="mt-6"
              novalidate
              @submit.prevent="onSubmit"
            >
              <div class="space-y-4">
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
                    placeholder="آدرس ایمیل"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="password"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="password"
                    label="رمز عبور"
                    placeholder="رمز عبور"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>

              <!--Remember-->
              <div class="mt-6 flex items-center justify-between">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="trustDevice"
                >
                  <BaseCheckbox
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    shape="curved"
                    label="مرا بخاطر بسپار"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <div class="text-xs leading-5">
                  <NuxtLink
                    to="/auth/recover"
                    class="text-primary-600 hover:text-primary-500 font-sans font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                  >
                    رمز عبور را فراموش کرده اید؟
                  </NuxtLink>
                </div>
              </div>

              <!--Submit-->
              <div class="mt-6">
                <div class="block w-full rounded-md shadow-sm">
                  <BaseButton
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                    type="submit"
                    color="primary"
                    shape="curved"
                    class="!h-11 w-full"
                  >
                    ورود
                  </BaseButton>
                </div>
              </div>
            </form>

            <!--No account link-->
            <!-- <p
              class="text-muted-400 mt-4 flex justify-between font-sans text-xs leading-5"
            >
              <span>Don't have an account?</span>
              <NuxtLink
                to="/auth/signup-2"
                class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
              >
                start your 14-day free trial
              </NuxtLink>
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
