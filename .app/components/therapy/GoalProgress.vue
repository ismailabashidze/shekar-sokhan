<template>
  <div class="space-y-6">
    <!-- Goal Progress Overview -->
    <BaseCard class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            {{ goal.title }}
          </h3>
          <p class="text-sm text-muted-600 dark:text-muted-300 mt-1">
            {{ goal.description }}
          </p>
        </div>
        <BaseBadge
          :color="statusColor"
          :label="statusLabel"
          size="sm"
        />
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-muted-700 dark:text-muted-300">
            پیشرفت کلی
          </span>
          <span class="text-sm text-muted-600 dark:text-muted-400">
            {{ goal.progress_percentage }}%
          </span>
        </div>
        <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarColor"
            :style="{ width: `${goal.progress_percentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Target Behaviors -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
          رفتارهای هدف
        </h4>
        <div class="space-y-1">
          <div 
            v-for="(behavior, index) in goal.target_behaviors" 
            :key="index"
            class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-400"
          >
            <Icon name="ph:target" class="w-4 h-4 text-primary-500" />
            <span>{{ behavior }}</span>
          </div>
        </div>
      </div>

      <!-- Success Criteria -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-muted-700 dark:text-muted-300 mb-2">
          معیارهای موفقیت
        </h4>
        <div class="space-y-1">
          <div 
            v-for="(criteria, index) in goal.success_criteria" 
            :key="index"
            class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-400"
          >
            <Icon name="ph:check-circle" class="w-4 h-4 text-success-500" />
            <span>{{ criteria }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Sub-goals -->
    <BaseCard v-if="goal.sub_goals && goal.sub_goals.length > 0" class="p-6">
      <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-4">
        اهداف فرعی
      </h4>
      
      <div class="space-y-3">
        <div 
          v-for="(subGoal, index) in goal.sub_goals" 
          :key="index"
          class="border border-muted-200 dark:border-muted-700 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h5 class="font-medium text-muted-700 dark:text-muted-200">
                {{ subGoal.title }}
              </h5>
              <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
                {{ subGoal.description }}
              </p>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <BaseDropdown>
                <template #button>
                  <BaseButton
                    :color="getSubGoalStatusColor(subGoal.status)"
                    size="xs"
                    variant="outline"
                  >
                    {{ getSubGoalStatusLabel(subGoal.status) }}
                    <Icon name="ph:caret-down" class="ml-1 w-3 h-3" />
                  </BaseButton>
                </template>
                
                <template #items>
                  <BaseDropdownItem
                    v-for="status in subGoalStatusOptions"
                    :key="status.value"
                    @click="updateSubGoalStatus(index, status.value)"
                    :class="{ 'bg-primary-50 dark:bg-primary-900': subGoal.status === status.value }"
                  >
                    <Icon :name="status.icon" class="w-4 h-4 ml-2" />
                    {{ status.label }}
                  </BaseDropdownItem>
                </template>
              </BaseDropdown>
            </div>
          </div>
          
          <div v-if="subGoal.completed_date" class="text-xs text-success-600 dark:text-success-400">
            تکمیل شده در: {{ formatDate(subGoal.completed_date) }}
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- AI Evaluation -->
    <BaseCard v-if="goal.ai_evaluation" class="p-6">
      <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-4">
        ارزیابی هوش مصنوعی
      </h4>
      <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
        <p class="text-sm text-muted-700 dark:text-muted-300 whitespace-pre-line">
          {{ goal.ai_evaluation }}
        </p>
      </div>
    </BaseCard>

    <!-- Notes Section -->
    <BaseCard class="p-6">
      <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-4">
        یادداشت‌ها
      </h4>
      
      <BaseTextarea
        v-model="notes"
        placeholder="یادداشت‌های شما درباره این هدف..."
        rows="3"
        @blur="saveNotes"
      />
      
      <div v-if="goal.notes" class="mt-4 bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
        <p class="text-sm text-muted-700 dark:text-muted-300">
          {{ goal.notes }}
        </p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGoal, type TherapyGoal } from '~/composables/goal'

interface Props {
  goal: TherapyGoal
}

const props = defineProps<Props>()
const emit = defineEmits<{
  goalUpdated: [goal: TherapyGoal]
}>()

const { updateTherapyGoal, updateSubGoalStatus: updateSubGoalStatusAPI } = useGoal()

const notes = ref(props.goal.notes || '')

const subGoalStatusOptions = [
  { value: 'pending', label: 'در انتظار', icon: 'ph:clock', color: 'muted' },
  { value: 'in_progress', label: 'در حال انجام', icon: 'ph:play', color: 'primary' },
  { value: 'completed', label: 'تکمیل شده', icon: 'ph:check', color: 'success' }
]

const statusColor = computed(() => {
  switch (props.goal.status) {
    case 'pending': return 'muted'
    case 'in_progress': return 'primary'
    case 'achieved': return 'success'
    default: return 'muted'
  }
})

const statusLabel = computed(() => {
  switch (props.goal.status) {
    case 'pending': return 'در انتظار'
    case 'in_progress': return 'در حال انجام'
    case 'achieved': return 'تحقق یافته'
    default: return 'نامشخص'
  }
})

const progressBarColor = computed(() => {
  if (props.goal.progress_percentage >= 100) return 'bg-success-500'
  if (props.goal.progress_percentage >= 75) return 'bg-primary-500'
  if (props.goal.progress_percentage >= 50) return 'bg-warning-500'
  return 'bg-muted-400'
})

const getSubGoalStatusColor = (status: string) => {
  const option = subGoalStatusOptions.find(opt => opt.value === status)
  return option?.color || 'muted'
}

const getSubGoalStatusLabel = (status: string) => {
  const option = subGoalStatusOptions.find(opt => opt.value === status)
  return option?.label || 'نامشخص'
}

const updateSubGoalStatus = async (subGoalIndex: number, status: 'pending' | 'in_progress' | 'completed') => {
  try {
    const updatedGoal = await updateSubGoalStatusAPI(props.goal.id!, subGoalIndex, status)
    emit('goalUpdated', updatedGoal)
    
    const toaster = useToaster()
    toaster.show({
      title: 'موفقیت',
      message: 'وضعیت هدف فرعی به‌روزرسانی شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
  } catch (error) {
    console.error('Error updating sub-goal status:', error)
    const toaster = useToaster()
    toaster.show({
      title: 'خطا',
      message: 'خطا در به‌روزرسانی وضعیت',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
}

const saveNotes = async () => {
  if (notes.value === props.goal.notes) return
  
  try {
    const updatedGoal = await updateTherapyGoal(props.goal.id!, { notes: notes.value })
    emit('goalUpdated', updatedGoal)
  } catch (error) {
    console.error('Error saving notes:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR')
}

watch(() => props.goal.notes, (newNotes) => {
  notes.value = newNotes || ''
})
</script>