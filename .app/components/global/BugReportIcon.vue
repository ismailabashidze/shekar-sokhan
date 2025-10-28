<template>
  <div
    v-if="visible"
    class="animate-pulse-slow flex size-12 cursor-pointer items-center justify-center rounded-2xl bg-yellow-500/20 text-yellow-500 shadow-lg shadow-yellow-500/20 transition-colors duration-300 hover:bg-yellow-500/30 hover:text-yellow-500"
    @click="router.push('/bug-reports/new')"
  >
    <Icon name="ph:bug" class="size-5" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 95% {
    box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4);
  }
  97.5% {
    box-shadow: 0 0 0 8px rgba(234, 179, 8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 25s infinite;
}
</style>
