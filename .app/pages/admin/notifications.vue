<script setup lang="ts">
import type { AdminNotificationForm, BulkSendOptions } from '~/composables/useAdminNotifications';
import { persianDateTimeToISO, isoToPersianDateTime, getRelativeTimeToAnnounce, formatPersianDate } from '~/utils/persian-date';
import PersianCalendar from '~/components/PersianCalendar.vue';

definePageMeta({
  title: 'مدیریت اعلان‌ها',
  layout: 'zone',
  // Using global middlewares only
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'مدیریت اعلان‌ها - پنل ادمین - ذهنا',
});

const {
  fetchUsers,
  loadMoreUsers,
  sendBulkNotification,
  getNotificationStats,
  getUsersByRole,
  searchUsers,
  debouncedSearch,
  clearSearch,
  isLoading,
  isSending,
  isLoadingMore,
  isSearching,
  users,
  searchResults,
  searchQuery,
  hasMoreUsers,
  totalUsers,
} = useAdminNotifications();

const { getUserAvatarUrl } = useAvatarManager();

// Form state
const showForm = ref(true);
const formData = ref<AdminNotificationForm>({
  title: '',
  message: '',
  complete_message: '',
  type: 'info',
  priority: 'medium',
  action_url: '',
  action_text: '',
  user_id: '',
  announce_time: '',
});

// Persian calendar state
const announcePersianDate = ref('');
const announceTime = ref('');

// Computed property to sync Persian date/time with ISO announce_time
const announceTimeISO = computed({
  get: () => formData.value.announce_time || '',
  set: (value: string) => {
    formData.value.announce_time = value;
  },
});

// Watch for changes in Persian date/time and update ISO format
watch([announcePersianDate, announceTime], ([persianDate, time]) => {
  if (persianDate && time) {
    formData.value.announce_time = persianDateTimeToISO(persianDate, time);
  }
  else if (persianDate) {
    // Default to current time if no time is provided
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    formData.value.announce_time = persianDateTimeToISO(persianDate, currentTime);
  }
  else {
    formData.value.announce_time = '';
  }
});

// Watch for changes in ISO announce_time and update Persian date/time
watch(() => formData.value.announce_time, (isoString) => {
  if (isoString) {
    const { persianDate, time } = isoToPersianDateTime(isoString);
    announcePersianDate.value = persianDate;
    announceTime.value = time;
  }
  else {
    announcePersianDate.value = '';
    announceTime.value = '';
  }
}, { immediate: true });

const bulkOptions = ref<BulkSendOptions>({
  sendToAll: false,
  selectedRecipients: [],
  userRole: '',
});

// Local state
const selectedRole = ref('');
const showPreview = ref(false);
const localSearchQuery = ref('');

// System templates
const systemTemplates = {
  welcome: {
    title: 'خوش آمدگویی',
    message: 'به پلتفرم ذهنا خوش آمدید! امیدواریم تجربه خوبی داشته باشید.',
    type: 'success' as const,
    priority: 'medium' as const,
  },
  reminder: {
    title: 'یادآوری',
    message: 'یادآوری: لطفاً پروفایل خود را تکمیل کنید.',
    type: 'info' as const,
    priority: 'low' as const,
  },
  warning: {
    title: 'هشدار امنیتی',
    message: 'ورود مشکوک به حساب کاربری شما تشخیص داده شد.',
    type: 'warning' as const,
    priority: 'high' as const,
  },
  maintenance: {
    title: 'تعمیرات سیستم',
    message: 'سیستم برای تعمیرات روتین موقتاً در دسترس نخواهد بود.',
    type: 'error' as const,
    priority: 'urgent' as const,
  },
};

// Computed
const filteredUsers = computed(() => {
  // If searching, use search results
  if (localSearchQuery.value.trim()) {
    return searchResults.value.filter((u: any) =>
      selectedRole.value ? u.role === selectedRole.value : true,
    );
  }

  // Otherwise use regular users list with role filter
  return users.value.filter((u: any) =>
    selectedRole.value ? u.role === selectedRole.value : true,
  );
});

const displayedUsers = computed(() => {
  return filteredUsers.value;
});

const canSend = computed(() => {
  return formData.value.title
    && formData.value.message
    && (bulkOptions.value.sendToAll || bulkOptions.value.selectedRecipients.length > 0);
});

