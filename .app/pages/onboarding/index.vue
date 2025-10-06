<script setup lang="ts">
definePageMeta({
  title: 'صفحه ی پرداخت',
  preview: {
    title: 'پرداخت',
    description: 'بررسی موجودی و پرداخت',
    categories: ['layouts'],
    src: '/img/screens/layouts-subpages-action-2.png',
    srcDark: '/img/screens/layouts-subpages-action-2-dark.png',
    order: 86,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
  ]
})

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isPaymentLoading = ref(false)

const couponCode = ref('')

// Subscription plan details
const subscriptionPlan = {
  price: 590000, // Price in IRR/Rials
  name: 'اشتراک ذهنا',
  description: 'اشتراک یک‌ماهه سرویس ذهنا',
}

function closeModal() {
  isModalOpen.value = false
}
function openModal() {
  isModalOpen.value = true
}
const nuxtApp = useNuxtApp()
const toaster = useToaster()
const router = useRouter()

// Import the Dargah payment gateway composable
const { registerTransaction, redirectToPayment, isLoading: isPaymentProcessing } = useDargah()
const { createPayment } = usePayment()

// Payment function
const startPayment = async () => {
  if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
    toaster.show({
      title: 'خطا',
      message: 'ابتدا وارد حساب کاربری خود شوید',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }

  isPaymentLoading.value = true

  try {
    // Create payment record in database
    const paymentRecord = await createPayment({
      amount: subscriptionPlan.price,
      description: subscriptionPlan.description,
      status: 'pending',
      transactionId: '', // Will be updated after successful payment
    })

    if (!paymentRecord) {
      throw new Error('Failed to create payment record')
    }

    console.log('💾 Payment record created:', {
      id: paymentRecord.id,
      amount: paymentRecord.amount,
      status: paymentRecord.status,
    })

    // Register transaction with Dargah
    const config = useRuntimeConfig()
    const merchantId = String(config.public.dargahMerchantId || 'e07ef02a-4723-4355-9006-88bbbabf8918')
    const username = String(config.public.dargahUsername || '')
    const password = String(config.public.dargahPassword || '')

    console.log('merchantId', merchantId)
    console.log('username', username)
    console.log('password', password)
    console.log('username length:', username.length)
    console.log('password length:', password.length)

    if (!username || !password || username === 'undefined' || password === 'undefined') {
      throw new Error('لطفاً ابتدا اطلاعات لاگین درگاه‌نو را در تنظیمات وارد کنید')
    }

    // Generate a valid factor number (must be a positive integer)
    const factorNumber = Math.floor(Math.random() * 1000000) + Date.now() % 1000000

    const transactionData = {
      merchent_id: merchantId,
      price: Number(subscriptionPlan.price), // Ensure it's a number
      factor_number: factorNumber,
      callback_url: `${window.location.origin}/onboarding/payment-callback`,
      shop_id: '37664064', // Set as null for now, can be configured later
      category: 'Forwarder', // Explicitly set category
      transaction_fee_side: 'Seller', // Set fee side
      description: subscriptionPlan.description,
      mobile: nuxtApp.$pb.authStore.model?.phoneNumber || '',
      name: nuxtApp.$pb.authStore.model?.firstName || '',
      email: nuxtApp.$pb.authStore.model?.email || '',
    }

    const credentials = {
      username,
      password,
    }

    console.log('🧪 Transaction data being sent:', {
      ...transactionData,
      factorNumber: transactionData.factor_number,
      price: subscriptionPlan.price,
      merchantId: transactionData.merchent_id,
    })

    const result = await registerTransaction(transactionData, credentials)

    if (result?.authority) {
      // Store payment info in localStorage for callback processing
      localStorage.setItem('pending_payment', JSON.stringify({
        paymentId: paymentRecord.id,
        authority: result.authority,
        amount: subscriptionPlan.price,
      }))

      // Redirect to payment gateway
      redirectToPayment(result.authority)
    }
    else {
      throw new Error('Failed to register transaction with payment gateway')
    }
  }
  catch (error) {
    console.error('Payment error:', error)
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    toaster.show({
      title: 'خطا در پرداخت',
      message: `خطا: ${error.message}`,
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    isPaymentLoading.value = false
  }
}
const redeem = async () => {
  isModalOpen.value = false
  isSubmitting.value = true

  const { data, error } = await useAsyncData(async () => {
    const record = await nuxtApp.$pb.send(`/redeemDiscount`, {
      body: {
        userId: nuxtApp.$pb.authStore.model?.id,
        code: couponCode.value,
      },
      method: 'POST',
    })
    return structuredClone(record)
  })
  if (!error.value) {
    toaster.show({
      title: 'ثبت کد',
      message: `کد با موفقیت فعال شد.`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    navigateTo('/darmana/therapists/chooseTherapist')
  }
  else {
    toaster.show({
      title: 'عدم ثبت',
      message: `کد نامعتبر است یا قبلا استفاده شده است`,
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  isSubmitting.value = false
}

// Clipboard function
const pasteCouponCode = () => {
  try {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.readText()
        .then((text) => {
          couponCode.value = text
        })
        .catch((err) => {
          console.error('Failed to read clipboard: ', err)
        })
    }
    else {
      console.warn('Clipboard API not available')
    }
  }
  catch (error) {
    console.error('Clipboard error: ', error)
  }
}

</script>

<template>
  <div class="onboarding-page">
    <div class="animated-gradient-bg"></div>
    <div class="flex min-h-screen items-center justify-center py-8" data-tour="welcome">
      <div class="content-container mx-auto w-full max-w-4xl">
      <BaseCard>
        <div
          class="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0"
        >
          <div class="order-2 sm:order-1">
            <div class="flex flex-col p-8">
              <BaseThemeToggle />
              <BaseAvatar
                class="mx-auto"
                size="xl"
                src="/img/avatars/mana.jpg"
                badge-src="/img/logo.svg"
              />
              <div class="mx-auto mb-4 max-w-xs text-center">
                <BaseHeading
                  as="h2"
                  size="md"
                  weight="medium"
                  class="mt-4"
                >
                  ذهنا اولین
                  <span class="text-primary-500">سکوی هوش مصنوعی</span>
                  به زبان فارسی را ساخته‌است که به شما حمایت‌های
                  روانشناختی ارائه می‌دهد.
                </BaseHeading>
              </div>
              <div class="mx-auto max-w-sm">
                <BaseCard elevated class="p-6">
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400 mb-2 !text-[0.65rem] uppercase"
                  >
                    پیامی از طرف تیم ذهنا
                  </BaseHeading>
                  <BaseParagraph
                    size="xs"
                    class="text-muted-500 dark:text-muted-400 text-justify"
                  >
                    برای ما، خوشحالی و سرزندگی شما اولویت اول را دارد. از ابتدا
                    این سامانه برای بهتر کردن حال شما و کمک به شما (و نه انگیزه
                    های مالی) توسعه داده شده است. باید دانست که این خدمت‌رسانی
                    برای تیم توسعه هزینه‌هایی دارد که ما را مجبور به دریافت هزینه
                    از شما کرده‌است. دوست داشتیم که این خدمت را رایگان در اختیار
                    شما بگذاریم، ولی می‌دانیم که درک می‌کنید که راه‌اندازی،
                    نگه‌داری و توسعه این نرم‌افزار دانش‌بنیان هزینه‌هایی دارد که
                    با کمک شما آن‌ها را پوشش می‌دهیم.
                  </BaseParagraph>
                </BaseCard>

                <div class="mt-6 flex items-center justify-between gap-2" data-tour="payment-options">
                  <BaseButton
                    color="primary"
                    class="w-full"
                    :loading="isPaymentLoading || isPaymentProcessing"
                    data-tour="payment-button"
                    @click="startPayment"
                  >
                    پرداخت اشتراک
                  </BaseButton>
                  <BaseButton
                    class="w-full"
                    :loading="isSubmitting"
                    data-tour="coupon-button"
                    @click="openModal"
                  >
                    کد تخفیف دارم
                  </BaseButton>
                </div>
                <div class="mt-2 flex items-center justify-between gap-2">
                  <BaseButton
                    to="/deeds/start"
                    color="success"
                    class="w-full"
                  >
                    دریافت کد در قبال کار نیک
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
          <div class="order-1 sm:order-2">
            <div class="flex flex-col p-8">
              <BaseHeading
                tag="h2"
                size="md"
                weight="medium"
                class="mt-8"
              >
                با کمک هم می توانیم!
              </BaseHeading>
              <BaseText
                size="xs"
                class="text-muted-500 dark:text-muted-400 mt-1 max-w-xs"
              >
                کمک‌های مالی شما در فعالیت‌ها و موارد زیر هزینه خواهد شد:
              </BaseText>
              <div class="mt-6">
                <ul class="space-y-6">
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        توسعه و بهبود نرم افزاری
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-full text-justify"
                      >
                        با کمک شما می توانیم امکانات بیشتری را به سامانه اضافه
                        کنیم.
                      </BaseText>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        سخت افزار و سرور
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-full text-justify"
                      >
                        هزینه‌های پردازنده‌های گرافیکی بسیار پیشرفته را پوشش
                        می‌دهیم.
                      </BaseText>
                    </div>
                  </li>

                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        نگه داری و دردسترس پذیری
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-full text-justify"
                      >
                        شما به تیم ذهنا کمک می کنید که سرویس را پایدار و بدون
                        مشکل ارائه دهند.
                      </BaseText>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        حمایت از ذهنا
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-full text-justify"
                      >
                        شما به تیم ذهنا و کمک رسانی به افرادی که نیاز به حمایت
                        روانی دارند کمک می کنید.
                      </BaseText>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    </div>
  </div>
  <!-- Modal component -->
  <TairoModal
    :open="isModalOpen"
    size="sm"
    footer-align="center"
    @close="closeModal"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          ورود کد تخفیف
        </h3>

        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          ورود کد تخفیف
        </h3>

        <p
          class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-sm leading-5"
        >
          کد خود را در زیر وارد نمایید.
        </p>
        <div class="mt-4">
          <BaseInput
            v-model="couponCode"
            icon="ph:tag"
            label=""
            shape="curved"
            placeholder="کد را وارد نمایید"
            type="text"
          >
            <template #action>
              <button
                type="button"
                data-nui-tooltip="چسباندن"
                class="text-muted-400 hover:text-primary-500 absolute end-1 top-1 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                @click="pasteCouponCode"
              >
                <Icon name="ph:clipboard-text-duotone" class="text-primary-500 size-6" />
              </button>
            </template>
          </BaseInput>
        </div>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="closeModal">
            بازگشت
          </BaseButton>

          <BaseButton
            color="primary"
            variant="solid"
            @click="redeem"
          >
            ثبت و فعال‌سازی
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>

<style scoped>
.animated-gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4);
  background-size: 400% 400%;
  animation: gradientShift 30s ease infinite;
  overflow: hidden;
  z-index: -1; /* Send background behind content */
}

/* Ensure the page content can scroll vertically on mobile */
@media (max-width: 640px) {
  .onboarding-page {
    overflow-y: auto;
    height: 100vh;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }
  
  .content-container {
    padding-bottom: env(safe-area-inset-bottom); /* Handle safe areas on mobile */
  }
}

.dark .animated-gradient-bg {
  background: linear-gradient(-45deg, #1e40af, #7c3aed, #be185d, #d97706, #059669, #0284c7);
  background-size: 400% 400%;
  animation: gradientShift 30s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Add some subtle floating animation for enhanced effect */
.animated-gradient-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  animation: floatingBubbles 45s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes floatingBubbles {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translate(15px, -15px) rotate(60deg);
    opacity: 0.4;
  }
  66% {
    transform: translate(-10px, 10px) rotate(120deg);
    opacity: 0.35;
  }
}

/* Ensure content stays above the animated background */
.animated-gradient-bg > * {
  position: relative;
  z-index: 1;
}
</style>
