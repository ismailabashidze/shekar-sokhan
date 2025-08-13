<script setup lang="ts">
// Handbook Page - Personal guidance and recommendations
import { useApplicantProfileService } from '~/composables/hammasir/useApplicantProfileService'
import { useProfileAnalytics } from '~/composables/hammasir/useProfileAnalytics'

definePageMeta({
  title: 'راهنمای شخصی - همسر',
  description: 'توصیه‌ها و راهنمای اختصاصی بر اساس تحلیل پروفایل شما',
  layout: 'default'
})

// Composables
const { getMyProfile } = useApplicantProfileService()
const { profile, loading: profileLoading } = getMyProfile()
const { state: analyticsState, loadAnalytics } = useProfileAnalytics()

// Reactive state
const loading = ref(false)
const error = ref<string | null>(null)
const sections = ref([])
const activeSection = ref<string | null>(null)

// Mock handbook sections data - in real app this would come from API
const mockHandbookSections = computed(() => [
  {
    id: 'personality-analysis',
    title: 'تحلیل شخصیت',
    description: 'بررسی ویژگی‌های شخصیتی و نقاط قوت شما',
    type: 'personality',
    status: 'completed',
    progress: 1.0,
    content: `
      <p>بر اساس تحلیل اطلاعات پروفایل شما، ویژگی‌های شخصیتی مهم شناسایی شده است:</p>
      <ul>
        <li><strong>انطباق‌پذیری بالا:</strong> توانایی خوبی در سازگاری با شرایط مختلف دارید</li>
        <li><strong>دقت و نظم:</strong> اهمیت زیادی به جزئیات و برنامه‌ریزی می‌دهید</li>
        <li><strong>تعامل اجتماعی:</strong> مهارت‌های ارتباطی قوی و علاقه به تعامل با دیگران</li>
      </ul>
    `,
    keyPoints: [
      'شخصیت متعادل با گرایش به همکاری',
      'اهمیت بالا به روابط خانوادگی',
      'تمایل به ثبات و پیش‌بینی‌پذیری در زندگی'
    ],
    recommendations: [
      {
        id: 'personality-rec-1',
        title: 'تقویت اعتماد به نفس',
        description: 'برای بهبود انطباق‌یابی، روی تقویت اعتماد به نفس در معرفی خود کار کنید',
        priority: 'high'
      },
      {
        id: 'personality-rec-2',
        title: 'تعریف اولویت‌ها',
        description: 'اولویت‌های زندگی و ازدواج خود را به صراحت مشخص کنید',
        priority: 'medium'
      }
    ],
    actions: [
      {
        id: 'personality-test',
        label: 'انجام تست شخصیت تکمیلی',
        type: 'test',
        icon: 'ph:clipboard-text'
      }
    ],
    defaultExpanded: true
  },
  {
    id: 'compatibility-guide',
    title: 'راهنمای انطباق‌یابی',
    description: 'نکات مهم برای بهبود شانس یافتن انطباق مناسب',
    type: 'matching',
    status: 'completed',
    progress: 1.0,
    content: `
      <p>برای افزایش احتمال یافتن انطباق مناسب، موارد زیر را در نظر بگیرید:</p>
      <h4>معیارهای مهم انطباق‌یابی:</h4>
      <ul>
        <li>همخوانی در اهداف زندگی</li>
        <li>تطابق در سطح تحصیلات و اجتماعی</li>
        <li>انطباق در باورها و ارزش‌ها</li>
        <li>توافق در موضوع فرزندآوری</li>
      </ul>
    `,
    keyPoints: [
      'صداقت در ارائه اطلاعات شخصی',
      'انعطاف‌پذیری در برخی معیارها',
      'صبر و استمرار در فرآیند جستجو'
    ],
    recommendations: [
      {
        id: 'matching-rec-1',
        title: 'بهبود تصویر پروفایل',
        description: 'تصاویر با کیفیت و متنوع از خود اضافه کنید',
        priority: 'high'
      },
      {
        id: 'matching-rec-2',
        title: 'تکمیل معیارهای انتخاب',
        description: 'معیارهای انتخاب همسر خود را دقیق‌تر تعریف کنید',
        priority: 'medium'
      }
    ],
    actions: [
      {
        id: 'matching-preferences',
        label: 'تنظیم ترجیحات انطباق',
        type: 'settings',
        icon: 'ph:sliders'
      }
    ]
  },
  {
    id: 'profile-optimization',
    title: 'بهینه‌سازی پروفایل',
    description: 'راهکارهای بهبود جذابیت و تأثیرگذاری پروفایل',
    type: 'optimization',
    status: 'in_progress',
    progress: 0.7,
    content: `
      <p>برای افزایش جذابیت پروفایل شما، پیشنهادات زیر ارائه می‌شود:</p>
      <h4>نکات کلیدی:</h4>
      <ul>
        <li>استفاده از متن‌های صادقانه و طبیعی</li>
        <li>نمایش تنوع در علایق و فعالیت‌ها</li>
        <li>ارائه تصویر متعادل از شخصیت</li>
      </ul>
    `,
    keyPoints: [
      'کامل بودن اطلاعات پروفایل',
      'استفاده از تصاویر مناسب و باکیفیت',
      'بیان واضح انتظارات و اهداف'
    ],
    recommendations: [
      {
        id: 'profile-rec-1',
        title: 'افزودن محتوای شخصی',
        description: 'داستان‌ها و تجربیات شخصی خود را به اشتراک بگذارید',
        priority: 'medium'
      }
    ],
    actions: [
      {
        id: 'profile-review',
        label: 'بازنگری پروفایل',
        type: 'review',
        icon: 'ph:eye'
      }
    ]
  },
  {
    id: 'communication-tips',
    title: 'نکات ارتباطی',
    description: 'راهنمای برقراری ارتباط مؤثر با انطباق‌های پیشنهادی',
    type: 'communication',
    status: 'pending',
    progress: 0.0,
    content: `
      <p>ارتباط مؤثر کلید موفقیت در فرآیند آشنایی است:</p>
    `,
    keyPoints: [
      'آغاز مکالمه با موضوعات مشترک',
      'نشان دادن علاقه واقعی به طرف مقابل',
      'حفظ احترام و ادب در تمام مراحل'
    ],
    recommendations: [
      {
        id: 'comm-rec-1',
        title: 'یادگیری مهارت‌های گفتگو',
        description: 'شرکت در کارگاه‌های مهارت‌های ارتباطی',
        priority: 'low'
      }
    ],
    actions: [
      {
        id: 'communication-course',
        label: 'دوره ارتباط مؤثر',
        type: 'course',
        icon: 'ph:chats'
      }
    ]
  }
])

