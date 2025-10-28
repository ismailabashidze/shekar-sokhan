<template>
  <header class="zone-header border-b border-gray-200 bg-white">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Zone Info -->
      <div class="flex items-center space-x-4 space-x-reverse">
        <div
          v-if="currentZoneConfig"
          class="flex items-center space-x-3 space-x-reverse"
        >
          <div
            class="flex size-8 items-center justify-center rounded-lg"
            :class="currentZoneConfig.color ? `bg-${currentZoneConfig.color}-100` : 'bg-gray-100'"
          >
            <Icon
              :name="currentZoneConfig.icon"
              :class="currentZoneConfig.color ? `text-${currentZoneConfig.color}-600` : 'text-gray-600'"
              class="size-5"
            />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">
              {{ currentZoneConfig.label }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="hidden items-center space-x-6 space-x-reverse md:flex">
        <NuxtLink
          v-for="item in horizontalNavItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center space-x-2 space-x-reverse rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <Icon
            v-if="item.icon"
            :name="item.icon"
            class="size-4"
          />
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="bg-primary-100 text-primary-800 ml-2 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User Menu -->
      <div class="flex items-center space-x-4 space-x-reverse">
        <!-- Zone Switcher (Mobile Dropdown) -->
        <div class="md:hidden">
          <select
            :value="currentZone || ''"
            class="focus:border-primary-500 focus:ring-primary-500 rounded-md border-gray-300 text-sm"
            @change="navigateToZone(($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>
              انتخاب بخش
            </option>
            <option
              v-for="zone in userZones"
              :key="zone.name"
              :value="zone.path"
            >
              {{ zone.label }}
            </option>
          </select>
        </div>

        <!-- Notifications -->
        <button class="relative rounded-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <Icon name="ph:bell" class="size-5" />
          <span class="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
        </button>

        <!-- User Avatar -->
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="text-left">
            <div class="text-sm font-medium text-gray-900">
              {{ user?.name }}
            </div>
            <div class="text-xs text-gray-500">
              {{ user?.role }}
            </div>
          </div>
          <div class="relative">
            <button class="flex size-8 items-center justify-center rounded-full bg-gray-100">
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="size-8 rounded-full object-cover"
              >
              <Icon
                v-else
                name="ph:user"
                class="size-4 text-gray-600"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <nav class="border-t border-gray-200 bg-gray-50 px-4 py-2 md:hidden">
      <div class="flex space-x-4 space-x-reverse overflow-x-auto">
        <NuxtLink
          v-for="item in horizontalNavItems"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center space-x-2 space-x-reverse whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white'"
        >
          <Icon
            v-if="item.icon"
            :name="item.icon"
            class="size-4"
          />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { user } = useUser()
const route = useRoute()
const {
  currentZone,
  currentZoneConfig,
  userZones,
  horizontalNavItems,
} = useZones()

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const navigateToZone = (path: string) => {
  if (path) {
    navigateTo(path)
  }
}
</script>
