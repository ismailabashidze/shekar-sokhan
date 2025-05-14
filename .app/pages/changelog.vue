<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen px-4 pb-10 pt-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="dark:bg-muted-800 rounded-lg bg-white p-6 shadow">
        <h1 class="text-muted-900 mb-6 text-2xl font-bold dark:text-white">
          تاریخچه تغییرات
        </h1>

        <div class="space-y-8">
          <!-- Version 1.8.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.8.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              14 می 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>ارتقای تجربه کاربری جدول کاربران: بومی‌سازی فارسی، تاریخ جلالی و نمایش زمان نسبی</li>
              <li>افزودن حالت اسکلتی (skeleton) هنگام بارگذاری لیست کاربران</li>
              <li>افزودن منوی کشویی با آیکون و ترجمه فارسی برای عملیات کاربران</li>
              <li>نمایش نشان طلایی برای کاربران جدید</li>
              <li>بهبود صفحه‌بندی و واکنش‌گرایی جدول کاربران</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>اصلاح منطق نمایش نشان کاربران جدید</li>
              <li>اصلاح نمایش آیکون‌ها در منوی کشویی (استفاده از slot #start)</li>
              <li>اصلاح منبع ایمیل و کنترل مقدار null</li>
            </ul>
          </div>

          <!-- Version 1.7.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.7.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              2 می 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بروزرسانی نسخه به 1.7.0 در package.json و VersionDisplay.vue</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>تغییر الگوی ارجاع به شناسه کاربر از <code>user.value.record.id</code> به <code>user.value.id</code> در چندین کامپوننت</li>
              <li>افزودن بررسی مقدار null برای نقش کاربر در کامپوننت DemoAccountMenu</li>
              <li>اصلاح ارجاع به کاربر در composable تخفیف (discountCoupon)</li>
              <li>بهبود فرمت‌بندی کد و حذف خطوط خالی غیرضروری</li>
              <li>بروزرسانی ورودی‌های changelog در CHANGELOG.md و changelog.vue</li>
            </ul>
          </div>

          <!-- Version 1.6.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.6.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              23 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>طبقه‌بندی ایموجی‌ها بر اساس احساسات با رابط تب و اسکرول افقی</li>
              <li>افزودن دسته‌های جدید (ترس، حیوانات، غذا، ورزش) و گسترش مجموعه ایموجی‌ها</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              بهبود‌ها
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود کنتراست تب‌ها در حالت تاریک</li>
              <li>مخفی‌سازی نوار اسکرول و انیمیشن پیمایش نرم برای ناوبری تب‌ها</li>
            </ul>
          </div>

          <!-- Version 1.5.1 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.5.1
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              10 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              بهبود‌ها
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود رابط کاربری در صفحات مختلف</li>
              <li>بهینه‌سازی نمایش جلسات مشاوره</li>
              <li>بهبود نمایش لیست اعمال نیک</li>
            </ul>
          </div>

          <!-- Version 1.4.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.4.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              9 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              بهبود‌ها
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>
                بهبود فرآیند استقرار:
                <ul class="mr-6 mt-1 list-disc space-y-1">
                  <li>بهبود مدیریت فرآیند‌های PM2</li>
                  <li>پیاده‌سازی استقرار تمیز با حذف دایرکتوری .output</li>
                  <li>افزودن محافظت‌های لازم برای توقف و راه‌اندازی مجدد فرآیند</li>
                  <li>بهبود مدیریت خطا در اسکریپت استقرار</li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Version 1.3.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.3.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              5 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              به‌روزرسانی‌های سیستم
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 list-disc space-y-2 pl-6">
              <li>
                <span class="font-medium">تحلیل جلسات:</span> بهبود سیستم ارزیابی درمانگر
                <ul class="mt-1 list-inside list-disc space-y-1 pl-4">
                  <li>حذف امتیاز ارزیابی مستقیم و جایگزینی با سیستم محاسبه خودکار</li>
                  <li>به‌روزرسانی لیست امتیازات منفی با امتیازات و دلایل دقیق</li>
                  <li>اضافه کردن رفتارهای مثبت و پیشنهادات بهبود ساختاریافته</li>
                  <li>پیاده‌سازی محاسبه خودکار امتیاز نهایی</li>
                  <li>بهبود رابط کاربری با بخش‌های رنگ‌بندی شده برای بازخورد</li>
                </ul>
              </li>
              <li>
                <span class="font-medium">ارزیابی ریسک:</span> بهبود تحلیل عوامل خطر
                <ul class="mt-1 list-inside list-disc space-y-1 pl-4">
                  <li>به‌روزرسانی ساختار برای تاکید بر شدت و نگرانی‌های فوری</li>
                  <li>بهبود توضیحات عوامل خطر برای وضوح بیشتر</li>
                  <li>تنظیم الزامات حداقلی برای گزارش عوامل خطر</li>
                  <li>بهبود شاخص‌های نیاز به مداخله تخصصی</li>
                </ul>
              </li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 list-disc space-y-2 pl-6">
              <li>
                <span class="font-medium">مدیریت جلسات:</span> رفع مشکلات حیاتی در مدیریت جلسات
                <ul class="mt-1 list-inside list-disc space-y-1 pl-4">
                  <li>رفع خطای 400 در هنگام بستن جلسات</li>
                  <li>بهبود مدیریت بستن خودکار جلسات</li>
                  <li>بهبود هدایت به صفحه تحلیل پس از پایان جلسه</li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- Version 1.2.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.2.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              3 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 mb-4 list-inside list-disc space-y-1">
              <li>اضافه شدن ردیابی تکمیل اعمال نیک شخصی</li>
              <li>ایجاد صفحه «اعمال نیک من» برای نمایش اعمال تکمیل شده</li>
              <li>اضافه شدن نمایش آمار بازدید، تکمیل‌ها و تکمیل‌های شخصی</li>
              <li>بهبود مدیریت کدهای تخفیف با ردیابی کاربر</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              بهبودها
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 mb-4 list-inside list-disc space-y-1">
              <li>بهبود نمایش آمار با آیکون‌های متمایز</li>
              <li>بهبود چیدمان با تراز مرکزی و فاصله‌گذاری مناسب</li>
              <li>رنگ‌بندی آیکون‌ها برای تمایز بهتر</li>
            </ul>
          </div>

          <!-- Version 1.1.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.1.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              1 آوریل 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 mb-4 list-inside list-disc space-y-1">
              <li>اضافه شدن آمار و ارقام در داشبورد</li>
              <li>اضافه شدن صفحه تاریخچه تغییرات</li>
              <li>اضافه شدن بخش اعمال نیک</li>
              <li>بهبود رابط کاربری در بخش پیام‌رسانی</li>
              <li>اضافه شدن قابلیت ویرایش اعمال نیک برای مدیران</li>
              <li>بهبود نمایش اطلاعات جمعیت‌شناختی در بخش تحلیل</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              بهبودها
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 mb-4 list-inside list-disc space-y-1">
              <li>بهینه‌سازی نمایش در نسخه موبایل</li>
              <li>بهبود عملکرد در بخش پیام‌رسانی</li>
              <li>اصلاح باگ‌های جزئی در رابط کاربری</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 list-inside list-disc space-y-1">
              <li>رفع خطای 400 هنگام پایان جلسه</li>
              <li>رفع مشکل آمار نادرست کاربران منحصر به فرد</li>
              <li>رفع مشکل عدم نمایش صحیح صفحه تحلیل پس از پایان جلسه</li>
            </ul>
          </div>

          <!-- Version 1.0.0 -->
          <div>
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.0.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              15 مارس 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌ها
            </h3>
            <ul class="text-muted-600 dark:text-muted-300 list-inside list-disc space-y-1">
              <li>انتشار اولیه نرم‌افزار</li>
              <li>امکان گفتگو با روانشناس هوش مصنوعی</li>
              <li>سیستم مدیریت جلسات</li>
              <li>داشبورد کاربری</li>
              <li>سیستم گزارش خطا</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'sidebar',
  title: 'تاریخچه تغییرات',
  preview: {
    title: 'تاریخچه تغییرات',
    description: 'تاریخچه تغییرات و بروزرسانیهای نرم‌افزار',
    categories: ['layouts'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 84,
  },
})

useHead({
  title: 'تاریخچه تغییرات',
  meta: [
    { name: 'description', content: 'تاریخچه تغییرات و بروزرسانی‌های نرم‌افزار' },
  ],
  htmlAttrs: { dir: 'rtl' },
})
</script>
