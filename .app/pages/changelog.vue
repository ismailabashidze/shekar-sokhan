<template>
  <div class="min-h-screen bg-muted-100 dark:bg-muted-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-muted-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-muted-900 dark:text-white mb-6">تاریخچه تغییرات</h1>
        
        <div class="space-y-8">
          <!-- Version 1.1.0 -->
          <div class="border-b border-muted-200 dark:border-muted-700 pb-6">
            <h2 class="text-xl font-semibold text-primary-500 mb-2">نسخه 1.1.0</h2>
            <p class="text-sm text-muted-400 mb-4">1 آوریل 2025</p>
            
            <h3 class="text-lg font-medium text-muted-800 dark:text-muted-100 mb-2">ویژگی‌های جدید</h3>
            <ul class="list-disc list-inside text-muted-600 dark:text-muted-300 space-y-1 mb-4">
              <li>اضافه شدن آمار و ارقام در داشبورد</li>
              <li>اضافه شدن صفحه تاریخچه تغییرات</li>
              <li>نمایش نسخه برنامه در گوشه صفحه</li>
            </ul>
            
            <h3 class="text-lg font-medium text-muted-800 dark:text-muted-100 mb-2">بهبودها</h3>
            <ul class="list-disc list-inside text-muted-600 dark:text-muted-300 space-y-1 mb-4">
              <li>بهبود فرآیند پایان جلسه و ایجاد تحلیل</li>
              <li>بهبود مدیریت خطاها هنگام پایان جلسه</li>
              <li>بهبود فرآیند گزارش خطا</li>
            </ul>
            
            <h3 class="text-lg font-medium text-muted-800 dark:text-muted-100 mb-2">رفع اشکالات</h3>
            <ul class="list-disc list-inside text-muted-600 dark:text-muted-300 space-y-1">
              <li>رفع خطای 400 هنگام پایان جلسه</li>
              <li>رفع مشکل آمار نادرست کاربران منحصر به فرد</li>
              <li>رفع مشکل عدم نمایش صحیح صفحه تحلیل پس از پایان جلسه</li>
            </ul>
          </div>
          
          <!-- Version 1.0.0 -->
          <div>
            <h2 class="text-xl font-semibold text-primary-500 mb-2">نسخه 1.0.0</h2>
            <p class="text-sm text-muted-400 mb-4">15 مارس 2025</p>
            
            <h3 class="text-lg font-medium text-muted-800 dark:text-muted-100 mb-2">ویژگی‌ها</h3>
            <ul class="list-disc list-inside text-muted-600 dark:text-muted-300 space-y-1">
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
  layout: 'default',
})

useHead({
  title: 'تاریخچه تغییرات',
  meta: [
    { name: 'description', content: 'تاریخچه تغییرات و بروزرسانی‌های نرم‌افزار' }
  ]
})
</script>
