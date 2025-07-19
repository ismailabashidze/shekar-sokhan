<script setup lang="ts">
import type { PsychoReg, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ثبت نام - مشاور',
    description: 'بخش ثبت نام مشاوران با موضوع ورود اطلاعات اولیه',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'ثبت نام مشاوران',
})

const {
  data: request,
  currentStepId,
  loading,
  errors,
  getPrevStep,
  complete,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<PsychoReg, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
    <div v-if="!complete" class="mb-8 space-y-2">
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

    <div v-if="!complete" class="w-full max-w-lg">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="request.firstName"
            v-focus
            :error="errors.fields.firstName"
            label="نام"
            placeholder="نام خود را وارد کنید"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInput
            v-model="request.lastName"
            :error="errors.fields.lastName"
            label="نام خانوادگی"
            placeholder="نام خانوادگی خود را وارد کنید"
          />
        </div>
        <div class="col-span-12">
          <BaseInput
            v-model="request.email"
            :error="errors.fields.email"
            label="آدرس ایمیل"
            placeholder="example@email.com"
            type="email"
          />
        </div>
        <div class="col-span-12">
          <BaseInput
            v-model="request.phoneNumber"
            :error="errors.fields.phoneNumber"
            label="شماره تماس"
            placeholder="09123456789"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseInputNumber
            v-model="request.age"
            :error="errors.fields.age"
            label="سن"
            placeholder="25"
            :min="18"
            :max="80"
          />
        </div>
        <div class="col-span-12 sm:col-span-6">
          <BaseListbox
            v-model="request.gender"
            label="جنسیت"
            :items="['مرد', 'زن']"
            placeholder="انتخاب کنید"
            :error="errors.fields.gender"
            rounded="lg"
          />
        </div>
        <div class="col-span-12">
          <BaseListbox
            v-model="request.maritalStatus"
            label="وضعیت تاهل"
            :items="['مجرد', 'متاهل', 'مطلقه', 'بیوه']"
            placeholder="انتخاب کنید"
            :error="errors.fields.maritalStatus"
            rounded="lg"
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
    <div v-else>
      <div class="mx-auto w-full max-w-md py-6 text-center">
        <div class="text-primary-500 mx-auto mb-4 w-[250px]">
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-launch.svg"
            alt="placeholder-image"
          >
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-launch-dark.svg"
            alt="placeholder-image"
          >
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
          اطلاعات شما ثبت شد.
        </BaseParagraph>
        <div class="flex justify-center">
          <BaseButton
            to="/dashboard"
            color="primary"
            rounded="md"
            class="w-48"
          >
            بریم به داشبورد
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
