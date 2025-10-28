<template>
  <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex size-8 items-center justify-center rounded-lg"
          :class="{
            'bg-success-100 text-success-600': isHealthy,
            'bg-warning-100 text-warning-600': isWarning,
            'bg-danger-100 text-danger-600': isCritical
          }"
        >
          <Icon :name="icon" class="size-4" />
        </div>

        <div>
          <h4 class="text-muted-800 dark:text-muted-100 text-sm font-medium">
            {{ name }}
          </h4>
          <p class="text-muted-600 dark:text-muted-400 text-xs capitalize">
            {{ status }}
          </p>
        </div>
      </div>

      <!-- Status Indicator -->
      <div
        class="size-3 rounded-full"
        :class="{
          'bg-success-500': isHealthy,
          'bg-warning-500': isWarning,
          'bg-danger-500': isCritical
        }"
      />
    </div>

    <!-- Details -->
    <div v-if="details && Object.keys(details).length > 0" class="space-y-1">
      <div
        v-for="(value, key) in details"
        :key="key"
        class="flex justify-between text-xs"
      >
        <span class="text-muted-600 dark:text-muted-400">{{ key }}:</span>
        <span class="text-muted-800 dark:text-muted-200 font-medium">{{ value }}</span>
      </div>
    </div>

    <!-- Last Check Time -->
    <div class="border-muted-200 dark:border-muted-700 mt-3 border-t pt-3">
      <p class="text-muted-500 text-xs">
        Last checked: {{ formatLastCheck() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  status: string;
  icon: string;
  details?: Record<string, string>;
}

const props = defineProps<Props>();

const isHealthy = computed(() => {
  const healthyStatuses = ['up', 'active', 'operational'];
  return healthyStatuses.includes(props.status.toLowerCase());
});

const isWarning = computed(() => {
  const warningStatuses = ['slow', 'degraded', 'inactive'];
  return warningStatuses.includes(props.status.toLowerCase());
});

const isCritical = computed(() => {
  const criticalStatuses = ['down', 'error', 'failed'];
  return criticalStatuses.includes(props.status.toLowerCase());
});

const formatLastCheck = (): string => {
  // For now, return "Just now" since we're checking in real-time
  // In a real implementation, you might track actual check times
  return 'Just now';
};
</script>
