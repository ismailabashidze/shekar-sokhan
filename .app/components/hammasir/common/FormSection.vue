<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  completed?: boolean
  progress?: number
  required?: boolean
  locked?: boolean
  lockedReason?: string
  error?: string
  collapsible?: boolean
  defaultExpanded?: boolean
}

interface Emits {
  (e: 'toggle', expanded: boolean): void
  (e: 'edit'): void
  (e: 'save'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  icon: 'ph:circle',
  completed: false,
  progress: 0,
  required: false,
  locked: false,
  lockedReason: '',
  error: '',
  collapsible: false,
  defaultExpanded: true,
})

const emit = defineEmits<Emits>()

const isExpanded = ref(props.defaultExpanded)
const isEditing = ref(false)

// Icon selection based on status
const statusIcon = computed(() => {
  if (props.locked) return 'ph:lock'
  if (props.completed) return 'ph:check-circle'
  if (props.error) return 'ph:warning-circle'
  if (props.progress > 0) return 'ph:clock'
  return props.icon
})

// Color classes based on status
const statusColors = computed(() => {
  if (props.locked) {
    return {
      icon: 'text-gray-400',
      background: 'bg-gray-50 dark:bg-gray-700/50',
      border: 'border-gray-200 dark:border-gray-600',
      progress: 'bg-gray-400'
    }
  }
  
  if (props.error) {
    return {
      icon: 'text-red-500',
      background: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      progress: 'bg-red-500'
    }
  }
  
  if (props.completed) {
    return {
      icon: 'text-green-500',
      background: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      progress: 'bg-green-500'
    }
  }
  
  if (props.progress > 0) {
    return {
      icon: 'text-blue-500',
      background: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      progress: 'bg-blue-500'
    }
  }
  
  return {
    icon: 'text-gray-500',
    background: 'bg-white dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    progress: 'bg-gray-500'
  }
})

const toggleExpanded = () => {
  if (props.collapsible && !props.locked) {
    isExpanded.value = !isExpanded.value
    emit('toggle', isExpanded.value)
  }
}

const startEditing = () => {
  if (!props.locked) {
    isEditing.value = true
    emit('edit')
  }
}

const saveChanges = () => {
  isEditing.value = false
  emit('save')
}

const cancelChanges = () => {
  isEditing.value = false
  emit('cancel')
}

// Watch for external editing state changes
watch(() => isEditing.value, (newValue) => {
  if (newValue && props.collapsible) {
    isExpanded.value = true
  }
})
</script>

<template>
  <div 
    class="rounded-2xl border transition-all duration-200 shadow-sm"
    :class="[
      statusColors.background,
      statusColors.border,
      {
        'shadow-lg': isExpanded && !locked,
        'opacity-60': locked
      }
    ]"
  >
    <!-- Section Header -->
    <div 
      class="p-6 cursor-pointer transition-colors duration-200"
      :class="{
        'hover:bg-gray-50 dark:hover:bg-gray-700/30': collapsible && !locked,
        'cursor-not-allowed': locked
      }"
      @click="toggleExpanded"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Status Icon -->
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="[
              statusColors.background === 'bg-white dark:bg-gray-800' 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : statusColors.background
            ]"
          >
            <Icon 
              :name="statusIcon" 
              class="w-6 h-6"
              :class="statusColors.icon"
            />
          </div>
          
          <!-- Title and Description -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 space-x-reverse">
              <BaseHeading 
                as="h3" 
                size="lg" 
                weight="semibold" 
                class="text-gray-800 dark:text-white"
              >
                {{ title }}
                <span v-if="required" class="text-red-500 text-sm ms-1">*</span>
              </BaseHeading>
              
              <!-- Locked Badge -->
              <BaseBadge v-if="locked" variant="gray" size="sm">
                قفل شده
              </BaseBadge>
              
              <!-- Completed Badge -->
              <BaseBadge v-else-if="completed" variant="success" size="sm">
                تکمیل شده
              </BaseBadge>
              
              <!-- In Progress Badge -->
              <BaseBadge v-else-if="progress > 0" variant="info" size="sm">
                در حال انجام
              </BaseBadge>
            </div>
            
            <BaseParagraph 
              v-if="description" 
              class="text-gray-600 dark:text-gray-400 mt-1"
            >
              {{ description }}
            </BaseParagraph>
            
            <!-- Error Message -->
            <BaseParagraph 
              v-if="error" 
              class="text-red-600 dark:text-red-400 mt-1 text-sm"
            >
              {{ error }}
            </BaseParagraph>
            
            <!-- Locked Reason -->
            <BaseParagraph 
              v-if="locked && lockedReason" 
              class="text-gray-500 dark:text-gray-400 mt-1 text-sm"
            >
              {{ lockedReason }}
            </BaseParagraph>
          </div>
        </div>
        
        <!-- Right Side -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Progress Circle -->
          <div v-if="progress > 0 && !completed" class="relative w-12 h-12">
            <svg class="w-12 h-12 transform -rotate-90">
              <!-- Background circle -->
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                class="text-gray-200 dark:text-gray-600"
              />
              <!-- Progress circle -->
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                :stroke-dasharray="`${2 * Math.PI * 20}`"
                :stroke-dashoffset="`${2 * Math.PI * 20 * (1 - progress / 100)}`"
                :class="statusColors.progress"
                class="transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                {{ Math.round(progress) }}%
              </span>
            </div>
          </div>
          
          <!-- Completed Check -->
          <div v-else-if="completed" class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Icon name="ph:check" class="w-6 h-6 text-green-600" />
          </div>
          
          <!-- Action Buttons -->
          <div v-if="!locked && isExpanded" class="flex items-center space-x-2 space-x-reverse">
            <!-- Edit Mode Buttons -->
            <template v-if="isEditing">
              <BaseButton
                size="sm"
                variant="solid"
                class="bg-green-500 text-white hover:bg-green-600"
                @click.stop="saveChanges"
              >
                <Icon name="ph:check" class="w-4 h-4 me-2" />
                ذخیره
              </BaseButton>
              
              <BaseButton
                size="sm"
                variant="outline"
                class="border-gray-300 text-gray-700 hover:bg-gray-50"
                @click.stop="cancelChanges"
              >
                انصراف
              </BaseButton>
            </template>
            
            <!-- View Mode Button -->
            <BaseButton
              v-else
              size="sm"
              variant="outline"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
              @click.stop="startEditing"
            >
              <Icon name="ph:pencil" class="w-4 h-4 me-2" />
              ویرایش
            </BaseButton>
          </div>
          
          <!-- Collapse/Expand Indicator -->
          <Icon
            v-if="collapsible"
            name="ph:caret-down"
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': !isExpanded }"
          />
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div v-if="progress > 0 && progress < 100 && !completed" class="mt-4">
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-700"
            :class="statusColors.progress"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Section Content -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="border-t border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <slot :is-editing="isEditing" :start-editing="startEditing" :save-changes="saveChanges" :cancel-changes="cancelChanges" />
        </div>
      </div>
    </Transition>
  </div>
</template>