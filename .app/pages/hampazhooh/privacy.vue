<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  title: 'قوانین حریم خصوصی',
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
          <h1 class="text-3xl font-medium leading-relaxed mb-8">
            قوانین حریم خصوصی پلتفرم هم‌پژوهش
          </h1>

          <div class="max-w-none">
            <p class="text-gray-600 mb-6">
              حفظ حریم خصوصی شما برای ما بسیار مهم است. این سیاست حریم خصوصی توضیح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم.
            </p>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۱. اطلاعاتی که جمع‌آوری می‌کنیم
            </h2>
            
            <h3 class="text-lg font-medium mb-3 mt-6">
              اطلاعات شخصی
            </h3>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                نام و نام خانوادگی
              </li>
              <li>
                آدرس ایمیل
              </li>
              <li>
                شماره تماس
              </li>
              <li>
                نام موسسه/دانشگاه
              </li>
              <li>
                اطلاعات تحصیلی و تخصصی
              </li>
            </ul>

            <h3 class="text-lg font-medium mb-3 mt-6">
              اطلاعات پژوهشی
            </h3>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                داده‌های تحقیقاتی بارگذاری شده
              </li>
              <li>
                نتایج پژوهش‌ها
              </li>
              <li>
                سوابق پژوهشی
              </li>
              <li>
                زمینه‌های تخصصی
              </li>
            </ul>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۲. استفاده از اطلاعات
            </h2>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                ارائه و بهبود خدمات پلتفرم
              </li>
              <li>
                ارتباط با کاربران برای امور پژوهشی
              </li>
              <li>
                تحلیل داده‌ها برای بهبود کیفیت خدمات
              </li>
              <li>
                ایجاد فرصت‌های همکاری پژوهشی
              </li>
            </ul>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۳. اشتراک‌گذاری اطلاعات
            </h2>
            <p class="text-gray-600 mb-4">
              اطلاعات شما بدون اجازه صریح شما با شخص ثالث به اشتراک گذاشته نمی‌شود. اطلاعات فقط در موارد زیر به اشتراک گذاشته می‌شود:
            </p>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                با رضایت صریح شما برای همکاری پژوهشی
              </li>
              <li>
                طبق قوانین جاری کشور
              </li>
              <li>
                برای محافظت از حقوق و امنیت پلتفرم
              </li>
            </ul>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۴. امنیت داده‌ها
            </h2>
            <p class="text-gray-600 mb-4">
              ما از اقدامات امنیتی پیشرفته برای محافظت از اطلاعات شما استفاده می‌کنیم:
            </p>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                رمزنگاری داده‌ها
              </li>
              <li>
                کنترل دسترسی محدود
              </li>
              <li>
                پشتیبان‌گیری منظم
              </li>
              <li>
                نظارت امنیتی مستمر
              </li>
            </ul>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۵. حقوق کاربران
            </h2>
            <ul class="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>
                دسترسی به اطلاعات شخصی خود
              </li>
              <li>
                اصلاح اطلاعات نادرست
              </li>
              <li>
                حذف حساب کاربری
              </li>
              <li>
                بازپس‌گیری رضایت برای اشتراک‌گذاری داده‌ها
              </li>
            </ul>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۶. کوکی‌ها
            </h2>
            <p class="text-gray-600 mb-4">
              ما از کوکی‌ها برای بهبود تجربه کاربری و تحلیل بازدید سایت استفاده می‌کنیم. شما می‌توانید کوکی‌ها را در مرورگر خود مدیریت کنید.
            </p>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۷. تغییرات در سیاست حریم خصوصی
            </h2>
            <p class="text-gray-600 mb-4">
              ممکن است سیاست حریم خصوصی را periodically به‌روز کنیم. تغییرات مهم از طریق ایمیل یا اطلاعیه در پلتفرم به شما اطلاع داده خواهد شد.
            </p>

            <h2 class="text-xl font-semibold mb-4 mt-8">
              ۸. تماس با ما
            </h2>
            <p class="text-gray-600 mb-4">
              برای هرگونه سؤال در مورد سیاست حریم خصوصی، می‌توانید با ما تماس بگیرید:
            </p>
            <p class="text-gray-600 mb-4">
              ایمیل: privacy@hampazhooh.ir<br />
              آدرس: تهران، خیابان آزادی، پژوهشکده روانشناسی
            </p>

            <p class="text-gray-500 text-sm mt-12">
              آخرین به‌روزرسانی: {{ new Date().toLocaleDateString('fa-IR') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>