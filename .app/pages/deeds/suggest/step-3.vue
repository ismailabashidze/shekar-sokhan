<script setup lang="ts">
import type { Deed } from '~/composables/useDeed'

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

const { deed, createDeed } = useDeed()

async function onSubmit() {
  const success = await createDeed()
  if (success) {
    navigateTo('/deeds')
  }
}
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4">
      <!-- Title -->
      <div class="flex flex-col gap-2">
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          class="text-muted-800 dark:text-muted-100"
        >
          <span>عنوان کار نیک</span>
        </BaseHeading>
        <BaseInput
          v-model="deed.title"
          placeholder="عنوان کار نیک را وارد کنید"
          rounded="lg"
        />
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          class="text-muted-800 dark:text-muted-100"
        >
          <span>توضیحات</span>
        </BaseHeading>
        <BaseTextarea
          v-model="deed.description"
          placeholder="توضیحات کار نیک را وارد کنید..."
          rounded="lg"
          rows="4"
        />
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-2">
        <BaseButton
          to="/deeds/suggest/step-2"
          variant="outline"
          rounded="lg"
        >
          بازگشت
        </BaseButton>
        <BaseButton
          color="primary"
          rounded="lg"
          @click="onSubmit"
        >
          ثبت کار نیک
        </BaseButton>
      </div>
    </div>
  </div>
</template>
