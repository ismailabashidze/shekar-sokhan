<script setup lang="ts">
import { persianDateTimeToISO, isoToPersianDateTime, getRelativeTimeToAnnounce, formatPersianDate } from '~/utils/persian-date';
import PersianCalendar from '~/components/PersianCalendar.vue';

definePageMeta({
  title: 'اعلان‌های ارسال شده',
  layout: 'sidebar',
  // Using global middlewares only
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'اعلان‌های ارسال شده - پنل ادمین - ذهنا',
});

// Types
type NotificationFilter = 'all' | 'sent' | 'scheduled-pending' | 'scheduled-sent';

interface StatusOption {
  label: string;
  value: string;
}

interface UserOption {
  label: string;
  value: string;
}

const {
  fetchAllNotifications,
  fetchUsers,
  deleteNotificationAdmin,
  getNotificationStats,
  subscribeToAllNotifications,
  unsubscribeFromAllNotifications,
  isLoading,
  isAdminRealtimeConnected,
  allNotifications,
  users,
} = useAdminNotifications();

const { getUserAvatarUrl } = useAvatarManager();
const route = useRoute();

// Local state
const notificationFilter = ref<NotificationFilter>('all');
const userFilter = ref('');
const searchQuery = ref('');
const statusFilter = ref('');
const dateFilter = ref('');
const selectedUser = ref<any>(null);

// Date range filter
const fromDate = ref('');
const toDate = ref('');

// Options for dropdowns
const statusOptions: StatusOption[] = [
  { label: 'همه', value: '' },
  { label: 'خوانده شده', value: 'read' },
  { label: 'خوانده نشده', value: 'unread' },
];

// Initialize user filter from query params
const initializeUserFilter = () => {
  if (route.query.userId) {
    userFilter.value = route.query.userId as string;
    // Find user in users list
    const user = users.value.find((u: any) => u.id === route.query.userId);
    if (user) {
      selectedUser.value = user;
    }
  }
};

// Watch for changes in userFilter and update URL
watch(userFilter, (newUserId) => {
  if (newUserId) {
    navigateTo({
      path: '/admin/sent',
      query: { userId: newUserId },
    });
  }
  else {
    navigateTo('/admin/sent');
  }
});

// Computed
const userOptions = computed((): UserOption[] => {
  return users.value.map((user: any) => ({
    label: user.meta?.name || user.username || 'کاربر بدون نام',
    value: user.id,
  }));
});

const filteredNotifications = computed(() => {
  let filtered = allNotifications.value;

  // Filter by notification status
  if (notificationFilter.value !== 'all') {
    filtered = filtered.filter((notification: any) => {
      const scheduleStatus = getNotificationScheduleStatus(notification);

      switch (notificationFilter.value) {
        case 'sent':
          return !scheduleStatus.isScheduled;
        case 'scheduled-pending':
          return scheduleStatus.isScheduled && scheduleStatus.isPending;
        case 'scheduled-sent':
          return scheduleStatus.isScheduled && !scheduleStatus.isPending;
        default:
          return true;
      }
    });
  }

  // Filter by user
  if (userFilter.value) {
    filtered = filtered.filter((notification: any) => {
      return notification.expand?.recipient_user_id?.id === userFilter.value;
    });
  }

  // Filter by search query (title or message)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((notification: any) => {
      return notification.title?.toLowerCase().includes(query)
        || notification.message?.toLowerCase().includes(query);
    });
  }

  // Filter by status (read/unread)
  if (statusFilter.value) {
    filtered = filtered.filter((notification: any) => {
      return statusFilter.value === 'read' ? notification.is_read : !notification.is_read;
    });
  }

  // Filter by date range
  if (fromDate.value || toDate.value) {
    filtered = filtered.filter((notification: any) => {
      const notificationDate = new Date(notification.created);
      const from = fromDate.value ? new Date(fromDate.value) : null;
      const to = toDate.value ? new Date(toDate.value) : null;

      if (from && to) {
        return notificationDate >= from && notificationDate <= to;
      }
      else if (from) {
        return notificationDate >= from;
      }
      else if (to) {
        return notificationDate <= to;
      }
      return true;
    });
  }

  return filtered;
});

const getNotificationFilterStats = computed(() => {
  const all = allNotifications.value.length;
  const sent = allNotifications.value.filter((n: any) => !getNotificationScheduleStatus(n).isScheduled).length;
  const scheduledPending = allNotifications.value.filter((n: any) => {
    const status = getNotificationScheduleStatus(n);
    return status.isScheduled && status.isPending;
  }).length;
  const scheduledSent = allNotifications.value.filter((n: any) => {
    const status = getNotificationScheduleStatus(n);
    return status.isScheduled && !status.isPending;
  }).length;

  return {
    all,
    sent,
    scheduledPending,
    scheduledSent,
  };
});

