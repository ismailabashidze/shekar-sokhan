<script setup lang="ts">
import type { Deed, DeedStepData } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۶',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۶',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-6.png',
    srcDark: '/img/screens/wizard-6-dark.png',
    order: 35,
  },
})
useHead({
  title: 'بررسی نهایی',
  htmlAttrs: { dir: 'rtl' },
})

const { data: deed, errors, checkPreviousSteps, handleSubmit } = useMultiStepForm<Deed, DeedStepData>()

onBeforeMount(checkPreviousSteps)

const deedTypeNames = {
  family: 'خانواده',
  society: 'جامعه',
  spiritual: 'معنوی',
} as const

function formatDate(date: string | undefined | null) {
  if (!date) return '---'
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return '---'
    return parsedDate.toLocaleDateString('fa-IR')
  } catch {
    return '---'
  }
}

async function onSubmit() {
  await handleSubmit(() => {
    // Handle successful submission
    navigateTo('/deeds')
  })
}

// Create URL object for image preview
const getImageUrl = (file: File) => window.URL.createObjectURL(file)
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100"
          >
            <span>بررسی نهایی</span>
          </BaseHeading>
          <BaseParagraph
            size="sm"
            class="text-muted-400"
          >
            <span>لطفاً اطلاعات وارد شده را بررسی کنید و در صورت صحت، کار نیک را ثبت نمایید.</span>
          </BaseParagraph>
        </div>

        <BaseCard class="border border-muted-200 p-6 dark:border-muted-700" rounded="lg">
          <div class="flex flex-col gap-6">
            <!-- Basic Info -->
            <div class="flex flex-col gap-4 border-b border-muted-200 pb-6 dark:border-muted-700">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-full bg-primary-500/20">
                  <Icon name="lucide:info" class="size-4 text-primary-500" />
                </div>
                <h4 class="font-medium text-muted-800 dark:text-muted-100">
                  اطلاعات اصلی
                </h4>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-4">
                  <img
                    v-if="deed.avatar"
                    :src="getImageUrl(deed.avatar)"
                    alt="تصویر کار نیک"
                    class="size-16 rounded-full bg-muted-200 object-cover dark:bg-muted-700/60"
                  >
                  <img
                    v-else
                    src="/img/avatars/placeholder-file.png"
                    alt="تصویر کار نیک"
                    class="size-16 rounded-full bg-muted-200 object-cover dark:bg-muted-700/60"
                  >
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-muted-800 dark:text-muted-100">{{ deed.title }}</span>
                      <BaseTag :color="deed.type === 'family' ? 'primary' : deed.type === 'society' ? 'info' : 'success'" rounded="lg">
                        {{ deedTypeNames[deed.type || 'family'] }}
                      </BaseTag>
                    </div>
                    <p class="mt-1 text-sm text-muted-500">
                      {{ deed.description || 'بدون توضیحات' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dates and Difficulty -->
            <div class="flex flex-col gap-4 border-b border-muted-200 pb-6 dark:border-muted-700">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-full bg-info-500/20">
                  <Icon name="lucide:calendar" class="size-4 text-info-500" />
                </div>
                <h4 class="font-medium text-muted-800 dark:text-muted-100">
                  زمان‌بندی و سختی
                </h4>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="flex flex-col rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">تاریخ شروع</span>
                  <span class="mt-1 font-medium text-muted-800 dark:text-muted-100">{{ formatDate(deed.startDate?.toString()) }}</span>
                </div>
                <div class="flex flex-col rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">تاریخ پایان</span>
                  <span class="mt-1 font-medium text-muted-800 dark:text-muted-100">{{ formatDate(deed.endDate?.toString()) }}</span>
                </div>
                <div class="flex flex-col rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">سطح سختی</span>
                  <span class="mt-1 font-medium text-muted-800 dark:text-muted-100">{{ deed.category.difficulty }}</span>
                </div>
              </div>
            </div>

            <!-- Beneficiaries -->
            <div class="flex flex-col gap-4 border-b border-muted-200 pb-6 dark:border-muted-700">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-full bg-success-500/20">
                  <Icon name="lucide:users" class="size-4 text-success-500" />
                </div>
                <h4 class="font-medium text-muted-800 dark:text-muted-100">
                  ذی‌نفعان
                </h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <template v-if="deed.beneficiaries.length">
                  <div
                    v-for="beneficiary in deed.beneficiaries"
                    :key="beneficiary"
                    class="flex items-center gap-2 rounded-lg bg-muted-50 px-3 py-2 dark:bg-muted-800"
                  >
                    <Icon name="lucide:user" class="size-4 text-success-500" />
                    <span class="text-sm text-muted-800 dark:text-muted-100">{{ beneficiary }}</span>
                  </div>
                </template>
                <div v-else class="w-full rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">هیچ ذی‌نفعی مشخص نشده است</span>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="flex flex-col gap-4 border-b border-muted-200 pb-6 dark:border-muted-700">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-full bg-warning-500/20">
                  <Icon name="lucide:list-checks" class="size-4 text-warning-500" />
                </div>
                <h4 class="font-medium text-muted-800 dark:text-muted-100">
                  نیازمندی‌ها
                </h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <template v-if="deed.requirements.length">
                  <div
                    v-for="requirement in deed.requirements"
                    :key="requirement"
                    class="flex items-center gap-2 rounded-lg bg-muted-50 px-3 py-2 dark:bg-muted-800"
                  >
                    <Icon name="lucide:check-circle" class="size-4 text-warning-500" />
                    <span class="text-sm text-muted-800 dark:text-muted-100">{{ requirement }}</span>
                  </div>
                </template>
                <div v-else class="w-full rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">هیچ نیازمندی‌ای مشخص نشده است</span>
                </div>
              </div>
            </div>

            <!-- Reward and Evidence -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-full bg-primary-500/20">
                  <Icon name="lucide:gift" class="size-4 text-primary-500" />
                </div>
                <h4 class="font-medium text-muted-800 dark:text-muted-100">
                  پاداش و مستندات
                </h4>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <span class="text-sm text-muted-500">پاداش معنوی</span>
                  <p class="mt-1 text-sm text-muted-800 dark:text-muted-100">
                    {{ deed.reward || 'بدون پاداش معنوی' }}
                  </p>
                </div>
                <div v-if="deed.evidence" class="flex items-center gap-3 rounded-lg bg-muted-50 p-3 dark:bg-muted-800">
                  <div class="flex size-10 items-center justify-center rounded-full bg-primary-500/10">
                    <Icon
                      :name="deed.evidence.type.startsWith('image') ? 'lucide:image' : 'lucide:file-text'"
                      class="size-5 text-primary-500"
                    />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-muted-500">مستندات</span>
                    <span class="text-sm text-muted-800 dark:text-muted-100">{{ deed.evidence.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Submit Button -->
        <div class="flex justify-center pt-6">
          <BaseButton
            type="button"
            color="primary"
            rounded="lg"
            class="min-w-[240px] gap-2"
            :loading="false"
            @click="onSubmit"
          >
            <Icon name="lucide:check" class="size-4" />
            <span>ثبت نهایی کار نیک</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
