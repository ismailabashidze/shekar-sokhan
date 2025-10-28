<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات امنیت',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
const { hasPin, autoLockTimer, setAutoLockTimer } = useLockSystem()

const router = useRouter()
const toaster = useToaster()

const navigateToLockSetup = () => {
  router.push('/settings/lock-setup')
}

const navigateToRemoveLock = () => {
  router.push('/settings/remove-lock')
}

// Auto-lock timer settings
const showTimerModal = ref(false)

const timerOptions = [
  { value: null, label: 'بدون قفل خودکار', icon: 'ph:x-circle', description: 'غیرفعال' },
  { value: 15, label: '۱۵ ثانیه', icon: 'ph:timer', description: 'فوری' },
  { value: 30, label: '۳۰ ثانیه', icon: 'ph:timer', description: 'خیلی سریع' },
  { value: 60, label: '۱ دقیقه', icon: 'ph:clock', description: 'سریع' },
  { value: 120, label: '۲ دقیقه', icon: 'ph:clock', description: 'متوسط' },
  { value: 180, label: '۳ دقیقه', icon: 'ph:clock', description: 'معمولی' },
  { value: 300, label: '۵ دقیقه', icon: 'ph:hourglass', description: 'کند' },
]

const formatTimerLabel = (seconds: number | null) => {
  if (!seconds) return 'غیرفعال'
  if (seconds < 60) return `${seconds} ثانیه`
  return `${seconds / 60} دقیقه`
}

