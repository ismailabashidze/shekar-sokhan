<script setup lang="ts">
defineProps<{
  stages: Array<{
    emoji: string;
    label: string;
    color?: string;
    highlighted?: boolean;
  }>;
}>();
</script>

<template>
  <div class="border-muted-200 dark:border-muted-700 mt-6 border-t pt-6">
    <BaseHeading
      tag="h3"
      size="lg"
      weight="medium"
      class="mb-4"
    >
      سفر احساسی
    </BaseHeading>
    <div class="mb-6">
      <div class="relative flex items-center justify-between px-2 py-4">
        <!-- Timeline bar -->
        <div class="bg-muted-200 dark:bg-muted-700 absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
        
        <!-- Emotion stages -->
        <div 
          v-for="(stage, index) in stages" 
          :key="index"
          class="relative z-10 flex flex-col items-center"
        >
          <div 
            class="flex size-10 items-center justify-center rounded-full"
            :class="[
              stage.highlighted 
                ? `bg-${stage.color || 'primary'}-100 dark:bg-${stage.color || 'primary'}-500/20 border-${stage.color || 'primary'}-500 border-2` 
                : 'bg-muted-100 dark:bg-muted-700'
            ]"
          >
            <span class="mt-1.5 text-2xl">{{ stage.emoji }}</span>
          </div>
          <span class="text-muted-500 dark:text-muted-400 mt-2 text-xs font-medium">{{ stage.label }}</span>
        </div>
      </div>
    </div>
    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
      <slot></slot>
    </BaseParagraph>
  </div>
</template>
