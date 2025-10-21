<template>
  <div class="p-4 hover:bg-muted-50 dark:hover:bg-muted-800 transition-colors">
    <div class="flex items-start gap-3">
      <!-- Level Indicator -->
      <div 
        class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
        :class="{
          'bg-danger-500': log.level === 'CRITICAL' || log.level === 'ERROR',
          'bg-warning-500': log.level === 'WARN',
          'bg-blue-500': log.level === 'INFO',
          'bg-muted-400': log.level === 'DEBUG'
        }"
      />
      
      <div class="flex-1 min-w-0">
        <!-- Log Header -->
        <div class="flex items-center gap-2 mb-1">
          <span 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-danger-100 text-danger-800': log.level === 'CRITICAL' || log.level === 'ERROR',
              'bg-warning-100 text-warning-800': log.level === 'WARN',
              'bg-blue-100 text-blue-800': log.level === 'INFO',
              'bg-muted-100 text-muted-700': log.level === 'DEBUG'
            }"
          >
            {{ log.level }}
          </span>
          
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted-100 text-muted-700">
            {{ formatCategory(log.category) }}
          </span>
          
          <span class="text-xs text-muted-500">
            {{ formatDate(log.timestamp) }}
          </span>
        </div>
        
        <!-- Log Message -->
        <p class="text-sm text-muted-800 dark:text-muted-200 mb-2">
          {{ log.message }}
        </p>
        
        <!-- Log Details -->
        <div class="flex items-center gap-4 text-xs text-muted-500">
          <span v-if="log.component">{{ log.component }}</span>
          <span v-if="log.method">{{ log.method }}</span>
          <span v-if="log.duration_ms">{{ log.duration_ms }}ms</span>
          <span v-if="log.user_id">User: {{ log.user_id.substring(0, 8) }}...</span>
        </div>
        
        <!-- Expandable Details -->
        <div v-if="hasExpandableDetails" class="mt-2">
          <button
            @click="expanded = !expanded"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <Icon 
              :name="expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
              class="w-3 h-3" 
            />
            {{ expanded ? 'Hide' : 'Show' }} Details
          </button>
          
          <div v-if="expanded" class="mt-2 p-3 bg-muted-100 dark:bg-muted-700 rounded-lg">
            <!-- Error Stack -->
            <div v-if="log.error_stack" class="mb-3">
              <h5 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-1">
                Error Stack:
              </h5>
              <pre class="text-xs text-muted-600 dark:text-muted-400 whitespace-pre-wrap font-mono">{{ log.error_stack }}</pre>
            </div>
            
            <!-- Additional Details -->
            <div v-if="log.details && Object.keys(log.details).length > 0" class="mb-3">
              <h5 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-1">
                Details:
              </h5>
              <pre class="text-xs text-muted-600 dark:text-muted-400 whitespace-pre-wrap font-mono">{{ JSON.stringify(log.details, null, 2) }}</pre>
            </div>
            
            <!-- System Info -->
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div v-if="log.memory_usage">
                <span class="text-muted-500">Memory:</span>
                <span class="text-muted-700 dark:text-muted-300 ml-1">{{ log.memory_usage }}MB</span>
              </div>
              <div v-if="log.user_agent">
                <span class="text-muted-500">User Agent:</span>
                <span class="text-muted-700 dark:text-muted-300 ml-1">{{ truncateUserAgent(log.user_agent) }}</span>
              </div>
              <div v-if="log.ip_address">
                <span class="text-muted-500">IP:</span>
                <span class="text-muted-700 dark:text-muted-300 ml-1">{{ log.ip_address }}</span>
              </div>
              <div v-if="log.session_id">
                <span class="text-muted-500">Session:</span>
                <span class="text-muted-700 dark:text-muted-300 ml-1">{{ log.session_id.substring(0, 8) }}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="copyLogEntry"
          class="p-1 text-muted-400 hover:text-muted-600 rounded hover:bg-muted-100 transition-colors"
          title="Copy log entry"
        >
          <Icon name="lucide:copy" class="w-4 h-4" />
        </button>
        
        <button
          v-if="log.level === 'ERROR' || log.level === 'CRITICAL'"
          @click="reportIssue"
          class="p-1 text-muted-400 hover:text-muted-600 rounded hover:bg-muted-100 transition-colors"
          title="Report issue"
        >
          <Icon name="lucide:flag" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogEntry as LogEntryType } from '~/composables/useNotificationLogger'

interface Props {
  log: LogEntryType
}

const props = defineProps<Props>()

const expanded = ref(false)

const hasExpandableDetails = computed(() => {
  return !!(
    props.log.error_stack ||
    (props.log.details && Object.keys(props.log.details).length > 0) ||
    props.log.memory_usage ||
    props.log.user_agent ||
    props.log.ip_address
  )
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return date.toLocaleString()
  }
}

const formatCategory = (category: string): string => {
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const truncateUserAgent = (userAgent: string): string => {
  if (userAgent.length <= 50) return userAgent
  return userAgent.substring(0, 47) + '...'
}

const copyLogEntry = async () => {
  try {
    const logData = {
      timestamp: props.log.timestamp,
      level: props.log.level,
      category: props.log.category,
      message: props.log.message,
      component: props.log.component,
      method: props.log.method,
      details: props.log.details,
      error_stack: props.log.error_stack
    }
    
    await navigator.clipboard.writeText(JSON.stringify(logData, null, 2))
    console.log('Log entry copied to clipboard')
  } catch (error) {
    console.error('Failed to copy log entry:', error)
  }
}

const reportIssue = () => {
  // In a real implementation, this might open a modal or navigate to an issue reporting page
  console.log('Report issue for log:', props.log.id)
}
</script>