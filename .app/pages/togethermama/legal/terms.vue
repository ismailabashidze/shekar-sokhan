<script setup lang="ts">
definePageMeta({
  title: 'شرایط استفاده - TogetherMama',
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
          شرایط استفاده از خدمات
        </BaseHeading>
        <BaseParagraph class="text-muted-500 mt-4">
          آخرین به‌روزرسانی: ۱۴۰۳/۰۵/۰۱
        </BaseParagraph>
      </div>

      <!-- Content -->
      <div class="prose prose-muted dark:prose-invert max-w-none">
        <div class="bg-muted-200 dark:bg-muted-800 mb-8 rounded-lg p-6">
          <BaseParagraph class="mb-4">
            لطفاً این شرایط استفاده از خدمات TogetherMama را به دقت مطالعه کنید. استفاده از خدمات ما به معنای پذیرش این شرایط است.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۱. پذیرش شرایط
          </BaseHeading>
          <BaseParagraph>
            با ثبت‌نام و استفاده از خدمات TogetherMama، شما این شرایط استفاده و سیاست حفظ حریم خصوصی ما را می‌پذیرید.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۲. خدمات ارائه شده
          </BaseHeading>
          <BaseParagraph class="mb-4">
            TogetherMama خدمات مشاوره والدین را ارائه می‌دهد، شامل:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>جلسات مشاوره آنلاین با روانشناسان متخصص</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>مقالات و منابع آموزشی</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>گروه‌های حمایتی آنلاین</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>ابزارهای رشد و توسعه کودک</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۳. مسئولیت‌های کاربر
          </BaseHeading>
          <BaseParagraph class="mb-4">
            کاربران موظفند:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات دقیق و واقعی در حین ثبت‌نام ارائه دهند</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>از خدمات به‌صورت قانونی و اخلاقی استفاده کنند</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>به حریم خصوصی دیگر کاربران احترام بگذارند</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>اطلاعات حساب خود را محرمانه نگه دارند</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۴. محدودیت‌های خدمات
          </BaseHeading>
          <BaseParagraph class="mb-4">
            ما هیچ گونه تضمینی برای نتایج مشاوره یا خدمات ارائه شده نمی‌دهیم. خدمات ما جایگزین مشاوره حضوری با پزشک یا روانشناس نیست.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۵. پرداخت و اشتراک
          </BaseHeading>
          <BaseParagraph class="mb-4">
            استفاده از برخی خدمات نیازمند پرداخت اشتراک است. با خرید اشتراک، شما:
          </BaseParagraph>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>حق استفاده از خدمات مربوطه را برای دوره زمانی مشخص دارید</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="ph:check-circle" class="text-success-500 mt-1 size-5" />
              <span>می‌توانید از ضمانت بازگشت وجه ۷ روزه استفاده کنید</span>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۶. تغییرات در شرایط
          </BaseHeading>
          <BaseParagraph>
            ما ممکن است این شرایط را به‌روزرسانی کنیم. تغییرات در همین صفحه اعمال خواهند شد و تاریخ به‌روزرسانی در بالای صفحه نمایش داده می‌شود.
          </BaseParagraph>
        </div>

        <div class="mb-8">
          <BaseHeading as="h2" size="xl" weight="semibold" class="mb-4 text-primary-600">
            ۷. تماس با ما
          </BaseHeading>
          <BaseParagraph>
            اگر سوالی درباره این شرایط دارید، با ما تماس بگیرید:
          </BaseParagraph>
          <BaseParagraph class="mt-2">
            ایمیل: terms@togethermama.com
          </BaseParagraph>
        </div>
      </div>
    </div>
  </div>
</template>
