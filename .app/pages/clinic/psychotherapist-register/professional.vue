<script setup lang="ts">
import type { PsychoReg, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ثبت نام - مشاور - اطلاعات حرفه‌ای',
    description: 'بخش ثبت نام مشاوران - وارد کردن اطلاعات حرفه‌ای',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 38,
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

const educationLevels = [
  'دیپلم',
  'کاردانی روانشناسی',
  'کارشناسی روانشناسی',
  'کارشناسی ارشد روانشناسی',
  'دکتری روانشناسی',
  'پزشک عمومی',
  'روانپزشک'
]

const specializationOptions = [
  'روانشناسی بالینی',
  'روانشناسی کودک و نوجوان',
  'روانشناسی خانواده و ازدواج',
  'روانشناسی ورزشی',
  'روانشناسی کار و سازمان',
  'روانشناسی تربیتی',
  'مشاوره تحصیلی',
  'مشاوره شغلی',
  'مشاوره اعتیاد',
  'مشاوره افسردگی و اضطراب',
  'مشاوره خانواده',
  'مشاوره ازدواج',
  'آسیب‌شناسی روانی',
  'روان‌درمانی',
  'مشاوره گروهی'
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
        <!-- License Status -->
        <div class="col-span-12">
          <BaseListbox
            v-model="request.licenseStatus"
            label="وضعیت پروانه فعالیت"
            :items="[
              'بدون پروانه - فعالیت داوطلبانه',
              'بدون پروانه - دانشجوی روانشناسی',
              'پروانه در دست اقدام',
              'دارای پروانه'
            ]"
            placeholder="انتخاب کنید"
            :error="errors.fields.licenseStatus"
            rounded="lg"
          />
        </div>

        <!-- Education Level -->
        <div class="col-span-12">
          <BaseListbox
            v-model="request.educationLevel"
            label="سطح تحصیلات"
            :items="educationLevels"
            placeholder="سطح تحصیلات خود را انتخاب کنید"
            :error="errors.fields.educationLevel"
            rounded="lg"
          />
        </div>

        <!-- Specialization -->
        <div class="col-span-12">
          <label class="nui-label pb-1 text-muted-400 text-xs">تخصص‌ها</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border border-muted-300 dark:border-muted-600 rounded-lg max-h-48 overflow-y-auto">
            <div
              v-for="specialization in specializationOptions"
              :key="specialization"
              class="flex items-center"
            >
              <BaseCheckbox
                :model-value="request.specialization.includes(specialization)"
                :label="specialization"
                color="primary"
                size="sm"
                @update:model-value="(checked) => {
                  if (checked) {
                    if (!request.specialization.includes(specialization)) {
                      request.specialization.push(specialization)
                    }
                  } else {
                    const index = request.specialization.indexOf(specialization)
                    if (index > -1) {
                      request.specialization.splice(index, 1)
                    }
                  }
                }"
              />
            </div>
          </div>
          <span v-if="errors.fields.specialization" class="text-danger-600 mt-1 block text-xs">
            {{ errors.fields.specialization }}
          </span>
          <p class="text-muted-400 mt-1 text-xs">حداقل یک تخصص انتخاب کنید</p>
        </div>

        <!-- Years of Experience -->
        <div class="col-span-12 sm:col-span-6">
          <BaseInputNumber
            v-model="request.yearsOfExperience"
            label="سال‌های تجربه"
            placeholder="0"
            :min="0"
            :max="50"
            :error="errors.fields.yearsOfExperience"
          />
        </div>

        <!-- Workplace -->
        <div class="col-span-12">
          <BaseInput
            v-model="request.workplace"
            label="محل کار"
            placeholder="نام کلینیک، مرکز مشاوره یا محل فعالیت"
            :error="errors.fields.workplace"
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