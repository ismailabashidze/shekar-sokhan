<script setup lang="ts">
const {
  highPriorityNotifications,
  unreadCount,
  isLoading,
  isUpdating,
  markAsRead,
  refreshNotifications,
  initialize,
  getRelativeTime,
  getTypeIcon,
  getTypeColor,
} = useNotifications()

const { close } = usePanels()

// Initialize notifications when component mounts
onMounted(async () => {
  await initialize()
})

const handleNotificationClick = async (notification: any) => {
  await markAsRead(notification.id)
  close('notifications')

  if (notification.actionUrl) {
    await navigateTo(notification.actionUrl)
  }
}
</script>

<template>
  <div class="flex h-full w-80 flex-col bg-white dark:bg-muted-900 shadow-xl">
    <!-- Header -->
    <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b p-4">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h2 class="text-muted-900 font-semibold dark:text-white">
            اعلان‌ها
          </h2>
          <!-- Update indicator -->
          <div 
            v-if="isUpdating && !isLoading" 
            class="bg-blue-500 size-1.5 rounded-full animate-pulse"
          />
        </div>
        <div class="mt-1 flex items-center gap-3">
          <p v-if="unreadCount > 0" class="text-muted-500 dark:text-muted-400 text-sm">
            {{ unreadCount }} خوانده نشده
          </p>
          <!-- Refresh button -->
          <button
            :disabled="isLoading || isUpdating"
            class="text-muted-400 hover:text-primary-500 transition-colors duration-200"
            :class="[
              isUpdating || isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-110'
            ]"
            @click="refreshNotifications"
          >
            <Icon 
              name="ph:arrow-clockwise" 
              class="size-3 transition-transform duration-300"
              :class="{ 'animate-spin': isUpdating || isLoading }"
            />
          </button>
        </div>
      </div>

      <NuxtLink
        to="/notifications"
        class="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200 hover:scale-105"
        @click="close('notifications')"
      >
        مشاهده همه
      </NuxtLink>
    </div>

    <!-- Notifications List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="animate-pulse"
        >
          <div class="flex items-start gap-3">
            <div class="bg-muted-200 dark:bg-muted-700 size-8 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="bg-muted-200 dark:bg-muted-700 h-3 w-3/4 rounded" />
              <div class="bg-muted-200 dark:bg-muted-700 h-2 w-1/2 rounded" />
              <div class="bg-muted-200 dark:bg-muted-700 h-2 w-1/4 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- No notifications -->
      <div
        v-else-if="highPriorityNotifications.length === 0"
        class="flex flex-col items-center justify-center p-8 text-center"
      >
        <div class="bg-muted-100 dark:bg-muted-800 mb-3 flex size-12 items-center justify-center rounded-full">
          <Icon name="ph:bell-slash" class="text-muted-400 size-6" />
        </div>
        <p class="text-muted-500 dark:text-muted-400 text-sm">
          اعلان جدیدی وجود ندارد
        </p>
      </div>

      <!-- Notifications -->
      <TransitionGroup
        v-else
        name="sidebar-notification"
        tag="div"
        class="divide-muted-200 dark:divide-muted-700 divide-y"
        appear
      >
        <button
          v-for="notification in highPriorityNotifications.slice(0, 10)"
          :key="notification.id"
          type="button"
          class="group w-full cursor-pointer p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transform-gpu"
          :class="[
            notification.isRead 
              ? 'hover:bg-muted-50 dark:hover:bg-muted-800/50 opacity-60 hover:opacity-90' 
              : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:bg-primary-50 dark:focus:bg-primary-900/20 border-l-2 border-l-primary-500',
            isUpdating ? 'animate-pulse-subtle' : ''
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-3">
            <!-- Notification icon -->
            <div class="shrink-0">
              <div
                class="flex size-8 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                :class="[
                  notification.type === 'success' ? 'bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30' :
                  notification.type === 'warning' ? 'bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30' :
                  notification.type === 'error' ? 'bg-gradient-to-br from-danger-100 to-danger-200 dark:from-danger-900/20 dark:to-danger-800/30' :
                  notification.type === 'system' ? 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/30' :
                  'bg-gradient-to-br from-info-100 to-info-200 dark:from-info-900/20 dark:to-info-800/30'
                ]"
              >
                <Icon
                  :name="getTypeIcon(notification.type)"
                  class="size-4 transition-transform duration-200 group-hover:scale-110"
                  :class="getTypeColor(notification.type)"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <h4 
                class="text-sm"
                :class="[
                  notification.isRead 
                    ? 'text-muted-600 dark:text-muted-300 font-medium' 
                    : 'text-muted-900 dark:text-white font-bold'
                ]"
              >
                {{ notification.title }}
              </h4>
              <p 
                class="mt-1 line-clamp-2 text-xs"
                :class="[
                  notification.isRead 
                    ? 'text-muted-500 dark:text-muted-400' 
                    : 'text-muted-700 dark:text-muted-200 font-medium'
                ]"
              >
                {{ notification.message }}
              </p>
              <span 
                class="mt-1 text-xs"
                :class="[
                  notification.isRead 
                    ? 'text-muted-400 dark:text-muted-500' 
                    : 'text-muted-500 dark:text-muted-400 font-medium'
                ]"
              >
                {{ getRelativeTime(notification.createdAt) }}
              </span>
            </div>

            <!-- Unread indicator -->
            <div 
              v-if="!notification.isRead"
              class="bg-gradient-to-r from-primary-500 to-primary-600 size-2 shrink-0 rounded-full animate-pulse shadow-sm ring-2 ring-primary-200 dark:ring-primary-800" 
            />
          </div>
        </button>
      </TransitionGroup>
    </div>

    <!-- Footer -->
    <div class="border-muted-200 dark:border-muted-700 border-t p-4">
      <NuxtLink
        to="/notifications"
        class="hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/20"
        @click="close('notifications')"
      >
        <Icon name="ph:arrow-left" class="mr-2 size-4" />
        مشاهده همه اعلان‌ها
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Subtle pulse for updates */
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.002);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Sidebar notification transitions */
.sidebar-notification-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sidebar-notification-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.sidebar-notification-enter-from {
  opacity: 0;
  transform: translateX(-10px) scale(0.98);
}

.sidebar-notification-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.98);
}

.sidebar-notification-move {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Optimized animations */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
