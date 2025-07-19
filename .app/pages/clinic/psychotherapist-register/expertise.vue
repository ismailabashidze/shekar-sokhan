<script setup lang="ts">
import type { PsychoReg, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ثبت نام - مشاور - تخصص و صلاحیت',
    description: 'بخش ثبت نام مشاوران - وارد کردن تخصص و صلاحیت‌ها',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 39,
  },
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

const therapyApproaches = [
  'رفتار درمانی شناختی (CBT)',
  'روان‌تحلیلی',
  'انسان‌گرا',
  'گشتالت',
  'راه‌حل محور',
  'خانواده‌درمانی سیستمی',
  'درمان پذیرش و تعهد (ACT)',
  'درمان دیالکتیکی رفتاری (DBT)',
  'EMDR',
  'ذهن‌آگاهی',
  'بازی‌درمانی',
  'هنردرمانی',
  'موسیقی‌درمانی',
  'حرکت درمانی'
]

const ageGroups = [
  'کودکان (3-12 سال)',
  'نوجوانان (13-18 سال)',
  'جوانان (19-35 سال)',
  'میانسالان (36-55 سال)',
  'سالمندان (55+ سال)'
]

const languages = [
  'فارسی',
  'انگلیسی',
  'عربی',
  'ترکی آذربایجانی',
  'کردی',
  'بلوچی',
  'فرانسوی',
  'آلمانی',
  'روسی',
  'چینی',
  'ژاپنی'
]

const certifications = [
  'مدرک CBT',
  'مدرک خانواده‌درمانی',
  'مدرک بازی‌درمانی',
  'مدرک EMDR',
  'مدرک ACT',
  'مدرک DBT',
  'مدرک هیپنوتراپی',
  'مدرک مشاوره اعتیاد',
  'مدرک مشاوره کودک',
  'مدرک مشاوره ازدواج',
  'مدرک مشاوره گروهی'
]
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
        <!-- Therapy Approaches -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">روش‌های درمانی</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg max-h-48 overflow-y-auto">
            <div
              v-for="approach in therapyApproaches"
              :key="approach"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.therapyApproaches.includes(approach)"
                :label="approach"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.therapyApproaches.includes(approach)) {
                      request.therapyApproaches.push(approach)
                    }
                  } else {
                    const index = request.therapyApproaches.indexOf(approach)
                    if (index > -1) {
                      request.therapyApproaches.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.therapyApproaches" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.therapyApproaches }}
          </span>
        </div>

        <!-- Target Age Groups -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">گروه‌های سنی هدف</label>
          <div class="grid grid-cols-1 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg">
            <div
              v-for="ageGroup in ageGroups"
              :key="ageGroup"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.targetAgeGroups.includes(ageGroup)"
                :label="ageGroup"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.targetAgeGroups.includes(ageGroup)) {
                      request.targetAgeGroups.push(ageGroup)
                    }
                  } else {
                    const index = request.targetAgeGroups.indexOf(ageGroup)
                    if (index > -1) {
                      request.targetAgeGroups.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.targetAgeGroups" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.targetAgeGroups }}
          </span>
        </div>

        <!-- Languages -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">زبان‌های تسلط</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg">
            <div
              v-for="language in languages"
              :key="language"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.languages.includes(language)"
                :label="language"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.languages.includes(language)) {
                      request.languages.push(language)
                    }
                  } else {
                    const index = request.languages.indexOf(language)
                    if (index > -1) {
                      request.languages.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.languages" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.languages }}
          </span>
        </div>

        <!-- Certifications -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">گواهینامه‌ها و مدارک تخصصی (اختیاری)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg max-h-48 overflow-y-auto">
            <div
              v-for="certification in certifications"
              :key="certification"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.certifications.includes(certification)"
                :label="certification"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.certifications.includes(certification)) {
                      request.certifications.push(certification)
                    }
                  } else {
                    const index = request.certifications.indexOf(certification)
                    if (index > -1) {
                      request.certifications.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
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
          :loading="loading"
        >
          <span>ادامه</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>