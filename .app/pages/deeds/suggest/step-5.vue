<script setup lang="ts">
import type { Deed, DeedStepData } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۵',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۵',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-5.png',
    srcDark: '/img/screens/wizard-5-dark.png',
    order: 34,
  },
})
useHead({
  title: 'پاداش و مستندات',
  htmlAttrs: { dir: 'rtl' },
})

const { data: deed, errors, checkPreviousSteps } = useMultiStepForm<Deed, DeedStepData>()

onBeforeMount(checkPreviousSteps)

const inputFile = ref<FileList | null>(null)
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  deed.value.evidence = file
})
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4">
      <!-- Evidence Upload Section -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-center">
          <BaseFullscreenDropfile
            icon="ph:image-duotone"
            :filter-file-dropped="(file) => file.type.startsWith('image') || file.type === 'application/pdf'"
            @drop="
              (value) => {
                inputFile = value
              }
            "
          />
          <BaseInputFileHeadless
            v-slot="{ open, remove, files }"
            v-model="inputFile"
            accept="image/*,application/pdf"
          >
            <div class="relative size-20">
              <img
                v-if="deed.evidence?.type.startsWith('image')"
                :src="URL.createObjectURL(deed.evidence)"
                alt="پیش‌نمایش مستندات"
                class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
              >
              <img
                v-else-if="deed.evidence?.type === 'application/pdf'"
                src="/img/avatars/placeholder-pdf.png"
                alt="پیش‌نمایش مستندات"
                class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
              >
              <img
                v-else
                src="/img/avatars/placeholder-file.png"
                alt="پیش‌نمایش مستندات"
                class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
              >
              <div
                v-if="files?.length && files.item(0)"
                class="absolute bottom-0 end-0 z-20"
              >
                <BaseButtonIcon
                  size="sm"
                  rounded="full"
                  tooltip="حذف مستندات"
                  @click="remove(files.item(0)!)"
                >
                  <Icon name="lucide:x" class="size-4" />
                </BaseButtonIcon>
              </div>
              <div v-else class="absolute bottom-0 end-0 z-20">
                <div class="relative" tooltip="بارگذاری مستندات">
                  <BaseButtonIcon
                    size="sm"
                    rounded="full"
                    @click="open"
                  >
                    <Icon name="lucide:plus" class="size-4" />
                  </BaseButtonIcon>
                </div>
              </div>
            </div>
          </BaseInputFileHeadless>
          <BaseInputHelpText v-if="errors.fields.evidence" color="danger">
            {{ errors.fields.evidence }}
          </BaseInputHelpText>
        </div>

        <div class="my-4 text-center font-sans">
          <p class="text-muted-500 text-sm">
            بارگذاری مستندات مربوط به کار نیک
          </p>
          <p class="text-muted-400 text-xs">
            فرمت‌های مجاز: تصویر و PDF - حجم فایل نباید از ۲ مگابایت بیشتر باشد
          </p>
        </div>
      </div>
      <!-- Reward Section -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-muted-100"
          >
            <span>پاداش روانی</span>
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400">
            <span>پاداش روانی این کار نیک را برای انجام دهنده آن شرح دهید.</span>
          </BaseParagraph>
        </div>
        <BaseTextarea
          v-model="deed.reward"
          :error="errors.fields.reward"
          rounded="lg"
          placeholder="پاداش روانی این کار نیک را وارد کنید..."
          autogrow
          class="max-h-52"
        />
      </div>
    </div>
  </div>
</template>