const selectTimer = (value: number | null) => {
  setAutoLockTimer(value)
  showTimerModal.value = false

  toaster.show({
    title: 'تنظیمات ذخیره شد',
    message: value ? `قفل خودکار پس از ${formatTimerLabel(value)} فعال شد` : 'قفل خودکار غیرفعال شد',
    color: 'success',
    icon: 'ph:check-circle',
    closable: true,
  })
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <BaseCard rounded="lg" class="p-6">
      <div class="mb-6">
        <BaseHeading
          tag="h3"
          size="lg"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          تنظیمات امنیت حساب
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 mt-2">
          مدیریت امنیت حساب کاربری شما
        </BaseParagraph>
      </div>

      <!-- Lock System Settings -->
      <div class="mb-6">
        <BaseHeading
          tag="h4"
          size="md"
          weight="medium"
          class="text-muted-800 mb-4 dark:text-white"
        >
          قفل برنامه
        </BaseHeading>

        <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 rounded-lg border bg-white p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:lock-simple" class="text-muted-500 size-5" />
                <h5 class="text-muted-800 dark:text-muted-200 font-medium">
                  پین امنیتی
                </h5>
              </div>
              <p class="text-muted-500 text-sm">
                {{ hasPin ? 'پین امنیتی فعال است. برنامه پس از ورود قفل می‌شود.' : 'با تنظیم پین ۴ رقمی، برنامه خود را از دسترسی غیرمجاز محافظت کنید.' }}
              </p>
              <div v-if="hasPin" class="mt-2 flex items-center gap-2">
                <div class="bg-success-500 flex size-2 rounded-full" />
                <span class="text-success-600 dark:text-success-400 text-xs font-medium">
                  فعال
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <BaseButton
                v-if="!hasPin"
                color="primary"
                size="sm"
                @click="navigateToLockSetup"
              >
                <Icon name="ph:plus" class="size-4" />
                تنظیم پین
              </BaseButton>
              <BaseButton
                v-else
                color="danger"
                variant="outline"
                size="sm"
                @click="navigateToRemoveLock"
              >
                <Icon name="ph:trash" class="size-4" />
                حذف پین
              </BaseButton>
            </div>
          </div>

          <!-- Info Box -->
          <div class="bg-muted-100 dark:bg-muted-900/50 mt-4 rounded-md p-3">
            <div class="flex items-start gap-2">
              <Icon name="ph:info" class="text-primary-500 mt-0.5 size-4 shrink-0" />
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                <p class="mb-1 font-medium">
                  نکات مهم:
                </p>
                <ul class="list-inside list-disc space-y-0.5">
                  <li>پین شما در سرور ذخیره می‌شود</li>
                  <li>خروج از حساب، قفل را باز نمی‌کند</li>
                  <li>در صورت فراموشی پین با پشتیبانی تماس بگیرید</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-Lock Timer Settings -->
      <div v-if="hasPin" class="mb-6">
        <BaseHeading
          tag="h4"
          size="md"
          weight="medium"
          class="text-muted-800 mb-4 dark:text-white"
        >
          قفل خودکار
        </BaseHeading>

        <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 rounded-lg border bg-white p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:timer" class="text-muted-500 size-5" />
                <h5 class="text-muted-800 dark:text-muted-200 font-medium">
                  زمان قفل خودکار
                </h5>
              </div>
              <p class="text-muted-500 text-sm">
                برنامه پس از مدت زمان مشخص عدم فعالیت، به صورت خودکار قفل می‌شود
              </p>
              <div v-if="autoLockTimer" class="mt-2 flex items-center gap-2">
                <div class="bg-warning-500 flex size-2 rounded-full" />
                <span class="text-warning-600 dark:text-warning-400 text-xs font-medium">
                  فعال: {{ formatTimerLabel(autoLockTimer) }}
                </span>
              </div>
              <div v-else class="mt-2 flex items-center gap-2">
                <div class="bg-muted-400 flex size-2 rounded-full" />
                <span class="text-muted-500 text-xs font-medium">
                  غیرفعال
                </span>
              </div>
            </div>

            <BaseButton
              color="muted"
              size="sm"
              @click="showTimerModal = true"
            >
              <Icon name="ph:gear" class="ml-2 size-4" />
              تنظیم
            </BaseButton>
          </div>

          <!-- Info Box -->
          <div class="bg-muted-100 dark:bg-muted-900/50 mt-4 rounded-md p-3">
            <div class="flex items-start gap-2">
              <Icon name="ph:info" class="text-primary-500 mt-0.5 size-4 shrink-0" />
              <div class="text-muted-600 dark:text-muted-400 text-xs">
                <p class="mb-1 font-medium">
                  نحوه کار:
                </p>
                <ul class="list-inside list-disc space-y-0.5">
                  <li>تایمر پس از هر فعالیت شما ریست می‌شود</li>
                  <li>فعالیت شامل: حرکت موس، کلیک، تایپ و اسکرول</li>
                  <li>دکمه قفل زمان باقیمانده را نمایش می‌دهد</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Security Settings Can Be Added Here -->
      <div>
        <BaseHeading
          tag="h4"
          size="md"
          weight="medium"
          class="text-muted-800 mb-4 dark:text-white"
        >
          سایر تنظیمات امنیتی
        </BaseHeading>

        <BaseParagraph size="sm" class="text-muted-500 mb-4">
          تنظیمات بیشتر امنیتی در آینده اضافه خواهند شد
        </BaseParagraph>
      </div>
    </BaseCard>
  </div>

  <!-- Timer Selection Modal -->
  <TairoModal
    :open="showTimerModal"
    size="md"
    @close="showTimerModal = false"
  >
    <template #header>
      <div class="flex items-center gap-4 p-2" dir="rtl">
        <div class="bg-warning-100 dark:bg-warning-900 flex size-12 items-center justify-center rounded-full">
          <Icon name="ph:timer" class="text-warning-600 dark:text-warning-400 size-6" />
        </div>
        <div class="flex-1 text-right">
          <h3 class="text-muted-800 dark:text-muted-200 text-lg font-semibold">
            زمان قفل خودکار
          </h3>
          <p class="text-muted-500 mt-1 text-sm">
            انتخاب مدت زمان عدم فعالیت
          </p>
        </div>
      </div>
    </template>

    <div class="p-6" dir="rtl">
      <div class="max-h-[400px] overflow-y-auto">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="option in timerOptions"
            :key="option.value || 'disabled'"
            class="hover:border-primary-500 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-md"
            :class="autoLockTimer === option.value
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800'"
            @click="selectTimer(option.value)"
          >
            <div
              class="flex size-14 items-center justify-center rounded-lg"
              :class="autoLockTimer === option.value
                ? 'bg-primary-500'
                : 'bg-muted-100 dark:bg-muted-700'"
            >
              <Icon
                :name="option.icon"
                class="size-7"
                :class="autoLockTimer === option.value
                  ? 'text-white'
                  : 'text-muted-600 dark:text-muted-400'"
              />
            </div>
            <div class="text-center">
              <p
                class="text-sm font-semibold"
                :class="autoLockTimer === option.value
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-muted-800 dark:text-muted-100'"
              >
                {{ option.label }}
              </p>
              <p class="text-muted-500 mt-1 text-xs">
                {{ option.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="p-2">
        <BaseButton
          color="muted"
          class="w-full"
          @click="showTimerModal = false"
        >
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
