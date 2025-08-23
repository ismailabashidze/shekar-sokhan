<script setup lang="ts">
definePageMeta({
  title: 'ورود مادر - TogetherMama',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()

const login = () => {
  // Mock login functionality
  router.push('/togethermama/mother/dashboard')
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
        <img
          class="mx-auto max-w-xl rounded-md"
          src="/img/illustrations/login-mother.png"
          alt="ورود مادر به TogetherMama"
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
            to="/togethermama"
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
            ورود مادر
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6 mt-3">
            لطفاً اطلاعات حساب خود را وارد کنید
          </BaseParagraph>
          
          <!--Form section-->
          <div>
            <div class="mt-5">
              <!--Form-->
              <form
                method="POST"
                action=""
                class="mt-6"
                novalidate
                @submit.prevent="login"
              >
                <div class="space-y-4">
                  <BaseInput
                    type="email"
                    label="آدرس ایمیل"
                    placeholder="example@email.com"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  />

                  <BaseInput
                    type="password"
                    label="رمز عبور"
                    placeholder="رمز عبور"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  />
                </div>

                <!--Remember-->
                <div class="mt-6 flex items-center justify-between">
                  <BaseCheckbox
                    shape="curved"
                    label="مرا بخاطر بسپار"
                    color="primary"
                  />

                  <div class="text-xs leading-5">
                    <NuxtLink
                      to="/togethermama/auth/recover"
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

              <!--Register link-->
              <p
                class="text-muted-400 mt-4 flex justify-between font-sans text-xs leading-5"
              >
                <span>حساب کاربری ندارید؟</span>
                <NuxtLink
                  to="/togethermama/auth/mother/register"
                  class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                >
                  ثبت‌نام کنید
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
