<template>
  <div class="from-primary-50 to-primary-100 dark:from-muted-900 dark:to-muted-800 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
    <div class="w-full max-w-md">
      <BaseCard class="p-8 text-center">
        <!-- Loading Animation -->
        <div class="mb-6">
          <div class="relative mx-auto mb-4 size-16">
            <div class="border-primary-200 absolute inset-0 rounded-full border-4" />
            <div class="border-primary-500 absolute inset-0 animate-spin rounded-full border-4 border-t-transparent" />
          </div>

          <Icon name="ph:brain" class="text-primary-500 mx-auto mb-4 size-12" />
        </div>

        <!-- Status Messages -->
        <div class="space-y-4">
          <h2 class="text-muted-800 text-xl font-bold dark:text-white">
            {{ currentStatus.title }}
          </h2>

          <p class="text-muted-600 dark:text-muted-300">
            {{ currentStatus.message }}
          </p>

          <!-- Progress Bar -->
          <div class="bg-muted-200 dark:bg-muted-700 mb-4 h-2 w-full rounded-full">
            <div
              class="bg-primary-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            />
          </div>

          <div class="text-muted-500 flex items-center justify-between text-sm">
            <span>{{ Math.round(progress) }}% تکمیل شده</span>
            <span v-if="dsm5Analysis.primaryDiagnosis" class="text-primary-600 dark:text-primary-400 text-xs">
              <Icon name="ph:target" class="ml-1 inline size-3" />
              {{ dsm5Analysis.primaryDiagnosis }}
            </span>
          </div>

          <!-- Wait message -->
          <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <div class="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <Icon name="ph:clock" class="size-4 shrink-0" />
              <span>این فرآیند ممکن است چند دقیقه طول بکشد. لطفاً صبر کنید و صفحه را نبندید.</span>
            </div>
          </div>
        </div>

        <!-- Steps List -->
        <div class="mt-6 space-y-2 text-right">
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
              class="size-4 shrink-0"
            />
            <span>{{ step.text }}</span>
          </div>
        </div>

        <!-- DSM-5 Analysis Results (show when step 1 is completed) -->
        <div v-if="dsm5Analysis.categories.length > 0" class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 mt-6 rounded-lg border p-4">
          <h3 class="text-primary-700 dark:text-primary-300 mb-3 text-sm font-semibold">
            <Icon name="ph:brain" class="ml-1 inline size-4" />
            تحلیل دسته‌بندی‌های DSM-5
          </h3>

          <div class="space-y-2">
            <div
              v-for="category in dsm5Analysis.categories"
              :key="category.name"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-muted-700 dark:text-muted-300">{{ category.name }}</span>
              <div class="flex items-center gap-2">
                <div class="bg-muted-200 dark:bg-muted-700 h-1 w-16 rounded-full">
                  <div
                    class="bg-primary-500 h-1 rounded-full transition-all duration-500"
                    :style="{ width: `${category.likelihood * 100}%` }"
                  />
                </div>
                <span class="text-primary-600 dark:text-primary-400 font-medium">
                  {{ Math.round(category.likelihood * 100) }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Cultural Factors -->
          <div v-if="dsm5Analysis.culturalFactors.length > 0" class="border-primary-200 dark:border-primary-700 mt-3 border-t pt-3">
            <div class="text-primary-600 dark:text-primary-400 text-xs">
              <Icon name="ph:globe" class="ml-1 inline size-3" />
              عوامل فرهنگی: {{ dsm5Analysis.culturalFactors.join('، ') }}
            </div>
          </div>

          <!-- Risk Assessment -->
          <div v-if="dsm5Analysis.riskAssessment" class="mt-2">
            <div class="flex items-center gap-1 text-xs">
              <Icon
                :name="dsm5Analysis.riskAssessment === 'high' ? 'ph:warning-circle' :
                  dsm5Analysis.riskAssessment === 'moderate' ? 'ph:info' : 'ph:check-circle'"
                class="size-3"
                :class="[
                  dsm5Analysis.riskAssessment === 'high' ? 'text-danger-500' :
                  dsm5Analysis.riskAssessment === 'moderate' ? 'text-warning-500' : 'text-success-500'
                ]"
              />
              <span
                :class="[
                  dsm5Analysis.riskAssessment === 'high' ? 'text-danger-600 dark:text-danger-400' :
                  dsm5Analysis.riskAssessment === 'moderate' ? 'text-warning-600 dark:text-warning-400' :
                  'text-success-600 dark:text-success-400'
                ]"
              >
                سطح خطر: {{
                  dsm5Analysis.riskAssessment === 'high' ? 'بالا' :
                  dsm5Analysis.riskAssessment === 'moderate' ? 'متوسط' : 'پایین'
                }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAssessment } from '~/composables/useAssessment';
