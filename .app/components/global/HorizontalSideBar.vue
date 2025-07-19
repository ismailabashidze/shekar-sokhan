<template>
  <div
    v-if="!isAuthPage"
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 fixed inset-x-0 top-0 z-50 block w-full border-b bg-white/90 backdrop-blur-md xl:hidden"
  >
    <div class="flex w-full flex-row justify-between items-center px-2 sm:px-4">
      <!-- Left side: Logo and Theme Toggle -->
      <div class="flex flex-row items-center gap-2 sm:gap-4">
        <!-- Logo -->
        <div class="flex size-16 shrink-0 items-center justify-center">
          <NuxtLink to="/dashboard" class="flex items-center justify-center">
            <div class="rounded-full bg-white p-[5px] shadow-sm">
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
        
        <!-- Theme Toggle -->
        <div class="flex items-center justify-center">
          <BaseThemeToggle />
        </div>
        
        <!-- Experimental Tag -->
        <div class="flex items-center justify-center">
          <BaseTag color="primary" class="hidden sm:block">
            آزمایشی
          </BaseTag>
        </div>
      </div>

      <!-- Right side: Navigation and User Menu -->
      <div class="flex flex-row gap-x-1 sm:gap-x-2 items-center">
        <div class="flex h-16 items-center justify-center">
          <!-- <NuxtLink
            to=""
            title="Settings"
            class="text-warning-400 hover:text-primary-500 bg-warning-500/20 hover:bg-primary-500/20 flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-300"
            @click.prevent="canDelete"
          >
            <Icon name="ph:arrow-clockwise" class="size-5" />
          </NuxtLink> -->
        </div>
        <div class="flex h-16 items-center justify-center gap-1 sm:gap-2">
          <!-- Notifications Button -->
          <BaseTag color="primary" class="hidden xs:block">
            آزمایشی
          </BaseTag>
          <NuxtLink
            to="/notifications"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 relative flex size-10 sm:size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="اعلان‌ها"
          >
            <Icon name="ph:bell" class="size-4 sm:size-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 flex size-4 sm:size-5 min-w-[16px] sm:min-w-[20px] items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-10 sm:size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="خانه"
          >
            <Icon name="ph:house-line" class="size-4 sm:size-5" />
          </NuxtLink>
        </div>
        <div class="flex h-16 items-center justify-center">
          <div class="flex justify-start">
            <BaseDropdown
              variant="custom"
              :button-class="'inline-flex size-8 sm:size-10 items-center justify-center rounded-full'"
            >
              <template #button>
                <div class="relative inline-flex size-8 sm:size-10 cursor-pointer items-center justify-center rounded-full">
                  <img
                    :src="avatarUrl"
                    class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                    alt=""
                    @error="$event.target.src = '/img/avatars/1.png'"
                  >
                </div>
              </template>
              <BaseDropdownItem
                to="/layouts/profile"
                title="مشاهده پروفایل"
                :text="displayName"
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
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))
console.log(isAuthPage.value)

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
const { unreadCount } = useNotifications()

// Computed avatar and name from user
const avatarUrl = computed(() => getUserAvatarUrl(user.value) || '/img/avatars/1.png')
const displayName = computed(() => user.value.meta?.name || 'کاربر جدید')
</script>

  <style scoped>
  /* Add any component-specific styles here */
  </style>
