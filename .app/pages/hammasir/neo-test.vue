<script setup lang="ts">
definePageMeta({
  title: 'آزمون شخصیت NEO',
  preview: {
    title: 'NEO Personality Test',
    description: 'Take the NEO personality assessment',
    categories: ['test'],
    src: '/img/screens/neo-test-hammasir.png',
    srcDark: '/img/screens/neo-test-hammasir-dark.png',
    order: 4,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Test state
const currentQuestionIndex = ref(0)
const answers = ref<Record<number, number>>({})
const isTestStarted = ref(false)
const isTestCompleted = ref(false)
const testStartTime = ref<Date | null>(null)

// NEO personality test questions (60 questions covering 5 factors)
const questions = [
  // Extraversion (12 questions)
  { id: 1, text: 'من معمولاً در جمع‌های اجتماعی احساس راحتی می‌کنم.', factor: 'extraversion', reverse: false },
  { id: 2, text: 'ترجیح می‌دهم بیشتر وقتم را تنها بگذرانم.', factor: 'extraversion', reverse: true },
  { id: 3, text: 'دوست دارم مرکز توجه باشم.', factor: 'extraversion', reverse: false },
  { id: 4, text: 'در گروه‌ها معمولاً نقش رهبری را بر عهده می‌گیرم.', factor: 'extraversion', reverse: false },
  { id: 5, text: 'در مهمانی‌ها ترجیح می‌دهم در گوشه‌ای بنشینم.', factor: 'extraversion', reverse: true },
  { id: 6, text: 'به راحتی با غریبه‌ها صحبت می‌کنم.', factor: 'extraversion', reverse: false },
  { id: 7, text: 'معمولاً پرانرژی و شاداب هستم.', factor: 'extraversion', reverse: false },
  { id: 8, text: 'گاهی اوقات خیلی آرام و ساکت می‌شوم.', factor: 'extraversion', reverse: true },
  { id: 9, text: 'دوست دارم فعالیت‌های گروهی داشته باشم.', factor: 'extraversion', reverse: false },
  { id: 10, text: 'معمولاً اولین کسی هستم که در گفتگو شرکت می‌کنم.', factor: 'extraversion', reverse: false },
  { id: 11, text: 'ترجیح می‌دهم در خانه بمانم تا بیرون بروم.', factor: 'extraversion', reverse: true },
  { id: 12, text: 'در موقعیت‌های اجتماعی احساس هیجان می‌کنم.', factor: 'extraversion', reverse: false },

  // Agreeableness (12 questions)
  { id: 13, text: 'معمولاً به خوبی مردم اعتماد دارم.', factor: 'agreeableness', reverse: false },
  { id: 14, text: 'گاهی فکر می‌کنم مردم سعی می‌کنند از من سوءاستفاده کنند.', factor: 'agreeableness', reverse: true },
  { id: 15, text: 'همیشه سعی می‌کنم به دیگران کمک کنم.', factor: 'agreeableness', reverse: false },
  { id: 16, text: 'معمولاً مهربان و دلسوز هستم.', factor: 'agreeableness', reverse: false },
  { id: 17, text: 'گاهی اوقات با دیگران بی‌رحم رفتار می‌کنم.', factor: 'agreeableness', reverse: true },
  { id: 18, text: 'دوست دارم با دیگران همکاری کنم.', factor: 'agreeableness', reverse: false },
  { id: 19, text: 'معمولاً دیگران را بخشیده و فراموش می‌کنم.', factor: 'agreeableness', reverse: false },
  { id: 20, text: 'گاهی اوقات با دیگران دعوا می‌کنم.', factor: 'agreeableness', reverse: true },
  { id: 21, text: 'همیشه سعی می‌کنم منصف و عادل باشم.', factor: 'agreeableness', reverse: false },
  { id: 22, text: 'معمولاً احساسات دیگران را درک می‌کنم.', factor: 'agreeableness', reverse: false },
  { id: 23, text: 'گاهی اوقات خودخواه می‌شوم.', factor: 'agreeableness', reverse: true },
  { id: 24, text: 'دوست دارم دیگران را خوشحال کنم.', factor: 'agreeableness', reverse: false },

  // Conscientiousness (12 questions)
  { id: 25, text: 'همیشه کارهایم را به موقع انجام می‌دهم.', factor: 'conscientiousness', reverse: false },
  { id: 26, text: 'گاهی اوقات کارهایم را به تعویق می‌اندازم.', factor: 'conscientiousness', reverse: true },
  { id: 27, text: 'معمولاً منظم و مرتب هستم.', factor: 'conscientiousness', reverse: false },
  { id: 28, text: 'همیشه برای کارهایم برنامه‌ریزی می‌کنم.', factor: 'conscientiousness', reverse: false },
  { id: 29, text: 'گاهی اوقات بی‌نظم و آشفته می‌شوم.', factor: 'conscientiousness', reverse: true },
  { id: 30, text: 'معمولاً سخت کوش و پشتکار دارم.', factor: 'conscientiousness', reverse: false },
  { id: 31, text: 'همیشه سعی می‌کنم بهترین کار را انجام دهم.', factor: 'conscientiousness', reverse: false },
  { id: 32, text: 'گاهی اوقات تنبل و بی‌حوصله می‌شوم.', factor: 'conscientiousness', reverse: true },
  { id: 33, text: 'معمولاً قابل اعتماد و مسئول هستم.', factor: 'conscientiousness', reverse: false },
  { id: 34, text: 'همیشه تعهداتم را جدی می‌گیرم.', factor: 'conscientiousness', reverse: false },
  { id: 35, text: 'گاهی اوقات کارهایم را ناتمام می‌گذارم.', factor: 'conscientiousness', reverse: true },
  { id: 36, text: 'دوست دارم همه چیز در جای مناسبش باشد.', factor: 'conscientiousness', reverse: false },

  // Neuroticism (12 questions)
  { id: 37, text: 'معمولاً آرام و با ثبات هستم.', factor: 'neuroticism', reverse: true },
  { id: 38, text: 'گاهی اوقات زیاد نگران می‌شوم.', factor: 'neuroticism', reverse: false },
  { id: 39, text: 'به راحتی عصبانی می‌شوم.', factor: 'neuroticism', reverse: false },
  { id: 40, text: 'معمولاً در شرایط سخت آرامش خود را حفظ می‌کنم.', factor: 'neuroticism', reverse: true },
  { id: 41, text: 'گاهی اوقات احساس افسردگی می‌کنم.', factor: 'neuroticism', reverse: false },
  { id: 42, text: 'معمولاً خوشبین و مثبت‌اندیش هستم.', factor: 'neuroticism', reverse: true },
  { id: 43, text: 'به راحتی استرس می‌گیرم.', factor: 'neuroticism', reverse: false },
  { id: 44, text: 'معمولاً احساساتم تحت کنترل است.', factor: 'neuroticism', reverse: true },
  { id: 45, text: 'گاهی اوقات خیلی حساس می‌شوم.', factor: 'neuroticism', reverse: false },
  { id: 46, text: 'معمولاً خونسرد و صبور هستم.', factor: 'neuroticism', reverse: true },
  { id: 47, text: 'به راحتی از کوره در می‌روم.', factor: 'neuroticism', reverse: false },
  { id: 48, text: 'گاهی اوقات احساس ناامیدی می‌کنم.', factor: 'neuroticism', reverse: false },

  // Openness (12 questions)
  { id: 49, text: 'دوست دارم ایده‌های جدید را بررسی کنم.', factor: 'openness', reverse: false },
  { id: 50, text: 'معمولاً به روش‌های سنتی پایبند هستم.', factor: 'openness', reverse: true },
  { id: 51, text: 'دوست دارم چیزهای جدید یاد بگیرم.', factor: 'openness', reverse: false },
  { id: 52, text: 'معمولاً خلاق و نوآور هستم.', factor: 'openness', reverse: false },
  { id: 53, text: 'ترجیح می‌دهم همیشه همان کارهای عادی را انجام دهم.', factor: 'openness', reverse: true },
  { id: 54, text: 'دوست دارم هنر و ادبیات را کاوش کنم.', factor: 'openness', reverse: false },
  { id: 55, text: 'معمولاً کنجکاو و جستجوگر هستم.', factor: 'openness', reverse: false },
  { id: 56, text: 'گاهی اوقات محافظه‌کار و سنتی می‌شوم.', factor: 'openness', reverse: true },
  { id: 57, text: 'دوست دارم تجربیات جدید داشته باشم.', factor: 'openness', reverse: false },
  { id: 58, text: 'معمولاً تخیل قوی دارم.', factor: 'openness', reverse: false },
  { id: 59, text: 'ترجیح می‌دهم در چارچوب‌های مشخص کار کنم.', factor: 'openness', reverse: true },
  { id: 60, text: 'دوست دارم فلسفه و مفاهیم عمیق را بررسی کنم.', factor: 'openness', reverse: false },
]

const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.length) * 100)
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.length - 1)
const canProceed = computed(() => answers.value[currentQuestion.value?.id] !== undefined)

