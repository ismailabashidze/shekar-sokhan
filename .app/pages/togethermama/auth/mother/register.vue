<script setup lang="ts">
definePageMeta({
  title: 'ثبت‌نام مادر - TogetherMama',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()

const register = () => {
  // Mock registration functionality
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
          src="/img/illustrations/signup-mother.png"
          alt="ثبت‌نام مادر در TogetherMama"
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
            ثبت‌نام مادر
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6 mt-3">
            لطفاً اطلاعات خود را وارد کنید
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
                @submit.prevent="register"
              >
                <div class="space-y-4">
                  <BaseInput
                    type="text"
                    label="نام و نام خانوادگی"
                    placeholder="نام کامل شما"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  />
                  
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
                  
                  <BaseInput
                    type="password"
                    label="تکرار رمز عبور"
                    placeholder="تکرار رمز عبور"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  />
                  
                  <BaseInput
                    type="text"
                    label="سن کودک"
                    placeholder="تعداد ماه یا سال"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  />
                  
                  <BaseSelect
                    label="جنسیت کودک"
                    shape="curved"
                    :classes="{
                      input: 'h-12',
                    }"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="boy">پسر</option>
                    <option value="girl">دختر</option>
                  </BaseSelect>
                </div>

                <!--Terms-->
                <div class="mt-6">
                  <BaseCheckbox
                    shape="curved"
                    label="با شرایط استفاده و حریم خصوصی موافقم"
                    color="primary"
                  />
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
                      ثبت‌نام
                    </BaseButton>
                  </div>
                </div>
              </form>

              <!--Login link-->
              <p
                class="text-muted-400 mt-4 flex justify-between font-sans text-xs leading-5"
              >
                <span>قبلاً حساب کاربری دارید؟</span>
                <NuxtLink
                  to="/togethermama/auth/login?role=mother"
                  class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                >
                  وارد شوید
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
