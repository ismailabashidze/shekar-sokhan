<script setup lang="ts">
import type { CampaignForm, CampaignSchedule } from '~/types/campaigns'

definePageMeta({
  title: 'مدیریت کمپین‌ها',
  layout: 'sidebar',
  middleware: 'admin',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'مدیریت کمپین‌ها - پنل ادمین - ذهنا',
})

const {
  campaigns,
  isLoading,
  isSaving,
  activeCampaigns,
  draftCampaigns,
  completedCampaigns,
  fetchCampaigns,
  createCampaign,
  updateCampaignStatus,
  deleteCampaign,
  getCampaignMetrics,
  launchCampaign,
  pauseCampaign,
  resumeCampaign
} = useCampaignManager()

const {
  userGroups,
  fetchUserGroups
} = useUserGroupManager()

const {
  activeTemplates,
  fetchTemplates
} = useTemplateManager()

// Form state
const showCreateForm = ref(false)
const editingCampaign = ref<string | null>(null)
const formData = ref<CampaignForm>({
  name: '',
  description: '',
  target_groups: [],
  template_id: '',
  schedule: {
    type: 'immediate',
    timezone: 'Asia/Tehran'
  }
})

// Initialize data
onMounted(async () => {
  try {
    await Promise.all([
      fetchCampaigns(),
      fetchUserGroups(),
      fetchTemplates()
    ])
  } catch (error) {
    console.error('خطا در بارگذاری داده‌ها:', error)
  }
})

// Form methods
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    target_groups: [],
    template_id: '',
    schedule: {
      type: 'immediate',
      timezone: 'Asia/Tehran'
    }
  }
  editingCampaign.value = null
}

const handleCreateCampaign = async () => {
  try {
    await createCampaign(formData.value)
    showCreateForm.value = false
    resetForm()
  } catch (error) {
    console.error('خطا در ایجاد کمپین:', error)
  }
}

const handleLaunchCampaign = async (campaignId: string) => {
  try {
    await launchCampaign(campaignId)
  } catch (error) {
    console.error('خطا در راه‌اندازی کمپین:', error)
  }
}

const handlePauseCampaign = async (campaignId: string) => {
  try {
    await pauseCampaign(campaignId)
  } catch (error) {
    console.error('خطا در متوقف کردن کمپین:', error)
  }
}

const handleResumeCampaign = async (campaignId: string) => {
  try {
    await resumeCampaign(campaignId)
  } catch (error) {
    console.error('خطا در ادامه کمپین:', error)
  }
}

const handleDeleteCampaign = async (campaignId: string) => {
  if (confirm('آیا از حذف این کمپین اطمینان دارید؟')) {
    try {
      await deleteCampaign(campaignId)
    } catch (error) {
      console.error('خطا در حذف کمپین:', error)
    }
  }
}

// Computed
const canSubmit = computed(() => {
  return formData.value.name.trim() && 
         formData.value.template_id && 
         formData.value.target_groups.length > 0
})

const scheduleTypeOptions = [
  { label: 'فوری', value: 'immediate' },
  { label: 'زمان‌بندی شده', value: 'scheduled' },
  { label: 'تکراری', value: 'recurring' }
]

const frequencyOptions = [
  { label: 'روزانه', value: 'daily' },
  { label: 'هفتگی', value: 'weekly' },
  { label: 'ماهانه', value: 'monthly' }
]
</script>

