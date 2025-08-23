<script setup lang="ts">
definePageMeta({
  title: 'سیاست بازپرداخت - TogetherMama',
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
          سیاست بازپرداخت
        </BaseHeading>
        <BaseParagraph class="text-muted-500 mt-4">
          آخرین به‌روزرسانی: ۱۴۰۳/۰۵/۰۱
        </BaseParagraph>
      </div>

      <!-- Content -->
      <div class="prose prose-muted dark:prose-invert max-w-none">
        <div class="bg-muted-200 dark:bg-muted-800 mb-8 rounded-lg p-6">
          <BaseParagraph class="mb-4">
            ما در TogetherMama به رضایت شما اهمیت می‌دهیم و ضمانت بازپرداخت ارائه می‌دهیم.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ضمانت رضایت ۷ روزه
          </BaseHeading>
          <BaseParagraph class="mb-4">
            اگر در ۷ روز اول استفاده از خدمات ما راضی نبودید، کل مبلغ پرداختی شما بازگردانده خواهد شد. شرایط:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>درخواست باید ظرف ۷ روز از تاریخ خرید ارسال شود</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>استفاده از جلسات مشاوره باید کمتر از ۳ جلسه باشد</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>درخواست باید از طریق ایمیل support@togethermama.com ارسال شود</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            موارد مستثنی
          </BaseHeading>
          <BaseParagraph class="mb-4">
            بازپرداخت در موارد زیر امکان‌پذیر نیست:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:x-circle" class="text-danger-500 mt-1 size-5" />
              <span>استفاده بیش از ۳ جلسه مشاوره</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:x-circle" class="text-danger-500 mt-1 size-5" />
              <span>گذشتن بیش از ۷ روز از تاریخ خرید</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:x-circle" class="text-danger-500 mt-1 size-5" />
              <span>خرید اشتراک برای دوره‌های گذشته</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:x-circle" class="text-danger-500 mt-1 size-5" />
              <span>استفاده از خدمات به‌صورت نامناسب یا سوءاستفاده</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            روند درخواست بازپرداخت
          </BaseHeading>
          <ol class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="bg-primary-500 flex size-6 items-center justify-center rounded-full text-white">
                ۱
              </div>
              <span>ارسال ایمیل به support@togethermama.com با موضوع "درخواست بازپرداخت"</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="bg-primary-500 flex size-6 items-center justify-center rounded-full text-white">
                ۲
              </div>
              <span>ذکر شماره سفارش و دلیل درخواست</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="bg-primary-500 flex size-6 items-center justify-center rounded-full text-white">
                ۳
              </div>
              <span>بررسی درخواست توسط تیم پشتیبانی (ظرف ۲۴-۴۸ ساعت)</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="bg-primary-500 flex size-6 items-center justify-center rounded-full text-white">
                ۴
              </div>
              <span>در صورت تأیید، بازپرداخت ظرف ۵-۷ روز کاری</span>
            </li>
          </ol>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            روش‌های بازپرداخت
          </BaseHeading>
          <BaseParagraph class="mb-4">
            بازپرداخت به روش پرداخت اولیه انجام می‌شود:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>کارت‌های بانکی: واریز به همان کارت (۵-۷ روز کاری)</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>کیف پول الکترونیکی: واریز به کیف پول (۲-۳ روز کاری)</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            سوالات متداول
          </BaseHeading>
          <div class="space-y-4">
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2">
                آیا برای درخواست بازپرداخت نیاز به دلیل دارم؟
              </BaseHeading>
              <BaseParagraph>
                بله، لطفاً دلیل خود را به‌صورت مختصر ذکر کنید تا بتوانیم خدمات خود را بهبود ببخشیم.
              </BaseParagraph>
            </div>
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2">
                چه مدت طول می‌کشد تا بازپرداخت انجام شود؟
              </BaseHeading>
              <BaseParagraph>
                پس از تأیید درخواست، بازپرداخت ظرف ۵-۷ روز کاری انجام می‌شود.
              </BaseParagraph>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            تماس با ما
          </BaseHeading>
          <BaseParagraph>
            اگر سوالی درباره سیاست بازپرداخت دارید، با ما تماس بگیرید:
          </BaseParagraph>
          <BaseParagraph class="mt-2">
            ایمیل: refunds@togethermama.com
          </BaseParagraph>
        </div>
      </div>
    </div>
  </div>
</template>
