<script setup lang="ts">
import type { UserProfile, ProfileCompletionStatus } from '~/types/hammasir'

interface Action {
  id: string
  label: string
  description?: string
  icon: string
  color: string
  variant: 'solid' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  badge?: {
    text: string
    color: string
  }
  tooltip?: string
  priority: 'primary' | 'secondary' | 'tertiary'
}

interface Props {
  profile: UserProfile
  completionStatus?: ProfileCompletionStatus
  layout?: 'horizontal' | 'vertical' | 'grid' | 'compact'
  showLabels?: boolean
  showDescriptions?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'card'
  readonly?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'export', format: 'pdf' | 'csv' | 'json'): void
  (e: 'share'): void
  (e: 'print'): void
  (e: 'delete'): void
  (e: 'archive'): void
  (e: 'duplicate'): void
  (e: 'settings'): void
  (e: 'analytics'): void
  (e: 'handbook'): void
  (e: 'matching'): void
  (e: 'notifications'): void
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  showLabels: true,
  showDescriptions: false,
  size: 'md',
  variant: 'default',
  readonly: false,
  loading: false
})

const emit = defineEmits<Emits>()

// Generate actions based on profile status and completion
const actions = computed<Action[]>(() => {
  const actionList: Action[] = []

  // Primary Actions
  if (!props.readonly) {
    actionList.push({
      id: 'edit',
      label: 'ویرایش پروفایل',
      description: 'ویرایش و به‌روزرسانی اطلاعات',
      icon: 'ph:pencil',
      color: 'blue',
      variant: 'solid',
      priority: 'primary',
      onClick: () => emit('edit')
    })
  }

  // Analytics (if profile is complete enough)
  const completionPercentage = props.completionStatus?.overallPercentage || 0
  if (completionPercentage >= 50) {
    actionList.push({
      id: 'analytics',
      label: 'تحلیل‌ها',
      description: 'مشاهده آمار و تحلیل‌های پروفایل',
      icon: 'ph:chart-pie',
      color: 'purple',
      variant: 'outline',
      priority: 'primary',
      onClick: () => emit('analytics')
    })
  }

  // Handbook (if profile has enough data for analysis)
  if (completionPercentage >= 70) {
    actionList.push({
      id: 'handbook',
      label: 'راهنمای شخصی',
      description: 'توصیه‌ها و راهنمای اختصاصی',
      icon: 'ph:book-open',
      color: 'green',
      variant: 'outline',
      priority: 'primary',
      onClick: () => emit('handbook'),
      badge: completionPercentage >= 90 ? { text: 'جدید', color: 'green' } : undefined
    })
  }

  // Matching (if profile is verified and complete)
  if (props.profile.status === 'VERIFIED' && completionPercentage >= 80) {
    actionList.push({
      id: 'matching',
      label: 'انطباق‌یابی',
      description: 'یافتن انطباق‌های مناسب',
      icon: 'ph:users',
      color: 'indigo',
      variant: 'solid',
      priority: 'primary',
      onClick: () => emit('matching')
    })
  }

  // Secondary Actions
  actionList.push({
    id: 'share',
    label: 'اشتراک‌گذاری',
    description: 'اشتراک‌گذاری پروفایل با دیگران',
    icon: 'ph:share',
    color: 'gray',
    variant: 'outline',
    priority: 'secondary',
    onClick: () => emit('share')
  })

  // Export Options
  actionList.push({
    id: 'export',
    label: 'دانلود',
    description: 'دانلود گزارش پروفایل',
    icon: 'ph:download',
    color: 'gray',
    variant: 'outline',
    priority: 'secondary',
    onClick: () => {
      // For now, default to PDF
      emit('export', 'pdf')
    }
  })

  actionList.push({
    id: 'print',
    label: 'چاپ',
    description: 'چاپ اطلاعات پروفایل',
    icon: 'ph:printer',
    color: 'gray',
    variant: 'ghost',
    priority: 'tertiary',
    onClick: () => emit('print')
  })

  // Settings
  actionList.push({
    id: 'settings',
    label: 'تنظیمات',
    description: 'تنظیمات پروفایل و حریم خصوصی',
    icon: 'ph:gear',
    color: 'gray',
    variant: 'ghost',
    priority: 'secondary',
    onClick: () => emit('settings')
  })

  // Notifications
  actionList.push({
    id: 'notifications',
    label: 'اطلاعیه‌ها',
    description: 'مدیریت اطلاعیه‌ها و پیام‌ها',
    icon: 'ph:bell',
    color: 'gray',
    variant: 'ghost',
    priority: 'tertiary',
    onClick: () => emit('notifications')
  })

  // Destructive Actions (only for non-readonly)
  if (!props.readonly) {
    actionList.push({
      id: 'archive',
      label: 'آرشیو',
      description: 'انتقال پروفایل به آرشیو',
      icon: 'ph:archive',
      color: 'yellow',
      variant: 'ghost',
      priority: 'tertiary',
      onClick: () => emit('archive')
    })

    actionList.push({
      id: 'duplicate',
      label: 'کپی',
      description: 'ایجاد کپی از پروفایل',
      icon: 'ph:copy',
      color: 'gray',
      variant: 'ghost',
      priority: 'tertiary',
      onClick: () => emit('duplicate')
    })

    actionList.push({
      id: 'delete',
      label: 'حذف',
      description: 'حذف دائمی پروفایل',
      icon: 'ph:trash',
      color: 'red',
      variant: 'ghost',
      priority: 'tertiary',
      onClick: () => emit('delete')
    })
  }

  return actionList
})

