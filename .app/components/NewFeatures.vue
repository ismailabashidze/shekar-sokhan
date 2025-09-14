<template>
  <div
    class="bg-muted-200 dark:bg-muted-950/50 rounded-xl p-4 sm:p-6"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <BaseHeading
          as="h3"
          weight="medium"
          size="xl"
          class="text-muted-800 dark:text-muted-100"
        >
          قابلیت های جدید
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400">
          ویژگی های جدید اضافه شده در نسخه ی جدید
        </BaseParagraph>
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>
    <div class="ltablet:grid-cols-1 grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div class="relative">
        <BaseCard
          rounded="md"
          class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div
            class="bg-muted-100 dark:bg-muted-900 flex w-full shrink-0 items-center justify-center rounded-xl sm:size-32"
          >
            <img
              src="/img/illustrations/ui/code.png"
              class="w-full rounded-lg"
              alt=""
            >
          </div>
          <div class="flex flex-col">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              دریافت کد در قبال کار نیک
            </BaseHeading>
            <BaseParagraph
              size="xs"
              class="text-muted-500 dark:text-muted-400 mb-4"
            >
              امکان دریافت کد اشتراک در قبال انجام کارهای نیک به سامانه افزوده شده است.
            </BaseParagraph>
            <div class="mb-1 mt-auto">
              <DemoLinkArrow to="/deeds/start" label="بیشتر بدانید" />
            </div>
          </div>
        </BaseCard>
      </div>
      <div class="relative">
        <BaseCard
          rounded="md"
          class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div
            class="bg-muted-200 dark:bg-muted-900 flex w-full shrink-0 items-center justify-center rounded-xl sm:size-32"
          >
            <img
              src="/img/illustrations/ui/analysis.png"
              class="w-full rounded-lg"
              alt=""
            >
          </div>
          <div class="flex flex-col">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              افزودن گزارش
            </BaseHeading>
            <BaseParagraph
              size="xs"
              class="text-muted-500 dark:text-muted-400 mb-4"
            >
              گزارش کاربردی جلسه بعد از اتمام جلسه قابل دریافت می باشد
            </BaseParagraph>
            <div class="mb-1 mt-auto">
              <DemoLinkArrow to="#" label="بیشتر بدانید" />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
