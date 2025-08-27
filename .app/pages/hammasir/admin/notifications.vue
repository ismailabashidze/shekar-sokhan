<template>
  <div class="admin-notifications-layout">
    <!-- Navigation Tabs -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 space-x-reverse" aria-label="Tabs">
        <NuxtLink
          to="/hammasir/admin/notifications"
          :class="[
            $route.path === '/hammasir/admin/notifications' || $route.path === '/hammasir/admin/notifications/index'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
          ]"
        >
          لیست اعلان‌ها
        </NuxtLink>
        <NuxtLink
          to="/hammasir/admin/notifications/settings"
          :class="[
            $route.path === '/hammasir/admin/notifications/settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
          ]"
        >
          تنظیمات
        </NuxtLink>
        <NuxtLink
          to="/hammasir/admin/notifications/stats"
          :class="[
            $route.path === '/hammasir/admin/notifications/stats'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
          ]"
        >
          آمار
        </NuxtLink>
      </nav>
    </div>

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>

<style scoped>
.admin-notifications-layout {
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 4rem);
}

@media (max-width: 640px) {
  .admin-notifications-layout {
    padding: 1rem;
  }
}
</style>
