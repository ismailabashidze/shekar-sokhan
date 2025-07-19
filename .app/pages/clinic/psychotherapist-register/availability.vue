<script setup lang="ts">
import type { PsychoReg, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ثبت نام - مشاور - دسترسی و ترجیحات',
    description: 'بخش ثبت نام مشاوران - تنظیم دسترسی و ترجیحات',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 40,
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

const weekDays = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
]

const sessionTypes = [
  'جلسات انفرادی',
  'جلسات گروهی',
  'جلسات خانوادگی',
  'جلسات زوجین',
  'مشاوره کودک',
  'مشاوره نوجوان',
  'مشاوره تحصیلی',
  'مشاوره شغلی'
]

const timeSlots = []
for (let hour = 6; hour <= 23; hour++) {
  const time = hour.toString().padStart(2, '0') + ':00'
  timeSlots.push(time)
  if (hour < 23) {
    const halfTime = hour.toString().padStart(2, '0') + ':30'
    timeSlots.push(halfTime)
  }
}
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
        <!-- Available Days -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">روزهای در دسترس</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg">
            <div
              v-for="day in weekDays"
              :key="day"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.availableDays.includes(day)"
                :label="day"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.availableDays.includes(day)) {
                      request.availableDays.push(day)
                    }
                  } else {
                    const index = request.availableDays.indexOf(day)
                    if (index > -1) {
                      request.availableDays.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.availableDays" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.availableDays }}
          </span>
        </div>

        <!-- Working Hours -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">ساعات کاری</label>
          <div class="grid grid-cols-2 gap-4">
            <BaseListbox
              v-model="request.workingHours.start"
              label="شروع"
              :items="timeSlots"
              placeholder="انتخاب کنید"
              rounded="lg"
            />
            <BaseListbox
              v-model="request.workingHours.end"
              label="پایان"
              :items="timeSlots"
              placeholder="انتخاب کنید"
              rounded="lg"
            />
          </div>
          <span v-if="errors.fields.workingHours" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.workingHours }}
          </span>
        </div>

        <!-- Session Types -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">انواع جلسات</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg">
            <div
              v-for="sessionType in sessionTypes"
              :key="sessionType"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.sessionTypes.includes(sessionType)"
                :label="sessionType"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.sessionTypes.includes(sessionType)) {
                      request.sessionTypes.push(sessionType)
                    }
                  } else {
                    const index = request.sessionTypes.indexOf(sessionType)
                    if (index > -1) {
                      request.sessionTypes.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.sessionTypes" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.sessionTypes }}
          </span>
        </div>

        <!-- Online Consultation -->
        <div class="col-span-12">
          <BaseCheckbox
            v-model="request.onlineConsultation"
            label="آیا مشاوره آنلاین ارائه می‌دهید؟"
            color="primary"
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
          :loading="loading"
        >
          <span>ادامه</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>