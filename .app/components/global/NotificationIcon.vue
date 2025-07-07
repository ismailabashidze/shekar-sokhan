<script setup lang="ts">
const { unreadCount } = useNotifications()
const { open } = usePanels()

const openNotifications = () => {
  open('notifications')
}
</script>

<template>
  <button
    type="button"
    class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 group relative flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"
    @click="openNotifications"
  >
    <Icon 
      name="ph:bell" 
      class="size-6 transition-transform duration-300 group-hover:rotate-12" 
      :class="unreadCount > 0 ? 'animate-pulse' : ''"
    />

    <!-- Unread count badge -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="scale-0 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-0 opacity-0"
    >
      <div
        v-if="unreadCount > 0"
        class="bg-gradient-to-r from-danger-500 to-danger-600 absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-muted-800"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </Transition>
  </button>
</template>
