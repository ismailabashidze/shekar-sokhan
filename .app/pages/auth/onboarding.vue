<script setup lang="ts">
definePageMeta({
  title: 'ورود به همدل',
  layout: 'empty',
  preview: {
    title: 'ثبت نام',
    description: 'صفحه ی ثبت نام کاربران جدید',
    categories: ['layouts', 'onboarding'],
    src: '/img/screens/layouts-onboarding-1.png',
    srcDark: '/img/screens/layouts-onboarding-1-dark.png',
    order: 93,
  },
})

const loading = ref(false)
const twoFaMode = ref('phoneNumber')
const currentStep = ref(1)
const codeLength = ref(4)
const input = ref<number[]>([])
const inputElements = ref<any[]>([])

const onlyCheckOnLastFieldInput = ref(true)

const email = ref('')
const tel = ref('')
const code = ref('')

function goToStep(n: number) {
  loading.value = true
  const timer = setTimeout(() => {
    loading.value = false
    if (n < 1) {
      currentStep.value = 1
    } else if (n > 3) {
      currentStep.value = 3
    } else {
      currentStep.value = n
    }
    clearTimeout(timer)
  }, 1000)
}

function paste(event: any) {
  // raw pasted input
  let pasted = event.clipboardData.getData('text')
  // only get numbers
  pasted = pasted.replace(/\D/g, '')
  // don't get more than the PIN codeLength
  pasted = pasted.substring(0, codeLength.value)
  // if after all that sanitazation the string is not empty
  if (pasted) {
    // split the pasted string into an array and load it
    input.value = pasted.split('')
    if (input.value.length === codeLength.value) {
      validatePin.value = true
      verifyCodes()
    }
    return validatePin.value
  }
}
function type(event: any, index: any) {
  if (event.ctrlKey && event.key == 'v') {
    console.log('ctrl-v')
  } else if (event.keyCode == 8) {
    event.stopPropagation()
    event.preventDefault()
    input.value[index - 1] = 0
  } else {
    // only allow numbers
    let key = event.key.replace(/\D/g, '')
    if (key != '') {
      console.log(key)
      input.value[index - 1] = key
    }
  }
  // check if the PIN is correct
  if (
    (onlyCheckOnLastFieldInput.value && index == codeLength.value) ||
    !onlyCheckOnLastFieldInput.value
  ) {
    if (input.value.length === codeLength.value) {
      validatePin.value = true
      verifyCodes()
    }
    return validatePin.value
  }
  // go to the next field
  // must happen on nextTick cause the field can be disabled.
  nextTick(() => {
    goto(index + 1)
  })
}

function goto(n: any) {
  if (!n || n > codeLength.value) {
    n = 1
  }
  inputElements.value[n].focus()
}

const validatePin = ref(false)

