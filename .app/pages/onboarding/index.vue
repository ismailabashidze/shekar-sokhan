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

useHead({ htmlAttrs: { dir: 'rtl' } })

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const couponCode = ref('')

function closeModal() {
  isModalOpen.value = false
}
function openModal() {
  isModalOpen.value = true
}
const nuxtApp = useNuxtApp()
const toaster = useToaster()
const redeem = async () => {
  isModalOpen.value = false
  isSubmitting.value = true

  const { data, error } = await useAsyncData(async () => {
    const record = await nuxtApp.$pb.send(`/redeemDiscount`, {
      body: {
        userId: nuxtApp.$pb.authStore.model.id,
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
        .then(text => {
          couponCode.value = text;
        })
        .catch(err => {
          console.error('Failed to read clipboard: ', err);
        });
    } else {
      console.warn('Clipboard API not available');
    }
  } catch (error) {
    console.error('Clipboard error: ', error);
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center py-8">
    <div class="mx-auto w-full max-w-4xl">
      <BaseCard>
        <div
          class="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0"
        >
          <div class="flex flex-col p-8">
            <BaseThemeToggle />
            <BaseAvatar
              class="mx-auto"
              size="xl"
              src="/img/avatars/mana.jpg"
              badge-src="/img/logo.png"
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

              <div class="mt-6 flex items-center justify-between gap-2">
                <BaseButton
                  color="primary"
                  class="w-full"
                >
                  پرداخت اشتراک
                </BaseButton>
                <BaseButton
                  class="w-full"
                  :loading="isSubmitting"
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
          <div>
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