const selectedUsersCount = computed(() => {
  if (bulkOptions.value.sendToAll) {
    if (selectedRole.value) {
      return getUsersByRole(selectedRole.value).length;
    }
    return totalUsers.value || users.value.length;
  }
  return bulkOptions.value.selectedRecipients.length;
});

// Methods
const loadTemplate = (templateKey: keyof typeof systemTemplates) => {
  const template = systemTemplates[templateKey];
  formData.value = {
    ...formData.value,
    ...template,
  };
};

const toggleUserSelection = (userId: string) => {
  const index = bulkOptions.value.selectedRecipients.indexOf(userId);
  if (index > -1) {
    bulkOptions.value.selectedRecipients.splice(index, 1);
  }
  else {
    bulkOptions.value.selectedRecipients.push(userId);
  }
};

const selectAllUsers = () => {
  if (bulkOptions.value.selectedRecipients.length === displayedUsers.value.length) {
    // Deselect all
    bulkOptions.value.selectedRecipients = [];
  }
  else {
    // Select all displayed users
    bulkOptions.value.selectedRecipients = displayedUsers.value.map((u: any) => u.id);
  }
};

// Search handling
const handleSearch = (query: string | number | undefined) => {
  const queryValue = String(query || '');
  localSearchQuery.value = queryValue;
  if (queryValue.trim()) {
    debouncedSearch(queryValue, selectedRole.value);
  }
  else {
    clearSearch();
  }
};

// Infinite scroll for users list
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  // Check if scrolled to bottom and load more regular users (not search results)
  if (scrollTop + clientHeight >= scrollHeight - 10 && !localSearchQuery.value.trim()) {
    // Load more regular users
    loadMoreUsers(selectedRole.value);
    // Note: For search results, we could implement search pagination if needed
  }
};

// Handle role change
const handleRoleChange = async (role: string | string[] | undefined) => {
  const roleValue = Array.isArray(role) ? role[0] : role || '';
  selectedRole.value = roleValue;
  bulkOptions.value.selectedRecipients = [];

  if (localSearchQuery.value.trim()) {
    // Re-search with new role filter
    debouncedSearch(localSearchQuery.value, roleValue);
  }
  else {
    // Reload users with role filter
    await fetchUsers(1, 20, roleValue, true);
  }
};

const sendNotification = async () => {
  try {
    // Update bulk options with current selected role
    const options = {
      ...bulkOptions.value,
      userRole: selectedRole.value,
    };

    const sentCount = await sendBulkNotification(formData.value, options);

    // Reset form
    formData.value = {
      title: '',
      message: '',
      complete_message: '',
      type: 'info',
      priority: 'medium',
      action_url: '',
      action_text: '',
      user_id: '',
      announce_time: '',
    };

    // Reset Persian calendar state
    announcePersianDate.value = '';
    announceTime.value = '';
    bulkOptions.value = {
      sendToAll: false,
      selectedRecipients: [],
      userRole: '',
    };
    selectedRole.value = '';
    localSearchQuery.value = '';
    clearSearch();

    // Show success message
    console.log(`اعلان با موفقیت برای ${sentCount} کاربر ارسال شد`);
  }
  catch (error) {
    console.error('خطا در ارسال اعلان:', error);
  }
};

// Initialize
onMounted(async () => {
  try {
    await fetchUsers(1, 20, '', true);
  }
  catch (error) {
    console.error('خطا در بارگذاری داده‌ها:', error);
  }
});

// Cleanup
onBeforeUnmount(() => {
  clearSearch();
});

interface NotificationTypeOption {
  label: string;
  value: 'info' | 'success' | 'warning' | 'error' | 'system';
}

interface NotificationPriorityOption {
  label: string;
  value: 'low' | 'medium' | 'high' | 'urgent';
}

interface RoleOption {
  label: string;
  value: string;
}

const notificationTypeOptions: NotificationTypeOption[] = [
  { label: 'اطلاعات', value: 'info' },
  { label: 'موفقیت', value: 'success' },
  { label: 'هشدار', value: 'warning' },
  { label: 'خطا', value: 'error' },
  { label: 'سیستم', value: 'system' },
];

const notificationPriorityOptions: NotificationPriorityOption[] = [
  { label: 'کم', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'زیاد', value: 'high' },
  { label: 'فوری', value: 'urgent' },
];