// Filter actions by priority for different layouts
const primaryActions = computed(() => actions.value.filter(a => a.priority === 'primary'))
const secondaryActions = computed(() => actions.value.filter(a => a.priority === 'secondary'))
const tertiaryActions = computed(() => actions.value.filter(a => a.priority === 'tertiary'))

// Get button color classes
const getButtonColorClass = (color: string) => {
  const colors = {
    blue: 'focus:ring-blue-500',
    purple: 'focus:ring-purple-500',
    green: 'focus:ring-green-500',
    indigo: 'focus:ring-indigo-500',
    yellow: 'focus:ring-yellow-500',
    red: 'focus:ring-red-500',
    gray: 'focus:ring-gray-500'
  }
  return colors[color as keyof typeof colors] || colors.gray
}

// Handle action click
const handleActionClick = (action: Action) => {
  if (action.disabled || props.loading) return
  
  if (action.href) {
    navigateTo(action.href)
  } else if (action.onClick) {
    action.onClick()
  }
}

// Export dropdown options
const exportOptions = [
  { value: 'pdf', label: 'فایل PDF', icon: 'ph:file-pdf' },
  { value: 'csv', label: 'فایل CSV', icon: 'ph:file-csv' },
  { value: 'json', label: 'فایل JSON', icon: 'ph:brackets-curly' }
]

const handleExport = (format: 'pdf' | 'csv' | 'json') => {
  emit('export', format)
}
</script>