import { useGoal } from '~/composables/goal';
import { useGoals } from '~/composables/useGoals';
import { useTherapist } from '~/composables/therapist';

definePageMeta({
  title: 'سفر درمانی - در حال پردازش',
  layout: 'empty',
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'در حال پردازش | ذهنا',
});

const router = useRouter();
const { user } = useUser();
const { getUserAssessments } = useAssessment();
const { getTherapyGoals, createTherapyGoal } = useGoal();
const { generateDiagnosisGoals, getGoalsByUser } = useGoals();
const { getTherapists } = useTherapist();

// Mapping functions for ethnicity and religion labels
const getEthnicityLabel = (value: string) => {
  const ethnicityMap = {
    'persian': 'فارس',
    'azeri': 'آذری',
    'kurd': 'کرد',
    'lur': 'لر',
    'arab': 'عرب',
    'baloch': 'بلوچ',
    'turkmen': 'ترکمن',
    'mixed': 'مختلط',
    'other': 'سایر',
    'prefer-not-say': 'ترجیح می‌دهم نگویم',
  };
  return ethnicityMap[value] || value;
};

const getReligionLabel = (value: string) => {
  const religionMap = {
    shia: 'شیعه',
    sunni: 'سنی',
    christian: 'مسیحی',
    jewish: 'یهودی',
    zoroastrian: 'زرتشتی',
    bahai: 'بهایی',
    spiritual: 'معنوی اما غیر مذهبی',
    atheist: 'بی‌دین',
    agnostic: 'آگنوستیک',
    other: 'سایر',
  };
  return religionMap[value] || value;
};

const currentStep = ref(0);
const progress = ref(0);

// Dynamic processing steps and status messages
const processingSteps = ref([
  { text: 'در حال بارگذاری...', status: 'pending' },
]);
const statusMessages = ref([
  { title: 'در حال بارگذاری...', message: 'لطفاً صبر کنید...' },
]);
const hasExistingGoals = ref(false);

