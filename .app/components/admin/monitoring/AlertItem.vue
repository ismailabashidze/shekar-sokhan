<template>
  <div class="p-4 hover:bg-muted-50 dark:hover:bg-muted-800 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <!-- Severity Indicator -->
        <div 
          class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
          :class="{
            'bg-danger-500': alert.severity === 'critical',
            'bg-warning-500': alert.severity === 'high',
            'bg-yellow-500': alert.severity === 'medium',
            'bg-blue-500': alert.severity === 'low'
          }"
        />
        
        <div class="flex-1 min-w-0">
          <!-- Alert Header -->
          <div class="flex items-center gap-2 mb-1">
            <h4 class="text-sm font-medium text-muted-800 dark:text-muted-100">
              {{ alert.title }}
            </h4>
            
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-danger-100 text-danger-800': alert.severity === 'critical',
                'bg-warning-100 text-warning-800': alert.severity === 'high',
                'bg-yellow-100 text-yellow-800': alert.severity === 'medium',
                'bg-blue-100 text-blue-800': alert.severity === 'low'
              }"
            >
              {{ alert.severity }}
            </span>
            
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted-100 text-muted-700">
              {{ alert.type }}
            </span>
          </div>
          
          <!-- Alert Message -->
          <p class="text-sm text-muted-600 dark:text-muted-400 mb-2">
            {{ alert.message }}
          </p>
          
          <!-- Alert Details -->
          <div class="flex items-center gap-4 text-xs text-muted-500">
            <span>{{ alert.component }}</span>
            <span>{{ formatDate(alert.triggered_at) }}</span>
            <span v-if="alert.metric_name && alert.metric_value !== undefined">
              {{ alert.metric_name }}: {{ formatMetricValue(alert.metric_value, alert.metric_name) }}
            </span>
          </div>
          
          <!-- Acknowledgment Status -->
          <div v-if="alert.acknowledged_at" class="mt-2 text-xs text-success-600">
            <Icon name="lucide:check" class="w-3 h-3 inline mr-1" />
            Acknowledged {{ formatDate(alert.acknowledged_at) }}
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-2 ml-4">
        <button
          v-if="!alert.acknowledged_at"
          @click="$emit('acknowledge', alert.id)"
          class="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
        >
          Acknowledge
        </button>
        
        <button
          v-if="!alert.resolved_at"
          @click="$emit('resolve', alert.id)"
          class="text-xs text-success-600 hover:text-success-700 font-medium px-2 py-1 rounded hover:bg-success-50 transition-colors"
        >
          Resolve
        </button>
        
        <!-- Menu for more actions -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="p-1 text-muted-400 hover:text-muted-600 rounded hover:bg-muted-100 transition-colors"
          >
            <Icon name="lucide:more-horizontal" class="w-4 h-4" />
          </button>
          
          <div
            v-if="showMenu"
            v-click-outside="() => showMenu = false"
            class="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-lg shadow-lg z-10"
          >
            <button
              @click="copyAlertDetails"
              class="w-full text-left px-3 py-2 text-xs text-muted-700 dark:text-muted-300 hover:bg-muted-50 dark:hover:bg-muted-700 transition-colors"
            >
              Copy Details
            </button>
            <button
              @click="viewAlertHistory"
              class="w-full text-left px-3 py-2 text-xs text-muted-700 dark:text-muted-300 hover:bg-muted-50 dark:hover:bg-muted-700 transition-colors"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemAlert } from '~/composables/useNotificationMonitoring'

interface Props {
  alert: SystemAlert
}

interface Emits {
  acknowledge: [alertId: string]
  resolve: [alertId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showMenu = ref(false)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const formatMetricValue = (value: number, metricName?: string): string => {
  if (!metricName) return value.toString()
  
  if (metricName.includes('rate') || metricName.includes('percentage')) {
    return `${value.toFixed(1)}%`
  } else if (metricName.includes('time') || metricName.includes('latency')) {
    return `${Math.round(value)}ms`
  } else if (metricName.includes('memory') || metricName.includes('usage')) {
    return `${Math.round(value)}MB`
  }
  
  return value.toString()
}

const copyAlertDetails = async () => {
  try {
    const details = {
      title: props.alert.title,
      message: props.alert.message,
      severity: props.alert.severity,
      type: props.alert.type,
      component: props.alert.component,
      triggered_at: props.alert.triggered_at,
      metric_name: props.alert.metric_name,
      metric_value: props.alert.metric_value,
      threshold: props.alert.threshold
    }
    
    await navigator.clipboard.writeText(JSON.stringify(details, null, 2))
    showMenu.value = false
    
    // You could add a toast notification here
    console.log('Alert details copied to clipboard')
  } catch (error) {
    console.error('Failed to copy alert details:', error)
  }
}

const viewAlertHistory = () => {
  // Navigate to alert history page or open modal
  showMenu.value = false
  console.log('View alert history for:', props.alert.id)
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>