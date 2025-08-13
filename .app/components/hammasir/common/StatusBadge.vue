<script setup lang="ts">
interface Props {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: string
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  icon: '',
  pulse: false,
})

// Auto-detect variant based on status
const computedVariant = computed(() => {
  if (props.variant !== 'default') return props.variant
  
  const status = props.status.toLowerCase()
  
  // Success variants
  if (['completed', 'active', 'verified', 'approved', 'تکمیل شده', 'فعال', 'تأیید شده', 'تایید شده'].includes(status)) {
    return 'success'
  }
  
  // Warning variants
  if (['pending', 'in_progress', 'waiting', 'review', 'در انتظار', 'در حال بررسی', 'در حال انجام'].includes(status)) {
    return 'warning'
  }
  
  // Error variants
  if (['rejected', 'suspended', 'deactivated', 'failed', 'error', 'رد شده', 'معلق', 'غیرفعال', 'خطا'].includes(status)) {
    return 'error'
  }
  
  // Info variants
  if (['draft', 'new', 'info', 'پیش‌نویس', 'جدید', 'اطلاعات'].includes(status)) {
    return 'info'
  }
  
  // Gray variants
  if (['disabled', 'locked', 'archived', 'غیرفعال', 'قفل شده', 'آرشیو شده'].includes(status)) {
    return 'gray'
  }
  
  return 'default'
})

// Auto-detect icon based on status
const computedIcon = computed(() => {
  if (props.icon) return props.icon
  
  const status = props.status.toLowerCase()
  
  // Status-based icons
  if (['completed', 'active', 'verified', 'approved', 'تکمیل شده', 'فعال', 'تأیید شده', 'تایید شده'].includes(status)) {
    return 'ph:check-circle'
  }
  
  if (['pending', 'در انتظار'].includes(status)) {
    return 'ph:clock'
  }
  
  if (['in_progress', 'در حال انجام'].includes(status)) {
    return 'ph:spinner'
  }
  
  if (['waiting', 'review', 'در حال بررسی'].includes(status)) {
    return 'ph:eye'
  }
  
  if (['rejected', 'failed', 'error', 'رد شده', 'خطا'].includes(status)) {
    return 'ph:x-circle'
  }
  
  if (['suspended', 'معلق'].includes(status)) {
    return 'ph:pause-circle'
  }
  
  if (['deactivated', 'disabled', 'غیرفعال'].includes(status)) {
    return 'ph:minus-circle'
  }
  
  if (['locked', 'قفل شده'].includes(status)) {
    return 'ph:lock'
  }
  
  if (['draft', 'پیش‌نویس'].includes(status)) {
    return 'ph:note'
  }
  
  if (['new', 'جدید'].includes(status)) {
    return 'ph:plus-circle'
  }
  
  if (['archived', 'آرشیو شده'].includes(status)) {
    return 'ph:archive'
  }
  
  return 'ph:circle'
})

// Size classes
const sizeClasses = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
}

const iconSizes = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

// Enhanced Variant classes with gradients and shadows
const variantClasses = {
  default: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50 shadow-sm',
  success: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 dark:from-green-900/40 dark:to-emerald-800/40 dark:text-green-200 border border-green-200/50 dark:border-green-700/50 shadow-sm shadow-green-100/50 dark:shadow-green-900/20',
  warning: 'bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 dark:from-yellow-900/40 dark:to-orange-800/40 dark:text-yellow-200 border border-orange-200/50 dark:border-orange-700/50 shadow-sm shadow-orange-100/50 dark:shadow-orange-900/20',
  error: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 dark:from-red-900/40 dark:to-rose-800/40 dark:text-red-200 border border-red-200/50 dark:border-red-700/50 shadow-sm shadow-red-100/50 dark:shadow-red-900/20',
  info: 'bg-gradient-to-r from-indigo-100 to-purple-200 text-indigo-800 dark:from-indigo-900/40 dark:to-purple-800/40 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm shadow-indigo-100/50 dark:shadow-indigo-900/20',
  gray: 'bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 dark:from-gray-700/80 dark:to-slate-700/80 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50 shadow-sm'
}

// Status text mapping for Persian
const statusLabels: Record<string, string> = {
  // English to Persian
  'completed': 'تکمیل شده',
  'active': 'فعال',
  'verified': 'تأیید شده',
  'approved': 'تایید شده',
  'pending': 'در انتظار',
  'in_progress': 'در حال انجام',
  'waiting': 'در انتظار',
  'review': 'در حال بررسی',
  'rejected': 'رد شده',
  'suspended': 'معلق',
  'deactivated': 'غیرفعال',
  'failed': 'ناموفق',
  'error': 'خطا',
  'disabled': 'غیرفعال',
  'locked': 'قفل شده',
  'archived': 'آرشیو شده',
  'draft': 'پیش‌نویس',
  'new': 'جدید',
  
  // Status codes
  'ACTIVE': 'فعال',
  'PENDING_VERIFICATION': 'در انتظار تأیید',
  'SUSPENDED': 'معلق',
  'DEACTIVATED': 'غیرفعال',
  'NOT_STARTED': 'شروع نشده',
  'IN_PROGRESS': 'در حال انجام',
  'COMPLETED': 'تکمیل شده',
  'BLOCKED': 'مسدود شده',
}

const displayText = computed(() => {
  return statusLabels[props.status] || props.status
})
</script>

<template>
  <span 
    class="inline-flex items-center font-semibold rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
    :class="[
      sizeClasses[size],
      variantClasses[computedVariant],
      {
        'animate-pulse': pulse,
        'hover:shadow-lg': !pulse
      }
    ]"
  >
    <Icon 
      v-if="computedIcon"
      :name="computedIcon"
      :class="[
        iconSizes[size],
        {
          'animate-spin': computedIcon === 'ph:spinner',
          'me-1.5': displayText,
          'drop-shadow-sm': true
        }
      ]"
    />
    
    <span class="drop-shadow-sm">{{ displayText }}</span>
  </span>
</template>