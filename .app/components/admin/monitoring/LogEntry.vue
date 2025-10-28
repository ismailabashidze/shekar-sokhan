<template>
  <div class="hover:bg-muted-50 dark:hover:bg-muted-800 p-4 transition-colors">
    <div class="flex items-start gap-3">
      <!-- Level Indicator -->
      <div
        class="mt-2 size-2 shrink-0 rounded-full"
        :class="{
          'bg-danger-500': log.level === 'CRITICAL' || log.level === 'ERROR',
          'bg-warning-500': log.level === 'WARN',
          'bg-blue-500': log.level === 'INFO',
          'bg-muted-400': log.level === 'DEBUG'
        }"
      />

      <div class="min-w-0 flex-1">
        <!-- Log Header -->
        <div class="mb-1 flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="{
              'bg-danger-100 text-danger-800': log.level === 'CRITICAL' || log.level === 'ERROR',
              'bg-warning-100 text-warning-800': log.level === 'WARN',
              'bg-blue-100 text-blue-800': log.level === 'INFO',
              'bg-muted-100 text-muted-700': log.level === 'DEBUG'
            }"
          >
            {{ log.level }}
          </span>

          <span class="bg-muted-100 text-muted-700 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
            {{ formatCategory(log.category) }}
          </span>

          <span class="text-muted-500 text-xs">
            {{ formatDate(log.timestamp) }}
          </span>
        </div>

        <!-- Log Message -->
        <p class="text-muted-800 dark:text-muted-200 mb-2 text-sm">
          {{ log.message }}
        </p>

        <!-- Log Details -->
        <div class="text-muted-500 flex items-center gap-4 text-xs">
          <span v-if="log.component">{{ log.component }}</span>
          <span v-if="log.method">{{ log.method }}</span>
          <span v-if="log.duration_ms">{{ log.duration_ms }}ms</span>
          <span v-if="log.user_id">User: {{ log.user_id.substring(0, 8) }}...</span>
        </div>

        <!-- Expandable Details -->
        <div v-if="hasExpandableDetails" class="mt-2">
          <button
            class="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-xs font-medium"
            @click="expanded = !expanded"
          >
            <Icon
              :name="expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'"
              class="size-3"
            />
            {{ expanded ? 'Hide' : 'Show' }} Details
          </button>

          <div v-if="expanded" class="bg-muted-100 dark:bg-muted-700 mt-2 rounded-lg p-3">
            <!-- Error Stack -->
            <div v-if="log.error_stack" class="mb-3">
              <h5 class="text-muted-700 dark:text-muted-300 mb-1 text-xs font-medium">
                Error Stack:
              </h5>
              <pre class="text-muted-600 dark:text-muted-400 whitespace-pre-wrap font-mono text-xs">{{ log.error_stack }}</pre>
            </div>

            <!-- Additional Details -->
            <div v-if="log.details && Object.keys(log.details).length > 0" class="mb-3">
              <h5 class="text-muted-700 dark:text-muted-300 mb-1 text-xs font-medium">
                Details:
              </h5>
              <pre class="text-muted-600 dark:text-muted-400 whitespace-pre-wrap font-mono text-xs">{{ JSON.stringify(log.details, null, 2) }}</pre>
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
      <div class="ml-4 flex items-center gap-2">
        <button
          class="text-muted-400 hover:text-muted-600 hover:bg-muted-100 rounded p-1 transition-colors"
          title="Copy log entry"
          @click="copyLogEntry"
        >
          <Icon name="lucide:copy" class="size-4" />
        </button>

        <button
          v-if="log.level === 'ERROR' || log.level === 'CRITICAL'"
          class="text-muted-400 hover:text-muted-600 hover:bg-muted-100 rounded p-1 transition-colors"
          title="Report issue"
          @click="reportIssue"
        >
          <Icon name="lucide:flag" class="size-4" />
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
    props.log.error_stack
    || (props.log.details && Object.keys(props.log.details).length > 0)
    || props.log.memory_usage
    || props.log.user_agent
    || props.log.ip_address
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
  }
  else if (diffMins < 60) {
    return `${diffMins}m ago`
  }
  else if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  else {
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
      error_stack: props.log.error_stack,
    }

    await navigator.clipboard.writeText(JSON.stringify(logData, null, 2))
    console.log('Log entry copied to clipboard')
  }
  catch (error) {
    console.error('Failed to copy log entry:', error)
  }
}

const reportIssue = () => {
  // In a real implementation, this might open a modal or navigate to an issue reporting page
  console.log('Report issue for log:', props.log.id)
}
</script>
