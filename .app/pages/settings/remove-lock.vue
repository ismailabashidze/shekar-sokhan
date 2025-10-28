<script setup lang="ts">
useHead({ htmlAttrs: { dir: 'rtl' } });

const router = useRouter();
const toaster = useToaster();
const { hasPin, removePin } = useLockSystem();
const { user } = useUser();

const isRemovingPin = ref(false);
const showConfirmModal = ref(false);

const handleRemovePin = async () => {
  if (!user.value?.id) {
    toaster.show({
      title: 'خطا',
      message: 'کاربر وارد نشده است',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    });
    return;
  }

  isRemovingPin.value = true;

  try {
    // Remove PIN from both PocketBase and localStorage
    const success = await removePin(user.value.id);

    if (!success) {
      throw new Error('Failed to remove PIN from server');
    }

    toaster.show({
      title: 'موفقیت',
      message: 'قفل برنامه با موفقیت حذف شد',
      color: 'success',
      icon: 'ph:trash',
      closable: true,
    });

    showConfirmModal.value = false;

    // Redirect to settings
    setTimeout(() => {
      router.push('/settings');
    }, 1500);
  }
  catch (error) {
    console.error('Remove PIN error:', error);
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در حذف پین پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    });
  }
  finally {
    isRemovingPin.value = false;
  }
};

// Redirect if user doesn't have PIN
if (!hasPin.value) {
  router.push('/settings');
}
</script>

<template>
  <div class="dark:bg-muted-800 min-h-screen bg-white">
    <!-- Header -->
    <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 border-b bg-white">
      <div class="container mx-auto p-4">
        <div class="flex items-center gap-4">
          <BaseButton
            type="button"
            color="muted"
            variant="ghost"
            size="sm"
            @click="router.go(-1)"
          >
            <Icon name="ph:arrow-right" class="size-4" />
          </BaseButton>
          <h1 class="text-muted-800 dark:text-muted-200 text-xl font-semibold">
            حذف پین امنیتی
          </h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="mx-auto max-w-md">
        <!-- Warning Card -->
        <div
          class="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20 mb-6 rounded-xl border p-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="bg-warning-100 dark:bg-warning-900 flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <Icon name="ph:warning" class="text-warning-600 dark:text-warning-400 size-5" />
            </div>
            <div>
              <h3 class="text-warning-800 dark:text-warning-200 mb-2 font-semibold">
                هشدار امنیتی
              </h3>
              <p class="text-warning-700 dark:text-warning-300 text-sm">
                با حذف پین امنیتی، هر کس با دسترسی به دستگاه شما می‌تواند به اطلاعات حساب کاربری شما دسترسی پیدا کند.
                آیا از حذف پین اطمینان دارید؟
              </p>
            </div>
          </div>
        </div>

        <!-- Current Status -->
        <div
          class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 mb-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-muted-800 dark:text-muted-200 font-medium">
              وضعیت فعلی
            </h3>
            <div class="flex items-center gap-2">
              <div class="bg-success-100 dark:bg-success-900 flex size-2 rounded-full" />
              <span class="text-success-600 dark:text-success-400 text-sm font-medium">
                پین فعال
              </span>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-500">کاربر:</span>
              <span class="text-muted-800 dark:text-muted-200 font-medium">
                {{ user?.username || 'نامشخص' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-500">نوع قفل:</span>
              <span class="text-muted-800 dark:text-muted-200 font-medium">
                پین ۴ رقمی
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <BaseButton
            color="danger"
            variant="outline"
            shape="curved"
            class="w-full"
            @click="showConfirmModal = true"
          >
            <Icon name="ph:trash" class="size-4" />
            حذف پین امنیتی
          </BaseButton>

          <BaseButton
            type="button"
            color="muted"
            variant="outline"
            shape="curved"
            class="w-full"
            @click="router.go(-1)"
          >
            <Icon name="ph:x" class="size-4" />
            انصراف
          </BaseButton>
        </div>

        <!-- Additional Info -->
        <div class="bg-muted-50 dark:bg-muted-900/50 mt-6 rounded-xl p-4">
          <h4 class="text-muted-700 dark:text-muted-300 mb-2 text-sm font-medium">
            نکات مهم:
          </h4>
          <ul class="text-muted-600 dark:text-muted-400 space-y-1 text-xs">
            <li>• پس از حذف پین، قفل برنامه غیرفعال می‌شود</li>
            <li>• می‌توانید هر زمان پین جدیدی تنظیم کنید</li>
            <li>• برای حفظ حریم خصوصی، پین خود را با دیگران به اشتراک نگذارید</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <TairoModal
    :open="showConfirmModal"
    size="sm"
    @close="showConfirmModal = false"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="bg-danger-100 dark:bg-danger-900 flex size-10 items-center justify-center rounded-full">
          <Icon name="ph:trash" class="text-danger-600 dark:text-danger-400 size-5" />
        </div>
        <div>
          <h3 class="text-muted-800 dark:text-muted-200 font-semibold">
            تأیید حذف پین
          </h3>
          <p class="text-muted-500 text-sm">
            این عمل غیرقابل بازگشت است
          </p>
        </div>
      </div>
    </template>

    <template>
      <div class="space-y-4">
        <p class="text-muted-600 dark:text-muted-400">
          آیا مطمئن هستید که می‌خواهید پین امنیتی را حذف کنید؟ پس از حذف، هر کس با دسترسی به دستگاه شما می‌تواند به حساب
          کاربری شما دسترسی داشته باشد.
        </p>

        <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-3">
          <p class="text-muted-600 dark:text-muted-400 text-xs">
            برای تأیید، روی دکمه "حذف پین" کلیک کنید
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-3">
        <BaseButton
          color="muted"
          variant="outline"
          class="flex-1"
          @click="showConfirmModal = false"
        >
          انصراف
        </BaseButton>
        <BaseButton
          color="danger"
          class="flex-1"
          :loading="isRemovingPin"
          @click="handleRemovePin"
        >
          <Icon
            v-if="!isRemovingPin"
            name="ph:trash"
            class="size-4"
          />
          حذف پین
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
