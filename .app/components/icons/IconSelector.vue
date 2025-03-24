<template>
  <div class="bg-muted-800/50 fixed inset-0 z-50 flex items-center justify-center">
    <BaseCard class="flex h-[80vh] w-[90vw] max-w-2xl flex-col gap-4 p-6">
      <div class="flex items-center justify-between">
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          class="text-muted-800 dark:text-muted-100"
        >
          انتخاب آیکون
        </BaseHeading>
        <button class="text-muted-400 hover:text-muted-600" @click="$emit('close')">
          <Icon name="ph:x" class="size-5" />
        </button>
      </div>

      <BaseInput
        v-model="search"
        placeholder="جستجوی آیکون..."
        rounded="lg"
      >
        <template #prefix>
          <Icon name="ph:magnifying-glass" class="text-muted-400 size-5" />
        </template>
      </BaseInput>

      <div class="grid flex-1 grid-cols-6 gap-2 overflow-y-auto p-2">
        <button
          v-for="icon in filteredIcons"
          :key="icon"
          class="hover:border-primary-500 hover:bg-primary-50 dark:border-muted-600 dark:bg-muted-700 dark:hover:border-primary-500 dark:hover:bg-primary-500/20 flex aspect-square items-center justify-center rounded-lg border bg-white transition-colors"
          @click="$emit('select', icon)"
        >
          <Icon :name="icon" class="text-muted-500 dark:text-muted-100 size-6" />
        </button>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineEmits(['select', 'close'])

// Common Phosphor icons - you can expand this list
const icons = [
  'ph:heart',
  'ph:house',
  'ph:user',
  'ph:users',
  'ph:book',
  'ph:books',
  'ph:graduation-cap',
  'ph:handshake',
  'ph:hands-praying',
  'ph:hand-heart',
  'ph:hand-coins',
  'ph:hand-palm',
  'ph:gift',
  'ph:leaf',
  'ph:tree',
  'ph:plant',
  'ph:sun',
  'ph:moon',
  'ph:star',
  'ph:peace',
  'ph:smiley',
  'ph:heart-straight',
  'ph:baby',
  'ph:house-line',
  'ph:mosque',
  'ph:buildings',
  'ph:bank',
  'ph:bread',
  'ph:coffee',
  'ph:flower',
  'ph:butterfly',
]

const search = ref('')

const filteredIcons = computed(() => {
  if (!search.value) return icons
  return icons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})

</script>
