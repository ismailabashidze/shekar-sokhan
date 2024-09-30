<script setup lang="ts">
import type { Invite, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'Invite - Step 1',
    description: 'For inviting people',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'اطلاعات اولیه',
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
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-6">
          <BaseInputNumber
            v-model="request.age"
            v-focus
            :error="errors.fields.age"
            label="سن شما"
            placeholder="به صورت عددی"
            :min="8"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseListbox
            v-model="request.gender"
            label="جنسیت"
            :items="['مرد', 'زن', `ترجیح می دهم نگویم`]"
            placeholder="جنسیت را انتخاب نمایید"
            :error="errors.fields.gender"
            rounded="lg"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseListbox
            v-model="request.maritalStatus"
            label="وضعیت تاهل"
            :items="['مجرد', 'متاهل', `در رابطه عاطفی` , `اقدام برای جدایی`, `طلاق گرفته`]"
            placeholder="انتخاب نمایید"
            :error="errors.fields.maritalStatus"
            rounded="lg"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseListbox
            v-model="request.jobStatus"
            label="وضعیت شغلی"
            :items="['دانش آموز', 'دانشجو', `استخدام بخش دولتی` , `استخدام بخش خصوصی`, `شغل آزاد`, 'جویای کار', 'خانه دار', 'بیکار']"
            placeholder="انتخاب نمایید"
            :error="errors.fields.jobStatus"
            rounded="lg"
          />
        </div>
        <div class="col-span-12">
          <BaseInput
            v-model="request.name"
            v-focus
            :error="errors.fields.name"
            label="نام شما"
            placeholder="به صورت اختیاری"
          />
        </div>
        <div class="col-span-12">
          <BaseInput
            v-model="request.email"
            :error="errors.fields.email"
            label="آدرس ایمیل"
            placeholder="اختیاری"
          />
        </div>
      </div>

      <div class="mt-6 flex gap-4">
        <BaseButton
          v-if="currentStepId > 0"
          :to="loading ? undefined : getPrevStep()?.to"
          :disabled="!getPrevStep()"
          size="lg"
          class="w-full"
        >
          <span>بخش قبلی</span>
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
</template>
