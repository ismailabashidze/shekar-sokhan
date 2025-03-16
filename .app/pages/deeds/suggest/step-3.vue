<script setup lang="ts">
import type { Deed, DeedStepData } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۳',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۳',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-3.png',
    srcDark: '/img/screens/wizard-3-dark.png',
    order: 32,
  },
})
useHead({
  title: 'جزئیات کار نیک',
  htmlAttrs: { dir: 'rtl' },
})

const { data: deed, errors, checkPreviousSteps } = useMultiStepForm<Deed, DeedStepData>()

onBeforeMount(checkPreviousSteps)

const difficultyLevels = [
  {
    value: 'ساده',
    label: 'ساده - کمتر از ۱۵ دقیقه',
    description: 'کارهای کوچک و سریع که می‌توانید در کمتر از ۱۵ دقیقه انجام دهید، مثل تماس با والدین یا کمک به یک عابر',
  },
  {
    value: 'متوسط',
    label: 'متوسط - بین ۱۵ تا ۶۰ دقیقه',
    description: 'کارهایی که نیاز به زمان و تلاش متوسط دارند، مانند خرید برای همسایه یا آموزش یک مهارت به دیگران',
  },
  {
    value: 'چالش‌برانگیز',
    label: 'چالش‌برانگیز - بیش از ۱ ساعت',
    description: 'کارهای بزرگتر که نیاز به برنامه‌ریزی و تعهد بیشتری دارند، مثل سازماندهی یک رویداد خیریه یا کمک به تعمیر خانه یک نیازمند',
  },
]

const categoryDescriptions = {
  family: 'خانواده: انتخاب سطح سختی مناسب برای کارهای خانوادگی به شما کمک می‌کند تا متناسب با زمان و انرژی خود به عزیزانتان خدمت کنید.',
  society: 'جامعه: با توجه به توان و وقت خود، می‌توانید کارهای اجتماعی را از ساده تا چالش‌برانگیز انتخاب کنید.',
  spiritual: 'معنوی: کارهای معنوی می‌توانند از نیایش کوتاه تا برگزاری مراسم‌های مذهبی متغیر باشند.',
}
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
            <span>سطح سختی</span>
          </BaseHeading>
          <BaseParagraph
            size="sm"
            class="text-muted-400"
          >
            <span>سطح سختی و زمان مورد نیاز برای انجام این کار نیک را انتخاب کنید.</span>
          </BaseParagraph>
          <BaseParagraph
            v-if="deed.type"
            size="sm"
            class="text-primary-500 dark:text-primary-400"
          >
            <span>{{ categoryDescriptions[deed.type] }}</span>
          </BaseParagraph>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="level in difficultyLevels"
            :key="level.value"
            class="relative"
          >
            <input
              :id="level.value"
              v-model="deed.category.difficulty"
              type="radio"
              :value="level.value"
              name="difficulty"
              class="peer absolute top-0 start-0 z-20 size-full cursor-pointer opacity-0"
            >
            <label
              :for="level.value"
              class="relative block w-full cursor-pointer rounded-xl border bg-white p-4 text-center hover:bg-muted-50 peer-checked:border-2 peer-checked:border-primary-500 dark:border-muted-600 dark:bg-muted-700 dark:hover:bg-muted-600 dark:peer-checked:border-primary-500"
            >
              <span class="mb-2 block font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
                {{ level.label }}
              </span>
              <span class="block font-sans text-xs text-muted-400">
                {{ level.description }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-2">
        <BaseParagraph
          size="xs"
          class="text-muted-400 italic"
        >
          <span>راهنمایی: سطح سختی را متناسب با توانایی و زمان در دسترس خود انتخاب کنید. کارهای ساده نیز ارزشمند هستند!</span>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>
