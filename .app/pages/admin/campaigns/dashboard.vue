<script setup lang="ts">
import type { NotificationCampaign } from '~/types/campaigns'

definePageMeta({
  title: 'داشبورد کمپین‌ها',
  layout: 'sidebar',
  // Using global middlewares only
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'داشبورد کمپین‌ها - پنل ادمین - ذهنا',
})

const {
  campaigns,
  isLoading,
  activeCampaigns,
  draftCampaigns,
  completedCampaigns,
  fetchCampaigns,
  updateCampaignStatus,
  getCampaignMetrics,
  launchCampaign,
  pauseCampaign,
  resumeCampaign,
} = useCampaignManager()

// State
const selectedTab = ref<'all' | 'active' | 'draft' | 'scheduled' | 'paused' | 'completed'>('all')
const searchQuery = ref('')
const selectedCampaign = ref<NotificationCampaign | null>(null)
const showScheduleModal = ref(false)
const scheduleDate = ref('')
const scheduleTime = ref('')

// Initialize data
onMounted(async () => {
  try {
    await fetchCampaigns()
  }
  catch (error) {
    console.error('خطا در بارگذاری کمپین‌ها:', error)
  }
})

// Computed
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Filter by tab
  if (selectedTab.value !== 'all') {
    filtered = filtered.filter(c => c.status === selectedTab.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query)
      || c.description.toLowerCase().includes(query),
    )
  }

  return filtered
})

const totalMetrics = computed(() => {
  return campaigns.value.reduce((acc, campaign) => {
    const metrics = getCampaignMetrics(campaign)
    return {
      sent_count: acc.sent_count + metrics.sent_count,
      delivered_count: acc.delivered_count + metrics.delivered_count,
      opened_count: acc.opened_count + metrics.opened_count,
      clicked_count: acc.clicked_count + metrics.clicked_count,
    }
  }, { sent_count: 0, delivered_count: 0, opened_count: 0, clicked_count: 0 })
})

const overallDeliveryRate = computed(() => {
  return totalMetrics.value.sent_count > 0
    ? Math.round((totalMetrics.value.delivered_count / totalMetrics.value.sent_count) * 100)
    : 0
})

const overallOpenRate = computed(() => {
  return totalMetrics.value.delivered_count > 0
    ? Math.round((totalMetrics.value.opened_count / totalMetrics.value.delivered_count) * 100)
    : 0
})

// Methods
const handleQuickAction = async (campaign: NotificationCampaign, action: string) => {
  try {
    switch (action) {
      case 'launch':
        await launchCampaign(campaign.id)
        break
      case 'pause':
        await pauseCampaign(campaign.id)
        break
      case 'resume':
        await resumeCampaign(campaign.id)
        break
      case 'schedule':
        selectedCampaign.value = campaign
        showScheduleModal.value = true
        break
    }
  }
  catch (error) {
    console.error('خطا در انجام عملیات:', error)
  }
}

const handleScheduleCampaign = async () => {
  if (!selectedCampaign.value || !scheduleDate.value || !scheduleTime.value) return

  try {
    const scheduleDateTime = `${scheduleDate.value}T${scheduleTime.value}`

    // Update campaign with schedule
    await updateCampaignStatus(selectedCampaign.value.id, 'scheduled')

    // Here you would also update the schedule field in the campaign
    // This would require extending the updateCampaign method

    showScheduleModal.value = false
    scheduleDate.value = ''
    scheduleTime.value = ''
    selectedCampaign.value = null
  }
  catch (error) {
    console.error('خطا در زمان‌بندی کمپین:', error)
  }
}

const getStatusColor = (status: NotificationCampaign['status']) => {
  switch (status) {
    case 'active': return 'success'
    case 'draft': return 'warning'
    case 'scheduled': return 'info'
    case 'paused': return 'muted'
    case 'completed': return 'primary'
    default: return 'muted'
  }
}

