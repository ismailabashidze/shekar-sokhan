<script setup lang="ts">
const {
  isSupported,
  permission,
  isSubscribed,
  isLoading,
  error,
  requestPermission,
  subscribeToPush,
  unsubscribeFromPush,
  testNotification,
  checkSubscriptionStatus,
} = usePwaNotifications();

// Local state
const showSettings = ref(false);
const isTestingNotification = ref(false);

// Computed
const canEnableNotifications = computed(() => {
  return isSupported.value && permission.value !== 'denied';
});

const notificationStatusText = computed(() => {
  if (!isSupported.value) {
    return 'مرورگر شما از اعلان‌های فوری پشتیبانی نمی‌کند';
  }

  switch (permission.value) {
    case 'granted':
      return isSubscribed.value ? 'اعلان‌های فوری فعال است' : 'مجوز داده شده، در حال فعال‌سازی...';
    case 'denied':
      return 'دسترسی به اعلان‌ها رد شده. از تنظیمات مرورگر فعال کنید.';
    default:
      return 'برای دریافت اعلان‌های فوری، مجوز لازم است';
  }
});

const statusColor = computed(() => {
  if (!isSupported.value || permission.value === 'denied') return 'danger';
  if (permission.value === 'granted' && isSubscribed.value) return 'success';
  return 'warning';
});

// Methods
const handleEnableNotifications = async () => {
  const success = await requestPermission();
  if (success) {
    // Optional: Show success message
    console.log('اعلان‌های فوری فعال شد');
  }
};

const handleDisableNotifications = async () => {
  const success = await unsubscribeFromPush();
  if (success) {
    console.log('اعلان‌های فوری غیرفعال شد');
  }
};

const handleTestNotification = async () => {
  isTestingNotification.value = true;
  try {
    await testNotification();
  }
  finally {
    isTestingNotification.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  checkSubscriptionStatus();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Status Card -->
    <BaseCard class="p-4">
      <div class="flex items-start gap-4">
        <!-- Status Icon -->
        <div class="shrink-0">
          <div
            class="flex size-10 items-center justify-center rounded-lg shadow-sm"
            :class="[
              statusColor === 'success' ? 'from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/30 bg-gradient-to-br' :
              statusColor === 'warning' ? 'from-warning-100 to-warning-200 dark:from-warning-900/20 dark:to-warning-800/30 bg-gradient-to-br' :
              'from-danger-100 to-danger-200 dark:from-danger-900/20 dark:to-danger-800/30 bg-gradient-to-br'
            ]"
          >
            <Icon
              :name="
                statusColor === 'success' ? 'ph:bell' :
                statusColor === 'warning' ? 'ph:bell-slash' :
                'ph:bell-simple-slash'
              "
              class="size-5"
              :class="
                statusColor === 'success' ? 'text-success-600 dark:text-success-400' :
                statusColor === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                'text-danger-600 dark:text-danger-400'
              "
            />
          </div>
        </div>

        <!-- Status Content -->
        <div class="min-w-0 flex-1">
          <h3 class="text-muted-900 text-sm font-semibold dark:text-white">
            اعلان‌های فوری (PWA)
          </h3>
          <p
            class="mt-1 text-sm"
            :class="
              statusColor === 'success' ? 'text-success-600 dark:text-success-400' :
              statusColor === 'warning' ? 'text-warning-600 dark:text-warning-400' :
              'text-danger-600 dark:text-danger-400'
            "
          >
            {{ notificationStatusText }}
          </p>

          <!-- Error Message -->
          <p v-if="error" class="text-danger-600 dark:text-danger-400 mt-2 text-xs">
            {{ error }}
          </p>
        </div>

        <!-- Action Button -->
        <div class="shrink-0">
          <BaseButton
            v-if="canEnableNotifications && !isSubscribed"
            size="sm"
            variant="solid"
            color="primary"
            :loading="isLoading"
            @click="handleEnableNotifications"
          >
            <Icon name="ph:bell" class="ml-2 size-5" />
            فعال‌سازی
          </BaseButton>

          <BaseButton
            v-else-if="isSubscribed"
            size="sm"
            variant="outline"
            color="danger"
            @click="handleDisableNotifications"
          >
            <Icon name="ph:bell-slash" class="size-4" />
            غیرفعال
          </BaseButton>

          <BaseButton
            v-else-if="!isSupported"
            size="sm"
            variant="ghost"
            disabled
          >
            پشتیبانی نمی‌شود
          </BaseButton>

          <BaseButton
            v-else
            size="sm"
            variant="ghost"
            disabled
          >
            دسترسی رد شده
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Test Notification -->
    <BaseCard v-if="isSubscribed" class="p-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-muted-900 text-sm font-medium dark:text-white">
            تست اعلان
          </h4>
          <p class="text-muted-500 dark:text-muted-400 mt-1 text-xs">
            برای اطمینان از کارکرد، یک اعلان تستی ارسال کنید
          </p>
        </div>

        <BaseButton
          size="sm"
          variant="outline"
          color="primary"
          :loading="isTestingNotification"
          @click="handleTestNotification"
        >
          <Icon name="ph:test-tube" class="size-4" />
          تست اعلان
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Additional Settings -->
    <BaseCard v-if="isSubscribed" class="p-4">
      <div class="space-y-3">
        <h4 class="text-muted-900 text-sm font-medium dark:text-white">
          تنظیمات اعلان‌ها
        </h4>

        <div class="text-muted-500 dark:text-muted-400 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span>اعلان‌های فوری:</span>
            <BaseBadge color="success" size="xs">
              فعال
            </BaseBadge>
          </div>

          <div class="flex items-center justify-between">
            <span>اعلان‌های آفلاین:</span>
            <BaseBadge color="success" size="xs">
              فعال
            </BaseBadge>
          </div>

          <div class="flex items-center justify-between">
            <span>لرزش:</span>
            <BaseBadge color="primary" size="xs">
              بر اساس اولویت
            </BaseBadge>
          </div>
        </div>

        <div class="border-muted-200 dark:border-muted-700 mt-3 border-t pt-3">
          <p class="text-muted-500 dark:text-muted-400 text-xs leading-relaxed">
            💡 <strong>نکته:</strong> اعلان‌های PWA حتی زمانی که مرورگر بسته است کار می‌کنند و تجربه‌ای شبیه به اپلیکیشن‌های موبایل ارائه می‌دهند.
          </p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
