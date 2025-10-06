<template>
  <button
    class="bg-muted-500 hover:bg-muted-600 flex size-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
    title="بازگشت"
    @click="goBack"
  >
    <Icon name="ph:arrow-left" class="size-6" />
  </button>
</template>

<script setup lang="ts">
const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
/* Custom styles if needed */
</style>