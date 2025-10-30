<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  title: 'قوانین استفاده',
});

useHead({ htmlAttrs: { dir: 'rtl' } });
</script>

<template>
  <div class="dark:bg-muted-800 flex min-h-screen bg-white">
    <div
      class="relative flex flex-1 flex-col justify-center px-6 py-12 lg:px-8"
    >
      <div class="dark:bg-muted-800 relative mx-auto w-full max-w-4xl bg-white">
        <!--Nav-->
        <div class="flex w-full items-center justify-between">
          <NuxtLink
            to="/hampazhooh"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-colors duration-300"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به ثبت نام</span>
          </NuxtLink>
          <!--Theme button-->
          <BaseThemeToggle />
        </div>

        <div class="mt-8">
          <h1 class="mb-8 text-3xl font-medium leading-relaxed">
            قوانین استفاده از پلتفرم هم‌پژوهش
          </h1>

          <div class="max-w-none">
            <p class="mb-6 text-gray-600">
              به پلتفرم هم‌پژوهش خوش آمدید. استفاده از خدمات ما به معنای پذیرش شرایط و ضوابط زیر است.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۱. تعاریف
            </h2>
            <p class="mb-4 text-gray-600">
              پلتفرم هم‌پژوهش یک آنلاین پلتفرم برای پژوهشگران، محققان و متخصصان روانشناسی برای همکاری، اشتراک‌گذاری داده‌ها و انجام تحقیقات مشترک است.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۲. شرایط استفاده
            </h2>
            <ul class="mb-6 list-inside list-disc space-y-2 text-gray-600">
              <li>
                کاربران باید اطلاعات صحیح و کامل هنگام ثبت‌نام ارائه دهند
              </li>
              <li>
                کاربران موظف به حفظ حریم خصوصی داده‌های پژوهشی دیگر کاربران هستند
              </li>
              <li>
                هرگونه سوءاستفاده از داده‌ها یا نتایج پژوهشی دیگران ممنوع است
              </li>
              <li>
                کاربران باید قوانین مربوط به اخلاق پژوهشی را رعایت کنند
              </li>
            </ul>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۳. مالکیت معنوی
            </h2>
            <p class="mb-4 text-gray-600">
              تمام محتوا، داده‌ها و نتایج پژوهشی بارگذاری شده توسط کاربران متعلق به همان کاربر است. پلتفرم هم‌پژوهش هیچ ادعای مالکیتی در مورد آثار کاربران ندارد.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۴. حریم خصوصی داده‌ها
            </h2>
            <p class="mb-4 text-gray-600">
              ما متعهد به حفاظت از اطلاعات شخصی و داده‌های پژوهشی کاربران هستیم. داده‌ها فقط با رضایت صریح کاربر با پژوهشگران دیگر به اشتراک گذاشته می‌شود.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۵. مسئولیت‌ها
            </h2>
            <p class="mb-4 text-gray-600">
              کاربران مسئول کامل صحت و دقت داده‌های پژوهشی خود هستند. پلتفرم هیچ مسئولیتی در مورد محتوای بارگذاری شده توسط کاربران ندارد.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۶. خاتمه خدمات
            </h2>
            <p class="mb-4 text-gray-600">
              ما حق تعلیق یا خاتمه خدمات کاربرانی که این قوانین را نقض کنند را برای خود محفوظ می‌داریم.
            </p>

            <h2 class="mb-4 mt-8 text-xl font-semibold">
              ۷. تماس با ما
            </h2>
            <p class="mb-4 text-gray-600">
              برای هرگونه سؤال یا مشکوک در مورد این قوانین، می‌توانید با ما از طریق ایمیل info@hampazhooh.ir تماس بگیرید.
            </p>

            <p class="mt-12 text-sm text-gray-500">
              آخرین به‌روزرسانی: {{ new Date().toLocaleDateString('fa-IR') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
