<script setup lang="ts">
import type { ProfileCompletionStatus } from '~/types/hammasir'

interface ProgressItem {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending' | 'skipped'
  progress: number
  required: boolean
  icon: string
  estimatedTime?: string
  lastUpdated?: string
  steps?: Array<{
    id: string
    title: string
    completed: boolean
    optional?: boolean
  }>
}

interface Props {
  completionStatus: ProfileCompletionStatus
  progressItems?: ProgressItem[]
  showTimeline?: boolean
  showActions?: boolean
  compact?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'start-section', sectionId: string): void
  (e: 'continue-section', sectionId: string): void
  (e: 'skip-section', sectionId: string): void
  (e: 'complete-step', sectionId: string, stepId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  progressItems: () => [],
  showTimeline: true,
  showActions: true,
  compact: false,
  loading: false,
})

const emit = defineEmits<Emits>()

// Generate progress items from completion status if not provided
const computedProgressItems = computed<ProgressItem[]>(() => {
  if (props.progressItems.length > 0) {
    return props.progressItems
  }

  // Generate from completion status
  const items: ProgressItem[] = []
  
  if (props.completionStatus.personalInfo) {
    items.push({
      id: 'personal-info',
      title: 'اطلاعات شخصی',
      description: 'نام، تماس، و مشخصات پایه',
      status: props.completionStatus.personalInfo.percentage >= 100 ? 'completed' : 
              props.completionStatus.personalInfo.percentage > 0 ? 'in_progress' : 'pending',
      progress: props.completionStatus.personalInfo.percentage,
      required: true,
      icon: 'ph:user',
      estimatedTime: '5 دقیقه'
    })
  }

  if (props.completionStatus.education) {
    items.push({
      id: 'education',
      title: 'سوابق تحصیلی',
      description: 'مدارک، دانشگاه‌ها، و رشته‌های تحصیلی',
      status: props.completionStatus.education.percentage >= 100 ? 'completed' : 
              props.completionStatus.education.percentage > 0 ? 'in_progress' : 'pending',
      progress: props.completionStatus.education.percentage,
      required: true,
      icon: 'ph:graduation-cap',
      estimatedTime: '10 دقیقه'
    })
  }

  if (props.completionStatus.occupation) {
    items.push({
      id: 'occupation',
      title: 'سوابق شغلی',
      description: 'تجربیات کاری و مهارت‌های حرفه‌ای',
      status: props.completionStatus.occupation.percentage >= 100 ? 'completed' : 
              props.completionStatus.occupation.percentage > 0 ? 'in_progress' : 'pending',
      progress: props.completionStatus.occupation.percentage,
      required: true,
      icon: 'ph:briefcase',
      estimatedTime: '15 دقیقه'
    })
  }

  if (props.completionStatus.location) {
    items.push({
      id: 'location',
      title: 'اطلاعات مکانی',
      description: 'محل سکونت و تمایل به نقل‌مکان',
      status: props.completionStatus.location.percentage >= 100 ? 'completed' : 
              props.completionStatus.location.percentage > 0 ? 'in_progress' : 'pending',
      progress: props.completionStatus.location.percentage,
      required: false,
      icon: 'ph:map-pin',
      estimatedTime: '3 دقیقه'
    })
  }

  if (props.completionStatus.preferences) {
    items.push({
      id: 'preferences',
      title: 'تنظیمات و ترجیحات',
      description: 'حریم خصوصی و ارتباطات',
      status: props.completionStatus.preferences.percentage >= 100 ? 'completed' : 
              props.completionStatus.preferences.percentage > 0 ? 'in_progress' : 'pending',
      progress: props.completionStatus.preferences.percentage,
      required: true,
      icon: 'ph:gear',
      estimatedTime: '5 دقیقه'
    })
  }

  return items
})

// Calculate overall stats
const overallStats = computed(() => {
  const total = computedProgressItems.value.length
  const completed = computedProgressItems.value.filter(item => item.status === 'completed').length
  const inProgress = computedProgressItems.value.filter(item => item.status === 'in_progress').length
  const required = computedProgressItems.value.filter(item => item.required).length
  const requiredCompleted = computedProgressItems.value.filter(item => item.required && item.status === 'completed').length

  return {
    total,
    completed,
    inProgress,
    pending: total - completed - inProgress,
    required,
    requiredCompleted,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    requiredPercentage: required > 0 ? Math.round((requiredCompleted / required) * 100) : 100
  }
})

