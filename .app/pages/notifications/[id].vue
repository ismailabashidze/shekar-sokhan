<script setup lang="ts">
definePageMeta({
  title: 'جزئیات اعلان',
  layout: 'sidebar',
})

const route = useRoute()
const router = useRouter()
const notificationId = route.params.id as string

const {
  notifications,
  markAsRead,
  markAsUnread,
  deleteNotification,
  getRelativeTime,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
  fetchNotifications,
} = useNotifications()

// Find notification by ID
const notification = computed(() => {
  return notifications.value.find(n => n.id === notificationId)
})

const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch notification if not found in current list
onMounted(async () => {
  try {
    if (!notification.value) {
      // If notification not found in current list, fetch all notifications
      await fetchNotifications()
    }
    
    if (!notification.value) {
      error.value = 'اعلان یافت نشد'
      return
    }

    // Mark as read if unread
    if (!notification.value.isRead) {
      await markAsRead(notificationId)
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در بارگذاری اعلان'
  } finally {
    isLoading.value = false
  }
})

useHead(() => ({
  htmlAttrs: { dir: 'rtl' },
  title: notification.value?.title ? `${notification.value.title} - جزئیات اعلان - ذهنا` : 'جزئیات اعلان - ذهنا',
}))

const handleMarkAsRead = async () => {
  if (notification.value && !notification.value.isRead) {
    await markAsRead(notification.value.id)
  }
}

const handleMarkAsUnread = async () => {
  if (notification.value && notification.value.isRead) {
    await markAsUnread(notification.value.id)
  }
}

const handleDelete = async () => {
  if (notification.value) {
    await deleteNotification(notification.value.id)
    await router.push('/notifications')
  }
}

const handleBack = () => {
  router.back()
}

const handleAction = () => {
  if (notification.value?.actionUrl) {
    navigateTo(notification.value.actionUrl)
  }
}
</script>

<template>
  <div class="notification-detail-page bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-4xl px-3 sm:px-4 py-4 sm:py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <p class="text-muted-500 dark:text-muted-400">در حال بارگذاری...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <Icon name="lucide:alert-circle" class="mx-auto mb-4 size-12 text-red-500" />
          <h2 class="mb-2 text-xl font-semibold text-muted-900 dark:text-white">خطا در بارگذاری</h2>
          <p class="mb-4 text-muted-500 dark:text-muted-400">{{ error }}</p>
          <BaseButton @click="handleBack" color="primary" variant="outline">
            بازگشت
          </BaseButton>
        </div>
      </div>

      <!-- Notification Detail -->
      <div v-else-if="notification" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <BaseButton
            @click="handleBack"
            variant="pastel"
            color="muted"
            class="shrink-0"
          >
            <Icon name="lucide:arrow-right" class="size-4" />
            <span class="mr-2">بازگشت</span>
          </BaseButton>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Mark as read/unread -->
            <BaseButton
              v-if="!notification.isRead"
              @click="handleMarkAsRead"
              variant="pastel"
              color="success"
              size="sm"
            >
              <Icon name="lucide:check" class="size-4" />
              <span class="mr-1 hidden sm:inline">علامت‌گذاری به عنوان خوانده شده</span>
            </BaseButton>
            
            <BaseButton
              v-else
              @click="handleMarkAsUnread"
              variant="pastel"
              color="muted"
              size="sm"
            >
              <Icon name="lucide:mail" class="size-4" />
              <span class="mr-1 hidden sm:inline">علامت‌گذاری به عنوان خوانده نشده</span>
            </BaseButton>

            <!-- Delete -->
            <BaseButton
              @click="handleDelete"
              variant="pastel"
              color="danger"
              size="sm"
            >
              <Icon name="lucide:trash-2" class="size-4" />
              <span class="mr-1 hidden sm:inline">حذف</span>
            </BaseButton>
          </div>
        </div>

        <!-- Notification Card -->
        <div class="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-muted-800">
          <!-- Header -->
          <div class="border-b border-muted-200 p-6 dark:border-muted-700">
            <div class="flex items-start gap-4">
              <!-- Type Icon -->
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl"
                :class="`bg-${getTypeColor(notification.type)}-100 dark:bg-${getTypeColor(notification.type)}-900/20`"
              >
                <Icon
                  :name="getTypeIcon(notification.type)"
                  class="size-6"
                  :class="`text-${getTypeColor(notification.type)}-600 dark:text-${getTypeColor(notification.type)}-400`"
                />
              </div>

              <div class="flex-1 min-w-0">
                <!-- Title and Priority -->
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-xl font-semibold text-muted-900 dark:text-white">
                    {{ notification.title }}
                  </h1>
                  
                  <!-- Priority Badge -->
                  <div
                    class="rounded-full px-2 py-1 text-xs font-medium"
                    :class="`bg-${getPriorityColor(notification.priority)}-100 text-${getPriorityColor(notification.priority)}-600 dark:bg-${getPriorityColor(notification.priority)}-900/20 dark:text-${getPriorityColor(notification.priority)}-400`"
                  >
                    {{ notification.priority === 'urgent' ? 'فوری' : 
                       notification.priority === 'high' ? 'بالا' :
                       notification.priority === 'medium' ? 'متوسط' : 'پایین' }}
                  </div>

                  <!-- Read Status -->
                  <div
                    v-if="!notification.isRead"
                    class="size-3 rounded-full bg-primary-500"
                  />
                </div>

                <!-- Meta Information -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-muted-500 dark:text-muted-400">
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:clock" class="size-4" />
                    <span>{{ getRelativeTime(notification.createdAt) }}</span>
                  </div>
                  
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:tag" class="size-4" />
                    <span>{{ notification.type === 'info' ? 'اطلاعیه' :
                             notification.type === 'success' ? 'موفقیت' :
                             notification.type === 'warning' ? 'هشدار' :
                             notification.type === 'error' ? 'خطا' : 'سیستمی' }}</span>
                  </div>

                  <div v-if="notification.user" class="flex items-center gap-1">
                    <Icon name="lucide:user" class="size-4" />
                    <span>{{ notification.user.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Short Message -->
            <div class="mb-6">
              <h2 class="mb-3 text-lg font-medium text-muted-900 dark:text-white">
                خلاصه پیام
              </h2>
              <p class="text-muted-600 dark:text-muted-300 leading-relaxed">
                {{ notification.message }}
              </p>
            </div>

            <!-- Complete Message (Rich Content) -->
            <div v-if="notification.completeMessage" class="mb-6">
              <h2 class="mb-3 text-lg font-medium text-muted-900 dark:text-white">
                محتوای کامل
              </h2>
              <div 
                class="prose prose-sm max-w-none dark:prose-invert"
                v-html="notification.completeMessage"
              />
            </div>

            <!-- Action Button -->
            <div v-if="notification.actionUrl && notification.actionText" class="pt-4">
              <BaseButton
                @click="handleAction"
                color="primary"
                class="w-full sm:w-auto"
              >
                <Icon name="lucide:external-link" class="size-4" />
                <span class="mr-2">{{ notification.actionText }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <Icon name="lucide:search-x" class="mx-auto mb-4 size-12 text-muted-400" />
          <h2 class="mb-2 text-xl font-semibold text-muted-900 dark:text-white">اعلان یافت نشد</h2>
          <p class="mb-4 text-muted-500 dark:text-muted-400">اعلان مورد نظر یافت نشد یا ممکن است حذف شده باشد.</p>
          <BaseButton @click="handleBack" color="primary" variant="outline">
            بازگشت به صفحه اعلان‌ها
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Rich content styling */
.prose {
  color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: inherit;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin: 1rem 0;
  padding-right: 1.5rem;
}

.prose blockquote {
  border-right: 4px solid #e5e7eb;
  padding-right: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.dark .prose blockquote {
  border-right-color: #374151;
}

.prose a {
  color: rgb(59, 130, 246);
  text-decoration: underline;
}

.prose a:hover {
  color: rgb(37, 99, 235);
}

.dark .prose a {
  color: rgb(96, 165, 250);
}

.dark .prose a:hover {
  color: rgb(147, 197, 253);
}
</style> 