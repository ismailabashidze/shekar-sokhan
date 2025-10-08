<template>
  <div
    v-if="!isAuthPage"
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-r bg-white xl:block"
  >
    <div class="flex h-full flex-col justify-between">
      <div class="flex flex-col">
        <div
          class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
        >
          <NuxtLink to="/dashboard" class="flex items-center justify-center">
            <div class="rounded-full bg-white p-[5px]">
              <img
                src="/img/logo-no-bg.png"
                width="40"
                height="40"
                alt=""
                srcset=""
              >
            </div>
          </NuxtLink>
        </div>
        <div
          class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
        >
          <BaseThemeToggle />
        </div>
      </div>
      <div class="flex flex-col">
        <!-- <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to=""
            title="پاک کردن گفت و گو"
            class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
            @click.prevent="canDelete"
          >
            <Icon name="ph:arrow-clockwise" class="size-5" />
          </NuxtLink>
        </div> -->
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink
            to="/dashboard"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="بازگشت به صفحه اصلی"
          >
            <Icon name="ph:house-line" class="size-5" />
          </NuxtLink>
        </div>
        <div class="hidden h-16 w-full items-center justify-center md:flex">
          <!-- Notifications Button -->
          <NuxtLink
            to="/notifications"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 relative flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="اعلان‌ها"
          >
            <Icon name="ph:bell" class="size-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 flex size-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </NuxtLink>
        </div>
        <div class="flex h-16 w-full items-center justify-center">
          <BaseDropdown
            variant="context"
            :button-class="'inline-flex size-10 items-center justify-center rounded-full'"
          >
            <template #button>
              <div class="relative mt-2.5 inline-flex size-10 cursor-pointer items-center justify-center rounded-full">
                <img
                  :src="avatarUrl"
                  class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                  @error="$event.target.src = '/img/avatars/1.png'"
                >
              </div>
            </template>
            <BaseDropdownItem
              to="/report"
              title="مشاهده پروفایل"
              :text="user.meta?.name || 'کاربر جدید'"
              rounded="sm"
            />

            <BaseDropdownItem
              to="/darmana/therapists/sessions"
              title="جلسات"
              text="همه جلسات من"
              rounded="sm"
            />

            <BaseDropdownItem
              to="/payments"
              title="پرداختی ها"
              text="مدیریت پرداختی ها"
              rounded="sm"
            />

            <BaseDropdownItem
              to="/settings"
              title="تنظیمات"
              text="تنظیمات حساب"
              rounded="sm"
            />

            <BaseDropdownDivider />

            <BaseDropdownItem
              to="/auth/logout"
              title="خروج"
              text="خروج از حساب کاربری"
              rounded="sm"
            />
          </BaseDropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
const { unreadCount } = useNotifications()

// Import and use panels composable for notification panel
const { open } = usePanels()

// Computed avatar and name from user
const avatarUrl = computed(() => getUserAvatarUrl(user.value) || '/img/avatars/1.png')

// Function to open notifications panel
const openNotifications = () => {
  open('notifications')
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
