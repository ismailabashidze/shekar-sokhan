<script setup lang="ts">
definePageMeta({
  title: 'ثبت‌نام - TogetherMama',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()
const route = useRoute()

const selectedRole = ref('mother')
const planId = route.query.plan || null

const register = () => {
  // Mock registration functionality
  router.push(`/togethermama/${selectedRole.value}/dashboard`)
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
          src="/img/illustrations/login.png"
          alt="ثبت‌نام در TogetherMama"
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
            ثبت‌نام در TogetherMama
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6 mt-3">
            لطفاً اطلاعات حساب خود را وارد کنید
          </BaseParagraph>
          
          <!-- Role Selection -->
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-700 dark:text-muted-200 mb-3"
            >
              نقش خود را انتخاب کنید:
            </BaseHeading>
            <div class="grid grid-cols-2 gap-4">
              <BaseCard 
                :class="[
                  'cursor-pointer p-4 transition-all duration-300',
                  selectedRole === 'mother' 
                    ? 'ring-primary-500 border-primary-500 ring-2' 
                    : 'border-muted-200 dark:border-muted-700 border'
                ]"
                @click="selectedRole = 'mother'"
              >
                <div class="flex items-center gap-3">
                  <div 
                    :class="[
                      'flex size-5 items-center justify-center rounded-full border',
                      selectedRole === 'mother' 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-muted-300 dark:border-muted-600'
                    ]"
                  >
                    <Icon 
                      v-if="selectedRole === 'mother'" 
                      name="ph:check" 
                      class="text-white size-3" 
                    />
                  </div>
                  <BaseHeading as="h4" size="sm" weight="medium">
                    مادر
                  </BaseHeading>
                </div>
              </BaseCard>
              
              <BaseCard 
                :class="[
                  'cursor-pointer p-4 transition-all duration-300',
                  selectedRole === 'psychologist' 
                    ? 'ring-primary-500 border-primary-500 ring-2' 
                    : 'border-muted-200 dark:border-muted-700 border'
                ]"
                @click="selectedRole = 'psychologist'"
              >
                <div class="flex items-center gap-3">
                  <div 
                    :class="[
                      'flex size-5 items-center justify-center rounded-full border',
                      selectedRole === 'psychologist' 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-muted-300 dark:border-muted-600'
                    ]"
                  >
                    <Icon 
                      v-if="selectedRole === 'psychologist'" 
                      name="ph:check" 
                      class="text-white size-3" 
                    />
                  </div>
                  <BaseHeading as="h4" size="sm" weight="medium">
                    روانشناس
                  </BaseHeading>
                </div>
              </BaseCard>
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
                  to="/togethermama/auth/login"
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