const router = useRouter()
const toaster = useToaster()
const { user, generateAndSetCode, setToken } = useUser()
const sendVerifyCodeSms = async () => {
  await generateAndSetCode(tel.value)
  toaster.clearAll()
  toaster.show({
    title: 'کد تایید',
    message: 'کد تایید به شماره شما پیامک شد',
    color: 'success',
    icon: 'ph:chat-text',
    closable: true,
  })
  goToStep(3)
}
const verifyCodes = async () => {
  const { data, error } = await useAsyncData(async (nuxtApp) => {
    const record = await nuxtApp.$pb.send(
      `/verifyBySms/${tel.value}/${input.value.join('')}`,
    )
    return structuredClone(record)
  })
  toaster.clearAll()
  if (error.value) {
    toaster.show({
      title: 'خطا',
      message: error.value,
      color: 'danger',
      icon: 'ph:chat-text',
      closable: true,
    })
  } else {
    const { data, error } = await useAsyncData(async (nuxtApp) => {
      const record = await nuxtApp.$pb
        .collection('anonymousUsers')
        .authWithPassword(
          user.value.phoneNumber + '@gmail.com',
          user.value.anonymousCode + 'sadjkalsdj98379@#!@#',
        )
      return structuredClone(record)
    })

    // setToken(recor)
    toaster.show({
      title: 'ثبت موفق',
      message: 'به همدل خوش آمدید',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    router.push('/mani/chat')
  }
}
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div
      class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4"
    >
      <NuxtLink
        to="/"
        class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
      >
        <TherapiLogo class="h-10 w-10" />
      </NuxtLink>
      <div class="flex items-center gap-4">
        <BaseThemeToggle />
      </div>
    </div>
    <form
      action=""
      method="POST"
      @submit.prevent
      class="mx-auto max-w-7xl px-4"
    >
      <div v-if="currentStep === 1">
        <div class="pt-8 text-center">
          <BaseHeading tag="h2" size="3xl" weight="medium" class="mb-2">
            👋 به همدل خوش آمدید
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-8">
            یکی از راه های ورود را انتخاب کنید تا احراز هویت شوید
          </BaseParagraph>
        </div>

        <div>
          <div class="w-full">
            <div class="mx-auto w-full">
              <div class="w-full">
                <div class="mx-auto mb-8 grid max-w-4xl gap-6 sm:grid-cols-3">
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="phoneNumber"
                  >
                    <BaseCard
                      shape="curved"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-sms.svg"
                          alt="2 factor authentication with SMS"
                          class="mx-auto max-w-[160px]"
                        />
                        <BaseHeading size="md" weight="medium"
                          >با پیامک</BaseHeading
                        >
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          یک کد پیامکی برای شماره ای که وارد می‌کنید ارسال خواهد
                          شد
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 h-7 w-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="email_address"
                    class="pointer-events-none"
                  >
                    <BaseCard
                      shape="curved"
                      class="relative border-2 p-8 !border-yellow-500 !opacity-100 !grayscale-0 [&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-web.svg"
                          alt="2 factor authentication with email"
                          class="mx-auto max-w-[160px]"
                        />
                        <BaseHeading size="md" weight="medium"
                          >با ایمیل</BaseHeading
                        >
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          برای شما کد تایید را به ایمیل خواهیم فرستاد تا اعتبار
                          سنجی صورت گیرد
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:warning"
                          class="text-yellow-500 h-7 w-7"
                        />
                      </div>
                      <div
                        class="absolute -top-10 right-0 bottom-0 left-0 flex items-center justify-center"
                      >
                        <span
                          class="text-yellow-500 text-4xl font-semibold opacity-50 rotate-45 transform"
                          style="transform: rotate(45deg) scale(1.5)"
                        >
                          بزودی
                        </span>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="app_id"
                    class="pointer-events-none"
                  >
                    <BaseCard
                      shape="curved"
                      class="relative border-2 p-8 !border-yellow-500 !opacity-100 !grayscale-0 [&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-app.svg"
                          alt="2 factor authentication with app"
                          class="mx-auto max-w-[160px]"
                        />
                        <BaseHeading size="md" weight="medium"
                          >با آیدال</BaseHeading
                        >
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          به وسیله احراز هویت مرکزی
                          <NuxtLink
                            to="https://authy.com/"
                            class="text-yellow-500 underline-offset-4 hover:underline"
                            >سامانه آیدال</NuxtLink
                          >
                          نیز می توانید وارد شوید
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-100">
                        <Icon
                          name="ph:warning"
                          class="text-yellow-500 h-7 w-7"
                        />
                      </div>
                      <div
                        class="absolute -top-10 right-0 bottom-0 left-0 flex items-center justify-center"
                      >
                        <span
                          class="text-yellow-500 text-4xl font-semibold opacity-50 rotate-45 transform"
                          style="transform: rotate(45deg) scale(1.5)"
                        >
                          بزودی
                        </span>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
                <div class="mx-auto flex flex-col items-center">
                  <BaseButton
                    type="button"
                    shape="curved"
                    class="!h-12 w-48"
                    color="primary"
                    :loading="loading"
                    @click="goToStep(2)"
                    >ادامه</BaseButton
                  >
                  <!-- <NuxtLink
                    to="/dashboards"
                    class="text-muted-400 hover:text-primary-500 mt-4 text-xs font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                    >No thanks, I want to skip</NuxtLink
                  > -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 2" class="w-full">
        <div class="flex h-full w-full flex-col">
          <div
            class="pointer-events-none flex w-full items-center justify-center pt-8"
          >
            <BaseIconBox color="primary" size="lg" shape="full" class="mx-auto">
              <Icon
                v-if="twoFaMode === 'email_address'"
                name="ph:envelope-duotone"
                class="text-primary-500 mx-auto h-8 w-8"
              />
              <Icon
                v-else-if="twoFaMode === 'phoneNumber'"
                name="ph:device-mobile-speaker-duotone"
                class="text-primary-500 mx-auto h-8 w-8"
              />
              <Icon
                v-else-if="twoFaMode === 'app_id'"
                name="ph:fingerprint-duotone"
                class="text-primary-500 mx-auto h-8 w-8"
              />
            </BaseIconBox>
          </div>
          <div class="pt-4 text-center">
            <BaseHeading tag="h2" size="3xl" weight="medium" class="mb-1">
              لطفا شماره تماس خود را وارد نمایید
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400">
              یک شماره تماس وارد نمایید تا کد پیامکی به آن ارسال گردد
            </BaseParagraph>
          </div>

          <div class="mx-auto w-full max-w-sm py-6">
            <BaseInput
              v-if="twoFaMode === 'email_address'"
              v-model="email"
              icon="ph:envelope-duotone"
              shape="curved"
              placeholder="Ex: johndoe@gmail.com"
              :classes="{
                wrapper: 'w-full',
                input: '!h-12 !ps-12',
                icon: '!h-12 !w-12',
              }"
            />
            <BaseInput
              v-else-if="twoFaMode === 'phoneNumber'"
              v-model="tel"
              icon="ph:device-mobile-speaker-duotone"
              shape="curved"
              placeholder="09123456789"
              :classes="{
                wrapper: 'w-full',
                input: '!h-12 !ps-12',
                icon: '!h-12 !w-12',
              }"
            />
            <div v-else-if="twoFaMode === 'app_id'" class="space-y-4">
              <div class="flex items-center gap-2">
                <Icon name="logos:authy" class="h-6 w-6" />
                <div>
                  <BaseText size="sm" class="text-muted-500 dark:text-muted-400"
                    >Only
                    <NuxtLink
                      to="https://authy.com/"
                      class="text-primary-500 underline-offset-4 hover:underline"
                      >Authy</NuxtLink
                    >
                    is supported so far</BaseText
                  >
                </div>
              </div>
              <BaseInput
                v-model="code"
                icon="ph:fingerprint-duotone"
                shape="curved"
                placeholder="Ex: efcdwdeg16jei85"
                :classes="{
                  wrapper: 'w-full',
                  input: '!h-12 !ps-12',
                  icon: '!h-12 !w-12',
                }"
              />
            </div>
          </div>
          <div class="mx-auto flex flex-col items-center">
            <BaseButton
              type="button"
              shape="curved"
              class="!h-12 w-48"
              color="primary"
              :loading="loading"
              @click="sendVerifyCodeSms()"
              >ادامه</BaseButton
            >
            <!-- <button
              type="button"
              class="text-muted-400 hover:text-primary-500 mt-4 text-xs font-medium underline-offset-4 transition-colors duration-300 hover:underline"
              @click="goToStep(1)"
            >
              I want to change, take me back
            </button> -->
          </div>
        </div>
      </div>
      <div v-else-if="currentStep === 3">
        <div class="mx-auto max-w-4xl">
          <div class="flex h-full w-full flex-col">
            <div
              class="pointer-events-none flex w-full items-center justify-center pt-8"
            >
              <div class="flex h-16 items-center justify-center">
                <TherapiCheckAnimated v-if="validatePin" size="sm" />
                <BaseIconBox
                  v-else
                  color="primary"
                  size="lg"
                  shape="full"
                  class="mx-auto"
                >
                  <Icon
                    name="ph:lock-duotone"
                    class="text-primary-500 mx-auto h-8 w-8"
                  />
                </BaseIconBox>
              </div>
            </div>
            <div class="pt-4 text-center">
              <BaseHeading tag="h2" size="3xl" weight="medium" class="mb-1">
                Enter your code
              </BaseHeading>
              <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-2">
                Enter the pin code we've just sent you
              </BaseParagraph>
              <BaseText
                size="xs"
                lead="snug"
                class="text-muted-500 dark:text-muted-400 mb-8"
              >
                <span class="block">
                  <span class="font-bold">1234</span> is the demo PIN.
                </span>
              </BaseText>
            </div>
            <div
              class="text-muted-800 dark:text-muted-100 mx-auto flex h-60 w-72 flex-col rounded text-center"
            >
              <div
                class="flex w-full justify-center gap-3"
                :class="validatePin && 'pointer-events-none'"
              >
                <input
                  type="text"
                  :name="'pin' + i"
                  v-for="i in codeLength"
                  :key="'pin' + i"
                  maxlength="1"
                  class="dark:bg-muted-800 unselectable nui-focus inline w-16 select-none rounded-lg bg-white py-5 text-center text-4xl font-bold transition-all"
                  @paste.prevent="paste($event)"
                  @keydown.exact="type($event, i)"
                  @keydown.ctrl.a.prevent
                  @mousemove.prevent.stop
                  @keydown.arrow-right.prevent="goto(i + 1)"
                  @keydown.arrow-left.prevent="goto(i - 1)"
                  :value="input[i - 1] != null ? input[i - 1] : 0"
                  :ref="
                    (el) => {
                      inputElements[i] = el
                    }
                  "
                  placeholder="0"
                  :disabled="input.length < i - 1 || validatePin"
                  :autofocus="i == 1"
                />
              </div>
              <div class="mt-10">
                validatePin {{ validatePin }}
                <BaseButton
                  @click="verifyCodes()"
                  shape="curved"
                  class="!h-12"
                  :color="validatePin ? 'primary' : 'default'"
                  :disabled="!validatePin"
                  >Take me to Dashboard</BaseButton
                >

                <div class="mt-8 flex items-center justify-between">
                  <BaseText size="sm" class="text-muted-400"
                    >Didn't receive the code?</BaseText
                  >
                  <button
                    type="button"
                    class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                  >
                    Send it again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
