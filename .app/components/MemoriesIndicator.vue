<script setup lang="ts">
const props = defineProps<{ text: string; categories: string[]; importance: number; open?: boolean }>()
const emit = defineEmits(['close'])
const isOpen = ref<boolean>(props.open ?? true)
watch(() => props.open, v => { if (typeof v === 'boolean') isOpen.value = v })
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed bottom-24 left-4 z-40">
      <div class="bg-white dark:bg-muted-800 shadow-xl border border-muted-200 dark:border-muted-700 rounded-xl p-4 w-[360px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="ph:books-duotone" class="text-primary-500 size-5" />
            <span class="text-sm font-medium">حافظه جدید تشخیص داده شد</span>
          </div>
          <BaseTag color="primary" size="sm">{{ Math.round(props.importance * 100) }}/100</BaseTag>
        </div>
        <div class="mt-2 text-sm line-clamp-3">{{ props.text }}</div>
        <div class="mt-2 flex gap-1 flex-wrap">
          <BaseTag v-for="c in props.categories" :key="c" color="info" size="xs">{{ c }}</BaseTag>
        </div>
        <div class="mt-3 text-end">
          <BaseButton size="sm" @click="isOpen = false; emit('close')">بستن</BaseButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


