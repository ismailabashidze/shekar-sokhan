<script setup lang="ts">
import type { Invite, StepData } from '../../../types';

definePageMeta({
  preview: {
    title: 'بارگذاری مدارک - گام 3',
    description: 'لطفا تصویر کارت ملی، اطلاعات عضویت در سازمان نظام روانشناسی و پروانه فعالیت (در صورت وجود) را بارگذاری نمایید. تمام مدارک باید به صورت فایل تصویری و با کیفیت باشند.',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite-review.png',
    srcDark: '/img/screens/layouts-invite-review-dark.png',
    order: 37,
    new: true,
  },
});
useHead({
  title: 'توضیحات بیشتر',
});
const uploadedFiles = ref<FileList | null>(null);
const {
  data: request,
  currentStepId,
  loading,
  complete,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>();

onBeforeMount(checkPreviousSteps);
</script>

<template>
  <div class="w-full">
    <div v-if="!complete">
      <div class="mb-8 space-y-2">
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

      <div class="w-full max-w-md">
        <div class="mb-6 w-full">
          <BaseInputFileHeadless
            v-slot="{ open, remove, preview, drop, files }"
            v-model="uploadedFiles"
            multiple
          >
            <!-- Controls -->
            <div class="mb-4 flex items-center gap-2">
              <button
                type="button"
                class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                tooltip="Select files"
                @click="open"
              >
                <Icon
                  name="lucide:plus"
                  class="absolute start-1/2 top-1/2 size-4 -translate-y-1/2 translate-x-1/2"
                />

                <span class="sr-only">Select files</span>
              </button>

              <button
                type="button"
                class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                tooltip="Start Upload"
              >
                <Icon name="lucide:arrow-up" class="size-4" />

                <span class="sr-only">Start Upload</span>
              </button>
            </div>

            <div
              role="button"
              tabindex="-1"
              class="
        "
              @dragenter.stop.prevent
              @dragover.stop.prevent
              @drop="drop"
            >
              <div
                v-if="!files?.length"
                class="nui-focus border-muted-300 dark:border-muted-700 hover:border-muted-400 focus:border-muted-400 dark:hover:border-muted-600 dark:focus:border-muted-700 group cursor-pointer rounded-lg border-[3px] border-dashed p-8 transition-colors duration-300"
                tabindex="0"
                role="button"
                @click="open"
                @keydown.enter.prevent="open"
              >
                <div class="p-5 text-center">
                  <Icon
                    name="mdi-light:cloud-upload"
                    class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 mb-2 size-10 transition-colors duration-300"
                  />

                  <h4 class="text-muted-400 font-sans text-sm">
                    فایل ها را بکشید و اینجا رها کنید
                  </h4>

                  <div>
                    <span class="text-muted-400 font-sans text-[0.7rem] font-semibold uppercase">
                      یا
                    </span>
                  </div>

                  <label
                    for="file"
                    class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300"
                  >
                    انتخاب فایل
                  </label>
                </div>
              </div>

              <ul v-else class="mt-6 space-y-2">
                <li v-for="file in files" :key="file.name">
                  <div
                    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex items-center justify-end gap-2 rounded-xl border bg-white p-3"
                  >
                    <div class="flex items-center gap-2">
                      <div class="shrink-0">
                        <img
                          v-if="file.type.startsWith('image')"
                          class="size-14 rounded-xl object-cover object-center"
                          :src="preview(file).value"
                          alt="Image preview"
                        >

                        <img
                          v-else
                          class="size-14 rounded-xl object-cover object-center"
                          src="/img/avatars/placeholder-file.png"
                          alt="Image preview"
                        >
                      </div>

                      <div class="font-sans">
                        <span class="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm">
                          {{ file.name }}
                        </span>

                        <span class="text-muted-400 block text-xs">
                          {{ formatFileSize(file.size) }}
                        </span>
                      </div>
                    </div>

                    <div class="ms-auto w-32 px-4 transition-opacity duration-300" :class="'opacity-100'">
                      <BaseProgress
                        :value="0"
                        size="xs"
                        :color="'success'"
                      />
                    </div>

                    <div class="flex gap-2">
                      <button
                        class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled
                        type="button"
                        tooltip="Cancel"
                      >
                        <Icon name="lucide:slash" class="size-4" />

                        <span class="sr-only">Cancel</span>
                      </button>

                      <button
                        class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                        type="button"
                        tooltip="Upload"
                      >
                        <Icon name="lucide:arrow-up" class="size-4" />

                        <span class="sr-only">Upload</span>
                      </button>

                      <button
                        class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                        type="button"
                        tooltip="Remove"
                        @click.prevent="remove(file)"
                      >
                        <Icon name="lucide:x" class="size-4" />

                        <span class="sr-only">Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </BaseInputFileHeadless>
        </div>

        <!--Buttons-->
        <div class="flex gap-4">
          <BaseButton
            v-if="currentStepId > 0"
            :to="loading ? undefined : getPrevStep()?.to"
            :disabled="!getPrevStep()"
            size="lg"
            class="w-full"
          >
            <span>بازگشت</span>
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            <span>ثبت و ادامه</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!--Success section-->
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
          اطلاعات شما ثبت شد. لطفا منتظر پیام جلسه ی مصاحبه با سوپروایزر انتخاب شده باشید. پس از مصاحبه و تایید پروفایل می توانید فعالیت خود را در وب اپلیکیشن شروع نمایید.
        </BaseParagraph>
        <div class="flex justify-center">
          <BaseButton
            to="/mana/chat"
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