function startTest() {
  isTestStarted.value = true
  testStartTime.value = new Date()
}

function selectAnswer(value: number) {
  if (currentQuestion.value) {
    answers.value[currentQuestion.value.id] = value

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (isLastQuestion.value) {
        completeTest()
      }
      else {
        currentQuestionIndex.value++
      }
    }, 300) // 300ms delay for visual feedback
  }
}

function nextQuestion() {
  if (!canProceed.value) return

  if (isLastQuestion.value) {
    completeTest()
  }
  else {
    currentQuestionIndex.value++
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function completeTest() {
  isTestCompleted.value = true
  const testDuration = testStartTime.value ? new Date().getTime() - testStartTime.value.getTime() : 0
  const scores = calculateScores()

  // Navigate to results page (in real app, would save results to backend)
  navigateTo('/hammasir/neo-results')
}

function calculateScores() {
  const factors = {
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    neuroticism: 0,
    openness: 0,
  }

  questions.forEach((question) => {
    const answer = answers.value[question.id]
    if (answer !== undefined) {
      let score = question.reverse ? (6 - answer) : answer
      factors[question.factor as keyof typeof factors] += score
    }
  })

  // Convert to percentages (each factor has 12 questions, max score = 60)
  Object.keys(factors).forEach((factor) => {
    factors[factor as keyof typeof factors] = Math.round((factors[factor as keyof typeof factors] / 60) * 100)
  })

  return factors
}

function goBack() {
  navigateTo('/hammasir/questionnaires')
}

function getOptionClasses(value: number, color: string) {
  const isSelected = answers.value[currentQuestion.value?.id] === value

  if (isSelected) {
    switch (color) {
      case 'red': return 'border-red-400 bg-red-50 dark:bg-red-900/20'
      case 'orange': return 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
      case 'amber': return 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
      case 'lime': return 'border-lime-400 bg-lime-50 dark:bg-lime-900/20'
      case 'green': return 'border-green-400 bg-green-50 dark:bg-green-900/20'
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  return 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
}

function getRadioClasses(value: number, color: string) {
  const isSelected = answers.value[currentQuestion.value?.id] === value

  if (isSelected) {
    switch (color) {
      case 'red': return 'border-red-400 bg-red-400'
      case 'orange': return 'border-orange-400 bg-orange-400'
      case 'amber': return 'border-amber-400 bg-amber-400'
      case 'lime': return 'border-lime-400 bg-lime-400'
      case 'green': return 'border-green-400 bg-green-400'
      default: return 'border-gray-400 bg-gray-400'
    }
  }

  return 'border-gray-300 dark:border-gray-600'
}

function getTextClasses(value: number, color: string) {
  const isSelected = answers.value[currentQuestion.value?.id] === value

  if (isSelected) {
    switch (color) {
      case 'red': return 'text-red-700 dark:text-red-300'
      case 'orange': return 'text-orange-700 dark:text-orange-300'
      case 'amber': return 'text-amber-700 dark:text-amber-300'
      case 'lime': return 'text-lime-700 dark:text-lime-300'
      case 'green': return 'text-green-700 dark:text-green-300'
      default: return 'text-gray-700 dark:text-gray-300'
    }
  }

  return 'text-gray-700 dark:text-gray-300'
}

function getNumberClasses(value: number, color: string) {
  const isSelected = answers.value[currentQuestion.value?.id] === value

  if (isSelected) {
    switch (color) {
      case 'red': return 'text-red-600'
      case 'orange': return 'text-orange-600'
      case 'amber': return 'text-amber-600'
      case 'lime': return 'text-lime-600'
      case 'green': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return 'text-gray-500'
}

const answerOptions = [
  { value: 1, text: 'کاملاً مخالفم', color: 'red' },
  { value: 2, text: 'مخالفم', color: 'orange' },
  { value: 3, text: 'تا حدودی مخالفم', color: 'amber' },
  { value: 4, text: 'تا حدودی موافقم', color: 'lime' },
  { value: 5, text: 'موافقم', color: 'green' },
]
</script>

<template>
  <div>
    <!-- Test Introduction -->
    <div v-if="!isTestStarted" class="mx-auto max-w-4xl">
      <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-1 shadow-2xl shadow-blue-500/25">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <div class="relative rounded-2xl bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-purple-700/90 px-8 py-12 backdrop-blur-xl">
          <div class="text-center">
            <div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 shadow-xl">
              <Icon name="ph:user-circle" class="size-10 text-white" />
            </div>

            <BaseHeading
              as="h1"
              size="3xl"
              weight="bold"
              class="mb-4 text-white drop-shadow-lg"
            >
              <span>آزمون شخصیت NEO</span>
            </BaseHeading>

            <BaseParagraph class="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90">
              <span>این آزمون پنج عامل اصلی شخصیت شما را بررسی می‌کند: برون‌گرایی، توافق‌پذیری، وظیفه‌شناسی، ثبات عاطفی و گشودگی به تجربه. پاسخ‌دهی به 60 سوال حدود 25-30 دقیقه زمان می‌برد.</span>
            </BaseParagraph>
          </div>
        </div>
      </div>

      <!-- Test Instructions -->
      <div class="mb-8 rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <BaseHeading
          as="h2"
          size="xl"
          weight="semibold"
          class="mb-6 text-gray-800 dark:text-white"
        >
          <span>دستورالعمل آزمون</span>
        </BaseHeading>

        <div class="mb-8 space-y-4">
          <div class="flex items-start">
            <Icon name="ph:number-circle-one" class="me-3 mt-0.5 size-6 text-blue-500" />
            <div>
              <BaseParagraph class="text-gray-700 dark:text-gray-300">
                <span>به هر سوال بر اساس احساس واقعی خود پاسخ دهید، نه آنچه فکر می‌کنید درست است.</span>
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-start">
            <Icon name="ph:number-circle-two" class="me-3 mt-0.5 size-6 text-blue-500" />
            <div>
              <BaseParagraph class="text-gray-700 dark:text-gray-300">
                <span>هیچ پاسخ درست یا غلطی وجود ندارد. فقط صادقانه پاسخ دهید.</span>
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-start">
            <Icon name="ph:number-circle-three" class="me-3 mt-0.5 size-6 text-blue-500" />
            <div>
              <BaseParagraph class="text-gray-700 dark:text-gray-300">
                <span>سعی کنید زیاد فکر نکنید و بر اساس اولین احساستان پاسخ دهید.</span>
              </BaseParagraph>
            </div>
          </div>

          <div class="flex items-start">
            <Icon name="ph:number-circle-four" class="me-3 mt-0.5 size-6 text-blue-500" />
            <div>
              <BaseParagraph class="text-gray-700 dark:text-gray-300">
                <span>می‌توانید در هر مرحله به سوال قبلی برگردید و پاسخ خود را تغییر دهید.</span>
              </BaseParagraph>
            </div>
          </div>
        </div>

        <div class="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div class="mb-4 flex items-center">
            <Icon name="ph:info" class="me-2 size-5 text-blue-600" />
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-blue-800 dark:text-blue-200"
            >
              <span>اطلاعات آزمون</span>
            </BaseHeading>
          </div>

          <div class="grid gap-4 text-sm md:grid-cols-3">
            <div class="flex items-center text-blue-700 dark:text-blue-300">
              <Icon name="ph:list" class="me-2 size-4" />
              <span>60 سوال</span>
            </div>
            <div class="flex items-center text-blue-700 dark:text-blue-300">
              <Icon name="ph:clock" class="me-2 size-4" />
              <span>25-30 دقیقه</span>
            </div>
            <div class="flex items-center text-blue-700 dark:text-blue-300">
              <Icon name="ph:chart-bar" class="me-2 size-4" />
              <span>5 عامل شخصیت</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <BaseButton
            variant="outline"
            class="border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="me-2 size-4" />
            <span>بازگشت</span>
          </BaseButton>

          <BaseButton
            class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-white hover:from-blue-600 hover:to-indigo-700"
            @click="startTest"
          >
            <Icon name="ph:play" class="me-2 size-4" />
            <span>شروع آزمون</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Test Questions -->
    <div v-else-if="!isTestCompleted" class="mx-auto max-w-4xl">
      <!-- Progress Header -->
      <div class="mb-8 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-gray-800 dark:text-white"
            >
              <span>سوال {{ currentQuestionIndex + 1 }} از {{ questions.length }}</span>
            </BaseHeading>
            <BaseParagraph class="text-sm text-gray-600 dark:text-gray-400">
              <span>آزمون شخصیت NEO</span>
            </BaseParagraph>
          </div>

          <div class="text-left">
            <div class="text-2xl font-bold text-blue-600">
              {{ Math.round(progress) }}%
            </div>
            <div class="text-xs text-gray-500">
              تکمیل شده
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            :style="{ width: `${progress}%` }"
          >
            <div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="mb-8 rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg dark:border-gray-700/50 dark:bg-gray-800">
        <BaseHeading
          as="h3"
          size="xl"
          weight="semibold"
          class="mb-8 leading-relaxed text-gray-800 dark:text-white"
        >
          <span>{{ currentQuestion?.text }}</span>
        </BaseHeading>

        <!-- Answer Options -->
        <div class="mb-8 space-y-4">
          <div
            v-for="option in answerOptions"
            :key="option.value"
            class="group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200"
            :class="getOptionClasses(option.value, option.color)"
            @click="selectAnswer(option.value)"
          >
            <div class="flex items-center p-4">
              <div
                class="me-4 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-200"
                :class="getRadioClasses(option.value, option.color)"
              >
                <div
                  v-if="answers[currentQuestion?.id] === option.value"
                  class="size-2 rounded-full bg-white"
                />
              </div>

              <div class="flex-1">
                <BaseParagraph
                  class="font-medium transition-colors"
                  :class="getTextClasses(option.value, option.color)"
                >
                  <span>{{ option.text }}</span>
                </BaseParagraph>
              </div>

              <div
                class="w-8 text-center text-sm font-medium"
                :class="getNumberClasses(option.value, option.color)"
              >
                {{ option.value }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between">
          <BaseButton
            :disabled="currentQuestionIndex === 0"
            variant="outline"
            class="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="previousQuestion"
          >
            <Icon name="ph:arrow-right" class="me-2 size-4" />
            <span>قبلی</span>
          </BaseButton>

          <BaseButton
            :disabled="!canProceed"
            class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="nextQuestion"
          >
            <span>{{ isLastQuestion ? 'تکمیل آزمون' : 'بعدی' }}</span>
            <Icon :name="isLastQuestion ? 'ph:check' : 'ph:arrow-left'" class="ms-2 size-4" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>