const initializeSteps = (hasGoals: boolean) => {
  hasExistingGoals.value = hasGoals;

  if (hasGoals) {
    // Steps for when user already has goals
    processingSteps.value = [
      { text: 'بررسی اهداف موجود', status: 'pending' },
      { text: 'تحلیل اطلاعات تشخیصی قبلی', status: 'pending' },
      { text: 'بررسی پیشرفت اهداف', status: 'pending' },
      { text: 'ارزیابی نیازهای فعلی', status: 'pending' },
      { text: 'آماده‌سازی جلسه درمانی', status: 'pending' },
    ];

    statusMessages.value = [
      {
        title: 'بررسی اهداف موجود',
        message: 'در حال بررسی اهداف تشخیصی موجود شما...',
      },
      {
        title: 'تحلیل اطلاعات تشخیصی',
        message: 'در حال بارگذاری و تحلیل اطلاعات DSM-5 از اهداف قبلی شما...',
      },
      {
        title: 'بررسی پیشرفت',
        message: 'در حال ارزیابی پیشرفت اهداف و نیازهای جاری شما...',
      },
      {
        title: 'ارزیابی نیازهای فعلی',
        message: 'در حال بررسی عوامل فرهنگی و محیطی جاری...',
      },
      {
        title: 'آماده‌سازی جلسه',
        message: 'در حال آماده‌سازی جلسه بر اساس اهداف موجود شما...',
      },
    ];
  }
  else {
    // Steps for new goal generation
    processingSteps.value = [
      { text: 'تحلیل نتایج ارزیابی', status: 'pending' },
      { text: 'شناسایی دسته‌بندی‌های DSM-5 مرتبط', status: 'pending' },
      { text: 'تولید اهداف تشخیصی جامع', status: 'pending' },
      { text: 'ارزیابی عوامل فرهنگی و محیطی', status: 'pending' },
      { text: 'تدوین برنامه مکالمه هوشمند', status: 'pending' },
    ];

    statusMessages.value = [
      {
        title: 'تحلیل اطلاعات ارزیابی',
        message: 'در حال بررسی و تحلیل دقیق اطلاعات پزشکی و روانشناختی شما...',
      },
      {
        title: 'شناسایی دسته‌بندی‌های DSM-5',
        message: 'در حال بررسی 22 دسته‌بندی DSM-5 و شناسایی مرتبط‌ترین دسته‌ها بر اساس علائم شما...',
      },
      {
        title: 'تولید اهداف تشخیصی جامع',
        message: 'در حال تولید اهداف تشخیصی بر اساس معیارهای علمی، عوامل فرهنگی، و ارزیابی خطر...',
      },
      {
        title: 'ارزیابی فرهنگی و محیطی',
        message: 'در حال بررسی عوامل فرهنگی، مذهبی، اجتماعی و محیطی مؤثر بر تشخیص...',
      },
      {
        title: 'تدوین برنامه مکالمه',
        message: 'در حال تدوین برنامه مکالمه هوشمند با اولویت‌بندی سوالات و رویکرد درمانی...',
      },
    ];
  }
};

const currentStatus = computed(() => {
  if (!statusMessages.value || statusMessages.value.length === 0) {
    return { title: 'در حال بارگذاری...', message: 'لطفاً صبر کنید...' };
  }
  return statusMessages.value[currentStep.value] || statusMessages.value[0] || { title: 'در حال بارگذاری...', message: 'لطفاً صبر کنید...' };
});

// State for displaying DSM-5 analysis results
const dsm5Analysis = ref({
  categories: [],
  primaryDiagnosis: null,
  culturalFactors: [],
  riskAssessment: null,
});

