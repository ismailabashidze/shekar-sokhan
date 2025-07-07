<script setup lang="ts">
definePageMeta({
  title: 'اعلان‌ها',
  preview: {
    title: 'اعلان‌ها',
    description: 'مدیریت اعلان‌ها و پیام‌های سیستمی',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-notifications.png',
    srcDark: '/img/screens/layouts-subpages-notifications-dark.png',
    order: 80,
  },
  layout: 'sidebar',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'اعلان‌ها - ذهنا',
})

const {
  filteredNotifications,
  unreadCount,
  currentFilter,
  isLoading,
  isUpdating,
  lastUpdateTime,
  error,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  refreshNotifications,
  setFilter,
  initialize,
  getRelativeTime,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
} = useNotifications()

// State for smooth transitions
const showTransition = ref(true)

onMounted(async () => {
  // Initialize notifications from PocketBase
  await initialize()
  
  // Enable transitions after initialization
  nextTick(() => {
    showTransition.value = true
  })
})

const handleNotificationClick = async (notification: any) => {
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }

  if (notification.actionUrl) {
    await navigateTo(notification.actionUrl)
  }
}

const handleMarkAsRead = async (e: Event, notificationId: string) => {
  e.stopPropagation()
  await markAsRead(notificationId)
}

const handleMarkAsUnread = async (e: Event, notificationId: string) => {
  e.stopPropagation()
  await markAsUnread(notificationId)
}

const handleDelete = async (e: Event, notificationId: string) => {
  e.stopPropagation()
  await deleteNotification(notificationId)
}

const filterOptions = [
  { value: 'all', label: 'همه اعلان‌ها' },
  { value: 'unread', label: 'خوانده نشده' },
  { value: 'read', label: 'خوانده شده' },
]
</script>

