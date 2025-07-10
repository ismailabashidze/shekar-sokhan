<script setup lang="ts">
import type { AdminNotificationForm, BulkSendOptions } from '~/composables/useAdminNotifications'

definePageMeta({
  title: 'مدیریت اعلان‌ها',
  layout: 'sidebar',
  middleware: 'admin',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'مدیریت اعلان‌ها - پنل ادمین - ذهنا',
})

const {
  fetchUsers,
  loadMoreUsers,
  fetchAllNotifications,
  sendBulkNotification,
  sendSystemNotification,
  deleteNotificationAdmin,
  getNotificationStats,
  getUsersByRole,
  searchUsers,
  debouncedSearch,
  clearSearch,
  subscribeToAllNotifications,
  unsubscribeFromAllNotifications,
  isLoading,
  isSending,
  isLoadingMore,
  isSearching,
  isAdminRealtimeConnected,
  allNotifications,
  users,
  searchResults,
  searchQuery,
  hasMoreUsers,
  totalUsers,
} = useAdminNotifications()

const { getUserAvatarUrl } = useAvatarManager()

// Form state
const showForm = ref(true)
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
})

const bulkOptions = ref<BulkSendOptions>({
  sendToAll: false,
  selectedRecipients: [],
  userRole: '',
})

// Local state
const selectedRole = ref('')
const showPreview = ref(false)
const localSearchQuery = ref('')

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
}

// Computed
const filteredUsers = computed(() => {
  // If searching, use search results
  if (localSearchQuery.value.trim()) {
    return searchResults.value.filter(u =>
      selectedRole.value ? u.role === selectedRole.value : true,
    )
  }

  // Otherwise use regular users list with role filter
  return users.value.filter(u =>
    selectedRole.value ? u.role === selectedRole.value : true,
  )
})

const displayedUsers = computed(() => {
  return filteredUsers.value
})

const canSend = computed(() => {
  return formData.value.title
    && formData.value.message
    && (bulkOptions.value.sendToAll || bulkOptions.value.selectedRecipients.length > 0)
})

const selectedUsersCount = computed(() => {
  if (bulkOptions.value.sendToAll) {
    if (selectedRole.value) {
      return getUsersByRole(selectedRole.value).length
    }
    return totalUsers.value || users.value.length
  }
  return bulkOptions.value.selectedRecipients.length
})

// Methods
const loadTemplate = (templateKey: keyof typeof systemTemplates) => {
  const template = systemTemplates[templateKey]
  formData.value = {
    ...formData.value,
    ...template,
  }
}

const toggleUserSelection = (userId: string) => {
  const index = bulkOptions.value.selectedRecipients.indexOf(userId)
  if (index > -1) {
    bulkOptions.value.selectedRecipients.splice(index, 1)
  }
  else {
    bulkOptions.value.selectedRecipients.push(userId)
  }
}

const selectAllUsers = () => {
  if (bulkOptions.value.selectedRecipients.length === displayedUsers.value.length) {
    // Deselect all
    bulkOptions.value.selectedRecipients = []
  }
  else {
    // Select all displayed users
    bulkOptions.value.selectedRecipients = displayedUsers.value.map(u => u.id)
  }
}

// Search handling
const handleSearch = (query: string) => {
  localSearchQuery.value = query
  if (query.trim()) {
    debouncedSearch(query, selectedRole.value)
  }
  else {
    clearSearch()
  }
}

// Infinite scroll for users list
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target

  // Check if scrolled to bottom
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (!localSearchQuery.value.trim()) {
      // Load more regular users
      loadMoreUsers(selectedRole.value)
    }
    // Note: For search results, we could implement search pagination if needed
  }
}

// Handle role change
const handleRoleChange = async (role: string) => {
  selectedRole.value = role
  bulkOptions.value.selectedRecipients = []

  if (localSearchQuery.value.trim()) {
    // Re-search with new role filter
    debouncedSearch(localSearchQuery.value, role)
  }
  else {
    // Reload users with role filter
    await fetchUsers(1, 20, role, true)
  }
}

const sendNotification = async () => {
  try {
    // Update bulk options with current selected role
    const options = {
      ...bulkOptions.value,
      userRole: selectedRole.value,
    }

    const sentCount = await sendBulkNotification(formData.value, options)

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
    }
    bulkOptions.value = {
      sendToAll: false,
      selectedRecipients: [],
      userRole: '',
    }
    selectedRole.value = ''
    localSearchQuery.value = ''
    clearSearch()

    // Refresh notifications list
    await fetchAllNotifications()

    // Show success message
    console.log(`اعلان با موفقیت برای ${sentCount} کاربر ارسال شد`)
  }
  catch (error) {
    console.error('خطا در ارسال اعلان:', error)
  }
}