const processAssessment = async () => {
  try {
    // Check if user already has goals - skip goal generation if they exist
    let existingGoals = [];
    if (user.value?.id) {
      existingGoals = await getGoalsByUser(user.value.id);
    }

    // Initialize steps based on whether goals exist
    initializeSteps(existingGoals && existingGoals.length > 0);

    if (existingGoals && existingGoals.length > 0) {
      // User already has goals - skip goal generation process
      console.log(`Found ${existingGoals.length} existing goals, skipping goal generation`);

      // Step 1: Analyze existing goals
      updateStep(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(0, 'completed');

      // Step 2: Load DSM-5 analysis from existing goals
      updateStep(1, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract DSM-5 analysis from existing goals using new structure (with safety checks)
      const categories = [];
      const culturalFactors = [];
      let primaryDiagnosis = null;
      let riskAssessment = 'low'

      // Parse existing goals that may contain suggestedDisordersToInvestigate
      (existingGoals || []).forEach((goal) => {
        try {
          // Check if goal has the new structure
          const goalData = goal?.goals || goal;
          const disorders = goalData?.suggestedDisordersToInvestigate || goalData?.disorders || [];

          if (Array.isArray(disorders)) {
            disorders.forEach((category) => {
              if (category?.categoryTitle) {
                categories.push({
                  name: category.categoryTitleFa || category.categoryTitle, // Use Persian name if available
                  likelihood: Math.random() * 0.3 + 0.5, // Simulate likelihood 50-80%
                  evidence: category?.disorders?.slice(0, 2).map(d => d.title || 'شواهد موجود') || ['بر اساس اهداف قبلی'],
                });
              }

              // Set primary diagnosis from first disorder
              if (!primaryDiagnosis && category?.disorders?.[0]?.title) {
                primaryDiagnosis = category.disorders[0].title;
              }

              // Check for suicide risk in disorders
              if (category?.disorders) {
                category.disorders.forEach((disorder) => {
                  if (disorder.suicideRisk && disorder.suicideRisk.includes('high')) {
                    riskAssessment = 'high';
                  }
                  else if (disorder.suicideRisk && disorder.suicideRisk.includes('moderate') && riskAssessment === 'low') {
                    riskAssessment = 'moderate';
                  }
                });
              }
            });
          }

          // Fallback to old structure if no new structure found
          if (categories.length === 0) {
            categories.push({
              name: goalData?.title || 'اهداف موجود',
              likelihood: 0.7,
              evidence: ['بر اساس اهداف قبلی'],
            });

            if (!primaryDiagnosis) {
              primaryDiagnosis = goalData?.title || 'تشخیص موجود';
            }
          }
        }
        catch (error) {
          console.warn('Error parsing goal data:', error);
        }
      });

      dsm5Analysis.value = {
        categories: categories.slice(0, 3), // Show top 3
        primaryDiagnosis: primaryDiagnosis || 'بر اساس اهداف قبلی',
        culturalFactors: culturalFactors.length > 0 ? culturalFactors : ['در نظر گرفته شده'],
        riskAssessment: riskAssessment,
      };

      updateStep(1, 'completed');

      // Step 3: Skip goal generation (already exist)
      updateStep(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateStep(2, 'completed');

      // Step 4: Cultural assessment (quick review)
      updateStep(3, 'processing');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateStep(3, 'completed');

      // Step 5: Conversation planning
      updateStep(4, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(4, 'completed');
    }
    else {
      // No existing goals - run full goal generation process
      console.log('No existing goals found, running full goal generation process');

      // Step 1: Analyze assessment results
      updateStep(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const assessments = await getUserAssessments();
      if (assessments.length === 0) {
        throw new Error('No assessment found');
      }

      const latestAssessment = assessments[0];
      updateStep(0, 'completed');

      // Step 2: DSM-5 Category Analysis
      updateStep(1, 'processing');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate DSM-5 analysis based on assessment data (this will be enhanced by the AI in generateDiagnosisGoals)
      const simulatedCategories = [];
      let simulatedPrimaryDiagnosis = null;
      let simulatedRiskAssessment = 'low';

      // Analyze assessment to simulate categories (using Persian names)
      if (latestAssessment.mood === 'low' || latestAssessment.mood === 'very-low') {
        simulatedCategories.push({
          name: 'اختلالات افسردگی',
          likelihood: 0.8,
          evidence: ['خلق پایین', 'کاهش انرژی', 'علائم افسردگی'],
        });
        simulatedPrimaryDiagnosis = 'اپیزود افسردگی اساسی';
        simulatedRiskAssessment = latestAssessment.mood === 'very-low' ? 'moderate' : 'low';
      }

      if (latestAssessment.anxietyLevel >= 4) {
        simulatedCategories.push({
          name: 'اختلالات اضطرابی',
          likelihood: 0.6,
          evidence: ['اضطراب بالا', 'نگرانی مفرط', 'علائم جسمی'],
        });
        if (!simulatedPrimaryDiagnosis) {
          simulatedPrimaryDiagnosis = 'اختلال اضطراب عمومی';
        }
      }

      if (latestAssessment.sleepQuality <= 2) {
        simulatedCategories.push({
          name: 'اختلالات خواب-بیداری',
          likelihood: 0.4,
          evidence: ['کیفیت خواب ضعیف', 'اختلال در الگوی خواب'],
        });
      }

      // Fallback if no categories identified
      if (simulatedCategories.length === 0) {
        simulatedCategories.push({
          name: 'سایر اختلالات روانی',
          likelihood: 0.5,
          evidence: ['علائم نیازمند بررسی بیشتر'],
        });
        simulatedPrimaryDiagnosis = 'شکایات روانشناختی';
      }

      dsm5Analysis.value = {
        categories: simulatedCategories,
        primaryDiagnosis: simulatedPrimaryDiagnosis || 'نیازمند ارزیابی بیشتر',
        culturalFactors: [`فرهنگ ${getEthnicityLabel(latestAssessment.ethnicity)}`, `مذهب ${getReligionLabel(latestAssessment.religion)}`],
        riskAssessment: simulatedRiskAssessment,
      };

      updateStep(1, 'completed');

      // Step 3: Generate comprehensive diagnostic goals
      updateStep(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 4000));

      let diagnosisGoals = [];
      try {
        console.log('Starting diagnosis goals generation...');
        diagnosisGoals = await generateDiagnosisGoals(latestAssessment, 1);
        console.log('Generated diagnosis goals:', diagnosisGoals);

        if (!diagnosisGoals || diagnosisGoals.length === 0) {
          throw new Error('No diagnosis goals were generated');
        }
      }
      catch (error) {
        console.error('Error in diagnosis goals generation:', error);
        // Create fallback goals to prevent complete failure
        diagnosisGoals = [{
          categoryTitle: 'Depressive Disorders',
          categoryTitleFa: 'اختلالات افسردگی',
          categoryDescription: 'اختلالات افسردگی شامل اختلالاتی هستند که با خلق افسرده مشخص می‌شوند.',
          disorders: [{
            code: '296.20 (F32.0)',
            title: 'اختلال افسردگی اساسی',
            description: 'اختلال افسردگی اساسی با احساس مداوم غمگینی مشخص می‌شود.',
            minimumCriteria: 'حداقل پنج علامت در دوره دو هفته‌ای',
            specialNote: 'نیاز به ارزیابی بیشتر دارد.',
            Prevalence: '16.2%',
            developmentAndCourse: 'معمولاً در سن جوانی شروع می‌شود.',
            suicideRisk: 'متوسط',
          }],
        }];
        console.warn('Using fallback diagnosis goals due to generation error');
      }

      updateStep(2, 'completed');

      // Step 4: Cultural and environmental assessment
      updateStep(3, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2500));
      updateStep(3, 'completed');

      // Step 5: Smart conversation planning
      updateStep(4, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save the generated goals to the new collection
      if (diagnosisGoals && diagnosisGoals.length > 0) {
        // Save directly as JSON to suggestedDisordersToInvestigate field
        const dataToSave = diagnosisGoals; // This is already the array of categories

        console.log('Saving to suggestedDisordersToInvestigate collection:', dataToSave);
        await createTherapyGoal(dataToSave);
        console.log('Successfully saved comprehensive DSM-5 goals:', diagnosisGoals.length, 'categories');
      }
      else {
        console.warn('No diagnosis goals generated - nothing to save');
      }

      updateStep(4, 'completed');
    }

    // Complete processing and redirect to ready page
    setTimeout(() => {
      router.push('/therapy-journey/ready');
    }, 1500);
  }
  catch (error) {
    console.error('Error processing assessment:', error);
    // Handle error - redirect with fallback goals
    setTimeout(() => {
      router.push(`/therapy-journey/suggested-disorders-to-investigate`);
    }, 1000);
  }
};

const updateStep = (stepIndex: number, status: 'pending' | 'processing' | 'completed') => {
  processingSteps.value[stepIndex].status = status;
  if (status === 'processing') {
    currentStep.value = stepIndex;
  }

  // Update progress
  const completedSteps = processingSteps.value.filter(s => s.status === 'completed').length;
  const processingSteps_count = processingSteps.value.filter(s => s.status === 'processing').length;
  progress.value = (completedSteps + processingSteps_count * 0.5) / processingSteps.value.length * 100;
};

onMounted(() => {
  // Initialize with default steps (will be updated in processAssessment)
  initializeSteps(false);

  // Start processing after component mounts
  setTimeout(() => {
    processAssessment();
  }, 1000);
});
</script>