<template>
  <div :class="`profile-actions profile-actions--${layout} profile-actions--${variant}`">
    <!-- Card Variant -->
    <div v-if="variant === 'card'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
        عملیات پروفایل
      </BaseHeading>
      
      <!-- Primary Actions -->
      <div class="space-y-3 mb-6">
        <BaseButton
          v-for="action in primaryActions"
          :key="action.id"
          :variant="action.variant"
          :size="size"
          :loading="loading && action.id === 'edit'"
          :disabled="action.disabled"
          :class="`w-full justify-start ${getButtonColorClass(action.color)}`"
          @click="handleActionClick(action)"
        >
          <Icon :name="action.icon" class="w-4 h-4 me-3" />
          <div class="text-right">
            <div class="font-medium">{{ action.label }}</div>
            <div v-if="showDescriptions && action.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ action.description }}
            </div>
          </div>
          <span v-if="action.badge" :class="`ms-auto px-2 py-1 text-xs rounded-full bg-${action.badge.color}-100 text-${action.badge.color}-800 dark:bg-${action.badge.color}-900/30 dark:text-${action.badge.color}-300`">
            {{ action.badge.text }}
          </span>
        </BaseButton>
      </div>

      <!-- Secondary Actions -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="grid grid-cols-2 gap-2">
          <BaseButton
            v-for="action in secondaryActions.slice(0, 4)"
            :key="action.id"
            :variant="action.variant"
            size="sm"
            :disabled="action.disabled"
            @click="handleActionClick(action)"
          >
            <Icon :name="action.icon" class="w-4 h-4 me-2" />
            {{ showLabels ? action.label : '' }}
          </BaseButton>
        </div>

        <!-- More Actions Dropdown -->
        <div v-if="tertiaryActions.length > 0" class="mt-3">
          <BaseDropdown>
            <template #trigger>
              <BaseButton variant="ghost" size="sm" class="w-full">
                <Icon name="ph:dots-three" class="w-4 h-4 me-2" />
                عملیات بیشتر
              </BaseButton>
            </template>
            <template #content>
              <div class="py-2 min-w-[200px]">
                <button
                  v-for="action in tertiaryActions"
                  :key="action.id"
                  :class="`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                    action.color === 'red' 
                      ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`"
                  :disabled="action.disabled"
                  @click="handleActionClick(action)"
                >
                  <Icon :name="action.icon" class="w-4 h-4 me-3" />
                  {{ action.label }}
                </button>
              </div>
            </template>
          </BaseDropdown>
        </div>
      </div>
    </div>

    <!-- Grid Layout -->
    <div v-else-if="layout === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <BaseButton
        v-for="action in primaryActions.concat(secondaryActions)"
        :key="action.id"
        :variant="action.variant"
        :size="size"
        :loading="loading && action.id === 'edit'"
        :disabled="action.disabled"
        :class="`${showLabels ? 'flex-col py-4' : ''} relative`"
        @click="handleActionClick(action)"
      >
        <Icon :name="action.icon" :class="`w-5 h-5 ${showLabels ? 'mb-2' : ''}`" />
        <span v-if="showLabels" class="text-sm">{{ action.label }}</span>
        <span v-if="action.badge" :class="`absolute top-1 right-1 px-1.5 py-0.5 text-xs rounded-full bg-${action.badge.color}-100 text-${action.badge.color}-800 dark:bg-${action.badge.color}-900/30 dark:text-${action.badge.color}-300`">
          {{ action.badge.text }}
        </span>
      </BaseButton>
    </div>

    <!-- Compact Layout -->
    <div v-else-if="layout === 'compact'" class="flex items-center gap-1">
      <!-- Primary Action -->
      <BaseButton
        v-if="primaryActions[0]"
        :variant="primaryActions[0].variant"
        :size="size"
        :loading="loading && primaryActions[0].id === 'edit'"
        :disabled="primaryActions[0].disabled"
        @click="handleActionClick(primaryActions[0])"
      >
        <Icon :name="primaryActions[0].icon" class="w-4 h-4 me-2" />
        {{ showLabels ? primaryActions[0].label : '' }}
      </BaseButton>

      <!-- Export Dropdown -->
      <BaseDropdown>
        <template #trigger>
          <BaseButton variant="outline" :size="size">
            <Icon name="ph:download" class="w-4 h-4" />
          </BaseButton>
        </template>
        <template #content>
          <div class="py-2">
            <button
              v-for="option in exportOptions"
              :key="option.value"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="handleExport(option.value as 'pdf' | 'csv' | 'json')"
            >
              <Icon :name="option.icon" class="w-4 h-4 me-3" />
              {{ option.label }}
            </button>
          </div>
        </template>
      </BaseDropdown>

      <!-- More Actions -->
      <BaseDropdown>
        <template #trigger>
          <BaseButton variant="ghost" :size="size">
            <Icon name="ph:dots-three-vertical" class="w-4 h-4" />
          </BaseButton>
        </template>
        <template #content>
          <div class="py-2 min-w-[180px]">
            <button
              v-for="action in secondaryActions.concat(tertiaryActions)"
              :key="action.id"
              :class="`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                action.color === 'red' 
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`"
              :disabled="action.disabled"
              @click="handleActionClick(action)"
            >
              <Icon :name="action.icon" class="w-4 h-4 me-3" />
              {{ action.label }}
              <span v-if="action.badge" :class="`ms-auto px-1.5 py-0.5 text-xs rounded-full bg-${action.badge.color}-100 text-${action.badge.color}-800`">
                {{ action.badge.text }}
              </span>
            </button>
          </div>
        </template>
      </BaseDropdown>
    </div>

    <!-- Vertical Layout -->
    <div v-else-if="layout === 'vertical'" class="space-y-3">
      <!-- Primary Actions -->
      <div class="space-y-2">
        <BaseButton
          v-for="action in primaryActions"
          :key="action.id"
          :variant="action.variant"
          :size="size"
          :loading="loading && action.id === 'edit'"
          :disabled="action.disabled"
          class="w-full justify-start"
          @click="handleActionClick(action)"
        >
          <Icon :name="action.icon" class="w-4 h-4 me-3" />
          {{ action.label }}
          <span v-if="action.badge" :class="`ms-auto px-2 py-1 text-xs rounded-full bg-${action.badge.color}-100 text-${action.badge.color}-800`">
            {{ action.badge.text }}
          </span>
        </BaseButton>
      </div>

      <!-- Secondary Actions -->
      <div v-if="secondaryActions.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
        <BaseButton
          v-for="action in secondaryActions"
          :key="action.id"
          :variant="action.variant"
          size="sm"
          class="w-full justify-start"
          :disabled="action.disabled"
          @click="handleActionClick(action)"
        >
          <Icon :name="action.icon" class="w-4 h-4 me-3" />
          {{ action.label }}
        </BaseButton>
      </div>

      <!-- Tertiary Actions -->
      <div v-if="tertiaryActions.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-3">
        <BaseDropdown class="w-full">
          <template #trigger>
            <BaseButton variant="ghost" size="sm" class="w-full justify-start">
              <Icon name="ph:dots-three" class="w-4 h-4 me-3" />
              عملیات بیشتر
            </BaseButton>
          </template>
          <template #content>
            <div class="py-2 min-w-[200px]">
              <button
                v-for="action in tertiaryActions"
                :key="action.id"
                :class="`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                  action.color === 'red' 
                    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`"
                :disabled="action.disabled"
                @click="handleActionClick(action)"
              >
                <Icon :name="action.icon" class="w-4 h-4 me-3" />
                {{ action.label }}
              </button>
            </div>
          </template>
        </BaseDropdown>
      </div>
    </div>

    <!-- Horizontal Layout (Default) -->
    <div v-else class="flex flex-wrap items-center gap-3">
      <!-- Primary Actions -->
      <BaseButton
        v-for="action in primaryActions"
        :key="action.id"
        :variant="action.variant"
        :size="size"
        :loading="loading && action.id === 'edit'"
        :disabled="action.disabled"
        :class="`relative ${getButtonColorClass(action.color)}`"
        @click="handleActionClick(action)"
      >
        <Icon :name="action.icon" class="w-4 h-4 me-2" />
        {{ showLabels ? action.label : '' }}
        <span v-if="action.badge" :class="`ms-2 px-2 py-0.5 text-xs rounded-full bg-${action.badge.color}-100 text-${action.badge.color}-800 dark:bg-${action.badge.color}-900/30 dark:text-${action.badge.color}-300`">
          {{ action.badge.text }}
        </span>
      </BaseButton>

      <!-- Secondary Actions -->
      <div v-if="secondaryActions.length > 0" class="flex items-center gap-2">
        <BaseButton
          v-for="action in secondaryActions.slice(0, 2)"
          :key="action.id"
          :variant="action.variant"
          :size="size"
          :disabled="action.disabled"
          @click="handleActionClick(action)"
        >
          <Icon :name="action.icon" class="w-4 h-4 me-2" />
          {{ showLabels ? action.label : '' }}
        </BaseButton>

        <!-- More Actions Dropdown -->
        <BaseDropdown v-if="secondaryActions.length > 2 || tertiaryActions.length > 0">
          <template #trigger>
            <BaseButton variant="ghost" :size="size">
              <Icon name="ph:dots-three" class="w-4 h-4" />
            </BaseButton>
          </template>
          <template #content>
            <div class="py-2 min-w-[180px]">
              <button
                v-for="action in secondaryActions.slice(2).concat(tertiaryActions)"
                :key="action.id"
                :class="`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                  action.color === 'red' 
                    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`"
                :disabled="action.disabled"
                @click="handleActionClick(action)"
              >
                <Icon :name="action.icon" class="w-4 h-4 me-3" />
                {{ action.label }}
              </button>
            </div>
          </template>
        </BaseDropdown>
      </div>
    </div>
  </div>
</template>