// Methods
const getNotificationScheduleStatus = (notification: any) => {
  const hasSchedule = notification.announce_time;

  if (!hasSchedule) {
    return {
      isScheduled: false,
      isPending: false,
      statusText: '',
    };
  }

  const scheduleTime = new Date(notification.announce_time);
  const now = new Date();
  const isPending = scheduleTime > now;

  return {
    isScheduled: true,
    isPending,
    statusText: isPending
      ? `ارسال در ${scheduleTime.toLocaleDateString('fa-IR')} ساعت ${scheduleTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
      : `ارسال شده در ${scheduleTime.toLocaleDateString('fa-IR')} ساعت ${scheduleTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
  };
};

const deleteNotification = async (notificationId: string) => {
  if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
    try {
      await deleteNotificationAdmin(notificationId);
      console.log('اعلان با موفقیت حذف شد');
    }
    catch (error) {
      console.error('خطا در حذف اعلان:', error);
    }
  }
};

const clearFilters = () => {
  notificationFilter.value = 'all';
  userFilter.value = '';
  searchQuery.value = '';
  statusFilter.value = '';
  dateFilter.value = '';
  fromDate.value = '';
  toDate.value = '';
  selectedUser.value = null;
};

const selectUser = (user: any) => {
  selectedUser.value = user;
  userFilter.value = user.id;
};

const clearUserFilter = () => {
  selectedUser.value = null;
  userFilter.value = '';
};

// Initialize
onMounted(async () => {
  try {
    await Promise.all([
      fetchAllNotifications(),
      fetchUsers(1, 100, '', true), // Load more users for filter
      subscribeToAllNotifications(),
    ]);

    // Initialize user filter after data is loaded
    initializeUserFilter();
  }
  catch (error) {
    console.error('خطا در بارگذاری داده‌ها:', error);
  }
});

// Cleanup
onBeforeUnmount(() => {
  unsubscribeFromAllNotifications();
});
</script>