const roleOptions: RoleOption[] = [
  { label: 'همه نقش‌ها', value: '' },
  { label: 'کاربر عادی', value: 'user' },
  { label: 'درمانگر', value: 'therapist' },
  { label: 'ادمین', value: 'admin' },
];
</script>

<template>
  <div class="admin-notifications bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-muted-900 mb-4 text-3xl font-bold dark:text-white">
          مدیریت اعلان‌ها
        </h1>
        <p class="text-muted-500 dark:text-muted-400">
          ارسال اعلان‌های گروهی و مدیریت اعلان‌های سیستم
        </p>
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
                  :class="'bg-muted-500'"
                />
                <span class="text-muted-600 dark:text-muted-400 text-xs">
                  محلی
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
                تعداد کاربران
              </p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ totalUsers || users.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="ph:users" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 gap-8">
        <!-- Send Notification Form -->
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white">
          <div class="border-muted-200 dark:border-muted-700 border-b p-6">
            <h2 class="text-muted-900 text-xl font-semibold dark:text-white">
              ارسال اعلان جدید
            </h2>
          </div>

          <div class="space-y-6 p-6">
            <!-- System Templates -->
            <div>
              <label class="text-muted-700 dark:text-muted-300 mb-3 block text-sm font-medium">
                قالب‌های آماده
              </label>
              <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
                <button
                  v-for="(template, key) in systemTemplates"
                  :key="key"
                  class="bg-muted-100 dark:bg-muted-700 hover:bg-muted-200 dark:hover:bg-muted-600 text-muted-700 dark:text-muted-300 rounded-lg px-3 py-2 text-xs transition-colors"
                  @click="loadTemplate(key as keyof typeof systemTemplates)"
                >
                  {{ template.title }}
                </button>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BaseInput
                v-model="formData.title"
                label="عنوان اعلان"
                placeholder="عنوان اعلان را وارد کنید"
                required
              />

              <div class="grid grid-cols-2 gap-2">
                <BaseListbox
                  v-model="formData.type"
                  label="نوع"
                  :items="notificationTypeOptions"
                />

                <BaseListbox
                  v-model="formData.priority"
                  label="اولویت"
                  :items="notificationPriorityOptions"
                />
              </div>
            </div>

            <BaseTextarea
              v-model="formData.message"
              label="متن پیام"
              placeholder="متن اعلان را وارد کنید..."
              rows="4"
              required
            />

            <BaseRichEditor
              v-model="formData.complete_message"
              label="محتوای کامل (اختیاری)"
              placeholder="محتوای کامل rich editor - اگر این فیلد پر شود، دکمه 'بیشتر بخوانید' نمایش داده می‌شود"
              height="250px"
            >
              <template #help>
                <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
                  از toolbar بالا برای فرمت‌دهی متن استفاده کنید. این محتوا در صفحه جزئیات اعلان نمایش داده می‌شود.
                </p>
              </template>
            </BaseRichEditor>

            <!-- Action Button Settings -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BaseInput
                v-model="formData.action_url"
                label="لینک عملیات (اختیاری)"
                placeholder="https://example.com"
              />

              <BaseInput
                v-model="formData.action_text"
                label="متن دکمه (اختیاری)"
                placeholder="مشاهده بیشتر"
              />
            </div>

            <!-- Scheduling Settings -->
            <div class="space-y-4">
              <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
                زمان‌بندی اعلان
              </label>

              <div class="bg-muted-50 dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-lg border p-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <!-- Persian Date Picker -->
                  <PersianCalendar
                    v-model="announcePersianDate"
                    label="تاریخ اعلان (اختیاری)"
                    placeholder="انتخاب تاریخ"
                    clearable
                  />

                  <!-- Time Picker -->
                  <BaseInput
                    v-model="announceTime"
                    type="time"
                    label="ساعت اعلان"
                    placeholder="00:00"
                    :disabled="!announcePersianDate"
                  />

                  <!-- Clear Button -->
                  <div class="flex items-end">
                    <BaseButton
                      v-if="formData.announce_time"
                      variant="outline"
                      size="sm"
                      color="warning"
                      class="w-full"
                      @click="() => {
                        formData.announce_time = '';
                        announcePersianDate = '';
                        announceTime = '';
                      }"
                    >
                      <Icon name="ph:x" class="ml-2 size-4" />
                      حذف زمان‌بندی
                    </BaseButton>
                  </div>
                </div>

                <!-- Schedule Info -->
                <div class="mt-4 space-y-2">
                  <div v-if="formData.announce_time" class="text-xs">
                    <div class="text-muted-600 dark:text-muted-300 mb-2">
                      <Icon name="ph:info" class="ml-1 inline size-3" />
                      زمان‌بندی اعلان:
                    </div>

                    <div class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 rounded-lg border p-3">
                      <div class="flex items-center justify-between">
                        <div class="space-y-1">
                          <div class="text-primary-700 dark:text-primary-300 font-medium">
                            📅 {{ formatPersianDate(announcePersianDate) }}
                          </div>
                          <div class="text-primary-600 dark:text-primary-400">
                            🕐 ساعت {{ announceTime || '00:00' }}
                          </div>
                        </div>

                        <div class="text-left">
                          <div class="text-primary-700 dark:text-primary-300 font-semibold">
                            {{ getRelativeTimeToAnnounce(formData.announce_time) }}
                          </div>
                          <div class="text-primary-500 dark:text-primary-400 text-xs">
                            {{ new Date(formData.announce_time).toLocaleString('fa-IR') }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-muted-500 dark:text-muted-400 text-xs">
                    <Icon name="ph:info" class="ml-1 inline size-3" />
                    اگر زمان تعیین نکنید، اعلان بلافاصله ارسال می‌شود
                  </div>
                </div>
              </div>
            </div>

            <!-- Recipients -->
            <div class="space-y-4">
              <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
                گیرندگان
              </label>

              <div class="flex flex-wrap gap-4">
                <label class="flex items-center space-x-2 space-x-reverse">
                  <BaseCheckbox v-model="bulkOptions.sendToAll" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm">ارسال به همه کاربران</span>
                </label>

                <BaseListbox
                  v-model="selectedRole"
                  placeholder="فیلتر بر اساس نقش"
                  :items="roleOptions"
                  class="w-40"
                  @update:model-value="handleRoleChange"
                />
              </div>

              <div v-if="!bulkOptions.sendToAll" class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="text-muted-600 dark:text-muted-400 text-sm">
                    <span>{{ bulkOptions.selectedRecipients.length }} کاربر انتخاب شده</span>
                    <span v-if="localSearchQuery.trim()" class="mr-2">
                      ({{ displayedUsers.length }} نتیجه جستجو)
                    </span>
                    <span v-else-if="totalUsers > 0" class="mr-2">
                      ({{ users.length }} از {{ totalUsers }} کاربر)
                    </span>
                  </div>
                  <button
                    class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                    @click="selectAllUsers"
                  >
                    {{ bulkOptions.selectedRecipients.length === displayedUsers.length ? 'لغو انتخاب همه' : 'انتخاب همه' }}
                  </button>
                </div>

                <BaseInput
                  v-model="localSearchQuery"
                  placeholder="جستجوی کاربران..."
                  icon="ph:magnifying-glass"
                  :loading="isSearching"
                  @update:model-value="handleSearch"
                />

                <div
                  class="border-muted-200 dark:border-muted-700 max-h-48 overflow-y-auto rounded-lg border"
                  @scroll="handleScroll"
                >
                  <div v-if="isLoading && !isLoadingMore" class="p-4 text-center">
                    <p class="text-muted-500 dark:text-muted-400 text-sm">
                      در حال بارگذاری کاربران...
                    </p>
                  </div>

                  <div v-else-if="displayedUsers.length === 0 && !isSearching" class="p-4 text-center">
                    <p class="text-muted-500 dark:text-muted-400 text-sm">
                      {{ localSearchQuery.trim() ? 'نتیجه‌ای یافت نشد' : 'هیچ کاربری یافت نشد' }}
                    </p>
                  </div>

                  <template v-else>
                    <div
                      v-for="user in displayedUsers"
                      :key="(user as any).id"
                      class="border-muted-100 dark:border-muted-700 flex items-center justify-between border-b p-3 last:border-b-0"
                    >
                      <div class="flex items-center space-x-3 space-x-reverse">
                        <BaseCheckbox
                          :model-value="bulkOptions.selectedRecipients.includes((user as any).id)"
                          @update:model-value="toggleUserSelection((user as any).id)"
                        />
                        <BaseAvatar
                          :src="getUserAvatarUrl(user as any)"
                          :text="(user as any).initials"
                          size="sm"
                        />
                        <div>
                          <p class="text-muted-900 text-sm font-medium dark:text-white">
                            {{ (user as any).name || (user as any).username || 'کاربر بدون نام' }}
                          </p>
                          <p class="text-muted-500 dark:text-muted-400 text-xs">
                            {{ (user as any).email || 'ایمیل موجود نیست' }}
                          </p>
                          <p class="text-muted-400 dark:text-muted-500 text-xs">
                            @{{ (user as any).username }}
                          </p>
                        </div>
                      </div>
                      <BaseBadge
                        v-if="(user as any).role"
                        :color="(user as any).role === 'admin' ? 'primary' : (user as any).role === 'therapist' ? 'success' : 'muted'"
                        size="sm"
                      >
                        {{ (user as any).role }}
                      </BaseBadge>
                    </div>

                    <!-- Load more indicator -->
                    <div v-if="isLoadingMore" class="border-muted-100 dark:border-muted-700 border-t p-3 text-center">
                      <p class="text-muted-500 dark:text-muted-400 text-xs">
                        در حال بارگذاری کاربران بیشتر...
                      </p>
                    </div>

                    <!-- End of list indicator -->
                    <div v-else-if="!hasMoreUsers && !localSearchQuery.trim() && displayedUsers.length > 0" class="border-muted-100 dark:border-muted-700 border-t p-2 text-center">
                      <p class="text-muted-400 dark:text-muted-500 text-xs">
                        تمام کاربران نمایش داده شدند
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div v-if="formData.title && formData.message" class="space-y-3">
              <button
                class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1 space-x-reverse text-sm"
                @click="showPreview = !showPreview"
              >
                <Icon name="ph:eye" class="size-4" />
                <span>{{ showPreview ? 'مخفی کردن' : 'پیش‌نمایش' }}</span>
              </button>

              <div v-if="showPreview" class="bg-muted-50 dark:bg-muted-700 rounded-lg border p-4">
                <div class="flex items-start space-x-3 space-x-reverse">
                  <div :class="`w-2 h-2 rounded-full mt-2 bg-${formData.type === 'info' ? 'blue' : formData.type === 'success' ? 'green' : formData.type === 'warning' ? 'orange' : 'red'}-500`" />
                  <div class="flex-1">
                    <h4 class="text-muted-900 mb-1 font-medium dark:text-white">
                      {{ formData.title }}
                    </h4>
                    <p class="text-muted-600 dark:text-muted-300 mb-3 text-sm">
                      {{ formData.message }}
                    </p>

                    <div v-if="formData.complete_message" class="mb-3">
                      <p class="text-muted-700 dark:text-muted-200 mb-2 text-xs font-medium">
                        محتوای کامل:
                      </p>
                      <div
                        class="dark:bg-muted-800 border-muted-200 dark:border-muted-600 text-muted-600 dark:text-muted-300 prose prose-sm max-w-none rounded-lg border bg-white p-3 text-sm leading-relaxed"
                        v-html="formData.complete_message"
                      />
                      <!-- v-html is safe here as it's coming from controlled rich editor input -->
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                      <button v-if="formData.complete_message" class="bg-info-100 dark:bg-info-900 text-info-700 dark:text-info-300 rounded px-2 py-1 text-xs">
                        بیشتر بخوانید
                      </button>
                      <button v-if="formData.action_text" class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded px-2 py-1 text-xs">
                        {{ formData.action_text }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Send Button -->
            <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-t pt-4">
              <p class="text-muted-600 dark:text-muted-400 text-sm">
                ارسال برای {{ selectedUsersCount }} کاربر
              </p>
              <BaseButton
                :disabled="!canSend || isSending"
                :loading="isSending"
                color="primary"
                @click="sendNotification"
              >
                {{ isSending ? 'در حال ارسال...' : 'ارسال اعلان' }}
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <Icon name="ph:list" class="text-muted-500 size-5" />
              <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
                مدیریت اعلان‌ها
              </h3>
            </div>
            <NuxtLink
              to="/admin/sent"
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-2 space-x-reverse transition-colors"
            >
              <Icon name="ph:arrow-left" class="size-4" />
              <span>مشاهده اعلان‌های ارسال شده</span>
            </NuxtLink>
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
