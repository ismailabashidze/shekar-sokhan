<script setup lang="ts">
import type { Invite, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'انتخاب موضوع - گام 2',
    description: 'انتخاب موضوعات می تواند به تشخیص و فرایند صحبت کمک کند',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite-permissions.png',
    srcDark: '/img/screens/layouts-invite-permissions-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'انتخاب موضوع',
})
const item = ref({ isVoiceDone: true, message: 'سلام، من مانا هستم! دستیار سلامت روان شما', voice: 'fa-IR-FaridNeural' })
const getVoice = async () => {
  item.value.isVoiceDone = false
  const v = await $fetch('https://seam.brro.ir/tts', {
    method: 'POST',
    body: {
      text: item.value.message,
      voice: item.value.voice,
      file_name: 'output.mp3',
    },
  })
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      new Audio(url).play()
      item.value.isVoiceDone = true
    })
}
onMounted(() => {
  const temp = localStorage.getItem('voice')
  console.log(temp)
  if (temp === null) {
    localStorage.setItem('voice', 'fa-IR-FaridNeural')
  }
})

watch(() => item.value.voice, (n, o) => {
  localStorage.setItem('voice', n)
})
const {
  data: request,
  currentStepId,
  loading,
  errors,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
    <div class="mb-8 space-y-2">
      <BaseHeading
        as="h2"
        size="2xl"
        weight="medium"
        class="md:!3xl text-muted-800 dark:text-white"
      >
        {{ steps[currentStepId].meta.title }}
      </BaseHeading>
      <BaseParagraph
        size="sm"
        class="text-muted-500 dark:text-muted-400 max-w-sm"
      >
        {{ steps[currentStepId].meta.subtitle }}
      </BaseParagraph>
    </div>

    <div class="w-full max-w-md">
      <div class="w-full space-y-4">
        <div>
          لطفا توجه داشته باشید که ...
        </div>
        <div class="grid gap-10 sm:grid-cols-2">
          <BaseRadioHeadless
            v-model="item.voice"
            name="fa-IR-FaridNeural"
            value="fa-IR-FaridNeural"
          >
            <BaseCard
              rounded="lg"
              class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
            >
              <div class="flex flex-col items-center">
                <h4
                  class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                >
                  صدای مردانه
                </h4>
                <BaseAvatar size="lg">
                  <img
                    src="/img/avatars/male.webp"
                    rounded="full"
                    alt=""
                  >
                </BaseAvatar>
              </div>

              <div class="child absolute end-2 top-3 opacity-0">
                <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
              </div>
            </BaseCard>
          </BaseRadioHeadless>

          <BaseRadioHeadless
            v-model="item.voice"
            name="fa-IR-DilaraNeural"
            value="fa-IR-DilaraNeural"
          >
            <BaseCard
              rounded="lg"
              class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
            >
              <div class="flex flex-col items-center">
                <h4
                  class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                >
                  صدای زنانه
                </h4>

                <BaseAvatar size="lg">
                  <img
                    src="/img/avatars/female.webp"
                    rounded="full"
                    alt=""
                  >
                </BaseAvatar>
              </div>

              <div class="child absolute end-2 top-3 opacity-0">
                <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
              </div>
            </BaseCard>
          </BaseRadioHeadless>
        </div>
        <div class="mt-4 flex items-center gap-4">
          <BaseCard
            color="primary"
            rounded="md"
            class="p-6"
          >
            <BaseParagraph
              size="sm"
              lead="tight"
              class="text-muted-400 flex items-center gap-4"
            >
              <BaseButtonIcon
                rounded="full"
                color="primary"
                :class="item.isVoiceDone? '' : 'animate-spin'"
                @click="getVoice()"
              >
                <Icon :name="item.isVoiceDone? 'lucide:play' : 'lucide:loader-circle'" class="size-5" />
              </BaseButtonIcon>
              <div>«سلام، من مانا هستم! دستیار سلامت روان شما»</div>
            </BaseParagraph>
          </BaseCard>
        </div>
        <div class="mt-4 flex gap-4">
          <BaseButton
            v-if="currentStepId > 0"
            :to="loading ? undefined : getPrevStep()?.to"
            :disabled="!getPrevStep()"
            size="lg"
            class="w-full"
          >
            <span>بازگشت</span>
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            size="lg"
            class="w-full"
          >
            <span>ادامه</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
