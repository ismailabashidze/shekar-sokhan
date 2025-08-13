<script setup lang="ts">
import type { HandbookSectionDisplay, ProfileAnalytics } from '~/types/hammasir'

interface Props {
  sections: HandbookSectionDisplay[]
  analytics?: ProfileAnalytics
  loading?: boolean
  compact?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'expand', sectionId: string): void
  (e: 'action', actionType: string, sectionId: string, data?: any): void
}

const props = withDefaults(defineProps<Props>(), {
  sections: () => [],
  loading: false,
  compact: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

// Track expanded sections
const expandedSections = ref<Set<string>>(new Set())

// Toggle section expansion
const toggleSection = (sectionId: string) => {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
  } else {
    expandedSections.value.add(sectionId)
    emit('expand', sectionId)
  }
}

// Check if section is expanded
const isExpanded = (sectionId: string) => {
  return expandedSections.value.has(sectionId)
}

// Get section icon based on type
const getSectionIcon = (type: string) => {
  const icons = {
    'personality': 'ph:smiley',
    'skills': 'ph:star',
    'interests': 'ph:heart',
    'career': 'ph:briefcase',
    'recommendations': 'ph:lightbulb',
    'matching': 'ph:users',
    'growth': 'ph:trend-up',
    'compatibility': 'ph:handshake',
    'insights': 'ph:chart-line',
    'analysis': 'ph:magnifying-glass'
  }
  return icons[type as keyof typeof icons] || 'ph:file-text'
}

// Get section color based on type
const getSectionColor = (type: string) => {
  const colors = {
    'personality': 'purple',
    'skills': 'blue',
    'interests': 'pink',
    'career': 'indigo',
    'recommendations': 'yellow',
    'matching': 'green',
    'growth': 'teal',
    'compatibility': 'orange',
    'insights': 'cyan',
    'analysis': 'gray'
  }
  return colors[type as keyof typeof colors] || 'gray'
}

// Format progress as percentage
const formatProgress = (progress: number) => {
  return `${Math.round(progress * 100)}%`
}

// Handle section actions
const handleAction = (actionType: string, sectionId: string, data?: any) => {
  emit('action', actionType, sectionId, data)
}

// Initialize expanded sections for non-compact view
onMounted(() => {
  if (!props.compact) {
    props.sections.forEach(section => {
      if (section.defaultExpanded !== false) {
        expandedSections.value.add(section.id)
      }
    })
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Analytics Summary ---->
    <div v-if="analytics && !compact" class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center me-3">
            <Icon name="ph:chart-pie" class="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <BaseHeading as="h2" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
              تحلیل پروفایل
            </BaseHeading>
            <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
              نتایج کامل تجزیه و تحلیل اطلاعات شما
            </BaseParagraph>
          </div>
        </div>

        <!-- Overall Score -->
        <div class="text-center">
          <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ Math.round(analytics.overallScore * 100) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">امتیاز کلی</div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ analytics.sectionsAnalyzed }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">بخش‌های تحلیل شده</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ analytics.recommendationsCount }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">توصیه‌ها</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ analytics.matchingPotential }}%
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">پتانسیل انطباق</div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 text-center">
          <div class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ analytics.completionLevel }}%
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">تکمیل اطلاعات</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="animate-pulse">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg me-3"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Handbook Sections -->
    <div v-else-if="sections.length > 0" class="space-y-4">
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md overflow-hidden"
      >
        <!-- Section Header -->
        <div 
          class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          @click="toggleSection(section.id)"
        >
          <div class="flex items-center">
            <div 
              :class="`w-10 h-10 bg-${getSectionColor(section.type)}-100 dark:bg-${getSectionColor(section.type)}-900/30 rounded-lg flex items-center justify-center me-4`"
            >
              <Icon 
                :name="getSectionIcon(section.type)" 
                :class="`w-5 h-5 text-${getSectionColor(section.type)}-600`" 
              />
            </div>
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                {{ section.title }}
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
                {{ section.description }}
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-center space-x-3 space-x-reverse">
            <!-- Progress Indicator -->
            <div v-if="section.progress" class="flex items-center">
              <div class="text-sm text-gray-500 dark:text-gray-400 me-2">
                {{ formatProgress(section.progress) }}
              </div>
              <HammasirCommonProgressBar
                :value="section.progress * 100"
                size="sm"
                class="w-16"
              />
            </div>

            <!-- Status Badge -->
            <HammasirCommonStatusBadge
              v-if="section.status"
              :status="section.status"
              size="sm"
            />

            <!-- Expand/Collapse Icon -->
            <Icon
              :name="isExpanded(section.id) ? 'ph:caret-up' : 'ph:caret-down'"
              class="w-5 h-5 text-gray-400 transition-transform"
              :class="{ 'rotate-180': isExpanded(section.id) }"
            />
          </div>
        </div>

        <!-- Section Content -->
        <Transition
          name="expand"
          enter-active-class="transition-all duration-300"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-screen opacity-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="max-h-screen opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-show="isExpanded(section.id)" class="border-t border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <!-- Content Text -->
              <div v-if="section.content" class="prose prose-sm max-w-none dark:prose-invert mb-6">
                <div v-html="section.content" />
              </div>

              <!-- Key Points -->
              <div v-if="section.keyPoints && section.keyPoints.length > 0" class="mb-6">
                <BaseHeading as="h4" size="sm" weight="medium" class="text-gray-800 dark:text-white mb-3">
                  نکات کلیدی
                </BaseHeading>
                <ul class="space-y-2">
                  <li
                    v-for="point in section.keyPoints"
                    :key="point"
                    class="flex items-start"
                  >
                    <Icon name="ph:check-circle" class="w-4 h-4 text-green-500 me-2 mt-0.5 flex-shrink-0" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ point }}</span>
                  </li>
                </ul>
              </div>

              <!-- Recommendations -->
              <div v-if="section.recommendations && section.recommendations.length > 0" class="mb-6">
                <BaseHeading as="h4" size="sm" weight="medium" class="text-gray-800 dark:text-white mb-3">
                  توصیه‌ها
                </BaseHeading>
                <div class="space-y-3">
                  <div
                    v-for="recommendation in section.recommendations"
                    :key="recommendation.id"
                    class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                  >
                    <div class="flex items-start">
                      <Icon name="ph:lightbulb" class="w-4 h-4 text-blue-600 me-2 mt-0.5 flex-shrink-0" />
                      <div class="flex-1">
                        <div class="font-medium text-blue-800 dark:text-blue-200 text-sm mb-1">
                          {{ recommendation.title }}
                        </div>
                        <div class="text-blue-700 dark:text-blue-300 text-sm">
                          {{ recommendation.description }}
                        </div>
                        <div v-if="recommendation.priority" class="mt-2">
                          <HammasirCommonStatusBadge
                            :status="recommendation.priority"
                            size="xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Actions -->
              <div v-if="section.actions && section.actions.length > 0 && !readonly" class="flex flex-wrap gap-2">
                <BaseButton
                  v-for="action in section.actions"
                  :key="action.id"
                  :variant="action.primary ? 'solid' : 'outline'"
                  size="sm"
                  @click="handleAction(action.type, section.id, action.data)"
                >
                  <Icon v-if="action.icon" :name="action.icon" class="w-4 h-4 me-2" />
                  {{ action.label }}
                </BaseButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon name="ph:book-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <BaseHeading as="h3" size="lg" weight="medium" class="text-gray-500 dark:text-gray-400 mb-2">
        هنوز تحلیلی انجام نشده
      </BaseHeading>
      <BaseParagraph class="text-gray-400 dark:text-gray-500 mb-6">
        پس از تکمیل پروفایل، تحلیل‌های مفصل در اینجا نمایش داده خواهند شد
      </BaseParagraph>
      <BaseButton
        v-if="!readonly"
        variant="outline"
        @click="handleAction('generate_analysis', 'handbook')"
      >
        <Icon name="ph:chart-pie" class="w-4 h-4 me-2" />
        شروع تحلیل
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  overflow: hidden;
}
</style>