<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps<{
  horizontal?: boolean
}>()
const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()

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

<template>
  <div class="group inline-flex items-center justify-center text-right">
    <Menu
      v-slot="{ close }"
      as="div"
      class="relative z-20 size-10 text-start"
    >
      <MenuButton as="template">
        <button
          type="button"
          class="group-hover:ring-primary-500 dark:ring-offset-muted-800 inline-flex size-10 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
        >
          <div
            class="relative inline-flex size-10 items-center justify-center rounded-full"
          >
            <!-- Personalized avatar placeholder -->
            <div
              v-if="avatarLoading"
              class="absolute inset-0 flex items-center justify-center rounded-full text-white font-semibold text-sm"
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
        </button>
      </MenuButton>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute mt-2 w-60 origin-bottom-right rounded-md border bg-white text-left shadow-lg focus:outline-none"
          :class="props.horizontal ? 'top-10 end-0' : 'bottom-0 -end-64'"
        >
          <div class="bg-muted-50 dark:bg-muted-700/40 p-6">
            <div class="flex items-center">
              <div
                class="relative inline-flex size-14 items-center justify-center rounded-full"
              >
                <!-- Personalized avatar placeholder -->
                <div
                  v-if="avatarLoading"
                  class="absolute inset-0 flex items-center justify-center rounded-full text-white font-semibold text-lg"
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
              <div class="ms-3 text-right leading-6">
                <h6 class="font-heading text-muted-800 text-sm font-medium dark:text-white">
                  {{ displayName }}
                </h6>
                <p class="text-muted-400 font-sans text-xs">
                  {{ (user.role ?? 'user') === 'user' ? 'کاربر' : 'ادمین' }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-2">
            <MenuItem v-slot="{ active }" as="div">
              <NuxtLink
                to="/report"
                class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
                :class="[
                  active
                    ? 'bg-muted-100 dark:bg-muted-700 text-primary-500'
                    : 'text-muted-400',
                ]"
                @click.passive="close"
              >
                <Icon name="ph:user-circle-duotone" class="size-5" />
                <div class="ms-3 text-right leading-7">
                  <h6 class="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white">
                    {{ displayName }}
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    مشاهده پروفایل
                  </p>
                </div>
              </NuxtLink>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <NuxtLink
                to="/darmana/therapists/sessions"
                class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
                :class="[
                  active
                    ? 'bg-muted-100 dark:bg-muted-700 text-primary-500'
                    : 'text-muted-400',
                ]"
                @click.passive="close"
              >
                <Icon name="ph:users-three-duotone" class="size-5" />
                <div class="ms-3 text-right leading-6">
                  <h6
                    class="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white"
                  >
                    جلسات
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    همه جلسات من
                  </p>
                </div>
              </NuxtLink>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <NuxtLink
                to="/payments"
                class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
                :class="[
                  active
                    ? 'bg-muted-100 dark:bg-muted-700 text-primary-500'
                    : 'text-muted-400',
                ]"
                @click.passive="close"
              >
                <Icon name="ph:wallet-duotone" class="size-5" />
                <div class="ms-3 text-right leading-6">
                  <h6
                    class="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white"
                  >
                    پرداختی ها
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    مدیریت پرداختی ها
                  </p>
                </div>
              </NuxtLink>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <NuxtLink
                to="/settings"
                class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
                :class="[
                  active
                    ? 'bg-muted-100 dark:bg-muted-700 text-primary-500'
                    : 'text-muted-400',
                ]"
                @click.passive="close"
              >
                <Icon name="ph:gear-six-duotone" class="size-5" />
                <div class="ms-3 text-right leading-6">
                  <h6
                    class="font-heading text-muted-800 text-xs font-medium leading-none dark:text-white"
                  >
                    تنظیمات
                  </h6>
                  <p class="text-muted-400 font-sans text-xs leading-6">
                    تنظیمات حساب
                  </p>
                </div>
              </NuxtLink>
            </MenuItem>
            <BaseDropdownDivider />

            <MenuItem v-slot="{ active }" as="div">
              <NuxtLink
                to="/auth/logout"
                class="group flex w-full items-center rounded-md p-3 text-sm transition-colors duration-300"
                :class="[
                  active
                    ? 'bg-muted-100 dark:bg-muted-700 text-primary-500'
                    : 'text-muted-400',
                ]"
                @click.passive="close"
              >
                <Icon
                  name="ph:sign-out-duotone"
                  class="size-5"
                  color="red"
                />
                <div class="ms-3 text-right leading-6">
                  <h6
                    class="font-heading text-danger-800 dark:text-danger-500 text-xs font-medium leading-none"
                  >
                    خروج
                  </h6>
                  <p class="text-danger-400 font-sans text-xs leading-6">
                    خروج از حساب کاربری
                  </p>
                </div>
              </NuxtLink>
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
</template>
