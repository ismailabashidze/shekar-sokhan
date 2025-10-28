<template>
  <div class="zone-sidebar flex h-full w-64 flex-col border-r border-gray-200 bg-white">
    <!-- Zone Header -->
    <div class="border-b border-gray-200 p-4">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div
          class="flex size-10 items-center justify-center rounded-lg"
          :class="currentZoneConfig?.color ? `bg-${currentZoneConfig.color}-100` : 'bg-gray-100'"
        >
          <Icon
            :name="currentZoneConfig?.icon || 'ph:house'"
            :class="currentZoneConfig?.color ? `text-${currentZoneConfig.color}-600` : 'text-gray-600'"
            class="size-6"
          />
        </div>
        <div>
          <h2 class="font-semibold text-gray-900">
            {{ currentZoneConfig?.label || 'داشبورد' }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ user?.name || 'کاربر' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-2">
        <li v-for="item in sidebarItems" :key="item.to">
          <!-- Single Level Item -->
          <NuxtLink
            v-if="!item.children"
            :to="item.to"
            class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <div class="flex items-center space-x-3 space-x-reverse">
              <Icon :name="item.icon" class="size-5" />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs font-medium"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>

          <!-- Multi Level Item -->
          <div v-else>
            <button
              class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              :class="isExpanded(item.to) ? 'bg-gray-50' : ''"
              @click="toggleExpand(item.to)"
            >
              <div class="flex items-center space-x-3 space-x-reverse">
                <Icon :name="item.icon" class="size-5" />
                <span>{{ item.label }}</span>
              </div>
              <Icon
                :name="isExpanded(item.to) ? 'ph:caret-down' : 'ph:caret-left'"
                class="size-4 transition-transform"
              />
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <ul v-if="isExpanded(item.to)" class="mt-1 space-y-1 pr-8">
                <li v-for="child in item.children" :key="child.to">
                  <NuxtLink
                    :to="child.to"
                    class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                    :class="isActive(child.to)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                  >
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <Icon :name="child.icon" class="size-4" />
                      <span>{{ child.label }}</span>
                    </div>
                    <span
                      v-if="child.badge"
                      class="bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {{ child.badge }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Zone Switcher -->
    <div class="border-t border-gray-200 p-4">
      <div class="mb-3">
        <label class="text-xs font-medium text-gray-500">تغییر بخش</label>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="zone in userZones"
          :key="zone.name"
          class="flex flex-col items-center justify-center rounded-lg p-2 transition-colors"
          :class="currentZone === zone.name
            ? `bg-${zone.color}-100 border-2 border-${zone.color}-300`
            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'"
          :title="zone.label"
          @click="navigateToZone(zone.path)"
        >
          <Icon
            :name="zone.icon"
            :class="`h-5 w-5 ${zone.color ? `text-${zone.color}-600` : 'text-gray-600'}`"
          />
          <span class="mt-1 text-xs text-gray-600">{{ zone.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SidebarItem } from '@/composables/useZones';

const { user } = useUser();
const route = useRoute();
const {
  currentZone,
  currentZoneConfig,
  userZones,
  sidebarItems,
  ZONE_CONFIGS,
} = useZones();

const expandedItems = ref<Set<string>>(new Set());

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const isExpanded = (path: string) => {
  return expandedItems.value.has(path);
};

const toggleExpand = (path: string) => {
  const newExpanded = new Set(expandedItems.value);
  if (newExpanded.has(path)) {
    newExpanded.delete(path);
  }
  else {
    newExpanded.add(path);
  }
  expandedItems.value = newExpanded;
};

const navigateToZone = (path: string) => {
  navigateTo(path);
};

// Auto-expand parent if child is active
watchEffect(() => {
  if (sidebarItems.value) {
    sidebarItems.value.forEach((item) => {
      if (item.children && item.children.some(child => isActive(child.to))) {
        expandedItems.value.add(item.to);
      }
    });
  }
});
</script>