const deleteNotification = async (notificationId: string) => {
  if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
    try {
      await deleteNotificationAdmin(notificationId)
      console.log('اعلان با موفقیت حذف شد')
    }
    catch (error) {
      console.error('خطا در حذف اعلان:', error)
    }
  }
}

// Initialize
onMounted(async () => {
  try {
    await Promise.all([
      fetchUsers(1, 20, '', true),
      fetchAllNotifications(),
      subscribeToAllNotifications(),
    ])
  }
  catch (error) {
    console.error('خطا در بارگذاری داده‌ها:', error)
  }
})

// Cleanup
onBeforeUnmount(() => {
  clearSearch()
  unsubscribeFromAllNotifications()
})
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
                {{ getNotificationStats.total }}
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
                {{ getNotificationStats.unread }}
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
                {{ getNotificationStats.readPercentage }}%
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
      <div class="grid grid-cols-1 gap-8 xl:grid-cols-5">
        <!-- Send Notification Form -->
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white xl:col-span-3">
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
                  :items="[
                    { label: 'اطلاعات', value: 'info' },
                    { label: 'موفقیت', value: 'success' },
                    { label: 'هشدار', value: 'warning' },
                    { label: 'خطا', value: 'error' },
                    { label: 'سیستم', value: 'system' }
                  ]"
                />

                <BaseListbox
                  v-model="formData.priority"
                  label="اولویت"
                  :items="[
                    { label: 'کم', value: 'low' },
                    { label: 'متوسط', value: 'medium' },
                    { label: 'زیاد', value: 'high' },
                    { label: 'فوری', value: 'urgent' }
                  ]"
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
                <p class="mt-1 text-xs text-muted-500 dark:text-muted-400">
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
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <BaseInput
                    v-model="formData.announce_time"
                    type="datetime-local"
                    label="زمان اعلان (اختیاری)"
                    placeholder="انتخاب زمان اعلان"
                  />
                  
                  <div class="flex items-end">
                    <BaseButton
                      v-if="formData.announce_time"
                      variant="outline"
                      size="sm"
                      color="warning"
                      class="w-full"
                      @click="formData.announce_time = ''"
                    >
                      <Icon name="ph:x" class="ml-2 size-4" />
                      حذف زمان‌بندی
                    </BaseButton>
                  </div>
                </div>
                
                <div class="mt-3">
                  <p class="text-muted-500 dark:text-muted-400 text-xs">
                    <Icon name="ph:info" class="ml-1 inline size-3" />
                    {{ formData.announce_time 
                      ? `اعلان در ${new Date(formData.announce_time).toLocaleString('fa-IR')} ارسال خواهد شد` 
                      : 'اگر زمان تعیین نکنید، اعلان بلافاصله ارسال می‌شود' 
                    }}
                  </p>
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
                  :items="[
                    { label: 'همه نقش‌ها', value: '' },
                    { label: 'کاربر عادی', value: 'user' },
                    { label: 'درمانگر', value: 'therapist' },
                    { label: 'ادمین', value: 'admin' }
                  ]"
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
                      :key="user.id"
                      class="border-muted-100 dark:border-muted-700 flex items-center justify-between border-b p-3 last:border-b-0"
                    >
                      <div class="flex items-center space-x-3 space-x-reverse">
                        <BaseCheckbox
                          :model-value="bulkOptions.selectedRecipients.includes(user.id)"
                          @update:model-value="toggleUserSelection(user.id)"
                        />
                        <BaseAvatar
                          :src="getUserAvatarUrl(user)"
                          :text="user.initials"
                          size="sm"
                        />
                        <div>
                          <p class="text-muted-900 text-sm font-medium dark:text-white">
                            {{ user.name || user.username || 'کاربر بدون نام' }}
                          </p>
                          <p class="text-muted-500 dark:text-muted-400 text-xs">
                            {{ user.email || 'ایمیل موجود نیست' }}
                          </p>
                          <p class="text-muted-400 dark:text-muted-500 text-xs">
                            @{{ user.username }}
                          </p>
                        </div>
                      </div>
                      <BaseBadge
                        v-if="user.role"
                        :color="user.role === 'admin' ? 'primary' : user.role === 'therapist' ? 'success' : 'muted'"
                        size="sm"
                      >
                        {{ user.role }}
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
                      <p class="text-muted-700 dark:text-muted-200 text-xs font-medium mb-2">محتوای کامل:</p>
                      <div 
                        class="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-600 rounded-lg p-3 text-sm text-muted-600 dark:text-muted-300 leading-relaxed prose prose-sm max-w-none"
                        v-html="formData.complete_message"
                      />
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

        <!-- Recent Notifications -->
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white xl:col-span-2">
          <div class="border-muted-200 dark:border-muted-700 border-b p-6">
            <h2 class="text-muted-900 text-xl font-semibold dark:text-white">
              اعلان‌های ارسال شده
            </h2>
          </div>

          <div class="h-[500px] overflow-y-auto xl:h-[600px]">
            <div v-if="isLoading" class="p-6">
              <div class="animate-pulse space-y-3">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="bg-muted-100 dark:bg-muted-700 h-16 rounded"
                />
              </div>
            </div>

            <div v-else-if="allNotifications.length === 0" class="p-6 text-center">
              <Icon name="ph:bell-slash" class="text-muted-400 mx-auto mb-3 size-12" />
              <p class="text-muted-500 dark:text-muted-400">
                هیچ اعلانی ارسال نشده است
              </p>
            </div>

            <div v-else class="space-y-2 p-1 sm:space-y-3">
              <div
                v-for="notification in allNotifications.slice(0, 10)"
                :key="notification.id"
                class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-lg border bg-white p-3 transition-all duration-200 hover:shadow-md sm:p-4"
              >
                <!-- Header: Title, Type and Status -->
                <div class="mb-3 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center space-x-3 space-x-reverse">
                      <!-- Status Indicator -->
                      <div :class="`w-3 h-3 rounded-full ${notification.is_read ? 'bg-green-500' : 'bg-orange-500'}`" />

                      <!-- Title -->
                      <h4 class="text-muted-900 text-sm font-semibold dark:text-white">
                        {{ notification.title }}
                      </h4>

                      <!-- Type Badge -->
                      <!-- <BaseBadge
                        :color="notification.type === 'info' ? 'primary' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'danger'"
                        size="xs"
                      >
                        {{ notification.type }}
                      </BaseBadge> -->
                    </div>

                    <!-- Status Text -->
                    <p class="text-xs" :class="notification.is_read ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                      {{ notification.is_read ? 'خوانده شده' : 'خوانده نشده' }}
                    </p>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <!-- Priority Badge -->
                    <BaseBadge
                      :color="notification.priority === 'urgent' ? 'danger' : notification.priority === 'high' ? 'warning' : 'muted'"
                      size="xs"
                      variant="pastel"
                    >
                      {{ notification.priority === 'urgent' ? 'فوری' : notification.priority === 'high' ? 'بالا' : notification.priority === 'medium' ? 'متوسط' : 'کم' }}
                    </BaseBadge>

                    <!-- Delete Button -->
                    <button
                      class="text-muted-400 rounded-md p-1 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      @click="deleteNotification(notification.id)"
                    >
                      <Icon name="ph:trash" class="size-4" />
                    </button>
                  </div>
                </div>

                <!-- Message -->
                <div class="mb-4">
                  <p class="text-muted-600 dark:text-muted-300 text-sm leading-relaxed">
                    {{ notification.message }}
                  </p>
                </div>

                <!-- Sender and Recipient -->
                <div class="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-0">
                  <!-- Sender -->
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <BaseAvatar
                      :src="getUserAvatarUrl(notification.expand?.user)"
                      :text="notification.expand?.user?.meta?.name?.substring(0, 2) || 'س'"
                      size="xs"
                    />
                    <div>
                      <p class="text-muted-500 dark:text-muted-400 text-xs">
                        فرستنده:
                      </p>
                      <p class="text-muted-700 dark:text-muted-200 max-w-24 truncate text-xs font-medium sm:max-w-none">
                        {{ notification.expand?.user?.meta?.name || notification.expand?.user?.username || 'سیستم' }}
                      </p>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <Icon name="ph:arrow-left" class="text-muted-400 hidden size-4 md:block" />
                  <Icon name="ph:arrow-down" class="text-muted-400 block size-4 md:hidden" />

                  <!-- Recipient -->
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <BaseAvatar
                      :src="getUserAvatarUrl(notification.expand?.recipient_user_id)"
                      :text="notification.expand?.recipient_user_id?.meta?.name?.substring(0, 2) || 'ک'"
                      size="xs"
                    />
                    <div>
                      <p class="text-muted-500 dark:text-muted-400 text-xs">
                        گیرنده:
                      </p>
                      <p class="text-muted-700 dark:text-muted-200 max-w-24 truncate text-xs font-medium sm:max-w-none">
                        {{ notification.expand?.recipient_user_id?.meta?.name || notification.expand?.recipient_user_id?.username || 'نامعلوم' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Footer: Date -->
                <div class="border-muted-100 dark:border-muted-700 mt-3 border-t pt-3">
                  <div class="text-muted-400 flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <Icon name="ph:calendar" class="size-3" />
                      <span>{{ new Date(notification.created).toLocaleDateString('fa-IR') }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ new Date(notification.created).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>

                    <!-- Action Button if exists -->
                    <div v-if="notification.action_text && notification.action_url" class="flex items-center space-x-1 space-x-reverse">
                      <Icon name="ph:link" class="size-3" />
                      <span>{{ notification.action_text }}</span>
                    </div>
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
