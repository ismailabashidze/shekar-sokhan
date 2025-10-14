<script setup lang="ts">
useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()
const toaster = useToaster()
const { hasPin, removePin } = useLockSystem()
const { user } = useUser()

const isRemovingPin = ref(false)
const showConfirmModal = ref(false)

const handleRemovePin = async () => {
  if (!user.value?.id) {
    toaster.show({
      title: 'خطا',
      message: 'کاربر وارد نشده است',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }

  isRemovingPin.value = true

  try {
    // Remove PIN from both PocketBase and localStorage
    const success = await removePin(user.value.id)

    if (!success) {
      throw new Error('Failed to remove PIN from server')
    }

    toaster.show({
      title: 'موفقیت',
      message: 'قفل برنامه با موفقیت حذف شد',
      color: 'success',
      icon: 'ph:trash',
      closable: true,
    })

    showConfirmModal.value = false

    // Redirect to settings
    setTimeout(() => {
      router.push('/settings')
    }, 1500)
  }
  catch (error) {
    console.error('Remove PIN error:', error)
    toaster.show({
      title: 'خطا',
      message: 'مشکلی در حذف پین پیش آمد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    isRemovingPin.value = false
  }
}

// Redirect if user doesn't have PIN
if (!hasPin.value) {
  router.push('/settings')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-muted-800">
    <!-- Header -->
    <div class="border-b border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800">
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
          <h1 class="text-xl font-semibold text-muted-800 dark:text-muted-200">
            حذف پین امنیتی
          </h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="mx-auto max-w-md">
        <!-- Warning Card -->
        <div class="mb-6 rounded-xl border border-warning-200 bg-warning-50 p-6 dark:border-warning-800 dark:bg-warning-900/20">
          <div class="flex items-start gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-900">
              <Icon name="ph:warning" class="size-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <h3 class="mb-2 font-semibold text-warning-800 dark:text-warning-200">
                هشدار امنیتی
              </h3>
              <p class="text-sm text-warning-700 dark:text-warning-300">
                با حذف پین امنیتی، هر کس با دسترسی به دستگاه شما می‌تواند به اطلاعات حساب کاربری شما دسترسی پیدا کند. آیا از حذف پین اطمینان دارید؟
              </p>
            </div>
          </div>
        </div>

        <!-- Current Status -->
        <div class="mb-6 rounded-xl border border-muted-200 bg-white p-6 shadow-sm dark:border-muted-700 dark:bg-muted-800">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium text-muted-800 dark:text-muted-200">
              وضعیت فعلی
            </h3>
            <div class="flex items-center gap-2">
              <div class="flex size-2 rounded-full bg-success-100 dark:bg-success-900" />
              <span class="text-sm font-medium text-success-600 dark:text-success-400">
                پین فعال
              </span>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-500">کاربر:</span>
              <span class="font-medium text-muted-800 dark:text-muted-200">
                {{ user?.username || 'نامشخص' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-500">نوع قفل:</span>
              <span class="font-medium text-muted-800 dark:text-muted-200">
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
        <div class="mt-6 rounded-xl bg-muted-50 p-4 dark:bg-muted-900/50">
          <h4 class="mb-2 text-sm font-medium text-muted-700 dark:text-muted-300">
            نکات مهم:
          </h4>
          <ul class="space-y-1 text-xs text-muted-600 dark:text-muted-400">
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
        <div class="flex size-10 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900">
          <Icon name="ph:trash" class="size-5 text-danger-600 dark:text-danger-400" />
        </div>
        <div>
          <h3 class="font-semibold text-muted-800 dark:text-muted-200">
            تأیید حذف پین
          </h3>
          <p class="text-sm text-muted-500">
            این عمل غیرقابل بازگشت است
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <p class="text-muted-600 dark:text-muted-400">
          آیا مطمئن هستید که می‌خواهید پین امنیتی را حذف کنید؟ پس از حذف، هر کس با دسترسی به دستگاه شما می‌تواند به حساب کاربری شما دسترسی داشته باشد.
        </p>

        <div class="rounded-lg bg-muted-100 p-3 dark:bg-muted-800">
          <p class="text-xs text-muted-600 dark:text-muted-400">
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
