<template>
  <div class="flex min-h-screen items-center justify-center py-8 md:bg-gradient-to-br md:from-blue-500 md:via-purple-500 md:to-pink-500 dark:md:from-blue-600 dark:md:via-purple-600 dark:md:to-pink-600">
    <div class="mx-auto w-full max-w-lg p-4">
      <BaseCard class="p-6">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
          <BasePlaceload class="size-16 rounded-full" />
          <div class="mt-4 text-center">
            <BasePlaceload class="mx-auto mb-2 h-5 w-40 rounded" />
            <BasePlaceload class="mx-auto h-3 w-64 rounded" />
          </div>
        </div>

        <div v-else-if="paymentSuccess" class="py-8 text-center">
          <div class="bg-success-500/10 dark:bg-success-500/20 mx-auto mb-6 flex size-20 items-center justify-center rounded-full p-4">
            <Icon name="ph:check-circle-bold" class="text-success-500 size-12" />
          </div>
          <BaseHeading
            as="h3"
            size="lg"
            weight="medium"
            class="mb-2"
          >
            پرداخت با موفقیت انجام شد
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mx-auto mb-8 max-w-xs">
            اشتراک شما با موفقیت فعال شد. اکنون می‌توانید از تمام امکانات ذهنا استفاده کنید.
          </BaseParagraph>
          <div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <BaseButton to="/dashboard" color="primary">
              رفتن به داشبورد
            </BaseButton>
            <BaseButton to="/darmana/therapists/chooseTherapist">
              انتخاب درمانگر
            </BaseButton>
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <div class="bg-danger-500/10 dark:bg-danger-500/20 mx-auto mb-6 flex size-20 items-center justify-center rounded-full p-4">
            <Icon name="ph:x-circle-bold" class="text-danger-500 size-12" />
          </div>
          <BaseHeading
            as="h3"
            size="lg"
            weight="medium"
            class="mb-2"
          >
            پرداخت ناموفق بود
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mx-auto mb-8 max-w-xs">
            {{ errorMessage || 'متاسفانه پرداخت شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید.' }}
          </BaseParagraph>
          <div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <BaseButton to="/onboarding" color="primary">
              بازگشت و تلاش مجدد
            </BaseButton>
          </div>
          <div class="mt-4">
            <BaseParagraph size="xs" class="text-muted-400">
              کد پیگیری: {{ transactionAuthority || 'نامشخص' }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'نتیجه پرداخت',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const isLoading = ref(true)
const paymentSuccess = ref(false)
const errorMessage = ref('')
const transactionAuthority = ref('')

const nuxtApp = useNuxtApp()
const router = useRouter()
const route = useRoute()
const toaster = useToaster()

onMounted(async () => {
  try {
    // Get parameters from URL
    const authority = route.query.Authority as string
    const status = route.query.Status as string

    // If no authority found, we can't verify the payment
    if (!authority) {
      errorMessage.value = 'اطلاعات پرداخت یافت نشد'
      isLoading.value = false
      return
    }

    // Store the authority for reference
    transactionAuthority.value = authority

    // Check if the payment was successful on gateway
    if (status !== 'OK') {
      errorMessage.value = 'پرداخت توسط کاربر لغو شد یا با خطا مواجه شد'

      // Clean up localStorage on failure
      localStorage.removeItem('pending_payment')
      isLoading.value = false
      return
    }

    // Get pending payment info from localStorage
    const pendingPaymentStr = localStorage.getItem('pending_payment')
    let pendingPayment = null
    if (pendingPaymentStr) {
      try {
        pendingPayment = JSON.parse(pendingPaymentStr)
      }
      catch (e) {
        console.error('Error parsing pending payment:', e)
      }
    }

    // Verify the payment with the backend
    const { data, error } = await useAsyncData(async () => {
      return await nuxtApp.$pb.send('/verifyPayment', {
        method: 'POST',
        body: {
          authority,
          paymentId: pendingPayment?.paymentId,
        },
      })
    })

    if (error.value || !data.value) {
      errorMessage.value = 'تایید پرداخت با مشکل مواجه شد'
      isLoading.value = false
      return
    }

    // Backend returns status 100 for success
    if (data.value.status === 100) {
      paymentSuccess.value = true

      // Clean up localStorage on success
      localStorage.removeItem('pending_payment')

      // Show success message (with warning if payment record was missing)
      const message = data.value.warning
        ? 'اشتراک شما فعال شد، ولی ممکن است نیاز به بررسی بیشتر باشد'
        : 'اشتراک شما با موفقیت فعال شد'

      toaster.show({
        title: 'اشتراک فعال شد',
        message,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })

      // Show warning toast if there was an issue with payment record
      if (data.value.warning) {
        setTimeout(() => {
          toaster.show({
            title: 'توجه',
            message: 'لطفاً در صورت بروز مشکل با پشتیبانی تماس بگیرید',
            color: 'warning',
            icon: 'ph:warning',
            closable: true,
          })
        }, 1000)
      }

      // Redirect to therapist selection after 3 seconds
      setTimeout(() => {
        navigateTo('/darmana/therapists/chooseTherapist')
      }, 3000)
    }
    else {
      errorMessage.value = data.value.msg || 'تایید پرداخت با مشکل مواجه شد'

      // Clean up localStorage on failure
      localStorage.removeItem('pending_payment')
    }
  }
  catch (error) {
    console.error('Error processing payment callback:', error)
    errorMessage.value = 'خطا در پردازش نتیجه پرداخت'

    // Clean up localStorage on error
    localStorage.removeItem('pending_payment')
  }
  finally {
    isLoading.value = false
  }
})
</script>