<template>
  <div class="admin-notifications-sent bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-muted-900 mb-4 text-3xl font-bold dark:text-white">
              اعلان‌های ارسال شده
            </h1>
            <p class="text-muted-500 dark:text-muted-400">
              مدیریت و مشاهده اعلان‌های ارسال شده
            </p>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <NuxtLink
              to="/admin/notifications"
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-2 space-x-reverse transition-colors"
            >
              <Icon name="ph:arrow-right" class="size-4" />
              <span>بازگشت به ارسال اعلان</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Stats Dashboard -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                کل اعلان‌ها
              </p>
              <p class="text-muted-900 text-2xl font-bold dark:text-white">
                {{ getNotificationStats?.total || 0 }}
              </p>
              <!-- Realtime status indicator -->
              <div class="mt-2 flex items-center gap-2">
                <div
                  class="size-1.5 rounded-full transition-all duration-300"
                  :class="isAdminRealtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
                />
                <span
                  class="text-xs"
                  :class="isAdminRealtimeConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ isAdminRealtimeConnected ? 'آنلاین' : 'آفلاین' }}
                </span>
              </div>
            </div>
            <div class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg">
              <Icon name="ph:bell" class="text-primary-600 dark:text-primary-400 size-6" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                خوانده نشده
              </p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ getNotificationStats?.unread || 0 }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Icon name="ph:bell-simple-ringing" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                نرخ خوانده شده
              </p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ getNotificationStats?.readPercentage || 0 }}%
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Icon name="ph:check-circle" class="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                فیلتر شده
              </p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ filteredNotifications.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="ph:funnel" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Panel -->
      <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 mb-8 rounded-xl border bg-white p-6">
        <div class="border-muted-200 dark:border-muted-700 mb-4 border-b pb-4">
          <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
            فیلتر اعلان‌ها
          </h3>
          <p class="text-muted-500 dark:text-muted-400 text-sm">
            برای جستجوی دقیق‌تر از فیلترهای زیر استفاده کنید
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <!-- Search Query -->
          <BaseInput
            v-model="searchQuery"
            placeholder="جستجو در عنوان یا پیام..."
            icon="ph:magnifying-glass"
          />

          <!-- Status Filter -->
          <BaseListbox
            v-model="statusFilter"
            placeholder="وضعیت خوانده شده"
            :items="statusOptions"
          />

          <!-- User Filter -->
          <div class="relative">
            <BaseListbox
              v-model="userFilter"
              placeholder="فیلتر بر اساس کاربر"
              :items="userOptions"
            />
            <div v-if="selectedUser" class="mt-2 flex items-center space-x-2 space-x-reverse">
              <BaseAvatar
                :src="getUserAvatarUrl(selectedUser)"
                :text="selectedUser.initials"
                size="xs"
              />
              <span class="text-muted-700 dark:text-muted-300 text-sm">
                {{ selectedUser.meta?.name || selectedUser.username }}
              </span>
              <button
                class="text-muted-400 hover:text-red-600 dark:hover:text-red-400"
                @click="clearUserFilter"
              >
                <Icon name="ph:x" class="size-3" />
              </button>
            </div>
          </div>

          <!-- Date Range Filter -->
          <div class="grid grid-cols-2 gap-2">
            <BaseInput
              v-model="fromDate"
              type="date"
              placeholder="از تاریخ"
              size="sm"
            />
            <BaseInput
              v-model="toDate"
              type="date"
              placeholder="تا تاریخ"
              size="sm"
            />
          </div>
        </div>

        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              class="text-muted-600 hover:text-muted-700 dark:text-muted-400 dark:hover:text-muted-300 flex items-center space-x-1 space-x-reverse text-sm transition-colors"
              @click="clearFilters"
            >
              <Icon name="ph:x-circle" class="size-4" />
              <span>پاک کردن فیلترها</span>
            </button>
          </div>
          <div class="text-muted-500 dark:text-muted-400 text-sm">
            {{ filteredNotifications.length }} از {{ allNotifications.length }} اعلان نمایش داده شده
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white">
        <!-- Filter Tabs -->
        <div class="border-muted-200 dark:border-muted-700 border-b p-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filter in [
                { key: 'all', label: 'همه', count: getNotificationFilterStats.all },
                { key: 'sent', label: 'ارسال شده', count: getNotificationFilterStats.sent },
                { key: 'scheduled-pending', label: 'زمان‌بندی شده', count: getNotificationFilterStats.scheduledPending },
                { key: 'scheduled-sent', label: 'زمان‌بندی ارسال شده', count: getNotificationFilterStats.scheduledSent }
              ]"
              :key="filter.key"
              :class="[
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                notificationFilter === filter.key
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-muted-600 hover:bg-muted-100 hover:text-muted-700 dark:text-muted-400 dark:hover:bg-muted-700 dark:hover:text-muted-300'
              ]"
              @click="notificationFilter = filter.key as NotificationFilter"
            >
              <span>{{ filter.label }}</span>
              <BaseBadge
                v-if="filter.count > 0"
                :color="notificationFilter === filter.key ? 'primary' : 'muted'"
                size="xs"
                variant="solid"
              >
                {{ filter.count }}
              </BaseBadge>
            </button>
          </div>
        </div>

        <!-- Notifications -->
        <div class="min-h-[400px] overflow-y-auto">
          <div v-if="isLoading" class="p-6">
            <div class="animate-pulse space-y-3">
              <div
                v-for="i in 5"
                :key="i"
                class="bg-muted-100 dark:bg-muted-700 h-16 rounded"
              />
            </div>
          </div>

          <div v-else-if="filteredNotifications.length === 0" class="p-6 text-center">
            <Icon name="ph:bell-slash" class="text-muted-400 mx-auto mb-3 size-12" />
            <p class="text-muted-500 dark:text-muted-400">
              {{ allNotifications.length === 0 ? 'هیچ اعلانی ارسال نشده است' : 'هیچ اعلانی با این فیلتر یافت نشد' }}
            </p>
          </div>

          <div v-else class="space-y-2 p-1 sm:space-y-3">
            <div
              v-for="notification in filteredNotifications"
              :key="(notification as any).id"
              class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-lg border bg-white p-3 transition-all duration-200 hover:shadow-md sm:p-4"
              :class="getNotificationScheduleStatus(notification).isScheduled ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''"
            >
              <!-- Header: Title, Type and Status -->
              <div class="mb-3 flex items-start justify-between">
                <div class="flex-1">
                  <div class="mb-2 flex items-center space-x-3 space-x-reverse">
                    <!-- Status Indicator -->
                    <div :class="`w-3 h-3 rounded-full ${(notification as any).is_read ? 'bg-green-500' : 'bg-orange-500'}`" />

                    <!-- Title -->
                    <h4 class="text-muted-900 text-sm font-semibold dark:text-white">
                      {{ (notification as any).title }}
                    </h4>

                    <!-- Schedule Status Badge -->
                    <BaseBadge
                      v-if="getNotificationScheduleStatus(notification).isScheduled"
                      color="info"
                      size="xs"
                      variant="pastel"
                    >
                      <Icon name="ph:clock" class="ml-1 size-3" />
                      زمان‌بندی شده
                    </BaseBadge>
                  </div>

                  <!-- Status Text -->
                  <div class="space-y-1">
                    <p class="text-xs" :class="(notification as any).is_read ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                      {{ (notification as any).is_read ? 'خوانده شده' : 'خوانده نشده' }}
                    </p>

                    <!-- Schedule Status Text -->
                    <div v-if="getNotificationScheduleStatus(notification).isScheduled" class="space-y-1">
                      <p
                        class="text-xs"
                        :class="getNotificationScheduleStatus(notification).isPending ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'"
                      >
                        <Icon name="ph:clock" class="ml-1 inline size-3" />
                        {{ getNotificationScheduleStatus(notification).statusText }}
                      </p>

                      <!-- Relative Time to Announce -->
                      <p
                        v-if="getNotificationScheduleStatus(notification).isPending"
                        class="text-xs font-medium text-orange-600 dark:text-orange-400"
                      >
                        <Icon name="ph:timer" class="ml-1 inline size-3" />
                        {{ getRelativeTimeToAnnounce((notification as any).announce_time) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <!-- Priority Badge -->
                  <BaseBadge
                    :color="(notification as any).priority === 'urgent' ? 'danger' : (notification as any).priority === 'high' ? 'warning' : 'muted'"
                    size="xs"
                    variant="pastel"
                  >
                    {{ (notification as any).priority === 'urgent' ? 'فوری' : (notification as any).priority === 'high' ? 'بالا' : (notification as any).priority === 'medium' ? 'متوسط' : 'کم' }}
                  </BaseBadge>

                  <!-- Delete Button -->
                  <button
                    class="text-muted-400 rounded-md p-1 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    @click="deleteNotification((notification as any).id)"
                  >
                    <Icon name="ph:trash" class="size-4" />
                  </button>
                </div>
              </div>

              <!-- Message -->
              <div class="mb-4">
                <p class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                  {{ (notification as any).message }}
                </p>
              </div>

              <!-- Sender and Recipient -->
              <div class="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-0">
                <!-- Sender -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <BaseAvatar
                    :src="getUserAvatarUrl((notification as any).expand?.user)"
                    :text="(notification as any).expand?.user?.meta?.name?.substring(0, 2) || 'س'"
                    size="xs"
                  />
                  <div>
                    <p class="text-muted-500 dark:text-muted-400 text-xs">
                      فرستنده:
                    </p>
                    <p class="text-muted-700 dark:text-muted-200 max-w-24 truncate text-xs font-medium sm:max-w-none">
                      {{ (notification as any).expand?.user?.meta?.name || (notification as any).expand?.user?.username || 'سیستم' }}
                    </p>
                  </div>
                </div>

                <!-- Arrow -->
                <Icon name="ph:arrow-left" class="text-muted-400 hidden size-4 md:block" />
                <Icon name="ph:arrow-down" class="text-muted-400 block size-4 md:hidden" />

                <!-- Recipient -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <BaseAvatar
                    :src="getUserAvatarUrl((notification as any).expand?.recipient_user_id)"
                    :text="(notification as any).expand?.recipient_user_id?.meta?.name?.substring(0, 2) || 'ک'"
                    size="xs"
                  />
                  <div>
                    <p class="text-muted-500 dark:text-muted-400 text-xs">
                      گیرنده:
                    </p>
                    <p class="text-muted-700 dark:text-muted-200 max-w-24 truncate text-xs font-medium sm:max-w-none">
                      {{ (notification as any).expand?.recipient_user_id?.meta?.name || (notification as any).expand?.recipient_user_id?.username || 'نامعلوم' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer: Date -->
              <div class="border-muted-100 dark:border-muted-700 mt-3 border-t pt-3">
                <div class="text-muted-400 flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
                  <div class="flex flex-col gap-1">
                    <!-- Created Date -->
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <Icon name="ph:calendar" class="size-3" />
                      <span>ایجاد شده:</span>
                      <span>{{ new Date((notification as any).created).toLocaleDateString('fa-IR') }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ new Date((notification as any).created).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>

                    <!-- Schedule Date if exists -->
                    <div
                      v-if="(notification as any).announce_time"
                      class="flex items-center space-x-2 space-x-reverse"
                      :class="getNotificationScheduleStatus(notification).isPending ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400'"
                    >
                      <Icon name="ph:clock" class="size-3" />
                      <span>{{ getNotificationScheduleStatus(notification).isPending ? 'زمان‌بندی:' : 'ارسال شده:' }}</span>
                      <span>{{ new Date((notification as any).announce_time).toLocaleDateString('fa-IR') }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ new Date((notification as any).announce_time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>
                  </div>

                  <!-- Action Button if exists -->
                  <div v-if="(notification as any).action_text && (notification as any).action_url" class="flex items-center space-x-1 space-x-reverse">
                    <Icon name="ph:link" class="size-3" />
                    <span>{{ (notification as any).action_text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .85;
  }
}
</style>
