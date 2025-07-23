<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
  title: 'بازخوردهای کاربران',
  layout: 'sidebar',
  middleware: 'admin',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'بازخوردهای کاربران - پنل ادمین - ذهنا',
})

// Use composable
const {
  feedbacks,
  loading,
  currentPage,
  perPage,
  searchQuery,
  ratingFilter,
  totalItems,
  totalPages,
  fetchFeedbacks,
  setPage,
  setSearch,
  setRatingFilter,
  resetFilters,
  refreshFeedbacks
} = useAdminFeedbacks()

const toaster = useToaster()

// Fetch data on mount
onMounted(async () => {
  await fetchFeedbacks()
  console.log(feedbacks.value)
})

// Problem categories mapping with icons
const problemCategories = {
  inappropriate_content: { text: 'محتوای نامناسب', icon: 'ph:warning-circle-duotone' },
  unprofessional_behavior: { text: 'رفتار غیرحرفه‌ای', icon: 'ph:user-minus-duotone' },
  irrelevant_response: { text: 'پاسخ غیرمرتبط', icon: 'ph:arrows-out-duotone' },
  poor_communication: { text: 'ارتباط ضعیف', icon: 'ph:chat-slash-duotone' },
  timing_issues: { text: 'مشکلات زمان‌بندی', icon: 'ph:clock-countdown-duotone' },
  technical_problems: { text: 'مشکلات فنی', icon: 'ph:bug-duotone' },
  ethical_concerns: { text: 'نگرانی‌های اخلاقی', icon: 'ph:scales-duotone' },
  lack_of_empathy: { text: 'عدم همدلی', icon: 'ph:heart-slash-duotone' },
  islamic_contradiction: { text: 'تضاد با ارزش‌های اسلامی', icon: 'ph:mosque-duotone' },
  irrelevant: { text: 'نامرتبط', icon: 'ph:x-circle-duotone' },
  generic: { text: 'عمومی', icon: 'ph:circle-duotone' },
  confusing: { text: 'گیج‌کننده', icon: 'ph:question-duotone' }
}

// Quality categories mapping with icons
const qualityCategories = {
  helpful_advice: { text: 'مشاوره مفید', icon: 'ph:lightbulb-duotone' },
  good_listening: { text: 'گوش دادن خوب', icon: 'ph:ear-duotone' },
  professional_approach: { text: 'رویکرد حرفه‌ای', icon: 'ph:briefcase-duotone' },
  empathetic_response: { text: 'پاسخ همدلانه', icon: 'ph:heart-duotone' },
  clear_communication: { text: 'ارتباط واضح', icon: 'ph:chat-text-duotone' },
  timely_response: { text: 'پاسخ به موقع', icon: 'ph:clock-duotone' },
  relevant_guidance: { text: 'راهنمایی مرتبط', icon: 'ph:compass-duotone' },
  supportive_tone: { text: 'لحن حمایتی', icon: 'ph:hand-heart-duotone' },
  visual_aids: { text: 'کمک‌های بصری', icon: 'ph:image-duotone' },
  more_examples: { text: 'مثال‌های بیشتر', icon: 'ph:list-bullets-duotone' },
  more_detail: { text: 'جزئیات بیشتر', icon: 'ph:magnifying-glass-plus-duotone' },
  practical: { text: 'عملی', icon: 'ph:wrench-duotone' }
}

// Improvement categories mapping with icons
const improvementCategories = {
  response_speed: { text: 'سرعت پاسخ', icon: 'ph:lightning-duotone' },
  content_depth: { text: 'عمق محتوا', icon: 'ph:stack-duotone' },
  personalization: { text: 'شخصی‌سازی', icon: 'ph:user-focus-duotone' },
  follow_up: { text: 'پیگیری', icon: 'ph:arrow-clockwise-duotone' },
  resource_sharing: { text: 'اشتراک منابع', icon: 'ph:share-network-duotone' },
  clarity: { text: 'وضوح', icon: 'ph:eye-duotone' },
  engagement: { text: 'درگیری', icon: 'ph:handshake-duotone' },
  availability: { text: 'در دسترس بودن', icon: 'ph:calendar-check-duotone' },
  empathy: { text: 'همدلی', icon: 'ph:heart-duotone' },
  content_quality: { text: 'کیفیت محتوا', icon: 'ph:star-duotone' },
  professional_approach: { text: 'رویکرد حرفه‌ای', icon: 'ph:briefcase-duotone' }
}

// Format date to Persian
const formatDate = (dateString: string): string => {
  if (!dateString) return 'تاریخ نامشخص'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Get rating color
const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'success'
  if (rating >= 3) return 'warning'
  return 'danger'
}


