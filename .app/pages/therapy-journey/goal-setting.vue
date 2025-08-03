<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-muted-900 dark:to-muted-800 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 pt-8">
        <h1 class="text-3xl font-bold text-muted-800 dark:text-white mb-2">
          {{ sessionId ? 'مدیریت اهداف جلسه' : 'تنظیم اهداف درمانی' }}
        </h1>
        <p class="text-muted-600 dark:text-muted-300">
          {{ sessionId ? 'مشاهده و مدیریت اهداف این جلسه درمانی' : 'بر اساس ارزیابی شما، اهداف درمانی مناسب را تعریف کنید' }}
        </p>
        
        <!-- Session Info -->
        <div v-if="sessionId" class="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div class="flex justify-center gap-6 text-sm">
            <div>
              <span class="font-medium text-muted-700 dark:text-muted-300">شناسه جلسه:</span>
              <span class="text-primary-600 dark:text-primary-400 mr-2">{{ sessionId }}</span>
            </div>
            <div v-if="therapistId">
              <span class="font-medium text-muted-700 dark:text-muted-300">متخصص:</span>
              <span class="text-primary-600 dark:text-primary-400 mr-2">{{ therapistId }}</span>
            </div>
            <div>
              <span class="font-medium text-muted-700 dark:text-muted-300">بیمار:</span>
              <span class="text-primary-600 dark:text-primary-400 mr-2">{{ userId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <FullscreenLoading v-if="isLoading" loader-type="user" />

      <!-- Existing Goals (if viewing session goals) -->
      <div v-if="existingGoals.length > 0" class="space-y-6 mb-8">
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-800 dark:text-white mb-4">
            اهداف موجود جلسه
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="(goal, index) in existingGoals" 
              :key="goal.id"
              class="border border-muted-200 dark:border-muted-700 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-muted-800 dark:text-white">
                    {{ goal.title }}
                  </h3>
                  <p class="text-sm text-muted-600 dark:text-muted-400 mt-1">
                    {{ goal.description }}
                  </p>
                </div>
                <BaseBadge
                  :color="getStatusColor(goal.status)"
                  :label="getStatusLabel(goal.status)"
                  size="sm"
                />
              </div>
              
              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs text-muted-600 dark:text-muted-400">پیشرفت</span>
                  <span class="text-xs text-muted-600 dark:text-muted-400">{{ goal.progress_percentage }}%</span>
                </div>
                <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-1">
                  <div 
                    class="bg-primary-500 h-1 rounded-full transition-all duration-300"
                    :style="{ width: `${goal.progress_percentage}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- Target Behaviors -->
              <div class="mb-3">
                <h4 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-1">رفتارهای هدف:</h4>
                <ul class="list-disc list-inside text-xs text-muted-600 dark:text-muted-400 space-y-1">
                  <li v-for="behavior in goal.target_behaviors" :key="behavior">{{ behavior }}</li>
                </ul>
              </div>
              
              <!-- Success Criteria -->
              <div class="mb-3">
                <h4 class="text-xs font-medium text-muted-700 dark:text-muted-300 mb-1">معیارهای موفقیت:</h4>
                <ul class="list-disc list-inside text-xs text-muted-600 dark:text-muted-400 space-y-1">
                  <li v-for="criteria in goal.success_criteria" :key="criteria">{{ criteria }}</li>
                </ul>
              </div>
              
              <!-- Diagnostic Details Toggle -->
              <div v-if="goal.goal_type === 'diagnostic'" class="mt-3 pt-3 border-t border-muted-200 dark:border-muted-700">
                <button 
                  @click="toggleDiagnosticDetails(index)"
                  class="flex items-center gap-2 text-sm font-medium text-muted-700 dark:text-muted-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Icon 
                    :name="expandedGoals.includes(index) ? 'ph:caret-down' : 'ph:caret-left'"
                    class="w-4 h-4"
                  />
                  جزئیات تشخیصی و برنامه عملیاتی
                </button>
                
                <!-- Expanded Diagnostic Details -->
                <div v-if="expandedGoals.includes(index)" class="mt-3 space-y-3">
                  <!-- DSM-5 and ICD-11 Criteria -->
                  <div class="grid md:grid-cols-2 gap-3">
                    <div v-if="goal.dsm5_criteria">
                      <h4 class="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">معیارهای DSM-5:</h4>
                      <ul class="list-disc list-inside text-xs text-blue-600 dark:text-blue-400 space-y-1">
                        <li v-for="criteria in goal.dsm5_criteria" :key="criteria">{{ criteria }}</li>
                      </ul>
                    </div>
                    
                    <div v-if="goal.icd11_criteria">
                      <h4 class="text-xs font-medium text-green-700 dark:text-green-400 mb-1">معیارهای ICD-11:</h4>
                      <ul class="list-disc list-inside text-xs text-green-600 dark:text-green-400 space-y-1">
                        <li v-for="criteria in goal.icd11_criteria" :key="criteria">{{ criteria }}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <!-- Assessment Areas -->
                  <div v-if="goal.assessment_areas">
                    <h4 class="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">حوزه‌های ارزیابی:</h4>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="area in goal.assessment_areas" 
                        :key="area"
                        class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded"
                      >
                        {{ area }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Action Plan -->
                  <div v-if="goal.action_plan">
                    <h4 class="text-xs font-medium text-orange-700 dark:text-orange-400 mb-2">برنامه عملیاتی:</h4>
                    <div class="space-y-1">
                      <div 
                        v-for="(step, stepIndex) in goal.action_plan" 
                        :key="stepIndex"
                        class="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400"
                      >
                        <span class="w-4 h-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {{ stepIndex + 1 }}
                        </span>
                        <span>{{ step }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Main CC Investigation -->
                  <div v-if="goal.main_cc_investigation">
                    <h4 class="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-2">بررسی شکایت اصلی:</h4>
                    <ul class="list-disc list-inside text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
                      <li v-for="area in goal.main_cc_investigation" :key="area">{{ area }}</li>
                    </ul>
                  </div>
                  
                  <!-- Comorbidity Investigation -->
                  <div v-if="goal.comorbidity_investigation">
                    <h4 class="text-xs font-medium text-red-700 dark:text-red-400 mb-2">بررسی اختلالات همزمان:</h4>
                    <div class="grid grid-cols-2 gap-1">
                      <span 
                        v-for="comorbidity in goal.comorbidity_investigation" 
                        :key="comorbidity"
                        class="px-2 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-800"
                      >
                        {{ comorbidity }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Investigation Methods -->
                  <div v-if="goal.investigation_methods">
                    <h4 class="text-xs font-medium text-teal-700 dark:text-teal-400 mb-2">روش‌های بررسی:</h4>
                    <ul class="list-disc list-inside text-xs text-teal-600 dark:text-teal-400 space-y-1">
                      <li v-for="method in goal.investigation_methods" :key="method">{{ method }}</li>
                    </ul>
                  </div>
                  
                  <!-- Clinical Interview Focus -->
                  <div v-if="goal.clinical_interview_focus">
                    <h4 class="text-xs font-medium text-cyan-700 dark:text-cyan-400 mb-2">نکات کلیدی مصاحبه:</h4>
                    <ul class="list-disc list-inside text-xs text-cyan-600 dark:text-cyan-400 space-y-1">
                      <li v-for="focus in goal.clinical_interview_focus" :key="focus">{{ focus }}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <!-- Assessment Areas (for non-diagnostic goals) -->
              <div v-if="goal.assessment_areas && goal.goal_type !== 'diagnostic'" class="mt-3 pt-3 border-t border-muted-200 dark:border-muted-700">
                <h4 class="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">حوزه‌های ارزیابی:</h4>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="area in goal.assessment_areas" 
                    :key="area"
                    class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded"
                  >
                    {{ area }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Goal Setting Form -->
      <div v-if="!isViewMode" class="space-y-8">
        <!-- Primary Goal -->
        <BaseCard class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-muted-800 dark:text-white">
              هدف اصلی درمان
            </h2>
            
            <BaseButton
              v-if="!sessionId"
              @click="generateAIGoals"
              variant="outline"
              color="primary"
              size="sm"
              :loading="isGeneratingGoals"
            >
              <Icon name="ph:brain" class="mr-2" />
              تولید اهداف با هوش مصنوعی
            </BaseButton>
          </div>
          
          <div class="space-y-4">
            <BaseSelect
              v-model="formData.goal_type"
              label="نوع هدف"
              :options="goalTypes"
              placeholder="نوع هدف را انتخاب کنید"
            />
            
            <BaseInput
              v-model="formData.title"
              label="عنوان هدف"
              placeholder="عنوان کوتاه و واضح برای هدف"
            />
            
            <BaseTextarea
              v-model="formData.description"
              label="شرح هدف"
              placeholder="توضیح مفصل درباره هدف درمانی"
              rows="3"
            />
          </div>
        </BaseCard>

        <!-- Target Behaviors -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-800 dark:text-white mb-4">
            رفتارهای هدف
          </h2>
          
          <div class="space-y-4">
            <div v-for="(behavior, index) in formData.target_behaviors" :key="index" class="flex gap-2">
              <BaseInput
                v-model="formData.target_behaviors[index]"
                :label="index === 0 ? 'رفتارهای مورد انتظار' : ''"
                :placeholder="`رفتار هدف ${index + 1}`"
                class="flex-1"
              />
              <BaseButton
                v-if="formData.target_behaviors.length > 1"
                @click="removeBehavior(index)"
                variant="outline"
                color="danger"
                size="sm"
                class="mt-6"
              >
                <Icon name="ph:trash" />
              </BaseButton>
            </div>
            
            <BaseButton
              @click="addBehavior"
              variant="outline"
              color="primary"
              size="sm"
            >
              <Icon name="ph:plus" class="mr-2" />
              افزودن رفتار
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Success Criteria -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-800 dark:text-white mb-4">
            معیارهای موفقیت
          </h2>
          
          <div class="space-y-4">
            <div v-for="(criteria, index) in formData.success_criteria" :key="index" class="flex gap-2">
              <BaseInput
                v-model="formData.success_criteria[index]"
                :label="index === 0 ? 'معیارهای سنجش موفقیت' : ''"
                :placeholder="`معیار موفقیت ${index + 1}`"
                class="flex-1"
              />
              <BaseButton
                v-if="formData.success_criteria.length > 1"
                @click="removeCriteria(index)"
                variant="outline"
                color="danger"
                size="sm"
                class="mt-6"
              >
                <Icon name="ph:trash" />
              </BaseButton>
            </div>
            
            <BaseButton
              @click="addCriteria"
              variant="outline"
              color="primary"
              size="sm"
            >
              <Icon name="ph:plus" class="mr-2" />
              افزودن معیار
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Goal Settings -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-800 dark:text-white mb-4">
            تنظیمات هدف
          </h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <BaseSelect
              v-model="formData.priority"
              label="اولویت"
              :options="priorityOptions"
              placeholder="سطح اولویت را انتخاب کنید"
            />
            
            <BaseInput
              v-model="formData.progress_percentage"
              type="number"
              label="درصد پیشرفت اولیه"
              placeholder="0"
              min="0"
              max="100"
            />
            
            <BaseDatepicker
              v-model="formData.target_date"
              label="تاریخ هدف"
              placeholder="تاریخ مورد انتظار برای تحقق هدف"
            />
            
            <BaseSelect
              v-model="formData.status"
              label="وضعیت"
              :options="statusOptions"
              placeholder="وضعیت فعلی هدف"
            />
          </div>
        </BaseCard>

        <!-- Sub-goals -->
        <BaseCard class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-muted-800 dark:text-white">
              اهداف فرعی
            </h2>
            <BaseButton
              @click="addSubGoal"
              variant="outline"
              color="primary"
              size="sm"
            >
              <Icon name="ph:plus" class="mr-2" />
              افزودن هدف فرعی
            </BaseButton>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="(subGoal, index) in formData.sub_goals"
              :key="index"
              class="border border-muted-200 dark:border-muted-700 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-medium text-muted-700 dark:text-muted-200">
                  هدف فرعی {{ index + 1 }}
                </h3>
                <BaseButton
                  @click="removeSubGoal(index)"
                  variant="ghost"
                  color="danger"
                  size="xs"
                >
                  <Icon name="ph:trash" />
                </BaseButton>
              </div>
              
              <div class="grid md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="subGoal.title"
                  label="عنوان"
                  placeholder="عنوان هدف فرعی"
                />
                <BaseSelect
                  v-model="subGoal.status"
                  label="وضعیت"
                  :options="subGoalStatusOptions"
                  placeholder="وضعیت هدف فرعی"
                />
                <BaseTextarea
                  v-model="subGoal.description"
                  label="توضیحات"
                  placeholder="شرح هدف فرعی"
                  rows="2"
                  class="md:col-span-2"
                />
              </div>
            </div>
            
            <div v-if="formData.sub_goals.length === 0" class="text-center py-8 text-muted-500">
              هیچ هدف فرعی تعریف نشده است
            </div>
          </div>
        </BaseCard>

        <!-- AI Evaluation Notes -->
        <BaseCard class="p-6">
          <h2 class="text-xl font-semibold text-muted-800 dark:text-white mb-4">
            یادداشت‌های ارزیابی هوش مصنوعی
          </h2>
          
          <BaseTextarea
            v-model="formData.ai_evaluation"
            label="نظر هوش مصنوعی"
            placeholder="نظرات و پیشنهادات هوش مصنوعی بر اساس ارزیابی..."
            rows="4"
            readonly
          />
          
          <BaseTextarea
            v-model="formData.notes"
            label="یادداشت‌های اضافی"
            placeholder="یادداشت‌های اضافی درباره هدف..."
            rows="3"
            class="mt-4"
          />
        </BaseCard>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center py-6">
          <BaseButton
            @click="goBack"
            variant="outline"
            color="muted"
          >
            <Icon name="ph:arrow-right" class="mr-2" />
            بازگشت
          </BaseButton>
          
          <div class="flex gap-3">
            <BaseButton
              @click="saveDraft"
              variant="outline"
              color="primary"
              :loading="isDraftSaving"
            >
              ذخیره پیش‌نویس
            </BaseButton>
            
            <BaseButton
              @click="saveAndContinue"
              color="primary"
              :loading="isSaving"
              :disabled="!isFormValid"
            >
              ذخیره و ادامه
              <Icon name="ph:arrow-left" class="ml-2" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAssessment } from '~/composables/useAssessment'
import { useGoal } from '~/composables/goal'
import { useGoals } from '~/composables/useGoals'

definePageMeta({
  title: 'مدیریت اهداف درمانی - پنل مدیریت',
  layout: 'default',
  middleware: ['auth', 'role-admin-therapist'], // Only admin and therapists can access
  preview: {
    title: 'مدیریت اهداف درمانی',
    description: 'مدیریت و بررسی اهداف درمانی بیماران',
    categories: ['admin', 'therapy', 'goals'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 10,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'مدیریت اهداف درمانی | پنل مدیریت | ذهنا',
  meta: [
    { name: 'description', content: 'مدیریت و بررسی اهداف درمانی بیماران - ویژه متخصصان' }
  ]
})

const router = useRouter()
const route = useRoute()
const { user } = useUser()
const { getUserAssessments } = useAssessment()
const { createTherapyGoal, getTherapyGoals, updateTherapyGoal } = useGoal()
const { generateDiagnosisGoals } = useGoals()
const nuxtApp = useNuxtApp()

// Get URL parameters
const sessionId = computed(() => route.query.session as string || '')
const therapistId = computed(() => route.query.therapist as string || '')
const userId = computed(() => route.query.user as string || user.value.id)

const isLoading = ref(true)
const isSaving = ref(false)
const isDraftSaving = ref(false)
const isGeneratingGoals = ref(false)
const existingGoals = ref([])
const isViewMode = ref(false)
const expandedGoals = ref<number[]>([])

const formData = ref({
  session_id: '',
  user_id: '',
  therapist_id: '',
  goal_type: 'general',
  title: '',
  description: '',
  target_behaviors: [''],
  success_criteria: [''],
  priority: 'medium',
  status: 'pending',
  progress_percentage: 0,
  ai_evaluation: '',
  notes: '',
  target_date: null,
  sub_goals: [] as Array<{
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
})

const goalTypes = [
  { label: 'تشخیصی', value: 'diagnostic' },
  { label: 'عمومی', value: 'general' },
  { label: 'خاص', value: 'specific' },
  { label: 'درمانی', value: 'treatment' }
]

const priorityOptions = [
  { label: 'بالا', value: 'high' },
  { label: 'متوسط', value: 'medium' },
  { label: 'پایین', value: 'low' }
]

const statusOptions = [
  { label: 'در انتظار', value: 'pending' },
  { label: 'در حال انجام', value: 'in_progress' },
  { label: 'تحقق یافته', value: 'achieved' }
]

const subGoalStatusOptions = [
  { label: 'در انتظار', value: 'pending' },
  { label: 'در حال انجام', value: 'in_progress' },
  { label: 'تکمیل شده', value: 'completed' }
]

const isFormValid = computed(() => {
  return formData.value.title?.trim() && 
         formData.value.description?.trim() &&
         formData.value.target_behaviors.some(b => b.trim()) &&
         formData.value.success_criteria.some(c => c.trim())
})

const addBehavior = () => {
  formData.value.target_behaviors.push('')
}

const removeBehavior = (index: number) => {
  formData.value.target_behaviors.splice(index, 1)
}

const addCriteria = () => {
  formData.value.success_criteria.push('')
}

const removeCriteria = (index: number) => {
  formData.value.success_criteria.splice(index, 1)
}

const addSubGoal = () => {
  formData.value.sub_goals.push({
    title: '',
    description: '',
    status: 'pending'
  })
}

const removeSubGoal = (index: number) => {
  formData.value.sub_goals.splice(index, 1)
}

const loadData = async () => {
  try {
    // If sessionId is provided, load existing goals for that session
    if (sessionId.value) {
      const goals = await getTherapyGoals(sessionId.value)
      existingGoals.value = goals
      
      // If goals exist, switch to view mode
      if (goals.length > 0) {
        isViewMode.value = true
      }
    }
    
    // Load assessment data for new goal creation
    if (!isViewMode.value) {
      const assessments = await getUserAssessments(userId.value)
      if (assessments.length > 0) {
        const latestAssessment = assessments[0]
        
        // Generate AI evaluation based on assessment
        formData.value.ai_evaluation = generateAIEvaluation(latestAssessment)
        
        // Pre-populate basic info
        formData.value.user_id = userId.value
        formData.value.session_id = sessionId.value
        formData.value.therapist_id = therapistId.value
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
}

const generateAIEvaluation = (assessment: any) => {
  // This would be enhanced with actual AI analysis
  let evaluation = 'بر اساس ارزیابی انجام شده:\n\n'
  
  if (assessment.anxietyLevel > 6) {
    evaluation += '• سطح اضطراب بالا - نیاز به تکنیک‌های کاهش اضطراب\n'
  }
  
  if (assessment.stressLevel > 6) {
    evaluation += '• سطح استرس بالا - تمرکز بر مدیریت استرس ضروری است\n'
  }
  
  if (assessment.sleepQuality < 4) {
    evaluation += '• کیفیت خواب نامناسب - بهبود الگوی خواب اولویت دارد\n'
  }
  
  if (assessment.motivationLevel < 4) {
    evaluation += '• سطح انگیزه پایین - کار بر افزایش انگیزه مفید خواهد بود\n'
  }
  
  evaluation += '\nپیشنهاد می‌شود اهداف به صورت تدریجی و قابل دستیابی تعریف شوند.'
  
  return evaluation
}

const generateAIGoals = async () => {
  isGeneratingGoals.value = true
  
  try {
    const assessments = await getUserAssessments(userId.value)
    if (assessments.length === 0) {
      throw new Error('هیچ ارزیابی یافت نشد')
    }
    
    const latestAssessment = assessments[0]
    const aiGoals = await generateDiagnosisGoals(latestAssessment, 1)
    
    // Update existing goals list with AI-generated goals
    existingGoals.value = aiGoals
    
    // Pre-populate the first goal in the form if available
    if (aiGoals.length > 0) {
      const firstGoal = aiGoals[0]
      formData.value = {
        ...formData.value,
        goal_type: firstGoal.goal_type || 'diagnostic',
        title: firstGoal.title || '',
        description: firstGoal.description || '',
        target_behaviors: firstGoal.target_behaviors || [''],
        success_criteria: firstGoal.success_criteria || [''],
        priority: firstGoal.priority || 'high',
        ai_evaluation: 'اهداف با استفاده از هوش مصنوعی بر اساس DSM-5 و ICD-11 تولید شده‌اند'
      }
    }
    
    const toaster = useToaster()
    toaster.show({
      title: 'موفقیت',
      message: `${aiGoals.length} هدف تشخیصی با هوش مصنوعی تولید شد`,
      color: 'success',
      icon: 'ph:brain',
      closable: true,
    })
    
  } catch (error) {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید اهداف با هوش مصنوعی',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
    console.error('Error generating AI goals:', error)
  } finally {
    isGeneratingGoals.value = false
  }
}


const saveDraft = async () => {
  isDraftSaving.value = true
  try {
    const goalData = {
      ...formData.value,
      status: 'pending'
    }
    await createTherapyGoal(goalData)
    
    const toaster = useToaster()
    toaster.show({
      title: 'موفقیت',
      message: 'پیش‌نویس اهداف ذخیره شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
  } catch (error) {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره پیش‌نویس',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  } finally {
    isDraftSaving.value = false
  }
}

const saveAndContinue = async () => {
  isSaving.value = true
  try {
    const goalData = {
      ...formData.value,
      status: 'in_progress'
    }
    await createTherapyGoal(goalData)
    
    // Redirect to wait page for session generation
    await router.push('/therapy-journey/wait')
  } catch (error) {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره اهداف',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  if (sessionId.value) {
    // Go back to session or admin panel
    router.push('/admin/sessions')
  } else {
    router.push('/therapy-journey/assessment')
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'muted'
    case 'in_progress': return 'primary'
    case 'achieved': return 'success'
    default: return 'muted'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'در انتظار'
    case 'in_progress': return 'در حال انجام'
    case 'achieved': return 'تحقق یافته'
    default: return 'نامشخص'
  }
}

const toggleDiagnosticDetails = (index: number) => {
  const goalIndex = expandedGoals.value.indexOf(index)
  if (goalIndex > -1) {
    expandedGoals.value.splice(goalIndex, 1)
  } else {
    expandedGoals.value.push(index)
  }
}

onMounted(() => {
  loadData()
})
</script>