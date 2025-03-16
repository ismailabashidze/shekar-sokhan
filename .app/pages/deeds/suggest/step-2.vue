<script setup lang="ts">
import type { Deed, DeedStepData } from '../types'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۲',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۲',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-2.png',
    srcDark: '/img/screens/wizard-2-dark.png',
    order: 31,
  },
})
useHead({
  title: 'اطلاعات کار نیک',
  htmlAttrs: { dir: 'rtl' },
})

const { data: deed, errors, checkPreviousSteps } = useMultiStepForm<Deed, DeedStepData>()

onBeforeMount(checkPreviousSteps)

const avatarPreview = useNinjaFilePreview(() => deed.value.avatar)

const inputFile = ref<FileList | null>(null)
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  deed.value.avatar = file
})
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-5xl flex-col px-4">
      <div class="flex items-center justify-center">
        <BaseFullscreenDropfile
          icon="ph:image-duotone"
          :filter-file-dropped="(file) => file.type.startsWith('image')"
          @drop="
            (value) => {
              inputFile = value
            }
          "
        />
        <BaseInputFileHeadless
          v-slot="{ open, remove, files }"
          v-model="inputFile"
          accept="image/*"
        >
          <div class="relative size-20">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="پیش‌نمایش تصویر"
              class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
            >
            <img
              v-else
              src="/img/avatars/placeholder-file.png"
              alt="پیش‌نمایش تصویر"
              class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
            >
            <div
              v-if="files?.length && files.item(0)"
              class="absolute bottom-0 end-0 z-20"
            >
              <BaseButtonIcon
                size="sm"
                rounded="full"
                tooltip="حذف تصویر"
                @click="remove(files.item(0)!)"
              >
                <Icon name="lucide:x" class="size-4" />
              </BaseButtonIcon>
            </div>
            <div v-else class="absolute bottom-0 end-0 z-20">
              <div class="relative" tooltip="بارگذاری تصویر">
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
        <BaseInputHelpText v-if="errors.fields.avatar" color="danger">
          {{ errors.fields.avatar }}
        </BaseInputHelpText>
      </div>

      <div class="my-4 text-center font-sans">
        <p class="text-muted-500 text-sm">
          بارگذاری تصویر نمادین برای کار نیک
        </p>
        <p class="text-muted-400 text-xs">
          حجم فایل نباید از ۲ مگابایت بیشتر باشد
        </p>
      </div>
      <div class="mx-auto flex w-full max-w-sm flex-col gap-3">
        <BaseInput
          v-model="deed.title"
          :error="errors.fields.title"
          rounded="lg"
          placeholder="عنوان کار نیک"
          :classes="{
            input: 'h-12 text-base text-center',
          }"
        />
        <BaseTextarea
          v-model="deed.description"
          :error="errors.fields.description"
          rounded="lg"
          placeholder="توضیحات کار نیک را وارد کنید..."
          autogrow
          class="max-h-52"
        />
      </div>
    </div>
  </div>
</template>
