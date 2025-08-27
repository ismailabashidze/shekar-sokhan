<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex size-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
          <Icon :name="icon" class="size-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div class="mr-4">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ title }}
          </p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ value }}
          </p>
        </div>
      </div>
      <div v-if="change" class="flex items-center" :class="change > 0 ? 'text-green-600' : 'text-red-600'">
        <Icon :name="change > 0 ? 'ph:arrow-up' : 'ph:arrow-down'" class="size-4" />
        <span class="mr-1 text-sm font-medium">{{ Math.abs(change) }}%</span>
      </div>
    </div>
    <div v-if="description" class="mt-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  change?: number
  description?: string
}

withDefaults(defineProps<Props>(), {
  change: 0,
  description: ''
})
</script>