// Get status color and icon
const getStatusColor = (status: string) => {
  const colors = {
    'completed': 'green',
    'in_progress': 'blue',
    'pending': 'gray',
    'skipped': 'yellow'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusIcon = (status: string) => {
  const icons = {
    'completed': 'ph:check-circle',
    'in_progress': 'ph:clock',
    'pending': 'ph:circle',
    'skipped': 'ph:skip-forward'
  }
  return icons[status as keyof typeof icons] || 'ph:circle'
}

const getStatusLabel = (status: string) => {
  const labels = {
    'completed': 'تکمیل شده',
    'in_progress': 'در حال انجام',
    'pending': 'در انتظار',
    'skipped': 'رد شده'
  }
  return labels[status as keyof typeof labels] || status
}

// Handle section actions
const handleSectionAction = (action: string, sectionId: string) => {
  switch (action) {
    case 'start':
      emit('start-section', sectionId)
      break
    case 'continue':
      emit('continue-section', sectionId)
      break
    case 'skip':
      emit('skip-section', sectionId)
      break
  }
}

// Get estimated total time
const estimatedTotalTime = computed(() => {
  const pendingItems = computedProgressItems.value.filter(item => 
    item.status === 'pending' && item.estimatedTime
  )
  
  if (pendingItems.length === 0) return ''
  
  // Extract minutes from time strings like "5 دقیقه"
  const totalMinutes = pendingItems.reduce((sum, item) => {
    if (item.estimatedTime) {
      const match = item.estimatedTime.match(/(\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }
    return sum
  }, 0)
  
  return `${totalMinutes} دقیقه`
})
</script>

<template>
  <div class="space-y-6">
    <!-- Progress Overview -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between mb-6">
        <div>
          <BaseHeading as="h2" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-2">
            پیشرفت تکمیل پروفایل
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400">
            وضعیت کلی تکمیل اطلاعات شخصی شما
          </BaseParagraph>
        </div>
        
        <!-- Overall Progress Circle -->
        <div class="text-center">
          <div class="relative w-20 h-20 mx-auto mb-2">
            <svg class="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                stroke-width="6"
                fill="transparent"
                class="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                stroke-width="6"
                fill="transparent"
                stroke-linecap="round"
                :stroke-dasharray="220"
                :stroke-dashoffset="220 - (220 * overallStats.completionPercentage) / 100"
                class="text-blue-600 transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-bold text-blue-600">{{ overallStats.completionPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600 mb-1">{{ overallStats.completed }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">تکمیل شده</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-blue-600 mb-1">{{ overallStats.inProgress }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">در حال انجام</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-gray-600 mb-1">{{ overallStats.pending }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">باقی‌مانده</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-indigo-600 mb-1">{{ overallStats.requiredPercentage }}%</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">ضروری</div>
        </div>
      </div>

      <!-- Estimated Time -->
      <div v-if="estimatedTotalTime && overallStats.pending > 0" class="mt-4 flex items-center justify-center">
        <Icon name="ph:clock" class="w-4 h-4 text-gray-500 me-2" />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          زمان تقریبی باقی‌مانده: {{ estimatedTotalTime }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="animate-pulse flex items-center">
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg me-4"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Progress Items -->
    <div v-else class="space-y-4">
      <!-- Timeline View -->
      <div v-if="showTimeline" class="relative">
        <div class="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <div
          v-for="(item, index) in computedProgressItems"
          :key="item.id"
          class="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 me-8 transition-all duration-200 hover:shadow-md"
        >
          <!-- Timeline Dot -->
          <div 
            :class="`absolute -right-10 top-8 w-4 h-4 rounded-full border-2 bg-${getStatusColor(item.status)}-500 border-white dark:border-gray-800`"
          ></div>

          <div class="flex items-start justify-between">
            <div class="flex items-start flex-1">
              <!-- Section Icon -->
              <div 
                :class="`w-12 h-12 bg-${getStatusColor(item.status)}-100 dark:bg-${getStatusColor(item.status)}-900/30 rounded-xl flex items-center justify-center me-4 flex-shrink-0`"
              >
                <Icon 
                  :name="item.icon" 
                  :class="`w-6 h-6 text-${getStatusColor(item.status)}-600`" 
                />
              </div>

              <!-- Section Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                    {{ item.title }}
                  </BaseHeading>
                  <HammasirCommonStatusBadge
                    :status="item.status"
                    size="sm"
                  />
                  <span v-if="item.required" class="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full">
                    ضروری
                  </span>
                </div>
                
                <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {{ item.description }}
                </BaseParagraph>

                <!-- Progress Bar -->
                <div class="flex items-center gap-3 mb-4">
                  <HammasirCommonProgressBar
                    :value="item.progress"
                    :variant="getStatusColor(item.status)"
                    size="sm"
                    class="flex-1"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                    {{ Math.round(item.progress) }}%
                  </span>
                </div>

                <!-- Steps Progress -->
                <div v-if="item.steps && item.steps.length > 0" class="mb-4">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">مراحل:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="step in item.steps"
                      :key="step.id"
                      :class="`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        step.completed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`"
                    >
                      <Icon 
                        :name="step.completed ? 'ph:check' : 'ph:circle'" 
                        class="w-3 h-3 me-1" 
                      />
                      {{ step.title }}
                    </span>
                  </div>
                </div>

                <!-- Meta Info -->
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div v-if="item.estimatedTime" class="flex items-center">
                    <Icon name="ph:clock" class="w-3 h-3 me-1" />
                    {{ item.estimatedTime }}
                  </div>
                  <div v-if="item.lastUpdated" class="flex items-center">
                    <Icon name="ph:calendar" class="w-3 h-3 me-1" />
                    آخرین به‌روزرسانی: {{ item.lastUpdated }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="showActions" class="flex flex-col gap-2 ms-4">
              <BaseButton
                v-if="item.status === 'pending'"
                size="sm"
                variant="solid"
                @click="handleSectionAction('start', item.id)"
              >
                شروع
              </BaseButton>
              
              <BaseButton
                v-else-if="item.status === 'in_progress'"
                size="sm"
                variant="solid"
                @click="handleSectionAction('continue', item.id)"
              >
                ادامه
              </BaseButton>
              
              <BaseButton
                v-else-if="item.status === 'completed'"
                size="sm"
                variant="outline"
                @click="handleSectionAction('continue', item.id)"
              >
                بازنگری
              </BaseButton>

              <BaseButton
                v-if="item.status !== 'completed' && !item.required"
                size="sm"
                variant="ghost"
                class="text-gray-500"
                @click="handleSectionAction('skip', item.id)"
              >
                رد کردن
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Grid View -->
      <div v-else class="grid md:grid-cols-2 gap-4">
        <div
          v-for="item in computedProgressItems"
          :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <Icon :name="item.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400 me-2" />
              <span class="font-medium text-gray-800 dark:text-white">{{ item.title }}</span>
            </div>
            <HammasirCommonStatusBadge :status="item.status" size="xs" />
          </div>
          
          <HammasirCommonProgressBar
            :value="item.progress"
            :variant="getStatusColor(item.status)"
            size="xs"
            class="mb-3"
          />
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ Math.round(item.progress) }}% تکمیل
            </span>
            <BaseButton
              v-if="showActions && item.status !== 'completed'"
              size="xs"
              variant="outline"
              @click="handleSectionAction(item.status === 'pending' ? 'start' : 'continue', item.id)"
            >
              {{ item.status === 'pending' ? 'شروع' : 'ادامه' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Message -->
    <div v-if="overallStats.completionPercentage === 100" class="text-center py-8">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="ph:check-circle" class="w-8 h-8 text-green-600" />
      </div>
      <BaseHeading as="h3" size="lg" weight="semibold" class="text-green-600 mb-2">
        تبریک! پروفایل شما کامل است
      </BaseHeading>
      <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-4">
        تمامی بخش‌های مورد نیاز با موفقیت تکمیل شدند. حالا می‌توانید از امکانات کامل پلتفرم استفاده کنید.
      </BaseParagraph>
    </div>
  </div>
</template>