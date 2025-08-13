<script setup lang="ts">
import type { ProfileCompletionStatus } from '~/types/hammasir'

interface CompletionItem {
  id: string
  title: string
  description: string
  percentage: number
  status: 'completed' | 'in_progress' | 'pending' | 'warning'
  priority: 'high' | 'medium' | 'low'
  required: boolean
  estimatedTime: string
  action?: {
    label: string
    route?: string
    onClick?: () => void
  }
  tips?: string[]
}

interface Props {
  completionStatus: ProfileCompletionStatus
  showActions?: boolean
  showTips?: boolean
  compact?: boolean
  variant?: 'default' | 'card' | 'minimal'
}

interface Emits {
  (e: 'section-click', sectionId: string): void
  (e: 'complete-section', sectionId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showTips: true,
  compact: false,
  variant: 'default'
})

const emit = defineEmits<Emits>()

// Generate completion items from status
const completionItems = computed<CompletionItem[]>(() => {
  const items: CompletionItem[] = []

  // Personal Information
  if (props.completionStatus.personalInfo) {
    const section = props.completionStatus.personalInfo
    items.push({
      id: 'personal-info',
      title: 'اطلاعات شخصی',
      description: 'نام، تماس، تصویر و مشخصات پایه',
      percentage: section.percentage,
      status: section.percentage >= 100 ? 'completed' : 
               section.percentage >= 50 ? 'in_progress' : 
               'pending',
      priority: 'high',
      required: true,
      estimatedTime: '5 دقیقه',
      action: {
        label: section.percentage >= 100 ? 'بازنگری' : 'تکمیل',
        route: '/profile/edit/personal'
      },
      tips: [
        'تصویر پروفایل کیفیت تحلیل‌ها را بهبود می‌دهد',
        'شماره تلفن معتبر برای تأیید هویت ضروری است'
      ]
    })
  }

  // Education
  if (props.completionStatus.education) {
    const section = props.completionStatus.education
    items.push({
      id: 'education',
      title: 'سوابق تحصیلی',
      description: 'مدارک، دانشگاه‌ها و رشته‌های تحصیلی',
      percentage: section.percentage,
      status: section.percentage >= 100 ? 'completed' :
               section.percentage >= 50 ? 'in_progress' :
               section.percentage < 25 && section.isRequired ? 'warning' : 'pending',
      priority: 'high',
      required: true,
      estimatedTime: '10 دقیقه',
      action: {
        label: section.percentage >= 100 ? 'بازنگری' : 'تکمیل',
        route: '/profile/edit/education'
      },
      tips: [
        'حداقل یک مدرک تحصیلی اضافه کنید',
        'اطلاعات دقیق دانشگاه تحلیل‌ها را بهتر می‌کند'
      ]
    })
  }

  // Occupation
  if (props.completionStatus.occupation) {
    const section = props.completionStatus.occupation
    items.push({
      id: 'occupation',
      title: 'سوابق شغلی',
      description: 'تجربیات کاری و مهارت‌های حرفه‌ای',
      percentage: section.percentage,
      status: section.percentage >= 100 ? 'completed' :
               section.percentage >= 50 ? 'in_progress' :
               section.percentage < 25 && section.isRequired ? 'warning' : 'pending',
      priority: 'high',
      required: true,
      estimatedTime: '15 دقیقه',
      action: {
        label: section.percentage >= 100 ? 'بازنگری' : 'تکمیل',
        route: '/profile/edit/occupation'
      },
      tips: [
        'شغل فعلی تأثیر بیشتری در انطباق‌یابی دارد',
        'صنعت و نوع استخدام را دقیق وارد کنید'
      ]
    })
  }

  // Location
  if (props.completionStatus.location) {
    const section = props.completionStatus.location
    items.push({
      id: 'location',
      title: 'اطلاعات مکانی',
      description: 'محل سکونت و تمایل به نقل‌مکان',
      percentage: section.percentage,
      status: section.percentage >= 100 ? 'completed' :
               section.percentage >= 50 ? 'in_progress' : 'pending',
      priority: 'medium',
      required: false,
      estimatedTime: '3 دقیقه',
      action: {
        label: section.percentage >= 100 ? 'بازنگری' : 'تکمیل',
        route: '/profile/edit/location'
      },
      tips: [
        'محل سکونت در پیشنهادات تأثیرگذار است',
        'تمایل به نقل‌مکان فرصت‌های بیشتری ایجاد می‌کند'
      ]
    })
  }

  // Preferences
  if (props.completionStatus.preferences) {
    const section = props.completionStatus.preferences
    items.push({
      id: 'preferences',
      title: 'تنظیمات و ترجیحات',
      description: 'حریم خصوصی، ارتباطات و تنظیمات',
      percentage: section.percentage,
      status: section.percentage >= 100 ? 'completed' :
               section.percentage >= 50 ? 'in_progress' : 'pending',
      priority: 'medium',
      required: true,
      estimatedTime: '5 دقیقه',
      action: {
        label: section.percentage >= 100 ? 'بازنگری' : 'تکمیل',
        route: '/profile/edit/preferences'
      },
      tips: [
        'تنظیمات حریم خصوصی را بررسی کنید',
        'نحوه دریافت اطلاعیه‌ها را مشخص کنید'
      ]
    })
  }

  // Sort by priority and completion
  return items.sort((a, b) => {
    // Incomplete required items first
    if (a.status !== 'completed' && a.required && (b.status === 'completed' || !b.required)) return -1
    if (b.status !== 'completed' && b.required && (a.status === 'completed' || !a.required)) return 1
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

// Calculate overall stats
const overallStats = computed(() => {
  const total = completionItems.value.length
  const completed = completionItems.value.filter(item => item.status === 'completed').length
  const inProgress = completionItems.value.filter(item => item.status === 'in_progress').length
  const warnings = completionItems.value.filter(item => item.status === 'warning').length
  const required = completionItems.value.filter(item => item.required).length
  const requiredCompleted = completionItems.value.filter(item => item.required && item.status === 'completed').length

  return {
    total,
    completed,
    inProgress,
    warnings,
    pending: total - completed - inProgress - warnings,
    required,
    requiredCompleted,
    overallPercentage: props.completionStatus.overallPercentage || 0
  }
})

// Get next priority action
const nextAction = computed(() => {
  return completionItems.value.find(item => 
    item.status !== 'completed' && (item.status === 'warning' || item.required)
  ) || completionItems.value.find(item => item.status !== 'completed')
})

// Get status color and icon
const getStatusColor = (status: string) => {
  const colors = {
    completed: 'green',
    in_progress: 'blue', 
    pending: 'gray',
    warning: 'red'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusIcon = (status: string) => {
  const icons = {
    completed: 'ph:check-circle',
    in_progress: 'ph:clock',
    pending: 'ph:circle',
    warning: 'ph:warning-circle'
  }
  return icons[status as keyof typeof icons] || 'ph:circle'
}

// Get priority label
const getPriorityLabel = (priority: string) => {
  const labels = {
    high: 'بالا',
    medium: 'متوسط',
    low: 'پایین'
  }
  return labels[priority as keyof typeof labels] || priority
}

// Handle section click
const handleSectionClick = (item: CompletionItem) => {
  emit('section-click', item.id)
  if (item.action?.route) {
    navigateTo(item.action.route)
  } else if (item.action?.onClick) {
    item.action.onClick()
  }
}

// Calculate estimated completion time
const estimatedCompletionTime = computed(() => {
  const incompleteItems = completionItems.value.filter(item => item.status !== 'completed')
  const totalMinutes = incompleteItems.reduce((sum, item) => {
    const match = item.estimatedTime.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  if (totalMinutes === 0) return ''
  if (totalMinutes < 60) return `${totalMinutes} دقیقه`
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes > 0 ? `${hours} ساعت و ${minutes} دقیقه` : `${hours} ساعت`
})
</script>

<template>
  <div class="space-y-6">
    <!-- Overall Progress -->
    <div 
      :class="`${
        variant === 'card' 
          ? 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6' 
          : variant === 'minimal'
          ? 'bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800'
      }`"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
            وضعیت تکمیل پروفایل
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
            {{ overallStats.requiredCompleted }} از {{ overallStats.required }} بخش ضروری تکمیل شده
          </BaseParagraph>
        </div>
        
        <!-- Overall Progress Circle -->
        <div class="text-center">
          <div class="relative w-16 h-16 mx-auto mb-2">
            <svg class="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                class="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                stroke-linecap="round"
                :stroke-dasharray="176"
                :stroke-dashoffset="176 - (176 * overallStats.overallPercentage) / 100"
                class="text-blue-600 transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-sm font-bold text-blue-600">{{ overallStats.overallPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-green-600">{{ overallStats.completed }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">تکمیل</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-blue-600">{{ overallStats.inProgress }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">در حال انجام</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-gray-600">{{ overallStats.pending }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">باقی‌مانده</div>
        </div>
        <div v-if="overallStats.warnings > 0" class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-red-600">{{ overallStats.warnings }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">نیاز به توجه</div>
        </div>
      </div>

      <!-- Estimated Time -->
      <div v-if="estimatedCompletionTime" class="mt-4 flex items-center justify-center">
        <Icon name="ph:clock" class="w-4 h-4 text-gray-500 me-2" />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          زمان تقریبی تکمیل: {{ estimatedCompletionTime }}
        </span>
      </div>
    </div>

    <!-- Next Action CTA -->
    <div v-if="nextAction" class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="ph:arrow-right" class="w-5 h-5" />
            <span class="font-semibold">مرحله بعدی</span>
          </div>
          <BaseHeading as="h3" size="md" weight="semibold" class="mb-2">
            {{ nextAction.title }}
          </BaseHeading>
          <BaseParagraph class="text-white/90 text-sm mb-3">
            {{ nextAction.description }}
          </BaseParagraph>
          <div class="flex items-center gap-4 text-sm text-white/80">
            <span>{{ nextAction.estimatedTime }}</span>
            <span class="inline-flex items-center">
              <Icon name="ph:flag" class="w-3 h-3 me-1" />
              اولویت {{ getPriorityLabel(nextAction.priority) }}
            </span>
          </div>
        </div>
        
        <BaseButton
          v-if="showActions"
          variant="solid"
          class="bg-white/20 hover:bg-white/30 text-white border-white/30"
          @click="handleSectionClick(nextAction)"
        >
          {{ nextAction.action?.label || 'شروع' }}
        </BaseButton>
      </div>
    </div>

    <!-- Completion Items List -->
    <div class="space-y-4">
      <div
        v-for="item in completionItems"
        :key="item.id"
        :class="`${
          variant === 'minimal'
            ? 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'
            : 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'
        } transition-all duration-200 hover:shadow-md ${
          item.status === 'warning' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''
        }`"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- Section Info -->
          <div class="flex items-start flex-1 gap-4">
            <!-- Status Icon -->
            <div 
              :class="`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${getStatusColor(item.status)}-100 dark:bg-${getStatusColor(item.status)}-900/30`"
            >
              <Icon 
                :name="getStatusIcon(item.status)" 
                :class="`w-5 h-5 text-${getStatusColor(item.status)}-600`" 
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <BaseHeading as="h4" size="sm" weight="semibold" class="text-gray-800 dark:text-white">
                  {{ item.title }}
                </BaseHeading>
                <HammasirCommonStatusBadge
                  :status="item.status"
                  size="xs"
                />
                <span v-if="item.required" class="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full">
                  ضروری
                </span>
              </div>
              
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {{ item.description }}
              </BaseParagraph>

              <!-- Progress Bar -->
              <div class="flex items-center gap-3 mb-3">
                <HammasirCommonProgressBar
                  :value="item.percentage"
                  :variant="getStatusColor(item.status)"
                  size="sm"
                  class="flex-1"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                  {{ item.percentage }}%
                </span>
              </div>

              <!-- Tips -->
              <div v-if="showTips && item.tips && item.tips.length > 0 && item.status !== 'completed'" class="mb-3">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div class="flex items-start">
                    <Icon name="ph:info" class="w-4 h-4 text-blue-500 me-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div class="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">نکات مفید:</div>
                      <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li v-for="tip in item.tips" :key="tip">• {{ tip }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Meta Info -->
              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <Icon name="ph:clock" class="w-3 h-3 me-1" />
                  {{ item.estimatedTime }}
                </div>
                <div class="flex items-center">
                  <Icon name="ph:flag" class="w-3 h-3 me-1" />
                  اولویت {{ getPriorityLabel(item.priority) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div v-if="showActions" class="flex-shrink-0">
            <BaseButton
              :variant="item.status === 'completed' ? 'outline' : 'solid'"
              :color="item.status === 'warning' ? 'red' : undefined"
              size="sm"
              @click="handleSectionClick(item)"
            >
              {{ item.action?.label || 'شروع' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Message -->
    <div v-if="overallStats.overallPercentage === 100" class="text-center py-8">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="ph:check-circle" class="w-8 h-8 text-green-600" />
      </div>
      <BaseHeading as="h3" size="lg" weight="semibold" class="text-green-600 mb-2">
        🎉 پروفایل شما کامل است!
      </BaseHeading>
      <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-4">
        همه بخش‌های مورد نیاز با موفقیت تکمیل شدند. حالا می‌توانید از تمام امکانات پلتفرم بهره‌مند شوید.
      </BaseParagraph>
      <div class="flex justify-center gap-3">
        <BaseButton variant="solid">
          <Icon name="ph:chart-pie" class="w-4 h-4 me-2" />
          مشاهده تحلیل‌ها
        </BaseButton>
        <BaseButton variant="outline">
          <Icon name="ph:users" class="w-4 h-4 me-2" />
          شروع انطباق‌یابی
        </BaseButton>
      </div>
    </div>
  </div>
</template>