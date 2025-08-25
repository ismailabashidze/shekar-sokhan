<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">پنل توزیع‌کننده</h1>
      </div>
      <nav class="mt-4">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.to"
          :to="item.to"
          class="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          active-class="bg-blue-50 text-blue-600 border-r-4 border-blue-600"
        >
          <Icon :name="item.icon" class="w-5 h-5 ml-3" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between p-4 bg-white shadow">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="md:hidden mr-4 text-gray-500">
            <Icon name="mdi:menu" class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-semibold text-gray-800">{{ currentPageTitle }}</h2>
        </div>
        <div class="flex items-center space-x-4">
          <TairoDropdown>
            <template #trigger>
              <button class="flex items-center text-gray-500 hover:text-gray-700">
                <Icon name="mdi:account-circle" class="w-8 h-8" />
              </button>
            </template>
            <TairoDropdownItem>
              <NuxtLink to="/baham/distributor/profile">پروفایل</NuxtLink>
            </TairoDropdownItem>
            <TairoDropdownItem>
              <NuxtLink to="/baham/distributor/settings">تنظیمات</NuxtLink>
            </TairoDropdownItem>
            <TairoDropdownItem divided>
              <button @click="logout">خروج</button>
            </TairoDropdownItem>
          </TairoDropdown>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const menuItems = [
  { to: '/baham/distributor', label: 'پیشخوان', icon: 'mdi:view-dashboard' },
  { to: '/baham/distributor/orders', label: 'سفارشات', icon: 'mdi:clipboard-list' },
  { to: '/baham/distributor/coordination', label: 'هماهنگی', icon: 'mdi:handshake' },
  { to: '/baham/distributor/area', label: 'منطقه', icon: 'mdi:map-marker-radius' },
  { to: '/baham/distributor/reports', label: 'گزارشات', icon: 'mdi:finance' },
  { to: '/baham/distributor/profile', label: 'پروفایل', icon: 'mdi:account' }
]

const currentPageTitle = computed(() => {
  const matchedItem = menuItems.find(item => item.to === route.path)
  return matchedItem ? matchedItem.label : 'پنل توزیع‌کننده'
})

const toggleSidebar = () => {
  // Implementation for mobile sidebar toggle
  console.log('Toggle sidebar')
}

const logout = () => {
  // Implementation for logout
  alert('خروج از سیستم')
}
</script>