<template>
  <div class="notifications-page min-h-screen bg-muted-50 dark:bg-muted-900">
    <div class="container-wrapper mx-auto w-full max-w-6xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 relative z-10">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-muted-900 text-3xl font-bold dark:text-white">
              اعلان‌ها
            </h1>
            <p class="text-muted-500 dark:text-muted-400 mt-2">
              مدیریت پیام‌ها و اعلان‌های سیستمی
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Update indicator -->
            <div 
              v-if="isUpdating && !isLoading" 
              class="flex items-center gap-2 animate-pulse"
            >
              <div class="bg-blue-500 size-2 rounded-full animate-pulse" />
              <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">
                در حال بروزرسانی...
              </span>
            </div>

            <!-- Last update time -->
            <div v-if="!isLoading && !isUpdating" class="flex items-center gap-2">
              <Icon name="ph:clock" class="text-muted-400 size-3" />
              <span class="text-muted-400 text-xs">
                آخرین بروزرسانی: {{ new Date(lastUpdateTime).toLocaleTimeString('fa-IR') }}
              </span>
            </div>

            <!-- Unread count badge -->
            <div v-if="unreadCount > 0" class="flex items-center gap-2">
              <span class="text-muted-500 dark:text-muted-400 text-sm">
                خوانده نشده:
              </span>
              <div 
                class="bg-primary-500 flex size-6 items-center justify-center rounded-full text-xs font-medium text-white transition-all duration-300"
                :class="{ 'animate-bounce': isUpdating }"
              >
                {{ unreadCount }}
              </div>
            </div>

            <!-- Refresh button -->
            <BaseButtonIcon
              :loading="isLoading"
              :disabled="isUpdating"
              size="sm"
              variant="outline"
              class="transition-all duration-200"
              :class="[
                isUpdating 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-md'
              ]"
              @click="refreshNotifications"
            >
              <Icon 
                name="ph:arrow-clockwise" 
                class="size-4 transition-transform duration-300"
                :class="{ 'animate-spin': isUpdating }"
              />
            </BaseButtonIcon>

            <!-- Mark all as read -->
            <BaseButton
              v-if="unreadCount > 0"
              size="sm"
              variant="solid"
              class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              @click="markAllAsRead"
            >
              <Icon name="ph:check-circle" class="ml-2 size-4" />
              علامت‌گذاری همه به عنوان خوانده شده
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 relative z-10">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-muted-600 dark:text-muted-300 text-sm font-medium">
            فیلتر:
          </span>
          <div class="flex gap-2">
            <BaseButton
              v-for="option in filterOptions"
              :key="option.value"
              size="sm"
              :variant="currentFilter === option.value ? 'solid' : 'outline'"
              :class="[
                'transition-all duration-200 hover:scale-105',
                currentFilter === option.value 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800' 
                  : 'hover:shadow-md'
              ]"
              @click="setFilter(option.value as any)"
            >
              {{ option.label }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <!-- Empty State -->
        <div
          v-if="filteredNotifications.length === 0 && !isLoading"
          class="flex flex-col items-center justify-center py-16"
        >
          <div class="bg-muted-100 dark:bg-muted-800 mb-4 flex size-16 items-center justify-center rounded-full">
            <Icon name="ph:bell-slash" class="text-muted-400 size-8" />
          </div>
          <h3 class="text-muted-900 mb-2 text-lg font-semibold dark:text-white">
            هیچ اعلانی وجود ندارد
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-center">
            {{ currentFilter === 'unread' ? 'همه اعلان‌های شما خوانده شده‌اند' :
              currentFilter === 'read' ? 'هیچ اعلان خوانده شده‌ای وجود ندارد' :
              'هیچ اعلانی دریافت نکرده‌اید' }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <BaseCard
            v-for="i in 5"
            :key="i"
            class="overflow-hidden bg-white dark:bg-muted-800 shadow-sm border border-muted-200 dark:border-muted-700"
          >
            <div class="animate-pulse p-4 sm:p-6">
              <div class="flex items-start gap-4">
                <!-- Priority indicator skeleton -->
                <div class="bg-muted-200 dark:bg-muted-700 mt-1 size-2 rounded-full" />
                
                <div class="min-w-0 flex-1">
                  <!-- Mobile layout -->
                  <div class="block sm:hidden">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        <!-- Title skeleton -->
                        <div class="bg-muted-200 dark:bg-muted-700 mb-2 h-4 w-4/5 rounded animate-pulse" />
                        <!-- Message skeleton -->
                        <div class="space-y-1.5">
                          <div class="bg-muted-200 dark:bg-muted-700 h-3 w-full rounded animate-pulse" />
                          <div class="bg-muted-200 dark:bg-muted-700 h-3 w-3/4 rounded animate-pulse" />
                        </div>
                      </div>
                      <!-- Icon skeleton -->
                      <div class="bg-muted-200 dark:bg-muted-700 size-8 rounded-full animate-pulse" />
                    </div>
                    
                    <!-- User info skeleton -->
                    <div class="mt-2 flex items-center gap-2">
                      <div class="bg-muted-200 dark:bg-muted-700 size-4 rounded-full animate-pulse" />
                      <div class="bg-muted-200 dark:bg-muted-700 h-3 w-16 rounded animate-pulse" />
                    </div>
                    
                    <!-- Footer skeleton -->
                    <div class="mt-3 flex items-center justify-between">
                      <div class="bg-muted-200 dark:bg-muted-700 h-3 w-12 rounded animate-pulse" />
                      <div class="flex gap-1">
                        <div class="bg-muted-200 dark:bg-muted-700 size-6 rounded animate-pulse" />
                        <div class="bg-muted-200 dark:bg-muted-700 size-6 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <!-- Desktop layout -->
                  <div class="hidden sm:block">
                    <div class="flex items-start justify-between gap-6">
                      <div class="min-w-0 flex-1">
                        <!-- Title skeleton -->
                        <div class="bg-muted-200 dark:bg-muted-700 mb-3 h-5 w-3/4 rounded animate-pulse" />
                        <!-- Message skeleton -->
                        <div class="space-y-2">
                          <div class="bg-muted-200 dark:bg-muted-700 h-4 w-full rounded animate-pulse" />
                          <div class="bg-muted-200 dark:bg-muted-700 h-4 w-5/6 rounded animate-pulse" />
                          <div class="bg-muted-200 dark:bg-muted-700 h-4 w-2/3 rounded animate-pulse" />
                        </div>
                        
                        <!-- User info skeleton -->
                        <div class="mt-3 flex items-center gap-2">
                          <div class="bg-muted-200 dark:bg-muted-700 size-5 rounded-full animate-pulse" />
                          <div class="bg-muted-200 dark:bg-muted-700 h-3 w-20 rounded animate-pulse" />
                        </div>
                      </div>
                      
                      <!-- Type icon and actions skeleton -->
                      <div class="flex flex-col items-center gap-3">
                        <div class="bg-muted-200 dark:bg-muted-700 size-10 rounded-full animate-pulse" />
                        <div class="flex gap-1">
                          <div class="bg-muted-200 dark:bg-muted-700 size-7 rounded animate-pulse" />
                          <div class="bg-muted-200 dark:bg-muted-700 size-7 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Footer skeleton -->
                    <div class="mt-4 flex items-center justify-between border-t border-muted-100 dark:border-muted-700 pt-4">
                      <div class="bg-muted-200 dark:bg-muted-700 h-3 w-16 rounded animate-pulse" />
                      <div class="bg-muted-200 dark:bg-muted-700 h-6 w-24 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shimmer effect -->
            <div class="animate-shimmer absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </BaseCard>
        </div>

        <!-- Notifications with transitions -->
        <TransitionGroup
          name="notification"
          tag="div"
          class="space-y-4"
          appear
        >
          <BaseCard
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="group relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-white dark:bg-muted-800 shadow-sm border border-muted-200 dark:border-muted-700"
            :class="[
              'transform-gpu will-change-transform',
              notification.isRead
                ? 'opacity-70 hover:opacity-95'
                : 'border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/30 to-white dark:from-primary-900/10 dark:to-muted-800 shadow-lg ring-1 ring-primary-200/50 dark:ring-primary-800/50',
              isUpdating ? 'animate-pulse-subtle' : ''
            ]"
            @click="handleNotificationClick(notification)"
          >
          <div class="p-4 sm:p-5">
            <!-- Unread indicator badge -->
            <div 
              v-if="!notification.isRead"
              class="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 size-3 rounded-full animate-pulse shadow-lg ring-2 ring-white dark:ring-muted-800 z-10"
            />
            
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Priority indicator -->
              <div
                class="mt-1 shrink-0 rounded-full shadow-sm transition-all duration-200 group-hover:scale-150"
                :class="[
                  notification.isRead ? 'size-1.5 opacity-50' : 'size-2',
                  getPriorityColor(notification.priority),
                  notification.priority === 'urgent' && !notification.isRead ? 'animate-pulse ring-2 ring-danger-200 dark:ring-danger-800' : '',
                  !notification.isRead ? 'ring-1 ring-white dark:ring-muted-800' : ''
                ]"
              />

              <!-- Notification icon -->
              <div class="shrink-0">
                <div
                  class="flex size-10 sm:size-11 items-center justify-center rounded-xl shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
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
                    class="size-5 transition-transform duration-200 group-hover:scale-110"
                    :class="getTypeColor(notification.type)"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="min-w-0 flex-1">
                <!-- Mobile layout: Stack vertically -->
                <div class="md:hidden">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <h3 
                        class="text-sm leading-tight"
                        :class="[
                          notification.isRead 
                            ? 'text-muted-600 dark:text-muted-300 font-medium' 
                            : 'text-muted-900 dark:text-white font-bold'
                        ]"
                      >
                        {{ notification.title }}
                      </h3>
                    </div>
                    <!-- Actions for mobile -->
                    <div class="flex shrink-0 items-start gap-1">
                      <BaseButtonIcon
                        v-if="notification.isRead"
                        size="xs"
                        variant="ghost"
                        class="hover:bg-muted-100 dark:hover:bg-muted-700 rounded-lg p-1.5"
                        @click="handleMarkAsUnread($event, notification.id)"
                      >
                        <Icon name="ph:envelope" class="size-3.5" />
                      </BaseButtonIcon>
                      <BaseButtonIcon
                        v-else
                        size="xs"
                        variant="ghost"
                        class="hover:bg-success-50 dark:hover:bg-success-900/10 hover:text-success-600 rounded-lg p-1.5"
                        @click="handleMarkAsRead($event, notification.id)"
                      >
                        <Icon name="ph:envelope-open" class="size-3.5" />
                      </BaseButtonIcon>
                      <BaseButtonIcon
                        size="xs"
                        variant="ghost"
                        class="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/10 rounded-lg p-1.5"
                        @click="handleDelete($event, notification.id)"
                      >
                        <Icon name="ph:trash" class="size-3.5" />
                      </BaseButtonIcon>
                    </div>
                  </div>
                  
                  <p 
                    class="mt-1 text-xs leading-relaxed"
                    :class="[
                      notification.isRead 
                        ? 'text-muted-500 dark:text-muted-400' 
                        : 'text-muted-700 dark:text-muted-200 font-medium'
                    ]"
                  >
                    {{ notification.message }}
                  </p>

                  <!-- User info for mobile -->
                  <div v-if="notification.user" class="mt-2 flex items-center gap-2">
                    <BaseAvatar
                      :src="notification.user.avatar ?? '/img/avatars/1.svg'"
                      size="xxs"
                      :alt="notification.user.name"
                      :class="[
                        'ring-1',
                        notification.isRead 
                          ? 'ring-muted-300 dark:ring-muted-600 opacity-70' 
                          : 'dark:ring-muted-800 ring-white'
                      ]"
                    />
                    <span 
                      class="text-xs"
                      :class="[
                        notification.isRead 
                          ? 'text-muted-400 dark:text-muted-500' 
                          : 'text-muted-600 dark:text-muted-300 font-medium'
                      ]"
                    >
                      {{ notification.user.name }}
                    </span>
                  </div>

                  <!-- Footer for mobile -->
                  <div class="mt-3 flex items-center justify-between">
                    <span 
                      class="text-xs"
                      :class="[
                        notification.isRead 
                          ? 'text-muted-400 dark:text-muted-500' 
                          : 'text-muted-500 dark:text-muted-400 font-medium'
                      ]"
                    >
                      {{ getRelativeTime(notification.createdAt) }}
                    </span>
                    <BaseButton
                      v-if="notification.actionText && notification.actionUrl"
                      size="xs"
                      variant="outline"
                      class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700 px-2 py-1 rounded-lg text-primary-700 dark:text-primary-300 text-xs font-medium"
                    >
                      {{ notification.actionText }}
                    </BaseButton>
                  </div>
                </div>

                <!-- Desktop layout: Original layout -->
                <div class="hidden md:block">
                                      <div class="flex items-start justify-between gap-6">
                      <div class="min-w-0 flex-1">
                        <h3 
                          class="text-base leading-tight"
                          :class="[
                            notification.isRead 
                              ? 'text-muted-600 dark:text-muted-300 font-medium' 
                              : 'text-muted-900 dark:text-white font-bold'
                          ]"
                        >
                          {{ notification.title }}
                        </h3>
                        <p 
                          class="mt-1.5 text-sm leading-relaxed"
                          :class="[
                            notification.isRead 
                              ? 'text-muted-500 dark:text-muted-400' 
                              : 'text-muted-700 dark:text-muted-200 font-medium'
                          ]"
                        >
                          {{ notification.message }}
                        </p>

                                              <!-- User info -->
                        <div v-if="notification.user" class="mt-3 flex items-center gap-2">
                          <BaseAvatar
                            :src="notification.user.avatar ?? '/img/avatars/1.svg'"
                            size="xs"
                            :alt="notification.user.name"
                            :class="[
                              'ring-2 shadow-sm',
                              notification.isRead 
                                ? 'ring-muted-300 dark:ring-muted-600 opacity-70' 
                                : 'dark:ring-muted-800 ring-white'
                            ]"
                          />
                          <span 
                            class="text-xs"
                            :class="[
                              notification.isRead 
                                ? 'text-muted-400 dark:text-muted-500 font-normal' 
                                : 'text-muted-600 dark:text-muted-300 font-medium'
                            ]"
                          >
                            {{ notification.user.name }}
                          </span>
                        </div>
                    </div>

                    <!-- Actions for desktop -->
                    <div class="flex shrink-0 items-start gap-1.5 pt-1">
                      <BaseButtonIcon
                        v-if="notification.isRead"
                        size="sm"
                        variant="ghost"
                        class="opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-muted-100 dark:hover:bg-muted-700 rounded-xl p-2.5 shadow-sm hover:shadow-md"
                        @click="handleMarkAsUnread($event, notification.id)"
                      >
                        <Icon name="ph:envelope" class="size-4" />
                      </BaseButtonIcon>
                      <BaseButtonIcon
                        v-else
                        size="sm"
                        variant="ghost"
                        class="opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-success-50 dark:hover:bg-success-900/10 hover:text-success-600 rounded-xl p-2.5 border border-transparent hover:border-success-200 dark:hover:border-success-800 shadow-sm hover:shadow-md"
                        @click="handleMarkAsRead($event, notification.id)"
                      >
                        <Icon name="ph:envelope-open" class="size-4" />
                      </BaseButtonIcon>

                      <BaseButtonIcon
                        size="sm"
                        variant="ghost"
                        class="text-danger-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-danger-50 dark:hover:bg-danger-900/10 rounded-xl p-2.5 border border-transparent hover:border-danger-200 dark:hover:border-danger-800 shadow-sm hover:shadow-md"
                        @click="handleDelete($event, notification.id)"
                      >
                        <Icon name="ph:trash" class="size-4" />
                      </BaseButtonIcon>
                    </div>
                  </div>

                  <!-- Footer for desktop -->
                  <div 
                    class="mt-4 flex items-center justify-between pt-4"
                    :class="[
                      notification.isRead 
                        ? 'border-t border-muted-100 dark:border-muted-700' 
                        : 'border-t border-primary-100 dark:border-primary-800'
                    ]"
                  >
                    <span 
                      class="text-xs"
                      :class="[
                        notification.isRead 
                          ? 'text-muted-400 dark:text-muted-500 font-normal' 
                          : 'text-muted-500 dark:text-muted-400 font-medium'
                      ]"
                    >
                      {{ getRelativeTime(notification.createdAt) }}
                    </span>

                    <BaseButton
                      v-if="notification.actionText && notification.actionUrl"
                      size="sm"
                      variant="outline"
                      class="opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 hover:from-primary-100 hover:to-primary-200 border-primary-200 dark:border-primary-700 px-4 py-2 rounded-xl text-primary-700 dark:text-primary-300 font-medium shadow-sm"
                    >
                      <Icon name="ph:arrow-square-out" class="ml-1.5 size-4" />
                      {{ notification.actionText }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
                  </BaseCard>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

/* Subtle pulse for updates */
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.005);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Notification transitions */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* List item stagger effect */
.notification-enter-active:nth-child(1) { transition-delay: 0ms; }
.notification-enter-active:nth-child(2) { transition-delay: 50ms; }
.notification-enter-active:nth-child(3) { transition-delay: 100ms; }
.notification-enter-active:nth-child(4) { transition-delay: 150ms; }
.notification-enter-active:nth-child(5) { transition-delay: 200ms; }

/* Smooth updates indicator */
.update-glow {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

/* Optimized animations */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Loading placeholder improvements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Layout fixes for sidebar */
.notifications-page {
  overflow-x: hidden;
  position: relative;
}

.notifications-page .container-wrapper {
  padding-top: 2rem;
}

@media (max-width: 768px) {
  .notifications-page .container-wrapper {
    padding-top: 5rem !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .notifications-page .container-wrapper {
    padding-top: 2rem !important;
  }
}

@media (min-width: 1025px) {
  .notifications-page .container-wrapper {
    padding-top: 1rem !important;
  }
}
</style>