<template>
  <div class="admin-campaigns bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-muted-900 mb-4 text-3xl font-bold dark:text-white">
            مدیریت کمپین‌ها
          </h1>
          <p class="text-muted-500 dark:text-muted-400">
            ایجاد و مدیریت کمپین‌های اعلان‌رسانی
          </p>
        </div>
        
        <BaseButton
          color="primary"
          @click="showCreateForm = true"
        >
          <Icon name="ph:plus" class="ml-2 size-4" />
          کمپین جدید
        </BaseButton>
      </div>

      <!-- Stats Dashboard -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                کل کمپین‌ها
              </p>
              <p class="text-muted-900 text-2xl font-bold dark:text-white">
                {{ campaigns.length }}
              </p>
            </div>
            <div class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg">
              <Icon name="ph:megaphone" class="text-primary-600 dark:text-primary-400 size-6" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                فعال
              </p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ activeCampaigns.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Icon name="ph:play" class="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                پیش‌نویس
              </p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ draftCampaigns.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Icon name="ph:file-text" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                تکمیل شده
              </p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ completedCampaigns.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="ph:check-circle" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Campaigns List -->
      <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white">
        <div class="border-muted-200 dark:border-muted-700 border-b p-6">
          <h2 class="text-muted-900 text-xl font-semibold dark:text-white">
            لیست کمپین‌ها
          </h2>
        </div>

        <div v-if="isLoading" class="p-8 text-center">
          <p class="text-muted-500 dark:text-muted-400">
            در حال بارگذاری کمپین‌ها...
          </p>
        </div>

        <div v-else-if="campaigns.length === 0" class="p-8 text-center">
          <Icon name="ph:megaphone" class="text-muted-400 mx-auto mb-4 size-12" />
          <p class="text-muted-500 dark:text-muted-400 mb-4">
            هنوز کمپینی ایجاد نشده است
          </p>
          <BaseButton
            color="primary"
            variant="outline"
            @click="showCreateForm = true"
          >
            اولین کمپین را ایجاد کنید
          </BaseButton>
        </div>

        <div v-else class="divide-muted-200 dark:divide-muted-700 divide-y">
          <div
            v-for="campaign in campaigns"
            :key="campaign.id"
            class="p-6"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
                    {{ campaign.name }}
                  </h3>
                  <BaseBadge
                    :color="campaign.status === 'active' ? 'success' : 
                           campaign.status === 'draft' ? 'warning' :
                           campaign.status === 'paused' ? 'info' : 'muted'"
                    size="sm"
                  >
                    {{ campaign.status === 'active' ? 'فعال' :
                       campaign.status === 'draft' ? 'پیش‌نویس' :
                       campaign.status === 'paused' ? 'متوقف' :
                       campaign.status === 'scheduled' ? 'زمان‌بندی شده' : 'تکمیل شده' }}
                  </BaseBadge>
                </div>
                
                <p class="text-muted-600 dark:text-muted-300 mb-4 text-sm">
                  {{ campaign.description }}
                </p>

                <!-- Campaign Metrics -->
                <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
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
              </div>

              <!-- Campaign Actions -->
              <div class="flex items-center gap-2">
                <BaseButton
                  v-if="campaign.status === 'draft'"
                  size="sm"
                  color="success"
                  @click="handleLaunchCampaign(campaign.id)"
                >
                  <Icon name="ph:play" class="ml-1 size-4" />
                  راه‌اندازی
                </BaseButton>

                <BaseButton
                  v-if="campaign.status === 'active'"
                  size="sm"
                  color="warning"
                  @click="handlePauseCampaign(campaign.id)"
                >
                  <Icon name="ph:pause" class="ml-1 size-4" />
                  توقف
                </BaseButton>

                <BaseButton
                  v-if="campaign.status === 'paused'"
                  size="sm"
                  color="success"
                  @click="handleResumeCampaign(campaign.id)"
                >
                  <Icon name="ph:play" class="ml-1 size-4" />
                  ادامه
                </BaseButton>

                <BaseButton
                  size="sm"
                  variant="outline"
                  :to="`/admin/campaigns/${campaign.id}/analytics`"
                >
                  <Icon name="ph:chart-line" class="ml-1 size-4" />
                  آنالیتیک
                </BaseButton>

                <BaseButton
                  v-if="campaign.status === 'draft'"
                  size="sm"
                  color="danger"
                  variant="outline"
                  @click="handleDeleteCampaign(campaign.id)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <BaseModal
      v-model="showCreateForm"
      title="ایجاد کمپین جدید"
      size="2xl"
    >
      <form @submit.prevent="handleCreateCampaign">
        <div class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 gap-4">
            <BaseInput
              v-model="formData.name"
              label="نام کمپین"
              placeholder="نام کمپین را وارد کنید"
              required
            />

            <BaseTextarea
              v-model="formData.description"
              label="توضیحات"
              placeholder="توضیحات کمپین را وارد کنید"
              rows="3"
            />
          </div>

          <!-- Target Groups -->
          <div>
            <label class="text-muted-700 dark:text-muted-300 mb-3 block text-sm font-medium">
              گروه‌های هدف
            </label>
            <div class="space-y-2">
              <div
                v-for="group in userGroups"
                :key="group.id"
                class="flex items-center space-x-2 space-x-reverse"
              >
                <BaseCheckbox
                  :model-value="formData.target_groups.includes(group.id)"
                  @update:model-value="(checked) => {
                    if (checked) {
                      formData.target_groups.push(group.id)
                    } else {
                      const index = formData.target_groups.indexOf(group.id)
                      if (index > -1) formData.target_groups.splice(index, 1)
                    }
                  }"
                />
                <span class="text-muted-700 dark:text-muted-300 text-sm">
                  {{ group.name }} ({{ group.user_count }} کاربر)
                </span>
              </div>
            </div>
          </div>

          <!-- Template Selection -->
          <BaseListbox
            v-model="formData.template_id"
            label="قالب پیام"
            placeholder="انتخاب قالب"
            :items="activeTemplates.map(t => ({ label: t.name, value: t.id }))"
            required
          />

          <!-- Schedule Settings -->
          <div class="space-y-4">
            <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
              زمان‌بندی
            </label>

            <BaseListbox
              v-model="formData.schedule.type"
              label="نوع زمان‌بندی"
              :items="scheduleTypeOptions"
            />

            <div v-if="formData.schedule.type === 'scheduled'" class="grid grid-cols-2 gap-4">
              <BaseInput
                v-model="formData.schedule.startDate"
                type="datetime-local"
                label="تاریخ شروع"
              />
              <BaseInput
                v-model="formData.schedule.endDate"
                type="datetime-local"
                label="تاریخ پایان (اختیاری)"
              />
            </div>

            <div v-if="formData.schedule.type === 'recurring'" class="grid grid-cols-2 gap-4">
              <BaseListbox
                v-model="formData.schedule.frequency"
                label="تکرار"
                :items="frequencyOptions"
              />
              <BaseInput
                v-model="formData.schedule.endDate"
                type="datetime-local"
                label="تاریخ پایان"
              />
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-8 flex justify-end gap-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="showCreateForm = false"
          >
            انصراف
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            :disabled="!canSubmit || isSaving"
            :loading="isSaving"
          >
            ایجاد کمپین
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>