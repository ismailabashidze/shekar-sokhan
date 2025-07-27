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

const currentStep = ref(0)
const progress = ref(0)

const processingSteps = ref([
  { text: 'تحلیل نتایج ارزیابی', status: 'pending' },
  { text: 'تعریف اهداف درمانی', status: 'pending' }
])

const statusMessages = [
  {
    title: 'بررسی پاسخ‌های شما',
    message: 'در حال مطالعه دقیق اطلاعاتی که با ما به اشتراک گذاشتید...'
  },
  {
    title: 'تعریف اهداف درمانی',
    message: 'بر اساس پاسخ‌هایتان، در حال تعریف اهداف مناسب برای درمان شما...'
  }
]

const currentStatus = computed(() => statusMessages[currentStep.value] || statusMessages[0])

const processAssessment = async () => {
  try {
    // Step 1: Analyze assessment results
    updateStep(0, 'processing')
    await new Promise(resolve => setTimeout(resolve, 5000)) // Ensure minimum wait time
    
    const assessments = await getUserAssessments()
    if (assessments.length === 0) {
      throw new Error('No assessment found')
    }
    
    const latestAssessment = assessments[0]
    updateStep(0, 'completed')
    
    // Step 2: Generate therapy goals based on assessment
    updateStep(1, 'processing')
    await new Promise(resolve => setTimeout(resolve, 6000))
    
    const therapyGoals = await generateTherapyGoals(latestAssessment)
    updateStep(1, 'completed')
    
    // Redirect to next step (goal setting or chat)
    setTimeout(() => {
      router.push(`/therapy-journey/goal-setting?assessment=${latestAssessment.id}`)
    }, 1000)
    
  } catch (error) {
    console.error('Error processing assessment:', error)
    // Handle error - maybe redirect back or show error message
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

const generateTherapyGoals = async (assessment: any) => {
  // Create therapy goals based on assessment responses
  const goals = []
  
  // Primary goal: General well-being improvement
  goals.push({
    goal_type: 'general',
    title: 'بهbود کلی سلامت روان',
    description: 'بهبود کیفیت زندگی و سلامت روانی بر اساس نیازهای شناسایی‌شده',
    target_behaviors: [
      'شناسایی و مدیریت احساسات',
      'بهبود مهارت‌های مقابله‌ای',
      'تقویت حمایت اجتماعی',
      'افزایش خودآگاهی'
    ],
    success_criteria: [
      'کاهش سطح استرس روزانه',
      'بهبود کیفیت خواب',
      'افزایش احساس رضایت از زندگی',
      'تقویت روابط بین‌فردی'
    ],
    priority: 'high',
    status: 'pending'
  })

  // Anxiety management goal (if high anxiety indicated)
  if (assessment.anxietyLevel >= 6) {
    goals.push({
      goal_type: 'specific',
      title: 'مدیریت اضطراب',
      description: 'یادگیری تکنیک‌های مؤثر برای کنترل و کاهش اضطراب',
      target_behaviors: [
        'تمرین تکنیک‌های تنفس عمیق',
        'یادگیری تکنیک‌های آرام‌سازی',
        'شناسایی محرک‌های اضطراب',
        'تمرین ذهن‌آگاهی'
      ],
      success_criteria: [
        'کاهش شدت حملات اضطراب',
        'افزایش احساس کنترل',
        'بهبود کیفیت زندگی',
        'کاهش اجتناب از موقعیت‌ها'
      ],
      priority: 'high',
      status: 'pending'
    })
  }

  // Mood improvement goal (if depressive symptoms indicated)
  const depressiveIndicators = [
    assessment.mood === 'افسرده' || assessment.mood === 'بی‌حال',
    assessment.energyLevel <= 3,
    assessment.motivationLevel <= 3,
    assessment.sleepQuality <= 3
  ].filter(Boolean).length
  
  if (depressiveIndicators >= 2) {
    goals.push({
      goal_type: 'specific',
      title: 'بهبود خلق و انگیزه',
      description: 'بهبود وضعیت خلقی و افزایش انگیزه برای فعالیت‌های روزانه',
      target_behaviors: [
        'ایجاد برنامه روزانه ساختاریافته',
        'تمرین فعالیت‌های لذت‌بخش',
        'تنظیم اهداف کوچک و قابل دستیابی',
        'تمرین قدردانی و تفکر مثبت'
      ],
      success_criteria: [
        'افزایش سطح انرژی روزانه',
        'بهبود کیفیت خواب',
        'افزایش مشارکت در فعالیت‌ها',
        'بهبود احساس خوشبینی'
      ],
      priority: 'high',
      status: 'pending'
    })
  }

  // Self-care and lifestyle improvement goal
  goals.push({
    goal_type: 'specific',
    title: 'بهبود سبک زندگی و خودمراقبتی',
    description: 'ایجاد عادات سالم و تقویت مهارت‌های خودمراقبتی',
    target_behaviors: [
      'ایجاد برنامه ورزش منظم',
      'بهبود الگوی تغذیه',
      'تنظیم ساعات خواب',
      'تمرین فعالیت‌های آرام‌بخش'
    ],
    success_criteria: [
      'داشتن برنامه ورزشی هفتگی',
      'بهبود کیفیت تغذیه',
      'تنظیم چرخه خواب و بیداری',
      'کاهش سطح استرس'
    ],
    priority: 'medium',
    status: 'pending'
  })

  return goals
}

onMounted(() => {
  // Start processing after component mounts
  setTimeout(() => {
    processAssessment()
  }, 1000)
})
</script>
