<script setup lang="ts">
interface Props {
  showLabel?: boolean
  variant?: 'button' | 'link' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  variant: 'button',
  size: 'md'
})

const { getNotificationStats } = useAdminNotifications()
const stats = computed(() => getNotificationStats.value)

// Check if user has admin role (you might want to adjust this logic)
const { $pb } = useNuxtApp()
const isAdmin = computed(() => {
  return $pb.authStore.model?.role === 'admin' || $pb.authStore.model?.role === 'super_admin'
})
</script>

<template>
  <div v-if="isAdmin">
    <!-- Button variant -->
    <BaseButton
      v-if="variant === 'button'"
      :to="/admin/notifications"
      :size="size"
      variant="outline"
      class="relative group hover:scale-105 transition-all duration-200"
    >
      <Icon name="lucide:shield-check" class="size-4" :class="{ 'ml-2': showLabel }" />
      <span v-if="showLabel">پنل ادمین</span>
      
      <!-- Unread notifications badge -->
      <div
        v-if="stats.unread > 0"
        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs size-5 flex items-center justify-center rounded-full font-medium animate-pulse"
      >
        {{ stats.unread > 99 ? '99+' : stats.unread }}
      </div>
    </BaseButton>

    <!-- Link variant -->
    <NuxtLink
      v-else-if="variant === 'link'"
      to="/admin/notifications"
      class="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-700 dark:text-muted-300 hover:bg-muted-100 dark:hover:bg-muted-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group relative"
    >
      <div class="bg-primary-100 dark:bg-primary-900/20 size-8 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-200">
        <Icon name="lucide:shield-check" class="text-primary-500 size-4" />
      </div>
      
      <div v-if="showLabel" class="flex-1">
        <p class="font-medium">مدیریت اعلان‌ها</p>
        <p class="text-xs text-muted-500 dark:text-muted-400">
          ارسال و مدیریت اعلان‌های سیستمی
        </p>
      </div>

      <!-- Stats badge -->
      <div v-if="showLabel && stats.unread > 0" class="flex flex-col items-end gap-1">
        <span class="bg-danger-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {{ stats.unread }}
        </span>
        <span class="text-xs text-muted-400">خوانده نشده</span>
      </div>
      
      <!-- Icon only badge -->
      <div
        v-else-if="!showLabel && stats.unread > 0"
        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs size-5 flex items-center justify-center rounded-full font-medium animate-pulse"
      >
        {{ stats.unread > 99 ? '99+' : stats.unread }}
      </div>
    </NuxtLink>

    <!-- Icon only variant -->
    <BaseButtonIcon
      v-else-if="variant === 'icon'"
      :to="/admin/notifications"
      :size="size"
      variant="ghost"
      class="relative group hover:scale-110 transition-all duration-200"
    >
      <Icon name="lucide:shield-check" class="size-5" />
      
      <!-- Unread notifications badge -->
      <div
        v-if="stats.unread > 0"
        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs size-4 flex items-center justify-center rounded-full font-medium animate-pulse"
      >
        {{ stats.unread > 9 ? '9+' : stats.unread }}
      </div>
    </BaseButtonIcon>
  </div>
</template> 