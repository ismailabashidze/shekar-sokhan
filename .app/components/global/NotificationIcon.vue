<script setup lang="ts">
// const { open } = usePanels()

const { unreadCount } = useNotifications()

// const openNotifications = () => {
//   open('notifications')
// }
</script>

<template>
  <button
    type="button"
    class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 focus:ring-primary-500/50 group relative flex size-12 cursor-pointer items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2"
    @click="openNotifications"
  >
    <Icon
      name="ph:bell"
      class="size-6 transition-transform duration-300 group-hover:rotate-12"
      :class="unreadCount > 0 ? 'animate-wiggle text-primary-500' : ''"
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
        class="from-danger-500 to-danger-600 dark:ring-muted-800 absolute -right-1 -top-1 z-10 flex size-5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r text-xs font-bold text-white shadow-lg ring-2 ring-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </Transition>

    <!-- Ping animation for new notifications -->
    <div
      v-if="unreadCount > 0"
      class="bg-danger-500 absolute -right-1 -top-1 size-5 animate-ping rounded-full opacity-30"
    />
  </button>
</template>

<style scoped>
/* Wiggle animation for bell icon */
@keyframes wiggle {
  0%, 7% { transform: rotateZ(0); }
  15% { transform: rotateZ(-15deg); }
  20% { transform: rotateZ(10deg); }
  25% { transform: rotateZ(-10deg); }
  30% { transform: rotateZ(6deg); }
  35% { transform: rotateZ(-4deg); }
  40%, 100% { transform: rotateZ(0); }
}

.animate-wiggle {
  animation: wiggle 2s ease-in-out infinite;
  transform-origin: center top;
}

/* Slight delay for continuous animation */
.animate-wiggle:hover {
  animation-duration: 0.5s;
}
</style>
