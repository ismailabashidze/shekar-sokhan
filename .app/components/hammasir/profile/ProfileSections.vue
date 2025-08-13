<script setup lang="ts">
import type { UserProfile, ProfileCompletionStatus } from '~/types/hammasir'

interface Section {
  id: string
  title: string
  description: string
  icon: string
  color: string
  completed: boolean
  progress: number
  required: boolean
  component?: string
  data?: any
  lastUpdated?: string
  itemCount?: number
}

interface Props {
  profile: UserProfile
  completionStatus?: ProfileCompletionStatus
  layout?: 'grid' | 'accordion' | 'tabs'
  showProgress?: boolean
  showActions?: boolean
  collapsible?: boolean
  defaultExpanded?: string[]
  readonly?: boolean
}

interface Emits {
  (e: 'edit-section', sectionId: string): void
  (e: 'section-expand', sectionId: string): void
  (e: 'section-collapse', sectionId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'accordion',
  showProgress: true,
  showActions: true,
  collapsible: true,
  defaultExpanded: () => ['personal-info'],
  readonly: false
})

const emit = defineEmits<Emits>()

// Track expanded sections
const expandedSections = ref<Set<string>>(new Set(props.defaultExpanded))
const activeTab = ref(props.defaultExpanded[0] || 'personal-info')

// Generate sections from profile data
const sections = computed<Section[]>(() => {
  const sectionList: Section[] = []

  // Personal Information
  sectionList.push({
    id: 'personal-info',
    title: 'اطلاعات شخصی',
    description: 'نام، تماس، تصویر و مشخصات پایه',
    icon: 'ph:user',
    color: 'blue',
    completed: (props.completionStatus?.personalInfo?.percentage || 0) >= 100,
    progress: props.completionStatus?.personalInfo?.percentage || 0,
    required: true,
    data: props.profile.personalInfo,
    lastUpdated: props.profile.updatedAt
  })

  // Education
  if (props.profile.demographics.education && props.profile.demographics.education.length > 0) {
    sectionList.push({
      id: 'education',
      title: 'سوابق تحصیلی',
      description: 'مدارک، دانشگاه‌ها و رشته‌های تحصیلی',
      icon: 'ph:graduation-cap',
      color: 'green',
      completed: (props.completionStatus?.education?.percentage || 0) >= 100,
      progress: props.completionStatus?.education?.percentage || 0,
      required: true,
      data: props.profile.demographics.education,
      itemCount: props.profile.demographics.education.length
    })
  }

  // Occupation
  if (props.profile.demographics.occupation && props.profile.demographics.occupation.length > 0) {
    sectionList.push({
      id: 'occupation',
      title: 'سوابق شغلی',
      description: 'تجربیات کاری و مهارت‌های حرفه‌ای',
      icon: 'ph:briefcase',
      color: 'purple',
      completed: (props.completionStatus?.occupation?.percentage || 0) >= 100,
      progress: props.completionStatus?.occupation?.percentage || 0,
      required: true,
      data: props.profile.demographics.occupation,
      itemCount: props.profile.demographics.occupation.length
    })
  }

  // Location
  if (props.profile.demographics.location && props.profile.demographics.location.length > 0) {
    sectionList.push({
      id: 'location',
      title: 'اطلاعات مکانی',
      description: 'محل‌های سکونت و تمایلات مکانی',
      icon: 'ph:map-pin',
      color: 'yellow',
      completed: (props.completionStatus?.location?.percentage || 0) >= 100,
      progress: props.completionStatus?.location?.percentage || 0,
      required: false,
      data: props.profile.demographics.location,
      itemCount: props.profile.demographics.location.length
    })
  }

  // Preferences
  sectionList.push({
    id: 'preferences',
    title: 'تنظیمات و ترجیحات',
    description: 'حریم خصوصی و تنظیمات ارتباطی',
    icon: 'ph:gear',
    color: 'indigo',
    completed: (props.completionStatus?.preferences?.percentage || 0) >= 100,
    progress: props.completionStatus?.preferences?.percentage || 0,
    required: true,
    data: props.profile.preferences
  })

  return sectionList
})

