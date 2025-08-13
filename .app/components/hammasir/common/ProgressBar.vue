<script setup lang="ts">
interface Props {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showPercentage?: boolean
  label?: string
  animated?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  variant: 'default',
  size: 'md',
  showLabel: false,
  showPercentage: false,
  label: '',
  animated: false,
  striped: false,
})

// Calculate percentage
const percentage = computed(() => {
  const percent = Math.min(Math.max((props.value / props.max) * 100, 0), 100)
  return Math.round(percent)
})

// Size classes
const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const labelSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

// Variant colors
const variantClasses = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-indigo-500'
}

const variantBackgrounds = {
  default: 'bg-blue-100 dark:bg-blue-900/30',
  success: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  error: 'bg-red-100 dark:bg-red-900/30',
  info: 'bg-indigo-100 dark:bg-indigo-900/30'
}

// Animation and striped classes
const progressClasses = computed(() => {
  const classes = [variantClasses[props.variant]]
  
  if (props.animated) {
    classes.push('animate-pulse')
  }
  
  if (props.striped) {
    classes.push('bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]')
  }
  
  return classes
})

// Get status text
const statusText = computed(() => {
  if (percentage.value === 100) return 'تکمیل شده'
  if (percentage.value >= 75) return 'تقریباً تکمیل'
  if (percentage.value >= 50) return 'در حال پیشرفت'
  if (percentage.value >= 25) return 'شروع شده'
  if (percentage.value > 0) return 'آغاز شده'
  return 'شروع نشده'
})
</script>

<template>
  <div class="w-full">
    <!-- Label and Percentage -->
    <div v-if="showLabel || showPercentage || label" class="flex justify-between items-center mb-2">
      <span 
        v-if="showLabel || label" 
        class="font-medium text-gray-700 dark:text-gray-300"
        :class="labelSizes[size]"
      >
        {{ label || statusText }}
      </span>
      
      <span 
        v-if="showPercentage" 
        class="font-bold text-gray-800 dark:text-gray-200"
        :class="[labelSizes[size], variantClasses[variant].replace('bg-', 'text-')]"
      >
        {{ percentage }}%
      </span>
    </div>
    
    <!-- Progress Bar Container -->
    <div 
      class="w-full rounded-full overflow-hidden transition-all duration-300"
      :class="[
        sizeClasses[size],
        variantBackgrounds[variant]
      ]"
    >
      <!-- Progress Bar Fill -->
      <div 
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="progressClasses"
        :style="{ width: `${percentage}%` }"
      >
        <!-- Striped Animation -->
        <div 
          v-if="striped && animated"
          class="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[slide_1s_linear_infinite]"
        ></div>
      </div>
    </div>
    
    <!-- Additional Info Slot -->
    <div v-if="$slots.default" class="mt-2">
      <slot :percentage="percentage" :status-text="statusText" :value="value" :max="max" />
    </div>
  </div>
</template>

<style scoped>
@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>