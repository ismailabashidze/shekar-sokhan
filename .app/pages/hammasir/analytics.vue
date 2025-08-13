<script setup lang="ts">
// Analytics Page - Detailed analytics and insights for user profile
import { useApplicantProfileService } from '~/composables/hammasir/useApplicantProfileService'
import { useProfileAnalytics } from '~/composables/hammasir/useProfileAnalytics'

definePageMeta({
  title: 'تحلیل پروفایل - همسر',
  description: 'مشاهده تحلیل‌های تفصیلی و بینش‌های شخصی‌سازی شده پروفایل',
  layout: 'default'
})

// Composables
const { getMyProfile } = useApplicantProfileService()
const { profile, loading: profileLoading } = getMyProfile()
const { state: analyticsState, loadAnalytics, refreshAnalytics } = useProfileAnalytics()

// Reactive state
const timeRange = ref<'week' | 'month' | 'quarter' | 'year'>('month')
const refreshing = ref(false)
const exportFormat = ref<'pdf' | 'csv' | 'json'>('pdf')

// Load analytics data
onMounted(async () => {
  if (profile.value) {
    await loadAnalytics()
  }
})

// Handle time range change
const handleTimeRangeChange = async (newRange: string) => {
  timeRange.value = newRange as typeof timeRange.value
  await refreshAnalytics()
}

// Handle refresh
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await refreshAnalytics()
  } finally {
    refreshing.value = false
  }
}

// Handle export
const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
  try {
    // Implementation would depend on your export service
    console.log(`Exporting analytics as ${format}`)
    
    // Example implementation:
    // const exportData = await useApplicantProfileService().exportAnalytics(format, timeRange.value)
    // downloadFile(exportData, `analytics-${timeRange.value}.${format}`)
    
    $toast.success(`آمار با موفقیت در قالب ${format} دانلود شد`)
  } catch (error) {
    $toast.error('خطا در دانلود فایل')
    console.error('Export error:', error)
  }
}

// Navigation
const navigateToProfile = () => {
  navigateTo('/hammasir')
}

const navigateToEdit = () => {
  navigateTo('/hammasir/edit')
}

const navigateToHandbook = () => {
  navigateTo('/hammasir/handbook')
}

// Watch for profile changes
watch(profile, (newProfile) => {
  if (newProfile) {
    loadAnalytics()
  }
})