// Format categories for display with icons
const formatCategories = (categories: Record<string, boolean> | undefined, categoryMap: Record<string, { text: string, icon: string }>): Array<{ text: string, icon: string }> => {
  if (!categories) return []
  return Object.entries(categories)
    .filter(([_, selected]) => selected)
    .map(([key, _]) => categoryMap[key] || { text: key, icon: 'ph:circle-duotone' })
}

// Handle refresh with toast
const handleRefresh = async () => {
  try {
    await refreshFeedbacks()
    toaster.show({
      title: 'بروزرسانی',
      message: 'لیست بازخوردها بروزرسانی شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در بروزرسانی اطلاعات',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Handle reset filters
const handleResetFilters = () => {
  resetFilters()
  toaster.show({
    title: 'تنظیم مجدد',
    message: 'فیلترها پاک شدند',
    color: 'info',
    icon: 'ph:funnel-duotone',
    closable: true,
  })
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:chat-circle-text-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            بازخوردهای کاربران
          </BaseHeading>
        </div>

        <div class="flex items-center gap-2">
          <!-- Rating Filter -->
          <BaseSelect
            :model-value="ratingFilter"
            shape="rounded"
            class="w-32"
            @update:model-value="setRatingFilter"
          >
            <option value="all">همه امتیازها</option>
            <option value="5">5 ستاره</option>
            <option value="4">4 ستاره</option>
            <option value="3">3 ستاره</option>
            <option value="2">2 ستاره</option>
            <option value="1">1 ستاره</option>
          </BaseSelect>


          <!-- Search -->
          <BaseInput
            :model-value="searchQuery"
            icon="lucide:search"
            placeholder="جستجو کاربر یا روانشناس..."
            :classes="{
              wrapper: 'w-64',
            }"
            @update:model-value="setSearch"
          />

          <!-- Refresh Button -->
          <BaseButton
            color="success"
            shape="curved"
            class="gap-1"
            @click="handleRefresh"
          >
            <Icon name="ph:arrows-clockwise-duotone" class="size-4" />
            <span class="hidden sm:inline">بروزرسانی</span>
          </BaseButton>
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        مدیریت و بررسی بازخوردهای ارسال شده توسط کاربران
      </BaseParagraph>

      <!-- Loading State -->
      <div v-if="loading" class="py-10">
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="i in 5"
            :key="i"
          >
            <BaseCard shape="curved" class="overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <BasePlaceload class="h-6 w-48 rounded" />
                  <BasePlaceload class="h-6 w-20 rounded" />
                </div>
                <BasePlaceload class="h-4 w-full rounded mb-2" />
                <BasePlaceload class="h-4 w-3/4 rounded mb-4" />
                <div class="flex items-center gap-2">
                  <BasePlaceload class="h-8 w-24 rounded" />
                  <BasePlaceload class="h-8 w-24 rounded" />
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="!loading && feedbacks.length === 0">
        <BasePlaceholderPage
          title="بازخوردی یافت نشد"
          subtitle="هیچ بازخوردی با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید."
        >
          <template #image>
            <img
              class="block dark:hidden"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
            <img
              class="hidden dark:block"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
          </template>
          <template #action>
            <BaseButton
              color="muted"
              shape="curved"
              @click="handleResetFilters"
            >
              نمایش همه بازخوردها
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Feedbacks List -->
      <div v-else class="mt-6 space-y-4">
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <BaseCard
            v-for="feedback in feedbacks"
            :key="feedback.id"
            shape="curved"
            class="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <!-- Header -->
            <div class="bg-muted-50 dark:bg-muted-800/30 border-b border-muted-200 dark:border-muted-700 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- User Info -->
                  <BaseAvatar
                    :src="feedback.expand?.user_id?.avatar || '/img/avatars/default-user.jpg'"
                    size="md"
                  />
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="sm"
                      weight="medium"
                      class="text-muted-800 dark:text-white"
                    >
                      <Icon name="ph:user-duotone" class="inline-block ml-1 size-4" />
                      {{ feedback.expand?.user_id?.name || 'کاربر ناشناس' }}
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-400">
                      <Icon name="ph:envelope-duotone" class="inline-block ml-1 size-3" />
                      {{ feedback.expand?.user_id?.email || 'ایمیل نامشخص' }}
                    </BaseParagraph>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <!-- Rating -->
                  <BaseTag
                    v-if="feedback.rating"
                    :color="getRatingColor(feedback.rating)"
                    shape="curved"
                    size="sm"
                    class="px-3 py-1"
                  >
                    <div class="flex items-center gap-1">
                      <Icon name="ph:star-fill" class="size-3" />
                      {{ feedback.rating }} / 5
                    </div>
                  </BaseTag>

                  <!-- Date -->
                  <BaseParagraph size="xs" class="text-muted-500">
                    {{ formatDate(feedback.created) }}
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Original Message -->
              <div v-if="feedback.message_content" class="bg-gradient-to-r from-primary-50 to-info-50 dark:from-primary-900/20 dark:to-info-900/20 rounded-xl p-4">
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:chat-circle-duotone" class="text-primary-500 size-5" />
                    <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">پیام اصلی</span>
                  </div>
                  <!-- Therapist Info -->
                  <div v-if="feedback.expand?.therapist_id" class="flex items-center gap-2">
                    <BaseAvatar
                      :src="feedback.expand.therapist_id.avatar || '/img/avatars/default-therapist.jpg'"
                      size="xs"
                    />
                    <div class="text-right">
                      <div class="text-xs text-primary-700 dark:text-primary-300 font-medium">
                        <Icon name="ph:stethoscope-duotone" class="inline-block ml-1 size-3" />
                        {{ feedback.expand.therapist_id.name }}
                      </div>
                      <div v-if="feedback.expand.therapist_id.specialty" class="text-xs text-muted-500">
                        {{ feedback.expand.therapist_id.specialty }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-white dark:bg-muted-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300 text-right">
                    {{ feedback.message_content }}
                  </BaseParagraph>
                </div>
              </div>

              <!-- General Feedback -->
              <div v-if="feedback.general_text" class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
                <BaseHeading tag="h4" size="xs" weight="medium" class="text-muted-700 dark:text-muted-300 mb-3">
                  بازخورد کلی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                  {{ feedback.general_text }}
                </BaseParagraph>
                <div v-if="feedback.general_other" class="mt-3 pt-3 border-t border-muted-200 dark:border-muted-700">
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 mb-1">توضیحات اضافی:</BaseParagraph>
                  <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                    {{ feedback.general_other }}
                  </BaseParagraph>
                </div>
              </div>

              <!-- Feedback Details -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Problems Categories -->
                <div v-if="feedback.problems_categories && Object.keys(feedback.problems_categories).length > 0">
                  <BaseHeading tag="h4" size="xs" weight="medium" class="text-danger-600 dark:text-danger-400 mb-3">
                    مشکلات گزارش شده
                  </BaseHeading>
                  <div class="space-y-2">
                    <BaseTag
                      v-for="category in formatCategories(feedback.problems_categories, problemCategories)"
                      :key="category.text"
                      color="danger"
                      shape="curved"
                      size="sm"
                      class="ml-2 mb-2"
                    >
                      <div class="flex items-center gap-1">
                        <Icon :name="category.icon" class="size-3" />
                        {{ category.text }}
                      </div>
                    </BaseTag>
                  </div>
                  <div v-if="feedback.problems_other" class="mt-3">
                    <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 mb-1">توضیحات اضافی:</BaseParagraph>
                    <div class="bg-danger-50 dark:bg-danger-900/20 rounded-lg p-3">
                      <BaseParagraph size="sm" class="text-danger-700 dark:text-danger-300">
                        {{ feedback.problems_other }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>

                <!-- Quality Categories -->
                <div v-if="feedback.quality_categories && Object.keys(feedback.quality_categories).length > 0">
                  <BaseHeading tag="h4" size="xs" weight="medium" class="text-success-600 dark:text-success-400 mb-3">
                    نقاط قوت
                  </BaseHeading>
                  <div class="space-y-2">
                    <BaseTag
                      v-for="category in formatCategories(feedback.quality_categories, qualityCategories)"
                      :key="category.text"
                      color="success"
                      shape="curved"
                      size="sm"
                      class="ml-2 mb-2"
                    >
                      <div class="flex items-center gap-1">
                        <Icon :name="category.icon" class="size-3" />
                        {{ category.text }}
                      </div>
                    </BaseTag>
                  </div>
                  <div v-if="feedback.quality_other" class="mt-3">
                    <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 mb-1">توضیحات اضافی:</BaseParagraph>
                    <div class="bg-success-50 dark:bg-success-900/20 rounded-lg p-3">
                      <BaseParagraph size="sm" class="text-success-700 dark:text-success-300">
                        {{ feedback.quality_other }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>

                <!-- Improvement Suggestions -->
                <div v-if="feedback.improvements_categories && Object.keys(feedback.improvements_categories).length > 0">
                  <BaseHeading tag="h4" size="xs" weight="medium" class="text-info-600 dark:text-info-400 mb-3">
                    پیشنهادات بهبود
                  </BaseHeading>
                  <div class="space-y-2">
                    <BaseTag
                      v-for="category in formatCategories(feedback.improvements_categories, improvementCategories)"
                      :key="category.text"
                      color="info"
                      shape="curved"
                      size="sm"
                      class="ml-2 mb-2"
                    >
                      <div class="flex items-center gap-1">
                        <Icon :name="category.icon" class="size-3" />
                        {{ category.text }}
                      </div>
                    </BaseTag>
                  </div>
                  <div v-if="feedback.improvements_other" class="mt-3">
                    <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 mb-1">پیشنهادات اضافی:</BaseParagraph>
                    <div class="bg-info-50 dark:bg-info-900/20 rounded-lg p-3">
                      <BaseParagraph size="sm" class="text-info-700 dark:text-info-300">
                        {{ feedback.improvements_other }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Session Info -->
              <div class="bg-muted-50 dark:bg-muted-900/50 rounded-lg p-4">
                <BaseHeading tag="h4" size="xs" weight="medium" class="text-muted-700 dark:text-muted-300 mb-3">
                  <Icon name="ph:clipboard-text-duotone" class="inline-block ml-1 size-4" />
                  اطلاعات جلسه و درمانگر
                </BaseHeading>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <!-- Therapist Info -->
                  <div v-if="feedback.expand?.therapist_id">
                    <span class="text-muted-600 dark:text-muted-400 flex items-center gap-1 mb-1">
                      <Icon name="ph:stethoscope-duotone" class="size-3" />
                      درمانگر:
                    </span>
                    <div class="flex items-center gap-2">
                      <BaseAvatar
                        :src="feedback.expand.therapist_id.avatar || '/img/avatars/default-therapist.jpg'"
                        size="xs"
                      />
                      <div>
                        <div class="font-medium text-muted-800 dark:text-white">
                          {{ feedback.expand.therapist_id.name }}
                        </div>
                        <div v-if="feedback.expand.therapist_id.specialty" class="text-xs text-muted-500">
                          {{ feedback.expand.therapist_id.specialty }}
                        </div>
                        <div class="text-xs text-muted-500">
                          {{ feedback.expand.therapist_id.email }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Session Info -->
                  <div v-if="feedback.expand?.session_id">
                    <span class="text-muted-600 dark:text-muted-400 flex items-center gap-1 mb-1">
                      <Icon name="ph:calendar-duotone" class="size-3" />
                      جلسه:
                    </span>
                    <div class="font-medium text-muted-800 dark:text-white">
                      {{ feedback.expand.session_id.session_type === 'therapy' ? 'جلسه درمانی' : 'جلسه مشاوره' }}
                    </div>
                    <div class="text-xs text-muted-500">
                      وضعیت: 
                      <span :class="feedback.expand.session_id.status === 'completed' ? 'text-success-600' : 'text-warning-600'">
                        {{ feedback.expand.session_id.status === 'completed' ? 'تکمیل شده' : 'در حال انجام' }}
                      </span>
                    </div>
                    <div class="text-xs text-muted-500">
                      {{ formatDate(feedback.expand.session_id.created) }}
                    </div>
                  </div>
                  
                  <!-- Feedback ID -->
                  <div>
                    <span class="text-muted-600 dark:text-muted-400 flex items-center gap-1 mb-1">
                      <Icon name="ph:hash-duotone" class="size-3" />
                      شناسه بازخورد:
                    </span>
                    <div class="font-mono text-xs text-muted-800 dark:text-white">
                      {{ feedback.id.slice(-8) }}
                    </div>
                    <div class="text-xs text-muted-500">
                      {{ formatDate(feedback.created) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </TransitionGroup>

        <!-- Pagination -->
        <div v-if="totalItems > perPage" class="mt-8">
          <div class="mb-4 text-center">
            <BaseParagraph size="sm" class="text-muted-500">
              نمایش {{ ((currentPage - 1) * perPage) + 1 }} تا {{ Math.min(currentPage * perPage, totalItems) }} از {{ totalItems }} بازخورد
            </BaseParagraph>
          </div>
          <BasePagination
            :total-items="totalItems"
            :item-per-page="perPage"
            :current-page="currentPage"
            rounded="full"
            @update:current-page="setPage"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>

<style scoped>
.text-muted-400 {
  line-height: 1.6;
}

.grid-cols-1 {
  gap: 1.5rem;
}
</style>