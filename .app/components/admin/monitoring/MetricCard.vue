<template>
  <div class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex size-10 items-center justify-center rounded-lg"
          :class="{
            'bg-success-100 text-success-600': status === 'good',
            'bg-warning-100 text-warning-600': status === 'warning',
            'bg-danger-100 text-danger-600': status === 'critical',
            'bg-muted-100 text-muted-600': status === 'neutral'
          }"
        >
          <Icon :name="icon" class="size-5" />
        </div>

        <div>
          <h3 class="text-muted-600 dark:text-muted-400 text-sm font-medium">
            {{ title }}
          </h3>
          <div class="flex items-baseline gap-1">
            <span class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
              {{ formatValue(value) }}
            </span>
            <span class="text-muted-500 text-sm">{{ unit }}</span>
          </div>
        </div>
      </div>

      <!-- Trend Indicator -->
      <div
        v-if="trend !== 'neutral'"
        class="flex items-center gap-1"
        :class="{
          'text-success-600': trend === 'up' && (title.includes('Rate') && !title.includes('Error')),
          'text-danger-600': trend === 'up' && title.includes('Error'),
          'text-danger-600': trend === 'down' && (title.includes('Rate') && !title.includes('Error')),
          'text-success-600': trend === 'down' && title.includes('Error'),
          'text-muted-500': trend === 'neutral'
        }"
      >
        <Icon
          :name="trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'"
          class="size-4"
        />
      </div>
    </div>

    <!-- Status Bar -->
    <div class="mt-4">
      <div class="bg-muted-200 dark:bg-muted-700 h-2 w-full rounded-full">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="{
            'bg-success-500': status === 'good',
            'bg-warning-500': status === 'warning',
            'bg-danger-500': status === 'critical',
            'bg-muted-400': status === 'neutral'
          }"
          :style="{ width: getProgressWidth() }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical' | 'neutral';
  icon: string;
}

const props = defineProps<Props>();

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  else if (value % 1 !== 0) {
    return value.toFixed(1);
  }
  return value.toString();
};

const getProgressWidth = (): string => {
  if (props.unit === '%') {
    return `${Math.min(props.value, 100)}%`;
  }

  // For other metrics, show relative progress based on status
  switch (props.status) {
    case 'good':
      return '100%';
    case 'warning':
      return '70%';
    case 'critical':
      return '30%';
    default:
      return '50%';
  }
};
</script>
