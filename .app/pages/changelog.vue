<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen px-4 pb-10 pt-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="dark:bg-muted-800 rounded-lg bg-white p-6 shadow">
        <h1 class="text-muted-900 mb-6 text-2xl font-bold dark:text-white">
          تاریخچه تغییرات
        </h1>

        <div class="space-y-8">
          <!-- Version 2.5.1 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.5.1
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              30 ژانویه 2025
            </p>

            <h3 class="text-danger-500 mb-2 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>رفع اشکالات جزئی و بهبود عملکرد</li>
              <li>بهبود پایداری و تجربه کاربری</li>
              <li>به‌روزرسانی وابستگی‌ها و پچ‌های امنیتی</li>
            </ul>

            <h3 class="text-primary-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های فنی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهینه‌سازی و پاکسازی کد</li>
              <li>بهبود مدیریت خطاها</li>
              <li>بهبود تجربه توسعه</li>
            </ul>
          </div>

          <!-- Version 2.5.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.5.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              2 ژولای 2025
            </p>

            <h3 class="text-success-500 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>پیاده‌سازی قابلیت Progressive Web App (PWA) برای پشتیبانی آفلاین و نصب اپلیکیشن</li>
              <li>افزودن PWA install prompt با تجربه نصب شبیه اپلیکیشن‌های بومی</li>
              <li>ایجاد manifest و service worker دستی PWA برای عملکرد قابل اعتماد</li>
              <li>افزودن کامپوننت دکمه نصب در کنار دکمه تور</li>
            </ul>

            <h3 class="text-info-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های رابط کاربری
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود پاپ‌آپ نصب PWA با فاصله‌گذاری بهتر، آیکون‌های بزرگ‌تر و تایپوگرافی بهتر</li>
              <li>افزودن آیکون دانلود به دکمه نصب برای بهتر شناخته شدن توسط کاربر</li>
              <li>بهبود پشتیبانی چیدمان RTL برای install prompt با هم‌ترازی مناسب متن فارسی</li>
              <li>بهبود سازگاری حالت تاریک برای کامپوننت‌های PWA</li>
            </ul>

            <h3 class="text-primary-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های فنی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>ایجاد service worker سفارشی برای استراتژی‌های کش و قابلیت آفلاین</li>
              <li>پیاده‌سازی manifest PWA با متادیتای فارسی مناسب و جهت RTL</li>
              <li>افزودن پلاگین Nuxt برای ثبت و مدیریت service worker</li>
              <li>حذف قابلیت شروع خودکار تور برای جلوگیری از تداخل با مودال‌ها</li>
              <li>افزودن meta tag ها برای قابلیت‌های web app موبایل و رنگ‌های تم</li>
            </ul>

            <h3 class="text-danger-500 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>رفع تداخل شروع خودکار تور با مودال نسخه آزمایشی</li>
              <li>حذف لاگ‌های debug از کامپوننت‌های PWA برای کنسول تمیزتر</li>
              <li>غیرفعال کردن راه‌اندازی خودکار تور در بارگذاری صفحه</li>
            </ul>

            <h3 class="text-warning-500 mb-2 mt-4 text-lg font-medium">
              بومی‌سازی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>پشتیبانی کامل زبان فارسی برای رابط نصب PWA</li>
              <li>افزودن نام و توضیحات فارسی اپلیکیشن در manifest PWA</li>
              <li>بهینه‌سازی RTL برای install prompt با جهت متن مناسب</li>
            </ul>
          </div>

          <!-- Version 2.4.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.4.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              27 ژانویه 2025
            </p>

            <h3 class="text-success-500 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>پیاده‌سازی سیستم جامع تور محصول با استفاده از Driver.js</li>
              <li>افزودن تورهای تعاملی راهنما برای شروع کار کاربران و کشف ویژگی‌ها</li>
              <li>ایجاد کامپوننت دکمه تور با بومی‌سازی فارسی</li>
              <li>یکپارچه‌سازی قابلیت تور در سراسر برنامه با پشتیبانی RTL مناسب</li>
            </ul>

            <h3 class="text-info-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های رابط کاربری
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>افزودن استایل زیبا برای پاپ‌آپ تور با افکت‌های شیشه‌ای</li>
              <li>پیاده‌سازی رابط تور بهینه‌شده برای RTL با فونت‌های فارسی</li>
              <li>افزودن افکت‌های گرادیانت انیمیشنی و انتقال‌های روان برای عناصر تور</li>
              <li>ایجاد طراحی واکنش‌گرا برای تور که در موبایل و دسکتاپ کار می‌کند</li>
              <li>بهبود تجربه کاربری با نشانگرهای پیشرفت و کنترل‌های ناوبری</li>
            </ul>

            <h3 class="text-primary-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های فنی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>افزودن کتابخانه Driver.js برای قابلیت تور</li>
              <li>ایجاد composable <code>useTour</code> برای مدیریت وضعیت تور</li>
              <li>پیاده‌سازی پلاگین client تور برای راه‌اندازی صحیح</li>
              <li>افزودن استایل‌های جامع CSS برای کامپوننت‌های تور با پشتیبانی تم تاریک/روشن</li>
              <li>ایجاد صفحه نمایشی تور برای تست و توسعه</li>
            </ul>

            <h3 class="text-danger-500 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>اصلاح یکپارچه‌سازی سیستم پرداخت و مدیریت callback</li>
              <li>بهبود مدیریت جلسات و قابلیت داشبورد</li>
              <li>بهبود جریان شروع کار با مدیریت بهتر خطاها</li>
            </ul>

            <h3 class="text-warning-500 mb-2 mt-4 text-lg font-medium">
              بومی‌سازی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>پشتیبانی کامل زبان فارسی برای رابط تور</li>
              <li>بهینه‌سازی چیدمان RTL برای عناصر تور</li>
              <li>تایپوگرافی و رندر فونت فارسی مناسب در تورها</li>
            </ul>
          </div>

          <!-- Version 2.3.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.3.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              26 ژانویه 2025
            </p>

            <h3 class="text-success-500 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>پیاده‌سازی سیستم جامع تحلیل احساسات برای جلسات درمان</li>
              <li>افزودن تحلیل احساسات بلادرنگ برای پیام‌های کاربران در جلسات درمان</li>
              <li>ایجاد مودال تفصیلی تحلیل پیام با نمایش چرخ احساسات</li>
              <li>یکپارچه‌سازی ذخیره‌سازی داده‌های تحلیل در پایگاه داده</li>
              <li>گسترش صفحه تاریخچه با قابلیت مشاهده تحلیل احساسات</li>
            </ul>

            <h3 class="text-info-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های رابط کاربری
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>افزودن دکمه‌های ذره‌بین برای مشاهده تحلیل تفصیلی پیام‌ها</li>
              <li>پیاده‌سازی کامپوننت تعاملی چرخ احساسات</li>
              <li>افزودن نشان‌های رنگی احساسات (قرمز=زیاد، نارنجی=متوسط، آبی=کم)</li>
              <li>بهبود تجربه کاربری با نمایش فوری پیام‌ها قبل از تکمیل تحلیل</li>
              <li>ایجاد مودال جامع برای مشاهده متادیتا و تحلیل احساسات پیام</li>
            </ul>

            <h3 class="text-primary-500 mb-2 mt-4 text-lg font-medium">
              بهبود‌های فنی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بازطراحی schema JSON تحلیل احساسات OpenRouter</li>
              <li>ایجاد ابزارهای mapping احساسات برای تبدیل تحلیل فارسی به فرمت چرخ</li>
              <li>افزودن composable جدید <code>useMessageAnalysis</code> برای عملیات پایگاه داده</li>
              <li>پیاده‌سازی جریان صحیح داده‌های احساسات از API به کامپوننت‌های UI</li>
              <li>پشتیبانی از 9 احساس اصلی با نام‌های فارسی و سطوح شدت</li>
            </ul>

            <h3 class="text-danger-500 mb-2 mt-4 text-lg font-medium">
              رفع اشکالات
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>اصلاح پیام‌های validation صفحه ورود برای نمایش متن فارسی به جای "Required"</li>
              <li>تصحیح schema اعتبارسنجی Zod برای فیلدهای ایمیل و رمز عبور</li>
              <li>رفع خطاهای linter در ساختار HTML صفحه ورود</li>
            </ul>

            <h3 class="text-warning-500 mb-2 mt-4 text-lg font-medium">
              بومی‌سازی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود پشتیبانی زبان فارسی در رابط تحلیل احساسات</li>
              <li>افزودن mapping نام‌های فارسی احساسات (شادی، اعتماد، ترس، تعجب، غم، انزجار، خشم، انتظار، نامشخص)</li>
              <li>بهبود پیام‌های اعتبارسنجی با ترجمه‌های فارسی مناسب</li>
            </ul>
          </div>

          <!-- Version 2.2.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.2.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              26 ژانویه 2025
            </p>

            <h3 class="text-danger-500 mb-2 text-lg font-medium">
              تغییرات اساسی
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>حذف کامل <code>userRecord</code> از localStorage</li>
              <li>حذف سیستم همگام‌سازی بین localStorage و پایگاه داده</li>
            </ul>

            <h3 class="text-success-500 mb-2 mt-4 text-lg font-medium">
              بهبود عملکرد
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>ساده‌سازی جریان داده با استفاده مستقیم از API</li>
              <li>حذف عملیات همگام‌سازی غیرضروری که باعث کاهش عملکرد می‌شد</li>
              <li>حذف ناسازگاری احتمالی داده بین localStorage و پایگاه داده</li>
            </ul>

            <h3 class="text-primary-500 mb-2 mt-4 text-lg font-medium">
              تمیزسازی کد
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>حذف توابع <code>syncUserRecord</code>, <code>loadUserRecord</code>, <code>updateUserRecord</code></li>
              <li>حذف فایل <code>composables/sync.ts</code></li>
              <li>ساده‌سازی مدیریت اطلاعات کاربر در کامپوننت پیام‌رسانی</li>
              <li>کاهش پیچیدگی کد و بهبود قابلیت نگهداری</li>
            </ul>
          </div>

          <!-- Version 2.1.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.1.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              23 خرداد 1404
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>جا به جایی فرم پرداخت با کار نیک و افزودن دکمه ی همدلی</li>
            </ul>
          </div>
          <!-- Version 2.0.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 2.0.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              31 خرداد 1404
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>به‌روزرسانی اصلی به نسخه 2.0.0</li>
              <li>افزودن قابلیت جامع مدیریت پرداخت‌ها با کنترل‌های ادمین</li>
              <li>پیاده‌سازی نمایش پرداخت‌های کاربران با قابلیت فیلتر و صفحه‌بندی</li>
              <li>افزودن دکمه‌های عملیاتی برای مدیریت پرداخت‌ها</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              بهبود‌های رابط کاربری
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود جدول پرداخت‌ها با نشانگر وضعیت و دکمه‌های عملیاتی</li>
              <li>بهبود رابط مدیریت پرداخت‌ها برای مدیران سیستم</li>
            </ul>
          </div>

          <!-- Version 1.9.0 -->
          <div class="border-muted-200 dark:border-muted-700 border-b pb-6">
            <h2 class="text-primary-500 mb-2 text-xl font-semibold">
              نسخه 1.9.0
            </h2>
            <p class="text-muted-400 mb-4 text-sm">
              17 می 2025
            </p>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
              ویژگی‌های جدید
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>افزودن قابلیت شروع مکالمه توسط هوش مصنوعی با خلاصه‌ای از جلسات قبلی کاربر</li>
              <li>بهبود نمایشگر تایپ برای نشان دادن پیشرفت هوش مصنوعی در هنگام تولید پاسخ</li>
              <li>غیرفعال کردن ورودی پیام در هنگام پاسخگویی هوش مصنوعی</li>
            </ul>

            <h3 class="text-muted-800 dark:text-muted-100 mb-2 mt-4 text-lg font-medium">
              بهبود‌ها
            </h3>
            <ul class="text-muted-500 dark:text-muted-400 space-y-2">
              <li>بهبود تجربه کاربری برای نشان دادن وضعیت پردازش پیام‌ها</li>
              <li>بهینه‌سازی عملکرد در صفحه گزارش با حالت‌های بارگذاری و خالی</li>
            </ul>
          </div>
          
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
