<template>
  <div class="container mx-auto p-6">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-center text-2xl font-bold">
        تست سیستم اعلان‌های پیشرفته
      </h1>

      <!-- Service Worker Status -->
      <div class="mb-6 rounded-lg bg-gray-50 p-4">
        <h2 class="mb-2 text-lg font-semibold">
          وضعیت Service Worker
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center">
            <span class="ml-2">پشتیبانی:</span>
            <span :class="isSupported ? 'text-green-600' : 'text-red-600'">
              {{ isSupported ? '✓ پشتیبانی می‌شود' : '✗ پشتیبانی نمی‌شود' }}
            </span>
          </div>
          <div class="flex items-center">
            <span class="ml-2">ثبت شده:</span>
            <span :class="isRegistered ? 'text-green-600' : 'text-red-600'">
              {{ isRegistered ? '✓ ثبت شده' : '✗ ثبت نشده' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Notification Manager Component -->
      <AdminNotificationManager />

      <!-- Instructions -->
      <div class="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 class="mb-2 text-lg font-semibold">
          راهنمای استفاده
        </h3>
        <ul class="list-inside list-disc space-y-1 text-sm">
          <li>برای تست اعلان‌های پس‌زمینه، برگه مرورگر را ببندید یا به برگه دیگری بروید</li>
          <li>اعلان‌های گروهی به صورت خودکار جمع‌آوری می‌شوند</li>
          <li>اعلان‌های فوری نیاز به تعامل کاربر دارند</li>
          <li>می‌توانید اعلان‌ها را به تعویق بیندازید یا رد کنید</li>
          <li>آمار اعلان‌ها در IndexedDB ذخیره می‌شود</li>
        </ul>
      </div>

      <!-- Feature Highlights -->
      <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-lg bg-green-50 p-4">
          <h4 class="font-semibold text-green-800">
            قابلیت‌های جدید
          </h4>
          <ul class="mt-2 space-y-1 text-sm text-green-700">
            <li>• اعلان‌های اولویت‌دار</li>
            <li>• گروه‌بندی خودکار</li>
            <li>• دکمه‌های عملیات</li>
            <li>• ردیابی تعاملات</li>
          </ul>
        </div>

        <div class="rounded-lg bg-blue-50 p-4">
          <h4 class="font-semibold text-blue-800">
            مدیریت پیشرفته
          </h4>
          <ul class="mt-2 space-y-1 text-sm text-blue-700">
            <li>• تعویق اعلان‌ها</li>
            <li>• پاکسازی خودکار</li>
            <li>• همگام‌سازی رویدادها</li>
            <li>• آمار تفصیلی</li>
          </ul>
        </div>

        <div class="rounded-lg bg-purple-50 p-4">
          <h4 class="font-semibold text-purple-800">
            تجربه کاربری
          </h4>
          <ul class="mt-2 space-y-1 text-sm text-purple-700">
            <li>• لینک‌های عمیق</li>
            <li>• فرمت‌بندی غنی</li>
            <li>• پشتیبانی RTL</li>
            <li>• آیکون‌های متنوع</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  title: 'تست اعلان‌های پیشرفته',
  layout: 'default',
});

// Use service worker composable
const { isSupported, isRegistered } = useServiceWorkerNotifications();

// Set page title
useHead({
  title: 'تست اعلان‌های پیشرفته - ذهنا',
});
</script>

<style scoped>
.container {
  direction: rtl;
  font-family: 'Vazir', sans-serif;
}
</style>
