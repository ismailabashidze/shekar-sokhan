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
                  <!-- Personalized avatar placeholder -->
                  <div
                    v-if="avatarLoading"
                    class="absolute inset-0 flex items-center justify-center rounded-full text-white font-semibold text-xs sm:text-sm"
                    :class="placeholderColor"
                  >
                    {{ userInitials }}
                  </div>
                  
                  <img
                    :src="avatarUrl"
                    class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent transition-opacity duration-200"
                    :class="{ 'opacity-0': avatarLoading }"
                    alt=""
                    @load="handleAvatarLoad"
                    @error="handleAvatarError"
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

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
const { unreadCount } = useNotifications()

// Computed avatar and name from user
const avatarUrl = computed(() => {
  try {
    if (!user.value) return '/img/avatars/1.png'
    
    const url = getUserAvatarUrl(user.value)
    return url || '/img/avatars/1.png'
  } catch (error) {
    console.warn('Error getting avatar URL:', error)
    return '/img/avatars/1.png'
  }
})

const displayName = computed(() => user.value?.meta?.name || 'کاربر جدید')

// Generate user initials for placeholder
const userInitials = computed(() => {
  if (!user.value?.meta?.name) return 'ک'
  
  const name = user.value.meta.name.trim()
  const words = name.split(' ')
  
  if (words.length >= 2) {
    // First letter of first name + first letter of last name
    return words[0][0] + words[words.length - 1][0]
  } else if (words.length === 1) {
    // First two letters of single name
    return words[0].substring(0, 2)
  }
  
  return 'ک' // Default fallback
})

// Generate consistent background color based on user ID
const placeholderColor = computed(() => {
  if (!user.value?.id) return 'bg-primary-500'
  
  const colors = [
    'bg-primary-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500'
  ]
  
  // Use user ID to consistently pick a color
  const hash = user.value.id.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  
  return colors[hash % colors.length]
})

// Add loading state for avatar
const avatarLoading = ref(true)
const avatarError = ref(false)

const handleAvatarLoad = () => {
  avatarLoading.value = false
  avatarError.value = false
}

const handleAvatarError = (event: Event) => {
  console.warn('Avatar failed to load, using fallback')
  avatarError.value = true
  avatarLoading.value = false
  const target = event.target as HTMLImageElement
  target.src = '/img/avatars/1.png'
}

// Watch for avatar URL changes to reset loading state
watch(avatarUrl, () => {
  avatarLoading.value = true
  avatarError.value = false
}, { immediate: true })
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
