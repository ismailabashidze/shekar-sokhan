<script setup lang="ts">
definePageMeta({
  title: 'حریم خصوصی - TogetherMama',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-white">
    <div class="relative mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <NuxtLink
          to="/togethermama"
          class="text-muted-400 hover:text-primary-500 mb-8 inline-flex items-center gap-2 font-sans font-medium transition-colors duration-300"
        >
          <Icon name="gg:arrow-long-right" class="size-5" />
          <span>بازگشت به صفحه اصلی</span>
        </NuxtLink>
        <BaseHeading
          as="h1"
          size="3xl"
          weight="bold"
          class="text-muted-800 dark:text-white"
        >
          سیاست حفظ حریم خصوصی
        </BaseHeading>
        <BaseParagraph class="text-muted-500 mt-4">
          آخرین به‌روزرسانی: ۱۴۰۳/۰۵/۰۱
        </BaseParagraph>
      </div>

      <!-- Content -->
      <div class="prose prose-muted dark:prose-invert max-w-none">
        <div class="bg-muted-200 dark:bg-muted-800 mb-8 rounded-lg p-6">
          <BaseParagraph class="mb-4">
            در TogetherMama، ما حریم خصوصی شما را جدی می‌گیریم. این سیاست حفظ حریم خصوصی توضیح می‌دهد که چگونه اطلاعات شخصی شما جمع‌آوری، استفاده و محافظت می‌شود.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            اطلاعاتی که جمع‌آوری می‌کنیم
          </BaseHeading>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات ثبت‌نام (نام، ایمیل، شماره تماس)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات پروفایل (سن کودک، جنسیت، تاریخ تولد)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات جلسات مشاوره (متن گفتگوها)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات پرداخت (برای پرداخت اشتراک)</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            نحوه استفاده از اطلاعات
          </BaseHeading>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>ارائه خدمات مشاوره والدین</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>بهبود کیفیت خدمات و تجربه کاربری</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>ارتباط با کاربران درباره خدمات</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>پردازش پرداخت‌ها و مدیریت اشتراک‌ها</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            اشتراک‌گذاری اطلاعات
          </BaseHeading>
          <BaseParagraph class="mb-4">
            ما اطلاعات شخصی شما را با اشخاص ثالث به اشتراک نمی‌گذاریم، مگر در موارد زیر:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>با رضایت صریح شما</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>برای رعایت الزامات قانونی</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>برای حفاظت از حقوق و امنیت ما یا دیگران</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            امنیت اطلاعات
          </BaseHeading>
          <BaseParagraph>
            ما از تدابیر امنیتی مناسب برای محافظت از اطلاعات شخصی شما استفاده می‌کنیم. اطلاعات شما با رمزگذاری ذخیره و انتقال می‌شوند.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            حقوق شما
          </BaseHeading>
          <BaseParagraph class="mb-4">
            شما حق دارید:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>دسترسی به اطلاعات شخصی خود</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اصلاح اطلاعات نادرست</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>حذف اطلاعات خود</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>محدود کردن پردازش اطلاعات</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            تماس با ما
          </BaseHeading>
          <BaseParagraph>
            اگر سوالی درباره این سیاست حفظ حریم خصوصی دارید، با ما تماس بگیرید:
          </BaseParagraph>
          <BaseParagraph class="mt-2">
            ایمیل: privacy@togethermama.com
          </BaseParagraph>
        </div>
      </div>
    </div>
  </div>
</template>