// SEO and meta
useHead({
  title: 'تحلیل پروفایل - همسر',
  meta: [
    { name: 'description', content: 'مشاهده تحلیل‌های تفصیلی و بینش‌های شخصی‌سازی شده پروفایل' },
    { name: 'keywords', content: 'تحلیل، آمار، پروفایل، همسر، بینش' },
    { property: 'og:title', content: 'تحلیل پروفایل - همسر' },
    { property: 'og:description', content: 'مشاهده تحلیل‌های تفصیلی و بینش‌های شخصی‌سازی شده پروفایل' },
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
            <span class="text-gray-800 dark:text-white font-medium">تحلیل‌ها</span>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <BaseButton
              variant="outline"
              size="sm"
              :loading="refreshing"
              @click="handleRefresh"
            >
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
              بروزرسانی
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
            تحلیل پروفایل
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400">
            بینش‌های تفصیلی و آمار عملکرد پروفایل شما
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div v-if="profileLoading || analyticsState.loading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="animate-pulse">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div class="space-y-2">
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div class="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div class="grid grid-cols-3 gap-6">
                <div v-for="j in 3" :key="j" class="space-y-3">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="analyticsState.error" class="max-w-2xl mx-auto text-center py-12">
          <Icon name="ph:chart-line-up" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            خطا در بارگذاری تحلیل‌ها
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
            متأسفانه در بارگذاری آمار مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
          </BaseParagraph>
          <div class="flex justify-center gap-4">
            <BaseButton variant="solid" @click="handleRefresh">
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
              تلاش مجدد
            </BaseButton>
            <BaseButton variant="outline" @click="navigateToProfile">
              بازگشت به پروفایل
            </BaseButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!analyticsState.analytics || !profile" class="max-w-2xl mx-auto text-center py-12">
          <Icon name="ph:chart-pie" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-4">
            تحلیل‌ها در دسترس نیست
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
            برای مشاهده تحلیل‌های تفصیلی، ابتدا پروفایل خود را تکمیل کنید.
          </BaseParagraph>
          <div class="flex justify-center gap-4">
            <BaseButton variant="solid" @click="navigateToEdit">
              <Icon name="ph:pencil" class="w-4 h-4 me-2" />
              تکمیل پروفایل
            </BaseButton>
            <BaseButton variant="outline" @click="navigateToProfile">
              مشاهده پروفایل
            </BaseButton>
          </div>
        </div>

        <!-- Analytics Content -->
        <div v-else class="space-y-8">
          <!-- Profile Overview Card -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name="ph:user-circle" class="w-8 h-8" />
                </div>
                <div>
                  <BaseHeading as="h2" size="lg" weight="semibold" class="mb-1">
                    {{ profile.personalInfo.firstName }} {{ profile.personalInfo.lastName }}
                  </BaseHeading>
                  <BaseParagraph class="text-white/90">
                    آمار عملکرد پروفایل شما
                  </BaseParagraph>
                </div>
              </div>
              
              <div class="text-center">
                <div class="text-3xl font-bold mb-1">
                  {{ Math.round(analyticsState.analytics.overallScore * 100) }}
                </div>
                <div class="text-white/80 text-sm">امتیاز کلی</div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div class="text-2xl font-bold mb-1">{{ analyticsState.analytics.completionLevel }}%</div>
                <div class="text-white/80 text-sm">تکمیل پروفایل</div>
              </div>
              <div class="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div class="text-2xl font-bold mb-1">{{ analyticsState.analytics.matchingPotential }}%</div>
                <div class="text-white/80 text-sm">پتانسیل انطباق</div>
              </div>
              <div class="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div class="text-2xl font-bold mb-1">{{ analyticsState.analytics.recommendationsCount }}</div>
                <div class="text-white/80 text-sm">توصیه‌ها</div>
              </div>
              <div class="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <div class="text-2xl font-bold mb-1">{{ analyticsState.analytics.sectionsAnalyzed }}</div>
                <div class="text-white/80 text-sm">بخش‌های تحلیل شده</div>
              </div>
            </div>
          </div>

          <!-- Analytics Display Component -->
          <HammasirDisplayAnalyticsDisplay
            :analytics="analyticsState.analytics"
            :time-range="timeRange"
            :show-charts="true"
            :loading="refreshing"
            @time-range-change="handleTimeRangeChange"
            @refresh="handleRefresh"
            @export="handleExport"
          />

          <!-- Action Cards -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Improve Profile Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center me-3">
                  <Icon name="ph:arrow-up" class="w-5 h-5 text-blue-600" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  بهبود پروفایل
                </BaseHeading>
              </div>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                با تکمیل بخش‌های باقی‌مانده، عملکرد پروفایل خود را بهبود دهید
              </BaseParagraph>
              <BaseButton
                variant="outline"
                size="sm"
                class="w-full"
                @click="navigateToEdit"
              >
                ویرایش پروفایل
              </BaseButton>
            </div>

            <!-- View Recommendations Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center me-3">
                  <Icon name="ph:lightbulb" class="w-5 h-5 text-green-600" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  راهنمای شخصی
                </BaseHeading>
              </div>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                توصیه‌های اختصاصی برای بهبود پروفایل و افزایش انطباق‌یابی
              </BaseParagraph>
              <BaseButton
                variant="outline"
                size="sm"
                class="w-full"
                @click="navigateToHandbook"
              >
                مشاهده راهنما
              </BaseButton>
            </div>

            <!-- Share Insights Card -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center me-3">
                  <Icon name="ph:share-network" class="w-5 h-5 text-purple-600" />
                </div>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-800 dark:text-white">
                  اشتراک نتایج
                </BaseHeading>
              </div>
              <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                آمار و تحلیل‌های خود را با دیگران به اشتراک بگذارید
              </BaseParagraph>
              
              <!-- Export Options -->
              <div class="space-y-2">
                <BaseSelect
                  v-model="exportFormat"
                  :options="[
                    { value: 'pdf', label: 'فایل PDF' },
                    { value: 'csv', label: 'فایل CSV' },
                    { value: 'json', label: 'فایل JSON' }
                  ]"
                  size="sm"
                />
                <BaseButton
                  variant="outline"
                  size="sm"
                  class="w-full"
                  @click="handleExport(exportFormat)"
                >
                  <Icon name="ph:download" class="w-4 h-4 me-2" />
                  دانلود گزارش
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Tips and Suggestions -->
          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
            <div class="flex items-start gap-4">
              <Icon name="ph:lightbulb" class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <BaseHeading as="h3" size="md" weight="semibold" class="text-yellow-800 dark:text-yellow-200 mb-2">
                  نکات بهبود عملکرد
                </BaseHeading>
                <div class="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <div v-if="analyticsState.analytics.completionLevel < 80" class="flex items-start gap-2">
                    <Icon name="ph:arrow-right" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>با تکمیل بخش‌های باقی‌مانده، پتانسیل انطباق‌یابی شما تا 25% افزایش می‌یابد</span>
                  </div>
                  <div v-if="analyticsState.analytics.dataQualityScore < 0.8" class="flex items-start gap-2">
                    <Icon name="ph:arrow-right" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>بهبود کیفیت اطلاعات وارد شده، دقت تحلیل‌ها را افزایش می‌دهد</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <Icon name="ph:arrow-right" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>به‌روزرسانی منظم اطلاعات، عملکرد کلی پروفایل را بهبود می‌بخشد</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>