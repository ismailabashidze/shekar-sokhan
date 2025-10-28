<template>
  <div v-if="!isAuthPage"
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 fixed inset-x-0 top-0 z-50 block w-full border-b bg-white/90 backdrop-blur-md xl:hidden">
    <div class="flex w-full flex-row justify-between">
      <div class="flex flex-row">
        <div class=" flex size-16 shrink-0 items-center justify-center">
          <NuxtLink to="/dashboard" class="flex items-center justify-center">
            <div class="rounded-full bg-white p-[5px]">
              <img src="/img/logo-no-bg.png" width="40" height="40" alt="" srcset="">
            </div>
          </NuxtLink>
        </div>
        <div class="flex size-16 items-center justify-center">
          <div class="mr-28 flex items-center">
            <BaseThemeToggle />
            <BaseTag color="primary" class="mr-4 w-[120px]">
              آزمایشی - پژوهشی
            </BaseTag>
          </div>
        </div>
      </div>
      <div class="ml-5 flex flex-row gap-x-2">
        <div class="flex h-16 w-full items-center justify-center">
          <NuxtLink to="/dashboard"
            class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
            title="خانه">
            <Icon name="ph:house-line" class="size-5" />
          </NuxtLink>
        </div>
        <div class="flex h-16 w-full items-center justify-center">
          <div class="flex w-full justify-start gap-8">
            <BaseDropdown variant="custom"
              :button-class="'inline-flex size-10 items-center justify-center rounded-full'">
              <template #button>
                <div
                  class="relative mt-2.5 inline-flex size-10 cursor-pointer items-center justify-center rounded-full">
                  <img :src="avatarUrl" class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                    alt="" @error="$event.target.src = '/img/avatars/1.png'">
                </div>
              </template>
              <BaseDropdownItem to="/report" title="مشاهده پروفایل" :text="displayName" rounded="sm">
                <template #start>
                  <Icon name="ph:user-circle-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>

              <BaseDropdownItem to="/notifications" title="اعلان‌ها" text="مشاهده اعلان‌ها" rounded="sm">
                <template #start>
                  <div class="relative me-2">
                    <Icon name="ph:bell-duotone" class="block size-5" />
                    <!-- <span
                      v-if="unreadCount > 0"
                      class="absolute -right-1 -top-1 flex size-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                    >
                      {{ unreadCount > 99 ? '99+' : unreadCount }}
                    </span> -->
                  </div>
                </template>
              </BaseDropdownItem>

              <BaseDropdownItem to="/darmana/therapists/sessions" title="جلسات" text="همه جلسات من" rounded="sm">
                <template #start>
                  <Icon name="ph:calendar-check-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>

              <BaseDropdownItem to="/payments" title="پرداختی ها" text="مدیریت پرداختی ها" rounded="sm">
                <template #start>
                  <Icon name="ph:credit-card-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>

              <BaseDropdownItem to="/settings" title="تنظیمات" text="تنظیمات حساب" rounded="sm">
                <template #start>
                  <Icon name="ph:gear-six-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>

              <BaseDropdownItem to="/bug-reports/new" title="گزارش مشکل" text="گزارش مشکل یا خطا" rounded="sm">
                <template #start>
                  <Icon name="ph:bug-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>

              <BaseDropdownDivider />

              <BaseDropdownItem to="/auth/logout" title="خروج" text="خروج از حساب کاربری" rounded="sm">
                <template #start>
                  <Icon name="ph:sign-out-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
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
import BugReportIcon from './BugReportIcon.vue'

const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
// const { unreadCount } = useNotifications()

// Computed avatar and name from user
const avatarUrl = computed(() => getUserAvatarUrl(user.value) || '/img/avatars/1.png')
const displayName = computed(() => user.value.meta?.name || 'کاربر جدید')
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