// Handle section actions
const handleSectionAction = (actionType: string, sectionId: string, data?: any) => {
  console.log('Section action:', actionType, sectionId, data)
  
  switch (actionType) {
    case 'test':
      // Navigate to personality test
      navigateTo('/personality-test')
      break
    case 'settings':
      // Navigate to matching preferences
      navigateTo('/settings/matching')
      break
    case 'review':
      // Navigate to profile edit
      navigateTo('/hammasir/edit')
      break
    case 'course':
      // Show course information
      $toast.info('دوره‌های آموزشی به زودی راه‌اندازی می‌شوند')
      break
  }
}

// Generate analysis if not available
const generateAnalysis = async () => {
  loading.value = true
  try {
    // In real app, this would call API to generate handbook content
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    sections.value = mockHandbookSections.value
    $toast.success('راهنمای شخصی با موفقیت تولید شد')
  } catch (err) {
    error.value = 'خطا در تولید راهنما'
    console.error('Generate analysis error:', err)
  } finally {
    loading.value = false
  }
}

// Navigation
const navigateToProfile = () => {
  navigateTo('/hammasir')
}

const navigateToAnalytics = () => {
  navigateTo('/hammasir/analytics')
}

// Initialize data
onMounted(() => {
  if (profile.value) {
    loadAnalytics()
    // For demo purposes, use mock data
    sections.value = mockHandbookSections.value
  }
})

