<script setup lang="ts">
import { getRelativeTimeToAnnounce } from '~/utils/persian-date'

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

// Initialize notifications composable
const {
  filteredNotifications,
  unreadCount,
  currentFilter,
  isLoading,
  isUpdating,
  lastUpdateTime,
  error,
  isRealtimeConnected,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  refreshNotifications,
  setFilter,
  initialize,
  fetchNotifications,
  getRelativeTime,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
} = useNotifications()

// Client-side only state to prevent hydration mismatches
const isMounted = ref(false)
const showTransition = ref(false)
const showPwaSettings = ref(false)

// Initialize only on client side
onMounted(async () => {
  console.log('Notifications page mounted')
  isMounted.value = true

  // Wait for next tick to ensure DOM is ready
  await nextTick()
  console.log('DOM ready, enabling transitions')
  showTransition.value = true

  // Ensure notifications are initialized when component mounts
  try {
    console.log('Checking if notifications need initialization...')
    console.log('Current state:', {
      isLoading: isLoading.value,
      notificationsCount: filteredNotifications.value.length,
      hasError: !!error.value,
    })

    // Always try to initialize - the function has guards to prevent duplicates
    console.log('Attempting to initialize notifications...')
    await initialize()
    console.log('Initialize call completed')
  }
  catch (err) {
    console.warn('Failed to initialize notifications:', err)
  }

  // Fallback: If no data after 2 seconds, try direct fetch
  setTimeout(async () => {
    if (!isLoading.value && filteredNotifications.value.length === 0 && !error.value) {
      console.log('No data loaded after timeout, trying direct fetch...')
      try {
        // Try direct fetch first
        await fetchNotifications()

        // If still no data, try refresh
        if (filteredNotifications.value.length === 0) {
          console.log('Direct fetch had no results, trying refresh...')
          await refreshNotifications()
        }
      }
      catch (err) {
        console.warn('Fallback fetch/refresh failed:', err)
      }
    }
  }, 2000)
})

onBeforeUnmount(() => {
  console.log('Notifications page unmounting...')
  isMounted.value = false
  console.log('Notifications page unmounted, keeping global instance active')
})

const handleNotificationClick = async (notification: any) => {
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }

  // Navigate based on priority: details > action_url > notifications page
  if (notification.completeMessage) {
    // اگه جزئیات داشته باشه می‌ریم به صفحه جزئیات
    await navigateTo(`/notifications/${notification.id}`)
  }
  else if (notification.actionUrl) {
    // اگه جزئیات نداشت ولی action_url داشت می‌ریم به اون صفحه
    await navigateTo(notification.actionUrl)
  }
  else {
    // اگه هیچکدوم رو نداشت می‌ریم به صفحه اعلان‌ها (همین جا هستیم)
    // No navigation needed - we're already on notifications page
  }
}

