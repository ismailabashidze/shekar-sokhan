<script setup lang="ts">
import type { Invite, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'توضیحات بیشتر - گام 3',
    description: 'افزودن توضیحات بیشتر می تواند به درمان کمک کند.',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite-review.png',
    srcDark: '/img/screens/layouts-invite-review-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'توضیحات بیشتر',
})

const {
  data: request,
  currentStepId,
  loading,
  complete,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
    <div v-if="!complete">
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
        <div class="mb-6 w-full">
          <BaseTextarea
            v-model="request.description"
            label="موارد را اینجا بنویسید"
            rounded="md"
            placeholder="متن را بنویسید ..."
            :rows="6"
          />
        </div>

        <!--Buttons-->
        <div class="flex gap-4">
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
            :loading="loading"
            :disabled="loading"
          >
            <span>ثبت و ادامه</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!--Success section-->
    <div v-else>
      <div class="mx-auto w-full max-w-md py-6 text-center">
        <div class="text-primary-500 mx-auto mb-4 size-14">
          <TairoCheckAnimated color="primary" size="lg" />
        </div>
        <BaseHeading
          as="h2"
          weight="medium"
          size="2xl"
          lead="tight"
          class="text-muted-800 mb-2 dark:text-white"
        >
          اطلاعات با موفقیت ثبت شد!
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-5">
          عالی است! شما با موفقیت فرم را تکمیل کرده اید و این یعنی اولین گام به سوی مسیری از بهتر شدن را برداشته اید.
        </BaseParagraph>
        <div class="flex justify-center">
          <BaseButton
            to="/mani/chat"
            color="primary"
            rounded="md"
            class="w-48"
          >
            بریم به گفت و گو
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
