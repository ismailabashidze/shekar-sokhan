<script setup lang="ts">
definePageMeta({
  title: 'پرسش‌نامه‌های روان‌شناختی',
  preview: {
    title: 'Questionnaires Page',
    description: 'Psychological questionnaires and assessments',
    categories: ['assessments'],
    src: '/img/screens/questionnaires-hammasir.png',
    srcDark: '/img/screens/questionnaires-hammasir-dark.png',
    order: 2,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Mock questionnaires data
const questionnaires = [
  {
    id: 1,
    name: 'آزمون شخصیت NEO',
    englishName: 'NEO Personality Inventory',
    category: 'personality',
    description: 'تحلیل عمیق پنج عامل اصلی شخصیت شامل برون‌گرایی، توافق‌پذیری، وظیفه‌شناسی، ثبات عاطفی و گشودگی به تجربه',
    duration: '25-30 دقیقه',
    questions: 60,
    status: 'completed',
    completedAt: '1403/03/15',
    score: 78,
    difficulty: 'متوسط',
    importance: 'بالا',
    tags: ['شخصیت‌شناسی', 'روان‌شناسی مثبت', 'خودشناسی'],
    icon: 'ph:user-circle',
    color: 'blue',
    resultSummary: 'شخصیت برون‌گرا با ثبات عاطفی بالا و انعطاف‌پذیری مناسب'
  },
  {
    id: 2,
    name: 'آزمون هوش هیجانی Cattell',
    englishName: 'Cattell Emotional Intelligence Test',
    category: 'emotional',
    description: 'بررسی سطح هوش هیجانی و توانایی مدیریت احساسات، همدلی و مهارت‌های اجتماعی',
    duration: '20-25 دقیقه',
    questions: 45,
    status: 'in_progress',
    startedAt: '1403/04/10',
    progress: 67,
    difficulty: 'آسان',
    importance: 'بالا',
    tags: ['هوش هیجانی', 'مهارت‌های اجتماعی', 'احساسات'],
    icon: 'ph:heart',
    color: 'rose',
    nextSection: 'مدیریت تعارض'
  },
  {
    id: 3,
    name: 'آزمون نیازهای بنیادی Glasser',
    englishName: 'Glasser Basic Needs Assessment',
    category: 'needs',
    description: 'شناسایی و اولویت‌بندی نیازهای بنیادی انسان شامل بقا، عشق و تعلق، قدرت، آزادی و تفریح',
    duration: '15-20 دقیقه',
    questions: 35,
    status: 'locked',
    requirement: 'تکمیل 75% آزمون Cattell',
    difficulty: 'آسان',
    importance: 'متوسط',
    tags: ['نیازهای بنیادی', 'انگیزه', 'اولویت‌ها'],
    icon: 'ph:target',
    color: 'green',
    unlockMessage: 'برای دسترسی به این آزمون، ابتدا آزمون Cattell را تکمیل کنید'
  },
  {
    id: 4,
    name: 'آزمون سبک‌های دلبستگی',
    englishName: 'Attachment Styles Assessment',
    category: 'relationship',
    description: 'تعیین سبک دلبستگی در روابط عاطفی و شناسایی الگوهای رفتاری در روابط نزدیک',
    duration: '20-25 دقیقه',
    questions: 40,
    status: 'available',
    difficulty: 'متوسط',
    importance: 'بالا',
    tags: ['روابط', 'دلبستگی', 'عاطفه'],
    icon: 'ph:users',
    color: 'purple',
    prerequisites: ['آزمون NEO']
  },
  {
    id: 5,
    name: 'آزمون ارزش‌های زندگی',
    englishName: 'Life Values Assessment',
    category: 'values',
    description: 'شناسایی مهم‌ترین ارزش‌ها و اولویت‌های زندگی برای تطبیق با اهداف ازدواج',
    duration: '15-18 دقیقه',
    questions: 30,
    status: 'available',
    difficulty: 'آسان',
    importance: 'بالا',
    tags: ['ارزش‌ها', 'اولویت‌ها', 'اهداف'],
    icon: 'ph:star',
    color: 'yellow',
    prerequisites: []
  },
  {
    id: 6,
    name: 'آزمون مهارت‌های ارتباطی',
    englishName: 'Communication Skills Test',
    category: 'communication',
    description: 'بررسی مهارت‌های ارتباطی، حل تعارض و توانایی بیان احساسات در روابط',
    duration: '25-30 دقیقه',
    questions: 50,
    status: 'locked',
    requirement: 'تکمیل آزمون دلبستگی',
    difficulty: 'متوسط',
    importance: 'بالا',
    tags: ['ارتباطات', 'حل تعارض', 'بیان احساسات'],
    icon: 'ph:chat-circle',
    color: 'indigo',
    unlockMessage: 'این آزمون پس از تکمیل آزمون دلبستگی قابل دسترسی است'
  }
]

const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedQuestionnaire = ref(null)

const categories = [
  { id: 'all', name: 'همه آزمون‌ها', icon: 'ph:list' },
  { id: 'personality', name: 'شخصیت‌شناسی', icon: 'ph:user-circle' },
  { id: 'emotional', name: 'هوش هیجانی', icon: 'ph:heart' },
  { id: 'relationship', name: 'روابط', icon: 'ph:users' },
  { id: 'values', name: 'ارزش‌ها', icon: 'ph:star' },
  { id: 'communication', name: 'ارتباطات', icon: 'ph:chat-circle' },
  { id: 'needs', name: 'نیازها', icon: 'ph:target' }
]

const filteredQuestionnaires = computed(() => {
  let filtered = questionnaires
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(q => q.category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(q => 
      q.name.includes(query) || 
      q.description.includes(query) ||
      q.tags.some(tag => tag.includes(query))
    )
  }
  
  return filtered
})

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'green'
    case 'in_progress': return 'blue'
    case 'available': return 'indigo'
    case 'locked': return 'gray'
    default: return 'gray'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed': return 'تکمیل شده'
    case 'in_progress': return 'در حال انجام'
    case 'available': return 'قابل دسترسی'
    case 'locked': return 'قفل شده'
    default: return 'نامشخص'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return 'ph:check-circle'
    case 'in_progress': return 'ph:play-circle'
    case 'available': return 'ph:circle'
    case 'locked': return 'ph:lock'
    default: return 'ph:circle'
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'آسان': return 'green'
    case 'متوسط': return 'yellow'
    case 'سخت': return 'red'
    default: return 'gray'
  }
}

function getImportanceColor(importance: string) {
  switch (importance) {
    case 'بالا': return 'red'
    case 'متوسط': return 'yellow'
    case 'پایین': return 'green'
    default: return 'gray'
  }
}

function selectQuestionnaire(questionnaire: any) {
  if (questionnaire.status === 'locked') return
  selectedQuestionnaire.value = questionnaire
}

function startQuestionnaire(questionnaire: any) {
  if (questionnaire.status === 'locked') return
  
  if (questionnaire.id === 1) { // NEO test
    navigateTo('/hammasir/neo-test')
  }
  console.log('Starting questionnaire:', questionnaire.name)
}

function continueQuestionnaire(questionnaire: any) {
  if (questionnaire.id === 2) { // Cattell test (in progress)
    navigateTo('/hammasir/neo-test') // For demo, redirect to NEO test
  }
  console.log('Continuing questionnaire:', questionnaire.name)
}

function viewResults(questionnaire: any) {
  // View completed questionnaire results
  if (questionnaire.id === 1) { // NEO test
    navigateTo('/hammasir/neo-results')
  }
  console.log('Viewing results for:', questionnaire.name)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-1 shadow-2xl shadow-indigo-500/25 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-2xl bg-gradient-to-br from-indigo-600/90 via-purple-700/90 to-pink-700/90 backdrop-blur-xl px-8 py-12">
        <!-- Floating decorative elements -->
        <div class="absolute top-6 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-8 left-12 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-6 shadow-xl">
            <Icon name="ph:clipboard-text" class="w-10 h-10 text-white" />
          </div>
          
          <BaseHeading
            as="h1"
            size="4xl"
            weight="bold"
            lead="tight"
            class="text-white drop-shadow-lg mb-4"
          >
            <span>پرسش‌نامه‌های روان‌شناختی</span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
            <span>از طریق پرسش‌نامه‌های تخصصی و علمی، شخصیت، نیازها و ویژگی‌های روان‌شناختی خود را بشناسید. این ابزارها به شما کمک می‌کنند تا آگاهی عمیق‌تری از خود کسب کنید و برای ازدواج آگاهانه آماده شوید.</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
      <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Icon name="ph:magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در پرسش‌نامه‌ها..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <!-- Category Filter -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            :class="selectedCategory === category.id 
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            <Icon :name="category.icon" class="w-4 h-4" />
            <span>{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Questionnaires Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="questionnaire in filteredQuestionnaires"
        :key="questionnaire.id"
        class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        :class="{
          'opacity-60': questionnaire.status === 'locked',
          'hover:scale-[1.02]': questionnaire.status !== 'locked',
          'cursor-not-allowed': questionnaire.status === 'locked'
        }"
        @click="selectQuestionnaire(questionnaire)"
      >
        <!-- Difficulty and Importance Badges - Top Left -->
        <div class="absolute top-4 left-4 z-10">
          <div class="flex flex-row gap-1">
            <!-- Status Badge -->
        <div class="">
          <div 
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
            :class="`bg-${getStatusColor(questionnaire.status)}-100 text-${getStatusColor(questionnaire.status)}-700 border border-${getStatusColor(questionnaire.status)}-200`"
          >
            <Icon :name="getStatusIcon(questionnaire.status)" class="w-3 h-3" />
            <span>{{ getStatusText(questionnaire.status) }}</span>
          </div>
        </div>
            <!-- Difficulty Badge -->
            <div 
              class="px-2 py-1 rounded-md text-xs font-medium shadow-sm"
              :class="`bg-${getDifficultyColor(questionnaire.difficulty)}-100 text-${getDifficultyColor(questionnaire.difficulty)}-700 border border-${getDifficultyColor(questionnaire.difficulty)}-200`"
            >
              {{ questionnaire.difficulty }}
            </div>
            
            <!-- Importance Badge -->
            <div 
              class="px-2 py-1 rounded-md text-xs font-medium shadow-sm"
              :class="`bg-${getImportanceColor(questionnaire.importance)}-100 text-${getImportanceColor(questionnaire.importance)}-700 border border-${getImportanceColor(questionnaire.importance)}-200`"
            >
              {{ questionnaire.importance }}
            </div>
            
          </div>
          
        </div>

        <!-- Progress Bar for in-progress questionnaires -->
        <div v-if="questionnaire.status === 'in_progress'" class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            :style="{ width: `${questionnaire.progress}%` }"
          ></div>
        </div>

        <!-- Card Content -->
        <div class="p-6">
          <!-- Icon -->
          <div class="mb-4">
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
              :class="`bg-gradient-to-br from-${questionnaire.color}-400 to-${questionnaire.color}-600 text-white`"
            >
              <Icon :name="questionnaire.icon" class="w-7 h-7" />
            </div>
          </div>

          <!-- Title and Description -->
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span>{{ questionnaire.name }}</span>
          </BaseHeading>
          
          <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
            <span>{{ questionnaire.description }}</span>
          </BaseParagraph>

          <!-- Details -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <Icon name="ph:clock" class="w-4 h-4 me-2" />
                <span>{{ questionnaire.duration }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <Icon name="ph:list" class="w-4 h-4 me-2" />
                <span>{{ questionnaire.questions }} سوال</span>
              </div>
            </div>

            <!-- Progress for in-progress -->
            <div v-if="questionnaire.status === 'in_progress'" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">پیشرفت</span>
                <span class="font-semibold text-blue-600">{{ questionnaire.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${questionnaire.progress}%` }"
                ></div>
              </div>
              <div class="text-xs text-blue-600 font-medium">
                بخش بعدی: {{ questionnaire.nextSection }}
              </div>
            </div>

            <!-- Score for completed -->
            <div v-if="questionnaire.status === 'completed'" class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">امتیاز</span>
              <div class="flex items-center">
                <span class="font-bold text-lg text-green-600 me-1">{{ questionnaire.score }}</span>
                <span class="text-gray-500">/100</span>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in questionnaire.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Action Button -->
          <div class="space-y-3">
            <!-- Main Action -->
            <BaseButton
              v-if="questionnaire.status === 'available'"
              @click.stop="startQuestionnaire(questionnaire)"
              class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon name="ph:play" class="w-4 h-4 me-2" />
              <span>شروع آزمون</span>
            </BaseButton>

            <BaseButton
              v-else-if="questionnaire.status === 'in_progress'"
              @click.stop="continueQuestionnaire(questionnaire)"
              class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
              <span>ادامه آزمون</span>
            </BaseButton>

            <BaseButton
              v-else-if="questionnaire.status === 'completed'"
              @click.stop="viewResults(questionnaire)"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon name="ph:eye" class="w-4 h-4 me-2" />
              <span>مشاهده نتایج</span>
            </BaseButton>

            <div v-else-if="questionnaire.status === 'locked'" class="space-y-2">
              <BaseButton
                disabled
                class="w-full bg-gray-400 text-white cursor-not-allowed"
              >
                <Icon name="ph:lock" class="w-4 h-4 me-2" />
                <span>قفل شده</span>
              </BaseButton>
              
              <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div class="flex items-start">
                  <Icon name="ph:warning" class="w-4 h-4 me-2 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span class="text-xs text-amber-700 dark:text-amber-300">{{ questionnaire.unlockMessage }}</span>
                </div>
              </div>
            </div>

            <!-- Completed questionnaire result summary -->
            <div v-if="questionnaire.status === 'completed'" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div class="flex items-start">
                <Icon name="ph:check-circle" class="w-4 h-4 me-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span class="text-xs text-green-700 dark:text-green-300">{{ questionnaire.resultSummary }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>