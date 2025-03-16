<script setup lang="ts">
import type { Deed, DeedStepData, DeedType } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۱',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۱',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-1.png',
    srcDark: '/img/screens/wizard-1-dark.png',
    order: 30,
  },
})
useHead({
  title: 'نوع کار نیک',
})

const {
  getNextStep,
  data: deed,
  handleSubmit,
  goToStep,
} = useMultiStepForm<Deed, DeedStepData>()

function onSelectType(type: DeedType) {
  deed.value.type = type
  handleSubmit()
}
</script>

<template>
  <div>
    <DemoWizardStepTitle />
    <div class="mx-auto w-full max-w-6xl px-4 text-center">
      <div class="ltablet:grid-cols-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Choice -->
        <div
          class="dark:hover:bg-muted-800 hover:shadow-muted-300/30 dark:hover:shadow-muted-800/30 group rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:shadow-xl"
          :class="[
            deed.type === 'family'
              ? 'dark:bg-muted-800 shadow-muted-300/30 dark:shadow-muted-800/30 bg-white shadow-xl'
              : '',
          ]"
        >
          <img
            class="rounded-sm"
            src="/img/illustrations/wizard/family.png"
            alt="خانواده"
          >
          <div class="my-4">
            <BaseHeading
              tag="h3"
              weight="medium"
              size="xl"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              <span>خانواده</span>
            </BaseHeading>
            <BaseParagraph class="text-muted-400">
              <span>
                کارهای نیک مرتبط با خانواده، والدین، همسر و فرزندان
              </span>
            </BaseParagraph>
          </div>
          <div class="mb-5 flex flex-col items-center">
            <BaseButton
              :to="getNextStep()?.to"
              color="primary"
              rounded="lg"
              class="w-36"
              @click.prevent="() => onSelectType('family')"
            >
              <span>
                {{ deed.type === 'family' ? 'انتخاب شده' : 'ادامه' }}
              </span>
            </BaseButton>
            <div class="mt-4 text-center">
              <NuxtLink
                to="/deeds/suggest"
                class="text-muted-400 hover:text-primary-500 font-sans text-[0.65rem] font-semibold uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
              >
                <span>اطلاعات بیشتر</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- Choice -->
        <div
          class="dark:hover:bg-muted-800 hover:shadow-muted-300/30 dark:hover:shadow-muted-800/30 group rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:shadow-xl"
          :class="[
            deed.type === 'society'
              ? 'dark:bg-muted-800 shadow-muted-300/30 dark:shadow-muted-800/30 bg-white shadow-xl'
              : '',
          ]"
        >
          <img
            class="rounded-2xl"
            src="/img/illustrations/wizard/society.png"
            alt="جامعه"
          >
          <div class="my-4">
            <BaseHeading
              tag="h3"
              weight="medium"
              size="xl"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              <span>جامعه</span>
            </BaseHeading>
            <BaseParagraph class="text-muted-400">
              <span>
                کارهای نیک مرتبط با جامعه، همسایگان و افراد نیازمند
              </span>
            </BaseParagraph>
          </div>
          <div class="mb-5 flex flex-col items-center">
            <BaseButton
              :to="getNextStep()?.to"
              color="primary"
              rounded="lg"
              class="w-36"
              @click.prevent="() => onSelectType('society')"
            >
              <span>
                {{ deed.type === 'society' ? 'انتخاب شده' : 'ادامه' }}
              </span>
            </BaseButton>
            <div class="mt-4 text-center">
              <NuxtLink
                to="/deeds/suggest"
                class="text-muted-400 hover:text-primary-500 font-sans text-[0.65rem] font-semibold uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
              >
                <span>اطلاعات بیشتر</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- Choice -->
        <div
          class="dark:hover:bg-muted-800 hover:shadow-muted-300/30 dark:hover:shadow-muted-800/30 group rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:shadow-xl"
          :class="[
            deed.type === 'spiritual'
              ? 'dark:bg-muted-800 shadow-muted-300/30 dark:shadow-muted-800/30 bg-white shadow-xl'
              : '',
          ]"
        >
          <img
            class="rounded-2xl"
            src="/img/illustrations/wizard/spritual.png"
            alt="معنوی"
          >
          <div class="my-4">
            <BaseHeading
              tag="h3"
              weight="medium"
              size="xl"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              <span>معنوی</span>
            </BaseHeading>
            <BaseParagraph class="text-muted-400">
              <span>
                کارهای نیک معنوی، شامل اعمال مذهبی و معنویت آزاد
              </span>
            </BaseParagraph>
          </div>
          <div class="mb-5 flex flex-col items-center">
            <BaseButton
              :to="getNextStep()?.to"
              color="primary"
              rounded="lg"
              class="w-36"
              @click.prevent="() => onSelectType('spiritual')"
            >
              <span>
                {{ deed.type === 'spiritual' ? 'انتخاب شده' : 'ادامه' }}
              </span>
            </BaseButton>
            <div class="mt-4 text-center">
              <NuxtLink
                to="/deeds/suggest"
                class="text-muted-400 hover:text-primary-500 font-sans text-[0.65rem] font-semibold uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
              >
                <span>اطلاعات بیشتر</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
