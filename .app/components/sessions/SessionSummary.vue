<script setup lang="ts">
defineProps<{
  summary: string;
  goals: Array<string>;
  progress: Array<string>;
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
      خلاصه جلسه
    </BaseHeading>
    
    <!-- Summary box -->
    <div class="bg-info-100 dark:bg-info-500/10 border-info-200 dark:border-info-500/20 mb-4 rounded-lg border p-4">
      <div class="flex items-start gap-3">
        <div class="text-info-500 dark:text-info-400 shrink-0">
          <Icon name="ph:info-duotone" class="size-5" />
        </div>
        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
          {{ summary }}
        </BaseParagraph>
      </div>
    </div>
    
    <!-- Goals and Progress sections -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Goals section -->
      <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4">
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xl">🎯</span>
          <BaseHeading
            tag="h4"
            size="sm"
            weight="medium"
          >
            اهداف اصلی
          </BaseHeading>
        </div>
        <ul class="space-y-2 ps-4">
          <li 
            v-for="(goal, index) in goals" 
            :key="index"
            class="text-muted-600 dark:text-muted-300 text-sm"
          >
            {{ goal }}
          </li>
        </ul>
      </div>
      
      <!-- Progress section -->
      <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4">
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xl">📈</span>
          <BaseHeading
            tag="h4"
            size="sm"
            weight="medium"
          >
            پیشرفت‌ها
          </BaseHeading>
        </div>
        <ul class="space-y-2 ps-4">
          <li 
            v-for="(item, index) in progress" 
            :key="index"
            class="text-muted-600 dark:text-muted-300 text-sm"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
