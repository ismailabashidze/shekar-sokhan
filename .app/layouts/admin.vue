<template>
  <div class="admin-layout flex min-h-screen flex-col">
    <!-- Admin Header -->
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <h1 class="text-xl font-bold text-gray-900">
                پنل مدیریت
              </h1>
            </div>
            <nav class="ml-6 flex space-x-8 space-x-reverse">
              <NuxtLink
                to="/admin"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                پیشخوان
              </NuxtLink>
              <NuxtLink
                to="/admin/profiles"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                مدیریت پروفایل‌ها
              </NuxtLink>
              <NuxtLink
                to="/admin/counselors"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                مشاوران
              </NuxtLink>
              <NuxtLink
                to="/admin/verification"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                تأیید مشاوران
              </NuxtLink>
              <NuxtLink
                to="/admin/files"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                فایل‌ها
              </NuxtLink>
              <NuxtLink
                to="/admin/notifications"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                exact-active-class="border-blue-500 text-gray-900"
                active-class="border-blue-500 text-gray-900"
              >
                اعلان‌ها
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center">
            <button
              class="ml-4 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              @click="logout"
            >
              خروج
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="grow">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white">
      <div class="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          پنل مدیریت سامانه هم‌مسیر
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { logout } = useUser()
</script>

<style scoped>
.admin-layout {
  direction: rtl;
}
</style>