// Toggle section expansion
const toggleSection = (sectionId: string) => {
  if (!props.collapsible) return

  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
    emit('section-collapse', sectionId)
  } else {
    expandedSections.value.add(sectionId)
    emit('section-expand', sectionId)
  }
}

// Check if section is expanded
const isSectionExpanded = (sectionId: string) => {
  if (props.layout === 'tabs') return activeTab.value === sectionId
  return expandedSections.value.has(sectionId)
}

// Handle tab change
const changeTab = (sectionId: string) => {
  activeTab.value = sectionId
  emit('section-expand', sectionId)
}

// Handle edit section
const handleEditSection = (sectionId: string) => {
  emit('edit-section', sectionId)
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

// Get section color classes
const getSectionColorClasses = (color: string, variant: 'bg' | 'text' | 'border' = 'bg') => {
  const colors = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', border: 'border-green-200 dark:border-green-800' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600', border: 'border-purple-200 dark:border-purple-800' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600', border: 'border-yellow-200 dark:border-yellow-800' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600', border: 'border-indigo-200 dark:border-indigo-800' }
  }
  return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant]
}

// Initialize expanded sections
onMounted(() => {
  if (props.layout === 'accordion' && !props.collapsible) {
    // Expand all sections if not collapsible
    sections.value.forEach(section => {
      expandedSections.value.add(section.id)
    })
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Grid Layout -->
    <div v-if="layout === 'grid'" class="grid lg:grid-cols-2 gap-6">
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
      >
        <!-- Section Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="`w-10 h-10 rounded-xl flex items-center justify-center me-3 ${getSectionColorClasses(section.color)}`">
                <Icon :name="section.icon" :class="`w-5 h-5 ${getSectionColorClasses(section.color, 'text')}`" />
              </div>
              <div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  {{ section.title }}
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ section.description }}
                </BaseParagraph>
              </div>
            </div>
            
            <!-- Section Meta -->
            <div class="text-right">
              <HammasirCommonStatusBadge
                :status="section.completed ? 'completed' : section.progress > 0 ? 'in_progress' : 'pending'"
                size="sm"
              />
              <div v-if="section.itemCount" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ section.itemCount }} مورد
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="showProgress" class="mt-4">
            <HammasirCommonProgressBar
              :value="section.progress"
              :variant="section.color"
              size="sm"
            />
          </div>
        </div>

        <!-- Section Content -->
        <div class="p-6">
          <HammasirDisplayProfileDisplay
            v-if="section.id === 'personal-info'"
            :profile="profile"
            compact
            readonly
          />
          
          <div v-else-if="section.data" class="text-sm text-gray-600 dark:text-gray-400">
            <!-- Show basic info or item count -->
            <div v-if="section.itemCount" class="flex items-center justify-between">
              <span>{{ section.itemCount }} مورد وارد شده</span>
              <BaseButton
                v-if="showActions && !readonly"
                size="xs"
                variant="outline"
                @click="handleEditSection(section.id)"
              >
                مشاهده
              </BaseButton>
            </div>
            <div v-else>
              اطلاعات موجود
            </div>
          </div>
          
          <div v-else class="text-center py-4">
            <Icon name="ph:plus-circle" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <BaseParagraph class="text-gray-500 dark:text-gray-400 text-sm mb-3">
              هنوز اطلاعاتی وارد نشده
            </BaseParagraph>
            <BaseButton
              v-if="showActions && !readonly"
              size="sm"
              variant="outline"
              @click="handleEditSection(section.id)"
            >
              افزودن اطلاعات
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Layout -->
    <div v-else-if="layout === 'tabs'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <!-- Tab Headers -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex overflow-x-auto">
          <button
            v-for="section in sections"
            :key="section.id"
            :class="`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === section.id
                ? `${getSectionColorClasses(section.color, 'text')} ${getSectionColorClasses(section.color, 'border').replace('border-', 'border-b-')}`
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
            }`"
            @click="changeTab(section.id)"
          >
            <Icon :name="section.icon" class="w-4 h-4 me-2" />
            {{ section.title }}
            <span v-if="section.itemCount" class="ms-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
              {{ section.itemCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <div
          v-for="section in sections"
          :key="section.id"
          v-show="activeTab === section.id"
          class="space-y-4"
        >
          <!-- Section Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-2">
                {{ section.title }}
              </BaseHeading>
              <BaseParagraph class="text-gray-600 dark:text-gray-400">
                {{ section.description }}
              </BaseParagraph>
            </div>
            
            <div class="flex items-center gap-3">
              <HammasirCommonStatusBadge
                :status="section.completed ? 'completed' : section.progress > 0 ? 'in_progress' : 'pending'"
                size="sm"
              />
              <BaseButton
                v-if="showActions && !readonly"
                variant="outline"
                size="sm"
                @click="handleEditSection(section.id)"
              >
                ویرایش
              </BaseButton>
            </div>
          </div>

          <!-- Progress -->
          <div v-if="showProgress" class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">پیشرفت تکمیل</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ section.progress }}%</span>
            </div>
            <HammasirCommonProgressBar
              :value="section.progress"
              :variant="section.color"
            />
          </div>

          <!-- Content -->
          <div class="min-h-[200px]">
            <!-- Personal Info Content -->
            <HammasirDisplayProfileDisplay
              v-if="section.id === 'personal-info'"
              :profile="profile"
              compact
              readonly
            />
            
            <!-- Other sections content -->
            <div v-else-if="section.data" class="space-y-4">
              <!-- Education -->
              <div v-if="section.id === 'education' && section.data.length > 0" class="space-y-3">
                <div
                  v-for="(item, index) in section.data"
                  :key="item.id || index"
                  class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div class="font-medium text-gray-800 dark:text-white">{{ item.degree }}</div>
                  <div class="text-gray-600 dark:text-gray-400 text-sm">{{ item.institutionName }}</div>
                  <div class="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    {{ item.fieldOfStudy }} • {{ item.startDate }}
                  </div>
                </div>
              </div>
              
              <!-- Occupation -->
              <div v-else-if="section.id === 'occupation' && section.data.length > 0" class="space-y-3">
                <div
                  v-for="(item, index) in section.data"
                  :key="item.id || index"
                  class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div class="font-medium text-gray-800 dark:text-white">{{ item.currentPosition }}</div>
                  <div class="text-gray-600 dark:text-gray-400 text-sm">{{ item.companyName }}</div>
                  <div class="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    {{ item.industry }} • {{ item.startDate }}
                  </div>
                </div>
              </div>
              
              <!-- Location -->
              <div v-else-if="section.id === 'location' && section.data.length > 0" class="space-y-3">
                <div
                  v-for="(item, index) in section.data"
                  :key="item.id || index"
                  class="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <Icon name="ph:map-pin" class="w-4 h-4 text-gray-500 me-3" />
                  <span class="text-gray-800 dark:text-white">
                    {{ item.city }}, {{ item.state }}, {{ item.country }}
                  </span>
                  <HammasirCommonStatusBadge
                    v-if="item.isCurrent"
                    status="active"
                    size="xs"
                    class="ms-auto"
                  />
                </div>
              </div>
              
              <!-- Preferences -->
              <div v-else-if="section.id === 'preferences'" class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-gray-800 dark:text-white mb-3">ارتباطات</h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600 dark:text-gray-400 text-sm">اطلاعیه‌های ایمیلی</span>
                      <HammasirCommonStatusBadge
                        :status="section.data.communication?.email ? 'active' : 'disabled'"
                        size="xs"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600 dark:text-gray-400 text-sm">اطلاعیه‌های پیامکی</span>
                      <HammasirCommonStatusBadge
                        :status="section.data.communication?.sms ? 'active' : 'disabled'"
                        size="xs"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-800 dark:text-white mb-3">حریم خصوصی</h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600 dark:text-gray-400 text-sm">نمایش به مشاوران</span>
                      <HammasirCommonStatusBadge
                        :status="profile.privacySettings?.isProfileVisibleToCounselors ? 'active' : 'disabled'"
                        size="xs"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600 dark:text-gray-400 text-sm">انطباق‌یابی</span>
                      <HammasirCommonStatusBadge
                        :status="profile.privacySettings?.allowDataAnalysisForMatching ? 'active' : 'disabled'"
                        size="xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty state -->
            <div v-else class="text-center py-8">
              <Icon name="ph:plus-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <BaseParagraph class="text-gray-500 dark:text-gray-400 mb-4">
                هنوز اطلاعاتی در این بخش وارد نشده
              </BaseParagraph>
              <BaseButton
                v-if="showActions && !readonly"
                variant="outline"
                @click="handleEditSection(section.id)"
              >
                افزودن اطلاعات
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Accordion Layout (Default) -->
    <div v-else class="space-y-4">
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
      >
        <!-- Section Header -->
        <div
          :class="`flex items-center justify-between p-6 ${
            collapsible ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
          } transition-colors`"
          @click="collapsible ? toggleSection(section.id) : undefined"
        >
          <div class="flex items-center flex-1">
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center me-4 ${getSectionColorClasses(section.color)}`">
              <Icon :name="section.icon" :class="`w-5 h-5 ${getSectionColorClasses(section.color, 'text')}`" />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  {{ section.title }}
                </BaseHeading>
                <HammasirCommonStatusBadge
                  :status="section.completed ? 'completed' : section.progress > 0 ? 'in_progress' : 'pending'"
                  size="sm"
                />
                <span v-if="section.required" class="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full">
                  ضروری
                </span>
              </div>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm">
                {{ section.description }}
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-center gap-3 ms-4">
            <!-- Progress -->
            <div v-if="showProgress" class="flex items-center gap-2">
              <HammasirCommonProgressBar
                :value="section.progress"
                :variant="section.color"
                size="sm"
                class="w-16"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
                {{ section.progress }}%
              </span>
            </div>

            <!-- Item Count -->
            <div v-if="section.itemCount" class="text-sm text-gray-500 dark:text-gray-400">
              {{ section.itemCount }} مورد
            </div>

            <!-- Expand/Collapse Icon -->
            <Icon
              v-if="collapsible"
              :name="isSectionExpanded(section.id) ? 'ph:caret-up' : 'ph:caret-down'"
              class="w-5 h-5 text-gray-400 transition-transform"
            />
          </div>
        </div>

        <!-- Section Content -->
        <Transition
          name="expand"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-screen opacity-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="max-h-screen opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-show="isSectionExpanded(section.id)" class="border-t border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <!-- Full Profile Display for personal-info -->
              <HammasirDisplayProfileDisplay
                v-if="section.id === 'personal-info'"
                :profile="profile"
                compact
                :readonly="readonly"
                :show-actions="showActions && !readonly"
                @edit="handleEditSection('personal-info')"
              />
              
              <!-- Other section content with same structure as tabs -->
              <div v-else-if="section.data" class="space-y-4">
                <!-- Same content structure as in tabs layout -->
                <!-- ... (same implementation as above) ... -->
              </div>
              
              <!-- Empty state -->
              <div v-else class="text-center py-8">
                <Icon name="ph:plus-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <BaseParagraph class="text-gray-500 dark:text-gray-400 mb-4">
                  هنوز اطلاعاتی در این بخش وارد نشده
                </BaseParagraph>
                <BaseButton
                  v-if="showActions && !readonly"
                  variant="outline"
                  @click="handleEditSection(section.id)"
                >
                  <Icon name="ph:plus" class="w-4 h-4 me-2" />
                  افزودن اطلاعات
                </BaseButton>
              </div>

              <!-- Section Actions -->
              <div v-if="showActions && !readonly && section.data" class="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="handleEditSection(section.id)"
                >
                  <Icon name="ph:pencil" class="w-4 h-4 me-2" />
                  ویرایش
                </BaseButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  overflow: hidden;
}
</style>