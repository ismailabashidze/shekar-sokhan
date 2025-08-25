<script setup lang="ts">
import AdminNavigation from '../components/AdminNavigation.vue'
</script>

<template>
  <TairoSidebarLayout>
    <template #subsidebar>
      <div class="flex h-full flex-col">
        <div class="border-muted-200 dark:border-muted-700 border-b p-4">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            پنل مدیریت
          </BaseHeading>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <AdminNavigation />
        </div>
      </div>
    </template>
    <slot />
  </TairoSidebarLayout>
</template>