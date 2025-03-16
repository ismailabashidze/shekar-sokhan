<script setup lang="ts">
definePageMeta({
  title: 'کارهای نیک',
  preview: {
    title: 'صفحه خوش‌آمدگویی کارهای نیک',
    description: 'صفحه شروع برای کارهای نیک',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-welcome.png',
    srcDark: '/img/screens/dashboards-welcome-dark.png',
    order: 13,
  },
  layout: 'sidebar',
})

useHead({
  title: 'به کارهای نیک خوش آمدید',
  htmlAttrs: { dir: 'rtl' },
})

// Redirect after 3 seconds
onMounted(() => {
  // setTimeout(() => {
  // navigateTo('/deeds/list')
  // }, 3000)
})
</script>

<template>
  <div class="relative flex items-center justify-center">
    <div class="mx-auto w-full max-w-4xl px-4">
      <div class="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div class="text-center">
          <div class="bg-primary-500/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Icon name="lucide:heart" class="text-primary-500 size-6" />
          </div>
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 mb-2 dark:text-white"
          >
            <span>خانواده و دوستان</span>
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500">
            <span>کارهای نیک برای تقویت روابط خانوادگی و دوستانه</span>
          </BaseParagraph>
        </div>
        <div class="text-center">
          <div class="bg-info-500/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Icon name="lucide:users" class="text-info-500 size-6" />
          </div>
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 mb-2 dark:text-white"
          >
            <span>جامعه</span>
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500">
            <span>کارهای نیک برای کمک به جامعه و همسایگان</span>
          </BaseParagraph>
        </div>
        <div class="text-center">
          <div class="bg-success-500/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Icon name="lucide:moon" class="text-success-500 size-6" />
          </div>
          <BaseHeading
            as="h3"
            size="sm"
            weight="medium"
            class="text-muted-800 mb-2 dark:text-white"
          >
            <span>معنویت</span>
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500">
            <span>کارهای نیک برای رشد معنوی و آرامش درونی</span>
          </BaseParagraph>
        </div>
      </div>
      <div class="text-center">
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
          <span>در مسیر انجام کارهای نیک، هر قدم کوچک می‌تواند تأثیری بزرگ داشته باشد.</span>
        </BaseParagraph>

        <div class="flex justify-center gap-2">
          <BaseButton
            to="/deeds/list"
            color="primary"
            rounded="lg"
          >
            <Icon name="lucide:list" class="ml-2 size-5" />
            <span>مشاهده کارهای نیک</span>
          </BaseButton>
          <BaseButton
            to="/deeds/suggest/step-1"
            color="muted"
            rounded="lg"
          >
            <Icon name="lucide:plus" class="ml-2 size-5" />
            <span>پیشنهاد کار نیک</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
