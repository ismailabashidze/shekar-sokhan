<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-muted-900 dark:to-muted-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <BaseCard class="p-8 text-center">
        <!-- Loading Animation -->
        <div class="mb-6">
          <div class="w-16 h-16 mx-auto mb-4 relative">
            <div class="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <Icon name="ph:brain" class="w-12 h-12 text-primary-500 mx-auto mb-4" />
        </div>

        <!-- Status Messages -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-muted-800 dark:text-white">
            {{ currentStatus.title }}
          </h2>
          
          <p class="text-muted-600 dark:text-muted-300">
            {{ currentStatus.message }}
          </p>

          <!-- Progress Bar -->
          <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-2 mb-4">
            <div 
              class="bg-primary-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>

          <p class="text-sm text-muted-500">
            {{ Math.round(progress) }}% تکمیل شده
          </p>
        </div>

        <!-- Steps List -->
        <div class="mt-6 text-right space-y-2">
          <div 
            v-for="(step, index) in processingSteps" 
            :key="index"
            class="flex items-center gap-3 text-sm"
            :class="[
              step.status === 'completed' ? 'text-success-600' : 
              step.status === 'processing' ? 'text-primary-600' : 
              'text-muted-400'
            ]"
          >
            <Icon 
              :name="step.status === 'completed' ? 'ph:check-circle-fill' : 
                     step.status === 'processing' ? 'ph:circle-dashed' : 
                     'ph:circle'"
              class="w-4 h-4 flex-shrink-0"
            />
            <span>{{ step.text }}</span>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAssessment } from '~/composables/useAssessment'
import { useGoal } from '~/composables/goal'
import { useGoals } from '~/composables/useGoals'
import { useTherapist } from '~/composables/therapist'

definePageMeta({
  title: 'سفر درمانی - در حال پردازش',
  layout: 'empty',
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'در حال پردازش | ذهنا',
})

const router = useRouter()
const { user } = useUser()
const { getUserAssessments } = useAssessment()
const { getTherapyGoals, createTherapyGoal } = useGoal()
const { generateDiagnosisGoals } = useGoals()
const { getTherapists } = useTherapist()

const currentStep = ref(0)
const progress = ref(0)

const processingSteps = ref([
  { text: 'تحلیل نتایج ارزیابی', status: 'pending' },
  { text: 'تولید اهداف تشخیصی با هوش مصنوعی', status: 'pending' },
  { text: 'بررسی معیارهای DSM-5 و ICD-11', status: 'pending' }
])

const statusMessages = [
  {
    title: 'تحلیل ارزیابی شما',
    message: 'در حال مطالعه دقیق اطلاعاتی که با ما به اشتراک گذاشتید...'
  },
  {
    title: 'تولید اهداف تشخیصی',
    message: 'هوش مصنوعی در حال تولید اهداف تشخیصی بر اساس علائم شما...'
  },
  {
    title: 'بررسی معیارهای تشخیصی',
    message: 'در حال بررسی معیارهای DSM-5 و ICD-11 برای تشخیص دقیق...'
  }
]

const currentStatus = computed(() => statusMessages[currentStep.value] || statusMessages[0])

const processAssessment = async () => {
  try {
    // Step 1: Analyze assessment results
    updateStep(0, 'processing')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const assessments = await getUserAssessments()
    if (assessments.length === 0) {
      throw new Error('No assessment found')
    }
    
    const latestAssessment = assessments[0]
    updateStep(0, 'completed')
    
    // Step 2: Generate AI-powered diagnosis goals
    updateStep(1, 'processing')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const diagnosisGoals = await generateDiagnosisGoals(latestAssessment, 1)
    updateStep(1, 'completed')
    
    // Step 3: Process DSM-5 and ICD-11 criteria
    updateStep(2, 'processing')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Save the generated goals to database
    for (const goal of diagnosisGoals) {
      await createTherapyGoal({
        ...goal,
        user_id: user.value?.id,
        therapist_id: user.value?.id || '',
        status: 'pending',
        progress_percentage: 0,
        ai_evaluation: '',
        notes: '',
        target_date: null,
        achieved_date: null,
        sub_goals: []
      })
    }
    
    updateStep(2, 'completed')
    
    // Get available therapists and redirect to chat page
    const therapists = await getTherapists()
    const defaultTherapist = therapists.find(t => t.isActive) || therapists[0]
    
    setTimeout(() => {
      if (defaultTherapist) {
        router.push(`/therapy-journey/chat?therapistId=${defaultTherapist.id}`)
      } else {
        router.push('/therapy-journey/chat')
      }
    }, 1000)
    
  } catch (error) {
    console.error('Error processing assessment:', error)
    // Handle error - redirect with fallback goals
    setTimeout(() => {
      router.push(`/therapy-journey/goal-setting`)
    }, 1000)
  }
}

const updateStep = (stepIndex: number, status: 'pending' | 'processing' | 'completed') => {
  processingSteps.value[stepIndex].status = status
  if (status === 'processing') {
    currentStep.value = stepIndex
  }
  
  // Update progress
  const completedSteps = processingSteps.value.filter(s => s.status === 'completed').length
  const processingSteps_count = processingSteps.value.filter(s => s.status === 'processing').length
  progress.value = (completedSteps + processingSteps_count * 0.5) / processingSteps.value.length * 100
}


onMounted(() => {
  // Start processing after component mounts
  setTimeout(() => {
    processAssessment()
  }, 1000)
})
</script>
