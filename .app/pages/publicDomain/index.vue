<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">
          دامنه عمومی
        </h1>
        <p class="mb-8 text-lg text-gray-600">
          این صفحه در دامنه عمومی قرار دارد و برای همه کاربران قابل دسترسی است
        </p>

        <div class="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <div class="space-y-6">
            <div class="flex items-center justify-center">
              <Icon name="ph:lock-open" class="size-16 text-green-500" />
            </div>

            <div>
              <h2 class="mb-2 text-2xl font-semibold text-gray-900">
                دسترسی عمومی
              </h2>
              <p class="text-gray-600">
                این صفحه نیازی به احراز هویت ندارد و همه بازدیدکنندگان می‌توانند به آن دسترسی داشته باشند.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-lg bg-blue-50 p-4">
                <Icon name="ph:users" class="mb-2 size-8 text-blue-600" />
                <h3 class="font-semibold text-gray-900">
                  بازدیدکنندگان
                </h3>
                <p class="text-sm text-gray-600">
                  دسترسی بدون نیاز به ثبت‌نام
                </p>
              </div>

              <div class="rounded-lg bg-green-50 p-4">
                <Icon name="ph:globe" class="mb-2 size-8 text-green-600" />
                <h3 class="font-semibold text-gray-900">
                  محتوای عمومی
                </h3>
                <p class="text-sm text-gray-600">
                  اطلاعات قابل مشاهده برای همه
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <div class="flex flex-col justify-center gap-4 sm:flex-row">
                <NuxtLink
                  to="/auth/login"
                  class="btn btn-primary"
                >
                  ورود به سیستم
                </NuxtLink>
                <NuxtLink
                  to="/dashboard"
                  class="btn btn-secondary"
                >
                  رفتن به داشبورد
                </NuxtLink>
                <NuxtLink
                  to="/publicDomain/zone-restriction?zone=test&reason=access"
                  class="btn btn-outline"
                >
                  تست صفحه محدودیت
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Public pages don't require authentication
definePageMeta({
  layout: false, // Use default layout or create a public layout
})
</script>
