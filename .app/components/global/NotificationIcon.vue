<script setup lang="ts">
  // const { open } = usePanels()

  // const { unreadCount } = useNotifications()

  // const openNotifications = () => {
  //   open('notifications')
  // }
</script>

<template></template>

<style scoped>
  /* Wiggle animation for bell icon */
  @keyframes wiggle {
    0%,
    7% {
      transform: rotateZ(0);
    }
    15% {
      transform: rotateZ(-15deg);
    }
    20% {
      transform: rotateZ(10deg);
    }
    25% {
      transform: rotateZ(-10deg);
    }
    30% {
      transform: rotateZ(6deg);
    }
    35% {
      transform: rotateZ(-4deg);
    }
    40%,
    100% {
      transform: rotateZ(0);
    }
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