// SEO and meta
useHead({
  title: 'راهنمای شخصی - همسر',
  meta: [
    { name: 'description', content: 'توصیه‌ها و راهنمای اختصاصی بر اساس تحلیل پروفایل شما' },
    { name: 'keywords', content: 'راهنما، توصیه، همسر، ازدواج، انطباق‌یابی' },
    { property: 'og:title', content: 'راهنمای شخصی - همسر' },
    { property: 'og:description', content: 'توصیه‌ها و راهنمای اختصاصی بر اساس تحلیل پروفایل شما' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink 
              to="/hammasir" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              پروفایل
            </NuxtLink>
            <Icon name="ph:caret-left" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-800 dark:text-white font-medium">راهنمای شخصی</span>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <BaseButton
              variant="outline"
              size="sm"
              @click="navigateToAnalytics"
            >
              <Icon name="ph:chart-pie" class="w-4 h-4 me-2" />
              مشاهده آمار
            </BaseButton>
            
            <BaseButton
              variant="outline"
              size="sm"
              @click="navigateToProfile"
            >
              <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
              بازگشت به پروفایل
            </BaseButton>
          </div>
        </div>

        <div class="mt-4">
          <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
            راهنمای شخصی
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400">
            توصیه‌ها و راهنمای اختصاصی بر اساس تحلیل پروفایل شما
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">
        <!-- Loading State -->
        <div v-if="profileLoading || loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <BaseHeading as="h2" size="lg" weight="medium" class="text-gray-600 dark:text-gray-400 mb-2">
            در حال تحلیل پروفایل...
          </BaseHeading>
          <BaseParagraph class="text-gray-500 dark:text-gray-400">
            لطفاً چند لحظه صبر کنید
          </BaseParagraph>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-2xl mx-auto text-center py-12">
          <Icon name="ph:warning-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            خطا در تولید راهنما
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
            {{ error }}
          </BaseParagraph>
          <div class="flex justify-center gap-4">
            <BaseButton variant="solid" @click="generateAnalysis">
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
              تلاش مجدد
            </BaseButton>
            <BaseButton variant="outline" @click="navigateToProfile">
              بازگشت به پروفایل
            </BaseButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!sections || sections.length === 0" class="max-w-2xl mx-auto text-center py-12">
          <Icon name="ph:book-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            راهنما در دسترس نیست
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
            برای تولید راهنمای شخصی، ابتدا پروفایل خود را تکمیل کنید.
          </BaseParagraph>
          <div class="flex justify-center gap-4">
            <BaseButton variant="solid" @click="generateAnalysis">
              <Icon name="ph:magic-wand" class="w-4 h-4 me-2" />
              تولید راهنما
            </BaseButton>
            <BaseButton variant="outline" @click="navigateTo('/hammasir/edit')">
              تکمیل پروفایل
            </BaseButton>
          </div>
        </div>

        <!-- Handbook Content -->
        <div v-else class="space-y-6">
          <!-- Overview Stats -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
            <div class="flex items-center justify-between mb-4">
              <div>
                <BaseHeading as="h2" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-1">
                  خلاصه تحلیل
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  {{ sections.filter(s => s.status === 'completed').length }} از {{ sections.length }} بخش تکمیل شده
                </BaseParagraph>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {{ analyticsState.analytics?.overallScore ? Math.round(analyticsState.analytics.overallScore * 100) : '85' }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">امتیاز کلی</div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex flex-wrap gap-3">
              <BaseButton
                variant="solid"
                size="sm"
                @click="navigateTo('/hammasir/edit')"
              >
                <Icon name="ph:pencil" class="w-4 h-4 me-2" />
                بهبود پروفایل
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                @click="navigateToAnalytics"
              >
                <Icon name="ph:chart-line" class="w-4 h-4 me-2" />
                مشاهده آمار تفصیلی
              </BaseButton>
            </div>
          </div>

          <!-- Handbook Sections -->
          <HammasirDisplayHandbookDisplay
            :sections="sections"
            :analytics="analyticsState.analytics"
            :loading="loading"
            @expand="(sectionId) => activeSection = sectionId"
            @action="handleSectionAction"
          />

          <!-- Additional Resources -->
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white mb-4">
              منابع مفید
            </BaseHeading>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Icon name="ph:book" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    راهنمای آشنایی موفق
                  </div>
                  <div class="text-gray-600 dark:text-gray-400 text-xs">
                    نکات کلیدی برای آشنایی و ارتباط مؤثر
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Icon name="ph:heart" class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    روانشناسی ازدواج
                  </div>
                  <div class="text-gray-600 dark:text-gray-400 text-xs">
                    اصول مهم برای شناخت بهتر خود و دیگران
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Icon name="ph:users" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    مشاوره تخصصی
                  </div>
                  <div class="text-gray-600 dark:text-gray-400 text-xs">
                    دریافت مشاوره از متخصصین خانواده
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Icon name="ph:video" class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    دوره‌های آموزشی
                  </div>
                  <div class="text-gray-600 dark:text-gray-400 text-xs">
                    ویدئوها و کارگاه‌های تخصصی
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback Section -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <div class="flex items-start gap-4">
              <Icon name="ph:chat-circle-text" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <BaseHeading as="h3" size="md" weight="semibold" class="text-blue-800 dark:text-blue-200 mb-2">
                  بازخورد شما مهم است
                </BaseHeading>
                <BaseParagraph class="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  نظرات شما به ما کمک می‌کند تا راهنمای بهتری ارائه دهیم. آیا این راهنما برای شما مفید بود؟
                </BaseParagraph>
                <div class="flex gap-3">
                  <BaseButton
                    variant="solid"
                    size="sm"
                    class="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="ph:thumbs-up" class="w-4 h-4 me-2" />
                    مفید بود
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    class="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Icon name="ph:chat" class="w-4 h-4 me-2" />
                    ارسال پیشنهاد
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>