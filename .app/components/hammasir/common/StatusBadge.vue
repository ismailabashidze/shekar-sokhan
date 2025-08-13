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

// Variant classes
const variantClasses = {
  default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  info: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
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
    class="inline-flex items-center font-medium rounded-full transition-colors duration-200"
    :class="[
      sizeClasses[size],
      variantClasses[computedVariant],
      {
        'animate-pulse': pulse
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
          'me-1': displayText
        }
      ]"
    />
    
    {{ displayText }}
  </span>
</template>