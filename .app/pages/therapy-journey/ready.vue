<template>
  <div class="from-success-50 to-success-100 dark:from-muted-900 dark:to-muted-800 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
    <div class="w-full max-w-2xl">
      <BaseCard class="p-8 text-center">
        <!-- Success Animation -->
        <div class="mb-8">
          <div class="relative mx-auto mb-6 size-20">
            <div class="border-success-200 absolute inset-0 rounded-full border-4" />
            <div class="bg-success-500 absolute inset-2 rounded-full flex items-center justify-center">
              <Icon name="ph:check" class="text-white size-8" />
            </div>
          </div>

          <div class="flex justify-center space-x-reverse space-x-2 mb-4">
            <Icon name="ph:brain" class="text-success-500 size-8" />
            <Icon name="ph:heart" class="text-success-500 size-8" />
            <Icon name="ph:target" class="text-success-500 size-8" />
          </div>
        </div>

        <!-- Main Message -->
        <div class="space-y-4 mb-8">
          <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
            {{ readyTitle }}
          </h1>

          <p class="text-muted-600 dark:text-muted-300 text-lg leading-relaxed">
            {{ readyMessage }}
          </p>
        </div>

        <!-- Goals Summary -->
        <div v-if="userGoals.length > 0" class="bg-muted-50 dark:bg-muted-800 rounded-xl p-6 mb-8">
          <h3 class="text-muted-700 dark:text-muted-300 text-sm font-medium mb-4 flex items-center justify-center gap-2">
            اهداف درمانی شما ({{ userGoals.length }} هدف)
            <Icon name="ph:list-checks" class="size-4" />
          </h3>
          
          <div class="grid gap-3">
            <div
              v-for="(goal, index) in userGoals.slice(0, 3)"
              :key="index"
              class="bg-white dark:bg-muted-700 rounded-lg p-4 border border-muted-200 dark:border-muted-600"
            >
              <!-- Header with icon and category -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <Icon name="ph:brain" class="size-4 text-primary-500" />
                  <span class="text-xs font-medium text-muted-600 dark:text-muted-300">
                    دسته {{ index + 1 }}
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="text-xs font-bold text-success-600">
                    {{ getDisorderCount(goal) }} اختلال
                  </div>
                  <div class="w-2 h-2 rounded-full bg-success-500"></div>
                </div>
              </div>
              
              <!-- Category Title -->
              <div class="text-right mb-2">
                <div class="font-medium text-sm text-muted-800 dark:text-white">
                  {{ getCategoryTitle(goal) }}
                </div>
              </div>
              
              <!-- DSM-5 Disorders preview -->
              <div class="text-right space-y-1">
                <div class="flex items-center gap-2 text-xs text-muted-600 dark:text-muted-300">
                  <Icon name="ph:stethoscope" class="size-3" />
                  <span>{{ getTopDisorders(goal) }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-muted-500 dark:text-muted-400">
                  <Icon name="ph:target" class="size-3" />
                  <span>{{ getGoalStatus(goal) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="userGoals.length > 3" class="text-muted-500 text-xs text-center">
              و {{ userGoals.length - 3 }} هدف دیگر...
            </div>
          </div>
        </div>

        <!-- Therapist Info -->
        <div v-if="selectedTherapist" class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-8">
          <h3 class="text-muted-700 dark:text-muted-300 text-sm font-medium mb-4 flex items-center justify-center gap-2">
            روانشناس شما
            <Icon name="ph:user-circle" class="size-4" />
          </h3>
          
          <div class="flex items-center justify-center gap-4 flex-row-reverse">
            <div class="text-center">
              <div class="text-muted-800 dark:text-white font-medium">
                {{ selectedTherapist.name }}
              </div>
              <div class="text-muted-500 text-sm">
                {{ selectedTherapist.specialty || 'روانشناس بالینی' }}
              </div>
            </div>
            <BaseAvatar
              :text="selectedTherapist.name"
              size="lg"
              class="bg-primary-500"
            />
          </div>
        </div>

        <!-- Ready Confirmation -->
        <div class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div class="flex items-start gap-3 text-right">
              <Icon name="ph:lightbulb" class="text-blue-500 size-5 mt-0.5 flex-shrink-0" />
              <div class="text-justify text-blue-800 dark:text-blue-200 text-sm">
                <div class="font-medium mb-1">آماده شدن برای جلسه درمانی</div>
                <div class="text-blue-600 dark:text-blue-300">
                  جلسه درمانی بر اساس اهداف تشخیصی شما هدایت خواهد شد. در طول گفت‌وگو، روانشناس سوالات مناسبی برای بررسی دقیق‌تر وضعیت شما خواهد پرسید. لطفا همکاری کامل را داشته باشید.
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <BaseButton
              color="success"
              size="lg"
              class="w-full flex items-center justify-center gap-2"
              :loading="isStarting"
              :disabled="isStarting"
              @click="startTherapySession"
            >
            <Icon name="ph:play-circle" class="size-5" />
              آماده‌ام، شروع کنیم
            </BaseButton>

          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 pt-6 border-t border-muted-200 dark:border-muted-700">
          <div class="text-muted-500 text-xs space-y-2">
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:shield-check" class="size-3 flex-shrink-0" />
              <span>تمامی اطلاعات محرمانه و امن نگهداری می‌شود</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:clock" class="size-3 flex-shrink-0" />
              <span>مدت زمان جلسه: تقریباً {{ estimatedDuration }} دقیقه</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'آماده برای شروع | ذهنا',
})

const router = useRouter()
const { user } = useUser()
const { getGoalsByUser } = useGoals()
const { getTherapists } = usePsychotherapist()

// Reactive state
const isStarting = ref(false)
const userGoals = ref<any[]>([])
const selectedTherapist = ref<any>(null)
const estimatedDuration = ref(30)

// Computed messages
const readyTitle = computed(() => {
  if (userGoals.value.length === 0) {
    return 'آماده‌سازی جلسه'
  }
  return 'تحلیل تشخیصی تکمیل شد!'
})

const readyMessage = computed(() => {
  if (userGoals.value.length === 0) {
    return 'در حال آماده‌سازی جلسه درمانی شما...'
  }
  
  // Count total disorders across all goals
  const totalDisorders = userGoals.value.reduce((total, goal) => {
    const goalData = goal?.goals || goal
    const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || []
    if (Array.isArray(disorders)) {
      return total + disorders.reduce((count, category) => {
        return count + (category?.disorders?.length || 0)
      }, 0)
    }
    return total + 1
  }, 0)
  
  return `بر اساس ارزیابی شما، ${userGoals.value.length} دسته‌بندی DSM-5 با ${totalDisorders} اختلال محتمل شناسایی شده است. اکنون آماده آغاز جلسه تشخیصی هستیم.`
})

// Load user goals and therapist info
const loadSessionData = async () => {
  try {
    if (user.value?.id) {
      // Load user goals
      const goals = await getGoalsByUser(user.value.id)
      userGoals.value = goals || []
      
      // Load therapists and select default
      const therapists = await getTherapists()
      selectedTherapist.value = therapists.find(t => t.isActive) || therapists[0]
      
      // Estimate session duration based on number of goals
      estimatedDuration.value = Math.max(30, Math.min(60, userGoals.value.length * 8))
    }
  } catch (error) {
    console.error('Error loading session data:', error)
  }
}

// Start therapy session
const startTherapySession = async () => {
  if (isStarting.value) return
  
  isStarting.value = true
  
  try {
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Navigate to chat with therapist
    if (selectedTherapist.value) {
      await router.push(`/therapy-journey/chat?therapistId=${selectedTherapist.value.id}`)
    } else {
      await router.push('/therapy-journey/chat')
    }
  } catch (error) {
    console.error('Error starting therapy session:', error)
    isStarting.value = false
    
    // Fallback navigation
    await router.push('/therapy-journey/chat')
  }
}

// Review goals
const reviewGoals = async () => {
  await router.push('/therapy-journey/suggested-disorders-to-investigate')
}

// Helper functions for displaying new goal structure
const getCategoryTitle = (goal: any) => {
  // Check for new structure first
  const goalData = goal?.goals || goal
  const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || []
  
  if (Array.isArray(disorders) && disorders.length > 0) {
    return disorders[0]?.categoryTitleFa || disorders[0]?.categoryTitle || goalData?.categoryTitle || 'دسته‌بندی DSM-5'
  }
  
  // Fallback to old structure
  return goal?.title || goalData?.title || 'هدف تشخیصی'
}

const getDisorderCount = (goal: any) => {
  const goalData = goal?.goals || goal
  const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || []
  
  if (Array.isArray(disorders) && disorders.length > 0) {
    const totalDisorders = disorders.reduce((count, category) => {
      return count + (category?.disorders?.length || 0)
    }, 0)
    return totalDisorders
  }
  
  return 1
}

const getTopDisorders = (goal: any) => {
  const goalData = goal?.goals || goal
  const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || []
  
  if (Array.isArray(disorders) && disorders.length > 0) {
    const allDisorders = []
    disorders.forEach(category => {
      if (category?.disorders) {
        allDisorders.push(...category.disorders.slice(0, 2).map(d => d.title))
      }
    })
    
    if (allDisorders.length > 0) {
      return allDisorders.slice(0, 2).join('، ') + (allDisorders.length > 2 ? '...' : '')
    }
  }
  
  return 'اختلالات پیشنهادی'
}

const getGoalStatus = (goal: any) => {
  const goalData = goal?.goals || goal
  const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || []
  
  if (Array.isArray(disorders) && disorders.length > 0) {
    const totalDisorders = disorders.reduce((count, category) => {
      return count + (category?.disorders?.length || 0)
    }, 0)
    
    if (totalDisorders >= 5) return 'بررسی جامع مورد نیاز'
    if (totalDisorders >= 3) return 'ارزیابی دقیق پیشنهادی'
    if (totalDisorders >= 1) return 'بررسی اولیه'
  }
  
  return 'آماده برای بررسی'
}

// Load data on mount
onMounted(() => {
  loadSessionData()
})
</script>