const handleReadMoreClick = async (e: Event, notification: any) => {
  e.stopPropagation()
  await navigateTo(`/notifications/${notification.id}`)
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
  <div class="notifications-page bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-8">
      <!-- Header -->
      <div class="relative z-10 mb-6 sm:mb-8">
        <!-- Title Section -->
        <div class="mb-4 sm:mb-6">
          <h1 class="text-muted-900 text-2xl font-bold sm:text-3xl dark:text-white">
            اعلان‌ها
          </h1>
          <p class="text-muted-500 dark:text-muted-400 mt-1 text-sm sm:mt-2 sm:text-base">
            مدیریت پیام‌ها و اعلان‌های سیستمی
          </p>
        </div>

        <!-- Status Indicators - Mobile Optimized -->
        <div class="mb-4 sm:hidden">
          <ClientOnly>
            <!-- Mobile Status Bar -->
            <div class="dark:bg-muted-800 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
              <!-- Connection Status -->
              <div v-if="isMounted && !isLoading" class="flex items-center gap-2">
                <div
                  class="size-2 rounded-full transition-all duration-300"
                  :class="isRealtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                />
                <span
                  class="text-xs font-medium"
                  :class="isRealtimeConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ isRealtimeConnected ? 'فعال' : 'قطع' }}
                </span>
              </div>

              <!-- Unread Count -->
              <div v-if="isMounted && unreadCount > 0" class="flex items-center gap-2">
                <span class="text-muted-500 dark:text-muted-400 text-xs">
                  خوانده نشده:
                </span>
                <div
                  class="bg-primary-500 flex size-5 items-center justify-center rounded-full text-xs font-medium text-white"
                  :class="{ 'animate-bounce': isUpdating }"
                >
                  {{ unreadCount }}
                </div>
              </div>

              <!-- Update Indicator -->
              <div
                v-if="isMounted && isUpdating && !isLoading"
                class="flex items-center gap-1"
              >
                <div class="size-1.5 animate-pulse rounded-full bg-blue-500" />
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
                  بروزرسانی...
                </span>
              </div>
            </div>
          </ClientOnly>
        </div>

        <!-- Desktop Header Actions -->
        <div class="hidden items-center justify-between gap-4 sm:flex">
          <div class="flex items-center gap-3">
            <!-- Client-only indicators to prevent hydration mismatch -->
            <ClientOnly>
              <!-- Update indicator -->
              <div
                v-if="isMounted && isUpdating && !isLoading"
                class="flex animate-pulse items-center gap-2"
              >
                <div class="size-2 animate-pulse rounded-full bg-blue-500" />
                <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                  در حال بروزرسانی...
                </span>
              </div>

              <!-- Realtime connection status -->
              <div v-if="isMounted && !isLoading" class="flex items-center gap-2">
                <div
                  class="size-2 rounded-full transition-all duration-300"
                  :class="isRealtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                />
                <span
                  class="text-xs"
                  :class="isRealtimeConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ isRealtimeConnected ? 'اتصال فوری فعال' : 'اتصال فوری قطع' }}
                </span>
              </div>

              <!-- Last update time -->
              <div v-if="isMounted && !isLoading && !isUpdating" class="flex items-center gap-2">
                <Icon name="ph:clock" class="text-muted-400 size-3" />
                <span class="text-muted-400 text-xs">
                  آخرین بروزرسانی: {{ new Date(lastUpdateTime).toLocaleTimeString('fa-IR') }}
                </span>
              </div>

              <!-- Unread count badge -->
              <div v-if="isMounted && unreadCount > 0" class="flex items-center gap-2">
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
            </ClientOnly>
          </div>

          <div class="flex items-center gap-3">
            <!-- Refresh button -->
            <BaseButtonIcon
              :loading="isLoading"
              :disabled="isUpdating"
              size="sm"
              variant="outline"
              class="transition-all duration-200"
              :class="[
                isUpdating
                  ? 'cursor-not-allowed opacity-50'
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

            <!-- PWA Settings Toggle - Client only -->
            <ClientOnly>
              <BaseButton
                v-if="isMounted"
                size="sm"
                variant="outline"
                color="primary"
                class="transition-all duration-200 hover:scale-105"
                @click="showPwaSettings = !showPwaSettings"
              >
                <Icon name="ph:gear" class="ml-2 size-4" />
                تنظیمات PWA
              </BaseButton>
            </ClientOnly>

            <!-- Mark all as read -->
            <ClientOnly>
              <BaseButton
                v-if="isMounted && unreadCount > 0"
                size="sm"
                variant="solid"
                class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 bg-gradient-to-r shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                @click="markAllAsRead"
              >
                <Icon name="ph:check-circle" class="ml-2 size-4" />
                علامت‌گذاری همه به عنوان خوانده شده
              </BaseButton>
            </ClientOnly>
          </div>
        </div>

        <!-- Mobile Action Buttons -->
        <div class="flex items-center justify-between gap-2 sm:hidden">
          <!-- Refresh button -->
          <BaseButtonIcon
            :loading="isLoading"
            :disabled="isUpdating"
            size="sm"
            variant="outline"
            class="shrink-0 transition-all duration-200"
            :class="[
              isUpdating
                ? 'cursor-not-allowed opacity-50'
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

          <!-- PWA Settings Toggle - Mobile -->
          <ClientOnly>
            <BaseButton
              v-if="isMounted"
              size="sm"
              variant="outline"
              color="primary"
              class="shrink-0 transition-all duration-200 hover:scale-105"
              @click="showPwaSettings = !showPwaSettings"
            >
              <Icon name="ph:gear" class="size-4" />
              <span class="ml-1 text-xs">PWA</span>
            </BaseButton>
          </ClientOnly>

          <!-- Mark all as read - Mobile -->
          <ClientOnly>
            <BaseButton
              v-if="isMounted && unreadCount > 0"
              size="sm"
              variant="solid"
              class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex-1 bg-gradient-to-r shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              @click="markAllAsRead"
            >
              <Icon name="ph:check-circle" class="ml-1 size-4" />
              <span class="text-xs">علامت‌گذاری همه</span>
            </BaseButton>
          </ClientOnly>
        </div>
      </div>

      <!-- Filters -->
      <div class="relative z-10 mb-4 sm:mb-6">
        <!-- Mobile Filters -->
        <div class="sm:hidden">
          <span class="text-muted-600 dark:text-muted-300 mb-3 block text-sm font-medium">
            فیلتر:
          </span>
          <div class="grid grid-cols-3 gap-2">
            <BaseButton
              v-for="option in filterOptions"
              :key="option.value"
              size="sm"
              :variant="currentFilter === option.value ? 'solid' : 'outline'"
              :class="[
                'py-2.5 text-xs transition-all duration-200',
                currentFilter === option.value
                  ? 'from-primary-500 to-primary-600 ring-primary-200 dark:ring-primary-800 bg-gradient-to-r shadow-lg ring-2'
                  : 'hover:shadow-md'
              ]"
              @click="setFilter(option.value as any)"
            >
              {{ option.label }}
            </BaseButton>
          </div>
        </div>

        <!-- Desktop Filters -->
        <div class="hidden flex-wrap items-center gap-3 sm:flex">
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
                  ? 'from-primary-500 to-primary-600 ring-primary-200 dark:ring-primary-800 bg-gradient-to-r shadow-lg ring-2'
                  : 'hover:shadow-md'
              ]"
              @click="setFilter(option.value as any)"
            >
              {{ option.label }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- PWA Notification Settings - Client only -->
      <ClientOnly>
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 transform -translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-4"
        >
          <div v-if="isMounted && showPwaSettings" class="mx-auto mb-8 max-w-5xl">
            <BaseCard class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-primary-100 dark:bg-primary-900/20 flex size-10 items-center justify-center rounded-lg">
                    <Icon name="ph:app-window" class="text-primary-600 dark:text-primary-400 size-5" />
                  </div>
                  <div>
                    <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
                      تنظیمات اعلان‌های PWA
                    </h3>
                    <p class="text-muted-500 dark:text-muted-400 text-sm">
                      مدیریت اعلان‌های فوری و آفلاین
                    </p>
                  </div>
                </div>

                <BaseButton
                  size="sm"
                  variant="ghost"
                  @click="showPwaSettings = false"
                >
                  <Icon name="ph:x" class="size-4" />
                </BaseButton>
              </div>

              <PwaNotificationSettings />
            </BaseCard>
          </div>
        </Transition>
      </ClientOnly>

      <!-- Error State -->
      <div v-if="error" class="mx-auto mb-6 max-w-5xl">
        <BaseMessage
          type="danger"
          icon="ph:warning-circle"
          class="mb-4"
        >
          {{ error }}
        </BaseMessage>
      </div>

      <!-- Main Content -->
      <div class="mx-auto max-w-5xl">
        <!-- Loading State -->
        <div v-if="!isMounted || (isLoading && filteredNotifications.length === 0)" class="space-y-3 sm:space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="animate-pulse"
          >
            <BaseCard class="p-3 sm:p-4 md:p-6">
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="bg-muted-200 dark:bg-muted-700 size-10 shrink-0 rounded-full sm:size-12" />
                <div class="flex-1 space-y-2 sm:space-y-3">
                  <div class="bg-muted-200 dark:bg-muted-700 h-3 w-3/4 rounded sm:h-4" />
                  <div class="bg-muted-200 dark:bg-muted-700 h-2.5 w-1/2 rounded sm:h-3" />
                  <div class="bg-muted-200 dark:bg-muted-700 h-2.5 w-1/4 rounded sm:h-3" />
                </div>
                <!-- Mobile action placeholders -->
                <div class="flex flex-col gap-1 sm:hidden">
                  <div class="bg-muted-200 dark:bg-muted-700 size-8 rounded" />
                  <div class="bg-muted-200 dark:bg-muted-700 size-8 rounded" />
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="isMounted && filteredNotifications.length === 0 && !isLoading"
          class="flex flex-col items-center justify-center px-4 py-12 sm:py-16"
        >
          <div class="bg-muted-100 dark:bg-muted-800 mb-4 flex size-12 items-center justify-center rounded-full sm:size-16">
            <Icon name="ph:bell-slash" class="text-muted-400 size-6 sm:size-8" />
          </div>
          <h3 class="text-muted-900 mb-2 text-center text-base font-semibold sm:text-lg dark:text-white">
            هیچ اعلانی وجود ندارد
          </h3>
          <p class="text-muted-500 dark:text-muted-400 max-w-sm text-center text-sm sm:text-base">
            {{ currentFilter === 'unread' ? 'همه اعلان‌های شما خوانده شده‌اند' :
              currentFilter === 'read' ? 'هیچ اعلان خوانده شده‌ای وجود ندارد' :
              'هیچ اعلانی دریافت نکرده‌اید' }}
          </p>

          <!-- Mobile refresh suggestion -->
          <div class="mt-4 sm:hidden">
            <BaseButton
              size="sm"
              variant="outline"
              color="primary"
              :loading="isUpdating"
              @click="refreshNotifications"
            >
              <Icon name="ph:arrow-clockwise" class="ml-1 size-4" />
              <span class="text-sm">بروزرسانی</span>
            </BaseButton>
          </div>
        </div>

        <!-- Notifications List -->
        <div v-else-if="isMounted && filteredNotifications.length > 0" class="space-y-4">
          <!-- Notifications with transitions -->
          <ClientOnly>
            <TransitionGroup
              name="notification"
              tag="div"
              class="space-y-4"
              appear
            >
              <BaseCard
                v-for="notification in filteredNotifications"
                :key="notification.id"
                class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 group relative cursor-pointer border bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:hover:scale-[1.01]"
                :class="[
                  'transform-gpu will-change-transform',
                  notification.isRead
                    ? 'opacity-70 hover:opacity-95'
                    : 'border-l-primary-500 from-primary-50/30 dark:from-primary-900/10 dark:to-muted-800 ring-primary-200/50 dark:ring-primary-800/50 border-l-4 bg-gradient-to-r to-white shadow-lg ring-1',
                  isUpdating ? 'animate-pulse-subtle' : ''
                ]"
                @click="handleNotificationClick(notification)"
              >
                <div class="p-3 sm:p-4 md:p-5">
                  <!-- Unread indicator badge -->
                  <div
                    v-if="!notification.isRead"
                    class="from-primary-500 to-primary-600 dark:ring-muted-800 absolute -right-1 -top-1 z-10 size-3 animate-pulse rounded-full bg-gradient-to-r shadow-lg ring-2 ring-white"
                  />

                  <div class="flex items-start gap-3 sm:gap-4">
                    <!-- Priority indicator -->
                    <div
                      class="mt-1 shrink-0 rounded-full shadow-sm transition-all duration-200 group-hover:scale-150"
                      :class="[
                        notification.isRead ? 'size-1.5 opacity-50' : 'size-2',
                        getPriorityColor(notification.priority),
                        notification.priority === 'urgent' && !notification.isRead ? 'ring-danger-200 dark:ring-danger-800 animate-pulse ring-2' : '',
                        !notification.isRead ? 'dark:ring-muted-800 ring-1 ring-white' : ''
                      ]"
                    />

                    <!-- Notification icon -->
                    <div class="shrink-0">
                      <div
                        class="flex size-10 items-center justify-center rounded-xl shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg sm:size-11"
                        :class="[
                          notification.type === 'success' ? 'from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30 bg-gradient-to-br' :
                          notification.type === 'warning' ? 'from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30 bg-gradient-to-br' :
                          notification.type === 'error' ? 'from-danger-100 to-danger-200 dark:from-danger-900/20 dark:to-danger-800/30 bg-gradient-to-br' :
                          notification.type === 'system' ? 'from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/30 bg-gradient-to-br' :
                          'from-info-100 to-info-200 dark:from-info-900/20 dark:to-info-800/30 bg-gradient-to-br'
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
                                  : 'text-muted-900 font-bold dark:text-white'
                              ]"
                            >
                              {{ notification.title }}
                            </h3>
                          </div>
                          <!-- Actions for mobile -->
                          <div class="flex shrink-0 items-start gap-1">
                            <BaseButtonIcon
                              v-if="notification.isRead"
                              size="sm"
                              variant="ghost"
                              class="hover:bg-muted-100 dark:hover:bg-muted-700 min-h-[40px] min-w-[40px] rounded-lg p-2"
                              @click="handleMarkAsUnread($event, notification.id)"
                            >
                              <Icon name="ph:envelope" class="size-4" />
                            </BaseButtonIcon>
                            <BaseButtonIcon
                              v-else
                              size="sm"
                              variant="ghost"
                              class="hover:bg-success-50 dark:hover:bg-success-900/10 hover:text-success-600 min-h-[40px] min-w-[40px] rounded-lg p-2"
                              @click="handleMarkAsRead($event, notification.id)"
                            >
                              <Icon name="ph:envelope-open" class="size-4" />
                            </BaseButtonIcon>
                          <!-- <BaseButtonIcon
                            size="sm"
                            variant="ghost"
                            class="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/10 rounded-lg p-2 min-h-[40px] min-w-[40px]"
                            @click="handleDelete($event, notification.id)"
                          >
                            <Icon name="ph:trash" class="size-4" />
                          </BaseButtonIcon> -->
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

                        <div class="mt-2 flex items-center justify-between text-xs">
                          <div class="flex flex-col gap-1">
                            <span class="text-muted-400 dark:text-muted-500">
                              {{ getRelativeTime(notification.createdAt) }}
                            </span>
                            <div v-if="notification.announceTime" class="space-y-1">
                              <span class="text-primary-600 dark:text-primary-400 flex items-center gap-1">
                                <Icon name="ph:calendar-check" class="size-3" />
                                اعلان: {{ new Date(notification.announceTime).toLocaleString('fa-IR') }}
                              </span>
                              
                              <!-- Show relative time if notification is scheduled for future -->
                              <span
                                v-if="new Date(notification.announceTime) > new Date()"
                                class="text-orange-600 dark:text-orange-400 flex items-center gap-1 text-xs font-medium"
                              >
                                <Icon name="ph:timer" class="size-3" />
                                {{ getRelativeTimeToAnnounce(notification.announceTime) }}
                              </span>
                            </div>
                          </div>

                          <div class="flex items-center gap-2">
                            <BaseButton
                              v-if="notification.completeMessage"
                              size="sm"
                              variant="outline"
                              class="border-info-200 dark:border-info-700 text-info-600 dark:text-info-400 hover:bg-info-50 dark:hover:bg-info-900/10 min-h-[36px] rounded-lg px-3 py-2 text-xs"
                              @click="handleReadMoreClick($event, notification)"
                            >
                              <Icon name="ph:read-cv-logo" class="ml-1 size-3" />
                              بیشتر بخوانید
                            </BaseButton>

                            <BaseButton
                              v-if="notification.actionText && notification.actionUrl"
                              size="sm"
                              variant="outline"
                              class="border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 min-h-[36px] rounded-lg px-3 py-2 text-xs"
                            >
                              <Icon name="ph:arrow-square-out" class="ml-1 size-3" />
                              {{ notification.actionText }}
                            </BaseButton>
                          </div>
                        </div>
                      </div>

                      <!-- Desktop layout: Side by side -->
                      <div class="hidden md:block">
                        <div class="flex items-start justify-between">
                          <div class="min-w-0 flex-1 pr-4">
                            <h3
                              class="text-base leading-tight"
                              :class="[
                                notification.isRead
                                  ? 'text-muted-600 dark:text-muted-300 font-medium'
                                  : 'text-muted-900 font-bold dark:text-white'
                              ]"
                            >
                              {{ notification.title }}
                            </h3>

                            <p
                              class="mt-1 text-sm leading-relaxed"
                              :class="[
                                notification.isRead
                                  ? 'text-muted-500 dark:text-muted-400'
                                  : 'text-muted-700 dark:text-muted-200 font-medium'
                              ]"
                            >
                              {{ notification.message }}
                            </p>

                            <div class="mt-2 flex items-center gap-4 text-xs">
                              <span class="text-muted-400 dark:text-muted-500 flex items-center gap-1">
                                <Icon name="ph:clock" class="size-3" />
                                {{ getRelativeTime(notification.createdAt) }}
                              </span>

                              <div v-if="notification.announceTime" class="space-y-1">
                                <span class="text-primary-600 dark:text-primary-400 flex items-center gap-1">
                                  <Icon name="ph:calendar-check" class="size-3" />
                                  اعلان: {{ new Date(notification.announceTime).toLocaleString('fa-IR') }}
                                </span>
                                
                                <!-- Show relative time if notification is scheduled for future -->
                                <span
                                  v-if="new Date(notification.announceTime) > new Date()"
                                  class="text-orange-600 dark:text-orange-400 flex items-center gap-1 font-medium"
                                >
                                  <Icon name="ph:timer" class="size-3" />
                                  {{ getRelativeTimeToAnnounce(notification.announceTime) }}
                                </span>
                              </div>

                              <span
                                v-if="notification.priority !== 'low'"
                                class="flex items-center gap-1"
                                :class="getPriorityColor(notification.priority)"
                              >
                                <Icon name="ph:flag" class="size-3" />
                                {{ notification.priority === 'urgent' ? 'فوری' :
                                  notification.priority === 'high' ? 'مهم' :
                                  'متوسط' }}
                              </span>
                            </div>
                          </div>

                          <!-- Actions for desktop -->
                          <div class="flex shrink-0 items-start gap-1.5 pt-1">
                            <BaseButtonIcon
                              v-if="notification.isRead"
                              size="sm"
                              variant="ghost"
                              class="hover:bg-muted-100 dark:hover:bg-muted-700 rounded-xl p-2.5 opacity-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md group-hover:opacity-100"
                              @click="handleMarkAsUnread($event, notification.id)"
                            >
                              <Icon name="ph:envelope" class="size-4" />
                            </BaseButtonIcon>
                            <BaseButtonIcon
                              v-else
                              size="sm"
                              variant="ghost"
                              class="hover:bg-success-50 dark:hover:bg-success-900/10 hover:text-success-600 hover:border-success-200 dark:hover:border-success-800 rounded-xl border border-transparent p-2.5 opacity-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md group-hover:opacity-100"
                              @click="handleMarkAsRead($event, notification.id)"
                            >
                              <Icon name="ph:envelope-open" class="size-4" />
                            </BaseButtonIcon>
                          <!-- <BaseButtonIcon
                            size="sm"
                            variant="ghost"
                            class="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/10 hover:border-danger-200 dark:hover:border-danger-800 rounded-xl border border-transparent p-2.5 opacity-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md group-hover:opacity-100"
                            @click="handleDelete($event, notification.id)"
                          >
                            <Icon name="ph:trash" class="size-4" />
                          </BaseButtonIcon> -->
                          </div>
                        </div>

                        <div v-if="notification.completeMessage || (notification.actionText && notification.actionUrl)" class="mt-4 flex justify-end gap-2">
                          <BaseButton
                            v-if="notification.completeMessage"
                            size="sm"
                            variant="outline"
                            class="from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-800/30 hover:from-info-100 hover:to-info-200 border-info-200 dark:border-info-700 text-info-700 dark:text-info-300 rounded-xl bg-gradient-to-r px-4 py-2 font-medium opacity-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg group-hover:opacity-100"
                            @click="handleReadMoreClick($event, notification)"
                          >
                            <Icon name="ph:read-cv-logo" class="ml-1.5 size-4" />
                            بیشتر بخوانید
                          </BaseButton>

                          <BaseButton
                            v-if="notification.actionText && notification.actionUrl"
                            size="sm"
                            variant="outline"
                            class="from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 hover:from-primary-100 hover:to-primary-200 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-xl bg-gradient-to-r px-4 py-2 font-medium opacity-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg group-hover:opacity-100"
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
          </ClientOnly>
        </div>
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
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .notifications-page .container-wrapper {
    padding-top: 4rem !important;
  }

  /* Mobile-specific optimizations */
  .notifications-page {
    padding-bottom: 2rem;
  }

  /* Better touch targets on mobile */
  .notifications-page button {
    min-height: 44px;
  }

  /* Improved spacing for mobile cards */
  .notifications-page .space-y-4 > * + * {
    margin-top: 0.75rem !important;
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

/* Mobile responsive card improvements */
@media (max-width: 640px) {
  .notifications-page .mx-auto.max-w-5xl {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  /* Disable hover effects on mobile */
  .notifications-page .group:hover {
    transform: none !important;
  }

  /* Better mobile card styling */
  .notifications-page .group {
    margin-bottom: 0.75rem;
  }

  /* Mobile-friendly tap highlighting */
  .notifications-page button,
  .notifications-page .cursor-pointer {
    -webkit-tap-highlight-color: rgba(79, 70, 229, 0.1);
    tap-highlight-color: rgba(79, 70, 229, 0.1);
  }

  /* Smoother scrolling on mobile */
  .notifications-page {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
}

/* Specific mobile typography improvements */
@media (max-width: 480px) {
  .notifications-page h1 {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }

  .notifications-page .container-wrapper {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