const getStatusIcon = (status: NotificationCampaign['status']) => {
  switch (status) {
    case 'active': return 'ph:play'
    case 'draft': return 'ph:file-text'
    case 'scheduled': return 'ph:clock'
    case 'paused': return 'ph:pause'
    case 'completed': return 'ph:check-circle'
    default: return 'ph:circle'
  }
}

const getStatusLabel = (status: NotificationCampaign['status']) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'draft': return 'پیش‌نویس'
    case 'scheduled': return 'زمان‌بندی شده'
    case 'paused': return 'متوقف'
    case 'completed': return 'تکمیل شده'
    default: return 'نامشخص'
  }
}

const tabCounts = computed(() => ({
  all: campaigns.value.length,
  active: activeCampaigns.value.length,
  draft: draftCampaigns.value.length,
  scheduled: campaigns.value.filter(c => c.status === 'scheduled').length,
  paused: campaigns.value.filter(c => c.status === 'paused').length,
  completed: completedCampaigns.value.length,
}))
</script>

<template>
  <div class="campaign-dashboard bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-muted-900 mb-2 text-3xl font-bold dark:text-white">
            داشبورد کمپین‌ها
          </h1>
          <p class="text-muted-500 dark:text-muted-400">
            مدیریت و نظارت بر کمپین‌های اعلان‌رسانی
          </p>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton
            variant="outline"
            :to="'/admin/campaigns/templates'"
          >
            <Icon name="ph:template" class="ml-2 size-4" />
            مدیریت قالب‌ها
          </BaseButton>
          <BaseButton
            color="primary"
            :to="'/admin/campaigns'"
          >
            <Icon name="ph:plus" class="ml-2 size-4" />
            کمپین جدید
          </BaseButton>
        </div>
      </div>

      <!-- Overall Stats -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                کل ارسال‌ها
              </p>
              <p class="text-muted-900 text-2xl font-bold dark:text-white">
                {{ totalMetrics.sent_count.toLocaleString('fa-IR') }}
              </p>
            </div>
            <div class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg">
              <Icon name="ph:paper-plane-tilt" class="text-primary-600 dark:text-primary-400 size-6" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                نرخ تحویل
              </p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ overallDeliveryRate }}%
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Icon name="ph:check" class="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                نرخ بازدید
              </p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ overallOpenRate }}%
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="ph:eye" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                کمپین‌های فعال
              </p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ activeCampaigns.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Icon name="ph:play" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 mb-6 rounded-xl border bg-white p-6">
        <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(tab, key) in { all: 'همه', active: 'فعال', draft: 'پیش‌نویس', scheduled: 'زمان‌بندی شده', paused: 'متوقف', completed: 'تکمیل شده' }"
              :key="key"
              class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="selectedTab === key
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-700'"
              @click="selectedTab = key as any"
            >
              {{ tab }}
              <span class="bg-muted-200 dark:bg-muted-600 ml-2 rounded-full px-2 py-0.5 text-xs">
                {{ tabCounts[key as keyof typeof tabCounts] }}
              </span>
            </button>
          </div>

          <BaseInput
            v-model="searchQuery"
            placeholder="جستجوی کمپین‌ها..."
            icon="ph:magnifying-glass"
            class="w-full md:w-80"
          />
        </div>
      </div>

      <!-- Campaigns Grid -->
      <div v-if="isLoading" class="py-12 text-center">
        <p class="text-muted-500 dark:text-muted-400">
          در حال بارگذاری کمپین‌ها...
        </p>
      </div>

      <div v-else-if="filteredCampaigns.length === 0" class="py-12 text-center">
        <Icon name="ph:megaphone" class="text-muted-400 mx-auto mb-4 size-12" />
        <p class="text-muted-500 dark:text-muted-400 mb-4">
          {{ searchQuery.trim() ? 'کمپینی یافت نشد' : 'کمپینی در این دسته وجود ندارد' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="campaign in filteredCampaigns"
          :key="campaign.id"
          class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <!-- Campaign Header -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-muted-900 mb-2 text-lg font-semibold dark:text-white">
                {{ campaign.name }}
              </h3>
              <p class="text-muted-600 dark:text-muted-300 line-clamp-2 text-sm">
                {{ campaign.description }}
              </p>
            </div>

            <BaseBadge
              :color="getStatusColor(campaign.status)"
              size="sm"
              class="ml-3"
            >
              <Icon :name="getStatusIcon(campaign.status)" class="ml-1 size-3" />
              {{ getStatusLabel(campaign.status) }}
            </BaseBadge>
          </div>

          <!-- Campaign Metrics -->
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-muted-900 text-lg font-semibold dark:text-white">
                {{ getCampaignMetrics(campaign).sent_count }}
              </p>
              <p class="text-muted-500 dark:text-muted-400 text-xs">
                ارسال شده
              </p>
            </div>
            <div class="text-center">
              <p class="text-muted-900 text-lg font-semibold dark:text-white">
                {{ getCampaignMetrics(campaign).delivery_rate }}%
              </p>
              <p class="text-muted-500 dark:text-muted-400 text-xs">
                نرخ تحویل
              </p>
            </div>
            <div class="text-center">
              <p class="text-muted-900 text-lg font-semibold dark:text-white">
                {{ getCampaignMetrics(campaign).open_rate }}%
              </p>
              <p class="text-muted-500 dark:text-muted-400 text-xs">
                نرخ بازدید
              </p>
            </div>
            <div class="text-center">
              <p class="text-muted-900 text-lg font-semibold dark:text-white">
                {{ getCampaignMetrics(campaign).click_rate }}%
              </p>
              <p class="text-muted-500 dark:text-muted-400 text-xs">
                نرخ کلیک
              </p>
            </div>
          </div>

          <!-- Campaign Actions -->
          <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-t pt-4">
            <div class="flex items-center gap-2">
              <BaseButton
                v-if="campaign.status === 'draft'"
                size="sm"
                color="success"
                @click="handleQuickAction(campaign, 'launch')"
              >
                <Icon name="ph:play" class="size-4" />
              </BaseButton>

              <BaseButton
                v-if="campaign.status === 'draft'"
                size="sm"
                color="info"
                variant="outline"
                @click="handleQuickAction(campaign, 'schedule')"
              >
                <Icon name="ph:clock" class="size-4" />
              </BaseButton>

              <BaseButton
                v-if="campaign.status === 'active'"
                size="sm"
                color="warning"
                @click="handleQuickAction(campaign, 'pause')"
              >
                <Icon name="ph:pause" class="size-4" />
              </BaseButton>

              <BaseButton
                v-if="campaign.status === 'paused'"
                size="sm"
                color="success"
                @click="handleQuickAction(campaign, 'resume')"
              >
                <Icon name="ph:play" class="size-4" />
              </BaseButton>
            </div>

            <BaseButton
              size="sm"
              variant="outline"
              :to="`/admin/campaigns/${campaign.id}/analytics`"
            >
              <Icon name="ph:chart-line" class="ml-1 size-4" />
              جزئیات
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Campaign Modal -->
    <BaseModal
      v-model="showScheduleModal"
      title="زمان‌بندی کمپین"
      size="md"
    >
      <form @submit.prevent="handleScheduleCampaign">
        <div class="space-y-4">
          <p class="text-muted-600 dark:text-muted-300 text-sm">
            زمان‌بندی کمپین: <strong>{{ selectedCampaign?.name }}</strong>
          </p>

          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              v-model="scheduleDate"
              type="date"
              label="تاریخ"
              required
            />
            <BaseInput
              v-model="scheduleTime"
              type="time"
              label="ساعت"
              required
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="showScheduleModal = false"
          >
            انصراف
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            :disabled="!scheduleDate || !scheduleTime"
          >
            زمان‌بندی
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
