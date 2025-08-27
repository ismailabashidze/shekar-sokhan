<script setup lang="ts">
definePageMeta({
  title: 'حریم خصوصی',
  preview: {
    title: 'Privacy Policy',
    description: 'Privacy policy and data protection information',
    categories: ['legal'],
    src: '/img/screens/privacy-hammasir.png',
    srcDark: '/img/screens/privacy-hammasir-dark.png',
    order: 7,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const lastUpdated = '1403/04/26'
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-1 shadow-2xl shadow-blue-500/25">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div class="relative rounded-2xl bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-700/90 px-8 py-12 backdrop-blur-xl">
        <!-- Floating decorative elements -->
        <div class="absolute right-8 top-6 size-24 rounded-full bg-white/5 blur-2xl" />
        <div class="absolute bottom-8 left-12 size-32 rounded-full bg-purple-400/10 blur-3xl" />

        <div class="relative text-center">
          <div class="mb-6 inline-flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 shadow-xl">
            <Icon name="ph:shield" class="size-10 text-white" />
          </div>

          <BaseHeading
            as="h1"
            size="4xl"
            weight="bold"
            lead="tight"
            class="mb-4 text-white drop-shadow-lg"
          >
            <span>سیاست حفظ حریم خصوصی</span>
          </BaseHeading>

          <BaseParagraph class="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
            <span>در همسیر، حفاظت از اطلاعات شخصی شما اهمیت بالایی دارد. این سند به طور شفاف و کامل نحوه جمع‌آوری، استفاده، ذخیره، انتقال و محافظت از اطلاعات شما را توضیح می‌دهد. ما متعهد به رعایت حداکثر مراقبت و احتیاط در مدیریت اطلاعات شما هستیم.</span>
          </BaseParagraph>

          <div class="mt-6 text-sm text-white/80">
            آخرین به‌روزرسانی: {{ lastUpdated }}
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Content -->
    <div class="rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <!-- Introduction -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-4 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:info" class="me-3 size-6 text-blue-600" />
            <span>مقدمه</span>
          </BaseHeading>

          <BaseParagraph class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>به همسیر خوش آمدید. ما متعهد به حفاظت جامع و کامل از حریم خصوصی کاربران خود هستیم. این سیاست حفظ حریم خصوصی به طور دقیق و شفاف توضیح می‌دهد که چه اطلاعاتی را جمع‌آوری می‌کنیم، چگونه از آن‌ها استفاده می‌کنیم، چه اقدامات امنیتی برای محافظت از اطلاعات شما انجام می‌دهیم و چه حقوقی در قبال این اطلاعات دارید.</span>
          </BaseParagraph>

          <BaseParagraph class="leading-relaxed text-gray-700 dark:text-gray-300">
            <span>با استفاده از خدمات ما، شما با جمع‌آوری و استفاده از اطلاعات خود در تطابق با این سیاست موافقت می‌کنید. با این حال، شما همواره حق دارید که شرایط استفاده از اطلاعات خود را به‌روز کنید یا از ادامه پردازش آن‌ها انصراف دهید.</span>
          </BaseParagraph>
        </section>

        <!-- Information We Collect -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:database" class="me-3 size-6 text-green-600" />
            <span>اطلاعاتی که جمع‌آوری می‌کنیم</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما تنها اطلاعاتی را جمع‌آوری می‌کنیم که برای ارائه خدمات به شما ضروری است یا با رضایت صریح شما جمع‌آوری شود. همه اطلاعات با رعایت بالاترین استانداردهای امنیتی و مطابق با قوانین حفاظت از داده‌ها ذخیره و پردازش می‌شوند.</span>
          </BaseParagraph>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:user" class="me-2 size-5 text-blue-600" />
                <span>اطلاعات شخصی</span>
              </BaseHeading>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>نام و نام خانوادگی (جهت احراز هویت و شخصی‌سازی خدمات)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>آدرس ایمیل (جهت ارتباط و احراز هویت)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>شماره تلفن (جهت احراز هویت و ارتباط اضطراری)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>تاریخ تولد (جهت شخصی‌سازی خدمات و محاسبه سن)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>اطلاعات جنسیت (جهت شخصی‌سازی خدمات)</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:chart-bar" class="me-2 size-5 text-purple-600" />
                <span>اطلاعات روان‌شناختی</span>
              </BaseHeading>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>نتایج آزمون‌های شخصیت‌شناسی (جهت ارائه تحلیل‌های دقیق)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>پاسخ‌های پرسش‌نامه‌ها (جهت بهبود خدمات روان‌شناختی)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>یادداشت‌های مشاوره (جهت پیگیری پیشرفت و ارائه خدمات بهتر)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>اطلاعات مربوط به پیشرفت در مسیر (جهت ارائه پیشنهادات متناسب)</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:globe" class="me-2 size-5 text-amber-600" />
                <span>اطلاعات فنی</span>
              </BaseHeading>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>آدرس IP (جهت امنیت و پیشگیری از سوءاستفاده)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>نوع مرورگر و دستگاه (جهت بهینه‌سازی تجربه کاربری)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>اطلاعات مربوط به استفاده از سرویس (جهت بهبود عملکرد)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>لاگ‌های دسترسی (جهت امنیت و پیگیری خطاها)</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:credit-card" class="me-2 size-5 text-emerald-600" />
                <span>اطلاعات مالی</span>
              </BaseHeading>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>اطلاعات پرداخت (شماره کارت به صورت رمزنگاری شده)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>تاریخچه خریدها (جهت مدیریت مالی و ارائه خدمات)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="me-2 mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>فاکتورها و رسیدهای پرداخت (جهت امور مالی و قانونی)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- How We Use Information -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:target" class="me-3 size-6 text-indigo-600" />
            <span>نحوه استفاده از اطلاعات</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما اطلاعات شما را تنها برای اهداف مشخص شده و با رعایت حقوق شما استفاده می‌کنیم. هیچ‌گاه اطلاعات شما را بدون رضایت صریح به اشخاص ثالث منتقل نمی‌کنیم، مگر مواردی که در این سند توضیح داده شده است.</span>
          </BaseParagraph>

          <div class="space-y-6">
            <div class="flex items-start rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-900/20">
              <Icon name="ph:brain" class="me-4 mt-0.5 size-6 shrink-0 text-indigo-600" />
              <div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-2 text-gray-900 dark:text-white"
                >
                  <span>تحلیل روان‌شناختی</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-700 dark:text-gray-300">
                  <span>برای ارائه تحلیل‌های شخصیتی دقیق، پیشنهادات متناسب با ویژگی‌های فردی و بهبود کیفیت خدمات روان‌شناختی. این تحلیل‌ها به صورت کاملاً محرمانه و با رعایت اصول اخلاق حرفه‌ای انجام می‌شود.</span>
                </BaseParagraph>
              </div>
            </div>

            <div class="flex items-start rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
              <Icon name="ph:users" class="me-4 mt-0.5 size-6 shrink-0 text-green-600" />
              <div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-2 text-gray-900 dark:text-white"
                >
                  <span>هماهنگی با همسر</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-700 dark:text-gray-300">
                  <span>برای مatching مناسب با افراد سازگار بر اساس ویژگی‌های روان‌شناختی و اهداف زندگی. این فرآیند با رعایت کامل محرمانگی و تنها با رضایت صریح شما انجام می‌شود.</span>
                </BaseParagraph>
              </div>
            </div>

            <div class="flex items-start rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
              <Icon name="ph:envelope" class="me-4 mt-0.5 size-6 shrink-0 text-amber-600" />
              <div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-2 text-gray-900 dark:text-white"
                >
                  <span>ارتباطات</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-700 dark:text-gray-300">
                  <span>برای ارسال اطلاع‌رسانی‌ها، به‌روزرسانی‌ها، پیشنهادات و پاسخ به درخواست‌های شما. شما همواره می‌توانید از دریافت این ارتباطات انصراف دهید.</span>
                </BaseParagraph>
              </div>
            </div>

            <div class="flex items-start rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-800 dark:bg-purple-900/20">
              <Icon name="ph:chart-line" class="me-4 mt-0.5 size-6 shrink-0 text-purple-600" />
              <div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-2 text-gray-900 dark:text-white"
                >
                  <span>بهبود خدمات</span>
                </BaseHeading>
                <BaseParagraph class="text-gray-700 dark:text-gray-300">
                  <span>برای تحلیل استفاده از سرویس، بهبود کیفیت خدمات و توسعه ویژگی‌های جدید. این تحلیل‌ها به صورت ناشناس و گروهی انجام می‌شود و هیچ‌گاه اطلاعات شخصی شما به صورت تفکیک شده منتشر نمی‌شود.</span>
                </BaseParagraph>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Protection -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:lock" class="me-3 size-6 text-red-600" />
            <span>حفاظت از داده‌ها</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما متعهد به اجرای بالاترین استانداردهای امنیتی برای حفاظت از اطلاعات شما هستیم. تیم امنیتی ما به‌طور مداوم در حال بررسی و به‌روزرسانی سیستم‌های امنیتی است تا اطمینان حاصل کنیم اطلاعات شما در برابر دسترسی‌های غیرمجاز، افشاء، تغییر یا نابودی محافظت می‌شود.</span>
          </BaseParagraph>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:shield-check" class="me-2 size-5 text-red-600" />
                <span>اقدامات امنیتی</span>
              </BaseHeading>
              <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-red-500" />
                  <span>رمزنگاری داده‌ها در حین انتقال و ذخیره‌سازی با استانداردهای بین‌المللی</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-red-500" />
                  <span>احراز هویت چندمرحله‌ای برای دسترسی به اطلاعات حساس</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-red-500" />
                  <span>بررسی امنیتی منظم سیستم‌ها و ارزیابی‌های خارجی</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-red-500" />
                  <span>محدود کردن دسترسی به اطلاعات شخصی تنها به کارمندان مجاز</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-red-500" />
                  <span>آموزش امنیتی مستمر برای کارمندان</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-3 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:clock" class="me-2 size-5 text-orange-600" />
                <span>نگهداری و حذف داده‌ها</span>
              </BaseHeading>
              <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-orange-500" />
                  <span>نگهداری اطلاعات به مدت حداکثر 10 سال پس از آخرین فعالیت یا تا زمانی که قانون اجازه می‌دهد</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-orange-500" />
                  <span>امکان حذف داده‌های شخصی در هر زمان با ارسال درخواست به آدرس ارتباطی ما</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-orange-500" />
                  <span>بایگانی ایمن اطلاعات پس از دوره فعالیت به مدت قانونی</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-orange-500" />
                  <span>پاک‌سازی خودکار داده‌های غیرضروری و منقضی‌شده</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check" class="me-2 mt-0.5 size-5 shrink-0 text-orange-500" />
                  <span>گزارش‌دهی شفاف در مورد وضعیت داده‌های کاربران</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- User Rights -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:user-circle-gear" class="me-3 size-6 text-teal-600" />
            <span>حقوق کاربران</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما به حقوق شما در قبال اطلاعات شخصی‌تان احترام کامل می‌گذاریم و متعهد به اجرای کامل حقوق شما هستیم. شما می‌توانید در هر زمان از این حقوق استفاده کنید و ما متعهد به پاسخگویی سریع و کامل به درخواست‌های شما هستیم.</span>
          </BaseParagraph>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-800">
                <Icon name="ph:eye" class="size-6 text-teal-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق دسترسی</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>درخواست ارائه کپی از اطلاعات شخصی خود و نحوه پردازش آن‌ها</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-800 dark:bg-cyan-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-800">
                <Icon name="ph:pencil" class="size-6 text-cyan-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق اصلاح</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>درخواست اصلاح اطلاعات نادرست، ناقص یا منسوخ‌شده در مورد خود</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-800">
                <Icon name="ph:trash" class="size-6 text-blue-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق حذف</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>درخواست حذف کامل اطلاعات شخصی خود (با رعایت محدودیت‌های قانونی)</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-800">
                <Icon name="ph:eye-slash" class="size-6 text-indigo-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق محدودیت پردازش</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>درخواست محدود کردن پردازش اطلاعات در شرایط خاص قانونی</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-800">
                <Icon name="ph:arrow-square-out" class="size-6 text-purple-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق انتقال داده</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>دریافت اطلاعات شخصی در قالب قابل خواندن توسط ماشین برای انتقال به سرویس دیگر</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-pink-200 bg-pink-50 p-6 dark:border-pink-800 dark:bg-pink-900/20">
              <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-800">
                <Icon name="ph:x-circle" class="size-6 text-pink-600" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                <span>حق مخالفت</span>
              </BaseHeading>
              <BaseParagraph class="text-sm text-gray-700 dark:text-gray-300">
                <span>معترض شدن به پردازش اطلاعات شخصی و درخواست توقف پردازش</span>
              </BaseParagraph>
            </div>
          </div>

          <BaseParagraph class="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>برای اجرای هر یک از این حقوق، می‌توانید با ما از طریق اطلاعات تماس ارائه شده در پایان این سند تماس بگیرید. ما متعهد به پاسخگویی در کوتاه‌ترین زمان ممکن هستیم (حداکثر یک ماه کاری).</span>
          </BaseParagraph>
        </section>

        <!-- Third-Party Services -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:share-network" class="me-3 size-6 text-yellow-600" />
            <span>سرویس‌های شخص ثالث</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما ممکن است از خدمات شخص ثالث برای بهبود تجربه کاربری استفاده کنیم. این خدمات دارای سیاست‌های حفظ حریم خصوصی خود هستند و ما مسئولیت مستقیمی در قبال نحوه جمع‌آوری و استفاده آن‌ها از اطلاعات شما نداریم. با این حال، ما تنها با سرویس‌دهندگانی همکاری می‌کنیم که تعهد به حفاظت از اطلاعات کاربران دارند.</span>
          </BaseParagraph>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
              <div class="mb-3 flex items-center">
                <div class="me-3 flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Icon name="ph:google-logo" class="size-6 text-blue-600" />
                </div>
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="text-gray-900 dark:text-white"
                >
                  <span>Google Analytics</span>
                </BaseHeading>
              </div>
              <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
                <span>برای تحلیل ترافیک و بهبود عملکرد وب‌سایت. ما اطلاعات را به صورت ناشناس‌سازی شده ارسال می‌کنیم.</span>
              </BaseParagraph>
              <BaseParagraph class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >سیاست حفظ حریم خصوصی Google</a>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
              <div class="mb-3 flex items-center">
                <div class="me-3 flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Icon name="ph:cloud" class="size-6 text-blue-600" />
                </div>
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="text-gray-900 dark:text-white"
                >
                  <span>Firebase</span>
                </BaseHeading>
              </div>
              <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
                <span>برای احراز هویت و ذخیره‌سازی داده‌ها. ما از قابلیت‌های امنیتی پیشرفته آن استفاده می‌کنیم.</span>
              </BaseParagraph>
              <BaseParagraph class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >سیاست حفظ حریم خصوصی Firebase</a>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
              <div class="mb-3 flex items-center">
                <div class="me-3 flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Icon name="ph:credit-card" class="size-6 text-green-600" />
                </div>
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="text-gray-900 dark:text-white"
                >
                  <span>درگاه‌های پرداخت</span>
                </BaseHeading>
              </div>
              <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
                <span>برای پردازش تراکنش‌های مالی. اطلاعات مالی شما مستقیماً به درگاه پرداخت ارسال می‌شود و در سرورهای ما ذخیره نمی‌شود.</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
              <div class="mb-3 flex items-center">
                <div class="me-3 flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Icon name="ph:chat-circle" class="size-6 text-purple-600" />
                </div>
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="text-gray-900 dark:text-white"
                >
                  <span>سرویس‌های ارتباطی</span>
                </BaseHeading>
              </div>
              <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
                <span>برای ارسال ایمیل و پیامک به کاربران. اطلاعات تماس شما تنها برای ارتباط با شما استفاده می‌شود.</span>
              </BaseParagraph>
            </div>
          </div>

          <BaseParagraph class="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>در صورتی که سرویس شخص ثالث جدیدی اضافه کنیم، به‌روزرسانی این بخش و اطلاع‌رسانی به شما از طریق ایمیل انجام خواهد شد.</span>
          </BaseParagraph>
        </section>

        <!-- Children's Privacy -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:baby" class="me-3 size-6 text-pink-600" />
            <span>حریم خصوصی کودکان</span>
          </BaseHeading>

          <BaseParagraph class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>خدمات ما به‌طور خاص برای افراد بالای 13 سال طراحی شده است. ما عمداً اطلاعات شخصی کودکان زیر 13 سال را جمع‌آوری نمی‌کنیم و در صورت کشف این موضوع، فوراً اقدام به حذف آن‌ها خواهیم کرد. اگر متوجه شویم که اطلاعاتی از کودکی زیر 13 سال را جمع‌آوری کرده‌ایم، از طریق اطلاعات تماس ارائه شده در این سند با ما تماس بگیرید تا اقدام لازم را انجام دهیم.</span>
          </BaseParagraph>

          <BaseParagraph class="leading-relaxed text-gray-700 dark:text-gray-300">
            <span>اگر والد یا قیم قانونی هستید و معتقدید کودک شما اطلاعاتی را با ما به اشتراک گذاشته است، لطفاً فوراً با ما تماس بگیرید. ما متعهد به حفاظت ویژه از اطلاعات کودکان هستیم و تمام اقدامات لازم را برای حذف این اطلاعات در کوتاه‌ترین زمان ممکن انجام خواهیم داد.</span>
          </BaseParagraph>

          <BaseParagraph class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 leading-relaxed text-gray-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-gray-300">
            <span class="font-semibold">توجه والدین:</span>
            <span> ما توصیه می‌کنیم که کودکان خود را در مورد اهمیت حفظ اطلاعات شخصی و امنیت در فضای آنلاین آموزش دهید و از آن‌ها بخواهید بدون اجازه شما اطلاعات شخصی خود را در وب‌سایت‌ها و برنامه‌ها وارد نکنند.</span>
          </BaseParagraph>
        </section>

        <!-- Changes to Policy -->
        <section class="mb-10">
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:arrows-clockwise" class="me-3 size-6 text-amber-600" />
            <span>تغییرات در سیاست</span>
          </BaseHeading>

          <BaseParagraph class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>ما ممکن است این سیاست حفظ حریم خصوصی را به‌روزرسانی کنیم تا منعکس‌کننده تغییرات در قوانین، مقررات یا نحوه عملکرد ما باشد. هرگونه تغییر در این سند به‌روزرسانی خواهد شد و تاریخ ویرایش در بالای صفحه نمایش داده خواهد شد.</span>
          </BaseParagraph>

          <BaseParagraph class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>در صورت ایجاد تغییرات اساسی که بر نحوه پردازش اطلاعات شما تأثیر بگذارد، از طریق ایمیل به شما اطلاع خواهیم داد یا یک اعلان برجسته در وب‌سایت قرار خواهیم داد. توصیه می‌کنیم به‌طور منظم این صفحه را برای اطلاع از تغییرات بررسی کنید.</span>
          </BaseParagraph>

          <BaseParagraph class="leading-relaxed text-gray-700 dark:text-gray-300">
            <span>استفاده مستمر شما از خدمات ما پس از انتشار هرگونه تغییر در این سیاست به معنای پذیرش آن تغییرات است. در صورتی که با تغییرات موافق نباشید، می‌توانید از خدمات ما انصراف دهید و درخواست حذف اطلاعات خود را ارسال کنید.</span>
          </BaseParagraph>
        </section>

        <!-- Contact Information -->
        <section>
          <BaseHeading
            as="h2"
            size="2xl"
            weight="semibold"
            class="mb-6 flex items-center text-gray-900 dark:text-white"
          >
            <Icon name="ph:envelope" class="me-3 size-6 text-green-600" />
            <span>راه‌های تماس</span>
          </BaseHeading>

          <BaseParagraph class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <span>اگر سوالی در مورد این سیاست حفظ حریم خصوصی دارید یا می‌خواهید از حقوق خود در قبال اطلاعات شخصی‌تان استفاده کنید، لطفاً با ما تماس بگیرید. تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست و متعهد به حفظ محرمانگی اطلاعات شما در طول فرآیند ارتباط است.</span>
          </BaseParagraph>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-4 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:envelope-open" class="me-2 size-5 text-green-600" />
                <span>ایمیل</span>
              </BaseHeading>

              <div class="space-y-3">
                <div class="flex items-center">
                  <Icon name="ph:envelope" class="me-3 size-5 text-gray-500" />
                  <span class="text-gray-700 dark:text-gray-300">privacy@hammasir.com</span>
                  <span class="mr-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">(برای سوالات مربوط به حریم خصوصی)</span>
                </div>
                <div class="flex items-center">
                  <Icon name="ph:envelope" class="me-3 size-5 text-gray-500" />
                  <span class="text-gray-700 dark:text-gray-300">support@hammasir.com</span>
                  <span class="mr-2 rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">(برای سوالات کلی و پشتیبانی)</span>
                </div>
              </div>

              <BaseParagraph class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>پاسخ به ایمیل‌های شما در اولویت کار ما قرار دارد. معمولاً ظرف 24 تا 48 ساعت کاری پاسخ دریافت خواهید کرد.</span>
              </BaseParagraph>
            </div>

            <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-4 flex items-center text-gray-900 dark:text-white"
              >
                <Icon name="ph:map-pin" class="me-2 size-5 text-blue-600" />
                <span>آدرس و تلفن</span>
              </BaseHeading>

              <div class="space-y-3">
                <div class="flex items-start">
                  <Icon name="ph:buildings" class="me-3 mt-0.5 size-5 text-gray-500" />
                  <span class="text-gray-700 dark:text-gray-300">تهران، خیابان ولیعصر، پلاک 1234، طبقه 5</span>
                </div>
                <div class="flex items-center">
                  <Icon name="ph:phone" class="me-3 size-5 text-gray-500" />
                  <span class="text-gray-700 dark:text-gray-300">021-12345678</span>
                </div>
              </div>

              <BaseParagraph class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>برای حضوری مراجعه، لطفاً پیش از مراجعه با ما تماس بگیرید تا زمان مناسب برای ملاقات را هماهنگ کنیم.</span>
              </BaseParagraph>
            </div>
          </div>

          <div class="mt-8 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-3 flex items-center text-gray-900 dark:text-white"
            >
              <Icon name="ph:clock" class="me-2 size-5 text-purple-600" />
              <span>ساعت پاسخگویی</span>
            </BaseHeading>
            <div class="grid gap-4 text-gray-700 dark:text-gray-300 md:grid-cols-2">
              <div>
                <span class="font-medium">شنبه تا چهارشنبه:</span> 9:00 تا 17:00
              </div>
              <div>
                <span class="font-medium">پنج‌شنبه:</span> 9:00 تا 13:00
              </div>
            </div>
            <BaseParagraph class="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span>در خارج از ساعات پاسخگویی، می‌توانید از طریق ایمیل با ما در ارتباط باشید. پیام‌های ارسالی در اولین ساعت کاری پاسخ داده خواهند شد.</span>
            </BaseParagraph>
          </div>

          <div class="mt-8 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-3 flex items-center text-gray-900 dark:text-white"
            >
              <Icon name="ph:shield-warning" class="me-2 size-5 text-amber-600" />
              <span>گزارش نقض امنیت</span>
            </BaseHeading>
            <BaseParagraph class="text-gray-700 dark:text-gray-300">
              <span>اگر نقض امنیتی یا سوءاستفاده از اطلاعات کاربران را مشاهده کردید، لطفاً فوراً از طریق ایمیل security@hammasir.com یا تلفن 021-12345678 گزارش دهید. ما متعهد به بررسی فوری چنین گزارش‌هایی هستیم.</span>
            </BaseParagraph>
          </div>
        </section>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-center gap-4">
      <BaseButton
        variant="outline"
        class="border-gray-300 text-gray-700 hover:bg-gray-50"
        @click="navigateTo('/hammasir')"
      >
        <Icon name="ph:arrow-right" class="me-2 size-4" />
        <span>بازگشت به داشبورد</span>
      </BaseButton>

      <BaseButton
        class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
        @click="window.print()"
      >
        <Icon name="ph:printer" class="me-2 size-4" />
        <span>چاپ سیاست</span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations for decorative elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient text animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
