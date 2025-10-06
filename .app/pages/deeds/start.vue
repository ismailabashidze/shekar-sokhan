<script setup lang="ts">
definePageMeta({
  title: 'کارهای نیک',
  layout: 'sidebar',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
})

const { autoStartTour } = useTour()

onMounted(() => {
  // Auto-start the deeds tour with a slight delay
  autoStartTour('deeds-start', 1500)
})
</script>

<template>
  <div class="mx-auto w-full px-4">
    <div data-tour="deeds-categories-top" class="mb-16 flex flex-row gap-2 sm:grid sm:grid-cols-3 sm:gap-6">
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-primary-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="lucide:heart" class="text-primary-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>خانواده و دوستان</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک برای تقویت روابط خانوادگی و دوستانه</span>
        </BaseParagraph>
      </div>
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-info-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="lucide:users" class="text-info-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>جامعه</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک برای کمک به جامعه و همسایگان</span>
        </BaseParagraph>
      </div>
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-success-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="lucide:moon" class="text-success-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>معنویت</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک برای رشد معنوی و آرامش درونی</span>
        </BaseParagraph>
      </div>
    </div>
    <div data-tour="deeds-intro" class="text-center">
      <BaseHeading
        tag="h1"
        size="4xl"
        weight="light"
        class="text-muted-800 mb-4 dark:text-white"
      >
        <span>به کارهای نیک </span>
        <span class="text-primary-500 bold">خوش آمدید</span>
      </BaseHeading>

      <BaseParagraph
        size="lg"
        class="text-muted-500 dark:text-muted-400 mb-8"
      >
        <span>در مسیر انجام کارهای نیک، هر قدم کوچک می‌تواند تأثیری بزرگ داشته باشد. با انجام این کارها، کد تخفیف دریافت کنید و از مشاوره روانشناختی با هوش مصنوعی به صورت رایگان بهره‌مند شوید.</span>
      </BaseParagraph>

      <div data-tour="deeds-actions" class="flex justify-center gap-2">
        <BaseButton
          to="/deeds/list"
          color="primary"
          rounded="lg"
        >
          <Icon name="lucide:list" class="ml-2 size-5" />
          <span>مشاهده کارهای نیک</span>
        </BaseButton>
        <BaseButton
          to="/deeds/suggest"
          color="muted"
          rounded="lg"
          disabled
        >
          <Icon name="lucide:plus" class="ml-2 size-5" />
          <span>شما پیشنهاد کنید  ! (بزودی)</span>
        </BaseButton>
      </div>
    </div>
    <div
      data-tour="deeds-categories-bottom" 
      class="mt-16 flex flex-row gap-2 sm:grid sm:grid-cols-3 sm:gap-6"
    >
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-warning-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="lucide:book-open" class="text-warning-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>آموزش</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک در زمینه آموزش و یادگیری</span>
        </BaseParagraph>
      </div>
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-danger-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="lucide:heart-handshake" class="text-danger-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>سلامت</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک در حوزه سلامت و بهداشت</span>
        </BaseParagraph>
      </div>
      <div class="w-1/3 text-center sm:w-auto">
        <div class="bg-muted-500/20 mx-auto mb-2 flex size-10 items-center justify-center rounded-full sm:mb-4 sm:size-12">
          <Icon name="ph:potted-plant" class="text-muted-500 size-5 sm:size-6" />
        </div>
        <BaseHeading
          as="h3"
          size="xs"
          sm="sm"
          weight="medium"
          class="text-muted-800 mb-0 dark:text-white sm:mb-2"
        >
          <span>محیط زیست</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 hidden sm:block">
          <span>کارهای نیک برای حفاظت از طبیعت و محیط زیست</span>
        </BaseParagraph>
      </div>
    </div>
  </div>
  <!-- Floating Buttons -->
  <FloatingButtons />
</template>
