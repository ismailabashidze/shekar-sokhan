<template>
  <div
    class="flex size-12 cursor-pointer items-center justify-center rounded-2xl bg-yellow-500/20 text-yellow-500 transition-colors duration-300 hover:bg-yellow-500/30 hover:text-yellow-500"
    @click="router.push('/bug-reports/new')"
  >
    <Icon name="ph:bug" class="size-5" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>
